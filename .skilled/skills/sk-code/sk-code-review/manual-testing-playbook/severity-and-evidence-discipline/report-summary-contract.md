---
title: "CR-034 -- Report summary contract"
description: "This scenario validates the required-summary-line contract for `CR-034`. It focuses on the six summary lines and the mandatory Not checked line of a full review, the Quality gate evidence value with and without a handed-in quality verdict, and the checker failure a missing Not checked line produces."
version: 1.0.0.0
---

# CR-034 -- Report summary contract

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `CR-034`.

---

## 1. OVERVIEW

This scenario validates the required-summary-line contract for `CR-034`. It focuses on a full review report that carries all six summary lines and the mandatory `Not checked:` line, two runs that differ only in the `Quality gate evidence` value, and a negative run whose report omits the `Not checked:` line.

### Why This Matters

The report's summary block is the part automation and maintainers read before the findings: how much was reviewed, what the verdict is, which baseline and surface evidence were used, whether a quality verdict was handed in, and which rule sources resolved. Two of those lines are also the reason a review can be refused downstream, because `Not checked:` names what the review could not read. Any of the six can be dropped without failing a findings review, and a report that omits `Surface evidence used` or `Quality gate evidence` looks complete while hiding the fact that nobody resolved the surfaces or handed in a gate verdict. This scenario asserts each line by name, splits the four lines no checker enforces from the four checks it does enforce, and proves the `Not checked:` failure is detected rather than assumed.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CR-034` and confirm the expected signals without contradictory evidence.

- Objective: confirm a full review report carries all six summary lines and the `Not checked:` line, that `Quality gate evidence` reads `present` only when a `sk-code-quality` verdict was handed in, and that omitting `Not checked:` fails the final-line checker.
- Real user request: `I want every review summary to tell me the same fields, so I can compare two reviews without guessing.`
- Prompt: `Review this helper and make sure the summary tells me how much you reviewed, what the verdict is, which baseline and surface evidence you used, whether a quality gate verdict was handed to you, and what you could not check.`
- Expected execution process: resolve the reviewed file's surfaces and rule sources with the quality runner, run the quality runner for a verdict, write the report with all six summary lines and the `Not checked:` line, run both report checkers, then repeat with `Quality gate evidence: absent` and with the `Not checked:` line removed.
- Expected signals: the resolver prints `surfaces UNKNOWN` and one `default` checklist; the verdict run prints `status: advisory` and `gate: NO_BLOCKER_FOUND`; the report carries `Files reviewed`, `Overall assessment`, `Baseline used`, `Surface evidence used`, `Quality gate evidence` and `Rule sources` before the findings, and `Not checked:` directly above the status line; both checkers exit 0; the report without `Not checked:` fails with both missing-line messages.
- Desired user-visible outcome: a review whose summary a maintainer or a script can compare field by field against the previous review, and a missing `Not checked:` line that is reported rather than tolerated.
- Pass/fail: PASS if all six summary lines and `Not checked:` are present with values that match the resolver and the quality verdict, `Quality gate evidence` reads `present` for the verdict run and `absent` for the run without one, both checkers exit 0 on both, and the report without `Not checked:` fails; FAIL if a summary line is missing or its value contradicts the resolver or verdict output, `Quality gate evidence` reads `present` with no verdict handed in, or the missing-line run passes.

**Exact prompt**:

