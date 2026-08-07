---
title: "Implementation Summary: path-covering termination"
description: "Replay-stable path coverage, fail-closed stopping, evidence certificates, partial reports, and additive legacy shadow integration."
trigger_phrases:
  - "path-covering termination implementation"
  - "coverage certificate implementation"
  - "deep-loop phase 011 child 001 implementation"
importance_tier: "high"
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/011-convergence-termination-and-health/001-path-covering-termination"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/011-convergence-termination-and-health/001-path-covering-termination"
    last_updated_at: "2026-07-21T12:31:00Z"
    last_updated_by: "codex"
    recent_action: "Hardened and verified projection-content trust boundaries"
    next_safe_action: "Keep the new evaluator shadow-only until the staged authority cutover"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/path-coverage-termination/index.ts"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/path-coverage-termination.vitest.ts"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary: Path-Covering Termination

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 001-path-covering-termination |
| **Completed** | 2026-07-21 |
| **Level** | 2 |
| **Authority** | Additive-DARK; legacy council and coverage-graph decisions remain authoritative |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Deep-loop runs can now produce a replay-stable proof that every required search path was addressed. Resource exhaustion stays visibly incomplete: iteration, time, or budget limits below full coverage return `INCOMPLETE_LIMIT` with the limit identity and uncovered paths, while blockers, stale projections, contradictions, and ambiguous communities fail closed.

The evaluator derives late-major-region blocking from `lateDiscoveredMajorRegionIds`, not the projection's `staleUniverse` summary flag. A projection that recomputes its unkeyed checksum after hiding the stale flag still returns `STOP_BLOCKED`, and the reverse flag/data mismatch also fails closed.

The evaluator now applies the reducer's locator checks again at the decision boundary. Ledger locators must name the frozen ledger
and remain inside its committed range; semantic-community and claim-relationship rows must name the universe-bound projection
version. Coverage-graph rows must name the universe binding derived from the authoritative coverage-graph database schema version.
Invalid locator contents keep the path open and emit an `invalid-evidence-locator` blocker even when the projection hash was
recomputed after tampering.

Exclusions use the existing verified authorization-audit read model. A path closes by exclusion only when the copied reference,
audit frame, receipt, allow decision, authority epoch, and policy identity all match the verified audit snapshot. Universe
validation also reconstructs the complete expected cartesian path-ID set from `dimensionValues`, preventing a recomputed universe
hash from hiding a shortened denominator.

### Frozen coverage and evidence proof

Seven exact, versioned mode profiles define their path dimensions, mandatory major regions, evidence classes, contradiction policy, and closeable states. A compiler binds each immutable universe to the namespace, run, input fingerprint, coverage-graph schema, semantic-community membership, relationship projection, ledger head, and replay fingerprint. The reducer records evidence and transition provenance, and the evaluator emits a canonically hashed certificate plus a ranked partial report.

Late stable communities mint successor universes instead of mutating an earlier denominator. Semantic-community identity provides the concept boundary, so paraphrases stay on one path while evidence-only growth remains a separate certificate field.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `runtime/lib/path-coverage-termination/types.ts` | Created | Versioned profiles, universes, events, projections, decisions, certificates, and reports |
| `runtime/lib/path-coverage-termination/profiles.ts` | Created | Complete immutable registry for seven supported modes with fail-closed exact validation |
| `runtime/lib/path-coverage-termination/universe.ts` | Created | Deterministic path IDs, frozen universes, successor invalidation, and structural validation |
| `runtime/lib/path-coverage-termination/reducer.ts` | Created | Replay-ordered path-state reduction with evidence and exclusion provenance |
| `runtime/lib/path-coverage-termination/evaluator.ts` | Created | Blocker-aware outcome predicate, certificate hashing, and partial reports |
| `runtime/lib/path-coverage-termination/shadow.ts` | Created | Legacy-authoritative council bridge with additive path-coverage diagnostics |
| `runtime/lib/path-coverage-termination/index.ts` | Created | Public additive module surface |
| `runtime/tests/unit/path-coverage-termination.vitest.ts` | Created | Per-mode and adversarial invariant fixtures |
| `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md` | Updated/Created | Completion evidence and durable verification record |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The module landed as a new runtime library with no imports or edits in the legacy convergence, coverage-graph, semantic-community, contradiction-supersession, ledger, or replay-fingerprint authorities. Shadow output retains the complete legacy bridge and its decision as authoritative, then appends the new certificate, partial report, disagreement flag, and shadow-only marker.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Use exact registered profiles with no defaults | A missing region must reject the profile rather than shrink the denominator |
| Derive paths from committed semantic communities | Claim strings and paraphrases cannot manufacture extra concept coverage |
| Keep path IDs independent of universe version | Existing paths remain stable when a successor universe expands the denominator |
| Give blockers precedence over stop and limits | Invalid or unsafe state must remain `STOP_BLOCKED`; an otherwise valid exhausted run stays `INCOMPLETE_LIMIT` |
| Require evidence locators or an authorized exclusion | Aggregate coverage ratios cannot close a path |
| Treat the projection hash as a checksum, not an authenticator | Verdict-affecting derived fields must be re-derived or semantically cross-checked independently of a recomputed hash |
| Bind coverage-graph locators to the authoritative graph schema | The graph has no immutable projection revision or ledger cursor, so its exported schema version is the strongest real version binding available without changing its writer |
| Match exclusions to `VerifiedAuthorizationAudit` | The evaluator can preserve valid policy exclusions without trusting copied authorization content or changing the audit-ledger writer |
| Reconstruct the cartesian path set during validation | A self-consistent universe hash cannot make an implied path disappear from the denominator |
| Preserve legacy bridge authority | This leaf supplies dark evidence for later calibration without changing shipped decisions or thresholds |
<!-- /ANCHOR:decisions -->

