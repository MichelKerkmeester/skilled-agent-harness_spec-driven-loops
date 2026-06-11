---
title: Skill Authoring Checklist
description: Checklist for authoring or modifying sk-* skills under `.opencode/skills/` with correct metadata, resources, and validation.
trigger_phrases:
  - "skill authoring checklist"
  - "opencode skill metadata"
  - "skill resource layout"
  - "skill validation path"
importance_tier: normal
contextType: implementation
---

# Skill Authoring Checklist

## 1. PURPOSE

This checklist keeps new and modified OpenCode skills consistent with the shared skill contract. Use it to verify the skill metadata, resource layout, versioning, and validation path before handing the skill to another runtime or authoring command.

## 2. WHEN TO USE

- Use this when authoring a new sk-* skill under `.opencode/skills/`.
- Use this when modifying an existing skill's frontmatter, `SKILL.md` structure, allowed tools, bundled references, assets, or scripts.
- Use this when promoting a skill from a local draft into the shared OpenCode skill inventory.
- Use this when a skill changes routing behavior, resource discovery, or version metadata.

## 3. PRE-CHECKS

- [ ] Read existing canonical skills at `.opencode/skills/sk-doc/SKILL.md`, `.opencode/skills/sk-code/SKILL.md`, and `.opencode/skills/sk-git/SKILL.md`.
- [ ] Read `sk-doc` source rules at `.opencode/skills/sk-doc/references/specific/skill_creation.md`.
- [ ] Verify whether the target skill uses a 3-part version or a 4-part version; `sk-code` uses 4-part versions such as `3.2.0.0`, while `sk-doc` currently uses a 3-part series.
- [ ] Confirm `allowed-tools` is explicit and no broader than the workflow needs.
- [ ] Keep the frontmatter description to 1-2 sentences that explain when the skill should activate.
- [ ] Verify bundled `references/`, `assets/`, and `scripts/` are separated by purpose, not convenience.

## 4. STEPS

1. Define the skill's activation boundary before drafting content.
2. Create or update `SKILL.md` with required frontmatter, a focused description, and the standard sections used by canonical skills.
3. Put detailed standards in `references/`, reusable output material in `assets/`, and deterministic helpers in `scripts/`.
4. Add resource-routing guidance in Smart Routing only when the skill has conditional resources.
5. Add or update `description.json` with matching version, keywords, and trigger examples.
6. Add changelog coverage when the skill has a versioned release stream.
7. Check that new links resolve from the file that contains them.

## 5. POST-CHECKS

- [ ] Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <path> --strict` when the skill change is part of a spec folder.
- [ ] Run `python3 .opencode/skills/sk-code/assets/scripts/verify_alignment_drift.py --root .opencode/skills/<skill-name>` for OpenCode alignment drift.
- [ ] grep verification: `rg -n "version:|allowed-tools:|## 1\\. WHEN TO USE|## 2\\. SMART ROUTING" .opencode/skills/<skill-name>/SKILL.md`.
- [ ] grep verification: `rg -n "\"version\"|\"keywords\"" .opencode/skills/<skill-name>/description.json`.
- [ ] Cross-runtime mirror parity check if the skill is referenced by mirrored agents or commands.

## 6. RELATED RESOURCES

- sk-doc references/specific/skill_creation.md (source-of-truth for skill structure rules)
- Prior examples: `.opencode/skills/sk-doc/SKILL.md`, `.opencode/skills/sk-code/SKILL.md`, `.opencode/skills/sk-git/SKILL.md`
- Verification recipes: `.opencode/skills/sk-code/assets/opencode/checklists/universal_checklist.md`
