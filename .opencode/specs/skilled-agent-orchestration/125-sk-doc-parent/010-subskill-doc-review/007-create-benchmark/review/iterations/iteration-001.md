# Deep Review Iteration 001

## Dispatcher

- Target: `.opencode/skills/sk-doc/create-benchmark/`
- Spec folder: `.opencode/specs/skilled-agent-orchestration/125-sk-doc-parent/010-subskill-doc-review/007-create-benchmark`
- Mode: `review`
- Target agent: `deep-review`
- Resolved route: `/deep:review:auto -> .opencode/agents/deep-review.md`
- Agent definition loaded: `true`
- Lifecycle: `restart`
- Budget profile: `scan`
- Focus dimension: `traceability`
- Focus area: template fidelity, reference overflow boundaries, relative-path/tool-claim verification

## Files Reviewed

- `.opencode/skills/sk-doc/create-benchmark/SKILL.md`
- `.opencode/skills/sk-doc/create-benchmark/README.md`
- `.opencode/skills/sk-doc/create-benchmark/references/README.md`
- `.opencode/skills/sk-doc/create-benchmark/references/case_studies.md`
- `.opencode/skills/sk-doc/create-benchmark/references/pitfalls.md`
- `.opencode/skills/sk-doc/create-benchmark/references/worked_example.md`
- `.opencode/skills/sk-doc/create-benchmark/assets/benchmark/benchmark_report_template.md`
- `.opencode/skills/sk-doc/create-benchmark/assets/benchmark/source_template.md`
- `.opencode/skills/sk-doc/shared/scripts/validate_document.py` via `--help` and validation executions

## Findings - New

### P0 Findings

None.

### P1 Findings

1. **Report-shape references claim anchors and a Section 1 title the actual contract/template do not provide** -- `.opencode/skills/sk-doc/create-benchmark/references/worked_example.md:45` and `.opencode/skills/sk-doc/create-benchmark/references/worked_example.md:94` -- The authoritative report contract says Section 1 is `HEADLINE / OVERVIEW` [SOURCE: `.opencode/skills/sk-doc/create-benchmark/SKILL.md:155`], and the fillable template implements `## 1. HEADLINE / OVERVIEW` [SOURCE: `.opencode/skills/sk-doc/create-benchmark/assets/benchmark/benchmark_report_template.md:37`]. The worked example instead teaches `## 1. HEADLINE` [SOURCE: `.opencode/skills/sk-doc/create-benchmark/references/worked_example.md:45`] and claims later sections use `ANCHOR comment pairs` [SOURCE: `.opencode/skills/sk-doc/create-benchmark/references/worked_example.md:94`], while the template only instructs authors to keep anchor pairs [SOURCE: `.opencode/skills/sk-doc/create-benchmark/assets/benchmark/benchmark_report_template.md:22`] and contains no actual anchor-pair syntax in the checked template. This violates the no-fabricated-section-claims/template-fidelity requirement because reference overflow now teaches details that are not true of the primary workflow contract and asset.
   - Finding class: matrix/evidence
   - Scope proof: `grep` over the target packet found the authoritative heading at `SKILL.md:155`, the implemented heading at `benchmark_report_template.md:37`, and the contradictory reference claims at `worked_example.md:45` and `worked_example.md:94`; no matching anchor-pair syntax was present in the template evidence read.
   - Affected surface hints: [`worked_example.md`, `benchmark_report_template.md`, `benchmark_report.md authoring contract`]
   - Recommendation: Align the worked example with `HEADLINE / OVERVIEW` and either add real anchor-pair placeholders to the template or remove anchor-pair claims from both the template comment and worked example.
   - Claim adjudication:
     ```json
     {
       "type": "gate-relevant-p1",
       "claim": "Reference overflow teaches report structure details that contradict or exceed the authoritative SKILL/template contract.",
       "evidenceRefs": [
         ".opencode/skills/sk-doc/create-benchmark/SKILL.md:155",
         ".opencode/skills/sk-doc/create-benchmark/assets/benchmark/benchmark_report_template.md:37",
         ".opencode/skills/sk-doc/create-benchmark/assets/benchmark/benchmark_report_template.md:22",
         ".opencode/skills/sk-doc/create-benchmark/references/worked_example.md:45",
         ".opencode/skills/sk-doc/create-benchmark/references/worked_example.md:94"
       ],
       "counterevidenceSought": "Checked whether the template actually contains anchor-pair syntax and whether the SKILL contract uses the shorter HEADLINE section title; the evidence did not support the reference wording.",
       "alternativeExplanation": "The reference may be describing a desired future template shape, but this review is against the checked-in packet and real asset.",
       "finalSeverity": "P1",
       "confidence": 0.86,
       "downgradeTrigger": "Downgrade to P2 only if maintainers explicitly classify anchor-pair wording as aspirational non-contract prose and update the route-map to say the worked example is intentionally abbreviated."
     }
     ```

### P2 Findings

