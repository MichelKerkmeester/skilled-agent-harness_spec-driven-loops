---
title: "Iteration 5: Angle 5 — Playbooks and READMEs against the runtime"
trigger_phrases: []
---
# Iteration 5: Angle 5 — Playbooks and READMEs against the runtime

## Focus

Angle 5: every playbook command and flag exists; every README claim about scripts, contracts, hooks or counts matches the code, including the compiled-contracts README.

Dimensions: traceability (primary), maintainability (secondary).
Method: enumerated the seven in-scope playbook trees (289 markdown documents) and extracted every `node <script>` invocation as a parsed command snippet rather than a line, so that a line carrying several chained commands could not fuse one command's flags onto another's script. Each `(script, flag)` pair was then tested against the script file plus every `.cjs`/`.js`/`.mjs`/`.ts` file in that script's own directory, because several scripts are thin wrappers over a `lib/` sibling. Separately, every count and existence claim in the five in-scope READMEs was resolved against the tree, and the contract-drift checker was executed directly rather than inferred from file presence.

## Files Reviewed

- `.opencode/commands/deep/assets/compiled/README.md` (the compiled-contracts README this angle names) and `manifest.jsonl` (151 rows)
- `.opencode/commands/deep/assets/legacy/README.md` and its three fallback bodies
- `.opencode/skills/system-deep-loop/README.md`, `.opencode/skills/sk-code/README.md`, `.opencode/skills/cli-external-orchestration/README.md`
- `.opencode/skills/system-deep-loop/deep-review/manual-testing-playbook/**` (56 documents, 55 scenario docs)
- `.opencode/skills/system-deep-loop/{deep-research,deep-ai-council,deep-improvement}/manual-testing-playbook/**` and the hub playbook
- `.opencode/skills/sk-code/manual-testing-playbook/**`, `.opencode/skills/cli-external-orchestration/manual-testing-playbook/**`
- `.opencode/skills/system-deep-loop/runtime/scripts/{compile-command-contracts.cjs,render-command-contract.cjs,check-contract-drift.cjs,reduce-state.cjs}`
- `.opencode/commands/scripts/validate-command-references.cjs`

## Scorecard

- Dimensions covered: traceability, maintainability
- Files reviewed: 289 playbook documents; 17 distinct node-invoked scripts; 10 distinct `(script, flag)` pairs; 5 READMEs
- New findings: P0=0 P1=2 P2=1
- Refined findings: P0=0 P1=0 P2=0
- Drafted and withdrawn: 1 (the cli README conformance table; see Notes and Hand-Off)
- New findings ratio: 1.00

## Findings

### P0, Blocker

- None.

### P1, Required

**F018 — The compiled-contracts README's headline count is wrong, and the same error appears three times across the two deep-command asset READMEs.**
_Confidence: high. Each count verified by directory listing and by reading the compiler's registry; the document refutes itself._
`.opencode/commands/deep/assets/compiled/README.md:19` states the directory "stores the four flattened command contracts". It stores three: `deep-ai-council.contract.md`, `deep-research.contract.md`, `deep-review.contract.md`. Twenty-one lines later, `:23`, the same document says the inventory "is intentionally limited to the three commands registered with the contract compiler and renderer", and the directory's own tree block at `:29-36` lists exactly three contracts plus `manifest.jsonl` and `README.md`. `require()` on `compile-command-contracts.cjs` returns `COMMANDS` with exactly three keys. The legacy README repeats the error twice: `legacy/README.md:13` says "the four compiler-managed deep commands" and `:87` says "exactly these four body-to-contract pairings", where `:19` of that same file says the directory "stores three fallback command bodies" and the tree at `:29-35` lists three.
Impact: this is the README the review angle names by hand as the highest-value documentation-versus-code target, and the wrong number is the first sentence a reader meets. It is also self-refuting within the same file, so a reader who trusts `:19` and then counts three files has no way to tell which statement is authoritative.
Evidence: `compiled/README.md:19` vs `:23`; `legacy/README.md:13` and `:87` vs `:19`; `ls` of both directories; `Object.keys(require(...).COMMANDS)` → `[deep/ai-council, deep/review, deep/research]`.

