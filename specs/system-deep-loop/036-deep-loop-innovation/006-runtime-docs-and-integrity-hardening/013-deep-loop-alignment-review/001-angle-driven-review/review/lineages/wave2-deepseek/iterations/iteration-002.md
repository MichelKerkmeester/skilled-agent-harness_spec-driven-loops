---
title: "Iteration 2: Angle 12 — Leaf-manifest generation and doctrine reachability"
trigger_phrases: []
---
# Iteration 2: Angle 12 — Leaf-manifest generation and doctrine reachability

## Focus

Angle 12 (wave two). Trace how each hub's leaf manifest is produced, which files it cannot see, and which sentences are the only path to a file. The angle is rewritten from wave one's F011 (generator skips symlinks, 12 `sk-code` doctrine files untyped) and F012 (doctrine reachable only by prose citation in four surfaces). This iteration re-ran the generator and both freshness gates against the live tree, enumerated the fleet's invisible files by set difference rather than by reading the generator alone, and listed the exact prose sentences that are the only path to the doctrine.

Dimension: traceability (primary), maintainability (secondary).
Method: read the generator's walker and mode-entry builder; ran `generate-leaf-manifest.cjs --check .opencode/skills/sk-code`; read both fleet freshness gates; computed manifest-minus-disk and disk-minus-manifest as set differences across all three hubs and eighteen mode packets; and enumerated every citation of the doctrine. No fixes.

## Files Reviewed

- `.opencode/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs:56-68,74-90,150-190,232-268,275-285`
- `.opencode/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs:191-229`
- `.opencode/skills/sk-doc/sk-create-skill/scripts/ci-leaf-manifest-freshness.cjs:1-40`
- `.opencode/skills/{system-deep-loop,sk-code,cli-external-orchestration}/leaf-manifest.json`
- `.opencode/skills/{system-deep-loop,sk-code,cli-external-orchestration}/mode-registry.json`
- `.opencode/skills/sk-code/{sk-code-webflow,sk-code-opencode,sk-code-mobile-cli,sk-code-obsidian}/references/workflow-{implement,debug,verify}.md` (12 symlinks)
- `.opencode/skills/sk-code/shared/references/workflow-{implement,debug,verify}.md` (3 real doctrine files)
- `.opencode/skills/sk-code/SKILL.md:39,62,172,174,192`
- `.opencode/skills/sk-code/ROUTER.md:626-637`
- `.opencode/skills/sk-code/shared/README.md:43-45`
- `.opencode/skills/sk-code/{sk-code-quality,sk-code-review,sk-code-webflow,sk-code-opencode,sk-code-mobile-cli,sk-code-obsidian}/SKILL.md` (doctrine citation sites)

## Scorecard

- Dimensions covered: traceability, maintainability
- Files reviewed: 3 generators/gates, 6 manifests/registries, 12 symlinks, 3 doctrine sources, 13 citation sites
- New findings: P0=0 P1=2 P2=0
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 1.00

## Production Trace (how each hub's manifest is produced)

| Step | Code | Behavior |
|------|------|----------|
| 1. Input | `generate-leaf-manifest.cjs:235-242` | A hub's manifest is built from `mode-registry.json`: every mode's `packet` is joined onto the skill root, and `references/` plus `assets/` under that packet are walked (`:179-180`). A hub never reads `leaf-manifest.config.json` (forbidden by the root contract); the registry is the sole input. |
| 2. Walk | `:74-90`, skip at `:83-84` | `walkLeafFiles` pushes directories and accepts only `entry.isFile()`. A symlink dirent is neither `isDirectory()` nor `isFile()`, so it is silently dropped. |
| 3. Alias merge | `:56-68`, `:185` | Optional `leaf-aliases.json` can add relocated leaves. All three hubs ship no alias file, so `aliasEntries` is empty everywhere. |
| 4. Build | `:244-252` | Leaves are stamped into one entry per registry mode; duplicate `(workflowMode, leafResourceId)` pairs throw. |
| 5. Write/check | `:262-268`, `:275-285` | `--write` replaces the file; `--check` byte-compares against a fresh regeneration printed with a digest. |
| 6. Fleet gates | `ci-skill-root-metadata.cjs:191-229`, `ci-leaf-manifest-freshness.cjs:1-30` | Both regenerate through the same `buildManifestBytes` and byte-compare. A manifest missing every symlink is byte-identical to a fresh regeneration and therefore **fresh by construction**. |

