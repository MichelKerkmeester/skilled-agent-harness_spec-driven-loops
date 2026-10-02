# Deep Review Report: live machine-wide git hooks

Target: the hooks as committed on main at `03afeb4552`, read from the main checkout (`/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/`). Fourteen scope files: the seven hooks under `.skilled/scripts/git-hooks/`, its three `lib/*.sh` guards, `.skilled/scripts/install-git-hooks.sh`, `.skilled/hooks/git/pre-commit`, and the sk-git validator (`validate-message.mjs`, `lib/message-contract.mjs`). The uncommitted fixes in worktree 075 are not part of the target.

Five iterations, executor cli-opencode with `opencode-go/deepseek-v4.1-flash` at variant `max`, stop policy `max-iterations`. Session `dr-githooks-20261002T103712Z`.

---

## 1. Executive Summary

- **Verdict: FAIL**
- hasAdvisories: false (the verdict is FAIL)
- Active findings, deduplicated: **P0 1, P1 5, P2 16**
- Every P0 and P1 was re-read by iteration 5 (adversarial pass) and again by the orchestrator in the main checkout. None was falsified, none changed severity.
- Twelve findings are already fixed by the uncommitted work in worktree 075 (`001-git-hook-review-fixes`). Ten stay open after that work merges; all ten are P2.

## 2. Planning Trigger

`/speckit:plan` is not required for the P0 and P1 set: the plan and the fix already exist in this packet and wait only on commit and merge. The ten residual P2 items warrant a small follow-on phase.

```json
{
  "Planning Packet": {
    "triggered": true,
    "verdict": "FAIL",
    "hasAdvisories": false,
    "activeFindings": {"P0": 1, "P1": 5, "P2": 16},
    "remediationWorkstreams": [
      "WS1 merge worktree 075 (fixes R2-P0-001, R1-P1-001..005, R1-P2-006..008, R4-P2-003, R4-P2-004, and R3-P2-003 by consequence)",
      "WS2 hook residuals (R4-P2-001, R4-P2-005, R4-P2-006, R5-P2-001, R4-P2-002, R2-P2-002)",
      "WS3 doc and packet traceability (R3-P2-001, R3-P2-002, R3-P2-004, R3-P2-005)"
    ],
    "specSeed": "Close the residual hook and traceability P2 items left after the trust and range fixes land",
    "planSeed": "One change per unit: crash handling in the legacy pre-commit, de-hardcode the routing manifest path, align the shell rules probe with the validator, then the four doc edits",
    "findingClasses": {"class-of-bug": ["R2-P0-001", "R4-P2-006"], "cross-consumer": ["R1-P1-003", "R4-P2-002", "R5-P2-001"], "algorithmic": ["R1-P1-002", "R1-P1-005", "R1-P2-007"], "instance-only": "UNKNOWN for the remaining items"},
    "affectedSurfacesSeed": [".skilled/scripts/git-hooks/*", ".skilled/hooks/git/pre-commit", ".skilled/skills/sk-git/scripts/lib/message-contract.mjs", ".skilled/scripts/git-hooks/lib/message-contract-gate.sh", "specs/sk-git/032-template-driven-message-enforcement/acceptance-criteria.md", ".skilled/skills/sk-git/references/continuous-integration.md"],
    "fixCompletenessRequired": true
  }
}
```

## 3. Active Finding Registry

Paths are relative to the main checkout. "075" says whether the uncommitted worktree 075 work fixes the finding.

### P0

| ID | Dim | Location | Finding | 075 |
|----|-----|----------|---------|-----|
| R2-P0-001 | security | `.skilled/scripts/git-hooks/pre-commit:16-40` (and the same block in every hook) | The hooks are global through `core.hooksPath`, yet pick `SOURCE_ROOT` from a sentinel inside whatever repository they fire in, then source `$SOURCE_ROOT/hooks/shared/hook-flags.sh` and run guard scripts from that tree. A cloned repository that ships the sentinel and a planted script gets code execution on `commit`, `pull` or `push`. Main carries no trust check (`grep -c "hook trust"` is 0 on main, 2 in 075). | Fixed |

### P1

