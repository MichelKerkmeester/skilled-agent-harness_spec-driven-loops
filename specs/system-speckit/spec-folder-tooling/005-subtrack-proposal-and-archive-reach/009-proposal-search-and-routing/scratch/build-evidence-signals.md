# Build evidence for the signal half, 2026-11-14

## What changed

**File:** `.skilled/skills/system-spec-kit/graph-metadata.json` (K only)

No functions changed. This is a signal-wording change.

- **REQ-003 / T009 — archive-search signal**
  - old: `"find a phrase in archived spec packets"`
  - new: `"quote a phrase in archived spec packets"`
  - why: removes the `find` token that partially matched `findings`, and introduces no token that matches the rr-iter3-135 prompt. Word check: the 4+ letter words are `quote, phrase, archived, spec, packets`; none sits inside `findings`/`research`, and none of `find/search/locate` is used.

- **REQ-004 / T010 — sub-track signals**
  - attempted reword: `"suggest sub-tracks for a track"` → `"suggest sub-tracks"`
  - result: it won the sk-git and sk-doc prompts but **not** sk-code. Per instruction, change 2 was reverted to the original text. Final K has the original `"suggest sub-tracks for a track"` and the other seven signals from commit `17b8e6c208` unchanged.
  - why blocked: the maximum generic reword leaves system-spec-kit at `0.647931` against sk-code `0.665710`. The prompt's only unused tokens are `sk` and `code`, fragments of the `sk-code` folder name; matching either requires putting a track-name fragment into a signal, which REQ-004/D2 rules out.

## Tests added

None. The only file in scope is K; T009/T010's proof is the pinned SCORE command, not a vitest suite. No test file was added, touched, or run.

## Failing run before the fix (relevant lines)

rr-iter3-135 with the original `find` signal and the same file with the signal removed:

```text
original:        system-spec-kit score=0.626203 confidence=0.8566
signal removed:  system-spec-kit score=0.613602 confidence=0.8498
```

The original signal scored on the review prompt by `0.012601`, so it was not equal to its removal state.

The three track prompts before any change:

```text
suggest sub-tracks for the sk-code track => sk-code 0.658562 first, system-spec-kit 0.227931 second
suggest sub-tracks for the sk-git track  => sk-git 0.571668 first,  system-spec-kit 0.221973 second
suggest sub-tracks for the sk-doc track  => sk-doc 0.656557 first,  system-spec-kit 0.310171 second
```

## rr-iter3-135 equality (final signal)

```text
WITH signal:    system-spec-kit score=0.613602 confidence=0.8498
WITHOUT signal: system-spec-kit score=0.613602 confidence=0.8498
```

Exact equality. The top recommendation on that prompt remains sk-code `0.636349`.

## Final SCORE results (all exit 0, status `ok`)

| Prompt | Top three |
|---|---|
| suggest sub-tracks for the sk-code track | **sk-code 0.658560** · system-spec-kit 0.227931 |
| suggest sub-tracks for the sk-git track | **sk-git 0.571667** · system-spec-kit 0.221973 |
| suggest sub-tracks for the sk-doc track | **sk-doc 0.656556** · system-spec-kit 0.310170 |
| look up a phrase in the archived spec packets | **system-spec-kit 0.430304** · sk-code 0.259677 · sk-doc 0.245581 |
| refactor the sk-code skill router so it loads faster | **sk-code 0.760755** · cli-external-orchestration 0.279360 · sk-doc 0.224590 |
| track down why a vitest suite is flaky | **sk-code 0.527400** |
| keep track of the open review comments | **sk-code 0.570962** |
| Review the routing packet and create a follow-up task list only if the evidence is weak. | **sk-code 0.636349** · system-spec-kit 0.613602 · mcp-tooling 0.582270 |

All three control prompts keep their current top skill. Note the 6th-decimal wobble across runs (`0.658560`/`0.658561`/`0.658562`); ordering is stable.

## Best change-2 attempt (reverted)

With `"suggest sub-tracks"`:

| Prompt | Result |
|---|---|
| sk-code track | sk-code 0.665710 · **system-spec-kit 0.647931** — not first |
| sk-git track | **system-spec-kit 0.641973** · sk-git 0.571667 — first |
| sk-doc track | **system-spec-kit 0.730170** · sk-doc 0.661323 — first |

Controls and rr-iter3-135 were unchanged by that reword. The sk-code prompt remains `0.017779` short. Because all three are required, T010 is **blocked**, not partially applied.

## Final Test Files / Tests lines

Not applicable — no test suite was run for this change. The proof runs are the SCORE invocations above; each printed `"status": "ok"` and exited `0`.

## Defects / open questions

- **T010 is blocked on sk-code.** The gap cannot be closed by wording alone without putting a fragment of the `sk-code` track name into a signal. That is the no-name/overfit guard REQ-004 exists to enforce.
- The failed first wording, `"look up a phrase in archived spec packets"`, is worth recording: its token `up` matched `follow-up` in rr-iter3-135 and pushed system-spec-kit to `0.645602`, breaking the required equality. `"quote …"` avoids every rr prompt token.
- **Writers not run, by dispatch:** `skill-graph.json` and `scorer-eval-baseline.json` still need `skill_graph_compiler.py --export-json` and `capture-scorer-eval-baseline.mjs --write` (T011/T012). The ratchet suites were not run and will likely need the recapture because the rr-iter3-135 system-spec-kit score moved `0.626203 → 0.613602`.
- **`goal.md` section 4 not updated:** only K was writable in this dispatch, so the T010 blocked entry and corpus-row list belong to the integrator. This report carries the measured evidence instead.
- Final K diff is one line; JSON parses (`intent_signals` count 63, last entry `"quote a phrase in archived spec packets"`).

## Orchestrator runs

- origin/main merged into the branch as a30d7c01e8 (no conflict). skill_graph_compiler.py --export-json exit 0, skill-graph.json changed one line.
- scorer capture: full_corpus_top1 161 -> 160, isolated on the merged tree with --misses: the only new miss is rr-iter3-135. Recaptured with --write, exit 0.
- advisor parity suites: 8 files, 64 passed, exit 0. Full advisor suite: 179 files, 1716 passed, exit 0, after the advisor daemon wrote a live generation (see below).
- python-compat T243-SA-022 failed until the advisor's startup scan rewrote the worktree's gitignored .state/advisor/skill-graph-generation.json (sourceSignature was null after the graph change). After one plain advisor_recommend call it passed. A local environment dependency, not a code defect.
- skill-graph-freshness --strict: no signal drift, exit 0.
- commits: code half 242c719451, signal half 0701a31ae5.
