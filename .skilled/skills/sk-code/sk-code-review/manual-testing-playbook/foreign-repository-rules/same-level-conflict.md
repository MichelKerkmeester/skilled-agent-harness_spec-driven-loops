---
title: "CR-036 -- Two same-level checklists that disagree are a conflict"
description: "This scenario validates the Conflicts outcome of the rule-override contract for `CR-036`. It focuses on two repository checklists at the same precedence level that set different limits on one rule, and on the review applying the default lens while naming both files under Conflicts and in its Next Steps."
version: 1.0.0.0
---

# CR-036 -- Two same-level checklists that disagree are a conflict

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `CR-036`.

---

## 1. OVERVIEW

This scenario validates the `Conflicts` outcome of the rule-override contract for `CR-036`. It focuses on a scratch repository whose quality config declares two checklists at the same `repo-config` seat, one demanding a 20-line function limit and the other an 80-line limit, and on a reviewed file whose function sits between the two.

### Why This Matters

The precedence table resolves a rule by level, so it has nothing to say when two sources at the same level disagree. Silently taking the first, the last or the more permissive one would let file order decide a standard, and a review that picks the permissive row under a stricter repository would approve code the repository rejects. The contract's answer is to apply the default lens, record the rule and both files under `Conflicts`, and name the conflict in Next Steps so the repository settles it. The existing foreign-repository scenarios pin `Conflicts: none`, which reads correctly whether the outcome is implemented or not, so nothing else proves a populated entry, the default-lens fallback, or the Next Steps obligation.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CR-036` and confirm the expected signals without contradictory evidence.

- Objective: confirm two same-level checklists that disagree produce a resolver `rule_conflicts` entry, that the review applies the default lens rather than either row, and that it records both files under `Conflicts` and names the conflict in Next Steps.
- Real user request: `Two teams put different function-length limits in the same repo; which one does the review use?`
- Prompt: `Review this report helper before I commit it.`
- Expected execution process: build the fixture repository, run the resolver from the fixture root, run the exact prompt through the chosen review executor, run both report checkers over the saved output, and compare the finding, the `Conflicts:` group and the Next Steps entry with the contract.
- Expected signals: the resolver prints one `rule_conflicts` entry naming `review.function-length` and both files, and lists both checklists at the `repo-config` seat; the report records the function-length finding against the default 20-line limit rather than either row, reads `Overrides: none` and `Conflicts: review.function-length docs/style-a.md docs/style-b.md`, and names the conflict in Next Steps; both checkers exit 0.
- Desired user-visible outcome: a review that refuses to pick a winner between two equal-level rows, states which limit it used instead, and hands the decision back to the repository.
- Pass/fail: PASS if the resolver reports the conflict, the review applies the default lens, the `Conflicts:` group names the rule and both files with `Overrides: none`, Next Steps names the conflict, and both checkers exit 0; FAIL if either row is applied, `Conflicts:` reads `none`, the conflict is missing from Next Steps, or a checker fails.

**Exact prompt**:

```text
Review this report helper before I commit it.
```

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Review this report helper before I commit it.`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CR-036 | Two same-level checklists that disagree are a conflict | Confirm two same-level checklists that disagree produce a resolver `rule_conflicts` entry, that the review applies the default lens rather than either row, and that it records both files under `Conflicts` and names the conflict in Next Steps. | `Review this report helper before I commit it.` | bash: build the fixture and set `HUB` -> bash: run the resolver from the fixture root -> agent: @review the helper in the fixture as an explicit file list -> bash: run both report checkers over the saved output | The resolver prints one `rule_conflicts` entry naming `review.function-length` and both files, and lists both checklists at `repo-config`; the report records the finding against the default 20-line limit, reads `Overrides: none` and `Conflicts: review.function-length docs/style-a.md docs/style-b.md`, and names the conflict in Next Steps; both checkers exit 0 | Saved review output, resolver output, both checker outputs, executor, model, duration and token count | PASS iff the resolver reports the conflict, the review applies the default lens, the `Conflicts:` group names the rule and both files with `Overrides: none`, Next Steps names the conflict, and both checkers exit 0; FAIL if either row is applied, `Conflicts:` reads `none`, the conflict is missing from Next Steps, or a checker fails | 1. Confirm the fixture was written verbatim and the resolver printed the five lines; 2. Check which limit the finding cites before suspecting the contract; 3. Quote the `Conflicts:` group or the missing Next Steps entry |

### Exact Commands

Step 1 builds the fixture. Both checklists declare the same `paths` selector, so both reach the reviewed file and both land on the `repo-config` seat, which is what makes them equal-level.

```bash
HUB="<checkout root>/.skilled/skills/sk-code"
SCRATCH="<scratch folder outside the repository>"
mkdir -p "$SCRATCH/src" "$SCRATCH/docs" "$SCRATCH/.skilled/skills/sk-code/sk-code-quality/repository"
cat > "$SCRATCH/src/report.js" <<'JS'
'use strict';

