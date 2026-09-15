# Iteration 3: Lane C - SKILL.md against references and assets

## Dispatcher
- Lineage: devin-b (fan-out lane 2 of 3), executor cli-devin model=deepseek-v4-flash-max
- Session: fanout-devin-b-1789432854146-6hhsgk, generation 1, lineageMode new
- BINDING: target=specs/system-deep-loop/045-fanout-write-containment-hardening/014-alignment-review
- BINDING: maxIterations=5
- BINDING: convergence=0.1 (mode off, telemetry only)
- BINDING: mode=review
- BINDING: dimensions=correctness,traceability,maintainability
- BINDING: specFolder=specs/system-deep-loop/045-fanout-write-containment-hardening/014-alignment-review

## Focus
Lane C of spec.md scope: for `system-deep-loop`, its modes, `cli-external-orchestration` and its cli-* modes, and `sk-code`, whether each SKILL.md's routing, rules and claims match the files under its `references/` and `assets/` and its registry. Overlay protocol `skill_agent` continued from iteration 1.

## Scorecard
- Dimensions covered: correctness, traceability, maintainability
- Files reviewed: 7
- New findings: P0=0 P1=0 P2=2
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.17 (weighted 2/12 accumulated)

## Findings

### P0, Blocker
None.

### P1, Required
None.

### P2, Suggestion

- **F007**: system-deep-loop hub SKILL.md contradicts itself and the registry on improvement-lane and mode counts. `.opencode/skills/system-deep-loop/SKILL.md:27` says "improvement (2 lanes)" and line 58 says "the two improvement lanes `agent-improvement` and `model-benchmark`", but line 80 says "the 3 improvement modes all share the system-deep-loop/deep-improvement/ packet", line 161 says "improvement (3 lanes) — evaluator-first agent/model/skill improvement", and line 131 escalates "beyond the six registered". The registry `.opencode/skills/system-deep-loop/mode-registry.json:30-152` registers exactly five modes (research, review, ai-council, agent-improvement, model-benchmark), `leaf-manifest.json` carries the same five `workflowMode` entries, and `ROUTER.md:23,114` consistently says "the two improvement lanes". The 2-vs-3 and five-vs-six claims are stale prose inside the hub's own front door. Finding class: doc-contradiction, scope proof: registry modes[] counted (5), ROUTER.md lines read, affected surface hints: system-deep-loop SKILL.md §1/§2/§4/§7, mode-registry.json, ROUTER.md.
  - Dimension: maintainability. Evidence: `[SOURCE: .opencode/skills/system-deep-loop/SKILL.md:27]`, `[SOURCE: .opencode/skills/system-deep-loop/SKILL.md:80]`, `[SOURCE: .opencode/skills/system-deep-loop/SKILL.md:131]`, `[SOURCE: .opencode/skills/system-deep-loop/SKILL.md:161]`, `[SOURCE: .opencode/skills/system-deep-loop/mode-registry.json:30-152]`, `[SOURCE: .opencode/skills/system-deep-loop/ROUTER.md:23]`.
- **F008**: cli-external-orchestration hub SKILL.md says "all six modes" where seven are registered. `.opencode/skills/cli-external-orchestration/SKILL.md:74` ("It defines the per-mode leaf-intent model (all six modes, plus the deliberate absence...)") contradicts the same file's frontmatter description (line 3: "routes to seven workflow modes"), its mode table (lines 23-31, seven rows), line 53 (seven named), line 190 ("all seven current modes are"), and the registry/leaf-manifest (`.opencode/skills/cli-external-orchestration/leaf-manifest.json` has seven `workflowMode` entries: cli-claude-code, cli-codex, cli-cursor, cli-devin, cli-hermes, cli-opencode, cli-pi). The "six" phrasing likely predates cli-hermes. Finding class: doc-contradiction, scope proof: leaf-manifest workflowMode count (7), affected surface hints: cli-external-orchestration SKILL.md §2, leaf-manifest.json, mode-registry.json.
  - Dimension: maintainability. Evidence: `[SOURCE: .opencode/skills/cli-external-orchestration/SKILL.md:74]`, `[SOURCE: .opencode/skills/cli-external-orchestration/SKILL.md:3]`, `[SOURCE: .opencode/skills/cli-external-orchestration/SKILL.md:53]`, `[SOURCE: .opencode/skills/cli-external-orchestration/leaf-manifest.json:14-108]`.

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| skill_agent | partial | advisory | hub SKILL.md vs mode-registry.json vs leaf-manifest.json | F007/F008 are hub-prose-vs-registry contradictions; routing mechanics themselves align |
| spec_code | partial | hard | hub SKILL.md claims vs shipped files | allowed-tools union invariant holds (SKILL.md:55 vs registry toolSurface); ai-council packet naming claim verified (registry:91-94) |

## Integration Evidence
- Hub `allowed-tools` frontmatter (system-deep-loop SKILL.md:5) equals the union of the five modes' `toolSurface.allowed` (research adds WebFetch; all include Task/Write/Edit/Bash/Grep/Glob) — the line-55 invariant holds.
- The ai-council folder-vs-key claim (SKILL.md:106) matches the registry: packet `deep-ai-council`, packetSkillName `deep-ai-council`, command `/deep:ai-council`, agent `ai-council`.
- system-deep-loop ROUTER.md leaf sets match leaf-manifest (5 workflowModes).
- cli-external-orchestration hub-router/registry bidirectionality spot-checked via mode names; all seven packets exist on disk (directory listing).

## Edge Cases
- F007's "six registered" (SKILL.md:131) could be a stale count from when ai-council's key was being split; the authoritative count is the registry's five. The contradictory lane counts (2 vs 3) are the operative defect.
- F008's "six modes" could have meant "six modes plus hermes as the deliberate absence"; the sentence structure ("all six modes, plus the deliberate absence") makes that reading unlikely — the deliberate absence is about bare CLI-dispatch phrases, not a mode.

## Confirmed-Clean Surfaces
- system-deep-loop mode-registry.json ↔ leaf-manifest.json ↔ ROUTER.md: three-way agreement on five modes and two improvement lanes.
- cli-external-orchestration mode-registry.json ↔ leaf-manifest.json: seven-mode agreement.
- sk-code hub references resolve (continuation of iteration 1 spot checks).
- Hub tool grants match the registry union invariants in both hubs checked.

## Ruled Out
- A third improvement lane ("skill-improvement"): not present in the registry, leaf-manifest, or ROUTER.md; the "3 lanes" prose has no backing surface.
- cli-hermes missing packet: directory exists with full layout (SKILL.md, references, assets, manual-testing-playbook, changelog).

## Dead Ends
- Grepping hub-router.json signal keys for the improvement lanes: routing signals are mode-agnostic; no additional finding.

## Recommended Next Focus
- Dimension: Lane D (deep-loop command alignment) + D2 security angle (path handling, env precedence). Files: `.opencode/commands/deep/assets/deep-research-auto.yaml`, `deep-research-confirm.yaml`, `deep-review-auto.yaml`, `deep-review-confirm.yaml`, compiled contracts under `assets/compiled/`, vs the runtime scripts they invoke (fanout-run.cjs flags, append-mode-event.cjs, reduce-state.cjs).
- Reason: parent REQ-006 migrated the four YAMLs; verify each YAML's containment flag, inline enforcement calls, and bindings match the shipped runner contract.

Review verdict: PASS
