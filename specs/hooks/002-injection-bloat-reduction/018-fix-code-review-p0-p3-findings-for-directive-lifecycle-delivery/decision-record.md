---
title: "Decision Record: Directive-Lifecycle Remediation Architecture"
description: "Choose the correctness, security, evidence, and rollback architecture for resolving the directive-lifecycle review findings."
status: "accepted"
completion_pct: 95
trigger_phrases:
  - "directive lifecycle remediation decision"
  - "lifecycle epoch high-water architecture"
  - "always-full rollback"
importance_tier: "high"
contextType: "decision"
parent: "../spec.md"
_memory:
  continuity:
    packet_pointer: "hooks/002-injection-bloat-reduction/018-fix-code-review-p0-p3-findings-for-directive-lifecycle-delivery"
    last_updated_at: "2026-08-11T19:57:46Z"
    last_updated_by: "codex"
    recent_action: "Implemented Option A and verified its focused and whole-gate behavior"
    next_safe_action: "Confirm the accepted decision through fresh deep review and final metadata validation"
    blockers:
      - "Fresh implementation review remains"
    key_files:
      - "spec.md"
      - "plan.md"
      - ".opencode/skills/system-skill-advisor/hooks/lib/directive-lifecycle.ts"
    session_dedup:
      fingerprint: "sha256:b4771c09877fcb80078b41ec21ba8c7bd7bef99c5e95dc803cf92c2642332d59"
      session_id: "2026-08-11-directive-lifecycle-review-planning"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions:
      - "Use Option A; retain Option C as immediate rollback"
---
# Decision Record: Directive-Lifecycle Remediation Architecture

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Use Host-Wired Epochs, Store-Wide Invalidation, Transcript High-Water State, Hardened Storage, and Typed Evidence

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted and implemented; fresh review pending |
| **Date** | 2026-08-11 |
| **Deciders** | Operator and implementation owner |
| **Rollback** | Always-full delivery through existing kill-switches |

---

<!-- ANCHOR:adr-001-context -->
### Context

The existing lifecycle rule suppresses constant directives after a first full delivery. Its transcript watermark updates only on full turns, so ordinary growth followed by compaction can remain above the stale watermark and suppress the first post-compaction directive block. Repeated unknown stats can also suppress without proof that history survived. Production prompt payloads do not consistently carry the synthetic lifecycle fields used by focused tests, and a host boundary without usable session identity cannot safely update only a per-session epoch.

The file-backed store sits on a security boundary because its contents decide whether guardrail text may be omitted. It must not follow links, escape its owned root, accept malformed or injected records, or leave unbounded temp residue. The OpenCode mirror must use the same confirmation rules as the canonical TypeScript decision.

The verification system also needs a truthful boundary. Unit, adapter, registered-path, and native-host evidence prove different things. Existing records blur those classes and cite temporary artifacts, while Cursor host delivery remains unconfirmed.

### Constraints

- Any uncertainty must deliver the full directive block.
- Discovery symlinks are intentional inventory and must remain intact.
- Historical benchmark folders are immutable; corrections append new records and supersession metadata.
- No new dependency is preferred; any dependency proposal requires separate approval and license/security review.
- Formal completion priorities remain P0/P1/P2. P3 is a non-gating residual-risk register.
- The current dirty checkout requires a durable, attributable baseline before implementation.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: an explicit host-wired lifecycle epoch plus a store-wide invalidation generation and transcript high-water state, a race-safe no-follow store, conflict-aware identity confirmation, typed evidence classes, and an immutable whole-gate baseline.

