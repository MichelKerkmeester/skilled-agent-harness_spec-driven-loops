# Iteration 005 - Cross-Hub Routing Consistency

## Dimension

- Security
- Traceability
- Focus: cross-hub routing consistency across `sk-design` registry files and the six mode packet entrypoints.

## Files Reviewed

- `.opencode/skills/sk-code/code-review/references/review_core.md:28`
- `.opencode/specs/sk-design/009-sk-design-claude-parity/027-comprehensive-deep-review/review/deep-review-strategy.md:40`
- `.opencode/specs/sk-design/009-sk-design-claude-parity/027-comprehensive-deep-review/review/deep-review-findings-registry.json:9`
- `.opencode/skills/sk-design/mode-registry.json:38`
- `.opencode/skills/sk-design/mode-registry.json:43`
- `.opencode/skills/sk-design/mode-registry.json:64`
- `.opencode/skills/sk-design/mode-registry.json:85`
- `.opencode/skills/sk-design/mode-registry.json:106`
- `.opencode/skills/sk-design/mode-registry.json:127`
- `.opencode/skills/sk-design/mode-registry.json:145`
- `.opencode/skills/sk-design/hub-router.json:27`
- `.opencode/skills/sk-design/command-metadata.json:1`
- `.opencode/skills/sk-design/design-interface/SKILL.md:1`
- `.opencode/skills/sk-design/design-foundations/SKILL.md:1`
- `.opencode/skills/sk-design/design-foundations/SKILL.md:93`
- `.opencode/skills/sk-design/design-foundations/SKILL.md:274`
- `.opencode/skills/sk-design/design-foundations/assets/contrast_pair_inventory.md:15`
- `.opencode/skills/sk-design/design-motion/SKILL.md:1`
- `.opencode/skills/sk-design/design-audit/SKILL.md:1`
- `.opencode/skills/sk-design/design-audit/assets/audit_report_template.md:144`
- `.opencode/skills/sk-design/design-audit/references/critique_hardening.md:133`
- `.opencode/skills/sk-design/design-md-generator/SKILL.md:1`
- `.opencode/skills/sk-design/design-mcp-open-design/SKILL.md:1`
- `.opencode/skills/sk-design/design-mcp-open-design/SKILL.md:224`
- `.opencode/skills/sk-design/design-mcp-open-design/SKILL.md:260`
- `.opencode/skills/sk-design/design-mcp-open-design/SKILL.md:270`
- `.opencode/skills/sk-design/design-mcp-open-design/scripts/_common.sh:1`
- `.opencode/skills/sk-design/design-mcp-open-design/scripts/doctor.sh:1`
- `.opencode/skills/sk-design/design-mcp-open-design/scripts/install.sh:1`
- `.opencode/skills/sk-design/design-mcp-open-design/references/tool_surface.md:38`
- `.opencode/skills/sk-design/design-mcp-open-design/references/mcp_wiring.md:17`

## Findings by Severity

### P0

- None.

### P1

#### P1-002 [P1] Foundations contrast proof requires a script that the registry forbids

- Claim: The `foundations` mode is declared as a read-only `reference-base` workflow, but its mandatory contrast-proof path requires executing `scripts/contrast_check.py`, which needs a forbidden execution tool under the current registry/frontmatter surface.
- Evidence: `mode-registry.json` declares `foundations` allowed tools as only `Read`, `Glob`, and `Grep`, with `Write`, `Edit`, and `Bash` forbidden and `mutatesWorkspace:false` at `.opencode/skills/sk-design/mode-registry.json:64`.
- Evidence: the `design-foundations` frontmatter repeats `allowed-tools: [Read, Grep, Glob]` at `.opencode/skills/sk-design/design-foundations/SKILL.md:4`.
- Evidence: the same packet says any UI build with changed foreground/background pairs must use the mandatory contrast-pair inventory with every ratio computed by `scripts/contrast_check.py` at `.opencode/skills/sk-design/design-foundations/SKILL.md:93`.
- Evidence: the worksheet gives the executable command `python3 ../scripts/contrast_check.py "#787878" "#ffffff"` and states it exits non-zero on failing pairs at `.opencode/skills/sk-design/design-foundations/assets/contrast_pair_inventory.md:15`.
- Evidence: the packet also says direct fallback must run with `Read`, `Glob`, and `Grep` only and cannot rely on `Write`, `Edit`, `Bash`, or `Task` at `.opencode/skills/sk-design/design-foundations/SKILL.md:274`.
- Counterevidence sought: I checked the declared `design-foundations/procedures` directory exists and searched the mode for an alternate no-execution contrast path. The only mandatory contrast-ratio path found names `contrast_check.py`; the asset permits `not assessed` as a row value, but a not-assessed pair cannot satisfy the mandatory "computed every ratio" proof when changed color pairs are in scope.
- Alternative explanation: The registry may intend to describe repository mutation only, not calculator execution. That does not explain why `Bash` is explicitly forbidden while the packet's own required proof path tells the operator to run `python3`.
- Final severity: P1.
- Confidence: High.
- Downgrade trigger: Downgrade to P2 if the packet is changed to make script execution optional and documents an allowed Read/Grep-only or user-supplied evidence path that can still satisfy the contrast proof without running code.

### P2

- None.

## Traceability Checks

- `packetSkillName` parity: PASS. All six registry `packetSkillName` values match the packet folder and frontmatter `name` values: `design-interface`, `design-foundations`, `design-motion`, `design-audit`, `design-md-generator`, and `design-mcp-open-design`.
- `proceduresPath` existence: PASS. The five workflow modes with `proceduresPath` entries each have the declared directory. The transport packet has no `proceduresPath` claim in `mode-registry.json`, so no missing path was counted.
- tool-surface parity: PARTIAL. Entry-point frontmatter matches the registry at the coarse allowed-tool level, but `design-foundations` has a mandatory script-backed proof path despite read-only/no-Bash declarations.
- transport-axis boundary: PASS. `design-mcp-open-design` is marked `packetKind:"transport"`, `backendKind:"od-cli-transport"`, `allowed:[Read,Bash]`, `forbidden:[Write,Edit,Task]`, and `mutatesWorkspace:false` in `mode-registry.json:145-152`. Its scripts are install/verify/report-only helpers, and its docs route mutating Open Design operations to the external Open Design project/global agent config surface with explicit gates. No path reviewed showed writes inside this repo by the transport packet.
- prior findings registry: ACKNOWLEDGED. Existing P1-001 is in `design-md-generator` standalone artifact writers and was not recounted.

## Verdict

CONDITIONAL. One new P1 traceability/tool-surface mismatch was found. No P0 findings were found in this iteration.

## Next Dimension

Continue the planned wave without re-reviewing this iteration's cross-hub linkage scope. Later synthesis should reconcile this finding with sibling wave results and decide whether `foundations` should either allow a narrowly scoped calculator execution path or rewrite the contrast proof to be genuinely read-only.

Review verdict: CONDITIONAL
