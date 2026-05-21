---
title: "011: spec-memory rerank decision arc (phase parent)"
description: "Phase parent for the 3-step path to a working spec-memory reranker (or a defensible decision not to ship one). Phase 1 audits the OFF baseline before building anything. Phase 2 tries the strongest Apache-2.0 off-the-shelf cross-encoder (bge-reranker-v2-m3) before fine-tuning. Phase 3 only fires if 1 and 2 both fail to clear the rank-quality bar. Supersedes the original 010-domain-tuned-reranker-finetune scaffold (now folded in as Phase 3 with the template-stripping refinement)."
trigger_phrases:
  - "011 spec-memory rerank decision arc"
  - "off baseline audit before reranking"
  - "bge-reranker-v2-m3 trial spec-memory"
  - "domain-tuned reranker fine-tune"
  - "rerank decision phased plan"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/008-rerank-sidecar-arc/011-spec-memory-rerank-decision-arc"
    last_updated_at: "2026-05-21T13:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "Scaffolded phased decision arc"
    next_safe_action: "Execute Phase 1 (OFF baseline audit) — cheapest, may close arc"
    blockers: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-phase-parent | v2.2 -->
# 011: spec-memory rerank decision arc

<!-- SPECKIT_LEVEL: phase-parent -->
<!-- CONTENT DISCIPLINE: PHASE PARENT
  Lean trio only at this level: spec.md, description.json, graph-metadata.json.
  Heavy docs live in each phase child where they stay accurate.
-->

---

<!-- ANCHOR:root-purpose -->
## 1. ROOT PURPOSE

Four spec-memory rerank benchmarks in arc 008 produced HOLDs with distinct failure modes (CPU Qwen latency, CPU ms-marco rank-quality regression, MPS Qwen attention OOM, fp16 MPS still OOM). The remaining undeleted children — 007 (MPS promotion), 008 (cap top_k), 009 (fp16) — are runtime tweaks that address latency and memory, not rank quality. The ms-marco bench's −6 hits vs OFF baseline is the diagnostic signal: the binding constraint is **model/corpus mismatch**, not runtime configuration.

This arc replaces the runtime-tweak path with a 3-phase decision sequence that escalates only as cheaper options fail:

1. **Audit the OFF baseline.** If positional fallback is already good enough in practice, the right fix is removing the boolean `WEIGHT_RERANKER=0.20` confidence penalty when no reranker is configured. Cost: ~1 hour. Outcome may close the arc entirely.
2. **Try `BAAI/bge-reranker-v2-m3` off-the-shelf.** Apache-2.0, 568M, multilingual/diverse text training. Stronger baseline than ms-marco-MiniLM for structured markdown. Slots into the existing sidecar allowlist. Cost: ~half day.
3. **Fine-tune only if Phases 1+2 both HOLD.** Multi-day. Includes a template-stripping step in the triple-generation pipeline so the model doesn't overfit to anchor/frontmatter scaffolding.

The 010 packet that previously scaffolded "domain-tuned-reranker-finetune" is superseded by Phase 3 of this arc. 007/008/009 stay planned but are no longer on the critical path — they remain available if a future operator wants to revisit runtime tuning after the rank-quality question is settled.
<!-- /ANCHOR:root-purpose -->

---

<!-- ANCHOR:phase-map -->
## 2. PHASE MAP

| Phase | Focus | Status | Effort | Gate to next |
|---|---|---|---|---|
| `001-off-baseline-audit/` | Quantify OFF baseline on the 50-probe fixture; remove WEIGHT_RERANKER penalty if OFF is acceptable | Planned | ~1 hour | OFF deficient → Phase 2 |
| `002-bge-v2-m3-trial/` | Add `BAAI/bge-reranker-v2-m3` to sidecar allowlist; A/B vs OFF on the same fixture | Planned | ~4-6 hours | bge-v2-m3 HOLDs → Phase 3 |
| `003-domain-tuned-finetune/` | Synthetic triples (with template-stripping) → fine-tune ms-marco or bge-base → publish artifact → A/B | Planned (gated) | ~3-5 days | — (arc terminus) |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:invariants -->
## 3. CROSS-CUTTING INVARIANTS

