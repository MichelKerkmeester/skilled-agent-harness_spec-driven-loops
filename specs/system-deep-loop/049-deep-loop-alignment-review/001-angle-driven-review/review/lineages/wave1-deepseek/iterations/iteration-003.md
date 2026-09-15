---
title: "Iteration 3: Angle 3 — SKILL.md against references and assets"
trigger_phrases: []
---
# Iteration 3: Angle 3 — SKILL.md against references and assets

## Focus

Angle 3, for the three hubs and every mode under them, on three properties:

1. Each path a `SKILL.md` cites exists.
2. Each file under `references/` and `assets/` is reachable from its router.
3. Version fields agree across a mode's files.

This is the first iteration to read **mode-level** files rather than hub-root artifacts. Iterations 1 and 2 worked the hub root; an assumption carried over from there would have produced a false finding here, and that is recorded under Notes.

Dimension: traceability (primary), correctness (secondary), maintainability (tertiary).
Method: enumerated every file under each packet's `references/` and `assets/` and compared each against that mode's `leaf-manifest.json` leaf set, which is the artifact the hubs themselves name as the reachability surface; then traced any unreachable file to its producer to find the mechanism rather than the symptom.

## Files Reviewed

- All 17 mode packets across the three hubs, at `SKILL.md` + `references/**` + `assets/**` (`system-deep-loop` 4 packets, `sk-code` 6, `cli-external-orchestration` 7) — 474 leaf files under `references/` and `assets/` examined in aggregate
- `.opencode/skills/sk-code/ROUTER.md:625-645`, `.opencode/skills/sk-code/SKILL.md:39,62,173-174`
- `.opencode/skills/sk-code/sk-code-{webflow,opencode,mobile-cli,obsidian}/SKILL.md` and their `references/workflow-{implement,debug,verify}.md` symlinks
- `.opencode/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs:73-89`
- `.opencode/skills/sk-doc/sk-create-skill/scripts/ci-leaf-manifest-freshness.cjs:1-35`
- `.opencode/skills/sk-code/changelog/v4.2.1.0.md:15`

## Scorecard

- Dimensions covered: traceability, correctness, maintainability
- Files reviewed: 474 leaf files across 17 packets, plus 6 hub-level control artifacts and 2 generator scripts
- New findings: P0=0 P1=2 P2=1
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 1.00

## Reachability Matrix — files under `references/` + `assets/` that no `leaf-manifest.json` entry reaches

| Hub | Packet | On-disk leaves | Unreachable | Mechanism |
|---|---|---:|---:|---|
| system-deep-loop | deep-research | 19 | 0 | — |
| system-deep-loop | deep-review | 18 | 0 | — |
| system-deep-loop | deep-ai-council | 20 | 0 | — |
| system-deep-loop | deep-improvement | 61 | 0 | — |
| sk-code | sk-code-quality | 3 | 0 | — |
| sk-code | sk-code-review | 10 | 0 | — |
| sk-code | sk-code-webflow | 119 | **3** | symlink skipped by walker |
| sk-code | sk-code-opencode | 68 | **3** | symlink skipped by walker |
| sk-code | sk-code-mobile-cli | 42 | **3** | symlink skipped by walker |
| sk-code | sk-code-obsidian | 29 | **3** | symlink skipped by walker |
| cli-external-orchestration | all 7 packets | 65 | 0 | — |

## Findings

### P0, Blocker

- None.

### P1, Required

