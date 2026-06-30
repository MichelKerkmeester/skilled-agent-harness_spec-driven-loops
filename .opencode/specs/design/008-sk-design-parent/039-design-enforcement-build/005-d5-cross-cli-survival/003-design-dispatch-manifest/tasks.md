---
title: "Tasks: D5-R3 — DESIGN_DISPATCH_MANIFEST v1 schema + Gate-3 present-or-ASK pass-through"
description: "Ordered build tasks and verification for the dispatch-manifest schema in context_loading_contract.md and the append-only present-or-ASK pass-through across the 3 cli-* SKILLs."
trigger_phrases:
  - "d5-r3 design dispatch manifest tasks"
  - "manifest schema build tasks"
  - "present-or-ask pass-through tasks"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/039-design-enforcement-build/005-d5-cross-cli-survival/003-design-dispatch-manifest"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Mark T001-T016 and completion criteria complete with evidence"
    next_safe_action: "Regenerate description.json and graph-metadata.json"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/shared/context_loading_contract.md"
      - ".opencode/skills/cli-codex/SKILL.md"
      - ".opencode/skills/cli-claude-code/SKILL.md"
      - ".opencode/skills/cli-opencode/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "d5-r3-impl"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: D5-R3 — DESIGN_DISPATCH_MANIFEST v1 schema + Gate-3 present-or-ASK pass-through

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path) [effort]`

<!-- /ANCHOR:notation -->
---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

Ground the schema home, the present-or-ASK model, and the reconciliation boundary before authoring.

- [x] T001 Re-read the CONTEXT MANIFEST + register-first gate + Register And Dials sections; list the vocabulary the new section reuses rather than re-clones (`.opencode/skills/sk-design/shared/context_loading_contract.md`) [10m] — §7 reuses §3 task-type set + Register And Dials shape
- [x] T002 [P] Re-read the Gate-3 spec-folder pass-through ALWAYS rule in each cli-* as the present-or-ASK model to clone (`.opencode/skills/cli-opencode/SKILL.md`, `.opencode/skills/cli-codex/SKILL.md`, `.opencode/skills/cli-claude-code/SKILL.md`) [10m] — present + pre-approved / else ASK shape cloned
- [x] T003 [P] Re-read the landed `Design Standards Loading` ALWAYS rule (the insertion anchor) and the return-path contract's parent-dispatch-manifest digest field (the reconcile target) (`.opencode/skills/mcp-open-design/references/cli_child_pairing.md`) [10m] — anchor matched by content; `designManifestDigest` is the reconcile target
- [x] T004 Capture cli-opencode concurrency state and classify each cli-* target clean or dirty (`git status`) [5m] — cli-opencode DIRTY (GLM WIP); cli-codex / cli-claude-code clean

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

Author the schema in its lowest-duplication home, then append the present-or-ASK pass-through to the three cli-* (append-only, clean files first).

### Schema (lowest-duplication home)
- [x] T005 Add the `DESIGN DISPATCH MANIFEST` section with the `DESIGN_DISPATCH_MANIFEST v1` field table: `version`, `surface`, `taskType`, `skDesignLoaded`, `workflowModes`, `register`, `dials`, `loadedFiles`, `proofDemandBack` (`.opencode/skills/sk-design/shared/context_loading_contract.md`) [25m] — `## 7.` field table (lines 164-174), all 9 fields present
- [x] T006 State the validity rules: `workflowModes` registry-valid + non-empty, `register` resolved (never `unknown`), `skDesignLoaded` true, `loadedFiles` non-empty (`context_loading_contract.md`) [10m] — validity-rules list (lines 178-185); `unknown` not dispatchable
- [x] T007 Add the inline-payload rule + the digest-reconcile note: the manifest travels in the payload (not a path the child resolves) and its digest is reconciled on the return path; reference the proof-token `loadedFiles` convention and the mode-registry, do not redefine them (`context_loading_contract.md`) [15m] — inline note + `designManifestDigest` reconcile (line 187); proof-token + mode-registry cited

### Present-or-ASK pass-through (append-only across 3 cli-*)
- [x] T008 Insert the manifest pass-through ALWAYS rule after the `Design Standards Loading` content anchor; renumber trailing items by digit only (`.opencode/skills/cli-claude-code/SKILL.md`) [10m] — item 11 (line 356); trailing items renumbered
- [x] T009 Insert the same rule after the `Design Standards Loading` content anchor; renumber trailing items by digit only (`.opencode/skills/cli-codex/SKILL.md`) [10m] — item 13 (line 361); trailing items renumbered
- [x] T010 Insert the same rule into the DIRTY target: re-confirm the anchor by content, do NOT bulk-stage, isolate the manifest hunk from GLM WIP (`.opencode/skills/cli-opencode/SKILL.md`) [15m] — item 14 stacked on GLM WIP; 3 glm/zai markers intact (13 → 27 lines)

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### Schema checks
- [x] T011 Verify all required fields + validity rules are present and the `DESIGN_DISPATCH_MANIFEST` block name is a stable, lint-findable token (`context_loading_contract.md`) [10m] — 9 fields + 6 validity rules; block name grep-findable
- [x] T012 Verify the manifest carries the `Design Standards Loading` resolution (skDesignLoaded/modes/register/dials/loadedFiles) and that its digest is the field the return-path contract reconciles (`context_loading_contract.md`) [10m] — load-time resolution carried; digest = return-path `designManifestDigest` (line 187)

### Pass-through + boundary checks
- [x] T013 Verify all three cli-* carry the manifest rule and that a missing manifest maps to ASK, not a silent launch (`grep -c "DESIGN_DISPATCH_MANIFEST"` >= 1 per file) [5m] — grep -c = 1 each; explicit ASK branch in every rule
- [x] T014 Verify each cli-* `git diff` is exactly the inserted rule + the declared renumber; confirm no GLM hunk is clobbered and no other `ALWAYS rule N` cross-reference breaks [10m] — cli-codex/cli-claude-code clean hunk; cli-opencode rule stacked, GLM WIP intact
- [x] T015 Verify the residual is named (unmodifiable child ignoring the inlined manifest → parent-side floor only) and not overstated as a deterministic guarantee [5m] — residual paragraph (line 189) names parent-side floor; no deterministic guarantee claimed
- [x] T016 Verify evergreen: no spec/packet/phase/ADR/REQ/task/finding ID and no spec path in the deliverable section or the inserted rule [5m] — evergreen grep over the deliverable returned nothing

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Schema + validity rules + present-or-ASK pass-through all authored
- [x] Reconciled with the landed `Design Standards Loading` rule and the return-path digest field
- [x] Residual named; evergreen and append-only/no-clobber verified
- [x] Checklist.md fully verified

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`

<!-- /ANCHOR:cross-refs -->

---

<!--
LEVEL 2 TASKS (~110 lines)
- Core + Level 2 detail (effort estimates + explicit verification tasks)
- Deliverable: one additive schema section + three append-only cli-* ALWAYS-rule insertions
- The static token lint + fixtures are the sibling fixture phase, not this one
-->