Future maintainers MUST preserve these across all phases:

1. **Same fixture across all phases.** The 50-probe fixture from `004-spec-memory-rerank-benchmark/` is the only A/B surface. Adding new probes mid-arc invalidates cross-phase comparisons. If the fixture is genuinely insufficient, extend it as a Phase 0 step before Phase 1, with all phases re-running on the expanded set.
2. **OFF baseline is the reference.** Every phase compares against OFF, not against another reranker. The ms-marco regression of −6 hits below OFF is the lesson: "better than ms-marco" doesn't mean "better than nothing."
3. **Apache-2.0 only.** No jina-v3 (CC BY-NC 4.0). Models considered must permit commercial use even though current usage is personal.
4. **Same gates as arc 008.** Hit-rate ≥ OFF + 3, p95 latency < +500ms vs OFF, no OOM, no daemon crash. Phase verdicts are PROMOTE / HOLD using these gates.
5. **Sidecar is the shared infrastructure.** Both Phase 2 and Phase 3 artifacts ship through `system-rerank-sidecar`'s allowlist + revision-pin mechanism. No new client-side model loading.
6. **No early shipping.** Even if Phase 1 reveals OFF is good enough, the WEIGHT_RERANKER penalty removal is a code change that ships through Phase 1's normal completion gates, not a hot-fix.
<!-- /ANCHOR:invariants -->

---

<!-- ANCHOR:cross-refs -->
## 4. CROSS-REFERENCES

- Parent arc: `../` — `008-rerank-sidecar-arc` (rerank-sidecar work, this packet re-opens it)
- Sibling phases (now off the critical path):
  - `../004-spec-memory-rerank-benchmark/` — Phase 004 HOLD (CPU Qwen, latency)
  - `../005-promote-qwen-as-default/` — Phase 005 HOLD (CPU ms-marco, rank quality)
  - `../007-spec-memory-mps-rerank-promotion/` — Planned, MPS attention OOM hypothesis
  - `../008-cap-rerank-top-k/` — Planned, runtime tweak
  - `../009-fp16-rerank/` — Planned, runtime tweak
- Superseded:
  - `../010-domain-tuned-reranker-finetune/` — folded into `003-domain-tuned-finetune/` (this arc) with the template-stripping refinement
- Shared infrastructure:
  - `.opencode/skills/system-rerank-sidecar/` — sidecar
  - `.opencode/skills/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:54` — local provider slot
  - `.opencode/skills/system-spec-kit/mcp_server/lib/search/search-flags.ts` — `SPECKIT_CROSS_ENCODER`, `RERANKER_LOCAL`
<!-- /ANCHOR:cross-refs -->

---

<!-- ANCHOR:dispatch-notes -->
## 5. DISPATCH NOTES

Code implementation for Phases 1-3 routes to **`cli-codex gpt-5.5 high fast`** per operator direction. Markdown/spec authoring stays on the main agent. The dispatch contract for each phase lives in that phase's `plan.md` §Dispatch. Each phase plan ends with a verbatim copy-paste prompt for the cli-codex invocation so the executor doesn't need to re-derive scope.

`cli-codex` is sandboxed and cannot stage commits directly (per the `.git/index.lock` constraint memo); the main agent commits on behalf using the exact paths listed in each phase's implementation-summary "Commit Handoff" section.

**Verification ordering:** every phase produces (a) the existing 50-probe fixture run output, (b) a delta-vs-OFF table in the phase's implementation-summary, and (c) a PROMOTE / HOLD verdict. Strict-validate exit 0 is a hard gate before commit.
<!-- /ANCHOR:dispatch-notes -->
