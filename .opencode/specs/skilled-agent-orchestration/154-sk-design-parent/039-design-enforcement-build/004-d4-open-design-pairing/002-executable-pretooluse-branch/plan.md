---
title: "Implementation Plan: Executable Open Design PreToolUse branch"
description: "Conservative, verification-heavy plan to insert a tightly-scoped guarded Open Design precondition branch into the Codex PreToolUse hook without altering any non-Open-Design tool path."
trigger_phrases:
  - "executable pretooluse branch plan"
  - "open design precondition hook"
  - "codex pretooluse guarded branch"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/039-design-enforcement-build/004-d4-open-design-pairing/002-executable-pretooluse-branch"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Confirm the executable branch plan against the shipped hook and mark phases done"
    next_safe_action: "Let the parent refresh description.json and graph-metadata.json"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/hooks/codex/pre-tool-use.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-agent-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Executable Open Design PreToolUse branch

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (Node ESM) |
| **Target file** | `.opencode/skills/system-spec-kit/mcp_server/hooks/codex/pre-tool-use.ts` |
| **Test framework** | Vitest (`vitest run`, alias `npm run test:core`) |
| **Type/build gate** | `tsc --noEmit -p tsconfig.json` (`npm run typecheck`) + `tsc --build` |
| **Blast radius** | EXTREME — this hook gates EVERY Codex tool call (Bash, Read, Edit, Write, Grep, every MCP tool) |

### Overview
The Codex PreToolUse hook (`handleCodexPreToolUse`) is currently Bash-only: any non-Bash tool returns the empty allow object `{}` at the early `if (toolNameFor(input) !== 'Bash') return {}` guard, so Open Design MCP calls pass unchecked. This plan inserts a tightly-scoped `evaluateOpenDesignPrecondition(input, dependencies)` branch immediately BEFORE that Bash-only early return. The branch engages ONLY for tools whose exact name is in the policy-supplied guarded Open Design list; for every other tool it returns `null` and execution falls through to the unchanged existing logic byte-for-byte.

The branch is deny-by-default for a guarded Open Design call that lacks a valid `DESIGN_PROOF_TOKEN`, and deny (fail-CLOSED) when the token validator throws — the deliberate inverse of the Bash lane's outer fail-OPEN catch. Because the authoritative enforcement lane is the D4-R1 guarded proxy, this hook is defense-in-depth: when the policy carries no guarded list, the branch blocks NOTHING (fail-OPEN on policy-absence), which is the explicitly accepted tradeoff that guarantees zero regression to general tool execution.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Target hook fully read; the Bash-only early return and the outer fail-open catch are mapped
- [x] Allow shape (`{}`) and deny shape (`{ decision: 'deny', reason: string }`) confirmed from the hook's `CodexPreToolUseOutput` type
- [x] Existing vitest suite read; the byte-identical contract to preserve is enumerated
- [x] Guarded tool set and policy source (D4-R4 `openDesignPreconditions.guardedTools`) identified, with a no-hard-dependency fallback decided

### Definition of Done
- [x] Guarded OD call with no token → DENY (deny battery green)
- [x] Guarded OD call whose validator throws → DENY, fail-closed (deny battery green)
- [x] No-regression battery: Bash deny/allow, Read/Edit/Write, a non-OD MCP tool, missing-policy diagnostic, full-word match, alias key, camelCase payload, fail-open-on-policy-throw — ALL unchanged (existing suite 11/11 PASS)
- [x] Policy lacking the guarded list → branch blocks nothing (fail-OPEN on policy-absence confirmed)
- [x] `tsc` type-checks (no pre-tool-use type errors)
- [x] No spec/packet/phase IDs or `specs/` paths in code or comments (evergreen scan clean)

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### The exact insertion
Insert the branch INSIDE `handleCodexPreToolUse`, between the existing `if (!input) { return {}; }` block and the existing `if (toolNameFor(input) !== 'Bash') { return {}; }` block (the "Bash-only `return {}`"):

```ts
    if (!input) {
      return {};
    }

    // >>> NEW: guarded Open Design precondition lane (defense-in-depth) <<<
    const openDesignDecision = evaluateOpenDesignPrecondition(input, dependencies);
    if (openDesignDecision !== null) {
      return openDesignDecision;
    }
    // <<< END NEW >>>

    if (toolNameFor(input) !== 'Bash') {
      return {};
    }
```

