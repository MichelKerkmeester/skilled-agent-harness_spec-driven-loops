# Deep Review — Iteration 003

- Run: 2026-10-13T07:13:05.484Z (generation 1, lineage new)
- Dimension: traceability (core `spec_code`, `checklist_evidence`; overlays `skill_agent`, `agent_cross_runtime`, `feature_catalog_code`, `playbook_capability`)
- Target: commits `9d1168bf3a` and `95698b591b`, diff `455f2a2d8c..95698b591b`
- Mode: single_review_iteration, externalized state

## Dimension

Traceability of the phase packet against HEAD: (1) re-ran the spec-to-code mapping for VP-1..VP-4 / REQ-001..REQ-005, (2) re-verified the open prior finding R1-P1-001 at HEAD and widened the same-class inventory grep to every directory task T002 names and beyond, (3) checked the four overlay protocols for live claims or resources the change affects, and (4) statically re-ran goal criteria 1, 2 and 4 and read the closure state of `tasks.md`, `acceptance-criteria.md`, `implementation-summary.md` and `plan.md`.

## Files Reviewed

| File | What was checked |
|------|------------------|
| `.skilled/commands/doctor/scripts/parent-skill-check.cjs:1839` | 13a comment, follower list, failure branches, pass message vs REQ-001/REQ-002 |
| `.skilled/commands/doctor/scripts/tests/parent-skill-check-invariants.test.cjs:441` | T1: fixture mutation (`stage1Router`, line 107), assertions, existing 13a FAIL cases (`:406`, `:515`) |
| `.skilled/commands/create/assets/create-changelog-auto.yaml:665` | Global version-copy list vs REQ-003 (diff hunk; ROUTER.md absent) |
| `.skilled/commands/create/assets/create-changelog-confirm.yaml:600` | Twin parity vs REQ-003 (diff hunk) |
| `.skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md:122` | Enforcement paragraph and own-edition sentence (`:124`) vs REQ-004 |
| `.skilled/skills/sk-doc/SKILL.md:17` | R1-P1-001 site, re-verified live at HEAD |
| `.skilled/skills/sk-doc/sk-create-changelog/SKILL.md:261` | R1-P1-001 site, re-verified live at HEAD |
| `.skilled/skills/sk-doc/sk-create-skill/references/skill/examples-and-maintenance.md:181` | R1-P1-001 site, re-verified live at HEAD |
| `.skilled/skills/sk-code/SKILL.md:17` | New site: version-authority paragraph still lists ROUTER.md |
| `.skilled/skills/system-deep-loop/SKILL.md:14` | New site: same claim |
| `.skilled/skills/cli-external-orchestration/SKILL.md:17` | New site: same claim |
| `.skilled/skills/system-skill-advisor/` (whole tree) | T002 third directory: no version-parity claim found |
| `spec.md`, `goal.md`, `tasks.md`, `plan.md`, `acceptance-criteria.md`, `implementation-summary.md` | REQ/VP mapping, goal criteria static checks, ledger/closure state |
| `scratch/review-diff.patch` | Exact hunks for all five changed files |

Spec-to-code mapping at HEAD `95698b591b` (all verified by direct read):

- **REQ-001 / VP-1** — met. `ROUTER.md` is absent from the follower list; only the three JSON files remain [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:1850]. The pass message is JSON-only [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:1866].
- **REQ-002 / VP-1** — met. The mismatch and malformed branches still `softFail`, and the regression case that a differing `description.json` fails 13a is untouched [SOURCE: .skilled/commands/doctor/scripts/tests/parent-skill-check-invariants.test.cjs:515].
- **REQ-003 / VP-3** — met. Both twins dropped the identical `ROUTER.md frontmatter version:` line with no other difference in the activity [SOURCE: .skilled/commands/create/assets/create-changelog-auto.yaml:665] [SOURCE: .skilled/commands/create/assets/create-changelog-confirm.yaml:600].
- **REQ-004 / VP-4** — met. The paragraph now names only the three JSON files and adds the own-edition sentence [SOURCE: .skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md:122] [SOURCE: .skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md:124]. The doc's `1.0.3.0 → 1.0.4.0` raise follows the Section 4 bump rule.
- **REQ-005** — deferred. Runtime acceptance (tests, `run-all.sh`, six hubs) is not executed in a read-only review iteration.

## Findings by Severity

### P0 — Blockers

None.

### P1 — Required

#### R3-P1-001 — Same-class inventory undercount: three more hub SKILL.md files still claim a hub ROUTER.md carries the release version (extends R1-P1-001)

