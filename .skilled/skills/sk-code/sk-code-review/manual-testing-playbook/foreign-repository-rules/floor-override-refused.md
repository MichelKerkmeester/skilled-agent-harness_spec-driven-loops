---
title: "CR-031 -- Floor override refused"
description: "This scenario validates a refused floor override for `CR-031`. It focuses on the shared linter refusing a `none` row on the input validation rule, the resolver marking the checklist refused and the review still enforcing the rule while listing the checklist under `Refused:`."
version: 1.0.0.0
---

# CR-031 -- Floor override refused

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `CR-031`.

---

## 1. OVERVIEW

This scenario validates a refused floor override for `CR-031`. A repository's style document tries to drop input validation, one of the rules the shared contract fixes. The scenario checks three layers: the linter refuses the section, the quality runner's explain entry reports the checklist as refused with no usable rows, and a live review of a handler that reads a file name from a request still raises the path traversal while naming the refused checklist on its `Rule sources:` line.

### Why This Matters

The portable rules only help if the hard floor stays hard. A repository can drop or replace most rules, but a reviewer that let a repository declare "our callers always send clean input" would approve a handler that serves arbitrary files. The contract fixes the floor in one place, `rule-overrides.json`, and every reader refuses a row that names it. The scenario passes only when each layer refuses the row, the review applies none of the section's rows and the finding keeps its full severity.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CR-031` and confirm the expected signals without contradictory evidence.

- Objective: Confirm the linter exits 1 on the `none` row for `floor.input-validation`, the resolver reports the checklist as refused with no rows, and a live review lists `Refused: docs/code-style.md`, raises the path traversal at P0 or P1 and ends on `REQUESTED_CHANGES`.
- Real user request: `Review this download handler before I commit it.`
- Prompt: `Review this download handler before I commit it.`
- Expected execution process: Run the deterministic command sequence, save the review output, check its final line and findings, and record a PASS, FAIL, or SKIP verdict with rationale; SKIP only when no review executor can run in the session, and name the missing executor as the blocker.
- Expected signals: Step 1: the fixture is written to a scratch folder outside the repository; Step 2: the linter prints the refusal for line 9 and exits 1; Step 3: the resolver prints `refused true` and no rows for the style document; Step 4: the `Rule sources:` line carries `Overrides: none` and `Refused:` naming the style document, one finding at P0 or P1 names the path traversal through `request.query.name`, and the status is `REQUESTED_CHANGES`; Step 5: both report checkers exit 0.
- Desired user-visible outcome: the review tells the operator the style note cannot switch off input validation and blocks the commit on the traversal.
- Pass/fail: PASS iff the linter exits 1, the resolver marks the checklist refused, the `Rule sources:` line lists it under `Refused:` with no override applied, the traversal is raised at P0 or P1 and both checkers exit 0; FAIL when any layer accepts the row, the review treats input validation as dropped, or the traversal is downgraded to P2.

Fixture build (the builder prints the scratch folder it created):

```bash
SCRATCH="$(mktemp -d)"
mkdir -p "$SCRATCH/.sk-code" "$SCRATCH/docs" "$SCRATCH/src"
cat > "$SCRATCH/src/download.js" <<'JS'
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.join(__dirname, '..', 'files');

function download(request, response) {
  const target = path.join(ROOT, request.query.name);
  response.end(fs.readFileSync(target));
}

module.exports = { download };
JS
cat > "$SCRATCH/.sk-code/quality.json" <<'JSON'
{
  "schemaVersion": 1,
  "checklists": [{ "file": "docs/code-style.md", "extensions": [".js"] }]
}
JSON
cat > "$SCRATCH/docs/code-style.md" <<'MD'
# Code style

Handlers in this repository trust their callers.

## Rule overrides

| Rule | Action | Reason |
| --- | --- | --- |
| `floor.input-validation` | none | Our callers always send clean input |
MD
echo "$SCRATCH"
```

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Run the fixture build from the repository root and keep the folder it prints as `SCRATCH`. Keep `HUB` set to the absolute path of `.skilled/skills/sk-code`.
2. Run the linter over the style document and read its output and exit status.
3. Run the resolver from the fixture root and read the line it prints for the style document.
4. Run the exact prompt through the chosen review executor with the fixture as its working repository and `HUB` as the installed sk-code folder, and save the full output.
5. Run both report checkers over the saved output. Record executor, model, wall-clock duration, and total tokens with the verdict.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CR-031 | Floor override refused | Confirm the linter, the resolver and a live review each refuse a `none` row on the input validation rule, and the review still raises the path traversal. | `Review this download handler before I commit it.` | bash: build the fixture and set HUB -> bash: node check-rule-overrides.cjs over the style document -> bash: run the resolver from the fixture root -> agent: @review src/download.js in the fixture as an explicit file list -> bash: node `<sk-code-review>`/scripts/check-review-final-line.js and check-review-findings.js over the saved output -> record executor, model, duration and tokens | Step 1: the fixture is written verbatim; Step 2: the refusal for line 9 and exit 1; Step 3: `refused true` with an empty row list; Step 4: `Overrides: none`, `Refused: docs/code-style.md` and a P0 or P1 traversal finding; Step 5: both checkers exit 0 | Saved review output, linter output and exit status, resolver output, both checker outputs, executor, model, duration and token count | PASS iff all three layers refuse the row and the traversal keeps P0 or P1; FAIL when a layer accepts the row, input validation is treated as dropped or the traversal is P2 | 1. Confirm the fixture was written verbatim; 2. Re-run with the same executor and model before changing the verdict; 3. Quote the `Rule sources:` line and the finding's severity, and check whether the executor ran the resolver from the fixture root |

