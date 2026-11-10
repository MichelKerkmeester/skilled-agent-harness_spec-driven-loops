# Review Iteration 002 — Changelog upstream numbering + create-skill guidance (7bbb7f0f20, dffd7f98e2)

## Dispatcher

- Route: `Resolved route: mode=review target_agent=deep-review` (executor: `cli-pi` model=deepseek-v4.1-flash, detached fan-out lineage `dsflash-llmgw`).
- Focus source: `steer.md` §Iteration focus 2 (lead ruling) — what upstream numbering does offline / with no remote / with no upstream branch; whether every carrier it writes exists; the leaf-manifest stale message and its test.
- Sources consulted include `steer.md` (unchanged since iteration 1; md5 6378b13f87a1707004b4e2705d9a5da3).

## Dimension

- Primary: correctness (version selection and collision handling in both workflows).
- Secondary: traceability (carrier lists and doc claims against the tools that consume them).

## Files Reviewed

- `.skilled/commands/create/assets/create-changelog-auto.yaml:491-520,655-685` and `create-changelog-confirm.yaml:477-501,587-612` (new upstream block, collision check, carrier step).
- `.skilled/skills/sk-doc/sk-create-changelog/SKILL.md:2-5,250-259` (guidance + version).
- `.skilled/skills/sk-doc/sk-create-skill/SKILL.md:2-5,326-329`; `references/skill/examples-and-maintenance.md:176-185`.
- `.skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs:542-575`; `scripts/regenerate-skill-derived.cjs:232-305`; `scripts/tests/generate-leaf-manifest-stale-message.test.cjs:1-76`.
- `.skilled/commands/doctor/scripts/parent-skill-check.cjs:1757-1889` (13a-13d), run read-only against `.skilled/skills/sk-doc` (exit 0, 20 warnings).
- Advisor consumers for the guidance claim: `system-skill-advisor/runtime/lib/utils/skill-markdown.ts:20-54`, `derived/extract.ts:67-244`; runtime-wide search for `description.json` (zero non-test references).
- Commit diffs `git show 7bbb7f0f20`, `git show dffd7f98e2`; Hermes mirror parity diff for both SKILL.md copies (only generated header + rewritten links differ).

## Findings

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **Confirm mode gained the upstream collision check without the remedy auto mode has, so an upstream-only version collision has no defined resolution** -- `.skilled/commands/create/assets/create-changelog-confirm.yaml:501` -- the step now says "Verify no collision with existing files, locally or in the upstream listing", but unlike auto (`create-changelog-auto.yaml:514-518`: "IF file v{next_version}.md already exists locally or in the upstream listing: Increment BUILD segment until unique") the confirm workflow defines no action on collision; its only other guard is the global NEVER rule at `:824` ("Never use a version number that already exists") and the human checkpoint. Case: the local highest is `v1.3.4.0`, the branch's upstream already carries `v1.3.5.0`; auto numbers `v1.3.6.0` after the increment rule, while confirm presents `v1.3.5.0` at the checkpoint with nothing telling the executor how to make it unique.
Finding class: incomplete mirrored behavior
Scope proof: same commit 7bbb7f0f20 changed both files; only the auto copy received the increment instruction.
Affected surface hints: `.skilled/commands/create/assets/create-changelog-confirm.yaml`; `create-changelog-auto.yaml` carries the intended wording.
Case: interactive `/create:changelog --confirm` run where the upstream listing contains the calculated `next_version`.

## Traceability Checks

| Check | Protocol | Status | Evidence |
|-------|----------|--------|----------|
| Upstream numbering offline / no remote / no upstream branch | `spec_code` | pass | `git rev-parse --abbrev-ref @{u}` failure is handled with the `origin/main` fallback, and `git rev-parse --verify --quiet "$UPSTREAM"` failure is explicitly handled with "skip ... local-only numbering" (auto:498-505, confirm:484-491). `rev-parse` and `ls-tree` read local object stores only; no network command is issued, so a clone with local remote-tracking refs numbers correctly offline. |
| Carrier list ↔ doctor 13a | `checklist_evidence` | pass | Workflow's carriers (SKILL.md, ROUTER.md, description.json, hub-router.json, mode-registry.json) equal the doctor's follower set (`parent-skill-check.cjs:1867-1872`); all five exist on sk-doc (versions 2.3.0.0). Doctor run on sk-doc: `PASS 13a-version ... 2.3.0.0`, exit 0. README parity (13c) is advisory (`WARN` in the same run), matching the workflow's "README.md is not a version carrier". |
| Guidance claims ↔ advisor code | `spec_code` | pass | `skill-markdown.ts:28-54` parses SKILL.md `keywords`; `derived/extract.ts:171` consumes them; no non-test file under `runtime/` references `description.json`, supporting "no scorer reads description.json". Full lane-level confirmation is scheduled for iteration 3 (advisor focus). |
| New changelog entries and mirrors exist | `checklist_evidence` | pass | `sk-create-changelog/changelog/v1.3.4.0.md` and `sk-create-skill/changelog/v1.5.2.0.md` exist with frontmatter; `.hermes` copies differ only by the generated header/link rewriting. |
| Stale-message test ↔ generator | `checklist_evidence` | pass | Test plants a manifest, removes one leaf and adds another, asserts `added:`/`removed:` keys and the full `Fix: node ... --write <dir>` line; against the pre-change generator both assertions fail (no drift list, no Fix line). |

