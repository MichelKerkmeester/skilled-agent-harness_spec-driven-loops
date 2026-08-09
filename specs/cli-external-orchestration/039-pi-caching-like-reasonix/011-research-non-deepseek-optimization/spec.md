---
title: "Feature Specification: Non-DeepSeek Optimization Research [specs/cli-external-orchestration/039-pi-caching-like-reasonix/011-research-non-deepseek-optimization]"
description: "Read-only deep-research audit of pi-cache-optimizer's non-DeepSeek code path for further optimization opportunities in correctness, cache-hit-rate economics, provider coverage, and maintainability."
trigger_phrases:
  - "pi-cache-optimizer non-deepseek optimization"
  - "prompt cache key self-heal"
  - "provider coverage matrix"
  - "cache-hit-rate economics"
importance_tier: "normal"
contextType: "specification"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/039-pi-caching-like-reasonix/011-research-non-deepseek-optimization"
    last_updated_at: "2026-08-09T08:39:07Z"
    last_updated_by: "deepseek-v4-flash"
    recent_action: "Completed 10-iter forced-depth research on pi-cache-optimizer non-DeepSeek surface"
    next_safe_action: "Operator authorizes a P0/P1 implementation follow-up, or packet stays research-only"
    blockers: []
    key_files:
      - ".pi/extensions/pi-cache-optimizer/index.ts"
      - "research/lineages/deepseek-flash/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "close-011-non-deepseek-research"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Do opencode/opencode-go register router adapters at runtime, changing their stats to virtual-routing semantics? (runtime-dependent, unobservable statically)"
      - "Which findings the operator authorizes for implementation, and in what order (P0 before P1 before P2)."
    answered_questions:
      - "15 findings (K1-K15), priority-ranked P0-P3, each with file:line citations against index.ts"
---
# Feature Specification: Non-DeepSeek Optimization Research

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-08-09 |
| **Branch** | `skilled/v4.0.0.0` |
| **Predecessor** | 010-doc-template-and-code-readme-alignment |
| **Successor** | 012-implement-non-deepseek-fixes |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Packet 039's fork work guards `pi-cache-optimizer`'s two mutation hooks against DeepSeek-matched models, leaving deep-pi as the exclusive DeepSeek-direct extension. No focused review has been done of what remains: `pi-cache-optimizer`'s behavior for every other provider (OpenAI-compatible proxies, Anthropic, Gemini, GLM, MiniMax, Xiaomi/mimo, Qwen, and two DeepSeek-class models the guard explicitly excludes). The fork was last touched to add the guard only.

### Purpose
Run a forced-depth (10-iteration) read-only research loop over `.pi/extensions/pi-cache-optimizer/index.ts` and its test suite to surface concrete, evidence-based optimization opportunities in correctness, cache-hit-rate economics, provider coverage, and maintainability, so a follow-up implementation phase can act on a ranked, cited findings list rather than starting from scratch.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Read-only research of `pi-cache-optimizer/index.ts` (9,239 lines), its 3-suite test file, `.pi/settings.json`'s enabled-model list, `CHANGES-FROM-UPSTREAM.md`, and the shared `deepseek-ownership.json` fixture.
- A priority-ranked findings list (P0-P3) with `file:line` citations, a provider coverage matrix, a test-coverage-gap analysis, eliminated alternatives (negative knowledge), and a convergence report.
- Correcting the session's own premise where evidence contradicts it (the fork's active surface is not exclusively non-DeepSeek — two enabled DeepSeek-class models are explicitly excluded from deep-pi's ownership boundary).

### Out of Scope
- Any edit to `pi-cache-optimizer/index.ts` or its tests during the research loop — implementation is a separate follow-up decision.
- Re-litigating the DeepSeek/non-DeepSeek split decision itself (settled, ADR-recorded in `002-synthesis-and-decision`).
- deep-pi's own code (covered by phases 006-010 of this same packet).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `research/**` | Create | Workflow-owned deep-research fan-out outputs (single lineage, iterations, registries, `research.md`) |
| `spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md` | Create | Level-1 closure doc set (authored after the fan-out run, since the single-lineage CLI-executor path does not auto-seed packet-root docs) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Research loop completes all 10 forced-depth iterations and synthesizes `research/lineages/deepseek-flash/research.md` | File exists with ranked findings, provider coverage matrix, eliminated alternatives, and a convergence report |
| REQ-002 | Findings are evidence-backed | Each finding cites `index.ts:line` spans; spot-checked against real source, not accepted on the dispatch's own claim |
| REQ-003 | Packet-root closure docs exist and validate | `spec.md`/`plan.md`/`tasks.md`/`implementation-summary.md` present; `validate.sh --strict` passes |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Any operational incident during the run is recorded honestly | The write-containment false-positive revert (see Known Limitations in `implementation-summary.md`) is documented with root cause and recovery, not silently omitted |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: 15 findings (K1-K15), priority-ranked P0-P3, each with `file:line` citations, at least 2 spot-checked against real source and confirmed accurate.
- **SC-002**: A provider coverage matrix covering every enabled model in `.pi/settings.json`.
- **SC-003**: `validate.sh --strict` passes for this packet and `validate.sh --recursive --strict` still passes for the whole `039` packet.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | `cli-opencode` dispatch runs with `--dangerously-skip-permissions` against the live repo, not an isolated worktree | A hallucinated write could touch files outside the research lineage | Write-containment guard reverts any change to a tracked file outside the lineage dir (git-recoverable) and preserves untracked ones; realized once during this run (see Known Limitations) — recovered, no data loss |
| Risk | Concurrent unrelated dispatch touching the same repo | Containment guard cannot distinguish "the lineage did this" from "a concurrent process did this," so it can revert legitimate concurrent work | Confirmed and recovered manually this run; avoid running a `--dangerously-skip-permissions` CLI dispatch concurrently with any other file-editing dispatch in the future |
| Dependency | `opencode` CLI + DeepSeek direct provider auth | Loop cannot dispatch without it | Confirmed working (`opencode providers list` showed DeepSeek authenticated before launch) |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Do `opencode`/`opencode-go` register router adapters at runtime, changing their stats to virtual-routing semantics? Unobservable statically (runtime-injected registry).
- Do mimo/minimax/qwen/glm endpoints actually support exact-prefix caching, justifying the fork's prompt-rewrite chain for them?
- Which findings (P0/P1/P2/P3) the operator authorizes for implementation, and in what order.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Parent Spec**: `../spec.md`
- **Sibling research phase**: `../007-research-fork-improvements/spec.md` (prior fork-improvement research, both extensions)
- **Findings**: `research/lineages/deepseek-flash/research.md`
