---
title: "Feature Specification: Runtime Promotion & Status Foundation (P0)"
description: "The P0 foundation the whole 015 activation tree depends on. Promote the compiled-routing runtime CLOSURE (resolver + engine loader + the seven activation manifests + the seven per-hub compiled bundles) out of the mutable spec tree to a stable runtime path so no runtime path ever reads under .opencode/specs, make that promotion binding per the parent decision-record's ADR-003, and correct the stale residual-coupling escape hatch at 012-default-on-decision/implementation-summary.md:170. Split manifest-derived ELIGIBILITY from the HUB_CHILD engine-dispatch table (HUB_CHILD stays an engine-location map, it was never a removable duplicate) and add a cross-check test that fails when sort(COMPILED_ROUTING_HUBS) diverges from sort(keys(HUB_CHILD)). Ship .opencode/bin/compiled-route-status.cjs --hub|--all emitting a stable per-hub JSON status contract and wire it into advisor_status and session_bootstrap so 'drifted' is finally distinguishable from 'broken'. Document SPECKIT_COMPILED_ROUTING in the system-spec-kit ENV-REFERENCE. Tri-state the flag in BOTH read sites (resolve.cjs flagEnabled and advisor-recommend.ts) with a truth-table test, keeping unset behavior-identical to today because the per-hub default-on cohort is empty until P4. Add stderr breadcrumbs to the three silent catches. Add a DURABLE lint/CI rule that fails any future require/import from .opencode/specs in runtime code. Every change ships behind the still-off flag, stays byte-identical to legacy on routing fields, names a byte-exact or flag rollback, and never edits the three SHA-256-pinned frozen scorer files."
trigger_phrases:
  - "runtime promotion and status foundation"
  - "compiled routing P0 foundation spec"
  - "promote resolver closure status probe tri-state"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/020-router-unification-program/007-unified-refactor-implementation/015-routing-coverage-activation-verification/002-runtime-promotion-and-status-foundation"
    last_updated_at: "2026-07-21T03:58:44Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Reconciled the spec status to implemented+committed (code landed in 4153cbebd8)"
    next_safe_action: "P4/011 operator-gated cutover remains pending"
    blockers: []
    key_files:
      - "spec.md"
      - "decision-record.md"
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "pending"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Q1: the promoted closure is hosted at .opencode/bin/lib/compiled-routing/ (landed in 4153cbebd8)"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
<!-- SPECKIT_LEVEL: 3 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

# Runtime Promotion & Status Foundation (P0)

## EXECUTIVE SUMMARY

This is the P0 foundation of the `015-routing-coverage-activation-verification` program. The 25-iteration research (`../001-research/synthesis-v1.md`), the adversarial pass (`../001-research/verification-v1.md`), and the orchestrator review (`../001-research/review-v1.md`) all converge on one conclusion: the four named coverage gaps are downstream, and the load-bearing work is a runtime activation foundation that every other child (003-011) consumes. This packet builds that foundation and nothing else.

Six coupled defects live under one closure. The runtime resolver, the engine loader, the seven activation manifests, and the seven per-hub compiled bundles are all read from **inside the mutable `.opencode/specs` tree** (CF-ACT-4, CONFIRMED: `bin/compiled-route.cjs:16-21` requires into the spec tree; `resolve.cjs:19` points `ACTIVATION_ROOT` at `010-live-activation/activation`; the engine loads from `006-*`). A single spec renumber reverts the whole fleet to legacy with zero signal, because three nested catches swallow the failure silently (`bin/compiled-route.cjs:36-38`, `resolve.cjs:45-47`, `advisor-recommend.ts:352`, all CONFIRMED). There is no per-hub serving-status readout anywhere, so "drifted" reads identically to "broken" (CF-ACT-5). The flag is bi-state (`=== '1'` at `resolve.cjs:22-23` and `advisor-recommend.ts:362`), so it cannot express the eventual default-on plus kill-switch (CF-ACT-6). `SPECKIT_COMPILED_ROUTING` is absent from `ENV-REFERENCE.md` (CF-CAT-3). And the parent packet's ADR-002 mis-modeled `HUB_CHILD` as a removable duplicate when it is actually the runtime engine-dispatch table (CF-ACT-3, CONFIRMED: `011-runtime-engine/lib/compiled-route.cjs:23-31,35-62`).

