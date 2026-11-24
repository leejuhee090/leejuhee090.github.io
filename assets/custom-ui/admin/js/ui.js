document.addEventListener('DOMContentLoaded', function () {
  cmmUI.snav.init();
  cmmUI.initTabs();
  cmmUI.deviceWidthCheck(1024);
});

const cmmUI = {
  snav: {
    init() {
      this._initElements();
      this._initEvents();
    },
    _initElements() {
      this.side = document.querySelector("#side");
      this.snav = document.querySelector(".snav");
      this.dep1_li = document.querySelectorAll(".snav .dep1 > li");
      this.dep1_a = document.querySelectorAll(".snav .dep1 > li > a");
      this.dep2 = document.querySelectorAll(".snav .dep2");
      this.dep3 = document.querySelectorAll(".snav .dep3");
      this.activeName = "active";
      this.selectedItem = document.querySelector(".snav .dep1 > .current");
      this.hoverItem = null;
      this.toggle = document.querySelector("#side .btn-snav-toggle");
      this.typeStatus = this.side?.classList.contains("slim");
    },
    _initEvents() {
      if (!this.snav) return;

      this.slimStatus(this.typeStatus);

      [...this.dep2].forEach(el => {
        el.parentElement.classList.add("is-sub");
      });

      [...this.dep3].forEach(el => {
        el.parentElement.classList.add("is-sub");
      });

      this.dep1_li.forEach(el => {
        const div = document.createElement('div');
        div.setAttribute("class", "nav-layor");
        div.innerHTML = el.innerHTML;
        el.appendChild(div);
      });

      this.dep1_a.forEach(el => {
        el.addEventListener('click', (e) => {
          const parent = el.parentElement;

          if (this.typeStatus) {
            if (!parent.classList.contains("is-sub")) return;
            e.preventDefault();

            if (parent.classList.contains("active")) {
              this.navClose(parent);
            } else {
              if (this.selectedItem) this.navClose(this.selectedItem);
              this.navOpen(parent);
              this.selectedItem = parent;
            }
          }
        });

        el.addEventListener('mouseenter', () => {
          const parent = el.parentElement;

          if (!this.typeStatus) {
            if (!parent.classList.contains("active")) {
              if (this.hoverItem) this.navClose(this.hoverItem);
              this.navOpen(parent);
              this.hoverItem = parent;
            }
          }
        });
      });

      // 0807 추가: dep2 안의 a 태그 클릭 시 dep3 토글
      this.dep2.forEach(dep2 => {
        const dep2Items = dep2.querySelectorAll('li > a');
        dep2Items.forEach(dep2a => {
          dep2a.addEventListener('click', (e) => {
            const parentLi = dep2a.parentElement;
            const hasDep3 = parentLi.querySelector('.dep3');

            if (hasDep3) {
              e.preventDefault();
              parentLi.classList.toggle('active');
            }
          });
        });
      });

      this.snav.addEventListener('mouseleave', () => {
        if (!this.typeStatus && this.hoverItem) {
          this.navClose(this.hoverItem);
        }
      });

      this.toggle?.addEventListener('click', () => {
        this.typeStatus = !this.typeStatus;
        this.slimStatus(this.typeStatus);
      });
    },
    navOpen(el) {
      el?.classList.add(this.activeName);
    },
    navClose(el) {
      el?.classList.remove(this.activeName);
    },
    typeInit() {},
    slimStatus(status) {
      if (status) {
        this.side?.classList.add('slim');
        if (this.selectedItem) this.navClose(this.selectedItem);
      } else {
        this.side?.classList.remove('slim');
        if (this.selectedItem) this.navOpen(this.selectedItem);
      }
    }
  },

  isTablet: false, // true: 태블릿 / false: PC
  datepickerGroup: [],

  deviceCheck: {
    init() {
      const userAgent = navigator.userAgent.toLowerCase();

      const isTablet = (
        userAgent.includes('ipad') ||
        userAgent.includes('tablet') ||
        (userAgent.includes('android') && !userAgent.includes('mobile'))
      );

      if (isTablet) {
        this.device = 'tablet';
        cmmUI.isTablet = true;
      } else {
        this.device = 'pc';
        cmmUI.isTablet = false;
      }

      document.querySelector('html').classList.add(this.device);
    }
  },

  deviceWidthCheck(dividingSize) {
  const $html = document.querySelector('html');
  const size = dividingSize || 1024;

  checkWidth(size);

  let timer = null;
  window.addEventListener('resize', () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      checkWidth(size);
    }, 50);
  });

  function checkWidth(w) {
    if ($html.offsetWidth <= w) {
      // 태블릿 사이즈 이하
      $html.classList.remove("is-pc");
      $html.classList.add("is-tablet");
    } else {
      // PC 사이즈 이상
      $html.classList.remove("is-tablet");
      $html.classList.add("is-pc");
    }
  }
},

  initTabs() {
    const tabGroups = document.querySelectorAll("[data-tab-group]");
    tabGroups.forEach(group => {
      this.initTabSet(group);
    });
  },

  initTabSet(tabContainer) {
    const allTabs = tabContainer.querySelectorAll("#tabNav a");
    const allContents = tabContainer.querySelectorAll("#tabContent");

    const tabs = Array.from(allTabs).filter(el => el.closest("[data-tab-group]") === tabContainer);
    const contents = Array.from(allContents).filter(el => el.closest("[data-tab-group]") === tabContainer);

    const activeClass = "active";

    if (!tabs.length || !contents.length) return;

    const defaultIndex = parseInt(tabContainer.dataset.tabDefault, 10);
    const index = isNaN(defaultIndex) ? 0 : defaultIndex;

    function updateTab(index) {
      tabs.forEach((tab, i) => {
        tab.classList.toggle(activeClass, i === index);
      });
      contents.forEach((content, i) => {
        content.classList.toggle(activeClass, i === index);
        if (i === index) {
          content.setAttribute("title", "선택됨");
        } else {
          content.removeAttribute("title");
        }
      });
    }

    updateTab(index);

    tabs.forEach((tab, idx) => {
      tab.addEventListener("click", (e) => {
        e.preventDefault();
        updateTab(idx);
      });
    });
  }

};


