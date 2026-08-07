---
title: "Feature Specification: Devin hook parity"
description: "Give every Claude hook and OpenCode plugin a correct Devin adapter, native-import equivalent, or documented gap, via thin Devin adapters over the same 7 runtime-neutral cores cli-codex already uses."
trigger_phrases: ["devin hook parity", "devin hooks.v1.json", "devin postcompaction adapter", "devin task-dispatch-guard"]
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/029-cli-devin-revival/008-devin-hook-parity"
    last_updated_at: "2026-07-24T18:30:00Z"
    last_updated_by: "claude-code"
    recent_action: "Corrected phase status after documented-schema live verification"
    next_safe_action: "Use phase 011 evidence for current event status and retained caveats"
    blockers: []
    key_files: [".devin/hooks.v1.json", "../004-devin-hook-adapter-layer/decision-record.md"]
    session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "cli-devin-revival-followups", parent_session_id: null }
    completion_pct: 100
    open_questions: ["Do PermissionRequest and PostCompaction fire when those events occur?", "Does run_subagent produce the registered tool name and expected payload shape?", "Does the deny branch block a real tool call when a block-severity fixture exists?"]
    answered_questions: ["Six lifecycle events fire under devin -p with the documented registration schema.", "SessionEnd fired and remains registered directly.", "The original file matrix missed spec-gate-enforce.mjs; it was added as the 10th adapter."]
---
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Devin hook parity

## EXECUTIVE SUMMARY
Phase 004 built the first 2 Devin lifecycle adapters and this phase closed the remaining parity gaps with 10 new adapter files plus full lifecycle registration. **Status correction (2026-07-25)**: the original zero-firing pass used an unsupported wrapper schema. With top-level event arrays and nested matcher groups, `devin -p` observed `SessionStart`, `UserPromptSubmit`, `PreToolUse`, `PostToolUse`, `Stop` and `SessionEnd`. `PermissionRequest`, `PostCompaction`, `run_subagent` and the deny branch retain explicit unobserved caveats.

<!-- ANCHOR:metadata -->
## 1. METADATA
| Field | Value |
|---|---|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Complete (six lifecycle events observed live) |
| **Created** | 2026-07-24 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | `cli-external-orchestration/029-cli-devin-revival` |
| **Predecessor** | `004-devin-hook-adapter-layer` |
| **Successor** | None (009 depends on 001, not this phase) |
| **Handoff Criteria** | Every one of the 7 runtime-neutral guard cores gets a Devin adapter or an explicit documented gap; `.devin/hooks.v1.json` registers all 8 lifecycle events (including an intentionally empty `PermissionRequest`); no neutral core is modified. |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
This repo enforces its scope-lock and quality discipline through 7 shared runtime-neutral guard cores, each with existing Claude and OpenCode transports. `cli-codex` already gets full coverage via its own `007-codex-hook-parity` phase (14 adapter files across `mcp-server/hooks/codex/` and its 5 sibling packet directories, all registered in `.codex/hooks.json`, live-verified against Codex 0.144.2). `cli-devin`'s own phase 004 covers only guard core #1 (spec-gate) plus 2 lifecycle-completion events - the other 6 cores, 2 more lifecycle-completion adapters, one bespoke semantic adapter, and one deliberate divergence from the Codex precedent all remain unbuilt.

