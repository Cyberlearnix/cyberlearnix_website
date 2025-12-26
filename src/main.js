import './style.css'

console.log('Cyberlearnix Website Loaded');

document.addEventListener('DOMContentLoaded', () => {

  // === Global Safety Catch for unwanted Hash URLs ===
  document.addEventListener('click', (e) => {
    const anchor = e.target.closest('a');
    if (anchor) {
      const href = anchor.getAttribute('href');
      if (href === '#' || href === 'javascript:void(0);') {
        e.preventDefault();
      }
    }
  });

  // === CONTENT PROTECTION SYSTEM ===
  // 1. Disable Right-click
  document.addEventListener('contextmenu', (e) => e.preventDefault());

  // 2. Disable Keyboard Shortcuts (Copy, Save, View Source, Print)
  document.addEventListener('keydown', (e) => {
    // CMD/CTRL + C, S, U, P, I, J
    if (e.ctrlKey || e.metaKey) {
      if (['c', 's', 'u', 'p', 'i', 'j'].includes(e.key.toLowerCase())) {
        e.preventDefault();
        return false;
      }
    }
    // F12 (DevTools)
    if (e.key === 'F12') {
      e.preventDefault();
      return false;
    }
  });

  // 3. Prevent dragging of any element
  document.addEventListener('dragstart', (e) => e.preventDefault());

  // === Automatic Animation Engine ===
  const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      } else {
        entry.target.classList.remove('is-visible');
      }
    });
  }, { threshold: 0.1 });

  const commonAnimatedSelectors = [
    '.section-title', '.section-subtitle', '.page-header h1', '.page-header p',
    '.feature-item', '.partner-logo', '.service-card', '.course-card',
    '.about-text p', '.cta-card', '.contact-wrapper', '.footer-col', '.social-icon'
  ];

  const processDropdowns = (root) => {
    const navItems = root.querySelectorAll ? root.querySelectorAll('.nav-links li') : [];
    navItems.forEach(li => {
      const subMenu = li.querySelector('ul');
      if (subMenu) {
        li.classList.add('has-dropdown');
        subMenu.classList.add('dropdown-menu');
        const link = li.querySelector('a');
        if (link && !link.querySelector('.arrow')) {
          const arrow = document.createElement('span');
          arrow.className = 'arrow';
          arrow.innerHTML = '▾';
          link.appendChild(arrow);
        }
        if (link) {
          link.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
              e.preventDefault();
              li.classList.toggle('active');
            }
          });
        }
      }
    });
  };

  const processAnimations = (root) => {
    if (!root) return;
    processDropdowns(root);
    commonAnimatedSelectors.forEach(selector => {
      if (root.matches && root.matches(selector)) {
        root.classList.add('animate-on-scroll');
        scrollObserver.observe(root);
      }
      if (root.querySelectorAll) {
        root.querySelectorAll(selector).forEach(el => {
          el.classList.add('animate-on-scroll');
          scrollObserver.observe(el);
        });
      }
    });
    if (root.querySelectorAll) {
      const grids = root.querySelectorAll('.features-grid, .services-grid, .courses-grid');
      grids.forEach(grid => {
        Array.from(grid.children).forEach(child => {
          child.classList.add('animate-on-scroll');
          scrollObserver.observe(child);
        });
      });
    }
  };

  processAnimations(document);

  const mutationObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === 1) processAnimations(node);
      });
    });
  });

  mutationObserver.observe(document.body, { childList: true, subtree: true });

  // === Navigation Logic (SPA Tab Switching) ===
  const pageViews = document.querySelectorAll('.page-view');
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navLinksContainer = document.querySelector('.nav-links');

  document.addEventListener('click', (e) => {
    const link = e.target.closest('[data-page]');
    if (!link) return;

    const targetPage = link.getAttribute('data-page');
    if (!targetPage) return;

    e.preventDefault();
    switchToPage(targetPage);
  });

  const switchToPage = (targetPage) => {
    // SECURITY GUARD: Prevent direct navigation to dashboard without a session
    if (targetPage === 'admin-dashboard' && !sessionStorage.getItem('isCyberAdmin')) {
      targetPage = 'admin-login';
    }

    pageViews.forEach(view => {
      view.style.display = 'none';
      view.classList.remove('active-view');
    });

    const targetView = document.getElementById(`${targetPage}-view`);
    if (targetView) {
      targetView.style.display = 'block';
      setTimeout(() => targetView.classList.add('active-view'), 10);
      window.scrollTo({ top: 0, behavior: 'instant' });
      setTimeout(() => processAnimations(targetView), 100);
    }

    // Update active nav links
    document.querySelectorAll('[data-page]').forEach(nav => nav.classList.remove('active'));
    document.querySelectorAll(`[data-page="${targetPage}"]`).forEach(l => {
      l.classList.add('active');
      const dropdownParent = l.closest('.has-dropdown');
      if (dropdownParent) {
        const categoryLink = dropdownParent.querySelector(':scope > a');
        if (categoryLink) categoryLink.classList.add('active');
      }
    });

    if (navLinksContainer && navLinksContainer.classList.contains('active')) {
      navLinksContainer.classList.remove('active');
      if (mobileToggle) mobileToggle.classList.remove('active');
    }
  };

  // === CMS DATA ENGINE ===
  const initialData = {
    courses: [
      { id: 'cyber-essentials', title: 'Cybersecurity Essentials', desc: 'Start your journey into the world of digital security.', img: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80' },
      { id: 'ethical-hacking', title: 'Ethical Hacking', desc: 'Learn to think like a hacker to defend against them.', img: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80' },
      { id: 'soc-analyst', title: 'SOC Analyst Program', desc: 'Become an expert in security operations and monitoring.', img: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80' }
    ],
    partners: ['GOOGLE', 'MICROSOFT', 'AMAZON', 'CISCO', 'IBM', 'ORACLE', 'INTEL'],
    updates: [
      { icon: '🆕', title: 'New Batch Starting', desc: 'Our next "Certified Ethical Hacker" batch starts on Jan 15th.', link: 'contact', btnText: 'Register Now' },
      { icon: '🤝', title: 'Strategic Partnership', desc: 'We are proud to announce our partnership with leading tech firms.', link: 'about', btnText: 'Read More' },
      { icon: '🚀', title: 'Cyberlearnix 2.0 Launch', desc: "We've revamped our digital presence to serve you better.", link: '', btnText: '' }
    ]
  };

  let CMS_DATA = JSON.parse(localStorage.getItem('CYBER_CMS')) || initialData;

  const saveCMS = () => {
    localStorage.setItem('CYBER_CMS', JSON.stringify(CMS_DATA));
    renderDynamicContent();
  };

  const renderDynamicContent = () => {
    const coursesGrid = document.querySelector('#courses-view .courses-grid');
    if (coursesGrid) {
      coursesGrid.innerHTML = CMS_DATA.courses.map(course => `
        <div class="course-card">
          <div class="course-image">
            <img src="${course.img}" alt="${course.title}" style="width: 100%; height: 100%; object-fit: cover;">
          </div>
          <div class="course-content">
            <h3>${course.title}</h3>
            <p>${course.desc}</p>
            <a href="javascript:void(0);" data-page="${course.id}" class="btn-link nav-link">Learn More &rarr;</a>
          </div>
        </div>
      `).join('');
    }

    const marqueeTrack = document.querySelector('.marquee-track');
    if (marqueeTrack) {
      const partnerHTML = CMS_DATA.partners.map(p => `<div class="partner-logo">${p}</div>`).join('');
      marqueeTrack.innerHTML = partnerHTML + partnerHTML;
    }

    const updatesGrid = document.querySelector('#latest-updates-section .services-grid');
    if (updatesGrid) {
      updatesGrid.innerHTML = CMS_DATA.updates.map(u => `
        <div class="service-card" style="align-items: flex-start; text-align: left;">
          <div class="service-icon">${u.icon}</div>
          <h3>${u.title}</h3>
          <p>${u.desc}</p>
          ${u.link ? `<a href="javascript:void(0);" data-page="${u.link}" class="btn-link nav-link" style="margin-top: 1rem;">${u.btnText} &rarr;</a>` : ''}
        </div>
      `).join('');
    }

    if (document.getElementById('stat-courses')) document.getElementById('stat-courses').innerText = CMS_DATA.courses.length;
    if (document.getElementById('stat-partners')) document.getElementById('stat-partners').innerText = CMS_DATA.partners.length;

    // IMPORTANT: Re-process animations for the new dynamic elements
    setTimeout(() => processAnimations(document.body), 50);
  };

  renderDynamicContent();

  // Mobile Menu Toggle (Restored)
  if (mobileToggle && navLinksContainer) {
    mobileToggle.addEventListener('click', () => {
      navLinksContainer.classList.toggle('active');
      mobileToggle.classList.toggle('active');
    });
  }

  // === Admin Portal Security ===
  let loginAttempts = 0;
  const ATTEMPT_LIMIT = 3;
  let isLocked = false;

  const loginForm = document.getElementById('admin-login-form');
  const loginError = document.getElementById('login-error');

  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();

      if (isLocked) {
        alert("Security Lock: Too many failed attempts. Refresh or try later.");
        return;
      }

      const user = document.getElementById('admin-user').value;
      const pass = document.getElementById('admin-pass').value;

      // Obfuscated credential check (Mock)
      const validU = "YWRtaW4="; // base64 for admin
      const validP = "Y3liZXIxMjM="; // base64 for cyber123

      if (btoa(user) === validU && btoa(pass) === validP) {
        sessionStorage.setItem('isCyberAdmin', 'true');
        loginAttempts = 0;
        switchToPage('admin-dashboard');
        renderAdminDashboard();
      } else {
        loginAttempts++;
        loginError.innerText = `Invalid credentials. Attempt ${loginAttempts}/${ATTEMPT_LIMIT}`;
        loginError.style.display = 'block';

        if (loginAttempts >= ATTEMPT_LIMIT) {
          isLocked = true;
          loginError.innerText = "SECURITY ALERT: Panel locked due to brute force activity.";
          setTimeout(() => { isLocked = false; loginAttempts = 0; }, 30000); // 30 sec lock
        }
      }
    });
  }

  const renderAdminDashboard = () => {
    const courseAdminList = document.getElementById('course-list-admin');
    if (courseAdminList) {
      courseAdminList.innerHTML = CMS_DATA.courses.map((c, i) => `
        <div class="admin-item-row">
          <div><strong>${c.title}</strong></div>
          <div style="display: flex; gap: 0.5rem;">
            <button class="btn btn-primary" style="padding: 0.4rem 1rem;" onclick="editCourse(${i})">Edit</button>
            <button class="btn btn-secondary" style="padding: 0.4rem 1rem; color: #e10600; border-color: #e10600;" onclick="deleteCourse(${i})">Delete</button>
          </div>
        </div>
      `).join('');
    }

    const partnerAdminList = document.getElementById('partner-list-admin');
    if (partnerAdminList) {
      partnerAdminList.innerHTML = CMS_DATA.partners.map((p, i) => `
        <div class="admin-item-row" style="padding: 0.5rem 1rem;">
          <span>${p}</span>
          <button style="border:none; color: red; background: none; cursor:pointer;" onclick="deletePartner(${i})">×</button>
        </div>
      `).join('');
      const addBtn = document.createElement('button');
      addBtn.innerText = '+ Add Partner';
      addBtn.className = 'btn btn-primary';
      addBtn.onclick = () => {
        const pName = prompt('Enter Partner Name:');
        if (pName) { CMS_DATA.partners.push(pName.toUpperCase()); saveCMS(); renderAdminDashboard(); }
      };
      partnerAdminList.appendChild(addBtn);
    }
  };

  document.querySelectorAll('.admin-nav').forEach(nav => {
    nav.addEventListener('click', () => {
      document.querySelectorAll('.admin-nav').forEach(n => n.classList.remove('active'));
      nav.classList.add('active');
      const tabId = nav.getAttribute('data-tab');
      document.querySelectorAll('.admin-tab').forEach(tab => tab.style.display = 'none');
      document.getElementById(`tab-${tabId}`).style.display = 'block';
    });
  });

  document.getElementById('admin-logout')?.addEventListener('click', () => {
    sessionStorage.removeItem('isCyberAdmin');
    switchToPage('home');
  });

  const checkAuth = () => {
    if (!sessionStorage.getItem('isCyberAdmin')) {
      alert("Session Expired or Unauthorized.");
      switchToPage('admin-login');
      return false;
    }
    return true;
  };

  window.deletePartner = (index) => { if (checkAuth()) { CMS_DATA.partners.splice(index, 1); saveCMS(); renderAdminDashboard(); } };
  window.deleteCourse = (index) => { if (checkAuth() && confirm('Delete?')) { CMS_DATA.courses.splice(index, 1); saveCMS(); renderAdminDashboard(); } };
  window.editCourse = (index) => {
    if (!checkAuth()) return;
    const c = CMS_DATA.courses[index];
    const newTitle = prompt('Title:', c.title);
    if (newTitle) { c.title = newTitle; saveCMS(); renderAdminDashboard(); }
  };

  // === Hero Slider Logic ===
  const slides = document.querySelectorAll('.slide');
  const dots = document.querySelectorAll('.dot');
  const prevBtn = document.querySelector('.prev-btn');
  const nextBtn = document.querySelector('.next-btn');

  if (slides.length > 0) {
    let currentSlide = 0;
    const slideIntervalTime = 5000;
    let slideInterval;

    const showSlide = (index) => {
      if (index >= slides.length) currentSlide = 0;
      else if (index < 0) currentSlide = slides.length - 1;
      else currentSlide = index;

      slides.forEach((slide, i) => {
        slide.classList.remove('active');
        if (dots[i]) dots[i].classList.remove('active');
        if (i === currentSlide) {
          slide.classList.add('active');
          if (dots[i]) dots[i].classList.add('active');
        }
      });
    };

    const nextSlide = () => showSlide(currentSlide + 1);
    const prevSlide = () => showSlide(currentSlide - 1);

    if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); resetTimer(); });
    if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); resetTimer(); });

    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => { showSlide(index); resetTimer(); });
    });

    const startTimer = () => { slideInterval = setInterval(nextSlide, slideIntervalTime); };
    const resetTimer = () => { clearInterval(slideInterval); startTimer(); };

    startTimer();
  }

  // === Counter Logic for Stats ===
  const counters = document.querySelectorAll('.counter');
  const runCounters = () => {
    counters.forEach(counter => {
      const target = +counter.getAttribute('data-target');
      counter.innerText = '0';
      const update = () => {
        const count = +counter.innerText;
        const inc = target / 100;
        if (count < target) {
          counter.innerText = Math.ceil(count + inc);
          setTimeout(update, 20);
        } else counter.innerText = target;
      };
      update();
    });
  };

  const statsSection = document.querySelector('#stats-section');
  if (statsSection) {
    new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) runCounters();
    }, { threshold: 0.1 }).observe(statsSection);
  }

});
