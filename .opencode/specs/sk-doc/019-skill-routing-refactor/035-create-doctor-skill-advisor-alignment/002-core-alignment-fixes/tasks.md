---
title: "Tasks: Create/Doctor/Skill-Advisor Core Alignment Fixes"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "core alignment fixes tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/035-create-doctor-skill-advisor-alignment/002-core-alignment-fixes"
    last_updated_at: "2026-07-31T03:57:25Z"
    last_updated_by: "claude-code"
    recent_action: "Gap remediation (T015-T020) closed all 5 flagged gaps; all 20 tasks complete"
    next_safe_action: "None — packet Complete"
    blockers: []
    key_files:
      - "tasks.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "035-002-core-alignment-fixes"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Create/Doctor/Skill-Advisor Core Alignment Fixes

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

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

- [x] T001 Confirm scope against research.md Section 6 Track A; scaffold this packet (`spec.md`, `plan.md`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 A1a: fix `route-validate.py`'s stale snake_case regex for hyphen-case yaml filenames (`.opencode/commands/doctor/scripts/route-validate.py`)
- [x] T003 A1b: add `skill_graph_validate` to `_routes.yaml`'s skill-advisor route and `speckit.md`'s router allowed-tools (`.opencode/commands/doctor/_routes.yaml`, `.opencode/commands/doctor/speckit.md`)
- [x] T004 A1c: fix the stale `assets/skill/` -> `assets/parent-skill/` template cross-reference (`.opencode/commands/create/skill-parent.md`)
- [x] T005 A2: wire `skill_graph_validate` into `doctor-skill-advisor.yaml`'s verification phase with the pass/warn/fail/unavailable derivation and normalized `graph_scan_report` fields (`.opencode/commands/doctor/assets/doctor-skill-advisor.yaml`)
- [x] T006 A3: point parent creation's leaf-manifest generation at the scoped `generate-leaf-manifest.cjs --write <skillDir>` instead of the fleet `--fix` gate (`.opencode/commands/create/assets/create-skill-parent-auto.yaml`)
- [x] T007 A4: author `advisor-index-handoff.md` (metadata ownership, refresh ownership, verification-state vocabulary, class applicability, guardrail note) (`.opencode/skills/sk-doc/sk-create-skill/references/shared/advisor-index-handoff.md`)
- [x] T008 A5a: wire the handoff into standalone `/create:skill` full-create/full-update (`.opencode/commands/create/assets/create-skill-auto.yaml`, `create-skill-presentation.txt`; mirrored into `create-skill-confirm.yaml` for the `:confirm` variant; full-update branches gained a `--check` read-only freshness call since they never run the class-metadata gate)
- [x] T009 A5b: wire the handoff into parent `/create:skill-parent` create/update (`.opencode/commands/create/assets/create-skill-parent-auto.yaml`, `create-skill-parent-presentation.txt`; also mirrored the leaf-manifest generation + handoff report into `create-skill-parent-confirm.yaml`, the `:confirm` variant, since both share the same presentation template and both had the identical G2 gap)
- [x] T010 A5c: narrow leaf-freshness check for reference/asset-only create branches (`generate-leaf-manifest.cjs --check <skillDir>`)
- [x] T011 A6a: shared vocabulary/output-semantics contract test spanning standalone, parent, and doctor adapters (`.opencode/skills/sk-doc/sk-create-skill/scripts/tests/advisor-index-handoff-contract.test.cjs`, 9/9 passing)
- [x] T012 A6b: doctor route-contract test asserting the required tool subset exists in the live advisor registry (`.opencode/commands/doctor/scripts/tests/skill-advisor-route-contract.test.cjs`, 4/4 passing)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T013 Re-run `route-validate.sh`, `parent-skill-check.cjs`, and existing create/doctor test suites; confirm all pass (route-validate.sh 10/10 routes; parent-skill-check.cjs 7/7 hubs after regenerating sk-doc's own leaf-manifest.json for the new advisor-index-handoff.md leaf; fleet ci-skill-root-metadata.cjs 11/11 roots; sk-create-skill test suite 16/17 and doctor scripts test suite 4/5 and Python test_create_skill_contract.py 21/23 — all 3 remaining failures confirmed pre-existing via `git stash` baseline diff, unrelated to this packet's files)
- [x] T014 Reconcile packet docs (spec/plan/tasks/checklist/implementation-summary) to Complete; `validate.sh --strict` — PASSED, Errors: 0, Warnings: 0
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## Phase 4: Gap Remediation

- [x] T015 Fix `parent-skill-check-leaf-manifest.test.cjs`'s fixture-copy list — it never staged `s-class-config-defaults.json`, which `generate-leaf-manifest.cjs` requires at runtime, causing a pre-existing `MODULE_NOT_FOUND` (`.opencode/commands/doctor/scripts/tests/parent-skill-check-leaf-manifest.test.cjs`)
- [x] T016 Fix `init_skill.py`'s graph-metadata scaffold — remove the stray `manual` top-level key (cross-contamination from the unrelated spec-folder graph-metadata schema, not part of the skill-advisor schema) and expand `intent_signals` from 1-2 entries to 8 in both the standalone and parent-hub scaffold literals, plus their matching hand-authored templates, closing a pre-existing `GRAPH_METADATA_UNKNOWN_KEY`/`INTENT_SIGNALS_BELOW_FLOOR` failure (`.opencode/skills/sk-doc/sk-create-skill/scripts/init_skill.py`, `assets/skill/skill-graph-metadata-template.json`, `assets/parent-skill/parent-skill-graph-metadata-template.json`)
- [x] T017 Fix the hardcoded stale `010-live-activation` path in `test_create_skill_contract.py` — the real runtime layout selector (`compiled-route-layout.cjs`) treats `010` as legacy and `013` as current, and only `013` exists on disk; replaced the hardcoded path with dynamic discovery of the one `*-live-activation` directory present (`.opencode/skills/sk-doc/scripts/tests/test_create_skill_contract.py`)
- [x] T018 G4: point `MISSING_GENERATED_FILE` violations at the scoped generator — `parent-skill-check.cjs` check 11a previously reported a missing `leaf-manifest.json` with no redirect, unlike the byte-drift (10b) check which already prints the exact `generate-leaf-manifest.cjs --write` command; added the same redirect, read-only, distinguishing missing from stale per research Theme G4 (`.opencode/commands/doctor/scripts/parent-skill-check.cjs`)
- [x] T019 G3: scope the fleet class gate's `--fix` to one named skill — added a `--skill <name>` flag to `ci-skill-root-metadata.cjs` that filters discovery to one basename-matched root (fully backward compatible when absent), then updated `init_skill.py`'s `_ensure_class_gate_fresh()` to pass it, closing the "can also write unrelated roots" blast-radius gap; proven end-to-end with a live scaffold whose sibling root's file was byte-identical before/after (`.opencode/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs`, `init_skill.py`)
- [x] T020 Re-run the full verification surface after all 5 fixes: `route-validate.sh` (10/10), `parent-skill-check.cjs` (7/7 hubs), fleet gate (11/11 roots), `sk-create-skill` test suite (17/17, 0 pre-existing failures remaining), `doctor/scripts` test suite (5/5), `test_create_skill_contract.py` (23/23) — every previously-documented pre-existing failure now fixed, not just re-confirmed as unrelated
<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] `route-validate.sh` exits 0 with 10/10 routes validated
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Research**: See `../001-research/research/research.md` Section 6
<!-- /ANCHOR:cross-refs -->
