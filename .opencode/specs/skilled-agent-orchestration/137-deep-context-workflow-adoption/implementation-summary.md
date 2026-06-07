---
title: "Implementation Summary: deep-context workflow adoption (root-cause fix)"
description: "Council-advised durable fix for the judgment failure that hand-rolled a manual gather instead of /deep:start-context-loop: a PLAN-WORKFLOW LOCK plus reinforcing secondaries and a constitutional rule."
trigger_phrases:
  - "deep-context workflow adoption shipped"
  - "plan-workflow lock"
importance_tier: "high"
contextType: "specification"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/137-deep-context-workflow-adoption"
    last_updated_at: "2026-06-07T20:05:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Shipped PLAN-WORKFLOW LOCK + secondaries + constitutional rule"
    next_safe_action: "Re-index the constitutional rule when mk-spec-memory MCP reconnects"
    blockers: []
    key_files:
      - "AGENTS.md"
      - ".opencode/skills/system-spec-kit/constitutional/deep-skill-workflow-required.md"
      - ".opencode/skills/deep-context/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "deep-context-adoption-137"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions:
      - "Root cause (council-confirmed): epistemic (assumed Gate-3 friction, never read the command contract) -> behavioral (reflexive deep-research manual pattern over-generalized to the context loop) -> process (silent plan deviation x24). Tooling was fine. Fix is behavioral/governance, not a command change."
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 137-deep-context-workflow-adoption |
| **Completed** | 2026-06-07 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A durable, multi-surface fix for the judgment failure that hand-rolled a manual `cli-opencode` gather across packet 135 instead of the plan-specified `/deep:start-context-loop`. The AI Council confirmed the root cause is behavioral and governance, not tooling, so the fix lives in the instruction canon and the memory system, not in the command.

### The fix (four reinforcing surfaces)

1. **PRIMARY: PLAN-WORKFLOW LOCK** in `AGENTS.md` (a HARD BLOCKER beside the Four Laws). `CLAUDE.md` is a symlink to `AGENTS.md`, so one edit binds claude, codex and opencode. A plan-named workflow is frozen like scope: verify assumed friction by reading the contract, flag genuine blocks to the user, never silently hand-roll a substitute. Grep-verifiable.
2. **SECONDARY-A: cross-runtime feedback memory** saved into this packet via `generate-context.js`, so the lesson surfaces at prompt boundaries in any runtime via the packet trigger phrases.
3. **SECONDARY-B: anti-pattern NEVER item** in `.opencode/skills/deep-context/SKILL.md` (symlink-shared across runtimes).
4. **CONSTITUTIONAL RULE** (operator-requested): `constitutional/deep-skill-workflow-required.md` generalizes the rule to all deep skills (deep-context, deep-research, deep-review, deep-ai-council, deep-improvement): use the actual command/agent/workflow, never hand-roll. The constitutional README was updated from 12 to 13 rule files.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `AGENTS.md` | Modify | PLAN-WORKFLOW LOCK hard blocker (CLAUDE.md symlinks to it) |
| `.opencode/skills/deep-context/SKILL.md` | Modify | Anti-pattern NEVER item |
| `.opencode/skills/system-spec-kit/constitutional/deep-skill-workflow-required.md` | Create | Constitutional rule for all deep skills |
| `.opencode/skills/system-spec-kit/constitutional/README.md` | Modify | Count and lists updated to 13 |
| `137-deep-context-workflow-adoption/ai-council/**` | Create | Council deliberation artifacts |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The `@ai-council` agent was dispatched at Depth 1 (using the proper workflow this time, not a manual approximation). It ran four diverse-lens seats (failure-analysis, behavioral-decision, tooling-design, process-governance), a critique round, and converged at 90% on the PLAN-WORKFLOW LOCK as the primary, with the feedback memory and the SKILL.md line as endorsed secondaries, explicitly rejecting more command-doc prose and a Bash-lint hook as over-correction. The orchestrator implemented all of it (the council writes only `ai-council/**`). The operator then asked for a constitutional rule, which was added and the constitutional README reconciled.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Fix the behavior and governance, not the command | The command's contract was correct and present (Gate-3-safe, cli-* executor seats); the failure was not reading it |
| PLAN-WORKFLOW LOCK in AGENTS.md, not a 5th Law | "The Four Laws" is a referenced brand; a co-equal HARD BLOCKER avoids cross-doc drift |
| Generalize the constitutional rule to all deep skills | The same hand-roll risk applies to research, review, council and improvement loops, not just context |
| Keep the rule evergreen | No mutable packet number inside the constitutional rule; the incident reference stays generic |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| PLAN-WORKFLOW LOCK present in AGENTS.md and via the CLAUDE.md symlink | PASS (grep == 1 each) |
| Anti-pattern NEVER item in deep-context SKILL.md | PASS (grep == 1) |
| Constitutional rule file written; README at 13 files | PASS |
| `validate.sh --strict` on the packet | PASS |
| Constitutional rule LIVE-INDEXED | PENDING — mk-spec-memory MCP disconnected mid-scan; the file is constitutional by placement and auto-loads at the next daemon priming; retry `memory_index_scan` on /mcp reconnect |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Constitutional live-index pending.** The `memory_save` quality gate rejected the rule as a manual-fallback save (it is tuned for evidence-bearing session memories, not directive rule docs), and the subsequent `memory_index_scan` hit an mk-spec-memory MCP disconnect. The rule file is correct (`importanceTier: constitutional`, in the constitutional folder) and will be picked up at the next daemon priming or an explicit re-index after a `/mcp` reconnect. This is a runtime activation step, not a missing artifact.
<!-- /ANCHOR:limitations -->
