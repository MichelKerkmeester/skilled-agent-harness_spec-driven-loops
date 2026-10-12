# Review Iteration 001 — Correctness: root README freshness fixes (F1–F11)

**Dispatcher:** `/deep:review` loop (auto mode), single review iteration; route `Resolved route: mode=review target_agent=deep-review`; session `2026-10-12T16:20:15.273Z`, generation 1, lineageMode `new`, run `2026-10-12T16:20:15.273Z-i1`.

## Dimension
Correctness — do the changed numbers and claims in the root README match the repository today, and is any count still stale elsewhere in the file?

## Files Reviewed
The 14 changed README.md lines, each confirmed present at the recorded line number:

- README.md:24, :66, :98, :933 — agent-count claims
- README.md:80, :1074 — command entry-point counts
- README.md:125, :147 — ASCII boxes
- README.md:421, :426, :785 — validation-rule counts
- README.md:881, :1435 — ClickUp wording and counts
- README.md:1278 — doctor YAML workflow count

Sources read for verification: `.skilled/agents/*.md` (11 files), `.skilled/commands/**/*.md` (entry-point tree), `.skilled/skills/system-spec-kit/runtime/cli/lib/validator-registry.json`, `.claude/agents/`, `.pi/agents/`, `.skilled/skills/mcp-tooling/mcp-click-up/**/*.md`, and the phase diff `scratch/review-diff.patch` (base 0725425d46).

## Findings - New

### P0 Findings
None.

### P1 Findings
None.

### P2 Findings
None. This iteration is clean; no findings were fabricated to fill the section.

## Confirmed-Clean Surfaces
- **11 agents** (README.md:24, :66, :98, :933): `.skilled/agents/` holds exactly 11 agent files (ai-council, code, context, debug, deep-research, deep-review, design, markdown, orchestrate, prompt-improver, review) [SOURCE: .skilled/agents/review.md].
- **37 command entry points: 34 across 6 groups plus 3 root** (README.md:80, :1074): recount gives create 13, deep 3, design 3, doctor 8, prompt 1, speckit 6 (=34) plus root agent-router.md, goal-opencode.md, vision.md (=3) [SOURCE: .skilled/commands/speckit/plan.md]; assets, legacy, compiled and scripts READMEs are excluded by the count's convention, matching the find results.
- **41 rules, seven warn** (README.md:421, :426, :785): the registry holds 41 rule entries; exactly 7 carry `"severity": "warn"` — FRONTMATTER_VALUES, SOURCE_TAGS, GRAPH_METADATA_PRESENT, GRAPH_METADATA_CHILD_DRIFT, GRAPH_METADATA_SHAPE, DESCRIPTION_SHAPE, LINKS_VALID — and the two rules the README names are among them [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/lib/validator-registry.json:220] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/lib/validator-registry.json:433].
- **ASCII boxes** (README.md:125, :147): both boxes keep column-consistent right edges — the agent/skills box lines are 17 and 20 columns wide respectively, and the SPEC KIT box is 44 columns on all six lines [SOURCE: README.md:123] [SOURCE: README.md:144].
- **ClickUp auth wording** (README.md:1435): "cupt signs in with `cupt auth` or a `pk_` token" matches the skill's own references (cupt-commands.md:61; clickup-cli/README.md:77), "the MCP with one OAuth approval" matches mcp-tools.md:21 and :42, and the MCP route "reads no API key, so `CLICKUP_API_KEY` and `CLICKUP_TEAM_ID` play no part" [SOURCE: .skilled/skills/mcp-tooling/mcp-click-up/references/mcp-tools.md:52]; README.md:1336 already stated "No env var needed" [SOURCE: README.md:1336].
- **No stale count residues**: a targeted scan over README.md for every audited stale value (12 agents, 39 commands, 42 rules, 19 YAML workflows, 96-feature, 37-scenario, `CLICKUP_API_KEY`, `CLICKUP_TEAM_ID`, `hermes status`) returned zero residual occurrences; the 16 matching lines reconcile exactly to the 15 fixed anchors plus the pre-existing `clickup_official` line at 1336 [SOURCE: README.md:1336].
- **seven CLI bridges** (README.md:66): README.md:1427 lists exactly seven (cli-opencode, cli-claude-code, cli-codex, cli-cursor, cli-devin, cli-pi, cli-hermes) [SOURCE: README.md:1427].
- **20 underlying YAML workflows** (README.md:1278): 21 YAML files in `.skilled/commands/doctor/assets/`, 20 declaring `operating_mode` (the mutation-class manifest does not), consistent with the claim (orchestrator-observed; see Edge Cases).

