---
title: "Feature Specification: Parent-Intent Projection Design Spike"
description: "Gated design spike (O8, single-lineage hypothesis): design a way to project high-specificity per-mode vocabulary from hub-router.json/mode-registry.json into an existing parent-selection scorer input, without changing scorer math, and measure it against a pinned corpus before deciding to ship."
trigger_phrases:
  - "parent intent projection spike"
  - "hub router vocabulary parent selection"
  - "project mode vocabulary into derived metadata"
importance_tier: "normal"
contextType: "specification"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/033-json-optimization-implementation/010-parent-intent-projection-spike"
    last_updated_at: "2026-07-29T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored planned phase spec"
    next_safe_action: "Begin implementation per plan.md"
    blockers:
      - "Phase 009 canonical derived-producer decision not yet resolved"
      - "Phase 002 pinned routing-accuracy corpus not yet established"
    key_files:
      - "spec.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "010-parent-intent-projection-spike"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Which of derived.trigger_phrases vs derived.key_topics is the right destination for a given projected phrase?"
      - "What per-hub projection budget avoids starving phase 009's own canonical generation output of schema-cap headroom?"
      - "Does sk-doc's own vocabularyClasses corpus produce enough genuinely distinctive multi-word phrases to matter, or is O8's premise stronger on a different, richer hub?"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: Parent-Intent Projection Design Spike

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-07-29 |
| **Track** | sk-doc |
| **Parent** | `sk-doc/019-skill-routing-refactor/033-json-optimization-implementation` |
| **Parent Spec** | ../spec.md |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

`hub-router.json`'s `vocabularyClasses` block holds rich, distinctive per-mode phrases — for example sk-doc's `create-skill-aliases` class carries multi-word phrases like "skill root metadata contract", "leaf-manifest config aliases required", "hub versus standalone skill class", and "skill metadata drift gate" (`.opencode/skills/sk-doc/hub-router.json:36-49`). None of that vocabulary can help the skill-advisor pick sk-doc as the PARENT hub in the first place: `registry-compiler.cjs`'s `vocabularyForMode` (`.opencode/bin/lib/compiled-routing/009-parent-hub-rollout/007-sk-doc/lib/registry-compiler.cjs:173-186`) only compiles that vocabulary into the hub's OWN internal mode router, a stage that runs after the advisor has already selected sk-doc. The advisor's actual parent-selection input is a much narrower set of fields — `SkillProjection.derivedTriggers`/`derivedKeywords`/`intentSignals`, built by `projectionFromRow`/`loadFilesystemProjection` from `graph-metadata.json.derived.trigger_phrases`/`.key_topics`/`.entities` and the top-level `intent_signals` array (`.opencode/skills/system-skill-advisor/mcp-server/lib/scorer/projection.ts:191-247`), scored by the derived lane's phrase-boundary + specificity match (`.opencode/skills/system-skill-advisor/mcp-server/lib/scorer/lanes/derived.ts:62-87`). The scaffolder already seeds a hub's `derived.key_topics` with generic router-adjacent terms like "mode-registry" and "hub-router" at creation time (`.opencode/skills/sk-doc/sk-create-skill/scripts/init_skill.py:540-557`), which confirms the gap is real, not an oversight: some router vocabulary already crosses into `derived`, just never the rich, distinctive per-mode tier.

This is O8 from the 029 skill/advisor JSON optimization research — a single-lineage (sol-high) design hypothesis, not independently confirmed by the other two lineages (`.opencode/specs/sk-doc/019-skill-routing-refactor/029-skill-json-optimization-research/research/research.md:74-75,88`). This phase spikes a design for closing the gap and measures whether it actually helps, rather than assuming the hypothesis is correct and building it straight to production.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

**In scope**: design (not ship) a mechanism that projects a SELECTED subset of high-specificity phrases from a hub's `hub-router.json.vocabularyClasses` (and optionally `mode-registry.json.modes[].aliases`) into the SAME derived-metadata channel the parent-selection scorer already reads — `graph-metadata.json.derived.trigger_phrases` / `.derived.key_topics` — with zero new scorer lane and zero new weight. Build a throwaway prototype selection script against the sk-doc hub as the pilot; measure sk-doc's parent-selection accuracy before/after against the pinned routing-accuracy corpus this program's phase 002 (and phase 006, per the parent brief) establish, using the existing harness under `.opencode/skills/system-skill-advisor/mcp-server/scripts/routing-accuracy/` (`labeled-prompts.jsonl`, `score-routing-corpus.py`, `capture-scorer-eval-baseline.mjs`); write `decision-record.md` with an explicit ship/no-ship verdict.

