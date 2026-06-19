---
title: "Feature Specification: Procedural Reliability Memory (benchmark-first, PROXY-ONLY)"
description: "Author the Memory MCP procedural-reliability unit from packet 028's research: Beta-posterior reliability-weighted recall, bad-pattern negative memory, skill-induction-from-repetition, and procedural version-reset. All four are PENDING and gated — no execution-success emitter exists today (only recommendation-acceptance), so the whole cluster is a benchmark-first, net-new write-path build, not a flag flip."
trigger_phrases:
  - "procedural reliability memory"
  - "beta posterior reliability recall"
  - "bad pattern negative memory"
  - "skill induction from repetition"
  - "procedural version reset"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/001-speckit-memory/012-procedural-reliability-benchmark"
    last_updated_at: "2026-06-19T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Built default-off procedural reliability benchmark plumbing and deterministic unit tests"
    next_safe_action: "Run the benefit micro-benchmark before promoting any procedural candidate"
    blockers:
      - "No execution-success emitter exists (only recommendation-acceptance captured)"
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "../research/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-001-012-procedural-reliability"
      parent_session_id: null
    completion_pct: 35
    open_questions:
      - "Does wiring an 'outcome'/usefulness emission out-earn the existing 'access'/confirmation signals when every prior is r=0.5?"
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 3 -->

# Feature Specification: Procedural Reliability Memory (benchmark-first, PROXY-ONLY)

## EXECUTIVE SUMMARY

This sub-phase scopes the Memory MCP **procedural-reliability** cluster mined from aionforge's `procedural-memory.md` against the live `system-spec-kit/mcp_server/` substrate (packet 028, child `001-speckit-memory`, PRIMARY). It bundles four research candidates into one coherent benchmark-first unit: **M-procedural-reliability-recall** (Beta-posterior reliability-weighted recall), **M-bad-pattern-negative-memory** (immutable negative procedural memory surfaced before reuse), **M-skill-induction-repetition** (off-by-default verbatim-procedure induction from recurrence), and **M-procedural-version-reset** (cut a new procedural version + reset reliability when the contract surface changes).

**The headline is a gate, not a green light.** The 38-iteration deep-research loop's Round-D adversarial pass (`research/iterations/iteration-021.md`) is "the strongest refutation cluster of the campaign": all of bad-pattern, skill-induction, and version-reset failed contact with the real infra. The reliability host *exists* (`adaptive_signal_events`) but its **`'outcome'`/usefulness signal is barely emitted** — recall ranking sees `'access'` hits, never a recall→task-success outcome. There is **no execution-success emitter** anywhere (the Completion-Verification gate has zero skill/memory attribution; only recommendation-acceptance is captured). Therefore **Beta-reliability-over-execution-outcomes is a net-new write-path build**, and the whole cluster is **PENDING / NO-GO until an emitter ships and a micro-benchmark proves it out-earns the existing signals**. No candidate in this unit is in 030's shipped Wave-0 record (section 14).

**Key gate**: build an outcome/usefulness emitter FIRST, then run ONE benefit micro-benchmark (does reliability-weighting out-earn `access`/confirmation when every prior is `r=0.5`?). The cold-start step is a no-op until data accrues — so a benchmark on synthetic-or-accrued outcomes is the precondition for promoting any of the four.

**Critical dependencies**: the shared bounded-Beta posterior primitive (`01-go-candidates.md` Shared-infrastructure — one f64 `(α₀+s)/(α₀+β₀+s+f)` + per-consumer adapters; the live integer scorer throws on fractional inputs); a net-new `'outcome'` emission source (`feedback-ledger.ts`); and, for bad-pattern, a table-rebuild schema migration (the 6-value `RELATION_TYPES` / `CHECK` constraint has no `HAS_FAILURE`).

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P2 |
| **Status** | Benchmark-build plumbing implemented; all candidates remain PENDING / benchmark-gated |
| **Created** | 2026-06-19 |
| **Branch** | `system-speckit/027-xce-research-based-refinement` |
| **Source roadmap** | `../../research/roadmap.md` §5 + §7 follow-ups; `../../research/synthesis/01-go-candidates.md` (Needs-validation + Follow-ups) |
| **Parent Packet** | system-spec-kit/028-memory-search-intelligence/001-speckit-memory |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The Spec-Kit Memory MCP treats `procedural` as a **decay-only classification label** — there is no track-record machinery on a stored procedure [CONFIRMED: `memory-types.ts:93-98` (decay-only label, no success/failure counters), `research/iterations/iteration-015.md:9`]. Recall ranks problem-match without any proven-reliability re-weighting, a known-failed procedure can resurface as positive guidance, a procedure recurring many times is never distilled into a reusable skill, and a contract-surface change does not reset a procedure's earned track record. aionforge's `procedural-memory.md` encodes a mature model for all four — but it assumes a `record_outcome(skill_id, success)` signal the internal substrate **does not emit**.

