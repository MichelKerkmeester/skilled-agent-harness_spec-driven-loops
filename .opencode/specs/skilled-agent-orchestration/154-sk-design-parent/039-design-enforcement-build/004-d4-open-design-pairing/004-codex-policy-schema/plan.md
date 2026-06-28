---
title: "Implementation Plan: Codex policy guardedTools — activate the Open Design PreToolUse branch"
description: "Populate .codex/policy.json openDesignPreconditions.guardedTools with the 7 mutating Open Design MCP tools plus namespace variants, activating the already-landed PreToolUse precondition branch."
trigger_phrases:
  - "codex policy guardedtools plan"
  - "activate open design pretooluse branch"
  - "guarded tools policy design build"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/039-design-enforcement-build/004-d4-open-design-pairing/004-codex-policy-schema"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Confirm the plan against the activated guardedTools policy"
    next_safe_action: "Let the parent refresh description.json and graph-metadata.json"
    blockers: []
    key_files:
      - ".codex/policy.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-agent-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Codex policy guardedTools — activate the Open Design PreToolUse branch

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JSON policy data (`.codex/policy.json`) consumed by a TypeScript hook |
| **Consumer** | `system-spec-kit/mcp_server/hooks/codex/pre-tool-use.ts` (already landed) |
| **Storage** | Repo-local `.codex/policy.json` |
| **Testing** | Vitest (`codex-pre-tool-use.vitest.ts`) + a node runtime harness against the real policy file |

### Overview

The dependency phase already added the executable PreToolUse precondition branch and the policy types to the Codex hook: `evaluateOpenDesignPrecondition` runs before the Bash-only return, and `resolveGuardedOpenDesignTools` reads `policy.openDesignPreconditions.guardedTools` and `policy.toolPreconditions.openDesignPreconditions.guardedTools`. That branch is currently **inert / fail-open** because `.codex/policy.json` carries no `openDesignPreconditions` block, so `guardedTools` resolves to `[]` and every tool falls through.

This phase makes the branch live by populating `.codex/policy.json` with `openDesignPreconditions.guardedTools` — the 7 mutating/destructive Open Design MCP tool names plus their namespace-prefixed variants, in the exact shape the resolver expects. Once populated, a guarded Open Design tool call lacking a valid design proof token is **denied**, while every non-guarded tool and every read-only/transport tool is unaffected.

This is a data-only change. No hook source is modified: the precondition types and resolver already exist, so there is no schema gap to close.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Consumer hook resolver shape confirmed (`resolveGuardedOpenDesignTools` reads top-level and nested `openDesignPreconditions.guardedTools`)
- [x] Guarded tool set derived from `tool_surface.md` / `guarded_proxy.md`
- [x] Activation semantics understood (empty list = fail-open/inert; populated list = deny-without-token)
- [x] No-block-transport invariant identified (hook gates by tool-name membership only)

### Definition of Done
- [x] `.codex/policy.json` carries `openDesignPreconditions.guardedTools` in the resolver-expected shape — 21-entry string array under top-level `openDesignPreconditions`
- [x] A guarded tool (bare + namespace variant) without a valid token is DENIED via the real policy file — `start_run`, `create_artifact`, `mcp__open-design__start_run`, `open_design.open_design_delete_project` all deny
- [x] A non-guarded tool and a read-only/transport tool are unaffected (no false deny) — `get_run`, `list_projects`, `Read`, safe `Bash` all empty-allow
- [x] Existing Codex hook vitest suite still passes 11/11 (no regression) — `vitest run codex-pre-tool-use` → 11 passed
- [x] `.codex/policy.json` is valid JSON — `node -e JSON.parse` exit 0
- [x] No spec/packet/phase IDs or spec paths added to `.codex/policy.json` — added block carries a durable `description` only

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Declarative policy data drives an already-wired enforcement branch. The hook owns the mechanism; `.codex/policy.json` owns the membership list. The guarded set is a single source of truth derived from the Open Design tool-surface references, not hardcoded in the hook.

### Key Components

**The exact policy shape to add to `.codex/policy.json`** (sibling to the existing `bashDenylist` / `bash_denylist` keys):

