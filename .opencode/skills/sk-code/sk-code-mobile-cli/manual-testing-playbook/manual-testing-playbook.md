# code-mobile-cli: Manual Testing Playbook

Routing-recall corpus for the `code-mobile-cli` surface. These scenarios exercise the machine-readable
intent signals and resource map in `SKILL.md` §2b, and the surface detection (PI_REMOTE) that causes the
hub to bundle this packet, without requiring a root scenario index table.

Totals: 7 scenarios, flat (this surface's routing map is small enough for one directory — no category
subfolders).

## Scenarios

| # | ID | Intent | File |
| --- | --- | --- | --- |
| 1 | PR-001 | IMPLEMENTATION | `token-edit-routing.md` |
| 2 | PR-002 | IMPLEMENTATION | `ds-grammar-routing.md` |
| 3 | PR-003 | CODE_QUALITY | `guardrail-routing.md` |
| 4 | PR-004 | DEBUGGING | `debugging-routing.md` |
| 5 | PR-005 | VERIFICATION | `verification-routing.md` |
| 6 | PR-006 | LANGUAGE_STANDARDS | `language-standards-routing.md` |
| 7 | PR-007 | ACCESSIBILITY | `accessibility-routing.md` |

Every scenario assumes the hub's surface detection has already resolved **PI_REMOTE** (CWD or
changed/target files under `apps/pi-remote-web/`) and bundled this packet behind a workflow mode; the
scenario then exercises which reference/asset set the sample prompt's intent should load.
