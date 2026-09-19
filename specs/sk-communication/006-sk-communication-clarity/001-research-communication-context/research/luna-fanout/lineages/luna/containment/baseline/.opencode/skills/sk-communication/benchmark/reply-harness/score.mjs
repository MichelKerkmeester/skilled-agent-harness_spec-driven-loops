import fs from "node:fs"
import os from "node:os"
import path from "node:path"
import { execFileSync } from "node:child_process"
import { fileURLToPath } from "node:url"

const here = path.dirname(fileURLToPath(import.meta.url))
const skillsDir = path.resolve(here, "../../..")
const scannerPath = path.join(skillsDir, "sk-doc", "sk-create-with-human-voice", "scripts", "hvr_scan.py")

const die = (message) => {
  console.error("score: " + message)
  process.exit(1)
}

function parseArgs(argv) {
  const out = {}
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--condition") out.condition = argv[++i]
    else if (argv[i] === "--replies") out.replies = argv[++i]
    else if (argv[i] === "--out") out.out = argv[++i]
  }
  return out
}

const WORD = /[a-z][a-z0-9-]{2,}/g
const STOPWORDS = new Set(("the a an and or of to in on for with that this what which does do is are be as by it its if not your you when then each from should will would can may " +
  "use used using into only also than one two first last next set case answer reply write written say says add added keeps keep made make sure name named list listed " +
  "follow followed reading read before after rule rules section note notes file files line lines however there their they them his her hers").split(" "))

const tokens = (text) => (String(text).toLowerCase().match(WORD) ?? []).filter(w => !STOPWORDS.has(w))
const trimLines = (reply) => reply.split(/\r?\n/).map(s => s.trim()).filter(Boolean)

function firstSentenceOf(reply) {
  const lead = trimLines(reply).find(l => !l.startsWith("#")) ?? ""
  const m = lead.match(/^[\s\S]*?[.!?]+(?=\s|$)/)
  return (m ? m[0] : lead).trim()
}

