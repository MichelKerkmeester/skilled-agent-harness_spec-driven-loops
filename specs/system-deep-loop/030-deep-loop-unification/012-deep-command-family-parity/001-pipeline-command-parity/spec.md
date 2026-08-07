---
title: "Feature Specification: alignment render-pipeline parity + ai-council fix flip"
description: "Give /deep:alignment full render-pipeline parity — a 4-section presentation asset, registration in the contract compiler and drift checker, a real generated compiled contract, fix injection mode, and updated legacy owned-assets — and flip /deep:ai-council from fallback to fix so its generated contract is injected at render time."
trigger_phrases:
  - "deep alignment render pipeline parity"
  - "compile-command-contracts deep alignment"
  - "ai-council fix rollout flip"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/030-deep-loop-unification/012-deep-command-family-parity/001-pipeline-command-parity"
    last_updated_at: "2026-07-13T14:15:00Z"
    last_updated_by: "claude"
    recent_action: "WS1 (alignment pipeline parity) + WS2 (ai-council fix flip) implemented and verified"
    next_safe_action: "Proceed to child 002 (convert the two direct-dispatch commands to yaml-backed)"
---
# Feature Specification: alignment render-pipeline parity + ai-council fix flip

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
| **Created** | 2026-07-13 |
| **Branch** | `wt/0036-deep-command-family-parity` |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`/deep:alignment` is the only render-pipeline sibling that never joins the compiled-contract path. Its compiled contract was a 7-line hand-written placeholder that self-declared "NOT machine-generated"; it had no presentation asset and was absent from the `compile-command-contracts.cjs` / `check-contract-drift.cjs` COMMANDS maps. With no rollout entry, `resolve-injection-mode.cjs`'s `DEFAULT_MODE` of `fallback` applied and only the legacy body rendered. `/deep:ai-council` already had a generated contract but was pinned to `fallback`, so that contract was compiled and hashed yet never injected.

### Purpose
Register `deep/alignment` in the contract compiler with a `renderMarkers`-anchored presentation, generate its real compiled contract, and flip both `alignment` and `ai-council` to `fix` so the render pipeline injects the compiled contracts. `alignment` is a leaf-dispatch, native-only mode: its contract advertises only the tools its command frontmatter grants (no `Write`/`Edit`), and its setup does not advertise executor model/reasoning configurability the workflow never reads.

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `deep_alignment_presentation.txt`: a 4-section presentation whose three `renderMarkers` boundary headings match the ai-council/review family convention.
- `compile-command-contracts.cjs`: a `deep/alignment` COMMANDS entry cloning the `deep/review` leaf-dispatch shape, native-only tools.
- Generated `compiled/deep_alignment.contract.md` (replacing the placeholder).
- `command-injection-rollout.json`: add `deep/alignment: fix`; change `deep/ai-council` to `fix`.
- `legacy/deep_alignment.body.md` §2: owned-assets references the new presentation; fallback note dropped.

