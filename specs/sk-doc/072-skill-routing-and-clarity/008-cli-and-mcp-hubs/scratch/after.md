# After: Phase 8 gate set, final state

Captured 2026-10-28 in worktree `261-cli-and-mcp-hubs`, from the phase change before its commit. Runner: `specs/sk-doc/072-skill-routing-and-clarity/008-cli-and-mcp-hubs/scratch/gates.sh`. Raw logs: `.scratch-dc90/072-008/after/`, one file per gate. Baseline: `before.md`.

The runner's default output directory still names an earlier phase's path, so both runs pass their output directory explicitly. That default is the only thing in the runner that is not this phase's; no gate command differs between the two runs.

## 1. Gate set, before and after

39 gates. The baseline ran the same 39, all exit 0, and every gate here exits 0 too, so no gate is worse than `before.md`.

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
| skill-graph-freshness | 0 | 0 |

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
| root-metadata | 14 passed, 0 failed | 14 passed, 0 failed |
| sk-code-setup | legs 9, STATUS=OK | legs 9, STATUS=OK |
| validate.sh --recursive --strict | `RESULT: PASSED` | `RESULT: PASSED` |

Nine of the 39 logs differ between the two runs, and every difference is a number the phase was meant to move or a duration. The three `parent-skill-check` logs carry the debt counts and versions below. The two hub `package_skill.py` logs lose their single routing-shape advisory, because neither hub carries known debt any more. `router-reach` prints `advisor generation: 1` before and `53` after: that is the advisor's projection counter, not a check result, and the gate's own line, `checked=7 hub(s), wrong-hub=0, outranked=0, no-reach=0, allowed=9, probe-error=0, operator-local=0`, is identical. The remaining three, `router-tests`, `cite-drift-gate` and `advisor-routing-suites`, differ only in their timing lines, with the same pass and fail counts.

## 2. Routing accuracy

```text
full_corpus_top1  155 / 195
holdout_top1       49 / 66
ambiguity_top1     19 / 24
```

Identical to `before.md` §2, so no route moved: this phase changed where routing detail is written, not what it decides. `compiled-route-guard.cjs --json` reports seven hubs, every one `fresh`, `failures: 0`.

## 3. Canon proof

`parent-skill-check` 12b on the three hubs, with the shipped ledger:

```text
$ node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/cli-external-orchestration
PASS: 12b-routing-shape: hub and 7 packet(s) follow the routing canon (0 known debt)
PASS: 13a-version: all JSON routing files carry the SKILL.md version 1.7.10.0
PASS: 13b-version: SKILL.md version 1.7.10.0 matches the newest changelog entry
OK: parent-skill-check — all hard invariants passed, 0 warnings

$ node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/cli-classifier
PASS: 12b-routing-shape: hub and 1 packet(s) follow the routing canon (0 known debt)
PASS: 13a-version: all JSON routing files carry the SKILL.md version 0.8.4.0
PASS: 13b-version: SKILL.md version 0.8.4.0 matches the newest changelog entry
OK: parent-skill-check — all hard invariants passed, 0 warnings

$ node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/mcp-tooling
INFO: 12b-routing-shape: mcp-tooling/mcp-magicpath: routing shape: known debt, RS-001, RS-002 (migrate to the routing canon)
PASS: 12b-routing-shape: hub and 9 packet(s) follow the routing canon (1 known debt)
PASS: 13a-version: all JSON routing files carry the SKILL.md version 1.8.9.0
PASS: 13b-version: SKILL.md version 1.8.9.0 matches the newest changelog entry
OK: parent-skill-check — all hard invariants passed, 0 warnings
```

`package_skill.py --check --strict` on all eighteen changed files, sixteen packets and two hubs:

```text
cli-external-orchestration PASS   cli-claude-code PASS   cli-codex PASS   cli-cursor PASS
cli-devin PASS   cli-hermes PASS   cli-opencode PASS   cli-pi PASS
cli-classifier PASS   cli-jev PASS
mcp-aside-devtools PASS   mcp-chrome-devtools PASS   mcp-click-up PASS   mcp-figma PASS
mcp-mobbin PASS   mcp-notion PASS   mcp-obsidian PASS   mcp-refero PASS
```

