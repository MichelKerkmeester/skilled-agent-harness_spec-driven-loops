---
title: "Decision Record: Compiled Routing Default-On"
description: "Three decisions governing whether and how SPECKIT_COMPILED_ROUTING becomes the repo's effective default: defer global default-on to a staged P4 outcome, single-source compiled eligibility to a valid fresh manifest, and remediate the runtime-to-spec-tree resolver coupling."
trigger_phrases:
  - "compiled routing default-on decision record"
  - "compiled eligibility single source"
  - "resolver spec-tree coupling remediation"
importance_tier: "critical"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-sk-doc-router-alignment/020-router-unification-program/007-unified-refactor-implementation/012-default-on-decision"
    last_updated_at: "2026-07-20T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Settled ADR-001 on the analysis to adopt the phased path"
    next_safe_action: "Begin P0 on operator go-ahead"
    blockers: []
    key_files:
      - "spec.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "pending"
      parent_session_id: null
    completion_pct: 60
    open_questions: []
    answered_questions:
      - "Flip the default now or adopt the phased path? Adopt the phased path (ADR-001), settled on the analysis; operator may override."
      - "Promote the resolver out of the spec tree, or guard it in place? Promote (ADR-003)."
---
# Decision Record: Compiled Routing Default-On

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Defer global default-on to a staged P4 outcome

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted: adopt the phased path (settled on the fresh-Opus analysis and source verification per the session directive; reversible; operator may override to flip-now) |
| **Date** | 2026-07-20 |
| **Deciders** | Claude Opus 4.8 (settled on the analysis, per the session directive to settle the decision), independent fresh-Opus review (the dissent this ruling adopts); operator retains override authority |

---

<!-- ANCHOR:adr-001-context -->
### Context

The parent goal asks to make compiled routing the effective default, framing it as flipping `SPECKIT_COMPILED_ROUTING` from off to on. Reading the live integration point shows that framing buys nothing and costs real surface. The advisor enters compiled routing only through `enrichCompiledRoutes()` at `advisor-recommend.ts:357`. With the flag unset that function returns its input untouched (`:362`). With the flag set it maps over recommendations the legacy path already computed and attaches `compiledRoute` as an additive sibling field, `{ ...recommendation, compiledRoute }` at `:371`, and never recomputes the chosen `skillId` or `workflowMode`. Turning the flag on can only make that extra field appear or, on drift, silently not appear. It cannot change which skill is recommended.

The sibling `011-runtime-engine` already flipped all seven hubs' manifests to `servingAuthority: compiled`, held inert behind the default-off flag. So the destination machinery exists. What does not exist is the reason to flip: today the flip is behavior-neutral by construction.

### Constraints

- Compiled routing must stay byte-identical to legacy for matched hubs. This program never changes what routes.
- The three frozen benchmark scorer files (`router-replay.cjs`, `score-skill-benchmark.cjs`, `load-playbook-scenarios.cjs`) are pinned and never edited.
- `SPECKIT_COMPILED_ROUTING` is absent from `ENV-REFERENCE.md`, which CLAUDE.md section 6 mandates as the source of truth for flag defaults. Flipping an undocumented flag violates that mandate.
- The serve-time shim recomputes each hub's decision from live config and falls back to a `{ servingAuthority: "legacy" }` sentinel on any mismatch (`compiled-route.cjs:36-39`), which the advisor maps to `undefined` (`advisor-recommend.ts:351`). Editing a hub reverts it to legacy until re-minted, with nothing to observe the reversion.

<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Treat global default-on as the final outcome of a four-step program (P0 through P4), not a one-line default change made now.

**How it works**: P0 documents the flag in `ENV-REFERENCE.md` and makes the verify harness distinguish drift-to-legacy from breakage plus a per-hub serving-status readout. P1 adds a drift-detection CI that recomputes each hub's live hash against its minted manifest and fails re-mint-required. P2 canaries default-on in one env profile while the repo default stays off. P3 replaces the two hardcoded allowlists with a data-driven eligibility rule (see ADR-002). P4 flips the repo default hub-by-hub, keeping `=0` as the documented kill-switch. The flip becomes worthwhile precisely when compiled routing does something legacy cannot (a consumed decision, a caught drift), which P0 through P3 create.

