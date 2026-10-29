/* ------------------------------------------------------------------
   Résumé helpers, shared by the homepage section and resume.html.
   Both render from resume.json (JSON Resume schema).
   ------------------------------------------------------------------ */
window.Resume = (() => {
  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  const esc = (s) =>
    String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c])

  const date = (d) => {
    if (!d) return ''
    const [y, m] = d.split('-')
    return m ? `${MONTHS[+m - 1]} ${y}` : y
  }

  const range = (start, end) =>
    start ? `${date(start)} to ${end ? date(end) : 'Present'}` : date(end)

  const host = (url) => url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')

  const load = () =>
    fetch('resume.json').then((r) => {
      if (!r.ok) throw new Error(`resume.json: ${r.status}`)
      return r.json()
    })

  return { esc, date, range, host, load }
})()
