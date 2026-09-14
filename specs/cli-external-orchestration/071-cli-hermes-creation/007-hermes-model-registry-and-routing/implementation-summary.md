---
title: "Implementation Summary"
description: "The Hermes roster is enforced where a dispatch is built and known where prompt work is routed: the runner refuses an off-roster id in milliseconds, the prompt-improver eligibility tables and the persona-attach table carry a cli-hermes row, the prompt-card drift guard covers the packet, and every --reasoning level answered live."
trigger_phrases:
  - "implementation summary"
  - "what shipped"
  - "validation evidence"
  - "continuation notes"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/071-cli-hermes-creation/007-hermes-model-registry-and-routing"
    last_updated_at: "2026-09-14T21:40:00Z"
    last_updated_by: "claude-fable-5-1"
    recent_action: "Roster enforcement proven, registry rows landed, guard extended, levels checked live"
    next_safe_action: "Phase 008 playbook and catalog"
    blockers: []
    key_files:
      - ".opencode/skills/system-skill-advisor/runtime/scripts/check-prompt-quality-card-sync.sh"
      - ".opencode/agents/prompt-improver.md"
      - ".opencode/skills/sk-prompt/assets/cli-prompt-quality-card.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-071-007-hermes-model-registry-and-routing"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The gateway accepts every Hermes --reasoning level for both roster models; no effort map is needed"
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 007-hermes-model-registry-and-routing |
| **Completed** | 2026-09-14 |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A wrong Hermes model id now dies in twelve milliseconds instead of a ten-minute timeout, and the prompt-knowledge layer knows the mode exists.

### Phase 7: model registry and routing

The roster itself landed in phase 003; this phase exercised it and registered it. The fan-out runner was given a provider-prefixed id and rejected it before building a command. The prompt-improver eligibility table, which decides whether a (model, route) pair may do prompt-improve work, gained a `cli-hermes` row in each of its copies, and the canonical persona-attach table records that Hermes takes its persona inline. The prompt-card drift guard now walks seven executors. Four `--reasoning` levels were sent through the gateway on both roster models and every one answered.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-skill-advisor/runtime/scripts/check-prompt-quality-card-sync.sh` | Modified | `cli-hermes` in both check lists |
| `.opencode/agents/prompt-improver.md` | Modified | eligibility row |
| `.claude/agents/prompt-improver.md` | Modified | eligibility row (Cursor and Devin copies are symlinks to it) |
| `.pi/agents/prompt-improver.md` | Modified | eligibility row |
| `.codex/agents/prompt-improver.toml` | Modified | eligibility row |
| `.opencode/skills/sk-prompt/SKILL.md` | Modified | eligibility row |
| `.opencode/skills/sk-prompt/assets/cli-prompt-quality-card.md` | Modified | persona-attach row |
| `.opencode/skills/cli-external-orchestration/cli-hermes/references/providers-and-models.md` | Modified | observed standing and level results |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Baseline first: the guard passed on six executors, and a grep found every copy of the eligibility table. The live checks ran as four parallel `hermes chat` smokes under the operator-authorized provider, then the runner was pointed at a scratch folder inside the packet with a deliberately wrong id.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| No Hermes effort map | The gateway accepted `none`, `low`, `max` and `ultra`; the runtime already pins both roster models to `max`, so a map would encode nothing |
| One row per copy, no new file | The eligibility contract's canonical home is the prompt-improver agent; a separate profile file would be a second home |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `fanout-run.cjs` with `llmgateway/deepseek-v4.1-flash` | `status: rejected` in 12 ms, message names the allowlist, runner exit 3, no process spawned (`scratch/offroster/runner.log`) |
| `check-prompt-quality-card-sync.sh .` | `GUARD PASS`; `cli-hermes` PASS on the card and on `SKILL.md` |
| `grep -c cli-hermes` per eligibility copy | 1 in each of the five real files |
| `glm-5.3-flash --reasoning max` and `--reasoning none` | exit 0, `OK`, 17 s each |
| `deepseek-v4.1-flash --reasoning low` and `--reasoning ultra` | exit 0, `OK`, 21 s and 24 s |
| Rostered dispatch through the runner | The phase 003 live lineage started with the built command (`--model deepseek-v4.1-flash --reasoning max`) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **`medium`, `high`, `xhigh` and `minimal` were not sent.** The four levels checked bracket the set; the runtime never emits anything but `max` for these models.
2. **The gateway may accept a level it ignores.** Exit 0 shows acceptance, not that the level changed the model's behavior.
<!-- /ANCHOR:limitations -->

---
