# Deep Research Strategy - GPT Lineage Round 2

## Topic

Continue and deepen research into perfecting `.opencode/specs/deep-loops/030-agent-loops-improved` across phases 001-009 and its deep-loop tooling, with `stopPolicy=max-iterations` and 35 iterations.

## Key Questions

- [x] Which round-1 findings are still live, fixed, or partially fixed?
- [x] Which phases and sub-phases still contradict their own completion evidence?
- [x] Which runtime fan-out/salvage/merge/convergence bugs remain beyond the two round-1 confirmed bugs?
- [x] Is the drift caused by one shared generator/backfill gap or independent manual mistakes?
- [x] What concrete remediation backlog should close comment hygiene, registry staleness, metadata drift, and forced-depth controls?

## Known Context

- Round 1 produced a 26-finding report and then phase `009-research-backlog-remediation` was scaffolded.
- Phase `009/001` appears complete and fixes the research/review registry alias issue in `fanout-merge.cjs`.
- Phase `009/002`, `009/003`, and `009/004` exist but remain pending or not started, so timeout override, comment hygiene, salvage padding, phase-map sync, and completion_pct sync remain live.
- Root packet metadata now includes phase `009`, but its graph/description surfaces are still stale or truncated.

## Non-Goals

- Do not modify files outside this lineage artifact directory.
- Do not implement the recommended fixes.
- Do not treat round-1 findings as live without fresh evidence.

## Stop Conditions

- Stop only after iteration 35 because operator set `stopPolicy=max-iterations`.
- Treat convergence signals before iteration 35 as telemetry.

## What Worked

- Comparing root metadata, phase 009 metadata, and live directories exposed a recurring generator/backfill gap.
- Reading current runtime code separated fixed defects from stale registry dispositions.
- Cross-checking review reports against current code identified stale-active findings.
- Grep across command and skill surfaces found comment-hygiene scope broader than the six command YAML markers.

## What Failed

- Broad packet grep includes historical archive logs; final findings cite live source files, not archived tool output.
- Absence checks for checklist/decision-record artifacts rely on glob evidence plus surrounding spec status rather than a single citable file line.

## Ruled-Out Directions

- Do not report `fanout-merge.cjs` alias dropping as still live; the code now normalizes `findings` to `keyFindings`.
- Do not claim phase 009 is absent; it exists and partially remediates round 1.
- Do not rely on registry status alone for current truth; registries are stale until adjudicated.
- Do not fix every stale doc manually first; the shared root cause is a missing sync/backfill/semantic-validation pipeline.

## Next Focus

Synthesis complete; next work belongs in implementation planning for the remaining 009 children and a possible `009/005` metadata/registry adjudication child if scope needs separation.
