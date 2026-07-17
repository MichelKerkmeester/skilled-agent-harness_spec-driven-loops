---
title: "Feature Specification: Phase 5: inventory-parity-and-doc-truth"
description: "Bring mcp-aside-devtools to full inventory parity with sibling transports and flip every stale not-registered claim to registered-state truth after the aside UTCP manual landed in .utcp_config.json."
trigger_phrases:
  - "aside inventory parity"
  - "aside doc truth"
  - "aside registered manual"
  - "aside feature catalog"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/008-mcp-aside/005-inventory-parity-and-doc-truth"
    last_updated_at: "2026-07-16T13:16:00Z"
    last_updated_by: "claude-agent"
    recent_action: "Authored spec for registered-state doc truth and inventory parity"
    next_safe_action: "Run validate.sh --strict on this folder"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-tooling/mcp-aside-devtools/SKILL.md"
      - ".opencode/skills/mcp-tooling/mcp-aside-devtools/assets/utcp-aside-manual.md"
      - ".opencode/skills/mcp-tooling/mcp-aside-devtools/feature-catalog/feature-catalog.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "agent-005-inventory-parity"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 5: inventory-parity-and-doc-truth

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
| **Phase** | 5 of 6 |
| **Predecessor** | 004-validation-and-handoff |
| **Successor** | 006-live-verification-capture |
| **Handoff Criteria** | Packet gate PASS, spec validation PASSED, all stale registration claims flipped |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 5** of the mcp-aside-devtools completion: inventory parity, doc truth, live verification capture specification.

**Scope Boundary**: Writes are limited to `.opencode/skills/mcp-tooling/mcp-aside-devtools/**` and this spec child. No hub files, no `.utcp_config.json` edits (the `aside` manual was registered before this phase started and is treated as ground truth), no sibling packets.

**Dependencies**:
- The `aside` manual registered in `.utcp_config.json` (done 2026-07-16, prior to this phase)
- The `aside` binary installed (version `1.26.626.1517` evidence carried by the packet)
- `mcp-mobbin` as the structural exemplar for `feature-catalog/` and `assets/`

**Deliverables**:
- Registered-state doc-truth flips across the whole packet, including the ungated ASD-011 scenario and the doctor error posture
- New `feature-catalog/` (root + 5 intent domains) and `assets/utcp-aside-manual.md`
- Packet version 1.1.0.0 with `changelog/v1.1.0.0.md`

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The `aside` UTCP manual is now registered in `.utcp_config.json`, but the `mcp-aside-devtools` packet still documents registration as a "later phase" in roughly 30 places, gates its Code Mode discovery scenario on non-registration, and ships a doctor that treats manual absence as expected. The packet also lacks the `feature-catalog/` and `assets/` inventory its sibling transports (e.g. `mcp-mobbin`) carry.

### Purpose
Every registration claim in the packet states the registered truth, the discovery scenario is runnable, a registration regression is a detectable error, and the packet reaches structural inventory parity with its siblings.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Flip all stale "not registered" / "later phase" / "not yet registered" claims to registered-state truth (registration done 2026-07-16; discovery pends a fresh Code Mode session; `aside.aside_repl` unconfirmed until `tool_info()`)
- Ungate playbook scenario ASD-011 (precondition becomes a session with the code_mode MCP loaded; SKIP-valid without one; missing manual becomes FAIL)
- `scripts/doctor.sh`: manual absence in `.utcp_config.json` becomes an error (was expected-absent info); stays read-only and `bash -n` clean
- New `feature-catalog/` mirroring `mcp-mobbin`: root catalog plus one snake_case dir per SKILL.md INTENT_SIGNALS key (task, repl, mcp, install, troubleshoot)
- New `assets/utcp-aside-manual.md`: byte-true registered snapshot with provenance and the single-vs-dual-manual open question
- SKILL.md/README/install-guide consistency pass referencing the new inventory; packet version bump to 1.1.0.0 plus `changelog/v1.1.0.0.md`
- This spec child authored at Level 2 with metadata backfill and strict validation

