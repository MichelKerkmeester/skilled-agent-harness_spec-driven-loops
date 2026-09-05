---
title: "M-013 -- AC_COVERAGE single-source ratio"
description: "Verify the acceptance-coverage advisory takes its total and its evidence from one document, so a packet that recorded its criteria is never scored as if it had not."
version: 4.0.0.0
id: tooling-and-scripts-ac-coverage-single-source-ratio
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# M-013 -- AC_COVERAGE single-source ratio

## 1. OVERVIEW

`AC_COVERAGE` reports a ratio: how many acceptance criteria carry evidence, out of how many exist. The two halves once came from different documents — the total from `acceptance-criteria.md`, the evidence from a separate traceability table that no template has produced since the tasks and checklist documents were merged. Every packet carrying a criteria document therefore reported `0/N`, and across the whole repository exactly one packet satisfied the rule. The advisory is `info` severity, so nothing failed and nobody looked.

The failure is silent by construction, which is why it needs a scenario rather than only a unit suite: the number looks like a real measurement whichever way it is wrong. This scenario pins both halves to one document and pins the two shapes that previously split them.

One contract detail matters when reading a result: a criterion whose Status is `Waived` or `Superseded` counts as covered without a citation. The decision record named in its Waiver cell is the evidence, and `AC_CLOSURE` verifies that record exists — so a run asserting "every row needs `file:line`" is asserting the wrong contract.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm the total and the evidence come from the same table, that a column inserted before `AC-ID` does not silence the rule, and that a packet marked `Incomplete` does not activate it.
- Real user request: `Check that the acceptance-coverage advisory is actually measuring the criteria document, not reporting zero because it is reading somewhere else.`
- Prompt: `Validate the AC_COVERAGE single-source ratio against .opencode/skills/system-spec-kit/runtime/cli/tests/check-ac-coverage.sh and a live packet, and report cited pass/fail evidence.`
- Expected execution process: Run the unit suite, then read the advisory line from a real packet whose criteria carry citations, then run the two shape controls below.
- Expected signals: the suite passes every case; a packet whose Verification cells carry `file:line` reports a full ratio rather than `0/N`; a table with a column before `AC-ID` still reports a ratio rather than the no-op message; a packet whose summary Status is `Incomplete` reports the gate as not active.
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: FAIL if any ratio is `0/N` on a packet whose criteria carry citations, if a shifted column produces `No acceptance criteria found`, or if an `Incomplete` packet activates the gate.

---

## 3. TEST EXECUTION

### Prompt

`Validate the AC_COVERAGE single-source ratio against .opencode/skills/system-spec-kit/runtime/cli/tests/check-ac-coverage.sh and a live packet, and report cited pass/fail evidence.`

### Commands

1. Run the rule's unit suite:
   ```bash
   bash .opencode/skills/system-spec-kit/runtime/cli/tests/check-ac-coverage.sh
   ```
2. Read the advisory from a live packet whose criteria carry citations:
   ```bash
   bash .opencode/skills/system-spec-kit/runtime/cli/spec/validate.sh \
     specs/system-speckit/042-nested-goal-template-addon/002-durable-slice-validator --strict \
     | grep AC_COVERAGE
   ```
3. Build the shifted-column control — a criteria table with a column BEFORE `AC-ID`, one cited row and one prose row — and read the ratio:
   ```bash
   T=$(mktemp -d); mkdir -p "$T/p"
   printf '# Spec\n| **Level** | 2 |\n' > "$T/p/spec.md"
   printf '# S\n\n| Field | Value |\n|-------|-------|\n| **Status** | Complete |\n' > "$T/p/implementation-summary.md"
   cat > "$T/p/acceptance-criteria.md" <<'TABLE'
   | Owner | AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
   |-------|-------|-----|---------------------|--------------|--------|--------|
   | me | AC-001 | REQ-001 | Given x, When y, Then z | `a.sh:1` | Met | - |
   | me | AC-002 | REQ-002 | Given x, When y, Then z | prose only | Met | - |
   TABLE
   bash -c 'source .opencode/skills/system-spec-kit/runtime/cli/rules/check-ac-coverage.sh
            run_check "'"$T"'/p" 2 >/dev/null 2>&1; echo "$RULE_MESSAGE"'
   rm -rf "$T"
   ```
4. Repeat step 3 with the summary Status set to `Incomplete` and confirm the gate reports itself inactive.

### Expected

The suite passes every case. The live packet reports a full ratio. The shifted-column control reports `1/2` — proving the count survived the shift and the prose row was still excluded — rather than the `No acceptance criteria found at the canonical location` no-op that a positional read produced. The `Incomplete` packet reports `Acceptance coverage gate not active`.

### Evidence

Command:
```bash
bash .opencode/skills/system-spec-kit/runtime/cli/tests/check-ac-coverage.sh
```

Output (tail):
```text
  ok    a column before AC-ID does not zero the count          2/2
  ok    an Incomplete packet does not activate the gate        inactive

  16 passed, 0 failed
```

Command:
```bash
bash .opencode/skills/system-spec-kit/runtime/cli/spec/validate.sh \
  specs/system-speckit/042-nested-goal-template-addon/002-durable-slice-validator --strict | grep AC_COVERAGE
```

Output:
```text
+ AC_COVERAGE: AC_COVERAGE advisory: 5/5 ACs have evidence; floor 5/5
```

Shifted-column control output:
```text
AC_COVERAGE advisory (under floor): 1/2 ACs have evidence; floor 2/2. Cite file:line in the Verification cell, or retire the criterion through a decision record.
```

### Pass / Fail

PASS when the total and the covered count come from the same table, a column before `AC-ID` still yields a ratio, and an `Incomplete` packet leaves the gate inactive. FAIL on a `0/N` reading for a packet whose Verification cells carry citations, on `No acceptance criteria found` for a shifted-column table, or on an `Incomplete` packet activating the gate.

### Failure Triage

- A live packet reports `0/N` while its criteria carry `file:line`: the count and the evidence read have separated again. Confirm `_ac_count_canonical_rows` still delegates to `_ac_analyze_canonical` rather than parsing the table a second time.
- The shifted-column control reports `No acceptance criteria found`: the count path is binding `AC-ID` positionally. A zero total short-circuits the whole rule, so this reads as "nothing to measure" rather than as a parse failure.
- An `Incomplete` packet activates the gate: the lifecycle check is substring-matching the rendered Status row instead of reading the Status cell. `complete` is a substring of `incomplete`.
- Every row reports as malformed: the table has no `AC-ID` header row, so no columns were bound. The header is what locates `Verification` and `Status`.

---

## 4. SOURCE FILES
- Root playbook: [manual-testing-playbook.md](../../manual-testing-playbook/manual-testing-playbook.md)
- Rule: `.opencode/skills/system-spec-kit/runtime/cli/rules/check-ac-coverage.sh`
- Automated gate: `.opencode/skills/system-spec-kit/runtime/cli/tests/check-ac-coverage.sh`
- Closure rule the citation exemption rests on: `.opencode/skills/system-spec-kit/runtime/cli/rules/check-ac-closure.sh`
- Validator: `.opencode/skills/system-spec-kit/runtime/cli/spec/validate.sh`

---

## 5. SOURCE METADATA

- Group: Tooling and Scripts
- Playbook ID: M-013
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `tooling-and-scripts/ac-coverage-single-source-ratio.md`
