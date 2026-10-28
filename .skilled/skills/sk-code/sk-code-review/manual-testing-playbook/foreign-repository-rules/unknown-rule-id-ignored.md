---
title: "CR-035 -- Repository rule naming no review rule is ignored"
description: "This scenario validates the Ignored outcome of the rule-override contract for `CR-035`. It focuses on a repository checklist whose override row names a rule id that parses but matches no review lens, floor or hygiene rule, and on the review recording it under Ignored rather than applying or refusing it."
version: 1.0.0.0
---

# CR-035 -- Repository rule naming no review rule is ignored

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `CR-035`.

---

## 1. OVERVIEW

This scenario validates the `Ignored` outcome of the rule-override contract for `CR-035`. It focuses on a scratch repository whose own checklist carries an override row for `review.no-such-rule`, an id the linter accepts because it follows the grammar, and on the review recording it under `Ignored:` instead of applying it or refusing the whole checklist.

### Why This Matters

The linter checks the grammar, the action and the hard floor, and deliberately does not check whether an id names a rule that exists. That choice puts one decision in the review's hands: a row it cannot match to a lens, floor or hygiene rule changes nothing, and saying so is the difference between a repository whose override was silently dropped and one whose author can see why it had no effect. Refusing the whole checklist would be worse, because one stale id would then discard every other row in the file. The other foreign-repository scenarios pin the `none` form of the group, which is the shape that reads correctly whether or not the behaviour behind it is right, so nothing else exercises a populated `Ignored:` entry or proves the checker accepts one.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CR-035` and confirm the expected signals without contradictory evidence.

- Objective: confirm a row naming an unknown rule id is recorded under `Ignored:` with its checklist file, applies no override, and does not stop the review or the rest of the checklist.
- Real user request: `Our style guide drops a review rule that our tooling may not know; tell me what the review did with it.`
- Prompt: `Review this helper before I commit it.`
- Expected execution process: build the fixture repository, run the resolver from the fixture root, run the exact prompt through the chosen review executor, run both report checkers over the saved output, and compare the `Rule sources:` line with the contract.
- Expected signals: the resolver lists docs/code-style.md at the `repo-config` seat with row `review.no-such-rule:none` and no override error; the report's `Rule sources:` line reads `Ignored: review.no-such-rule from docs/code-style.md` with the other four groups `none`; the report carries no finding for that rule; both checkers exit 0.
- Desired user-visible outcome: a review that tells the repository its row had no matching rule, without failing the review or discarding the rest of the checklist.
- Pass/fail: PASS if the resolver returns the row without an error, the `Ignored:` group names the id and the checklist file, no finding cites the ignored rule, and both checkers exit 0; FAIL if the row is applied, the checklist is refused, the `Ignored:` group reads `none`, or a checker fails.

**Exact prompt**:

```text
Review this helper before I commit it.
```

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Review this helper before I commit it.`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CR-035 | Repository rule naming no review rule is ignored | Confirm a row naming an unknown rule id is recorded under `Ignored:` with its checklist file, applies no override, and does not stop the review or the rest of the checklist. | `Review this helper before I commit it.` | bash: build the fixture and set `HUB` -> bash: run the resolver from the fixture root -> agent: @review the helper in the fixture as an explicit file list -> bash: run both report checkers over the saved output | The resolver lists docs/code-style.md at the `repo-config` seat with `review.no-such-rule:none` and no override error; the `Rule sources:` line reads `Ignored: review.no-such-rule from docs/code-style.md` with the other four groups `none`; no finding cites that rule; both checkers exit 0 | Saved review output, resolver output, both checker outputs, executor, model, duration and token count | PASS iff the resolver returns the row without an error, the `Ignored:` group names the id and the checklist file, no finding cites the ignored rule, and both checkers exit 0; FAIL if the row is applied, the checklist is refused, `Ignored:` reads `none`, or a checker fails | 1. Confirm the fixture was written verbatim and the resolver printed the four lines; 2. Re-run with the same executor and model before changing the verdict; 3. Quote the `Rule sources:` group that disagrees |

### Exact Commands

Step 1 builds the fixture. The hub is copied into the fixture's runtime skills folder so an executor that only sees the fixture can load the mode; the resolver in step 2 runs from the checkout copy named by `HUB`.

```bash
HUB="<checkout root>/.skilled/skills/sk-code"
SCRATCH="<scratch folder outside the repository>"
mkdir -p "$SCRATCH/src" "$SCRATCH/docs" "$SCRATCH/.skilled/skills/sk-code/sk-code-quality/repository"
cat > "$SCRATCH/src/total.js" <<'JS'
'use strict';

function total(items) {
  return items.reduce((sum, item) => sum + item, 0);
}

module.exports = { total };
JS
cat > "$SCRATCH/docs/code-style.md" <<'MD'
# House style

## Rule overrides

