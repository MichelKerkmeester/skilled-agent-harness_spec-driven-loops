---
title: "Feature Specification: Remove the llmgateway GPT-6 Luna route from Pi, OpenCode and Hermes rosters"
description: "GPT-6 Luna is still reachable through the DevPass llmgateway provider on Pi and Hermes, which breaks the operator rule that GPT models run only on the GPT provider. This packet removes that route from configs, allowlists, docs and generated mirrors."
trigger_phrases:
  - "remove llmgateway luna route"
  - "remove the llmgateway gpt 6 luna route"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Remove the llmgateway GPT-6 Luna route from Pi, OpenCode and Hermes rosters

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-28 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The operator rule of 2026-10-28 says GPT models run only on the GPT provider: cli-codex, or Pi's `openai` route, never through DevPass. Pi still registers and enables `llmgateway/gpt-6-luna`, and the Hermes fan-out allowlist still accepts `gpt-6-luna` and dispatches it with `--provider llmgateway`, so a run can still bill Luna through DevPass.

The same rule covers GPT-6 Sol. On 2026-10-28 the operator extended this packet to remove `gpt-6-sol` from the Hermes roster the same way: Hermes pins every roster id to `--provider llmgateway`, so its Sol entry is a DevPass route too.

### Purpose
No config, allowlist or doc in the repository offers GPT-6 Luna through `llmgateway`, while `openai/gpt-6-luna` on Pi and `gpt-6-luna` on cli-codex keep working. The same holds for GPT-6 Sol: no config, allowlist or doc offers `gpt-6-sol` through `llmgateway`, while `openai/gpt-6-sol` on Pi and `gpt-6-sol` on cli-codex keep working.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ pi --list-models gpt-6
provider     model              context  max-out  thinking  images
llmgateway   gpt-6-luna         1.1M     128K     yes       yes
openai       gpt-4o-2024-08-06  128K     16.4K    no        yes
openai       gpt-5.6-luna       272K     128K     yes       yes
openai       gpt-5.6-sol        272K     128K     yes       yes
openai       gpt-5.6-terra      272K     128K     yes       yes
openai       gpt-6-astra        272K     128K     yes       yes
openai       gpt-6-luna         272K     128K     yes       yes
openai       gpt-6-sol          272K     128K     yes       yes
openai       gpt-6.1-sol        272K     128K     yes       yes
openai       gpt-6.1-terra      272K     128K     yes       yes
opencode-go  gpt-5.6-luna       1.1M     128K     yes       yes
opencode-go  gpt-6-luna         1.1M     128K     yes       yes
exit=0
```

Sol baseline, recorded before the Sol extension on 2026-10-28: `pi --list-models gpt-6` printed `openai gpt-6-sol` and no `llmgateway gpt-6-sol` row, and `.pi/models.json` and `.pi/settings.json` named no Sol id. The only gateway Sol route was the Hermes pair, where `HERMES_SUPPORTED_MODELS` and `HERMES_ALLOWED_MODELS` both held `gpt-6-sol`.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Remove the `gpt-6-luna` model object from the `llmgateway` block in `.pi/models.json` and its `enabledModels` entry in `.pi/settings.json`.
- Remove `gpt-6-luna` from `HERMES_SUPPORTED_MODELS` and its `HERMES_ALLOWED_MODELS` mirror, and update the tests that pin the Hermes roster.
- Rewrite the Pi, Hermes, session-relaunch and release docs that offer or describe the llmgateway Luna route, including released changelogs, keeping every other row and number.
- Regenerate the Hermes skill mirror and the trigger index after the source edits.
- Sol extension: remove `gpt-6-sol` from `HERMES_SUPPORTED_MODELS` and `HERMES_ALLOWED_MODELS`, update the Hermes roster tests, rewrite the Hermes roster docs and hub summary from six ids to five, and scrub the gateway Sol mention from the released `cli-hermes` v1.0.2.0 note, matching what the Luna removal did to that note.

### Out of Scope
- `openai/gpt-6-luna` on Pi and `gpt-6-luna` on cli-codex - the operator keeps these routes.
- `openai/gpt-6-sol` on Pi, `gpt-6-sol` on cli-codex, `openai/gpt-6-sol` on OpenCode and the Pi fast-mode extension's `openai` and `openai-codex` Sol entries - GPT-provider routes the operator keeps.
- Other llmgateway models - the operator scoped this change to the GPT-6 Luna and Sol routes.
- The `cli-copilot` plus `gpt-6-sol` advice in `cli-opencode` docs and the `cli-cursor` test fixture that names `gpt-6-sol` - neither is an llmgateway or DevPass route.
- Released notes that name Sol on a GPT-provider route, such as the cli-codex, cli-opencode and cli-pi changelogs and the generic GPT-6 adoption line in `v4.0.0.1.md`.
- `opencode-go/gpt-6-luna` in Pi's built-in catalog - it is not llmgateway and comes from Pi's own catalog, not a repo file.
- OpenCode configs and docs - inventory found no llmgateway Luna route there; OpenCode lists Luna only as `openai/gpt-6-luna`.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.pi/models.json`, `.pi/settings.json`, `.pi/custom-providers.md` | Modify | Drop the DevPass Luna model, its picker entry and its docs |
| `.skilled/skills/cli-external-orchestration/cli-pi/references/providers-and-models.md`, `cli-pi/changelog/v1.5.7.0.md`, `cli-pi/changelog/v1.5.8.0.md` | Modify | Drop the DevPass Luna row and its changelog mentions |
| `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts`, `runtime/scripts/fanout-run.cjs`, `runtime/tests/unit/executor-config.vitest.ts` | Modify | Remove Luna, then Sol, from the Hermes allowlist, its mirror and the roster test |
| `cli-hermes/SKILL.md`, `README.md`, `references/providers-and-models.md`, `assets/prompt-quality-card.md`, `feature-catalog/feature-catalog.md`, `feature-catalog/fanout-dispatch/closed-model-roster.md`, `manual-testing-playbook/manual-testing-playbook.md`, `manual-testing-playbook/cli-invocation/off-roster-model-rejection.md`, `changelog/v1.0.2.0.md` | Modify | Seven-id roster becomes six for Luna, then five for Sol; drop the Luna and Sol rows and changelog mentions |
| `.skilled/skills/cli-external-orchestration/README.md`, `cli-external-orchestration/graph-metadata.json` | Modify | The hub's Hermes summary says five ids |
| `.skilled/hooks/session-relaunch/README.md`, `system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-relaunch-command-runtimes.md` | Modify | Hermes launch examples use `deepseek-v4.1-flash-1017` |
| `.skilled/changelog/skilled/v4.0.0.1.md` | Modify | Drop the Pi default-on-gateway-Luna sentences |
| `.hermes/skills/cli-hermes/SKILL.md`, `system-spec-kit/runtime/data/trigger-index.json` and its three retrieval fixtures | Regenerate | Generator output after the source edits |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Pi no longer registers the DevPass Luna route | `pi --list-models gpt-6` prints an `openai gpt-6-luna` row and no `llmgateway gpt-6-luna` row |
| REQ-002 | The Hermes fan-out rejects `gpt-6-luna` | `HERMES_SUPPORTED_MODELS` and `HERMES_ALLOWED_MODELS` hold no `gpt-6-luna`, and both vitest files pass |
| REQ-005 | The Hermes fan-out rejects `gpt-6-sol` | `HERMES_SUPPORTED_MODELS` and `HERMES_ALLOWED_MODELS` hold five ids without `gpt-6-sol`, the roster test asserts `isHermesModelAllowed('gpt-6-sol')` is false, and both vitest files pass |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | No repo doc outside `specs/` offers or describes the llmgateway Luna route | The inventory query in `tasks.md` T016 prints no line that offers or describes the gateway Luna route; what remains names Luna on the `openai` route, in a keyword list or a `none is Luna` note, or is an index row sourced from a `specs/` doc |
| REQ-004 | Generated mirrors match their sources | `sync-skills-hermes.cjs --check` reports no drift and the trigger index is rebuilt |
| REQ-006 | No repo doc outside `specs/` offers or describes an llmgateway or DevPass Sol route | `rg -n -i 'gpt-6-sol\|gpt-6\.0-sol\|6-sol' --hidden -g '!specs/**' -g '!.worktrees/**' -g '!node_modules/**'` prints no line that offers Sol through `llmgateway` or DevPass; every remaining line names Sol on a GPT-provider route, a non-gateway surface, or is history |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `pi --list-models gpt-6` lists `openai gpt-6-luna` and no `llmgateway gpt-6-luna`.
- **SC-002**: `npx vitest run --no-coverage tests/unit/executor-config.vitest.ts tests/unit/fanout-run.vitest.ts` passes every test.
- **SC-003**: The Hermes roster holds five ids, none of them a GPT model, and `pi --list-models gpt-6` lists `openai gpt-6-sol` and no `llmgateway gpt-6-sol`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The `pi` binary and its built-in catalog | If the catalog itself listed `llmgateway/gpt-6-luna`, removing the repo entry would not remove the route | Re-run `pi --list-models gpt-6` after the edit and read the rows |
| Risk | Other sessions edit tracked files at the same time | Med | Edit only inventory files, check `git diff` per file before and after, never revert lines this packet did not change |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---
