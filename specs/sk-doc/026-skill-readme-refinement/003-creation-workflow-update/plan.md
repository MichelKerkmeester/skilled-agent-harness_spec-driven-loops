---
title: "Implementation Plan — Phase 003 — creation workflow README template wiring"
description: "Wire both README templates into the create-skill workflow with a choice rule and post-authoring validation."
trigger_phrases:
  - "phase 003 plan"
  - "creation workflow update plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/026-skill-readme-refinement/003-creation-workflow-update"
    last_updated_at: "2026-08-04T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Author Phase 003 implementation plan"
    next_safe_action: "Execute the creation workflow update"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/003-creation-workflow-update"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Implementation Plan — Phase 003 — creation workflow README template wiring

<!-- ANCHOR:summary -->
## 1. SUMMARY

Update `.opencode/skills/sk-doc/sk-create-skill/references/skill/creation-workflow.md` so both README templates are wired into the create-skill workflow: the refined standalone template for standalone skills and the new parent-skill template for parent hubs, with an explicit choice rule and post-authoring validation steps. The workflow is the only intended product change and the phase touches no template asset. Rollback is a git revert.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

| Gate | Check | Tool |
|------|-------|------|
| Standalone emission | Standalone step names the refined standalone template | grep `skill-readme-template.md` in the updated workflow |
| Parent emission | Parent hub step names the parent-skill template | grep `parent-skill-readme-template.md` in the updated workflow |
| Choice rule | All three cases stated (standalone, parent hub, child mode with own README) | grep + read back of the decision point |
| Validation steps | Validator, HVR grep, link check, version check appear after README authoring | grep + read back of the authoring step |
| Style | Zero em dashes, semicolons, Oxford commas and decimal headings in the workflow | rg over the changed file |
| Scope | No asset file changed | git diff path filter |
| Phase docs | validate.sh errors zero | validate.sh --strict |
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

| Artifact | Change |
|----------|--------|
| `references/skill/creation-workflow.md` | Add a README emission step per creation path, a template choice rule decision point and post-authoring validation steps while keeping all six workflow steps and the frontmatter contract intact |
| `references/skill/examples-and-maintenance.md` | Conditional: update only if it describes README authoring (scan result today: no README content) |
| `assets/skill/skill-readme-template.md` | Read only, phase 001 output, referenced by the new step |
| `assets/parent-skill/parent-skill-readme-template.md` | Read only, phase 002 output, referenced by the new step |
| `003-creation-workflow-update/{spec,plan,tasks,checklist}.md` | Phase documentation scaffolded now, evidence filled during execution |
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

| Phase | Work |
|-------|------|
| Setup | Read the current workflow end to end, inventory README references, read both templates, capture the baseline diff |
| Implementation | Add the standalone README step, the parent hub README step, the choice rule and the validation steps |
| Verification | HVR grep, link resolution, scope diff, phase validation, evidence into this checklist |

Sequenced in tasks.md (T001–T011).
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Documentation test: the updated workflow is re-read end to end, the style gate greps the changed file, every internal link resolves and the scope diff contains only the workflow file plus phase docs. Phase validation must report zero errors. No vault or runtime test applies.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Risk | Mitigation |
|------------|------|------------|
| Phase 001 refined standalone template | Workflow names a template whose sections changed | Re-read the asset before writing the step and mirror its section names |
| Phase 002 parent-skill template | Asset file may be missing if ordering slips | Verify the asset path exists before writing the step |
| mcp-obsidian pilot validation set | Validation steps drift from proven checks | Use validator, HVR grep and link guard exactly as proven in the pilot |
| Packet hard rule on fingerprints | completion_pct must stay 0 while the daemon is down | No completion metadata writes in this phase |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

`git revert` of this phase's commit restores the previous creation-workflow.md and removes the conditional examples-and-maintenance.md change if one landed. Template assets are never touched, so no rollback of assets is needed.
<!-- /ANCHOR:rollback -->
