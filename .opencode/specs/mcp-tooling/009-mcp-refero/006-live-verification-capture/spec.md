---
title: "Feature Specification: Phase 6: live-verification-capture (mcp-refero)"
description: "Capture the 2026-07-16 live Code Mode discovery of the refero manual as a dated fixture and close the doubled-prefix naming conflict with registry evidence: all eight tools live-listed pre-auth as refero.refero.refero_<tool>."
trigger_phrases:
  - "refero live verification"
  - "refero discovery fixture"
  - "refero doubled prefix confirmed"
  - "refero discovery capture"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/009-mcp-refero/006-live-verification-capture"
    last_updated_at: "2026-07-16T16:30:00Z"
    last_updated_by: "claude-agent"
    recent_action: "Phase complete; naming conflict closed, gates green"
    next_safe_action: "Operator handoff: OAuth completion and first authenticated search"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-tooling/mcp-refero/references/discovery_fixture_2026-07-16.json"
      - ".opencode/skills/mcp-tooling/mcp-refero/references/mcp_wiring.md"
      - ".opencode/skills/mcp-tooling/mcp-refero/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "agent-006-live-verification-capture-refero"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 6: live-verification-capture

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-07-16 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 6 of 6 |
| **Predecessor** | 005-inventory-parity-and-doc-truth |
| **Successor** | None |
| **Handoff Criteria** | Fixture recorded, naming conflict closed with fixture citations, `package_skill.py --check --strict` PASS, OAuth-gated live-call items documented as SKIP-valid operator work |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 6** of the mcp-refero completion: inventory parity, sk-design dedup, live verification capture.

**Scope Boundary**: Doc-truth flips inside `.opencode/skills/mcp-tooling/mcp-refero/**` only, driven by the dated discovery fixture. No authenticated invocation, no OAuth work, no `.utcp_config.json` change.

**Dependencies**:
- Phase 005 shipped the inventory-parity doc truth this phase builds on.
- The live Code Mode discovery run of 2026-07-16 produced the fixture this phase records.

**Deliverables**:
- `references/discovery_fixture_2026-07-16.json` treated as packet ground truth.
- The doubled-prefix naming conflict closed with live registry evidence across 7 packet files.
- Packet version 1.1.1.0 with `changelog/v1.1.1.0.md`.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The packet carried a preserved cross-lineage naming conflict: the doubled-prefix callable `refero.refero_refero_<tool>` was live-verified only indirectly, a single-prefix derivation still circulated, and several docs gated callable confirmation on completed operator OAuth. On 2026-07-16 a direct stdio MCP probe of CodeMode-MCP listed all eight tools pre-auth under the dotted doubled registry names, settling the conflict and disproving the OAuth precondition for discovery.

### Purpose
Every naming claim in the packet cites the live registry evidence, the single-prefix derivation is recorded as refuted, and discovery preconditions state pre-auth truthfully while authenticated calls stay operator-gated.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Recording the 2026-07-16 fixture (`initialize`, then `tools/call` on `list_tools`, `search_tools`, `tool_info` against CodeMode-MCP with `UTCP_CONFIG_FILE=.utcp_config.json`) as ground truth.
- Closing the naming conflict: all eight registry names `refero.refero.refero_{search_styles,search_screens,get_style,get_similar_screens,get_screen_image,get_screen,search_flows,get_flow}` observed pre-auth; TS callable `refero.refero_refero_<tool>(args)` per the fixture `Access as:` line.
- Correcting discovery preconditions: `tools/list` and `tool_info` work WITHOUT OAuth; authenticated CALLS remain operator-gated.
- Recording fixture schema details: `response_format?: "json" | "md"` (default `"md"`) confirmed on `refero_search_styles` and `refero_search_screens`; `platform: "ios" | "web"` required on `refero_search_screens`.
- Version bump to 1.1.1.0 plus `changelog/v1.1.1.0.md`.

