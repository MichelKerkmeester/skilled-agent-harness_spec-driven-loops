# Deep Review Strategy - Skill Authoring Remediation (lineage dsflash-llmgw)

Review target: commits `191aea6baa..03e31f902b` (base `bb3878b570`) on branch `worktrees/095-skill-authoring-ux-research`.
Authority for scope and focus: `steer.md` in this lineage directory (lead rulings). File list: the phase's `goal-file-manifest.txt`.

## 1. OVERVIEW

### Purpose

Persistent brain for this fan-out lineage's deep review of the skill-authoring remediation commits. The lead's steer fixes five iteration focuses; stop policy is `max-iterations` (cap 5), so convergence signals are telemetry only and every iteration runs.

### Usage

- **Init:** populated here from `steer.md`, the manifest, and the commit range.
- **Per iteration:** one steer focus; findings, coverage, and Next Focus updated in place.

## 2. TOPIC

Review of the changes in commits `191aea6baa..03e31f902b` (base `bb3878b570`) on branch `worktrees/095-skill-authoring-ux-research`, file list `goal-file-manifest.txt`:
1. `191aea6baa` plans the remediation phases
2. `d3b9e272d8` cuts the refinement parent goal back under budget
3. `8011f1b408` records the hub version-copy reader search; drops the removal
4. `410df0acce` pre-commit `gate:skill-authoring` + untrusted-clone notice
5. `7bbb7f0f20` changelog workflows number against upstream and write every carrier
6. `dffd7f98e2` create-skill guidance; leaf-manifest stale message
7. `479186cfed` advisor name-mention scoring (TS explicit lane; Python mirror)
8. `eeb6285a8e` `surfaceHint` passthrough; package `engines`
9. `827e44abc8` cli-classifier vocabulary + compiled graph refresh; freshness panel; CI steps
10. `03e31f902b` catalog and package validator false positives

## 3. REVIEW DIMENSIONS (remaining)

<!-- MACHINE-OWNED: START -->
- [ ] D1 Correctness, Logic errors, off-by-one, wrong return types, broken invariants
- [ ] D2 Security, Injection, auth bypass, secrets exposure, unsafe deserialization
- [ ] D3 Traceability, Spec/code alignment, checklist evidence, cross-reference integrity
- [ ] D4 Maintainability, Patterns, clarity, documentation quality, safe follow-on change cost
<!-- MACHINE-OWNED: END -->

## 4. NON-GOALS

- Python advisor battery scoring 9/17 instead of 13/17: lead traced to the local fallback scorer, identical on an untouched tree. Do not spend an iteration on it.
- Known environment gaps: sk-vision `vision-runtime/dist` not built in worktrees; `create-journey-proof.test.cjs` failed before this range.
- Implementation/fixes: this loop is observation-only; report findings, do not repair the target.

## 5. STOP CONDITIONS

- Hard stop: `stopPolicy=max-iterations`, cap 5. Convergence before the cap is telemetry only; broaden the next angle instead.
- Terminal synthesis record must carry `stopReason: maxIterationsReached`.
- Escalate early only for a P0 with immediate harm; record and continue otherwise (autonomous child).

## 6. COMPLETED DIMENSIONS

<!-- MACHINE-OWNED: START -->
| Dimension | Verdict | Iteration | Summary |
|-----------|---------|-----------|---------|
| D1 Correctness (focus: pre-commit gate 410df0acce) | CONDITIONAL | 1 | 1 P1 (deletion trigger gap) + 2 P2 (silent tool skips); untrusted wording and per-commit cost clean |
| D1/D3 (focus: changelog workflows + create-skill guidance) | CONDITIONAL | 2 | 1 P2 (confirm collision remedy missing); offline/no-upstream numbering, carriers and stale message verified clean |
| D1/D3 (focus: advisor mention scoring + surfaceHint) | CONDITIONAL | 3 | 2 P2 (Python mirror missing the mention rules; engines range wider than build deps); surfaceHint validation/forwarding clean |
| D3/D1 (focus: freshness panel + validator exemptions) | CONDITIONAL | 4 | 2 P2 (machine-dependent gitignore exemption; family mismatch ungated under --strict); CI steps and strict failure path clean |
| D4/D3/D1 (cross-cutting hygiene/restraint/phase docs) | CONDITIONAL | 5 | No new findings; tests fail-without-fix, carrier hygiene, comment hygiene, goal budget and phase docs verified |
<!-- MACHINE-OWNED: END -->

