# Deep Review — Iteration 4

- **Dimension:** maintainability
- **Run:** run-4 — session `2026-10-13T05:59:30.000Z`, generation 1, lineageMode `new`
- **Target:** commit `17bb342b1c` on branch `worktrees/125-surface-placement`
- **Prior findings carried in:** P0=0, P1=0, P2=1 (`R1-P2-001`, still open)
- **New findings this iteration:** 1 × P2 (`R4-P2-001`)
- **Outcome:** PASS (P2-only registry, advisory)

## Dimension

Maintainability. Directions entered this iteration: regression-guard coverage for the changed twin line groups, changelog convention parity with sibling entries, reference-doc version-bump convention, hardcoded layout roots in the new completion prose, template/instruction consistency, release-surface hygiene. No swept or saturated direction was re-entered; the shared-phrase parity checks (`skill_agent`, `cross_file_parity`) were carried, not re-run, and the one new finding is about the guard that does not exist, not about parity that holds today.

## Files Reviewed

- `.skilled/commands/create/assets/create-skill-parent-auto.yaml:423,500-501`
- `.skilled/commands/create/assets/create-skill-parent-confirm.yaml:462,547-548`
- `.skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-hub-router-schema.md:12,290`
- `.skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md:12,224`
- `.skilled/skills/sk-doc/sk-create-skill/SKILL.md:5`
- `.skilled/skills/sk-doc/sk-create-skill/changelog/v1.5.4.0.md:1-31`
- `.skilled/commands/create/assets/tests/test_skill_parent_router_parity.py:7-13`
- `.skilled/skills/sk-doc/sk-create-skill/changelog/v1.5.3.0.md:1-33` (sibling convention)
- `.skilled/skills/sk-doc/sk-create-skill/assets/parent-skill/parent-skill-hub-router-template.json:12`
- `.skilled/skills/sk-doc/sk-create-skill/assets/parent-skill/parent-skill-hub-template.md:188,301`
- `.skilled/scripts/git-hooks/pre-commit:541-548`
- `git show --stat 17bb342b1c` (nine-file change set); `rg -ln "create-skill-parent-(confirm|auto)"` twin-reference inventory

## Findings by Severity

### P0 — none

### P1 — none

### P2

#### 1 [P2] New twin line groups have no parity guard, unlike the root_router_contract block

- Case: a future edit updates the step_4 hub-router rule or one step_6 follow-up line in only one of the two twins. Nothing automated fails; the twins diverge silently until a manual byte-level comparison or a hub-level run exposes it.
- File: `.skilled/commands/create/assets/tests/test_skill_parent_router_parity.py:7-13` (guard scope), against `.skilled/commands/create/assets/create-skill-parent-auto.yaml:423,500-501` and `.skilled/commands/create/assets/create-skill-parent-confirm.yaml:462,547-548`
- Evidence: R1 requires the rule word-for-word the same in each site, and the commit hand-edits both twins on identical text (`.skilled/commands/create/assets/create-skill-parent-auto.yaml:423` ≡ `confirm.yaml:462`; `auto.yaml:500-501` ≡ `confirm.yaml:547-548`; diff hunks `@@ -415,17 +415,17 @@` and `@@ -492,16 +492,18 @@`). The repo's only structural twin-parity test declares its scope as the "identical canonical `root_router_contract` block" plus "a separate grep [that] keeps every authoring surface from instructing creation of a legacy smart-routing.md path" — that is its whole surface; it never compares step_4/step_6 activity text. A twin-reference inventory (`rg -ln "create-skill-parent-(confirm|auto)"` under `.skilled/`) returns only `test_skill_parent_router_parity.py` and `advisor-index-handoff-contract.test.cjs` as tests touching the twins, and neither compares the changed line groups. Doctor `5e`/`5i` validate a generated hub's router, not the twin prose that produces it, and the copy-run proof lives in the commit message, not in CI.
- User impact: none today — iterations 1–2 confirmed the twins are byte-identical on the changed lines. If drift lands, a scaffold run from the untouched twin appends the new surface after the existing surfaces, which is the exact bug this change fixes, and no automated failure points at the diverging prose.
- Finding class: class-of-bug (guard gap over the class of hand-synced twin line groups)
- Scope proof: `test_skill_parent_router_parity.py:7-13` docstring owns the test scope; the twin-reference inventory shows no other test compares the step_4 rule or the step_6 lines; the changed lines sit outside the canonical `root_router_contract` block the test compares.
- Affected surface hints: ["create-skill-parent twins", "router parity test", "root_router_contract canonical block"]
- Recommendation: extend the parity test to structurally compare the shared step_4 hub-router activity line and the two step_6 follow-up lines across the twins, or extract those line groups into a canonical shared block like `root_router_contract` and compare that. Optional follow-up; both twins are correct as committed.

