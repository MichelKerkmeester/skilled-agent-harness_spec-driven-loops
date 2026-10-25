# Pre-phase inventory (observed 2026-10-25)

Dependencies read from the tree: `workflow-template.yml` present (`006: ready`), `protected-set.md` present (`006-protected: ready`), and `.github/workflows/README.md` holds one `### On/off switches` heading. `hooks-node-tests.yml` is absent and `always-run-guards.yml` is absent, so the hook workflow is gone and the consolidation merge has not landed.

| Item | Count or name | How it was read |
|------|---------------|-----------------|
| Workflow files | 32 | `glob('.github/workflows/*.yml')` through PyYAML |
| Jobs | 44 | `len(jobs)` summed over those files |
| Switch lines | 42 | `grep -c "vars.SKILLED_CI != 'off'"` summed over the workflow files |
| Jobs without a switch | 2 | Both jobs of `dependabot-auto-merge.yml` |
| Switch ANDed onto an existing condition | 3 | `trigger-index-rebuild.yml` jobs `rebuild` and `push`, `skill-doc-frontmatter.yml` job `doc-version-raise` |
| Master variable | SKILLED_CI | README `### On/off switches` table |
| Group variable | SKILLED_CI_TESTS | README `### On/off switches` table |
| Group variable | SKILLED_CI_REPORTS | README `### On/off switches` table |
| Group variable | SKILLED_CI_REVIEW | README `### On/off switches` table |
| Group variable | SKILLED_CI_FRESHNESS | README `### On/off switches` table |
| Group variable | SKILLED_CI_MESSAGES | README `### On/off switches` table |

The 44 jobs are the 42 switch lines plus Dependabot's 2. The README prohibition sentence reads `SKILLED_CI_MESSAGES must stay unset while the ruleset requires that context, and so must SKILLED_CI, which switches the same job off.`

state: 32 files, 44 jobs, 42 switch lines; merged=no, hooks=absent