- **F011**: `sk-code`'s implement → debug → verify doctrine is unreachable from the router in four of its six surfaces, because the leaf-manifest generator silently skips symbolic links and that doctrine is symlinked in rather than copied. Each of `sk-code-webflow`, `sk-code-opencode`, `sk-code-mobile-cli`, and `sk-code-obsidian` carries `references/workflow-implement.md`, `references/workflow-debug.md`, and `references/workflow-verify.md` on disk — 12 files total — and **none** of the 12 appears in that mode's `leaf-manifest.json` leaf set. Every other unreachable file in the fleet is zero. The mechanism is in the generator, not in the manifests: `walkLeafFiles` recurses with `fs.readdirSync(cur, { withFileTypes: true })` and then applies `if (entry.isDirectory()) { … } if (!entry.isFile()) continue;` — and `Dirent.isFile()` is false for a symbolic link, so a symlinked file is neither recursed into nor emitted. The symlink target `../../shared/references/workflow-*.md` is real and the link resolves, so the file is present and readable; it is the manifest walk that drops it. This meets the hub's own routing contract: `SKILL.md:62` says "Packet-owned resources remain typed through `leaf-manifest.json`", `:174` says to keep "packet leaves aligned with `leaf-manifest.json`", and `sk-code-obsidian/SKILL.md:62` advertises the three files *by relative link* as "The shared implement → debug → verify doctrine (symlinked from `../../shared/references/`)". So the hub documents a per-surface doctrine, links it into each surface, and then fails to type it — a reader or agent that resolves behaviour through the manifest cannot see the doctrine the hub's own prose says the surface carries. Scope is honest: all four manifests are internally consistent, so the CI freshness gate (`ci-leaf-manifest-freshness.cjs`, which regenerates with this same walker and byte-compares) passes green over a set that is missing a file the hub advertises. `system-deep-loop` (122 files, 0 symlinks) and `cli-external-orchestration` (66 files, 0 symlinks) do not reproduce it, so this is specific to `sk-code`'s symlink-instead-of-copy choice. [SOURCE: .opencode/skills/sk-code/sk-code-obsidian/references/workflow-debug.md] [SOURCE: .opencode/skills/sk-code/sk-code-obsidian/SKILL.md:62] [SOURCE: .opencode/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs:73-89] [SOURCE: .opencode/skills/sk-code/SKILL.md:39] [SOURCE: .opencode/skills/sk-code/SKILL.md:62] [SOURCE: .opencode/skills/sk-code/SKILL.md:174]
- **F012**: The same defect gives the four `sk-code` surfaces a doctrine reachable in two places but typed in neither, so the hub's own "lives once" claim inverts for routing. `sk-code/SKILL.md:39` states the phases' "surface-agnostic doctrine lives once in `shared/references/workflow-implement.md`, `workflow-debug.md`, and `workflow-verify.md`, and is symlinked into each surface so the active surface carries the full workflow." `shared/references/` holds 12 files and those three do exist there, but `shared/` is deliberately not a routable leaf root — `sk-code/SKILL.md:62` calls its hub-level inputs "control resources … that resolve on disk but never project as leaves", and the eight declared `SHARED_CONTROL_RESOURCES` in `ROUTER.md:629-637` list a different eight paths that do **not** include any `workflow-*.md`. So the doctrine is present at the shared origin (not a leaf by design), present at each surface as a symlink (skipped by the walker), and absent from every manifest. It is reachable by prose citation only, which is exactly the surface the manifest exists to formalise. Verified resolvable for the record: all 8 declared `SHARED_CONTROL_RESOURCES` paths exist, so the containment carve-out itself is sound and this finding is not about it. [SOURCE: .opencode/skills/sk-code/SKILL.md:39] [SOURCE: .opencode/skills/sk-code/SKILL.md:62] [SOURCE: .opencode/skills/sk-code/ROUTER.md:629-637] [SOURCE: .opencode/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs:73-89]

### P2, Suggestion

- **F013**: Two `sk-code` surfaces sit three minor versions or more below their siblings with no changelog entry explaining the gap, so a reader cannot tell whether they are current or neglected. `sk-code-mobile-cli` declares `SKILL.md:3` = `0.1.11.0` and `sk-code-obsidian` = `0.1.0.0`, against `sk-code-review` `1.6.0.0`, `sk-code-webflow` `1.1.0.0`, `sk-code-opencode` `1.0.0.5`, and `sk-code-quality` `1.0.0.2`. The two low ones are also the two whose packet-level artifacts are thinnest (3 and 10 on-disk leaves for quality/review against 29 and 42 for obsidian/mobile-cli in the opposite direction, so the low version does not track size). The `0.1.*` prefix implies pre-1.0 while both are registered as live `packetKind` entries. Advisory: nothing in the artifact set claims these modes are stable, and I found no changelog entry that explains the `0.1.*` line, so this is recorded as an unexplained version gap rather than a defect. [SOURCE: .opencode/skills/sk-code/sk-code-mobile-cli/SKILL.md:3] [SOURCE: .opencode/skills/sk-code/sk-code-obsidian/SKILL.md:3] [SOURCE: .opencode/skills/sk-code/sk-code-review/SKILL.md:3] [SOURCE: .opencode/skills/sk-code/sk-code-webflow/SKILL.md:3]

