/* ------------------------------------------------------------------
   Notebook motion — typed headings, inked paragraphs, drawn strokes,
   stacked mockups, and the plug-in experience timeline
   ------------------------------------------------------------------ */
(() => {
  const root = document.documentElement
  const qa = (s, c = document) => [...c.querySelectorAll(s)]
  const q = (s, c = document) => c.querySelector(s)
  const motion = root.classList.contains('motion')

  /* ---------- reveal on scroll ---------- */
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return
        e.target.classList.add('in')
        io.unobserve(e.target)
      })
    },
    { threshold: 0.18, rootMargin: '0px 0px -8% 0px' }
  )

  /* ---------- text splitting ---------- */
  const textNodes = (el) => {
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT)
    const nodes = []
    while (walker.nextNode()) nodes.push(walker.currentNode)
    return nodes
  }

  // wraps each word in span.w; in 'type' mode each character also gets span.ch
  const split = (el, mode) => {
    let i = 0
    textNodes(el).forEach((node) => {
      const frag = document.createDocumentFragment()
      node.textContent.split(/(\s+)/).forEach((part) => {
        if (!part) return
        if (/^\s+$/.test(part)) return frag.append(part)
        const word = document.createElement('span')
        word.className = 'w'
        if (mode === 'type') {
          ;[...part].forEach((char) => {
            const ch = document.createElement('span')
            ch.className = 'ch'
            ch.textContent = char
            ch.style.setProperty('--i', (i++ + Math.random() * 0.6).toFixed(2))
            word.append(ch)
          })
        } else {
          word.textContent = part
          word.style.setProperty('--i', i++)
        }
        frag.append(word)
      })
      node.replaceWith(frag)
    })
    return i
  }

  const typeOut = (el) => {
    const label = el.textContent.replace(/\s+/g, ' ').trim()
    const n = split(el, 'type')
    const speed = Math.min(55, 1500 / n)
    el.style.setProperty('--speed', `${speed}ms`)
    el.style.setProperty('--done', `${n * speed}ms`)
    qa('.ch', el).at(-1)?.classList.add('last')

    // screen readers get the plain sentence, not a pile of letters
    const visual = document.createElement('span')
    visual.setAttribute('aria-hidden', 'true')
    visual.append(...el.childNodes)
    const sr = document.createElement('span')
    sr.className = 'sr-only'
    sr.textContent = label
    el.append(visual, sr)
    el.classList.add('type')
  }

  const watchAll = () =>
    qa('[data-type], [data-ink], [data-write], [data-draw], [data-reveal], [data-stack]').forEach((el) => io.observe(el))

  /* ---------- splash: name is written, subtitle typed, then the page is turned over ---------- */
  const splash = q('.splash')
  const splashing = root.classList.contains('splashing') && !!splash
  const loadFont = (font) => document.fonts.load(font).catch(() => {})

  // turn the splash page over from its bottom-right corner: the corner is pulled up and across to the
  // left, the fold is the perpendicular bisector between where the corner started and where it is now
  const peel = (page, after) => {
    const W = innerWidth
    const H = innerHeight
    const lift = Math.min(W, H) * 0.55
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    svg.setAttribute('class', 'page-curl')
    svg.setAttribute('aria-hidden', 'true')
    svg.innerHTML =
      '<defs><linearGradient id="curl-cast" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#15201d" stop-opacity=".3"/><stop offset="1" stop-color="#15201d" stop-opacity="0"/></linearGradient>' +
      '<linearGradient id="curl-back" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#d9ded9"/><stop offset=".2" stop-color="#fbfbf8"/><stop offset="1" stop-color="#eceee9"/></linearGradient>' +
      '<pattern id="curl-rules" patternUnits="userSpaceOnUse" width="64" height="32"><rect y="31" width="64" height="1" fill="#dce6f0"/></pattern></defs>' +
      '<polygon fill="url(#curl-cast)"/><polygon fill="url(#curl-back)"/><polygon fill="url(#curl-rules)" opacity=".6"/>'
    page.after(svg)
    const [cast, flap, rules] = svg.querySelectorAll('polygon')
    const rulePattern = svg.querySelector('pattern')
    const [castGrad, backGrad] = svg.querySelectorAll('linearGradient')
    const setLine = (g, a, b) => [['x1', a[0]], ['y1', a[1]], ['x2', b[0]], ['y2', b[1]]].forEach(([k, v]) => g.setAttribute(k, v))
    const pts = (list) => list.map(([x, y]) => `${x},${y}`).join(' ')

    // keep the part of a polygon where side() <= 0
    const cut = (poly, side) => {
      const out = []
      poly.forEach((a, i) => {
        const b = poly[(i + 1) % poly.length]
        const da = side(a)
        const db = side(b)
        if (da <= 0) out.push(a)
        if (da * db < 0) out.push([a[0] + ((b[0] - a[0]) * da) / (da - db), a[1] + ((b[1] - a[1]) * da) / (da - db)])
      })
      return out
    }
    const sheet = [[0, 0], [W, 0], [W, H], [0, H]]
    const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2)
    const DURATION = 1400
    let start

    const frame = (now) => {
      start ??= now
      const t = Math.min(1, (now - start) / DURATION)
      const s = ease(t)
      const corner = [W - 2 * W * s, H - lift * Math.sin(Math.PI * s)]
      const dx = W - corner[0]
      const dy = H - corner[1]
      const len = Math.hypot(dx, dy)
      if (len > 0.5) {
        const n = [dx / len, dy / len]
        const mid = [(W + corner[0]) / 2, (H + corner[1]) / 2]
        const side = (p) => (p[0] - mid[0]) * n[0] + (p[1] - mid[1]) * n[1]
        const kept = cut(sheet, side)
        const gone = cut(sheet, (p) => -side(p))
        // the lifted part, mirrored across the fold, is the back of the page
        const back = gone.map((p) => {
          const d = 2 * side(p)
          return [p[0] - d * n[0], p[1] - d * n[1]]
        })
        page.style.clipPath = kept.length > 2 ? `polygon(${kept.map(([x, y]) => `${x}px ${y}px`).join(',')})` : 'inset(50%)'
        flap.setAttribute('points', pts(back))
        rules.setAttribute('points', pts(back))
        // the ruled lines show faintly through the back, mirrored across the fold
        const k = 2 * (mid[0] * n[0] + mid[1] * n[1])
        rulePattern.setAttribute('patternTransform', `matrix(${1 - 2 * n[0] * n[0]} ${-2 * n[0] * n[1]} ${-2 * n[0] * n[1]} ${1 - 2 * n[1] * n[1]} ${k * n[0]} ${k * n[1]})`)
        cast.setAttribute('points', pts(gone))
        setLine(backGrad, mid, [mid[0] - (n[0] * len) / 2, mid[1] - (n[1] * len) / 2])
        setLine(castGrad, mid, [mid[0] + n[0] * 90, mid[1] + n[1] * 90])
      }
      if (t < 1) requestAnimationFrame(frame)
      else {
        svg.remove()
        after()
      }
    }
    requestAnimationFrame(frame)
  }

  const runSplash = (done) => {
    try {
      sessionStorage.setItem('re-splash', '1')
    } catch (e) {}

    // one span per letter, with a beat between words
    const name = q('.splash-name', splash)
    let k = 0
    const words = name.textContent.trim().split(/\s+/).map((w) => {
      const word = `<span class="word">${[...w].map((c) => `<span class="sl" style="--i:${k++}">${c}</span>`).join('')}</span>`
      k++
      return word
    })
    name.innerHTML = words.join(' ')
    const nameTime = k * 95

    const scribble = q('.scribble', splash)
    scribble.setAttribute('data-draw', '')
    scribble.style.setProperty('--delay', `${nameTime - 200}ms`)

    const sub = q('.splash-sub', splash)
    typeOut(sub)
    sub.style.setProperty('--speed', '24ms')
    sub.style.setProperty('--delay', `${nameTime + 250}ms`)
    const total = nameTime + 250 + qa('.ch', sub).length * 24 + 700

    let timer
    let finished = false
    const skipEvents = ['pointerdown', 'keydown', 'wheel', 'touchstart']
    const finish = () => {
      if (finished) return
      finished = true
      clearTimeout(timer)
      skipEvents.forEach((ev) => window.removeEventListener(ev, finish))
      peel(splash, () => {
        root.classList.remove('splashing')
        splash.remove()
      })
      done()
    }
    skipEvents.forEach((ev) => window.addEventListener(ev, finish, { passive: true }))

    // wait for the handwriting font so the name isn't written in a fallback face
    const fonts = document.fonts ? Promise.all([loadFont('700 1em Caveat'), loadFont('500 1em Fraunces')]) : Promise.resolve()
    Promise.race([fonts, new Promise((r) => setTimeout(r, 1500))]).then(() => {
      if (finished) return
      splash.classList.add('go')
      sub.classList.add('in')
      scribble.classList.add('in')
      timer = setTimeout(finish, total)
    })
  }

  // the hero headline is the splash subtitle, so after the splash it fades in rather than typing twice
  if (splashing) {
    const h1 = q('.hero h1')
    h1.removeAttribute('data-type')
    h1.setAttribute('data-reveal', '')
  }

  if (motion) {
    qa('[data-type]').forEach(typeOut)
    qa('[data-ink]').forEach((el) => {
      split(el, 'ink')
      el.classList.add('ink')
    })
    if (splashing) runSplash(watchAll)
    else watchAll()
  }

  /* ---------- hero: write the lede and intro on the ruled lines ---------- */
  const RULE = 32
  const lede = q('.lede')
  const intro = q('.intro')
  const sideBySide = window.matchMedia('(min-width: 1001px)')

  // pushes an element down (never up) until its top lands on a rule
  const snapToRule = (el, extra = 0) => {
    el.style.marginTop = ''
    const base = parseFloat(getComputedStyle(el).marginTop) + extra
    el.style.marginTop = `${base}px`
    let y = 0
    for (let n = el; n; n = n.offsetParent) y += n.offsetTop
    el.style.marginTop = `${base + ((RULE - (y % RULE)) % RULE)}px`
  }
  const snapHero = () => {
    if (lede) snapToRule(lede)
    if (!intro) return
    // beside the headline the intro sits roughly centred; stacked on mobile it follows the buttons
    const lift = sideBySide.matches ? Math.max(0, (intro.previousElementSibling.offsetHeight - intro.offsetHeight) / 2) : 0
    snapToRule(intro, lift)
  }
  snapHero()
  document.fonts?.ready.then(snapHero)
  window.addEventListener('resize', snapHero)

  /* ---------- nav: stuck / hide on scroll / active section ---------- */
  const nav = q('.nav')
  let lastY = window.scrollY
  let ticking = false
  window.addEventListener(
    'scroll',
    () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        const y = window.scrollY
        nav.classList.toggle('is-stuck', y > 30)
        nav.classList.toggle('is-hidden', motion && y > lastY && y > 240)
        lastY = y
        ticking = false
      })
    },
    { passive: true }
  )

  const links = new Map(qa('.nav-links a').map((a) => [a.hash.slice(1), a]))
  const sectionIo = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return
        links.forEach((a) => a.classList.remove('is-active'))
        links.get(e.target.id)?.classList.add('is-active')
      })
    },
    { rootMargin: '-45% 0px -50% 0px' }
  )
  links.forEach((_, id) => {
    const el = document.getElementById(id)
    if (el) sectionIo.observe(el)
  })

  window.__motionReady = true

  /* ---------- résumé data ---------- */
  if (!window.Resume) return
  const { esc, date, load } = window.Resume
  const resume = load()

  /* toolbox: skills from resume.json */
  const skills = q('[data-skills]')
  resume
    .then(({ skills: groups = [] }) => {
      if (!skills || !groups.length) return
      skills.innerHTML = groups
        .map((s) => `<div><dt>${esc(s.name)}</dt><dd>${esc((s.keywords || []).join(', '))}</dd></div>`)
        .join('')
      skills.closest('.toolbox').hidden = false
    })
    .catch(() => {})

  /* ---------- experience timeline: the plug ---------- */
  const timeline = q('[data-timeline]')
  if (!timeline) return
  const reduce = !motion
  const plug = q('.plug', timeline)
  const tablist = q('.stops', timeline)
  const panel = q('.stop-panel', timeline)
  const showAll = q('.show-all', timeline)
  const fullList = q('.full-list', timeline)

  const now = new Date().toISOString().slice(0, 7)
  const year = (d) => d.slice(0, 4)

  // flattens work, education and dated projects into one list of entries
  const entriesFrom = ({ work = [], education = [], projects = [] }) => [
    ...work
      .filter((w) => w.startDate)
      .map((w) => ({
        year: year(w.startDate),
        kind: 'Work',
        title: w.position,
        org: [w.name, w.location].filter(Boolean).join(' · '),
        text: w.summary,
        status: w.endDate ? `Until ${date(w.endDate)}` : 'Ongoing',
      })),
    ...education
      .filter((e) => e.startDate || e.endDate)
      .map((e) => ({
        year: year(e.startDate || e.endDate),
        kind: 'Study',
        title: [e.studyType, e.area].filter(Boolean).join(' '),
        org: [e.institution, e.location].filter(Boolean).join(' · '),
        text: e.summary,
        status: !e.endDate || e.endDate > now ? 'In progress' : 'Completed',
      })),
    ...projects
      .filter((p) => p.startDate)
      .map((p) => ({
        year: year(p.startDate),
        kind: 'Project',
        title: p.name,
        org: p.entity || '',
        text: p.description,
        status: p.endDate ? `Shipped ${date(p.endDate)}` : p.url ? 'Live' : 'Ongoing',
      })),
  ]

  const entryHTML = (e, k) => `
    <article class="entry" style="--k:${k}">
      <p class="kind">${esc(e.kind)}</p>
      <div class="entry-top"><h3>${esc(e.title)}</h3><span class="status">${esc(e.status)}</span></div>
      ${e.org ? `<p class="org">${esc(e.org)}</p>` : ''}
      ${e.text ? `<p>${esc(e.text)}</p>` : ''}
    </article>`

  resume
    .then((data) => {
      const entries = entriesFrom(data)
      const years = [...new Set(entries.map((e) => e.year))].sort()
      if (!years.length) throw new Error('no dated entries')
      const groups = years.map((y) => ({ year: y, items: entries.filter((e) => e.year === y) }))

      tablist.innerHTML = groups
        .map(
          (g, i) => `
          <button class="stop" type="button" role="tab" id="stop-${g.year}" aria-selected="false" tabindex="${i ? -1 : 0}">
            <span class="socket" aria-hidden="true"></span><span class="year">${g.year}</span>
          </button>`
        )
        .join('')
      const stops = qa('.stop', tablist)

      let current = -1
      let seatTimer
      let swapTimer

      // distance from the plug's anchor (off the card's left edge) to a socket's centre
      const reachFor = (i) => {
        const s = q('.socket', stops[i]).getBoundingClientRect()
        const t = q('.track', timeline).getBoundingClientRect()
        return s.left + s.width / 2 - t.left - plug.offsetLeft
      }

      const showPanel = (g) => {
        clearTimeout(swapTimer)
        const render = () => {
          panel.innerHTML = `<p class="panel-year" aria-hidden="true">${g.year}</p><div>${g.items.map(entryHTML).join('')}</div>`
          panel.setAttribute('aria-labelledby', `stop-${g.year}`)
          panel.classList.remove('is-swapping')
        }
        if (reduce || !panel.childElementCount) return render()
        panel.classList.add('is-swapping')
        swapTimer = setTimeout(render, 220)
      }

      const select = (i, focus) => {
        if (i === current) return
        current = i
        stops.forEach((b, j) => {
          b.setAttribute('aria-selected', String(j === i))
          b.tabIndex = j === i ? 0 : -1
          b.classList.remove('is-live')
        })
        if (focus) stops[i].focus()
        showPanel(groups[i])

        // slide up to the socket, then push the last few pixels home
        const reach = reachFor(i)
        clearTimeout(seatTimer)
        plug.classList.remove('seated')
        plug.style.setProperty('--reach', `${reach - 34}px`)
        seatTimer = setTimeout(
          () => {
            plug.classList.add('seated')
            plug.style.setProperty('--reach', `${reach - 8}px`)
            stops[i].classList.add('is-live')
          },
          reduce ? 0 : 780
        )
      }

      tablist.addEventListener('click', (ev) => {
        const b = ev.target.closest('.stop')
        if (b) select(stops.indexOf(b))
      })
      tablist.addEventListener('keydown', (ev) => {
        const keys = { ArrowRight: current + 1, ArrowLeft: current - 1, Home: 0, End: stops.length - 1 }
        if (!(ev.key in keys)) return
        ev.preventDefault()
        select((keys[ev.key] + stops.length) % stops.length, true)
      })

      // keep the plug seated when the layout reflows
      window.addEventListener('resize', () => {
        if (current < 0) return
        plug.classList.add('no-anim')
        plug.style.setProperty('--reach', `${reachFor(current) - 8}px`)
        requestAnimationFrame(() => plug.classList.remove('no-anim'))
      })

      // the cable plugs into the first year once the timeline scrolls into view
      new IntersectionObserver(
        (entries, obs) => {
          if (!entries[0].isIntersecting) return
          obs.disconnect()
          setTimeout(() => select(0), reduce ? 0 : 400)
        },
        { threshold: 0.4 }
      ).observe(timeline)

      fullList.innerHTML = [...entries]
        .sort((a, b) => b.year.localeCompare(a.year))
        .map(
          (e) => `
          <li><span class="yr">${e.year}</span><div><b>${esc(e.title)}</b><small>${esc(e.org)}</small></div><span class="status">${esc(e.status)}</span></li>`
        )
        .join('')
      showAll.addEventListener('click', () => {
        const open = fullList.hidden
        fullList.hidden = !open
        showAll.setAttribute('aria-expanded', String(open))
        showAll.textContent = open ? 'Hide the list ‹' : 'Show the whole list ›'
      })
    })
    .catch(() => {
      q('.track', timeline).hidden = true
      showAll.hidden = true
      panel.innerHTML = `<p class="timeline-error">The timeline couldn’t load — <a href="resume.pdf" download="Ryan-Emason-Resume.pdf">download the PDF résumé</a> instead.</p>`
    })
})()
