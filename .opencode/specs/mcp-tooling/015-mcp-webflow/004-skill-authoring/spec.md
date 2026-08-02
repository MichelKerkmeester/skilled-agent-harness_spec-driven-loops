---
title: "Feature Specification: Phase 4 - Author the mcp-webflow skill"
description: "Author the Webflow mode routing contract, setup docs, operation references, examples, safety guidance, and changelog from the accepted integration."
trigger_phrases: ["mcp-webflow skill authoring", "webflow mode docs", "mcp-webflow phase 4"]
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/015-mcp-webflow/004-skill-authoring"
    last_updated_at: "2026-08-02T14:00:00Z"
    last_updated_by: "pi"
    recent_action: "Authored the pending skill-authoring contract"
    next_safe_action: "Wait for Phase 3 integration evidence"
    blockers: ["Phase 3 integration is pending"]
    key_files: ["spec.md", "plan.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "019fc2a3-4f6c-7fa1-af87-b6e9f139a002"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 4 - Author the mcp-webflow skill

<!-- SPECKIT_LEVEL: 1 -->

<!-- ANCHOR:metadata -->
## 1. METADATA
| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-08-02 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 4 of 8 |
| **Predecessor** | `003-webflow-mcp-integration` |
| **Successor** | `005-feature-catalog-and-playbook` |
| **Handoff Criteria** | The nested packet has a complete routing and safety contract, setup documentation, verified tool references, examples, and changelog, with no packet-local advisor metadata. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context
This phase turns the accepted architecture and working integration into a usable mode package. It documents only capabilities verified by research or discovery and keeps design judgment in `sk-design`.

**Dependencies**: completed Phases 1-3 and the current `sk-create-skill` packet contract.

**Deliverables**: `SKILL.md`, `README.md`, `INSTALL-GUIDE.md`, references, examples, operation/safety matrices, and changelog.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE
### Problem Statement
A connected MCP transport is not a safe or discoverable skill. Operators and agents need clear routing, setup, tool selection, external-side-effect gates, troubleshooting, and examples that distinguish transport from design judgment.

### Purpose
Author a concise nested mode package that makes the researched Webflow surface usable without overstating capabilities or weakening the Phase 2 safety contract.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE
### In Scope
- Author packet frontmatter, when-to-use guidance, smart routing, operation classes, rules, references, success criteria, and integration points.
- Document installation/connection and credential setup without values.
- Document verified tools, inputs, outputs, limitations, rate/error behavior, and safe examples.
- Require `sk-design` for design judgment and operator confirmation for high-impact operations.
- Add troubleshooting and changelog coverage.

### Out of Scope
- Hub registration and advisor metadata.
- Feature catalog and manual playbook.
- Unverified tools or production mutation demonstrations.

### Files to Change
| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/mcp-tooling/mcp-webflow/SKILL.md` | Create | Mode contract and routing |
| `.opencode/skills/mcp-tooling/mcp-webflow/{README.md,INSTALL-GUIDE.md}` | Create | User and setup documentation |
| `.opencode/skills/mcp-tooling/mcp-webflow/{references,examples,changelog}/**` | Create | Verified operational knowledge and examples |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
### P0 - Blockers
| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Follow nested packet metadata rules | No packet-local `description.json` or `graph-metadata.json`; folder and skill name align |
| REQ-002 | Preserve the accepted safety contract | Rules and examples gate destructive, publish, deploy, and production actions |
| REQ-003 | Separate transport from judgment | Design-affecting flows require `sk-design`; Webflow transport does not decide taste |
| REQ-004 | Document only verified capabilities | Every tool/capability maps to Phase 1 or Phase 3 evidence |

### P1 - Required
| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Provide usable setup and troubleshooting | Install/connection, auth, scopes, doctor checks, and common failures are actionable |
| REQ-006 | Provide safe examples | Examples cover discovery/read/draft-safe flows and show confirmation boundaries without production mutation |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
- **SC-001**: A new operator can connect, discover tools, and perform an approved safe read using package docs.
- **SC-002**: An agent can route operations and recognize when confirmation or `sk-design` is mandatory.
- **SC-003**: Packet docs validate with zero placeholders and no broken relative links.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Verified integration | Docs may describe an unreal surface | Block authoring until Phase 3 evidence exists |
| Risk | Marketing language overstates support | Unsafe or false routing | Trace claims to tool discovery and official docs |
| Risk | Examples normalize publish/delete | Operators copy dangerous flows | Keep high-impact examples confirmation-gated or tabletop-only |
| Risk | Duplicate advisor identity | Skill graph drift | Keep advisor metadata at hub root only |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS
- Which references should be split by operation domain after Phase 1 reveals the final tool inventory?
- Does the official auth flow need a client-specific setup appendix?
<!-- /ANCHOR:questions -->
