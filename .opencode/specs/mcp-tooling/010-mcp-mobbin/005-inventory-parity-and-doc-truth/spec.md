---
title: "Feature Specification: Phase 5: inventory-parity-and-doc-truth"
description: "Flip every mcp-mobbin packet doc from pre-registration doctrine to registered-state truth (the mobbin manual now sits in .utcp_config.json; discovery and OAuth pend), and bring the packet to sibling inventory parity: examples/, install.sh, a 9-scenario playbook, and enriched feature-catalog leaves."
trigger_phrases:
  - "mcp-mobbin inventory parity"
  - "mobbin doc truth"
  - "mobbin registered state"
  - "mobbin examples install"
  - "phase 005 inventory parity"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/010-mcp-mobbin/005-inventory-parity-and-doc-truth"
    last_updated_at: "2026-07-16T18:00:00Z"
    last_updated_by: "claude"
    recent_action: "Shipped doc-truth flips + parity additions; gates green"
    next_safe_action: "Run phase 006 live-verification-capture after operator reconnect + OAuth"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-tooling/mcp-mobbin/SKILL.md"
      - ".opencode/skills/mcp-tooling/mcp-mobbin/scripts/doctor.sh"
      - ".opencode/skills/mcp-tooling/mcp-mobbin/scripts/install.sh"
      - ".opencode/skills/mcp-tooling/mcp-mobbin/examples/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-005-inventory-parity-and-doc-truth"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Is the mobbin manual registered? Yes - .utcp_config.json carries the exact researched shape (stdio npx mcp-remote, empty env); discovery and OAuth still pend"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 5: inventory-parity-and-doc-truth

<!-- SPECKIT_LEVEL: 2 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

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
| **Handoff Criteria** | Every packet doc states the registered wiring truth (zero stale pre-registration markers outside historical changelog records); `package_skill.py --check --strict` passes; the parity additions (examples/, install.sh, 9-scenario playbook, enriched catalog leaves) ship at version 1.1.0.0 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 5** of the mcp-mobbin completion: inventory parity, doc truth, live verification capture specification.

**Scope Boundary**: This phase edits only `.opencode/skills/mcp-tooling/mcp-mobbin/**` and this phase folder. It never edits `.utcp_config.json` (the `mobbin` manual was registered by an operator before this phase ran; the phase verifies it read-only), never touches hub files, sibling packets, or auth state, and never performs discovery or OAuth (those are phase 006 preconditions owned by the operator).

**Dependencies**:
- The registered `mobbin` manual in `.utcp_config.json` (operator-applied; stdio `npx -y mcp-remote https://api.mobbin.com/mcp`, empty env)
- Phase 001 ground truth: `../001-research/research/research.md`
- Sibling parity references: `mcp-click-up` and `mcp-chrome-devtools` (examples/ + install.sh inventory shape)

**Deliverables**:
- Registered-state doc truth across all packet docs (SKILL.md, README.md, INSTALL_GUIDE.md, references, asset, playbook, catalog, mcp-servers pointer)
- `scripts/doctor.sh` behavior flip: manual absence reports ERR (was INFO)
- New `examples/` (README plus 3 worked Code Mode walkthroughs) and new verify-only `scripts/install.sh`
- Playbook enriched from 6 to 9 scenarios; feature-catalog leaves enriched with recipes and cross-cutting constraints
- Version 1.1.0.0 plus `changelog/v1.1.0.0.md`

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The `mobbin` Code Mode manual is now registered in `.utcp_config.json`, but the entire packet still teaches pre-registration doctrine: 98 marker lines across 15 files claim the manual is "NOT registered", call absence "expected", and fence registration to "a later phase". An agent following those docs would misreport the wiring state and treat a broken registration as healthy. Separately, the packet lags its transport siblings on inventory: no `examples/`, no `install.sh`, a 6-scenario playbook, and catalog leaves without the cross-cutting rate-limit and plan-gating constraints.

