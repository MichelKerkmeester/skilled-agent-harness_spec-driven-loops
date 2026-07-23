---
title: "Implementation Plan: Devin hook adapter layer"
description: "Plan thin Devin-host adapters over the existing runtime-neutral hook cores, validated against a live Devin session, starting with SessionStart and UserPromptSubmit."
trigger_phrases: ["devin hook adapter plan", "devin hooks implementation plan"]
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/029-cli-devin-revival/004-devin-hook-adapter-layer"
    last_updated_at: "2026-07-23T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored Level 3 plan: dependency graph, critical path, milestones, ADR-001 pointer"
    next_safe_action: "Wait for phase 003, then run Phase 1 live schema re-verification"
    blockers: ["depends on 003-cli-devin-skill-packet landing first", "read_config_from.claude fidelity unverified"]
    key_files: ["spec.md", "tasks.md", "decision-record.md"]
    session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "cli-devin-revival-authoring", parent_session_id: null }
    completion_pct: 0
    open_questions: ["Does read_config_from.claude ingest Claude Code's hooks in the schema .devin/hooks.v1.json expects? See decision-record.md ADR-001"]
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Devin hook adapter layer

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context
| Aspect | Value |
|---|---|
| **Language/Stack** | TypeScript adapters (mirroring `hooks/codex/*.ts`) + Node `.mjs` spec-gate wiring (mirroring `runtime/hooks/codex/*.mjs`) + JSON (`.devin/hooks.v1.json`) |
| **Framework** | None - thin CLI-invoked scripts, no framework |
| **Storage** | None |
| **Testing** | Vitest (unit, mirroring `hook-completion-evidence-stop.vitest.ts`) + a live smoke test against the installed `devin` binary |

### Overview
Add thin Devin-host adapters over the existing runtime-neutral hook cores - the same `hooks/claude/*.ts` implementations and `runtime/lib/spec-gate/spec-gate-core.mjs` that `hooks/codex/` and `runtime/hooks/codex/` already delegate to - register them in `.devin/hooks.v1.json`, and live-smoke-test the JSON stdin/stdout round trip for `SessionStart` and `UserPromptSubmit` first.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phase 003 (cli-devin skill packet + hub registration) has landed
- [ ] Devin's hook JSON schema field names re-confirmed live (not just from docs) for `SessionStart` and `UserPromptSubmit`
- [ ] `decision-record.md` ADR-001 accepted (hand-built adapters chosen)

### Definition of Done
- [ ] `SessionStart` and `UserPromptSubmit` adapters exist under `hooks/devin/` and pass a live smoke test
- [ ] `.devin/hooks.v1.json` registers both events correctly
- [ ] Neutral hook cores show zero diff
- [ ] `decision-record.md`'s re-evaluation trigger for `read_config_from.claude` is recorded
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Thin host-adapter over a shared core, matching the existing three-consumer shape of `runtime/lib/spec-gate/spec-gate-core.mjs` (Claude hook, OpenCode plugin, Codex hook) - Devin becomes a fourth consumer, not a fork.

### Key Components
- **`hooks/devin/shared.ts`**: Reads and validates a bounded Devin hook payload (mirroring `hooks/codex/shared.ts`), spawns the matching compiled `../claude/*.js` adapter, translates the result into Devin's `hookSpecificOutput` response envelope.
- **`hooks/devin/session-start.ts`**: `SessionStart` adapter, delegating to `session-prime.js`.
- **`hooks/devin/user-prompt-submit.ts`**: `UserPromptSubmit` adapter, delegating to `user-prompt-submit.js`.
- **`runtime/hooks/devin/spec-gate-classify.mjs` / `spec-gate-enforce.mjs`**: Devin-side wiring into `spec-gate-core.mjs`, mirroring the Codex-tool-vocabulary mapping `runtime/hooks/codex/spec-gate-enforce.mjs` already does for `exec`/`apply_patch`/`edit`.

