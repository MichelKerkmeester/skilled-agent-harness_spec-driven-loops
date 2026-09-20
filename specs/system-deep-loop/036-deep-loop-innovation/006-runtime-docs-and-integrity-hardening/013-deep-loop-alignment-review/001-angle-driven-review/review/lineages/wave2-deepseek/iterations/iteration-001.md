---
title: "Iteration 1: Angle 11 — Version authority across routing artifacts"
trigger_phrases: []
---
# Iteration 1: Angle 11 — Version authority across routing artifacts

## Focus

Angle 11 (wave two). Name the version authority per hub, list every version disagreement across all three hubs and their modes, and state the one rule that would keep them paired. The angle is rewritten from wave one's F001 (seven `system-deep-loop` artifacts, six disagreeing values) and F009 (`cli-external-orchestration` splits the registry/router pair `sk-code` keeps), so this iteration re-verified both and then tested the question wave one left open: **which value is the version of the skill**, against the one artifact family that changes on every release — the changelog.

Dimension: traceability (primary), maintainability (secondary).
Method: read every version-bearing field at its exact line across the three hubs, their seven hub-root artifacts and all seventeen mode packets; diff each against the newest changelog entry under the same root; read the two authoring docs that define the fields' meaning; and check every validator/compiler in the fleet for a version consumer. No fixes.

## Files Reviewed

