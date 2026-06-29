---
title: "Feature Specification: AI Fingerprint Registry"
description: "The audit mode detects model-specific AI tells from a prose catalog only, with no way to machine-check them or bind them to fixtures. This adds a structured per-model registry, a generated self-defect card, and a catalog-to-registry parity validator."
trigger_phrases:
  - "d1-r3 ai fingerprint registry"
  - "ai tell registry design build"
  - "design audit anti-slop registry"
importance_tier: "normal"
contextType: "general"
status: "complete"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/039-design-enforcement-build/001-d1-residual-craft/003-ai-fingerprint-registry"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Upgraded spec to Level 2; recorded parity-now vs detection-needs-004-fixtures split"
    next_safe_action: "Run validate.sh --strict; let orchestrator regenerate description and graph metadata"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/design-audit/assets/ai_fingerprint_registry.json"
      - ".opencode/skills/sk-design/design-audit/assets/ai_fingerprint_self_defect_card.md"
      - ".opencode/skills/sk-design/shared/scripts/ai-fingerprint-registry-check.mjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-agent-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Parity enforceable now vs per-tell detection needing phase 004 fixtures: resolved as a deliberate fixture_id-named forward split"
---
# Feature Specification: AI Fingerprint Registry

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-28 |
| **Branch** | `003-ai-fingerprint-registry` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The audit mode detects model-specific AI tells from a prose catalog only (`design-audit/references/ai_fingerprint_tells.md`). The design-authoring counterpart already has two enforceable layers for the same tells, so audit tells cannot be machine-checked or bound to fixtures. A tell can drop out of the catalog, or a catalog entry can drift from any structured representation, and nothing fails.

### Purpose
Give the audit mode a structured per-model AI-tell registry plus a generated self-defect card, matching the enforceable layers the authoring side already has. A deterministic validator then fails when a catalog tell has no matching registry row, so tells become machine-checkable rather than a prose catalog alone.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A new registry `design-audit/assets/ai_fingerprint_registry.json` with one row per catalog tell and a fixed seven-field schema: `tell_id, model_family, self_defect_prompt, deterministic_check, fixture_id, severity_floor, owner`.
- A generated self-defect card `design-audit/assets/ai_fingerprint_self_defect_card.md`, one self-audit prompt per registry row.
- A new parity validator `shared/scripts/ai-fingerprint-registry-check.mjs` that fails any catalog tell lacking a registry row and any malformed or orphan row.
- Additive audit-mode wiring: a resource-map entry in `design-audit/SKILL.md` and a cross-link in `design-audit/references/ai_fingerprint_tells.md`.

### Out of Scope
- The fixture corpus itself, which the sibling phase 004 owns. This phase references fixtures by stable `fixture_id` slug but creates no fixture files.
- Running tells against real design output. Per-tell deterministic detection becomes runnable once the fixtures land.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `sk-design/design-audit/assets/ai_fingerprint_registry.json` | Create | Nine-row per-model registry with the seven-field schema |
| `sk-design/design-audit/assets/ai_fingerprint_self_defect_card.md` | Create | Generated self-defect card, one prompt per row |
| `sk-design/shared/scripts/ai-fingerprint-registry-check.mjs` | Create | Catalog-to-registry parity and schema validator |
| `sk-design/design-audit/SKILL.md` | Modify | Additive resource-map entry for the registry and card |
| `sk-design/design-audit/references/ai_fingerprint_tells.md` | Modify | Additive cross-link to the registry mirror |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The registry holds one well-formed row per catalog tell, every row carrying all seven schema fields | The validator exits 0 on the authored registry and prints `catalogTells=N registryRows=N` with the counts equal |
| REQ-002 | The validator fails deterministically when a catalog tell has no matching registry row | Removing one row yields a non-zero exit naming the orphaned catalog tell |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | The self-defect card carries one self-audit prompt per registry row, grouped by model family | The card prompt count equals the registry row count |
| REQ-004 | Additive and evergreen | Only the named files change, no prose lines are removed, and no shipped artifact embeds spec, packet, or phase identifiers |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The authored registry passes the validator at exit 0 with equal catalog-tell and registry-row counts (9 = 9), and a removed row fails deterministically at exit 1 naming the orphaned tell.
- **SC-002**: Every row carries the full seven-field schema with in-vocabulary `model_family`, `severity_floor`, and `owner`, the self-defect card mirrors the rows one-to-one, and the wiring edits are additive with zero removed prose lines.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Parity and schema are enforceable now, but per-tell detection is not; the validator does not yet run a tell against real output | Med | Scope the gate honestly to parity plus schema completeness; record the detection layer as dependent on the phase 004 fixtures named in `fixture_id` |
| Risk | A reader treats the registry as a second source of truth that could drift from the catalog | Med | The validator enforces both forward parity (every tell has a row) and reverse parity (no orphan rows), so divergence fails the gate rather than passing silently |
| Risk | A `fixture_id` reads as a live binding before the corpus exists | Low | The validator checks `fixture_id` presence and slug shape only; file resolution is deferred to phase 004, which the `fixture_id` slugs name forward |
| Dependency | Prose catalog `ai_fingerprint_tells.md` | Registry rows cannot mirror the catalog if it moves | Mirror by stable tell slug, never by line number |
| Dependency | Sibling phase 004 fixture corpus | Per-tell detection cannot run until the fixtures land | Name fixtures by stable `fixture_id` slug now; defer file resolution |
| Dependency | Node ESM runtime | Validator cannot run without it | Stdlib-only Node ESM, no external dependency |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The validator runs in well under a second on one catalog file and one registry file (two reads, linear scans).

### Security
- **NFR-S01**: The validator reads only the catalog and registry text and no process-wide state; no network or shell-out.

### Reliability
- **NFR-R01**: The validator is deterministic: identical input yields identical exit code and output across runs.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty catalog: a catalog with no tells fails (`catalog: no AI fingerprint tells found`).
- Missing field or out-of-vocabulary value: a row missing a schema field, or carrying a `model_family` / `severity_floor` / `owner` outside the allowed set, fails at exit 1.
- Malformed slug: a `tell_id` or `fixture_id` that is not a lowercase hyphen slug fails.

### Error Scenarios
- Unknown argument or missing `--registry` / `--catalog` value: usage error at exit 2.
- Unreadable target path or invalid JSON: runtime error at exit 2.

### State Transitions
- Forward drift: a catalog tell added without a registry row fails forward parity.
- Reverse drift: a registry row whose tell leaves the catalog fails reverse parity as an orphan row.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 9/25 | Three new files (registry, card, validator) plus two additive edits |
| Risk | 6/25 | Additive only, reversible by deletion, with an explicit forward dependency on phase 004 fixtures |
| Research | 6/20 | Enumerating the catalog tells and reconciling owner and severity vocabulary against the catalog rule |
| **Total** | **21/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- The split is deliberate: parity and schema completeness are code-enforced now, but per-tell deterministic detection needs the phase 004 fixture corpus that the `fixture_id` column names by stable slug. Once 004 lands, should the validator grow a fixture-resolution mode that fails when a named `fixture_id` has no fixture file?
- Will downstream consumers read `tell_id` values directly (audit findings, severity routing)? If so, the slugs become a stable contract and the `severity_floor` and `owner` vocabularies should be versioned deliberately.
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
