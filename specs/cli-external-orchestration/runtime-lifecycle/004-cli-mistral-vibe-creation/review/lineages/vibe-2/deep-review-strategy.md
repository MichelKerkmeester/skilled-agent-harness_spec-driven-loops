---
title: Deep Review Strategy - Mistral Vibe runtime lifecycle (lineage vibe-2)
description: Session tracking for the fan-out deep review of the cli-mistral-vibe runtime work, phases 013-022.
---

# Deep Review Strategy - Session Tracking

## 1. OVERVIEW

### Purpose

Persistent brain for this review lineage. Records which dimensions remain, what was found (P0/P1/P2), what review approaches worked or failed, and where to focus next.

### Usage

- **Init:** populated from config and the continuity ladder.
- **Per iteration:** the reviewer reads Next Focus, reviews the assigned dimension, updates findings, marks dimensions complete, and sets a new Next Focus.
- **Mutability:** mutable, updated by the reviewer throughout the session.

---

## 2. TOPIC

Review of `specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation` (spec-folder, Level 2 phase parent, 22 child phases). Focus: phases 013-022 and the 2026-11-15 fixes, plus the open lead on the Vibe compaction re-injection after the automatic handover tier.

---

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->
## 4. NON-GOALS

- Re-running the live VIB-HK conversation scenarios (they need a keyed Vibe session and a tmux pane).
- Reviewing the Mistral provider rosters in phases 002 and 003, which are outside the 013-022 focus.
- Editing any reviewed file: this lineage is observation-only.

---

## 5. STOP CONDITIONS

- `config.maxIterations` (5) reached, which is the bound stop policy for this lineage.
- Three consecutive failed iterations.
- An active P0 that cannot be adjudicated inside one iteration.

---

<!-- ANCHOR:completed-dimensions -->
## 4. COMPLETED DIMENSIONS
- [x] correctness
- [x] security
- [x] traceability
- [x] maintainability

<!-- /ANCHOR:completed-dimensions -->
<!-- ANCHOR:running-findings -->
## 5. RUNNING FINDINGS
- P0 (Blockers): 0
- P1 (Required): 4
- P2 (Suggestions): 14
- Resolved: 0

<!-- /ANCHOR:running-findings -->
## 8. WHAT WORKED

- Reading the detector and both of its bindings side by side: it showed that one watermark serves two seams, which is the root cause the lead asked for (iteration 1).
- Reading the recorded live evidence before the code: it established that the on-disk VIB-HK rows read PASS, so the lead had to be treated as a latent path rather than a contradiction (iteration 1).
- Comparing the recorded `result.json` timestamps against the handover commit date: it turned the operator lead into a dated traceability finding instead of a code guess (iteration 2).
- Reading the writers and the readers of each state directory together: it separated the two containment gaps (caller-supplied `cwd`, predictable temp fallback) from the paths that already validate, so the security pass produced three P2s and four confirmed-clean surfaces instead of a blanket warning (iteration 3).
- Running `git log` over each doc path before judging it: it turned "the doc is stale" into "this doc was never revised by the commit that changed the behaviour", which is what raised the goal README to P1 and kept the other four at P2 (iteration 4).
- Counting the file instead of trusting the prose: `grep -c '^\[\[hooks\]\]' .vibe/hooks.toml` returned 18 against a paragraph that says one, which is a one-command proof of drift (iteration 4).
- Taking the operator's own discriminator literally: "the same journal with a fresh state dir returns it" can only mean the live run had already written state, which pointed straight at the watermark write at `:231` preceding the empty return at `:252` (iteration 5).
- Reading the two compaction scenarios' pass criteria instead of their titles: both require the `# Goal:` heading, which is exactly the condition under which the defect cannot fire (iteration 5).

---

## 9. WHAT FAILED

- Searching for the live failure by grepping the packet: the recorded runs all read PASS, so the failure is not on disk and the search cost calls without an answer (iteration 1).
- Looking for a `checklist.md` in phases 013-022: none exists, so the core `checklist_evidence` protocol has no target and had to be recorded as notApplicable (iteration 2).
- Hunting for an injection path through the session id or the goal packet: both are already validated (`nudge.cjs:54,745-747`, `goal-slice.cjs:271-303,443-462`), so the security pass found no P0/P1 and the effort went into the two state-directory gaps instead (iteration 3).
- Counting raw over-width lines as a style violation: 14 of the 14 over-width lines in `compaction-context.mjs` are box-drawing comment rules, so the count had to be re-run with the box characters excluded before it meant anything (iteration 4).
- Grepping the feature catalog for the hand-over tier: the catalog has no mention of it at all, so the overlay check could only report an omission rather than a contradiction (iteration 5).

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### **`VIBE_SPEC_FOLDER` can point the goal slice outside the checkout.** Ruled out by `goal-slice.cjs:271-303,443-462`. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **`VIBE_SPEC_FOLDER` can point the goal slice outside the checkout.** Ruled out by `goal-slice.cjs:271-303,443-462`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`VIBE_SPEC_FOLDER` can point the goal slice outside the checkout.** Ruled out by `goal-slice.cjs:271-303,443-462`.

