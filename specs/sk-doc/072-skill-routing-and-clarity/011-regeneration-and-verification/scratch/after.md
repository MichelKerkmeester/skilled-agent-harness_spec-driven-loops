---
title: "After: regeneration and verification"
description: "The regeneration run, the gate set against the phase 002 baseline with its delta, and the drift recounts."
trigger_phrases:
  - "regeneration and verification after"
importance_tier: "normal"
contextType: "implementation"
---
# After: regeneration and verification

Recorded on 2026-10-28 from worktree `264-prose-clarity-sweep` with the fixes in place, then pushed to main as `8a43366a1d`. Raw output: `.scratch-dc90/072-011/regen.txt`, `.scratch-dc90/072-011/gates-summary.txt` and `.scratch-dc90/072-011/drift/result.md`.

## 1. Regeneration

Every generator ran in write mode on the tree that main held after the sweep. Each one found nothing to write:

| Generator | Result |
|-----------|--------|
| `sync-skills-hermes.cjs` | `Wrote 0 of 65 Hermes skill copies; pruned 0` |
| `codex/sync-prompts.cjs` | `Wrote 0 of 38 generated prompts.` |
| `hermes/sync-prompts-hermes.cjs` | `Wrote 0 of 38 generated prompts.` |
| `generate-leaf-manifest.cjs --write`, 13 skills | exit 0 on each, no file changed |
| `compiled-route-manifest.cjs refresh`, 7 hubs, and the archived twins | exit 0 on each. The only manifest that changed was cli-external-orchestration's, because the restored bullet in section 3 changed a file its route hashes |
| `sync-runtime-mirrors.cjs` | `Linked 0, removed 0, of 202 expected mirrors.` |
| `codex/sync-agents.cjs` and `pi/sync-agents-pi.cjs` | `Wrote 0 of 11 generated agents.` each |

## 2. Gates against the phase 002 baseline

All 38 gates exit 0, and routing accuracy is unchanged.

| Gate | Phase 002 baseline | Now | Delta |
|------|--------------------|-----|-------|
| `parent-skill-check`, 7 hubs | exit 0 on each | exit 0 on each | none |
| `verify-router-sync` | `router-sync: 5/5 checks passed` | `router-sync: 5/5 checks passed` | none |
| `compiled-route-guard` | 7 hubs fresh, 0 failures | 7 hubs fresh, 0 failures | none |
| `package_skill.py --check --strict` | 14 roots | 13 roots, `Result: PASS` on each | one root fewer: `sk-vision` was removed from main |
| `check-rule-copies.js` | `OK: all rule invariants present` | `OK: all rule invariants present (8 exact-string file(s) + 2 Iron Law file(s) + 21 delivery-prefix anchor(s) + 6 extension floor(s) + 2 example output(s))` | none |
| router reach | 7 hubs, 3 allowed | `checked=7 hub(s), wrong-hub=0, outranked=0, no-reach=0, allowed=9, probe-error=0` | six more allowlisted reach disputes, recorded for review on 2026-12-07 |
| Hermes mirror | `PASS: 67 Hermes skill copies in sync` | `PASS: 65 Hermes skill copies in sync` | two fewer copies: `sk-vision` and `mcp-magicpath` were removed from main |
| sk-code setup battery | `STATUS=OK legs=9` | `STATUS=OK legs=9` | none |
| skill-root metadata | `checked=14 passed=14` | `checked=13 passed=13 failed=0 fixed=0` | one root fewer |
| leaf-manifest freshness | `checked=14 fresh=14` | `checked=13 fresh=13 failed=0` | one root fewer |
| router-sync and router-replay tests | `tests 40, pass 40, fail 0` | `tests 40, pass 40, fail 0` | none |
| routing accuracy | 155/195, 49/66, 19/24 | 155/195, 49/66, 19/24 | none |
| spec validation, 12 folders | `RESULT: PASSED` on each | `RESULT: PASSED` on each | none |

The 38-gate set also includes `route-sync-check`, `contract-drift`, `advisor-routing-suites`, `catalog-packages`, `sk-doc-script-tests`, `cite-drift-gate` and `skill-graph-freshness`. Each exits 0.

## 3. Fixes that turned the red gates green

| Fix | Gate it turns green |
|-----|---------------------|
| The three deep-loop contracts recompiled | `contract-drift`: `[CONTRACT DRIFT] OK commands=3` |
| The "You ARE Claude Code already" bullet restored to one line, word for word | the docs test in Spec-Kit Check: `Test Files 1 passed (1)` |
| Five tests read the plugins from `.opencode/plugins/` | `router-tests`, sk-code Script Tests and Skill Advisor Stress Tests: `declared-surfaces-parity.test.cjs` 3 of 3, the stress suite `Test Files 21 passed (21)`, three runtime tests `Test Files 3 passed (3)` |
| The gate-inputs twin rule treats `.opencode/plugins/` and `.opencode/commands/goal-opencode.md` as OpenCode-only, with two new test cases. The operator gave the second named confirmation for this protected gate | Gate Inputs: `files=45 ... twin_pairs=361 failures=0`, `RESULT: PASSED`, and `check-gate-inputs: 61 passed, 0 failed` |
| `.opencode/commands/assets` is ignored rather than tracked | Command Tree Parity: `[runtime-mirror-sync] PASS: 202 mirrors across 9 trees are in sync.` |

## 4. Mirror checks

| Check | Result |
|-------|--------|
| `sync-skills-hermes.cjs --check` | `PASS: 65 Hermes skill copies in sync` |
| `sync-runtime-mirrors.cjs --check` | `[runtime-mirror-sync] PASS: 202 mirrors across 9 trees are in sync.` |
| `check-agent-mirror-sync.cjs --all` | `agent-mirror-sync: 11 agent(s) checked — all mirrors in sync — OK` |

## 5. Drift recounts

Phase 002 counted two kinds of vocabulary drift by script. The same method, rerun, reproduces the old totals at `bd8f7e946d` and reads 0 today:

| Measure | Phase 002 | Now | Delta |
|---------|-----------|-----|-------|
| mcp-tooling, stage-one terms missing from stage two | 64 | 0 | -64 |
| cli-external-orchestration, stage-one terms missing from stage two | 36 | 0 | -36 |
| sk-doc, `Keyword triggers:` terms missing from `hub-router.json` | 17 | 0 | -17 |
