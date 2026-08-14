---
title: "Changelog: Spec-Template & Context Optimization"
description: "Records the consolidation of the former 033 deep-research packet and the 034 implementation packet into this single 033 packet, plus what each phase delivered."
---
<!-- SPECKIT_TEMPLATE_SOURCE: packet-changelog | v1 -->
# Changelog: Spec-Template & Context Optimization

> History of this packet, which merges a deep-research phase and its implementation into one record.

---

## 1. 2026-08-14 — CONSOLIDATION (033 + 034 -> 033)

Two packets that were two halves of one effort are now a single packet under the `033` number, named `033-spec-template-context-optimization`.

- **Former `033-spec-templates-and-context-reducer`** — the deep-research phase. By the time of the merge it was an empty stub: its findings had already been absorbed into the 034 implementation packet (commit `b904dc578a`), leaving only gitignored raw run-logs.
- **Former `034-spec-template-context-optimizations`** — the implementation phase, complete at 100%. Its full 112-file content became this packet via `git mv` (history preserved).

What the merge did: moved 034's content to this folder; folded 033's stray run-logs into `research/logs/`; removed the empty 033 stub; renumbered the canonical references (`packet_pointer`, `description.json`, `graph-metadata.json`, main-doc folder paths) from 034 to 033.

What it deliberately left unchanged: the historical `research/` and `review/` run-artifacts and the `session_id` fields. Those record what actually happened during the research and review and are kept as an immutable audit trail, so some still name the original `033`/`034` paths.

Why merge: 033 researched the gaps and 034 shipped the fixes. Keeping two numbered packets for one continuous effort was redundant once 034 had already absorbed the research.

---

## 2. RESEARCH PHASE — WHAT IT FOUND (formerly 033)

A deep-research run of 10 iterations across 4 lineages and 3 model families tested two external agent-engineering concepts against system-speckit. It found that most of those patterns already ship, but **six genuine gaps** survived adversarial, multi-model prior-art filtering (the top three independently re-verified). It also produced a durable **refutation list** — ideas that look attractive but should NOT be built because the repo already has them or they are category errors.

Key commit: `43aee5e5ec` (deep-research packet).

---

## 3. IMPLEMENTATION PHASE — WHAT IT SHIPPED (formerly 034)

The six verified optimizations, delivered as four independently-shippable phases each with its own tests and regression gate:

1. **Research-template level-gating** — the 944-line `research.md.tmpl` no longer loads at every level.
2. **Template source consolidation** — removed cross-level duplication in the four multi-level templates.
3. **Rendered-view read path + authoring guard** — a byte-identical render safety gate.
4. **AC-coverage activation** — turned on the previously dormant machine-checked plan-adherence gate.
5. **Scope-adherence validator** — `check-scope-adherence.sh` advisory rule (a research lineage had literally wandered out of scope during the research phase).
6. **memory_search token budget** — applied the existing `enforceTokenBudget` helper in `handleMemorySearch`, matching the budget its sibling already enforced.

It deliberately did NOT act on the refuted ideas (porting a findings reducer, adding a `memory_context` budget, new fresh-evaluator / progress-handoff frameworks, and so on) — reimplementing existing systems is the wrong-abstraction trap the research warned against.

Key commits: `b0d5096bb1` (phased plan), `c8c4e79139` (optimize templates + validation and budget gates), `4da8e091f4` (before/after comparison + skill changelog `v3.9.0.0`), `478d350256` and `cb39cdfd66` (deep-review remediation), `b904dc578a` (absorb research). Shipped to the skill as changelog `v3.9.0.0`.

---

## 4. STATUS

Complete. All six optimizations shipped and verified; see `implementation-summary.md` for the verification evidence and `decision-record.md` for the architecture decisions. One open contract note remains recorded in the packet: the scope-rule changed-files contract (`MK_SCOPE_BASE`) is not yet formally defined.
