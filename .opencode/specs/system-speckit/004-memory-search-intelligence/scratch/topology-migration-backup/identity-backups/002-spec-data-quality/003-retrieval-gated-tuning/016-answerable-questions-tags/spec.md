---
title: "Feature Specification: C3 answerable_questions and semantic_intent tags [template:level_2/spec.md]"
description: "Auto-generated answerable_questions and semantic_intent tags persist on the JSON surface but the embed and fusion path never consumes them, so they are a dead field. The auto-generation is the novel cheap half and the parser allow-list plus fusion consumer is the retrieval-class C2-gated half."
trigger_phrases:
  - "answerable questions tags"
  - "semantic intent tags"
  - "c3 retrieval tags"
  - "memory parser allow list"
  - "fusion consumer tags"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/004-memory-search-intelligence/002-spec-data-quality/003-retrieval-gated-tuning/016-answerable-questions-tags"
    last_updated_at: "2026-07-04T17:11:52.130Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored buildable phase spec from research C3 verdict"
    next_safe_action: "Run generate-description and graph-metadata backfill, then plan.md"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Feature Specification: C3 answerable_questions and semantic_intent tags

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
| **Priority** | P2 |
| **Status** | Draft |
| **Created** | 2026-06-21 |
| **Branch** | `016-answerable-questions-tags` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A document can carry curated `answerable_questions` and `semantic_intent` tags that name the queries it should win and the intent class it serves, but those tags are inert today. The frontmatter extractors in `memory-parser.ts` only pull a fixed set of known fields (`trigger_phrases` at L785-863, `content_type` at L864, `importance_tier` at L880), so an `answerable_questions` field persists on disk and is silently dropped from the vector and the metadata payload. The fusion stage in `stage2-fusion.ts` consumes only `validationMetadata.qualityScore` and a few spec signals (L260-289), so even if the tags reached the row there is no consumer to read them. This is the 028 dead-field trap: a field that exists on the JSON surface but never moves a single retrieval result.

### Purpose
Make answerable-question and semantic-intent tags first-class retrieval signals: auto-generate them cheaply on write, admit them through the parser allow-list, and read them in the fusion stage, so a document is reachable by the questions it answers and not only by its title.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- An auto-generator that derives `answerable_questions` and `semantic_intent` for a document and persists them into the metadata JSON surface (the novel cheap half, floor-irrelevant on the write side).
- Extend the `memory-parser.ts` frontmatter allow-list with parallel extractors for `answerable_questions` and `semantic_intent`, matching the existing `extractTriggerPhrases` pattern, so the tags survive parse and reach the row payload.
- A fusion consumer in `stage2-fusion.ts` that reads the new tags and applies a bounded, deny-by-default retrieval signal, modeled on the existing `applyValidationMultiplier` bounded-multiplier shape (L260-289), default-off behind a flag.
- Default-off flag gating for the consumer half so the field can land and backfill before any retrieval behavior changes.

