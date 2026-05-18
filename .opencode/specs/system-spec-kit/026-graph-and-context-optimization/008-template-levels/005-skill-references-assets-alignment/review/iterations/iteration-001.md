# Review Iteration 001

## Dispatcher

- Command: `/spec_kit:deep-review:auto`
- Target: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/005-skill-references-assets-alignment`
- Review packet root: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/005-skill-references-assets-alignment/review`
- Iteration: 1 of 5
- Focus dimension: `implementation-spec-alignment`
- Canonical dimension: traceability
- Budget profile: verify
- Status: complete

## Files Reviewed

- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/005-skill-references-assets-alignment/spec.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/005-skill-references-assets-alignment/plan.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/005-skill-references-assets-alignment/tasks.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/005-skill-references-assets-alignment/implementation-summary.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/graph-metadata.json`
- `.opencode/skills/system-spec-kit/SKILL.md`
- `.opencode/skills/system-spec-kit/assets/template_mapping.md`
- `.opencode/skills/system-spec-kit/references/templates/template_guide.md`
- `.opencode/skills/system-spec-kit/references/templates/level_specifications.md`
- `.opencode/skills/system-spec-kit/references/validation/path_scoped_rules.md`
- `.opencode/skills/system-spec-kit/references/workflows/execution_methods.md`
- `.opencode/skills/system-spec-kit/references/workflows/quick_reference.md`
- `.opencode/skills/system-spec-kit/references/config/environment_variables.md`
- `.opencode/skills/system-spec-kit/templates/README.md`
- `.opencode/skills/system-spec-kit/templates/manifest/spec-kit-docs.json`
- `.opencode/skills/system-spec-kit/scripts/spec/create.sh`
- `.opencode/skills/system-spec-kit/scripts/spec/validate.sh`
- `.opencode/skills/system-spec-kit/scripts/templates/inline-gate-renderer.ts`
- `.opencode/skills/system-spec-kit/mcp_server/lib/templates/level-contract-resolver.ts`

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **`--path` boundary docs omit the live `/tmp` test-fixture exception** -- `.opencode/skills/system-spec-kit/references/workflows/execution_methods.md:119` -- The workflow reference says "`--path` resolves and validates the target before writing; traversal outside the repository is rejected" [SOURCE: `.opencode/skills/system-spec-kit/references/workflows/execution_methods.md:119`]. The quick reference repeats the same absolute boundary claim [SOURCE: `.opencode/skills/system-spec-kit/references/workflows/quick_reference.md:137`]. The implementation does reject `..` traversal [SOURCE: `.opencode/skills/system-spec-kit/scripts/spec/create.sh:729`] and rejects non-repo targets after resolution [SOURCE: `.opencode/skills/system-spec-kit/scripts/spec/create.sh:759`], but it also explicitly allows resolved targets under `/tmp` or `${TMPDIR}` for test fixtures before the repo-boundary rejection runs [SOURCE: `.opencode/skills/system-spec-kit/scripts/spec/create.sh:751`]. This is a documentation/implementation alignment gap rather than a runtime bug because the script's own error text names the `/tmp` testing exception [SOURCE: `.opencode/skills/system-spec-kit/scripts/spec/create.sh:717`].
   - Finding class: matrix/evidence
   - Scope proof: The same boundary wording appears in the two in-scope workflow references reviewed (`execution_methods.md` and `quick_reference.md`), while the reviewed implementation surface has a single `resolve_and_validate_create_target` path gate that permits `/tmp`/`${TMPDIR}` before enforcing the repository boundary.
   - Affected surface hints: ["workflow reference docs", "quick reference docs", "create.sh --path guidance"]
   - Recommendation: Reword both workflow references to say traversal is rejected and normal targets must stay inside the repository, while absolute `/tmp`/`${TMPDIR}` paths are reserved for test fixtures.

## Traceability Checks

- `spec_code`: complete for this iteration. The packet requirement to preserve legitimate `templates/manifest/` references [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/005-skill-references-assets-alignment/spec.md:107`] aligns with current template architecture docs [SOURCE: `.opencode/skills/system-spec-kit/templates/README.md:37`] and resolver manifest loading [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/templates/level-contract-resolver.ts:58`].
- `checklist_evidence`: complete for this iteration. Tasks T307-T314 are marked complete [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/005-skill-references-assets-alignment/tasks.md:92`] and the implementation summary records Gates A-E plus readability/current-reality grep outcomes [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/005-skill-references-assets-alignment/implementation-summary.md:102`].
- `skill_agent`: partial/complete for implementation-alignment scope. `SKILL.md` exposes the current CLI exit-code taxonomy [SOURCE: `.opencode/skills/system-spec-kit/SKILL.md:111`] and instructs agents to scaffold through `create.sh` or `inline-gate-renderer` [SOURCE: `.opencode/skills/system-spec-kit/SKILL.md:386`].
- `agent_cross_runtime`: not expanded beyond command/YAML context this iteration; no runtime mirror finding was attempted under the implementation-spec-alignment focus.

## Integration Evidence

- Commit ledger: `git show --name-only e60b095416` lists the 19 skill/reference/asset paths plus parent `graph-metadata.json`, matching the configured review scope.
- Template implementation: `templates/README.md` states the manifest maps public Levels to required/add-on/lazy docs and section gates [SOURCE: `.opencode/skills/system-spec-kit/templates/README.md:37`], and `spec-kit-docs.json` contains template version entries for the expected manifest templates [SOURCE: `.opencode/skills/system-spec-kit/templates/manifest/spec-kit-docs.json:4`].
- Inline renderer implementation: `inline-gate-renderer.ts` documents CLI usage for `--level <1|2|3|3+|phase>` and `--out-dir` [SOURCE: `.opencode/skills/system-spec-kit/scripts/templates/inline-gate-renderer.ts:275`], matching the manifest-template render guidance in `template_guide.md` [SOURCE: `.opencode/skills/system-spec-kit/references/templates/template_guide.md:50`].
- Validation implementation: `validate.sh` publishes the 0/1/2/3 exit-code taxonomy [SOURCE: `.opencode/skills/system-spec-kit/scripts/spec/validate.sh:105`], matching the workflow reference [SOURCE: `.opencode/skills/system-spec-kit/references/workflows/execution_methods.md:36`] and `SKILL.md` [SOURCE: `.opencode/skills/system-spec-kit/SKILL.md:111`].

## Edge Cases

- `resource-map.md` is absent, consistent with config and strategy; this iteration used `implementation-summary.md` plus the e60b095416 ledger.
- The parent `graph-metadata.json` now points `derived.last_active_child_id` at child `006` [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/graph-metadata.json:35`]. This was treated as later parent state, not as a 005 defect, because the same metadata still includes child `005` in `children_ids` [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/graph-metadata.json:11`].
- The `/tmp` exception finding was kept at P2 because it is a documentation precision gap; the implementation remains explicit about traversal rejection and test-fixture allowance.

## Confirmed-Clean Surfaces

- No stale-pattern hits for `level_contract_`, `Level template contract`, `placeholder resolver`, old phase wording, or retired architecture labels were found in the configured SKILL/reference/assets scope.
- Manifest-backed template references in `level_specifications.md` align with the live manifest and resolver surfaces [SOURCE: `.opencode/skills/system-spec-kit/references/templates/level_specifications.md:16`; SOURCE: `.opencode/skills/system-spec-kit/templates/manifest/spec-kit-docs.json:3`; SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/templates/level-contract-resolver.ts:58`].
- Phase-parent template mapping aligns with `create.sh` phase flags: docs name `--phase --phases N --phase-names a,b,c` [SOURCE: `.opencode/skills/system-spec-kit/assets/template_mapping.md:58`], and `create.sh` parses `--phase`, `--phases`, and `--phase-names` [SOURCE: `.opencode/skills/system-spec-kit/scripts/spec/create.sh:143`; SOURCE: `.opencode/skills/system-spec-kit/scripts/spec/create.sh:146`; SOURCE: `.opencode/skills/system-spec-kit/scripts/spec/create.sh:164`].
- Post-create validation guidance aligns with implementation: docs state `SPECKIT_POST_VALIDATE=1` is opt-in [SOURCE: `.opencode/skills/system-spec-kit/references/workflows/execution_methods.md:121`], and `create.sh` gates post-create validation on that environment variable [SOURCE: `.opencode/skills/system-spec-kit/scripts/spec/create.sh:1699`].

## Ruled Out

- No P0/P1 spec contradiction was confirmed for manifest-backed Level contracts.
- No finding was opened for parent `last_active_child_id=006`; this is later parent progress, while the ledger inclusion of child `005` remains present.
- No finding was opened for validation exit codes; docs and implementation agree on 0/1/2/3 semantics.

## Next Focus

- Dimension: code-correctness
- Focus area: Verify referenced scripts, template resolver/renderer behavior, and parent metadata assumptions for correctness risks independent of prose alignment.
- Reason: Implementation-spec-alignment found one P2 documentation precision issue and otherwise confirmed the core documentation claims against live implementation surfaces.
- Rotation status: advance
- Blocked/productive carry-forward: Productive evidence paths include `create.sh`, `validate.sh`, `inline-gate-renderer.ts`, `level-contract-resolver.ts`, and manifest files; carry the `/tmp` boundary note only as a P2 doc-alignment advisory.
- Required evidence: Direct file:line reads from implementation-code context surfaces and any affected scoped docs.
