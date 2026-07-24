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
    recent_action: "Built+tested all 10 adapters, extended hooks.v1.json, re-confirmed dormant live"
    next_safe_action: "Regenerate description/graph-metadata, validate --recursive --strict, commit"
    blockers: ["devin auth login needs an interactive OAuth flow (true interactive-mode firing still untested)"]
    key_files: [".devin/hooks.v1.json", "../004-devin-hook-adapter-layer/decision-record.md"]
    session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "cli-devin-revival-followups", parent_session_id: null }
    completion_pct: 100
    open_questions: ["Does true interactive devin mode (no TTY here) fire hooks where -p does not?"]
    answered_questions: ["Codex's own phase 004 pre-shipped 4 lifecycle adapters before needing its 007; Devin's phase 004 only pre-shipped 2, so this phase is structurally bigger than its Codex analog.", "Is Devin SessionEnd stdout-lenient like SessionStart, or strict like Stop? Moot pending live verification (dormant under -p either way) -- registered session-cleanup.sh directly since Devin has a real SessionEnd event, unlike Codex which has none.", "Original file matrix (9 files) missed spec-gate-enforce.mjs -- the actual PreToolUse(exec|edit) gate-3 BLOCK, not just the UserPromptSubmit classify step. Research §10 (C-02/C-05/G-01) had already scoped it; added as a 10th file."]
---
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Devin hook parity

## EXECUTIVE SUMMARY
Phase 004 deliberately proved out only 2 of Devin's 8 lifecycle events (`SessionStart`, `UserPromptSubmit`) before deferring the rest as P2/unscheduled. This phase closes that gap completely, mirroring `027-cli-codex-revival/007-codex-hook-parity`: every Claude hook and OpenCode plugin now has a correct Devin adapter, a documented native-import equivalent, or an explicit documented gap - never a silent omission. **Implemented and live-tested**: 10 new adapter files (9 originally planned + `spec-gate-enforce.mjs`, a real parity gap the original file matrix missed) plus a fully-extended `.devin/hooks.v1.json` covering all 7 event categories Claude registers (`PermissionRequest` explicit-empty, `PreCompact`↔`PostCompaction` is the one genuine naming/semantic divergence, not a gap). Re-tested live against `devin -p` after the extension - still confirmed dormant, matching phase 004's finding exactly; no new firing behavior introduced or discovered.

