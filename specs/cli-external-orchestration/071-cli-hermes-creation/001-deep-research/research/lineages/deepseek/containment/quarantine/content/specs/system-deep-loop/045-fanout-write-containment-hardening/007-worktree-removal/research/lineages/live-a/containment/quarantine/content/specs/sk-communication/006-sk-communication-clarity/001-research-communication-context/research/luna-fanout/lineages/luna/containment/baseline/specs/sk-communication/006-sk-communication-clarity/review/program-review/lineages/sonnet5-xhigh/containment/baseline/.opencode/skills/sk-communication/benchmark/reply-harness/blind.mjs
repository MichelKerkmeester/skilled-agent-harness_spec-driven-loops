import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const here = path.dirname(fileURLToPath(import.meta.url))

const die = (message) => {
  console.error("blind: " + message)
  process.exit(1)
}

function parseArgs(argv) {
  const out = {}
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--a") out.a = argv[++i]
    else if (argv[i] === "--b") out.b = argv[++i]
    else if (argv[i] === "--out") out.out = argv[++i]
  }
  return out
}

const args = parseArgs(process.argv.slice(2))
if (!args.a || !args.b || !args.out) die("usage: node blind.mjs --a <dir> --b <dir> --out <dir>")

const casesFile = path.join(here, "cases.json")
let cases
try {
  cases = JSON.parse(fs.readFileSync(casesFile, "utf8"))
} catch (error) {
  die(`${casesFile} is not readable JSON: ${error.message}`)
}
if (!Array.isArray(cases)) die(`${casesFile} must hold an array of cases`)
const ids = cases.map(c => c && c.id)
if (new Set(ids).size !== ids.length || ids.some(id => typeof id !== "string" || !id.trim())) die(`${casesFile} carries unnamed or repeated case ids: ${JSON.stringify(ids)}`)

const readReply = (dir, caseId, role) => {
  const file = path.resolve(dir, `${caseId}.md`)
  if (!fs.existsSync(file)) die(`missing ${role} reply: ${file}`)
  return { file, text: fs.readFileSync(file, "utf8") }
}
const providerOf = (dir, caseId) => {
  const file = path.resolve(dir, `${caseId}.meta.json`)
  if (!fs.existsSync(file)) return "n/a"
  let meta
  try {
    meta = JSON.parse(fs.readFileSync(file, "utf8"))
  } catch (error) {
    die(`${file} is not readable JSON: ${error.message}`)
  }
  return meta && typeof meta.provider === "string" && meta.provider.trim() ? meta.provider : "n/a"
}

const outDir = path.resolve(args.out)
fs.mkdirSync(outDir, { recursive: true })
const order = { sealedRecord: true, sideA: path.resolve(args.a), sideB: path.resolve(args.b), writtenAt: new Date().toISOString(), cases: {} }
const masked = []
for (const c of cases) {
  const a = readReply(args.a, c.id, "side A source")
  const b = readReply(args.b, c.id, "side B source")
  const aFirst = Math.random() < 0.5
  const labels = aFirst ? { a: "A", b: "B" } : { a: "B", b: "A" }
  for (const side of ["a", "b"]) {
    const reply = side === "a" ? a : b
    const label = labels[side]
    const file = path.join(outDir, `${c.id}-${label}.md`)
    fs.writeFileSync(file, `Case: ${c.id}\n\n${String(c.prompt ?? "").trim()}\n\nReply ${label}:\n\n${reply.text.trim()}\n`)
    masked.push(file)
    order.cases[c.id] = order.cases[c.id] ?? {}
    order.cases[c.id][label] = { condition: side, source: reply.file, provider: providerOf(args[side], c.id) }
  }
}
const orderFile = path.join(outDir, "order-sealed.json")
fs.writeFileSync(orderFile, JSON.stringify(order, null, 2) + "\n")

console.log("blind: masked files, bare replies under label, provenance only in the sealed order")
for (const f of masked) console.log(`blind: ${f}`)
console.log(`blind: sealed order record: ${orderFile}`)