- Case: A hub author or release operator in `sk-code`, `system-deep-loop` or `cli-external-orchestration` reads their hub's `SKILL.md` version-authority paragraph, believes `ROUTER.md` carries the hub release version, and syncs or expects that parity. After any `ROUTER.md` body edit the pre-commit bump raises its own edition, the versions differ, and no gate reports it because this phase removed `ROUTER.md` from 13a.
- File: `.skilled/skills/sk-code/SKILL.md:17`
- Evidence:
  - `sk-code/SKILL.md:17` — "`description.json`, `mode-registry.json`, `hub-router.json`, `ROUTER.md` and `README.md` carry the same value, so every hub-root artifact states the same release." [SOURCE: .skilled/skills/sk-code/SKILL.md:17]
  - `system-deep-loop/SKILL.md:14` — "`description.json`, `mode-registry.json`, `hub-router.json`, and `ROUTER.md` carry the same value..." [SOURCE: .skilled/skills/system-deep-loop/SKILL.md:14]
  - `cli-external-orchestration/SKILL.md:17` — same list and claim as `system-deep-loop` [SOURCE: .skilled/skills/cli-external-orchestration/SKILL.md:17]
  - All three contradict the reviewed change [SOURCE: .skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md:124] and the follower list [SOURCE: .skilled/commands/doctor/scripts/parent-skill-check.cjs:1850], and duplicate the defect class of the still-open R1-P1-001 (`sk-doc/SKILL.md:17`, `sk-create-changelog/SKILL.md:261`, `examples-and-maintenance.md:181` — all re-verified live at HEAD). R1-P1-001's scope proof covered only `.skilled/commands` and `.skilled/skills/sk-doc`, so these three hub files were never swept. The spec's in-scope bullet ("every other claim that a hub `ROUTER.md` carries the `SKILL.md` version, found by grep, is corrected or listed with its reason") is not file-scoped; `tasks.md` T002 is still unchecked. `sk-code:17` also lists `README.md`, already contradicted by the retired 13c, showing the paragraph is a shared hub template line left stale across hubs.
- User impact: Hub documentation teaches release parity that the changed behavior no longer produces or checks; authors following their own hub docs recreate exactly the drift this phase exists to end.
- Finding class: class-of-bug
- Scope proof: `rg -n 'ROUTER\.md'` over `.skilled/commands` and `.skilled/skills` (md/yaml/json; excluding `changelog/`, `benchmark/`, `reports/`, `node_modules/`), filtered to version-context lines, returned exactly three additional live claims beyond R1-P1-001's three. The other hubs are clean: `mcp-tooling/SKILL.md` and `sk-design/SKILL.md` carry no version-authority ROUTER.md line; `create-skill-parent-*.yaml` and `parent-skill-hub-template.md` state only the presence/four-part-format rule that `spec.md` keeps out of scope; `.skilled/skills/system-skill-advisor` (T002's third directory) carries no version-parity claim.
- Affected surface hints: ["hub SKILL.md version-authority paragraph", "create-changelog skill instructions", "sk-doc maintenance reference", "same-class inventory task T002"]
- Claim adjudication:
  - Claim: The spec's same-class inventory is incomplete beyond the three sites R1-P1-001 recorded; three more live hub `SKILL.md` files still state that `ROUTER.md` carries the release version.
  - evidenceRefs: [".skilled/skills/sk-code/SKILL.md:17", ".skilled/skills/system-deep-loop/SKILL.md:14", ".skilled/skills/cli-external-orchestration/SKILL.md:17", ".skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md:124", ".skilled/commands/doctor/scripts/parent-skill-check.cjs:1850", "tasks.md:35"]
  - counterevidenceSought: Checked whether the lines are historical or generated (live files at HEAD); swept T002's third directory (clean); swept every md/yaml/json under `.skilled/commands` and `.skilled/skills` for version-context `ROUTER.md` claims (only these three plus the R1-P1-001 sites); checked hub templates and create-skill YAML (presence/format only, consistent with own-edition).
  - alternativeExplanation: The builder may still intend to complete T002 before closure (it is unchecked), or may treat these hub paragraphs as outside the phase's file list. The spec's inventory bullet is not file-scoped and T002's grep is the declared mechanism, so the obligation covers them; if T002 later corrects or lists them, this finding downgrades per its trigger.
  - finalSeverity: P1
  - confidence: 0.85
  - downgradeTrigger: If T002 completes and the sites are corrected or listed with a reason in `tasks.md`/`implementation-summary.md`, or a follow-up commit corrects them, resolve or downgrade to P2. The class closes when every live claim agrees with `frontmatter-versioning.md:124`.
