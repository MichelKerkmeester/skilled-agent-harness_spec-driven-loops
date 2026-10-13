# Deep Review — Iteration 001

- Run: 2026-10-13T07:13:05.484Z (generation 1, lineage new)
- Dimension: correctness (with traceability cross-check)
- Target: commits `9d1168bf3a` (fix(doctor): stop comparing a hub ROUTER.md version in check 13a) and `95698b591b` (docs(create): stop copying the release version into a hub ROUTER.md), diff `455f2a2d8c..95698b591b`
- Mode: single_review_iteration, externalized state

## Dimension

Correctness of the diff: does 13a now compare exactly the three JSON routing files, does the new invariants test actually pin that, do the create-changelog twins stop moving the release version into `ROUTER.md` while staying aligned, and does the versioning standard describe the check that now exists. Traceability was swept alongside because the spec's same-class inventory deliverable binds the change to every other live claim about `ROUTER.md` version parity.

## Files Reviewed

| File | What was checked |
|------|------------------|
| `.skilled/commands/doctor/scripts/parent-skill-check.cjs:1836` | `checkVersionParity` follower set, comment, pass message, failure branches |
| `.skilled/commands/doctor/scripts/tests/parent-skill-check-invariants.test.cjs:441` | New T1 test plus fixture (`stage1Router`, line 107) and existing 13a FAIL cases (lines 406, 515) |
| `.skilled/commands/create/assets/create-changelog-confirm.yaml:600` | Global version-copy activity; twin alignment |
| `.skilled/commands/create/assets/create-changelog-auto.yaml:665` | Global version-copy activity; twin alignment |
| `.skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md:119` | Enforcement paragraph and Section 4 bump rule consistency |
| `.skilled/skills/sk-doc/SKILL.md:17` | Hub version-authority claim |
| `.skilled/skills/sk-doc/sk-create-changelog/SKILL.md:261` | Live release instructions for the global branch |
| `.skilled/skills/sk-doc/sk-create-skill/references/skill/examples-and-maintenance.md:181` | Release-bump guidance and doctor claim |
| `spec.md`, `goal.md`, `tasks.md`, `implementation-summary.md` | Requirement mapping, scope bullets, task/checklist state |

Diff-internal verification (all correct):

- `ROUTER.md` is absent from the follower list; the three JSON files remain and both the malformed-value and mismatch branches still `softFail` [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:1848].
- The pass message is now JSON-only [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:1866].
- The new test is live, not vacuous: `stage1Router()` emits `version: ${VERSION}` at frontmatter level, so `String.replace` finds and mutates that first occurrence [SOURCE: .skilled/commands/doctor/scripts/tests/parent-skill-check-invariants.test.cjs:107], and the assertions at line 441 pin "no 13a FAIL, 13a PASS". The existing case that a differing `description.json` still FAILs 13a is untouched [SOURCE: .skilled/commands/doctor/scripts/tests/parent-skill-check-invariants.test.cjs:515].
- Both twins dropped the identical line and no `ROUTER.md` reference remains in either activity [SOURCE: .skilled/commands/create/assets/create-changelog-auto.yaml:665] [SOURCE: .skilled/commands/create/assets/create-changelog-confirm.yaml:600].
- The standard's paragraph now names only the three JSON files and states `ROUTER.md` keeps its own edition [SOURCE: .skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md:121] [SOURCE: .skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md:124]. The doc's version raise `1.0.3.0 → 1.0.4.0` follows the Section 4 bump rule (third segment up, fourth reset).

## Findings by Severity

### P0 — Blockers

None.

### P1 — Required

#### R1-P1-001 — Same-class inventory incomplete: three live docs still state a hub ROUTER.md carries the SKILL.md/release version

- Case: An agent runs `/create:changelog` for a hub release and follows the live `sk-create-changelog/SKILL.md` step 6, which still names `ROUTER.md` among the version carriers to set to `next_version`; or a hub author reads `sk-doc/SKILL.md` and believes `ROUTER.md` carries the release value. The release writes the release version into `ROUTER.md`, recreating exactly the drift this phase removes, and the docs assert a doctor parity that no longer exists.
- File: `.skilled/skills/sk-doc/sk-create-changelog/SKILL.md:261`
- Evidence:
  - `sk-create-changelog/SKILL.md:261` — "set `next_version` in every version carrier the component's skill root already has (`SKILL.md`, `ROUTER.md`, `description.json`, `hub-router.json` and `mode-registry.json`, never `README.md`...)" [SOURCE: .skilled/skills/sk-doc/sk-create-changelog/SKILL.md:261]
  - `sk-doc/SKILL.md:17` — "`description.json`, `mode-registry.json`, `hub-router.json`, and `ROUTER.md` carry the same value, so every hub-root artifact states the same release" [SOURCE: .skilled/skills/sk-doc/SKILL.md:17]
  - `examples-and-maintenance.md:181` — the changelog "sets the new version in every carrier ... SKILL.md, and for a hub ROUTER.md, description.json, hub-router.json and mode-registry.json" and the doctor "then confirms every copy matches" [SOURCE: .skilled/skills/sk-doc/sk-create-skill/references/skill/examples-and-maintenance.md:181]
  - All three contradict the reviewed change [SOURCE: .skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md:124] and the spec's VP-3. The spec makes the inventory in scope ("every other claim that a hub `ROUTER.md` carries the `SKILL.md` version, found by grep, is corrected or listed with its reason"); `tasks.md` T002 (the grep inventory) and CHK-FIX-002 (`[P0] Same-class producer inventory completed, or instance-only status proven by grep`) are both still unchecked [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/026-external-surface-priority-build/004-router-version-parity/tasks.md:35] [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/026-external-surface-priority-build/004-router-version-parity/tasks.md:131]. `implementation-summary.md` records no inventory entry, and the strategy's Known Context claim that the build-time grep found only the two YAML lines, the standard's paragraph and one historical changelog entry is contradicted by these three live claims at HEAD `95698b591b`.
