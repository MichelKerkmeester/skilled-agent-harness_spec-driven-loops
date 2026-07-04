---
title: "Feature Specification: A10 Per-Surface Gates [template:level_2/spec.md]"
description: "The skill-doc command and context-eng surfaces have no write-time conformance gates. SKILL.md frontmatter carries two ungoverned version grammars, route-validate ships eight assertions that are doctor-only, about thirty workflow YAMLs have no schema validator, and the intent-trigger vocabulary lives in three hand-synced copies with no canary."
trigger_phrases:
  - "per-surface gates"
  - "skill-doc frontmatter gate"
  - "route-validate contract"
  - "workflow yaml schema"
  - "trigger vocabulary canary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/005-spec-data-quality/001-on-write-quality/010-per-surface-gates"
    last_updated_at: "2026-07-04T17:11:58.812Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored phase spec from research A10 row"
    next_safe_action: "Run generate-context and graph-metadata generators"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "template-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Feature Specification: A10 Per-Surface Gates

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
| **Status** | Draft |
| **Created** | 2026-06-21 |
| **Branch** | `010-per-surface-gates` |
| **Verdict** | GO-on-cost (floor-bypassing, write-time, reuse-first) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Three authoring surfaces beyond spec-doc and JSON ship machinery that is never enforced at write time. The skill-doc surface has 20 SKILL.md files carrying two distinct version grammars (`vX.Y` and `version: N`, confirmed across the live skill corpus) with no linter to hold either steady. The command surface ships `route-validate.py` with eight assertions, but they run doctor-only, so 27 of 28 command docs are ungated against the router contract. About 30 workflow YAMLs have no schema validator. The intent-trigger vocabulary lives in three hand-synced copies (CLAUDE.md prose, `gate-3-classifier.ts` FILE_WRITE_TRIGGERS at line 67, and advisor `prompt-policy.default.json` WORK_INTENT_VERBS read at `prompt-policy.ts:42`) with no canary to catch divergence.

### Purpose
Each non-spec-doc authoring surface gains a write-time conformance gate that bypasses the retrieval truncation floor and ships on cost, so grammar drift, router-contract breaks, malformed workflow YAML, and triple-copy vocabulary divergence are caught at authoring time instead of at runtime.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- SKILL.md hub frontmatter grammar and field-uniformity gate that pins one version grammar and reports the other as a finding.
- Skill-graph drift and signal-collision gate wiring the shipped `advisor_rebuild` to `advisor_validate` as a check tier.
- Generalized command router-contract gate that runs `route-validate.py` assertions D, E, and F across all 28 command docs, not doctor-only.
- Workflow-YAML schema gate covering the workflow YAMLs that currently have no validator.
- Triple-copy trigger-vocabulary coherence canary across CLAUDE.md prose, `gate-3-classifier.ts` FILE_WRITE_TRIGGERS, and advisor WORK_INTENT_VERBS, modeled on the shipped `rule-canary-sync` pattern.
- Each gate lands default-off and warn-only first, per the packet four-beat migration discipline.

