---
title: "Feature Specification: Phase 22: vibe-hook-playbook-and-live-scenarios"
description: "Vibe registers 18 hook entries, but its manual testing playbook has a conversation scenario for one of them, and the shared conversation runner cannot drive Vibe at all. This phase adds a Vibe adapter to the runner, writes one conversation scenario per hook, hook part, mirror and the renderer, runs every scenario live, then runs the local skilled alignment check over the branch and fixes what it confirms."
trigger_phrases:
  - "vibe hook playbook and live scenarios"
  - "phase 22 vibe hook playbook and live scenarios"
  - "vibe conversation scenarios"
  - "vibe hook playbook coverage"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 22: vibe-hook-playbook-and-live-scenarios

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-11-14 |
| **Branch** | `worktrees/383-mistral-vibe-runtime` |
| **Parent Spec** | ../spec.md |
| **Phase** | 22 of 22 |
| **Predecessor** | 021-vibe-hook-docs-correction |
| **Successor** | None |
| **Handoff Criteria** | Every inventory row has a scenario or a recorded reason, every scenario has a live verdict with no FAIL left, and the alignment recheck shows no open in-scope finding |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 22** of the Mistral Vibe runtime mode build specification.

**Scope Boundary**: The Vibe playbook's hook coverage, a Vibe adapter in the shared conversation runner, the live runs of every new scenario, and one local skilled alignment pass over the branch with its confirmed fixes. No new hook behavior beyond the fixes a failing scenario or a confirmed finding requires.

**Dependencies**:
- Phases 013 to 020: every hook this phase tests must be built and registered in `.vibe/hooks.toml`.
- Phase 021 (`021-vibe-hook-docs-correction`): the corrected `guards-and-hooks.md` the inventory reads its plugin classification from. Phase 021 hands its playbook task to this phase.

**Deliverables**:
- A `vibe` adapter in the shared conversation runner, with tests and one live pass of the runner's own sample.
- One conversation scenario per inventory row that lacks one, under a new playbook category, and its section in the root playbook.
- A verdict table with one live row per scenario.
- A local skilled alignment run, its triage, the confirmed fixes and a recheck.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`.vibe/hooks.toml` registers 18 hook entries, and the Vibe playbook's 25 scenarios cover only the goal slice as a live conversation; the spec-gate and hard-rule rows are test-suite runs, and 14 entries are named in no scenario at all (Measured Behavior). The shared conversation runner that plays a scenario into a live session drives five runtimes and not Vibe, so no Vibe hook can be proven across turns, questions or a compaction today.

### Purpose
Every Vibe hook, hook part, generated mirror and the hooks renderer has a conversation scenario that a live Vibe session passed, and the branch carries no open in-scope alignment finding.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ rg -c '^\[\[hooks\]\]' .vibe/hooks.toml
18
$ for h in $(grep '^name = ' .vibe/hooks.toml | sed 's/name = //;s/"//g'); do printf '%s %s\n' "$h" "$(rg -l --fixed-strings "$h" .skilled/skills/cli-external-orchestration/cli-mistral-vibe/manual-testing-playbook | wc -l | tr -d ' ')"; done
spec-gate-classify 1
turn-start 0
turn-end 0
spec-gate 3
env-secret-guard 0
dispatch-preflight 0
overlay-guard 0
mcp-route-guard 0
git-message-gate 0
deep-loop-guard 0
post-edit-quality 0
dist-freshness-edit 0
dist-freshness-shell 0
classifier-injection-screen 0
compaction-post-tool 0
decision-capture-ask 0
session-start 3
session-cleanup-end 0
$ node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --package .skilled/skills/cli-external-orchestration/cli-mistral-vibe/manual-testing-playbook | tail -1
PASS package=cli-external-orchestration/cli-mistral-vibe tier=FAIL_CLOSED scenarios=25 categories=9 operator=25 routing_gold_excluded=0 violations=0 warnings=0
$ node -e "console.log(require('./.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs').CONVERSATION_RUNTIMES.join(','))"
claude-code,opencode,codex,pi,devin
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Write the inventory: one row per `[[hooks]]` entry, per turn-start and turn-end part, per generated mirror, for the renderer and for the relaunch manual tier, plus one row per plugin in the `guards-and-hooks.md` section 4 classification, each mapped to a scenario id or a recorded reason.
- Add a `vibe` adapter to the shared conversation runner, so a scenario can drive an interactive Vibe session with the rendered home hooks and answer `ask_user_question` the way it answers the other runtimes' question widgets.
- Write one conversation scenario per inventory row that lacks one, 26 files under a new `hook-scenarios/` category, IDs `VIB-HK-001` to `VIB-HK-026`, and add the category's section to the root playbook.
- Run every new scenario live through the runner with `--runtime vibe`, record one verdict per scenario, fix the cause of each FAIL and run it again.
- Run `/local-skilled-alignment:auto` over the branch with the `opencode-go` lane preset, triage its findings, fix the confirmed in-scope ones and run its recheck.