## 7. RUNNING FINDINGS

<!-- MACHINE-OWNED: START -->
- **P0 (Critical):** 0 active
- **P1 (Major):** 1 active (I1-P1-001)
- **P2 (Minor):** 7 active (I1-P2-001, I1-P2-002, I2-P2-001, I3-P2-001, I3-P2-002, I4-P2-001, I4-P2-002)
- **Delta this iteration:** +0 P0, +0 P1, +2 P2

[Findings are tracked in `deep-review-findings-registry.json`. This section provides a running count summary updated after each iteration.]
<!-- MACHINE-OWNED: END -->

## 8. WHAT WORKED

- Reading the new gate against the sibling gates in the same hook file exposed the fail-open and trigger-shape inconsistencies; the probe under probe/d-filter made the deletion-filter effect observable (iteration 1).
- Cross-checking the CI trigger paths in routing-registry-drift.yml calibrated the deletion finding's impact (iteration 1).
- Running the real parent-skill-check against sk-doc settled the README/13c question with observed output (exit 0, WARN) instead of inference (iteration 2).
- The per-target local-vs-upstream max scan turned a suspected regex-depth defect into a ruled-out direction with evidence (iteration 2).
- Reproducing Python's exact regex on the path prompt (python3 -c) proved the TS/Python mention divergence at the pattern level without running the scorer (iteration 3).
- The probe git repo settled the git-check-ignore global-excludes question with observed exit codes (iteration 4).
- Running goal.cjs packet and check-goal directly confirmed the goal-budget phase's numbers (3798 / 5-of-5) instead of trusting the commit message (iteration 5).

## 9. WHAT FAILED

- Running the repo's pre-commit test harness was not attempted: the review contract bounds writes to this lineage directory, so test claims were verified by reading the harness and probing only inside probe/ (iteration 1).

## 10. EXHAUSTED APPROACHES (do not retry)

[Populated when a review approach has been tried from multiple angles without yielding new findings]

## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER

<!-- MACHINE-OWNED: START -->
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: Python battery ratio (lead-ruled out), upstream regex depth asymmetry (scan), description.json scoring (grep), cli-jev dangling links (out of range)
- Pivot lineage: none (max-iterations stop policy, no divergent pivot)
- Remaining frontier: security dimension not separately iterated; folded checks only
<!-- MACHINE-OWNED: END -->

## 11. RULED OUT DIRECTIONS

Ruled out by the lead before iteration 1 (steer.md `Already ruled out`):
- Python advisor battery 9/17: local fallback scorer, reproduced on an untouched tree (steer.md).
- sk-vision `vision-runtime/dist` missing in worktrees; `create-journey-proof.test.cjs` pre-existing failure: environment gaps, not defects of this range (steer.md).

## 12. NEXT FOCUS

<!-- MACHINE-OWNED: START -->
- Dimension: synthesis
- Focus area: compile `review-report.md` from iterations 1-5; registry/dashboard refresh; terminal synthesis record with `stopReason=maxIterationsReached`; config status flip.
- Reason: phase_synthesis of the fan-out workflow; cap 5 of 5 reached.
- Open items by severity: I1-P1-001 (P1); seven P2s.
<!-- MACHINE-OWNED: END -->

## 13. KNOWN CONTEXT

### Bounded Context Snapshot

- Target pointers: commit range `191aea6baa..03e31f902b`; manifest `specs/sk-code/011-sk-code-poinytail-based-refinement/014-skill-authoring-ux-research/011-remediation-deep-review/goal-file-manifest.txt`; steer focus table; phase docs under `014-skill-authoring-ux-research/00[2-9]-*` and `010-*`.
- Behavior claims: each commit message's "Changes"/"Verification" block, plus each phase's `spec.md`/`goal.md`/`implementation-summary.md`; cross-checked at iteration 5.
- Reuse and conventions: sibling gates in `.skilled/scripts/git-hooks/pre-commit` define the fail-open/fail-closed convention; `.skilled/repo-rules/prevent-overengineering.md` defines restraint expectations; repo comment hygiene forbids spec paths/phase numbers/finding ids in code comments.
- Review risks and gaps: fan-out lineage writes only inside this directory; tests are read, not run (write containment); commit claims are verified by reading `git show`/`git diff` output rather than executing generators.

