# Deep Review Iteration 001

## Dispatcher

- Command: `/deep:review:auto`
- Target agent: `deep-review`
- Resolved route: `/deep:review:auto -> .opencode/agents/deep-review.md`
- Agent definition loaded: true
- Mode: `review`
- Review target: `.opencode/skills/sk-doc/create-manual-testing-playbook/`
- Review target type: `skill`
- Focus: traceability — primary workflow contract completeness, overflow separation, path/tool claim fidelity, and validator results
- Budget profile: verify
- Status: complete

## Files Reviewed

- `.opencode/skills/sk-doc/create-manual-testing-playbook/SKILL.md`
- `.opencode/skills/sk-doc/create-manual-testing-playbook/README.md`
- `.opencode/skills/sk-doc/create-manual-testing-playbook/references/README.md`
- `.opencode/skills/sk-doc/create-manual-testing-playbook/references/prompt_voice.md`
- `.opencode/skills/sk-doc/create-manual-testing-playbook/references/common_pitfalls.md`
- `.opencode/skills/sk-doc/create-manual-testing-playbook/references/examples.md`
- `.opencode/skills/sk-doc/create-manual-testing-playbook/assets/testing_playbook/manual_testing_playbook_template.md`
- `.opencode/skills/sk-doc/create-manual-testing-playbook/assets/testing_playbook/manual_testing_playbook_snippet_template.md`
- `.opencode/skills/sk-doc/shared/scripts/`
- `.opencode/skills/sk-doc/shared/references/global/validation.md`
- `.opencode/skills/sk-doc/shared/references/global/core_standards.md`

## Findings - New

### P0 Findings

None.

### P1 Findings

1. **Root template still permits `PARTIAL` verdicts that the workflow forbids** -- `.opencode/skills/sk-doc/create-manual-testing-playbook/assets/testing_playbook/manual_testing_playbook_template.md:244` -- The primary workflow contract limits scenario status to `PASS`, `FAIL`, or `SKIP` with a sandbox blocker and explicitly says not to classify scenarios as `UNAUTOMATABLE` [SOURCE: `.opencode/skills/sk-doc/create-manual-testing-playbook/SKILL.md:187`]. The root scaffold copied by users still generates `PARTIAL` scenario and feature verdict rules [SOURCE: `.opencode/skills/sk-doc/create-manual-testing-playbook/assets/testing_playbook/manual_testing_playbook_template.md:244`; SOURCE: `.opencode/skills/sk-doc/create-manual-testing-playbook/assets/testing_playbook/manual_testing_playbook_template.md:249`], so a generated playbook can violate the workflow's own status contract.
   - Finding class: cross-consumer
   - Scope proof: The contradiction spans the primary `SKILL.md` contract and the copied root scaffold; the workflow directs users to create the root playbook from this template [SOURCE: `.opencode/skills/sk-doc/create-manual-testing-playbook/SKILL.md:158`].
   - Affected surface hints: [`SKILL.md status contract`, `root playbook scaffold`, `generated playbooks`, `release readiness verdicts`]
   - Recommendation: Remove `PARTIAL` from the scaffolded scenario/feature verdict rules or amend the primary workflow to explicitly allow and define it; keep one authoritative status set across SKILL and template.
   - Claim adjudication:
     ```json
     {"type":"traceability/spec-mismatch","claim":"The copied root playbook scaffold allows a verdict state that the primary workflow forbids.","evidenceRefs":[".opencode/skills/sk-doc/create-manual-testing-playbook/SKILL.md:187",".opencode/skills/sk-doc/create-manual-testing-playbook/assets/testing_playbook/manual_testing_playbook_template.md:244",".opencode/skills/sk-doc/create-manual-testing-playbook/assets/testing_playbook/manual_testing_playbook_template.md:249"],"counterevidenceSought":"Checked whether SKILL.md defines PARTIAL elsewhere in the executable workflow; the status list is limited to PASS/FAIL/SKIP and the release gates in SKILL.md do not define PARTIAL.","alternativeExplanation":"The template may be carrying older release-readiness semantics, but it is still the active scaffold linked by the workflow.","finalSeverity":"P1","confidence":0.91,"downgradeTrigger":"Downgrade to P2 only if the orchestrator proves generated playbooks never copy these verdict lines or SKILL.md is amended to allow PARTIAL."}
     ```

