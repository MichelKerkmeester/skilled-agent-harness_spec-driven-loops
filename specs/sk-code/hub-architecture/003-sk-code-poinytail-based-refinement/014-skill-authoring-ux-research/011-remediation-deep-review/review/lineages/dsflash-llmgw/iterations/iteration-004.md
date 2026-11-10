# Review Iteration 004 — Freshness panel + validator false positives (827e44abc8, 03e31f902b)

## Dispatcher

- Route: `Resolved route: mode=review target_agent=deep-review` (executor: `cli-pi` model=deepseek-v4.1-flash, detached fan-out lineage `dsflash-llmgw`).
- Focus source: `steer.md` §Iteration focus 4 (lead ruling) — the CI workflow steps (paths, working directory, exit codes), the freshness panel's failure path, and whether each validator exemption could hide a real failure.
- Sources consulted include `steer.md` (unchanged since iteration 1; md5 6378b13f87a1707004b4e2705d9a5da3).

## Dimension

- Primary: traceability (CI gates and their exit contracts).
- Secondary: correctness (exemption reach in the two validators).

## Files Reviewed

- `.github/workflows/routing-registry-drift.yml:31-38,77-84,210-224` (new trigger paths and the two new steps) and the surrounding lean job `:150-224`.
- `.skilled/commands/doctor/scripts/skill-graph-freshness.cjs:1-20,168-190,218-290` (strict mode, exit contract, failure set).
- `.skilled/skills/system-skill-advisor/runtime/tests/doctor/skill-graph-freshness-panel.vitest.ts:277-320` (new strict cases).
- `.skilled/skills/sk-doc/sk-create-feature-catalog/scripts/validate_catalog_package.py:432-460,487,563` (`_present_or_ignored`).
- `.skilled/skills/sk-doc/sk-create-skill/scripts/package_skill.py:86-96,368-410,481-495,516-530,818-841` (extension and exemption changes).
- Tests: `sk-doc/scripts/tests/test_validate_catalog_package.py:175-230`, `test_create_skill_contract.py:607-674`.
- Probe (inside this lineage's `probe/`): `git check-ignore` behavior with a global `core.excludesFile`.

## Findings

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **The missing-path exemption consults the machine's whole git exclude stack, so the catalog validator's result is not reproducible across machines** -- `.skilled/skills/sk-doc/sk-create-feature-catalog/scripts/validate_catalog_package.py:435-455` -- `_present_or_ignored` runs `git check-ignore -q -- relative`, which honors `.gitignore`, `.git/info/exclude` **and** the user's `core.excludesFile`. Probe: with a global excludes file matching `secret.env`, `git check-ignore -q -- secret.env` exits 0; with `-c core.excludesFile=/dev/null` it exits 1. So a cited path that is genuinely missing can be tolerated on a developer machine and reported on CI (or the reverse for `.git/info/exclude` entries), and the docstring's "keeps behavior outside a git checkout unchanged" does not bound the in-checkout case.
Finding class: nondeterministic exemption
Scope proof: both call sites of `_present_or_ignored` (`check_prose_paths`, `check_source_file_paths`) inherit the behavior; the probe reproduces the divergence with only local config differing.
Affected surface hints: `validate_catalog_package.py` `_present_or_ignored`; the two tests use only a repo-local `.gitignore`.
Case: a leaf cites `config/local-secrets.env` (never committed, covered only by the developer's global `*.env` ignore) — local validation passes, CI validation reports `missing_prose_path`.

2. **`--strict` gates stale/ghost/missing compiled entries but not a compiled-vs-disk family mismatch, so the CI step named "compiled json matches graph-metadata" passes with the compiled family stale** -- `.skilled/commands/doctor/scripts/skill-graph-freshness.cjs:252-262` -- `report('FAMILY MISMATCH compiled vs disk', familyMismatches(disk, compiled.map, 'compiled'))` prints the mismatch but never sets `strictProblem`; the same holds for `NULL derived timestamp`. A hand edit to a skill's `family` in `graph-metadata.json` does not change its `derived` block, so `ci-skill-derived-freshness.cjs` stays green, the derived stamp does not move, `staleCompiledProblem` stays false, and the new CI step exits 0 while the compiled graph serves the old family. The commit's own strict scope is stated in the header ("a stale or unknown compiled graph, a ghost or missing node, or a compiled json that could not be read"), so this is a scope boundary rather than an accident — but the step name overstates what CI now enforces, and the family check is a compiled-json-vs-disk check, not a SQLite one.
Finding class: ungated drift class
Scope proof: the panel's own report distinguishes FAMILY MISMATCH from the SQLite-only findings; the new vitest cases cover stale/fresh/SQLite-only but not family mismatch.
Affected surface hints: `skill-graph-freshness.cjs` strict set; `.github/workflows/routing-registry-drift.yml:217-223`.
Case: edit `.skilled/skills/sk-code/graph-metadata.json` `family` without touching `derived`; CI runs `skill-graph-freshness.cjs --strict`, prints the mismatch, exits 0.

## Traceability Checks

| Check | Protocol | Status | Evidence |
|-------|----------|--------|----------|
| CI step working directory / tool availability | `checklist_evidence` | pass | Both new steps run in the lean job (repo root, after `actions/checkout`), use `set -euo pipefail`, and only node/python3 which earlier steps in the same job already use. |
| CI step exit codes | `spec_code` | pass | `generate-router-intent-signals.cjs --check` exits 1 on a missing carry (`RESULT: FAILED`); `skill-graph-freshness.cjs --strict` exits 1 on the gated set, 0 otherwise, 2 on unknown args; both fail the job via `set -e`. |
| CI trigger paths | `spec_code` | pass | New trigger paths added for `skill-graph-freshness.cjs`; all inputs of both steps (`skills/*/graph-metadata.json`, `skills/*/ROUTER.md`, `system-skill-advisor/runtime/**`, `sk-create-skill/scripts/**`) were already covered. |
| Freshness strict failure path | `checklist_evidence` | pass | Vitest: stale fixture → exit 1 and names the compiler; fresh fixture without SQLite → exit 0; SQLite-only drift → exit 0 (never gates in CI). Panel error and unreadable compiled json set `strictProblem`. |
| Validator exemptions keep blocking real misses | `checklist_evidence` | partial | Gitignored/dangling cases are negative-adjacent-tested and a non-ignored missing sibling is still reported; the global-excludes scope is untested (I4-P2-001); `.ts`/`.txt` accepted with an unknown `.rst` still warned; hub recommended-sections suppressed while a standalone still warns. |
| Fixture-path exemption scope | `checklist_evidence` | pass | `_is_exempt_package_path` only skips `validate_generated_paths` warnings (promoted under strict); the new `endswith(('fixture','fixtures'))` matches `runtime-fixture` as intended and is covered by a test. |

## Integration Evidence

- Both new CI steps sit in the existing lean job that already ran `parent-skill-check`, `ci-skill-root-metadata`, `ci-leaf-manifest-freshness`, `ci-skill-derived-freshness` and `skill_graph_compiler.py --validate-only`, so they extend an existing gate chain rather than adding a new job.
- `skill-graph-freshness.cjs` remains report-only by default (exit 0) for `/doctor` use; `--strict` is opt-in and the contract is documented in the file header.
- The regenerated `runtime/scripts/skill-graph.json` (generated_at 2026-10-10T21:18:08) carries the cli-classifier signals added to `graph-metadata.json`, and `generate-router-intent-signals --check` reports zero missing for all seven hubs.
- The two validator changes run inside `validate_skill_package.py`/catalog validation, which the pre-commit and CI chains invoke; their test suites are the existing stdlib `python3` tests.

## Edge Cases

- `generate-router-intent-signals.cjs --check` resolves `.skilled/skills` internally; in CI it runs through the `.opencode` symlink, and Node resolves the real path, so the hardcoded root still resolves (same repo-wide convention noted in iteration 1).
- `check_source_file_paths` now rejects a leaf-relative path that escapes the repository even when it exists outside (`os.path.relpath` starts with `..` → treated as missing); this aligns with the prose-path escape rule and is not a regression for in-repo citations.
- `skill-graph-freshness.cjs` treats an unreadable disk metadata as GHOST when the compiled graph still lists that skill, so strict mode catches that shape; a skill absent from both sources is unreportable by construction.
- `VALID_SCRIPT_DATA_EXTENSIONS = ['.txt']` matches the only two data files shipped under a skill `scripts/` dir (`.skilled/skills/sk-git/scripts/worktree-provision-paths.txt`, `remote-branch-allowlist.txt`); no `.tsv` lives under a skill `scripts/` root today, so the accepted set matches reality.
- The `.ts` script exemption covers tsx-run sources; the sk-doc scripts tree already carries `.ts`/`.cjs` mixed tooling, so the warning list now matches what the repo ships.

## Ruled Out

- `VALID_SCRIPT_EXTENSIONS`/`VALID_SCRIPT_DATA_EXTENSIONS` hiding a real failure: the change only removes warnings for file types the repo genuinely ships; an unknown type still warns (test).
- Hub recommended-section suppression hiding a defect: recommended sections are advisory by definition (`RECOMMENDED_SECTIONS`), the required contract still runs, and a standalone control still warns.
- `endswith(('fixture','fixtures'))` exemption abuse: the test asserts `runtime-fixture` is exempt; the exemption applies only to the generated-path warning class, and a package root would have to name its directory `*fixture` to hide a name check.
- Freshness staleness comparison precision (derived stamps vs compiled stamp): same-day edits are visible because derived stamps carry a full ISO timestamp; the family case is reported separately as I4-P2-002.

## Next Focus

- Dimension: maintainability / traceability
- Focus area: cross-cutting pass (`steer.md` §Iteration focus 5) — does each new test fail without its fix; version and changelog hygiene for every bumped skill; comment hygiene (no spec paths, phase numbers or finding ids in code comments); each change against `.skilled/repo-rules/prevent-overengineering.md`; each phase's `spec.md`, `goal.md` and `implementation-summary.md` under `014-skill-authoring-ux-research/00[2-9]-*` and `010-*` against its commit; plus the remaining commits `191aea6baa`, `d3b9e272d8`, `8011f1b408`.
- Reason: `steer.md` §Iteration focus 5.
- Required evidence: `git show` of every commit in the range not yet reviewed; the manifest's phase docs; comment scans over the changed files; `prevent-overengineering.md`; version carriers of each bumped skill.

## Verdict

Iteration 4 raises 2 P2 findings; the new CI steps are correctly placed with sound exit contracts, and the freshness panel's strict failure path is covered by tests. The ungated family mismatch and the machine-dependent ignore exemption are the open items.

Review verdict: CONDITIONAL