### Out of Scope
- Editing `.utcp_config.json` - registration already happened; this phase documents it
- Running live Code Mode discovery - needs a fresh Code Mode session (phase 006 territory)
- Hub files (`mcp-tooling` SKILL.md, mode-registry.json) - outside write authority
- Historical `changelog/v1.0.0.0.md` - release records stay immutable

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/mcp-tooling/mcp-aside-devtools/SKILL.md` | Modify | Registered-state MCP posture, asset routing, version 1.1.0.0 |
| `.opencode/skills/mcp-tooling/mcp-aside-devtools/README.md` | Modify | Quick start, FAQ, related documents flipped to registered state |
| `.opencode/skills/mcp-tooling/mcp-aside-devtools/install-guide.md` | Modify | MCP configuration section registered + verify-with-jq |
| `.opencode/skills/mcp-tooling/mcp-aside-devtools/references/mcp-wiring.md` | Modify | Registration section retitled REGISTERED |
| `.opencode/skills/mcp-tooling/mcp-aside-devtools/mcp-servers/aside-mcp/README.md` | Modify | Drafted-manual framing replaced with registered truth |
| `.opencode/skills/mcp-tooling/mcp-aside-devtools/mcp-servers/aside-cli/README.md` | Modify | Cross-reference updated |
| `.opencode/skills/mcp-tooling/mcp-aside-devtools/manual-testing-playbook/manual-testing-playbook.md` | Modify | ASD-011 ungated; preconditions and wave plan updated |
| `.opencode/skills/mcp-tooling/mcp-aside-devtools/manual-testing-playbook/mcp-transport/code-mode-discovery.md` | Modify | Gate replaced with code_mode-session precondition |
| `.opencode/skills/mcp-tooling/mcp-aside-devtools/scripts/doctor.sh` | Modify | Manual absence becomes an error (exit 1) |
| `.opencode/skills/mcp-tooling/mcp-aside-devtools/feature-catalog/` | Create | Root catalog + 5 intent-domain files |
| `.opencode/skills/mcp-tooling/mcp-aside-devtools/assets/utcp-aside-manual.md` | Create | Byte-true registered snapshot + checklist |
| `.opencode/skills/mcp-tooling/mcp-aside-devtools/changelog/v1.1.0.0.md` | Create | Release record for this phase |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | No stale registration claims remain in the packet | Grep for "NOT REGISTERED", "not registered", "later phase", "not yet registered", "manual absent" returns zero hits outside the immutable v1.0.0.0 changelog |
| REQ-002 | ASD-011 is ungated | `code-mode-discovery.md` precondition is a session with the code_mode MCP loaded; SKIP blocker is "no Code Mode session available"; missing manual is FAIL |
| REQ-003 | Doctor treats manual absence as an error | `doctor.sh` reports err and exits 1 when the `aside` manual is missing from an existing `.utcp_config.json`; `bash -n` passes; script stays read-only |
| REQ-004 | `assets/utcp-aside-manual.md` is byte-true to the live entry | Programmatic comparison of the embedded JSON block against `jq '.manual_call_templates[] | select(.name == "aside")' .utcp_config.json` output matches exactly |
| REQ-005 | Packet gate passes | `package_skill.py --check --strict` reports PASS |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | `feature-catalog/` mirrors the sibling structure | Root `feature-catalog.md` plus one dir per INTENT_SIGNALS key (task, repl, mcp, install, troubleshoot), each with at least one leaf doc; frontmatter mirrors `mcp-mobbin` |
| REQ-007 | Every catalog capability traces to existing packet docs or research | No invented surface; UNKNOWN items (binding procedure, permission inheritance, flag spelling, console/network capture, dual manual) stay flagged |
| REQ-008 | Version and changelog updated | SKILL.md and README frontmatter read 1.1.0.0; `changelog/v1.1.0.0.md` exists and lists the changes |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Zero stale registration markers outside `changelog/v1.0.0.0.md`, confirmed by grep across the packet
- **SC-002**: `package_skill.py --check --strict` PASS and `validate.sh --strict --no-recursive` PASSED on this spec child
- **SC-003**: The asset snapshot verifies byte-true against the live config programmatically
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Registered `aside` entry in `.utcp_config.json` | Doc truth would be wrong if registration regressed | Doctor now errors on absence; asset carries the verify-with-jq command |
| Risk | Callable name drift (`aside.aside_repl` unconfirmed) | Docs could overclaim the Code Mode path | All docs state discovery-confirmation as the remaining step; phase 006 captures it |
| Risk | Doctor exit-code change breaks a consumer expecting exit 0 | Low - doctor still exits 0 in the healthy registered state | README documents the new error posture |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Single vs dual `aside` manual: unresolved pending a controlled multi-client isolation test (documented in the asset and `references/mcp-wiring.md`; not this phase's decision)
- Exact Code Mode callable name: pends discovery in a fresh Code Mode session (phase 006)
<!-- /ANCHOR:questions -->
