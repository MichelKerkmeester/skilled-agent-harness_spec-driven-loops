---
title: "Tasks: Post-SpecKit Template Upgrade - Command Alignment"
description: "Reconstructed task list for the command alignment packet, derived from spec.md, implementation-summary.md and git history."
trigger_phrases:
  - "command alignment task list"
  - "post template upgrade tasks"
importance_tier: "normal"
contextType: "implementation"
---
> Reconstructed on 2026-10-07 from spec.md and git history. It was not written at the time.

# Tasks: Post-SpecKit Template Upgrade - Command Alignment

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Symbol | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Complete |
| `[B]` | Blocked |
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Command Alignment

- [x] Task 1.1: Standardize section headers across 14 command files (`🔜 WHAT NEXT?` to `📌 NEXT STEPS`)
- [x] Task 1.2: Remove parenthetical text from H2 headers in 11 command files
- [x] Task 1.3: Add a mandatory gate to `/memory:search`
- [x] Task 1.4: Fix argument-hint format in `/create:skill` and `/create:agent`
- [x] Task 1.5: Fix the cross-reference in `/memory:database`
- [x] Task 1.6: Add OUTPUT FORMATS sections to spec_kit commands
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: YAML Asset Alignment

- [x] Task 2.1: Analyze 20 YAML assets across spec_kit and create namespaces
- [x] Task 2.2: Fix spec_kit_plan YAMLs (Level 1 required files, version)
- [x] Task 2.3: Fix spec_kit_resume YAMLs (anchor-based memory retrieval)
- [x] Task 2.4: Fix spec_kit_research and handover YAMLs (version, critical rules)
- [x] Task 2.5: Add version and mode headers to 5 create YAMLs
- [x] Task 2.6: Restructure create_agent.yaml (unified permissions, terminology, modes)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] Task 3.1: Verify emoji vocabulary and section headers across commands
- [x] Task 3.2: Verify frontmatter and cross-reference fixes
- [x] Task 3.3: Verify YAML asset compliance (20/20)
- [x] Task 3.4: Record the verification matrix in `implementation-summary.md`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] 19/19 commands compliant with command_template.md
- [x] 20/20 YAML assets compliant with SpecKit v1.9.0
- [x] Cross-reference errors resolved
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Implementation Summary**: `implementation-summary.md`
- **Decision Record**: `decision-record.md`
<!-- /ANCHOR:cross-refs -->
