---
title: "Feature Specification: Phase 18: ollama-lane-off-and-daemon-liveness"
description: "Every uncached advisor prompt waits on Ollama for a semantic lane worth 0.05 that measured no gain. An advisor server whose launcher dies keeps running. This phase takes the lane off the prompt path, removes the advisor's unused embedder code and makes orphaned or wedged daemons exit."
trigger_phrases:
  - "ollama lane off and daemon liveness"
  - "phase 18 ollama lane off and daemon liveness"
  - "semantic lane weight zero"
  - "advisor heartbeat watchdog"
  - "advisor parent death check"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 18: ollama-lane-off-and-daemon-liveness

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-19 |
| **Branch** | `worktrees/479-ollama-lane-off-and-daemon-liveness` |
| **Parent Spec** | ../spec.md |
| **Phase** | 18 of 18 |
| **Predecessor** | 017-ollama-advisor-analysis |
| **Successor** | None |
| **Handoff Criteria** | Every row in `acceptance-criteria.md` is `Met`, and the branch is merged to main and pushed |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 18** of the pi-context-decisions refinement packet. It builds the changes the operator picked from phase 017's report, in the shape a fresh Opus read recommended.

**Scope Boundary**: the advisor runtime, its launcher, their tests and the docs that state the lane weight or the model-server default. The shared embedder cascade in `system-spec-kit/shared/embeddings` stays as it is.

**Dependencies**:
- Phase 017's report, `../017-ollama-advisor-analysis/evidence/report.md`.
- Worktree 479, branched from main at `62a9359e60a`.

**Deliverables**:
- The lane off the prompt path at a default weight of 0, with an env re-enable.
- The advisor's embedder pointer resolved without the cascade, the legacy embedding path gone and the hf model server off by default.
- A parent-death check in the server and a heartbeat watchdog in the launcher.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Every uncached prompt calls Ollama before scoring, whatever the lane's weight, and waits up to 750 ms when Ollama is slow. Yet the recorded 193-prompt ablation scored 149 with the lane and 150 without. An advisor server whose launcher is killed keeps serving with no owner, and a blocked server under a live launcher is never reaped.

