# Review Iteration 003

## Dispatcher

- Mode: review (fan-out lineage `vibe`, session `fanout-vibe-1795299580084-7g6zan`, generation 1, lineageMode `new`)
- Review target: `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub` (spec-folder)
- Dimension: traceability
- Iteration: 3 of 5 (`stopPolicy: max-iterations`)
- Operator review focus addressed: this iteration closed the two focus items a file-level review can settle — "advisor routing at both stages" and "nested sub-track support in system-spec-kit" — and checked all seven parent-goal completion criteria against recorded evidence. The advisor fixtures, the two-stage replay benchmark and the `MAX_SUB_TRACK_DEPTH` reader are the surfaces the focus names.

## Files Reviewed

- `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/goal.md` (completion criteria)
- `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/005-routing-and-surfaces/implementation-summary.md` (full)
- `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/006-verification/implementation-summary.md` (sections 1-3)
- `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/006-verification/tasks.md` (T016)
- `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/002-hub-scaffold/implementation-summary.md`, `004-bladebro-mode/tasks.md`, `001-research/implementation-summary.md` (validate evidence rows)
- `.skilled/skills/mcp-browser-use/benchmark/reports/compiled-routing/2026-11-21--two-stage-replay--compiled/results.csv` (full)
- `.skilled/skills/system-skill-advisor/runtime/scripts/fixtures/skill-advisor-regression-cases.jsonl` (diff)
- `.skilled/skills/system-skill-advisor/runtime/tests/parity/fixtures/local-native-approved-divergences.json` (diff)
- `.skilled/skills/system-skill-advisor/runtime/scripts/skill-graph.json` (family and adjacency entries)
- `.skilled/skills/system-spec-kit/runtime/cli/lib/track-roots.mjs` (sub-track depth reader)
- `.skilled/skills/system-spec-kit/runtime/cli/tests/nested-subtrack.vitest.ts` (test names)
- `.skilled/skills/mcp-tooling/{mode-registry.json,hub-router.json,leaf-manifest.json,SKILL.md,README.md}` (criterion 3 scan)

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **The 005 summary's frontmatter says the compiled front door was deferred, while its own body says it was built in that phase** -- `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/005-routing-and-surfaces/implementation-summary.md:3` -- the `description` field reads "Both routing stages now reach all three browser modes; the compiled front door for the new hub is left for a later phase" (`:3`). Known Limitations item 1 in the same file says the opposite: "On 2026-11-21 the operator chose to build the compiled engine inside this phase. `mcp-browser-use` is now the eighth compiled-routing hub … the serving flip" (`:156`). The description is the surface retrieval and continuity read, and it is the one a resumed session sees first, so a reader learns that the hub has no compiled front door while `mcp-browser-use/SKILL.md:62` and `ROUTER.md`'s machine-router callout both instruct the agent to use that front door first.
   Finding class: stale-metadata
   Scope proof: the file is in `reviewScopeFiles`; the contradiction is between two lines of the same file, not against an external standard.
   Affected surface hints: `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/005-routing-and-surfaces/implementation-summary.md`, `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/005-routing-and-surfaces/spec.md`, `.skilled/skills/mcp-browser-use/SKILL.md`
   Case: a session resumes the packet, reads the 005 description, and concludes the hub still serves legacy routing, so it debugs `hub-router.json` instead of the compiled engine that actually answers.

2. **The 006 continuity block still names landing the per-phase commits as the next safe action, and those commits are already on the branch** -- `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/006-verification/implementation-summary.md:14` -- `_memory.next_safe_action` reads "Land per-phase local commits 002-006" (`:14`) while `git log --oneline main..HEAD` shows all five phase commits already landed (`6efbff5d094` scaffold, `e60f28021d1` relocation, `bcc330cb2b5` Bladebro, `6a5e1048ea5` routing, `c7f38f295d2` verification). `/speckit:resume` surfaces this field as the next action, so a resumed session is pointed at work that is done. The field also sits in tension with decision D8 ("No commits without the operator's instruction"): the recorded next action is a commit instruction, and the only thing that keeps it from being acted on is that the work is already complete.
   Finding class: stale-metadata
   Scope proof: the file is in `reviewScopeFiles`; the commit list was read from the branch, not inferred.
   Affected surface hints: `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/006-verification/implementation-summary.md`, `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/goal.md` (D8)
   Case: an operator resumes the packet after a break, sees "Land per-phase local commits 002-006", and either wastes a step discovering there is nothing to land or, on a branch where one phase commit was dropped, lands it without the operator instruction D8 requires.

