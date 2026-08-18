---
title: "Implementation Plan: Deep research on the sk-vision host-adapter findings"
description: "Seed the five-finding corpus and run a 10-iteration forced-depth cli-pi research loop."
trigger_phrases:
  - "sk-vision findings deep research plan"
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
      - "specs/cli-external-orchestration/048-earlier-findings-deep-research/plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "cli-ext-048-findings-deep-research"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Deep research on the sk-vision host-adapter findings

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | deep-research fan-out (cli-pi) over OpenRouter DeepSeek Flash |
| **Framework** | system-deep-loop research loop |
| **Storage** | `048/research/` (state, deltas, iterations, `research.md`) |
| **Testing** | forced-depth completeness validator; iteration-file count |

### Overview
Seed the five findings as `resource-map.md` + a topic string, then run a single cli-pi lineage for exactly 10 iterations under `--stop-policy=max-iterations`.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] OpenRouter dispatch verified. Evidence: `pi -p` probe returned `READY`.
- [x] Forced-depth path landed. Evidence: Packet `040` wiring + validator.

### Definition of Done
- [x] Corpus seeded + run launched. Evidence: `resource-map.md`; `research/` created.
- [x] 10 iterations + `research.md`. Evidence: 10 `iteration-*.md` + 197-line `research.md` on disk.
- [ ] Changes committed on v4. Evidence: pending the commit.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
A single-lineage cli-pi research fan-out: `fanout-run.cjs --loop-type research --stop-policy max-iterations` with a one-executor fan-out config pinned to `deepseek/deepseek-v4-flash-latest` at max thinking.

### Key Components
- **`resource-map.md`** — the seeded Known Context.
- **`research/lineages/pi-flash-or/`** — the lineage's isolated state + iterations.
- **`research/research.md`** — the merged synthesis.

### Data Flow
topic + resource-map → 10 iteration dispatches to `openrouter/deepseek/deepseek-v4-flash-latest --thinking max` → per-iteration deltas → synthesis.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Seed + launch
- [x] Write `resource-map.md`; launch the 10-iter cli-pi run. Evidence: `resource-map.md`; `research/` populated.

### Phase 2: Synthesize
- [x] Confirmed 10 iterations + `research.md`. Evidence: `iteration-010.md` present; `research.md` §5.1-5.5.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Dispatch | OpenRouter routing | live `pi -p` probe |
| Completeness | 10 iterations landed | iteration-file count + forced-depth validator |
| Output | synthesis exists | `ls research/research.md` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Packet `047` roster | Internal | Landed | cli-pi cannot dispatch the model |
| Packet `040` wiring | Internal | Landed | forced-10 not guaranteed |
| OpenRouter auth | External | Available | dispatch fails |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The run stalls or produces unusable output.
- **Procedure**: Kill the fan-out process, keep the partial `research/` artifacts for inspection, and re-launch after adjusting the executor timeout or topic. No runtime or roster change is involved.
<!-- /ANCHOR:rollback -->