### Out of Scope
- `render-command-contract.cjs` — already registers `deep/alignment`; no change needed.
- Any change to alignment's runtime loop, YAML workflows, or the `@deep-alignment` agent's behavior.
- The two direct-dispatch conversions (successor phase `002-direct-dispatch-to-yaml`) and agent reconciliation (phase `003-deep-agent-family-reconciliation`).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/commands/deep/assets/deep_alignment_presentation.txt` | Create | 4-section presentation, family-convention markers |
| `.opencode/skills/system-deep-loop/runtime/scripts/compile-command-contracts.cjs` | Modify | Register `deep/alignment` |
| `.opencode/commands/deep/assets/compiled/deep_alignment.contract.md` | Regenerate | Real generated contract |
| `.opencode/skills/system-deep-loop/shared/rollout/command-injection-rollout.json` | Modify | alignment `fix`; ai-council `fix` |
| `.opencode/commands/deep/assets/legacy/deep_alignment.body.md` | Modify | Owned-assets references presentation |

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Presentation exists with 4 sections + exact `renderMarkers` headings | `buildRenderBlocks` extracts both slices without a `Missing marker` throw |
| REQ-002 | `:auto`/`:confirm` slices free of `[UPPERCASE]` bracket tokens | No `UNRESOLVED_MARKERS` in drift |
| REQ-003 | `sourcePaths` superset of `deriveAuthoritySources` | No `ENUMERATED_SOURCE_GAP` |
| REQ-004 | Contract `tools.allowed` subset of `alignment.md` frontmatter | No `TOOL_ALLOWLIST_OVERFLOW` |
| REQ-005 | Real contract generated, placeholder replaced | `GENERATED_COMMAND_CONTRACT_HEADER_START` present |
| REQ-006 | Rollout sets `deep/alignment: fix` and `deep/ai-council: fix` | `command-injection-rollout.json` |
| REQ-007 | Drift clean for all 4 registered commands | `check-contract-drift.cjs` exit 0 |
| REQ-008 | alignment + ai-council render in `fix` mode without throwing | `renderCommandContract` `mode=fix` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-009 | Legacy body §2 references the presentation; fallback note removed | OWNED ASSETS row present |
| REQ-010 | All 7 deep commands pass `validate_document.py --type command` | exit 0 each |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `node check-contract-drift.cjs` reports `OK commands=4` (exit 0).
- **SC-002**: `renderCommandContract` for alignment and ai-council returns `mode=fix` with the compiled contract injected, no throw.
- **SC-003**: `validate_document.py --type command` passes on all 7 deep commands.

### Acceptance Scenarios

- **Scenario 1**: **Given** the registered alignment command, **when** the compiler runs `--write`, **then** the placeholder is replaced by a machine-generated contract.
- **Scenario 2**: **Given** the fix rollout, **when** the renderer runs for alignment, **then** the freshness assertion passes and the contract is injected.
- **Scenario 3**: **Given** the stale peer contracts, **when** they are regenerated, **then** their stripped body is byte-identical and drift clears.

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A `[UPPERCASE]` token in a presentation slice | `UNRESOLVED_MARKERS` drift | Pre-checked both slices with the exact drift regex |
| Risk | Peer-contract refresh changing semantics | Silent contract drift | Proved stripped-body sha256 identical before/after |
| Dependency | `mode-registry.json` shared source | Any registry edit re-stales all contracts | Documented the recompile step in the legacy body |

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Contract compilation and drift checking complete in well under a second locally.

### Security
- **NFR-S01**: The alignment contract advertises only the read-only native tool surface; no `Write`/`Edit`.

### Reliability
- **NFR-R01**: Compilation is deterministic — same sources produce a byte-identical contract body.

<!-- /ANCHOR:nfr -->
---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Data Boundaries
- A presentation with a mis-typed marker heading fails at compile time with an explicit `Missing marker` error, not a silent bad contract.

### Error Scenarios
- A `fix`-mode command whose contract is stale makes the renderer refuse; the fix is a recompile, surfaced by `check-contract-drift.cjs`.

### Concurrent Operations
- The render smoke test uses `writeManifest:false` so verification never pollutes the committed `manifest.jsonl`.

<!-- /ANCHOR:edge-cases -->
---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | One command registered into an existing pipeline + a content asset |
| Risk | 10/25 | Additive registration + reversible mode flips; peer refresh proven body-identical |
| Research | 10/20 | Read the compile/drift/render scripts directly to derive the constraints |
| **Total** | **32/70** | **Level 2** |

<!-- /ANCHOR:complexity -->
---

<!-- ANCHOR:questions -->
## 9. OPEN QUESTIONS

- None. Marker convention, native-only tools, and leaf-dispatch shape are settled by reading the pipeline scripts directly.

<!-- /ANCHOR:questions -->
---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Implementation Summary**: See `implementation-summary.md`
- **Parent Spec**: See `../spec.md`

<!-- /ANCHOR:related-docs -->
