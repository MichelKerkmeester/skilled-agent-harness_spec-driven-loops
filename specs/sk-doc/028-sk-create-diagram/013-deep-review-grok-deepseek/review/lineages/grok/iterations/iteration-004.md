# Iteration 4: Maintainability

## Dimension
maintainability

## Files Reviewed
- `.opencode/skills/sk-doc/sk-create-diagram/scripts/README.md`
- `.opencode/skills/sk-doc/sk-create-diagram/SKILL.md`
- `.opencode/skills/sk-doc/sk-create-diagram/feature-catalog/command-and-hub-integration/hub-registration.md`

## Findings by Severity

### P0
None.

### P1
None new. Active P1s F-T-001 and F-T-002 remain from iteration 3; not restated.

### P2

- **F-M-001**: Extract scripts have no committed regression suite. [SOURCE: .opencode/skills/sk-doc/sk-create-diagram/scripts/README.md:95]
  - README says verify with `py_compile` and `--help` only. Import parsers (XML inflate, Mermaid grammars, size ceilings, DTD reject) have no fixture tests in-tree, so the XXE and `--out` behaviors reviewed in iterations 1–2 cannot be regression-locked.
  - findingClass: missing-tests
  - scopeProof: scripts/README.md:93-99; glob of scripts/tests returned missing
  - affectedSurfaceHints: ["drawio_extract.py", "mermaid_extract.py"]

## Traceability Checks
No new protocol work. Prior partial core/overlay statuses unchanged.

## Ruled Out
- Restating F-T-003 as a maintainability finding: same alias drift, already recorded.
- Restating unused LOAD_LEVELS: already F-C-003.

## Verdict
CONDITIONAL — no new P0/P1; active P1s from traceability remain.

## Next Dimension
Stabilization pass over F-T-001 / F-T-002; no new dimension.

Review verdict: CONDITIONAL
