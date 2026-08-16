---
title: "Decision Record: Parity, Regression, and Closeout"
description: "Accepted decisions for bounded routing-only remediation, owner-harness rebuilds, the seven-canary gate, adjudication-before-write expectations, graduated manifest refresh without activate-hub or the direct-mirror exception, the compiled-route-sync check/promotion/verify sequence with retained rollback and late finalize, canonical-seven status, and completed canonical metadata and index integration."
trigger_phrases:
  - "parity closeout decision record"
  - "fleet promotion decision"
  - "manifest refresh decision"
  - "canonical seven status decision"
importance_tier: "critical"
contextType: "decision"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/015-router-unification-program/020-root-router-document-standard/004-parity-regression-and-closeout"
    last_updated_at: "2026-08-16T07:53:20.991Z"
    last_updated_by: "markdown-agent"
    recent_action: "Ratified all thirteen Phase 004 decisions (ADR-001..013 Accepted)."
    next_safe_action: "Retry the final daemon-owned Phase 020 index scan when the memory service is available."
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "decision-record.md"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Decision Record: Parity, Regression, and Closeout

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

> **Ratification record**: ADR-001 through ADR-008 were ratified as **Accepted** on 2026-08-16 against the fleet, probe, status, and validation receipts under `scratch/closeout/`. ADR-009 through ADR-013 (the bounded routing repairs and expectations work) were recorded and accepted during execution and are retained verbatim. Evidence: `checklist.md` CHK-010..CHK-023 and CHK-110..CHK-114, `scratch/closeout/adjudication-ledger.json`, and `scratch/closeout/handoff-contract.md`.

<!-- ANCHOR:adr-001 -->
## ADR-001: Keep Remediation Bounded to Routing Inputs and Stop Unrelated Blockers with LOGIC-SYNC

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-08-15 |
| **Deciders** | Program owner, routing maintainer |

<!-- ANCHOR:adr-001-context -->
### Context

The fleet may not reach 7/7 compiled/fresh on the first pass. Without an explicit eligibility rule, a repair pass could drift into advisor features, command behavior, packet redesign, or product changes that the approved plan explicitly forbids.
<!-- /ANCHOR:adr-001-context -->

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: A repair is eligible only when it touches authored routing inputs, generated expectations or hashes changed by this migration, router compilation, canary/parity fixtures, activation-manifest freshness, or promoted-closure construction. If 7/7 requires an unrelated advisor feature, command behavior, packet redesign, or product change, the phase halts and records LOGIC-SYNC instead of widening scope.
<!-- /ANCHOR:adr-001-decision -->

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Eligibility table plus LOGIC-SYNC stop** | Predictable blast radius; explicit halt | Requires discipline per repair | 10/10 |
| Unbounded repair until green | Fastest path to green | Widens scope and breaks the plan contract | 1/10 |
| Defer all repairs | No risk | Cannot close the fleet gate | 3/10 |

**Why this one**: The approved plan freezes the repair surface; the eligibility table makes that boundary checkable before every edit.
<!-- /ANCHOR:adr-001-alternatives -->

<!-- ANCHOR:adr-001-consequences -->
### Consequences

Routing-specific failures may enter the bounded remediation loop; unrelated failures stop the program without broadening the approved surface.
<!-- /ANCHOR:adr-001-consequences -->

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks

Each repair must be routing-owned, evidence-backed, adjudicated before expectation writes, frozen-substrate neutral, and followed by the authoritative fleet gate.
<!-- /ANCHOR:adr-001-five-checks -->

<!-- ANCHOR:adr-001-impl -->
### Implementation Notes

The closeout ledger records the failure, source owner, bounded change, canary result, and final parity result for every remediation.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Rebuild Every Changed Hub Through Its Owner Harness

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-08-15 |
| **Deciders** | Program owner, benchmark maintainer |

### Context

Rollout artifacts are generated evidence. A shared or ad-hoc rebuild would make the compiled state unaccountable per hub and could hide which input produced which bundle.

### Decision

