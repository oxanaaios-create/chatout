/* Chatout embed: <script src="https://HOST/embed.js" async></script> + <chatout-pay sku="..." option="..."></chatout-pay> */
(function () {
  var me = document.currentScript; var origin = me ? new URL(me.src).origin : location.origin;
  if (customElements.get('chatout-pay')) return;
  customElements.define('chatout-pay', class extends HTMLElement {
    connectedCallback() {
      var sku = this.getAttribute('sku') || '', option = this.getAttribute('option') || '';
      var root = this.attachShadow({ mode: 'open' });
      root.innerHTML = '<style>button{all:unset;box-sizing:border-box;display:flex;align-items:center;justify-content:center;gap:6px;width:100%;min-width:220px;padding:13px 18px;border-radius:999px;background:#FFC439;color:#0B2A5B;font:700 15px/1 system-ui,sans-serif;cursor:pointer}button:hover{filter:brightness(.97)}i{font-style:italic;font-weight:800}small{display:block;margin-top:6px;font:400 11px/1.4 system-ui,sans-serif;color:#777;text-align:center}</style><button type="button">Pay with <i>PayPal</i><span class="p"></span></button><small>Checkout by Chatout · also available in AI chats</small>';
      var btn = root.querySelector('button');
      fetch(origin + '/api/catalog?sku=' + encodeURIComponent(sku)).then(function (r) { return r.json(); }).then(function (j) {
        var p = j.products && j.products[0]; if (p) root.querySelector('.p').textContent = ' · €' + p.price;
      }).catch(function () {});
      btn.addEventListener('click', function () {
        var url = origin + '/pay?sku=' + encodeURIComponent(sku) + '&option=' + encodeURIComponent(option);
        var w = window.open(url, 'chatout-pay', 'width=460,height=760');
        if (!w) location.href = url;
      });
    }
  });
})();
