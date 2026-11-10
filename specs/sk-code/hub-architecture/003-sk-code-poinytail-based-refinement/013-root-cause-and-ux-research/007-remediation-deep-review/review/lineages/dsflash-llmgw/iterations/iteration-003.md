# Review Iteration 003

Dispatcher: fan-out lineage `dsflash-llmgw`, executor cli-pi (deepseek-v4.1-flash), session `fanout-dsflash-llmgw-1791667148881-n911tj`.
Mode: review. Stop policy: max-iterations (5).

## Dimension

Traceability (D3). Focus: phase-doc claim fidelity against the commits, parent packet close-out updates, mirror and changelog integrity, derived-artifact generator checks, and the capability/playbook overlay surfaces for the reviewed guard.

## Files Reviewed

- `001`..`006` phase `spec.md` statuses, predecessors/successors, and goal criteria (READ)
- `013-root-cause-and-ux-research/spec.md` phase map and handoff rows — committed version vs working tree (READ)
- `013-root-cause-and-ux-research/goal.md` close-out progress log and handoffs (READ)
- `002-admission-corpus-pin/evidence/admission-report.md` (READ)
- `005-readme-node-floor/goal.md` completion criteria (READ)
- `research/research.md` open-question settlement (READ)
- `git show 8e1be919a4` diffs for parent docs (READ)
- `.skilled/skills/cli-external-orchestration/feature-catalog/cli-dispatch-authorization/cli-dispatch-authorization.md:21,37` (READ)
- `.skilled/skills/cli-external-orchestration/manual-testing-playbook/plugins-and-hooks/cli-dispatch-preflight-authorization.md:28-32` (READ)

## Findings by Severity

### P0 Findings

None.

### P1 Findings

None new. Three P1 findings remain active from iterations 1 and 2 (`R1-P1-001`, `R1-P1-002`, `R2-P1-001`).

### P2 Findings

1. **Capability and playbook docs describe wrapper commands as `ambiguous`, but shell `-c` wrappers classify `none` and bypass the guard** -- `.skilled/skills/cli-external-orchestration/feature-catalog/cli-dispatch-authorization/cli-dispatch-authorization.md:21` -- The feature catalog defines `ambiguous` as covering an "unknown wrapper", and the manual playbook repeats that "variable/alias/substitution/wrapper/multi-segment forms" are ambiguous [SOURCE: `.skilled/skills/cli-external-orchestration/manual-testing-playbook/plugins-and-hooks/cli-dispatch-preflight-authorization.md:29`]. The classifier instead returns `none` for `bash -c 'devin -p task'`, `sh -c 'opencode run task'` and `zsh -c 'codex exec task'` while `resolveDispatchPacket` resolves them to executors [SOURCE: `probe/wrapper-probe.ts` output; `.skilled/hooks/dispatch/lib/dispatch-audit.mjs:310`], so the documented classification contract is contradicted by the shipped behavior. The `perl`/`timeout` wrappers do land `ambiguous`, which is why the doc's generalization survives casual testing.

   Finding class: cross-consumer (documentation contract vs classifier behavior).
   Scope proof: the overlays configured for this review include `feature_catalog_code` and `playbook_capability`; the docs describe exactly the reviewed guard's classification and authorization mapping, and the classifier evidence comes from the same module the guard consumes.
   Affected surface hints: `feature-catalog/cli-dispatch-authorization`, `manual-testing-playbook/plugins-and-hooks/cli-dispatch-preflight-authorization.md`, `lib/dispatch-audit.mjs` shell-wrapper unwrap, Pi preflight.
   Case: a reader follows the catalog, wraps a dispatch in `bash -c` to test the documented ambiguous-deny path, and observes it run instead of being denied.

   Recommendation: after the wrapper handling in `R2-P1-001` is fixed, align both docs with the chosen semantics (ambiguity or denial for shell `-c` payloads), and add the two overlay checks to the scanner rows the docs already carry.

## Traceability Checks

