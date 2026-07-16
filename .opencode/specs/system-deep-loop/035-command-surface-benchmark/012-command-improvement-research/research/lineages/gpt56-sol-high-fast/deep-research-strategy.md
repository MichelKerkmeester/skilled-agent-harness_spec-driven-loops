# Deep Research Strategy

## Charter

Research the create-command canon and the `create/*`, `design/*`, `speckit/*`, `memory/*`, `doctor/*`, and `deep/*` command surfaces. Produce evidence-backed, prioritized candidate changes; do not implement them.

## Research tracks

1. Test the canon against its own templates and validator.
2. Compare recurring behavior across all routed command families.
3. Reproduce benchmark findings and map validator blind spots.
4. Trace invocation grammar through OpenCode, Codex mirrors, and detached fan-out.
5. Convert recurring failures into ergonomic, deterministic authoring controls.

## Method

Each iteration owns one research question, records file-and-line evidence, distinguishes canon-wide defects from command-local errors, proposes target paths and acceptance criteria, and documents rejected directions. Convergence signals are telemetry only until iteration 5 because the configured stop policy is `max-iterations`.

## Non-goals

No shipped command, template, validator, workflow, or runtime file is changed. No benchmark score is reclassified without tracing the producing adapter.

## Completion state

All five tracks were completed. Synthesis is in `research.md`; source coverage is in `resource-map.md`; no question remains open.
