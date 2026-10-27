# Iteration 8: Maintainability - what the release notes promise

## Dimension

Maintainability. The release-facing carrier of the packet: `changelog/v2.9.0.0.md`, the parent scope row it describes, the catalog leaf that repeats the claim, and the test that is supposed to hold the claim true.

## Files Reviewed

- `.skilled/skills/system-spec-kit/changelog/v2.9.0.0.md:20-32`
- `specs/system-speckit/054-weak-model-spec-authoring/spec.md:132`
- `.skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/template-section-fill-guidance.md:18-30`
- `.skilled/skills/system-spec-kit/runtime/cli/tests/template-fill-guidance.vitest.ts:55-70`
- `.skilled/skills/system-spec-kit/templates/core/{spec,plan,tasks,implementation-summary}.md.tmpl` (all `FILL:` lines)
- `specs/system-speckit/054-weak-model-spec-authoring/changelog/` (ten files, nine phases plus root)

## Findings by Severity

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **The release notes promise a good and a weak example in every core section, and two sections carry neither** - `.skilled/skills/system-spec-kit/changelog/v2.9.0.0.md:24` - The changelog states "Every core section says how to fill it. Each section carries a short instruction and a good and weak example" ([SOURCE: .skilled/skills/system-spec-kit/changelog/v2.9.0.0.md:24]), and the parent scope row it closes names the same deliverable ("a fill instruction with a good and a weak example to each core template section", [SOURCE: specs/system-speckit/054-weak-model-spec-authoring/spec.md:132]). Across the four core templates there are 70 `FILL:` lines, and 68 of them carry both a `GOOD:` and a `WEAK:` example. Two do not: `spec.md.tmpl` line 444 holds only "Leave the four links in place." and `tasks.md.tmpl` line 115 only "Fill each checklist section below." ([SOURCE: .skilled/skills/system-spec-kit/templates/core/spec.md.tmpl:444], [SOURCE: .skilled/skills/system-spec-kit/templates/core/tasks.md.tmpl:115]). The test that is meant to hold this - and the catalog leaf that repeats the claim ([SOURCE: .skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/template-section-fill-guidance.md:20]) - never looks at the example pair: the assertion checks that exactly one `FILL:` line exists per section, that it holds no token and that it ends with a period ([SOURCE: .skilled/skills/system-spec-kit/runtime/cli/tests/template-fill-guidance.vitest.ts:60-70]). So the promise is neither true for two sections nor enforceable for the other 68.
   Finding class: unenforced-release-claim
   Scope proof: all four core templates were scanned for `FILL:` / `GOOD:` / `WEAK:` counts (6/6/6, 18/18/18, 24/23/23, 22/21/21), the two short lines were read directly, and the test body was read to its closing brace.
   Affected surface hints: changelog v2.9.0.0, parent scope row, fill-guidance test, core spec and tasks templates
   Case: delete the `WEAK:` half of any fill line; the suite stays green and the changelog stays true on paper only.

## Verified In This Pass

- **`L3+` label claim.** The `tasks.md` template holds exactly six `## L3+:` headings, and all six fill notes open with "L3+ means Level 3 and above, so this section stays at Level 3." The changelog's most consequential sentence - the one a benchmark failure was attributed to - is true on the tree.
- **Nested changelogs.** The packet changelog folder holds nine phase files plus the root file, one per phase, matching the phase map.
- **Version carriers.** `SKILL.md` reads `2.9.0.0` and the changelog file is `v2.9.0.0.md` with a matching `version:` in its frontmatter.
- **Set count.** The changelog describes four final sets (first, second, fresh, second fresh) and the report documents the same four; the earlier "three sets" wording that wave 1 recorded as a P2 has already been corrected in the report body, so it is not re-reported here.

## Traceability Checks

| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| `spec_code` | partial | hard | `changelog/v2.9.0.0.md:24`; `spec.md:132`; two template lines | The deliverable is 68 of 70 sections. |
| `checklist_evidence` | partial | hard | phase 004 acceptance rows for the fill lines | The phase 004 row asks that each section carries a fill line, which is true; the example pair is not in the row. |
| `skill_agent` | notApplicable | advisory | - | No skill definition reviewed this iteration. |
| `agent_cross_runtime` | notApplicable | advisory | - | No agent definition reviewed this iteration. |
| `feature_catalog_code` | partial | advisory | `template-section-fill-guidance.md:20` | The leaf repeats the changelog's promise without the hedge its own next sentence carries. |
| `playbook_capability` | pass | advisory | scenario 480 (golden render of every level) | The golden scenario compares counts, not example pairs, and does not claim otherwise. |

## Verdict

One P2 finding. The release notes are accurate on every claim this iteration could test except the example pair, where the tree is two sections short and the guard cannot see the difference.

## Next Dimension

Traceability, overlay protocol `agent_cross_runtime`. The doc-authoring agent file phase 006 edited, compared across the runtime mirrors.

Review verdict: PASS
