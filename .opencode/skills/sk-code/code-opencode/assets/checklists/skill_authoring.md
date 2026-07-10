---
title: Skill Authoring Checklist
description: Checklist for authoring or modifying OpenCode skills with correct metadata, parent-hub files, resources, and validation.
trigger_phrases:
  - "skill authoring checklist"
  - "opencode skill metadata"
  - "skill resource layout"
  - "skill validation path"
importance_tier: normal
contextType: implementation
version: 1.0.0.14
---

# Skill Authoring Checklist

Checklist for authoring or modifying OpenCode skills with correct metadata, resource layout, parent-hub routing files, versioning, and validation.

## 1. OVERVIEW

### Purpose

This checklist keeps new and modified OpenCode skills consistent with the live skill contract. Use it to verify whether the skill is a flat skill or a parent-hub skill, then check metadata, resource layout, routing files, versioning, and validation before handing the skill to another runtime or authoring command.

### Usage

- Use this when authoring a new skill under `.opencode/skills/`.
- Use this when modifying an existing skill's frontmatter, `SKILL.md` structure, allowed tools, bundled references, assets, or scripts.
- Use this when promoting a skill from a local draft into the shared OpenCode skill inventory.
- Use this when a skill changes routing behavior, resource discovery, or version metadata.
- Use this when converting a flat skill into a parent-hub skill with nested mode packets.

---

## 2. PRE-CHECKS

- [ ] Read the live parent-hub example at `.opencode/skills/sk-code/SKILL.md`, `.opencode/skills/sk-code/graph-metadata.json`, `.opencode/skills/sk-code/mode-registry.json`, and `.opencode/skills/sk-code/hub-router.json` before copying a hub pattern.
- [ ] Read `sk-doc` source rules at `.opencode/skills/sk-doc/create-skill/references/README.md` and the parent-hub pattern at `.opencode/skills/sk-doc/create-skill/references/parent_skill/parent_skills_nested_packets.md`.
- [ ] Decide the skill shape: flat skill or parent-hub skill. A parent hub has one advisor-routable identity and nested mode packets.
- [ ] For any parent hub, require hub-level `graph-metadata.json`, `mode-registry.json`, `hub-router.json`, and `description.json`; nested packets must not carry their own `graph-metadata.json`.
- [ ] Verify whether the target skill uses a 3-part version or a 4-part version; `.opencode/skills/sk-code/SKILL.md` uses a 4-part version.
- [ ] Confirm skill frontmatter `allowed-tools` is explicit and no broader than the workflow needs.
- [ ] Keep the frontmatter description to 1-2 sentences that explain when the skill should activate.
- [ ] Verify bundled `references/`, `assets/`, and `scripts/` are separated by purpose, not convenience.

---

## 3. STEPS

1. Define the skill's activation boundary before drafting content.
2. Choose the shape.
   - Flat skill: one `SKILL.md` plus optional `references/`, `assets/`, `scripts/`, and `description.json`.
   - Parent-hub skill: hub `SKILL.md`, `description.json`, `graph-metadata.json`, `mode-registry.json`, `hub-router.json`, and nested packet folders.
3. Create or update `SKILL.md` with required frontmatter, a focused description, and the standard sections used by the live example.
4. For parent hubs, keep routing in `mode-registry.json` and `hub-router.json`; keep workflow or surface detail inside nested packet `SKILL.md` files.
5. For parent hubs, keep a single advisor identity in hub-level `graph-metadata.json`; do not add packet-level graph metadata.
6. Put detailed standards in `references/`, reusable output material in `assets/`, and deterministic helpers in `scripts/`.
7. Add resource-routing guidance in Smart Routing only when the skill has conditional resources.
8. Add or update `description.json` with matching version, keywords, and trigger examples.
9. Add changelog coverage when the skill has a versioned release stream.
10. Check that new links resolve from the file that contains them.

---

## 4. POST-CHECKS

- [ ] Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh` against the owning spec folder when the skill change is part of a spec folder.
- [ ] Run `python3 .opencode/skills/sk-code/code-opencode/assets/scripts/verify_alignment_drift.py --root .opencode/skills/sk-code` for the live parent-hub example; use the same script with the actual target skill root when reviewing another skill.
- [ ] For a flat skill, verify the skill frontmatter includes `description`, `allowed-tools`, and `version` when the skill's family uses versions.
- [ ] For a parent hub, verify `mode-registry.json` has `modes[]` entries with `workflowMode`, `packetKind`, `backendKind`, `packet`, `packetSkillName`, `toolSurface`, and `advisorRouting`.
- [ ] For a parent hub, verify `hub-router.json` resources resolve on disk and the hub-level `graph-metadata.json` is the only graph identity for the skill family.
- [ ] grep verification for the live parent-hub example: `rg -n "mode-registry.json|graph-metadata.json|packetKind|advisorRouting|hub-router.json" .opencode/skills/sk-code/SKILL.md .opencode/skills/sk-code/mode-registry.json .opencode/skills/sk-code/graph-metadata.json .opencode/skills/sk-code/hub-router.json`.

---

## 5. RELATED RESOURCES

- `.opencode/skills/sk-doc/create-skill/references/README.md` (source index for skill structure rules)
- `.opencode/skills/sk-doc/create-skill/references/parent_skill/parent_skills_nested_packets.md` (parent-hub structure and metadata contract)
- Parent-hub example: `.opencode/skills/sk-code/SKILL.md`, `.opencode/skills/sk-code/graph-metadata.json`, `.opencode/skills/sk-code/mode-registry.json`, `.opencode/skills/sk-code/hub-router.json`
- Verification recipes: `.opencode/skills/sk-code/code-opencode/assets/checklists/universal_checklist.md`
