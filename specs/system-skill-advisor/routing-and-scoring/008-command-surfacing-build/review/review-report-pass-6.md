# Review Report: Command Surfacing Build, Pass Six (three lineages)

- Review target: `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build` (spec-folder)
- Pass: the sixth review pass. It read the code this branch changed after pass five closed (`ddb12a6852c..85550ee946e`, phases 033 to 036) and this branch's net change to the 12 files merge `c88dabe8292` resolved (`review/review-scope-6.txt`, three areas).
- Executor for every lineage: `cli-opencode` with `opencode-go/deepseek-v4.1-flash` at reasoning effort max, three iterations each, convergence threshold 0.10, run through `fanout-run.cjs` (exit 0).
- Brief: `review/review-brief-6.txt`. Config: `review/deep-review-fanout-config-pass-6.json`.
- Paths: a bare `scratch/` path in this report is under `037-review-pass-six-remediation/scratch/` in the packet.

---

## 1. Executive Summary

- **Verdict: PASS.** P0 0, P1 0, P2 11. Six P2 are fixed in phase 037 and five carry a reason.
- **Convergence:** last new-findings ratios scorer 0.25, arena-config 0.40 and merge-docs 0. The two above 0.10 found P2 only, which pass five's rule counts as converged.
- **No stored number moved:** the 033 arm rescored after the fixes is byte-identical to phase 036's summary (`scratch/after.txt`).
- **Holdout:** the brief barred the prompt files except through `jq 'del(.prompt)'` and barred `--summary`. This report claims no more than that for the lineages.

## 2. Counts

`jq -r '[.openFindings[] | select(any(._lineages[]?; tostring | test("-6$")))] | group_by(.severity) | map("\(.[0].severity) \(length)") | join(", ")' review/deep-review-findings-registry.json` prints `P2 11`. The merged registry keeps active rows of earlier passes, so its overall counts are not this pass's counts.

## 3. Findings

| Lineage | File | Finding | Disposition |
|---|---|---|---|
| scorer-6 | `routing-accuracy/README.md:135` | A `cat` of the document still called a start | Fixed: a `cat` counts as a read, a start needs a checkout write |
| scorer-6 | `command-transcript-score.vitest.ts` shell-step comment | Same claim in a test comment | Fixed |
| scorer-6 | `score-command-transcripts.mjs:2035` | `scoreRun` return type omits `startShape` | Fixed in the `@returns` union |
| scorer-6 | `score-command-transcripts.mjs:752` | A second heredoc on one opening line is not stripped | Reason: no stored run line has one, and stripping each pair in order is a parser change no number rests on |
| scorer-6 | `score-command-transcripts.mjs:327` | A write with no named target counts inside the checkout | Reason: the decline and skill-only counts share the boundary, and an unlocated write stays on the cautious side for `unsafe` |
| arena-config-6 | `vitest.config.ts:14` | Only `TMPDIR` is set | Fixed: `TEMP` and `TMP` point at the same folder |
| arena-config-6 | `vitest.config.ts:16` | The folder is removed on a clean exit only | Fixed in the comment: a signal-killed run leaves it |
| arena-config-6 | `vitest.config.ts:14` | The stress config has no per-run folder | Reason: no stress test writes a health record, as the lineage's own scope proof shows |
| arena-config-6 | `command-behaviour-guards.vitest.ts:755` | The buffer test never measures its listing | Fixed: asserts above 1 MiB, fails at 3,000 files with 558018 |
| arena-config-6 | `prepare-behaviour-arena.mjs:150` | `ENOBUFS` reported as `spawn_failed` | Reason: the cap is 512 MiB, about 2.7 million paths, and a test needs a new buffer setting |
| merge-docs-6 | `changelog/skilled/v4.0.2.1.md:480` | The system-spec-kit range stops at 2.13.3.0 | Reason: a published release, which D2 forbids editing. Logged as waiting on the operator |
| merge-docs-6 | `README.md:682` | A health record promised on every prompt hook | Fixed: names Claude Code, Codex, Devin and Cursor, and the four runtimes that write none |
