---
title: "Research Phase: Pi Reasonix-Style Caching — Claim Verification + Gap Scoping"
description: "Three-executor deep research (GPT-5.6 SOL high fast, GPT-5.6 TERRA max fast, GPT-5.6 LUNA max fast — all via cli-codex) over 20 non-converging iterations that verify the lumo.md caching claims about Reasonix and Pi, establish Pi's true caching surface (including whether pi-cache-optimizer exists), and scope the real feature gap and feasibility of a Reasonix-style Pi plugin. No early convergence: all 20 iterations run regardless of agreement."
trigger_phrases:
  - "pi caching research"
  - "reasonix claim verification"
  - "pi cache gap scoping"
  - "deepseek prefix cache research"
  - "pi-cache-optimizer verify"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/039-pi-caching-like-reasonix/001-research"
    last_updated_at: "2026-08-06T11:48:24Z"
    last_updated_by: "spec-author"
    recent_action: "Research complete: 60 iterations, research.md merged"
    next_safe_action: "Hand verified findings to 002 for the Go/No-Go decision"
    blockers: []
    key_files:
      - "spec.md"
      - "research/research.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-06-cli-039-research"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Iteration distribution resolved: 3 independent lineages x 20 iterations = 60 dispatches."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Research Phase: Pi Reasonix-Style Caching — Claim Verification + Gap Scoping

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-08-06 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 1 of N |
| **Predecessor** | None |
| **Successor** | 002-synthesis-and-decision |
| **Handoff Criteria** | Every lumo.md claim marked verified/refuted/unknown with a source; all 20 iterations logged across three executors; synthesis answers RQ1–RQ4 with citations |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`lumo.md` asserts specific, uncited figures — Reasonix at a ~99.8% cache-hit rate, a ~$61→$12 single-day cost drop, DeepSeek-native prefix caching — and describes Pi as provider-agnostic with a `pi-cache-optimizer` extension and a list of "missing in Pi" features (Context Engine v2, MCP first-class support, plan mode, checkpoints & rewind). None of it is verified. `pi-cache-optimizer` appears nowhere in this repo, and the cli-pi skill carries no caching references. A build decision cannot rest on that.

### Purpose
Establish ground truth. For each load-bearing `lumo.md` claim, produce a verified / refuted / unknown verdict with a primary-source citation, determine Pi's actual caching surface, and scope the genuine gap and feasibility of a Reasonix-style Pi caching plugin — enough for Phase 2 to make a Go/No-Go call.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Read `lumo.md`, the cli-pi skill, any Pi docs (e.g. `docs/rpc.md`, extension/caching docs), Reasonix docs, DeepSeek prefix-cache API docs, and Anthropic `cache_control` references
- Ground Pi/Reasonix identity against the local Open Design daemon agent registry (`reasonixAgentDef`, `piAgentDef`) already confirmed present
- 20 research iterations, each fanning out to all three executors (fresh context per dispatch), logged per iteration
- Synthesis after all iterations finish (no early convergence)

