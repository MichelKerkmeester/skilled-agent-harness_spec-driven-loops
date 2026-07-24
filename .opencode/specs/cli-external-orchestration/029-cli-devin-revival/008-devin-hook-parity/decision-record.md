---
title: "Decision Record: Devin hook parity"
description: "5 ADRs governing the Devin hook parity phase: contract/discovery resolution, dual adapter pattern, deny-capability verification, registration location, honest divergent/dormant/empty handling."
trigger_phrases: ["devin hook parity ADR", "devin hooks.v1.json discovery"]
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/029-cli-devin-revival/008-devin-hook-parity"
    last_updated_at: "2026-07-24T06:43:46Z"
    last_updated_by: "claude-code"
    recent_action: "Authored 5 ADRs for phase 008; all Proposed, none yet Accepted"
    next_safe_action: "Live-verify ADR-001's contract/discovery questions before implementation"
    blockers: ["devin auth login needed for live verification of all 5 ADRs"]
    key_files: ["spec.md", "plan.md"]
    session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "cli-devin-revival-followups", parent_session_id: null }
    completion_pct: 0
    open_questions: ["Does project-level .devin/hooks.v1.json work or is an installer needed?", "Is Devin SessionEnd stdout-lenient or strict?"]
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->
# Decision Record: Devin hook parity

<!-- ANCHOR:adr-001 -->
## ADR-001: Contract and discovery-order resolution for the 6 remaining events

<!-- ANCHOR:adr-001-context -->
### Context
Phase 004 already pinned `SessionStart` and `UserPromptSubmit`. Six events remain unconfirmed at field level (`PreToolUse`, `PostToolUse`, `Stop`, `PostCompaction`, `SessionEnd`, `PermissionRequest`), and phase 004's own REQ-007 ("`.devin/hooks.v1.json` discovery order... confirmed live before the file is shipped") was never resolved - it stayed open through that phase's authoring.

**Constraints**: Codex's own equivalent question had a genuine hard-won surprise - Codex's project-level `.codex/hooks.json` turned out inert; only `~/.codex/hooks.json` (user-global) was live, requiring an idempotent installer (`install-codex-hooks.mjs`). Devin's own documentation claims project-level `.devin/config.json`/`.devin/hooks.v1.json` is a supported tier, but that claim has not been live-tested against the actual installed binary.
<!-- /ANCHOR:adr-001-context -->

<!-- ANCHOR:adr-001-decision -->
### Decision
**We chose**: Treat Devin's documented project-level support as unverified until a live test proves it, and gate all of phase 008's registration work on that live test (T002), rather than assuming either outcome.

