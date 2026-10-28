---
title: "CR-029 -- Repository that wants almost no inline comments"
description: "This scenario validates a repository that wants almost no inline comments for `CR-029`. It focuses on the review reading the repository's own rule overrides through the quality runner's explain entry, applying a dropped documentation rule and a switched-off tracker-id hygiene rule, and raising no finding for either."
version: 1.0.3.0
---

# CR-029 -- Repository that wants almost no inline comments

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `CR-029`.

---

## 1. OVERVIEW

This scenario validates a repository that wants almost no inline comments for `CR-029`. It focuses on a live review of a small helper in a repository whose style document drops the documentation rule and whose quality config switches off the tracker-id hygiene rule, and on whether the review honors both instead of applying this framework's own house style.

### Why This Matters

A review that carries one house style into every repository raises findings the repository has already decided against. This repository keeps functions free of doc comments and writes one tracker reference in a comment, which the default rules would flag twice: once as missing documentation and once as an ephemeral pointer. The repository says so in the two places the contract reads, a `## Rule overrides` row in a declared checklist and `commentHygiene.disableRules` in its quality config. The scenario passes only when the review reads both through the resolver, records them on the `Rule sources:` line and raises nothing for either rule.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CR-029` and confirm the expected signals without contradictory evidence.

- Objective: Confirm a live review of the helper applies the repository's `none` overrides for `floor.documentation` and `hygiene.issue`, lists both on the `Rule sources:` line and raises no finding for missing doc comments or for the tracker reference in the comment.
- Real user request: `Review this helper before I commit it. Our repository keeps code nearly free of comments.`
- Prompt: `Review this helper before I commit it.`
- Expected execution process: Run the deterministic command sequence, save the review output, check its final line and findings, and record a PASS, FAIL, or SKIP verdict with rationale; SKIP only when no review executor can run in the session, and name the missing executor as the blocker.
- Expected signals: Step 1: the fixture is written to a scratch folder outside the repository; Step 2: the resolver prints `hygiene.disabled hygiene.issue` and one repository checklist row with `floor.documentation:none` and `hygiene.issue:none`; Step 3: the review's `Rule sources:` line lists the style document and both `none` overrides, and no finding cites `floor.documentation`, `floor.ephemeral-pointers` or a `hygiene.*` id; Step 4: both report checkers exit 0.
- Desired user-visible outcome: the review accepts the repository's own style, so the operator is not asked to add comments or remove a tracker reference the repository wants.
- Pass/fail: PASS iff the `Rule sources:` line records both overrides, no finding is raised for missing documentation or for the tracker reference, and both checkers exit 0; FAIL when the review flags either, drops the `Rule sources:` line, or reports a different rule source than the resolver printed.

Fixture build (the builder prints the scratch folder it created):

```bash
SCRATCH="$(mktemp -d)"
mkdir -p "$SCRATCH/.skilled/skills/sk-code/sk-code-quality/repository" "$SCRATCH/docs" "$SCRATCH/src" "$SCRATCH/test"
cat > "$SCRATCH/src/total.js" <<'JS'
// Fixes #12: an empty list totals zero
function total(items) {
  return items.reduce((sum, item) => sum + item, 0);
}

function average(items) {
  return items.length === 0 ? 0 : total(items) / items.length;
}

module.exports = { total, average };
JS
cat > "$SCRATCH/test/total.test.js" <<'JS'
const assert = require('node:assert/strict');
const { test } = require('node:test');
const { total, average } = require('../src/total');

test('total sums a list and returns zero for an empty one', () => {
  assert.equal(total([1, 2, 3]), 6);
  assert.equal(total([]), 0);
});

test('average divides by the count and returns zero for an empty list', () => {
  assert.equal(average([2, 4]), 3);
  assert.equal(average([]), 0);
});
JS
cat > "$SCRATCH/.skilled/skills/sk-code/sk-code-quality/repository/quality.json" <<'JSON'
{
  "schemaVersion": 1,
  "checklists": [{ "file": "docs/code-style.md", "extensions": [".js"] }],
  "commentHygiene": { "disableRules": ["issue"] }
}
JSON
cat > "$SCRATCH/docs/code-style.md" <<'MD'
# Code style

This repository keeps code nearly free of inline comments. Names carry the meaning, and the one comment a file may hold is a tracker reference.

## Rule overrides