### Purpose
Build the remaining Devin hook adapters using the exact pattern already proven for Codex: read stdin JSON bounded and fail-open, either delegate to the compiled Claude adapter (`spawnSync` + envelope translation) or call the shared core directly with a thin tool-vocabulary translation layer, then emit only Devin's native `hookSpecificOutput` envelope. One adapter (`PostCompaction`) cannot use either pattern - it needs bespoke logic for a genuine semantic gap (Devin fires after compaction with only `session_id`+`summary`, unlike Claude's before-compaction `PreCompact`). One adapter (`task-dispatch-guard`) deliberately diverges from Codex's approach: Codex folded this into its exec-shape recognizer because it has no native Task tool, but Devin's `run_subagent` is a real first-class dispatch tool and deserves a real adapter.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- 6 new adapters covering the 6 remaining runtime-neutral guard cores (dispatch-rule-checks, dispatch-audit, post-edit-router, freshness-core, mcp-route-guard, completion-evidence-sentinel).
- 1 more guard-core adapter beyond the original 9-file matrix: `spec-gate-enforce.mjs` (PreToolUse `exec`/`edit`, deny-capable), calling `spec-gate-core.mjs`'s `evaluateMutation()` directly - the actual gate-3 BLOCK, distinct from `spec-gate-classify.mjs`'s UserPromptSubmit-time advisory classify step. Already scoped in the research (§10, C-02/C-05/G-01) but dropped from the original phase file matrix; added once the gap surfaced during implementation.
- 2 more lifecycle-completion adapters phase 004 didn't build: `session-stop.ts` (Stop, delegates to compiled Claude adapter) and `post-compaction.cjs` (PostCompaction, bespoke 5-step recovery logic).
- 1 new dispatch-guard adapter (`task-dispatch-guard.cjs`, PreToolUse `run_subagent`) - a deliberate divergence from Codex's fold-in, justified by Devin's real `run_subagent` tool.
- Wiring-only registration of 4 existing shell/python scripts into `.devin/hooks.v1.json`'s `SessionStart` array (`worktree-guard.sh`, `check-git-hooks.sh`, `check-dist-staleness.sh --all`, `install-codex-hooks.mjs --check`), each anchored at `${DEVIN_PROJECT_DIR}`.
- An explicit empty `"PermissionRequest": []` entry, documented as "no Claude source handler exists to port."
- `SessionEnd` registered directly (`session-cleanup.sh`) because Devin has a native `SessionEnd` event. The event fired under the corrected schema; no dedicated adverse stdout-shape test was run.
- Resolve phase 004's discovery question: the project-level `.devin/hooks.v1.json` is consulted under `devin -p` when it uses the documented nested event schema.

### Out of Scope
- Phase 004's already-built `spec-gate-classify.mjs`/`session-start.ts`/`user-prompt-submit.ts` - not modified, not duplicated here. (Correction: the original spec text assumed phase 004 had also built `spec-gate-enforce.mjs` - it hadn't. That file is genuinely new work in this phase; see Files to Change.)
- The Devin-as-MCP-host surface - see `009-devin-mcp-host-integration`.
- `mk-goal.js` and `mk-speckit-completion.js` alternatives - neither has a hook-based Devin target at all (confirmed in the hooks-portability research); recorded as an explicit gap here and as a new open question on the parent `spec.md`, not invented into a speculative future phase.
- Actually running `devin auth login` - operator-only.

