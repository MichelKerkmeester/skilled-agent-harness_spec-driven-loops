---
title: "Feature Specification: Hook Parity [system-spec-kit/026-graph-and-context-optimization/007-hook-parity/spec]"
description: "Hook-parity parent for runtime hook parity across Claude / Codex / Copilot / OpenCode plugin: schema fixes, wiring fixes, and parity remediations. Aggregates 8 direct child phase packets."
trigger_phrases:
  - "007-hook-parity"
  - "hook parity"
  - "runtime hook parity"
  - "claude codex copilot opencode hook parity"
  - "001-fix-runtime-hook-parity-findings"
  - "002-copilot-custom-instructions-hook-parity"
  - "003-codex-native-startup-advisor-hooks"
  - "004-fix-claude-freshness-schema-harness"
  - "005-fix-opencode-plugin-loader-bridge"
  - "006-copilot-wrapper-schema-fix"
  - "007-copilot-writer-wiring"
  - "008-docs-impact-remediation"
importance_tier: "important"
contextType: "specification"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/006-operator-tooling/001-hook-parity"
    last_updated_at: "2026-04-25T11:50:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Renamed hook-parity parent to 007-hook-parity after 026 phase root reorder"
    next_safe_action: "Validate packet, then refresh memory index when graph metadata is healthy"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:83f15b899b5b7e4f77153974de794dc993531751d72a0c89ad7975af93e8a2be"
      session_id: "026-phase-root-flatten-2026-04-21"
      parent_session_id: null
    completion_pct: 85
    open_questions: []
    answered_questions: []
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->"
---
# Feature Specification: Hook Parity

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-04-21 |
| **Branch** | `026-graph-and-context-optimization` |
| **Parent Spec** | ../spec.md |
| **Predecessor** | ../004-runtime-executor-hardening/spec.md |
| **Successor** | None |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Runtime hook coverage drifted across Claude, Codex, Copilot, and the OpenCode plugin loader. Each runtime had its own schema, wrapper wiring, and remediation backlog, and those fixes were scattered across packets that also bundled unrelated advisor and code-graph work.

### Purpose
Keep this parent narrow to runtime hook parity: schema fixes, wrapper wiring fixes, and parity remediations across Claude / Codex / Copilot / OpenCode plugin, with each remediation living as a direct child packet.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Keep the active thematic parent at `007-hook-parity/`.
- Place hook-parity remediation packets directly under this root as 001-008.
- Maintain `context-index.md` as the bridge from old phase identity to current child folder.
- Cover central hook parity remediation plus per-runtime remediations for Copilot, Codex, Claude, and the OpenCode plugin loader, alongside the Copilot wrapper schema fix, writer wiring, and the consolidated documentation-impact remediation.

### Out of Scope
- Skill-advisor hook surface, skill-graph daemon, advisor unification, plugin hardening, advisor standards alignment, and skill-advisor hook improvements (now live under `006-skill-advisor/`).
- Code-graph hook improvements and code-graph advisor refinement (now live under `005-code-graph/`).
- Rewriting child-owned requirements or historical implementation narratives.
- Moving root `research/`, `review/`, or `scratch/` support folders.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `context-index.md` | Modify | Bridge index for the 8 hook-parity child phases in this theme. |
| `007-hook-parity/00N-*/` | Move | Hook-parity phase packet roots now live directly under this parent. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

| Phase | Folder | Status | Description |
|-------|--------|--------|-------------|
| 1 | `001-fix-runtime-hook-parity-findings/` | Complete | Feature Specification: 029 — Runtime Hook Parity Remediation |
| 2 | `002-copilot-custom-instructions-hook-parity/` | Complete | Feature Specification: Copilot CLI Hook Parity Remediation |
| 3 | `003-codex-native-startup-advisor-hooks/` | Complete | Feature Specification: Codex CLI Hook Parity Remediation |
| 4 | `004-fix-claude-freshness-schema-harness/` | In Progress | Feature Specification: Claude Hook Findings Remediation |
| 5 | `005-fix-opencode-plugin-loader-bridge/` | Complete | Feature Specification: OpenCode Plugin Loader Remediation |
| 6 | `006-copilot-wrapper-schema-fix/` | Reverted - Needs Reapply | Copilot Wrapper Schema Fix landed historically, then reverted; the top-level wrapper fields must be reapplied. |
| 7 | `007-copilot-writer-wiring/` | Reverted - Needs Reapply | Copilot Writer Wiring landed historically, then reverted; reapply after packet 006 restores the wrapper shape. |
| 8 | `008-docs-impact-remediation/` | Planning | Feature Specification: Documentation Impact Remediation for the hook-parity packets. |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Preserve original child packet evidence. | Every mapped hook-parity phase exists as a direct child folder with root docs and metadata retained. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | Expose a concise context bridge. | `context-index.md` lists the 8 hook-parity child phase names, statuses, summaries, open/deferred items, and current paths. |
| REQ-003 | Keep root support folders discoverable. | Root `research/`, `review/`, and `scratch/` remain referenced as root-level support surfaces. |
<!-- /ANCHOR:requirements -->

---

### Acceptance Scenarios

**Given** this wrapper is opened, **when** a maintainer lists the folder, **then** the 8 hook-parity phases appear as direct child folders 001-008.

**Given** a maintainer needs a hook-parity phase packet, **when** they open `context-index.md`, **then** they can find the old status, summary, and current child path.

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The active parent validates independently.
- **SC-002**: Mapped source packets are direct child folders.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Direct child folders may contain older validation debt | Medium | Validate the active parent separately and preserve child docs unchanged unless requested. |
| Dependency | Root packet phase map | High | Root docs own the active phase map. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:related -->
## Related

Work that previously sat alongside hook parity has been split out:

- **Skill-advisor work** moved to `006-skill-advisor/` (skill-advisor hook surface, skill-graph daemon + advisor unification, plugin hardening, standards alignment, hook improvements).
- **Code-graph hook work** moved to `005-code-graph/` (code-graph hook improvements, code-graph advisor refinement).
<!-- /ANCHOR:related -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. This parent records the requested hook-parity layout.
<!-- /ANCHOR:questions -->
