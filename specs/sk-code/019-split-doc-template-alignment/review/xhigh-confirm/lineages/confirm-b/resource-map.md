# Review Evidence Resource Map: confirm-b

This is a lineage-local synthesis map. The target packet had no source `resource-map.md` at initialization, so the formal Resource Map Coverage Gate is skipped.

## Scope Inventory

| Surface | Lexical Markdown paths | Review status | Findings |
|---|---:|---|---|
| code-opencode references | 50 | reviewed | F001 shared class |
| code-opencode assets | 15 | reviewed | none |
| code-webflow references | 86 | reviewed | F001 shared class |
| code-webflow assets | 9 | reviewed | none |
| code-quality assets | 3 | reviewed | none |
| Packet docs + metadata | 7 | reviewed | F002, F003 |
| Canonical templates + validator | 3 | reviewed | authority/counterevidence |

The 163 resource paths resolve to 160 documents because three shared workflow files are exposed by six symlink paths.

## Finding Map

| Finding | Primary path | Dimension | Iterations | Status |
|---|---|---|---|---|
| F001 | `.opencode/skills/sk-code/code-opencode/references/workflow_debug.md` | correctness | 1, 3, 4 | active P2 |
| F002 | `.opencode/specs/sk-code/019-split-doc-template-alignment/checklist.md` | traceability | 3, 4 | active P1 |
| F003 | `.opencode/specs/sk-code/019-split-doc-template-alignment/implementation-summary.md` | traceability | 3, 4 | active P2 |

## Verification Map

- Generic validator: 163/163 pass.
- Structural/semantic matrix: four prior xHigh defects remain fixed; F001 is the only residual structural advisory class.
- Security replay: packet 019 delivery is documentation-only; sibling 020 closes both prior security examples.
- Traceability replay: `spec_code` partial; `checklist_evidence` failed on F002.
- Stabilization: no additional finding class and no target mutation.

## Coverage Gate

- Source map present at init: no.
- Formal target-file map comparison: skipped by contract.
- Lineage-local evidence map emitted: yes.
