---
title: "Tasks: Improve AI-driven spec folder and phase naming so AI-chosen slugs describe concrete work being built or fixed rather than generic placeholders like remediation or phase-N [template:level_2/tasks.md]"
description: "Task Format: T### [P?] Description (file path). 21 concrete tasks across 7 implementation phases."
trigger_phrases:
  - "literal naming tasks"
  - "phase names tasks"
  - "create.sh fallback tasks"
  - "tasks core"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/002-spec-kit-internals/003-literal-spec-folder-names"
    last_updated_at: "2026-05-19T07:48:17Z"
    last_updated_by: "claude-code"
    recent_action: "Populated Level 2 documents"
    next_safe_action: "Implement intervention per tasks.md"
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
      session_id: "scaffold-scaffold/012-literal-spec-folder-names"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Improve AI-driven spec folder and phase naming so AI-chosen slugs describe concrete work being built or fixed rather than generic placeholders like remediation or phase-N

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

> Canonical wording + anchor confirmation

- [ ] T001 Draft the canonical "Generate phase names" activity wording: literal slug requirement + specific subject token rule + named bad shapes (`phase-1`, `cleanup`, `remediation`) + named good shapes (`data-model-design`, `api-implementation`, `ui-integration`). (`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-literal-spec-folder-names/scratch/canonical-yaml-wording.md`)
- [ ] T002 Read all 4 YAML files end-to-end to confirm anchor structure (`P2` activity list at the cited line ranges) before editing. (`.opencode/commands/spec_kit/assets/spec_kit_{plan,complete}_{auto,confirm}.yaml`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

> YAML rewrites + create.sh hunks + complete.md Q8 + SKILL.md rule 20 + feature_catalog refresh

- [ ] T003 [P] Apply canonical rewrite to the `Generate phase names` activity at lines 47-48 (`.opencode/commands/spec_kit/assets/spec_kit_plan_auto.yaml`)
- [ ] T004 [P] Apply canonical rewrite to lines 47-48 (`.opencode/commands/spec_kit/assets/spec_kit_plan_confirm.yaml`)
- [ ] T005 [P] Apply canonical rewrite to lines 73-74 (`.opencode/commands/spec_kit/assets/spec_kit_complete_auto.yaml`)
- [ ] T006 [P] Apply canonical rewrite to lines 61-62 (`.opencode/commands/spec_kit/assets/spec_kit_complete_confirm.yaml`)
- [ ] T007 Smoke-test all 4 modified YAMLs with `python3 -c "import yaml; yaml.safe_load(open(f))"`. Expect exit 0 for each. (`.opencode/commands/spec_kit/assets/spec_kit_{plan,complete}_{auto,confirm}.yaml`)
- [ ] T008 Read `create.sh` lines 560-580 and 1070-1095 to confirm both fallback hunk locations before editing. (`.opencode/skills/system-spec-kit/scripts/spec/create.sh`)
- [ ] T009 Replace `local child_name="001-phase-one"` at line 571 with `local child_name="001-validation-phase-PROVIDE-DESCRIPTIVE-SLUG"` and add `echo "[speckit] Warning: Falling back to generic phase name '$child_name'. Provide --phase-names with literal slugs." >&2` above it. (`.opencode/skills/system-spec-kit/scripts/spec/create.sh:571`)
- [ ] T010 Replace `_child_slug="phase-${_phase_number}"` in the `else` branch at line 1084 with `_child_slug="phase-${_phase_number}-PROVIDE-DESCRIPTIVE-SLUG"` and add `echo "[speckit] Warning: Falling back to generic phase name '$_child_slug'. Provide --phase-names with literal slugs." >&2` above it. (`.opencode/skills/system-spec-kit/scripts/spec/create.sh:1084`)
- [ ] T011 Smoke-test `create.sh` synthetic scaffold: `bash create.sh "synthetic test" --short-name synth --level 2 --phase --phase-count 3 --path /tmp/speckit-naming-smoke-$$ 2>/tmp/speckit-stderr-$$.log`. Confirm the stderr log contains both `[speckit] Warning:` lines and scaffolded folder names include `-PROVIDE-DESCRIPTIVE-SLUG`. (`/tmp/speckit-naming-smoke-$$`)
- [ ] T012 Read `complete.md` lines 180-200 to confirm Q8 anchor before editing. (`.opencode/commands/spec_kit/complete.md`)
- [ ] T013 Rewrite Q8 at lines 186-188 with literal-naming prompt: require literal phase names, list 1 good example (`fix-singleton-leak-in-launcher`) + 2 bad examples (`cleanup`, `remediation`), replace "Optional: auto-generated if skipped" with "Strongly preferred: auto-generation emits a placeholder slug + stderr warning". (`.opencode/commands/spec_kit/complete.md:186-188`)
- [ ] T014 Read `system-spec-kit/SKILL.md` lines 390-440 to confirm the `ALWAYS` section anchor and current rule-19 position. (`.opencode/skills/system-spec-kit/SKILL.md`)
- [ ] T015 Insert new rule 20 `REMEDIATION PACKET NAMING` after current rule 19 (around line 413): require names to reference both source (`fix-deep-review-p1-p2-…`) AND target (`…-for-sk-doc-skill`); forbid bare `remediation` / `cleanup` / `phase-N`; include 2 good-example references. (`.opencode/skills/system-spec-kit/SKILL.md:~413`)
- [ ] T016 Confirm `grep -c '^## ' .opencode/skills/system-spec-kit/SKILL.md` returns the unchanged section count (rule 20 must stay inside the existing `ALWAYS` subsection, not introduce a new `## ` heading). (`.opencode/skills/system-spec-kit/SKILL.md`)
- [ ] T017 Read `feature_catalog/feature_catalog.md` lines 4330-4350 to confirm the `--phase-names` description anchor. (`.opencode/skills/system-spec-kit/feature_catalog/feature_catalog.md`)
- [ ] T018 Extend the `--phase-names` description at line 4338 with one sentence: when omitted, `create.sh` emits `PROVIDE-DESCRIPTIVE-SLUG` placeholder + stderr warning; provide literal subject-token names per `system-spec-kit` ALWAYS rule 20. (`.opencode/skills/system-spec-kit/feature_catalog/feature_catalog.md:4338`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T019 Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-literal-spec-folder-names --strict`. Expect exit 0 (SC-004). (`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-literal-spec-folder-names`)
- [ ] T020 Manual smoke-test: invoke `/spec_kit:plan :auto` against a synthetic ambiguous task (e.g. "fix the thing in the launcher that leaks"). Confirm the proposed packet name contains a specific subject token like `singleton-leak` / `launcher-leak`, not a generic placeholder like `fix-launcher` / `cleanup` (SC-005, operator-driven). (operator runtime, no file path)
- [ ] T021 Update `implementation-summary.md` with realized file paths, edited line ranges, smoke-test evidence (stderr warning capture + `validate.sh` exit code). Post-implementation only. (`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-literal-spec-folder-names/implementation-summary.md`)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed (T020)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->