The two hub `SKILL.md` files also pass in the runner's fourteen `package_skill.py` runs with no advisory at all, which is what removing their ledger entries bought.

`routing-shape-known-debt-ratchet.test.cjs` passes 4 of 4 against the shipped ledger, so the eighteen entries came off without raising any ceiling:

```text
$ node --test .skilled/skills/sk-doc/sk-create-skill/scripts/tests/routing-shape-known-debt-ratchet.test.cjs
✔ routing ceilings are integers no larger than the frozen snapshot
✔ every live debt key is already in the frozen snapshot
✔ every live debt entry holds integers and codes within the frozen entry
✔ the ratchet helper names a new key, a raised count and a new code
pass 4  fail 0
```

## 4. Routing shape, before and after

Counted the way `package_skill.py` and `parent-skill-check` count: non-blank lines between the SMART ROUTING heading and the next heading, excluding `---`. The before column is the ledger's recorded count, the after column is the same rule measured on the final file.

| File | SMART ROUTING lines | words | MACHINE ROUTER |
|------|--------------------|-------|----------------|
| `.skilled/skills/cli-external-orchestration/SKILL.md` | 26 → 10 | 586 → 139 | appended → `## 6. MACHINE ROUTER`, last |
| `cli-claude-code/SKILL.md` | 87 → 6 | 808 → 124 | appended → `## 9. MACHINE ROUTER`, last |
| `cli-codex/SKILL.md` | 86 → 6 | 588 → 124 | appended → `## 9. MACHINE ROUTER`, last |
| `cli-cursor/SKILL.md` | 94 → 3 | 685 → 65 | appended → `## 9. MACHINE ROUTER`, last |
| `cli-devin/SKILL.md` | 85 → 3 | 605 → 63 | appended → `## 9. MACHINE ROUTER`, last |
| `cli-hermes/SKILL.md` | 82 → 6 | 610 → 118 | appended → `## 9. MACHINE ROUTER`, last |
| `cli-opencode/SKILL.md` | 64 → 7 | 1026 → 125 | appended → `## 8. MACHINE ROUTER`, last |
| `cli-pi/SKILL.md` | 57 → 5 | 492 → 115 | appended → `## 9. MACHINE ROUTER`, last |
| `.skilled/skills/cli-classifier/SKILL.md` | 24 → 11 | 334 → 140 | appended → `## 6. MACHINE ROUTER`, last |
| `cli-jev/SKILL.md` | 136 → 5 | 771 → 130 | appended → `## 9. MACHINE ROUTER`, last |
| `mcp-aside-devtools/SKILL.md` | 128 → 4 | 754 → 92 | appended → `## 9. MACHINE ROUTER`, last |
| `mcp-chrome-devtools/SKILL.md` | 128 → 4 | 736 → 77 | appended → `## 9. MACHINE ROUTER`, last |
| `mcp-click-up/SKILL.md` | 172 → 5 | 1107 → 115 | appended → `## 9. MACHINE ROUTER`, last |
| `mcp-figma/SKILL.md` | 142 → 6 | 1276 → 163 | appended → `## 8. MACHINE ROUTER`, last |
| `mcp-mobbin/SKILL.md` | 135 → 5 | 1161 → 132 | appended → `## 10. MACHINE ROUTER`, last |
| `mcp-notion/SKILL.md` | 177 → 5 | 1069 → 158 | appended → `## 9. MACHINE ROUTER`, last |
| `mcp-obsidian/SKILL.md` | 294 → 4 | 1676 → 96 | appended → `## 9. MACHINE ROUTER`, last |
| `mcp-refero/SKILL.md` | 132 → 4 | 1100 → 96 | appended → `## 10. MACHINE ROUTER`, last |

Every section is inside the 12-line and 180-word limits, the largest being `cli-classifier` at 11 lines and `mcp-figma` at 163 words. `MACHINE ROUTER` is the last H2 in all eighteen files and in all eighteen `.hermes` mirrors, and in every one of them the section after SMART ROUTING is still `## 3. HOW IT WORKS`, so the appendix was appended and no other H2 moved.

