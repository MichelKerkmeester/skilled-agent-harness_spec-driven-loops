# Iter 044 — Track 11: first-principles re-evaluation

## First-principles 026 phase structure

### Domain decomposition
- Surface 1: Research and baseline — external/reference research, initial system diagnosis, adoption rationale — packets like research-and-baseline, external project intake, clean-room/license audit.
- Surface 2: Spec documentation substrate — templates, resource maps, phase-parent rules, validation contracts, generated metadata — packets like resource-map-template and template-levels.
- Surface 3: Memory continuity and indexing — memory save/search, continuity recovery, indexer invariants, cache invalidation, retention — packets like continuity-memory-runtime, memory-indexer-invariants, memory-retention.
- Surface 4: Retrieval substrate and embeddings — CocoIndex, local embeddings, model/provider migration, embedding cache, vector store rebuilds, daemon resilience — packets like local-llama-cpp/local-embeddings and CocoIndex daemon resilience.
- Surface 5: Code graph — code graph scanner, graph package extraction, scan scope, code-graph hooks, backend resilience, doctor coverage for code graph — packets under code-graph.
- Surface 6: Skill advisor and routing — skill discovery, advisor graph, intent routing, semantic lane, calibration, corpus sweeps, plugin hardening — packets under skill-advisor.
- Surface 7: Runtime executor and hooks — CLI executor hardening, runtime wrapper contracts, hook injection, hook parity across Claude/Codex/Copilot/OpenCode — packets like runtime-executor-hardening and hook-parity.
- Surface 8: Causal/context routing and affordance display — graph-channel routing, causal edges, impact explanations, trust display, affordance evidence — packets like causal-graph-channel-routing and graph-impact-and-affordance-uplift.
- Surface 9: Doctor and repair commands — `/doctor` command router, subsystem diagnostics, update orchestration, sandbox testing playbook, rollback/snapshot flows — packets under doctor-update-orchestrator.
- Surface 10: Extraction and package boundaries — extracted skills isolation, system-code-graph extraction, system-skill-advisor extraction, consumer rewiring — packets currently nested under code-graph/skill-advisor plus extracted-skills-isolation.
- Surface 11: Release governance, observability, and assurance — cleanup, release readiness, stress tests, deep review remediation, security audit, stale-doc fixes — packets under release-cleanup and security sweep.

### Phase granularity policy
- Rule: one top-level phase per stable technical ownership surface; child phases per independently shippable capability or remediation train.
- Rationale: The ideal structure optimizes for recall and maintenance. A maintainer usually asks “where is memory search?” or “where is hook parity?” before asking “which historical iteration created this?” Top-level phases should therefore map to durable subsystems, while incident-specific work, deep reviews, and remediation loops live as children under the subsystem they validate or repair. This prevents both extremes: 100+ packet chronology at the root, and oversized buckets like “runtime and memory” that combine unrelated ownership.

### Cross-phase boundaries
- Sequential foundation:
  - Research and baseline comes first.
  - Spec documentation substrate should precede large-scale phase restructuring and validation-heavy work.
- Parallel domain clusters:
  - Memory continuity/indexing, retrieval/embeddings, code graph, skill advisor, runtime/hooks, and doctor commands can mostly evolve in parallel once the substrate exists.
- Hierarchical decomposition:
  - Code graph, skill advisor, local embeddings, hook parity, doctor, and release governance are phase parents with internal child phases.
- Integration boundary:
  - Causal/context routing sits after memory, code graph, and advisor primitives exist, but before release readiness.
- Assurance boundary:
  - Release governance, observability, stress testing, and security audit are not product domains. They are cross-cutting validation and should not hide subsystem implementation packets.

### Naming axis
- Chosen axis: surface
- Rationale: Surface names best support future lookup. Verb names age badly because “implement,” “fix,” and “remediate” describe the moment, not the system. Problem names help during incident response but become hard to browse later. Outcome names are useful for child delivery packets, but top-level 026 is a coordination map; the strongest recall key is the technical surface a maintainer owns.

### Proposed first-principles phase list
| # | Phase name | Domain | Scope |
|---|---|---|---|
| 000 | release-governance-and-assurance | Release governance / observability | Release cleanup, stress tests, deep-review remediation, stale docs, security audit, final readiness evidence. |
| 001 | research-and-baseline | Research / intake | External research, baseline diagnosis, clean-room adoption decisions, initial target-state framing. |
| 002 | spec-doc-substrate | Templates / resource maps | Resource-map template, phase-parent docs, template-level redesign, validation and metadata contracts. |
| 003 | memory-continuity-and-indexing | Memory | Continuity runtime, memory save/search, memory indexer invariants, cache invalidation, retention. |
| 004 | retrieval-and-embeddings-substrate | CocoIndex / embeddings | Local embeddings migration, provider selection, vector store rebuild, CocoIndex reliability, daemon resilience. |
| 005 | runtime-executor-and-hooks | Runtime / hooks | CLI executor hardening, runtime wrappers, hook injection, hook parity remediation. |
| 006 | code-graph-capability | Code graph | Scanner, graph package extraction, scan scope, graph backend resilience, code graph hook/advisor integration. |
| 007 | skill-advisor-and-routing | Skill advisor | Advisor graph, search/routing tuning, semantic lane, corpus sweeps, calibration, plugin hardening. |
| 008 | causal-context-routing-and-affordances | Causal graph / UX evidence | Graph-channel routing, causal edge utilization, impact explanation, trust display, affordance evidence. |
| 009 | doctor-and-repair-orchestration | Doctor commands | `/doctor` router, subsystem repair commands, update orchestration, sandbox/playbook, rollback. |
| 010 | extraction-and-package-boundaries | Packaging / skill isolation | Extracted skill isolation, system-code-graph extraction, system-skill-advisor extraction, consumer rewiring. |