### Purpose
Every packet doc states the registered wiring truth (registered; discovery pends a fresh Code Mode session; OAuth pends the operator; callable still INFERRED until `tool_info`), absence becomes a failure symptom end to end, and the packet reaches sibling inventory parity at version 1.1.0.0.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Flip every stale registration marker in the packet to registered-state truth, including renaming and rewriting the MANUAL-001 scenario file
- Flip `scripts/doctor.sh` so manual absence reports as an ERROR while staying read-only and `bash -n` clean
- Execute the asset's 9-item post-registration checklist doc-side (evidence for doc-executable items; exact commands for SKIP-valid live items)
- Add `examples/` (README plus 3 walkthroughs traced to `references/tool_surface.md` only) and a non-interactive verify-only `scripts/install.sh`
- Enrich the playbook to 9 scenarios and all 4 feature-catalog leaves with query recipes plus cross-cutting constraints
- Bump the packet to 1.1.0.0 with `changelog/v1.1.0.0.md`

### Out of Scope
- Editing `.utcp_config.json` - the registration already happened (operator); this phase verifies it read-only
- Live discovery, OAuth, smoke calls, or any authenticated verification - phase 006 owns live capture; the callable stays INFERRED here
- Hub files, sibling mode packets, parent spec map updates - outside this phase's write authority
- Rewriting historical records (`changelog/v1.0.0.0.md`, the 1.0.0.0 version-history row) - they truthfully describe the state at first release

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/mcp-tooling/mcp-mobbin/SKILL.md` | Modify | Registration trap becomes discovery trap; rules, routing, quick reference flipped; v1.1.0.0 |
| `.opencode/skills/mcp-tooling/mcp-mobbin/README.md` | Modify | Quick start, FAQ, troubleshooting, verification flipped to registered state |
| `.opencode/skills/mcp-tooling/mcp-mobbin/INSTALL_GUIDE.md` | Modify | Section 4 becomes reconnect-and-authenticate; doctor expectations flipped; 1.1.0.0 history row |
| `.opencode/skills/mcp-tooling/mcp-mobbin/assets/utcp_mobbin_manual.md` | Modify | Reference shape of the registered manual; 9-item checklist executed doc-side |
| `.opencode/skills/mcp-tooling/mcp-mobbin/references/{mcp_wiring,tool_surface,troubleshooting}.md` | Modify | Registered-state framing; absence as failure; discovery-first kept |
| `.opencode/skills/mcp-tooling/mcp-mobbin/scripts/doctor.sh` | Modify | Manual absence now ERR; callable pointer notes pending discovery/OAuth |
| `.opencode/skills/mcp-tooling/mcp-mobbin/scripts/install.sh` | Create | Non-interactive verify-only posture check (node/npx, manual presence, OAuth pointer) |
| `.opencode/skills/mcp-tooling/mcp-mobbin/examples/{README,smoke_search_limit_1,platform_flow_research,element_intent_query}.md` | Create | Worked Code Mode walkthroughs; INFERRED callable with mandatory tool_info first |
| `.opencode/skills/mcp-tooling/mcp-mobbin/manual_testing_playbook/manual_testing_playbook.md` | Modify | 9-scenario index, 5 categories, 5 waves, registered-state preconditions |
| `.opencode/skills/mcp-tooling/mcp-mobbin/manual_testing_playbook/discovery_setup/manual_registered_expected.md` | Rename+Rewrite | Was manual_absent_expected.md; presence expected, absence escalated |
| `.opencode/skills/mcp-tooling/mcp-mobbin/manual_testing_playbook/read_only/platform_filter.md` | Create | PLATFORM-001: ios/web enum, infer-or-ask, per-platform comparison |
| `.opencode/skills/mcp-tooling/mcp-mobbin/manual_testing_playbook/limits_access/{rate_limit_backoff,paid_gate_taxonomy}.md` | Create | RATELIMIT-001 (429/backoff observation, SKIP-valid); PAIDGATE-001 (error taxonomy) |
| `.opencode/skills/mcp-tooling/mcp-mobbin/feature_catalog/{feature_catalog,apps/apps,screens/screens,flows/flows,elements/elements}.md` | Modify | Registered-state framing; recipes + cross-cutting constraints traced to tool_surface.md |
| `.opencode/skills/mcp-tooling/mcp-mobbin/mcp-servers/mobbin-mcp/README.md` | Modify | Pointer flipped to registered state |
| `.opencode/skills/mcp-tooling/mcp-mobbin/changelog/v1.1.0.0.md` | Create | Registered-state truth + parity additions release notes |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Zero stale registration markers | Packet-wide grep for the stale marker set ("NOT registered", "later phase", "pre-registration", "manual absent", "not yet registered", "unregistered") returns only intentional hits: historical records (v1.0.0.0 changelog, 1.0.0.0 history row) and self-describing flip narrative |
| REQ-002 | doctor.sh flips absence to ERROR | `doctor.sh` reports OK for the present manual and ERR (not INFO) for absence; stays read-only; `bash -n` clean; live run against the real config shows OK |
| REQ-003 | Epistemic line held | No doc claims discovery ran, OAuth completed, or the callable was observed: the callable stays INFERRED with mandatory `tool_info` confirmation, and OAuth stays operator-only and Inferred end-to-end |
| REQ-004 | Package gate passes strict | `package_skill.py .opencode/skills/mcp-tooling/mcp-mobbin --check --strict` reports PASS |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Examples ship with discipline | `examples/` contains README plus 3 walkthroughs, each opening with the mandatory `tool_info` confirmation, keeping OAuth steps SKIP-valid with exact commands, and tracing tool-surface claims to `references/tool_surface.md` only |
| REQ-006 | install.sh verifies posture | `scripts/install.sh` is non-interactive and verify-only: node 18+/npx, `mobbin` manual PRESENT in `.utcp_config.json` (grep, presence = OK), operator-only OAuth pointer; `bash -n` clean; exit 0 on the healthy posture |
| REQ-007 | Playbook reaches 9 scenarios | Root index lists 9 IDs across 5 categories matching 9 per-scenario files; the 3 additions are grounded in the research workflows (platform filter; 429/backoff observation SKIP-valid; paid-gate taxonomy); sibling frontmatter schema kept |
| REQ-008 | Catalog leaves carry constraints | Each of apps/screens/flows/elements has query-intent recipes plus the cross-cutting rate-limit and plan-gating constraints, traced to `tool_surface.md` |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: An agent loading any packet doc learns the same wiring truth: registered 2026-07-16; discovery pends a fresh Code Mode session; OAuth pends the operator; callable INFERRED until `tool_info`.
- **SC-002**: `package_skill.py --check --strict` PASS and both scripts run green (`doctor.sh` OK on the registered manual; `install.sh` exit 0).
- **SC-003**: Inventory parity: `examples/` and `scripts/install.sh` exist as they do in the `mcp-click-up`/`mcp-chrome-devtools` siblings, the playbook counts 9/9, and the release is traceable in `changelog/v1.1.0.0.md`.
- **SC-004**: Zero files outside `.opencode/skills/mcp-tooling/mcp-mobbin/` and this phase folder are modified.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The registered `mobbin` manual in `.utcp_config.json` | The doc flip is false if the registration reverts | Verified read-only at phase start (JSON parse, field-for-field match against the researched shape) and re-checked by doctor.sh/install.sh |
| Risk | Overclaiming: flipping "registered" into "working" | High | REQ-003 holds the epistemic line: discovery/OAuth/callable claims stay INFERRED or pending everywhere |
| Risk | Rewriting historical records during the sweep | Medium | v1.0.0.0 changelog and the 1.0.0.0 history row are explicitly out of scope; the grep acceptance excludes them |
| Risk | Scenario-count drift between root index and files | Low | REQ-007 pins 9 IDs to 9 files; the index self-documents the invariant |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. The two questions this phase inherited were answered during execution: the registration state (registered, verified byte-equivalent) and the MANUAL-001 rename target (`manual_registered_expected.md`).
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
