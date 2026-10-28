# After: Phase 7 gate set, final state

Captured 2026-10-28 in worktree `257-single-vocabulary-source`, from the phase change before its commit. Runner: `specs/sk-doc/072-skill-routing-and-clarity/007-sk-design-and-deep-loop-hubs/scratch/gates.sh`. Raw logs: `.scratch-dc90/072-007/after/`, one file per gate. Baseline: `before.md`.

The runner is the baseline runner plus `skill-graph-freshness`. Its default output directory was the previous phase's path and now names this phase's, a one-line change that does not touch any gate command.

## 1. Gate set, before and after

39 gates. The baseline ran 38, all exit 0. Every gate here exits 0 too, so no gate is worse than `before.md`.

| Gate | Before (exit) | After (exit) |
|------|---------------|--------------|
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
| contract-drift | 0 | 0 |
| advisor-routing-suites | 0 | 0 |
| catalog-packages | 0 | 0 |
| sk-doc-script-tests | 0 | 0 |
| cite-drift-gate | 0 | 0 |
| skill-graph-freshness | n/a (not in the baseline runner) | 0 |

| Number | Before | After |
|--------|--------|-------|
| Routing accuracy, full / holdout / ambiguity | 155/195, 49/66, 19/24 | 155/195, 49/66, 19/24 |
| compiled-route-guard | 7 of 7 fresh, failures 0 | 7 of 7 fresh, failures 0 |
| Route sync | 55 of 55 | 55 of 55 |
| Hermes skill copies | 67 in sync | 67 in sync |
| Router reach | wrong-hub 0, outranked 0, no-reach 0, allowed 9, operator-local 0 | wrong-hub 0, outranked 0, no-reach 0, allowed 9, operator-local 0 |
| router-tests | pass 40, fail 0 | pass 40, fail 0 |
| verify-router-sync | 5 of 5 | 5 of 5 |
| leaf-manifest | 14 fresh | 14 fresh |
| validate.sh --recursive --strict | `RESULT: PASSED` | `RESULT: PASSED` |

## 2. Routing accuracy

```text
full_corpus_top1  155 / 195
holdout_top1       49 / 66
ambiguity_top1     19 / 24
```

Identical to `before.md` §2, so no route moved. `compiled-route-guard.cjs --json` reports seven hubs, every one `fresh`, `failures: 0`.

## 3. Canon proof

`parent-skill-check` 12b on both hubs, with the shipped ledger:

```text
$ node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/sk-design
PASS: 12b-routing-shape: hub and 4 packet(s) follow the routing canon (0 known debt)
PASS: 13a-version: all JSON routing files carry the SKILL.md version 2.0.8.0
OK: parent-skill-check — all hard invariants passed, 0 warnings

$ node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/system-deep-loop
PASS: 12b-routing-shape: hub and 3 packet(s) follow the routing canon (0 known debt)
PASS: 13a-version: all JSON routing files carry the SKILL.md version 1.6.18.0
OK: parent-skill-check — all hard invariants passed, 0 warnings
```

`package_skill.py --check --strict` on all nine files:

```text
sk-design PASS   sk-design-fundamentals PASS   sk-design-md-generator PASS
sk-design-chart PASS   sk-design-diagram PASS
system-deep-loop PASS   deep-research PASS   deep-review PASS   deep-ai-council PASS
```

`routing-shape-known-debt-ratchet.test.cjs` passes 4 of 4, so the nine entries came off without raising any ceiling.

## 4. Routing shape, before and after

Counted the way `package_skill.py` and `parent-skill-check` count: non-blank lines between the SMART ROUTING heading and the next heading, excluding `---`. The before column is the ledger's recorded count, the after column is the same rule measured on the final file.

| File | SMART ROUTING lines | words | MACHINE ROUTER |
|------|--------------------|-------|----------------|
| `.skilled/skills/sk-design/SKILL.md` | 88 → 12 | 901 → 148 | in §2 → `## 6. MACHINE ROUTER`, last |
| `sk-design-fundamentals/SKILL.md` | 164 → 8 | 902 → 145 | in §2 → `## 9. MACHINE ROUTER`, last |
| `sk-design-md-generator/SKILL.md` | 145 → 5 | 1183 → 71 | in §2 → `## 9. MACHINE ROUTER`, last |
| `sk-design-chart/SKILL.md` | 44 → 5 | 297 → 102 | in §2 → `## 9. MACHINE ROUTER`, last |
| `sk-design-diagram/SKILL.md` | 81 → 7 | 617 → 134 | in §2 → `## 7. MACHINE ROUTER`, last |
| `.skilled/skills/system-deep-loop/SKILL.md` | 38 → 10 | 974 → 159 | in §2 → `## 9. MACHINE ROUTER`, last |
| `deep-research/SKILL.md` | 157 → 6 | 842 → 120 | in §2 → `## 9. MACHINE ROUTER`, last |
| `deep-review/SKILL.md` | 163 → 8 | 723 → 134 | in §2 → `## 8. MACHINE ROUTER`, last |
| `deep-ai-council/SKILL.md` | 168 → 9 | 911 → 97 | in §2 → `## 9. MACHINE ROUTER`, last |

