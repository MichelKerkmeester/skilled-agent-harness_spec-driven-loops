# After: routing gates rerun after the fixes

Recorded 2026-10-28 on `worktrees/254-skill-routing-and-clarity`, after every fix, the changelog entries, the compiled-route re-mint, the Hermes sync and the skill-graph export. Same commands as `baseline.md`, plus the leaf-contract unit test, which covers the one script change.

## 1. Gates, before and after

| Gate | Before (exit, result) | After (exit, result) | Delta |
|------|-----------------------|----------------------|-------|
| parent-skill-check, 7 hubs | 0 x 7, all hard invariants passed, 0 warnings | 0 x 7, all hard invariants passed, 0 warnings | none |
| verify-router-sync | 0, 5/5 | 0, 5/5 | none |
| compiled-route-guard `--json` | 0, 7 fresh, failures 0 | 0, 7 fresh, failures 0 | none, after re-minting 5 hubs |
| package_skill `--strict`, 14 roots | 0 x 14, PASS | 0 x 14, PASS | none |
| check-rule-copies | 0, OK | 0, OK | none |
| router reach | 0, wrong-hub 0, outranked 0, no-reach 0, allowed 3, probe-error 0 | 0, same counts, `RESULT: PASSED` | none |
| Hermes `--check` | 0, 67 in sync | 0, 67 in sync | none, after a sync that rewrote 7 copies |
| sk-code setup battery | 0, `STATUS=OK legs=9` | 0, `STATUS=OK legs=9` | none |
| skill-root metadata | 0, 14/14 | 0, 14/14 | none |
| leaf-manifest freshness | 0, 14/14 fresh | 0, 14/14 fresh | none |
| router-sync and router-replay tests (8 files) | 0, 40/40 | 0, 40/40 | none |
| capture-scorer-eval-baseline.mjs | full corpus 155/195, holdout 49/66, ambiguity 19/24 | full corpus 155/195, holdout 49/66, ambiguity 19/24 | none |
| leaf-resource-contract unit test | not in baseline | 0, passed | new test, fails on the old contract |
| validate.sh `--recursive --strict` | 0, PASSED x 12 | PASSED x 12 after `repair-derived.cjs` refreshed the generated metadata of the edited folders | none |

No gate got worse.

## 2. Intermediate failures, and what fixed them

- `ci-leaf-manifest-freshness.cjs` failed with `UNSUPPORTED_LEAF_ROOT: unsupported standalone leaf root: hooks` once `hooks` was added to system-skill-advisor's `leaf-manifest.config.json`. The leaf contract admitted no `hooks/` root. Widening the contract (`leaf-resource-contract.cjs`, `generate-leaf-manifest.cjs`) and regenerating the manifest and aliases with `ci-skill-root-metadata.cjs --fix --skill system-skill-advisor` cleared it.
- The new unit test was run against a copy of the pre-change `sk-doc` tree and exited 1 on `assert.ok(contract.LEAF_ROOTS.includes('hooks/'))`. On the changed tree it passes.
- `compiled-route-guard.cjs` reported 5 hubs stale (`cli-classifier`, `cli-external-orchestration`, `mcp-tooling`, `sk-code`, `sk-doc`) after the carrier bumps. `compiled-route-manifest.cjs refresh` on each, then copying each runtime manifest over its authored copy under `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/013-live-activation/activation/`, returned all 7 hubs fresh.
- `validate.sh` failed `GENERATED_METADATA_INTEGRITY` and `GENERATED_METADATA_DRIFT` on the folders whose docs changed (the parent, 003, 010). `repair-derived.cjs --apply` regenerated their `description.json` and `graph-metadata.json`.

## 3. Routing replay of the changed stages

- sk-code §2 versus §9: the intent names in the §2 table equal the `INTENT_SIGNALS` keys in §9 (12 each, script comparison prints `EQUAL True`).
- mcp-tooling: `health` and `health-md` now sit in both the stage-one `obsidian-aliases` class and the stage-two `OBSIDIAN` intent. Router reach skips single words by design, so the reach check does not probe them. A direct replay covers both stages instead: `node .skilled/bin/compiled-route.cjs --hub mcp-tooling --prompt "render my health-md charts"` selects `mcp-obsidian` (stage one), and `router-replay-lib.cjs` `parseRouter` on the hub `ROUTER.md` scores only `OBSIDIAN` for the same prompt and maps it to the two mcp-obsidian leaves (stage two).
- system-skill-advisor: `parseRouter` on its `SKILL.md` scores `HOOK` for "how does the skill advisor hook work" and maps it to `hooks/skill-advisor-hook.md`, which `leaf-manifest.json` now lists.
