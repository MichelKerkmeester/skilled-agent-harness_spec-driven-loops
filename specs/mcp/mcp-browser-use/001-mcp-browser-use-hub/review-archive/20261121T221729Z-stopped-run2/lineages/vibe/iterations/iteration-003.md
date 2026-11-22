# Review Iteration 003

## Dispatcher

- Mode: `review`
- Target agent: `deep-review`
- Resolved route: `Resolved route: mode=review target_agent=deep-review`
- Run: `fanout-vibe-1795298930568-k8qdqy`, generation 1, lineage mode `new`
- Review target: `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub` (spec-folder)
- Dimension: `traceability`
- Operator review focus: the 8 commits `main..HEAD` that build the browser-use
  parent hub. This iteration addressed the focus by checking the goal's seven
  completion criteria against the shipped tree — the hub scaffold, the mode move,
  the Bladebro mode, advisor routing at both stages and the end-to-end
  verification — and by re-running both routing stages live. Pure renames of
  moved spec packets were not reviewed.

## Files Reviewed

- `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/goal.md`
- `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/spec.md`
- `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/006-verification/implementation-summary.md`
- `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/006-verification/tasks.md`
- `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/005-routing-and-surfaces/implementation-summary.md`
- `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/002-hub-scaffold/implementation-summary.md`
- `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/001-research/implementation-summary.md`
- `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/001-research/research/deep-research-state.jsonl`
- `.skilled/skills/mcp-browser-use/mode-registry.json`
- `.skilled/skills/mcp-tooling/mode-registry.json`
- `.skilled/skills/mcp-tooling/graph-metadata.json`
- `.skilled/skills/mcp-tooling/ROUTER.md`
- `.skilled/skills/mcp-browser-use/benchmark/reports/compiled-routing/2026-11-21--two-stage-replay--compiled/README.md`
- `.skilled/skills/mcp-browser-use/mcp-bladebro/benchmark/reports/2026-11-21--manual-testing-playbook--macos-live/README.md`
- `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py`
- `.skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs`

## Findings - New

### P0 Findings

None.

### P1 Findings