**How it works**: Registered session-start/resume/compact adapters advance a monotonic per-session epoch through one canonical reset entry point. An event without usable session identity increments a store-wide generation; every session record stores the generation it last observed. Prompt delivery suppresses only when identity is unambiguous, directive content and path are unchanged, the epoch and store generation match, and the current transcript stat is known at or above the stored high-water mark; known growth updates the high-water state even on route-only turns. Store IO uses directory-handle-anchored operations or equivalent post-open inode and ancestry verification, and platforms that cannot prove race-safe containment disable durable suppression. Report producers reject PASS records whose evidence is temporary, missing, unhashed, or stronger than its evidence class.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **A. Explicit epoch + high-water + hardened store + typed evidence** | Fixes the observed lifecycle bug, makes uncertainty fail open, secures the state boundary, and restores truthful cross-runtime evidence | Touches several runtime lifecycle adapters and requires broad matrix verification | 9/10 |
| **B. Patch the shrink heuristic only** | Small code diff and limited test changes | Still depends on prompt payload/stat availability, leaves resume/reset gaps, store security, ambiguous identity, and evidence overclaiming unresolved | 4/10 |
| **C. Disable dedup and deliver full directives always** | Safest immediate behavior, simplest rollback, no stale suppression | Restores the original repeated token/UI cost and does not repair evidence or packet truth | 7/10 as rollback, 3/10 as final state |

**Why this one**: Option A is the smallest complete fix for the full finding class. Option B treats one symptom. Option C remains the immediate containment path if implementation or verification fails.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Post-compaction and post-resume delivery no longer depends on a stale first-turn watermark.
- Unknown stats and ambiguous identities cannot authorize suppression.
- Local filesystem manipulation cannot silently create trusted suppression state.
- Every benchmark verdict states exactly what execution boundary it proves.
- Parent/phase continuity becomes a reliable current-state source again.

**What it costs**:
- Route-only turns may require a bounded high-water state write. Mitigation: measure p50/p95/p99 and keep writes atomic and minimal.
- Runtime adapters share an epoch contract. Mitigation: one schema, one reset entry point, contract-vector tests, and fail-open version mismatch.
- Native-host proof may remain unavailable for some runtimes. Mitigation: record `UNCONFIRMED` or SKIP rather than promoting adapter evidence.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Epoch/reset race with a prompt subprocess | High | Monotonic version/epoch/store-generation compare; ambiguity delivers full; cross-process race tests |
| Platform gaps in race-safe no-follow/owner checks | High | Capability detection; unsupported proof disables durable suppression, blocks security PASS, and delivers full |
| JavaScript mirror drift | Medium | Shared decision vectors now; compiled-core unification tracked by RR-001 |
| Hot-path latency regression | Medium | Baseline and post-change p50/p95/p99; bounded cleanup and state size |
| Historical evidence becomes confusing | Medium | Immutable old folders plus a current supersession manifest and index status |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The source review and baseline negative controls preserved the growth/compaction, unknown-stat, identity, and unsafe-topology failures; final negative controls pass. |
| 2 | **Beyond Local Maxima?** | PASS | Heuristic-only and always-full alternatives were compared explicitly. |
| 3 | **Sufficient?** | PASS | The chosen option covers correctness, security, evidence, tests, and repository truth without changing unrelated shadow policy. |
| 4 | **Fits Goal?** | PASS | It fixes every finding in the current P0-P3 review scope. |
| 5 | **Open Horizons?** | PASS | Versioned records, evidence classes, and contract vectors allow future runtime migration without weakening fail-open behavior. |

**Checks Summary**: 5/5 PASS against implementation evidence; fresh review remains the final acceptance gate.
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- Canonical lifecycle record and decision gain session-epoch, store-generation, high-water, and hardened race-safe IO invariants.
- Registered runtime lifecycle producers advance the epoch.
- OpenCode uses conflict-aware identity confirmation and contract vectors.
- Scenario/report producers enforce evidence taxonomy and durable provenance.
- Phases 014-018 and parent metadata are reconciled after observed gates.

**How to roll back**: Set `SPECKIT_DIRECTIVE_LIFECYCLE_DEDUP=0` for Claude/Codex/Cursor/Devin/OpenCode and `SPECKIT_PI_DIRECTIVE_DEDUP=0` for Pi, which restores always-full delivery. If a code rollback is needed, revert only the phase 018 implementation diff while preserving appended evidence/supersession records and the discovery symlinks. Rebuild both owning packages and rerun the registered-path smoke matrix before restoring default-on behavior.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->
