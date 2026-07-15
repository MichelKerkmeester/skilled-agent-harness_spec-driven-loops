# Deep Review Iteration 001

## Dimension

`sk-doc-conformance`, with reality-alignment checked for all 30 assigned documents.

## Files Reviewed

All 30 files in the rendered slice were read. The real shared validators were run with the correct explicit type, `extract_structure.py` was run for every file, and every Markdown relative link was resolved against disk.

- 27/30 documents passed `validate_document.py`.
- All 30 relative-link sets resolved; no dead Markdown links were found.
- DQI ranged from 40 to 100. Four compact embedded-server READMEs scored below the required 75.
- Established corpus-wide gaps were not findings: TOC-policy detector behavior, compact pointer-card shape, kebab-case legacy references, and cli-family `hard_rules` frontmatter.

## Findings by Severity

### P0

#### R1-P0-001: Embedded clickup-cli README fails the required README schema

- File: `.opencode/skills/mcp-tooling/mcp-click-up/mcp-servers/clickup-cli/README.md:1`
- Issue: The real validator exits non-zero with `missing_required_section: overview`; DQI is 42. This is a hard validation failure under the iteration severity contract.
- Exact fix: Rebuild from the skill README template with frontmatter, a pitch, numbered `## 1. AT A GLANCE`, `## 2. OVERVIEW`, install/verification content, and renumbered related-document sections.
- Claim: The document cannot pass the required sk-doc README gate.
- Evidence refs: validator output for this path and source lines 1-49.
- Counterevidence sought: Checked whether this was an established compact pointer-card exception; the prompt explicitly makes validator exit 0 mandatory for every document and classifies validate failure as P0.
- Alternative explanation: It may have been intentionally authored as a small embedded-server pointer.
- Final severity: P0.
- Confidence: 1.0.
- Downgrade trigger: An explicit checked-in exception that exempts `mcp-servers/**/README.md` from the validator gate.

#### R1-P0-002: Embedded clickup-mcp README fails the required README schema

- File: `.opencode/skills/mcp-tooling/mcp-click-up/mcp-servers/clickup-mcp/README.md:1`
- Issue: The real validator exits non-zero with `missing_required_section: overview`; DQI is 40.
- Exact fix: Add template frontmatter and numbered README sections, including `AT A GLANCE`, `OVERVIEW`, connection, verification, and related documents, while preserving the remote-server/no-vendoring truth.
- Claim: The document cannot pass the required sk-doc README gate.
- Evidence refs: validator output for this path and source lines 1-41.
- Counterevidence sought: Checked compact-pointer precedent; no explicit validator exemption was present.
- Alternative explanation: The file is intentionally terse because nothing is vendored locally.
- Final severity: P0.
- Confidence: 1.0.
- Downgrade trigger: A documented validator exemption for embedded remote-server pointer READMEs.

#### R1-P0-003: Embedded figma-cli README fails the required README schema

- File: `.opencode/skills/mcp-tooling/mcp-figma/mcp-servers/figma-cli/README.md:1`
- Issue: The real validator exits non-zero with `missing_required_section: overview`; DQI is 42.
- Exact fix: Rebuild as a template-conformant README with frontmatter, numbered `AT A GLANCE` and `OVERVIEW`, then retain naming-trap, install, verification, requirements, and related-document content under sequential headings.
- Claim: The document cannot pass the required sk-doc README gate.
- Evidence refs: validator output for this path and source lines 1-36.
- Counterevidence sought: Checked whether the short embedded-server shape was exempt; the review contract supplies no exemption.
- Alternative explanation: It is a compact installer pointer rather than a package front door.
- Final severity: P0.
- Confidence: 1.0.
- Downgrade trigger: A checked-in exception for this embedded-server README class.

#### R1-P0-004: cli-opencode agent reference teaches direct routes its own live contract forbids

- File: `.opencode/skills/cli-external/cli-opencode/references/agent_delegation.md:17`
- Issue: The reference says dispatches route through `--agent <slug>`, then gives direct `--agent context`, `review`, `debug`, `general`, and command-owned loop examples at lines 80-92, 222-231, and 309-360. The current packet contract says top-level `general` is rejected, generic subagents route through `orchestrate`, and loop executors are command-owned (`SKILL.md:277`, `SKILL.md:301-311`). `opencode_tools.md:93-154` and `integration_patterns.md:79-143` repeat forbidden direct routes.
- Exact fix: Make the current `SKILL.md` contract canonical: omit `--agent` for default dispatch, use help-verified `--agent orchestrate` for generic subagents, and use `/deep:*` command-owned routes for deep agents. Remove the invented `As @<agent>:` auto-loader claim unless an implementation is cited.
- Claim: Copying the documented commands can fail or bypass command-owned state machines.
- Evidence refs: `.opencode/skills/cli-external/cli-opencode/SKILL.md:277`, `:301-311`; reference locations above.
- Counterevidence sought: Searched for carve-outs and found only conditional help-verified primary-agent use, not the broad direct routing claimed by the references.
- Alternative explanation: The references reflect an older OpenCode agent model.
- Final severity: P0.
- Confidence: 0.99.
- Downgrade trigger: Live `opencode run --help` plus agent metadata proving each listed slug is a valid primary route and command-owned agents can safely bypass their commands.

#### R1-P0-005: cli-claude-code documents the wrong runtime agent directory and a stale roster

