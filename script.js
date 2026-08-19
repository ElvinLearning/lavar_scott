/* ============================================================
   LAVAR SCOTT / 45 — shared script
   Every feature here is progressive enhancement: each page's
   HTML is complete and usable with this file absent, blocked,
   or failing partway through. Nothing in here is required to
   read content, use navigation, or send an enquiry.
============================================================ */
(function(){
  'use strict';

  var reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasIO = 'IntersectionObserver' in window;

  /* Only turn on the CSS motion hooks (.rv fade-ins, marquee
     scroll, drag-tree pulse, nav hide-on-scroll) once we know
     the browser supports the observer this relies on and the
     visitor hasn't asked for reduced motion. */
  if (hasIO && !reduced){
    document.documentElement.classList.add('js-anim');
  }

  /* ---------- NAV: burger + mobile menu ---------- */
  var burger = document.getElementById('burger');
  var mmenu = document.getElementById('mmenu');
  if (burger && mmenu){
    burger.addEventListener('click', function(){
      var open = burger.getAttribute('aria-expanded') === 'true';
      burger.setAttribute('aria-expanded', String(!open));
      mmenu.classList.toggle('open', !open);
    });
    mmenu.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click', function(){
        burger.setAttribute('aria-expanded', 'false');
        mmenu.classList.remove('open');
      });
    });
    document.addEventListener('keydown', function(e){
      if (e.key === 'Escape' && mmenu.classList.contains('open')){
        burger.setAttribute('aria-expanded', 'false');
        mmenu.classList.remove('open');
        burger.focus();
      }
    });
  }

  /* ---------- NAV: hide on scroll down, show on scroll up ---------- */
  var nav = document.getElementById('nav');
  if (nav){
    var lastY = 0;
    addEventListener('scroll', function(){
      var y = scrollY;
      var menuOpen = mmenu && mmenu.classList.contains('open');
      nav.classList.toggle('hide', y > lastY && y > 140 && !menuOpen);
      lastY = y;
    }, {passive:true});
  }

  /* ---------- REVEAL ON SCROLL ---------- */
  if (hasIO && !reduced){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(en){
        if (en.isIntersecting){ en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, {threshold:.15});
    document.querySelectorAll('.rv').forEach(function(el){ io.observe(el); });
  }

  /* ---------- DRAG-TREE LOAD SEQUENCE (hero) ---------- */
  var bulbs = document.querySelectorAll('.bulb');
  if (bulbs.length){
    if (reduced){
      bulbs.forEach(function(b){ b.classList.add('on-g'); });
    } else {
      setTimeout(function(){ bulbs[0] && bulbs[0].classList.add('on-a'); }, 300);
      setTimeout(function(){ bulbs[1] && bulbs[1].classList.add('on-a'); }, 650);
      setTimeout(function(){ bulbs[2] && bulbs[2].classList.add('on-a'); }, 1000);
      setTimeout(function(){ bulbs[3] && bulbs[3].classList.add('on-g'); }, 1350);
    }
  }

  /* ---------- HERO POINTER PARALLAX (fine pointers only) ---------- */
  var ghost = document.getElementById('ghost45');
  var heroInner = document.getElementById('heroInner');
  var fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (ghost && heroInner && fine && !reduced){
    var px=0, py=0, tx=0, ty=0, raf=null;
    addEventListener('mousemove', function(e){
      tx = (e.clientX / innerWidth - .5);
      ty = (e.clientY / innerHeight - .5);
      if (!raf) raf = requestAnimationFrame(par);
    }, {passive:true});
    function par(){
      raf = null;
      px += (tx - px)*.08; py += (ty - py)*.08;
      ghost.style.transform = 'translateY(-50%) translate('+(px*-32)+'px,'+(py*-18)+'px)';
      heroInner.style.transform = 'translate('+(px*8)+'px,'+(py*5)+'px)';
      if (Math.abs(tx-px)>.001 || Math.abs(ty-py)>.001) raf = requestAnimationFrame(par);
    }
  }

  /* ---------- TIMELINE: drag-to-scroll + arrows ---------- */
  var tl = document.getElementById('tl');
  if (tl){
    var isDown=false, startX=0, startL=0;
    tl.addEventListener('pointerdown', function(e){
      if (e.pointerType !== 'mouse') return;
      isDown = true; startX = e.clientX; startL = tl.scrollLeft;
      tl.setPointerCapture(e.pointerId);
    });
    tl.addEventListener('pointermove', function(e){
      if (!isDown) return;
      tl.scrollLeft = startL - (e.clientX - startX);
    });
    ['pointerup','pointercancel'].forEach(function(ev){
      tl.addEventListener(ev, function(){ isDown=false; });
    });
    function tlStep(){ var c = tl.querySelector('.tcard'); return c ? c.getBoundingClientRect().width + 14 : 300; }
    var tlNext = document.getElementById('tlNext');
    var tlPrev = document.getElementById('tlPrev');
    if (tlNext) tlNext.addEventListener('click', function(){ tl.scrollBy({left:tlStep(), behavior: reduced ? 'auto' : 'smooth'}); });
    if (tlPrev) tlPrev.addEventListener('click', function(){ tl.scrollBy({left:-tlStep(), behavior: reduced ? 'auto' : 'smooth'}); });
  }

  /* ============================================================
     RACE CALENDAR — data + renderer, used on schedule.html.
     RACES holds the 2026 O'Reilly Auto Parts Series schedule as
     published. The rendered list and the static <noscript> table
     in schedule.html carry the same 25 rounds, so the schedule is
     readable either way; this just adds the auto-updating next
     race countdown and done/upcoming states for JS visitors.
  ============================================================ */
  var RACES = [
    {d:'2026-02-14', t:'Daytona',            n:'United Rentals 300'},
    {d:'2026-02-21', t:'Atlanta',            n:'EchoPark Speedway'},
    {d:'2026-02-28', t:'COTA',               n:'Austin road course'},
    {d:'2026-03-07', t:'Phoenix',            n:''},
    {d:'2026-03-14', t:'Las Vegas',          n:''},
    {d:'2026-03-21', t:'Darlington',         n:'', bg:'Sunoco debut'},
    {d:'2026-03-28', t:'Martinsville',       n:''},
    {d:'2026-04-04', t:'Rockingham',         n:'The Rock returns'},
    {d:'2026-04-11', t:'Bristol',            n:''},
    {d:'2026-04-18', t:'Kansas',             n:''},
    {d:'2026-04-25', t:'Talladega',          n:''},
    {d:'2026-05-02', t:'Texas',              n:"Andy's Frozen Custard 340"},
    {d:'2026-05-09', t:'Watkins Glen',       n:''},
    {d:'2026-05-16', t:'Dover',              n:''},
    {d:'2026-05-23', t:'Charlotte',          n:''},
    {d:'2026-05-30', t:'Nashville',          n:''},
    {d:'2026-06-13', t:'Pocono',             n:''},
    {d:'2026-06-20', t:'Coronado',           n:'San Diego street course', bg:'Street debut'},
    {d:'2026-06-27', t:'Sonoma',             n:''},
    {d:'2026-07-04', t:'Chicagoland',        n:'July 4th weekend'},
    {d:'2026-08-08', t:'Indianapolis',       n:''},
    {d:'2026-08-28', t:'Daytona',            n:'Summer night race'},
    {d:'2026-09-05', t:'Darlington',         n:'Chase opener', bg:'Chase'},
    {d:'2026-09-12', t:'Gateway / WWTR',     n:'Nu Way 225', bg:'Chase'},
    {d:'2026-11-07', t:'Homestead-Miami',    n:'Hard Rock Bet 300, finale', bg:'Championship'}
  ];

  function renderCalendar(){
    var list = document.getElementById('calList');
    if (!list) return;
    var now = new Date(); now.setHours(0,0,0,0);
    RACES.forEach(function(r){ r._dt = new Date(r.d + 'T12:00:00'); });
    var next = null;
    for (var i=0;i<RACES.length;i++){
      if (RACES[i]._dt >= now){ next = RACES[i]; break; }
    }
    var html = '';
    RACES.forEach(function(r, i){
      var cls = r._dt < now ? 'done' : (r === next ? 'live' : '');
      var dstr = r._dt.toLocaleDateString('en-US', {month:'short', day:'numeric'});
      html += '<div class="cal-row ' + cls + '">' +
        '<span class="no">' + String(i+1).padStart(2,'0') + '</span>' +
        '<span class="dt">' + dstr + '</span>' +
        '<span class="tk">' + r.t + (r.n ? ' <span style="font-weight:400;color:var(--paper-dim);font-size:.8rem">· ' + r.n + '</span>' : '') + '</span>' +
        (r === next ? '<span class="bg">● Next</span>' : (r.bg ? '<span class="bg">' + r.bg + '</span>' : '<span></span>')) +
        '</div>';
    });
    list.innerHTML = html;
    var nrTag = document.getElementById('nrTag');
    var nrTrack = document.getElementById('nrTrack');
    var nrDate = document.getElementById('nrDate');
    var nrDays = document.getElementById('nrDays');
    var nrLbl = document.getElementById('nrLbl');
    if (next){
      if (nrTrack) nrTrack.textContent = next.t;
      if (nrDate) nrDate.textContent =
        next._dt.toLocaleDateString('en-US', {weekday:'long', month:'long', day:'numeric', year:'numeric'}) +
        (next.n ? ', ' + next.n : '');
      var days = Math.round((new Date(next.d + 'T00:00:00') - now) / 864e5);
      if (nrDays) nrDays.textContent = days;
      if (nrLbl) nrLbl.textContent = days === 1 ? 'Day to green flag' : 'Days to green flag';
    } else {
      if (nrTag) nrTag.innerHTML = '<i></i>Season complete';
      if (nrTrack) nrTrack.textContent = 'See you in 2027';
      if (nrDate) nrDate.textContent = 'Championship run: February through November';
      if (nrDays) nrDays.textContent = '🏁';
      if (nrLbl) nrLbl.textContent = '25 rounds down';
    }
  }
  if (document.getElementById('calList')){
    renderCalendar();
    /* Optional live upgrade from NASCAR's public schedule feed.
       Any failure (offline, CORS, feed moved) is silently
       ignored and the verified list above stands as-is. */
    fetch('https://cf.nascar.com/cacher/2026/race_list_basic.json')
      .then(function(r){ return r.json(); })
      .then(function(data){
        var races = (data && (data.series_2 || (data.filter && data.filter(function(x){ return x.series_id === 2; })))) || null;
        if (!races || !races.length) return;
        var mapped = races.map(function(r){
          var d = (r.race_date || r.date_scheduled || '').slice(0,10);
          var t = (r.track_name || '').replace(/ (International )?(Motor )?(Speedway|Raceway|Superspeedway|Circuit)$/i,'');
          return d && t ? {d:d, t:t, n:r.race_name || ''} : null;
        }).filter(Boolean);
        if (mapped.length >= RACES.length){
          RACES = mapped;
          renderCalendar();
          var note = document.getElementById('calNote');
          if (note) note.textContent = note.textContent.replace('is the verified 2026 schedule', 'synced live from the NASCAR schedule feed');
        }
      })
      .catch(function(){ /* verified fallback list stands */ });
  }

  /* ============================================================
     PARTNER ENQUIRY — builds a mailto: link from the form fields
     and opens it. This never submits or stores anything; it only
     hands the visitor's email client a pre-filled message. The
     plain mailto fallback link lower on partner.html works
     identically with JS off.
  ============================================================ */
  var enquiryForm = document.getElementById('enquiryForm');
  if (enquiryForm){
    enquiryForm.addEventListener('submit', function(e){
      e.preventDefault();
      var name = (document.getElementById('enqName') || {}).value || '';
      var company = (document.getElementById('enqCompany') || {}).value || '';
      var interest = (document.getElementById('enqInterest') || {}).value || '';
      var message = (document.getElementById('enqMessage') || {}).value || '';
      var subject = 'Sponsorship enquiry: ' + (company || name || 'New contact');
      var bodyLines = [
        'Name: ' + name,
        'Company / brand: ' + company,
        'Interested in: ' + interest,
        '',
        message,
        '',
        '(Sent from the No. 45 partner enquiry page. This opens your email app; nothing is stored on this site.)'
      ];
      var mailto = 'mailto:contact@lavarscott.com'
        + '?subject=' + encodeURIComponent(subject)
        + '&body=' + encodeURIComponent(bodyLines.join('\n'));
      window.location.href = mailto;
    });
  }

  /* ---------- INSTAGRAM EMBED: mark success so the plain
     fallback link can be visually de-emphasized once the rich
     embed actually renders. The fallback link stays in the DOM
     and functional either way. ---------- */
  var embedWrap = document.querySelector('.embed-wrap');
  if (embedWrap){
    setTimeout(function(){
      var rendered = embedWrap.querySelector('iframe');
      if (rendered) embedWrap.classList.add('embed-ok');
    }, 3500);
  }
})();