The deeper problem is **PROXY-ONLY signal**: the natural host for reliability (`adaptive_signal_events` with `signal_type IN ('access','outcome','correction')` + `recordAdaptiveSignal()` + `ADAPTIVE_SIGNAL_WEIGHTS` + FSRS columns) exists, but a read-hit `'access'` is all that flows broadly; the recall→task-success **`'outcome'`** usefulness signal has only ~2 call sites [CONFIRMED: `research/iterations/iteration-018.md:11,17`; delta `iter-018.jsonl:4` "'outcome' is barely emitted (only 'access' broadly)"]. There is no execution-success emitter at all — only recommendation-acceptance is captured. Without that signal, a Beta posterior is fed `r=0.5` everywhere and is a cold-start no-op.

### Purpose
Capture the procedural-reliability cluster as ONE benchmark-first unit with **honest per-candidate gates**, so a future implementer (1) builds the missing outcome/usefulness emitter as the shared prerequisite, (2) runs a single benefit micro-benchmark to decide whether reliability-weighting out-earns the existing signals, and (3) only then promotes the reliability-recall candidate — with bad-pattern, skill-induction, and version-reset each carrying their own refuted-or-gated status from the research record. This spec does NOT authorize implementation; it freezes the research verdicts as acceptance criteria.

<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The four procedural candidates as a coherent benchmark-first unit, each with a research-cited acceptance criterion and an explicit PENDING gate (`needs-benchmark` / `schema-migration` / `shared-infra-dep`).
- The shared prerequisite: a net-new outcome/usefulness **emitter** feeding the existing `adaptive_signal_events` `'outcome'` channel, and the shared bounded-Beta f64 primitive + a procedural adapter.
- One benefit micro-benchmark design (reliability-weighting vs `access`/confirmation under accrued/synthetic outcomes) as the promotion gate for M-procedural-reliability-recall.

### Out of Scope
- Schema migrations, measured benchmark promotion, and commits — this build keeps benchmark-dependent behavior default-off.
- The execution-success emitter's *use* for task-success ranking beyond procedural recall (follow-on per `01-go-candidates.md:109`).
- Adopting an episode model — the research decision is GRAFT onto the existing chunk-save / reconsolidation-on-save hook, never an immutable-episode capture↔consolidation split [CONFIRMED: `research/iterations/iteration-018.md:16`].
- The other three subsystems (code-graph, skill-advisor, deep-loop) — sibling phases. The Advisor-side Beta posterior (`SA-outcome-weighted-ranking`) is a follow-on for `003-skill-advisor`, not this unit [`roadmap.md:268`].
- Cross-cutting determinism / bi-temporal / graceful-degrade candidates (other `001-speckit-memory` impl sub-phases).

