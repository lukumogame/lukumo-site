/* 建物のSVGを作る。色は 濃紺・白・空色・作品の差し色 だけを使う */
(function () {
  var NAVY = '#1d2b3a', WHITE = '#ffffff', SKY = '#e3f2fb';
  var S = 'stroke="' + NAVY + '" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"';

  function ground() {
    return '<ellipse cx="80" cy="132" rx="70" ry="8" fill="' + SKY + '"/>';
  }

  // お店（三角屋根・看板・日よけ）
  function shop(a) {
    var scallop = '';
    for (var i = 0; i < 6; i++) {
      var x = 34 + i * 15.33;
      scallop += 'M' + x + ' 88 a7.66 7.66 0 0 0 15.33 0 ';
    }
    return ground() +
      '<rect x="30" y="58" width="100" height="72" rx="6" fill="' + WHITE + '" ' + S + '/>' +
      '<path d="M20 62 L80 20 L140 62 Z" fill="' + NAVY + '" ' + S + '/>' +
      '<rect x="46" y="64" width="68" height="14" rx="4" fill="' + a + '"/>' +
      '<path d="M34 80 H126 V88 H34 Z" fill="' + a + '"/>' +
      '<path d="' + scallop + '" fill="' + a + '"/>' +
      '<rect x="40" y="102" width="22" height="16" rx="3" fill="' + SKY + '" ' + S + '/>' +
      '<rect x="98" y="102" width="22" height="16" rx="3" fill="' + SKY + '" ' + S + '/>' +
      '<rect x="70" y="100" width="20" height="30" rx="3" fill="' + SKY + '" ' + S + '/>';
  }

  // 屋台（屋根・のれん・カウンター・虫めがね）
  function stall(a) {
    var noren = '';
    for (var i = 0; i < 4; i++) {
      noren += '<rect x="' + (41 + i * 20) + '" y="55" width="17" height="24" rx="3" fill="' + a + '"/>';
    }
    return ground() +
      '<rect x="34" y="46" width="6" height="84" rx="3" fill="' + NAVY + '"/>' +
      '<rect x="120" y="46" width="6" height="84" rx="3" fill="' + NAVY + '"/>' +
      '<path d="M22 50 L44 30 H116 L138 50 Z" fill="' + NAVY + '" ' + S + '/>' +
      noren +
      '<rect x="26" y="96" width="108" height="34" rx="5" fill="' + WHITE + '" ' + S + '/>' +
      '<line x1="30" y1="108" x2="130" y2="108" stroke="' + NAVY + '" stroke-width="2" opacity=".35"/>' +
      '<circle cx="106" cy="86" r="7" fill="' + WHITE + '" ' + S + '/>' +
      '<line x1="111" y1="91" x2="117" y2="96" ' + S + '/>' +
      '<rect x="140" y="56" width="10" height="44" rx="3" fill="' + a + '"/>' +
      '<rect x="143" y="52" width="4" height="78" rx="2" fill="' + NAVY + '"/>';
  }

  // 汎用の家（屋根の旗に差し色）
  function house(a) {
    return ground() +
      '<rect x="36" y="62" width="88" height="68" rx="6" fill="' + WHITE + '" ' + S + '/>' +
      '<path d="M26 66 L80 26 L134 66 Z" fill="' + NAVY + '" ' + S + '/>' +
      '<line x1="80" y1="26" x2="80" y2="8" ' + S + '/>' +
      '<path d="M82 9 H100 L94 15 L100 21 H82 Z" fill="' + a + '"/>' +
      '<rect x="48" y="80" width="22" height="18" rx="3" fill="' + SKY + '" ' + S + '/>' +
      '<rect x="90" y="96" width="20" height="34" rx="3" fill="' + SKY + '" ' + S + '/>';
  }

  // 工事中（足場と幕）
  function construction(a) {
    var d = 'stroke="' + NAVY + '" stroke-width="2.5" stroke-linecap="round"';
    return ground() +
      '<rect x="36" y="56" width="88" height="74" rx="6" fill="' + SKY + '" stroke="' + NAVY + '" stroke-width="2.5" stroke-dasharray="6 5"/>' +
      '<line x1="30" y1="44" x2="30" y2="130" ' + d + '/><line x1="80" y1="44" x2="80" y2="130" ' + d + '/><line x1="130" y1="44" x2="130" y2="130" ' + d + '/>' +
      '<line x1="26" y1="70" x2="134" y2="70" ' + d + '/><line x1="26" y1="100" x2="134" y2="100" ' + d + '/>' +
      '<line x1="30" y1="70" x2="80" y2="100" ' + d + ' opacity=".5"/><line x1="80" y1="70" x2="130" y2="100" ' + d + ' opacity=".5"/>' +
      '<rect x="44" y="104" width="72" height="22" rx="4" fill="' + WHITE + '" ' + S + '/>' +
      '<rect x="52" y="112" width="56" height="6" rx="3" fill="' + a + '"/>' +
      '<line x1="118" y1="44" x2="118" y2="14" ' + S + '/><line x1="96" y1="16" x2="146" y2="16" ' + S + '/>' +
      '<line x1="104" y1="16" x2="104" y2="34" stroke="' + NAVY + '" stroke-width="2"/>';
  }

  // 建設予定地（杭とロープ）
  function emptyLot() {
    var d = 'stroke="' + NAVY + '" stroke-width="3" stroke-linecap="round"';
    return ground() +
      '<rect x="34" y="96" width="5" height="34" rx="2" fill="' + NAVY + '"/>' +
      '<rect x="78" y="96" width="5" height="34" rx="2" fill="' + NAVY + '"/>' +
      '<rect x="122" y="96" width="5" height="34" rx="2" fill="' + NAVY + '"/>' +
      '<path d="M37 100 Q58 110 80 100 Q102 110 124 100" fill="none" stroke="' + NAVY + '" stroke-width="2" stroke-dasharray="4 4"/>' +
      '<line x1="60" y1="70" x2="60" y2="128" ' + d + '/>' +
      '<rect x="44" y="56" width="32" height="20" rx="4" fill="' + WHITE + '" ' + S + '/>' +
      '<line x1="51" y1="64" x2="69" y2="64" stroke="' + NAVY + '" stroke-width="2" opacity=".4"/><line x1="51" y1="69" x2="64" y2="69" stroke="' + NAVY + '" stroke-width="2" opacity=".4"/>';
  }

  function svg(inner) {
    return '<svg viewBox="0 0 160 140" aria-hidden="true" focusable="false">' + inner + '</svg>';
  }

  window.LukumoBuildings = {
    draw: function (work) {
      if (work.status === 'coming') return svg(construction(work.accent));
      var f = { shop: shop, stall: stall, house: house }[work.building] || house;
      return svg(f(work.accent));
    },
    emptyLot: function () { return svg(emptyLot()); }
  };
})();
