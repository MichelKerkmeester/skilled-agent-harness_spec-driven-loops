---
title: Deep Research Strategy Template
description: Runtime template copied to research/ during initialization to track research progress, focus decisions, and outcomes across iterations.
trigger_phrases:
  - "deep research strategy"
  - "research strategy template"
  - "research session tracking"
  - "exhausted research approaches"
  - "research stop conditions"
  - "ruled out research directions"
importance_tier: normal
contextType: planning
version: 1.14.0.19
---

# Deep Research Strategy - Session Tracking Template

Runtime template copied to `.opencode/specs/deep-loops/032-goal-opencode-plugin/research/`. Tracks research progress across iterations.

## 1. OVERVIEW

### Purpose

Serves as the "persistent brain" for a deep research session. Records what to investigate, what worked, what failed, and where to focus next. Read by the orchestrator and agents at every iteration.

### Usage

- **Init:** Orchestrator copies this template to `{spec_folder}/research/deep-research-strategy.md` and populates Topic, Key Questions, Known Context, and Research Boundaries from config and memory context.
- **Per iteration:** Agent reads Next Focus, writes iteration evidence, and the reducer refreshes What Worked/Failed, answered questions, carried-forward questions, ruled-out directions, and Next Focus.
- **Mutability:** Mutable — analyst-owned sections remain stable, while machine-owned sections are rewritten by the reducer after each iteration. Section 3 is a generated projection from the reducer registry.
- **Protection:** Shared state with explicit ownership boundaries. Orchestrator validates consistency on resume.

### Question Injection Surface

Use `{spec_folder}/research/inbox.jsonl` to append external questions during an active run. Each line is one JSON object with:

- `id`: stable inbox record identifier
- `text`: question text to promote
- `source`: concrete source label, such as an angle bank entry, analyst strategy, or operator note
- `origin`: one of `angle-bank`, `analyst-strategy`, `operator`, or `legacy-import`
- `injectedAtIteration`: iteration number when the question was introduced
- `promotedQuestionId`: promoted registry question id, or `null` until promotion

The reducer reads the inbox on every reduce step and carries `origin` into the question registry and dashboard badges. Direct edits to Section 3 still work as a compatibility path, but they are attributed as `legacy-import`.

Question ownership is explicit:

- Inbox rows are immutable input.
- The reducer registry is canonical question state.
- Section 3 is rendered only from the registry view.

When an inbox row targets an existing registry question but carries different text, the reducer keeps the registry value, records `operatorDecision: needs_decision`, and appends a `question_conflict` event with both `inboxValue` and `registryValue`.

---

## 2. TOPIC

Investigate whether related skill documentation (SKILL.md files, references/, assets/) and README files (skill READMEs, code READMEs) across the repo describe now-stale behavior for the `/goal` OpenCode plugin, following the phases 010-014 remediation completed this session plus the `goal_opencode.md` filename correction. Confirm the command file's live name at execution time, and check for other skills' passing mentions of the plugin, repo/skill README.md staleness, ENV_REFERENCE.md completeness for 3 new env vars, and any doc still describing `usage_limited` as unimplemented or goal-state as never cleaned up.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [ ] Is `.opencode/commands/goal_opencode.md` still the live command filename (not `goal.md`), and does anything reference the old/wrong name?
- [ ] Do other skills' own SKILL.md/references/assets (cli-opencode, cli-claude-code, sk-code, sk-prompt-models, system-skill-advisor's own SKILL.md, deep-loop-workflows, etc.) mention mk-goal.js/`/goal`/mk_goal, and are those mentions still accurate post-remediation?
- [ ] Do any repo-level or skill-level README.md files describe the goal plugin/command, and are they stale on new env vars, `store_health` status field, `mutation` field, or command filename?
- [ ] Is ENV_REFERENCE.md complete for the 3 new env vars (MK_GOAL_STATE_ARCHIVE_RETENTION_DAYS, MK_GOAL_STATE_ACTIVE_RETENTION_DAYS, MK_GOAL_STATE_SWEEP_INTERVAL_MS)?
- [ ] Does any doc still claim `usage_limited` is unimplemented/dead now that phase 013 wired `recordProviderUsageLimit`?
- [ ] Does any doc still claim goal-state never gets cleaned up now that phase 014 added `archiveGoalStateFile`/`pruneArchive`/`sweepOrphanedActiveStates`?
- [ ] Are the already-updated docs (goal_plugin.md, system-spec-kit SKILL.md, hook_system.md, feature_catalog entries, manual_testing_playbook entries, goal-prompting-runtime-specific.md) still internally accurate after cross-checking against the current mk-goal.js source?
- [ ] Are there any stale references to old function names, old status fields, or old behaviors anywhere else in the repo (grep sweep for mk-goal.js, mk_goal, goal_opencode, recordProviderUsageLimit, archiveGoalStateFile, pruneArchive, sweepOrphanedActiveStates)?

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS
- Not re-auditing or re-flagging the already-updated docs listed in the research prompt unless a genuine new inaccuracy is found in them.
- Not modifying `.opencode/plugins/mk-goal.js` or any implementation code — this is a documentation-staleness audit only.
- Not re-litigating phase 009 (owned by a separate in-flight session).