```text
Review this helper and make sure the summary tells me how much you reviewed, what the verdict is, which baseline and surface evidence you used, whether a quality gate verdict was handed to you, and what you could not check.
```

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Review this helper and make sure the summary tells me how much you reviewed, what the verdict is, which baseline and surface evidence you used, whether a quality gate verdict was handed to you, and what you could not check.`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CR-034 | Report summary contract | Confirm a full review report carries all six summary lines and the `Not checked:` line, that `Quality gate evidence` reads `present` only when a `sk-code-quality` verdict was handed in, and that a report without `Not checked:` fails the final-line checker. | `Review this helper and make sure the summary tells me how much you reviewed, what the verdict is, which baseline and surface evidence you used, whether a quality gate verdict was handed to you, and what you could not check.` | bash: resolve the reviewed file's surfaces and rule sources with the quality runner -> bash: run the quality runner for a verdict -> agent: @review the helper and write the full report with all six summary lines and `Not checked:` -> bash: run both report checkers over the report -> bash: repeat with `Quality gate evidence: absent` and with `Not checked:` removed | The resolver prints `surfaces UNKNOWN` and one `default` checklist; the verdict run prints `status: advisory` and `gate: NO_BLOCKER_FOUND`; both checkers exit 0 on the present and absent reports; the report without `Not checked:` fails with the two missing-line messages | The resolver output, the quality verdict, both saved reports, both checker outputs with exit status, and the failing report's checker output | PASS iff all six summary lines and `Not checked:` are present with values that match the resolver and the verdict, `Quality gate evidence` reads `present` for the verdict run and `absent` otherwise, and the missing-line run fails; FAIL on a missing or contradictory summary line, a `present` value with no verdict handed in, or a missing-line run that passes | 1. Confirm the report carries the six lines in the section 3 order; 2. Diff `Surface evidence used` against the resolver's `surfaces`; 3. Confirm `Quality gate evidence` matches whether a verdict was actually handed in; 4. Quote the checker message for the missing-line case |

### Exact Commands

Step 1 and step 2 run from the scratch fixture root, where `HUB` is the installed sk-code folder. `--explain` resolves the surfaces and rule sources; `--files` runs the checks and prints a verdict.

```bash
CHECKOUT="<checkout root>"
SCRATCH="<scratch folder outside the repository>"
mkdir -p "$SCRATCH/repo/src"
cd "$SCRATCH/repo"
git init -q .
git config user.email operator@example.com
git config user.name Operator
printf 'function total(items) {\n  return items.reduce((sum, item) => sum + item, 0);\n}\nmodule.exports = { total };\n' > src/total.js
git add -A && git commit -qm 'baseline'
HUB="$CHECKOUT/.skilled/skills/sk-code"
node "$HUB/sk-code-quality/scripts/quality-gate.cjs" --explain src/total.js | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{const j=JSON.parse(s);console.log("surfaces "+j.surfaces.join(","));console.log("hygiene.disabled "+j.config.hygiene.disabled.join(","));for(const c of j.checklists)console.log(c.file+" "+c.source+" "+c.overrides.rows.map(r=>r.id+":"+r.action).join(" "))})'
node "$HUB/sk-code-quality/scripts/quality-gate.cjs" --files src/total.js > "$SCRATCH/quality-verdict.json"; echo "VERDICT_EXIT=$?"
node -e 'const j=require(process.argv[1]);console.log("status "+j.status);console.log("gate "+j.gate)' "$SCRATCH/quality-verdict.json"
```

Step 3 writes the report the review returns. It is the section 3 template filled in with the values step 1 and step 2 printed.

```bash
cat > "$SCRATCH/report-present.md" <<'MD'
## Code Review Summary

**Files reviewed**: 1 file, 5 lines changed
**Overall assessment**: APPROVED
**Baseline used**: sk-code (`sk-code-review`)
**Surface evidence used**: UNKNOWN
**Quality gate evidence**: present
Rule sources: hub:sk-code/shared/references/universal/code-quality-standards.md. Overrides: none. Refused: none. Ignored: none. Conflicts: none

## Findings

No findings.

## Removal/Iteration Plan

None.

## Next Steps

1. None.

Not checked: nothing material

Review status: APPROVED
MD
cat > "$SCRATCH/report-absent.md" <<'MD'
## Code Review Summary

**Files reviewed**: 1 file, 5 lines changed
**Overall assessment**: APPROVED
**Baseline used**: sk-code (`sk-code-review`)
**Surface evidence used**: UNKNOWN
**Quality gate evidence**: absent
Rule sources: hub:sk-code/shared/references/universal/code-quality-standards.md. Overrides: none. Refused: none. Ignored: none. Conflicts: none

## Findings

No findings.

## Removal/Iteration Plan

None.

## Next Steps

1. None.

Not checked: nothing material

Review status: APPROVED
MD
grep -v '^Not checked:' "$SCRATCH/report-present.md" > "$SCRATCH/report-no-not-checked.md"
```

Step 4 runs both checkers over all three reports from the checkout root.

```bash
cd "$CHECKOUT"
for report in report-present report-absent report-no-not-checked; do
  echo "--- $report"
  node .skilled/skills/sk-code/sk-code-review/scripts/check-review-final-line.js "$SCRATCH/$report.md"; echo "final-line exit=$?"
  node .skilled/skills/sk-code/sk-code-review/scripts/check-review-findings.js "$SCRATCH/$report.md"; echo "findings exit=$?"
