---
title: "Feature Specification: Code Mode manual variable prefixes"
description: "Four registered manuals never reached Code Mode because their credential references did not match the prefixing rule the transport applies; this packet repairs the ones that a config or environment change can reach."
trigger_phrases:
  - "code mode variable prefix"
  - "utcp variable not found"
  - "manual registration credential"
  - "notion obsidian manual not registered"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/018-code-mode-variable-prefixes"
    last_updated_at: "2026-08-29T14:10:00Z"
    last_updated_by: "session"
    recent_action: "Repaired the notion, obsidian and clickup credential lookups"
    next_safe_action: "None; the two remaining failures need an operator credential and an upstream package"
    blockers: []
    key_files:
      - ".utcp_config.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "template-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Code Mode manual variable prefixes

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-08-29 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Predecessor** | None |
| **Successor** | None |
| **Handoff Criteria** | Every manual whose failure a configuration or environment change can reach registers on a fresh server |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Five of the fourteen manuals registered in this repository's Code Mode configuration never reached the server. A session that asked Code Mode what tools it had was answered with an empty list, and nothing in the running system said why.

The cause is a prefixing rule that is documented but easy to apply twice. Code Mode takes a bare `${VAR}` reference from a manual and looks up `<manual name>_VAR`, with every underscore in the manual name doubled. The install guide states this and gives a table: manual `figma` referencing `${FIGMA_API_KEY}` needs `figma_FIGMA_API_KEY` in the environment file. Those two manuals, and `github`, follow it and work.

The others do not. `notion` and `obsidian` reference names that already carry the prefix, so the lookup doubles it and finds nothing. `clickup_official` references correctly, but its manual name contains an underscore, so the key it needs carries a doubled underscore that the environment file never had. `webflow` references correctly and simply has no credential recorded anywhere.

The failure is silent in the way that matters: registration errors go to the server's stderr at startup, the server keeps running, and a caller sees a smaller tool list rather than an error.

### Purpose

Make every manual that can be repaired by a configuration or environment change register, and state precisely what blocks the ones that cannot.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- The doubled-prefix references in the `notion` and `obsidian` manuals
- The environment keys the `clickup_official` manual needs under its doubled-underscore name
- Verification on a freshly started server rather than a runtime registration

### Out of Scope

- Renaming `clickup_official`. Its documented tool names carry that manual name, so a rename would break every call site that follows its install guide.
- Supplying a Webflow credential. None exists in the environment file, and inventing one is not a repair.
- The upstream package the ClickUp manual launches, which the registry does not serve.
- The `magicpath` manual, repaired in its own packet.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.utcp_config.json` | Modify | Strip the duplicated prefix from the `notion` and `obsidian` references |
| `.env` | Modify | Add the two keys `clickup_official` needs, copied from the existing pair |
| `.env.example` | Modify | State the prefixing rule and document every key the config resolves |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A repairable manual registers | On a freshly started server, `notion` and `obsidian` register and report their tool counts |
| REQ-002 | No credential value reaches a tracked file | The environment file stays untracked, and the diff of tracked files contains no secret |
| REQ-003 | An unrepairable failure is stated, not hidden | Each remaining failure names its cause and why this packet does not fix it |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | The working manuals stay working | The manuals that registered before the change still register after it |
| REQ-005 | The rule is verified, not inferred | The prefixing behaviour is confirmed against the transport and the documentation before any file changes |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A freshly started server registers every manual except those blocked by a missing credential or an unavailable upstream package.
- **SC-002**: No secret appears in any tracked file.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A credential is copied into a tracked file | High | The values are copied programmatically between keys and never displayed; the environment file is confirmed untracked and the tracked diff is checked |
| Risk | Renaming a manual to simplify its key breaks its callers | High | The rename is rejected: the manual's documented tool names embed its name |
| Risk | A config edit breaks a manual that already worked | Medium | The fresh-server run lists every registration, so a regression in a working manual would appear as a new failure |
| Dependency | The documented prefixing rule | Low | Confirmed against the install guide's own table and against a controlled probe before editing |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None. The two remaining failures are understood and belong outside this packet: `webflow` needs an operator credential, and `clickup_official` launches a package the registry does not serve.
<!-- /ANCHOR:questions -->

---