2. **Template placeholder markdown links fail the required relative-path resolution check** -- `.opencode/skills/sk-doc/create-manual-testing-playbook/assets/testing_playbook/manual_testing_playbook_template.md:314` -- The scaffold contains literal markdown links with placeholders such as `({CAT1_DIR}/{FEATURE_SLUG}.md)`, `({CAT2_DIR}/{FEATURE_SLUG_2}.md)`, and `../feature_catalog/{CATALOG_PATH_1}` [SOURCE: `.opencode/skills/sk-doc/create-manual-testing-playbook/assets/testing_playbook/manual_testing_playbook_template.md:314`; SOURCE: `.opencode/skills/sk-doc/create-manual-testing-playbook/assets/testing_playbook/manual_testing_playbook_template.md:315`; SOURCE: `.opencode/skills/sk-doc/create-manual-testing-playbook/assets/testing_playbook/manual_testing_playbook_template.md:351`]. A scoped markdown-link resolution pass over the eight target docs reported 6 missing links, all from these placeholder links. This violates the dispatch requirement that every relative path resolve on disk and conflicts with the packet's own warning that cross-file markdown links are CI-guarded [SOURCE: `.opencode/skills/sk-doc/create-manual-testing-playbook/SKILL.md:273`].
   - Finding class: matrix/evidence
   - Scope proof: Scoped link check covered `SKILL.md`, `README.md`, all `references/*.md`, and both asset templates; all missing links came from `manual_testing_playbook_template.md` placeholder markdown links.
   - Affected surface hints: [`root playbook scaffold`, `markdown link guard`, `feature-file links`, `feature-catalog links`]
   - Recommendation: Do not encode unresolved placeholders as markdown links in the source template. Use code spans for placeholders, escaped examples, or real example links that resolve in-repo; generated playbooks can then create concrete markdown links after substitution.
   - Claim adjudication:
     ```json
     {"type":"traceability/link-resolution","claim":"The target packet includes unresolved relative markdown links in its active scaffold asset.","evidenceRefs":[".opencode/skills/sk-doc/create-manual-testing-playbook/assets/testing_playbook/manual_testing_playbook_template.md:314",".opencode/skills/sk-doc/create-manual-testing-playbook/assets/testing_playbook/manual_testing_playbook_template.md:315",".opencode/skills/sk-doc/create-manual-testing-playbook/assets/testing_playbook/manual_testing_playbook_template.md:351","scoped link check: missing_links=6"],"counterevidenceSought":"Checked whether unresolved links were limited to generated-output placeholders. They are inside the checked-in source template and are parsed as markdown links before substitution.","alternativeExplanation":"Placeholders are intentional for users after copying, but source-template markdown still trips any repository-level link resolver that does not special-case placeholder URLs.","finalSeverity":"P1","confidence":0.86,"downgradeTrigger":"Downgrade to P2 if the repository markdown-link guard explicitly ignores brace-placeholder links in checked-in templates."}
     ```

### P2 Findings

1. **Root template duplicates the per-feature scaffold that the packet also ships as a separate template** -- `.opencode/skills/sk-doc/create-manual-testing-playbook/assets/testing_playbook/manual_testing_playbook_template.md:357` -- The primary workflow tells users to create the root from `manual_testing_playbook_template.md` and each per-feature file from `manual_testing_playbook_snippet_template.md` [SOURCE: `.opencode/skills/sk-doc/create-manual-testing-playbook/SKILL.md:158`; SOURCE: `.opencode/skills/sk-doc/create-manual-testing-playbook/SKILL.md:159`]. The root template nevertheless embeds its own full `## 6. PER-FEATURE FILE SCAFFOLD` [SOURCE: `.opencode/skills/sk-doc/create-manual-testing-playbook/assets/testing_playbook/manual_testing_playbook_template.md:357`], while the snippet template is also the canonical per-feature scaffold [SOURCE: `.opencode/skills/sk-doc/create-manual-testing-playbook/assets/testing_playbook/manual_testing_playbook_snippet_template.md:43`]. This is duplicate template truth and increases drift risk.
   - Finding class: class-of-bug
   - Scope proof: The duplicated scaffold appears once in the root template and once in the dedicated snippet template; no other target docs duplicate a full second scaffold.
   - Affected surface hints: [`root scaffold`, `per-feature scaffold`, `template maintenance`]
   - Recommendation: Replace the embedded per-feature scaffold in the root template with a short backlink to `manual_testing_playbook_snippet_template.md`, or explicitly mark one scaffold as non-authoritative and keep field order synchronized.

