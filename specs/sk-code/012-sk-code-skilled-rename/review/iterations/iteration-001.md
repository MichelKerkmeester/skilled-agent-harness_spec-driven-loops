# Iteration 001 — Correctness

**Mode:** review | **Dimension:** correctness | **Target:** staged rename `sk-code-opencode` → `sk-code-skilled`, `code-opencode` → `code-skilled`, sk-code surface id `OPENCODE` → `SKILLED`.
**Evidence base:** `git diff --cached -M HEAD` (2,917 staged paths, 485 renames) + repo-wide reference sweep + the 278-path scope manifest.

## FILES REVIEWED

- Hub routing set: `.skilled/skills/sk-code/mode-registry.json:19,79,88`; `hub-router.json:7,36-39`; `graph-metadata.json:230-253`; `leaf-manifest.json:139-140`; `description.json:47`; `SKILL.md`; `ROUTER.md`; `README.md`
- Detection contract: `shared/references/stack-detection.md:3,28-30,39,42-43,65-74,103-143`
- Advisor plugin + test: `.opencode/plugins/system-skill-advisor.js:678-710` (`surface = 'SKILLED'` at 705); `system-skill-advisor-plugin.vitest.ts:703`
- Doctor pins + tests: `parent-skill-check.cjs:1159-1163`; `sk-code-setup-check.cjs:59`; `tests/parent-skill-check-invariants.test.cjs:489-514`; `tests/sk-code-setup-check.test.cjs:29,208`
- Bin tests/fixtures: `compiled-route-surface-hint.test.cjs:65-112`; `canary-cases.v1.json:122-254`; compiled-routing activation manifest
- Renamed packet scripts: `router-replay-lib.cjs:495-628`; `verify-router-sync.cjs:33-323`; `run-all-drift-guards.sh:23-31`; `scripts/tests/*`
- Playbook: six `opencode-*.md` → `skilled-*.md` renames; `webflow-detection.md:103`
- Symlink + mirror: `.skilled/changelog/sk-code/code-skilled` → `../../skills/sk-code/sk-code-skilled/changelog`; `.hermes/skills/sk-code-skilled/SKILL.md:3`; `.hermes/skills/sk-code/SKILL.md:45,79,144,178`
- Spec packets: `specs/sk-code/001-sk-code-parent/027-code-skilled-refinement-research/{description,graph-metadata}.json`; `028-code-skilled-refinement-implementation/{description,graph-metadata}.json`
- Residual sweep: `phrase-variants.json:90907`; `011-.../scratch/dispatch-units*.json`; `sk-prompt/z_archive/004-.../findings-registry.json:1219`

## FINDINGS

### P0
None.

### P1
None.

### P2

**R1-P2-001 — Retrieval fixture retains one pre-rename phrase variant** (instance-only)
- File: `.skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/phrase-variants.json:90907`
- Evidence: the staged diff sweeps this fixture (e.g. `037-001-sk-code-opencode-standards-audit` → `037-001-sk-code-skilled-standards-audit`; `sk-code-opencode 1.0.0.0` → `sk-code-skilled 1.0.0.0`), yet the entry keyed `sk code opencode rename impact` still maps to the variant `sk-code-opencode rename impact`.
- Counter-read: the packet's own research metadata still registers the old phrase as a trigger (`specs/sk-code/012-sk-code-skilled-rename/001-rename-impact-research/graph-metadata.json:20`), so this may be a deliberate historical-query alias. No `sk-code-skilled rename impact` sibling exists.
- Impact: fixture hygiene; confirm intent or add the new-name sibling.
- Confidence: medium.

**R1-P2-002 — Three historical records outside the literal machine-record extensions carry the old identity** (instance-only)
- Files: `specs/sk-code/011-sk-code-poinytail-based-refinement/010-round-three-remediation/001-shared-and-hub-docs/scratch/dispatch-units-extra.json:98`, `.../005-opencode-and-guards/scratch/dispatch-units.json:518`, `specs/sk-prompt/z_archive/004-sk-prompt-small-model-optimization/001-smallcode-deep-research/research/findings-registry.json:1219`
- Evidence: all three are historical/scratch records; two were touched by this change and left their old-name strings in place.
- Impact: historical fidelity only; no runtime or routing effect.
- Recommendation: no action if archives are intentionally frozen; otherwise extend the documented exclusion list.
- Confidence: high.

## EXCLUSION AUDIT (criterion 2)

3,734 old-identity hit lines across 254 files: 201 specs machine records (`.jsonl`/`.out`/`.err`) — excluded; 45 this-packet docs — excluded; 4 benchmark JSON reports — excluded; 1 live fixture line → R1-P2-001; 3 historical records → R1-P2-002. No live reference remains in skills, registries, plugin, doctor, tests, fixtures, mirrors, or documentation outside those groups.

## TRACEABILITY CHECKS

| Protocol | Result |
| --- | --- |
| spec_code (core) | pass — `specs/sk-code/012-sk-code-skilled-rename/` describes exactly this rename; phase children 001-003 match the sweep |
| checklist_evidence (core) | partial — `review/scope-files.txt` used as the review manifest |
| skill_agent (overlay) | pass — hub registries/docs carry only the new identity |
| agent_cross_runtime (overlay) | pass — `.hermes` regenerated; `.opencode`/`.skilled` symlinks resolve; `.devin`/`.pi` carry no old-identity strings |
| feature_catalog_code (overlay) | pass — feature-catalog references updated |
| playbook_capability (overlay) | pass — six scenarios renamed and internally consistent |

## VERDICT

P2-only this iteration → PASS per the mapping (no P0/P1). `hasAdvisories=true`.

## NEXT DIMENSION

security — probe the renamed surface's trust boundaries (fixture and registry inputs, plugin surface detection, symlink guard) in iteration 2.
NOTE: an out-of-hub diff scan found 105 files outside the sk-code hub whose staged diff touches the uppercase OPENCODE token; per-file counts show every removal paired with an equal OPENCODE addition (preserved) or an intended sk-code-surface swap (removed_OPENCODE with matching added_SKILLED) - no runtime-context rewrite found (see delta classification row).
Review verdict: PASS
