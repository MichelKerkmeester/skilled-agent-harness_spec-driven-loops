## Dispatcher

- Workflow: `/spec_kit:deep-review:auto`
- Iteration: 4 of 5
- Mode: review
- Focus dimension: maintainability
- Budget profile: verify (focused stale-reference inventory plus evidence rereads)

## Files Reviewed

- `specs/skilled-agent-orchestration/087-improve-agent-to-deep-agent-improvement-rename/review/deep-review-config.json`
- `specs/skilled-agent-orchestration/087-improve-agent-to-deep-agent-improvement-rename/review/deep-review-state.jsonl`
- `specs/skilled-agent-orchestration/087-improve-agent-to-deep-agent-improvement-rename/review/deep-review-findings-registry.json`
- `specs/skilled-agent-orchestration/087-improve-agent-to-deep-agent-improvement-rename/review/deep-review-strategy.md`
- `.opencode/skills/sk-code-review/references/review_core.md`
- `.opencode/commands/improve/agent.md`
- `.claude/commands/improve/agent.md`
- `.gemini/commands/improve/improve-agent.toml`
- `.gemini/commands/improve/README.txt`
- `.opencode/skills/deep-agent-improvement/feature_catalog/01--evaluation-loop/01-initialization.md`
- `.opencode/skills/deep-agent-improvement/feature_catalog/01--evaluation-loop/02-candidate-generation.md`
- `.opencode/skills/deep-agent-improvement/feature_catalog/feature_catalog.md`
- `.opencode/skills/deep-agent-improvement/SKILL.md`
- `.opencode/skills/deep-agent-improvement/assets/benchmark-profiles/default.json`

## Findings - New

### P0 Findings

- None.

### P1 Findings

- **F006**: Active skill catalog and benchmark defaults still publish the removed proposal-agent/YAML identity -- .opencode/skills/deep-agent-improvement/feature_catalog/01--evaluation-loop/02-candidate-generation.md:18 -- The maintainability drift is broader than the already-recorded Gemini command and CP-041/CP-042 playbook surfaces: active feature-catalog docs still say candidate generation is delegated to `.opencode/agents/improve-agent.md`, list obsolete `improve_improve-agent_{auto,confirm}.yaml` workflows, and the default benchmark profile still targets `.opencode/agents/improve-agent.md` even though the active agent inventory contains `.opencode/agents/deep-agent-improvement.md` instead.
  - Finding class: cross-consumer
  - Scope proof: Direct active-scope searches found old proposal-agent/YAML references in `.opencode/skills/deep-agent-improvement/feature_catalog/01--evaluation-loop/01-initialization.md:18`, `01-initialization.md:31-32`, `01--evaluation-loop/02-candidate-generation.md:18`, `02-candidate-generation.md:30-32`, `feature_catalog/feature_catalog.md:27-28`, `.opencode/skills/deep-agent-improvement/SKILL.md:444`, and `.opencode/skills/deep-agent-improvement/assets/benchmark-profiles/default.json:6`; direct inventory of `.opencode/agents/` shows only `deep-agent-improvement.md`, not `improve-agent.md`.
  - Affected surface hints: ["deep-agent-improvement feature catalog", "skill integration docs", "default benchmark profile", "workflow asset naming", "proposal-agent path examples"]
  - Recommendation: Update active deep-agent-improvement feature-catalog pages, `SKILL.md` integration points, and benchmark profile defaults to the `deep-agent-improvement` agent/YAML names; then rerun the same old-name inventory outside `specs/` and `z_archive/` before marking maintainability complete.
  - Claim adjudication: `{"type":"gate-relevant-p1","claim":"Active deep-agent-improvement catalog and benchmark defaults still publish removed improve-agent paths/YAML names outside the previously recorded Gemini command and CP-041/CP-042 playbook surfaces.","evidenceRefs":[".opencode/skills/deep-agent-improvement/feature_catalog/01--evaluation-loop/01-initialization.md:18",".opencode/skills/deep-agent-improvement/feature_catalog/01--evaluation-loop/01-initialization.md:31",".opencode/skills/deep-agent-improvement/feature_catalog/01--evaluation-loop/02-candidate-generation.md:18",".opencode/skills/deep-agent-improvement/feature_catalog/01--evaluation-loop/02-candidate-generation.md:30",".opencode/skills/deep-agent-improvement/feature_catalog/feature_catalog.md:27",".opencode/skills/deep-agent-improvement/SKILL.md:444",".opencode/skills/deep-agent-improvement/assets/benchmark-profiles/default.json:6"],"counterevidenceSought":"Checked prior F001/F002/F005 surfaces and excluded them as duplicates; checked OpenCode/Claude command docs and found renamed YAML assets at `.opencode/commands/improve/agent.md:269-270` and `.claude/commands/improve/agent.md:269-270`; read `.opencode/agents/` inventory and found `deep-agent-improvement.md` but not `improve-agent.md`.","alternativeExplanation":"Some feature-catalog prose may be stale documentation rather than executable workflow dispatch, but the benchmark profile is an active default JSON config and the catalog/SKILL files are operator-facing source-of-truth for the skill.","finalSeverity":"P1","confidence":"high","downgradeTrigger":"Downgrade to P2 only if the feature catalog, SKILL integration points, and default benchmark profile are formally retired or not consumed by operators/tooling after the rename."}`

