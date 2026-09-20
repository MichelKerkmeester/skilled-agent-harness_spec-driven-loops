---
title: "Iteration 2: Angle 2 — Routing artifact parity, sk-code and cli-external-orchestration hubs"
trigger_phrases: []
---
# Iteration 2: Angle 2 — Routing artifact parity, sk-code and cli-external-orchestration hubs

## Focus

Angle 2. The same seven routing artifacts for `sk-code` and `cli-external-orchestration`: `SKILL.md` (mode table), `mode-registry.json`, `hub-router.json`, `ROUTER.md`, `leaf-manifest.json`, `graph-metadata.json`, `description.json`, read against each other for agreement on mode names, counts, routing classes, versions, and leaf sets.

The phase spec's own priority claim for this angle was tested first: that `cli-external-orchestration` registers seven modes including `cli-hermes` while its `ROUTER.md` and `SKILL.md` say six.

Dimension: traceability (primary), correctness (secondary).
Method: machine-readable extraction of every roster and version field from both hubs, set comparisons rather than sampling, and a third-hub comparison where a rule's scope had to be established. Two findings from iteration 1 were re-tested against evidence that only angle 2 could supply; both are re-scoped in the Notes section below rather than silently carried.

## Files Reviewed

- `.opencode/skills/sk-code/{SKILL.md,mode-registry.json,hub-router.json,ROUTER.md,leaf-manifest.json,graph-metadata.json,description.json,README.md}`
- `.opencode/skills/cli-external-orchestration/{SKILL.md,mode-registry.json,hub-router.json,ROUTER.md,leaf-manifest.json,graph-metadata.json,description.json,README.md}`
- `.opencode/skills/system-deep-loop/ROUTER.md` (third-hub control for the `defaultResource` question)
- `.opencode/bin/lib/compiled-routing/009-parent-hub-rollout/00{1-sk-code,2-system-deep-loop,3-mcp-tooling,4-cli-external-orchestration}/lib/registry-compiler.cjs`
- `.opencode/bin/lib/compiled-routing/004-compiler-n1-shadow/compiler/compiler.cjs:182-187`

## Scorecard

- Dimensions covered: traceability
- Files reviewed: 16 artifacts (7 per hub, 1 control, 4 compiler branches)
- New findings: P0=1 P1=2 P2=1
- Refined findings: P0=0 P1=1 P2=0 (F004 re-scoped)
- New findings ratio: 1.00

## Cross-Artifact Agreement Matrix

| Property | sk-code | cli-external-orchestration | Agree? |
|---|---|---|---|
| mode roster across all seven artifacts | 6 modes, identical in `SKILL.md` table, registry, `hub-router` tieBreak + routerSignals, leaf-manifest | 7 modes, identical in `SKILL.md` table, registry, `hub-router` tieBreak + routerSignals, leaf-manifest | **sk-code yes; cli yes in machine artifacts** |
| registry alias ↔ hub vocabulary coverage | every registry alias present in its vocab class (0 registry-only terms) | every registry alias present in its vocab class (0 registry-only terms) | **both yes** |
| version: `SKILL.md` vs `description.json` | 4.2.2.0 == 4.2.2.0 — MATCH | 1.5.0.0 == 1.5.0.0 — MATCH | **both yes** |
| version: `mode-registry.json` vs `hub-router.json` | 4.1.0.1 == 4.1.0.1 — MATCH | 1.2.0.2 vs 1.2.1.2 — DIFFER | **NO (cli)** |
| every `RESOURCE_MAP` path on disk and in `leaf-manifest` | 22 map keys, all resolve | 14 paths, all resolve and register | **both yes** |
| `ROUTER.md` §2 mode coverage vs registry roster | no per-mode bullets; map covers intent families, not modes | **6 of 7** — `cli-hermes` absent from §1 and §2 | **NO (cli)** |
| `ROUTER.md` `INTENT_SIGNALS` vs `RESOURCE_MAP` | n/a (different key space) | 7 signals vs 7 map keys — consistent | **yes** |
| mode-count prose vs roster | no count phrases in `SKILL.md`/`README.md` | "seven" ×4 vs "six" ×1 | **NO (cli)** |
| N-to-1 lane fan-out distinctness | no N-to-1 groups | no N-to-1 groups | **both yes** |

## Findings

### P0, Blocker