Observed: `node .opencode/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs --check .opencode/skills/sk-code` exits **0** with `leaf-manifest.json OK (0356321a36abfb79bf1d28ce6583b771314a2792794f2c7fd1af8f17660c338b)` while the 12 files below are absent from that same file.

## What the Walker Cannot See (fleet set difference)

- **`sk-code`, 12 files, all symlinks — the only disk files invisible to the generator in the whole fleet:**

| Surface packet | Missing leaf | Target |
|---|---|---|
| `sk-code-webflow` | `references/workflow-implement.md` | `../../shared/references/workflow-implement.md` |
| `sk-code-webflow` | `references/workflow-debug.md` | `../../shared/references/workflow-debug.md` |
| `sk-code-webflow` | `references/workflow-verify.md` | `../../shared/references/workflow-verify.md` |
| `sk-code-opencode` | (same three) | (same targets) |
| `sk-code-mobile-cli` | (same three) | (same targets) |
| `sk-code-obsidian` | (same three) | (same targets) |

- `system-deep-loop`: 0 invisible files across 5 modes (research 19, review 18, ai-council 20, agent-improvement 61, model-benchmark 61 leaves, all matching disk).
- `cli-external-orchestration`: 0 invisible files across 7 modes (7-15 leaves each).
- The two intended exclusions are not defects and are recorded as ruled out below: hub-level `shared/` trees (no mode packet, never walked) and non-`references`/`assets` roots (`changelog/`, `benchmark/`, `manual-testing-playbook/`, `feature-catalog/`) which the hub builder never declares as leaf roots.

## Findings

### P0, Blocker

- None.

### P1, Required

- **F024**: The leaf-manifest walker drops symlinks and both fleet freshness gates regenerate through the same walker, so twelve `sk-code` doctrine files are absent from every manifest while every gate stays green. `walkLeafFiles` accepts only `entry.isFile()` (`generate-leaf-manifest.cjs:83-84`); the doctrine is symlinked into the four surface packets on purpose (`SKILL.md:172` ALWAYS rule: "keep the implement/debug/verify workflow doctrine as one shared source under `shared/references/`, symlinked into each surface — never fork per-surface copies"), and all twelve symlinks resolve on disk. The gates cannot catch it: `ci-skill-root-metadata.cjs:191-229` regenerates with `buildManifestBytes` and byte-compares, `ci-leaf-manifest-freshness.cjs` does the same for every committed manifest, and `generate-leaf-manifest.cjs --check` was executed this iteration, exiting 0 with a digest. One walker defect, twelve invisible leaves, two blind gates. This re-verifies wave one's F011 against the live tree and adds the gate-blindness proof by execution rather than by reading. [SOURCE: .opencode/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs:83-84] [SOURCE: .opencode/skills/sk-code/sk-code-opencode/references/workflow-implement.md] [SOURCE: .opencode/skills/sk-code/SKILL.md:172] [SOURCE: .opencode/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs:191-229]
- **F025**: The three shared doctrine files are typed in no artifact and reachable only through prose, while the hub's own rule makes the typed path the intended one. The real sources (`shared/references/workflow-{implement,debug,verify}.md`) sit in no mode packet, so they are not leaves; the twelve surface symlinks are invisible to the walker, so they are not leaves either; and `ROUTER.md`'s eight `SHARED_CONTROL_RESOURCES` (`:626-637`) — the mechanism for exactly this class of hub-level resource — contain no `workflow-*.md` path. What remains is prose: `SKILL.md:39` ("symlinked into each surface so the active surface carries the full workflow… loads that surface's bundled doctrine") and `:192`, `shared/README.md:43-45`, and the four surface `SKILL.md` sites (`sk-code-webflow:16`, `sk-code-opencode:16`, `sk-code-obsidian:62` link table, `sk-code-mobile-cli:61` link table), plus hand-off sentences in `sk-code-quality:37-38,48-49,187-188` and `sk-code-review:44-45` that name `workflow-debug.md`/`workflow-verify.md` by filename but resolve them through the surface. The doctrine reaches a human reader (the symlinks resolve), but a leaf-driven or compiled consumer selecting "the surface's bundled doctrine" cannot resolve it, and the sentence in `SKILL.md:39` is the only place the load path is asserted. [SOURCE: .opencode/skills/sk-code/shared/references/workflow-implement.md] [SOURCE: .opencode/skills/sk-code/ROUTER.md:626-637] [SOURCE: .opencode/skills/sk-code/SKILL.md:39] [SOURCE: .opencode/skills/sk-code/shared/README.md:43-45] [SOURCE: .opencode/skills/sk-code/sk-code-obsidian/SKILL.md:62]

