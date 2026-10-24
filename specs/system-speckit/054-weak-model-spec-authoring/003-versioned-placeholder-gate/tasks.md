---
title: "Tasks: Phase 3: versioned-placeholder-gate"
description: "Task Format: T### [P?] Description (file path). Each task names its verify command with the output it must print, and every tool, test and code block is written out literally."
trigger_phrases:
  - "versioned placeholder gate tasks"
  - "hint to token conversion script"
  - "failing first placeholder test"
  - "strict census before and after"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 3: versioned-placeholder-gate

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`, then `Verify:` with the command whose output proves the task.

Shell variables used below, set once by the conductor in the build worktree:
- `WORKTREE`: the build worktree path recorded in `../goal.md` section 4.
- `PHASE_REL`: `specs/system-speckit/054-weak-model-spec-authoring/003-versioned-placeholder-gate`
- `PHASE`: `$WORKTREE/$PHASE_REL`
- `SC`: `$PHASE/scratch`
- `P1`: `$WORKTREE/specs/system-speckit/054-weak-model-spec-authoring/001-template-drift-census-and-baseline`
- `P2`: `$WORKTREE/specs/system-speckit/054-weak-model-spec-authoring/002-template-and-example-defect-repair`
- `S`: `.skilled/skills/system-spec-kit`
- `TPL`: `$S/templates`
- `ORCH`: `$WORKTREE/$S/runtime/dist/lib/validation/orchestrator.js`
- `CEN`: `$SC/census`
- `P3START`: the commit hash recorded by T003.

Every command runs from `$WORKTREE` unless the task says otherwise. A path that starts with `$S` or `$TPL` is relative to that directory.

Numbers printed in the Verify lines were observed in a scratch copy of the tree while this plan was written. Where a number depends on the tree, the line says so.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Check that phases 1 and 2 closed and that the templates are still original (no file). Run the block below. Verify: the first command prints `1`, the second prints a line that starts with `exit=`, the third prints `LEDGER_OK`, and the fourth prints nothing. When the first command prints nothing, phase 2 is not closed: write `BLOCKED phase 2 open` in `goal.md` section 4 and stop the phase. When the fourth command prints a line, a template already holds a token: write `BLOCKED templates not original` and stop.

```bash
cd "$WORKTREE"
rg -c '^\*\*Closeable:\*\* Yes' "$P2/acceptance-criteria.md"
tail -1 "$P1/scratch/baseline/suite-start.txt"
test -s "$P1/scratch/ledger/ledger.jsonl" && jq -c . "$P1/scratch/ledger/ledger.jsonl" > /dev/null && echo LEDGER_OK
rg -l 'YOUR_VALUE_HERE' $TPL/core/spec.md.tmpl $TPL/core/plan.md.tmpl $TPL/core/tasks.md.tmpl $TPL/core/implementation-summary.md.tmpl $TPL/addons/acceptance-criteria.md.tmpl
```

- [ ] T002 Check the tools (no file). Verify: `python3 --version && jq --version && rg --version | head -1 && node --version && perl -e 'print "perl $]\n"' && npm --version` prints six lines that start with `Python 3.`, `jq-`, `ripgrep `, `v`, `perl ` and a version number. A Python older than 3.8 or a Node older than v20 stops the phase.
- [ ] T003 Record the start state and prove the build runs this checkout's own code (`goal.md`, `scratch/status-start.txt`). Run the block below. Write the hash that `git rev-parse` prints into the `Phase start commit` row of `goal.md` section 4 as `| Phase start commit | Done | <the 40 character hash> |`. Verify: `grep -cE 'Phase start commit \| Done \| [0-9a-f]{40}' "$PHASE/goal.md"` prints `1`, the node script prints no line that starts with `FOREIGN`, and `test -f "$ORCH" && echo ORCH_OK` prints `ORCH_OK`. A `MISSING` line for `runtime/node_modules` is fine. A line that starts with `FOREIGN` means `dist/` or a workspace link points at another checkout, and the test would then run that checkout's code. Follow the worktree provisioning in `.skilled/skills/sk-git/SKILL.md`, retry once, and when it still prints `FOREIGN` write `BLOCKED foreign build` in `goal.md` section 4 and stop the phase.

```bash
cd "$WORKTREE"
git rev-parse HEAD
git status --porcelain > "$SC/status-start.txt"
mkdir -p "$SC/tools" "$SC/new" "$SC/census" "$SC/briefs" "$SC/review" "$SC/templates-before" "$SC/logs"
node -e '
const fs = require("fs");
const path = require("path");
const skill = process.argv[1];
const root = fs.realpathSync(process.argv[2]) + path.sep;
for (const t of ["runtime/dist", "node_modules", "node_modules/@spec-kit/runtime", "node_modules/@spec-kit/cli", "node_modules/@spec-kit/shared", "runtime/node_modules"]) {
  const p = path.join(skill, t);
  if (!fs.existsSync(p)) { console.log("MISSING " + t); continue; }
  const real = fs.realpathSync(p);
  console.log((real.startsWith(root) ? "OWN " : "FOREIGN ") + t);
}' "$WORKTREE/$S" "$WORKTREE"
```

- [ ] T004 Save the six tools (`scratch/tools/convert_hints.py`, `replace_block.py`, `mutate.py`, `apply_edits.py`, `suite_compare.py`, `strict-census.mjs`). Run the six blocks below, each exactly as written. Verify: the check block after them prints five `PY_OK` lines and then `NODE_OK`.

`convert_hints.py` turns each bare hint of a template into a value token. It skips fenced code, inline code, links, the five texts the scaffolder replaces and any `template:` text. A second run changes nothing.

```bash
cd "$WORKTREE"
cat > "$SC/tools/convert_hints.py" <<'PY'
# usage: convert_hints.py <template file>
# Rewrites the file in place and prints how many hints it turned into value tokens.
import re, sys

# A bracketed hint: a letter or slash, then at least two more characters, no nested brackets.
HINT = re.compile(r"\[(?!YOUR_VALUE_HERE)([A-Za-z/][^\]\[]{2,})\](?!\()")
# Text that create.sh replaces or strips at scaffold time must stay as written.
KEEP = ("NAME", "Feature Name", "YYYY-MM-DD", "###-feature-name", "1/2/3/3+")
CODE_SPAN = re.compile(r"`[^`]*`")

def convert_line(line):
    spans = [(m.start(), m.end()) for m in CODE_SPAN.finditer(line)]
    def inside_code(pos):
        return any(a <= pos < b for a, b in spans)
    def repl(m):
        body = m.group(1)
        if inside_code(m.start()) or body in KEEP or body.startswith("template:"):
            return m.group(0)
        counts["converted"] += 1
        return "[YOUR_VALUE_HERE: " + body + "]"
    return HINT.sub(repl, line)

path = sys.argv[1]
counts = {"converted": 0}
out, in_fence = [], False
for line in open(path, encoding="utf-8").read().split("\n"):
    if re.match(r"^\s*(```|~~~)", line):
        in_fence = not in_fence
        out.append(line)
        continue
    out.append(line if in_fence else convert_line(line))
open(path, "w", encoding="utf-8").write("\n".join(out))
print(f"converted {counts['converted']} in {path}")
PY
```

`replace_block.py` replaces the lines from one start marker up to an end marker and refuses unless each marker occurs once.

```bash
cd "$WORKTREE"
cat > "$SC/tools/replace_block.py" <<'PY'
import sys
# usage: replace_block.py <file> <start-line-prefix> <end-line-prefix> <new-block-file>
path, start, end, new_path = sys.argv[1:5]
lines = open(path, encoding="utf-8").read().split("\n")
starts = [i for i, l in enumerate(lines) if l.startswith(start)]
if len(starts) != 1:
    sys.exit(f"FAIL: start marker found {len(starts)} times")
ends = [i for i, l in enumerate(lines) if l.startswith(end) and i > starts[0]]
if len(ends) != 1:
    sys.exit(f"FAIL: end marker found {len(ends)} times after the start")
new = open(new_path, encoding="utf-8").read().rstrip("\n").split("\n") + [""]
lines[starts[0]:ends[0]] = new
open(path, "w", encoding="utf-8").write("\n".join(lines))
print(f"REPLACED lines {starts[0] + 1} to {ends[0]} of {path}")
PY
```

`mutate.py` replaces one exact text that must occur once.

```bash
cd "$WORKTREE"
cat > "$SC/tools/mutate.py" <<'PY'
import sys
# usage: mutate.py <file> <old> <new>   (old must occur exactly once)
p, old, new = sys.argv[1:4]
t = open(p, encoding="utf-8").read()
if t.count(old) != 1:
    sys.exit(f"FAIL: old text found {t.count(old)} times")
open(p, "w", encoding="utf-8").write(t.replace(old, new))
print("MUTATED")
PY
```

`apply_edits.py` applies old-text and new-text pairs to a doc and writes nothing unless every old text occurs once.

```bash
cd "$WORKTREE"
cat > "$SC/tools/apply_edits.py" <<'PY'
import sys
# usage: apply_edits.py <file> <edits-file>
# The edits file holds blocks separated by a line of three equals signs.
# Each block is OLD text, a line of three dashes, then NEW text.
# Every OLD text must occur exactly once or nothing is written.
path, edits_path = sys.argv[1], sys.argv[2]
text = open(path, encoding="utf-8").read()
blocks = [b for b in open(edits_path, encoding="utf-8").read().split("\n===\n") if b.strip()]
for number, block in enumerate(blocks, 1):
    old, sep, new = block.partition("\n---\n")
    if not sep:
        sys.exit(f"FAIL: block {number} has no divider")
    old, new = old.strip("\n"), new.strip("\n")
    if text.count(old) != 1:
        sys.exit(f"FAIL: block {number} old text found {text.count(old)} times")
    text = text.replace(old, new)
open(path, "w", encoding="utf-8").write(text)
print(f"APPLIED {len(blocks)} edits to {path}")
PY
```

`suite_compare.py` compares two suite outputs. It allows only the one new test file and its five tests.

```bash
cd "$WORKTREE"
cat > "$SC/tools/suite_compare.py" <<'PY'
import re, sys

def summary(path):
    rows = []
    for line in open(path, encoding="utf-8", errors="replace"):
        text = line.strip()
        if re.match(r"^(Test Files|Tests)\s", text) or re.match(r"^exit=\d+$", text):
            rows.append(re.sub(r"\s+", " ", text))
    return rows

def counts(row):
    passed = re.search(r"(\d+) passed", row)
    failed = re.search(r"(\d+) failed", row)
    total = re.search(r"\((\d+)\)", row)
    return (int(passed.group(1)) if passed else 0, int(failed.group(1)) if failed else 0, int(total.group(1)) if total else 0)