## Traceability Checks

- Primary workflow completeness: `SKILL.md` contains activation, package shape, authoring sequence, scenario rules, validation/release gates, hard rules, and resource routing [SOURCE: `.opencode/skills/sk-doc/create-manual-testing-playbook/SKILL.md:18`; SOURCE: `.opencode/skills/sk-doc/create-manual-testing-playbook/SKILL.md:65`; SOURCE: `.opencode/skills/sk-doc/create-manual-testing-playbook/SKILL.md:149`; SOURCE: `.opencode/skills/sk-doc/create-manual-testing-playbook/SKILL.md:253`; SOURCE: `.opencode/skills/sk-doc/create-manual-testing-playbook/SKILL.md:290`].
- Overflow separation: `README.md` and `references/README.md` both state the complete workflow lives in `SKILL.md`; reference files are divided into prompt voice, pitfalls, and examples [SOURCE: `.opencode/skills/sk-doc/create-manual-testing-playbook/README.md:27`; SOURCE: `.opencode/skills/sk-doc/create-manual-testing-playbook/references/README.md:17`; SOURCE: `.opencode/skills/sk-doc/create-manual-testing-playbook/references/README.md:35`].
- Tool/flag claims: `validate_document.py --help` verified `--type`, `--json`, `--blocking-only`, `--fix`, `--dry-run`, and `--no-exclude`; `extract_structure.py --help` verified it takes only `filepath`. Shared scripts directory contains `validate_document.py` and `extract_structure.py`.
- Relative-path resolution: all non-placeholder target links resolved; six unresolved links were found in root-template placeholder markdown links and are captured as P1-002.
- Validation: all eight target docs passed with exit code 0; asset templates produced non-blocking numbering warnings only.

## Integration Evidence

- Exact shared scripts inspected: `.opencode/skills/sk-doc/shared/scripts/validate_document.py`, `.opencode/skills/sk-doc/shared/scripts/extract_structure.py` via script directory and `--help` output.
- Exact validation reference inspected: `.opencode/skills/sk-doc/shared/references/global/validation.md` documents validator exit codes and flags [SOURCE: `.opencode/skills/sk-doc/shared/references/global/validation.md:46`].
- Packet-local scripts claim verified: `.opencode/skills/sk-doc/create-manual-testing-playbook/scripts` is absent, matching README claim that no packet-local scripts directory currently exists [SOURCE: `.opencode/skills/sk-doc/create-manual-testing-playbook/README.md:32`].

## Edge Cases

- First-run state files were absent; dispatch explicitly authorized initialization, so config, state log, registry stub, strategy, and iterations directory were initialized under the bound packet root before review.
- Link-resolution script treats brace placeholders in markdown link destinations as literal paths. Severity remains P1 because the dispatch required every relative path to resolve and the packet itself cites CI link-guard coverage.
- Validation warnings in asset templates are non-blocking under `validate_document.py`; they were not escalated this iteration.

## Confirmed-Clean Surfaces

- `SKILL.md`, `README.md`, `references/README.md`, `references/prompt_voice.md`, `references/common_pitfalls.md`, and `references/examples.md` validated with zero issues.
- Shared script names and claimed validator flags are real.
- Reference files are single-concern at the reviewed level: map, prompt voice, pitfalls, and examples.

## Ruled Out

- Fabricated packet-local scripts: ruled out; README says none exist and the directory is absent.
- Missing shared `validate_document.py` or `extract_structure.py`: ruled out by shared scripts directory and help output.
- P0 severity: ruled out; findings are documentation/template fidelity issues without destructive data loss, security exploit, or immediate harm.

## Next Focus

- dimension: maintainability
- focus area: template duplication, drift risk, examples/backlinks, and warning cleanup without retrying the completed link/status contradiction checks
- reason: Iteration 001 found actionable template drift; maintainability should assess whether the packet is cheap and safe to evolve after fixes.
- rotation status: traceability completed; maintainability next; correctness and security remain for later iterations.
- blocked/productive carry-forward: productive — template-vs-contract comparison found concrete issues; blocked — full-loop final report/reducer updates remain outside LEAF ownership.
- required evidence: asset templates, examples reference, README resource map, shared template rules, changelog/backlink surfaces
