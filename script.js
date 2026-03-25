(function () {
  'use strict';

  //
  //         /\_/\
  //    ____/ o o \
  //  /~____  =Y= /
  // (______)__m_m)
  //

  var d = 'josh.tf';

  var el = document.getElementById('email');
  var u1 = 'me';
  var link = document.createElement('a');
  link.href = 'mai' + 'lto:' + u1 + '@' + d;
  link.textContent = u1 + ' @ ' + d;
  el.appendChild(link);

  var labsEl = document.getElementById('labs-email');
  var u2 = 'labs';
  var labsLink = document.createElement('a');
  labsLink.href = 'mai' + 'lto:' + u2 + '@' + d;
  labsLink.textContent = u2 + '@' + d;
  labsEl.appendChild(labsLink);

  // Overlay helper
  function setupOverlay(openId, closeId, overlayId) {
    var ol = document.getElementById(overlayId);
    document.getElementById(openId).addEventListener('click', function () {
      ol.classList.add('active');
    });
    document.getElementById(closeId).addEventListener('click', function () {
      ol.classList.remove('active');
    });
    ol.addEventListener('click', function (e) {
      if (e.target === ol) ol.classList.remove('active');
    });
  }

  setupOverlay('labs-open', 'labs-close', 'labs-overlay');
  setupOverlay('projects-open', 'projects-close', 'projects-overlay');

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      document.querySelectorAll('.overlay.active').forEach(function (ol) {
        ol.classList.remove('active');
      });
    }
  });

  // Lambda hold-to-activate (1.5s)
  var btn = document.getElementById('mesh-btn');
  var glow = document.getElementById('lambda-glow');
  var ring = document.getElementById('ring-circle');
  var timer = null;

  function startCharge(e) {
    e.preventDefault();
    btn.classList.add('active');
    glow.classList.add('charging');
    ring.classList.add('charging');
    timer = setTimeout(function () {
      window.open('https://mesh.josh.tf', '_blank');
      resetCharge();
    }, 1500);
  }

  function resetCharge() {
    clearTimeout(timer);
    timer = null;
    btn.classList.remove('active');
    glow.classList.remove('charging');
    ring.classList.remove('charging');
  }

  btn.addEventListener('mousedown', startCharge);
  document.addEventListener('mouseup', resetCharge);
  btn.addEventListener('touchstart', startCharge, { passive: false });
  document.addEventListener('touchend', resetCharge);
  document.addEventListener('touchcancel', resetCharge);
})();
