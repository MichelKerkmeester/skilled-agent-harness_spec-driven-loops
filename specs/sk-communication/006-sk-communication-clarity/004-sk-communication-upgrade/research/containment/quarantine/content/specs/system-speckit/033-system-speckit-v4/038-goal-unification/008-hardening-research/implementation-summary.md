---
title: "Implementation Summary"
description: "Five research iterations and a second five-iteration review named twelve small certain changes and seven advisories; ten of the changes and six of the advisories are built and tested, the rest are the backlog."
trigger_phrases:
  - "implementation summary"
  - "what shipped"
  - "validation evidence"
  - "continuation notes"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/038-goal-unification/008-hardening-research"
    last_updated_at: "2026-09-11T10:52:14Z"
    last_updated_by: "claude-code"
    recent_action: "Built the do-now rows from the hardening research and the second review"
    next_safe_action: "Commit; schedule the do-next backlog"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-11-system-spec-kit-goals"
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
| **Spec Folder** | 008-hardening-research |
| **Completed** | 2026-09-11 |
| **Level** | 1 |
| **Status** | Complete |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The goal system lost its remaining silent failures. Two sessions appending to one packet no longer drop rows, the validator and the runtime measure the same slice, a bound goal whose file vanished says so instead of going quiet, and an OpenCode session can now unbind and log without leaving the plugin.

### Phase 1: hardening-research

Research angles were hardening, integration, operator experience and overengineering; the review's second pass went deeper on concurrency, plugin and core parity, the validator's measurement and the workflow YAML. Neither reopened a decision. Built from the research's do-now list: the reminder now names the command that records a resend on each runtime instead of asking you to paste; the validator's fence matches the runtime's and both normalize bare carriage returns; `show` reports `packet_state` with a hint when the document is missing; the speckit offer path binds when the packet carries a goal file; the packet lock is keyed on the real path under the workspace state root; the plugin gained `unbind` and `log` and errors on an unknown action; a rebind archives the prior record; the save path uses the locked append only; the projection dropped its unread fields. From the review: the plugin binds and reads packets against the repository root, its packet read prints the budget tier, and a text goal past 4000 characters reports the truncation.

