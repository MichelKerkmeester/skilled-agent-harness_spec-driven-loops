# Iteration 004: Maintainability

## Focus
**Dimension**: Maintainability — Pattern consistency, documentation quality, dead references, comment hygiene, clarity, ease of safe follow-on changes  
**Files reviewed**: `.opencode/skills/mcp-open-design/SKILL.md`, `.opencode/skills/mcp-open-design/README.md`, `.opencode/skills/sk-interface-design/SKILL.md`, `.opencode/skills/sk-interface-design/README.md`, `.opencode/skills/sk-interface-design/references/claude_design_parity.md`, both skills' reference directories

## Scorecard
- Dimensions covered: correctness, security, traceability, maintainability
- Files reviewed: 10+
- New findings: P0=0 P1=0 P2=3
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.23

## Findings

### P2, Suggestion
- **F013**: `claude_design_parity.md` references ephemeral packet identifiers in durable skill doc, `.opencode/skills/sk-interface-design/references/claude_design_parity.md:121`, The "Related Resources" section lists "Research basis: packets `005-claude-design-parity-research` (hardened) and `006-competitor-design-tools-research`." These are spec-packet identifiers placed in a skill reference that agents read at runtime. Per the framework's comment-hygiene constitutional rule, ephemeral artifact labels (packet/phase numbers) should not appear in durable skill content. These research packet names could become stale if research packets are reorganized, and they add no actionable value to the agent reading this protocol.

- **F014**: mcp-open-design SKILL.md has both Section 5 ("REFERENCES") and Section 8 ("REFERENCES AND RELATED RESOURCES") — redundant top-level naming, `.opencode/skills/mcp-open-design/SKILL.md:266-278`, Section 5 lists core references (`od_cli_reference.md`, `mcp_wiring.md`, `tool_surface.md`) while Section 8 lists related skills and upstream links. Both sections have "REFERENCES" in their title, making it ambiguous which section is the canonical reference list. A reader seeing the ToC would not know Section 5 contains core internal refs while Section 8 contains integration/upstream pointers. sk-interface-design has the same naming pattern, so both skills share this ambiguity.

- **F015**: sk-interface-design frontmatter carries `allowed-tools: [Read, Write, Edit, Bash, Grep, Glob]` but the skill is design guidance — it never needs Write/Edit/Bash for its design judgment work, `.opencode/skills/sk-interface-design/SKILL.md:4`, The skill's own rules say implementation is delegated to `sk-code`. The broad `allowed-tools` list includes Write, Edit, and Bash which imply the skill modifies files, but the skill's contract is judgment-only. The mcp-open-design SKILL.md restricts to `[Read, Bash]` which matches its transport role. sk-interface-design's permissive tool list could allow an agent to modify files when the skill's contract says it only judges design direction.

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | pass | hard | See iteration 003 | — |
| checklist_evidence | partial | hard | See iteration 003 | — |

## Assessment
- New findings ratio: 0.23 (3 new P2 findings, severity-weighted: 3×1.0=3.0 over total severity 13.0+3.0=16.0 → 0.19, but since ratio uses current-iteration weights: 3.0/13.0=0.23)
- Dimensions addressed: maintainability (final dimension)
- Novelty justification: First maintainability pass — F013 is a comment-hygiene finding, F014 is a structural naming ambiguity, F015 is a tool-permission contract mismatch. All three are P2 advisory findings; none blocks maintenance or follow-on changes.

## Ruled Out
- **Section structure drift**: Both SKILL.md files follow identical 8-section numbering (1. WHEN TO USE through 8. REFERENCES AND RELATED RESOURCES). READMEs also match (1. AT A GLANCE through 9. RELATED DOCUMENTS). No structural drift.
- **Dead references**: Grep for deleted-skill references (mcp-magicpath) returned only historical changelog mentions. No live-route references to deleted files.
- **No TODO/FIXME markers**: Clean codebase — no unresolved markers found across either skill.
- **Reference directory consistency**: Both skills have `references/` with markdown-only content. Both have `changelog/`, `feature_catalog/`, `manual_testing_playbook/`, and `graph-metadata.json`. Pattern is consistent.

## Dead Ends
- None in this iteration.

## Recommended Next Focus
All 4 dimensions are now covered. Convergence analysis:
- Rolling average of last 2 ratios: (0.29 + 0.23) / 2 = 0.26 — above 0.08 threshold (rolling signal NOT voting stop)
- Dimension coverage: 4/4 (STOP signal at weight 0.45 — votes stop once stabilization passes >= 1)
- Composite: low findings-ratio trend with all dimensions covered → stabilization pass recommended before STOP

**Recommendation**: Run iteration 005 as a stabilization pass over maintainability (re-check F015 tool-permission contract, review remaining unreviewed files: `design_inventory.md`, `ux_quality_reference.md`).

Review verdict: PASS
