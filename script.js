/* ============================================================
   LAVAR SCOTT / 45 — shared script
   Every feature here is progressive enhancement: each page's
   HTML is complete and usable with this file absent, blocked,
   or failing partway through. Nothing in here is required to
   read content, use navigation, or send an enquiry.
============================================================ */
(function(){
  'use strict';

  /* Marks JS as available so the mobile menu can switch from its
     no-JS in-flow fallback to a JS-controlled fixed disclosure.
     Intentionally independent of the reduced-motion / IO check
     below, so the menu still opens and closes for every visitor
     whose browser runs this script, motion preference aside. */
  document.documentElement.classList.add('js');

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
     RACE CALENDAR — enhancer for the static rows in schedule.html,
     which is the single source of truth for the verified 2026
     O'Reilly Auto Parts Series schedule (33 rounds). This reads
     each .cal-row's data-date/data-track/data-note attributes and
     only ever touches classList/textContent on the existing rows;
     it never fetches a schedule, rebuilds the list with innerHTML,
     or keeps a second copy of the data.
  ============================================================ */
  function renderCalendar(){
    var list = document.getElementById('calList');
    if (!list) return;
    var rows = Array.prototype.slice.call(list.querySelectorAll('.cal-row'));
    if (!rows.length) return;
    var now = new Date(); now.setHours(0,0,0,0);
    var next = null;
    rows.forEach(function(row){
      var d = row.getAttribute('data-date');
      row.classList.remove('done', 'live');
      if (!d) return;
      var dt = new Date(d + 'T12:00:00');
      if (dt < now){
        row.classList.add('done');
      } else if (!next){
        next = row;
        row.classList.add('live');
      }
    });
    rows.forEach(function(row){
      var badge = row.children[3];
      if (!badge) return;
      if (row === next){
        badge.className = 'bg';
        badge.textContent = '● Next';
      } else {
        var bg = row.getAttribute('data-bg') || '';
        badge.className = bg ? 'bg' : '';
        badge.textContent = bg;
      }
    });
    var nrTagText = document.getElementById('nrTagText');
    var nrTrack = document.getElementById('nrTrack');
    var nrDate = document.getElementById('nrDate');
    var nrDays = document.getElementById('nrDays');
    var nrLbl = document.getElementById('nrLbl');
    if (next){
      var nextDate = next.getAttribute('data-date');
      var nextDt = new Date(nextDate + 'T12:00:00');
      var track = next.getAttribute('data-track') || '';
      var note = next.getAttribute('data-note') || '';
      if (nrTrack) nrTrack.textContent = track;
      if (nrDate) nrDate.textContent =
        nextDt.toLocaleDateString('en-US', {weekday:'long', month:'long', day:'numeric', year:'numeric'}) +
        (note ? ', ' + note : '');
      var days = Math.round((new Date(nextDate + 'T00:00:00') - now) / 864e5);
      if (nrDays) nrDays.textContent = days;
      if (nrLbl) nrLbl.textContent = days === 1 ? 'Day to green flag' : 'Days to green flag';
    } else {
      if (nrTagText) nrTagText.textContent = 'Season complete';
      if (nrTrack) nrTrack.textContent = 'See you in 2027';
      if (nrDate) nrDate.textContent = 'Championship run: February through November';
      if (nrDays) nrDays.textContent = '🏁';
      if (nrLbl) nrLbl.textContent = '33 rounds down';
    }
  }
  if (document.getElementById('calList')) renderCalendar();

  /* ============================================================
     PARTNER ENQUIRY — builds a mailto: link from the field values
     and opens it when the compose button is clicked. The fields
     live in a plain container, not a <form>, so there is nothing
     for a browser to natively submit if this script never runs;
     the plain mailto fallback link lower on partner.html works
     identically with JS off.
  ============================================================ */
  var enquiryCompose = document.getElementById('enqCompose');
  if (enquiryCompose){
    enquiryCompose.addEventListener('click', function(){
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

  /* ---------- INSTAGRAM EMBED: give Instagram's generated iframe
     an accessible name and mark success. The plain fallback link
     stays in the DOM and functional either way. ---------- */
  var embedWrap = document.querySelector('.embed-wrap');
  if (embedWrap){
    function labelInstagramEmbed(){
      var rendered = embedWrap.querySelector('iframe');
      if (!rendered) return false;
      if (!rendered.getAttribute('title')) rendered.setAttribute('title', 'Lavar Scott Instagram post');
      embedWrap.classList.add('embed-ok');
      return true;
    }
    if (!labelInstagramEmbed() && 'MutationObserver' in window){
      var embedObserver = new MutationObserver(function(){
        if (labelInstagramEmbed()) embedObserver.disconnect();
      });
      embedObserver.observe(embedWrap, {childList:true, subtree:true});
      setTimeout(function(){ embedObserver.disconnect(); }, 10000);
    }
  }
})();