### Out of Scope
- The shared safe-fix engine (`dq-engine.ts`) and detector registry - owned by 026-shared-safe-fix-engine, consumed here not built.
- Any retrieval-class change or re-index - these gates touch validation only, zero prod-retrieval risk.
- Auto-mutating any authored body - all five gates are report-only at this phase. No fix is granted `safe` here.
- The scheduled sweep front door (B1) and the doctor front door (B2) - separate phases; A10 detectors run on-write only.
- Re-speccing the already-built fence-aware `[[wikilink]]` validator - it is shipped and CI-wired (NO-GO per research section 2 Tier D).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/scripts/validation/` (new per-surface detectors) | Create | SKILL.md frontmatter grammar/uniformity detector and workflow-YAML schema detector registered next to the existing shape rules |
| `.opencode/commands/doctor/scripts/route-validate.py` | Modify | Generalize assertions D, E, F to run across all 28 command docs from a non-doctor entry, not the doctor-only path |
| `.opencode/skills/system-skill-advisor/mcp_server/tools/advisor-rebuild.ts` | Reference | Wire `advisor_rebuild` to `advisor_validate` as the skill-graph drift/collision check tier (consume shipped tools, no new graph logic) |
| `.opencode/skills/system-spec-kit/shared/gate-3-classifier.ts` (read-only source) | Reference | One of three canary inputs (FILE_WRITE_TRIGGERS at line 67) |
| `.opencode/skills/system-skill-advisor/mcp_server/data/prompt-policy.default.json` (read-only source) | Reference | Second canary input (WORK_INTENT_VERBS) |
| `CLAUDE.md` (read-only source) | Reference | Third canary input (intent-trigger prose) |
| `.opencode/skills/system-spec-kit/scripts/lib/validator-registry.json` | Modify | Register the new per-surface detectors as warn-tier rules, the same shipped validate.sh registry the A1 keystone uses |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | WHEN a SKILL.md is authored or validated, the system SHALL check its frontmatter against one pinned version grammar and emit a warn-tier finding for the non-conforming grammar | Running the detector over the 21 SKILL.md corpus reports the dual-grammar split as findings and exits non-blocking under warn tier |
| REQ-002 | WHEN the command router-contract gate runs, the system SHALL execute route-validate assertions D (YAML asset existence, line 182), E (mutation class validity, line 200), and F (MCP tool subset check, line 215) across all 28 command docs | The gate runs outside the doctor-only path and reports per-doc pass/fail for all 28 docs. Exit 0 on a clean corpus, exit 1 on at least one assertion failure |
| REQ-003 | WHEN the trigger-vocabulary canary runs, the system SHALL compare the three hand-synced copies and emit a finding on any divergence | The canary reads FILE_WRITE_TRIGGERS (`gate-3-classifier.ts:67`), WORK_INTENT_VERBS (advisor prompt-policy), and the CLAUDE.md prose set, and reports drift when the three sets disagree |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | WHEN a workflow YAML is validated, the system SHALL check it against a workflow-YAML schema and emit a warn-tier finding for malformed structure | The schema detector runs over the workflow YAML census and reports structural violations without blocking under warn tier |
| REQ-005 | WHEN the skill-graph drift gate runs, the system SHALL invoke `advisor_rebuild` followed by `advisor_validate` and surface signal-collision and drift findings | The gate calls the shipped advisor tools as a check tier and reports drift or collision findings. No new graph traversal logic is added |
| REQ-006 | Each of the five gates SHALL land default-off and warn-only first | No gate flips to error in this phase. The count-to-zero and error flip are deferred to a later migration beat per packet governance |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All five per-surface gates run as warn-tier detectors and report findings without blocking the legacy corpus.
- **SC-002**: The command router-contract gate covers all 28 command docs, closing the 27-of-28 ungated gap.
- **SC-003**: The SKILL.md grammar gate detects the dual-version-grammar split across the live skill corpus.
- **SC-004**: The trigger-vocabulary canary reports a finding when any one of the three hand-synced copies is mutated out of sync with the other two.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | 026-shared-safe-fix-engine | The detector-registry and `dq-engine.ts` plumbing these gates register against | Consume the shipped registry contract. Register A10 detectors as `fixClass: none` warn-tier entries so no engine fix path is exercised |
| Dependency | Shipped `route-validate.py` assertion machinery | Generalizing D/E/F depends on the existing assertion harness staying stable | Wrap, do not rewrite. The eight assertions already ship and are CI-asserted |
| Dependency | Shipped `advisor_rebuild` and `advisor_validate` tools | The skill-graph drift gate is wiring, not new graph logic | Call the tools as-is. If the advisor graph is loaded from skill-graph.sqlite only, the rebuild path stays the source of truth |
| Risk | Triple-copy canary false-positive on intentional vocabulary divergence | Medium | Subset/coherence comparison with an allow-list for legitimately surface-specific verbs, not byte equality |
| Risk | Generalizing route-validate to 28 docs surfaces pre-existing latent failures | Low | Warn-tier first beat absorbs the census. Error flip deferred until the count reaches zero |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Each gate runs as a write-time or validate-time check and adds no re-index cost, since none of the five touch the embedding path.
- **NFR-P02**: The 28-doc route-validate pass and the SKILL.md corpus scan complete within the existing validate.sh budget.

### Security
- **NFR-S01**: All five gates are read-only over their target surfaces in this phase. No authored body is mutated.
- **NFR-S02**: The advisor drift gate honors the skill_graph_scan workspace-path guard and does not act on out-of-workspace paths.

### Reliability
- **NFR-R01**: A gate failure reports a finding and exits warn-tier. It never blocks the legacy corpus in this phase.
- **NFR-R02**: The canary reports drift deterministically given identical inputs across the three copies.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: a SKILL.md with no version field reports a missing-grammar finding, not a crash.
- Maximum length: the route-validate generalization streams per-doc so 28 docs do not balloon memory.
- Invalid format: a malformed workflow YAML yields a structural finding, not an unhandled parse exception.

### Error Scenarios
- Advisor tool unavailable: the skill-graph drift gate degrades to a skipped-with-reason finding, not a hard failure.
- One canary source missing: the canary reports an incomplete-source finding rather than asserting false coherence.
- Concurrent access: gates are read-only over their surfaces, so concurrent validate runs do not race.

### State Transitions
- Partial completion: a gate that fails mid-corpus reports the docs scanned so far and the failure point.
- Migration beat: warn-to-error flip is a separate later transition, gated on a count-to-zero census not performed here.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 16/25 | Five distinct gates across three surfaces, two new detectors plus one route-validate generalization plus one advisor wiring plus one canary |
| Risk | 8/25 | Validation-only, zero prod-retrieval risk, warn-tier first beat. Main risk is latent census failures and canary false-positives |
| Research | 6/20 | Seams already verified to file:line in research.md. Remaining work is build, not investigation |
| **Total** | **30/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Which version grammar is pinned canonical for SKILL.md (`vX.Y` versus `version: N`), and is the other deprecated or co-allowed.
- Does the workflow-YAML schema gate cover deep-loop YAMLs only or all workflow YAMLs in the census.
- Should the trigger-vocabulary canary allow surface-specific verbs via an explicit allow-list or require strict subset coherence across all three copies.
<!-- /ANCHOR:questions -->
