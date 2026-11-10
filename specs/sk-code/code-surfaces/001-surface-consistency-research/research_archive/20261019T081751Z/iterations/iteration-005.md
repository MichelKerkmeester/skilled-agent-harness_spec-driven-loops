# Iteration 5: Surface setup and reference architecture

## Focus

Q2: How do the three references/ trees differ (topic folders vs flat files, shared/, workflow-implement/debug/verify), and what single layout fits all three without losing surface-specific content?

The dispatch selects Q2 even though the packet already marks it answered in iteration 2. This pass reconfirms Q2 against the live trees and closes Q3 through Q5 using the current hub, doctor and advisor contracts.

## Actions Taken

- Inventoried the three surface reference trees, support directories and workflow symlinks.
- Read the three surface maps, the hub registry and routers, doctor checks, advisor extraction code and the sk-doc nested-packet canon.
- Kept all three researched surfaces read-only. No tests or implementation changes were made.

## Findings

### Shared target layout

Use one packet contract while allowing each surface to keep its useful topic depth:

    sk-code-<surface>/
      SKILL.md
      README.md
      changelog/
      references/
        workflow-implement.md -> ../../shared/references/workflow-implement.md
        workflow-debug.md     -> ../../shared/references/workflow-debug.md
        workflow-verify.md    -> ../../shared/references/workflow-verify.md
        shared/               # optional, only for surface-local cross-topic guidance
        <domain>/
          <guide>.md           # flat is fine for a small family
          <subtopic>/           # add only for a real cluster
            <guide>.md
        <standalone-guide>.md  # keep a distinct topic at the root
      assets/
      manual-testing-playbook/
      scripts/                 # only when the surface owns executable checks
      benchmark/               # only for a measurable surface-specific baseline

Keep the common SKILL.md sections in this order: when the hub bundles the surface, reference map, smart routing, surface standards and assets/supporting material. Allow extra domain sections after the standards, as Obsidian does for its source-tree conventions. Keep the same hub-child frontmatter fields and read-only tool boundary. The surface packets already use the same base sequence and the sk-doc canon calls for hub-prefixed surface packets with references, assets and changelog. [SOURCE: .skilled/skills/sk-code/sk-code-skilled/SKILL.md:20] [SOURCE: .skilled/skills/sk-code/sk-code-obsidian/SKILL.md:27] [SOURCE: .skilled/skills/sk-code/sk-code-webflow/SKILL.md:18] [SOURCE: .skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md:44] [SOURCE: .skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md:58]

The three root workflow symlinks are the shared process contract, not surface-specific content. Keep them at the same paths. Obsidian documents this role directly, while Skilled and Webflow say the trio is not assumed even though the live trees contain and resolve the links. Update those two descriptions to match the shared hub contract. [SOURCE: .skilled/skills/sk-code/SKILL.md:42] [SOURCE: .skilled/skills/sk-code/sk-code-obsidian/SKILL.md:62] [SOURCE: .skilled/skills/sk-code/sk-code-skilled/SKILL.md:46] [SOURCE: .skilled/skills/sk-code/sk-code-webflow/SKILL.md:55]

### Q2: Reference-tree differences and per-surface gaps