Every section is inside the 12-line and 180-word limits, `MACHINE ROUTER` is the last H2 in all nine files, and in eight of them the section after SMART ROUTING is `## 3. HOW IT WORKS`. `deep-ai-council` is the one exception: it opens with OPERATIONAL MODES and WHEN TO USE before routing, so its SMART ROUTING is §3 and the next heading is `## 4. HOW IT WORKS`.

## 5. What stayed byte-identical

Every machine line, matched by the canon's own regex over `INTENT_SIGNALS`, `RESOURCE_MAP`, `UNKNOWN_FALLBACK_CHECKLIST`, `def discover_markdown_resources` and `def _guard_in_skill`, is unchanged from `HEAD`:

| File | Machine lines HEAD | Working tree | Same multiset |
|------|-------------------|--------------|---------------|
| sk-design | 2 | 2 | yes |
| sk-design-fundamentals | 4 | 4 | yes |
| sk-design-md-generator | 5 | 5 | yes |
| sk-design-chart | 2 | 2 | yes |
| sk-design-diagram | 0 | 0 | yes |
| system-deep-loop | 1 | 1 | yes |
| deep-research | 5 | 5 | yes |
| deep-review | 5 | 5 | yes |
| deep-ai-council | 4 | 4 | yes |

The read-only review of the same diff found the same result for every fenced block as well: no machine line and no fenced block differs by a byte, in the nine files and in their nine `.hermes` mirrors.

## 6. Ledger, mirrors and sync

All nine entries are gone from `routing-shape-known-debt.json`: the two hubs and the seven packets. The diff removes 80 lines and adds none, and the ledger now holds 26 entries where `HEAD` held 35.

The two compiled-route manifests (`sk-design`, `system-deep-loop`) were refreshed and copied over the archived activation copies that `compiled-route-sync` compares. The three deep-loop command contracts were recompiled after the hub `SKILL.md` changed, three digest lines each, and `check-contract-drift` reads `OK commands=3`.

```text
$ route-sync-check
all 55 served copies match their authored files
$ hermes --check
PASS: 67 Hermes skill copies in sync
$ compiled-route-guard --json
7 hubs, 0 failures
```

`skill-graph.json` was regenerated, at `generated_at 2026-10-28T13:02:36.678775+00:00` with 14 skills, and the new `skill-graph-freshness` gate finds no stale compiled graph, no zombie, no ghost and no signal drift. That gate reads only and writes nothing, because the canonical reindex stays operator-gated.

## 7. Live routing, seven prompts

`node .skilled/bin/compiled-route.cjs --hub <hub> --prompt "<task>"`, exit 0 on every row:

| Hub | Prompt | decision / selection | target |
|-----|--------|---------------------|--------|
| sk-design | what spacing scale should this card use | `route` / `single` | `sk-design-fundamentals` |
| sk-design | extract a design.md from this url | `route` / `single` | `sk-design-md-generator` |
| sk-design | make a bar chart of these numbers | `route` / `single` | `sk-design-chart` |
| sk-design | draw a flowchart of the login flow | `route` / `single` | `sk-design-diagram` |
| system-deep-loop | run a deep review of this packet | `route` / `single` | `deep-review`, `workflowMode: review` |
| system-deep-loop | deep research on caching strategies | `route` / `single` | `deep-research`, `workflowMode: research` |
| system-deep-loop | convene an ai council on this design | `route` / `single` | `deep-ai-council`, `workflowMode: ai-council` |

The review's side-by-side run found `effectivePolicyHash` differs from `main` because the hash covers the changed manifests. The worktree hash equals its own `activation/*/manifest.json` and the guard calls both hubs fresh, so the difference is the expected consequence of the manifest edit.

## 8. The replay's tie is not a routing defect

`leaf-route-replay.cjs` keeps two intents on the mode-hint row. Its keyword arm scores the hub's stage-two intents across the whole `ROUTER.md` with a one-point ambiguity band, and it does not model the hub's mode-hint rule, so `research:` and the audit-flavoured wording are read as a near tie:

```text
MO-004 | intents=2 RESEARCH+REVIEW | exact=false | f1=0.667
research: Investigate whether our deep review findings are repeating because the source context is stale, and write a research summary before any audit verdict.
```

The live compiled route resolves the same prompt through the hub rule and sends it to `deep-research` with `workflowMode: research`, which is the route `manual-testing-playbook/mode-routing/mode-hint-override.md` expects. So the tie exists in the replay only, at `leaf-route-replay.cjs`, and not in routing. The replay's own gate (`router-tests`) passes 40 of 40 before and after, so this is recorded rather than fixed.
