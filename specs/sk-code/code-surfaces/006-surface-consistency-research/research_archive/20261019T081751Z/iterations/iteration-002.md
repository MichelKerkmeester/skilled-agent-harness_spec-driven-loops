# Iteration 002

## Focus

Q2: How do the three references/ trees differ (topic folders vs flat files, shared/, workflow-implement/debug/verify), and what single layout fits all three without losing surface-specific content?

## Actions Taken

- Read the run config, state log, strategy, and findings registry. Q2 is still open and is the strategy's next focus; no exhausted direction applies.
- Enumerated all three `references/` trees with `rg --files --follow`, then checked root workflow links with `ls -l` and `readlink`. Each surface exposes the same `workflow-implement.md`, `workflow-debug.md`, and `workflow-verify.md` symlinks to the hub's `shared/references/`.
- Compared the line-numbered `REFERENCE MAP` and `RESOURCE_MAP` blocks. The parent hub and doctor assumptions remain for Q4; no surface files were changed.

## Findings

### Observed reference shapes

- **sk-code-skilled** groups most content by language or config. The map lists TypeScript, Rust, and Shell references split into style, quality, and quick-reference families, while Python and Config use flatter files. Its `references/shared/` is explicitly language-agnostic and surface-local. [SOURCE: .skilled/skills/sk-code/sk-code-skilled/SKILL.md:30] [SOURCE: .skilled/skills/sk-code/sk-code-skilled/SKILL.md:31] [SOURCE: .skilled/skills/sk-code/sk-code-skilled/SKILL.md:35] [SOURCE: .skilled/skills/sk-code/sk-code-skilled/SKILL.md:38] [SOURCE: .skilled/skills/sk-code/sk-code-skilled/SKILL.md:42]
- **sk-code-obsidian** mixes topical files at the `references/` root with smaller `operations/`, `quality/`, `release/`, `setup/`, and `standards/` groups. Its map describes the three workflow files as symlinks from the parent `shared/references/`. [SOURCE: .skilled/skills/sk-code/sk-code-obsidian/SKILL.md:53] [SOURCE: .skilled/skills/sk-code/sk-code-obsidian/SKILL.md:56] [SOURCE: .skilled/skills/sk-code/sk-code-obsidian/SKILL.md:61] [SOURCE: .skilled/skills/sk-code/sk-code-obsidian/SKILL.md:62] Its router also selects both root references and nested category references, so both shapes are active in the current map. [SOURCE: .skilled/skills/sk-code/sk-code-obsidian/SKILL.md:92] [SOURCE: .skilled/skills/sk-code/sk-code-obsidian/SKILL.md:103] [SOURCE: .skilled/skills/sk-code/sk-code-obsidian/SKILL.md:120]
- **sk-code-webflow** is domain-first, with topic folders for animation, CSS, debugging, deployment, implementation, performance, and verification. Implementation and language areas carry deeper topic families. Its `references/shared/` holds cross-language workflow and enforcement material. [SOURCE: .skilled/skills/sk-code/sk-code-webflow/SKILL.md:28] [SOURCE: .skilled/skills/sk-code/sk-code-webflow/SKILL.md:33] [SOURCE: .skilled/skills/sk-code/sk-code-webflow/SKILL.md:38] [SOURCE: .skilled/skills/sk-code/sk-code-webflow/SKILL.md:49] [SOURCE: .skilled/skills/sk-code/sk-code-webflow/SKILL.md:51]

The word `shared` has two distinct scopes. Each surface's `references/shared/` contains material reused across that surface's own topics. The parent `.skilled/skills/sk-code/shared/references/` owns the workflow doctrine linked by the three root symlinks. Obsidian documents this parent link; the skilled and Webflow maps say their phases do not assume a root workflow trio, although the symlinks are present on disk. I infer those two statements describe routing ownership, not file absence. [SOURCE: .skilled/skills/sk-code/sk-code-skilled/SKILL.md:46] [SOURCE: .skilled/skills/sk-code/sk-code-obsidian/SKILL.md:62] [SOURCE: .skilled/skills/sk-code/sk-code-webflow/SKILL.md:55]

### Recommended common layout

Keep one structural rule and let each surface retain its own domain names and content depth:

```text
<surface>/references/
  workflow-implement.md   # symlink to ../../shared/references/
  workflow-debug.md
  workflow-verify.md
  shared/                  # optional, surface-local cross-topic references
  <topic>/...              # all surface-specific reference content
```

