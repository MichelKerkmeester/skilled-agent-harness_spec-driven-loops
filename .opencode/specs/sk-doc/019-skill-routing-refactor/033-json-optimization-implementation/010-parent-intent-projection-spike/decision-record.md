---
title: "Decision Record: Parent-Intent Projection Design Spike"
description: "Decision record choosing to project hub-router/mode-registry vocabulary through the existing derived-metadata channel rather than a new scorer lane or an ungoverned runtime read, and setting the ship/no-ship measurement gate."
trigger_phrases:
  - "parent intent projection decision"
  - "derived channel vs new scorer lane"
  - "O8 ship no-ship gate"
importance_tier: "normal"
contextType: "decision"
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
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "010-parent-intent-projection-spike"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Decision Record: Parent-Intent Projection Design Spike

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Project Through the Existing Derived-Metadata Channel Instead of a New Scorer Lane

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted — prototype built and measured; verdict NO-SHIP recorded in ADR-002 |
| **Date** | 2026-07-29 |
| **Deciders** | Phase packet owner, O8 finding from the 029 skill/advisor JSON optimization research |

---

<!-- ANCHOR:adr-001-context -->
### Context

O8 observes that `hub-router.json`'s `vocabularyClasses` (e.g. sk-doc's `create-skill-aliases` class: "skill root metadata contract", "leaf-manifest config aliases required", "hub versus standalone skill class") carries distinctive per-mode phrases that never reach parent-hub selection, because `registry-compiler.cjs`'s `vocabularyForMode` (`registry-compiler.cjs:173-186`) only compiles them into the hub's own internal mode router, which runs AFTER the skill-advisor has already picked the parent (`hub-router.json:36-49`; `scorer/projection.ts:173-247`). This packet's brief requires a design that projects that vocabulary into a parent-selection input "without changing scorer math." O8 itself is a single-lineage (sol-high) hypothesis, not confirmed by the other two research lineages (research.md:88), so this phase needs a design AND a measurement gate, not a design alone.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: project a selected, high-specificity, hub-distinctive subset of `hub-router.json.vocabularyClasses` / `mode-registry.json.modes[].aliases` phrases into the EXISTING `derived.trigger_phrases` / `derived.key_topics` fields at data-generation time — the same fields `scorer/projection.ts:191-247` already reads into `SkillProjection.derivedTriggers`/`derivedKeywords`, already scored by the derived lane's phrase-boundary and specificity match (`scorer/lanes/derived.ts:62-87`) — rather than adding a new scorer lane, a new weighted field, or an ungoverned runtime read.

**How it works**: a prototype (built in Phase 2, gated on phase 009's write-path decision) filters candidate phrases by `phraseSpecificity >= 0.88` and fleet-wide distinctiveness, budgets them against `SkillDerivedV2Schema`'s caps, and writes survivors into a scratch copy of the target hub's `graph-metadata.json.derived`. The advisor's EXISTING sync/rebuild path then picks them up automatically — zero scorer-code diff, because the input channel (not the scoring logic) is what changed.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Project into the existing `derived` channel at generation time (chosen)** | Literally zero scorer-code change; reuses the existing schema, provenance fingerprint, trust-lane, demotion, and age-haircut machinery already governing `derived` (`skill-derived-v2.ts:44-52`; `derived.ts` age haircut via `derivedGeneratedAt`); auditable through the same validators every other `derived` write already passes through | Depends on phase 009 naming a canonical `derived` producer first, since this must not become a third/fourth writer of that block; only fires when the regenerator runs, so router/mode-registry edits need a resync | 9/10 |
| Runtime read-through folded into in-memory `derivedKeywords` (no persisted write) | Always fresh, no regenerator dependency, no schema-cap pressure on the persisted file | Bypasses `SkillDerivedV2Schema`'s provenance fingerprint, trust-lane, and demotion/age-haircut policy entirely, since there is no `generated_at` for an ad hoc runtime contribution; adds per-request file reads (`hub-router.json` + `mode-registry.json` for every hub) to every projection build unless a new cache layer is added — itself a scope increase this phase does not include | 5/10 |
| New dedicated scorer lane reading `hub-router.json` directly with its own weight | Cleanest separation of concerns; no dependency on phase 009 or the `derived` schema at all | Explicitly violates this packet's own constraint — "without changing scorer math" — since a new lane and weight IS a scorer-math change; adds a fourth lane to an already-tuned pipeline (`lexical`, `derived`, plus others) without the calibration work that tuning would require | 2/10 |
| Do not prototype at all; treat O8 as unconfirmed and record a no-ship verdict immediately | Zero effort, zero risk, avoids chasing a single-lineage hypothesis | Never generates the evidence needed to actually confirm or refute O8; abandons a finding this program's own research ranked as sol-high's "deepest effectiveness finding" (research.md:88) without ever measuring it | 3/10 |

**Why this one**: the chosen option is the only one that satisfies "without changing scorer math" as a literal, diff-verifiable constraint rather than a loose guideline, while reusing infrastructure (schema validation, provenance, age-haircut) that already exists and is already trusted by the scorer. Its dependency on phase 009 is a real cost, but it is the SAME dependency research.md already identified as the prerequisite for every other Tier-1 `derived`-touching opportunity (O2, O5, O8) — not a cost unique to this design.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- If the measurement clears the bar, sk-doc's (and later other hubs') distinctive per-mode vocabulary becomes usable evidence for parent selection, closing a gap the scaffolder itself already half-acknowledges (`init_skill.py:540-557` seeds generic router terms into `derived.key_topics` but never the rich per-mode tier).
- The design stays fully reversible and auditable regardless of outcome: every write is schema-validated, every write is scratch-only until a separate phase ships it, and the scorer code path never moves.