document.addEventListener('DOMContentLoaded', () => {
  // 셀렉트
  const selectBoxes = document.querySelectorAll('.custom-select-box');
  selectBoxes.forEach(selectBox => {
    const selected = selectBox.querySelector('.selected-option');
    const list = selectBox.querySelector('.options-list');
    const options = Array.from(list.children);
    let focusedIndex = -1;

    function setAriaSelected(idx) {
      options.forEach((o, i) => {
        if (i === idx) {
          o.setAttribute('aria-selected', 'true');
          o.classList.add('act-index');
        } else {
          o.setAttribute('aria-selected', 'false');
          o.classList.remove('act-index');
        }
      });
    }

    function applySelection(opt) {
      selected.innerHTML = opt.innerHTML;

      if (opt.dataset && 'value' in opt.dataset) {
        selected.setAttribute('data-value', opt.dataset.value);
      } else {
        const txt = opt.textContent.trim();
        selected.setAttribute('data-value', txt);
      }
      selected.classList.add('filled');

      const idx = options.indexOf(opt);
      if (idx > -1) setAriaSelected(idx);
    }

    function openList() {
      selectBox.setAttribute('aria-expanded', 'true');
      selected.classList.add('open');
      const selIdx = options.findIndex(opt => opt.getAttribute('aria-selected') === 'true');
      focusedIndex = selIdx >= 0 ? selIdx : -1;
      focusOption(focusedIndex);
    }

    function closeList() {
      selectBox.setAttribute('aria-expanded', 'false');
      selected.classList.remove('open');
      options.forEach(opt => opt.tabIndex = -1);
      focusedIndex = -1;
    }

    function focusOption(idx) {
      options.forEach((opt, i) => {
        if (i === idx) {
          opt.tabIndex = 0;
          opt.focus();
        } else {
          opt.tabIndex = -1;
        }
      });
    }

    options.forEach(opt => opt.tabIndex = -1);

    const initIdx = options.findIndex(opt => opt.getAttribute('aria-selected') === 'true');
    if (initIdx >= 0) {
      applySelection(options[initIdx]);
    } else {
      setAriaSelected(0);
      applySelection(options[0]);
    }
    closeList();

    selected.addEventListener('click', () => {
      if (selectBox.classList.contains('disabled') || selectBox.classList.contains('readonly')) return;
      const isOpen = selectBox.getAttribute('aria-expanded') === 'true';
      isOpen ? closeList() : openList();
    });

    options.forEach(opt => {
      opt.addEventListener('click', () => {
        if (selectBox.classList.contains('disabled') || selectBox.classList.contains('readonly')) return;

        applySelection(opt);
        closeList();
        selected.focus();
      });
    });

    selectBox.addEventListener('keydown', (e) => {
      if (selectBox.classList.contains('disabled') || selectBox.classList.contains('readonly')) return;

      const max = options.length - 1;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          if (selectBox.getAttribute('aria-expanded') === 'false') {
            openList();
          } else {
            focusedIndex = focusedIndex < max ? focusedIndex + 1 : 0;
            focusOption(focusedIndex);
          }
          break;

        case 'ArrowUp':
          e.preventDefault();
          if (selectBox.getAttribute('aria-expanded') === 'false') {
            openList();
          } else {
            focusedIndex = focusedIndex > 0 ? focusedIndex - 1 : max;
            focusOption(focusedIndex);
          }
          break;

        case 'Enter':
        case ' ':
          e.preventDefault();
          if (selectBox.getAttribute('aria-expanded') === 'false') {
            openList();
          } else if (focusedIndex > -1) {
            options[focusedIndex].click();
          }
          break;

        case 'Escape':
          if (selectBox.getAttribute('aria-expanded') === 'true') {
            closeList();
            selected.focus();
          }
          break;

        case 'Tab':
          if (selectBox.getAttribute('aria-expanded') === 'true') {
            e.preventDefault();
            if (!e.shiftKey) {
              if (focusedIndex < max) {
                focusedIndex++;
                focusOption(focusedIndex);
              } else {
                closeList();
                setTimeout(() => selected.blur(), 0);
              }
            } else {
              if (focusedIndex > 0) {
                focusedIndex--;
                focusOption(focusedIndex);
              } else {
                closeList();
                selected.focus();
              }
            }
          }
          break;
      }
    });

    document.addEventListener('click', (e) => {
      document.querySelectorAll('.custom-select-box[aria-expanded="true"]').forEach(openBox => {
        if (openBox.classList.contains('disabled') || openBox.classList.contains('readonly')) return;
        if (!openBox.contains(e.target)) {
          const selectedEl = openBox.querySelector('.selected-option');
          const opts = openBox.querySelectorAll('.options-list > *');
          openBox.setAttribute('aria-expanded', 'false');
          selectedEl.classList.remove('open');
          opts.forEach(opt => opt.tabIndex = -1);
        }
      });
    });
  });

  // custom input
  const boxes = document.querySelectorAll('.ct-input-box');
  boxes.forEach(box => {
    const input = box.querySelector('.ct-input');
    const clearBtn = box.querySelector('.clear-btn');

    input.addEventListener('input', checkInput);
    input.addEventListener('blur', checkInput);

    clearBtn.addEventListener('click', () => {
      input.value = '';
      input.dispatchEvent(new Event('input'));
      input.focus();
    });

    // Escape로도 지울 수 있도록
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        input.value = '';
        input.dispatchEvent(new Event('input'));
      }
    });
  });
  // accodion
  document.querySelectorAll('.folder-div').forEach(div => {
    div.addEventListener('click', e => {
      // 체크박스 클릭이면 열지 않음
      if (e.target.tagName === 'INPUT') {
        return;
      }

      const li = div.closest('li');
      if (!li) return;

      const childUl = Array.from(li.children).find(child =>
        child.tagName === 'UL'
      );

      if (childUl) {
        li.classList.toggle('open');
        e.stopPropagation();
      }
    });
  });
  document.querySelectorAll('.folder-list ul').forEach(el => {
    if (!el.classList.contains('sortable-initialized')) {
      new Sortable(el, {
        animation: 150,
        ghostClass: 'ghost'
      });
      el.classList.add('sortable-initialized');
    }
  });

