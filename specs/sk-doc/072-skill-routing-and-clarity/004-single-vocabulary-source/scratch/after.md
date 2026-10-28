# After: Phase 4 gate set, final state

Captured 2026-10-28 on the branch rebased onto origin/main `281a3790c8` (phase 003 landed as `014dc49b0f` and `4b84ab1dcc`). `worktree-naming.sh provision` ran first and rebuilt the advisor runtime. Runner: `.scratch-dc90/072-004/gates.sh`. Raw logs: `.scratch-dc90/072-004/final3/`. Baseline: `baseline.md`.

## 1. Gate set, before and after

39 of 39 exit 0. The 33 baseline gates are unchanged, and the six extras pass.

| Gate | Before (exit) | After (exit) |
|------|------|------|
| psc-cli-classifier | 0 | 0 |
| psc-cli-external-orchestration | 0 | 0 |
| psc-mcp-tooling | 0 | 0 |
| psc-sk-code | 0 | 0 |
| psc-sk-design | 0 | 0 |
| psc-sk-doc | 0 | 0 |
| psc-system-deep-loop | 0 | 0 |
| route-guard | 0 | 0 |
| route-sync-check | 0 | 0 |
| verify-router-sync | 0 | 0 |
| pkg-cli-classifier | 0 | 0 |
| pkg-cli-external-orchestration | 0 | 0 |
| pkg-cli-orca | 0 | 0 |
| pkg-mcp-code-mode | 0 | 0 |
| pkg-mcp-tooling | 0 | 0 |
| pkg-sk-code | 0 | 0 |
| pkg-sk-design | 0 | 0 |
| pkg-sk-doc | 0 | 0 |
| pkg-sk-git | 0 | 0 |
| pkg-sk-prompt | 0 | 0 |
| pkg-sk-vision | 0 | 0 |
| pkg-system-deep-loop | 0 | 0 |
| pkg-system-skill-advisor | 0 | 0 |
| pkg-system-spec-kit | 0 | 0 |
| rule-copies | 0 | 0 |
| router-reach | 0 | 0 |
| hermes | 0 | 0 |
| sk-code-setup | 0 | 0 |
| root-metadata | 0 | 0 |
| leaf-manifest | 0 | 0 |
| router-tests | 0 | 0 |
| accuracy | 0 | 0 |
| validate | 0 | 0 |
| vocab | 1 (drift 375) | 0 |
| intent-carry | 0 | 0 |
| leaf-replay | 0 | 0 |
| new-tests | n/a (tests are new) | 0 |
| derived-freshness | n/a | 0 |
| skill-graph-freshness | n/a | 0 |

| Number | Before | After |
|--------|--------|-------|
| Routing accuracy, full / holdout / ambiguity | 155/195, 49/66, 19/24 | 155/195, 49/66, 19/24 |
| compiled-route-guard | 7 of 7 fresh | 7 of 7 fresh (all re-minted) |
| router-tests | pass 40, fail 0 | pass 40, fail 0 |
| validate.sh --recursive --strict | RESULT: PASSED | RESULT: PASSED |

## 2. Vocabulary check

`ci-hub-vocabulary-source.cjs`: drift 375 before any edit, 0 after, on all 7 hubs. sk-code prints `note: stage-two leg not applied`.

SC-001 on real files: the three mcp-tooling routing files were copied to scratch and run with `--skills-root`. Unmodified, they print `RESULT: PASSED`. Each broken copy prints `RESULT: FAILED` with exit 1 on its own leg:
- an extra registry alias: `alias mcp-chrome-devtools: "not-a-routed-term" is not in hub-router.json vocabulary`
- `health-md` removed from the OBSIDIAN intent: `stage-two mcp-obsidian: "health-md" routes here in hub-router.json but no ROUTER.md intent for this mode carries it`
- an extra term on a packet trigger line: `triggers mcp-figma: "unrouted figma phrase" is not in hub-router.json vocabulary`

Probes after re-mint: `make a docx diff of these` routes to sk-create-diff (before: defer). `/create:skill-parent for a new hub` routes to sk-create-skill-parent and `/create:skill for a helper` to sk-create-skill, each `single`.

## 3. Router reach

| | Before | Interim | After |
|--|--|--|--|
| Phrases probed | 510 | 723 | 717 |
| wrong-hub | 0 | 0 | 0 |
| outranked | 0 | 9 | 0 |
| no-reach | 0 | 2 | 0 |
| allowed | 3 | 3 | 9 |

The interim run caught 11 stage-one terms the reach check had never probed. They had never been in ROUTER.md. Five were removed from the hub: `spec kit runtime`, `spec kit memory`, `design tokens`, `task list` and `dom inspect`. Six two-hub disputes were allowlisted with both hubs pinned.

The interim run also dropped accuracy to 154/195 and ambiguity to 18/24. Per-prompt scoring against the old and new graph-metadata found one prompt, "Kick off another deep-review wave for the packet docs ...", moving from system-deep-loop to sk-doc. Bisection over the 46 new sk-doc intent_signals isolated `mcp bake-off` (its token `off`), which was then removed.

## 4. Not a gate: leaf-route replay

total gold 65, scored 57: tied 2 to 3, mean_f1 0.9235 to 0.9176, exact 51 to 50. The one changed row is system-deep-loop's confuser "research: investigate whether our deep review findings are repeating ...". It now ties RESEARCH with REVIEW, because REVIEW carries the review mode's stage-one term `deep review`. Recorded in implementation-summary Known Limitations.

## 5. After the rebase

package_skill and parent-skill-check failed sk-doc on the new 180-word SMART ROUTING ratchet: 822 words against a recorded debt of 816, from this phase's one-line authority sentence. The sentence's trailing clause was cut, and both checks pass. The ledger is unchanged.