function describeOrder(order) {
  const lines = [];
  lines.push(`order ${order.id}`);
  lines.push(`customer ${order.customer}`);
  lines.push(`status ${order.status}`);
  lines.push(`created ${order.created}`);
  lines.push(`updated ${order.updated}`);
  lines.push(`currency ${order.currency}`);
  lines.push(`subtotal ${order.subtotal}`);
  lines.push(`tax ${order.tax}`);
  lines.push(`shipping ${order.shipping}`);
  lines.push(`total ${order.total}`);
  lines.push(`items ${order.items.length}`);
  for (const item of order.items) {
    lines.push(`item ${item.sku} ${item.quantity} ${item.price}`);
  }
  lines.push(`notes ${order.notes}`);
  lines.push(`channel ${order.channel}`);
  lines.push(`warehouse ${order.warehouse}`);
  lines.push(`carrier ${order.carrier}`);
  lines.push(`tracking ${order.tracking}`);
  return lines.join('\n');
}

module.exports = { describeOrder };
JS
cat > "$SCRATCH/docs/style-a.md" <<'MD'
# Team A

## Rule overrides

| Rule | Action | Reason |
| --- | --- | --- |
| `review.function-length` | replace: A function stays under 20 lines | Team A keeps functions tiny |
MD
cat > "$SCRATCH/docs/style-b.md" <<'MD'
# Team B

## Rule overrides

