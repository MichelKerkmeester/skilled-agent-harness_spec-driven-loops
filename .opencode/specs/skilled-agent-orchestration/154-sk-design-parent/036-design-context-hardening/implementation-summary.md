---
title: "Implementation Summary: harden the context-loading contract"
description: "Acted on the 031 deep-review + benchmark: removed the CO-037 safety defect (F-005), made the contract's cross-references resolve (F-003), reordered Template 16 + reconciled 13→16 template counts (F-006), and added a deterministic WCAG contrast checker (scripts/contrast_check.py) wired into the foundations SKILL, the contract, and the contrast-pair worksheet. All edited files pass sk-doc; smart-routers intact."
trigger_phrases:
  - "context contract hardening summary"
  - "contrast checker added"
  - "design contract fixes applied"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/036-design-context-hardening"
    last_updated_at: "2026-06-27T16:45:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Applied F-005/F-003/F-006 + added + wired the contrast checker"
    next_safe_action: "Optional executable orchestrator gate (F-004); commit the arc"
    blockers: []
    key_files:
      - "spec.md"
      - "../../../../skills/sk-design/design-foundations/scripts/contrast_check.py"
      - "../035-design-context-benchmark/review/review-report.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "build-154-036-design-context-hardening"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The deterministic contrast checker closes the benchmark's weakest link: it computes ratios and exits non-zero on a body-contrast fail, so the inventory cannot mislabel a fail as a pass"
      - "F-004 (executable orchestrator-path gate) remains the larger deferred follow-up"
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Status** | Complete |
| **Date** | 2026-06-27 |
| **Level** | 1 |
| **Type** | Hardening (acts on 031 review/benchmark) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The three concrete 031 review fixes plus the deterministic contrast checker that closes the benchmark's weakest link.

### Headline
The contract is now harder to misuse: no unsafe dispatch command ships in a manual scenario, its cross-references resolve, the template inventory is accurate, and the contrast inventory has a **calculator instead of eyeballs** — `contrast_check.py` computes WCAG ratios and exits non-zero on a body-contrast fail, so a weak model cannot mislabel a failing pair as a pass (the exact thing Kimi did in the benchmark).

### Files Changed
- **F-005 (safety):** `cli-opencode/.../minimax-design-context-manifest.md` — removed `--dangerously-skip-permissions` and the MiniMax `--variant high` from the CO-037 command (now aligns with the MiniMax profile).
- **F-003 (cross-refs):** `sk-design/shared/context_loading_contract.md` — bare filenames → resolving relative paths (`brief_to_dials.md`, `audit_contract.md`, `accessibility_performance.md`, `evidence_capture.md`, `audit_evidence_worksheet.md`).
- **F-006 (inventory):** `cli-opencode/assets/prompt_templates.md` — Template 16 moved before RELATED RESOURCES (now §17, sequential); `13 templates` → `16 templates` reconciled across `manual_testing_playbook.md`, `templates-inventory.md`, and `template-applied-to-real-dispatch.md`.
- **New checker:** `sk-design/design-foundations/scripts/contrast_check.py` — stdlib-only WCAG calculator.
- **Wiring:** the foundations SKILL contrast row, the contract's CONTRAST PAIRS proof field, and `contrast_pair_inventory.md` all point at the checker.
- **Wrapper:** `spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md`.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Done directly (surgical Edits + one new script), not via dispatched agents, because each change was small and precise and the review gave exact file:line targets. Each F-003 target path was existence-checked before writing the relative link; the Template 16 reorder used a unique anchor; the checker was smoke-tested on the benchmark's decisive values before wiring.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

- **Calculator over prose** — the benchmark showed a weak model runs the inventory but mis-judges ratios; a deterministic script (research §17) is the right fix, not more wording.
- **Surgical + additive** — fixes only remove unsafe content, add resolving paths, reorder one section, and add a checker; no router/anchor/frontmatter edits.
- **Defer F-004** — the executable orchestrator-path gate is larger and stays a separate follow-up.
- **Selective commit** — only this arc's files are staged; the pre-existing dirty design-family files are left for a separate cleanup.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

- **sk-doc**: `validate_document.py` VALID on every edited markdown file.
- **Checker**: `contrast_check.py "#787878" "#ffffff"` → 4.42, body FAIL, exit 1; `"#043367" "#ffffff"` → 12.54, PASS — matches the independently-recomputed benchmark values.
- **F-005**: grep confirms no `--dangerously-skip-permissions` / MiniMax `--variant` remain in CO-037.
- **F-006**: Template sections sequential §15→§18; zero `13 template` references remain in cli-opencode.
- **Routers/anchors**: the four design SKILLs' smart-router blocks + anchors unchanged (additive edits only).
- **Packet**: `validate.sh --strict` on `032` (see final state).
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- **F-004 deferred** — the executable orchestrator-path gate (per-mode router auto-load or deterministic pre-dispatch proof check) is not built; the contract remains advisory for the orchestrator's own path (sufficient for delegation, per the 031 benchmark).
- **WCAG only** — `contrast_check.py` computes WCAG ratios (the contract's stated target); APCA Lc is not yet included.
- **Pre-existing dirty worktree** — unrelated design-family uncommitted files (some failing sk-doc) remain for a separate cleanup; they are not part of this arc's commit.
<!-- /ANCHOR:limitations -->
