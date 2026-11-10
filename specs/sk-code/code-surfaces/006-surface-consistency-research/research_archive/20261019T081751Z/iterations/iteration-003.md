# Iteration 003

## Focus

Q2: How do the three references/ trees differ (topic folders vs flat files, shared/, workflow-implement/debug/verify), and what single layout fits all three without losing surface-specific content?

Q2 was already marked answered in the strategy after iteration 2. This pass rechecked the target grammar against the sk-doc hub-child guidance and clarified the two meanings of shared.

## Actions Taken

- Read the run config, state log, strategy, findings registry, and iteration 2 narrative. No saturated direction was recorded.
- Enumerated the three current references trees and compared their reference-map sections.
- Checked the three workflow link targets on disk and compared the link descriptions in each surface map.
- Compared the parent sk-code workflow contract with the sk-doc hub-child packet guidance.
- Loaded the active Codex deep-research agent definition and confirmed the iteration output paths before writing.

## Findings

### Common reference grammar

Use one structural grammar while preserving surface-owned topic names. Put topical references under a domain folder. Add another folder level only when it groups a real family. Keep the root exception for the shared workflow links:

    <surface>/references/
      workflow-implement.md    (symlink to the parent shared workflow)
      workflow-debug.md
      workflow-verify.md
      shared/                  (optional, surface-local cross-topic material)
      <domain>/<reference>.md
      <domain>/<family>/<reference>.md

This matches the content each surface already carries. sk-code-skilled groups language and config material, with deeper style, quality, and quick-reference families where needed. Obsidian combines root topical pages with smaller operations, quality, release, setup, and standards groups. Webflow groups by platform domain and keeps deeper implementation, debugging, and verification families. [SOURCE: .skilled/skills/sk-code/sk-code-skilled/SKILL.md:31] [SOURCE: .skilled/skills/sk-code/sk-code-skilled/SKILL.md:38] [SOURCE: .skilled/skills/sk-code/sk-code-obsidian/SKILL.md:53] [SOURCE: .skilled/skills/sk-code/sk-code-obsidian/SKILL.md:62] [SOURCE: .skilled/skills/sk-code/sk-code-webflow/SKILL.md:33] [SOURCE: .skilled/skills/sk-code/sk-code-webflow/SKILL.md:51]

The practical gap is Obsidian's topical pages at the references root. Group those into small domain folders while preserving filenames and content. Do not flatten Webflow's nested families or deepen every skilled reference for symmetry. The Obsidian map shows the root topical pages and existing categories; the other two maps already express domain or language groupings. [SOURCE: .skilled/skills/sk-code/sk-code-obsidian/SKILL.md:53] [SOURCE: .skilled/skills/sk-code/sk-code-obsidian/SKILL.md:59] [SOURCE: .skilled/skills/sk-code/sk-code-webflow/SKILL.md:33] [SOURCE: .skilled/skills/sk-code/sk-code-webflow/SKILL.md:38] [SOURCE: .skilled/skills/sk-code/sk-code-skilled/SKILL.md:31]

### Keep the shared tiers separate

The parent .skilled/skills/sk-code/shared/references/ owns the implement, debug, and verify doctrine. The hub says each surface gets links to those workflow files. The sk-doc child-packet canon also permits one shared workflow doctrine to live under the parent shared directory and be symlinked into every consuming packet. [SOURCE: .skilled/skills/sk-code/SKILL.md:42] [SOURCE: .skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md:299]

By contrast, a child references/shared/ folder holds material reused across that surface's own topics. sk-code-skilled calls its shared tier language-agnostic; Webflow calls its tier cross-language. The folder can stay absent when a surface has no such content. [SOURCE: .skilled/skills/sk-code/sk-code-skilled/SKILL.md:38] [SOURCE: .skilled/skills/sk-code/sk-code-webflow/SKILL.md:51]

The filesystem check found all three root workflow links in all three surfaces. The maps describe their routing role differently: Obsidian explicitly documents the trio, while Webflow says its workflow phases are covered by the split topic resources and that no root trio is assumed. That wording may describe routing ownership rather than missing links. Q4 should verify which paths the router and doctor checks consume before any move. [SOURCE: .skilled/skills/sk-code/SKILL.md:42] [SOURCE: .skilled/skills/sk-code/sk-code-obsidian/SKILL.md:62] [SOURCE: .skilled/skills/sk-code/sk-code-webflow/SKILL.md:55]

### Per-surface gaps

- **sk-code-skilled:** Keep the language/config grouping and its local shared tier. The flatter Python and Config leaves do not need artificial nesting. [SOURCE: .skilled/skills/sk-code/sk-code-skilled/SKILL.md:31] [SOURCE: .skilled/skills/sk-code/sk-code-skilled/SKILL.md:38]
- **sk-code-obsidian:** Move topical root pages into small domain folders, retaining the current workflow links and file content. Update maps and routing only after Q4 identifies their path consumers. [SOURCE: .skilled/skills/sk-code/sk-code-obsidian/SKILL.md:53] [SOURCE: .skilled/skills/sk-code/sk-code-obsidian/SKILL.md:62]
- **sk-code-webflow:** Keep its domain taxonomy and nested families. Clarify the root workflow links' routing role in its map after checking that role in Q4. [SOURCE: .skilled/skills/sk-code/sk-code-webflow/SKILL.md:33] [SOURCE: .skilled/skills/sk-code/sk-code-webflow/SKILL.md:55]

## Questions Answered

- Q2: How do the three references/ trees differ (topic folders vs flat files, shared/, workflow-implement/debug/verify), and what single layout fits all three without losing surface-specific content?

## Questions Remaining

- Q3: How do the supporting folders (assets, scripts, benchmark, manual-testing-playbook, changelog, README) differ, and which should every surface carry?
- Q4: What do the hub files (mode-registry.json, hub-router.json, leaf-manifest.json, graph-metadata.json, ROUTER.md), the doctor checks (parent-skill-check, sk-code-setup-check) and the advisor assume about each surface's layout, and what breaks if a surface moves files?
- Q5: What ordered migration plan, with a guarding check per step, brings each surface to the target layout?

## Next Focus

Q3: How do the supporting folders (assets, scripts, benchmark, manual-testing-playbook, changelog, README) differ, and which should every surface carry?

## Reflection

The stable recommendation is a shared layout grammar, not identical trees. It standardizes navigation and workflow entry paths while retaining surface-specific reference content. The route-consumer check belongs to Q4, before the Obsidian paths move.