<!-- ANCHOR:metadata -->
## 1. METADATA
| Field | Value |
|---|---|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Complete (dormant) |
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
- `SessionEnd` registered directly (`session-cleanup.sh`), since Devin - unlike Codex, which has no `SessionEnd` event at all - has a genuine native `SessionEnd` lifecycle event (confirmed phase 001 contract-pin); live stdout-strictness is untestable while hooks stay dormant under `-p`, so this is a structural decision, not a behavior-verified one.
- Resolving phase 004's still-open REQ-007 (`.devin/hooks.v1.json` discovery/precedence order): confirmed moot, not resolved - the project-level file is never consulted at all under `-p`, so discovery-order between a project file and a user-global installer cannot matter until that changes.

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
| `mcp-code-mode/runtime/hooks/devin/mcp-route-guard.cjs` | Created (confirmed) | PreToolUse(`^mcp__.*$`), warn-only, wraps `mcp-route-guard.cjs` core. Dormant for two reasons (packet-wide -p finding + no external MCP family registered yet); re-evaluated by phase 009. |
| `system-spec-kit/runtime/hooks/devin/spec-gate-enforce.mjs` | Created (confirmed, 10th file, gap fix) | PreToolUse(`^exec$`\|`^edit$`), deny-capable, calls `spec-gate-core.mjs`'s `evaluateMutation()` directly. Original file matrix missed this - research §10 (C-02/C-05/G-01) had already scoped it as the real gate-3 BLOCK, distinct from `spec-gate-classify.mjs`'s advisory classify step. Tested: non-mutating tool, exec, edit-with-file_path, and malformed stdin - all fail open correctly. |
| `system-spec-kit/mcp-server/hooks/devin/completion-evidence-stop.cjs` | Created (confirmed) | Stop, advisory, wraps `completion-evidence-sentinel.cjs`. Tested with a completion-claim payload. |
| `system-spec-kit/mcp-server/hooks/devin/session-stop.ts` | Created (confirmed) | Stop, delegates to compiled `../claude/session-stop.js` via the shared `shared.ts` phase 004 built. Typechecked 0 errors, compiled, tested. |
| `system-spec-kit/mcp-server/hooks/devin/post-compaction.cjs` | Created (confirmed) | PostCompaction, bespoke 5-step recovery chain (research §8). Tested with and without a `summary` field; two authoring bugs caught and fixed before testing (broken `&&`-chained `require()`, literal raw control-character bytes in the sanitizer regex). |
| `system-deep-loop/runtime/hooks/devin/task-dispatch-guard.cjs` | Created (confirmed) | PreToolUse(`^run_subagent$`), wraps `dispatch-guard.cjs`. Mirrors Claude's real Task adapter (not Codex's fold-in) since `run_subagent` is a first-class Devin tool. Tested happy-path + fail-open. |
| `.devin/hooks.v1.json` | Modified (confirmed) | Extends phase 004's 2-event registration to all 7 event categories Claude covers (`SessionStart` +4 wiring-only scripts, `UserPromptSubmit` unchanged, `PreToolUse` x5 matchers, `PostToolUse` x3 matchers, explicit empty `PermissionRequest`, `Stop` x2, `PostCompaction` x1, `SessionEnd` x1 registered directly). JSON-validated; re-tested live against `devin -p` post-extension - still dormant, no regression. |
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Priority | Status |
|---|---|---|---|
| REQ-001 | Every one of the 6 remaining guard cores gets a Devin adapter, following the exact stdin-read/fail-open/translate/emit pattern already proven for Codex. | P0 | Done - all 6 built + tested. |
| REQ-002 | `post-compaction.cjs` implements the full 5-step bespoke recovery chain from `research-devin-hooks-portability/research.md` §8, not a naive port. | P0 | Done - tested with and without `summary`; 2 authoring bugs fixed pre-test. |
| REQ-003 | `task-dispatch-guard.cjs` is a real adapter, not folded into another recognizer - explicitly diverging from the Codex precedent with recorded rationale. | P0 | Done. |
| REQ-004 | `.devin/hooks.v1.json` registers all 8 lifecycle events, including an explicit empty `PermissionRequest` array with a documented reason. | P0 | Done - JSON-validated, live re-tested, still dormant. |
| REQ-005 | The `SessionEnd` decision (direct registration vs. fold into `Stop`) is made from live evidence of Devin's actual stdout-handling behavior, never assumed identical to Codex (which has no `SessionEnd` event at all). | P0 | Decided structurally (registered directly - Devin has a real `SessionEnd` event, Codex does not); live stdout-strictness evidence is unobtainable while hooks stay dormant under `-p`. |
| REQ-006 | Phase 004's still-open discovery-order question (project-level `.devin/hooks.v1.json` vs. an idempotent installer into a user-global location) is resolved before this phase's registrations are finalized. | P0 | Resolved as moot - `-p` never consults hook config at all, so discovery-order between locations cannot matter until that changes. |
| REQ-007 | All 8 runtime-neutral guard cores (including `dispatch-guard.cjs` and `spec-gate-core.mjs`) remain byte-unchanged; adapters translate only. | P1 | Done - `git diff --stat` confirmed empty on every core. |
| REQ-008 | `decision-record.md` records all 5 ADRs (contract/discovery, dual-pattern confirmation, deny-capability verification, registration location, honest divergent/dormant/empty handling). | P1 | Done. |
| REQ-009 | `mcp-route-guard.cjs`'s dormancy (no external MCP family registered yet) is documented as provisional, explicitly re-evaluated by phase 009 once real MCP servers exist. | P2 | Done - documented, forwarded to 009. |
| REQ-010 | `spec-gate-enforce.mjs` (PreToolUse `exec`/`edit` gate-3 BLOCK) is built - a real parity gap the original 9-file matrix missed despite the research already scoping it. | P0 | Done - added as a 10th file, tested (non-mutating/exec/edit/malformed-stdin). |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
- SC-001: DONE - all 11 new/modified files listed in §3 exist and pass syntax/type/lint checks (`tsc --noEmit` 0 errors for `session-stop.ts`; `node --check` for every `.cjs`; direct execution for every `.mjs`).
- SC-002: DONE (with the packet-wide caveat) - every wired adapter was directly invoked with realistic and malformed/missing-field payloads and behaved as designed (allow/deny/advise/fail-open as appropriate); `devin -p` itself was re-run against the fully-extended `.devin/hooks.v1.json` and confirmed still dormant, matching phase 004's finding - no hook output was observed, consistent with every prior test in this packet.
- SC-003: DONE - `git diff --stat` on all 9 neutral cores (including `spec-gate-core.mjs`) is empty.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
- **R-001**: Devin's project-level `.devin/hooks.v1.json` could be inert the way Codex's project-level `.codex/hooks.json` was - Codex needed an idempotent installer into `~/.codex/hooks.json`. Mitigation: REQ-006 resolves this as a blocking precondition, not an assumption.
- **R-002**: Devin's `Stop`/`SessionEnd` stdout-parsing strictness is unconfirmed. Mitigation: REQ-005 gates the `SessionEnd` decision on live evidence.
- **R-003**: `post-compaction.cjs`'s bespoke logic has no working precedent to copy (Codex has no `PostCompaction`-shaped adapter). Mitigation: the 5-step chain is already fully designed in the hooks-portability research, not invented fresh here.
- **Dependency**: This phase depends only on `004-devin-hook-adapter-layer` landing first (not 005/006/007). It shares the packet-wide blocker of needing an authenticated `devin` session for any live verification.
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
- As the implementer of phase 009, I want `mcp-route-guard.cjs`'s dormancy status already documented so I know exactly what to re-evaluate once real MCP servers are registered.

