---
title: "Feature Specification: Skill & Advisor JSON Optimization Implementation"
description: "12-phase, dependency-ordered, safety-gated implementation of the 029 ranked opportunity map (O1-O11) — making every skill and advisor JSON across .opencode/skills optimized, automated, effective, tested, and integrated, reviewed and restructured by an independent Opus architect before execution."
trigger_phrases:
  - "skill json optimization implementation"
  - "advisor derived block regenerator"
  - "json optimization implementation program"
importance_tier: "important"
contextType: "specification"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/033-json-optimization-implementation"
    last_updated_at: "2026-07-29T09:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored planned phase program"
    next_safe_action: "Schedule phase 001 per plan"
    blockers: []
    key_files:
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "033-json-optimization-implementation"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Which derived producer (TS sync writer vs Python compiler vs a shared schema package) becomes authoritative — resolved by Phase 1, not pre-empted here"
      - "Whether Tier-3 items (O9-O11) get dedicated phases or fold into adjacent Tier-1/2 phases — resolved at phase-scoping time"
    answered_questions:
      - "The 029 ranked opportunity map (O1-O11) is restructured into a 12-phase, dependency-ordered, safety-gated program by an independent Opus architect review before any implementation starts"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: Skill & Advisor JSON Optimization Implementation

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Type** | Phase parent |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-07-29 |
| **Track** | sk-doc |
| **Parent** | `sk-doc/019-skill-routing-refactor` |
| **Parent Spec** | ../spec.md |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The 029 deep-research program concluded the skill/advisor JSON fleet is **structurally healthy but not lifecycle-complete**: 11/11 roots pass the H/S presence contract and generated manifests are byte-fresh, but the real gaps are consumption, freshness, and integration seams — authored data that never reaches routing, generated data that drifts because it has no regenerator or freshness gate, and validation that runs offline instead of in CI. Three independent model lineages (sol-high, glm-high, grok-high; 5 iterations each, no early convergence) converged on an 11-item ranked opportunity map (O1-O11), with the `derived` block's missing regenerator and freshness gate as the single highest-leverage, 3/3-agreed gap.

Purpose: implement that ranked opportunity map as one coherent, dependency-ordered program. An independent Opus architect reviewed the 029 map and restructured it into 12 phases sequenced by prerequisite and blast-radius rather than by tier number alone — because several items (field trimming, generation, parent-intent projection) depend on first naming the authoritative `derived` producer, and because edits to the advisor's scorer/compiler touch code that live, concurrently-running sessions route through right now. This parent spec documents the program's purpose, its guiding principles, and its program-level requirements; the bounded per-phase scope, file-level acceptance criteria, and execution order live in each child phase's own spec.md.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

In scope — implementing all 11 opportunities from the 029 ranked map: the `derived` block's canonical owner and regenerator/freshness gate (O1); the scaffold-to-ingest journey proof (O2); a Gate-2 golden-prompt acceptance suite in CI (O3); wiring the advisor compiler / graph-schema / routing-accuracy validation into CI (O4); removing or migrating dead/orphan fields (O5); intent-signal quality fixes (O6); ingesting `command-metadata.json` into command routing (O7); a parent-intent projection from mode/router vocabulary (O8); generated `leaf-manifest.config.json` defaults (O9); denser `command-metadata`/`leaf-aliases` e2e tests (O10); and resolving duplicate authorities (O11). Each child phase under this folder owns one bounded slice of this map and states its own files-to-change, acceptance criteria, and safety gate.

