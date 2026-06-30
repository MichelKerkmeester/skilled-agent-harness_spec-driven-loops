---
title: "Plan: harden the context-loading contract"
description: "Apply the 031 review's concrete fixes (F-005 safety, F-003 paths, F-006 inventory) and add a deterministic contrast checker wired into the foundations SKILL, contract, and worksheet. Surgical additive edits."
trigger_phrases:
  - "context contract hardening plan"
  - "contrast checker plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/036-design-context-hardening"
    last_updated_at: "2026-06-27T16:45:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Recorded the remediation + checker approach"
    next_safe_action: "Optional executable orchestrator gate; commit the arc"
    blockers: []
    key_files:
      - "spec.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "build-154-036-design-context-hardening"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Plan: harden the context-loading contract

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## SUMMARY

Apply the three concrete review fixes (F-005, F-003, F-006) as surgical edits, and add a deterministic WCAG contrast checker that the contrast-pair inventory calls instead of estimating ratios. Done directly (not via dispatched agents) because the changes are small and precise.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## QUALITY GATES

- CO-037 contains no `--dangerously-skip-permissions` / no MiniMax `--variant`.
- The contract's cited paths resolve; the checker is referenced from the SKILL, contract, and worksheet.
- `contrast_check.py` returns correct ratios and exits non-zero on a body-contrast fail.
- Template 16 is sequential; no "13 templates" claim remains.
- Every edited file passes `sk-doc validate_document.py`; smart-router blocks + anchors intact.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## ARCHITECTURE

- **Fixes** are in-place Edits to the live skill files identified by the 031 review (file:line).
- **Checker** is a stdlib-only Python CLI at `design-foundations/scripts/contrast_check.py`: parses hex pairs, computes WCAG relative luminance + ratio, reports body (4.5:1) and large/UI (3:1) verdicts, and exits non-zero when any pair fails body — so an inventory or build step can gate on it.
- **Wiring** points the foundations SKILL contrast row, the contract's CONTRAST PAIRS proof field, and the worksheet intro at the checker.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## IMPLEMENTATION PHASES

1. **Read** the review's cited files and the fix targets.
2. **Fix** F-005 (CO-037 command), F-003 (relative paths), F-006 (Template 16 reorder + count reconciliation).
3. **Add + wire** the deterministic contrast checker; smoke-test it on the benchmark's decisive values.
4. **Verify + finalize** — sk-doc on every edited file, confirm router/anchors intact, author the wrapper, strict-validate.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## TESTING STRATEGY

`sk-doc validate_document.py` on every edited markdown file; `contrast_check.py` smoke against `#787878`/white (must report 4.42 FAIL, exit 1) and `#043367`/white (12.54 PASS); grep confirms Template 16 sequential and zero "13 templates" refs; `validate.sh --strict` on the `032` packet.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## DEPENDENCIES

- 031 review report + benchmark matrix (the findings).
- Live `sk-design` / `cli-opencode` contract files.
- `sk-doc` validator; `python3` (stdlib only).
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## ROLLBACK PLAN

Additive + surgical: revert the edited skill files (`git checkout`) and delete `contrast_check.py` + the `032` folder. The fixes only remove unsafe content / add resolving paths / add a checker; no behavior of unrelated modes changes.
<!-- /ANCHOR:rollback -->

---

## Cross-References
- **Specification**: `spec.md`
- **Findings**: `../035-design-context-benchmark/review/review-report.md`
