---
title: "Feature Specification: Phase 8: alignment-findings"
description: "The 2026-11-12 alignment report on this branch leaves 28 findings, 9 P1 and 19 P2. This phase clears eleven work items: two shell producers with failing-first tests, seven stale documents, two env files, one surface map, one playbook, four cli-opencode files, two routing metadata files, one parent goal count and six changelog-shape files."
trigger_phrases:
  - "alignment findings"
  - "phase 8 alignment findings"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 8: alignment-findings

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-12 |
| **Branch** | `worktrees/351-session-relaunch-review-remediation` |
| **Parent Spec** | ../spec.md |
| **Phase** | 8 of 8 |
| **Predecessor** | 007-loop-start-record-cleanup |
| **Successor** | None |
| **Handoff Criteria** | `node --test .skilled/hooks/session-relaunch/tests/*.test.cjs` exits 0, `python3 .skilled/skills/sk-doc/sk-create-changelog/scripts/check_changelog_shape.py .skilled/changelog/skilled/v4.0.2.1.md` prints `PASS`, and the six routing probes return the expected skill. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 8** of the session relaunch review remediation, the phase that clears the findings of the 2026-11-12 alignment report on this branch.

**Scope Boundary**: The findings of the 2026-11-12 alignment report on this branch and the operator's ceiling decision. No change to the relaunch record format and no new module.

**Dependencies**:
- Phases 001 to 007 are Complete and committed on this branch.

**Deliverables**:
- Two code fixes with failing-first tests, the corrected documents, env rows, playbook scenarios, routing signals and shape ceilings.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`skilled_loop_real_path` follows a symlink at the wrapper path with no hop bound, so a cyclic pair of links hangs the sourced shell with no output. The replay classifier computes whether a short option's value is attached and honours that flag in only one branch, so an attached value such as `-H"x: y"` swallows the next word. Seven documents still state the pre-remediation rules, two env files omit the one operator-set `SKILLED_LOOP_*` variable and the unknown-window rule, and the routing metadata, the playbook and the changelog ceilings are behind the behavior this branch ships.

### Purpose
Clear every finding in the report so both producers fail closed and every document, env row, playbook, routing signal and ceiling describes the behavior this branch ships.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior

```text
$ rg -n 'while \[ -L "\$entry" \]|option_value_attached' .skilled/bin/skilled-loop-shell.sh .skilled/bin/skilled-loop
.skilled/bin/skilled-loop-shell.sh:28:  while [ -L "$entry" ]; do
.skilled/bin/skilled-loop:907:    option_value_attached=0
.skilled/bin/skilled-loop:913:        option_value_attached=1
.skilled/bin/skilled-loop:920:        && [[ "$argument" != *=* ]] && ((option_value_attached == 0)) \
```

Line 28 is the unbounded walk in `skilled_loop_real_path`, which starts at line 23. Lines 907 and 913 set `option_value_attached` and line 920 is the only test that reads it, in the denied branch, so the value-taking branch at line 956 has no attached-value guard.
<!-- /ANCHOR:measured-behavior -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Bound the symlink walk in `skilled_loop_real_path` at 40 hops and return 1 past that, with a failing-first cycle test for bash and zsh.
- Add the attached-value guard to the replay classifier's value-taking branch, with a failing-first test.
- Correct the seven documents that describe the sub-agent guard, the hop replay rule, the shim trust limit and the `/doctor:setup` window line.
- List `SKILLED_LOOP_TRUSTED_CHECKOUTS` and the unknown-window rule in the two env documents, and add `BASH_VERSION` and `ZSH_VERSION` to the surface map.
- Add the window and skipped-nudge scenarios, the cli-opencode corrections, the routing signals and the raised changelog shape ceilings.

