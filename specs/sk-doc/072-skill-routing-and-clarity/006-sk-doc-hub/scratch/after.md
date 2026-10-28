# After: Phase 6 gate set, final state

Captured 2026-10-28 in worktree `257-single-vocabulary-source`, from the phase change before its commit. Runner: `specs/sk-doc/072-skill-routing-and-clarity/006-sk-doc-hub/scratch/gates.sh`. Raw logs: `.scratch-dc90/072-006/after/`; the tables below are that run plus the two rechecks named where they occur. Baseline: `before.md`.

## 1. Gate set, before and after

38 gates. The baseline ran 35; this runner adds `catalog-packages`, `sk-doc-script-tests` and `cite-drift-gate`.

| Gate | Before (exit) | First after-run (exit) | Final (exit) |
|------|---------------|------------------------|--------------|
| psc-cli-classifier | 0 | 0 | 0 |
| psc-cli-external-orchestration | 0 | 0 | 0 |
| psc-mcp-tooling | 0 | 0 | 0 |
| psc-sk-code | 0 | 0 | 0 |
| psc-sk-design | 0 | 0 | 0 |
| psc-sk-doc | 0 | 0 | 0 |
| psc-system-deep-loop | 0 | 0 | 0 |
| route-guard | 0 | 0 | 0 |
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
| sk-code-setup | 0 | 0 | 0 |
| root-metadata | 0 | 0 | 0 |
| leaf-manifest | 0 | 0 | 0 |
| router-tests | 0 | 0 | 0 |
| accuracy | 0 | 0 | 0 |
| validate | 0 | 0 | 0 |
| contract-drift | 0 | 2 | 0 |
| advisor-routing-suites | 0 | 0 | 0 |
| catalog-packages | n/a (not in the baseline runner) | 1 | 1 here, 0 on main |
| sk-doc-script-tests | n/a (not in the baseline runner) | 0 | 0 |
| cite-drift-gate | n/a (not in the baseline runner) | 0 | 0 |

| Number | Before | After |
|--------|--------|-------|
| Routing accuracy, full / holdout / ambiguity | 155/195, 49/66, 19/24 | 155/195, 49/66, 19/24 |
| compiled-route-guard | 7 of 7 fresh | 7 of 7 fresh |
| Route sync | 55 of 55 | 55 of 55 |
| Hermes skill copies | 67 in sync | 67 in sync |
| Router reach | wrong-hub 0, outranked 0, no-reach 0, allowed 9 | wrong-hub 0, outranked 0, no-reach 0, allowed 9, operator-local 0 |
| router-tests | pass 40, fail 0 | pass 40, fail 0 |
| validate.sh --recursive --strict | `RESULT: PASSED` | `RESULT: PASSED` |

## 2. The two gates that were red on the first after-run

### contract-drift (exit 2, then 0)

The first run reported six `STALE_SOURCE_DIGEST` rows, two for each deep-loop command:

```text
[CONTRACT DRIFT] command=deep/ai-council class=STALE_SOURCE_DIGEST reason=source digest mismatch for .skilled/skills/system-deep-loop/SKILL.md recordedSha256=b76e01aa53c72f8d924b8f181dd8f45fa7a348c990ca319c6120eae4d9fd237e
[CONTRACT DRIFT] command=deep/review class=STALE_SOURCE_DIGEST reason=source digest mismatch for .skilled/skills/system-deep-loop/mode-registry.json recordedSha256=c2989ca1b9e87b9129efcc8819900d450ebdc0a4220720e0f08a45c5673686bb
[CONTRACT DRIFT] command=deep/research class=STALE_SOURCE_DIGEST reason=source digest mismatch for .skilled/skills/system-deep-loop/SKILL.md recordedSha256=b76e01aa53c72f8d924b8f181dd8f45fa7a348c990ca319c6120eae4d9fd237e
```

The cause is this phase's own edit: `system-deep-loop/SKILL.md` gained the one-line link to the parent-skill reference, and the hub's JSON files stepped with it, so the digests recorded in the three compiled command contracts no longer matched. Recompiling the contracts fixed it:

```text
$ node .skilled/skills/system-deep-loop/runtime/scripts/compile-command-contracts.cjs --command deep/ai-council --write
$ node .skilled/skills/system-deep-loop/runtime/scripts/compile-command-contracts.cjs --command deep/review --write
$ node .skilled/skills/system-deep-loop/runtime/scripts/compile-command-contracts.cjs --command deep/research --write
$ node .skilled/skills/system-deep-loop/runtime/scripts/check-contract-drift.cjs
[CONTRACT DRIFT] OK commands=3
$ echo $?
0
```

The three compiled contracts changed by four lines each, the digest rows only.

### catalog-packages (exit 1 here, 0 on main)

The first run failed on one violation:

```text
FAIL: 4 violation(s) (1 fail, 0 warn, 3 note):
  - [fail] [root_leaf_description_mismatch] sk-code/two-axis-registry-driven-routing.md: normalized leaf description does not match root H3 'Two-Axis Registry-Driven Routing'
  - [note] [ignored_path_absent] system-deep-loop/runtime/mk-deep-loop-guard.md:43: prose path is absent and ignored by a repository .gitignore: .skilled/skills/.state/loop-guard/guard-warnings.log
  - [note] [ignored_path_absent] system-spec-kit/session-relaunch-loop.md:103: prose path is absent and ignored by a repository .gitignore: .skilled/skills/.state/session-relaunch/hop-history.log
  - [note] [ignored_path_absent] system-spec-kit/spec-validation-rule-engine.md:29: prose path is absent and ignored by a repository .gitignore: .skilled/hooks/hook-flags.env
```

The fail is not this phase's. The sk-code leaf frontmatter still carried the sentence 005's commit put there ("the hub's `SKILL.md` section 2 names `hub-router.json` as the mode vocabulary"), while the root catalog entry carries the newer one ("the routing authority is named once in the hub's `SKILL.md` section 2", `feature-catalog.md:33`). Main fixed the leaf in `e244718df9`, `fix(sk-code): match the routing leaf description to its catalog entry`, which sets the leaf description to the root's text; the two now normalize equal. This worktree's HEAD `00018303dc` predates that commit:

```text
$ git merge-base --is-ancestor e244718df9 HEAD
$ echo $?
1
```

So the gate stays red in this worktree and turns green on the replay, which carries the commit. The three `[note]` rows name gitignored state paths and are reported, not failed. Re-run here after the review fixes, the same one fail and three notes remain; nothing else fails.

## 3. Routing accuracy

```text
full_corpus_top1  155 / 195
holdout_top1       49 / 66
ambiguity_top1     19 / 24
```

Identical to `before.md` §2, so no route moved. `compiled-route-guard.cjs --json` reports seven hubs, every one `fresh`, `failures: 0`.

## 4. Canon proof

`parent-skill-check` 12b on sk-doc, with the shipped ledger:

```text
$ node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/sk-doc
PASS: 12b-routing-shape: hub and 14 packet(s) follow the routing canon (0 known debt)
...
OK: parent-skill-check — all hard invariants passed, 0 warnings
```

`package_skill.py --check --strict` on each of the 14 packets:

```text
sk-create-agent PASS  sk-create-benchmark PASS  sk-create-changelog PASS  sk-create-command PASS
sk-create-diff PASS   sk-create-feature-catalog PASS  sk-create-frontmatter PASS  sk-create-goal PASS
sk-create-manual-testing-playbook PASS  sk-create-quality-control PASS  sk-create-readme PASS
sk-create-repo-rule PASS  sk-create-skill PASS  sk-create-with-human-voice PASS
```

Six carry a word-count advisory (3,269 to 4,233 words against the 3,000 recommended max); advisories do not fail the check. `routing-shape-known-debt-ratchet.test.cjs` passes 4 of 4, so the ledger entries came off without raising any ceiling.

## 5. Routing shape, before and after

Counted the way `package_skill.py` and `parent-skill-check` count: non-blank lines between the SMART ROUTING heading and the next heading, excluding `---`. The before column is the ledger's recorded count; the after column is the same rule measured on the final file.

