# 005 evidence ledger (orchestrator-run)

All commands below were run by the orchestrator in the build worktree. Output files are in this folder.

## Red first (before the code change)
- red-audit.txt: the audit test file failed to load because opencode-version.mjs did not exist.
- red-rule-checks.txt: 4 of 25 rule-check tests failed.

## Baselines (T002, before any change)
- base-vitest.txt: 91 passed; 1 file failed to load (hooks/dispatch/pi/dispatch-preflight-lint.test.ts, missing ../../.skilled/hooks/shared/hook-flags.mjs; also fails on main).
- base-rule-checks.txt: 20 pass, 0 fail.
- base-shared.txt: 57 pass, 0 fail.
- base-source-root.txt: 7 pass, 0 fail.

## Final state (after the review fixes)
- fix-vitest.txt: 110 passed; the same 1 pre-existing file load failure, same error.
- fix-rulechecks.txt: 28 pass, 0 fail.
- fix-shared.txt: 57 pass, 0 fail.
- fix-source-root.txt: 7 pass, 0 fail.
- drift-guards.txt: run-all-drift-guards.sh exit 0, all 4 guards passed, 8 non-blocking warnings.
- node --check: exit 0 on every .mjs in .skilled/hooks/dispatch/lib/.
- jq empty on .skilled/skills/cli-external-orchestration/cli-opencode/hard-rules.json: exit 0.

## Review (T014) and fixes (T015)
- review-findings.log: DeepSeek findings-first review, 4 P1 and 2 P2, leads 1 to 10 at the end.
- replay-review-inputs.mjs and replay-review-inputs.txt: the review's failing inputs replayed against the real installed opencode 1.19.3 and opencode2 2.0.32 binaries, no version passed to evaluate:
  - quoted, bash -c and sh -c wrapped opencode2 slash runs: only v2-slash-prompt-route:warn
  - OPENCODE_BIN=opencode with an opencode2 command: only v2-slash-prompt-route:warn
  - opencode v1 slash run: command-flag-for-slash-prompt:block
  - path-qualified /usr/local/bin/opencode: unknown, both version-specific rules at warn

## Rule sidecar (hard-rules.json appliesTo)
- stdin-redirect-required ["v1","v2"] error; explicit-model-required ["v1","v2"] error; no-bare-agent-general ["v1"] warn; command-flag-for-slash-prompt ["v1"] error; v2-slash-prompt-route ["v2"] warn; share-requires-confirmation ["v1","v2"] warn.

## Rulings and amendments
- Q5 (unknown keeps both-version severity, version-specific rules at warn), with L1, plan R5 to R8 and the spec risk row amended to match.
- Q6 (sync resolver for synchronous callers).
- NFR-S01 amended: probe the binary the command runs; OPENCODE_BIN only when the command runs $OPENCODE_BIN.
- Orchestrator test edit: the v2-slash-prompt-route fixture pair in CHECK_FIXTURES.

## Open, not in this phase
- no-bare-agent-general is v1-only until a v2 probe shows whether `--agent general` is rejected (research iteration-010.md:39 and :108).

## Round 2 captures (orchestrator-run)
- REQ-007 v1 parity: req007-v1-parity.mjs and req007-v1-parity.txt. One corpus of 23 v1 `opencode run` commands (every one in the two test files at the start commit, plus 7 rule-firing samples) run through the pre-change engine in the main checkout and the changed engine here, with the real opencode 1.19.3 on PATH: 0 verdict differences. The last line shows the corpus is not vacuous: 5 of 5 sample commands fire, hitting all 5 v1 rule ids.
- inventories.txt holds:
  - HEAD at phase start: 867b83b671, and the scoped diff stat of the five changed files plus the new opencode-version.mjs (CHK-FIX-007).
  - CHK-013 import inventory: only node: built-ins plus the sibling ./opencode-version.mjs.
  - CHK-FIX-002 same-class producers: the only code producers are dispatch-audit.mjs (lines 55 and 78, changed) and dispatch-rule-checks.mjs (changed). The claude, codex and devin dispatch hooks and the benchmark reports mention `opencode run` in comments or data only, so they are non-producers. pi/dispatch-audit.ts imports the shared lib (pi/dispatch-audit.ts:27), so it is a consumer.
  - CHK-FIX-003 consumers: the rg -l list, matching the plan.md section 3 consumer table.
  - CHK-030: no added line in .skilled/hooks/dispatch/lib matches api key, secret or password.
- T016 scope: git status shows only the five planned files plus the new opencode-version.mjs under the 005 paths (inventories.txt, scoped diff section).
- T017 and CHK-051: scratch/backup/ deleted by the orchestrator after the final regression runs. CHK-050: temp files are only in scratch/.
- CHK-022 edge cases, each mapped to a test:
  - empty input, no executor, no probe: dispatch-audit.test.mjs:333 and :574, and evaluate probes only an OpenCode run (Q6 gate, review lead 8 at review-findings.log:67).
  - many segments, one probe per distinct binary: partial. dispatch-rule-checks.test.mjs:228 proves one probe across two evaluations of one binary. No test runs two distinct binaries in one command.
  - invalid format: dispatch-audit.test.mjs:76 (R5).
  - partial completion, no appliesTo reads as both versions: dispatch-rule-checks.test.mjs:138.
  - error scenarios and session expiry: not applicable, per spec.md L2.
- AC-003 waiver: vitest exits 1 because hooks/dispatch/pi/dispatch-preflight-lint.test.ts fails to load (missing ../../.skilled/hooks/shared/hook-flags.mjs). The failure is identical in base-vitest.txt and fix-vitest.txt and exists on main, so it predates this phase. Every pass count is at or above baseline. Record AC-003 as Met with this waiver in its Waiver cell, not as an unconditional exit 0.
