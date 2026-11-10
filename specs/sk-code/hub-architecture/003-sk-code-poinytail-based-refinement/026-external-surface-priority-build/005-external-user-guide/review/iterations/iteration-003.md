# Deep Review Iteration 003

## Dispatcher

- Mode: review, agent `@deep-review`, run 3, session `2026-10-13T09:30:10.618Z`, generation 1, lineageMode new.
- Target: commits `8f59b9bd0a` and `1895122d37` on branch `worktrees/129-surface-guide` (diff `d99ddaff7d..1895122d37`); scope files per `deep-review-config.json`.
- Focus: traceability (D3) - map spec.md REQ-001 to REQ-005 and the six guide parts of research section 14.1 onto the diff; verify the v4.0.0.5 release note against phases 001 to 004; check goal.md criteria 1 to 3.
- Budget profile: verify (12 tool calls, within soft max).

## Dimension

D3 Traceability: spec-to-code alignment, checklist evidence, release-note truth against the shipped phases, and goal-criteria conformance.

## Files Reviewed

- `README.md:1445` (block heading), `:1447`-`:1483` (guide), `:800`, `:1384` (R4 lines) [SOURCE: README.md:1445]
- `.skilled/skills/sk-code/SKILL.md:40` [SOURCE: .skilled/skills/sk-code/SKILL.md:40]
- `.skilled/skills/sk-code/README.md:23`, `:55-57`, `:90` [SOURCE: .skilled/skills/sk-code/README.md:23]
- `.hermes/skills/sk-code/SKILL.md:45` (regenerated mirror) [SOURCE: .hermes/skills/sk-code/SKILL.md:45]
- `.skilled/changelog/skilled/v4.0.0.5.md:1` (release note) [SOURCE: .skilled/changelog/skilled/v4.0.0.5.md:1]
- `specs/sk-code/011-sk-code-poinytail-based-refinement/026-external-surface-priority-build/005-external-user-guide/spec.md:72` (REQ table), `:87`-`:94` (Files to Change table) [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/026-external-surface-priority-build/005-external-user-guide/spec.md:91]
- `specs/sk-code/011-sk-code-poinytail-based-refinement/026-external-surface-priority-build/005-external-user-guide/goal.md` criteria 1 to 3 [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/026-external-surface-priority-build/005-external-user-guide/goal.md:1]
- `specs/sk-code/011-sk-code-poinytail-based-refinement/026-external-surface-priority-build/005-external-user-guide/acceptance-criteria.md` (AC rows)
- `../001-scaffold-surface-placement` through `../004-router-version-parity` `implementation-summary.md` (phase ledgers, traceability context)
- `specs/sk-code/011-sk-code-poinytail-based-refinement/025-external-surface-priority-research/research/research.md` section 14.1 (P11 recipe)
- Diff artifacts: `.skilled/bin/lib/compiled-routing/013-live-activation/activation/sk-code/manifest.json:1` and its authored twin [SOURCE: .skilled/bin/lib/compiled-routing/013-live-activation/activation/sk-code/manifest.json:1]

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **Spec Files to Change does not authorize the generated artifacts the diff carries** -- specs/sk-code/011-sk-code-poinytail-based-refinement/026-external-surface-priority-build/005-external-user-guide/spec.md:91 -- `git diff --name-only d99ddaff7d..1895122d37` returns seven files; the Files to Change table names four. The unlisted three are `.hermes/skills/sk-code/SKILL.md` (the Hermes mirror of the edited hub `SKILL.md`) and the two compiled-routing activation manifests (`.skilled/bin/lib/compiled-routing/013-live-activation/activation/sk-code/manifest.json` and its authored twin under `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/`). Phase 003's review treated the analogous omission as P2 and fixed it by adding the generated Hermes copy to its Files to Change table.
   - Case: an auditor diffs the two commits against `spec.md` and finds the mirror and both manifests changed with no row that authorizes or explains them, reading the gate-generated side effects as unexplained scope.
   - File: specs/sk-code/011-sk-code-poinytail-based-refinement/026-external-surface-priority-build/005-external-user-guide/spec.md:91
   - Evidence: the table lists `README.md`, `.skilled/skills/sk-code/SKILL.md`, `.skilled/skills/sk-code/README.md` and the release note only [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/026-external-surface-priority-build/005-external-user-guide/spec.md:91]; the diff carries the mirror and both manifests [SOURCE: .hermes/skills/sk-code/SKILL.md:45] [SOURCE: .skilled/bin/lib/compiled-routing/013-live-activation/activation/sk-code/manifest.json:1].
   - Counterevidence sought: the generated artifacts are expected gate effects - the pre-commit route gate re-mints the manifest (both copies share the new policy hash `ce644a44150940033edb9a999f14f8d339962087ab8e68c443ddc357c6a7244d`) and the mirror gate regenerates `.hermes`; the implementation-summary convention also records them under Files Changed. None of this makes them authorized by the spec's own table.
   - Alternative explanation: the packet convention may treat generated copies as implied by the pre-commit gate, so the table only ever names authored files; the same review class was nonetheless fixed in phase 003.
   - User impact: a reader of the phase packet cannot distinguish authored changes from gate-generated ones, and a later audit may read the manifests and mirror as scope creep.
   - Finding class: instance-only
   - Scope proof: all three unlisted paths are generated or gate-driven, and the two manifests are identical twins; no authored file is absent from the table.
   - Affected surface hints: ["spec.md Files to Change", ".hermes/skills/sk-code/SKILL.md", "compiled-routing activation manifests"]
   - Recommendation: add the three generated paths to the table with a Regenerated / gate-driven change type, as phase 003's review did.
   - Confidence: medium-high.
   - Downgrade trigger: if the packet template convention excludes gate-generated artifacts from Files to Change, this collapses to noise.

