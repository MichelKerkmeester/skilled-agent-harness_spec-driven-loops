# Review Iteration 001

## Dispatcher
- target_agent: deep-review
- resolved_route: `/deep:review:auto -> .opencode/agents/deep-review.md`
- agent_definition_loaded: true
- mode: review
- Focus: traceability — SKILL.md contract, reference route-map, validation/template fidelity, and relative-path claims.
- Budget profile: verify
- Status: complete

## Files Reviewed
- `.opencode/skills/sk-doc/doc-quality/SKILL.md`
- `.opencode/skills/sk-doc/doc-quality/README.md`
- `.opencode/skills/sk-doc/doc-quality/references/README.md`
- `.opencode/skills/sk-doc/doc-quality/references/workflows.md`
- `.opencode/skills/sk-doc/doc-quality/references/validation_and_enforcement.md`
- `.opencode/skills/sk-doc/doc-quality/references/workflow_examples.md`
- `.opencode/skills/sk-doc/doc-quality/references/optimization.md`
- `.opencode/skills/sk-doc/doc-quality/references/transformation_patterns.md`
- `.opencode/skills/sk-doc/doc-quality/changelog/v1.0.0.0.md`
- `.opencode/skills/sk-doc/shared/scripts/validate_document.py`
- `.opencode/skills/sk-doc/shared/scripts/extract_structure.py`
- `.opencode/skills/sk-doc/shared/assets/template_rules.json`

## Findings - New

### P0 Findings
None.

### P1 Findings
1. **Reference mode names diverge from the authoritative workflow contract** -- `.opencode/skills/sk-doc/doc-quality/references/workflows.md:51` -- `SKILL.md` defines the four execution modes as `Report-only audit`, `Structure validation`, `Content optimization`, and `Batch snapshot` [SOURCE: `.opencode/skills/sk-doc/doc-quality/SKILL.md:61`-`.opencode/skills/sk-doc/doc-quality/SKILL.md:65`], but the externally cited workflows reference replaces them with `Script-assisted review`, `Structure checks`, `Content optimization`, and `Audit snapshot` [SOURCE: `.opencode/skills/sk-doc/doc-quality/references/workflows.md:51`-`.opencode/skills/sk-doc/doc-quality/references/workflows.md:57`]. Because `references/README.md` presents this file as the execution-mode entry point [SOURCE: `.opencode/skills/sk-doc/doc-quality/references/README.md:31`], users can leave the primary contract with a different mode taxonomy.
   - Finding class: cross-consumer
   - Scope proof: Reviewed `SKILL.md`, `references/README.md`, and `references/workflows.md`; the mismatch appears where the route-map points users for execution-mode detail.
   - Affected surface hints: [`SKILL.md`, `references/README.md`, `references/workflows.md`, `/doc:quality mode selection`]
   - Recommendation: Rename the reference table rows to the exact four `SKILL.md` mode names, or explicitly map aliases to canonical names without replacing the contract vocabulary.
   - Claim adjudication: {"type":"traceability","claim":"The execution-mode reference conflicts with the authoritative SKILL.md mode taxonomy.","evidenceRefs":[".opencode/skills/sk-doc/doc-quality/SKILL.md:61-65",".opencode/skills/sk-doc/doc-quality/references/workflows.md:51-57",".opencode/skills/sk-doc/doc-quality/references/README.md:31"],"counterevidenceSought":"Checked whether workflows.md declared these as aliases to the SKILL modes; it does not.","alternativeExplanation":"The names may be legacy labels from the pre-dissection reference, but the current route map presents them as the active four modes.","finalSeverity":"P1","confidence":"high","downgradeTrigger":"Downgrade only if the reference adds an explicit alias table that preserves the SKILL.md canonical names."}

2. **Worked example routes new skill creation through doc-quality despite the packet's no-creation boundary** -- `.opencode/skills/sk-doc/doc-quality/references/workflow_examples.md:30` -- The primary contract says to skip this workflow when the user wants a brand-new artifact [SOURCE: `.opencode/skills/sk-doc/doc-quality/SKILL.md:31`-`.opencode/skills/sk-doc/doc-quality/SKILL.md:34`] and never create a new artifact from this packet [SOURCE: `.opencode/skills/sk-doc/doc-quality/SKILL.md:322`-`.opencode/skills/sk-doc/doc-quality/SKILL.md:324`]. The worked examples nevertheless start with `Example 1: New SKILL Creation`, `mkdir .opencode/skills/my-skill`, and writing an initial `SKILL.md` [SOURCE: `.opencode/skills/sk-doc/doc-quality/references/workflow_examples.md:30`-`.opencode/skills/sk-doc/doc-quality/references/workflow_examples.md:41`].
   - Finding class: cross-consumer
   - Scope proof: Reviewed the primary contract's WHEN NOT/NEVER sections and the only worked-example reference; the contradictory creation recipe is inside the doc-quality packet.
   - Affected surface hints: [`references/workflow_examples.md`, `SKILL.md no-creation rule`, `sk-doc creation packet routing`]
   - Recommendation: Remove the new-skill creation recipe or rewrite it as "audit an existing SKILL.md"; route creation examples to `create-skill` instead.
   - Claim adjudication: {"type":"traceability","claim":"The reference examples contradict the workflow boundary by teaching artifact creation inside doc-quality.","evidenceRefs":[".opencode/skills/sk-doc/doc-quality/SKILL.md:31-34",".opencode/skills/sk-doc/doc-quality/SKILL.md:322-324",".opencode/skills/sk-doc/doc-quality/references/workflow_examples.md:30-41"],"counterevidenceSought":"Checked whether the example is framed as out-of-scope or create-skill-only; it is presented as a common doc-quality workflow example.","alternativeExplanation":"It may be legacy overflow from pre-dissection documentation, but current readers see it as packet-local guidance.","finalSeverity":"P1","confidence":"high","downgradeTrigger":"Downgrade if the example is removed, moved, or clearly marked as a create-skill external example that doc-quality must not execute."}