### P2, Suggestion

- None this iteration.

## Claim Adjudication

```json
{"findingId":"F024","claim":"The leaf-manifest walker skips symlinks and both fleet freshness gates regenerate through the same walker, so twelve sk-code doctrine symlinks are missing from the manifest while the check command and both gates report fresh.","evidenceRefs":[".opencode/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs:83-84",".opencode/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs:179-180",".opencode/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs:191-229",".opencode/skills/sk-doc/sk-create-skill/scripts/ci-leaf-manifest-freshness.cjs:1-30",".opencode/skills/sk-code/sk-code-opencode/references/workflow-implement.md",".opencode/skills/sk-code/sk-code-obsidian/references/workflow-verify.md"],"counterevidenceSought":"Ran the check subcommand against sk-code and read its exit status and digest rather than inferring gate behavior; computed disk-minus-manifest for every hub and mode so the count is a set difference, not a sample; checked whether leaf-aliases.json could have declared the files (no alias file exists on any hub); and checked whether the walker might follow symlinked directories elsewhere (it cannot: entry.isDirectory() is false for symlinks too).","alternativeExplanation":"The doctrine may be deliberately non-leaf, with the manifest contract claiming only packet-local leaves and shared/ resources declared as SHARED_CONTROL_RESOURCES instead. Rejected because the doctrine is not in that control list either, and because the hub rule and the SKILL.md sentence both describe a per-surface load path that the manifest does not contain.","finalSeverity":"P1","confidence":0.92,"downgradeTrigger":"Downgrade to P2 if a decision record states the workflow doctrine is intentionally non-typed and prose-only, and SKILL.md:39 is amended to stop claiming a load path.","transitions":[{"iteration":2,"from":null,"to":"P1","reason":"Re-verification of wave-one F011 against the live tree, with the gate-blindness arm proved by execution"}]}
```