## Comparison with SWE-1.6 track 9 (iter 035)

### Agreements
- Both structures treat code graph as a major phase parent.
- Both structures treat skill advisor as a major phase parent.
- Both structures treat hook parity as a major phase parent or major runtime domain.
- Both structures treat doctor update orchestration as a standalone surface.
- Both structures treat local embeddings/CocoIndex retrieval work as a major load-bearing surface.
- Both structures separate release cleanup from core feature domains.
- Both structures recognize causal graph/channel routing as load-bearing rather than incidental.
- Both structures preserve research/baseline as the first conceptual layer.

### Divergences
- SWE-1.6 merges runtime executor hardening into “Runtime and Memory Optimization”; first-principles separates runtime/hooks from memory/indexing.
- Why: memory continuity and runtime executor hardening have different ownership, failure modes, and test surfaces. They touch each other, but they are not the same subsystem.
- Which is closer to optimal: first-principles. The split improves recall and reduces accidental coupling.

- SWE-1.6 keeps “External Project Adoption” as a top-level phase; first-principles treats it as research/intake plus domain-specific child work.
- Why: “external project adoption” describes provenance, not the resulting technical surface. The adopted work lands in code graph, advisor affordance evidence, causal trust display, and docs/catalogs.
- Which is closer to optimal: first-principles. Provenance belongs in research or decision records; implementation belongs under the owning subsystem.

- SWE-1.6 keeps CocoIndex daemon resilience separate from local embeddings; first-principles folds both into retrieval-and-embeddings substrate.
- Why: CocoIndex daemon reliability and embedding/provider migration both affect the retrieval substrate. Separate child phases are warranted; separate top-level roots are less useful.
- Which is closer to optimal: first-principles, with a caveat: daemon resilience can remain a child phase parent if its remediation train is large.

- SWE-1.6 has no explicit spec-doc substrate phase spanning resource maps plus template-levels; first-principles elevates it.
- Why: 026 now contains both resource-map template work and template-system redesign. These are documentation substrate, not research baseline.
- Which is closer to optimal: first-principles. This is a real technical surface in the packet.

- SWE-1.6 includes extracted skills isolation as standalone; first-principles groups extraction/package-boundary work across code-graph, skill-advisor, and skill isolation.
- Why: extracted skills isolation is one instance of a broader boundary problem: moving capabilities out of system-spec-kit while preserving consumers.
- Which is closer to optimal: first-principles. The broader package-boundary surface is more durable.

- SWE-1.6 includes TanStack security audit as standalone; first-principles puts it under release governance and assurance.
- Why: the audit is important, but it is cross-cutting assurance triggered by an external incident, not a graph/context optimization subsystem.
- Which is closer to optimal: first-principles for 026 navigation; SWE-1.6 is better if the audit must be independently resumed as an incident packet.

### Convergent vs divergent count
- Convergent phases: 8
- Divergent phases: 6
- Confidence in convergent: HIGH (two independent paths agree)
- Confidence in divergent: MEDIUM-HIGH for memory/runtime split, spec-doc substrate, and external-adoption folding; MEDIUM for CocoIndex/embeddings grouping and security-audit placement because operational resume needs may override taxonomy.

## Recommendation to synthesis
- Phases to adopt with HIGH confidence (convergent): research-and-baseline, code-graph-capability, skill-advisor-and-routing, runtime/hooks or hook-parity, causal-context-routing, doctor-and-repair-orchestration, retrieval/local-embeddings, release-governance.
- Phases to revisit (divergent): runtime-vs-memory boundary, external-project-adoption placement, CocoIndex daemon resilience placement, extracted-skills isolation placement, TanStack/security audit placement.
- Phases where first-principles wins: spec-doc-substrate, memory-continuity-and-indexing, runtime-executor-and-hooks, extraction-and-package-boundaries, causal-context-routing-and-affordances.
- Phases where SWE-1.6 wins: keeping large resumable remediation trains visible when they are actively worked, especially security audit and daemon resilience if operational continuity matters more than taxonomy.

## JSONL delta row
{"iter_id": "044", "timestamp_utc": "2026-05-16T03:50:04Z", "executor": "cli-codex", "model": "gpt-5.5", "reasoning_effort": "medium", "track": 11, "status": "complete", "convergent_phases": 8, "divergent_phases": 6, "primary_evidence_files": ["iter-035", "026/spec.md", "026/resource-map.md"]}