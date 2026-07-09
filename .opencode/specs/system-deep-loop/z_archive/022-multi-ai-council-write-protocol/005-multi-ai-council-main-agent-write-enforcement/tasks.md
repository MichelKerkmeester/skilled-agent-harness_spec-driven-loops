---
title: "Task Breakdown: Multi-AI Council main-agent write enforcement [system-deep-loop/z_archive/022-multi-ai-council-write-protocol/005-multi-ai-council-main-agent-write-enforcement/tasks]"
description: "Bullet-level work items mapped to plan.md phases. Each task names the file, the section, and the exit signal."
trigger_phrases:
  - "100 tasks"
  - "council main agent enforcement tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/022-multi-ai-council-write-protocol/005-multi-ai-council-main-agent-write-enforcement"
    last_updated_at: "2026-05-09T17:50:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored task list"
    next_safe_action: "Author checklist.md verification gates, then dispatch implementation"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "council-main-agent-enforcement-2026-05-09"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

# Task Breakdown: Multi-AI Council main-agent write enforcement

<!-- SPECKIT_LEVEL: 2 -->

<!-- ANCHOR:notation -->
## TASK NOTATION

- `[ ]` open task; `[x]` complete; `[~]` in progress; `[/]` deferred.
- Task ID format: `T-<phase>.<seq>` (e.g., `T-2.4` = phase 2, fourth task).
- All tasks reference REQs from `spec.md` §4 unless otherwise noted.
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## PHASE 1: SETUP

(Audit & Confirm Insertion Points)

- [ ] **T-1.1** Read `.opencode/agents/multi-ai-council.md` §1, §7, §9, §12, §13. Record line ranges for each section in a scratch note.
- [ ] **T-1.2** Diff `.opencode/agents/multi-ai-council.md` against `.claude/agents/multi-ai-council.md` and `.gemini/agents/multi-ai-council.md` (body only). Confirm parity. If divergent, file a sync sub-task before continuing.
- [ ] **T-1.3** Read `.codex/agents/multi-ai-council.toml`. Map §1, §7, §9, §12, §13 to TOML keys. Record the key path for each.
- [ ] **T-1.4** Locate the parity test from packet 098: `find .opencode/skills/system-spec-kit -name 'multi-ai-council-runtime-parity*'`. Read it. Determine whether it asserts body-text equivalence or only frontmatter.
- [ ] **T-1.5** If T-1.4 reveals body-text is NOT covered, scope a parity-test extension as task T-3.6 (below).
- [ ] **T-1.6** Read `.opencode/skills/system-spec-kit/scripts/multi-ai-council/lib/persist-artifacts.js`. Confirm the named exports list: `writeStateJsonl`, `writeConfig`, `writeStrategyMd`, `writeSeat`, `writeDeliberation`, `writeCritique`, `writeReport`. Match this list to the new §13 numbered sequence.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## PHASE 2: IMPLEMENTATION

(Author Canonical Edits in `.opencode` Mirror, then propagate)

- [ ] **T-2.1** Edit `.opencode/agents/multi-ai-council.md` §1: insert Step 0 RESOLVE before step 1 RECEIVE. Use the 4-stage resolution rule from `spec.md` §3. Renumber existing steps 1–8 to 1–8 (numbering preserved; the new step is 0, not a renumber).
- [ ] **T-2.2** Edit §7 ALWAYS: append the hard write-or-fail rule with the minimum required artifact set enumerated.
- [ ] **T-2.3** Edit §7 NEVER: append "Deliver a council report without persisting the canonical artifact set."
- [ ] **T-2.4** Edit §9 OUTPUT VERIFICATION: append the PERSISTENCE VERIFICATION block with 9 checklist items.
- [ ] **T-2.5** Edit §9 SELF-CHECK: extend from 10 to 11 questions; the new Q11 covers persistence. Update the failure-handler trailer.
- [ ] **T-2.6** Edit §12 OUTPUT PROTOCOL: replace the conditional opening sentence with the unconditional version. Cite §1 Step 0 RESOLVE.
- [ ] **T-2.7** Edit §13 INVOCATION CONTRACT: restructure the first-call paragraph into a numbered checklist with explicit writer-function calls. Append "(emit artifact_written event)" to each persistence step.
- [ ] **T-2.8** Self-read the file end-to-end. Grep for stale "planning-only" or "When invoked with a spec_folder" tokens. Resolve any hits.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## PHASE 3: VERIFICATION

