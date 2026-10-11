---
title: "Review Report: remediation commits of the post-merge review"
description: "Five DeepSeek V4.1 Flash review iterations over 1d078f3356..d1741a28f7, with every kept finding confirmed by a synthesizer rerun or read."
---

# Review Report: remediation commits of the post-merge review

## 1. Executive Summary

- **Verdict:** PASS, hasAdvisories true. P0 0, P1 0, P2 4 CONFIRMED. The reducer registry holds 2 P2s from the iterations; the synthesizer confirmed both and added 2 from its own reruns.
- **Scope:** the six commits `1d078f3356..d1741a28f7`: phases 001 to 005 of `012-post-merge-deep-review` (`1d078f3356`, `e0b32e5e11`, `75289472d0`, `019b94a403`, `f4f678328b`) and the trigger index rebuild `d1741a28f7`. The scope list is `reviewScopeFiles` in `deep-review-config.json`.
- **Executor:** cli-pi `deepseek-v4.1-flash` (llmgateway, DevPass) at `--thinking max` for all five iterations. Five completion receipts name that model. DevPass never hit its limit, so no switch to `cline-pass/deepseek-v4.1-flash` happened.
- **Every fix does what its phase claims.** Each phase's goal criteria rerun green from the final state. No fix regressed a neighbouring suite. The four findings are a weak test, two incomplete doc corrections and stale README lines.

## 2. Confirmed Findings

### P2-1. The new sk-git open-stdin test passes against the unfixed hook when a kill-switch is set. CONFIRMED

- **File:** `.skilled/skills/sk-git/scripts/hooks/stdin-deadline.test.mjs:35`, with `.skilled/skills/sk-git/scripts/hooks/git-preflight-advisory.mjs:81`.
- **Evidence:** the test passes `{ ...process.env, SKGIT_ADVISORY: '0' }` to the child and asserts only an upper bound (`LATEST_EXIT_MS = 4500`, line 26). The preflight hook checks `isHookEnabled('git-preflight')` at line 81, before its stdin read at line 84. Against a `git archive 1d078f3356^` copy of the hooks, `SK_GIT_PREFLIGHT_DISABLED=1 node --test stdin-deadline.test.mjs` prints `✔ git-preflight-advisory.mjs exits on its own when stdin stays open (34.079834ms)`. `SYSTEM_HOOKS_DISABLED=1` gives the same pass at 28 ms. Without either variable the same pre-fix run fails both cases at about 6000 ms, so the test is sound only in a clean environment.
- **Why it matters:** the shared suite `.skilled/hooks/shared/hook-stdin-deadline.test.mjs` already guards against exactly this. It deletes every `*_DISABLED` variable (line 58) and requires `elapsedMs >= EARLIEST_EXIT_MS` (2900, line 30). The phase added a second, weaker harness in a new file instead of extending that table, which is the costlier move in `prevent-overengineering.md` §1.
- **Smallest fix:** add three rows to `HOOKS` at `hook-stdin-deadline.test.mjs:36`: `git-preflight/shared/git-preflight-advisory.mjs` and `git-message-gate/shared/git-message-gate.mjs` with `failOpen: ''`, and `sk-vision/devin/sk-vision.mjs` with `failOpen: '{}'` (all three symlinks exist under `.skilled/hooks/`). Then delete `stdin-deadline.test.mjs`. Proof: a copy of the shared harness with those three rows passes at HEAD (`pass 4 fail 0`, 3031 ms) and fails against the pre-fix tree even with `SK_GIT_PREFLIGHT_DISABLED=1 SYSTEM_HOOKS_DISABLED=1` set (`pass 0 fail 4`). A one-file alternative: strip `*_DISABLED` from the env and assert `elapsedMs >= 2900` in `stdin-deadline.test.mjs`.
- **Source:** synthesizer. Iteration 1 saw the ordering and ruled it out unproven; the rerun above proves it.

### P2-2. A dead spec link of the class phase 002 removed survives in another Webflow reference. CONFIRMED

- **File:** `.skilled/skills/sk-code/sk-code-webflow/references/performance/webflow-constraints.md:168`.
- **Evidence:** the line reads ``See [decision-record.md](/specs/005-example.com/024-performance-optimization/decision-record.md) for implementation decisions:``. `test -e specs/005-example.com/024-performance-optimization/decision-record.md` prints MISSING. Phase 002 REQ-003 checked only `scroll-interceptor-and-related.md`, so the class was fixed in one file.
- **Smallest fix:** remove the "Decision Records" pointer sentence, or name the decisions inline without the link, and bump sk-code-webflow with a changelog line.
- **Source:** iteration 2 (R2-P2-001), confirmed by read and `test -e`. It predates the range, so this is an incomplete class fix, not a regression.

### P2-3. The claim-corrections summary credits the wrong packet with the first six doc-claims tests. CONFIRMED

- **File:** `specs/sk-code/011-sk-code-poinytail-based-refinement/012-post-merge-deep-review/005-claim-corrections/implementation-summary.md:88` and `spec.md:105`.
- **Evidence:** line 88 says ``Git shows `817ff5b2a7` added 6 and `d2701afc3b` took the file from 6 to 12, both in the packet``. `git log -1 --format='%(trailers:key=Spec,valueonly)' 817ff5b2a7` prints `.../010-round-three-remediation/005-opencode-and-guards`, and the same for `d2701afc3b` prints `.../011-round-four-remediation/005-doc-claims-hardening`. Each commit adds 6 `test(` lines. The corrected count ("Six new test cases, 12 in total") is right; only the provenance clause is wrong.
- **Smallest fix:** in both lines, name the owning packet of `817ff5b2a7` (`010-round-three-remediation/005-opencode-and-guards`) in place of "both in the packet" and "the packet's commits".
- **Source:** iteration 3 (R3-P2-001), confirmed by rerun of the trailers and the `+test(` counts.