| ID | Dim | Location | Finding | 075 |
|----|-----|----------|---------|-----|
| R1-P1-001 | correctness | `prepare-commit-msg:183-195` | The attribution filter runs on every line, line 1 included, so a subject that matches a forbidden key is deleted. | Fixed |
| R1-P1-002 | correctness | `prepare-commit-msg:78-90` | Cherry-pick detection only runs when the source is `commit`. A clean `git cherry-pick` arrives as `message` (re-measured 3 of 3 runs), so the copied Commit-Id is kept. | Fixed |
| R1-P1-003 | correctness | `message-contract.mjs:279` | Comment lines are stripped whatever `commit.cleanup` says, so a `#` body line kept by git under `-m` is judged differently at commit-msg and at pre-push. | Fixed |
| R1-P1-004 | correctness | `pre-commit:70-90` | Comment hygiene reads the working-tree file, not the staged blob. A violation staged and then fixed only in the working tree is committed. | Fixed |
| R1-P1-005 | correctness | `pre-push:195-215` | A new branch is checked over `local --not --remotes=$REMOTE_NAME`. A push by URL, or to a remote that lacks history known to other remotes, re-checks published commits and blocks on them. | Fixed |

### P2

| ID | Dim | Location | Finding | 075 |
|----|-----|----------|---------|-----|
| R1-P2-006 | correctness | `pre-push:207` | A validator crash is reported as a rule violation. | Fixed |
| R1-P2-007 | correctness | `message-contract.mjs:658` | A rebased copy of a pushed commit is flagged as a Commit-Id collision. | Fixed |
| R1-P2-008 | security | `message-contract.mjs:239` | `git -c skgit.contractDir=<empty>` or `GIT_CONFIG_*` switches the contract off at commit time. | Fixed |
| R2-P2-002 | security | `message-contract.mjs:31` | Contract regexes run with no time limit. Input is already capped at 200,000 characters, which bounds the string, not the backtracking cost. | Open |
| R3-P2-001 | traceability | `specs/sk-git/032-template-driven-message-enforcement/acceptance-criteria.md:59` | AC-003 names git config `skgit.messageContract`; the code reads `skgit.contractDir` and nothing reads `messageContract`. | Open |
| R3-P2-002 | traceability | same file, rows from line 55 | Nine evidence cells pin `38b2135472`; later commits touched the reviewed files and were not re-verified. | Open |
| R3-P2-003 | traceability | `.skilled/skills/sk-git/feature-catalog/workflow-playbooks/message-contract-enforcement.md:48` | The catalog promises rebase-safe Commit-Id uniqueness that main lacks (R1-P2-007). | Resolves with 075 |
| R3-P2-004 | traceability | `.skilled/skills/sk-git/references/continuous-integration.md:106` | The CI reference lists the mass-deletion ceiling under pre-commit; only pre-push runs it. | Open |
| R3-P2-005 | traceability | `acceptance-criteria.md:44` vs `spec.md:37` | The parent packet says In Progress in one doc and Complete in the other. | Open |
| R4-P2-001 | maintainability | `.skilled/hooks/git/pre-commit:44` | The legacy hook treats any checker exit other than 1 as a pass, so a crashed checker passes silently. 075 moved it to staged blobs but kept this. | Open |
| R4-P2-002 | maintainability | `prepare-commit-msg:107` | Attribution policy lives twice: hardcoded in the stamper, read from the template by the validator. | Open |
| R4-P2-003 | maintainability | `install-git-hooks.sh:11` | The usage header describes a removed gate and omits the spec re-mint gate. | Fixed |
| R4-P2-004 | maintainability | `pre-push:1` | The header documents removed gates and omits the mass-deletion and routing gates. | Fixed |
| R4-P2-005 | maintainability | `pre-commit:351` | A machine-wide hook hardcodes `specs/sk-doc/019-skill-routing-refactor/015-router-unification-program/`; archiving that packet breaks routing commits. | Open |
| R4-P2-006 | maintainability | `pre-commit:16` | The source-root block is copied into eight in-scope scripts with only a comment asserting they match. | Open |
| R5-P2-001 | correctness | `lib/message-contract-gate.sh:47` | The node-free "declares rules" probe uses a different heading regex (`^#{1,6} ` with one space) and a different resolution order from the validator, so the shell gate and the validator can disagree on whether rules exist. | Open |

## 4. Remediation Workstreams

