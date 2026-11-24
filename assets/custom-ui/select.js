/* 직접 만든 셀렉트 (라이브러리 미사용)
 * 원본: 관리자포털 src/assets/js/ui.js 의 셀렉트 블록
 * 상세 페이지 데모에서 불러 쓰도록 root 단위 초기화 함수로 감쌌습니다.
 */
function initCustomSelect(root) {
  root = root || document;
  // 셀렉트
  const selectBoxes = root.querySelectorAll('.custom-select-box');
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
}
