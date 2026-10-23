---
title: "Feature Specification: Phase 65: drop-old-deepseek-from-pi"
description: "Pi still registered the undated 2026-09-10 `deepseek-v4.1-flash` in `.pi/models.json` after an earlier commit took it out of `enabledModels`, so a run could still pin it with `--model` even though the picker no longer offered it. The operator asked to remove it from `models.json` as well. Pi now registers only the dated 2026-10-17 `deepseek-v4.1-flash-1017`, and a cli-pi lineage pinned to the old id is rejected up front instead of dispatching a model the runtime cannot run."
trigger_phrases:
  - "drop old deepseek from pi"
  - "phase 65 drop old deepseek from pi"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 65: drop-old-deepseek-from-pi

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-10-23 |
| **Branch** | `worktrees/210-drop-old-deepseek-from-pi` |
| **Parent Spec** | ../spec.md |
| **Phase** | 65 of 65 |
| **Predecessor** | 064-append-log-concurrency-flake |
| **Successor** | None |
| **Handoff Criteria** | `.pi/models.json` registers no undated `deepseek-v4.1-flash` under `llmgateway`, and `PI_SUPPORTED_MODELS` in `executor-config.ts` plus `PI_ALLOWED_MODELS` and `PI_MODEL_PROVIDERS` in `fanout-run.cjs` drop the bare id, so a cli-pi lineage pinned to it is rejected with "cli-pi model 'deepseek-v4.1-flash' is not in the enforced allowlist". Hermes keeps the id through its own provider block and OpenCode keeps it as a native `llmgateway` model, both on purpose. The updated tests pass and a revert proof fails 6 tests when the old id is restored. The live `pi --list-models` and unpinned-run proofs, the suite counts, the push to main and the CI run remain open. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 65** of the Drop the 2026-09-10 DeepSeek V4.1 Flash id from Pi specification. It is the last phase, and it finishes the removal the earlier `052d1e2e1e` commit started by taking the old id out of `.pi/settings.json` `enabledModels` only.

**Scope Boundary**: `.pi/models.json`, the two cli-pi rosters in `executor-config.ts` and `fanout-run.cjs`, the four suites that pin those rosters, the three docs that describe the Pi model roster, this phase's four docs and the parent packet's phase-map and handoff rows. Hermes and OpenCode are deliberately untouched.

**Dependencies**:
- The operator's request to remove the old id from `models.json` as well as from `enabledModels`.
- Commit `052d1e2e1e`, which already took the old id out of `.pi/settings.json` `enabledModels`, so the picker no longer offered it while `--model` could still pin it.
- The dated 2026-10-17 `deepseek-v4.1-flash-1017` release staying registered and remaining the default.

**Deliverables**:
- The `deepseek-v4.1-flash` object deleted from the `llmgateway` provider block in `.pi/models.json`, leaving `deepseek-v4.1-flash-1017`, `glm-5.3-flash` and `gpt-6-luna`.
- The bare id dropped from `PI_SUPPORTED_MODELS`, `PI_ALLOWED_MODELS` and `PI_MODEL_PROVIDERS`, so command construction rejects it before dispatch.
- Updated tests with a revert proof, the three roster docs, this phase's four docs and the parent packet's rows.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Commit `052d1e2e1e` took the undated 2026-09-10 `deepseek-v4.1-flash` out of `.pi/settings.json` `enabledModels`, so the picker stopped offering it, but the model object stayed in the `llmgateway` provider block in `.pi/models.json`. A run could therefore still pin `--model llmgateway/deepseek-v4.1-flash`, and the cli-pi rosters still accepted the bare literal, even though Pi was meant to carry only the dated 2026-10-17 release. That split state makes a roster look retired while it is still dispatchable, and a lineage pinned to the old id fails at request time instead of at command construction.

### Purpose
Remove the undated id from Pi entirely, so the runtime registers only `deepseek-v4.1-flash-1017` and a cli-pi lineage pinned to the old id is rejected up front with a clear allowlist error.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Delete the `deepseek-v4.1-flash` entry from the `llmgateway` provider block in `.pi/models.json`, leaving `deepseek-v4.1-flash-1017`, `glm-5.3-flash` and `gpt-6-luna`.
- Drop the bare id from `PI_SUPPORTED_MODELS` in `executor-config.ts` and from `PI_ALLOWED_MODELS` plus `PI_MODEL_PROVIDERS` in `fanout-run.cjs`, and reword the comments that described the two DeepSeek literals.
- Update `executor-config`, `fanout-run`, `combo-matrix` and `orchestrate-session-cli`, including new checks that cli-pi rejects the old id and that `.pi/models.json` does not register it.
- Update `cli-pi` `references/providers-and-models.md`, `.pi/custom-providers.md` and the v4.0.0.13 changelog to say Pi no longer carries the old id and to point at OpenCode or Hermes for reproducing the 2026-09-10 release.
- This phase's four docs and the parent packet's phase-map and handoff rows.

