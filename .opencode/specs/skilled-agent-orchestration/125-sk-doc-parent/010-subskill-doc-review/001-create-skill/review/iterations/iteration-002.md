# Deep Review Iteration 002

## Dispatcher

- Run: deep-review-create-skill-001
- Target agent: deep-review
- Resolved route: native_task_tool_deep_review_leaf
- Agent definition loaded: true
- Mode: review
- Review target: `.opencode/skills/sk-doc/create-skill/`
- Focus: README/references/assets route-map quality, overflow boundaries, relative paths, and section/script claim fidelity
- Dimension: traceability
- Budget profile: scan
- Status: complete

## Files Reviewed

- `.opencode/skills/sk-doc/create-skill/README.md`
- `.opencode/skills/sk-doc/create-skill/SKILL.md`
- `.opencode/skills/sk-doc/create-skill/references/README.md`
- `.opencode/skills/sk-doc/create-skill/references/shared/overview.md`
- `.opencode/skills/sk-doc/create-skill/references/shared/common_pitfalls.md`
- `.opencode/skills/sk-doc/create-skill/references/shared/validation_and_packaging.md`
- `.opencode/skills/sk-doc/create-skill/references/skill/creation_workflow.md`
- `.opencode/skills/sk-doc/create-skill/references/skill/examples_and_maintenance.md`
- `.opencode/skills/sk-doc/create-skill/references/parent_skill/parent_skills_nested_packets.md`
- `.opencode/skills/sk-doc/create-skill/references/parent_skill/parent_hub_router_schema.md`
- `.opencode/skills/sk-doc/create-skill/assets/skill/skill_readme_template.md`
- `.opencode/skills/sk-doc/create-skill/assets/skill/skill_md_template.md`
- `.opencode/skills/sk-doc/create-skill/assets/skill/skill_reference_template.md`
- `.opencode/skills/sk-doc/create-skill/scripts/init_skill.py`
- `.opencode/skills/sk-doc/shared/scripts/quick_validate.py`
- `.opencode/skills/sk-code/code-review/references/review_core.md`

## Findings - New

### P0 Findings

None.

### P1 Findings

1. **Creation workflow documents an optional `--path` default that the initializer does not support** -- `.opencode/skills/sk-doc/create-skill/references/skill/creation_workflow.md:122` -- The reference says `init_skill.py` defaults to the current directory when `--path` is omitted, but the real initializer declares `--path` with `required=True` [SOURCE: `.opencode/skills/sk-doc/create-skill/scripts/init_skill.py:415`]. The same example also claims it is creating in `.opencode/skills/` but passes `.opencode/skill` singular [SOURCE: `.opencode/skills/sk-doc/create-skill/references/skill/creation_workflow.md:136`]. This violates the review requirement to avoid fabricated flag/path behavior and can make operators run a failing scaffold command.
   - Finding class: matrix/evidence
   - Scope proof: Checked the reference workflow command against the actual `argparse` contract in `init_skill.py`; README/SKILL.md examples already use `--path` and do not rely on the false default.
   - Affected surface hints: [`references/skill/creation_workflow.md`, `scripts/init_skill.py`, `README.md quick start`]
   - Recommendation: Remove the default-path sentence, state `--path` is required, and fix the example command to `scripts/init_skill.py markdown-optimizer --path .opencode/skills`.
   ```json
   {"type":"claim-adjudication","claim":"creation_workflow.md publishes unsupported init_skill.py --path behavior","evidenceRefs":["references/skill/creation_workflow.md:117-123","references/skill/creation_workflow.md:134-140","scripts/init_skill.py:410-418"],"counterevidenceSought":"Checked the actual initializer argparse block and compared README/SKILL.md usage examples for an intended optional path variant.","alternativeExplanation":"The default-path sentence may be stale from an older initializer, but the live script now requires --path.","finalSeverity":"P1","confidence":"high","downgradeTrigger":"Downgrade only if init_skill.py adds an actual optional default path or the stale reference is explicitly marked historical/non-executable."}
   ```

2. **Reference docs point `quick_validate.py` at non-existent script locations** -- `.opencode/skills/sk-doc/create-skill/references/shared/common_pitfalls.md:67` -- `common_pitfalls.md` tells operators to run `python3 .opencode/skills/sk-doc/scripts/quick_validate.py <skill-dir>`, and `validation_and_packaging.md` lists `scripts/quick_validate.py` as a key source [SOURCE: `.opencode/skills/sk-doc/create-skill/references/shared/validation_and_packaging.md:32`]. The live script is under `.opencode/skills/sk-doc/shared/scripts/quick_validate.py` [SOURCE: `.opencode/skills/sk-doc/shared/scripts/quick_validate.py:1`], not `.opencode/skills/sk-doc/scripts/` or this packet's `scripts/` directory. This violates the no-fabricated-script/path requirement.
   - Finding class: cross-consumer
   - Scope proof: Checked both references that mention `quick_validate.py` plus the live shared script location; create-skill local scripts contain `init_skill.py` and `package_skill.py`, while quick validation lives in the shared scripts surface.
   - Affected surface hints: [`references/shared/common_pitfalls.md`, `references/shared/validation_and_packaging.md`, `shared/scripts/quick_validate.py`]
   - Recommendation: Replace the stale invocations with `python3 .opencode/skills/sk-doc/shared/scripts/quick_validate.py <skill-dir>` or `../shared/scripts/quick_validate.py <skill-dir>` depending on whether the prose is repo-root or packet-relative.
   ```json
   {"type":"claim-adjudication","claim":"reference docs publish quick_validate.py paths that do not match the live script location","evidenceRefs":["references/shared/common_pitfalls.md:61-68","references/shared/validation_and_packaging.md:32-35","shared/scripts/quick_validate.py:1"],"counterevidenceSought":"Checked the live shared script and the create-skill local scripts surfaced by the target glob; no quick_validate.py exists at the documented packet-local or sk-doc/scripts location.","alternativeExplanation":"The docs may intend shorthand script names, but one line is a full repo-root command and the other sits in a path-claim list, so both are executable path claims.","finalSeverity":"P1","confidence":"high","downgradeTrigger":"Downgrade only if the missing wrapper script is added at the documented locations or the references are rewritten as non-executable conceptual names."}
   ```