**We chose**: Each changed hub rebuilds through its own `009-parent-hub-rollout/<entry>/harness/build-artifacts.cjs` owner. The canonicalized receipt records source inputs, compiled artifacts, activation artifacts, effective policy hash, graph hash, and `status: built`. An unchanged hub does not rebuild unless drift is adjudicated first.

### Alternatives Considered

| Option | Benefit | Rejection Reason |
|--------|---------|------------------|
| Owner-harness rebuilds | Attributable, canonical receipts | Chosen |
| One shared rebuild script | Less code | Unattributable artifacts and hub coupling |
| Skip rebuild | No work | Compiled state stale against adopted routers |

### Consequences

Every compiled artifact is traceable to exactly one hub and one invocation; canaries then test the rebuilt state, not an assumed one.
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: Run the Seven-Canary Fleet Gate Before Any Expectation Change

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-08-15 |
| **Deciders** | Program owner, route-gold reviewer |

### Context

Route-gold and authored-hash updates must reflect a measured fleet state, not a predicted one. Editing expectations before canaries run would bless values that never passed a real evaluation.

### Decision

**We chose**: All seven canaries run first and exit 0 with route-gold, real-hub mode names, typed leaf sets, bundle/ambiguous routes, and zero-signal fallback rows captured. Only then may expectation inventories and adjudication rows be built, and expectation updates are followed by a canary re-run that must stay green.

### Alternatives Considered

| Option | Benefit | Rejection Reason |
|--------|---------|------------------|
| Canary-first fleet gate | Measured baseline for all later writes | Chosen |
| Expectation-first updates | Faster loop | Bakes in unverified values |
| Canaries after updates only | One run | Cannot distinguish migration drift from test drift |

### Consequences

Every expectation change is grounded in a green seven-hub measurement, and the post-update re-run proves the updates did not break the gate.
<!-- /ANCHOR:adr-003 -->

---

<!-- ANCHOR:adr-004 -->
## ADR-004: Adjudicate Before Updating Authored Hashes or Route-Gold Expectations

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-08-15 |
| **Deciders** | Program owner, route-gold reviewer |

### Context

The Phase 003 migration legitimately changes machine-block hashes and route-gold expectations for six hubs, but a reviewable record must precede each write so no expectation drifts silently. Frozen replay and scorer digests are not expectations; they are protected pins.

### Decision

**We chose**: Every authored-hash or route-gold update requires a child-local adjudication row with the prior value, migration cause, expected delta, and reviewer decision. No frozen replay or scorer digest is ever adjudicated into a new value; a mismatch halts with LOGIC-SYNC.

### Alternatives Considered

| Option | Benefit | Rejection Reason |
|--------|---------|------------------|
| Adjudication-ledger gate | Auditable, reviewable deltas | Chosen |
| Inline expectation fixes | Fast | Unattributable gold drift |
| Auto-bless new hashes | Simple | Normalizes drift without review |

### Consequences

The adjudication ledger is the review artifact for every gold and hash change, and protected pins stay out of the update path entirely.
<!-- /ANCHOR:adr-004 -->

---

<!-- ANCHOR:adr-005 -->
## ADR-005: Refresh Manifests Graduated Only; Never Activate-Hub or the Direct-Mirror Exception

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-08-15 |
| **Deciders** | Program owner, routing maintainer |

### Context

Existing graduated activation manifests already carry generation, serving authority, shadow-only state, and fencing semantics. The approved plan forbids shadow-era `activate-hub` and the mcp-tooling direct-mirror exception without new user approval.

### Decision

**We chose**: Refresh only existing graduated manifests through `.opencode/bin/compiled-route-manifest.cjs refresh`, preserving generation, serving authority, shadow-only state, and fencing semantics. Prove authored freshness for all seven before the sync check. No `activate-hub` invocation and no direct-mirror exception usage; both require new user approval before any use.

### Alternatives Considered

| Option | Benefit | Rejection Reason |
|--------|---------|------------------|
| Graduated refresh only | Preserves serving and fencing semantics | Chosen |
| `activate-hub` for a CAS workaround | Old tooling | Explicitly forbidden by the approved plan |
| Direct-mirror sync for mcp-tooling | One-hub shortcut | Requires new user approval not granted here |