function pAnswerPosition(reply) {
  const lead = firstSentenceOf(reply)
  return {
    pass: /`[^`]+`/.test(lead) || /[\w.~-]+(\/[\w.~-]+)+/.test(lead),
    detail: { firstSentence: lead }
  }
}

const NEXT_CUE = /`|\b(next|follow-?ups?|then|todo|to-?dos?|action|step|open|remaining|left|deferred|later|need|needs|plan|will|run|rerun|check|start|ship|report|review|wait|hold|until|once|after)\b/i
const OPEN_CUE = /\b(left open|still open|open (questions?|items?|points?|threads?|loops?)|remaining|not (done|covered|resolved|addressed|closed)|deferred|follow-?ups?|backlog|later)\b/i

function pClosingNextAction(reply) {
  const lines = trimLines(reply).filter(l => !l.startsWith("#") && l !== "---")
  const closing = lines.length ? lines[lines.length - 1] : ""
  const closingNextActionLine = NEXT_CUE.test(closing)
  const anythingLeftOpenDeclared = OPEN_CUE.test(reply)
  return {
    pass: anythingLeftOpenDeclared ? closingNextActionLine : true,
    detail: { closingLine: closing, closingNextActionLine, anythingLeftOpenDeclared }
  }
}

function firstIndex(re, text) {
  const m = re.exec(text)
  return m ? m.index : -1
}

function pReceipts(reply) {
  const commandHits = []
  const backticked = /`[\w.~$/-][^`\n]*[ ][^`\n]*`/.exec(reply)
  if (backticked) commandHits.push(backticked.index)
  const prompted = /(^|\n)\$[ ]/.exec(reply)
  if (prompted) commandHits.push(prompted.index + (prompted[1] ? 1 : 0))
  const commandIdx = commandHits.length ? Math.min(...commandHits) : -1
  const statusIdx = firstIndex(/(exit (code|status)|status[:=]?\s*\d|exit\s+\d+|result[:=]|output[:=]|return(ed|s)?|succeed(ed|s)?|fail(ed|s|ure)?|no error|clean|printed|prints|zero|nonzero|empty)/i, reply)
  const interpretationIdx = firstIndex(/\b(because|therefore|this (means|shows|tells)|means that|shows that|which (means|shows|tells)|indicates|suggests|in other words|so the|so it|that means|conclusion|conclude)\b/i, reply)
  return {
    pass: commandIdx >= 0 && statusIdx >= 0 && (interpretationIdx < 0 || Math.min(commandIdx, statusIdx) < interpretationIdx),
    detail: { commandIdx, statusIdx, interpretationIdx }
  }
}

function pTone(reply) {
  const softeners = (reply.match(/\b(?:unfortunately|apologize|apologise|sorry)\b/gi) ?? []).length
  const concrete = /\b(next|follow-?ups?|then|step|todo|to-?dos?|action|run|rerun|check|read|ship|report|file|open)\b/i.test(reply)
  return { pass: !softeners && concrete, detail: { softeners, concreteNextStep: concrete } }
}

const TANGENT_CUE = /\b(by the way|btw|incidentally|off-?topic|aside|tangent|parenthetically|digression|digress)\b/i
const DEFERRED_CUE = /\b(later|deferr?ed|defers?|follow-?ups?|backlog)\b/i
const DEFERRED_LABELED = /\b(next|later|deferred|follow-?ups?|backlog|todo|to-?do)s?\b(?:\s+\w+)?\s*[:*\-]/i

function pTangent(reply) {
  const bodyLines = trimLines(reply).filter(l => !l.startsWith("#"))
  const body = bodyLines.join(" ")
  const sentences = body.split(/(?<=[.!?])\s+/).map(s => s.trim()).filter(Boolean)
  const tangentSentences = sentences.filter(s => TANGENT_CUE.test(s))
  const unlabeledDeferredLines = bodyLines.filter(l => DEFERRED_CUE.test(l) && !DEFERRED_LABELED.test(l))
  return {
    pass: !tangentSentences.length && !unlabeledDeferredLines.length,
    detail: { tangentSentences, unlabeledDeferredLines }
  }
}

function pCap(reply, caseEntry) {
  const lines = reply.split(/\r?\n/)
  const itemRe = /^\s*(?:[-*+•]|\d+[.)])\s+/
  const groups = []
  let current = 0
  for (const line of lines) {
    if (itemRe.test(line)) current++
    else if (current) {
      groups.push(current)
      current = 0
    }
  }
  if (current) groups.push(current)
  const overFive = groups.filter(n => n > 5)
  const expected = [...new Set((String(caseEntry.prompt).match(/`([^`\n]+)`/g) ?? []).map(t => t.slice(1, -1)))]
  const missingItems = expected.filter(t => !reply.includes(t))
  return {
    pass: !overFive.length && !missingItems.length,
    detail: { groupSizes: groups, overFive, expectedItems: expected, missingItems }
  }
}

function pRestate(reply, caseEntry) {
  const lines = trimLines(reply).filter(l => !l.startsWith("#"))
  const opening = lines.slice(0, 2).join(" ")
  const words = reply.split(/\s+/).filter(Boolean).length
  const asksInstead = /\?\s*$/.test(opening.trim()) && words < 40
  const cue = /\b(again|restat\w*|in plain|plainly|here it is|in other words|put simply|simpler|means|that is)\b/i.test(opening)
  const restates = !asksInstead && (cue || words >= 40)
  return {
    pass: restates,
    detail: { words, asksInstead, cue, opening: opening.slice(0, 160) }
  }
}

const COSTS = { hard: 0.5, review: 0.25, warning: 0.25, warn: 0.25, medium: 0.25, should: 0.25 }

function tellsScore(counts) {
  let spent = 0
  for (const [severity, count] of Object.entries(counts)) spent += count * (COSTS[severity] ?? 0.1)
  return Math.max(0, Math.round((1 - spent) * 10000) / 10000)
}

const MECHANICS = {
  firstSentenceHasPathOrSymbol: (reply) => (pAnswerPosition(reply).pass ? 1 : 0),
  closingNextActionLine: (reply) => (pClosingNextAction(reply).pass ? 1 : 0),
  commandAndStatusBeforeInterpretation: (reply) => (pReceipts(reply).pass ? 1 : 0),
  noSoftenersAndConcreteNextStep: (reply) => (pTone(reply).pass ? 1 : 0),
  noTangentSentencesAndLabeledDeferral: (reply) => (pTangent(reply).pass ? 1 : 0),
  noGroupOverFiveAndAllItemsRetained: (reply, caseEntry) => (pCap(reply, caseEntry).pass ? 1 : 0),
  scannerFindingsBySeverity: (reply, caseEntry, counts) => tellsScore(counts)
}
const MECHANIC_NAMES = new Set(Object.keys(MECHANICS))
const OWN = {
  C1: "firstSentenceHasPathOrSymbol",
  C2: "closingNextActionLine",
  C3: "commandAndStatusBeforeInterpretation",
  C4: "noSoftenersAndConcreteNextStep",
  C5: "noTangentSentencesAndLabeledDeferral",
  C6: "noGroupOverFiveAndAllItemsRetained",
  NC1: "restatementPresent"
}
const PREDICATE_BUILDERS = {
  C1: (reply) => pAnswerPosition(reply),
  C2: (reply) => pClosingNextAction(reply),
  C3: (reply) => pReceipts(reply),
  C4: (reply) => pTone(reply),
  C5: (reply) => pTangent(reply),
  C6: (reply, caseEntry) => pCap(reply, caseEntry),
  NC1: (reply, caseEntry) => pRestate(reply, caseEntry)
}

function scanReply(replyFile, reply) {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "reply-scan-"))
  const target = path.join(tmp, "reply.md")
  fs.writeFileSync(target, reply)
  try {
    let stdout
    try {
      stdout = execFileSync("python3", [scannerPath, target, "--json"], { encoding: "utf8" })
    } catch (error) {
      if (error && error.status === 1 && typeof error.stdout === "string" && error.stdout.trim()) stdout = error.stdout
      else die(`the scanner failed on ${replyFile}: ${String(error.stderr || error.message).trim().slice(0, 300)}`)
    }
    let parsed
    try {
      parsed = JSON.parse(stdout)
    } catch (error) {
      const start = stdout.indexOf("{")
      const end = stdout.lastIndexOf("}")
      if (start < 0 || end <= start) die(`the scanner printed no JSON for ${replyFile}`)
      try {
        parsed = JSON.parse(stdout.slice(start, end + 1))
      } catch (error2) {
        die(`the scanner printed unreadable JSON for ${replyFile}: ${error2.message}`)
      }
    }
    const reports = parsed && Array.isArray(parsed.reports) ? parsed.reports : []
    const report = reports[0]
    if (!report) die(`the scanner returned no report for ${replyFile}`)
    const counts = {}
    if (Array.isArray(report.findings)) {
      for (const f of report.findings) {
        if (!f || typeof f !== "object") continue
        const severity = String(f.severity ?? "unknown").toLowerCase()
        counts[severity] = (counts[severity] ?? 0) + 1
      }
    } else if (typeof report.hardBlockers === "number" || typeof report.mechanicalDeductions === "number") {
      if (report.hardBlockers) counts.hard = (counts.hard ?? 0) + report.hardBlockers
      if (report.mechanicalDeductions > 0) counts.soft = (counts.soft ?? 0) + report.mechanicalDeductions
    } else {
      die(`the scanner report for ${replyFile} carries no findings to count`)
    }
    return counts
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true })
  }
}

const args = parseArgs(process.argv.slice(2))
if (args.condition !== "before" && args.condition !== "after") die("usage: node score.mjs --condition before|after --replies <dir> --out <file>")
if (!args.replies || !args.out) die("usage: node score.mjs --condition before|after --replies <dir> --out <file>")

const casesFile = path.join(here, "cases.json")
let cases
try {
  cases = JSON.parse(fs.readFileSync(casesFile, "utf8"))
} catch (error) {
  die(`${casesFile} is not readable JSON: ${error.message}`)
}
if (!Array.isArray(cases)) die(`${casesFile} must hold an array of cases`)
const EXPECTED_IDS = ["C1", "C2", "C3", "C4", "C5", "C6", "NC1"]
const ids = cases.map(c => c && c.id)
for (const expected of EXPECTED_IDS) if (!ids.includes(expected)) die(`${casesFile} misses case ${expected}`)
if (new Set(ids).size !== ids.length || ids.length !== EXPECTED_IDS.length) die(`${casesFile} carries unexpected or repeated case ids: ${ids.join(", ")}`)
for (const c of cases) {
  if (typeof c.prompt !== "string" || !c.prompt.trim()) die(`${casesFile} case ${c.id} misses a prompt`)
  if (typeof c.control !== "boolean") die(`${casesFile} case ${c.id} needs a boolean control flag`)
  for (const field of ["keyedRule", "passObservable", "failObservable"]) {
    if (c[field] !== undefined && typeof c[field] !== "string") die(`${casesFile} case ${c.id} field ${field} must be a string when present`)
  }
}
const controls = cases.filter(c => c.control)
if (controls.length !== 1 || controls[0].id !== "NC1") die(`${casesFile} needs control true on NC1 and nowhere else`)

const rubricFile = path.join(here, "rubric.json")
let rubric
try {
  rubric = JSON.parse(fs.readFileSync(rubricFile, "utf8"))
} catch (error) {
  die(`${rubricFile} is not readable JSON: ${error.message}`)
}
if (!Array.isArray(rubric.dimensions) || !rubric.dimensions.length) die(`${rubricFile} misses its dimensions`)
const dimensionIds = rubric.dimensions.map(d => d.id)
if (new Set(dimensionIds).size !== dimensionIds.length) die(`${rubricFile} repeats a dimension id`)
let weightSum = 0
for (const d of rubric.dimensions) {
  if (typeof d.id !== "string" || !d.id.trim()) die(`${rubricFile} holds a dimension without an id`)
  if (typeof d.mechanic !== "string" || !MECHANIC_NAMES.has(d.mechanic)) die(`${rubricFile} dimension ${d.id} names mechanic ${JSON.stringify(d.mechanic)} which this script cannot run`)
  if (typeof d.weight !== "number" || !(d.weight >= 0) || d.weight > 1) die(`${rubricFile} dimension ${d.id} needs a weight between 0 and 1`)
  weightSum += d.weight
}
if (Math.abs(weightSum - 1) > 1e-6) die(`${rubricFile} weights sum to ${weightSum}, they must sum to 1`)
if (!rubric.blockingClass || typeof rubric.blockingClass !== "object") die(`${rubricFile} misses its blocking class`)

if (!fs.existsSync(scannerPath)) die(`the scanner is missing: ${scannerPath}`)

const replyDir = path.resolve(args.replies)
const outPath = path.resolve(args.out)
fs.mkdirSync(path.dirname(outPath), { recursive: true })

for (const c of cases) {
  const replyFile = path.join(replyDir, `${c.id}.md`)
  if (!fs.existsSync(replyFile)) die(`missing reply file: ${replyFile}`)
  const metaFile = path.join(replyDir, `${c.id}.meta.json`)
  if (fs.existsSync(metaFile)) {
    try {
      JSON.parse(fs.readFileSync(metaFile, "utf8"))
    } catch (error) {
      die(`${metaFile} is not readable JSON: ${error.message}`)
    }
  }
}

console.log(`score: condition=${args.condition} cases=${cases.length} replies=${replyDir}`)

const rows = []
const noOps = []
for (const c of cases) {
  const replyFile = path.join(replyDir, `${c.id}.md`)
  const reply = fs.readFileSync(replyFile, "utf8")
  if (!reply.trim()) die(`${replyFile} is empty, the generation did not produce a reply and nothing can be scored`)
  const metaFile = path.join(replyDir, `${c.id}.meta.json`)
  let meta = null
  if (fs.existsSync(metaFile)) meta = JSON.parse(fs.readFileSync(metaFile, "utf8"))
  if (meta !== null && (typeof meta !== "object" || Array.isArray(meta))) die(`${metaFile} must hold a JSON object`)
  const provider = meta && typeof meta.provider === "string" && meta.provider.trim() ? meta.provider : "n/a"
  const changeKind = meta && typeof meta.changeKind === "string" && meta.changeKind.trim() ? meta.changeKind : "n/a"
  if (changeKind !== "n/a" && changeKind !== "reworded" && changeKind !== "no-op") die(`${metaFile} changeKind ${JSON.stringify(changeKind)} is neither reworded nor no-op`)
  const counts = scanReply(replyFile, reply)
  const predicate = PREDICATE_BUILDERS[c.id](reply, c)
  const dimensionScores = {}
  for (const d of rubric.dimensions) {
    const value = MECHANICS[d.mechanic](reply, c, counts)
    if (typeof value !== "number" || Number.isNaN(value)) die(`dimension ${d.id} scored ${JSON.stringify(value)} on case ${c.id}`)
    dimensionScores[d.id] = Math.round(value * 10000) / 10000
  }
  let weighted = 0
  for (const d of rubric.dimensions) weighted += d.weight * dimensionScores[d.id]
  weighted = Math.round(weighted * 10000) / 10000
  const predicatePass = predicate.pass === true
  const row = {
    caseId: c.id,
    control: c.control === true,
    provider,
    changeKind,
    predicate: { mechanic: OWN[c.id], pass: predicatePass, detail: predicate.detail ?? {} },
    scannerCounts: counts,
    dimensionScores,
    weightedScore: weighted,
    blockingFired: !predicatePass,
    replyFile
  }
  ;(changeKind === "no-op" ? noOps : rows).push(row)
}

const results = {
  condition: args.condition,
  generatedAt: new Date().toISOString(),
  repliesDir: replyDir,
  casesFile,
  weights: Object.fromEntries(rubric.dimensions.map(d => [d.id, d.weight])),
  rows,
  noOps
}
fs.writeFileSync(outPath, JSON.stringify(results, null, 2) + "\n")
console.log(`score: wrote ${outPath}`)
console.log(`score: ruleRows=${rows.length} noOpRows=${noOps.length} blockingRows=${[...rows, ...noOps].filter(r => r.blockingFired).length}`)
