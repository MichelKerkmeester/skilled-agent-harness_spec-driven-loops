---
title: "Implementation Plan: cli-external-orchestration subtree rollup gate (017 phase 005.008)"
description: "Read-only rollup plan for phase 008: reconcile phases 001–007, enumerate the complete cli-external-orchestration surface, resolve final references, and publish a reproducible pass/block result without new migration work."
trigger_phrases:
  - "cli-external subtree rollup gate plan"
  - "cli-external kebab-clean plan"
  - "cli-external phase 008 plan"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/019-hyphen-naming-convention/008-component-migration/005-cli-external-orchestration/008-skill-gate"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-hyphen-naming-convention/008-component-migration/005-cli-external-orchestration/008-skill-gate"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored cli-external rollup plan"
    next_safe_action: "Collect sibling verdicts and final census"
    blockers: []
    key_files:
      - ".opencode/specs/sk-doc/019-hyphen-naming-convention/008-component-migration/005-cli-external-orchestration/"
      - ".opencode/skills/cli-external-orchestration/"
      - ".opencode/skills/cli-external-orchestration/cli-opencode/"
      - ".opencode/skills/cli-external-orchestration/cli-claude-code/"
      - ".opencode/skills/cli-external-orchestration/cli-codex/"
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "The gate is read-only and routes new findings to sibling owners."
---
# Implementation Plan: cli-external-orchestration subtree rollup gate

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | Complete cli-external-orchestration tree and phases 001–007 evidence |
| **Change class** | Read-only aggregation, scope-aware census, final gate |
| **Execution** | Sibling verdict matrix, map reconciliation, stale-reference scan |

### Overview
The gate first checks every sibling contract, then joins their maps and scans the final hub/component/playbook/benchmark tree for unknown non-kebab names or stale active paths. It emits pass only when evidence is complete and performs no rename, repair, or release edit.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phases 001–007 have candidate evidence, checklist verdicts, maps, and release handoff available.
- [ ] Final candidate and BASE SHAs are pinned.
- [ ] The 017 exemption record and every sibling disposition hash are available.

### Definition of Done
- [ ] Every sibling phase is green with no contradictory ownership or release evidence.
- [ ] The final scope-aware census has no unknown in-scope snake_case name or stale active path.
- [ ] The pass/block matrix and reproducible evidence are handed to central validation without skill-surface mutation.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Use two joined ledgers: phase → checklist verdict/evidence, and filesystem path → final classification/owner. A final reference scan joins both so an exempt name cannot hide a stale consumer.

### Key Components
- **Sibling matrix**: phases 001–007, their checklists, maps, hashes, and handoffs.
- **Surface census**: hub root, cli-opencode, cli-claude-code, cli-codex, four playbook trees, and benchmark.
- **Scope classifier**: authored in-scope, Python/package, tool-mandated, generated, frozen, identifier/data-key, or unknown.

### Data Flow
Sibling evidence → map reconciliation → final filesystem census → active-reference resolution → rollup verdict and owner-routed findings.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Collect sibling checklist verdicts, map hashes, benchmark dispositions, release evidence, and handoffs.
- [ ] Pin final candidate/BASE SHAs and enumerate the complete skill surface.
- [ ] Reconcile overlapping root-consumer ownership without creating a new rename map.

### Phase 2: Implementation
- [ ] Classify each retained non-kebab filesystem name against 017 exemptions or sibling evidence.
- [ ] Resolve active references against all final source-target maps and target existence.
- [ ] Record every mismatch as a blocking finding routed to the owning phase.

### Phase 3: Verification
- [ ] Re-run the census and stale-reference scan after evidence reconciliation.
- [ ] Confirm no sibling P0 or release contradiction remains unresolved.
- [ ] Publish the final pass/block matrix without editing the skill surface.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | Read every sibling checklist and reconcile P0/P1 verdicts, maps, hashes, and evidence paths |
| REQ-002 | Scan the complete surface and classify every retained non-kebab filesystem name; fail on unknown |
| REQ-003 | Resolve final maps and search skill/README/router/playbook/asset/benchmark consumers for stale source paths |
| REQ-004 | Compare retained names with 017 exemptions and each owning child disposition |
| REQ-005 | Record SHAs, commands, exit codes, census/map hashes, release verdict, and findings |
| REQ-006 | Confirm the gate's diff contains only rollup evidence and no migration mutation |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The gate depends on all sibling path maps, phase 006 benchmark evidence, and phase 007 release evidence. It is not a fallback implementation phase: a failed census returns to the owning child, and an unresolved release contradiction returns to the release workflow.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

There is no skill-surface mutation to roll back. If the gate fails, preserve the evidence, route the finding to its owner, and rerun the rollup after an explicitly authorized correction; do not patch the failure here.
<!-- /ANCHOR:rollback -->

