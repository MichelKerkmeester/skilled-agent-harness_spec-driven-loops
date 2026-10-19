---
title: "Research: one setup for the sk-code-skilled, sk-code-obsidian and sk-code-webflow surfaces"
description: "Five-iteration deep research (cli-codex, GPT-6 Luna at max effort, fast tier) comparing the three sk-code surface packets and recommending a shared packet contract, a reference-tree grammar, per-surface gaps and an ordered, check-guarded migration."
trigger_phrases:
  - "sk-code surface consistency research"
  - "sk-code surface layout research"
importance_tier: "normal"
contextType: "research"
---

# Research: one setup for the sk-code-skilled, sk-code-obsidian and sk-code-webflow surfaces

<!-- ANCHOR:deep-research-sk-code-surface-consistency -->

## 1. Answer

The three surfaces are already closer than their folder listings suggest. They share the same frontmatter fields, the same opening section order (`WHEN THE HUB BUNDLES THIS`, `REFERENCE MAP`, `SMART ROUTING`, `SURFACE STANDARDS`, `ASSETS`), the same routing keys, and the same three root workflow symlinks into the hub's `shared/references/`. What differs is the reference-tree shape, the asset layout, the script entry point, the README section list and some wording. The research recommends standardizing the packet contract and the reference-tree grammar, not the topic folder names: each surface keeps its own domains and depth. The one real tree-shape gap is sk-code-obsidian, which keeps 13 topical references flat at the `references/` root. No surface should gain an empty `shared/`, `scripts/` or `benchmark/` folder just to match the others.

## 2. Scope and Method

- Five iterations on `gpt-6-luna` at `max` reasoning effort on the `fast` service tier, through the `cli-codex` single-executor path, stop policy `max-iterations`, in worktree `.worktrees/145-sk-code-surface-consistency-research`.
- Every iteration passed `verify-iteration.cjs` (narrative, delta, state record and route proof). Iterations 2 and 5 passed on the contract's one redispatch: on the first dispatch the leaf wrote its narrative and delta but did not record the iteration through the append gateway (`state_record_missing`).
- The surfaces stayed read-only. `git status` after the run shows changes only inside this packet.
- The orchestrator re-checked these claims directly before synthesis: all three surfaces carry `references/workflow-{implement,debug,verify}.md` as symlinks to `../../shared/references/`; the four `## ` heading lists of the three `SKILL.md` files; `sk-code-skilled/SKILL.md:46` and `sk-code-webflow/SKILL.md:55` say no root workflow trio is assumed while `sk-code-obsidian/SKILL.md:62` documents the trio; sk-code-obsidian has 16 `.md` entries at its `references/` root (13 topical plus the three workflow links); `parent-skill-check.cjs:568-579` requires `SKILL.md`, `README.md` and `changelog/` per packet; the supporting folders and README sections listed in §5.

## 3. Q1: SKILL.md structure and frontmatter

All three use `name`, `description`, `allowed-tools: [Read, Bash, Grep, Glob]`, `version` and a `metadata` block with `family: sk-code` and `packetKind: surface` [SOURCE: .skilled/skills/sk-code/sk-code-skilled/SKILL.md:2] [SOURCE: .skilled/skills/sk-code/sk-code-obsidian/SKILL.md:2] [SOURCE: .skilled/skills/sk-code/sk-code-webflow/SKILL.md:2]. That matches the create-skill core fields [SOURCE: .skilled/skills/sk-doc/sk-create-skill/SKILL.md:290].

Section order, as observed:

| # | sk-code-skilled | sk-code-obsidian | sk-code-webflow |
|---|---|---|---|
| 1 | When the hub bundles this | When the hub bundles this | When the hub bundles this |
| 2 | Reference map | Reference map | Reference map |
| 2b | Smart routing | Smart routing | Smart routing |
| 3 | Surface standards | Surface standards | Surface standards |
| 3b | | Source tree conventions | |
| 4 | Assets and other surface areas | Assets | Assets |
| 5 | | Rules | |
| 6 | | Integration points | |

[SOURCE: .skilled/skills/sk-code/sk-code-obsidian/SKILL.md:179] [SOURCE: .skilled/skills/sk-code/sk-code-obsidian/SKILL.md:254] [SOURCE: .skilled/skills/sk-code/sk-code-obsidian/SKILL.md:291]

