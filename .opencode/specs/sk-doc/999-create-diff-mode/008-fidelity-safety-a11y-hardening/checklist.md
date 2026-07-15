---
title: "Verification Checklist: create-diff fidelity, safety, and accessibility hardening"
description: "P0/P1 verification gates for the reconciled GPT-review fixes: strict decode, line model, HTMLParser safety gate, legend contrast, keyboard-operable scoped scroll, and the regression suite."
trigger_phrases:
  - "create-diff hardening checklist"
  - "diff safety gate verification"
  - "diff contrast checklist"
importance_tier: "important"
contextType: "verification"
_memory:
  continuity:
    packet_pointer: "sk-doc/999-create-diff-mode/008-fidelity-safety-a11y-hardening"
    last_updated_at: "2026-07-15T16:33:01Z"
    last_updated_by: "claude"
    recent_action: "Aligned scripts to code-opencode; closed T010/T012; reconciled evidence and status"
    next_safe_action: "Dispatch the GPT-5.6 SOL ULTRA (fast) review, then make the scoped commit"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "create-diff-hardening-008"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

# Verification Checklist: create-diff fidelity, safety, and accessibility hardening

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Readiness Impact |
|----------|----------|------------------|
| **P0** | Hard blocker | Must pass before the packet is called complete |
| **P1** | Required | Must pass or carry an explicit user-approved deferral |
| **P2** | Optional | May remain for a later follow-up |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Every review finding was independently re-verified against the source before acting (finding = hypothesis). [EVIDENCE: contrast pairs re-measured with `contrast_check.py`; hostile payload, invalid-byte pair, and empty-file cases reproduced in-repo.]
- [x] CHK-002 [P0] Scope frozen in `spec.md`; operator selected "redesign + engine hardening". [EVIDENCE: `spec.md` §3, AskUserQuestion answer.]
- [x] CHK-003 [P1] The one spec deviation (EOF-newline treated as insignificant, not a git-style marker) is recorded, not silent. [EVIDENCE: REQ-004 amended in `spec.md`; rationale in `implementation-summary.md`.]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## CODE QUALITY

- [x] CHK-010 [P0] `create_diff.py` and `validate_report.py` compile clean. [EVIDENCE: `py_compile` OK on both.]
- [x] CHK-011 [P0] No ephemeral artifact labels (spec paths, packet/REQ/CHK ids) in code comments. [EVIDENCE: comment-hygiene grep for spec-path/REQ/CHK/ADR ids across `create_diff.py`, `validate_report.py`, and `test_create_diff.py` — 0 hits.]
- [x] CHK-012 [P1] Fixes stay inside existing functions; no new module, network, or shell surface. [EVIDENCE: edits confined to `_read_text_file`, `extract`, `_logical_lines`/`diff_lines`, `_CSS`, `_render_side_by_side`; validator uses stdlib `html.parser` only.]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## TESTING

