---
title: "272 -- Strict validation add-ons: continuity freshness and evidence markers"
description: "This scenario validates the Phase 017 strict-validation add-ons for `272`. It focuses on proving strict validation now enforces continuity freshness, evidence-marker lint, and the normalizer guardrail."
version: 3.6.0.8
id: tooling-and-scripts-strict-validation-addons-continuity-freshness-and-evidence-markers
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# 272 -- Strict validation add-ons: continuity freshness and evidence markers

## 1. OVERVIEW

This scenario validates the Phase 017 strict-validation add-ons for `272`. It focuses on proving strict validation now enforces continuity freshness, evidence-marker lint, and the normalizer guardrail.

---

## 2. SCENARIO CONTRACT


- Objective: Verify `validate.sh --strict` now runs continuity-freshness, evidence-marker lint, and the normalizer lint guardrail, while the audit script remains the repair sweep.
- Real user request: `Please validate Strict validation add-ons: continuity freshness and evidence markers against validate.sh --strict and tell me whether the expected signals are present: strict validation fails or warns for stale continuity and malformed evidence markers; duplicate normalizers are rejected; the audit script reports structural marker findings without pretending to be the strict gate.`
- Prompt: `Validate Strict validation add-ons: continuity freshness and evidence markers against validate.sh --strict and report cited pass/fail evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: strict validation fails or warns for stale continuity and malformed evidence markers; duplicate normalizers are rejected; the audit script reports structural marker findings without pretending to be the strict gate
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if the new strict add-ons enforce the documented failure surfaces and the audit script still behaves like the repair tool

---

## 3. TEST EXECUTION

### Prompt

```
Validate Strict validation add-ons: continuity freshness and evidence markers against validate.sh --strict and report cited pass/fail evidence.
```

### Commands

1. Run a fixture or packet case that triggers continuity-freshness
2. Run a malformed evidence-marker case through `validate.sh --strict`
3. Run a duplicate-normalizer fixture through the normalizer lint path
4. Run `scripts/validation/evidence-marker-audit.ts` on the same malformed evidence case and capture its report behavior

### Expected

Strict validation surfaces the continuity, evidence-marker, and duplicate-normalizer failures; the audit script reports marker issues for repair use

### Evidence

Capture, for every step in the Commands sequence above:

- The exact command or tool call issued, its full output, and its exit status.
- The output lines that carry each expected signal listed in section 3.
- Any deviation from the expected result, quoted verbatim from the output.
- The resolved path of every file or log the run reads or writes.

## Totals

- Folders scanned: 1
- Files scanned: 481
- Total markers: 78
- OK: 76
- Malformed (closed with `)`): 0
- Unclosed (no trailing `)` before newline): 2

## Per-folder

| Folder | Files | Total | OK | Malformed | Unclosed | Rewrapped |
|---|---|---|---|---|---|---|
| `.opencode/specs/system-speckit/z_archive/022-hybrid-rag-fusion/009-perfect-session-capturing` | 481 | 78 | 76 | 0 | 2 | 0 |

## Problem markers (detail)

- `.opencode/specs/system-speckit/z_archive/022-hybrid-rag-fusion/009-perfect-session-capturing/scratch/agent-06-hvr-compliance.md:1747` [unclosed] [EVIDENCE: `phase-classification.vitest.ts`, `content-filter-parity.vitest.ts`, and `runtime-memory-inputs.vitest.ts` now assert aliasing
- `.opencode/specs/system-speckit/z_archive/022-hybrid-rag-fusion/009-perfect-session-capturing/scratch/agent-06-hvr-compliance.md:1748` [unclosed] [EVIDENCE: `phase-classification.vitest.ts`, `content-filter-parity.vitest.ts`, and `runtime-memory-inputs.vitest.ts` now assert aliasing

EXIT_CODE=1
```

Result: continuity freshness and evidence-marker strict checks produced the expected strict failure surfaces, and the standalone audit script reported marker issues as a report/repair tool. The duplicate-normalizer fixture precondition is missing in the current repo state under this scenario's write restriction: the only duplicate-helper fixture is embedded in `scripts/tests/normalizer-lint.vitest.ts`, and that suite is currently skipped.

### Pass / Fail

- **Pass**: The new strict add-ons enforce the documented failure surfaces and the audit script still behaves like the repair tool.
- **Fail**: The Pass condition above is not met, or any command in the sequence errors unexpectedly.

### Failure Triage

Inspect `scripts/spec/validate.sh`, `scripts/validation/continuity-freshness.ts`, `scripts/validation/evidence-marker-audit.ts`, and `scripts/rules/check-normalizer-lint.sh`

---

## 4. SOURCE FILES
- Root playbook: [manual-testing-playbook.md](../../manual-testing-playbook/manual-testing-playbook.md)
- Feature catalog: [tooling-and-scripts/strict-validation-addons-continuity-freshness-and-evidence-markers.md](../../feature-catalog/tooling-and-scripts/strict-validation-addons-continuity-freshness-and-evidence-markers.md)

---

## 5. SOURCE METADATA

- Group: Tooling and Scripts
- Playbook ID: 272
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `tooling-and-scripts/strict-validation-addons-continuity-freshness-and-evidence-markers.md`
