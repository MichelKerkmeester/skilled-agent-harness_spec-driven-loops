---
title: "Research round 2: doctor alignment, a surface scaffold and registry-derived routing for sk-code"
description: "Three-iteration deep research (cli-codex, GPT-6 Luna at max effort, fast tier) on enforcing the shared sk-code surface contract in /doctor:sk-code, a hub-level scaffold for creating a new surface, and replacing hard-coded surface lists with registry derivation. Builds on round 1, archived in research_archive/."
trigger_phrases:
  - "sk-code surface consistency research round 2"
  - "sk-code surface scaffold research"
  - "doctor sk-code surface contract research"
importance_tier: "normal"
contextType: "research"
---

# Research round 2: doctor alignment, a surface scaffold and registry-derived routing for sk-code

<!-- ANCHOR:deep-research-sk-code-surface-round-2 -->

## 1. Answer

The doctor already runs the right checker but checks too little of the surface contract. `/doctor:sk-code` has eight legs, and its `parent-skill` leg already blocks a surface `graph-metadata.json` and partly checks version parity. The section order, the workflow-link trio, the checklist home and the reference depth are not checked anywhere. Those four checks, plus a stricter surface version check, belong inside `parent-skill-check.cjs` as hard failures, so the doctor keeps its eight legs.

A new surface touches about a dozen files today and nothing lists them. A scaffold under `sk-code/shared/assets/surface-scaffold/` with a registration checklist closes that gap. It belongs in sk-code, because the sk-doc scaffolds create a whole hub or a workflow packet, not an evidence surface.

Routing has one real bug to fix. `verify-router-sync.cjs` hard-codes two of the three surfaces, so sk-code-obsidian's child map is never compared with the hub union. The fix is to derive the surface list from `mode-registry.json` (`packetKind: surface`). The three §2b blocks already share one schema. Load tiers should stay only in the hub `ROUTER.md`.

## 2. Round 1 in brief

Round 1 ran 5 iterations and is archived at `specs/sk-code/code-surfaces/001-surface-consistency-research/research_archive/20261019T081751Z/research.md`.

It found that the three surfaces share frontmatter, the opening section order, the routing keys and the workflow-link trio. It recommended:
- standardizing the packet contract and the reference-tree grammar, not the topic folder names
- an `assets/checklists/` home on every surface
- optional `shared/`, `scripts/` and `benchmark/` folders
- never giving a surface its own `graph-metadata.json`

Its 7-step migration covers:
1. baseline
2. wording
3. obsidian section order
4. checklist moves
5. obsidian reference grouping
6. mirrors and indexes
7. final check

The plan is in `plan.md` §4. Round 2 adds steps 8 onward.

## 3. Scope and Method

- Three iterations ran on `gpt-6-luna` at `max` reasoning effort on the `fast` service tier, through the cli-codex single-executor path. The stop policy was `max-iterations`. Lineage was restart, generation 2, with round 1 as parent session `2026-10-19T06:41:00.693Z`.
- One question per iteration: Q1 doctor (iteration 1), Q2 scaffold (iteration 2), Q3 routing (iteration 3). Every iteration passed `verify-iteration.cjs` on the first dispatch.
- The orchestrator re-checked these claims on disk before synthesis:
  - `verify-router-sync.cjs:33-34` and the `SURFACES` loops at `:200-211`
  - `router-replay-lib.cjs:492-512`, which has no Obsidian prefix or marker
  - `SK_CODE_EXAMPLE_SURFACES` at `parent-skill-check.cjs:1164`
  - `softFail` at `parent-skill-check.cjs:185-189`
  - the `packetKind === 'surface'` precedent at `verify-doc-claims.cjs:331`
- Research only: no file under `.skilled/` changed.

## 4. Q1: Doctor alignment

### What runs today

