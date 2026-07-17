---
title: "Feature Specification: sk-prompt subtree rollup gate (032 phase 004.007)"
description: "This verification-only rollup gate aggregates phases 001–006 and proves the complete sk-prompt skill surface is kebab-clean within the 032 exemption boundary. It performs no new rename or reference migration."
trigger_phrases:
  - "sk-prompt naming rollup gate"
  - "sk-prompt kebab-clean verification"
  - "sk-prompt phase 007 gate"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/008-component-migration/004-sk-prompt/007-skill-gate"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/008-component-migration/004-sk-prompt/007-skill-gate"
    last_updated_at: "2026-07-14T18:04:33Z"
    last_updated_by: "codex"
    recent_action: "Authored the sk-prompt subtree rollup-gate specification"
    next_safe_action: "Collect sibling checklist evidence and run the scope-aware final census"
    blockers: []
    key_files:
      - ".opencode/specs/sk-doc/020-hyphen-naming-convention/008-component-migration/004-sk-prompt/"
      - ".opencode/skills/sk-prompt/"
      - ".opencode/skills/sk-prompt/prompt-improve/"
      - ".opencode/skills/sk-prompt/prompt-models/"
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "This gate aggregates sibling evidence and does not introduce a new migration map."
      - "The final scan must classify retained non-kebab names against the 032 exemption and sibling disposition records."
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: sk-prompt subtree rollup gate

> Final verification phase under the sk-prompt component parent: predecessor `006-changelog-verify`; no successor migration phase.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | sk-doc/020-hyphen-naming-convention/008-component-migration/004-sk-prompt/007-skill-gate |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-14 |
| **Owner skill** | sk-prompt |
| **Origin** | Final rollup gate for the sk-prompt component subtree under the 032 kebab-case filesystem-naming program |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

Independent child phases can each pass while a cross-boundary snake_case name, stale reference, missing exemption record,
or incomplete release handoff remains elsewhere in the sk-prompt surface. This phase aggregates all sibling evidence and
performs one scope-aware census of `.opencode/skills/sk-prompt/`; it reports gaps and does not perform new migration work.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Verify the blocking checklists and handoffs for phases 001–006 are complete and mutually consistent.
- Scan the hub, prompt-improve, prompt-models, playbook, benchmark, and active metadata surfaces for retained in-scope snake_case filesystem names.
- Confirm every retained non-kebab name has a valid 032 exemption, tool-mandated/protected disposition, generated/frozen disposition, or sibling-owned evidence record.
- Confirm active path references resolve after all child migrations and that phase 006 release evidence matches the final map.
- Aggregate the final evidence and issue a pass/block result for the sk-prompt subtree.

### Out of Scope
- Any new rename, reference rewrite, changelog edit, metadata repair, code/script change, or benchmark/playbook content change.
- Python `.py` filenames and Python package directories, tool-mandated names, generated/lockfile output, frozen history, code identifiers, data keys, and frontmatter fields except for classification evidence.
- The assigned spec-folder documents themselves as a migration surface.

### Files to Inspect

| File Path | Verification |
|-----------|--------------|
| `004-sk-prompt/001-*` through `006-*` | Child checklist, map, handoff, and release-evidence aggregation |
| `.opencode/skills/sk-prompt/` | Final scope-aware filesystem census and active reference resolution |
| `.opencode/skills/sk-prompt/prompt-improve/` | Final packet, playbook, benchmark, changelog, and metadata coverage |
| `.opencode/skills/sk-prompt/prompt-models/` | Final packet, benchmark output, changelog, and metadata coverage |
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 [P0] | Every sibling phase is complete | Phases 001–006 have passing blocking checklists, evidence, and consistent handoffs |
| REQ-002 [P0] | The whole skill surface is kebab-clean by scope | No in-scope authored snake_case filesystem name remains without an approved recorded disposition |
| REQ-003 [P0] | Active references are closed | No stale path references point to a renamed source, and all mapped targets resolve |
| REQ-004 [P1] | Exemptions are not over-applied | Each retained non-kebab name is classified with evidence; identifiers and data keys are not treated as filesystem candidates |
| REQ-005 [P1] | Rollup evidence is reproducible | The final census, sibling verdict matrix, command results, and unresolved findings are recorded for central validation |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All sibling P0 checklist contracts pass and their maps do not conflict.
- **SC-002**: The scope-aware final census finds no unclassified in-scope snake_case filesystem name or stale active path.
- **SC-003**: The final evidence distinguishes migration completion from approved exemptions and release-record status.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

The main risk is declaring the subtree clean from sibling status alone and missing a path introduced or preserved outside an individual map. The gate depends on the child evidence and must fail closed on a census mismatch, stale link, conflicting disposition, or unresolved phase 006 release contradiction.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None blocking. Any newly discovered path is a gate failure to route back to the owning child phase; this gate must not absorb new migration scope.
<!-- /ANCHOR:questions -->
