---
title: "Implementation Plan: Phase 8: alignment-findings"
description: "Clear the eleven work items of the 2026-11-12 alignment report. Two shell producers gain a bound and an attached-value guard, both written test-first, and the documents, env rows, playbook scenarios, routing signals and changelog ceilings are corrected to the behavior this branch ships."
trigger_phrases:
  - "alignment findings plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 8: alignment-findings

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Bash 3.2 or newer and zsh for the two producers, Markdown, YAML and JSON for the documents, Python 3 for the changelog checker |
| **Framework** | None, the changed files are shell functions, documents, metadata and one Python checker |
| **Storage** | None, the relaunch record format does not change and the advisor graph is generated state |
| **Testing** | `node --test` with `node:assert/strict`, `rg` checks and `check_changelog_shape.py` |

### Overview
Add a hop counter to `skilled_loop_real_path` in `.skilled/bin/skilled-loop-shell.sh` and the attached-value guard to the replay classifier in `.skilled/bin/skilled-loop`, each behind a test that fails before the fix. Correct the seven documents, the two env files, the surface map, the playbook and the cli-opencode files so they state what this branch ships. Add the routing signals, rebuild the graph, raise the three changelog ceilings and prove each one with the command its requirement names.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] `node --test .skilled/hooks/session-relaunch/tests/*.test.cjs` exits 0
- [x] `python3 .skilled/skills/sk-doc/sk-create-changelog/scripts/check_changelog_shape.py .skilled/changelog/skilled/v4.0.2.1.md` prints `PASS`
- [x] `node .skilled/commands/assets/local-skilled-alignment/run-probes.cjs --probes /Users/michelkerkmeester/.local/state/local-skilled-alignment/351-session-relaunch-review-remediation/20261112T152419Z/probes-input.json` prints `STATUS=FINDINGS run-probes: pass=8 fail=2 cannot_run=0`, where the two misses are P04 and P06, read-only explainer prompts the scorer floors at 0.25 confidence by design
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Single-phase remediation

### Key Components
- **`skilled_loop_real_path` in `.skilled/bin/skilled-loop-shell.sh`**: defined at line 23, and its `while [ -L "$entry" ]` walk starts at line 28. It gains a hop counter and returns 1 past 40 hops.
- **The replay classifier in `.skilled/bin/skilled-loop`**: the second classify loop starts at line 900, reads `option_value_attached` at line 920 and opens the value-taking branch at line 956. That branch gains the attached-value test.
- **The document set**: `.skilled/hooks/session-relaunch/claude/README.md`, `.skilled/bin/README.md`, `README.md`, `.skilled/skills/system-spec-kit/README.md`, the session-relaunch feature entry, the feature catalog and the doctor README restate the guard, replay, trust and window rules.
- **The routing and shape metadata**: the two `graph-metadata.json` files add intent signals and `.skilled/skills/sk-doc/sk-create-changelog/` carries the raised ceilings.

### Data Flow
A finding names a file, a line and the behavior that changed. A worker writes the failing test for a producer, adds the smallest branch that passes it, then edits each document or metadata file against the wording in `.skilled/hooks/session-relaunch/README.md`. Verification runs the relaunch suite, the ten probes, the changelog checker, the env check and the strict validator.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Finding classes: `literal` for the two producers, the guard list, the setup window row and the cli-opencode bullets. `judgment` for the trust sentences, the replay sentence, the feature entry, the playbook scenarios, the routing signals and the env rows. `operator decision` for the changelog ceilings and the parent goal count.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `skilled_loop_real_path` in `.skilled/bin/skilled-loop-shell.sh` | Owns the symlink walk at line 28 with no hop bound | update | `node --test --test-name-pattern 'symlink cycle' .skilled/hooks/session-relaunch/tests/skilled-loop-shell.test.cjs` prints `# pass 2` and `# fail 0` |
| The replay classifier in `.skilled/bin/skilled-loop` | Sets `option_value_attached` at lines 907 and 913 and reads it only at line 920 | update | `rg -c 'option_value_attached == 0' .skilled/bin/skilled-loop` prints 2 |
| `.skilled/hooks/session-relaunch/tests/skilled-loop-shell.test.cjs` | Spawns the shim under bash and zsh and resolves wrapper paths | update | `node --test .skilled/hooks/session-relaunch/tests/skilled-loop-shell.test.cjs` exits 0 |
| `.skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs` | Spawns the wrapper with stub runtimes and reads the replayed arguments | update | `node --test .skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs` exits 0 |
| The seven stale documents | Restate the guard, replay, trust and setup rules | update | The stale-fragment `rg` in REQ-003 prints nothing |
| `.env.example` and `.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md` | Describe the operator switches and the window fallback | update | `rg -c 'SKILLED_LOOP_TRUSTED_CHECKOUTS' .env.example .skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md` prints 1 for each file |
| `.skilled/commands/assets/local-skilled-alignment/surface-map.yaml` | Lists the platform-set tokens the env check ignores | update | `rg -n -e '^    - BASH_VERSION$' -e '^    - ZSH_VERSION$' .skilled/commands/assets/local-skilled-alignment/surface-map.yaml` prints 2 lines |
| `.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-relaunch-claude.md` | Holds the Claude relaunch scenarios | update | `rg -l 'reason=window-unknown' .skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-relaunch-claude.md` prints the path |
| The cli-opencode skill and playbook | State the layer 1 exemption and carry the version | update | `rg -n '^version: 1.5.10.0$' .skilled/skills/cli-external-orchestration/cli-opencode/SKILL.md` prints one line |
| The two `graph-metadata.json` files | Hold the advisor intent signals and key files | update | `node .skilled/commands/assets/local-skilled-alignment/run-probes.cjs --probes /Users/michelkerkmeester/.local/state/local-skilled-alignment/351-session-relaunch-review-remediation/20261112T152419Z/probes-input.json` prints `pass=8 fail=2`, the two misses being the read-only explainer probes P04 and P06 |
| `.skilled/skills/sk-doc/sk-create-changelog/` | Holds the three ceilings and the documents that repeat them | update | `python3 .skilled/skills/sk-doc/sk-create-changelog/scripts/check_changelog_shape.py .skilled/changelog/skilled/v4.0.2.1.md` prints `PASS` |
| `.skilled/changelog/skilled/v4.0.2.1.md` | Holds the `## Session Handover` section from `9af041968a` | unchanged | `rg -n '^## Session Handover$' .skilled/changelog/skilled/v4.0.2.1.md` prints line 168 |
| The parent goal at `specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/goal.md` | States the phase folder count | update by the orchestrator only | `rg -n 'All 36 phase folders' specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/goal.md` prints one line |

