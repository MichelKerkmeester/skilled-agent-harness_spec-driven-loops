---
title: "Implementation Summary"
description: "Q0 took the over-suppresses branch, then three Opus research iterations fixed the stored route receipt design for phase 011: suppress on weak follow-ups, a lock-free per-session file store, clock-bound expiry and a frozen measurement."
trigger_phrases:
  - "route receipts research implementation summary"
importance_tier: "normal"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/010-route-receipts-research"
    last_updated_at: "2026-11-18T19:26:28Z"
    last_updated_by: "generate-context"
    recent_action: "Deep research finished: 3 iterations, Q1-Q5 answered"
    next_safe_action: "Build phase 011 from research.md section 8"
    packet_purpose: "Purpose: Confirm on the final strip rule that weak follow-ups still take the over-suppresses branch, then fix one receipt design that phase 011 can build with no design choice left open."
    blockers: []
    key_files:
      - "research/research.md"
      - "spec.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "20078428-5166-43d7-85ac-a68d9210f82f"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 010-route-receipts-research |
| **Completed** | 2026-11-18 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The premise rerun kept weak follow-ups on the over-suppresses branch, so the research ran. One deep-research lineage of three iterations answered Q1 to Q5 and wrote one design phase 011 can build without a design choice left open.

### Phase 10: route-receipts-research

The design in `research/research.md`:

- **Q1:** on a weak follow-up the hook suppresses the brief instead of reusing the earlier route. Only an `ok`, rendered, unfloored turn writes a receipt. The guard reads the policy reason from stripped text through its own `shouldFireAdvisor` call.
- **Q2:** a pure-TypeScript store in `route-receipts/` under the shared state base, written as a temp file plus rename with no lock. The session bound reuses `MAX_DIRECTIVE_LIFECYCLE_SESSIONS`, and the Python helper and lifecycle schema stay unchanged.
- **Q3:** a receipt expires on a lifecycle clock mismatch or a transcript shrink, with no age or turn limit.
- **Q4:** Claude, Codex and Vibe are in. DSH is in with a boundary call in two handlers. Pi and OpenCode are out, for stated reasons.
- **Q5:** a pure `decideRouteReceiptGuard` the bench calls plus a hook replay. The threshold is `H_after = 0` of 5, with pairs 7 and 8, controls 2 and 4 and `C_after = 0` unchanged. The false-carry pair is frozen.

