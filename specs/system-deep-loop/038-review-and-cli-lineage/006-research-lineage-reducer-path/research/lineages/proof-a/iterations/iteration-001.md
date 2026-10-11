---
title: "Iteration 1: Which packet file documents the deep-research reducer's --artifact-dir flag, and the missing-value exit code"
trigger_phrases: []
---
# Iteration 1: Which packet file documents the deep-research reducer's --artifact-dir flag, and the missing-value exit code

## Focus

Answer the lineage's two key questions from the packet's own docs and the deep-research reducer source only: which file in this packet documents the deep-research reducer's `--artifact-dir` flag, and what exit code a missing value produces. No live run of the reducer, workflows, or tests; every claim resolves to packet text or reducer source text.

## Actions Taken

- Grepped the packet directory for `artifact-dir`/`artifactDir` and read all four packet docs that matched: `spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md`.
- Located the deep-research reducer CLI at `.skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs` (not the shared runtime reducer) and read its CLI entry point and `--artifact-dir` handling.
- Compared the packet's documentation statements against the reducer's implemented guard to separate the requirement source, the work record, and the behavior documentation.

## Findings

1. `implementation-summary.md` is the packet file that documents the deep-research reducer's `--artifact-dir` flag: it states that "the deep-research reducer takes `--artifact-dir <path>`" [SOURCE: specs/system-deep-loop/038-review-and-cli-lineage/006-research-lineage-reducer-path/implementation-summary.md:52], records the exit-code decision [SOURCE: specs/system-deep-loop/038-review-and-cli-lineage/006-research-lineage-reducer-path/implementation-summary.md:81], and carries the verification row for the missing-value case [SOURCE: specs/system-deep-loop/038-review-and-cli-lineage/006-research-lineage-reducer-path/implementation-summary.md:93].

2. A missing `--artifact-dir` value produces exit code **1**. The reducer source defines the guard and its exit: the condition treats an absent value or a next token starting with `--` as missing [SOURCE: .skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs:3154], writes `[deep-research] --artifact-dir requires a path value` to stderr [SOURCE: .skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs:3155], and calls `process.exit(1)` [SOURCE: .skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs:3156].

3. The other packet files name the flag but do not document its missing-value behavior, so they do not displace `implementation-summary.md` as the documenting file: `spec.md` lists `--artifact-dir <path>` on the deep-research reducer CLI as an in-scope deliverable [SOURCE: specs/system-deep-loop/038-review-and-cli-lineage/006-research-lineage-reducer-path/spec.md:71], `tasks.md` records the implementation task [SOURCE: specs/system-deep-loop/038-review-and-cli-lineage/006-research-lineage-reducer-path/tasks.md:43] and its check ("missing value exits 1 with `--artifact-dir requires a path value`") [SOURCE: specs/system-deep-loop/038-review-and-cli-lineage/006-research-lineage-reducer-path/tasks.md:44], and `plan.md` describes the change at overview level [SOURCE: specs/system-deep-loop/038-review-and-cli-lineage/006-research-lineage-reducer-path/plan.md:29]. The packet's exit-code statements (implementation-summary.md:81 and :93, tasks.md:44) agree with the reducer source.

4. The missing-value guard is broader than "flag with nothing after it": any following token that starts with `--` is also read as a missing value, so `reduce-state.cjs <spec> --artifact-dir --lenient` exits 1 rather than treating `--lenient` as a path [SOURCE: .skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs:3154]. Separately, the equals form `--artifact-dir=<path>` is ignored and the reducer falls back to the base research folder, a limitation the packet itself records [SOURCE: specs/system-deep-loop/038-review-and-cli-lineage/006-research-lineage-reducer-path/implementation-summary.md:106].

## Questions Answered

- Which file in this packet documents the deep-research reducer's `--artifact-dir` flag? `implementation-summary.md` — it documents the flag, its exit-code decision, and its verification; `spec.md` is the requirement source, `tasks.md` the work record, `plan.md` the plan.
- What exit code does a missing `--artifact-dir` value produce? Exit code 1 (reducer source), corroborated by the packet's `implementation-summary.md` and `tasks.md`.

## Questions Remaining

- None for this topic.

## Ruled Out

- Scoring the shared runtime reducer (`runtime/scripts/reduce-state.cjs`) as the packet's reducer of record: the packet scopes the change to `.skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs` [SOURCE: specs/system-deep-loop/038-review-and-cli-lineage/006-research-lineage-reducer-path/spec.md:83], and the shared runtime copy's CLI entry is a different surface.

## Dead Ends

- None. The topic was answerable from the packet docs plus the reducer CLI entry point; no search angle had to be abandoned.

## Edge Cases

- Ambiguous input: "This packet" could be read as the parent packet or phase 6; the lineage's bound `spec_folder` is phase 6 (`006-research-lineage-reducer-path`), and the flag is documented there, so that interpretation was used.
- Contradictory evidence: none. The packet's exit-code statements and the reducer source agree on exit 1.
- Missing dependencies: none. Both cited surfaces exist and were read.
- Partial success: none. All four findings are complete and cited.

## Sources Consulted

- specs/system-deep-loop/038-review-and-cli-lineage/006-research-lineage-reducer-path/spec.md:71,83
- specs/system-deep-loop/038-review-and-cli-lineage/006-research-lineage-reducer-path/plan.md:29,61
- specs/system-deep-loop/038-review-and-cli-lineage/006-research-lineage-reducer-path/tasks.md:43,44
- specs/system-deep-loop/038-review-and-cli-lineage/006-research-lineage-reducer-path/implementation-summary.md:52,81,93,106
- .skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs:3151-3156

## Assessment

- `newInfoRatio`: `1.0`
- Novelty justification: first pass on this topic for the lineage; all four findings are new.
- Questions addressed: both key questions.
- Questions answered: both key questions.
- Confidence: high — the answer is a direct packet-doc statement plus the reducer's own guard, and the two agree.

## Reflection

- Worked: reading the packet docs before the source isolated the four files mentioning the flag, then the CLI entry point supplied the behavioral fact the question pairs with the doc answer.
- Did not work: nothing failed; the only cost was confirming which reducer copy is "the deep-research reducer" (the packet scopes it to the `deep-research/scripts/` copy, not the shared runtime copy).
- Would do differently: nothing material for a bounded lookup; the same doc-first then source order is the right one.

## Recommended Next Focus

None. `stopPolicy: max-iterations` with one configured iteration; synthesis follows.