## 14. CROSS-REFERENCE STATUS

<!-- MACHINE-OWNED: START -->
[Alignment checks completed across core and overlay protocols]

| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | [pending/pass/partial/fail/blocked] | [N] | [details] |
| `checklist_evidence` | core | [pending/pass/partial/fail/blocked] | [N] | [details] |
| `skill_agent` | overlay | [pending/pass/partial/fail/blocked/notApplicable] | [N] | [details] |
| `agent_cross_runtime` | overlay | [pending/pass/partial/fail/blocked/notApplicable] | [N] | [details] |
| `feature_catalog_code` | overlay | [pending/pass/partial/fail/blocked/notApplicable] | [N] | [details] |
| `playbook_capability` | overlay | [pending/pass/partial/fail/blocked/notApplicable] | [N] | [details] |
<!-- MACHINE-OWNED: END -->

## 15. FILES UNDER REVIEW

<!-- MACHINE-OWNED: START -->
[Per-file coverage state table -- populated during initialization from scope discovery]

| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| .skilled/scripts/git-hooks/pre-commit | [D1, D4] | [1] | [0 P0, 1 P1, 2 P2] | [partial] |
| .skilled/scripts/git-hooks/tests/pre-commit.test.sh | [D1, D4] | [1] | [0 P0, 0 P1, 0 P2] | [partial] |
| .skilled/scripts/git-hooks/lib/gates.tsv | [D3] | [1] | [0 P0, 0 P1, 0 P2] | [complete] |
| .skilled/scripts/git-hooks/README.md | [D3] | [1] | [0 P0, 0 P1, 0 P2] | [complete] |
| .skilled/commands/create/assets/create-changelog-auto.yaml | [D1, D3] | [2] | [0 P0, 0 P1, 0 P2] | [partial] |
| .skilled/commands/create/assets/create-changelog-confirm.yaml | [D1, D3] | [2] | [0 P0, 0 P1, 1 P2] | [partial] |
| .skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs | [D1, D4] | [2] | [0 P0, 0 P1, 0 P2] | [partial] |
| .skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts | [D1, D3] | [3] | [0 P0, 0 P1, 0 P2] | [partial] |
| .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py | [D1, D3] | [3] | [0 P0, 0 P1, 1 P2] | [partial] |
| .skilled/skills/system-skill-advisor/runtime/package.json | [D3] | [3] | [0 P0, 0 P1, 1 P2] | [complete] |
| .github/workflows/routing-registry-drift.yml | [D3] | [4] | [0 P0, 0 P1, 1 P2] | [partial] |
| .skilled/commands/doctor/scripts/skill-graph-freshness.cjs | [D3, D1] | [4] | [0 P0, 0 P1, 1 P2] | [partial] |
| .skilled/skills/sk-doc/sk-create-feature-catalog/scripts/validate_catalog_package.py | [D1] | [4] | [0 P0, 0 P1, 1 P2] | [partial] |
| .skilled/skills/sk-doc/sk-create-skill/scripts/package_skill.py | [D1, D4] | [4] | [0 P0, 0 P1, 0 P2] | [partial] |
<!-- MACHINE-OWNED: END -->

## 16. REVIEW BOUNDARIES

<!-- MACHINE-OWNED: START -->
- Max iterations: 5
- Convergence threshold: 0.1
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=fanout-dsflash-llmgw-1791670467637-7ccw83, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 12 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: spec-folder (content: commit range per steer.md)
- Cross-reference checks: core=[spec_code, checklist_evidence], overlay=[skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability]
- Started: 2026-10-10T22:19:08Z
<!-- MACHINE-OWNED: END -->
