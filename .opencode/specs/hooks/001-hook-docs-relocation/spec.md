---
title: "Feature Specification: Hook Reference Docs Relocation"
description: "Move the four hook reference documents out of system-spec-kit/references/hooks into their owning trees: .opencode/hooks for the injection contract and goal plugin, system-skill-advisor for the advisor hook contracts, with all consumers repointed."
trigger_phrases:
  - "hook docs relocation"
  - "references/hooks move"
  - "injection contract home"
  - "skill advisor hook reference"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks/001-hook-docs-relocation"
    last_updated_at: "2026-08-06T07:42:39Z"
    last_updated_by: "pi-terminal-engineer"
    recent_action: "Relocated four hook contracts and repointed 34 live consumers"
    next_safe_action: "No follow-up required; packet verification is complete"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "decision-record.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-05-system-speckit-032"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Hook Reference Docs Relocation

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-08-05 |
| **Track** | hooks |
| **Packet** | 001-hook-docs-relocation |
| **Predecessor** | None |
| **Successor** | None |
| **Handoff Criteria** | Four docs relocated to owning trees, every consumer repointed, stale references proven gone, packet validated strictly green |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The folder `.opencode/skills/system-spec-kit/references/hooks/` holds four documents that describe hooks, not the spec-kit itself: the injection visibility contract, the goal plugin operator contract, and two skill-advisor hook adapter contracts. The repo already has a unified hook home at `.opencode/hooks/` whose own README must reference the injection contract from outside that tree, and the skill-advisor contracts describe adapters that live in `system-skill-advisor/hooks/`. Reference material sits two or three hops away from the code and owners it documents, so operators must know an unrelated skill's tree layout to find hook contracts, and the owner trees cannot ship or version their own docs.

### Purpose

Relocate each of the four documents to the tree that owns the behavior it documents, repoint every in-repo consumer to the new paths, and prove by grep that no stale reference remains. No code changes; documentation placement only.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- `goal-plugin.md` moves to `.opencode/hooks/goal/` (the goal plugin and its cross-runtime siblings live there).
- `injection-contract.md` moves to `.opencode/hooks/` root (the unified hook tree owns the cross-runtime injection visibility taxonomy; `.opencode/hooks/README.md` already points at it).
- `skill-advisor-hook.md` and `skill-advisor-hook-validation.md` move into `system-skill-advisor/hooks/` (the tree that owns the adapters).
- Every in-repo consumer repointed: system-spec-kit SKILL.md, README.md, feature-catalog, changelog, ENV-REFERENCE.md, mcp-server hook READMEs, plugin-bridges README, constitutional docs, leaf manifest, `.opencode/hooks/README.md`, `.cursor/hooks/README.md`, AGENTS.md, and any further references the executor finds.
- Relative link rewrites inside the moved documents so they resolve from the new location.
- Packet documentation and strict validation.

### Out of Scope

- Moving or renaming hook adapter code, plugins, or runtime registration.
- Moving `references/config/hook-system.md` (a config reference, not a hook doc).
- Rewriting the content of the four documents beyond link and path updates.
- Any change to hook behavior or registration files.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/references/hooks/` | Delete | Four docs leave; folder removed if empty |
| `.opencode/hooks/goal/goal-plugin.md` | Create | Moved contract |
| `.opencode/hooks/injection-contract.md` | Create | Moved contract |
| `.opencode/skills/system-skill-advisor/hooks/skill-advisor-hook.md` | Create | Moved contract |
| `.opencode/skills/system-skill-advisor/hooks/skill-advisor-hook-validation.md` | Create | Moved contract |
| Consumers listed above | Modify | Repoint references |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Ownership verified before any move | A placement matrix records, per document, the owner tree and the evidence that the owner already hosts the related behavior |
| REQ-002 | All four documents relocated | `test -f` passes at each new path; old paths return not-found |
| REQ-003 | Every consumer repointed | Repo-wide grep for the old path strings returns zero hits outside git history and archives |
| REQ-004 | Relative links inside moved docs resolve | SPECKIT_VALIDATE_LINKS=true wikilink check and manual relative-path checks pass |
| REQ-005 | Packet passes strict validation | validate.sh --strict exits 0 |
| REQ-006 | No unrelated files changed | git status shows only the packet, the moved docs, and the consumer repoints |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | git history preserved | Moves use git mv so the rename is traceable |
| REQ-008 | AGENTS.md directive-capsule pointer updated | The pointer names the new injection-contract path |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The four docs live beside the behavior they document, and each owning tree carries its own contract without cross-skill indirection.
- **SC-002**: A repo-wide grep for `system-spec-kit/references/hooks` finds no live consumer.
- **SC-003**: The unified hook tree README points to a sibling doc instead of a foreign skill path.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Missed consumers break operator docs silently | Med — stale pointers in READMEs and skill docs | Exhaustive grep before and after; SC-002 proves zero residual hits |
| Risk | Relative links inside moved docs break | Med — broken navigation from the new home | Link audit as part of REQ-004 |
| Risk | system-spec-kit skill validation complains about moved reference docs | Low — leaf manifests may enumerate reference files | Run system-spec-kit skill validation after the move |
| Dependency | git available for rename tracking | Low | REQ-007 |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Resolved: system-spec-kit `leaf-aliases.json` and `leaf-manifest.json` dropped the four files because guarded skill routing cannot target documents outside the skill root; feature catalogs now point to the owner paths.
- Resolved: no new root README was needed under `system-skill-advisor/hooks/`; the existing `claude/`, `pi/`, and `lib/` READMEs establish code ownership, and the two contracts are directly discoverable at the hook root.
<!-- /ANCHOR:questions -->