### **A session id can traverse the state path.** Ruled out by `nudge.cjs:54,745-747` and by `stateKey` hashing the id at `compaction-context.mjs:72-74`. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **A session id can traverse the state path.** Ruled out by `nudge.cjs:54,745-747` and by `stateKey` hashing the id at `compaction-context.mjs:72-74`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A session id can traverse the state path.** Ruled out by `nudge.cjs:54,745-747` and by `stateKey` hashing the id at `compaction-context.mjs:72-74`.

### **A strict `post_tool` failure can blank the tool result.** Ruled out: the entry carries no `strict` (`.vibe/hooks.toml:124-128`). -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **A strict `post_tool` failure can blank the tool result.** Ruled out: the entry carries no `strict` (`.vibe/hooks.toml:124-128`).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A strict `post_tool` failure can blank the tool result.** Ruled out: the entry carries no `strict` (`.vibe/hooks.toml:124-128`).

### **The `guards-and-hooks.md` plugin table misclassifies a plugin.** Ruled out: the 21 rows match the 21 files in `.opencode/plugins/`, and the three `not needed` verdicts each name the reason. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **The `guards-and-hooks.md` plugin table misclassifies a plugin.** Ruled out: the 21 rows match the 21 files in `.opencode/plugins/`, and the three `not needed` verdicts each name the reason.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The `guards-and-hooks.md` plugin table misclassifies a plugin.** Ruled out: the 21 rows match the 21 files in `.opencode/plugins/`, and the three `not needed` verdicts each name the reason.

### **The 2026-11-15 fixes were claimed but not landed.** Ruled out: all four are present at the cited lines. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **The 2026-11-15 fixes were claimed but not landed.** Ruled out: all four are present at the cited lines.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The 2026-11-15 fixes were claimed but not landed.** Ruled out: all four are present at the cited lines.

### **The 2026-11-15 goal fallback is missing from the relaunch core.** Ruled out: `vibeGoalPacket` is at `relaunch-core.cjs:1201-1243` and is called at `:1243`. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **The 2026-11-15 goal fallback is missing from the relaunch core.** Ruled out: `vibeGoalPacket` is at `relaunch-core.cjs:1201-1243` and is called at `:1243`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The 2026-11-15 goal fallback is missing from the relaunch core.** Ruled out: `vibeGoalPacket` is at `relaunch-core.cjs:1201-1243` and is called at `:1243`.

### **The catalog's seven-hard-rule claim is stale.** Ruled out: each rule has a check at the cited line in `dispatch-rule-checks.mjs`. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **The catalog's seven-hard-rule claim is stale.** Ruled out: each rule has a check at the cited line in `dispatch-rule-checks.mjs`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The catalog's seven-hard-rule claim is stale.** Ruled out: each rule has a check at the cited line in `dispatch-rule-checks.mjs`.

### **The doctor's Vibe rows point at missing scripts.** Ruled out: all three scripts exist. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **The doctor's Vibe rows point at missing scripts.** Ruled out: all three scripts exist.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The doctor's Vibe rows point at missing scripts.** Ruled out: all three scripts exist.

### **The goal adapter README's test command is stale.** Ruled out: `goal-vibe.test.mjs` exists beside the adapter and the command matches the repository convention. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **The goal adapter README's test command is stale.** Ruled out: `goal-vibe.test.mjs` exists beside the adapter and the command matches the repository convention.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The goal adapter README's test command is stale.** Ruled out: `goal-vibe.test.mjs` exists beside the adapter and the command matches the repository convention.

### **The goal slice renderer is broken.** Ruled out: `goal-inject.mjs:30-41` returns the packet's `chatSlice`, and the diagnosis' positive control produced a 2503-character block with the goal slice and the history offer. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **The goal slice renderer is broken.** Ruled out: `goal-inject.mjs:30-41` returns the packet's `chatSlice`, and the diagnosis' positive control produced a 2503-character block with the goal slice and the history offer.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The goal slice renderer is broken.** Ruled out: `goal-inject.mjs:30-41` returns the packet's `chatSlice`, and the diagnosis' positive control produced a 2503-character block with the goal slice and the history offer.