// 테이블 드래그
  const tbody = document.querySelector('.drag-table tbody');
  if (tbody) {
    new Sortable(tbody, {
      animation: 150,
      ghostClass: 'ghost-row',
      handle: '.btn-drag'
    });
  }
  

// 문진 메뉴 드래그
  document.querySelectorAll('.history-menuWrap.dragabled ul').forEach(ul => {
    if (ul._sortable) return;
    ul._sortable = new Sortable(ul, {
      animation: 150,
      ghostClass: 'ghost-row',
      handle: '.btn-drag',
      draggable: 'li'
    });
  });

// 문진 레벨 드래그
  document.querySelectorAll('.levelBoxWrap ul').forEach(wrap => {
    if (wrap._sortable) return; 
    wrap._sortable = new Sortable(wrap, {
      animation: 150,
      ghostClass: 'ghost-row',
      handle: '.btn-drag',
      draggable: 'li',
    });
  });
});


// 모달 팝업
function openModal({ targetId, backId, width }) {
  const modal = document.querySelector(targetId);
  if (!modal || modal.classList.contains('opened')) return;

  const modalWrap = modal.querySelector('.modalWrap');
  const closeBtns = modal.querySelectorAll('.btn-close, .btnModalClose');
  const title = modal.querySelector('.modal-title h3');
  const focusableSelector = `
    a[href]:not([tabindex="-1"]),
    button:not([disabled]):not([tabindex="-1"]),
    input:not([type="hidden"]):not([disabled]):not([tabindex="-1"]),
    select:not([disabled]):not([tabindex="-1"]),
    textarea:not([disabled]):not([tabindex="-1"]),
    [tabindex]:not([tabindex="-1"]):not([disabled])
  `.replace(/\n/g, '').trim();

  const previouslyFocused = document.activeElement;

  function trapFocus(e) {
    if (e.key !== 'Tab') return;

    const focusables = modal.querySelectorAll(focusableSelector);
    if (!focusables.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  function closeModalHandler() {
    modal.classList.remove('opened');
    modal.style.display = 'none';
    modalWrap.removeAttribute('tabindex');
    document.removeEventListener('keydown', trapFocus);

    if (backId) {
      const backEl = typeof backId === 'string' ? document.querySelector(backId) : backId;
      backEl?.focus();
    } else {
      previouslyFocused?.focus();
    }
  }

  modal.classList.add('opened');
  modal.style.display = 'flex';

  if (title) {
    const titleId = `${targetId.replace('#', '')}_title`;
    title.id = titleId;
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-labelledby', titleId);
  }

  if (width) modalWrap.style.width = `${width}px`;

  modalWrap.setAttribute('tabindex', '-1');
  modalWrap.focus();

  document.addEventListener('keydown', trapFocus);

  modal.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModalHandler();
  });

  if (modal.classList.contains('dim')) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModalHandler();
    });
  }

  closeBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      closeModalHandler();
    });
  });
}

// datepicker

function safeQuery(picker, selector) {
  return picker.querySelector(selector);
}

function safeAddEvent(el, evt, handler) {
  if (el) el.addEventListener(evt, handler);
}

