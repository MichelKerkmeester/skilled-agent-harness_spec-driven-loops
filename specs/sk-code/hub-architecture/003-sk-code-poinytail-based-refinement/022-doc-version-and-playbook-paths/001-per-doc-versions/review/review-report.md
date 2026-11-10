# Deep Review Report: Per-doc versions

## 1. Executive Summary

- **Overall verdict:** CONDITIONAL
- **hasAdvisories:** false (the verdict is CONDITIONAL, so the P2 items are listed as findings, not advisories)
- **Active findings:** P0 0, P1 1, P2 8
- **Scope:** the commits 41302e72be..aa89063bca on `worktrees/119-docver-per-doc`, 61 files listed in `deep-review-config.json` `reviewScopeFiles`, plus the bulk restore (a8d0dd7c2a) and the 68-doc start (3e848d1303) read through `git show --stat` and spot checks.
- **Run:** 5 iterations, `/deep:review :auto`, executor cli-pi `deepseek-v4.1-flash` (resolves to `llmgateway/deepseek-v4.1-flash`) at max reasoning, stop policy `max-iterations`. Every iteration passed `verify-iteration.cjs` with no write-containment violation. All four dimensions covered; iteration 5 found nothing new.

The code-side claims traced clean: the 2,845-line restore, the 21 quoted values, the 68 first-time versions, the 22 frontmatter additions, the single sk-doc release and the template seeding all match their commits. The one P1 is the packet record, not shipped behavior.

## 2. Planning Trigger

`/speckit:plan` is not required: every finding maps to a small fix inside this phase's own scope, applied in the remediation commit that follows this review.

```json
{
  "triggered": false,
  "verdict": "CONDITIONAL",
  "hasAdvisories": false,
  "activeFindings": ["R3-P1-001", "R1-P2-001", "R1-P2-002", "R1-P2-003", "R2-P2-001", "R2-P2-002", "R2-P2-003", "R3-P2-001", "R4-P2-001"],
  "remediationWorkstreams": ["packet record", "engine edge cases", "scope mirror comments", "standard wording"],
  "specSeed": "None: the fixes stay inside 001-per-doc-versions",
  "planSeed": "None",
  "findingClasses": {"R3-P1-001": "matrix/evidence", "R1-P2-001": "instance-only", "R1-P2-002": "class-of-bug", "R1-P2-003": "class-of-bug", "R2-P2-001": "class-of-bug", "R2-P2-002": "class-of-bug", "R2-P2-003": "instance-only", "R3-P2-001": "instance-only", "R4-P2-001": "UNKNOWN"},
  "affectedSurfacesSeed": ["frontmatter-version.mjs bump and verify", "pre-commit doc-version gate", "skill-doc-frontmatter.yml", "package_skill.py", "post-edit-router.cjs", "implementation-summary.md", "goal.md"],
  "fixCompletenessRequired": true
}
```

## 3. Active Finding Registry

| ID | Sev | Dimension | Title | File:line | Disposition |
|----|-----|-----------|-------|-----------|-------------|
| R3-P1-001 | P1 | traceability | The packet's ledger, acceptance evidence and task state are unwritten | `implementation-summary.md:48` | Fix: fill the ledger, Tests table, acceptance rows and tasks |
| R1-P2-001 | P2 | correctness | `verify` rejects a leading-zero version the other modes accept | `frontmatter-version.mjs:305` | Fix: a child doc's derived value is its normalized tuple |
| R1-P2-002 | P2 | correctness | A `version:` key with no value is treated as missing and duplicated | `frontmatter-version.mjs:110` | Fix: an empty value is a present, malformed version |
| R1-P2-003 | P2 | correctness | A move with a rewritten body is an add, so nothing is raised | `frontmatter-version.mjs:346` | Fix in the standard: state the rename-threshold behavior |
| R2-P2-001 | P2 | security | A line break in a staged doc path skips the raise staging | `pre-commit:898` | Fix: `bump` refuses such a path with an error |
| R2-P2-002 | P2 | security | A worktree symlink lets the raise write outside the skills tree | `frontmatter-version.mjs:437` | Fix: `bump` refuses a symlinked doc; `apply` checks the real path |
| R2-P2-003 | P2 | security | The PR job runs the pull request's own engine | `skill-doc-frontmatter.yml:78` | Rejected, reason below |
| R3-P2-001 | P2 | traceability | The 22-doc frontmatter addition has no recorded D1 amendment | `goal.md:44` | Fix: record the amendment and its operator decision in `goal.md` |
| R4-P2-001 | P2 | maintainability | The three scope copies diverge on two classes while claiming to mirror | `package_skill.py:125`, `post-edit-router.cjs:120` | Fix: correct the mirror comments to name the two deliberate exceptions |

