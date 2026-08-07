#!/usr/bin/env node
// Parses the raw /memory:search event streams into per-cell metrics, then
// aggregates mean + sample standard deviation across the replicate samples.
// The quality and citation logic the command emits is deterministic from the
// retrieval scores, so a stable model should reproduce the same verdict across
// samples; variance here is the honest signal of how stochastic each model is.

import { readFileSync, existsSync, writeFileSync, readdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url))
const PHASE_DIR = dirname(SCRIPT_DIR)
const RAW_DIR = join(PHASE_DIR, 'results', 'raw')
const META_DIR = join(PHASE_DIR, 'results', 'meta')
const cfg = JSON.parse(readFileSync(join(SCRIPT_DIR, 'benchmark-config.json'), 'utf8'))

const mean = (a) => (a.length ? a.reduce((x, y) => x + y, 0) / a.length : 0)
const stdev = (a) => {
  if (a.length < 2) return 0
  const m = mean(a)
  return Math.sqrt(mean(a.map((x) => (x - m) ** 2)))
}
const mode = (a) => {
  const c = {}
  for (const v of a) c[v] = (c[v] || 0) + 1
  return Object.entries(c).sort((x, y) => y[1] - x[1])[0]?.[0] ?? '-'
}
const round = (n, d = 2) => Math.round(n * 10 ** d) / 10 ** d

function parseCell(key) {
  const rp = join(RAW_DIR, `${key}.json`)
  if (!existsSync(rp)) return null
  const text = readFileSync(rp, 'utf8')
  let toolsTotal = 0, toolsMem = 0
  const texts = []
  for (const line of text.split('\n')) {
    const t = line.trim()
    if (!t) continue
    let ev
    try { ev = JSON.parse(t) } catch { continue }
    const part = ev.part
    if (part && typeof part === 'object') {
      if (part.type === 'tool') {
        toolsTotal++
        const name = (part.tool || '').toLowerCase()
        if (name.includes('memory') || name.includes('graph')) toolsMem++
      }
      if (part.type === 'text' && typeof part.text === 'string') texts.push(part.text)
    }
  }
  const full = texts.join('')
  const rq = /requestQuality (\w+)/.exec(full)?.[1] ?? null
  const cite = /citationPolicy (\w+)/.exec(full)?.[1] ?? null
  const results = Number(/RESULTS=(\d+)/.exec(full)?.[1] ?? -1)
  const intent = (/(?:INTENT=|intent=)(\w+)/.exec(full)?.[1]) ?? null
  const scores = (full.match(/\b0\.\d\d\b/g) || []).map(Number)
  const topScore = scores.length ? Math.max(...scores) : 0
  // Envelope fidelity: the seven contract slots a non-empty result should carry.
  const fid =
    [/MEMORY:SEARCH/.test(full), topScore > 0, /#\d+/.test(full),
     full.length > 40, /STATUS=OK/.test(full), rq != null, cite != null]
      .filter(Boolean).length
  // A weak verdict is correct whether it hedges or drops, so score citation
  // policy against the valid set per request-quality tier.
  const VALID_CITE = { good: ['cite_results'], weak: ['cite_with_caveat', 'do_not_cite_results'], gap: ['do_not_cite_results'] }
  const citeCorrect = cite == null ? null : (VALID_CITE[rq] || []).includes(cite)
  let latencyMs = null, exit = null
  const mp = join(META_DIR, `${key}.meta.json`)
  if (existsSync(mp)) {
    const m = JSON.parse(readFileSync(mp, 'utf8'))
    latencyMs = m.latencyMs ?? null
    exit = m.exit ?? null
  }
  return { key, toolsTotal, toolsMem, chars: full.length, requestQuality: rq,
           citationPolicy: cite, citeCorrect, results, intent, topScore,
           envelopeFidelity: fid, latencyMs, exit }
}

const perCell = []
const byModelQuery = {}
for (const m of cfg.models) {
  for (const q of cfg.queries) {
    const samples = []
    for (let s = 1; s <= cfg.samplesPerCell; s++) {
      const c = parseCell(`${m.label}-${q.id}-s${s}`)
      if (c) { perCell.push({ model: m.label, query: q.id, sample: s, ...c }); samples.push(c) }
    }
    if (!samples.length) continue
    byModelQuery[`${m.label}|${q.id}`] = {
      model: m.label, query: q.id, queryClass: q.class, n: samples.length,
      toolsTotal: { mean: round(mean(samples.map((x) => x.toolsTotal)), 1), sd: round(stdev(samples.map((x) => x.toolsTotal)), 1) },
      toolsMem: { mean: round(mean(samples.map((x) => x.toolsMem)), 1) },
      chars: { mean: Math.round(mean(samples.map((x) => x.chars))), sd: Math.round(stdev(samples.map((x) => x.chars))) },
      topScore: { mean: round(mean(samples.map((x) => x.topScore))), sd: round(stdev(samples.map((x) => x.topScore))) },
      envelopeFidelity: { mean: round(mean(samples.map((x) => x.envelopeFidelity)), 1) },
      latencyMs: { mean: Math.round(mean(samples.map((x) => x.latencyMs || 0))) },
      requestQualityMode: mode(samples.map((x) => x.requestQuality)),
      requestQualityStable: new Set(samples.map((x) => x.requestQuality)).size === 1,
      citeCorrectRate: round(mean(samples.map((x) => (x.citeCorrect === true ? 1 : x.citeCorrect === false ? 0 : 1)))),
    }
  }
}

// Per-model rollup across all queries.
const perModel = {}
for (const m of cfg.models) {
  const rows = Object.values(byModelQuery).filter((r) => r.model === m.label)
  if (!rows.length) continue
  perModel[m.label] = {
    variant: m.variant,
    avgTools: round(mean(rows.map((r) => r.toolsTotal.mean)), 1),
    maxTools: Math.max(...rows.map((r) => r.toolsTotal.mean)),
    avgChars: Math.round(mean(rows.map((r) => r.chars.mean))),
    avgFidelity: round(mean(rows.map((r) => r.envelopeFidelity.mean)), 1),
    avgLatencyMs: Math.round(mean(rows.map((r) => r.latencyMs.mean))),
    citeCorrectRate: round(mean(rows.map((r) => r.citeCorrectRate))),
    qualityStableRate: round(mean(rows.map((r) => (r.requestQualityStable ? 1 : 0)))),
  }
}

// Cross-model consistency per query: did the models agree on the quality verdict?
const perQuery = {}
for (const q of cfg.queries) {
  const rows = Object.values(byModelQuery).filter((r) => r.query === q.id)
  if (!rows.length) continue
  const verdicts = rows.map((r) => r.requestQualityMode)
  const scoreMeans = rows.map((r) => r.topScore.mean)
  perQuery[q.id] = {
    queryClass: q.class,
    verdicts: Object.fromEntries(rows.map((r) => [r.model, r.requestQualityMode])),
    verdictAgreement: new Set(verdicts).size === 1,
    scoreSpread: round(Math.max(...scoreMeans) - Math.min(...scoreMeans)),
    meanTopScore: round(mean(scoreMeans)),
  }
}

const summary = {
  cellsExpected: cfg.models.length * cfg.queries.length * cfg.samplesPerCell,
  cellsParsed: perCell.length,
  models: cfg.models.map((m) => `${m.label}(${m.variant})`),
  queries: cfg.queries.length,
}
writeFileSync(join(PHASE_DIR, 'results', 'metrics.json'),
  JSON.stringify({ summary, perModel, perQuery, byModelQuery, perCell }, null, 2))
console.log(JSON.stringify({ summary, perModel }, null, 2))
