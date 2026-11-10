# Review Iteration 003 — Traceability

## Dimension

Traceability: core protocols `spec_code` and `checklist_evidence`; overlays `feature_catalog_code` and `playbook_capability`.

## Dispatcher

Single `deep-review` iteration, generation 1, session `2026-10-15T13:35:35.122Z`. The review stayed read-only outside the assigned review packet.

## Files Reviewed

- Battery and tests: [SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:675], [SOURCE: .skilled/commands/doctor/scripts/tests/git-setup-check.test.cjs:130].
- Setup route and visible contract: [SOURCE: .skilled/commands/doctor/git.md:3], [SOURCE: .skilled/commands/doctor/_routes.yaml:275], [SOURCE: .skilled/commands/doctor/assets/doctor-git-setup.yaml:40], [SOURCE: .skilled/commands/doctor/assets/doctor-git-presentation.txt:57].
- sk-git docs and scenario: [SOURCE: .skilled/skills/sk-git/SKILL.md:269], [SOURCE: .skilled/skills/sk-git/README.md:232], [SOURCE: .skilled/skills/sk-git/feature-catalog/workflow-playbooks/doctor-git-settings.md:17], [SOURCE: .skilled/skills/sk-git/manual-testing-playbook/doctor-commands/doctor-git-setup-check.md:55].
- Other target inventories: [SOURCE: .skilled/commands/README.txt:167], [SOURCE: .skilled/skills/sk-git/feature-catalog/feature-catalog.md:163], [SOURCE: README.md:1256], [SOURCE: README.md:1505].
- 033 evidence packet and 034 round-trip claims: [SOURCE: specs/sk-git/033-git-setup-customization/002-doctor-git-setup/acceptance-criteria.md:55], [SOURCE: specs/sk-git/033-git-setup-customization/002-doctor-git-setup/tasks.md:35], [SOURCE: specs/sk-git/033-git-setup-customization/002-doctor-git-setup/implementation-summary.md:76], [SOURCE: specs/sk-git/034-standards-template-round-trip/spec.md:34], [SOURCE: specs/sk-git/034-standards-template-round-trip/tasks.md:34], [SOURCE: specs/sk-git/034-standards-template-round-trip/tasks.md:50].
- Attempted serializer probe: `.skilled/skills/sk-git/scripts/git-standards.cjs` was absent; the canonical implementation path remains unverified.

## Findings by Severity

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **AC-002 cites tests that do not assert the human rows or repair lines** — [SOURCE: specs/sk-git/033-git-setup-customization/002-doctor-git-setup/acceptance-criteria.md:55]. The JSON test asserts eleven JSON rows and field types; the human-mode test checks only the final status line and exit code. The current renderer does print rows and conditional repair lines, but the cited tests would not catch their removal. [SOURCE: .skilled/commands/doctor/scripts/tests/git-setup-check.test.cjs:130] [SOURCE: .skilled/commands/doctor/scripts/tests/git-setup-check.test.cjs:157] [SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:675] [SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:679]
Finding class: matrix/evidence
Scope proof: AC-002 and its cited battery tests are inside the declared 033 packet and review scope.
Affected surface hints: acceptance-criteria.md, git-setup-check.test.cjs, git-setup-check.cjs human renderer.
Case: If renderHuman stops adding a check row or omits `repair:` for a failing check, the cited JSON and final-STATUS assertions still pass while AC-002 remains marked Met.

2. **Completed baseline tasks cite scratch-only evidence** — [SOURCE: specs/sk-git/033-git-setup-customization/002-doctor-git-setup/tasks.md:35]. 033 T002 says helper-output confirmations were scratch notes only. 034 T001 also says its parsed baseline was scratch-only, and T003 reports a `cmp` result without naming a retained artifact. This is an evidence-retention gap, not evidence that the current serializer or template is wrong. [SOURCE: specs/sk-git/034-standards-template-round-trip/tasks.md:34] [SOURCE: specs/sk-git/034-standards-template-round-trip/tasks.md:50]
Finding class: matrix/evidence
Scope proof: Both task files are named review targets, and the checked rows describe scratch-only or unlocated comparison evidence.
Affected surface hints: 033 tasks.md, 034 tasks.md, 034 template/serializer round-trip evidence.
Case: If the baseline output or parsed rules block differed from the implementation input, the checked rows retain no bytes or path with which a later reviewer could detect the mismatch.

## Traceability Checks

- Core `spec_code`: partial. The 033 checker claims were compared with the current renderer and the observed battery run. The 034 serializer implementation was not verified because the attempted source path was absent.
- Core `checklist_evidence`: two P2 evidence gaps recorded above.
- Overlay `feature_catalog_code`: confirmed; the feature catalog names setup and describes it as read-only.
- Overlay `playbook_capability`: confirmed for the expected output shape. `node .skilled/commands/doctor/scripts/git-setup-check.cjs --repo . --tool claude` printed eleven rows with result/source lines and `STATUS=OK checks=11`; exit 0.
- Skill and route naming: the command hint, route row, setup workflow, sk-git skill/README, feature playbook, manual scenario, command index and both root README surfaces name setup.
- Cross-runtime adapter behavior was not re-audited in this dimension; the six-adapter implementation remains outside this traceability conclusion.

## Integration Evidence

Named surfaces checked: `.skilled/commands/doctor/git.md`, `.skilled/commands/doctor/_routes.yaml`, `assets/doctor-git-setup.yaml`, `assets/doctor-git-presentation.txt`, sk-git `SKILL.md` and `README.md`, the workflow playbook, DOC-384, `.skilled/commands/README.txt`, the feature-catalog index, and the root README. The current battery run matched DOC-384's row/source/status expectations.

## Edge Cases

- DOC-384's run was all PASS, so the direct run did not exercise a printed human repair line; the renderer condition is present, but the cited test gap remains.
- The 034 serializer source path was not resolved. No template-to-serializer behavioral conclusion is claimed.

## Confirmed-Clean Surfaces

- The named target lists include `setup`; no omission was found in the scanned route, presentation, skill, feature-catalog, playbook, command-index or root README surfaces.
- DOC-384's expected eleven-row human output and final `STATUS` shape matched the observed battery run.

## Ruled Out

- A setup target omission in the named `/doctor:git` lists: exact searches found setup in the route, presentation valid-target line, docs, playbook, command index and root README.
- A DOC-384 output-shape mismatch on this checkout: observed eleven rows and final `STATUS=OK checks=11`, exit 0.

## Scope Violations

None.

## Verdict

PASS for this iteration: no P0/P1 findings; two P2 evidence findings. Earlier active P1 findings remain in the broader review state, so this is not the session's release verdict.

## Next Dimension

Maintainability. Carry the unverified 034 serializer implementation path forward for a focused cross-reference check if it remains open.

Review verdict: PASS