**How it works**: Write a minimal single-event `.devin/hooks.v1.json` test registration, launch a `devin` session in this repo, and confirm the hook actually fires. If it fires, proceed with project-level registration as planned. If it does not, build `install-devin-hooks.mjs` (T019) mirroring `install-codex-hooks.mjs`'s idempotent backup-and-merge pattern before any further registration work.
<!-- /ANCHOR:adr-001-decision -->

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered
| Option | Pros | Cons | Score |
|---|---|---|---|
| (a) Live-test first, branch on evidence [chosen] | No wasted work either direction; matches how the Codex surprise was actually discovered | Requires an authenticated session before any registration task can close | 9/10 |
| (b) Assume project-level works (trust Devin's docs) | Faster to start | Could silently repeat the exact Codex surprise, wasting all downstream registration work | 3/10 |
| (c) Build the installer preemptively regardless of outcome | Removes the live-test dependency | Extra unnecessary code if project-level actually works; Devin's docs do claim project-level support | 4/10 |
<!-- /ANCHOR:adr-001-alternatives -->

<!-- ANCHOR:adr-001-consequences -->
### Consequences
- What improves: registration work is never built on an unverified assumption; this repo has already been burned once by exactly this class of surprise (Codex).
- What it costs: the entire phase is gated on an authenticated `devin` session before any registration task can be marked complete.
- Risks table:
  | Risk | Impact | Mitigation |
  |---|---|---|
  | Live test itself is ambiguous (hook fires sometimes, not others) | M | Treat as inert unless it fires reliably across at least 3 fresh sessions |
<!-- /ANCHOR:adr-001-consequences -->

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks
| # | Check | Result | Evidence |
|---|---|---|---|
| 1 | Necessary? | PASS | Codex's own precedent proves this exact class of assumption can be wrong |
| 2 | Beyond Local Maxima? | PASS | Considered assuming success (rejected) and pre-building the installer regardless (rejected as premature) |
| 3 | Sufficient? | PASS | A single live test conclusively answers the question either way |
| 4 | Fits Goal? | PASS | Directly resolves phase 004's carried-over open REQ-007 |
| 5 | Open Horizons? | PASS | If project-level works, `install-devin-hooks.mjs` is simply never built - no wasted design |
<!-- /ANCHOR:adr-001-five-checks -->

<!-- ANCHOR:adr-001-impl -->
### Implementation
- What changes: a minimal test `.devin/hooks.v1.json` registration (T002), evaluated live, before any of T005-T017 proceed.
- How to roll back: delete the test registration file; no other change is made until the outcome is known.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Dual adapter pattern, extended to `post-compaction.cjs`'s exception

<!-- ANCHOR:adr-002-context -->
### Context
Phase 004's own ADR-001 already established two adapter shapes for Devin, mirroring Codex: direct-core-call (import the shared `.mjs`/`.cjs` core, add a thin tool-vocabulary translation layer) and delegate-to-compiled-Claude-adapter (`spawnSync` the compiled `hooks/claude/*.js` binary, translate its output). This phase must apply that same pattern consistently across 8 new files - and explicitly document the one file that cannot use either shape.

**Constraints**: `PostCompaction` has no Claude-side equivalent to spawn (Claude's `PreCompact` fires before compaction with full transcript access; Devin's fires after, with only `session_id` + possibly-null `summary`) and no existing shared core to import (this is a genuinely new semantic concern, not a transport-only translation).
<!-- /ANCHOR:adr-002-context -->

<!-- ANCHOR:adr-002-decision -->
### Decision
**We chose**: Apply direct-core-call to the 6 guard-core adapters (T005-T010) and delegate-to-compiled-adapter to `session-stop.ts` (T012), exactly matching phase 004's established pattern - and build `post-compaction.cjs` (T013) as a third, bespoke shape implementing the 5-step recovery chain from the hooks-portability research directly, with no delegation and no core import.

**How it works**: The bespoke chain: (1) retain `summary` as the first recovery section if present; (2) rehydrate authoritative continuity from active session/spec state (not from the Claude-side transcript, which Devin doesn't expose); (3) fall back to a bounded `memory_context(mode=resume)` call when `summary` is null or incomplete; (4) apply provenance/semantic-safety filtering before any model-visible injection; (5) emit the result via `hookSpecificOutput.additionalContext` directly from `PostCompaction` itself, rather than relying on a synthesized follow-up event the way Claude's own handler does.
<!-- /ANCHOR:adr-002-decision -->

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered
| Option | Pros | Cons | Score |
|---|---|---|---|
| (a) Bespoke 5-step chain, no delegation [chosen] | Matches Devin's actual, materially different event shape; already fully designed by prior research | More original code than a transport-only adapter | 8/10 |
| (b) Force-fit the delegate-to-compiled-adapter shape anyway | Consistent with every other adapter | There is no compiled Claude `PreCompact` handler shaped for this - would require inventing a fake spawn target | 2/10 |
| (c) Skip `PostCompaction` entirely, document as a gap | Least work | Discards a real, already-designed recovery capability for no reason | 3/10 |
<!-- /ANCHOR:adr-002-alternatives -->

<!-- ANCHOR:adr-002-consequences -->
### Consequences
- What improves: post-compaction context recovery works under Devin despite the semantic gap, instead of being silently dropped.
- What it costs: one adapter that doesn't follow the otherwise-uniform two-shape pattern - must be clearly documented so a future reader doesn't assume it's a simple port.
- Risks table:
  | Risk | Impact | Mitigation |
  |---|---|---|
  | The 5-step chain has never been live-tested against a real Devin session | M | T021 live-verifies before claiming this adapter done |
<!-- /ANCHOR:adr-002-consequences -->

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks
| # | Check | Result | Evidence |
|---|---|---|---|
| 1 | Necessary? | PASS | Post-compaction context recovery is a real capability worth preserving under Devin |
| 2 | Beyond Local Maxima? | PASS | Force-fitting the standard pattern was considered and rejected as fabricating a nonexistent spawn target |
| 3 | Sufficient? | PASS | The 5-step chain covers the summary-present, summary-null, and no-follow-up-event cases identified in research |
| 4 | Fits Goal? | PASS | Closes a real, previously-unaddressed gap from the hooks-portability research |
| 5 | Open Horizons? | PASS | Live-verification (T021) may refine the exact chain once real Devin behavior is observed |
<!-- /ANCHOR:adr-002-five-checks -->

<!-- ANCHOR:adr-002-impl -->
### Implementation
- What changes: `system-spec-kit/mcp-server/hooks/devin/post-compaction.cjs` created new, standalone.
- How to roll back: delete the file; `.devin/hooks.v1.json`'s `PostCompaction` entry removed.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: Deny-capability verification for `dispatch-preflight-lint.mjs`

<!-- ANCHOR:adr-003-context -->
### Context
Unlike the 5 advisory/warn-only adapters in this phase, `dispatch-preflight-lint.mjs` is deny-capable (mirrors Codex's own equivalent, which can block a `PreToolUse` call outright). A deny-capable guard that silently fails to actually block anything is worse than no guard at all - it creates a false sense of enforcement.
<!-- /ANCHOR:adr-003-context -->

<!-- ANCHOR:adr-003-decision -->
### Decision
**We chose**: Require a live behavioral test - not just a schema-correctness check - proving a deliberately-triggered deny actually stops the tool call under a real `devin` session, before this adapter is marked done.

**How it works**: T021's live session matrix includes a specific case: dispatch a command matching a known-deny rule, and confirm the call is actually blocked (not just that the adapter emits a syntactically-correct deny envelope).
<!-- /ANCHOR:adr-003-decision -->

<!-- ANCHOR:adr-003-alternatives -->
### Alternatives Considered
| Option | Pros | Cons | Score |
|---|---|---|---|
| (a) Live behavioral deny test [chosen] | Only real proof the guard works | Requires an authenticated session | 9/10 |
| (b) Schema-correctness check only (envelope shape matches docs) | No auth needed | Does not prove the block actually happens - the exact failure mode this ADR exists to prevent | 3/10 |
<!-- /ANCHOR:adr-003-alternatives -->

<!-- ANCHOR:adr-003-consequences -->
### Consequences
- What improves: confidence that the one deny-capable guard in this phase genuinely enforces, not just documents an intent.
- What it costs: this specific verification cannot close until an authenticated session is available.
- Risks table:
  | Risk | Impact | Mitigation |
  |---|---|---|
  | Devin's deny envelope field names differ subtly from what docs show | M | Live test catches this directly; CHK-021 requires captured evidence |
<!-- /ANCHOR:adr-003-consequences -->

<!-- ANCHOR:adr-003-five-checks -->
### Five Checks
| # | Check | Result | Evidence |
|---|---|---|---|
| 1 | Necessary? | PASS | A silently-non-functional deny guard is a real security-relevant gap |
| 2 | Beyond Local Maxima? | PASS | Schema-only verification considered and rejected as insufficient |
| 3 | Sufficient? | PASS | One clean behavioral test conclusively proves the block works |
| 4 | Fits Goal? | PASS | Matches this repo's existing standard for the equivalent Codex guard |
| 5 | Open Horizons? | PASS | Same test pattern extends to any future deny-capable Devin adapter |
<!-- /ANCHOR:adr-003-five-checks -->

<!-- ANCHOR:adr-003-impl -->
### Implementation
- What changes: T021's verification scope explicitly includes a live deny-trigger case.
- How to roll back: N/A - this is a verification requirement, not a code change.
<!-- /ANCHOR:adr-003-impl -->
<!-- /ANCHOR:adr-003 -->

---

<!-- ANCHOR:adr-004 -->
## ADR-004: Registration location, conditioned on ADR-001's evidence

<!-- ANCHOR:adr-004-context -->
### Context
ADR-001 resolves *whether* project-level registration works. This ADR records *what to build* in each branch, so the decision isn't made ad hoc mid-implementation.
<!-- /ANCHOR:adr-004-context -->

<!-- ANCHOR:adr-004-decision -->
### Decision
**We chose**: If ADR-001's live test confirms project-level `.devin/hooks.v1.json` works, all of phase 008's registrations (T005-T017) land there directly, extending phase 004's file. If it proves inert, build `install-devin-hooks.mjs` (T019) as an idempotent backup-and-merge installer into the real live location, mirroring `install-codex-hooks.mjs` exactly (same idempotency guarantee, same backup-before-merge safety).
<!-- /ANCHOR:adr-004-decision -->

<!-- ANCHOR:adr-004-alternatives -->
### Alternatives Considered
| Option | Pros | Cons | Score |
|---|---|---|---|
| (a) Conditional branch on ADR-001 evidence [chosen] | No wasted installer code if unneeded | Slightly more design upfront (two possible paths) | 8/10 |
| (b) Always build the installer regardless of outcome | Consistent regardless of finding | Redundant if project-level actually works | 4/10 |
<!-- /ANCHOR:adr-004-alternatives -->

<!-- ANCHOR:adr-004-consequences -->
### Consequences
- What improves: no speculative installer code exists if it's never needed.
- What it costs: T019 stays marked conditional/blocked until ADR-001 resolves.
- Risks table:
  | Risk | Impact | Mitigation |
  |---|---|---|
  | Registration location changes again after a Devin CLI update | L | Re-run ADR-001's live test if `devin` binary version changes materially |
<!-- /ANCHOR:adr-004-consequences -->

<!-- ANCHOR:adr-004-five-checks -->
### Five Checks
| # | Check | Result | Evidence |
|---|---|---|---|
| 1 | Necessary? | PASS | Registrations must land somewhere Devin actually reads |
| 2 | Beyond Local Maxima? | PASS | Always-build-installer alternative considered and rejected as premature |
| 3 | Sufficient? | PASS | Covers both possible ADR-001 outcomes completely |
| 4 | Fits Goal? | PASS | Matches the Codex precedent's own eventual installer need, without assuming it applies identically |
| 5 | Open Horizons? | PASS | Re-evaluable if Devin's own config-loading behavior changes in a future release |
<!-- /ANCHOR:adr-004-five-checks -->

<!-- ANCHOR:adr-004-impl -->
### Implementation
- What changes: either direct extension of `.devin/hooks.v1.json`, or a new `install-devin-hooks.mjs`, depending on ADR-001's evidence.
- How to roll back: delete whichever path was taken; the other was never built.
<!-- /ANCHOR:adr-004-impl -->
<!-- /ANCHOR:adr-004 -->

---

<!-- ANCHOR:adr-005 -->
## ADR-005: Honest handling of divergent, dormant, and empty surfaces

<!-- ANCHOR:adr-005-context -->
### Context
Four surfaces in this phase don't fit a simple "port it" narrative: `PermissionRequest` has no Claude source handler at all; `task-dispatch-guard.cjs` could be folded into another recognizer (as Codex did) or built as a real adapter; `mcp-route-guard.cjs` has no external MCP family registered yet under Devin, mirroring Codex's own documented dormancy; and `SessionEnd` is a genuinely new capability Devin has that Codex never had to solve. Each risks being silently mishandled - either fabricated, silently dropped, or copied from a precedent that doesn't actually apply.
<!-- /ANCHOR:adr-005-context -->

<!-- ANCHOR:adr-005-decision -->
### Decision
**We chose**, per surface:
- `PermissionRequest`: ship an explicit empty `[]` array with an inline comment recording that no Claude source handler exists to port. Never silently omit the key.
- `task-dispatch-guard.cjs`: build a **real** adapter, diverging deliberately from Codex's fold-in - Devin's `run_subagent` is a genuine first-class dispatch tool (unlike Codex, which has no native Task tool), so folding it into another recognizer would lose real signal.
- `mcp-route-guard.cjs`: document as dormant today (no external MCP family registered), explicitly flagged provisional and forward-referenced to phase 009, which re-evaluates it once real MCP servers exist.
- `SessionEnd`: decide from live evidence only (ADR-001/T001), never assume Codex's fold-into-`Stop` precedent applies - Codex made that choice because it has no `SessionEnd` event at all; Devin does.
<!-- /ANCHOR:adr-005-decision -->

<!-- ANCHOR:adr-005-alternatives -->
### Alternatives Considered
| Option | Pros | Cons | Score |
|---|---|---|---|
| (a) Per-surface honest handling as above [chosen] | Each surface gets the treatment its actual facts warrant | Four separate small decisions instead of one blanket rule | 9/10 |
| (b) Blindly mirror every Codex decision | Simple, one rule | Actively wrong for `task-dispatch-guard` and `SessionEnd`, where Devin's real capabilities differ from Codex's | 2/10 |
| (c) Silently omit anything without a clean 1:1 precedent | Least work | Exactly the failure mode this ADR exists to prevent | 1/10 |
<!-- /ANCHOR:adr-005-alternatives -->

<!-- ANCHOR:adr-005-consequences -->
### Consequences
- What improves: no surface in this phase is silently mishandled; every non-obvious decision has recorded rationale a future reader can audit.
- What it costs: four separate small decisions to track, rather than one blanket rule - worth it given at least two of the four would be actively wrong under a blanket "copy Codex" rule.
- Risks table:
  | Risk | Impact | Mitigation |
  |---|---|---|
  | A future maintainer assumes Devin/Codex parity elsewhere without checking | M | This ADR and the accompanying checklist items (CHK-041, CHK-042) exist as a visible flag |
<!-- /ANCHOR:adr-005-consequences -->

<!-- ANCHOR:adr-005-five-checks -->
### Five Checks
| # | Check | Result | Evidence |
|---|---|---|---|
| 1 | Necessary? | PASS | All four surfaces were genuinely ambiguous without this explicit treatment |
| 2 | Beyond Local Maxima? | PASS | Blanket-Codex-mirroring and blanket-omission were both considered and rejected |
| 3 | Sufficient? | PASS | Covers all four identified ambiguous surfaces from the hooks-portability research |
| 4 | Fits Goal? | PASS | Matches this repo's stated discipline of marking genuine uncertainty rather than fabricating confidence |
| 5 | Open Horizons? | PASS | Phase 009 explicitly re-opens the `mcp-route-guard` dormancy question; this ADR doesn't close that door |
<!-- /ANCHOR:adr-005-five-checks -->

<!-- ANCHOR:adr-005-impl -->
### Implementation
- What changes: `.devin/hooks.v1.json`'s explicit empty `PermissionRequest`; `task-dispatch-guard.cjs` built as a real file; `mcp-route-guard.cjs`'s README notes dormancy; `SessionEnd` wiring follows T001's evidence.
- How to roll back: each surface's decision is independently reversible without affecting the other three.
<!-- /ANCHOR:adr-005-impl -->
<!-- /ANCHOR:adr-005 -->

---

## RELATED DOCUMENTS
- `spec.md`, `plan.md`, `tasks.md`, `checklist.md`
- `../004-devin-hook-adapter-layer/decision-record.md` (ADR-001 precedent this phase extends)
- `../../027-cli-codex-revival/007-codex-hook-parity/decision-record.md` (Codex's own equivalent ADRs, esp. ADR-005 SessionEnd-into-Stop fold-in)
