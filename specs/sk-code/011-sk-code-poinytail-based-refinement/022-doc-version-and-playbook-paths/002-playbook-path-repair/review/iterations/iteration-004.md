# Iteration 004 -- Security (validator symlink containment, release-state skip, destructive-token sweep)

Run 1, iteration 4 of 5. Dimension: security. Target: commits `41302e72be..HEAD` on `worktrees/118-playbook-paths` -- the validator change (`pathPresent`/symlink rule, `INSTALLED_RELEASE_STATE_RE`, tests) and the backticked path corrections across 223 manual-testing-playbook files. The iteration asks: (1) can the symlink rule or the release-state rule be abused to make a broken or out-of-repo path pass silently; (2) do rewritten scenario commands now point at a destructive location or outside the sandbox the scenario intends; (3) was any secret, token or personal path introduced.

## Dimension

Security: path containment, destructive side effects, unsafe secrets handling, injection exposure (review-core.md section 6 security minimums). Core protocols: `spec_code`, `checklist_evidence`. Overlay: `playbook_capability`; `skill_agent` (swept in iteration 1), `agent_cross_runtime` and `feature_catalog_code` (covered in iteration 3) are not re-entered.

## Files Reviewed

- `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs:339-369` (pathChecks: realpath containment at `:357`-`:358`), `:371-397` (backtick rules and `pathPresent` at `:394`), `:399-422` (backtickPathChecks; `pathPresent` call at `:416`), `:424-437` (evergreenChecks), `:381`
- `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/tests/validate-playbook-package.test.cjs:157` (release-state test), `:159-163` (dangling-symlink test), `:286-297` (piped-report regression)
- Added-line sweep (`git diff 41302e72be..HEAD`, `+` lines only) over the full 223-file playbook diff: destructive-verb, secret-pattern, developer-absolute-path and skip-token greps
- Spot-checked rewritten commands: `.skilled/skills/cli-external-orchestration/cli-cursor/manual-testing-playbook/hooks/task-dispatch-guard-live-fire.md:48`; `.skilled/skills/cli-external-orchestration/cli-claude-code/manual-testing-playbook/git-preflight-advisory/git-preflight-advisory.md:89`; `.skilled/skills/sk-git/manual-testing-playbook/git-preflight-advisory/advisory-fires-on-silent-scope-drop.md:49`; `.skilled/skills/cli-external-orchestration/cli-devin/manual-testing-playbook/commands-and-skills/unquoted-colon-frontmatter-regression.md:63`; `.skilled/skills/system-spec-kit/manual-testing-playbook/doctor-commands/doctor-update-compat.md:49`; `.skilled/skills/system-spec-kit/manual-testing-playbook/tooling-and-scripts/template-phrase-lint-blocked-commit.md:53`; `.skilled/skills/cli-external-orchestration/cli-codex/manual-testing-playbook/agent-routing/context-profile.md:48`
- Symlink census via `git ls-files -s` (468 tracked symlinks) and `.skilled/release/.gitignore:1`

## Findings by Severity

### P0

None.

### P1

None new. R1-P1-001 (carried, active) remains the only P1: at HEAD the fleet validator prints exactly one `BACKTICK_PATH_UNRESOLVED` (`.cursor/worktrees.json` at `worktree-dry-run-inspection.md:14`) while `implementation-summary.md` holds no Remaining rows, so REQ-001's "0 or exactly the Remaining rows" clause stays unmet. Not re-raised here; this iteration adds no new P1.

### P2

#### R4-P2-001 -- The backtick symlink rule accepts a target outside the repository, where the link check rejects the same target

`pathPresent` returns true when the candidate is a symlink, regardless of what the link points at: `fs.existsSync` accepts a live link whose target may sit anywhere, and the `lstatSync(...).isSymbolicLink()` branch accepts a missing target ([SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs:394]). It is the only presence test for backticked paths (`:416`), and it has no containment check, while the markdown-link check in the same script resolves the candidate and rejects both cases -- `PATH_SYMLINK_OUTSIDE_RE` for a link escaping the repository and `PATH_MISSING` for a broken one ([SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs:357]). The added test pins only the dangling, in-repo acceptance that the rule was introduced for ([SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/tests/validate-playbook-package.test.cjs:159]); no out-of-repo case is pinned.

- claim: a backticked path whose symlink target resolves outside the repository -- or is missing -- satisfies the backtick presence check and suppresses `BACKTICK_PATH_UNRESOLVED`, even though the same physical target behind a markdown link is rejected by pathChecks; the warning stream REQ-001 measures can therefore be made to stay silent about an out-of-sandbox or broken citation.
- evidenceRefs: `validate-playbook-package.cjs:394-397`, `:416`, `:357-358`; `validate-playbook-package.test.cjs:159-163`.
- counterevidenceSought: read every `pathPresent` caller (only `:416`); checked the test set for an out-of-repo case (none); ran a census of tracked symlinks -- 468 exist, 4 resolve outside the worktree, all under `specs/**` review-scratch fixtures and none introduced by this diff, so the accepted class is real but the corpus is currently clean.
- alternativeExplanation: accepting the unbuilt-build-output link (`.opencode/plugins/sk-vision.js` -> `../skills/sk-vision/vision-runtime/dist/plugin.js`, whose target is absent in a fresh checkout) is the rule's stated purpose, so target existence cannot be required; but the purpose does not require accepting targets outside the repository.
- finalSeverity: P2 -- the check is report-only (`BACKTICK_PATH_UNRESOLVED` is a warning, not a violation), so this is a diagnostic-containment gap, not an exploitable bypass; it only matters to a repair program that treats zero warnings as its completion signal.
- confidence: 0.85. - downgradeTrigger: `pathPresent` gains containment (lexical in-repo containment for dangling targets, realpath containment for live ones), or the rule is restricted to tracked in-repo symlinks.
- Recommendation: mirror pathChecks in `pathPresent` -- resolve the declared target lexically against the link's directory and require repository containment for missing targets; require realpath containment when the target exists; add the out-of-repo case beside the dangling case in the test.

