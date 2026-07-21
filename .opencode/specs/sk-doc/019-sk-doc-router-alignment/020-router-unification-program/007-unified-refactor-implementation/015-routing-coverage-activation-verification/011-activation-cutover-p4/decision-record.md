---
title: "Decision Record: Compiled Routing Staged Activation Cutover (P4)"
description: "Three decisions governing the terminal P4 cutover: advance the effective default per hub via cohort state rather than a fleet-wide unset=on flip; make each hub's rewrite an atomic lockstep and flip the two shared create-skill parent templates last under a normalized-parity assertion; and gate entry on a proven P3 coverage-closure join gate with per-hub stop-on-first-failure and byte-exact rollback."
trigger_phrases:
  - "compiled routing cutover decision record"
  - "per-hub cohort staging decision"
  - "coverage-closure join gate decision"
importance_tier: "critical"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-sk-doc-router-alignment/020-router-unification-program/007-unified-refactor-implementation/015-routing-coverage-activation-verification/011-activation-cutover-p4"
    last_updated_at: "2026-07-21T02:20:48Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "ADR-001/002/003 realized by the dry-run-proven controller"
    next_safe_action: "Land 013/014 to green the join gate, then run under go-ahead"
    blockers:
      - "Join gate BLOCKED: siblings 013/014 and the create-skill ready fixture are Planned"
    key_files:
      - "spec.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "pending"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Fleet-wide unset=on or per-hub cohort staging? Per-hub cohort staging (ADR-001)."
      - "Do the shared create-skill parent templates flip per hub or once? Once at fleet completion, tracked in the lockstep set throughout (ADR-002)."
      - "Is 013/014 'available' or 'implemented-and-verified' the entry condition? Implemented-and-verified (ADR-003)."
---
# Decision Record: Compiled Routing Staged Activation Cutover (P4)

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Advance the effective default per hub via cohort state, never a fleet-wide unset=on flip

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted (design direction for P4; execution gated on the coverage-closure join gate and an operator go-ahead) |
| **Date** | 2026-07-20 |
| **Deciders** | Claude Opus 4.8, on the `015` research spine (`synthesis-v1.md`, `verification-v1.md`, `review-v1.md`); operator retains override authority |

---

<!-- ANCHOR:adr-001-context -->
### Context

The obvious way to make compiled routing the effective default is to flip `SPECKIT_COMPILED_ROUTING` so that `unset` means on. That is unsafe here for a verified, specific reason: **all seven activation manifests already read `servingAuthority: compiled, shadowOnly: false`** (`verification-v1.md` claim 6 — a fresh agent `cat`'d all seven, upgrading the synthesis's own 1/7-confirmed to 7/7). The serve-time resolver dual-gates on the flag AND `servingAuthority === 'compiled'` (`resolve.cjs:40-42`, CONFIRMED). Since the manifest gate is already met everywhere, the flag is the only remaining gate. A fleet-wide `unset=on` would therefore not stage anything: it would light all seven hubs at the same instant (F-5-3, CF-ACT-6).

Compounding this, the flag is bi-state today: `resolve.cjs:22-23` and `advisor-recommend.ts:362` both test `=== '1'`, so `unset` and `'0'` are identical and there is no way to express "on for this hub, not yet for that one" or an explicit kill-switch (CF-ACT-6, CONFIRMED). Child `002` remediates this by shipping a tri-state flag plus a per-hub `defaultEnabled` cohort state.

### Constraints

