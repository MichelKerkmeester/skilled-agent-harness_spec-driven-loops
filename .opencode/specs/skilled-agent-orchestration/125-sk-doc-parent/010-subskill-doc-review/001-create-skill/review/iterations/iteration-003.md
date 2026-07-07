# Deep Review Iteration 003

## Dispatcher

- Run: deep-review-create-skill-001
- Target agent: deep-review
- Resolved route: native_task_tool_deep_review_leaf
- Agent definition loaded: true
- Mode: review
- Review target: `.opencode/skills/sk-doc/create-skill/`
- Focus: tool, script, flag, command-example, section-claim, and template-fidelity checks against live scripts/templates
- Dimension: maintainability
- Budget profile: scan
- Status: complete

## Files Reviewed

- `.opencode/skills/sk-doc/create-skill/SKILL.md`
- `.opencode/skills/sk-doc/create-skill/README.md`
- `.opencode/skills/sk-doc/create-skill/references/shared/overview.md`
- `.opencode/skills/sk-doc/create-skill/references/shared/common_pitfalls.md`
- `.opencode/skills/sk-doc/create-skill/references/shared/validation_and_packaging.md`
- `.opencode/skills/sk-doc/create-skill/references/skill/creation_workflow.md`
- `.opencode/skills/sk-doc/create-skill/assets/skill/skill_readme_template.md`
- `.opencode/skills/sk-doc/create-skill/assets/skill/skill_md_template.md`
- `.opencode/skills/sk-doc/create-skill/assets/skill/skill_asset_template.md`
- `.opencode/skills/sk-doc/create-skill/assets/skill/skill_reference_template.md`
- `.opencode/skills/sk-doc/create-skill/scripts/init_skill.py`
- `.opencode/skills/sk-doc/create-skill/scripts/package_skill.py`
- `.opencode/skills/sk-doc/shared/scripts/validate_document.py`
- `.opencode/skills/sk-doc/shared/scripts/quick_validate.py`
- `.opencode/skills/sk-doc/shared/scripts/extract_structure.py`
- `.opencode/skills/sk-code/code-review/references/review_core.md`

## Findings - New

### P0 Findings

None.

### P1 Findings

1. **README template validation checklist points at a non-existent validator path** -- `.opencode/skills/sk-doc/create-skill/assets/skill/skill_readme_template.md:219` -- The template's validation checklist says `python3 .opencode/skills/sk-doc/scripts/validate_document.py <readme> --type readme` must report zero issues, but the live validator is under `.opencode/skills/sk-doc/shared/scripts/validate_document.py`, and `validate_document.py --help` confirms the supported `--type` surface there. This is not a duplicate of P1-002 because that prior finding covered `quick_validate.py`; this is a separate executable validator path embedded in a template checklist.
   - Finding class: cross-consumer
   - Scope proof: `validate_document.py --help` exited 0 from `shared/scripts`; the available script inventory contains no `.opencode/skills/sk-doc/scripts/validate_document.py` path, while this template checklist publishes that exact stale path.
   - Affected surface hints: [`assets/skill/skill_readme_template.md`, `shared/scripts/validate_document.py`, `README template validation checklist`]
   - Recommendation: Change the checklist command to `python3 .opencode/skills/sk-doc/shared/scripts/validate_document.py <readme> --type readme`, or define a real wrapper at the documented path.
   ```json
   {"type":"claim-adjudication","claim":"skill_readme_template.md publishes a stale validate_document.py command path","evidenceRefs":["assets/skill/skill_readme_template.md:207-219","shared/scripts/validate_document.py --help exit 0","script inventory: shared/scripts/validate_document.py exists; sk-doc/scripts/validate_document.py absent"],"counterevidenceSought":"Checked the live script list and ran the shared validator help surface to confirm the supported command and flags.","alternativeExplanation":"The stale path may predate the shared/scripts split, but it is currently an executable checklist command.","finalSeverity":"P1","confidence":"high","downgradeTrigger":"Downgrade only if a compatible wrapper is added at `.opencode/skills/sk-doc/scripts/validate_document.py` or the template marks the line as illustrative placeholder text."}
   ```