## Traceability Checks

- `spec_code` (core) - pass for REQ-001, REQ-004 and REQ-005; deferred for REQ-002 and REQ-003:
  - REQ-001: each R4 line marks OpenCode native and the examples optional and no line tells the user to replace OpenCode; goal criterion 1 rerun prints `criterion1: ok`. Lines: README.md:800, README.md:1384, SKILL.md:40, hub README :23, :55-57, :90.
  - REQ-004: the block names the nested paths, the hooks, the keep-rule with `.opencode/skills`, `/create:skill-parent update --surfaces`, `RESOURCE_MAP`, `INTENT_SIGNALS` and `run-all-drift-guards.sh`; goal criterion 2 rerun prints `criterion2: 8 (want 8)`.
  - REQ-005: the newest note is v4.0.0.5, states the rule, names the `ROUTER.md` version change, `validate_document.py` exits 0, and v4.0.0.4 is untouched (`git diff --quiet origin/main` exit 0); goal criterion 3 rerun prints `criterion3: ok`.
  - REQ-002 and REQ-003: no evidence in the diff - they are the copy-run acceptance rows P11-1 to P11-3 recorded at closeout (deferred, see Edge Cases).
- Six guide parts of research section 14.1: all present in the block at README.md:1445-1483 - part 1 at :1447, part 2 at :1451-1452, part 4 at :1454-1464, part 5 at :1466-1472, part 6 at :1474-1483.
- Release note vs phases 001 to 004 (closes the deferred release-note direction SL-006): each at-a-glance bullet maps to a recorded phase ledger - surface placement and the two command follow-ups to 001 (P8-4, P8-5), the doctor/guard/sync fix messages and the pruned-`specs/` stops to 002 (P9-1 to P9-6), drift tolerance to 003 (P10-1 to P10-4), ROUTER.md version neutrality to 004 (VP-1 to VP-4). No unverified behavioral claim remains.
- `checklist_evidence` (core) - partial: AC-001, AC-004 and AC-005 are effectively covered by the criterion reruns; AC-002, AC-003 and AC-006 remain `Unmet` because the ledger rows are written at closeout (goal C3 sequence).
- `skill_agent` / `agent_cross_runtime` / `feature_catalog_code` / `playbook_capability` (overlay) - carried, not retried per the exhausted list; the changed surface sentence remains identical in the Hermes mirror (iteration 2 evidence) and R1-P2-001 stays active.

## Integration Evidence

- `/deep:review` single-iteration dispatch; LEAF-only, no sub-agents.
- Commit traceability: both target commits (`8f59b9bd0a`, `1895122d37`) carry `Spec: sk-code/011-sk-code-poinytail-based-refinement/026-external-surface-priority-build/005-external-user-guide`, with no `Co-Authored-By` or `Claude-Session` lines, matching goal C6.
- Pre-commit route-remint gate: the two activation manifests carry the same new policy hash in both copies, confirming the gate ran on the `SKILL.md` edit.
- Mirror gate: `.hermes/skills/sk-code/SKILL.md` was regenerated to carry the same surface roles.

## Edge Cases

- Acceptance ledger rows P11-1 to P11-4 and P11-6 are not yet recorded: `implementation-summary.md` is still the scaffold ("Not built") and the `acceptance-criteria.md` rows are `Unmet`. Goal C3 orders the ledger after the review, so this is a deferred-evidence state, not a failed check; it is not folded into the verdict.
- Three generated artifacts are unlisted in the spec's Files to Change table; recorded as R3-P2-001. The manifest hash change is otherwise expected gate behavior.
- The exhausted directions from iterations 1 and 2 were not re-entered.

## Confirmed-Clean Surfaces

- Goal criteria 1, 2 and 3 rerun from the worktree on the final diff state: `ok`, `8`, `ok`.
- REQ-001 line set: no shipped line tells the user to replace OpenCode; criterion 1's `grep -cE 'Replace the shipped Webflow|Replace the surface packets'` prints 0.
- Release note truth: no claim was found that phases 001 to 004 did not ship; v4.0.0.4 unchanged.
- Commit trailers and message shape comply with goal C6.

## Ruled Out

- Release note contains a false behavioral claim (SL-006): every at-a-glance bullet traces to a recorded phase ledger (iteration 3; evidence: 001 to 004 implementation summaries).
- REQ-001, REQ-004 or REQ-005 traceability gap: none; goal criteria 1 to 3 rerun pass (iteration 3).
- Six guide parts incomplete: all six present in the block at README.md:1445-1483 (iteration 3).

## Verdict

PASS with advisories: 0 P0, 0 P1, 1 new P2 (R3-P2-001). R1-P2-001, R1-P2-002 and R2-P2-001 remain active; none block.

## Next Dimension

Maintainability (D4).

## Next Focus

- Dimension: maintainability (D4).
- Focus area: safe follow-on change cost of the rewritten docs - heading and anchor integrity across the four edited documents, terminology consistency after the native/optional rewrite, and any remaining pointer to the removed replace-the-surfaces instruction or a stale line anchor.
- Reason: D3 is complete; maintainability is the last uncovered dimension.
- Rotation status: D3 complete, D4 next.
- Blocked/productive carry-forward: R1-P2-001, R1-P2-002, R2-P2-001 and R3-P2-001 remain active P2 advisories; ledger rows P11-1 to P11-6 belong to closeout.
- Required evidence: README.md block anchors `:1445`-`:1483`, `SKILL.md:40`, hub README rows, the release note, and `spec.md:41`.

Review verdict: PASS
