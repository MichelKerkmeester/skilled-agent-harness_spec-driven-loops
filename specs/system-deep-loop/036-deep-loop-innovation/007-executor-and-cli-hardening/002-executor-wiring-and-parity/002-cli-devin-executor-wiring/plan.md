---
title: "Implementation Plan: cli devin executor wiring"
description: "Extend the deep-loop executor layer with a sixth kind by mirroring the existing cli-cursor adapter: kind enum, flag-support and capability tables, an enforced model allowlist, a fan-out command builder with PATH preflight, and audit-table entries."
trigger_phrases:
  - "cli-devin wiring plan"
  - "devin executor implementation"
  - "devin adapter plan"
  - "041 plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/007-executor-and-cli-hardening/002-executor-wiring-and-parity/002-cli-devin-executor-wiring"
    last_updated_at: "2026-08-18T23:59:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Marked cli-devin executor plan phases delivered"
    next_safe_action: "Commit the reconciled packet docs"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-27-041-cli-devin-executor-wiring"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: cli devin executor wiring

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (executor layer) + CommonJS (fan-out runner), Node 22 |
| **Framework** | Zod schemas for executor config; no application framework |
| **Storage** | None — lineage state is JSONL on disk, owned by the loop |
| **Testing** | Vitest (`runtime/tests/unit`), plus `tsc --noEmit` typecheck |

### Overview
Add `cli-devin` as a sixth executor kind by following the shape the `cli-cursor` adapter already established: declare the kind, state which config flags it supports, declare its web-search capability row, enforce a curated model allowlist, and add a synchronous command builder that fails closed when the binary is absent. Every CLI fact is read from the live `devin --help` and `devin models list` output rather than from the skill's documentation, because the documented model table omits tier names and would have led to the wrong id.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified — Devin CLI installed and authenticated

### Definition of Done
- [x] All acceptance criteria met — REQ-001..REQ-009 satisfied by the landed adapter
- [x] Tests passing — `vitest run` both adapter files green: 198 passed (198)
- [x] Docs updated (spec/plan/tasks) — reconciled to Complete, `validate.sh --strict` clean
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Adapter registry. `LINEAGE_COMMAND_ADAPTERS` maps an executor kind to a pure builder function; adding a kind means adding a row to that map plus its declarative table entries.

### Key Components
- **`executor-config.ts`**: the kind enum, per-kind flag support, the web-search capability matrix, and the model allowlist with its type guard. Two of these are exhaustive `Record<ExecutorKind, …>` types, so the compiler enforces completeness.
- **`executor-audit.ts`**: four partial per-kind maps resolving binary name, state-dir env vars, default home dir, and env prefixes for dispatch isolation and receipts.
- **`fanout-run.cjs`**: `buildDevinLineageCommand()` plus a PATH preflight, registered in the adapter map and exported for unit tests.

### Data Flow
A fan-out config names `kind: 'cli-devin'` → `parseFanoutConfig` validates it against `EXECUTOR_KINDS` → `expandLineages` produces one lineage per replica → `buildLineageCommand` dispatches to the devin adapter → the adapter rejects a disallowed model, maps the sandbox mode to a permission mode, and returns argv plus an invocation fingerprint → the audited runner spawns it with a filtered env.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `executor-config.ts` | Owns kind enum, flag support, capability matrix | update | `npm run typecheck`; `executor-config.vitest.ts` |
| `executor-audit.ts` | Owns per-kind binary/env/home resolution | update | `executor-audit.vitest.ts` |
| `fanout-run.cjs` | Owns lineage command construction | update | `fanout-run.vitest.ts` cli-devin block |
| `executor-config.vitest.ts` | Asserts the capability matrix as a literal | update | Suite green |
| Existing four executor kinds | Peer adapters | unchanged | No diff outside the added rows |

Required inventories run for this change:
- Exhaustive maps over the kind union: `grep -rn "Record<ExecutorKind" lib/ scripts/` → two exhaustive, five partial; all reviewed.
- Non-test call sites naming a sibling kind: `grep -rln "cli-cursor" lib/ scripts/` → three files, all updated.
- Live flag surface: `devin --help` → `--model`, `--permission-mode`, `--sandbox`, `--config` only.
- Live model roster: `devin models list` → 37 families; tier names read directly.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Live CLI surface captured (`devin --help`, `devin models list`)
- [x] Binary availability and auth confirmed
- [x] Sibling adapter (`cli-cursor`) read as the reference shape

### Phase 2: Core Implementation
- [x] Kind added to `EXECUTOR_KINDS`, flag-support and capability rows declared
- [x] `DEVIN_SUPPORTED_MODELS`, `DEVIN_DEFAULT_MODEL`, `isDevinModelAllowed()` added
- [x] `buildDevinLineageCommand()` + `isDevinBinaryAvailable()` added, registered, exported
- [x] Audit tables extended with binary, state-env, home-dir, and env-prefix entries

### Phase 3: Verification
- [ ] Manual testing — live dispatch on the free model [Deferred: needs an authenticated Devin account, exercised by the `88ffed2893` repair, external re-run pending]
- [x] Edge cases handled — disallowed model, absent binary, omitted model covered in `fanout-run.vitest.ts`
- [x] Documentation updated — packet docs reconciled to Complete
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Command shape, sandbox mapping, allowlist accept/reject, default model, fail-closed absence | Vitest |
| Integration | Kind parses through `parseFanoutConfig` and expands into a lineage | Vitest (existing kind-iterating tests) |
| Manual | Live `devin -p` dispatch on `glm-5-2` returning output | Devin CLI |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Devin CLI on PATH | External | Green | Adapter fails closed; no lineage dispatches |
| Devin account OAuth | External | Green | Dispatch returns an auth error at runtime |
| Vitest + tsc toolchain | Internal | Green | Cannot verify the change |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The added kind destabilizes fan-out for existing executors, or the devin adapter dispatches incorrectly.
- **Procedure**: Revert the five changed files. The change is purely additive — no existing kind's behaviour is touched — so reverting restores the prior five-kind surface exactly.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Capture live CLI surface) ──► Phase 2 (Core) ──► Phase 3 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core |
| Core | Setup | Verify |
| Verify | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | Capture and read the live CLI surface |
| Core Implementation | Medium | Five files, additive throughout |
| Verification | Medium | Targeted units, full suite, live smoke |
| **Total** | | **Small, bounded by the suite runtime** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Change is additive — no existing kind modified
- [x] Typecheck gate in place
- [x] Full runtime suite green — `vitest run` both adapter files: 198 passed (198)

### Rollback Procedure
1. Revert the five changed files.
2. Re-run `npm run typecheck` and the runtime suite.
3. Confirm the four existing CLI kinds still build their commands.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A — no persisted schema changes
<!-- /ANCHOR:enhanced-rollback -->
