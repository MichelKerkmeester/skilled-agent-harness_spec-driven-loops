// Runs the workflow's post-iteration steps for one iteration:
//   step_frontier_admit (build known-texts, then admit) and step_reduce_state.
// Usage: node prompts/after-iteration.cjs <iterationNumber>
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const dir = path.resolve(__dirname, "..");
const repoRoot = path.resolve(dir, "../../../../../../..");
const specFolder = "specs/system-skilled-bots/002-openbot-parity-research/004-reference-evidence-research";
const artifactDir = path.relative(repoRoot, dir);
const iteration = String(process.argv[2] || "").padStart(3, "0");

function readJson(file, fallback) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return fallback;
  }
}

// step_frontier_admit: every registry question text, every rejected pattern, and
// every line under the strategy's Exhausted Approaches section.
const registry = readJson(path.join(dir, "findings-registry.json"), {});
const known = [];
for (const q of registry.keyQuestions || []) if (q && typeof q.text === "string") known.push(q.text);
for (const q of registry.openQuestions || []) if (q && typeof q.text === "string") known.push(q.text);
for (const q of registry.resolvedQuestions || []) if (q && typeof q.text === "string") known.push(q.text);
for (const p of registry.rejectedPatterns || []) if (p && typeof p.pattern === "string") known.push(p.pattern);

let strategy = "";
try {
  strategy = fs.readFileSync(path.join(dir, "deep-research-strategy.md"), "utf8");
} catch {
  strategy = "";
}
const exhausted = strategy.match(/<!-- ANCHOR:exhausted-approaches -->([\s\S]*?)<!-- \/ANCHOR:exhausted-approaches -->/);
if (exhausted) {
  for (const line of exhausted[1].split("\n")) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("[") && !trimmed.startsWith("###")) known.push(trimmed);
  }
}
fs.writeFileSync(path.join(dir, "frontier-known-texts.json"), JSON.stringify(known, null, 2) + "\n");

function run(label, args) {
  try {
    const out = execFileSync(process.execPath, args, { cwd: repoRoot, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
    console.log(`[${label}] ok: ${out.trim()}`);
    return 0;
  } catch (error) {
    const stderr = (error.stderr || "").toString().trim();
    const stdout = (error.stdout || "").toString().trim();
    console.log(`[${label}] FAILED exit=${error.status} stdout=${stdout} stderr=${stderr}`);
    return error.status || 1;
  }
}

const admit = run("frontier-admit", [
  ".skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs",
  "admit",
  "--artifact-dir", artifactDir,
  "--iteration", String(Number(iteration)),
  "--input", path.join(artifactDir, "deltas", `iter-${iteration}.jsonl`),
  "--known-texts", path.join(artifactDir, "frontier-known-texts.json"),
]);

const reduce = run("reduce-state", [
  ".skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs",
  specFolder,
  "--artifact-dir", artifactDir,
]);

process.exit(reduce === 0 ? 0 : reduce);
