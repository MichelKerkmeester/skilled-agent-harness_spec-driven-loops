# Iteration 3: D3 Traceability — REQ/checklist/catalog/playbook

## Focus
Dimension: traceability. Core protocols `spec_code` and `checklist_evidence`; overlays `feature_catalog_code` and `playbook_capability`. Map REQ-001..003 and tasks.md evidence to shipped skill artifacts; verify leaf-manifest leaves exist; smoke advisor routing.

## Scorecard
- Dimensions covered: traceability
- Files reviewed: 9
- New findings: P0=0 P1=1 P2=2
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.41

## Findings

### P0, Blocker
(none)

### P1, Required
- **F004**: T005 completion evidence lacks advisor-run transcript, `specs/sk-doc/028-sk-communication-skill/tasks.md:68`, Checked row claims "advisor returns sk-communication as the top match" but cites only `graph-metadata.json` intent signals as evidence — not a command transcript or captured recommendation fields. Warm advisor smoke in this review does return `skillId: sk-communication` first (confidence 0.9423), so the behavior appears true, but the packet's checked completion claim is under-evidenced for `checklist_evidence`. Dimension: traceability. Recommendation: attach the advisor CLI/MCP transcript (exit status + top recommendation fields) to T005 evidence, or point at a persisted COMM-001 benchmark report.

### P2, Suggestion
- **F005**: Placeholder session_dedup fingerprints in packet docs, `specs/sk-doc/028-sk-communication-skill/spec.md:23`, Continuity frontmatter uses `sha256:0000…0000` in spec.md, plan.md, tasks.md, and implementation-summary.md despite `completion_pct: 100` and Status Complete. Weakens resume/freshness honesty for a claimed-complete packet. Dimension: traceability. Recommendation: run a real continuity save so fingerprints recompute, or stop claiming completion freshness until they do.

- **F006**: COMM-001 catalog cross-ref is a privacy feature, not advisor routing, `.opencode/skills/sk-communication/manual-testing-playbook/manual-testing-playbook.md:130`, Advisor-routing scenario links its catalog entry to `privacy-first-provider-routing.md`. Playbook release rules require each root-indexed scenario to map to a current catalog entry; privacy is adjacent but not the advisor skill-routing capability under test. Dimension: traceability. Recommendation: add an advisor-routing catalog entry or document an explicit exception for skill-level (non-package) scenarios.

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | partial | hard | spec.md:88-95 vs SKILL.md + skill root files | REQ-001/002 present; public export claim still partial via F001 |
| checklist_evidence | fail | hard | tasks.md:68 | F004 under-evidenced checked claim; Level 1 has no checklist.md |
| feature_catalog_code | pass | advisory | feature-catalog/*.md + src anchors | Feature files cite real package paths |
| playbook_capability | partial | advisory | playbook index + 8 scenario files | Scenarios exist and catalog_applicable=true; F006 mapping soft miss |

## Assessment
- New findings ratio: 0.41
- Dimensions addressed: traceability
- Novelty justification: First dedicated protocol pass. Manifest leaves 20/20 on disk. REQ-002 invariant phrases all present in SKILL.md. Advisor smoke confirms top-rank sk-communication.

## Ruled Out
- Missing leaf-manifest files: zero missing leaves from `leaf-manifest.json`.
- Missing REQ-002 invariant statements in SKILL.md: pipeline, both tiers, privacy-before-ranking, exact-original, content-free all present.

## Dead Ends
- None.

## Recommended Next Focus
D4 Maintainability — README/SKILL consistency, scaffold leftovers, continuity hygiene, follow-on change cost.

Review verdict: CONDITIONAL
