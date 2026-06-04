# Iteration 040 — State Hygiene

## Focus
Validate old vs new research state, stale registry/dashboard/research.md issues, and repairs needed before an official resume of packet 027. This iteration treats the continuation artifact as authoritative for new work and the older flat `research/` files as lineage-only evidence.

## Findings
1. The continuation config explicitly restarts from isolated state: `artifactDir` points to this continuation packet, `progressiveSynthesis` is true, and `lineage.lineageMode` is `restart` because the existing flat research state is stale/inconsistent. [SOURCE: specs/system-spec-kit/027-xce-research-based-refinement/research/027-continuation-21-2026-06-04/deep-research-config.json:4] [SOURCE: specs/system-spec-kit/027-xce-research-based-refinement/research/027-continuation-21-2026-06-04/deep-research-config.json:9-14]
2. The continuation strategy reinforces that all new state must remain isolated under the artifact root and lists 040-060 as the intended continuation sequence, with 040 state hygiene first. [SOURCE: specs/system-spec-kit/027-xce-research-based-refinement/research/027-continuation-21-2026-06-04/deep-research-strategy.md:5] [SOURCE: specs/system-spec-kit/027-xce-research-based-refinement/research/027-continuation-21-2026-06-04/deep-research-strategy.md:19-45]
3. The old shared state is mixed-generation and non-resumable as a single counter: it contains multiple config records, repeated iteration numbers 1-10 for different runs, then string iterations 030-039 out of chronological order. [SOURCE: specs/system-spec-kit/027-xce-research-based-refinement/research/deep-research-state.jsonl:1-16] [SOURCE: specs/system-spec-kit/027-xce-research-based-refinement/research/deep-research-state.jsonl:29-50]
4. The old findings registry is stale relative to completed runs: pt01, pt02, and pt03 still show all questions open, zero completed iterations, and empty key findings, despite the old state recording completed iterations and convergence events. [SOURCE: specs/system-spec-kit/027-xce-research-based-refinement/research/findings-registry.json:2-3] [SOURCE: specs/system-spec-kit/027-xce-research-based-refinement/research/findings-registry.json:17-27] [SOURCE: specs/system-spec-kit/027-xce-research-based-refinement/research/deep-research-state.jsonl:5-15]
5. The old merged `research.md` claims total_iterations 29 and says iterations 030-039 continue below, but the file stops after introducing 030-039 and does not include their synthesis; before official resume, reducer outputs need regeneration from the old state plus current continuation deltas rather than manual edits. [SOURCE: specs/system-spec-kit/027-xce-research-based-refinement/research/research.md:1-8] [SOURCE: specs/system-spec-kit/027-xce-research-based-refinement/research/research.md:42-45]

## Ruled Out
- Directly appending to shared `research/deep-research-state.jsonl` was ruled out because the task explicitly forbids it and the continuation config already declares restart isolation. [SOURCE: specs/system-spec-kit/027-xce-research-based-refinement/research/027-continuation-21-2026-06-04/deep-research-config.json:11-14]
- Treating the old registry as authoritative was ruled out because it reports zero completed work while the old state records completed iterations. [SOURCE: specs/system-spec-kit/027-xce-research-based-refinement/research/findings-registry.json:20-27] [SOURCE: specs/system-spec-kit/027-xce-research-based-refinement/research/deep-research-state.jsonl:30-40]

## Edge Cases
- Ambiguous input: none; iteration 040 was explicitly scoped to state hygiene.
- Contradictory evidence: old state shows completed work while old registry reports all open; preserve both and repair through reducer regeneration, not manual registry edits. [SOURCE: specs/system-spec-kit/027-xce-research-based-refinement/research/deep-research-state.jsonl:30-40] [SOURCE: specs/system-spec-kit/027-xce-research-based-refinement/research/findings-registry.json:17-27]
- Missing dependencies: no dashboard file was present in the continuation artifact root; fallback was to inspect old state, old registry, old research.md, and continuation controls. [SOURCE: specs/system-spec-kit/027-xce-research-based-refinement/research/027-continuation-21-2026-06-04/research.md:12-18]
- Partial success: complete for state-hygiene diagnosis; no repair was performed by scope.

## Sources Consulted
- specs/system-spec-kit/027-xce-research-based-refinement/research/027-continuation-21-2026-06-04/deep-research-config.json:4-14
- specs/system-spec-kit/027-xce-research-based-refinement/research/027-continuation-21-2026-06-04/deep-research-strategy.md:5-45
- specs/system-spec-kit/027-xce-research-based-refinement/research/deep-research-state.jsonl:1-50
- specs/system-spec-kit/027-xce-research-based-refinement/research/findings-registry.json:1-29
- specs/system-spec-kit/027-xce-research-based-refinement/research/research.md:1-45

## Assessment with `newInfoRatio`
newInfoRatio: 0.80. Four findings are fully new to the continuation packet and one is partially known from the config lineage note. Official resume should first reconcile old shared state into a read-only lineage summary, regenerate registry/dashboard/research synthesis from parsed iteration records, and only then merge continuation deltas.

## Recommended Next Focus
Proceed to iteration 041 path/root drift: normalize `specs/` vs `.opencode/specs` citations and `/speckit:*` vs `/spec_kit:*` command references before any official resume or implementation planning.
