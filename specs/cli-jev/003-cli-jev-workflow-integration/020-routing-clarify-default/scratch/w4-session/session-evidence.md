# 020 session evidence: verification, review and commit

The orchestrator session's record for phase 020. The session reran the proof plan from the final state itself; where this file and `../w4-build/build-evidence.md` disagree, this file wins.

## 1. Build

A build orchestrator leaf (Opus 5.5 xhigh, under parent D5 as it stood before the 2026-09-29 amendment) ran 21 executor dispatches, Devin `deepseek-v4-1-flash-max` 9 for code and Pi `llmgateway/mimo-v2.6-pro` at `high` 12 for docs, all exit 0 on the first attempt. It finished before the operator's "no Claude leaves" amendment, so its record stands as written in `../w4-build/build-evidence.md`.

## 2. Session verification from the final state (before the commit)

- Census: `PATH="<stub dir>:$PATH" node score-clarify-default.cjs --report <scratchpad>/census --rows-out <scratchpad>/rows.jsonl` exit 0, `total prompts=359 unparsed=24 route=239 clarify=3 defer=86 reject=7 clarify_mode=2 clarify_checklist=1 gold_in_alternatives=0`, `real clarify rate: not measured`, `rows written: 2 with_gold=0`.
- Label gate: `--score <rows> --deem --jev --out <dir>` exit 0, `rows: 2 labeled=0 operator=0 committed_gold=0` then `stop: fewer than 30 labeled rows (0 labeled)`; `<dir>` not created and no stub call.
- Tests: `node --test score-clarify-default.test.cjs` `tests 28`, `pass 28`, `fail 0`, exit 0.
- Secrets: `grep -nE "readFileSync\([^)]*\.env|dotenv|API_KEY|Bearer"` on the script exit 1.
- `validate_document.py` exit 0 on all 9 changed docs (the playbook index with `--type playbook`, the catalog index with `--type feature_catalog`).
- Comment hygiene: `python3 .skilled/skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.sh` exit 0 on the script and its test file.

## 3. Cross-family review

Read-only, split by author family, briefs `review-pi.md` and `review-devin.md` (each carries the diff), logs in `logs/`. The SHA-1 over the 11 reviewed files was `d87b46d77c4758af766dd5369e0e7fbcb4f3f4ca` before and after both runs, so neither reviewer wrote.

- Pi MiMo on the code Devin wrote (798 s): `VERDICT: PASS`, REQ-001 to REQ-010 met, keep-rule thresholds hand-checked (`tailP(7,5)=29/128`, `tailP(30,30)=2^-30`).
- Devin DeepSeek on the docs Pi wrote (283 s): `VERDICT: PASS`, REQ-001 to REQ-010 met.

P2 findings, recorded, not chased (parent D5):
1. Pi: arm picks and `calls.jsonl` key on row id, while canary ids repeat across hubs (`one-turn-clarify` in system-deep-loop and sk-doc fixtures), so two same-id rows in one rows file would share answers.
2. Both: `result.decision.action` is read outside the try in `runCensus`, so an engine result without `decision` ends the census with a stack instead of counting it unparsed.
3. Pi: `main().then` has no catch, so a `describeModes` throw exits 1 with an unhandled-rejection stack.
4. Pi: a Jev `auth test` spawn past 90 s records `status: "unmeasured"`, not `unmeasured_timeout`.
5. Both: the shared-description ` [key]` suffix departs from REQ-006's "verbatim" for the two shared pairs (the build's recorded deviation, following 002).
6. Devin: an unreadable corpus file is skipped with no count or line, against REQ-005's "never dropped silently".
7. Devin: the catalog entry's source table names only `labeled-prompts.jsonl`, while the script also reads `holdout-prompts.jsonl` (70 of 265 corpus rows).
8. Devin: the Deem arm's stop paths (exit 2, 3, 130, the exit-4 health recheck, `partial_rows`) are untested while the Jev stop is pinned.

## 4. Commit (worktree 069, not pushed)

- `65c71719ac` feat(sk-doc): the script, its test file, the 9 docs and the regenerated Hermes copy `.hermes/skills/sk-create-skill/SKILL.md`, 14 files. The pre-commit route-remint gate re-minted `sk-doc` and staged both manifests. `compiled-route-guard.cjs` exit 0 after the commit, all hubs fresh.
- The trigger index follows in its own commit, rebuilt from an archive of HEAD, as every earlier phase did.

## 5. Open for the operator

- 30 operator labels. The committed prompts give 2 rows, so the gate needs transcripts (`--transcripts`) or hand-picked prompts.
- A live Jev run after the labels exist, which waits on the operator's yes: `node .skilled/skills/sk-doc/sk-create-skill/scripts/score-clarify-default.cjs --score <labeled rows> --jev --out <dir>`.
- The P2 findings above.

## 6. Scratch kept out of the commit

- `../w4-build/base/drift-guards.txt` (5.0 MB, the whole-repo drift guard dump, 16,978 findings) was moved to the session scratchpad instead of committed. Its summary line stays in `../w4-build/build-evidence.md` section 2.
- Closure: Pi MiMo, 931 s, exit 0. The session reran `validate.sh --strict` (`RESULT: PASSED`, 0 failed), `check-goal.cjs` (`RESULT: PASSED (5/5 checks)`) and `goal.cjs packet` (`packet_durable_chars=3458`).
