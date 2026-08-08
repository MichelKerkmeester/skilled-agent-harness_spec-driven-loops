# Iteration 6 — authoritative test negative controls

## Focus

Use the changed shared-core tests and adapter source-order checks as negative controls for the catalog findings.

## Actions Taken

- Read the shared-core tests for flag-off byte identity, observed-receipt seeding, epoch-zero rejection, epoch-one acceptance, adapter ordering, and suppression call-site boundaries.
- Read all four stdout adapters and the Pi return-based adapter at their observer call sites.
- Checked whether the changed commit touched the target feature catalogs or playbooks. It did not; it updated the shared-core README, core, runtime/plugin docs, and spec artifacts.

## Findings

### P1 detailed-catalog finding is confirmed, not speculative

The shared test contract makes the omitted behavior load-bearing:

- .opencode/skills/system-spec-kit/mcp-server/hooks/lib/spec-gate/spec-gate-core.test.mjs:297-315 proves flag-off output is byte-identical and suppression is ineligible.
- :380-390 proves an observed receipt is required before suppression state can seed.
- :586-623 proves epoch 0 is rejected at both the policy sink and delivery confirmation, while epoch 1 is accepted.
- :625-647 proves the four stdout adapters observe only after stdout emission and Pi observes after output construction.
- :649-655 proves the suppression predicate is not called from classification or enforcement.

Those exact invariants are absent from .opencode/skills/cli-external-orchestration/feature-catalog/cursor-hooks-and-spec-gate/cursor-hooks-and-spec-gate.md:28-70, which calls itself a current-state reference and lists the adapter/test anchors. This keeps the P1 must-fix classification.

### No new finding in playbooks

The test source does not retroactively make CU-013/CU-014/CU-020/CU-021 stale: those scenarios do not assert the shared-core delivery-state invariants. The correct follow-on change is a catalog update, not a rewrite of frozen shadow behavior or existing host-event tests.

## Questions Answered

- The changed behavior is independently confirmed by executable tests and source-order assertions.
- The detailed catalog omission is load-bearing enough for P1; it is not merely a missing implementation detail.
- The root catalog remains P2 optional because it is a summary and points to the detailed catalog.

## Questions Remaining

- Determine whether the detailed catalog's source table should cite the shared-core README/test directly or only add a behavioral paragraph.
- Run final old-contract negative controls for configured receipts and epoch zero in all target files.
- Prepare the must-fix/optional split and aligned-playbook statement for synthesis.

## Next Focus

Search for the exact old contract terms and verify their absence, then review the catalog finding wording for duplicate or over-broad claims.

