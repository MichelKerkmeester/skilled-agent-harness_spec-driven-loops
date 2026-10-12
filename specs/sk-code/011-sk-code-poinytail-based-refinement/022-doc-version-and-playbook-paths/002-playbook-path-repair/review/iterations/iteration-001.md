# Iteration 001 -- Correctness

Run 1, iteration 1 of 5. Dimension: correctness. Target: the playbook path repair commits `41302e72be..HEAD` on `worktrees/118-playbook-paths` -- validator commit 82c90e85b7 (symlink and `.skilled/release/` rules plus tests) and the three backticked path reparations (f30918f94b, 3be9030128, cd34e1fbbe) across 223 manual-testing-playbook files.

## Dimension

Correctness of the two new skip rules, the backtick resolution change, the three new/extended tests, and the corpus outcome of the repairs.

## Files Reviewed

- `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs` (lines 339-422 path scanners; 832 exit-code rule; 893-896 stdout/exitCode write path)
- `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/tests/validate-playbook-package.test.cjs` (line 157 release-state case, 159-163 symlink case, 292 piped-report regression)
- `.skilled/skills/cli-external-orchestration/cli-cursor/manual-testing-playbook/worktree-isolation/worktree-dry-run-inspection.md` (line 14, residual warning)
- `goal.md`, `implementation-summary.md`, `acceptance-criteria.md` of the packet
- Diffstat of all 234 changed files plus targeted doc-diff samples (doctor-commands)

## Findings by Severity

### P0

None.

### P1

#### R1-P1-001 -- Residual `BACKTICK_PATH_UNRESOLVED` warning with no Remaining row leaves REQ-001 unmet at HEAD

The repairs still leave exactly 1 `BACKTICK_PATH_UNRESOLVED` warning: `.cursor/worktrees.json`, cited at [SOURCE: .skilled/skills/cli-external-orchestration/cli-cursor/manual-testing-playbook/worktree-isolation/worktree-dry-run-inspection.md:14]. The validator exits 0 but prints the warning; the packet's own closure command counts `n=1` warnings against `r=0` Remaining rows because `implementation-summary.md` is still scaffold text ("Not delivered yet", [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/022-doc-version-and-playbook-paths/002-playbook-path-repair/implementation-summary.md:62]). REQ-001 allows remaining warnings only when each has a Remaining row ([SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/022-doc-version-and-playbook-paths/002-playbook-path-repair/spec.md:101], SC-001, AC-001), and the goal's count command ([SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/022-doc-version-and-playbook-paths/002-playbook-path-repair/goal.md:58]) compares the two counts directly, so it cannot print `ok` at this tree.

- claim: The repair commits leave one unresolved backticked path with no documented reason, so the phase's primary acceptance criterion cannot pass at HEAD.
- evidenceRefs: fleet validator run over all packages (`BACKTICK_PATH_UNRESOLVED: 1`, `exitCode: 0`, strict on); the citing file untouched by `git diff --name-status 41302e72be..HEAD` (no output); `rg -c '^\| RM-[0-9]+ \|'` = 0.
- counterevidenceSought: checked whether the two new skip rules absorb `.cursor/` paths (they do not); checked whether the repair commits visited the file (they did not); checked for any RM row anywhere in the packet (none).
- alternativeExplanation: The builder may still record this warning as a Remaining row after this review, which REQ-001 explicitly permits; the scaffold marker shows the ledger is written by the builder.
- finalSeverity: P1
- confidence: 0.8
- downgradeTrigger: An RM row naming `.cursor/worktrees.json` lands in `implementation-summary.md`, or the sentence at line 14 is rewritten so it no longer reads as a repo path and the count reaches 0.

### P2

#### R1-P2-001 -- The `.skilled/release/` prefix skip blanks an entire namespace, hiding wrong filenames inside it

`INSTALLED_RELEASE_STATE_RE` is tested before existence and skips every token under `.skilled/release/` ([SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs:381], used at [SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs:414]). The relaxation is justified -- the source tree holds only `.gitignore` there, so correct citations cannot resolve here -- but it also means a typo or renamed state file (`.skilled/release/bse.json`) can never surface again. The new test pins the boundary only from outside the prefix: `.skilled/releases/base.json` must still warn ([SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/tests/validate-playbook-package.test.cjs:158]); nothing pins visibility inside it, by construction. Impact is bounded because the code is warning-only.

- claim: Any wrong filename under `.skilled/release/` is now invisible to the backtick check.
- evidenceRefs: validator lines 381, 389, 414; test line 158; fleet run showing no other tokens affected; `rg` found zero `./.skilled/release/` citations that would dodge the regex.
- counterevidenceSought: confirmed the source repository never holds these files (only `.gitignore` is tracked under `.skilled/release/`), so the skip fixes a real false positive; confirmed no other warning code re-covers these paths.
- alternativeExplanation: The namespace is engine-owned and unverifiable from the source tree by construction, so filename correctness is only checkable where the engine defines it; a validator warning was never the right instrument there.
- finalSeverity: P2
- confidence: 0.85
- downgradeTrigger: A release-state filename drift later observed that this skip hid raises it; codifying the state filenames somewhere checkable removes the residual loss.

