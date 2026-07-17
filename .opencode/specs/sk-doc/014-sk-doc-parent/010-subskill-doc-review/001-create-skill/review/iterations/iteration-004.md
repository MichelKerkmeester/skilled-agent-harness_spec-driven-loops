# Deep Review Iteration 004

## Dispatcher

- Run: deep-review-create-skill-001
- Target agent: deep-review
- Resolved route: native_task_tool_deep_review_leaf
- Agent definition loaded: true
- Mode: review
- Review target: `.opencode/skills/sk-doc/create-skill/`
- Focus: final missed-finding pass, validation coverage, target mutation check, and max-iteration verdict
- Dimension: security
- Budget profile: verify
- Status: complete

## Files Reviewed

- `.opencode/skills/sk-doc/create-skill/SKILL.md`
- `.opencode/skills/sk-doc/create-skill/README.md`
- `.opencode/skills/sk-doc/create-skill/references/shared/validation_and_packaging.md`
- `.opencode/skills/sk-doc/create-skill/assets/skill/skill_md_template.md`
- `.opencode/skills/sk-doc/create-skill/scripts/package_skill.py`
- `.opencode/skills/sk-code/code-review/references/review_core.md`

## Findings - New

### P0 Findings

None.

### P1 Findings

1. **SKILL.md template publishes a stale package validator path in its required validation command** -- `.opencode/skills/sk-doc/create-skill/assets/skill/skill_md_template.md:1157` -- The template's validation command reference tells authors to run `python .opencode/skills/sk-doc/scripts/package_skill.py .opencode/skills/[skill-name] --check`, but the live package validator for this packet is `.opencode/skills/sk-doc/create-skill/scripts/package_skill.py`, whose argparse confirms the supported `skill_path`, optional `output_dir`, `--check`, and `--json` surface [SOURCE: `.opencode/skills/sk-doc/create-skill/scripts/package_skill.py:710`; SOURCE: `.opencode/skills/sk-doc/create-skill/scripts/package_skill.py:720`]. This is a separate stale command from prior findings: P1-002 covered `quick_validate.py`, and P1-004 covered `validate_document.py`.
   - Finding class: cross-consumer
   - Scope proof: Final grep surfaced the stale command in the active template validation reference; direct source inspection confirmed the live `package_skill.py` path and supported flags.
   - Affected surface hints: [`assets/skill/skill_md_template.md`, `scripts/package_skill.py`, `skill validation command reference`]
   - Recommendation: Change the command to `python3 .opencode/skills/sk-doc/create-skill/scripts/package_skill.py .opencode/skills/[skill-name] --check` or document a stable wrapper if one is intended.
   ```json
   {"type":"claim-adjudication","claim":"skill_md_template.md publishes a stale package_skill.py validation command path","evidenceRefs":["assets/skill/skill_md_template.md:1153-1158","scripts/package_skill.py:710-724"],"counterevidenceSought":"Checked live create-skill scripts and package_skill.py argparse; no package validator exists at the documented sk-doc/scripts path in the verified script roots.","alternativeExplanation":"The command likely predates the nested create-skill packet layout, but it is currently presented as the required validation command.","finalSeverity":"P1","confidence":"high","downgradeTrigger":"Downgrade only if a compatible wrapper is added at `.opencode/skills/sk-doc/scripts/package_skill.py` or the template line is rewritten as a non-executable placeholder."}
   ```

### P2 Findings

None.

## Final Consolidated Findings

### P0 Findings

None.

### P1 Findings

1. **Creation workflow documents an optional `--path` default that the initializer does not support** -- `.opencode/skills/sk-doc/create-skill/references/skill/creation_workflow.md:122` -- Fix by removing the default-path sentence, stating `--path` is required, and changing the singular `.opencode/skill` example at line 137 to `.opencode/skills`.
2. **Reference docs point `quick_validate.py` at non-existent script locations** -- `.opencode/skills/sk-doc/create-skill/references/shared/common_pitfalls.md:67` -- Fix by replacing stale paths with `python3 .opencode/skills/sk-doc/shared/scripts/quick_validate.py <skill-dir>` or adding a real wrapper.
3. **The skill README template's own related-resource links do not resolve** -- `.opencode/skills/sk-doc/create-skill/assets/skill/skill_readme_template.md:225` -- Fix by pointing `../readme/readme_template.md` and `../../references/skill_creation.md` to live paths or removing those active links.
4. **README template validation checklist points at a non-existent validator path** -- `.opencode/skills/sk-doc/create-skill/assets/skill/skill_readme_template.md:219` -- Fix by changing the command to `python3 .opencode/skills/sk-doc/shared/scripts/validate_document.py <readme> --type readme` or adding a wrapper.
5. **Reference docs advertise `markdown-document-specialist` as an executable validation surface, but no such script exists in the allowed script set** -- `.opencode/skills/sk-doc/create-skill/references/skill/creation_workflow.md:333` -- Fix by replacing command/tool claims with `python3 .opencode/skills/sk-doc/shared/scripts/extract_structure.py <path/to/SKILL.md>` plus explicit manual/AI quality review.
6. **SKILL.md template publishes a stale package validator path in its required validation command** -- `.opencode/skills/sk-doc/create-skill/assets/skill/skill_md_template.md:1157` -- Fix by changing the command to the live nested `create-skill/scripts/package_skill.py` path or adding a stable wrapper.

