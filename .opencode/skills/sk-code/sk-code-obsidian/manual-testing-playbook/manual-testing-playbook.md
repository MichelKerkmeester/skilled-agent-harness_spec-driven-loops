# sk-code-obsidian: Manual Testing Playbook

Routing-recall corpus for the `sk-code-obsidian` surface. These scenarios exercise the
machine-readable `INTENT_SIGNALS`/`RESOURCE_MAP` in `SKILL.md` §2b, and the surface detection
(**OBSIDIAN**) that causes the hub to bundle this packet. The corpus is derived from the walked
tree below, flat by design — this surface's routing map is small enough for one directory, so
there is no category-subfolder split.

<!-- MANUAL_PLAYBOOK_RESULT_PERSISTENCE_CONTRACT -->
> **Result persistence**: a scenario run is complete only after its `PASS`, `FAIL`, or `SKIP`
> outcome and reason are persisted through `run-manual-playbook-scenario.cjs` into
> `sk-code-obsidian/benchmark/reports/<dated-run-label>/`.

## Scenarios

| # | ID | Intent | File |
| --- | --- | --- | --- |
| 1 | OB-001 | IMPLEMENTATION | [renderer-feature-routing.md](renderer-feature-routing.md) |
| 2 | OB-002 | IMPLEMENTATION | [modal-screenshot-routing.md](modal-screenshot-routing.md) |
| 3 | OB-003 | CODE_QUALITY | [db-class-rename-routing.md](db-class-rename-routing.md) |
| 4 | OB-004 | CODE_QUALITY | [folder-docs-routing.md](folder-docs-routing.md) |
| 5 | OB-005 | DEBUGGING | [debugging-routing.md](debugging-routing.md) |
| 6 | OB-006 | VERIFICATION | [verification-routing.md](verification-routing.md) |
| 7 | OB-007 | STACK_STANDARDS | [stack-standards-routing.md](stack-standards-routing.md) |

Every scenario assumes the hub's surface detection has already resolved **OBSIDIAN** (CWD or
changed/target files sitting under the Obsidian Plugin repository tree, with `manifest.json`
carrying `minAppVersion`, `esbuild.config.mjs`, and `from "obsidian"` imports as the resolving
markers, per `SKILL.md` §1) and bundled this packet behind a workflow mode; the scenario then
exercises which reference/asset set the sample prompt's intent should load. A scenario's verdict
is `PASS` when every path in its `expected_resources` resolves under the skill root and its
frontmatter surface/intent agree with the table above, `FAIL` when either check fails, and `SKIP`
only when a specific sandbox or runtime blocker prevents the check from running.

IMPLEMENTATION carries two scenarios and CODE_QUALITY carries two, because those are the two
intents this surface risks getting wrong in practice: `SKILL.md` §3's single hardest rule
("never invent a `.db-*` class") sits on the IMPLEMENTATION path both when a renderer feature is
built and when a screenshot scenario is added for one of the seventeen unphotographed modals
under `src/views/modals/`; and CODE_QUALITY covers both a stylesheet-wide `.db-*` rename and the
folder-doc pairing threshold, the two conventions in §3b most likely to be applied against the
wrong file set. `SKILL.md` §2b's own `RESOURCE_MAP` names a few reference filenames
(`references/single-stylesheet-ownership.md`, `references/screenshot-fixture-harness.md`,
`references/obsidian-api-boundary.md`, `assets/renderer-implementation-checklist.md`,
`assets/comment-grammar-checklist.md`, `assets/debug-checklist.md`) that do not match the shipped
tree — the real files are `references/stylesheet-ownership.md`, `references/screenshot-harness.md`,
`references/obsidian-plugin-api.md`, and the seven checklists phase `006-assets-checklists`
actually authored. Every `expected_resources` path below was checked against the live packet
directory, not against that stale map; per this packet's own smart-router note, the curated set is
a core subset and is not required to mirror `RESOURCE_MAP` exactly.
