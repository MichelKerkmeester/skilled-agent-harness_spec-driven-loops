# code-mobile-cli: Manual Testing Playbook

Routing-recall corpus for the `code-mobile-cli` surface. These scenarios exercise the machine-readable
intent signals and resource map in `SKILL.md` §2b, and the surface detection (PI_REMOTE) that causes the
hub to bundle this packet. The corpus is derived from the walked tree below, flat by design — this
surface's routing map is small enough for one directory, so there is no category-subfolder split.

<!-- MANUAL_PLAYBOOK_RESULT_PERSISTENCE_CONTRACT -->
> **Result persistence**: a scenario run is complete only after its `PASS`, `FAIL`, or `SKIP` outcome and
> reason are persisted through `run-manual-playbook-scenario.cjs` into
> `sk-code-mobile-cli/benchmark/reports/<dated-run-label>/`.

## Scenarios

| # | ID | Intent | File |
| --- | --- | --- | --- |
| 1 | PR-001 | IMPLEMENTATION | [token-edit-routing.md](token-edit-routing.md) |
| 2 | PR-002 | IMPLEMENTATION | [comment-convention-routing.md](comment-convention-routing.md) |
| 3 | PR-003 | CODE_QUALITY | [guardrail-routing.md](guardrail-routing.md) |
| 4 | PR-004 | DEBUGGING | [debugging-routing.md](debugging-routing.md) |
| 5 | PR-005 | VERIFICATION | [verification-routing.md](verification-routing.md) |
| 6 | PR-006 | LANGUAGE_STANDARDS | [language-standards-routing.md](language-standards-routing.md) |
| 7 | PR-007 | ACCESSIBILITY | [accessibility-routing.md](accessibility-routing.md) |

Every scenario assumes the hub's surface detection has already resolved **PI_REMOTE** (CWD or
changed/target files under `app-mobile/`, `app-relay/`, or `packages/pi-rpc-protocol/`, per `SKILL.md`
§1) and bundled this packet behind a workflow mode; the scenario then exercises which reference/asset set
the sample prompt's intent should load. A scenario's verdict is `PASS` when every path in its
`expected_resources` resolves under the skill root and its frontmatter surface/intent agree with the
table above, `FAIL` when either check fails, and `SKIP` only when a specific sandbox or runtime blocker
prevents the check from running.