```json
{"findingId":"F025","claim":"The three shared workflow doctrine files project as no typed resource in any artifact and are reachable only through prose sentences, while the hub's shared-control mechanism excludes them and the hub rule requires the symlinked surfaces to carry them.","evidenceRefs":[".opencode/skills/sk-code/SKILL.md:39",".opencode/skills/sk-code/SKILL.md:172",".opencode/skills/sk-code/ROUTER.md:626-637",".opencode/skills/sk-code/shared/README.md:43-45",".opencode/skills/sk-code/sk-code-obsidian/SKILL.md:62",".opencode/skills/sk-code/sk-code-mobile-cli/SKILL.md:61"],"counterevidenceSought":"Searched every hub RESOURCE_MAP and both shared-control lists for a workflow-* path (none), enumerated all citation sites for the three filenames across the six sk-code packets, and confirmed the shared sources are real files whose in-surface copies are the symlinks F024 drops.","alternativeExplanation":"Prose citations may be the intended sole reachability for shared doctrine, with typed leaves reserved for packet-owned resources. Accepted only in part: that reading survives for hub-level controls, but the doctrine is not declared in the control list either, so no artifact owns it and the SKILL.md load-path claim has no typed backing.","finalSeverity":"P1","confidence":0.8,"downgradeTrigger":"Downgrade to P2 once F024's walker is fixed and the twelve leaves appear, or once the doctrine is moved into SHARED_CONTROL_RESOURCES and SKILL.md:39's load-path claim is aligned with that mechanism.","transitions":[{"iteration":2,"from":null,"to":"P1","reason":"Re-verification of wave-one F012; the bounded impact (humans reach the files, typed consumers do not) keeps it at the lower edge of P1"}]}
```

## Traceability Checks

| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | partial | hard | `specs/system-deep-loop/049-deep-loop-alignment-review/001-angle-driven-review/spec.md:99` | Angle 12's three deliverables are covered: production trace tabulated, invisible files enumerated fleet-wide (12, all symlinks), and the prose-only sentences listed. Partial rather than pass because the hub's own stated leaf contract and the generator's behavior cannot both be satisfied as written. |
| checklist_evidence | notApplicable | hard | — | No per-iteration checklist rows in the phase spec. |

## Assessment

- New findings ratio: 1.00
- Dimensions addressed: traceability, maintainability
- Novelty justification: wave one found the generator defect and the prose reachability in one hub. This iteration converts both into executed evidence — the check command's exit 0 and digest, the two gates' shared builder, the fleet-wide set difference proving the defect is exactly 12 files and only in `sk-code`, and the mechanism-level gap (`ROUTER.md`'s shared-control list excludes the doctrine) that explains why nothing else owns the files.

## Ruled Out

- **Non-`references`/`assets` roots as invisible files**: ruled out by design. `changelog/`, `benchmark/`, `manual-testing-playbook/` and `feature-catalog/` are never declared leaf roots for hubs (`generate-leaf-manifest.cjs:179-180`), and the root contract documents `references`/`assets` as the leaf roots. No hub ships files there that any artifact claims are routable leaves.
- **A second invisible-file class in `system-deep-loop` or `cli-external-orchestration`**: ruled out. Disk-minus-manifest is empty for all five and all seven of their modes respectively; the defect is exactly `sk-code`'s four surface packets.
- **`leaf-aliases.json` as the intended escape hatch for the doctrine**: ruled out. No hub ships an alias file, so the alias path cannot be the designed carrier; the mechanism exists for relocated compatibility triples, not for shared doctrine.
- **The gate noticing the omission if the manifest were hand-repaired**: ruled out. A hand-added leaf would make the committed bytes differ from regeneration and the gate would report STALE — the gate enforces the walker's view, so the walker must change first.

## Dead Ends

- **Reading the generator alone to count the missing files**: the first pass read the walker and inferred "some symlinks"; the set difference against disk produced the exact twelve and caught that three of the four surfaces' SKILL.md files cite the doctrine only by filename in prose, not as links. Count by set difference, not by reading.
- **Testing whether symlinked directories would be followed**: they are not (`entry.isDirectory()` is false for a symlink dirent); no symlinked directory exists under any hub's `references/` or `assets/`, so the arm is closed.

## Recommended Next Focus

Iteration 3, angle 13 — preamble and leaf-set policy contradictions. Angle 12 leaves two exact hand-offs for it: the identity of "the surface's bundled doctrine" is what a preamble-like default load would need to name, and the twelve-leaf omission is the first concrete difference between what a hub's `ROUTER.md` says is loaded and what the typed manifest can deliver.

---

Claim adjudication packets for this iteration's two new P1 findings are embedded above.

Review verdict: CONDITIONAL
