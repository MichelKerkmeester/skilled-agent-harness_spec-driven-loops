---
title: "Skill-Advisor Standards Alignment"
description: "The sk-code-opencode CommonJS rule conflicted with the OpenCode plugin loader requirement for ESM default export. A new OpenCode Plugin Exemption Tier was added and the skill-advisor plugin was aligned with non-exempt documentation standards."
trigger_phrases:
  - "skill advisor standards alignment"
  - "opencode plugin exemption tier"
  - "sk-code-opencode esm exemption"
  - "skill advisor jsdoc"
  - "skill advisor box header"
importance_tier: "important"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-31

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/002-skill-advisor/004-skill-advisor-production-hardening/003-advisor-standards-alignment` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-spec-kit-internals/002-skill-advisor/004-skill-advisor-production-hardening`

### Summary

The sk-code-opencode JavaScript standard required `module.exports` (CommonJS) for all files, but the OpenCode plugin loader mandates ESM default export per `@opencode-ai/plugin/dist/index.d.ts`. This packet added an explicit exemption tier for plugin entrypoints and helpers. It also brought `spec-kit-skill-advisor.js` into alignment with the remaining documentation standards: box-header fields, JSDoc, and section dividers. No plugin behavior or runtime logic was changed.

### Added
- OpenCode Plugin Exemption Tier (§10) in the JavaScript quality standards reference, exempting `.opencode/plugins/` and `.opencode/plugin-helpers/` entrypoints from the CommonJS `module.exports` requirement
- COMPONENT and PURPOSE fields in the spec-kit-skill-advisor.js box header
- Numbered ALL-CAPS section dividers (IMPORTS, CONSTANTS, HELPER, SIZE CAP, EVENT HELPER, PLUGIN FACTORY) in spec-kit-skill-advisor.js
- JSDoc blocks on the SpecKitSkillAdvisorPlugin default export and its six helpers (getAdvisorContext, runBridge, appendAdvisorBrief, clampPrompt, clampBrief, insertWithEviction)

### Changed
- Related Resources section renumbered from §10 to §11 in the JavaScript quality standards reference
- CommonJS P1 checklist item annotated with an exception note pointing to the new OpenCode Plugin Exemption Tier

### Fixed
- None.

### Verification
- Syntax check: `node --check .opencode/plugins/spec-kit-skill-advisor.js` — Pass, exit 0
- Build: `npm run build` in mcp_server — Pass, exit 0
- Focused Vitest: `vitest run tests/spec-kit-skill-advisor-plugin.vitest.ts` — Pass, 30/30
- Strict validation: `validate.sh --strict` — Pass, 0 errors / 0 warnings
- Diff inspection: confirmed only comment, JSDoc, box-header, and divider changes

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/sk-code-opencode/references/javascript/quality_standards.md` | Modified | Added §10 OpenCode Plugin Exemption Tier and renumbered Related Resources to §11 |
| `.opencode/skills/sk-code-opencode/references/javascript/javascript_checklist.md` | Modified | Added CommonJS P1 exemption note referencing the new plugin exemption tier |
| `.opencode/plugins/spec-kit-skill-advisor.js` | Modified | Added COMPONENT and PURPOSE box-header fields, 6 ALL-CAPS section dividers, and 7 JSDoc blocks |

### Follow-Ups
- No new tests were added because this packet intentionally made no behavior change.
- The post-save quality reviewer reported a non-blocking EISDIR reviewer error. No HIGH or MEDIUM issues require patching.