function bindCustomSelect(selEl, optsEl, labelEl, onChange) {
  if (!selEl || !optsEl || !labelEl || typeof onChange !== 'function') return;

  const items = () => Array.from(optsEl.children);
  let currentFocusedIdx = -1;

  function closeAllOthers(exceptEl) {
    document.querySelectorAll('.cd-custom-select.open').forEach(other => {
      if (other !== exceptEl) {
        other.classList.remove('open');
        other.querySelectorAll('.focused').forEach(f => f.classList.remove('focused'));
      }
    });
  }

  safeAddEvent(selEl, 'click', e => {
    e.stopPropagation();
    const picker = selEl.closest('.datepicker');
    const isYM = picker?.classList.contains('dp-ym');
    if (isYM && selEl.classList.contains('monSel')) return;

    const isOpen = selEl.classList.contains('open');
    closeAllOthers(selEl);

    if (isOpen) {
      selEl.classList.remove('open');
      items().forEach(it => it.classList.remove('focused'));
    } else {
      selEl.classList.add('open');
      if (currentFocusedIdx === -1) currentFocusedIdx = 0;
      items().forEach(it => it.classList.remove('focused'));
      items()[currentFocusedIdx]?.classList.add('focused');
      items()[currentFocusedIdx]?.scrollIntoView({ block: 'nearest' });
    }
  });

  safeAddEvent(optsEl, 'click', e => {
    e.stopPropagation();
    if (e.target?.dataset?.value != null) {
      items().forEach(it => it.classList.remove('selected-opt', 'focused'));
      e.target.classList.add('selected-opt');
      labelEl.textContent = e.target.textContent;
      currentFocusedIdx = items().indexOf(e.target);

      const picker = selEl.closest('.datepicker');
      const isYM = picker?.classList.contains('dp-ym');

      if (!(isYM && selEl.classList.contains('monSel'))) {
        selEl.classList.remove('open');
      }

      onChange(+e.target.dataset.value);

      if (isYM && selEl.classList.contains('monSel')) {
        picker.classList.remove('open');
      }
    }
  });

  safeAddEvent(selEl, 'keydown', e => {
    const picker = selEl.closest('.datepicker');
    const isYM = picker?.classList.contains('dp-ym');
    const isMonSel = selEl.classList.contains('monSel');
    if (isYM && isMonSel) return;

    if (!selEl.classList.contains('open') && ['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) {
      e.preventDefault();
      closeAllOthers(selEl);
      selEl.classList.add('open');
      if (currentFocusedIdx === -1) currentFocusedIdx = 0;
      items().forEach(it => it.classList.remove('focused'));
      items()[currentFocusedIdx]?.classList.add('focused');
      items()[currentFocusedIdx]?.scrollIntoView({ block: 'nearest' });
      return;
    }

    if (!selEl.classList.contains('open')) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      currentFocusedIdx = (currentFocusedIdx + 1) % items().length;
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      currentFocusedIdx = (currentFocusedIdx - 1 + items().length) % items().length;
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      items()[currentFocusedIdx]?.click();
    } else if (e.key === 'Escape' || e.key === 'Tab') {
      selEl.classList.remove('open');
      items().forEach(it => it.classList.remove('focused'));
      return;
    }

    items().forEach(it => it.classList.remove('focused'));
    items()[currentFocusedIdx]?.classList.add('focused');
    items()[currentFocusedIdx]?.scrollIntoView({ block: 'nearest' });
  });
}

