(function () {
  'use strict';

  //
  //         /\_/\
  //    ____/ o o \
  //  /~____  =Y= /
  // (______)__m_m)
  //

  var d = 'josh.tf';
  var u = 'me';

  var link = document.createElement('a');
  link.href = 'mai' + 'lto:' + u + '@' + d;
  link.textContent = u + ' @ ' + d;
  document.getElementById('email').appendChild(link);
})();