### P2 Findings

1. **Package validator still warns that the primary contract is missing recommended routing sections** -- `.opencode/skills/sk-doc/create-skill/SKILL.md:265` -- Fix by adding concise `INTEGRATION POINTS` and `RELATED RESOURCES` sections or updating packager aliases if `REFERENCES` intentionally supersedes them.

## Traceability Checks

- Final validation coverage completed: 16 scoped markdown docs (`SKILL.md`, root `README.md`, `references/**/*.md`, and markdown `assets/**/*.md`) validated with `validate_document.py` using `skill`, `readme`, or `reference` type as appropriate; all exited 0.
- `package_skill.py .opencode/skills/sk-doc/create-skill --check` exited 0 and PASS, with the already-filed 3 warnings for recommended sections and smart-router markers.
- `git status --short -- .opencode/skills/sk-doc/create-skill` returned no target modifications.
- Final safety scan found no P0 security/destructive-data issue. The line `Skill automatically available to the agent` in `validation_and_packaging.md:121` was treated as an installation/discovery statement, not a workspace mutation or security-sensitive auto-execution claim.

## Integration Evidence

- Live script command surfaces verified across earlier iterations: `init_skill.py --help`, `package_skill.py --help`, `validate_document.py --help`, `quick_validate.py --help`, and `extract_structure.py --help` all exited 0.
- Final source check confirmed `package_skill.py` supports `skill_path`, optional `output_dir`, `--check`, and `--json` [SOURCE: `.opencode/skills/sk-doc/create-skill/scripts/package_skill.py:710`; SOURCE: `.opencode/skills/sk-doc/create-skill/scripts/package_skill.py:720`; SOURCE: `.opencode/skills/sk-doc/create-skill/scripts/package_skill.py:725`].

## Edge Cases

- `review-report.md` was not written because the LEAF contract marks reports/reducer outputs as outer-workflow-owned read-only surfaces; final synthesis data is included in this iteration artifact and JSONL for the reducer/orchestrator to consume.
- `deep-review-findings-registry.json` was not updated for the same reducer-owned boundary.
- Placeholder/example links inside fenced templates remain a residual risk only if copied verbatim; active path/link claims were prioritized.

## Confirmed-Clean Surfaces

- Primary `SKILL.md` workflow remains self-sufficient and validates with zero blocking issues.
- Root `README.md` validates with zero blocking issues.
- All reference docs and markdown asset templates validate with zero blocking issues.
- Target directory was not modified by this LEAF run.

## Ruled Out

- P0 immediate harm: ruled out by read-only documentation scope and no destructive/auth/security evidence.
- Additional P1 for installation wording at `validation_and_packaging.md:121`: ruled out as non-executable availability prose, not an automatic mutation claim.
- Completion PASS verdict: ruled out because active P1 findings remain.

## Final Verdict

- Verdict: CONDITIONAL
- Reason: No P0 blockers, but six active P1 findings remain and require remediation before release/promotion.
- Active findings total: P0=0, P1=6, P2=1.
- Residual testing gaps: reducer-owned registry/report refresh was not performed by this LEAF; outer workflow must reduce JSONL into registry/report artifacts. Placeholder links inside fenced template examples were not exhaustively remediated because they are likely intentional placeholders.

## Next Focus

- dimension: synthesis
- focus area: outer workflow reducer/report refresh and remediation planning
- reason: maxIterations=4 reached; LEAF iteration work is complete with active P1 findings
- rotation status: terminal max-iteration pass
- blocked/productive carry-forward: reducer-owned registry and review report remain for outer workflow
- required evidence: run reducer/synthesis outside LEAF boundary and plan fixes for P1-001 through P1-006
