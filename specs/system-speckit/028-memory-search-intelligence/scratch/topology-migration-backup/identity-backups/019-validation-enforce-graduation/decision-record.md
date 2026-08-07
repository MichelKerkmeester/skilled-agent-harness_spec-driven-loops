---
title: "Decision Record: Validation Advisory-to-Enforce Graduation — Status Cross-Doc, Metadata Disk-Path, Child Drift"
description: "Three ADRs: reuse the existing grandfather backfill-then-flip pattern instead of a new mechanism, sequence the three flips least-risky-first, and build the child-drift dist-presence guard by extending the existing dist-freshness.cjs registry rather than a bespoke checker."
trigger_phrases:
  - "validation enforce graduation decisions"
  - "grandfather pattern reuse decision"
  - "least risky first sequencing decision"
  - "dist presence guard reuse decision"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/019-validation-enforce-graduation"
    last_updated_at: "2026-07-10T07:22:00.000Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Confirmed all 3 ADRs in practice"
    next_safe_action: "Packet 019 closed — proceed to packet 023 (self-healing model consolidation)"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/scripts/rules/check-status-cross-doc-consistency.sh"
      - ".opencode/skills/system-spec-kit/scripts/rules/check-metadata-disk-consistency.sh"
      - ".opencode/skills/system-spec-kit/scripts/rules/check-graph-metadata-child-drift.sh"
      - ".opencode/skills/system-spec-kit/scripts/lib/dist-freshness.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase3-019-validation-enforce-graduation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
# Decision Record: Validation Advisory-to-Enforce Graduation — Status Cross-Doc, Metadata Disk-Path, Child Drift

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Reuse the Existing Grandfather Backfill-Then-Flip Pattern

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-09 |
| **Deciders** | Planning session (per task-scope instruction) |

---

<!-- ANCHOR:adr-001-context -->
### Context

Three validation rules need to move from advisory-only to enforcing-by-default. This repo already solved the identically-shaped problem once: `SPECKIT_GENERATED_METADATA_GRANDFATHER` (`mcp_server/lib/config/capability-flags.ts:77-103`) ships default-OFF-enforcing today, having been "graduated on a measured benchmark" after "the scoped migration restamped the legacy description.json and graph-metadata.json files" (doc-comment, `:79-80`) — backfill every violation to zero, then flip the default so an unset environment now enforces.

### Constraints

- Must not introduce a second graduation vocabulary/mechanism alongside the existing one.
- Must produce evidence (a violation count, before and after) rather than a bare completion claim.
- Each of the three flags is independently owned by its own rule script; a shared mechanism must not couple them.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Apply the grandfather pattern's shape — reconcile every violation to zero, verify zero via a tree-wide advisory-mode census, then flip the default — to all three flags, without building a shared graduation library or changing the pattern itself.

**How it works**: Each phase gets its own disposable census script invocation (parameterized by rule name and env var), not a shared permanent "graduation harness." This matches how the precedent itself was executed and how `008-metadata-rename-reconciliation` and `015-validation-hardening-fixes` each ran their own one-off repo-wide reconciliation passes.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Reuse the grandfather shape** | Proven in this exact repo; reviewers already know the pattern; no new vocabulary | Requires a census per flag, not a single unified sweep | 9/10 |
| Build a generic "flag graduation harness" | Would generalize the pattern for future flags too | Unjustified novelty for three flags; risks becoming permanent infrastructure for a one-time operation | 4/10 |
| Flip all three flags immediately, backfill reactively | Fastest to "done" | Directly contradicts the task's own explicit graduation requirement; would make `--strict` fail on unreconciled folders immediately | 1/10 |

**Why this one**: The task's own scope explicitly names this pattern as "proven" and instructs applying it "to all three." Reusing it verbatim is both the lowest-risk and most literal reading of the requirement.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Reviewers and future maintainers recognize the shape immediately from the precedent.
- Each phase's evidence trail (before/after census counts) is directly comparable to 008's and the grandfather flag's own disclosed numbers.

