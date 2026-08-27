# Parked content

Sections built and reviewed, then pulled from the live site. Kept here so
they can go back in without being rewritten. Nothing in this file is served;
it is reference only.

---

## From The Pit — "Latest reading."

**Status:** removed from `gallery.html` at the client's request, August 2026.
Built and verified working before removal.

**To restore:** paste the markup below into `gallery.html` between the photo
grid section and the Reach Out section. The `.news` and `.newscard` styles are
still in `styles.css`, so it will render correctly with no other change.

### Copy

> **From The Pit**
> ### Latest reading.
> Long-form pieces from the official site on where Lavar sits in the sport right now.

| Tag | Headline | Standfirst |
|---|---|---|
| Profile | Who Is Lavar Scott? Inside The Rise Of NASCAR's Next Generation Driver | The full path: grassroots quarter midgets, making history in micro sprints, Rev Racing, and the ARCA Menards run that earned the seat. |
| Feature | Lavar Scott Is Redefining What A Modern NASCAR Driver Looks Like | Performance comes first, but identity, purpose and influence come with it. On personal branding and representation in modern motorsports. |
| For partners | Why Brands Are Paying Attention: Being A NASCAR Sponsor In A New Era | How the sponsor role is changing, why representation and reach now sit alongside results, and what that means for a brand on the 45. |

Footer line: `More stories: lavarscott.com/news`

### Source links

- https://lavarscott.com/who-is-lavar-scott-inside-the-rise-of-nascars-next-generation-driver/
- https://lavarscott.com/lavar-scott-is-redefining-what-a-modern-nascar-driver-looks-like-on-and-off-the-track/
- https://lavarscott.com/why-brands-are-paying-attention-to-lavar-scott-being-a-nascar-sponsor-in-a-new-era/
- https://lavarscott.com/news/

### Markup

```html
<!-- ============================================================
     NEWS
     TO ADD: copy a .newscard block and fill in tag, headline,
     standfirst and href. Newest first.
============================================================ -->
<section class="section" style="background:var(--asphalt-2);border-top:1px solid var(--line);border-bottom:1px solid var(--line)" aria-labelledby="news-h">
  <div class="kicker rv">From The Pit</div>
  <h2 id="news-h" class="h-xl rv d1">Latest <em>reading.</em></h2>
  <p class="lede rv d2">Long-form pieces from the official site on where Lavar sits in the sport right now.</p>

  <div class="news rv d2">
    <a class="newscard" href="https://lavarscott.com/who-is-lavar-scott-inside-the-rise-of-nascars-next-generation-driver/" target="_blank" rel="noopener">
      <span class="tag">Profile</span>
      <h3>Who Is Lavar Scott? Inside The Rise Of NASCAR's Next Generation Driver</h3>
      <p>The full path: grassroots quarter midgets, making history in micro sprints, Rev Racing, and the ARCA Menards run that earned the seat.</p>
      <span class="go">Read on lavarscott.com &#8599;</span>
    </a>
    <a class="newscard" href="https://lavarscott.com/lavar-scott-is-redefining-what-a-modern-nascar-driver-looks-like-on-and-off-the-track/" target="_blank" rel="noopener">
      <span class="tag">Feature</span>
      <h3>Lavar Scott Is Redefining What A Modern NASCAR Driver Looks Like</h3>
      <p>Performance comes first, but identity, purpose and influence come with it. On personal branding and representation in modern motorsports.</p>
      <span class="go">Read on lavarscott.com &#8599;</span>
    </a>
    <a class="newscard" href="https://lavarscott.com/why-brands-are-paying-attention-to-lavar-scott-being-a-nascar-sponsor-in-a-new-era/" target="_blank" rel="noopener">
      <span class="tag">For partners</span>
      <h3>Why Brands Are Paying Attention: Being A NASCAR Sponsor In A New Era</h3>
      <p>How the sponsor role is changing, why representation and reach now sit alongside results, and what that means for a brand on the 45.</p>
      <span class="go">Read on lavarscott.com &#8599;</span>
    </a>
  </div>

  <p class="mono rv d2" style="color:var(--paper-dim);margin-top:20px">
    More stories:
    <a href="https://lavarscott.com/news/" target="_blank" rel="noopener" style="color:var(--amber);text-decoration:underline;text-underline-offset:.18em">lavarscott.com/news &#8599;</a>
  </p>
</section>
```
