---
title: "Feature Specification: Phase 6: live-verification-capture (mcp-mobbin)"
description: "Capture the 2026-07-16 live Code Mode discovery of the mobbin manual as a dated fixture: three read tools supersede the one-tool research baseline, the deep-search conflict resolves as a client-settable mode input, and 22 packet files flip to the observed facts."
trigger_phrases:
  - "mobbin live verification"
  - "mobbin discovery fixture"
  - "mobbin three tools"
  - "mobbin deep mode resolved"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/010-mcp-mobbin/006-live-verification-capture"
    last_updated_at: "2026-07-16T16:30:00Z"
    last_updated_by: "claude-agent"
    recent_action: "Phase complete; three-tool supersession shipped, gates green"
    next_safe_action: "Operator handoff: browser OAuth and first authenticated smoke search"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-tooling/mcp-mobbin/references/discovery_fixture_2026-07-16.json"
      - ".opencode/skills/mcp-tooling/mcp-mobbin/references/tool_surface.md"
      - ".opencode/skills/mcp-tooling/mcp-mobbin/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "agent-006-live-verification-capture-mobbin"
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
| **Handoff Criteria** | Fixture recorded, three-tool supersession and deep-mode resolution flipped with fixture citations, `package_skill.py --check --strict` PASS, OAuth-gated live-call items documented as SKIP-valid operator work |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 6** of the mcp-mobbin completion: inventory parity, doc truth, live verification capture.

**Scope Boundary**: Doc-truth flips inside `.opencode/skills/mcp-tooling/mcp-mobbin/**` only, driven by the dated discovery fixture. No authenticated invocation, no OAuth work, no `.utcp_config.json` change.

**Dependencies**:
- Phase 005 shipped the registered-state doc truth this phase builds on.
- The live Code Mode discovery run of 2026-07-16 produced the fixture this phase records.

**Deliverables**:
- `references/discovery_fixture_2026-07-16.json` treated as packet ground truth.
- The one-tool baseline superseded by the live three-tool inventory across 22 packet files.
- The `deep` conflict resolved as a client-settable `mode` input.
- Packet version 1.1.1.0 with `changelog/v1.1.1.0.md`.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The whole packet was built on the official one-public-tool record: `search_screens` only, `search_flows` explicitly listed as a tool that must never be invented, the `deep` search question preserved as an unresolved conflict, and the callable name marked INFERRED. On 2026-07-16 a direct stdio MCP probe of CodeMode-MCP listed THREE read tools pre-auth, resolved the `deep` question as a real `mode` input, and confirmed the naming - which made much of the packet's doctrine factually wrong, including a rule that would have forced an agent to refuse a real live tool.

### Purpose
The packet's contract tracks the live-discovered three-tool inventory with the fixture cited: `search_flows` and `search_sections` are documented as live-discovered supersessions (dated), the `deep` mode is a confirmed input, and the read-only mutation-refusal check is recorded as passed.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Recording the 2026-07-16 fixture (`initialize`, then `tools/call` on `list_tools`, `search_tools`, `tool_info` against CodeMode-MCP with `UTCP_CONFIG_FILE=.utcp_config.json`) as ground truth.
- Superseding the one-tool baseline: registry names `mobbin.mobbin.{search_screens,search_flows,search_sections}`, TS callables `mobbin.mobbin_search_screens(args)` etc., all read-only (mutation-refusal check passed).
- Resolving the `deep` conflict: `mode?: "deep" | "standard" | "fast"` is a client-settable `search_screens` input (`"deep"` = AI-powered relevance pipeline; `"fast"` = deprecated alias).
- Recording the fixture-declared schemas, including that the declared `search_screens` output (`{ query, screens[] }`) lacks the research-documented `index`/`failed[]` fields, flagged for first-call verification.
- Rebuilding flow-research guidance on `search_flows` (returned `position` ordering is fact; beyond it stays inference) and adding website-section research on `search_sections`.
- Correcting discovery preconditions: pre-auth listing worked; OAuth gates calls only.
- Updating `scripts/doctor.sh` and `scripts/install.sh` where they hardcoded the INFERRED status (grep confirmed both did).
- Version bump to 1.1.1.0 plus `changelog/v1.1.1.0.md`.

