---
title: "Decision Record: Runtime Promotion & Status Foundation"
description: "Five decisions governing the compiled-routing P0 foundation: bind the parent ADR-003 and promote the full runtime closure out of the spec tree, split manifest-derived eligibility from the HUB_CHILD engine-dispatch table, ship a stable per-hub status JSON contract, tri-state the flag with an empty default-on cohort, and add a durable no-spec-import rule."
trigger_phrases:
  - "runtime promotion status foundation decisions"
  - "compiled routing closure promotion decision record"
  - "eligibility engine-dispatch split decision"
importance_tier: "critical"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/020-router-unification-program/007-unified-refactor-implementation/015-routing-coverage-activation-verification/002-runtime-promotion-and-status-foundation"
    last_updated_at: "2026-07-20T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Recorded the five local ADRs for the P0 foundation"
    next_safe_action: "Begin Phase 1 inventory on operator go-ahead"
    blockers: []
    key_files:
      - "spec.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "pending"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Which stable runtime directory hosts the promoted closure?"
    answered_questions:
      - "Promote the whole closure or only the resolver? Promote the whole closure (ADR-001)."
      - "Is HUB_CHILD a removable duplicate? No, it is the engine-dispatch map; split eligibility instead (ADR-002)."
---
# Decision Record: Runtime Promotion & Status Foundation

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

