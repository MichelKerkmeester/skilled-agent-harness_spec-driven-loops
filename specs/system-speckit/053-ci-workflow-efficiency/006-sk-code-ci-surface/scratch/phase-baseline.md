# Phase baseline

Recorded 2026-10-24 on the worktree before any hub edit. The parent hub is already in its post-removal shape, so the registry holds three modes and one surface.

## Parent-skill check

Command: `node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/sk-code`

Last line: `OK: parent-skill-check — all hard invariants passed, 0 warnings`, `exit=0`. Forty-nine PASS lines and no FAIL line. The worktree is provisioned, so the `12-lib` leg that failed in the plan-time baseline now passes.

## Drift guards

Command: `bash .skilled/skills/sk-code/sk-code-skilled/scripts/run-all-drift-guards.sh`

Last line: `run-all-drift-guards: all 4 guards PASSED, 10 non-blocking warning(s)`, `exit=0`.

## Compiled-route suite

Command: `node --test .skilled/bin/tests/compiled-route-surface-hint.test.cjs`

Summary: `pass 6`, `fail 0`, `exit=0`.

## Leaf manifest

Command: `node .skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs --check .skilled/skills/sk-code`

Last line: `leaf-manifest.json OK (3e4bf173a3cfc1d813f9e943a0b0409214ad6d2cc64ddc841404e87de9a317b3)`, `exit=0`.

## Derived freshness

Command: `node .skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-derived-freshness.cjs`

Last line: `checked=14 fresh=14 stale=0 errored=0`, `exit=0`.
