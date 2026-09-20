---
title: "Implementation Plan: alignment render-pipeline parity + ai-council fix flip"
description: "Register /deep:alignment into the compiled-contract render pipeline and flip alignment + ai-council to fix injection mode."
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
    recent_action: "Implemented and verified alignment pipeline parity + ai-council fix flip"
    next_safe_action: "Proceed to child 002"
---
# Implementation Plan: alignment render-pipeline parity + ai-council fix flip

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CommonJS runtime scripts + markdown/JSON assets |
| **Framework** | system-deep-loop command render pipeline |
| **Storage** | Compiled contracts + rollout JSON under `.opencode/commands/deep/assets` |
| **Testing** | `check-contract-drift.cjs`, `validate_document.py`, `validate.sh --strict` |

### Overview
Add `/deep:alignment` into the compiled-contract render pipeline its siblings already use, then flip `alignment` and `ai-council` to `fix`. The pipeline is fixed and proven; this phase registers a new command into it and refreshes stale peer contracts. It does not redesign any script.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Compile / drift / render scripts read directly to derive the constraints.
- [x] Marker convention chosen from the ai-council/review siblings.
- [x] Native-only tool surface confirmed against the command frontmatter.

### Definition of Done
- [x] alignment contract generated + drift-clean.
- [x] alignment + ai-council in `fix` mode, rendering with the contract injected.
- [x] All 7 deep commands pass create-command conformance.

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Thin command router → `render-command-contract.cjs` → `fix` mode injects `compiled/<slug>.contract.md` ahead of `legacy/<slug>.body.md`; `fallback` returns the legacy body only.

### Key Components
- **compile-command-contracts.cjs**: the COMMANDS map; `buildRenderBlocks` lifts two verbatim presentation slices via `renderMarkers`.
- **check-contract-drift.cjs**: imports COMMANDS from the compiler; guards `UNRESOLVED_MARKERS`, `TOOL_ALLOWLIST_OVERFLOW`, `ENUMERATED_SOURCE_GAP`, `STALE_*`.
- **render-command-contract.cjs**: `assertCompiledContractFresh` throws on any drift in `fix` mode.
- **command-injection-rollout.json**: per-command injection mode.

### Data Flow
The compiler reads the presentation + authority chain, emits a hashed contract; the renderer resolves the injection mode, asserts freshness, and concatenates the contract with the legacy body.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Read the compile/drift/render scripts and the alignment YAMLs.
- [x] Choose marker headings + native-only tool set.

### Phase 2: Core Implementation
- [x] Author the presentation, register alignment, generate the contract.
- [x] Refresh the stale peer contracts (body-identical), flip the rollout.
- [x] Update the legacy body owned-assets.

### Phase 3: Verification
- [x] Full drift sweep, render smoke, command conformance, strict validation.

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Contract drift | All 4 registered commands | `node check-contract-drift.cjs` |
| Render smoke | alignment + ai-council in `fix` | `renderCommandContract` with `writeManifest:false` |
| Command conformance | All 7 deep commands | `validate_document.py --type command` |
| Spec validation | This child | `validate.sh --strict` |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Existing render pipeline scripts | Internal | Green | No path to register a new command |
| `mode-registry.json` shared source | Internal | Green | Registry edits re-stale every contract |

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: alignment or ai-council render refuses, or drift fails.
- **Procedure**: Revert the rollout JSON entries to `fallback` and restore the contract/asset files from git; the additions are reversible by deletion.

<!-- /ANCHOR:rollback -->
---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core Implementation |
| Core Implementation | Setup | Verification |
| Verification | Core Implementation | None |

<!-- /ANCHOR:phase-deps -->
---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Medium | 40 minutes |
| Core Implementation | Medium | 50 minutes |
| Verification | Low | 20 minutes |
| **Total** | | **110 minutes** |

<!-- /ANCHOR:effort -->
---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Peer-contract refresh proven body-identical.
- [x] Render smoke used `writeManifest:false` (no manifest pollution).

### Rollback Procedure
1. Set the two flipped rollout entries back to `fallback`.
2. `git checkout` the compiled contracts and the presentation/legacy-body assets.
3. Re-run `check-contract-drift.cjs` to confirm the baseline.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A — doc/asset/config additions only.

<!-- /ANCHOR:enhanced-rollback -->