Section 8 of `research/research.md` is the amendment phase 011's T001 applies.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `research/` | Created | Config, state log, strategy, three iterations, deltas, dispatch receipts, ledgers, dashboard and resource map, written by the loop |
| `research/research.md` | Created | Answers to Q1 to Q5, the 011 amendment and the conductor verification note |
| `spec.md` | Modified | The generated findings fence under Open Questions |
| `implementation-summary.md` | Modified | The Q0 record and this outcome |
| `description.json`, `graph-metadata.json` | Modified | Derived metadata refreshed by the continuity save |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The conductor ran Q0 first and committed it. A background conductor agent then executed `deep-research.yaml` in auto mode with `cli-claude-code`, `claude-opus-5-5`, effort `high`, config dir `/Users/michelkerkmeester/.claude-account2`, 3 iterations and stop policy `max-iterations`, with cwd and repo root pinned to worktree 474. The recursion guard refuses to launch `claude -p` from inside a Claude session, so with the operator's approval each iteration was started detached, without `CLAUDE_CODE_SESSION_ID` and with `CLAUDE_CONFIG_DIR` set to the second account. The headless leaves could not call the append gateway, so the agent appended each leaf's unchanged delta record itself, checked byte-identical with `cmp`. The conductor then checked the state log, opened every citation in `research/research.md` and ran the two probes the leaves could not run.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Decide the premise on the stripped-text `H` and record the raw-text `H` beside it | The receipt guard will read stripped text, as 003's planned guard did, so that is the reading that predicts what the guard sees |
| Mirror phase 005's executor | The operator set no executor for this phase, and 005 is the nearest research run in this packet |
| Operator decision 2026-11-18: launch the iterations with phase 005's override | The deep-loop recursion guard refuses `claude -p` inside a Claude session. The operator chose "Override like 005" over native in-session agents or a stop |
| Append each leaf's refused delta record unchanged | The headless permission layer refused the gateway call in all three iterations, and the alternative was losing valid iterations |
| No allow rule was added to the second account's settings | The agent declined to edit permission settings on a relayed instruction. The `cmp`-checked append made it unneeded |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Pre-006 baseline bench at `84a2d1eb697`, run during planning | `N=9 H=5 Hsame=2 C=19`, `Tests 1 passed (1)`. Not the premise result, which waits on phase 006 |
| Q0 bench rerun, 2026-11-18 at `18ce562e8b3` on branch `worktrees/474-advisor-pasted-context-and-crash-fallback`, after a rebuild | `N=9`, stripped-text `H=5`, raw-text `H=4` (pair 9 raw reads `explicit_skill_or_governance_marker`), `Hsame=2`, `C=19`, `Tests 1 passed (1)`. `C` ids: rr-iter2-008, rr-iter2-028, rr-iter2-032, rr-iter2-034, rr-iter2-041, rr-iter3-073, rr-iter3-075, rr-iter3-078, rr-iter3-079, rr-iter3-081, rr-iter3-090, rr-iter3-130, rr-iter3-131, rr-iter3-133, rr-iter3-141, rr-iter3-147, rr-iter3-170, rr-iter3-179, rr-paste-208 |
| Q0 branch: over-suppresses | Decided on stripped-text `H`: `H=5 >= 5` and `C=19 > 0`, by phase 003's rule unchanged. The research proceeds; no operator stop |
| Executor config | `cli-claude-code claude-opus-5-5 high /Users/michelkerkmeester/.claude-account2` from `research/deep-research-config.json` |
| Iteration records | `rg -c '"type":"iteration"' research/deep-research-state.jsonl` printed 3. Each record carries `status: complete`, `target_agent: deep-research`, `resolved_route`, `agent_definition_loaded: true` and `mode: research` |
| Dispatch cwd | Every intent and completion receipt records cwd `/Users/michelkerkmeester/worktrees/public/474-advisor-pasted-context-and-crash-fallback` |
| Q1 to Q5 headings | `rg -n '^#+ .*Q[1-5]' research/research.md` printed lines 54, 84, 103, 116 and 139 |
| Citations | 57 unique citations in `research/research.md`: 56 match, 1 resolves with the line off (`directive-lifecycle-store.py:79-81`, correct line `:76`), 0 failed, none unchecked. Listed in the research's conductor verification note |
| Q5 precondition probe on `dist/` at `98a58b6245b` | Harm-pair tasks 1, 3, 5, 6 and 9 all unfloored. The generated findings fence still says UNKNOWN because it was written before the probe |
| Write boundary | Primary checkout unchanged: the same 4 ` M` lines as the session baseline. Worktree changes stay inside this phase, apart from the two parent `graph-metadata.json` timestamp refreshes noted below |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The premise sits on the bar.** One pair decides the branch, so a small change can flip it. Q0 recorded both readings.
2. **The design judgments are one model's lens.** Suppress over reuse, no turn or age limit and the lock-free safety argument rest on Opus judgment, marked INFERRED in the research. Phase 011's tests are the external check.
3. **The continuity save refreshed two parent `graph-metadata.json` files.** Only `last_save_at`, `last_active_child_id` and `last_active_at` changed in `../graph-metadata.json` and `../../graph-metadata.json`. They are derived metadata outside this phase's file list, kept and committed with it.
4. **The loop's spec pre-init branch was skipped.** Only its `spec_check_result` row was recorded, so the generated fence is the only spec change.
<!-- /ANCHOR:limitations -->

---
