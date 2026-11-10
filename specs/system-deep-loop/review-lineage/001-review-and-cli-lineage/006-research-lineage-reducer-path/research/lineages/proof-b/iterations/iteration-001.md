# Iteration 1: Packet file documenting the reducer --artifact-dir flag and the missing-value exit code

## Focus

Single-iteration cap (config.maxIterations = 1). Answer the research topic from the packet's own docs and the deep-research reducer source only: find which file in `specs/system-deep-loop/038-review-and-cli-lineage/006-research-lineage-reducer-path` documents the deep-research reducer's `--artifact-dir` flag, and establish the exit code a missing flag value produces.

## Actions Taken

- Read the phase packet docs: `spec.md` (137 lines), `plan.md` (99 lines), `tasks.md` (82 lines), `implementation-summary.md` (111 lines).
- Ran a content search for `artifact-dir` across the packet; the only packet files that mention it are `spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md`.
- Read the reducer CLI entry point in `.skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs` (lines 3141-3194) for the flag-parsing branch, and line 2942 for the `artifactDir` option comment, and lines 2955-2957 for the option's resolution.
- Reconciled the documented exit code against the source branch rather than trusting the doc alone.

## Findings

1. `implementation-summary.md` is the packet file that documents the deep-research reducer's `--artifact-dir` flag and its behavior: line 52 states "The deep-research reducer takes `--artifact-dir <path>`, the same flag the deep-review reducer already had"; line 81 records the design decision "Exit 1 when `--artifact-dir` has no value. The research reducer already uses exit 1 for usage errors; review uses 3"; line 93 records the verification row "Missing flag value | PASS, exit 1 with `[deep-research] --artifact-dir requires a path value`". [SOURCE: specs/system-deep-loop/038-review-and-cli-lineage/006-research-lineage-reducer-path/implementation-summary.md:52,81,93]
2. Three other packet files specify or track the flag but do not document its behavior: `spec.md:71` lists it in scope ("`--artifact-dir <path>` on the deep-research reducer CLI and an `artifactDir` option on `reduceResearchState`"), with the deliverable at `spec.md:46` and success criterion SC-001 at `spec.md:114`; `plan.md:29` names the change and `plan.md:61` describes the binding ("The bind step turns that into `--artifact-dir <folder>`"); `tasks.md:43` (T003) records the delegation and `tasks.md:44` (T004) records "missing value exits 1 with `--artifact-dir requires a path value`". No packet file is a dedicated reducer CLI reference; the flag is documented across these four files, and only `implementation-summary.md` (plus the T004 task row) states the missing-value exit code. [SOURCE: specs/system-deep-loop/038-review-and-cli-lineage/006-research-lineage-reducer-path/spec.md:46,71,114; specs/system-deep-loop/038-review-and-cli-lineage/006-research-lineage-reducer-path/plan.md:29,61; specs/system-deep-loop/038-review-and-cli-lineage/006-research-lineage-reducer-path/tasks.md:43,44]
3. A missing value produces exit code 1, confirmed in the reducer source: after locating `--artifact-dir`, the CLI tests whether the next token is absent or begins with `--`, writes `[deep-research] --artifact-dir requires a path value` to stderr, and calls `process.exit(1)`; the space-separated value is excluded from positionals so it cannot be misread as the spec folder. [SOURCE: .skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs:3151,3152,3153,3154,3155,3156,3159]
4. The packet docs and the reducer source agree, including the one documented limitation: `implementation-summary.md:106` says the equals form `--artifact-dir=<path>` "is dropped with other `--` tokens and the reducer falls back to the base folder", which matches the source's space-only `args.indexOf('--artifact-dir')` lookup (line 3151) and its positional filter that drops every token starting with `--` (line 3159); the `artifactDir` option itself resolves an explicit folder when given and falls back to `resolveArtifactRoot(...).artifactDir` otherwise (lines 2955-2957). [SOURCE: specs/system-deep-loop/038-review-and-cli-lineage/006-research-lineage-reducer-path/implementation-summary.md:106; .skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs:2942,2955,2956,2957,3151,3159]

## Questions Answered

- Q1 (which packet file documents the `--artifact-dir` flag): answered -- `implementation-summary.md` documents the flag and its behavior; `spec.md`, `plan.md`, and `tasks.md` specify and track it.
- Q2 (exit code for a missing value, per the reducer source): answered -- exit 1.
- Q3 (docs vs source agreement): answered -- they agree on exit 1, the stderr message, and the ignored equals form.

## Questions Remaining

- None. The topic is two-part and both parts are answered with cited evidence.

## Ruled Out

- Web sources: the topic restricts the answer to the packet's docs and the reducer source, so no external retrieval was attempted.
- The deep-review reducer as the subject: `spec.md:43` cites it only as the precedent, and `spec.md:77` places the deep-review reducer out of scope for this phase.
- Treating `spec.md` as the "documenting" file without checking: `spec.md` specifies the flag as a deliverable; the behavioral documentation with the exit code lives in `implementation-summary.md` (and the T004 task row).

## Dead Ends

- None. Every consulted source was reachable and on-topic.

## Edge Cases

- Ambiguous input: "documents" could mean "specifies" (`spec.md`) or "documents the behavior" (`implementation-summary.md`); both are reported, with the behavioral answer identified as the one that carries the exit code.
- Contradictory evidence: none -- docs and source agree.
- Missing dependencies: none -- no web or runtime dependency was needed.
- Partial success: none -- all planned reads completed.

## Sources Consulted

- specs/system-deep-loop/038-review-and-cli-lineage/006-research-lineage-reducer-path/spec.md:43,46,71,77,114
- specs/system-deep-loop/038-review-and-cli-lineage/006-research-lineage-reducer-path/plan.md:29,61
- specs/system-deep-loop/038-review-and-cli-lineage/006-research-lineage-reducer-path/tasks.md:43,44,55
- specs/system-deep-loop/038-review-and-cli-lineage/006-research-lineage-reducer-path/implementation-summary.md:52,81,93,97,106
- .skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs:2942,2955,2956,2957,3151,3152,3153,3154,3155,3156,3159,3162,3163,3164,3165,3166,3176

## Assessment

- New information ratio: 0.9
- Questions addressed: Q1, Q2, Q3
- Questions answered: Q1, Q2, Q3
- Confidence: high on the documenting file and line anchors (direct reads, content search across the packet limited the candidate set); high on exit 1 (source branch read directly and corroborated by two packet docs); high on the equals-form agreement (source parsing logic read directly).

## Reflection

- What worked and why: enumerating every packet mention of `artifact-dir` with a content search before reading the files; that turned "which file" from a guess into a four-file candidate set with distinct roles (spec, plan, tasks, summary), and only the summary plus the T004 row carried the exit code.
- What did not work and why: nothing failed; the initial suspicion that `spec.md` would be the single answer did not survive the read, because `spec.md` specifies the flag without stating its runtime behavior.
- What I would do differently: if the packet had a dedicated reducer reference doc, check it first; here the packet has none, so the behavioral answer had to come from the implementation summary plus the source.

## Recommended Next Focus

None -- cap reached (1 of 1). Proceed to synthesis with stopReason maxIterationsReached.