## Traceability Checks

| Protocol | Status | Evidence |
|----------|--------|----------|
| `spec_code` | pass | All seven parent-goal completion criteria verified against files. Criterion 1: `001-research/research/research.md` exists (32,719 bytes) and `deep-research-state.jsonl` holds 12 `"type":"iteration"` records. Criterion 2: `mcp-browser-use/mode-registry.json` declares exactly three modes and `mcp-tooling/mode-registry.json` six. Criterion 3: `rg "mcp-tooling/mcp-chrome-devtools\|mcp-tooling/mcp-aside-devtools" .skilled --glob '!**/changelog/**' --glob '!**/benchmark/reports/**'` returns no match, and `rg "mcp-chrome-devtools\|mcp-aside-devtools"` over the five named `mcp-tooling` files returns no match. Criterion 4: `parent-skill-check.cjs` exit 0 naming the hub (iteration 1). Criterion 5: `benchmark/reports/compiled-routing/2026-11-21--two-stage-replay--compiled/results.csv` records 6 of 6 PASS with `advisor_top=mcp-browser-use` and `stage1=true, stage2=true` on every row. Criterion 6: three playbooks with recorded runs, including the Bladebro macOS live run (iteration 2). Criterion 7: `RESULT: PASSED` recorded for the parent and all six children at `005-routing-and-surfaces/implementation-summary.md:148` and `006-verification/tasks.md:65`, with per-child rows at `002-hub-scaffold/implementation-summary.md:110`, `004-bladebro-mode/tasks.md:64` and `001-research/implementation-summary.md:124`. |
| `checklist_evidence` | pass | Every child phase's `tasks.md` carries a validation task with recorded evidence rather than a bare checkbox: `002-hub-scaffold/tasks.md:58` (`RESULT: PASSED (errors=0 warnings=0)`, exit 0), `004-bladebro-mode/tasks.md:64` (same), `005-routing-and-surfaces/tasks.md:71` (recorded in its implementation summary), `006-verification/tasks.md:65` (exit 0, parent plus six children, warnings enumerated per child), `001-research/tasks.md:57` (PASSED with one `SOURCE_TAGS` warning inside workflow-owned `research/**`). The warnings are named rather than suppressed, which is what makes the evidence usable. |

## Integration Evidence

- **Advisor stage one.** `.skilled/skills/system-skill-advisor/runtime/scripts/skill-graph.json` lists `mcp-browser-use` in the `mcp` family beside `mcp-code-mode` and `mcp-tooling`, with `depends_on: {mcp-code-mode: 0.7}`, `enhances: {sk-code: 0.5}`, and a reciprocal `prerequisite_for` edge from `mcp-code-mode`. The hub is a first-class advisor identity, not an alias of `mcp-tooling`.
- **Advisor fixtures.** `mcp-browser-use` appears in `fixtures/skill-advisor-regression-cases.jsonl` (2 cases), `fixtures/gate2-golden-prompts.jsonl` (1), `routing-accuracy/labeled-prompts.jsonl` (5) and `routing-accuracy/holdout-prompts.jsonl` (4).
- **The relabelled P0 cases are a label move, not a behaviour change.** The diff of `skill-advisor-regression-cases.jsonl` changes only `expected_top_any` on `P0-CHROME-001` and `P0-CHROME-002`, from `mcp-tooling` to `mcp-browser-use`; the prompts and every other field are untouched. `005-routing-and-surfaces/implementation-summary.md:159` records that after relabelling "every accuracy metric equals the committed baseline (full corpus 159 of 196, holdout 49 of 63, ambiguity 21 of 24)", so the relabel did not buy a metric.
- **The new divergence is recorded, not hidden.** `tests/parity/fixtures/local-native-approved-divergences.json` gains `rr-hub6-204` with `gold: mcp-browser-use`, `localTop: mcp-browser-use`, `nativeTop: mcp-code-mode`, an explicit reason and `approvedAt: 2026-11-21`, and the ledger's `scoringInstant` moves to `2026-11-21T00:00:00Z`.
- **Nested sub-track support is real and bounded.** `.skilled/skills/system-spec-kit/runtime/cli/lib/track-roots.mjs:41` exports `MAX_SUB_TRACK_DEPTH = 2`, `:122` reads declared sub-tracks recursively with a depth argument, and `:132` refuses a third level with the diagnostic `declared sub-track nested past two sub-track levels, not read`. `runtime/cli/tests/nested-subtrack.vitest.ts` covers the level-2 listing, the third-level refusal, packet creation in a level-2 sub-track, graph parent derivation, archive and relocation. The packet under review sits at `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub`, which is exactly the two-level shape the reader supports.

