# Review Report — opus lineage

## 1. Executive Summary

- Overall verdict: **CONDITIONAL**
- hasAdvisories: true
- Active findings: P0 0, P1 2, P2 7
- Review scope: commits c57b7e4cef..e97ca56e8d (reviewed as `c57b7e4cef^..e97ca56e8d`): `overlay-engine.cjs`, its follow-up, strict-writes and fixes tests, `.skilled/hooks/overlay-guard/opencode/`, `doctor/overlay.md`, `_routes.yaml`, `assets/doctor-overlay-*`, `references/overlays.md` and `manual-testing-playbook/overlays/`
- Operator review focus: Data-loss and safety paths first: lock takeover, layout link retarget, removal of dropped json-entry items, apply --relayout moves and backups. Then the strict write checks, the commit check and status --audit, the OpenCode adapter, and whether the command documents match the engine.
- Stop reason: maxIterationsReached (2 of 2)
- **Lineage blocker:** the session permission layer refused every `node` invocation, so the append gateway, the reducer, the synthesis-closeout script and every test run stayed out of reach. The canonical iteration records and the synthesis record sit in `gateway-events/` for replay. `deep-review-state.jsonl`, the findings registry and the dashboard were not produced, because the contract forbids writing them by hand. Nothing in this report was confirmed by running code; every finding comes from a direct read with file:line evidence.

## 2. Planning Trigger

`/speckit:plan` is required: two active P1 findings.

```json
{
  "triggered": true,
  "verdict": "CONDITIONAL",
  "hasAdvisories": true,
  "activeFindings": [
    {"id": "OPUS-I1-P1-001", "severity": "P1", "file": ".skilled/commands/doctor/scripts/overlay-engine.cjs:4740"},
    {"id": "OPUS-I2-P1-005", "severity": "P1", "file": ".skilled/commands/doctor/assets/doctor-overlay-apply.yaml:113"},
    {"id": "OPUS-I1-P2-002", "severity": "P2", "file": ".skilled/commands/doctor/scripts/overlay-engine.cjs:2270"},
    {"id": "OPUS-I1-P2-003", "severity": "P2", "file": ".skilled/commands/doctor/scripts/overlay-engine.cjs:1117"},
    {"id": "OPUS-I1-P2-004", "severity": "P2", "file": ".skilled/commands/doctor/scripts/overlay-engine.cjs:4732"},
    {"id": "OPUS-I2-P2-006", "severity": "P2", "file": ".skilled/commands/doctor/assets/doctor-overlay-status.yaml:58"},
    {"id": "OPUS-I2-P2-007", "severity": "P2", "file": ".skilled/commands/doctor/scripts/overlay-engine.cjs:4293"},
    {"id": "OPUS-I2-P2-008", "severity": "P2", "file": ".skilled/skills/system-skilled-doctor/references/overlays.md:57"},
    {"id": "OPUS-I2-P2-009", "severity": "P2", "file": ".skilled/commands/doctor/scripts/tests/overlay-engine-follow-up.test.cjs:549"}
  ],
  "remediationWorkstreams": ["relayout safety (link precondition, atomic rewrite, honest exit report)", "lock takeover race", "json-entry item ownership", "doc parity", "relayout link test coverage"],
  "specSeed": ["relayout refuses or records links before moving", "relayout rewrites the manifest before moving, or restores the backup on failure", "stale-lock takeover verifies the owner line before removal"],
  "planSeed": ["add a relayout test with a layout link and a state without link records", "fix doctor-overlay-apply.yaml exit-2 relayout row", "fix doctor-overlay-status.yaml relayout hint"],
  "findingClasses": ["state-transition precondition missing", "doc-to-engine contract drift on a data-state report", "concurrency / lock safety", "ownership tracking", "partial-failure atomicity", "doc-to-engine command drift", "check bypass", "doc drift", "test coverage gap"],
  "affectedSurfacesSeed": ["overlay-engine.cjs relayoutUnderLock", "overlay-engine.cjs planLayoutLinks", "overlay-engine.cjs acquireLock", "overlay-engine.cjs removeDroppedItems", "overlay-engine.cjs stagedUnownedChanges", "doctor-overlay-apply.yaml", "doctor-overlay-status.yaml", "references/overlays.md", "overlay-engine-follow-up.test.cjs", "manual-testing-playbook/overlays/relayout-moves-sources.md"],
  "fixCompletenessRequired": true
}
```

## 3. Active Finding Registry

