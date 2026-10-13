# Deep Review — Iteration 002

- Run: 2026-10-13T07:13:05.484Z (generation 1, lineage new)
- Dimension: security (reliability read of the same changed surfaces)
- Target: commits `9d1168bf3a` and `95698b591b`, diff `455f2a2d8c..95698b591b` — 13a narrows to the three JSON routing files, a new invariants test pins that, both create-changelog twins drop the ROUTER.md carrier, `frontmatter-versioning.md` records own-edition
- Mode: single_review_iteration, externalized state

## Dimension

Security review of the diff: does removing the `ROUTER.md` follower from check 13a remove a security-relevant guard; do the changed doctor messages add injection or disclosure surface; is the version regex a DoS risk; does the new test or the workflow assets add path, secret, supply-chain or isolation surface. Reliability (failure handling, test isolation) was read alongside as the security-adjacent half of the baseline checklist.

## Files Reviewed

| File | Security surface checked |
|------|--------------------------|
| `.skilled/commands/doctor/scripts/parent-skill-check.cjs:1843` | `checkVersionParity` role, follower comparison, message interpolation, file reads |
| `.skilled/commands/doctor/scripts/parent-skill-check.cjs:150` | `FOUR_PART_VERSION` shape |
| `.skilled/commands/doctor/scripts/parent-skill-check.cjs:1761` | `markdownVersion` / `jsonVersion` read and parse helpers |
| `.skilled/commands/doctor/scripts/tests/parent-skill-check-invariants.test.cjs:441` | New test: mutation, assertions, temp-hub isolation |
| `.skilled/commands/doctor/scripts/tests/parent-skill-check-invariants.test.cjs:265` | `runChecker` invocation (`spawnSync` argv array, env merge) |
| `.skilled/commands/create/assets/create-changelog-auto.yaml:666` | Version-copy activity: no remaining ROUTER.md carrier |
| `.skilled/commands/create/assets/create-changelog-confirm.yaml:601` | Same activity, twin parity |
| `.skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md:122` | Enforcement paragraph: no claim weakened beyond version metadata |

Checked and found clean:

- No security guard is removed. `checkVersionParity` is a diagnostic: it reads version fields, compares strings, and emits `pass` / `softFail`; it performs no authorization, mutation, or enforcement [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:1843] [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:1850]. Nothing consumes the result for access decisions, so removing the `ROUTER.md` row cannot downgrade a control.
- No injection surface added. `authority` is validated by `FOUR_PART_VERSION` before it is interpolated [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:1845]; a follower `value` is rendered through `JSON.stringify` in the malformed branch [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:1859]; `file` is a hardcoded literal in the loop [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:1862].
- No ReDoS. `FOUR_PART_VERSION` is an anchored linear pattern, `[0-9]+` with one bounded group; the change applies it to one fewer input [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:150].
- No path surface added. `markdownVersion` joins `ctx.target` with a fixed caller-supplied name [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:1761]; the diff removes one read and adds none.
- Test isolation holds. `runChecker` spawns the checker with an argv array (no shell string) [SOURCE: .skilled/commands/doctor/scripts/tests/parent-skill-check-invariants.test.cjs:265]; the new test mutates only its own `buildHub()` copy and pins both the absence of a 13a FAIL and the 13a PASS line [SOURCE: .skilled/commands/doctor/scripts/tests/parent-skill-check-invariants.test.cjs:441].
- No secret, dependency, or manifest change; the twins' activity lists the five remaining carriers and contains no remaining `ROUTER.md` version entry [SOURCE: .skilled/commands/create/assets/create-changelog-auto.yaml:666] [SOURCE: .skilled/commands/create/assets/create-changelog-confirm.yaml:601].

## Findings by Severity

### P0 — Blockers

None.

### P1 — Required

None new. Prior finding `R1-P1-001` (three live docs still claim a hub `ROUTER.md` carries the SKILL.md/release version, `.skilled/skills/sk-doc/sk-create-changelog/SKILL.md:261`) remains active; it is a documentation/traceability defect with no security mechanism, and it is not re-reported from this dimension.

### P2 — Suggestions

None.

## Traceability Checks

| Check | Status | Evidence |
|-------|--------|----------|
| `spec_code` core | partial | Unchanged from iteration 1: REQ-001/002 hold; REQ-003/004 remain contradicted by the three live docs; the spec defines no security requirement this diff could satisfy or break |
| `checklist_evidence` core | partial | `tasks.md` T002 and CHK-FIX-002 remain open; security adds no new checklist item |
| `skill_agent` overlay | covered by R1-P1-001 | Skill instructions vs the changed twins — documented in iteration 1 |
| `agent_cross_runtime` overlay | notApplicable | No agent definitions in the diff |
| `feature_catalog_code` overlay | notApplicable | No feature-catalog resource touched |
| `playbook_capability` overlay | notApplicable | No playbook capability touched |

Ruled out this iteration (recorded in the delta and ledger rows SL-008..SL-015): auth bypass via the narrowed check, injection via the changed messages, ReDoS in the version regex, path traversal in checker/test file access, secret exposure, tamper-detection regression, and test isolation failure; supply chain is not applicable.

## Next Dimension

Maintainability over the same target: comment accuracy at `.skilled/commands/doctor/scripts/parent-skill-check.cjs:1839`, twin parity after the removal, and the durability of the `frontmatter-versioning.md:122` paragraph and its new own-edition sentence at `:124`.

## Verdict

Security finds nothing to fix in this diff: the narrowing removes no control, and the changed surfaces add no injection, path, secret, DoS, or isolation risk. The session verdict stays CONDITIONAL because `R1-P1-001` remains open from iteration 1.

Review verdict: CONDITIONAL