| Rule | Action | Reason |
| --- | --- | --- |
| `review.no-such-rule` | none | The team never wanted this rule |
MD
cat > "$SCRATCH/.skilled/skills/sk-code/sk-code-quality/repository/quality.json" <<'JSON'
{
  "schemaVersion": 1,
  "checklists": [
    { "file": "docs/code-style.md", "paths": ["src/**"] }
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
node "$HUB/sk-code-quality/scripts/quality-gate.cjs" --explain src/total.js | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{const j=JSON.parse(s);console.log("surfaces "+j.surfaces.join(","));console.log("rule_conflicts "+JSON.stringify(j.rule_conflicts));for(const c of j.checklists)console.log(c.file+" "+c.source+" "+c.overrides.rows.map(r=>r.id+":"+r.action).join(" "))})'
```

Step 3 runs the exact prompt through the review executor with the fixture as its working repository, and saves the full output as `<saved review output>`.

Step 4 runs both checkers over the saved output. The report is the one the executor returns, filled in from the step 2 output.

```bash
node .skilled/skills/sk-code/sk-code-review/scripts/check-review-final-line.js <saved review output>
node .skilled/skills/sk-code/sk-code-review/scripts/check-review-findings.js <saved review output>
```

### Expected

Step 2 prints four lines. The hub floor checklist carries no rows, so its line ends after the seat name. `rule_conflicts` is empty because one row speaks to the rule and no other checklist disagrees.

```text
surfaces UNKNOWN
rule_conflicts []
hub:sk-code/shared/references/universal/code-quality-standards.md default
docs/code-style.md repo-config review.no-such-rule:none
```

The resolver exits `2`, its advisory exit, because it runs nothing. When its output is piped, the shell reports the last command's status instead.

Step 3 returns a report whose summary carries this line. The checklist list comes first, then the five groups in order, and only `Ignored:` is populated:

```text
Rule sources: hub:sk-code/shared/references/universal/code-quality-standards.md, docs/code-style.md. Overrides: none. Refused: none. Ignored: review.no-such-rule from docs/code-style.md. Conflicts: none
```

The report lists no finding for `review.no-such-rule`, because the row matched no review rule and therefore changed nothing, and it ends on `Review status: APPROVED`. Step 4 prints `OK: review output ends on the exact status line`, then `OK: no numbered findings to check` for a report with no findings, and each checker exits 0.

| Signal | Expected value |
| --- | --- |
| Resolver `surfaces` | `UNKNOWN`, so no surface checklist applies to the fixture |
| Resolver `rule_conflicts` | `[]` |
| Repository checklist rows | `review.no-such-rule:none` |
| `Overrides:` group | `none`, because the row matched no rule |
| `Ignored:` group | `review.no-such-rule from docs/code-style.md` |
| `Refused:` group | `none`, because the row never named a floor id |
| Findings citing the ignored rule | none |
| Final-line and findings checkers | exit 0 |

### Evidence

The fixture files as written, the four resolver lines, the saved review output, both checker outputs with their exit status, and the executor, model, duration and token count.

### Pass / Fail

- **Pass**: the resolver returns the row with no override error, the `Rule sources:` line names the id and docs/code-style.md in the `Ignored:` group with the other four groups `none`, no finding cites the ignored rule, the report ends on a status line and both checkers exit 0.
- **Fail**: the row is applied as an override, the checklist or the row is refused, `Ignored:` reads `none`, the ignored id appears in `Overrides:`, or a checker fails.

### Failure Triage

1. Confirm the fixture was written verbatim. A report that cannot be produced at all is a fixture or executor problem, not a contract result.
2. Re-read the resolver output. If docs/code-style.md is missing from the checklist list, the `paths` selector did not reach src/total.js, and the review had no row to ignore.
3. If `Ignored:` is populated but the id differs, quote the row from docs/code-style.md. The id must follow the `<class>.<name>` grammar or the resolver refuses the row and the group moves to `Refused:`.
4. If the review refused the checklist, a row named a `floor.*` id, which is the one refusal case and is covered by the floor-override scenario rather than here.
5. If a checker fails, quote its message. A `Rule sources:` group out of order, an upper-case id or a second `Rule sources:` line all fail the final-line checker.

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
| `../../references/review-core.md` | Section 8 outcomes table, precedence and the `Rule sources:` line format |
| `../../SKILL.md` | Section 3 output contract and the `Rule sources:` requirement |
| `../../../shared/references/universal/rule-overrides.md` | The row grammar, the ids and the statement that the linter does not check whether an id names a rule |
| `../../../sk-code-quality/references/runner-contract.md` | Section 3 `explain` fields and section 5 rule ids the resolver answers with |

---

## 5. SOURCE METADATA

- Group: Foreign Repository Rules
- Playbook ID: CR-035
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `foreign-repository-rules/unknown-rule-id-ignored.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
- Feature catalog: none for this skill; anchors are `SKILL.md` and `references/` per the root coverage note.
