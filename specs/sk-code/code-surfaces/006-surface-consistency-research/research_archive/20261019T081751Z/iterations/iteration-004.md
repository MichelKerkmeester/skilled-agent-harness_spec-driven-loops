# Iteration 4

## Focus

Q2: How do the three references/ trees differ (topic folders vs flat files, shared/, workflow-implement/debug/verify), and what single layout fits all three without losing surface-specific content?

## Actions Taken

- Read the three live SKILL.md reference maps and inventoried each current references/ tree, including the root workflow symlinks and their resolved targets.
- Compared the live Obsidian map with the packet's carried-forward context. The packet says Obsidian has no workflow-verify.md, while its current map lists implement, debug, and verify as symlinks to the parent shared/references/. The current checkout confirms all three links resolve. Treat the old context as stale for this path. [SOURCE: .skilled/skills/sk-code/sk-code-obsidian/SKILL.md:62]
- The registry already marks Q2 answered at iteration 2, but the current iteration focus repeats it. This pass validates and sharpens that answer against the current tree.

## Findings

### Target layout

Use one structural contract with surface-owned names and depth:

    references/
      workflow-implement.md  -> ../../shared/references/workflow-implement.md
      workflow-debug.md      -> ../../shared/references/workflow-debug.md
      workflow-verify.md     -> ../../shared/references/workflow-verify.md
      shared/                # optional, only for surface-local cross-topic guidance
      <domain>/
        <reference>.md
        <subtopic>/           # add when a real family benefits from another level
          <reference>.md

Keep the three workflow files as root aliases to the parent’s canonical workflow references. Document their role in every surface map; their presence is compatibility/discovery structure, not a reason to duplicate the workflow content. Obsidian already states this explicitly. The Skilled and Webflow maps describe their split phase resources and say they do not assume a root workflow trio, so clarify the alias role there rather than removing the links. [SOURCE: .skilled/skills/sk-code/sk-code-obsidian/SKILL.md:62] [SOURCE: .skilled/skills/sk-code/sk-code-skilled/SKILL.md:46] [SOURCE: .skilled/skills/sk-code/sk-code-webflow/SKILL.md:55]

Treat references/shared/ as optional and surface-local. Keep it when multiple domains within that surface genuinely share guidance; do not require an empty or cosmetic directory on every surface. Skilled uses it for language-agnostic patterns and hook/workflow guardrails, while Webflow uses it for cross-language workflow and enforcement material. Obsidian’s reference map is plugin-specific and has no equivalent shared tier. [SOURCE: .skilled/skills/sk-code/sk-code-skilled/SKILL.md:38] [SOURCE: .skilled/skills/sk-code/sk-code-webflow/SKILL.md:51] [SOURCE: .skilled/skills/sk-code/sk-code-obsidian/SKILL.md:53]

### Per-surface gaps

- **sk-code-skilled:** Keep the language-first groups and the local shared tier. TypeScript, Rust, and Shell use nested families; Python and Config have shallow style/quality/quick-reference files. That variation fits the target: group by language, and add depth only when the files form a useful family. The map should clarify that the root workflow files are aliases to parent doctrine; do not flatten the language tree. [SOURCE: .skilled/skills/sk-code/sk-code-skilled/SKILL.md:31] [SOURCE: .skilled/skills/sk-code/sk-code-skilled/SKILL.md:32] [SOURCE: .skilled/skills/sk-code/sk-code-skilled/SKILL.md:38] [SOURCE: .skilled/skills/sk-code/sk-code-skilled/SKILL.md:46]

- **sk-code-obsidian:** This is the main tree-shape gap. The map lists plugin-specific references mostly at the root, alongside smaller operations/, quality/, release/, setup/, and standards/ groups. Move only topical root pages that form coherent families into those or similarly small domain folders, preserving filenames and content. Keep the three root workflow aliases; the current map already documents them. [SOURCE: .skilled/skills/sk-code/sk-code-obsidian/SKILL.md:53] [SOURCE: .skilled/skills/sk-code/sk-code-obsidian/SKILL.md:59] [SOURCE: .skilled/skills/sk-code/sk-code-obsidian/SKILL.md:62] [SOURCE: .skilled/skills/sk-code/sk-code-obsidian/SKILL.md:108]

- **sk-code-webflow:** Keep the existing domain-first taxonomy and deep implementation families. It already groups animation, deployment, debugging, performance, verification, and implementation topics, with nested implementation subfamilies and a cross-language shared tier. Flattening it to match a smaller surface would discard useful topic boundaries. Clarify the root workflow aliases in its map. [SOURCE: .skilled/skills/sk-code/sk-code-webflow/SKILL.md:33] [SOURCE: .skilled/skills/sk-code/sk-code-webflow/SKILL.md:37] [SOURCE: .skilled/skills/sk-code/sk-code-webflow/SKILL.md:40] [SOURCE: .skilled/skills/sk-code/sk-code-webflow/SKILL.md:51] [SOURCE: .skilled/skills/sk-code/sk-code-webflow/SKILL.md:55]

A move from Obsidian’s root pages should wait for Q4’s consumer audit: its smart-routing map names current paths, so the map and any path-aware checks must move in the same change. This iteration sets the target shape but does not prescribe a file-by-file move list.

## Questions Answered

- Q2: How do the three references/ trees differ (topic folders vs flat files, shared/, workflow-implement/debug/verify), and what single layout fits all three without losing surface-specific content?

## Questions Remaining

- Q3: How do the supporting folders (assets, scripts, benchmark, manual-testing-playbook, changelog, README) differ, and which should every surface carry?
- Q4: What do the hub files (mode-registry.json, hub-router.json, leaf-manifest.json, graph-metadata.json, ROUTER.md), the doctor checks (parent-skill-check, sk-code-setup-check) and the advisor assume about each surface's layout, and what breaks if a surface moves files?
- Q5: What ordered migration plan, with a guarding check per step, brings each surface to the target layout?

## Next Focus

Q3–Q5: compare supporting folders, trace path consumers, and use those findings to order the migration checks.