### P2 Findings

- None.

## Traceability Checks

- Remaining stale references are not fully concentrated in F001/F002 surfaces; feature catalog, SKILL integration points, and benchmark defaults still carry the old naming family, so repair is tractable but requires a same-class inventory pass.
- OpenCode and Claude command docs agree on renamed YAML assets [SOURCE: `.opencode/commands/improve/agent.md:269-270`; `.claude/commands/improve/agent.md:269-270`]. Gemini command docs still disagree via F001 [SOURCE: `.gemini/commands/improve/improve-agent.toml:60-61`; `.gemini/commands/improve/README.txt:158-159`].
- Follow-on path is unsafe if driven only from current packet ledgers because F003/F004/F005 remain active; however, the concrete stale-reference class identified in F006 gives a repairable inventory target.
- Active exact references to old YAML filenames and the old agent file path were checked outside historical `z_archive`; new active surfaces were found in feature-catalog/SKILL/benchmark defaults.

## Integration Evidence

- `.opencode/commands/improve/agent.md:269-270` and `.claude/commands/improve/agent.md:269-270` select `assets/improve_deep-agent-improvement_{auto,confirm}.yaml`, providing clean counterevidence for canonical command docs.
- `.opencode/agents/` inventory contains `deep-agent-improvement.md` and no `improve-agent.md`, confirming old proposal-agent paths in active docs/config point at a removed file.
- `.opencode/skills/deep-agent-improvement/assets/benchmark-profiles/default.json:6` is active runtime configuration, not only prose, so the old path affects maintainability of benchmark defaults.

## Edge Cases

- Historical references in `specs/`, `.opencode/specs/`, and `z_archive` were not treated as defects unless an active file relied on them as current operator evidence.
- `.claude/settings.local.json` contains old move commands, but it is a local settings artifact rather than active command/runtime documentation in the declared maintainability scope, so it was not raised as an active finding.
- F006 intentionally excludes Gemini TOML/README and CP-041/CP-042 playbook command blocks already covered by F001/F002/F005; it covers additional active skill catalog/config surfaces.

## Confirmed-Clean Surfaces

- OpenCode command mode-to-YAML references use renamed workflow asset names [SOURCE: `.opencode/commands/improve/agent.md:269-270`].
- Claude command mode-to-YAML references use renamed workflow asset names [SOURCE: `.claude/commands/improve/agent.md:269-270`].
- Active `.opencode/agents/` directory has the renamed canonical proposal agent file and no old `improve-agent.md` file.

## Ruled Out

- No duplicate F001: stale Gemini YAML references remain already-recorded P1 correctness/traceability evidence.
- No duplicate F002: CP-041/CP-042 old `cat .opencode/agents/improve-agent.md` commands remain already-recorded P1 correctness/traceability evidence.
- No new P0: the maintainability drift points at absent paths and stale operator/config guidance, not exploitability or destructive data loss.

## Next Focus

- Dimension: synthesis/stabilization
- Focus area: consolidate P1 findings F001-F006, verify no further dimensions remain, and prepare final review verdict.
- Reason: all four dimensions have now been covered; maintainability added one same-class active stale-reference finding beyond F001-F005.
- Rotation status: correctness, security, traceability, and maintainability completed; synthesis/stabilization remains for iteration 5 if the loop continues.
- Blocked/productive carry-forward: open P1s remain Gemini YAML docs, playbook old-path commands, incomplete completion artifact placeholders, unchecked ledgers, resource-map false OK rows, and active skill catalog/benchmark defaults with old names.
- Required evidence: final synthesis should reuse registry plus iteration artifacts and avoid reopening exhausted historical/z_archive directions.
