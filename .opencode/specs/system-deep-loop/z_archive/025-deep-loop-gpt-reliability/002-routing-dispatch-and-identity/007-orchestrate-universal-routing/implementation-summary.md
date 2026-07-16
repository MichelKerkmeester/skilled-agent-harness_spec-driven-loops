---
title: "Implementation Summary: Orchestrate NDP-Safe Universal Routing"
description: "Completed orchestrate's Priority table with the 2 missing deep-mode rows, made the Deep Route field explicitly registry-resolved, and added an explicit NDP boundary against dispatching @deep itself as a worker -- across both the OpenCode and Claude runtime mirrors."
trigger_phrases:
  - "implementation"
  - "summary"
  - "orchestrate universal routing"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/025-deep-loop-gpt-reliability/002-routing-dispatch-and-identity/007-orchestrate-universal-routing"
    last_updated_at: "2026-07-01T18:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Bloat-reduction follow-up applied to both runtime mirrors"
    next_safe_action: "None -- packet complete"
    blockers: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "031-009-impl"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary: Orchestrate NDP-Safe Universal Routing

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 007-orchestrate-universal-routing |
| **Completed** | 2026-07-01 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

`@orchestrate` already routed every non-deep dispatch (`@code`, `@review`, `@markdown`, `@debug`, `@context`) through one deterministic Priority table — the gap was that 2 of the 4 deep sub-agents (`@deep-context`, `@deep-review`) were missing from it, and the Deep Route field an earlier uncommitted edit had added was free-text prose rather than a registry lookup. Both gaps are closed now, in both runtime mirrors, and orchestrate's own NDP section now explicitly forbids the one dispatch pattern that would have made the fix unsafe: Task-dispatching `@deep` itself.

### Priority Table Completion

Added `@deep-context` (priority 2, grouped next to `@context` since both handle "gather context" requests) and `@deep-review` (priority 7, grouped next to `@review`) to the Priority table, NDP LEAF classification list, and Agent Files table in both `.opencode/agents/orchestrate.md` and `.claude/agents/orchestrate.md`. Each new row's task-type description states explicitly that the deep-loop route applies only when the deep-loop convergence workflow is requested, not for general exploration/review — resolving the ambiguity flagged in `spec.md`'s edge cases.

### Deep Route Registry Resolution

The `Deep Route:` field in the Task Format block already cited `mode-registry.json` as its `source_of_truth` from an earlier in-flight edit, but nothing told the model how to actually populate it. Added an explicit paragraph right after the Task Format block: `mode`/`target_agent`/`execution` must be looked up directly from the matching registry entry, never inferred, verifiable by a reviewer diffing the emitted line against the registry — and if no entry matches, stop before dispatch rather than fabricate a route.

### NDP Boundary Against Dispatching @deep

