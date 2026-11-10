/* 作品ページ：works/?id=作品ID の作品を data/works.json から表示する */
(function () {
  var box = document.getElementById('work');
  var more = document.getElementById('work-more');
  var params = new URLSearchParams(location.search);
  var id = params.get('id') || '';
  // 確認用データは、手元（localhost）で ?demo=1 を付けたときだけ読み込む
  var local = /^(localhost|127\.0\.0\.1)$/.test(location.hostname);
  var demo = local && params.get('demo') === '1';

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function getJSON(url) {
    return fetch(url, { cache: 'no-cache' }).then(function (r) {
      if (!r.ok) throw new Error(url);
      return r.json();
    });
  }
  function notFound() {
    document.title = '作品が見つかりません｜Lukumo';
    box.innerHTML = '<h1>この建物は見つかりませんでした</h1>' +
      '<p>住所が変わったか、まだ建っていない建物かもしれません。</p>' +
      '<p><a class="btn" href="../">街へもどる</a></p>';
  }

  function render(w) {
    var coming = w.status === 'coming';
    var prototype = w.status === 'prototype'; // 試作版：遊べるが完成品ではない
    document.title = w.title + '｜Lukumo';
    var desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute('content', w.description);

    var actions = '';
    if (!coming && w.playUrl) {
      actions += '<a class="btn" href="' + esc(w.playUrl) + '" target="_blank" rel="noopener" data-track="play" data-work="' + esc(w.id) + '">遊ぶ</a>';
    }
    if (w.lpUrl) {
      actions += '<a class="btn btn-outline" href="' + esc(w.lpUrl) + '" target="_blank" rel="noopener">紹介ページ</a>';
      // 共有するURLは、このページではなく作品の紹介ページ（lpUrl）にする
      actions += '<a class="btn btn-outline" href="https://x.com/intent/post?url=' + encodeURIComponent(w.lpUrl) +
        '&text=' + encodeURIComponent(w.title) + '" target="_blank" rel="noopener">Xで共有</a>';
    }

    box.innerHTML =
      '<div class="work-hero">' +
        '<div class="work-art">' + LukumoBuildings.draw(w) + '</div>' +
        '<div>' +
          '<span class="status">' + (coming ? '準備中' : prototype ? '試作版を公開中' : '公開中') + '</span>' +
          '<h1>' + esc(w.title) + '</h1>' +
          '<p class="work-desc">' + esc(w.description) + '</p>' +
          '<dl class="facts">' +
            '<dt>遊ぶ時間</dt><dd>' + esc(w.playTime) + '</dd>' +
            '<dt>対応端末</dt><dd>' + esc(w.devices) + '</dd>' +
            '<dt>作</dt><dd>Lukumo</dd>' +
          '</dl>' +
          (coming ? '<p class="notice">この建物は工事中です。完成したら、ここから遊べるようになります。</p>' : '') +
          (prototype ? '<p class="notice">この作品は試作版です。今遊べるのは一部だけで、これから作り足していきます。</p>' : '') +
          (actions ? '<div class="actions">' + actions + '</div>' : '') +
        '</div>' +
      '</div>';

    var html = '';
    var shots = w.screenshots || [];
    if (shots.length) {
      html += '<section class="card" aria-labelledby="shots-title"><h2 id="shots-title">画面写真</h2><ul class="shots" id="shots">' +
        shots.map(function (s, i) {
          return '<li><img src="../' + esc(s.src) + '" alt="' + esc(s.alt) + '"' + (i ? ' loading="lazy"' : '') + ' decoding="async"></li>';
        }).join('') + '</ul></section>';
    }
    html += '<section class="card" aria-labelledby="voice-title"><h2 id="voice-title">感想をお寄せください</h2>' +
      '<p>遊んだ感想は、Xの @lukumo_games へ送ってください。</p>' +
      '<a class="btn" href="https://x.com/lukumo_games" target="_blank" rel="noopener">Xで送る</a></section>';
    more.innerHTML = html;

    // 横長の画面写真は1〜2列、縦長は2〜4列で並べる
    var list = document.getElementById('shots');
    var first = list && list.querySelector('img');
    if (first) {
      var fit = function () { if (first.naturalWidth > first.naturalHeight) list.classList.add('is-wide'); };
      if (first.complete) fit(); else first.addEventListener('load', fit);
    }
  }

  var jobs = [getJSON('../data/works.json')];
  if (demo) jobs.push(getJSON('../data/works.demo.json').catch(function () { return { works: [] }; }));
  Promise.all(jobs).then(function (res) {
    var all = res[0].works.concat(res[1] ? res[1].works : []);
    var w = all.filter(function (x) { return x.id === id; })[0];
    if (w) render(w); else notFound();
  }).catch(notFound);
})();