```json
"openDesignPreconditions": {
  "guardedTools": [
    "create_artifact",
    "write_file",
    "create_project",
    "start_run",
    "cancel_run",
    "delete_file",
    "delete_project",
    "mcp__open-design__create_artifact",
    "mcp__open-design__write_file",
    "mcp__open-design__create_project",
    "mcp__open-design__start_run",
    "mcp__open-design__cancel_run",
    "mcp__open-design__delete_file",
    "mcp__open-design__delete_project",
    "open_design.open_design_create_artifact",
    "open_design.open_design_write_file",
    "open_design.open_design_create_project",
    "open_design.open_design_start_run",
    "open_design.open_design_cancel_run",
    "open_design.open_design_delete_file",
    "open_design.open_design_delete_project"
  ]
}
```

**Why this exact shape:** `resolveGuardedOpenDesignTools` concatenates `guardedToolEntries(policy.openDesignPreconditions)` and `guardedToolEntries(policy.toolPreconditions?.openDesignPreconditions)`. `guardedToolEntries` requires `guardedTools` to be a string array; each entry is trimmed and matched against the incoming `toolName` via `Array.includes` (exact match). Populate the **top-level** `openDesignPreconditions.guardedTools` only — the nested `toolPreconditions.openDesignPreconditions.guardedTools` is an accepted alias read by the same resolver, so duplicating into both would only concatenate redundant entries.

**The derived guardedTools list (3 forms × 7 write tools = 21 entries):**

Base 7 write tools — from `guarded_proxy.md` `guarded.mcpTools` (= `tool_surface.md` Mutating (5) + Destructive (2)):

| # | Tool | Class |
|---|------|-------|
| 1 | `create_artifact` | mutating |
| 2 | `write_file` | mutating |
| 3 | `create_project` | mutating |
| 4 | `start_run` | mutating (fires the build / inner-agent spawn) |
| 5 | `cancel_run` | mutating |
| 6 | `delete_file` | destructive |
| 7 | `delete_project` | destructive |

Namespace-prefixed variants per tool (the same tool reaches the hook under different wired transports):
- Native MCP, server key `open-design` (the `od mcp install` default): `mcp__open-design__<tool>`
- Code Mode UTCP manual `open_design` (`{manual}.{manual}_{tool}` convention): `open_design.open_design_<tool>`

### Data Flow

1. A wired surface issues a tool call; the Codex hook receives `{ tool, tool_input, ... }`.
2. `handleCodexPreToolUse` runs `evaluateOpenDesignPrecondition` first.
3. `resolveGuardedOpenDesignTools` reads `guardedTools` from `.codex/policy.json`.
4. If `toolName` is in `guardedTools`: extract `designProofToken`; if absent/invalid → `{ decision: 'deny', reason: 'Guarded Open Design call denied: missing or invalid design proof token' }`.
5. If `toolName` is NOT in `guardedTools`: return `null` and fall through to the unchanged Bash-only lane (read/transport tools and ordinary tools pass).

### The do-not-block-transport guard (CRITICAL)

The hook gates a tool **purely by name membership** in `guardedTools` — it does **not** evaluate `feedsDesignDecision`. Therefore the guardedTools list MUST contain ONLY the 7 mutating/destructive write tools (and their namespace variants). It MUST NOT include any read-only / transport tool (`get_run`, `list_projects`, `get_active_context`, `get_artifact`, `get_project`, `get_file`, `search_files`, `list_files`, `list_skills`, `list_plugins`, `list_agents`). Adding any of those would deny legitimate pure-transport reads. The `feedsDesignDecision`-read gating from `guarded_proxy.md` (`mcpReadToolsWhenFeedsDesignDecision`) is enforced at the guarded proxy (the all-surface gate phase), NOT at this coarse Codex defense-in-depth lane. CLI write verbs (`od ui respond/prefill/revoke`, `od media generate`, run start/redesign) are gated by the Bash/`od`-CLI precondition lane in a later phase, not by this MCP tool-name list.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Confirm no schema gap
- [x] Confirm `OpenDesignPreconditions.guardedTools`, `CodexPolicyFile.openDesignPreconditions`, and `CodexPolicyFile.toolPreconditions.openDesignPreconditions` already exist in `pre-tool-use.ts` — types present at `pre-tool-use.ts:44`/`:48`
- [x] Confirm `resolveGuardedOpenDesignTools` reads both locations and `evaluateOpenDesignPrecondition` runs before the Bash return — both present in source
- [x] Conclusion: no hook edit required; scope is `.codex/policy.json` only — confirmed, no source edited