### Out of Scope
- The relaunch record format, because no requirement reads or writes a record field.
- A new source module, because every requirement edits an existing file or adds one changelog entry.
- The parent goal file, because the orchestrator corrects the count and resends the chat slice, and no worker edits that file.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| .skilled/bin/skilled-loop-shell.sh | Modify | Bound the symlink walk at 40 hops in `skilled_loop_real_path` |
| .skilled/hooks/session-relaunch/tests/skilled-loop-shell.test.cjs | Modify | Add the cycle case for bash and zsh |
| .skilled/bin/skilled-loop | Modify | Guard the value-taking branch with `option_value_attached` |
| .skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs | Modify | Add the attached short option value case |
| .skilled/hooks/session-relaunch/claude/README.md | Modify | List the seven commands the sub-agent guard denies |
| .skilled/bin/README.md | Modify | Replace the carry-only sentence with the replay rule |
| README.md | Modify | Name the shim trust limit at line 1055 and add the setup window line at line 1314 |
| .skilled/skills/system-spec-kit/README.md | Modify | Name the shim trust limit at line 92 |
| .skilled/skills/system-spec-kit/feature-catalog/context-preservation/session-relaunch-loop.md | Modify | State the unknown window, the option replay and the trust limit |
| .skilled/skills/system-spec-kit/feature-catalog/feature-catalog.md | Modify | State the trust limit at line 1050 |
| .skilled/skills/system-skilled-doctor/README.md | Modify | Add the window line to the setup row at line 44 |
| .env.example | Modify | List the trusted checkouts and the window fallback in Section 18 |
| .skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md | Modify | Add the trusted-checkouts row and the window fallback |
| .skilled/commands/assets/local-skilled-alignment/surface-map.yaml | Modify | Add `BASH_VERSION` and `ZSH_VERSION` to `platform_tokens` |
| .skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-relaunch-claude.md | Modify | Add the window and skipped-nudge scenarios |
| .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/cli-invocation/base-non-interactive-invocation.md | Modify | Exempt `OPENCODE_API_KEY` in the expected signals and failure triage |
| .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/external-dispatch/self-invocation-refusal.md | Modify | Add the key-only step to the CO-008 row |
| .skilled/skills/cli-external-orchestration/cli-opencode/SKILL.md | Modify | Raise the version to 1.5.10.0 |
| .skilled/skills/cli-external-orchestration/cli-opencode/changelog/v1.5.10.0.md | Create | Record the layer 1 exemption |
| .skilled/skills/system-spec-kit/graph-metadata.json | Modify | Add the relaunch and window intent signals |
| .skilled/skills/system-skilled-doctor/graph-metadata.json | Modify | Add the three doctor signals and `setup.md` as a key file |
| specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/goal.md | Modify | Correct the phase folder count, orchestrator only |
| .skilled/skills/sk-doc/sk-create-changelog/scripts/check_changelog_shape.py | Modify | Raise the three ceilings in the constants and the docstring |
| .skilled/skills/sk-doc/sk-create-changelog/scripts/README.md | Modify | Carry 280, 32 and 14 |
| .skilled/skills/sk-doc/sk-create-changelog/SKILL.md | Modify | Carry 280, 32 and 14 |
| .skilled/skills/sk-doc/sk-create-changelog/README.md | Modify | Carry 280, 32 and 14 |
| .skilled/skills/sk-doc/sk-create-changelog/assets/changelog-template.md | Modify | Carry 280, 32 and 14 |
| .skilled/changelog/skilled/v4.0.2.1.md | None | Holds the `## Session Handover` section from `9af041968a`, so this phase confirms it |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `skilled_loop_real_path` counts each symlink hop and returns 1 after 40, so a cycle refuses instead of hanging. Verify: `node --test --test-name-pattern 'symlink cycle' .skilled/hooks/session-relaunch/tests/skilled-loop-shell.test.cjs` prints `# pass 2` and `# fail 0`, one case for bash and one for zsh. |
| REQ-002 | An attached short option value such as `-H"x: y"` consumes no following word, so the prompt after it stays a prompt. Verify: `node --test --test-name-pattern 'attached short option value' .skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs` prints `# pass 1` and `# fail 0`. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | Seven documents state the current rules from `.skilled/hooks/session-relaunch/README.md`: the guard denies seven commands, a hop replays every help-documented launch option minus the deny list, the shim trusts only the sourced checkout, its registered linked worktrees or a checkout in `SKILLED_LOOP_TRUSTED_CHECKOUTS`, and `/doctor:setup` prints the Claude context window line. Verify: `rg -n -e 'claim., .complete., .keep. or .prepare.' -e 'carries model, name, Pi extension and Pi provider values only' -e 'plain runtime launches start under the wrapper' -e 'starts every interactive runtime under it, also in a repository that links' -e 'starts each interactive runtime launch under it' -e 'source or model default' -e 'carries model selection' README.md .skilled/bin/README.md .skilled/skills/system-spec-kit/README.md .skilled/skills/system-spec-kit/feature-catalog/feature-catalog.md .skilled/skills/system-spec-kit/feature-catalog/context-preservation/session-relaunch-loop.md .skilled/hooks/session-relaunch/claude/README.md` prints nothing. |
| REQ-004 | `.env.example` Section 18 and `ENV-REFERENCE.md` list `SKILLED_LOOP_TRUSTED_CHECKOUTS` as colon-separated absolute checkout paths whose unset or empty value trusts nothing extra and as the one operator-set `SKILLED_LOOP_*` variable, and both window rows say `autoCompactWindow`, then one million tokens for a model id with the `[1m]` marker, otherwise unknown and the nudge is skipped. Verify: `rg -c 'SKILLED_LOOP_TRUSTED_CHECKOUTS' .env.example .skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md` prints one line per file, and `rg -n 'then the model default' .env.example .skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md` prints nothing. |
| REQ-005 | `BASH_VERSION` and `ZSH_VERSION` sit in `env_check.platform_tokens`, so a read of either is not reported as an unlisted operator switch. Verify: `rg -n -e '^    - BASH_VERSION$' -e '^    - ZSH_VERSION$' .skilled/commands/assets/local-skilled-alignment/surface-map.yaml` prints 2 lines. |
| REQ-006 | The Claude relaunch playbook carries a `session-relaunch.cjs window` scenario with and without a configured window and a `context-nudge-skipped` scenario whose reason is `window-unknown`. Verify: `rg -l 'session-relaunch\.cjs" window' .skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-relaunch-claude.md` prints the path, and `rg -l 'reason=window-unknown' .skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-relaunch-claude.md` prints it again. |
| REQ-007 | The cli-opencode CO-001 row exempts `OPENCODE_API_KEY` in its expected signals and in failure triage step 2, the CO-008 row runs `export OPENCODE_API_KEY=x` as a command step and asserts the layer 1 line stays silent, and the skill ships `version: 1.5.10.0` with `changelog/v1.5.10.0.md`. Verify: `rg -n '^version: 1.5.10.0$' .skilled/skills/cli-external-orchestration/cli-opencode/SKILL.md` prints one line, `test -f .skilled/skills/cli-external-orchestration/cli-opencode/changelog/v1.5.10.0.md` exits 0, `rg -n 'other than .OPENCODE_API_KEY.' .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/cli-invocation/base-non-interactive-invocation.md` prints 3 lines, and `rg -c 'OPENCODE_API_KEY=x' .skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/external-dispatch/self-invocation-refusal.md` prints 2. |
| REQ-008 | `system-spec-kit/graph-metadata.json` carries the session relaunch, context window, relaunch nudge and skilled-loop wrapper signals, `system-skilled-doctor/graph-metadata.json` carries the doctor setup, repository health legs and runtime mirrors signals and lists `setup.md` as a key file, and the rebuilt graph routes the eight action probes. Verify: `node .skilled/commands/assets/local-skilled-alignment/run-probes.cjs --probes /Users/michelkerkmeester/.local/state/local-skilled-alignment/351-session-relaunch-review-remediation/20261112T152419Z/probes-input.json` prints `STATUS=FINDINGS run-probes: pass=8 fail=2 cannot_run=0`, where the two misses are P04 and P06, read-only explainer prompts the scorer floors at 0.25 confidence by design. |
| REQ-009 | The parent goal at `specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/goal.md` states 36 phase folders and records the chat-slice resend, corrected by the orchestrator with no worker edit. Verify: `rg -n 'All 36 phase folders' specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/goal.md` prints one line. |
| REQ-010 | The changelog shape checker raises `EXPANDED_MAX_BODY_LINES` to 280, `EXPANDED_MAX_H4_ITEMS` to 32 and `GLANCE_MAX_BULLETS` to 14, and the script docstring, `scripts/README.md`, `SKILL.md`, `README.md` and `assets/changelog-template.md` carry the same three numbers, so v4.0.2.1 passes. Verify: `rg -n -e 'EXPANDED_MAX_BODY_LINES = 280' -e 'EXPANDED_MAX_H4_ITEMS = 32' -e 'GLANCE_MAX_BULLETS = 14' .skilled/skills/sk-doc/sk-create-changelog/scripts/check_changelog_shape.py` prints 3 lines, and `python3 .skilled/skills/sk-doc/sk-create-changelog/scripts/check_changelog_shape.py .skilled/changelog/skilled/v4.0.2.1.md` prints `PASS`. |
| REQ-011 | The root release note holds a `## Session Handover` section, added in `9af041968a`. Verify: `rg -n '^## Session Handover$' .skilled/changelog/skilled/v4.0.2.1.md` prints one line. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `node --test --test-name-pattern 'symlink cycle' .skilled/hooks/session-relaunch/tests/skilled-loop-shell.test.cjs` prints `# pass 2` and `# fail 0`, and `rg -n 'hops=\$\(\(hops \+ 1\)\)' .skilled/bin/skilled-loop-shell.sh` prints one line.
- **SC-002**: `node --test --test-name-pattern 'attached short option value' .skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs` prints `# pass 1` and `# fail 0`, and `rg -c 'option_value_attached == 0' .skilled/bin/skilled-loop` prints 2.
- **SC-003**: `rg -c 'SKILLED_LOOP_TRUSTED_CHECKOUTS' README.md .skilled/skills/system-spec-kit/README.md .skilled/skills/system-spec-kit/feature-catalog/feature-catalog.md .skilled/skills/system-spec-kit/feature-catalog/context-preservation/session-relaunch-loop.md` prints 1 for each file, and `rg -c 'Claude context window' README.md .skilled/skills/system-skilled-doctor/README.md` prints 1 for each file.
- **SC-004**: `rg -c 'SKILLED_LOOP_TRUSTED_CHECKOUTS' .env.example .skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md` prints 2 for each file, and `rg -n '\[1m\]' .env.example .skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md` prints one line per file.
- **SC-005**: `node .skilled/commands/assets/local-skilled-alignment/check-env-tokens.cjs --scope /Users/michelkerkmeester/.local/state/local-skilled-alignment/351-session-relaunch-review-remediation/20261112T152419Z/scope.json --out /Users/michelkerkmeester/.local/state/local-skilled-alignment/351-session-relaunch-review-remediation/20261112T152419Z/env-tokens-after.json` prints `STATUS=OK` and `unlisted=0`.
- **SC-006**: `rg -l 'session-relaunch\.cjs" window' .skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-relaunch-claude.md` and `rg -l 'reason=window-unknown' .skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-relaunch-claude.md` each print the path.
- **SC-007**: `rg -n '^version: 1.5.10.0$' .skilled/skills/cli-external-orchestration/cli-opencode/SKILL.md` prints one line, and `ls .skilled/skills/cli-external-orchestration/cli-opencode/changelog/v1.5.10.0.md` prints the path.
- **SC-008**: `node .skilled/commands/assets/local-skilled-alignment/run-probes.cjs --probes /Users/michelkerkmeester/.local/state/local-skilled-alignment/351-session-relaunch-review-remediation/20261112T152419Z/probes-input.json` prints `STATUS=FINDINGS run-probes: pass=8 fail=2 cannot_run=0`, where the two misses are P04 and P06, read-only explainer prompts the scorer floors at 0.25 confidence by design.
- **SC-009**: `rg -n 'All 36 phase folders' specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/goal.md` prints one line, and `rg -n 'All eleven phase folders' specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/goal.md` prints nothing.
- **SC-010**: `python3 .skilled/skills/sk-doc/sk-create-changelog/scripts/check_changelog_shape.py .skilled/changelog/skilled/v4.0.2.1.md` prints `PASS`, and `rg -c '280' .skilled/skills/sk-doc/sk-create-changelog/scripts/README.md .skilled/skills/sk-doc/sk-create-changelog/SKILL.md .skilled/skills/sk-doc/sk-create-changelog/README.md .skilled/skills/sk-doc/sk-create-changelog/assets/changelog-template.md` prints at least 1 for each file.
- **SC-011**: `rg -n '^## Session Handover$' .skilled/changelog/skilled/v4.0.2.1.md` prints one line.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phases 001 to 007, Complete and committed on this branch | The documents and the two producers are read against the wrong base | Read every source line in the packet before the first edit, and pin evidence to this branch |
| Dependency | `node` with `node --test`, bash 3.2 or newer and zsh | Neither failing-first test can run | The handoff criterion cannot be met until the runtimes are installed |
| Dependency | `python3` for `check_changelog_shape.py` | The ceiling decision cannot be proved | No completion claim until the script prints `PASS` |
| Risk | A hop bound that rejects a legitimate long chain | A wrapper behind more than 40 links stops resolving | Return 1 only past the 40th hop and test a 40-hop chain that still resolves |
| Risk | The attached-value guard drops a real option value | A replayed flag reaches the new session without its value | Test an attached short value, a separate short value, an attached long value and a denied attached value |
| Risk | A routing signal moves a probe that passed before | An unrelated route regresses | Run all ten probes and compare `pass=8` against the pre-change run that failed six, and rerun the seven advisor routing suites |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The hop bound adds one integer comparison per symlink hop, so a 40-hop chain costs 40 comparisons.
- **NFR-P02**: The attached-value guard adds one integer comparison per replayed option, so replay cost stays linear in the argument count.

### Security
- **NFR-S01**: N/A: no requirement authenticates a user or reads a credential.
- **NFR-S02**: A symlink cycle at the wrapper path now fails closed with status 1, so the sourced shell treats the wrapper as unresolved and starts the raw runtime.

### Reliability
- **NFR-R01**: N/A: the packet runs no service, so no uptime target applies.
- **NFR-R02**: An acyclic chain of 40 hops or fewer resolves to the same path as before the change.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: no symlink sits at the wrapper path, so the walk never enters and the path resolves as today.
- Maximum input: a chain of exactly 40 hops resolves, and the 41st hop returns 1.
- Failure path: a cyclic pair returns 1, the shim records no wrapper and the caller gets the raw runtime instead of a hang.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | 28 files, two shell producers and a document set, with no new module |
| Risk | 6/25 | Two shell branches in the relaunch path, no record format and no public interface |
| Research | 5/20 | The alignment report, the two producers and the seven documents are read in full |
| **Total** | **23/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

None
<!-- /ANCHOR:questions -->

---