### Out of Scope
- OAuth completion, token refresh, Bearer acquisition, and any authenticated search - operator-gated, SKIP-valid.
- Rate-limit and page-size observation - requires authenticated calls.
- `scripts/doctor.sh` and `scripts/install.sh` changes - grep confirmed they already state the correct doubled-prefix forms, so the update-only-if-stale rule leaves them untouched.
- Any `.utcp_config.json` edit.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/mcp-tooling/mcp-refero/references/discovery_fixture_2026-07-16.json` | Create | Dated live-discovery fixture (already written by the probe; recorded as ground truth) |
| `.opencode/skills/mcp-tooling/mcp-refero/SKILL.md` | Modify | Naming trap flipped to confirmed, discovery paragraph, quick-ref row, version 1.1.1.0 |
| `.opencode/skills/mcp-tooling/mcp-refero/README.md` | Modify | Naming/FAQ/verification rows record the resolved conflict and pre-auth discovery |
| `.opencode/skills/mcp-tooling/mcp-refero/INSTALL_GUIDE.md` | Modify | Pre-auth preconditions; tool_info checklist item satisfied with fixture evidence |
| `.opencode/skills/mcp-tooling/mcp-refero/references/mcp_wiring.md` | Modify | Naming section flipped to confirmed registry evidence; banner updated |
| `.opencode/skills/mcp-tooling/mcp-refero/references/tool_surface.md` | Modify | Open question 1 resolved, question 2 partially resolved, fixture cited |
| `.opencode/skills/mcp-tooling/mcp-refero/mcp-servers/refero-mcp/README.md` | Modify | Expected discovery result corrected to pre-auth confirmed |
| `.opencode/skills/mcp-tooling/mcp-refero/manual_testing_playbook/discovery_setup/discovery_first.md` | Modify | DISCOVER-001 rationale records the closed conflict and fixture baseline |
| `.opencode/skills/mcp-tooling/mcp-refero/changelog/v1.1.1.0.md` | Create | Release record for the discovery flips |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The naming conflict closes on live registry evidence, both forms recorded | Flipped claims state dotted registry `refero.refero.refero_<tool>` and doubled TS callable `refero.refero_refero_<tool>(...)`, citing `references/discovery_fixture_2026-07-16.json` |
| REQ-002 | The single-prefix derivation is recorded as refuted | mcp_wiring.md and the playbook name the losing derivation as refuted by the live registry, not merely disfavored |
| REQ-003 | Discovery preconditions state pre-auth truthfully | No doc gates `tools/list`/`tool_info` on OAuth; authenticated CALLS stay operator-gated in the same sentences |
| REQ-004 | Packet gate green | `package_skill.py .opencode/skills/mcp-tooling/mcp-refero --check --strict` prints PASS |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Fixture schema details recorded without overclaiming | Only fixture-shown facts recorded: `response_format` enum and default on the two search tools, `platform` on `refero_search_screens`; remaining six tools stay per-tool `tool_info` checks |
| REQ-006 | OAuth-gated items keep SKIP-valid status with exact commands | Live-call items remain open in INSTALL_GUIDE and examples, with commands preserved |
| REQ-007 | Version and changelog updated | SKILL.md frontmatter reads 1.1.1.0; `changelog/v1.1.1.0.md` records need/change/why plus files changed |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Zero remaining claims that the naming conflict is open or that discovery needs OAuth, outside immutable changelog history.
- **SC-002**: `package_skill.py --check --strict` PASS on the packet.
- **SC-003**: This spec child passes `validate.sh --strict --no-recursive`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `references/discovery_fixture_2026-07-16.json` | Without it there is no registry evidence to cite | Fixture written by the probe before this phase; every flip cites it |
| Risk | Provider surface drift after the fixture date | Recorded names could silently stale | Per-session `tool_info` re-confirmation and the fail-closed drift protocol stay mandatory in every flipped doc |
| Risk | Overclaiming schema coverage from a truncated `search_tools` payload | Wrong per-tool `response_format` claims | Only the two fully-shown search-tool schemas recorded; the other six stay runtime checks |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None blocking. Carried operator items (documented, SKIP-valid): OAuth end-to-end completion, Bearer-token acquisition path, first authenticated search, rate-limit and page-size observation.
<!-- /ANCHOR:questions -->
