---
title: "Feature Specification: Build command surfacing in the skill advisor so every tracked slash command reaches the model with a run-or-ask policy and a chat-only request reaches a proper workflow"
description: "Thirteen phases that make the skill advisor surface every tracked slash command with a run-or-ask policy and bring a chat-only request onto a proper workflow."
trigger_phrases:
  - "command surfacing build phase parent spec"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/routing-and-scoring/008-command-surfacing-build"
    last_updated_at: "2026-04-11T00:00:00Z"
    last_updated_by: "template-author"
    recent_action: "Initialize phase-parent continuity block"
    next_safe_action: "Plan or resume a child phase folder"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "template-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: phase-parent-spec | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT
  FORBIDDEN content (do NOT author at phase-parent level):
    - merge/migration/consolidation narratives (consolidate*, merged from, renamed from, collapsed, X→Y, reorganization history)
    - migrated from, ported from, originally in
    - heavy docs: plan.md, tasks.md, decision-record.md, implementation-summary.md — these belong in child phase folders only
  REQUIRED content (MUST author at phase-parent level):
    - Root purpose: what problem does this entire phased decomposition solve?
    - Sub-phase list: which child phase folders exist and what each one does
    - What needs done: the high-level outcome the phases work toward
-->

# Feature Specification: Build command surfacing in the skill advisor so every tracked slash command reaches the model with a run-or-ask policy and a chat-only request reaches a proper workflow

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-11-12 |
| **Branch** | `worktrees/352-command-surfacing-research` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | system-skill-advisor/routing-and-scoring/008-command-surfacing-build |
| **Predecessor** | 007-command-surfacing-and-workflow-enforcement |
| **Successor** | None |
| **Handoff Criteria** | Each phase meets its exit check in the Phase Handoff Criteria table before the next phase starts |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A user who chats without typing a command gets an improvised approach from the model, even where a slash command already owns a complete workflow for the task. The repository ships 44 tracked slash commands that own complete workflows, but the skill advisor reaches the model with skills. Only `/doctor:*` commands arrive as a runnable line, 22 of 62 command bridge rows are off in the TypeScript scorer, the recommendation carries no command field and no rule tells a model what to do with a surfaced command. Those gaps are why the chat user gets the improvised approach. The evidence is in `../007-command-surfacing-and-workflow-enforcement/research/research.md` and the independent review `../007-command-surfacing-and-workflow-enforcement/research/synthesis-review.md`.

### Purpose
This packet exists so an AI that works through skills stays free to choose how it does a task and lands on the best correct workflow for that task more often than before. Delivery is the means. A tracked command reaches the model with a run, start or ask policy, so the model can see the workflow that fits the task. Delivery counts show the means works. They do not show the outcome yet (see Open Questions).

The model stays free. A command is surfaced beside its hub mode as a suggestion, and the model picks freely between the command path and the skill path, even for the whole job. Either path must still be the skill's or the command's own workflow, never an improvised one. This is operator decision D2, recorded in section 13 of `../007-command-surfacing-and-workflow-enforcement/research/research.md`.

To get there, deliver the review's recommendation set (R1 to R10, L1 to L12, G1 to G7) in the order its build plan gives, under the operator decisions D1 to D5 recorded in section 13 of `../007-command-surfacing-and-workflow-enforcement/research/research.md`. When the last phase closes, a plain chat request surfaces the matching command beside its skill with a run, start or ask policy, the model picks between the command path and the skill path, and a measured baseline shows what changed.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below. This keeps the parent from drifting stale as phases execute and pivot.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Measure command routing before changing it: a command prompt corpus and a baseline for the 44 tracked commands.
- Generate one command inventory with a risk class and a derived policy per command and per doctor route.
- Make plain chat reach a command: attach the command to its owner skill for hub commands, and author intent phrases for commands with no hub mode.
- Reach a command from a paraphrase that shares no words with it, by matching the prompt's meaning against a vector per command.
- Extend the recommendation and the brief with the command, its policy and its owner skill.
- Bind the behaviour in `AGENTS.md` Gate 2 and in a generated pointer for runtimes with no brief.
- Prove the behaviour per runtime from transcripts.