### Files to Change
> No files are changed by this spec (planning only). The table records the seams a FUTURE implementer would touch, per the research, so the scope is legible.

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `mcp_server/lib/feedback/feedback-ledger.ts` (emitter source) | Modified | Default-off outcome/usefulness bridge into the `'outcome'` / `'correction'` `adaptive_signal_events` channel (flag: `SPECKIT_PROCEDURAL_OUTCOME_EMITTER`) |
| `mcp_server/lib/cognitive/adaptive-ranking.ts` | Modified | Default-off reliability fold for procedural rows using bounded Beta evidence (flag: `SPECKIT_PROCEDURAL_RELIABILITY_RECALL`) |
| `mcp_server/lib/scoring/bayesian-scorer.ts` | Created | f64 `(α₀+s)/(α₀+β₀+s+f)` export + procedural adapter (integer scorer untouched) |
| `mcp_server/lib/storage/causal-edges.ts:21-28`; `lib/search/vector-index-schema.ts:1113-1115,1781-1783` | Modify (migration) | `HAS_FAILURE` relation needs a table-rebuild migration (bad-pattern) — net-new schema, NOT reuse |
| `mcp_server/lib/reconsolidation.ts:38,202-210,527-533` | Modify | New reconsolidation action + repetition counter (skill-induction); negative-tier write + retrieval-filter audit (bad-pattern) |

<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST hold before ANY candidate ships)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Outcome/usefulness emitter prerequisite is built first | A recall→task-success `'outcome'` signal is emitted into `adaptive_signal_events` from a real source (`feedback-ledger.ts`), beyond the broadly-flowing `'access'` hit — confirmed at >2 call sites with attribution. Until then every reliability prior is `r=0.5` and the recall fold is a cold-start no-op [delta `iter-018.jsonl:4`] |
| REQ-002 | Benefit micro-benchmark gates the reliability fold | A single benchmark shows reliability-weighting out-earns the existing `access`/confirmation signals on accrued/synthetic outcomes; a non-result keeps M-procedural-reliability-recall PENDING. No candidate has a measured before/after number today [`03-corrections-caveats-and-residuals.md:33`] |
| REQ-003 | Shared bounded-Beta primitive is f64 + adapter, not the integer scorer | `(α₀+s)/(α₀+β₀+s+f)`, cold-start `0.5`, count-floor; built once as an f64 export with a procedural adapter — the live integer `computeScore`/`shouldDemote` throws on the fractional inputs reliability needs [`01-go-candidates.md:65`; `bayesian-scorer.ts:182-191`] |

### P1 - Required per-candidate gates (the frozen research verdicts)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | M-procedural-reliability-recall: NEEDS-BENCHMARK | Recall multiplies match score by the Beta-posterior mean (weak `Beta(1,1)` → unproven `0.5`). Host EXISTS (`adaptive_signal_events` + weight + FSRS columns); the gate is REQ-001 + REQ-002 [CONFIRMED: delta `iter-018.jsonl:4`, seam `adaptive-ranking.ts:346`] |
| REQ-005 | M-bad-pattern-negative-memory: REFUTED-as-reuse → schema-migration BUILD | A `HAS_FAILURE` edge is hard-rejected at TWO layers (frozen 6-value `RELATION_TYPES` `causal-edges.ts:21-28` + SQLite `CHECK(relation IN (...6...))` `vector-index-schema.ts:1113-1115,1781-1783`) requiring a table-rebuild migration. If built via the `'deprecated'` tier + `contradicts` 0.8 dampener precedent instead, a PREREQ audit of ALL retrieval-filter sites is required so anti-patterns never resurface as positive guidance [CONFIRMED: delta `iter-021.jsonl:2`, `iter-018.jsonl:5`] |
| REQ-006 | M-skill-induction-repetition: REFUTED-as-reuse → heaviest BUILD | `ReconsolidationAction` is a closed 3-way union (`merge/conflict/complement`, `reconsolidation.ts:38`); `determineAction` sees only a similarity scalar (`:202-210`); NO recurrence/frequency counter exists. Needs a new action AND a non-existent repetition counter AND an induction-precision gate (verbatim body, content-addressed id, off-by-default, never auto-promoted across a trust boundary). Write-side corpus-quality risk [CONFIRMED: delta `iter-021.jsonl:3`, `iter-018.jsonl:6`] |
| REQ-007 | M-procedural-version-reset: REFUTED-as-net-new → ALREADY EXISTS | The proposed mechanism already ships: reconsolidation is append-only ("mark old superseded, create new", `reconsolidation.ts:273`) with deprecate-never-delete (`importance_tier='deprecated'` `:526/529/575` + `insertSupersedesEdge :365` + `recordLineageTransition :370`), type-agnostic so procedural is covered. Residual = only the explicit **reliability-reset-to-zero** on a contract-surface change is unproven; it rides REQ-001's reliability counter [CONFIRMED: delta `iter-021.jsonl:4`] |