function initDatepicker(picker) {
  const input = safeQuery(picker, '.datepicker-input');
  const isYM = picker.classList.contains('dp-ym');
  const yearSel = safeQuery(picker, '.yearSel');
  const monSel = safeQuery(picker, '.monSel');
  const yearOpts = yearSel?.querySelector('.options');
  const monOpts = monSel?.querySelector('.options');
  const yearLabel = yearSel?.querySelector('.selected');
  const monLabel = monSel?.querySelector('.selected');
  const yearPrev = safeQuery(picker, '.year-prev');
  const yearNext = safeQuery(picker, '.year-next');
  const monPrev = safeQuery(picker, '.mon-prev');
  const monNext = safeQuery(picker, '.mon-next');
  const daysC = safeQuery(picker, '.days-container');
  const todayBtn = safeQuery(picker, '.today-button');
  const todayDateDisplay = safeQuery(picker, '.today-date');

  const today = new Date();
  let curY = today.getFullYear();
  let curM = today.getMonth();
  let selD = null;
  let yearSelected = isYM;
  let monthSelected = false;

  function formatDate(date) {
    const y = date.getFullYear();
    const m = (date.getMonth() + 1).toString().padStart(2, '0');
    const d = date.getDate().toString().padStart(2, '0');
    return isYM ? `${y}-${m}` : `${y}-${m}-${d}`;
  }

  function updateDateSelection(date, updateInput = true, close = true) {
    selD = new Date(date);
    curY = selD.getFullYear();
    curM = selD.getMonth();

    if (updateInput) input.value = formatDate(selD);

    if (yearLabel) yearLabel.textContent = `${curY}년`;
    if (monLabel && !isYM) monLabel.textContent = `${curM + 1}월`;

    if (yearOpts) {
      yearOpts.querySelectorAll('div').forEach(div => div.classList.remove('selected-opt'));
      yearOpts.querySelector(`div[data-value="${curY}"]`)?.classList.add('selected-opt');
    }
    if (monOpts) {
      monOpts.querySelectorAll('div').forEach(div => div.classList.remove('selected-opt'));
      monOpts.querySelector(`div[data-value="${curM}"]`)?.classList.add('selected-opt');
    }

    if (!isYM) renderCal(curY, curM);
    if (close && !isYM) picker.classList.remove('open');
  }

  function setupSelect(selLabel, selOpts, start, end, unit) {
    if (!selOpts || !selLabel) return;
    selLabel.textContent = '선택';
    selOpts.innerHTML = '';
    for (let i = start; i <= end; i++) {
      const div = document.createElement('div');
      div.textContent = unit === 'year' ? `${i}년` : `${i + 1}월`;
      div.dataset.value = unit === 'year' ? i : i;
      div.setAttribute('tabindex', '0');
      selOpts.appendChild(div);
    }
  }

  function renderCal(y, m) {
    if (!daysC) return;
    daysC.innerHTML = '';
    const firstDay = new Date(y, m, 1).getDay();
    const daysInMonth = new Date(y, m + 1, 0).getDate();

    for (let i = 0; i < firstDay; i++) {
      const empty = document.createElement('div');
      daysC.appendChild(empty);
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const btn = document.createElement('button');
      btn.textContent = d;
      btn.className = 'day';
      btn.addEventListener('click', () => updateDateSelection(new Date(y, m, d)));
      daysC.appendChild(btn);
    }

    if (todayDateDisplay) todayDateDisplay.textContent = formatDate(today);
  }

  setupSelect(yearLabel, yearOpts, today.getFullYear() - 100, today.getFullYear() + 10, 'year');
  setupSelect(monLabel, monOpts, 0, 11, 'month');

  bindCustomSelect(yearSel, yearOpts, yearLabel, val => {
    curY = val;
    yearSelected = true;
    if (!isYM) renderCal(curY, curM);
    if (isYM && yearSelected && monthSelected) {
      updateDateSelection(new Date(curY, curM, 1));
    }
  });

  bindCustomSelect(monSel, monOpts, monLabel, val => {
    curM = val;
    monthSelected = true;
    if (isYM && yearSelected && monthSelected) {
      updateDateSelection(new Date(curY, curM, 1));
    } else {
      renderCal(curY, curM);
    }
  });

  safeAddEvent(yearPrev, 'click', () => {
    if (isYM && yearOpts) {
      const selected = yearOpts.querySelector('.selected-opt');
      const prev = selected?.previousElementSibling;
      if (prev) prev.click();
    } else {
      curY--;
      renderCal(curY, curM);
    }
  });

  safeAddEvent(yearNext, 'click', () => {
    if (isYM && yearOpts) {
      const selected = yearOpts.querySelector('.selected-opt');
      const next = selected?.nextElementSibling;
      if (next) next.click();
    } else {
      curY++;
      renderCal(curY, curM);
    }
  });

  safeAddEvent(monPrev, 'click', () => {
    curM--;
    if (curM < 0) {
      curM = 11;
      curY--;
    }
    if (!isYM) renderCal(curY, curM);
  });

  safeAddEvent(monNext, 'click', () => {
    curM++;
    if (curM > 11) {
      curM = 0;
      curY++;
    }
    if (!isYM) renderCal(curY, curM);
  });

  safeAddEvent(todayBtn, 'click', () => updateDateSelection(today));

  input.addEventListener('focus', () => {
    document.querySelectorAll('.datepicker.open').forEach(dp => dp.classList.remove('open'));
    picker.classList.add('open');
    if (isYM && monSel) monSel.classList.add('open');
    if (isYM && monLabel) monLabel.style.display = 'none';
    if (!isYM) renderCal(curY, curM);
  });

  document.addEventListener('click', e => {
    if (!picker.contains(e.target)) {
      if (!isYM) picker.classList.remove('open');
      yearSel?.classList.remove('open');
      if (!isYM) monSel?.classList.remove('open');
    }
  });

  updateDateSelection(today, false, false);
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.datepicker').forEach(initDatepicker);
});



document.addEventListener('DOMContentLoaded', () => {
  // 테이블 스크롤
  const allTables = document.querySelectorAll('.data-list .table-scroll');
  const popups = document.querySelectorAll('.modal');
  function updateScrollState(tableScroll) {
    const dataList = tableScroll.closest('.data-list');
    if (!dataList) return;

    if (tableScroll.scrollHeight > tableScroll.clientHeight) {
      tableScroll.classList.add('scrollOn');
      const scHeader = tableScroll.parentElement.querySelector('.scHeader');
      if (scHeader) {
        scHeader.classList.add('scrollOn');
      }
    } else {
      tableScroll.classList.remove('scrollOn');
      const scHeader = tableScroll.parentElement.querySelector('.scHeader');
      if (scHeader) {
        scHeader.classList.remove('scrollOn');
      }
    }

    const firstRowTds = tableScroll.querySelectorAll('tbody > tr:first-child > td');
    firstRowTds.forEach(td => {
      const width = td.getBoundingClientRect().width;
      if (width % 1 !== 0) {
        td.classList.add('txtIndent');
      } else {
        td.classList.remove('txtIndent');
      }
    });
  }
  allTables.forEach(tableScroll => {
    const dataList = tableScroll.closest('.data-list');
    if (!dataList) return;

    updateScrollState(tableScroll);

    tableScroll.addEventListener('scroll', () => {
      if (tableScroll.scrollTop > 0) {
        dataList.classList.add('scrolling');
      } else {
        dataList.classList.remove('scrolling');
      }
    });
  });
  window.addEventListener('resize', () => {
    const all = document.querySelectorAll('.data-list .table-scroll');
    all.forEach(el => updateScrollState(el));
  });
  popups.forEach(popup => {
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (
          mutation.attributeName === 'style' &&
          getComputedStyle(popup).display !== 'none'
        ) {
          const tables = popup.querySelectorAll('.table-scroll');
          tables.forEach(el => updateScrollState(el));
        }
      });
    });
    observer.observe(popup, { attributes: true, attributeFilter: ['style'] });
  });



