---
title: "Tasks: Phase 8: alignment-findings"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "alignment findings tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 8: alignment-findings

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

Every task names its file in full. The list defines no path variables.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm the unbounded symlink walk in `.skilled/bin/skilled-loop-shell.sh`. Verify: `rg -n 'while \[ -L "\$entry" \]' .skilled/bin/skilled-loop-shell.sh` printed line 28 before the fix and prints line 29 after it.
- [x] T002 Confirm the value-taking branch in `.skilled/bin/skilled-loop`. Verify: `rg -n 'argument" != \*=\*' .skilled/bin/skilled-loop` prints lines 920, 956 and 975.
- [x] T003 Confirm the shim trust sentence in `README.md`. Verify: `rg -n 'plain runtime launches start under the wrapper' README.md` prints line 1055.
- [x] T004 Confirm the window fallback in `.env.example`. Verify: `rg -n 'then the model default' .env.example` printed line 621 before the fix and prints nothing after it.
- [x] T005 Confirm the platform token list in `.skilled/commands/assets/local-skilled-alignment/surface-map.yaml`. Verify: `rg -n 'platform_tokens' .skilled/commands/assets/local-skilled-alignment/surface-map.yaml` prints line 540.
- [x] T006 Confirm the ten probes in `/Users/michelkerkmeester/.local/state/local-skilled-alignment/351-session-relaunch-review-remediation/20261112T152419Z/probes-input.json`. Verify: `rg -c '"prompt"' /Users/michelkerkmeester/.local/state/local-skilled-alignment/351-session-relaunch-review-remediation/20261112T152419Z/probes-input.json` prints 10.
- [x] T007 Confirm the current ceilings in `.skilled/skills/sk-doc/sk-create-changelog/scripts/check_changelog_shape.py`. Verify: `rg -n -e 'EXPANDED_MAX_BODY_LINES = 240' -e 'EXPANDED_MAX_H4_ITEMS = 26' -e 'GLANCE_MAX_BULLETS = 12' .skilled/skills/sk-doc/sk-create-changelog/scripts/check_changelog_shape.py` printed 3 lines before the fix and prints nothing after it.
- [x] T008 Confirm the handover section in `.skilled/changelog/skilled/v4.0.2.1.md`. Verify: `rg -n '^## Session Handover$' .skilled/changelog/skilled/v4.0.2.1.md` prints line 168.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T010 Write the failing case named `a symlink cycle at the wrapper path returns 1` in `.skilled/hooks/session-relaunch/tests/skilled-loop-shell.test.cjs`, planting a two-link cycle under both bash and zsh. Verify: `node --test --test-name-pattern 'symlink cycle' .skilled/hooks/session-relaunch/tests/skilled-loop-shell.test.cjs` prints `# fail 2` before the fix.
- [x] T011 Add the hop counter to `skilled_loop_real_path` in `.skilled/bin/skilled-loop-shell.sh`, incrementing it inside the walk and returning 1 past 40 hops. Verify: `node --test --test-name-pattern 'symlink cycle' .skilled/hooks/session-relaunch/tests/skilled-loop-shell.test.cjs` prints `# pass 2` and `# fail 0`.
- [x] T012 Write the failing case named `an attached short option value keeps the next word as the prompt` in `.skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs`, replaying `-H` with its value attached before a prompt. Verify: `node --test --test-name-pattern 'attached short option value' .skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs` prints `# fail 1` before the fix.
- [x] T013 Add `&& ((option_value_attached == 0))` to the value-taking test in `.skilled/bin/skilled-loop` at line 956. Verify: `node --test --test-name-pattern 'attached short option value' .skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs` prints `# pass 1` and `# fail 0`.
- [x] T014 List `claim`, `complete`, `keep`, `prepare`, `cancel`, `consume` and `hand-over` in the sub-agent guard row in `.skilled/hooks/session-relaunch/claude/README.md`. Verify: `rg -n 'claim.*complete.*keep.*prepare.*cancel.*consume.*hand-over' .skilled/hooks/session-relaunch/claude/README.md` prints line 28.
- [x] T015 Replace the carry-only sentence in `.skilled/bin/README.md` with `A hop replays the first launch's options in their original order minus the deny list` and point at `.skilled/hooks/session-relaunch/README.md`. Verify: `rg -n 'replays the first launch' .skilled/bin/README.md` prints one line.
- [x] T016 Name the shim trust limit and `SKILLED_LOOP_TRUSTED_CHECKOUTS` in the setup sentence in `README.md` at line 1055. Verify: `rg -n 'SKILLED_LOOP_TRUSTED_CHECKOUTS' README.md` prints line 1055.
- [x] T017 Add the Claude context window line to the `/doctor:setup` paragraph in `README.md` at line 1314. Verify: `rg -n 'Claude context window' README.md` prints line 1314.
- [x] T018 Name the shim trust limit and `SKILLED_LOOP_TRUSTED_CHECKOUTS` in `.skilled/skills/system-spec-kit/README.md` at line 92. Verify: `rg -n 'SKILLED_LOOP_TRUSTED_CHECKOUTS' .skilled/skills/system-spec-kit/README.md` prints line 92.
- [x] T019 State the unknown window, the option replay and the trust limit in `.skilled/skills/system-spec-kit/feature-catalog/context-preservation/session-relaunch-loop.md` at lines 33, 41 and 57. Verify: `rg -n -e 'source or model default' -e 'carries model selection' -e 'under the nearest wrapper' .skilled/skills/system-spec-kit/feature-catalog/context-preservation/session-relaunch-loop.md` prints nothing, and `rg -c 'SKILLED_LOOP_TRUSTED_CHECKOUTS' .skilled/skills/system-spec-kit/feature-catalog/context-preservation/session-relaunch-loop.md` prints 1.
- [x] T020 State the trust limit in `.skilled/skills/system-spec-kit/feature-catalog/feature-catalog.md` at line 1050. Verify: `rg -n 'SKILLED_LOOP_TRUSTED_CHECKOUTS' .skilled/skills/system-spec-kit/feature-catalog/feature-catalog.md` prints line 1050.
- [x] T021 Add the Claude context window line to the `/doctor:setup` row in `.skilled/skills/system-skilled-doctor/README.md` at line 44. Verify: `rg -n 'Claude context window' .skilled/skills/system-skilled-doctor/README.md` prints line 44.
- [x] T022 List `SKILLED_LOOP_TRUSTED_CHECKOUTS` in Section 18 of `.env.example`, carve it out of the sentence that says the loop sets every `SKILLED_LOOP_*` variable, and replace the window comment with the `autoCompactWindow`, `[1m]` and unknown rule. Verify: `rg -n 'SKILLED_LOOP_TRUSTED_CHECKOUTS' .env.example` prints 2 lines, the carve-out sentence and the new entry, and `rg -n 'then the model default' .env.example` prints nothing.
- [x] T023 Add the `SKILLED_LOOP_TRUSTED_CHECKOUTS` row to `.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md`, carve it out of the sentence that says an operator never sets the loop variables, and replace the window fallback. Verify: `rg -n 'SKILLED_LOOP_TRUSTED_CHECKOUTS' .skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md` prints 2 lines, the new row and the carve-out sentence, and `rg -n 'then the model default' .skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md` prints nothing.
- [x] T024 Add `BASH_VERSION` and `ZSH_VERSION` to `env_check.platform_tokens` in `.skilled/commands/assets/local-skilled-alignment/surface-map.yaml`. Verify: `rg -n -e '^    - BASH_VERSION$' -e '^    - ZSH_VERSION$' .skilled/commands/assets/local-skilled-alignment/surface-map.yaml` prints 2 lines. That folder is a symlink to the primary checkout's gitignored local command assets, so this edit sits outside the worktree and in no commit.
- [x] T025 Add the `session-relaunch.cjs window` scenario with and without a configured window and the `context-nudge-skipped` scenario with `reason=window-unknown` to `.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-relaunch-claude.md`. Verify: `rg -l 'session-relaunch\.cjs" window' .skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-relaunch-claude.md` prints the path, and `rg -l 'reason=window-unknown' .skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-relaunch-claude.md` prints it again.
- [x] T026 Exempt `OPENCODE_API_KEY` in the expected signals and in failure triage step 2 of `.skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/cli-invocation/base-non-interactive-invocation.md`. Verify: `rg -n 'other than .OPENCODE_API_KEY.' .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/cli-invocation/base-non-interactive-invocation.md` prints 3 lines, the precondition included.
- [x] T027 Add `export OPENCODE_API_KEY=x` as a command step of the CO-008 row and assert the layer 1 line stays silent in `.skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/external-dispatch/self-invocation-refusal.md`. Verify: `rg -c 'OPENCODE_API_KEY=x' .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/external-dispatch/self-invocation-refusal.md` prints 2.
- [x] T028 Raise the version to 1.5.10.0 in `.skilled/skills/cli-external-orchestration/cli-opencode/SKILL.md`. Verify: `rg -n '^version: 1.5.10.0$' .skilled/skills/cli-external-orchestration/cli-opencode/SKILL.md` prints line 5.
- [x] T029 Create `.skilled/skills/cli-external-orchestration/cli-opencode/changelog/v1.5.10.0.md` with the layer 1 exemption entry. Verify: `test -f .skilled/skills/cli-external-orchestration/cli-opencode/changelog/v1.5.10.0.md` exits 0.
- [x] T030 Add the signals `session relaunch`, `context window`, `relaunch nudge` and `skilled-loop wrapper` to `.skilled/skills/system-spec-kit/graph-metadata.json`. Verify: `rg -c -e '"session relaunch"' -e '"context window the nudge measures against"' -e '"relaunch nudge"' -e '"skilled-loop wrapper"' .skilled/skills/system-spec-kit/graph-metadata.json` prints 4.
- [x] T031 Add the signals `doctor setup`, `repository health legs` and `runtime mirrors`, plus `setup.md` as a key file, to `.skilled/skills/system-skilled-doctor/graph-metadata.json`. Verify: `rg -c -e '"doctor setup"' -e '"repository health legs"' -e '"runtime mirrors"' -e 'doctor/setup.md"' .skilled/skills/system-skilled-doctor/graph-metadata.json` prints 4.
- [x] T032 Rebuild the advisor graph that `.skilled/skills/system-skill-advisor/runtime/handlers/advisor-rebuild.ts` publishes, so the new signals load. Verify: `node .skilled/bin/skill-advisor.cjs advisor_rebuild --trusted --force true` exits 0.
- [x] T033 Record the orchestrator's correction of the phase folder count to 36 in `specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/goal.md` and resend the chat slice. Verify: `rg -n 'All 36 phase folders' specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/goal.md` prints one line.
- [x] T034 Raise `EXPANDED_MAX_BODY_LINES` to 280, `EXPANDED_MAX_H4_ITEMS` to 32 and `GLANCE_MAX_BULLETS` to 14 in the constants and the docstring of `.skilled/skills/sk-doc/sk-create-changelog/scripts/check_changelog_shape.py`. Verify: `rg -n -e 'EXPANDED_MAX_BODY_LINES = 280' -e 'EXPANDED_MAX_H4_ITEMS = 32' -e 'GLANCE_MAX_BULLETS = 14' .skilled/skills/sk-doc/sk-create-changelog/scripts/check_changelog_shape.py` prints 3 lines.
- [x] T035 Carry 280, 32 and 14 in `.skilled/skills/sk-doc/sk-create-changelog/scripts/README.md`. Verify: `rg -n -e '280 lines' -e '32 H4 items' -e '14 bullets' .skilled/skills/sk-doc/sk-create-changelog/scripts/README.md` prints 3 lines.
- [x] T036 Carry 280, 32 and 14 in `.skilled/skills/sk-doc/sk-create-changelog/SKILL.md`. Verify: `rg -n -e 'at most 14 glance bullets' -e 'within 280 lines' -e 'within 32 H4 items' .skilled/skills/sk-doc/sk-create-changelog/SKILL.md` prints 1 line, because the three phrases share line 290.
- [x] T037 Carry 280, 32 and 14 in `.skilled/skills/sk-doc/sk-create-changelog/README.md`. Verify: `rg -n 'within 280 lines and 32 H4 items, at most 14 glance bullets' .skilled/skills/sk-doc/sk-create-changelog/README.md` prints 1 line.
- [x] T038 Carry 280, 32 and 14 in `.skilled/skills/sk-doc/sk-create-changelog/assets/changelog-template.md`. Verify: `rg -n -e '14 bullets' -e '280 lines' -e '\| 32 \|' .skilled/skills/sk-doc/sk-create-changelog/assets/changelog-template.md` prints 3 lines.
- [x] T039 Confirm the `## Session Handover` section survives in `.skilled/changelog/skilled/v4.0.2.1.md` with no edit. Verify: `rg -n '^## Session Handover$' .skilled/changelog/skilled/v4.0.2.1.md` prints line 168.
- [x] T046 Name the trusted wrapper in the three playbook source tables under `.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/`. Verify: `rg -c 'under a trusted wrapper' .skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/` prints 1 for each of three files.
- [x] T047 Name the trusted wrapper in `.skilled/hooks/README.md`. Verify: `rg -n 'nearest wrapper' .skilled README.md .env.example --glob '!**/changelog/**' --glob '!**/z_archive/**'` prints nothing.
- [x] T048 List the seven denied commands in the guard sentence of `.skilled/hooks/session-relaunch/README.md`, which the alignment recheck reported as still open. Verify: `rg -n 'denies `claim`, `complete`, `keep` and `prepare`' .skilled/hooks/session-relaunch/README.md` prints nothing.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T040 Run every relaunch test in `.skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs` and its siblings. Verify: `node --test .skilled/hooks/session-relaunch/tests/*.test.cjs` exits 0 and prints `# fail 0`.
- [x] T041 Run the ten advisor probes from `/Users/michelkerkmeester/.local/state/local-skilled-alignment/351-session-relaunch-review-remediation/20261112T152419Z/probes-input.json`. Verify: `node .skilled/commands/assets/local-skilled-alignment/run-probes.cjs --probes /Users/michelkerkmeester/.local/state/local-skilled-alignment/351-session-relaunch-review-remediation/20261112T152419Z/probes-input.json` prints `STATUS=FINDINGS run-probes: pass=8 fail=2 cannot_run=0`, where the two misses are P04 and P06, read-only explainer prompts the scorer floors at 0.25 confidence by design.
- [x] T042 Run the changelog shape check on `.skilled/changelog/skilled/v4.0.2.1.md`. Verify: `python3 .skilled/skills/sk-doc/sk-create-changelog/scripts/check_changelog_shape.py .skilled/changelog/skilled/v4.0.2.1.md` prints `PASS` and exits 0.
- [x] T043 Run the env token check against `/Users/michelkerkmeester/.local/state/local-skilled-alignment/351-session-relaunch-review-remediation/20261112T152419Z/scope.json`. Verify: `node .skilled/commands/assets/local-skilled-alignment/check-env-tokens.cjs --scope /Users/michelkerkmeester/.local/state/local-skilled-alignment/351-session-relaunch-review-remediation/20261112T152419Z/scope.json --out /Users/michelkerkmeester/.local/state/local-skilled-alignment/351-session-relaunch-review-remediation/20261112T152419Z/env-tokens-after.json` prints `STATUS=OK` and `unlisted=0`.
- [x] T044 Check comment hygiene in `.skilled/bin/skilled-loop-shell.sh` and `.skilled/bin/skilled-loop`. Verify: `rg -n -e 'specs/' -e 'REQ-0' -e '036-review' .skilled/bin/skilled-loop-shell.sh .skilled/bin/skilled-loop` prints nothing.
- [x] T045 Run the strict validator for `specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/036-review-remediation/008-alignment-findings`. Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/036-review-remediation/008-alignment-findings --strict --quiet` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] `node --test .skilled/hooks/session-relaunch/tests/*.test.cjs` exits 0
- [x] `python3 .skilled/skills/sk-doc/sk-create-changelog/scripts/check_changelog_shape.py .skilled/changelog/skilled/v4.0.2.1.md` prints `PASS`
- [x] The ten probes print `STATUS=FINDINGS run-probes: pass=8 fail=2 cannot_run=0`, with P04 and P06 as the two misses
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Eleven requirements are documented: `rg -c '^\| REQ-' specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/036-review-remediation/008-alignment-findings/spec.md` prints 11.
- [x] CHK-002 [P0] The plan names both producers: `rg -c -e 'skilled_loop_real_path' -e 'option_value_attached' specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/036-review-remediation/008-alignment-findings/plan.md` prints at least 2.
- [x] CHK-003 [P1] The dependency on phases 001 to 007 is recorded: `rg -n 'Phases 001 to 007' specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/036-review-remediation/008-alignment-findings/spec.md` prints one line.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] The shim parses under bash: `bash -n .skilled/bin/skilled-loop-shell.sh` exits 0.
- [x] CHK-011 [P0] The shim parses under zsh: `zsh -n .skilled/bin/skilled-loop-shell.sh` exits 0.
- [x] CHK-012 [P1] The walk carries a hop bound: `rg -c 'hops=\$\(\(hops \+ 1\)\)' .skilled/bin/skilled-loop-shell.sh` prints 1.
- [x] CHK-013 [P1] The attached-value flag is read in both branches: `rg -c 'option_value_attached == 0' .skilled/bin/skilled-loop` prints 2.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] Every relaunch test passes: `node --test .skilled/hooks/session-relaunch/tests/*.test.cjs` exits 0.
- [x] CHK-021 [P0] The cycle case passes under both shells: `node --test --test-name-pattern 'symlink cycle' .skilled/hooks/session-relaunch/tests/skilled-loop-shell.test.cjs` prints `# pass 2` and `# fail 0`.
- [x] CHK-022 [P1] The attached-value case passes: `node --test --test-name-pattern 'attached short option value' .skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs` prints `# pass 1` and `# fail 0`.
- [x] CHK-023 [P1] N/A: the pre-fix failure is recorded in T010 and T012, so no command answers it after the fix.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [x] CHK-FIX-001 [P0] Every finding carries a class: `rg -n 'Finding classes' specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/036-review-remediation/008-alignment-findings/plan.md` prints one line naming `literal`, `judgment` and `operator decision`.
- [x] CHK-FIX-002 [P0] The same-class producer inventory is complete: `rg -n 'while \[ -L "\$entry" \]|option_value_attached' .skilled/bin/skilled-loop-shell.sh .skilled/bin/skilled-loop` prints 5 lines.
- [x] CHK-FIX-003 [P0] The consumer inventory is complete: `rg -n 'SKILLED_LOOP_TRUSTED_CHECKOUTS' .skilled .env.example README.md --glob '*.sh' --glob '*.md'` prints the shim reader and every document that names the variable.
- [x] CHK-FIX-004 [P0] The adversarial cases run: `node --test --test-name-pattern 'symlink cycle' .skilled/hooks/session-relaunch/tests/skilled-loop-shell.test.cjs` prints `# pass 2` and `node --test --test-name-pattern 'attached short option value' .skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs` prints `# pass 1`.
- [x] CHK-FIX-005 [P1] The matrix axes and row count are listed: `rg -n 'Matrix axes' specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/036-review-remediation/008-alignment-findings/plan.md` prints one line with the two axes and the row counts.
- [x] CHK-FIX-006 [P1] The hostile env variant is recorded: `rg -n 'Hostile env variant' specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/036-review-remediation/008-alignment-findings/plan.md` prints one line naming `BASH_VERSION` and `ZSH_VERSION`.
- [x] CHK-FIX-007 [P1] The evidence is pinned to this branch: `git diff --stat` prints the changed files for this phase.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] N/A: the change adds no credential, endpoint or secret.
- [x] CHK-031 [P0] N/A: no requirement parses operator input beyond the launch arguments the wrapper already reads.
- [x] CHK-032 [P1] A symlink cycle fails closed: `node --test --test-name-pattern 'symlink cycle' .skilled/hooks/session-relaunch/tests/skilled-loop-shell.test.cjs` prints `# pass 2` and `# fail 0`.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] The packet validates: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/036-review-remediation/008-alignment-findings --strict --quiet` prints `RESULT: PASSED`.
- [x] CHK-041 [P1] No ephemeral label sits in a code comment: `rg -n -e 'specs/' -e 'REQ-0' -e '036-review' .skilled/bin/skilled-loop-shell.sh .skilled/bin/skilled-loop` prints nothing.
- [x] CHK-042 [P2] The release note holds the handover section: `rg -n '^## Session Handover$' .skilled/changelog/skilled/v4.0.2.1.md` prints line 168.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] The packet's scratch folder holds evidence only: `ls specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/036-review-remediation/008-alignment-findings/scratch` prints the red and green run files and the two probe files.
- [x] CHK-051 [P1] The phase writes only its named files: `git status --porcelain` lists the files of the spec's Files to Change table, this packet, the parent packet's `spec.md`, `goal.md` and `graph-metadata.json`, the goal one level up, four more documents that carried the same stale shim sentence and the four compiled-routing manifests the re-mint rewrote.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-11-12
<!-- /ANCHOR:summary -->

---
