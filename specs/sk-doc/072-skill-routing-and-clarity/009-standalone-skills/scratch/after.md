# After: Phase 9 gate set, final state

Captured 2026-10-28 in worktree `262-standalone-skills`, from the phase change before its commit. Runner: `specs/sk-doc/072-skill-routing-and-clarity/009-standalone-skills/scratch/gates.sh`. Baseline: `before.md`.

Three raw records, because the phase needed one repair in the middle:

| Record | What it holds | Files |
|---|---|---|
| First after run | 39 gates, two red on one stale manifest | `.scratch-dc90/072-009/after.txt`, `.scratch-dc90/072-009/after/` |
| Re-mint | the repair, one hub manifest | `git status` shows both copies of `mcp-tooling/manifest.json` modified |
| Final run | 39 gates, none red | `.scratch-dc90/072-009/after-final.txt`, `.scratch-dc90/072-009/after-final/` |

## 1. Gate set, before and after

39 gates. The baseline ran the same 39, all exit 0, so no gate is worse than `before.md`.

The first after run left two gates red, `route-guard` at 1 and `sk-code-setup` at 1. Both failures were the same fact: `mcp-tooling`'s compiled route manifest was stale, because `mcp-code-mode` changed and the `mcp-tooling` hub hashes its packets. The guard said so in one line:

```text
"hubId": "mcp-tooling", "ok": false, "reason": "stale-manifest",
"fix": "run node .skilled/bin/compiled-route-manifest.cjs refresh --hub mcp-tooling --skill-root .skilled/skills/mcp-tooling, then copy ... over ..."
"failures": 1
```

`sk-code-setup` read the same guard from inside its own battery, so the two reds were one defect and not two:

```text
FAIL  guard  node .skilled/bin/compiled-route-guard.cjs --json
STATUS=FAIL failed=1 skipped=0
```

Re-minting `mcp-tooling` and copying the refreshed manifest over the archived activation copy cleared both. The final run:

```text
$ node .skilled/bin/compiled-route-guard.cjs --json
7 hubs, all fresh, failures: 0          exit 0
$ node .skilled/commands/doctor/scripts/sk-code-setup-check.cjs
STATUS=OK legs=9                       exit 0
```

| Gate | Before (exit) | First after run (exit) | Final run (exit) |
|------|---------------|------------------------|------------------|
| psc-cli-classifier | 0 | 0 | 0 |
| psc-cli-external-orchestration | 0 | 0 | 0 |
| psc-mcp-tooling | 0 | 0 | 0 |
| psc-sk-code | 0 | 0 | 0 |
| psc-sk-design | 0 | 0 | 0 |
| psc-sk-doc | 0 | 0 | 0 |
| psc-system-deep-loop | 0 | 0 | 0 |
| route-guard | 0 | **1** | 0 |
| route-sync-check | 0 | 0 | 0 |
| verify-router-sync | 0 | 0 | 0 |
| pkg-cli-classifier | 0 | 0 | 0 |
| pkg-cli-external-orchestration | 0 | 0 | 0 |
| pkg-cli-orca | 0 | 0 | 0 |
| pkg-mcp-code-mode | 0 | 0 | 0 |
| pkg-mcp-tooling | 0 | 0 | 0 |
| pkg-sk-code | 0 | 0 | 0 |
| pkg-sk-design | 0 | 0 | 0 |
| pkg-sk-doc | 0 | 0 | 0 |
| pkg-sk-git | 0 | 0 | 0 |
| pkg-sk-prompt | 0 | 0 | 0 |
| pkg-sk-vision | 0 | 0 | 0 |
| pkg-system-deep-loop | 0 | 0 | 0 |
| pkg-system-skill-advisor | 0 | 0 | 0 |
| pkg-system-spec-kit | 0 | 0 | 0 |
| rule-copies | 0 | 0 | 0 |
| router-reach | 0 | 0 | 0 |
| hermes | 0 | 0 | 0 |
| sk-code-setup | 0 | **1** | 0 |
| root-metadata | 0 | 0 | 0 |
| leaf-manifest | 0 | 0 | 0 |
| router-tests | 0 | 0 | 0 |
| accuracy | 0 | 0 | 0 |
| validate | 0 | 0 | 0 |
| contract-drift | 0 | 0 | 0 |
| advisor-routing-suites | 0 | 0 | 0 |
| catalog-packages | 0 | 0 | 0 |
| sk-doc-script-tests | 0 | 0 | 0 |
| cite-drift-gate | 0 | 0 | 0 |
| skill-graph-freshness | 0 | 0 | 0 |

| Number | Before | Final |
|--------|--------|-------|
| Routing accuracy, full / holdout / ambiguity | 155/195, 49/66, 19/24 | 155/195, 49/66, 19/24 |
| compiled-route-guard | 7 of 7 fresh, failures 0 | 7 of 7 fresh, failures 0 |
| Route sync | 55 of 55 | 55 of 55 |
| Hermes skill copies | 67 in sync | 67 in sync |
| Router reach | wrong-hub 0, outranked 0, no-reach 0, allowed 9, operator-local 0 | same |
| router-tests | pass 40, fail 0 | pass 40, fail 0 |
| validate.sh --recursive --strict | `RESULT: PASSED` | `RESULT: PASSED` |
| advisor-routing-suites | 18 passed, 3 files | 18 passed, 3 files |
| leaf-manifest | 14 fresh | 14 fresh |
| skill-graph-freshness | report-only, nothing written | report-only, nothing written |

