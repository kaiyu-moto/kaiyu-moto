fetch('vehicles.txt')
  .then((res) => res.text())
  .then((text) => {
    const rows = text
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith('#'));

    const list = document.getElementById('vehicle-list');
    if (!list) return;

    if (rows.length === 0) {
      list.innerHTML = '<p class="section-note">目前尚無上架車輛，敬請期待。</p>';
      return;
    }

    list.innerHTML = rows
      .map((row) => {
        const parts = row.split('|').map((p) => p.trim());
        const [name, year, mileage, cc, price, photo] = parts;

        const photoHtml = photo
          ? `<img src="images/${photo}" alt="${name}" class="vehicle-photo-img">`
          : `<div class="vehicle-photo">車輛照片</div>`;

        const meta = [year, mileage, cc].filter(Boolean).join(' / ');

        return `
          <div class="card vehicle-card">
            ${photoHtml}
            <h4>${name || ''}</h4>
            <p class="vehicle-meta">${meta}</p>
            <p class="vehicle-price">NT$ ${price || '洽詢'}</p>
            <a href="https://line.me/R/ti/p/@kymoto" target="_blank" rel="noopener" class="btn-ask">詢問這台車</a>
          </div>
        `;
      })
      .join('');
  })
  .catch(() => {
    const list = document.getElementById('vehicle-list');
    if (list) list.innerHTML = '<p class="section-note">車輛資料載入失敗，請稍後再試。</p>';
  });