### Data Flow
Devin lifecycle event fires -> JSON payload on stdin -> adapter validates and normalizes -> spawns/calls the shared neutral core -> core returns its lifecycle-neutral result -> adapter translates into Devin's documented response shape (`hookSpecificOutput.additionalContext` for `SessionStart`/`UserPromptSubmit`) -> emitted on stdout.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES
N/A - this is new-adapter work, not a bug fix. No existing consumer behavior changes; `hooks/claude/**` and `runtime/lib/spec-gate/**` stay read-only dependencies this phase never edits.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Re-verify Devin's live hook JSON schema for `SessionStart`/`UserPromptSubmit` against `docs.devin.ai/cli/extensibility/hooks/{overview,lifecycle-hooks}.md` and, where possible, a real fired event
- [ ] Confirm `.devin/hooks.v1.json` discovery order (standalone file vs. `hooks` key in `.devin/config.json`/`.devin/config.local.json`, walking up to repo root) against a live test project
- [ ] Resolve the ADR-001 decision-record's open verification step for `read_config_from.claude` fidelity before writing adapter code

### Phase 2: Core Implementation
- [ ] Create `hooks/devin/shared.ts` mirroring `hooks/codex/shared.ts`'s payload-validate / spawn-claude-adapter / emit-envelope shape
- [ ] Create `hooks/devin/session-start.ts` and `hooks/devin/user-prompt-submit.ts`
- [ ] Create `runtime/hooks/devin/spec-gate-classify.mjs` and `spec-gate-enforce.mjs`, mapping Devin's tool-call vocabulary onto the core's `bash`/`write`/`edit` vocabulary
- [ ] Author `.devin/hooks.v1.json` registering both events against the compiled adapters
- [ ] Author `hooks/devin/README.md` and `runtime/hooks/devin/README.md` mirroring the Codex siblings' documentation shape

### Phase 3: Verification
- [ ] Unit-test adapters against fixture payloads
- [ ] Live-smoke both events against the installed `devin` binary, capturing stdin/stdout evidence
- [ ] Diff `hooks/claude/**` and `runtime/lib/spec-gate/**` against pre-phase state to confirm zero behavioral rewrite
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|---|---|---|
| Unit | Adapter payload validation, matcher parsing, envelope translation | Vitest |
| Integration | Full `SessionStart`/`UserPromptSubmit` round trip through the neutral core | Vitest + fixture payloads |
| Manual | Live `devin` session smoke test for both wired events | `devin` CLI |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|---|---|---|---|
| Phase 003 (cli-devin skill packet + hub registration) | Internal | Yellow (Planned, not yet built) | No hub context for the adapters to attach to; 004 cannot start cleanly |
| Live `devin` binary + hook JSON schema | External | Yellow (installed and version-confirmed in 001; hook field-level schema not yet re-verified at implementation time) | Cannot safely wire adapters without live confirmation |
| `read_config_from.claude` fidelity verification | External | Yellow (unconfirmed from docs alone) | Blocks only the ADR-001 re-evaluation trigger, not the P0 hand-built-adapter path |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
Remove `hooks/devin/`, `runtime/hooks/devin/`, and `.devin/hooks.v1.json`; leave the neutral cores (`hooks/claude/**`, `runtime/lib/spec-gate/**`) untouched, matching the codex-precedent rollback plan exactly.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup: live-verify schema) ──┐
                                      ├──► Phase 2 (Core: build adapters) ──► Phase 3 (Verify: smoke test)
