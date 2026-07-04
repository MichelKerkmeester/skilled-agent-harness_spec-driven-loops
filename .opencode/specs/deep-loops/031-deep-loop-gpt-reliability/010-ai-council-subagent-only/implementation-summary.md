---
title: "Implementation Summary: ai-council Subagent-Only Conversion"
description: "Converted ai-council.md from mode: all to mode: subagent, an explicit operator override of research's unanimous 6/6 recommendation, verified with real live opencode CLI smoke tests rather than assumption, and redirected 2 real documentation callers discovered depending on the removed direct-invoke path."
trigger_phrases:
  - "implementation"
  - "summary"
  - "ai-council subagent only"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/031-deep-loop-issues-with-gpt-opencode/010-ai-council-subagent-only"
    last_updated_at: "2026-07-01T15:30:00Z"
    last_updated_by: "claude-code"
    recent_action: "Implementation complete; validate.sh --strict passing"
    next_safe_action: "Proceed to phase 011"
    blockers: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "031-010-impl"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary: ai-council Subagent-Only Conversion

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 010-ai-council-subagent-only |
| **Completed** | 2026-07-01 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

`ai-council` is no longer directly selectable as a top-level OpenCode agent — it's reachable only via Task dispatch now, matching every other deep-loop sub-agent (`deep-context`, `deep-research`, `deep-review`) and closing this repo's one cross-runtime asymmetry (Claude Code has no equivalent "primary agent" concept at all). This is a deliberate operator override of research's strongest, most unanimous finding in the entire packet — 6 of 6 lineages across both rounds said keep `mode: all` — and it's documented as exactly that in `decision-record.md`, not silently applied.

### The Change

`.opencode/agents/ai-council.md:4`: `mode: all` → `mode: subagent`. One line.

### Real Reachability Verification

Rather than trust the change by analogy to other `mode: subagent` agents, both directions were live-tested against the actual installed `opencode` CLI in this environment:

- **Direct invocation, before:** `opencode run --agent ai-council "..."` succeeded, loading the full `ai-council.md` definition (36,004 input tokens) and replying correctly.
- **Direct invocation, after:** the same command now prints `agent "ai-council" is a subagent, not a primary agent. Falling back to default agent` and loads a different, smaller default agent (27,975 input tokens) instead — confirmed rejected, not just assumed.
- **Task-dispatch reachability, after:** `opencode run --agent general "...use the task tool to dispatch to ai-council..."` fired a real `task` tool call with `subagent_type: 'ai-council'` and got back the expected reply.
- **Orchestrate's own routing, after:** `opencode run --agent orchestrate "...multi-strategy architecture planning..."` correctly resolved `Agent: @ai-council per §2 Priority 4` — matching phase 009's exact renumbering — and began loading `ai-council.md` + `mode-registry.json` per its own Agent Loading Protocol before dispatching.

### Redirected Callers

The pre-landing grep sweep found 2 real documentation callers depending on the removed direct-invoke path, not just orchestrate and `/deep:ai-council`:

