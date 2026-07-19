---
title: "DAL-013 -- sk-code hybrid adapter: deterministic + reasoning-agent layers"
description: "Verify the hybrid sk-code adapter classifies each artifact's surface, runs the real deterministic tools with correct severity mapping, excludes the tree-mutating minify-webflow.mjs, and only emits reasoning-agent findings from caller-supplied cited verifiedFindings."
version: 1.0.0.0
---

# DAL-013 -- sk-code hybrid adapter: deterministic + reasoning-agent layers

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DAL-013`.

---

## 1. OVERVIEW

This scenario validates the hybrid sk-code adapter for `DAL-013`. The objective is to verify surface classification (OPENCODE/WEBFLOW/UNKNOWN), the deterministic layer's real tool-wrapping (`verify_alignment_drift.py` with ERROR->P0 / WARN->P1; the WEBFLOW `verify-minification.mjs` / `test-minified-runtime.mjs` with FAIL->P0), the deliberate exclusion of the tree-mutating `minify-webflow.mjs`, and the reasoning-agent layer that builds a dispatch packet but only translates caller-supplied, cited `verifiedFindings` into findings (verify-first, never invented).

### WHY THIS MATTERS

sk-code is the HYBRID authority (ADR-008): some conformance is regex/tool-checkable, some needs judgment. The adapter must be honest about which layer produced each finding (`layer:'deterministic'|'reasoning-agent'`), must never run a tool that mutates the audited tree (read-only default), and must never let the .cjs pretend to BE the reasoning agent.

---

## 2. SCENARIO CONTRACT

Operators should run this as a real orchestrator-led check rather than a synthetic command-matrix exercise. The scenario is only complete when the operator can explain the behavior back to a user in plain language.

- Objective: Verify surface classification, the deterministic tool-wrapping layer + severity mapping, the excluded mutating minifier, and the verify-first reasoning-agent dispatch/translate layer.
- Real user request: Do these source files follow sk-code's own patterns for their surface?
- Prompt: `Validate the sk-code hybrid alignment adapter: surface classification, the deterministic tool-wrapping layer (ERROR->P0 / WARN->P1), the excluded mutating minifier, and the verify-first reasoning-agent dispatch/translate layer.`
- Expected execution process: Run `discover` over a real OPENCODE code dir, `check` on a real `.cjs`, and `reasoning-dispatch` on a file, then read `classifySurface`, the drift/minification severity mapping, `standardSource().excludedFromCheck`, and `checkPatternConformance`.
- Desired user-facing outcome: The user is told each artifact's detected surface, that deterministic findings come from the real sk-code tools with honest severities, that the mutating minifier is never run, and that pattern-conformance judgment is a separate verify-first step the adapter only records once evidence is cited.
- Expected signals: `classifySurface` returns OPENCODE for `.opencode/...`, WEBFLOW for `src/2_javascript/` or content markers, else UNKNOWN (surface-undetected finding, never guessed); OPENCODE drift ERROR->P0 / WARN->P1; WEBFLOW FAIL->P0; `standardSource().excludedFromCheck` names `minify-webflow.mjs` (writes to the tree); `buildReasoningLayerDispatch` prepares a packet but judges nothing; `checkPatternConformance` emits a finding only for a `matchesStandard:false` entry with cited `evidence`.
- Pass/fail posture: PASS if surfaces are classified, deterministic severities map correctly, the mutating minifier is excluded, and the reasoning layer is verify-first. FAIL if the adapter guesses a surface, runs the minifier, or invents a pattern finding.

---

## 3. TEST EXECUTION

### RECOMMENDED ORCHESTRATION PROCESS

1. Restate the user request in plain language before inspecting implementation details.
2. Follow the listed command sequence in order so discover/classify is exercised before the check layers.
3. Capture evidence that would let another operator reproduce the verdict without re-deriving the scenario.
4. Return a short user-facing explanation, not just raw implementation notes.
### Prompt
Validate the sk-code hybrid alignment adapter: surface classification, the deterministic tool-wrapping layer (ERROR->P0 / WARN->P1), the excluded mutating minifier, and the verify-first reasoning-agent dispatch/translate layer.
### Commands
1. `bash: node .opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-code.cjs discover .opencode/skills/system-deep-loop/deep-alignment/scripts | head -40`
2. `bash: node .opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-code.cjs check .opencode/skills/system-deep-loop/deep-alignment/scripts/scoping.cjs`
3. `bash: node .opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-code.cjs reasoning-dispatch .opencode/skills/system-deep-loop/deep-alignment/scripts/scoping.cjs`
4. `bash: rg -n 'classifySurface|OPENCODE|WEBFLOW|surface-undetected|ERROR.*P0|WARN.*P1|excludedFromCheck|minify-webflow|buildReasoningLayerDispatch|checkPatternConformance|matchesStandard' .opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-code.cjs`
### Expected
`discover` classifies each artifact's surface in node metadata (OPENCODE for the deep-alignment scripts); `check` on a real OPENCODE `.cjs` runs `verify_alignment_drift.py` for real and maps ERROR->P0 / WARN->P1 with `layer:'deterministic'`; `reasoning-dispatch` returns a packet naming dimensions + standardSource refs but no verdict; the source shows `excludedFromCheck` naming `minify-webflow.mjs` with a read-only reason, and `checkPatternConformance` requiring `matchesStandard:false` + cited `evidence`.
### Evidence
Capture the discover surface metadata, one real deterministic check() result, the reasoning-dispatch packet, and the source lines proving the excluded minifier and the verify-first pattern gate.
### Pass/Fail
PASS if surfaces are classified, deterministic severities map correctly, the mutating minifier is excluded, and the reasoning layer is verify-first. FAIL if the adapter guesses a surface, runs the minifier, or invents a pattern finding.
### Failure Triage
If `check` produces a `reasoning-agent` finding with no caller `verifiedFindings`, the verify-first gate is broken (DAL-016). If `minify-webflow.mjs` appears anywhere in `check()`'s spawn calls, the read-only default is violated (DAL-024).
---

## 4. SOURCE FILES

### PLAYBOOK SOURCES

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page, integrated alignment protocol, and scenario summary |
| `discovery-and-adapters/` | Adapter category; the sk-code adapter CLI is exercised directly here |

### IMPLEMENTATION AND RUNTIME ANCHORS

| File | Role |
|---|---|
| `.opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-code.cjs` | discover/classify, deterministic layers, `excludedFromCheck`, `checkPatternConformance` verify-first gate |
| `.opencode/skills/system-deep-loop/deep-alignment/references/adapters/sk-code-adapter.md` | Full adapter specification incl. the excluded-minifier rationale and layer split |
| `.opencode/skills/sk-code/code-opencode/assets/scripts/verify_alignment_drift.py` | The real OPENCODE drift tool the adapter wraps |

---

## 5. SOURCE METADATA

- Group: DISCOVERY AND ADAPTERS
- Playbook ID: DAL-013
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `discovery-and-adapters/sk-code-hybrid-adapter.md`
- Note: `check()` on OPENCODE artifacts requires `python3`; a WEBFLOW artifact without a discoverable `src/2_javascript/` project root yields a documented `deterministic-layer-unavailable` fallback finding, which is a valid outcome to capture.
