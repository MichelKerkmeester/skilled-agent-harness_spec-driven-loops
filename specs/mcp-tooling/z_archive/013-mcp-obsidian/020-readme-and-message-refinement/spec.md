---
title: "Feature Specification: Phase 20 — README and skill message refinement"
description: "Rewrite the mcp-obsidian README in the repo-root narrative style and correct the skill's stated purpose: effective AI use inside Obsidian with first-class plugin knowledge."
trigger_phrases:
  - "mcp obsidian readme rewrite"
  - "skill purpose correction"
  - "readme message refinement"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/013-mcp-obsidian/020-readme-and-message-refinement"
    last_updated_at: "2026-08-04T05:41:57Z"
    last_updated_by: "spec-author"
    recent_action: "Author Phase 20 specification"
    next_safe_action: "Rewrite the README and refine the SKILL.md purpose framing"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/020-readme-and-message-refinement"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: Phase 20 — README and skill message refinement

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-08-03 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` (013-mcp-obsidian) |
| **Parent Packet** | `mcp-tooling/013-mcp-obsidian` |
| **Predecessor** | `019-plugin-operation-logic-template-alignment` |
| **Successor** | None |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The mcp-obsidian README and SKILL.md state the skill's reason for being as routing between two CLI profiles and the MCP. That framing is wrong. The skill exists solely to make AI use inside Obsidian effective: read, write, search, and extend what the vault contains, with proper plugin knowledge so community plugins are operated as data, not as unreachable UI. The README also reads as a tabular reference card rather than the narrative, problem-first style of the repo root README.

### Purpose

Rewrite the README in the repo-root narrative voice and correct the purpose framing in both the README and the SKILL.md frontmatter and intro. Plugin knowledge (beancount ledgers, `.table.md` payloads, BRAT installs, health-md exports and render blocks, Iconic rulebooks) becomes a headline capability, with the three execution surfaces as the means, not the identity.

**End goal:** a reader opens the README and immediately understands what the skill is for (effective AI inside Obsidian, with plugin knowledge), how to start, and where every capability lives. `validate_document.py --type readme` passes; no stale factual claims or broken links.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Rewrite `mcp-obsidian/README.md` per the sk-create-skill README template and the repo-root README voice: pitch blockquote, AT A GLANCE, OVERVIEW with corrected purpose, QUICK START, HOW IT WORKS with a plugin-knowledge section, INTEGRATION & NAVIGATION, TROUBLESHOOTING, FAQ, VERIFICATION, RELATED DOCUMENTS.
- Correct the purpose framing in `mcp-obsidian/SKILL.md` frontmatter description and H1 intro; keep all routing, rules, and reference content intact.
- Preserve every factual claim: three surfaces, install steps, MCP configuration, safety invariants, troubleshooting entries, verification commands.
- Bump versions and add a changelog entry for the messaging release.
- Validate README structure, links, phase docs, and generated metadata.

### Out of Scope

- Rewriting the routing engine, references, feature catalog, or playbook content.
- Changes to other skills' READMEs or SKILL.md files.
- Vault files or plugin configuration.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/mcp-tooling/mcp-obsidian/README.md` | Rewrite | Narrative, purpose-first README with plugin-knowledge capability |
| `.opencode/skills/mcp-tooling/mcp-obsidian/SKILL.md` | Modify | Corrected frontmatter description and H1 intro; version bump |
| `.opencode/skills/mcp-tooling/mcp-obsidian/changelog/v1.4.1.0.md` | Create | Messaging-release changelog entry |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Correct purpose framing | README and SKILL.md state the skill exists for effective AI use inside Obsidian with first-class plugin knowledge; no "routes between two CLI profiles" framing remains as the identity |
| REQ-002 | README follows the sk-doc README template | Pitch blockquote, AT A GLANCE, numbered ALL-CAPS H2s with `---` dividers, OVERVIEW opens problem-first; `validate_document.py --type readme` reports zero issues |
| REQ-003 | Factual content preserved | All three surfaces, install/register steps, MCP config, safety invariants, troubleshooting rows, and verification commands remain accurate and complete |
| REQ-004 | Human Voice Rules in README | No em dashes, no semicolons, no Oxford commas in the README body |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | SKILL.md message refined and versioned | Frontmatter description and H1 intro reframed; SKILL.md version bumped; changelog entry created |
| REQ-006 | Gates fresh | README links resolve; phase validation errors zero; leaf manifest fresh; description.json/graph-metadata regenerated |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A human reader understands the skill's true purpose within one screen of the README.
- **SC-002**: Plugin knowledge reads as a core capability, with the execution surfaces explained as the means.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Rewrite drops a factual claim | Operators follow stale instructions | Diff the rewritten README against the old one section by section |
| Risk | Purpose correction touches routing docs inconsistently | README and SKILL.md tell different stories | Edit both in the same pass; keep references and rules untouched |
| Risk | HVR violations creep into the new prose | Voice check fails | Write without em dashes and semicolons; run a final grep |
| Dependency | sk-create-skill README template | Structure must match house style | Follow the template's section model and validation checklist |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->