- Compiled routing must stay byte-identical to legacy on all routing fields. This program never changes what routes.
- The three frozen scorer files (`router-replay.cjs`, `score-skill-benchmark.cjs`, `load-playbook-scenarios.cjs`) are pinned and never edited.
- `=0` must remain an unconditional kill-switch that overrides any per-hub cohort default.
- No runtime path may read cohort or manifest state from under `.opencode/specs` (depends on `002`'s ADR-003 promotion).

<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Advance the effective default one hub at a time by advancing `002`'s per-hub `defaultEnabled` cohort state, so `unset` resolves to compiled only for hubs that have passed their gate. Never set a fleet-wide `unset=on` posture.

**How it works**: The served authority for a hub becomes a pure function of (cohort `defaultEnabled`, flag value): `=0` forces legacy (kill-switch precedence), `=1` forces compiled, and `unset` follows that hub's cohort default. With N of 7 hubs advanced, exactly those N resolve `unset` to compiled and the other `7-N` resolve `unset` to legacy — even though all seven manifests are already compiled-serving, because the cohort default, not the manifest, is the staging control. The fleet-wide effective default is reached only when the seventh hub is advanced.

<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Per-hub cohort advance (chosen)** | Genuine staging with a real per-hub gate; stop-on-first-failure is possible; each step is byte-exact reversible; `=0` stays meaningful | Requires `002`'s tri-state flag and cohort state as a prerequisite | 9/10 |
| Fleet-wide `unset=on` flip | One change; matches the literal "make it the default" wording | Lights all 7 hubs at once (manifests already compiled-serving); no staging, no per-hub gate, no stop-on-first-failure; inverts the kill-switch | 2/10 |
| Per-hub via explicit `=1` only, no cohort default | No new state; uses the existing forced-on value | `=1` is process-wide, not per-hub; cannot express a persistent per-hub default; leaves `unset` meaning legacy forever, so the "effective default" is never actually reached | 4/10 |

**Why this one**: The 7/7 compiled-serving fact removes the manifest as a staging lever, so staging must live in a new per-hub control. Cohort state is that control, and it is the only option that keeps the cutover incremental, gated, and reversible while still reaching a true `unset=on` effective default at the end.

<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- The cutover is a sequence of small, gated, reversible increments rather than one fleet-wide event.
- Stop-on-first-failure becomes possible: a failing hub halts the run with the other hubs untouched.
- `=0` keeps its meaning as the fleet-wide kill-switch throughout and after the cutover.

**What it costs**:
- P4 cannot start until `002`'s tri-state flag and cohort state exist and are verified. Mitigation: that is a join-gate precondition, so the dependency is explicit, not a surprise.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Cohort advanced before that hub's gate is green | M | The per-hub gate (ADR-003) precedes every cohort advance; the controller advances nothing until the five checks pass |
| A per-hub default silently overrides `=0` | H | NFR-A01 + a fixture asserting `=0` wins over cohort state for every hub |

<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The 7/7 compiled-serving fact makes `unset=on` a fleet-wide flip with no staging; a per-hub control is required to gate at all |
| 2 | **Beyond Local Maxima?** | PASS | The cheap fleet-flip and the `=1`-only options are both steelmanned and scored, not dismissed |
| 3 | **Sufficient?** | PASS | Cohort state is the minimum mechanism that yields per-hub staging, stop-on-first-failure, and a true final `unset=on` |
| 4 | **Fits Goal?** | PASS | The destination (compiled as the effective default) is reached; only the path is staged |
| 5 | **Open Horizons?** | PASS | Cohort state generalizes to any future eligible hub with no new mechanism |

**Checks Summary**: 5/5 PASS

<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- P4: the controller advances `002`'s per-hub `defaultEnabled` cohort state one hub at a time in ascending blast-radius order.
- No new flag or state is authored here; the tri-state flag and cohort state are `002`'s deliverables, consumed by this phase.

**How to roll back**: `SPECKIT_COMPILED_ROUTING=0` restores legacy fleet-wide instantly; per hub, revert that hub's cohort default and restore its byte-exact prior manifest via 010's `activate --rollback`.

<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Atomic per-hub lockstep, with the two shared create-skill parent templates flipped last under a normalized-parity assertion

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted (design direction; refines the P4 lockstep set named in CF-TPL-1) |
| **Date** | 2026-07-20 |
| **Deciders** | Claude Opus 4.8, on the `015` research spine; operator retains override authority |

---

<!-- ANCHOR:adr-002-context -->
### Context

Feature-catalog and `SKILL.md` wording is phase-gated by the authoring current-reality contract: opt-in through P0-P3, default-on only when the hub has passed its checks (CF-CAT-2, `feature-catalog-template.md:30`, `advisor-recommend.ts:362-371` still `=== '1'`). If a hub's directive and catalog can disagree — one says default-on, the other still opt-in — the docs mislead about live posture.

CF-TPL-1 (2 models) found a second gap: the P4 lockstep named the seven `SKILL.md` directives but omitted BOTH create-skill parent templates (active scaffold + copy-from), which still encode literal-`1` / off-by-default wording (`013/spec.md:88-100,107,162-168`, `012/plan.md:176`). Those templates are shared across all hubs — they describe the fleet posture a new skill scaffolds against — so they cannot be flipped "for one hub only".

### Constraints

- Within a hub, the directive and catalog must never disagree on posture.
- The two parent templates are shared; their default-on wording is accurate only when the fleet is default-on.
- Normalized parity must hold across both templates, all seven directives, all seven catalogs, and the create-skill docs, proven by generated-fixture tests (CF-TPL-1).

<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: Make each hub's rewrite atomic — advance the cohort default AND rewrite that hub's `SKILL.md` directive AND that hub's feature-catalog wording in one stage — and treat the two shared create-skill parent templates as tracked members of the lockstep set that carry cohort-accurate wording throughout and reach fleet-default-on wording only when the seventh hub lands, bound by a normalized-parity test.

**How it works**: The three per-hub surfaces (cohort default, directive, catalog) flip together per hub, so no intermediate state has them disagreeing. The two shared templates are never flipped ahead of the cohort; they state the current staged posture and are reconciled to fleet-default-on at fleet completion. A normalized-parity fixture then asserts both templates, all seven directives, all seven catalogs, and the create-skill docs agree, and it is green before P4 is declared complete.

<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Atomic per-hub trio + shared templates flipped last (chosen)** | No disagreeing intermediate state per hub; shared templates never lead the cohort; parity proven at the end | Two-tier sequencing (per-hub vs fleet-terminal) to reason about | 9/10 |
| Flip all four surfaces per hub, including the shared templates | Single rule, no two-tier sequencing | Logically impossible: a shared template cannot be default-on "for one hub" without misdocumenting the others | 1/10 |
| Rewrite directives per hub, defer catalogs and templates to a batch at the end | Fewer per-hub rewrite steps | Directive and catalog disagree mid-cutover (the exact CF-CAT-2 defect); posture becomes unauditable per hub | 3/10 |

**Why this one**: The per-hub surfaces (directive, catalog, cohort) are genuinely per-hub and must move together; the parent templates are genuinely shared and can only be accurate at fleet scope. Honoring both facts yields the two-tier lockstep. This is a deliberate refinement of the task's "at the same stage" wording: the three per-hub surfaces are atomic together, while the shared templates are a tracked lockstep member flipped at fleet completion — recorded here because a shared template cannot be flipped per hub.

<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:
- Per hub, directive and catalog posture always agree; live posture is auditable at each stage.
- The create-skill templates are never forgotten (closing CF-TPL-1) and never lead the cohort.

**What it costs**:
- A final fleet-completion reconciliation step plus its normalized-parity fixture. Mitigation: it is one gate at the end, and it is the proof that the lockstep set is consistent.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Shared templates flipped to fleet-default-on before the 7th hub | M | The templates track cohort-accurate wording; the fleet-default-on reconciliation is gated on the final hub landing |
| A catalog or directive edited outside the atomic stage | M | The per-hub rewrite is the only place posture changes; drift guards (`008`) and the parity fixture catch out-of-band edits |

<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Directive/catalog disagreement (CF-CAT-2) and the omitted templates (CF-TPL-1) are real, current defects |
| 2 | **Beyond Local Maxima?** | PASS | The single-rule "flip all four per hub" option is weighed and rejected as logically impossible for shared templates |
| 3 | **Sufficient?** | PASS | Atomic per-hub trio plus a terminal shared-template reconciliation covers every default-on-wording surface |
| 4 | **Fits Goal?** | PASS | Keeps docs honest per hub while still reaching a consistent fleet-default-on end state |
| 5 | **Open Horizons?** | PASS | The normalized-parity fixture generalizes to any added directive, catalog, or template |

**Checks Summary**: 5/5 PASS

<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**:
- P4: per hub, the controller advances the cohort default and rewrites that hub's directive and catalog together; the two shared templates track cohort-accurate wording.
- Fleet completion: the templates reconcile to fleet-default-on; the normalized-parity fixture (from `009`) must be green.

**How to roll back**: Per hub, revert that hub's directive, catalog, and cohort default together and restore its prior manifest; at fleet scope, revert the template reconciliation. `=0` restores legacy serving independent of any wording state.

<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: Gate entry on a proven coverage-closure join gate; per-hub stop-on-first-failure with byte-exact rollback

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted (design direction; the entry and rollback contract for P4) |
| **Date** | 2026-07-20 |
| **Deciders** | Claude Opus 4.8, on the `015` research spine; operator retains override authority |

---

<!-- ANCHOR:adr-003-context -->
### Context

The pre-`015` P0→P4 plan was cyclic and its P4 gate could pass empty: it could "succeed" with zero completed catalogs, playbooks, durable evidence, or LUNA runs, and it required siblings `013`/`014` only to be "available" though both are Planned (CF-ACT-7, `012/plan.md:334-340` vs `014/spec.md:163-169`). A cutover that proves nothing is a false green. Separately, per-hub rollback needs a real mechanism: `activate-hub.cjs` has no `--rollback` today (CF-ACT-8, `verification-v1.md` CF-ACT-8 — all 7 citations confirmed exact), so `010` must ship it before P4 can revert a hub byte-exactly.

### Constraints

- No hub may be cut over until the coverage and verification children are implemented-and-verified.
- Every hub stage must name a proven rollback before it runs.
- The controller must stop at the first failed gate and rewrite nothing further.

<!-- /ANCHOR:adr-003-context -->

---

<!-- ANCHOR:adr-003-decision -->
### Decision

**We chose**: Block P4 entry behind a P3 COVERAGE-CLOSURE JOIN GATE whose every input is proven, and run the hubs under a per-hub, ordered, stop-on-first-failure gate with a named byte-exact rollback per hub.

**How it works**: The join gate requires, all green: validated 7 catalogs + advisor entry (CF-CAT-*), the 7-hub playbook matrix (CF-PB-*), Lane C compiled-parity pairs (CF-ARC-4), LUNA-HIGH gold-bearing-holdout evidence (CF-BM-7), the create-skill ready fixture (CF-SC-5), the `verify_alignment_drift` markdown gate live (CF-SC-1), the single manifest-freshness eligibility predicate (ADR-002 of `012`, HUB_CHILD-corrected), the non-hub ineligibility policy (CF-ACT-9), and siblings `013`/`014` **implemented-and-verified** — the phrase replaces "available". Per hub, in order and stop-on-first-failure: route-gold parity (compiled == legacy) → `compiled-serving` status → clean fallback → unchanged frozen-scorer SHA-256 → `=0` kill-switch drill → THEN the atomic rewrite (ADR-002) and cohort advance (ADR-001). Rollback per hub is `SPECKIT_COMPILED_ROUTING=0` (fleet-wide legacy, instant) and/or 010's `activate --rollback` (that hub's byte-exact prior manifest).

