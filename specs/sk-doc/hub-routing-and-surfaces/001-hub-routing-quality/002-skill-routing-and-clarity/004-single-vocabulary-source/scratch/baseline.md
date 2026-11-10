# Baseline: Phase 4 gate set before any edit

Captured 2026-10-28 at commit `87e43b5dc0` (the phase 003 commit) in worktree `257-single-vocabulary-source`, before the first edit. Runner: `.scratch-dc90/072-004/gates.sh`, a copy of the phase 003 runner pointed at this worktree. Raw logs: `.scratch-dc90/072-004/baseline/`.

## 1. Gate set

All 33 gates exit 0.

| Gate | Exit |
|------|------|
| psc-cli-classifier | 0 |
| psc-cli-external-orchestration | 0 |
| psc-mcp-tooling | 0 |
| psc-sk-code | 0 |
| psc-sk-design | 0 |
| psc-sk-doc | 0 |
| psc-system-deep-loop | 0 |
| route-guard | 0 |
| route-sync-check | 0 |
| verify-router-sync | 0 |
| pkg-cli-classifier | 0 |
| pkg-cli-external-orchestration | 0 |
| pkg-cli-orca | 0 |
| pkg-mcp-code-mode | 0 |
| pkg-mcp-tooling | 0 |
| pkg-sk-code | 0 |
| pkg-sk-design | 0 |
| pkg-sk-doc | 0 |
| pkg-sk-git | 0 |
| pkg-sk-prompt | 0 |
| pkg-sk-vision | 0 |
| pkg-system-deep-loop | 0 |
| pkg-system-skill-advisor | 0 |
| pkg-system-spec-kit | 0 |
| rule-copies | 0 |
| router-reach | 0 |
| hermes | 0 |
| sk-code-setup | 0 |
| root-metadata | 0 |
| leaf-manifest | 0 |
| router-tests | 0 |
| accuracy | 0 |
| validate | 0 |

Key numbers:
- Routing accuracy (`capture-scorer-eval-baseline.mjs`): full 155/195 (0.7949), holdout 49/66 (0.7424), ambiguity 19/24 (0.7917), unknown_count 13.
- `compiled-route-guard.cjs --json`: 7 of 7 hubs `fresh`, failures 0.
- Router reach: wrong-hub 0, outranked 0, no-reach 0, allowed 3, across 7 hubs (declared: cli-classifier 27, cli-external-orchestration 58, mcp-tooling 75, sk-code 70, sk-design 76, sk-doc 184, system-deep-loop 20).
- router-tests: pass 40, fail 0.
- parent-skill-check: every hub `all hard invariants passed, 0 warnings`.

## 2. Extra baselines

| Check | Exit | Result |
|-------|------|--------|
| `generate-router-intent-signals.cjs --check` (graph covers every ROUTER.md phrase) | 0 | missing 0 on all 7 hubs |
| `leaf-route-replay.cjs` | 0 | total gold 65, scored 57, tied 2, mean_f1 0.9235, exact 51 |

## 3. Vocabulary drift, measured before the change

Method: stage one is `hub-router.json` `routerSignals[mode].classes` → `vocabularyClasses[].keywords`; stage two is the `ROUTER.md` `INTENT_SIGNALS` intents whose `RESOURCE_MAP` paths sit in the mode's packet. Exact, case-folded match.

| Hub | Stage-one terms with no stage-two intent | Registry aliases outside the vocabulary | `Keyword triggers:` terms outside the packet's vocabulary |
|-----|----|----|----|
| cli-classifier | 13 | 0 | 0 |
| cli-external-orchestration | 36 | 0 | 0 |
| mcp-tooling | 62 | 0 | 0 |
| sk-code | 90 | 0 | 10 |
| sk-design | 44 | 0 | 15 |
| sk-doc | 73 | 0 | 19 (17 of them in no mode's vocabulary at all, matching phase 002) |
| system-deep-loop | 13 | 0 | 0 |

The 62 and 36 match phase 002's counts after its `health` and `health-md` fix. Probe: `compiled-route.cjs --hub sk-doc --prompt "make a docx diff of these"` returns `defer` today, although `docx diff` is on sk-create-diff's `Keyword triggers:` line.
