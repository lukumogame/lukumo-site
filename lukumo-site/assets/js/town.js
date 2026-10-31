/* トップページの街を data/works.json から作る */
(function () {
  var town = document.getElementById('town');
  if (!town) return;
  // 確認用データは、手元（localhost）で ?demo=1 を付けたときだけ読み込む。公開先では表示しない
  var local = /^(localhost|127\.0\.0\.1)$/.test(location.hostname);
  var demo = local && /[?&]demo=1\b/.test(location.search);

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function getJSON(url) {
    return fetch(url, { cache: 'no-cache' }).then(function (r) {
      if (!r.ok) throw new Error(url + ' ' + r.status);
      return r.json();
    });
  }

  function lotHTML(w) {
    var coming = w.status === 'coming';
    var label = w.title + (coming ? '（準備中）' : '') + 'の作品ページへ';
    return '<li class="lot' + (coming ? ' is-coming' : '') + '">' +
      '<a class="lot-link" href="works/?id=' + encodeURIComponent(w.id) + (demo ? '&amp;demo=1' : '') + '"' +
      ' data-track="building" data-work="' + esc(w.id) + '" aria-label="' + esc(label) + '">' +
      '<span class="lot-art">' + LukumoBuildings.draw(w) + '</span>' +
      '<span class="nametag"><span class="nametag-dot" style="background:' + esc(w.accent) + '"></span>' + esc(w.nameTag) + '</span>' +
      (coming ? '<span class="badge">準備中</span>' : '') +
      '</a></li>';
  }

  function emptyHTML() {
    return '<li class="lot is-empty"><div class="lot-static">' +
      '<span class="lot-art">' + LukumoBuildings.emptyLot() + '</span>' +
      '<span class="nametag nametag-empty">次の建物を建設中</span>' +
      '</div></li>';
  }

  var jobs = [getJSON('data/works.json')];
  if (demo) jobs.push(getJSON('data/works.demo.json').catch(function () { return { works: [] }; }));

  Promise.all(jobs).then(function (res) {
    var data = res[0];
    var works = data.works.concat(res[1] ? res[1].works : []);
    var html = works.map(lotHTML).join('');
    for (var i = 0; i < (data.emptyLots || 0); i++) html += emptyHTML();
    town.innerHTML = html;
    town.setAttribute('aria-busy', 'false');
  }).catch(function () {
    town.innerHTML = '<li class="town-error">街の読み込みに失敗しました。時間をおいて、もう一度開いてください。</li>';
  });
})();
