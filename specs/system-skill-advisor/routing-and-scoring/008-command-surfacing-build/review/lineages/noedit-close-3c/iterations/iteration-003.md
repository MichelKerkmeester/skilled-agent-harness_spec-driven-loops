# Review Iteration 003

## Dispatcher

- Run: `fanout-noedit-close-3c-1794596804847-827gze` (lineage `noedit-close-3c`, pass three closing round, area `noedit`)
- Mode: review; executor: this process (in-process, no nested dispatch)
- Dimension: traceability + maintainability
- Review focus addressed: the dispatch orders the no-edit gate first and deepest, the hook check once, and this closing iteration ties both to the packet's own claims and to the comments that explain them. The two settled decisions are again out of scope: neither is re-reported, and the carried P1 is re-checked for contradicting evidence rather than re-argued.
- Budget profile: `adjudicate` (8-10 calls), used 9.

## Files Reviewed

- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:287-298` (re-read at `:292` and `:296-298` for the carried P1)
- `.skilled/skills/system-skill-advisor/feature-catalog/scorer-fusion/command-meaning-matching.md:36` (doc claim about `NO_EDIT_REQUEST` and the two gates)
- `.skilled/skills/system-skill-advisor/feature-catalog/cli-surface/advisor-recommend.md:33` (doc claim about the attached `command` field)
- `.skilled/skills/system-skill-advisor/runtime/lib/README.md:132` and `runtime/lib/scorer/README.md:55` (module-row claims)
- `.skilled/skills/sk-doc/mode-registry.json:317-336` (the `sk-create-changelog` mode: `mutatesWorkspace: true`, alias "changelog")
- `.skilled/commands/doctor/assets/doctor-setup.yaml:61` and `.skilled/commands/doctor/assets/doctor-symlink-check.yaml:60` (the delivery rows that print the hook check's verdict and exit codes)
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/014-review-remediation/acceptance-criteria.md:60` (AC-005, the no-edit acceptance row) and `014-review-remediation/implementation-summary.md:150-166` (the phase's known-limitations list)
- `.skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts:67-85` (the comments above the two no-edit blocks)
- `.skilled/commands/doctor/scripts/tests/hook-wiring-check.test.cjs:225-267` (the positive and negative launch loops)
- Executed: `node .skilled/commands/doctor/scripts/hook-wiring-check.cjs --root .` → `ok claude`, `ok codex`, `ok cursor`, `ok devin`, exit 0; `tsx probes/probe-noedit-3.mjs` re-run → the P1 result is unchanged; `sed -n '292p'` → the pattern is unchanged.

## Findings - New

### P0 Findings

None.

### P1 Findings

None new. The carried `NC3-P1-001` was re-read and re-run; see the adjudication recheck below.

### P2 Findings

None new.

## Carried P1 Recheck (adversarial pass)

| Question | Evidence | Result |
|---|---|---|
| Is the pattern still the final one? | `command-attach.ts:292` printed verbatim, unchanged from iteration 1 | Confirmed |
| Is the miss still reachable? | `tsx probes/probe-noedit-3.mjs` re-run: `noEdit` false, `attached` `/create:changelog` for `use sk-doc to plan the changelog, don't create it yet` | Confirmed |
| Is the route plausible? | `mode-registry.json:317-336` names `workflowMode: sk-create-changelog`, `mutatesWorkspace: true`, alias `changelog`; `advisor-recommend.md:33` says a single-route compiled recommendation sets the `command` field | Confirmed |
| Can it be dismissed as the settled scope-limit cost? | The settled decision names the phrase "make no changes"; this prompt says "don't create it yet" and the covered control (`don't change anything yet`) is matched | No |
| Counterevidence found this iteration? | The docs describe the matcher as a shared gate, not as a fixed vocabulary; the packet's own phase-014 limitation list does not mention the verb list; no test pins the four-verb limit | None |

`NC3-P1-001` stays active at P1. `NC3-P2-002` was re-read at `:292` and stays active at P2 (the "just show"/"just list" alternatives remain unanchored).

## Traceability Checks

- `spec_code` — pass for the reviewed claims, with the two findings standing as the gap. `runtime/lib/README.md:132` ("a prompt that matches `NO_EDIT_REQUEST` gets no command"), `scorer/README.md:55` ("`commandMeaningEligible` decides who may pass on meaning … a prompt matching `NO_EDIT_REQUEST` … rules out every command") and `feature-catalog/scorer-fusion/command-meaning-matching.md:36` all describe the code as it stands. `feature-catalog/cli-surface/advisor-recommend.md:33` matches the `attachCommand` shape checks at `command-attach.ts:323-338`.
- `checklist_evidence` — partial. `014-review-remediation/acceptance-criteria.md:60` (AC-005) claims the no-edit prompt attaches nothing and that `fusion.ts` reads the same pattern; both hold (`fusion.ts:20` imports `isNoEditRequest`; `fusion.ts:677` and `:881` call it). The two pass-three commits are post-acceptance remediation and have no packet checklist row of their own, so no further row is claimed.
- `feature_catalog_code` — pass. The feature-catalog sentence names the same four markers the pattern carries ("no edits", "do not change", "just show", "just list") and the same two gates; nothing in it was superseded by commit `846eab66b8`.
- `agent_cross_runtime` — partial. `doctor-setup.yaml:61` and `doctor-symlink-check.yaml:60` describe the check's exit 0/1/2 roles exactly as `hook-wiring-check.cjs:15-16` and `main` implement them; the four modelled settings files in this checkout all print `ok` (run above). The finding `NC3-P2-003` shows one valid node launch inside that model still reports exit 1.
- `skill_agent` — notApplicable: neither reviewed module is an agent or command document.
- `playbook_capability` — notApplicable: no playbook surface is in scope.

## Integration Evidence

- `.skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:474` is the production caller of `attachCommand`; `advisor-recommend.md:33` documents the same field, so the finding's reach is the documented public surface, not an internal branch.
- `.skilled/commands/doctor/assets/doctor-setup.yaml:61` is the delivery leg that reads the hook check's exit code; a false `hook-missing` there becomes a DEGRADED install verdict, which is the operator-visible cost named in `NC3-P2-003`.
- No packet doc was edited; this iteration wrote only its own iteration file and state.

## Edge Cases

- `014-review-remediation/implementation-summary.md:152-161` ("Known Limitations") is a dated phase-014 snapshot: item 1 says the matcher misreads `true; node <script>` and `node --no-warnings <script>`, and item 4 says `scorer/text.ts` keeps its own pattern. Both were true at phase 014 and are false in the final state (the separator and env cases print `ok` in the suite and the probe, and `text.ts:5` imports the shared matcher). The same section's item 5 ("Review pass two has not run") dates the list, so it is recorded here as historical context, not reported as a live doc defect.
- The `just show` P2 was checked against `command-meaning-matching.md:36`, which lists "just show" as a marker that rules out every command. The doc describes the intent, not the two-step "show then change" input, so the finding is a reach gap in the marker rather than a doc contradiction.
- The settled "make no changes" phrase was not re-tested for the third time; its control row passed in iteration 1 and no code changed since.

## Confirmed-Clean Surfaces

- Every comment on the changed lines matches the code: `command-attach.ts:287-292` (both readings of "make no changes" fold to no-change), `:294-295` (apostrophe fold), `hook-wiring-check.cjs:220` (the flag set's role), `:229-230` (the flag name is read before the value), `:282-283` (`bash -c` and its login forms), and `:299-300` (node must stand where a command starts).
- The test comments match the assertions: `command-attach-guards.vitest.ts:28-35`, `:67-68`, `:77-79` and `:106-130` each explain the row they precede, and every row has a reachable failing mode.
- No third copy of the no-edit wording remains: `NO_EDIT_REQUEST` is declared once (`command-attach.ts:292`) and every gate imports `isNoEditRequest`.
- No doc still describes the reverted negative lookahead; the only "make no changes to" text left is the new pinned test rows and the explanatory comment.
- The two test files pin both the accepted cost and the fixed behavior, so a later widening of the pattern fails a test rather than silently changing the offer.

## Ruled Out

- **A doc claim that the verb list is complete.** Neither README, the feature catalog, nor the pinning test claims which verbs are covered; the list is presented as the matcher, not as a closed vocabulary.
- **A stale reference to the third pattern copy.** `runtime/lib/README.md:132`, `scorer/README.md:55`, `feature-catalog/.../command-meaning-matching.md:36` and `runtime/tests/README.md:157` all describe the shared gate as it is.
- **A crossed exit-code contract in the doctor delivery rows.** `doctor-setup.yaml:61` (exit 2 = ERROR) and `doctor-symlink-check.yaml:60` (exit 2 = FAIL) match `main`'s `process.exit(2)` on a bad argument or missing root.
- **An unstated runtime row in the hook check.** The four rows match the four settings files present in this checkout, and all four print `ok`; no fifth file claims coverage.
- **A maintainability defect in the new comments.** Each changed comment explains why, not what, and none embeds a spec or finding id.

## Next Focus

- Dimension: synthesis
- Focus area: compile the report from the registry, the three iteration files and the strategy; derive the verdict from the active findings; run the closeout through the gateway
- Reason: all four dimensions are covered; correctness produced one P1 and two P2 advisories
- Rotation status: D1, D3, D4 covered; D2 security has no security-shaped surface in either changed file (both are local, non-networked, input-only classifiers), recorded as reviewed-not-applicable rather than skipped
- Blocked/productive carry-forward: none blocked; the parent fan-out merge is the runner's, not this lineage's
- Required evidence: the findings registry totals, the three iteration verdicts, and the terminal closeout record
- Recovery note: the `Review verdict` line stays CONDITIONAL while `NC3-P1-001` is active

Review verdict: CONDITIONAL
