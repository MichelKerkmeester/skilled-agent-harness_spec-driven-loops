---
title: "Implementation Plan: Forward --stop-policy on the deep-research fan-out path"
description: "Thread stop_policy through presentation, both YAMLs, and generalize the max-iterations validator to research."
trigger_phrases:
  - "deep-research stop-policy forwarding plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "specs/system-deep-loop/040-deep-research-stop-policy-forwarding"
    last_updated_at: "2026-08-17T19:30:00.000Z"
    last_updated_by: "claude"
    recent_action: "Wired stop_policy through both YAMLs; validator now covers research forced-depth."
    next_safe_action: "Run validation and the runtime tests."
    blockers: []
    key_files:
      - "specs/system-deep-loop/040-deep-research-stop-policy-forwarding/plan.md"
      - ".opencode/commands/deep/assets/deep-research-presentation.txt"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "deep-loop-040-stop-policy-forwarding"
      parent_session_id: null
    completion_pct: 80
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Forward --stop-policy on the deep-research fan-out path

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | YAML workflow assets; CommonJS runtime |
| **Framework** | deep-research command + system-deep-loop fan-out runtime |
| **Storage** | `commands/deep/assets/*.yaml`, `deep-research-presentation.txt`; `fanout-run.cjs` |
| **Testing** | `fanout-run.vitest.ts`; grep before/after; node --check |

### Overview
`fanout-run.cjs` already honors `--stop-policy max-iterations` in the lineage prompt, but the command never passed it and the presentation never resolved it. Bind `stop_policy` at the presentation and YAML layers, forward it in the invocation, and generalize the fail-closed completeness validator to research.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Root cause confirmed at each layer. Evidence: `git show HEAD` gate `loopType !== 'review'`; auto YAML had 0 `stop-policy`.
- [x] Runtime already threads stopPolicy to the prompt. Evidence: `fanout-run.cjs` non-review stop clause.

### Definition of Done
- [x] Policy forwarded + resolved + required; validator generalized. Evidence: `implementation-summary.md` Verification.
- [x] Runtime tests green. Evidence: `fanout-run.vitest.ts` 109 pass.
- [ ] Changes committed on v4. Evidence: pending the commit.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Setup resolution (presentation) → bound YAML variable (`user_inputs` + `required_values_present`) → runtime CLI flag (`--stop-policy {stop_policy}`) → the runtime's existing prompt clause + a now-generalized on-disk completeness check.

### Key Components
- **`deep-research-presentation.txt`** — the default-resolution table that binds `stop_policy`.
- **`deep-research-{auto,confirm}.yaml`** — declare, require, and forward the flag.
- **`fanout-run.cjs` `findMaxIterationsPolicyViolation`** — fail-closed completeness validator, now research-aware.

### Data Flow
`--stop-policy=max-iterations` → `{stop_policy}` → `fanout-run.cjs --stop-policy max-iterations` → lineage prompt "run all N, convergence is telemetry" + post-run validation that N iterations landed.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Wiring
- [x] Add the `stop_policy` presentation row; declare + require + forward it in both YAMLs. Evidence: `deep-research-presentation.txt` row; both YAMLs grep `stop-policy {stop_policy}`.

### Phase 2: Runtime + tests
- [x] Generalize `findMaxIterationsPolicyViolation` to research with loop-type-aware state names; add research test cases. Evidence: `fanout-run.cjs` gate; `fanout-run.vitest.ts` 7/7 in the block.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Syntax | runtime | `node --check` |
| Before/after | wiring present | `git show HEAD` + `grep` |
| Unit | research forced-depth validation | `fanout-run.vitest.ts` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `lineageStateLogName` research mapping | Internal | Available | Validator reads the wrong state file |
| Runtime prompt already honors stopPolicy | Internal | Available | Forwarding would have no effect |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The forwarded flag breaks preflight, or the validator wrongly fails research runs.
- **Procedure**: Remove the `stop_policy` presentation row + YAML declarations/require/forward, and revert the validator gate to `loopType !== 'review'`. The runtime prompt clause is unchanged, so the prior convergence-default behavior returns.
<!-- /ANCHOR:rollback -->
