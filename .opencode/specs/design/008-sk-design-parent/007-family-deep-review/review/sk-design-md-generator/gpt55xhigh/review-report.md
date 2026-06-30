# Deep Review Report: sk-design-md-generator

## Executive Summary

Verdict: **CONDITIONAL**

Release-readiness state: `in-progress`

Stop reason: `maxIterationsReached`

Scope: `.opencode/skills/sk-design-md-generator` skill package, including `SKILL.md`, references/assets, backend scripts, feature catalog, manual testing playbook, changelog, graph metadata, and agent/command entrypoint searches.

Active findings: P0=0, P1=3, P2=1. `hasAdvisories=true`.

The reviewed implementation does not show an active P0 or confirmed security issue, but three P1 traceability/correctness findings make the skill release-readiness conditional. The strongest issue is that multiple first-run command examples are not executable from their documented backend working directory because the extractor rejects output paths that resolve inside the skill.

## Planning Trigger

Route to remediation planning before using this skill's manual playbook as release-readiness evidence. The plan should update documentation and playbook probes to match the shipped runtime contract, or intentionally change runtime output schema and add tests.

Recommended next command family: `/speckit:plan` for a bounded docs/schema remediation packet.

## Active Finding Registry

| ID | Severity | Dimension | Title | Evidence | Status |
|---|---|---|---|---|---|
| F001 | P1 | correctness | Documented extraction output paths resolve inside the skill and are rejected before crawl | `.opencode/skills/sk-design-md-generator/INSTALL_GUIDE.md:23-54`; `.opencode/skills/sk-design-md-generator/backend/README.md:111-115`; `.opencode/skills/sk-design-md-generator/backend/scripts/extract.ts:258-268` | active |
| F002 | P1 | traceability | Detector catalog and playbook expect token fields the extractor does not emit | `.opencode/skills/sk-design-md-generator/feature_catalog/06--feature-extractors/feature-extractors.md:35-49`; `.opencode/skills/sk-design-md-generator/manual_testing_playbook/11--detectors/framework-icon-motion-detection.md:30-33`; `.opencode/skills/sk-design-md-generator/backend/scripts/types.ts:337-410`; `.opencode/skills/sk-design-md-generator/backend/scripts/extract.ts:501-520`; `.opencode/skills/sk-design-md-generator/backend/scripts/extract.ts:564-620` | active |
| F003 | P1 | traceability | Interaction playbook expects raw interaction captures in tokens.json, but extraction folds them into component variants only | `.opencode/skills/sk-design-md-generator/manual_testing_playbook/08--interaction/interaction-state-matrix.md:30-33`; `.opencode/skills/sk-design-md-generator/manual_testing_playbook/08--interaction/interaction-state-matrix.md:51-58`; `.opencode/skills/sk-design-md-generator/backend/scripts/cluster.ts:1266-1276`; `.opencode/skills/sk-design-md-generator/backend/scripts/cluster.ts:1301-1339`; `.opencode/skills/sk-design-md-generator/backend/scripts/types.ts:461-478` | active |
| F004 | P2 | maintainability | README extract flags describe old --fast/output behavior | `.opencode/skills/sk-design-md-generator/README.md:106-120`; `.opencode/skills/sk-design-md-generator/backend/scripts/extract.ts:147-151`; `.opencode/skills/sk-design-md-generator/backend/tests/parseargs.test.ts:21-28` | active |

### F001 Details

`INSTALL_GUIDE.md` places the operator in `.opencode/skills/sk-design-md-generator/backend` [SOURCE: `.opencode/skills/sk-design-md-generator/INSTALL_GUIDE.md:23-24`] and then gives `--output .opencode/specs/<track>/<packet>/output` [SOURCE: `.opencode/skills/sk-design-md-generator/INSTALL_GUIDE.md:52-54`]. The backend guide repeats the same backend-cwd pattern [SOURCE: `.opencode/skills/sk-design-md-generator/backend/README.md:111-115`]. `extract.ts` resolves `options.output` and rejects paths nested under the skill root [SOURCE: `.opencode/skills/sk-design-md-generator/backend/scripts/extract.ts:258-268`]. Because relative paths are cwd-relative, the documented path resolves under the backend directory and is rejected before crawl.