### Out of Scope
- Changing how skills are scored against each other. The four existing accuracy numbers are a floor in every phase.
- Surfacing the private, untracked `/local-skilled-alignment` command (decision D5).
- Forcing the command path. Decision D2 keeps the model free to pick the skill path, as the Purpose states. It is recorded in section 13 of `../007-command-surfacing-and-workflow-enforcement/research/research.md`.
- Adding a command front door to a skill that has none.

### Files to Change
Audit trail only. Each child's `plan.md` holds the detail, and phases 5 to 7 are not planned yet, so their rows name the area the review points at.

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/` | Create | 001 | Command prompt corpus, its scorer and a baseline file |
| `.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/` | Modify | 002 | One generated inventory, risk class and policy, retired ids |
| `.skilled/skills/*/command-metadata.json`, `.skilled/commands/doctor/_routes.yaml` | Modify, Create | 002 | Risk class and write target per command and route |
| `.skilled/skills/system-skill-advisor/runtime/lib/scorer/`, `advisor/handlers/` | Modify | 003 | Command attached to the owner skill, authored phrases, one row per command |
| `.skilled/skills/system-skill-advisor/runtime/lib/scorer/`, `lib/skill-graph/`, `scripts/command-bridges/`, `scripts/routing-accuracy/` | Modify | 004 | A vector per command, a meaning anchor in scoring and a capture that uses the real embedding |
| `.skilled/skills/system-skill-advisor/runtime/schemas/advisor-tool-schemas.ts`, `lib/render.ts` | Modify | 005 | New recommendation fields and the brief line |
| `AGENTS.md`, generated runtime pointer blocks | Modify | 006 | The Gate 2 sentence, the Gate 4 retirement and the static pointer |
| Per-runtime transcript checks | Create | 007 | Behaviour proof and the started-command-is-followed check |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-command-routing-baseline-corpus/ | Command prompt corpus and baseline, no scorer change (R8, L8, L9) | Complete |
| 2 | 002-command-inventory-and-risk-metadata/ | One generated inventory, risk class and derived policy, private command excluded (R1, R4, G4) | Complete |
| 3 | 003-plain-chat-command-reach/ | Attach commands to owner skills, authored phrases, one activation source (R2, L2, L3, R10 precedence) | Complete |
| 4 | 004-command-meaning-matching/ | A vector per command and a meaning anchor, so a paraphrase reaches its command (operator decision, 2026-11-12) | Complete |
| 5 | 005-recommendation-contract-and-brief/ | Recommendation fields, brief line, degraded path, retired ids (R3, L6, L12, G6, L1, L7) | Complete |
| 6 | 006-gate-2-binding-and-runtime-pointers/ | Gate 2 sentence, typed override, static pointer, child authority (R6, L5, R5, L4, G1, G3, L10) | Complete |
| 7 | 007-per-runtime-behaviour-proof/ | Transcript proof per runtime and the started-command-is-followed check (R8 transcripts, G2, G5). It closed on 2026-11-13 after the final behaviour arm, run on fresh arenas after the merge to main: AC-004, AC-005 and AC-007 are waived and AC-010 superseded by its decision record, and the Codex-only arm waits on the operator | Complete |
| 8 | 008-embedder-setup-and-cost/ | The embedder for external repositories: visible state, a plan-first doctor route, the measured memory and latency cost in the install guides and defined absent, cold and slow behaviour (operator requirement, 2026-11-12) | Complete |
| 9 | 009-ux-performance-cross-cli-research/ | Research only: further gains in user experience, performance and cross-CLI use after phases 005 to 008, 14 ranked recommendations each to be built in a new phase or declined with a reason (research/research.md section 9). Segment two is merged with 18 ranked items (research/research-segment-2.md) and segment three follows the merge to main | Complete |
| 10 | 010-reachability-and-attribution/ | Offer and brief delivery on every run line with a backfill of the before arm, an attributable scorer summary, the Codex and DSH install steps with read-only doctor checks and a measured cold first prompt (research ranks 1 to 6 and 10) | Complete |
| 11 | 011-typed-command-delivery-and-guards/ | Every typed tracked command reaches the model on the top recommendation with its command and policy, measured as 44 of 44 typed rows in the command capture, plus a command visibility guard in the mirror check, hook health in the advisor status and a head length test with a brief cost script (research ranks 9, 12 and 14 in part) | Complete |
| 12 | 012-plain-offer-reach/ | A plain request gets its command: the doctor hand-off names the command its ranker put first, task-shaped aliases on the `sk-doc` and deep-loop hubs, deep and create anchors and a `(needs a mode)` label for a deferring hub, measured as plain tune offers 9 to 23 of 45 in the command capture (segment two ranks 1, 4, 6, 7 and 12) | Complete |
| 13 | 013-attribution-and-install-reach/ | Brief delivery as a stored fact on five runtimes, offer accounting with loop-without-init in the safety floor and host-expanded typed starts counted, a Codex preflight and a restore to HEAD in the behaviour runner, a `CLAUDE.md` pointer on the default embed install, a delivery leg in `/doctor:setup` and an OpenCode brief that keeps the command fields (segment two ranks 2, 3, 5, 8 to 11 and 13) | Complete |
| 14 | 014-review-remediation/ | The fixes for review pass one: 43 confirmed items in 13 file-disjoint work groups, with the embed write safety, the attach-path guards, the renderer contract and the behaviour runner containment first, so a second review pass can run on the fixed code (review/review-report.md) | Complete |
| 15 | 015-health-default-and-brief-refinements/ | A prompt-free hook health record by default with a degraded flag and the newest record time, the `(needs a mode)` label only when the prompt names the hub, the top hub naming its routed command, no compiled-route line in the OpenCode brief, a brief-cost script that reads live heads only and three behaviour-arm counts (segment three ranks 1 to 5, 9 and 11) | Complete |
| 16 | 016-claude-create-reach-and-doctor-default/ | The rename of `/create:skill` to `/create:sk-skill` on every runtime with no alias so Claude Code lists all 44 commands, `/doctor:helper` on a doctor prompt that says a tool is not showing up, the `AGENTS.md` Gate 2 direct call on stdin, intent phrases for five commands measured on holdout as a count and a brief-cost run that leaves the shared health log alone (segment three ranks 7 and 13, review finding R4-P2-003, segment four ranks 1 and 2) | Complete |
| 17 | 017-review-pass-two-remediation/ | The fixes for review pass two: 27 confirmed P2 findings in ten file-disjoint work groups, each reproduced by a probe before planning, so a narrow third review pass can run on this phase's diff (review/review-report.md) | Complete |
| 18 | 018-holdout-row-retirement/ | Retire the sealed holdout row `suppressed-codex-abstain`, whose three-word prompt has been an authored cli-codex alias in the skill metadata and the compiled graph since before it was sealed, by deleting its line and recapturing the scorer eval baseline with the scoring date unchanged, after a count-only leak check of every sealed and command holdout row (operator decision, 2026-11-13, review pass two section 9) | Complete |
| 19 | 019-workflow-outcome-measure/ | Measure the core need: classify every recorded behaviour run as following the command's own workflow, following the owning skill's own workflow, improvising or doing nothing, and report per runtime the share of acting runs that followed a real workflow for the before arm and the final arm, scored from the stored sessions with no new model run and no target set (operator decision, 2026-11-13) | Complete |
| 20 | 020-command-offer-fit-guards/ | Keep the model's free choice where no command fits: a command the prompt only mentions, refuses or asks about is not offered, a no-edit request and a correction inside an existing document carry no writing command and a weak doctor cue needs the stronger bar, each reproduced by a probe that printed 26 command heads on 26 such prompts (alignment reviews of 2026-11-14, findings A-4, A-5, A-6, A-8, B-3 and B-9) | Complete |
| 21 | 021-brief-head-parity/ | One head for one request on every runtime: the handler gives the first row its command whatever the caller asked for, the OpenCode plugin leads with the row that passed, a companion command carries its policy word and is not printed twice, the OpenCode plugin asks for the top pick's route alone as every hook does so an ambiguous head's partner is the same too, measured as 17 of 17 equal heads between the Claude hook and the OpenCode plugin where the probe printed 13 (findings A-2, A-3, A-7 and B-9. For B-10 the row order reproduces, the rendered head already names the skill first and the rest is B-5) | Complete |
| 22 | 022-workflow-measure-soundness/ | Make the workflow measure count what a run did: a shell read and a prompt mirror are loads, a write outside the checkout sets no boundary, a wrong-mode load and an ask row that asked get their own values and a followed rate sits beside the load rate, which keeps every owned run in its denominator, with both stored arms rescored and every changed count explained (findings A-9, A-11, A-12, B-2, B-7 and B-8) | Complete |
| 23 | 023-untuned-outcome-evidence/ | State the outcome honestly from committed scripts: where the 44 sealed plain rows fall out, a count on 48 new sealed rows that should carry no command, a range on each workflow rate, a split by offer and paired counts between arms, with the behaviour arm on untuned rows, the target and the sealed reach left to the operator (findings B-1, B-4 and B-11) | Complete |
| 24 | 024-fable-review-remediation/ | The fixes for the Fable 5.2 review of 2026-11-14: the Codex session reader keeps the body of a custom tool call and the transcript scorer reads its shell commands, so a Codex run can show a load, the mention reader reads `no need to run` and `stop using` as refusals, keeps the command on `why not use` and on a later `run it` and ends a sentence at a question mark, a search and a heredoc line are no load, a `cd` inside one command is followed and a command on the partner side is not counted as offered, with both stored arms rescored and the Codex start rate restated. The relabel of three slash-variant rows waits on the operator and three carry items are declined on their probes (findings 1, 4, 5, 6 and 7, decision P024) | Pending |
| 25 | 025-release-notes-and-doc-sync/ | The open advisor changelog entry v1.1.0.0 gains phases 019 to 024 in three sections, and six reference pages state the current rule: the `command-attach.ts` row, two case counts, the top-only sentence, the meaning-pass bar and two companion lines, with every number read from the closed phases at build time and traced back (alignment finding C-01, the pages phases 020 and 021 left) | Pending |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/speckit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-command-routing-baseline-corpus | 002-command-inventory-and-risk-metadata | Corpus rows exist for all 44 tracked commands and a baseline records per-command recall, with the four existing numbers unchanged | The baseline file exists and the existing routing-accuracy run still reports 158/195, 50/66 and 20/24 |
| 002-command-inventory-and-risk-metadata | 003-plain-chat-command-reach | Every tracked command and doctor route has a risk class and a derived policy | The deriver's check mode is fresh and exits 1 on a fixture command with no metadata |
| 003-plain-chat-command-reach | 004-command-meaning-matching | Command recall rises against the phase 1 baseline with no drop in the four existing numbers | The phase 1 scorer run, and no typed command is ambiguous with its own owner |
| 004-command-meaning-matching | 005-recommendation-contract-and-brief | Holdout plain recall rises above 0 of 44 with false offers at 0 of 35 and typed recall at least 24 of 44, measured with the real embedding | The real-embedding capture and the full advisor suite |
| 005-recommendation-contract-and-brief | 006-gate-2-binding-and-runtime-pointers | The recommendation and the brief carry the command and its policy | Schema test and golden briefs pass, and `save context` returns one entry |
| 006-gate-2-binding-and-runtime-pointers | 007-per-runtime-behaviour-proof | The Gate 2 sentence and the generated pointer are in place | `/doctor:agents-md check` passes and the pointer generator's check exits 0 |
| 007-per-runtime-behaviour-proof | 008-embedder-setup-and-cost | Phase 005 is merged and the per-runtime proof is recorded, so this phase edits the final recommendation handler and bridge activation list | `rg -n "ownerSkillId" .skilled/skills/system-skill-advisor/runtime/schemas/advisor-tool-schemas.ts` prints a line and phase 007 validates under `validate.sh --strict` |
| 011-typed-command-delivery-and-guards | 012-plain-offer-reach | Phase 011 is committed, the command capture reads 44 of 44 typed rows and every pinned floor holds | `jq -c '.attachedMetrics.typed' .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-routing-baseline.json` prints `combined` 44 of 44 and phase 011 validates under `validate.sh --strict` |
| 012-plain-offer-reach | 013-attribution-and-install-reach | Phase 012 is committed, its renderer prints `(needs a mode)` and its diff touches none of the files phase 013 edits | The committed command baseline reads `attachedMetrics.plain.tune.combined` above 9 of 45 and phase 012 validates under `validate.sh --strict` |
| 013-attribution-and-install-reach | 014-review-remediation | Review pass one is merged and verified, with its findings grouped into file-disjoint work groups | `review/review-report.md` holds the Planning Packet and phase 014 validates under `validate.sh --strict` |
| 014-review-remediation | 015-health-default-and-brief-refinements | Phase 014 is committed and every pinned floor holds | The command capture prints typed recall 24 of 44 and false offers 0 of 35, and phase 014 validates under `validate.sh --strict` |
| 015-health-default-and-brief-refinements | 016-claude-create-reach-and-doctor-default | Phase 015 is committed, every pinned floor holds and the operator has answered the rename, doctor cue and changelog questions | `git log -1 --format=%h -- 015-health-default-and-brief-refinements` prints `3b48f0e5f1` or later and phase 016 validates under `validate.sh --strict` |
| 016-claude-create-reach-and-doctor-default | 017-review-pass-two-remediation | Phase 016 is committed, the mirror check prints `visibility claude 44/44` and every pinned floor holds | The command capture prints typed recall 24 of 44 and false offers 0 of 35, and phase 017 validates under `validate.sh --strict` |
| 017-review-pass-two-remediation | 018-holdout-row-retirement | Phase 017 is committed, every pinned floor holds and the operator has answered the leak-check stop rule (Q6 in the 018 spec) | The scorer eval ratchet reports 0 failed with `holdoutSha256` equal to the sealed file's hash, and phase 018 validates under `validate.sh --strict` |
| 018-holdout-row-retirement | 019-workflow-outcome-measure | Phase 018 is committed, every pinned floor holds on the tree merged with `origin/main` and the operator has chosen to build the measure now (question tool, 2026-11-13) | The transcript scorer tests report 0 failed, the two summary runs write a per-runtime share for the before arm and the final arm, and phase 019 validates under `validate.sh --strict` |
| 019-workflow-outcome-measure | 020-command-offer-fit-guards | Phase 019 is committed, so `git status` is clean on the advisor runtime's `lib` and `tests` folders, and every pinned floor holds | The command capture prints typed recall 24 of 44, false offers 0 of 35 and typed delivery 44 of 44, and phase 020 validates under `validate.sh --strict` |
| 020-command-offer-fit-guards | 021-brief-head-parity | None on each other. The two phases share no file. Phase 021 starts after phase 020 task T015 is recorded and committed, because both phases check the diff and the floors against their own start commit in one checkout. Each needs its own before file and a clean `git status` on its files | Phase 020's offer probe prints 8 command heads where it printed 26, phase 021's head probe prints `same head: true` 17 times, and both validate under `validate.sh --strict` |
| 021-brief-head-parity | 022-workflow-measure-soundness | Phases 019 and 021 are Complete and committed, because phase 022 edits the scorer phase 019 built and states a head rule phase 021 makes true | Phase 022 task T001 prints 1 for both status checks and nothing for `git status` on its five files |
| 022-workflow-measure-soundness | 023-untuned-outcome-evidence | Phases 020, 021 and 022 are Complete and committed, both stored arms are rescored and the stored sessions are still on disk | `scratch/workflow-delta.txt` in phase 022 holds 11 runtime and arm lines, the count identity prints `true` for both after files, and phase 023 validates under `validate.sh --strict` |
| 023-untuned-outcome-evidence | 024-fable-review-remediation | Two gates. Lanes A and R of phase 024 share no file with phases 022 and 023 and start once phases 020 and 021 are committed. Lane S edits the transcript scorer and starts only after phases 022 and 023 are Complete and committed | Phase 024 task T001 prints 1 for both status checks and nothing for `git status` on its five files, task T003 does the same for phases 022 and 023 and the scorer files, and phase 024 validates under `validate.sh --strict` |
| 024-fable-review-remediation | 025-release-notes-and-doc-sync | Phases 019 to 024 are Complete and committed and `origin/main` still ships advisor version 1.0.0.0, so the changelog entry v1.1.0.0 is open and every sentence has a closing document behind it | Phase 025 task T001 prints 1 for each of the six status checks and 1 for the version check, and phase 025 validates under `validate.sh --strict` |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- Phase 7 needs runs on runtimes the research never exercised live (Pi, Cursor, Devin, DSH, Codex, OpenCode). Which of them the operator wants proven is decided when phase 7 is planned.
- The review's G2 check, that a started command actually runs its own setup, is a condition of decision D1. If phase 7 shows setup being skipped, D1 returns to the operator.
- The measure of the core need, how often a model followed a real workflow against improvising, is built in phase 019 and corrected in phase 022. It is a proxy: it counts a load of the command's or the owning skill's own workflow before the first write. The load rate over every owned run, before and final arm (source `019-workflow-outcome-measure/scratch/`): claude 4 of 16 to 6 of 16, codex 0 of 16 to not run, pi 3 of 16 to 5 of 16, devin 12 of 16 to 15 of 16, opencode 9 of 16 to 7 of 16, dsh 10 of 16 to 12 of 15. The share of runs that loaded or wrote: claude 4 of 4 to 6 of 6, codex 0 of 0, pi 3 of 7 to 5 of 6, devin 12 of 12 to 15 of 15, opencode 9 of 11 to 7 of 10, dsh 10 of 12 to 12 of 14. It counts 16 tuned rows with one run each, so it is not yet evidence of the outcome, and the operator sets any target. Phase 023 adds the range, the paired counts and the numbers on sealed rows.
- On requests nobody tuned for, the brief carries the right command on 5 of 44 sealed plain rows against 33 of 45 tuned rows (real embedding, 2026-11-14). Whether raising that belongs in this packet or a follow-up is the operator's decision. The recommendation is a follow-up, after phase 023 prints where the rows fall out.
- Whether the brief causes more correct workflows needs a new behaviour arm: fresh rows, three runs each, the brief on and off at one commit. The operator ruled out more arms on 2026-11-13, so the arm waits on the operator and no phase builds it.
- No target exists for the followed rate, the sealed reach or the sealed fit. The operator sets each or waives it. The options and a recommendation are in the phase 023 spec.
- Two review findings change operator-approved wording and wait on the operator: the head wording that names the command as an option, and an `AGENTS.md` prefix on the Gate 2 policy sentences.
- The goal checker still reports no binding row for phases 009 to 019, which have no `goal.md`. Eleven more rows do not fit the goal's 4,000 character slice. Retrofitting or accepting it is the operator's decision.
- The goal criteria were amended on 2026-11-14 without the operator, first by the planner and then by the coordinator after the plan verification (decision record P003 and P013). The operator set those criteria, so the amendment waits for the operator to confirm or overturn.
- Whether a run executed its workflow's own steps, not only opened it, is not measured. A step-level check on a sample of stored runs waits on the operator with options and a recommendation in the goal log (P018).
- Rows sv-09, sv-11 and sv-12 of the command corpus name a command inside a question and still carry `expected_command`, so the committed baseline records three designed withholds as misses. A relabel to no command moves them into the false-offer tally, and the floor in completion criterion 2 would read 0 of 38 where it says 0 of 35. The relabel waits on the operator. The options and a recommendation are in the phase 024 spec (P026).
- The amended root release note covers phases 014 to 018. Whether it also gains phases 019 to 024 waits on the operator, with options and a recommendation in the phase 025 spec (P030).
- Phases 024 and 025 each have a `goal.md` and no binding row in the parent goal, because the durable slice stands at 3,992 of 4,000 characters and two rows need about 98. The goal checker adds them to its finding for phases 009 to 019 (P031).
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Parent Spec**: See `../spec.md`
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