Added a 4th "Illegal Chain" example (`Orch(0) → @deep(1)`, annotated with why: `@deep` is `mode: primary`, not a depth-1 leaf) plus an explicit prose statement: orchestrate resolves and dispatches the target leaf directly, and never Task-dispatches `@deep` itself as a worker.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/agents/orchestrate.md` | Modified | Priority table (+2 rows), NDP LEAF list (+1), Agent Files table (+2), Deep Route resolution rule, NDP boundary |
| `.claude/agents/orchestrate.md` | Modified | Identical set of changes, mirrored |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Re-read both `orchestrate.md` files fresh before editing (T002) — line numbers were unchanged from phase 008's planning, since phase 008 never touched this file. Confirmed `mode-registry.json`'s 4 entries directly rather than trusting memory of them from earlier in this session. Grouped the 2 new Priority-table rows next to their closest existing sibling (`@deep-context` near `@context`, `@deep-review` near `@review`) rather than appending both at the end, since that reads more naturally and matches how a reviewer would expect to find them.

Verified the fix three ways rather than assuming it worked from the edit alone: (1) manually traced `/deep:context` and `/deep:review` through the completed table against the actual registry entries — both resolved cleanly via direct lookup, no judgment call; (2) grepped for cross-table consistency and got symmetric occurrence counts (`@deep-context`: 4, `@deep-research`: 6, `@deep-review`: 5, `@ai-council`: 6) identical across both runtime mirrors; (3) diffed the non-deep routing rows against the pre-change state and confirmed only the priority numbers shifted — every other field (task description, agent, tier, skills, subagent_type) stayed byte-identical.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Grouped new rows next to their closest existing sibling rather than appending at the table's end | A reviewer scanning for "how does context routing work" should find both `@context` and `@deep-context` together, not have to jump to the bottom of the table. |
| Added a prose resolution rule rather than a lookup script for the `Deep Route:` field | This is a markdown prompt contract, not executable code — the fix targets what the model is instructed to do (look up, don't infer), matching the same kind of fix already applied to Mode D in phase 008. |
| Added the NDP boundary as both a 4th Illegal Chain example AND a standalone prose statement | The existing 3 examples are terse one-liners; the `@deep` case needed the extra "why" (it's `mode: primary`, not a leaf) that a bare example wouldn't convey on its own. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Manual trace: `/deep:context` -> Priority row 2 -> `@deep-context` -> registry `agent: "deep-context"` | PASS, direct match |
| Manual trace: `/deep:review` -> Priority row 7 -> `@deep-review` -> registry `agent: "deep-review"` | PASS, direct match |
| grep: all 4 deep modes present across Priority table, NDP LEAF list, Agent Files table, both runtimes | PASS, symmetric counts |
| `git diff`: non-deep routing rows unchanged except priority renumbering | PASS |
| `bash validate.sh --strict` on this phase folder | PASS, 0 errors, 0 warnings |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **No live dispatch test.** Verification here is static (table lookup trace, grep, diff) rather than an actual live `Task` dispatch through orchestrate for each of the 4 deep modes — that kind of end-to-end confirmation is the job of phase 012's benchmark, not this phase.
2. **The `@deep-context` vs `@context` and `@deep-review` vs `@review` disambiguation is documented but not mechanically enforced.** The Priority table's task-type description states the distinction in prose; nothing prevents a model from misreading it the same way Mode D was misread in phase 008's predecessor problem. This is an accepted, documented residual risk, not a new defect introduced here.
<!-- /ANCHOR:limitations -->

---

<!-- ANCHOR:followup -->
## Follow-Up: Bloat Reduction (2026-07-01, post-benchmark)

After phases 010-013 landed, revisited `orchestrate.md` (both runtimes) for size/adherence: 891 lines (~15K tokens loaded on every dispatch) contained real duplication with zero unique content. Cut 4 items, applied identically to `.opencode/agents/orchestrate.md` and `.claude/agents/orchestrate.md`:

1. Removed the `§1 CORE WORKFLOW` mermaid flowchart — a visual duplicate of the 10-step list directly above it; LLMs consume this file as a text system prompt, not a rendered diagram, so it added token cost with zero adherence value. Replaced with one sentence describing the two branch points.
2. Consolidated NDP: `§0` previously re-explained the full max-depth-2 mechanism already covered in detail by `§2 Nesting Depth Protocol`. Trimmed `§0` to a 2-line pointer at `§2`, removing one of what had become 4 restatements of the same rule (`§0`, `§2`, `§9` x2).
3. Compressed `§9 ANTI-PATTERNS`' 9 verbose paragraph-pairs (each already stated earlier in the doc) into a single 3-column table (rule / why / cross-reference) — same content, roughly half the lines. Incidental benefit: the old "never let LEAF agents dispatch" entry re-enumerated the LEAF agent list by hand (and was already missing `@deep-context`, a stale-list risk); the table version points at `§2`'s list instead of maintaining a second copy that can drift.
4. Removed `§10 SUMMARY`'s ASCII-boxed recap — it restated `§1`/`§2`/`§4` with no new information.

Result: 891 → 817 lines (`.opencode`), 880 → 806 lines (`.claude`) — an 8.3-8.4% reduction, applied consistently to both mirrors. Re-verified post-edit: all 4 deep-mode references, the Priority table, and the `@deep`-as-worker NDP boundary remain intact and byte-identical in substance between runtimes (confirmed via path-normalized diff — the only differences are the expected `mode`/`permission` vs `tools` frontmatter and one intentionally asymmetric wording difference in the anti-patterns table, since `.opencode/agents/` is the canonical directory and doesn't need the "this runtime's mirror" parenthetical that `.claude/agents/` does). `validate.sh --strict` re-run on this phase folder: still PASS.

No unique rule, threshold, or table was removed — every cut was a restatement of content stated once elsewhere in the file.
<!-- /ANCHOR:followup -->