### Files to Change
| File Path | Change Type | Description |
|---|---|---|
| `cli-opencode/scripts/hooks/devin/dispatch-preflight-lint.mjs` | Created (confirmed) | PreToolUse(`^exec$`), deny-capable, wraps `dispatch-rule-checks.mjs`. Live-tested: non-dispatch cmd -> allow; real `opencode run` dispatch cmd -> real `stdin-redirect-required` advisory. |
| `cli-opencode/scripts/hooks/devin/dispatch-audit-posttooluse.mjs` | Created (confirmed) | PostToolUse(`^exec$`), observe-only, wraps `dispatch-audit.mjs`. Tested happy-path + fail-open. |
| `sk-code/code-quality/scripts/hooks/devin/post-edit-quality.cjs` | Created (confirmed) | PostToolUse(`^edit$`), advisory, wraps `post-edit-router.cjs`. Tested against a real file edit. |
| `system-code-graph/runtime/hooks/devin/code-graph-freshness.cjs` | Created (confirmed) | PostToolUse(`^edit$`), wraps `freshness-core.cjs`. Tested against a real file edit. |
| `mcp-code-mode/runtime/hooks/devin/mcp-route-guard.cjs` | Created (confirmed) | PreToolUse(`^mcp__.*$`), warn-only, wraps the shared core. Registered and directly tested, but not currently exercised because no external non-`mk_` MCP family is registered under Devin. |
| `system-spec-kit/runtime/hooks/devin/spec-gate-enforce.mjs` | Created (confirmed, 10th file, gap fix) | PreToolUse(`^exec$`\|`^edit$`), deny-capable, calls `spec-gate-core.mjs`'s `evaluateMutation()` directly. Original file matrix missed this - research §10 (C-02/C-05/G-01) had already scoped it as the real gate-3 BLOCK, distinct from `spec-gate-classify.mjs`'s advisory classify step. Tested: non-mutating tool, exec, edit-with-file_path, and malformed stdin - all fail open correctly. |
| `system-spec-kit/mcp-server/hooks/devin/completion-evidence-stop.cjs` | Created (confirmed) | Stop, advisory, wraps `completion-evidence-sentinel.cjs`. Tested with a completion-claim payload. |
| `system-spec-kit/mcp-server/hooks/devin/session-stop.ts` | Created (confirmed) | Stop, delegates to compiled `../claude/session-stop.js` via the shared `shared.ts` phase 004 built. Typechecked 0 errors, compiled, tested. |
| `system-spec-kit/mcp-server/hooks/devin/post-compaction.cjs` | Created (confirmed) | PostCompaction, bespoke 5-step recovery chain (research §8). Tested with and without a `summary` field; two authoring bugs caught and fixed before testing (broken `&&`-chained `require()`, literal raw control-character bytes in the sanitizer regex). |
| `system-deep-loop/runtime/hooks/devin/task-dispatch-guard.cjs` | Created (confirmed) | PreToolUse(`^run_subagent$`), wraps `dispatch-guard.cjs`. Mirrors Claude's real Task adapter (not Codex's fold-in) since `run_subagent` is a first-class Devin tool. Tested happy-path + fail-open. |
| `.devin/hooks.v1.json` | Modified (confirmed) | Covers all 8 lifecycle events with 11 matcher groups and 19 commands. Corrected to top-level event arrays with nested matcher groups and observed live under `devin -p`. |
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Priority | Status |
|---|---|---|---|
| REQ-001 | Every one of the 6 remaining guard cores gets a Devin adapter, following the exact stdin-read/fail-open/translate/emit pattern already proven for Codex. | P0 | Done - all 6 built + tested. |
| REQ-002 | `post-compaction.cjs` implements the full 5-step bespoke recovery chain from `research-devin-hooks-portability/research.md` §8, not a naive port. | P0 | Done - tested with and without `summary`; 2 authoring bugs fixed pre-test. |
| REQ-003 | `task-dispatch-guard.cjs` is a real adapter, not folded into another recognizer - explicitly diverging from the Codex precedent with recorded rationale. | P0 | Done. |
| REQ-004 | `.devin/hooks.v1.json` registers all 8 lifecycle events, including an explicit empty `PermissionRequest` array with a documented reason. | P0 | Done - 8 events, 11 matcher groups and 19 commands; six events observed live. |
| REQ-005 | The `SessionEnd` decision remains explicit and evidence-ranked. | P0 | Registered directly because Devin has the native event; event firing observed, adverse stdout handling not separately tested. |
| REQ-006 | Phase 004's discovery question is resolved before registrations are trusted. | P0 | Resolved - project-level registration works under `devin -p` with the documented nested schema. |
| REQ-007 | All 8 runtime-neutral guard cores (including `dispatch-guard.cjs` and `spec-gate-core.mjs`) remain byte-unchanged; adapters translate only. | P1 | Done - `git diff --stat` confirmed empty on every core. |
| REQ-008 | `decision-record.md` records all 5 ADRs (contract/discovery, dual-pattern confirmation, deny-capability verification, registration location and honest divergent/unobserved/empty handling). | P1 | Done. |
| REQ-009 | `mcp-route-guard.cjs`'s no-external-family condition is documented as provisional and re-evaluated by phase 009. | P2 | Done - documented and forwarded to 009. |
| REQ-010 | `spec-gate-enforce.mjs` (PreToolUse `exec`/`edit` gate-3 BLOCK) is built - a real parity gap the original 9-file matrix missed despite the research already scoping it. | P0 | Done - added as a 10th file, tested (non-mutating/exec/edit/malformed-stdin). |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
- SC-001: DONE - all 11 new/modified files listed in §3 exist and pass syntax/type/lint checks (`tsc --noEmit` 0 errors for `session-stop.ts`; `node --check` for every `.cjs`; direct execution for every `.mjs`).
- SC-002: DONE - every wired adapter was directly invoked with realistic and malformed/missing-field payloads, and corrected-schema `devin -p` observed six lifecycle events end to end.
- SC-003: DONE - `git diff --stat` on all 9 neutral cores (including `spec-gate-core.mjs`) is empty.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
- **R-001**: Devin's project-level `.devin/hooks.v1.json` could be inert the way Codex's project-level `.codex/hooks.json` was - Codex needed an idempotent installer into `~/.codex/hooks.json`. Mitigation: REQ-006 resolves this as a blocking precondition, not an assumption.
- **R-002**: Devin's `Stop`/`SessionEnd` stdout-parsing strictness is unconfirmed. Mitigation: REQ-005 gates the `SessionEnd` decision on live evidence.
- **R-003**: `post-compaction.cjs`'s bespoke logic has no working precedent to copy (Codex has no `PostCompaction`-shaped adapter). Mitigation: the 5-step chain is already fully designed in the hooks-portability research, not invented fresh here.
- **Dependency**: This phase depends only on `004-devin-hook-adapter-layer` landing first. Hook live verification succeeded without treating authentication as a hook-availability blocker.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. NON-FUNCTIONAL REQUIREMENTS
- NFR-P01: Hook adapters add no perceptible latency to a dispatched Devin session.
- NFR-S01: No adapter logs or transmits raw payload contents that could contain user secrets.

