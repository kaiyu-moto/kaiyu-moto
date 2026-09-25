const LINE_ID = '@kymoto';

const CC_GROUPS = [
  { key: 'all', label: '全部', test: () => true },
  { key: 'small', label: '125cc 以下', test: (cc) => cc > 0 && cc <= 125 },
  { key: 'mid', label: '126–180cc', test: (cc) => cc > 125 && cc <= 180 },
  { key: 'big', label: '181cc 以上', test: (cc) => cc > 180 },
];

function escapeHtml(str) {
  return String(str || '').replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c]));
}

function parseVehicles(text) {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#'))
    .map((row) => {
      const [name, year, mileage, cc, price, photo] = row.split('|').map((p) => p.trim());
      return { name, year, mileage, cc, price, photo, ccNum: parseInt(cc, 10) || 0 };
    });
}

function askLink(v) {
  const text = `你好，我想詢問這台車：${v.name} ${v.year || ''}`.trim();
  return `https://line.me/R/oaMessage/${LINE_ID}/?${encodeURIComponent(text)}`;
}

function renderCard(v) {
  const photo = v.photo
    ? `<img src="images/${escapeHtml(v.photo)}" alt="${escapeHtml(v.name)}" loading="lazy">`
    : `<div class="v-photo-empty">照片準備中</div>`;
  const specs = [v.mileage, v.cc].filter(Boolean)
    .map((s) => `<span>${escapeHtml(s)}</span>`).join('');
  const price = v.price
    ? `<small>NT$</small>${escapeHtml(v.price)}`
    : '價格洽詢';

  return `
    <article class="v-card">
      <div class="v-photo">
        ${photo}
        ${v.year ? `<span class="v-year">${escapeHtml(v.year)}</span>` : ''}
      </div>
      <div class="v-body">
        <h3 class="v-name">${escapeHtml(v.name)}</h3>
        <div class="v-specs">${specs}</div>
        <div class="v-foot">
          <div class="v-price">${price}</div>
          <a href="${askLink(v)}" target="_blank" rel="noopener" class="btn-ask">詢問這台車</a>
        </div>
      </div>
    </article>
  `;
}

fetch('vehicles.txt')
  .then((res) => res.text())
  .then((text) => {
    const vehicles = parseVehicles(text);
    const list = document.getElementById('vehicle-list');
    const filterBar = document.getElementById('vehicle-filter');

    if (!list) return;

    if (vehicles.length === 0) {
      list.innerHTML = '<p class="v-empty">目前尚無上架車輛，敬請期待。</p>';
      return;
    }

    const show = (groupKey) => {
      const group = CC_GROUPS.find((g) => g.key === groupKey);
      list.innerHTML = vehicles.filter((v) => group.test(v.ccNum)).map(renderCard).join('');
    };

    if (filterBar) {
      filterBar.innerHTML = CC_GROUPS
        .filter((g) => vehicles.some((v) => g.test(v.ccNum)))
        .map((g, i) => `
          <button type="button" class="chip${i === 0 ? ' active' : ''}" data-group="${g.key}" role="tab" aria-selected="${i === 0}">${g.label}</button>
        `).join('');

      filterBar.addEventListener('click', (e) => {
        const btn = e.target.closest('.chip');
        if (!btn) return;
        filterBar.querySelectorAll('.chip').forEach((c) => {
          c.classList.toggle('active', c === btn);
          c.setAttribute('aria-selected', c === btn);
        });
        show(btn.dataset.group);
      });
    }

    show('all');
  })
  .catch(() => {
    const list = document.getElementById('vehicle-list');
    if (list) list.innerHTML = '<p class="v-empty">車輛資料載入失敗，請稍後再試。</p>';
  });
