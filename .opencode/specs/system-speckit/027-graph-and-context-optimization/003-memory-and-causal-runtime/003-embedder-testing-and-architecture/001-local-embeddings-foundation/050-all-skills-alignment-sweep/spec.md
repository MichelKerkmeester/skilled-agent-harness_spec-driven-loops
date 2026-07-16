---
title: "Feature Specification: All Skills Alignment Sweep"
description: "Audit and align every .opencode skill documentation surface with sk-doc templates and current MCP/runtime reality."
trigger_phrases:
  - "all skills alignment sweep"
  - "skill docs audit"
  - "sk-doc compliance sweep"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/050-all-skills-alignment-sweep"
    last_updated_at: "2026-05-14T20:40:00Z"
    last_updated_by: "codex"
    recent_action: "Completed all five doc-alignment batches and final verification"
    next_safe_action: "Commit packet close-out"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "decision-record.md"
      - "research/skills-audit.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:ccc6c3b4cd299c8cea876cd3546f636bea290be38916922978a5406cf65f46f0"
      session_id: "015-all-skills-alignment-sweep"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Gate 3 answered by operator: Option B, new Level 3 packet under 027-graph-and-context-optimization."
      - "Next free top-level packet number under 026 is 015."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: All Skills Alignment Sweep

<!-- SPECKIT_LEVEL: 3 -->

---

## EXECUTIVE SUMMARY

Audit and align all 19 skill packages under `.opencode/skills/` plus the root skill index and repository README. The sweep applies sk-doc template expectations, fixes stale current-reality references from recent advisor/code-graph/CocoIndex/embedding restructures, and documents any work that cannot be safely completed inside this doc-only dispatch.

**Key Decisions**: Batch by skill family, keep edits doc-only, document any out-of-scope config/source mismatch as a follow-on packet.

**Critical Dependencies**: sk-doc templates, 013/009 handover, current git log, and strict spec validation.

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | Completed |
| **Created** | 2026-05-14 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The skill docs have accumulated mixed current-state language across recent restructures: standalone `system_skill_advisor`, the `mk-code-index` code-graph rename, post-040 embedding behavior, and sk-doc template hardening. Some surfaces are already aligned, but the repo lacks one cross-skill audit proving every skill was checked.

### Purpose

Produce a verified doc-only sweep where every skill has an explicit aligned/pass/defer status and all changed docs match sk-doc template rules.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Audit the 19 named skills under `.opencode/skills/`.
- Edit authored markdown docs under `.opencode/skills/*/`, `.opencode/skills/README.md`, and repo-root `README.md`.
- Edit skill `description.json` or `graph-metadata.json` only when metadata contradicts current docs.
- Create packet docs and `research/skills-audit.md`.
- Commit by batch on `main`.

### Out of Scope

