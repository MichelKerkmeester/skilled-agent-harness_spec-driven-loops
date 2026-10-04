# Research synthesis — cli-classifier quality audit (deepseek-v4-1-flash-max lineage)

Scope: audit the shipped cli-classifier work — the `.skilled/skills/cli-classifier` hub, its `cli-jev` packet, `shared/` transport and scorer-report scripts, `benchmark/`, feature catalog, manual testing playbook, changelogs and READMEs, and every live caller of `shared/scripts/jev-transport.mjs` and `shared/scripts/scorer-report.mjs` — on seven axes. Read only; every finding cites `file:line` and names how it was confirmed. Lineage `deepseek-v4-1-flash-max` of run `fanout-deepseek-v4-1-flash-max-1791118713156-9uew1r`; five iterations, stop policy `max-iterations`.

Method: five focused iterations — surface map and caller inventory (1), sk-doc compliance sweep (2), sk-code-opencode compliance and bug reads (3), advisor integration and UX (4), drift and results-visibility consolidation (5) — each with its narrative under `iterations/` and structured findings under `deltas/`. All 79 hub markdown docs were run through the repo's own validator; all four hub test suites (153 cases) were executed with temp writes redirected inside this lineage; the hub's README verification commands, the compiled route, the parent-hub checker and the dispatch-engine suite were run live; a `git status` containment check after every execution batch showed no repository writes.

## Findings, ranked

