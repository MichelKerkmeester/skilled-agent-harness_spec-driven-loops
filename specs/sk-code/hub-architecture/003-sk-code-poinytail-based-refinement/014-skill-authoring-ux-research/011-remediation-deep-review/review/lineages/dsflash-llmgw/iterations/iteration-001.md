# Review Iteration 001 — Pre-commit `gate:skill-authoring` (commit 410df0acce)

## Dispatcher

- Route: `Resolved route: mode=review target_agent=deep-review` (executor: `cli-pi` model=deepseek-v4.1-flash, detached fan-out lineage `dsflash-llmgw`).
- Focus source: `steer.md` §Iteration focus 1 (lead ruling) — pre-commit gate `410df0acce`: cost on a normal commit with no staged skill, fail-open behavior when its tooling is missing or errors, the untrusted-clone wording, and its test file.
- Review target: commits `191aea6baa..03e31f902b` (base `bb3878b570`). Target files read-only; this narrative and the state files are the only writes.

## Dimension

- Primary: correctness (gate trigger completeness, fail-open/fail-closed behavior).
- Secondary: maintainability (consistency with the sibling gates in the same hook).

## Files Reviewed

- `.skilled/scripts/git-hooks/pre-commit:48-54` (untrusted-clone notice), `:281-307` (mirror-parity fix lines), `:309-373` (skill-authoring gate), `:449-463` (route-remint node guard), `:644-736` (spec-remint).
- `.skilled/scripts/git-hooks/lib/gates.tsv:1-14` (skillAuthoring row), `.skilled/scripts/git-hooks/lib/gate-config.sh:1-45`.
- `.skilled/scripts/git-hooks/README.md:107-110` (gate count and bypass list).
- `.skilled/scripts/git-hooks/tests/pre-commit.test.sh:28-30,334-356,718-825` (helpers and cases 50-58).
- `.skilled/commands/doctor/scripts/tests/git-hook-gates.test.cjs:48-52`; `.skilled/skills/sk-git/manual-testing-playbook/doctor-commands/doctor-git-hooks-list.md:28,50,65`.
- Commit diffs: `git show 410df0acce` (all 14 files).
- Evidence probes: `probe/d-filter/` (staged-deletion filter check, run under this lineage).

## Findings

### P0 Findings

None.

### P1 Findings