**What it costs**:
- Three separate census runs instead of one unified sweep. Mitigation: the census driver is parameterized by rule name, so it is one script reused three times, not three separate implementations.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Census driver itself has a bug that undercounts violations | H | Unit-test the driver against a synthetic fixture with known mismatches before trusting it against the real tree (T004) |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Three rules already detect real drift today but cannot fail validation; the task's own scope names this as the required fix |
| 2 | **Beyond Local Maxima?** | PASS | A generic graduation harness and an immediate-flip-then-fix-reactively approach were both explicitly considered and rejected (see Alternatives) |
| 3 | **Sufficient?** | PASS | Reusing the existing pattern verbatim is the simplest approach that satisfies the requirement; no simpler option exists that still produces before/after evidence |
| 4 | **Fits Goal?** | PASS | Directly on the critical path — the task's stated deliverable is exactly this graduation |
| 5 | **Open Horizons?** | PASS | The pattern is already the repo's long-term convention (used by `SPECKIT_GENERATED_METADATA_GRANDFATHER`); this is not a one-off shortcut |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- The three rule scripts' `capability-flags.ts`-resolved defaults (unmodified detection logic).
- `ENV_REFERENCE.md`'s documentation for all three flags.

**How to roll back**: Revert the single-flag default change; the census/backfill work (spec-doc corrections, regenerated JSON) is not undone since it is independently correct regardless of the flag's state.

**Confirmed in practice**: Phase 1 (128→2 residual, commit 3dceda7760) and Phase 2 (1,130→74 residual, commit 7544197691) both shipped exactly this shape. One correction found during implementation: all three flags actually resolve through inline bash default-expansion in their own rule scripts, not `capability-flags.ts` (zero references found there) — the pattern itself held, only the specific file target named in this ADR's own "What changes" needed fixing.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Sequence the Three Flips Least-Risky-First

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-09 |
| **Deciders** | Planning session (per task-scope instruction) |

---

<!-- ANCHOR:adr-002-context -->
### Context

The three flags differ meaningfully in blast radius and failure mode. `STATUS_CROSS_DOC_ENFORCE` is pure shell-side status-string classification with no external dependency. `METADATA_DISK_CONSISTENCY_ENFORCE` depends on a Node helper but has no fail-closed-on-unavailability branch. `CHILD_DRIFT_ENFORCE` is the only one of the three whose enforce mode fails closed when its scanner dependency is unavailable — a real, not hypothetical, risk given this session's own native-ABI/dist-availability breakage.

### Constraints

- Each phase's flip is committed independently, so ordering has no technical forcing function — this is a risk-management decision, not a code dependency.
- The task's own scope text states the ordering explicitly and gives the reasoning for each step.
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: Land the three graduations in this order: (1) `STATUS_CROSS_DOC_ENFORCE`, (2) `METADATA_DISK_CONSISTENCY_ENFORCE`, (3) `CHILD_DRIFT_ENFORCE` — never the reverse or interleaved.

**How it works**: Each earlier phase's successful flip is evidence the backfill-then-flip shape works cleanly in this repo before the riskier phases are attempted. Phase 3 additionally requires a new dist-presence guard (ADR-003) before its own flip, making it correctly the longest and last phase regardless of any other ordering consideration.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Least-risky-first** | De-risks the pattern before the highest-blast-radius flip; matches the task's own explicit rationale | Slower to reach the child-drift protection | 9/10 |
| Highest-value-first (child drift) | Delivers the most-wanted protection soonest | Attempts the riskiest, fail-closed-prone flip first, before the pattern is proven in this repo at all | 3/10 |
| Parallel (all three at once) | Fastest wall-clock | Three simultaneous repo-wide behavior changes make isolating a regression's cause much harder | 2/10 |

**Why this one**: Directly matches the task's own explicit, reasoned ordering instruction, and is independently justifiable on risk-management grounds alone.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:
- A regression in Phase 3 is trivially attributable, since Phases 1-2 are already independently verified and committed by the time Phase 3 starts.