### **The hand-over enable switch is undocumented or unimplemented.** Ruled out: `handover-parts.mjs:66-72` routes through the shared resolver and `SKILL.md:197` names both switches. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **The hand-over enable switch is undocumented or unimplemented.** Ruled out: `handover-parts.mjs:66-72` routes through the shared resolver and `SKILL.md:197` names both switches.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The hand-over enable switch is undocumented or unimplemented.** Ruled out: `handover-parts.mjs:66-72` routes through the shared resolver and `SKILL.md:197` names both switches.

### **The hand-over part can deny a turn.** Ruled out: `armHandoverTurnEnd` returns `null` on every path (`handover-parts.mjs:286-369`). -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **The hand-over part can deny a turn.** Ruled out: `armHandoverTurnEnd` returns `null` on every path (`handover-parts.mjs:286-369`).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The hand-over part can deny a turn.** Ruled out: `armHandoverTurnEnd` returns `null` on every path (`handover-parts.mjs:286-369`).

### **The hook is not registered.** Ruled out: `.vibe/hooks.toml:19-24` registers `turn-start`, and the recorded runs show the advisor part landing in the same `pre_agent_turn` record. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **The hook is not registered.** Ruled out: `.vibe/hooks.toml:19-24` registers `turn-start`, and the recorded runs show the advisor part landing in the same `pre_agent_turn` record.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The hook is not registered.** Ruled out: `.vibe/hooks.toml:19-24` registers `turn-start`, and the recorded runs show the advisor part landing in the same `pre_agent_turn` record.

### **The line-length convention is violated across the Vibe hook surface.** Ruled out: the 14 to 10 over-width lines per file are box-drawing comment rules (`// ─────`), which phase 013 treats as a separate style item. Only two non-box lines exceed 120, and they are R4-P2-005. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **The line-length convention is violated across the Vibe hook surface.** Ruled out: the 14 to 10 over-width lines per file are box-drawing comment rules (`// ─────`), which phase 013 treats as a separate style item. Only two non-box lines exceed 120, and they are R4-P2-005.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The line-length convention is violated across the Vibe hook surface.** Ruled out: the 14 to 10 over-width lines per file are box-drawing comment rules (`// ─────`), which phase 013 treats as a separate style item. Only two non-box lines exceed 120, and they are R4-P2-005.

### **The mode registry, hub router and leaf manifest disagree about the Vibe mode.** Ruled out: all three name `cli-mistral-vibe` with the same routing phrases. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **The mode registry, hub router and leaf manifest disagree about the Vibe mode.** Ruled out: all three name `cli-mistral-vibe` with the same routing phrases.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The mode registry, hub router and leaf manifest disagree about the Vibe mode.** Ruled out: all three name `cli-mistral-vibe` with the same routing phrases.

### **The playbook and the scenario folder disagree on the scenario count.** Ruled out: both are 27. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **The playbook and the scenario folder disagree on the scenario count.** Ruled out: both are 27.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The playbook and the scenario folder disagree on the scenario count.** Ruled out: both are 27.

### **The reader cannot see the compaction.** Ruled out: `session-readers/vibe.mjs:76-107` seeds from the committed snapshot generation plus the journal tail, and `VIB-HK-006/diagnosis.md:1-8` records the fix and a 4/4 rerun. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **The reader cannot see the compaction.** Ruled out: `session-readers/vibe.mjs:76-107` seeds from the committed snapshot generation plus the journal tail, and `VIB-HK-006/diagnosis.md:1-8` records the fix and a 4/4 rerun.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The reader cannot see the compaction.** Ruled out: `session-readers/vibe.mjs:76-107` seeds from the committed snapshot generation plus the journal tail, and `VIB-HK-006/diagnosis.md:1-8` records the fix and a 4/4 rerun.

### **The session-lifecycle README's part order is wrong.** Ruled out: `turn-start.mjs:92-101` composes completion, compaction, advisor, save nudge and hand-over in exactly the order the README states. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **The session-lifecycle README's part order is wrong.** Ruled out: `turn-start.mjs:92-101` composes completion, compaction, advisor, save nudge and hand-over in exactly the order the README states.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The session-lifecycle README's part order is wrong.** Ruled out: `turn-start.mjs:92-101` composes completion, compaction, advisor, save nudge and hand-over in exactly the order the README states.

### **The watermark write is denied by the sandbox.** Ruled out for the current code: `compaction-context.mjs:67-70` puts the state dir under `payload.cwd`, and the captured `pre_tool` payload carries `cwd` (`guards-and-hooks.md:180-195`), so the write lands in the session's own folder. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **The watermark write is denied by the sandbox.** Ruled out for the current code: `compaction-context.mjs:67-70` puts the state dir under `payload.cwd`, and the captured `pre_tool` payload carries `cwd` (`guards-and-hooks.md:180-195`), so the write lands in the session's own folder.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The watermark write is denied by the sandbox.** Ruled out for the current code: `compaction-context.mjs:67-70` puts the state dir under `payload.cwd`, and the captured `pre_tool` payload carries `cwd` (`guards-and-hooks.md:180-195`), so the write lands in the session's own folder.

