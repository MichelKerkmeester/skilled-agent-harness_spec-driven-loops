# Iteration 057: memory_context Curator Phase Decision

## Focus

Evaluate whether the `memory_context` curator should become a new 027 phase for shadow-only curated context packaging, or be folded into an existing phase.

## Findings

1. Prior 027 research already split the bundled Coco extras from the memory curator: Coco few-shot exemplars belong in 028, while LLM-curated `memory_context` is a 027 memory-backend concern that attaches `data.curatedContext` and does not touch coco-index ranking paths. [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/research/iterations/iteration-039.md:53-59]
2. The original RQ-B2 verdict is ADAPT shadow-first: add an optional post-retrieval curator, default it off, keep deterministic packaging as fallback, and treat LLM output as a package plan rather than ranking authority. [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/research/iterations/iteration-026.md:5-8]
3. The curator needs a budget split that is not currently captured by the external `limit`: prior findings call for separate `retrievalCandidateLimit` or `curationCandidateLimit`, `presentationLimit`, and `curationTokenBudget`. [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/research/iterations/iteration-026.md:37-49] [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/research/iterations/iteration-039.md:147-148]
4. The strongest safe integration point is presentation packaging after deterministic retrieval, not scoring: prior findings say the curator must not mutate scores or retrieval ordering and should attach `data.curatedContext` or affect presentation output only. [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/research/iterations/iteration-026.md:22-35]
5. Folding the curator into existing Phase 008 would blur concerns: Phase 008 already owns learning-feedback reducers and shadow-first retention/reducer paths, while the curator is a response-packaging feature with its own LLM cache, schema, timeout, telemetry, and eval questions. [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/004-learning-feedback-reducers/spec.md:61-86] [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/research/iterations/iteration-026.md:82-108]

## Negative Knowledge / Ruled Out Directions

- Do not resume the old bundled `010-coco-memory-context-extras` package in 027: prior synthesis explicitly split Coco exemplars to 028 and kept only memory curator scope in 027. [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/research/iterations/iteration-039.md:53-59]
- Do not let active curation reorder canonical `data.results` or mutate retrieval scores; that would break the deterministic retrieval trust boundary. [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/research/iterations/iteration-026.md:22-35]
- Do not ship active/default-on curation before eval: prior RQ-B2 findings require shadow mode, timeout, schema validation, telemetry, deterministic fallback, and active promotion only after held-out tasks prove lift. [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/research/iterations/iteration-026.md:95-108]

## Recommendation

Add a standalone 027 phase, tentatively `009-memory-context-curator`, scoped to shadow-only curated context packaging. Keep it independent from Phase 008 reducers, with dependencies on the existing retrieval pipeline and optional upstream semantic-trigger improvements. Its v1 deliverable should be default-off/shadow `data.curatedContext` packaging, budget-split knobs, strict ID-only schema validation, cache/timeout/fallback telemetry, and eval criteria for later active promotion.

## Cited Evidence

- .opencode/specs/system-spec-kit/027-xce-research-based-refinement/research/iterations/iteration-039.md:53-59
- .opencode/specs/system-spec-kit/027-xce-research-based-refinement/research/iterations/iteration-026.md:5-8
- .opencode/specs/system-spec-kit/027-xce-research-based-refinement/research/iterations/iteration-026.md:22-49
- .opencode/specs/system-spec-kit/027-xce-research-based-refinement/research/iterations/iteration-026.md:82-108
- .opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/004-learning-feedback-reducers/spec.md:61-86

## Assessment

- New information ratio: 0.75
- Questions addressed: whether to add a new 027 curator phase or fold into an existing phase
- Questions answered: add a standalone phase for shadow-only curated packaging; do not fold into Phase 008.

## Recommended Next Focus

Draft the phase charter for `009-memory-context-curator`: scope, non-goals, dependency on deterministic retrieval, budget-split defaults, telemetry fields, eval gates, and explicit prohibition on ranking mutation.