The final run left `git status` unchanged, so no gate wrote a tracked file.

## 2. Routing accuracy

```text
full_corpus_top1  155 / 195
holdout_top1       49 / 66
ambiguity_top1     19 / 24
```

Identical to `before.md` §2, so no route moved. The six files changed shape and prose only, and routing accuracy is scored from the same vocabulary.

## 3. Canon proof

`package_skill.py --check --strict` on the six changed files, with the live ledger:

```text
cli-orca              Result: PASS     SKILL.md has 3097 words
mcp-code-mode         Result: PASS
sk-git                Result: PASS     SKILL.md has 4895 words
sk-prompt             Result: PASS     SKILL.md has 3176 words
system-skill-advisor  Result: PASS     SKILL.md has 3412 words
system-spec-kit       Result: PASS     SKILL.md has 4996 words
```

The other eight skills pass the same check, so the gate is green for all fourteen.

`generate-leaf-manifest.cjs --check` on the same six:

```text
cli-orca              leaf-manifest.json OK  9193b5032798148726de1eaabf59627d5834ecbadb9592eec7f24247818d7600
mcp-code-mode         leaf-manifest.json OK  e8614e5a111ea5e51370589f56929693242c8a71496af4f9d6914526dfc79b11
sk-git                leaf-manifest.json OK  7a43047865f9ddf8917e365ab30f18f5653fa50a0b58eb12dea365a4f64edab3
sk-prompt             leaf-manifest.json OK  922a3899ce9d8ff96ed63d41689318e6b802471452a0647c8ab261c0d84bdb71
system-skill-advisor  leaf-manifest.json OK  14ce65e7ff94fe7a5b50c089acd7422d4b843e3623c850cc7a1888b6b38a27c4
system-spec-kit       leaf-manifest.json OK  1fbc955023a8eb474ff4c18b7eb12d7bb0b7e2aa5f29725c1dd69e1ca440c0d1
```

The six entries came off `routing-shape-known-debt.json`: the ledger held 26 entries at `HEAD` and holds 20 now. `routing-shape-known-debt-ratchet.test.cjs` passes 4 of 4 against the frozen snapshot, so no ceiling was raised to let them off. The generator test files pass 13 of 13 across six files, the new one included.

## 4. Routing shape, before and after

Counted the way `package_skill.py` counts: non-blank lines between the SMART ROUTING heading and the next heading, excluding `---`. The before column is the ledger's recorded count, the after column is the same rule measured on the final file.

| File | SMART ROUTING lines | words | MACHINE ROUTER |
|------|--------------------|-------|----------------|
| `.skilled/skills/cli-orca/SKILL.md` | 103 → 5 | 714 → 132 | `## 8. MACHINE ROUTER`, last |
| `.skilled/skills/mcp-code-mode/SKILL.md` | 129 → 5 | 773 → 118 | `## 10. MACHINE ROUTER`, last |
| `.skilled/skills/sk-git/SKILL.md` | 135 → 6 | 639 → 109 | `## 9. MACHINE ROUTER`, last |
| `.skilled/skills/sk-prompt/SKILL.md` | 174 → 6 | 1019 → 121 | `## 10. MACHINE ROUTER`, last |
| `.skilled/skills/system-skill-advisor/SKILL.md` | 226 → 8 | 1987 → 90 | `## 9. MACHINE ROUTER`, last |
| `.skilled/skills/system-spec-kit/SKILL.md` | 312 → 6 | 1712 → 102 | `## 8. MACHINE ROUTER`, last |

Every section is inside the 12-line and 180-word limits. The machine block is the last H2 in all six files, and SMART ROUTING is `## 2` in all six, so the first instruction a reader meets comes before the machine block and no other section had to move.

The whole-file diff of each file is the version bump, the new SMART ROUTING body and the moved block, which the review confirmed by diffing each file with those two sections removed.

## 5. What stayed byte-identical

Every machine line, matched by the canon's own names (`INTENT_SIGNALS`, `RESOURCE_MAP`, `LOADING_LEVELS`, `NOISY_SYNONYMS`, `COMMAND_BOOSTS`, `UNKNOWN_FALLBACK_CHECKLIST`, `DEFAULT_RESOURCE`, `RESOURCE_BASES`, `UNKNOWN_FALLBACK`, `FOREIGN_OWNERS`, `ORCA_PLACEMENT`, `discover_markdown_resources`, `_guard_in_skill`), is unchanged from `HEAD`, compared as a multiset per file:

