const observer = new IntersectionObserver((entries) => {
  entries.forEach(({ isIntersecting, target }) => {
    if (isIntersecting) target.classList.add('revealed')
  })
}, { threshold: .12 })

document.querySelectorAll('.project, .section-intro, .about-grid, .contact').forEach(el => observer.observe(el))
