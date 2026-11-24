/* 직접 만든 캘린더 (라이브러리 미사용)
 * 원본: 관리자포털 src/assets/js/ui.js 의 datepicker 블록
 * 상세 페이지 데모에서 불러 쓰도록 initDatepicker 를 root 단위로 노출했습니다.
 */
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

function initCalendars(root) {
  (root || document).querySelectorAll('.datepicker').forEach(initDatepicker);
}
