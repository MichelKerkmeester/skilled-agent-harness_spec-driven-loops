# Deep Review Iteration 007

## Dimension

- Focus: traceability, maintainability, sk-doc structural conformance.
- Target: `.opencode/skills/sk-design/design-interface/**` plus the required hub metadata checks for this packet's `mode-registry.json` and `/design:interface` command projection.
- Prior registry acknowledged: existing findings are outside `design-interface` and were not re-counted.

## Files Reviewed

- `.opencode/specs/sk-design/009-sk-design-claude-parity/027-comprehensive-deep-review/review/deep-review-findings-registry.json:9`
- `.opencode/specs/sk-design/009-sk-design-claude-parity/027-comprehensive-deep-review/review/deep-review-strategy.md:226`
- `.opencode/specs/sk-design/009-sk-design-claude-parity/027-comprehensive-deep-review/review/deep-review-state.jsonl:1`
- `.opencode/skills/sk-code/code-review/references/review_core.md:28`
- `.opencode/skills/sk-design/mode-registry.json:26`
- `.opencode/skills/sk-design/mode-registry.json:40`
- `.opencode/skills/sk-design/command-metadata.json:332`
- `.opencode/skills/sk-design/command-metadata.json:477`
- `.opencode/skills/sk-design/design-interface/SKILL.md:1`
- `.opencode/skills/sk-design/design-interface/SKILL.md:49`
- `.opencode/skills/sk-design/design-interface/SKILL.md:93`
- `.opencode/skills/sk-design/design-interface/SKILL.md:120`
- `.opencode/skills/sk-design/design-interface/SKILL.md:151`
- `.opencode/skills/sk-design/design-interface/README.md:106`
- `.opencode/skills/sk-design/design-interface/references/design-process/transform_application.md:17`
- `.opencode/skills/sk-design/design-interface/references/design-process/transform_application.md:182`
- `.opencode/skills/sk-design/design-interface/feature_catalog/03--procedure-cards/interface-procedure-card-inventory.md:24`
- `.opencode/skills/sk-design/design-interface/manual_testing_playbook/14--procedure-card-contract/card-selection-proof.md:41`

Package check run:

```text
python3 .opencode/skills/sk-doc/scripts/package_skill.py .opencode/skills/sk-design/design-interface --check
Result: PASS
Warnings:
- SKILL.md has 4173 words (recommended max: 3000)
- SMART ROUTING section missing smart-router marker(s): discover_markdown_resources, _guard_in_skill, UNKNOWN_FALLBACK (see skill_smart_router.md pseudocode)
```

## Findings by Severity

### P0

- None.

### P1

- None.

### P2

#### P2-007-001 [P2] `design-interface` SKILL.md exceeds the sk-doc package size recommendation

- Claim: The packet passes packaging, but the checker emits a maintainability warning because `SKILL.md` is 4173 words, above the recommended 3000-word cap.
- Evidence: package checker output reports `SKILL.md has 4173 words (recommended max: 3000)`; `.opencode/skills/sk-design/design-interface/SKILL.md:1` through `.opencode/skills/sk-design/design-interface/SKILL.md:321` contains the oversized runtime contract.
- Rule violated: `package_skill.py --check` warning: `SKILL.md has 4173 words (recommended max: 3000)`.
- Scope proof: This is packet-local to `design-interface/SKILL.md`; no prior registry finding covers this packet warning.
- Recommendation: Move non-routing explanatory detail into packet references while preserving the runtime-critical routing table, procedure selection, and rules.

#### P2-007-002 [P2] Smart-router block lacks the sk-doc marker functions expected by the package checker

- Claim: The packet's SMART ROUTING section contains a parseable intent model, but it omits the checker-expected smart-router markers, making the packet less conformant to sk-doc smart-router shape.
- Evidence: package checker output reports `SMART ROUTING section missing smart-router marker(s): discover_markdown_resources, _guard_in_skill, UNKNOWN_FALLBACK`; `.opencode/skills/sk-design/design-interface/SKILL.md:93` introduces the parseable model and `.opencode/skills/sk-design/design-interface/SKILL.md:120` defines `RESOURCE_MAP`, but grep found no `discover_markdown_resources`, `_guard_in_skill`, or `UNKNOWN_FALLBACK` in `SKILL.md`.
- Rule violated: `package_skill.py --check` warning: `SMART ROUTING section missing smart-router marker(s): discover_markdown_resources, _guard_in_skill, UNKNOWN_FALLBACK (see skill_smart_router.md pseudocode)`.
- Scope proof: The warning is isolated to the `design-interface` packet's `SKILL.md` smart-router block.
- Recommendation: Either add the expected smart-router marker scaffold or update the checker/template contract if this packet intentionally uses the compact parseable model.

