import fs from "node:fs"
import path from "node:path"

const die = (message) => {
  console.error("compare: " + message)
  process.exit(1)
}

function parseArgs(argv) {
  const out = {}
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--before") out.before = argv[++i]
    else if (argv[i] === "--after") out.after = argv[++i]
  }
  return out
}

const fmt = (value) => (Math.round(value * 10000) / 10000).toFixed(4)

function readResults(file) {
  let results
  try {
    results = JSON.parse(fs.readFileSync(file, "utf8"))
  } catch (error) {
    die(`${file} is not readable JSON: ${error.message}`)
  }
  if (!results || !Array.isArray(results.rows)) die(`${file} misses its rows`)
  if (!Array.isArray(results.noOps)) die(`${file} misses its noOps key, score.mjs writes it, this file came from somewhere else`)
  const ruleRows = results.rows.filter(r => r && r.control === false)
  const controlRows = results.rows.filter(r => r && r.control === true)
  if (controlRows.length !== 1) die(`${file} needs exactly one control row, found ${controlRows.length}`)
  if (!ruleRows.length) die(`${file} holds no rule rows, the rule delta needs them`)
  const dimensions = Object.keys(ruleRows[0].dimensionScores ?? {})
  if (!dimensions.length) die(`${file} rule rows carry no dimension scores`)
  for (const row of [...ruleRows, controlRows[0]]) {
    if (typeof row.caseId !== "string") die(`${file} holds a row without a caseId`)
    if (typeof row.weightedScore !== "number") die(`${file} row ${row.caseId} misses its weightedScore`)
    if (typeof row.blockingFired !== "boolean") die(`${file} row ${row.caseId} misses its blockingFired flag`)
    if (!row.dimensionScores || Object.keys(row.dimensionScores).join("|") !== dimensions.join("|")) die(`${file} row ${row.caseId} carries unexpected dimension keys`)
  }
  return {
    label: typeof results.condition === "string" && results.condition ? results.condition : path.basename(file, ".json"),
    ruleRows,
    control: controlRows[0],
    noOps: results.noOps,
    dimensions,
    file: path.resolve(file)
  }
}

const args = parseArgs(process.argv.slice(2))
if (!args.before || !args.after) die("usage: node compare.mjs --before results/before.json --after results/after.json")
const before = readResults(args.before)
const after = readResults(args.after)
if (before.control.caseId !== after.control.caseId) die(`control case ids differ: ${before.control.caseId} vs ${after.control.caseId}`)
if (before.dimensions.join("|") !== after.dimensions.join("|")) die(`dimension key sets differ: ${before.dimensions.join("|")} vs ${after.dimensions.join("|")}`)

const mean = (rows, dimension) => rows.reduce((sum, r) => sum + (dimension ? r.dimensionScores[dimension] : r.weightedScore), 0) / rows.length

console.log(`compare: before=${before.label} (${before.file}) after=${after.label} (${after.file})`)
console.log(`compare: rule rows: before=${before.ruleRows.length} after=${after.ruleRows.length}`)
console.log("compare: rule deltas by dimension, after minus before, every dimension listed")
for (const d of before.dimensions) {
  const b = mean(before.ruleRows, d)
  const a = mean(after.ruleRows, d)
  console.log(`compare: dimension ${d}: ${fmt(b)} -> ${fmt(a)} (delta ${fmt(a - b)})`)
}
const weightedBefore = mean(before.ruleRows)
const weightedAfter = mean(after.ruleRows)
console.log(`compare: weighted mean: ${fmt(weightedBefore)} -> ${fmt(weightedAfter)} (delta ${fmt(weightedAfter - weightedBefore)})`)

const controlBefore = before.control.weightedScore
const controlAfter = after.control.weightedScore
const controlPredicateBefore = before.control.predicate && before.control.predicate.pass
const controlPredicateAfter = after.control.predicate && after.control.predicate.pass
const controlMoved = controlPredicateBefore !== controlPredicateAfter || before.control.blockingFired !== after.control.blockingFired
console.log(`compare: control observable before=${controlPredicateBefore} after=${controlPredicateAfter}, weighted score is informational for the control`)
console.log(controlMoved ? `CONTROL MOVED: ${controlBefore} -> ${controlAfter}` : `compare: control ${before.control.caseId}: ${fmt(controlBefore)} -> ${fmt(controlAfter)} (unchanged)`)

console.log(`compare: no-op rows: before=${before.noOps.length} after=${after.noOps.length}`)
const afterBlocking = after.ruleRows.filter(r => r.blockingFired).map(r => r.caseId)
if (after.control.blockingFired) afterBlocking.push(after.control.caseId)
const noOpFired = after.noOps.filter(r => r.blockingFired).map(r => r.caseId)
console.log(`compare: after-side blocking rows: ${afterBlocking.join(", ") || "none"}`)
console.log(`compare: after-side no-op rows failing their predicate: ${noOpFired.join(", ") || "none"}`)

const failed = controlMoved || afterBlocking.length > 0
console.log(`compare: ${failed ? "gate failures" : "no gate failures"}: controlMoved=${controlMoved} blockingOnAfterSide=${afterBlocking.length > 0}`)
process.exitCode = failed ? 1 : 0
