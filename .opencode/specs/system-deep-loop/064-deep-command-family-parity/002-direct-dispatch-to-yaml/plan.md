---
title: "Implementation Plan: convert the two direct-dispatch deep commands to yaml-backed"
description: "Apply the proven Lane A/B yaml-backed shape to skill-benchmark and ai-system-improvement, preserving the loop-host dispatch byte-for-byte."
trigger_phrases:
  - "deep direct dispatch to yaml"
  - "skill-benchmark ai-system-improvement yaml-backed"
  - "deep command workflow yaml conversion"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/064-deep-command-family-parity/002-direct-dispatch-to-yaml"
    last_updated_at: "2026-07-13T14:15:00Z"
    last_updated_by: "claude"
    recent_action: "Implemented and verified both conversions byte-identical"
    next_safe_action: "Proceed to child 003"
---
# Implementation Plan: convert the two direct-dispatch deep commands to yaml-backed

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Workflow YAML + presentation text + markdown command routers |
| **Framework** | system-deep-loop deep command family |
| **Storage** | Command assets under `.opencode/commands/deep/assets` |
| **Testing** | `loop-host.cjs planInvocation`, a real skill-benchmark run, `validate_document.py`, `validate.sh --strict` |

### Overview
Clone the yaml-backed shape the Lane A/B siblings already prove (`agent-improvement`, `model-benchmark` both wrap `loop-host.cjs` in their workflow YAML). Each of the two direct-dispatch commands gains an auto YAML, a confirm YAML, and a presentation asset; the `command.md` is rewired to resolve setup and then load the YAML. The wrapper is intentionally minimal — one dispatch step reproducing the exact inline invocation — not a clone of model-benchmark's multi-iteration phase loop.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] The loop-host flag-forwarding sets read directly for both modes.
- [x] The shared `parse-args.cjs` dialect confirmed to bind `--k=v` and `--k v` identically.
- [x] The model-benchmark yaml-backed command read as the structural template.

### Definition of Done
- [x] Both commands own auto + confirm YAML + a presentation asset.
- [x] The converted dispatch is proven byte-identical to the inline dispatch.
- [x] All 8 deep commands pass create-command conformance.

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Thin `command.md` router resolves setup (two HARD-BLOCK gates + input gate), then loads a workflow YAML whose single dispatch step runs `loop-host.cjs`. Presentation moves out of the command into a 4-section asset.

### Key Components
- **deep_<slug>_auto.yaml / _confirm.yaml**: single-dispatch wrappers; confirm adds one approval gate before `phase_run`.
- **deep_<slug>_presentation.txt**: Startup Presentation / Dashboard-Checkpoint / Results / Next-Step.
- **loop-host.cjs**: unchanged; forwards a fixed flag set per mode.
- **parse-args.cjs**: the shared dialect that makes `=`-form and space-form dispatch effect-identical.

### Data Flow
The command resolves inputs and binds YAML placeholders; the YAML dispatch step expands the resolved inputs into the loop-host argv; loop-host translates that argv to the same adapter step the command previously spawned inline.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Read both commands, the model-benchmark YAML template, and the loop-host flag sets.
- [x] Capture a skill-benchmark baseline via a real direct `loop-host.cjs` run.

### Phase 2: Core Implementation
- [x] Author the skill-benchmark auto + confirm YAML + presentation; rewire the command.
- [x] Author the ai-system-improvement auto + confirm YAML + presentation; rewire the command.

### Phase 3: Verification
- [x] Prove adapter argv byte-identical across flag combos; run command conformance + strict validation.

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Adapter argv equivalence | Both commands, representative flag combos | `loop-host.cjs planInvocation` via a shell-expansion harness |
| Report equivalence | skill-benchmark converted vs baseline | Real `loop-host.cjs --mode=skill-benchmark` run |
| Command conformance | All 8 deep commands | `validate_document.py --type command` |
| Spec validation | This child | `validate.sh --strict` |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `loop-host.cjs` flag-forwarding sets | Internal | Green | A changed set would re-break the byte-identical diff |
| `parse-args.cjs` shared dialect | Internal | Green | The `=`-form dispatch relies on it normalizing to the same map |
| A dry-runnable packaging root | External | Absent | No live ai-system-improvement execution diff (argv equivalence used instead) |

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A converted command changes Lane C/D behavior, or fails conformance.
- **Procedure**: Restore the two `command.md` files from git and delete the six new assets; the conversion is additive and fully reversible.

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
| Core Implementation | High | 70 minutes |
| Verification | Medium | 40 minutes |
| **Total** | | **150 minutes** |

<!-- /ANCHOR:effort -->
---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Adapter argv proven identical before rewiring the commands to load the YAML.
- [x] skill-benchmark converted report proven byte-identical to baseline.

### Rollback Procedure
1. `git checkout` the two `command.md` files.
2. Delete the six new asset files.
3. Re-run `validate_document.py --type command` to confirm the baseline.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A — asset additions plus two reversible command rewrites.

<!-- /ANCHOR:enhanced-rollback -->
