---
title: "Tasks: create-diff fidelity, safety, and accessibility hardening"
description: "Implementation queue for the reconciled GPT-review fixes: strict decode, empty/EOF-newline line model, HTMLParser safety gate, legend contrast, keyboard-operable scoped side-by-side scroll, and a checked-in regression suite."
trigger_phrases:
  - "create-diff hardening tasks"
  - "diff strict decode tasks"
  - "validate report safety tasks"
importance_tier: "important"
contextType: "implementation"
status: "draft"
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
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: create-diff fidelity, safety, and accessibility hardening

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable after dependencies are satisfied |
| `[B]` | Blocked by an explicit gate |

**Task Format**: T### [P?] Description (file path)
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Re-verify each review finding against source (finding = hypothesis); freeze scope in `spec.md` [EVIDENCE: contrast pairs re-measured; hostile payload, invalid-byte pair, and empty-file cases reproduced in-repo before any edit.]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 Strict-decode `_read_text_file`/`extract`: refuse undecodable full-tier input (exit 3), drop `errors="replace"` fabrication (REQ-001) (`scripts/create_diff.py`) [EVIDENCE: `\xff` vs `\xfe` → exit 3; `test_invalid_bytes_are_refused_not_replaced`.]
- [x] T003 Emit the fidelity warning on unknown-extension text fallback (REQ-001) (`scripts/create_diff.py`) [EVIDENCE: `.weirdext` diff prints a fidelity warning; `test_unknown_extension_warns`.]
- [x] T004 Logical-line model (`_logical_lines`): empty text → no lines; trailing newline insignificant; interior blanks preserved (REQ-004) (`scripts/create_diff.py`) [EVIDENCE: four `LineModel` tests + CLI matrix green.]
- [x] T005 Rewrite `validate_report.py` on `html.parser`: exact CSP directive set, URL-attribute inspection, reject `@import`/non-`data:` `url()`, catch handlers on malformed tags (REQ-003) (`scripts/validate_report.py`) [EVIDENCE: hostile payload FAILS with 5 hazards; 4 real reports PASS.]
- [x] T006 [P] Legend contrast: `.legend mark.wd{color:var(--text)}` (REQ-002) (`scripts/create_diff.py`) [EVIDENCE: `--text` on both inline tints ≥ 4.5:1 in both themes; `test_legend_swatch_contrast_*`.]
- [x] T007 [P] Side-by-side: `.sxs` `min-width` so the scoped region scrolls; wrapper `role="region"`/`aria-label`/`tabindex="0"`/`:focus-visible` (REQ-005) (`scripts/create_diff.py`) [EVIDENCE: attributes + min-width present in regenerated report; `test_side_by_side_scroll_is_scoped_and_keyboard_operable`.]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Author `test_create_diff.py`: REQ-001..005 plus zero-JS/CSP/escaping/byte-reproducibility/pairing/collapse — 18 tests green (REQ-006) (`scripts/test_create_diff.py`) [EVIDENCE: `python3 test_create_diff.py` → Ran 18 tests, OK.]
- [x] T009 Regenerate the four demo reports; confirm validate + byte-reproducibility (REQ-006) [EVIDENCE: `validate_report.py` passes 4/4 reports; feed side-by-side byte-identical across two fixed-`SOURCE_DATE_EPOCH` runs.]
- [x] T010 Adversarially verify the validator rewrite + strict decode against fresh hostile/edge inputs (REQ-003, REQ-001) [EVIDENCE: a fresh hostile report FAILS with 10 hazards (SVG `onload`, `<base>`, remote `<link>`, `@import`, remote `srcset`, `javascript:`, weakened CSP); an invalid-byte pair is refused with exit 3 (not "identical"); multibyte, EOF-newline, and empty→content line-model checks all pass.]
- [x] T011 Reconcile docs: capabilities-and-fidelity + accessibility-contract; correct 006 summary warnings count and WCAG note; cross-link 008 (REQ-007) [EVIDENCE: edited `capabilities-and-fidelity.md`, `accessibility-contract.md`, and the `006` `implementation-summary.md` verification table.]
- [x] T012 Run canon gates (package_skill --check, parent-skill-check, comment-hygiene) + `validate.sh --recursive --strict` on 999 [EVIDENCE: `package_skill.py --check` PASS (8 intentional 017 hyphen advisories); `parent-skill-check.cjs` 0 warnings; comment-hygiene 0 hits; `check-frontmatter-versions.sh` clean; recursive strict on 999 — 008 + parent + phases 002–007 all 0/0; lone remaining warning is a pre-existing continuity lag in sibling 001 (out of scope).]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked [x]
- [x] No [B] tasks remain
- [x] Two files differing only in invalid bytes are never reported identical
- [x] The hostile payload FAILS the validator; the four real reports PASS
- [x] Every legend contrast pair passes both themes
- [x] Side-by-side scoped scroll actually scrolls and is keyboard-operable
- [x] Regression suite is checked in and green; reports byte-reproducible
- [x] Canon gates + strict recursive validation stay 0/0 (008 packet + parent; pre-existing 001 continuity-lag excluded)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Verification Checklist**: `checklist.md`
- **Origin (redesign remediated)**: `../006-opencode-skill-and-accessibility/`
- **Engine + validator**: `../../../../skills/sk-doc/create-diff/scripts/`
<!-- /ANCHOR:cross-refs -->
