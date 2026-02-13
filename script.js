/**
 * EMILE LENAIN - Portfolio
 * Modern JavaScript Interactions
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide icons
  lucide.createIcons();

  // Initialize all modules
  initNavigation();
  initScrollAnimations();
  initCursorFollower();
  initBackToTop();
  initSkillBars();
  initSmoothScroll();
});

/**
 * Navigation Module
 * Handles navbar scroll effects and active link highlighting
 */
function initNavigation() {
  const navbar = document.querySelector('.navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  // Navbar scroll effect
  const handleNavbarScroll = () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  // Active link highlighting based on scroll position
  const updateActiveLink = () => {
    const scrollPosition = window.scrollY + 100;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };

  // Throttled scroll handler
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        handleNavbarScroll();
        updateActiveLink();
        ticking = false;
      });
      ticking = true;
    }
  });

  // Initial check
  handleNavbarScroll();
  updateActiveLink();

  // Close mobile menu on link click
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      const navbarCollapse = document.querySelector('.navbar-collapse');
      if (navbarCollapse.classList.contains('show')) {
        const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
        if (bsCollapse) {
          bsCollapse.hide();
        }
      }
    });
  });
}

/**
 * Scroll Animations Module
 * Handles fade-in animations on scroll using Intersection Observer
 */
function initScrollAnimations() {
  const fadeElements = document.querySelectorAll('.fade-in');

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -50px 0px',
    threshold: 0.1
  };

  const observerCallback = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        
        // If it's a skill category, trigger skill bar animations
        if (entry.target.classList.contains('skill-category')) {
          const skillBars = entry.target.querySelectorAll('.skill-progress');
          skillBars.forEach((bar, index) => {
            setTimeout(() => {
              bar.style.width = bar.style.getPropertyValue('--progress');
            }, index * 100);
          });
        }
        
        observer.unobserve(entry.target);
      }
    });
  };

  const observer = new IntersectionObserver(observerCallback, observerOptions);

  fadeElements.forEach(element => {
    observer.observe(element);
  });
}

/**
 * Cursor Follower Module
 * Creates a custom cursor effect (desktop only)
 */
function initCursorFollower() {
  // Only on devices with fine pointer (mouse)
  if (!window.matchMedia('(pointer: fine)').matches) return;

  const cursor = document.querySelector('.cursor-follower');
  if (!cursor) return;

  let mouseX = 0;
  let mouseY = 0;
  let cursorX = 0;
  let cursorY = 0;

  // Track mouse position
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.classList.add('visible');
  });

  // Hide cursor when leaving window
  document.addEventListener('mouseleave', () => {
    cursor.classList.remove('visible');
  });

  // Smooth cursor animation
  const animateCursor = () => {
    const dx = mouseX - cursorX;
    const dy = mouseY - cursorY;
    
    cursorX += dx * 0.15;
    cursorY += dy * 0.15;
    
    cursor.style.left = `${cursorX}px`;
    cursor.style.top = `${cursorY}px`;
    
    requestAnimationFrame(animateCursor);
  };

  animateCursor();

  // Cursor effects on interactive elements
  const interactiveElements = document.querySelectorAll('a, button, .project-card, .skill-category');
  
  interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
      cursor.style.borderColor = 'var(--color-accent-secondary)';
    });
    
    el.addEventListener('mouseleave', () => {
      cursor.style.transform = 'translate(-50%, -50%) scale(1)';
      cursor.style.borderColor = 'var(--color-accent-primary)';
    });
  });
}

/**
 * Back to Top Button Module
 */
function initBackToTop() {
  const backToTopBtn = document.getElementById('backToTop');
  if (!backToTopBtn) return;

  // Show/hide button based on scroll position
  const toggleBackToTop = () => {
    if (window.scrollY > 500) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  };

  // Throttled scroll handler
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        toggleBackToTop();
        ticking = false;
      });
      ticking = true;
    }
  });

  // Scroll to top on click
  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  // Initial check
  toggleBackToTop();
}

/**
 * Skill Bars Animation Module
 * Animates skill progress bars when they come into view
 */
function initSkillBars() {
  const skillCategories = document.querySelectorAll('.skill-category');
  
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.3
  };

  const observerCallback = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const skillBars = entry.target.querySelectorAll('.skill-progress');
        skillBars.forEach((bar, index) => {
          setTimeout(() => {
            bar.style.width = bar.style.getPropertyValue('--progress');
          }, index * 150);
        });
        observer.unobserve(entry.target);
      }
    });
  };

  const observer = new IntersectionObserver(observerCallback, observerOptions);

  skillCategories.forEach(category => {
    observer.observe(category);
  });
}

/**
 * Smooth Scroll Module
 * Handles smooth scrolling for anchor links
 */
function initSmoothScroll() {
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  
  anchorLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      
      // Skip if it's just "#"
      if (href === '#') return;
      
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        
        const navbarHeight = document.querySelector('.navbar').offsetHeight;
        const targetPosition = target.offsetTop - navbarHeight - 20;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

/**
 * Typing Effect (Optional - for hero section)
 * Can be used to create a typewriter effect
 */
function initTypingEffect(element, texts, speed = 100, pause = 2000) {
  if (!element) return;
  
  let textIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  
  const type = () => {
    const currentText = texts[textIndex];
    
    if (isDeleting) {
      element.textContent = currentText.substring(0, charIndex - 1);
      charIndex--;
    } else {
      element.textContent = currentText.substring(0, charIndex + 1);
      charIndex++;
    }
    
    let typeSpeed = speed;
    
    if (isDeleting) {
      typeSpeed /= 2;
    }
    
    if (!isDeleting && charIndex === currentText.length) {
      typeSpeed = pause;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      textIndex = (textIndex + 1) % texts.length;
    }
    
    setTimeout(type, typeSpeed);
  };
  
  type();
}

/**
 * Add spinning animation for loading state
 */
const style = document.createElement('style');
style.textContent = `
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  .spinning {
    animation: spin 1s linear infinite;
  }
`;
document.head.appendChild(style);

/**
 * Parallax Effect for Hero Section (Optional)
 */
function initParallax() {
  const hero = document.getElementById('hero');
  if (!hero) return;

  const shapes = hero.querySelectorAll('.shape');
  
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    
    shapes.forEach((shape, index) => {
      const speed = 0.1 + (index * 0.05);
      shape.style.transform = `translateY(${scrolled * speed}px)`;
    });
  });
}

// Uncomment to enable parallax
// initParallax();

/**
 * Lazy Loading for Images (Optional Enhancement)
 */
function initLazyLoading() {
  const images = document.querySelectorAll('img[data-src]');
  
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        observer.unobserve(img);
      }
    });
  });
  
  images.forEach(img => imageObserver.observe(img));
}

// Console Easter Egg
console.log(`
%c🚀 Portfolio d'Emile Lenain
%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
%cDéveloppeur Web Junior
%cÀ la recherche d'une alternance

%c📧 Contact: lenain.emile@gmail.com
%c💼 LinkedIn: linkedin.com/in/emile-lenain-30450a343/
%c🐙 GitHub: github.com/lenain-emile
`,
  'color: #6366f1; font-size: 20px; font-weight: bold;',
  'color: #8b5cf6;',
  'color: #a855f7; font-size: 14px;',
  'color: #22c55e; font-size: 12px;',
  'color: #94a3b8; font-size: 11px;',
  'color: #94a3b8; font-size: 11px;',
  'color: #94a3b8; font-size: 11px;'
);
