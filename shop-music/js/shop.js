(function () {
  var P = window.SHOP_PRODUCTS || [];
  var CAT = { cat1: "카테고리 1", cat2: "카테고리 2", cat3: "카테고리 3" };
  // 구성 옵션: extra는 기본 가격에 더해지는 금액
  var OPTS = [
    { label: "기본 구성", extra: 0 },
    { label: "추가 구성", extra: 20000 }
  ];
  var CART_KEY = "sample-music-cart";
  var POPUP_KEY = "sample-music-popup-hide";
  var SHIPPING_FEE = 3000, FREE_SHIP_OVER = 30000;

  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function won(n) { return n.toLocaleString("ko-KR") + "원"; }
  function byId(id) { return P.filter(function (p) { return p.id === id; })[0]; }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" }[c]; }); }

  // 상품 이미지가 없을 때 쓰는 기본 이미지
  function placeholder(p, label) {
    var c = p.color || ["#eee", "#999"];
    var svg = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 400'>" +
      "<defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='" + c[0] + "'/><stop offset='1' stop-color='" + c[1] + "'/></linearGradient></defs>" +
      "<rect width='300' height='400' fill='url(#g)'/>" +
      "<text x='150' y='190' text-anchor='middle' font-family='sans-serif' font-size='18' fill='#fff' opacity='.95'>" + (label || p.name) + "</text>" +
      "</svg>";
    return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg).replace(/'/g, "%27");
  }
  function imgOf(p) { return p.image ? p.image : placeholder(p); }

  // ---------- 장바구니 (브라우저 localStorage, 실패해도 페이지는 동작) ----------
  function readCart() {
    try { var v = JSON.parse(localStorage.getItem(CART_KEY)); return Array.isArray(v) ? v : []; }
    catch (e) { return []; }
  }
  function writeCart(items) {
    try { localStorage.setItem(CART_KEY, JSON.stringify(items)); } catch (e) {}
  }
  function cartCount(items) { return items.reduce(function (n, i) { return n + i.qty; }, 0); }
  function updateBadge() {
    var n = cartCount(readCart());
    $$(".cart-count").forEach(function (el) { el.textContent = n; });
  }
  function addToCart(id, optIdx, qty) {
    var items = readCart();
    var hit = items.filter(function (i) { return i.id === id && i.opt === optIdx; })[0];
    if (hit) hit.qty += qty; else items.push({ id: id, opt: optIdx, qty: qty });
    writeCart(items);
    updateBadge();
  }
  function unitPrice(p, optIdx) { return (p.sale || p.price) + OPTS[optIdx].extra; }

  // ---------- 토스트 ----------
  function toast(msg) {
    var t = $("#toast"); if (!t) return;
    t.textContent = msg; t.classList.add("show");
    clearTimeout(t._t); t._t = setTimeout(function () { t.classList.remove("show"); }, 1800);
  }

  // ---------- 카드 ----------
  function card(p) {
    var badge = "";
    if (p.sale) badge = "<span class='badge sale'>" + (p.tag || "SALE") + "</span>";
    else if (p.tag) badge = "<span class='badge'>" + p.tag + "</span>";
    var price = p.sale
      ? "<s>" + won(p.price) + "</s><span class='sale-price'>" + won(p.sale) + "</span>"
      : "<b>" + won(p.price) + "</b>";
    return "<li><a class='card' href='product.html?id=" + p.id + "'>" +
      "<div class='thumb'>" + badge + "<img loading='lazy' alt='" + esc(p.name) + "' src='" + imgOf(p) + "'></div>" +
      "<p class='name'>" + esc(p.name) + "</p><p class='price'>" + price + "</p></a></li>";
  }

  // ---------- 배너 ----------
  function initBanner() {
    var root = $("#banner"); if (!root) return;
    var track = $(".banner-track", root);
    var slides = $$(".slide", root), dotsWrap = $(".dots", root), i = 0, timer;
    dotsWrap.innerHTML = slides.map(function (_, k) { return "<button aria-label='" + (k + 1) + "번 배너'></button>"; }).join("");
    var dots = $$("button", dotsWrap);
    function go(n) {
      i = (n + slides.length) % slides.length;
      track.style.transform = "translateX(-" + i * 100 + "%)";
      dots.forEach(function (d, k) { d.classList.toggle("on", k === i); });
    }
    dots.forEach(function (d, k) { d.addEventListener("click", function () { go(k); reset(); }); });
    var prev = $(".banner-nav.prev", root), next = $(".banner-nav.next", root);
    if (prev) prev.addEventListener("click", function () { go(i - 1); reset(); });
    if (next) next.addEventListener("click", function () { go(i + 1); reset(); });
    function reset() { clearInterval(timer); timer = setInterval(function () { go(i + 1); }, 4500); }
    go(0); reset();
  }

  // ---------- 메인 ----------
  function initMain() {
    var n = $("#new-list"); if (n) n.innerHTML = P.slice(0, 4).map(card).join("");
    var b = $("#best-list"); if (b) b.innerHTML = P.slice().sort(function (a, c) { return c.sold - a.sold; }).slice(0, 4).map(card).join("");
  }

  // ---------- 목록 ----------
  function initList() {
    var box = $("#product-list"); if (!box) return;
    var tabs = $("#cat-tabs"), sort = $("#sort"), count = $("#count");
    var cats = ["all"].concat(Object.keys(CAT));
    var init = new URLSearchParams(location.search).get("cat") || "all";
    if (cats.indexOf(init) < 0) init = "all";
    tabs.innerHTML = cats.map(function (k) {
      return "<button data-cat='" + k + "'" + (k === init ? " class='on'" : "") + ">" + (k === "all" ? "전체" : CAT[k]) + "</button>";
    }).join("");
    function render() {
      var cat = $(".tabs .on", tabs).getAttribute("data-cat");
      var list = P.filter(function (p) { return cat === "all" || p.category === cat; });
      var s = sort.value;
      list.sort(function (a, c) {
        if (s === "low") return (a.sale || a.price) - (c.sale || c.price);
        if (s === "high") return (c.sale || c.price) - (a.sale || a.price);
        return c.sold - a.sold;
      });
      count.textContent = "총 " + list.length + "개";
      box.innerHTML = list.length ? list.map(card).join("") : "<li class='empty'>해당 카테고리의 상품이 없습니다.</li>";
    }
    tabs.addEventListener("click", function (e) {
      var btn = e.target.closest("button"); if (!btn) return;
      $$("button", tabs).forEach(function (b) { b.classList.remove("on"); });
      btn.classList.add("on"); render();
    });
    sort.addEventListener("change", render);
    render();
  }

  // ---------- 상품 검색 팝업 ----------
  function initSearch() {
    var btn = $("#search-open"), modal = $("#search-modal"); if (!btn || !modal) return;
    var input = $("#search-input"), list = $("#search-list"), count = $("#search-count");
    function search() {
      var q = input.value.trim();
      var words = q.toLowerCase().split(/\s+/).filter(Boolean);
      var hit = words.length ? P.filter(function (p) {
        var hay = (p.name + " " + p.desc + " " + (CAT[p.category] || "")).toLowerCase();
        return words.every(function (w) { return hay.indexOf(w) >= 0; });
      }) : [];
      if (!q) { count.textContent = "검색어를 입력해 주세요."; list.innerHTML = ""; return; }
      count.textContent = "검색 결과 " + hit.length + "개";
      list.innerHTML = hit.length ? hit.map(function (p) {
        return "<li><a href='product.html?id=" + p.id + "'><img alt='' src='" + imgOf(p) + "'><span><b>" + esc(p.name) + "</b><small>" + won(p.sale || p.price) + "</small></span></a></li>";
      }).join("") : "<li class='empty'>\"" + esc(q) + "\"에 맞는 상품이 없습니다.</li>";
    }
    function open() { modal.hidden = false; setTimeout(function () { input.focus(); }, 0); }
    function close() { modal.hidden = true; }
    btn.addEventListener("click", open);
    $("#search-close").addEventListener("click", close);
    modal.addEventListener("click", function (e) { if (e.target === modal) close(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !modal.hidden) close(); });
    input.addEventListener("input", search);
    input.addEventListener("keydown", function (e) { if (e.key === "Enter") e.preventDefault(); });
  }

  // ---------- 상세 ----------
  function initDetail() {
    var root = $("#detail"); if (!root) return;
    var id = parseInt(new URLSearchParams(location.search).get("id"), 10);
    var p = byId(id) || P[0];
    document.title = p.name + " | SAMPLE SHOP";
    $("#crumb-cat").textContent = CAT[p.category];
    $("#crumb-cat").href = "list.html?cat=" + p.category;
    $("#crumb-name").textContent = p.name;
    $("#main-img").src = imgOf(p);
    $("#main-img").alt = p.name;
    $("#p-name").textContent = p.name;
    $("#p-desc").textContent = p.desc;
    $("#p-price").innerHTML = p.sale ? "<s>" + won(p.price) + "</s> <span class='sale-price'>" + won(p.sale) + "</span>" : won(p.price);
    $("#p-cat").textContent = CAT[p.category];
    $("#p-sold").textContent = p.sold.toLocaleString("ko-KR") + "개 구매";
    $("#intro-desc").textContent = p.desc;
    $("#spec-cat").textContent = CAT[p.category];
    $("#spec-id").textContent = "SAMPLE-" + String(p.id).padStart(4, "0");

    var opt = $("#opt"), qty = 1;
    opt.innerHTML = "<option value=''>[필수] 구성 선택</option>" + OPTS.map(function (o, k) {
      return "<option value='" + k + "'>" + o.label + (o.extra ? " (+" + o.extra.toLocaleString("ko-KR") + "원)" : "") + "</option>";
    }).join("");
    function selected() { return opt.value === "" ? -1 : parseInt(opt.value, 10); }
    function total() {
      var k = selected();
      var unit = k < 0 ? (p.sale || p.price) : unitPrice(p, k);
      $("#total").textContent = won(unit * qty);
      $("#qty").textContent = qty;
    }
    opt.addEventListener("change", total);
    $("#qty-minus").addEventListener("click", function () { if (qty > 1) { qty--; total(); } });
    $("#qty-plus").addEventListener("click", function () { qty++; total(); });
    total();

    $("#btn-cart").addEventListener("click", function () {
      var k = selected();
      if (k < 0) return toast("구성을 먼저 선택해 주세요.");
      addToCart(p.id, k, qty);
      toast(p.name + " " + qty + "개를 장바구니에 담았습니다.");
    });
    $("#btn-buy").addEventListener("click", function () {
      var k = selected();
      if (k < 0) return toast("구성을 먼저 선택해 주세요.");
      addToCart(p.id, k, qty);
      location.href = "cart.html";
    });

    var links = $$(".tabs-detail a");
    window.addEventListener("scroll", function () {
      var cur = links[0];
      links.forEach(function (a) { var s = $(a.getAttribute("href")); if (s && s.getBoundingClientRect().top < 140) cur = a; });
      links.forEach(function (a) { a.classList.toggle("on", a === cur); });
    }, { passive: true });

    var rel = P.filter(function (x) { return x.category === p.category && x.id !== p.id; }).slice(0, 4);
    if (!rel.length) rel = P.filter(function (x) { return x.id !== p.id; }).slice(0, 4);
    $("#related-list").innerHTML = rel.map(card).join("");
  }

  // ---------- 장바구니 페이지 ----------
  function initCart() {
    var box = $("#cart-items"); if (!box) return;
    function render() {
      var items = readCart().filter(function (i) { return byId(i.id) && OPTS[i.opt]; });
      writeCart(items); updateBadge();
      if (!items.length) {
        box.innerHTML = "<div class='empty'>장바구니가 비어 있습니다. <a href='list.html'>상품 보러 가기</a></div>";
        $("#cart-summary").hidden = true;
        return;
      }
      $("#cart-summary").hidden = false;
      var subtotal = 0;
      box.innerHTML = items.map(function (it, idx) {
        var p = byId(it.id), unit = unitPrice(p, it.opt), line = unit * it.qty;
        subtotal += line;
        return "<div class='cart-row'>" +
          "<a class='cart-thumb' href='product.html?id=" + p.id + "'><img alt='" + esc(p.name) + "' src='" + imgOf(p) + "'></a>" +
          "<div class='cart-info'><p class='cart-name'><a href='product.html?id=" + p.id + "'>" + esc(p.name) + "</a></p>" +
          "<p class='cart-opt'>" + esc(OPTS[it.opt].label) + "</p>" +
          "<p class='cart-unit'>" + won(unit) + "</p></div>" +
          "<div class='cart-ctl'><div class='qty'><button data-act='minus' data-i='" + idx + "' aria-label='수량 감소'>&minus;</button>" +
          "<span>" + it.qty + "</span><button data-act='plus' data-i='" + idx + "' aria-label='수량 증가'>+</button></div>" +
          "<button class='link-btn' data-act='del' data-i='" + idx + "'>삭제</button></div>" +
          "<p class='cart-line'>" + won(line) + "</p></div>";
      }).join("");
      var ship = subtotal >= FREE_SHIP_OVER ? 0 : SHIPPING_FEE;
      $("#sum-goods").textContent = won(subtotal);
      $("#sum-ship").textContent = ship ? won(ship) : "무료";
      $("#sum-total").textContent = won(subtotal + ship);
      $("#sum-free-note").textContent = subtotal >= FREE_SHIP_OVER ? "" : "30,000원 이상 구매 시 배송비 무료 (" + won(FREE_SHIP_OVER - subtotal) + " 남음)";
    }
    box.addEventListener("click", function (e) {
      var b = e.target.closest("button[data-act]"); if (!b) return;
      var items = readCart(), i = parseInt(b.getAttribute("data-i"), 10), act = b.getAttribute("data-act");
      if (!items[i]) return;
      if (act === "plus") items[i].qty++;
      if (act === "minus" && items[i].qty > 1) items[i].qty--;
      if (act === "del") items.splice(i, 1);
      writeCart(items); render();
    });
    $("#cart-clear").addEventListener("click", function () { writeCart([]); render(); toast("장바구니를 비웠습니다."); });
    $("#cart-order").addEventListener("click", function () { toast("주문 기능은 준비 중입니다."); });
    render();
  }

  // ---------- 팝업 (하루 동안 다시 보지 않기 지원) ----------
  function initPopup() {
    var pop = $("#popup"); if (!pop) return;
    var today = new Date().toISOString().slice(0, 10), hidden = false;
    try { hidden = localStorage.getItem(POPUP_KEY) === today; } catch (e) {}
    if (hidden) return;
    pop.hidden = false;
    function close() {
      if ($("#pop-hide").checked) { try { localStorage.setItem(POPUP_KEY, today); } catch (e) {} }
      pop.hidden = true;
    }
    $("#pop-close").addEventListener("click", close);
    pop.addEventListener("click", function (e) { if (e.target === pop) close(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !pop.hidden) close(); });
  }

  document.addEventListener("DOMContentLoaded", function () {
    updateBadge();
    initBanner(); initMain(); initList(); initSearch(); initDetail(); initCart(); initPopup();
  });
})();
