---
title: "Spec: Align the sk-design README Set to the create-readme Standard"
description: "Expand and align twelve sk-design READMEs (the styles-library folder READMEs plus the sk-design skill-root README) to the sk-doc create-readme template and quality standard. They are currently thin stubs or drifted; make each genuinely useful — purpose, contents, usage, key files, architecture fit — without touching code or bundle data."
trigger_phrases:
  - "styles readme create-readme alignment"
  - "expand sk-design readmes to sk-doc standard"
  - "sk-design readme usefulness template"
importance_tier: "standard"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-design/015-styles-database-evolution/008-styles-readme-create-readme-alignment"
    last_updated_at: "2026-07-22T11:30:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Aligned spec to L3 fixture structure"
    next_safe_action: "Execute the README alignment"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/README.md"
      - ".opencode/skills/sk-design/styles/library/README.md"
      - ".opencode/skills/sk-doc/create-readme/assets/readme-template.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-design-015-008-readme-alignment-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Spec: Align the sk-design README Set to the create-readme Standard

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

## EXECUTIVE SUMMARY

The `007-styles-folder-readmes` packet gave every styles folder a README, but the current set is uneven. Ten of the twelve target READMEs are thin 12-to-19-line stubs with no frontmatter and none of the sk-doc create-readme structure. Two others already carry real detail but have drifted from the tree: `styles/scripts/README.md` documents a `_harness/` directory that no longer holds the script and cites a spec-packet path, and `styles/lib/database/README.md` is dense prose without the code-folder template shape. The `sk-design` skill-root README still references `styles/_engine/` and `styles/_db/`, folders that are now `styles/lib/engine/` and `styles/lib/database/`.

This packet runs one uniform sweep so each of the twelve READMEs conforms to the create-readme standard and is genuinely useful on its own. No code, test or bundle data changes.

**Key Decisions**: One Level 3 monolithic sweep, README shape by folder type, one data-README for the bundle corpus

**Critical Dependencies**: sk-doc create-readme templates, live folder listings

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Spec Folder** | 008-styles-readme-create-readme-alignment |
| **Level** | 3 |
| **Status** | Planned |
| **Verification** | Each of the twelve READMEs conforms to the create-readme template and passes sk-doc quality review; every named file/link resolves on disk; no code or bundle data changed |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The `007-styles-folder-readmes` packet gave every styles folder a README, but most are minimal stubs
(for example `styles/library/README.md` is 15 lines). They state a bare purpose but do not follow the
sk-doc create-readme template and are not genuinely useful — they lack a clear contents map, usage,
key-file descriptions and architecture-fit that the standard prescribes. Two of the twelve are the reverse
problem: `styles/scripts/README.md` and `styles/lib/database/README.md` carry real detail but have drifted
from the current tree and template. The skill-root README references folder paths that no longer exist.

### Purpose

Expand and re-align the twelve READMEs the operator listed so each is a useful, standard-conformant
document that a reader can orient from alone, without touching code, tests or bundle data.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

Align and expand these twelve README files to the create-readme standard:

- `.opencode/skills/sk-design/README.md` (skill root)
- `.opencode/skills/sk-design/styles/lib/README.md`
- `.opencode/skills/sk-design/styles/lib/engine/README.md`
- `.opencode/skills/sk-design/styles/lib/database/README.md`
- `.opencode/skills/sk-design/styles/library/README.md`
- `.opencode/skills/sk-design/styles/library/bundles/README.md`
- `.opencode/skills/sk-design/styles/library/manifests/README.md`
- `.opencode/skills/sk-design/styles/scripts/README.md`
- `.opencode/skills/sk-design/styles/tests/database/README.md`
- `.opencode/skills/sk-design/styles/tests/engine/README.md`
- `.opencode/skills/sk-design/styles/tests/oracle/README.md`
- `.opencode/skills/sk-design/styles/tests/oracle/golden/README.md`

### Out of Scope

