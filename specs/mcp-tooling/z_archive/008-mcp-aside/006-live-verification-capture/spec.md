---
title: "Feature Specification: Phase 6: live-verification-capture (mcp-aside-devtools)"
description: "Capture the 2026-07-16 live Code Mode discovery of the aside manual as a dated fixture and flip every discovery-pending claim in the mcp-aside-devtools packet to the observed facts: registry name aside.aside.repl, TS callable aside.aside_repl(args)."
trigger_phrases:
  - "aside live verification"
  - "aside discovery fixture"
  - "aside callable confirmed"
  - "aside discovery capture"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/008-mcp-aside/006-live-verification-capture"
    last_updated_at: "2026-07-16T16:30:00Z"
    last_updated_by: "claude-agent"
    recent_action: "Phase complete; discovery flips shipped, gates green"
    next_safe_action: "Operator handoff: authenticated smoke invocation and browser-binding probe"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-tooling/mcp-aside-devtools/references/discovery-fixture-2026-07-16.json"
      - ".opencode/skills/mcp-tooling/mcp-aside-devtools/references/mcp-wiring.md"
      - ".opencode/skills/mcp-tooling/mcp-aside-devtools/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "agent-006-live-verification-capture-aside"
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
| **Handoff Criteria** | Fixture recorded, all discovery-pending claims flipped with fixture citations, `package_skill.py --check --strict` PASS, remaining live-call items documented as SKIP-valid operator work |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 6** of the mcp-aside-devtools completion: inventory parity, doc truth, live verification capture.

**Scope Boundary**: Doc-truth flips inside `.opencode/skills/mcp-tooling/mcp-aside-devtools/**` only, driven by the dated discovery fixture. No authenticated invocation, no browser work, no `.utcp_config.json` change.

**Dependencies**:
- Phase 005 shipped the registered-state doc truth this phase builds on.
- The live Code Mode discovery run of 2026-07-16 produced the fixture this phase records.

**Deliverables**:
- `references/discovery-fixture-2026-07-16.json` treated as packet ground truth.
- Discovery-pending claims flipped to observed facts across 12 packet files.
- Packet version 1.1.1.0 with `changelog/v1.1.1.0.md`.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The packet predicted `aside.aside_repl` as THE Code Mode callable and marked it UNCONFIRMED/UNKNOWN in 12 files, because live discovery had never run against the registered manual. On 2026-07-16 a direct stdio MCP probe of CodeMode-MCP ran discovery for real, and the observed registry name (`aside.aside.repl`, dot-separated) differs from the predicted registry form while the TS call surface matches the prediction.

### Purpose
Every discovery claim in the packet states the two observed name forms precisely, cites the dated fixture, and keeps the per-session rediscovery discipline intact.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Recording the 2026-07-16 fixture (`initialize`, then `tools/call` on `list_tools`, `search_tools`, `tool_info` against CodeMode-MCP with `UTCP_CONFIG_FILE=.utcp_config.json`) as ground truth.
- Flipping the callable-name claims: registry/discovery name `aside.aside.repl` (dot-separated), TS callable `aside.aside_repl(args)` per the fixture `Access as:` line and mcp-code-mode's `{manual_name}.{manual_name}_{tool_name}` convention.
- Recording the re-confirmed one-`repl`-tool inventory and the fixture's full helper surface in `references/mcp-wiring.md` and `references/aside-cli-reference.md`.
- Updating the preconditions of still-open operator items (smoke invocation, binding probe) so they no longer wait on callable confirmation.
- Version bump to 1.1.1.0 plus `changelog/v1.1.1.0.md`.

