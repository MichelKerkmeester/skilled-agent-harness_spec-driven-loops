---
title: "Implementation Plan: sk-prompt subtree rollup gate (017 phase 004.007)"
description: "Rollup verification plan for phase 007 of the sk-prompt kebab-case program: aggregate phases 001–006, run the final scope-aware census, and issue a reproducible pass/block result without new migration work."
trigger_phrases:
  - "sk-prompt rollup gate plan"
  - "sk-prompt kebab-clean plan"
  - "sk-prompt phase 007 plan"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/017-hyphen-naming-convention/008-component-migration/004-sk-prompt/007-skill-gate"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-hyphen-naming-convention/008-component-migration/004-sk-prompt/007-skill-gate"
    last_updated_at: "2026-07-14T18:04:33Z"
    last_updated_by: "codex"
    recent_action: "Authored the final sk-prompt aggregation and naming-cleanliness plan"
    next_safe_action: "Collect sibling verdicts and create the final scope-aware census"
    blockers: []
    key_files:
      - ".opencode/specs/sk-doc/017-hyphen-naming-convention/008-component-migration/004-sk-prompt/"
      - ".opencode/skills/sk-prompt/"
      - ".opencode/skills/sk-prompt/prompt-improve/"
      - ".opencode/skills/sk-prompt/prompt-models/"
    completion_pct: 0
    open_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

# Implementation Plan: sk-prompt subtree rollup gate

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | Complete `.opencode/skills/sk-prompt/` tree and phases 001–006 evidence |
| **Change class** | Read-only aggregation, scope-aware census, final gate |
| **Execution** | Sibling verdict matrix, disposition reconciliation, stale-reference scan |

### Overview
The gate first verifies that each sibling contract has passed, then reconciles their path maps and scans the final skill
surface for any unclassified non-kebab name or stale active reference. It emits a pass only when the evidence is complete;
it does not rename or repair anything discovered by the scan.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phases 001–006 have candidate evidence and checklist verdicts available.
- [ ] The final candidate SHA and BASE SHA are pinned.
- [ ] The 017 exemption record and each sibling disposition map are available.

### Definition of Done
- [ ] Every sibling phase is green with no contradictory ownership or release evidence.
- [ ] The final scope-aware census has no unknown in-scope snake_case filesystem name or stale active path.
- [ ] The pass/block matrix and reproducible evidence are handed to central validation.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Use two joined ledgers: phase → checklist verdict/evidence, and filesystem path → final classification/owner. A final
reference scan joins both ledgers so a path can be exempt without allowing its active consumers to remain stale.

### Key Components
- **Sibling matrix**: phases 001–006, their checklists, maps, and handoffs.
- **Surface census**: hub root, prompt-improve, prompt-models, playbook, benchmark, and active metadata paths.
- **Scope classifier**: authored in-scope, Python/package, tool-mandated, generated, frozen, identifier/data-key, or unknown.

### Data Flow
Sibling evidence → map reconciliation → final filesystem census → active reference resolution → rollup verdict and handoff.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Collect sibling checklist verdicts, map hashes, release evidence, and handoff records.
- [ ] Pin the final candidate/BASE SHAs and enumerate the complete skill surface.
- [ ] Reconcile overlapping root-consumer ownership without creating a new rename map.

### Phase 2: Implementation
- [ ] Classify each retained non-kebab filesystem name against the program exemptions and sibling evidence.
- [ ] Check active references against the final source-target maps and target existence.
- [ ] Record every mismatch as a blocking finding routed to the owning phase.

### Phase 3: Verification
- [ ] Re-run the census and stale-reference scan after evidence reconciliation.
- [ ] Confirm no sibling checklist or phase 006 release contradiction remains unresolved.
- [ ] Publish the final pass/block matrix and central-validation handoff without editing the skill surface.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | Read every sibling checklist and reconcile its P0/P1 verdicts and evidence paths |
| REQ-002 | Scan the complete skill tree and classify every retained non-kebab filesystem name; fail on unknown |
| REQ-003 | Resolve final path maps and search active consumers for stale sources |
| REQ-004 | Compare retained names with the 017 exemption record and each owning child disposition |
| REQ-005 | Record SHAs, commands, exit codes, census/map hashes, verdicts, and unresolved findings |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The gate depends on all sibling path maps and phase 006 release evidence. It is not a fallback implementation phase: a failed census returns to the owning child packet, while an unresolved release contradiction returns to the release workflow.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

There is no skill-surface mutation to roll back. If the gate fails, preserve the evidence, mark the relevant child phase
blocked, and rerun the owning verification after its explicitly authorized correction; do not patch the failure here.
<!-- /ANCHOR:rollback -->