- `spec_code` (core): pass for the checked claims. Phase statuses are `Complete` for 001-006 and `In Progress` for 007; predecessor/successor chain is contiguous 001 -> 006 and 007 follows 006. Parent goal log matches the commits: 001 `fde8a56d87` sync exit 1->0 and manifest 26->42; 002 `48c4d4284f` admission 28->29; 003 `6df2b9c3b5` canaries 1->0; 004 `7cd3e8e5db` Pi 35->36; 005 `54f9d041fd`/`4a8a4065b6` README 20.19+; 006 `54b4547bff` hook 39->40 and version 2.7.2.1. Independent reruns in iterations 1-2 reproduced the after-numbers for 001, 002, 003 and 006; the 004 suite could not be rerun under containment and stays an unconfirmed claim.
- `checklist_evidence` (core): notApplicable (no checklist.md at Level 1).
- `skill_agent` (overlay): pass. system-spec-kit SKILL.md and changelog both carry 2.7.2.1; the changelog documents the late-write case and the helper option.
- `agent_cross_runtime` (overlay): pass. `.pi/extensions/dispatch-preflight-lint.ts` is byte-identical to the canonical guard; `sync-skills-hermes.cjs --check` prints `PASS: 70 Hermes skill copies in sync`.
- `feature_catalog_code` (overlay): partial. Catalog classification model contradicts shipped behavior for shell wrappers (P2 finding above).
- `playbook_capability` (overlay): partial. Same contradiction, plus the playbook's own deny-contract section paraphrases the reason without the new guidance sentence; not treated as a separate defect.

## Integration Evidence

- `sync-skills-hermes.cjs --check` exit 0, 70 copies in sync.
- `002` evidence report totals: 79 pass + 6 n/a + 1 drift across seven hubs = 86 scenarios, matching the pin and the commit's claim.
- `005` goal criteria are checked and correct (`README.md:160` = Node.js 20.19+, zero `20.11` matches, package engines `>=20.11.0` present).
- `research/research.md` section 10 records the manifest-suite open question as settled by phase 1 (26 -> 28 masked by the closure error, 42 of 42 after the pin derivation).

## Edge Cases

- Parent `spec.md` in the working tree carries an uncommitted phase-map row for 007 (`[Phase 7 scope]`, `Pending`) and a handoff row with `[Criteria TBD]`; the committed close-out does not contain them. This is the in-progress scaffold state of this review's own packet, not a defect in the six fixes; the row must be filled when 007 closes.
- `generate-trigger-index.mjs --check` exits 1 today with exactly five stale documents, all in the untracked 007 packet (goal, implementation-summary, plan, spec, tasks). The six reviewed commits' `--check` claim was verified at commit time by their own runs; the staleness is created by this review packet's uncommitted scaffold and is resolved by regenerating the index when 007 is committed. Recorded, not raised as a finding.
- The `../changelog/` refresh instruction appears in the phase templates of the whole track (for example completed phases under `010-round-three-remediation`), and no `changelog/` directory exists anywhere in the track; treated as uniform template boilerplate rather than a per-phase miss.
- Strict validation for SC-002 could not be run by this lineage: `validate.sh` is outside the allowed command surface, so PASSED stays asserted by the commits' own runs.

## Confirmed-Clean Surfaces

- The close-out commit's parent-doc edits match their claims: phase map marked 1-6 Complete, handoffs recorded in the parent goal (advisor engines, version collision), implementation summary gained the widened-scope paragraph, research question settled.
- `.hermes` mirror and canonical SKILL.md version fields agree; the changelog version matches.
- The parent goal log's deviation entries are honest and consistent with observed state (close-out event scoping, criterion amendment).

## Ruled Out

- **Missing parent changelog refresh.** Ruled out: the instruction is template boilerplate repeated across completed sibling packets, and no track packet has a `changelog/` directory; not a per-phase omission.
- **The close-out's trigger-index claim is false.** Ruled out as a claim defect: the current `--check` failure traces entirely to the untracked 007 packet created after the close-out commit.
- **Parent phase-map placeholder is a close-out defect.** Ruled out: the placeholder row is uncommitted scaffold for the in-progress phase 7, absent from the close-out commit.

## Next Focus

- Dimension: maintainability (D4)
- Focus area: the changed tests' quality (late-write timing envelope, deny-matrix coverage, hub-count derivation), comment hygiene on changed lines, prevent-overengineering review of each commit, and the remaining unverified surfaces
- Reason: D1-D3 confirmed three P1 findings and one P2; D4 checks test robustness, documentation quality and change cost
- Rotation status: correctness, security, traceability reviewed; maintainability next
- Blocked/productive carry-forward: 004's vitest rerun remains blocked by the containment boundary; carry the caveat
- Required evidence: file:line plus the specific failure mode each test would catch
- Recovery note: none

Review verdict: CONDITIONAL