`/doctor:sk-code` is a read-only router onto `doctor-sk-code-setup.yaml`. That workflow runs `sk-code-setup-check.cjs` once and prints PASS, FAIL or SKIP per leg with a repair line [SOURCE: .skilled/commands/doctor/sk-code.md:61] [SOURCE: .skilled/commands/doctor/assets/doctor-sk-code-setup.yaml:46].

| Leg | What it checks | Repair it prints |
|---|---|---|
| `provisioning` | The shared frontmatter package resolves | `worktree-naming.sh provision .` |
| `parent-skill` | `parent-skill-check.cjs .skilled/skills/sk-code` | Fix the FAIL lines, then rerun the check |
| `root-metadata` | Hub root metadata | `ci-skill-root-metadata.cjs --fix` |
| `guard` | `compiled-route-guard.cjs --json` | The guard's own fix text |
| `sync` | Served compiled-route copies match the authored ones | `compiled-route-sync.cjs` |
| `drift-guards` | Alignment, stack folders, router sync, doc claims | Fix each guard, then rerun the wrapper |
| `derived-freshness` | Generated metadata | `regenerate-skill-derived.cjs --root … --write` |
| `probe` | The compiled router returns `action: "route"` | The guard's stale-fix text, or add vocabulary to `hub-router.json` |

[SOURCE: .skilled/commands/doctor/scripts/sk-code-setup-check.cjs:97] [SOURCE: .skilled/commands/doctor/scripts/sk-code-setup-check.cjs:145] [SOURCE: .skilled/commands/doctor/scripts/sk-code-setup-check.cjs:200]

### What is already covered

- **Surface `graph-metadata.json`:** `checkIdentity(ctx)` requires one `graph-metadata.json` at the hub root and fails on any nested copy (check `2a`). No new check is needed [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:409].
- **Version parity:** `checkPacketChangelogVersions(ctx)` compares the `SKILL.md` version with the newest changelog entry (`13d-packet-version`). It has two gaps:
  - It skips a packet that has no valid version, no changelog folder or no versioned entry.
  - It reports through `softFail`, which becomes a warning under `PARENT_HUB_CHECK_STRICT=0` [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:1835] [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:187].
- **Surface mode fields:** `checkSurfaceMode` checks the backend kind, routing class and tools. It never opens a surface's `SKILL.md`, symlinks or folders [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:638].
- **Router sync:** it checks that each reference is routed, so a flat topical file passes as long as it has a route [SOURCE: .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs:156].

### Recommendation

Add the new checks to `parent-skill-check.cjs`, call them from `checkModes(ctx)` for every `packetKind === "surface"` mode, and use hard `fail()`:

| Check id | Function | Fails when | Repair |
|---|---|---|---|
| `3g-layout` | `checkSurfaceSectionOrder` | The `SKILL.md` sections are not in the order When the hub bundles this, Reference map, Smart routing, Surface standards, optional sections, then Assets last | Reorder the headings and rerun the parent check |
| `3g-workflow-trio` | `checkSurfaceWorkflowLinks` | A `references/workflow-{implement,debug,verify}.md` is not a symlink to `../../shared/references/` | `ln -sfn ../../shared/references/workflow-<kind>.md <packet>/references/workflow-<kind>.md` |
| `3g-checklists-home` | `checkSurfaceAssetLayout` | `assets/checklists/` is missing, or Markdown sits directly in `assets/` | `mkdir -p <packet>/assets/checklists`, then move the listed files |
| `3g-reference-depth` | `checkSurfaceReferenceDepth` | Any file other than the three workflow links sits at the `references/` root | `git mv` it into `references/<domain>/`, then update the surface map, `ROUTER.md` and the leaf manifest |
| `13d-surface-version` | new strict path in `checkPacketChangelogVersions` | A surface has no four-part version, or no matching newest changelog entry | Align `SKILL.md` and `changelog/v<version>.md` |

`sk-code-setup-check.cjs` also needs one change: its `parent-skill` judge prints one generic repair line [SOURCE: .skilled/commands/doctor/scripts/sk-code-setup-check.cjs:200]. Give it a map from check id to repair text so each new failure prints its own fix. Then update the YAML leg description and the `/doctor:sk-code` summary.

