---
title: "Implementation Summary"
description: "A six-iteration audit of the completed decommission returned CONDITIONAL: nothing blocking, nine required corrections, eight advisories, every one reproduced against the tree."
trigger_phrases:
  - "implementation summary"
  - "what shipped"
  - "validation evidence"
  - "continuation notes"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/025-mcp-decommission-cli-front-door/009-deep-review-decommission"
    last_updated_at: "2026-09-11T18:01:11Z"
    last_updated_by: "claude-code"
    recent_action: "Recorded the review loop's run and its findings"
    next_safe_action: "Close the nine required findings and re-run the loop"
    blockers: []
    key_files:
      - "review/lineages/deepseek-review/review-report.md"
      - "prompts/review-target.txt"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-11-025-advisor-mcp-decommission"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 009-deep-review-decommission |
| **Status** | Complete |
| **Completed** | 2026-09-11 |
| **Level** | 1 |
| **Base Commit** | `afd10f291f` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

An independent audit of the finished decommission, run as a review loop rather than as another
sweep by the person who did the work. That distinction is the whole point of the phase, and it
paid: the loop found eight live surfaces the author's own residue sweep had passed over, because
the sweep searched for the advisor's retired tool ids and its old directory name while the
surfaces that survived assert the advisor is an MCP server in wording that contains neither.

### Phase 9: deep-review-decommission

The loop ran against the parent packet and the tree it changed, and returned **CONDITIONAL**:
zero P0, nine P1, eight P2. Every finding carries a file and line and the command that reproduces
it, because the run was told that a finding without a reproduction does not count.

Three findings were re-verified by hand before any of them were acted on, and all three held:
`mcp-doctor.sh:59` lists the advisor as a Node.js MCP server among the servers it checks,
`bin/README.md:100` says the launcher boots an MCP child and then prints a dist path that does
not exist, and spec-kit's `ARCHITECTURE.md:157` calls the advisor the only MCP daemon the
repository still runs, under a directory that was renamed.

The nine required findings group into four workstreams: the doctor command tree, the launcher and
entrypoint maps, spec-kit's live references, and the packet's own inability to present its
completion. The last of those is this packet's record, which is why phase 8 exists.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `prompts/review-target.txt` | Created | The loop's target, structured so the run hunts claims rather than tokens |
| `review/lineages/deepseek-review/review-report.md` | Created | The verdict, the seventeen findings and the workstreams |
| `review/lineages/deepseek-review/iterations/` | Created | Six per-iteration records |
| `review/lineages/deepseek-review/deep-review-findings-registry.json` | Created | Machine-readable findings with per-finding test pins |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Through `/deep:review:auto` with a pre-bound spec folder, not a hand-rolled fan-out. The target
was written through the prompt improver first, so the run was given a role, the shipped state, the
six classes of defect to hunt, and the rules that separate a live instruction surface from a
historical record that must keep its old names.

Executor was DeepSeek V4.1 Flash at max thinking through the LLM gateway on cli-pi, which is what
the parent directive freezes. The allowlist takes the bare model id; the provider comes from the
runner.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Hunt claims, not tokens | The author's sweep had already removed every retired tool id. What survived was prose asserting the advisor is an MCP server, which no token pattern matches |
| Demand a reproduction per finding | A review that reports suspicion costs more than it saves. Each finding names the command whose output proves it |
| Classify every hit as live surface or historical record | Changelogs and dated benchmark reports record what was true when written. Rewriting them would be falsification, so the run had to say which bucket each hit fell in |
| Verify a sample by hand before acting | A reviewer's P1 is a hypothesis. Three were re-proven independently before the fixes were dispatched |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Loop completed its iteration ceiling | PASS. Six iterations, terminal `stopReason: maxIterationsReached`, no early convergence |
| Route proof present in the state records | PASS. `deep-review-state.jsonl` carries `target_agent: deep-review` and the resolved route |
| Findings carry file, line and reproduction | PASS across all seventeen |
| Sample of findings re-verified independently | PASS. Three of nine P1 re-proven by hand; all three real |
| Pre-existing failures excluded | PASS. `python-ts-parity` and `scorer-eval-baseline-ratchet` fail identically in an untouched checkout and were named in the target so they would not be reported as regressions |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The run resolved six iterations and standard convergence, not the five and `off` that were
   requested.** The invocation passed `--max-iterations=5 --convergence-mode=off`; the bound
   config records `maxIterations: 6` and `convergenceMode: "standard"`. Because the stop policy
   was `max-iterations`, convergence never stopped the run and all six iterations executed, so the
   outcome satisfies the parent's five-iteration floor. The flag binding itself is the defect, and
   it belongs to the loop runtime rather than to this packet.
2. **The verdict is CONDITIONAL and stays that way until the findings close.** This phase records
   what the audit found. It does not fix anything.
3. **The lineage's artifacts were left untracked long enough to break the next run.** The research
   loop in phase 10 was failed by its own write-containment check, which saw these files untracked
   in the tree and attributed them to itself. Committing a loop's output before starting the next
   one is the fix.
<!-- /ANCHOR:limitations -->
