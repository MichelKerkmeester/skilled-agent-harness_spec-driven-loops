---
title: "Deep Research Strategy — 027 pt-02 Cross-Validation Pass"
description: "Persistent strategy for the 027 pt-02 second-pass cross-validation deep-research run via cli-codex + gpt-5.5. Tracks 10 implementation-focused IRQs across 10 iterations."
session_id: 2026-05-08-027-pt-02-codex-gpt55-cross-validation
generation: 1
---

# Deep Research Strategy — 027 pt-02 Cross-Validation Pass

## 1. OVERVIEW

Persistent brain for the 027 pt-02 cross-validation deep-research session. Each iteration agent reads `Next Focus` and writes evidence to `iterations/iteration-NNN.md`; reducer refreshes machine-owned sections at end of iteration.

**Purpose**: cross-validate the 5-phase XCE adoption implementation plans (001-005) using a different AI (gpt-5.5 high fast via cli-codex) than the first pass (deepseek/deepseek-v4-pro via cli-opencode). Find implementation risks, schema gaps, cross-phase integration concerns, edge cases, and alternative approaches the first pass missed.

---

## 2. TOPIC

Cross-validate the 5-phase XCE adoption implementation plans (001-005) inside `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/`. Find implementation risks, schema gaps, cross-phase integration concerns, edge cases, and alternative approaches NOT surfaced in the first deepseek-v4-pro research pass. Produce per-phase amendment proposals in `pt-02/sub-packet-amendments.md`.

---

## 3. KEY QUESTIONS (remaining)

- [ ] **IRQ1 — Phase 001 HLD/LLD determinism + edge cases**: Empty file, 1000-symbol file, missing docstrings, mixed-language files. Does `generateHLD()` produce identical output across 100 calls on identical db state? Where could non-determinism leak in?
- [ ] **IRQ2 — Phase 002 CONTAINS edge cross-language population**: Is the CONTAINS edge populated for TS only, or all languages (Python/Go/Rust)? Verify via `code_graph_query` on a multi-language fixture. Phase 002's trace chain depends on CONTAINS being populated.
- [ ] **IRQ3 — Phase 003 risk-formula weight validation**: Are the design-intuition weights `0.35/0.25/0.25/0.15` defensible, or does a 5-task labeled fixture suggest different weights? Alternative formulas (multiplicative vs additive, log-scaled, etc.)?
- [ ] **IRQ4 — Phase 004 confidence-edge-case stress**: At confidence ∈ {0.79, 0.80, 0.81}, does the brief shape stabilize? What if uncertainty > confidence? render.ts:124-133 gating edge cases.
- [ ] **IRQ5 — Phase 005 subprocess reliability at scale**: Does the 097-fixed `</dev/null` opencode dispatch handle 12-20 tasks × 2 conditions = 24-40 sequential subprocesses without resource leakage (file handles, db locks, memory growth, etc.)?
- [ ] **IRQ6 — Cross-phase integration contract**: Phase 002 imports Phase 001's `classifyFileRole()`. What's the JSON contract, and where could a schema drift surface? Test stub-driven integration before all phases ship.
- [ ] **IRQ7 — TESTED_BY edge ground-truth**: Is the TESTED_BY edge actually populated by `structural-indexer.ts` today? If not, Phase 003's `untestedFlag` is broken at REQ-002 acceptance criteria.
- [ ] **IRQ8 — code_packages necessity escalation**: Phase 002 P1 REQ-007 marks code_packages as optional. What workloads or codebase shapes would force it to P0? When does fq_name splitting fail?
- [ ] **IRQ9 — LLM-enrichment dispatch shape**: If Phase 003's `enrichWithLLM: true` flag is set, what's the local-first dispatch via cli-opencode? Where could SaaS dependency leak in?
- [ ] **IRQ10 — Phasing-order optimization**: Recommended order is 004 → 001 → {002, 003} parallel → 005. Are there hidden coupling constraints? Does Phase 003 actually depend on Phase 001's HLD layer info, contradicting its current "no deps"?

---

## 4. NON-GOALS

