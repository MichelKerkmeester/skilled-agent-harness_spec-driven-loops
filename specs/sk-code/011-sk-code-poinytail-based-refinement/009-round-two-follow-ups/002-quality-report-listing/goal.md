---
title: "Goal: Phase 2: quality-report-listing"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "goal binding"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/009-round-two-follow-ups/002-quality-report-listing"
    last_updated_at: "2026-10-10T08:38:12Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-009-002-quality-report-listing"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: Phase 2: quality-report-listing

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** List the ceiling report and its test in the sk-code-quality SKILL.md with one line on when to run the report, and record the addition with a version bump and a matching changelog file.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The bump is minor, 1.0.1.0 to 1.1.0.0, because a newly listed runnable script is a new bundled resource and not a wording repair. The SKILL.md `version:`, the README `version:` and the changelog file name all read 1.1.0.0. |
| D2 | SKILL.md lists the report at three places: Resource Domains, Resource Loading Levels and the Scripts list, which also lists the test. It always gives the direct form `scripts/ceiling-report.sh [<file>...]`, never `bash`, because the file is a Python program with a `.sh` name. The Smart Routing diagram and the `INTENT_SIGNALS` block do not change. |
| D3 | The report, its test and `scripts/README.md` do not change. The quality README gets two rows because it already lists the two checkers. |
| D4 | The compiled sk-code manifest is checked and re-minted only if its freshness check says stale, because it hashes the hub-root files and not this child SKILL.md. The Hermes copy regeneration belongs to the orchestrator, and the builder runs only its `--check` form. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] From the repository root, `rg -n 'ceiling-report' .skilled/skills/sk-code/sk-code-quality/SKILL.md; echo "exit=$?"` prints four lines, at line 93 (Resource Domains bullet), 111 (loading-table row), 320 (report bullet) and 321 (test bullet), and `exit=0`.
- [ ] From the repository root, `rg -n '^version:' .skilled/skills/sk-code/sk-code-quality/SKILL.md .skilled/skills/sk-code/sk-code-quality/changelog/v1.1.0.0.md; echo "exit=$?"` prints `.skilled/skills/sk-code/sk-code-quality/SKILL.md:5:version: 1.1.0.0` and `.skilled/skills/sk-code/sk-code-quality/changelog/v1.1.0.0.md:11:version: 1.1.0.0`, and `exit=0`.
- [ ] From the repository root, `bash .skilled/skills/sk-code/sk-code-quality/scripts/ceiling-report.test.sh; echo "exit=$?"` prints eight `PASS` lines, `All ceiling report test cases passed` and `exit=0`.
- [ ] From the repository root, `python3 -I .skilled/skills/sk-doc/shared/scripts/validate_document.py .skilled/skills/sk-code/sk-code-quality/SKILL.md && python3 -I .skilled/skills/sk-doc/shared/scripts/validate_document.py .skilled/skills/sk-code/sk-code-quality/changelog/v1.1.0.0.md; echo "exit=$?"` prints `VALID` and `Total issues: 0` once for each file, and `exit=0`.
- [ ] From the repository root, `node .skilled/bin/compiled-route-guard.cjs && node .skilled/skills/sk-doc/sk-create-skill/scripts/ci-leaf-manifest-freshness.cjs; echo "exit=$?"` prints `sk-code                     fresh`, ends with `checked=14 fresh=14 failed=0` and prints `exit=0`.
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/011-sk-code-poinytail-based-refinement/009-round-two-follow-ups/002-quality-report-listing --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Criterion 1, SKILL.md lists the report (REQ-001) | Done | `rg -n 'ceiling-report'` printed lines 93, 111, 320 and 321, `exit=0` |
| Criterion 2, version and changelog file agree (REQ-002) | Done | `SKILL.md:5:version: 1.1.0.0` and `v1.1.0.0.md:11:version: 1.1.0.0`, `exit=0` |
| Criterion 3, report test passes with the script unchanged (REQ-003) | Done | Eight `PASS` lines and `All ceiling report test cases passed`, `exit=0`, nothing changed under `scripts/` |
| Criterion 4, document validator passes on SKILL.md and the changelog (REQ-006) | Done | `VALID` and `Total issues: 0` for each file, `exit=0` |
| Criterion 5, compiled sk-code manifest and leaf manifests fresh (REQ-004, REQ-005) | Done | `sk-code                     fresh` and `checked=14 fresh=14 failed=0`, `exit=0`. No re-mint ran |
| Criterion 6, validate.sh --strict prints RESULT: PASSED | Done | Final run printed `RESULT: PASSED`, `exit=0` |
| Orchestrator rerun | Done | All six criteria rerun by the orchestrator on 2026-10-10 from the final tree, each passing |

### Deviations and findings

| Item | Note |
|------|------|
| The brief's usage command does not run | `bash ceiling-report.sh --help` fails: the file is Python, so bash prints `import: command not found` and exits 2 (observed once at planning time, and not to be repeated because bash runs the Python lines as shell commands). Run directly, `--help` prints `ceiling-report: unknown option --help` and exits 2 because the program has no help flag. Its usage is the module docstring at lines 2 to 25, and the listing gives the direct form. |
| The re-mint is conditional | The compiled manifest hashes `SKILL.md`, `hub-router.json` and `mode-registry.json` under the hub root only (`.skilled/bin/lib/compiled-route-manifest.cjs:435-438`), so an edit to the child `sk-code-quality/SKILL.md` leaves it fresh. The builder checks first and refreshes only on a stale result with no hub input edited by a sibling build. |
| The quality README has two wrong neighbours | Its Verification table runs `check-comment-hygiene.sh` and `check-dist-staleness.sh` through `bash`, and both are Python programs, so those commands fail. The new row uses the direct form and the neighbours are reported, not corrected. |
| The Hermes baseline was not clean | The planned baseline was `PASS: 70 Hermes skill copies in sync`. At build time `sync-skills-hermes.cjs --check` already exited 1 with `DRIFT agent-deep-review`, from a sibling build editing `.skilled/agents/deep-review.md`. After this edit it names `DRIFT sk-code-quality` as well, which is the expected deferred regeneration. Neither is repaired here. |
<!-- /ANCHOR:log -->
