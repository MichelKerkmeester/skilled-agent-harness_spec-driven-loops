---
title: "Feature Specification: Public Doc Internal Spec Reference Removal [template:level_2/spec.md]"
description: "Remove hardcoded internal spec packet paths from public-facing commands, setup guides, READMEs, skill references, assets, feature catalogs, and manual testing playbooks."
trigger_phrases:
  - "public docs"
  - "internal spec references"
  - "spec path cleanup"
  - "external user docs"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/032-public-doc-internal-spec-reference-removal"
    last_updated_at: "2026-05-18T09:12:49Z"
    last_updated_by: "codex"
    recent_action: "Scrubbed public-facing internal spec packet references and verified scoped searches"
    next_safe_action: "Ready for final handoff"
    blockers: []
    key_files:
      - "README.md"
      - ".opencode/commands/"
      - ".opencode/install_guides/"
      - ".opencode/skills/"
    session_dedup:
      fingerprint: "sha256:27faaf83fc1a1275e0e3f13ce37a4b498636ccf6a7f6088d3ea2045553833cc9"
      session_id: "public-doc-internal-spec-reference-removal-2026-05-18"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "User requested a new spec folder under the release-cleanup cleanup phase."
      - "Generic user-facing placeholders such as <spec-folder> remain when they describe a user-selected command argument."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Public Doc Internal Spec Reference Removal

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-05-18 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Public-facing docs, commands, setup guides, skill references, assets, feature catalogs, and manual testing playbooks contained direct links to this repository's internal spec packet folders. External users will not have those packet paths, so the references create dead links and expose implementation history where the docs should describe stable user-facing contracts.

### Purpose
Keep public documentation portable by replacing internal packet paths with stable local contract wording, generic placeholders, or direct references to shipped code and docs.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Remove direct `.opencode/specs/...` and `specs/system-spec-kit/...` packet paths from public docs and command assets.
- Update setup/install guides, READMEs, skill references, assets, feature catalogs, and manual testing playbooks where internal packet paths leaked.
- Preserve legitimate user-facing placeholders for commands that accept a user-selected spec folder.

### Out of Scope
- Removing the Spec Kit concept itself from Spec Kit docs, because those docs teach that workflow.
- Rewriting changelog history, unless a changelog is explicitly part of a public release artifact cleanup.
- Changing runtime code behavior beyond undoing accidental non-doc edits from the scrub.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `README.md` | Modify | Remove internal packet links from recent-work prose |
| `.opencode/commands/**` | Modify | Replace command asset internal packet paths with local contract wording |
| `.opencode/install_guides/**` | Modify | Remove setup guide references to internal packets |
| `.opencode/skills/**/{README.md,SKILL.md,references,assets,feature_catalog,manual_testing_playbook}` | Modify | Replace internal provenance paths with portable public wording |
| `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/003-cross-cutting-cleanup-pass/032-public-doc-internal-spec-reference-removal/**` | Create/Modify | Track this cleanup packet |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Public docs must not link to this repo's internal spec packet folders. | `rg` finds no `.opencode/specs/system-spec-kit`, `.opencode/specs/skilled-agent-orchestration`, `specs/system-spec-kit`, or `specs/skilled-agent-orchestration` references in scoped public docs, excluding non-doc runtime files and changelog history. |
| REQ-002 | Command assets must not expose internal upstream packet paths. | Doctor and Spec Kit command assets use local contract/provenance wording instead of `packet: ".opencode/specs/..."`. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Setup/install guides and READMEs should be portable for external users. | Internal packet links are removed or replaced with stable shipped-file references. |
| REQ-004 | Skill references, assets, feature catalogs, and manual playbooks should avoid internal provenance links. | Internal packet provenance is rewritten as local design notes, local fork patch set, or generic user-provided placeholders. |
| REQ-005 | Generic Spec Kit placeholders should remain where they describe user input. | Docs that teach `/spec_kit` or memory workflows can still use placeholders such as `<spec-folder>` when they represent a user-selected path. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Scoped search returns no hardcoded internal packet path references in public-facing markdown/YAML/JSON assets.
- **SC-002**: Command assets do not contain upstream `packet` fields pointing at internal specs.
- **SC-003**: The cleanup packet validates with `validate.sh --strict`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Over-scrubbing real command examples | Medium | Preserve generic placeholders that represent user-provided paths. |
| Risk | Bulk replacement touching non-doc files | Medium | Inspect diff and restore accidental runtime-file edits. |
| Dependency | Existing docs use both `specs/` and `.opencode/specs/` aliases | Low | Treat concrete internal packet paths differently from generic Spec Kit root examples. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Use search-and-replace tooling without running broad generators or reindexing unrelated assets.
- **NFR-P02**: Keep verification searches scoped to public-facing docs and assets.

### Security
- **NFR-S01**: Do not expose private/local absolute paths or internal packet links in public docs.
- **NFR-S02**: Do not alter secrets, credentials, or runtime auth surfaces.

### Reliability
- **NFR-R01**: Preserve command behavior and only edit public-facing docs/assets unless a non-doc accidental edit must be restored.
- **NFR-R02**: Validate the spec packet after documentation updates.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty search result: Treat as pass only when the search command covered the requested surfaces.
- Generic placeholder: Keep `<spec-folder>` when it is a user-provided argument, not an internal packet leak.
- Internal package script: Restore runtime command paths if a broad replacement touches code/config outside the doc cleanup scope.

### Error Scenarios
- Search pattern overmatches: Inspect affected diff and narrow the replacement.
- Validator warning: Patch the spec docs rather than ignoring the warning.
- Interrupted turn: Check for running commands before final completion.

### State Transitions
- Partial cleanup: Document remaining generic placeholders and why they remain.
- Additional surfaces requested: Re-run scoped searches before editing.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 16/25 | Multiple public doc surfaces and generated catalogs/playbooks |
| Risk | 12/25 | Bulk replacement can touch non-doc files if scoped poorly |
| Research | 8/20 | Requires distinguishing internal packet links from generic Spec Kit workflow examples |
| **Total** | **36/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- Answered: Generic `specs/`, `.opencode/specs/`, and `<spec-folder>` examples remain only where they describe the Spec Kit workflow or a user-selected command argument. Concrete internal packet paths were removed from public docs.
<!-- /ANCHOR:questions -->
