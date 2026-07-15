---
title: "Implementation Plan: C3 answerable_questions and semantic_intent tags [template:level_2/plan.md]"
description: "Auto-generate answerable_questions and semantic_intent on write, admit them through the memory-parser allow-list, and add a flag-gated fusion consumer modeled on the validation multiplier. The write-time half ships on cost while the consumer stays default-off behind the C2 prod-recall gate."
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
    packet_pointer: "system-speckit/004-memory-search-intelligence/003-spec-data-quality/003-retrieval-gated-tuning/003-answerable-questions-tags"
    last_updated_at: "2026-07-04T17:11:52.130Z"
    last_updated_by: "markdown-agent"
    recent_action: "Drafted plan from spec seams"
    next_safe_action: "Resolve generator host module then write tasks"
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
# Implementation Plan: C3 answerable_questions and semantic_intent tags

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope. Remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript |
| **Framework** | Spec Kit Memory MCP server |
| **Storage** | SQLite vector and metadata rows |
| **Testing** | Vitest |

### Overview
Make answerable-question and semantic-intent tags into live retrieval signals instead of a dead JSON field. The plan splits into a write-time half that auto-generates the two tags and persists them into the metadata JSON surface and a retrieval half that admits the tags through the `memory-parser.ts` allow-list and reads them in a flag-gated `stage2-fusion.ts` consumer. The retrieval half stays default-off so the field can land and backfill before any result moves.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Pipeline stage plus parser allow-list extension behind a default-off flag.

### Key Components
- **Tag auto-generator**: derives `answerable_questions` and `semantic_intent` from document content on write and persists them into the metadata JSON without touching the body.
- **Parser allow-list extractors**: `extractAnswerableQuestions` and `extractSemanticIntent` in `memory-parser.ts`, parallel to `extractTriggerPhrases`, so the tags survive parse and reach the row payload.
- **Fusion consumer**: a bounded flag-gated reader in `stage2-fusion.ts` modeled on `applyValidationMultiplier`, deny-by-default and untouched for rows without tags.

### Data Flow
On save the generator writes the two tags into metadata JSON. On parse the new extractors pull the tags onto the parsed row alongside `triggerPhrases`. At query time the fusion consumer reads the tags from the row payload and applies a bounded multiplier only when the consumer flag is on, so the read path stays byte-identical with the flag off.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `memory-parser.ts` frontmatter extractors (L785-880) | Pull a fixed allow-list of known fields onto the parsed row | update | Parser unit test asserts both new fields reach the row |
| `memory-parser.ts` row payload assembly (~L340) | Surfaces `triggerPhrases` and known fields on the parsed row | update | Grep confirms the two new fields ship alongside `triggerPhrases` |
| `stage2-fusion.ts` validation multiplier (L260-289) | Reads `qualityScore` and spec signals to apply a bounded multiplier | update | Fusion unit test shows the score only moves within the bound for tagged rows |
| Tag auto-generator host module | Owns the metadata JSON emission on the save path | update | Host module resolved against the live save path before code starts |

Required inventories:
- Same-class producers: `rg -n 'extractTriggerPhrases|extractContentType|extractImportanceTier' .opencode/skills/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts`.
- Consumers of changed symbols: `rg -n 'triggerPhrases|answerableQuestions|semanticIntent' .opencode/skills/system-spec-kit/mcp_server --glob '*.ts'`.
- Matrix axes: input with both tags, input with one tag, input with neither, malformed legacy tag, consumer flag on, consumer flag off.
- Algorithm invariant: with the consumer flag off the retrieval path is byte-identical to baseline and rows without tags never move.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Resolve the generator host module against the live metadata JSON write path
- [ ] Add the default-off consumer flag and confirm its default reads off
- [ ] Stand up the Vitest fixtures for tagged, untagged, and malformed inputs

### Phase 2: Core Implementation
- [ ] Auto-generate `answerable_questions` and `semantic_intent` on write and persist into metadata JSON without mutating the body
- [ ] Add `extractAnswerableQuestions` and `extractSemanticIntent` parallel to `extractTriggerPhrases` and surface both on the parsed row
- [ ] Add the bounded flag-gated fusion consumer in `stage2-fusion.ts` modeled on `applyValidationMultiplier`

### Phase 3: Verification
- [ ] Parser unit test proves both fields round-trip onto the row and a no-tag input parses unchanged
- [ ] Fusion unit test proves the score moves only within the bound and only for tagged rows
- [ ] Confirm with the flag off that prod-mode retrieval matches baseline
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Parser extractors and fusion consumer | Vitest |
| Integration | Save then parse round-trip of the two tags | Vitest |
| Manual | Flag-off baseline parity spot check | CLI |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 015-prodmode-recall-gate | Internal | Yellow | Consumer cannot be promoted past default-off until C2 reads a prod@3 rise |
| Metadata write path module | Internal | Yellow | Generator cannot persist tags until the host module is resolved |
| `clampMultiplier` and `applyValidationMultiplier` shape | Internal | Green | Reused bound keeps the fusion signal deny-by-default |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A parser change drops a known field, a fusion change moves untagged rows, or the flag-off path diverges from baseline.
- **Procedure**: Set the consumer flag off, revert the fusion and parser commits, and leave the write-time generator in place since it is body-safe and inert with the consumer off.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──────┐
                      ├──► Phase 2 (Core) ──► Phase 3 (Verify)
Phase 1.5 (Config) ───┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core, Config |
| Config | Setup | Core |
| Core | Setup, Config | Verify |
| Verify | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 1-2 hours |
| Core Implementation | Med | 4-8 hours |
| Verification | Low | 1-2 hours |
| **Total** | | **6-12 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Backup created (if data changes)
- [ ] Feature flag configured
- [ ] Monitoring alerts set

### Rollback Procedure
1. Disable the consumer flag so the fusion read reverts to baseline
2. Revert the fusion and parser commits while keeping the body-safe generator
3. Re-run the parser and fusion unit tests to confirm baseline parity
4. Note the rollback in the packet docs since this is a retrieval-class surface

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A. The generated tags are additive metadata JSON fields that a parser ignores when the extractors are removed.
<!-- /ANCHOR:enhanced-rollback -->

---

<!--
LEVEL 2 PLAN (~140 lines)
- Core + Verification additions
- Phase dependencies, effort estimation
- Enhanced rollback procedures
-->
