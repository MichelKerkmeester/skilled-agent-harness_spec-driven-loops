---
title: "Tasks: Fluid-responsive HTML report layout for create-diff"
description: "Implementation queue for the create-diff fluid report layer: add the cqi/@container fluid type and rhythm tokens to _CSS, retarget sized rules, add the container refinements, lock the layer with a regression test, and verify the validator, accessibility, and byte-reproducibility invariants hold."
trigger_phrases:
  - "fluid responsive report tasks"
  - "create diff container query tasks"
  - "diff report css tasks"
importance_tier: "important"
contextType: "implementation"
status: "complete"
_memory:
  continuity:
    packet_pointer: "sk-doc/033-create-diff-mode/010-fluid-responsive-report"
    last_updated_at: "2026-07-16T14:52:04Z"
    last_updated_by: "claude"
    recent_action: "Remediated deep-review P0/P1/P2 and folded design increments into docs"
    next_safe_action: "Commit the remediation and re-sync to v4"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "fluid-responsive-report-010"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Fluid-responsive HTML report layout for create-diff

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

> This packet is built and verified: every task is `[x]` complete with an inline `[EVIDENCE: ...]` bracket. The only deferred item is subjective visual acceptance in a real IDE webview (a user-runtime step); the rendered reports were delivered for that review.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Add the fluid design tokens to the first `:root` block of `_CSS` (`--fs-0`, `--fs-h1/-h2/-sm`, `--fs-code`, `--rhythm`, `--measure`; redefine `--text-caption`) (REQ-001, REQ-005) (`.opencode/skills/sk-doc/create-diff/scripts/create_diff.py`). [EVIDENCE: `_CSS` carries `--fs-0:clamp(.875rem,calc(.766rem + .3125cqi),1rem)` and 4 `cqi` tokens; all values parenthesis-only so the contrast-token regex is unaffected.]
- [x] T002 Establish the query container: add `container-type:inline-size;container-name:report` to `main` and a `main>*{font-size:var(--fs-0)}` base (REQ-001) (`create_diff.py`). [EVIDENCE: rendered report contains `container-type:inline-size`; asserted by `test_fluid_type_layer_is_container_keyed`.]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Retarget the sized rules to the tokens (`h1`/`h2`/`.warn h2`/`.summary`/`.key`) and convert `table.diff` `font:` shorthand to longhand driving `--fs-code` (REQ-001, REQ-004) (`create_diff.py`). [EVIDENCE: `table.diff` now uses `font-family:var(--font-code);font-size:var(--fs-code);line-height:1.5`.]
- [x] T004 Split the prose measure: `.report-header,.warn,footer` use `--measure` (`min(72rem, 84ch)`) while `.summary-sec` keeps `max-width:72rem` (REQ-003, REQ-004) (`create_diff.py`). [EVIDENCE: the combined `max-width:72rem` rule is split; the summary table width is preserved.]
- [x] T005 [P] Add the two `@container report (...)` refinements (≤34rem and ≥80rem) (REQ-001) (`create_diff.py`). [EVIDENCE: rendered output contains 2 `@container report` blocks (`max-width:34rem`, `min-width:80rem`).]
- [x] T011 Raise the page gutter to a 2rem floor on every side (REQ-008) (`create_diff.py`). [EVIDENCE: `main{...padding:2rem}`; locked by `test_page_gutter_has_two_rem_minimum`.]
- [x] T012 Adopt the Cursor light-mode design: parchment/ink/ember palette with forest/crimson diff hues, bone/linen/stone surfaces, 4px geometry, Cursor-led font stacks, light-only (REQ-008) (`create_diff.py`). [EVIDENCE: tokens sourced from `.opencode/skills/sk-design/styles/cursor/`; the dark `@media` block is removed and `test_report_is_light_mode_only` locks it; inline-mark contrast gates ≥4.5 hold.]
- [x] T013 Divide markdown diffs by document structure: nearest-heading section bands, `§`-labeled hunk headers, no bands for change-free sections, non-markdown unaffected (REQ-009) (`create_diff.py`). [EVIDENCE: `test_markdown_headings_divide_sections` + `test_plain_text_gets_no_section_rows` green.]
- [x] T014 Contain snapshot-manifest blob paths before every read and unlink (REQ-007) (`create_diff.py`). [EVIDENCE: `_safe_blob_path` guards `cmd_compare` and `cmd_cleanup`; `SnapshotCleanupContainment` covers traversal, absolute, symlink-escape, and legitimate-cleanup parity; the live traversal/absolute reproduction now leaves the victim intact with 2 refused entries.]
- [x] T015 Make the unsupported-`cqi` fallback real: static base tokens at the shipped fixed sizes, fluid values only inside `@supports (font-size:1cqi)` (REQ-010) (`create_diff.py`). [EVIDENCE: first `:root` carries `--fs-0:1rem`/`--fs-code:13px` and no `cqi`; locked by `test_fluid_tokens_degrade_to_fixed_sizes_without_cqi`.]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 [P] Add a renderer regression test asserting the fluid context + an `@container` block (REQ-006) (`.opencode/skills/sk-doc/create-diff/scripts/test_create_diff.py`). [EVIDENCE: `ReportInvariants::test_fluid_type_layer_is_container_keyed` added.]
- [x] T007 Run the full renderer suite (REQ-006). [EVIDENCE: `python3 -m unittest test_create_diff` → Ran 40 tests, OK.]
- [x] T008 Regenerate both report views and validate them (REQ-002). [EVIDENCE: unified + side-by-side generated exit 0; `validate_report.py` → PASS (exit 0) for both.]
- [x] T009 Confirm safety + accessibility invariants (REQ-002, REQ-003). [EVIDENCE: substring scan `url(`/`@import`/`expression(` = 0/0/0; CSP byte-identical; pinned literals `.sxs{min-width:`, `.diff-scroll:focus-visible`, legend + mark decorations all present.]
- [x] T010 Run `validate.sh --strict` on this child. [EVIDENCE: `validate.sh 010-fluid-responsive-report --strict` → Errors 0.]
- [x] T016 Deep-review the skill + command surface (10 iterations, GPT 5.6 SOL high via cli-opencode) and remediate every active finding (REQ-006, REQ-007, REQ-010). [EVIDENCE: `review/review-report.md` — verdict FAIL with P0 manifest containment, P1 fallback, P2 test lock; all three fixed; suite grew 43 → 48, all green; 8/8 gallery reports re-validate PASS.]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] Fluid tokens + container established; sized rules retargeted; two `@container` refinements added
- [x] Zero `url(`/`@import`/`expression(`; no inline `style=`; CSP byte-identical
- [x] Every phase-008 accessibility literal preserved byte-for-byte
- [x] Renderer suite green including the new fluid-layer test (40/40 at layer delivery; 48/48 after the follow-on increments and review remediation)
- [x] Both report views pass `validate_report.py` (exit 0)
- [x] `validate.sh --strict` on this child = 0 content/structure errors
- [x] Deep-review findings (P0 manifest containment, P1 `cqi` fallback, P2 test lock) remediated with regression tests
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Verification Checklist**: `checklist.md`
- **Predecessor (the command that invokes the renderer)**: `../009-create-diff-command/`
- **Renderer + validator**: `../../../../skills/sk-doc/create-diff/scripts/`
<!-- /ANCHOR:cross-refs -->
