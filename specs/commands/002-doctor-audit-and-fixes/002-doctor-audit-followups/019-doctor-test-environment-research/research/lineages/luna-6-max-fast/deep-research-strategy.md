# Deep Research Strategy — fanout-luna-6-max-fast

## Research Topic
Research connected contract gaps and a persistent local test environment for doctor commands: corpus-pollution semantics in /doctor:speckit; unknown-flag handling in /doctor:mcp; a long-lived /doctor:update worktree with representative unit classifications; and exact doctor manual-playbook changes for reuse of that environment.

## Known Context
- Target packet: `specs/system-speckit/049-doctor-audit-followups/019-doctor-test-environment-research`. `resource-map.md` was absent at initialization; skip the coverage gate.
- The lineage is the complete write surface. Existing source, packet, playbook, and Git data are read-only.

## Key Questions (remaining)
- [x] What should /doctor:speckit do with non-zero phraseQuality diagnostics, given the lookup ranking behavior, and how should DOC-349/DOC-350 and tests change?
- [x] What unknown-flag error should /doctor:mcp add, and how do the other doctor command contracts handle unknown arguments today?
- [x] How can a long-lived local /doctor:update environment exercise customized, conflict, removed, and local-only units across record-base/check/align/apply/rollback, including release-tag and worktree constraints?
- [x] Which other doctor-command playbooks should reuse that environment, which exact scenario files need changes, and what new scenarios should be added?

## Answered Questions
- **Updater environment:** Use a numbered local branch worktree at `v4.0.0.0`; overlay the current router, engine, route manifest, presentation, and five action YAMLs. Commit local fixtures/base manifest, use a synthetic local deletion tag, and reset apply through its recorded rollback run.
- **Shared doctor suites:** Use the same fixture with per-scenario reset; migrate the copy-based scenario files in five playbooks and add DOC-379 updater lifecycle and DOC-380 MCP unknown-flag tests.
- **/doctor:speckit quality:** Show nonzero phraseQuality count/share as an advisory, not a staleness class or severity. Lookup can rank exact and multi-token flagged phrases, so avoid claiming every flagged phrase is inert; keep diagnostics and fix only proven bad phrases. DOC-349 should pass with `OK`; DOC-350 should remain stale only for actual stale-index evidence. Add doctor contract coverage.
- **/doctor:mcp flags:** Unknown-to-both `--server` should fail before YAML load with `ERROR="unknown_flag"` and action-specific valid flags. Preserve cross-action error for known flags exclusive to the other sub-action; this matches other doctor routers.


## What Worked
- Direct source and playbook inspection located contracts and concrete test fixtures.

## What Failed
- None.

## Ruled-Out Directions
- Do not execute update, checkout, staging, tests, or any workflow write outside this lineage.

## Next Focus
Synthesis complete. The two-iteration cap was reached with all four research questions answered; no additional iteration is planned.

## Research Boundaries
- Maximum iterations: 2; convergence threshold: 0.05; stop policy: max-iterations.
- Executor: inline in this session; no nested iteration dispatch.