Reserve the root workflow aliases as the common exception. Keep their source files under the parent shared directory. Keep `references/shared/` for genuinely cross-topic material within one surface, and do not create empty copies for surfaces that have none. Put topical references under domain folders, but do not impose the same domain names across skills: languages fit skilled, Obsidian API/data/rendering/style topics fit Obsidian, and Webflow capability areas fit Webflow. Add another folder level only where it groups a real family. This retains Webflow's deep implementation families and skilled's language families without forcing artificial nesting onto every reference. [SOURCE: .skilled/skills/sk-code/sk-code-skilled/SKILL.md:30] [SOURCE: .skilled/skills/sk-code/sk-code-skilled/SKILL.md:38] [SOURCE: .skilled/skills/sk-code/sk-code-obsidian/SKILL.md:53] [SOURCE: .skilled/skills/sk-code/sk-code-webflow/SKILL.md:33] [SOURCE: .skilled/skills/sk-code/sk-code-webflow/SKILL.md:38]

### Per-surface gaps

- **sk-code-skilled:** Its domain and local shared tiers already fit the target. The remaining consistency gap is that its Python/Config leaves are flatter than several language families, and its map does not describe the three root symlinks. Keep the current topic buckets; clarify the root-link role instead of moving those paths for symmetry. [SOURCE: .skilled/skills/sk-code/sk-code-skilled/SKILL.md:31] [SOURCE: .skilled/skills/sk-code/sk-code-skilled/SKILL.md:35] [SOURCE: .skilled/skills/sk-code/sk-code-skilled/SKILL.md:46]
- **sk-code-obsidian:** This is the main tree-shape gap. Move root-level topical references into small domain folders while preserving their file names and content; keep the existing workflow symlinks at the root. The current map already uses nested folders for quality, release, setup, operations, and standards, so extend those groupings only where they form useful families. [SOURCE: .skilled/skills/sk-code/sk-code-obsidian/SKILL.md:53] [SOURCE: .skilled/skills/sk-code/sk-code-obsidian/SKILL.md:62] [SOURCE: .skilled/skills/sk-code/sk-code-obsidian/SKILL.md:103] [SOURCE: .skilled/skills/sk-code/sk-code-obsidian/SKILL.md:120]
- **sk-code-webflow:** Its domain-first layout is closest to the target. Preserve its topic taxonomy and nested implementation families; clarify that the root workflow links exist and how routing treats them. Do not flatten its deeper families to make its paths resemble the smaller surfaces. [SOURCE: .skilled/skills/sk-code/sk-code-webflow/SKILL.md:33] [SOURCE: .skilled/skills/sk-code/sk-code-webflow/SKILL.md:38] [SOURCE: .skilled/skills/sk-code/sk-code-webflow/SKILL.md:51] [SOURCE: .skilled/skills/sk-code/sk-code-webflow/SKILL.md:55]

Before moving any reference, Q4 must confirm which router, manifest, and doctor checks consume those paths. Each surface says its local resource map participates in the parent hub union, and skilled explicitly describes an orphan-reference guard. [SOURCE: .skilled/skills/sk-code/sk-code-skilled/SKILL.md:50] [SOURCE: .skilled/skills/sk-code/sk-code-skilled/SKILL.md:59] [SOURCE: .skilled/skills/sk-code/sk-code-obsidian/SKILL.md:71] [SOURCE: .skilled/skills/sk-code/sk-code-webflow/SKILL.md:59]

## Questions Answered

- **Q2: How do the three references/ trees differ (topic folders vs flat files, shared/, workflow-implement/debug/verify), and what single layout fits all three without losing surface-specific content?** The three trees differ in grouping, but already share the same root workflow symlink paths. Use domain-first topical folders, an optional surface-local `shared/`, and the common root workflow aliases. Preserve each surface's topics and meaningful nesting.

## Questions Remaining

- Q3: How do the supporting folders (assets, scripts, benchmark, manual-testing-playbook, changelog, README) differ, and which should every surface carry?
- Q4: What do the hub files (mode-registry.json, hub-router.json, leaf-manifest.json, graph-metadata.json, ROUTER.md), the doctor checks (parent-skill-check, sk-code-setup-check) and the advisor assume about each surface's layout, and what breaks if a surface moves files?
- Q5: What ordered migration plan, with a guarding check per step, brings each surface to the target layout?

## Next Focus

Q3: How do the supporting folders (assets, scripts, benchmark, manual-testing-playbook, changelog, README) differ, and which should every surface carry?

## Reflection

The observed inconsistency comes from different content taxonomies and volumes, not a need to make the three surfaces carry identical topic folders. The safe shared contract is the root structure and meaning of each `shared/` scope; surface-specific topics remain local. Q4 is still needed to establish which path moves are safe because each child map is tied to parent routing and completeness checks. The 0.68 new-information ratio reflects that the reference-tree comparison is new in this run while the parent-shared routing links overlap with Q1's routing context.