**Out of scope**: any change to `scorer/lanes/*.ts` or `scorer/projection.ts` scoring formulas or weights — that is the constraint the spike must respect, not a boundary it negotiates; any change to `hub-router.json`'s or `mode-registry.json`'s own authored contract shape, both of which `registry-compiler.cjs`'s own comments call "legacy-owned and frozen" (`registry-compiler.cjs:210-212`); wiring the projection into production for any hub beyond the sk-doc pilot measurement; resolving phase 009's O1 decision itself (this phase consumes that decision, it does not make it); building CI enforcement for routing accuracy (that is O4, a separate Tier-1 item).
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The spike produces a design doc plus a working prototype that projects distinctive per-mode vocabulary into the EXISTING derived-metadata channel | Prototype writes only to a scratch copy of `graph-metadata.json.derived`; `git diff --stat` shows zero lines changed in `.opencode/skills/system-skill-advisor/mcp-server/lib/scorer/lanes/*.ts` or `scorer/projection.ts` |
| REQ-002 | Candidate phrase selection is high-specificity and hub-distinctive, not a raw dump | Selection reuses the existing `phraseSpecificity`/`tokenize` primitives (`scorer/text.ts:40-73`) with a specificity floor (>=0.88, i.e. 2+ tokens) plus a fleet-wide phrase-frequency distinctiveness gate; the threshold and rationale are documented in `plan.md` |
| REQ-003 | Any write into `derived.trigger_phrases`/`derived.key_topics` respects the schema-v2 caps | Every candidate write set is validated against `SkillDerivedV2Schema.parse()` (`.opencode/skills/system-skill-advisor/mcp-server/schemas/skill-derived-v2.ts:44-52`: `trigger_phrases` <=24, `keywords` <=48) before it counts as a valid candidate, with headroom explicitly reserved for phase 009's own canonical generation output |
| REQ-004 | The design is measured against a pinned corpus, not eyeballed | Before/after parent-selection accuracy is captured against the hash-pinned routing-accuracy corpus phases 002/006 establish, using the existing `score-routing-corpus.py` lineage, with the exact corpus hash recorded in the result artifact so the comparison is reproducible |
| REQ-005 | The decision-record states a ship/no-ship verdict against a bar set BEFORE the comparison runs | `decision-record.md` records a pre-registered, concretely observable improvement bar (not invented after seeing results), the actual measured outcome, and an explicit ship or no-ship verdict with rationale |
| REQ-006 | This phase does not wire anything into production | All spike output stays inside this phase folder's own scratch workspace; any "ship" verdict hands off to a NEW, separately gated implementation phase rather than being wired in here |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A measured parent-selection accuracy delta on the pinned corpus is captured either way (improvement, regression, or no change) — the spike never ships or rejects the idea without a number behind it.
- **SC-002**: `decision-record.md` states a clear, evidence-backed ship/no-ship verdict, and if "no-ship," records why the O8 hypothesis did not hold rather than leaving it ambiguous.
- **SC-003**: Zero lines change in `scorer/lanes/*.ts` or `scorer/projection.ts` for the prototype — the "without changing scorer math" constraint is verified by diff, not asserted.
- **SC-004**: The distinctiveness-filter and schema-cap-budget design is written down in `plan.md` regardless of whether the spike ships, so a future implementation phase (or a future rejection of the idea) does not have to re-derive it.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Mitigation |
|------|------|------------|
| Dependency | Phase 009 (O1: canonical `derived` producer decision) | The spike's scratch writer must go through whichever path phase 009 designates, or an explicitly labeled throwaway writer if 009 has not resolved yet, so this spike never becomes a third or fourth production writer of the `derived` block |
| Dependency | Phase 002 / 006 (pinned routing-accuracy corpus) | The before/after comparison needs an exact-hash-pinned corpus; research.md itself warns checked-in routing-accuracy baselines are "version-sensitive and contradictory across sources" without one (research.md:89) |
| Risk | Schema caps too tight for a naive "project everything" approach — sk-doc alone has 12 modes across `vocabularyClasses` | Rank candidates by specificity and distinctiveness, truncate to a fixed budget that respects `SkillDerivedV2Schema`'s `trigger_phrases`/`keywords` caps with headroom reserved for phase 009's output |
| Risk | Dilution — projecting too many or too-generic phrases could hurt precision on unrelated prompts, the opposite of the intended effect | Require a fleet-wide distinctiveness gate (phrase must be exclusive, or near-exclusive, to one hub's vocabulary) before a phrase becomes a projection candidate |
| Risk | O8 is a single-lineage hypothesis (research.md:88), not independently confirmed | The ship/no-ship bar is evaluated strictly against the measured corpus result, not against the hypothesis's plausibility alone |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Which of `derived.trigger_phrases` (intent-shaped) vs `derived.key_topics` (entity-shaped) is the right destination for a given projected phrase? The spike should apply the same intent/entity split `projection.ts:204-221` already documents rather than inventing a new one.
- What per-hub projection budget avoids starving phase 009's own canonical generation output of schema-cap headroom, especially on hubs with more modes than sk-doc?
- Does sk-doc's own `vocabularyClasses` corpus produce enough genuinely distinctive multi-word phrases to move the needle, or is O8's premise stronger on a different, richer hub — a question the pilot measurement itself should help answer.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Program**: `sk-doc/019-skill-routing-refactor/033-json-optimization-implementation`
- **Research this phase implements**: `../../029-skill-json-optimization-research/research/research.md` (finding O8, lines 74-75, 88, 101)
- **Contract under study**: `.opencode/skills/sk-doc/sk-create-skill/references/shared/skill-root-metadata-contract.md`; `.opencode/skills/system-skill-advisor/mcp-server/schemas/skill-derived-v2.ts`
- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **QA**: See `checklist.md`
- **Architecture Decision**: See `decision-record.md`

## Structural phase links

| **Parent Spec** | `../spec.md` |
| **Predecessor** | `009-signal-quality` |
| **Successor** | `011-command-metadata-ingestion` |