### Out of Scope
- Implementing or prototyping any caching layer, plugin, or extension
- Modifying Pi, Reasonix, cli-pi, or runtime code
- Deciding GO/NO-GO (that is Phase 2's job; this phase supplies the evidence)

### Files to Change (research artifacts only)

> The deep-research runtime owns and writes everything under `001-research/research/` (the artifact root is fixed by `resolveArtifactRoot(spec_folder, 'research')`). This phase writes nothing outside `research/` and `scratch/`.

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `001-research/research/lineages/{sol-high,terra-max,luna-max}/iterations/iteration-NNN.md` | Create | Per-iteration cited findings, one lineage per executor |
| `001-research/research/deep-research-state.jsonl` | Create | Append-only iteration deltas (newInfoRatio, status, focus) |
| `001-research/research/research.md` | Create | Canonical synthesis: claim verification, gap table, feasibility/cost-benefit |
| `001-research/research/deep-research-{config.json,strategy.md,dashboard.md}` + `findings-registry.json` | Create | Runtime-owned config, strategy, dashboard, and findings registry |
| `001-research/scratch/` | Create | Optional working notes |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Run three independent cli-codex lineages — GPT-5.6 SOL (high, fast), GPT-5.6 TERRA (max, fast), GPT-5.6 LUNA (max, fast) — at 20 iterations each (≈60 dispatches) | `research/lineages/{sol-high,terra-max,luna-max}/iterations/` each hold 20 iteration files with cited findings |
| REQ-002 | No early convergence: `--stop-policy=max-iterations` forces every lineage to run its full 20 iterations regardless of agreement | Each lineage's `deep-research-state.jsonl` shows 20 iterations; stop reason is `maxIterationsReached`, not converged |
| REQ-003 | RQ1 — verify the Reasonix caching claims (99.8% hit rate, $61→$12 cost delta, DeepSeek prefix-cache coupling, "cache-first by design") | `research/research.md` marks each Reasonix claim verified/refuted/unknown with a primary source |
| REQ-004 | RQ2 — establish Pi's real caching surface: native `cache_control`/provider-agnostic support and whether `pi-cache-optimizer` actually exists and what it does | `research/research.md` records the Pi caching surface with sources; `pi-cache-optimizer` existence explicitly confirmed or refuted |
| REQ-005 | RQ3 — for every lumo.md "missing in Pi" feature, classify real-gap vs already-covered vs unknown | `research/research.md` gap table covers Context Engine v2, MCP first-class, plan mode, checkpoints & rewind, cost-control runtime, logging/monitoring, recovery/updates |
| REQ-006 | RQ4 — assess feasibility, complexity, and DeepSeek-API limits of a Reasonix-style Pi plugin, with cost/benefit inputs for the Go/No-Go | `research/research.md` states feasibility verdict + effort estimate + key risks with evidence |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | Capture executor disagreement rather than averaging it away | `research/research.md` notes where SOL/TERRA/LUNA lineages diverged and why |
| REQ-008 | Record every source's reliability (primary doc vs blog vs model assertion) | `research/research.md` tags each citation with source class |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All three lineages logged 20 iterations each (≈60 total); no lineage truncated by early convergence
- **SC-002**: Every load-bearing lumo.md claim has a verified/refuted/unknown verdict with a cited source in `research/research.md`
- **SC-003**: `research/research.md` answers RQ1–RQ4 with citations and hands Phase 2 a clear feasibility + cost/benefit picture
- **SC-004**: Packet validates: `validate.sh --strict` on this folder exits 0
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | cli-codex functional + GPT-5.6 SOL/TERRA/LUNA routes enabled | No track can run | Preload cli-codex SKILL.md (dispatch rule); verify routes before iteration 1 |
| Dependency | Reasonix + DeepSeek primary docs reachable | RQ1 stays "unknown" | Fall back to web sources; tag reliability; mark unknown honestly |
| Risk | External CLI runs are slow (60 dispatches) | Long wall-clock | Async fan-out; checkpoint-log each iteration |
| Risk | Executors echo lumo.md instead of verifying it | False confirmation | Require a primary source per claim; refute-by-default when uncitable |
| Risk | `pi-cache-optimizer` is unfindable | RQ2 partial | Explicitly record "not found" as a refutation, not a skip |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Each dispatch is one focused pass; no unbounded re-reading
- **NFR-P02**: Iteration logs written after each iteration, not batched at the end

### Security
- **NFR-S01**: No repo files modified outside `research/` and `scratch/` (the deep-research runtime owns `research/`)

### Reliability
- **NFR-R01**: Every dispatch records executor id, effort, route, iteration number
- **NFR-R02**: Failed/blocked executor runs reported honestly, not silently skipped
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Reasonix docs unreachable: RQ1 claims marked "unknown" with the search attempts recorded, not guessed
- `pi-cache-optimizer` not found in any registry/index: recorded as refuted with the searched locations listed

### Error Scenarios
- cli-codex hangs on a dispatch: timeout, log partial, continue remaining executors
- One executor route disabled: that track logged as failed; verdicts derive from remaining executors + explicit gap note

### State Transitions
- Partial completion: phase stays In Progress until all 20 iterations + the claims ledger + synthesis exist
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 13/25 | Evidence-only; three executors, 20 iterations |
| Risk | 9/25 | External CLI dependency; unverifiable external claims |
| Research | 19/20 | The research itself is the deliverable |
| **Total** | **41/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- 20 iterations = 20 fan-out cycles (60 dispatches) or 20 dispatches split across executors? Authored as fan-out; confirm on review.
- Is "TERRA" a distinct GPT-5.6 persona routable via cli-codex alongside SOL/LUNA, and are all three enabled in `settings.json`?
- Are Reasonix's caching figures published anywhere primary, or only in secondary/marketing sources?
<!-- /ANCHOR:questions -->