## Claim Adjudication

```json
{"findingId":"F011","claim":"The leaf-manifest generator's walker skips symbolic links, so the 12 symlinked workflow doctrine files across four sk-code surfaces are absent from every leaf-manifest entry while present and resolvable on disk.","evidenceRefs":[".opencode/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs:73-89",".opencode/skills/sk-code/sk-code-obsidian/references/workflow-debug.md",".opencode/skills/sk-code/sk-code-obsidian/SKILL.md:62",".opencode/skills/sk-code/SKILL.md:62",".opencode/skills/sk-code/SKILL.md:174"],"counterevidenceSought":"Enumerated every file under all 17 packets' references/ and assets/ and compared against each mode's manifest rather than sampling one surface; confirmed every unreachable file in the fleet is a symlink (12 of 12, zero non-symlink unreachables); read the generator walker to find the mechanism; checked whether the symlink targets resolve; and confirmed the CI freshness gate regenerates with the same walker so it cannot catch this.","alternativeExplanation":"The skip could be deliberate, if symlinked doctrine were intended to be reachable only through prose citation and never typed as a leaf. That reading is rejected because the hub's own SKILL.md:62 and :174 require packet resources to be typed through leaf-manifest.json and packet leaves to stay aligned with it, and because sk-code-obsidian/SKILL.md:62 presents the same three files as packet-local references with relative links — a presentation that a manifest-backed reader cannot honour.","finalSeverity":"P1","confidence":0.88,"downgradeTrigger":"Downgrade to P2 if a decision record states that symlinked packet references are deliberately untyped and that prose citation is their only sanctioned reachability path.","transitions":[{"iteration":3,"from":null,"to":"P1","reason":"Initial discovery; mechanism traced to the generator walker, fleet-scoped and non-reproducing outside sk-code"}]}
```

```json
{"findingId":"F012","claim":"The implement-debug-verify doctrine is reachable only by prose citation because its shared origin is a non-leaf control root and its four surface copies are symlinks the walker skips.","evidenceRefs":[".opencode/skills/sk-code/SKILL.md:39",".opencode/skills/sk-code/SKILL.md:62",".opencode/skills/sk-code/ROUTER.md:629-637",".opencode/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs:73-89"],"counterevidenceSought":"Read the hub SKILL.md's stated containment rule for hub-level inputs, listed the eight declared SHARED_CONTROL_RESOURCES and verified all eight resolve on disk, and confirmed no workflow-*.md appears among them, then checked shared/references for the originals.","alternativeExplanation":"The shared originals may be intended as hub-level control inputs covered by the SHARED_CONTROL_RESOURCES carve-out, which would make their absence from the leaf set correct. Rejected because that array names eight specific paths and contains no workflow-*.md entry, so the carve-out as written does not cover them.","finalSeverity":"P1","confidence":0.82,"downgradeTrigger":"Downgrade to P2 if the three workflow doctrine files are added to SHARED_CONTROL_RESOURCES, making their non-leaf status explicit and declared rather than accidental.","transitions":[{"iteration":3,"from":null,"to":"P1","reason":"Initial discovery; same root cause as F011 but a distinct artifact pair and a distinct fix"}]}
```

```json
{"findingId":"F013","claim":"Two sk-code surfaces sit at 0.1.* while their four siblings sit at 1.0.0.2 or above, with no changelog entry explaining the gap.","evidenceRefs":[".opencode/skills/sk-code/sk-code-mobile-cli/SKILL.md:3",".opencode/skills/sk-code/sk-code-obsidian/SKILL.md:3",".opencode/skills/sk-code/sk-code-review/SKILL.md:3",".opencode/skills/sk-code/sk-code-webflow/SKILL.md:3"],"counterevidenceSought":"Read all six mode SKILL.md version fields and the hub changelog entries; checked whether the low-version modes were also the smallest packets, which they are not, so the gap does not track scope.","alternativeExplanation":"A 0.1.* version may correctly signal that these two surfaces are newer or less proven than the others, in which case the gap is informative rather than a defect. That is why the finding is advisory and asks only for an explanatory changelog entry.","finalSeverity":"P2","confidence":0.55,"downgradeTrigger":"Resolve when a changelog entry explains the 0.1.* line, or when both surfaces are promoted to the sibling major line.","transitions":[{"iteration":3,"from":null,"to":"P2","reason":"Initial discovery; lowest-confidence finding, recorded as an advisor cue rather than a defect"}]}
```