Counterevidence sought: (a) another drift guard compares the twins — none found; `run-all-drift-guards.sh` covers advisor maps, citations and manifests, not twin text; (b) the doctor catches divergence at run time — `5e` enforces tieBreak permutation, not the insertion policy, and only after a run generates a hub; (c) the spec requires a test — it does not; this is raised as an optional follow-up, not a spec gap.
Alternative explanation: the twins are intentionally hand-maintained duplicates and only the routing contract block is worth structural parity. That explains the current state but does not remove the drift class from the two new multi-line prose copies; the recommendation stays advisory.
Final severity: P2 · Confidence: high · Downgrade trigger: an existing test or drift guard found to compare the step_4/step_6 line groups across the twins.

### Carried (not re-entered)

`R1-P2-001` (the step_4 insertion rule leaves the relative order among several new surfaces in one run undefined; `.skilled/commands/create/assets/create-skill-parent-auto.yaml:423`) remains the other open P2 in the registry. Maintainability does not change or resolve it; it still stands as advisory.

## Traceability Checks

| # | Direction | Check | Result | Evidence |
|---|-----------|-------|--------|----------|
| M-1 | changelog convention | `v1.5.4.0.md` carries the same frontmatter keys and section order (`## What's New at a Glance`, `## Upgrade`) as sibling `v1.5.3.0.md` | pass | `changelog/v1.5.4.0.md:1-31`; `changelog/v1.5.3.0.md:1-33` |
| M-2 | reference-doc version bump | Both edited references moved `1.2.0.x` → `1.2.1.0` for a content addition; no edited doc left at its old version | pass | `parent-hub-router-schema.md:12`; `parent-skills-nested-packets.md:12` |
| M-3 | twin parity guard | The changed step_4/step_6 line groups sit outside every automated twin-parity check | finding → `R4-P2-001` | `test_skill_parent_router_parity.py:7-13`; twin-reference inventory |
| M-4 | template/instruction consistency | Router template placeholder (`[surface-name]` after workflow placeholders) and hub-template checklist ("workflow modes first then surfaces") remain compatible with the insertion rule, which governs updates of existing hubs | pass | `parent-skill-hub-router-template.json:12`; `parent-skill-hub-template.md:188,301` |
| M-5 | layout-constant ownership | The authored-twin root named in the new step_6 lines is the repo layout constant read by the hook from `compiled-route-layout.cjs`; prose must name it concretely to stay executable, so the literal is not unowned duplication | pass (note) | `.skilled/scripts/git-hooks/pre-commit:541-548`; `rg -ln "015-router-unification-program"` (12 non-spec sites, established constant) |
| M-6 | release surface | Carried from iteration 1: SKILL.md `1.5.4.0` ↔ changelog `1.5.4.0` ↔ Hermes copy `1.5.4.0`; no stale current-version reference | carried pass | `.skilled/skills/sk-doc/sk-create-skill/SKILL.md:5`; `.hermes/skills/sk-create-skill/SKILL.md:5` |

## Verdict

No P0 or P1. One new P2 (`R4-P2-001`, advisory) plus the carried `R1-P2-001`. Maintainability is now covered; all four required review dimensions have been entered across iterations 1–4. The new finding does not gate the change — current twins are byte-identical and the release surface is consistent.

## Next Dimension

None remaining. All four dimensions (correctness, security, traceability, maintainability) are covered; any further iteration slot is verification/synthesis only, not a new dimension.

## SCOPE VIOLATIONS

None. No out-of-scope mutation was needed or performed; all review targets were read-only and all writes stayed inside the review run directory.

Review verdict: PASS