<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Each of the four candidates carries an explicit STATUS (all PENDING here) with its gate (`needs-benchmark` / `schema-migration` / `shared-infra-dep` / `already-exists-residual`) and a research file:line citation — verifiable against §8 STATUS.
- **SC-002**: The shared prerequisite chain (outcome emitter → f64 Beta primitive + procedural adapter → micro-benchmark) is sequenced so no candidate is billed as a free byproduct of a present signal.
- **SC-003**: No candidate claims a measured benefit number; every leverage/effort rating is labelled structural inference [`03-corrections-caveats-and-residuals.md:33`].
- **SC-004**: The spec records the GRAFT-not-episode-model decision and the "0-of-4 procedural reuse claims survived" refutation cluster so the unit is not mistaken for low-effort wins.

<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Outcome/usefulness emitter (net-new) | Reliability prior stays `r=0.5`; recall fold is a cold-start no-op | Build the emitter (REQ-001) as the shared prereq before any fold |
| Dependency | Shared bounded-Beta f64 primitive | Integer scorer throws on fractional inputs | f64 export + procedural adapter (REQ-003); shared with Advisor C4 (build once, wire twice) |
| Dependency | `HAS_FAILURE` schema migration | Bad-pattern cannot host a failure edge without a table rebuild | Treat as a net-new schema-migration BUILD, or use the `'deprecated'`/`contradicts` precedent + filter-site audit |
| Risk | Skill-induction write-side corpus pollution | Spurious inductions pollute the corpus and are hard to roll back | Induction-precision gate; off-by-default; verbatim body; content-addressed idempotent id; never auto-promote across a trust boundary |
| Risk | Anti-patterns resurfacing as positive guidance | A negative-memory tier honored at only some retrieval-filter sites leaks bad procedures as advice | Audit ALL retrieval-filter sites before shipping bad-pattern (REQ-005 prereq) |
| Risk | No measured benefit anywhere | Building reliability-weighting that does not out-earn existing signals | The micro-benchmark gate (REQ-002) converts the highest residual unknown into a measured delta before promotion |

<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Reliability / Correctness
- **NFR-R01**: The reliability fold MUST be order-neutral while every prior is `r=0.5` (cold-start no-op) — recall order is byte-stable until `'outcome'` data accrues.
- **NFR-R02**: The bounded-Beta posterior MUST be immune to count-flooding — a fresh procedure scores neutral `0.5`, a `1/0` scores `2/3` (never an over-trusted `1.0`).
- **NFR-R03**: Skill-induction MUST never execute a stored procedure (inert data) and MUST never auto-promote across a trust boundary.

### Integrity
- **NFR-I01**: Induced procedures MUST be content-addressed + idempotent (re-consolidating the same episode after a crash writes nothing the second time).
- **NFR-I02**: Bad-pattern negative memory MUST be honored at ALL retrieval-filter sites or it is not shipped (no partial honoring that leaks anti-patterns as positive guidance).

<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

- **No outcome data yet**: every Beta prior is `r=0.5`; the reliability fold is a no-op and recall order is unchanged (the dominant real state until the emitter ships).
- **Single failed procedure (`0/1`)**: posterior `1/3` — penalized but not zeroed; the procedure can still surface for an unrelated problem.
- **Unrelated failure mode**: a bad-pattern whose embedding does not match the current query does NOT hold the skill back (penalty `1/(1+weight·count)` only when failure-embedding matches).
- **Embedder down at recall time**: degrade to the description's BM25 lexical floor; the bad-pattern penalty is skipped (no query vector) but the patterns still surface (mirrors C9 graceful-degrade and `procedural-memory.md` retrieving-skills step 5).
- **Description-only edit**: MUST NOT cut a new procedural version or reset reliability (only a contract-surface change does).

<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

