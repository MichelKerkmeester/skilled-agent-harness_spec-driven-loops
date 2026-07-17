---
title: "Implementation Plan: mcp-code-mode subtree skill gate (032 component 011 phase 007)"
description: "Aggregate the six preceding child reports, rerun the complete exemption-aware filesystem and reference census, and verify the mcp-code-mode subtree as one read-only naming gate."
trigger_phrases:
  - "mcp-code-mode subtree gate implementation plan"
  - "mcp-code-mode phase 007 implementation plan"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/008-component-migration/011-mcp-code-mode/007-skill-gate"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/008-component-migration/011-mcp-code-mode/007-skill-gate"
    last_updated_at: "2026-07-14T16:30:00Z"
    last_updated_by: "codex"
    recent_action: "Authored subtree gate plan"
    next_safe_action: "Collect sibling checklist evidence"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: mcp-code-mode subtree skill gate

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | Entire .opencode/skills/mcp-code-mode subtree |
| **Change class** | Read-only evidence aggregation and naming/reference rollup |
| **Execution** | Exact candidate tree after phases 001 through 006; no new migration work |

### Overview
The gate treats the six sibling contracts as inputs, not as substitutes for a fresh whole-surface check. It recomputes
the exemption-aware filesystem census, stale-path/link scan, executable checks, scenario parity, and changelog evidence,
then records one rollup verdict.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] All six sibling checklists and reports are available
- [ ] The final map hashes and exemption classifications are recorded
- [ ] The exact candidate tree and BASE are pinned

### Definition of Done
- [ ] Sibling P0 evidence is complete and internally consistent
- [ ] Whole-surface naming and reference scans are clean within scope
- [ ] Executable, link, scenario, and changelog/version gates pass without mutation
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- Evidence aggregator for phases 001 through 006, including no-op proofs from scripts/runtime and the phase-006 release-note verdict.
- Recursive path classifier with explicit rename, exempt, generated, tool-mandated, and frozen dispositions.
- Whole-surface reference resolver for package, scripts, references/assets, runtime, and manual-playbook paths.
- Read-only final report that records counts, map hashes, commands, exit codes, and any failed child pointer.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- Pin BASE and candidate SHAs and load all six sibling reports.
- Check that each sibling P0 result points at the same final candidate tree and map lineage.

### Phase 2: Rollup Verification
- Run the full mcp-code-mode filesystem census and classify every underscore-bearing name.
- Resolve active paths and links, run required syntax/package/playbook checks, and compare scenario/changelog evidence.

### Phase 3: Reporting
- Emit a pass only when every requirement is evidenced and the working tree remains unchanged.
- On failure, identify the owning child phase and stop the rollup; do not repair the subtree here.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | All six sibling checklists have P0 pass evidence for the exact candidate |
| REQ-002 | Recursive census has zero in-scope snake_case names and a complete exemption ledger |
| REQ-003 | Whole-surface stale-path and Markdown-link scans report zero active failures |
| REQ-004 | Node, shell, package-path, manual-playbook, and baseline-parity checks pass |
| REQ-005 | Phase-006 changelog/version report matches all final sibling outcomes |
| REQ-006 | Read-only diff/index evidence shows no new tracked mutation |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

This gate depends on the 032 exemption policy, immutable BASE, all six child checklists, final semantic maps, and the
central verification environment. It is the handoff into the next component parent only after its own report is accepted.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

The gate has no migration write path. If it fails, retain the evidence, return to the named sibling owner, and rerun the
rollup against the corrected candidate; discard only any untracked verifier output.
<!-- /ANCHOR:rollback -->
