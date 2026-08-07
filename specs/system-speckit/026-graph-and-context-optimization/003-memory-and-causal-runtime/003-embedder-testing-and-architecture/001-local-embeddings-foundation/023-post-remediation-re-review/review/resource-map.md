# Resource Map - Post-Remediation Re-Review

Reported file counts are summed from the relevant iteration summaries. They are not unique-file cardinalities.

| Surface | Files Scanned | P0 | P1 | P2 | Notes |
|---------|---------------|----|----|----|-------|
| Correctness surfaces: resolver/runtime/config/scripts | 15077 | 0 | 31 | 3 | Iterations 001, 004, 007, 010; findings concentrate in profile DB selection, launchers, config mirrors, dependency residue, and runtime warnings. |
| Traceability surfaces: docs/readmes/playbooks/metadata | 15450 | 0 | 16 | 5 | Iterations 002, 005, 008; stale `context-index.sqlite`, hf-local default wording, install guide examples, manual playbooks, and 017 metadata remain. |
| Maintainability surfaces: doctor assets/fixtures/eval comments | 8638 | 0 | 8 | 13 | Iterations 003, 006, 009; residue clusters around doctor route assets, generated fixtures, test expectations, backup naming, and nomic-era comments. |

