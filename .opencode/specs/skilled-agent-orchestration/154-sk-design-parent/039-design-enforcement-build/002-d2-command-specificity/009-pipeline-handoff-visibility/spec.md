---
title: "D2-R9 — Pipeline & handoff visibility across the five /design:* commands"
description: "Add pipeline{stage,acceptsFrom,produces,nextCommands,proofRequired} to command-metadata.json, project a Pipeline & Handoff section + PRODUCES/NEXT/PROOF tail in the five wrappers, and enforce a recommend-only, bidirectionally-consistent pipeline graph in design-command-surface-check.mjs."
trigger_phrases:
  - "d2-r9 pipeline handoff"
  - "pipeline handoff design build"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/039-design-enforcement-build/002-d2-command-specificity/009-pipeline-handoff-visibility"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Upgraded spec to Level 2; recorded graph invariant + recommend-only decision; status complete"
    next_safe_action: "Regenerate description.json + graph-metadata.json to clear residual generated-metadata"
    blockers: []
    key_files:
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-29-d2-r9-pipeline-handoff-visibility"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Recommend-only enforced positively (marker + bidirectional graph) instead of a brittle phrase ban"
---
# Feature Specification: D2-R9 — Pipeline & handoff visibility across the five /design:* commands

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-28 |
| **Completed** | 2026-06-29 |
| **Branch** | `009-pipeline-handoff-visibility` |
| **Dimension** | D2 — Command Specificity |
| **Enforcement class** | hybrid |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The five `/design:*` commands gave no handoff visibility. The flow `md-generator -> interface/foundations -> motion -> audit -> sk-code` lived only in routing data (`mode-registry.json`) and child packets (`design-md-generator/SKILL.md`), so a user invoking a single command could not see what it accepts, produces, or recommends next, and the design->build boundary was invisible at the command layer.

### Purpose
Make each command's pipeline place legible and machine-checked: it declares its stage, upstream sources, produced artifact, recommend-only next commands, and the `sk-code` build handoff, with no command silently chaining to a successor.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add `pipeline{ stage, acceptsFrom, produces, nextCommands, proofRequired }` to all five records in `command-metadata.json`.
- Project a `## 6. PIPELINE & HANDOFF` section + a `STATUS=OK PRODUCES= NEXT= PROOF=` tail into the five `commands/design/*.md` wrappers (body-only).
- Extend `design-command-surface-check.mjs` with `validatePipeline`, a cross-record `validatePipelineGraph`, and a Stage-2 pipeline body channel.

### Out of Scope
- `mode-registry.json` — read-only `workflowMode` source; not mutated.
- `shared/sk_code_handoff.md` — referenced as the build terminus; not modified.
- Wrapper frontmatter (`description`, `argument-hint`, `allowed-tools`) — frozen so existing drift stays 0.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-design/command-metadata.json` | Modify | Add `pipeline{}` to all 5 records |
| `.opencode/commands/design/{md-generator,interface,foundations,motion,audit}.md` | Modify | Add PIPELINE & HANDOFF section + upgrade OK tail (body-only) |
| `.opencode/skills/sk-design/shared/scripts/design-command-surface-check.mjs` | Modify | Add pipeline validation + bidirectional graph rule + Stage-2 body channel |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every record carries a valid `pipeline` reconciled with existing fields | `nextCommands ⊆ next`, `produces == outputContract.primaryArtifactName`, `proofRequired == proofFields` for all 5; checker `invalid=0` |
| REQ-002 | The pipeline graph is bidirectionally consistent | `acceptsFrom == inverse(nextCommands)` for every record; `md-generator` origin; five distinct stages; checker enforces it |
| REQ-003 | Every wrapper exposes its pipeline place + recommend-only handoff | PIPELINE & HANDOFF section with all markers, `nextCommands` tokens, `sk-code` line, `Recommend-only:` marker, and `PRODUCES=/NEXT=/PROOF=` tail; checker `drift=0` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | No regression on prior D2 surface | Frontmatter drift stays 0; prior sections intact; overall `invalid=0 drift=0`, exit 0 |
| REQ-005 | Strictly additive non-mutation | `mode-registry.json` + `shared/sk_code_handoff.md` byte-unchanged; exactly 7 files changed |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `node design-command-surface-check.mjs` reports `STATUS=PASS ... invalid=0 drift=0`, exit 0.
- **SC-002**: A synthetic break (non-inverse `acceptsFrom`, out-of-`next` nextCommand, dropped `sk-code` line, or removed `Recommend-only:` marker) flips the checker to a non-zero exit.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `command-metadata.json` SSOT (`next`, `outputContract`, `proofFields`) | Reconciliation anchors must be present | D2-R2..R7 landed; checker verifies reconciliation deterministically |
| Dependency | `shared/sk_code_handoff.md` | Build terminus referenced by every wrapper | Referenced by durable skill path, never mutated |
| Risk | Bidirectional graph rule rigidity | A future `/design:*` command must declare edges on both ends or the checker fails | Intended strictness — the **bidirectional-graph invariant** (`acceptsFrom == inverse(nextCommands)`) makes every handoff edge visible at both nodes, so silent drift is impossible |
| Risk | Recommend-only mis-enforced as a phrase ban | A banned-phrase scan would false-positive on the section's own negative assertions | Enforce positively: a required `Recommend-only:` marker + a fully-declared graph prove no auto-invoke, instead of scanning for forbidden words |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Determinism
- **NFR-D01**: The surface gate is deterministic and re-runnable on demand; output is sorted and stable.

### Evergreen
- **NFR-E01**: No spec/packet/phase ID or spec-folder path appears in the metadata, the wrappers, or the checker; the `sk_code_handoff.md` reference is a durable skill-resource path.

### Additivity
- **NFR-A01**: All changes are additive; the prior D2 baseline (`invalid=0 drift=0`) is preserved.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Graph Boundaries
- Origin command: `md-generator` carries `acceptsFrom: []` and is still a valid node.
- Missing edge: an `acceptsFrom` that is not the exact inverse of the others' `nextCommands` -> Stage 1 INVALID (exit 2).
- Out-of-`next` recommendation: a `nextCommands` entry absent from `next` -> Stage 1 INVALID (exit 2).

### Surface Boundaries
- Wrapper missing the section, a marker, a `nextCommands` token, the `sk-code` line, or the status tail -> Stage 2 drift `field: "pipeline"` (exit 1).
- Frontmatter touched -> existing frontmatter-drift gate fires (exit 1).
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | 7 files: 1 JSON SSOT, 5 wrappers (body-only), 1 checker |
| Risk | 12/25 | First cross-record rule; additive, frontmatter frozen, no live mutation outside scope |
| Research | 8/20 | Pipeline shape pre-authored in plan §3 from research §5 |
| **Total** | **34/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None remaining. The recommend-only-vs-phrase-ban question is resolved: recommend-only is enforced positively (marker + bidirectional graph), recorded in RISKS above.
<!-- /ANCHOR:questions -->

---

<!--
LEVEL 2 SPEC
- Core + Level 2 addendum (NFR, edge cases, complexity)
- D2-R9: pipeline metadata + wrapper sections + bidirectional graph checker; strictly additive, final surface-check invalid=0 drift=0
-->
