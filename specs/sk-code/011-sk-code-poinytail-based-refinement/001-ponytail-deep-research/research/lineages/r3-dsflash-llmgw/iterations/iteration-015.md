# Iteration 15: sk-code-obsidian fresh pass

## Focus

Part 3, fourth surface: the Obsidian packet's resource inventory (assets listed against assets shipped), its machine-readable list against its prose list, and its playbook index against its scenario files. This follows iteration 14's Recommended Next Focus.

## Actions Taken

1. Swept every `references/` and `assets/` path named in the Obsidian `SKILL.md` for existence.
2. Checked the three candidates the sweep flagged against the shipped asset folder, the packet's own playbook and the generated leaf manifest.
3. Compared the SKILL's machine-readable resource array with its human-readable §4 asset list.
4. Extracted every `OB-*` scenario ID from the playbook index and from the scenario files and diffed the two sets.
5. Re-checked the packet's SKILL version against its newest changelog entry.

## Findings

1. **The Obsidian SKILL lists three on-demand assets that do not exist, and the packet's own playbook already knows they do not match the shipped files.** `SKILL.md` §4 offers `assets/renderer-implementation-checklist.md`, `assets/comment-grammar-checklist.md` and `assets/debug-checklist.md` [SOURCE: .skilled/skills/sk-code/sk-code-obsidian/SKILL.md:232] [SOURCE: .skilled/skills/sk-code/sk-code-obsidian/SKILL.md:233] [SOURCE: .skilled/skills/sk-code/sk-code-obsidian/SKILL.md:235]; the shipped asset folder holds `comment-banner-checklist.md` and no file under either other name, and the generated `leaf-manifest.json` carries none of the three. The playbook index records the same three names as "do not match the shipped" and names the real files [SOURCE: .skilled/skills/sk-code/sk-code-obsidian/manual-testing-playbook/manual-testing-playbook.md:170]. The machine-readable resource array in the same SKILL names the shipped `assets/comment-banner-checklist.md` [SOURCE: .skilled/skills/sk-code/sk-code-obsidian/SKILL.md:109], so one SKILL file disagrees with itself about which checklist exists. Reproducing case: `rg -n "renderer-implementation-checklist|comment-grammar-checklist|debug-checklist" .skilled/skills/sk-code/sk-code-obsidian/SKILL.md` prints the three §4 rows, and `ls .skilled/skills/sk-code/sk-code-obsidian/assets/` lists no such files. NEW, P2 (three dead on-demand pointers in the packet a reader reaches first; retitle to the shipped files or mark them planned).
2. **The Obsidian playbook's ID space is internally exact.** The index declares 27 scenario IDs (OB-001..OB-021 plus OB-H01..OB-H06) and the 27 scenario files reference exactly those IDs, with no index-only or file-only ID [computed by set difference over the index and every scenario file]. No CR-019-style gap exists here. ALREADY-ADOPTED, P2, no action.
3. **The packet's version pairing and shipped-checklist references hold.** `SKILL.md` is 0.1.1.0 and the newest changelog entry is `v0.1.1.0.md`; the checklists the resource-loading scenarios name (`comment-banner-checklist.md`, `folder-docs-checklist.md`) exist on disk. ALREADY-ADOPTED, P2, no action.

## Questions Answered

- Part 3's Obsidian leg is mapped: one inventory defect, two clean checks.

## Questions Remaining

- The hub files themselves (SKILL/ROUTER/hub-router/mode-registry/description), `benchmark/` and the root playbook.

## Ruled Out

- **"File `references/obsidian-api-boundary.md` (named by the playbook) as a fourth phantom."** The playbook paragraph about it is explicitly a recorded mismatch note, and the reference is not named by the SKILL; the SKILL-side defect is Finding 1.
- **"Verify the SKILL's migration counts (49 test files, 18,931 lines)."** They are claims about the plugin repository, which is outside this lineage's readable scope; their staleness is not assessable here.
- **"Run `scripts/run-source-gates.sh`."** It requires the plugin repo root and its `tools/` scanners; running it here would only print its precondition failure.

## Dead Ends

- The source-gates runner's SKIP-missing-guard design matches the playbook's note that the scanners land later; no contradiction.
- The packet's `manual-testing-playbook/` category folders all appear in the index; no orphan folder.

## Edge Cases

- Ambiguous input: whether the three §4 rows describe intended future assets or stale names. Both repairs are named; the defect is that the SKILL presents them as present.
- Contradictory evidence: none.
- Missing dependencies: the plugin repository is not available for the migration claims; recorded under Ruled Out.
- Partial success: none.

## Sources Consulted

- `.skilled/skills/sk-code/sk-code-obsidian/SKILL.md`
- `.skilled/skills/sk-code/sk-code-obsidian/assets/` (listing)
- `.skilled/skills/sk-code/sk-code-obsidian/manual-testing-playbook/manual-testing-playbook.md`
- `.skilled/skills/sk-code/sk-code-obsidian/manual-testing-playbook/` (27 scenario files, ID extraction)
- `.skilled/skills/sk-code/sk-code-obsidian/scripts/run-source-gates.sh`
- `.skilled/skills/sk-code/leaf-manifest.json`
- `specs/sk-code/011-sk-code-poinytail-based-refinement/001-ponytail-deep-research/research/lineages/r3-dsflash-llmgw/steer.md`

## Assessment

- New information ratio: 0.70 (one fully new finding, two ALREADY-ADOPTED checks).
- Questions addressed: Part 3 Obsidian leg.
- Questions answered: none fully.

## Reflection

- What worked and why: diffing the index's IDs against every scenario file's IDs. It produced an exact match, which is evidence — a clean result recorded is as useful as a defect for the synthesis.
- What did not work and why: the first sweep counted only `.md` paths from link syntax and missed inline-code asset names; the §4 phantom assets were found by extending the pattern to backticked paths without extensions.
- What I would do differently: sweep both link and code-span path forms on the first pass.

## Recommended Next Focus

The hub files themselves: `SKILL.md`, `ROUTER.md`, `hub-router.json`, `mode-registry.json`, `description.json` and `graph-metadata.json` against each other and the tree.
