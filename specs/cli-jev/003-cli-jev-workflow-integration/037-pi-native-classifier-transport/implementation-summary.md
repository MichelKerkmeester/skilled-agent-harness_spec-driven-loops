---
title: "Implementation Summary: Phase 37: pi-native-classifier-transport"
description: "Complete. Pi's native `classify()` on `openrouter` `typesafe/jev-1.13` answered the 019 rows at 95.5 percent top-choice agreement and p95 340 ms against the jev CLI's recorded 387 ms, and the one approved live run printed `verdict pi-transport: adopt`. The scorer, its 41 tests and the cli-classifier docs are committed as `b34b9d1907`. No integration change was made."
trigger_phrases:
  - "pi transport summary"
  - "pi native classifier transport status"
  - "classifier census summary"
  - "pi transport verdict"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/037-pi-native-classifier-transport"
    last_updated_at: "2026-09-30T15:48:14Z"
    last_updated_by: "markdown-leaf"
    recent_action: "Rewrote this file with the build, review and live-run results"
    next_safe_action: "None. Wiring Pi as a transport is a later phase on the operator's call"
    blockers: []
    key_files:
      - "specs/cli-jev/003-cli-jev-workflow-integration/037-pi-native-classifier-transport/scratch/live-run/report.json"
      - "specs/cli-jev/003-cli-jev-workflow-integration/037-pi-native-classifier-transport/scratch/verify/session-evidence.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-cli-jev-003-037-pi-native-classifier-transport"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 037-pi-native-classifier-transport |
| **Status** | Complete |
| **Completed** | 2026-09-30, build `b34b9d1907` |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Pi's native classifier runtime can answer the packet's Jev questions, and the one approved live run measured how well. `score-pi-transport.mjs` reads what is installed and available with zero model calls by default. Behind `--pi --out <dir>` it replays the 019 rows through `ModelRuntime.classify()` on `openrouter` `typesafe/jev-1.13`, compares the answers and the timings against the recorded jev CLI side under the keep rule fixed in `spec.md` section 4, and prints one verdict line. The build is committed as `b34b9d1907` on `worktrees/071-cli-jev-sk-alignment`, with the phase record in `e060ac29fd`.

### Phase 37: pi-native-classifier-transport

**Census.** The default run prints Pi 0.99.1, 12 classifier models known with 7 available, all through `openrouter`, `jev 0.6.2` with `provider=official auth=ok`, `llama.cpp: server=none cli=none`, and the 019 baseline's 111 rows and 333 calls. It makes no `classify()` call and writes no file (`scratch/verify/census.txt`).

**Live comparison.** The approved run replayed the 111 rows as 333 `choice` calls, every one `measured`, and compared them with the recorded CLI maps (`scratch/live-run/calls.jsonl`, 334 lines including the model check, and `scratch/live-run/report.json`).

**Verdict lines.**

```
pi: rows=111 calls=333 measured=111 unmeasured=0 timeouts=0 excluded=0
column pi: rows=111 measured=111 p50_ms=249 p95_ms=340 cost_per_100=0.0022
column cli: rows=111 measured=111 p50_ms=326 p95_ms=387 calls=333
metrics: coverage=100.0 agreement=95.5 median_abs_dp=0.0100
verdict pi-transport: adopt K=111 M=111 coverage=100.0 agreement=95.5 median_abs_dp=0.0100 p95_ms=340/387 cost_per_100=0.0022
```

