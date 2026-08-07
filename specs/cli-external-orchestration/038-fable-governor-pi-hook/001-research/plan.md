---
title: "Research Plan: Governor Hook + Pi Subagent Directive"
description: "Three parallel model tracks (5/3/2 iterations) with per-iteration evidence logging and a no-early-convergence protocol; synthesis after all tracks complete."
trigger_phrases:
  - "governor research plan"
  - "iteration protocol"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/038-fable-governor-pi-hook/001-research"
    last_updated_at: "2026-08-04T00:00:00Z"
    last_updated_by: "pi-main-agent"
    recent_action: "Research plan authored"
    next_safe_action: "Launch Track A iteration 1"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-04-cli-038-research"
      parent_session_id: null
    completion_pct: 5
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Research Plan: Governor Hook + Pi Subagent Directive

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Evidence targets** | `fable-governor.md`, capsule injection chain (pi `prompt-advisor.ts`, `mk-skill-advisor.js`, `render.ts`), AGENTS.md governor/proof sections, pi-subagents plugin surface |
| **Track A** | GPT-5.6 Luna (openai-codex/gpt-5.6-luna), max thinking, native pi-subagents scout dispatch — 5 iterations |
| **Track B** | GLM 5.2 (high) via cli-devin skill — 3 iterations |
| **Track C** | Grok 4.5 Max via cli-cursor skill — 2 iterations |
| **Outputs** | `evidence/iterations.md`, `evidence/synthesis.md` |

### Overview
Three independent model tracks answer the two research questions. Each iteration is a fresh-context pass with a fixed evidence checklist. Tracks run their full iteration counts regardless of early agreement (no convergence). The parent synthesizes only after all 10 iterations are logged.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Research questions defined (spec REQ-004/REQ-005)
- [x] Iteration protocol defined (this plan)
- [x] Model routes verified available

### Definition of Done
- [ ] 10 iteration logs present in `evidence/iterations.md`
- [ ] `evidence/synthesis.md` answers both questions with evidence
- [ ] validate.sh --strict exits 0 on this phase folder
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

```
Track A: pi-subagents scout x5 (gpt-5.6-luna, max)   ─┐
Track B: cli-devin x3 (z-ai/glm-5.2, high)           ─┼─> evidence/iterations.md ─> synthesis.md
Track C: cli-cursor x2 (grok-4.5-max)                ─┘
```

### Iteration Protocol (each iteration)

1. Fresh context: no conversation carryover between iterations
2. Fixed evidence checklist per iteration:
   - Governor capsule text (current per-turn directive) vs fable-governor.md doctrine
   - AGENTS.md governor + proof-over-appearance sections (overlap/contradiction/gap)
   - Injection chain mechanics (which hook, which composition point)
   - Pi subagent dispatch surface: plugin default vs cli-* routes
3. Output: findings (max ~300 words) + recommendation signals
4. Log immediately to `evidence/iterations.md` with model, route, iteration number, timestamp

### Key Design Decisions

| # | Decision | Rationale |
|---|----------|-----------|
| D-001 | No early convergence | Full iteration counts per track guard against false consensus |
| D-002 | Fresh context per iteration | Prevents within-track anchoring |
| D-003 | Iteration logs written by parent, not children | One writer for evidence; children report only |
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Route Verification

1. Verify gpt-5.6-luna enabled; preload cli-devin + cli-cursor SKILL.md contracts (dispatch rule)
2. Create evidence/ + scratch/ working areas

### Phase 2: Iterations

1. Track A: iterations A1-A5 (GPT-5.6 Luna max, native pi-subagents scout, fresh context each)
2. Track B: iterations B1-B3 (GLM 5.2 high via cli-devin, per its skill contract)
3. Track C: iterations C1-C2 (Grok 4.5 Max via cli-cursor, per its skill contract)
4. Log every iteration to `evidence/iterations.md` immediately after it completes

### Phase 3: Synthesis + Validation

1. Synthesize verdict + pi directive design + overlap/contradiction matrix into `evidence/synthesis.md`
2. Verify 10 logged entries; run `validate.sh --strict` on this folder
3. Update parent phase map and handoff criteria
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Target | Test | When |
|--------|------|------|
| Evidence completeness | grep `evidence/iterations.md` for 10 entries, 3 models | After step 4 |
| Route failures | Failed tracks explicit in evidence, not silent | After steps 2-4 |
| Verdict quality | synthesis.md cites file:line for each keep/update/replace option | After step 5 |
| Packet | `validate.sh --strict` on this folder | After step 6 |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Purpose | Risk if missing |
|-----------|---------|-----------------|
| openai-codex/gpt-5.6-luna auth | Track A | Track fails; log honestly |
| cli-devin skill + GLM 5.2 route | Track B | Track fails; log honestly |
| cli-cursor skill + grok-4.5-max route | Track C | Track fails; log honestly |
| pi-subagents plugin | Track A dispatch | Fallback to builtin scout |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Evidence-only phase: nothing to roll back. Delete `evidence/` and `scratch/` if the phase must restart. No repo files touched.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:verification -->
## 8. VERIFICATION PATH

1. `grep` evidence file: 10 iteration entries across 3 models
2. Synthesis present with file:line citations
3. `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/cli-external-orchestration/038-fable-governor-pi-hook/001-research --strict` exits 0
<!-- /ANCHOR:verification -->