- The styles manual-testing playbook and `styles/database/README.md`, owned by sibling packet `009`.
- Any code, test, or bundle-data content.
- The ~1,290 per-bundle folders under `library/bundles/`, which are regenerated data.
- The `styles/docs/` folder, which is not in the operator's list.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| .opencode/skills/sk-design/README.md | Modify | Skill-root README, reconcile backend paths |
| .opencode/skills/sk-design/styles/lib/README.md | Modify | lib overview and key files |
| .opencode/skills/sk-design/styles/lib/engine/README.md | Modify | Flat-file engine and facade |
| .opencode/skills/sk-design/styles/lib/database/README.md | Modify | Database plane to code-folder shape |
| .opencode/skills/sk-design/styles/library/README.md | Modify | Corpus data overview |
| .opencode/skills/sk-design/styles/library/bundles/README.md | Modify | One data-README for the corpus |
| .opencode/skills/sk-design/styles/library/manifests/README.md | Modify | Retrieval manifest data-README |
| .opencode/skills/sk-design/styles/scripts/README.md | Modify | Extractor README, correct drifted tree |
| .opencode/skills/sk-design/styles/tests/database/README.md | Modify | Database test suite orientation |
| .opencode/skills/sk-design/styles/tests/engine/README.md | Modify | Engine test suite orientation |
| .opencode/skills/sk-design/styles/tests/oracle/README.md | Modify | Parity oracle orientation |
| .opencode/skills/sk-design/styles/tests/oracle/golden/README.md | Modify | Golden data-README |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Each README follows its create-readme template | Skill/code/data shape applied and classified through the create-readme workflow |
| REQ-002 | Each README is genuinely useful | Purpose, contents map, usage, key-file descriptions and architecture fit present |
| REQ-003 | Every path and link resolves on disk | Authored from a live listing; no fabricated files, no stale path references |
| REQ-004 | No code, test or bundle-data file modified | `git diff` touches only the twelve README files |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Each README passes sk-doc quality review and HVR | create-quality-control DQI, structure and link checks pass; Human Voice Rules clean |
| REQ-006 | Stale folder-path references corrected | The skill-root README's `styles/_engine/`, `styles/_db/` references are updated to the current `styles/lib/engine/`, `styles/lib/database/` tree |
| REQ-007 | Cross-references between READMEs stay consistent | No README points at a sibling folder by a renamed or removed path; every intra-tree link resolves |

### P2 - Nice-to-have

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-008 | `library/bundles` stays a single data-README | The ~1,290-bundle corpus keeps one explanatory README, not per-bundle docs, per the `007` precedent |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All twelve READMEs conform to the create-readme template structure for their type
- **SC-002**: sk-doc quality review passes for each: no broken links, no fabricated files, HVR clean
- **SC-003**: A reader can understand each folder's purpose, contents and usage from its README alone
- **SC-004**: `git diff` touches only the twelve README files, no code or data
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Describing files that do not exist | Broken reader trust | Author each README from a live `ls` of the folder |
| Risk | Over-expanding a data folder into per-bundle docs | ~1,290 stray files | Keep one README explaining regenerated data, per the `007` precedent |
| Risk | Drift between skill-root README and folder READMEs | Contradictory paths | Classify each with create-readme; skill root uses skill shape, folders use folder/code shape |
| Dependency | create-readme templates | Cannot classify or scaffold | Templates present under `sk-doc/create-readme/assets/` |
| Dependency | Live folder listings | Cannot author current-state content | Read each folder before writing its README |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Readability
- **NFR-R01**: Each README is scannable — a reader reaches purpose and contents within the first screen
- **NFR-R02**: Code-folder READMEs keep diagrams small enough to read in a terminal

### Accuracy
- **NFR-A01**: Every path, file and command named resolves against the current tree
- **NFR-A02**: Content is current-state only, with no packet IDs, phase IDs or migration history in the durable README body

### Consistency
- **NFR-C01**: README type matches folder type — skill root skill shape, code folders code shape, data folders trimmed data-README shape
- **NFR-C02**: All twelve pass the same create-quality-control gate and Human Voice Rules

---

## 8. EDGE CASES