### Out of Scope
- Promoting the consumer past default-off. That promotion is the C2 gate's job and is forbidden here. See 015-prodmode-recall-gate.
- The full re-embed and embedding-coverage guard that a chunk-prefix change would need. C3 fuses at the metadata stage, not the embed stage, so it does not require the C1 re-index, but its retrieval value is still unproven until C2 measures it.
- Metadata-fusion alpha calibration and the broader fusion redesign. That is C4 and is subsumed by C1 in its cheaper form.
- LLM-as-judge quality scoring. That is C5.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts` | Modify | Add `extractAnswerableQuestions` and `extractSemanticIntent` extractors parallel to `extractTriggerPhrases` (~L785), and surface them in the parsed row payload alongside `triggerPhrases` (~L340) |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts` | Modify | Add a bounded, flag-gated fusion consumer that reads the new tags, modeled on `applyValidationMultiplier` (L260-289) |
| `<auto-generator module>` | Create | Derive `answerable_questions` and `semantic_intent` on write and persist into the metadata JSON (exact host module resolved in plan.md against the live write path) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | WHEN a document is saved, the system SHALL auto-generate `answerable_questions` and `semantic_intent` tags and persist them into the metadata JSON surface | A saved doc's metadata JSON contains both fields populated from content, generation is deterministic for the same input, and the write path is non-destructive to the body |
| REQ-002 | WHEN `memory-parser.ts` parses a document carrying these fields, the parser SHALL extract them through the allow-list so they reach the row payload | A parser unit test asserts both fields are present and non-empty on the parsed row for an input that declares them. An input without them parses unchanged |
| REQ-003 | The consumer half SHALL be gated default-off behind a flag and SHALL NOT be promoted to default-on within this phase | Grep confirms the flag default is off. The prod retrieval path is byte-identical with the flag off. No completion claim asserts a retrieval win |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | WHEN the consumer flag is on, the fusion stage SHALL apply a bounded deny-by-default signal that reads the new tags, modeled on the existing validation multiplier | The fusion change reuses the `clampMultiplier` bound, leaves rows without the tags unchanged, and a fusion unit test shows the score only moves within the bound and only for tagged rows |
| REQ-005 | The auto-generation half SHALL ship and remain useful independently of the consumer half | With the consumer flag off, the fields still populate and persist, so the cheap write-time half delivers the corpus-coverage value with zero retrieval risk |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A representative saved document carries populated `answerable_questions` and `semantic_intent` in its metadata JSON, and `memory-parser.ts` round-trips both fields onto the parsed row (verified by unit test).
- **SC-002**: With the consumer flag off, prod-mode retrieval is unchanged from baseline (the field is live but inert by design), so this phase ships the write-time half on cost and hands the retrieval claim to C2.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | 015-prodmode-recall-gate | The consumer half cannot be promoted to default-on without a prod-mode completeRecall@3 RISE through C2. This is the shared unblock condition for every Tier-C and 027 retrieval item | Ship default-off. Promotion is gated on the C2 prod@3 read, not on eval-mode @K |
| Dependency | Metadata write path | The auto-generator must persist into the existing JSON write path without re-implementing it | Resolve the exact host module in plan.md against the live save path. Reuse the additive write contract |
| Risk | Dead-field regression (the 028 trap) | Auto-generating the field without admitting it through the parser allow-list leaves it silently dropped from the vector | REQ-002 makes the parser allow-list extension a P0 blocker, not an afterthought |
| Risk | Unmeasured retrieval claim | Eval-mode @K hides the 3-result prod floor, so a fusion win measured in eval mode is inadmissible | Consumer stays default-off. No retrieval win is claimed until C2 measures prod@3 |
| Risk | Fusion-bound drift | A new fusion signal could over-weight tagged rows | Reuse the existing `clampMultiplier` bound and the `applyValidationMultiplier` deny-by-default shape. Rows without tags are untouched |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The fusion consumer SHALL add no new per-query DB round-trip. It reads tags already present on the row payload.
- **NFR-P02**: Auto-generation runs on the write path only and SHALL NOT add latency to the read path.

### Security
- **NFR-S01**: The auto-generator SHALL NOT mutate the authored document body. It writes only metadata JSON fields (the no-body-mutate rail).

### Reliability
- **NFR-R01**: With the consumer flag off the retrieval path SHALL be byte-identical to baseline.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: a document with no derivable questions persists an empty field and parses unchanged.
- Maximum length: the generated tag set is capped, mirroring the trigger-phrase cap discipline, so a verbose document does not balloon the payload.
- Invalid format: a malformed or legacy frontmatter field is skipped by the extractor, never throws.

### Error Scenarios
- Missing field: a legacy document without the tags parses exactly as before. This is the back-compat floor.
- Consumer flag off: the field is present but inert. No row score changes.

### State Transitions
- Partial completion: the write-time half may ship before the consumer half. The field populates and persists with the consumer still off.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 10/25 | Two known-file modifications (parser, fusion) plus one generator module |
| Risk | 12/25 | Retrieval-class fusion touch, but gated default-off so prod risk is deferred to C2 |
| Research | 6/20 | Seams already grounded to file:line in research.md. Generator host module resolved in plan.md |
| **Total** | **28/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Which live write-path module owns the metadata JSON emission that the auto-generator should hook (resolved in plan.md against the save path).
- Whether `semantic_intent` is a closed enum or a free-form tag, which affects whether it gets an enum guard like the A3 fields.
<!-- /ANCHOR:questions -->

---

<!--
VERDICT: conditional (C2-gated). Auto-generation is novel-cheap GO-on-cost (floor-bypassing, write-time, no re-index). The fusion consumer plus parser allow-list extension is retrieval-class and stays default-off behind the 015-prodmode-recall-gate prod@3 read. NO-GO as a standalone field per research.md section 3.
-->