The sk-doc canon defines what a surface packet is (read-only, advisor-invisible evidence, hub-prefixed) but gives no exact surface section order. Its `packet-skill-scaffold.md` is a workflow-packet scaffold, so it is not the template for a surface [SOURCE: .skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md:54] [SOURCE: .skilled/skills/sk-doc/sk-create-skill/assets/parent-skill/scaffold/packet-skill-scaffold.md:8]. The routing comments in sk-code-skilled and sk-code-webflow describe the parent map as their own map plus one named sibling and leave out sk-code-obsidian [SOURCE: .skilled/skills/sk-code/sk-code-skilled/SKILL.md:53] [SOURCE: .skilled/skills/sk-code/sk-code-webflow/SKILL.md:62]. That is a comment error, not a routing defect.

## 4. Q2: Reference trees

- **sk-code-skilled** groups by language: TypeScript, Rust and Shell have style, quality and quick-reference families, while Python, JavaScript and Config stay flatter. Its `references/shared/` holds language-agnostic rules [SOURCE: .skilled/skills/sk-code/sk-code-skilled/SKILL.md:31] [SOURCE: .skilled/skills/sk-code/sk-code-skilled/SKILL.md:38].
- **sk-code-obsidian** keeps most plugin topics as root files, with small `operations/`, `quality/`, `release/`, `setup/` and `standards/` groups and no `shared/` [SOURCE: .skilled/skills/sk-code/sk-code-obsidian/SKILL.md:53] [SOURCE: .skilled/skills/sk-code/sk-code-obsidian/SKILL.md:62].
- **sk-code-webflow** is domain-first and the deepest: animation, CSS, debugging, deployment, HTML, implementation, JavaScript, performance and verification, with nested implementation families and a cross-language `shared/` [SOURCE: .skilled/skills/sk-code/sk-code-webflow/SKILL.md:33] [SOURCE: .skilled/skills/sk-code/sk-code-webflow/SKILL.md:51].

"Shared" means two things here. The hub's `.skilled/skills/sk-code/shared/references/` owns the implement, debug and verify doctrine that each surface links at its `references/` root [SOURCE: .skilled/skills/sk-code/SKILL.md:42], which the canon allows [SOURCE: .skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md:299]. A surface's own `references/shared/` holds material reused across that surface's topics.

## 5. Q3: Supporting folders

Orchestrator inventory:

| Folder | sk-code-skilled | sk-code-obsidian | sk-code-webflow |
|---|---|---|---|
| `README.md` sections | 9, includes Troubleshooting | 8 | 8 |
| `changelog/` latest | `v2.0.0.0.md` = SKILL.md `2.0.0.0` | `v0.1.4.0.md` = `0.1.4.0` | `v1.1.3.0.md` = `1.1.3.0` |
| `assets/` | `checklists/`, `scripts/` | seven flat checklist files | `animation/`, `integrations/`, `patterns/`, `scripts/`, `templates/` plus two flat checklists |
| `scripts/` | `run-all-drift-guards.sh`, `README.md`, `tests/` | `run-source-gates.sh` | none |
| `benchmark/` | yes | no | yes |
| `manual-testing-playbook/` | yes | yes | yes |

`parent-skill-check.cjs` requires `SKILL.md`, `README.md` and `changelog/` in every packet [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:568]. The canon lists references, assets and a changelog for a surface packet and requires the playbook and benchmark at the hub, not inside each child [SOURCE: .skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md:37] [SOURCE: .skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md:44]. So `scripts/` and `benchmark/` are optional per surface; they belong where a surface owns an executable check or a measured baseline.

## 6. Q4: What the hub, doctor and advisor assume

- `mode-registry.json` names each packet folder and kind; `hub-router.json` points each surface route at that packet's `SKILL.md`; `ROUTER.md` maps surface plus intent to packet-qualified resources; `leaf-manifest.json` records the packet and resource pairs [SOURCE: .skilled/skills/sk-code/mode-registry.json:61] [SOURCE: .skilled/skills/sk-code/hub-router.json:31] [SOURCE: .skilled/skills/sk-code/ROUTER.md:111] [SOURCE: .skilled/skills/sk-code/leaf-manifest.json:5].
- Moving a reference file therefore means updating the surface `RESOURCE_MAP`, `ROUTER.md` and `leaf-manifest.json` together. Renaming a packet folder also touches the registry and hub router.
- `parent-skill-check` expects packet folders as direct hub children whose names match, the companion files above, read-only advisor-invisible surfaces, and a single `graph-metadata.json` at the hub root [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:494] [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:638]. `sk-code-setup-check` runs the parent check and the drift-guard entry point [SOURCE: .skilled/commands/doctor/scripts/sk-code-setup-check.cjs:55].
- The advisor treats the hub as the only identity. Its derived extractor walks `references/` and `assets/` under that identity, and the graph index rejects a nested skill-shaped `graph-metadata.json` [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/derived/extract.ts:176] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts:986]. A surface must never gain its own `graph-metadata.json`.
- The drift-guard wrapper checks mapped paths, orphan references, the parent and surface map union and playbook expected resources [SOURCE: .skilled/skills/sk-code/sk-code-skilled/SKILL.md:175].