**Settlement**: This ruling is settled on the merits of the analysis above (the five premise-failures and the resolver coupling), as the session directive to settle the decision using the fresh-Opus analysis requires. It is a reversible documentation decision: no runtime change follows from it, and the operator may override to flip-now at any time. Acceptance settles the sequencing (phased) only; a separate operator go-ahead gates the start of P0 implementation.

<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Phased P0 to P4 (chosen)** | Reversible at every step; drift caught by CI not production; flag documented before it is load-bearing; the flip lands when it carries benefit | Four phases of enabling work before the headline default flips | 9/10 |
| Flip the repo default now | One-line change; matches the literal goal wording | Zero routing benefit (additive metadata only); normalizes silent drift; inverts the kill-switch (absence becomes compiled); violates the ENV-REFERENCE governance mandate | 3/10 |
| Abandon compiled routing | Removes the drift surface entirely | Discards a built, proven, reversible system and the parity work behind it; loses the future benefit the phased path unlocks | 2/10 |

**Why this one**: The destination (compiled as the effective default) is not rejected, it is sequenced. Flipping today trades governance and observability surface for a benefit that is currently zero, so the correct move is to build the benefit and the safety net first, then flip. The steelman for flipping now is honest and recorded: if compiled cannot help and cannot hurt routing, the only net effects are the ones that can hurt, so flip it once compiled does something legacy cannot. That condition is exactly what P0 through P3 establish.

<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- The eventual flip is observable: a per-hub readout shows compiled-serving vs legacy-fallback vs drifted, so a red signal means breakage rather than routine churn.
- Drift is caught in CI at edit time, not discovered in production after a hub silently reverts to legacy.
- The kill-switch stays meaningful: `=0` remains the documented control, and variable-absence keeps its safe legacy meaning until the P4 flip deliberately changes it.

**What it costs**:
- Four phases of enabling work precede the headline default change. Mitigation: each phase ships standalone value (docs, CI, canary, single-sourced eligibility) rather than being pure overhead.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Operator overrides to flip now | M | The fallback is genuinely fail-safe today, so an early flip is survivable; but P0 documentation and observability should still land first to satisfy governance and avoid a two-meaning red signal |
| Phased path stalls mid-program | L | Each phase is independently valuable and reversible; stalling leaves the repo in a strictly better documented and observable state than today |

<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The governance gap (undocumented flag) and the silent-drift surface are real today, independent of any future flip |
| 2 | **Beyond Local Maxima?** | PASS | The flip-now option is steelmanned and scored, not dismissed; abandonment is also weighed |
| 3 | **Sufficient?** | PASS | The phased path is the simplest sequence that makes the flip safe; no step is ornamental |
| 4 | **Fits Goal?** | PASS | The destination is unchanged; only the sequencing is corrected, so the goal is served, not deflected |
| 5 | **Open Horizons?** | PASS | Data-driven eligibility (ADR-002) scales to every future skill, so the path does not paint the fleet into a hardcoded corner |

**Checks Summary**: 5/5 PASS

<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- P0: `ENV-REFERENCE.md` gains the flag entry; the verify harness gains drift-vs-breakage classification and a per-hub serving-status readout.
- P1: a drift-detection CI job plus the enforced rule that editing a hub's routing inputs re-mints its manifest in the same change.
- P2 to P4: a canary env profile, the data-driven eligibility rule (ADR-002), then the staged hub-by-hub default flip.

**How to roll back**: Nothing in this phase changes runtime behavior, so there is nothing to roll back here. Across the program, `SPECKIT_COMPILED_ROUTING=0` restores legacy serving fleet-wide, and each per-hub flip retains a byte-identical prior manifest for a byte-exact per-hub revert.