done
```

### Expected

Step 1 prints the resolver's surfaces, the disabled hygiene rules, and one checklist at the `default` seat:

```text
surfaces UNKNOWN
hygiene.disabled
hub:sk-code/shared/references/universal/code-quality-standards.md default
```

The resolver exits `2`, which is its advisory exit, because it runs nothing. When its output is piped, the shell reports the last command's status instead.

Step 2 prints a real verdict, which is the input that makes `Quality gate evidence` read `present`:

```text
VERDICT_EXIT=0
status advisory
gate NO_BLOCKER_FOUND
```

Step 4 accepts the present and absent reports and rejects the one without `Not checked:`:

```text
--- report-present
OK: review output ends on the exact status line
final-line exit=0
OK: no numbered findings to check
findings exit=0
--- report-absent
OK: review output ends on the exact status line
final-line exit=0
OK: no numbered findings to check
findings exit=0
--- report-no-not-checked
FAIL: more than one blank line above the status line
FAIL: no "Not checked:" line above the status line
final-line exit=1
OK: no numbered findings to check
findings exit=0
```

The checkers enforce four of the contract's requirements: the exact final status line, the `Not checked:` line above it, an `Overall assessment` value that agrees with the status line, and the `Rule sources:` format. The four lines below have no checker, so the operator compares them by hand.

| Signal | Expected value |
| --- | --- |
| `Files reviewed` | present, and its counts match the reviewed scope |
| `Overall assessment` | a status token that agrees with the final status line, which the final-line checker also compares |
| `Baseline used` | `sk-code` with `sk-code-review`, named as the mode baseline |
| `Surface evidence used` | `UNKNOWN`, matching the resolver's `surfaces` list, and never a surface the resolver did not return |
| `Quality gate evidence` | `present` for the run where the step 2 verdict was handed in, `absent` for the run without it |
| `Rule sources` | the checklist the resolver returned, then the five groups in order |
| `Not checked` | one line directly above the blank line and the status line |
| Checkers on the two complete reports | both exit 0 |
| Checkers on the report without `Not checked:` | final-line checker exits 1 with both missing-line messages; findings checker is unaffected |

### Evidence

The resolver output, the quality verdict with its exit status, the three saved reports, and both checker outputs with their exit status for each report.

### Pass / Fail

- **Pass**: all six summary lines and the `Not checked:` line are present in the section 3 order; `Surface evidence used` matches the resolver; `Quality gate evidence` reads `present` only for the run that handed in the step 2 verdict; both checkers exit 0 on the two complete reports; the report without `Not checked:` fails with both missing-line messages.
- **Fail**: a summary line is missing, `Surface evidence used` names a surface the resolver did not return, `Quality gate evidence` reads `present` with no verdict handed in, or the report without `Not checked:` passes.

### Failure Triage

1. Confirm the report carries the six lines in the section 3 order, starting with `Files reviewed` and ending with the single `Rule sources:` line.
2. Diff `Surface evidence used` against the resolver's `surfaces` list from step 1. A surface the hub's router bundled from request words is only a candidate; naming one the resolver did not return is the mistake this line exists to expose.
3. Confirm `Quality gate evidence` against what was actually handed in. `present` means a `sk-code-quality` run verdict was an input to the review; either value leaves every baseline check in place, so a `present` value never explains a skipped check.
4. For the missing-line case, quote the checker's own message. Two messages appear because a removed `Not checked:` line leaves a second blank line above the status line as well.

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
| `../../SKILL.md` | Section 3 output contract, the six summary lines, `Quality gate evidence`, and the final-line and `Not checked:` rules |
| `../../references/review-core.md` | Section 8 `Rule sources:` format and the resolver it is built from |
| `../../scripts/check-review-final-line.js` | Enforces the final status line, the `Not checked:` line, `Overall assessment` agreement and the `Rule sources:` format |
| `../../scripts/check-review-findings.js` | Enforces finding numbering, `Case:` lines and status agreement with blocking findings |
| `../../scripts/tests/fixtures/review-output/pr-shape-valid.md` | A complete report in the review agent's PR shape that both checkers accept |

---

## 5. SOURCE METADATA

- Group: Severity And Evidence Discipline
- Playbook ID: CR-034
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `severity-and-evidence-discipline/report-summary-contract.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
- Feature catalog: none for this skill; anchors are `SKILL.md` and `references/` per the root coverage note.
