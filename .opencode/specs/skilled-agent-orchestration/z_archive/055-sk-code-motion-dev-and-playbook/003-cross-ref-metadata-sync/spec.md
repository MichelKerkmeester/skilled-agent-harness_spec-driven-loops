---
title: "Feature Specification: sk-code Cross-Reference and Metadata Sync"
description: "Synchronize Webflow motion.dev cross-references and sk-code metadata so the new motion_dev peer category is discoverable without relocating existing Webflow-specific guidance."
trigger_phrases:
  - "sk-code motion.dev cross references"
  - "motion_dev metadata sync"
  - "003-cross-ref-metadata-sync"
  - "sk-code router manifest motion_dev"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/055-sk-code-motion-dev-and-playbook/003-cross-ref-metadata-sync"
    last_updated_at: "2026-05-05T12:00:00Z"
    last_updated_by: "claude-orchestrator-or-cli-codex"
    recent_action: "Implementation complete; verified by opus reviewer + remediation"
    next_safe_action: "Packet ready for parent-level commit"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - ".opencode/skills/sk-code/SKILL.md"
      - ".opencode/skills/sk-code/README.md"
      - ".opencode/skills/sk-code/references/router/"
      - ".opencode/skills/sk-code/references/webflow/"
      - ".opencode/skills/sk-code/assets/webflow/patterns/wait_patterns.js"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "codex-2026-05-05"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Gate 3 skipped: packet spec folder pre-approved by dispatch"
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: sk-code Cross-Reference and Metadata Sync

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-05-05 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Packet** | `003-cross-ref-metadata-sync` |
| **Implementation Surface** | `.opencode/skills/sk-code/` metadata, router docs, Webflow cross-reference docs/assets |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Packets 1 and 2 created motion.dev playbook coverage and a populated cross-stack `motion_dev/` reference package, but existing Webflow docs still mention Motion mostly as Webflow-local guidance. The sk-code router and metadata also need to expose `motion_dev/` as a discoverable peer category without changing Webflow-specific content ownership.

### Purpose
Add non-destructive "See also" pointers near every Webflow Motion mention, update the existing sk-code router/resource metadata to list `motion_dev/` as a peer category, and record the combined 069 packet work in skill metadata and changelog files.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add additive cross-stack `motion_dev/` pointers to every current Webflow reference/asset file found by the dispatch grep.
- Update existing sk-code router/resource documentation, SKILL.md, README.md, and description metadata so `motion_dev/` is discoverable.
- Refresh skill graph derived metadata through the existing derived sync mechanism if available.
- Add a changelog entry summarizing all three child packets under parent spec 069.
- Create Packet 3 planning, task, checklist, and implementation summary docs.

