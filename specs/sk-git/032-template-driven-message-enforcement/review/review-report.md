# Deep Review Report: message-contract hook upgrade

## 1. Executive Summary

- **Verdict:** PASS
- **hasAdvisories:** true
- **Active findings:** P0 0, P1 0, P2 8
- **Scope:** the uncommitted upgrade in worktree `076-message-contract-checks`. It adds three contract rules: `subject.scope-alias`, `subject.length-target` and `body.breaking-sections`.
  - Files reviewed: `message-contract.mjs`, `message-contract.test.mjs`, `commit-message-template.md`, `SKILL.md`, `commit-msg.test.sh` and `message-contract.yml`.
  - Read for context: `validate-message.mjs` and the `commit-msg` hook.
- **Executor:** cli-pi, `deepseek-v4.1-flash` at max thinking, 3 iterations with `stopPolicy: max-iterations`.
  - Iteration 1: correctness, PASS.
  - Iteration 2: security, PASS.
  - Iteration 3: traceability and maintainability, PASS.
- **Orchestrator check:** each P2 was checked against the code or a live probe before it was accepted (see the Evidence column). One P2 was narrowed (R2-P2-002) and one was downgraded to cosmetic (R3-P2-002).

## 2. Planning Trigger

`/speckit:plan` is not required: there are no P0 or P1 findings. The P2s are small enough to fix in this packet before the commit.

```json
{
  "Planning Packet": {
    "triggered": false,
    "verdict": "PASS",
    "hasAdvisories": true,
    "activeFindings": ["R1-P2-001", "R1-P2-002", "R2-P2-001", "R2-P2-002", "R3-P2-001", "R3-P2-002", "R3-P2-003", "R3-P2-004"],
    "remediationWorkstreams": ["config-validation-hardening", "spec-trailer-path-guard", "packet-doc-reconciliation", "playbook-and-literal-drift"],
    "specSeed": "Reopen specs/sk-git/032-template-driven-message-enforcement follow-up tasks",
    "planSeed": "Add the config-load checks, the Spec path guard and a doc reconcile pass",
    "findingClasses": ["config-validation-gap", "path-traversal", "doc-state-drift", "coverage-gap"],
    "affectedSurfacesSeed": [".skilled/skills/sk-git/scripts/lib/message-contract.mjs", ".skilled/skills/sk-git/assets/commit-message-template.md", ".skilled/skills/sk-git/SKILL.md", "specs/sk-git/032-template-driven-message-enforcement/acceptance-criteria.md"],
    "fixCompletenessRequired": false
  }
}
```

## 3. Active Finding Registry

| ID | Sev | Dimension | Title | Location | Evidence (orchestrator-verified) | Fix |
|---|---|---|---|---|---|---|
| R1-P2-001 | P2 | correctness | `warnLength` is accepted above `maxLength`, so the warning can never fire | `message-contract.mjs:193-195` | The config check tests only for a positive finite number and never compares the value with `subject.maxLength`. | At load, reject `warnLength >= maxLength`. |
| R1-P2-002 | P2 | correctness | Canonical values in `scopeAliases` are not checked against `scopePattern` | `message-contract.mjs:186-191` | Only the value's type is checked, so a canonical scope that is itself rejected can be configured as an alias target. | Run each canonical value through `scopePattern`, and reject aliases that chain to another alias. |
| R2-P2-001 | P2 | security | `Spec: ..` passes `trailer.spec-exists` | `message-contract.mjs` spec-exists check (disk fallback at :747) | **Reproduced live.** `Spec: ..` exits 0, while `Spec: nope-missing` is blocked. `specs/..` resolves to the repo root, which exists. The bug predates this change. | After resolving, require the path to sit strictly under `specs/` and contain no `..` segment. |
| R2-P2-002 | P2 | security | `breakingSections` labels are only checked to be non-empty strings | `message-contract.mjs:197-199, 537-540` | **Narrowed.** A label containing `:` or a space can still be satisfied. The real failures are an empty label, which matches any body line starting with `:`, and a label containing a newline, which can never match. | Reject empty labels and labels containing a newline or `:`. |
| R3-P2-001 | P2 | traceability | `acceptance-criteria.md` claims two completion states and miscounts its Met rows | `acceptance-criteria.md:17, 24, 44, 98, 100` | `Status: Complete`, `completion_pct: 100` and "the packet is complete" contradict `Closeable: No` and AC-017 still being Unmet. Line 100 says "16 active criteria are Met", but the table has 15 Met rows. | Set the status to In Progress until AC-017 is Met, and fix the count. |
| R3-P2-002 | P2 | traceability | The replay is cited with two different ranges | `implementation-summary.md:153`, `plan.md:278`, `tasks.md:276, 285` | **Cosmetic.** `38b2135472^..03afeb4552` covers 23 commits and `f8519088b9..03afeb4552` covers 6. Replaying both flags the same three commits, so the evidence holds. | Cite one range everywhere. |
| R3-P2-003 | P2 | traceability | No playbook scenario exercises the three new rule ids | the sk-git playbook, GIT-045 | GIT-045 covers format, body, bypass and maximum length only. | Add scenarios for `scope-alias`, `length-target` and `breaking-sections`. |
| R3-P2-004 | P2 | maintainability | The 80 and 100 limits are restated as literals outside the drift-checked block | `commit-message-template.md:35, 162-163`, `SKILL.md:341` | `templateDriftErrors` matches by rule id only and never reads `SKILL.md`. This is the drift class the packet fixed, one level down. | Refer to the keys by name instead of restating numbers, or extend the drift check. |

