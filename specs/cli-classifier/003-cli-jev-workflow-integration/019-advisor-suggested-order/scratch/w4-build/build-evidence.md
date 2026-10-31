# Build Evidence: 019-advisor-suggested-order (wave 4 build orchestrator)

Worktree `069-cli-jev-workflow-integration`, HEAD `bf830c3d47` at start. Every command ran from the worktree root unless a `cd` is shown. Raw outputs sit in `logs/`, `runs/` and `probes/` beside this file. Other build orchestrators ran in the same tree at the same time; only this phase's paths are judged here.

## 1. Baseline (before the first dispatch)

| Gate | Command | Result | Exit |
|------|---------|--------|------|
| Advisor dist freshness (T001) | `checkPackageFreshness('system-skill-advisor/runtime', ...)` from `dist-freshness.cjs` | `dist is fresh`; hook, CLI fallback and fusion dist files newer than their sources, so no rebuild ran (a rebuild would rewrite a dist the live daemon and the other orchestrators' suites share) | 0 |
| Advisor vitest, full | `cd .skilled/skills/system-skill-advisor/runtime && node_modules/.bin/vitest run` (`logs/baseline-advisor-vitest.*`) | `Test Files 130 passed (130)`, `Tests 1030 passed \| 6 skipped (1036)`, 203 s. The H1 ratchet `tests/parity/scorer-eval-baseline-ratchet.vitest.ts` is inside it and passed | 0 |
| Advisor typecheck | `npm run typecheck` (same dir) | no diagnostics | 0 |
| validate_document.py | `python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py` on `SKILL.md`, `README.md`, `feature-catalog.md`, `manual-testing-playbook.md`, both folder READMEs, `changelog/v0.13.0.0.md` and the two `tie-break-eval.md` neighbours (`logs/baseline-validate-document.txt`) | 9 of 9 exit 0: `Total issues: 0` on seven, `Total issues: 1` on the two index files (the README-rules fallback note) | 0 each |
| Playbook package | `validate-playbook-package.cjs --package system-skill-advisor` | `scenarios=48 categories=9 violations=0 warnings=1` (RESULT_PERSISTENCE_MARKER_MISSING) | 0 |
| Catalog package | `validate_catalog_package.py --package system-skill-advisor` | `WARN tier=warn violations=8` (0 fail, 8 warn, missing source paths in older entries) | 0 |
| Skill-root metadata | `ci-skill-root-metadata.cjs` | `checked=15 passed=15 failed=0 fixed=0` | 0 |
| Hermes copies (session's generator, check only) | `sync-skills-hermes.cjs --check` | `PASS: 72 Hermes skill copies in sync` | 0 |
| Trigger index (session's generator, check only) | `generate-trigger-index.mjs --check` | 0 stale, 0 obsolete, the usual manifest-hash note | 0 |
| Phase docs | `validate.sh <phase> --strict` | `Errors: 0 Warnings: 0`, `RESULT: PASSED` | 0 |
| Tree | `git status --porcelain` (`logs/porcelain-start.txt`) | only this scratch folder at start; other orchestrators' paths appeared later | - |

### Planning probes (read-only, not build targets)

- `probes/probe-advisor-child.mjs` runs the built hook's `handleClaudeUserPromptSubmit` in a child spawned like the shim (`process.execPath`, 2,500 ms, `SIGKILL`, `SPECKIT_CLAUDE_HOOK_TIMEOUT_MS=2200`) under 002's capture env. First 30 prompts (`logs/probe3.out.txt`): the first child 2,281 ms (the capture env's temp database has no daemon yet, so the advisor CLI starts one), then 667 to 1,199 ms. An earlier 6-prompt probe under heavier machine load (`logs/probe1.out.txt`) ran 1,128 to 2,174 ms and one child was killed at 2,504 ms.
- `probes/probe-advisor-child-liveenv.mjs`, the same child under the live env and its warm daemon (`logs/probe2.out.txt`): 705 to 1,231 ms.
- What the hook writes (T002): diagnostics go to `os.tmpdir()/speckit-skill-advisor-metrics/` and only when `SKILL_ADVISOR_DEBUG` is set; the directive-lifecycle store and the observed-policy recorder return before any write when the input has no session id; the advisor CLI starts a daemon for the temp database (`SYSTEM_SKILL_ADVISOR_DB_DIR`), which idles out after `SPECKIT_LAUNCHER_IDLE_TIMEOUT_MIN` (default 30). `git status --porcelain` was unchanged by the probes. The two probe daemons were stopped by PID after confirming with `lsof` that they held the probe's temp database.

## 2. Proof plan (fixed before the first dispatch)

`S=.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-suggested-order.mjs`, `T=tests/parity/score-suggested-order.vitest.ts` run from the advisor runtime dir, `STUB` a directory of logging `jev` and `cli-deem` stubs, `W=scratch/w4-build` of this phase.

| Row | Criterion | Command | Expected |
|-----|-----------|---------|----------|
| P1 | Goal 1, spec proof 1 | `PATH="$STUB:$PATH" node $S` (stubs log every call) | exit 0; `baseline: holdout_top1=53/70`; `comparator:` lines for scorer, confidence and always_second (plus the held-out rerank); `power:`; `advisor child: p50=... p95=... max=... over_2200=...`; `no headroom (...)` or `planned calls:`; `margin: 0.05`; `keep rule:`; neither stub log exists |
| P2 | Goal 2, spec proof 2 | stub `cli-deem health` reporting backend `stub`: `node $S --deem --out $W/runs/p2-deem`; stub `jev` whose `auth status --provider official` exits 3: `env -u JEV_PROVIDER node $S --jev --out $W/runs/p2-jev` | exit 0 each; `deem arm skipped: stub backend`; `jev: path=$STUB/jev provider=official` then `jev arm skipped: no credential`; `diff` against P1 stdout shows only those lines, once the measured `advisor child:` numbers are masked |
| P3 | Goal 3, spec proof 7 | `node_modules/.bin/vitest run $T` | exit 0, at least 20 passed, 0 failed; the REQ-011 cases (movable and latency headroom, tie in scorer order, `none` first, partial map, gate skips, child killed at 2,500 ms, `keep`, `kill`, `stop (margin)`, `stop (coverage)`, `stop (latency)`, one `--provider` per stub `jev` call) |
| P4 | Goal 4, spec proof 3 and 4, T019 | if P1 printed `no headroom`, that line; else `node $S --deem --out $W/runs/deem` against the served instance after `cli-deem health` passes | one `verdict deem:` line with the commit pair; every `calls.jsonl` line holds a child wall time, `model_commit` and `source_commit` |
| P5 | Goal 5, spec proof 5 and 6 | `grep -nE 'API_KEY\|TYPESAFE\|Bearer\|Authorization' $S`; `git status --porcelain` before and after P1, P2 and P4 | grep exit 1, no match; porcelain identical before and after each run (judged on this phase's paths) |
| P6 | Goal 6 | `validate.sh <phase> --strict` | `RESULT: PASSED` (the phase docs belong to the closure leaf; this build only runs the check) |
| G1 | Parent criterion 4 | advisor full `vitest run`; `npm run typecheck` | no failure beyond 1030 passed, 6 skipped; typecheck clean |
| G2 | Parent criterion 3 | `validate_document.py` on each changed skill doc | exit 0 each |
| G3 | T015, T021 | `ci-skill-root-metadata.cjs`; `sync-skills-hermes.cjs --check`; `generate-trigger-index.mjs --check`; the ratchet file; the census in P1 | exit 0 or the drift listed for the session; ratchet passes; census `53/70` |
| J1 | T018 | not run: a live `--jev` run sends data off this machine and needs the operator's yes | recorded as pending with the exact command |