This packet resolves all six as a single closure move plus four additive plumbing changes, then hardens against recurrence. It promotes the whole closure to a stable runtime path (binding the parent decision-record's ADR-003 and deleting the residual-coupling escape hatch that still lives at `012-default-on-decision/implementation-summary.md:170`). It splits manifest-derived eligibility from the engine-dispatch table and adds the divergence cross-check test. It ships a status probe and wires it into `advisor_status` and `session_bootstrap`. It documents and tri-states the flag. It adds stderr breadcrumbs to the three catches. And it adds a durable lint/CI rule (omission F-16-4) that fails any FUTURE `require`/import from `.opencode/specs` in runtime code, so the promotion cannot silently regress.

**Hard invariants at every step:** compiled routing stays **byte-identical to legacy** on all routing fields (this packet changes no routing decision); the three frozen scorer files (`router-replay.cjs`, `score-skill-benchmark.cjs`, `load-playbook-scenarios.cjs`) are **SHA-256-pinned and NEVER edited** — they are read and re-hashed only; every step names a byte-exact or flag-based rollback; **no runtime path reads under `.opencode/specs`** once promotion lands. The tri-state change keeps unset behavior-identical to today because the per-hub default-on cohort is empty until P4 (`011-activation-cutover-p4`); this packet lights no hub.

> **Status: Implemented (landed in 4153cbebd8).** The foundation is built behind the still-off `SPECKIT_COMPILED_ROUTING` flag; compiled routing stayed byte-identical to legacy and no hub was lit. The staged default-on cutover is the separate P4 packet (`../011-activation-cutover-p4/`) and stays operator-gated.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | Implemented — landed in 4153cbebd8, behind the still-off `SPECKIT_COMPILED_ROUTING` flag. This is the P0 foundation; children 003-011 consume it. The staged default-on cutover stays operator-gated (P4/011) and is not done. |
| **Created** | 2026-07-20 |
| **Branch** | `skilled/v4.0.0.0` |
| **Migration stage** | P0 activation foundation (promotion + observability + flag governance); the default-on flip is the separate P4 packet |
| **Blast radius** | High: touches the runtime resolver/front door, the advisor integration, both flag read sites, and the shared engine-dispatch table for all seven hubs. Every change is additive-or-move, behind the still-off flag, and byte-exact or flag reversible. No routing decision changes. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The compiled router is shipped but held inert. Before default-on can ever be safe, six foundational defects must be resolved — and they are entangled, so a leaner tree cannot address them piecemeal. Each is backed by a verified receipt (treat every `file:line` as +/-10 and re-anchor on the named symbol at build time, per `../001-research/review-v1.md` section 2):

1. **The runtime reads its own closure from the mutable spec tree, and fails silent fleet-wide (CF-ACT-4, CONFIRMED).** `.opencode/bin/compiled-route.cjs` is the only genuinely stable file; it immediately `require()`s into `.opencode/specs/.../011-runtime-engine/lib/resolve.cjs` (`:16-21`), which resolves `ACTIVATION_ROOT` to `010-live-activation/activation` (`resolve.cjs:19`) and loads hub engines from `006-*`. A spec renumber/re-nest silently reverts every hub to the legacy sentinel. Three nested catches emit nothing (`bin/compiled-route.cjs:36-38`, `resolve.cjs:45-47`, `advisor-recommend.ts:352`); the advisor subprocess call additionally uses `stdio: ['ignore','pipe','ignore']`, actively discarding any child stderr.

2. **The ADR-003 promotion is still escapable (CF-ACT-4 / verification claim 8, CONFIRMED contradiction).** The parent decision-record Accepted "promote the resolver" (`../../012-default-on-decision/decision-record.md:264,287`), but a stale residual-coupling branch survives at `../../012-default-on-decision/implementation-summary.md:170` ("promote ... or approve a guarded residual coupling"). Two live documents disagree; the ADR is authoritative and the escape hatch must be deleted.

3. **`HUB_CHILD` is an engine-dispatch table, not a removable duplicate (CF-ACT-3, CONFIRMED).** `011-runtime-engine/lib/compiled-route.cjs:23-31,35-62`: `HUB_CHILD` maps each hub to its `006-parent-hub-rollout/00N-*` child and `loadHubEngine()` `require()`s engine modules from that path. `COMPILED_ROUTING_HUBS` (`advisor-recommend.ts:41-49`, a 7-hub Set) and `HUB_CHILD` have no cross-check, so they can silently diverge.

4. **No per-hub serving-status observability; drifted == broken (CF-ACT-5, CONFIRMED).** Nothing reads the seven manifests: `advisor-status.ts` (both `tools/` and `handlers/` copies), `session-bootstrap.ts`, and `mk-skill-advisor.js:826-861` all lack it. The legacy sentinel collapses four causes (flag-off / missing-manifest / legacy-authority / engine-throw) into one signal (`resolve.cjs:40`).

5. **The flag is bi-state (CF-ACT-6, CONFIRMED).** `resolve.cjs:22-23` and `advisor-recommend.ts:362` both test `=== '1'`, so unset and `'0'` are identical. Default-on plus an explicit kill-switch needs tri-state, with invalid-value behavior defined, changed in both read sites together.

6. **The flag is undocumented (CF-CAT-3, CONFIRMED).** `SPECKIT_COMPILED_ROUTING` has zero hits in `ENV-REFERENCE.md`; CLAUDE.md section 6 mandates that file as the source of truth for flag defaults.

A seventh, durability gap (omission F-16-4, from `../001-research/review-v1.md` section 3 and `verification-v1.md` section 4): even after the closure moves, nothing prevents a FUTURE runtime file from re-introducing a `require`/import under `.opencode/specs`. `verify_alignment_drift.py` has no such check. Fixing the current instance without a durable guard invites silent regression.

### Purpose

Build the P0 foundation so that: the runtime never reads under `.opencode/specs`; a spec renumber can no longer sever routing; eligibility and engine-dispatch are separated and cross-checked; per-hub serving state is inspectable and "drifted" is distinct from "broken"; the flag is documented and tri-state (without lighting any hub); the three silent catches leave a breadcrumb; and a durable rule prevents the coupling from ever returning. Everything downstream (003 propagation, 004 benchmark, 005 playbooks, 006 catalogs, 007 archiving, 008 sk-code, 009 sk-doc, 010 rollback, 011 cutover) consumes this foundation.

<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- **Closure promotion (binding).** Move the resolver, the engine loader, the seven activation manifests, and the seven per-hub compiled bundles to a stable runtime path so no runtime path reads under `.opencode/specs`. Make promotion binding per parent ADR-003; delete the residual-coupling branch; correct the stale line at `../../012-default-on-decision/implementation-summary.md:170`. The spec-tree copy becomes the authored source built/copied into the runtime location.
- **Eligibility vs engine-dispatch split.** Derive compiled eligibility from manifest freshness; keep `HUB_CHILD` as the engine-location map; standardize one stable per-hub engine entrypoint; add a cross-check test asserting `sort(COMPILED_ROUTING_HUBS) === sort(keys(HUB_CHILD))`, failing with the diverging hub named.
- **Status probe.** Ship `.opencode/bin/compiled-route-status.cjs --hub <id> | --all` emitting the stable JSON contract `{hubId, servingAuthority, shadowOnly, selectedPolicy.generation, effectivePolicyHash, fenceEpoch, manifestFingerprint, causeCode}`; the `causeCode` separates drifted from broken. Wire it (prompt-safe, size-capped, no blocking spawn) into `spec_kit_skill_advisor_status` and `session_bootstrap`.
- **Flag governance.** Add the `SPECKIT_COMPILED_ROUTING` entry to `.opencode/skills/system-spec-kit/mcp-server/ENV-REFERENCE.md`: current default-off, tri-state semantics, the `=0` kill-switch, and eligibility gating.
- **Tri-state flag.** Convert both read sites (`resolve.cjs` flag test near `:22-23`; `advisor-recommend.ts` near `:362`) to tri-state in one change: unset = per-hub-default cohort (empty pre-P4 ⇒ legacy for all hubs) / `'1'` = force-on / `'0'|'false'|'off'` = force-legacy / invalid = fail-closed to legacy with a diagnostic. Cover with an unset/`0`/`1`/invalid truth-table test.
- **Stderr breadcrumbs.** Emit a diagnostic breadcrumb in each of the three silent catches without changing the fallback outcome; account for the advisor subprocess `stdio` that currently discards child stderr.
- **Durable no-spec-import rule (F-16-4).** Add a lint/CI rule that fails any FUTURE `require`/import from `.opencode/specs/**` in runtime code, with positive and negative fixtures.

### Out of Scope

- Any change to routing **decisions** — [why] compiled must stay byte-identical to legacy; this program never changes what routes, only what is served, promoted, and observed.
- Editing the three frozen scorer files (`router-replay.cjs`, `score-skill-benchmark.cjs`, `load-playbook-scenarios.cjs`) — [why] SHA-256-pinned across the whole program; this packet reads and re-hashes them only.
- Un-stripping the flag from the two `CHILD_ENV_ALLOWLIST` sets, threading `compiledRoute` through the bridge/hook, and cache invalidation — [why] that is P1 consumption, delivered by `../003-flag-propagation-and-effective-consumption/`.
- The Lane C compiled-parity harness and verdict sub-state — [why] delivered by `../004-benchmark-compiled-lane-c/` in the NON-frozen orchestrator.
- Flipping `SPECKIT_COMPILED_ROUTING` to a repo default, or advancing any hub into the default-on cohort — [why] that is the P4 packet `../011-activation-cutover-p4/`; this packet lights no hub.
- Consolidating the duplicated frozen-scorer pin object across `activate-hub.cjs`/`flip-serving.cjs` (CF-ACT-10) — [why] owned by `../004-benchmark-compiled-lane-c/`/`../010-rollback-audit-and-non-hub-policy/`.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/bin/compiled-route.cjs` | Modify | Require the promoted resolver from the stable runtime path; add the stderr breadcrumb in the sentinel catch |
| `011-runtime-engine/lib/resolve.cjs` (authored source) | Modify | Tri-state the flag test; add the stderr breadcrumb in its catch; keep it as the built/copied authored source of the promoted runtime resolver |
| `011-runtime-engine/lib/compiled-route.cjs` (authored source) | Modify | Standardize the stable per-hub engine entrypoint; keep `HUB_CHILD` as the engine map decoupled from eligibility |
| `system-skill-advisor/mcp-server/handlers/advisor-recommend.ts` | Modify | Tri-state the flag test near `:362`; add the stderr breadcrumb in the catch near `:352` (and stop discarding the child stderr the breadcrumb needs) |
| `.opencode/bin/compiled-route-status.cjs` | Create | The `--hub | --all` status probe emitting the stable JSON contract |
| `system-skill-advisor/mcp-server/**/advisor-status.ts` + `.opencode/plugins/mk-skill-advisor.js` | Modify | Surface the per-hub serving status in `spec_kit_skill_advisor_status` (both copies), prompt-safe and size-capped |
| `system-spec-kit/mcp-server/handlers/session-bootstrap.ts` | Modify | Surface the serving-status readout during bootstrap, no blocking spawn |
| `system-spec-kit/mcp-server/ENV-REFERENCE.md` | Modify | Add the `SPECKIT_COMPILED_ROUTING` feature-flag entry |
| Stable runtime dir (e.g. `.opencode/bin/lib/`) + build/copy step | Create | The promoted closure destination and the step that keeps it current with the authored source |
| Eligibility cross-check test + tri-state truth-table test + no-spec-import lint + fixtures | Create | New non-frozen tests/guards proving the split, the flag semantics, and the durable rule |
| `../../012-default-on-decision/implementation-summary.md` | Modify | Correct the stale residual-coupling follow-up at `:170` to match the Accepted ADR-003 (promotion binding) |

> This packet authors documentation, a status CLI, additive tests/guards, and surgical plumbing edits. It never edits a frozen scorer file and never changes a routing decision.

<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Promote the full closure (resolver + engine loader + seven activation manifests + seven per-hub bundles) to a stable runtime path so no runtime path reads under `.opencode/specs`, making promotion binding and deleting the residual-coupling branch. | The runtime front door and everything it transitively loads resolve outside `.opencode/specs`; a spec-tree-move simulation still resolves every hub (no fallback to sentinel from a relocation); the authored source builds/copies into the runtime location; `../../012-default-on-decision/implementation-summary.md:170` is corrected to state promotion is binding; the residual-coupling option is deleted, not merely deprecated. Rollback: restore the shim's prior require path (the spec-tree copy still exists; the shim already fails safe). |
| REQ-002 | Split manifest-derived eligibility from the `HUB_CHILD` engine-dispatch table and add the divergence cross-check. | Eligibility is derived from manifest freshness (not from `HUB_CHILD`); `HUB_CHILD` remains the engine-location map behind one standardized per-hub entrypoint; a test asserts `sort(COMPILED_ROUTING_HUBS) === sort(keys(HUB_CHILD))` and fails with the diverging hub named. No hub is removed from either structure in this packet. |
| REQ-003 | Ship `.opencode/bin/compiled-route-status.cjs --hub <id> | --all` emitting the stable per-hub JSON status contract, and wire it into `advisor_status` and `session_bootstrap`. | The CLI emits `{hubId, servingAuthority, shadowOnly, selectedPolicy.generation, effectivePolicyHash, fenceEpoch, manifestFingerprint, causeCode}` for one hub or all seven; `causeCode` distinguishes flag-off / missing-manifest / legacy-authority / engine-throw so drifted is separable from broken; `spec_kit_skill_advisor_status` (both copies) and `session_bootstrap` surface it prompt-safe, size-capped, with no blocking spawn. |
| REQ-004 | Tri-state `SPECKIT_COMPILED_ROUTING` in BOTH read sites with unset kept behavior-identical to today. | Both `resolve.cjs` (near `:22-23`) and `advisor-recommend.ts` (near `:362`) read tri-state: unset = per-hub-default cohort (empty pre-P4 ⇒ legacy for all hubs) / `'1'` = force-on / `'0'|'false'|'off'` = force-legacy / invalid = fail-closed to legacy with a diagnostic; a truth-table test covers unset/`0`/`1`/invalid; legacy Lane C replay is byte-identical before and after (no routing change). |
| REQ-005 | Add a stderr breadcrumb to each of the three silent catches without changing the fallback outcome. | `bin/compiled-route.cjs` (near `:36-38`), `resolve.cjs` (near `:45-47`), and `advisor-recommend.ts` (near `:352`) each emit a single diagnostic breadcrumb on fallback; the advisor subprocess no longer discards the child stderr the breadcrumb needs; the served authority is unchanged (still legacy sentinel on failure). |
| REQ-006 | Document `SPECKIT_COMPILED_ROUTING` in the system-spec-kit ENV-REFERENCE. | The feature-flag table gains an entry stating the current default-off, the tri-state semantics, the `=0` kill-switch, and that serving requires an eligible fresh manifest; wording is phase-accurate (opt-in now, default-on is the P4 outcome). |
| REQ-007 | Add a DURABLE lint/CI rule that fails any FUTURE `require`/import from `.opencode/specs/**` in runtime code (F-16-4). | A non-frozen check scans runtime directories for `require`/import targets under `.opencode/specs` and exits non-zero naming the offending file; a positive fixture (a seeded spec-import) fails and a negative fixture (clean runtime) passes; the check is wired into CI, not a one-time cleanup. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-008 | Re-assert the shared migration gates on every 002 change. | Each change ships behind the still-off flag; the three frozen scorer SHA-256 digests are captured before and equal after; compiled == legacy on all routing fields (legacy Lane C replay byte-identical); `validate.sh --strict` reports Errors 0 on this folder; each change names a byte-exact or flag rollback. |
| REQ-009 | Keep the status contract stable and prompt-safe for the downstream consumers (004, 005, 007, 011). | The JSON contract field set and `causeCode` enum are documented as the stable interface downstream children derive from; the readout is bounded (size-capped, no unbounded per-request work) and lives outside the hot routing decision path. |

<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: No runtime path reads under `.opencode/specs`, proven by a spec-tree-move simulation that still resolves all seven hubs (REQ-001).
- **SC-002**: Eligibility and engine-dispatch are separated, and the cross-check test fails loudly (naming the hub) on any divergence between `COMPILED_ROUTING_HUBS` and `keys(HUB_CHILD)` (REQ-002).
- **SC-003**: `compiled-route-status.cjs --all` emits seven rows with distinct `causeCode` values, and `advisor_status`/`session_bootstrap` surface the same readout, so a red signal means breakage rather than routine drift (REQ-003).
- **SC-004**: The flag is documented and tri-state, unset stays byte-identical to today (no hub lit), and the unset/`0`/`1`/invalid truth-table test passes (REQ-004, REQ-006).
- **SC-005**: The three catches leave breadcrumbs and a future spec-import is blocked by the durable rule, both without altering any routing decision (REQ-005, REQ-007).
- **SC-006**: The frozen-scorer digests are unchanged, legacy Lane C replay is byte-identical, and every step has a named, proven rollback (REQ-008).

<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Closure promotion misses a transitive read still under specs | A relocated spec folder silently reverts a hub to legacy | Spec-tree-move simulation asserts every transitive load resolves outside `.opencode/specs`; the durable lint rule blocks re-introduction (REQ-007) |
| Risk | Tri-state change accidentally lights a hub (unset ⇒ on) | Fleet-wide routing change, breaking byte-identity | Per-hub default-on cohort ships empty; unset resolves to legacy for all hubs pre-P4; legacy Lane C replay byte-identical gate |
| Risk | Promoted runtime copy drifts from the authored source | Runtime serves stale resolver/manifests | Build/copy step wired to the mint flow; a freshness check is the P1 drift-CI's job (`../010-.../`), noted as a downstream dependency |
| Risk | Breadcrumb edit changes the fallback outcome | A diagnostic accidentally alters served authority | Breadcrumb is emit-only in the catch; served value stays the legacy sentinel; error-injection fixtures confirm authority unchanged |
| Risk | Reading `advisor-recommend.ts:1765-1773`-style frozen evidence as an edit target | A frozen scorer edit invalidates the parity baseline | Frozen trio is read/re-hashed only; SHA-256 before == after gate; no branch added to any frozen file |
| Dependency | Parent decision-record ADR-002 (eligibility) and ADR-003 (promote resolver) | This packet operationalizes and binds both | `decision-record.md` cites the parent ADRs by path; local ADRs record the closure-scope and split decisions |
| Dependency | Three frozen scorer files | Any digest change invalidates the whole program's parity baseline | Restated as a hard pin per step; never edited |
| Dependency | Downstream children 003-011 | All consume this foundation (flag reachable, decision consumable, status probe, promoted paths) | This packet is the sole P0 root of the DAG; it blocks all of them until green |

<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Reversibility
- **NFR-R01**: Every change names an explicit rollback — the closure move reverts to the prior shim require path (spec-tree copy retained), the plumbing edits revert file-locally, and the flag stays a documented `=0`/off control.
- **NFR-R02**: Because compiled stays byte-identical to legacy and no hub is lit, every rollback is behavior-neutral by construction, not merely by test.

### Determinism
- **NFR-D01**: The status readout is a pure function of (manifest bytes, live config hash, flag, resolver availability); identical inputs yield identical `servingAuthority` and `causeCode`, with drift a hash mismatch rather than a timing artifact.

### Observability
- **NFR-O01**: The status probe is diagnostic-only, size-capped, and outside the hot routing decision path; it never spawns a blocking process from a prompt-time surface.

### Safety
- **NFR-S01**: All failure paths continue to fail safe to the legacy sentinel; the breadcrumbs add signal without adding a throw into the routing path.

---

## 8. EDGE CASES

### Promotion correctness
- Spec folder renumbered/re-nested after promotion: the runtime still resolves from the stable path; no revert to sentinel; the durable lint rule blocks any new spec-import.
- Authored source edited but not rebuilt/copied: the runtime copy is stale; flagged by the downstream P1 freshness check, not silently served (dependency noted, not owned here).

### Eligibility vs engine-dispatch
- `COMPILED_ROUTING_HUBS` and `keys(HUB_CHILD)` diverge: the cross-check test fails and names the diverging hub; neither structure is auto-mutated.
- A hub eligible by manifest but missing an engine entrypoint: surfaces as a distinct `causeCode` (engine-throw), not a false "compiled-serving".

### Flag tri-state
- Unset, pre-P4: per-hub cohort empty ⇒ legacy for every hub (byte-identical to today).
- `'0'|'false'|'off'`: force-legacy fleet-wide (kill-switch), overriding any per-hub cohort state.
- Invalid value (e.g. `'2'`, `'yes'`): fail-closed to legacy with a diagnostic breadcrumb, never interpreted as on.

### Observability boundaries
- Drifted hub vs broken resolver: separated by `causeCode` (legacy-authority/missing-manifest = drift/expected; engine-throw = broken).
- All-legacy fleet under an explicit `=1`: a valid state (e.g. every hub mid-edit); reads as degraded, not failed.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 20/25 | A closure move plus a status CLI, a flag governance change, a tri-state change in two runtime read sites, breadcrumbs in three catches, and a durable CI rule — the widest single-packet runtime surface in the program |
| Risk | 21/25 | Touches the shared resolver/front door and both flag read sites for all seven hubs; a mistake could sever routing or light a hub, so every step is behind the still-off flag with a byte-exact rollback |
| Research | 8/20 | Mechanism verified from source across three research artifacts (promotion closure, engine-dispatch role, sentinel catches, bi-state flag); residual is implementation, not investigation |
| **Total** | **49/70** | **Level 3** — runtime architecture change across the shared closure, not authoring volume, sets the level |

---

## 10. RISK MATRIX

| Risk | Likelihood | Impact | Mitigation | Owner |
|------|-----------|--------|------------|-------|
| Promotion leaves a transitive spec-tree read | Medium | High | Spec-tree-move simulation + durable no-spec-import lint | P0 owner |
| Tri-state unset accidentally serves compiled | Low | High | Empty default-on cohort pre-P4; byte-identical Lane C replay gate | P0 owner |
| Cross-check test omitted, allowlists diverge later | Medium | Medium | `sort(COMPILED_ROUTING_HUBS)===sort(keys(HUB_CHILD))` test is a REQ-002 acceptance gate | P0 owner |
| Status readout leaks secrets or bloats the prompt | Low | Medium | Fixed field set, size-capped, no raw prompt/secret persisted | P0 owner |
| A frozen scorer file is edited while re-hashing | Low | High | Read/re-hash only; SHA-256 before == after gate aborts on drift | Whole program |
| Runtime resolver copy goes stale post-promotion | Medium | Medium | Build/copy wired to mint; freshness check deferred to P1 drift-CI (dependency) | P1 owner |

---

## 11. USER STORIES

- **US-001 (release owner).** As the owner of the eventual default-on flip, I want a per-hub serving-status readout with a `causeCode`, so I can tell a drifted hub from a broken one before I stage any cutover.
- **US-002 (runtime maintainer).** As a maintainer who renumbers spec folders, I want the runtime resolver promoted out of the spec tree, so my reorganization can no longer silently revert the fleet to legacy.
- **US-003 (advisor integrator).** As the author of `003-flag-propagation`, I want the flag documented and tri-state and the closure stable, so I can un-strip the flag and thread the decision against a foundation that will not move under me.
- **US-004 (reviewer).** As a reviewer, I want a durable CI rule that fails any future runtime import from `.opencode/specs`, so the coupling this packet removes cannot quietly return in a later change.

## 12. OPEN QUESTIONS

- **Q1.** Which stable runtime directory hosts the promoted closure — `.opencode/bin/lib/` (beside the shim, per the parent ADR-003 example) or a dedicated `.opencode/runtime/` root? (Recommendation: `.opencode/bin/lib/`, matching the ADR-003 illustration and keeping the shim's require relative and short.)
- **Q2.** Should the seven activation manifests and seven per-hub bundles be copied verbatim into the runtime dir, or assembled into a single serving snapshot at build time? (Recommendation: copy verbatim in this packet to preserve byte-identity and a trivial rollback; the consolidated `serving-snapshot.json` is `../007-durable-archiving-and-serving-snapshot/`'s job.)
- **Q3.** For the `advisor-recommend.ts` breadcrumb: change the subprocess `stdio` to capture child stderr, or emit the breadcrumb from the parent after detecting the sentinel? (Recommendation: emit from the parent on sentinel detection to avoid touching the child's I/O contract; confirm against the real call site at build time.)

<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Local decisions (closure scope, split, status contract, tri-state, durable rule)**: See `decision-record.md`
- **Build approach**: See `plan.md`
- **Task breakdown**: See `tasks.md`
- **Verification checklist**: See `checklist.md`
- **Completion record (Planned state)**: See `implementation-summary.md`
- **Upstream evidence**: `../001-research/synthesis-v1.md` (CF-ACT-1..11), `../001-research/verification-v1.md` (confirmed claims), `../001-research/review-v1.md` (the authoring contract)
- **Program parent**: `../spec.md`
- **Parent decisions operationalized**: `../../012-default-on-decision/decision-record.md` (ADR-002 eligibility, ADR-003 promote resolver) and the stale branch corrected at `../../012-default-on-decision/implementation-summary.md`
- **Runtime front door**: `.opencode/bin/compiled-route.cjs`; authored resolver `011-runtime-engine/lib/resolve.cjs`; engine map `011-runtime-engine/lib/compiled-route.cjs`
- **Live integration point**: `system-skill-advisor/mcp-server/handlers/advisor-recommend.ts`
- **Downstream consumers**: `../003-flag-propagation-and-effective-consumption/`, `../004-benchmark-compiled-lane-c/`, `../011-activation-cutover-p4/` (and 005-010)
