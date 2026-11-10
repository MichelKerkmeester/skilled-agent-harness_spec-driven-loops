# Iteration 10: Floors and proof

## Focus

Angle 10 examines which quality-mode behaviors the recommendations must preserve and what evidence would prove a later change remains reachable. The strategy lists the last unchecked question as the floor-and-routing proof question. [SOURCE: specs/sk-code/014-code-modes-research/001-quality-mode-research/research/deep-research-strategy.md:42] `Which behaviors may no recommendation relax, and how would a later change to sk-code-quality be proven through both routing stages?`

## Actions Taken

1. Read the run config, state log, strategy, and prior iteration narratives before selecting the final angle.
2. Inspected quality-mode `4, the three scripts/*.test.sh fixtures, the quality entry in hub-router.json, the ROUTER.md intent map, and the hub-routing rule plus its referenced replay commands.
3. Used local repository sources only. No tests, benchmarks, network access, or implementation changes were made.

## Findings

1. **OBSERVED:** The packet explicitly protects the P0 floor, the quality mode’s lack of Write and Task authority, and the advisory-only status of CODE_QUALITY_RESULT. [SOURCE: specs/sk-code/014-code-modes-research/001-quality-mode-research/research/deep-research-strategy.md:51] `- Relaxing the P0 floor, the missing Write and Task authority, or the advisory-only status of the CODE_QUALITY_RESULT envelope.` The mode contract makes P0 completion-blocking [SOURCE: .skilled/skills/sk-code/sk-code-quality/SKILL.md:193] `Blocks completion until fixed or escalated.`, forbids file creation and subagent dispatch [SOURCE: .skilled/skills/sk-code/sk-code-quality/SKILL.md:242] `Never create new files; this mode has no Write authority.` [SOURCE: .skilled/skills/sk-code/sk-code-quality/SKILL.md:243] `Never dispatch subagents; this mode has no Task authority.`, forbids completion claims [SOURCE: .skilled/skills/sk-code/sk-code-quality/SKILL.md:244] `Never make completion, done, works, or passing claims`, and keeps the result envelope advisory [SOURCE: .skilled/skills/sk-code/sk-code-quality/SKILL.md:223] `status is fixed to advisory and MUST NOT be pass, success, or done.` P1 acceptance remains explicit and documented, while P2 may be deferred with a stated safety reason [SOURCE: .skilled/skills/sk-code/sk-code-quality/SKILL.md:194] `unless the user accepts a documented risk.` [SOURCE: .skilled/skills/sk-code/sk-code-quality/SKILL.md:195] `document the deferral and why it is safe.`

2. **OBSERVED:** The existing script tests use focused fixtures for checker behavior: comment hygiene rejects temporary labels and accepts allowed standards or ordinary comments [SOURCE: .skilled/skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.test.sh:39] `run_case 1 "rc_ref" "js" "// RC-2 x"` [SOURCE: .skilled/skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.test.sh:50] `run_case 0 "cwe_allowed" "js" "// CWE-79"`; typo-flag cases exercise invalid options [SOURCE: .skilled/skills/sk-code/sk-code-quality/scripts/typo-flags.test.sh:71] `run_case "check-dist-staleness.sh rejects a misspelled --bogus-xyz flag"`; and ceiling-report fixtures distinguish measurable markers from no-trigger/no-signal cases and invalid inputs [SOURCE: .skilled/skills/sk-code/sk-code-quality/scripts/ceiling-report.test.sh:82] `run_case "measurable" "js"` [SOURCE: .skilled/skills/sk-code/sk-code-quality/scripts/ceiling-report.test.sh:88] `expect_exit 2 "missing_path"`. These tests can protect the specific checker behavior a future change touches; route reachability needs its own replay.

3. **DERIVED:** A routing change needs evidence at the advisor-to-hub boundary and inside the hub. The routing rule assigns the first boundary to the advisor reading graph-metadata and the second to hub-router.json plus root ROUTER.md [SOURCE: .skilled/repo-rules/skill-hub-routing.md:58] `One | the advisor, reading the hub's graph-metadata.json | the hub |` [SOURCE: .skilled/repo-rules/skill-hub-routing.md:59] `Two | the hub's hub-router.json and root ROUTER.md | the mode, then its leaves |`. The hub documents hub-router.json as mode selection and ROUTER.md as leaf selection [SOURCE: .skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md:132] `hub-router.json selects a workflow mode. The root ROUTER.md then owns stage-two leaf selection`; the live quality signal declares quality classes and the quality skill resource [SOURCE: .skilled/skills/sk-code/hub-router.json:21] `"sk-code-quality": {` [SOURCE: .skilled/skills/sk-code/hub-router.json:24] `"resources": ["sk-code-quality/SKILL.md"]`, while ROUTER.md maps intent to packet-local leaf resources [SOURCE: .skilled/skills/sk-code/ROUTER.md:3] `this doc maps a request's code intent to the exact packet-local leaf resources`. For a future change, run the per-hub checker with .skilled/skills/sk-code, then send the same real quality request through skill_advisor.py and compiled-route.cjs; confirm the advisor surfaces sk-code and the compiled route selects sk-code-quality with the intended leaf resources. A green presence check alone is insufficient [SOURCE: .skilled/repo-rules/skill-hub-routing.md:76] `A green gate is not integration.` The documented replay commands and explicit hub argument are [SOURCE: .skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md:245] `parent-skill-check.cjs .skilled/skills/<hub>` [SOURCE: .skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md:255] `compiled-route.cjs --hub <hub> --prompt` [SOURCE: .skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md:256] `skill_advisor.py "<same request>" --threshold 0.5`.

## Questions Answered

Which behaviors may no recommendation relax, and how would a later change to sk-code-quality be proven through both routing stages?

## Questions Remaining

None for the strategy's five key questions.

## Next Focus

No further research angle remains in this ten-iteration run. Implementation and verification of any recommendation are separate work. [SOURCE: specs/sk-code/014-code-modes-research/001-quality-mode-research/research/deep-research-strategy.md:58] `Exactly ten iterations, one plan angle each`

## Sources Consulted

- specs/sk-code/014-code-modes-research/001-quality-mode-research/research/deep-research-config.json
- specs/sk-code/014-code-modes-research/001-quality-mode-research/research/deep-research-state.jsonl
- specs/sk-code/014-code-modes-research/001-quality-mode-research/research/deep-research-strategy.md
- .skilled/skills/sk-code/sk-code-quality/SKILL.md
- .skilled/skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.test.sh
- .skilled/skills/sk-code/sk-code-quality/scripts/typo-flags.test.sh
- .skilled/skills/sk-code/sk-code-quality/scripts/ceiling-report.test.sh
- .skilled/repo-rules/skill-hub-routing.md
- .skilled/skills/sk-code/hub-router.json
- .skilled/skills/sk-code/ROUTER.md
- .skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md
