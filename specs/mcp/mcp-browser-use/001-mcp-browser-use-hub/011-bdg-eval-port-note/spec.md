---
title: "Feature Specification: Phase 11: bdg-eval-port-note"
description: "In bdg 0.6.10, dom eval fails with Session target not found when the session runs on a port other than 9222, and the Chrome DevTools mode said nothing about it. This phase adds one troubleshooting entry with the cause and two fixes."
trigger_phrases:
  - "bdg eval port note"
  - "phase 11 bdg eval port note"
  - "bdg dom eval session target not found"
  - "bdg non default port eval"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 11: bdg-eval-port-note

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
| **Branch** | `worktrees/526-bdg-eval-port-note` |
| **Parent Spec** | ../spec.md |
| **Phase** | 11 of 11 |
| **Predecessor** | 010-mcp-tooling-browser-pointers |
| **Successor** | None |
| **Handoff Criteria** | The Chrome DevTools troubleshooting guide names the `Session target not found` error with both fixes, and the browser hub check passes |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 11** of the mcp-browser-use hub program. The RD-006 live run, an sk-code scenario that drives the Chrome DevTools mode, hit a `bdg dom eval` failure when the bdg session ran on port 9333. Headless repros traced it to bdg itself, not to the mode's instructions.

**Scope Boundary**: one new entry in the Chrome DevTools mode's `references/troubleshooting.md`, that file's version and trigger phrases, the mode's `SKILL.md` version and changelog, and this packet with its parent amendments. No bdg code, routing signal or advisor file changes.

**Dependencies**:
- bdg (`browser-debugger-cli`) 0.6.10, the version the repros ran.

**Deliverables**:
- A troubleshooting entry for `Session target not found` from `bdg dom eval`, with the cause and two fixes.
- Mode changelog `mcp-chrome-devtools` 1.0.27.0.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
An agent that starts bdg with `-p` on any port other than 9222 cannot read page values with `bdg dom eval`. The command exits with code 83 and says the tab may have been closed, which sends the agent to restart a session that is fine. The mode's docs did not mention the error.

### Purpose
An agent that sees `Session target not found` from `bdg dom eval` finds the cause and a working fix in the Chrome DevTools mode's troubleshooting guide.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ bdg --headless -q -p 9333 -u "$S/profile" "file://$S/index.html"
Session started: file:///…/bdg-repro/index.html
$ bdg dom eval 'getComputedStyle(document.querySelector(".t")).color'
Error: Session target not found (tab may have been closed)
Start a new session with: bdg <url>
exit=83
$ grep -n "default: 9222\|verifyTargetExists(metadata, port)" /opt/homebrew/lib/node_modules/browser-debugger-cli/dist/commands/dom/index.js
478:        const portRule = positiveIntRule({ min: 1, max: 65535, default: 9222 });
480:        await verifyTargetExists(metadata, port);
```
The first two commands are the headless repro from the sending session on 2026-11-23, with the scratchpad path shortened. `bdg -p 9333 dom eval` and `bdg dom eval -p 9333` gave the same error and exit 83 in that run. The same page on a session started without `-p` returned `rgb(30, 58, 138)`, and `bdg cdp Runtime.evaluate` on the 9333 session returned that value too. The grep runs today without a browser.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add one entry to `references/troubleshooting.md` §6 that quotes the error, states the cause and shows how to read the session's port.
- Give two fixes: start the session on 9222 when it is free, otherwise read values with `bdg cdp Runtime.evaluate --params '{…,"returnByValue":true}'`.
- Bump the guide to 1.0.5.0 and the mode's `SKILL.md` to 1.0.27.0, with a changelog entry at that version.

### Out of Scope
- A fix inside bdg: it is a third-party package, and the defect is reported here, not patched.
- The theory that the root program takes `-p` wherever it appears: it is inferred from `commands/start.js:16` and not proven, so the guide does not state it.
- Other entries in the same guide: §5 suggests `CHROME_DEBUGGING_PORT`, which bdg 0.6.10 never reads, and §7 passes JSON as a second positional argument where `bdg cdp` takes `--params`. Both are recorded for the operator and left unchanged.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/mcp-browser-use/mcp-chrome-devtools/references/troubleshooting.md` | Modify | New §6 entry, version 1.0.5.0, one trigger phrase |
| `.skilled/skills/mcp-browser-use/mcp-chrome-devtools/SKILL.md` | Modify | Version 1.0.27.0 |
| `.skilled/skills/mcp-browser-use/mcp-chrome-devtools/changelog/v1.0.27.0.md` | Create | Record the note |
| `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/` | Modify | Phase map row, handoff row and goal binding for 011 |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The guide names the error and both fixes | `rg -c 'Session target not found\|returnByValue' .skilled/skills/mcp-browser-use/mcp-chrome-devtools/references/troubleshooting.md` prints 3 |
| REQ-002 | `parent-skill-check.cjs .skilled/skills/mcp-browser-use` passes | The output line `OK: parent-skill-check — all hard invariants passed, 0 warnings`, and exit 0 |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | The mode's `SKILL.md` version matches its newest changelog entry | The hub check's `13d-packet-version` line passes for 3 modes |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A search of the guide for `Session target not found` lands on an entry that names the cause and both fixes.
- **SC-002**: The browser hub check and strict validation of this packet and its parent pass.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | bdg 0.6.10 | A later bdg release may read the session's port, and the entry would then describe a fixed bug | The entry names 0.6.10 in its symptoms line |
| Risk | The `bdg cdp` fix was not rerun after the edit | A changed output shape would break the `jq` path | The path matches the JSON the sending session saved from `bdg cdp Runtime.evaluate` on the 9333 session |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. Why `-p` on `dom eval` does not reach its port option is inferred, not confirmed, and the guide does not depend on the answer.
<!-- /ANCHOR:questions -->

---
