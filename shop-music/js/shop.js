(function () {
  var P = window.SHOP_PRODUCTS || [];
  var CAT = { string: "현악기", keys: "건반악기", acc: "악기 용품" };

  function won(n) { return n.toLocaleString("ko-KR") + "원"; }
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }

  // AI 이미지가 없을 때 쓰는 자리표시 이미지 (SVG)
  function placeholder(p, label) {
    var c = p.color || ["#eee", "#999"];
    var svg = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 400'>" +
      "<defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='" + c[0] + "'/><stop offset='1' stop-color='" + c[1] + "'/></linearGradient></defs>" +
      "<rect width='300' height='400' fill='url(#g)'/>" +
      "<text x='150' y='190' text-anchor='middle' font-family='sans-serif' font-size='18' fill='#fff' opacity='.95'>" + (label || p.name) + "</text>" +
      "<text x='150' y='220' text-anchor='middle' font-family='sans-serif' font-size='13' fill='#fff' opacity='.8'>AI 이미지 자리</text></svg>";
    return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg).replace(/'/g, "%27");
  }
  function imgOf(p) { return p.image ? p.image : placeholder(p); }

  function card(p) {
    var badge = "";
    if (p.sale) badge = "<span class='badge sale'>" + (p.tag || "SALE") + "</span>";
    else if (p.tag) badge = "<span class='badge'>" + p.tag + "</span>";
    var price = p.sale
      ? "<s>" + won(p.price) + "</s><span class='sale-price'>" + won(p.sale) + "</span>"
      : "<b>" + won(p.price) + "</b>";
    return "<li><a class='card' href='product.html?id=" + p.id + "'>" +
      "<div class='thumb'>" + badge + "<img loading='lazy' alt='" + p.name + "' src='" + imgOf(p) + "'></div>" +
      "<p class='name'>" + p.name + "</p><p class='price'>" + price + "</p></a></li>";
  }

  // 배너 슬라이드
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
    $(".banner-nav.prev", root).addEventListener("click", function () { go(i - 1); reset(); });
    $(".banner-nav.next", root).addEventListener("click", function () { go(i + 1); reset(); });
    function reset() { clearInterval(timer); timer = setInterval(function () { go(i + 1); }, 4500); }
    go(0); reset();
  }

  // 메인: 신상품 / 베스트
  function initMain() {
    var n = $("#new-list"); if (n) n.innerHTML = P.slice(0, 4).map(card).join("");
    var b = $("#best-list"); if (b) b.innerHTML = P.slice().sort(function (a, c) { return c.sold - a.sold; }).slice(0, 4).map(card).join("");
  }

  // 목록: 카테고리 + 정렬
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

  // 상세
  function initDetail() {
    var root = $("#detail"); if (!root) return;
    var id = parseInt(new URLSearchParams(location.search).get("id"), 10);
    var p = P.filter(function (x) { return x.id === id; })[0] || P[0];
    document.title = p.name + " | SAMPLE MUSIC";
    $("#crumb-cat").textContent = CAT[p.category];
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

    var unit = p.sale || p.price, qty = 1, opt = $("#opt");
    function total() { $("#total").textContent = won(unit * qty); $("#qty").textContent = qty; }
    $("#qty-minus").addEventListener("click", function () { if (qty > 1) { qty--; total(); } });
    $("#qty-plus").addEventListener("click", function () { qty++; total(); });
    total();

    function toast(msg) {
      var t = $("#toast"); t.textContent = msg; t.classList.add("show");
      clearTimeout(t._t); t._t = setTimeout(function () { t.classList.remove("show"); }, 1800);
    }
    $("#btn-cart").addEventListener("click", function () {
      if (!opt.value) return toast("옵션을 먼저 선택해 주세요.");
      toast(p.name + " " + qty + "개를 장바구니에 담았습니다.");
    });
    $("#btn-buy").addEventListener("click", function () {
      if (!opt.value) return toast("옵션을 먼저 선택해 주세요.");
      toast("샘플 페이지라 주문은 진행되지 않습니다.");
    });

    // 탭 앵커 활성화
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

  // 옵션 목록 (상세 페이지)
  function fillOptions() {
    var s = $("#opt"); if (!s) return;
    s.innerHTML = "<option value=''>[필수] 사이즈 선택</option><option>S</option><option>M</option><option>L</option><option>XL</option>";
  }

  document.addEventListener("DOMContentLoaded", function () {
    initBanner(); initMain(); initList(); fillOptions(); initDetail();
  });
})();