- Modifying any phase 001-005 spec.md / plan.md / tasks.md / checklist.md (amendments are PROPOSALS only).
- Re-running pass 1 (the deepseek-v4-pro run is preserved at `027/research/` flat).
- Modifying any source code under `mcp_server/`.
- Calling external SaaS endpoints (no `xanther.ai`, no live OpenAI requests beyond cli-codex's gpt-5.5 calls).
- Filing upstream issues with opencode-ai or codex-cli (separate follow-ups).

---

## 5. STOP CONDITIONS

- **Converged** — newInfoRatio < 0.10 across at least 5 iterations AND every IRQ has ≥3 findings AND verdict diversity ≥1 BLOCKING + ≥1 CONFIRMED + ≥1 NO-CHANGE-NEEDED.
- **All answered** — every IRQ resolved with ≥3 findings.
- **Max iterations** — 10/10 reached.
- **Stuck** — 3 consecutive iterations with newInfoRatio < 0.10 AND quality guards block convergence.

---

## 6. ANSWERED QUESTIONS

[None yet — populated as iterations resolve IRQs]

---

<!-- MACHINE-OWNED: START -->
## 7. WHAT WORKED

[First iteration — populated after iteration 1 completes]

---

## 8. WHAT FAILED

[First iteration — populated after iteration 1 completes]

---

## 9. EXHAUSTED APPROACHES (do not retry)

[Populated when an approach has been tried from multiple angles without success]

---

## 10. RULED OUT DIRECTIONS

[Approaches investigated and definitively eliminated]

---

## 11. NEXT FOCUS

**IRQ1 — Phase 001 HLD/LLD determinism + edge cases**: Read 027/001-code-graph-hld-lld/spec.md (especially REQ-001 determinism criterion + L2 EDGE CASES section). Read mcp_server/code_graph/lib/code-graph-db.ts:107-150 (code_files / code_nodes / code_edges schema) + indexer-types.ts:12-44 (SymbolKind/EdgeType). Read mcp_server/code_graph/lib/structural-indexer.ts:944-993 (capturesToNodes — symbol generation). Stress-test scenarios: empty file, 1000-symbol file, missing docstrings, mixed-language files. Identify where determinism could leak in. Cite ≥2 file:line refs from 027/001-* and ≥2 from mcp_server/code_graph/.

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT

Pass-1 (deepseek-v4-pro) findings preserved at `027/research/`:
- `research.md` — full synthesis with PRAT reconstruction + steering pattern transfer
- `findings.md` — adoption matrix (4 ADOPT, 9 ADAPT, 2 DEFER, 6 SKIP across 21 feature rows; 9 expanded skip boundaries)
- `sub-packet-proposals.md` — 5 sub-packet proposals (became phases 001-005)

The 5 phase children scaffolds at `027/{001..005}-*/spec.md` etc. are the input for cross-validation.

---

## 13. RESEARCH BOUNDARIES

- **Max iterations**: 10
- **Convergence threshold**: 0.10
- **Per-iteration budget**: 14 tool calls, 12 minutes
- **Total wall-clock cap**: 180 minutes
- **Progressive synthesis**: true
- **research.md ownership**: workflow-owned canonical synthesis output for pt-02
- **Lifecycle branches**: `resume` (active)
- **Machine-owned sections**: reducer controls Sections 6, 7-11
- **Canonical pause sentinel**: `pt-02/.deep-research-pause`
- **Executor**: cli-codex + gpt-5.5 + reasoning_effort=high + service_tier=fast (`-c service_tier="fast"` MUST be explicit per memory feedback_codex_cli_fast_mode)
- **Quality guards**: novelty_floor=0.15, min_iterations_before_converge=5, irq_finding_floor=3, verdict_diversity_floor={min_blocking:1, min_confirmed:1, min_no_change_needed:1}
- **Scope read-only paths**: 027/{spec.md, 001-005/, research/research.md+findings.md+sub-packet-proposals.md}, mcp_server/code_graph/, mcp_server/skill_advisor/
- **Scope write paths**: pt-02/ ONLY
- **Forbidden writes**: any 001-005 phase dir, original 027/research/iterations/, mcp_server/
- **Current generation**: 1
- **Started**: 2026-05-08T16:53:00Z