## 5. Q2: A base architecture for a new sk-code surface

### What a new surface touches today

1. **The packet itself:** `sk-code-<surface>/` with `packetKind: surface`, `backendKind: evidence-base` and a read-only tool set. It also goes in `mode-registry.json` `modes[]` and in `extensions.surface-axis.surfaces` [SOURCE: .skilled/skills/sk-code/mode-registry.json:61].
2. **First routing stage:** `hub-router.json` needs a `routerPolicy.tieBreak` position, `routerSignals` and a vocabulary class. The hub `SKILL.md` surface table and tree also change [SOURCE: .skilled/skills/sk-code/hub-router.json:7] [SOURCE: .skilled/skills/sk-code/SKILL.md:35].
3. **Second routing stage:** the packet's own §2b block, and its packet-prefixed paths in the `ROUTER.md` §11 union. `ROUTER.md`, not the hub `SKILL.md`, owns the union [SOURCE: .skilled/skills/sk-code/SKILL.md:65] [SOURCE: .skilled/skills/sk-code/ROUTER.md:39].
4. **Generated files:** regenerate `leaf-manifest.json`, refresh the compiled route, then probe it [SOURCE: .skilled/bin/compiled-route-manifest.cjs:29].
5. **Detection:** the new surface's markers and precedence go in `shared/references/stack-detection.md`, and its phase expectations in `phase-detection.md`. The advisor plugin's `detectWorkspaceSurface` needs the markers too [SOURCE: .skilled/skills/sk-code/shared/references/stack-detection.md:26] [SOURCE: .opencode/plugins/system-skill-advisor.js:692].
6. **Hard-coded lists:**
   - `verify-router-sync.cjs` lists the surfaces by name, which Q3 fixes.
   - `parent-skill-check.cjs` `SK_CODE_EXAMPLE_SURFACES` lists the removable example surfaces. A new one fails check `5l` until it is added there [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:1164].
7. **Playbooks and mirror:** hub and packet playbook scenarios, then the Hermes mirror [SOURCE: .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs:272].

### Recommendation

Add `.skilled/skills/sk-code/shared/assets/surface-scaffold/` containing:
- a template `SKILL.md`: surface frontmatter, the shared section order, a §2b block with `DEFAULT_RESOURCE`, `INTENT_SIGNALS` and `RESOURCE_MAP` placeholders, and Assets last
- a README template with the shared section list
- an example domain-first `references/` tree, with instructions to link the three workflow files
- `assets/checklists/` and a `changelog/v0.1.0.0.md` that matches the template version
- `REGISTRATION.md`, a checklist naming every file in the list above in order, each with the check that proves it

A checklist rather than a script: the steps cross hand-written Markdown, routing JSON and generated manifests. A script that rewrites all of them would be larger and harder to review than the checklist, and the guards already catch a missed step.

**Ownership:** keep the scaffold in sk-code. The sk-doc canon defines what a surface is [SOURCE: .skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md:44], but its two scaffolds build a whole hub (`hub-skill-scaffold.md`) and a primary workflow packet (`packet-skill-scaffold.md`) [SOURCE: .skilled/skills/sk-doc/sk-create-skill/assets/parent-skill/scaffold/packet-skill-scaffold.md:8]. Move the scaffold into sk-create-skill only when a second hub needs evidence surfaces.

## 6. Q3: Routing optimization

### Findings

- **Inventory gap (a real bug):** `verify-router-sync.cjs` sets `SURFACES = ['sk-code-webflow', 'sk-code-skilled']` and adds Obsidian only to `SURFACE_PACKETS` [SOURCE: .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs:33].
  - `legSurfaceMap` builds the child maps and the union check from `SURFACES` only [SOURCE: .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs:200], so sk-code-obsidian's map is never compared with the hub union.
  - `legBijection` checks only the sk-code-skilled map [SOURCE: .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs:261].