### P2-4. The sk-git hooks README does not list the new test or the shared reader. CONFIRMED

- **File:** `.skilled/skills/sk-git/scripts/hooks/README.md:105`, `:170` and `:180`.
- **Evidence:** the directory tree (lines 101 to 106) lists `git-preflight-advisory.test.mjs` but not `stdin-deadline.test.mjs`. The Imports row at line 170 names `dispatch-rule-checks.mjs`, `git-context.mjs`, `git-rule-checks.mjs` and `hook-flags`, but both hooks now also import `readStdin` from `hooks/shared/hook-adapter-shared.cjs` (git-message-gate.mjs:40, git-preflight-advisory.mjs:34). The validation block at line 180 runs only `git-preflight-advisory.test.mjs`.
- **Smallest fix:** add `hook-adapter-shared.cjs` (`readStdin`, 3000 ms deadline) to the Imports row. If P2-1 keeps the file, also add it to the tree and the validation block; if P2-1 moves the cases to the shared suite, add that suite's command instead.
- **Source:** synthesizer, by read.

## 3. Test Quality: Does Each New Test Fail Without Its Fix

| Test | Pre-fix result | Post-fix result |
|------|----------------|-----------------|
| `stdin-deadline.test.mjs`, both cases | Fail, killed at about 6000 ms (clean env). Preflight case passes in 34 ms with a kill-switch set (P2-1) | Pass at about 3035 ms |
| `sk-vision-devin.test.mjs`, open-stdin case | Fail, killed at 6003 ms, also with `SYSTEM_HOOKS_DISABLED=1` because the adapter reads stdin before its switch | Pass at 3028 ms |
| Webflow runtime warning | No automated test exists for `test-minified-runtime.mjs`; the fixtures are run by hand. Pre-fix script prints no warning, post-fix prints one on `late-element-poll.js` only | As claimed |
| Drift-guard warning count | No test harness exists for `run-all-drift-guards.sh`. The count (272) equals the alignment verifier's own `Warnings: 272` | As claimed |

The last two rows are observations, not findings: neither script had a harness to extend, and building one for a summary line fails the restraint bar.

## 4. Refuted Hypotheses

| Hypothesis | Result | Evidence |
|------------|--------|----------|
| `if "$@" \| tee` masks a failing guard | Refuted | `set -euo pipefail` at `run-all-drift-guards.sh:20`; iteration 2's fake failing `python3` gave exit 1 and `2 guard(s) FAILED` |
| Warnings printed on stderr are not counted | Refuted | stdout 272 `[WARN]`, stderr 0 |
| A hook given a valid payload on an open pipe hangs after the deadline | Refuted | All three exit 0 at about 3030 ms with correct output, including a gate deny on a bad `git commit -m` |
| The Devin config runs an unfixed copy | Refuted | `.skilled/hooks/sk-vision/devin/sk-vision.mjs` is a symlink to the fixed skill file |
| A late write or double settle after the deadline | Refuted | `settled` flag and listener removal, `hook-adapter-shared.cjs:23-45`; iteration 5 probe |
| Oversized stdin is a new risk | Refuted as a range defect | The shared reader caps nothing, but it predates the range; 32 MiB payload exits 0 fail-open |
| The sk-code manifest is stale after the hub bump | Refuted | `compiled-route-guard.cjs`: all hubs fresh, exit 0 |
| Version carriers drifted | Refuted | All bumped carriers agree; webflow, opencode and deep-improvement README version lines lagged before the range |
| Changelogs malformed | Refuted | `validate_document.py`: `Total issues: 0` for all six |
| Ephemeral ids in code comments | Refuted | `check-comment-hygiene.sh` rc 0 on all eight changed code files |
| Trigger index stale after `d1741a28f7` | Refuted | `--check` lists only this phase's untracked docs |
| Phase 001 named a host that does not register the sk-git hooks | Refuted | `.devin/hooks.v1.json:92` and `:97` register both |
| Corrected claims still wrong | Refuted | `ceiling-report.sh` ends `markers=3 no-trigger=1 no-signal=1`; 12 `test(` cases; `check-agent-mirror-sync.cjs --all` 12 agents in sync |

## 5. Regression Runs (HEAD `d1741a28f7`)

`git-preflight-advisory.test.mjs` 7/0, `git-rule-checks.test.mjs` 29/0, `message-contract.test.mjs` 38/0, `sk-git-message-gate.test.cjs` 5/0, `hook-adapter-shared.test.cjs` 2/0, `hook-stdin-deadline.test.mjs` 18/0, `verify_doc_claims.test.cjs` 12/0, `verify_router_sync.test.cjs` 5/0 (pass/fail). `run-all-drift-guards.sh` exit 0. Webflow known-good exit 0 `Passed: 2/2`, known-bad `Failed: 4/4`. Hermes `--check` 70 in sync. The only failing case is sk-vision's `resolves a built entry`, which needs the unbuilt `vision-runtime/dist`.

## 6. Iteration Ledger

| Iteration | Dimension | Focus | New findings |
|-----------|-----------|-------|--------------|
| 1 | correctness | Hook stdin deadlines | 0 |
| 2 | correctness | Webflow cap warning and drift-guard count | 1 (P2-2) |
| 3 | traceability | Hub doc pointers and claim corrections | 1 (P2-3) |
| 4 | maintainability | Versions, changelogs, comment hygiene, index | 0 |
| 5 | security | Untrusted stdin, injection, overbuilding, regressions | 0 |

Iteration 5 passed the overbuilding check; the synthesizer disagrees for the test harness only, on the evidence in P2-1.
