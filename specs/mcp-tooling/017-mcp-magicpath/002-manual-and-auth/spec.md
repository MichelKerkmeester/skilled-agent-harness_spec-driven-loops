---
title: "Feature Specification: MagicPath manual and authentication"
description: "Register the MagicPath command surface as callable tools and wire its token through the dotenv loader this repository already uses, with the mutation boundary visible in the registration."
trigger_phrases:
  - "magicpath utcp manual"
  - "magicpath token auth"
  - "magicpath command surface"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: MagicPath manual and authentication

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | In Progress |
| **Created** | 2026-08-29 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 2 of 5 |
| **Predecessor** | 001-cli-transport-proof |
| **Successor** | 003-skill-packet |
| **Handoff Criteria** | Read-only tools return MagicPath data for an authenticated operator, and an unauthenticated call names the missing credential rather than failing obscurely |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 2** of the MagicPath tool bridge specification.

**Scope Boundary**: The registration and its credential. No skill packet and no hub metadata; those describe this surface and cannot be written before it exists.

**Dependencies**:
- The transport proven by 001-cli-transport-proof
- `magicpath-ai` on PATH, and a MagicPath account for the live checks

**Deliverables**:
- The MagicPath manual, or manuals, covering the command families this repository will call
- Token wiring through the existing dotenv loader, with the variable recorded but never its value
- A recorded unauthenticated failure, so the refusal path is known rather than assumed

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The probe proved a transport, not a surface. MagicPath exposes roughly two dozen commands, and they do not all deserve the same treatment.

Most are read-only: `search`, `inspect`, `list-projects`, `list-components`, `list-themes`, `get-theme`, `list-teams`, `list-members`, `list-installed`, `share`, `selection`, `active-project`, `info`. Several are not. `add` writes `.tsx` files into the calling project and installs npm packages. `code` creates and submits component revisions to the platform. `create-project`, `image` and `clone` all mutate state, some of it remote. Registering those beside a search command, in one undifferentiated manual, would make an agent's most destructive option indistinguishable from its cheapest.

The credential has its own shape. The CLI accepts a browser login that stores state on the machine, or a `MAGICPATH_TOKEN` environment variable that bypasses it. This repository already resolves manual secrets through a dotenv loader, using a `<manual>_<VARIABLE>` convention visible in the registered Notion server. The machine's current state is unambiguous and worth writing down: `info` reports `authenticated:false`, so every credentialed check in this phase begins from an unauthenticated baseline.

The version gap that sat underneath all of it is settled: the CLI is upgraded to 2.6.1, so the vendor's readme and the installed build now describe the same surface.

Settling it exposed a sharper problem. The CLI's own `info -o json` reports a command list, and that list is wrong. It names 22 commands on both 2.3.2 and 2.6.1, while `--help` on 2.6.1 lists 25 - the omissions being `create-project` and `skills`, both of which run. A manual validated against `info` would therefore reject two working command families as nonexistent. The authoritative surface is `--help`, and `info` is a status report that happens to carry a stale list.

### Purpose

Register the surface an agent should reach, with the mutation boundary visible in the registration rather than only in prose, and with the credential resolved the way this repository already resolves credentials.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- The read-only command family, registered as callable tools
- A decision, recorded with its reason, on the mutating family
- Token resolution through the dotenv loader, following the existing convention
- The variable recorded in the example environment file, without its value
- The unauthenticated failure path, observed

### Out of Scope

- Authenticating the operator's account. The phase verifies both states; obtaining a credential is the operator's action, not an automated one.
- The vendor's `setup-skills` output, which the parent spec places out of scope for the packet.
- Any command family the installed CLI does not implement, unless the version question is settled toward upgrading.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.utcp_config.json` | Modify | Register the MagicPath surface, replacing or promoting the phase 001 probe |
| `.env.example` | Modify | Record the token variable name and where to obtain it |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Read-only tools return MagicPath data | With a credential present, a listing or search tool returns the account's own records through Code Mode |
| REQ-002 | The token resolves through the existing loader | The manual references the variable through the established convention; no credential appears in any tracked file |
| REQ-003 | An unauthenticated call is legible | With no credential, the call reports the missing authentication rather than an empty result or an unexplained error |
| REQ-004 | The mutation boundary is visible in the registration | A reader of the config can tell which tools write, without consulting prose elsewhere |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Every registered tool exists in the installed CLI | Each declared command appears in `magicpath-ai --help`, which is authoritative; the list inside `info -o json` is stale and under-reports the surface |
| REQ-006 | Structured output is requested wherever supported | Tools pass the CLI's JSON output flag so results parse rather than arrive as prose |
| REQ-007 | The version question is settled and recorded | Settled: upgraded to 2.6.1 and the surface re-checked against `--help`, which added `create-project` and `skills` over what `info` reports |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: An agent retrieves a real MagicPath record through Code Mode without shelling out directly.
- **SC-002**: The same call, with the credential withheld, fails in a way that names what is missing.
- **SC-003**: No tracked file contains a MagicPath token.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A token is committed | High | The value lives only in the untracked environment file; the example file records the name alone, and the diff is scanned before close |
| Risk | A mutating tool is called as casually as a search | High | The mutation boundary is expressed in the registration, and the decision on exposing that family is made explicitly rather than by default |
| Risk | Tools are declared from the published readme rather than the installed build | Medium | Every declared command is checked against the installed build's own command list |
| Risk | `add` writes into whichever project is current | Medium | If exposed at all, its working directory is pinned rather than inherited |
| Dependency | The transport proven in 001 | Low | That phase closes before this one opens |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Whether the mutating family is registered at all in this packet, or deferred until the read-only surface has been used enough to know what an agent actually needs.
- Whether `selection` and `active-project`, which read live canvas state, behave usefully when no browser session is open.
- Whether the `skills` family belongs in the registration at all, given that this repository routes skills through its own hub and the parent spec already places the vendor's skill-file output out of scope.
<!-- /ANCHOR:questions -->

---