1. **WS1, P0 and P1: merge worktree 075.** It fixes all six blocking findings and five P2s. It was verified earlier today: hook suites and node tests all green, the P0 reproduction blocked.
2. **WS2, hook residual P2s:** R4-P2-001 (block on checker exit ≥ 2 in the legacy hook), R4-P2-005 (derive the authored manifest path, or skip when absent), R5-P2-001 (share one heading regex and order), R4-P2-002 (one attribution source), R4-P2-006 (a drift test over the copied block), R2-P2-002 (keep the cap; consider a pattern lint).
3. **WS3, traceability P2s:** fix the AC-003 key name, re-pin or re-verify evidence at the merge commit, move the mass-deletion row to pre-push, and reconcile the parent packet's status.

## 5. Spec Seed

- A repository's tree supplies hook code only when trusted (already specified in this packet as REQ-001).
- The legacy pre-commit fails closed when its checker crashes.
- No machine-wide hook names a spec packet path.
- The shell and Node "rules declared" checks agree by construction.
- Packet docs agree on status and cite evidence at the commit that shipped.

## 6. Plan Seed

1. Commit worktree 075 and merge it to main (operator decision).
2. One unit per WS2 item, each with a test that fails on the current code.
3. One doc unit for WS3, then `validate.sh --strict` on packet 032.

## 7. Traceability Status

| Protocol | Kind | Status | Notes |
|----------|------|--------|-------|
| `spec_code` | core | partial | R3-P2-001 key mismatch; R3-P2-004 CI reference mismatch |
| `checklist_evidence` | core | partial | R3-P2-002 stale evidence pin; R3-P2-005 status contradiction |
| `skill_agent` | overlay | pass | No skill or agent contract in scope contradicted |
| `agent_cross_runtime` | overlay | notApplicable | No agent definitions in scope |
| `feature_catalog_code` | overlay | partial | R3-P2-003 |
| `playbook_capability` | overlay | notApplicable | Not reviewed |

AC_COVERAGE: exempt (the target is a file set, not a spec folder).

## 8. Deferred Items

- R2-P2-002: an input cap already exists; a time bound needs a worker or a regex engine change, which is out of proportion for a contract file the repository owner edits.
- R4-P2-006: a drift test is cheaper than de-duplicating a block that must stay inline in each global hook.

## Dimension Expansion Map

Default convergence mode, no pivots. Iterations: 1 correctness, 2 security, 3 traceability, 4 maintainability, 5 adversarial re-verification plus the least-covered files (post-commit, post-merge, post-rewrite, commit-msg, the lib guards, validate-message.mjs).

## 9. Search Ledger

Ruled out with evidence (from the deltas): `validate-message` rev-list record splitting on 0x1e; post-rewrite stdin non-consumption losing rewritten pairs; an empty `.sk-git/` shadowing committed asset rules; plus the ruled-out directions recorded in iterations 1-4 (`deltas/iter-00N.jsonl`, `type:"ruled_out"`). No search debt recorded.

## 10. Audit Appendix

- newFindingsRatio by iteration: 1.0, 0.5, 0.13, 0.14, 0.02. Stop reason: maxIterationsReached.
- Dimension coverage: 4 of 4.
- Every iteration passed `verify-iteration.cjs` (narrative, route proof, delta) and `reduce-state.cjs`. After each dispatch, the worktree diff and status and the main checkout diff and status were compared with their baselines and found unchanged, apart from the run directory.
- **Executor deviation, operator-approved:** the dispatches ran `opencode run` directly rather than through the workflow's `if_cli_opencode` branch. That branch refuses to run while the primary checkout is dirty (an unrelated `specs/cli-jev/003-cli-jev-workflow-integration/description.json` change) and while worktree 075 holds uncommitted work.
- **Workflow defect found:** in review mode the state gateway `append-mode-event.cjs` refuses the `{"type":"iteration"}` record that `prompt-pack-iteration.md.tmpl` tells workers to send ("Unrecognized event format: expected object with stem or event_type"). Only deep-research has a legacy upcaster. In this run the orchestrator copied each iteration record from its delta file into `deep-review-state.jsonl`.

### Core Protocols

`spec_code` partial, `checklist_evidence` partial (see section 7).

### Overlay Protocols

`skill_agent` pass, `feature_catalog_code` partial, `agent_cross_runtime` and `playbook_capability` not applicable.