1. **A staged deletion never selects its skill, so the change class that most often stales derived files is the one class the gate skips** -- `.skilled/scripts/git-hooks/pre-commit:323` -- `git diff --cached --name-only --diff-filter=ACMR -- "$SKILLS_REL/"` filters deletions out of `SKILLS_STAGED`; with only a staged deletion (e.g. `git rm` of a mode's `references/*.md` or `SKILL.md`), `SKILL_NAMES` is empty, none of the three creator checks run, and the commit lands. The commit's own stated goal is "a commit that edits a skill without regenerating them ships the drift for CI to catch" — a deletion is such an edit, and the CI path filter (`.github/workflows/routing-registry-drift.yml:78-115`) covers `**/SKILL.md` and manifest files but not general `references/**`, so a deleted reference file can leave a stale `leaf-manifest.json` on `main` with neither the commit gate nor CI running the freshness check. A fully removed skill root is still handled by the `-f "$SKILL_ROOT/leaf-manifest.json"` guards, so including `D` cannot false-block a whole-skill removal.
Finding class: missing verification / incomplete trigger coverage
Scope proof: finding is inside the reviewed commit 410df0acce's new gate block (pre-commit:309-373); probe and CI claim checked read-only.
Affected surface hints: `.skilled/scripts/git-hooks/pre-commit` (filter), `.skilled/scripts/git-hooks/tests/pre-commit.test.sh` (new deletion case), `.github/workflows/routing-registry-drift.yml` (CI trigger paths).
Case: `git rm .skilled/skills/sk-code/references/comment-grammar.md && git commit` — the gate selects no skill, `ci-leaf-manifest-freshness.cjs` never triggers on that path, and the committed `leaf-manifest.json` still lists the deleted file.
```json
{
  "type": "claim",
  "claim": "With --diff-filter=ACMR, a commit whose only staged change is a deletion under a skill root runs none of the gate's three checks.",
  "evidenceRefs": [
    ".skilled/scripts/git-hooks/pre-commit:323",
    "probe/d-filter (git diff --cached --name-only --diff-filter=ACMR -- skills/ printed nothing; --diff-filter=ACMRD printed skills/demo-hub/SKILL.md)",
    ".github/workflows/routing-registry-drift.yml:78-115"
  ],
  "counterevidenceSought": "Checked whether CI or the pre-push gate covers the deletion shape: routing-registry-drift.yml triggers on **/SKILL.md and manifest paths but not general references/**; pre-push gate:skill-root-metadata only warns and runs ci-skill-root-metadata.cjs, not leaf-manifest freshness.",
  "alternativeExplanation": "The filter may deliberately mirror route-remint's documented deletion exclusion; but route-remint's rationale (re-minting from a working tree that already reflects the deletion) does not apply to --check, which compares against the committed manifest.",
  "finalSeverity": "P1",
  "confidence": "medium-high",
  "downgradeTrigger": "Widen the CI path filter to .skilled/skills/** (or make leaf-manifest freshness blocking at push) so the deletion shape is caught downstream; then downgrade to P2."
}
```

### P2 Findings

1. **`node` unavailable disables the gate with no notice, unlike the sibling gates that warn** -- `.skilled/scripts/git-hooks/pre-commit:315` -- the gate condition ends in `command -v node >/dev/null 2>&1`; when node is missing the gate is skipped silently, while the phrase-lint gate (`:158-159`) and mirror-parity gate (`:184-188`) print "node is unavailable; skipping" warnings. A silent skip in the toolchain repo reads as a pass.
Finding class: observability / fail-open consistency
Scope proof: compare of three gates inside the same hook file.
Affected surface hints: `.skilled/scripts/git-hooks/pre-commit:315`.
Case: toolchain checkout on a machine without node commits a skill edit; no gate runs and no line says why.

2. **A missing creator tool is skipped silently, against the hook's own fail-closed convention for missing tooling** -- `.skilled/scripts/git-hooks/pre-commit:339-341,350,359` -- `-f "$LEAF"`, `-f "$DOCTOR"`, `-f "$SIGNALS"` skip each check when its repo-wide script is absent, so a renamed or deleted `generate-leaf-manifest.cjs` / `parent-skill-check.cjs` / `generate-router-intent-signals.cjs` silently retires enforcement; sibling gates in the same file block when their script is missing inside the toolchain repo (mirror-parity `:281-286`, spec-remint `:727-732`). The per-skill `leaf-manifest.json` existence guard is legitimately optional; the repo-wide tool existence is not.
Finding class: fail-open / broken-install detection
Scope proof: the three tool paths are repo-wide constants, not per-skill artifacts.
Affected surface hints: `.skilled/scripts/git-hooks/pre-commit:339-347,350-358,359-367`; the missing-tool path has no test in `pre-commit.test.sh` cases 50-58.
Case: `git rm .skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs && git add -A` in one commit; a second commit staging a skill edit passes with no leaf check and no message.

## Traceability Checks

| Check | Protocol | Status | Evidence |
|-------|----------|--------|----------|
| Gate registration ↔ doctor count | `spec_code` | pass | `gates.tsv:11` row `skillAuthoring` / `SPECKIT_SKIP_SKILL_AUTHORING` / `yes`; `gate-config.sh:26-45` reads the row and exports the variable; `git-hook-gates.test.cjs:51` expects `GATES=14`; `doctor-git-hooks-list.md` updated 13→14 at lines 28, 50, 65. |
| README ↔ hook behavior | `checklist_evidence` | pass | README:107 counts nine blocking gates and eight bypasses, matching the gate table and the switch list; README:109 documents the untrusted-clone notice and the setting it names. |
| Commit message ↔ implemented scope | `spec_code` | partial | The three "Changes" bullets are implemented; the deletion-shape coverage implied by "for each skill with a staged file" is not (finding I1-P1-001). |
| Test ↔ new behavior | `checklist_evidence` | pass | Cases 50-58 exercise block/pass/bypass/scoping/untrusted/mirror-fix paths; case 53 proves all three creator tools run on a clean hub; case 55 proves unrelated commits do not run them. |

## Integration Evidence

- `.skilled/scripts/git-hooks/pre-commit` is the installed hook surface; `lib/gates.tsv` + `lib/gate-config.sh` are the gate-switch registry read by the hook and by `/doctor:git hooks` (`.skilled/commands/doctor/scripts/git-hook-gates.cjs:151`).
- CI counterpart for the same drift class: `.github/workflows/routing-registry-drift.yml:197-201` runs `ci-skill-root-metadata.cjs`, `ci-leaf-manifest-freshness.cjs`, `ci-skill-derived-freshness.cjs`.
- Untrusted-clone trust mechanism read by the hook: `git config --local --bool skilled.trustRepoHooks` (`pre-commit:43-46`), named in the notice (`pre-commit:53`).

## Edge Cases

- Cost on a normal commit with no staged skill: the gate adds one `git diff --cached` call and one `command -v node` builtin; the loop body runs zero times. No measurable cost added by this commit's diff beyond that (the surrounding mirror-parity gate, eight node spawns, already dominates and is unchanged). Recorded as clean.
- Untrusted-clone notice fires before the shared hook kill-switch is read (`pre-commit:48-70`); with `SYSTEM_GIT_COMMIT_HOOKS_DISABLED=1` the notice still prints. Truthful (checks are skipped) but attributes the skip to trust when a deliberate switch may also be set — noted, not raised as an active finding.
- The notice condition tests for the `system-spec-kit` sentinel under either root, so an untrusted repository without the toolchain stays silent (test case 57).
- `.opencode` script-root checkout: the gate calls `generate-router-intent-signals.cjs` through `$SOURCE_ROOT`, but that script resolves `.skilled/skills` internally (`generate-router-intent-signals.cjs:26-27`). All tooling in this repo (e.g. `sync-agents.cjs:21`, `parent-skill-check.cjs:135`) shares that `.skilled`-rooted convention, so this is a repo-wide layout assumption the new gate inherits rather than introduces; recorded, not raised.

## Confirmed-Clean Surfaces

- The gate's three tool invocations and their block messages/paths (`pre-commit:341-367`): repair commands resolve to real flags (`--write`, `--check --hub`, doctor positional dir) and name the right artifacts.
- Test case construction: fixtures stub all three creators, log calls, and drive block/pass/bypass paths; the bypass (`SPECKIT_SKIP_SKILL_AUTHORING=1`) is honored at `:315`; the pre-existing test env now exports the switch (`tests/pre-commit.test.sh:30`).
- `gates.tsv` row shape matches the 5-column contract; `gate-config.sh` filters on `persistable == yes` and matches the hook name.
- Mirror-parity fix lines (`pre-commit:292-298`) print the exact script for both flag shapes and match the existing block tail; test case 58 asserts the `sync-skills-hermes.cjs` message.

## Ruled Out

- Untrusted-clone wording accuracy: the notice names the exact setting the trust block reads and its condition matches the exact sentinel paths the source-root selection uses — no misdirection found (ruled out as a finding, kept as an edge note above).
- `next-index-*` pathspec interaction, node flag handling, and staged-content semantics from the sibling gates were not changed by this commit.
- `.opencode`-only script-root portability: recorded as a systemic pre-existing convention (see Edge Cases), not an active finding of this commit.

## Next Focus

- Dimension: correctness / traceability
- Focus area: changelog workflows (`7bbb7f0f20`) and create-skill guidance (`dffd7f98e2`) — upstream numbering offline / no remote / no upstream branch; whether every carrier it writes exists; the leaf-manifest stale message and its test.
- Reason: `steer.md` §Iteration focus 2.
- Required evidence: `git show` of both commits; `.skilled/skills/sk-doc/sk-create-changelog/{SKILL.md,changelog/v1.3.4.0.md}`, `.skilled/commands/create/assets/create-changelog-{auto,confirm}.yaml`, `.skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs` (stale message), `generate-leaf-manifest-stale-message.test.cjs`.

## Verdict

Iteration 1 raises 1 P1 and 2 P2 findings; the untrusted-clone wording and the gate's per-commit cost are clean.

Review verdict: CONDITIONAL
