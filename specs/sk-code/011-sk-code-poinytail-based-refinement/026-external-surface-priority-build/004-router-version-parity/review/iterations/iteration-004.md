# Deep Review — Iteration 004

- Run: 2026-10-13T07:13:05.484Z (generation 1, lineage new)
- Dimension: maintainability (last uncovered dimension)
- Target: commits `9d1168bf3a` and `95698b591b`, diff `455f2a2d8c..95698b591b`
- Mode: single_review_iteration, externalized state

## Dimension

Maintainability of the reviewed revision at HEAD `95698b591b`, read-only and without executing anything:

1. the rewritten 13a comment and pass message against the follower set that remains after the `ROUTER.md` entry was removed;
2. dead code or stale references left behind by that removal (helpers, context fields, test assertions);
3. the new invariants test's name, fixture mutation and assertions against VP-2/T1 and the surviving negative controls;
4. the twins' surviving version-copy list wording and the doctor re-run clause under it;
5. the standard's rewritten enforcement paragraph, its new own-edition sentence, and the `1.0.3.0 → 1.0.4.0` raise against the Section 4 bump rule.

## Files Reviewed

| File | What was checked |
|------|------------------|
| `.skilled/commands/doctor/scripts/parent-skill-check.cjs:1839-1868` | 13a comment, follower list, failure branches, pass message, `markdownVersion` usage |
| `.skilled/commands/doctor/scripts/tests/parent-skill-check-invariants.test.cjs:433-449` | New ROUTER.md negative test vs the README precedent; assertion shape |
| `.skilled/commands/doctor/scripts/tests/parent-skill-check-invariants.test.cjs:103-123` | `stage1Router()` fixture emitting `version: ${VERSION}` (mutation target) |
| `.skilled/commands/doctor/scripts/tests/parent-skill-check-invariants.test.cjs:292-300, 405-413, 511-517` | Clean-fixture PASS expectations, 12a router-contract references, retained 13a JSON regressions |
| `.skilled/commands/create/assets/create-changelog-auto.yaml:659-684` | Surviving copy list, README note, doctor re-run clause |
| `.skilled/commands/create/assets/create-changelog-confirm.yaml:594-615` | Twin equivalence of the same activity |
| `.skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md:12, 17, 30, 70-83, 120-124` | Enforcement paragraph vs code, own-edition sentence, Section 1 table, bump rule, version raise |
| `spec.md:73-77, 84-92` | VP-2 and the same-class inventory bullet vs the changed files |
| `goal.md:44-48, 63-65` | D1/D4/T1 recording rule and completion criteria 1-3 |
| `scratch/review-diff.patch` | Exact hunks; no change outside the five files |

Evidence for the maintainability reads (all by direct read at HEAD):

- The 13a comment reads "every JSON routing file that declares a version" and adds "ROUTER.md is not compared: like every doc but SKILL.md it keeps its own version, raised by the per-doc bump." [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:1839]. The follower list holds exactly the three JSON files [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:1850], the two failure branches still name the offending file [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:1859] [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:1862], and the pass message says "all JSON routing files carry the SKILL.md version" [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:1866]. No ephemeral labels (task/REQ/finding ids, spec paths) appear in the comment.
- `markdownVersion` is still used for the SKILL.md authority after the removal [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:1844]; no helper, constant or context field was orphaned by dropping the follower.
- The new test mirrors the retired-check precedent: same shape as the README case, fixture mutation on the `stage1Router()` version line, then a negative FAIL assertion, a PASS assertion and exit 0 [SOURCE: .skilled/commands/doctor/scripts/tests/parent-skill-check-invariants.test.cjs:441] [SOURCE: .skilled/commands/doctor/scripts/tests/parent-skill-check-invariants.test.cjs:433]. The retained regressions still pin the JSON followers: a differing `description.json` fails 13a [SOURCE: .skilled/commands/doctor/scripts/tests/parent-skill-check-invariants.test.cjs:406] and a non-four-part follower fails it [SOURCE: .skilled/commands/doctor/scripts/tests/parent-skill-check-invariants.test.cjs:511].
- Exact search for `13a` across `.skilled/commands/doctor` shows no leftover assertion expecting the removed ROUTER.md comparison; the only other ROUTER.md references are 12a's presence/format check (checker `:1699-1745`, test `:405`).
- The surviving copy list in both twins drops only the `ROUTER.md frontmatter version:` line, keeps the generic rule and the README note, and the doctor re-run clause still reads correctly against the narrowed check [SOURCE: .skilled/commands/create/assets/create-changelog-auto.yaml:666] [SOURCE: .skilled/commands/create/assets/create-changelog-confirm.yaml:601].
- The standard's paragraph now names only the three JSON files, matches the code, and the new own-edition sentence agrees with the Section 1 table that already lists `ROUTER.md` under "every other doc" [SOURCE: .skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md:122] [SOURCE: .skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md:124] [SOURCE: .skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md:30]. The raise `1.0.3.0 → 1.0.4.0` is the third-segment bump for a body change under Section 4 [SOURCE: .skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md:12].

