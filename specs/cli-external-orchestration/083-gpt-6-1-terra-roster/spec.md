---
title: "Feature Specification: Add GPT-6.1 Terra to cli-codex, cli-opencode and cli-pi through the openai provider"
description: "The Codex catalog ships GPT-6.1 Terra, but cli-codex, cli-opencode and cli-pi do not list it, and the Pi fan-out refuses it. This packet adds it on the openai provider in all three."
trigger_phrases:
  - "gpt 6 1 terra roster"
  - "add gpt 6 1 terra to cli codex"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Add GPT-6.1 Terra to cli-codex, cli-opencode and cli-pi through the openai provider

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-10-27 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The Codex model catalog lists `gpt-6.1-terra` (GPT-6.1 Terra), the newest Terra model, but none of the three openai-capable CLI skills names it. cli-opencode and cli-pi had retired Terra entirely, and the deep-loop fan-out refuses `gpt-6.1-terra` for cli-pi because its allowlist does not hold it.

### Purpose
An operator can ask cli-codex, cli-opencode or cli-pi for GPT-6.1 Terra by name on the `openai` provider, and a deep-loop lineage can pin it for cli-pi.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ python3 (read ~/.codex/models_cache.json)
{'slug': 'gpt-6.1-terra', 'display_name': 'GPT-6.1 Terra', 'description': 'GPT-6.1 Terra Codex model.', ... efforts low..ultra}

$ codex exec --skip-git-repo-check -m gpt-6.1-terra -c model_reasoning_effort="low" -c service_tier="fast" "Reply with exactly: OK" </dev/null
model: gpt-6.1-terra
OK            (exit 0)

$ opencode1 models openai | grep terra            (before refresh)
openai/gpt-5.6-terra
openai/gpt-5.6-terra-fast
$ opencode1 models openai --refresh | grep terra
openai/gpt-5.6-terra
openai/gpt-5.6-terra-fast
openai/gpt-6.1-terra
openai/gpt-6.1-terra-fast
$ opencode1 run -m openai/gpt-6.1-terra "Reply with exactly: OK" </dev/null
> build · gpt-6.1-terra
OK            (exit 0)

$ pi -p --offline --model openai/gpt-6.1-terra --thinking low "Reply with exactly: OK" </dev/null
Warning: Model "gpt-6.1-terra" not found for provider "openai". Using custom model id.
OK            (exit 0)

fan-out test before the allowlist change:
Error: cli-pi model 'gpt-6.1-terra' is not in the enforced allowlist
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add `gpt-6.1-terra` to the cli-codex roster, effort-ceiling tables, phrase map, README, prompt templates and roster smoke scenario.
- Add `openai/gpt-6.1-terra` and `openai/gpt-6.1-terra-fast` to the cli-opencode GPT grid and `--model` override example.
- Add `gpt-6.1-terra` to the cli-pi `openai` roster and effort map, to `PI_SUPPORTED_MODELS`, `PI_ALLOWED_MODELS` and `PI_MODEL_PROVIDERS`, and to `.pi/settings.json` `enabledModels`.
- Bump each skill one patch version with one changelog entry, and regenerate the three Hermes skill mirrors.
- Refresh Pi's model catalog so `pi --list-models` carries the model, and update the CLIs and Pi extensions to their latest releases (operator-directed).

### Out of Scope
- Hermes, Cursor and Devin rosters - the operator named the gpt provider on codex, opencode and pi only.
- The pi fast-mode extension's priority-tier model list - it pins service tiers for Sol and Luna, and adding Terra there is a behavior change nobody asked for.
- `gpt-6.1-sol` and `gpt-6-astra` - the request named Terra only.
- Removing `gpt-5.6-terra` from cli-codex - the request was to add, and Codex still lists it.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/cli-external-orchestration/cli-codex/**` (SKILL.md, README.md, references, assets, playbook, changelog) | Modify/Create | Roster rows and v1.9.8.0 |
| `.skilled/skills/cli-external-orchestration/cli-opencode/**` (SKILL.md, references, changelog) | Modify/Create | GPT grid row and v1.5.2.0 |
| `.skilled/skills/cli-external-orchestration/cli-pi/**` (SKILL.md, references, playbook, changelog) | Modify/Create | openai roster row and v1.5.16.0 |
| `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts`, `scripts/fanout-run.cjs` and two unit tests | Modify | Fan-out allowlist and provider map |
| `.pi/settings.json`, `.hermes/skills/cli-{codex,opencode,pi}/SKILL.md` | Modify | Picker entry and regenerated mirrors |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Each of the three skills documents GPT-6.1 Terra on the openai provider | `rg -l gpt-6.1-terra` over the three skills' references lists each `providers-and-models.md` |
| REQ-002 | The cli-pi fan-out accepts `gpt-6.1-terra` and routes it to `openai` | The two unit suites pass with the roster test expecting the new id |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Each skill carries one patch bump and one valid changelog entry | `validate_document.py` prints `VALID` for each new entry |
| REQ-004 | The Hermes mirrors match their sources | `sync-skills-hermes.cjs --check` reports no drift |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A one-turn dispatch on GPT-6.1 Terra replies `OK` on Codex, OpenCode 1 and Pi.
- **SC-002**: The full deep-loop runtime suite passes after the change.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | OpenAI's catalog keeping `gpt-6.1-terra` | Dispatches fail if it is withdrawn | The roster smoke scenario dispatches every listed model |
| Risk | OpenCode's Terra variant range is unmeasured | Med | The effort map says so and names the Codex catalog range |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None
<!-- /ANCHOR:questions -->

---
