# 019 session evidence: verification, live Deem run, review and commit

The orchestrator session's record for phase 019. The session reran the proof plan from the final state itself; where this file and `../w4-build/build-evidence.md` disagree, this file wins.

## 1. Build

A build orchestrator leaf (Opus 5.5 xhigh, under parent D5 as it stood before the 2026-09-29 amendment) ran all 18 dispatches, Devin `deepseek-v4-1-flash-max` 12 (01 to 09, 06b, 13, 17) and Pi `llmgateway/mimo-v2.6-pro` at `high` 6 (10, 11, 12, 14, 15, 16), all exit 0. Its record, `../w4-build/build-evidence.md`, holds the baseline and the proof plan. The operator then said "Dont use opus" and chose "Stop them now" and "No Claude leaves", and the session stopped the leaf during its final checks, with no executor running. Its live Deem run (`../w4-build/runs/p4-deem.*`) was cut off after the gate lines, so the session reran it.

## 2. Session verification from the final state

- P1, zero-call: `STUB_LOG=<log> PATH="<stubs>:$PATH" node score-suggested-order.mjs` exit 0, `baseline: holdout_top1=53/70`, the four `comparator:` lines, `power:`, `advisor child:`, `planned calls: jev=334 deem=333`, `margin: 0.05`, the keep-rule line; the stub log was never written (0 calls).
- P2: a stub `cli-deem` reporting backend `stub` with `--deem --out <dir>`: exit 0, last line `deem arm skipped: stub backend`. A stub `jev` whose `auth status` exits 3 with `--jev --out <dir>` (no `JEV_PROVIDER`): exit 0, `jev: path=<stub>/jev provider=official` then `jev arm skipped: no credential`.
- P4, live local Deem run by the session: `node score-suggested-order.mjs --deem --out scratch/w4-session/p4-deem`, exit 0 in 597 s, `advisor child: p50=779 p95=1011 max=1787 over_2200=0 children=241 killed=0`, `deem: health backend=torch model=deem-0.8-v1 model_commit=8cbabbb2c4a7ef13c6b43f0ef3ae4157983c6d21 source_commit=3883f79261e5c61d3e8f230cad02b50c6d2b1891`, `deem: calls=333 timeouts=5`, `column deem: rows=111 measured=108 wins=9 losses=35 ties=64 abstentions=13 flips=86 baseline=scorer p_loss=0.0001`, and the verdict:
  `verdict deem: kill K=111 M=108 W=9 L=35 F=86 p=1.0000 mrr=0.6176/0.7750 p95_ms=1686 model=deem-0.8-v1 model_commit=8cbabbb2c4a7ef13c6b43f0ef3ae4157983c6d21 source_commit=3883f79261e5c61d3e8f230cad02b50c6d2b1891`.
  `calls.jsonl` holds 333 lines, each with `child_wall_ms`, `model_commit` and `source_commit` (5 are `unmeasured_timeout`). The advisor-side `git status --porcelain` was the same before and after. Nothing left the machine.
- P5: `grep -nE 'API_KEY|TYPESAFE|Bearer|Authorization'` on the script exit 1; porcelain equal before and after P1 and P2.
- P3: `vitest run tests/parity/score-suggested-order.vitest.ts` `Tests 45 passed (45)`, exit 0.
- G1: advisor full `vitest run` `Test Files 131 passed (131)`, `Tests 1075 passed | 6 skipped (1081)`, exit 0 (baseline 130 files, 1,030 passed, 6 skipped: +1 file, +45 tests). `npm run typecheck` exit 0.
- G2: `validate_document.py` exit 0 on all 9 changed docs; comment hygiene checker exit 0 on the script, its test and the playbook pin test.
- Generators: README verdict parity `diff_entries=0`; Hermes `system-skill-advisor` in sync; `skill_graph_compiler.py --validate-only` `VALIDATION PASSED`.

## 3. Cross-family review

Read-only, split by author family, briefs `review-pi.md` and `review-devin.md` (each carries the diff), logs in `logs/`. SHA-1 over the 14 reviewed files `331370a87a0ce94e9e5a13266a4846eabcc5bb63` before and after both runs.

- Pi MiMo on the code Devin wrote (948 s): `VERDICT: PASS`, 2 P2.
- Devin DeepSeek on the docs Pi wrote (524 s): `VERDICT: PASS`, 2 P2, REQ-001 to REQ-012 met.

P2 findings, recorded, not chased (parent D5):
1. Pi: abstention needs `none` strictly above every cluster key, so a tie between `none` and a key at the top reorders the cluster instead of counting an abstention.
2. Pi: the `auth_test` record in `calls.jsonl` has `wall_ms` rather than `child_wall_ms`, no row id, order or probabilities, and reuses `measured|unmeasured`.
3. Devin: `SKILL.md:383` names Jev and Deem but not the literal `--jev` and `--deem` switches.
4. Devin: the catalog entry and changelog say each arm asks every eligible row three times, which omits the Deem arm's 25-key cluster cap (`DEEM_MAX_KEYS`).

## 4. Commit

`6aa7ca0980` feat(system-skill-advisor): the script, its test, the playbook pin test, the regenerated leaf manifest and aliases, the 9 docs and the Hermes copy, 15 files, not pushed. `system-skill-advisor` is not a compiled hub, so no re-mint ran. The trigger index follows in its own commit, rebuilt from an archive of HEAD.

## 5. Open for the operator

- The phase ends at a measured `kill` for Deem. A Jev column waits on the operator's yes: `node .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-suggested-order.mjs --jev --out <dir>`.
- The P2 findings above.

## 6. Closure

- First closure run: Pi MiMo, stopped at its 30-minute limit (exit 142) after editing `tasks.md`, `spec.md` and `plan.md`.
- Continuation: Pi MiMo, `closure-r2.md` (read the first run's diff, correct what the evidence does not support, then finish), 1,392 s, exit 0. It corrected three line citations in `tasks.md` and narrowed T011 to the tested `backend refused` stop.
- The session reran from the final state: `repair-derived.cjs` (dry run) `repairable=0`, `validate.sh --strict` `RESULT: PASSED` with Errors 0 and Warnings 0, `check-goal.cjs` `RESULT: PASSED (5/5 checks)`, `goal.cjs packet` `packet_durable_chars=3880`. Status `Complete`: the phase printed its Deem `kill` verdict line. T008 and T018 stay open for the operator's `--jev` run.