It MUST go before the Bash-only guard, because Open Design tools are not `Bash`; placing it after that guard means it can never run.

### The branch contract (`evaluateOpenDesignPrecondition`)
Returns `CodexPreToolUseOutput | null`:
- `null` → "not a guarded Open Design tool" → caller falls through to the existing, unchanged logic (this is the byte-identical path for ALL non-OD tools).
- `{}` → guarded OD tool with a valid token → allow.
- `{ decision: 'deny', reason }` → guarded OD tool denied (no/invalid token, or validator exception).

### Two-phase internal structure (fail-OPEN membership, fail-CLOSED validation)
```ts
function evaluateOpenDesignPrecondition(
  input: CodexPreToolUseInput,
  dependencies: CodexPreToolUseDependencies,
): CodexPreToolUseOutput | null {
  let toolName: string | null;
  let guarded: readonly string[];
  try {
    // Phase A — MEMBERSHIP (fail OPEN): any problem here must NOT block.
    toolName = toolNameFor(input);
    if (!toolName) return null;
    guarded = resolveGuardedOpenDesignTools(dependencies); // [] if policy/list absent
  } catch {
    return null; // membership determination failed → defense-in-depth lane stays out of the way
  }
  if (guarded.length === 0) return null;        // policy-absence → fail OPEN
  if (!guarded.includes(toolName)) return null; // not guarded → byte-identical fall-through

  // Phase B — VALIDATION (fail CLOSED): we have CONFIRMED a guarded OD tool.
  try {
    const token = extractDesignProofToken(input);
    const valid = dependencies.validateOpenDesignToken
      ? dependencies.validateOpenDesignToken(token, input)
      : isStructurallyValidDesignProofToken(token);
    if (!valid) {
      return { decision: 'deny', reason: 'Guarded Open Design call denied: missing or invalid design proof token' };
    }
    return {};
  } catch {
    return { decision: 'deny', reason: 'Guarded Open Design call denied: precondition validator error (fail-closed)' };
  }
}
```

The two `try` blocks are deliberately separate so that an exception while merely *deciding membership* cannot deny an innocent non-OD tool (Phase A returns `null` → fall-through), while an exception while *validating a confirmed-guarded call* always denies (Phase B). Neither phase relies on the outer fail-open catch for an OD verdict.

### Helpers (co-located in the same file — no new module)
- `resolveGuardedOpenDesignTools(deps)` → reads `policy.openDesignPreconditions?.guardedTools` (also tolerates `policy.toolPreconditions?.openDesignPreconditions?.guardedTools`); returns `[]` for any missing/malformed shape. Uses `deps.readPolicy()` when injected (tests), otherwise a quiet, side-effect-free read (see below). Always returns an array of non-empty strings.
- `readPolicyQuiet(policyPath)` → like `loadPolicy` but does NOT write the `in_memory_default` stderr diagnostic and returns `{}` (no fields) when the file is missing or unparseable. This is what keeps non-OD behavior byte-identical even when `.codex/policy.json` is absent.
- `extractDesignProofToken(input)` → reads a `designProofToken` field from `tool_input` / `toolInput` / `input` / top-level; returns `undefined` when absent.
- `isStructurallyValidDesignProofToken(token)` → structural + freshness presence checks per the design proof token contract (version `1`, required fields present and well-typed, non-empty `loadedFiles`/`workflowModes`, well-formed `sha256:` digests, `singleUse === true` with `nonce` + `runId`, parseable `issuedAt`/`expiresAt` with `issuedAt <= now < expiresAt`). Deep digest recomputation, file-hash, and replay checks are DEFERRED to the authoritative proxy lane (named limit, §6) — the hook only sees the tool input, not the reconstructed outgoing payload.