Evidence, impact and recommendation for each finding are in `iterations/iteration-00N.md` under the finding's ID.

## 4. Remediation Workstreams

1. **P1, packet record:** fill `implementation-summary.md` (ledger PV-R1 to PV-R8, Tests table), `acceptance-criteria.md`, `tasks.md`, `goal.md` log and `spec.md` status.
2. **P2, engine edge cases:** R1-P2-001, R1-P2-002, R2-P2-001, R2-P2-002 in `frontmatter-version.mjs`, each with a test that fails before and passes after.
3. **P2, wording:** R1-P2-003 in `frontmatter-versioning.md`; R4-P2-001 in the two mirror comments; R3-P2-001 in `goal.md`.
4. **Rejected:** R2-P2-003. The pull-request job is a safety net for a missed raise, not a guard against a hostile author. Every CI check in this repository runs the code of the pull request under test, and a change to the engine is itself code under review. Pinning a base-ref copy would need the engine's shared imports from the base ref too. Prevent-overengineering: no current requirement earns it.

## 5. Spec Seed

- None. All fixes are inside the phase's frozen scope.

## 6. Plan Seed

- None. The remediation is one commit plus the packet record.

## 7. Traceability Status

**Core protocols**

| Protocol | Status | Evidence |
|----------|--------|----------|
| `spec_code` | partial at review time | REQ-001 to REQ-004 and REQ-006 to REQ-008 pass; REQ-005 failed on the unwritten ledger (R3-P1-001); REQ-009 partial until the Tests table is recorded |
| `checklist_evidence` | fail at review time | acceptance rows Unmet, T012 to T014 unchecked (R3-P1-001) |

**Overlay protocols**

| Protocol | Status | Evidence |
|----------|--------|----------|
| `skill_agent` | pass | sk-doc SKILL.md 2.3.7.0 equals the new changelog entry |
| `agent_cross_runtime` | pass | `.hermes/skills/sk-doc/SKILL.md` regenerated in aa89063bca |
| `feature_catalog_code` | partial | 611 of 653 catalog docs carry a version; the rest are out-of-scope classes, not traced per file |
| `playbook_capability` | partial | 1,465 of 1,481 playbook docs carry a version; same caveat |

AC_COVERAGE: advisory only; the phase has `acceptance-criteria.md` rather than `checklist.md`.

resource-map.md not present at init; skipping the Resource Map Coverage Gate. The reducer emitted `review/resource-map.md` from the deltas.

## 8. Deferred Items

- A parity test that runs one path matrix through the engine, packager and router (R4-P2-001's stronger fix). The corrected comments name the two deliberate differences; a test earns its place only if a third copy appears.
- `*-fixture` folders in the scope rule: no doc with frontmatter sits in one today.

## Dimension Expansion Map

No divergent pivots, saturated directions or Council artifacts: the run used the default convergence mode with stop policy `max-iterations`. Remaining frontier: none named by iteration 5.

## 9. Search Ledger

*No search-depth state captured (legacy v1 record)*

## 10. Audit Appendix

- **Convergence:** iteration ratios 1.0, 0.5, 0.25, 0.11, 0.0. Graph convergence reported STOP_BLOCKED while a P1 was open; the stop policy kept the loop to 5 iterations as configured.
- **Coverage:** correctness (1, 5), security (2, 5), traceability (3, 5), maintainability (4, 5).
- **Adversarial self-check on R3-P1-001:** re-read `implementation-summary.md` at HEAD aa89063bca: it still says "Nothing yet". Confirmed P1; it blocks packet closure under REQ-005, and no shipped behavior depends on it.
- **Reproduction:** every P2 the remediation fixes was reproduced first in a throwaway git repository with the engine at aa89063bca (verify exit 1 on `01.2.0.0`; two `version` lines after `bump` on an empty key; `bump --check` exit 0 on a rewritten move; a split path printed for `new\nline.md`; the raise written through a symlink to a file outside the repository).
- **Sources reviewed:** the 61 scope files, the five iteration narratives and deltas, `git show --stat` for a8d0dd7c2a and 3e848d1303.

**Core Protocols:** `spec_code`, `checklist_evidence`.
**Overlay Protocols:** `skill_agent`, `agent_cross_runtime`, `feature_catalog_code`, `playbook_capability`.
