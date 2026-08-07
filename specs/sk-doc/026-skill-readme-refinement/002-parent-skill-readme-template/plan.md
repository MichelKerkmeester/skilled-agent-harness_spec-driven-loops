---
title: "Implementation Plan: Phase 2 parent-skill (hub) README template"
description: "Create the parent-skill README template covering hub pitch, nested modes and packets, registry and manifest navigation, changelog conventions, hub scripts and commands, and validation."
trigger_phrases:
  - "phase 2 plan"
  - "parent skill readme plan"
  - "hub readme template plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/026-skill-readme-refinement/002-parent-skill-readme-template"
    last_updated_at: "2026-08-04T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Scaffolded phase 2 plan inside 026-skill-readme-refinement"
    next_safe_action: "Execute the template authoring per tasks.md"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/002-parent-skill-readme-template"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Implementation Plan: Phase 2 parent-skill (hub) README template

<!-- ANCHOR:summary -->
## 1. SUMMARY

Create `.opencode/skills/sk-doc/sk-create-skill/assets/parent-skill/parent-skill-readme-template.md`, the hub-level README template for parent skills. The template covers six mandated surfaces: hub pitch and purpose-first overview, nested packet and mode list with per-mode pointers, mode-registry and leaf-manifest navigation, changelog conventions, hub scripts and commands, and hub README validation. Guidance inside the template names the mcp-tooling and system-deep-loop hubs as structural examples. No fleet README and no other asset is touched. Rollback is a git revert of the creation commit.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

| Gate | Check | Tool |
|------|-------|------|
| Template path | File exists at the mandated parent-skill path | ls |
| Surface coverage | All six mandated hub surfaces present as template sections | rg per section heading |
| Section model | Numbered ALL-CAPS H2 headings with `---` dividers and OVERVIEW as the only required section | review + rg |
| HVR | Zero em dashes and zero semicolons in the template body | rg |
| Example alignment | Guidance names mcp-tooling and system-deep-loop | rg |
| Phase docs | validate.sh errors zero | validate.sh |
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

| Artifact | Change |
|----------|--------|
| `parent-skill-readme-template.md` | Create: hub pitch blockquote pattern, WHY THIS HUB EXISTS, MODES AND PACKETS with per-mode pointer rows, NAVIGATION covering `mode-registry.json` and `leaf-manifest.json`, CHANGELOG conventions, SCRIPTS AND COMMANDS, VERIFICATION, RELATED DOCUMENTS |
| Phase docs | spec.md, plan.md, tasks.md, checklist.md in this phase folder |

Section map for the template: pitch blockquote, AT A GLANCE rows, WHY THIS HUB EXISTS, MODES AND PACKETS, NAVIGATION, CHANGELOG, SCRIPTS AND COMMANDS, VERIFICATION, RELATED DOCUMENTS. The guidance prose references the mcp-tooling and system-deep-loop hubs as worked examples for the modes list, the registries, and the manifest.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

| Phase | Work |
|-------|------|
| Setup | Read the refined standalone template, read both example hub READMEs and their registries, inventory the parent-skill assets folder |
| Authoring | Draft the six mandated sections in template form, write the guidance prose, assemble the file at the mandated path |
| Verification | Readme validator, HVR grep, structural section grep, example-name grep, path check, phase validation |

Sequenced in tasks.md (T001-T010).
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Documentation test. The finished template is validated with `validate_document.py --type readme`, the HVR grep returns zero em dashes and zero semicolons in the template body, a structural grep confirms each of the six mandated sections exists, and a grep confirms the template names both structural example hubs. No runtime or UI test applies.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Risk | Mitigation |
|------------|------|------------|
| Refined standalone README template (phase 001) | Hub template style diverges | Follow the numbered ALL-CAPS H2 section model and the OVERVIEW-only required rule |
| Parent-skill asset family | Naming and marker mismatch | Inventory the assets folder before authoring |
| mcp-tooling and system-deep-loop hubs | Guidance describes a shape the hubs do not have | Read both hub READMEs and registries before drafting |
| sk-doc readme validator | Validation gate unavailable | Run the validator and record output in the checklist |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the template creation commit with `git revert` to remove the new template file. The phase touches only the new template file and this phase's docs, so the revert is clean and no fleet README, registry, manifest, or workflow file participates.
<!-- /ANCHOR:rollback -->