Required inventories:
- Same-class producers: `rg -n 'while \[ -L "\$entry" \]|option_value_attached' .skilled/bin/skilled-loop-shell.sh .skilled/bin/skilled-loop` prints four lines, the walk at line 28 and the three classifier lines.
- Consumers of changed symbols: `rg -n 'SKILLED_LOOP_TRUSTED_CHECKOUTS' .skilled .env.example README.md --glob '*.sh' --glob '*.md'` prints the shim reader and every document that names the variable.
- Matrix axes: for the hop bound, hop count 0, 1, 40, 41 and a two-link cycle, each under bash and zsh. Minimum rows: 10. For the replay, an attached short value, a separate short value, an attached long value and a denied attached value, each under `claude` and `cursor`. Minimum rows: 8.
- Algorithm invariant: every acyclic chain of 40 hops or fewer resolves to the same path as before the change, and hop 41 returns 1. The replay consumes a following word only when the option takes a value and that value is not attached, so no prompt is ever swallowed.
- Hostile env variant: the shim test runs each case with `BASH_VERSION` and with `ZSH_VERSION` set by its own shell, so both platform branches of the source-file lookup are exercised.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

- Setup reads the two producers and the seven documents, and confirms each reported line.
- Implementation writes the two failing tests first, then the two producer fixes, then every document, env, playbook, routing and ceiling edit.
- Verification runs the relaunch suite, the ten probes, the changelog checker, the env check and the strict validator.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | The cycle case in `.skilled/hooks/session-relaunch/tests/skilled-loop-shell.test.cjs` and the attached-value case in `.skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs` | `node --test` with `node:assert/strict` |
| Integration | Every relaunch test file, the ten advisor probes, the env check and the changelog checker | `node --test`, `run-probes.cjs`, `check-env-tokens.cjs`, `check_changelog_shape.py` |
| Manual | N/A: this phase ships no live run, and the new playbook scenarios are documentation that an operator runs later | - |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phases 001 to 007, Complete and committed | Internal | Green | The documents and the producers would be read against the wrong base |
| `node` with `node --test` | Internal | Green | Neither failing-first test can run and the handoff criterion cannot be met |
| `bash` 3.2 or newer and `zsh` | Internal | Green | The shim cases and the `bash -n` and `zsh -n` checks cannot run |
| `python3` | Internal | Green | The changelog ceiling cannot be proved |
| The advisor CLI with a trusted rebuild | Internal | Green | The ten probes cannot be rerun after the signal edits |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a relaunch test fails outside the two new cases, the changelog checker regresses, or a probe that passed before the signal edits now fails.
- **Procedure**: revert the phase commit, then run `node --test .skilled/hooks/session-relaunch/tests/*.test.cjs` and `python3 .skilled/skills/sk-doc/sk-create-changelog/scripts/check_changelog_shape.py .skilled/changelog/skilled/v4.0.2.1.md` and confirm both pass.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | - | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | Packet close |
<!-- /ANCHOR:phase-deps -->

---