---

## 5. STOP CONDITIONS
- All related-skill/README/ENV_REFERENCE/feature_catalog/manual_testing_playbook/constitutional avenues have been swept via targeted grep + direct reads and no further doc classes remain unexamined.
- Per ANTI-CONVERGENCE in config: do not stop before iteration 10 unless every avenue is genuinely exhausted.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
[None yet]

<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
[None yet]

<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
[None yet]

<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
[No exhausted approach categories yet]

<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
[None yet]

<!-- /ANCHOR:ruled-out-directions -->

---

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS
- Do repo-level or skill-level `README.md` files describe the goal plugin/command and miss the new env vars, `store_health`, `mutation`, or filename? (iteration 3)
- Is `ENV_REFERENCE.md` complete for the three cleanup/archive env vars? (iteration 3)
- Does any doc still claim `usage_limited` is unimplemented/dead or that goal-state never gets cleaned up? (iteration 3)
- Do other skills' own `SKILL.md`, `references/`, and `assets/` mention `mk-goal.js`, `/goal`, or `mk_goal`, and are those mentions still accurate post-remediation? (iteration 3)
- Should the root README document the OpenCode command as `/goal_opencode`, or should it keep `/goal` but include a runtime-specific caveat pointing to the live command filename? (iteration 7)
- Should archive README staleness be fixed in place, annotated as historical, or left untouched because it is review archive context? (iteration 7)
- A later iteration should sweep `feature_catalog`, `manual_testing_playbook`, and `constitutional/` as distinct doc classes again for consistency, because this iteration focused primarily on skill docs and README surfaces. (iteration 7)
- Should `.opencode/plugins/README.md` remain only an entrypoint inventory, or should it be expanded because the root README points to it as the plugin contract? (iteration 7)
- Should the follow-up fix expand `.opencode/plugins/README.md`, or should the root README be changed to point at `goal_plugin.md` as the detailed contract while `.opencode/plugins/README.md` stays an inventory? (iteration 9)
- Should `.opencode/plugins/README.md:70` be corrected from "Both plugins" to wording that matches the five current entrypoints even if the `mk-goal` contract is documented elsewhere? (iteration 9)
- Should iteration 10 sweep the distinct non-README doc classes requested by the strategy again: `feature_catalog`, `manual_testing_playbook`, and `constitutional/`? (iteration 9)
- Should follow-up implementation expand `.opencode/plugins/README.md`, or retarget root `README.md` to `references/hooks/goal_plugin.md` as the detailed contract? (iteration 10)
- Should old-name and old-behavior references inside archive/phase materials be fixed in place, annotated as historical, or left untouched? (iteration 10)

<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
Should old-name and old-behavior references inside archive/phase materials be fixed in place, annotated as historical, or left untouched?

<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT

Prior research packets in this spec folder's `research_archive/`: `2026-06-28-goal-design-synthesis` (original design synthesis) and `2026-07-01-plugin-implementation-audit` (drift audit between planned phases 001-008 and shipped implementation). This session's remediation phases 010-014 (security/correctness fixes, command-surface normalization, regression-test backfill, design-fidelity/polish, goal-state cleanup-and-archive) landed the new functions, env vars, and fields listed in Section 2. A batch of docs was already updated this session per the research prompt's exclusion list — this session's job is to find what was MISSED, not to redo that work.

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 10
- Convergence threshold: 0.05
- Per-iteration budget: 12 tool calls, 10 minutes
- Progressive synthesis: true (default)
- research/research.md ownership: workflow-owned canonical synthesis output
- Lifecycle branches: `resume`, `restart` (live); `fork`, `completed-continue` (deferred, not runtime-wired)
- Machine-owned sections: reducer controls Sections 3, 6, 7-11A
- Question injection surface: `research/inbox.jsonl`
- Question conflict owner: reducer registry; `question_conflict` events surface inbox/registry disagreements for operator decision
- Canonical pause sentinel: `research/.deep-research-pause`
- Capability matrix: `.opencode/skills/deep-loop-workflows/deep-research/assets/runtime_capabilities.json`
- Capability matrix doc: `.opencode/skills/deep-loop-workflows/deep-research/references/guides/capability_matrix.md`
- Capability resolver: `.opencode/skills/deep-loop-workflows/deep-research/scripts/runtime-capabilities.cjs`
- Current generation: 1
- Started: 2026-07-01T14:36:44Z
- ANTI-CONVERGENCE floor: minIterations = 10 (equal to maxIterations) — forces exactly 10 iterations per explicit user instruction
