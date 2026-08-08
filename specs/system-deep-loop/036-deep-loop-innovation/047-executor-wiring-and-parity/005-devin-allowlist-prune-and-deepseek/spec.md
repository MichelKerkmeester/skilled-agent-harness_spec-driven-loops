---
title: "Feature Specification: devin allowlist prune, DeepSeek gap, and mirror parity"
description: "The runtime devin allowlist still carried nine curated-out aliases, was missing the catalog-featured DeepSeek ids entirely, and its CJS mirror could drift silently from the TS source."
trigger_phrases:
  - "devin allowlist prune"
  - "devin deepseek missing runtime"
  - "fanout mirror parity test"
  - "devin curated four family scope"
  - "prune adaptive opus aliases"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/047-executor-wiring-and-parity/005-devin-allowlist-prune-and-deepseek"
    last_updated_at: "2026-07-30T07:45:39.076Z"
    last_updated_by: "implementer"
    recent_action: "Author spec for the prune + deepseek + parity change"
    next_safe_action: "Commit the runtime change + packet"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts"
      - ".opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "impl-045"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: devin allowlist prune, DeepSeek gap, and mirror parity

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-07-30 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | None |
| **Predecessor** | 044-devin-fanout-allowlist-parity |
| **Successor** | None |
| **Handoff Criteria** | Allowlist equals the curated four-family scope in both surfaces; parity test pins the mirror; suites green |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
After the additive parity packet, three gaps remained: nine curated-out aliases (`adaptive`, `opus`, `sonnet`, `claude`, `haiku`, `gpt`, `gemini`, `codex`, `swe-1-6`) were still dispatchable via devin fan-out; the catalog-featured DeepSeek family had NO id in the devin allowlist at all (a dispatch naming `deepseek-v4-pro` was hard-rejected); and the duplicated CJS allowlist in `fanout-run.cjs` could silently drift from the TS source.

### Purpose
Make the enforced devin dispatch surface exactly the curated four-family scope (GLM-5.2, SWE-1.7, Grok 4.5, DeepSeek), and convert mirror drift from a silent risk into a test failure.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Prune the nine curated-out aliases from `DEVIN_SUPPORTED_MODELS` (TS) and `DEVIN_ALLOWED_MODELS` (CJS mirror) — gated on the completed config sweep showing no runtime-consumed config names them
- Add `deepseek-v4-pro` (family slug) and `deepseek-v4` (model uid), both from the live `devin models list`
- Add a parity test asserting the CJS mirror's set and default equal the TS source's
- Extend the rejection fixtures with pruned ids (`adaptive`, `opus`) to prove the prune fails closed
- Run both unit suites

### Out of Scope
- PI / CURSOR allowlists — already match their catalogs
- Structural de-duplication of the CJS mirror — the mirror is deliberate (synchronous, directly unit-testable, same doctrine as the cursor mirror); the parity test closes the drift risk instead
- cli-devin skill docs — already curated

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts` | Modify | Allowlist → curated 15-id set; comments made truthful |
| `.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` | Modify | Mirror → same 15-id set; expose set + default for the parity test |
| `.opencode/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts` | Modify | New pins, pruned-id rejections, mirror-parity tests |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Allowlist equals the curated 15-id set in both surfaces | Greps count 15/15; zero pruned ids in either devin block |
| REQ-002 | DeepSeek dispatchable | `deepseek-v4-pro` and `deepseek-v4` accepted by both surfaces |
| REQ-003 | Mirror parity pinned by test | Sorted-set and default parity assertions pass against the TS exports |
| REQ-004 | Both unit suites pass | 182/182 green |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Pruned ids fail closed | Rejection fixtures include `adaptive` and `opus`; suite green |
| REQ-006 | Prune gated on evidence | Config sweep found no runtime-consumed config naming a pruned alias |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Both suites green with the new pins and parity tests (evidence: orchestrator-run output)
- **SC-002**: A devin fan-out naming any curated-out alias is rejected; naming any catalog id (incl. DeepSeek) is accepted
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A hidden config names a pruned alias | Med | Sweep of runtime-consumed configs found none; rejection is loud (fail-closed error), not silent |
| Risk | Concurrent lanes edit the same runtime files | Med | Files verified clean before dispatch; re-verified at staging |
| Dependency | Live `devin models list` id validity | Low | DeepSeek ids read from the live roster this session |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None open. The mirror stays a deliberate duplicate (its own comment documents why); parity is enforced by test rather than refactor.
<!-- /ANCHOR:questions -->
