# Deep Review Iteration 003

## Dispatcher

- target_agent: deep-review
- resolved_route: /deep:review:auto
- agent_definition_loaded: true
- mode: review
- Target: `.opencode/skills/sk-doc/create-feature-catalog`
- Spec folder: `.opencode/specs/skilled-agent-orchestration/125-sk-doc-parent/010-subskill-doc-review/005-create-feature-catalog`
- Focus: correctness — command/tool/flag/section claims and package-shape correctness against actual files
- Budget profile: verify

## Files Reviewed

- `.opencode/skills/sk-doc/create-feature-catalog/SKILL.md`
- `.opencode/skills/sk-doc/create-feature-catalog/README.md`
- `.opencode/skills/sk-doc/create-feature-catalog/references/README.md`
- `.opencode/skills/sk-doc/create-feature-catalog/references/common_pitfalls.md`
- `.opencode/skills/sk-doc/create-feature-catalog/references/examples.md`
- `.opencode/skills/sk-doc/create-feature-catalog/assets/feature_catalog/feature_catalog_template.md`
- `.opencode/skills/sk-doc/create-feature-catalog/assets/feature_catalog/feature_catalog_snippet_template.md`
- `.opencode/skills/sk-doc/create-feature-catalog/changelog/v1.0.0.0.md`
- `.opencode/commands/create/feature-catalog.md` as named command integration evidence only
- `.github/workflows/markdown-link-integrity.yml` as named CI integration evidence only

## Findings - New

### P0 Findings

None.

### P1 Findings

None new.

### P2 Findings

None new.

## Findings - Existing Refined

### P0 Findings

None.

### P1 Findings

1. **Changelog fails the required documentation validator** -- `.opencode/skills/sk-doc/create-feature-catalog/changelog/v1.0.0.0.md:6` -- Rechecked for iteration 003. The target docs still validate cleanly except the changelog, whose `--type reference` run still reports the blocking `missing_required_section` / `overview` error. [SOURCE: `.opencode/skills/sk-doc/create-feature-catalog/changelog/v1.0.0.0.md:6`]
   - Finding class: instance-only
   - Scope proof: The validator matrix rerun again returned 0 blocking issues for `SKILL.md`, packet README, reference README, examples, pitfalls, and asset templates; only `changelog/v1.0.0.0.md` blocks.
   - Affected surface hints: [`changelog/v1.0.0.0.md`, `validate_document.py --type reference`, `release-note documentation`]
   - Recommendation: Add a `## 1. OVERVIEW` section or equivalent heading containing `overview`, then rerun `validate_document.py --type reference`.
   ```json
   {"type":"gate-relevant-P1","claim":"The changelog still blocks the required 0-blocking validation gate.","evidenceRefs":[".opencode/skills/sk-doc/create-feature-catalog/changelog/v1.0.0.0.md:6","validator output: missing_required_section overview"],"counterevidenceSought":"Reran the same validator matrix across all target markdown docs; no other target doc produced a blocking issue.","alternativeExplanation":"A release changelog might be excluded by a narrower validation policy, but this review target includes all target docs and the required command explicitly fails on this file.","finalSeverity":"P1","confidence":"high","downgradeTrigger":"Downgrade only if the review contract excludes changelog docs from the validation matrix."}
   ```

2. **Changelog lists a reference file that does not exist after dissection** -- `.opencode/skills/sk-doc/create-feature-catalog/changelog/v1.0.0.0.md:13` -- Rechecked for iteration 003. The package reference directory contains `README.md`, `examples.md`, and `common_pitfalls.md`; the changelog still claims `references/feature_catalog_creation.md` is included. [SOURCE: `.opencode/skills/sk-doc/create-feature-catalog/changelog/v1.0.0.0.md:13`]
   - Finding class: instance-only
   - Scope proof: Direct directory evidence shows the reference set has only `README.md`, `examples.md`, and `common_pitfalls.md`; `references/README.md` routes to those live files.
   - Affected surface hints: [`changelog/v1.0.0.0.md`, `references/README.md`, `reference route-map`]
   - Recommendation: Replace the stale changelog bullet with the actual dissected reference set or remove it from the included-file list.
   ```json
   {"type":"gate-relevant-P1","claim":"The changelog still contains a stale/nonexistent relative file claim.","evidenceRefs":[".opencode/skills/sk-doc/create-feature-catalog/changelog/v1.0.0.0.md:13","directory evidence: references contains README.md, examples.md, common_pitfalls.md"],"counterevidenceSought":"Read the current references directory and route-map again; no feature_catalog_creation.md exists or is routed.","alternativeExplanation":"The line may be stale release-history prose, but it is written as a present included-file list and remains under the reviewed packet.","finalSeverity":"P1","confidence":"high","downgradeTrigger":"Downgrade if changelog historical entries are intentionally exempt from current path-resolution claims."}
   ```

