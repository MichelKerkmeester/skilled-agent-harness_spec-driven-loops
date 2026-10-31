# Session evidence: phase 037 build and live run (orchestrator record, 2026-09-30)

Branch `worktrees/071-cli-jev-sk-alignment` (worktree 071). Build commit `b34b9d1907`, phase-doc commit `e060ac29fd`. Raw outputs sit beside this file and under `../live-run/`.

## Operator decisions

- "Test it first (Recommended)": measure Pi's native classify() against the jev CLI before any integration change.
- Live run: "Pi side only (Recommended)". 333 Pi calls through Pi's own OpenRouter credential, compared against the recorded 019 CLI answers. No fresh CLI calls.

## Executors

- DeepSeek V4.1 Flash on Cline at xhigh wrote the design, the scorer, the tests and the docs, then the fix for the two review P1s (`K` and the untested surfaces).
- MiMo v2.6 Pro at high reviewed. First pass `review-mimo-r1.txt`: VERDICT FAIL on two P1s (K was `plan.size`, so rebuild-excluded rows left the coverage denominator; `columnLine` and `meanMap` untested and no test drove `main` past the census). Second pass `review-mimo-r2.txt`: both fixed, no findings, VERDICT PASS. The fix made `K = plan.size + excluded.length` and added four tests.
- P2 recorded, not fixed: report.json does not name that the CLI latency is recorded (019) while Pi's is fresh. The judge compares one-decimal rounded percentages (unreachable at K=111). A timeout records its status but prints no own skip line, and a jev exit outside 0/2/3/130 records `unmeasured` without a line.

## Gates from the final build state

- `node --test` on the test file: 41 pass, 0 fail (`tests.txt`).
- `verify_alignment_drift.py --check-exact-headers --fail-on-warn` on the two code files: Errors 0, Warnings 0 (`drift.txt`).
- Comment hygiene exit 0 on both files. Key grep exit 1 on the pi-transport folder and both measurement docs.
- Zero-call default run exit 0, census printed (`census.txt`).
- `compiled-route-guard.cjs` all hubs fresh, `ci-leaf-manifest-freshness.cjs` 15/15 fresh, `parent-skill-check.cjs` cli-classifier OK 0 warnings, `sync-skills-hermes.cjs --check` 72 in sync.
- Docs from the build pass: all changed docs VALID, playbook package PASS (7 scenarios), catalog 0 violations, HVR hard blockers 0.

## The approved live run (1 min 29 s wall, exit 0)

Command: `node .skilled/skills/cli-classifier/benchmark/pi-transport/score-pi-transport.mjs --pi --out <037>/scratch/live-run`. Records: `live-run/calls.jsonl` (334 lines: one model check and 333 choice calls, all `measured`), `live-run/report.json`, stdout `live-run.stdout.txt`. Key grep over all three: 0 matches.

```
pi gate: model=openrouter/typesafe/jev-1.13 available=yes openrouter_models=7
pi: rows=111 calls=333 measured=111 unmeasured=0 timeouts=0 excluded=0
column pi: rows=111 measured=111 p50_ms=249 p95_ms=340 cost_per_100=0.0022
column cli: rows=111 measured=111 p50_ms=326 p95_ms=387 calls=333
metrics: coverage=100.0 agreement=95.5 median_abs_dp=0.0100
verdict pi-transport: adopt K=111 M=111 coverage=100.0 agreement=95.5 median_abs_dp=0.0100 p95_ms=340/387 cost_per_100=0.0022
```

## What the numbers mean (session reading)

- Agreement 95.5 is 106 of 111 rows. One more disagreement would give 94.6 and `keep-cli`, so the margin over the bar is one row.
- The five disagreements are all near ties, read from the two record files: `rr-iter3-071` Pi sk-doc 0.52 vs CLI system-spec-kit 0.56, `rr-iter3-081` Pi system-spec-kit 0.53 vs CLI sk-prompt 0.50, `rr-iter3-125` Pi system-spec-kit 0.34 vs CLI none 0.32, `rr-iter3-127` Pi system-deep-loop 0.34 vs CLI system-spec-kit 0.32, `P1-MCP-002` Pi mcp-code-mode 0.55 vs CLI sk-code 0.50.
- Latency compares fresh Pi calls with CLI calls recorded on 2026-09-29, so it is not a same-day pair. Pi's p95 is 340 ms against the recorded 387 ms, well inside the 1.5x bound either way.
- Cost: Pi reports 0.0022 USD per 100 calls on OpenRouter.
- No integration change was made. Wiring Pi in as a cli-classifier transport, or teaching cli-pi workers to call classifiers, is a later phase.