### Purpose
No advisor prompt waits on Ollama, and no advisor server outlives its launcher or stays wedged for more than a few minutes.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ rg -n "id: 'semantic_shadow'" runtime/lib/scorer/lane-registry.ts
13:  { id: 'semantic_shadow', defaultWeight: 0.05, defaultShadowWeight: 0.05, live: true },
$ rg -n 'withSemanticShadowPromptEmbedding\(' runtime/handlers/advisor-recommend.ts
574:  const result = await withSemanticShadowPromptEmbedding(
$ rg -n 'semantic_shadow|DEFAULT_SCORER_LANE_WEIGHTS' runtime/lib/scorer/lanes/semantic-shadow.ts
294:        lane: 'semantic_shadow' as const,
314:        lane: 'semantic_shadow' as const,
383:        lane: 'semantic_shadow' as const,
$ rg -c ppid runtime/advisor-server.ts
$ rg -n "return 'default-on'" system-skill-advisor-launcher.cjs
1113:  if (raw === '') return 'default-on';
$ rg -n 'autoSelectActiveEmbedder\(' runtime/lib/embedders/schema.ts
356:    : await autoSelectActiveEmbedder({
```
The embed wrapper is called on every scored prompt, and `semantic-shadow.ts` never reads a lane weight. The server has no `ppid` reference. The launcher arms the hf model server when its flag is unset, and the daemon resolves its embedder pointer through the shared cascade.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Skip the prompt embed when the resolved `semantic_shadow` weight is 0, and set that default weight to 0 while the lane stays live, so `SPECKIT_ADVISOR_LANE_WEIGHTS_JSON` can turn it back on.
- Report a zero-weight lane as `lane_weight_zero` in `advisor_status`, with no per-prompt warning.
- Resolve the embedder pointer straight to the one registered manifest, delete the legacy embedding path and default the hf model-server spawner off.
- Exit the server when its parent pid changes, and have the launcher reap a child whose heartbeat file is older than 3 minutes.
- Re-baseline the TypeScript pins that move, and update the docs that state the weight or the defaults.

### Out of Scope
- The shared cascade in `system-spec-kit/shared/embeddings` - an sk-doc validator and spec-kit suites read it, so removing it belongs in its own packet.
- Embedding coverage refresh, outage-as-degraded and `OLLAMA_*` env forwarding - written as a re-enable checklist in `plan.md`, not built.
- The shadow weight, which stays 0.05 - shadow scoring is telemetry, and moving it re-baselines shadow fixtures for no routing change.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lane-registry.ts` | Modify | `semantic_shadow` default weight 0 |
| `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/semantic-shadow.ts` | Modify | Zero-weight guard before the embed |
| `.skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts` | Modify | No warning for `lane_weight_zero` |
| `.skilled/skills/system-skill-advisor/runtime/handlers/advisor-status.ts` | Modify | `lane_weight_zero` reason, lane reported off |
| `.skilled/skills/system-skill-advisor/runtime/lib/embedders/schema.ts` | Modify | Pointer resolves to the one manifest, no cascade |
| `.skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts` | Modify | Legacy embedding refresh and read removed |
| `.skilled/skills/system-skill-advisor/runtime/lib/daemon/liveness.ts` | Create | Parent-pid watch and heartbeat writer, with injectable timers so a test can drive them |
| `.skilled/skills/system-skill-advisor/runtime/advisor-server.ts` | Modify | Starts and stops both timers, corrected startup comment |
| `.skilled/bin/system-skill-advisor-launcher.cjs` | Modify | hf spawner default off, heartbeat watchdog |
| `.skilled/skills/system-skill-advisor/runtime/database/.gitignore` | Modify | Ignore the runtime heartbeat file |
| Advisor and bin tests | Create/Modify | New tests for each change, re-baselined pins |
| Advisor docs, `SKILL.md`, `changelog/v1.2.0.0.md`, ENV-REFERENCE, the v4.1.0.0 release entry | Modify/Create | Weight, defaults, version 1.2.0.0 |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | At a resolved `semantic_shadow` weight of 0, a scored prompt makes no embed call. At a weight above 0 set through `SPECKIT_ADVISOR_LANE_WEIGHTS_JSON`, it makes one |
| REQ-002 | The default `semantic_shadow` weight is 0 and the lane stays live |
| REQ-003 | The advisor server exits within 60 s after its parent pid changes |
| REQ-004 | The launcher stops a child whose heartbeat file is older than 3 minutes, with SIGTERM and then SIGKILL after 5 s |
| REQ-005 | Weight 0 adds no fire on a labeled prompt whose gold answer is none; otherwise the default stays 0.05 and only the guard ships |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-006 | `advisor_status` reports `lane_weight_zero` and `laneEnabled: false` at weight 0, and a recommend call adds no `semantic_lane_off` warning for it |
| REQ-007 | `ensureActiveEmbedder` sets an unresolved pointer to the one registered manifest without calling the cascade |
| REQ-008 | The legacy embedding refresh and read are gone; a refresh with no pointer embeds nothing |
| REQ-009 | The launcher leaves the hf model server off when its flag is unset; `1` still turns it on |
| REQ-010 | Docs state the new weight and defaults, `SKILL.md` is 1.2.0.0 and `changelog/v1.2.0.0.md` exists |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The full advisor runtime suite, the Python suite, the bin suite and the spec-kit launcher and embedder suites pass, with any moved pin explained in `implementation-summary.md`.
- **SC-002**: On main after the merge and a daemon restart, the parent goal's routing check still lists `sk-code` first.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Luna through cli-codex for the code leaves | No build if it is refused or out of quota | Stop and ask; the fallback is Vibe DeepSeek V4.1 Flash `max` only |
| Risk | Weight 0 raises every live confidence by about 5.3% (`liveTotal` 1.00 to 0.95), so abstains near the threshold can fire | Med | Count none-gold fires before and after on the labeled corpus; REQ-005 falls back to the guard alone |
| Risk | A slow startup scan delays the first heartbeat and the watchdog kills a healthy server | Med | The watchdog starts only after the first heartbeat file appears, and a test covers a slow start |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: At weight 0 an uncached prompt makes no network call to Ollama.
- **NFR-P02**: The heartbeat and parent checks run at most every 15 s and 30 s, with unref'd timers.

### Security
- **NFR-S01**: The heartbeat file holds only a timestamp and lives in the advisor's own database directory.
- **NFR-S02**: No new environment key is forwarded to the daemon.

### Reliability
- **NFR-R01**: The idle timeout still fires: no new code marks IPC activity.
- **NFR-R02**: A missing or unreadable heartbeat file before the first write never kills the child.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a prompt with no skill vectors at weight 0 skips the embed, the same as any other prompt.
- Maximum input: a startup scan longer than 3 minutes is safe, because the watchdog waits for the first heartbeat.
- Failure path: a SIGKILLed launcher leaves the server to notice the parent change within 30 s, run `shutdownAdvisor` and exit 0.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | Eight source files, their tests and the docs |
| Risk | 12/25 | Default routing confidence and daemon lifecycle |
| Research | 4/20 | Done in phase 017 and the Opus read |
| **Total** | **30/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None. The operator chose guard plus weight 0, the heartbeat watchdog in place of a socket ping, and version 1.2.0.0.
<!-- /ANCHOR:questions -->

---
