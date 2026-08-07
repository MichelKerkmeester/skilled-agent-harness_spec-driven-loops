---
title: "Implementation Plan: Harder intent-described corpus + sweep"
description: "Author 15-25 lexical-mis-route prompts in a sibling fixture, extend sweep test, re-run, recommend."
trigger_phrases:
  - "harder corpus plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/005-skill-advisor-scoring-engine/007-hard-intent-corpus-resweep"
    last_updated_at: "2026-05-14T01:30:00Z"
    last_updated_by: "claude"
    recent_action: "Scaffolded packet"
    next_safe_action: "Dispatch codex"
    blockers: []
    key_files:
      - "plan.md"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
# Implementation Plan: Harder intent-described corpus + sweep

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## SUMMARY

New fixture `harder-intent-prompt-corpus.ts` with 15-25 lexical-mis-route prompts; sweep test extended to run a second sweep over the harder set; emit per-vector + delta report; recommend.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## QUALITY GATES

### Definition of Ready
- [x] 015/006 sweep result on origin/main (+0.0000 across all vectors).
- [x] Sweep test + helper from 015/004 reusable.

### Definition of Done
- [x] Fixture file written.
- [x] Sweep extended.
- [x] Report emitted.
- [x] Strict validation passes.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## ARCHITECTURE

### Technical Context
| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, Vitest |
| **Framework** | Spec Kit MCP server skill-advisor scoring |
| **Storage** | Static fixture file; markdown artifact |
| **Testing** | Vitest |

### Approach
1. Author `mcp_server/skill_advisor/tests/scorer/fixtures/harder-intent-prompt-corpus.ts`. Distribution rule: cover 8-12 distinct skill ids; do not load up sk-code.
2. Modify `lane-weight-sweep.vitest.ts`: import the new fixture, run a second `runLaneWeightSweep` call against it, compose a combined report.
3. Emit `007-hard-intent-corpus-resweep/research/sweep-results-harder.md` with per-vector accuracy on the harder set + per-case routing diffs + a comparison column to the 015/006 baseline (which was the original 24).
4. Update `implementation-summary.md` recommendation block.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## IMPLEMENTATION PHASES

### Phase 1: Setup
- Read existing `intent-prompt-corpus.ts` to know what categories already exist.
- Read sweep test wiring.

### Phase 2: Implementation
- Write `harder-intent-prompt-corpus.ts`.
- Extend sweep test.
- Run sweep.
- Emit report.
- Update summary.

### Phase 3: Verification
- typecheck PASS.
- vitest skill_advisor: only the known plugin-bridge baseline still fails.
- npx tsc --build refresh dist.
- Strict validate.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## TESTING STRATEGY

| Layer | What | How |
|-------|------|-----|
| Fixture coverage | 15-25 entries spanning 8-12 skills | Vitest assertion on counts |
| Lexical mis-route claim | Each prompt verified | Manual review via comments inline in fixture |
| Sweep delta | Per-vector accuracy on harder set | Vitest emits markdown |
| Strict | Spec packet | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## DEPENDENCIES

- 015/004 + 015/006 baselines.
- Existing sweep test + seed helper.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## ROLLBACK PLAN

Single-commit revert removes the fixture, restores prior sweep test, drops packet.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## PHASE DEPENDENCIES

| Phase | Depends On | Why |
|-------|-----------|-----|
| Phase 1 | 015/006 shipped | Baseline numbers known |
| Phase 2 | Phase 1 | Authoring follows discovery |
| Phase 3 | Phase 2 | Validation runs after edits |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## EFFORT ESTIMATE

| Component | Estimate |
|-----------|----------|
| Fixture authoring (15-25 entries) | ~150 LOC |
| Sweep test extension | ~50 LOC |
| Report writer + recommendation | ~80 LOC |
| **Total** | **~280 LOC** |

cli-codex gpt-5.5 high: 8-15 min.
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## ENHANCED ROLLBACK

### Triggers
- Sweep skill_advisor breaks beyond plugin-bridge baseline.
- Cold-cache run exceeds 90s materially.

### Recovery
1. Revert this commit.
2. Confirm vitest restoration.

### Data Safety
Test-only; no production behavior changes.
<!-- /ANCHOR:enhanced-rollback -->