- `.opencode/skills/cli-opencode/references/agent_delegation.md`: both the `@ai-council` section prose and the agent routing-matrix table row documented `opencode run --agent ai-council ...` as the canonical delegation pattern. Updated to match the existing "Command-only" convention already used for `deep-research`/`deep-review`/`deep-agent-improvement` in the same file — point callers at `/deep:ai-council` for a full session, or `general`/orchestrate's own Task-dispatch routing for a single planning pass.
- `.opencode/skills/sk-doc/assets/agent_template.md`: the "Current Production Agents" reference table listed `ai-council` as an example of a `mode: all` agent. Updated to `mode: subagent` so the documentation template doesn't teach a now-incorrect pattern to whoever authors the next agent using it as a reference.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/agents/ai-council.md` | Modified | `mode: all` → `mode: subagent` |
| `.opencode/skills/cli-opencode/references/agent_delegation.md` | Modified | Redirected the ai-council delegation pattern to Command-only |
| `.opencode/skills/sk-doc/assets/agent_template.md` | Modified | Corrected the stale `mode: all` example |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Grepped the repo for `@ai-council` before touching anything, rather than assuming orchestrate and `/deep:ai-council` were the only 2 callers `spec.md` already knew about. Found 8 hits total; 6 were either archived (`z_archive/cli-codex-retired/*`, correctly out of scope), agent-agnostic enums (`agent-io-contract.md` just lists valid agent names for a header, doesn't care about `mode`), or prose mentioning `@ai-council` as a dispatch target without specifying a mechanism. 2 were real, active documentation teaching a direct-invoke pattern that the conversion would break — both redirected before the field change landed, not after.

Verified the field change with the actual installed `opencode` CLI rather than reasoning about OpenCode's `mode` semantics from memory alone — confirmed the SDK's own type definition (`mode?: "subagent" | "primary" | "all"` in `@opencode-ai/sdk`) matched observed runtime behavior, then ran 3 live dispatches (direct-invoke before, direct-invoke after, Task-dispatch after) to get real evidence for both the removed and the preserved reachability paths, plus a 4th run specifically through `--agent orchestrate` to confirm phase 009's own Priority-table renumbering (`@ai-council` now priority 4) is what a live session actually reads and acts on.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Proceeded despite research's unanimous 6/6 contrary recommendation | Explicit, twice-stated operator instruction; documented as a deliberate override in `decision-record.md`, not silently applied — the research's reasoning remains true and citable, this decision overrides its conclusion by operator priority, not by disputing its logic. |
| Redirected the 2 discovered callers rather than leaving them broken or escalating | Both redirects were straightforward (an existing "Command-only" convention already existed in the same file for 3 other agents); escalation per the Logic-Sync Protocol is for genuinely un-redirectable cases, and these weren't. |
| Verified via live CLI dispatch rather than static reasoning alone | `mode`'s actual runtime behavior is enforced by the compiled `opencode` binary, not fully visible from type definitions or documentation; a claim this important (removing a working reachability path, against research's own advice) deserved real evidence, not inference. |
| Did not run a full `/deep:ai-council` multi-round session end-to-end | That command spins up a real multi-topic, multi-round council session with cost guards and adjudicator-verdict tracking — expensive and slow for a smoke test whose actual question (does Task-dispatch to `@ai-council` still resolve) is answered more cheaply and just as decisively by the direct Task-tool test that was run instead. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `opencode run --agent ai-council` before the change | PASS (as expected) — loaded `ai-council.md`, 36,004 input tokens, replied correctly |
| `opencode run --agent ai-council` after the change | PASS (correctly rejected) — `agent "ai-council" is a subagent, not a primary agent. Falling back to default agent`, 27,975 input tokens (default agent, not ai-council.md) |
| `opencode run --agent general` + explicit Task-dispatch instruction, after the change | PASS — real `task` tool call, `subagent_type: 'ai-council'`, correct reply received |
| `opencode run --agent orchestrate` + planning prompt, after the change | PASS — resolved "Agent: @ai-council per §2 Priority 4" (matches phase 009), loaded agent def + registry, began dispatch |
| grep sweep for undiscovered direct-invocation callers | PASS — found and redirected 2 real callers |
| `bash validate.sh --strict` on this phase folder | PASS, 0 errors, 0 warnings |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The orchestrate live-test was not observed to full completion.** The captured output confirmed correct agent resolution, file loading, and the start of Task dispatch (the load-bearing part of this verification), but the process was not watched through to the council's own final reply, unlike the simpler `general`-agent Task-dispatch test which did complete end-to-end.
2. **`markdown.md`'s own `mode: all` field remains untouched**, per explicit scope. If cross-runtime consistency is the driving rationale for this conversion, that field is a natural follow-up question — not raised by the operator yet, not decided here.
3. **This is a deliberate, documented override of research's strongest unanimous finding in the packet.** The accepted residual risk (an undiscovered caller depending on direct reachability that the grep sweep didn't find) is real, even if mitigated by the sweep that was run.
<!-- /ANCHOR:limitations -->
