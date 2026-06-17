---
title: "Implementation Plan: Live-run and refine the design playbooks"
description: "Run the 13 scenarios live by class (deterministic, model-judgment via Kimi + DeepSeek, Code Mode reads, gated od generation, simulated failure), then refine each scenario in place where the run exposes a gap, preserving the self-checks."
trigger_phrases:
  - "design playbook live run plan"
  - "playbook refinement plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/145-mcp-open-design/010-design-playbook-live-run-and-refinement"
    last_updated_at: "2026-06-15T10:40:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Ran all scenarios + applied refinements; finalizing the packet"
    next_safe_action: "Validate, commit, then restructure under 145-mcp-open-design"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-open-design/references/mcp_wiring.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-010-design-playbook-live-run-and-refinement"
      parent_session_id: null
    completion_pct: 85
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Live-run and refine the design playbooks

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown playbooks + scenario files; Bash/od CLI; Code Mode UTCP; cli-opencode dispatch |
| **Framework** | The per-skill manual_testing_playbook standard (sk-doc) |
| **Storage** | None (Open Design projects live in the app data dir) |
| **Testing** | The run verdicts themselves; `package_skill --check`; `validate.sh --strict`; targeted greps |

### Overview
Classify the 13 scenarios and run each by the method that fits: deterministic shell checks, model-judgment + routing via Kimi K2.7 and DeepSeek v4 Pro (skill loaded), design-system reads against the app's bundled systems, a gated od generation into a throwaway project, and a simulated daemon-failure. Capture a results matrix, then refine each scenario in place where the run exposed a gap.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Both playbooks enumerated; scenarios classified
- [x] Models + Code Mode wiring target confirmed with the user
- [x] Open Design app running

### Definition of Done
- [x] All 13 scenarios run live with honest verdicts
- [x] Refinements applied; both skills pass `package_skill --check`; self-checks preserved
- [ ] Packet validated `--strict` and committed
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Run-by-classification. Each scenario class has a fitting live-execution method; verdicts captured in a matrix; refinements are evidence-driven and in place.

### Key Components
- **Model dispatch**: cli-opencode to Kimi (kimi-for-coding/k2p7) + DeepSeek (deepseek/deepseek-v4-pro), skill loaded.
- **Code Mode + od**: `.utcp_config.json` open-design manual; `od run start --agent opencode --model <explicit>` for generation.
- **Refinements**: in-place edits to both playbooks' scenario files + mcp_wiring.md.

### Data Flow
Scenario -> live method -> evidence + verdict -> matrix -> refinement (if gap) -> re-verify (package_skill + self-checks).
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Not a bug fix, but the refinements touch shared skill docs, so recorded here.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| mcp-open-design playbook + mcp_wiring.md | The skill's test + wiring docs | update (preconditions, RUN-001, READ-001, Code Mode path) | package_skill PASS; self-check counts preserved |
| sk-interface-design playbook scenarios | The skill's test docs | update (fixture, system source, de-vendor tokens, runId) | package_skill PASS; prompt-equality held |
| `.utcp_config.json` | Code Mode manuals | open-design manual added (separate from this packet's edits) | YAML/JSON parses |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Enumerate both playbooks; classify the 13 scenarios
- [x] Preflight: app/daemon, Kimi + DeepSeek slugs, `.utcp_config.json` backup

### Phase 2: Run + refine
- [x] Run deterministic + routing + model-judgment (Kimi + DeepSeek), Code Mode wiring, design-system reads, gated od generation, simulated failure
- [x] Capture the results matrix
- [x] Apply evidence-driven refinements to both playbooks

### Phase 3: Verification
- [x] `package_skill --check` both skills; self-check counts; house-voice sweep
- [ ] Author packet docs; `validate.sh --strict`; scoped commit
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Live run | The 13 scenarios | od CLI, cli-opencode (Kimi/DeepSeek), Code Mode |
| Structure | Both skills + this packet | `package_skill --check`, `validate.sh --strict` |
| Static | House voice, comment hygiene, self-checks | `grep`, manual read |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Open Design app + daemon | External | Green | No reads/generation |
| Kimi + DeepSeek providers | External | Green | No model-judgment run |
| Code Mode (UTCP) | Internal | Yellow | Loads manuals at startup; new manual needs a reload |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A refinement is wrong or a self-check breaks.
- **Procedure**: `git revert` the scoped commit; the playbook edits are additive/in-place doc changes with no runtime impact.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) -> Phase 2 (Run + refine) -> Phase 3 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Run |
| Run + refine | Setup | Verify |
| Verify | Run + refine | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | Enumerate + preflight |
| Run + refine | High | 13 scenarios + 2 model batteries + refinements |
| Verification | Low | package_skill + validate |
| **Total** | Med-High | One focused session |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] No data changes; doc + script edits only
- [x] Scoped commit keeps the blast radius to the two skills + this packet

### Rollback Procedure
1. Identify the scoped commit hash.
2. `git revert` it (or `git checkout` the edited playbook files).
3. Re-run `package_skill --check` to confirm a clean state.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->