1. **Template-local markdown links do not resolve in the checked asset location** -- `.opencode/skills/sk-doc/create-benchmark/assets/benchmark/benchmark_report_template.md:322` -- The template includes active markdown links such as `./SOURCE.md`, `./results.csv`, `./per-probe.jsonl`, `./runtime-measurements.md`, and `../README.md` [SOURCE: `.opencode/skills/sk-doc/create-benchmark/assets/benchmark/benchmark_report_template.md:322`; SOURCE: `.opencode/skills/sk-doc/create-benchmark/assets/benchmark/benchmark_report_template.md:326`]. A packet-local link check reported nine missing relative targets from this asset file. These links are likely meant to resolve after copying the template into a benchmark folder, but they fail the review requirement that every relative path in the reviewed docs resolves on disk when inspected in place.
   - Finding class: instance-only
   - Scope proof: A packet-local markdown-link scan checked 9 markdown files and found missing relative targets only in `assets/benchmark/benchmark_report_template.md`.
   - Affected surface hints: [`benchmark_report_template.md`, `asset back-links`, `generated benchmark_report.md links`]
   - Recommendation: Make copy-time links visibly templated/non-clickable in the source asset or add a nearby note that these relative links intentionally resolve only after the file is copied to `mcp_server/benchmarks/benchmark-<YYYY-MM-DD>/`; if the packet requires source-location path validity, replace them with resolvable references to the template assets and spell out the generated output paths separately.

## Traceability Checks

- SKILL completeness: The primary numbered workflow is present and self-sufficient across promotion gate, target shape, authoring workflow, report contract, naming, authority/gates, and success criteria [SOURCE: `.opencode/skills/sk-doc/create-benchmark/SKILL.md:117`; SOURCE: `.opencode/skills/sk-doc/create-benchmark/SKILL.md:268`].
- Reference overflow: References are mostly genuine overflow: route-map, case studies, pitfalls, and worked example [SOURCE: `.opencode/skills/sk-doc/create-benchmark/references/README.md:31`]. The active P1 is limited to contradictory report-shape claims.
- Tool/flag claims: `validate_document.py <file> --type ...` and `validate_document.py --type ... <file>` both execute successfully; `--help` confirms `--type`, `--json`, `--blocking-only`, `--fix`, `--dry-run`, and `--no-exclude` are real flags.
- Validation gate: All reviewed docs returned exit 0 with no blocking issues. `worked_example.md` returned two warnings for non-sequential numbering, but no blocking issue.

## Integration Evidence

- Shared validator surface: `.opencode/skills/sk-doc/shared/scripts/validate_document.py`
- Command executions:
  - `python3 .opencode/skills/sk-doc/shared/scripts/validate_document.py .opencode/skills/sk-doc/create-benchmark/SKILL.md --type skill` -> valid, 0 issues.
  - `python3 .opencode/skills/sk-doc/shared/scripts/validate_document.py .opencode/skills/sk-doc/create-benchmark/README.md --type readme` -> valid, 0 issues.
  - `python3 .opencode/skills/sk-doc/shared/scripts/validate_document.py .opencode/skills/sk-doc/create-benchmark/references/README.md --type readme` -> valid, 0 issues.
  - `python3 .opencode/skills/sk-doc/shared/scripts/validate_document.py .opencode/skills/sk-doc/create-benchmark/references/case_studies.md --type reference` -> valid, 0 issues.
  - `python3 .opencode/skills/sk-doc/shared/scripts/validate_document.py .opencode/skills/sk-doc/create-benchmark/references/pitfalls.md --type reference` -> valid, 0 issues.
  - `python3 .opencode/skills/sk-doc/shared/scripts/validate_document.py .opencode/skills/sk-doc/create-benchmark/references/worked_example.md --type reference` -> valid, 2 warnings, 0 blocking.
  - `python3 .opencode/skills/sk-doc/shared/scripts/validate_document.py .opencode/skills/sk-doc/create-benchmark/assets/benchmark/benchmark_report_template.md --type reference` -> valid, 0 issues.
  - `python3 .opencode/skills/sk-doc/shared/scripts/validate_document.py .opencode/skills/sk-doc/create-benchmark/assets/benchmark/source_template.md --type reference` -> valid, 0 issues.
  - `python3 .opencode/skills/sk-doc/shared/scripts/validate_document.py --help` -> confirmed advertised flags.

## Edge Cases

- Fresh packet state was uninitialized. This leaf initialized only leaf-owned artifacts for iteration 001; reducer-owned files remain outside the leaf write boundary.
- The user requested iterations 1 through 4 and synthesis, but this agent contract is LEAF-only and permits one iteration per execution. No nested dispatch was performed.
- Template-source links may be intended to resolve only after copying into a generated benchmark folder; this kept the broken-link item at P2.
- `worked_example.md` validation warnings are non-blocking and were not elevated by themselves.

## Confirmed-Clean Surfaces

- All applicable documentation validation commands completed with exit 0 and 0 blocking issues.
- `SKILL.md` contains a complete primary workflow and does not rely on references for the numbered workflow steps.
- Shared validator flag claims are real according to command execution and help output.

## Ruled Out

- No P0 security or destructive-data concern was found in this documentation-only traceability pass.
- No fabricated `validate_document.py --type` flag claim was found.
- No packet-local `scripts/` directory claim conflict was found; README says no packet-local scripts exist.

## Next Focus

- dimension: maintainability
- focus area: reference duplication and overflow granularity across README, route-map, case studies, pitfalls, and worked example
- reason: traceability found one template-fidelity contradiction; next pass should test whether references duplicate the SKILL workflow or stay single-concern.
- rotation status: traceability complete; maintainability next
- blocked/productive carry-forward: Productive carry-forward from path/tool/section-claim matrix; avoid rechecking validator flag claims unless new evidence appears.
- required evidence: direct reads of reference files against `SKILL.md` sections 1-7 plus duplicate-content sampling.