### Out of Scope
- New hook behavior - this phase proves what 013 to 020 built; a code change lands only to fix a failing scenario or a confirmed finding.
- The automatic relaunch tier - phase 019 left it out of scope, so `VIB-HK-026` drives the manual tier only.
- Scenarios for the plugin rows section 4 marks "not needed" - they have no Vibe surface to drive; the inventory records the reason.
- Committing or pushing - the operator decides when the branch is committed.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs` | Modify | Add `vibe` to `CONVERSATION_RUNTIMES` |
| `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs` | Modify | Add the `vibe` adapter |
| `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/tests/run-conversation-scenario.test.cjs` | Modify | Adapter cases |
| `.skilled/skills/cli-external-orchestration/cli-mistral-vibe/manual-testing-playbook/hook-scenarios/*.md` | Create | 26 conversation scenarios, `VIB-HK-001` to `VIB-HK-026` |
| `.skilled/skills/cli-external-orchestration/cli-mistral-vibe/manual-testing-playbook/manual-testing-playbook.md` | Modify | The `hook-scenarios` section and its cross-reference rows |
| Files a failing scenario or a confirmed alignment finding names | Modify | Only the fix the verdict or the finding requires, each named in `tasks.md` when it is added |
| `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs`, `validate-playbook-package.cjs`, their tests and `references/conversation-scenarios.md` | Modify | Amendment of 2026-11-15, after the operator asked for every scenario as a real conversation: a `launch_setup` script key that runs after the runner prepares the launch and before the subject starts, so a scenario can change the Vibe home it needs |
| `.vibe/plugins/repo-guards/fixtures/journal-check.cjs`, `.vibe/plugins/repo-guards/fixtures/mcp-route-guard/stdio-server.cjs` | Create | Amendment of 2026-11-15: an ordered journal check for the scenario turns, and a native stdio MCP server for the route guard |
| `.skilled/skills/sk-code/sk-code-quality/scripts/check-dist-staleness.sh` and `tests/check-dist-staleness.test.sh` | Modify | Amendment of 2026-11-15: `--all` honors `SPECKIT_DIST_WORKSPACE_ROOT` as the single-file mode already did, so a scenario judges a stale scratch build instead of the checkout. This changes every caller that sets the variable, including the session-start hook on each runtime |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every inventory row has a scenario or a reason | `scratch/inventory.md` has one row per hook entry, part, mirror, the renderer, relaunch and each section 4 plugin, and no row has an empty scenario-or-reason cell |
| REQ-002 | The runner drives Vibe | `CONVERSATION_RUNTIMES` includes `vibe`, the runner tests print `fail 0`, and the runner's own sample scenario passes live with `--runtime vibe` |
| REQ-003 | Every new scenario has a live verdict | `scratch/verdicts.md` has 26 rows, each PASS, FAIL or OPERATOR-ONLY with an evidence folder, and no FAIL is left after the fix-and-rerun step |
| REQ-004 | The playbook stays valid | The playbook validator prints `PASS` for the package with 51 scenarios and 0 violations |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | OPERATOR-ONLY is used only where no runner path exists | Each OPERATOR-ONLY row names why the runner cannot drive it and links a written procedure; none is a scenario the runner can drive |
| REQ-006 | The alignment run is triaged and its confirmed findings are fixed | `scratch/alignment-triage.md` sorts every finding into confirmed in scope, out of scope or overturned, and the `--recheck` run lists no confirmed in-scope finding as still open |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `rg -c 'VIB-HK-' .skilled/skills/cli-external-orchestration/cli-mistral-vibe/manual-testing-playbook/manual-testing-playbook.md` prints at least 26, and the playbook validator prints `PASS` with `scenarios=51`.
- **SC-002**: `rg -c '\| FAIL \|' scratch/verdicts.md` exits 1.
- **SC-003**: the alignment recheck's `recheck.md` shows no confirmed in-scope finding under "still open".
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phases 013 to 021 built | High: a scenario for an unbuilt hook can only fail | Setup records each predecessor's status and stops on any phase not Complete or In Progress with only operator tasks open |
| Risk | The runner refuses a scratch project inside the repository, and Vibe's repository hooks load only from a trusted checkout or the rendered home | High: the hooks would silently not load | The adapter launches Vibe with a `VIBE_HOME` it renders with `render-home-hooks.cjs` and the repository config copy, and every scenario's first check reads the journal for a hook binding |
| Risk | An interactive Vibe TUI's ready, busy and question screens are unprobed | Med | The adapter starts unprobed, a live probe of the runner's sample sets its patterns, and the adapter is marked probed only after that pass |
| Risk | `mcp-route-guard` needs an MCP server configured in the session | Med | The scenario's `launch_setup` registers the local fixture server in the session's Vibe home |
| Risk | Keyed runs spend the Mistral plan | Low | One live pass per scenario, and reruns only for a FAIL |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- RESOLVED: the runner's restart action resumes a Vibe session. `VIB-HK-021`, `VIB-HK-022` and `VIB-HK-024` restart and pass live.
- RESOLVED: a mirrored prompt in `.vibe/prompts` runs by name only through an agent profile whose `system_prompt_id` names it, read when the session starts; Vibe 3.1.2 treats a top-level `system_prompt_id` as an experiment variant and has no command loader. `VIB-HK-025` writes that profile with `launch_setup`, selects it with `default_agent`, and judges the session's system input.
<!-- /ANCHOR:questions -->

---
