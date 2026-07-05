---
title: "Decision Record: Public Redirect And Replacement Context Contracts"
description: "Architecture decision for closing the standalone deep-context public route before discoverability and runtime cleanup."
trigger_phrases:
  - "deep-context redirect decision"
  - "fail closed standalone context"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/035-deprecate-deep-context-integrate-capabilities/002-public-redirect-and-replacement-contracts"
    last_updated_at: "2026-07-04T17:50:32Z"
    last_updated_by: "opencode"
    recent_action: "Validated fail-closed redirect decision"
    next_safe_action: "Use phase 003/004 outputs for discoverability and runtime cleanup evidence"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-04-phase-002-decision"
      parent_session_id: "2026-07-04-phase-002-contract-authoring"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Public route should close before registry/discoverability cleanup."
      - "Maintained command source authority was resolved and validated."
---
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
# Decision Record: Public Redirect And Replacement Context Contracts

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Fail Closed Before Discoverability Cleanup

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-04 |
| **Deciders** | User, OpenCode assistant |

---

<!-- ANCHOR:adr-001-context -->
### Context

Standalone `deep-context` still has enough active assets to start or describe a legacy context loop. If discoverability is removed first, hidden entrypoints and generated contracts can still drift. If the nested packet is deleted first, replacement behavior and tests are not ready.

The compiled contract source authority was validated against `.opencode/commands/deep/context.md`, the legacy body, presentation text, and generated contract assets before downstream cleanup proceeded.

### Constraints

- Generated command contracts must be regenerated through `.opencode/skills/deep-loop-runtime/scripts/compile-command-contracts.cjs` or the current equivalent, not hand-edited.
- `@context` remains a separate one-shot retrieval agent.
- Existing context artifacts remain readable until phase 004 decides fixture, benchmark, and archive handling.
- Runtime branch removal waits for phase 004 tests.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: close the public standalone route with fail-closed replacement guidance before registry, advisor, fixture, benchmark, or runtime cleanup.

**How it works**: phase 002 resolves command source authority, adds bounded context snapshot rules to research/review, and changes the command/YAML path so new `/deep:context` invocations stop before legacy dispatch. Phase 003 then removes discoverability, and phase 004 handles fixtures, benchmarks, nested packet archiving, and optional runtime branch cleanup.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Fail-closed redirect first** | Prevents new legacy runs while preserving recovery choices | Leaves some discoverability references until phase 003 | 9/10 |
| Remove registry/advisor first | Reduces search visibility quickly | Hidden command/YAML paths can still run | 5/10 |
| Delete nested packet and runtime branches now | Fastest visible cleanup | High regression risk and loses fixture evidence before replacements are verified | 3/10 |
| Keep `/deep:context` as an alias to `/deep:research` | Smooth user transition | Misroutes quick codebase lookup and changes semantics silently | 4/10 |

**Why this one**: the fail-closed redirect is the smallest safe behavioral change and creates a clear handoff to later cleanup phases.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- New users cannot start a deprecated standalone context loop by accident.
- Replacement guidance is explicit and preserves `@context` for quick codebase lookup.
- Later cleanup phases can remove discoverability after behavior is already safe.

**What it costs**:
- Discoverability references may temporarily point to a redirect message. Mitigation: phase 003 updates registry, advisor, docs, and mirrors after phase 002 passes.
- Command source authority had to be proven before runtime edits. Mitigation: phase 002 validated source authority before phase 003 and 004 proceeded.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Wrong source file edited | High | Resolve compiled-contract source mismatch before runtime changes. |
| Generated output stale | High | Regenerate compiled command contracts and inspect diffs. |
| Replacement snapshot too broad | Medium | Keep snapshots pointer-based and bounded. |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Standalone assets and compiled contract still expose `/deep:context`. |
| 2 | **Beyond Local Maxima?** | PASS | Considered registry-first, deletion-first, and aliasing alternatives. |
| 3 | **Sufficient?** | PASS | Public route closes without deleting fixtures or runtime branches early. |
| 4 | **Fits Goal?** | PASS | Staged deprecation starts with safe public behavior. |
| 5 | **Open Horizons?** | PASS | Later phases can clean discoverability and runtime internals after verification. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- Resolve or restore the maintained `/deep:context` command source.
- Add redirect guidance and YAML early halt guards.
- Add research/review replacement snapshot contracts.
- Regenerate compiled command contracts and manifest.

**How to roll back**: revert phase 002 command/YAML/research/review source edits, rerun the command contract compiler to restore generated outputs, and leave existing context artifacts untouched.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->