<!-- /ANCHOR:exhausted-approaches -->
## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

## 11. RULED OUT DIRECTIONS

[Review angles that were investigated and definitively eliminated]

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- Dimension: none remaining - Focus area: synthesis - Reason: five iterations are complete, all four declared dimensions and the cross-reference fallback are covered, and the bound stop policy is `max-iterations`. - Rotation status: complete. - Blocked/productive carry-forward: productive — the cross-reference pass produced the sharpest statement of the open lead's root cause. - Required evidence: none; the synthesis reads the registry and the five iteration artifacts. - Recovery note: not applicable. Review verdict: CONDITIONAL

<!-- /ANCHOR:next-focus -->
## 13. KNOWN CONTEXT

### Bounded Context Snapshot

- **Target pointers:** `.skilled/hooks/session-lifecycle/vibe/{compaction-context,compaction-post-tool,turn-start,turn-end,session-start}.mjs`, `.skilled/hooks/shared/session-readers/vibe.mjs`, `.skilled/hooks/session-handover/vibe/handover-parts.mjs`, `.skilled/hooks/session-handover/lib/relaunch-core.cjs`, `.skilled/hooks/goal/vibe/goal-inject.mjs`, `.vibe/hooks.toml`.
- **Behavior claims:** phase 018 promises the goal slice and history locator are re-injected after a compaction, detected from the journal; phase 022 records 26 PASS live hook scenarios; the automatic handover tier (`e5b8611a4fa`) added a hand-over part to all three Vibe composers.
- **Reuse and conventions:** every Vibe hook fails open, prints one `hook_specific_output.additional_context` line, and never exits non-zero. State lives under `<payload.cwd>/.skilled/skills/.state/`.
- **Review risks and gaps:** the live VIB-HK runs need a keyed Vibe session, so this lineage reasons from the recorded evidence and the code. `resource-map.md` is absent, so the Resource Map Coverage Gate is skipped.

---

## 14. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->
[Alignment checks completed across core and overlay protocols]

| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | partial | 2 | Phase 018 claim single-consumer; phase 22 live claim stale for VIB-HK-005/006/007. |
| `checklist_evidence` | core | notApplicable | 2 | No phase in 013-022 carries a checklist.md; evidence lives in tasks.md checkboxes. |
| `skill_agent` | overlay | pass | 2 | Playbook lists 27 scenarios and hook-scenarios/ holds 27 files. |
| `agent_cross_runtime` | overlay | pass | 2 | .vibe/agents holds 11 profiles and sync-agents-vibe.cjs exists at the doctor path. |
| `feature_catalog_code` | overlay | pending | - | - |
| `playbook_capability` | overlay | partial | 2 | Playbook names the runner and scenario ids but carries no verdicts. |
<!-- MACHINE-OWNED: END -->

---

## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->
| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| `.skilled/hooks/session-lifecycle/vibe/compaction-context.mjs` | D1 | 1 | 2 P1, 2 P2 | partial |
| `.skilled/hooks/session-lifecycle/vibe/compaction-post-tool.mjs` | D1 | 1 | 0 | partial |
| `.skilled/hooks/session-lifecycle/vibe/turn-start.mjs` | D1 | 1 | 0 | partial |
| `.skilled/hooks/session-lifecycle/vibe/turn-end.mjs` | D1 | 1 | 0 | partial |
| `.skilled/hooks/shared/session-readers/vibe.mjs` | D1 | 1 | 0 | partial |
| `.skilled/hooks/session-handover/vibe/handover-parts.mjs` | D1 | 1 | 0 | partial |
| `.skilled/hooks/goal/vibe/goal-inject.mjs` | D1 | 1 | 0 | partial |
| `.skilled/bin/skilled-loop` | D1, D3 | 2 | 0 | partial |
| `spec.md` | D3 | 2 | 1 P1 | partial |
| `022-vibe-hook-playbook-and-live-scenarios/scratch/verdicts.md` | D3 | 2 | 1 P1, 1 P2 | partial |
| `manual-testing-playbook.md` | D3 | 2 | 1 P2 | partial |
<!-- MACHINE-OWNED: END -->

---

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 5
- Convergence threshold: 0.1
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=fanout-vibe-2-1794765851303-zrv85l, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 24 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=[spec_code, checklist_evidence], overlay=[skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability]
- Started: 2026-11-15T18:11:42.000Z
<!-- MACHINE-OWNED: END -->
