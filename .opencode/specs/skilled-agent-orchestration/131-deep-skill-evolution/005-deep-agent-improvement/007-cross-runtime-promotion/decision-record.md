---
title: "Decision Record: Packet 127 deep-agent-improvement cross-runtime promotion"
description: "ADR-001 captures the hard four-runtime promotion gate contract and partial mirror recovery semantics."
trigger_phrases:
  - "packet 127 ADR"
  - "Cross-Runtime Promotion Gate Contract"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/131-deep-skill-evolution/005-deep-agent-improvement/007-cross-runtime-promotion"
    recent_action: "Accepted ADR-001 cross-runtime promotion gate contract."
    last_updated_at: "2026-05-23T00:00:00Z"
    last_updated_by: "codex"
    next_safe_action: "Resolve Vitest dependency and rerun regression."
---
# Decision Record: Packet 127 deep-agent-improvement cross-runtime promotion

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Cross-Runtime Promotion Gate Contract

### Metadata

| Field | Value |
| --- | --- |
| Status | Accepted |
| Date | 2026-05-23 |
| Decider | Codex |
| Scope | Packet 127 |

<!-- ANCHOR:adr-001-context -->
### Context

Packet 123 assigned packet 127 to close the multi-runtime agent definition consistency gap. Iteration 008 confirmed the repository has four runtime mirrors: `.opencode/agents/`, `.claude/agents/`, `.codex/agents/`, and `.gemini/agents/`. Packet 124 left cross-runtime sync as a TODO with an opt-in presence check, and packet 126 kept runtime mirror coverage advisory.

Promotion is a canonical mutation boundary. If a candidate affects an agent definition in one runtime, all four runtime definitions must already represent the same proposed body before promotion can proceed.
<!-- /ANCHOR:adr-001-context -->

<!-- ANCHOR:adr-001-decision -->
### Decision

Adopt a hard four-runtime promotion gate for agent-definition targets:

1. Agent-definition targets are files under `.opencode/agents/*.md`, `.claude/agents/*.md`, `.codex/agents/*.toml`, or `.gemini/agents/*.md`.
2. Promotion verifies all four corresponding runtime files exist.
3. Promotion verifies all four runtime bodies match the candidate body after runtime-specific normalization.
4. Codex TOML is compared by extracted `developer_instructions` body tokens, not by byte-equivalence of the TOML wrapper.
5. Failure rejects promotion with structured `MIRROR_SYNC_GATE_FAILED` JSON containing `presentRuntimes`, `missingRuntimes`, `driftRuntimes`, and `mirror_sync_state`.
6. Partial runtime state is explicit:
   - `all_landed`: all four mirrors exist and match.
   - `partial:<runtime-list>`: at least one runtime is present but one or more mirrors are missing or drifted.
   - `verification_failed`: no safe mirror set can be established.
7. Resume default for partial state is rollback of partial mirror landings to maintain the four-runtime invariant. Operators may instead retry failed mirrors or record an explicit decision to pause.
<!-- /ANCHOR:adr-001-decision -->

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives

| Alternative | Rejected Because |
| --- | --- |
| Soft warning instead of hard gate | Repeats the packet 126 advisory gap and still allows one-runtime promotion drift. |
| Byte-equivalence for Codex TOML | Produces false drift because Codex uses a TOML wrapper around the agent body. |
| Leave partial-state as operator-only prose | Resume logic needs a machine-readable state to avoid ambiguous N-of-4 landings. |
| Automatically edit runtime mirrors during promotion | This packet is a verifier/gate packet and is explicitly read-only for actual agent definitions. |
| Check only mirror presence | Packet 124 already did this as an opt-in; it does not catch stale content. |
<!-- /ANCHOR:adr-001-alternatives -->

<!-- ANCHOR:adr-001-consequences -->
### Consequences

Positive:

- Agent-definition promotion cannot silently leave runtime mirrors stale.
- Codex TOML wrapper differences no longer create false failures.
- Operators get structured failure output instead of free-form stderr.
- Resume dashboards can show partial mirror state and default recovery.

Negative:

- Agent-definition promotion is stricter and may reject candidates until packaging parity is complete.
- The packet records rollback intent for partial mirrors but does not mutate actual runtime agent definitions.
- Token comparison is less brittle than bytes but still requires reviewers to treat substantive body rewrites carefully.
<!-- /ANCHOR:adr-001-consequences -->

<!-- ANCHOR:adr-001-five-checks -->
### Five-Checks

| Check | Result | Evidence |
| --- | --- | --- |
| Simplicity | PASS | One reusable verifier plus local promotion/reducer wiring. |
| Correctness | PASS | All four runtimes are checked for presence and body drift; Codex body is extracted before comparison. |
| Scope | PASS | No actual runtime agent definitions or sibling skills are edited. |
| Maintainability | PASS | Mirror state constants live in `lib/promotion-gates.cjs`; verifier is standalone. |
| Verifiability | PASS | Syntax checks pass; Vitest fixtures cover all-in-sync, missing mirror, and Codex drift once the runner is available. |
<!-- /ANCHOR:adr-001-five-checks -->

<!-- ANCHOR:adr-001-impl -->
### Impl

Implementation files:

- `.opencode/skills/deep-agent-improvement/scripts/lib/mirror-sync-verify.cjs`
- `.opencode/skills/deep-agent-improvement/scripts/lib/promotion-gates.cjs`
- `.opencode/skills/deep-agent-improvement/scripts/promote-candidate.cjs`
- `.opencode/skills/deep-agent-improvement/scripts/reduce-state.cjs`
- `.opencode/skills/deep-agent-improvement/scripts/tests/mirror-sync-verify.vitest.ts`
- `.opencode/skills/deep-agent-improvement/references/promotion_rules.md`
- `.opencode/skills/deep-agent-improvement/references/mirror_drift_policy.md`

Verification:

- `node --check` passes for modified CJS files.
- Direct verifier smoke against the live `deep-agent-improvement` mirrors returns `allInSync: true`.
- New Vitest execution is blocked until `.opencode` dependencies are installed locally.
<!-- /ANCHOR:adr-001-impl -->

<!-- /ANCHOR:adr-001 -->