**What it costs**:
- This phase cannot execute until phase 009 resolves. Mitigation: `plan.md` Phase 1 defines an explicit, clearly labeled throwaway writer as a fallback so the spike is never truly blocked indefinitely, only delayed.
- Schema caps (`trigger_phrases` <=24, `keywords` <=48) mean not every candidate phrase can be projected on hubs with many modes. Mitigation: the specificity + distinctiveness ranking (`plan.md` §3, step 4) explicitly budgets and prioritizes rather than dumping every candidate.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| O8's premise does not hold on measurement (single-lineage hypothesis) | M | The ship bar is pre-registered before the comparison runs (REQ-005); a "no-ship" result is a complete, honest outcome for this phase, not a failure |
| Projected phrases dilute precision on unrelated prompts | M | Fleet-wide distinctiveness gate required before a phrase becomes a candidate (`plan.md` §3, step 3) |
| Phase 009 resolves with a producer design incompatible with a simple additive write | L | This spike's scratch writer is explicitly scoped to go through whichever path 009 designates; if incompatible, the spike documents the mismatch in its decision-record rather than working around it |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Pre-Registered Ship Bar and Measured Verdict

**Pre-registered ship bar (recorded 2026-07-29, BEFORE any before/after comparison ran):**
Measured in the pinned force-local TS-source regime (the same reproducible regime the program's baseline capture uses), over the hash-pinned labeled corpus (195 rows) + holdout (72 rows):

1. sk-doc-gold rows: top-1 correct count must INCREASE by >= 2 net (after minus before), AND
2. non-sk-doc-gold rows: zero top-1 regressions (no row correct-before becoming incorrect-after), AND
3. full-corpus top-3 (176/195) and holdout top-3 (53/72) must not drop.

Anything less is a NO-SHIP. The bar is deliberately asymmetric: the projection only touches sk-doc's derived fields, so it must prove sk-doc gains without collateral damage anywhere else.

**Measured outcome (2026-07-29, pinned force-local TS-source regime, guarded temp-apply of the scratch-patched sk-doc derived block, live file trap-restored):**
- Prototype selected 35 hub-distinctive multi-word candidates; patched trigger_phrases 16→20 (cap 24, 4 headroom), key_topics →44 (cap 48).
- sk-doc-gold top-1: 10/12 before → 10/12 after (bar required +2 net) — no movement.
- Non-sk-doc-gold top-1 regressions: 0 (bar met, but vacuously — nothing moved).
- Full-corpus top-3: 176→176; holdout top-3: 53→53 (no drop).

**Verdict: NO-SHIP.** The projection is measurably inert on the pinned corpus: the derived lane's phrase matching already saturates on sk-doc's existing signal set for every corpus prompt it can win, and the added router vocabulary changed no outcome. The O8 single-lineage hypothesis is refuted at current corpus composition. Revisit only if a future corpus expansion adds parent-hub-scaffolding-style prompts where the distinctive per-mode tier could plausibly discriminate — and then through a fresh, separately gated phase.
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The packet brief explicitly requires a design spike for O8, gated by measurement, not an unconditional build. |
| 2 | **Beyond Local Maxima?** | PASS | Four alternatives compared: chosen generation-time channel, runtime read-through, a new scorer lane, and doing nothing — each scored with stated tradeoffs. |
| 3 | **Sufficient?** | PASS | Reusing the existing `derived` schema, provenance, and age-haircut machinery is exactly enough infrastructure to satisfy "without changing scorer math" without inventing new governance. |
| 4 | **Fits Goal?** | PASS | The design stays scoped to a measurable, reversible spike; it does not pre-commit to shipping, matching the packet's explicit gating language. |
| 5 | **Open Horizons?** | PASS | A "no-ship" verdict is fully supported and does not foreclose revisiting O8 later with a different design if a future corpus or hub makes the premise stronger. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes** (once this phase executes, `plan.md` Phase 2-3):
- A scratch prototype script and a scratch copy of the sk-doc pilot hub's `graph-metadata.json.derived`, both confined to this phase folder.
- A before/after routing-accuracy result artifact against the pinned 002/006 corpus.
- This decision record's own Status line, updated from "Proposed" to a final ship/no-ship verdict once the measurement completes.

**What does NOT change** (regardless of outcome):
- No line of `scorer/lanes/*.ts` or `scorer/projection.ts`.
- No hub's live `graph-metadata.json`, `hub-router.json`, or `mode-registry.json`.
- No CI wiring or production routing behavior — a "ship" verdict hands off to a new, separately gated implementation phase rather than being wired in here.

**How to roll back**: see `plan.md` §7 Rollback Plan — every artifact lives under this phase folder's scratch workspace; discarding the folder, or simply not opening the follow-up phase, fully reverts the spike.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->
