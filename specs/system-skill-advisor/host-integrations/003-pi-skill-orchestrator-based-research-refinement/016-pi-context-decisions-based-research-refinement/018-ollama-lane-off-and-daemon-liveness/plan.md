---
title: "Implementation Plan: Phase 18: ollama-lane-off-and-daemon-liveness"
description: "A zero-weight guard keeps the prompt embed off the advisor's path, and the lane's default weight drops to 0 with an env re-enable. The server exits when its launcher dies, and the launcher reaps a server whose heartbeat stops. Luna builds each change as a leaf behind a test that fails first."
trigger_phrases:
  - "ollama lane off and daemon liveness plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 18: ollama-lane-off-and-daemon-liveness

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript advisor runtime, CommonJS launcher |
| **Framework** | None: Node daemon behind `.skilled/bin/system-skill-advisor-launcher.cjs` |
| **Storage** | Skill-graph SQLite; one new heartbeat file in the advisor database directory |
| **Testing** | Vitest (runtime and bin configs), the Python scorer suite, the spec-kit launcher and embedder suites |

### Overview
`withSemanticShadowPromptEmbedding` returns `run()` at once when the resolved `semantic_shadow` weight is 0, ahead of its test-only bypass, so a test can see the skipped embed. The registry default drops to 0, and the four other weights stay as they are. Fusion already divides by the live total, so they need no renormalizing. The server compares `process.ppid` with the value it started with. It also touches a heartbeat file that the launcher's watchdog reads, and nothing new sends an IPC frame, so the idle timer still fires.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] `npx vitest run` in the advisor runtime prints `Tests  N passed` with no failure, and the bin, Python and spec-kit suites match their baselines or name each moved pin
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Guard clauses and timers inside the existing daemon and launcher. One new module, `lib/daemon/liveness.ts`, holds the server's two timers. It takes its timers and file writes as arguments, like `lib/ipc/launcher-idle-timeout.ts`, so a test can drive them without starting the daemon.

### Key Components
- **Zero-weight guard** (`semantic-shadow.ts`): reads `DEFAULT_SCORER_LANE_WEIGHTS.semantic_shadow`, the env-resolved weight, and skips the embed at 0 with `disabledReason: 'lane_weight_zero'`.
- **Parent-death check** (`advisor-server.ts`): a 30 s unref'd interval that runs `shutdownAdvisor` and exits 0 when `process.ppid` changes.
- **Heartbeat** (`advisor-server.ts` writer, launcher watchdog): the server rewrites `advisor-server.heartbeat` in its database directory every 15 s. Once the file has appeared, the launcher checks it every 60 s and stops a child whose file is older than 3 minutes.

### Data Flow
Prompt, then recommend, then the guard reads the weight: 0 scores lexically with no Ollama call. Above 0 it embeds as before. Server timer, then the heartbeat file, then the launcher watchdog's age check, then SIGTERM and SIGKILL, then the existing child exit handler clears the leases.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `semantic-shadow.ts` embed wrapper | Embeds every scored prompt | Update: guard at weight 0 | New test with `VITEST` stubbed off counts embed calls |
| `advisor-status.ts`, `advisor-recommend.ts` | Report the lane's state | Update: `lane_weight_zero`, no warning | Status and warning tests |
| `shared/embeddings` cascade | Pointer resolution, sk-doc validator, spec-kit tests | Unchanged | `git diff --stat -- .skilled/skills/system-spec-kit/shared` prints nothing |
| Hooks and plugins | Read recommend output | Not a consumer: no hook reads `semantic_lane_off` | `rg -n semantic_lane_off .skilled --glob '!**/dist/**'` lists only the handler and its test |
| Launcher child env | Allowlist to the daemon | Unchanged: no new key | `git diff` of `CHILD_ENV_ALLOWLIST` is empty |

Matrix axes for the guard: the weight (default 0, env 0.05) times the embedder (present, absent). Four rows: no embed, no embed, one embed, the existing absent-embedder reason.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup records the baselines and the labeled-corpus none-gold fire count from main. Implementation lands the guard, the weight, the cleanup and the liveness code as Luna leaves, each behind a test that fails first. Verification reruns every suite, recounts the none-gold fires, re-baselines moved pins and merges after a daemon restart check. Ordered work is in `tasks.md`.

### Re-enable checklist (not built here)
Before the default weight goes above 0 again:
1. Full skill and command vector coverage, and the lane refuses to score below it.
2. An Ollama outage marks the lane degraded, so it leaves the live total.
3. `OLLAMA_BASE_URL` and `OLLAMA_REQUEST_TIMEOUT_MS` reach the daemon.
4. A fresh real-embedding ablation on the current corpus clears a pass bar written in advance: a net gain and no new none-gold fire.
5. A trial through `SPECKIT_ADVISOR_LANE_WEIGHTS_JSON` before the default changes.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Guard, status reason, pointer resolution, hf default, parent check, watchdog age logic | Vitest |
| Integration | Full advisor runtime suite, parity and divergence ratchets, spec-kit launcher and embedder suites | Vitest, `test_skill_advisor.py` |
| Manual | Daemon restart on main, then the parent goal's routing probe | `skill-advisor.cjs advisor_recommend` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Luna through cli-codex | External | Green | Stop and ask; fallback is Vibe DeepSeek V4.1 Flash `max` |
| Baselines from main at `62a9359e60a` | Internal | Green | No regression delta to report |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: new none-gold fires at weight 0, or a watchdog that kills a healthy daemon.
- **Procedure**: for the weight, restore `defaultWeight: 0.05` in `lane-registry.ts` and keep the guard. For the rest, revert the merge commit on main.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Worktree 479 | Implementation |
| Implementation | Baselines and the none-gold count | Verification |
| Verification | Every leaf green | Merge and push |
<!-- /ANCHOR:phase-deps -->

---