| Dimension | Rating | Rationale |
|-----------|--------|-----------|
| **Blast radius** | High | Ranking + reconsolidation + causal-edge schema + a net-new write-path emitter |
| **Reversibility** | High (per-candidate) | Each candidate is default-OFF + scoped-revert; emitter/primitive are additive and order-neutral at `r=0.5` |
| **Net-new vs reuse** | Net-new | 0-of-4 procedural reuse claims survived adversarial verification [`iter-021.md:14`] |
| **Measured benefit** | None | Every leverage/effort rating is structural inference [`03-...:33`] |
| **Gate** | Benchmark-first | An outcome emitter + a benefit micro-benchmark precede any promotion |

<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:risk-matrix -->
## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Reliability-weighting does not out-earn existing signals | M | M | Micro-benchmark gate (REQ-002) before promotion |
| R-002 | Skill-induction pollutes the corpus with spurious procedures | H | M | Induction-precision gate, off-by-default, verbatim body, ≥3 recurrence |
| R-003 | Anti-pattern resurfaces as positive guidance | H | L | Audit ALL retrieval-filter sites before shipping bad-pattern |
| R-004 | `HAS_FAILURE` migration corrupts the causal-edge table | M | L | Table-rebuild migration tested in isolation; or use the `'deprecated'`/`contradicts` precedent |
| R-005 | Reliability counter never accrues (emitter unused) | M | M | Confirm `feedback-ledger.ts` is the canonical `'outcome'` source at >2 sites |

<!-- /ANCHOR:risk-matrix -->

---

<!-- ANCHOR:user-stories -->
## 11. USER STORIES

### US-001: Proven procedures surface first (Priority: P2)

**As an** agent recalling a procedure, **I want** a procedure with a proven success track record to outrank an equally-matched unproven one, **so that** I reuse what has worked.

**Acceptance Criteria**:
1. Given two equally problem-matched procedures, When one has a higher Beta-posterior success mean, Then it ranks above the other (only after the emitter + benchmark gate pass).
2. Given a fresh unproven procedure, When it is recalled, Then it scores a neutral `0.5` — neither boosted nor buried.

### US-002: Known failures are visible before reuse (Priority: P2)

**As an** agent about to reuse a procedure, **I want** a known failure mode that matches my current problem surfaced WITH the procedure, **so that** I do not repeat a recorded mistake.

**Acceptance Criteria**:
1. Given a procedure with a recorded failure mode matching the query, When it is recalled, Then it sinks below an equally-matched clean one AND its failure mode is shown.

### US-003: A changed procedure re-earns its track record (Priority: P2)

**As an** operator, **I want** a contract-surface change to cut a new procedural version and reset its reliability to zero, **so that** a different procedure's track record is not inherited.

**Acceptance Criteria**:
1. Given a contract-surface change, When the procedure is saved, Then a new version is cut, the prior is deprecated atomically, and reliability resets to zero.
2. Given a description-only edit, When the procedure is saved, Then NO new version is cut.

<!-- /ANCHOR:user-stories -->

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

- Does wiring an `'outcome'`/usefulness emission, then folding reliability into the rank score, **out-earn** the existing confirmation/`access`/relevance signals when every input starts at `r=0.5`? (The benchmark question — `roadmap.md:269`, `01-go-candidates.md:110`.) **UNRESOLVED — owned by the implementation packet.**
- Can `feedback-ledger.ts` `FeedbackEventType` be the canonical `'outcome'` source, or is a new emitter call-site needed (e.g. does `handlers/checkpoints.ts` emit `'outcome'`)? [`research/iterations/iteration-018.md:23`] **UNRESOLVED.**
- For bad-pattern: is the `'deprecated'` tier + `contradicts` 0.8 dampener precedent sufficient, or is the `HAS_FAILURE` table-rebuild migration mandatory for the surfaced-before-reuse semantics? **UNRESOLVED — REQ-005 prereq.**
- For skill-induction: what induction-precision gate (lexical floor + recurrence threshold default 3) keeps write-side corpus quality acceptable? **UNRESOLVED — needs-benchmark.**

<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:approach -->
## 13. EXECUTION APPROACH

> This sub-phase now contains default-off benchmark-build plumbing. Promotion still requires the benchmark gate.

