---
title: "Feature Specification: Phase 1 — Headroom Utilization Research"
description: "Run a 20-iteration GPT-5.5-xhigh deep-research pass over the vendored Headroom repo and our own stack to decide whether, where, and how Headroom's context-compression surfaces can be utilized with spec-kit memory, skill-advisor, code-graph, deep-loop, and the cli-* / runtime executors."
trigger_phrases:
  - "headroom utilization research"
  - "headroom integration research"
  - "029 research headroom"
  - "headroom compatibility deep research"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/029-headroom-utilization/001-research"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Completed round 2 (iters 9-20) and proved the perfect-fit integration"
    next_safe_action: "Human review; optionally open a 002 live-benchmark phase"
    blockers: []
    key_files:
      - "research/research.md"
      - "research/lineages/gpt55xhigh-perfectfit/research.md"
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-28-029-001-research"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "20 iterations total: all 8 charter questions answered (round 1) plus a proven perfect-fit integration (round 2)."
      - "Perfect fit: guarded offline compress() over copied non-authoritative bundles as a sibling artifact; CacheAligner detector-only optional; do NOT adopt proxy/wrap/output-shaper/learn/cross-agent-memory into core."
      - "One open gate: a live (non-estimated) Headroom benchmark, deferred to a 002 phase."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 1 — Headroom Utilization Research

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete (converged 8/20 iters; recommendation pending human review) |
| **Created** | 2026-06-28 |
| **Branch** | `system-speckit/154-design-context-loading` |
| **Parent Spec** | ../spec.md |
| **Phase** | 1 of 1 (research gate) |
| **Predecessor** | None |
| **Successor** | A `002-*` adoption phase, opened only if findings recommend it |
| **Handoff Criteria** | `research/research.md` produced with cited findings; integration-fit matrix + risk register + ranked recommendation exist for human review |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is the **research gate** for packet 029. It runs a 20-iteration deep-research pass (GPT-5.5 at `xhigh` reasoning, `fast` service tier, via the `cli-codex` executor through `/deep:research`) over two bodies of evidence that sit side by side in this repo: the **vendored Headroom project** at `../external/` and **our own AI stack** under `.opencode/`. The question is concrete: *which Headroom surfaces could we actually utilize, and do they integrate cleanly with our subsystems — or collide with our determinism, prompt-cache, structured-metadata-fidelity, and constitutional-gate assumptions?*

**Scope Boundary**: Run and synthesize the deep-research pass only. Nothing is installed, wrapped, proxied, or wired. **No Headroom code is touched in this phase.**

**Dependencies**:
- The vendored corpus at `../external/` (full Headroom source, `wiki/`, `docs/`, `benchmarks/`, `tests/`, `plugins/opencode`, `headroom/mcp_registry`, `headroom/memory`, `headroom/proxy`, etc.).
- Our own stack under `.opencode/` (`system-spec-kit` Memory MCP + scripts, `system-skill-advisor`, `system-code-graph`, `deep-loop-workflows` / `deep-loop-runtime`, the `cli-codex` / `cli-claude-code` / `cli-opencode` executors, and the hook system).
- The deep-research loop engine (`/deep:research`, `deep-loop-runtime`, `fanout-run.cjs`) and the `cli-codex` executor (GPT-5.5, `xhigh`, `fast`).

**Deliverables**:
- `research/research.md` — merged, cited synthesis across all iterations.
- An **integration-fit matrix**: Headroom surface × our subsystem → {fits / conflicts / needs-shim / irrelevant} with evidence.
- A **risk register** (cache, determinism, metadata fidelity, telemetry/privacy, licensing, constitutional gates).
- A **ranked adoption recommendation** (which surface first, or "do not adopt", with the reasoning).
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Headroom promises 60–95% token reduction on agent context without changing application code, plus cross-agent memory and failure-learning. Those are attractive against our token-heavy workflows (deep-loop fan-outs, code-graph dumps, advisor briefs, spec-doc reads). But our stack has hard invariants Headroom was not designed around: deterministic strict validation over structured JSON (`description.json`, `graph-metadata.json`), append-only continuity state, prompt-cache-sensitive hook injection, a constitutional system prompt whose immutability we depend on, and a Memory MCP that already owns continuity. Adopting compression blindly could corrupt metadata, bust caches, or fight our own memory layer. We need evidence before deciding, not vibes.

### Purpose
Produce a decision-ready, cited answer to *how (if at all) we should utilize Headroom* — which surfaces, against which subsystems, with which guardrails — so a later phase can either adopt a specific surface deliberately or close 029 as "researched, not adopted."
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Read and map the vendored Headroom surfaces from `../external/` (library `compress()`, OpenAI/Anthropic proxy, MCP server, `headroom wrap`, `headroom learn`, bundled RTK, CacheAligner, output-shaper, cross-agent memory, `plugins/opencode`).
- Map each surface against our subsystems and runtimes for integration fit, with file-cited evidence on both sides.
- Identify conflicts/risks (cache, determinism, structured-metadata fidelity, telemetry/privacy, licensing, constitutional gates) and possible shims.
- Produce `research/research.md`, the integration-fit matrix, the risk register, and a ranked recommendation.

