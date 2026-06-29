---
title: "Verification Checklist: D5-R3 — DESIGN_DISPATCH_MANIFEST v1 schema + Gate-3 present-or-ASK pass-through"
description: "Acceptance and verification gates for the dispatch-manifest schema and the append-only present-or-ASK pass-through across the 3 cli-* SKILLs."
trigger_phrases:
  - "d5-r3 design dispatch manifest checklist"
  - "manifest schema acceptance"
  - "present-or-ask pass-through verification"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/039-design-enforcement-build/005-d5-cross-cli-survival/003-design-dispatch-manifest"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Verify all P0/P1/P2 checks; recompute counts"
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
# Verification Checklist: D5-R3 — DESIGN_DISPATCH_MANIFEST v1 schema + Gate-3 present-or-ASK pass-through

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

- [x] CHK-001 [P0] Lowest-duplication home fixed before authoring: the schema lives in `context_loading_contract.md` because it reuses the existing CONTEXT MANIFEST / register / dials vocabulary
  - **Evidence**: §7 reuses the §3 task-type set + Register And Dials shape; the plan home-decision table rejects the return-path contract and a new file as higher-duplication
- [x] CHK-002 [P1] Present-or-ASK model captured: the Gate-3 spec-folder pass-through rule is read in each cli-* as the shape to clone
  - **Evidence**: the manifest rule mirrors the present + pre-approved / else ASK branch — explicit ASK when sk-design not loaded / register unresolved / no registry-valid mode
- [x] CHK-003 [P1] Concurrency state confirmed: `cli-opencode/SKILL.md` is under live GLM edits; the other two are clean
  - **Evidence**: `git status` classified cli-opencode DIRTY (GLM WIP) and cli-codex / cli-claude-code clean; captured in plan dependencies + enhanced-rollback

<!-- /ANCHOR:pre-impl -->
---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] The schema defines `DESIGN_DISPATCH_MANIFEST v1` with all required fields: `surface`, `taskType`, `skDesignLoaded`, `workflowModes`, `register`, `dials`, `loadedFiles`, `proofDemandBack`
  - **Evidence**: field table in `context_loading_contract.md` lines 164-174 lists all 9 fields with type + meaning
- [x] CHK-011 [P0] The validity rules are stated and enforceable at dispatch: `workflowModes` registry-valid + non-empty, `register` resolved (never `unknown`), `skDesignLoaded` true, `loadedFiles` non-empty
  - **Evidence**: validity-rules list (lines 178-185) + "A manifest that fails any validity rule is not dispatchable. The parent ASKs" (line 185)
- [x] CHK-012 [P0] The manifest names what design context, standards, and proof the child must carry: context = `loadedFiles`; standards = `skDesignLoaded`/`workflowModes`/`register`/`dials`; proof = `proofDemandBack`
  - **Evidence**: `loadedFiles` (line 173), `skDesignLoaded`/`workflowModes`/`register`/`dials` (lines 169-172), `proofDemandBack` (line 174) — all three obligations mapped
- [x] CHK-013 [P1] The schema reuses, not re-clones, the proof-token `loadedFiles` `{path, sha256}` convention and the mode-registry mode set by reference
  - **Evidence**: line 173 cites "the proof-token loadedFiles convention by reference"; line 170 validates `workflowModes` "against `mode-registry.json`" — neither redefined

<!-- /ANCHOR:code-quality -->
---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] The block name `DESIGN_DISPATCH_MANIFEST` is a stable, lint-findable token so a static lint can assert its presence + required fields in dispatch payloads
  - **Evidence**: `grep -n "DESIGN_DISPATCH_MANIFEST"` finds `## 7.` at line 160; the 9 field names are enumerable in the table
- [x] CHK-021 [P0] All three cli-* SKILLs carry the present-or-ASK manifest pass-through rule
  - **Evidence**: `grep -c "DESIGN_DISPATCH_MANIFEST"` returns 1 in cli-codex (line 361), cli-claude-code (line 356), and cli-opencode (item 14)
- [x] CHK-022 [P0] A dispatch missing the manifest triggers an ASK rather than a silent launch
  - **Evidence**: each rule states "If the manifest cannot be assembled — `sk-design` not loaded, register unresolved, or no registry-valid mode — ASK before launching the child rather than starting a silent design dispatch"