start, end = summary(sys.argv[1]), summary(sys.argv[2])
new_files, new_tests = int(sys.argv[3]), int(sys.argv[4])
if len(start) != len(end):
    sys.exit(f"SUITE_DIFF summary line counts differ: {len(start)} against {len(end)}")
files_changed, tests_changed = 0, 0
for before, after in zip(start, end):
    if before == after:
        continue
    kind = "files" if before.startswith("Test Files") else "tests" if before.startswith("Tests") else None
    after_kind = "files" if after.startswith("Test Files") else "tests" if after.startswith("Tests") else None
    if kind is None or kind != after_kind:
        sys.exit(f"SUITE_DIFF unexpected change: '{before}' became '{after}'")
    b, a = counts(before), counts(after)
    expected = new_files if before.startswith("Test Files") else new_tests
    if a != (b[0] + expected, b[1], b[2] + expected):
        sys.exit(f"SUITE_DIFF '{before}' became '{after}', expected {expected} more passed")
    if before.startswith("Test Files"):
        files_changed += 1
    else:
        tests_changed += 1
if files_changed != 1 or tests_changed != 1:
    sys.exit(f"SUITE_DIFF expected one Test Files line and one Tests line to change, got {files_changed} and {tests_changed}")
print("SUITE_MATCH_PLUS_NEW_TEST")
PY
```

`strict-census.mjs` validates each folder of a list with the orchestrator built in this checkout and prints one row per folder with the path, the verdict, the error count, the warning count and the status of the placeholder rule.

```bash
cd "$WORKTREE"
cat > "$SC/tools/strict-census.mjs" <<'JS'
// Validates every folder in a list file with the orchestrator built in this checkout
// and prints one tab-separated row per folder: path, verdict, errors, warnings, and the
// status of the placeholder rule. Reads folder paths, one per line, from argv[3].
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const orchestratorPath = path.resolve(process.argv[2]);
const listPath = process.argv[3];
const { validateFolder } = await import(pathToFileURL(orchestratorPath).href);
const folders = fs.readFileSync(listPath, 'utf8').split('\n').filter(Boolean);
for (const folder of folders) {
  let row;
  try {
    const report = validateFolder(folder, { strict: true });
    const placeholder = report.entries.find((item) => item.rule === 'PLACEHOLDER_FILLED');
    row = [folder, report.passed ? 'PASS' : 'FAIL', report.summary.errors, report.summary.warnings, placeholder ? placeholder.status : 'none'];
  } catch (error) {
    row = [folder, 'CRASH', 0, 0, String(error.message).split('\n')[0]];
  }
  process.stdout.write(`${row.join('\t')}\n`);
}
JS
```

```bash
cd "$WORKTREE"
for f in convert_hints replace_block mutate apply_edits suite_compare; do
  python3 -I -c "import ast, sys; ast.parse(open(sys.argv[1]).read())" "$SC/tools/$f.py" && echo "PY_OK $f"
done
node --check "$SC/tools/strict-census.mjs" && echo NODE_OK
```

- [ ] T005 Test the conversion tool on a copy and save the expected leftover list (`scratch/expected-leftovers.txt`). Run the first block, then the second. Verify: the second block prints five `converted` lines with `96`, `90`, `7`, `14` and `10`, then five `converted 0` lines, then five lines of the form `<file> total=<n> tokens=<m>` with `106 96`, `101 90`, `17 7`, `20 14` and `13 10`, then `LEFTOVERS_SAME`. The template files themselves are not touched by this task: `git status --porcelain $TPL` prints nothing.

```bash
cd "$WORKTREE"
cat > "$SC/expected-leftovers.txt" <<'TXT'
== core/spec.md.tmpl
5 [NAME]
1 [YYYY-MM-DD]
1 [template:level-1/spec.md]
1 [template:level-2/spec.md]
1 [template:level-3/spec.md]
1 [template:level_3+/spec.md]
== core/plan.md.tmpl
1 [DONE | IN PROGRESS | BLOCKED]
5 [NAME]
1 [TASK-ID]
1 [template:level-1/plan.md]
1 [template:level-2/plan.md]
1 [template:level-3/plan.md]
1 [template:level_3+/plan.md]
== core/tasks.md.tmpl
5 [NAME]
1 [YYYY-MM-DD]
1 [template:level-1/tasks.md]
1 [template:level-2/tasks.md]
1 [template:level-3/tasks.md]
1 [template:level_3+/tasks.md]
== core/implementation-summary.md.tmpl
1 [Feature Name]
1 [YYYY-MM-DD]
1 [template:level-1/implementation-summary.md]
1 [template:level-2/implementation-summary.md]
1 [template:level-3/implementation-summary.md]
1 [template:level_3+/implementation-summary.md]
== addons/acceptance-criteria.md.tmpl
2 [NAME]
1 [YYYY-MM-DD]
TXT
```

```bash
cd "$WORKTREE"
rm -rf "$SC/convtest" && mkdir -p "$SC/convtest/core" "$SC/convtest/addons"
for f in core/spec core/plan core/tasks core/implementation-summary addons/acceptance-criteria; do
  cp "$TPL/$f.md.tmpl" "$SC/convtest/$f.md.tmpl"
  python3 -I "$SC/tools/convert_hints.py" "$SC/convtest/$f.md.tmpl" | sed -E 's/ in .*//'
done
for f in core/spec core/plan core/tasks core/implementation-summary addons/acceptance-criteria; do
  python3 -I "$SC/tools/convert_hints.py" "$SC/convtest/$f.md.tmpl" | sed -E 's/ in .*//'
done
cd "$SC/convtest"
for f in core/spec.md.tmpl core/plan.md.tmpl core/tasks.md.tmpl core/implementation-summary.md.tmpl addons/acceptance-criteria.md.tmpl; do
  echo "$f total=$(rg -o '\[[A-Za-z/][^]\[]{2,}\]' "$f" | wc -l | tr -d ' ') tokens=$(rg -o '\[YOUR_VALUE_HERE: ' "$f" | wc -l | tr -d ' ')"
done | sed -E 's/^[^ ]+ total=([0-9]+) tokens=([0-9]+)/\1 \2/'
for f in core/spec.md.tmpl core/plan.md.tmpl core/tasks.md.tmpl core/implementation-summary.md.tmpl addons/acceptance-criteria.md.tmpl; do
  echo "== $f"; rg -o '\[[A-Za-z/][^]\[]{2,}\]' "$f" | rg -v '^\[YOUR_VALUE_HERE: ' | LC_ALL=C sort | uniq -c | sed -E 's/^ +//'
done > "$SC/convtest-leftovers.txt"
diff "$SC/expected-leftovers.txt" "$SC/convtest-leftovers.txt" > /dev/null && echo LEFTOVERS_SAME
cd "$WORKTREE" && rm -rf "$SC/convtest"
```

  The totals `106`, `101`, `17`, `17` and `13` are the hint counts of the untouched templates, so they match the original counts. A token counts as a hint under the same pattern, so the total does not change when a hint becomes a token.

- [ ] T006 Record the census before any change (`scratch/census/folders.txt`, `a-before.tsv`, `b-before-*.tsv`, `b-before.tsv`). Run the blocks below in order. Gate A checks the placeholder rule alone over every packet and takes about a minute. Gate B checks every rule and takes about 40 minutes on three shards. The folder list leaves out this packet, because its own docs change while the phase runs. Verify: the first block prints a count, the second prints one row `<count> PASS pass` when no packet holds a placeholder (a different line is data, keep it), the fourth prints `ROWS_OK` and then the PASS and FAIL totals. Save the Gate B totals in `goal.md` section 4 as the baseline. When the shell tool stops a command before the shards end, rerun the shard block with `nohup bash -c '...' &` around the same loop and wait until the fourth block prints `ROWS_OK`.

```bash
cd "$WORKTREE"
find specs -name spec.md -not -path '*/scratch/*' -not -path '*/node_modules/*' -not -path 'specs/system-speckit/054-weak-model-spec-authoring/*' | sed 's|/spec.md$||' | LC_ALL=C sort > "$CEN/folders.txt"
wc -l < "$CEN/folders.txt" | tr -d ' '
```

```bash
cd "$WORKTREE"
env SPECKIT_RULES=PLACEHOLDER_FILLED node "$SC/tools/strict-census.mjs" "$ORCH" "$CEN/folders.txt" > "$CEN/a-before.tsv"
cut -f2,5 "$CEN/a-before.tsv" | sort | uniq -c | sed -E 's/^ +//'
```

```bash
cd "$WORKTREE"
rm -f "$CEN"/shard-*.txt "$CEN"/b-before-*.tsv
awk -v d="$CEN" '{ print > (d "/shard-" (NR % 3) ".txt") }' "$CEN/folders.txt"
for i in 0 1 2; do
  env -u SPECKIT_RULES node "$SC/tools/strict-census.mjs" "$ORCH" "$CEN/shard-$i.txt" > "$CEN/b-before-$i.tsv" 2> "$CEN/b-before-$i.err" &
done
wait
cat "$CEN"/b-before-[012].tsv | LC_ALL=C sort > "$CEN/b-before.tsv"
```

```bash
cd "$WORKTREE"
[ "$(wc -l < "$CEN/b-before.tsv" | tr -d ' ')" = "$(wc -l < "$CEN/folders.txt" | tr -d ' ')" ] && [ "$(grep -c CRASH "$CEN/b-before.tsv")" = 0 ] && echo ROWS_OK
cut -f2 "$CEN/b-before.tsv" | sort | uniq -c | sed -E 's/^ +//'
```

  On this tree the folder list held 4766 folders and Gate A printed `4766 PASS pass`. Gate B per-folder time was about 1.4 seconds, so each of three shards runs about 35 minutes.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T007 Write the failing test and run it before any code change (`.skilled/skills/system-spec-kit/runtime/cli/tests/placeholder-token-gate.vitest.ts`, `scratch/test-red.txt`). The test builds a throwaway packet from the clean fixture `053-template-compliant-level2`, changes the stamp, the status and one line, and runs the orchestrator through `validate.sh` and the shell rule through `bash -c`. It imports nothing from the checkout by name, so it always runs the code beside it. Its first case asserts that the built orchestrator resolves inside this checkout. Run the first block, then the second. Verify: the second block prints a line with `× warns on a v2.3 doc with an unfilled token while the packet is a Draft`, a line `Failed Tests 1`, then `Tests  1 failed | 4 passed (5)`, then `exit=1`, and the grep for the code frame prints `1`. The red test must be this one and no other.

```bash
cd "$WORKTREE"
cat > "$S/runtime/cli/tests/placeholder-token-gate.vitest.ts" <<'TS'
// ───────────────────────────────────────────────────────────────────
// MODULE: Placeholder Token Gate
// ───────────────────────────────────────────────────────────────────

