---
title: "Decision Record: Devin hook parity"
description: "5 ADRs governing the Devin hook parity phase: contract/discovery resolution, dual adapter pattern, deny-capability verification, registration location, honest divergent/dormant/empty handling."
trigger_phrases: ["devin hook parity ADR", "devin hooks.v1.json discovery"]
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/029-cli-devin-revival/008-devin-hook-parity"
    last_updated_at: "2026-07-24T18:30:00Z"
    last_updated_by: "claude-code"
    recent_action: "Revised all 5 ADRs from Proposed to Accepted with confirmed real-implementation outcomes"
    next_safe_action: "Write implementation-summary.md, regenerate metadata, validate, commit"
    blockers: []
    key_files: ["spec.md", "checklist.md", "tasks.md"]
    session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "cli-devin-revival-followups", parent_session_id: null }
    completion_pct: 100
    open_questions: []
    answered_questions: ["Project-level .devin/hooks.v1.json is confirmed inert under -p regardless of an installer - the whole question was moot, not answerable by branching.", "SessionEnd registered directly (real native Devin event, unlike Codex)."]
---
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->
# Decision Record: Devin hook parity

<!-- ANCHOR:adr-001 -->
## ADR-001: Contract and discovery-order resolution for the 6 remaining events

**STATUS: Accepted (resolved as moot, not by the planned branch-on-evidence test)** - see the Outcome note below the original Decision. This section is preserved as originally authored (pre-implementation) plus a dated addendum, per this repo's convention of superseding rather than deleting prior reasoning.

<!-- ANCHOR:adr-001-context -->
### Context
Phase 004 already pinned `SessionStart` and `UserPromptSubmit`. Six events remain unconfirmed at field level (`PreToolUse`, `PostToolUse`, `Stop`, `PostCompaction`, `SessionEnd`, `PermissionRequest`), and phase 004's own REQ-007 ("`.devin/hooks.v1.json` discovery order... confirmed live before the file is shipped") was never resolved - it stayed open through that phase's authoring.

**Constraints**: Codex's own equivalent question had a genuine hard-won surprise - Codex's project-level `.codex/hooks.json` turned out inert; only `~/.codex/hooks.json` (user-global) was live, requiring an idempotent installer (`install-codex-hooks.mjs`). Devin's own documentation claims project-level `.devin/config.json`/`.devin/hooks.v1.json` is a supported tier, but that claim has not been live-tested against the actual installed binary.
<!-- /ANCHOR:adr-001-context -->

<!-- ANCHOR:adr-001-decision -->
### Decision
**We chose**: Treat Devin's documented project-level support as unverified until a live test proves it, and gate all of phase 008's registration work on that live test (T002), rather than assuming either outcome.

**How it works**: Write a minimal single-event `.devin/hooks.v1.json` test registration, launch a `devin` session in this repo, and confirm the hook actually fires. If it fires, proceed with project-level registration as planned. If it does not, build `install-devin-hooks.mjs` (T019) mirroring `install-codex-hooks.mjs`'s idempotent backup-and-merge pattern before any further registration work.

