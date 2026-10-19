# 2026-10-19--manual-testing-playbook--session-relaunch-final-code

> system-spec-kit · manual-testing-playbook · four CLI live runs · session relaunch · frozen final code

---

## 1. OVERVIEW

**Verdict: PASS**

Round 9 is the only round in this folder: one live run per runtime, all four launched in parallel on the frozen final code, and every one passed with zero operator input. Claude, Pi, OpenCode and Codex each prepared a note, took SIGTERM, relaunched with the claim seed, claimed the note, reported 248 lines and `# Session Relaunch`, and closed the note with `complete`.

Four checks passed in four runs. Each wrapper declined a further hop with `reason=no-file` after its receiver closed the note, so every wrapper ended on its clean single-hop path. The long prepare-to-SIGTERM gaps of the earlier rounds are gone: the four gaps are 7.6 s, 12.8 s, 16.5 s and 27.7 s, and the last of those replaces the 3-minute Pi gap of run 8 that the prepare success line fixed.

The runs made while those gaps were being fixed are recorded in [`../2026-10-19--manual-testing-playbook--session-relaunch-live-four-cli/`](../2026-10-19--manual-testing-playbook--session-relaunch-live-four-cli/README.md), which carries two OpenCode FAIL rows from earlier code. Raw pane captures and the relaunch log stay in the source packet, named in `source.md`.

---

## 2. RUN

| Field | Value |
|---|---|
| Target skill | system-spec-kit |
| Scenarios | `session-relaunch-claude`, `session-relaunch-pi-opencode`, `session-relaunch-command-runtimes` |
| Executed | 2026-10-19, live round 9, all four launched in parallel |
| Runtimes | cli-claude, cli-pi, cli-opencode, cli-codex |
| Code state | Frozen final code. The last change made a successful `prepare` print one success line so the session stops, which is the fix for the 3-minute Pi gap of run 8. The run ledger records the freeze and the trust-entry handling of the round. |
| Dispatch models | claude Sonnet 5.5 with high effort, pi and opencode openai/gpt-6-luna, codex gpt-6-luna max fast, each read from its pane's status line |
| Outcome tally | 4 PASS, 0 FAIL across 4 runs |
| Claude settings | git worktree of this repository, `SESSION_RELAUNCH_THRESHOLD=0.05`, `SESSION_RELAUNCH_WINDOW_TOKENS=100` and `SESSION_RELAUNCH_MAX_HOPS=1`. The launch passed no model flag, so the loop's configured Claude model ran. |
| Pi settings | `openai/gpt-6-luna` passed as `--provider openai --model gpt-6-luna`, with `SESSION_RELAUNCH_THRESHOLD=0.05`, `SESSION_RELAUNCH_WINDOW_TOKENS=100` and `SESSION_RELAUNCH_MAX_HOPS=1`. |
| OpenCode settings | `openai/gpt-6-luna` passed as `-m openai/gpt-6-luna`, with `SESSION_RELAUNCH_THRESHOLD=0.05`, `SESSION_RELAUNCH_WINDOW_TOKENS=100` and `SESSION_RELAUNCH_MAX_HOPS=1`. |
| Codex settings | scratch clone, `-m gpt-6-luna`, `SESSION_RELAUNCH_THRESHOLD=0.25` and `SESSION_RELAUNCH_MAX_HOPS=4`. The launch set no `SESSION_RELAUNCH_WINDOW_TOKENS`, so Codex's own context window applies. |
| Source packet | `specs/hooks/023-session-relaunch-loop/006-deep-review-2-remediation/evidence/live-runs-2026-10-19/` |
| Launch record | `launch-commands-final.txt` holds the round-9 launch block at `2026-10-19T09:42:58.695Z`, which is the source of the settings above. The file is 6803 bytes with SHA-256 `aaebeaa03d6ff00dc1328acaed52c5c54ad0e2b538d4578524cd39a0643c209e`. `launch-commands.txt` stops at `2026-10-19T08:51:53.396Z` and holds no round-9 block. The models come from each pane's status line. |

---

## 3. OUTCOMES