### F002 Details

The feature catalog says framework writes to `tokens.framework`, icons to `tokens.icons`, motion to `tokens.motion`, and design-boundary feeds stability classification [SOURCE: `.opencode/skills/sk-design-md-generator/feature_catalog/06--feature-extractors/feature-extractors.md:35-49`]. The detector scenario expects top-level `framework`, `iconSystem`, `motion`, and `designBoundary` fields in `tokens.json` [SOURCE: `.opencode/skills/sk-design-md-generator/manual_testing_playbook/11--detectors/framework-icon-motion-detection.md:30-33`]. The actual `DesignTokens` schema has `meta.framework`, `iconSystem`, `motionSystem`, `a11yTokens`, and no `designBoundary` property [SOURCE: `.opencode/skills/sk-design-md-generator/backend/scripts/types.ts:337-410`]. The extractor writes design boundary only to `extraction-report.json` [SOURCE: `.opencode/skills/sk-design-md-generator/backend/scripts/extract.ts:608-620`].

### F003 Details

The interaction scenario instructs operators to inspect `tokens.json` under `interaction/captures` [SOURCE: `.opencode/skills/sk-design-md-generator/manual_testing_playbook/08--interaction/interaction-state-matrix.md:30-33`] and its node snippet reads `t.interaction` [SOURCE: `.opencode/skills/sk-design-md-generator/manual_testing_playbook/08--interaction/interaction-state-matrix.md:51-58`]. The actual pipeline builds a lookup from page-level interaction captures [SOURCE: `.opencode/skills/sk-design-md-generator/backend/scripts/cluster.ts:1266-1276`] and writes those effects into component variant fields [SOURCE: `.opencode/skills/sk-design-md-generator/backend/scripts/cluster.ts:1301-1339`]. The final component variant schema carries `hoverChanges`, `focusVisibleChanges`, `focusChanges`, and `activeChanges` [SOURCE: `.opencode/skills/sk-design-md-generator/backend/scripts/types.ts:461-478`], not raw `tokens.interaction.captures`.

### F004 Details

The skill-level README says `--fast` is "no interaction" and `--output` has a default [SOURCE: `.opencode/skills/sk-design-md-generator/README.md:106-120`]. The parser and tests document the current behavior: `--fast` still captures interaction, while `--fast-no-interaction` opts out [SOURCE: `.opencode/skills/sk-design-md-generator/backend/scripts/extract.ts:147-151`; `.opencode/skills/sk-design-md-generator/backend/tests/parseargs.test.ts:21-28`]. `extract.ts` also requires an explicit output path [SOURCE: `.opencode/skills/sk-design-md-generator/backend/scripts/extract.ts:255-263`].

## Remediation Workstreams

| Workstream | Findings | Action |
|---|---|---|
| Output-path documentation | F001, F004 | Replace backend-cwd examples with absolute paths or correct relative paths from backend to workspace `.opencode/specs`, and remove output-default language. |
| Detector schema alignment | F002 | Decide whether docs should reference current paths (`meta.framework`, `iconSystem`, `motionSystem`, extraction-report `designBoundary`) or whether runtime should emit compatibility aliases. Add tests/playbook probes for the chosen contract. |
| Interaction playbook alignment | F003 | Update INTERACT-001 to validate `components[].variants.*Changes` or add intentional `tokens.interaction` persistence with schema coverage. |
| README cleanup | F004 | Update `--fast`, `--fast-no-interaction`, and `--output` rows to match parser tests. |

## Spec Seed

Minimal spec delta:

```markdown
### Requirement: sk-design-md-generator docs and playbooks reflect executable runtime contracts

- Extraction examples that run from `backend/` MUST use output paths that resolve outside `.opencode/skills/sk-design-md-generator/` and into the intended spec output directory.
- Manual testing scenarios MUST validate the current `DesignTokens` schema, including `meta.framework`, `iconSystem`, `motionSystem`, component variant interaction state fields, and extraction-report `designBoundary` unless the runtime intentionally adds aliases.
- README flag tables MUST match `parseArgs` behavior: `--fast` still captures interaction; `--fast-no-interaction` opts out; `--output` is required.
```

## Plan Seed