- `.opencode/skills/system-deep-loop/{SKILL.md,ROUTER.md,mode-registry.json,hub-router.json,description.json,leaf-manifest.json,graph-metadata.json}`
- `.opencode/skills/sk-code/{SKILL.md,ROUTER.md,mode-registry.json,hub-router.json,description.json,leaf-manifest.json,graph-metadata.json}`
- `.opencode/skills/cli-external-orchestration/{SKILL.md,ROUTER.md,mode-registry.json,hub-router.json,description.json,leaf-manifest.json,graph-metadata.json}`
- All seventeen mode-packet `SKILL.md` files under the three hubs and their changelog directories
- `.opencode/skills/sk-doc/sk-create-skill/references/parent-skill/parent-hub-router-schema.md:53`
- `.opencode/skills/sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md:105`
- `.opencode/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs:40,191,229`
- `.opencode/skills/sk-doc/sk-create-skill/scripts/lib/skill-root-metadata-contract.cjs:74,138`
- `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts` (version-free control: the runtime's own module carries no artifact version field)
- Changelog directories: `.opencode/skills/system-deep-loop/changelog/` (newest `v3.0.0.0.md`), `.opencode/skills/sk-code/changelog/` (newest `v4.2.2.0.md`), `.opencode/skills/cli-external-orchestration/changelog/` (newest `v1.5.0.0.md`), plus every mode packet changelog

## Scorecard

- Dimensions covered: traceability, maintainability
- Files reviewed: 24 version-bearing artifacts plus 17 mode packets, 3 changelog roots, 2 authoring docs, 2 gate files
- New findings: P0=0 P1=2 P2=1
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 1.00

## Version Matrix (all values read this iteration)

Authority candidate — newest changelog entry under the same root:

| Hub | Newest changelog | SKILL.md | description.json | mode-registry.json | hub-router.json | ROUTER.md |
|---|---|---|---|---|---|---|
| system-deep-loop | `v3.0.0.0` | 3.0.0.0 ✓ | **2.2.3.0** ✗ | **2.0.0.1** ✗ | **2.0.1.1** ✗ | **1.0.1.0** ✗ |
| sk-code | `v4.2.2.0` | 4.2.2.0 ✓ | 4.2.2.0 ✓ | **4.1.0.1** ✗ | **4.1.0.1** ✗ | **3.5.0.9** ✗ |
| cli-external-orchestration | `v1.5.0.0` | 1.5.0.0 ✓ | 1.5.0.0 ✓ | **1.2.0.2** ✗ | **1.2.1.2** ✗ | **1.1.0.0** ✗ |

Mode packets (all seventeen): `SKILL.md` ≡ newest changelog in **17 of 17** packets — `deep-research` 1.15.0.0, `deep-review` 1.11.0.36, `deep-ai-council` 2.4.1.0, `deep-improvement` 1.17.1.0, `sk-code-quality` 1.0.0.2, `sk-code-review` 1.6.0.0, `sk-code-webflow` 1.1.0.0, `sk-code-opencode` 1.0.0.5, `sk-code-mobile-cli` 0.1.11.0, `sk-code-obsidian` 0.1.0.0, `cli-opencode` 1.4.6.0, `cli-claude-code` 1.5.0.0, `cli-codex` 1.9.0.0, `cli-cursor` 1.4.1.0, `cli-devin` 1.4.2.0, `cli-pi` 1.5.3.0, `cli-hermes` 1.0.0.0. `leaf-manifest.json` carries `resourceContractVersion: 1` (contract discriminator, not an artifact version) and `graph-metadata.json` carries `schema_version: 2`.

## Findings

### P0, Blocker

- None.

### P1, Required

- **F021**: `system-deep-loop/description.json` advertises the hub's **previous** release while `SKILL.md` and both sibling hubs carry the newest changelog version. `description.json:4` = `2.2.3.0`, which is exactly the changelog two entries back (`changelog/v2.2.3.0.md`; `v2.2.4.0.md` and `v3.0.0.0.md` exist after it), while `SKILL.md:3` = `3.0.0.0` = `changelog/v3.0.0.0.md`. The sibling hubs keep the pair exact: `sk-code/SKILL.md:5` = `description.json:4` = `4.2.2.0` = newest changelog; `cli-external-orchestration/SKILL.md:5` = `description.json:4` = `1.5.0.0` = newest changelog. `description.json` is the hub's **advisor identity** file — the description an advisor reads to surface the skill — so the version a reader sees first is one release behind the artifact the same reader opens next. This is a new arm of wave one's F001: F001 established that the seven `system-deep-loop` artifacts disagree; this iteration establishes **which value is the release** (the changelog, obeyed by `SKILL.md` in 20 of 20 roots) and that `description.json` is the single artifact that breaks the identity pair its siblings keep. [SOURCE: .opencode/skills/system-deep-loop/description.json:4] [SOURCE: .opencode/skills/system-deep-loop/changelog/v3.0.0.0.md] [SOURCE: .opencode/skills/system-deep-loop/SKILL.md:3] [SOURCE: .opencode/skills/sk-code/description.json:4] [SOURCE: .opencode/skills/sk-code/SKILL.md:5] [SOURCE: .opencode/skills/cli-external-orchestration/description.json:4]
- **F022**: The `mode-registry.json` and `hub-router.json` version fields comply with neither the release rule nor each other's pairing rule in two of three hubs, and the third hub's paired value is stale against its own release. `system-deep-loop`: registry `2.0.0.1` (`mode-registry.json:3`) vs router `2.0.1.1` (`hub-router.json:3`) — split — against release `3.0.0.0`. `cli-external-orchestration`: registry `1.2.0.2` (`mode-registry.json:3`) vs router `1.2.1.2` (`hub-router.json:3`) — split — against release `1.5.0.0`. `sk-code`: registry `4.1.0.1` == router `4.1.0.1` (`hub-router.json:3`) — paired, as wave one's F009 recorded — but both stand at `4.1.0.1` while the hub's own changelog has since shipped `v4.2.0.0`, `v4.2.1.0` and `v4.2.2.0`; the pair is internally consistent and externally one minor release behind. `ROUTER.md` is the third member of the family and drifts in *every* hub (`1.0.1.0` / `3.5.0.9` / `1.1.0.0`). The authoring docs give these fields a release meaning, not a schema meaning: "`version`: four-part version for hubs that ship releases" (`parent-skills-nested-packets.md:105`, describing the registry) — and every observed value is four-part but none equals its hub's release. This extends F009 beyond the one split pair to the whole registry/router/ROUTER.md family across all three hubs. [SOURCE: .opencode/skills/system-deep-loop/mode-registry.json:3] [SOURCE: .opencode/skills/system-deep-loop/hub-router.json:3] [SOURCE: .opencode/skills/cli-external-orchestration/mode-registry.json:3] [SOURCE: .opencode/skills/cli-external-orchestration/hub-router.json:3] [SOURCE: .opencode/skills/sk-code/hub-router.json:3] [SOURCE: .opencode/skills/sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md:105]

### P2, Suggestion

- **F023**: The hub-router authoring doc defines the field against itself: "`version` | Yes | **Router schema or artifact version** for the hub" (`parent-hub-router-schema.md:53`). Those are two different authorities in one cell — a schema generation that would legitimately advance independently of the release, or the hub's artifact release that would not. The observed fleet splits along exactly that ambiguity (a paired registry/router whose value is neither the release nor a declared schema number in `sk-code`; split pairs in the other two), and no consumer resolves it: the fleet gate `ci-skill-root-metadata.cjs` requires the files to exist and classifies roots (`.cjs:40` "`--fix` writes leaf-manifest.json only. The other seven files carry authored identity... regenerating them would mean inventing meaning"), regenerates and byte-compares only the manifest (`.cjs:191-229`), and its required-file contract lists presence, not version values (`skill-root-metadata-contract.cjs:74`). No compiler, gate or runtime module reads any artifact `version` field — the compilers consume `resourceContractVersion` and drop `version` entirely. [SOURCE: .opencode/skills/sk-doc/sk-create-skill/references/parent-skill/parent-hub-router-schema.md:53] [SOURCE: .opencode/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs:40] [SOURCE: .opencode/skills/sk-doc/sk-create-skill/scripts/lib/skill-root-metadata-contract.cjs:74]

## Claim Adjudication

```json
{"findingId":"F021","claim":"system-deep-loop/description.json advertises the hub's previous release (2.2.3.0) while SKILL.md and both sibling hubs' description.json files carry the newest changelog version, breaking the identity pair the fleet otherwise keeps.","evidenceRefs":[".opencode/skills/system-deep-loop/description.json:4",".opencode/skills/system-deep-loop/SKILL.md:3",".opencode/skills/system-deep-loop/changelog/v2.2.3.0.md",".opencode/skills/system-deep-loop/changelog/v3.0.0.0.md",".opencode/skills/sk-code/description.json:4",".opencode/skills/cli-external-orchestration/description.json:4"],"counterevidenceSought":"Tested whether description.json versions are intentionally decoupled from releases by reading all three hub description.json files and their changelogs (two of three pair exactly), and checked whether any generator or gate derives/stamps description.json (regenerate-skill-derived.cjs maintains only graph-metadata.derived, preserving authored fields; ci-skill-root-metadata never writes the seven authored files). Also listed every changelog entry to confirm 2.2.3.0 is genuinely a past release, not the current one.","alternativeExplanation":"description.json could be a hand-authored advisor blurb that legitimately lags releases, making 2.2.3.0 a stale-but-harmless label. Rejected because the sibling hubs keep it byte-equal to SKILL.md at every release, so the fleet convention is pairing, and because the file is the advisor-facing identity a reader meets first.","finalSeverity":"P1","confidence":0.87,"downgradeTrigger":"Downgrade to P2 if a decision record states that description.json versions intentionally trail SKILL.md, or if any future release re-synchronizes it and a gate then holds the pair equal.","transitions":[{"iteration":1,"from":null,"to":"P1","reason":"Initial discovery in this lane; extends wave-one F001 with the changelog-authority test that identifies the authoritative value and the exact artifact that breaks it"}]}
```

```json
{"findingId":"F022","claim":"mode-registry.json and hub-router.json version fields match neither their hub's newest changelog release nor each other in two of three hubs, and sk-code's paired value stands one minor release behind the same hub's changelog, while the authoring doc calls the registry version a release version.","evidenceRefs":[".opencode/skills/system-deep-loop/mode-registry.json:3",".opencode/skills/system-deep-loop/hub-router.json:3",".opencode/skills/cli-external-orchestration/mode-registry.json:3",".opencode/skills/cli-external-orchestration/hub-router.json:3",".opencode/skills/sk-code/mode-registry.json:3",".opencode/skills/sk-code/hub-router.json:3",".opencode/skills/sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md:105"],"counterevidenceSought":"Checked whether the registry/router values could be schema generations by reading the two authoring docs that define them (one says 'four-part version for hubs that ship releases', the other says 'Router schema or artifact version', which is the ambiguity filed as F023), and searched every compiler, gate and runtime module for a consumer of registry.version/hubRouter.version (none read it; compilers consume resourceContractVersion). Also re-verified wave one's F009 pairing claim hub by hub rather than inheriting it.","alternativeExplanation":"The fields could be intentionally meaningless compatibility counters that no consumer needs. Rejected as a reason to leave them as found: both authoring docs describe them as versioning the hub, all observed values are four-part release-shaped, and a reader has no way to distinguish 'schema 4.1.0.1' from 'release 4.1.0.1' when the doc says either.","finalSeverity":"P1","confidence":0.8,"downgradeTrigger":"Downgrade to P2 once the field meaning is fixed by F023's resolution and the remaining values are either synchronized to the release or renamed to a schema-specific field with a documented, validated value.","transitions":[{"iteration":1,"from":null,"to":"P1","reason":"Initial discovery in this lane; expands wave-one F009 from one split pair to the full registry/router/ROUTER.md family across three hubs"}]}
```

## Traceability Checks

| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | partial | hard | `specs/system-deep-loop/049-deep-loop-alignment-review/001-angle-driven-review/spec.md:98` | Angle 11 names three deliverables (authority per hub, every disagreement, the one rule). All three are covered: the changelog is the demonstrated authority, the matrix above lists every disagreement, and the repair rule is stated in §Recommended Next Focus. Partial rather than pass because the tree itself provides no written authority statement to align against — the finding is that none exists. |
| checklist_evidence | notApplicable | hard | — | The phase spec carries no per-iteration checklist rows; its REQ rows are assessed at synthesis. |

## Assessment

- New findings ratio: 1.00
- Dimensions addressed: traceability, maintainability
- Novelty justification: the iteration closes the question wave one left open. Wave one established that values disagree; the changelog diff establishes which value is the release (SKILL.md ≡ newest changelog in 20 of 20 roots, including all seventeen mode packets) and isolates the two new defect classes: a lagging advisor identity file (F021) and a version family whose documented meaning contradicts its values fleet-wide (F022), with the doc that licenses the ambiguity filed as F023. None of the three is a restatement of F001 or F009: F001 predates the authority test and F009 covers one split pair in one hub.

## Ruled Out

- **The mode packets as a disagreement class**: ruled out for all seventeen. Every `SKILL.md` equals the newest changelog entry under its own root (17/17), so the mode layer obeys the release rule exactly and is a positive control rather than a defect surface.
- **`leaf-manifest.json` and `graph-metadata.json` as "missing version" findings**: ruled out. Neither carries an artifact version by design; their `resourceContractVersion: 1` and `schema_version: 2` are contract/schema discriminators, and the manifest's `version`-like surface is its digest stamp, regenerated by the gate. Counting these as absent versions would make F021 unactionable.
- **A version consumer that would have caught the drift**: ruled out. No compiler, gate, or runtime module reads an artifact `version` field; the registry/router compilers consume `resourceContractVersion`, and the fleet metadata gate checks presence and generated-byte freshness only. The drift persists because nothing compares it, which is recorded as the mechanism behind F023.
- **`description.json` parity being a chance match in the sibling hubs**: ruled out. All three `description.json` files follow the same shape and the two healthy hubs pair with `SKILL.md` exactly across multiple released versions; the pairing is the convention.

## Dead Ends

- **Treating `ROUTER.md`'s version as an independent lineage** (attempted first): the field looks like a compiled-routing artifact generation, but `ROUTER.md` is authored policy (the root-metadata contract lists it among the seven authored files and never regenerates it), so there is no generator-owned generation for it to track. The field remains a disagreement inside F022 with no authority claimant.
- **Inspecting git history for a documented version rule**: not available to this lane (no git writes permitted, and the review is read-only); the authoring docs are the only in-tree authority statements, and they are the two cited.

## Recommended Next Focus

Iteration 2, angle 12 — leaf-manifest generation and doctrine reachability. The one rule angle 11 states: **one release version per skill root must be carried by `SKILL.md` and must equal the newest changelog entry; any other version-bearing artifact either (a) is stamped to that same release (the advisor identity `description.json`), or (b) renames its field to a schema-specific name with a documented, validated value (`routerSchemaVersion`, `registrySchemaVersion`), and a gate compares `SKILL.md` against the changelog so the rule is enforceable rather than aspirational.** Angle 12 now traces the leaf-manifest generator, which this iteration touched only as a consumer reference.

---

Claim adjudication packets for this iteration's new P1 findings are embedded above; this iteration's new P2 requires no packet.

Review verdict: CONDITIONAL