<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Single-source compiled eligibility to a valid fresh manifest

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted (design direction; implemented in P3) |
| **Date** | 2026-07-20 |
| **Deciders** | Operator, Claude Opus 4.8 |

---

<!-- ANCHOR:adr-002-context -->
### Context

Which hubs are compiled-eligible is hardcoded in two places: `COMPILED_ROUTING_HUBS` in `advisor-recommend.ts:41` and `HUB_CHILD` in `compiled-route.cjs:23`. Two hand-maintained lists drift apart. A newly created skill is compiled-invisible with no defined way to opt in, and `create-skill` today has zero compiled-routing awareness (a repo grep for compiled-routing tokens under the create-skill mode returns nothing).

### Constraints

- Backward-compat is required: a skill lacking the compiled JSONs or snapshot must route via legacy with no behavior change.
- Onboarding must be explicit and self-serve, not a code edit in two files.

<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: Define compiled eligibility as a single derived predicate: a hub is compiled-eligible if and only if a valid, fresh manifest exists for it (its minted digest matches its live config hash). Both `COMPILED_ROUTING_HUBS` and `HUB_CHILD` derive from that one rule.

**How it works**: Onboarding a skill means minting its manifest; backward-compat means the absence of a manifest yields legacy by construction. `create-skill` (phase 013) mints or scaffolds the manifest step so new hubs are born either compiled-ready or explicitly legacy, never silently half-wired.

<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Data-driven single source (chosen)** | No divergence possible; self-serve onboarding; backward-compat is free by construction | Requires a manifest-freshness read where eligibility is decided | 9/10 |
| One hardcoded list imported by both | Removes duplication cheaply | Still manual; a new skill still needs a code edit to onboard | 6/10 |
| Keep two lists, reconcile by hand | No new code | The exact divergence risk this ADR exists to remove | 3/10 |

**Why this one**: Eligibility should be a property of the artifacts (does a fresh manifest exist), not a fact duplicated in code. That makes onboarding and backward-compat the same mechanism viewed from two sides.

<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:
- The two allowlists cannot diverge because neither is authored by hand.
- A new or edited skill has one clear compiled state derived from whether its manifest is fresh.

**What it costs**:
- Eligibility now reads manifest freshness on the decision path. Mitigation: the freshness check is a hash comparison already computed by the serve-time shim, so it is reused, not added.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Freshness read on the hot path adds latency | L | Reuse the shim's existing hash recompute; cache per process |
| Migration removes the hardcoded sets prematurely | M | Keep the sets as a pinned fallback until P3 parity is proven, then delete in one change |

<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Two hardcoded allowlists exist now and will diverge; new skills have no onboarding path |
| 2 | **Beyond Local Maxima?** | PASS | The cheaper import-one-list option is weighed and rejected for still being manual |
| 3 | **Sufficient?** | PASS | One derived predicate covers eligibility, onboarding, and backward-compat together |
| 4 | **Fits Goal?** | PASS | Directly enables a safe global default-on by making eligibility a maintained property, not a code constant |
| 5 | **Open Horizons?** | PASS | Scales to any number of future skills with no code edit per skill |

**Checks Summary**: 5/5 PASS

<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**:
- P3: a single eligibility predicate keyed on manifest freshness; `COMPILED_ROUTING_HUBS` and `HUB_CHILD` become derived, then removed as hand-authored constants.
- Phase 013: `create-skill` scaffolds the manifest step so onboarding mints eligibility.

**How to roll back**: Retain the hardcoded sets as a pinned fallback through P3; if the derived predicate misbehaves, restore the constants (a one-file revert in each of the two locations).

<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: Remediate the runtime-to-spec-tree resolver coupling

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted (P0 remediation; promote the resolver) |
| **Date** | 2026-07-20 |
| **Deciders** | Operator, Claude Opus 4.8 |

---

<!-- ANCHOR:adr-003-context -->
### Context

