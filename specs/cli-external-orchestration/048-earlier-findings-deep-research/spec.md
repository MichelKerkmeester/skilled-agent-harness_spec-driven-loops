---
title: "Feature Specification: Deep research on the sk-vision host-adapter findings"
description: "Run 10 forced-depth iterations of deep research over the five sk-vision host-adapter findings, via cli-pi DeepSeek V4 Flash latest (OpenRouter, max thinking)."
trigger_phrases:
  - "sk-vision findings deep research"
  - "cli-pi deepseek flash openrouter research run"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "specs/cli-external-orchestration/048-earlier-findings-deep-research"
    last_updated_at: "2026-08-17T19:45:00.000Z"
    last_updated_by: "claude"
    recent_action: "Ran the 10-iter cli-pi research; research.md synthesizes all five findings."
    next_safe_action: "Commit the packet on v4."
    blockers: []
    key_files:
      - "specs/cli-external-orchestration/048-earlier-findings-deep-research/spec.md"
      - "specs/cli-external-orchestration/048-earlier-findings-deep-research/resource-map.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "cli-ext-048-findings-deep-research"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Deep research on the sk-vision host-adapter findings

<!-- SPECKIT_LEVEL: 1 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | In Progress |
| **Created** | 2026-08-17 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `specs/cli-external-orchestration` |
| **Predecessor** | `047-cli-pi-opencode-openrouter-roster` |
| **Successor** | N/A |
| **Handoff Criteria** | A 10-iteration cli-pi research fan-out completes over the five findings; artifacts land under `research/`; `research.md` synthesis exists. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Running the sk-vision manual-testing-playbook across Cursor and Devin surfaced five host-adapter findings (Cursor MCP approval, Devin `dangerous`-only MCP, moondream2 text truncation, Cursor `.mcp.json` chain, base64 padding + `settings` passthrough). They were recorded but not root-caused or turned into durable fixes.

### Purpose
Investigate all five in depth with a forced-depth (exactly 10 iterations, no early convergence) deep-research loop, using the newly-added OpenRouter DeepSeek V4 Flash latest model on cli-pi at max thinking, so each finding gets a root cause + a bug/expected classification + a proposed fix.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Seed the corpus as `resource-map.md` + the research-topic string (the five findings).
- Launch a `cli-pi` fan-out research loop (model `deepseek/deepseek-v4-flash-latest`, provider OpenRouter, `--thinking max`), 10 iterations, `--stop-policy=max-iterations`.
- Collect artifacts under `research/` and the final `research.md` synthesis.

### Out of Scope
- Implementing the fixes the research recommends (a follow-on packet).
- Any change to the runtime (Packets 047 + 040 already landed the roster + wiring).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `specs/cli-external-orchestration/048-earlier-findings-deep-research/resource-map.md` | Create | The five-finding research corpus |
| `specs/cli-external-orchestration/048-earlier-findings-deep-research/research/**` | Create | Loop artifacts (state, deltas, iterations, `research.md`) |

### Verification evidence
- Live sanity dispatch confirmed OpenRouter routing: `pi -p --model openrouter/deepseek/deepseek-v4-flash-latest --thinking max` returned `READY`.
- Run launched with `--stop-policy=max-iterations` + `iterations:10` via the forced-depth path landed in Packet 040.
- Completion: exactly 10 `research/lineages/*/iterations/iteration-*.md` files; `research/research.md` present.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | cli-pi OpenRouter dispatch works | Live `pi -p` probe returned `READY` |
| REQ-002 | Forced-depth run of 10 | `--stop-policy=max-iterations` + `iterations:10`; 10 iteration files land |
| REQ-003 | Corpus seeded | `resource-map.md` names all five findings |
| REQ-004 | Synthesis produced | `research/research.md` exists on completion |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-P1 | Per-finding root cause | Synthesis addresses each of the five findings |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- [x] cli-pi OpenRouter dispatch verified. Evidence: `pi -p` probe returned `READY`.
- [x] Corpus seeded. Evidence: `resource-map.md` with five findings.
- [x] 10 iterations complete. Evidence: 10 `iteration-*.md` under `lineages/pi-flash-or/iterations`.
- [x] `research.md` synthesis exists. Evidence: `research.md` 197 lines, §5.1-5.5 cover all five findings.
- [ ] Changes committed on v4. Evidence: pending the commit.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | OpenRouter quota/latency over 10 iters | Run stalls or partial | `--executor-timeout 900` per lineage; forced-depth validator flags a short run |
| Dependency | Packet 047 roster + Packet 040 wiring | Run cannot dispatch or force depth | Both landed + validated before this run |
| Dependency | OpenRouter auth in pi | Dispatch fails | Confirmed in `~/.pi/agent/auth.json` |
<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

### Answered Questions
- **Q**: Command path or direct runtime? **A**: The forced-depth wiring (Packet 040) now forwards `--stop-policy`, so the research fan-out runs with a real forced-10 guarantee.
- **Q**: What is the corpus? **A**: The five sk-vision host-adapter findings from this session, seeded via `resource-map.md` + the topic string.

### Open Questions
- None.
<!-- /ANCHOR:questions -->