<!-- /ANCHOR:adr-003-decision -->

---

<!-- ANCHOR:adr-003-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Proven join gate + per-hub stop-on-first-failure (chosen)** | P4 cannot pass empty; a failing hub halts with the rest untouched; every step has a proven rollback | Requires all earlier children and `013`/`014` verified before P4 starts | 9/10 |
| Enumerated gate but "available" siblings (the old plan) | Fewer prerequisites | The exact empty-passable defect CF-ACT-7 names; proves nothing | 2/10 |
| Cut over all hubs, then verify at the end | Fewer intermediate gates | A late failure has already flipped several hubs; no clean per-hub revert point | 3/10 |

**Why this one**: The value of P4 is entirely in what it proves. An enumerated, all-green join gate with `013`/`014` implemented-and-verified makes the green real, and per-hub stop-on-first-failure keeps a failure small and reversible.

<!-- /ANCHOR:adr-003-alternatives -->

---

<!-- ANCHOR:adr-003-consequences -->
### Consequences

**What improves**:
- P4 green means the coverage, verification, and per-hub safety are all actually proven, not merely planned.
- A failing hub halts the run at that hub; earlier hubs stay landed, later hubs stay untouched.

**What it costs**:
- P4 cannot begin until all of `002`-`010` and `013`/`014` are verified. Mitigation: this is the correct dependency; the join gate makes it explicit rather than discovered late.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A join-gate input regresses after it was proven | M | Re-assert the gate immediately before hub 1; consume the live status probe rather than a cached claim |
| `activate --rollback` absent or unproven | H | `010` owns it; the join gate requires `010` implemented-and-verified before P4 runs |

