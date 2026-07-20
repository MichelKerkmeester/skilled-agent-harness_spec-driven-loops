---
title: "Feature Specification: system-skill-advisor hooks"
description: "Audit hook filesystem names and registrations for the system-skill-advisor surface, rename any non-tool-mandated snake_case hook filename found in the pinned baseline, and repair stale path references without changing runtime event or code identifiers."
trigger_phrases:
  - "system-skill-advisor hook naming"
  - "advisor hook registration paths"
  - "kebab-case hook filenames"
  - "prompt submit hook audit"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/008-component-migration/009-system-skill-advisor"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/008-component-migration/009-system-skill-advisor/004-hooks"
    last_updated_at: "2026-07-14T18:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored the hook naming audit contract"
    next_safe_action: "Run the hook inventory and reference audit on the pinned BASE worktree"
    blockers: []
    key_files:
      - ".opencode/skills/system-skill-advisor/hooks"
      - ".opencode/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts"
      - ".opencode/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts"
      - ".opencode/skills/system-skill-advisor/references/hooks/skill_advisor_hook.md"
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "The current hooks tree already has kebab-case filenames: user-prompt-submit.ts and skill-advisor-cli-fallback.ts."
      - "Hook event names and TypeScript identifiers are not filesystem rename targets."
      - "A no-candidate result is valid only when the inventory and registrations are evidence-pinned."
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

# Feature Specification: system-skill-advisor hooks
> Phase adjacency — predecessor `003-references`; successor `005-feature-catalog`.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | sk-doc/020-hyphen-naming-convention/008-component-migration/009-system-skill-advisor/004-hooks |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-14 |
| **Owner skill** | sk-doc |
| **Origin** | Phase 004 of the system-skill-advisor component migration |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Hook paths are consumed by runtime settings, install guides, plugin bridges, and the hook reference. The current
advisor hook tree is already kebab-case (user-prompt-submit.ts and skill-advisor-cli-fallback.ts), but related
documentation still contains stale or cross-skill hook paths, and a future baseline may contain an unclassified
snake_case filename. The phase therefore needs an explicit inventory and registration closure rather than assuming a
rename is required.

### Purpose
Prove that every advisor hook filename is within the naming policy, rename only a non-mandated snake_case hook file if
one exists in the pinned baseline, and repair all live registrations and path references.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- .opencode/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts and
  hooks/lib/skill-advisor-cli-fallback.ts as the current naming baseline.
- Hook registrations and path references in SKILL.md, README.md, INSTALL_GUIDE.md, the hook reference,
  plugin bridge docs, runtime configuration, and advisor tests.
- An inventory of any additional hook runtime directories/files present at execution time.

### Out of Scope
- Hook event names (UserPromptSubmit), TypeScript identifiers, environment-variable keys, MCP tool IDs, or
  behavior changes.
- Hook files owned by system-spec-kit, system-code-graph, or other component phases.
- Tool-mandated runtime configuration filenames and generated dist/ output.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| .opencode/skills/system-skill-advisor/hooks/ | Audit/Rename if needed | Prove all hook filenames are canonical; rename only an in-scope candidate |
| .opencode/skills/system-skill-advisor/{SKILL,README,INSTALL_GUIDE}.md | Modify | Repair advisor hook path references |
| .opencode/skills/system-skill-advisor/references/hooks/skill_advisor_hook.md | Modify | Repair live path examples; filename itself belongs to phase 003 |
| .opencode/skills/system-skill-advisor/mcp_server/tests/hooks/ | Modify | Update hook registration/path fixtures where required |
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The hook filename inventory is explicit | The report lists every advisor hook file and classifies it as kebab-case, exempt, or rename; the current two kebab-case files are present. |
| REQ-002 | Any real candidate is renamed safely | A non-tool-mandated snake_case hook filename, if found, has one kebab target and no old live path remains. |
| REQ-003 | Registrations and references resolve | Runtime settings, docs, plugin bridge references, tests, and command examples point to the actual advisor hook paths. |
| REQ-004 | Hook behavior is unchanged | Event names, stdin/stdout envelopes, fail-open behavior, timeout policy, and environment keys retain BASE semantics. |
| REQ-005 | Cross-skill paths are not misattributed | References to another skill's hooks are either corrected to their true owner or recorded as out of scope; advisor paths are not silently substituted. |
| REQ-006 | The no-rename result is accepted when proven | If no candidate exists, the checklist contains the inventory and zero-candidate evidence instead of fabricating a rename. |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The advisor hook tree contains no unclassified in-scope snake_case filename.
- **SC-002**: Every live advisor hook registration and reference resolves to the actual kebab-case path.
- **SC-003**: Hook runtime behavior and fail-open safety remain unchanged.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 003 reference-file rename | The hook reference filename may change while its hook path examples are repaired | Apply the reference path map independently from the hook-file inventory. |
| Risk | A cross-skill hook is mistaken for an advisor hook | Runtime routing can point at the wrong owner | Resolve ownership from the registration and source path before changing it. |
| Risk | A no-op phase is reported without evidence | Hidden stale paths survive into the subtree gate | Require a complete path inventory, old-name scan, and registration smoke check. |
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None blocking. The current tree predicts a no-rename result; execution must confirm that prediction against the pinned
BASE and retain evidence for every hook registration.
<!-- /ANCHOR:questions -->
