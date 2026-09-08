---
title: Deep Research Strategy — Ripgrep Search System Audit
description: Persistent research plan for the glm-5-3-flash-ripgrep-search fan-out lineage.
---

# Deep Research Strategy — glm-5-3-flash-ripgrep-search

## Research Topic

Skeptical retrieval audit of system-spec-kit's lexical retrieval system after the memory-database decommission: trigger-index generator (`generate-trigger-index.mjs`), lookup CLI (`lookup-trigger-index.mjs`), ripgrep conventions (`retrieval-conventions.md`), `/speckit:search` command. Score correctness, integration, utilization, simplicity. Target: a cited defect-and-simplification ledger, not a narrative. Non-goals: no edits; no database/vector redesign; no prose-style review. Exactly 10 iterations, no early convergence.

## Known Context

- Ground truth surface: `.opencode/skills/system-spec-kit/runtime/cli/retrieval/**` — `generate-trigger-index.mjs`, `lookup-trigger-index.mjs`, `lib/{normalize,frontmatter,corpus,grep-convention,rg-lane,artifact}.mjs`, `rg-wrapper.mjs`, `measure-cold-lookup.mjs`, `sweep-memory-residue.mjs`, `retrofit-convention.mjs`, `fixtures/`.
- Index data: `.opencode/skills/system-spec-kit/runtime/data/trigger-index.json`.
- Command surface: `.opencode/commands/speckit/search.md` + `assets/search-presentation.txt`.
- Conventions doc: `.opencode/skills/system-spec-kit/references/retrieval/retrieval-conventions.md`.
- Framework wiring: Gate 1 lookup in AGENTS.md/CLAUDE.md; REPO RULES.md + repo-rules/*.md; `.opencode/skills/system-spec-kit/SKILL.md`.
- Doc contradiction flagged in charter: retrieval-conventions.md's "concept lane" over an embedded index that search.md calls unsupported.
- Doc-generation discipline: whenever spec-doc content changes, run the metadata regenerator (`generate-context.js`) or `GENERATED_METADATA_INTEGRITY` fails on a stale fingerprint.
- Fixture scripts refreshed 16:29: `retrofit-convention.mjs`, `lib/corpus.mjs`; fixtures `corpus-manifest.json`, `generation-diagnostics.json`, `phrase-variants.json` (~11MB total).

## Key Questions

- q-gen: Does the generator build the index correctly and idempotently over its declared roots, exclusions, and normalization rules?
- q-lookup: Does the lookup CLI tokenize, gate, score, classify matches, and exit-code correctly on real and edge inputs?
- q-search: Does `/speckit:search` match its documented contract, its presentation asset, and its unsupported-feature list?
- q-callers: Do real callers (Gate 1 lookup, hooks, doctor, save-freshness) use the lookup script and ripgrep recipes as documented?
- q-contradiction: Do docs contradict each other (concept lane vs embedded index; stale database/embedding mentions)?
- q-footprint: How large is retrieval's footprint in AGENTS.md/CLAUDE.md/REPO RULES.md, and could a dedicated repo-rules file reduce it to a pointer?
- q-consulted: Is the index actually consulted by hooks/commands/tests, or is any surface dead?
- q-removal: What can be removed or merged without losing a documented capability?

## Answered Questions

- q-gen ✓ — generator is deterministic (two builds byte-identical) and fail-closed; the committed artifact was stale (F1.1) but zero-impact at query level (F8.1).
- q-lookup ✓ — tokenization/gate/scoping/exit codes contract-true; one scoring gap (single-token phrases, F2.6) and the 0.8-floor degeneration (F2.7).
- q-search ✓ — two-lane contract internally consistent; concept-lane contradiction confirmed (F3.1/F5.1); inline recipe drift (F3.2).
- q-callers ✓ — census complete: Gate 1, resume yaml, doctor, deep-loop agents, search.md; no hook executes the lookup (F4.1).
- q-contradiction ✓ — concept lane ×2 fragments, latency claim vs fixture, three matchClass vocabularies.
- q-footprint ✓ — 5 lines in AGENTS/CLAUDE; repo-rules placement ruled out (Gate 5 load timing, F5.7).
- q-consulted ✓ — agents, doctor, tests, search all consume the index; fixtures partially acceptance fossils (F10.2).
- q-removal ✓ — six-item shortlist led by retrofit-convention.mjs relocation.

## What Worked

- Redirecting generator output into the lineage dir made freshness falsifiable without repo writes.
- Executing documented commands verbatim (README §7) converted doc suspicion into reproducible evidence.
- Adversarial re-probe pass (iter 9) corrected one finding's framing (F2.8) before synthesis.

## What Failed

- Iteration 4's hook census missed workflow.ts's library-import freshness check (corrected iter 7, F7.2).
- Charter's assumption that check-grep-convention.sh lives in sk-doc was wrong (corrected F4.7).

## Exhausted Approaches

- All eight charter angles plus two consolidation passes are complete; every ground-truth file under retrieval/** was read.

## Ruled-Out Directions

- Dedicated repo-rules/retrieval.md (F5.7). Deletion of retrofit-convention or acceptance-fossil fixtures within this packet (non-goal). Stale-index-drops-documents hypothesis (F8.1: identical sets).

## Divergence Frontier

Iteration plan (charter-mandated angle order, least-explored first): (1) generator correctness; (2) lookup correctness; (3) /speckit:search vs contract; (4) real callers vs documented contract; (5) doc contradictions incl. concept lane; (6) retrieval footprint in root docs; (7) evidence the index is consulted vs dead surface; (8) removal/merge candidates; (9) cross-cutting simplicity & severity roll-up; (10) ledger consolidation and open-question audit.

## Next Focus

None — 10 iterations complete (cap). Synthesis written; stop reason maxIterationsReached.