2. **Reference docs advertise `markdown-document-specialist` as an executable validation surface, but no such script exists in the allowed script set** -- `.opencode/skills/sk-doc/create-skill/references/skill/creation_workflow.md:333` -- The workflow's recommended final quality pass says to run `markdown-document-specialist extract markdown-optimizer/SKILL.md`, while `validation_and_packaging.md` and `overview.md` label comprehensive/required-section validation as `markdown-document-specialist` validation [SOURCE: `.opencode/skills/sk-doc/create-skill/references/shared/validation_and_packaging.md:73`; SOURCE: `.opencode/skills/sk-doc/create-skill/references/shared/overview.md:77`]. The live scripts under the allowed verification roots expose `extract_structure.py`, `validate_document.py`, `quick_validate.py`, `init_skill.py`, and `package_skill.py`; `extract_structure.py --help` confirms the real structure-extraction command is `extract_structure.py <filepath>`. This violates the no-fabricated-tool-name requirement.
   - Finding class: cross-consumer
   - Scope proof: Checked all live scripts under `.opencode/skills/sk-doc/shared/scripts` and `.opencode/skills/sk-doc/create-skill/scripts`, then ran `extract_structure.py --help` to verify the real replacement surface.
   - Affected surface hints: [`references/skill/creation_workflow.md`, `references/shared/validation_and_packaging.md`, `references/shared/overview.md`, `shared/scripts/extract_structure.py`]
   - Recommendation: Replace `markdown-document-specialist extract ...` and prose labels with the real `python3 .opencode/skills/sk-doc/shared/scripts/extract_structure.py <path/to/SKILL.md>` plus an explicit AI/manual review step for qualitative judgement.
   ```json
   {"type":"claim-adjudication","claim":"reference docs advertise markdown-document-specialist as a validation tool despite no matching script in the verified script roots","evidenceRefs":["references/skill/creation_workflow.md:331-334","references/shared/validation_and_packaging.md:73-92","references/shared/overview.md:77-85","shared/scripts/extract_structure.py --help exit 0"],"counterevidenceSought":"Checked live script inventory and help surfaces for every allowed script root; no markdown-document-specialist executable is present there.","alternativeExplanation":"markdown-document-specialist may have been an old agent name or conceptual role, but the review requirement asks tool/script claims to resolve against real scripts.","finalSeverity":"P1","confidence":"high","downgradeTrigger":"Downgrade if a real supported markdown-document-specialist command is restored and documented, or if the prose is changed from command/tool claim to non-executable human review role."}
   ```

### P2 Findings

None.

## Traceability Checks

- Confirmed prior P1-001 remains valid: `init_skill.py --help` shows `--path PATH` is required, matching the source evidence from iteration 2 and contradicting `creation_workflow.md:122`.
- Confirmed prior P1-002 remains valid: `quick_validate.py --help` works only from the shared script path, while the reference docs still cite stale `sk-doc/scripts` or packet-local script paths.
- Confirmed prior P1-003 remains valid and not broadened: this iteration did not reclassify placeholder/template example links as active findings.
- Completed validation coverage for current scope: all 16 markdown docs checked in `SKILL.md`, `README.md`, `references/**/*.md`, and `assets/**/*.md` returned `validate_document.py` exit 0.
- Verified live help surfaces:
  - `python3 .opencode/skills/sk-doc/create-skill/scripts/init_skill.py --help` -> exit 0; required `--path`.
  - `python3 .opencode/skills/sk-doc/create-skill/scripts/package_skill.py --help` -> exit 0; supports `--check` and `--json`.
  - `python3 .opencode/skills/sk-doc/shared/scripts/validate_document.py --help` -> exit 0; supports `--type`, `--json`, `--blocking-only`, `--fix`, `--dry-run`, `--no-exclude`.
  - `python3 .opencode/skills/sk-doc/shared/scripts/quick_validate.py --help` -> exit 0; supports `--json` and `--description-soft-target`.
  - `python3 .opencode/skills/sk-doc/shared/scripts/extract_structure.py --help` -> exit 0; accepts `filepath`.

## Integration Evidence

- Live allowed script set under the requested roots: `init_skill.py`, `package_skill.py`, `validate_document.py`, `quick_validate.py`, `extract_structure.py`, `frontmatter-version.mjs`, `check-frontmatter-versions.sh`.
- No `markdown-document-specialist` executable was present in the verified script roots.
- No `sk-doc/scripts/validate_document.py` path was present in the verified script roots.

## Edge Cases

- The findings registry remains reducer-owned/read-only under the LEAF contract, so this iteration did not update it despite the dispatch's conditional registry note.
- Changelog text was not treated as part of this iteration's main target because the dispatch focus named SKILL.md, README.md, references/**, and assets/**; a grep hit in changelog was ignored as out-of-focus context.
- `markdown-document-specialist` could be an old role name rather than an executable, but it appears in a command example and validation surface labels, so it is active under the no-fabricated-tool-name requirement.

## Confirmed-Clean Surfaces

- `package_skill.py --help` confirms the `--check` and `--json` claims from SKILL/README remain valid.
- All scoped markdown docs validate with zero blocking issues under `validate_document.py`.
- Template section-fidelity claims for required/recommended SKILL sections match the packager's required/recommended section model except the already-filed P2 about current `SKILL.md` missing recommended routing sections.

## Ruled Out

- New P0: ruled out because the defects are documentation command/path fidelity problems, not immediate destructive or security blockers.
- Duplicate broadening of P1-002: ruled out because P1-002 is about `quick_validate.py`; the new validator-path finding is a separate executable checklist command.
- P1 for every `skill_creation.md` display name: ruled out where links resolve to `references/README.md` and act as labels rather than missing paths.

## Next Focus

- dimension: security
- focus area: final cross-dimension pass for security-sensitive or release-blocking documentation claims, then synthesis readiness
- reason: iterations 1-3 covered primary contract, reference/path overflow, script/flag claims, and validation coverage; final max-iteration pass should check whether any security/reliability blocker was missed and prepare final verdict inputs
- rotation status: rotate to remaining dimension under max-iterations policy
- blocked/productive carry-forward: reducer-owned registry still requires outer workflow refresh; active P1 findings remain
- required evidence: targeted scan for unsafe automation claims, destructive package/install guidance, and final consistency between iteration artifacts and state