- **F007**: `cli-external-orchestration`'s `ROUTER.md` — the stage-two surface router that is the authoritative statement of which leaves each mode loads — omits the seventh registered mode entirely, in all three places it enumerates the roster. `ROUTER.md:24-25` lists the modes the hub selects as "(`cli-opencode`, `cli-claude-code`, `cli-codex`, `cli-cursor`, `cli-devin`, or `cli-pi`)" — six, no `cli-hermes`. `ROUTER.md:38-46` opens the INTENT MODEL with "Each mode's first-slice leaf set is…" and then provides bullets for exactly six modes; `grep -c '^- \*\*cli-'` returns 6, and `cli-hermes` appears nowhere in lines 1-70. `ROUTER.md:143-144` closes the how-to-read rules with the same six-name list. Against that, `mode-registry.json` registers seven modes including `cli-hermes` (packet `cli-hermes`, `packetKind: workflow`), `hub-router.json` carries seven `routerSignals` and lists `cli-hermes` in `routerPolicy.tieBreak`, `leaf-manifest.json` carries a nine-leaf `cli-hermes` entry, `SKILL.md:31` carries a `cli-hermes` mode-table row and `:74` says "all six modes", and the `RESOURCE_MAP` inside this same document does have a `HERMES` key with `cli-hermes/references/cli-reference.md` and `cli-hermes/references/integration-patterns.md`. So the document routes a mode in its machine block while its human-facing contract says the mode does not exist. This is the exact defect the phase spec predicted for angle 2, confirmed at line. Severity is P0 rather than P1 because `ROUTER.md` is the artifact this hub's own SKILL.md:74 names as the stage-two routing authority, and a reader or an agent learning the hub's leaf model from it is told there are six modes and given no `cli-hermes` intent model or leaf set at all — the newest registered mode is the one the routing document cannot describe. [SOURCE: .opencode/skills/cli-external-orchestration/ROUTER.md:24-25] [SOURCE: .opencode/skills/cli-external-orchestration/ROUTER.md:38-46] [SOURCE: .opencode/skills/cli-external-orchestration/ROUTER.md:143-144] [SOURCE: .opencode/skills/cli-external-orchestration/mode-registry.json:31-151] [SOURCE: .opencode/skills/cli-external-orchestration/hub-router.json:1-65] [SOURCE: .opencode/skills/cli-external-orchestration/leaf-manifest.json:1-90] [SOURCE: .opencode/skills/cli-external-orchestration/SKILL.md:74]

### P1, Required

- **F008**: `cli-external-orchestration`'s `SKILL.md:74` contradicts the other four mode-count statements in its own hub, including one eleven lines earlier in the same file. `:74` says `ROUTER.md` "defines the per-mode leaf-intent model (all six modes, …)". The same file says seven at `:3` ("routes to seven workflow modes"), `:15` ("One skill, seven workflow modes"), `:54` ("All seven modes are primary, independently-routable dispatch workflows"), and `:190` ("all seven current modes are"). `README.md:33,48,66,96,134` says seven five times. `description.json:3` says seven and enumerates all seven by name including `cli-hermes`. So five artifacts agree on seven and one line of `SKILL.md` says six — and that line is precisely the sentence describing `ROUTER.md`, the document F007 shows is itself stuck at six. The two defects are the same stale edit landing in a prose claim and in the artifact it describes. [SOURCE: .opencode/skills/cli-external-orchestration/SKILL.md:74] [SOURCE: .opencode/skills/cli-external-orchestration/SKILL.md:54] [SOURCE: .opencode/skills/cli-external-orchestration/SKILL.md:190] [SOURCE: .opencode/skills/cli-external-orchestration/README.md:48] [SOURCE: .opencode/skills/cli-external-orchestration/description.json:3]
- **F009**: `cli-external-orchestration`'s `mode-registry.json` and `hub-router.json` carry different versions while `sk-code`'s carry the same, so the one pair the fleet does keep in parity is the pair this hub splits. `cli` reads `mode-registry.json` = `1.2.0.2` against `hub-router.json` = `1.2.1.2`. `sk-code` reads `4.1.0.1` for both. The `SKILL.md`/`description.json` pair matches in both hubs (`cli` 1.5.0.0/1.5.0.0; `sk-code` 4.2.2.0/4.2.2.0), which isolates the divergence to this one pair on this one hub. Combined with F001, the picture is that `system-deep-loop` splits both pairs and `cli-external-orchestration` splits one, while `sk-code` — the hub the other two are modelled on — splits neither. [SOURCE: .opencode/skills/cli-external-orchestration/mode-registry.json:3] [SOURCE: .opencode/skills/cli-external-orchestration/hub-router.json:3] [SOURCE: .opencode/skills/sk-code/mode-registry.json:3] [SOURCE: .opencode/skills/sk-code/hub-router.json:3]