- Recommendation: Complete T002 over the whole tree: correct the version-authority paragraph in all four hubs (`sk-code`, `sk-doc`, `system-deep-loop`, `cli-external-orchestration`) together with the two sk-doc instruction sites R1-P1-001 named — drop `ROUTER.md` from the release-copy list and state that it keeps its own edition — and record each site in `tasks.md`/`implementation-summary.md` or correct it.

#### R1-P1-001 — prior finding re-verified open (not re-reported)

All three recorded sites are live at HEAD `95698b591b` (`sk-doc/SKILL.md:17`, `sk-create-changelog/SKILL.md:261`, `examples-and-maintenance.md:181`), `tasks.md` T002 and CHK-FIX-002 remain unchecked, and `implementation-summary.md` still holds no inventory entry. R3-P1-001 extends this same defect class with three more sites.

### P2 — Suggestions

None.

## Traceability Checks

| Protocol / Check | Status | Evidence |
|------------------|--------|----------|
| `spec_code` core | partial | REQ-001..REQ-004 each map to a verified change at HEAD; REQ-005 deferred (runtime); the scope bullet's same-class inventory remains unmet and wider than recorded (R3-P1-001) |
| `checklist_evidence` core | partial | `tasks.md` T002 and CHK-FIX-002 open; goal criterion 1 holds statically (checker `file: 'ROUTER.md'` count 0; twins `ROUTER.md frontmatter version` count 0); goal criterion 2 holds statically (`parent-skill doctor` line count with `ROUTER.md` = 0); goal criterion 4 currently holds 0 VP/T1 rows — owned by closure task T009; criteria 3, 5, 6, 7 not run in a read-only iteration |
| `skill_agent` overlay | partial | Hub/skill instructions vs changed behavior: R1-P1-001 plus R3-P1-001 |
| `agent_cross_runtime` overlay | notApplicable | No agent definition or cross-runtime surface in the diff or the wide sweep |
| `feature_catalog_code` overlay | notApplicable | Wide sweep found no feature-catalog claim about ROUTER.md version parity |
| `playbook_capability` overlay | notApplicable | Playbooks touch `ROUTER.md` routing/reach only (e.g. `doctor-skill-advisor-router-reach.md:14`), never version parity |

Closure-state read (informational, not a finding at this revision): `spec.md` Status is still "Planned", `acceptance-criteria.md` marks AC-001..AC-005 `Unmet` with closeable "No", `implementation-summary.md` is still the scaffold, and every `tasks.md` box is unchecked including the implemented T003–T006. The packet is mid-flight (review iteration 3 of 5); T007–T009 own the ledger, RV rows and closure sync.

## Ruled Out This Iteration

- T002's third directory `.skilled/skills/system-skill-advisor` is clean: only a historical changelog line and `doctor-skill-advisor-router-reach.md:14` (routing reach, not versions) mention `ROUTER.md`.
- Goal criterion 4's missing VP/T1 ledger rows are pre-closure bookkeeping owned by task T009, not a defect of the reviewed revision.
- `plan.md` still describes the pre-change follower list ("`ROUTER.md` and three JSON files"); it is a planning-time artifact, `spec.md` Files to Change does not name it, and CHK-040/T009 own plan-doc sync at closure.
- No overlay defect beyond `skill_agent`: agent definitions, feature catalogs and playbooks carry no version-parity claim.
- Runtime acceptance (goal criterion 3: invariants test, `run-all.sh`, six hubs) was not executed in this read-only iteration; recorded as deferred for the closure gate.

## Next Dimension

Maintainability (last uncovered dimension): whether the changed comment, the pass-message wording and the twins' list wording are durable without the removed line, whether the new test's name and fixture stay aligned with T1, and whether the standard's own-edition sentence survives the next bump untouched. Residual traceability follow-up: whether T002 closes the six known stale sites or records each with a reason.

## Verdict

The diff-internal change maps cleanly to REQ-001..REQ-004 and the goal's static criteria 1 and 2 hold at HEAD. The session verdict stays CONDITIONAL: the spec's same-class inventory is still unmet, R1-P1-001 remains open, and this iteration found three additional live hub `SKILL.md` claims of the same class that its recorded sites did not cover.

Review verdict: CONDITIONAL