The runtime front door `.opencode/bin/compiled-route.cjs` resolves its resolver from a path inside the spec tree: `compiled-route.cjs:16-21` points at `007-unified-refactor-implementation/011-runtime-engine/lib/resolve.cjs`. This repo renumbers and re-nests spec folders constantly (the memory index records repeated hyphen migrations, renumbers, and re-nests). A single such move silently breaks every compiled route to the legacy sentinel, with no observable signal. The repo's own reorganization is a latent drift engine independent of hub-config edits.

### Constraints

- The shim must keep failing safe to legacy on any resolver error (that property is correct and stays).
- Any promotion must not duplicate the resolver logic; it stays single-sourced.

<!-- /ANCHOR:adr-003-context -->

---

<!-- ANCHOR:adr-003-decision -->
### Decision

**We chose**: Promote the resolver to a stable runtime location beside the shim (recommended), rather than leave it in the spec tree behind a path guard.

**How it works**: `resolve.cjs` moves to a durable runtime path (for example `.opencode/bin/lib/`), and the shim requires it from there. The spec-tree copy becomes the authored source that is built or copied into the runtime location, so a spec renumber no longer moves the file the runtime depends on.

<!-- /ANCHOR:adr-003-decision -->

---

<!-- ANCHOR:adr-003-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Promote resolver to a runtime path (chosen)** | Removes the drift source rather than guarding it; runtime no longer depends on spec-tree layout | A small build or copy step to keep the runtime copy current | 8/10 |
| Path-integrity guard in place | Cheapest; fails loudly on a broken path | Keeps the coupling; converts silent breakage to loud breakage but still breaks on every renumber | 6/10 |
| Leave as-is and document | No work now | The drift source remains and stays silent; documentation does not stop a renumber | 4/10 |

**Why this one**: Guarding a fragile path detects the break; promoting the file removes the break. Removing a latent failure mode beats instrumenting it.

<!-- /ANCHOR:adr-003-alternatives -->

---

<!-- ANCHOR:adr-003-consequences -->
### Consequences

**What improves**:
- A spec renumber or re-nest can no longer sever compiled routing.
- The runtime dependency graph stops reaching into the spec tree.

**What it costs**:
- A build or copy step keeps the runtime resolver current. Mitigation: wire it into the same mint/backfill flow that maintains manifests.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Runtime copy goes stale vs authored source | M | Add a freshness check to the drift-CI (P1) so a stale runtime resolver fails the same gate as a stale manifest |

<!-- /ANCHOR:adr-003-consequences -->

---

<!-- ANCHOR:adr-003-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The coupling exists at `compiled-route.cjs:16-21` and the repo renumbers spec folders routinely |
| 2 | **Beyond Local Maxima?** | PASS | The cheaper guard-in-place option is weighed and scored |
| 3 | **Sufficient?** | PASS | Promotion removes the failure mode; no further mechanism is needed |
| 4 | **Fits Goal?** | PASS | A default-on fleet cannot rest on a resolver that a spec move can sever |
| 5 | **Open Horizons?** | PASS | A stable runtime path is the correct long-term home regardless of spec-tree churn |

**Checks Summary**: 5/5 PASS

<!-- /ANCHOR:adr-003-five-checks -->

---

<!-- ANCHOR:adr-003-impl -->
### Implementation

**What changes**:
- P0: move `resolve.cjs` to a runtime path; update the shim's require; keep the authored source building or copying into place.
- P1: the drift-CI also checks the runtime resolver is current with its authored source.

**How to roll back**: Restore the shim's original require path to the spec-tree resolver; the file still exists there, and the shim already fails safe, so the revert is a one-line change with no behavior risk.

<!-- /ANCHOR:adr-003-impl -->
<!-- /ANCHOR:adr-003 -->

---

<!--
Level 3 Decision Record: One ADR per major decision.
Written in human voice: active, direct, specific. No em dashes, no hedging.
HVR rules: .opencode/skills/sk-doc/references/hvr-rules.md
-->