## Findings by Severity

### P0 — Blockers

None.

### P1 — Required

None new. The two prior correctness P1s — R1-P1-001 (three sk-doc instruction sites) and R3-P1-001 (three hub `SKILL.md` sites) — remain active in `deep-review-findings-registry.json` and are owned by task T002; this maintainability pass adds no site to that class. They are not re-reported here.

### P2 — Suggestions

None. The maintainability reads that could have produced a P2 (comment drift, dead code, stale message, stale test, doc/code drift, bump-rule conformance) all came back clean, and no new advisory is manufactured to fill the bucket.

## Ruled Out This Iteration

- **13a comment drift.** The comment's every clause agrees with the implementation: JSON-only followers, "declares a version" matches the `if (!present) continue;` skip, and the "mismatch, never a pass" clause matches both failure branches.
- **Dead code after the follower removal.** No orphaned helper or field; `markdownVersion` still serves the authority read, `FOUR_PART_VERSION` still guards both the authority and each follower.
- **Pass-message overclaim.** "All JSON routing files" is accurate in every PASS context, because a missing `description.json`, `hub-router.json` or `mode-registry.json` fails 8a, 5a or 3a respectively.
- **Test drift from VP-2/T1.** The test name, fixture and assertions match the spec requirement and the goal's T1 ledger rule; the mutation is effective because the fixture emits the replaced version line (consistent with the iteration-1 ruling).
- **Leftover old-behavior test.** Exact search found no test still asserting a 13a ROUTER.md failure; the 12a references cover presence/format only.
- **Doc/code drift in the standard.** The enforcement paragraph and the new sentence match the follower set and the Section 1 table; the paragraph still reads coherently in context.
- **Bump-rule conformance.** The `1.0.4.0` raise is the Section 4 third-segment raise for a body change.

## Traceability Checks

| Protocol / Check | Status | Evidence |
|------------------|--------|----------|
| `spec_code` core | partial | Unchanged from iteration 3: REQ-001..REQ-004 map to the reviewed revision; the same-class inventory is still open (R1-P1-001/R3-P1-001); REQ-005 is runtime-deferred |
| `checklist_evidence` core | partial | `tasks.md` T002 and CHK-FIX-002 remain open; VP/T1 ledger rows and closure sync remain with tasks T007-T009 |
| `skill_agent` overlay | partial | The stale hub `SKILL.md` version-authority claims remain (R1-P1-001/R3-P1-001); this iteration adds no new site |
| `agent_cross_runtime` overlay | notApplicable | No agent definition in the diff or the reviewed files |
| `feature_catalog_code` overlay | notApplicable | No feature-catalog claim about ROUTER.md version parity |
| `playbook_capability` overlay | notApplicable | Playbooks mention ROUTER.md routing reach only, not versions |

## Next Dimension

None. Maintainability was the last uncovered dimension; all four configured dimensions now have a covered iteration (correctness 1, security 2, traceability 3, maintainability 4). Residual session obligations: close or record R1-P1-001/R3-P1-001 through T002, and run the closure-gate runtime acceptance (goal criteria 3, 5, 6, 7).

## Verdict

The reviewed revision adds no P0, P1 or P2 finding on maintainability: the rewritten comment and message match the JSON-only follower set, the removal leaves no dead code or stale test, the new test is aligned and live, and the standard's paragraph and version raise conform to the standard itself. The iteration verdict stays **CONDITIONAL** because the two active P1 findings above remain open in the findings registry; the release decision is recomputed downstream from that registry.

Review verdict: CONDITIONAL
