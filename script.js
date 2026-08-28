/* ------------------------------------------------------------------
   Portfolio motion — reveals, sticky nav, parallax, magnetic buttons
   ------------------------------------------------------------------ */
(() => {
  const qa = (s, c = document) => [...c.querySelectorAll(s)]
  const q = (s, c = document) => c.querySelector(s)
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches

  /* ---------- scroll progress bar ---------- */
  const bar = document.createElement('div')
  bar.className = 'progress'
  document.body.appendChild(bar)

  /* ---------- scroll-driven state (progress + nav) ---------- */
  const nav = q('.nav')
  let lastY = window.scrollY
  let ticking = false

  const onScroll = () => {
    if (ticking) return
    ticking = true
    requestAnimationFrame(() => {
      const y = window.scrollY
      const max = document.documentElement.scrollHeight - window.innerHeight
      bar.style.transform = `scaleX(${max > 0 ? Math.min(y / max, 1) : 0})`

      if (nav) {
        nav.classList.toggle('nav--stuck', y > 40)
        if (!reduce) {
          if (y > lastY && y > 220) nav.classList.add('nav--hidden')
          else nav.classList.remove('nav--hidden')
        }
      }
      lastY = y
      ticking = false
    })
  }
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()

  /* ---------- scroll reveals ---------- */
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('in')
          io.unobserve(e.target)
        }
      })
    },
    { threshold: 0.14, rootMargin: '0px 0px -8% 0px' }
  )

  const reveal = (nodes, { cls = 'r', step = 70, base = 0 } = {}) => {
    ;[...nodes].forEach((n, i) => {
      if (!n) return
      n.classList.add(cls)
      n.style.setProperty('--d', `${base + i * step}ms`)
      io.observe(n)
    })
  }

  reveal(qa('.hero-top > *'), { step: 90 })
  reveal(qa('.hero-copy > *'), { step: 130, base: 120 })
  reveal([q('.hero-panel')], { base: 260 })
  reveal([q('.statement p')])
  reveal(qa('.section-head > *'), { step: 110 })
  reveal(qa('.case'), { step: 130 })
  reveal(qa('.case-visual'), { cls: 'r-clip' })
  reveal(qa('.now-grid > *'), { step: 120 })
  reveal(qa('.now-tags span'), { step: 45 })
  reveal(qa('.about > *'), { step: 130 })
  reveal(qa('.skill-list span'), { step: 55 })
  reveal(qa('.contact .shell > *'), { step: 100 })

  /* ---------- active nav link ---------- */
  const linkFor = new Map(
    qa('.nav-links a').map((a) => [a.getAttribute('href').slice(1), a])
  )
  const sectionIo = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return
        qa('.nav-links a').forEach((a) => a.classList.remove('is-active'))
        linkFor.get(e.target.id)?.classList.add('is-active')
      })
    },
    { rootMargin: '-45% 0px -50% 0px' }
  )
  ;['work', 'now', 'about'].forEach((id) => {
    const el = document.getElementById(id)
    if (el) sectionIo.observe(el)
  })

  if (reduce || !canHover) return

  /* ---------- hero panel: cursor glow + parallax ---------- */
  const hero = q('.hero')
  const panel = q('.hero-panel')
  if (hero && panel) {
    hero.addEventListener('mousemove', (ev) => {
      const r = panel.getBoundingClientRect()
      const x = (ev.clientX - r.left) / r.width
      const y = (ev.clientY - r.top) / r.height
      panel.style.setProperty('--mx', `${x * 100}%`)
      panel.style.setProperty('--my', `${y * 100}%`)
      panel.style.transform = `translate(${(x - 0.5) * 12}px, ${(y - 0.5) * 12}px)`
    })
    hero.addEventListener('mouseleave', () => {
      panel.style.transform = ''
    })
  }

  /* ---------- magnetic buttons ---------- */
  const magnetize = (el, strength = 0.32) => {
    el.addEventListener('mousemove', (e) => {
      const r = el.getBoundingClientRect()
      const mx = (e.clientX - r.left - r.width / 2) * strength
      const my = (e.clientY - r.top - r.height / 2) * strength
      el.style.transform = `translate(${mx}px, ${my}px)`
    })
    el.addEventListener('mouseleave', () => {
      el.style.transform = ''
    })
  }
  qa('.nav-contact, .brand, .circle-link, .email').forEach((el) => magnetize(el))
})()