### Exact Commands

Step 2, from the repository root:

```bash
HUB="$PWD/.skilled/skills/sk-code"
node "$HUB/shared/scripts/check-rule-overrides.cjs" "$SCRATCH/docs/code-style.md"
echo "linter exit $?"
```

Step 3, from the fixture root:

```bash
cd "$SCRATCH" && node "$HUB/sk-code-quality/scripts/quality-gate.cjs" --explain src/download.js | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{const j=JSON.parse(s);for(const c of j.checklists)console.log(c.file+" "+c.source+" refused "+c.overrides.refused+" rows "+c.overrides.rows.length)})'
```

Step 5, from the repository root:

```bash
node .skilled/skills/sk-code/sk-code-review/scripts/check-review-final-line.js <saved review output>
node .skilled/skills/sk-code/sk-code-review/scripts/check-review-findings.js <saved review output>
```

### Expected

Step 2 prints the refusal and the exit line, with the scratch folder in place of `<scratch>`:

```text
<scratch>/docs/code-style.md:9: `floor.input-validation` is on the hard floor (Input validation: every external input is validated at the boundary) and cannot be overridden
FAIL <scratch>/docs/code-style.md: 1 refused
linter exit 1
```

Step 3 prints one line per checklist (the resolver exits 2, which is its advisory exit):

```text
hub:sk-code/shared/references/universal/code-quality-standards.md default refused false rows 0
docs/code-style.md repo-config refused true rows 0
```

Step 4 returns a report whose summary carries a line of this shape:

```text
Rule sources: hub:sk-code/shared/references/universal/code-quality-standards.md, docs/code-style.md. Overrides: none. Refused: docs/code-style.md. Ignored: none. Conflicts: none
```

The report lists the path traversal through `request.query.name` as a P0 or P1 finding with a `Case:` line, and ends on `Review status: REQUESTED_CHANGES`. Step 5 prints `OK: review output ends on the exact status line` and `OK: findings are numbered once and each carries a Case line`, and each checker exits 0.

| Signal | Expected value |
| --- | --- |
| Linter | refusal for line 9, exit 1 |
| Resolver, the style document | `refused true`, zero rows |
| `Rule sources:` line | `Overrides: none`, `Refused: docs/code-style.md` |
| Path traversal finding | P0 or P1, with a `Case:` line |
| Final status | `REQUESTED_CHANGES` |
| Final-line and findings checkers | exit 0 |

### Evidence

Command transcript from steps 1 to 5, the linter output and exit status, the resolver line for the style document, the saved review output with its `Rule sources:` line and the traversal finding quoted, both checker outputs with their exit status, and the executor, model, duration and token count. Save the transcript under the dated run label the playbook names.

### Optional Supplemental Checks

If the primary run passes, change the row to a lens id such as `review.performance`, rerun the linter and the resolver and confirm the section is now accepted: the linter exits 0 and the resolver reports `refused false` with one row. That shows the refusal came from the floor id and not from the section's shape. Keep supplemental evidence separate from the primary verdict.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `../manual-testing-playbook.md` | Root directory page and scenario summary |
| `../../README.md` | Skill overview and current operator-facing description |

### Implementation Anchors

| File | Role |
|---|---|
| `../../SKILL.md` | Phase 3 resolver step and the `Rule sources:` line in the output contract |
| `../../references/review-core.md` | Section 8: the floor ids, the outcomes table and the `Refused:` group |
| `../../../shared/references/universal/rule-overrides.md` | Section 4, the hard floor, and section 8, the linter and its exit codes |
| `../../../shared/references/universal/rule-overrides.json` | The machine-readable floor the linter reads |
| `../../../shared/scripts/check-rule-overrides.cjs` | The linter that refuses the row |
| `../../scripts/check-review-final-line.js` | Final-line check and the `Rule sources:` format check |
| `../../scripts/check-review-findings.js` | Finding numbering and severity comparison |

---

## 5. SOURCE METADATA

- Group: Foreign Repository Rules
- Playbook ID: CR-031
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `foreign-repository-rules/floor-override-refused.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
