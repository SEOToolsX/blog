// Wait for DOM
document.addEventListener('DOMContentLoaded', function() {
  
  // --- Elements ---
  const catBtns = document.querySelectorAll('.cat-btn');
  const tabBtns = document.querySelectorAll('.tab');
  const postsGrid = document.getElementById('postsGrid');
  let allPosts = Array.from(document.querySelectorAll('.post-card'));
  let currentCategory = 'all';
  let currentTab = 'all';   // 'recents', 'favorites', 'all'

  // Favorite system (localStorage)
  let favorites = JSON.parse(localStorage.getItem('chamanFavs')) || [];

  function saveFavs() {
    localStorage.setItem('chamanFavs', JSON.stringify(favorites));
  }

  // Add star/fav button to each post card
  function addFavButtons() {
    allPosts.forEach(post => {
      let title = post.querySelector('h3')?.innerText || '';
      let isFav = favorites.includes(title);
      let favBtn = document.createElement('button');
      favBtn.innerHTML = isFav ? '⭐' : '☆';
      favBtn.classList.add('fav-star');
      favBtn.style.background = 'none';
      favBtn.style.border = 'none';
      favBtn.style.fontSize = '22px';
      favBtn.style.cursor = 'pointer';
      favBtn.style.float = 'left';  // because RTL, float left will go to left side
      favBtn.style.marginLeft = '8px';
      favBtn.onclick = (e) => {
        e.stopPropagation();
        if (favorites.includes(title)) {
          favorites = favorites.filter(t => t !== title);
          favBtn.innerHTML = '☆';
        } else {
          favorites.push(title);
          favBtn.innerHTML = '⭐';
        }
        saveFavs();
        if (currentTab === 'favorites') applyFilters();
      };
      // insert fav button at beginning of post card (but after maybe)
      post.style.position = 'relative';
      post.insertBefore(favBtn, post.firstChild);
    });
  }

  // Filter posts based on category + tab
  function applyFilters() {
    let postsToShow = allPosts;

    // 1) Category filter
    if (currentCategory !== 'all') {
      postsToShow = postsToShow.filter(post => {
        let cats = post.getAttribute('data-categories') || '';
        return cats.split(',').map(c => c.trim()).includes(currentCategory);
      });
    }

    // 2) Tab filter
    if (currentTab === 'favorites') {
      postsToShow = postsToShow.filter(post => {
        let title = post.querySelector('h3')?.innerText;
        return favorites.includes(title);
      });
    } else if (currentTab === 'recents') {
      // Show latest 5 posts based on data-date
      postsToShow = [...postsToShow].sort((a,b) => {
        let dateA = parseInt(a.getAttribute('data-date')) || 0;
        let dateB = parseInt(b.getAttribute('data-date')) || 0;
        return dateB - dateA;
      }).slice(0, 5);
    } // 'all' tab shows everything after category filter

    // display/hide
    allPosts.forEach(post => post.style.display = 'none');
    postsToShow.forEach(post => post.style.display = 'block');
  }

  // Category button clicks
  catBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      catBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCategory = btn.getAttribute('data-cat');
      applyFilters();
    });
  });

  // Tab clicks
  tabBtns.forEach(tab => {
    tab.addEventListener('click', () => {
      tabBtns.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentTab = tab.getAttribute('data-tab');
      applyFilters();
    });
  });

  // Initial run
  addFavButtons();
  applyFilters();
});
