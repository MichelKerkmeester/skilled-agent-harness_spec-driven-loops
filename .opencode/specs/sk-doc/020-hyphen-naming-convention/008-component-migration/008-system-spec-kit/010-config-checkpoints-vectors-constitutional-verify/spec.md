---
title: "Feature Specification: Config, checkpoints, vectors, and constitutional verification (032 subtree 008 phase 010)"
description: "This verify-only phase audits the runtime agent directories and adjacent system-spec-kit config, checkpoint, vector, and constitutional surfaces for permitted snake_case filesystem names. The pinned inventory has zero rename candidates in the three runtime agent directories; generated/vector/checkpoint artifacts and tool-mandated names retain their exempt disposition."
trigger_phrases:
  - "system-spec-kit agent directory naming audit"
  - "config checkpoints vectors constitutional verify"
  - "zero agent rename candidates"
  - "system-spec-kit phase 010"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/008-component-migration/008-system-spec-kit"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/008-component-migration/008-system-spec-kit/010-config-checkpoints-vectors-constitutional-verify"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored zero-candidate verify docs"
    next_safe_action: "Repeat the scoped zero-candidate scan against the pinned BASE"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: Config, checkpoints, vectors, and constitutional verification

> Verify-only phase under the 008 system-spec-kit subtree. No filesystem rename is owned here.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | sk-doc/020-hyphen-naming-convention/008-component-migration/008-system-spec-kit/010-config-checkpoints-vectors-constitutional-verify |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-14 |
| **Owner skill** | system-spec-kit |
| **Origin** | Phase 010 verification stub for runtime agent and adjacent support surfaces |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The 032 program must distinguish a genuinely compliant agent surface from a scan that silently skipped runtime-specific directories or misclassified artifacts. The pinned baseline has no permitted snake_case filesystem names in `.opencode/agents/`, `.claude/agents/`, or `.codex/agents/`; adjacent `config/`, `checkpoints/`, `vectors/`, `constitutional/`, and `runtime/` paths require a recorded classification so generated/vector artifacts and exact tool names are not reported as migration defects.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Verify the complete filename and directory candidate set under `.opencode/agents/`, `.claude/agents/`, and `.codex/agents/`.
- Verify adjacent `.opencode/skills/system-spec-kit/config/`, `checkpoints/`, `vectors/`, `constitutional/`, and `runtime/` names against the program boundary.
- Record the zero-candidate fact for the three runtime agent directories and classify any underscore-bearing support artifact by exemption.
- Provide evidence for phase 012 without changing the audited surfaces.

### Out of Scope
- Renaming any agent, config, checkpoint, vector, constitutional, or runtime path.
- Changing agent content, tool identifiers, model configuration, generated snapshots, vector databases, or constitutional text.
- Reclassifying Python files/package directories, tool-mandated names, generated/lockfile/vector/checkpoint artifacts, or frozen history as migration targets.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | All three runtime agent directories are scanned. | `.opencode/agents/`, `.claude/agents/`, and `.codex/agents/` have a complete path inventory and zero permitted rename candidates. |
| REQ-002 | Adjacent support surfaces are classified. | Config, checkpoint, vector, constitutional, and runtime names have an explicit candidate or exemption disposition. |
| REQ-003 | The zero-candidate result is reproducible. | The report records BASE, scan scope, command/output, and an empty rename-candidate set for the agent directories. |
| REQ-004 | The verify-only boundary holds. | The phase diff contains documentation only; audited runtime surfaces are unchanged. |
| REQ-005 | The support disposition ledger is handoff-ready. | Every remaining underscore-bearing support path has exactly one rename, exempt, frozen, generated, or tool-mandated disposition, with no unknown entry, and the ledger is retained for the phase 012 rollup. |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The three runtime agent directory scans independently report zero in-scope rename candidates.
- **SC-002**: The adjacent support inventory has no unknown disposition; generated/vector/checkpoint and tool-mandated names are explicitly classified.
- **SC-003**: No migration, content, configuration, or artifact file is changed by this phase.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

An incomplete runtime-directory glob could turn a false zero into missing evidence. Conversely, treating a generated vector database or checkpoint snapshot as an authored filename would broaden the program incorrectly. The scan must be path-scoped, BASE-pinned, and disposition-complete before the phase can hand off to the changelog and rollup gates.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

No blocking questions. The executor must repeat the scan against the pinned BASE and preserve the zero-candidate result as evidence.
<!-- /ANCHOR:questions -->