### P2, Suggestion

- **F010**: `cli-external-orchestration`'s `ROUTER.md` describes its `RESOURCE_MAP` incompletely relative to its own intent-model prose, in the one mode whose deeper references the prose singles out. `ROUTER.md:40-44` states the intent model is "Each mode's first-slice leaf set … CLI command reference + integration-pattern guide", and that "Each mode ALSO carries a dedicated `references/providers-and-models.md` catalog … it is not part of the first slice", restated at `:139-143`. `RESOURCE_MAP` gives `HERMES` two entries like the other six, which is consistent — but `cli-hermes`'s manifest entry carries nine leaves including `references/mcp-policy.md`, a file no other CLI mode's leaf set contains and that no sentence in `ROUTER.md` accounts for. Advisory: the map is explicitly a first slice so the extra leaves are not a map defect, but the one mode-specific reference unique to this lane is undescribed anywhere in the routing document. [SOURCE: .opencode/skills/cli-external-orchestration/ROUTER.md:40-44] [SOURCE: .opencode/skills/cli-external-orchestration/ROUTER.md:139-143] [SOURCE: .opencode/skills/cli-external-orchestration/leaf-manifest.json:1-90]

## Claim Adjudication

```json
{"findingId":"F007","claim":"cli-external-orchestration ROUTER.md enumerates six modes in all three roster statements and contains no cli-hermes intent model or leaf description, while the registry, hub-router, leaf-manifest, SKILL.md mode table and the document's own RESOURCE_MAP all carry seven including cli-hermes.","evidenceRefs":[".opencode/skills/cli-external-orchestration/ROUTER.md:24-25",".opencode/skills/cli-external-orchestration/ROUTER.md:38-46",".opencode/skills/cli-external-orchestration/ROUTER.md:143-144",".opencode/skills/cli-external-orchestration/mode-registry.json:31-151",".opencode/skills/cli-external-orchestration/leaf-manifest.json:1-90"],"counterevidenceSought":"Grepped lines 1-70 for any hermes mention (zero hits), counted the per-mode intent bullets programmatically (6), read the RESOURCE_MAP block to test whether the machine block also omitted HERMES (it does not — the HERMES key is present with two paths), and read SKILL.md:74 to see whether the hub's own prose acknowledged a six-mode surface router.","alternativeExplanation":"The omission could be deliberate if cli-hermes were registered but not yet routable, or if ROUTER.md were a frozen legacy artifact superseded by the compiled router. Both are rejected: mode-registry.json gives cli-hermes packetKind workflow and a full tool surface, leaf-manifest.json carries a nine-leaf entry for it, and the same ROUTER.md routes HERMES in its own RESOURCE_MAP, which a frozen artifact would not do.","finalSeverity":"P0","confidence":0.93,"downgradeTrigger":"Downgrade to P1 if ROUTER.md is shown to be superseded by the compiled router for this hub and explicitly marked non-authoritative, so no reader or agent depends on its roster.","transitions":[{"iteration":2,"from":null,"to":"P0","reason":"The phase spec predicted this class and it is confirmed at line; the routing authority for a live registered mode omits it entirely"}]}
```

```json
{"findingId":"F008","claim":"cli-external-orchestration SKILL.md:74 says all six modes while four other lines in the same file and five statements in other hub artifacts say seven.","evidenceRefs":[".opencode/skills/cli-external-orchestration/SKILL.md:74",".opencode/skills/cli-external-orchestration/SKILL.md:54",".opencode/skills/cli-external-orchestration/SKILL.md:190",".opencode/skills/cli-external-orchestration/README.md:48",".opencode/skills/cli-external-orchestration/description.json:3"],"counterevidenceSought":"Regular-expression counted every mode-count phrase in SKILL.md, README.md and ROUTER.md rather than reading for one, which returned the mixed seven/six set inside SKILL.md itself.","alternativeExplanation":"The six at SKILL.md:74 could describe something narrower than the roster, such as the six modes that predate the cli-hermes addition. Rejected because the sentence's subject is ROUTER.md's per-mode leaf-intent model, which the registry scopes to all seven registered modes.","finalSeverity":"P1","confidence":0.95,"downgradeTrigger":"Downgrade to P2 if the sentence is corrected to seven as part of the F007 fix.","transitions":[{"iteration":2,"from":null,"to":"P1","reason":"Initial discovery; self-contradiction inside one document against five corroborating artifacts"}]}
```

