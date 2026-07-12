---
title: "119-A -- Comment Hygiene — Checker Script Baseline"
description: "This scenario validates the shared comment hygiene checker script for `119-A`. It focuses on verifying violation detection, allowed-class pass-through, escape-hatch suppression, and zero false-positives on production source — the foundation all runtime enforcement tiers depend on."
version: 3.6.0.4
---

# 119-A -- Comment Hygiene — Checker Script Baseline

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `119-A`.

---

## 1. OVERVIEW

This scenario validates the shared comment hygiene checker script for `119-A`. It focuses on verifying violation detection, allowed-class pass-through, escape-hatch suppression, and zero false-positives on production source files.

### Why This Matters

The checker script (`check-comment-hygiene.sh`) is the single shared component used by every enforcement tier: the Claude Code PostToolUse hook, the git pre-commit gate, and any future runtime hook. If this baseline is broken, all downstream tiers are unreliable. Run this scenario first before testing any runtime-specific scenario (119-B through 119-F).

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `119-A` and confirm the expected signals without contradictory evidence.

- Objective: Confirm the checker correctly detects forbidden ephemeral-artifact patterns, passes all allowed-class patterns, honours the `hygiene-ok` escape, and produces zero false positives on clean production source.
- Real user request: `Run the comment hygiene checker baseline: violation file exits 1, allowed file exits 0, mixed file with hygiene-ok escape exits 0, and context-server.ts exits 0.`
- Prompt: `Run the comment hygiene checker baseline validation against all four fixtures and report the pass/fail verdict with evidence.`
- Expected execution process: Create three fixture files, then run the checker on each one and on a known-clean production file. Compare exit codes against expected values.
- Expected signals: violation.ts → exit 1 with violation line reported; allowed.ts → exit 0 with no output; mixed.ts → exit 0 (escape suppresses the ADR line); context-server.ts → exit 0
- Desired user-visible outcome: All four assertions match expected exit codes; any deviation is reported as a failure with exact checker output.
- Pass/fail: PASS if all four exit codes match; FAIL if any exit code or output deviates.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request in plain user language.
2. Create the shared fixture files in `/tmp/hygiene-sandbox/`.
3. Execute the four checker invocations exactly as written.
4. Compare each exit code against the expected value.
5. Return a concise verdict citing the exit codes as evidence.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 119-A | Checker baseline | Verify violation detection, allowed-class pass-through, escape, and production-file clean | `Run check-comment-hygiene.sh on violation.ts, allowed.ts, mixed.ts, and context-server.ts. Report each exit code.` | 1. `mkdir -p /tmp/hygiene-sandbox && printf '// REQ-011: lease cleanup runs unconditionally\nconst x = 1;\n' > /tmp/hygiene-sandbox/violation.ts && printf '// SEC: sanitize input (CWE-79)\nconst y = 2;\n' > /tmp/hygiene-sandbox/allowed.ts && printf '// ADR-004: FSRS decay // hygiene-ok\nconst z = 3;\n' > /tmp/hygiene-sandbox/mixed.ts` -> 2. `python3 .opencode/skills/sk-code/code-quality/scripts/check-comment-hygiene.sh /tmp/hygiene-sandbox/violation.ts; echo "EXIT:$?"` -> 3. `python3 .opencode/skills/sk-code/code-quality/scripts/check-comment-hygiene.sh /tmp/hygiene-sandbox/allowed.ts; echo "EXIT:$?"` -> 4. `python3 .opencode/skills/sk-code/code-quality/scripts/check-comment-hygiene.sh /tmp/hygiene-sandbox/mixed.ts; echo "EXIT:$?"` -> 5. `python3 .opencode/skills/sk-code/code-quality/scripts/check-comment-hygiene.sh .opencode/skills/system-spec-kit/mcp_server/context-server.ts; echo "EXIT:$?"` | Step 2: violation line printed + EXIT:1; Step 3: no output + EXIT:0; Step 4: no output + EXIT:0; Step 5: no output + EXIT:0 | Step 1: `(no output)`<br>Step 2:<br>`/tmp/hygiene-sandbox/violation.ts:1: // REQ-011: lease cleanup runs unconditionally`<br>`EXIT:1`<br>Step 3:<br>`EXIT:0`<br>Step 4:<br>`EXIT:0`<br>Step 5:<br>`EXIT:0` | PASS — steps 2–5 matched expected exit codes and output. | Check that the fixture extension is `.ts`; inspect `VIOLATION_PATTERNS` in `check-comment-hygiene.sh` for the `REQ-\d+[-:]` entry; inspect `ALLOWED_PATTERNS` for `CWE-\d+`; for a step-5 failure run `rg "REQ-\|ADR-\|CHK-" .opencode/skills/system-spec-kit/mcp_server/context-server.ts` to locate any re-contaminated line |

### Optional Supplemental Checks

**Escape hatch negative control**: Add a violation without the escape and confirm exit 1, then add `// hygiene-ok` and confirm exit 0 again. Confirms the escape is line-scoped.

**Production regression sweep** (run when a new cleanup commit lands): run the checker against all four skills' source trees and confirm zero exit-1 results.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../../../specs/skilled-agent-orchestration/z_archive/119-comment-ref-hygiene/002-active-enforcement-layer/spec.md` | Enforcement layer spec — REQ-001/002 define checker acceptance criteria |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/skills/sk-code/code-quality/scripts/check-comment-hygiene.sh` | Primary implementation anchor — the checker script under test |
| `.opencode/specs/skilled-agent-orchestration/z_archive/119-comment-ref-hygiene/002-active-enforcement-layer/checklist.md` | CHK-020/021/025/026 — regression checklist for this scenario |

---

## 5. SOURCE METADATA

- Group: UX Hooks
- Playbook ID: 119-A
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `ux_hooks/A__comment_hygiene_checker_baseline.md`
- audited_post_018: true