Nothing is deferred. The two rows this phase first held back were re-judged by the third review and by an empirical probe: the duplicated envelope aliases and the unused plugin timestamp stay because a live test and a record schema depend on them, which is a decision rather than a deferral. The remaining backlog rows were built in the third round.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `research/deep-research-strategy.md`, `research/lineages/deepseek/` | Created | Charter and lineage with research.md |
| `.opencode/hooks/goal/lib/goal-slice.cjs` | Modified | CR normalization, real path in the projection, workspace walk, capability-aware reminder, no stat outside the guard |
| `.opencode/hooks/goal/lib/goal-core.cjs` | Modified | Real-path packet lock under the workspace state root, record-free `appendPacketLog`, rebind archiving, `packetState`, CRLF-safe rows, truncation report |
| `.opencode/hooks/goal/bin/goal.cjs` | Modified | `packet_state`, hint, truncation warning |
| `.opencode/hooks/goal/{pi,cursor,devin}/` | Modified | Reminder carries the runtime's record command |
| `.opencode/plugins/opencode-goal.js` | Modified | `unbind`, `log` through the shared locked append, unknown-action error, workspace walk, `packet_state`, budget line, truncation warning |
| `.opencode/skills/system-spec-kit/runtime/lib/validation/spec-doc-structure.ts` | Modified | Tolerant fence and CR normalization, matching the runtime |
| `.opencode/commands/speckit/assets/*.yaml`, `save.md`, `goal-opencode.md` | Modified | Bind on the offer path, locked log as the only bound path, new routes |
| `.opencode/skills/system-spec-kit/references/workflows/goal-set-string-playbook.md` | Modified | Operator phrasings added to the indexed document so a lookup for "set the goal" reaches the goal contract |
| `.opencode/plugins/tests/opencode-goal-render-parity.test.cjs` | Created | Cross-implementation label parity and cache-key sensitivity, both negative-control verified |
| Tests in `.opencode/hooks/goal/`, `.opencode/plugins/tests/`, `runtime/tests/` | Modified | Two-writer alias, CRLF, missing document, truncation, unknown action, parity fixture |
| Hook README, `goal-plugin.md`, state README, catalogs, hub playbook, DV-022 | Modified | Lock scope, new actions and fields, Devin unknown |
| Review pass 3 fixes | Modified | Packet locks stay rooted in the workspace (the reviewer's override suggestion was tried, then reverted: an end-to-end probe showed it split the lock and lost 4 of 10 rows, and a regression test now pins cross-store contention); validator treats an unclosed opener and a padded fence like the runtime, pinned by a cross-implementation parity test; log cells neutralize pipes and comment markers; session-free `packet-log` action and `packet` without a session; plugin rebind archives the prior record; README import claims and the Devin writer count corrected |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Both lineages ran detached through the fan-out driver with stop policy max-iterations; each wrote five iterations and its synthesis. The driver marked both lineages failed on exit code with every artifact present, the same pattern as the first two runs. Citations were opened before acting. After the build: hook suites 122 of 122, plugin suites 137 of 137, validator vitest 26 of 26, alignment drift clean, dist rebuilt fresh.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Build the do-now rows here, not in a new phase | Each is one or two files with a test that already has a home |
| Packet locks under the workspace state root | A session-scoped lock cannot serialize two sessions that keep records in different places; the review reproduced lost rows |
| Plugin logs through the core's append | Two implementations locking differently is the same defect again |
| Bind on the offer path | D1 says a session binds to a packet; an offer that sets text leaves the file out of the loop |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| node --test six hook suites | PASS 122/122 |
| node --test eight plugin suites | PASS 137/137 |
| vitest spec-doc-structure | PASS 26/26 |
| verify_alignment_drift.py | PASS |
| Research lineage | 5 of 5, maxIterationsReached |
| Review lineage 2 | 5 of 5, 0 P0, 0 P1, 7 P2 |
| Review lineage 3 | 5 of 5, 0 P0, 0 P1, 10 P2; eight fixed, one reverted with evidence, one live-run unknown |
| End-to-end probe | 20 of 20 behavioral claims re-verified against real files, including a two-process contention run and a live plugin-injection run |
| Retrieval suites | 103 of 103 after the index regeneration, including coverage parity and freshness |
| Negative controls | A renamed renderer label fails the parity test; the previous brief cache key provably collided on two same-length writes in one millisecond |
| Final suites | hook 124/124, plugin 140/140, validator 27/27, typecheck and lint clean, drift PASS |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Closed in this phase from the backlog:** the renderer label-parity test now exists and fails on a renamed label; the brief cache key tracks every write (the previous key provably collided on two same-length writes inside one millisecond); the plugin and core share one workspace resolution and one locked append.
2. **One review finding rejected with evidence:** rooting the packet lock in the record-store override was implemented, probed and reverted. It breaks the guarantee a prior finding bought, and the trade is silent data loss against a lock directory created in the workspace's own documented state location.
3. **Retrieval closed the half that needed no decision:** the operator phrasings now live in the playbook's `trigger_phrases`, which is inside the corpus, and a lookup for "set the goal for this packet" returns it first. Whether `.opencode/hooks` joins the corpus roots stays an index-growth decision, and the contract is reachable without it.
4. **Open, each a decision rather than work:** criteria rendered as their own list field changes the injected shape every runtime parses; a CI comparison of the three workflow YAML blocks needs a lint home; a non-UTF8 append policy chooses between refusing and preserving bytes; a resend signal for Claude Code and Codex would be a heuristic on file time, which may not be honest enough to ship.
5. **Devin unknown (review F107, rescoped by F310):** three `UserPromptSubmit` hooks write `additionalContext`; which the host keeps is unrecorded until DV-022 runs live.
<!-- /ANCHOR:limitations -->

---