### Out of Scope
- Any installation, wrapping, proxying, or wiring of Headroom (owned by a later `002-*` phase if approved).
- Editing the vendored `../external/` upstream sources.
- Building any shim/adapter (recommended only, not built here).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `research/deep-research-config.json` | Create | cli-codex executor config (gpt-5.5, xhigh, fast; max 20 iters) |
| `research/deep-research-strategy.md` | Create | Charter: key questions, non-goals, stop conditions, next focus |
| `research/deep-research-state.jsonl` | Create | Append-only iteration state log |
| `research/iterations/iteration-*.md` | Create | Per-iteration findings (loop-generated) |
| `research/research.md` | Create | Merged, cited synthesis (loop-generated) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Run the deep-research loop to convergence or the 20-iteration cap with the GPT-5.5 cli-codex executor | `research/deep-research-state.jsonl` shows iterations with a terminal `stopReason` (`converged` or `maxIterationsReached`) |
| REQ-002 | Merged synthesis produced | `research/research.md` exists with cross-iteration findings and `[SOURCE: file:line]` / `[SOURCE: url]` citations |
| REQ-003 | Integration-fit matrix produced | Each Headroom surface is mapped against each target subsystem with an explicit verdict + evidence |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Risk register produced | Cache, determinism, metadata-fidelity, telemetry/privacy, licensing, and constitutional-gate risks each have an entry with impact + mitigation |
| REQ-005 | Ranked adoption recommendation | A primary recommended surface (or an explicit "do not adopt") with reasoning and the next concrete step |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `research/research.md` consolidates all iterations with citations to both `../external/` and our `.opencode/` stack.
- **SC-002**: Every Key Research Question (§7) is answered or explicitly marked unresolved with the reason.
- **SC-003**: The recommendation is decision-ready — a human can pick "adopt surface X with guardrails Y" or "do not adopt" from it without re-reading the loop.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | 20 iters × GPT-5.5 xhigh codex subprocesses | Multi-hour, real API/quota cost | Attended start; background run; convergence can stop early |
| Risk | codex authed via ChatGPT OAuth, no API key | Loop fails if OAuth lacks gpt-5.5 | Confirm auth before launch; 1-iteration smoke check |
| Risk | Compression near structured JSON metadata | Could corrupt `description.json` / `graph-metadata.json` | Research must explicitly test this boundary; recommend exclusions |
| Risk | CacheAligner vs our prompt-cache / hook injection | Cache busts, higher cost not lower | First-class research question, not an afterthought |
| Risk | Findings plausible but unverified | Wrong adoption decision | Citations required; confirmed-vs-inferred discipline |
| Dependency | `cli-codex` (GPT-5.5) availability | Loop cannot run | Verified installed + OAuth-logged-in before launch |
| Dependency | Vendored `../external/` corpus | No subject to research | Present (full repo vendored) |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

These **key research questions** seed the loop's strategy and must each be answered or explicitly marked unresolved:

1. **Surface inventory** — What exactly are Headroom's utilizable surfaces (library `compress()`, OpenAI/Anthropic proxy, MCP server, `headroom wrap opencode|claude|codex`, `headroom learn`, bundled RTK, CacheAligner, output-shaper, cross-agent SQLite+HNSW memory, `plugins/opencode`), and what does each require to run?
2. **Runtime fit** — Can `headroom wrap opencode` / `claude` / `codex` (or the proxy) sit in front of our Claude/Codex/OpenCode sessions and our `cli-*` executors without breaking them? Does the bundled RTK help our Bash-heavy tooling?
3. **spec-kit Memory MCP** — Does Headroom's per-project memory complement or collide with our SQLite + embeddings continuity store? Does proxy/library compression risk corrupting the structured JSON (`description.json`, `graph-metadata.json`) our deterministic validation depends on?
4. **skill-advisor** — Does proxy compression / verbosity-steering preserve the advisor hook briefs and skill-routing context (UserPromptSubmit / SessionStart injection), or does it degrade routing accuracy? Where are the token savings?
5. **code-graph** — Can Headroom safely compress `code_graph_query` / `code_graph_context` outputs and structural context, and how much is saved?
6. **deep-loop + hooks** — Does CacheAligner conflict with our prompt-cache assumptions and hook-injected prefixes? Does the output-shaper's system-prompt append conflict with our constitutional gates / system-prompt immutability?
7. **Risks & guardrails** — CCR reversibility vs our deterministic gates; telemetry/privacy (`HEADROOM_TELEMETRY`); Apache-2.0 licensing; the local-process requirement; compression fidelity on spec docs.
8. **Recommendation** — Which surface (if any) should we adopt first, via which mode (proxy-wrap vs MCP-tool vs library), and with which guardrails? Or is the honest answer "do not adopt"?

### Non-Goals (charter)
- Installing, wrapping, proxying, or wiring Headroom anywhere in the live stack.
- Editing the vendored `../external/` upstream.
- Building any shim/adapter (recommend only).

### Stop Conditions (charter)
- `newInfoRatio` sustained below the convergence threshold, OR
- 20 iterations reached, OR
- All eight Key Research Questions answered with cited evidence and a ranked recommendation written.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Parent**: `../spec.md`
- **Vendored subject**: `../external/` (Headroom upstream — `README.md`, `llms.txt`, `wiki/`, `docs/`)
- **Loop artifacts**: `research/research.md`, `research/deep-research-state.jsonl`
