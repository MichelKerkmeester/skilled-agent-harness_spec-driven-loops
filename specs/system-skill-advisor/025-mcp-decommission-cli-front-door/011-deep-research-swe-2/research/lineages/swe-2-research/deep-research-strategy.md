---
title: Deep Research Strategy — MCP Decommission Lessons (swe-2 lineage)
description: Detached five-iteration lessons study of the skill-advisor MCP-transport decommission packet 025.
trigger_phrases: []
---

# Deep Research Strategy — MCP Decommission Lessons (swe-2 lineage)

## 1. Overview

Persistent state for detached lineage `swe-2-research`. The loop is forced to five iterations by `stopPolicy: max-iterations`; convergence before iteration five is telemetry only. This is a lessons study, not a defect hunt: phase 009 already ran the defect hunt and closed nine required findings; phase 010's research output is a sibling lineage and is excluded from sources.

## 2. Topic

What the skill advisor's MCP-transport decommission teaches. Case study: `specs/system-skill-advisor/025-mcp-decommission-cli-front-door` — removed the advisor's MCP transport and made the daemon-backed CLI at `.opencode/bin/skill-advisor.cjs` the single front door.

<!-- ANCHOR:key-questions -->
## 3. Key Questions (remaining)

- [None — all five questions answered; see §6]
<!-- /ANCHOR:key-questions -->

## 4. Non-Goals

- Do not re-run the phase 009 defect hunt or re-open its findings.
- Do not read phase 010's research output (`010-deep-research-residue/research/`); independent reading is the point.
- Do not edit any packet document, run `generate-context.js`, `validate.sh`, or any git write; all writes stay inside this lineage directory.
- Do not implement fixes; report findings only.

## 5. Stop Conditions

- Complete exactly five evidence iterations unless state corruption or an unrecoverable source failure prevents valid artifacts.
- Treat convergence before iteration five as telemetry and broaden into an uncovered angle.
- Stop at iteration five with `maxIterationsReached`, retaining explicit unknowns.

<!-- ANCHOR:answered-questions -->
## 6. Answered Questions

- [x] Q1 (iter 2): Eight latent defects/exposures named at file+mechanism — socket-scope probe, 250ms clamp, unreachable-daemon semantics, warm-only cold-spawn refusal (the failure that looked like a 209ms success), env-in-declaration, cross-package shim, Server-as-socket-handler — plus three harness latents (invalid frozen inputs, suite sampling, unbound flag).
- [x] Q2 (iter 3): Eleven residue classes + bucketing rule; sweep missed assertion residue (claims, not tokens) and corpus-outside wiring (.github). Sibling corroborated in iter 5.
- [x] Q3 (iter 4): 21-step, five-phase checklist ordered by cost-of-failure-prevented; every step cites a packet episode.
- [x] Q4 (iter 1): prove→rewire→delete→rename ordering; inventory frozen at `6012ec5c7d`; D1/D7 conflict resolved by naming vocabulary not envelope.
- [x] Q5 (iter 3/5): Bucketing verified live — 820 files carry the old path, 0 outside specs/changelog/benchmark.
<!-- /ANCHOR:answered-questions -->

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. What Worked

- Reading the packet's deviations table and goal log first — the packet recorded its own misses in writing (sweep-miss, .github, invalid comparison, unbound flag).
- Pairing each 009 finding class with a live-tree re-check — separated closed residue from kept-by-design residue.
- Commit-message mining (`git show`) — the latent-failure mechanisms live in commit messages (`e8d564ca98`, `9015d00c79`), not in filled packet summaries.
- Adversarial re-verification of own citations (iter 5) — caught three transcription errors before they reached the synthesis.
<!-- /ANCHOR:what-worked -->

<!-- ANCHOR:what-failed -->
## 8. What Failed

- Short-path citations in iterations 3–4 (`launcher.cjs`, `fallback.ts`, `fanout-run.cjs`) hid wrong locations — all corrected in iter 5; cite repo-relative paths from the start.
<!-- /ANCHOR:what-failed -->

<!-- ANCHOR:exhausted-approaches -->
## 9. Exhausted Approaches

- Token-level greps alone — necessary for the bucketing count but incapable of finding assertion residue; claims must be hunted semantically.
<!-- /ANCHOR:exhausted-approaches -->

<!-- ANCHOR:ruled-out-directions -->
## 10. Ruled Out Directions

- Counting string hits as residue (kept-by-design classes).
- Ordering the checklist by packet phase order (different axis: failure cost vs execution safety).
- Reading phase 010's output (independence constraint).
- Treating corrected citations as iteration-4 defects (transcription errors, self-corrected).
- Bespoke wire protocol (second grammar without removing the first — protocol-contract.md).
<!-- /ANCHOR:ruled-out-directions -->

<!-- ANCHOR:divergence-frontier -->
## 11. Divergence Frontier

- C11 retrieval-vocabulary residue: whether transport-named trigger phrases were a deliberate preserve decision is unrecorded — hypothesis only.
- Whether the same taxonomy holds outside this repository is untested — sibling corroboration is intra-repo.
<!-- /ANCHOR:divergence-frontier -->

<!-- ANCHOR:next-focus -->
## 12. Next Focus

Synthesis complete. Terminal record: `stopReason: "maxIterationsReached"` at five iterations. See `research.md`.
<!-- /ANCHOR:next-focus -->
<!-- MACHINE-OWNED: END -->

## 13. Carried-Forward Open Questions

- C11 intentionality (hypothesis, recorded).
- Stress-test filename residue (F014) deferred by the packet — `mcp-diagnostics-stress.vitest.ts` runs in no default suite on either branch.