## 7. Target Layout

```text
sk-code-<surface>/
  SKILL.md                 # shared frontmatter and section order, below
  README.md                # shared section list; Troubleshooting optional
  changelog/               # latest file matches SKILL.md version
  references/
    workflow-implement.md  -> ../../shared/references/workflow-implement.md
    workflow-debug.md      -> ../../shared/references/workflow-debug.md
    workflow-verify.md     -> ../../shared/references/workflow-verify.md
    shared/                # optional: surface-local cross-topic guidance only
    <domain>/<guide>.md
    <domain>/<family>/<guide>.md   # only for a real family
  assets/
    checklists/            # surface checklists
    <kind>/                # templates, patterns, scripts the surface ships
  manual-testing-playbook/
  scripts/                 # optional: one documented entry point when the surface owns checks
  benchmark/               # optional: only for a measured surface baseline
```

`SKILL.md` order: 1 When the hub bundles this, 2 Reference map, 2b Smart routing (the one authoritative routing source, per [SOURCE: .skilled/skills/sk-doc/sk-create-skill/SKILL.md:408]), 3 Surface standards, then optional surface sections (3b, 3c and so on, such as Obsidian's source tree conventions, rules and integration points), then Assets last. Every reference map documents the three root workflow links the same way.

**Shared structure:** frontmatter, section order and names, the workflow link trio and its wording, the companion files, the `assets/checklists/` home, the README section list and the version-to-changelog match. **Surface-specific:** domain folder names and depth, the content of every reference, extra SKILL.md sections, whether `shared/`, `scripts/` or `benchmark/` exist.

## 8. Gap List

**sk-code-skilled**
- Reference map says no root workflow trio is assumed, but the links exist [SOURCE: .skilled/skills/sk-code/sk-code-skilled/SKILL.md:46].
- Routing comment names one sibling and omits sk-code-obsidian [SOURCE: .skilled/skills/sk-code/sk-code-skilled/SKILL.md:53].
- Section 4 is titled "Assets and other surface areas" where the others say "Assets" [SOURCE: .skilled/skills/sk-code/sk-code-skilled/SKILL.md:181].
- README has a Troubleshooting section the others lack; keep it as the optional section in the shared README list.
- Tree, `shared/`, scripts and benchmark already fit.

**sk-code-obsidian**
- 13 topical references sit flat at the `references/` root next to five small folders [SOURCE: .skilled/skills/sk-code/sk-code-obsidian/SKILL.md:53]. Group the ones that form families into domain folders, keep filenames and content, and leave distinct standalone guides where they are.
- Seven checklists sit flat in `assets/` instead of `assets/checklists/`.
- Rules (§5) and Integration points (§6) come after Assets (§4); move them to 3c and 3d so Assets is last [SOURCE: .skilled/skills/sk-code/sk-code-obsidian/SKILL.md:236].
- No `benchmark/`; add one only if a measured Obsidian baseline is wanted.

**sk-code-webflow**
- Reference map says no root workflow trio is assumed, but the links exist [SOURCE: .skilled/skills/sk-code/sk-code-webflow/SKILL.md:55].
- Routing comment omits sk-code-obsidian [SOURCE: .skilled/skills/sk-code/sk-code-webflow/SKILL.md:62].
- Two checklists sit flat in `assets/` beside asset-kind folders.
- No root `scripts/`; its scripts live under `assets/scripts/`. Document that as its entry point rather than adding an empty folder.
- Tree depth and taxonomy already fit; do not flatten.

## 9. Q5: Ordered Migration Plan

| Step | Change | Guarding check |
|---|---|---|
| 1 | Baseline: record packet paths, `RESOURCE_MAP` entries and link targets | `node .skilled/commands/doctor/scripts/sk-code-setup-check.cjs` and `bash .skilled/skills/sk-code/sk-code-skilled/scripts/run-all-drift-guards.sh`, both recorded before any edit |
| 2 | Wording only: fix the workflow-trio lines and the sibling-union comments in skilled and webflow; rename skilled §4 to Assets | Setup check; `validate_document` on each changed doc |
| 3 | Section order: move obsidian Rules and Integration points ahead of Assets; renumber | Parent-skill check; drift guards (section anchors used by the router) |
| 4 | Asset homes: move flat checklists into `assets/checklists/` in obsidian and webflow, updating every map, README and playbook link in the same change | Drift guards (mapped paths, orphans); a playbook scenario per surface |
| 5 | Obsidian reference grouping: `git mv` each family into a domain folder and update `RESOURCE_MAP`, `ROUTER.md` and `leaf-manifest.json` in the same change | Regenerate the leaf manifest and refresh the compiled route; drift guards; parent-skill check `10b-byte-drift`; compiled-route guard |
| 6 | Mirrors and indexes: re-sync `.hermes/skills`, rebuild the advisor and the trigger index | `sync-skills-hermes.cjs` check, `advisor_rebuild` then an advisor probe routing to each surface, `generate-trigger-index.mjs --check` |
| 7 | Final state | Rerun step 1's commands and compare with the baseline; packet `validate.sh --strict` |

Steps 2 and 3 are documentation only and can land together. Steps 4 and 5 move files and should each land as their own change.

## 10. Recommendations

1. Standardize the packet contract and section order, not domain names.
2. Fix the wording gaps first; they cost nothing and remove the only claims that contradict the tree.
3. Group sk-code-obsidian's flat references by family, with the map, router and manifest updated in the same change.
4. Give every surface an `assets/checklists/` home.
5. Treat `shared/`, `scripts/` and `benchmark/` as optional, present only when they hold real content.
6. Never add `graph-metadata.json` to a surface.

## Eliminated Alternatives

| Approach | Reason eliminated | Evidence | Iteration |
|---|---|---|---|
| Identical topic folders across all three | The domains differ (languages, plugin API, web platform); forced names would hide content | §4 | 2, 3 |
| Flattening sk-code-webflow or sk-code-skilled to match obsidian | Loses real families and router paths | `sk-code-webflow/SKILL.md:33` | 2, 4 |
| Using `packet-skill-scaffold.md` as the surface template | It is a workflow-packet scaffold | `packet-skill-scaffold.md:8` | 1 |
| Removing the root workflow links | They are the hub's shared doctrine contract | `sk-code/SKILL.md:42` | 3, 5 |
| Adding empty `shared/`, `scripts/` or `benchmark/` folders | Canon requires them at the hub only | `parent-skills-nested-packets.md:44` | 5 |

## Divergence Map

- Saturated directions: none recorded.
- Pivots taken: none; `convergenceMode: default`, stop policy `max-iterations`.
- Remaining frontier: Q3 to Q5 were answered in one iteration (5), so they rest on less independent evidence than Q1 and Q2; the orchestrator re-checked the supporting-folder and companion-file claims (§2, §5).

## 12. Open Questions

- **Which obsidian references group together.** The research sets the grammar but not a file-by-file move list for the 13 root references. That list belongs to the build phase.
- **Benchmark for obsidian.** Add one only if a measured baseline is wanted; the operator decides.
- **Repeated focus.** Iterations 3, 4 and 5 were each handed Q2 as their focus after Q2 was answered. Iteration 5 answered Q3 to Q5 anyway. The same stale next-focus appeared in the rename research (`012/001`), so it looks like a reducer or prompt-render defect to raise separately.

## 13. References

- `research/iterations/iteration-001.md` through `iteration-005.md`
- `research/deltas/iter-001.jsonl` through `iter-005.jsonl`
- `research/resource-map.md`

## Convergence Report

- Stop reason: maxIterationsReached
- Total iterations: 5
- Questions answered: 5 / 5
- Remaining questions: 0
- Last 3 iteration summaries: run 3: Q2 recheck and shared-tier split (0.18); run 4: Q2 target layout and per-surface gaps (0.24); run 5: Q3 to Q5 support folders, consumers and migration (0.38)
- Convergence threshold: 0.05
- Divergence summary: no divergent pivots recorded
- Segment transitions, wave scores, and checkpoint metrics are experimental and omitted from the live report.

<!-- /ANCHOR:deep-research-sk-code-surface-consistency -->