1. Update all backend-cwd command examples in `INSTALL_GUIDE.md`, `backend/README.md`, `manual_testing_playbook/**`, and `README.md` to use valid output paths.
2. Update detector catalog and DETECT-001 to the actual token schema, or implement aliases intentionally and cover them with tests.
3. Update INTERACT-001 to inspect component variant state fields or add raw interaction persistence intentionally.
4. Refresh README flag table and stale v2 Section 11 wording in the interaction catalog.
5. Verify with `npm run typecheck`, targeted vitest suites, and a docs grep for stale `--output .opencode/specs` examples from backend cwd.

## Traceability Status

| Protocol | Gate | Status | Evidence | Notes |
|---|---|---|---|---|
| spec_code | hard | partial | `.opencode/skills/sk-design-md-generator/backend/scripts/extract.ts:258-268`; `.opencode/skills/sk-design-md-generator/backend/scripts/types.ts:337-410` | Runtime behavior is coherent, but docs/playbooks drift. |
| checklist_evidence | hard | partial | `.opencode/skills/sk-design-md-generator/manual_testing_playbook/01--extract/live-extraction.md:51-58`; `.opencode/skills/sk-design-md-generator/manual_testing_playbook/08--interaction/interaction-state-matrix.md:51-58` | Manual scenario commands/probes can fail for contract drift rather than product behavior. |
| skill_agent | advisory | pass | Exact search found no `.opencode/agents` or `.opencode/commands` entrypoint references to `sk-design-md-generator`. | No direct agent/command drift found. |
| feature_catalog_code | advisory | partial | `.opencode/skills/sk-design-md-generator/feature_catalog/06--feature-extractors/feature-extractors.md:35-49`; `.opencode/skills/sk-design-md-generator/backend/scripts/types.ts:337-410` | Detector field paths and design-boundary claim need reconciliation. |
| playbook_capability | advisory | partial | `.opencode/skills/sk-design-md-generator/manual_testing_playbook/08--interaction/interaction-state-matrix.md:30-58`; `.opencode/skills/sk-design-md-generator/manual_testing_playbook/11--detectors/framework-icon-motion-detection.md:30-57` | Interaction and detector scenarios validate stale schema expectations. |

## Deferred Items

- Stale `/design-md` references appear in the backend CLI/report text [SOURCE: `.opencode/skills/sk-design-md-generator/backend/scripts/cli.ts:11-12`; `.opencode/skills/sk-design-md-generator/backend/scripts/report-gen.ts:615-617`]. This was not promoted because command absence is not represented by a file:line source inside the target package.
- Some feature catalog language still references v2 section naming for interaction/state matrix [SOURCE: `.opencode/skills/sk-design-md-generator/feature_catalog/07--interaction-capture/interaction-capture.md:58-64`], while newer docs describe v3 Components. This is covered under F003/F004 remediation but not separately scored.
- Live extraction and validation were not executed because the user explicitly limited writes to the artifact directory only, and extraction creates token, screenshot, and report files in its output directory.

## Audit Appendix

### Iteration Table

| Iteration | Focus | New P0 | New P1 | New P2 | Verdict |
|---:|---|---:|---:|---:|---|
| 1 | correctness | 0 | 1 | 1 | CONDITIONAL |
| 2 | security | 0 | 0 | 0 | PASS |
| 3 | traceability | 0 | 2 | 0 | CONDITIONAL |
| 4 | maintainability | 0 | 0 | 0 | PASS |
| 5 | stabilization | 0 | 0 | 0 | PASS |

### Convergence Replay

Configured max iterations: 5. Iteration 5 found no new findings and all dimensions were covered, but active P1 findings remained. The terminal stop reason is therefore `maxIterationsReached`, and the verdict is `CONDITIONAL` by contract: no P0, active P1 > 0.

### Evidence Density

Every active finding has at least three concrete file:line evidence references. P1 findings include typed claim-adjudication packets in the relevant iteration files.

### Write Boundary

No repository files were modified. All review artifacts were written under:

`/private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/448c20ca-e10e-4e24-9635-f0085576ec60/scratchpad/skreview/sk-design-md-generator/gpt55xhigh`

### Final Verdict

`CONDITIONAL`
