# Iteration 3: D3 Traceability — spec_code + skill_agent + feature_catalog_code Overlays

## Focus

- **Dimension:** traceability (D3)
- **Scope:** `SKILL.md`, `README.md`, `mode-registry.json`, `hub-router.json`, `command-metadata.json`, all 5 mode-packet `SKILL.md` files, runtime agent `design.md`.
- **Goal:** execute the `spec_code` core protocol and the `skill_agent` / `feature_catalog_code` overlay protocols; confirm the "one graph-metadata.json" and "no per-packet graph-metadata.json" invariants.

## Scorecard

- Dimensions covered: traceability (deep pass 1)
- Files reviewed: 9
- New findings: P0=0 P1=0 P2=2
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.07

## spec_code Protocol Results

| Claim (SKILL.md) | Status | Evidence |
|---|---|---|
| "five design modes" (line 15, 23-29) | pass | `mode-registry.json` has exactly 5 entries: interface, foundations, motion, audit, md-generator |
| "hub routes by `workflowMode` through `mode-registry.json`" (line 15, 41) | pass | `mode-registry.json.discriminator.workflowMode` is the documented public key; `command-metadata.json` records all carry `ownerMode` matching one of the 5 modes |
| "`graph-metadata.json` the ONE advisor identity" (line 73, 90) | pass | `find .opencode/skills/sk-design -name graph-metadata.json` returns exactly one file at the hub root |
| "no per-packet `graph-metadata.json`" (line 78, 95) | pass | the same find returns zero hits inside any of the 5 mode packet folders |
| "four doc-guidance modes cite the shared design reference base" (line 81) | pass | `shared/anti_slop_principles.md`, `shared/cognitive_laws.md`, `shared/design_token_vocabulary.md` exist; each doc-guidance mode references them |
| "`md-generator` runs the embedded Playwright extraction backend" (line 62, 81) | pass | `design-md-generator/backend/scripts/{crawl,extract,guided-run}.ts` ship Playwright import + extract pipeline; `mode-registry.json` marks `md-generator.backendKind = playwright-extract` |
| Backend discriminator split: 4× `reference-base` + 1× `playwright-extract` (line 45) | pass | `mode-registry.json` matches: interface/foundations/motion/audit = `reference-base`; md-generator = `playwright-extract` |
| `toolSurface.allowed` for doc-guidance modes = read-only | pass | `mode-registry.json` records `["Read","Glob","Grep"]` with `mutatesWorkspace: false` for the 4 doc-guidance modes |
| `toolSurface.allowed` for md-generator = read+write+bash | pass | md-generator record carries `["Read","Glob","Grep","Write","Edit","Bash"]` with `mutatesWorkspace: true` |
| Each mode has `aliases`, `packet`, `packetSkillName`, `advisorRouting` | pass | all 5 records carry the full field set; `advisorRouting.routingClass = "metadata"` everywhere |

## skill_agent Overlay Results

| SKILL.md claim | Agent (`design.md`) | Status |
|---|---|---|
| Load hub first, then mode (line 21, 89) | `design.md:55-62` "Load the hub. Read .opencode/skills/sk-design/SKILL.md" → "Load the mode. Read .opencode/skills/sk-design/design-<mode>/SKILL.md" | pass |
| Shared reference base under `shared/` (line 81) | `design.md:56-57` references `shared/` (anti-slop, cognitive laws, design token vocabulary) | pass |
| 5-mode map (line 23-29) | `design.md:70-76` Mode Map lists the same 5 modes with matching use-when descriptions | pass |
| LEAF discipline (no per-mode logic in hub) | `design.md:46` "This agent is LEAF-only. NEVER dispatch sub-agents" | pass |
| Quality gates cite shared references (line 87-90) | `design.md:84-90` "Anti-slop / Cognitive laws / Tokens" gates cite the same three shared files | pass |

## feature_catalog_code Overlay Results (design-md-generator)

| Catalog entry | Implementation | Status |
|---|---|---|
| `feature_catalog/01--extract/extract.md` | `backend/scripts/extract.ts` | pass |
| `feature_catalog/02--cluster-classify/cluster-classify.md` | `backend/scripts/cluster.ts` | pass |
| `feature_catalog/03--write-design-md/write-design-md.md` | `backend/scripts/build-write-prompt.ts` | pass |
| `feature_catalog/04--validate/validate.md` | `backend/scripts/validate.ts` | pass |
| `feature_catalog/05--report-preview/report-preview.md` | `backend/scripts/report-gen.ts`, `preview-gen.ts` | pass |
| `feature_catalog/06--feature-extractors/feature-extractors.md` | `a11y-extract.ts`, `motion-extract.ts`, `dark-mode-detect.ts`, `framework-detect.ts`, `icon-detect.ts` | pass |
| `feature_catalog/07--interaction-capture/interaction-capture.md` | `backend/scripts/interaction-capture.ts` | pass |

