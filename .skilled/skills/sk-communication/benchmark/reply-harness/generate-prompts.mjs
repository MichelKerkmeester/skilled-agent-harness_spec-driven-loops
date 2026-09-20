import fs from "node:fs"
import path from "node:path"
import crypto from "node:crypto"
import { execFileSync } from "node:child_process"
import { fileURLToPath } from "node:url"

const here = path.dirname(fileURLToPath(import.meta.url))
const skillsDir = path.resolve(here, "../../..")
const repoRoot = path.resolve(skillsDir, "..", "..")
const baselinePath = path.join(repoRoot, "specs", "sk-communication", "006-sk-communication-clarity", "003-root-doc-and-repo-rules", "baselines", "measurement-baseline.md")

const die = (message) => {
  console.error("generate-prompts: " + message)
  process.exit(1)
}

function parseArgs(argv) {
  const out = {}
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--condition") out.condition = argv[++i]
    else if (argv[i] === "--out") out.out = argv[++i]
  }
  return out
}

function readCases() {
  const casesFile = path.join(here, "cases.json")
  let cases
  let casesRaw
  try {
    casesRaw = fs.readFileSync(casesFile, "utf8")
    cases = JSON.parse(casesRaw)
  } catch (error) {
    die(`${casesFile} is not readable JSON: ${error.message}`)
  }
  if (!Array.isArray(cases)) die(`${casesFile} must hold an array of cases`)
  for (const c of cases) {
    if (!c || typeof c.id !== "string" || !c.id.trim()) die(`${casesFile} holds a case without a usable id`)
    if (typeof c.prompt !== "string" || !c.prompt.trim()) die(`${casesFile} case ${c.id} misses a prompt`)
  }
  const ids = cases.map(c => c.id)
  if (new Set(ids).size !== ids.length) die(`${casesFile} repeats a case id: ${ids.join(", ")}`)
  return { cases, casesHash: crypto.createHash("sha256").update(casesRaw).digest("hex") }
}

function gitShow(commit, p) {
  try {
    return execFileSync("git", ["show", `${commit}:${p}`], { cwd: repoRoot, encoding: "utf8", maxBuffer: 32 * 1024 * 1024, timeout: 60000 })
  } catch (error) {
    die(`git show ${commit}:${p} failed: ${String(error.stderr || error.message).trim().slice(0, 300)}`)
  }
}

