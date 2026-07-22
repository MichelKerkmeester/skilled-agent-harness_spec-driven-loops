---
title: "Feature Specification: Expand styles/database/README.md to Spec-Kit Database-Folder Canon"
description: "Expand the 3-line styles/database/README.md stub to match the spec-kit database-folder README shape (structure, purpose, git-ignored vs tracked, how generated and used), modeled on the mcp-server/database README exemplar. Documentation-only; no runtime, schema, or data change."
trigger_phrases:
  - "styles database readme speckit alignment"
  - "expand styles database readme stub"
  - "database folder readme conventions"
importance_tier: "standard"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-design/015-styles-database-evolution/009-manual-testing-playbook-and-db-readme/002-database-readme-speckit-alignment"
    last_updated_at: "2026-07-22T11:30:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Authored L2 spec for database README"
    next_safe_action: "Plan then execute README expansion"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/styles/database/README.md"
      - ".opencode/skills/sk-design/styles/database/.gitignore"
      - ".opencode/skills/system-spec-kit/mcp-server/database/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-design-015-009-002-db-readme-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Shape exemplar resolved: .opencode/skills/system-spec-kit/mcp-server/database/README.md (8 sections)."
---
# Feature Specification: Expand styles/database/README.md to Spec-Kit Database-Folder Canon

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-22 |
| **Branch** | `skilled/v4.0.0.0` |
| **Spec Folder** | 002-database-readme-speckit-alignment |


<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`.opencode/skills/sk-design/styles/database/README.md` is a 3-line stub:

```text
# database/

Holds the git-ignored mutable SQLite publication state for the style library; only this note and `.gitignore` are tracked.
```

It does not resemble the informative README shape the spec-kit database folders use. The exemplar `.opencode/skills/system-spec-kit/mcp-server/database/README.md` documents its directory through eight numbered sections (Overview, Architecture, Package Topology, Directory Tree, Key Files, Boundaries and Flow, Validation, Related). The styles database README should provide the same class of information so a reader understands what the folder holds, why, what is tracked, and how it is produced and consumed.

### Purpose
Expand `styles/database/README.md` to align with the spec-kit database-folder README conventions — describing structure, purpose, the git-ignored-vs-tracked contract, and how the state is generated and used — while accurately reflecting the real on-disk behavior of the styles library's opt-in persistent (SQLite) path. Documentation-only.


<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Rewrite `styles/database/README.md` from a 3-line stub into a sectioned README modeled on the spec-kit database-folder exemplar.
- Document: purpose of the directory, its position in the styles library, package topology, the git-ignored-vs-tracked contract, how generations are produced and consumed, and boundaries.
- Cross-reference the real producers/consumers under `styles/lib/database/` and the path seam `styles/lib/paths.mjs`, and the opt-in adapter `styles/lib/engine/persistent-adapter.mjs` (default `legacy`).

### Out of Scope
- The manual-testing playbook realign/relocate (owned by sibling child `001-playbook-realign-and-relocate`).
- The twelve create-readme READMEs (owned by sibling packet `008`).
- Any change to `.gitignore`, database schema, generation code, retrieval, operator, or vector logic under `styles/lib/`.
- Generating, building, or cutting over any actual database generation.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-design/styles/database/README.md` | Modify | Expand stub to the spec-kit database-folder README shape |


<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | README matches spec-kit database-folder conventions | Sectioned README modeled on the mcp-server/database exemplar; covers structure, purpose, git-ignored vs tracked, how generated/used |
| REQ-007 | README accurately describes the git-ignored dir | The tracked-vs-ignored contract (`*`, `!.gitignore`, `!README.md`) is described exactly as on disk; no fabricated files |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Documentation-only change | `git diff` touches only `styles/database/README.md`; no runtime, schema, generation, or data change |
| REQ-008 | Producers/consumers cited accurately | Names only real modules under `styles/lib/database/` and `styles/lib/engine/` and the path seam `styles/lib/paths.mjs` |
| REQ-009 | Section coverage matches the exemplar | The README carries the same section set as the `mcp-server/database/README.md` exemplar (purpose, structure, tracked-vs-ignored, generation/use, producers/consumers) — no exemplar section silently dropped |


<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The rewritten README reads like — and covers the same concerns as — the spec-kit database-folder READMEs (sections analogous to Overview / Topology / Tree / Key Files / Boundaries).
- **SC-002**: The git-ignored-vs-tracked contract is described exactly as the on-disk `.gitignore` defines it (only `README.md` and `.gitignore` tracked).
- **SC-003**: Every named producer/consumer module exists on disk; no fabricated paths, files, or generations.
- **SC-004**: `git diff` is a single-file documentation change.


<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | README drifts from real on-disk behavior | Misleading docs | Author from the live `styles/database/` dir, its `.gitignore`, and the real `styles/lib/database/**` modules |
| Risk | Over-describing generated artifacts that do not exist yet | Fabricated file names | Describe generation classes generically (git-ignored SQLite generations), not invented filenames; the persistent path is off by default |
| Dependency | Exemplar README | Cannot mirror the canonical shape | `.opencode/skills/system-spec-kit/mcp-server/database/README.md` present and readable |
| Dependency | Producers/consumers under `styles/lib/` | Cannot cite real modules | `indexer.mjs`, `retrieval.mjs`, `operator.mjs`, `vectors.mjs`, `schema.mjs`, `generation-manifest.mjs`, `canonical.mjs`, `stage-telemetry.mjs`, `paths.mjs`, `persistent-adapter.mjs` confirmed present |


<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Accuracy
- **NFR-A01**: Every path, filename, and module named in the README exists on disk at authoring time.
- **NFR-A02**: The tracked-vs-ignored statement matches `styles/database/.gitignore` byte-for-byte in meaning.

### Consistency
- **NFR-C01**: Section structure is analogous to the spec-kit database-folder exemplar (numbered sections, code-fenced topology/tree).

### Non-Regression
- **NFR-R01**: No change to `.gitignore`, `styles/lib/**`, or any data; README-only diff.


<!-- /ANCHOR:nfr -->
---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Empty-at-Rest Directory
- **No generations present**: The persistent path is off by default, so `styles/database/` may contain only `README.md` and `.gitignore` on a clean checkout; the README must describe intended contents as generated/optional, not as guaranteed-present files.

### Tracked-vs-Ignored Boundary
- **`.gitignore` semantics**: `*` ignores everything, `!.gitignore` and `!README.md` re-include exactly two files; the README must not imply any other tracked file.

### Exemplar Divergence
- **Styles-specific reality**: The exemplar describes MCP-server subdirectories (`vectors/`, `checkpoints/`, `backups/`, `migrations/`) that may not exist under styles; only describe subdirectories that actually exist here.


<!-- /ANCHOR:edge-cases -->
---

<!-- ANCHOR:questions -->
## 9. OPEN QUESTIONS

- Exact section count/titles to adopt: mirror all eight exemplar sections, or a trimmed subset appropriate to the smaller styles database dir? **Proposed in `plan.md`; confirm at execution.**
- Whether any `styles/database/` subdirectories exist to document (the exemplar has `vectors/`/`checkpoints/`/`backups/`/`migrations/`); at authoring time `styles/database/` holds only `README.md` + `.gitignore`. **Re-verify the live tree at execution.**


<!-- /ANCHOR:questions -->
---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Parent Spec**: `../spec.md`
- **Sibling Child**: `../001-playbook-realign-and-relocate/spec.md`
- **Shape Exemplar**: `.opencode/skills/system-spec-kit/mcp-server/database/README.md`

<!-- /ANCHOR:related-docs -->
