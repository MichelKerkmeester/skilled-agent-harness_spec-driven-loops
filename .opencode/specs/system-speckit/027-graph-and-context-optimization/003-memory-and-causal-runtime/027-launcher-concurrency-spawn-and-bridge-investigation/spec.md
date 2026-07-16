---
title: "Feature Specification: Launcher Concurrency Spawn & Bridge Investigation (deep-research)"
description: "Read-only deep-research investigation of two launcher/MCP/embedder runtime root causes: T1 hf-local model server spurious spawn via a boot-time liveness probe treated as an embed demand; T2 mk_code_index + mk_skill_advisor secondary-session disconnect because packet 012's daemon IPC bridge socket is not serving at runtime."
trigger_phrases:
  - "launcher concurrency spawn bridge investigation"
  - "hf-local spurious spawn probe demand"
  - "code-index advisor daemon bridge not serving"
  - "lease held by no bridge socket runtime"
  - "deep research launcher concurrency"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/027-launcher-concurrency-spawn-and-bridge-investigation"
    last_updated_at: "2026-06-04T17:40:59Z"
    last_updated_by: "main_agent"
    recent_action: "Deep-research session initialized (read-only); strategy + state seeded"
    next_safe_action: "Run deep-research iterations 1-5 to validate/refine T1 + T2 root causes"
    blockers: []
    key_files:
      - ".opencode/bin/lib/model-server-supervision.cjs"
      - ".opencode/bin/lib/launcher-ipc-bridge.cjs"
      - ".opencode/skills/system-skill-advisor/mcp_server/advisor-server.ts"
      - ".opencode/skills/system-skill-advisor/mcp_server/lib/ipc/socket-server.ts"
      - ".opencode/skills/system-code-graph/mcp_server/index.ts"
---
# Feature Specification: Launcher Concurrency Spawn & Bridge Investigation (deep-research)

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

Read-only deep-research packet investigating two root causes in the spec-kit launcher-coordination layer, both surfaced by the owner's heavy concurrent-session workflow. Canonical research output lives in `research/research.md`; this `spec.md` records the investigation ask, scope, and open questions.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Research (read-only) |
| **Created** | 2026-06-04 |
| **Branch** | `main` |
| **Parent Arc** | 003-memory-and-causal-runtime |
| **Related** | 006-mcp-launcher-concurrency (010-multi-client-stdio-socket-bridge, 012-daemon-bridge-socket-for-skill-advisor-and-code-index, 007-skill-advisor-zombie-launcher-fix) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Under concurrent multi-session use (currently 2 Claude + 4 codex sessions sharing this repo), two runtime defects appear:

- **T1 — hf-local model server spurious spawn.** On an Ollama host where hf-local should stay cold (ADR-014), the broken-on-this-host model server is spawned at startup, crash-loops 3×, and writes a give-up marker. Static analysis points to a boot-time launcher liveness probe (`GET /api/health`) that the cold-state demand listener treats as an embed demand and `launch()`es — independent of embedder pointers (both held valid Ollama pointers at the observed give-up).
- **T2 — mk_code_index + mk_skill_advisor disconnect for secondary sessions.** Packet 012 built a daemon IPC bridge socket so secondary launchers attach instead of exiting `LEASE_HELD_BY:<pid> (no-bridge-socket)`. Live `lsof` shows the bridge is NOT serving on the code-index/advisor `daemon-ipc.sock` (while spec-memory's IS), so secondaries wedge and the MCP host reports the servers as disconnected.

### Purpose

Validate, refute, or refine both root-cause hypotheses against the original design intent (ADR-013→014; the 006-mcp-launcher-concurrency arc) and the live runtime evidence, then produce a single unified design-conformance fix plan. No code is changed in this packet.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

<!-- DR-SEED:SCOPE -->

### In Scope

- Read-only source + spec + runtime-state investigation of T1 (model-server demand listener / probe) and T2 (daemon IPC bridge serving under concurrency).
- Reconciliation with the 006-mcp-launcher-concurrency design history (esp. packets 010, 012, 007) and ADR-013→014 embedder design.
- A unified, evidence-grounded design-conformance fix plan (proposal only).

### Out of Scope

- Any code/config mutation (this is a read-only research packet).
- Fixing the `onnxruntime-common` topology break (orthogonal; non-Ollama hosts only).
- Scanning/building the code graph (intentionally empty here).
- Connecting to `hf-embed.sock` (a request triggers the very spawn under study).
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

<!-- DR-SEED:REQUIREMENTS -->

### P1 - Required (research deliverables)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Validate/refute T1 spawn trigger | Confirm whether a cold-state `GET /api/health` probe causes a spawn; identify the confirming runtime signal; state confidence |
| REQ-002 | Determine the T1 fix conformance constraint | Establish whether `HfLocalProvider`'s real embed path relies on `GET /api/health` to wake the server (decides whether the wake must move to a real embed POST) |
| REQ-003 | Root-cause T2 runtime bind-failure | Explain why packet 012's daemon bridge socket is not serving at runtime for code-index/advisor (regression / conditional gate / silent bind failure / EADDRINUSE-unlink race), grounded in `socket-server.ts` + the daemon servers |
| REQ-004 | Produce unified design-conformance fix plan | Single plan covering T1 (probe ≠ embed-demand) and T2 (restore 012 bridge serving) with confidence and the minimal fix surface |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Both root causes are validated or refined with explicit confidence levels and code/runtime evidence.
- **SC-002**: T2's runtime bind-failure is classified against packet 012's intended behavior (REQ-002 of 012: socket file + `[ipc-bridge] socket listening` log).
- **SC-003**: A unified design-conformance fix plan is recorded in `research/research.md` (proposal only; no code changed).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Live runtime state shifts mid-investigation (sessions start/stop) | Evidence drift | Capture timestamped snapshots; treat `lsof`/`ps` as point-in-time |
| Risk | Probing `hf-embed.sock` to "verify" T1 would trigger the spawn | Self-inflicted defect | Hard constraint: never connect to the socket; rely on code + existing markers |
| Dependency | Packet 012 / 010 design docs + `socket-server.ts` | Required for T2 reconciliation | Read as primary grounding |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- T1: Does the cold-state demand listener spawn on any HTTP request including `GET /api/health`, and is that the actual 15:21 trigger under launcher overlap?
- T2: Why is packet 012's daemon IPC bridge socket not serving at runtime for code-index and skill-advisor despite the implementation existing?
- Cross-cutting: Are T1 and T2 both consequences of launcher-overlap concurrency, and is there a single minimal fix surface?
<!-- /ANCHOR:questions -->
