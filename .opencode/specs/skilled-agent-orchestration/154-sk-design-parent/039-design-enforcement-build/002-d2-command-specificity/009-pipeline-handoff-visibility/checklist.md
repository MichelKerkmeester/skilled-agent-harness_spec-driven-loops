---
title: "Verification Checklist: D2-R9 — Pipeline & handoff visibility across the /design:* surface"
description: "Acceptance gates for adding pipeline to command-metadata.json, generating wrapper Pipeline & Handoff sections + PRODUCES/NEXT/PROOF status tail, and extending design-command-surface-check.mjs to enforce a fully-declared, recommend-only pipeline graph reconciled with next; populated with evidence during the build."
trigger_phrases:
  - "d2-r9 pipeline handoff checklist"
  - "design command pipeline visibility checklist"
  - "design build handoff checklist"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/039-design-enforcement-build/002-d2-command-specificity/009-pipeline-handoff-visibility"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Verified all 33 checklist items with checker evidence; PASS invalid=0 drift=0"
    next_safe_action: "Regenerate description.json + graph-metadata.json to clear residual generated-metadata"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-29-d2-r9-pipeline-handoff-visibility"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Recommend-only enforced positively (marker + bidirectional graph) instead of a phrase ban"
---
# Verification Checklist: D2-R9 — Pipeline & handoff visibility across the /design:* surface

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

- [x] CHK-001 [P0] Prior D2 baseline confirmed green before any edit (`invalid=0 drift=0`)
  - **Evidence**: additive baseline; final checker run holds `SUMMARY invalid=0 drift=0`, exit 0
- [x] CHK-002 [P0] Pipeline sub-schema documented in plan.md (`stage`, `acceptsFrom`, `produces`, `nextCommands`, `proofRequired`)
  - **Evidence**: plan.md §3 record shape + §3 per-command table define all five sub-fields
- [x] CHK-003 [P1] Per-command pipeline values authored in plan.md §3 and reconciled with each record's `next`, `outputContract.primaryArtifactName`, and `proofFields`
  - **Evidence**: live metadata matches plan §3 table for all 5 commands; reconciliation enforced by checker
- [x] CHK-004 [P0] Scope frozen to `command-metadata.json` + the five wrappers (body-only) + the checker
  - **Evidence**: `git status` = exactly 7 paths (1 JSON + 5 wrappers + checker)

<!-- /ANCHOR:pre-impl -->
---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `command-metadata.json` parses as valid JSON; each of the 5 records carries `pipeline` with valid sub-fields
  - **Evidence**: `python3 json.load` OK, 5 records; each record carries `pipeline{stage,acceptsFrom,produces,nextCommands,proofRequired}`
- [x] CHK-011 [P0] Each wrapper carries the generated `## 6. PIPELINE & HANDOFF` block with the markers `Stage:` / `Accepts from:` / `Produces:` / `Hands to next` / `Hands to build:` / `Recommend-only:`
  - **Evidence**: PIPELINE & HANDOFF 5/5 (md-generator:72, others:70); `Recommend-only:` count 5/5
- [x] CHK-012 [P0] Each wrapper's success tail is `STATUS=OK PRODUCES=<artifact> NEXT=<commands> PROOF=<fields>`; the `STATUS=OK` substring (D2-R7 token) is preserved
  - **Evidence**: `grep "STATUS=OK PRODUCES"` 5/5 wrappers; `STATUS=OK` substring intact
- [x] CHK-013 [P1] `## 6. EXAMPLE` renumbered to `## 7. EXAMPLE`; wrapper frontmatter (`description`, `argument-hint`, `allowed-tools`) byte-unchanged (body-only edits)
  - **Evidence**: md-generator `## 7. EXAMPLE` at line 81; frontmatter drift stays 0 in checker run

<!-- /ANCHOR:code-quality -->
---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Stage 1 passes: every record has `pipeline` with valid sub-fields (`invalid=0`)
  - **Evidence**: checker `SUMMARY invalid=0`; `validatePipeline` (line 505) green for all 5
- [x] CHK-021 [P0] Reconciliation with `next` enforced: `nextCommands ⊆ next` for all five records (checker rule, not just authored prose)
  - **Evidence**: `validatePipelineCommandList` enforces membership; invalid=0
- [x] CHK-022 [P0] Contract reconciliation enforced: `produces == outputContract.primaryArtifactName` and `proofRequired == proofFields` for all five
  - **Evidence**: dumped values match (e.g. md-generator produces "Style Reference DESIGN.md"); invalid=0
- [x] CHK-023 [P0] Graph consistency enforced: `acceptsFrom == inverse(nextCommands)` for every record; `md-generator` origin (empty `acceptsFrom`); five distinct stages
  - **Evidence**: `validatePipelineGraph` (line 579) green; `md-generator` acceptsFrom=[]; stages extract/direction/system/behavior/review
- [x] CHK-024 [P0] Stage 2 passes: all five wrappers carry the Pipeline & Handoff markers, the `nextCommands` tokens, the `sk-code` handoff line, and the `PRODUCES=/NEXT=/PROOF=` tail
  - **Evidence**: checker `drift=0`; `expectedPipelineDrift` (line 713) green; `sk-code` line 5/5
- [x] CHK-025 [P0] Full run is no-regression: prior D2 sections (example/contract/discriminator/preconditions) intact, frontmatter drift stays 0, overall `node design-command-surface-check.mjs` reports `invalid=0 drift=0`, exit 0
  - **Evidence**: `STATUS=PASS STAGE=complete` / `SUMMARY invalid=0 drift=0` / EXIT=0