| ID | Sev | Dimension | Title | File:line | Fix recommendation |
|---|---|---|---|---|---|
| OPUS-I1-P1-001 | P1 | correctness | Relayout leaves a dangling layout link the next apply refuses to repair when the state has no link record | overlay-engine.cjs:4740 | Before moving, refuse (or record) any layout link that reaches a moved copy and is not in `state.links`; or let the post-relayout apply retarget a link whose current target is exactly the manifest's pre-relayout target recorded in the relayout backup |
| OPUS-I2-P1-005 | P1 | traceability | Apply workflow says "nothing was written" after relayout moved the copies | doctor-overlay-apply.yaml:113 | Make the engine's ordering match the claim (rewrite first or restore on throw), or change the row to say copies may have moved and name the `relayout-runs/<stamp>` backup as the restore |
| OPUS-I1-P2-002 | P2 | correctness | Stale-lock takeover can delete a lock another run just took | overlay-engine.cjs:2270 | Re-read and compare the owner line right before unlinking, or take over by atomic rename to a unique name and re-verify |
| OPUS-I1-P2-003 | P2 | correctness | Dropping an entry deletes an identical item upstream now carries | overlay-engine.cjs:1117 | Before removing, check the pinned upstream copy of the destination; keep (and un-record) an item upstream also lists |
| OPUS-I1-P2-004 | P2 | correctness | Relayout moves one at a time and rewrites the manifest only at the end, with no rollback | overlay-engine.cjs:4732 | Check the manifest rewrite before the first rename, and restore the backup on any throw after the first rename |
| OPUS-I2-P2-006 | P2 | traceability | Status workflow names `/doctor:overlay relayout`, which does not exist | doctor-overlay-status.yaml:58 | Name `/doctor:overlay apply --relayout` |
| OPUS-I2-P2-007 | P2 | security | Any staged pin change switches the whole commit check off | overlay-engine.cjs:4293 | Limit the skip to paths the re-pin's diff touched, or still check paths outside the old→new upstream diff |
| OPUS-I2-P2-008 | P2 | traceability | Lock docs leave out relayout and rollback | overlays.md:57 | List every lock taker |
| OPUS-I2-P2-009 | P2 | maintainability | No test or playbook covers the relayout link rewrite | overlay-engine-follow-up.test.cjs:549 | Add a relayout test and a playbook step with one layout link, with and without a link record |

Full evidence, cases and claim-adjudication packets are in `iterations/iteration-001.md` and `iterations/iteration-002.md`.

## 4. Remediation Workstreams

1. P1: relayout safety. Fix OPUS-I1-P1-001 and OPUS-I1-P2-004 together in `relayoutUnderLock`, then correct the apply YAML row (OPUS-I2-P1-005) to match.
2. P2: lock takeover race (OPUS-I1-P2-002).
3. P2: json-entry ownership against upstream adoption (OPUS-I1-P2-003).
4. P2 advisories: doc parity (006, 008), commit-check scope (007), relayout link coverage (009).

## 5. Spec Seed

- Relayout must not leave a live layout link that the following apply refuses to retarget.
- An exit the command docs call "nothing was written" must be one where the engine wrote nothing.
- Stale-lock takeover must never remove a lock whose owner line differs from the one it judged stale.

## 6. Plan Seed

- Add follow-up tests: relayout with a layout link and (a) a recorded link, (b) a state file without `links`; relayout with a manifest field mismatch after load.
- Update `doctor-overlay-apply.yaml` exit-2 relayout row and `doctor-overlay-status.yaml` line 58.
- Update `references/overlays.md` lock table and held-lock section.

## 7. Traceability Status

### Core Protocols
- spec_code: partial. Flag ownership and audit kinds match the docs; drift in findings 005, 006 and 008.
- checklist_evidence: not covered. The packet's `acceptance-criteria.md` was not read within the budget.

### Overlay Protocols
- playbook_capability: partial. SKD-009 covers relayout without layout links only.
- agent_cross_runtime: OpenCode adapter checked against its README; the symlink resolves to `.opencode/plugins/overlay-guard.js` and matches the documented behaviour.
- skill_agent, feature_catalog_code: not applicable to this target.

## 8. Deferred Items

- OpenCode plugin's top-level `require` of the core: a missing core fails the plugin load, not the documented per-call fail-open. Whether OpenCode then blocks or skips the plugin is UNKNOWN without a run.
- Strict guard on a case-insensitive file system for a new file under a differently-cased, not-yet-existing folder.

## Dimension Expansion Map

- Swept: correctness (iteration 1); security, traceability, maintainability (iteration 2).
- Pivots: none. Remaining frontier: checklist_evidence against the packet; executing the follow-up and strict-writes suites and the five new playbook scenarios.

## 9. Search Ledger

*No search-depth state captured (legacy v1 record)*. The reducer never ran in this lineage, and the iteration records are v1.

## 10. Audit Appendix

- Convergence: newFindingsRatio 1.0 (iteration 1), 0.53 (iteration 2); stopped at the iteration cap, not on convergence.
- Coverage: 4 of 4 dimensions.
- Adversarial recheck of the P1s at synthesis: OPUS-I1-P1-001 was rechecked against the docs in iteration 2. The downgrade trigger (a doc requiring a plain apply first) is not met: overlay.md:108 and doctor-overlay-apply.yaml:104 run relayout then apply. It stays P1. For OPUS-I2-P1-005 the only competing explanation, a manifest parse error, does not cover the field-mismatch wording the row uses. It stays P1.
- Sources reviewed: listed per iteration under Files Reviewed.
- Lineage artifacts: `deep-review-config.json`, `deep-review-strategy.md`, `iterations/iteration-00{1,2}.md`, `deltas/iter-00{1,2}.jsonl`, `gateway-events/{run-open (not built), iteration-001.json, iteration-002.json, synthesis.json}`.
