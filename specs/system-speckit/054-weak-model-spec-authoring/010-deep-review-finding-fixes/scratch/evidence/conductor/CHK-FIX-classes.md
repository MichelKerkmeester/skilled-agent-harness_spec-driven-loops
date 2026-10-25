# Finding classes and inventories for the nine P1 findings

Written 2026-10-25 by the conductor for CHK-FIX-001 to CHK-FIX-006. CHK-FIX-007 pins the evidence to the commit SHAs recorded in `implementation-summary.md`.

| Finding | Class | Producer inventory | Consumer inventory | Adversarial or matrix proof |
|---------|-------|--------------------|--------------------|-----------------------------|
| P1-01 `create.sh --track` leaves `specs/` | class-of-bug (path containment) | `--track` is the only path-joining flag that reaches `mkdir`; every in-repo `--track` caller passes an accepted value (lane A report) | `create.sh` callers, `track-root-children-lists.md` | `create-track-containment.vitest.ts`: `..`, `../x`, `../../escaped`, `a/../../x` (joined input), an absolute path (outside root), `.`, empty value (no-op), an existing symlinked track (fallback), `demo/sub` (delimiter) |
| P1-02 orchestrator scans one match per line | algorithmic, cross-consumer | Three placeholder scanners exist: the orchestrator, `rules/check-placeholders.sh`, `spec/check-placeholders.sh` (lane A report) | All three now share one marker scan for v2.3 | `placeholder-token-gate.vitest.ts`: stamp (v2.2, v2.3) x status (Draft, Complete) x 9 shapes = 36 cells, plus one In Progress mixed-line case, 37 rows |
| P1-03 and P1-04 the post-edit scan (`spec/check-placeholders.sh`) does not share the strict gate's markers | cross-consumer | Same three scanners | Post-edit hook router row 4, `/speckit:*` callers | `post-edit-placeholder-scan.vitest.ts`; markers equal the orchestrator's four (ADR-003); `T016-after.txt`: token folder `"placeholders":1`, packet 054 `"placeholders":0` at close |
| P1-05 required sections not enforced | class-of-bug | ANCHORS_VALID is the only anchor rule | `validator-registry.json`, `validation-rules.md` rule 7, the anchor catalog leaf | `required-template-anchors.vitest.ts` parity cases; v2.2 copy keeps its verdict (`T018-before.txt`, `T018-sandbox-after.txt`) |
| P1-06 speckit assets omit the card | instance-only | `rg -l spec-authoring-card .skilled/commands/speckit/` lists all five command files | Plan and implement YAML | AC-006 output |
| P1-07 card contradictions | instance-only | One card | `check-card-sync.sh` | `check-card-sync.sh` exit 0, 10 PASS |
| P1-08 template-mapping teaches `[PLACEHOLDER]` | instance-only | `rg -n '\[PLACEHOLDER\]' --glob '*.md'` finds only fixtures and one descriptive catalog line | `template-mapping.md` | AC-008 output |
| P1-09 scenario 483 cleans up before checking containment | test-isolation | One scenario | Playbook runner | `level-1-packet-authored-from-card.md:86` and `:109` |

Hostile environment (CHK-FIX-006): the corpus walker test asserts the git argv itself, so it holds with or without `GIT_CONFIG_*` in the environment. The suites ran with a `core.fsmonitor=false` override set; `SOURCE_TAGS` on the 054 parent was timed with the override removed (`012-authoring-speed-fixes-and-alignment/scratch/lane-1/source-tags-054-parent.txt`).