## 4. Remediation Workstreams

There are no P0 or P1 findings. The P2 advisories fall into four workstreams:

1. **Config validation hardening:** R1-P2-001, R1-P2-002 and R2-P2-002, all checks at load time in `validateContractConfig`.
2. **Spec trailer path guard:** R2-P2-001.
3. **Packet doc reconciliation:** R3-P2-001 and R3-P2-002.
4. **Playbook and literal drift:** R3-P2-003 and R3-P2-004.

## 5. Spec Seed

- REQ: config validation rejects `warnLength >= maxLength`, alias targets that fail `scopePattern`, and empty or multi-line section labels.
- REQ: `Spec:` must resolve strictly below `specs/`.

## 6. Plan Seed

- Add the three load-time checks and one unit test per check in `message-contract.test.mjs`.
- Add a `..` and containment guard to the spec-exists check, with a hook test for `Spec: ..`.
- Reconcile the completion state in `acceptance-criteria.md` and cite one replay range.
- Add the playbook scenarios, then replace the literal limits or widen the drift check.

## 7. Traceability Status

**Core protocols**

- `spec_code`: pass. The code implements REQ-013 to REQ-017 as specified.
- `checklist_evidence`: partial, because of R3-P2-001 and R3-P2-002. Containment kept the leaf from running the test suites. The orchestrator's earlier runs gave 24/24 unit tests and PASS=31 hook tests.

**Overlay protocols**

- `skill_agent`: pass. Both agent gates import the shared library.
- `agent_cross_runtime`: pass. The Hermes mirror was regenerated, and the other runtimes are symlinks.
- `feature_catalog_code`: pass.
- `playbook_capability`: partial, because of R3-P2-003.
- `AC_COVERAGE`: advisory-shortfall. AC-017 stays Unmet until CI runs on the pushed change.

## 8. Deferred Items

- AC-017 needs the `message-contract.yml` run after the push. It can't be verified locally.
- **Workflow contract defect (outside this packet's scope).** Under `deep-review-auto.yaml`, every gateway append fails projection, so this run's state log holds only the config row.
  - `step_create_state_log` writes the config row directly into `deep-review-state.jsonl`, and nothing emits `deep_review.run_initialized`.
  - The review projection can rebuild only a five-key config row, and `shadow-projection-store.ts` `assertNoAttributionCollapse` refuses any rebuild that drops keys.
  - So every append commits to the ledger, then fails projection with exit 2 (`ATTRIBUTION_COLLAPSE`).
  - This run's three `deep_review.dimension_pass_completed` events are in the ledger at sequences 1–3. The per-iteration detail lives in `deltas/iter-00N.jsonl`.
  - Fix: either init through a `run_initialized` event whose projection carries the full config key set, or have the review projection keep the existing config row.

## Dimension Expansion Map

- Swept: correctness, security, traceability and maintainability, one pass each.
- No pivots, overrides or Council references.
- Remaining frontier: none within the bounded 3-iteration budget.

## 9. Search Ledger

*No search-depth state captured (legacy v1 record).* The reducer couldn't run because the state-log projection is blocked (see §8). Ruled-out security directions are recorded in `iterations/iteration-002.md`: injection, prototype pollution, ReDoS, CI log injection and secrets exposure.

## 10. Audit Appendix

**Convergence:** `stopPolicy: max-iterations`, so the loop ran all 3 iterations. Convergence was not evaluated because the reducer was blocked.

**Coverage:** all 4 dimensions covered, across 8 files.

**Ruled-out claims:** see the ruled-out records in `deltas/iter-002.jsonl` and `deltas/iter-003.jsonl`.

**Sources:** `iterations/iteration-001.md` to `iteration-003.md`, `deltas/iter-001.jsonl` to `iter-003.jsonl`, and ledger sequences 1–3.

### Core Protocols

`spec_code` pass; `checklist_evidence` partial.

### Overlay Protocols

`skill_agent` pass; `agent_cross_runtime` pass; `feature_catalog_code` pass; `playbook_capability` partial.

Review verdict: PASS