// typing
  const boxes = document.querySelectorAll('.custom-input-box.typingType');

  boxes.forEach((box) => {
    const input = box.querySelector('input.custom-input');
    const typingCurrent = box.querySelector('.typingBox .onTxt');
    const typingMax = box.querySelector('.typingBox .sumTxt');
    const clearBtn = box.querySelector('.clear-btn');

    if (!input || !typingCurrent || !typingMax) return;

    const maxLength = parseInt(typingMax.textContent, 10) || 50;

    typingCurrent.textContent = input.value.length;

    input.addEventListener('input', () => {
      if (input.value.length > maxLength) {
        input.value = input.value.slice(0, maxLength);
      }
      typingCurrent.textContent = input.value.length;
    });

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        input.value = '';
        typingCurrent.textContent = '0';
        input.focus();
      });
    }
  });



  // 검색셀렉트
  if (typeof $ !== 'undefined' && $.fn.select2) {
  $('select').select2({
    placeholder: '옵션을 선택하세요',
    allowClear: true,
    width: 'resolve',
    language: {
      noResults: function(){
        return "검색 결과가 없습니다.";
      },
      searching: function(){
        return "검색 중...";
      }
    }
  });
}

});

//박스 오픈 공통

document.addEventListener('DOMContentLoaded', () => {
  const boxAreas = document.querySelectorAll('.boxopenArea');

  // 유틸
  const closeAll = () => {
    document.querySelectorAll('.openBox.on').forEach(box => {
      box.classList.remove('on');
      box.setAttribute('aria-hidden', 'true');
      const wrap = box.closest('.boxopenArea');
      const btn = wrap ? wrap.querySelector('button') : null;
      if (btn) btn.setAttribute('aria-expanded', 'false');
    });
  };

  const closeExcept = (exceptBox) => {
    document.querySelectorAll('.openBox.on').forEach(box => {
      if (box !== exceptBox) {
        box.classList.remove('on');
        box.setAttribute('aria-hidden', 'true');
        const wrap = box.closest('.boxopenArea');
        const btn = wrap ? wrap.querySelector('button') : null;
        if (btn) btn.setAttribute('aria-expanded', 'false');
      }
    });
  };

  const toggleBox = (wrap, box) => {
    const willOpen = !box.classList.contains('on');
    if (willOpen) {
      closeExcept(box);
      box.classList.add('on');
      box.setAttribute('aria-hidden', 'false');
      const btn = wrap.querySelector('button');
      if (btn) btn.setAttribute('aria-expanded', 'true');
    } else {
      box.classList.remove('on');
      box.setAttribute('aria-hidden', 'true');
      const btn = wrap.querySelector('button');
      if (btn) btn.setAttribute('aria-expanded', 'false');
    }
  };

  boxAreas.forEach(area => {
    const toggleBtn = area.querySelector('button');           // 트리거 버튼(첫 버튼)
    const openBox = area.querySelector('.openBox');           // 열릴 박스

    if (!toggleBtn || !openBox) return;

    // 초기 ARIA 세팅
    toggleBtn.setAttribute('aria-expanded', openBox.classList.contains('on') ? 'true' : 'false');
    openBox.setAttribute('aria-hidden', openBox.classList.contains('on') ? 'false' : 'true');

    // 토글 버튼
    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleBox(area, openBox);
    });

    // 내부 클릭은 전파 중단(바깥 클릭 닫기 방지)
    openBox.addEventListener('click', (e) => {
      e.stopPropagation();
    });

    // 닫기 버튼(여러 개 가능): .btnClose, .tooltip-header > button, [data-close]
    const closeBtns = openBox.querySelectorAll('.btnClose, .tooltip-header > button, [data-close]');
    closeBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        openBox.classList.remove('on');
        openBox.setAttribute('aria-hidden', 'true');
        if (toggleBtn) toggleBtn.setAttribute('aria-expanded', 'false');
        // 포커스 반환이 필요하면 주석 해제
        // toggleBtn.focus();
      });
    });
  });

  // 바깥 클릭 시 모든 박스 닫기
  document.addEventListener('click', () => {
    closeAll();
  });

  // ESC로 모두 닫기
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAll();
    }
  });
});




// 슬라이드
document.addEventListener('DOMContentLoaded', () => {
  const container = document.querySelector('.heaaderSd .dep1');
  const prevBtn = document.querySelector('.sdBox .sdPrev');
  const nextBtn = document.querySelector('.sdBox .sdNext');

  if (container && prevBtn) {
    prevBtn.addEventListener('click', () => {
      container.scrollBy({
        left: -150,
        behavior: 'smooth'
      });
    });
  }

  if (container && nextBtn) {
    nextBtn.addEventListener('click', () => {
      container.scrollBy({
        left: 150,
        behavior: 'smooth'
      });
    });
  }
});