| Rule | Action | Reason |
| --- | --- | --- |
| `review.function-length` | replace: A function stays under 80 lines | Team B allows longer functions |
MD
cat > "$SCRATCH/.skilled/skills/sk-code/sk-code-quality/repository/quality.json" <<'JSON'
{
  "schemaVersion": 1,
  "checklists": [
    { "file": "docs/style-a.md", "paths": ["src/**"] },
    { "file": "docs/style-b.md", "paths": ["src/**"] }
  ]
}
JSON
mkdir -p "$SCRATCH/.devin/skills" && cp -R "$HUB" "$SCRATCH/.devin/skills/sk-code"
echo "$SCRATCH"
```

Step 2, from the fixture root and with `HUB` set to the installed sk-code folder:

```bash
cd "$SCRATCH"
git init -q . && git config user.email operator@example.com && git config user.name Operator && git add -A && git commit -qm 'baseline'
node "$HUB/sk-code-quality/scripts/quality-gate.cjs" --explain src/report.js | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{const j=JSON.parse(s);console.log("surfaces "+j.surfaces.join(","));console.log("rule_conflicts "+JSON.stringify(j.rule_conflicts));for(const c of j.checklists)console.log(c.file+" "+c.source+" "+c.overrides.rows.map(r=>r.id+":"+r.action).join(" "))})'
```

Step 3 runs the exact prompt through the review executor with the fixture as its working repository, and saves the full output as `<saved review output>`.

Step 4 runs both checkers over the saved output, from the checkout root.

```bash
node .skilled/skills/sk-code/sk-code-review/scripts/check-review-final-line.js <saved review output>
node .skilled/skills/sk-code/sk-code-review/scripts/check-review-findings.js <saved review output>
```

### Expected

Step 2 prints five lines. The `rule_conflicts` entry names the rule once and both files, in the order the checklists reached the resolver.

```text
surfaces UNKNOWN
rule_conflicts [{"id":"review.function-length","files":["docs/style-a.md","docs/style-b.md"]}]
hub:sk-code/shared/references/universal/code-quality-standards.md default
docs/style-a.md repo-config review.function-length:replace
docs/style-b.md repo-config review.function-length:replace
```

The resolver exits `2`, its advisory exit, because it runs nothing. When its output is piped, the shell reports the last command's status instead.

Step 3 returns a report whose summary carries this line. Neither row wins, so `Overrides:` reads `none` and the group that is populated is `Conflicts:`:

```text
Rule sources: hub:sk-code/shared/references/universal/code-quality-standards.md, docs/style-a.md, docs/style-b.md. Overrides: none. Refused: none. Ignored: none. Conflicts: review.function-length docs/style-a.md docs/style-b.md
```

The report carries one P2 finding against the default 20-line limit. src/report.js holds a function that spans 23 lines including its signature and closing brace, so it is over the default 20 and far under Team B's 80 whichever lines a reviewer counts. Team B's row would therefore have cleared it and the default does not, which is why the applied limit is the observable difference. P2 never blocks, so the report ends on `Review status: APPROVED`, and Next Steps names the conflict for the repository to settle.

| Signal | Expected value |
| --- | --- |
| Resolver `rule_conflicts` | one entry: `review.function-length` with docs/style-a.md and docs/style-b.md |
| Resolver seats | both checklists at `repo-config`, which is what makes them equal-level |
| `Overrides:` group | `none`, because no row won |
| `Conflicts:` group | `review.function-length docs/style-a.md docs/style-b.md` |
| Applied limit | the default lens, not 20 from docs/style-a.md and not 80 from docs/style-b.md |
| Findings | one P2 for the function length, with a `Case:` line |
| Next Steps | one entry naming the conflict and both files |
| Final status | a status the findings checker accepts over a P2-only report |
| Final-line and findings checkers | exit 0 |

### Evidence

The fixture files as written, the five resolver lines, the saved review output, both checker outputs with their exit status, and the executor, model, duration and token count.

### Pass / Fail

- **Pass**: the resolver reports the conflict with both files, the `Rule sources:` line reads `Overrides: none` and `Conflicts: review.function-length docs/style-a.md docs/style-b.md`, the finding is recorded against the default limit, Next Steps names the conflict, and both checkers exit 0.
- **Fail**: either row is applied as an override, `Conflicts:` reads `none`, the conflict is missing from Next Steps, the finding is raised against one team's limit instead of the default, or a checker fails.

### Failure Triage

1. Confirm the fixture was written verbatim and the resolver printed the five lines. If `rule_conflicts` is empty, the two checklists did not both reach src/report.js, so the `paths` selectors differ or one checklist failed to parse.
2. Check which limit the finding cites. A 20-line limit means Team A's row was applied and an 80-line limit means Team B's, and either is the defect this scenario exists to catch.
3. If `Conflicts:` reads `none` while the resolver reports a conflict, the review resolved the conflict itself instead of applying the default and escalating.
4. Confirm Next Steps names the conflict. Applying the default without handing the decision back leaves the repository with two contradictory checklists and no instruction to fix them.
5. If a checker fails, quote its message. A `Rule sources:` group out of order, an entry with the wrong number of fields or a second `Rule sources:` line all fail the final-line checker, and a P2-only report that requests changes fails the findings checker.

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
| `../../references/review-core.md` | Section 8 precedence table, the same-level conflict rule and the `Rule sources:` format |
| `../../SKILL.md` | Section 3 Phase 2 escalation rule and the output contract |
| `../../../shared/references/universal/rule-overrides.md` | The row grammar and the shared conflict rule both modes read |
| `../../../sk-code-quality/references/runner-contract.md` | Section 3 `rule_conflicts` field the resolver reports |

---

## 5. SOURCE METADATA

- Group: Foreign Repository Rules
- Playbook ID: CR-036
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `foreign-repository-rules/same-level-conflict.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
- Feature catalog: none for this skill; anchors are `SKILL.md` and `references/` per the root coverage note.