### Out of Scope
- Hermes dropping the old id - its own provider block in `~/.hermes/config.yaml` passes any gateway id through, so it does not depend on Pi and keeps the id on purpose.
- OpenCode dropping the old id - `llmgateway` is native there, so OpenCode keeps it on purpose.
- Changing the `deepseek-v4.1-flash-1017` default or the gateway catalog - only the undated id is removed.
- Any other executor, provider or model roster.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.pi/models.json` | Modify | Delete the `deepseek-v4.1-flash` object from the `llmgateway` provider block |
| `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts` | Modify | Drop the bare id from `PI_SUPPORTED_MODELS` and reword the DeepSeek comments |
| `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` | Modify | Drop the bare id from `PI_ALLOWED_MODELS` and `PI_MODEL_PROVIDERS`, keep `HERMES_ALLOWED_MODELS` unchanged and reword the comments |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/executor-config.vitest.ts` | Modify | Remove the old id from the expected roster and add checks that it is rejected and that `models.json` does not register it |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts` | Modify | Replace the old-id dispatch test with one that expects the allowlist rejection and move the provider map and effort tests to `-1017` |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/combo-matrix.vitest.ts` | Modify | Move the cli-pi representative command to `llmgateway/deepseek-v4.1-flash-1017` |
| `.skilled/skills/system-deep-loop/deep-ai-council/scripts/tests/orchestrate-session-cli.vitest.ts` | Modify | Move the cli-pi case to `deepseek-v4.1-flash-1017` |
| `.skilled/skills/cli-external-orchestration/cli-pi/references/providers-and-models.md` | Modify | Say Pi carries three llmgateway rows and point the 2026-09-10 release at OpenCode or Hermes |
| `.pi/custom-providers.md` | Modify | Update the roster count, picker note, model table, thinking note and removal steps |
| `.skilled/changelog/skilled/v4.0.0.13.md` | Modify | Say the older id stays selectable on OpenCode and Hermes while Pi no longer carries it |
| `spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md` | Modify | This phase's packet, filled from the scaffold |
| `../spec.md` | Modify | The phase map row for 065 and the 064 to 065 handoff row |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Pi registers only the dated DeepSeek release. | The `llmgateway` provider block in `.pi/models.json` holds `deepseek-v4.1-flash-1017`, `glm-5.3-flash` and `gpt-6-luna`, and no undated `deepseek-v4.1-flash` entry. |
| REQ-002 | Both cli-pi rosters drop the bare id. | `PI_SUPPORTED_MODELS`, `PI_ALLOWED_MODELS` and `PI_MODEL_PROVIDERS` no longer carry `deepseek-v4.1-flash`, and a lineage pinned to it is rejected with "cli-pi model 'deepseek-v4.1-flash' is not in the enforced allowlist". |
| REQ-003 | Tests hold the removal with a revert proof. | `executor-config`, `fanout-run`, `combo-matrix` and `orchestrate-session-cli` are updated, new checks reject the old id and assert `.pi/models.json` does not register it, and restoring the old id fails 6 tests. |
| REQ-004 | The docs match the roster. | `cli-pi` `references/providers-and-models.md`, `.pi/custom-providers.md` and the v4.0.0.13 changelog say Pi no longer carries the old id and point at OpenCode or Hermes to reproduce the 2026-09-10 release. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | The removal stays Pi-only. | `HERMES_ALLOWED_MODELS` still carries the old id, OpenCode still reaches it through native `llmgateway`, and both exclusions are recorded as deliberate. |
| REQ-006 | This phase's records match the final state. | All four docs replace every scaffold placeholder, keep the template anchors and frontmatter, and leave the live proof, suite counts, push and CI rows as pending placeholders for the orchestrator. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `.pi/models.json` no longer registers `deepseek-v4.1-flash`, so `pi --list-models` shows no undated llmgateway DeepSeek row.
- **SC-002**: A cli-pi lineage pinned to the old id is rejected at command construction rather than dispatched.
- **SC-003**: The dated `deepseek-v4.1-flash-1017` default is unchanged, so an unpinned pi run still uses it and exits 0.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The operator's request and commit `052d1e2e1e` | High | The earlier commit left the id registered, so the split state is the reason for this phase rather than an assumption |
| Dependency | The dated `deepseek-v4.1-flash-1017` release staying available | High | It remains registered and is the default; only the undated id is removed |
| Risk | Removing the provider mapping makes the rejection message less obvious | Low | `PI_ALLOWED_MODELS` rejects the literal first with a message that names the id and the allowlist |
| Risk | Hermes or OpenCode loses the old id by accident | Med | Both keep it on purpose and the tests still cover their rosters; the phase records say why |
| Risk | A doc still claims the old id is pinnable on Pi | Med | All three roster docs are updated and the changelog names OpenCode and Hermes as the remaining routes |
| Risk | The live proof is taken from this worktree rather than the main checkout | Med | The proof rows stay pending until the main checkout updates; the orchestrator fills them after the push |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. The operator gave the instruction, the split state is visible in the diff, and the remaining tasks are delivery rather than decisions.
<!-- /ANCHOR:questions -->

---
