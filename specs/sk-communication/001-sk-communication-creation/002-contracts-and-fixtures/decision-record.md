---
title: "Decision Record: Phase 002 Contracts and Fixtures"
description: "Accepted Phase 002 architecture: a self-contained fixture-first contract package with immutable originals."
trigger_phrases:
  - "contracts-and-fixtures"
  - "architecture decision"
  - "use a self-contained fixture-first contract package with immutable originals"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-communication/001-sk-communication-creation/002-contracts-and-fixtures"
    last_updated_at: "2026-08-11T15:21:48Z"
    last_updated_by: "codex"
    recent_action: "Accepted, implemented, and verified the Phase 002 architecture."
    next_safe_action: "Use the v1 package boundary in Phase 003."
    blockers: []
    key_files:
      - "decision-record.md"
      - "spec.md"
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-002-scaffold-20260811"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Phase purpose, boundary, dependencies, and handoff are defined."
---
# Decision Record: Phase 002 Contracts and Fixtures

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Use a self-contained fixture-first contract package with immutable originals

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-08-11 |
| **Deciders** | Project owner through the explicit implementation continuation; Codex implementation agent |

---

<!-- ANCHOR:adr-001-context -->
### Context

Define the versioned contracts and golden fixtures that every core, provider, and runtime adapter must share. The repository has no existing package workspace for this cross-CLI product. The design must therefore establish a testable package boundary, preserve canonical state, reproduce the reference's bounded-context and prompt controls, support exact-original fallback, and remain portable across six runtimes plus local and hosted providers.

### Constraints

- The visible projection must never become canonical transcript, tool data, or future model context.
- Unsupported, unsafe, ambiguous, or failed behavior must select an explicit degraded or exact-original outcome.
- The decision must remain testable with versioned fixtures and content-free evidence.
- Raw user context must stay bounded by explicit privacy, freshness, selection, and truncation rules.
- Prompt and inference controls must be versioned and mapped per provider rather than assumed from a shared wire format.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**Decision**: Use a self-contained fixture-first contract package with immutable originals.

**How it works**: Bootstrap `packages/cli-communication-projection/` with its own manifest, strict compiler config, build, type-check, test, and clean-install commands. Define event, bounded-context, prompt-profile, provider, privacy, projection, telemetry, evaluation, benchmark, and error contracts before implementing behavior. Store exact source bytes beside normalized views, and require every later component to return a decision without mutating the canonical record.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| Fixture-first versioned schemas | Cross-runtime determinism and early incompatibility detection | Up-front fixture work | 9/10 |
| Runtime-specific types first | Fast initial adapter coding | Six divergent contracts and expensive convergence | 4/10 |
| Loose unversioned objects | Minimal ceremony | Silent drift and weak reproducibility | 2/10 |

**Package boundary alternatives**:

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| Self-contained package under `packages/` | Independent build/test lifecycle, clean future publishing boundary, and no coupling to the root staging app | Introduces the repository's first package directory | 9/10 |
| Root application module | Reuses the existing manifest | Couples a portable CLI product to an unrelated Express staging application | 3/10 |
| Skill-local shared module | Near existing orchestration code | Conflates reusable product runtime with skill implementation and complicates distribution | 4/10 |

**Why this one**: The accepted design best preserves the immutable-state architecture while keeping failure behavior deterministic, portable, and directly testable.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:

- Cross-runtime behavior has one explicit, testable contract.
- Unsafe or unsupported conditions have a predictable fallback.
- The 1:1 communication mechanism is testable through bounded-context, prompt-profile, and reference-evaluation fixtures.

**What it costs**:

- The phase invests in a larger fixture corpus before visible runtime behavior. Mitigation: keep fixtures synthetic, small, and directly tied to downstream tests.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Captured behavior may age as CLIs evolve. | High | Record runtime and protocol versions, then refresh fixtures through the compatibility matrix. |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | Necessary? | PASS | Phase 001 identifies this boundary as required for the six-runtime goal. |
| 2 | Beyond local maxima? | PASS | Three materially different options were compared. |
| 3 | Sufficient? | PASS | The selected option is the smallest design that preserves canonical state and fallback. |
| 4 | Fits goal? | PASS | It directly supports portable, reference-like communication output. |
| 5 | Open horizons? | PASS | Versioned contracts and adapters allow provider and runtime evolution without core rewrites. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:

- `packages/cli-communication-projection/package.json`, `tsconfig.json`, and `vitest.config.ts`: Standalone build and test boundary.
- `packages/cli-communication-projection/src/contracts/`: Versioned event, context, prompt, provider, privacy, projection, telemetry, evaluation, benchmark, and error schemas plus validators.
- `packages/cli-communication-projection/test/fixtures/`: Six-runtime event, bounded-context, prompt-profile, reference-output, and byte-level golden corpus.
- `packages/cli-communication-projection/test/contracts/`: Package smoke, schema, compatibility, privacy, round-trip, and manifest tests.
- `packages/cli-communication-projection/src/versioning/`: Compatibility and migration rules.

**How to roll back**: Revert the contract package and fixture additions together; no production state or user transcript is migrated.

**Observed result**: The package implements all 11 contract families, 8 fixture files with 100 declared cases, exact-original recovery, and 30 passing contract tests. `npm run check` and package import smoke pass; the one-MiB validation benchmark recorded p95 1.680 ms against the provisional 10 ms budget.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->