### Out of Scope
- Moving, deleting, archiving, or rewriting existing Webflow Motion guidance.
- Editing `references/motion_dev/` or `assets/motion_dev/`; Packet 2 owns those contents.
- Editing `manual_testing_playbook/`; Packet 1 owns that content.
- Inventing a new router manifest file or a new metadata mechanism.
- Creating a skill `description.json` if it does not already exist.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `spec.md` | Create | Packet 3 Level 2 specification |
| `plan.md` | Create | Packet 3 implementation plan |
| `tasks.md` | Create | Packet 3 task ledger |
| `checklist.md` | Create | Packet 3 verification checklist |
| `implementation-summary.md` | Create | Completion summary and validation evidence |
| `.opencode/skills/sk-code/references/webflow/**/*.md` | Modify | Additive cross-stack `motion_dev/` pointers in 10 Webflow docs |
| `.opencode/skills/sk-code/assets/webflow/patterns/wait_patterns.js` | Modify | Additive JSDoc pointer for Motion wait helper |
| `.opencode/skills/sk-code/SKILL.md` | Modify | Resource domains, routing discussion, and Motion availability |
| `.opencode/skills/sk-code/README.md` | Modify | Inventory and category description updates |
| `.opencode/skills/sk-code/description.json` | Modify if exists | Capability, keyword, trigger, and timestamp refresh |
| `.opencode/skills/sk-code/graph-metadata.json` | Refresh via tool | Derived metadata sync, no hand edits |
| `.opencode/skills/sk-code/references/router/*.md` | Modify | Existing router docs expose `motion_dev/` as peer animation resource |
| `.opencode/skills/sk-code/changelog/` | Modify | Add 069 changelog entry |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Preserve Webflow guidance in place | No existing Webflow content is removed, relocated, archived, or meaningfully rewritten |
| REQ-002 | Cover every current Webflow Motion mention | Case-insensitive grep target list has matching `motion_dev/` pointers in each file |
| REQ-003 | Use existing router/metadata mechanisms | `motion_dev/` is added to SKILL/README/router docs and derived metadata without creating a new manifest mechanism |
| REQ-004 | Respect packet boundaries | No edits to Packet 1 playbook content or Packet 2 `motion_dev/` content |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Cross-reference paths are correct | Relative links resolve from each Webflow source location to `references/motion_dev/` or `assets/motion_dev/` |
| REQ-006 | Skill metadata is consistent | SKILL.md, README.md, description.json, router docs, and changelog describe `motion_dev/` consistently |
| REQ-007 | Graph metadata is refreshed safely | Existing derived metadata sync is used; if unavailable, no hand edit is made and the limitation is documented |
| REQ-008 | Strict validation passes | Child packet and parent phase folder validate with exit 0 |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The dispatch grep returns 11 Webflow files and each file has an additive `motion_dev/` pointer.
- **SC-002**: Router/resource documentation lists `references/motion_dev/` and `assets/motion_dev/` as peer cross-stack animation resources.
- **SC-003**: SKILL.md, README.md, and description.json mention cross-stack motion.dev availability.
- **SC-004**: Changelog records the 069 parent packet and all three child packet outcomes.
- **SC-005**: Strict validation exits 0 for Packet 3 and for the 069 parent folder.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Existing Webflow docs have rough duplicated sections | Nearby edits could accidentally normalize unrelated content | Patch only additive pointer lines and leave unrelated structure untouched |
| Risk | Router mechanism is narrative, not a formal manifest | Overbuilding a manifest would create drift | Extend SKILL/README/router docs using existing categories |
| Risk | Skill graph metadata refresh mechanism differs from spec graph backfill | Manual edits could violate dispatch constraint | Use derived sync if available; otherwise document no hand edit |
| Dependency | Packet 2 `motion_dev/` files | Cross-links need stable targets | Link only to files requested by Packet 2 and verified present |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

- Documentation edits must be additive, concise, and close to the relevant Motion mention.
- Link text must make the boundary clear: Webflow guidance remains authoritative for Webflow CDN/Designer concerns; `motion_dev/` owns cross-stack API/decision guidance.
- Metadata changes must preserve existing JSON structure and naming conventions where possible.
- New Markdown uses ASCII punctuation.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

- Files with a single passing Motion mention should receive an inline or short nearby pointer rather than a large blockquote.
- JavaScript asset comments should use JSDoc-compatible prose rather than Markdown-only admonition syntax.
- `description.json` uses `trigger_examples` today, not `trigger_phrases`; Packet 3 can add motion examples while preserving the existing schema shape.
- The skill graph derived sync can update only the `derived` block of `graph-metadata.json`; non-derived fields remain as-is.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ESTIMATION

| Dimension | Estimate | Rationale |
|-----------|----------|-----------|
| Files touched | Medium | 11 cross-ref files, metadata docs, router docs, changelog, and packet docs |
| Behavioral risk | Low | Documentation and metadata only |
| Coordination risk | Medium | Must avoid Packet 1/2-owned folders while linking to their outputs |
| Verification complexity | Medium | Requires strict validation, grep audits, and skill graph/index refresh evidence |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None blocking. The router audit found no standalone surface manifest; Packet 3 will update the existing SKILL/README/router resource listings.
<!-- /ANCHOR:questions -->
