const observer = new IntersectionObserver((entries) => {
  entries.forEach(({ isIntersecting, target }) => {
    if (isIntersecting) target.classList.add('revealed')
  })
}, { threshold: 0.12 })

document.querySelectorAll('.case, .section-head, .now-grid, .about, .contact').forEach((element) => observer.observe(element))
