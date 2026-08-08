# Iteration 10 — final evidence audit

## Focus

Complete the tenth required research iteration, rerun the objective surface counts and old-contract negative controls, and freeze the findings for synthesis.

## Actions Taken

- Recounted the target surface: 41 manual-testing-playbook files and 1,498 feature-catalog Markdown files.
- Re-ran the requested broad subject sweep: three root playbooks matched; the paraphrase-oriented catalog sweep narrowed to two relevant Cursor entries.
- Re-ran the exact old-contract search across all target playbooks and catalogs. It returned no configured-receipt, epoch-zero, observed-receipt, post-emission, activation-matrix, policy-sink, or suppression-assertion hits.
- Parsed the state log and all nine existing delta JSONL files. Iteration records and deltas are valid through iteration 9.
- Confirmed the only remaining stale-doc findings are catalog omissions, not contradicted playbook assertions.

## Findings

### Final must-fix split

1. P1 / must-fix: .opencode/skills/cli-external-orchestration/feature-catalog/cursor-hooks-and-spec-gate/cursor-hooks-and-spec-gate.md:28-36,48-70. Add the observed-receipt contract: hostReceiptStatus must be observed, lifecycleEpoch must be at least 1 and match the receipt, epoch 0 never confirms; document post-emission observer placement for stdout adapters and final pre-return placement for Pi/return hooks; document default-off, fail-open suppression and byte-identical output.
2. P2 / optional: .opencode/skills/cli-external-orchestration/feature-catalog/feature-catalog.md:69-77. Add a concise pointer or summary of the same contract. It is a high-level index that already delegates behavior to the detailed catalog.

### Playbook verdict

No stale playbook snippet was found. The matched Cursor scenarios are aligned host-event/prebind contracts; the Codex and OpenCode matches use Gate 3 as setup or generic hook parity context. No playbook command, expected output, or PASS/FAIL criterion asserts epoch-0/configured-receipt confirmation or pre-emission observation.

### Frozen behavior preserved

The finding does not propose changing shadow delivery, Gate-3 classification, or adapter behavior. The docs must describe the existing default-off, fail-open, byte-identical state machine without turning suppression on.

## Questions Answered

- Q-001: no stale playbook snippets.
- Q-002: two Cursor catalog omissions; detailed entry P1, root index P2.
- Q-003: detailed catalog is authoritative must-fix; root catalog is optional summary; playbook entries are authoritative but aligned.
- Q-004: no additional stale target docs after the full counts, targeted match, paraphrase sweep, and exact old-contract negative controls.

## Questions Remaining

- None for this research scope. Follow-on implementation should update only the two catalog entries if the operator accepts the optional P2 summary change.

## Next Focus

Synthesis: emit the findings registry, dashboard, resource map, strategy state, and canonical research report inside this lineage; do not write the parent spec or target docs.

