# Deep Research Synthesis: research reducer --artifact-dir documentation and missing-value exit code

Lineage: `proof-b` (cli-pi / cline-pass/deepseek-v4.1-flash) · Spec: 038-review-and-cli-lineage/006-research-lineage-reducer-path
Session: `fanout-proof-b-1791561073753-7hht4d` · 1 iteration · Stop policy: max-iterations

## 1. Executive Summary

`implementation-summary.md` is the packet file that documents the deep-research reducer's
`--artifact-dir` flag. It is the only packet file that states the flag's behavior and its
missing-value outcome:

- Line 52: "The deep-research reducer takes `--artifact-dir <path>`, the same flag the
  deep-review reducer already had."
- Line 81 (Key Decisions): "Exit 1 when `--artifact-dir` has no value. The research reducer
  already uses exit 1 for usage errors; review uses 3."
- Line 93 (Verification): "Missing flag value | PASS, exit 1 with `[deep-research]
  --artifact-dir requires a path value`".

**A missing value produces exit code 1.** The reducer source confirms it: on seeing
`--artifact-dir` with no following token, or with a following token that begins with `--`,
the CLI writes `[deep-research] --artifact-dir requires a path value` to stderr and calls
`process.exit(1)`
(`.skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs:3154-3156`).

The flag is also specified and tracked in three other packet files: `spec.md` (in-scope
deliverable at line 71, deliverable list at line 46, success criterion SC-001 at line 114),
`plan.md` (lines 29 and 61), and `tasks.md` (T003 at line 43; T004 at line 44 records the
exit-1 check). No packet file is a dedicated reducer CLI reference, so `spec.md` specifies
the flag, while `implementation-summary.md` documents its behavior.

## 2. Research Topic

Which file in this packet documents the deep-research reducer's `--artifact-dir` flag, and
what exit code does a missing value produce? Answer from the packet's own docs and the
reducer source only.

## 3. Methodology

One iteration (cap = 1, stop policy max-iterations). Evidence: direct reads of the four
packet docs, a content search for `artifact-dir` across the packet (which enumerated every
mention), and direct reads of the reducer's CLI entry point and `artifactDir` option
resolution. In-process LEAF execution: no nested CLI dispatch, no web retrieval, all writes
confined to the lineage directory. The documented exit code was reconciled against the
source branch rather than trusted from the doc alone.

## 4. Findings

1. **The documenting file is `implementation-summary.md`.** It carries the flag's purpose
   (line 52), the exit-code decision (line 81), and the verification row (line 93).
   [implementation-summary.md:52,81,93]
2. **The flag is specified/tracked in `spec.md`, `plan.md`, and `tasks.md`** but those files
   do not document its runtime behavior: `spec.md:71` lists it in scope, `spec.md:46` as a
   deliverable, `spec.md:114` as SC-001; `plan.md:29` names the change and `plan.md:61` the
   bind step that turns `artifact_dir` into `--artifact-dir <folder>`; `tasks.md:43` (T003)
   and `tasks.md:44` (T004, exit-1 check). [spec.md:46,71,114; plan.md:29,61; tasks.md:43,44]
3. **Missing value → exit 1**, from the source: the CLI checks that the token after
   `--artifact-dir` exists and does not start with `--`, writes the stderr message, and
   exits 1; the space-separated value is excluded from the positional list so it cannot be
   misread as the spec folder. [reduce-state.cjs:3151-3156,3159]
4. **Docs and source agree**, including the one documented limitation: the equals form
   `--artifact-dir=<path>` is dropped with other `--` tokens and the reducer falls back to
   the base folder (`implementation-summary.md:106`), which matches the space-only
   `args.indexOf('--artifact-dir')` lookup (line 3151) and the positional filter (line 3159);
   the `artifactDir` option resolves an explicit folder when given (lines 2955-2957).
   [implementation-summary.md:106; reduce-state.cjs:2942,2955-2957,3151,3159]

## 5. Quality Guards

- Source diversity: the answer rests on the packet's own docs (four files) plus the reducer
  source, as the topic requires; the exit code has three independent statements (two packet
  files and the source branch).
- Focus alignment: both halves of the topic were the iteration's only focus; no drift.
- No single weak source: the behavioral answer is corroborated by `implementation-summary.md`
  and the reducer source, which were checked against each other rather than assumed to agree.

## 6. Convergence Report

- Stop reason: `maxIterationsReached` (cap = 1; convergence is telemetry only under the
  max-iterations policy, and was not claimed).
- Total iterations completed: 1.
- Questions answered ratio: 3/3.
- Average newInfoRatio trend: 0.9 (single sample).

## 7. Open Questions

None. The topic is two-part and both parts are answered with cited evidence.

## 8. References

- `specs/system-deep-loop/038-review-and-cli-lineage/006-research-lineage-reducer-path/spec.md:43,46,71,77,114`
- `specs/system-deep-loop/038-review-and-cli-lineage/006-research-lineage-reducer-path/plan.md:29,61`
- `specs/system-deep-loop/038-review-and-cli-lineage/006-research-lineage-reducer-path/tasks.md:43,44,55`
- `specs/system-deep-loop/038-review-and-cli-lineage/006-research-lineage-reducer-path/implementation-summary.md:52,81,93,97,106`
- `.skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs:2942,2955-2957,3151-3159,3162-3166,3176`
