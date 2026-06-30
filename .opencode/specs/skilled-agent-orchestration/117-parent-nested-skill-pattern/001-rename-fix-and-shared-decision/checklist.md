---
title: "Verification Checklist: Fix the four-folder rename and record the shared/ decision"
description: "Verification Checklist for phase 001 of the parent-nested-skill-pattern epic: reference-integrity, script resolution, parity, and the shared/-stays decision."
trigger_phrases:
  - "deep-loop-workflows rename fix checklist"
  - "parent-nested-skill-pattern phase 001 checklist"
  - "deep- prefix sweep verification"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/117-parent-nested-skill-pattern/001-rename-fix-and-shared-decision"
    last_updated_at: "2026-06-15T09:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Assembled verification checklist for the rename-fix phase"
    next_safe_action: "Run validate.sh --strict then commit scoped"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-155-001-rename-fix-and-shared-decision-verificationchecklist"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Fix the four-folder rename and record the shared/ decision

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

<!-- /ANCHOR:protocol -->
---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Predecessor (`../147-deep-loop-workflows`) complete and the parent skill exists in merged form
  - **Evidence**: `deep-loop-workflows/` present with hub `SKILL.md` + `mode-registry.json` + five mode packets.
- [x] CHK-002 [P0] On-disk renames confirmed; `ai-council` unchanged
  - **Evidence**: `deep-context`/`deep-research`/`deep-review`/`deep-improvement` exist; `ai-council` retained.

<!-- /ANCHOR:pre-impl -->
---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Edits stay in this phase's frozen scope (reference text + one decision record; no behavior surface)
  - **Evidence**: changed-file list is registry/assets/`fanout-run.cjs`/hub files/packet docs/the cli-opencode straggler.
- [x] CHK-011 [P1] Sweep follows existing path conventions (`deep-`-prefixed packet folders)
  - **Evidence**: rewritten paths match the on-disk folder names.

<!-- /ANCHOR:code-quality -->
---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Broken-ref grep returns 0 (slash form) in live surfaces
  - **Evidence**: `rg 'deep-loop-workflows/(context|research|review|improvement)/'` over live surfaces == 0.
- [x] CHK-021 [P0] Broken-ref grep returns 0 (bare/quote-terminated form) in live surfaces
  - **Evidence**: bare-form sweep cleared the 3 stragglers + the cli-opencode reference.
- [x] CHK-022 [P0] Zero double-prefix (`deep-deep-`) hits
  - **Evidence**: `rg 'deep-deep-(context|research|review|improvement)'` == 0.
- [x] CHK-023 [P0] All packet `.cjs` scripts resolve their requires
  - **Evidence**: 73/73 packet scripts resolve (require-resolution check).
- [x] CHK-024 [P0] `mode-registry.json` valid JSON; keys match on-disk folder names
  - **Evidence**: `JSON.parse` succeeds; packet keys equal folder names.
- [x] CHK-025 [P0] `deep-loop-runtime` vitest green modulo the documented pre-existing flake
  - **Evidence**: 250/251; the single diff is the known cross-process loop-lock flake.

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-060 [P0] `mode-registry.json` packet keys repointed (4); `ai-council` unchanged
  - **Evidence**: `deep-context`/`deep-research`/`deep-review`/`deep-improvement`; `ai-council` retained.
- [x] CHK-061 [P0] `/deep:*` command YAML assets repointed
  - **Evidence**: grep over `commands/deep/assets/` shows zero old-form refs.
- [x] CHK-062 [P0] `fanout-run.cjs` `buildLoopPrompt` SKILL.md paths fixed
  - **Evidence**: constructed `deep-*/SKILL.md` paths resolve.
- [x] CHK-063 [P0] Hub `graph-metadata.json` `key_files` + `SKILL.md` + `README.md` updated
  - **Evidence**: referenced paths exist on disk.
- [x] CHK-064 [P0] `cli-opencode/references/destructive_scope_violations.md` straggler fixed
  - **Evidence**: three `review/` refs now read `deep-review/`; repo-wide grep == 0.
- [x] CHK-065 [P0] `decision-record.md` (shared/-stays) authored
  - **Evidence**: ADR-001 + ADR-002 present with rationale.

<!-- /ANCHOR:fix-completeness -->
---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secrets introduced
  - **Evidence**: reference-text reorg + one decision record; no credentials.
- [x] CHK-031 [P1] `deep-loop-runtime` stays MCP-free; `shared/` not moved into it
  - **Evidence**: backend untouched; ADR-001 records the no-move decision.

<!-- /ANCHOR:security -->
---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] spec/plan/tasks synchronized for this phase
  - **Evidence**: this packet's docs describe the same scope.
- [x] CHK-041 [P1] Decision rationale captured (execution-vs-synthesis; dependency rationale struck post-research)
  - **Evidence**: `decision-record.md` ADR-001.

<!-- /ANCHOR:docs -->
---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Advisor `skill_graph_scan` clean (no rejected edges from this change)
  - **Evidence**: scan status ok post-sweep.
- [x] CHK-051 [P1] Historical `specs/**` and `changelog/**` refs left untouched
  - **Evidence**: sweep excluded those paths; they document the pre-rename history.

<!-- /ANCHOR:file-org -->
---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 16 | 16/16 |
| P1 Items | 6 | 6/6 |
| P2 Items | 0 | 0/0 |

**Note**: `validate.sh --strict` and the scoped commit are the close-out steps run this turn; they are tracked in `tasks.md` (T009/T014/T015), not as checklist gate rows, because they execute after this checklist lands.

**Verification Date**: 2026-06-15
**Verified By**: claude-opus (orchestrator)

<!-- /ANCHOR:summary -->