| File | SMART ROUTING lines | words | Machine router |
|------|--------------------|-------|---------------|
| `.skilled/skills/sk-doc/SKILL.md` | 58 → 12 | 816 → 176 | in §2 → `## 6. MACHINE ROUTER`, last |
| `sk-create-agent/SKILL.md` | 78 → 5 | 497 → 109 | in §2 → `## 7. MACHINE ROUTER`, last |
| `sk-create-benchmark/SKILL.md` | 66 → 4 | 430 → 92 | in §2 → `## 12. MACHINE ROUTER`, last |
| `sk-create-changelog/SKILL.md` | 78 → 8 | 520 → 125 | in §2 → `## 13. MACHINE ROUTER`, last |
| `sk-create-command/SKILL.md` | 31 → 5 | 297 → 90 | in §2 → `## 7. MACHINE ROUTER`, last |
| `sk-create-diff/SKILL.md` | 64 → 8 | 379 → 133 | in §2 → `## 11. MACHINE ROUTER`, last |
| `sk-create-feature-catalog/SKILL.md` | 89 → 4 | 600 → 104 | in §2 → `## 12. MACHINE ROUTER`, last |
| `sk-create-frontmatter/SKILL.md` | 81 → 8 | 475 → 133 | in §2 → `## 9. MACHINE ROUTER`, last |
| `sk-create-goal/SKILL.md` | 46 → 6 | 370 → 111 | in §2 → `## 9. MACHINE ROUTER`, last |
| `sk-create-manual-testing-playbook/SKILL.md` | 73 → 4 | 384 → 92 | in §2 → `## 11. MACHINE ROUTER`, last |
| `sk-create-quality-control/SKILL.md` | 68 → 5 | 397 → 103 | in §2 → `## 9. MACHINE ROUTER`, last |
| `sk-create-readme/SKILL.md` | 87 → 7 | 585 → 114 | in §2 → `## 10. MACHINE ROUTER`, last |
| `sk-create-repo-rule/SKILL.md` | 90 → 7 | 539 → 104 | in §2 → `## 7. MACHINE ROUTER`, last |
| `sk-create-skill/SKILL.md` | 143 → 6 | 696 → 119 | in §2 → `## 7. MACHINE ROUTER`, last |
| `sk-create-with-human-voice/SKILL.md` | 89 → 7 | 555 → 119 | in §2 → `## 9. MACHINE ROUTER`, last |

Every section is inside the 12-line and 180-word limits, and in every file `MACHINE ROUTER` is the last H2 and the section after SMART ROUTING is the packet's first instruction section. The hub's `## 3. HOW IT WORKS` starts at line 67; the packets' next sections start between lines 55 and 88.

One counter note: the ledger records the hub at 816 words, and a recount of the same file at `00018303dc` by the checker's own rule gives 810. The ledger figure is six words stale; both are over the old 180-word limit, which is what the entry recorded.

## 6. Rationale in one place

`rg -n "must not move into" .skilled/skills --glob 'SKILL.md'` finds nothing. The full statement now lives once, at `sk-create-skill/references/parent-skill/parent-skills-nested-packets.md:136`, under `### Why the leaf router stays in ROUTER.md`, and the four hubs that used to carry a copy link to its anchor:

| Hub | Line |
|-----|------|
| `sk-doc/SKILL.md` | 142 |
| `cli-external-orchestration/SKILL.md` | 77 |
| `system-deep-loop/SKILL.md` | 50 |
| `sk-design/SKILL.md` | 73 |

## 7. Ledger, mirrors and sync

All 15 sk-doc entries are gone from `routing-shape-known-debt.json`: the hub and the 14 packets. The diff removes 135 lines and adds none.

```text
$ route-sync-check
all 55 served copies match their authored files
$ hermes --check
PASS: 67 Hermes skill copies in sync
$ compiled-route-guard --json
7 hubs, 0 failures
```

The four compiled-route manifests (sk-doc and the three linked hubs) were refreshed, and the archived copies under `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/013-live-activation/activation/` were updated with them, which is what `compiled-route-sync` compares.