## 12. OPEN QUESTIONS
- **ANSWERED by phase 004 (2026-07-24)**: project-level `.devin/hooks.v1.json` does NOT work under `devin -p` -- confirmed dead across every registration path tested (standalone file with/without a version field, `.devin/config.json`'s `"hooks"` key, deliberately malformed JSON producing zero parse errors, and `--agent-config`'s own strict parser rejecting a `hooks` field outright). This applies to every hook this phase builds, not just `SessionStart`/`UserPromptSubmit`.
- **ANSWERED by this phase (2026-07-24)**: re-tested the fully-extended `.devin/hooks.v1.json` (all 7 event categories, 15 command entries) live against `devin -p` after building all 10 adapters - still zero hook output observed. The dormancy finding is packet-wide and extension-invariant, not specific to phase 004's original 2-event registration.
- **ANSWERED by this phase (2026-07-24)**: `SessionEnd` registered directly (`session-cleanup.sh`), not folded into `Stop`. Rationale is structural (Devin has a real native `SessionEnd` event per phase 001's contract-pin; Codex has none and had to fold), not behavior-verified - live stdout-strictness evidence is unobtainable while hooks stay dormant under `-p`.
- **Only remaining open question**: does true interactive `devin` mode (untested here - no TTY available in this environment) fire hooks where `-p` does not? This is the one gap every dormancy finding in this packet (phases 001, 004, 008) has left unresolved.
- `mk-goal.js`/`mk-speckit-completion.js` have no hook-based Devin target at all - forwarded as a new open question on the parent `spec.md`, not solved here.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS
- `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md` (this phase)
- `../004-devin-hook-adapter-layer/` (real dependency/predecessor, do not modify)
- `../007-docs-agents-governance-and-closeout/` (sequential-numbering neighbor only, not a dependency - see Phase Transition Rules in `../spec.md`)
- `../research-devin-hooks-portability/research.md` (source research, esp. §8 PostCompaction design, §10 skeleton)
- `../009-devin-mcp-host-integration/spec.md` (re-evaluates `mcp-route-guard.cjs` dormancy)
- `../../027-cli-codex-revival/007-codex-hook-parity/` (structural + ADR precedent)