**F019 — The deep-review playbook states that no automated test suite exists for `deep-review`, and attaches no test cross-reference, while 18 deep-review-named test files exist.**
_Confidence: high. Root cause traced; both sibling playbooks carry the section in the intended form._
`.opencode/skills/system-deep-loop/deep-review/manual-testing-playbook/manual-testing-playbook.md:610` reads "No dedicated automated test suite currently exists for `deep-review`." The section then anchors only to documentation paths and names no test file. Eighteen test files carry deep-review's name or its reducer contract: eleven under `.opencode/skills/system-deep-loop/runtime/tests/` (`deep-review-reducers.vitest.ts`, `deep-review-state-reducer.vitest.ts`, `deep-review-state-contract.vitest.ts`, `deep-review-deltas-contract.vitest.ts`, `deep-review-ledger-schema.vitest.ts`, `deep-review-projections-contract.vitest.ts`, `deep-review-sealed-artifacts.vitest.ts`, `deep-review-strategy-heading.vitest.ts`, `review-depth-validator.vitest.ts`, `review-depth-graph.vitest.ts`, `review-depth-convergence.vitest.ts`), one under `.opencode/skills/system-spec-kit/runtime/tests/deep-loop/review-depth-reducer.vitest.ts`, and six under `.opencode/skills/system-spec-kit/runtime/cli/tests/` (`deep-review-auto-restart-contract`, `deep-review-contract-parity`, `deep-review-reducer-schema`, `review-record-validation`, `review-reducer-fail-closed`, `review-research-paths`). The packet additionally ships its own runnable regression, `deep-review/scripts/tests/reduce-state-summary-fallback.test.cjs`, which the packet's own `scripts/tests/README.md` documents under a VALIDATION heading.
Impact: a false negative is worse than an omission here. The section does not merely fail to list the tests; it asserts there are none, so an operator reading it stops looking. The two sibling playbooks that do carry the section show the intended form — `deep-research`'s §15 names two `system-spec-kit` test files, and `deep-ai-council`'s §16 maps nine test files to scenario IDs — so this is a gap against an established sibling convention rather than a stylistic difference.
Evidence: `:610` plus the empty section body; the 18-file enumeration; execution of `reduce-state-summary-fallback.test.cjs` → `[deep-review] reduce-state summary fallback regression passed`, exit 0; `deep-research` §15 and `deep-ai-council` §16 for the sibling form.

### P2, Suggestion

**F020 — The legacy README's validation block reports the shared command-reference checker as clean while it currently fails with ten unresolved references.**
_Confidence: high on the fact (executed, exit 1), medium on the causal reading — see Notes._
`.opencode/commands/deep/assets/legacy/README.md:108` instructs the reader to run `node .opencode/commands/scripts/validate-command-references.cjs` with the expected result "the checker reports that command references resolve cleanly" (`:111`). Executed, the checker exits 1 and prints `FAIL  10 unresolved command reference(s)`, listing ten missing assets under `.opencode/skills/sk-design/`. None of the ten is in a deep-loop tree and none is this document's subject.
Impact: bounded. The README's own subject — the three deep-command bodies and their contracts — resolves cleanly inside that run, and the failures belong to the `design` command family, which is outside this review's scope. The defect is that the document's stated expected result is unconditional while the command's scope is repository-wide, so the instruction cannot pass for any reason connected to this README. The fix is to scope the check or to state the known-failing surface.
Evidence: `legacy/README.md:108` and `:111`; direct execution → exit 1, `FAIL  10 unresolved command reference(s)`, all ten under `.opencode/commands/design/assets/` against `.opencode/skills/sk-design/` paths.

<!-- A third candidate finding on the cli README's own-conformance table was drafted and withdrawn: see Notes. -->

## Ruled Out