### Folder-Type Boundaries
- Data folders: `library/`, `library/bundles/`, `library/manifests/` and `tests/oracle/golden/` hold regenerated data, not source. They get a trimmed data-README, not the full code-folder shape.
- Already-substantial READMEs: `styles/lib/database/README.md` and `styles/scripts/README.md` already carry real detail. Align them and correct drift rather than discarding accurate content.

### Drift Scenarios
- Skill-root path drift: `sk-design/README.md` names `styles/_engine/` and `styles/_db/`; the real folders are `styles/lib/engine/` and `styles/lib/database/`. The alignment reconciles these references.
- Stale directory tree: `styles/scripts/README.md` shows a `_harness/` tree and a spec-packet path; both are corrected to the real `scripts/` contents and the packet citation removed.

### Count Ambiguity
- Bundle count: existing READMEs state ~1,290 bundles; a raw listing shows 1,292 entries including the README. Confirm the exact count from a live listing at authoring rather than asserting a number.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 8/25 | Files: 12 READMEs, LOC: documentation only, Systems: sk-design styles subtree |
| Risk | 3/25 | Auth: N, API: N, Breaking: N |
| Research | 6/20 | Template classification, drift analysis, link resolution |
| Multi-Agent | 0/15 | Workstreams: 1 |
| Coordination | 3/15 | Dependencies: create-readme templates, sibling `009` boundary |
| **Total** | **20/100** | **Level 3** (operator-designated for doc rigor) |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | A README documents a file or path that does not exist | M | M | Author from a live `ls`; run link resolution in the quality gate |
| R-002 | A data folder is expanded into per-bundle docs | M | L | ADR-003: one data-README for the corpus |
| R-003 | Scope creep into code, tests or bundle data | H | L | ADR-001 single doc sweep; `git diff` scope check gates completion |
| R-004 | A packet ID or phase ID leaks into durable README content | L | M | HVR and evergreen-id rules enforced in the quality gate |
| R-005 | Root README path drift left unresolved | M | M | Explicit edge case and REQ-003 accuracy requirement |

---

## 11. USER STORIES

### US-001: Orient in a code folder (Priority: P0)

**As a** developer landing in `styles/lib/engine/`, **I want** the README to state what the folder owns, its key files and its dependency direction, **so that** I can edit safely without reading every module first.

**Acceptance Criteria**:
1. Given I open `styles/lib/engine/README.md`, When I read the overview, Then I learn it is the flat-file retrieval engine and the default read path
2. Given the key-files section, When I scan it, Then each named file resolves in the folder

### US-002: Understand a data folder (Priority: P1)

**As a** contributor opening `styles/library/bundles/`, **I want** the README to explain that the folder is regenerated data and must not be hand-edited, **so that** I do not desynchronize a bundle from the manifest.

**Acceptance Criteria**:
1. Given the README, When I read it, Then it states the folder is produced by the extractor and read by the manifest and indexer
2. Given the README, When I look for per-bundle docs, Then it explains why there are none

### US-003: Navigate the skill from its root (Priority: P1)

**As a** new reader of `sk-design/README.md`, **I want** accurate references to the styles backend folders, **so that** I can follow links without hitting paths that no longer exist.

**Acceptance Criteria**:
1. Given the skill-root README, When it references the retrieval backend, Then the folder paths match the current tree

---

## 12. OPEN QUESTIONS

- Should the sk-design skill-root README use the full skill-README shape or the lighter folder shape? RESOLVED at planning (ADR-002): skill-README shape.
- The skill-root README references `styles/_engine/` and `styles/_db/`, but the tree is `styles/lib/engine/` and `styles/lib/database/`. Should the alignment correct these references? Proposed: yes, under REQ-003 accuracy. Confirm at authoring.
- `styles/scripts/README.md` shows a stale `_harness/` directory tree and cites a spec-packet path. Both violate current-state accuracy and the create-readme no-packet-ID rule and will be corrected. Confirm the real `scripts/` contents and the `../cursor/` link at authoring.
- Exact bundle count is UNKNOWN: existing READMEs say ~1,290; a raw listing shows 1,292 entries including the README. Confirm from a live listing at authoring.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
- **Implementation Summary**: See `implementation-summary.md`