**What it costs**:
- None significant. Sequencing costs calendar time, not correctness, since the phases are technically independent.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Sequencing pressure to "just do all three at once" for speed | M | This ADR and the task's own scope text both record the ordering rationale explicitly, making a deviation visible and requiring justification |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Ordering directly manages the realized-once-already dist-availability risk on Phase 3 |
| 2 | **Beyond Local Maxima?** | PASS | Highest-value-first and parallel orderings were both evaluated and scored lower (see Alternatives) |
| 3 | **Sufficient?** | PASS | A simple sequential order is enough; no additional coordination machinery is needed since phases are independently committed |
| 4 | **Fits Goal?** | PASS | Matches the task's own explicit ordering instruction verbatim |
| 5 | **Open Horizons?** | PASS | Establishes a repeatable risk-ordering convention for any future flag-graduation packet in this repo |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**:
- `plan.md`'s phase ordering, `tasks.md`'s milestone structure.

**How to roll back**: N/A — this is a process decision, not a code change.

**Confirmed in practice**: Phases 1-2 landed and were independently verified before Phase 3's own guard work began, exactly as designed — each phase's own commit is cleanly attributable and independently revertable.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: Build the Child-Drift Dist-Presence Guard by Extending `dist-freshness.cjs`

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-09 |
| **Deciders** | Planning session |

---

<!-- ANCHOR:adr-003-context -->
### Context

`check-graph-metadata-child-drift.sh`'s enforce mode fails closed (`:99-107`) only when the scanner dependency (`scripts/dist/spec/is-phase-parent.js`) is totally unavailable (import throws, rc=20) or the graph JSON is unreadable (rc=21). It has no freshness dimension: a dist that loads without throwing but implements stale child-detection logic is indistinguishable from a fresh one today. Separately, `dist-freshness.cjs` already implements exactly this kind of source-vs-dist staleness detection for other packages, including a `system-spec-kit/scripts` package entry whose source candidates already cover `scripts/spec/is-phase-parent.ts`, but whose only registered dist entry (`dist/tsconfig.tsbuildinfo`) does not point at this specific file.

### Constraints

- Must not weaken the existing rc=20/21 fail-closed behavior, only add a new, earlier check.
- Must not add meaningful overhead to every `validate.sh` run.
- Task instruction requires the guard to exist and be proven before the flip, not as a follow-up.
<!-- /ANCHOR:adr-003-context -->

---

<!-- ANCHOR:adr-003-decision -->
### Decision

**We chose**: Add a named `is-phase-parent` entry to `dist-freshness.cjs`'s existing `system-spec-kit/scripts` package registry, and call it from `check-graph-metadata-child-drift.sh` ahead of the scanner import, reusing the already-load-bearing `STALE_EXIT_CODE=69` convention `validate.sh`'s own orchestrator dispatch uses for a different package (`scripts/spec/validate.sh:993-1011`).

**How it works**: The new entry follows the exact shape already used for `'validation-orchestrator'` and `'spec-memory-cli'` — a named `distEntries` key plus a matching `entrySourceCandidates` list, no new top-level package. The guard call sits in the rule script itself, not a global `validate.sh` preamble change, so it only ever runs when the child-drift rule itself runs.
<!-- /ANCHOR:adr-003-decision -->

---

<!-- ANCHOR:adr-003-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Extend `dist-freshness.cjs`'s existing registry** | Reuses proven, already-tested staleness logic; consistent with how the orchestrator's own freshness check works | Requires the rule script to shell out to a Node helper it did not previously call directly | 9/10 |
| Bespoke mtime-comparison check inline in the bash rule | No new Node dependency in the bash script's own execution | Duplicates staleness-detection logic `dist-freshness.cjs` already gets right; a second, divergent implementation is the same maintenance hazard as F9 in `015-validation-hardening-fixes` | 4/10 |
| A global `validate.sh` preamble check for all watched packages | Catches staleness once for every rule that might need it | Broader blast radius than this one rule needs; slows every `validate.sh` invocation even for folders that never reach the child-drift rule | 3/10 |

