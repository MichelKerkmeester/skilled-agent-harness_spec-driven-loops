---
title: "Feature Specification: Phase 1: unknowns-and-baseline"
description: "Settles the open OpenCode v1 and v2 questions with evidence and records a load baseline for all 16 repo plugins on both versions. This phase changes no repo file."
trigger_phrases:
  - "unknowns and baseline"
  - "phase 1 unknowns and baseline"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 1: unknowns-and-baseline

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-10-18 |
| **Branch** | `worktrees/143-opencode-dual-compat-build` |
| **Parent Spec** | ../spec.md |
| **Phase** | 1 of 11 |
| **Predecessor** | None |
| **Successor** | 002-pins-imports-dual-export |
| **Handoff Criteria** | `findings.md` holds a verdict for each of the 11 listed questions, `baseline.json` lists all 16 plugins on both versions, and the orchestrator has written each decision change into the parent spec before phase 2 starts. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 1** of the OpenCode v1 and v2 dual compatibility build specification.

**Scope Boundary**: Probes, desk checks and a baseline only. The phase writes inside this folder and changes no repo file. It does not pin versions, edit plugins or touch agents, commands or config.

**Dependencies**:
- `../research/research.md`, sections 8, 11 and 12, lists the open questions and the unestablished ledger rows this phase settles.
- The binaries `opencode` 1.19.3 and `opencode2` 2.0.32 are installed on the working machine. Both report their version on 2026-10-18.
- `bun` runs the sk-vision build in a throwaway copy.

**Executor (D6)**: DeepSeek V4.1 Flash max through cli-devin runs the probes and desk checks. The orchestrator reruns each verdict's command before the verdict stands.

**Frozen decisions that bind this phase**: The parent goal (`../goal.md`) carries decisions D1 to D8, and it binds every phase. This table records what each one means for phase 1.

| ID | Effect on this phase |
|----|----------------------|
| D1 | Every plugin default-exports one plain object. This phase reads the load state and changes no plugin. |
| D2 | `opencode.json` stays in the v1 shape. This phase reads it and changes nothing. |
| D3 | Every v2 child dispatch uses `run --standalone`. Any v2 run this phase starts follows the same rule. |
| D4 | The v2 background service is never stopped, started or restarted and no `opencode upgrade --major` runs. |
| D5 | The pins stay unchanged here. The sk-vision package pins `@opencode-ai/plugin` 1.17.15, which this phase records for phase 3. |
| D6 | Probes and desk checks go to DeepSeek V4.1 Flash max through cli-devin. The orchestrator reruns each verdict. |
| D7 | Any code this phase writes follows the sk-code OPENCODE surface. Scratch probe scripts are not repo code and are not kept. |
| D8 | No public compatibility claim is written in this phase. |

**Deliverables**:
- `findings.md`, with one verdict per listed question and the command and output excerpt behind it.
- `baseline.json`, with each plugin's load state on v1 and v2, and the pass and fail counts of the plugin and guard suites.

<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The research record leaves eleven questions open, and phases 2 to 4 cannot start on a guess about them. No record yet shows which of the 16 repo plugins load on OpenCode 1.19.3 and which load on 2.0.32. Later phases therefore have no before state to compare against.

### Purpose
Every open question gets a verdict with evidence, and both versions get a per-plugin baseline, before any repo code changes.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Q1: what `allowed-tools` does on each version.
- Q2: what `disable-model-invocation` does on each version.
- Q3: whether v1 1.19.3 accepts `-m provider/model#variant`.
- Q4: whether `plugin.check` accepts a definition that carries an extra top-level key.
- Q5: whether v2 delivers `session.idle` to `ctx.event.subscribe`.
- Q6: whether v2 delivers `session.compacted` to `ctx.event.subscribe`.
- Q7: whether a zod JSON Schema satisfies the v2 `Tool.ValueSchema`.
- Q8: how the VS Code extension loads OpenCode config and plugins.
- Q9: how LSP loads OpenCode config and plugins.
- Q10: how `CLAUDE.md` loads on each version.
- Q11: where the sk-vision source lives, and whether its built bundle loads on each version.
- The load state of all 16 repo plugins on v1 1.19.3 and on v2 2.0.32.
- The pass and fail counts of the plugin suite and the guard suites.