- **A precedent exists:** `verify-doc-claims.cjs` already counts surfaces with `modes.filter((m) => m.packetKind === 'surface')` [SOURCE: .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-doc-claims.cjs:331].
- **One leaf schema already:** all three §2b blocks use `DEFAULT_RESOURCE` as a list, `INTENT_SIGNALS` as `{weight, keywords}` and `RESOURCE_MAP` as intent to path list. The parser returns `defaultResource: string[]` [SOURCE: .skilled/skills/sk-code/sk-code-skilled/assets/scripts/router-replay-lib.cjs:392]. Intent names, weights and paths differ by domain, and should.
- **Load tiers live in one place:** ALWAYS, SURFACE, INTENT, LANGUAGE and ON_DEMAND are declared once in the hub `ROUTER.md` [SOURCE: .skilled/skills/sk-code/ROUTER.md:107], and `verify-doc-claims.cjs` checks them [SOURCE: .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-doc-claims.cjs:347].
- **Union comments:** the skilled and webflow §2b comments name one sibling and leave out Obsidian. The Obsidian comment already says "sibling surfaces" [SOURCE: .skilled/skills/sk-code/sk-code-obsidian/SKILL.md:75].
- **Hints only reorder:** the compiled route applies a surface hint after scoring and only reorders surfaces the prompt already matched [SOURCE: .skilled/bin/lib/compiled-routing/014-runtime-engine/lib/compiled-route.cjs:103].
  - Tests cover the default tie-break, a WEBFLOW hint and an Obsidian/Webflow collision.
  - No test proves a SKILLED or OBSIDIAN hint reorders a matched prompt [SOURCE: .skilled/bin/tests/compiled-route-surface-hint.test.cjs:61].
  - The advisor passes its workspace detection result as the hint, so a hint can never add a surface the prompt did not match [SOURCE: .opencode/plugins/system-skill-advisor.js:1009]. This is inferred from the two code paths. A matched-prompt test per hint would confirm it.
- **The replay model leaves out Obsidian:**
  - `SURFACE_PREFIXES` has only MOTION, WEBFLOW and SKILLED.
  - `detectSurface` knows only the `.opencode/` and Webflow markers.

  So Obsidian prompts replay as UNKNOWN and Obsidian resources as UNIVERSAL [SOURCE: .skilled/skills/sk-code/sk-code-skilled/assets/scripts/router-replay-lib.cjs:492].

### Recommendation

- Derive the surface inventory from `mode-registry.json`. Use `packet` for paths and `workflowMode` for compiled identity, and run every leg over the derived list.
- Keep `tieBreak`, `routerSignals` and vocabulary hand-written, because they are behavior, not inventory. Fail when any registry surface has no signal or tie-break position.
- Check `extensions.surface-axis.surfaces` against the derived list while anything still reads it.
- Keep the shared leaf schema, word the union comments as "registered surface packets", and leave load tiers in `ROUTER.md`.

## 7. Steps 8 onward, appended to round 1's plan

