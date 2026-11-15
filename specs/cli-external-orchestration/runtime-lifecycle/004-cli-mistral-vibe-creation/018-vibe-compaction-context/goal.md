---
title: "Goal: Phase 18: vibe-compaction-context"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "vibe compaction context goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/018-vibe-compaction-context"
    last_updated_at: "2026-11-14T23:30:00Z"
    last_updated_by: "deepseek-v4-1-flash-1017"
    recent_action: "Built the detector, binding and Vibe history row; proved the forced compaction"
    next_safe_action: "Phase 019 builds the relaunch tier on the handoff pointer this phase re-injects"
    blockers: []
    key_files:
      - ".skilled/hooks/session-lifecycle/vibe/compaction-context.mjs"
      - ".skilled/hooks/session-lifecycle/vibe/compaction-post-tool.mjs"
      - ".skilled/skills/system-spec-kit/runtime/hooks/claude/hook-state.ts"
      - ".skilled/hooks/shared/session-readers/index.mjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "mistral-support-2026-11-14"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The compaction is a completed checkpoint-compaction projection entry"
      - "A post_tool additional_context reaches the model at the next tool call after a mid-turn compaction"
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 18: vibe-compaction-context

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Give a Vibe session its goal slice, history lookup offer and handoff pointer back once after every compaction.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The compaction is read from the session journal against a per-session watermark, because Vibe has no compaction hook |
| D2 | One injection per compaction id, at the next turn start or, when the journal grew, the next tool call |
| D3 | The detector fails open: any error yields no injection and exit 0 |
| D4 | Vibe joins the history lookup through the reader row phase 014 adds as `gated`, which this phase promotes to `ready`, and the locator kinds; the row stays `gated` with a reason when the reader does not conform |
| D5 | No default model changes. DevPass stays the default |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `node --test .skilled/hooks/session-lifecycle/vibe/compaction-context.test.mjs` prints `fail 0`
- [ ] The history lookup suites print `failed 0`
- [ ] A forced-compaction run's journal shows the Objective line re-injected after the compaction entry
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Baseline | Done | `HISTORY_LOCATOR_KINDS` holds six runtimes and no `vibe`, and no Vibe session reader exists (`spec.md` Measured Behavior) |
| Build | Done | Detector, turn-start part, `post_tool` binding, Vibe history row and CLI branch landed; nine fixture cases and the history lookup suites pass |
| Forced compaction | Done | One automatic compaction at sequence 14, the next `post_tool_call` result carries `**Objective:**`, and `watermark.json` names the compaction id (`scratch/forced-compaction/excerpt.md`) |

### Deviations and findings

| Item | Note |
|------|------|
| Classification reversed in part | `guards-and-hooks.md` section 4 marks the history lookup not portable because there is no compaction event. The journal records each compaction (`protocol.py:1419-1427`), so a detector can recover it at the next turn or tool call. Phase 021 corrects the doc once the forced-compaction run shows it |
| Answered: entry shape | The compaction is a completed `checkpoint-compaction-<id>` projection entry; `compactionsSince` dedupes the in-progress append against the completed replace |
| Answered: timing | A `post_tool` `additional_context` is recorded on the tool result, so a mid-turn compaction is caught at the next tool call; the forced run shows it |
| Deviation: CLI store root | The spec's Files to Change table did not list `hooks/lib/history/cli.ts`, but a `transcript_path` runtime needs a store root the CLI can resolve. The CLI gained a Vibe branch (`$VIBE_HOME/logs/session/unified/<session_id>`) and the `vibe` runtime label, without which the Vibe read case cannot pass |
| Finding: repeated compactions | A 13 KB prompt with tool calls can compact more than once; the first attempt compacted seven times. The recorded run puts the instruction first and compacts once |
<!-- /ANCHOR:log -->