**Outcome (2026-07-24)**: The planned live test was never reached as a branch point - phase 004 had *already* run this exact test (before phase 008 started) and found the file is never consulted at all under `devin -p`: a real dispatched tool call produced zero probe firings, deliberately malformed JSON produced zero parse errors (proof the file isn't read, not merely ignored once read), and `--agent-config`'s own strict schema rejects a `hooks` field outright. Phase 008 re-ran the same probe against the fully-extended, 7-event-category `.devin/hooks.v1.json` (15 command entries) and got the identical result: zero firings. This resolves ADR-001 as **moot** rather than as either of the two anticipated branches - there is no discovery-order question to answer while `-p` never reads hook config from any location at all. `install-devin-hooks.mjs` (T019) was correctly never built: an installer only helps if the *location* is wrong, and the actual problem is that `-p` mode doesn't consult hook config regardless of location.
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
- What actually changed: `.devin/hooks.v1.json` was extended directly with all of T005-T017's registrations (no conditional installer path), per operator direction to commit the real file despite confirmed dormancy, mirroring phase 004's own precedent.
- How to roll back: `git checkout` the prior `.devin/hooks.v1.json`; no installer script exists to also roll back.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Dual adapter pattern, extended to `post-compaction.cjs`'s exception

**STATUS: Accepted, confirmed as built.**

<!-- ANCHOR:adr-002-context -->
### Context
Phase 004's own ADR-001 already established two adapter shapes for Devin, mirroring Codex: direct-core-call (import the shared `.mjs`/`.cjs` core, add a thin tool-vocabulary translation layer) and delegate-to-compiled-Claude-adapter (`spawnSync` the compiled `hooks/claude/*.js` binary, translate its output). This phase must apply that same pattern consistently across 8 new files - and explicitly document the one file that cannot use either shape.

**Constraints**: `PostCompaction` has no Claude-side equivalent to spawn (Claude's `PreCompact` fires before compaction with full transcript access; Devin's fires after, with only `session_id` + possibly-null `summary`) and no existing shared core to import (this is a genuinely new semantic concern, not a transport-only translation).
<!-- /ANCHOR:adr-002-context -->

<!-- ANCHOR:adr-002-decision -->
### Decision
**We chose**: Apply direct-core-call to the 6 guard-core adapters (T005-T010) and delegate-to-compiled-adapter to `session-stop.ts` (T012), exactly matching phase 004's established pattern - and build `post-compaction.cjs` (T013) as a third, bespoke shape implementing the 5-step recovery chain from the hooks-portability research directly, with no delegation and no core import.

**How it works**: The bespoke chain: (1) retain `summary` as the first recovery section if present; (2) rehydrate authoritative continuity from active session/spec state (not from the Claude-side transcript, which Devin doesn't expose); (3) fall back to a bounded `memory_context(mode=resume)` call when `summary` is null or incomplete; (4) apply provenance/semantic-safety filtering before any model-visible injection; (5) emit the result via `hookSpecificOutput.additionalContext` directly from `PostCompaction` itself, rather than relying on a synthesized follow-up event the way Claude's own handler does.

**Outcome (2026-07-24)**: Built exactly as designed. Direct-core-call applied to all 7 guard-core adapters (the originally planned 6 plus `spec-gate-enforce.mjs`, added mid-implementation once the gap surfaced - see the executive summary's note in `spec.md`). Delegate-to-compiled-adapter applied to `session-stop.ts` (typechecked 0 errors, compiled, tested). `post-compaction.cjs` built as the bespoke third shape - tested with and without a `summary` field present. Two authoring bugs were caught and fixed during implementation, both before any test ran: (1) `const { createHash, execFileSync } = require('node:crypto') && require('node:child_process');` used JS `&&` short-circuit evaluation, which would have silently left `createHash` undefined at runtime - split into two separate `require()` calls; (2) the control-character-stripping regex originally contained literal raw unprintable bytes embedded directly in the source rather than `\x` escape sequences - functionally valid but fragile for a committed text file, replaced with proper escapes (`/[\x00-\x08\x0B\x0C\x0E-\x1F]/g`).
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
  | The 5-step chain has never been live-tested against a real Devin session | M | Direct-invocation tested with/without `summary`; live-fire testing remains blocked by the packet-wide `-p` dormancy finding, not by anything specific to this adapter |
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

**STATUS: Accepted, downgraded scope - the planned live behavioral test (Option (a)) was not achievable; see the Outcome note.**

<!-- ANCHOR:adr-003-context -->
### Context
Unlike the 5 advisory/warn-only adapters in this phase, `dispatch-preflight-lint.mjs` is deny-capable (mirrors Codex's own equivalent, which can block a `PreToolUse` call outright). A deny-capable guard that silently fails to actually block anything is worse than no guard at all - it creates a false sense of enforcement.
<!-- /ANCHOR:adr-003-context -->

<!-- ANCHOR:adr-003-decision -->
### Decision
**We chose**: Require a live behavioral test - not just a schema-correctness check - proving a deliberately-triggered deny actually stops the tool call under a real `devin` session, before this adapter is marked done.

**How it works**: T021's live session matrix includes a specific case: dispatch a command matching a known-deny rule, and confirm the call is actually blocked (not just that the adapter emits a syntactically-correct deny envelope).

**Outcome (2026-07-24) - honest downgrade, not a silent pass**: The planned live behavioral test could not be performed, for two independent reasons discovered during implementation: (1) the packet-wide `-p` dormancy finding means no Devin hook fires at all today, so there is no live call to actually block; (2) separately, a `grep` across every `SKILL.md` in this repo for `severity: block` found **zero** matches - no skill currently declares a hard rule at block severity, so even a live-firing Devin session would have nothing to trigger a deny against right now. What *was* verified instead: the deny branch (`result.decision === 'deny'` -> `permissionDecision: 'deny'`) is structurally identical to the already-proven Claude/Codex sibling branches and calls the identical `dispatch-rule-checks.mjs` core, whose own unit test suite (`dispatch-rule-checks.test.mjs`, 6/6 passing) exercises `severity: 'block'` classification directly. This is schema/logic-level confidence, not the behavioral proof Option (a) originally called for - recorded here explicitly rather than presented as equivalent.
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
  | Devin's deny envelope field names differ subtly from what docs show | M | Cannot be caught until hooks fire live at all; the envelope shape mirrors Codex's already-confirmed `hookSpecificOutput` schema, the strongest available proxy today |
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
- What actually changed: `dispatch-preflight-lint.mjs` built with the deny branch present and structurally verified; a real dispatch-shaped command was exercised live and correctly returned an advisory (the warn path, not the deny path - no block-severity fixture exists repo-wide to exercise the deny path against).
- How to roll back: N/A - this remains a verification requirement, not a code change. Re-run this ADR's live test once (a) a future `devin` build fires hooks under `-p` or in interactive mode, and (b) at least one skill declares a `severity: block` hard rule.
<!-- /ANCHOR:adr-003-impl -->
<!-- /ANCHOR:adr-003 -->

---

<!-- ANCHOR:adr-004 -->
## ADR-004: Registration location, conditioned on ADR-001's evidence

**STATUS: Accepted - the conditional collapsed to a single branch, see the Outcome note.**

<!-- ANCHOR:adr-004-context -->
### Context
ADR-001 resolves *whether* project-level registration works. This ADR records *what to build* in each branch, so the decision isn't made ad hoc mid-implementation.
<!-- /ANCHOR:adr-004-context -->

<!-- ANCHOR:adr-004-decision -->
### Decision
**We chose**: If ADR-001's live test confirms project-level `.devin/hooks.v1.json` works, all of phase 008's registrations (T005-T017) land there directly, extending phase 004's file. If it proves inert, build `install-devin-hooks.mjs` (T019) as an idempotent backup-and-merge installer into the real live location, mirroring `install-codex-hooks.mjs` exactly (same idempotency guarantee, same backup-before-merge safety).

**Outcome (2026-07-24)**: ADR-001 resolved as moot, not as either anticipated branch - the conditional never had a live decision point to reach. All registrations landed directly in the project-level `.devin/hooks.v1.json` (per operator direction, matching phase 004's precedent of committing the file despite confirmed dormancy). `install-devin-hooks.mjs` was correctly never built: an installer only solves a *wrong-location* problem, and the actual problem (`-p` never consulting hook config at all) is not location-dependent, so an installer targeting any location would not help.
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
- What actually changed: `.devin/hooks.v1.json` extended directly, all 7 event categories, 15 command entries; `install-devin-hooks.mjs` never built.
- How to roll back: `git checkout` the prior `.devin/hooks.v1.json`.
<!-- /ANCHOR:adr-004-impl -->
<!-- /ANCHOR:adr-004 -->

---

<!-- ANCHOR:adr-005 -->
## ADR-005: Honest handling of divergent, dormant, and empty surfaces

**STATUS: Accepted, confirmed as built - plus one more surface (`spec-gate-enforce.mjs`) surfaced during implementation itself.**

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

**Outcome (2026-07-24)**: All four built as decided. `PermissionRequest` ships as an explicit empty `[]` in `.devin/hooks.v1.json`. `task-dispatch-guard.cjs` was built as a real adapter (`system-deep-loop/runtime/hooks/devin/task-dispatch-guard.cjs`), tested happy-path and fail-open. `mcp-route-guard.cjs` is documented dormant for two independent reasons (packet-wide `-p` finding + no external MCP family registered) in both its own file header and its README, forward-referenced to phase 009. `SessionEnd` was registered directly (`session-cleanup.sh`) since live evidence was unobtainable (T001 resolved as moot) - the decision rests on the structural fact that Devin has a real native `SessionEnd` event and Codex does not, not on observed stdout behavior.

**A fifth surface surfaced during implementation itself, proving this ADR's own thesis**: the original phase 008 file matrix (9 files) omitted `spec-gate-enforce.mjs` - the actual `PreToolUse` gate-3 BLOCK, distinct from `spec-gate-classify.mjs`'s `UserPromptSubmit`-time advisory classify step. The hooks-portability research had already scoped this exact gap (§10, C-02/C-05/G-01, including a proposed skeleton with `^exec$`/`^edit$` matchers), but it never made it into this phase's own planning documents - discovered only when explicitly re-checking Devin's coverage against `.claude/settings.json`'s full hook inventory during implementation. Built as a 10th file, tested (non-mutating tool, exec, edit-with-file_path, malformed stdin), and the `runtime/hooks/devin/README.md`'s prior claim that this file was "deliberately NOT built here" was corrected rather than left stale.
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
- What actually changed: `.devin/hooks.v1.json`'s explicit empty `PermissionRequest`; `task-dispatch-guard.cjs` built as a real file; `mcp-route-guard.cjs`'s README documents dormancy; `SessionEnd` registered directly; `spec-gate-enforce.mjs` built as a 10th file with its sibling README corrected.
- How to roll back: each surface's decision is independently reversible without affecting the other four.
<!-- /ANCHOR:adr-005-impl -->
<!-- /ANCHOR:adr-005 -->

---

## RELATED DOCUMENTS
- `spec.md`, `plan.md`, `tasks.md`, `checklist.md`
- `../004-devin-hook-adapter-layer/decision-record.md` (ADR-001 precedent this phase extends)
- `../../027-cli-codex-revival/007-codex-hook-parity/decision-record.md` (Codex's own equivalent ADRs, esp. ADR-005 SessionEnd-into-Stop fold-in)
