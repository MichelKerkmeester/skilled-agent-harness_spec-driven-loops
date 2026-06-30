---
title: "Feature Specification: Phase 004 Runtime Mirrors"
description: "Update runtime mirror references from sk-deep-* to deep-* across .claude, .codex, and .gemini surfaces owned by Phase 004."
trigger_phrases:
  - "070 phase 004"
  - "runtime mirrors"
  - "claude codex gemini deep skill rename"
  - "sk-deep-review -> deep-review"
  - "sk-deep-research -> deep-research"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/056-sk-deep-rename/004-runtime-mirrors"
    last_updated_at: "2026-05-05T16:20:37Z"
    last_updated_by: "cli-codex"
    recent_action: "Initialized Phase 004 runtime mirror artifacts"
    next_safe_action: "Apply runtime mirror text replacements and validate"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "graph-metadata.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "codex-2026-05-05-phase-004"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->
# Feature Specification: Phase 004 Runtime Mirrors

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Blocked |
| **Created** | 2026-05-05 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | `070-sk-deep-rename` |
| **Phase** | 004 of 006 |
| **Handoff Criteria** | `.claude`, `.codex`, and `.gemini` runtime mirror grep returns no old `sk-deep-*` identifiers; child and parent strict validation pass |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phase 001 found runtime mirror files in `.claude`, `.codex`, and `.gemini` that still reference the old deep-loop skill names. These mirrors must match the canonical post-rename skill IDs so runtime-specific agents and commands no longer point readers or dispatch metadata at stale skill names.

### Purpose
Phase 004 performs a scoped text-only rename in runtime mirror trees. The change does not alter agent behavior; it updates descriptions, skill dependency tables, and reference paths from `sk-deep-review` and `sk-deep-research` to `deep-review` and `deep-research`.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Author Phase 004 Level 2 artifacts.
- Replace the old deep review skill ID with `deep-review` in Phase 004-owned `.claude`, `.codex`, and `.gemini` files.
- Replace the old deep research skill ID with `deep-research` in Phase 004-owned `.claude`, `.codex`, and `.gemini` files.
- Include the `.gemini/commands/speckit/deep-research.toml` row tagged `phase=004` in Phase 001 inventory.
- Preserve file formats for Markdown and TOML runtime mirror definitions.
- Run residual grep and strict spec validation.

