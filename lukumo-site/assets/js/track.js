/* 計測の目印（data-track）を押したときの処理。
   計測サービスは有効にしていないため、今は何もしない。
   有効にする方法は docs/計測の手順.md を参照。 */
(function () {
  document.addEventListener('click', function (e) {
    var el = e.target.closest && e.target.closest('[data-track]');
    if (!el) return;
    var name = el.getAttribute('data-track') + '-' + (el.getAttribute('data-work') || '');
    // GoatCounter を有効にしたときだけ送る（無効の間は window.goatcounter が無いので何も起きない）
    if (window.goatcounter && typeof window.goatcounter.count === 'function') {
      window.goatcounter.count({ path: name, title: name, event: true });
    }
  });
})();