// header
document.addEventListener('DOMContentLoaded', () => {
  const menuBtn = document.querySelector('.btnMenu');
  const bottomMenu = document.querySelector('.headerBttomMenu');
  if (!menuBtn || !bottomMenu) return;

  bottomMenu.style.height = '0px';
  bottomMenu.style.overflow = 'hidden';
  bottomMenu.style.visibility = 'hidden';
  menuBtn.setAttribute('aria-expanded', 'false');

  let isOpen = false;
  let isTransitioning = false;

  const openMenu = () => {
    if (isTransitioning || isOpen) return;
    isTransitioning = true;

    bottomMenu.style.visibility = 'visible';
    bottomMenu.style.height = '0px';
    void bottomMenu.offsetHeight;

    const fullHeight = bottomMenu.scrollHeight + 'px';
    bottomMenu.style.transition = 'height 0.3s ease';
    bottomMenu.style.height = fullHeight;

    const openHandler = (e) => {
      if (e.propertyName === 'height') {
        bottomMenu.style.height = 'auto';
        bottomMenu.style.transition = '';
        bottomMenu.removeEventListener('transitionend', openHandler);

        isOpen = true;
        isTransitioning = false;

        menuBtn.classList.add('active');
        menuBtn.setAttribute('aria-expanded', 'true');
      }
    };
    bottomMenu.addEventListener('transitionend', openHandler);
  };

  const closeMenu = () => {
    if (isTransitioning || !isOpen) return;
    isTransitioning = true;

    bottomMenu.style.height = bottomMenu.scrollHeight + 'px';
    void bottomMenu.offsetHeight;

    bottomMenu.style.transition = 'height 0.3s ease';
    bottomMenu.style.height = '0px';

    const closeHandler = (e) => {
      if (e.propertyName === 'height') {
        bottomMenu.style.visibility = 'hidden';
        bottomMenu.style.transition = '';
        bottomMenu.removeEventListener('transitionend', closeHandler);

        isOpen = false;
        isTransitioning = false;

        menuBtn.classList.remove('active');
        menuBtn.setAttribute('aria-expanded', 'false');
      }
    };
    bottomMenu.addEventListener('transitionend', closeHandler);
  };

  menuBtn.addEventListener('click', () => {
    if (isOpen) closeMenu();
    else openMenu();
  }); 

  // 마우스 오버 이벤트
  menuBtn.addEventListener('mouseenter', openMenu);
  bottomMenu.addEventListener('mouseleave', closeMenu);
});



// 카운트
document.addEventListener('DOMContentLoaded', () => {
  const countdownEls = document.querySelectorAll('.countNum');

  countdownEls.forEach(countdownEl => {
    if (!countdownEl) return;

    const timeText = countdownEl.dataset.time;
    if (!timeText) return;

    let totalSeconds = 0;
    let isMinuteFormat = false;

    if (timeText.includes(':')) {
      // "mm:ss" 형식
      const [mStr, sStr] = timeText.split(':');
      const minutes = parseInt(mStr, 10);
      const seconds = parseInt(sStr, 10);
      totalSeconds = minutes * 60 + seconds;
      isMinuteFormat = true;
    } else {
      // 숫자만 입력된 경우
      totalSeconds = parseInt(timeText, 10);
    }

    const action = countdownEl.dataset.action;
    const message = countdownEl.dataset.message;
    const url = countdownEl.dataset.url;
    const target = countdownEl.dataset.target;

    function updateCountdown() {
      if (isMinuteFormat) {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        const m = String(minutes).padStart(2, '0');
        const s = String(seconds).padStart(2, '0');
        countdownEl.textContent = `${m}:${s}`;
      } else {
        countdownEl.textContent = `${totalSeconds}`;
      }
    }

    updateCountdown();

    const interval = setInterval(() => {
      if (totalSeconds <= 0) {
        clearInterval(interval);

        if (action === 'alert' && message) {
          alert(message);
        } else if (action === 'redirect' && url) {
          location.href = url;
        } else if (action === 'custom' && target) {
          const modal = document.getElementById(target);
          if (modal) modal.style.display = 'none';
        }

        return;
      }

      totalSeconds--;
      updateCountdown();
    }, 1000);
  });
});


// 프린트팝업슬라이드

document.addEventListener('DOMContentLoaded', () => {
  const modals = document.querySelectorAll('.modal');

  modals.forEach((modal) => {
    const paperContainer = modal.querySelector('.paperSd');
    if (!paperContainer) return;

    const papers = paperContainer.querySelectorAll('.paper');
    if (papers.length === 0) return;

    let currentIndex = 0;
    const totalCount = papers.length;

    papers.forEach((paper, i) => {
      paper.classList.toggle('active', i === currentIndex);
    });

    const numBox = modal.querySelector('.numBox');
    const actNtm = numBox?.querySelector('.actNtm');
    const totalNtm = numBox?.querySelector('div:last-child');

    if (actNtm) actNtm.textContent = currentIndex + 1;
    if (totalNtm) totalNtm.textContent = totalCount;

    const prevBtn = modal.querySelector('.prev');
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        papers[currentIndex].classList.remove('active');
        currentIndex = (currentIndex - 1 + totalCount) % totalCount;
        papers[currentIndex].classList.add('active');
        if (actNtm) actNtm.textContent = currentIndex + 1;
      });
    }

    const nextBtn = modal.querySelector('.next');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        papers[currentIndex].classList.remove('active');
        currentIndex = (currentIndex + 1) % totalCount;
        papers[currentIndex].classList.add('active');
        if (actNtm) actNtm.textContent = currentIndex + 1;
      });
    }
  });
});