Out of scope — a ground-up redesign of the advisor scoring algorithm (only the targeted fixes named by O1/O6/O8); changing the H/S class contract itself; any JSON or pipeline surface not named in the 029 research scope; re-litigating findings already settled by 029 §5 ("what all three agree is NOT the problem") — presence/class conformance, generated-manifest freshness, the H/S split, and compiled-route publication mechanics stay as-is.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Baseline captured before any gate lands | The pinned routing-accuracy corpus hash and current CI pass/fail state are recorded by the baseline-capture phase (Phase 2), ahead of every gate, delete, migration, and rewire — Phase 1 is the non-routing derived-authority decision — per the regression baseline-and-delta discipline |
| REQ-002 | Keystone derived-authority decision resolved first | Phase 1 names the single authoritative `derived` producer (TS sync writer vs Python compiler vs a shared schema package) as a decision record before any phase that trims, generates, or projects `derived` fields (O2, O5, O8) starts |
| REQ-003 | Phases ordered by routing-blast-radius, low to high | Dead-field, config-default, and test-density phases (O5/O9/O10-class work) land before any phase capable of changing `advisor_recommend` output |
| REQ-004 | Every routing-changing phase is corpus-gated | No phase that can move advisor scoring or routing output merges unless it passes the pinned routing-accuracy corpus (195 labeled + 72 holdout + 24 ambiguity prompts) with no regression against the REQ-001 baseline |
| REQ-005 | All 11 opportunities have an owning phase or a recorded deferral | Each of O1-O11 maps to exactly one phase's acceptance criteria, or that phase's spec records an explicit deferral rationale |
| REQ-006 | Live shared advisor code changes ship guarded | Any phase touching the scorer, compiler, or advisor ingestion path ships behind a reversible gate (feature flag, shadow-mode comparison, or CI-blocking check) — never an in-place edit to the live, concurrently-used runtime |
| REQ-007 | Program-level structural validation is clean | `validate.sh <folder> --recursive --strict` reports Errors:0 across this parent and all 12 phase children before the program is marked Complete |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

The REQ-001 baseline (corpus hash + CI state) is captured and referenced by every corpus-gated phase; Phase 1's derived-authority decision is recorded and cited by every phase that depends on it; all 11 opportunities (O1-O11) are addressed with `file:line` evidence re-verified against the checked-out tree at the time each phase starts; no phase regresses the pinned routing-accuracy corpus; no unguarded edit to live advisor scorer/compiler code merges; and the parent plus all 12 phase children pass `validate --recursive --strict` with Errors:0.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Mitigation |
|------|------|------------|
| Risk | Editing live, concurrently-used advisor runtime code (scorer/compiler) while other sessions route through it | Guarded-rollout principle: feature flag / shadow-mode comparison per phase, never a big-bang in-place edit |
| Risk | Keystone (O1) authority pick turns out wrong, forcing rework in dependent phases | Phase 1 ships as a decision record reviewed before any dependent phase (O2/O5/O8) starts work |
| Risk | Routing-accuracy baseline numbers are version-sensitive and contradictory across sources (per 029 §4) | Every corpus gate pins an exact corpus hash; no phase quotes a bare, unpinned accuracy percentage |
| Risk | A multi-phase program run over time drifts from the live fleet as skills/hubs are added mid-program | Re-run the H/S presence and freshness gates at each phase boundary before treating prior evidence as current |
| Dependency | The 029 ranked opportunity map and its per-lineage evidence | Phase scoping is only valid while 029's `file:line` citations still match the checked-out tree; each phase re-confirms its own citations before acting on them |
| Dependency | The independent Opus architect's 12-phase restructuring of O1-O11 | Captured in the phase children's own scope and dependency ordering, not renarrated in this parent |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Which `derived` producer becomes authoritative (TS sync writer, Python compiler, or a new shared schema package) — deferred to Phase 1's own spec and decision record; this parent does not pre-empt it.
- Whether Tier-3 items (O9-O11) receive dedicated phases or fold into adjacent Tier-1/2 phases — resolved by each phase's own scope, not renarrated here.
- Whether the O7 disagreement (glm-high frames command-metadata ingestion as a clear gap; sol-high treats it as a legitimate distinct-consumer split, per 029 §4) changes that phase's acceptance criteria — the owning phase re-confirms the `COMMAND_BRIDGES` hardcoding claim against source before scoping any fix.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