**Why this one**: Reuses existing, proven infrastructure with a minimal, rule-scoped integration point, and directly satisfies the task's explicit requirement for a build-freshness guard before the flip.
<!-- /ANCHOR:adr-003-alternatives -->

---

<!-- ANCHOR:adr-003-consequences -->
### Consequences

**What improves**:
- No new staleness-detection algorithm to maintain; the guard's behavior is provable against the same fixture matrix `dist-freshness.cjs`'s other package entries could in principle be tested against.

**What it costs**:
- The rule script now has a runtime dependency on `dist-freshness.cjs` it did not have before. Mitigation: `check-metadata-disk-consistency.sh` already establishes this exact precedent (calling its own Node helper from bash), so this is not a novel coupling pattern for this file set.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| The guard itself becomes unavailable (e.g. `dist-freshness.cjs` is deleted or broken) | M | The guard call fails closed the same defensive way the existing scanner import already does under enforce |
| Guard adds latency to every `validate.sh --strict` run that reaches the child-drift rule | L | `dist-freshness.cjs` already has a fast-path cached-hash comparison for the fresh case; only a stale/missing dist pays the full recompute cost |
<!-- /ANCHOR:adr-003-consequences -->

---

<!-- ANCHOR:adr-003-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The rule's enforce mode fails closed on scanner unavailability today with no freshness dimension; this is a real, session-realized risk class for unrelated dists |
| 2 | **Beyond Local Maxima?** | PASS | A bespoke inline check and a global preamble check were both evaluated and scored lower (see Alternatives) |
| 3 | **Sufficient?** | PASS | Extending one existing registry entry is the smallest change that closes the gap; no new algorithm required |
| 4 | **Fits Goal?** | PASS | Directly required by REQ-004's P0 acceptance criterion in spec.md before Phase 3's flip is allowed |
| 5 | **Open Horizons?** | PASS | The same `dist-freshness.cjs` extension pattern is reusable for any future rule that gains a build-dependent fail-closed branch |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-003-five-checks -->

---

<!-- ANCHOR:adr-003-impl -->
### Implementation

**What changes**:
- `scripts/lib/dist-freshness.cjs`: new named `distEntries`/`entrySourceCandidates` entry.
- `scripts/rules/check-graph-metadata-child-drift.sh`: new guard call ahead of the scanner import.
- `scripts/tests/check-graph-metadata-child-drift.sh`: new fixture-matrix coverage.

**How to roll back**: Remove the guard call (revert to the pre-Phase-3 rc=20/21-only branch) and the new `distEntries` key; the underlying rule's drift-detection logic is untouched either way.

**Confirmed in practice, with one refinement beyond the original design**: the new `is-phase-parent` entry's `entrySourceCandidates` was scoped to just `is-phase-parent.ts` (plus manifest files) rather than inheriting the `system-spec-kit/scripts` package's whole-tree `sourceCandidates: ['.']` default. `is-phase-parent.ts` imports only Node builtins (`fs`, `path`) with zero local project dependencies, so this scoping is safe and has a real, observed benefit this ADR's original context did not anticipate: this repo runs many concurrent AI sessions editing files across `scripts/` simultaneously, and a whole-tree hash comparison would report false staleness on every unrelated edit anywhere in the package — confirmed directly during this same implementation, when the *unscoped* `system-spec-kit/mcp_server` "default" entry kept reporting stale during Phase 1-2's work due to concurrent, unrelated edits elsewhere in that package. The scoped entry was fixture-tested (missing/stale/fresh dist × enforce on/off, 4 load-bearing cells) and confirmed immune to that exact failure mode.
<!-- /ANCHOR:adr-003-impl -->
<!-- /ANCHOR:adr-003 -->

---

<!--
Level 3 Decision Record
Document significant technical decisions
One ADR per major decision
-->
