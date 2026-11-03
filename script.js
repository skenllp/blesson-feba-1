(function () {
  'use strict';

  /* =====================================================================
     CONFIGURATION — edit this block only (see README.md)
     ===================================================================== */
  var CONFIG = {
    // Calendar month shown in "Save the Date" (month: 1 = January)
    year: 2027,
    month: 1,

    // Days marked on the calendar. "type" decides the colour:
    //   'matrimony' = rose, 'betrothal' = champagne gold
    events: [
      { day: 9,  type: 'betrothal', label: 'Betrothal' },
      { day: 11, type: 'matrimony', label: 'Holy Matrimony' }
    ],

    // Countdown target (all times are India Standard Time, Asia/Kolkata, UTC+05:30)
    countdown: {
      date: '2027-01-11',   // Holy Matrimony
      // CEREMONY TIME — NOT YET CONFIRMED.
      // While this is null the countdown is DAY-LEVEL ("69 DAYS TO GO"); no hours/minutes/seconds are shown.
      // Once the time is confirmed, set it in 24-hour format, e.g. '10:30' (10:30 AM) or '16:00' (4:00 PM),
      // and the full Days / Hours / Minutes / Seconds countdown switches on automatically.
      time: null
    }
  };
  /* ===================================================================== */

  var root = document.documentElement;
  var cover = document.getElementById('cover');
  var audio = document.getElementById('bg-music');
  var DAYNAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var MONTHNAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  var SHORT_DAY = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  var SHORT_MONTH = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  root.classList.add('locked');

  /* ---------- Calendar (weekdays are computed from the date, so the grid is always accurate) ---------- */
  var mIdx = CONFIG.month - 1;
  var startCol = new Date(CONFIG.year, mIdx, 1).getDay();          // weekday of the 1st (0 = Sunday)
  var daysInMonth = new Date(CONFIG.year, mIdx + 1, 0).getDate();
  function pad(n) { return String(n).padStart(2, '0'); }
  function weekdayOf(day) { return (startCol + day - 1) % 7; }

  document.querySelectorAll('[data-cal]').forEach(function (grid) {
    var byDay = {}, marked = {};
    CONFIG.events.forEach(function (ev) { byDay[ev.day] = ev; marked[weekdayOf(ev.day)] = true; });
    var html = '';
    SHORT_DAY.forEach(function (d, i) {
      html += '<span class="dow' + (marked[i] ? ' mark' : '') + '">' + d + '</span>';
    });
    for (var i = 0; i < startCol; i++) html += '<span aria-hidden="true"></span>';
    for (var day = 1; day <= daysInMonth; day++) {
      var ev = byDay[day];
      html += ev
        ? '<span class="hit' + (ev.type === 'betrothal' ? ' bet' : '') + '" aria-label="' + DAYNAMES[weekdayOf(day)] + ', ' + MONTHNAMES[mIdx] + ' ' + day + ', ' + CONFIG.year + ' - ' + ev.label + '">' + day + '</span>'
        : '<span>' + day + '</span>';
    }
    grid.innerHTML = html;
  });

  document.querySelectorAll('[data-legend]').forEach(function (ul) {
    ul.innerHTML = CONFIG.events.slice().sort(function (a, b) { return a.day - b.day; }).map(function (ev) {
      var wd = DAYNAMES[weekdayOf(ev.day)].slice(0, 3);
      return '<li><i' + (ev.type === 'betrothal' ? ' class="bet"' : '') + ' aria-hidden="true"></i><span>' + ev.label + ' &middot; ' + wd + ', ' + pad(ev.day) + ' ' + SHORT_MONTH[mIdx] + '</span></li>';
    }).join('');
  });

  /* ---------- Music: one audio element, started only by the Open tap, never restarted ---------- */
  var ctl = document.getElementById('musicCtl');
  var playBtn = document.getElementById('playBtn');
  audio.volume = 0.4;
  function sync() {
    playBtn.classList.toggle('off', audio.paused);
    playBtn.setAttribute('aria-label', audio.paused ? 'Play music' : 'Pause music');
  }
  function play() {
    if (!audio.paused) return;
    var p = audio.play();
    if (p && p.catch) p.catch(function () { sync(); });
  }
  playBtn.addEventListener('click', function () { if (audio.paused) play(); else audio.pause(); sync(); });
  ['play', 'pause'].forEach(function (ev) { audio.addEventListener(ev, sync); });
  sync();                                    // music is NOT started here: it begins when the visitor taps the invitation

  /* ---------- Opening: ribbon video plays, then the cover opens to reveal the page ---------- */
  var video = document.getElementById('coverVideo');
  var hint = document.getElementById('coverHint');
  var photoBox = document.getElementById('coverPhoto');
  var photoImg = document.getElementById('coverPhotoImg');
  var VW = 720, VH = 1280;                          // video size
  var FINISH_AT = 6.6;                              // seconds: the card has fully opened onto the photo; fade into the page here
  var photoRatio = 1;                               // natural width / height of img/opening-photo.jpg, once loaded

  function layout() {
    var vw = window.innerWidth, vh = window.innerHeight;
    var narrow = vw / vh <= 0.7;
    var s = narrow ? Math.max(vw / VW, vh / VH) : vh / VH;
    var left = (vw - VW * s) / 2, top = (vh - VH * s) / 2;
    video.style.width = VW * s + 'px'; video.style.height = VH * s + 'px';
    video.style.left = left + 'px'; video.style.top = top + 'px';
    // keep the hint on the blank part of the card, just below the bow, at any screen shape
    hint.style.top = (top + VH * s * 0.765) + 'px';
    // opening photograph: the blank area of the card above the bow (video px: x 118-602, y 178-478)
    var bx = left + 118 * s, by = top + 178 * s, bw = 484 * s, bh = 300 * s;
    photoBox.style.left = bx + 'px'; photoBox.style.top = by + 'px';
    photoBox.style.width = bw + 'px'; photoBox.style.height = bh + 'px';
    var pad = 14;                                    // frame padding + border
    var iw = bw - pad, ih = bh - pad;
    var r = Math.min(1.8, Math.max(0.62, photoRatio));   // natural proportions, within sensible limits
    var w, h;
    if (r > iw / ih) { w = iw; h = iw / r; } else { h = ih; w = ih * r; }
    photoImg.style.width = (w + pad) + 'px'; photoImg.style.height = (h + pad) + 'px';
  }
  layout();
  window.addEventListener('resize', layout);

  // show the opening photograph only once a real picture has replaced the 1x1 placeholder
  function checkPhoto() {
    if (photoImg.naturalWidth > 16 && photoImg.naturalHeight > 16) {
      photoRatio = photoImg.naturalWidth / photoImg.naturalHeight;
      photoBox.hidden = false;
      layout();
    }
  }
  if (photoImg.complete) checkPhoto(); else photoImg.addEventListener('load', checkPhoto, { once: true });

  var opened = false, finished = false;
  function finish() {
    if (finished) return;
    finished = true;
    try { video.pause(); } catch (e) {}       // freeze on the last frame: no restart or poster flash during the fade
    root.classList.remove('locked');
    ctl.hidden = false;
    window.scrollTo(0, 0);
    cover.classList.add('fade');              // video zooms in slightly and fades out
    setTimeout(function () { cover.classList.add('gone'); }, 1100);
  }
  function openInvite() {
    if (opened) return;
    opened = true;
    video.muted = true;                       // the song plays instead of any clip audio
    try { audio.currentTime = 0; } catch (e) {}   // song begins exactly with the video
    play();                                   // the tap is a user gesture: music starts with the ribbon
    hint.classList.add('hide');
    photoBox.classList.add('hide');           // the photograph fades away as the ribbon begins to move
    video.loop = false;
    video.addEventListener('playing', function () { video.removeAttribute('poster'); }, { once: true });
    var p = video.play();
    if (p && p.catch) p.catch(finish);
    // the clip ends on the hero photograph: fade out once the card has fully opened
    var watch = setInterval(function () {
      var end = (video.duration && isFinite(video.duration)) ? Math.min(video.duration - 0.12, FINISH_AT) : FINISH_AT;
      if (video.currentTime >= end || finished) { clearInterval(watch); finish(); }
    }, 40);
    video.addEventListener('ended', finish, { once: true });
    video.addEventListener('error', finish, { once: true });
    setTimeout(finish, 9000);                  // safety net
  }
  cover.addEventListener('pointerup', openInvite);   // fires as soon as the finger lifts, so the song starts with no extra delay
  cover.addEventListener('click', openInvite);
  cover.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openInvite(); }
  });

  /* ---------- Countdown (India Standard Time, Asia/Kolkata = UTC+05:30, no daylight saving) ---------- */
  var IST = 19800000;                          // 5h30m in ms
  var cdParts = CONFIG.countdown.date.split('-');
  var targetDay = Date.UTC(+cdParts[0], +cdParts[1] - 1, +cdParts[2]);   // calendar day, as a UTC midnight
  var timeKnown = !!CONFIG.countdown.time;
  var target = null;
  if (timeKnown) target = new Date(CONFIG.countdown.date + 'T' + CONFIG.countdown.time + ':00+05:30').getTime();

  var boxes = Array.prototype.map.call(document.querySelectorAll('[data-countdown]'), function (el) {
    el.classList.toggle('cd-day', !timeKnown);
    return { el: el, d: el.querySelector('[data-d]'), dl: el.querySelector('[data-dl]'), h: el.querySelector('[data-h]'), m: el.querySelector('[data-m]'), s: el.querySelector('[data-s]') };
  });
  function tick() {
    if (timeKnown) {
      var diff = Math.max(0, target - Date.now());
      var v = {
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000)
      };
      boxes.forEach(function (b) {
        b.d.textContent = pad(v.d); b.h.textContent = pad(v.h);
        b.m.textContent = pad(v.m); b.s.textContent = pad(v.s);
      });
    } else {
      var n = new Date(Date.now() + IST);       // "now" on the IST wall clock, read through the UTC getters
      var today = Date.UTC(n.getUTCFullYear(), n.getUTCMonth(), n.getUTCDate());
      var days = Math.round((targetDay - today) / 86400000);
      boxes.forEach(function (b) {
        b.el.hidden = days < 0;                 // after the wedding day the countdown is simply hidden
        b.d.textContent = days === 0 ? 'Today' : pad(Math.max(0, days));
        b.dl.textContent = days === 0 ? 'IS THE DAY' : (days === 1 ? 'DAY TO GO' : 'DAYS TO GO');
      });
    }
  }
  tick();
  setInterval(tick, timeKnown ? 1000 : 60000);

  /* ---------- Scroll reveal ---------- */
  var items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -6% 0px' });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('in'); });
  }
})();