### Consequences

The fleet stays on the graduated manifest path; freshness proves authored state, and the sync check runs against a known-good manifest set.
<!-- /ANCHOR:adr-005 -->

---

<!-- ANCHOR:adr-006 -->
## ADR-006: Promote Through the Canonical Sync Sequence with Retained Rollback, Revert-on-Failure, and Late Finalize

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-08-15 |
| **Deciders** | Program owner, routing maintainer |

### Context

Promotion moves the authored compiled-routing closure into the serving runtime. Without a check, a retained rollback, a promoted verify, and a revert path, a bad publication would stick and a prematurely discarded rollback would make exact recovery impossible.

### Decision

**We chose**: Run `compiled-route-sync.cjs --check` (read-only), then the canonical fleet promotion, retaining the reported rollback root. Run promoted `--verify`. Run parity, kill-switch, and representative route/bundle/defer/rollback probes. On any post-publish failure, run `--revert <rollback>` and stop. Run `--finalize <rollback>` only after every post-publish gate passes.

### Alternatives Considered

| Option | Benefit | Rejection Reason |
|--------|---------|------------------|
| Check, promote, verify, revert, late finalize | Safe, attributable publication | Chosen |
| Direct promote without check | Fast | No pre-flight trace; no rollback naming |
| Finalize immediately after promote | One step | Discards the safety net before verification |

### Consequences

Every publication is reversible until every gate passes; the rollback closure remains the canonical recovery surface throughout the phase.
<!-- /ANCHOR:adr-006 -->

---

<!-- ANCHOR:adr-007 -->
## ADR-007: The Canonical-Seven Status Assertion Is the Only Completion Trigger

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-08-15 |
| **Deciders** | Program owner, routing maintainer |

### Context

Status output can include temporary manifest-test and race fixtures that report green while a canonical hub is stale. A completion claim keyed to any green row would mask a real fleet gap.

### Decision

**We chose**: `compiled-route-status.cjs --all` must report the seven canonical hubs compiled-serving and fresh. Temporary manifest-test and race fixtures are recorded but explicitly excluded from the canonical-seven assertion and never substitute for a canonical hub.

### Alternatives Considered

| Option | Benefit | Rejection Reason |
|--------|---------|------------------|
| Canonical-only assertion | Honest 7/7 trigger | Chosen |
| Any-green assertion | Simple | False completion from fixtures |
| Prose-only status | No command | Not objective |

### Consequences

The only completion trigger is a machine-readable row set naming the seven canonical hubs, so no fixture can manufacture a green closeout.
<!-- /ANCHOR:adr-007 -->

---

<!-- ANCHOR:adr-008 -->
## ADR-008: Regenerate Metadata and Index State Through the Canonical Save Path

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-08-15 |
| **Deciders** | Program owner, spec-kit maintainer |

### Context

The isolated worktree lacks ignored generated runtimes and database dependencies, but the canonical save must still refresh metadata, parent pointers, and searchable index state before closeout.

### Decision

**We chose**: Bind the repository's existing generated runtime and dependencies into the worktree through temporary ignored links, then run `generate-context.js` for each child and the phase parents. Require successful metadata writes, record any daemon-owned index deferral explicitly, and remove every temporary runtime link before the final diff.

### Alternatives Considered

| Option | Benefit | Rejection Reason |
|--------|---------|------------------|
| Worktree-local canonical saves with the existing runtime bound | Refreshes the actual packet paths and shared index | Chosen |
| Skip metadata entirely | Fast | Leaves continuity and fingerprints stale |
| Hand-edit generated metadata | Easy | Breaks source fingerprints and index parity |

### Consequences

Continuity, fingerprints, and parent pointers derive from the final authored documents. Any daemon-owned index deferral remains explicit, and temporary runtime bindings never enter the diff.
<!-- /ANCHOR:adr-008 -->

---

<!-- ANCHOR:adr-009 -->
## ADR-009: Teach the system-deep-loop Compiler to Read the Root Router

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-08-15 |
| **Deciders** | Program owner, compiled-routing maintainer |