## Traceability Checks
| Protocol | Level | Status | Detail |
|---|---|---|---|
| spec_code | core | partial | Each changed line maps 1:1 to research rows F1–F11; full spec-doc reconciliation deferred |
| checklist_evidence | core | pending | Deferred to the traceability iteration |
| skill_agent / agent_cross_runtime / feature_catalog_code / playbook_capability | overlay | pending | Mirror sentence partially verified (see Edge Cases); other overlay checks not yet run |

## Integration Evidence
No integration surface was exercised this iteration. The runtime mirror dirs named below are the only integration-adjacent surface touched, and only as read-only evidence.

## Edge Cases
1. **Runtime mirror sentence (README.md:933)** — verified: `.claude/agents/` holds the 11 mirrors plus one Claude-only `Explore.md` [SOURCE: .claude/agents/Explore.md], `.pi/agents/` holds 11 [SOURCE: .pi/agents/review.md]. `.codex/agents`, `.cursor/agents` and `.devin/agents` are not materialized (or not traversable) in this worktree, so their mirror-vs-link status was not re-listed here. No evidence contradicts the sentence; closure belongs to the traceability iteration's `agent_cross_runtime` protocol.
2. **ClickUp counts (README.md:881)** — "111-feature catalog + 35-scenario playbook" matches the filesystem counts (catalog folders sum to 111 files; playbook 42 files of which 7 are the routing holdout = 35) from the orchestrator's observed run and the research record; the catalog/playbook self-description lines were not independently re-read this iteration (a directory-wide grep hit its result cap on OAuth matches first).
3. **Doctor YAML count (README.md:1278)** — the 20-of-21 `operating_mode` split rests on the orchestrator's observed run, consistent with the research record; not independently re-executed.
4. **Claude mirror extra file** — `Explore.md` is an extra non-canonical file in `.claude/agents/`; the changed sentence does not claim exclusivity, so this is a nuance for the mirror-sync check, not a defect of this change.

## Ruled Out
- ASCII box misalignment at README.md:125 and :147 (evidence: line-by-line column check of both boxes).
- Residual stale counts elsewhere in README.md (evidence: targeted scan, zero residual matches).
- Command/rule/agent count staleness (evidence: tree and registry recounts above).
- ClickUp env-var staleness and auth wording (evidence: skill references above).
- The 14 recorded line numbers being stale (evidence: every changed line sits at its recorded number in the current file).

## Next Focus
- **Dimension:** security
- **Focus area:** credential and auth wording in the changed surface — the ClickUp auth lines, the mcp-code-mode INSTALL-GUIDE frontmatter change, and the `.env.example` cross-claim; confirm no changed doc leaks or implies credential values.
- **Reason:** dimension rotation (D1 complete); security is thin for a documentation change, so it is scoped to the changed surface only.
- **Rotation status:** next unchecked dimension.
- **Carry-forward:** (a) runtime-mirror sentence closure for traceability (`agent_cross_runtime`) — re-list `.codex/.cursor/.devin` agent dirs against `.skilled/agents/`; (b) F12–F23 related-doc claims remain unreviewed; (c) the doctor check 13c removal and its tests remain unreviewed.
- **Required evidence:** direct listing or the mirror-sync tooling's runtime table; the eleven related docs' cited sources.
- **Recovery note:** none — iteration completed within budget.

## Verdict
No P0 or P1 findings; no P2 findings. The correctness dimension for the root README fixes F1–F11 is clean: every changed number re-derives from the repository, both ASCII boxes keep their right edge, the ClickUp wording matches the skill's own references, and no audited stale value remains anywhere in README.md.

Review verdict: PASS
