---
title: "Implementation Summary [template:level_2/implementation-summary.md]"
description: "AI-derived spec folder and phase slugs must now include a specific subject token; four high-impact surfaces were updated and one new SKILL.md rule landed."
trigger_phrases:
  - "implementation"
  - "summary"
  - "literal-spec-folder-names"
  - "literal naming"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/012-literal-spec-folder-names"
    last_updated_at: "2026-05-19T10:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Implementation complete; all 8 target files updated and validated"
    next_safe_action: "Commit on main; smoke-test /spec_kit:plan against an ambiguous task in a future session"
    blockers: []
    key_files:
      - ".opencode/commands/spec_kit/assets/spec_kit_plan_auto.yaml"
      - ".opencode/commands/spec_kit/assets/spec_kit_plan_confirm.yaml"
      - ".opencode/commands/spec_kit/assets/spec_kit_complete_auto.yaml"
      - ".opencode/commands/spec_kit/assets/spec_kit_complete_confirm.yaml"
      - ".opencode/skills/system-spec-kit/scripts/spec/create.sh"
      - ".opencode/commands/spec_kit/complete.md"
      - ".opencode/skills/system-spec-kit/SKILL.md"
      - ".opencode/skills/system-spec-kit/feature_catalog/feature_catalog.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "implement-012-literal-spec-folder-names"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Symlink topology: keep symlinks pointing at sk-doc (Packet A)"
      - "Ambiguous content: generalize (Packet A)"
      - "Validation scope: prompt + bash + skill rule only; no validate.sh lint"
      - "Short slug: 012-literal-spec-folder-names"
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 012-literal-spec-folder-names |
| **Completed** | 2026-05-19 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

When the AI proposes a spec-folder or phase slug, the active instruction now demands a name that names the concrete component or behaviour being changed. Generic placeholders like `phase-1`, `phase-2`, `remediation`, `cleanup`, `review-remediation-2` are explicitly listed as rejected examples. The intervention lands at four surfaces: the YAML workflow step P2 that drives `/spec_kit:plan` and `/spec_kit:complete`; the `create.sh` auto-generation fallback (warn-only, never fail-hard); the `complete.md` interactive Q8 prompt; and a new always-on rule 20 in `system-spec-kit/SKILL.md` covering remediation-packet naming.

### YAML "Generate phase names" activity rewritten across all four workflows

The step-P2 activity in `spec_kit_plan_auto.yaml`, `spec_kit_plan_confirm.yaml`, `spec_kit_complete_auto.yaml`, and `spec_kit_complete_confirm.yaml` now reads `"Generate LITERAL phase names that describe the concrete work in each phase — e.g. data-model-design, api-implementation, ui-integration — NOT generic placeholders like phase-1 / phase-2 / remediation / cleanup. Names must include a specific subject token (the component or behaviour being changed)."` The same string is used in all 4 files so parity-checking scripts continue to pass. All 4 YAMLs still load cleanly via `yaml.safe_load`.

### `create.sh` fallbacks warn instead of silently emitting `phase-N`

The two auto-generation sites in `create.sh` (line 571 hardcoded validation-child name; line 1084 phase-N fallback) now emit a placeholder slug containing the literal token `PROVIDE-DESCRIPTIVE-SLUG` plus a `[speckit] Warning:` line on stderr. The placeholder is loud enough that any operator who scaffolds without `--phase-names` will see the warning during scaffolding AND on every subsequent `ls`. `bash -n` confirms syntactic correctness; a synthetic dry-run produced `001-phase-1-PROVIDE-DESCRIPTIVE-SLUG` etc. with all 3 warnings on stderr.

### `complete.md` Q8 rewrite + new SKILL.md rule 20