| File | Machine lines HEAD | Final | Same multiset |
|------|-------------------|-------|---------------|
| cli-orca | 9 | 9 | yes |
| mcp-code-mode | 8 | 8 | yes |
| sk-git | 9 | 9 | yes |
| sk-prompt | 6 | 6 | yes |
| system-skill-advisor | 7 | 7 | yes |
| system-spec-kit | 9 | 9 | yes |

The read-only review checked the same question at fenced-block granularity and found every moved block byte-identical except the two it flagged and this phase then restored. `sk-git`'s `route_git_resources` carries its full body again, `UNKNOWN_FALLBACK` included, so the no-match outcome is named in the file; `system-spec-kit`'s scoring bodies point at `references/cli/shared-smart-router.md` section 2 with a comment that says the pointer is a pointer.

## 6. The generator and the `hooks/` scope

`generate-leaf-manifest.cjs` now reads a standalone skill's `leaf-scopes.json`. The standalone path calls the same `readLeafScopes`, `normalizeLeafScope`, `collectScopedLeaves` and `walkLeafFiles` the hub path calls, and adds one check the hub path does not need: a scope has to sit under a declared leaf root, or it fails closed with `OUT_OF_ROOT_LEAF_SCOPE`. A scope whose mode has no config entry fails with `ORPHAN_LEAF_SCOPE_MODE`.

`system-skill-advisor/leaf-scopes.json` is a bare array in the same shape as the hub copy, and it names only Markdown under `hooks/`: `hooks/skill-advisor-hook.md`, `hooks/skill-advisor-hook-validation.md`, and the three `README.md` files under `hooks/claude/`, `hooks/lib/` and `hooks/pi/`.

The manifest and the aliases lost exactly nine leaves, no leaf was added, and every removed path is a non-Markdown file under `hooks/`:

```text
hooks/claude/directive-lifecycle-boundary.ts
hooks/claude/user-prompt-submit.ts
hooks/lib/directive-lifecycle-contract.ts
hooks/lib/directive-lifecycle-file-store.ts
hooks/lib/directive-lifecycle-store.py
hooks/lib/directive-lifecycle-vectors.json
hooks/lib/directive-lifecycle.ts
hooks/lib/skill-advisor-cli-fallback.ts
hooks/pi/prompt-advisor.ts
```

136 leaves before, 127 after, and no non-Markdown leaf remains anywhere in that skill's manifest.

The new test, `generate-leaf-manifest-standalone-scopes.test.cjs`, fails on `HEAD`'s generator: copied to a probe directory with the test, `HEAD` exits 1, and the first assertion shows `hooks/runtime.ts` leaking into the leaves. That is the negative control the test rests on.

## 7. sk-git, held under the word ceiling

`sk-git/SKILL.md` measures 5,000 words at `HEAD` against a 5,000-word hard cap, so the canon shape plus the restored router body did not fit. Three prose subsections now state their rule once and point at the reference that carries the detail: `references/continuous-integration.md`, `references/remote-branch-policy.md` and the two `scripts/` READMEs. The file ends at 4,896 words by `wc -w` and 4,895 by `package_skill.py`'s own count, and every intent table, loading level and default resource is unchanged.

## 8. Pointers repointed

Moving each router into a final section broke pointers that named `§2`. `sk-prompt`'s own `manual-testing-playbook/` held fourteen of them across eight files. All fourteen are repointed, and `grep -rn '§2' .skilled/skills/sk-prompt/manual-testing-playbook/` returns 0 rows:

| File | Pointers |
|---|---|
| `mode-detection/mode-prefix-keyword-collision.md` | 4 |
| `smart-routing/intent-model-keyword-scoring.md` | 2 |
| `smart-routing/on-demand-keyword-loading.md` | 2 |
| `smart-routing/unknown-fallback-checklist.md` | 2 |
| `format-modes/format-guide-on-demand.md` | 1 |
| `framework-selection/user-named-framework-override.md` | 1 |
| `manual-testing-playbook.md` | 1 |
| `smart-routing/ambiguity-delta-tiebreaker.md` | 1 |

Four of the fourteen were rewritten rather than renumbered, because the section number alone no longer says what is in the section: `the final MACHINE ROUTER section's primary detection`, `the final MACHINE ROUTER section's routing tables`, `the final MACHINE ROUTER section's select_intents() pseudocode`, and the same shape in the ambiguity file.

## 9. Ledger, mirrors and carriers

```text
$ route-sync-check
all 55 served copies match their authored files
$ hermes --check
PASS: 67 Hermes skill copies in sync
$ compiled-route-guard --json
7 hubs, 0 failures
$ check-contract-drift
[CONTRACT DRIFT] OK commands=3
```

Seven `.hermes` mirrors were regenerated: one for each of the six skills, plus `sk-create-skill` because the generator changed inside it. The `sk-doc` compiled-route manifest was refreshed for the same reason, and the `mcp-tooling` manifest because `mcp-code-mode` is one of its packets. Both were copied over their archived activation copies, which is why `compiled-route-sync` reads 55 of 55. `skill-graph-freshness --strict` reports no stale, zombie, ghost or signal-drift row and writes nothing.
