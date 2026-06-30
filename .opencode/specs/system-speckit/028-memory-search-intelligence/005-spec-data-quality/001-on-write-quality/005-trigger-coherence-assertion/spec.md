---
title: "Feature Specification: Cross-Surface trigger_phrases Coherence Assertion [template:level_2/spec.md]"
description: "trigger_phrases live in three places (spec.md frontmatter, description.json, graph-metadata.derived) with no assertion that they agree. The derived set is capped at 12 so any byte-equality check would false-fire and any silent divergence ships unnoticed."
trigger_phrases:
  - "trigger phrases coherence"
  - "cross-surface assertion"
  - "subset coherence"
  - "description.json triggers"
  - "graph-metadata derived"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/005-spec-data-quality/001-on-write-quality/005-trigger-coherence-assertion"
    last_updated_at: "2026-06-21T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Author phase spec from research.md A5 row"
    next_safe_action: "Run generate-context and graph-metadata backfill, then plan.md"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/scripts/extractors/spec-folder-extractor.ts"
      - ".opencode/skills/system-spec-kit/scripts/rules/check-description-shape.sh"
      - ".opencode/skills/system-spec-kit/scripts/rules/check-graph-metadata-shape.sh"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-agent-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Feature Specification: Cross-Surface trigger_phrases Coherence Assertion

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
| **Branch** | `005-trigger-coherence-assertion` |
| **Verdict** | GO-on-cost (Tier A, floor-bypassing, ships on cost) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A spec folder carries the same `trigger_phrases` concept in three separate surfaces that are never asserted to agree. The curated set lives in spec.md frontmatter, the indexed set lives in `description.json`, and a third copy lives in `graph-metadata.derived`. The `description.json` set is not the frontmatter set copied over. It is rebuilt by `spec-folder-extractor.ts:387-390` as `dedupe([...]).slice(0, 12)`, so it is capped at 12 entries and may legitimately differ from a longer curated frontmatter list. Today nothing checks that these three surfaces stay consistent, so a curated trigger that never reached the index, or a stale derived copy after a frontmatter edit, ships silently and degrades retrieval routing.

### Purpose
Add a cross-surface coherence assertion that catches divergent `trigger_phrases` across the three surfaces using subset coherence (the derived and indexed sets must be a subset of the curated frontmatter set) rather than byte equality, which the 12-entry cap would false-fire on.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A coherence detector that reads `trigger_phrases` from all three surfaces of one spec folder and reports divergence.
- Subset comparison logic. The `description.json` set and the `graph-metadata.derived` trigger set must each be a subset of the curated spec.md frontmatter set after normalization.
- Registration of the assertion as a warn-tier rule alongside the existing shape rules so the legacy corpus is never broken on landing.
- Normalization shared with the existing extractor (case-fold, trim, dedupe) so the comparison matches how the index actually built the set.

