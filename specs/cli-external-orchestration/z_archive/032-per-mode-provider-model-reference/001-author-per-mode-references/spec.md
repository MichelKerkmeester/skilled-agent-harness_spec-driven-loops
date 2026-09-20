---
title: "Feature Specification: Phase 1 — author per-mode providers-and-models references"
description: "Provider/model/invocation facts for each cli mode are scattered across SKILL.md, cli-reference.md, and prompt templates with no dedicated home; this phase creates one dedicated reference file per mode."
trigger_phrases:
  - "cli providers and models reference"
  - "per-mode provider model catalog"
  - "cli dispatch model reference file"
  - "providers-and-models.md authoring"
  - "cli mode model roster reference"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/033/001-author-per-mode-references"
    last_updated_at: "2026-07-29T08:35:29Z"
    last_updated_by: "template-author"
    recent_action: "Author phase-1 spec"
    next_safe_action: "Author the six providers-and-models.md files"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/001-author-per-mode-references"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 1 — author per-mode providers-and-models references

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-07-29 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 1 of 4 |
| **Predecessor** | None |
| **Successor** | 002-register-and-wire |
| **Handoff Criteria** | All six `providers-and-models.md` exist with valid 5-field frontmatter and template structure; each mode's file accurately reflects that mode's models |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 1** of the per-mode provider/model reference decomposition.

**Scope Boundary**: Create six new reference files only. No trimming of existing files (Phase 3), no manifest/router wiring (Phase 2). Purely additive — zero risk to existing behavior.

**Dependencies**:
- Reference-file template `.opencode/skills/sk-doc/create-skill/assets/skill/skill-reference-template.md`
- Existing per-mode `cli-reference.md` model sections and `SKILL.md` rosters (source of truth for the enumeration)

**Deliverables**:
- `cli-opencode/references/providers-and-models.md`
- `cli-claude-code/references/providers-and-models.md`
- `cli-codex/references/providers-and-models.md`
- `cli-cursor/references/providers-and-models.md`
- `cli-devin/references/providers-and-models.md`
- `cli-pi/references/providers-and-models.md`

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Each cli mode scatters its provider/model/invocation facts across its `SKILL.md` roster, its `references/cli-reference.md` model section, and model pins in `integration-patterns.md` / `assets/prompt-templates.md`. There is no single dedicated file a reader can open to see that mode's providers, models, personas, effort tiers, and dispatch shapes.

### Purpose
Create one dedicated `references/providers-and-models.md` per mode as the single, focused catalog of that mode's providers, models, and how to invoke.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Author six `references/providers-and-models.md` files (one per mode) with mandatory 5-field frontmatter and reference-template structure
- Accurate enumeration of each mode's providers, model ids, defaults, personas, and reasoning-effort mechanism
- LINK (not copy) to external authorities: `sk-prompt/prompt-models/assets/model-profiles.json`, `system-deep-loop/runtime/lib/deep-loop/executor-config.ts` (cursor allowlist), `system-deep-loop/runtime/scripts/fanout-run.cjs`

### Out of Scope
- Trimming existing files — deferred to Phase 3 (keeps this phase zero-risk)
- Manifest/router wiring — deferred to Phase 2
- Editing advisor-routing JSON (`description.json`/`graph-metadata.json`/`hub-router.json`) — preserved throughout

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `cli-external-orchestration/cli-opencode/references/providers-and-models.md` | Create | Multi-provider master catalog (deepseek/kimi/glm/minimax/xiaomi/OpenAI GPT-5.6) |
| `cli-external-orchestration/cli-claude-code/references/providers-and-models.md` | Create | Anthropic model catalog + `--effort` lever |
| `cli-external-orchestration/cli-codex/references/providers-and-models.md` | Create | GPT-5.5/5.6 catalog + effort ladder |
| `cli-external-orchestration/cli-cursor/references/providers-and-models.md` | Create | Composer + 10-id allowlist (mirror, with enforcement link) |
| `cli-external-orchestration/cli-devin/references/providers-and-models.md` | Create | adaptive + sub-model roster |
| `cli-external-orchestration/cli-pi/references/providers-and-models.md` | Create | multi-provider passthrough + `--thinking` lever |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Six `providers-and-models.md` files created | All six exist under the correct `<mode>/references/` path |
| REQ-002 | Each file carries valid 5-field frontmatter | `title`, `description`, `trigger_phrases` (3-8), `importance_tier`, `contextType`, `version` present; 1-2 sentence intro then `## 1. OVERVIEW` |
| REQ-003 | Model inventory is accurate per mode | Each file's model ids/defaults match that mode's `cli-reference.md` source |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | External authorities linked, not copied | Enforcement code and prompt-craft profiles referenced by path, not duplicated |
| REQ-005 | cursor 10-id allowlist mirrored with enforcement pointer | cursor file lists the 10 ids and links `CURSOR_SUPPORTED_MODELS` as source of truth |
| REQ-006 | pi file does not fabricate a fixed default model | pi DEFAULTS card states provider `google` / passthrough, no invented default |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `validate.sh 001-author-per-mode-references --strict` passes (Errors: 0)
- **SC-002**: Each mode's file is self-contained enough to answer "which model + how to dispatch" without opening another file
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Model inventory drift from source | Med | Author each file directly from that mode's `cli-reference.md`; do not paraphrase from memory |
| Risk | cursor allowlist becomes stale copy | Med | Mirror the 10 ids but point to `CURSOR_SUPPORTED_MODELS` as the enforced source of truth |
| Dependency | Reference-file template | Low | Template is stable at `sk-doc/create-skill/assets/skill/skill-reference-template.md` |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None open. File naming fixed at `providers-and-models.md` for consistency across all six modes.
<!-- /ANCHOR:questions -->
