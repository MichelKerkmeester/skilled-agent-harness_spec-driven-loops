---
title: "Implementation Summary"
description: "The cli-claude-code roster now names the live Claude 5.5 models, defaults to Sonnet 5.5, and documents all five effort levels; nothing in the repo limited effort."
trigger_phrases:
  - "claude 5 5 roster and effort levels implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/081-claude-5-5-roster-and-effort-levels"
    last_updated_at: "2026-10-07T19:05:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Refreshed the cli-claude-code roster and effort guidance, regenerated the Hermes copy"
    next_safe_action: "Commit, then refresh the track root's children_ids"
    blockers: []
    key_files:
      - ".skilled/skills/cli-external-orchestration/cli-claude-code/references/providers-and-models.md"
      - ".skilled/skills/cli-external-orchestration/cli-claude-code/SKILL.md"
      - ".hermes/skills/cli-claude-code/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-5-5-roster-and-effort-levels"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Keep or drop the claude-fable-5-5 modelSettings entry while that id does not exist"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 081-claude-5-5-roster-and-effort-levels |
| **Completed** | 2026-10-07 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

An agent in another terminal that shells out to `claude` now gets a roster that matches the installed CLI: Sonnet 5.5 by default, Opus 5.5 and Haiku 5.5 by name, Fable 5.1 as the live Fable, and all five effort levels with guidance on when to use each.

### Claude 5.5 roster and effort levels for cli-claude-code and Claude Code settings

Three Claude 5.5 ids answered a live probe. `claude-fable-5-5` did not: Claude Code 2.1.293 rejects it as `unrecognized_model`, and its `fable` alias resolves to `claude-fable-5-1`. The roster says so and names the command that rechecks it after a CLI update.

Nothing in the repo blocked an effort level, so no setting changed. `.claude/settings.json` has no `availableModels` or `model` key. Its `modelSettings` entries set each model's default effort and remove none. The one model guard, `fable-subagent-guard.mjs`, limits which model a subagent may run on while Fable drives the main session (Opus or Sonnet only). It never reads effort.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/cli-external-orchestration/cli-claude-code/references/providers-and-models.md` | Modified | Roster with roles, Fable 5.5 note, replaced-id note, default rationale, five-effort table |
| `.skilled/skills/cli-external-orchestration/cli-claude-code/SKILL.md` | Modified | Default `claude-sonnet-5-5`, named-effort override row, model selection paragraph, rule 5 |
| `.skilled/skills/cli-external-orchestration/cli-claude-code/README.md` | Modified | Default dispatch, roster sentence, FAQ answer |
| `.skilled/skills/cli-external-orchestration/cli-claude-code/references/cli-reference.md` | Modified | Five-level effort table, Claude 5.5 models table, examples |
| `.skilled/skills/cli-external-orchestration/cli-claude-code/references/integration-patterns.md` | Modified | Tier matrix, Haiku examples, max-depth guidance |
| `.skilled/skills/cli-external-orchestration/cli-claude-code/references/agent-delegation.md` | Modified | Haiku 5.5 for the fast scan row |
| `.skilled/skills/cli-external-orchestration/cli-claude-code/assets/prompt-quality-card.md` | Modified | Model defaults table, Fable and named-effort rows |
| `.skilled/skills/cli-external-orchestration/cli-claude-code/assets/prompt-templates.md` | Modified | Flag table and examples |
| `.skilled/skills/cli-external-orchestration/cli-claude-code/manual-testing-playbook/` (index, `default-model-selection-sonnet.md`, `sonnet-balanced-default.md`, `haiku-fast-classification.md`, `opus-extended-thinking.md`, `multi-ai-council-multi-strategy-planning.md`) | Modified | Current ids in scenario commands; CC-008's index entry now dispatches Opus, not Sonnet |
| `.hermes/skills/cli-claude-code/SKILL.md` | Regenerated | Rendered by `sync-skills-hermes.cjs` |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Each id got one call from a scratch directory, so the repo's session hooks did not run in the child: `SYSTEM_SPEC_GATE_ENFORCE=0 AI_SESSION_CHILD=1 claude -p --model <id> --effort low "Reply with OK" </dev/null`. `claude-opus-5-5`, `claude-sonnet-5-5` and `claude-haiku-5-5` each printed `OK` with exit 0. `claude-fable-5-5` printed `[claude-code:unrecognized_model]` with exit 1. One more call with `--model fable --output-format json` returned `OK`, and its `modelUsage` named `claude-fable-5-1`.

The effort claim comes from the CLI itself. `claude --help` lists `--effort` with `low, medium, high, xhigh, max`, and the model catalog inside the 2.1.293 binary gives `claude-opus-5-5`, `claude-sonnet-5-5`, `claude-haiku-5-5` and `claude-fable-5-1` the `effort`, `xhigh_effort` and `max_effort` capabilities. The probes ran at `low` only, so the other four levels were not exercised live.

The Hermes copy was rendered with the generator's exported `buildExpected()` and only the cli-claude-code entry was written. Running the full sync would also have rewritten three skills that already drifted before this change.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Default model is `claude-sonnet-5-5` | It answered the probe, the `sonnet` alias resolves to it, and it keeps the default in the balanced family the mode used before, so a caller naming no model gets the same cost and depth profile on the current generation |
| List `claude-fable-5-1` as the Fable entry | Fable 5.5 is not a valid id on the installed CLI, and `fable` resolves to 5.1, which answered |
| Drop `claude-sonnet-4-6`, `claude-sonnet-5` and `claude-haiku-4-5-20251001` from the roster | They were not probed, so their reachability is unknown. One note in `providers-and-models.md` names them and their replacements |
| Leave every settings key unchanged | No setting or hook blocks an effort level. The operator's `claude-haiku-5-5` entry is now confirmed as a real id |
| Keep the Opus override at `--effort high`, with `xhigh` and `max` as named escalations | It matches the repo's own Opus default and the existing playbook scenarios |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Native-dispatch and handback doc tests (vitest) | PASS: 2 passed, 1 skipped, same as baseline |
| Fan-out fallback family drift test | PASS: 2 passed, same as baseline |
| Dispatch hard-rule tests (`node --test`) | PASS: 20 of 20, same as baseline |
| `check-prompt-quality-card-sync.sh` | PASS for the cli-claude-code card and `SKILL.md` |
| `sync-runtime-mirrors.cjs --check` | PASS: 187 mirrors across 8 trees in sync |
| `sync-skills-hermes.cjs --check` | cli-claude-code no longer drifts. Exit 1 from three drifts (deep-research, deep-review, system-spec-kit) that were there before this change |
| `validate_document.py` on 14 edited docs | 0 issues each, before and after |
| `.claude/settings.json` parses | PASS |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Fable 5.5 is not reachable.** The roster carries Fable 5.1 until the CLI accepts `claude-fable-5-5`. `providers-and-models.md` names the recheck command.
2. **Only `low` effort was exercised live.** The other four levels come from `claude --help` and the CLI's model catalog.
3. **The track root does not list this packet yet.** `create.sh` added it to `specs/cli-external-orchestration/graph-metadata.json`, and that edit was reverted to stay inside this packet. Run `refresh-track-roots.mjs --track cli-external-orchestration --apply` when committing.
4. **`claude-fable-5-5` under `modelSettings` does nothing today.** It was left in place as an operator setting.
<!-- /ANCHOR:limitations -->

---
