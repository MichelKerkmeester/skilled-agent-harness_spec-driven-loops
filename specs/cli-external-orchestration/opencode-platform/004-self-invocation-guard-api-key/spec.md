---
title: "Feature Specification: Self-invocation guard ignores OPENCODE_API_KEY"
description: "Layer 1 of the cli-opencode self-invocation guard read every OPENCODE_ variable as proof of an OpenCode session, so an exported OpenCode Go provider key refused every dispatch from another runtime. The guard now skips that one variable."
trigger_phrases:
  - "self invocation guard api key"
  - "self invocation guard ignores opencode api key"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Self-invocation guard ignores OPENCODE_API_KEY

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-12 |
| **Branch** | `worktrees/351-session-relaunch-review-remediation` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Layer 1 of the cli-opencode self-invocation guard treats any `OPENCODE_*` environment variable as proof that the caller already runs inside OpenCode. `OPENCODE_API_KEY` is the OpenCode Go provider key, which an operator exports in a shell profile, so it is set in every runtime on that machine. A dispatch from Claude Code is then refused although no OpenCode session exists, and the operator has to override the guard by hand, which happened on 2026-11-12.

### Purpose
The guard trips on a session marker and never on the provider key alone.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
# The guard line on the base commit 5dafa313e8, run with only the provider key set
$ git show 5dafa313e8:.skilled/skills/cli-external-orchestration/cli-opencode/SKILL.md | grep -nF "grep -q '^OPENCODE_'"
94:env | grep -q '^OPENCODE_' && echo "ERROR: Already inside OpenCode session"
$ env -i PATH=/usr/bin:/bin OPENCODE_API_KEY=x /bin/sh -c "env | grep -q '^OPENCODE_' && echo 'ERROR: Already inside OpenCode session'"
ERROR: Already inside OpenCode session
exit=0
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Change the Layer 1 shell check so it drops `OPENCODE_API_KEY` before it looks for an `OPENCODE_` variable.
- Change the Layer 1 Python reference check the same way.
- Restate the rule in every document of the cli-opencode skill that describes or runs Layer 1, and in the one comparison row of the cli-claude-code skill.
- Add one step to playbook scenario CO-008 that proves the key alone does not trip the guard.

### Out of Scope
- `OPENCODE_BIN` - `SKILL.md` documents it as an operator override of the binary path and it still trips Layer 1. It is a second variable with its own reason, so it is named in the summary and left alone.
- Layers 2 and 3 - process ancestry and the state lock are unchanged and still catch a real session.
- Enforcing code - the guard is a documented contract the calling AI follows. No script runs it, and this packet adds none.
- A skill changelog entry and version raise - the repository records those in a later `docs(changelog)` commit.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/cli-external-orchestration/cli-opencode/SKILL.md` | Modify | The guard line in the prerequisite block and the rule sentence |
| `.skilled/skills/cli-external-orchestration/cli-opencode/ROUTER.md` | Modify | The Layer 1 bullet |
| `.skilled/skills/cli-external-orchestration/cli-opencode/README.md` | Modify | The two descriptions of Layer 1 |
| `.skilled/skills/cli-external-orchestration/cli-opencode/references/self-invocation-guard.md` | Modify | The shell check, the Python check and the reason |
| `.skilled/skills/cli-external-orchestration/cli-opencode/references/integration-patterns.md` | Modify | The two descriptions of Layer 1 |
| `.skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/manual-testing-playbook.md` | Modify | The precondition command and two precondition sentences |
| `.skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/cli-invocation/base-non-interactive-invocation.md` | Modify | The precondition and the CO-001 command |
| `.skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/external-dispatch/from-claude-code.md` | Modify | The precondition and the CO-006 command |
| `.skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/external-dispatch/self-invocation-refusal.md` | Modify | The CO-008 command and the new key-only step |
| `.skilled/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/cross-repo-cross-server/self-invocation-guard-nested.md` | Modify | The CO-031 command |
| `.skilled/skills/cli-external-orchestration/cli-claude-code/references/claude-tools.md` | Modify | The comparison row that describes the OpenCode guard |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The documented Layer 1 shell check does not trip when `OPENCODE_API_KEY` is the only `OPENCODE_` variable | `env -i PATH=/usr/bin:/bin OPENCODE_API_KEY=x /bin/sh -c "env \| grep -v '^OPENCODE_API_KEY=' \| grep -q '^OPENCODE_' && echo TRIPPED \|\| echo clear"` prints `clear` |
| REQ-002 | The check still trips on a session marker, with or without the key | The same command with `OPENCODE_CONFIG_DIR=/tmp/fake` added prints `TRIPPED`, and so does `OPENCODE_CONFIG_DIR=/tmp/fake` alone |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | A variable that only starts with the key's name still trips | The same command with only `OPENCODE_API_KEY_FILE=x` prints `TRIPPED` |
| REQ-004 | No document under the skill hub states the guard without the exemption | `rg -n "grep -q '\^OPENCODE_'" .skilled/skills/cli-external-orchestration --glob '!**/benchmark/**' \| rg -v OPENCODE_API_KEY` prints no line |
| REQ-005 | Every edited document still passes the document validator | `python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py <file>` prints `VALID` for each of the eleven files |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: With `OPENCODE_API_KEY` exported and no OpenCode session, the Layer 1 check prints nothing and a dispatch from Claude Code needs no override.
- **SC-002**: With `OPENCODE_CONFIG_DIR` set, the Layer 1 check prints its error whether or not the key is set.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The calling AI follows the documented check | The guard has no enforcing code, so a caller that reads an old copy keeps the old behavior | Every statement of Layer 1 in the hub carries the exemption, which REQ-004 checks |
| Risk | An OpenCode session that sets only `OPENCODE_API_KEY` passes Layer 1 | Low | Layer 2 reads the process ancestry and Layer 3 the state lock, and both are unchanged. OpenCode also sets `OPENCODE_CONFIG_DIR` on session start, per the skill README |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. The operator chose the fix on 2026-11-12: "Fix it now", as a separate small packet.
<!-- /ANCHOR:questions -->

---