3. **Changelog document fails the required validation goal under the requested reference gate** -- `.opencode/skills/sk-doc/doc-quality/changelog/v1.0.0.0.md:6` -- The review command `python3 .opencode/skills/sk-doc/shared/scripts/validate_document.py .opencode/skills/sk-doc/doc-quality/changelog/v1.0.0.0.md --type reference` returned one blocking `missing_required_section` error for `overview`. The reference validation rules require an `overview` section [SOURCE: `.opencode/skills/sk-doc/shared/assets/template_rules.json:252`-`.opencode/skills/sk-doc/shared/assets/template_rules.json:256`], while the changelog jumps from the title to `What's Included` without an overview section [SOURCE: `.opencode/skills/sk-doc/doc-quality/changelog/v1.0.0.0.md:6`-`.opencode/skills/sk-doc/doc-quality/changelog/v1.0.0.0.md:17`].
   - Finding class: instance-only
   - Scope proof: Ran `validate_document.py` across every markdown file under the target; only `changelog/v1.0.0.0.md` returned a blocking validation issue.
   - Affected surface hints: [`changelog/v1.0.0.0.md`, `validate_document.py --type reference`, `template_rules reference requiredSections`]
   - Recommendation: Either validate changelog files with the validator's dedicated `--type changelog` contract, or add a `## Overview` section so this file passes the required reference gate used in this review.
   - Claim adjudication: {"type":"traceability","claim":"The changelog does not meet the review's 0-blocking validation goal when checked as a reference document.","evidenceRefs":["validator output for changelog/v1.0.0.0.md --type reference",".opencode/skills/sk-doc/shared/assets/template_rules.json:252-256",".opencode/skills/sk-doc/doc-quality/changelog/v1.0.0.0.md:6-17"],"counterevidenceSought":"Checked the validator script and template rules; reference validation does require overview, and validate_document.py also supports a separate changelog type.","alternativeExplanation":"The file may be intended for changelog validation rather than reference validation, but the dispatch explicitly limited validation types to skill/readme/reference.","finalSeverity":"P1","confidence":"medium-high","downgradeTrigger":"Downgrade if changelog files are explicitly declared out of scope for this packet review or are validated under `--type changelog` with a passing result."}

### P2 Findings
1. **Optimization reference claims SKILL.md lists impact/effort for patterns, but SKILL.md only lists names** -- `.opencode/skills/sk-doc/doc-quality/references/optimization.md:89` -- The optimization reference says `SKILL.md §3 Step 3 lists all 16 by name and impact/effort` [SOURCE: `.opencode/skills/sk-doc/doc-quality/references/optimization.md:87`-`.opencode/skills/sk-doc/doc-quality/references/optimization.md:90`], while the primary contract lists the 16 pattern names only [SOURCE: `.opencode/skills/sk-doc/doc-quality/SKILL.md:189`-`.opencode/skills/sk-doc/doc-quality/SKILL.md:207`].
   - Finding class: instance-only
   - Scope proof: Compared the optimization reference claim against the cited SKILL.md section and the transformation catalog, where impact/effort actually appears.
   - Affected surface hints: [`references/optimization.md`, `SKILL.md §3`, `references/transformation_patterns.md`]
   - Recommendation: Change the sentence to say SKILL.md lists pattern names, and the pattern catalog provides impact/effort plus before/after examples.

## Traceability Checks
- `SKILL.md` was treated as the primary workflow contract.
- `references/README.md` was checked as the route map.
- Single-concern reference files were checked for overflow boundaries and stale duplication.
- Relative path and command claims were spot-checked against the shared script locations and template rules.
- Validation was run for all markdown docs under the target with the requested `skill|readme|reference` types.

## Integration Evidence
- Validation tool: `.opencode/skills/sk-doc/shared/scripts/validate_document.py`
- Template rules: `.opencode/skills/sk-doc/shared/assets/template_rules.json`
- Shared extractor: `.opencode/skills/sk-doc/shared/scripts/extract_structure.py`

## Edge Cases
- Changelog validation is ambiguous because `validate_document.py` supports `--type changelog`, but the dispatch requested only `skill|readme|reference`; the finding uses the requested validation type and records the downgrade trigger.
- Stop policy requires max-iterations, but this LEAF execution completed one iteration and preserved next focus for dispatcher continuation.

## Confirmed-Clean Surfaces
- `SKILL.md`, packet README, references README, workflows, validation/enforcement, workflow examples, optimization, and transformation catalog all returned 0 blocking validator issues under their assigned types.
- `extract_structure.py` and `validate_document.py` flag claims in `SKILL.md` matched the script interfaces inspected in this iteration.

## Ruled Out
- No P0 route-integrity issue in the primary `SKILL.md`; the primary contract itself clearly says report-only by default and no new artifact creation.
- No fabricated `validate_document.py --type` claim found in `SKILL.md`; the script supports the listed types.

## Next Focus
- dimension: correctness
- focus area: command/path runnable examples and documented context for relative paths
- reason: Traceability found reference-contract drift; next pass should verify command examples and relative path execution contexts more deeply.
- rotation status: next dimension after traceability
- blocked/productive carry-forward: Productive carry-forward from reference overflow and command evidence.
- required evidence: inspect code blocks and markdown links in `references/*.md`, confirm shared script invocation context, and check command examples against actual directories.