**Docs.** The folder README, the `benchmark/README.md` row, the feature catalog entry with its index row and the playbook scenario with its index row were written through sk-doc and pass `validate_document.py` VALID, with no doc claiming a verdict no run printed.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/cli-classifier/benchmark/pi-transport/score-pi-transport.mjs` | Created | The census, the live arm, the metrics and the keep-rule verdict |
| `.skilled/skills/cli-classifier/benchmark/pi-transport/tests/score-pi-transport.test.mjs` | Created | Every public surface, both backends stubbed, `node --test` |
| `.skilled/skills/cli-classifier/benchmark/pi-transport/README.md` | Created | The folder README through sk-doc |
| `.skilled/skills/cli-classifier/benchmark/README.md` | Modified | One row in section 2 LAYOUT for the new folder |
| `.skilled/skills/cli-classifier/feature-catalog/measurements/pi-transport-comparison.md` and `feature-catalog/feature-catalog.md` | Created and modified | The catalog entry and its index row |
| `.skilled/skills/cli-classifier/manual-testing-playbook/measurements/pi-transport-comparison.md` and `manual-testing-playbook/manual-testing-playbook.md` | Created and modified | The playbook scenario and its index row |
| `scratch/w4-build/design.md`, `scratch/verify/`, `scratch/live-run/` | Created | The design, the gate outputs and the run's records |
| `spec.md`, `plan.md`, `tasks.md`, `acceptance-criteria.md`, `goal.md`, `implementation-summary.md` | Modified | The phase record, closed in this pass |
| `description.json`, `graph-metadata.json` | Derived | Refreshed through `repair-derived.cjs` |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

DeepSeek V4.1 Flash on Cline at xhigh wrote the design, the scorer, the tests and the docs, then the fix for the review findings. MiMo v2.6 Pro at high reviewed read-only. Round 1 printed `VERDICT: FAIL` on two P1s: `K` was `plan.size`, so rebuild-excluded rows left the coverage denominator and `stop (coverage)` could never fire, and `columnLine` and `meanMap` were untested with no test driving `main` past the census. DeepSeek set `K = plan.size + excluded.length` and added four tests (37 to 41), and round 2 printed `VERDICT: PASS` with no findings (`scratch/verify/review-mimo-r1.txt`, `scratch/verify/review-mimo-r2.txt`).

The session ran the zero-call census on the real tree, then one live run on the operator's "Pi side only (Recommended)" yes: 333 Pi calls through Pi's own OpenRouter credential against the recorded 019 CLI answers, no fresh CLI calls. The run took 1 min 29 s, exit 0, and every call is recorded. The build commit is `b34b9d1907`, and the evidence and phase-doc commit is `e060ac29fd`.

The design settled the two open questions: `score-suggested-order.mjs` exports `rotations` and `optionArgs` but not the question literals, so the replay copies the two literals (pinned by a test) and builds each question in process; the CLI side stays the recorded 019 run, and the fresh both-sides `--pi --cli` path exists as the fallback (`scratch/w4-build/design.md`).
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| The default run is a zero-call census (D1) | The packet's pattern from phases 002 and 019: read what is installed and available before any call costs anything |
| Pi is reached through its SDK from a Node script (D2) | The SDK is one of the three documented classifier surfaces (`docs/models.md:103-136`), and a script keeps credentials in Pi's own store |
| Both sides ask Jev 1.13 (D3) | The CLI's 019 baseline ran `jev-1.13.0` through `official`, and Pi asked the same model through `openrouter` `typesafe/jev-1.13`, so the rows line up |
| The keep rule is fixed in `spec.md` before any live run (D4) | A threshold chosen after the numbers arrive would decide the run rather than measure it |
| No integration change here (D5) | The verdict comes first. Wiring Pi into a transport is a later phase on the operator's call |
| DeepSeek writes and MiMo reviews (D6) | Parent D5's roster, with the reverse direction for any MiMo fix and no Claude worker |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

All checks ran from the final build state, with the raw outputs under `scratch/verify/` and `scratch/live-run/`.

| Check | Result |
|-------|--------|
| `node score-pi-transport.mjs` default census on the real tree | Exit 0, 12 census lines (`scratch/verify/census.txt`) |
| `node --test tests/score-pi-transport.test.mjs` | 41 pass, 0 fail (`scratch/verify/tests.txt`) |
| `verify_alignment_drift.py --check-exact-headers --fail-on-warn` on the two code files | `[alignment-drift] PASS`, `Scanned files: 2`, `Findings: 0`, `Errors: 0`, `Warnings: 0` (`scratch/verify/drift.txt`) |
| Comment hygiene and the key grep on the pi-transport folder and both measurement docs | Hygiene exit 0 on both files, key grep exit 1 with no match (`scratch/verify/session-evidence.md`) |
| `validate_document.py` on each changed doc | All changed docs VALID, playbook package PASS (7 scenarios), catalog 0 violations, HVR hard blockers 0 (`scratch/verify/session-evidence.md`) |
| The one approved live run | Exit 0 after 1 min 29 s; `scratch/live-run.stdout.txt` ends in `verdict pi-transport: adopt K=111 M=111 coverage=100.0 agreement=95.5 median_abs_dp=0.0100 p95_ms=340/387 cost_per_100=0.0022` |
| `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/cli-jev/003-cli-jev-workflow-integration/037-pi-native-classifier-transport --strict` | `RESULT: PASSED` (this closure pass) |
| `check-goal.cjs specs/cli-jev/003-cli-jev-workflow-integration/037-pi-native-classifier-transport` | `RESULT: PASSED (5/5 checks)` (this closure pass) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The verdict holds on a one-row margin.** Agreement 95.5 is 106 of 111 rows, and one more disagreement would give 94.6 and `keep-cli`. The five disagreements are near ties: `rr-iter3-071` Pi sk-doc 0.52 against CLI system-spec-kit 0.56, `rr-iter3-081` Pi system-spec-kit 0.53 against CLI sk-prompt 0.50, `rr-iter3-125` Pi system-spec-kit 0.34 against CLI none 0.32, `rr-iter3-127` Pi system-deep-loop 0.34 against CLI system-spec-kit 0.32, and `P1-MCP-002` Pi mcp-code-mode 0.55 against CLI sk-code 0.50 (`scratch/verify/session-evidence.md`).
2. **The latency pair is not same-day.** Pi's calls are fresh while the CLI side is the 019 run recorded on 2026-09-29. Pi's p95 of 340 ms sits against the recorded 387 ms, inside the 1.5x bound either way, and the same-day `--pi --cli` alternative exists behind its own switch (`spec.md` section 10).
3. **Four P2s recorded, not fixed (parent D5).** `report.json` carries no field naming the recorded-vs-fresh latency asymmetry; the judge compares one-decimal rounded percentages, unreachable at K=111 and a hazard for larger replays; a timeout records its status but prints no own skip line; and a jev exit outside 0, 2, 3 or 130 records `unmeasured` without a line (`scratch/verify/review-mimo-r1.txt`).
4. **No integration change yet.** Wiring Pi in as a `cli-classifier` transport, or teaching cli-pi workers to call classifiers, is a later phase on the operator's call (`spec.md` section 3).
5. **The verdict is scoped to its identities.** It holds for Pi 0.99.1 on `openrouter` `typesafe/jev-1.13` against the CLI's `official` `jev-1.13.0`; a later Pi or Jev identity reruns the rule in full before any use (`spec.md` section 5, Kill criterion).
<!-- /ANCHOR:limitations -->

---