## Integration Evidence

- `parent-skill-check.cjs` run for the carrier step is the same script the pre-commit `gate:skill-authoring` runs (`pre-commit:350-357`), so a version bump that misses a carrier stops the workflow and would also block a commit.
- Compiled-route freshness for the bumped `SKILL.md` is covered by the pre-commit `gate:route-remint` auto re-mint (`pre-commit:449-463,519-531`); the Hermes copy by `sync-skills-hermes.cjs --check` in the mirror-parity gate (`pre-commit:273`).
- Upstream path resolution against real layout: `.skilled/changelog/sk-code/parent -> ../../skills/sk-code/changelog` and packet links resolve to real dirs; `pwd -P` resolution matches what `git ls-tree` sees on the upstream tree.

## Edge Cases

- Component directory missing at version time cannot reach the upstream block: step 2 stops with "Changelog folder not found" when `ls .skilled/changelog/{resolved_folder}/` fails (auto:472-477), so the empty-`CHANGELOG_DIR` failure mode observed in the probe (`git ls-tree ... -- "/"` exits 128) is unreachable through the documented flow.
- `.skilled/changelog/cli-jev/parent` and `cli-jev/cli-usage` are dangling symlinks; step 2 would stop for that component. Pre-existing layout state, not touched by this range; recorded, not raised.
- README versions lag on several hubs (e.g. sk-doc README 2.2.0.77 vs SKILL.md 2.3.0.0); the doctor reports WARN and exits 0, so the workflow's doctor step does not stop on it.
- `regenerate-skill-derived.cjs` lost its executable bit in dffd7f98e2 but keeps its shebang; every caller invokes it through `node` (require or `node <path>`), and sibling scripts ship both modes, so no execution path breaks.
- The drift list labels entries `workflowMode:leaf`; a manifest without `workflowMode` still diffs correctly because both sides parse identically, only the label degrades.

## Confirmed-Clean Surfaces

- Version selection: local `find` scope (top level + generation folders only) and the upstream regex both observed to select the same maximum across every real target in `.skilled/changelog/` (scan over all plain links, hub `parent` links and packet links; zero divergences).
- The highest-of-both-lists rule and the BUILD-increment collision check make the two-branch collision scenario converge (auto path).
- `regenerate-skill-derived.cjs` JSDoc now matches `run()`'s returns and the CLI entry's exit codes (`run()` returns 0 unless a root errored; main exits 2 for `INPUT_VALIDATION`).
- No consumer of the old "Re-run with --write to regenerate." string remains anywhere under `.skilled` or `.github`.

## Ruled Out

- Upstream regex depth asymmetry (regex matches `v*.md` at any depth while the local `find` caps at generation depth): scanned every real changelog target; maxima identical, so no reachable divergence in this tree.
- `description.json` still being scored somewhere: zero non-test references in the advisor runtime.
- Missing-directory failure of the upstream block: guarded by step 2's stop.
- cli-jev dangling links and the exec-bit change: outside this range's changes / no functional effect.

## Next Focus

- Dimension: correctness / traceability
- Focus area: advisor changes (`479186cfed`, `eeb6285a8e`) — explicit-lane path-token and doc-target rules for false negatives, the Python mirror's coverage, `surfaceHint` validation (schema, bad values, length), the `engines` field against the code's real Node needs, and both vitest files.
- Reason: `steer.md` §Iteration focus 3.
- Required evidence: `git show` of both commits; `runtime/lib/scorer/lanes/explicit.ts`, `runtime/handlers/advisor-recommend.ts`, `runtime/tools/advisor-recommend.ts`, `runtime/schemas/advisor-tool-schemas.ts`, `runtime/scripts/skill_advisor.py`, `runtime/package.json`, `runtime/tests/name-mention-scoring.vitest.ts`, `runtime/tests/advisor-surface-hint.vitest.ts`, `runtime/tests/parity/fixtures/local-native-approved-divergences.json`.

## Verdict

Iteration 2 raises 1 P2 finding; the upstream numbering handles offline/no-remote/no-upstream as documented, every carrier exists and is verified by the doctor, and the stale message and test are sound.

Review verdict: CONDITIONAL