// -------------tablet----------------------//

// 참여자관리 리스트
document.addEventListener('DOMContentLoaded', () => {
  const box = document.querySelector('.detailBox');
  const btn = document.querySelector('.more-schbtn');

  if (!box || !btn) return;

  btn.addEventListener('click', () => {
    const isOpen = box.classList.contains('open');

    const onTransitionEnd = (e) => {
      if (e.propertyName === 'height') {
        box.removeEventListener('transitionend', onTransitionEnd);
        if (!isOpen) {
          box.classList.add('opened');
        } else {
          box.style.display = 'none';
        }
      }
    };

    box.addEventListener('transitionend', onTransitionEnd);

    if (isOpen) {
      box.classList.remove('opened');
      box.style.height = box.scrollHeight + 'px';

      requestAnimationFrame(() => {
        box.style.transition = 'height 0.3s ease';
        box.style.height = '0';
      });

      box.classList.remove('open');
      btn.classList.remove('on');

      const blind = btn.querySelector('.blind');
      if (blind) blind.textContent = '열기';
    } else {
      box.classList.add('open');
      btn.classList.add('on');

      const blind = btn.querySelector('.blind');
      if (blind) blind.textContent = '닫기';

      box.style.display = 'flex';
      const height = box.scrollHeight;

      box.style.transition = 'none';
      box.style.height = '0';

      requestAnimationFrame(() => {
        box.style.transition = 'height 0.3s ease';
        box.style.height = height + 'px';
      });
    }
  });
});

// 아코디언 박스
document.addEventListener("DOMContentLoaded", () => {
  const accButtons = document.querySelectorAll(".accBtn");

  accButtons.forEach((btn) => {
    btn.addEventListener("click", function (e) {
      e.stopPropagation();

      const parentBox = this.closest(".levelBox.accoBox");
      if (!parentBox) return;

      const isOpen = parentBox.classList.toggle("open");

      const childWrap = parentBox.querySelector(":scope > ul.accoWrap");
      if (childWrap) {
        const childBoxes = childWrap.querySelectorAll(":scope > .levelBox.accoBox");

        if (isOpen) {
          childBoxes.forEach((box) => box.classList.add("open"));
        } else {
          parentBox.querySelectorAll(".levelBox.accoBox").forEach((box) => {
            box.classList.remove("open");
          });
        }
      }
    });
  });
});
// 태블릿 아코디언 js 분리
document.addEventListener("DOMContentLoaded", function () {
  const accoBoxes = document.querySelectorAll(".accoBox");

  accoBoxes.forEach(box => {
    const btn = box.querySelector(".openButton");
    const infoBtnbox = box.querySelector(".infoBtnbox");

    infoBtnbox.style.display = "none";

    btn.addEventListener("click", function () {
      const isOpen = infoBtnbox.style.display === "flex";

      accoBoxes.forEach(otherBox => {
        const otherInfo = otherBox.querySelector(".infoBtnbox");
        otherInfo.style.display = "none";
        otherBox.classList.remove("open");
      });

      if (!isOpen) {
        infoBtnbox.style.display = "flex";
        box.classList.add("open");
      } else {
        infoBtnbox.style.display = "none";
        box.classList.remove("open");
      }
    });
  });
});

document.addEventListener("DOMContentLoaded", function () {
  // input file
  let fileInput = document.querySelector('.filebox .file');
  let nameInput = document.querySelector('.filebox .upload-name');
  if (fileInput && nameInput) {  // ✅ 요소 있을 때만
    fileInput.addEventListener('change', function(e){
      const input = e.target.closest('.file');
      if (!input) return;
      let fileName = input.value.split('/').pop().split('\\').pop();
      nameInput.value = fileName;
    });
  }
});

// 희귀질환
document.addEventListener("DOMContentLoaded", function () {
  const summaryWrap = document.querySelector(".summary-wrap");
  const summaryButton = document.querySelector(".summary-button");
  const delButton = document.querySelector(".grf-summary .gs-del");

  if (summaryWrap && summaryButton && delButton) {  // ✅ 요소 있을 때만
    summaryButton.addEventListener("click", function () {
      summaryWrap.classList.add("active");
    });

    delButton.addEventListener("click", function () {
      summaryWrap.classList.remove("active");
    });
  }
});


document.addEventListener("DOMContentLoaded", function () {
  const accBtns = document.querySelectorAll('.sourceWrap .sourcBtn');

  accBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const li = btn.closest('li');
      const wrap = li.closest('.sourceWrap');

      wrap.querySelectorAll('li').forEach(other => {
        if (other !== li) {
          other.classList.remove('active');
          const otherBtn = other.querySelector('.sourcBtn');
          if (otherBtn) {
            otherBtn.classList.remove('open');
            const span = otherBtn.querySelector('.blind');
            if (span) span.textContent = '열기';
          }
        }
      });

      const isOpen = li.classList.toggle('active');
      btn.classList.toggle('open', isOpen);

      const span = btn.querySelector('.blind');
      if (span) {
        span.textContent = isOpen ? '닫기' : '열기';
      }
    });
  });
});