`mcp-tooling/SKILL.md` is not in the table because it was not changed: at the baseline it was 10 non-blank lines and 148 words, inside both limits, and it has no `MACHINE ROUTER` heading. Its nine packets changed; the hub did not.

## 5. What stayed byte-identical

Every machine line, matched by the canon's own regex over `INTENT_SIGNALS`, `INTENT_MODEL`, `RESOURCE_MAP`, `UNKNOWN_FALLBACK_CHECKLIST`, `LOADING_LEVELS`, `LOAD_LEVELS`, `DEFAULT_RESOURCE`, `DEFAULT_RESOURCES`, `def discover_markdown_resources` and `def _guard_in_skill`, is unchanged from `HEAD`, and so is every fenced block:

| File | Machine lines HEAD | Working tree | Same multiset | Fenced blocks |
|------|-------------------|--------------|---------------|---------------|
| cli-external-orchestration | 0 | 0 | yes | 2, same |
| cli-claude-code | 3 | 3 | yes | 8, same |
| cli-codex | 3 | 3 | yes | 7, same |
| cli-cursor | 3 | 3 | yes | 7, same |
| cli-devin | 3 | 3 | yes | 9, same |
| cli-hermes | 3 | 3 | yes | 4, same |
| cli-opencode | 3 | 3 | yes | 4, same |
| cli-pi | 3 | 3 | yes | 2, same |
| cli-classifier | 0 | 0 | yes | 2, same |
| cli-jev | 5 | 5 | yes | 5, same |
| mcp-aside-devtools | 5 | 5 | yes | 3, same |
| mcp-chrome-devtools | 5 | 5 | yes | 2, same |
| mcp-click-up | 5 | 5 | yes | 9, same |
| mcp-figma | 6 | 6 | yes | 5, same |
| mcp-mobbin | 6 | 6 | yes | 6, same |
| mcp-notion | 5 | 5 | yes | 6, same |
| mcp-obsidian | 5 | 5 | yes | 10, same |
| mcp-refero | 6 | 6 | yes | 6, same |

Every declaration line matches too, so no dictionary gained or lost a key, and the `LOADING_LEVELS` `ALWAYS` rows still name the same in-packet resources: they are a separate layer from the hub `ROUTER.md` first slice, and the phase left them exactly as they stood.

The read-only review ran the same comparison over the 36 changed `SKILL.md` files, eighteen canonical and eighteen mirrors, and found the same result: 0 machine lines lost, 0 fenced blocks lost or altered, no machine line duplicated.

## 6. Ledger, mirrors and sync

All eighteen entries are gone from `routing-shape-known-debt.json`: the two hubs and the sixteen packets. The ledger now holds 8 entries where `HEAD` held 26.

`mcp-tooling/mcp-magicpath` keeps its entry, because another session is deprecating that mode and the phase leaves the packet untouched: no diff, no changelog, no version step. `cli-orca` and `mcp-code-mode` also keep theirs; they are standalone skills rather than packets of these hubs.

The three compiled-route manifests were refreshed and copied over the archived activation copies that `compiled-route-sync` compares. `mcp-tooling`'s manifest moved even though its hub `SKILL.md` did not, and the guard calls it `fresh`, so the manifest matches its own inputs after the refresh.

```text
$ route-sync-check
all 55 served copies match their authored files
$ hermes --check
PASS: 67 Hermes skill copies in sync
$ compiled-route-guard --json
7 hubs, 0 failures
$ contract-drift
[CONTRACT DRIFT] OK commands=3
```

The eighteen `.hermes` mirrors were regenerated from the changed files, and they carry the final wording, including the fixes listed in §8. `skill-graph-freshness` finds no stale compiled graph, no zombie, no ghost and no signal drift; that gate reads only and writes nothing, because the canonical reindex stays operator-gated.

## 7. Live routing, six prompts

`node .skilled/bin/compiled-route.cjs --hub <hub> --prompt "<task>"`, exit 0 on every row:

