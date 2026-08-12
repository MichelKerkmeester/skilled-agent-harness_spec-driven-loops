# Iteration 1: Correctness

## Dimension
correctness

## Files Reviewed
- `.opencode/skills/sk-doc/sk-create-diagram/SKILL.md`
- `.opencode/skills/sk-doc/sk-create-diagram/scripts/validate-flowchart.sh`
- `.opencode/skills/sk-doc/sk-create-diagram/scripts/drawio_extract.py`
- `.opencode/skills/sk-doc/sk-create-diagram/scripts/mermaid_extract.py`
- `.opencode/commands/create/diagram.md`
- `.opencode/skills/sk-doc/sk-create-diagram/assets/ascii-patterns/simple-workflow.md`
- `.opencode/skills/sk-doc/sk-create-diagram/assets/ascii-patterns/decision-tree-flow.md`

## Findings by Severity

### P0
None.

### P1
None.

### P2

- **F-C-001**: UNKNOWN_FALLBACK checklist still asks only for an `.html` deliverable after ascii-markdown shipped. [SOURCE: .opencode/skills/sk-doc/sk-create-diagram/SKILL.md:213]
  - The live command accepts `.html` or `.md` and SKILL.md §2 resolves `ascii-markdown`, but the disambiguation checklist item is `"Confirm the target file path for the .html deliverable"`.
  - findingClass: completeness
  - scopeProof: SKILL.md:211-216 vs diagram.md:3 and SKILL.md:85
  - affectedSurfaceHints: ["skill-router", "command-setup"]

- **F-C-002**: `check_nesting_depth` treats leading spaces as markdown indent depth, so the packet's own ASCII pattern assets warn as "deep nesting". [SOURCE: .opencode/skills/sk-doc/sk-create-diagram/scripts/validate-flowchart.sh:92]
  - Observed: `simple-workflow.md` warning level 9; `decision-tree-flow.md` warning level 21. Exit remains 0 (warning-only), matching SKILL.md ALWAYS rule 8.
  - findingClass: validator-false-positive
  - scopeProof: ran `bash scripts/validate-flowchart.sh` on both pattern assets
  - affectedSurfaceHints: ["validate-flowchart.sh", "ascii-markdown-gate"]

- **F-C-003**: `LOAD_LEVELS` is declared in the smart-router pseudocode and never read by `route_diagram_resources`. [SOURCE: .opencode/skills/sk-doc/sk-create-diagram/SKILL.md:204]
  - Dead config cannot change load behavior; ASCII_MARKDOWN omission from that map is therefore inert. Actual loading uses `RESOURCE_MAP` + `load_if_available`.
  - findingClass: dead-config
  - scopeProof: `route_diagram_resources` body SKILL.md:258-290 never references `LOAD_LEVELS`
  - affectedSurfaceHints: ["skill-router"]

## Traceability Checks
Not this iteration. Core protocols deferred to the traceability pass.

## Ruled Out
- Extractor XXE / entity expansion as a correctness failure: `drawio_extract.py` rejects `<!DOCTYPE` / `<!ENTITY` before parse. [SOURCE: .opencode/skills/sk-doc/sk-create-diagram/scripts/drawio_extract.py:59]
- Validator hard-failing the shipped pattern assets: both assets exit 0.
- 27-type claim vs files: 27 `references/types/type-*.md` files exist and match the SKILL.md type table.

## Dead Ends
- Grep for `\bif\b` in `simple-workflow.md` found no hits, so the loose `if` token in `check_decision_labels` did not fire on that asset.

## Adversarial self-check
No P0 candidates. P2 items re-read at cited lines before recording.

## Verdict
PASS with advisories (P2 only).

## Next Dimension
security — extract `--out` path writes, XML/Mermaid trust boundary, validator file handling.

Review verdict: PASS