None new. Three P1 findings remain active from earlier iterations and are carried
forward unchanged: `R1-P1-001` (the router's `forbidden` substring reject),
`R1-P1-002` (recorded benchmark hashes that the shipped tree no longer produces)
and `R2-P1-001` (the unpinned `npx` Bladebro fallback). This iteration sharpens
the traceability consequence of `R1-P1-002` as finding 3 below rather than
raising a fourth P1 for the same root cause.

### P2 Findings

1. **The goal's own evidence-location claim is unmet for three of six children, including the verification phase** -- `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/goal.md:99` -- the Progress table states the evidence for the packet-validation row as "validate.sh run recorded in each child's implementation-summary.md". Counting `validate.sh` mentions per child summary gives 1 for `001-research` (line 124), 1 for `002-hub-scaffold` (line 110), 1 for `005-routing-and-surfaces` (line 148), and 0 for `003-mode-relocation`, `004-bladebro-mode` and `006-verification`. Those three record the run only in their `tasks.md` (`004-bladebro-mode/tasks.md:64`, `006-verification/tasks.md:65`), so the stated location does not hold the evidence for half the children, and `006-verification` is the phase that closes the program.
   Finding class: traceability
   Scope proof: `goal.md` and the six child summaries are inside the review target `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub`.
   Affected surface hints: `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/006-verification/implementation-summary.md`, `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/004-bladebro-mode/implementation-summary.md`
   Case: an operator reads `006-verification/implementation-summary.md` looking for the packet-validation evidence the goal points at, and finds no `validate.sh` record there.

2. **Completion criterion 6 is checked without recording the live run's FAIL verdict** -- `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/goal.md:97` -- the criterion reads "Each of the three modes has a manual testing playbook with a recorded run, a live Bladebro run on macOS included" and is checked `[x]`. The recorded Bladebro run's own verdict is `FAIL` with a tally of "12 PASS, 1 FAIL, 1 SKIP" (`mcp-bladebro/benchmark/reports/2026-11-21--manual-testing-playbook--macos-live/README.md:9`), where BB-012 `real-mode-reads` failed with `Chrome launch failed: no page target available` and BB-014 `uninstall-and-data-root` was skipped pending operator approval. The criterion is met literally, because a run was recorded, but the checkbox carries no verdict and no pointer, so a reader of `goal.md` alone cannot tell that the live run failed one step and left the install in place.
   Finding class: traceability
   Scope proof: `goal.md` is the review target's own completion surface.
   Affected surface hints: `.skilled/skills/mcp-browser-use/mcp-bladebro/benchmark/reports/2026-11-21--manual-testing-playbook--macos-live/README.md:9`, `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/006-verification/implementation-summary.md:119`
   Case: an operator reads the checked criterion and concludes the live Bladebro run passed, when the recorded run failed its real-browser step and still has Bladebro installed.

3. **The recorded evidence for criterion 5 is stamped with a superseded policy, so the two-stage PASS cannot be tied to the shipped policy** -- `.skilled/skills/mcp-browser-use/benchmark/reports/compiled-routing/2026-11-21--two-stage-replay--compiled/README.md:24` -- the report's run table records "Serving authority | compiled, policy hash `dd69936393b40a51080dac4772d42a8e317e8fe099514d4db846716027000698`, generation 1" and its headline is "Verdict: PASS, 6 of 6". Re-running both stages now returns the same six routing outcomes but stamps them with `8793753ed346c97459a24027dab28aeea9a1fa20da10c1d39f3e70475e14717a`, the hash the activation manifest selects. The routing outcomes still hold; the recorded provenance does not, so the report cannot be cited as evidence that the shipped policy passes. This refines `R1-P1-002` for the criterion-5 evidence chain rather than raising a new root cause.
   Finding class: traceability
   Scope proof: the report is in the pre-bound review scope and was added by the verification commit `c7f38f295d2`.
   Affected surface hints: `.skilled/bin/lib/compiled-routing/013-live-activation/activation/mcp-browser-use/manifest.json:1`
   Case: an auditor compares the report's policy hash with the manifest's and cannot confirm that the six passing scenarios ran against the policy that ships.

## Traceability Checks

| Protocol | Status | Evidence |
|----------|--------|----------|
| `spec_code` | pass | All seven `goal.md` criteria were checked against the tree. Criteria 1-5 hold on re-execution: 12 research iteration records and `research.md` exist; the hub lists 3 modes and `mcp-tooling` lists 6; the two `rg` sweeps print no match; `ci-skill-root-metadata.cjs --skill mcp-browser-use` prints `OK [H] mcp-browser-use` with `checked=1 passed=1 failed=0` and exits 0; both routing stages return the expected mode for all three modes. Criterion 6 holds literally with the caveat in finding 2. Criterion 7's evidence is recorded in `006-verification/tasks.md:65` and `005-routing-and-surfaces/implementation-summary.md:148`; this review did not re-run `validate.sh` because the dispatch forbids it, so the protocol is raised to `pass` on recorded evidence plus the five criteria re-executed here, not on a fresh validation run. |
| `checklist_evidence` | partial | Criteria 1-5 are re-executed and hold. Criterion 6's checkbox does not carry its run's verdict (finding 2), and criterion 7's stated evidence location is unmet for three children (finding 1). |
| `playbook_capability` | pass | All three modes carry a `manual-testing-playbook/` with scenario files and a `benchmark/reports/` run: `mcp-chrome-devtools` (5 scenarios, `2026-11-21--manual-testing-playbook--hub-path-live`), `mcp-aside-devtools` (17 scenarios, `--app-running-rerun` and `--hub-path-live`), `mcp-bladebro` (14 scenarios, `--macos-live`). The hub itself carries 7 routing scenarios. Each scenario's preconditions name a command the packet's own references document. |

## Integration Evidence

- Stage one, live: `skill_advisor.py "debug this page with chrome devtools and take a screenshot"` returns `mcp-browser-use` at confidence 0.95 with `passes_threshold: true`; `skill_advisor.py "use bladebro to attach to my open browser and finish the checkout flow"` returns `mcp-browser-use` at 0.9292 with `passes_threshold: true`.
- Stage two, live: `compiled-route.cjs --hub mcp-browser-use` returns `action=route kind=single` targeting `mcp-chrome-devtools`, `mcp-bladebro` and `mcp-aside-devtools` for the three mode prompts, each stamped `effectivePolicyHash 8793753e`.
- Criterion 4, live: `node .skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs --skill mcp-browser-use` prints `OK   [H] mcp-browser-use` then `checked=1 passed=1 failed=0 fixed=0`, exit 0, naming the hub as its subject.
- Criterion 3, live: `rg "mcp-tooling/mcp-chrome-devtools|mcp-tooling/mcp-aside-devtools" .skilled` excluding `changelog` and `benchmark/reports` prints nothing; the same pattern over `.skilled/skills/mcp-tooling/{mode-registry.json,hub-router.json,leaf-manifest.json,SKILL.md,README.md}` prints nothing; `mcp-tooling/graph-metadata.json` and `mcp-tooling/ROUTER.md` also carry no match.
- Criterion 2, live: `mcp-browser-use/mode-registry.json` lists `mcp-chrome-devtools`, `mcp-aside-devtools`, `mcp-bladebro`; `mcp-tooling/mode-registry.json` lists `mcp-click-up`, `mcp-figma`, `mcp-refero`, `mcp-mobbin`, `mcp-obsidian`, `mcp-notion`.
- Criterion 1, live: `001-research/research/deep-research-state.jsonl` holds 31 rows of which 12 are `type: "iteration"`, and `001-research/research/research.md` exists at 32,719 bytes.

## Edge Cases

- **Criterion 7 not re-executed.** The dispatch forbids running `validate.sh`, so criterion 7 is assessed from recorded evidence only. That is a deliberate limit of this review, not a pass by omission; the protocol is raised to `pass` on the recorded transcripts plus the five criteria that were re-executed.
- **Criterion 6 is met literally.** The criterion asks for a recorded run, not a passing one, so the checkbox is defensible. The finding is about the missing verdict, not about the run being absent.
- **`rg -r` misuse caught.** An early sweep used `rg -rn`, which treats `n` as a replacement string and rewrote every match in the output. The sweep was re-run without `-r` before any conclusion was drawn.
- **Moved-packet renames.** The operator focus excludes pure renames, so the `specs/mcp/*` packet moves were not reviewed as content; only the edited and added files were.

## Confirmed-Clean Surfaces

- `mcp-tooling/graph-metadata.json` and `mcp-tooling/ROUTER.md` carry no reference to either moved mode, so the relocation left no dangling metadata.
- `mcp-tooling/mode-registry.json` lists exactly the six non-browser modes, matching D3.
- All three modes carry both a playbook and a recorded run, so criterion 6's structural half holds.
- `006-verification/implementation-summary.md:119` records the Bladebro tally honestly as "12 PASS, 1 FAIL (step 13 in `clone` mode), 1 SKIP (uninstall, declined)", and Known Limitation 1 states "Clone mode does not drive Aside ... Attach mode works instead."
- `006-verification/implementation-summary.md:121-123` records the Chrome DevTools and Aside tallies with their failures rather than rounding them up.

## Ruled Out

- **A dangling `mcp-tooling` browser reference.** Both `rg` sweeps and the two extra metadata files print no match. (iteration 3)
- **A wrong mode count in either registry.** The hub lists 3 and `mcp-tooling` lists 6, matching D3 and criterion 2. (iteration 3)
- **A broken advisor edge after the move.** Stage one returns `mcp-browser-use` above threshold for both a DevTools and a Bladebro prompt. (iteration 3)
- **A broken compiled front door after the move.** Stage two returns the expected mode for all three mode prompts at the shipped hash. (iteration 3)
- **A missing research phase.** 12 iteration records and a 32 KB `research.md` satisfy criterion 1. (iteration 3)
- **A parent-skill checker failure.** The checker exits 0 and names the hub. (iteration 3)

## Next Focus

- Dimension: maintainability
- Focus area: the hub's `SKILL.md`, `ROUTER.md`, `README.md` and `graph-metadata.json` for pattern compliance against the `mcp-tooling` template; the three mode packets' `ROUTER.md` and `description.json`; and the `benchmark/reports/README.md` indexes
- Reason: traceability is complete; maintainability is the last canonical dimension and the hub's documentation set is the largest unreviewed surface in scope
- Rotation status: first pass on maintainability
- Blocked/productive carry-forward: re-executing both routing stages was productive for traceability; do not re-derive the stale-hash root cause, which is already `R1-P1-002`
- Required evidence: file:line for every pattern deviation and every documentation gap

Review verdict: CONDITIONAL