| Hub | Prompt | action / selection | target |
|-----|--------|--------------------|--------|
| cli-external-orchestration | detached opencode session | `route` / `single` | `cli-opencode` |
| cli-external-orchestration | codex with gpt high | `defer` | none |
| cli-classifier | jev pick one of these options | `defer` | none |
| mcp-tooling | obsidian vault | `route` / `single` | `mcp-obsidian` |
| mcp-tooling | clickup task | `route` / `single` | `mcp-click-up` |
| mcp-tooling | chrome devtools screenshot | `route` / `single` | `mcp-chrome-devtools` |

The review ran seven prompts side by side against `main` and found the decision and the targets identical on all seven; only `effectivePolicyHash` differs, which is expected because the policy inputs carry the new versions and the guard calls every hub fresh.

## 8. Review fixes, verified in the final tree

The read-only review returned `FINDINGS: P0=0 P1=2 P2=3`, and all five are fixed. Each one is a claim about text, so each is checked here against the file rather than against a gate:

| Finding | Checked in the final tree |
|---------|---------------------------|
| The two mcp packets' link to the shared helper reference climbed one level too far | `mcp-aside-devtools/SKILL.md:244` and `mcp-chrome-devtools/SKILL.md:222` read `../../system-spec-kit/references/cli/shared-smart-router.md`, which resolves from `.skilled/skills/mcp-tooling/<packet>/`. The mirrors at `.hermes/skills/mcp-aside-devtools/SKILL.md:249` and `.hermes/skills/mcp-chrome-devtools/SKILL.md:227` carry the `.hermes` depth, `../../../.skilled/skills/system-spec-kit/references/cli/shared-smart-router.md`, and both resolve. |
| The shared statement of the helpers claimed call sequences the packets do not carry | `shared-smart-router.md:17` now states what the seven packets measurably contain: none defines any of the seven helpers; every packet names `discover_markdown_resources()` and `_guard_in_skill()`; only `cli-hermes` names `score_intents()` and `select_intents()`; `cli-hermes` and `cli-opencode` name `load_if_available()` and `get_routing_key()`. A per-helper count over the seven files gives exactly that table, and `_task_text` and `keyword_present` appear in none of them. |
| The pattern list in the two mcp packets began at "Pattern 3" | `mcp-aside-devtools/SKILL.md:246-247` and `mcp-chrome-devtools/SKILL.md:224-225` now read `Pattern 1` and `Pattern 2`, and `grep "Pattern [0-9]"` over both files returns 1 and 2 only. |
| `cli-opencode` still called §2 alone the routing authority | `cli-opencode/SKILL.md:222` now reads "Smart Routing (Section 2) is the summary. The final `MACHINE ROUTER` section of this file is the single routing authority", which is the form the other six packets already used. |
| Eight packets named a signal id `hub-router.json` does not define | All eight now name the `routerSignals` id: `cli-codex`, `cli-claude-code`, `cli-cursor`, `cli-devin`, `mcp-click-up`, `mcp-figma`, `mcp-obsidian`, `mcp-refero`. Each of the eight keys is present in its hub's `routerSignals`, and the same wording is in the eight mirrors. |

## 9. The one statement of the shared helpers

`system-spec-kit/references/cli/shared-smart-router.md` is where the shared helper bodies live, and the phase made it the only statement of two things. Its opening paragraph now describes the seven packets as they are, which is the fix above. Its `route_<PROVIDER>_resources` line gained `hermes`, so the slug list names all seven providers rather than six. Its closing pointer now sends a reader to "each skill's final `MACHINE ROUTER` section" instead of "`SKILL.md` §2 Smart Routing", which is where the dictionaries moved. The file steps from 1.6.1.0 to 1.6.2.0.

That closing line, at line 179, is the one a later phase's review flagged. It was checked here and it was already correct: all seven cli packets end in a `MACHINE ROUTER` section that holds their `INTENT_SIGNALS`, `RESOURCE_MAP`, `LOADING_LEVELS` and `UNKNOWN_FALLBACK_CHECKLIST`.