### Out of Scope
- Auto-fixing divergence by rewriting any surface. This assertion is report-only. Backfill and apply belong to the B1 sweep engine and the shared safe-fix registry in 026-shared-safe-fix-engine, not here.
- The A2 propagation of curated frontmatter triggers into `description.json`. A5 asserts coherence, A2 produces it. A5 is the rail, A2 is the writer.
- Promoting this rule from warn to error. That flip is a separate migration beat after a backfill report reads zero, tracked with the A4 shape-error work.
- Any retrieval-class change. This is a validation-surface assertion with zero prod-retrieval risk and zero re-index.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| .opencode/skills/system-spec-kit/scripts/rules/check-trigger-coherence.sh | Create | New rule that reads the three surfaces and asserts subset coherence |
| .opencode/skills/system-spec-kit/scripts/lib/validator-registry.json | Modify | Register the new rule at warn tier next to the description and graph-metadata shape rules |
| .opencode/skills/system-spec-kit/scripts/extractors/spec-folder-extractor.ts | Read-only reference | Source of the `dedupe([...]).slice(0, 12)` normalization the assertion must mirror |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The rule SHALL read `trigger_phrases` from spec.md frontmatter, `description.json`, and `graph-metadata.derived` for a given spec folder. | A unit fixture with all three surfaces populated parses three sets without error |
| REQ-002 | WHEN the `description.json` trigger set is not a subset of the normalized frontmatter set, the rule SHALL report a coherence finding naming the orphan phrases. | A fixture with an indexed trigger absent from frontmatter emits a warn finding listing that phrase |
| REQ-003 | WHEN the `graph-metadata.derived` trigger set is not a subset of the normalized frontmatter set, the rule SHALL report a coherence finding naming the orphan phrases. | A fixture with a stale derived trigger absent from frontmatter emits a warn finding listing that phrase |
| REQ-004 | The subset comparison SHALL normalize identically to `spec-folder-extractor.ts` (case-fold, trim, dedupe) before comparing, so the cap-driven legitimate difference between a 12-entry derived set and a longer frontmatter set is NOT a finding. | A fixture where frontmatter has 15 triggers and the derived set is the first 12 capped subset reports no finding |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | The rule SHALL land default-off or warn-tier so the existing corpus never blocks on it at landing. | Running the rule across the live spec tree exits non-error and emits only warn findings |
| REQ-006 | A missing or empty surface SHALL be tolerated as no-data, not asserted as divergence. | A fixture lacking `graph-metadata.derived.n` reports no coherence finding for the derived surface |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The assertion flags a real cross-surface divergence (an indexed or derived trigger absent from curated frontmatter) on a crafted fixture, proving the rail works.
- **SC-002**: The assertion stays silent on a legitimately capped derived set (12 entries against a longer frontmatter list), proving subset coherence and not byte equality is the rule.
- **SC-003**: A dry run across the live spec corpus exits non-error and lists current divergences as warn findings for the backfill beat.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | A2 trigger propagation | Without A2, many folders show a divergence between a curated frontmatter set and a title-copy derived set | Land A5 as warn-only so it reports the gap A2 then closes. The two pair |
| Dependency | 026-shared-safe-fix-engine | A5 reports divergence but does not fix it. Any auto-remediation routes through the shared safe-fix engine and frozen fixClass registry | Keep A5 report-only. The `triggers.propagate` safe fix lives in the shared engine, not here |
| Dependency | A4 shape-error migration | The warn-to-error flip for this rule rides the same four-beat migration as the JSON shape rules | Defer the error flip until the backfill report reads zero |
| Risk | Normalization drift from the extractor | A divergent normalization would false-fire or miss real divergence | Mirror `spec-folder-extractor.ts:387-390` exactly and pin it with a fixture matching the capped derive |
| Risk | Surface-absence false positives | Older folders missing `graph-metadata.derived` triggers could be read as divergence | Treat missing or empty surfaces as no-data per REQ-006 |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The rule reads at most three small JSON and frontmatter files per spec folder and adds negligible time to an existing validate pass.

### Reliability
- **NFR-R01**: The rule SHALL never mutate any of the three surfaces. It is read-only and report-only.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Frontmatter has more than 12 triggers: the capped derived subset is correct, report nothing.
- All three surfaces empty: no-data, report nothing.
- Frontmatter present, derived and indexed absent: no-data on the absent surfaces, report nothing.

### Error Scenarios
- Malformed `description.json` or `graph-metadata.json`: the existing shape rules own that error; A5 reports a coherence finding only when a surface parses but diverges.
- Case-only difference between surfaces: normalized away, not a finding.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | One new rule script, one registry entry, mirrors an existing extractor |
| Risk | 6/25 | Validation surface only, no ranking, no re-index, warn-tier landing |
| Research | 4/20 | Seam verified to file:line, verdict measured at GO-on-cost |
| **Total** | **18/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Should the assertion also compare against the `_memory.continuity` key vocabulary, or is the three-surface set sufficient for the routing-coherence goal? Default is three-surface only.
- Does the derived trigger set live under `graph-metadata.derived.n` in every live folder, or are there legacy folders with a different derived key that need a fallback read? The fixture set should sample both.
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