- **sk-code-skilled** groups language rules under language folders. TypeScript, Shell and Rust have style, quality and quick-reference subtrees; Python, JavaScript and Config stay flatter. Its shared tier holds language-neutral rules, hooks and alignment guidance. Keep this structure and make the root workflow-link wording accurate. [SOURCE: .skilled/skills/sk-code/sk-code-skilled/SKILL.md:31] [SOURCE: .skilled/skills/sk-code/sk-code-skilled/SKILL.md:38] [SOURCE: .skilled/skills/sk-code/sk-code-skilled/SKILL.md:46]
- **sk-code-obsidian** keeps most plugin topics as standalone files, with small operations, quality, release, setup and standards groups. It has no surface-local shared tier, which is appropriate because its reference map is plugin-specific. It already names all three shared workflow aliases. Preserve the standalone API and database guides and its source-tree conventions section. [SOURCE: .skilled/skills/sk-code/sk-code-obsidian/SKILL.md:53] [SOURCE: .skilled/skills/sk-code/sk-code-obsidian/SKILL.md:62] [SOURCE: .skilled/skills/sk-code/sk-code-obsidian/SKILL.md:179]
- **sk-code-webflow** has the deepest topic tree, including implementation, debugging and verification families, plus a cross-language shared tier. Preserve those families. Its root workflow-link wording is the other documentation gap. [SOURCE: .skilled/skills/sk-code/sk-code-webflow/SKILL.md:33] [SOURCE: .skilled/skills/sk-code/sk-code-webflow/SKILL.md:47] [SOURCE: .skilled/skills/sk-code/sk-code-webflow/SKILL.md:51] [SOURCE: .skilled/skills/sk-code/sk-code-webflow/SKILL.md:55]

The target grammar is therefore flexible depth, not identical directory names. Use shared/ only when multiple local topics genuinely reuse its guidance. Do not flatten Skilled or Webflow or create empty shared folders in Obsidian. [SOURCE: .skilled/skills/sk-code/sk-code-skilled/SKILL.md:38] [SOURCE: .skilled/skills/sk-code/sk-code-webflow/SKILL.md:51] [SOURCE: .skilled/skills/sk-code/sk-code-obsidian/SKILL.md:53]

### Q3: Supporting folders

Every surface should carry SKILL.md, README.md, references/, assets/ and changelog/. The parent-skill canon lists those files for a surface packet, and parent-skill-check enforces the packet README and changelog. Keep a surface-local manual-testing-playbook for these three because each surface has different detection and resource-loading cases. The canon requires a hub-level playbook and benchmark, but does not require a benchmark inside every child surface. Keep scripts and surface-local benchmarks only where a maintained executable check or measurable baseline needs them. [SOURCE: .skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md:37] [SOURCE: .skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md:44] [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:568] [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:576] [SOURCE: .skilled/skills/sk-code/sk-code-webflow/README.md:118]

The current differences are useful if their entry points are clear. Skilled has a root drift-guard runner and helper scripts under assets/scripts. Obsidian has a root source-gates runner and domain checklists. Webflow keeps scripts with its assets and documents debugging and verification checklists. Document one supported entry point per surface; do not add empty script or benchmark directories merely for parity. [SOURCE: .skilled/skills/sk-code/sk-code-skilled/SKILL.md:175] [SOURCE: .skilled/skills/sk-code/sk-code-skilled/SKILL.md:187] [SOURCE: .skilled/skills/sk-code/sk-code-obsidian/SKILL.md:64] [SOURCE: .skilled/skills/sk-code/sk-code-obsidian/SKILL.md:245] [SOURCE: .skilled/skills/sk-code/sk-code-webflow/SKILL.md:53]

### Q4: Hub, doctor and advisor assumptions

mode-registry.json names each surface packet and its packet kind. hub-router.json points each surface route at that packet's SKILL.md. ROUTER.md maps detected surface plus intent to packet-qualified resources, and leaf-manifest.json records the typed packet/resource pairs. A reference move therefore requires updating the surface map, root router and leaf manifest together. A packet-folder move also requires updating its registry packet and hub-router resource paths. The router replay guard checks those paths, the parent/surface map union and playbook expected-resource outcomes. [SOURCE: .skilled/skills/sk-code/mode-registry.json:61] [SOURCE: .skilled/skills/sk-code/hub-router.json:31] [SOURCE: .skilled/skills/sk-code/ROUTER.md:111] [SOURCE: .skilled/skills/sk-code/leaf-manifest.json:5] [SOURCE: .skilled/skills/sk-code/sk-code-skilled/SKILL.md:175]