function section8(agentsText, sourceLabel) {
  const lines = agentsText.split(/\r?\n/)
  const start = lines.findIndex(l => /^#{2,3}\s+8[.:\s]/.test(l.trim()))
  if (start < 0) die(`no section 8 heading found in ${sourceLabel}`)
  let end = lines.length
  for (let i = start + 1; i < lines.length; i++) {
    if (/^#{2,3}\s+9[.:\s]/.test(lines[i].trim())) {
      end = i
      break
    }
  }
  return lines.slice(start, end).join("\n")
}

// The corpus lives inside the source tree when the repository keeps one, and at
// the repository root when it does not. Both lanes probe in that order, so the
// same script reads either layout and a repository that moved keeps working.
const RULES_DIR_CANDIDATES = [".skilled/repo-rules", "repo-rules"]

function resolveRulesDir(root) {
  for (const candidate of RULES_DIR_CANDIDATES) {
    if (fs.existsSync(path.join(root, candidate))) return candidate
  }
  return null
}

function walkRepoRules(rulesDir) {
  const root = path.join(repoRoot, rulesDir)
  const found = []
  const visit = (rel) => {
    for (const e of fs.readdirSync(path.join(root, rel), { withFileTypes: true }).sort((x, y) => (x.name < y.name ? -1 : 1))) {
      if (e.name.startsWith(".")) continue
      if (e.isDirectory()) visit(rel ? `${rel}/${e.name}` : e.name)
      else if (e.isFile()) found.push(rel ? `${rel}/${e.name}` : e.name)
    }
  }
  visit("")
  return found.sort((x, y) => (x < y ? -1 : 1))
}

const args = parseArgs(process.argv.slice(2))
if (args.condition !== "before" && args.condition !== "after") die("usage: node generate-prompts.mjs --condition before|after --out <dir>")
if (!args.out) die("usage: node generate-prompts.mjs --condition before|after --out <dir>")
const outDir = path.resolve(args.out)
const { cases, casesHash } = readCases()

let sections
let ruleSetSource
if (args.condition === "before") {
  let baseline
  try {
    baseline = fs.readFileSync(baselinePath, "utf8")
  } catch (error) {
    die(`the rule-set baseline is not readable: ${baselinePath} (${error.message})`)
  }
  const m = baseline.match(/Rule-set commit[\s\S]{0,200}?([0-9a-f]{7,40})/i)
  if (!m) die(`no rule-set commit line found in ${baselinePath}`)
  const commit = m[1]
  ruleSetSource = commit
  sections = [
    { label: "AGENTS.md (section 8)", text: section8(gitShow(commit, "AGENTS.md"), `${commit}:AGENTS.md`) },
    { label: "REPO RULES.md", text: gitShow(commit, "REPO RULES.md") }
  ]
  let ruleList = []
  let rulesDir = null
  for (const candidate of RULES_DIR_CANDIDATES) {
    let listed
    try {
      listed = execFileSync("git", ["ls-tree", "-r", "--name-only", commit, "--", `${candidate}/`], { cwd: repoRoot, encoding: "utf8", timeout: 60000 })
        .split(/\r?\n/).filter(Boolean)
    } catch (error) {
      die(`git ls-tree for ${commit} failed: ${String(error.stderr || error.message).trim().slice(0, 300)}`)
    }
    if (listed.length > 0) {
      rulesDir = candidate
      ruleList = listed.map(p => p.slice(candidate.length + 1)).sort((x, y) => (x < y ? -1 : 1))
      break
    }
  }
  if (rulesDir === null) die(`no rules directory at ${commit}: tried ${RULES_DIR_CANDIDATES.join(", ")}`)
  for (const rel of ruleList) sections.push({ label: `${rulesDir}/${rel}`, text: gitShow(commit, `${rulesDir}/${rel}`) })
} else {
  ruleSetSource = "working-tree"
  const rulesDir = resolveRulesDir(repoRoot)
  if (rulesDir === null) die(`no rules directory in the working tree: tried ${RULES_DIR_CANDIDATES.join(", ")}`)
  const readAt = (rel) => {
    try {
      return fs.readFileSync(path.join(repoRoot, rel), "utf8")
    } catch (error) {
      die(`working-tree rule file not readable: ${rel} (${error.message})`)
    }
  }
  sections = [
    { label: "AGENTS.md (section 8)", text: section8(readAt("AGENTS.md"), "AGENTS.md") },
    { label: "REPO RULES.md", text: readAt("REPO RULES.md") }
  ]
  for (const rel of walkRepoRules(rulesDir)) sections.push({ label: `${rulesDir}/${rel}`, text: readAt(`${rulesDir}/${rel}`) })
}
sections.sort((x, y) => (x.label < y.label ? -1 : 1))
for (const s of sections) {
  if (typeof s.text !== "string" || !s.text.trim()) die(`rule source ${s.label} assembles to an empty rule text`)
}

fs.mkdirSync(outDir, { recursive: true })
const assembled = sections.map(s => `## ${s.label}\n\n${s.text}`).join("\n\n")
const hashes = {}
for (const s of sections) hashes[s.label] = crypto.createHash("sha256").update(s.text).digest("hex")
const written = []
for (const c of cases) {
  const file = path.join(outDir, `${c.id}.md`)
  const operatorPrompt = typeof c.operatorPrompt === "string" && c.operatorPrompt.trim() ? c.operatorPrompt.trim() : c.prompt.trim()
  fs.writeFileSync(file, `# System\n\n${assembled}\n\n# Case\n\n${operatorPrompt}\n`)
  written.push(file)
}
const manifest = {
  condition: args.condition,
  ruleSetSource,
  caseIds: cases.map(c => c.id),
  ruleFileHashes: hashes,
  casesHash,
  writtenAt: new Date().toISOString()
}
fs.writeFileSync(path.join(outDir, "manifest.json"), JSON.stringify(manifest, null, 2) + "\n")

console.log(`generate-prompts: condition=${args.condition} ruleSetSource=${ruleSetSource} ruleSections=${sections.length} cases=${cases.length}`)
for (const f of written) console.log(`generate-prompts: wrote ${f}`)
console.log(`generate-prompts: wrote ${path.join(outDir, "manifest.json")}`)
