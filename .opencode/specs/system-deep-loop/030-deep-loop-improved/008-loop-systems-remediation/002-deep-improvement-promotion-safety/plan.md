---
title: "Implementation Plan: Deep Improvement Promotion Safety"
description: "Plan for narrowing the pre-mutation mirror-sync gate to compare runtime mirrors against the current canonical body instead of the candidate."
trigger_phrases:
  - "deep improvement promotion safety plan"
  - "mirror sync gate canonical baseline plan"
  - "promote candidate mirror sync plan"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/030-deep-loop-improved/008-loop-systems-remediation/002-deep-improvement-promotion-safety"
    last_updated_at: "2026-06-29T14:00:00Z"
    last_updated_by: "claude"
    recent_action: "Planned and implemented the mirror-sync baseline fix"
    next_safe_action: "Finalize the remaining 009 remediation phases"
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-workflows/deep-improvement/scripts/shared/promote-candidate.cjs"
      - ".opencode/skills/deep-loop-workflows/deep-improvement/scripts/shared/tests/promote-candidate-mirror-sync.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "deep-improvement-promotion-safety-2026-06-29"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The gate reads the current canonical target content before the phase mutation, so the pre-mutation invariant is verifiable."
---
# Implementation Plan: Deep Improvement Promotion Safety

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CommonJS plus Vitest TypeScript tests |
| **Framework** | OpenCode deep-improvement scripts |
| **Storage** | Filesystem agent-definition canonical files and runtime mirrors |
| **Testing** | Vitest suite plus spawn-based promotion CLI verification |

### Overview
The mirror-sync gate runs before the canonical target is mutated, so the target still holds the current canonical body at gate time. The fix reads that current canonical content and passes it as the `verifyMirrorSync` expected body, replacing the candidate content. In-sync mirrors then match and pass; a drifted mirror still fails. A missing target falls back to the candidate to preserve the prior behavior for new agents.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] Mirror-sync baseline reads current canonical content
- [x] Hermetic regression test added (in-sync passes, drift blocks)
- [x] RED-before / GREEN-after proven for the in-sync case
- [x] Full deep-improvement Vitest suite passed
- [x] Docs updated with current verification state
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Corrected comparison baseline in the agent-definition branch of the promotion gate chain.

### Key Components
- **Mirror-sync gate**: In `promote-candidate.cjs`, runs only when the target is an agent-definition file, before any mutation.
- **verifyMirrorSync**: Compares each runtime mirror body to an expected body by normalized token set; unchanged.
- **Promotion regression test**: Spawns `promote-candidate.cjs` against a hermetic repo-root containing in-sync or drifted mirrors.

### Data Flow
The gate infers the agent name from the target path, reads the current canonical body from the target file (falling back to the candidate only if the target is absent), verifies the runtime mirrors against that body, and blocks when a mirror is missing or drifted.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## Fix Addendum: Affected Surfaces

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `promote-candidate.cjs` agent-definition gate | Verified mirrors against the candidate body. | Verify against the current canonical body instead. | `node --check`; spawn-based promotion test. |
| `verifyMirrorSync` / `evaluateMirrorSyncGate` | Compute and gate on mirror sync state. | Unchanged consumers. | Existing `mirror-sync-verify.vitest.ts` still green. |
| `promote-candidate-mirror-sync.vitest.ts` | New file. | Add in-sync-passes and drift-blocks coverage. | New regression test green; full suite green. |

Required inventories:
- Producers checked with `rg -n "verifyMirrorSync|isAgentDefinitionTarget|MIRROR_SYNC_GATE" .opencode/skills/deep-loop-workflows/deep-improvement/scripts -S`.
- Consumers checked with `rg -n "verifyMirrorSync|evaluateMirrorSyncGate" .opencode/skills/deep-loop-workflows/deep-improvement/scripts -S`.
- Matrix axes: mirror state is all in-sync, one drifted, or one missing; target state is present or absent.
- Algorithm invariant: the pre-mutation gate compares mirrors against the canonical body that exists before the mutation, never the candidate that will replace it.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Read the mirror-sync gate, `verifyMirrorSync`, and `evaluateMirrorSyncGate`
- [x] Capture the full deep-improvement suite baseline (403 tests)
- [x] Confirm the gate runs before the canonical mutation

### Phase 2: Core Implementation
- [x] Author the hermetic regression test (in-sync passes, drift blocks)
- [x] Confirm RED before the fix (in-sync case blocked by candidate comparison)
- [x] Change the gate to read the current canonical body with a missing-target fallback
- [x] Confirm GREEN after the fix

### Phase 3: Verification
- [x] Run `node --check` on `promote-candidate.cjs`
- [x] Run the targeted regression test
- [x] Run the full deep-improvement suite and confirm no regressions
- [x] Update Level-1 phase docs
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Syntax | `promote-candidate.cjs` parses under Node | `PATH=/opt/homebrew/bin:$PATH node --check` |
| Regression | In-sync promotion allowed, drift blocked | `npx vitest run shared/tests/promote-candidate-mirror-sync.vitest.ts` |
| Suite | All deep-improvement tests | `PATH=/opt/homebrew/bin:$PATH npx vitest run` |
| Spec validation | Level-1 phase docs | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <folder> --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Node at `/opt/homebrew/bin` | External runtime | Green | Cannot run CLI, syntax checks, or the suite |
| Vitest binary (repo-root install) | External dev dependency | Green | Regression and full suite cannot execute |
| `verifyMirrorSync` contract | Internal contract | Green | Gate has no mirror comparison primitive |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The suite reveals a mirror-sync regression, or a downstream caller depended on the candidate-comparison behavior.
- **Procedure**: Revert the baseline change in `promote-candidate.cjs`, delete `promote-candidate-mirror-sync.vitest.ts`, then restore the prior docs state for this phase.
<!-- /ANCHOR:rollback -->