## 8. EDGE CASES
- Malformed/missing stdin JSON on any adapter - must fail open (approve/no-op), matching the Codex sibling discipline.
- `PostCompaction` fires with a null `summary` - the bounded `memory_context(mode=resume)` fallback must handle this without crashing.
- `run_subagent`'s exact required-field schema is unconfirmed until a live capture - `task-dispatch-guard.cjs` must not assume unverified fields.

## 9. COMPLEXITY ASSESSMENT
High - 9 new files across 6 different skill-packet directories, 1 genuinely novel semantic adapter, 1 deliberate architectural divergence from an established precedent, and a blocking live-verification dependency.

## 10. RISK MATRIX
| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Project-level hooks.v1.json inert | Medium | High | REQ-006 resolves before registration finalized |
| SessionEnd stdout strictness unknown | Medium | Medium | REQ-005 gates decision on live evidence |
| PostCompaction logic incomplete without live testing | Medium | Medium | 5-step design already researched; live-verify before claiming done |

## 11. USER STORIES
- As a maintainer, I want every guard hook that protects this repo to fire correctly regardless of which CLI executor (Claude, Codex, OpenCode, or Devin) is doing the work.
- As the implementer of phase 009, I want `mcp-route-guard.cjs`'s no-external-family status documented so I know what to re-evaluate once real MCP servers are registered.

## 12. OPEN QUESTIONS
- **CORRECTED 2026-07-25**: project-level `.devin/hooks.v1.json` works under `devin -p` with top-level event arrays and nested matcher groups. The old wrapper-shape tests are superseded.
- **ANSWERED**: the current registration contains 8 events, 11 matcher groups and 19 commands; six lifecycle events fired in one corrected-schema session.
- **ANSWERED**: `SessionEnd` remains registered directly and its event firing was observed.
- **OPEN**: `PermissionRequest`, `PostCompaction`, `run_subagent` and the deny branch remain unobserved end to end.
- `mk-goal.js`/`mk-speckit-completion.js` have no hook-based Devin target at all - forwarded as a new open question on the parent `spec.md`, not solved here.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS
- `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md` (this phase)
- `../004-devin-hook-adapter-layer/` (real dependency/predecessor, do not modify)
- `../007-docs-agents-governance-and-closeout/` (sequential-numbering neighbor only, not a dependency - see Phase Transition Rules in `../spec.md`)
- `../research-devin-hooks-portability/research.md` (source research, esp. §8 PostCompaction design, §10 skeleton)
- `../009-devin-mcp-host-integration/spec.md` (re-evaluates the MCP route guard when external families exist)
- `../../027-cli-codex-revival/007-codex-hook-parity/` (structural + ADR precedent)
