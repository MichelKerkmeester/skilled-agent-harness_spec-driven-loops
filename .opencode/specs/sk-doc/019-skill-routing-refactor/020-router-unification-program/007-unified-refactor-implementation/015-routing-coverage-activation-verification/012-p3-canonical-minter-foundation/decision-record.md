---
title: "Decision Record: P3 Canonical Manifest Minter Foundation"
description: "Architecture decisions for compiler reuse, canonical storage, exact freshness, and the boundary between manifest readiness and runtime serving."
trigger_phrases:
  - "canonical minter decisions"
  - "manifest freshness architecture"
importance_tier: "critical"
contextType: "decision"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-sk-doc-router-alignment/020-router-unification-program/007-unified-refactor-implementation/015-routing-coverage-activation-verification/012-p3-canonical-minter-foundation"
    last_updated_at: "2026-07-21T05:29:04Z"
    last_updated_by: "codex"
    recent_action: "Implemented the accepted compiler, storage, and readiness decisions"
    next_safe_action: "Keep later serving and refresh decisions in their deferred packets"
    blockers:
      - "No implementation blockers remain; later serving changes stay explicitly deferred."
    key_files:
      - "decision-record.md"
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-21-canonical-minter-spec"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "A future ADR must assign refresh and data-driven serving ownership."
    answered_questions:
      - "Initial mint is legacy-authority, create-if-absent, and generation 1."
---
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
# Decision Record: P3 Canonical Manifest Minter Foundation

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Wrap the Existing Generic 006 Compiler

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-21 |
| **Deciders** | Router unification program |

<!-- ANCHOR:adr-001-context -->
### Context

The 006 `001-sk-code` registry compiler is located in a hub-specific rollout folder, but its `compileRegistry()` function accepts the registry, hub router, hub Markdown, exact source bytes, and generation as parameters. It does not require the hub ID to be `sk-code`. The associated build harness is not reusable because it binds the skill root and rollout output directory to one existing hub.

### Constraints

- create-skill emits the registry-driven parent shape that this compiler accepts.
- The implementation may not invent another route-selection or policy-hash algorithm.
- Runtime code may not import from `.opencode/specs`.
<!-- /ANCHOR:adr-001-context -->

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Add a thin stable adapter that imports the promoted 006 `compileRegistry()` function unchanged.

**How it works**: The adapter validates and loads final create-skill router inputs, then supplies them to `compileRegistry()` with the required generation. The adapter owns path safety, V1 manifest serialization, atomic creation, and result formatting, but it does not own routing policy construction.
<!-- /ANCHOR:adr-001-decision -->

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Thin adapter over 006 compiler** | Minimal new logic; identical policy hash authority | Temporarily depends on a compiler in the `001-sk-code` child path | 9/10 |
| Generalize and relocate all seven compilers first | Cleaner directory ownership | Large refactor with seven archetypes and unnecessary routing risk | 4/10 |
| Reimplement compilation in create-skill | Local convenience | Violates the shared-authority requirement and can drift | 0/10 |

**Why this one**: The generic function already exists and matches the generated parent shape. A stable adapter hides its current location from create-skill and keeps the implementation small.
<!-- /ANCHOR:adr-001-alternatives -->

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:

- One deterministic compiler owns both initial mint and freshness recomputation.
- create-skill consumes a stable contract instead of a rollout-child implementation path.

**What it costs**:

- The shared adapter depends on a generic function stored under `001-sk-code`. Mitigation: keep that dependency private and relocate only if another generic consumer makes the move worthwhile.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Future specialization of the compiler breaks generic inputs | H | Contract-test the generated parent fixture and halt instead of adding a second compiler. |
<!-- /ANCHOR:adr-001-consequences -->

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Packet 013 cannot mint a truthful manifest today. |
| 2 | **Beyond Local Maxima?** | PASS | Compiler relocation and local reimplementation were compared. |
| 3 | **Sufficient?** | PASS | The adapter adds only path, artifact, and freshness responsibilities. |
| 4 | **Fits Goal?** | PASS | It directly supplies the missing P3 consumer interface. |
| 5 | **Open Horizons?** | PASS | The public adapter survives a later internal compiler relocation. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:

- Add `.opencode/bin/lib/compiled-route-manifest.cjs` as the shared adapter.
- Import the promoted `006-parent-hub-rollout/001-sk-code/lib/registry-compiler.cjs::compileRegistry` unchanged.

**How to roll back**: Remove the adapter and CLI. No current routing path imports them, so existing serving behavior remains intact.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Use One Canonical Runtime Manifest and Exact Hash Freshness

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-21 |
| **Deciders** | Router unification program |

<!-- ANCHOR:adr-002-context -->
### Context

The promoted status foundation reads manifests from the runtime activation root. It exposes a SHA-256 fingerprint of manifest bytes, but that fingerprint says only which artifact was read. It does not prove that the artifact reflects current router inputs. Runtime sync also replaces the entire promoted root, which would erase an independently minted new-hub manifest.

### Constraints

- There must be one canonical manifest location returned to create-skill.
- Freshness must be deterministic and independent of timestamps.
- A runtime sync cannot silently discard or rewrite the manifest.
<!-- /ANCHOR:adr-002-context -->

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: Store the manifest at the existing promoted activation path and define freshness as exact selected-policy equality with a new compile of current final inputs.