import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { afterEach, describe, expect, it } from 'vitest';

// Every path below is derived from this file's own location, so the test always
// exercises the checkout it sits in and never a linked copy of another one.
const here = path.dirname(fileURLToPath(import.meta.url));
const cliRoot = path.resolve(here, '..');
const runtimeRoot = path.resolve(cliRoot, '..');
const validateScript = path.join(cliRoot, 'spec', 'validate.sh');
const shellRule = path.join(cliRoot, 'rules', 'check-placeholders.sh');
const fixturesRoot = path.join(cliRoot, 'test-fixtures');
const createdRoots = new Set<string>();

type RuleStatus = 'pass' | 'warn' | 'error';

interface RuleEntry {
  rule: string;
  status: RuleStatus;
  message: string;
  details: string[];
}

interface PacketShape {
  stamp: 'v2.2' | 'v2.3';
  status: 'Draft' | 'Complete';
  line: string;
}

const TOKEN_LINE = '[YOUR_VALUE_HERE: one-paragraph problem statement]';
const QUESTION_LINE = '[NEEDS CLARIFICATION: which owner?]';

// Builds a throwaway packet from the clean Level 2 fixture. Only spec.md is
// changed: the stamp, the Status cell and one extra line in the problem section.
function buildPacket(shape: PacketShape): string {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'placeholder-token-gate-'));
  createdRoots.add(root);
  const folder = path.join(root, 'packet');
  fs.cpSync(path.join(fixturesRoot, '053-template-compliant-level2'), folder, { recursive: true });
  const spec = path.join(folder, 'spec.md');
  const text = fs
    .readFileSync(spec, 'utf8')
    .replace('| v2.2 -->', `| ${shape.stamp} -->`)
    .replace('| **Status** | Complete |', `| **Status** | ${shape.status} |`)
    .replace('### Purpose', `${shape.line}\n\n### Purpose`);
  fs.writeFileSync(spec, text, 'utf8');
  return folder;
}

function runOrchestrator(folder: string): { entry: RuleEntry; passed: boolean } {
  const result = spawnSync('bash', [validateScript, folder, '--no-recursive', '--strict', '--json'], {
    encoding: 'utf8',
    env: { ...process.env, SPECKIT_RULES: 'PLACEHOLDER_FILLED' },
  });
  const report = JSON.parse(result.stdout) as { entries: RuleEntry[]; passed: boolean };
  const matches = report.entries.filter((item) => item.rule === 'PLACEHOLDER_FILLED');
  if (matches.length !== 1) throw new Error(`expected one PLACEHOLDER_FILLED entry, found ${matches.length}`);
  return { entry: matches[0], passed: report.passed };
}

// The shell rule is the mirror the isolated rule tests drive. It reports fail
// where the orchestrator reports error, so the two are compared after that mapping.
function runShellRule(folder: string): RuleStatus {
  const script = `source "${path.join(cliRoot, 'lib', 'shell-common.sh')}"; source "${shellRule}"; run_check "${folder}" 2; echo "$RULE_STATUS"`;
  const result = spawnSync('bash', ['-c', script], { encoding: 'utf8' });
  const status = result.stdout.trim().split('\n').pop();
  return status === 'fail' ? 'error' : (status as RuleStatus);
}

afterEach(() => {
  for (const root of createdRoots) fs.rmSync(root, { recursive: true, force: true });
  createdRoots.clear();
});

describe('PLACEHOLDER_FILLED token gate', () => {
  it('runs the orchestrator built from this checkout', () => {
    const built = path.join(runtimeRoot, 'dist', 'lib', 'validation', 'orchestrator.js');
    const resolved = fs.realpathSync(built);
    const home = fs.realpathSync(runtimeRoot) + path.sep;
    expect(resolved.startsWith(home), `${built} resolves to ${resolved}, outside ${home}`).toBe(true);
  });

  it('warns on a v2.3 doc with an unfilled token while the packet is a Draft', { timeout: 30_000 }, () => {
    const folder = buildPacket({ stamp: 'v2.3', status: 'Draft', line: TOKEN_LINE });
    const { entry, passed } = runOrchestrator(folder);
    expect(entry.status).toBe('warn');
    expect(passed).toBe(true);
    expect(entry.details.some((detail) => detail.startsWith('spec.md:'))).toBe(true);
    expect(runShellRule(folder)).toBe('warn');
  });

  it('fails a v2.3 doc with an unfilled token once the status is not Draft', { timeout: 30_000 }, () => {
    const folder = buildPacket({ stamp: 'v2.3', status: 'Complete', line: TOKEN_LINE });
    const { entry, passed } = runOrchestrator(folder);
    expect(entry.status).toBe('error');
    expect(passed).toBe(false);
    expect(runShellRule(folder)).toBe('error');
  });

  it('keeps the strict verdict for a v2.2 doc even while the packet is a Draft', { timeout: 30_000 }, () => {
    const folder = buildPacket({ stamp: 'v2.2', status: 'Draft', line: TOKEN_LINE });
    const { entry, passed } = runOrchestrator(folder);
    expect(entry.status).toBe('error');
    expect(passed).toBe(false);
    expect(runShellRule(folder)).toBe('error');
  });

  it('never defers an open question, even in a v2.3 Draft', { timeout: 30_000 }, () => {
    const folder = buildPacket({ stamp: 'v2.3', status: 'Draft', line: QUESTION_LINE });
    const { entry } = runOrchestrator(folder);
    expect(entry.status).toBe('error');
    expect(runShellRule(folder)).toBe('error');
  });
});
TS
```

```bash
cd "$WORKTREE/$S/runtime/cli"
npx vitest run --config ../../vitest.config.ts --project cli tests/placeholder-token-gate.vitest.ts > "$SC/test-red.txt" 2>&1; echo "exit=$?" >> "$SC/test-red.txt"
grep -E '× warns on a v2.3|Tests +[0-9]|^exit=' "$SC/test-red.txt"
grep -c "expect(entry.status).toBe('warn')" "$SC/test-red.txt"
```

- [ ] T008 Replace the placeholder block of the orchestrator and rebuild (`.skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts`, `scratch/new/placeholders-block.ts`, `scratch/test-red-2.txt`). The block runs from the comment line that starts `// Canonical spec-doc placeholder markers. Mirrors check-placeholders.sh` up to, but not including, the line that starts `function validateTemplateSource(`. It holds the constant `PLACEHOLDER_MARKER_RE` and the function `validatePlaceholders`. The new block adds `CLARIFICATION_MARKER_RE`, `TOKEN_GATE_MIN_MAJOR`, `TOKEN_GATE_MIN_MINOR`, `TEMPLATE_STAMP_RE`, `carriesTokenGateStamp`, `cleanStatusCell` and `specStatusIsDraft`. Run the three blocks. Verify: the replace script prints `REPLACED lines` with two numbers, `rg -c 'carriesTokenGateStamp' $S/runtime/lib/validation/orchestrator.ts` prints `2`, `rg -c 'carriesTokenGateStamp' $S/runtime/dist/lib/validation/orchestrator.js` prints `2`, and the test still fails once, now at the shell line: the grep prints `1`. The shell rule is not changed yet, so the orchestrator is right and the mirror is wrong, which is the failure this step must show. When `validate.sh` instead prints `compiled validation orchestrator is stale`, the build did not run: run it again.

```bash
cd "$WORKTREE"
cat > "$SC/new/placeholders-block.ts" <<'TS'
// Canonical spec-doc placeholder markers. Mirrors check-placeholders.sh
// (YOUR_VALUE_HERE + NEEDS_CLARIFICATION underscore/space). Mustache `{{...}}`
// is intentionally NOT included: it is not the canonical spec-doc placeholder
// syntax and legit spec-doc content uses it, so flagging it false-positives.
const PLACEHOLDER_MARKER_RE = /<YOUR_VALUE_HERE:|\[YOUR_VALUE_HERE:|\[NEEDS_CLARIFICATION:|\[NEEDS CLARIFICATION:/u;
const CLARIFICATION_MARKER_RE = /\[NEEDS[_ ]CLARIFICATION:/u;

// A doc stamped with this template version or a later one ships every authoring
// hint as a value token, so a token still in it is work not yet done rather than
// a defect while the packet is a Draft. A doc with an older stamp, or none, was
// written before that contract and keeps the strict verdict it always had.
const TOKEN_GATE_MIN_MAJOR = 2;
const TOKEN_GATE_MIN_MINOR = 3;
const TEMPLATE_STAMP_RE = /^\s*<!--\s*SPECKIT_TEMPLATE_SOURCE:[^|>]*\|\s*v(\d+)\.(\d+)\s*-->/u;

function carriesTokenGateStamp(content: string): boolean {
  for (const line of content.split(/\r?\n/u).slice(0, 70)) {
    const stamp = TEMPLATE_STAMP_RE.exec(line);
    if (!stamp) continue;
    const major = Number(stamp[1]);
    const minor = Number(stamp[2]);
    return major > TOKEN_GATE_MIN_MAJOR || (major === TOKEN_GATE_MIN_MAJOR && minor >= TOKEN_GATE_MIN_MINOR);
  }
  return false;
}

function cleanStatusCell(cell: string): string {
  return cell.replace(/\*\*/gu, '').replace(/`/gu, '').trim();
}

