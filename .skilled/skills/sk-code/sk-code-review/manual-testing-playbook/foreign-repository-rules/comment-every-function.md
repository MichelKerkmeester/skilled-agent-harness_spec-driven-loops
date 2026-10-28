---
title: "CR-030 -- Repository with the opposite rule: comment every function"
description: "This scenario validates a repository that replaces the documentation rule with its opposite for `CR-030`. It focuses on the review applying a `replace:` row on `floor.documentation` and raising the missing doc comments at the severity of the rule it replaces."
version: 1.0.2.0
---

# CR-030 -- Repository with the opposite rule: comment every function

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `CR-030`.

---

## 1. OVERVIEW

This scenario validates a repository that replaces the documentation rule with its opposite for `CR-030`. It focuses on a live review of the same helper CR-029 reviews, in a repository whose style document says every function carries a doc comment, and on whether the review raises that rule even though the default rules ask for far fewer comments.

### Why This Matters

An override is only portable if it works in both directions. CR-029 shows a repository silencing a rule. This scenario shows a repository asking for more than the default, which the review must enforce just as faithfully. The default documentation rule asks for a comment only where a contract is not obvious, so a review that ignored the repository's `replace:` row would approve the file. The scenario passes only when the review reads the row through the resolver, records it as an override on the `Rule sources:` line and raises the missing comments as findings of the replaced rule's severity.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CR-030` and confirm the expected signals without contradictory evidence.

- Objective: Confirm a live review of the helper applies the repository's `replace:` row for `floor.documentation`, lists it on the `Rule sources:` line and raises a finding for the two undocumented functions at P2, the severity of the rule it replaces, without blocking the commit.
- Real user request: `Review this helper before I commit it. Our repository wants a doc comment on every function.`
- Prompt: `Review this helper before I commit it.`
- Expected execution process: Run the deterministic command sequence, save the review output, check its final line and findings, and record a PASS, FAIL, or SKIP verdict with rationale; SKIP only when no review executor can run in the session, and name the missing executor as the blocker.
- Expected signals: Step 1: the fixture is written to a scratch folder outside the repository; Step 2: the resolver prints an empty `hygiene.disabled` and one repository checklist row with `floor.documentation:replace`; Step 3: the `Rule sources:` line lists the style document and the `floor.documentation` replace override, and one numbered finding cites the missing doc comments on `total` and `average` at P2; Step 4: both report checkers exit 0.
- Desired user-visible outcome: the review holds the file to the repository's stricter documentation rule and says exactly which functions lack a comment, so the operator can add them before the commit.
- Pass/fail: PASS iff the override is recorded, a finding names the undocumented functions at P2 with the replacement text as its rule, the status is not `REQUESTED_CHANGES` for that finding alone, and both checkers exit 0; FAIL when the review approves with no documentation finding, raises the finding at P1 or P0, or drops the `Rule sources:` line.

Fixture build (the builder prints the scratch folder it created):

```bash
SCRATCH="$(mktemp -d)"
mkdir -p "$SCRATCH/.skilled/skills/sk-code/sk-code-quality/repository" "$SCRATCH/docs" "$SCRATCH/src" "$SCRATCH/test"
cat > "$SCRATCH/src/total.js" <<'JS'
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
  "checklists": [{ "file": "docs/code-style.md", "extensions": [".js"] }]
}
JSON
cat > "$SCRATCH/docs/code-style.md" <<'MD'
# Code style

Every function in this repository carries a doc comment that says what it returns.

## Rule overrides