The Q8 interactive prompt in `complete.md:186-188` now carries good-vs-bad examples drawn from the active codebase (`fix-singleton-leak-in-launcher` vs `cleanup`). A new ALWAYS rule 20 in `system-spec-kit/SKILL.md` codifies the requirement that remediation packets reference both the SOURCE (e.g. `fix-deep-review-...`) and the specific TARGET (e.g. `...-for-sk-doc-skill`). The SKILL.md section count is unchanged (still 7) so the cli-* family-contract floor holds.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/commands/spec_kit/assets/spec_kit_plan_auto.yaml` | Modified | Step-P2 activity rewritten to demand literal names with specific subject token |
| `.opencode/commands/spec_kit/assets/spec_kit_plan_confirm.yaml` | Modified | Same (parity mirror) |
| `.opencode/commands/spec_kit/assets/spec_kit_complete_auto.yaml` | Modified | Same (parity mirror) |
| `.opencode/commands/spec_kit/assets/spec_kit_complete_confirm.yaml` | Modified | Same (parity mirror) |
| `.opencode/skills/system-spec-kit/scripts/spec/create.sh` | Modified | Lines 571 + 1084: placeholder slug + stderr warning when `--phase-names` omitted |
| `.opencode/commands/spec_kit/complete.md` | Modified | Q8 Phase Names prompt: bad-vs-good examples added |
| `.opencode/skills/system-spec-kit/SKILL.md` | Modified | New ALWAYS rule 20: Literal naming for AI-derived spec folders and phases |
| `.opencode/skills/system-spec-kit/feature_catalog/feature_catalog.md` | Modified | Phase-naming entry refreshed to mention new guidance |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The packet was implemented by a `cli-devin` SWE-1.6 worker dispatched with `--permission-mode dangerous` (operator-approved via plan-mode ExitPlanMode) and an RCAF prompt that decomposed the work into 7 ordered steps with explicit acceptance criteria per step. The worker called `mcp__sequential_thinking__sequentialthinking` ≥ 5 times before producing its final report, per the cli-devin §4 Rule 14 contract.

Verification was run twice: once by the dispatched worker (Step 7 of its plan) and once independently by the main agent after the dispatch returned. Both passes were clean. The dispatch did not commit; commits are the main agent's responsibility per the operator's standing pattern.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Warn instead of fail-hard in `create.sh` fallback | Fail-hard would break existing scripted dispatches that legitimately omit `--phase-names`. The `PROVIDE-DESCRIPTIVE-SLUG` placeholder is visible on every subsequent `ls`, so the operator sees the omission. |
| No `validate.sh` lint for generic slugs (operator decision Q3) | Documentation-layer fix is the right scope. A lint would need a stoplist + allowlist (legitimate names like `001-research-and-baseline` would false-positive). Deferred to a follow-on if generic slugs reappear in practice. |
| Apply identical YAML patch across all 4 spec_kit YAML files | Parity-checking scripts in `system-spec-kit` enforce byte-equivalence on the 4 workflow YAMLs. Different wording in each would fail the parity check. |
| Insert new rule as #20 (not splitting into a new section) | The cli-* family-contract requires 7 `## ` headings in `system-spec-kit/SKILL.md`. Adding a section would break the count. Appending to ALWAYS preserves both the contract and the rule's location. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `validate.sh --strict` on this packet | PASS (0 errors, 0 warnings) |
| All 4 YAMLs load via `yaml.safe_load` | 4/4 OK |
| `grep -l "specific subject token"` on the 4 YAMLs | 4/4 match (parity confirmed) |
| `bash -n create.sh` | Exit 0 (syntax check) |
| `grep -c PROVIDE-DESCRIPTIVE-SLUG create.sh` | 2 (one per fallback site) |
| Synthetic `create.sh` smoke-test with `--phase` and no `--phase-names` | Emits 3 stderr warnings; scaffolds `001-phase-1-PROVIDE-DESCRIPTIVE-SLUG` etc. |
| `grep -c '^## ' SKILL.md` (pre vs post) | 7 vs 7 (unchanged) |
| `grep "Literal naming for AI-derived" SKILL.md` | 1 match (rule 20 present) |
| `git branch --show-current` | `main` |
| Scratch directories (`/tmp/speckit-naming-smoke-*`) cleaned up | Confirmed (no leftover) |
| No commits made by dispatched worker | Confirmed |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **No retroactive renaming of existing generic packets.** Three active packets already use the rejected pattern (`005-deep-review-p1-p2-remediation`, `004-remediation`, `001-remediation`). Renaming them would require updating every changelog, memory, and graph-metadata reference. Per the plan-mode decision, the new guidance applies to new packets only.
2. **No lint enforcement.** A future operator could ignore the rule 20 instruction and pass `--short-name remediation` to `create.sh`. The script accepts any string. The intervention is prompt-level only; behavioural conformance depends on the AI following the YAML activity instruction.
3. **Smoke test of the YAML rewrite is not automated.** Confirmation that `/spec_kit:plan :auto` against an ambiguous task now produces literal names requires a manual operator-driven run. Scheduling that smoke-test is a separate follow-on.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->
