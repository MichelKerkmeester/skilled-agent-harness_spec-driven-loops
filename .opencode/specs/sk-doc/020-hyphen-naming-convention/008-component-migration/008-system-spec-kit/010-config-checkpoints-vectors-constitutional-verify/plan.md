---
title: "Implementation Plan: Config, checkpoints, vectors, and constitutional verification (032 subtree 008 phase 010)"
description: "This verify-only phase audits the runtime agent directories and adjacent system-spec-kit config, checkpoint, vector, and constitutional surfaces for permitted snake_case filesystem names. The pinned inventory has zero rename candidates in the three runtime agent directories; generated/vector/checkpoint artifacts and tool-mandated names retain their exempt disposition."
trigger_phrases:
  - "system-spec-kit agent directory naming audit"
  - "config checkpoints vectors constitutional verify"
  - "zero agent rename candidates"
  - "system-spec-kit phase 010"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/008-component-migration/008-system-spec-kit"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/008-component-migration/008-system-spec-kit/010-config-checkpoints-vectors-constitutional-verify"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Planned zero-candidate verification"
    next_safe_action: "Repeat the scoped zero-candidate scan against the pinned BASE"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Implementation Plan: Config, checkpoints, vectors, and constitutional verification

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | `.opencode/agents/`, `.claude/agents/`, `.codex/agents/`, and adjacent system-spec-kit support directories |
| **Change class** | Verify-only candidate census and exemption classification |
| **Execution** | Read-only scan pinned to BASE; no migration |

### Overview
Enumerate each runtime agent directory and adjacent support surface, prove the empty agent rename set, classify every underscore-bearing artifact, and hand the evidence to phases 011 and 012.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] BASE SHA and the exact scan roots are recorded.
- [ ] Runtime agent, config, checkpoint, vector, constitutional, and runtime boundaries are listed.
- [ ] Exemption rules for generated artifacts, vector/checkpoint stores, Python targets, and tool names are available.

### Definition of Done
- [ ] `.opencode/agents/`, `.claude/agents/`, and `.codex/agents/` each report zero permitted candidates.
- [ ] Every adjacent underscore-bearing path has an explicit disposition.
- [ ] The audited runtime surfaces have no implementation diff.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
- Scan the three agent roots independently; do not infer the result from another runtime directory.
- Separate authored filesystem names from generated checkpoint/vector artifacts and exact tool-mandated names.
- Preserve the empty candidate set as a first-class result, not as an omitted section.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- Pin BASE and enumerate all three runtime agent roots plus the five adjacent support roots.
- Capture the file/directory inventory and identify every basename containing an underscore.

### Phase 2: Verification
- Confirm agent definition filenames and directories are already kebab-compliant or exact tool names.
- Classify vector database names, checkpoint snapshots, generated metadata, Python targets, package directories, and frozen content.
- Record the zero-candidate assertion separately for each runtime agent root.

### Phase 3: Handoff
- Review the report for unknown dispositions and any accidental write outside the documentation packet.
- Pass the evidence ledger to the changelog verifier and the subtree rollup gate.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | Independent path inventory and candidate scan for each runtime agent directory. |
| REQ-002 | Disposition ledger covering config, checkpoints, vectors, constitutional, and runtime surfaces. |
| REQ-003 | BASE-pinned command transcript with an explicit empty candidate set. |
| REQ-004 | Scoped diff confirms only assigned documentation files changed. |
| REQ-005 | Handoff ledger has no unknown disposition and is retained for the phase 012 rollup. |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Program exemption set | Policy | Required | The zero-candidate result cannot be classified correctly. |
| Runtime agent roots | Source | Required | Missing a root invalidates the assertion. |
| Phase 011 changelog verify | Internal | Downstream | Release evidence cannot claim complete coverage. |
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

No runtime rollback is applicable because this phase is read-only. If a scan or report is wrong, discard the report and rerun the scoped census against the same pinned BASE; do not rename or reclassify an artifact to force a green result.
<!-- /ANCHOR:rollback -->
