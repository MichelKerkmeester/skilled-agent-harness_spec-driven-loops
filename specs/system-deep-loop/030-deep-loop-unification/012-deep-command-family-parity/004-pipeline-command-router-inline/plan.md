---
title: "Implementation Plan: pipeline command router inline — uniform triad shape for the 4 render-pipeline deep commands"
description: "Promote research/review/ai-council/alignment stubs to full inline router bodies, fold the autonomous directive, drop the bang, recompile contracts, and keep the render/compile/drift pipeline dormant-but-maintained."
trigger_phrases:
  - "deep command router inline"
  - "promote deep command body drop bang"
  - "render pipeline stub to router triad"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/030-deep-loop-unification/012-deep-command-family-parity/004-pipeline-command-router-inline"
    last_updated_at: "2026-07-13T21:00:00Z"
    last_updated_by: "claude"
    recent_action: "Authored the phase 004 implementation plan"
    next_safe_action: "Execute Phase 1 setup reads (stubs, legacy bodies, directives, scripts)"
---
# Implementation Plan: pipeline command router inline — uniform triad shape for the 4 render-pipeline deep commands

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown command files + Node.js CommonJS render pipeline + JSON rollout |
| **Framework** | system-deep-loop command render pipeline |
| **Storage** | `.opencode/commands/deep/*.md`, `assets/compiled/*`, `assets/legacy/*`, `shared/rollout/command-injection-rollout.json` |
| **Testing** | `check-contract-drift.cjs`, `render-command-contract.cjs --compare`, `validate_document.py`, vitest, `validate.sh --strict` |

### Overview
Bring the four render-pipeline stubs into the same self-describing router-triad shape the rest of the family already uses. The pipeline is fixed and proven; this phase promotes the committed `command.md` to a full inline router by lifting each command's legacy body, folds the autonomous directive so `:auto` behaviour survives the bang drop, recompiles the four contracts, and leaves the render/compile/drift pipeline maintained (the four stay `fix`). It does not redesign any script and it deletes nothing.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] The four stubs, their legacy bodies, and their compiled `autonomousExecutionDirective` blocks read directly.
- [ ] The render/compile/drift scripts and the spec-gate hook's `classificationOptions` path read to confirm the bang is not load-bearing for Gate-3.
- [ ] The three create-command citing docs located at their example lines.

### Definition of Done
- [ ] All 4 commands carry a full inline `## 1..## 6` router body with the folded directive and no bang.
- [ ] The 4 contracts recompiled + drift-clean; render smoke COMPARE OK in `mode=fix`.
- [ ] All 7 commands pass `--type command`; four vitest suites green; live `:auto` smoke of research/review preserved; `validate.sh --strict` clean.

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Self-describing router triad: committed `command.md` holds the full `## 1 ROUTER CONTRACT` → `## 6 WORKFLOW SUMMARY` body inline (no runtime bang); `_presentation.txt` + `_auto.yaml` + `_confirm.yaml` remain the paired assets; the compile/render/drift pipeline stays maintained but off the live runtime path.

### Key Components
- **command.md (x4)**: promoted from stub to inline router; frontmatter + `allowed-tools` preserved byte-for-byte; the compiled `autonomousExecutionDirective` folded in as a subsection.
- **legacy/deep_<name>.body.md**: the verbatim source of the promoted `## 1..## 6` body; stays the compiler input.
- **compile-command-contracts.cjs**: recompiles the four contracts from the (unchanged) legacy bodies + presentations.
- **check-contract-drift.cjs / render-command-contract.cjs**: guard freshness; `--compare` proves the render still matches in `mode=fix`.
- **command-injection-rollout.json**: the four stay `fix` so render vitest `mode==='fix'` assertions hold.

### Data Flow
Promotion copies the legacy body into the committed `command.md` and removes the bang; the compiler continues to read the legacy body + presentation to emit a hashed contract; the renderer, still in `fix`, asserts freshness and `--compare` confirms parity — but nothing injects the contract into the live command path anymore.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Read the four stubs, their legacy bodies, and their compiled `autonomousExecutionDirective` blocks.
- [ ] Read the render/compile/drift scripts and the spec-gate hook to confirm the bang is not load-bearing for Gate-3.
- [ ] Locate the three create-command citing docs at their example lines.

### Phase 2: Core Implementation
- [ ] Promote the four bodies (lift legacy `## 1..## 6` under frontmatter + H1), fold the directive, drop the bang.
- [ ] Recompile the four contracts (`compile-command-contracts.cjs --command deep/<name> --write`).
- [ ] Correct the three create-command standard docs that cite these commands as compiled-stub examples.

### Phase 3: Verification
- [ ] Drift sweep (`check-contract-drift.cjs` → OK), render smoke (`--compare` → COMPARE OK) + `mode=fix` freshness.
- [ ] `validate_document.py --type command` on all 7 → exit 0; run all four vitest suites.
- [ ] Live `:auto` smoke of research/review; `validate.sh --strict`; roll up the 064 parent map.

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Contract drift | All registered commands after recompile | `node check-contract-drift.cjs` |
| Render smoke | The 4 promoted commands in `mode=fix` | `render-command-contract.cjs --compare` (`writeManifest:false`) |
| Command conformance | All 7 deep commands | `validate_document.py --type command` |
| Unit / regression | Pipeline behaviour | vitest: `render-command-contract`, `check-contract-drift`, `compile-command-contracts`, `resolve-injection-mode` |
| Behaviour smoke | `research` + `review` `:auto` | Live dispatch before any merge |
| Spec validation | This child + parent rollup | `validate.sh --strict` / `--recursive` |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Existing render/compile/drift scripts | Internal | Green | No path to keep the pipeline maintained after the bang drop |
| Legacy bodies as clean `## 1..## 6` routers | Internal | Green | "Lift verbatim" assumption fails; promotion needs hand-authoring |
| `command-injection-rollout.json` `fix` entries | Internal | Green | Render vitest `mode==='fix'` assertions depend on the 4 staying `fix` |
| Spec-gate hook `classificationOptions` path | Internal | Green | Confirms the bang is not load-bearing for machine-level Gate-3 |

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A promoted command fails conformance, drift, render smoke, a vitest suite, or the live `:auto` smoke regresses autonomous behaviour.
- **Procedure**: `git checkout` the four `command.md` files and the recompiled contracts to restore the stub + bang; the pipeline, rollout, and legacy bodies are untouched, so restoration is a pure revert.

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
| Core Implementation | Medium | 60 minutes |
| Verification | Medium | 40 minutes |
| **Total** | | **140 minutes** |

<!-- /ANCHOR:effort -->
---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Render smoke used `writeManifest:false` (no manifest pollution).
- [ ] Live `:auto` smoke of research/review confirmed autonomous behaviour before any merge.

### Rollback Procedure
1. `git checkout` the four promoted `command.md` files back to the stub + bang.
2. `git checkout` the four recompiled compiled contracts.
3. Re-run `check-contract-drift.cjs` and `render-command-contract.cjs --compare` to confirm the baseline.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A — command/asset/doc edits only; the pipeline, rollout, and legacy bodies are untouched.

<!-- /ANCHOR:enhanced-rollback -->