### Out of Scope
- Browser OAuth, authenticated searches, rate-limit observation, inline-image fidelity verification - operator-gated, SKIP-valid.
- A dedicated feature-catalog leaf for `search_sections` - noted in the catalog areas table as pending; creating it is follow-up authoring, not capture.
- Any `.utcp_config.json` edit.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/mcp-tooling/mcp-mobbin/references/discovery_fixture_2026-07-16.json` | Create | Dated live-discovery fixture (already written by the probe; recorded as ground truth) |
| `.opencode/skills/mcp-tooling/mcp-mobbin/SKILL.md` | Modify | Discovery banner, three-tool surface, resolved deep, workflows, rules, quick ref, version 1.1.1.0 |
| `.opencode/skills/mcp-tooling/mcp-mobbin/README.md` | Modify | Why-this-packet, quick start, wiring state, troubleshooting rows |
| `.opencode/skills/mcp-tooling/mcp-mobbin/INSTALL_GUIDE.md` | Modify | Pre-auth precondition; checklist items satisfied with fixture evidence |
| `.opencode/skills/mcp-tooling/mcp-mobbin/references/tool_surface.md` | Modify | Rewritten to the live three-tool contract; open questions 1/3/4/10 resolved |
| `.opencode/skills/mcp-tooling/mcp-mobbin/references/mcp_wiring.md` | Modify | Naming section CONFIRMED; pre-auth discovery recorded |
| `.opencode/skills/mcp-tooling/mcp-mobbin/references/troubleshooting.md` | Modify | Drift row diffs against the fixture baseline |
| `.opencode/skills/mcp-tooling/mcp-mobbin/assets/utcp_mobbin_manual.md` | Modify | Discovery/schema checklist items flipped with fixture evidence |
| `.opencode/skills/mcp-tooling/mcp-mobbin/mcp-servers/mobbin-mcp/README.md` | Modify | Expected discovery result and call-syntax row flipped |
| `.opencode/skills/mcp-tooling/mcp-mobbin/feature_catalog/feature_catalog.md` | Modify | Banner, inventory, areas table, count summary |
| `.opencode/skills/mcp-tooling/mcp-mobbin/feature_catalog/flows/flows.md` | Modify | Rebuilt on the live search_flows tool |
| `.opencode/skills/mcp-tooling/mcp-mobbin/feature_catalog/screens/screens.md` | Modify | Fixture-declared schema and resolved deep mode |
| `.opencode/skills/mcp-tooling/mcp-mobbin/feature_catalog/apps/apps.md` | Modify | Resolved deep note |
| `.opencode/skills/mcp-tooling/mcp-mobbin/feature_catalog/elements/elements.md` | Modify | Resolved deep note |
| `.opencode/skills/mcp-tooling/mcp-mobbin/examples/README.md` | Modify | Confirmed callables banner, preflight, shared rules |
| `.opencode/skills/mcp-tooling/mcp-mobbin/examples/smoke_search_limit_1.md` | Modify | Confirmed callable, fixture-schema expectations |
| `.opencode/skills/mcp-tooling/mcp-mobbin/examples/platform_flow_research.md` | Modify | Rebuilt on search_flows |
| `.opencode/skills/mcp-tooling/mcp-mobbin/examples/element_intent_query.md` | Modify | Confirmed callable |
| `.opencode/skills/mcp-tooling/mcp-mobbin/manual_testing_playbook/manual_testing_playbook.md` | Modify | Naming status, do-not-run note, DISCOVER-001 row |
| `.opencode/skills/mcp-tooling/mcp-mobbin/manual_testing_playbook/discovery_setup/discovery_first.md` | Modify | Fixture-baseline re-confirmation contract |
| `.opencode/skills/mcp-tooling/mcp-mobbin/manual_testing_playbook/read_only/flow_intent.md` | Modify | search_flows-first flow research contract |
| `.opencode/skills/mcp-tooling/mcp-mobbin/manual_testing_playbook/read_only/screens_search.md` | Modify | Fixture-declared inputs/fields; deep now allowed deliberately |
| `.opencode/skills/mcp-tooling/mcp-mobbin/scripts/doctor.sh` | Modify | Discovery hint states the confirmed three-tool baseline |
| `.opencode/skills/mcp-tooling/mcp-mobbin/scripts/install.sh` | Modify | Callable-confirmation hint flipped to confirmed |
| `.opencode/skills/mcp-tooling/mcp-mobbin/changelog/v1.1.1.0.md` | Create | Release record for the supersession and resolutions |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The one-tool baseline is superseded explicitly and dated | Docs say the live 2026-07-16 discovery supersedes the research baseline, naming both new tools and citing `references/discovery_fixture_2026-07-16.json` |
| REQ-002 | The mutation-refusal check is recorded | tool_surface.md and SKILL.md state all three live tools are read-only search tools and the check passed |
| REQ-003 | The `deep` conflict is resolved from the fixture schema | Docs state `mode?: "deep" | "standard" | "fast"` as a client input with the fixture cited; the old do-not-hardcode rule is retired |
| REQ-004 | Naming recorded in both forms | Registry `mobbin.mobbin.<tool>` (dotted) and TS callable `mobbin.mobbin_<tool>(args)` presented together wherever a callable is named |
| REQ-005 | Packet gate green | `package_skill.py .opencode/skills/mcp-tooling/mcp-mobbin --check --strict` prints PASS |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Declared-vs-documented output difference recorded without overclaiming | Docs note `index`/`failed[]` are absent from the declared schema and flag first-call verification, never asserting either shape as live behavior |
| REQ-007 | Flow research rebuilt on `search_flows` | flows leaf, flow example, and FLOWS-001 treat returned `position` ordering as fact and anything beyond it as labeled inference |
| REQ-008 | OAuth-gated items keep SKIP-valid status with exact commands | Smoke search and OAuth steps remain open with commands preserved; preconditions no longer gate discovery on OAuth |
| REQ-009 | Version and changelog updated | SKILL.md frontmatter reads 1.1.1.0; `changelog/v1.1.1.0.md` records need/change/why plus files changed |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Zero remaining INFERRED-callable, one-tool-baseline, or open-deep-conflict claims outside immutable changelog history.
- **SC-002**: `package_skill.py --check --strict` PASS on the packet.
- **SC-003**: This spec child passes `validate.sh --strict --no-recursive`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `references/discovery_fixture_2026-07-16.json` | Without it there is no live inventory to cite | Fixture written by the probe before this phase; every flip cites it |
| Risk | Declared schemas differ from authenticated responses | Docs could assert response fields the live server never sends | The `index`/`failed[]` absence is flagged for first-call verification; unknown fields are preserved, never stripped |
| Risk | Provider surface drift after the fixture date | The three-tool baseline could stale silently | Per-session `tool_info` re-confirmation and the fail-closed drift protocol stay mandatory everywhere |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None blocking. Carried operator items (documented, SKIP-valid): browser OAuth on a paid plan, the first authenticated smoke search, inline-image fidelity through `call_tool_chain`, rate-limit observation, Free-denial semantics. Follow-up authoring item: a dedicated `search_sections` feature-catalog leaf.
<!-- /ANCHOR:questions -->