The release-state rule carries no new security angle beyond the already-open R1-P2-001: `INSTALLED_RELEASE_STATE_RE` is anchored to the `.skilled/release/` prefix, so the miss it can hide is confined to that namespace (traversal text inside the prefix is skipped identically, but nothing leaves the namespace); the source tree holds only a `.gitignore` there ([SOURCE: .skilled/release/.gitignore:1]).

## Answers to the Iteration Questions

1. **Symlink / release-state abuse.** Symlink rule: yes, within the report-only backtick check -- see R4-P2-001. Release-state rule: the skip is prefix-anchored and abusable only inside `.skilled/release/`; that namespace-blanking surface is already open as R1-P2-001 (correctness) and needs no new security finding.
2. **Destructive or outside-sandbox rewrites.** No. Added lines contain exactly two `rm` invocations -- `rm -rf /tmp/cli-cursor-cu021-workspace` and `rm -f /tmp/cli-cursor-cu021-probe.log` -- both literal `/tmp` paths the scenario creates for itself, and both byte-identical to the `41302e72be` pre-state of the same row ([SOURCE: .skilled/skills/cli-external-orchestration/cli-cursor/manual-testing-playbook/hooks/task-dispatch-guard-live-fire.md:48]); the only edit in that row is the RCAF reference path. Every introduced `$`-token is defined in-scenario before use: `repo=$(mktemp -d ...)` in both git-preflight files ([SOURCE: .skilled/skills/cli-external-orchestration/cli-claude-code/manual-testing-playbook/git-preflight-advisory/git-preflight-advisory.md:89]), `FIXTURE="$(mktemp -d)"` and `FIXTURE="$(mktemp -d)/repo"` ([SOURCE: .skilled/skills/system-spec-kit/manual-testing-playbook/doctor-commands/doctor-update-compat.md:49], [SOURCE: .skilled/skills/system-spec-kit/manual-testing-playbook/tooling-and-scripts/template-phrase-lint-blocked-commit.md:53]), `DV016_DIR=$(mktemp -d ...)` ([SOURCE: .skilled/skills/cli-external-orchestration/cli-devin/manual-testing-playbook/commands-and-skills/unquoted-colon-frontmatter-regression.md:63]), and `CODEX_HOME` pointing at a disposable `/tmp` profile ([SOURCE: .skilled/skills/cli-external-orchestration/cli-codex/manual-testing-playbook/agent-routing/context-profile.md:48]). Redirects in added lines target literal `/tmp/*` capture files. No unset-variable expansion path reaches a destructive command.
3. **Secrets, tokens, personal paths.** None introduced. Secret-pattern grep over added lines matches only prose false positives ("token swap audit", `SPECKIT_*` env-name enumeration) plus the jev credential-store line, which itself records that no stream carried a key value. Zero added lines contain `/Users/`, `/home/<user>` or `C:\Users`, and `evergreenChecks` keeps failing that class as `DEVELOPER_ABSOLUTE_PATH` ([SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs:428]).

## Traceability Checks

- **spec_code (partial)**: the PP-V validator rule traces to its exercised test rows; spec-side ledger mapping was verified in iteration 3 (SL-016) and is not re-entered here.
- **checklist_evidence (n/a)**: no acceptance-criteria row is scoped to the security dimension this iteration.
- **playbook_capability (pass)**: added-line sweep over the 223-file diff across destructive, secret and personal-path classes; all skip-token variables carry in-scenario definitions.
- **skill_agent / agent_cross_runtime / feature_catalog_code**: not re-entered (swept in iterations 1 and 3).

## Proof Runs

- `git diff 41302e72be..HEAD | grep -E '^\+[^+]'` piped through destructive-verb, secret-pattern and developer-path filters: exactly two `rm` invocations, zero secret matches, zero personal-path matches.
- `git show 41302e72be:<task-dispatch-guard-live-fire.md> | grep -nE 'rm -rf|rm -f'` vs HEAD: identical `rm` lines; only the RCAF pointer changed.
- `git ls-files -s` symlink census (468 links; 4 escaping targets, all under `specs/**` scratch) plus symlink target existence check for `.opencode/plugins/sk-vision.js` (dangling, in-repo target).
- Token-definition greps across the five spot-checked files: every `$repo`, `$FIXTURE`, `$DV016_DIR`, `$CODEX_HOME` occurrence has a define-before-use site.

## Next Dimension

Maintainability (iteration 5 of 5).

## Verdict

No new P0 or P1 findings this iteration; one new P2 (R4-P2-001). The carried active P1 R1-P1-001 keeps the run at CONDITIONAL under the mapping rule.

Review verdict: CONDITIONAL
