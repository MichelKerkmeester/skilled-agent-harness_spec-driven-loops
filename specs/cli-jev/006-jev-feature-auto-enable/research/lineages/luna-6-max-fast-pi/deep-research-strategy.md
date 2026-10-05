---
title: Deep Research Strategy — Jev feature proof-or-retire (Luna lineage)
description: Five inline iterations on evidence, accuracy, hardening, integration, and tests for three unproven Jev features.
trigger_phrases:
  - "jev feature proof or retire"
  - "luna deep research strategy"
importance_tier: normal
contextType: planning
---

# Deep Research Strategy — Jev feature proof-or-retire

Lineage: `luna-6-max-fast-pi` (`fanout-luna-6-max-fast-pi-1791148943815-gjfbtn`).
Artifact directory: `specs/cli-jev/006-jev-feature-auto-enable/research/lineages/luna-6-max-fast-pi`.
Write boundary: this lineage directory only; no spec-folder writeback, continuity save, or shared telemetry writes by the inline executor.

## 1. TOPIC

Research how to prove, improve, harden, debug, integrate, and test spec-track narrowing, routing clarify default, and alignment folder suggestion so each either earns a live auto-on path behind the shared Jev gate or is retired with evidence.

## 2. KEY QUESTIONS

- [ ] What is the current shared-gate contract, and what do the four proven features show about a safe live integration?
- [ ] What evidence, corpus, labels, keep rule, power, hardening, integration, and tests would settle spec-track narrowing?
- [ ] What evidence, corpus, labels, keep rule, power, hardening, integration, and tests would settle routing clarify default?
- [ ] What evidence, controls, hardening, integration, and tests would settle alignment folder suggestion?
- [ ] What unified proof-or-retire rule and ranked next step applies across the three candidates?

## 3. NON-GOALS

- Implementing any feature, scorer, shared-gate change, or test.
- Live Jev or model calls, or rerunning model-based benchmark arms.
- Modifying `spec.md`, other packet documents, shared telemetry, or files outside this lineage.

## 4. STOP CONDITIONS

- Complete five evidence iterations, then record `stopReason: maxIterationsReached`.
- Answer or explicitly bound all five key questions and give each non-proven feature a ranked next step.

## 5. ANSWERED QUESTIONS

None at initialization. Canonical iteration state and deltas will carry per-question progress; the strategy remains an initialization snapshot because the detached lineage has no reducer write authority.

## 6. WHAT WORKED

To be established from iteration evidence.

## 7. WHAT FAILED

To be established from iteration evidence.

## 8. EXHAUSTED APPROACHES

None at initialization.

## 9. RULED OUT DIRECTIONS

None at initialization.

## 10. SATURATED DIRECTIONS AND DIVERGENCE FRONTIER

No pivots at initialization; the five requested question areas define the fixed research frontier.

## 11. CARRIED-FORWARD OPEN QUESTIONS

None at initialization.

## 12. NEXT FOCUS

For each iteration, use the first key question not yet answered by a canonical iteration record. The planned order is: shared gate; track narrowing; clarify default; alignment suggestion; unified proof-or-retire standard.

## 13. KNOWN CONTEXT

- The parent packet scopes this run to research only; feature wiring is explicitly out of scope.
- Prior research and build evidence is in workflow-integration packets 017, 020, 022, 047, 048, and 049; the complete independent DeepSeek lineage is read-only corroboration, not a substitute for source checks.
- Source pointers include the shared `jev-features.mjs` gate and tests, the three candidate scorer modules, the compiled routing normalization seam, measured-run reports, and the four proven gated call sites.
- The user requires every finding to cite `file:line`, every recommendation to carry P0–P2 and a confirmation method, and all writes to remain inside this lineage.

## 14. RESEARCH BOUNDARIES

- Maximum iterations: 5; convergence threshold: 0.05; stop policy: max-iterations.
- Per-iteration research uses the explicit next question and is recorded in write-once `iterations/` and `deltas/` artifacts.
- State-log records are append-only and must pass through `append-mode-event.cjs`.
- Final synthesis is written once to this lineage's `research.md`; resource-map output is enabled.
- This is a detached lineage; no iteration is dispatched to another CLI, agent, or subprocess.
