---
title: "Feature Specification: sk-prompt changelog and version verification (032 phase 004.006)"
description: "This verification-only phase confirms that the sk-prompt hub, prompt-improve, and prompt-models release records document the completed kebab-case rename set and that their version metadata agrees with the new changelog entries. It does not rename files or rewrite frozen historical changelogs."
trigger_phrases:
  - "sk-prompt changelog verification"
  - "sk-prompt rename release evidence"
  - "sk-prompt phase 006 verification"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/008-component-migration/004-sk-prompt/006-changelog-verify"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/008-component-migration/004-sk-prompt/006-changelog-verify"
    last_updated_at: "2026-07-14T18:04:33Z"
    last_updated_by: "codex"
    recent_action: "Authored the verification-only changelog and version specification"
    next_safe_action: "Capture the post-migration release metadata and locate the matching changelog entries"
    blockers: []
    key_files:
      - ".opencode/skills/sk-prompt/changelog/"
      - ".opencode/skills/sk-prompt/prompt-improve/changelog/"
      - ".opencode/skills/sk-prompt/prompt-models/changelog/"
      - ".opencode/skills/sk-prompt/SKILL.md"
      - ".opencode/skills/sk-prompt/prompt-improve/SKILL.md"
      - ".opencode/skills/sk-prompt/prompt-models/SKILL.md"
    completion_pct: 0
    open_questions:
      - "The execution-time release version and exact new changelog filenames are not known during this authoring pass."
    answered_questions:
      - "The current inventory includes root v1.0.0.0, prompt-improve v2.3.0.0, and prompt-models v0.9.0.0 changelog history."
      - "Current prompt-models metadata shows SKILL.md 0.9.0.1 versus description.json 0.9.0.0; phase verification must resolve or report this mismatch."
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: sk-prompt changelog and version verification

> Phase adjacency under the sk-prompt component parent (grouping order, not a runtime dependency): predecessor `005-benchmark`; successor `007-skill-gate`.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | sk-doc/020-hyphen-naming-convention/008-component-migration/004-sk-prompt/006-changelog-verify |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-14 |
| **Owner skill** | sk-prompt |
| **Origin** | Verification phase 006 of the sk-prompt component subtree under the 032 kebab-case filesystem-naming program |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The path phases can complete while release records still omit the rename set or point at the wrong version. The live surface has separate changelog histories for the hub, prompt-improve, and prompt-models packets, and the current prompt-models metadata already exposes a version divergence (`SKILL.md` 0.9.0.1 versus `description.json` 0.9.0.0). This phase verifies post-migration release evidence and reports unresolved metadata contradictions without rewriting historical records.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Verify a new changelog entry exists for the hub, prompt-improve, and prompt-models release surfaces after the path phases.
- Confirm each entry names the completed kebab-case rename set, preserved exemptions, and the relevant version bump.
- Compare the changelog version with `SKILL.md`, `description.json`, `graph-metadata.json`, and other active release metadata where present.
- Confirm the entry's file list and references match the phase 001–005 disposition maps.
- Record evidence for the final phase 007 rollup gate.

### Out of Scope
- Any filesystem rename, reference rewrite, or benchmark/playbook migration.
- Rewriting v1.0.0.0, v2.3.0.0, v0.9.0.0, or any other historical changelog entry.
- Inventing a release version, silently normalizing a metadata mismatch, or editing skill metadata in this verification phase.
- Changes to code, scripts, identifiers, data keys, frontmatter fields, or tool-mandated names.

### Files to Inspect

| File Path | Verification |
|-----------|--------------|
| `sk-prompt/changelog/` | Locate the hub release entry for the completed rename set |
| `prompt-improve/changelog/` | Locate the prompt-improve release entry and compare its version |
| `prompt-models/changelog/` | Locate the prompt-models release entry and compare its version |
| `SKILL.md`, `description.json`, `graph-metadata.json` | Compare active version metadata and path references |
| Phase 001–005 checklists/evidence | Match release claims to the actual path and exemption maps |
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 [P0] | Release entries exist | Each sk-prompt release surface has a new entry whose version and date are captured in evidence |
| REQ-002 [P0] | Entries match the rename set | Entries identify the completed authored path changes and the preserved Python, tool-mandated, generated, and frozen exemptions |
| REQ-003 [P0] | Version metadata is coherent | Entry versions agree with active skill/descriptor metadata, or a contradiction is explicitly reported and blocks sign-off |
| REQ-004 [P1] | Historical records remain frozen | Existing changelog files and historical narratives are unchanged |
| REQ-005 [P1] | Rollup handoff is complete | Phase 007 receives release-entry paths, version comparisons, and any unresolved finding |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The three release surfaces each have a matching changelog entry for the completed sk-prompt rename work.
- **SC-002**: Changelog claims agree with phases 001–005 and their exemption/disposition evidence.
- **SC-003**: Version fields and release filenames are coherent, with no unreported metadata mismatch.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

The primary risk is treating an old historical entry as evidence for the new migration or accepting a version bump while active metadata still disagrees. The phase depends on completed path-phase evidence and must fail closed when a release entry is missing or a version contradiction cannot be resolved without a separate authorized change.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

The release version and date are execution-time values. The verifier must record them from the candidate release metadata; it must not infer them from the current version mismatch.
<!-- /ANCHOR:questions -->