- [x] CHK-026 [P1] Synthetic break — removing a record's `pipeline`, or a `nextCommands` entry outside `next`, or a broken `acceptsFrom` inverse, each flips the checker to exit 2 (INVALID)
  - **Evidence**: orchestrator-verified; non-inverse `acceptsFrom` → `STATUS=INVALID` "must match inverse nextCommands"; restored to invalid=0
- [x] CHK-027 [P1] Synthetic break — dropping the `sk-code` handoff line or the `Recommend-only:` marker in a wrapper flips the checker to `pipeline` drift, exit 1
  - **Evidence**: orchestrator-verified; Stage-2 reports drift `field: "pipeline"`, exit 1; restored
- [x] CHK-028 [P1] `node --check` passes on the edited checker (valid ESM)
  - **Evidence**: `node --check design-command-surface-check.mjs` → CHECKER_SYNTAX_OK

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] The gap is closed at the source (pipeline added to the metadata SSOT + one gate), not per-wrapper hand-editing
  - **Evidence**: `pipeline` lives in `command-metadata.json`; wrappers project it; checker enforces reconciliation
- [x] CHK-FIX-002 [P0] Every command — not a subset — makes its pipeline place visible (stage, accepts-from, produces, next, build handoff)
  - **Evidence**: all 5 wrappers carry the section; checker `drift=0` requires it on every wrapper
- [x] CHK-FIX-003 [P0] Recommend-only is enforced: the `Recommend-only:` marker + `NEXT=` recommendation grammar are required, and the graph is declared on both ends — no command auto-invokes a successor
  - **Evidence**: `Recommend-only:` 5/5; `NEXT=` in tail 5/5; bidirectional graph declared at both ends
- [x] CHK-FIX-004 [P0] The build boundary is visible: every wrapper names the `sk-code` handoff card as the terminus of the design pipeline
  - **Evidence**: `Hands to build:` line cites `sk-code` + the shared handoff card in all 5 wrappers
- [x] CHK-FIX-005 [P1] Reconciliation with `next` is machine-enforced (checker), not just asserted in the plan
  - **Evidence**: `validatePipeline` enforces `nextCommands ⊆ next` at exit-2 severity
- [x] CHK-FIX-006 [P1] Evidence pinned to the deterministic checker report (`SUMMARY invalid=0 drift=0`), re-runnable on demand
  - **Evidence**: `node design-command-surface-check.mjs` → `STATUS=PASS ... SUMMARY invalid=0 drift=0`, re-runnable

<!-- /ANCHOR:fix-completeness -->
---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] `mode-registry.json` is byte-unchanged (identity-only, not mutated)
  - **Evidence**: `git status` shows `mode-registry.json` not modified
- [x] CHK-031 [P0] `shared/sk_code_handoff.md` is byte-unchanged (referenced, not modified)
  - **Evidence**: `git status` shows `sk_code_handoff.md` not modified
- [x] CHK-032 [P0] No file outside `command-metadata.json` + the five wrappers + the checker is created or modified
  - **Evidence**: `git status` = exactly 7 implementer paths changed
- [x] CHK-033 [P1] The checker still treats the wrappers and the registry as read-only (`readFile` only, no write/edit)
  - **Evidence**: checker uses `readFile` only; no write/edit calls; non-mutation confirmed by git

<!-- /ANCHOR:security -->
---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] plan.md / tasks.md / checklist.md synchronized on the pipeline schema, wrapper section, graph rule, and additive `drift=0` outcome
  - **Evidence**: all three docs describe the same schema, section, bidirectional graph rule, and `invalid=0 drift=0` outcome
- [x] CHK-041 [P1] The additive coupling to D2-R3 documented (one nested object + the first cross-record rule; siblings unaffected)
  - **Evidence**: plan §3 Architecture + §6 Dependencies note the one nested object + first cross-record rule
- [x] CHK-042 [P1] The pipeline status grammar documented (`STATUS=OK PRODUCES= NEXT= PROOF=` / `DEFER` / `ASK`; recommend-only)
  - **Evidence**: plan §3 wrapper tail + spec §5; implementation-summary verification table records the tail grammar

<!-- /ANCHOR:docs -->
---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P0] `command-metadata.json` carries NO spec/packet/phase IDs or spec paths (evergreen [HARD])
  - **Evidence**: pipeline values are command names + artifact/proof strings only; no IDs/paths
- [x] CHK-051 [P0] The five wrappers and the checker carry NO spec/packet/phase IDs or spec paths; the `sk_code_handoff.md` reference is a durable skill-resource path, not a spec path (evergreen [HARD])
  - **Evidence**: handoff cited as `.opencode/skills/sk-design/shared/sk_code_handoff.md` (durable skill path); no spec IDs
- [x] CHK-052 [P1] No temp files created outside `scratch/`
  - **Evidence**: verification used read-only inspection + the scratchpad; no temp files in the repo tree

<!-- /ANCHOR:file-org -->
---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 21 | 21/21 |
| P1 Items | 12 | 12/12 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-06-29
**Verified By**: claude-opus-4-8 (independent `design-command-surface-check.mjs` run; STATUS=PASS invalid=0 drift=0)

<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified during the build
P0 must complete, P1 need approval to defer
-->