### Verdict-input audit

| Input | Evaluator treatment |
|-------|---------------------|
| `projectionVersion`, `universeId` | Cross-checked against the supported semantic version and active frozen universe |
| `paths` | Key set is re-derived from `universe.paths`; every closeable record ID is checked; closure uses locators grounded to the frozen ledger or an exact universe-bound projection/schema version plus exact verified-audit exclusion matches; blocked records materialize blockers |
| `lateDiscoveredMajorRegionIds`, `staleUniverse` | Late-region presence independently creates the blocker; either flag/data disagreement adds a separate fail-closed blocker |
| `lastLedgerSequence` | Cross-checked against the frozen universe ledger range; it can only add a blocker and cannot authorize stopping |
| `projectionHash` | Recomputed for self-consistency only; never accepted as authentication for another field |
| `projectionFreshness` | A false flag blocks directly, while community version, membership digest, relationship version, and ledger sequence are each cross-checked against the frozen universe |
| Relationship projection | Schema version is cross-checked; active contradiction IDs are derived from rows and the canonical count is independently recomputed |
| Universe and active universe ID | Structural validity, registered profile, complete cartesian path set, path identities, frozen status, universe hash, and active ID are checked before coverage can authorize stopping |
| Explicit stop blockers | STOP-severity rows are materialized directly; no caller-supplied aggregate count or boolean is trusted |
| Limit status | Consulted only after blockers are absent and open paths remain; it can select `INCOMPLETE_LIMIT` but cannot authorize `STOP_ALLOWED` |
| `semanticEvidenceGrowth`, `sourceEventIds`, path transitions | Carried as evidence/provenance only and do not decide the verdict |

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Focused Vitest | PASS, 1 file and 92 tests covering all seven profiles plus adversarial cross-profile invariants |
| Runtime TypeScript | PASS, `tsc --noEmit -p .opencode/skills/system-deep-loop/runtime/tsconfig.json`, exit 0 |
| Path-scoped strict TypeScript | PASS, public module compiled with strict ES2022 options, exit 0 |
| Comment hygiene | PASS for all eight new TypeScript files |
| Packet validation | PASS, strict validator exit 0 with zero errors |
| Scope and frozen-authority audit | PASS, path-filtered delta contains only this leaf; frozen contract hashes are unchanged |

The 92 tests cover complete, partial, blocked, excluded, empty, replayed, contradiction-heavy, and iteration/time/budget-exhausted states for every mode. Cross-profile fixtures cover paraphrase-heavy communities, evidence-only growth, late denominator expansion, recomputed-hash stale-flag tampering in both directions, forged ledger locator contents, wrong semantic and coverage-graph versions, coverage-graph evidence-class impersonation, one-locator swaps in honest projections, forged universe bindings, valid coverage-graph controls, forged exclusion authorization, cartesian denominator shrinkage, stale-stop invalidation, ambiguous communities, stale and unsupported projections, explicit STOP blockers, aggregate-only closure rejection, full-coverage limit precedence, deterministic multi-path ranking, mandatory-path vetoes, and the legacy-authoritative shadow bridge.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Shadow-only authority.** The new predicate reports evidence but cannot change the shipped council or coverage-graph decision before the staged cutover.
2. **Finite declared universe.** Producers must supply the complete mode-owned dimensions at freeze time. Late major-region discovery invalidates the old stop candidate and requires a successor universe.
3. **Projection trust boundary.** Semantic-community, claim-relationship, coverage-graph, and authorization-audit meaning remains owned by their committed producers. The evaluator checks every available bound version or ledger reference, re-derives every local aggregate that can authorize or block stopping, and treats the projection hash only as an unkeyed self-consistency checksum. Because it receives only a ledger head and version bindings, it validates `eventId` and `rowId` presence but cannot independently dereference their content; that is the remaining structural ceiling rather than a trusted aggregate or verdict field.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skills/sk-doc/references/hvr-rules.md
-->