- **Benchmark-first, one candidate at a time.** Build the shared prerequisites (outcome emitter → f64 Beta primitive + adapter) BEFORE any reliability fold; run the benefit micro-benchmark BEFORE promoting M-procedural-reliability-recall.
- **Each candidate behind a default-OFF flag**, self-contained and reversible with its own scoped commit (mirroring the 030 Wave-0 per-candidate discipline).
- **GRAFT, never an episode model** — attach at the existing reconsolidation-on-save hook + `adaptive_signal_events`, not an immutable-episode capture↔consolidation split.
- **No fabricated benefit numbers** — every leverage/effort rating stays labelled structural inference; the micro-benchmark is the only place a real delta is produced.
- **Per-candidate gate**: read the seam → implement → unit test → build + suite green → `validate.sh --strict` → adversarial review → scoped commit. Reliability-recall additionally requires the benchmark to earn it.

<!-- /ANCHOR:approach -->

---

<!-- ANCHOR:status -->
## 14. CANDIDATE STATUS

> All four candidates are **PENDING**. None appears in the shipped Wave-0 record (Wave-0 record, candidates 1-13 — the procedural cluster is absent; the closest, C4-A idempotency, is unrelated). Gate keys: `needs-benchmark` (a benefit micro-benchmark must pass first), `schema-migration` (a table-rebuild is required), `shared-infra-dep` (depends on the outcome emitter + f64 Beta primitive), `already-exists-residual` (mechanism ships; only a thin residual is net-new).

| # | Candidate | Status | Gate | 030 Commit | Research evidence |
|---|-----------|--------|------|-----------|-------------------|
| 1 | M-procedural-reliability-recall | **PENDING** (default-off plumbing built) | needs-benchmark | — (not in 030 §14) | Flags registered: `SPECKIT_PROCEDURAL_OUTCOME_EMITTER`, `SPECKIT_PROCEDURAL_RELIABILITY_RECALL`; deterministic tests pass. Promotion still needs a measured benchmark delta [`iter-018.jsonl:4`, `iter-015.jsonl:2`] |
| 2 | M-bad-pattern-negative-memory | **PENDING** | schema-migration (+ filter-site audit) | — (not in 030 §14) | REFUTED-as-reuse; `HAS_FAILURE` rejected at 2 layers → table-rebuild; or `'deprecated'`/`contradicts` precedent + audit [`iter-021.jsonl:2`, `iter-018.jsonl:5`] |
| 3 | M-skill-induction-repetition | **PENDING** | needs-benchmark (heaviest; write-side risk) | — (not in 030 §14) | REFUTED-as-reuse; closed `ReconsolidationAction` union + no repetition counter → new action + counter + precision gate [`iter-021.jsonl:3`, `iter-018.jsonl:6`] |
| 4 | M-procedural-version-reset | **PENDING** | already-exists-residual | — (not in 030 §14) | REFUTED-as-net-new; append-only deprecate-never-delete already covers it; only the explicit reliability-reset-to-zero residual rides REQ-001 [`iter-021.jsonl:4`] |

**Promoted candidate count: 0 — Pending count: 4.** Shared benchmark plumbing is implemented, but the candidate remains benchmark-first by design (`research/iterations/iteration-021.md:14` "removes the procedural cluster from the low-effort-wins column").

<!-- /ANCHOR:status -->

---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Source research (PRIMARY)**: `../research/research.md` (Memory MCP external mining), iterations `015/018/021`, deltas `iter-015/018/021.jsonl`.
- **Parent roadmap**: `../../research/roadmap.md` §5 (Bounded Reliability-Weighted Learning), §7 (Follow-ups), MEMORY-SYSTEMS addendum.
- **Synthesis**: `../../research/synthesis/01-go-candidates.md` (Needs-validation cluster + Shared-infrastructure + Follow-ups), `03-corrections-caveats-and-residuals.md` (PROXY-ONLY residual §C).
- **External source**: `../../external/aionforge-memory-development/docs/procedural-memory.md`.
- **Plan**: See `plan.md`. **Tasks**: See `tasks.md`. **Checklist**: See `checklist.md`.

<!-- /ANCHOR:related-docs -->