ADR-001 resolution ───────────────────┘
```

| Phase | Depends On | Blocks |
|---|---|---|
| Setup | Phase 003 landed | Core |
| ADR-001 resolution | Setup's schema verification | Core |
| Core | Setup, ADR-001 resolution | Verify |
| Verify | Core | Phase 005 handoff |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|---|---|---|
| Setup | Med | Live-doc cross-check plus one real Devin session |
| Core Implementation | Med | ~7 files, thin delegation pattern already proven by codex |
| Verification | Low-Med | 2 events to smoke test |
| **Total** | | Bounded by the codex precedent's own footprint (7 files, ~25KB source) |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] `.devin/hooks.v1.json` backed up or absent before this phase (none existed previously)
- [ ] No feature flag needed - hook registration is inherently additive and Devin-only
- [ ] No monitoring/alerting required for a docs-plus-thin-adapter phase

### Rollback Procedure
1. Delete `.devin/hooks.v1.json`
2. `git revert` or delete `hooks/devin/` and `runtime/hooks/devin/`
3. Confirm `hooks/claude/**` and `runtime/lib/spec-gate/**` are unchanged (they were never touched)
4. No stakeholder notification needed - Devin-only surface, no other executor depends on it

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌─────────────┐     ┌───────────────────────┐     ┌─────────────┐
│  003 Skill  │────►│  004 Hook Adapter     │────►│  005 Model  │
│   Packet    │     │       Layer           │     │  Registry   │
└─────────────┘     └───────────┬───────────┘     └─────────────┘
                                 │
                     ┌───────────▼───────────┐
                     │ ADR-001: adapter vs.  │
                     │ native import vs.     │
                     │ hybrid (this phase)   │
                     └───────────────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|---|---|---|---|
| Live schema re-verification | Phase 001 contract pin | Confirmed field-level payload shape | Adapter implementation |
| ADR-001 decision | Live schema re-verification | Chosen adapter strategy | Adapter implementation |
| `hooks/devin/*.ts` + `runtime/hooks/devin/*.mjs` | ADR-001 decision | Working adapters | `.devin/hooks.v1.json` registration |
| `.devin/hooks.v1.json` | Adapters built | Native hook registration | Live smoke test |
| Live smoke test | Registration complete | Pass/fail evidence | Phase 005 handoff |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Live schema re-verification** - short, doc-cross-check plus one live session - CRITICAL
2. **ADR-001 resolution** (hand-built vs. native import) - short, a decision not new code - CRITICAL
3. **Adapter implementation** (`SessionStart` + `UserPromptSubmit`) - the bulk of the phase's effort - CRITICAL
4. **Live smoke test** - short but blocking for phase closure - CRITICAL

**Total Critical Path**: Dominated by adapter implementation; schema verification and the ADR decision are both short gates in front of it.

**Parallel Opportunities**:
- `hooks/devin/README.md` and `runtime/hooks/devin/README.md` authoring can happen alongside adapter implementation
- Fixture-based unit tests can be written before the live smoke test is possible
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|---|---|---|---|
| M1 | Schema + ADR resolved | Live field-level schema confirmed; ADR-001 accepted | Start of Phase 2 |
| M2 | Adapters built | `SessionStart` + `UserPromptSubmit` adapters exist, unit tests pass | End of Phase 2 |
| M3 | Live-verified | Both events smoke-tested against a real `devin` session; neutral cores diff-clean | End of Phase 3 / phase close |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Hook adapter strategy: hand-built adapters vs. native `read_config_from.claude` import vs. hybrid

**Status**: Proposed

**Context**: Devin's `read_config_from.claude` config option could import Claude Code's own hook configuration, but its actual fidelity against `.devin/hooks.v1.json`'s expected schema is unverified from the fetched documentation.

**Decision**: Start with hand-built thin adapters mirroring the proven `cli-codex` pattern; re-evaluate native import once its fidelity is confirmed. Full rationale, alternatives, and five-checks evaluation: see `decision-record.md` ADR-001.

**Consequences**:
- More adapter code to maintain upfront, but a known-working pattern
- The native-import path stays open as a future simplification, not foreclosed

**Alternatives Rejected**:
- Native `read_config_from.claude` import outright: rejected for now - fidelity unconfirmed, too risky to build the whole layer on an unverified vendor behavior
- Hybrid: premature until native import's actual coverage is known

---

<!-- ANCHOR:ai-execution -->
## AI EXECUTION PROTOCOL

### Pre-Task Checklist
- [ ] Confirmed phase 003 has landed (hub registration exists for `cli-devin`)
- [ ] Confirmed `decision-record.md` ADR-001 is Accepted before writing adapter code
- [ ] Confirmed the live `devin` binary is installed and its version matches phase 001's contract pin

### Execution Rules
| Rule | Requirement |
|---|---|
| TASK-SEQ | Follow `tasks.md` Phase 1 -> 2 -> 3 order; do not start Phase 2 adapter code before Phase 1's live schema re-verification completes |
| TASK-SCOPE | Touch only `mcp-server/hooks/devin/**`, `runtime/hooks/devin/**`, `.devin/hooks.v1.json` - never edit `hooks/claude/**` or `runtime/lib/spec-gate/**` |

### Status Reporting Format
Report each completed task as `T### done: <one-line evidence>`; report blocked tasks as `T### blocked: <reason>`.

### Blocked Task Protocol
If `devin`'s live hook schema disagrees with this plan's assumptions, mark the affected task `[B]` in `tasks.md`, record the actual observed schema, and update `decision-record.md` ADR-001 before proceeding - do not silently code against the wrong schema.
<!-- /ANCHOR:ai-execution -->