| Step | Change | Guarding check |
|---|---|---|
| 8 | Derive the surface inventory in `verify-router-sync.cjs` from the registry; run `legSurfaceMap` and `legBijection` over every surface; fail on a surface with no route signal or tie-break position | A synthetic fourth-surface fixture in the router-sync tests that fails before the fix; `run-all-drift-guards.sh` |
| 9 | Word all three §2b union comments as "registered surface packets"; keep the shared leaf schema and hub-owned load tiers | Router-sync leg 2; `verify-doc-claims.cjs`; `run-all-drift-guards.sh` |
| 10 | Add Obsidian's prefix and markers to `router-replay-lib.cjs`; add matched-prompt hint tests for SKILLED, OBSIDIAN and WEBFLOW plus an unmatched-hint control; add advisor marker cases for all three workspaces | `compiled-route-surface-hint.test.cjs`; advisor plugin vitest; drift guards |
| 11 | Add `3g-layout`, `3g-workflow-trio`, `3g-checklists-home` and `3g-reference-depth` to `parent-skill-check.cjs` as hard failures | `parent-skill-check.cjs .skilled/skills/sk-code` passes on the migrated tree; each injected violation prints its own id |
| 12 | Add the strict `13d-surface-version` path; keep `2a` for graph metadata | Same parent check with a missing-version fixture |
| 13 | Give the `parent-skill` judge a repair line per new id; update the doctor YAML and command summary | `sk-code-setup-check.cjs` shows `STATUS=OK legs=8` on the clean tree |
| 14 | Add `shared/assets/surface-scaffold/` with the templates and `REGISTRATION.md`; derive or document `SK_CODE_EXAMPLE_SURFACES` so a new surface does not trip `5l` | A dry run that copies the scaffold into a temp hub and runs the parent check and router sync on it |
| 15 | Rerun the full doctor and the step-1 baseline | `/doctor:sk-code` and the step-1 commands, compared with the baseline |

Steps 8 to 10 harden routing and can land before round 1's file moves. Steps 11 to 13 must land after round 1's steps 3 to 5. Otherwise the new checks fail on the current tree, where sk-code-obsidian still has flat references and loose checklists.

## Eliminated Alternatives

| Approach | Reason eliminated | Evidence | Iteration |
|---|---|---|---|
| A ninth doctor leg for the surface contract | It would run the parent checker twice; the `parent-skill` leg already runs it | `sk-code-setup-check.cjs:114` | 1 |
| A new graph-metadata check | `2a` in `checkIdentity` already covers it | `parent-skill-check.cjs:409` | 1 |
| Putting the scaffold in sk-create-skill now | Its scaffolds build a hub or a workflow packet; no second hub has surfaces | `packet-skill-scaffold.md:8` | 2 |
| A script that registers a surface everywhere | It crosses hand-written docs and generated JSON; a checklist plus the guards is smaller | §5 | 2 |
| Deriving tie-break and router signals from the registry | They are routing behavior, not inventory | `hub-router.json:7` | 3 |
| Per-surface load-tier tables | Tiers are declared and checked once in the hub | `ROUTER.md:107` | 3 |

## Divergence Map

- Saturated directions: none recorded.
- Pivots taken: none; `convergenceMode: default`, stop policy `max-iterations`.
- Remaining frontier: Q1 to Q3 each rest on one iteration. The orchestrator re-checked the load-bearing claims listed in §3. The coverage graph returned `STOP_BLOCKED` (source diversity, evidence depth, uncovered questions), because only iteration 3 emitted graph events. The stop was the iteration cap.

## 12. Open Questions

- **Example-surface list.** Should `SK_CODE_EXAMPLE_SURFACES` be derived, for example from a registry flag, or stay a hand-kept list that the scaffold checklist names? It is a decision for the build.
- **Hint parity.** That a hint cannot add an unmatched surface is inferred from the code. The step-10 tests confirm it.
- **Repeated-focus defect.** Round 1 saw the reducer hand an answered question as the next focus. In round 2 the reducer's next focus moved Q1 → Q2 → Q3 correctly.

## 13. References

- Round 1: `research_archive/20261019T081751Z/research.md`
- `research/iterations/iteration-001.md` through `iteration-003.md`
- `research/deltas/iter-001.jsonl` through `iter-003.jsonl`
- `research/resource-map.md`

## Convergence Report

- Stop reason: maxIterationsReached
- Total iterations: 3
- Questions answered: 3 / 3
- Remaining questions: 0
- Last 3 iteration summaries: run 1: Q1 doctor alignment (0.72); run 2: Q2 surface scaffold and registration (0.68); run 3: Q3 registry-derived routing (0.72)
- Convergence threshold: 0.05
- Divergence summary: no divergent pivots recorded
- Segment transitions, wave scores, and checkpoint metrics are experimental and omitted from the live report.

<!-- /ANCHOR:deep-research-sk-code-surface-round-2 -->
