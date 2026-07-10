## Dimension

Traceability + maintainability + sk-doc structural conformance for `.opencode/skills/sk-design/design-foundations/**`.

## Files Reviewed

- `.opencode/skills/sk-design/design-foundations/SKILL.md:1`
- `.opencode/skills/sk-design/design-foundations/SKILL.md:93`
- `.opencode/skills/sk-design/design-foundations/SKILL.md:100`
- `.opencode/skills/sk-design/design-foundations/SKILL.md:103`
- `.opencode/skills/sk-design/design-foundations/SKILL.md:257`
- `.opencode/skills/sk-design/design-foundations/SKILL.md:274`
- `.opencode/skills/sk-design/design-foundations/SKILL.md:350`
- `.opencode/skills/sk-design/design-foundations/SKILL.md:384`
- `.opencode/skills/sk-design/design-foundations/README.md:94`
- `.opencode/skills/sk-design/design-foundations/README.md:128`
- `.opencode/skills/sk-design/design-foundations/changelog/v1.0.0.0.md:1`
- `.opencode/skills/sk-design/design-foundations/procedures/tweakable_design_controls.md:1`
- `.opencode/skills/sk-design/design-foundations/procedures/component_system_inventory.md:1`
- `.opencode/skills/sk-design/design-foundations/procedures/hierarchy_rhythm_review.md:1`
- `.opencode/skills/sk-design/design-foundations/feature_catalog/feature_catalog.md:93`
- `.opencode/skills/sk-design/design-foundations/manual_testing_playbook/manual_testing_playbook.md:13`
- `.opencode/skills/sk-design/design-foundations/scripts/baseline_rhythm_check.py:1`
- `.opencode/skills/sk-design/design-foundations/scripts/naming_doc_check.py:1`
- `.opencode/skills/sk-design/design-foundations/scripts/contrast_check.py:1`
- `.opencode/skills/sk-design/mode-registry.json:33`
- `.opencode/skills/sk-design/mode-registry.json:61`
- `.opencode/skills/sk-design/command-metadata.json:168`
- `.opencode/skills/sk-design/command-metadata.json:213`
- `.opencode/skills/sk-design/command-metadata.json:245`
- `.opencode/skills/sk-code/code-review/references/review_core.md:28`

Command evidence: `python3 .opencode/skills/sk-doc/scripts/package_skill.py .opencode/skills/sk-design/design-foundations --check` returned `Result: PASS` and warning `SKILL.md has 3163 words (recommended max: 3000)`.

## Findings by Severity

### P0

None.

### P1

#### P1-009-001 [P1] `/design:foundations` metadata omits the packet's required procedure-card surface

- Claim: The `/design:foundations` command metadata does not correctly reflect the packet's own `procedures/` contract.
- Evidence: `command-metadata.json` only tells the command choreography to load `.opencode/skills/sk-design/design-foundations/references/` and assets as needed, with no `procedures/` resource or action at `.opencode/skills/sk-design/command-metadata.json:213` through `.opencode/skills/sk-design/command-metadata.json:217`.
- Evidence: The packet makes procedure-card support part of the routing contract: `SKILL.md:100` lists the three mode-local procedure cards, `SKILL.md:103` says procedure-card selection is part of the routing contract, and `SKILL.md:257` through `SKILL.md:268` requires choosing and citing one procedure card or the no-procedure fallback.
- Evidence: The packet catalog documents procedure cards as live current-state functionality at `.opencode/skills/sk-design/design-foundations/feature_catalog/feature_catalog.md:93` through `.opencode/skills/sk-design/design-foundations/feature_catalog/feature_catalog.md:107`.
- Counterevidence sought: Checked whether `command-metadata.json` task projections, proof fields, output contract, or choreography mention `design-foundations/procedures/`; the foundations entry references `references/`, `assets`, task projection sources, and proof fields, but not the procedure directory.
- Alternative explanation: The parent hub may still load `SKILL.md` and the runtime may manually follow Section 3, so this is a metadata traceability gap rather than proof that runtime behavior always fails.
- Final severity: P1, because command metadata is an explicit command contract and the omission hides a required mode subsystem from `/design:foundations` routing/proof choreography.
- Confidence: 0.84.
- Downgrade trigger: Downgrade to P2 if the command dispatcher is confirmed never to consume `command-metadata.json` choreography for resource loading, and the file is only a non-operative catalog.

### P2

