// Animation fade-in au scroll
const faders = document.querySelectorAll('.fade-in');

const appearOnScroll = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
      observer.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.2
});

faders.forEach(fader => {
  appearOnScroll.observe(fader);
});

// Formulaire
document.querySelector("form").addEventListener("submit", function (e) {
  e.preventDefault();
  alert("Merci pour votre message !");
});