### Minimal type additions
- `CodexPolicyFile` gains OPTIONAL `openDesignPreconditions?: { guardedTools?: readonly string[] }` and tolerant `toolPreconditions?: { openDesignPreconditions?: { guardedTools?: readonly string[] } }`. If the sibling policy-schema phase has already defined these, REUSE its definition instead of duplicating (logic-sync, not a second source of truth).
- `CodexPreToolUseDependencies` gains OPTIONAL `validateOpenDesignToken?: (token: unknown, input: CodexPreToolUseInput) => boolean` — the testability seam that lets a test inject a throwing validator to prove fail-closed. It mirrors the existing `readPolicy` injection pattern.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Baseline & map
- [x] Capture the green baseline of the existing hook suite (`tests/codex-pre-tool-use.vitest.ts`) before any edit.
- [x] Confirm `tsc --noEmit` is clean before any edit.
- [x] Re-confirm the insertion point (between the `if (!input)` guard and the Bash-only non-Bash return) and the two return shapes.

### Phase 2: Implement the branch
- [x] Add the `OpenDesignPreconditions` types plus optional `openDesignPreconditions` policy fields and the optional `validateOpenDesignToken` injection seam.
- [x] Add co-located helpers: `readPolicyQuiet`, `resolveGuardedOpenDesignTools`, `extractDesignProofToken`, `isStructurallyValidDesignProofToken`.
- [x] Implement `evaluateOpenDesignPrecondition` with the two-phase structure: Phase A membership (fail-OPEN to `null`), Phase B validation (fail-CLOSED to deny).
- [x] Insert the branch call before the Bash-only early return; short-circuit only on a non-`null` verdict.

### Phase 3: Verification
- [x] Re-run the existing hook suite unchanged: 11/11 PASS (authoritative no-regression).
- [x] Deny battery: guarded call with no token denies; throwing validator denies (fail-closed); empty guarded list blocks nothing.
- [x] Confirm Bash/Read/Edit/Write/Grep/non-OD-MCP/null-input are byte-identical to pre-change behavior.
- [x] `tsc --noEmit` clean (no pre-tool-use type errors); evergreen scan finds no IDs or `specs/` paths.

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Verification DOMINATES this plan: the #1 risk is breaking general tool execution, so the no-regression battery is larger than the feature tests and runs first.

| Test Type | Scope | Tool |
|-----------|-------|------|
| No-regression (DOMINANT) | Re-run the entire existing `codex-pre-tool-use.vitest.ts` suite unchanged + new explicit non-OD cases | Vitest |
| Feature — deny | Guarded OD tool, no token → deny; guarded OD tool, throwing validator → deny | Vitest (DI: `readPolicy`, `validateOpenDesignToken`) |
| Feature — fail-open | Policy without `guardedTools` → guarded-name call still allowed (`{}`) | Vitest |
| Type/build | `tsc --noEmit` and `tsc --build` | tsc |

All tests use dependency injection (`readPolicy`, optional `validateOpenDesignToken`, `policyPath`) exactly like the existing suite — NO edits to `.codex/policy.json` are required to exercise deny paths.

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:no-regression -->
## 5b. NO-REGRESSION — WHAT STILL SPEAKS THE OLD CONTRACT

Every tool class that currently flows through the hook, and the exact reason each is unaffected:

| Tool class | Today's path | After the change | Why unaffected |
|------------|--------------|------------------|----------------|
| **Bash (deny match)** | falls past non-Bash guard → denylist match → deny | identical | OD branch returns `null` (Bash is not in the OD guarded list) → existing Bash logic runs verbatim |
| **Bash (allow / no match)** | denylist no-match → `{}` | identical | same — OD branch returns `null` first |
| **Read** | non-Bash guard → `{}` | identical | OD branch returns `null` (Read not in guarded list) → hits the unchanged non-Bash early return |
| **Edit** | non-Bash guard → `{}` | identical | same as Read |
| **Write** | non-Bash guard → `{}` | identical | same as Read |
| **Grep / any other built-in** | non-Bash guard → `{}` | identical | same as Read |
| **Non-OD MCP tool** (e.g. code-graph, spec-memory) | non-Bash guard → `{}` | identical | tool name not in the OD guarded list → `null` → unchanged early return |
| **`null` input** | `if (!input) return {}` | identical | OD branch is inserted AFTER the null guard; never reached for null input |
| **Missing `.codex/policy.json`** | Bash lane `loadPolicy` writes one `in_memory_default` stderr diagnostic | identical | OD uses `readPolicyQuiet` (no diagnostic) and returns `[]`; the single diagnostic still comes only from the Bash lane |
| **Policy read throws (injected)** | outer catch → `{}` | identical | OD Phase A catches → `null` → Bash lane re-throws → outer catch → `{}` |
| **OD tool but policy has no guarded list** | (previously unchecked → allowed) | allowed (`{}`) | fail-OPEN on policy-absence: empty guarded set → `null` → unchanged non-Bash return |