```json
{"findingId":"F009","claim":"cli-external-orchestration mode-registry.json and hub-router.json carry different versions while the same pair in sk-code carries the same version.","evidenceRefs":[".opencode/skills/cli-external-orchestration/mode-registry.json:3",".opencode/skills/cli-external-orchestration/hub-router.json:3",".opencode/skills/sk-code/mode-registry.json:3",".opencode/skills/sk-code/hub-router.json:3"],"counterevidenceSought":"Read all five version-bearing artifacts in all three hubs as a matrix rather than comparing the pair in isolation, which established that sk-code keeps both pairs in parity and system-deep-loop keeps neither.","alternativeExplanation":"Independent per-artifact versioning could be the fleet convention, in which case neither hub is wrong. Rejected on the same evidence as F001: the fleet is inconsistent among itself, and sk-code is the hub the other two follow for every other routing convention, so parity is the observable convention and the divergences are defects.","finalSeverity":"P1","confidence":0.8,"downgradeTrigger":"Fold into F001's resolution if a single shared generation field is introduced across all three hubs.","transitions":[{"iteration":2,"from":null,"to":"P1","reason":"Initial discovery; completes the fleet version matrix begun in iteration 1"}]}
```

```json
{"findingId":"F010","claim":"cli-hermes leaf set carries references/mcp-policy.md, a reference unique to that lane that no sentence in ROUTER.md describes, while the document describes every other mode's first slice and its on-demand providers catalog.","evidenceRefs":[".opencode/skills/cli-external-orchestration/ROUTER.md:40-44",".opencode/skills/cli-external-orchestration/ROUTER.md:139-143",".opencode/skills/cli-external-orchestration/leaf-manifest.json:1-90"],"counterevidenceSought":"Compared the seven cli mode leaf sets member by member to find lane-unique references, and checked whether any ROUTER.md prose sentence accounts for a hermes-specific on-demand reference the way it does for providers-and-models.md.","alternativeExplanation":"mcp-policy.md may be intentionally undescribed because it is an internal on-demand reference rather than part of any routing contract, which is why this is filed as P2 advisory rather than a contract break.","finalSeverity":"P2","confidence":0.62,"downgradeTrigger":"Resolve when ROUTER.md's intent model either names the hermes MCP policy reference or states that lane-unique on-demand references are deliberately undescribed.","transitions":[{"iteration":2,"from":null,"to":"P2","reason":"Initial discovery; lowest-confidence finding of the iteration, recorded as an advisory documentation gap"}]}
```

## Traceability Checks

| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | partial | hard | `specs/system-deep-loop/049-deep-loop-alignment-review/001-angle-driven-review/spec.md:87` | Angle 2's explicit prediction (seven modes including `cli-hermes` against a ROUTER.md/SKILL.md saying six) is confirmed: F007 and F008. `sk-code`'s seven artifacts are fully consistent. Partial rather than pass because the angle's own subject fails on one hub. |
| checklist_evidence | notApplicable | hard | — | The phase spec carries no per-iteration checklist rows; its REQ rows are assessed at synthesis. |

## Assessment

- New findings ratio: 1.00
- Dimensions addressed: traceability
- Novelty justification: four independent classes — a missing mode across every roster statement in a routing authority (F007), a contradictory count inside one document (F008), a fleet-parity version split on one pair (F009), and an undescribed lane-unique reference (F010). F008 is the prose face of F007, but they are filed separately because they have different owners and different fixes; every other finding stands on its own artifact pair.

## Notes — Re-Scoping of Two Iteration-1 Findings

Angle 2 supplied evidence that only a second and third hub could produce, and two iteration-1 claims do not survive it unchanged. They are corrected here rather than silently carried forward.

