# Iteration 10: maintainability — skill structure vs sk-doc standards

Reviewed: .opencode/skills/sk-design-md-generator/SKILL.md, .opencode/skills/sk-design-md-generator/changelog/v1.0.0.0.md, .opencode/skills/sk-design-md-generator/references/extraction_workflow.md, .opencode/skills/sk-design-md-generator/assets/cardinal_rules_card.md

Findings: 4 (P0=0 P1=0 P2=4)


## F010-01 [P2] Version string mismatch between SKILL.md frontmatter and changelog
- File: .opencode/skills/sk-design-md-generator/SKILL.md:5
- Evidence: SKILL.md:5 declares `version: 1.0.0` (three-segment). The changelog file is named `v1.0.0.0.md` and its H1 reads `v1.0.0.0 - First Stable Release` (four-segment). The spec at 152-sk-design-md-generator and graph-metadata.json both lack an explicit version field, so there is no authoritative tie-breaker.
- Fix: Align to a single version-segment convention. The house practice for global component changelogs uses four-segment (vA.B.C.D), so update SKILL.md frontmatter `version: 1.0.0.0` to match the changelog, or vice versa.


## F010-02 [P2] Dead link to tool/README.md in invocation section
- File: .opencode/skills/sk-design-md-generator/SKILL.md:267
- Evidence: SKILL.md:267 reads 'Real extract flags (see `tool/README.md`): ...'. Neither `tool/README.md` nor any README under `tool/` exists on disk (glob returns no files). The only README is at the skill root.
- Fix: Either ship a minimal `tool/README.md` documenting extract flags, or re-point the reference to `INSTALL_GUIDE.md` which already covers extract flags (line 100-113).


## F010-03 [P2] Spec continuity key_files points to a non-existent file
- File: .opencode/specs/skilled-agent-orchestration/152-sk-design-md-generator/spec.md:21
- Evidence: spec.md `_memory.continuity.key_files` lists only `".opencode/skills/sk-design-md-generator/tool/design-md-workflow.md"`. Glob confirms no file at that path exists. The shipped skill's canonical format doc is `tool/resources/design-md-format.md`. A resuming agent following the spec would look for a missing file.
- Fix: Update spec.md `_memory.continuity.key_files` to list the actual shipped files: `tool/resources/design-md-format.md`, `SKILL.md`, `references/extraction_workflow.md`, etc.; or remove the stale entry.


## F010-04 [P2] Sections 5 (REFERENCES) and 8 (REFERENCES AND RELATED RESOURCES) duplicate content
- File: .opencode/skills/sk-design-md-generator/SKILL.md:315
- Evidence: §5 (line 315-350) and §8 (line 403-415) both enumerate the tool resource docs (design-md-format.md, writing-style-guide.md, etc.), the gold-standard examples (stripe/vercel/linear/supabase), the skill-owned references, the related skills, and integration contracts. For example, §5:337 says 'mcp-figma (extracts from Figma Desktop, not live URLs)' and §8:411 repeats 'mcp-figma (extracts from Figma Desktop, not live URLs)'. Any resource addition/deletion must be synced across two non-adjacent sections.
- Fix: Collapse the overlapping content. Keep §5 as the canonical reference list and reduce §8 to a 2-3 line pointer back to §5 and §2 (the router), removing the duplicated entries.