### Out of Scope
- Authenticated or live `call_tool_chain` invocations - operator-gated, SKIP-valid.
- Browser-profile binding, bound-page output probes, and the multi-client isolation test - operator-gated; the binding procedure remains UNKNOWN.
- Any `.utcp_config.json` edit - the registered manual is operator-owned.
- `scripts/doctor.sh` logic changes beyond the stale callable-name hint (grep confirmed only line 111 hardcoded the old expected name).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/mcp-tooling/mcp-aside-devtools/references/discovery-fixture-2026-07-16.json` | Create | Dated live-discovery fixture (already written by the probe; recorded as ground truth) |
| `.opencode/skills/mcp-tooling/mcp-aside-devtools/SKILL.md` | Modify | Confirmed dual naming, re-confirmed inventory, NEVER rule update, version 1.1.1.0 |
| `.opencode/skills/mcp-tooling/mcp-aside-devtools/README.md` | Modify | Quick-start MCP step and FAQ flipped to confirmed naming |
| `.opencode/skills/mcp-tooling/mcp-aside-devtools/install-guide.md` | Modify | Post-registration step 3 records the confirmed dual naming |
| `.opencode/skills/mcp-tooling/mcp-aside-devtools/references/mcp-wiring.md` | Modify | Discovery DONE banner, confirmed-naming bullet, fixture helper surface |
| `.opencode/skills/mcp-tooling/mcp-aside-devtools/references/aside-cli-reference.md` | Modify | Helper surface superseded by the fixture; UNKNOWN narrowed |
| `.opencode/skills/mcp-tooling/mcp-aside-devtools/assets/utcp-aside-manual.md` | Modify | Discovery checklist items flipped with fixture evidence |
| `.opencode/skills/mcp-tooling/mcp-aside-devtools/mcp-servers/aside-mcp/README.md` | Modify | Checklist step 4 records confirmed naming |
| `.opencode/skills/mcp-tooling/mcp-aside-devtools/feature-catalog/feature-catalog.md` | Modify | Registration banner and MCP row flipped to CONFIRMED |
| `.opencode/skills/mcp-tooling/mcp-aside-devtools/feature-catalog/mcp/mcp-transport-and-code-mode.md` | Modify | Callable paragraph flipped to observed facts |
| `.opencode/skills/mcp-tooling/mcp-aside-devtools/manual-testing-playbook/manual-testing-playbook.md` | Modify | Notation note and ASD-011 contract diff against the fixture baseline |
| `.opencode/skills/mcp-tooling/mcp-aside-devtools/manual-testing-playbook/mcp-transport/code-mode-discovery.md` | Modify | Scenario records the satisfied 2026-07-16 run and the drift protocol |
| `.opencode/skills/mcp-tooling/mcp-aside-devtools/scripts/doctor.sh` | Modify | Discovery hint states the fixture baseline (both name forms) |
| `.opencode/skills/mcp-tooling/mcp-aside-devtools/changelog/v1.1.1.0.md` | Create | Release record for the discovery flips |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Both observed name forms recorded precisely wherever a callable is named | Every flipped claim states registry `aside.aside.repl` (dotted) and TS callable `aside.aside_repl(args)` and cites `references/discovery-fixture-2026-07-16.json` |
| REQ-002 | The wrong pre-discovery registry prediction is corrected, not papered over | Docs state the prediction `aside.aside_repl` was wrong as a registry name and right as the TS call surface |
| REQ-003 | One-`repl`-tool inventory recorded as re-confirmed live 2026-07-16 | SKILL.md and mcp-wiring.md state the re-confirmation with the fixture cited; rediscovery mandate retained |
| REQ-004 | Packet gate green | `package_skill.py .opencode/skills/mcp-tooling/mcp-aside-devtools --check --strict` prints PASS |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Fixture helper surface supersedes the version-pinned description | mcp-wiring.md and aside-cli-reference.md list the full fixture helper set and mark it as superseding, with bound-page shapes still probe-required |
| REQ-006 | Still-open operator items keep SKIP-valid status with updated preconditions | Smoke invocation and binding items remain open; their prose no longer waits on callable confirmation |
| REQ-007 | Version and changelog updated | SKILL.md frontmatter reads 1.1.1.0; `changelog/v1.1.1.0.md` records need/change/why plus files changed |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Zero remaining claims that discovery is pending or that the callable is unconfirmed, outside immutable changelog history (grep for "unconfirmed until", "discovery is still pending", "UNKNOWN until confirmed" in the packet returns 0 non-changelog hits).
- **SC-002**: `package_skill.py --check --strict` PASS on the packet.
- **SC-003**: This spec child passes `validate.sh --strict --no-recursive`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `references/discovery-fixture-2026-07-16.json` | Without it there is no ground truth to cite | Fixture written by the probe before this phase started; every flip cites it |
| Risk | Fixture is a dated snapshot (`tools.listChanged: true`) | Future inventory drift would silently invalidate the recorded names | Every flipped doc retains the per-session rediscovery mandate and the fail-closed drift protocol |
| Risk | Discovery lists the surface but exercises no call | Overclaiming runtime behavior from a listing | Bound-page output shapes and invocation behavior stay marked probe-required |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None blocking. Carried operator items (documented, SKIP-valid): authenticated smoke invocation inside `call_tool_chain`, browser-profile binding procedure, bound-page output probes, multi-client isolation test.
<!-- /ANCHOR:questions -->