- **The compiled contracts being stale (angle 5's contract clause, and iteration 4's F014 follow-through)**: ruled out by execution, not inference. `checkCommand()` on all three registered commands returns zero failures. The renderer refuses a stale contract by throwing in `fix` mode (`render-command-contract.cjs:67-75`), so the freshness path is live and currently satisfied. F014 concerns catalog *prose* citing a superseded compiled-routing generation; the deep-command contracts themselves are fresh.
- **Every playbook command and flag existing (angle 5's first property)**: ruled out clean. Ten distinct `(script, flag)` pairs across 289 playbook documents all resolve once the `lib/` sibling directory is included in the search — `--input-file` lives in `deep-ai-council/scripts/lib/persist-artifacts.cjs` rather than its 15-line wrapper, and `--lenient`, `--create-missing-anchors` and `--emit-resource-map` are all declared in `reduce-state.cjs:2227` and `:2259`. All 17 distinct node-invoked scripts exist. All 55 markdown links in the deep-review playbook index resolve. Zero of the 289 playbook documents invokes a nonexistent script.
- **The compiled README's tree block and manifest field table**: ruled out clean. Both directories' declared trees match their contents exactly, with nothing undeclared on disk and nothing declared but absent. The six manifest fields the README documents at `:88-95` (`command`, `mode`, `argsSha256`, `legacyBodySha256`, `compiledContractSha256`, `renderedSha256`) are exactly the six keys `buildManifestRow` emits. The README's §7 validation command was executed verbatim → `OK 151 manifest rows`.
- **The compiled README's compiler entrypoint**: ruled out clean. The path named at `:67` exists (31,863 bytes) and is the same path the generated contract headers carry in `generatedBy`.
- **The deep-review playbook's own counts**: ruled out clean, and worth recording because it looks like F016's defect class and is not. `:31` claims 55 scenarios across 10 categories; the tree holds exactly 55 scenario documents across exactly 10 category directories, `CP-052..057` are 6, `DRV-058..063` are 6, `DRV-064..067` are 4, and all 55 resolve as links. There are zero duplicate scenario IDs. The count is correct; only the test-suite claim beside it is wrong.
- **The cli README's own-conformance table (`:124-125`) states an expected validator exit of zero**: ruled out by execution, and drafted as a finding then withdrawn. `parent-skill-check.cjs .opencode/skills/cli-external-orchestration` exits 0 with `OK: parent-skill-check — all hard invariants passed, 0 warnings`, so the README's claim is true. The tempting adjacent observation — that this hub passes its gate while F007 and F008 leave its roster broken — is a gate-coverage question belonging to angle 15 (hooks and gates against their docs), not to this angle, and it is recorded as a hand-off note below rather than filed here. Both other in-scope hubs also exit 0.
- **The three hub READMEs' path references**: ruled out clean. The hub README's 8 file references and 5 directory references all resolve; `sk-code`'s three `workflow-*.md` references and `cli-external-orchestration`'s `references/providers-and-models.md` reference are per-mode-relative and resolve under their own packet (all seven cli modes carry `SKILL.md`, `README.md`, `references/providers-and-models.md` and the four expected directories).
- **READMEs contradicting the mode roster by count**: ruled out for the hub README. It contains no mode-count phrase; its `:33` "five separate sibling skills" is accurate history and `:62`'s "three improvement lanes" is already filed as F002.

## Dead Ends

- **Line-based `(script, flag)` extraction.** A playbook line such as the `deep-improvement` verification block in `runtime-truth/journal-wiring.md:46` carries a dozen chained `node ... --flag` invocations in one table cell. Matching per line produced 34 phantom "missing flag" reports. Parsing the command snippet — `node <script>` plus its own argument run, terminated by a shell metacharacter — reduced them to 10 real pairs, all clean. This is the third iteration in a row in which a text-extraction shortcut manufactured a false-positive population; the pattern is now well established and should be assumed before any path or flag claim in angle 5's remainder.
- **Judging a flag missing because the wrapper file lacks it.** `persist-artifacts.cjs` is 15 lines and delegates to `lib/persist-artifacts.cjs`, which declares `--input-file` at `:968`. Searching the wrapper alone produced a false finding.
- **Treating the manifest's digests as a freshness signal.** The manifest's newest rows do not match the live legacy bodies or contracts, which reads as staleness and is not: `render-command-contract.cjs` opens it append-only (`:128`), so it is a render-evidence log, and the README says exactly that at `:97`. Freshness is `checkCommand`'s job and that check passes.

## Notes — Two Bounds I Am Not Claiming

- **F019's severity rests on the assertion, not the omission.** If `:610` had simply been absent, this would be a coverage note. Because it asserts nonexistence, it actively terminates the search, which is what lifts it to P1.
- **F020 traces to a check whose scope is wider than the document that cites it.** I am not claiming the `design` command family is broken — that tree is out of this review's scope and those ten paths were not diagnosed — only that this README presents a repository-wide check as if it were a local acceptance test with a guaranteed pass.
- **A drafted third finding was withdrawn after its own verification.** I was ready to file the cli README's conformance table (`:124-125`) as a false claim, on the reasoning that a hub with a P0 roster omission should not pass its own gate. Running the gate showed the claim is true: exit 0, 0 failures, 0 warnings. The finding was wrong, and the interesting fact it pointed at — the gate validates the registry/hub-router/manifest triangle but not `ROUTER.md`'s roster prose, which is exactly why F007 is invisible to it — is a gate-coverage question for angle 15, not a documentation defect.

## Hand-Off Note for Wave Two

- **Angle 15 (hooks and gates against their docs) has a concrete first target.** `parent-skill-check.cjs` passes all three in-scope hubs, and its `10c`/`10d` checks do reconcile the manifest against the registry. It does not read `ROUTER.md`'s roster statements at all, so a hub whose surface document omits a registered mode (`cli-external-orchestration`, F007) and a hub that misstates its own mode count in `SKILL.md` (`system-deep-loop`, F002; `cli-external-orchestration`, F008) both clear it. This lane did not investigate the gate's contract and is not asserting it is defective; it is naming the gap with the evidence attached so the wave-two lane does not have to rediscover it.

## Recommended Next Focus

Wave one is complete for this lane: angles 1 to 5 each ran one iteration, all five landed confirmed defects, and the lane has filed 1 P0, 12 P1 and 7 P2, with nothing resolved and one drafted finding withdrawn after its own verification. Synthesis should carry forward (a) the two wave-two seeds this lane has now earned — repo-rule restraint for the catalog and README prose that restates counts it can derive, and dead-code/duplication scanning after the worktree removal, which iteration 4's layout-generation drift (F014) suggests is a live surface; (b) the ranked P0/P1 list with F007 as the sole blocker; and (c) the resolution discipline, now confirmed three times, that any text-extraction check must be validated against a hand-read sample before its misses are filed.

---
Session: fanout-wave1-deepseek-1789465945073-px9i6h | Mode: review | Run: 5 | Findings: P0=0 P1=2 P2=1 | Drafted-and-withdrawn: 1

Review verdict: FAIL
