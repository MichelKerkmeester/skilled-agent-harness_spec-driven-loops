---
title: "Feature Specification: Phase 3: dsh-mistral-route"
description: "DeepSeek Harness dispatches only through a closed two-route roster, so Mistral's hosted DeepSeek V4.1 Flash 1017 cannot run there. Offline composition and a direct API check show a third route is feasible if it drops the DeepSeek thinking format; this phase adds and proves it."
trigger_phrases:
  - "dsh mistral route"
  - "phase 3 dsh mistral route"
  - "deepseek harness mistral deepseek"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 3: dsh-mistral-route

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-11-14 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 3 of 12 |
| **Predecessor** | 002-mistral-provider-roster |
| **Successor** | 004-vibe-contract-pin |
| **Handoff Criteria** | A keyed dsh dispatch on the Mistral route exits 0 with `final.reason.kind` `completed`. Not met: the route was retired on 2026-11-15, see Outcome |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 3** of the Mistral as a provider across the CLI runtimes and Mistral Vibe as a cli-external-orchestration runtime mode specification.

**Scope Boundary**: One new dsh route patch and the roster, hard rule and dispatch guard that must name it. No change to the two existing routes.

**Dependencies**:
- `MISTRAL_API_KEY` exported for dispatched shells, since headless dsh reads keys only from the environment.
- The roster amendment in this phase, because the dispatch guard refuses an off-roster patch.

**Deliverables**:
- `.dsh/patches/route-mistral-deepseek.patch.yml`, drafted in `scratch/draft-route-mistral-deepseek.patch.yml`.
- A third roster row in the cli-deepseek-harness references and `hard-rules.json`.

**Outcome (2026-11-15)**: the route was built, then retired. Keyed runs on dsh 0.2.2-rc.3 failed: Mistral rejects the `store` field, and with any reasoning level it streams `thinking` chunks dsh cannot read. Only reasoning `off` completed. The operator decided Mistral work goes through Vibe, so the roster is back to two routes and REQ-002 and SC-002 are not met.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
dsh has no model option, so its route patch is the model choice, and the `closed-roster` rule allows only the LLM Gateway and OpenCode Go patches. The operator's Mistral subscription serves the same DeepSeek V4.1 Flash release, but dsh cannot reach it, and the existing patch shape sends a `thinking` field that Mistral rejects.

### Purpose
Add a Mistral route to dsh that completes a keyed dispatch, without changing the two existing routes.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ DSH_HOME=<tmp> dsh --profile headless --patch scratch/draft-route-mistral-deepseek.patch.yml \
    --patch .dsh/patches/lineage.patch.yml --patch .dsh/patches/guards.patch.yml --dump-config
exit=0, stderr empty, agent-default-model: provider mistral, model deepseek-v4-1-flash-1017
$ keyed dsh dispatch with the draft patch
PreToolUse hook: Dispatch blocked by cli-deepseek-harness hard-rule(s): [route-patch-required] [closed-roster]
$ curl https://api.mistral.ai/v1/chat/completions, model deepseek-v4-1-flash-1017
no reasoning field            -> 200 "OK"
"reasoning_effort":"high"     -> 200 "OK"
"reasoning_effort":"max"      -> 200 "OK"
"thinking":{"type":"disabled"} -> 422 extra_forbidden "Extra inputs are not permitted"
"thinking":{"type":"enabled"}  -> 422 extra_forbidden
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add `.dsh/patches/route-mistral-deepseek.patch.yml` without `compat.thinkingFormat: deepseek`.
- Amend the roster table, the `closed-roster` rule message and the dispatch preflight to admit the third patch.
- Prove the route with a keyed harmless dispatch.

### Out of Scope
- Making Mistral a dsh default - the providers reference allows a default only after a keyed run, and DevPass stays cheaper per token.
- A GLM route on dsh - dsh is a DeepSeek harness and the request named DeepSeek.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.dsh/patches/route-mistral-deepseek.patch.yml` | Create | Mistral route patch |
| `.skilled/skills/cli-external-orchestration/cli-deepseek-harness/references/providers-and-models.md` | Modify | Third roster row |
| `.skilled/skills/cli-external-orchestration/cli-deepseek-harness/hard-rules.json` | Modify | `closed-roster` message names the third patch |
| `.skilled/hooks/dispatch/lib/dispatch-rule-checks.mjs`, `dispatch-rule-checks.test.mjs` | Modify | Preflight admits the third patch, with a test |
| cli-deepseek-harness `SKILL.md`, `README.md`, `runtime-folder-and-sync.md`, hub `SKILL.md`, `README.md`, feature catalog | Modify | Two-route wording becomes three-route |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The Mistral route composes | `--dump-config` from a disposable home exits 0 with empty stderr and names `mistral` and `deepseek-v4-1-flash-1017` |
| REQ-002 | A keyed dispatch completes | Exit 0 and `final.reason.kind` `completed` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | The existing routes are unchanged | `git diff` shows no change to the two existing route patches, and their preflight tests pass |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The dispatch guard admits `route-mistral-deepseek.patch.yml` and still refuses an unlisted patch.
- **SC-002**: A keyed dispatch at `max` completes with no `UNSUPPORTED_REASONING_EFFORT` on stderr.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `MISTRAL_API_KEY` in the environment | High: no keyed proof without it | The operator exports it in `~/.zshenv`, as for the other route keys |
| Risk | dsh's default compat sends `developer` role or another field Mistral rejects | Med | The draft keeps `supportsDeveloperRole: false`; read the 4xx body on the first keyed run |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- With no `thinkingFormat`, does dsh send `reasoning_effort`, which Mistral accepts, or nothing? The first keyed run's request log decides it.
<!-- /ANCHOR:questions -->

---