### Out of Scope
- Editing `.opencode/` internals, root docs, configs, archives, or skill folders.
- Renaming files or directories.
- Changing agent behavior, models, permissions, tools, or dispatch depth.
- Rebuilding advisor databases; Phase 006 owns final advisor verification.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `specs/skilled-agent-orchestration/z_archive/056-sk-deep-rename/004-runtime-mirrors/spec.md` | Create/Update | Phase 004 requirements and scope |
| `specs/skilled-agent-orchestration/z_archive/056-sk-deep-rename/004-runtime-mirrors/plan.md` | Create/Update | Runtime mirror update plan |
| `specs/skilled-agent-orchestration/z_archive/056-sk-deep-rename/004-runtime-mirrors/tasks.md` | Create/Update | Concrete execution tasks |
| `specs/skilled-agent-orchestration/z_archive/056-sk-deep-rename/004-runtime-mirrors/checklist.md` | Create/Update | Level 2 verification checklist |
| `specs/skilled-agent-orchestration/z_archive/056-sk-deep-rename/004-runtime-mirrors/implementation-summary.md` | Create/Update | Completion summary required by strict validation |
| `specs/skilled-agent-orchestration/z_archive/056-sk-deep-rename/004-runtime-mirrors/graph-metadata.json` | Create/Update | Canonical graph metadata for the phase |
| `.claude/agents/deep-research.md` | Update | Replace old research skill path reference |
| `.claude/agents/deep-review.md` | Update | Replace old review skill description and path references |
| `.claude/agents/orchestrate.md` | Update | Replace old research skill dependency reference |
| `.codex/agents/deep-research.toml` | Update | Replace old research skill path reference |
| `.codex/agents/deep-review.toml` | Update | Replace old review skill description and path references |
| `.codex/agents/orchestrate.toml` | Update | Replace old research skill dependency reference |
| `.gemini/agents/deep-research.md` | Update | Replace old research skill path reference |
| `.gemini/agents/deep-review.md` | Update | Replace old review skill description and path references |
| `.gemini/agents/orchestrate.md` | Update | Replace old research skill dependency reference |
| `.gemini/commands/speckit/deep-research.toml` | Update | Replace old research and review skill references in Gemini command mirror |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Update Claude runtime mirror references | `grep -rln "sk-deep-review\\|sk-deep-research" .claude` returns no rows |
| REQ-002 | Update Codex runtime mirror references | `grep -rln "sk-deep-review\\|sk-deep-research" .codex` returns no rows |
| REQ-003 | Update Gemini runtime mirror references | `grep -rln "sk-deep-review\\|sk-deep-research" .gemini` returns no rows |
| REQ-004 | Preserve runtime mirror scope | Git diff touches only `.claude`, `.codex`, `.gemini`, and this phase folder |
| REQ-005 | Preserve runtime file formats | TOML and Markdown remain parseable/text-valid after replacements |
| REQ-006 | Validate documentation | Child and parent strict validation exit 0 |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: **Given** Phase 001 runtime inventory rows, **When** Phase 004 applies replacements, **Then** every listed old-name occurrence is rewritten to the new skill names.
- **SC-002**: **Given** `.claude` runtime mirror files, **When** residual grep runs, **Then** no old `sk-deep-*` rows remain.
- **SC-003**: **Given** `.codex` runtime mirror files, **When** residual grep runs, **Then** no old `sk-deep-*` rows remain.
- **SC-004**: **Given** `.gemini` runtime mirror files, **When** residual grep runs, **Then** no old `sk-deep-*` rows remain.
- **SC-005**: Child and parent spec validation both exit 0 in strict mode.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | `.gemini/commands` omitted because the brief highlights agent directories | Medium | Use Phase 001 `phase=004` inventory as the ownership source |
| Risk | Mechanical replacement creates backup files | Low | Use no-backup replacement or remove `.bak` files before verification |
| Risk | A runtime README contains stale references | Low | Read README files and include them if grep finds old names |
| Risk | Parallel Phase 003 edits overlap unexpectedly | Low | Stay outside `.opencode/` and root/config surfaces |
| Dependency | Phase 001 inventory | High | Filtered `inventory.tsv` identifies exact runtime mirror rows |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

The `.gemini/commands/speckit/deep-research.toml` file is included because it is explicitly tagged `phase=004` in Phase 001 inventory and lives under the `.gemini` runtime mirror tree.

Open blocker: `.codex/agents` and `.codex/config.toml` are readable but write-blocked in this sandbox (`touch .codex/agents/.codex_write_test` returns `Operation not permitted`). Four residual `.codex` files still contain old names.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

- **Scope Safety**: No `.opencode`, root doc, config, archive, or unrelated runtime mirror changes.
- **Traceability**: Tasks and checklist record grep and validation evidence.
- **Determinism**: Replacements are exact string substitutions only.
- **Format Safety**: TOML files keep quoting and multiline prompt content intact.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Runtime command mirrors can embed long prompt strings on one TOML line; exact replacement must preserve escaping.
- README files may exist but already use target names; reading them is enough unless grep shows old identifiers.
- Cross-runtime orchestrator dependency tables can reference the skill name without a path.
- Path references such as `.opencode/skills/sk-deep-research/...` must become `.opencode/skills/deep-research/...`.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Axis | Rating | Reason |
|------|--------|--------|
| File Count | Low | Phase 001 lists 10 old-name-bearing runtime files |
| Behavioral Risk | Low | Text-only references, no execution logic changes |
| Coordination Risk | Low | Phase owns `.claude`, `.codex`, and `.gemini`; Phase 003 owns `.opencode` |
| Verification Risk | Low | Exact residual grep and strict validation are deterministic |
<!-- /ANCHOR:complexity -->