## Findings

### P0, Blocker
(none)

### P1, Required
(none)

### P2, Suggestion

- **F007** — `mode-registry.json` internal contradiction: prose says "all five are grandfathered" while every per-mode boolean is `grandfatheredFolderMismatch: false`. `.opencode/skills/sk-design/mode-registry.json:17`. The `advisorRoutingContract` block defines the field as *"true when the packet folder differs from packetSkillName"* and concludes *"All five sk-design modes preserve their original flat names, so all five are grandfathered."* But the definition says `true` only fires when names DIFFER; since folder = packetSkillName for every mode (e.g. `design-interface` ↔ `design-interface`), the per-mode booleans are correctly `false` and the prose conclusion is wrong: **none are grandfathered**, not all. This is machine-readable metadata with self-contradicting prose. Downstream consumers reading the prose-only summary will mis-report grandfather status. The `command-metadata.json` surface-check passes because it does not validate this prose-vs-boolean agreement, so the drift is invisible to the standing invariant gate.
  - **Category:** traceability
  - **Dimension:** traceability
  - **ScopeProof:** `mode-registry.json` is the routing contract cited by `SKILL.md:41` and named in the orchestrator reviewScopeNote.
  - **Recommendation:** correct the prose: "All five sk-design modes preserve their original flat names, so **none** require grandfathering (`grandfatheredFolderMismatch: false` everywhere)."

- **F008** — Runtime agent design.md frontmatter drift across runtimes. `.opencode/agents/design.md:1-19` uses a granular `permission:` block (`read: allow, write: allow, ..., task: deny, patch: deny, external_directory: allow`) while `.claude/agents/design.md:1-5` uses Claude's flat `tools: Read, Write, Edit, Bash, Grep, Glob, mcp__mk_spec_memory__*`. The bodies are otherwise identical, but the OpenCode variant grants `webfetch: allow` and `memory: allow` that the Claude variant elides into `mcp__mk_spec_memory__*` and provides no WebFetch equivalent. Effective capability drift between runtimes: an OpenCode dispatch can WebFetch where a Claude dispatch cannot. This is below the skill_agent gate threshold (the agent file is a runtime packaging surface, not a skill-owned artifact), but worth recording because the SKILL.md "NEVER treat transports as taste authority" rule (line 97) implies symmetric capability expectations.
  - **Category:** traceability
  - **Dimension:** traceability
  - **ScopeProof:** runtime agents are the agent face of the `sk-design` skill per the skill_agent overlay protocol.
  - **Recommendation:** document the runtime-capability asymmetry (WebFetch present in OpenCode design.md, absent in Claude design.md) in `SKILL.md §7 Integration Points` so consumers know the audit mode's external-reference fetch capability is runtime-dependent.

### Claim-Adjudication Packets
(none — no new P0/P1)

## Cross-Reference Results

| Protocol | Level | Status | Gate | Evidence | Notes |
|----------|-------|--------|------|----------|-------|
| spec_code | core | pass | hard | 10/10 claims verified above | — |
| checklist_evidence | core | n/a | hard | no spec-folder checklist for this target | exempt |
| skill_agent | overlay | pass | advisory | 5/5 SKILL↔agent agreement checks | — |
| agent_cross_runtime | overlay | n/a | advisory | target is `skill`, not `agent` | exempt |
| feature_catalog_code | overlay | pass | advisory | 7/7 design-md-generator catalog entries ↔ implementation | — |
| playbook_capability | overlay | deferred | advisory | scheduled for iteration 4 | — |

## Assessment

- New findings ratio: 0.07
- Dimensions addressed: traceability
- Novelty justification: F007 is a real internal contradiction in machine-readable routing metadata; F007 slipped past the standing `design-command-surface-check` invariant because that check does not validate prose-vs-boolean agreement in `mode-registry.json`. F008 documents a runtime capability asymmetry that consumers should know about.

## Ruled Out

- "design-command-surface-check STATUS=PASS" already covered in iteration 1; the metadata-level structural checks pass; only the prose-level contradiction (F007) escapes them.

## Dead Ends

- Checked whether any mode packet secretly ships its own `graph-metadata.json` — confirmed none do (find returns exactly one hit at the hub root).

## Recommended Next Focus

D3 traceability pass 2: execute the `playbook_capability` overlay for at least 2 modes (audit + interface) by sampling manual_testing_playbook scenarios and confirming each names a real, executable capability in the mode's references/scripts. Then move to D4 maintainability.

Review verdict: PASS