#### R1-P2-002 -- Dangling symlinks are accepted by the backtick check but rejected by the link check

`pathPresent` treats a dangling symlink as an existing path ([SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs:394]) and is used only in `backtickPathChecks` ([SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs:416]). `pathChecks` still uses `fs.existsSync` ([SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs:353]), so the same dangling-symlink path cited as `[x](scenarios/linked-plugin.js)` produces a fail-closed `PATH_MISSING` error while a backticked citation is clean. The commit's rationale ("the link itself, not what it points at, decides whether a path resolves") therefore holds for one scanner only. No current corpus citation triggers the asymmetry (existing dangling symlinks sit in scratch/changelog areas without checkable extensions), but it is a latent two-verdicts-for-one-path inconsistency.

- claim: The new resolution policy is applied to backticked tokens but not to markdown links.
- evidenceRefs: validator lines 353-355 vs 394-397, 416; test lines 159-163; `find` for dangling symlinks in `.skilled`/`specs` (none with checkable extensions cited by playbooks).
- counterevidenceSought: checked whether the different severities are deliberate (links are contract violations, backticks advisory); the severity split is deliberate, but the existence question itself now answers differently per surface.
- alternativeExplanation: The two scanners may intentionally differ because only links are meant to be fail-closed; if so, the difference belongs in the comment as a stated policy.
- finalSeverity: P2
- confidence: 0.7
- downgradeTrigger: A comment or spec line declaring the deliberate difference, or `pathChecks` adopting `pathPresent`; a playbook citing a build-output symlink as a link would raise the impact.

## Answers to the Iteration Questions

1. Can either new skip rule hide a genuinely broken path? Partially yes, for one class each: the release prefix blanks all filename drift inside `.skilled/release/` (R1-P2-001), and a dangling symlink is accepted even when its target is truly gone (R1-P2-002). Neither can hide a path outside those classes, and neither can flip a gate: `BACKTICK_PATH_UNRESOLVED` is warning-only and `exitCode` derives from violations alone ([SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs:832]). The higher-impact gap is not hidden by a skip rule at all: one visible warning remains undocumented (R1-P1-001).
2. Does each new test fail without the change? Yes, both, by construction. The assertions are exact `deepStrictEqual` arrays. Without `INSTALLED_RELEASE_STATE_RE`, `.skilled/release/base.json` and `.skilled/release/runs/.doctor-update.last-run.json` enter the warnings array; without `pathPresent`, `scenarios/linked-plugin.js` enters it. The release test also pins the prefix boundary with `.skilled/releases/base.json`, which must keep warning.
3. Does the piped-report regression still prove what it claims? Yes. The seeded fixture emits 1500 `missing/drift-N.md` citations; stdout is asserted to exceed 65536 bytes and to end with the exit line, through the same `process.stdout.write` plus `process.exitCode` path the comment protects ([SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs:893]). It no longer exercises fleet discovery, but discovery was never the pinned property. The explicit large `maxBuffer` was dropped with the old call; the seeded report stays well under the default 1 MiB, and any future growth past it would fail loudly rather than silently.

## Traceability Checks

- core/spec_code: REQ-001 evaluated against HEAD -- 1 warning vs 0 Remaining rows -> R1-P1-001.
- core/checklist_evidence: `implementation-summary.md` is still scaffold text; AC-001 is marked Unmet -- consistent with R1-P1-001.
- overlay/playbook_capability: fleet validator run over all packages: 1 `BACKTICK_PATH_UNRESOLVED`, exit 0 under strict, confirming the repairs took the corpus from 258 to 1.
- overlay/skill_agent: validator rules live in `sk-doc` scripts; no skill or reference doc references `BACKTICK_PATH_UNRESOLVED`, so no documented surface drifted. `agent_cross_runtime` and `feature_catalog_code` deferred to the traceability iteration.

## Verification Evidence

- `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/tests/validate-playbook-package.test.cjs` -- rc 0; fixture suite PASS (33), contract regressions PASS (8), prompt sync PASS (8), piped report PASS (2).
- Fleet JSON run: `BACKTICK_PATH_UNRESOLVED: 1`, `exitCode: 0`, package `cli-external-orchestration/cli-cursor`, file `worktree-isolation/worktree-dry-run-inspection.md`, line 14.

## SCOPE VIOLATIONS

None. All writes stayed within the review packet plus the sanctioned gateway and temp event file.

## Verdict

CONDITIONAL -- one P1 (residual undocumented warning blocking REQ-001) and two P2 findings; no P0. The tests pass and the two skip rules are defensible, but the phase's own closure check cannot print `ok` at this tree until the last warning is rewritten or recorded.

## Next Dimension

security (iteration 2): injection and unsafe-input surface of the validator and its scripts.

Review verdict: CONDITIONAL
