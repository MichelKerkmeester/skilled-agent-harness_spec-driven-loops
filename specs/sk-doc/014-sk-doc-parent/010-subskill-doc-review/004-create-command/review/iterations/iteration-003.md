# Deep Review Iteration 003

## Dispatcher

- target_agent: deep-review
- resolved_route: /deep:review:auto -> .opencode/agents/deep-review.md
- agent_definition_loaded: true
- mode: review
- run: 001
- status: complete
- budgetProfile: verify
- focus: correctness of tool names, flags, scripts, and section claims
- dimension: correctness

## Files Reviewed

- `.opencode/skills/sk-doc/create-command/SKILL.md`
- `.opencode/skills/sk-doc/create-command/README.md`
- `.opencode/skills/sk-doc/create-command/references/README.md`
- `.opencode/skills/sk-doc/create-command/references/argument_hints_and_modes.md`
- `.opencode/skills/sk-doc/create-command/references/common_pitfalls.md`
- `.opencode/skills/sk-doc/create-command/references/router_presentation_split.md`
- `.opencode/skills/sk-doc/create-command/references/worked_example.md`
- `.opencode/skills/sk-doc/create-command/assets/command/command_template.md`
- `.opencode/skills/sk-doc/create-command/assets/command/command_presentation_template.md`
- `.opencode/skills/sk-doc/shared/scripts/validate_document.py`
- `.opencode/skills/sk-doc/shared/scripts/extract_structure.py`
- `.opencode/skills/sk-doc/shared/scripts/quick_validate.py`
- `.opencode/skills/sk-code/code-review/references/review_core.md`

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

None.

## Traceability Checks

- Verified `SKILL.md` points to existing overflow docs/assets/shared scripts, and its intentional no-`graph-metadata.json` claim is supported by the absent packet-local file. [SOURCE: .opencode/skills/sk-doc/create-command/SKILL.md:14] [SOURCE: .opencode/skills/sk-doc/create-command/SKILL.md:16]
- Verified split workflow package names and `_auto.yaml` / `_confirm.yaml` guidance are generic output-shape claims, not claims that packet-local YAML assets already exist. [SOURCE: .opencode/skills/sk-doc/create-command/SKILL.md:117] [SOURCE: .opencode/skills/sk-doc/create-command/SKILL.md:126]
- Verified validator command claims use real shared scripts and accepted flags: `validate_document.py` supports `--type command`, and all target docs validated clean under their own document types. [SOURCE: .opencode/skills/sk-doc/create-command/SKILL.md:317] [SOURCE: .opencode/skills/sk-doc/create-command/README.md:49]
- Verified README resource paths resolve to the packet assets or shared scripts they name. [SOURCE: .opencode/skills/sk-doc/create-command/README.md:22] [SOURCE: .opencode/skills/sk-doc/create-command/README.md:31]
- Verified reference-map markdown links resolve for `worked_example.md`, `router_presentation_split.md`, `argument_hints_and_modes.md`, `common_pitfalls.md`, command templates, shared references, and shared scripts. [SOURCE: .opencode/skills/sk-doc/create-command/references/README.md:35] [SOURCE: .opencode/skills/sk-doc/create-command/references/README.md:51]
- Verified command example paths in `worked_example.md` are explicitly illustrative output shapes and do not claim existing repository commands. [SOURCE: .opencode/skills/sk-doc/create-command/references/worked_example.md:36] [SOURCE: .opencode/skills/sk-doc/create-command/references/worked_example.md:56]

## Integration Evidence

- `python3 .opencode/skills/sk-doc/shared/scripts/validate_document.py .opencode/skills/sk-doc/create-command/SKILL.md --type skill` exited 0 with no warnings.
- `python3 .opencode/skills/sk-doc/shared/scripts/validate_document.py .opencode/skills/sk-doc/create-command/README.md --type readme` exited 0 with no warnings.
- `python3 .opencode/skills/sk-doc/shared/scripts/validate_document.py .opencode/skills/sk-doc/create-command/references/*.md --type reference` was run per file; each exited 0 with no warnings.
- `python3 .opencode/skills/sk-doc/shared/scripts/validate_document.py --help` lists `command` among accepted `--type` choices.
- Asset inventory confirmed only `assets/command/command_template.md` and `assets/command/command_presentation_template.md` are packet-local assets; no packet-local `scripts/` directory is present.

## Edge Cases

- A token-based path sweep flags placeholders such as `<command-file.md>`, generic suffixes such as `_auto.yaml`, and illustrative `.opencode/commands/...` output paths as missing. Direct line review adjudicated these as placeholders/output-shape examples, not broken backlinks or false existence claims.
- The prompt required checking relevant asset backlinks; no backlinks in asset templates were implicated by the docs beyond the named asset files and shared scripts already verified.
- Code graph was not used because this was an exact-file documentation correctness review with bound target paths and no unknown symbol discovery need.

## Confirmed-Clean Surfaces

- Tool names in command examples and guidance are internally consistent: `Read`, `Write`, `Edit`, `Bash`, `Grep`, `Glob`, `Task`, and fully qualified MCP ID guidance are presented as frontmatter permissions, not executable local script names. [SOURCE: .opencode/skills/sk-doc/create-command/SKILL.md:142] [SOURCE: .opencode/skills/sk-doc/create-command/references/argument_hints_and_modes.md:91]
- Frontmatter and section claims match the command template vocabulary and validation checklist. [SOURCE: .opencode/skills/sk-doc/create-command/SKILL.md:301] [SOURCE: .opencode/skills/sk-doc/create-command/assets/command/command_template.md:301]
- Router/presentation split claims match the presentation template's `Startup Presentation`, dashboard/checkpoint, results, and next-step sections. [SOURCE: .opencode/skills/sk-doc/create-command/SKILL.md:272] [SOURCE: .opencode/skills/sk-doc/create-command/assets/command/command_presentation_template.md:31]

## Ruled Out

- Broken relative links in README/reference markdown links: ruled out by link/path resolution and direct reads.
- Fabricated validator flag `--type command`: ruled out by validator help output.
- Missing packet-local `graph-metadata.json` as a defect: ruled out because the packet explicitly says not to add one.
- Missing `.opencode/commands/review/...` example files as a defect: ruled out because `worked_example.md` says the example is illustrative and does not claim `/review:packet` exists.

## Next Focus

- dimension: security
- focus area: least-privilege command guidance and destructive/privileged confirmation gates
- reason: iteration 3 found no correctness drift in tool names, flags, script paths, asset names, validator behavior, or section claims; remaining unchecked dimension is security.
- rotation status: iteration 4 of 4 under stop_policy=max-iterations
- blocked/productive carry-forward: productive carry-forward from traceability, maintainability, and correctness reviews; no blocked approaches.
- required evidence: allowed-tools minimization guidance, destructive command confirmation and rollback/recovery language, privileged-action escalation rules, and examples that could teach unsafe permissions.