| # | Sev | Axis | Finding | Evidence |
|---|-----|------|---------|----------|
| F-003 | P1 | 1 | Five packet docs miss the required Overview section | `cli-jev/references/{cli-reference,integration-patterns,mcp-server,providers-and-models}.md`, `cli-jev/assets/question-shaping-card.md` — validator exit 1, `missing_required_section: overview` |
| F-001 | P2 | 5 | Hub `SKILL.md` misdescribes the transport default | `SKILL.md:114` vs `shared/scripts/jev-transport.mjs:4-7,55-73,534-553` |
| F-002 | P2 | 5 | One caller drops the answering route; catalog claim does not reconcile with code | `feature-catalog.md:63` vs `sk-doc/sk-create-skill/scripts/score-clarify-default.cjs:1271,1315,1368` |
| F-004 | P2 | 5 | Measurement doc claims a route record that caller does not write | `feature-catalog/measurements/pi-transport-integration.md:90-91,117` |
| F-005 | P2 | 5 | Test README claims 41 cases; suite holds 46 | `benchmark/pi-transport/tests/README.md:26` vs 46 `test()` declarations |
| F-006 | P2 | 3 | Approved advisor divergence: non-Jev "score" prompt reaches cli-classifier natively | `system-skill-advisor/runtime/tests/parity/fixtures/local-native-approved-divergences.json:753-761` |
| F-007 | P2 | 4 | `jev` install prerequisite not surfaced where an external user starts | hub `README.md`/`SKILL.md` (no line) vs `cli-jev/README.md:127` |
| F-008 | P2 | 7 | Changelog and version metadata lag the 2026-10-03 injection-screen changes present in shipped files | `description.json:25`, `graph-metadata.json:111` vs `049-…/004-injection-screen-improvements/implementation-summary.md:3,93-94` |
| F-009 | P2 | 5 | Packet summary recording the live result misstates the review band (0.25–0.75 vs code's 0.25–0.60) | `implementation-summary.md:56` vs `score-injection-screen.mjs:65-67,1387` |

## 1. sk-doc compliance (axis 1) — one finding

**F-003 (P1).** Five of the packet's docs fail the repo's own blocking doc validation: the four `cli-jev/references/*.md` and `cli-jev/assets/question-shaping-card.md` each report `missing_required_section: overview`. The sk-doc reference template makes `## 1. OVERVIEW` the first numbered section (`skill-reference-template.md:49,79`); `cli-reference.md` opens at `## 1. INVOCATION` (`cli-jev/references/cli-reference.md:25`). Confirmed by running `validate_document.py` over all 79 hub markdown docs with explicit types and comparing against sibling skills — four sibling references and two sibling assets pass with 0 issues, so this is hub-specific, not repo-wide. The authoring commands treat this validator as their gate, and `parent-skill-check.cjs` does not cover reference/asset structure, which is why the gap shipped.

Everything else complies: hub `SKILL.md`/`README.md`, `ROUTER.md`, all 13 changelog entries, hub and packet feature-catalogs (explicit `--type feature_catalog`), both playbook indexes (explicit `--type playbook`), all 22 packet playbook scenarios, all six measurement docs, the benchmark and shared READMEs — 0 issues each.

## 2. sk-code-opencode compliance and bugs (axes 2 and 6) — no functional bugs; one count defect

All nine hub scripts pass `node --check`. Headers match the JavaScript style guide's canonical form — 67-character `// ───` divider + `// MODULE: [Name]` (`style-guide.md:36-63`); the three `.cjs` callers use the older `╔═╗` box, which the same guide explicitly grandfathers. No commented-out code, UPPER_SNAKE constants, JSDoc on public functions, guard clauses, no stray `console.*`. `scorer-report.mjs` was read end to end and behaves as documented; one robustness observation (not a finding): `pinRowSet` spreads `extras` over computed fields, so a caller passing a reserved key would shadow it — no current caller does.

The tests are real and green: `jev-transport.test.mjs` 42/42, `scorer-report.test.mjs` 8/8, `score-injection-screen.test.mjs` 57/57, `score-pi-transport.test.mjs` 46/46 — all run with `TMPDIR` inside this lineage and no repo writes. The dispatch-engine suite the JEV-019 scenario cites ran 20/20, matching its claim. **F-005 (P2):** the pi-transport tests README claims "41 cases"; the suite holds 46.

## 3. system-skill-advisor integration (axis 3) — chain verified; one approved divergence

A prompt reaches the hub through four verified layers: (1) the advisor's committed skill graph carries `cli-classifier` with signals matching `graph-metadata.json:32-43` and adjacency matching its edges (`skill-graph.json`); the transport stays `routingClass: "metadata"` with no advisor map entry (`mode-registry.json:47-50`). (2) The compiled front door returns a single `cli-jev` target whose `effectivePolicyHash` matches the activation manifest exactly (`013-live-activation/activation/cli-classifier/manifest.json`). (3) The hub router passes every `parent-skill-check` invariant, including equal `INTENT_SIGNALS`/`RESOURCE_MAP` keys, resolving paths and registered leaves. (4) The dispatch hook (`.claude/settings.json:47`) maps `jev noul|choice|score|run` and `jev-mcp` to `cli-classifier/cli-jev` (`dispatch-audit.mjs:44-46`) and implements every declared hard rule including `command-v-jev-required` (`dispatch-rule-checks.mjs:251`).

**F-006 (P2):** the advisor's approved-divergence fixture records one cli-classifier entry — "Score this task brief for ambiguity…" (gold `sk-prompt`) reaches `cli-classifier` on the native route (`local-native-approved-divergences.json:753-761`, approved 2026-09-29). Approved current-state capture, not a regression; recorded because the audit asked how a prompt reaches the hub.

Cleared: the README's "keywords equal to both mode routers" phrasing is not an enforceable convention — the keyword sets differ in every sibling hub sampled and the contract library never evaluates intent keywords (`root-router-contract.cjs:46`).

## 4. UX (axis 4) — operator flow complete; one external-user gap

**F-007 (P2):** a user without Jev gets a correct refusal ("Run `command -v jev` before every judgment; if it fails, refuse the route…", `cli-jev/hard-rules.json:2-7`; hub `SKILL.md:139` escalates), but the install command `uv tool install jev-cli` appears only in `cli-jev/README.md:127` (§6 PROVENANCE) and playbook JEV-001 — not in the hub README or SKILL where a new user starts. Key/auth guidance is otherwise actionable (`providers-and-models.md:29-32,53-63` documents the four providers and the exact `jev auth set --provider <p>` remedy).

The operator flow is complete: `benchmark/README.md` names both scorers, the zero-call defaults, the gated live flags (`--jev`, `--pi --out`, `--cli --out`), the baseline evidence locations and the dated-folder convention; both scorers export `main(argv, deps)` and guard their entry points for testability.

## 5. Documentation accuracy (axis 5) — five findings

- **F-001 (P2):** `SKILL.md:114` says the Pi route is "opt-in" with the `jev` CLI as "the default and the fallback". The code, the module header and three sibling docs say the opposite: no selection tries Pi first, and the CLI is the fallback (`jev-transport.mjs:4-7,534-553`; `shared/scripts/README.md:16,28`; `cli-jev/SKILL.md:241-260`). It also understates the Pi route to `choice`; `noul` runs on Pi too.
- **F-002/F-004 (P2):** `feature-catalog.md:63` and `pi-transport-integration.md:90-91,117` claim the answering route is recorded as `transport` by "the five scorers" / per-file, but `score-clarify-default.cjs` writes a hardcoded `backend: 'jev'` at `:1271,:1315,:1368` and never `transport`. Five of six callers do record it; a Pi-answered run of this one is mislabeled.
- **F-005 (P2):** stale case count (41 vs 46).
- **F-009 (P2):** the packet summary that records the hub's live result says the review band is "0.25 to 0.75"; code fires it at `>= 0.25 && < 0.60` (`score-injection-screen.mjs:1387`; `BLOCK_AT` is 0.75). The hub README states it correctly. (Spec-packet doc; hub docs correct.)

## 6. Bugs in scripts and tests (axis 6) — none found beyond the above

The shared modules, both benchmark scorers and all four suites were read for error paths and executed. No functional bug surfaced. The one behavior worth a fix is the F-002 provenance gap in a caller. Test quality is high: hermetic stubs, no sockets, no keys, temp-dir cleanup, happy path plus edge cases per public surface, entry-point guards.

## 7. Drift and measured-results visibility (axis 7) — one finding, several clean lines

- **F-008 (P2):** hub files carry the 2026-10-03 injection-screen improvements (0.60 flag line, reworded arm, trust package — `benchmark/injection-screen/README.md:41-67`) and the packet records the live result (`verdict jev: keep K=90 M=90 … FP=3`, `049-…/implementation-summary.md:93-94`), but the newest changelog is `v0.7.0.0` (deem removal), `description.json:25` says `lastUpdated 2026-10-02T10:45Z` and `graph-metadata.json:111` says `last_updated_at 2026-10-02T12:00Z`.
- **No mirror drift:** `diff -rq .claude/skills/cli-classifier .skilled/skills/cli-classifier` is empty — byte-identical trees.
- **Results are visible for the two routing measurements:** the pi-transport verdict is quoted with its recorded run file, which exists and matches (`037-…/scratch/live-run.stdout.txt`); the hub-routing report gives verdicts, the before/after delta ("before the vocabulary change … `defer`"), out-of-domain replays and an honest known false positive (`use jev` matching `use jevons`, mitigated at stage one).
- **Version/metadata internals are consistent** (all routing artifacts at 0.7.0.0; README frontmatter version is a doc revision repo-wide, cleared as non-drift in iteration 1).

## Eliminated Alternatives

- README/SKILL version lag as drift — repo-wide convention (six-skill sample), validator-clean.
- `cli-deem` mentions as stale references — historical changelog records only.
- Benchmark-report validation failures as a hub defect — sibling skills fail identically; the doc type is ungoverned repo-wide.
- Auto-detect fallback warnings on `ROUTER.md`/catalogs/playbooks as defects — resolved to VALID with explicit types.
- `.cjs` callers' older box headers as violations — explicitly grandfathered by the style guide.
- Missing `'use strict'` in `.mjs` files — module semantics; the alignment verifier skips them by design.
- `hub_skills` omission of cli-classifier as a defect — it is a degree metric, not a hub registry.
- Keyword-set difference vs mode routers as a defect — no sibling hub matches either; not contract-enforced.
- Older benchmark reports' `--hub cli-jev` command as stale — dated records under an explicit "stay as written" convention; the migration is documented (`changelog/v0.4.0.0.md:26`) and current scenarios use `--hub cli-classifier`.

## Divergence Map

No divergent pivots were recorded in this lineage (convergence mode `default`; pivot lineage: none). Saturated directions: none. Remaining frontier: none — all seven axes reached findings or explicit clean lines within the five-iteration cap.

## Open Questions

- Whether the hub should surface the `jev` install prerequisite in its own README (F-007) or rely on the packet's PROVENANCE section is an operator call.
- Whether the 2026-10-03 injection-screen changes should ship as hub `v0.8.0.0` with a changelog entry or are pending release (F-008) is a release-process call.
- The `use jev`/`use jevons` false positive is contained at stage one but would need an end boundary in the shared detector matcher to close fully — tracked by the 2026-09-26 report, outside this audit's fix scope.

## References

- Hub root: `.skilled/skills/cli-classifier/` (`SKILL.md`, `README.md`, `ROUTER.md`, `mode-registry.json`, `hub-router.json`, `leaf-manifest.json`, `description.json`, `graph-metadata.json`, `changelog/`, `benchmark/`, `feature-catalog/`, `manual-testing-playbook/`, `shared/`).
- Packet: `.skilled/skills/cli-classifier/cli-jev/` (SKILL.md, README.md, references/, assets/, hard-rules.json, playbook, benchmark, changelog).
- Callers: `sk-doc/sk-create-skill/scripts/score-clarify-default.cjs`, `sk-doc/shared/scripts/cite-drift-scan.mjs`, `benchmark/injection-screen/score-injection-screen.mjs`, `system-deep-loop/deep-improvement/scripts/model-benchmark/{scorer/score-d4-agreement.cjs,lib/score-verdict-fallback.cjs}`, `system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs`, `system-spec-kit/runtime/cli/evals/score-alignment-suggestion.ts`.
- Standards and tooling: `sk-doc/shared/scripts/validate_document.py`; `sk-code/sk-code-opencode/references/javascript/style-guide.md` + `assets/checklists/javascript-checklist.md`; `.skilled/hooks/dispatch/`; `.skilled/commands/doctor/scripts/parent-skill-check.cjs`; `.skilled/bin/compiled-route.cjs`.
- Packet records: `specs/cli-jev/003-cli-jev-workflow-integration/035-fetched-text-injection-screen/`, `037-pi-native-classifier-transport/`, `049-jev-feature-improvement-build/004-injection-screen-improvements/`.
- Per-iteration evidence: `iterations/iteration-001.md` … `iteration-005.md`; `deltas/iter-001.jsonl` … `iter-005.jsonl`; `resource-map.md`.

## Convergence Report

- Stop reason: maxIterationsReached
- Total iterations: 5
- Questions answered: 5 / 5 (each key question reached an evidence-backed answer or clean line)
- Remaining questions: 0 open in this lineage (three operator-call items noted above)
- Last 3 iteration summaries: run 3: sk-code-opencode compliance and bugs (0.5); run 4: advisor integration and UX (0.6); run 5: drift consolidation and verification (0.5)
- Convergence threshold: 0.05 (telemetry only under `stopPolicy: max-iterations`)
- NewInfoRatio trend: 1.0 → 0.7 → 0.5 → 0.6 → 0.5
- Divergence summary: no divergent pivots recorded
- Segment transitions, wave scores, and checkpoint metrics are experimental and omitted from the live report.
