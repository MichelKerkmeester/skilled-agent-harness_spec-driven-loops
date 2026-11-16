---
title: "Goal: Phase 10: fix-barter-repin-handover-items-for-overlay-engine"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "fix barter repin handover items for overlay engine goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-skilled-doctor/001-skill-and-overlay-build/010-fix-barter-repin-handover-items-for-overlay-engine"
    last_updated_at: "2026-11-16T07:11:41Z"
    last_updated_by: "claude-code"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "010-fix-barter-repin-handover-items-goal"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 10: fix-barter-repin-handover-items-for-overlay-engine

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE
<!-- FILL: Write one sentence: what the packet is for, not how. GOOD: Keep only the newest n archives on request. WEAK: Improve the script. -->

**Objective:** Close the six items Barter reported after its re-pin to `d0fc9d719b`, so a project that vendors Skilled re-pins across them without a workaround script.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Record and plan first. The operator started the build on 2026-11-16 with the instruction to implement through DeepSeek v4.1 flash at max thinking on the Mistral Vibe CLI. |
| D2 | Barter's tree at `barter/ai-speckit` is read-only. Work Barter must do is written to `handover-to-barter.md` in this packet. |
| D3 | Each engine change starts with a test that fails first, and is paired with a test that the nearest person-edit case still refuses. |
| D4 | A folder overlay records its rebase as one `rebasedOnto` commit per entry, not a hash per file. A folder replaced by a link stays out of scope. Removing a surface from `vocabularyMirrors` is the supported form for a host. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA
<!-- FILL: Write one command-checkable criterion per line. GOOD: `--keep 3` leaves 3 archives in `logs/archive` and exits 0. WEAK: The work is done. -->

- [x] `node --test .skilled/commands/doctor/scripts/tests/` prints `fail 0` with the new tests in the count.
- [x] Each of the five checks in `handover-from-barter.md` section 4 maps to a passing test or a documented step.
- [x] `rg -n 'session-handover/history' INSTALL-SKILLED.md` prints at least one line.
- [x] `handover-to-barter.md` exists in this folder.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG
<!-- FILL: Record each step with its command output. Keep this table current. GOOD: T001 Done. `ls logs/archive | wc -l` printed 3. WEAK: Progress is good. -->

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Handover copied in | Done | `cmp` against Barter's `023-repin-d0fc9d719b/handover.md` printed nothing, exit 0 |
| Handover numbers checked against Barter's logs | Done | stage1 19 refuse, stage2 1 refuse, stage3 29 blocked and `RESULT: STAGED`, live 29 blocked and `RESULT: FAILED` |
| Spec, plan and tasks | Done | This folder |
| Test baseline | Done | `node --test` on the engine test folder: `pass 1170`, `fail 0` |
| Seven briefs through Vibe on DeepSeek v4.1 flash | Done | Each `scratch/vibe-runs/<number>/export.json` records `exit_code` 0 and `outcome` `finished` |
| Final gate | Done | Engine test folder `pass 1175`, `fail 0`. `sk-code-setup-check.cjs` ended `STATUS=OK legs=9` |
| Handover to Barter | Done | `handover-to-barter.md` |

### Deviations and findings

| Item | Note |
|------|------|
| Handover item 4 needed no engine change | A regenerate step's `outputs` list already marks its files as managed in `managedPathTest`, an existing test asserts it, and Barter's `sk-code-graph-metadata` step lists none. |
| The stage already exited 1 when blocked | Only the result word changed, from `STAGED` to `BLOCKED`. One existing test asserted the old word on purpose and was changed with it. |
| Barter's second handover arrived mid-build | Items 7 to 10 are copied as `handover-from-barter-024.md` and not built. Where they belong is the operator's decision. |
| The briefs carried the full `code` or `markdown` persona | The Vibe contract requires the persona inline. Each run still finished in a few minutes. |
| What `vocabularyMirrors` means for a host | Decided: removal is the supported form. Recorded in `spec.md` section 7. |
<!-- /ANCHOR:log -->