(Propagate to Mirrors + Update References, then run parity test, validator, and sandbox smokes — see Phase 4 below for the verify run)

- [ ] **T-3.1** Apply T-2.1 through T-2.8 edits byte-for-byte to `.claude/agents/multi-ai-council.md`.
- [ ] **T-3.2** Apply the same edits byte-for-byte to `.gemini/agents/multi-ai-council.md`.
- [ ] **T-3.3** Apply the equivalent edits to `.codex/agents/multi-ai-council.toml`, encoded into the body keys mapped in T-1.3.
- [ ] **T-3.4** Edit `.opencode/skills/system-spec-kit/references/multi-ai-council/folder-layout.md`: prepend a §0 persistence-mandatory paragraph that cites the agent's new Step 0 RESOLVE.
- [ ] **T-3.5** Edit `.opencode/skills/system-spec-kit/references/multi-ai-council/state-format.md`: append a paragraph stating that runs without `council_complete` are incomplete.
- [ ] **T-3.6** (Conditional on T-1.5) Extend the 4-runtime parity test to assert body-text equivalence for §1, §7, §9, §12, §13.
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:phase-4 -->
## Phase 4: Verify

- [ ] **T-4.1** Run the 4-runtime parity test. Expect pass. If fail, identify the mirror that drifted and re-apply the missed edit.
- [ ] **T-4.2** Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh skilled-agent-orchestration/100-multi-ai-council-main-agent-write-enforcement --strict`. Expect exit 0.
- [ ] **T-4.3** Sandbox smoke A: dispatch the Multi-AI Council against a small planning question via opencode main-agent slot WITHOUT naming a spec folder. Expected: agent HALTs at Step 0 RESOLVE and emits the disambiguation question.
- [ ] **T-4.4** Sandbox smoke B: re-dispatch naming this packet as the spec folder. Expected: full canonical artifact set materializes under `<packet>/ai-council/`, ending with `council_complete` event in the state log.
- [ ] **T-4.5** Author `implementation-summary.md`. Replace ALL placeholder tokens (no `[###-feature-name]`, no `[YYYY-MM-DD]`). Record smoke A + B results. Set continuity `completion_pct: 100`.
- [ ] **T-4.6** Run `/memory:save` to refresh `description.json` and `graph-metadata.json`. Confirm POST-SAVE QUALITY REVIEW shows no HIGH issues.
<!-- /ANCHOR:phase-4 -->

<!-- ANCHOR:completion -->
## Completion Criteria

All P0 tasks complete with evidence; all 4 mirrors carry the same body changes; parity test passes; strict validate exits 0; both sandbox smokes match expected behavior. `implementation-summary.md` filled with real Phase 4 evidence (no placeholder tokens). Continuity `completion_pct: 100`.
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- Requirements: `spec.md` §4 REQ-001..REQ-012.
- Plan phases: `plan.md` §4 IMPLEMENTATION PHASES.
- Verification gates: `checklist.md` (per-REQ evidence slots).
- Predecessor packets: 080, 089, 092, 098 (all under `skilled-agent-orchestration/`).
- Library: `.opencode/skills/system-spec-kit/scripts/multi-ai-council/lib/persist-artifacts.js` (read-only dependency).
<!-- /ANCHOR:cross-refs -->

## Out-of-Scope Reminders

- Do NOT touch `lib/persist-artifacts.js` — packet 098 owns it.
- Do NOT change permission YAML — packet 098 owns it.
- Do NOT add a `--no-persist` flag — Q3 in `spec.md`, deferred.
- Do NOT auto-create a fallback `_ai-council-staging/` folder — Q1 in `spec.md`, recommendation is HALT-and-ASK.
- Do NOT modify §0, §2, §3, §4, §5, §6, §8, §10, §11, §14, §15, §16, §17, §18 of the agent body. Scope is §1, §7, §9, §12, §13 only.
