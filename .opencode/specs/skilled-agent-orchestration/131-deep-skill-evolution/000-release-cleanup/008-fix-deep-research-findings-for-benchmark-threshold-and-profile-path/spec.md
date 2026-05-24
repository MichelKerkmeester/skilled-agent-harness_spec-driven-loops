---
title: "Feature Specification: fix deep-research LG-0004 + LG-0006 (benchmark threshold consistency + profile-path default)"
description: "Remediation of the two code/config gaps the 005-deep-agent-improvement phase-5 deep-research loop surfaced and escalated: align the dynamic-profile benchmark threshold (75 -> 80) and fix the run-benchmark default profilesDir (target-profiles -> benchmark-profiles)."
trigger_phrases:
  - "fix benchmark threshold and profile path"
  - "008 deep-agent-improvement remediation"
  - "LG-0004 LG-0006"
  - "run-benchmark profilesDir default"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/131-deep-skill-evolution/000-release-cleanup/008-fix-deep-research-findings-for-benchmark-threshold-and-profile-path"
    last_updated_at: "2026-05-24T00:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "fixes-applied-and-verified"
    next_safe_action: "optional commit + optional future cleanup of vestigial target-profiles config refs"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
      - ".opencode/skills/deep-agent-improvement/scripts/run-benchmark.cjs"
      - ".opencode/skills/deep-agent-improvement/scripts/generate-profile.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000008001"
      session_id: "131-000-008-remediation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Source: 005-deep-agent-improvement phase-5 deep-research loop (LG-0004, LG-0006), escalated out of the doc-cleanup scope"
      - "LG-0004 fix is align requiredAggregateScore 75->80 (NOT touch the separate minimumAggregateScore promotion gate at 85)"
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Feature Specification: fix deep-research LG-0004 + LG-0006

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-05-24 |
| **Branch** | `main` |
| **Parent Packet** | `skilled-agent-orchestration/131-deep-skill-evolution/000-release-cleanup` |
| **Source** | `005-deep-agent-improvement` phase-5 deep-research loop (escalated gaps LG-0004, LG-0006) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The 005-deep-agent-improvement release-cleanup ran a deep-research loop that surfaced six logic gaps. Three doc gaps were fixed in 005; two code/config gaps were escalated (spec §3 kept `.cjs`/config changes out of that doc-cleanup packet). This packet fixes those two.

- **LG-0004 (P1)**: the benchmark-pass threshold `requiredAggregateScore` is inconsistent — `generate-profile.cjs:270` sets 75, while `assets/benchmark-profiles/default.json:15` and the `run-benchmark.cjs:280` fallback use 80. The dynamic profile is the outlier. (The `minimumAggregateScore: 85` promotion gate is a separate, intentionally-higher knob and is NOT in scope.)
- **LG-0006 (P1)**: `run-benchmark.cjs:258` defaults `profilesDir` to `assets/target-profiles`, which does not exist. The shipped profiles live in `assets/benchmark-profiles`. A `--profile <id>` run with no `--profiles-dir` fails to resolve the shipped default profile.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- `generate-profile.cjs:270` — change `requiredAggregateScore: 75` to `80`.
- `run-benchmark.cjs:258` — change the default `profilesDir` from `assets/target-profiles` to `assets/benchmark-profiles`.

### Out of Scope

- The `minimumAggregateScore: 85` promotion gate (separate knob; the 2-tier benchmark-80 / promotion-85 design is intentional).
- Any other deep-agent-improvement behavior; the other deep-research gaps were resolved or are by-design (see `005-deep-agent-improvement/research/convergence-summary.md`).
- cli-devin recipe drift (tracked separately as 005 follow-on T122).

### Files Changed

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/deep-agent-improvement/scripts/generate-profile.cjs` | Modify | requiredAggregateScore 75 -> 80 (LG-0004) |
| `.opencode/skills/deep-agent-improvement/scripts/run-benchmark.cjs` | Modify | default profilesDir target-profiles -> benchmark-profiles (LG-0006) |
| `.../008-.../spec.md` `plan.md` `tasks.md` `implementation-summary.md` | Create | This packet |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `requiredAggregateScore` is consistent across generate-profile.cjs, default.json, and the run-benchmark fallback | All three equal 80; `grep requiredAggregateScore` shows no 75 |
| REQ-002 | `run-benchmark.cjs` default `profilesDir` resolves the shipped default profile | `node run-benchmark.cjs --profile default ...` with no `--profiles-dir` loads `assets/benchmark-profiles/default.json` |
| REQ-003 | No regression | `node --check` passes on both scripts; the vitest suite passes |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Both fixes applied; `grep` confirms 80 everywhere and `benchmark-profiles` as the default.
- **SC-002**: `node --check` clean on both scripts; full vitest suite passes (no regression).
- **SC-003**: `run-benchmark.cjs --profile default` resolves the shipped profile via the default `profilesDir`.
- **SC-004**: Spec folder passes `validate.sh --strict`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A vitest test hard-codes the old `75` or `target-profiles` default | Low | T-verify runs the full `scripts/tests/` suite; a plan-time grep found no test referencing these |
| Risk | `requiredAggregateScore: 75` was an intentional looser dynamic-profile bar | Low | Aligned to `80` (the static-profile + runner-fallback value); the separate `85` promotion gate is untouched |
| Dependency | Node.js 18+ for `node --check` + vitest | Green | Present |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. LG-0004 is the narrow `75 -> 80` alignment; the broader benchmark-pass (80) vs promotion-gate (85) two-tier is intentional and out of scope.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Plan**: `plan.md`
- **Tasks**: `tasks.md`
- **Implementation Summary**: `implementation-summary.md`
- **Source loop**: `../005-deep-agent-improvement/research/convergence-summary.md` + `resource-map.yaml` `phase5_augmentation`
