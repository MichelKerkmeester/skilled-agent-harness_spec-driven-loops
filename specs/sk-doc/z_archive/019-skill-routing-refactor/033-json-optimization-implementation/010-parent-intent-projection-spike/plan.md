---
title: "Design Spike Plan: Parent-Intent Projection"
description: "Design and prototype plan for projecting high-specificity hub-router/mode-registry vocabulary into the existing derived-metadata parent-selection channel, without touching scorer math, measured against a pinned corpus."
trigger_phrases:
  - "parent intent projection plan"
  - "derived metadata vocabulary projection design"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/033-json-optimization-implementation/010-parent-intent-projection-spike"
    last_updated_at: "2026-07-29T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored planned phase spec"
    next_safe_action: "Begin implementation per plan.md"
    blockers:
      - "Phase 009 canonical derived-producer decision not yet resolved"
      - "Phase 002/006 pinned routing-accuracy corpus not yet established"
    key_files:
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "010-parent-intent-projection-spike"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

# Design Spike Plan: Parent-Intent Projection

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Design and prototype a way to project a SELECTED subset of high-specificity, hub-distinctive phrases from `hub-router.json.vocabularyClasses` (and optionally `mode-registry.json.modes[].aliases`) into the derived-metadata fields the parent-selection scorer already reads (`derived.trigger_phrases` / `derived.key_topics`), so those phrases can help the skill-advisor pick the right PARENT hub instead of only helping the hub's own internal mode router after selection. Zero scorer code changes. Measure the sk-doc pilot hub's before/after parent-selection accuracy against a hash-pinned routing-accuracy corpus, then write a decision-record with an explicit ship/no-ship verdict. This phase is gated: it may conclude "do not ship."
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

| Gate | Bar |
|------|-----|
| Zero scorer-code diff | `git diff --stat` on `scorer/lanes/*.ts` and `scorer/projection.ts` shows no changes for the prototype |
| Schema validity | Every candidate projected phrase set passes `SkillDerivedV2Schema.parse()` before it counts as a valid candidate |
| Distinctiveness | Candidates are ranked by `phraseSpecificity` (>=0.88, i.e. 2+ tokens) and a fleet-wide uniqueness check before selection, reusing existing primitives |
| Measured comparison | Before/after parent-selection accuracy captured on the pinned 002/006 corpus, with the exact corpus hash recorded in the result artifact |
| Pre-registered decision | The ship bar in `decision-record.md` is written BEFORE the comparison runs, not fitted to the result afterward |
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

No production components change. The prototype is a standalone scratch script that runs entirely outside the scorer and advisor runtime:

1. **Read (read-only)**: every hub's `hub-router.json.vocabularyClasses` and `mode-registry.json.modes[].aliases`.
2. **Fleet-wide frequency index**: build a phrase-frequency count across ALL hubs' `hub-router.json` files so a phrase's hub-distinctiveness (frequency == 1, or below a small max-hub threshold) can be checked, not assumed.
3. **Pilot-hub candidate filter**: for sk-doc, keep phrases where `phraseSpecificity(phrase) >= 0.88` (`scorer/text.ts:70-73`) AND fleet-wide frequency indicates hub-distinctiveness AND the phrase is not already present in the hub's current `SKILL.md` keywords, `intent_signals`, or `derived.trigger_phrases`/`derived.key_topics` (no duplicate-scoring, no no-op writes).
4. **Rank and budget**: rank survivors by specificity, truncate to a count that keeps the hub's `derived.trigger_phrases` under 24 and `derived.key_topics` contribution under a share of the 48-entry `keywords` cap (`skill-derived-v2.ts:44-45`), reserving explicit headroom for phase 009's own canonical generation output.
5. **Scratch write**: write survivors into a SCRATCH copy of `graph-metadata.json.derived` — never the live file — through whichever write path phase 009 designates as canonical, or an explicitly labeled throwaway writer if 009 has not resolved yet.
6. **Scratch rebuild**: rebuild the skill-graph SQLite projection from the scratch copy only (the existing sync path `projectionFromRow`/`loadFilesystemProjection` already consumes this shape unmodified — `scorer/projection.ts:191-247`).
7. **Measure**: run the pinned routing-accuracy corpus (`score-routing-corpus.py` lineage) once against the current graph and once against the scratch-augmented graph; diff the two result sets for the sk-doc pilot hub.

No line of `scorer/lanes/*.ts` or `scorer/projection.ts` changes at any step — the mechanism works entirely through the EXISTING `derived.trigger_phrases`/`derived.key_topics` -> `derivedTriggers`/`derivedKeywords` -> derived-lane phrase-boundary scoring path already wired (`scorer/lanes/derived.ts:62-87`). This is why the design satisfies "without changing scorer math": it is a data-generation-time enrichment of an existing input, not a new lane, weight, or formula.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

Confirm phase 009's canonical `derived`-producer decision status and phase 002/006's pinned corpus availability; if either is still unresolved, define and label an explicit scratch-only substitute so this spike cannot become an unintended production writer or run against an un-pinned baseline.

### Phase 2: Prototype & Measurement

Build the fleet-wide phrase-frequency index, implement the specificity and distinctiveness filters, run selection for the sk-doc pilot hub, write the scratch `derived` augmentation, rebuild the scratch projection, and run the before/after comparison against the pinned corpus.

### Phase 3: Decision & Handoff

Write `decision-record.md` recording the pre-registered bar, the measured result, and the ship/no-ship verdict. If "ship," hand off scope to a new, separately gated implementation phase — nothing is wired into production here. If "no-ship," record why the O8 hypothesis did not hold and delete the scratch artifacts.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The prototype's own before/after corpus comparison is the test: a routing-accuracy delta on a hash-pinned corpus, not a unit-test suite, since no production code path changes. The prototype script itself gets a smoke check proving it (a) never writes outside its scratch workspace and (b) never touches `scorer/lanes/*.ts` or `scorer/projection.ts` — verified by `git diff --stat` against those paths after every run. Every candidate phrase set is piped through `SkillDerivedV2Schema.parse()` before it is counted as valid, so schema-cap and shape violations are caught before they ever reach a scratch write.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

Phase 009 (canonical `derived` producer, O1) — the prerequisite decision this spike's write path must follow. Phase 002 / phase 006 (pinned, hash-locked routing-accuracy corpus) — the measurement substrate. The existing `.opencode/skills/system-skill-advisor/mcp-server/scripts/routing-accuracy/` harness (`labeled-prompts.jsonl`, `score-routing-corpus.py`, `capture-scorer-eval-baseline.mjs`). The `SkillDerivedV2Schema` (`schemas/skill-derived-v2.ts`) for write validation. The `scorer/text.ts` primitives (`phraseSpecificity`, `tokenize`, `matchesPhraseBoundary`) for selection, reused rather than reimplemented.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Every artifact this phase produces lives under this phase folder's own scratch workspace: the prototype script, the scratch copy of `graph-metadata.json.derived`, and the scratch SQLite projection. Nothing outside the phase folder is touched at any point in this phase, under any outcome. Discarding this phase's folder — or simply not opening the follow-up implementation phase after a "ship" verdict — fully reverts any trace of the spike. No hub's live `graph-metadata.json`, `hub-router.json`, or `mode-registry.json` is edited by this phase regardless of the measured result.
<!-- /ANCHOR:rollback -->