- **F003 (iteration 1) — scope corrected.** I asserted the `defaultResource` shape divergence was a `system-deep-loop` defect. The full fleet matrix shows the same divergence in all three hubs: `system-deep-loop` hub-router `["ROUTER.md","mode-registry.json"]` vs `ROUTER.md` `[]`; `sk-code` hub-router `["shared/README.md"]` vs `ROUTER.md` three `shared/references/*` paths; `cli-external-orchestration` hub-router `["ROUTER.md","mode-registry.json"]` vs `ROUTER.md` `[]`. The finding is real but **fleet-wide convention drift**, not a hub-local defect, and the iteration-1 claim that `system-deep-loop` is the outlier is withdrawn. Impact stays bounded as iteration 1 stated: only the `004-cli-external-orchestration` compiler branch reads the field (one hit), the other three branches read zero.
- **F004 (iteration 1) — claim narrowed.** I framed the identical 61-leaf lane sets as a 2-vs-61 sync failure against `ROUTER.md`. `ROUTER.md` for a sibling hub declares its `RESOURCE_MAP` explicitly and repeatedly as a **first slice** ("Each mode's first-slice leaf set is its CLI command reference + its integration-pattern guide … like the deeper per-mode references, it is not part of the first slice", `ROUTER.md:40-44`, restated `:139-143`). A first slice is by construction a subset, so `ROUTER.md` listing 2 leaves does not contradict a 61-leaf manifest. The surviving part of F004 is the **N-to-1 non-distinctness**: the manifest gives the two improvement lanes byte-identical arrays where `generate-leaf-manifest.cjs:161-163` promises "distinct, independently addressable leaf sets" for exactly that fan-out case. The 2-vs-61 arm is withdrawn; F004 is downgraded in scope, not in severity.

## Ruled Out

- **The phase spec's `cli-hermes` prediction being wrong, or describing a different artifact**: ruled out. The prediction is confirmed at line and the affected document carries the seven-mode `RESOURCE_MAP` in its own machine block.
- **`sk-code` hub routing-artifact parity**: ruled out clean on every property checked. Six modes identical across `SKILL.md` table, registry, `hub-router.json` tieBreak and routerSignals, and `leaf-manifest.json`; zero registry aliases missing from their hub vocabulary class; both version pairs in parity; 22 `RESOURCE_MAP` keys; no N-to-1 fan-out group; no contradictory mode-count prose. `sk-code` is the parity baseline the other two hubs fail against.
- **`cli-external-orchestration` registry-alias coverage gap**: ruled out. Zero registry-only terms across all seven modes — unlike `system-deep-loop`'s F006. Every registry alias appears in its `*-aliases` vocabulary class.
- **`cli-external-orchestration` `INTENT_SIGNALS` incomplete**: ruled out. Seven signal keys against seven `RESOURCE_MAP` keys; my first parse read one key because a nested brace truncated it, corrected by re-parsing the block to its closing brace.
- **`leaf-manifest.json` cross-packet leaf contamination on the cli hub**: ruled out. My initial check flagged 65 "foreign" leaves; that check was wrong because leaves are packet-root-relative, not hub-relative. Re-running it against the packet-root convention shows every mode's leaves belong to its own packet directory.
- **`sk-code` and `cli-external-orchestration` N-to-1 lane non-distinctness**: ruled out. `sk-code` is 6 modes → 6 packets with no group; `cli` is 7 modes → 7 packets with no group. The only N-to-1 fan-out in the three hubs is `system-deep-loop`'s improvement pair already filed as F004.

## Dead Ends

- **Reading `ROUTER.md`'s `DEFAULT_RESOURCE` as a per-hub contract breach**: pursuing this would have produced a third copy of the same finding. The matrix showed it is one fleet-wide convention question, so it was consolidated into F003's correction instead of filed three times.
- **Treating the cli hub's `RESOURCE_MAP` two-entry shape as incomplete**: it is a declared first slice, and the map's own comment block says so. Chasing leaf-count differences would have manufactured false findings.

## Recommended Next Focus

Angle 3 — SKILL.md against references and assets, for the three hubs and every mode under them: each path a `SKILL.md` cites must exist, each file under `references/` and `assets/` must be reachable from its router, and version fields must agree across each mode's files. The `sk-code` baseline established here is now available as a control, and angle 3 is the first angle that reads mode-level files rather than hub-root artifacts.

Review verdict: FAIL