- Source-code changes in TypeScript, JavaScript, Python, or runtime config JSON/TOML.
- Regenerating metadata through `generate-context.js`.
- Renaming tool IDs, server IDs, or skill IDs.
- Editing sibling spec packets or unrelated dirty files.
- Branch creation, force push, `--no-verify`, archive files, nested cli-codex, or SpawnAgent.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/001-local-embeddings-foundation/050-all-skills-alignment-sweep/**` | Create/Modify | Tracking packet, audit results, verification evidence |
| `.opencode/skills/*/**/*.md` | Modify if needed | Skill docs aligned to sk-doc and current reality |
| `.opencode/skills/README.md` | Modify if needed | Root skill inventory |
| `README.md` | Modify if needed | Public root README current-reality references |
| `.opencode/skills/*/{description,graph-metadata}.json` | Modify only if needed | Surgical metadata correction only |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Audit all 19 skills and root docs | `research/skills-audit.md` lists each skill with pass/aligned/defer status |
| REQ-002 | Apply sk-doc compliance checks | `quick_validate.py` passes for all SKILL.md files and README validator passes for primary READMEs |
| REQ-003 | Align current-reality references | Live docs use standalone `system_skill_advisor`, `mk-code-index` where canonical, and post-040 embedding language where relevant |
| REQ-004 | Keep dispatch doc-only | `git diff --name-only` contains only whitelisted docs/metadata/packet files |
| REQ-005 | Commit logical batches | 5-7 commits on `main`, one per skill family plus close-out if needed |
| REQ-006 | Strict-validate packet | `validate.sh <packet> --strict` exits 0 |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | No silent deferrals | Any unresolved gap appears in `implementation-summary.md` with a concrete follow-on packet name |
| REQ-008 | Root docs current | `.opencode/skills/README.md` and `README.md` checked and updated where stale |
| REQ-009 | Batch verification evidence | Each batch has command evidence recorded in `implementation-summary.md` |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: 19 skills audited with explicit status.
- **SC-002**: Average DQI proxy improves from baseline to close-out.
- **SC-003**: No out-of-scope files edited by this dispatch.
- **SC-004**: Packet strict validation passes.
- **SC-005**: Final binding trace records commits, doc counts, deferrals, and verification state.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Pre-existing dirty launcher state | Accidental unrelated changes could enter commits | Use path-limited staging and verify `git diff --cached --name-only` |
| Dependency | Runtime config rename drift | Docs may reveal config files still on legacy names, but config edits are forbidden | Document as follow-on if outside whitelist |
| Risk | Very large doc surface | Full rewrite would be noisy and unsafe | Use surgical edits backed by automated validation and targeted grep |
| Risk | Historical changelogs contain stale names by design | Over-editing history would distort release notes | Leave historical changelogs unless they present current operator guidance |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance

- **NFR-P01**: Audit commands should be repeatable with `rg`, validators, and focused file reads.

### Security

- **NFR-S01**: Do not expose secrets or modify runtime credentials.

### Reliability

- **NFR-R01**: Commit boundaries must allow clean rollback per batch.

---

## 8. EDGE CASES

### Data Boundaries

- Historical changelogs: leave as historical unless they are active operator guidance.
- Config/source mismatch: document current state and route code/config changes to a follow-on packet.

### Error Scenarios

- Validator failure: patch packet/docs before claiming completion.
- Test failure on doc-only validation: stop, record command output, and fix in scope.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 23/25 | 19 skills, root docs, packet docs |
| Risk | 14/25 | Doc-only but cross-system current-reality claims |
| Research | 18/20 | Recent restructures and current runtime topology |
| Multi-Agent | 0/15 | SpawnAgent and nested cli-codex forbidden |
| Coordination | 12/15 | 5 batches, commit sequencing, pre-existing dirty files |
| **Total** | **67/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Out-of-scope config/source drift discovered | M | M | Record follow-on, do not edit forbidden files |
| R-002 | Validator conflicts with existing accepted docs | M | L | Prefer template-compliant surgical fixes and note template limitation |
| R-003 | Batch commits accidentally include pre-existing dirty files | H | L | Stage explicit paths only |

---

## 11. USER STORIES

### US-001: Operator Trust (Priority: P0)

**As a** repo operator, **I want** every skill doc checked against sk-doc and current runtime reality, **so that** the skill library does not route future agents through stale guidance.

**Acceptance Criteria**:
1. Given the 19-skill scope, When the sweep closes, Then every skill has an audit row and pass/aligned/defer status.

---

### US-002: Current Runtime Navigation (Priority: P0)

**As a** future agent, **I want** docs to name the current advisor/code-graph/CocoIndex surfaces accurately, **so that** I can route tools without guessing from old packet history.

**Acceptance Criteria**:
1. Given current docs, When searching active guidance, Then standalone `system_skill_advisor`, `advisor_*`, `skill_graph_*`, and canonical code-graph naming are documented consistently.

---

## 12. OPEN QUESTIONS

- None for execution. Config/source mismatches found during audit are out of this doc-only scope and must become explicit follow-ons.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- `plan.md`
- `tasks.md`
- `checklist.md`
- `decision-record.md`
- `implementation-summary.md`
- `research/skills-audit.md`