- User impact: Release operators silently overwrite the hub `ROUTER.md`'s own edition and restore release-version coupling; hub authors are told the doctor enforces parity that no longer exists. The phase's purpose is undercut by the docs that drive its own workflow.
- Finding class: class-of-bug
- Scope proof: `grep -rn 'ROUTER.md'` with version context over `.skilled/commands` and `.skilled/skills/sk-doc` (excluding `node_modules/` and `changelog/`) returned exactly these three live claims; the remaining hits are format-only and consistent with own-edition (`parent-skill-root-router-template.md:29`, `create-skill-parent-*.yaml`), and `sk-doc/sk-create-changelog/changelog/v1.3.4.0.md:24` is historical and correctly left alone.
- Affected surface hints: ["create-changelog skill instructions", "hub SKILL version-authority note", "sk-create-skill maintenance reference", "doctor version guidance"]
- Claim adjudication:
  - Claim: Three live, committed documents still assert a hub `ROUTER.md` carries the SKILL.md/release version, and one instructs the release workflow to write it, contradicting VP-3/REQ-003 and the phase's own inventory deliverable.
  - evidenceRefs: [".skilled/skills/sk-doc/sk-create-changelog/SKILL.md:261", ".skilled/skills/sk-doc/SKILL.md:17", ".skilled/skills/sk-doc/sk-create-skill/references/skill/examples-and-maintenance.md:181", ".skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md:124", "tasks.md:35", "tasks.md:131"]
  - counterevidenceSought: Searched `implementation-summary.md` for any inventory/claim record (none); searched all of `.skilled/commands` and `.skilled/skills/sk-doc` for corrected or listed variants; checked whether the three lines are historical entries (they are live files at HEAD, confirmed with `git show HEAD:<path>`).
  - alternativeExplanation: The build may have scoped the inventory to the files it edited; or the standard might be treated as authoritative over tool-facing skill docs. Neither satisfies the spec's explicit "corrected or listed with its reason" wording, and the changelog SKILL.md line directly conflicts with the YAML twins changed in the same commit.
  - finalSeverity: P1
  - confidence: 0.85
  - downgradeTrigger: If `implementation-summary.md` or `tasks.md` lists these three sites with a recorded reason, or a follow-up commit corrects them, downgrade to P2/resolved. The finding resolves when all three agree with `frontmatter-versioning.md:124`.
- Recommendation: Complete the same-class inventory: correct the three sites (drop `ROUTER.md` from the version-carrier list, restate own-edition), or record each with an explicit reason; add a README-style "ROUTER.md is not a version carrier" note to the twins' version-copy activity so the omission is deliberate.

### P2 — Suggestions

None.

## Traceability Checks

| Check | Status | Evidence |
|-------|--------|----------|
| `spec_code` core | partial | REQ-001 met (ROUTER.md absent from followers; T1 test at line 441); REQ-002 met (JSON followers retained; existing mismatch case at line 515); REQ-003 partial (twins changed, but `sk-create-changelog/SKILL.md:261` still instructs writing `ROUTER.md`'s release version); REQ-004 partial (standard updated, but `sk-doc/SKILL.md:17` and `examples-and-maintenance.md:181` contradict it); REQ-005 unverified statically (goal criterion 3 not executed in this read-only iteration) |
| `checklist_evidence` core | partial | `tasks.md` T002 and CHK-FIX-002 open; `implementation-summary.md` holds no inventory entry; goal criterion 1's greps statically hold (`file: 'ROUTER.md'` count 0 in the checker; `ROUTER.md frontmatter version` count 0 in both twins) |
| `skill_agent` overlay | covered by R1-P1-001 | `sk-create-changelog` skill instructions vs command YAML twins diverge |
| `agent_cross_runtime` overlay | notApplicable | No agent definitions in the diff |
| `feature_catalog_code` overlay | notApplicable | No feature-catalog resource touched |
| `playbook_capability` overlay | notApplicable | No playbook capability touched |

Ruled out this iteration (recorded in the delta): T1 test vacuity (fixture emits the replaced version line), JSON parity regression (followers and failure branches intact), security impact of narrowing 13a (version metadata only; no auth/injection/secret/destructive surface), YAML twin divergence (identical removals).

## Next Dimension

Security over the same diff (expected to produce no findings, consistent with SL-004), then residual traceability: confirm whether the three stale claims are corrected or explicitly listed in a follow-up commit. Files: the three claim sites, `.skilled/commands/create/assets/create-changelog-*.yaml`, `.skilled/commands/doctor/scripts/parent-skill-check.cjs`.

## Verdict

Diff-internal changes are correct and minimal; the new test genuinely pins the behavior. One P1 cross-consumer gap remains: the change's own same-class inventory deliverable is incomplete and unrecorded, leaving a live operational instruction (`sk-create-changelog/SKILL.md:261`) that recreates the coupling the phase removes.

Review verdict: CONDITIONAL
