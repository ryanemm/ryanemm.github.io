/* ------------------------------------------------------------------
   Cookie consent + Google Analytics (GA4).
   GA only loads after the visitor says yes; the choice is remembered in
   localStorage. GoatCounter is cookieless, so it runs regardless.
   Any [data-consent-open] element reopens the note to change the choice.
   ------------------------------------------------------------------ */
(() => {
  const GA_ID = 'G-KECWXFQQJC'
  const KEY = 'cookie-consent'
  const local = /^(localhost|127\.|0\.0\.0\.0|\[::1\]|$)/.test(location.hostname)

  let memory = null // fallback when storage is blocked
  const read = () => {
    try { return localStorage.getItem(KEY) } catch { return memory }
  }
  const save = (v) => {
    memory = v
    try { localStorage.setItem(KEY, v) } catch {}
  }

  window.dataLayer = window.dataLayer || []
  function gtag() { dataLayer.push(arguments) }

  let loaded = false
  const startAnalytics = () => {
    if (loaded || local) return
    loaded = true
    const s = document.createElement('script')
    s.async = true
    s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`
    document.head.appendChild(s)
    gtag('js', new Date())
    gtag('config', GA_ID)
    // tracked clicks reuse the GoatCounter event names
    document.addEventListener('click', (e) => {
      const el = e.target.closest('[data-goatcounter-click]')
      if (el) gtag('event', el.dataset.goatcounterClick, { link_url: el.href })
    })
  }

  // clear GA's cookies (set on the bare host and on .domain) when consent is withdrawn
  const clearCookies = () => {
    const parts = location.hostname.split('.')
    const domains = ['', location.hostname, '.' + parts.slice(-2).join('.')]
    document.cookie.split(';').map((c) => c.split('=')[0].trim()).filter((n) => /^_ga/.test(n)).forEach((n) => {
      domains.forEach((d) => {
        document.cookie = `${n}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/${d ? `; domain=${d}` : ''}`
      })
    })
  }

  const css = `
.consent{position:fixed;z-index:60;right:24px;bottom:24px;width:min(360px,calc(100vw - 32px));padding:26px 24px 20px;background:#fff;border-radius:3px;
  box-shadow:0 1px 2px rgba(21,32,29,.08),0 30px 50px -24px rgba(21,32,29,.5);color:var(--ink,#15201d);font:400 14px/1.55 var(--sans,'DM Sans',system-ui,sans-serif);
  rotate:.8deg;transition:opacity .45s cubic-bezier(.16,1,.3,1),translate .45s cubic-bezier(.16,1,.3,1)}
.consent[data-state=out]{opacity:0;translate:0 24px;pointer-events:none}
.consent::before{content:"";position:absolute;top:-13px;left:50%;width:104px;height:26px;translate:-50% 0;rotate:-4deg;background:rgba(221,255,113,.6);
  box-shadow:0 1px 2px rgba(21,32,29,.08);clip-path:polygon(2% 0,98% 0,100% 22%,97% 42%,100% 62%,97% 82%,99% 100%,1% 100%,3% 78%,0 58%,3% 38%,0 18%)}
.consent h2{margin:0 0 6px;font:600 28px/1 var(--hand,'Caveat','Bradley Hand',cursive);color:var(--pen,#2a4aa8);letter-spacing:0;text-transform:none;display:block}
.consent h2::before,.consent h2::after{content:none}
.consent p{margin:0;color:var(--muted,#56615c)}
.consent .row{display:flex;gap:10px;margin-top:16px}
.consent button{flex:1;min-height:42px;padding:0 16px;border-radius:12px;font:600 14px/1 var(--sans,'DM Sans',system-ui,sans-serif);cursor:pointer;transition:background .25s ease,translate .3s cubic-bezier(.16,1,.3,1)}
.consent button:hover{translate:0 -2px}
.consent .yes{background:var(--ink,#15201d);color:#fff;border:0}
.consent .yes:hover{background:var(--orange,#ef5a35)}
.consent .no{background:#fff;color:var(--ink,#15201d);border:1.5px solid var(--ink,#15201d)}
.consent .no:hover{background:var(--acid,#ddff71)}
@media (max-width:520px){.consent{right:16px;bottom:16px;rotate:0deg}}
@media (prefers-reduced-motion:reduce){.consent{transition:none}}
@media print{.consent{display:none}}`

  let note
  const build = () => {
    const style = document.createElement('style')
    style.textContent = css
    document.head.appendChild(style)
    note = document.createElement('aside')
    note.className = 'consent'
    note.dataset.state = 'out'
    note.setAttribute('aria-label', 'Cookie consent')
    note.innerHTML = `
      <h2>Mind a cookie?</h2>
      <p>I use Google Analytics to see how people find this site. It sets cookies, so it only runs if you say yes.</p>
      <div class="row"><button type="button" class="yes">Sure</button><button type="button" class="no">No thanks</button></div>`
    note.querySelector('.yes').addEventListener('click', () => choose('granted'))
    note.querySelector('.no').addEventListener('click', () => choose('denied'))
    document.body.appendChild(note)
  }

  const show = () => {
    if (!note) build()
    requestAnimationFrame(() => requestAnimationFrame(() => { note.dataset.state = 'in' }))
  }
  const hide = () => { if (note) note.dataset.state = 'out' }

  const choose = (v) => {
    const was = read()
    save(v)
    hide()
    if (v === 'granted') startAnalytics()
    else if (was === 'granted') { clearCookies(); if (loaded) location.reload() }
  }

  // wait for the homepage splash to finish so the note isn't hidden under it
  const whenReady = (fn) => {
    const root = document.documentElement
    if (!root.classList.contains('splashing')) return setTimeout(fn, 600)
    const obs = new MutationObserver(() => {
      if (!root.classList.contains('splashing')) { obs.disconnect(); setTimeout(fn, 900) }
    })
    obs.observe(root, { attributes: true, attributeFilter: ['class'] })
  }

  const init = () => {
    document.addEventListener('click', (e) => {
      if (e.target.closest('[data-consent-open]')) { e.preventDefault(); show() }
    })
    const choice = read()
    if (choice === 'granted') startAnalytics()
    else if (choice !== 'denied') whenReady(show)
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init)
  else init()
})()