- [x] CHK-023 [P1] The manifest travels INLINE in the payload, not as a path the child resolves
  - **Evidence**: rule says "the child cannot resolve skill paths, so the manifest travels in the payload, not by reference"; section line 187 states inline-payload carry

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Finding class identified: this is the structured-carry layer between the load-time safety net and the return-path receipt, not a one-off field add
  - **Evidence**: the manifest carries the `Design Standards Loading` resolution forward and feeds the return-path digest reconcile — documented as the request-path half of the cross-CLI survival spine in the implementation-summary
- [x] CHK-FIX-002 [P0] Reconciled with both landed D5 pieces: it carries the `Design Standards Loading` resolution and its digest is the parent-dispatch-manifest digest the return-path contract already reconciles
  - **Evidence**: `skDesignLoaded`/`workflowModes`/`register`/`dials`/`loadedFiles` mirror the load-time resolution; line 187 ties the manifest digest to the return-path `designManifestDigest`
- [x] CHK-FIX-003 [P1] Consumer integrity preserved: the static token lint + fixtures are named as the downstream consumer, not built here; no fixture harness is added this phase
  - **Evidence**: the sibling static-token-lint / route-replay-fixture phase is named as the consumer; scope held to the schema section + the three cli-* present-or-ASK rules (4 files)

<!-- /ANCHOR:fix-completeness -->
---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] The residual is named: an unmodifiable child CLI that ignores the inlined manifest is covered only by the parent-side floor (present-or-ASK gate + return-path demand-back)
  - **Evidence**: line 189 — "an unmodifiable child CLI may ignore an inlined manifest. The enforceable floor is parent-side"; the child is not claimed forceable
- [x] CHK-031 [P0] The residual is not overstated: no deterministic guarantee is claimed over an unmodifiable child or a child that cannot resolve skill paths
  - **Evidence**: spec.md RISKS + impl-summary limitation 1-2 state the path-resolvability ceiling (inline-only) with parent demand-back as the only deterministic floor
- [x] CHK-032 [P1] `register=unknown` is rejected at dispatch (no design launch on an unresolved register)
  - **Evidence**: validity rule line 179 — "`register` is resolved to `Brand` or `Product`; `unknown` is not dispatchable"; the rule routes to ASK

<!-- /ANCHOR:security -->
---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P0] The schema section is additive in `context_loading_contract.md` and extends, rather than duplicates, the existing CONTEXT MANIFEST vocabulary
  - **Evidence**: `## 7. DESIGN DISPATCH MANIFEST` (line 160) sits after the final existing section and reuses the §3 CONTEXT MANIFEST task-type set + Register And Dials shape by name
- [x] CHK-041 [P1] The cli-* rule references the manifest contract for the parent and inlines the block for the child; it does not redefine the schema in each SKILL
  - **Evidence**: the rule names `DESIGN_DISPATCH_MANIFEST v1` and lists its fields inline without re-tabling the full schema in any SKILL
- [x] CHK-042 [P2] spec.md / plan.md / tasks.md / checklist.md remain synchronized on the target set and the residual
  - **Evidence**: all four docs name the same schema home (`context_loading_contract.md`), the same three cli-* targets, the 4-file scope, and the same unmodifiable-child residual

<!-- /ANCHOR:docs -->
---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P0] Evergreen: the deliverable section + the inserted cli-* rule carry no spec/packet/phase/ADR/REQ/task/finding ID and no spec path
  - **Evidence**: `grep -nE "specs/|packet|phase[ -]|ADR-|REQ-|finding|154-|039-|005-|003-"` over the §7 section + the three inserted rules returned nothing
- [x] CHK-051 [P0] Append-only / no-clobber held: each cli-* diff is exactly the inserted rule + the declared renumber; the GLM WIP in cli-opencode is untouched and staged by explicit path only
  - **Evidence**: cli-codex / cli-claude-code `git diff` = one added rule + single-digit renumbers; cli-opencode rule stacked on GLM WIP, 3 glm/zai markers intact (GLM diff 13 → 27 lines, pure addition); `cli_reference.md` GLM row excluded

<!-- /ANCHOR:file-org -->
---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 14 | 14/14 |
| P1 Items | 7 | 7/7 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-06-29
**Verified By**: markdown-agent (orchestrator-confirmed grep + git diff evidence)

<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
Status complete: all items verified with build-time evidence (grep + git diff)
-->