## Edge Cases

- **Ambiguity: what "one real browser request per mode" proves.** Criterion 5 is satisfied by a curated six-row benchmark (`results.csv`), not by a general claim that every browser prompt routes. `005-routing-and-surfaces/implementation-summary.md:161` records that "Open the local page, click through the UI, and tell me what appears in the console" routes nowhere. I scored the criterion as met because it asks for one request per mode, and recorded the broader gap here rather than converting it into a finding.
- **Contradiction recorded, not resolved:** `005-routing-and-surfaces/implementation-summary.md:157` records that `mcp-tooling` still lists at 0.54-0.58 on browser prompts, while the benchmark's `mcp_tooling_above_threshold` column is `false` on all six rows. Both are true: the residual score is below the 0.8 default gate, so it never wins. The two statements describe different thresholds, not different behaviour.
- **Missing optional evidence:** I did not re-run `validate.sh` — the lineage's write constraints forbid running repo tooling that writes. Criterion 7 is scored on recorded evidence with file:line, and the recorded warnings are enumerated per child rather than summarised.
- **Documented limitation carried forward, not raised:** `005-routing-and-surfaces/implementation-summary.md:164` records that the semantic lane holds no vectors for the changed skills because the local Ollama backend was unreachable. That weakens stage-one recall for the new hub but is documented and outside the packet's control, so it is an edge case rather than a finding.

## Confirmed-Clean Surfaces

- Criterion 3 holds on both halves: no `mcp-tooling/mcp-chrome-devtools` or `mcp-tooling/mcp-aside-devtools` path anywhere under `.skilled` outside changelog and benchmark/reports, and neither mode id appears in `mcp-tooling`'s `mode-registry.json`, `hub-router.json`, `leaf-manifest.json`, `SKILL.md` or `README.md`.
- The two-stage replay benchmark is internally consistent: every row has `advisor_top=mcp-browser-use`, `advisor_passes=true`, `stage1=true`, `stage2=true`, `verdict=PASS`, and the `route_target` matches `gold_mode`.
- The `mcp-tooling` hub kept six modes and stayed green after losing two, as decision D3 requires.
- `MAX_SUB_TRACK_DEPTH = 2` is enforced on read, on create and on relocate, with a named diagnostic for the refused third level.

## Ruled Out

- **The relabelled P0 browser cases hiding a regression.** Ruled out: the diff touches only `expected_top_any` on two cases, and the recorded post-relabel metrics equal the committed baseline on all three corpora.
- **The new approved divergence being an unreviewed capture.** Ruled out: the entry carries a gold label, both tops, a written reason and an approval date, and the ledger's `scoringInstant` was moved with it.
- **Nested sub-track support being unbounded recursion.** Ruled out: `MAX_SUB_TRACK_DEPTH = 2` with an explicit refusal diagnostic and a test that asserts the third level is refused before any write.
- **Criterion 1 resting on a missing research artefact.** Ruled out: `research.md` exists and the state log holds 12 iteration records, above the required 10.

## Next Focus

- Dimension: maintainability
- Focus area: the hub's documentation and playbook surfaces — `.skilled/skills/mcp-browser-use/{README.md,SKILL.md,ROUTER.md,description.json,graph-metadata.json}`, `changelog/v1.0.0.0.md` and `v1.1.0.0.md`, `manual-testing-playbook/` (7 hub-routing scenarios plus the root page), `benchmark/reports/` indexes, and the three modes' `README.md`/`ROUTER.md`/`changelog/` after the move.
- Reason: correctness, security and traceability are settled; the remaining risk is the cost of the next safe change — duplicated or contradictory prose across four hub documents, changelog shape, and playbook indexes that no longer match their scenario files.
- Rotation status: correctness, security and traceability complete; maintainability next in the configured order.
- Blocked/productive carry-forward: productive — diffing a fixture against its baseline to tell a label move from a behaviour change; reuse it for changelog and playbook-index consistency.
- Required evidence: exact counts (modes, scenarios, features) wherever a document states one, and the changelog entry that each version claim resolves to.
- Recovery note: not applicable.

Review verdict: CONDITIONAL