#### P2-007-003 [P2] Transform-application guidance is orphaned from the router and `/design:interface` command projection

- Claim: The packet contains a dedicated `transform_application.md` lane for `bolder`, `quieter`, `distill`, `clarify`, and `delight`, but the runtime router and `/design:interface` command metadata do not reference it, so the transform-specific guidance is not reachable from the declared transform-verb routes.
- Evidence: `transform_application.md` says it is the interface-side landing lane and should be read with `design_principles.md` and `brief_to_dials.md` at `.opencode/skills/sk-design/design-interface/references/design-process/transform_application.md:17` and `.opencode/skills/sk-design/design-interface/references/design-process/transform_application.md:19`. The registry declares interface transform aliases and command projection parity at `.opencode/skills/sk-design/mode-registry.json:26` through `.opencode/skills/sk-design/mode-registry.json:32`. The `/design:interface` command projections for `bolder`, `quieter`, `distill`, and `delight` cite other references at `.opencode/skills/sk-design/command-metadata.json:477` through `.opencode/skills/sk-design/command-metadata.json:521`, but not `transform_application.md`. The packet router's `RESOURCE_MAP` at `.opencode/skills/sk-design/design-interface/SKILL.md:120` through `.opencode/skills/sk-design/design-interface/SKILL.md:132` also omits `transform_application.md`.
- Scope proof: `grep` for `transform_application|bolder|quieter|distill|delight|clarify` under `design-interface` found the dedicated reference itself and generic routing text at `SKILL.md:49`, but no router/resource-map linkage to the file.
- Recommendation: Wire `references/design-process/transform_application.md` into the relevant interface transform intent/resource map and command projection reference sources, or delete/merge the orphaned lane if the current references are canonical.

## Traceability Checks

- `sk-doc-package-check`: PASS with warnings. Warnings recorded as P2 findings per the iteration charter.
- `mode-registry packetSkillName`: PASS. `mode-registry.json:49` declares packet `design-interface`, `mode-registry.json:51` declares `packetSkillName: design-interface`, and `SKILL.md:2` has `name: design-interface`.
- `mode-registry proceduresPath`: PASS. `mode-registry.json:50` declares `design-interface/procedures`; the packet contains the six procedure cards listed in `SKILL.md:157` through `SKILL.md:162`, `README.md:108`, and the procedure inventory at `feature_catalog/03--procedure-cards/interface-procedure-card-inventory.md:28`.
- `mode-registry toolSurface`: PASS. `mode-registry.json:43` through `mode-registry.json:47` allows `Read`, `Glob`, and `Grep`, forbids `Write`, `Edit`, and `Bash`, and marks `mutatesWorkspace:false`; `SKILL.md:4` allows `Read`, `Grep`, and `Glob`, and `SKILL.md:171` states direct fallback uses Read/Glob/Grep only and cannot rely on Write/Edit/Bash/Task.
- `/design:interface command metadata`: PARTIAL. Command identity, argument grammar, tasks, handoff, proof fields, and procedure-family claims match the packet, but transform-verb projections do not reference the packet's transform-specific landing lane.
- `procedure-card maintainability`: PASS. `README.md:106` through `README.md:108`, `SKILL.md:151` through `SKILL.md:165`, the feature catalog, and the manual testing scenario make the private procedure-card structure self-documenting.

## Verdict

PASS with advisories. This iteration found no P0/P1 blockers. It found three new P2 maintainability/traceability findings.

## Next Dimension

Wave 2 sibling iterations continue `design-interface` correctness/security and `design-foundations` coverage. After the wave completes, merge P2-007-001 through P2-007-003 into the shared registry if still active.

Review verdict: PASS
