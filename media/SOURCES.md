# Video background sources

## Source

The site owner supplied the source links through a shared Drive document and
explicitly asked for the clean edits to be used as website backgrounds. All
five clips are public posts from `https://www.tiktok.com/@lavar.scott34/`,
the same official profile linked throughout the site. Original downloads are
kept outside the repository and are not committed.

## Transformations applied to every clip

Re-encoded from the original TikTok download to a web-weight background loop:

- H.264 High profile MP4, `yuv420p`
- 540 x 960 (native 9:16 export), 25 fps
- Audio track removed entirely (the site never plays sound from these clips)
- `moov` atom moved before `mdat` (fast-start, so playback can begin before
  the full file downloads)
- One representative frame exported per clip as an optimized JPEG poster,
  used as the `<video poster>` and the only image ever shown when a visitor
  has `prefers-reduced-motion: reduce`, has JavaScript disabled or blocked,
  or cannot play background media

Combined weight of all five MP4s and posters is approximately 9.9 MiB.

## Clips and final page mapping

| File | TikTok source | Title | Duration | Page | Why |
|---|---|---|---|---|---|
| `edits/edit-02.mp4` / `edit-02-poster.jpg` | https://www.tiktok.com/@lavar.scott34/video/7632698650111659277 | "WE WANT IT ALL" | 24.32s | Home (`index.html`) | Strongest current-season identity: No. 45 UAC/Alpha Prime livery, current cap and headphones, clearest current car footage. |
| `edits/edit-04.mp4` / `edit-04-poster.jpg` | https://www.tiktok.com/@lavar.scott34/video/7502826995563187502 | "Decent weekend at Kansas, another Top5" | 20.24s | On The Track (`track.html`) | Most track-specific sequence: garage close-up, suiting up, garage exit, high-speed race action. |
| `edits/edit-03.mp4` / `edit-03-poster.jpg` | https://www.tiktok.com/@lavar.scott34/video/7532663394571160846 | "Iowa week. LETS GET IT" | 20.20s | Off The Track (`offtrack.html`) | Strongest behind-the-scenes/human footage: Dover paddock walk, base layer and race suit, fan/paddock access. |
| `edits/edit-01.mp4` / `edit-01-poster.jpg` | https://www.tiktok.com/@lavar.scott34/video/7504095104592776490 | "Got the wing out" | 12.44s | Community (`community.html`) | Most human/social edit: candid, laughing garage moment alongside race action and a smiling driver portrait. |
| `edits/edit-05.mp4` / `edit-05-poster.jpg` | https://www.tiktok.com/@lavar.scott34/video/7528525362180017463 | "1st race of the double header weekend today on FS2 at 5 est! Starting 5th" | 14.96s | Partner (`partner.html`) | Clear driver identity plus repeated car visibility under race conditions for the sponsorship pitch. |

Contact-sheet review confirmed each clip's content matches its page and did
not surface a stronger alternative pairing, so the content-led mapping was
kept as-is.

Edits 3, 4 and 5 visibly contain the prior No. 6 ARCA car in places, not the
current No. 45. No page copy claims these are current-season race footage;
they are used purely as decorative, muted background motion behind text that
already carries the accurate 2026 No. 45 claims.

## Accessibility and performance treatment

- Every `<video>` is `muted`, `playsinline`, `loop`, `preload="none"`,
  carries no `controls`, and is marked `aria-hidden="true"` (with
  `tabindex="-1"`) alongside an `aria-hidden="true"` wrapper: the clip is
  decorative background only and is never required to understand or operate
  the page.
- Each `<video>` sets a `poster` and ships with `preload="none"`, so with
  script.js absent, blocked, or failing, or before it runs, the browser
  renders only the static poster frame and requests no video bytes.
- `script.js` only calls `.play()` once `IntersectionObserver` confirms the
  section holding the clip is in view, and only when
  `prefers-reduced-motion: reduce` is not set. Under reduced motion the
  clip's `src` is never requested and the poster is the only frame ever
  shown, satisfying the no-autoplay/no-loop requirement without a separate
  code path.
- The Home clip is marked `data-eager="true"` and starts as soon as
  script.js runs, without waiting for the observer's first callback,
  matching the brief's allowance for Home to load its clip earlier while
  every other page's clip only starts once its section is confirmed in (or
  near) view.
- Playback pauses via the same observer whenever a page's video section
  scrolls out of view, and a `visibilitychange` listener pauses every
  tracked clip whenever the browser tab is hidden, resuming only if the
  clip's section is still in view when the tab becomes visible again.
- Each page's `<video>` sits behind a page-specific `.bg-video__scrim`
  gradient (defined in `styles.css`) tuned so hero/section text and controls
  keep WCAG-compliant contrast over every frame, and `object-position` is
  set per page and per breakpoint (desktop, 860px, and short/landscape
  viewports) rather than relying on one global crop.
- Each page loads and can only ever request its own single clip; no page
  requests another page's video, and nothing here adds a TikTok embed,
  runtime source lookup, or tracking of any kind.