- [x] CHK-020 [P0] REQ-001 strict decode: invalid-byte pair is refused, not reported identical. [EVIDENCE: `test_invalid_bytes_are_refused_not_replaced`; CLI exit 3 on `\xff` vs `\xfe`.]
- [x] CHK-021 [P0] REQ-002 legend contrast passes WCAG AA both themes. [EVIDENCE: `test_legend_swatch_contrast_light/dark`; `--text` on `--add-inline`/`--del-inline` ≥ 4.5 in both.]
- [x] CHK-022 [P0] REQ-003 validator FAILS the hostile payload and PASSES the four real reports. [EVIDENCE: `test_hostile_payload_fails`, `test_real_report_passes`; live run caught handler + remote video + @import + javascript: + weakened CSP.]
- [x] CHK-023 [P1] REQ-004 line model: empty→content pure add; empty→empty no change; EOF-newline insignificant; interior blank preserved. [EVIDENCE: four `LineModel` tests + CLI matrix.]
- [x] CHK-024 [P1] REQ-005 side-by-side scoped scroll actually scrolls (`min-width`) and is keyboard-operable (`role`/`aria-label`/`tabindex`/focus). [EVIDENCE: `test_side_by_side_scroll_is_scoped_and_keyboard_operable`; markup present in regenerated report.]
- [x] CHK-025 [P0] REQ-006 regression suite is checked in and green. [EVIDENCE: `test_create_diff.py` — Ran 18 tests, OK.]
- [x] CHK-026 [P0] Escaped hostile content stays inert AND the four demo reports stay byte-reproducible + zero-JS. [EVIDENCE: `test_escaped_hostile_text_is_inert`, `test_byte_reproducible`; regenerated reports scripts=0, identical across runs.]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-030 [P0] Producer surfaces updated: decode (`_read_text_file`), line model (`_logical_lines`/`diff_lines`), render CSS + SxS markup. [EVIDENCE: `plan.md` affected-surfaces table; edits verified.]
- [x] CHK-031 [P0] Policy/gate surface updated: `validate_report.py` rewritten so PASS implies no live handler, no non-`data:` external reference, and the exact CSP directive set. [EVIDENCE: adversarial payload rejected; four reports accepted.]
- [x] CHK-032 [P1] Consumer surfaces (docs) reconciled to true behavior. [EVIDENCE: `capabilities-and-fidelity.md`, `accessibility-contract.md`, and `006` summary updated.]
- [x] CHK-033 [P0] Algorithm invariants hold: a reported "identical" implies byte-equal-after-normalization (no `�` collapse); a validator PASS implies no live hazard. [EVIDENCE: `test_create_diff.py` StrictDecode + SafetyValidator classes — 18/18 pass.]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-040 [P0] The validator is now a real gate: HTMLParser-based, robust to malformed attributes that defeated the old regex. [EVIDENCE: `<img alt=">" onerror=…>` handler caught; previously PASSed.]
- [x] CHK-041 [P0] Report contract preserved: zero-JS, exact CSP, no remote refs, escaped content inert. [EVIDENCE: ReportInvariants tests; `validate_report.py` passes 4/4 demo reports.]
- [x] CHK-042 [P1] No new attack surface: no network, no filesystem writes beyond the existing report path, no shell. [EVIDENCE: diff uses stdlib `difflib`/`html.parser` only; `validate_report.py` opens reports read-only and writes nothing.]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-050 [P1] `spec.md`/`plan.md`/`tasks.md` are consistent and the deviation is recorded. [EVIDENCE: REQ-004 amendment cross-referenced.]
- [x] CHK-051 [P1] `capabilities-and-fidelity.md` states strict-decode + unknown-extension-warning + line-model behavior. [EVIDENCE: edited sections.]
- [x] CHK-052 [P1] `accessibility-contract.md` describes the keyboard-operable scoped scroll and accurate relative-unit usage. [EVIDENCE: edited clause.]
- [x] CHK-053 [P1] `006` summary corrected (warnings count 8; WCAG/scroll remediation note; cross-link to 008). [EVIDENCE: `implementation-summary.md` verification table now reads 8 warnings plus a Post-review remediation note cross-linking 008.]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-060 [P1] New test file lives beside the scripts it covers. [EVIDENCE: `create-diff/scripts/test_create_diff.py`.]
- [x] CHK-061 [P1] Child holds the Level 2 document set; parent stays a lean phase parent. [EVIDENCE: `spec/plan/tasks/checklist/implementation-summary` here; parent trio only.]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Gate | State | Evidence |
|------|-------|----------|
| Regression suite | PASS | `test_create_diff.py` — 18 tests, OK |
| Strict decode (REQ-001) | PASS | invalid-byte pair refused, exit 3 |
| Legend contrast (REQ-002) | PASS | ≥4.5:1 both themes on both swatch pairs |
| Safety gate (REQ-003) | PASS | hostile payload FAILS; 4 reports PASS |
| Line model (REQ-004) | PASS | empty/EOF/interior-blank cases correct |
| Scoped scroll a11y (REQ-005) | PASS | min-width + role/aria/tabindex/focus present |
| Byte-reproducibility + zero-JS | PASS | reports identical across runs; scripts=0 |
| code-opencode alignment | PASS | COMPONENT header + section dividers on all 3 scripts; `py_compile` + 18 tests still green |
| Canon gates | PASS | `package_skill --check` + `parent-skill-check` (0 warn) + frontmatter-versions clean |
| Strict recursive validation | PASS | 008 + parent + phases 002–007 all 0/0; lone pre-existing 001 continuity-lag warning is out of scope |

**Verification Date**: 2026-07-15
<!-- /ANCHOR:summary -->
