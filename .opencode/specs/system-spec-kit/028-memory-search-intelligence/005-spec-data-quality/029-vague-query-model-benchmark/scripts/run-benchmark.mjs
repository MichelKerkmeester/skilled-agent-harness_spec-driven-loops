#!/usr/bin/env node
// Vague-query model benchmark driver.
//
// Runs a model x query x sample matrix of bare /memory:search dispatches through
// `opencode run --command`, capturing each raw JSONL event stream plus a timing
// sidecar. Bare-query retrieval is read-only, so cells run concurrently up to the
// cli-opencode launch-race ceiling. Idempotent: a cell with an existing non-empty
// raw file is skipped, which lets a pilot run pre-seed sample 1 and lets a crashed
// run resume without repeating completed cells.

import { readFileSync, existsSync, statSync, writeFileSync, mkdirSync } from 'node:fs'
import { spawn } from 'node:child_process'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url))
const PHASE_DIR = dirname(SCRIPT_DIR)
const RAW_DIR = join(PHASE_DIR, 'results', 'raw')
const META_DIR = join(PHASE_DIR, 'results', 'meta')
const ROOT = process.cwd() // dispatch --dir; run this driver from the repo root

const cfg = JSON.parse(readFileSync(join(SCRIPT_DIR, 'benchmark-config.json'), 'utf8'))
mkdirSync(RAW_DIR, { recursive: true })
mkdirSync(META_DIR, { recursive: true })

// One cell per model x query x sample index.
const cells = []
for (const m of cfg.models)
  for (const q of cfg.queries)
    for (let s = 1; s <= cfg.samplesPerCell; s++)
      cells.push({ model: m, query: q, sample: s, key: `${m.label}-${q.id}-s${s}` })

const shQuote = (v) => `'${String(v).replace(/'/g, `'\\''`)}'`

function rawPath(c) { return join(RAW_DIR, `${c.key}.json`) }
function metaPath(c) { return join(META_DIR, `${c.key}.meta.json`) }
function done(c) { return existsSync(rawPath(c)) && statSync(rawPath(c)).size > 200 }

function runCell(c, attempt = 1) {
  return new Promise((resolve) => {
    const cmd = [
      `AI_SESSION_CHILD=1 gtimeout -k 60 ${cfg.timeoutSec}`,
      `opencode run --command ${cfg.command}`,
      `--model ${c.model.slug} --variant ${c.model.variant}`,
      `--format json --dir ${shQuote(ROOT)}`,
      `${shQuote(c.query.text)} </dev/null`,
    ].join(' ')
    const t0 = Date.now()
    const child = spawn('bash', ['-c', cmd], { cwd: ROOT })
    let out = '', err = ''
    child.stdout.on('data', (d) => { out += d })
    child.stderr.on('data', (d) => { err += d })
    child.on('close', (code) => {
      const latencyMs = Date.now() - t0
      if (out.length < 200 && attempt < 2) {
        // Empty output is the opencode launch-race death, not a model verdict. Retry once.
        setTimeout(() => resolve(runCell(c, attempt + 1)), 1500)
        return
      }
      writeFileSync(rawPath(c), out)
      writeFileSync(metaPath(c), JSON.stringify({
        key: c.key, model: c.model.label, slug: c.model.slug, variant: c.model.variant,
        query: c.query.id, queryClass: c.query.class, sample: c.sample,
        exit: code, attempts: attempt, latencyMs, bytes: out.length,
        stderrTail: err.slice(-300),
      }, null, 2))
      resolve({ key: c.key, bytes: out.length, latencyMs, code })
    })
  })
}

async function main() {
  const todo = cells.filter((c) => !done(c))
  const skipped = cells.length - todo.length
  console.log(`cells=${cells.length} todo=${todo.length} skipped(existing)=${skipped} concurrency=${cfg.concurrency}`)
  let i = 0, finished = 0
  async function worker(wid) {
    while (i < todo.length) {
      const c = todo[i++]
      const r = await runCell(c)
      finished++
      console.log(`[w${wid}] ${finished}/${todo.length} ${r.key} bytes=${r.bytes} ${r.latencyMs}ms exit=${r.code}`)
    }
  }
  await Promise.all(Array.from({ length: cfg.concurrency }, (_, k) => worker(k + 1)))
  console.log(`DONE: ${finished} cells dispatched, ${skipped} reused`)
}

main()