### Out of Scope
- Any repo file outside this folder. The phase is a baseline, and later phases own the edits.
- Pins, installs and lock files. Phase 2 owns them.
- Stopping, starting or restarting the v2 background service. Decision D4 forbids it, and research iteration 14 records what a restart broke.
- Closing the server-side toast and the global command observer. Research section 8 marks both irreducible.
- The public compatibility claim. Phase 11 writes it under decision D8.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `001-unknowns-and-baseline/findings.md` | Create | One verdict per question Q1 to Q11, each with its command and output excerpt. |
| `001-unknowns-and-baseline/baseline.json` | Create | Load state of each plugin on v1 and v2, and the pass and fail counts of the suites. |
| `001-unknowns-and-baseline/scratch/` | Create (scratch only) | Raw probe captures, the status snapshot and the throwaway sk-vision build. |
| `.opencode/plugins/`, `opencode.json`, `.skilled/skills/sk-vision/vision-runtime/` | Read only | Evidence sources. None of them changes. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Every listed question, Q1 to Q11, has a verdict of confirmed, refuted or unknown, with the command and output excerpt that gave it. |
| REQ-002 | `baseline.json` lists all 16 repo plugins, and each has a v1 load state and a v2 load state. |
| REQ-003 | The sk-vision source location is named. The built bundle's load result on v1 and on v2 is recorded, or the bundle is recorded as blocked. |
| REQ-004 | No file outside this child folder changes. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-005 | `baseline.json` records the pass and fail counts of the plugin suite and the guard suites before any change. |
| REQ-006 | `findings.md` lists each decision change the orchestrator must write into the parent spec before phase 2 starts. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All eleven questions have a verdict, and each verdict cites its command and its output.
- **SC-002**: The baseline covers 32 load states, which is 16 plugins on each of two versions.
- **SC-003**: Every decision change that this phase finds appears in `findings.md` under its own heading, for the orchestrator to write into the parent spec.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `opencode2` background service | A stop or restart can break the shared v2 state, as research iteration 14 recorded. | Read the plugin list only. Never stop, start or restart the service (D4). |
| Dependency | `bun` for the sk-vision build | Without bun the bundle cannot be built, and REQ-003 falls back to blocked. | Record `bun --version` before the build. |
| Dependency | A model-free v1 load trigger | No verified command loads plugins on v1 without a model call. | Test the candidates in `tasks.md` (T012) before the baseline. |
| Risk | The repo dispatch guard refuses `opencode run` in a child session | A probe may be refused, as research iteration 17 recorded. | The orchestrator reruns any refused probe in its own session. |
| Risk | A probe writes sessions into the operator's database | The v1 and v2 session databases are shared with normal use. | Set `OPENCODE_DB` to a file under `scratch/` for every probe that writes sessions. |
| Risk | The sk-vision `dist/` folder is gitignored | A local build leaves no tracked change, so a fresh clone still lacks the bundle. | Build in place, as the parent goal log asks. `git status` stays clean, and the created artifact is recorded. |
| Risk | The sk-vision package pins its own `@opencode-ai/plugin` 1.17.15 | The bundle may not match the D5 pin of 1.19.3. | Record the pin in `findings.md`. Phase 3 decides. |
<!-- /ANCHOR:risks -->

---


<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: No performance target applies. The phase changes no code path, and no timing baseline exists to compare against.
- **NFR-P02**: Each plugin list read repeats until the plugin count stops changing, with at most three reads.

### Security
- **NFR-S01**: No probe prints or stores a credential or a model account setting.
- **NFR-S02**: No probe makes a paid model call. Probes use a model id that does not exist, such as `nosuchprovider/nosuchmodel`, so each run is meant to fail before any call.

### Reliability
- **NFR-R01**: A verdict stands only when a second run of its command gives the same output.
- **NFR-R02**: A question that cannot be settled stays unknown. Inference never turns an unknown into a confirmed verdict.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty plugin list: the baseline records zero for that version, and every plugin on that version is unknown.
- Maximum length: each verdict quotes at most 20 lines of output. The full capture stays in `scratch/`.
- Invalid format: a verdict with no command or no output excerpt is invalid, and its question runs again.

### Error Scenarios
- External service failure: a v2 read fails. The phase records that check as unknown and does not restart the service.
- Network timeout: a plugin list read is retried up to three times, and the last count is recorded with its time.
- Concurrent access: another session writes to the v2 database during a probe. Each probe uses its own database file, so it shares no state with that session.

### State Transitions
- Partial completion: `findings.md` keeps every verdict already reached, and each open question stays marked unknown with its reason.
- Session expiry: The probes hold no session across runs, so this case cannot arise.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | Eleven questions, 16 plugins on two hosts and one sk-vision build. No repo file changes. |
| Risk | 12/25 | A shared v2 service and session databases, handled by the NFR rules. |
| Research | 16/20 | Most questions are open in research, and the v1 load trigger is not yet verified. |
| **Total** | **40/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Which model-free command loads plugins on v1 1.19.3? The candidate is `opencode run -m nosuchprovider/nosuchmodel` with `OPENCODE_DB` set and stdin closed. Research iteration 17 shows that `debug config` resolves plugins without loading them.
- Where should the sk-vision bundle be built? The parent goal log says 001 builds it before the baseline, which points to the repo's ignored `dist/`. The brief's acceptance says no file outside this child changes, and `git status` does not list ignored files. The plan builds in place and records the artifact. The orchestrator confirms.
- Does the v2 background service pick up a changed plugin file without a restart? Decision D4 forbids a restart, and phase 2 needs the answer. This question is not one of Q1 to Q11, so it is raised here for the orchestrator to decide.
- The parent goal (`../goal.md`) states D2 as `mcp.servers.<name>` in the v1 shape. The repo's `opencode.json` uses `mcp.code_mode`, and research iteration 8 calls `servers` a v2 wrapper that v1 unwraps. Phase 4 raises this conflict before it edits the file.
<!-- /ANCHOR:questions -->