| Runtime | Run | Verdict | Operator inputs | Evidence | Bytes | SHA-256 |
|---|---|---|---|---|---|---|
| claude | 9 (`loopId=78793`) | PASS | None | `specs/hooks/023-session-relaunch-loop/006-deep-review-2-remediation/evidence/live-runs-2026-10-19/relaunch-run9.log` | 1190 | `157501e2ec0a1753c68bd8b2618b321691e8925f43b7d6edb8cc2af5292b0556` |
| | | | | `specs/hooks/023-session-relaunch-loop/006-deep-review-2-remediation/evidence/live-runs-2026-10-19/sr-claude9-pane.txt` | 2301 | `8e0a87d58376d8defe734a7f70a456d567dcc4f9005fad679dbfae44b2c45778` |
| pi | 9 (`loopId=78800`) | PASS | None | `specs/hooks/023-session-relaunch-loop/006-deep-review-2-remediation/evidence/live-runs-2026-10-19/relaunch-run9.log` | 1190 | `157501e2ec0a1753c68bd8b2618b321691e8925f43b7d6edb8cc2af5292b0556` |
| | | | | `specs/hooks/023-session-relaunch-loop/006-deep-review-2-remediation/evidence/live-runs-2026-10-19/sr-pi9-pane.txt` | 43641 | `ee5c75a11a01fce264e9722fdb6de80c8c43b8d2ab88e0d70a2e8bb1f2b8061b` |
| opencode | 9 (`loopId=78816`) | PASS | None | `specs/hooks/023-session-relaunch-loop/006-deep-review-2-remediation/evidence/live-runs-2026-10-19/relaunch-run9.log` | 1190 | `157501e2ec0a1753c68bd8b2618b321691e8925f43b7d6edb8cc2af5292b0556` |
| | | | | `specs/hooks/023-session-relaunch-loop/006-deep-review-2-remediation/evidence/live-runs-2026-10-19/sr-oc9-pane.txt` | 5224 | `3100d515bc31730500bf22b00cac055058196c2837226b5ed9ebd6bbd1f9d2b5` |
| codex | 9 (`loopId=78834`) | PASS | None | `specs/hooks/023-session-relaunch-loop/006-deep-review-2-remediation/evidence/live-runs-2026-10-19/relaunch-run9.log` | 1190 | `157501e2ec0a1753c68bd8b2618b321691e8925f43b7d6edb8cc2af5292b0556` |
| | | | | `specs/hooks/023-session-relaunch-loop/006-deep-review-2-remediation/evidence/live-runs-2026-10-19/sr-codex9-pane.txt` | 2800 | `05abc49fa0db02b1b8f125a7609f29cd23911eb8829aa3cdf28a17611e8327a4` |
| all four | every launch | - | - | `specs/hooks/023-session-relaunch-loop/006-deep-review-2-remediation/evidence/live-runs-2026-10-19/launch-commands.txt` | 9188 | `3b109e68b3b5ca22eb24fc39ab061393d059902aa187e8701bd245b4e3368e67` |
| all four | 9 | - | - | `specs/hooks/023-session-relaunch-loop/006-deep-review-2-remediation/evidence/live-runs-2026-10-19/launch-commands-final.txt` | 6803 | `aaebeaa03d6ff00dc1328acaed52c5c54ad0e2b538d4578524cd39a0643c209e` |
| all four | 9 | - | - | `specs/hooks/023-session-relaunch-loop/006-deep-review-2-remediation/evidence/live-runs-2026-10-19/wrapper-exits.txt` | 1314 | `2955f877f543130383b23752dcab6e6e62e5631789517d4db389f398acb79367` |

No round-9 pane capture prints a wrapper exit code, so the exit lines come from `wrapper-exits.txt`, which records `WRAPPER_EXIT=0` for claude9, oc9 and codex9 at `2026-10-19T09:51:36.372Z` beside the declines for loops 78793, 78816 and 78834, and for Pi loop 78800 at `2026-10-19T09:51:44.621Z` beside its decline. All four declines carry `reason=no-file`. The file is 1314 bytes with SHA-256 `2955f877f543130383b23752dcab6e6e62e5631789517d4db389f398acb79367`.

Claude: prepare at 09:43:39.324Z, SIGTERM at 09:43:46.912Z, 7.6 s later, and relaunch at 09:43:47.361Z. The receiver started on the claim seed, reported 248 lines and `# Session Relaunch`, closed the note with `complete` and answered that nothing was left for the user. That session reported no output from `complete` and did not check its exit code, and the wrapper declined at 09:51:04.080Z with `reason=no-file`.

Pi: prepare at 09:47:05.637Z, SIGTERM at 09:47:33.366Z, 27.7 s later, and relaunch at 09:47:33.596Z. The prepare success line ended the turn, which is the fix for the run 8 gap where the session read the CLI source to confirm a silent success. The receiver reported 248 physical lines from both `wc -l` and `awk` and `# Session Relaunch` on line 1, and recorded that `complete` exited 0 and a reread showed `status: done`. The wrapper declined at 09:51:43.567Z with `reason=no-file`.

OpenCode: prepare at 09:44:24.248Z, SIGTERM at 09:44:37.070Z, 12.8 s later, and relaunch at 09:44:37.238Z. The receiver claimed the note with the positional path and `--session`, ran `complete` on the positional path with no output, and reported 248 lines with `Session Relaunch` as the first heading. It answered that nothing was waiting. The wrapper declined at 09:51:04.661Z with `reason=no-file`.

Codex: prepare at 09:45:38.299Z, SIGTERM at 09:45:54.787Z, 16.5 s later, and relaunch at 09:45:54.833Z, in the scratch clone. The receiver claimed the note, read the README and `killer.cjs`, gave the three bullets per file that its prompt asked for beside the line count and heading, and recorded that `complete` exited 0 and the note reads `status: done`. The wrapper declined at 09:51:05.470Z with `reason=no-file`.

---

## 4. FILES

| File | Contents |
|---|---|
| [`outcomes/`](./outcomes/) | One outcome JSON per runtime, listing round 9 with its verdict, operator inputs and evidence byte counts and SHA-256 values |
| [`results.csv`](./results.csv) | One row per run |
| [`source.md`](./source.md) | Where the raw evidence for this run lives |
