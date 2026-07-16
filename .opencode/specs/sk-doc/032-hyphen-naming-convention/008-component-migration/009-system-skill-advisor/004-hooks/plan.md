---
title: "Implementation Plan: system-skill-advisor hooks"
description: "Inventory advisor hook filenames, preserve the current kebab-case hook files when confirmed, repair stale registrations and references, and rename only a real non-mandated candidate found in the pinned baseline."
trigger_phrases:
  - "system-skill-advisor hooks implementation plan"
  - "hook registration path plan"
  - "prompt submit hook verification"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/032-hyphen-naming-convention/008-component-migration/009-system-skill-advisor/004-hooks"
_memory:
  continuity:
    packet_pointer: "sk-doc/032-hyphen-naming-convention/008-component-migration/009-system-skill-advisor/004-hooks"
    last_updated_at: "2026-07-14T18:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored the hook audit implementation plan"
    next_safe_action: "Freeze the advisor hook inventory and registration manifest"
    blockers: []
    key_files:
      - ".opencode/skills/system-skill-advisor/hooks"
      - ".opencode/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts"
      - ".opencode/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts"
      - ".opencode/skills/system-skill-advisor/mcp_server/tests/hooks"
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "The visible advisor hook filenames are already kebab-case."
      - "Stale cross-skill paths must be classified by owner before any edit."
---

# Implementation Plan: system-skill-advisor hooks

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript runtime hooks and Node CLI fallback |
| **Framework** | Claude/OpenCode hook contracts and Vitest |
| **Storage** | Hook source, runtime settings, and path-bearing documentation |
| **Testing** | Filename inventory, registration resolution, hook parity/smoke tests |

### Overview
The current hooks tree predicts no filename rename: user-prompt-submit.ts and skill-advisor-cli-fallback.ts already
use kebab-case. The phase first proves that inventory, then repairs live advisor registrations and stale path examples.
If the pinned baseline reveals another ordinary snake_case hook file, add only that file to the explicit rename map.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Every advisor hook source and registration is enumerated.
- [ ] Advisor-owned and cross-skill hook paths are distinguished.
- [ ] Hook event, envelope, timeout, and fail-open BASE behavior is recorded.

### Definition of Done
- [ ] No unclassified in-scope hook filename remains.
- [ ] All live advisor registrations and references resolve.
- [ ] A no-rename outcome includes zero-candidate evidence when applicable.
- [ ] Hook behavior and safety checks retain BASE parity.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Evidence-first audit with conditional path rename.

### Key Components
- Hook sources under hooks/claude and hooks/lib.
- Runtime registration/reference consumers in docs, settings, plugin bridge, and tests.
- Stable behavior contract: prompt input, additional context output, timeout, fail-open, and diagnostics.

### Data Flow
Runtime settings invoke a hook source, which probes the advisor CLI/daemon and emits a prompt-safe envelope. Path
changes affect only source resolution and documentation; event names and response fields stay unchanged.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Inventory every hook file and every registration/path literal.
- [ ] Classify current kebab names, exemptions, cross-skill paths, and any candidate rename.
- [ ] Capture hook discovery and representative behavior at BASE.

### Phase 2: Implementation
- [ ] If a candidate exists, rename it with a semantic map and update registrations/references.
- [ ] Repair stale advisor hook paths in SKILL, README, INSTALL_GUIDE, reference examples, plugin docs, and tests.
- [ ] Preserve current kebab filenames, runtime event names, environment keys, and code identifiers.

### Phase 3: Verification
- [ ] Prove the hook inventory has zero unclassified snake_case filenames.
- [ ] Resolve every advisor-owned registration to an existing source path.
- [ ] Run hook parity/fail-open/timeout smoke checks and compare output shape to BASE.
- [ ] Record the no-op or rename handoff for the subtree gate.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Inventory | Hook filenames and ownership | rg, filesystem manifest |
| Registration | Runtime/docs/test path resolution | path resolver and targeted scan |
| Behavior | Prompt input/output, timeout, fail-open | hook tests and smoke fixtures |
| Boundary | Cross-skill references and event identifiers | ownership ledger and targeted diff |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Hook runtime contract | Internal | Required | A path audit cannot distinguish behavior from naming |
| Reference-file map | Internal | Required | Reference filename and hook path updates can be confused |
| Runtime configuration | Internal | Required | Source-only verification misses real registrations |
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Wrong owner path, changed hook envelope, timeout/fail-open regression, or unexplained candidate.
- **Procedure**: Revert only the conditional hook path edits in the isolated worktree, restore the BASE registration
  map, and preserve the inventory ledger for the next attempt. A no-op result remains valid when all checks pass.
<!-- /ANCHOR:rollback -->
