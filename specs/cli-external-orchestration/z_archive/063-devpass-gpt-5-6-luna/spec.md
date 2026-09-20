---
title: "Feature Specification: GPT-5.6 Luna on the DevPass roster, and the DevPass catalog cli-opencode was still missing"
description: "Adds GPT-5.6 Luna as a fifth DevPass model on both CLI rosters. cli-pi already had a DevPass provider block so Luna joins it; cli-opencode had no DevPass catalog section at all, so this creates one with all five models, each dispatch-tested on both CLIs."
trigger_phrases:
  - "gpt-5.6 luna devpass"
  - "llmgateway luna roster"
  - "devpass cli-opencode catalog"
  - "luna through llm gateway"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/063-devpass-gpt-5-6-luna"
    last_updated_at: "2026-09-04T00:00:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Added Luna and created the cli-opencode DevPass catalog; 10 dispatches verified"
    next_safe_action: "None - work is complete and verified"
    blockers: []
    key_files:
      - ".pi/models.json"
      - ".opencode/skills/cli-external-orchestration/cli-opencode/references/providers-and-models.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "impl-063-luna-devpass"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Feature Specification: GPT-5.6 Luna on the DevPass roster, and the DevPass catalog cli-opencode was still missing

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-09-04 |
| **Branch** | `skilled/v4.0.0.0` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The operator asked for GPT-5.6 Luna on the DevPass route, then for both CLI rosters to carry it. Those are two different sizes of job, because the two CLIs were not in the same state.

cli-pi had a working `llmgateway` provider block, so Luna was a fifth model in an existing structure. **cli-opencode had no DevPass section at all** — that work was specified in packet `060` and never built, so its catalog still said nothing about a provider the operator has been paying for and that opencode itself is already authenticated against. Adding "Luna to the cli-opencode roster" was impossible without first creating the roster it would join.

A second gap: Luna is reachable through two different routes. The `openai` provider already carries `openai/gpt-5.6-luna`, and this adds `llmgateway/gpt-5.6-luna` — the same model family, a different route, and different billing. A catalog that lists both without saying so invites picking one by accident.

### Purpose
Put the same five DevPass models in front of both CLIs, with every id, ladder and limit proven by a real dispatch on the CLI that documents it.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `llmgateway/gpt-5.6-luna` in `.pi/models.json` and `.pi/settings.json`, with its own `thinkingLevelMap`.
- A new `### llmgateway` section in the cli-opencode catalog carrying **all five** models — delivering packet `060`'s WS1 ahead of the rest of that packet.
- A `llmgateway` row in the cli-opencode `--variant` mapping table, stating that effort is per-model here rather than per-provider.
- The Luna row in the cli-pi roster and `.pi/custom-providers.md`, and the four→five counts around them.
- The cli-opencode `SKILL.md` provider prose.

### Out of Scope
- **`gpt-5.6-sol` and `gpt-5.6-terra`**, both live on the gateway. Only Luna was asked for.
- **The rest of packet `060`** — the Gemini 3.7→3.8 sweep, the DeepSeek V4 Pro retirement, the vision rollout to other providers. Only WS1's catalog section is delivered here.
- **The deep-loop fan-out roster.** Unchanged; the DevPass entries stay direct-dispatch only.
- **Defaults.** `defaultProvider`, `defaultModel` and the cli-opencode default model are untouched.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.pi/models.json` | Modify | `gpt-5.6-luna` model object |
| `.pi/settings.json` | Modify | Fifth `enabledModels` entry |
| `.pi/custom-providers.md` | Modify | Luna row, temperature caveat, four→five counts |
| `cli-pi/references/providers-and-models.md` | Modify | Luna row; counts; the literal-collision note extended |
| `cli-opencode/references/providers-and-models.md` | Modify | **New** `llmgateway` section, five rows; `--variant` table row |
| `cli-opencode/SKILL.md` | Modify | Provider prose names the DevPass routes and the bare-id rule |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria | Status |
|----|-------------|---------------------|--------|
| REQ-001 | Luna dispatches on both CLIs | `LUNA-PI-OK` through pi at `--thinking max`; `LUNA-OC-OK` through opencode at `--variant max` | Met |
| REQ-002 | The wire id is bare, like its siblings | `"model":"gpt-5.6-luna"` returns 200, upstream `azure/gpt-5.6-luna` | Met |
| REQ-003 | cli-opencode has a DevPass catalog section | Five rows present with the bare-id rule, the Standard-tier note and the closed-roster bound | Met |
| REQ-004 | Every cli-opencode row is dispatch-tested, not list-verified | Four `opencode run` markers plus Luna's | Met |
| REQ-005 | Luna's two routes are distinguishable | Both catalogs state the `openai` and `llmgateway` routes are the same family with different billing | Met |
| REQ-006 | Luna's constraints are recorded | `temperature` unsupported; input cap 922K below the 1.05M context | Met |
| REQ-007 | pi config stays valid and operator-formatted | `JSON.parse` clean; no trailing newline on `models.json` | Met |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The same five DevPass models appear on both CLI rosters, in each CLI's own id form.
- **SC-002**: A reader picking Luna can tell the two routes apart before dispatching.
- **SC-003**: No row claims a verification stronger than what was run.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Luna's two routes confused | Wrong billing, or a slug that does not exist on the chosen provider | Both catalogs name the distinction on the Luna row itself |
| Risk | A caller passes `temperature` | The entry declares no temperature support | Stated on the row and in the pi operator doc |
| Risk | Delivering 060's WS1 here leaves 060 stale | Two packets claiming the same work | 060 amended in the same change to record WS1 as delivered |
| Risk | The cli-opencode section is copied from the Cline one | Prefixed ids, every dispatch 400s | The bare-id rule is stated as an explicit inversion, with the error string |
| Dependency | DevPass subscription | No dispatch | Green — ten live turns on 2026-09-04 |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- **Should `gpt-5.6-sol` join too?** Not asked for, not added. It is live on the gateway and would be a one-row change on each side if wanted.
- **Is the vision capability real on the two vision entries?** Still declared-not-demonstrated. Luna and the DeepSeek Vision variant both report `attachment: true`, and neither has had an image through it.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Implementation Summary**: See `implementation-summary.md`
- **Builds on**: `062-devpass-pi-custom-provider` (the pi provider block), `060-devpass-roster-vision-gemini-3-8` (WS1 delivered here), `049-cline-provider-roster` (the config-provider pattern)
<!-- /ANCHOR:related-docs -->