- File: `.opencode/skills/cli-external/cli-claude-code/README.md:109`
- Issue: The README and references claim Claude Code resolves agents from `.opencode/agents/`, while runtime directory policy resolves Claude agents from `.claude/agents/`. The claimed roster also includes stale/non-current names such as `handover`, `research`, `speckit`, and `write` (`SKILL.md:277-285`; `references/agent_delegation.md:94-121`) and says 10 agents while its catalog lists seven.
- Exact fix: Resolve the active Claude runtime directory (`.claude/agents/`), regenerate the roster from files on disk, remove nonexistent slugs, and align every `--agent` example with the current Claude Code definitions.
- Claim: Delegations can target nonexistent or wrong-runtime agent definitions.
- Evidence refs: README line 109; SKILL lines 273-287; agent reference lines 94-121.
- Counterevidence sought: Compared the documented roster against the runtime directory rule and the current available-agent surface.
- Alternative explanation: The docs predate runtime-specific directory separation.
- Final severity: P0.
- Confidence: 0.98.
- Downgrade trigger: Verified Claude Code behavior showing this workspace intentionally aliases `.opencode/agents/` and all named slugs resolve.

#### R1-P0-006: Claude/OpenCode capability comparison is stale and factually unsafe

- File: `.opencode/skills/cli-external/cli-claude-code/references/claude_tools.md:45`
- Issue: The document promises visible chain-of-thought, describes obsolete OpenCode flags and invocation (`--sandbox read-only`, `exec`, `gpt-5.3-opencode`), claims OpenCode has no memory or hooks, and gives a stale one-model comparison at lines 72, 182, 234-257, and 263-272. These statements contradict the current cli-opencode packet and this repository's active memory/hook runtime.
- Exact fix: Remove claims of visible private reasoning, replace the comparison with current `opencode run` flags/model discovery, and derive memory/hooks/MCP claims from current runtime docs rather than an old static matrix.
- Claim: The routing comparison directs users with obsolete commands and false capability differences.
- Evidence refs: reference lines 45-72, 182, 234-272; current cli-opencode SKILL and CLI reference.
- Counterevidence sought: Checked whether the text was labeled historical or unverified; it is presented as current capability guidance.
- Alternative explanation: The table was accurate for an older CLI generation.
- Final severity: P0.
- Confidence: 0.99.
- Downgrade trigger: Version-scoping the entire comparison to a historical binary and removing it from current routing guidance.

#### R1-P0-007: ClickUp SKILL shows a non-current Code Mode invocation shape

- File: `.opencode/skills/mcp-tooling/mcp-click-up/SKILL.md:279`
- Issue: The SKILL invokes `call_tool_chain([...])` with `{tool,input}` records, while the current Code Mode contract and the same packet README use `call_tool_chain({ code: ... })` with namespaced functions. The two operator-facing docs disagree about the executable call surface.
- Exact fix: Replace the array invocation with the current `{ code: "..." }` form and a discovered `clickup.clickup_clickup_*` callable, matching README lines 79-95 and current Code Mode tooling.
- Claim: The SKILL's copy-paste MCP example does not match the current tool API.
- Evidence refs: SKILL lines 279-292; README lines 79-95 and 118-122.
- Counterevidence sought: Compared both packet docs and the live registered tool contract.
- Alternative explanation: The array form belongs to an older Code Mode transport.
- Final severity: P0.
- Confidence: 0.99.
- Downgrade trigger: A live compatibility adapter that accepts the array form and is documented as supported.

### P1

#### R1-P1-001: Four embedded-server READMEs miss the DQI 75 floor

- Files: `.opencode/skills/mcp-tooling/mcp-click-up/mcp-servers/clickup-cli/README.md:1` (42), `clickup-mcp/README.md:1` (40), `.opencode/skills/mcp-tooling/mcp-figma/mcp-servers/figma-cli/README.md:1` (42), and `figma-mcp/README.md:1` (42).
- Issue: All four are below the required DQI 75 threshold; even the validator-passing `figma-mcp` pointer is structurally too thin for the requested quality gate.
- Exact fix: Apply the README template's frontmatter, pitch, at-a-glance, overview, verification, and related-document shape while retaining concise embedded-server scope.

### P2

#### R1-P2-001: Figma README labels an existing install guide as planned

- File: `.opencode/skills/mcp-tooling/mcp-figma/README.md:189`
- Issue: The related-documents row says `INSTALL_GUIDE.md` is planned even though the link resolves and the file exists.
- Exact fix: Remove `(planned)` and describe the guide as current.

## Traceability Checks

- `spec_code`: Not applicable to this doc-only slice; template and live packet contracts were used instead.
- `checklist_evidence`: Validator exit status and DQI were captured for every assigned document.
- `skill_agent`: Failed for cli-opencode and cli-claude-code agent-routing references (R1-P0-004, R1-P0-005).
- `agent_cross_runtime`: Failed because Claude docs point at the OpenCode runtime directory (R1-P0-005).
- `feature_catalog_code`: Not present in this 30-document slice.
- `playbook_capability`: Example READMEs were checked; no additional independently confirmed defect beyond current command-contract findings.
- Relative-link integrity: PASS, all relative Markdown links resolve.
- Scope violations: None. Reviewed files were not modified.

## Verdict

FAIL. Seven P0 findings are active, including three hard validator failures and four wrong-reality command/routing defects.

## Next Dimension

`reality-alignment`, prioritizing current CLI help, runtime agent directories, and Code Mode tool signatures across the remaining corpus.

Review verdict: FAIL
