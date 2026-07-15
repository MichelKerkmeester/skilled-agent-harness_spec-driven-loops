---
title: "Implementation Plan: sk-git skill gate (017 phase 008/012/006)"
description: "Read-only implementation plan for the sk-git rollup gate. The verifier will reconcile sibling SOL evidence, scan the complete tracked skill surface against the 017 exemption set, and prove the component is naming-clean without performing new migration work."
trigger_phrases:
  - "sk-git skill gate plan"
  - "017 sk-git rollup verification"
  - "component naming gate plan"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/019-hyphen-naming-convention/008-component-migration/012-sk-git/006-skill-gate"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-hyphen-naming-convention/008-component-migration/012-sk-git/006-skill-gate"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored the sk-git rollup plan and full-surface evidence path"
    next_safe_action: "Run the gate after sibling phases 001 through 005 are accepted"
    blockers: []
    key_files:
      - ".opencode/skills/sk-git/"
      - "../001-references/checklist.md"
      - "../002-assets/checklist.md"
      - "../003-manual-testing-playbook/checklist.md"
      - "../004-benchmark/checklist.md"
      - "../005-changelog-verify/checklist.md"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: sk-git skill gate

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | Complete tracked sk-git tree and five sibling phase evidence sets |
| **Change class** | Read-only rollup verification |
| **Execution** | Inspect the pinned candidate; mutate no tracked file |

### Overview
The gate will first reconcile sibling status, scope counts, map hashes, and no-mutation proofs. It will then scan every tracked path under sk-git, classify names against the 017 exemption boundary, resolve active path references, compare final version evidence, and issue a blocking pass or a routed failure.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phases 001 through 005 have final checklists, SOL reports, map hashes, and scope counts.
- [ ] The exact candidate commit and BASE SHA are pinned.
- [ ] The full tracked sk-git path inventory and exemption rules are available.

### Definition of Done
- [ ] Sibling evidence is complete and internally consistent.
- [ ] The full sk-git naming scan finds no unexempt in-scope snake_case path.
- [ ] Active path references and version evidence are closed, and the gate itself made no mutation.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- **Sibling evidence rollup**: consumes each child checklist and report without replacing its owning acceptance contract.
- **Aggregate map reconciliation**: compares counts and hashes for references, assets, manual playbook, benchmark profiles, and changelog evidence.
- **Full-surface naming scan**: scans all tracked sk-git paths, not only the four migration leaves, then applies the 017 exemptions.
- **Pointer/version closure**: resolves active source paths and compares changelog, SKILL.md, and README.md versions.
- **Read-only gate**: any failure is reported with owner and evidence; no repair happens here.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- Pin candidate and BASE SHAs.
- Collect sibling report hashes, map counts, P0 outcomes, and no-mutation proofs.
- Snapshot the complete tracked sk-git path and active-pointer inventories.

### Phase 2: Implementation
- No migration implementation is permitted.
- Reconcile the aggregate source-to-target dispositions and exemption classifications.
- Run the all-path naming scan and active-pointer resolver.
- Compare the final version/changelog evidence.

### Phase 3: Verification
- Require every sibling P0 contract and aggregate count to pass.
- Require zero unexempt in-scope snake_case filesystem names and zero stale active source pointers.
- Require an empty gate diff and record all commands, exit codes, counts, hashes, and routed failures in the SOL report.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | Read sibling checklists/reports and verify P0 status, hashes, counts, and no stray implementation artifacts. |
| REQ-002 | Recompute aggregate path counts and hashes; compare references 9, assets 3, manual playbook 49, benchmark profiles 2, and changelog evidence. |
| REQ-003 | Scan every tracked path under sk-git and classify each underscore name against the exact 017 exemption boundary. |
| REQ-004 | Resolve active path references and compare changelog/v1.3.2.0.md with SKILL.md and README.md versions. |
| REQ-005 | Capture status/diff before and after; require no gate mutation. |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Sibling phases 001 through 005 | Internal | Required | The rollup cannot distinguish missing work from a gate failure. |
| 017 convention and frozen map | Internal | Required | Naming and exemption classification are undefined. |
| Full tracked sk-git inventory | Internal | Required | A partial scan can produce a false pass. |
| Final candidate commit | Internal | Required | No-mutation and hash evidence cannot be pinned. |
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Any sibling blocker, unclassified path, stale pointer, count/hash mismatch, or gate mutation.
- **Procedure**: Do not repair in the gate. Route the finding to the owning sibling phase, rerun that phase's contract, and rerun the full rollup on the corrected pinned candidate.
<!-- /ANCHOR:rollback -->