### Context

The generic replay layer already prefers root `ROUTER.md`, but the system-deep-loop rollout compiler still reads `shared/references/smart-routing.md` directly in its `sourceBytes()` helper. Removing the legacy file therefore makes only this hub fail before compilation even though its root contract and parent doctor pass and its machine fence is byte-identical. After that path is repaired, compilation reaches a second pre-existing drift: `assertNoCollapse()` still expects alignment to use runtime discriminator `review`, while the current registry deliberately declares `backendKind: alignment-convergence` and `runtimeLoopType: null` (commit `1578d8533e`).

### Decision

**We chose**: Change the authored system-deep-loop rollout `sourceBytes()` helper to read root `ROUTER.md` first and retain the legacy path only as a compatibility fallback. Keep the internal source-id key `smart-routing.md` so compiler serialization and downstream source-identity logic remain unchanged. Align the no-collapse assertion with the current registry: review remains `runtimeLoopType: review`; alignment remains a distinct `deep-alignment` packet with `backendKind: alignment-convergence` and no runtime discriminator. Do not edit registry semantics, frozen replay/scorer files, protected digests, or the promoted mirror directly; the canonical fleet sync owns mirror propagation.

### Alternatives Considered

| Option | Benefit | Rejection Reason |
|--------|---------|------------------|
| Root-first read with legacy fallback | Minimal compatibility repair; current and old snapshots compile | Chosen |
| Keep a duplicate legacy file | No compiler edit | Violates the one-router/dual-source contract |
| Rename compiler source ids | Cleaner naming | Expands serialized policy and fixture churn without routing value |
| Restore alignment's old `review` discriminator | Avoids assertion edit | Reverses the accepted alignment-convergence contract |
| Directly patch the promoted mirror | Immediate status change | Bypasses the approved canonical sync lane |

### Consequences

The authored compiler can rebuild system-deep-loop from the root document and current registry while retaining deterministic source-id semantics and distinct review/alignment identities. Its canary proves the root file and current backend contract are consumed; the later coherent fleet sync promotes the same compatibility changes.
<!-- /ANCHOR:adr-009 -->

---

<!-- ANCHOR:adr-010 -->
## ADR-010: Rebind sk-doc Flowchart Expectations to sk-create-diagram

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-08-15 |
| **Deciders** | Program owner, sk-doc routing maintainer |

### Context

The live sk-doc registry and hub router correctly removed `sk-create-flowchart`; its ASCII/markdown vocabulary and `/create:flowchart` alias now belong to `sk-create-diagram`. The hub-specific compiled supplement, one canary fixture, and one authored-source pin still name the retired packet, so the rebuild fails `MISSING_REFERENCED_MODE` before producing current artifacts.

### Decision

**We chose**: Replace the supplemental `quality-then-flowchart` rule with `quality-then-diagram`. Keep the canary prompt `/create:flowchart` as a legacy-alias probe, but require it to route to `sk-create-diagram` and its live packet resource. Replace the retired packet source pin with the current `sk-create-diagram/SKILL.md` digest. Change no live hub mode, alias, score weight, generic compiler, or frozen replay/scorer byte.

### Alternatives Considered

| Option | Benefit | Rejection Reason |
|--------|---------|------------------|
| Rebind expectations to sk-create-diagram | Tests the merged alias and current owner | Chosen |
| Recreate sk-create-flowchart | Old artifacts compile | Reverses the accepted deprecation |
| Delete the alias fixture | Less fixture work | Loses compatibility proof for `/create:flowchart` |
| Ignore the supplemental rule | Build proceeds only after removing coverage | Drops a measured ordered-bundle scenario |

### Consequences

The compiled sk-doc policy and canary reflect the live registry without reviving a removed packet. The route remains user-compatible because `/create:flowchart` still resolves through the merged diagram aliases.
<!-- /ANCHOR:adr-010 -->

---

<!-- ANCHOR:adr-011 -->
## ADR-011: Remove Retired Open Design Expectations from the sk-design Canary

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-08-15 |
| **Deciders** | Program owner, sk-design routing maintainer |

