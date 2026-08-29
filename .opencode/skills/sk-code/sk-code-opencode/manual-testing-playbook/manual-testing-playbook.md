# code-opencode: Manual Testing Playbook

Routing-recall corpus for the `code-opencode` surface. These scenarios exercise the machine-readable
intent signals and resource map in `SKILL.md` §2b, and the surface detection (`OPENCODE`, work under
`.opencode/`) that causes the hub to bundle this packet. The corpus is derived from the walked tree
below, split into three category folders by resource domain.

<!-- MANUAL_PLAYBOOK_RESULT_PERSISTENCE_CONTRACT -->
> **Result persistence**: a scenario run is complete only after its `PASS`, `FAIL`, or `SKIP` outcome and
> reason are persisted through `run-manual-playbook-scenario.cjs` into
> `sk-code-opencode/benchmark/reports/<dated-run-label>/`.

## Categories

| # | Category | Folder | Scenario IDs |
|---|---|---|---|
| 1 | Language Standards | `language-standards/` | OC-001 .. OC-003, OC-009 |
| 2 | Config and Hooks | `config-hooks/` | OC-004 .. OC-005 |
| 3 | Authoring and Verification | `authoring-verification/` | OC-006 .. OC-008 |

## Scenarios

| # | ID | Intent | File |
| --- | --- | --- | --- |
| 1 | OC-001 | TYPESCRIPT | [typescript-standards.md](language-standards/typescript-standards.md) |
| 2 | OC-002 | PYTHON | [python-standards.md](language-standards/python-standards.md) |
| 3 | OC-003 | SHELL | [shell-standards.md](language-standards/shell-standards.md) |
| 4 | OC-004 | CONFIG | [config-schema.md](config-hooks/config-schema.md) |
| 5 | OC-005 | HOOKS | [hooks-wiring.md](config-hooks/hooks-wiring.md) |
| 6 | OC-006 | IMPLEMENTATION | [implementation-authoring.md](authoring-verification/implementation-authoring.md) |
| 7 | OC-007 | CODE_QUALITY | [code-quality-gate.md](authoring-verification/code-quality-gate.md) |
| 8 | OC-008 | VERIFICATION | [verification-alignment.md](authoring-verification/verification-alignment.md) |
| 9 | OC-009 | RUST | [rust-standards.md](language-standards/rust-standards.md) |

Every scenario assumes the hub's surface detection has already resolved **OPENCODE** (work under
`.opencode/`, per `SKILL.md` §1) and bundled this packet behind a workflow mode; the scenario then
exercises which reference/asset set the sample prompt's intent should load. A scenario's verdict is
`PASS` when every path in its `expected_resources` resolves under the skill root and its frontmatter
surface/intent agree with the table above, `FAIL` when either check fails, and `SKIP` only when a
specific sandbox or runtime blocker prevents the check from running.