<!-- /ANCHOR:adr-003-consequences -->

---

<!-- ANCHOR:adr-003-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The old P4 gate was empty-passable and depended on Planned siblings (CF-ACT-7); rollback had no `--rollback` (CF-ACT-8) |
| 2 | **Beyond Local Maxima?** | PASS | The "available siblings" and "verify at the end" options are weighed and scored |
| 3 | **Sufficient?** | PASS | An all-green join gate plus per-hub stop-on-first-failure plus a named rollback is the minimum that makes P4's green real and its failure small |
| 4 | **Fits Goal?** | PASS | The effective default is reached only through proven coverage and per-hub safety, which is the whole point of the program |
| 5 | **Open Horizons?** | PASS | The join-gate schema extends to any future coverage or verification input |

**Checks Summary**: 5/5 PASS

<!-- /ANCHOR:adr-003-five-checks -->

---

<!-- ANCHOR:adr-003-impl -->
### Implementation

**What changes**:
- P4 entry: the controller evaluates the enumerated join gate and refuses to start hub 1 while any input is unproven.
- Per hub: the five ordered checks run stop-on-first-failure before any rewrite; each hub's prior manifest is retained for `activate --rollback`.

**How to roll back**: `SPECKIT_COMPILED_ROUTING=0` restores legacy fleet-wide; `activate --rollback` restores a hub's byte-exact prior manifest; the run stops at the first failed gate with the failing hub, check, and evidence recorded.

<!-- /ANCHOR:adr-003-impl -->
<!-- /ANCHOR:adr-003 -->

---

<!--
Level 3 Decision Record: One ADR per major decision.
Written in human voice: active, direct, specific.
HVR rules: .opencode/skills/sk-doc/references/hvr-rules.md
-->