### Context

The live sk-design registry contains two modes after the Open Design transport retirement: interface and md-generator. Its owner rebuild succeeds with two destinations, one composition rule, and 61 manifest resources. The canary still asserts three destinations/rules, a 64-leaf count, and a removed `sk-design-mcp-open-design` transport fixture.

### Decision

**We chose**: Rebaseline the canary to the two live modes, one composition rule, and 61 manifest resources. Keep the retired transport prompt as a negative-compatibility probe and assert the current default-interface route rather than reviving the transport. Preserve the md-generator mutating role and the interface read-only actor role. Change no live registry, hub router, packet, or frozen scorer byte.

### Alternatives Considered

| Option | Benefit | Rejection Reason |
|--------|---------|------------------|
| Rebaseline to current two-mode contract | Canary tests live routing | Chosen |
| Restore Open Design transport | Old counts pass | Reverses accepted retirement |
| Delete the old prompt fixture | Fewer edits | Loses proof that the retired phrase no longer targets a dead packet |

### Consequences

The canary validates the current sk-design topology and explicitly proves that an old Open Design phrase cannot resurrect the deleted transport.
<!-- /ANCHOR:adr-011 -->

---

<!-- ANCHOR:adr-012 -->
## ADR-012: Rebaseline Authored Source Digests After Verified Routing Evolution

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-08-15 |
| **Deciders** | Program owner, canary maintainers |

### Context

After all owner rebuilds succeed, system-deep-loop and sk-prompt canaries stop only at hardcoded authored-source digest comparisons. The system-deep-loop changes are its root-router/version update and the accepted alignment-convergence registry. The sk-prompt changes are its root-router/version update plus already-committed evolution of the two packet skills. The protected replay/scorer trio still matches its frozen hashes exactly.

### Decision

**We chose**: Replace only the stale authored-source constants with the hashes printed by the rebuilt canaries: system-deep-loop `SKILL.md` and `mode-registry.json`; sk-prompt root `SKILL.md` and both packet `SKILL.md` values, leaving its unchanged hub-router and mode-registry pins intact. Rerun the complete canaries and require all protected digests, route-gold rows, rollback drills, and static gates green.

### Alternatives Considered

| Option | Benefit | Rejection Reason |
|--------|---------|------------------|
| Exact authored-digest rebaseline | Pins current verified inputs | Chosen |
| Remove authored digest checks | Less maintenance | Weakens drift detection |
| Revert current hub/packet sources | Old pins pass | Reverses accepted routing and packet work |
| Re-pin frozen scorer bytes | Broad reset | No frozen-byte drift exists |

### Consequences

Canaries retain strict authored-input drift detection at the current source identities without weakening or re-pinning the frozen evaluation substrate.
<!-- /ANCHOR:adr-012 -->

---

<!-- ANCHOR:adr-013 -->
## ADR-013: Canonicalize the Authored Specs Root Before Closure Tracing

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-08-16 |
| **Deciders** | Program owner, compiled-routing maintainer |

### Context

`.opencode/specs` is a symlink to canonical `specs/`. Node resolves required modules through the real path, while `compiled-route-sync.cjs` compares touched paths against the lexical symlink path. The authored check therefore reported success with zero closure files, and the same mismatch weakened detection of spec-tree reads.

### Decision

**We chose**: Resolve the authored specs root with `realpathSync` before deriving the program root, tracing, containment checks, and spec-read detection. Fail `--check` and promotion when the authored closure is empty. Keep the promoted runtime root and rollback protocol unchanged.

### Alternatives Considered

| Option | Benefit | Rejection Reason |
|--------|---------|------------------|
| Canonical realpath root plus non-empty gate | Correct containment for symlink and direct paths | Chosen |
| Disable Node realpath resolution | Keeps lexical paths | Global runtime behavior change and cache risk |
| Accept zero-file check | No code change | False-green preflight and unusable staging closure |

### Consequences

The check must enumerate the real authored closure, promotion copies actual program files, and promoted verification can reliably reject any read back into canonical `specs/`.
<!-- /ANCHOR:adr-013 -->
