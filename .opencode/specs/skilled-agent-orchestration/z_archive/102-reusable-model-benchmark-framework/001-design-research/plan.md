---
title: "Implementation Plan: Reusable model-benchmark framework (research packet)"
description: "Plan for the research deliverable: run a 10-iteration cli-codex deep-research loop and synthesize a config-driven benchmark-framework design + prioritized roadmap. Implementation of the framework itself is a follow-on packet."
trigger_phrases:
  - "reusable benchmark framework plan"
  - "deep-improvement benchmark research plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/102-reusable-model-benchmark-framework/001-design-research"
    last_updated_at: "2026-06-02T06:20:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Research loop complete; design synthesized"
    next_safe_action: "Plan implementation phases from the roadmap"
    blockers: []
    key_files:
      - ".opencode/specs/skilled-agent-orchestration/z_archive/102-reusable-model-benchmark-framework/research/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "research-127"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Reusable model-benchmark framework (research packet)

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Research only (Markdown + JSONL); target framework is Node `.cjs` under `deep-improvement` |
| **Framework** | deep-improvement Lane B (`scripts/model-benchmark/`) is the extension target |
| **Storage** | Per-iteration `research/iterations/*.md`, synthesis `research/research.md`, deltas `research/deltas/deltas.jsonl` |
| **Testing** | N/A for research; design proposes `validate.sh --strict` as the folder gate |

### Overview
This packet is a deep-research investigation, not a code change. The plan: dispatch a 10-iteration `cli-codex gpt-5.5` (high/fast, read-only) loop that grounds each theme in repo evidence (Lane B `121`, the `120/003` and `126/004` rigs), then synthesize a config/profile-driven benchmark-framework design with a prioritized P0/P1/P2 roadmap. Building the framework is a follow-on packet.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented (saturation + reuse-vs-net-new framed in spec.md)
- [x] Success criteria measurable (research.md + deltas.jsonl + strict validate)
- [x] Dependencies identified (cli-codex gpt-5.5 high/fast; no `--search`)

### Definition of Done
- [x] All acceptance criteria met (10 iterations, design, roadmap)
- [x] Tests passing (if applicable) — N/A (research; folder strict-validate is the gate)
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Research-then-synthesize. Orchestrator (Claude) dispatches; codex (read-only) investigates; orchestrator writes artifacts.

### Key Components
- **Per-iteration dispatch**: one themed `codex exec` per iteration, captured to `research/iterations/iteration-00N.md`.
- **Synthesis**: `research/research.md` (seam architecture + anti-saturation strategy + roadmap) and `research/deltas/deltas.jsonl` (structured deltas).

### Data Flow
Themed prompt → codex reads repo files → evidence-grounded findings + deltas → iteration file → (×10) → synthesized design + roadmap.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Not applicable. This packet writes only research docs under `research/` (plus governance docs at the packet root). No production code, security, path-handling, schema, or persistence surfaces are touched. The framework design names future target files (`run-benchmark.cjs`, `dispatch-model.cjs`, scorer, `loop-host.cjs`, a new `sweep-benchmark.cjs`, a framework registry) but does not modify them.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Confirm codex dispatch contract (smoke test, exit 0)
- [x] Create `research/iterations` and `research/deltas`
- [x] Verify all key evidence files exist (corrected `120`/`126` paths)

### Phase 2: Core Implementation
- [x] Run iterations 1-10 (one theme each), capture each to its iteration file
- [x] Build `research/deltas/deltas.jsonl` from per-iteration deltas
- [x] Write `research/research.md` synthesis (architecture + anti-saturation + roadmap)

### Phase 3: Verification
- [x] All 10 iterations exit 0 with real findings
- [x] deltas.jsonl valid JSONL (64 deltas)
- [x] `validate.sh --strict` passes on the folder
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Dispatch verification | codex exit code per iteration | `gtimeout codex exec` + `$?` |
| Artifact validation | deltas.jsonl parses; iteration files well-formed | `node JSON.parse`, `wc`, `grep` |
| Folder validation | spec-folder strict gate | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| cli-codex gpt-5.5 (high/fast) | External | Green | The research executor; retry-once on dispatch failure |
| deep-improvement Lane B code | Internal | Green | The evidence base + extension target |
| `120/003`, `126/004` rigs | Internal | Green | The one-off rigs being generalized |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Research artifacts incomplete or fabricated.
- **Procedure**: Research docs are additive under `research/`; revert by deleting the packet folder. No production code touched, so no runtime rollback needed.
<!-- /ANCHOR:rollback -->
