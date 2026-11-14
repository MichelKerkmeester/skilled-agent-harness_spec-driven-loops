---
title: "Feature Specification: Phase 5: alignment-report-fixes"
description: "An alignment check of phases 1 to 4 found ten places where the shipped change is out of step with a connected surface: the registry step is unscoped, its changelog entry fails the shape checker, and the command, playbook, READMEs, routing vocabulary and release notes never learned about it. This phase fixes each one."
trigger_phrases:
  - "alignment report fixes"
  - "phase 5 alignment report fixes"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 5: alignment-report-fixes

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-14 |
| **Branch** | `worktrees/384-agent-alignment-follow-ups` |
| **Parent Spec** | ../spec.md |
| **Phase** | 5 of 5 |
| **Predecessor** | 004-agent-authoring-registry-step |
| **Successor** | None |
| **Handoff Criteria** | Every finding in `scratch/alignment-report/findings.json` has a shipped fix with a command output behind it, and a re-check of the alignment run lists none of them as still open |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 5** of the agent alignment follow-ups packet.

**Scope Boundary**: The surfaces the alignment report names: the `sk-create-agent` packet, the `/create:agent` workflow assets, the `@markdown` agent's write boundary, the `sk-doc` hub's routing vocabulary for the agent mode, one line of the DeepSeek Harness reference, the root README's `/create:agent` entry, the open root release notes and the four trigger-index outputs. The roster script, the registry's existing records and the agent template do not change.

**Dependencies**:
- Phases 3 and 4, whose shipped change the report checked.
- The alignment run of 2026-11-14 on the range `57531ae8bc..869d4391bf`, copied to `scratch/alignment-report/`.

**Deliverables**:
- The registry step scoped to agents under `.skilled/agents/`, in the skill and in a new packet version
- A `v1.0.8.0` changelog entry that passes the shape checker and describes what shipped
- A `/create:agent` workflow that adds the registry record and runs the roster check
- A playbook scenario, README text and routing vocabulary for the registry step
- The harness tool list with `read`, the release notes naming `sk-create-agent`, and regenerated trigger-index outputs
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`/local-skilled-alignment` ran on the phase 1 to 4 change on 2026-11-14 and reported eleven findings, ten distinct. Two are P1. Step 13 of the creation workflow orders a registry record for every new agent, but the roster script reads only `.skilled/agents/`, so a record for a Claude-only agent fails the check the step was added to pass. The `v1.0.8.0` changelog entry fails `check_changelog_shape.py` with exit 1 and says step 14 kept its wording when it gained a sentence. The rest are P2: the `/create:agent` workflow, the playbook, the skill README, the root README and the open release notes never name the registry step, a prompt that names only the registry routes to `sk-code`, the harness reference lists four tools and leaves out `read`, and the trigger-index outputs carry the manifest hash from before the last changelog edit.

### Purpose
Each finding in the report ends as a shipped fix, and a re-check of the same run lists none of them as still open.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ python3 .skilled/skills/sk-doc/sk-create-changelog/scripts/check_changelog_shape.py .skilled/skills/sk-doc/sk-create-agent/changelog/v1.0.8.0.md; echo "exit=$?"
FAIL .skilled/skills/sk-doc/sk-create-agent/changelog/v1.0.8.0.md
  [spec-line] line 17: drop the (Level 1) label, the line carries paths only
  [sentence-max] line 15: a sentence of 26 words, ceiling 22. Split it
  [sentence-max] line 23: a sentence of 34 words, ceiling 22. Split it
  [sentence-mean] 13.4 words a sentence on average, ceiling 10. Use more, shorter sentences
SUMMARY files=1 pass=0 fail=1
exit=1
$ node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"add my agent to the agent registry"}' --format json
sk-code 0.232874, sk-doc 0.220741 (first two recommendations)
$ node .skilled/commands/assets/local-skilled-alignment/check-release-coverage.cjs --scope <run>/scope.json --repo .
MISSING release-notes sk-create-agent required by .skilled/skills/sk-doc/sk-create-agent/changelog/v1.0.8.0.md
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- B-1: scope steps 13 and 14 of the creation workflow to an agent under `.skilled/agents/`, and ship it as packet version 1.0.9.0 with its changelog entry
- C-1 and C-2: repair the `v1.0.8.0` changelog entry so the shape checker passes and the entry says step 14 gained a sentence
- D-1: add a registry step and the roster check to both `/create:agent` workflow files, and name the registry and the generated rosters in the `@markdown` agent's write boundary and command map
- B-3: add one playbook scenario that runs the roster check with and without a record
- C-4: name the registry step in the skill README and in the root README's `/create:agent` entry
- CR-2: add the registry phrase to the agent mode's routing vocabulary on every hub surface that carries it, and replay the report's two failing prompts. Roster phrases are added only if a replay shows they pull no unrelated prompt
- CR-1: add `read` to the harness tool list in `guards-and-hooks.md`
- C-3 and BAT-01: name `sk-create-agent` in the open root release notes
- A-1: regenerate the four trigger-index outputs from the final tree