#### P2-009-001 [P2] `package_skill.py --check` warns that `SKILL.md` exceeds the recommended size budget

- Evidence: The required checker returned `Skill is valid` plus warning `SKILL.md has 3163 words (recommended max: 3000)` for `.opencode/skills/sk-design/design-foundations`.
- Evidence: The warning applies to the runtime entrypoint `.opencode/skills/sk-design/design-foundations/SKILL.md:1`.
- Impact: Non-blocking maintainability drift. The packet still passes structural validation, but the entrypoint exceeds the sk-doc recommended word budget and is harder to scan.
- Recommendation: Move non-critical detail into references or procedure cards while keeping routing-critical rules in `SKILL.md`.

#### P2-009-002 [P2] Two script-backed validators are not discoverable from `SKILL.md` or the packet procedures

- Evidence: The packet contains `scripts/baseline_rhythm_check.py` and `scripts/naming_doc_check.py`, each with runnable usage text at `.opencode/skills/sk-design/design-foundations/scripts/baseline_rhythm_check.py:13` through `.opencode/skills/sk-design/design-foundations/scripts/baseline_rhythm_check.py:15` and `.opencode/skills/sk-design/design-foundations/scripts/naming_doc_check.py:11` through `.opencode/skills/sk-design/design-foundations/scripts/naming_doc_check.py:13`.
- Evidence: The `SKILL.md` loading table exposes `scripts/contrast_check.py` at `.opencode/skills/sk-design/design-foundations/SKILL.md:93` and the procedure cards at `.opencode/skills/sk-design/design-foundations/SKILL.md:100`, but it does not expose the baseline-rhythm or naming/doc validators.
- Evidence: The three procedure cards were checked at `.opencode/skills/sk-design/design-foundations/procedures/tweakable_design_controls.md:1`, `.opencode/skills/sk-design/design-foundations/procedures/component_system_inventory.md:1`, and `.opencode/skills/sk-design/design-foundations/procedures/hierarchy_rhythm_review.md:1`; none surfaced these validators in their required fields or procedures.
- Impact: The scripts may be valid utilities, but from the packet's entrypoint/procedure surface they are orphaned and easy to miss during foundations work.
- Recommendation: Either reference these validators from the relevant `SKILL.md` resource/proof rows or move/remove them if they are no longer part of the packet contract.

## Traceability Checks

- sk-doc structural conformance: PASS with warning. `package_skill.py --check` returned `Result: PASS`; warning recorded as P2-009-001.
- `packetSkillName`: PASS. `mode-registry.json:72` says `design-foundations`; `SKILL.md:2` says `name: design-foundations`.
- `proceduresPath`: PASS. `mode-registry.json:71` says `design-foundations/procedures`; the three procedure cards exist and are referenced from `SKILL.md:263` through `SKILL.md:266`.
- `toolSurface`: PASS at coarse metadata level. `mode-registry.json:64` through `mode-registry.json:69` allows Read/Glob/Grep and forbids Write/Edit/Bash; `SKILL.md:4` allows Read/Grep/Glob. Existing tool-surface parity concern around script-backed contrast proof was already active from prior registry context and was not re-counted here.
- `excludedAliases`: PASS. `mode-registry.json:33` through `mode-registry.json:35` excludes `typeset` and `colorize` from free-text foundations transform aliasing, while `mode-registry.json:27` explains explicit command task projections are a separate layer; `command-metadata.json:245` through `command-metadata.json:268` owns `typeset` and `colorize` only under explicit `/design:foundations` task projections.
- `/design:foundations` command metadata: FAIL. It omits the packet's own `procedures/` surface from choreography, recorded as P1-009-001.
- Changelog frontmatter: PASS. `changelog/v1.0.0.0.md:1` through `changelog/v1.0.0.0.md:4` includes `version: 1.0.0.0`.
- Packet structure: PARTIAL. `feature_catalog/` and `manual_testing_playbook/` are indexed and frontmatter-versioned, but two validator scripts are not discoverable from `SKILL.md` or mode procedures, recorded as P2-009-002.

## Verdict

CONDITIONAL. One P1 traceability issue was found in the `/design:foundations` command metadata, plus two P2 maintainability/sk-doc advisories. No P0 findings.

## Next Dimension

Continue Wave 2 with sibling iteration results merged after iterations 6 through 9 complete. Do not update the shared registry or strategy until the wave-level reducer/merge step.

Review verdict: CONDITIONAL
