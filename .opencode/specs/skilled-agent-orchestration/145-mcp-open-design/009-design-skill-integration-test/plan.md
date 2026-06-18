---
title: "Implementation Plan: sk-interface-design + mcp-open-design integration test (MiMo vs DeepSeek)"
description: "Dispatch two model seats under an identical brief that loads sk-interface-design and follows the shared parity loop, each producing three self-contained HTML designs, then compare them on the host."
trigger_phrases:
  - "design skill integration test plan"
  - "mimo deepseek design dispatch"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/145-mcp-open-design/009-design-skill-integration-test"
    last_updated_at: "2026-06-15T07:15:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Dispatched both model seats; awaiting outputs"
    next_safe_action: "Collect designs, compare, write implementation-summary"
    blockers: []
    key_files:
      - ".opencode/specs/skilled-agent-orchestration/145-mcp-open-design/009-design-skill-integration-test/scratch/brief-mimo.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-009-design-skill-integration-test"
      parent_session_id: null
    completion_pct: 60
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: sk-interface-design + mcp-open-design integration test (MiMo vs DeepSeek)

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Self-contained HTML and inline CSS (the design artifacts) |
| **Framework** | sk-interface-design judgment plus the shared claude_design_parity loop |
| **Storage** | None |
| **Testing** | Host opens each HTML offline; reads each NOTES.md; cross-model comparison |

### Overview
Two cli-opencode seats run an identical brief: load sk-interface-design, follow the ground / anti-default / build loop it shares with mcp-open-design, and produce three self-contained HTML designs plus a notes file. One seat is MiMo v2.5 Pro, the other DeepSeek v4 Pro. The host then compares the two.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Three briefs chosen where the AI default is tempting
- [x] Identical brief for both models so the comparison is fair
- [x] Providers confirmed configured

### Definition of Done
- [x] Both seats dispatched with Gate 3 baked in
- [ ] Six designs collected and opened offline
- [ ] MiMo-versus-DeepSeek comparison written
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Controlled head-to-head. One variable changes between the two runs (the model), everything else identical, so differences are attributable to the model.

### Key Components
- **The brief**: identical instructions pointing at the sk-interface-design references and the three subjects.
- **The seats**: MiMo and DeepSeek via `opencode run --variant high`.
- **The comparison**: host-authored, grounded in the actual HTML and NOTES.

### Data Flow
Brief -> model reads sk-interface-design references -> model writes three HTML files plus NOTES.md to its own subdir -> host opens, reads, and compares.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Not a bug fix. This packet only creates test artifacts under its own folder and does not touch any shared surface.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `154-.../designs/` | Test output only | created | files exist and open offline |
| sk-interface-design, mcp-open-design | Skills under test | unchanged (read only) | no edits to either skill |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Confirm the Open Design app state and the two provider slugs
- [x] Create packet 154 (Gate 3)
- [x] Write the identical brief for both models

### Phase 2: Core Implementation
- [x] Dispatch the MiMo seat (xiaomi/mimo-v2.5-pro --variant high)
- [x] Dispatch the DeepSeek seat (deepseek/deepseek-v4-pro --variant high)
- [ ] Collect the six designs and the two NOTES files

### Phase 3: Verification
- [ ] Open each HTML offline and confirm it renders self-contained
- [ ] Compare the two models per brief and overall
- [ ] Write the implementation-summary verdict
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Manual | Each HTML renders offline | Open the file, inspect the `<style>` block |
| Manual | Anti-default adherence | Read each NOTES.md against design_principles.md |
| Comparison | MiMo versus DeepSeek per brief | Host judgment grounded in the artifacts |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| xiaomi provider (MiMo) | External | Green | No MiMo arm |
| deepseek provider | External | Green | No DeepSeek arm |
| Open Design desktop app | External | Yellow (installed, closed) | No live od grounding; offline test proceeds |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The test artifacts are unwanted.
- **Procedure**: Delete the `145-mcp-open-design/009-design-skill-integration-test` folder. Nothing else references it and no shared state changed.
<!-- /ANCHOR:rollback -->