| Rule | Action | Reason |
| --- | --- | --- |
| `floor.documentation` | none | Functions carry no doc comments here |
| `hygiene.issue` | none | The team writes tracker references in comments |
MD
mkdir -p "$SCRATCH/.devin/skills" && cp -R "$HUB" "$SCRATCH/.devin/skills/sk-code"
echo "$SCRATCH"
```

The copy installs the hub in the skills folder of the runtime doing the review, `.devin/skills` for the devin executor used here, and a copy rather than a link keeps a reviewer with write permission from touching the tracked hub.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Run the fixture build from the repository root and keep the folder it prints as `SCRATCH`. Keep `HUB` set to the absolute path of `.skilled/skills/sk-code`.
2. Run the resolver from the fixture root and read the four lines it prints.
3. Run the exact prompt through the chosen review executor with the fixture as its working repository and `HUB` as the installed sk-code folder, and save the full output.
4. Run both report checkers over the saved output and read their exit status.
5. Compare the findings and the `Rule sources:` line against this contract. Record executor, model, wall-clock duration, and total tokens with the verdict.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CR-029 | Repository that wants almost no inline comments | Confirm a live review applies the repository's `none` overrides for documentation and the tracker-id hygiene rule and raises no finding for either. | `Review this helper before I commit it.` | bash: build the fixture and set HUB -> bash: run the resolver from the fixture root -> agent: @review src/total.js in the fixture as an explicit file list -> bash: node `<sk-code-review>`/scripts/check-review-final-line.js and check-review-findings.js over the saved output -> record executor, model, duration and tokens | Step 1: the fixture is written verbatim; Step 2: `hygiene.disabled hygiene.issue` and `docs/code-style.md repo-config floor.documentation:none hygiene.issue:none`; Step 3: the `Rule sources:` line lists both overrides and no finding cites the dropped rules; Step 4: both checkers exit 0 | Saved review output, resolver output, both checker outputs, executor, model, duration and token count | PASS iff both overrides are recorded, no documentation or tracker-reference finding is raised and both checkers exit 0; FAIL on a finding for either rule, a missing `Rule sources:` line or a checker failure | 1. Confirm the fixture was written verbatim and the resolver printed the four lines; 2. Re-run with the same executor and model before changing the verdict; 3. Quote the finding or the missing line, and check whether the executor ran the resolver from the fixture root |

### Exact Commands

Step 2, from the fixture root:

```bash
HUB="$PWD/.skilled/skills/sk-code"
cd "$SCRATCH" && node "$HUB/sk-code-quality/scripts/quality-gate.cjs" --explain src/total.js | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{const j=JSON.parse(s);console.log("surfaces "+j.surfaces.join(","));console.log("hygiene.disabled "+j.config.hygiene.disabled.join(","));for(const c of j.checklists)console.log(c.file+" "+c.source+" "+c.overrides.rows.map(r=>r.id+":"+r.action).join(" "))})'
```

Step 4, from the repository root:

```bash
node .skilled/skills/sk-code/sk-code-review/scripts/check-review-final-line.js <saved review output>
node .skilled/skills/sk-code/sk-code-review/scripts/check-review-findings.js <saved review output>
```

### Expected

Step 2 prints exactly these four lines (the resolver exits 2, which is its advisory exit):

```text
surfaces UNKNOWN
hygiene.disabled hygiene.issue
hub:sk-code/shared/references/universal/code-quality-standards.md default 
docs/code-style.md repo-config floor.documentation:none hygiene.issue:none
```

Step 3 returns a report whose summary carries a line of this shape, with the checklist list first and both overrides in the `Overrides:` group:

```text
Rule sources: hub:sk-code/shared/references/universal/code-quality-standards.md, docs/code-style.md. Overrides: hygiene.issue none from .skilled/skills/sk-code/sk-code-quality/repository/quality.json; floor.documentation none from docs/code-style.md. Refused: none. Ignored: none. Conflicts: none
```

The order inside the `Overrides:` group may differ, because the contract does not fix it. The report then lists no finding, or only findings for rules the repository did not drop, and ends on `Review status: APPROVED`. Step 4 prints `OK: review output ends on the exact status line`, then `OK: no numbered findings to check` for a report with no findings, and each checker exits 0.

| Signal | Expected value |
| --- | --- |
| `hygiene.disabled` from the resolver | `hygiene.issue` |
| Repository checklist rows | `floor.documentation:none` and `hygiene.issue:none` |
| `Overrides:` group of the `Rule sources:` line | both rule ids, each `none` |
| Findings citing `floor.documentation`, `floor.ephemeral-pointers` or `hygiene.*` | none |
| Final-line and findings checkers | exit 0 |

### Evidence

Command transcript from steps 1 to 4, the resolver's four lines, the saved review output with its `Rule sources:` line quoted, both checker outputs with their exit status, and the executor, model, duration and token count. Save the transcript under the dated run label the playbook names.

### Optional Supplemental Checks

If the primary run passes, remove the `commentHygiene` block and the `hygiene.issue` row from the fixture, rerun the same prompt and confirm the review now flags the tracker reference in the comment. That shows the first run stayed quiet because of the overrides and not because the review overlooks comments. Keep supplemental evidence separate from the primary verdict.

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
| `../../references/review-core.md` | Section 8: the floor, the default lens, precedence, outcomes and the hygiene mapping |
| `../../../shared/references/universal/rule-overrides.md` | The shared override format and the precedence the review applies |
| `../../../sk-code-quality/references/quality-config.md` | The `commentHygiene.disableRules` key the review treats as a `none` row |
| `../../scripts/check-review-final-line.js` | Final-line check and the `Rule sources:` format check |
| `../../scripts/check-review-findings.js` | Finding numbering and severity comparison |

---

## 5. SOURCE METADATA

- Group: Foreign Repository Rules
- Playbook ID: CR-029
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `foreign-repository-rules/almost-no-inline-comments.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