> These ADRs are local to the 002 foundation packet. They operationalize two parent decisions in `../../012-default-on-decision/decision-record.md`: ADR-001 below binds that packet's ADR-003 (promote the resolver), and ADR-002 below corrects that packet's ADR-002 premise (that `HUB_CHILD` is a removable duplicate). Parent ADRs are cited by path; local ADR numbers restart at 001.

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Bind ADR-003 and promote the full runtime closure

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted (design direction; implemented in this packet's Phase 2) |
| **Date** | 2026-07-20 |
| **Deciders** | Claude Opus 4.8, on the reconciled research (synthesis + verification + review); operator retains override authority |

---

<!-- ANCHOR:adr-001-context -->
### Context

The parent packet Accepted "promote the resolver to a stable runtime location" (`../../012-default-on-decision/decision-record.md:264,287`). But a stale escape hatch survives in the same packet's `implementation-summary.md:170`, which still frames the choice as "promote the resolver to a stable runtime location or approve a guarded residual coupling." Two live documents disagree, and the adversarial pass confirmed the ADR is authoritative and the residual-coupling language is stale (`../001-research/verification-v1.md`, claim 8, CONFIRMED).

Research also proved the coupling is wider than one file. The runtime front door `.opencode/bin/compiled-route.cjs` requires into the spec tree (`:16-21`); the resolver points `ACTIVATION_ROOT` at `010-live-activation/activation` (`resolve.cjs:19`); and the engine loads hub modules from `006-*` (`011-runtime-engine/lib/compiled-route.cjs:35-62`). Promoting only `resolve.cjs` would leave the activation manifests and per-hub bundles inside the mutable spec tree, so a spec renumber would still sever routing. The promotion has to move the whole closure.

### Constraints

- The shim must keep failing safe to the legacy sentinel on any resolver error. That property is correct and stays.
- Promotion must not duplicate resolver or engine logic. The runtime copy stays single-sourced from an authored source that builds or copies into place.
- No routing decision changes; compiled stays byte-identical to legacy.

<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Promote the whole closure, resolver plus engine loader plus the seven activation manifests plus the seven per-hub bundles, to a stable runtime path, and make that promotion binding.

**How it works**: The closure moves to a durable runtime location (for example `.opencode/bin/lib/`), and the shim requires it from there. The spec-tree copy becomes the authored source that a build or copy step keeps current in the runtime location, so a spec renumber no longer moves the files the runtime depends on. The residual-coupling branch is deleted, and `../../012-default-on-decision/implementation-summary.md:170` is corrected to state promotion is binding.

**Scope note**: This packet copies the manifests and bundles verbatim to preserve byte-identity and a trivial rollback. Assembling them into a consolidated serving snapshot is the job of `../007-durable-archiving-and-serving-snapshot/`, not this foundation.

<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Promote the whole closure (chosen)** | Removes the drift source for the resolver, the manifests, and the bundles together; runtime stops reading under the spec tree | A build or copy step keeps the runtime copy current | 9/10 |
| Promote only the resolver | Smaller change; matches the literal parent ADR wording | Leaves manifests and bundles in the spec tree, so a renumber still severs routing; solves one third of the coupling | 4/10 |
| Guard the spec-tree path in place | Cheapest; converts silent breakage to loud breakage | Keeps the coupling and still breaks on every renumber; this is the residual-coupling branch the parent ADR already rejected | 3/10 |

**Why this one**: The parent ADR chose promotion over guarding for the resolver. The research shows the same reasoning applies to the manifests and bundles, because they share the same failure mode. Moving the whole closure removes the failure mode once instead of instrumenting three copies of it.

<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- A spec renumber or re-nest can no longer sever compiled routing for any hub.
- The runtime dependency graph stops reaching into the spec tree entirely, which the durable rule (ADR-005) then locks in.

**What it costs**:
- A build or copy step keeps the runtime closure current. Mitigation: wire it into the same mint and backfill flow that maintains the manifests.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| The runtime copy goes stale against the authored source | M | Add a freshness check to the downstream drift CI (P1, `../010-rollback-audit-and-non-hub-policy/`) so a stale runtime copy fails the same gate as a stale manifest |
| A transitive read is missed and still points under specs | M | A spec-tree-move simulation asserts every transitive load resolves outside `.opencode/specs`; ADR-005 blocks re-introduction |

<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The coupling exists at `compiled-route.cjs:16-21`, `resolve.cjs:19`, and the `006-*` engine load; the repo renumbers spec folders routinely |
| 2 | **Beyond Local Maxima?** | PASS | Promote-resolver-only and guard-in-place are both weighed and scored |
| 3 | **Sufficient?** | PASS | Moving the whole closure removes the failure mode for every component that reads the spec tree |
| 4 | **Fits Goal?** | PASS | A default-on fleet cannot rest on a runtime that a spec move can sever |
| 5 | **Open Horizons?** | PASS | A stable runtime path is the correct long-term home regardless of future spec-tree churn |

**Checks Summary**: 5/5 PASS

<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- Phase 2: move the closure to the stable runtime path; update the shim require; keep the authored source building or copying into place; delete the residual-coupling branch and correct the parent summary line.

**How to roll back**: Restore the shim's original require path to the spec-tree resolver. The spec-tree copy still exists and the shim already fails safe, so the revert is a one-line change with no behavior risk.

<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Split manifest-derived eligibility from the engine-dispatch table

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted (design direction; implemented in this packet's Phase 2) |
| **Date** | 2026-07-20 |
| **Deciders** | Claude Opus 4.8, on the reconciled research; operator retains override authority |

---

<!-- ANCHOR:adr-002-context -->
### Context

The parent packet's ADR-002 treats `HUB_CHILD` as one of two duplicate eligibility allowlists that a single manifest-derived rule can replace. The research corrected that premise. `HUB_CHILD` (`011-runtime-engine/lib/compiled-route.cjs:23-31`) maps each hub to its `006-parent-hub-rollout/00N-*` child, and `loadHubEngine()` (`:35-62`) requires the engine modules from that path (CONFIRMED, `../001-research/verification-v1.md` claim 3). It is a runtime engine-location map, not a removable duplicate. Deleting it via manifest eligibility alone would break engine loading. Separately, `COMPILED_ROUTING_HUBS` (`advisor-recommend.ts:41-49`) and `HUB_CHILD` have no cross-check, so they can drift apart silently.

### Constraints

- Eligibility must become a property of manifest freshness so a new skill onboards by minting a manifest, not by a code edit (parent ADR-002 intent, preserved).
- Engine discovery must keep working. `HUB_CHILD` stays until every hub uses a stable engine entrypoint.
- Backward-compat is required: a hub with no fresh manifest routes via legacy by construction.

<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: Separate the two concerns. Eligibility becomes manifest-freshness-derived. Engine discovery stays a decoupled map behind one standardized per-hub engine entrypoint. A cross-check test asserts the two never diverge.

**How it works**: A hub is compiled-eligible if and only if a valid fresh manifest exists for it. Engine loading is standardized on a single stable per-hub entrypoint so `HUB_CHILD` becomes a pure engine-location map with no eligibility meaning. A Vitest asserts `sort(COMPILED_ROUTING_HUBS) === sort(keys(HUB_CHILD))` and fails naming the diverging hub. `HUB_CHILD` is removed only later, once every hub uses the stable entrypoint; this packet does not remove it.

<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Split eligibility from engine-dispatch + cross-check (chosen)** | Keeps engine loading working; makes eligibility a manifest property; guards divergence loudly | Two structures coexist until the engine entrypoint is standardized everywhere | 9/10 |
| Delete `HUB_CHILD` and derive both from the manifest (parent ADR-002 as written) | One source of truth in theory | Breaks `loadHubEngine`, which needs the child path to require the engine; the premise is factually wrong | 2/10 |
| Leave both lists hand-maintained | No new code | The exact silent-divergence risk the cross-check exists to remove | 3/10 |

**Why this one**: Eligibility and engine discovery are two different facts that happen to be keyed by hub. Conflating them is what made `HUB_CHILD` look removable. Splitting them lets eligibility become data-driven while engine loading keeps its map, and the cross-check makes any future divergence a loud test failure instead of a silent mis-gate.

<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:
- Eligibility can move to manifest freshness without breaking engine loading.
- A divergence between the advisor's hub set and the engine map becomes a named test failure.

**What it costs**:
- Two structures coexist through this packet. Mitigation: the cross-check keeps them honest until the engine entrypoint is standardized and `HUB_CHILD` can retire.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| The standardized engine entrypoint misses a hub | M | The cross-check fails naming the hub; engine-load fixtures cover all seven |
| Someone deletes `HUB_CHILD` prematurely | M | The decision states removal waits until every hub uses the stable entrypoint; not in this packet's scope |

<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | `HUB_CHILD` is a live engine map and has no cross-check with `COMPILED_ROUTING_HUBS`; both facts are confirmed in source |
| 2 | **Beyond Local Maxima?** | PASS | The delete-`HUB_CHILD` option is steelmanned as the parent ADR wrote it, then rejected on the confirmed engine-load role |
| 3 | **Sufficient?** | PASS | The split plus the cross-check covers eligibility, engine discovery, and divergence together |
| 4 | **Fits Goal?** | PASS | A safe default-on needs a correct, single eligibility source and a working engine map, not a conflation of both |
| 5 | **Open Horizons?** | PASS | Manifest-derived eligibility scales to any future skill; the engine entrypoint standardizes for later `HUB_CHILD` retirement |

**Checks Summary**: 5/5 PASS

<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**:
- Phase 2: standardize the stable per-hub engine entrypoint; derive eligibility from manifest freshness; add the `sort(COMPILED_ROUTING_HUBS)===sort(keys(HUB_CHILD))` cross-check test.

**How to roll back**: The cross-check test is additive and can be disabled without behavior risk. The engine-entrypoint standardization reverts to the prior per-hub require; `HUB_CHILD` is untouched throughout, so there is no eligibility regression.

<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: Ship a stable per-hub status JSON contract

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted (design direction; implemented in this packet's Phase 2) |
| **Date** | 2026-07-20 |
| **Deciders** | Claude Opus 4.8, on the reconciled research; operator retains override authority |

---

<!-- ANCHOR:adr-003-context -->
### Context

Nothing reads the seven activation manifests today. `advisor-status.ts` (both the `tools/` and `handlers/` copies), `session-bootstrap.ts`, and `mk-skill-advisor.js:826-861` all lack any serving-authority field (CONFIRMED, `../001-research/verification-v1.md` claim 5). The legacy sentinel collapses four distinct causes into one signal at `resolve.cjs:40`, so a drifted hub and a broken hub read identically. Every downstream child (benchmark, playbooks, archiving, cutover) needs to tell those states apart, so the status interface has to be built once at the foundation and shared.

### Constraints

- The readout must be prompt-safe, size-capped, and free of any blocking spawn on prompt-time surfaces.
- The contract must be stable, because downstream children derive their gating from it.
- The readout is diagnostic only and lives outside the hot routing decision path.

<!-- /ANCHOR:adr-003-context -->

---

<!-- ANCHOR:adr-003-decision -->
### Decision

**We chose**: Ship `.opencode/bin/compiled-route-status.cjs --hub <id> | --all` emitting one stable JSON object per hub, and wire it into `advisor_status` and `session_bootstrap`.

**How it works**: The contract is `{hubId, servingAuthority, shadowOnly, selectedPolicy.generation, effectivePolicyHash, fenceEpoch, manifestFingerprint, causeCode}`. The `causeCode` separates the four collapsed causes: flag-off, missing-manifest, legacy-authority, and engine-throw. The first three are expected degradation (drift); engine-throw is breakage. `spec_kit_skill_advisor_status` (both copies) and `session_bootstrap` read this contract and surface it, size-capped, with no blocking spawn.

<!-- /ANCHOR:adr-003-decision -->

---

<!-- ANCHOR:adr-003-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Stable CLI + JSON contract with causeCode (chosen)** | One shared, testable interface; separates drift from breakage; downstream children gate on it | A new CLI plus two wiring points to maintain | 9/10 |
| Add ad hoc status fields per consumer | No new CLI | Every consumer re-derives serving state; no shared contract; drift-vs-broken stays ambiguous | 3/10 |
| Infer status from the legacy sentinel | No new code | The sentinel is exactly what collapses the four causes; inference cannot recover them | 2/10 |

**Why this one**: The observability void is a shared problem, so it needs a shared answer. A single contract with a cause code is the smallest interface that lets each downstream child gate on serving state without re-implementing manifest reading.

<!-- /ANCHOR:adr-003-alternatives -->

---

<!-- ANCHOR:adr-003-consequences -->
### Consequences

**What improves**:
- A red signal finally means breakage, not routine churn, because `causeCode` names the cause.
- Benchmark, playbooks, archiving, and cutover all consume one status source instead of inventing their own.

**What it costs**:
- A new CLI and two wiring points. Mitigation: the CLI is a thin reader over the promoted manifests, and the wiring is read-only.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| The readout leaks secrets or bloats the prompt | M | Fixed field set, size-capped, no raw prompt or secret persisted; schema review in the checklist |
| The contract changes and breaks downstream gates | M | The field set and `causeCode` enum are frozen as the stable interface; changes go through this packet |

<!-- /ANCHOR:adr-003-consequences -->

---

<!-- ANCHOR:adr-003-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | No surface reads serving authority today; drifted and broken are indistinguishable |
| 2 | **Beyond Local Maxima?** | PASS | Per-consumer fields and sentinel inference are both weighed and rejected |
| 3 | **Sufficient?** | PASS | The contract plus `causeCode` covers every state the downstream children gate on |
| 4 | **Fits Goal?** | PASS | A staged cutover cannot proceed without telling a drifted hub from a broken one |
| 5 | **Open Horizons?** | PASS | A stable JSON contract extends to any future consumer without re-derivation |

**Checks Summary**: 5/5 PASS

<!-- /ANCHOR:adr-003-five-checks -->

---

<!-- ANCHOR:adr-003-impl -->
### Implementation

**What changes**:
- Phase 2: ship the `compiled-route-status.cjs --hub | --all` CLI; wire the readout into `spec_kit_skill_advisor_status` (both copies) and `session_bootstrap`.

**How to roll back**: The CLI and the read-only wiring are additive. Removing the wiring restores the prior status output with no behavior change, and the CLI can be left in place unused.

<!-- /ANCHOR:adr-003-impl -->
<!-- /ANCHOR:adr-003 -->

---

<!-- ANCHOR:adr-004 -->
## ADR-004: Tri-state the flag with an empty default-on cohort

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted (design direction; implemented in this packet's Phase 2) |
| **Date** | 2026-07-20 |
| **Deciders** | Claude Opus 4.8, on the reconciled research; operator retains override authority |

---

<!-- ANCHOR:adr-004-context -->
### Context

The flag is bi-state. `resolve.cjs:22-23` and `advisor-recommend.ts:362` both test `=== '1'`, so unset and `'0'` are identical (CONFIRMED, `../001-research/synthesis-v1.md` CF-ACT-6). The eventual default-on plus an explicit kill-switch needs three states, and it needs them in both read sites at once, or the two sites disagree. But this packet must not change behavior, so tri-stating the flag cannot light any hub today.

### Constraints

- Unset must stay byte-identical to today's behavior. No hub is served compiled by this packet.
- Both read sites change together, or they diverge.
- Invalid values must be defined, and must fail closed to legacy.

<!-- /ANCHOR:adr-004-context -->

---

<!-- ANCHOR:adr-004-decision -->
### Decision

**We chose**: Convert both read sites to tri-state in one change, and ship the per-hub default-on cohort empty.

**How it works**: The reader resolves `'1'` to force-on, `'0'|'false'|'off'` to force-legacy (the kill-switch), unset to the per-hub default-on cohort, and any invalid value to fail-closed legacy with a diagnostic breadcrumb. Because the per-hub cohort ships empty, unset resolves to legacy for every hub, which is exactly today's behavior. Advancing hubs into the cohort is the P4 packet's job (`../011-activation-cutover-p4/`), not this one. A truth-table test covers unset, `0`, `1`, and invalid.

<!-- /ANCHOR:adr-004-decision -->

---

<!-- ANCHOR:adr-004-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Tri-state now, empty cohort (chosen)** | The default-on and kill-switch semantics exist before P4 needs them; unset stays byte-identical; one change touches both sites | A cohort concept exists before any hub uses it | 9/10 |
| Keep bi-state until P4 | No change now | P4 must then change flag semantics and light hubs in the same step, mixing a behavior-neutral change with a behavior change | 4/10 |
| Make unset mean on immediately | Matches the eventual end state | Lights all seven hubs at once (all manifests are already `servingAuthority: compiled`), a fleet-wide behavior change this packet forbids | 1/10 |

**Why this one**: Separating the mechanism (tri-state parsing) from the policy (which hubs are in the cohort) lets the foundation ship the mechanism safely with an empty policy. P4 then only changes policy, one hub at a time, against a flag reader that already understands three states.

<!-- /ANCHOR:adr-004-alternatives -->

---

<!-- ANCHOR:adr-004-consequences -->
### Consequences

**What improves**:
- The default-on and kill-switch semantics are in place and tested before P4 relies on them.
- P4 becomes a pure policy change (cohort membership), not a flag-semantics change.

**What it costs**:
- A cohort concept exists with no members yet. Mitigation: the empty cohort is the safe default and is asserted by the truth-table test.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| The two read sites are changed inconsistently | H | Both are changed in one task with a shared truth-table test; parity replay confirms no routing change |
| The cohort ships with an accidental member | H | A checklist item asserts the cohort is empty; the byte-identical legacy replay would fail if a hub were lit |

<!-- /ANCHOR:adr-004-consequences -->

---

<!-- ANCHOR:adr-004-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The flag is confirmed bi-state at both read sites; default-on plus kill-switch needs three states |
| 2 | **Beyond Local Maxima?** | PASS | Keep-bi-state and unset-means-on-now are both weighed and scored |
| 3 | **Sufficient?** | PASS | Tri-state parsing plus an empty cohort covers the mechanism without any behavior change |
| 4 | **Fits Goal?** | PASS | The kill-switch the program is named for cannot exist without tri-state |
| 5 | **Open Horizons?** | PASS | The cohort model lets P4 stage hubs one at a time against a stable flag reader |

**Checks Summary**: 5/5 PASS

<!-- /ANCHOR:adr-004-five-checks -->

---

<!-- ANCHOR:adr-004-impl -->
### Implementation

**What changes**:
- Phase 2: tri-state both `resolve.cjs` and `advisor-recommend.ts`; ship the per-hub default-on cohort empty; add the unset/`0`/`1`/invalid truth-table test.

**How to roll back**: Restore the `=== '1'` test in both sites. The change is behavior-neutral because the cohort is empty, so the revert is a two-file edit with no routing risk.

<!-- /ANCHOR:adr-004-impl -->
<!-- /ANCHOR:adr-004 -->

---

<!-- ANCHOR:adr-005 -->
## ADR-005: Add a durable no-spec-import rule

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted (design direction; implemented in this packet's Phase 2) |
| **Date** | 2026-07-20 |
| **Deciders** | Claude Opus 4.8, on the reconciled research; operator retains override authority |

---

<!-- ANCHOR:adr-005-context -->
### Context

The verification pass named an omission (F-16-4): ADR-001's promotion moves the current spec-tree reads, but nothing stops a future runtime file from re-introducing a `require` or import under `.opencode/specs`. `verify_alignment_drift.py` has no such check (`../001-research/verification-v1.md` section 4). Fixing the current instance without a durable guard invites the same drift engine to return in a later change.

### Constraints

- The rule must be durable and recurring, wired into CI, not a one-time cleanup.
- It must run over runtime directories and ignore the authored spec-tree source itself.
- False positives must be avoidable, so the scope is the runtime code paths, not the whole repo.

<!-- /ANCHOR:adr-005-context -->

---

<!-- ANCHOR:adr-005-decision -->
### Decision

**We chose**: Add a durable lint/CI rule that fails any future `require` or import from `.opencode/specs/**` in runtime code, with positive and negative fixtures.

**How it works**: A non-frozen check scans the runtime directories for import or require targets that resolve under `.opencode/specs`, and exits non-zero naming the offending file. A positive fixture (a seeded spec-import) must fail; a negative fixture (clean runtime) must pass. The check runs in CI so the coupling ADR-001 removes cannot silently return.

<!-- /ANCHOR:adr-005-decision -->

---

<!-- ANCHOR:adr-005-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Durable CI rule + fixtures (chosen)** | Prevents recurrence, not just the current instance; loud and testable | A small scanner plus CI wiring to maintain | 9/10 |
| Fix the current imports only | Least work now | The next runtime change can re-introduce the coupling with no signal; exactly the omission the verifier named | 2/10 |
| Document the rule in prose | No code | Documentation does not fail a build; the coupling can return silently | 3/10 |

**Why this one**: Promotion removes today's coupling, but the value of promotion decays if a future edit can undo it invisibly. A CI rule makes the invariant enforceable rather than remembered.

<!-- /ANCHOR:adr-005-alternatives -->

---

<!-- ANCHOR:adr-005-consequences -->
### Consequences

**What improves**:
- The promotion is protected: a future spec-import fails CI with the offending file named.
- The "no runtime read under `.opencode/specs`" invariant becomes enforceable across the whole program.

**What it costs**:
- A scanner and CI wiring to maintain. Mitigation: the scan is a deterministic path check with two fixtures.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| The scanner false-positives on the authored spec-tree source | M | Scope the scan to runtime directories; exclude the authored source that is built or copied into the runtime location |

<!-- /ANCHOR:adr-005-consequences -->

---

<!-- ANCHOR:adr-005-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The verifier named the recurrence gap (F-16-4); no current check prevents a future spec-import |
| 2 | **Beyond Local Maxima?** | PASS | Fix-only and document-only options are weighed and rejected as non-durable |
| 3 | **Sufficient?** | PASS | A CI rule with fixtures makes the invariant enforceable, which is what durability requires |
| 4 | **Fits Goal?** | PASS | A default-on fleet must not silently re-couple its runtime to the mutable spec tree |
| 5 | **Open Horizons?** | PASS | The rule guards every future runtime change, not just this promotion |

**Checks Summary**: 5/5 PASS

<!-- /ANCHOR:adr-005-five-checks -->

---

<!-- ANCHOR:adr-005-impl -->
### Implementation

**What changes**:
- Phase 2: add the no-spec-import scanner with positive and negative fixtures; wire it into CI.

**How to roll back**: The rule is additive. Disabling the CI job removes the gate without touching runtime behavior; the promoted paths remain correct on their own.

<!-- /ANCHOR:adr-005-impl -->
<!-- /ANCHOR:adr-005 -->

---

<!--
Level 3 Decision Record: One ADR per major decision.
Written in human voice: active, direct, specific. No em dashes, no hedging.
HVR rules: .opencode/skills/sk-doc/references/hvr-rules.md
-->