## Traceability Checks

| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | partial | hard | `specs/system-deep-loop/049-deep-loop-alignment-review/001-angle-driven-review/spec.md:88` | Angle 3 was covered on all three properties across all 17 packets. Property 1 (cited paths exist) produced no defect after resolution was done correctly — see Notes. Property 2 produced F011 and F012. Property 3 produced F013 only. Partial because property 2 fails on one hub. |
| checklist_evidence | notApplicable | hard | — | The phase spec carries no per-iteration checklist rows; its REQ rows are assessed at synthesis. |

## Assessment

- New findings ratio: 1.00
- Dimensions addressed: traceability, correctness, maintainability
- Novelty justification: F011 is a mechanism-level defect traced to the generator's symlink handling, not a restatement of the surface symptom; F012 is a distinct contribution from F011 because its fix target (`SHARED_CONTROL_RESOURCES`) differs from F011's and it is a genuine either/or against the hub's containment rule; F013 is a version-provenance gap. Three findings, three different artifact pairs.

## Notes — A Cross-Iteration Assumption That Did Not Hold

- **My first pass on property 1 was wrong and is withdrawn.** I ran a naive regex over every backticked `*.md`/`*.json` path in each `SKILL.md` and tested existence relative to three candidate roots. It reported dozens of "missing" citations per mode, including files that plainly exist. The cause is that mode `SKILL.md` files cite **runtime outputs** (`deep-review-config.json`, `iterations/iteration-NNN.md`, `review-report.md`) and **sibling-repo paths** (`.opencode/bin/...`, `skill_advisor.py`) as prose, not as loadable resources. Counting those as broken citations would have manufactured a large false finding across all three hubs. Property 1 was re-tested on the only sound basis — resolved paths inside the packet — and produced no defect. This supersedes the raw count from the first pass entirely.
- **Carrying the hub-root frame into a mode-level angle.** Iterations 1 and 2 read hub-root artifacts where a leaf set is fully enumerable. Mode packets are larger and cite across trees, so an existence check that is meaningful at the hub root is not meaningful here. Worth remembering for angle 5, which will read READMEs and playbooks the same way.

## Ruled Out

- **All 8 declared `SHARED_CONTROL_RESOURCES` resolving on disk**: ruled out clean. Each of the eight paths exists; the containment carve-out itself is sound, and F012 is about what the array omits, not about what it contains.
- **`system-deep-loop` (122 files) and `cli-external-orchestration` (66 files) reachability**: ruled out clean. Zero unreachable files across all 12 of their packets, and neither hub contains a single symlink under `references/` or `assets/`, so the generator's symlink skip cannot bite them.
- **`sk-code-obsidian` and `sk-code-webflow` manifest leaf-set integrity on everything else**: ruled out. 26 of 29 and 116 of 119 leaves respectively are typed; the gap is exactly the three symlinked doctrine files and nothing else.
- **A `leaf-manifest.json` freshness failure on `sk-code`**: ruled out as the explanation. `ci-leaf-manifest-freshness.cjs` regenerates each manifest with the same generator and byte-compares, so it reports green over a set that omits the symlinked files — the gate cannot see this class. That is part of F011's impact, not a separate finding.
- **Mode-level version fields disagreeing with a registry projection**: ruled out. No `mode-registry.json` entry in any of the three hubs carries a per-mode `version` key at all, so there is no projection for a packet's `SKILL.md` version to disagree with. F013 is therefore about sibling-comparison only.

## Dead Ends

- **Pursuing "cited path does not exist" as a finding class at mode level**: the citation surface is not the resource surface. Recorded under Notes so a later iteration does not restart it.
- **Filing the symlink skip once per surface**: four surfaces share one mechanism and one fix. Filed once as F011 with the per-surface counts shown in the matrix rather than four times.

## Recommended Next Focus

Angle 4 — feature catalogs against the runtime: the hub catalog, the runtime catalog and each mode catalog; every entry must name a live file or function, no entry may name a removed one (worktrees, retired executor kinds), and the runtime's own write containment must have an entry. This is the first angle to cross from skill documentation into `runtime/` code, and F011's mechanism — a generator walking a tree and dropping a file class — is worth watching for in any catalog whose entries are generated rather than authored.

Review verdict: CONDITIONAL