The Status column reflects **execution state** (updated as phases land), not planning intent. It is the coordination truth; per-phase detail lives in each child.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | `001-derived-authority-decision/` | Name the canonical `derived` authority; reconcile Python shape vs TS lifecycle capabilities (decision record) | Complete |
| 2 | `002-baseline-capture/` | Pin the routing-accuracy corpus hash; capture top-1/3; confirm all 11 roots pass the compiler | Complete |
| 3 | `003-derived-regenerator-migration/` | Build the `derived` regenerator; migrate 11 roots; add the freshness gate | Complete |
| 4 | `004-scaffold-journey/` | `init_skill` auto-`--fix`; S-config defaults; joined scaffold→gate→ingest→route test | Complete |
| 5 | `005-ci-golden-prompts/` | Gate-2 golden-prompt acceptance suite in CI (top-1/top-3) | Complete |
| 6 | `006-ci-compiler-accuracy-gates/` | Wire compiler graph-schema + routing-accuracy corpus into CI | Complete |
| 7 | `007-dead-field-deletes/` | Remove routing-neutral dead fields; resolve duplicate authorities | Complete |
| 8 | `008-manual-to-edges-migration/` | Migrate `manual.*` → typed edges (behind the routing-accuracy gate) | Complete |
| 9 | `009-signal-quality/` | Intent-signal coverage floor, dedup, path-noise strip; fallback parity tests | Complete |
| 10 | `010-parent-intent-projection-spike/` | Parent-intent projection design spike (ships only if it beats the corpus) | Complete |
| 11 | `011-command-metadata-ingestion/` | Ingest `command-metadata.json` into TS + Python command routing + drift-guard | Planned |
| 12 | `012-integration-verification-rollout/` | Re-measure vs baseline; prove daemon reindex; rollback per high-blast change | In Progress |
| 13 | `013-routing-regression-diagnosis/` | Measure, attribute and disposition the reproduced -2 on holdout top-1/top-3 and delegation; no re-pin while open | Complete |
| 14 | `014-non-regression-gate-restoration/` | Repair the scorer-eval ratchet and wire it into CI; prove it fails on a deliberate mutation | Complete |
| 15 | `015-evidence-integrity-repair/` | Per-item checklist evidence; re-open the three false regression items; reconcile contradictory completion fields | Complete |
| 16 | `016-packet-metadata-regeneration/` | One close-time generator pass for phase map, continuity, derived status and fingerprints | Complete |
| 17 | `017-authority-path-corrections/` | Dead authority citations, the stale contract doc, and the tracked scratch artifact | Planned |
| 18 | `018-finding-disposition-register/` | One disposition per audit finding, plus the retrospective on severity inversion and coverage gaps | Planned |
| 19 | `019-program-surface-leftovers/` | Workflow token permissions, feature-catalog mode-vs-packet framing, deprecated derived-sync writer, requirement wording | Planned |
| 20 | `020-preprogram-code-conformance/` | The four code findings that predate this program: comment label, strict-mode placement, manifest containment guard, JSDoc | Planned |

### Phase Transition Rules

- Phase 1 is the keystone decision and gates 3/7/9/10; it ships as a reviewed decision record before any dependent phase starts.
- Phase 2 (baseline) precedes every gate, delete, migration, and rewire so regressions are measurable against a pinned hash.
- Phases 13-18 are the post-audit remediation arc. Phase 13 measures and dispositions the routing regression and blocks 15 and 16; 14 takes its expected values from that disposition. Phase 16 must never run before 13 and 15, because reconciling status over an open regression converts a visible inconsistency into an invisible one. Phase 17 is independent and may run in parallel; phase 18 closes last. Phases 19 and 20 close the coverage gap a finding-by-finding audit found in 13-18: 19 owns four in-scope findings no other phase claimed, and 20 owns the four that blame code this program never touched — scoped here deliberately, with their pre-program provenance recorded, because a backlog with no owner is how findings disappear.
- Phases 3/4 land before Phase 6 turns on the compiler gate, so a newly scaffolded skill never fails CI.
- Phase 5 (golden prompts) may proceed early against the current fleet; the Phase 6 compiler gate waits on 3 and 4.
- Phase 8 (routing-changing `manual.*` migration) and Phase 9 land behind the Phase 6 routing-accuracy gate.
- Phase 10 is a gated design spike — a no-go result is valid and blocks nothing.
- Phase 12 gates the program close: end-state re-measurement, daemon-reload proof, and a recorded rollback for each high-blast change (3, 8, 11).
- Every child passes strict validation at intake and closure; this parent map is the coordination truth, detailed execution stays in the children.
<!-- /ANCHOR:phase-map -->

---

## RELATED DOCUMENTS

- **Research this program implements**: `../029-skill-json-optimization-research/research/research.md` (O1-O11 ranked opportunity map, cross-lineage evidence, §6 recommended next step)
- **Contract under study**: `.opencode/skills/sk-doc/sk-create-skill/references/shared/skill-root-metadata-contract.md`
- **Program predecessors**: packets 021-029 under `../`

## Structural phase links

| **Parent Spec** | `../spec.md` |
| **Predecessor** | `029-skill-json-optimization-research` |
| **Successor** | none |
