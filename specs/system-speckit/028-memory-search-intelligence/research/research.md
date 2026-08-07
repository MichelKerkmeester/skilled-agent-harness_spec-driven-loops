# Deep Research Synthesis: System Speckit Alignment Audit

## Executive Synthesis (converged at 20 iterations — operator stop, every iteration newInfoRatio = 1.0)

**Question:** Are all feature catalogs, manual testing playbooks, skill references/assets/SKILL.md, READMEs, code READMEs, benchmarks, and stress tests 100% aligned with the last ~50 specs of system-speckit work (backend, integration, commands)?

**Answer: No.** The *code and runtime* are largely current with the recent specs; the drift is concentrated in the **documentation surfaces** (catalogs, indexes, stale comments) and, notably, in the **validation tooling that is supposed to catch that drift**. Every one of the 20 iterations surfaced fully-novel, cited misalignments — the corpus is broad, not exhausted.

### Highest-severity (fix first)

1. **Flag-name drift — doc contradicts code.** `feature-flags.md` names `SPECKIT_RETENTION_FORGETTING_V1`; `ENV_REFERENCE.md` and live code use `SPECKIT_RETENTION_FORGETTING`. A consumer following the spec sets a flag that does not exist.
2. **Benchmark index stale + self-contradictory.** `mcp_server/benchmarks/README.md` lists only May 17/20 rows (misses the checked-in May 21 HOLD report and 028's corrected criterion-4 benchmark); inside `benchmark-status.md`, one section says Track C is "proposed / not run / no code" while a later section records 13 data-quality switches built and phase-040 measured verdicts.
3. **Envelope-fidelity default/name drift + stale code comment.** Phase-027 summary says default-**OFF** `SPECKIT_ENVELOPE_FIDELITY_V1`; current command presentation says default-**ON** `SPECKIT_ENVELOPE_FIDELITY`; and `formatters/search-results.ts` still carries a comment describing the fragment as "gated dark / off by default."

### Recurring patterns

- **A. Docs/catalogs/indexes lag the code.** Feature-flag catalog missing the late-028 default-on survivors, built-but-held tail-lane flags, and the data-quality flag set; manual-playbook root index says 411 scenarios / 450–453 high-water while the table already holds 454–455; `MODULE_MAP.md` says 19 catalog categories vs the current 24; schema-version and soft-delete-tombstone catalogs preserve pre-phase-002 semantics.
- **B. Coverage gaps.** Live under-surfacing/display-floor fix has code regression tests but **no named manual-playbook scenario**; corrected benchmarks have no skill-local rows; `/memory:manage` and `/doctor speckit` don't expose `memory_embedding_reconcile`; no dedicated rescue-authority (`SPECKIT_RETRIEVAL_RESCUE_MODE`) catalog entry.
- **C. Validation tooling has holes that let drift through.** `validate_document.py` has no feature-catalog doc-type detector; placeholder test-label rows (`| — | Automated test | — |`) pass validation unchallenged; the link-checker doesn't catch label drift; feature-catalog templates define only two test-type values (`Automated test`, `Manual playbook`) yet docs use undefined ones (`Integration`).
- **D. Doc claims exceed test reality.** Manual playbooks state that review-depth-v2 / graphless-fallback / stop-gate tests "validate" behavior at more depth than the tests actually assert.
- **E. A cross-cutting code issue (not just docs).** Deep-review and deep-research share a `memory_context`-before-initialization ambiguity in their auto YAML.

### What IS aligned (credited, not just faults)

Live runtime/eval code, the `/memory:search` envelope contract, `/speckit:resume`, `/memory:save`, council runtime + graph tests, deep-review README + quality-gates catalog, `lib/eval/README.md`, and the embedding-reconcile README were all found current. The drift is a documentation/tooling-lag problem, not a behavioral one.

### Coverage (20 iterations, no early convergence)

Specs inventory → feature-flag catalog → manual playbook → command presentation → runtime formatters/eval → benchmarks → stress-tests/validation → code READMEs → deep-loop (review/council/test-depth) → cross-skill test-label taxonomy → doc-quality validation tooling → generated-metadata + advisor/search-index docs → doc-trigger sanitizer. Every surface the request named was reached; `newInfoRatio` stayed 1.0 throughout, so the finding space was still productive at the operator-chosen stop.

> **Provenance note:** every finding below carries `[SOURCE: file:line]` (or a labelled `[INFERENCE]`). This executive layer was written by the orchestrator on convergence; the per-iteration evidence log below is the deep-research leaf's verbatim output.

---

## Current Status

Converged at operator-requested 20 iterations (stop policy: max-iterations, capped from 40 by operator). All 20 iterations completed with `newInfoRatio = 1.0`; the per-iteration evidence log follows.

## Findings Added in Iteration 1

1. Packet 028 is an authoritative late implementation source with broad memory-search, data-quality, review-remediation, and dark-flag child scope; root docs predating its July updates should be revalidated. [SOURCE: .opencode/specs/system-speckit/028-memory-search-intelligence/spec.md:121]
2. The skill-local benchmark index is stale relative to packet 028 benchmark and flag-reckoning evidence. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/benchmarks/README.md:42] [SOURCE: .opencode/specs/system-speckit/028-memory-search-intelligence/benchmark-status.md:7]
3. `feature-flags.md` names `SPECKIT_RETENTION_FORGETTING_V1`, while `ENV_REFERENCE.md` and code use `SPECKIT_RETENTION_FORGETTING`. [SOURCE: .opencode/specs/system-speckit/028-memory-search-intelligence/feature-flags.md:23] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md:132]
4. `MODULE_MAP.md` says feature-catalog topology has 19 categories, but current catalog/playbook surfaces include later category families through 24. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/MODULE_MAP.md:381] [SOURCE: .opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md:37]

## Open Threads for Next Iterations

- Enumerate all missing/stale feature-flag catalog entries under `feature_catalog/feature-flag-reference/`.
- Audit manual playbook per-flag scenarios for late packet-028 graduated, held, and deleted flags.
- Reconcile benchmark index expectations with packet 028 benchmark-status evidence.

## Findings Added in Iteration 2

1. The dedicated feature-flag catalog table is missing late packet-028 survivor flags, while packet 028 defines them as the final surviving switches. [SOURCE: .opencode/skills/system-spec-kit/feature_catalog/feature-flag-reference/1-search-pipeline-features-speckit.md:31] [SOURCE: .opencode/specs/system-speckit/028-memory-search-intelligence/feature-flags.md:17]
2. Built-but-held tail-lane flags are documented in packet/env/code sources but absent from feature-catalog flag coverage by env var name. [SOURCE: .opencode/specs/system-speckit/028-memory-search-intelligence/feature-flags.md:73] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/search/search-flags.ts:994]
3. Generated-metadata/data-quality flags have a dedicated environment-reference section but no corresponding feature-catalog entries found by targeted env-var grep. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md:150] [INFERENCE: targeted feature_catalog grep for the listed data-quality env vars returned no files]
4. The retention-forgetting flag-name mismatch remains high severity: packet prose names `SPECKIT_RETENTION_FORGETTING_V1`, while env/code use `SPECKIT_RETENTION_FORGETTING`. [SOURCE: .opencode/specs/system-speckit/028-memory-search-intelligence/feature-flags.md:23] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md:132]

## Updated Open Threads

- Audit manual-testing scenarios for the late-028 flag and verdict set.
- Audit benchmark index/promotion flow against packet 028's corrected benchmark and phase-040 graduation evidence.