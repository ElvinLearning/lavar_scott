# September client feedback implementation

Based on main commit `657be35`.

## Implemented

- Removed manufacturer names from public copy, metadata, and image descriptions. Current partner listings contain Sunoco and Urban Affairs Coalition only.
- Replaced the home marquee's “No Plan B” with “Let's Ride” and removed the free-over-the-air claim.
- Updated all navigation and the six home destination cards to Story, On The Track, Media, Gallery, Schedule, and Contact.
- Removed the exclusive count of Black national-series drivers, including the repeated count in the migrated press collection.
- Added Alpha Prime Racing & FoxxTecca to the 2025 national-debut copy.
- Removed the Free TV section and added Jusan Hamilton as Alpha Prime Racing President.
- Replaced Off The Track with Media and moved the existing “The press comes with it” collection there.
- Removed Community / On The Ground. Existing social profile links remain available on Contact and in the footer.
- Simplified Gallery to photography, with descriptive alt text and the existing lightbox controls preserved. Removed visible captions and introductory copy.
- Replaced Partner with Contact / “Let’s connect,” removing the sponsorship sales sections, pricing, chart, and form. Moved postal hero card/autograph instructions and official channels from Gallery to Contact.
- Removed the schedule's implementation-description sentence while retaining its next-race script.
- Added the official NASCAR 26 link on Home and Media: https://nascar26.com/. The official site showed the game released as of September 18, 2026, so buttons say “Get NASCAR 26” rather than preorder.
- Kept `offtrack.html`, `partner.html`, and `community.html` as noindex redirects with visible fallback links.

## Remaining inputs / review

- TDM logo and approved partnership/sponsorship contact details have not been supplied. Contact currently uses the existing `contact@lavarscott.com` address.
- Final inquiry paragraph is awaiting client wording. A short general contact sentence is used for now.
- Historical photography and existing background footage are unchanged and may visibly carry past manufacturer/sponsor marks. For a complete visual removal, replace or approve retouching of those assets; this change removes written references and sponsor placements only.
- Existing press titles and coverage summaries were moved from the original Partner page; article links were not supplied there and were not invented.

## Validation

- All 11 HTML pages checked for balanced tags, duplicate IDs, one H1 per page, and image alt text.
- All 167 local link and asset references resolve; fragment targets exist.
- The seven current site pages have consistent desktop/mobile navigation and no links back to retired pages.
- Checked requested text removals, two-partner home grid, six destination cards, six gallery photographs, hero-card instructions, Jusan Hamilton, FoxxTecca, and official game links.
- `node --check script.js` and `git diff --check` passed.
- Browser preview could not open the local workspace URL (`ERR_BLOCKED_BY_CLIENT`). Desktop/mobile visual and interaction checks remain to be performed before publication.

This branch is for review. No production deployment or client email was sent.