| Rule | Action | Reason |
| --- | --- | --- |
| `floor.documentation` | replace: Every function carries a doc comment that states what it returns | The team documents every function |
MD
mkdir -p "$SCRATCH/.devin/skills" && cp -R "$HUB" "$SCRATCH/.devin/skills/sk-code"
echo "$SCRATCH"
```

The copy installs the hub in the skills folder of the runtime doing the review, `.devin/skills` for the devin executor used here, and a copy rather than a link keeps a reviewer with write permission from touching the tracked hub.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Run the fixture build from the repository root and keep the folder it prints as `SCRATCH`. Keep `HUB` set to the absolute path of `.skilled/skills/sk-code`.
2. Run the resolver from the fixture root and read the lines it prints.
3. Run the exact prompt through the chosen review executor with the fixture as its working repository and `HUB` as the installed sk-code folder, and save the full output.
4. Run both report checkers over the saved output and read their exit status.
5. Compare the finding's rule, severity and lines against this contract. Record executor, model, wall-clock duration, and total tokens with the verdict.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CR-030 | Repository with the opposite rule: comment every function | Confirm a live review applies the repository's `replace:` row for documentation and raises the undocumented functions as a P2 finding. | `Review this helper before I commit it.` | bash: build the fixture and set HUB -> bash: run the resolver from the fixture root -> agent: @review src/total.js in the fixture as an explicit file list -> bash: node `<sk-code-review>`/scripts/check-review-final-line.js and check-review-findings.js over the saved output -> record executor, model, duration and tokens | Step 1: the fixture is written verbatim; Step 2: an empty `hygiene.disabled` and `docs/code-style.md repo-config floor.documentation:replace`; Step 3: the `Rule sources:` line lists the override and one P2 finding names `total` and `average`; Step 4: both checkers exit 0 | Saved review output, resolver output, both checker outputs, executor, model, duration and token count | PASS iff the override is recorded, the P2 finding names both functions and both checkers exit 0; FAIL on an approval with no documentation finding, a finding above P2, or a missing `Rule sources:` line | 1. Confirm the fixture was written verbatim and the resolver printed the row as `replace`; 2. Re-run with the same executor and model before changing the verdict; 3. Quote what the review said about documentation, and check whether the executor ran the resolver from the fixture root |

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

Step 2 prints exactly these lines (the resolver exits 2, which is its advisory exit):

```text
surfaces UNKNOWN
hygiene.disabled 
hub:sk-code/shared/references/universal/code-quality-standards.md default 
docs/code-style.md repo-config floor.documentation:replace
```

Step 3 returns a report whose summary carries a line of this shape:

```text
Rule sources: hub:sk-code/shared/references/universal/code-quality-standards.md, docs/code-style.md. Overrides: floor.documentation replace from docs/code-style.md. Refused: none. Ignored: none. Conflicts: none
```

The report then lists one numbered P2 finding for the helper's lines 1 and 5, whose `Case:` line quotes the replacement text, and no P0 or P1 finding. The status is `APPROVED` or `COMMENTED`, because a P2 never blocks. Step 4 prints `OK: review output ends on the exact status line` and `OK: findings are numbered once and each carries a Case line`, and each checker exits 0.

| Signal | Expected value |
| --- | --- |
| `hygiene.disabled` from the resolver | empty |
| Repository checklist rows | `floor.documentation:replace` |
| `Overrides:` group of the `Rule sources:` line | `floor.documentation replace from docs/code-style.md` |
| Documentation finding | one, P2, naming `total` and `average` |
| Final-line and findings checkers | exit 0 |

### Evidence

Command transcript from steps 1 to 4, the resolver's lines, the saved review output with its `Rule sources:` line and the documentation finding quoted, both checker outputs with their exit status, and the executor, model, duration and token count. Save the transcript under the dated run label the playbook names.

### Optional Supplemental Checks

If the primary run passes, add a doc comment above each function in the fixture, rerun the same prompt and confirm the documentation finding disappears while the `Rule sources:` line stays. That shows the finding came from the repository's row and not from a general taste for comments. Keep supplemental evidence separate from the primary verdict.

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
| `../../references/review-core.md` | Section 8: precedence, outcomes and the rule that a `replace:` row keeps the replaced rule's severity |
| `../../../shared/references/universal/rule-overrides.md` | The shared override format, the `replace:` action and the precedence the review applies |
| `../../../shared/references/universal/code-quality-standards.md` | The overridable `floor.documentation` rule the row replaces |
| `../../scripts/check-review-final-line.js` | Final-line check and the `Rule sources:` format check |
| `../../scripts/check-review-findings.js` | Finding numbering and severity comparison |

---

## 5. SOURCE METADATA

- Group: Foreign Repository Rules
- Playbook ID: CR-030
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `foreign-repository-rules/comment-every-function.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