parent-skill-check expects packet folders to be direct children with matching packet names, each packet to have SKILL.md, README.md and changelog/, and each surface to be an advisor-invisible, read-only evidence base. It also requires the single graph-metadata.json to remain at the hub root. Moving a packet without updating the registry fails packet resolution; moving a mapped reference without updating the maps fails route checks. sk-code-setup-check wires the parent checker and the sk-code drift-guard entry point. [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:494] [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:568] [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:638] [SOURCE: .skilled/commands/doctor/scripts/sk-code-setup-check.cjs:55] [SOURCE: .skilled/commands/doctor/scripts/sk-code-setup-check.cjs:59]

The advisor keeps the hub as the sole identity. Its derived-content extractor walks markdown under that identity's references/ and assets/, while the graph index rejects a skill-shaped graph-metadata.json nested inside a hub. Surface content is reached through the hub routing contract; adding graph-metadata.json to a child would create an identity violation. [SOURCE: .skilled/skills/sk-code/SKILL.md:74] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/derived/extract.ts:176] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/derived/extract.ts:181] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts:986]

### Q5: Ordered migration with guards

1. Record the current packet paths, map entries and workflow symlink targets. Run the setup checker before edits to capture the baseline. The checker defines the parent-skill and drift-guard legs. [SOURCE: .skilled/commands/doctor/scripts/sk-code-setup-check.cjs:55] [SOURCE: .skilled/commands/doctor/scripts/sk-code-setup-check.cjs:59]

       node .skilled/commands/doctor/scripts/sk-code-setup-check.cjs

2. Normalize the three surface SKILL.md section orders and the alias wording. Keep Obsidian's source-tree section and all surface-specific standards. Run the setup checker and validate each README after these documentation edits. [SOURCE: .skilled/skills/sk-code/sk-code-obsidian/SKILL.md:179] [SOURCE: .skilled/skills/sk-code/sk-code-webflow/README.md:116]

3. Keep the existing reference trees in place unless a grouping improves retrieval. For each actual move, update the surface map, root ROUTER.md and leaf-manifest.json in the same change. Run the full drift-guard wrapper, which checks mapped paths, orphan resources, parent/surface union and playbook routes. [SOURCE: .skilled/skills/sk-code/sk-code-skilled/SKILL.md:175] [SOURCE: .skilled/skills/sk-code/sk-code-skilled/README.md:61]

       bash .skilled/skills/sk-code/sk-code-skilled/scripts/run-all-drift-guards.sh

4. Reconcile support folders: retain each surface manual-testing-playbook, keep benchmark folders only for measured local outcomes and document the executable check entry point where scripts exist. Run a manual scenario for each surface and confirm its expected resource is emitted. Keep changelog versions aligned with each packet's SKILL.md version. [SOURCE: .skilled/skills/sk-code/sk-code-webflow/README.md:118] [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:1803] [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:1823]

5. Re-run the setup checker and full drift-guard wrapper from the final tree. Require both to exit zero before treating the migration as ready. [SOURCE: .skilled/commands/doctor/scripts/sk-code-setup-check.cjs:55] [SOURCE: .skilled/skills/sk-code/sk-code-skilled/SKILL.md:175]

## Questions Answered

- Q2: How do the three references/ trees differ (topic folders vs flat files, shared/, workflow-implement/debug/verify), and what single layout fits all three without losing surface-specific content?
- Q3: How do the supporting folders (assets, scripts, benchmark, manual-testing-playbook, changelog, README) differ, and which should every surface carry?
- Q4: What do the hub files (mode-registry.json, hub-router.json, leaf-manifest.json, graph-metadata.json, ROUTER.md), the doctor checks (parent-skill-check, sk-code-setup-check) and the advisor assume about each surface's layout, and what breaks if a surface moves files?
- Q5: What ordered migration plan, with a guarding check per step, brings each surface to the target layout?

## Questions Remaining

None. Q1 was answered in an earlier pass. This iteration closes Q2 through Q5.

## Next Focus

No next focus. This is iteration 5 of 5; the reducer can now synthesize the completed question set.