### Out of Scope
- Changing `sync-agent-roster.cjs` to read `.claude/agents/` or to write a record itself - the report found the instruction wrong, not the script
- Moving the `v4.0.2.1` tag or publishing a release - the notes are extended and the tag stays where the operator put it
- A registry record for `.claude/agents/Explore.md` - it is a Claude-only agent the registry does not schedule
- The three operator answers that live only in the spec documents, and the removal of worktrees 377 and 384, which the operator owns

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/sk-doc/sk-create-agent/SKILL.md` | Modify | Steps 13 and 14, the keyword line and the version |
| `.skilled/skills/sk-doc/sk-create-agent/changelog/` | Modify, Create | Repair `v1.0.8.0.md`, add `v1.0.9.0.md` |
| `.skilled/skills/sk-doc/sk-create-agent/README.md` | Modify | The registry step in quick start, troubleshooting and verification |
| `.skilled/skills/sk-doc/sk-create-agent/manual-testing-playbook/` | Modify, Create | One scenario file and its rows in the root playbook |
| `.skilled/commands/create/assets/create-agent-auto.yaml`, `create-agent-confirm.yaml`, `create-agent-presentation.txt` | Modify | The registry step, the roster check and the report line |
| `.skilled/agents/markdown.md` and its runtime copies | Modify, Regenerate | The write boundary and the `/create:agent` row |
| `.skilled/skills/sk-doc/` hub routing files | Modify, Regenerate | The agent mode's vocabulary on each surface that carries it |
| `.skilled/skills/cli-external-orchestration/cli-deepseek-harness/references/guards-and-hooks.md` | Modify | The tool list |
| `README.md` | Modify | The `/create:agent` entry |
| `.skilled/changelog/skilled/v4.0.2.1.md` | Modify | The component paragraph |
| `.skilled/skills/system-spec-kit/runtime/` trigger-index outputs | Regenerate | The manifest hash |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Steps 13 and 14 of the creation workflow apply to an agent under `.skilled/agents/` only. | `rg -c 'For a new agent under .\.skilled/agents/.' .skilled/skills/sk-doc/sk-create-agent/SKILL.md` prints 1 |
| REQ-002 | Both `sk-create-agent` changelog entries pass the shape checker. | `python3 .skilled/skills/sk-doc/sk-create-changelog/scripts/check_changelog_shape.py` on `v1.0.8.0.md` and `v1.0.9.0.md` prints `pass=2 fail=0` |
| REQ-003 | The `/create:agent` workflow adds the registry record and runs the roster check, in both modes. | `rg -c 'sync-agent-roster' .skilled/commands/create/assets/create-agent-auto.yaml .skilled/commands/create/assets/create-agent-confirm.yaml` prints a count above 0 for each file |
| REQ-004 | The agent rosters and runtime copies agree after the `@markdown` edit. | `node .skilled/bin/sync-agent-roster.cjs --check` prints `agent-roster: OK` and `node .skilled/bin/check-agent-mirror-sync.cjs` exits 0 |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | A prompt that names only the registry reaches the agent mode. | `add my agent to the agent registry` and `the agent registry needs a record for my new persona` each return `sk-doc` first, and the report's thirteen probes still pass |
| REQ-006 | The playbook has a scenario for the roster check and its index links every scenario once. | `rg -c 'AGV-003' .skilled/skills/sk-doc/sk-create-agent/manual-testing-playbook/manual-testing-playbook.md` prints 3 or more, and the playbook validator exits 0 |
| REQ-007 | The skill README and the root README name the registry step. | `rg -c 'agent-registry' .skilled/skills/sk-doc/sk-create-agent/README.md` prints 1 or more, and the root README's `/create:agent` entry names the registry |
| REQ-008 | The open release notes name `sk-create-agent`. | `check-release-coverage.cjs` on a scope of this branch prints `missing=0` |
| REQ-009 | The harness reference lists `read` among the tool names. | `rg -c '.subagent., .read.' .skilled/skills/cli-external-orchestration/cli-deepseek-harness/references/guards-and-hooks.md` prints 1 |
| REQ-010 | The trigger-index outputs match a fresh generation. | `generate-trigger-index.mjs --check` exits 0 and prints no `manifest hash differs` note |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A re-run of the alignment battery on this branch reports no failing row.
- **SC-002**: Every finding id in `scratch/alignment-report/findings.json` has a row in `implementation-summary.md` with the command that shows it fixed.
- **SC-003**: `validate.sh --recursive --strict` on the packet prints `RESULT: PASSED` for the parent and all five children.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A new routing phrase pulls prompts away from another skill | Medium | Each new phrase is replayed against an out-of-domain prompt, and the advisor's regression suite runs before and after |
| Risk | The hub vocabulary change moves the routing corpus pin that the drift guard checks | Medium | The guard's command runs before and after the change, and a new failure is fixed in this phase or the phrase is dropped |
| Risk | The workflow files restate the registry step and drift from the skill | Low | The workflow step points at step 13 of the skill for the field list and holds only the command and the condition |
| Dependency | The `sk-doc` hub's version rule | A version that disagrees with its changelog fails CI | The packet version and its entry move together, and the hub's version check runs in verification |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Which findings to fix, and where to document them? Operator answer, 2026-11-14: all of them, the four outside the checked range included, in a new phase 5 of this packet.
- Who implements? Phases 1 to 4 used DeepSeek V4.1 Flash as the executor by operator instruction. This phase's edits are made by the orchestrating session directly, because each is a small text change it has to author in full either way. The alignment run and its re-check stay on DeepSeek V4.1 Flash.
- New release note or the open one? The `v4.0.2.1` notes are extended. The repository has moved that tag forward as fixes landed, and a new version file would announce a release nobody cut. The tag is not moved here.
<!-- /ANCHOR:questions -->

---
