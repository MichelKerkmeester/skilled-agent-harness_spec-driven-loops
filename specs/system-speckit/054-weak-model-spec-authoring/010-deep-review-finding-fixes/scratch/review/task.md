## TASK: read-only closing review of phases 010 and 012

You are reviewing uncommitted changes in this git worktree. Do not edit, create or delete any file. Do not run git commands that change state. Write your whole answer to stdout.

The full diff is saved at:
  specs/system-speckit/054-weak-model-spec-authoring/010-deep-review-finding-fixes/scratch/review/changes.diff

Read it, then open the changed files where you need more context.

What the changes are meant to do:
1. Validation gates in `.skilled/skills/system-spec-kit/runtime/` (orchestrator.ts, both check-placeholders.sh scripts, check-scaffold-never-touched.sh, status-classifier.sh, validator-registry.json, create.sh, corpus.mjs, packet-synopsis.ts). Every new or stricter check applies only to docs stamped `v2.3`. A `v2.2` doc must get exactly the verdict it got before. `create.sh --track` must refuse any value that resolves outside `specs/`.
2. The citation scanners (`runtime/cli/rules/check-source-tags-helper.mjs`, `.skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs`) pass `-c core.fsmonitor=false` to git so they stop hanging. Their output must not change.
3. Authoring guidance: the spec authoring card, the tasks template description, level-specifications.md, and catalog, playbook and reference docs. Each doc must describe what the code does now.
4. Tests added under `runtime/cli/tests/`.

Check for:
- A v2.2 doc whose verdict could change (P0 if it changes any existing packet's verdict).
- Divergence between the TypeScript orchestrator and the shell rule for the same input.
- A path in `create.sh --track` handling that still escapes `specs/` (symlinked tracks are allowed by design and are checked lexically).
- A doc sentence that the code contradicts. Cite both lines.
- A test that cannot fail, or that asserts the implementation instead of the behavior.

Severity: P0 breaks an existing packet's verdict or loses data. P1 is a wrong behavior or a doc that would mislead a model into a failing packet. P2 is everything else worth fixing.

Output format, exactly:
FINDINGS:
- [P?] path:line - one-sentence defect. Evidence: path:line (and the contradicting path:line).
(or the single line `- none`)
SUMMARY: P0=<n> P1=<n> P2=<n>