3. **The skill README template's own related-resource links do not resolve** -- `.opencode/skills/sk-doc/create-skill/assets/skill/skill_readme_template.md:225` -- The active related-resource section links to `../readme/readme_template.md` and `../../references/skill_creation.md` [SOURCE: `.opencode/skills/sk-doc/create-skill/assets/skill/skill_readme_template.md:225`; SOURCE: `.opencode/skills/sk-doc/create-skill/assets/skill/skill_readme_template.md:226`]. The bounded link check reported both as missing, while neighboring links to `skill_md_template.md`, `skill_reference_template.md`, and `hvr_rules.md` resolved. This violates the requirement that asset back-links and relative path claims resolve on disk.
   - Finding class: matrix/evidence
   - Scope proof: Ran a bounded markdown-link resolver over `README.md`, `references/**/*.md`, and markdown assets; missing placeholder links inside fenced template examples were not promoted, but these two links are in the template file's active `RELATED RESOURCES` section.
   - Affected surface hints: [`assets/skill/skill_readme_template.md`, `README.md route-map`, `references/README.md templates map`]
   - Recommendation: Point the links to the live create-readme template/reference paths if those are intended, or remove them from this template's active related-resource list.
   ```json
   {"type":"claim-adjudication","claim":"skill_readme_template.md active related-resource links are broken","evidenceRefs":["assets/skill/skill_readme_template.md:223-229","link-check output: ../readme/readme_template.md missing","link-check output: ../../references/skill_creation.md missing"],"counterevidenceSought":"Checked whether the missing links were inside fenced generated-template content; lines 225-226 are outside the fenced sample and adjacent active links resolve.","alternativeExplanation":"The links may have been copied from an older layout, but the current create-skill packet no longer contains those paths.","finalSeverity":"P1","confidence":"high","downgradeTrigger":"Downgrade only if the links are moved inside explicit placeholder/example content or target files are restored at those exact relative paths."}
   ```

### P2 Findings

None.

## Traceability Checks

- README route-map resolved against target contents for root-level packet files and major reference/template groups; gross map quality is good at `README.md:20-44`.
- `references/README.md` is a route-map rather than a workflow duplicate: it maps concerns to files at `references/README.md:37-50` and keeps the grouped reference set discoverable.
- Reference docs are genuine overflow in broad shape: `overview.md` carries anatomy/structure detail, `common_pitfalls.md` carries defect examples, `validation_and_packaging.md` carries validation tiers, `examples_and_maintenance.md` carries examples/maintenance, and parent-skill references carry router schema detail.
- Duplication caveat: `creation_workflow.md` intentionally expands the six-step standalone workflow beyond SKILL.md. That is acceptable overflow in principle, but two command/path claims inside it are stale and filed as P1.
- Template validation commands run across encountered README/reference/asset markdown docs; all returned exit 0.
- Bounded markdown link check found 23 missing links total. Most are placeholder/example links inside templates or fenced examples and were ruled out for this iteration; active broken related-resource links in `skill_readme_template.md` were filed as P1.

## Integration Evidence

- `init_skill.py` requires `--path` in argparse [SOURCE: `.opencode/skills/sk-doc/create-skill/scripts/init_skill.py:415`].
- `quick_validate.py` exists in the shared script surface [SOURCE: `.opencode/skills/sk-doc/shared/scripts/quick_validate.py:1`].
- `validate_document.py` checks were run using the shared validator named in the dispatch.

## Edge Cases

- The dispatch asked this LEAF to update `deep-review-findings-registry.json`, but the agent contract marks that file reducer-owned/read-only. This iteration therefore did not modify the registry and records the conflict for the outer workflow reducer.
- Markdown links inside fenced template examples often intentionally use placeholders. Those were counted by the simple resolver but not promoted unless the surrounding line was active package documentation.
- Full fabricated section-claim analysis started but is not exhaustive; iteration 3 should cover remaining section claims and script/flag assertions.

## Confirmed-Clean Surfaces

- All encountered docs validated with `validate_document.py` at the requested types with exit 0.
- `references/README.md` links to its grouped reference files and shared/global references resolve.
- Parent-skill reference links to parent templates and sibling references resolve.

## Ruled Out

- P0 template validation blocker: ruled out because every encountered README/reference/asset markdown validation command exited 0.
- P1 for duplicated SKILL.md workflow in all references: ruled out in broad structure because reference files are concern-split; only stale executable claims were filed.
- P1 for missing links inside fenced placeholder/template examples: ruled out where the link is clearly illustrative rather than an active package back-link.

## Next Focus

- dimension: maintainability
- focus area: remaining fabricated tool/flag/section claims plus asset template fidelity and parent-hub schema consistency
- reason: iteration 2 found stale executable/path claims; the next pass should complete claim fidelity and assess whether template examples remain maintainable after excluding intentional placeholders
- rotation status: rotate from traceability to maintainability while carrying script-claim verification forward
- blocked/productive carry-forward: productive path/link checker; registry update blocked by reducer-owned LEAF boundary
- required evidence: targeted reads of asset templates, script argparse/validator contracts, and section claims that name required headings or external enforcement
