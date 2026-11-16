---
title: "Feature Specification: Phase 12: opencode-model-carry"
description: "An OpenCode 2 hand-over hop started the next session on the project's pinned model instead of the model the sender was using, because OpenCode 2 has no model flag and nothing recorded the sender's model."
trigger_phrases:
  - "opencode model carry"
  - "phase 12 opencode model carry"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 12: opencode-model-carry

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill every row: level, priority, status, date and branch. Use the real branch name. GOOD: Priority P1. Status Draft. Branch `feat/rotate-logs-keep`. WEAK: Priority TBD. Status maybe. -->

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-16 |
| **Branch** | `worktrees/426-opencode-model-carry` |
| **Parent Spec** | ../spec.md |
| **Phase** | 12 of 12 |
| **Predecessor** | 011-opencode-pi-handover-parity |
| **Successor** | None |
| **Handoff Criteria** | Live OpenCode 2 hops start the receiver on the sender's model |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 12** of the Carry the sender's model across an OpenCode 2 hand-over hop specification.

**Scope Boundary**: [To be defined during planning]

**Dependencies**:
- [To be defined during planning]

**Deliverables**:
- [To be defined during planning]
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE
<!-- FILL: State the problem in two sentences: what breaks, and for whom. GOOD: The rotate-logs script never deletes old archives, so a host that copies `logs/archive` fills its disk. WEAK: The script has issues with output. -->

### Problem Statement
An OpenCode 2 hop relaunched the next session without the sender's model. OpenCode 2's root command has no model flag, so the wrapper dropped `-m`, and the hand-over never read the sender's model from OpenCode at all. The receiver started on the project config's pinned model, so a sender that had switched models lost that choice on every hop.

### Purpose
An OpenCode 2 hand-over hop starts the next session on the model the sender last answered on.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
<!-- FILL: Run the command this change affects and paste the command and its verbatim output. Quote every number the spec states about current behavior from this block. Write `N/A:` and a reason when no command applies. GOOD: `bash scripts/rotate-logs.sh` with 10 archives, then `ls logs/archive | wc -l` prints 10. WEAK: The script deletes old logs. -->
```text
$ opencode --help            # OpenCode 2.3.0, root command flags
  --standalone  --server  --auto  --continue, -c  --session, -s  --prompt      (no model flag)

$ oc-probe.sh content-sa 1 OPENCODE_CONFIG_CONTENT='{"model":"llmgateway/deepseek-v4.1-flash","agent":{"build":{...,"variant":"high"}}}'
  assistant model {'id': 'deepseek-v4.1-flash', 'providerID': 'llmgateway', 'variant': 'max'}   # model carried, variant not
$ oc-probe.sh content-svc 0 OPENCODE_CONFIG_CONTENT=<same>      # background service 2.1.4
  assistant model {'id': 'deepseek-v4.1-flash', 'providerID': 'llmgateway', 'variant': 'max'}
$ oc-probe.sh cfgfile-sa 1 OPENCODE_CONFIG=<file with the same model>
  assistant model {'id': 'deepseek-v4.1-flash-1017', 'providerID': 'llmgateway', 'variant': 'max'}  # project pin wins
$ oc-probe.sh variant-hash 1 OPENCODE_CONFIG_CONTENT='{"model":"llmgateway/deepseek-v4.1-flash#high",...}'
  assistant model {'id': 'deepseek-v4.1-flash', 'providerID': 'llmgateway', 'variant': 'max'}

Baseline before the change: the receivers of hops fix1 to fix3 in phase 011 ran on
llmgateway/deepseek-v4.1-flash-1017#max only because the repository opencode.json pins it.
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE
<!-- FILL: List three to five things this change does, each starting with a verb. Before you list a new file, module, option, layer or dependency, name what fails today without it, or drop it. GOOD: Add a `--keep <n>` option that deletes all but the newest n archives in `logs/archive/`. WEAK: Update the script and docs. -->

### In Scope
- Read the sender's model from the OpenCode 2 session store when the hand-over is prepared
- Start an OpenCode 2 relaunch on that model through `OPENCODE_CONFIG_CONTENT`, merged over the operator's own config text
- A live hop harness check that compares the sender's last model with the receiver's first

### Out of Scope
- Carrying the variant (effort) - no launch setting chooses it: OpenCode keeps the operator's variant per model in its own state, so it follows the model already
- The printed manual claim command - it is a command line the operator runs, and an environment value would not survive being copied
- Agents other than build and plan - those are the two OpenCode ships and the two the repository config pins

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/hooks/session-handover/lib/context-usage.cjs` | Modify | Read the latest assistant model from the OpenCode 2 store |
| `.skilled/hooks/session-handover/lib/relaunch-core.cjs` | Modify | Resolve the store path and add the OpenCode branch to the settings read |
| `.skilled/bin/skilled-loop` | Modify | Set `OPENCODE_CONFIG_CONTENT` with the carried model on an OpenCode 2 hop |
| `.skilled/hooks/session-handover/tests/skilled-loop-wrapper-model-effort.test.cjs` | Modify | Carry, merge, unparseable-text and store-read cases |
| `.skilled/hooks/session-handover/tests/skilled-loop-wrapper-harness.cjs` | Modify | Record and clear `OPENCODE_CONFIG_CONTENT` in the runtime stub |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
<!-- FILL: Write one testable requirement per row. Name the exact command or output. GOOD: With 10 archives, `bash scripts/rotate-logs.sh --keep 3` exits 0 and `ls logs/archive | wc -l` prints 3. WEAK: The option should work well. -->
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | An OpenCode 2 hop starts the receiver on the model the sender last answered on | Three live hops with the sender on `llmgateway/deepseek-v4.1-flash` score `modelCarry.kept: true`; a control hop with the carry off lands on the pinned `-1017` model |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | The operator's own `OPENCODE_CONFIG_CONTENT` survives a hop | The merge test keeps the operator's keys, and text that is not plain JSON is passed through unchanged |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
<!-- FILL: Write one measurable outcome per line. A command can prove it. GOOD: With 10 archives in `logs/archive`, `bash scripts/rotate-logs.sh --keep 3` leaves 3. WEAK: The feature is successful. -->

- **SC-001**: Three consecutive live OpenCode 2 hops keep the sender's non-default model and still score 5/5
- **SC-002**: The hand-over suite passes with no fewer tests than main (1115) plus the new cases
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
<!-- FILL: Name one dependency and one risk. Give each a concrete mitigation. GOOD: A script that reads `--keep` with no value could delete every archive. Mitigation: reject a missing value with exit 2 and test it. WEAK: There may be some risk. -->

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | OpenCode 2 reads `OPENCODE_CONFIG_CONTENT` above the project config | A later OpenCode that drops it starts the receiver on the configured model again | The read fails closed and the launch is unchanged, so a hop never breaks over it |
| Risk | The env value reaches shells the receiver runs and a nested OpenCode | Low | Only an OpenCode 2 hop sets it, and the next hop rebuilds it from the operator's saved text |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS
<!-- FILL: Write each open question as one line. Write `None` when nothing blocks. GOOD: Does a missing `--keep` value delete every archive? Decision: no, a missing value exits 2. WEAK: Edge cases are unclear. -->

- None. The spike settled the route: `OPENCODE_CONFIG_CONTENT` carries the model, and the variant cannot be set at launch.
<!-- /ANCHOR:questions -->

---


