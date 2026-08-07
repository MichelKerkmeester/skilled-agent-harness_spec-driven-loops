# Review Iteration 002

## Dispatcher
- target_agent: deep-review
- resolved_route: `/deep:review:auto -> .opencode/agents/deep-review.md`
- agent_definition_loaded: true
- mode: review
- Focus: correctness — command/path runnable examples and documented context for relative paths.
- Budget profile: verify
- Status: complete

## Files Reviewed
- `.opencode/skills/sk-doc/doc-quality/SKILL.md`
- `.opencode/skills/sk-doc/doc-quality/README.md`
- `.opencode/skills/sk-doc/doc-quality/references/README.md`
- `.opencode/skills/sk-doc/doc-quality/references/workflows.md`
- `.opencode/skills/sk-doc/doc-quality/references/workflow_examples.md`
- `.opencode/skills/sk-doc/shared/scripts/extract_structure.py`
- `.opencode/skills/sk-doc/shared/scripts/quick_validate.py`
- `.opencode/skills/sk-doc/shared/scripts/validate_document.py`

## Findings - New

### P0 Findings
None.

### P1 Findings
1. **Worked shell examples use a `../shared` path from a directory where that path does not exist** -- `.opencode/skills/sk-doc/doc-quality/references/workflow_examples.md:33` -- The first worked example creates and changes into `.opencode/skills/my-skill` [SOURCE: `.opencode/skills/sk-doc/doc-quality/references/workflow_examples.md:30`-`.opencode/skills/sk-doc/doc-quality/references/workflow_examples.md:35`], then runs `../shared/scripts/quick_validate.py` and `../shared/scripts/extract_structure.py` [SOURCE: `.opencode/skills/sk-doc/doc-quality/references/workflow_examples.md:36`-`.opencode/skills/sk-doc/doc-quality/references/workflow_examples.md:42`]. From that shown cwd, `../shared/scripts` resolves to `.opencode/skills/shared/scripts`, but the packet's shared backbone is documented under the `sk-doc` hub as `../shared` from `doc-quality` [SOURCE: `.opencode/skills/sk-doc/doc-quality/README.md:76`-`.opencode/skills/sk-doc/doc-quality/README.md:80`], not under arbitrary top-level skills. The same reference also gives batch examples from an unspecified workspace context while invoking `../shared/scripts/...` [SOURCE: `.opencode/skills/sk-doc/doc-quality/references/workflow_examples.md:75`-`.opencode/skills/sk-doc/doc-quality/references/workflow_examples.md:89`], so copy-paste use can fail before validation starts.
   - Finding class: class-of-bug
   - Scope proof: Checked all command-example surfaces in `workflow_examples.md` and the packet README's documented shared-backbone context; the invalid context-sensitive `../shared` pattern appears in the worked shell recipes, while script interfaces themselves are real.
   - Affected surface hints: [`references/workflow_examples.md`, `../shared/scripts/*` examples, `doc-quality README context`, `quick_validate.py`, `extract_structure.py`]
   - Recommendation: Rewrite shell examples to use paths that resolve from the documented context, e.g. run from `.opencode/skills/sk-doc/doc-quality` against explicit target paths, or invoke `.opencode/skills/sk-doc/shared/scripts/...` from workspace root. Add a one-line "Run from ..." preface to every copy-paste block.
   - Claim adjudication: {"type":"correctness","claim":"The worked shell examples are not runnable from their own demonstrated working directory because `../shared/scripts` points outside the real sk-doc shared directory.","evidenceRefs":[".opencode/skills/sk-doc/doc-quality/references/workflow_examples.md:30-42",".opencode/skills/sk-doc/doc-quality/references/workflow_examples.md:75-89",".opencode/skills/sk-doc/doc-quality/README.md:76-80"],"counterevidenceSought":"Checked script interfaces in shared/scripts and the packet README context; the scripts exist under sk-doc/shared, but not at the path implied after `cd .opencode/skills/my-skill`.","alternativeExplanation":"The examples may be inherited from a different skill layout, but current doc-quality readers receive them as copy-paste recipes.","finalSeverity":"P1","confidence":"high","downgradeTrigger":"Downgrade if examples add an explicit cwd that makes each relative path resolve, or switch to workspace-root paths."}

### P2 Findings
None.

## Traceability Checks
- Confirmed `extract_structure.py` accepts only a positional filepath and prints JSON, matching the core `SKILL.md` flag guidance.
- Confirmed `quick_validate.py` accepts a skill directory and `--json`, matching the batch-example flag claim.
- Confirmed markdown links in the target docs resolve from their containing files; no broken markdown links were found in this iteration's link scan.
- Re-ran document validation across the primary target markdown set; validation results match iteration 001, including the existing changelog reference-gate failure.

## Integration Evidence
- Script interface: `.opencode/skills/sk-doc/shared/scripts/extract_structure.py`
- Script interface: `.opencode/skills/sk-doc/shared/scripts/quick_validate.py`
- Validation gate: `.opencode/skills/sk-doc/shared/scripts/validate_document.py`

## Edge Cases
- The runnable-example finding overlaps iteration 001's no-creation-boundary finding but is distinct: even if creation content were allowed, the shown `../shared` command path is still wrong from the demonstrated cwd.
- Stop policy remains max-iterations; convergence is telemetry only before iteration 4.

## Confirmed-Clean Surfaces
- No broken markdown links were detected among `SKILL.md`, `README.md`, and `references/*.md` using file-relative link resolution.
- `SKILL.md` correctly states that extractor flags are not available and validation flags belong to `validate_document.py`.

## Ruled Out
- No new P0 correctness issue: invalid examples block reliable use but do not directly cause destructive behavior or security exposure.
- No fabricated `quick_validate.py --json` claim: the parser defines `--json`.

## Next Focus
- dimension: maintainability
- focus area: reference overflow single-concern boundaries, duplication after dissection, and stale legacy content
- reason: Iterations 001-002 found legacy/reference drift; next pass should check maintainability of the dissection and whether references remain single-concern overflow.
- rotation status: next dimension after correctness
- blocked/productive carry-forward: Productive carry-forward from reference-route and command-example issues; avoid re-reporting the same no-creation and `../shared` path findings unless new evidence expands scope.
- required evidence: compare reference bodies against `SKILL.md`, README route map, and each sibling reference for duplicated or misplaced content.