### Phase 2: Populate the policy
- [x] Add the `openDesignPreconditions.guardedTools` block (21 entries) to `.codex/policy.json` as a sibling of `bashDenylist` — block present at `policy.json:44`
- [x] Add no spec/packet/phase IDs or spec paths; any prose stays evergreen — added `description` is durable, no IDs
- [x] Keep existing `bashDenylist` / `bash_denylist` keys untouched — both denylists intact and unchanged

### Phase 3: Verification
- [x] Validate `.codex/policy.json` parses as JSON — `node -e JSON.parse` exit 0
- [x] Deny-case: a guarded tool (bare + namespace variant) without a valid token returns a deny decision against the real policy file — bare + both namespace forms deny
- [x] No-block-transport: a non-guarded tool and a read-only/transport tool return `{}` (no deny); an ordinary non-denylisted Bash command still returns `{}` — `get_run`, `list_projects`, `Read`, `Bash git status` all empty-allow
- [x] No-regression: the existing Codex hook vitest suite passes 11/11 — 11 passed, test file unmodified

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| JSON validity | `.codex/policy.json` parses | `node -e JSON.parse` or `python3 -m json.tool` |
| Runtime deny-case | guarded tool (bare + `mcp__open-design__*` variant) without token → deny | node harness importing `dist/hooks/codex/pre-tool-use.js`, `policyPath` = real `.codex/policy.json` |
| Runtime no-block-transport | `get_run` (read), a non-guarded tool, and an ordinary Bash command → `{}` | same node harness |
| Regression | existing suite still 11/11 | `vitest run codex-pre-tool-use` |

The runtime harness uses the shipped `handleCodexPreToolUse(input, { policyPath })` entry point so it reads the actual `.codex/policy.json`. The dist JS is current (the hook `.ts` is not changed), so no rebuild is required. The vitest suite injects its own `readPolicy`/`policyPath` deps and never reads the real `.codex/policy.json`, so this data change cannot alter its 11 results — running it confirms no accidental regression.

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| PreToolUse precondition branch (`evaluateOpenDesignPrecondition`) | Internal (landed) | Green | Without it the policy list is inert |
| `resolveGuardedOpenDesignTools` reading both policy locations | Internal (landed) | Green | Determines accepted policy shape |
| `tool_surface.md` mutating/destructive classification | Internal (reference) | Green | Source of the 7 tool names |
| `guarded_proxy.md` `guarded.mcpTools` allowlist | Internal (reference) | Green | Authoritative 7-tool list |
| Compiled `dist/hooks/codex/pre-tool-use.js` | Internal (built) | Green | Needed by the runtime harness |

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A legitimate non-design tool or pure-transport read is denied, or the policy file fails to parse.
- **Procedure**: Remove the `openDesignPreconditions` block from `.codex/policy.json`. The branch reverts to inert/fail-open immediately (empty list → fall-through). No code revert is needed because the hook source was never modified.

<!-- /ANCHOR:rollback -->
---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Confirm no schema gap) ──> Phase 2 (Populate policy) ──> Phase 3 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Confirm schema | Landed PreToolUse branch | Populate |
| Populate | Confirm schema | Verify |
| Verify | Populate | None |

<!-- /ANCHOR:phase-deps -->
---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Confirm no schema gap | Low | 10 minutes |
| Populate policy | Low | 15 minutes |
| Verification (harness + vitest + JSON) | Low | 30 minutes |
| **Total** | | **~1 hour** |

<!-- /ANCHOR:effort -->
---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Captured pre-change `.codex/policy.json` (git tracks it; `git diff` is the snapshot) — VCS-tracked, additive block only
- [x] Confirmed read-only/transport tool names are absent from the new list — 11 read/transport names verified absent
- [x] Confirmed vitest baseline is 11/11 before the change — suite passes 11/11, unaffected by the data change

### Rollback Procedure
1. **Immediate**: `git checkout -- .codex/policy.json` (or delete the `openDesignPreconditions` block).
2. **Effect**: `guardedTools` resolves to `[]` → branch is inert/fail-open again.
3. **Verify**: Re-run the runtime harness; guarded tools return `{}` (no enforcement), transport unaffected.

### Data Reversal
- **Has data migrations?** No — single JSON file, fully reversible via VCS.

<!-- /ANCHOR:enhanced-rollback -->

---

<!--
LEVEL 2 PLAN
- Core + Level 2 addendum (phase deps, effort, enhanced rollback)
- Data-only change to .codex/policy.json; no hook source edit (no schema gap)
-->
