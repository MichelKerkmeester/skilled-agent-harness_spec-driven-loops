# Iteration 8 — catalog ownership and scope challenge

## Focus

Challenge the two-catalog finding against the full set of files mentioning Gate 3, including generic governance catalogs and the detailed entry's stated ownership.

## Actions Taken

- Enumerated 17 feature-catalog-path Markdown files containing spec-gate or Gate-3 wording.
- Read the five system-spec-kit catalog matches and the two Cursor catalog entries.
- Checked the detailed Cursor catalog metadata, source tables, validation table, and cross-reference links.
- Checked the changed commit's file list for target-surface documentation updates.

## Findings

### The two Cursor entries are the only relevant catalog owners

The 17-file list contains only two entries that describe the Cursor hook/spec-gate runtime surface and delivery paths:

- cursor-hooks-and-spec-gate/cursor-hooks-and-spec-gate.md:2-3,18-20,28-36,48-70 calls itself a current-state reference, names the classifier/enforcer adapters, and lists the relevant playbook/test anchors.
- feature-catalog/feature-catalog.md:2-3,17,63-77 is the root current-state inventory and explicitly points to the detailed entry.

The system-spec-kit matches describe doctor route mutation classes, Unicode normalization, constitutional governance, or a maintainability change. They do not own the Gate-3 question-delivery contract and should remain unflagged.

### Severity challenge resolved

The detailed entry's own authority claims make its omission P1 rather than optional: it is not merely a directory index, and its source table names the exact Cursor classifier whose call site now creates an observed receipt and invokes observation after stdout emission. The root entry remains P2 because it is explicitly a summary that delegates behavior to the detailed entry.

The changed commit did not update either target catalog or any target playbook. The updated shared-core README is therefore the existing authoritative behavioral reference, while the catalogs are stale by omission.

### Scope violation record

The inventory command used a temporary listing at /tmp/luna-catalog-gate-files.txt for counting. No researched file or lineage artifact was modified by that listing command. This is task-created temporary residue outside the requested lineage and must be removed before synthesis.

## Questions Answered

- Only the two Cursor catalog entries are in scope for a delivery-contract finding.
- The detailed/root split is justified by each entry's documented authority and level of detail.

## Questions Remaining

- Remove the temporary inventory residue and verify it is gone.
- Recheck that every iteration artifact is present and state records have the required route proof.
- Use the final two iterations to challenge whether the detailed omission should be P1 or P2.

## Next Focus

Audit wording impact: determine whether a maintainer could act incorrectly from the omission, and whether the finding needs one combined remediation or two file-specific updates.

