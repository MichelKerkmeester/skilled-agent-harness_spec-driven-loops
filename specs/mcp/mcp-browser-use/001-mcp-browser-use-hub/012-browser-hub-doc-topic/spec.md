---
title: "Feature Specification: Phase 12: browser-hub-doc-topic"
description: "/local-doc-alignment had no topic for the browser hub, so the hub's docs could not be checked against its code in one run. This phase adds an mcp-browser-use topic and runs it with Devin lanes."
trigger_phrases:
  - "browser hub doc topic"
  - "phase 12 browser hub doc topic"
  - "mcp-browser-use doc alignment topic"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 12: browser-hub-doc-topic

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-11-23 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 12 of 12 |
| **Predecessor** | 011-bdg-eval-port-note |
| **Successor** | None |
| **Handoff Criteria** | `/local-doc-alignment mcp-browser-use` writes a report |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 12** of the mcp-browser-use hub program. The operator asked for a doc alignment check of the hub after 011 shipped, and chose to add a topic for it rather than reuse an unrelated one.

**Scope Boundary**: one entry in the private, git-ignored `topics.json` of `/local-doc-alignment`, and this packet with its parent rows. The alignment run's findings are reported to the operator and not fixed here.

**Dependencies**:
- The `devin` lane preset that `specs/commands/007-alignment-lane-runner/002-devin-lane` adds, because the operator asked for Devin lanes.

**Deliverables**:
- An `mcp-browser-use` topic in `.skilled/commands/assets/local-doc-alignment/topics.json`.
- One `/local-doc-alignment mcp-browser-use --lanes=devin` report.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`/local-doc-alignment` checks only the topics listed in its `topics.json`, and none of the eight covered the browser hub. Asking it to check the hub stopped at its unknown-topic error.

### Purpose
One `/local-doc-alignment mcp-browser-use` run checks every doc that names the hub or its modes against the hub's own files.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ node -e 'console.log(Object.keys(require("./.skilled/commands/assets/local-doc-alignment/topics.json").topics).join(", "))'
session-handover, changelog-spec-folder-line, expansive-depth, advisor-pasted-reply, advisor-lane-removal, opencode-v2-only, overlay-layout, playbook-run-recording
```
The list was read before the topic was added. After it, the scope step printed `topic mcp-browser-use: 241 docs in 4 lanes, 4 checks, code roots 1`.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add an `mcp-browser-use` topic whose code root is `.skilled/skills/mcp-browser-use` and whose terms are the hub id, the three mode ids, `browser-debugger-cli` and the bdg subcommands.
- Give it four checks: the hub check and the playbook validator for each mode.
- Run it once with `--lanes=devin` and report the findings.

### Out of Scope
- Fixing what the run finds. The findings go to the operator, who decides on any follow-up.
- The lane runner. Its Devin kind belongs to `specs/commands/007-alignment-lane-runner/002-devin-lane`.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/commands/assets/local-doc-alignment/topics.json` | Modify | The `mcp-browser-use` topic, git-ignored |
| `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/` | Modify | Phase map row, handoff row and goal binding for 012 |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The scope step accepts the topic | `doc-alignment.cjs scope --topic mcp-browser-use` prints `STATUS=OK` |
| REQ-002 | A `--lanes=devin` run writes its report | The run folder holds `report.md` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | The topic's four checks run | The run's `battery.json` holds four rows |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `/local-doc-alignment mcp-browser-use` runs where it stopped at the unknown-topic error before.
- **SC-002**: The report lists the hub's doc and code disagreements, or none.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The `devin` lane preset | Without it the run needs another preset | It is built and tested in 007/002 first |
| Risk | The scope splits by path, so one lane holds 109 of the 241 docs | Med: that lane may time out | Each lane has a 3600-second timeout, and a failed lane is recorded while the run goes on |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---
