---
title: "Implementation Plan: fix deep-research LG-0004 + LG-0006"
description: "Two surgical code/config fixes in deep-agent-improvement scripts plus verification: align requiredAggregateScore to 80 and fix the run-benchmark default profilesDir."
trigger_phrases:
  - "fix benchmark threshold and profile path plan"
  - "008 remediation plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/006-deep-skill-evolution/001-release-cleanup/014-deep-agent-improvement-benchmark-threshold-and-profile-path"
    last_updated_at: "2026-05-24T00:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "plan-authored"
    next_safe_action: "apply-two-fixes-then-verify"
    blockers: []
    key_files:
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000008002"
      session_id: "131-000-008-remediation"
      parent_session_id: "131-000-008-remediation"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Implementation Plan: fix deep-research LG-0004 + LG-0006

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Stack** | Node.js CommonJS (`.cjs`) + JSON config under `.opencode/skills/deep-agent-improvement/` |
| **Verification** | `node --check`, the skill's `scripts/tests/` vitest suite, a `run-benchmark.cjs` default-path smoke, `rg` consistency sweep |
| **Routing** | Code changes through `sk-code` (opencode script surface) |

### Overview

Two surgical edits, each one line, both surfaced by the 005 deep-research loop. LG-0004 aligns the dynamic profile's `requiredAggregateScore` (75) to the value used by the static profile and the runner fallback (80). LG-0006 points the `run-benchmark.cjs` default `profilesDir` at the directory that actually ships profiles (`benchmark-profiles`, not `target-profiles`).
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Done

- [ ] Both one-line fixes applied (REQ-001, REQ-002)
- [ ] `node --check` clean on both scripts
- [ ] `scripts/tests/` vitest suite passes (no regression)
- [ ] `run-benchmark.cjs --profile default` resolves the shipped profile via the default `profilesDir`
- [ ] `rg` confirms `requiredAggregateScore` is 80 everywhere and no live `target-profiles` default
- [ ] Strict validate exit 0; `implementation-summary.md` filled
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

No architectural change. Two value edits inside existing helpers. `requiredAggregateScore` (benchmark-pass threshold, read in `run-benchmark.cjs`) and `minimumAggregateScore` (promotion gate, 85) remain distinct knobs; this packet only removes the 75-vs-80 inconsistency within the benchmark-pass knob and corrects a non-existent default directory path.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Apply + Verify

- [ ] Load `sk-code` (opencode `.cjs` surface).
- [ ] LG-0004: `generate-profile.cjs:270` `requiredAggregateScore: 75` -> `80`.
- [ ] LG-0006: `run-benchmark.cjs:258` default `profilesDir` `assets/target-profiles` -> `assets/benchmark-profiles`.
- [ ] `node --check` both scripts; run the vitest suite; smoke the default-path resolution; `rg` consistency sweep.
- [ ] Fill `implementation-summary.md`; strict validate; commit.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test | Tool |
|------|------|
| Script syntax | `node --check scripts/run-benchmark.cjs scripts/generate-profile.cjs` |
| Regression | vitest over `scripts/tests/` |
| Profile-path resolution | `run-benchmark.cjs --profile default` default-`profilesDir` smoke |
| Consistency | `rg "requiredAggregateScore"`, `rg "target-profiles"` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Status | Impact if Blocked |
|------------|--------|-------------------|
| Node.js 18+ (`node --check`, vitest) | Green | Verification blocked |
| `sk-code` (opencode surface patterns) | Green | Authoring-time guidance |
| `assets/benchmark-profiles/default.json` exists | Green (verified) | LG-0006 fix target |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Two one-line reverts: `git checkout HEAD -- .opencode/skills/deep-agent-improvement/scripts/generate-profile.cjs .opencode/skills/deep-agent-improvement/scripts/run-benchmark.cjs`. No data, no migration, no feature flag.
<!-- /ANCHOR:rollback -->
