---
title: "Goal: Phase 12: sk-vision-v2-prompt-hook"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "sk vision v2 prompt hook goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/082-opencode-v1-v2-dual-compat/012-sk-vision-v2-prompt-hook"
    last_updated_at: "2026-10-19T11:29:13Z"
    last_updated_by: "orchestrator"
    recent_action: "Ported the automatic image check and proved it live on 2.0.32"
    next_safe_action: "Phase complete. Pushing waits for the operator"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-012-sk-vision-v2-prompt-hook"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 12: sk-vision-v2-prompt-hook

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** With `SK_VISION_AUTOINSPECT=1`, OpenCode 2.0.32 attaches sk-vision evidence to a prompt that carries an image, through `session.hook("prompt")`, while OpenCode 1 keeps its `chat.message` behaviour.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The OpenCode 2 hook and session shapes come from the published 2.0.32 packages, never from memory |
| D2 | One evidence builder, `AttachmentInjector.evidenceText`, serves both hosts |
| D3 | The new path stays behind `SK_VISION_AUTOINSPECT=1`, the same opt-in as OpenCode 1 |
| D4 | The live proof uses a private `opencode2 serve` with its own port, database and data folder; the shared service is never touched |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] A private OpenCode 2.0.32 run with the flag on stores an `<SK-VISION` block, and with it off stores none
- [x] `bun test` in `vision-runtime` passes 50 with 0 failures, and the plugin suite holds 356
- [x] The doctor battery exits 0 on `--family=v1` and `--family=v2`
- [x] `validate.sh` on the parent packet with `--recursive --strict` prints `RESULT: PASSED`
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
| Types read | Done | `@opencode/plugin` 2.0.32 `promise/session.d.ts` `SessionPrompt`, `@opencode/schema` `prompt-input.d.ts` |
| Code and tests | Done | DeepSeek through cli-pi, four briefs (`scratch/briefs/`) |
| Live run | Done | `scratch/proof/`: off without evidence, on with Scene, Caption, OCR and Atlas |
| Review | Done | Luna round 1 PASS with three P2s, two fixed (`scratch/luna-1.txt`, `scratch/luna-2.txt`) |

### Deviations and findings

| Item | Note |
|------|------|
| Level 2 over the recommended Level 1 | `recommend-level.sh` scored Level 1. The phase keeps Level 2 to match its siblings and to carry `acceptance-criteria.md` |
| `RuntimeClient.close()` during startup | Luna's third P2. The client is unchanged here and OpenCode 1 disposal behaves the same, so it is recorded, not fixed |
| Parent's own plugin on v2 | The worktree sits inside the main checkout, so OpenCode 2 also loads the main checkout's `.opencode/plugins/sk-vision.js`, which reports `failed` until main has the dual export. The worktree's copy is `active` |
<!-- /ANCHOR:log -->
