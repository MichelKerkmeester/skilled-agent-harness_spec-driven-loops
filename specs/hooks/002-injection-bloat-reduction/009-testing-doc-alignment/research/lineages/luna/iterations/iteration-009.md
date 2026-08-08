# Iteration 9 — severity and remediation-shape challenge

## Focus

Challenge whether the catalog omissions warrant P1/P2 severity and separate findings, using document authority, source-table scope, and the absence of any contradictory runtime test.

## Actions Taken

- Re-read the detailed catalog's frontmatter, overview, event matrix, source table, validation table, and related-reference list.
- Re-read the root catalog's description, current-reality paragraph, and explicit link to the detailed catalog.
- Compared the omissions with the shared-core README's one-paragraph contract and the executable test anchors.
- Confirmed the temporary inventory file from iteration 8 is absent.

## Findings

### P1 detailed catalog remains the correct must-fix severity

The detailed entry is titled and described as a current-state reference, explicitly distinguishes live-confirmed delivery from registration-only status at lines 18-20, and names the classifier/enforcer adapters at lines 53-55. The same entry's validation table points operators to the hook playbooks and prebind tests at lines 62-70. That makes the missing observed-receipt/epoch/post-emission/default-off contract actionable: an implementer can read the entry and still miss the condition that turns an emission into a confirmable delivery.

P1 is more accurate than P0 because the omission does not currently assert a bad runtime behavior or make an existing test fail. It is more important than optional polish because the entry is the authority used to reason about the exact adapter surface.

### P2 root catalog remains optional

The root catalog is a current-state inventory, but line 77 delegates event behavior and durable validation anchors to the detailed entry. Its missing contract is a discoverability gap rather than an independent incorrect test or runtime claim. Track it as P2 optional, or update it in the same documentation change as the P1 entry.

### No playbook remediation required

The playbooks are authoritative for their own host-event scenarios, but none owns the shared-core receipt state machine. No follow-on implementation should rewrite CU-013, CU-014, CU-020, or CU-021 solely to mention the new exports.

## Questions Answered

- The detailed/root findings should remain separate file-specific entries for implementation tracking, with P1 must-fix versus P2 optional classification.
- There is no P0 stale documentation and no stale playbook fix.
- Temporary residue from the only out-of-line inventory command has been removed.

## Questions Remaining

- Final iteration should verify exact file:line citations after no files outside the lineage were changed.
- Final synthesis must state the playbook-aligned/no-stale result explicitly and preserve the distinction between omission and contradiction.

## Next Focus

Perform the final evidence audit: rerun inventory counts and high-signal negative controls, inspect lineage artifacts, then synthesize without early-stop despite stable conclusions.