**How it works**: The predicate validates the V1 shape, recompiles at the selected generation, and compares `effectivePolicyHash` and generation. Sync captures valid legacy-authority manifests for hubs outside the fixed seven before root replacement and restores the exact bytes after rebuilding the closure.
<!-- /ANCHOR:adr-002-decision -->

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Existing activation store plus sync preservation** | One canonical path; compatible with status | Requires narrow preservation logic in sync | 9/10 |
| Separate create-skill manifest store | Avoids sync deletion | Creates two authorities and later migration work | 3/10 |
| Manifest fingerprint means fresh | No compile cost | Does not detect input drift | 1/10 |
| Store source hashes in a new manifest schema | Cheap freshness check | Schema expansion and a second hash authority | 5/10 |

**Why this one**: It reuses the current store and compiler while detecting the failure that matters: current inputs no longer compile to the selected policy.
<!-- /ANCHOR:adr-002-alternatives -->

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:

- `fresh` has one testable meaning across mint, status, and create-skill.
- Canonical manifest bytes survive normal runtime synchronization.

**What it costs**:

- Freshness performs a compile. Mitigation: create-skill and status checks are control-plane operations, not per-route hot-path calls.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Sync preserves an unsafe entry | H | Validate hub name, containment, V1 shape, legacy authority, and destination conflict before restore. |
<!-- /ANCHOR:adr-002-consequences -->

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The current status fingerprint does not detect changed inputs. |
| 2 | **Beyond Local Maxima?** | PASS | Separate store and schema expansion were considered. |
| 3 | **Sufficient?** | PASS | One compile and equality comparison prove the selected policy is current. |
| 4 | **Fits Goal?** | PASS | Packet 013 receives one canonical path and one predicate. |
| 5 | **Open Horizons?** | PASS | Later eligibility can consume the same predicate without changing its meaning. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**:

- Add exact freshness to the shared module and status record.
- Add safe capture/restore helpers around runtime sync root replacement.

**How to roll back**: Remove the additive status fields and sync preservation helpers. Existing fixed-hub manifests continue to come from the current promoted closure.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: Manifest-Ready Does Not Mean Runtime-Serving

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-21 |
| **Deciders** | Router unification program |

<!-- ANCHOR:adr-003-context -->
### Context

The engine and advisor still use fixed seven-hub structures, while the P4 controller advances existing hubs through `DEFAULT_ON_HUBS`. Removing those fixed structures is broader ADR-002 future work. A new hub can therefore own a valid fresh manifest without being discoverable or eligible for compiled serving.

### Constraints

- This phase must not remove allowlists or add a default-on cohort member.
- The minter must not alter resolver decisions.
- create-skill must report a truthful state.
<!-- /ANCHOR:adr-003-context -->

<!-- ANCHOR:adr-003-decision -->
### Decision

**We chose**: Define the result as `manifest-ready` and keep runtime-serving as a separate future state.

**How it works**: Initial mint always writes `servingAuthority: legacy` and `shadowOnly: true`. Status may discover and inspect the manifest, but the resolver, engine dispatch map, advisor eligibility set, and default-on cohort remain unchanged. A stale or invalid manifest prevents create-skill from claiming `ready`.
<!-- /ANCHOR:adr-003-decision -->

<!-- ANCHOR:adr-003-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Separate manifest-ready and runtime-serving** | Truthful; minimal; safe | Requires a later discovery phase | 10/10 |
| Remove both allowlists now | Completes dynamic onboarding | Expands scope into serving and fallback architecture | 2/10 |
| Treat a fresh manifest as immediately serving | Simple label | False under current engine and advisor maps | 0/10 |

**Why this one**: It unblocks the artifact contract without pretending the separate runtime-discovery problem is solved.
<!-- /ANCHOR:adr-003-alternatives -->

<!-- ANCHOR:adr-003-consequences -->
### Consequences

**What improves**:

- create-skill can prove the manifest exists and is current.
- Byte-identical safety holds because no routing authority changes.

**What it costs**:

- A fresh new-hub manifest remains inert. Mitigation: name data-driven discovery and allowlist removal as explicit future work.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A consumer collapses the two states | H | Use distinct fields and negative tests proving the legacy sentinel remains. |
<!-- /ANCHOR:adr-003-consequences -->

<!-- ANCHOR:adr-003-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Current fixed maps make the distinction factual. |
| 2 | **Beyond Local Maxima?** | PASS | Immediate allowlist removal was evaluated and rejected for scope. |
| 3 | **Sufficient?** | PASS | The distinction supplies the exact create-skill dependency. |
| 4 | **Fits Goal?** | PASS | It preserves minimal scope and routing safety. |
| 5 | **Open Horizons?** | PASS | Future runtime discovery can promote the state without changing mint semantics. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-003-five-checks -->

<!-- ANCHOR:adr-003-impl -->
### Implementation

**What changes**:

- Return manifest validity/freshness separately from serving status.
- Add tests that a newly minted hub remains on the legacy sentinel.

**How to roll back**: Remove the new contract. No runtime cohort or authority value needs reversal.
<!-- /ANCHOR:adr-003-impl -->
<!-- /ANCHOR:adr-003 -->