### P2 Findings

1. **Root catalog template still embeds the full per-feature scaffold despite a dedicated snippet template** -- `.opencode/skills/sk-doc/create-feature-catalog/assets/feature_catalog/feature_catalog_template.md:170` -- Rechecked. The duplication remains active: `SKILL.md` assigns root and per-feature scaffolds to separate asset files, while the root template still carries a full per-feature scaffold that duplicates `feature_catalog_snippet_template.md`.
   - Finding class: cross-consumer
   - Scope proof: `SKILL.md` lines 105-106 separates the resource contract; the root template and snippet template both publish per-feature scaffolds.
   - Affected surface hints: [`feature_catalog_template.md`, `feature_catalog_snippet_template.md`, `SKILL.md resource contract`, `references/README.md route-map`]
   - Recommendation: Keep the full per-feature scaffold only in `feature_catalog_snippet_template.md`; replace the root-template copy with a pointer.

## Traceability Checks

- `/create:feature-catalog` is backed by `.opencode/commands/create/feature-catalog.md`, and the command router names `:auto` / `:confirm` modes and workflow assets.
- `validate_document.py` and `extract_structure.py` exist under `.opencode/skills/sk-doc/shared/scripts/`, matching the SKILL validation examples.
- The packet correctly has no local `scripts/` directory and no packet-local `graph-metadata.json`.
- The CI link-check claim is supported by `.github/workflows/markdown-link-integrity.yml`, which calls `.opencode/skills/system-spec-kit/scripts/check-markdown-links.cjs` for skills/commands/agents changes.

## Integration Evidence

- Command router: `.opencode/commands/create/feature-catalog.md`.
- Validator scripts: `.opencode/skills/sk-doc/shared/scripts/validate_document.py` and `extract_structure.py`.
- Markdown link CI guard: `.github/workflows/markdown-link-integrity.yml` and `.opencode/skills/system-spec-kit/scripts/check-markdown-links.cjs`.

## Edge Cases

- The CI workflow skips if the guard file is missing, but the guard exists in this checkout, so the SKILL's CI-guard claim is sufficiently supported.
- The validator warnings in asset templates remain non-blocking; they support the P2 duplication/scaffold concern but do not become P1 validation failures.
- No target files were changed, so the existing findings remain active rather than resolved.

## Confirmed-Clean Surfaces

- Command claim `/create:feature-catalog` resolves to a real command router.
- Shared validator and structure extractor paths resolve.
- Packet boundary claims are accurate: the target packet has `SKILL.md`, `README.md`, `references/`, `assets/`, and `changelog/`, with no local `scripts/` or `graph-metadata.json`.
- No fabricated command, mode, validator-script, or CI link-check tool claim was found beyond the already-filed changelog stale reference.

## Ruled Out

- No P0 issue found.
- No new P1 was filed for command/validator/CI claims because each checked integration surface resolved.
- No new P2 was filed for validator warnings because they arise from fenced scaffold examples and the active maintainability problem is already captured by P2-001.

## Next Focus

- dimension: security
- focus area: trust-boundary and safety wording in the documentation workflow, especially validation limits, source-anchor honesty, roadmap/current-state separation, and generated-file boundaries
- reason: correctness did not add new findings; final max-iteration pass should cover baseline security/reliability risks before synthesis.
- rotation status: continue to iteration 004 under max-iterations policy
- blocked/productive carry-forward: carry active P1s and P2; revalidate changelog once more only if needed for final state.
- required evidence: targeted reads of safety/trust-boundary rules plus validation output status