// Reads the first Status row of spec.md's metadata table and reports whether its
// value is exactly Draft. Mirrors the shell classifier: quotes, case, trailing
// punctuation and repeated spaces do not change the answer, any other word does.
function specStatusIsDraft(folder: string): boolean {
  const spec = readIfExists(path.join(folder, 'spec.md'));
  if (!spec) return false;
  for (const line of spec.split(/\r?\n/u)) {
    if (!/^\s*\|/u.test(line)) continue;
    const cells = line.split('|');
    if (cells.length < 3) continue;
    if (cleanStatusCell(cells[1]).toLowerCase() !== 'status') continue;
    const value = cleanStatusCell(cells[2])
      .replace(/^["']/u, '')
      .replace(/["']$/u, '')
      .toLowerCase()
      .trim()
      .replace(/[\s.,;:!]+$/u, '')
      .replace(/\s+/gu, ' ');
    return value === 'draft';
  }
  return false;
}

function validatePlaceholders(folder: string, level: SpecKitLevel): ValidationEntry {
  const findings: string[] = [];
  const draftTokens: string[] = [];
  const draftPacket = specStatusIsDraft(folder);
  // A workflow loop owns the freeform docs and rewrites them whole at
  // synthesis, so a scaffolded skeleton's markers are not an author's debt.
  for (const docName of validationDocsForLevel(folder, level).filter((docName) => !FREEFORM_WORKFLOW_DOCS.has(docName))) {
    const content = readIfExists(path.join(folder, docName));
    if (!content) continue;
    const tokenGated = carriesTokenGateStamp(content);
    const lines = content.split(/\r?\n/u);
    // Track fenced code blocks: a line starting with ``` toggles in_code and is
    // itself skipped, matching check-placeholders.sh awk behavior.
    let inCode = false;
    lines.forEach((line, index) => {
      if (/^\s*```/u.test(line)) {
        inCode = !inCode;
        return;
      }
      if (inCode) return;
      const match = PLACEHOLDER_MARKER_RE.exec(line);
      if (!match) return;
      // Skip inline-backtick-wrapped markers: if the matched marker is
      // immediately preceded by a backtick on this line, it is escaped content
      // (parity with the shell rule's grep -v of backtick-wrapped cases).
      if (match.index > 0 && line.charAt(match.index - 1) === '`') return;
      const finding = `${docName}:${index + 1}: ${line.trim().slice(0, 120)}`;
      // Only a value token is deferred. An open question stays an error in
      // every packet, because it names a decision nobody has made.
      if (tokenGated && draftPacket && !CLARIFICATION_MARKER_RE.test(line)) {
        draftTokens.push(finding);
        return;
      }
      findings.push(finding);
    });
  }
  if (findings.length > 0) {
    return entry('PLACEHOLDER_FILLED', 'error', `${findings.length} placeholder(s) found`, findings);
  }
  if (draftTokens.length > 0) {
    return entry(
      'PLACEHOLDER_FILLED',
      'warn',
      `${draftTokens.length} unfilled value token(s) in a Draft packet. Fill each one before the status leaves Draft`,
      draftTokens,
    );
  }
  return entry('PLACEHOLDER_FILLED', 'pass', 'No unfilled template placeholders found');
}
TS
```

```bash
cd "$WORKTREE"
cp "$S/runtime/lib/validation/orchestrator.ts" "$SC/new/orchestrator.original.ts"
python3 -I "$SC/tools/replace_block.py" "$S/runtime/lib/validation/orchestrator.ts" '// Canonical spec-doc placeholder markers. Mirrors check-placeholders.sh' 'function validateTemplateSource(' "$SC/new/placeholders-block.ts"
(cd "$WORKTREE/$S/runtime" && npm run build 2>&1 | tail -3)
rg -c 'carriesTokenGateStamp' "$S/runtime/lib/validation/orchestrator.ts"
rg -c 'carriesTokenGateStamp' "$S/runtime/dist/lib/validation/orchestrator.js"
```

```bash
cd "$WORKTREE/$S/runtime/cli"
npx vitest run --config ../../vitest.config.ts --project cli tests/placeholder-token-gate.vitest.ts > "$SC/test-red-2.txt" 2>&1; echo "exit=$?" >> "$SC/test-red-2.txt"
grep -E 'Tests +[0-9]|^exit=' "$SC/test-red-2.txt"
grep -c "expect(runShellRule(folder)).toBe('warn')" "$SC/test-red-2.txt"
```

- [ ] T009 Replace the shell rule with the mirrored lifecycle (`.skilled/skills/system-spec-kit/runtime/cli/rules/check-placeholders.sh`, `scratch/new/check-placeholders.good.sh`). This writes the whole file. The new file sources `runtime/cli/lib/status-classifier.sh`, adds the helpers `carries_token_gate_stamp` and `spec_status_is_draft`, reads `acceptance-criteria.md`, `implementation-summary.md` and `goal.md` only when they carry the gate stamp, and ends with the status `warn` when only deferred tokens remain. Run the first block, then the second. Verify: `bash -n` prints `SYNTAX_OK`, the test prints `Tests  5 passed (5)` and `exit=0`, and the harness run prints `Individual Rule: PLACEHOLDER_FILLED (check-placeholders.sh): 8/8 passed`, `Edge Cases: Placeholder Contexts: 3/3 passed`, `Failed:  0` and `RESULT: PASSED`.

```bash
cd "$WORKTREE"
cat > "$S/runtime/cli/rules/check-placeholders.sh" <<'SH'
#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# COMPONENT: CHECK-PLACEHOLDERS
# ───────────────────────────────────────────────────────────────

# Sourced by validate.sh and compatible with strict mode.
set -euo pipefail

_placeholder_rule_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=../lib/status-classifier.sh
source "${_placeholder_rule_dir}/../lib/status-classifier.sh"

# Rule: PLACEHOLDER_FILLED
# Severity: error
# Description: Detects unfilled spec-doc placeholders: [YOUR_VALUE_HERE:], [NEEDS_CLARIFICATION:] / [NEEDS CLARIFICATION:],
#   and a [template:...] provenance token left in a title line. Bracketed authoring hints such as [Decision Title]
#   are soft by design and belong to spec/check-placeholders.sh, the standalone report.
# Lifecycle: a doc whose SPECKIT_TEMPLATE_SOURCE stamp is v2.3 or later ships every authoring hint as a
#   [YOUR_VALUE_HERE: ...] token. While spec.md has the Status Draft, an unfilled token in such a doc is a
#   warning. At any other status it is an error. A doc with an older stamp, or none, keeps the error it
#   always had. [NEEDS_CLARIFICATION:] is an error in every packet.
# Parity: mirrors the runtime orchestrator validatePlaceholders. Mustache {{...}} is NOT flagged
# (not canonical spec-doc placeholder syntax; legit spec-doc content uses it).
# The post-edit hook runs the broader bracket scan at spec/check-placeholders.sh
# instead; that one catches leftovers of upgrade-level, this one gates closure.

# ───────────────────────────────────────────────────────────────
# 1. HELPERS
# ───────────────────────────────────────────────────────────────

# Succeeds when the doc carries a SPECKIT_TEMPLATE_SOURCE stamp of v2.3 or later
# within its first 70 lines. A doc with an older stamp, or none, fails.
carries_token_gate_stamp() {
    local filepath="$1"
    local stamp_line major minor
    stamp_line=$(head -n 70 "$filepath" 2>/dev/null | \
        grep -m1 -E '^[[:space:]]*<!--[[:space:]]*SPECKIT_TEMPLATE_SOURCE:[^|>]*\|[[:space:]]*v[0-9]+\.[0-9]+[[:space:]]*-->' || true)
    [[ -n "$stamp_line" ]] || return 1
    major=$(printf '%s' "$stamp_line" | sed -E 's/.*\|[[:space:]]*v([0-9]+)\.([0-9]+).*/\1/')
    minor=$(printf '%s' "$stamp_line" | sed -E 's/.*\|[[:space:]]*v([0-9]+)\.([0-9]+).*/\2/')
    if (( major > 2 )) || { (( major == 2 )) && (( minor >= 3 )); }; then
        return 0
    fi
    return 1
}

# Succeeds when the Status row of spec.md holds exactly the word Draft.
spec_status_is_draft() {
    local folder="$1"
    local value
    value="$(extract_status_table_value "$folder/spec.md")"
    [[ "$(speckit_status_trim "$value")" == "draft" ]]
}

# ───────────────────────────────────────────────────────────────
# 2. INITIALIZATION
# ───────────────────────────────────────────────────────────────

run_check() {
    local folder="$1"
    local level="$2"
    
    RULE_NAME="PLACEHOLDER_FILLED"
    RULE_STATUS="pass"
    RULE_MESSAGE=""
    RULE_DETAILS=()
    RULE_REMEDIATION=""
    
    local -a files=("spec.md" "plan.md" "tasks.md")
    [[ -f "$folder/decision-record.md" ]] && files+=("decision-record.md")
    # These three are read only when they carry the token-gate stamp, so a doc
    # with an older stamp is scanned exactly as it was before.
    files+=("acceptance-criteria.md" "implementation-summary.md" "goal.md")
    
    local -a found_placeholders=()
    local -a draft_tokens=()
    local draft_packet=false
    if spec_status_is_draft "$folder"; then
        draft_packet=true
    fi

# ───────────────────────────────────────────────────────────────
# 3. VALIDATION LOGIC
# ───────────────────────────────────────────────────────────────

    for file in "${files[@]}"; do
        local filepath="$folder/$file"
        [[ ! -f "$filepath" ]] && continue
        
        # Skip: scratch/, memory/, templates/
        if [[ "$filepath" == *"/scratch/"* ]] || \
           [[ "$filepath" == *"/memory/"* ]] || \
           [[ "$filepath" == *"/templates/"* ]]; then
            continue
        fi
        
        if type -t should_skip_path &>/dev/null; then
            if should_skip_path "$filepath"; then
                continue
            fi
        fi

        local token_gated=false
        if carries_token_gate_stamp "$filepath"; then
            token_gated=true
        fi
        case "$file" in
            acceptance-criteria.md|implementation-summary.md|goal.md)
                [[ "$token_gated" == true ]] || continue
                ;;
        esac
        
        # Filter out fenced code blocks
        local filtered
        filtered=$(awk '
            BEGIN { in_code = 0 }
            /^```/ { in_code = !in_code; next }
            !in_code { print NR ":" $0 }
        ' "$filepath" 2>/dev/null)
        
        # Pattern 1: [YOUR_VALUE_HERE:] (skip inline backticks)
        # A token in a Draft packet is deferred to a warning when the doc carries
        # the token-gate stamp and the line holds no open question.
        while IFS= read -r match; do
            if [[ -n "$match" ]]; then
                local linenum="${match%%:*}"
                if [[ "$token_gated" == true && "$draft_packet" == true ]] && \
                   ! printf '%s' "$match" | grep -qE '\[NEEDS[_ ]CLARIFICATION:'; then
                    draft_tokens+=("$file:$linenum")
                else
                    found_placeholders+=("$file:$linenum")
                fi
            fi
        done < <(echo "$filtered" | grep -E '\[YOUR_VALUE_HERE:' 2>/dev/null | \
                 grep -v '`\[YOUR_VALUE_HERE:' | \
                 grep -v '\[YOUR_VALUE_HERE:[^]]*\]`' || true)
        
        # Pattern 2: [NEEDS_CLARIFICATION:] / [NEEDS CLARIFICATION:] (underscore + space)
        # Strict superset-parity with the canonical orchestrator: both variants flagged.
        while IFS= read -r match; do
            if [[ -n "$match" ]]; then
                local linenum="${match%%:*}"
                found_placeholders+=("$file:$linenum")
            fi
        done < <(echo "$filtered" | grep -E '\[NEEDS[_ ]CLARIFICATION:' 2>/dev/null | \
                 grep -v '`\[NEEDS[_ ]CLARIFICATION:' | \
                 grep -v '\[NEEDS[_ ]CLARIFICATION:[^]]*\]`' || true)

        # Pattern 3: a template's [template:...] provenance token left in a title.
        # Scoped to title lines because that is the only place a scaffold ever
        # carried it; the scaffolder strips it, so a survivor is a hand-copied
        # template or a document older than that fix.
        while IFS= read -r match; do
            if [[ -n "$match" ]]; then
                local linenum="${match%%:*}"
                found_placeholders+=("$file:$linenum")
            fi
        done < <(echo "$filtered" | grep -E '^[0-9]+:[[:space:]]*title:.*\[template:' 2>/dev/null || true)
    done
    
    # Deduplicate (bash 3.2 compatible)
    local -a unique_placeholders=()
    local seen_list=""
    if [[ ${#found_placeholders[@]} -gt 0 ]]; then
        for item in "${found_placeholders[@]}"; do
            if [[ "$seen_list" != *"|$item|"* ]]; then
                seen_list="$seen_list|$item|"
                unique_placeholders+=("$item")
            fi
        done
    fi

    local -a unique_draft_tokens=()
    seen_list=""
    if [[ ${#draft_tokens[@]} -gt 0 ]]; then
        for item in "${draft_tokens[@]}"; do
            if [[ "$seen_list" != *"|$item|"* ]]; then
                seen_list="$seen_list|$item|"
                unique_draft_tokens+=("$item")
            fi
        done
    fi

# ───────────────────────────────────────────────────────────────
# 4. RESULTS
# ───────────────────────────────────────────────────────────────

    local count=${#unique_placeholders[@]}
    local draft_count=${#unique_draft_tokens[@]}
    
    if [[ $count -gt 0 ]]; then
        RULE_STATUS="fail"
        RULE_MESSAGE="Found $count unfilled placeholder(s)"
        RULE_DETAILS=("${unique_placeholders[@]}")
        RULE_REMEDIATION="Replace [YOUR_VALUE_HERE:] and [NEEDS_CLARIFICATION:] / [NEEDS CLARIFICATION:] with actual values"
    elif [[ $draft_count -gt 0 ]]; then
        RULE_STATUS="warn"
        RULE_MESSAGE="Found $draft_count unfilled value token(s) in a Draft packet"
        RULE_DETAILS=("${unique_draft_tokens[@]}")
        RULE_REMEDIATION="Replace each [YOUR_VALUE_HERE: ...] token with actual content before the status leaves Draft"
    else
        RULE_STATUS="pass"
        RULE_MESSAGE="No unfilled placeholders found"
    fi
}

# Exit codes:
#   0 - Success
SH
bash -n "$S/runtime/cli/rules/check-placeholders.sh" && echo SYNTAX_OK
```

```bash
cd "$WORKTREE/$S/runtime/cli"
npx vitest run --config ../../vitest.config.ts --project cli tests/placeholder-token-gate.vitest.ts > "$SC/test-green.txt" 2>&1; echo "exit=$?" >> "$SC/test-green.txt"
grep -E 'Tests +[0-9]|^exit=' "$SC/test-green.txt"
cd "$WORKTREE"
cp "$S/runtime/cli/rules/check-placeholders.sh" "$SC/new/check-placeholders.good.sh"
cp "$S/runtime/lib/validation/orchestrator.ts" "$SC/new/orchestrator.good.ts"
bash "$S/runtime/cli/tests/test-validation-extended.sh" -c PLACEHOLDER 2>&1 | grep -E 'PLACEHOLDER_FILLED|Placeholder Contexts|Failed:|^RESULT'
```

- [ ] T010 Prove the test notices each break (`scratch/mutation.txt`). Run the block below. It breaks the code three ways, one at a time, rebuilds, runs the test, and restores the good copy saved by T009. Verify: it prints `M1_RED`, `M2_RED`, `M3_RED` and then `GREEN_AGAIN`. M1 removes the stamp check from the orchestrator. M2 removes the Draft check from the orchestrator. M3 removes the stamp check from the shell rule. A line `M?_STILL_GREEN` means the test would not catch that break: write it in `goal.md` section 4 and block this task. After the block, `diff "$SC/new/orchestrator.good.ts" "$S/runtime/lib/validation/orchestrator.ts" && diff "$SC/new/check-placeholders.good.sh" "$S/runtime/cli/rules/check-placeholders.sh" && echo RESTORED` must print `RESTORED`.

```bash
cd "$WORKTREE"
gate_test() {
  (cd "$WORKTREE/$S/runtime" && npm run build > /dev/null 2>&1)
  (cd "$WORKTREE/$S/runtime/cli" && npx vitest run --config ../../vitest.config.ts --project cli tests/placeholder-token-gate.vitest.ts 2>&1)
}
ORCHTS="$S/runtime/lib/validation/orchestrator.ts"
SHRULE="$S/runtime/cli/rules/check-placeholders.sh"
: > "$SC/mutation.txt"

python3 -I "$SC/tools/mutate.py" "$ORCHTS" 'if (tokenGated && draftPacket && !CLARIFICATION_MARKER_RE.test(line))' 'if (draftPacket && !CLARIFICATION_MARKER_RE.test(line))' >> "$SC/mutation.txt"
out=$(gate_test); printf '%s\n' "$out" >> "$SC/mutation.txt"
if printf '%s' "$out" | grep -qF 'keeps the strict verdict for a v2.2 doc'; then echo M1_RED; else echo M1_STILL_GREEN; fi
cp "$SC/new/orchestrator.good.ts" "$ORCHTS"

python3 -I "$SC/tools/mutate.py" "$ORCHTS" 'if (tokenGated && draftPacket && !CLARIFICATION_MARKER_RE.test(line))' 'if (tokenGated && !CLARIFICATION_MARKER_RE.test(line))' >> "$SC/mutation.txt"
out=$(gate_test); printf '%s\n' "$out" >> "$SC/mutation.txt"
if printf '%s' "$out" | grep -qF 'fails a v2.3 doc with an unfilled token once the status is not Draft'; then echo M2_RED; else echo M2_STILL_GREEN; fi
cp "$SC/new/orchestrator.good.ts" "$ORCHTS"

python3 -I "$SC/tools/mutate.py" "$SHRULE" 'if [[ "$token_gated" == true && "$draft_packet" == true ]] && \' 'if [[ "$draft_packet" == true ]] && \' >> "$SC/mutation.txt"
out=$(gate_test); printf '%s\n' "$out" >> "$SC/mutation.txt"
if printf '%s' "$out" | grep -qF 'keeps the strict verdict for a v2.2 doc'; then echo M3_RED; else echo M3_STILL_GREEN; fi
cp "$SC/new/check-placeholders.good.sh" "$SHRULE"

out=$(gate_test)
if printf '%s' "$out" | grep -qE 'Tests +5 passed \(5\)'; then echo GREEN_AGAIN; else echo NOT_GREEN; fi
```

- [ ] T011 Convert the five templates, stamp them and update the manifest (`.skilled/skills/system-spec-kit/templates/core/*.tmpl` for spec, plan, tasks and implementation-summary, `templates/addons/acceptance-criteria.md.tmpl`, `templates/spec-kit-docs.json`, `scratch/templates-before/`). Run the first block, then the second. Verify: the first block prints five `converted` lines with `96`, `90`, `7`, `14` and `10`. In the second block the stamp count prints five lines with 7 stamps in all, the manifest count prints `5`, the leftover check prints `LEFTOVERS_SAME`, the token total prints `217`, and the check for old stamps prints nothing. A different converted number means the template differs from the one this plan was written against: restore from `scratch/templates-before/`, write the difference in `goal.md` section 4 and block the task.

```bash
cd "$WORKTREE"
for f in core/spec core/plan core/tasks core/implementation-summary addons/acceptance-criteria; do
  mkdir -p "$SC/templates-before/$(dirname "$f")"
  cp "$TPL/$f.md.tmpl" "$SC/templates-before/$f.md.tmpl"
  python3 -I "$SC/tools/convert_hints.py" "$TPL/$f.md.tmpl" | sed -E 's/ in .*//'
  perl -pi -e 's/(<!-- SPECKIT_TEMPLATE_SOURCE:[^|>]*\| )v2\.2( -->)/$1v2.3$2/' "$TPL/$f.md.tmpl"
done
perl -pi -e 's/("(?:spec|plan|tasks|implementation-summary|acceptance-criteria)\.md\.tmpl": )"v2\.2"/$1"v2.3"/' "$TPL/spec-kit-docs.json"
```

```bash
cd "$WORKTREE"
rg -n 'SPECKIT_TEMPLATE_SOURCE:[^|]*\| v2\.3 -->' $TPL/core/spec.md.tmpl $TPL/core/plan.md.tmpl $TPL/core/tasks.md.tmpl $TPL/core/implementation-summary.md.tmpl $TPL/addons/acceptance-criteria.md.tmpl | sed -E 's/:[0-9]+:.*//' | sort | uniq -c | sed -E 's/^ +//'
rg -c '"(spec|plan|tasks|implementation-summary|acceptance-criteria)\.md\.tmpl": "v2\.3"' "$TPL/spec-kit-docs.json"
cd "$TPL"
for f in core/spec.md.tmpl core/plan.md.tmpl core/tasks.md.tmpl core/implementation-summary.md.tmpl addons/acceptance-criteria.md.tmpl; do
  echo "== $f"; rg -o '\[[A-Za-z/][^]\[]{2,}\]' "$f" | rg -v '^\[YOUR_VALUE_HERE: ' | LC_ALL=C sort | uniq -c | sed -E 's/^ +//'
done > "$SC/leftovers-after.txt"
diff "$SC/expected-leftovers.txt" "$SC/leftovers-after.txt" > /dev/null && echo LEFTOVERS_SAME
cat core/spec.md.tmpl core/plan.md.tmpl core/tasks.md.tmpl core/implementation-summary.md.tmpl addons/acceptance-criteria.md.tmpl | rg -o '\[YOUR_VALUE_HERE: ' | wc -l | tr -d ' '
rg -n 'SPECKIT_TEMPLATE_SOURCE:[^|]*\| v2\.2' core/spec.md.tmpl core/plan.md.tmpl core/tasks.md.tmpl core/implementation-summary.md.tmpl addons/acceptance-criteria.md.tmpl
```

  The stamp count lists five files: `addons/acceptance-criteria.md.tmpl` with `1`, `core/implementation-summary.md.tmpl` with `1`, `core/plan.md.tmpl` with `1`, `core/spec.md.tmpl` with `3` and `core/tasks.md.tmpl` with `1`. The bare texts left are `[NAME]`, `[YYYY-MM-DD]`, `[Feature Name]`, the `[template:...]` titles that `create.sh` strips, and the two texts `[TASK-ID]` and `[DONE | IN PROGRESS | BLOCKED]` that sit in one inline code span of `plan.md.tmpl`.

- [ ] T012 Fix the reference docs (`.skilled/skills/system-spec-kit/references/templates/template-guide.md`, `references/validation/validation-rules.md`). Write the two edit files, then apply each. `apply_edits.py` writes nothing unless every old text occurs once. Run the three blocks. Verify: the two apply commands print `APPLIED 5 edits` and `APPLIED 1 edits`, `rg -c 'PLACEHOLDER\]' $S/references/templates/template-guide.md` prints nothing, and `rg -c 'Lifecycle For Docs Stamped v2.3 Or Later' $S/references/validation/validation-rules.md` prints `1`. A refusal that says `old text found 0 times` means the doc changed since this plan was written: read the doc, write the difference in `goal.md` section 4 and block the task.

```bash
cd "$WORKTREE"
cat > "$SC/new/guide-edits.txt" <<'TXT'
4. **Remove placeholders** - Replace ALL `[PLACEHOLDER]` text with actual content
---
4. **Remove placeholders** - Replace every `[YOUR_VALUE_HERE: ...]` token with actual content. A new packet may keep tokens while its status is Draft, and validation fails them at any other status
===
- `[PLACEHOLDER]` - **MUST** be replaced with actual content
---
- `[YOUR_VALUE_HERE: ...]` - **MUST** be replaced with actual content. In a doc stamped v2.3 or later it is a warning while the spec status is Draft and an error at any other status. In an older doc it is always an error
===
- Search for `[PLACEHOLDER]`
---
- Search for `YOUR_VALUE_HERE:`
===
3. **Fill every placeholder** - Replace `[PLACEHOLDER]` with actual content
---
3. **Fill every placeholder** - Replace every `[YOUR_VALUE_HERE: ...]` token with actual content
===
- [ ] All placeholders replaced (`[PLACEHOLDER]`, `[NEEDS CLARIFICATION: ...]`)
---
- [ ] All placeholders replaced (`[YOUR_VALUE_HERE: ...]`, `[NEEDS CLARIFICATION: ...]`)
TXT
cat > "$SC/new/rules-edits.txt" <<'TXT'
### Excluded Paths

- `**/scratch/**` - Scratch files are never scanned
---
### Lifecycle For Docs Stamped v2.3 Or Later

A doc whose `SPECKIT_TEMPLATE_SOURCE` stamp names version v2.3 or later ships every authoring hint as a `[YOUR_VALUE_HERE: ...]` token. For such a doc the rule reads the Status row of `spec.md` and decides the severity of each unfilled token.

| Status in `spec.md` | Unfilled `[YOUR_VALUE_HERE: ...]` token | `[NEEDS CLARIFICATION: ...]` |
| ------------------- | --------------------------------------- | ---------------------------- |
| Draft               | WARNING                                 | ERROR                        |
| Any other value     | ERROR                                   | ERROR                        |

A doc with an older stamp, or none, keeps the ERROR it always had, and Draft changes nothing for it. The orchestrator reads every authored doc that is present. The shell mirror reads `spec.md`, `plan.md`, `tasks.md` and `decision-record.md`, and it adds `acceptance-criteria.md`, `implementation-summary.md` and `goal.md` only when they carry the stamp. A warning never fails `--strict`. The status word must be exactly Draft, so Planned, In Progress and Complete all count as any other value.

### Excluded Paths

- `**/scratch/**` - Scratch files are never scanned
TXT
```

```bash
cd "$WORKTREE"
python3 -I "$SC/tools/apply_edits.py" "$S/references/templates/template-guide.md" "$SC/new/guide-edits.txt"
python3 -I "$SC/tools/apply_edits.py" "$S/references/validation/validation-rules.md" "$SC/new/rules-edits.txt"
```

```bash
cd "$WORKTREE"
rg -c 'PLACEHOLDER\]' "$S/references/templates/template-guide.md"
rg -c 'Lifecycle For Docs Stamped v2.3 Or Later' "$S/references/validation/validation-rules.md"
```

- [ ] T013 Regenerate the golden snapshot and run the template tests (`.skilled/skills/system-spec-kit/runtime/cli/tests/snapshots/scaffold-golden-snapshots.vitest.ts.snap`, `scratch/snap-before.snap`). The snapshot test renders the converted templates, so without `-u` it fails on four tests. Run the first block, then the second. Verify: the first block prints `Snapshots  16 updated` (a different number is fine when the diff check below passes) and `Tests  12 passed (12)`. In the second block the first two numbers are equal (324 when this plan was written), and the last two print `0`. The last two prove every added line holds a token or a v2.3 stamp and every removed line held a hint or a v2.2 stamp. The third block prints `Test Files  5 passed (5)` and `Tests  32 passed (32)`. Two existing tests hard-code the old stamp and fail after the conversion: `tests/level-contract-resolver.vitest.ts` expects the manifest version of `spec.md.tmpl` to be v2.2, and `tests/upgrade-legacy.vitest.ts` removes a plan stamp line spelled with v2.2. The fourth block writes one edit file for each and applies them, and the fifth block runs both. Verify: the fourth block prints `APPLIED 1 edits` twice and the fifth block prints `Test Files  2 passed (2)` and `Tests  74 passed (74)`. A refusal that says `old text found 0 times` means the test changed since this plan was written: read it, write the difference in `goal.md` section 4 and block the task. The line for `before-after.md.tmpl` stays v2.2, because that template is not converted.

```bash
cd "$WORKTREE"
SNAP="$S/runtime/cli/tests/snapshots/scaffold-golden-snapshots.vitest.ts.snap"
cp "$SNAP" "$SC/snap-before.snap"
(cd "$WORKTREE/$S/runtime/cli" && npx vitest run --config ../../vitest.config.ts --project cli tests/scaffold-golden-snapshots.vitest.ts -u 2>&1 | grep -E 'Snapshots|Tests +[0-9]')
```

```bash
cd "$WORKTREE"
SNAP="$S/runtime/cli/tests/snapshots/scaffold-golden-snapshots.vitest.ts.snap"
diff "$SC/snap-before.snap" "$SNAP" | rg -c '^<'
diff "$SC/snap-before.snap" "$SNAP" | rg -c '^>'
diff "$SC/snap-before.snap" "$SNAP" | rg '^>' | rg -v 'YOUR_VALUE_HERE|v2\.3 -->' | wc -l | tr -d ' '
diff "$SC/snap-before.snap" "$SNAP" | rg '^<' | rg -v '\[[A-Za-z/]|v2\.2 -->' | wc -l | tr -d ' '
```

```bash
cd "$WORKTREE/$S/runtime/cli"
npx vitest run --config ../../vitest.config.ts --project cli tests/template-version-parity.vitest.ts tests/workflow-invariance.vitest.ts tests/template-structure.vitest.ts tests/scaffold-golden-snapshots.vitest.ts tests/placeholder-token-gate.vitest.ts 2>&1 | grep -E 'Test Files|Tests +[0-9]|×'
```

```bash
cd "$WORKTREE"
cat > "$SC/new/levelcontract-edits.txt" <<'TXT'
    expect(serialized.templateVersions['spec.md.tmpl']).toBe('v2.2');
---
    expect(serialized.templateVersions['spec.md.tmpl']).toBe('v2.3');
TXT
cat > "$SC/new/upgradelegacy-edits.txt" <<'TXT'
    const planSourceLine = '<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->';
---
    const planSourceLine = '<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.3 -->';
TXT
python3 -I "$SC/tools/apply_edits.py" "$S/runtime/cli/tests/level-contract-resolver.vitest.ts" "$SC/new/levelcontract-edits.txt"
python3 -I "$SC/tools/apply_edits.py" "$S/runtime/cli/tests/upgrade-legacy.vitest.ts" "$SC/new/upgradelegacy-edits.txt"
```

```bash
cd "$WORKTREE/$S/runtime/cli"
npx vitest run --config ../../vitest.config.ts --project cli tests/level-contract-resolver.vitest.ts tests/upgrade-legacy.vitest.ts 2>&1 | grep -E 'Test Files|Tests +[0-9]|×'
```
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T014 Smoke-test a real scaffold in the throwaway track (`specs/zz-bench-gate/`, deleted at the end). Run the blocks in order. Verify: the first block prints `1` from the `--track` source check, because `create.sh --help` omits that flag. The Level 1 Draft block prints `! PLACEHOLDER_FILLED:` with `unfilled value token(s) in a Draft packet`, `Summary: Errors: 0` and `RESULT: PASSED`. The Complete block prints `error` with `placeholder(s) found`. The old-stamp block prints `error` with `placeholder(s) found`. The Level 2 block prints `112 112 101 101 0` over the five docs a Level 2 scaffold creates: 112 hints, 112 tokens, 101 distinct hints, 101 distinct tokens and no bare hint. The last block prints `TRACK_GONE`. The token counts printed in the Level 1 messages vary with the template text, so only the status words matter there. When a block prints `PASSED` where `error` is expected, the lifecycle is not active: stop and read T008 and T009 again.

```bash
cd "$WORKTREE"
rg -c -- '^        --track\)' $S/runtime/cli/spec/create.sh
rm -rf specs/zz-bench-gate
bash $S/runtime/cli/spec/create.sh --skip-branch --level 1 --track zz-bench-gate --short-name gate-smoke "Gate smoke test" > "$SC/logs/smoke-create.txt" 2>&1; echo "create exit=$?"
P=specs/zz-bench-gate/001-gate-smoke
rg -n 'SPECKIT_TEMPLATE_SOURCE' $P/spec.md $P/plan.md $P/tasks.md | sed -E 's/^[^:]+:[0-9]+://'
bash $S/runtime/cli/spec/validate.sh $P --strict 2>&1 | grep -E 'PLACEHOLDER_FILLED|^Summary|^RESULT'
```

```bash
cd "$WORKTREE"
P=specs/zz-bench-gate/001-gate-smoke
perl -pi -e 's/\| \*\*Status\*\* \| Draft \|/| **Status** | Complete |/' $P/spec.md
env SPECKIT_RULES=PLACEHOLDER_FILLED bash $S/runtime/cli/spec/validate.sh $P --strict --json 2>&1 | jq -r '.entries[] | select(.rule=="PLACEHOLDER_FILLED") | "\(.status) \(.message)"'
perl -pi -e 's/\| \*\*Status\*\* \| Complete \|/| **Status** | Draft |/' $P/spec.md
perl -pi -e 's/\| v2\.3 -->/| v2.2 -->/' $P/spec.md $P/plan.md $P/tasks.md
env SPECKIT_RULES=PLACEHOLDER_FILLED bash $S/runtime/cli/spec/validate.sh $P --strict --json 2>&1 | jq -r '.entries[] | select(.rule=="PLACEHOLDER_FILLED") | "\(.status) \(.message)"'
rm -rf specs/zz-bench-gate
```

```bash
cd "$WORKTREE"
bash $S/runtime/cli/spec/create.sh --skip-branch --level 2 --track zz-bench-gate --short-name gate-l2 "Gate level two" > "$SC/logs/smoke-create-l2.txt" 2>&1
P=specs/zz-bench-gate/001-gate-l2
HINT='\[[A-Za-z/][^]\[]{2,}\]'
{
  echo "$(rg -o "$HINT" $P/spec.md $P/plan.md $P/tasks.md $P/acceptance-criteria.md $P/implementation-summary.md | wc -l | tr -d ' ') $(rg -o '\[YOUR_VALUE_HERE: ' $P/spec.md $P/plan.md $P/tasks.md $P/acceptance-criteria.md $P/implementation-summary.md | wc -l | tr -d ' ') $(rg -o --no-filename "$HINT" $P/spec.md $P/plan.md $P/tasks.md $P/acceptance-criteria.md $P/implementation-summary.md | sort -u | wc -l | tr -d ' ') $(rg -o --no-filename '\[YOUR_VALUE_HERE: [^]]*\]' $P/spec.md $P/plan.md $P/tasks.md $P/acceptance-criteria.md $P/implementation-summary.md | sort -u | wc -l | tr -d ' ') $(rg -o --no-filename "$HINT" $P/spec.md $P/plan.md $P/tasks.md $P/acceptance-criteria.md $P/implementation-summary.md | rg -v '^\[YOUR_VALUE_HERE: ' | wc -l | tr -d ' ')"
}
rm -rf specs/zz-bench-gate
test ! -e specs/zz-bench-gate && echo TRACK_GONE
```

  The Level 2 line prints five numbers: all hints, tokens, distinct hints, distinct tokens and bare hints. It counts the five docs a Level 2 scaffold creates: `spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md` and `acceptance-criteria.md`. `inline-gate-renderer.sh --level 2` prints 117 bracketed hints over the four docs without `implementation-summary.md` and 131 over all five, and `finalize_scaffold_templates` replaces the scaffolder texts, so a converted Level 2 scaffold prints `112 112 101 101 0`. Phase 1 counted 97 because its regex needs a letter after the bracket.

- [ ] T015 Record the census after the change and compare (`scratch/census/a-after.tsv`, `b-after-*.tsv`, `b-after.tsv`). Run the blocks in order, using the same folder list as T006. Verify: the compare block prints `CENSUS_SAME gate A` and `CENSUS_SAME gate B`. A `CENSUS_DIFF` line lists up to 40 differing rows. Gate A must be identical. For Gate B, a folder whose verdict changed but whose placeholder column did not change is first rerun twice with the current build: write both results in `goal.md` section 4. A verdict that flips between two runs of the same build is noise from a time-based rule and does not block. A verdict that is stable and different, or any change in the placeholder column, blocks the phase.

```bash
cd "$WORKTREE"
env SPECKIT_RULES=PLACEHOLDER_FILLED node "$SC/tools/strict-census.mjs" "$ORCH" "$CEN/folders.txt" > "$CEN/a-after.tsv"
rm -f "$CEN"/b-after-*.tsv
for i in 0 1 2; do
  env -u SPECKIT_RULES node "$SC/tools/strict-census.mjs" "$ORCH" "$CEN/shard-$i.txt" > "$CEN/b-after-$i.tsv" 2> "$CEN/b-after-$i.err" &
done
wait
cat "$CEN"/b-after-[012].tsv | LC_ALL=C sort > "$CEN/b-after.tsv"
```

```bash
cd "$WORKTREE"
if cmp -s "$CEN/a-before.tsv" "$CEN/a-after.tsv"; then echo "CENSUS_SAME gate A"; else echo "CENSUS_DIFF gate A"; diff "$CEN/a-before.tsv" "$CEN/a-after.tsv" | head -40; fi
cut -f1,2,5 "$CEN/b-before.tsv" > "$CEN/b-before.cut"
cut -f1,2,5 "$CEN/b-after.tsv" > "$CEN/b-after.cut"
if cmp -s "$CEN/b-before.cut" "$CEN/b-after.cut"; then echo "CENSUS_SAME gate B"; else echo "CENSUS_DIFF gate B"; diff "$CEN/b-before.cut" "$CEN/b-after.cut" | head -40; fi
cut -f2 "$CEN/b-after.tsv" | sort | uniq -c | sed -E 's/^ +//'
```

  Gate A was run on the real corpus of 4766 folders in a scratch copy with the new build and printed identical files. Gate B compares the path, the verdict and the placeholder column and leaves the warning counts out, because a count can move with a time-based rule.

- [ ] T016 Check the phase 1 ledger rows owned by this phase and record the follow-ups (`goal.md`). Run the block. Verify: it prints one line per owner `003` row, each starting with `HANDLED`, `OPEN` or `OUTSIDE`. Copy the lines into `goal.md` section 4. A row marked `OPEN` whose file is inside the file list of `spec.md` section 3 is a defect this phase missed: fix it by the same tool and rerun the affected checks. A row marked `OUTSIDE` names a file this phase does not own: leave it and record it. Then confirm the five operator items OP-1 to OP-5 are rows in `goal.md` section 4, and fill the probe output for OP-1 to OP-3 with the probes below.

```bash
cd "$WORKTREE"
LED="$P1/scratch/ledger/ledger.jsonl"
for id in $(jq -r 'select(.owner_phase=="003") | .id' "$LED"); do
  file=$(jq -r --arg i "$id" 'select(.id==$i) | .file' "$LED")
  cmd=$(jq -r --arg i "$id" 'select(.id==$i) | .evidence_cmd' "$LED")
  exp=$(jq -r --arg i "$id" 'select(.id==$i) | .evidence_expect' "$LED")
  inside=no
  case "$file" in
    */templates/core/*|*/templates/addons/acceptance-criteria.md.tmpl|*/references/templates/template-guide.md|*/references/validation/validation-rules.md) inside=yes ;;
  esac
  if bash -c "$cmd" 2>&1 | grep -qF -- "$exp"; then
    if [ "$inside" = yes ]; then echo "OPEN $id $file"; else echo "OUTSIDE $id $file"; fi
  else
    echo "HANDLED $id $file"
  fi
done
```

  The probes for the operator items follow. The first block makes two probe folders outside any `scratch/` folder, because the scanner skips those. The post-edit scanner must exit `1` on the fenced hint, which is wrong, and exit `0` on the value token, which is the colon blind spot of ADR-003.

```bash
cd "$WORKTREE"
PR=$(mktemp -d) && mkdir -p "$PR/probe-fence" "$PR/probe-token"
printf '# t\n\n%s\n[Some hint here]\n%s\n' '```text' '```' > "$PR/probe-fence/t.md"
printf '# t\n\nPriority: [YOUR_VALUE_HERE: fill me in]\n' > "$PR/probe-token/t.md"
for d in probe-fence probe-token; do bash $S/runtime/cli/spec/check-placeholders.sh "$PR/$d" > /dev/null 2>&1; echo "$d exit=$?"; done
rm -rf "$PR"
```

  For ADR-005 run `node $S/runtime/cli/spec/repo-era.mjs . | jq -c '.signals.templateMarkers'` once with this tree and once with the build of the start commit. The counts in this repository went from `{"new":16871,"legacy":2374,"none":510}` to `{"new":1421,"legacy":17824,"none":510}`. For ADR-006 the probe is the `upgrade-level` tests inside T017.

- [ ] T017 Run the whole spec-kit suite and compare it with the phase 1 start (`scratch/suite-end.txt`). Run the first block. It takes a long time: its duration is UNKNOWN until it runs, so give it up to the 10 minute bound per invocation that `runtime/scripts/run-tests.mjs` sets and read its output. Then run the second block. Verify: the second block prints `SUITE_MATCH_PLUS_NEW_TEST`. The compare tool accepts only a `Test Files` line that rose by 1 passed, a `Tests` line that rose by 5 passed, and an identical `exit=` line. Everything else must be identical. When it prints `SUITE_DIFF`, read the reason, read the lines of `suite-end.txt` that start with `FAIL` or hold `×`, and rerun the first block once before you decide, because a flaky test can differ between runs. A second `SUITE_DIFF` blocks the phase. Then run the third block and write its output in `goal.md` section 4: it shows whether the two `upgrade-level` suites changed, which is the ADR-006 probe.

```bash
cd "$WORKTREE"
npm --prefix "$WORKTREE/$S" test > "$SC/suite-end.txt" 2>&1; echo "exit=$?" >> "$SC/suite-end.txt"
```

```bash
cd "$WORKTREE"
python3 -I "$SC/tools/suite_compare.py" "$P1/scratch/baseline/suite-start.txt" "$SC/suite-end.txt" 1 5
```

```bash
cd "$WORKTREE"
grep -nE 'upgrade-level-sections|test-upgrade-level|repo-era|doctor-update-compat' "$SC/suite-end.txt" | head -12
grep -c '^ *FAIL ' "$SC/suite-end.txt"
```

- [ ] T018 Check that only the file list changed (`scratch/allowed-files.txt`, `scratch/changed-files.txt`). Run the block. Verify: the last command prints `0`. A path it lists is a change no part of this phase explains. Restore it with `git restore --source="$P3START" -- <path>`, rebuild when it was source, and record it in `goal.md` section 4. The untracked new test file is not in `git diff`, so the block also checks it with `git status --porcelain`.

```bash
cd "$WORKTREE"
{
  for f in core/spec.md.tmpl core/plan.md.tmpl core/tasks.md.tmpl core/implementation-summary.md.tmpl addons/acceptance-criteria.md.tmpl spec-kit-docs.json; do echo "$TPL/$f"; done
  echo "$S/runtime/lib/validation/orchestrator.ts"
  echo "$S/runtime/cli/rules/check-placeholders.sh"
  echo "$S/runtime/cli/tests/placeholder-token-gate.vitest.ts"
  echo "$S/runtime/cli/tests/snapshots/scaffold-golden-snapshots.vitest.ts.snap"
  echo "$S/runtime/cli/tests/level-contract-resolver.vitest.ts"
  echo "$S/runtime/cli/tests/upgrade-legacy.vitest.ts"
  echo "$S/references/templates/template-guide.md"
  echo "$S/references/validation/validation-rules.md"
  sed 's/^...//' "$SC/status-start.txt"
} | sort -u > "$SC/allowed-files.txt"
{ git diff --name-only; git status --porcelain | sed 's/^...//'; } | grep -v "^$PHASE_REL/" | sort -u > "$SC/changed-files.txt"
comm -13 "$SC/allowed-files.txt" "$SC/changed-files.txt" | wc -l | tr -d ' '
```

- [ ] T019 Frontier review of the diff (`scratch/review/T019.txt`). Read `.skilled/skills/cli-external-orchestration/cli-codex/SKILL.md` first and use its read-only invocation with the `gpt-6-luna` model. Write the brief with the first block and send it with the second block. Verify: `grep -cvE '^(P0|P1|P2) |^NO FINDINGS$' "$SC/review/T019.txt"` prints `0`, which means every line is a finding or the file holds the single line `NO FINDINGS`.

```bash
cd "$WORKTREE"
cat > "$SC/briefs/T019.txt" <<BRIEF
GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.
You are a non-interactive read-only reviewer. AI_SESSION_CHILD=1 is set.
You write nothing, so no documentation-scope question applies. Do not edit, create or delete any file.
ROLE: You are a read-only reviewer of a code and text diff. Your output is checked line by line by a script.
Run: git diff $P3START --stat
Then run: git diff $P3START -- $S/runtime $S/references $S/templates/spec-kit-docs.json
Then read $S/runtime/cli/tests/placeholder-token-gate.vitest.ts and $PHASE_REL/spec.md section 4.
Check these six things:
(1) The orchestrator and the shell rule give the same result for the four cells the test pins, and neither can warn for a doc without the v2.3 stamp.
(2) A warning is possible only for a [YOUR_VALUE_HERE: token, never for [NEEDS CLARIFICATION:, and only while spec.md has the Status Draft.
(3) The shell rule reads acceptance-criteria.md, implementation-summary.md and goal.md only when they carry the stamp, so its behavior for older docs is unchanged.
(4) Run: git diff $P3START --stat -- $S/templates. Only the five named templates and spec-kit-docs.json changed. In each template every changed line either turns a bracketed hint into a [YOUR_VALUE_HERE: token with the same text or changes a stamp from v2.2 to v2.3.
(5) No code comment names a spec, phase, task, ADR or finding id.
(6) template-guide.md and validation-rules.md describe what the code does.
Return one line per finding in this form, and nothing else:
P0|P1|P2 <file>:<line> | <what is wrong> | <the exact old text> => <the exact new text>
Return the single line NO FINDINGS when there are none.
BRIEF
```

```bash
cd "$WORKTREE"
AI_SESSION_CHILD=1 codex exec --model gpt-6-luna -c model_reasoning_effort="high" -c service_tier="fast" \
  -c approval_policy=never --sandbox read-only "$(cat "$SC/briefs/T019.txt")" </dev/null \
  > "$SC/review/T019.txt" 2> "$SC/review/T019.err" &
PID=$!; wait "$PID"; kill -9 "$PID" 2>/dev/null; pkill -9 -P "$PID" 2>/dev/null
```

- [ ] T020 Apply the review findings (`goal.md`, the files the findings name). For each `P0` or `P1` line, split the third column at the first ` => ` into the exact old text and the exact new text, write them as one block with the old text above a `---` line and the new text below it in an edits file and apply it with `python3 -I "$SC/tools/apply_edits.py" <file> <edits-file>`. `apply_edits.py` writes nothing unless the old text occurs once. Then rerun T009's test, T013's third block, T015 and T018. For each `P2` line, fix it the same way or write the reason it was not fixed in `goal.md` section 4. A finding that asks for a change outside the file list is not applied: write it in `goal.md` section 4 and raise it to the operator. Record each finding as a row of the form `| FINDING <P0/P1/P2> <file>:<line> | APPLIED or RECORDED |` in the findings table of `goal.md` section 4. Run the block below. Verify: it prints `FINDINGS_TALLIED` with two equal numbers, or `NO_FINDINGS_OK` when T019 holds the single line `NO FINDINGS`.

```bash
cd "$WORKTREE"
REVIEW="$SC/review/T019.txt"
if grep -qx 'NO FINDINGS' "$REVIEW"
then
  test "$(grep -c '^| FINDING ' "$PHASE/goal.md")" = 0 && echo NO_FINDINGS_OK
else
  before=$(grep -c '' "$REVIEW")
  after=$(grep -c '^| FINDING ' "$PHASE/goal.md")
  echo "FINDINGS_TALLIED $before $after"
  test "$before" = "$after"
fi
```

- [ ] T021 Close the phase (this folder, no commit). Run `bash $S/runtime/cli/spec/validate.sh "$PHASE" --strict`. Fill `implementation-summary.md` with what changed and the results of T005, T009, T010, T011, T013, T014, T015, T017 and T018, and keep the operator items in it. Mark each row of `acceptance-criteria.md` `Met` with its evidence and set the closure statement. Confirm that `git log -1 --format=%H` still prints `$P3START`, because this phase makes no commit and the operator commits. Verify: the validate command prints `RESULT: PASSED`, `git log -1 --format=%H` prints the hash from T003, and `rg -c '^\| AC-[0-9]+ .*\| Unmet \|' "$PHASE/acceptance-criteria.md"` prints nothing.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Every acceptance criterion marked `Met` with its evidence
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`, which holds the lifecycle table, the affected surfaces, the AI execution protocol and the decision records
- **Phase 1 outputs**: See `../001-template-drift-census-and-baseline/scratch/ledger/ledger.jsonl` and `../001-template-drift-census-and-baseline/scratch/baseline/suite-start.txt`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Phase 2 closed and the templates still original, shown by T001
- [ ] CHK-002 [P0] T001 to T006 done with their verify output recorded in `goal.md` section 4
- [ ] CHK-003 [P0] T003 printed no `FOREIGN` line and recorded the start commit
- [ ] CHK-004 [P1] The census before ran on the unchanged tree and its totals are in `goal.md` section 4
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] T007 showed exactly one red test, and it was the Draft-warns case
- [ ] CHK-011 [P0] T010 printed `M1_RED`, `M2_RED`, `M3_RED` and `GREEN_AGAIN`
- [ ] CHK-012 [P1] No code comment in the orchestrator block, the shell rule or the test names a spec, phase, task, ADR or finding id
- [ ] CHK-013 [P1] The shell rule changed only through the whole-file write of T009 and the orchestrator only through `replace_block.py`
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met
- [ ] CHK-021 [P0] T015 printed `CENSUS_SAME gate A` and `CENSUS_SAME gate B`
- [ ] CHK-022 [P0] T017 printed `SUITE_MATCH_PLUS_NEW_TEST`
- [ ] CHK-023 [P1] T013 diff check printed equal counts and two zeros
- [ ] CHK-024 [P1] A step that failed is recorded with its error and not silently replaced
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Every hint of the five templates is a token or is on the kept list: `LEFTOVERS_SAME` in T011 and `217` tokens.
- [ ] CHK-FIX-002 [P0] The 7 stamp lines and the 5 manifest entries read v2.3, and no old stamp is left in the five templates.
- [ ] CHK-FIX-003 [P0] The orchestrator and the shell rule agree on the four pinned cells, shown by the shell assertions in the test.
- [ ] CHK-FIX-004 [P1] The four cells the test does not pin keep their old behavior, shown by the 8 isolated and 3 edge cases of the harness.
- [ ] CHK-FIX-005 [P1] The five `[PLACEHOLDER]` lines of the template guide are corrected and the rules reference describes the lifecycle.
- [ ] CHK-FIX-006 [P1] The five operator items are rows in `goal.md` section 4, with probe output for OP-1 to OP-3.
- [ ] CHK-FIX-007 [P1] Evidence is pinned to the start commit recorded in T003.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No brief, tool or test contains a credential, token or key
- [ ] CHK-031 [P0] No command ran against a path outside `$WORKTREE` except reads of `$P1`
- [ ] CHK-032 [P1] The review ran read-only with `AI_SESSION_CHILD=1`
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec, plan and tasks agree on the lifecycle table, the 217 conversions and the 7 stamp lines
- [ ] CHK-041 [P1] `goal.md` section 4 records the start commit, each census total, each blocker and each operator item
- [ ] CHK-042 [P2] `implementation-summary.md` names the exact commands that produced each number
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Working files are under this phase's `scratch/` only, and the one created source file is the new test
- [ ] CHK-051 [P1] `specs/zz-bench-gate/` does not exist at phase close
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 16 | 0/16 |
| P1 Items | 24 | 0/24 |
| P2 Items | 9 | 0/9 |

**Verification Date**: not yet run
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: Architecture Verification

- [ ] CHK-100 [P0] ADR-001 to ADR-007 in `plan.md` are followed by T004 to T012
- [ ] CHK-101 [P1] Every ADR has status Accepted
- [ ] CHK-102 [P1] Each ADR names the alternative it rejected and why
- [ ] CHK-103 [P2] No data migration applies to this phase
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: Performance Verification

- [ ] CHK-110 [P1] Each census shard finished within 90 minutes or was rerun once (NFR-P01)
- [ ] CHK-111 [P1] The suite duration is recorded in `goal.md` section 4, replacing the UNKNOWN in `plan.md`
- [ ] CHK-112 [P2] No load test applies to this phase
- [ ] CHK-113 [P2] Gate A time and Gate B time recorded in `goal.md` section 4
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: Deployment Readiness

- [ ] CHK-120 [P0] Rollback in `plan.md` section 7 was not needed, or was run and recorded
- [ ] CHK-121 [P0] Nothing outside the file list changed, shown by T018
- [ ] CHK-122 [P1] Phase 4 can start: the five templates hold only tokens and the kept list, and the stamp is v2.3
- [ ] CHK-123 [P1] `goal.md` section 4 names the next phase as ready and states what it may assume
- [ ] CHK-124 [P2] No deployment applies to this phase, the operator commits
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: Compliance Verification

- [ ] CHK-130 [P1] Frontier review ran read-only and its reply is saved
- [ ] CHK-131 [P1] No new dependency was installed
- [ ] CHK-132 [P2] No user data is handled by this phase
- [ ] CHK-133 [P2] No OWASP surface is touched by this phase
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: Documentation Verification

- [ ] CHK-140 [P1] `spec.md`, `plan.md`, `tasks.md` and `acceptance-criteria.md` agree at close
- [ ] CHK-141 [P1] `implementation-summary.md` cites the census files, the suite compare output and the review file
- [ ] CHK-142 [P2] `validation-rules.md` and `template-guide.md` agree with the code
- [ ] CHK-143 [P2] Per-file conversion counts recorded for phase 4
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: Sign-Off

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Conductor | Runs and verifies every task | Pending | |
| Frontier reviewer | Reads the diff read-only | Pending | |
| Operator | Commits the phase | Pending | |
<!-- /ANCHOR:sign-off -->