The branch is the ONLY new code path, and it is entered ONLY when `toolNameFor(input)` is an exact member of a non-empty policy-supplied guarded list. No built-in tool, no non-OD MCP tool, and no Bash command can match that list, so their behavior is byte-identical.

<!-- /ANCHOR:no-regression -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `openDesignPreconditions.guardedTools` in policy (sibling policy-schema phase) | Internal | Not required | If absent → guarded set is `[]` → branch blocks nothing (fail-OPEN). No hard dependency. |
| Design proof token contract | Internal (reference) | Green | Defines structural validity the hook checks; deep validation stays at the proxy |
| Guarded proxy contract | Internal (reference) | Green (authoritative lane) | This hook is defense-in-depth behind it |
| Vitest + tsc toolchain | External | Green | Cannot run verification battery |

### Named limit (defense-in-depth tradeoff, stated explicitly)
The hook validates token PRESENCE, STRUCTURE, and FRESHNESS only. Full digest recomputation, loaded-file hashing, replay, and bound-surface payload binding remain the authoritative proxy's responsibility because the PreToolUse hook sees only the tool input, not the reconstructed outgoing payload. Fail-OPEN on policy-absence is accepted ONLY because that authoritative proxy lane exists; the hook never weakens it and never claims to replace it.

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Any non-Open-Design tool changes behavior, the existing vitest suite regresses, or `tsc` fails.
- **Procedure**: `git checkout -- .opencode/skills/system-spec-kit/mcp_server/hooks/codex/pre-tool-use.ts` (and the test file if added) — the change is a single additive branch plus co-located helpers in one file, fully revertible with no data or schema migration. The guarded proxy lane remains the enforcement floor while reverted.

<!-- /ANCHOR:rollback -->
---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Read+map hook ──> Add helpers+types ──> Insert branch ──> NO-REGRESSION battery ──> Feature tests ──> tsc/build
                                                              (DOMINANT gate)
```

| Step | Depends On | Blocks |
|------|------------|--------|
| Map hook & contract | None | Helpers |
| Helpers + types | Map hook | Insert branch |
| Insert branch | Helpers | Verification |
| No-regression battery | Insert branch | Feature tests, completion |
| Feature tests | No-regression green | Completion |
| tsc/build | Insert branch | Completion |

<!-- /ANCHOR:phase-deps -->
---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Step | Complexity | Estimated Effort |
|------|------------|------------------|
| Helpers + minimal types | Low | 45 min |
| Insert branch | Low | 15 min |
| No-regression battery (dominant) | Medium | 1.5 h |
| Feature deny/fail-open tests | Low | 45 min |
| tsc/build + review | Low | 30 min |
| **Total** | | **~3.75 h** |

<!-- /ANCHOR:effort -->
---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-change checklist
- [x] Baseline captured: `vitest run` on the codex hook suite is green BEFORE any edit, with the pass count recorded (11/11)
- [x] `tsc --noEmit` is clean BEFORE any edit

### Rollback procedure
1. **Revert**: `git checkout -- <pre-tool-use.ts>` (+ test file if added)
2. **Verify**: re-run the codex hook vitest suite; confirm it returns to the recorded baseline
3. **Confirm floor**: the D4-R1 guarded proxy lane still enforces Open Design preconditions independently

### Data reversal
- **Has data/schema migrations?** No — additive code only; `.codex/policy.json` is not modified by this phase.

<!-- /ANCHOR:enhanced-rollback -->

---

<!--
LEVEL 2 PLAN
- Conservative, verification-heavy: no-regression battery dominates
- Single additive branch + co-located helpers in pre-tool-use.ts; no new module unless justified
- Fail-CLOSED on guarded-call validator exception; fail-OPEN on policy-absence (defense-in-depth)
-->
