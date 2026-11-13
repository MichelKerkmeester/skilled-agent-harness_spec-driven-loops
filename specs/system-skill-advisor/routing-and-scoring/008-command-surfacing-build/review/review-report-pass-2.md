# Review Report: Command Surfacing Build, Pass Two (merged fan-out)

- Review target: `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build` (spec-folder)
- Pass: the second review pass. It ran after the pass-one fixes in phase 014 (`b3b5ae8314`) and phase 015 (`3b48f0e5f1`). Pass one's report is kept as `review/review-report-pass-1.md`. Its merged registry is `review/deep-review-findings-registry-pass-1.json` and its attribution is `review/fanout-attribution-pass-1.md`.
- Run: fan-out `1794570021136-noekp0` with four lineages (`scorer-attach-2`, `render-hooks-plugin-2`, `accuracy-runner-2` and `doctor-install-2`). Each had a cap of seven iterations and the 0.10 threshold. Executor `cli-opencode` `opencode-go/deepseek-v4.1-flash` at reasoning effort max, concurrency 4.
- Reviewed range: commits `35c3188681..087888ec4a` (42 commits). `review/review-scope-2.txt` lists 218 paths. 84 of them changed since pass one.
- Inputs to this synthesis: `review/deep-review-findings-registry.json` (pass two only, 27 open findings and 1 resolved), the four `-2` lineage folders under `review/lineages/` and a fresh re-read of every cited file and line.
- Root config: `review/deep-review-config.json` stays at `initialized`. Section 9 says why.

---

## 1. Executive Summary

- **Verdict: PASS** after adversarial verification. The merged registry says PASS with no P0 and no P1. Every finding was re-read. The safety-shaped ones were probed.
- **hasAdvisories: true**
- **Active counts after verification:** P0 0, P1 0, P2 27. One more finding was withdrawn by its own lineage. This synthesis agrees and lists it as REFUTED.
- **Verdict breakdown of the 27:** 19 CONFIRMED and 8 CONFIRMED-ADJUSTED. No severity changes.
- **Origin:** 7 predate the packet. 12 came from the packet before pass one. 8 came from the pass-one fixes: 6 from phase 014 and 2 from phase 015.
- **Pass-one fixes:** 44 fixable pass-one items were rechecked. 43 hold. One (`iter3-P2-phase007-open-evidence`) is half fixed and is carried again. `R4-P2-003` is left out because the operator approved it for phase 016.
- **Mutating-command safety:** no finding lets a writing command start without its asking step. The closest is SA2-P2-002. Four no-edit wordings still attach `/create:skill` with policy `start`. It stays P2 for the reason pass one gave: `start` asks before it writes and `AGENTS.md:68` lets an explicit instruction outrank the policy.
- **Merge deviation:** the merge script reads every lineage folder. Run as written it mixes pass one's four lineages into this verdict and reports CONDITIONAL on two P1 findings that phase 014 fixed. The installed registry is a pass-two-only merge. Section 9 has both runs.
- **Convergence:** pass two converged. Three lineages stopped by rule below 0.10. `accuracy-runner-2` reached its seven-iteration cap after two iterations at 0.00. Severity converged across the two passes as well. No P0 or P1 survives either pass.
- **Loop status:** not closed. 27 P2 remain, against 45 items in pass one. Twelve of the fixes change runtime code. Phase 014's own fixes produced 6 of this pass's findings. A narrow third pass over the fix diff is recommended (section 6). That is a judgment about fix risk, not a convergence rule.
- **Release readiness:** `converged` for this pass. No finding blocks a release.
- **Holdout:** no file a reviewer wrote holds holdout text. One pre-existing observation outside the range is in section 9.

---

## 2. Planning Trigger

The verdict alone routes to a changelog. Remediation is still triggered. 27 advisories remain and twelve of their fixes change runtime code. Phase 014's fixes also produced six of this pass's findings. So the next fix pass should be followed by a short review of its own diff. The Planning Packet below groups every finding into file-disjoint work groups that a worker swarm can build in parallel. The safety lane comes first: the attach-path no-edit guard and the behaviour runner's replay and restore.

```json Planning Packet
{
  "triggered": true,
  "triggerReason": "27 P2 advisories remain. Twelve fixes change runtime code. Phase 014's own fixes produced six of this pass's findings. A fix pass and then a narrow third review over its diff are recommended",
  "verdict": "PASS",
  "hasAdvisories": true,
  "counts": { "p0": 0, "p1": 0, "p2": 27, "refuted": 1, "passOneRechecked": 44, "passOneHold": 43, "passOnePartial": 1 },
  "activeFindings": [
    { "id": "SA2-P2-002", "severity": "P2", "verdict": "CONFIRMED", "location": ".skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:289", "origin": "pre-existing", "workGroup": "WG1" },
    { "id": "SA2-P2-003", "severity": "P2", "verdict": "CONFIRMED-ADJUSTED", "location": ".skilled/skills/system-skill-advisor/runtime/tests/handlers/advisor-status.vitest.ts:493", "origin": "pre-existing", "workGroup": "WG1" },
    { "id": "SA2-P2-001", "severity": "P2", "verdict": "CONFIRMED-ADJUSTED", "location": ".skilled/skills/system-skill-advisor/runtime/tests/command-attach.vitest.ts:120", "origin": "introduced", "workGroup": "WG1" },
    { "id": "SA2-P2-004", "severity": "P2", "verdict": "CONFIRMED", "location": ".skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/README.md:50", "origin": "introduced", "workGroup": "WG1" },
    { "id": "SA2-P2-005", "severity": "P2", "verdict": "CONFIRMED", "location": ".skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs:957", "origin": "pre-existing", "workGroup": "WG1" },
    { "id": "iter3-P2-backfill-log-code-execution", "severity": "P2", "verdict": "CONFIRMED", "location": ".skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-offer.mjs:332", "origin": "introduced", "workGroup": "WG2" },
    { "id": "iter5-P2-quoted-path-restore", "severity": "P2", "verdict": "CONFIRMED", "location": ".skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/worktree-restore.mjs:54", "origin": "introduced", "workGroup": "WG2" },
    { "id": "iter2-P2-g2-row-id-arm-mislabel", "severity": "P2", "verdict": "CONFIRMED", "location": ".skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/run-command-behaviour.mjs:974", "origin": "introduced", "workGroup": "WG2" },
    { "id": "iter2-P2-backfill-fixture-mismatch", "severity": "P2", "verdict": "CONFIRMED-ADJUSTED", "location": ".skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/run-command-behaviour.mjs:1214", "origin": "introduced", "workGroup": "WG2" },
    { "id": "iter2-P2-capture-env-not-restored", "severity": "P2", "verdict": "CONFIRMED", "location": ".skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/capture-command-routing-baseline.mjs:361", "origin": "introduced", "workGroup": "WG3" },
    { "id": "iter2-P2-cost-script-child-brief", "severity": "P2", "verdict": "CONFIRMED", "location": ".skilled/skills/system-skill-advisor/runtime/scripts/measure-brief-cost.mjs:167", "origin": "introduced", "workGroup": "WG3" },
    { "id": "iter4-P2-row-id-session-mode", "severity": "P2", "verdict": "CONFIRMED", "location": ".skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/README.md:112", "origin": "introduced", "workGroup": "WG4" },
    { "id": "iter5-P2-scorer-header-ordered-report", "severity": "P2", "verdict": "CONFIRMED", "location": ".skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:5", "origin": "introduced", "workGroup": "WG4" },
    { "id": "iter4-P2-playbook-inventory-note", "severity": "P2", "verdict": "CONFIRMED", "location": ".skilled/skills/system-skill-advisor/manual-testing-playbook/manual-testing-playbook.md:40", "origin": "pre-existing", "workGroup": "WG5" },
    { "id": "iter4-P2-playbook-persistence-path", "severity": "P2", "verdict": "CONFIRMED", "location": ".skilled/skills/system-skill-advisor/manual-testing-playbook/manual-testing-playbook.md:30", "origin": "pre-existing", "workGroup": "WG5" },
    { "id": "iter4-P2-tests-readme-description", "severity": "P2", "verdict": "CONFIRMED", "location": ".skilled/skills/system-skill-advisor/runtime/tests/README.md:154", "origin": "pre-existing", "workGroup": "WG5" },
    { "id": "iter2-P2-inert-bounded-summary-option", "severity": "P2", "verdict": "CONFIRMED-ADJUSTED", "location": ".opencode/plugins/system-skill-advisor.js:1080", "origin": "remediation-015", "workGroup": "WG6" },
    { "id": "iter5-P2-orphaned-route-summary", "severity": "P2", "verdict": "CONFIRMED", "location": ".opencode/plugins/system-skill-advisor.js:657", "origin": "remediation-015", "workGroup": "WG6" },
    { "id": "iter5-P2-field-pass-through-untested", "severity": "P2", "verdict": "CONFIRMED-ADJUSTED", "location": ".skilled/skills/system-skill-advisor/runtime/tests/hooks/skill-advisor-cli-fallback-envelope.vitest.ts:49", "origin": "introduced", "workGroup": "WG6" },
    { "id": "iter2-P2-stderr-cap-hides-busy", "severity": "P2", "verdict": "CONFIRMED-ADJUSTED", "location": ".skilled/skills/system-skill-advisor/runtime/lib/subprocess.ts:147", "origin": "remediation-014", "workGroup": "WG7" },
    { "id": "iter4-P2-advisor-recommend-stale-line-refs", "severity": "P2", "verdict": "CONFIRMED-ADJUSTED", "location": ".skilled/skills/system-skill-advisor/feature-catalog/cli-surface/advisor-recommend.md:31", "origin": "introduced", "workGroup": "WG7" },
    { "id": "DR2-P2-004", "severity": "P2", "verdict": "CONFIRMED", "location": ".skilled/commands/doctor/assets/doctor-agents-md-embed.yaml:104", "origin": "remediation-014", "workGroup": "WG8" },
    { "id": "DR2-P2-006", "severity": "P2", "verdict": "CONFIRMED", "location": ".skilled/commands/doctor/setup.md:82", "origin": "remediation-014", "workGroup": "WG8" },
    { "id": "DR2-P2-008", "severity": "P2", "verdict": "CONFIRMED", "location": ".skilled/commands/doctor/_routes.yaml:536", "origin": "pre-existing", "workGroup": "WG8" },
    { "id": "DR2-P2-005", "severity": "P2", "verdict": "CONFIRMED", "location": ".skilled/commands/doctor/scripts/hook-wiring-check.cjs:133", "origin": "remediation-014", "workGroup": "WG9" },
    { "id": "DR2-P2-007", "severity": "P2", "verdict": "CONFIRMED", "location": ".skilled/commands/doctor/scripts/agents-md-check.cjs:651", "origin": "remediation-014", "workGroup": "WG9" },
    { "id": "iter3-P2-phase007-open-evidence", "severity": "P2", "verdict": "CONFIRMED-ADJUSTED", "location": "specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/spec.md:122", "origin": "remediation-014", "workGroup": "WG10" }
  ],
  "refuted": [
    { "id": "iter2-P2-hook-health-doc-scope", "location": ".skilled/skills/system-skill-advisor/hooks/skill-advisor-hook-validation.md:100", "reason": "Withdrawn by its lineage in iteration 4. The health record writer runs inside the Claude prompt hook that the codex, cursor and devin shims call. Pi and dsh write their own. doctor-setup.yaml:59 already says OpenCode writes none" }
  ],
  "remediationWorkstreams": [
    { "id": "WG1", "order": 1, "lane": "safety", "title": "Attach-path no-edit guard and bridge text", "files": [".skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts", ".skilled/skills/system-skill-advisor/runtime/lib/scorer/text.ts", ".skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts", ".skilled/skills/system-skill-advisor/runtime/tests/command-attach.vitest.ts", ".skilled/skills/system-skill-advisor/runtime/tests/handlers/advisor-status.vitest.ts", ".skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs", ".skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/README.md", ".skilled/skills/system-skill-advisor/runtime/tests/derive-command-bridges-strings.vitest.ts"], "findings": ["SA2-P2-002", "SA2-P2-003", "SA2-P2-001", "SA2-P2-004", "SA2-P2-005"] },
    { "id": "WG2", "order": 2, "lane": "safety", "title": "Behaviour runner replay and restore", "files": [".skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-offer.mjs", ".skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/worktree-restore.mjs", ".skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/run-command-behaviour.mjs", ".skilled/skills/system-skill-advisor/runtime/tests/command-offer.vitest.ts", ".skilled/skills/system-skill-advisor/runtime/tests/worktree-restore.vitest.ts", ".skilled/skills/system-skill-advisor/runtime/tests/command-behaviour-guards.vitest.ts"], "findings": ["iter3-P2-backfill-log-code-execution", "iter5-P2-quoted-path-restore", "iter2-P2-g2-row-id-arm-mislabel", "iter2-P2-backfill-fixture-mismatch"] },
    { "id": "WG3", "order": 3, "lane": "advisory", "title": "Measurement environment hygiene", "files": [".skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/capture-command-routing-baseline.mjs", ".skilled/skills/system-skill-advisor/runtime/scripts/measure-brief-cost.mjs", ".skilled/skills/system-skill-advisor/runtime/tests/command-routing-slice.vitest.ts", ".skilled/skills/system-skill-advisor/runtime/tests/measure-brief-cost.vitest.ts"], "findings": ["iter2-P2-capture-env-not-restored", "iter2-P2-cost-script-child-brief"] },
    { "id": "WG4", "order": 4, "lane": "advisory", "title": "Routing-accuracy README and transcript scorer", "files": [".skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/README.md", ".skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs", ".skilled/skills/system-skill-advisor/runtime/tests/command-transcript-score.vitest.ts"], "findings": ["iter4-P2-row-id-session-mode", "iter5-P2-scorer-header-ordered-report"], "alsoWrites": "The README lines for the WG2 and WG3 behaviour, using the names fixed in section 4" },
    { "id": "WG5", "order": 5, "lane": "advisory", "title": "Playbook and tests README", "files": [".skilled/skills/system-skill-advisor/manual-testing-playbook/manual-testing-playbook.md", ".skilled/skills/system-skill-advisor/runtime/tests/README.md", ".skilled/skills/system-skill-advisor/runtime/tests/manual-testing-playbook.vitest.ts"], "findings": ["iter4-P2-playbook-inventory-note", "iter4-P2-playbook-persistence-path", "iter4-P2-tests-readme-description"] },
    { "id": "WG6", "order": 6, "lane": "advisory", "title": "OpenCode plugin residue and field pass-through tests", "files": [".opencode/plugins/system-skill-advisor.js", ".opencode/plugins/tests/system-skill-advisor.test.cjs", ".skilled/skills/system-skill-advisor/runtime/tests/hooks/skill-advisor-cli-fallback-envelope.vitest.ts"], "findings": ["iter2-P2-inert-bounded-summary-option", "iter5-P2-orphaned-route-summary", "iter5-P2-field-pass-through-untested"] },
    { "id": "WG7", "order": 7, "lane": "advisory", "title": "Subprocess stderr cap and catalog anchors", "files": [".skilled/skills/system-skill-advisor/runtime/lib/subprocess.ts", ".skilled/skills/system-skill-advisor/runtime/tests/subprocess-output-cap.vitest.ts", ".skilled/skills/system-skill-advisor/feature-catalog/cli-surface/advisor-recommend.md"], "findings": ["iter2-P2-stderr-cap-hides-busy", "iter4-P2-advisor-recommend-stale-line-refs"] },
    { "id": "WG8", "order": 8, "lane": "advisory", "title": "Doctor embed and setup contracts", "files": [".skilled/commands/doctor/assets/doctor-agents-md-embed.yaml", ".skilled/commands/doctor/_routes.yaml", ".skilled/commands/doctor/setup.md", ".skilled/commands/doctor/scripts/tests/doctor-setup-contract.test.cjs", ".skilled/commands/doctor/scripts/tests/doctor-agents-md-embed-contract.test.cjs"], "findings": ["DR2-P2-004", "DR2-P2-006", "DR2-P2-008"], "gate": "Phase 016's boundary task T015 requires _routes.yaml unchanged against HEAD. Commit this group before T015 runs or build it after phase 016" },
    { "id": "WG9", "order": 9, "lane": "advisory", "title": "Doctor check scripts", "files": [".skilled/commands/doctor/scripts/hook-wiring-check.cjs", ".skilled/commands/doctor/scripts/agents-md-check.cjs", ".skilled/commands/doctor/scripts/tests/hook-wiring-check.test.cjs", ".skilled/commands/doctor/scripts/tests/agents-md-check.test.cjs"], "findings": ["DR2-P2-005", "DR2-P2-007"] },
    { "id": "WG10", "order": 10, "lane": "coordinator", "title": "Packet phase map", "files": ["specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/spec.md"], "findings": ["iter3-P2-phase007-open-evidence"], "gate": "The packet status is the coordinator's" }
  ],
  "specSeed": [
    "A no-edit request in any common wording, straight or curly contraction included, attaches no command on any path through one shared pattern",
    "The backfill never runs code from a folder a run log names unless that folder is the project root or a marked arena",
    "The worktree restore removes every created path whatever characters its name holds",
    "A started-command row picked by id runs under arm g2 and its replay uses the fixture the run used",
    "A measurement script leaves the caller's environment as it found it and measures the parent brief from any shell",
    "The advisor subprocess sees a busy marker wherever it sits in stderr",
    "The OpenCode plugin keeps no option or computation without a consumer and both delivery paths test each command field",
    "Doctor contracts name every outcome the embed engine prints and the backup folder it makes",
    "Doctor checks accept the common ways to launch a hook and count only verified copies as expected",
    "Docs, playbook notes and line citations match the code and the tree",
    "The packet phase map matches each child's status"
  ],
  "planSeed": [
    "WG1 and WG2 first, in parallel, each with a failing-then-passing test wherever one can fail",
    "WG3 to WG9 next, in parallel. WG4 writes the README lines for WG2 and WG3 from the names fixed in section 4",
    "WG8 lands before phase 016 runs its boundary task T015 or after phase 016",
    "WG10 goes to the coordinator",
    "Then a narrow third /deep:review over the remediation diff only, with two lineages, about four iterations and the 0.10 threshold, followed by closeout over that pass's lineages only"
  ],
  "findingClasses": ["no-edit-pattern-gap", "safety-of-offering-a-mutating-command", "trust-boundary", "restore-robustness", "measurement-hygiene", "removal-residue", "latent-test-defect", "latent-escaping-defect", "contract-gap", "doc-code-drift", "checklist-evidence"],
  "affectedSurfacesSeed": [
    "command-attach NO_EDIT_REQUEST and scorer/text.ts isReadOnlyExplainer",
    "derive-command-bridges tsString",
    "advisor-status privacy test",
    "run-command-behaviour armFor and backfillLog",
    "command-offer warmCheckout and replay",
    "worktree-restore porcelain reader",
    "capture-command-routing-baseline environment projection",
    "measure-brief-cost hook environment",
    "score-command-transcripts session mode and header",
    "routing-accuracy README",
    "manual testing playbook and tests README",
    "OpenCode advisor plugin options and metadata",
    "CLI fallback field pass-through",
    "advisor subprocess stderr cap",
    "advisor-recommend feature catalog page",
    "agents-md embed exit-3 contract and backup naming",
    "doctor setup hook health text",
    "hook-wiring-check runsMarker",
    "agents-md-check A10 count",
    "packet phase map"
  ],
  "fixCompletenessRequired": true
}
```

---

## 3. Active Finding Registry

### 3.1 Full table (27 findings plus 1 withdrawn)

Verdict key: CONFIRMED means the defect is real as stated. ADJUSTED means real, but the description or its reach is corrected. REFUTED means the code does not do what the finding says. A corrected path or line alone does not make a finding ADJUSTED. The location column holds the verified line.

Origin key, from `git blame` with each blamed commit tested as an ancestor of `35c3188681` and `320e7b64d4`: pre-existing means the defect predates the packet. Introduced means the packet added it before pass one. Remediation means a pass-one fix added it, in phase 014 or phase 015.

| Id | Lineage | Verdict | Location | Origin | Fix in one line |
|---|---|---|---|---|---|
| SA2-P2-002 | scorer-attach-2 | CONFIRMED | `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:289` | pre-existing (moved here by phase 014) | Widen `NO_EDIT_REQUEST` to straight and curly contractions, "no changes" and "make no changes", then use it in `scorer/text.ts:148` in place of the third copy |
| SA2-P2-003 | scorer-attach-2 | ADJUSTED | `.skilled/skills/system-skill-advisor/runtime/tests/handlers/advisor-status.vitest.ts:493` | pre-existing | Persist a debug record that holds a marker string and assert the status output never shows it |
| SA2-P2-001 | scorer-attach-2 | ADJUSTED | `.skilled/skills/system-skill-advisor/runtime/tests/command-attach.vitest.ts:120` | introduced | Drop the assertion or re-comment it as a mode with no table row, because `:121` already proves the gate |
| SA2-P2-004 | scorer-attach-2 | CONFIRMED | `.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/README.md:50` | introduced | Name `mutating` in the row shape the README gives for `COMMAND_ROWS` |
| SA2-P2-005 | scorer-attach-2 | CONFIRMED | `.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs:957` | pre-existing | Escape `\n`, `\r`, U+2028 and U+2029 in `tsString` |
| iter3-P2-backfill-log-code-execution | accuracy-runner-2 | CONFIRMED | `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-offer.mjs:332-345` and `:409` | introduced | Refuse a `projectDir` that is neither the project root nor a marked arena before any spawn, with code `untrusted_checkout` |
| iter5-P2-quoted-path-restore | accuracy-runner-2 | CONFIRMED | `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/worktree-restore.mjs:52-56` | introduced | Read `git status --porcelain -z` and split on NUL, taking a rename's source from the next field |
| iter2-P2-g2-row-id-arm-mislabel | accuracy-runner-2 | CONFIRMED | `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/run-command-behaviour.mjs:974-977` | introduced | Name the arm g2 when every selected row id is a started-command id and refuse a mix |
| iter2-P2-backfill-fixture-mismatch | accuracy-runner-2 | ADJUSTED | `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/run-command-behaviour.mjs:1214` | introduced | Record `fixture` on each g2 run line and replay from it |
| iter2-P2-capture-env-not-restored | accuracy-runner-2 | CONFIRMED | `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/capture-command-routing-baseline.mjs:361-376` | introduced | Save every variable the capture sets or deletes and put it back in the `finally` block at `:662-668` |
| iter2-P2-cost-script-child-brief | accuracy-runner-2 | CONFIRMED | `.skilled/skills/system-skill-advisor/runtime/scripts/measure-brief-cost.mjs:167` | introduced | Drop `AI_SESSION_CHILD` from the hook's environment |
| iter4-P2-row-id-session-mode | accuracy-runner-2 | CONFIRMED | `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/README.md:112` | introduced | Honour `--row-id` in session mode or say it narrows the summary mode only |
| iter5-P2-scorer-header-ordered-report | accuracy-runner-2 | CONFIRMED | `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:5-8` | introduced | Make the header describe the counts and verdicts the CLI prints |
| iter4-P2-playbook-inventory-note | accuracy-runner-2 | CONFIRMED | `.skilled/skills/system-skill-advisor/manual-testing-playbook/manual-testing-playbook.md:40` | pre-existing | Restate the note from the tree: 50 scenario files, none named `NNN-*.md` |
| iter4-P2-playbook-persistence-path | accuracy-runner-2 | CONFIRMED | `.skilled/skills/system-skill-advisor/manual-testing-playbook/manual-testing-playbook.md:30` | pre-existing | Name the folder the report renderer writes to or create `benchmark/reports/` |
| iter4-P2-tests-readme-description | accuracy-runner-2 | CONFIRMED | `.skilled/skills/system-skill-advisor/runtime/tests/README.md:154` | pre-existing | Describe `manual-testing-playbook.vitest.ts` as the playbook inventory test it is |
| iter2-P2-inert-bounded-summary-option | render-hooks-plugin-2 | ADJUSTED | `.opencode/plugins/system-skill-advisor.js:1080` | remediation (phase 015) | Reword the jsdoc to say the option only sets a status field, as `hooks/skill-advisor-hook.md:176` already says |
| iter5-P2-orphaned-route-summary | render-hooks-plugin-2 | CONFIRMED | `.opencode/plugins/system-skill-advisor.js:657` | remediation (phase 015) | Delete `compiledRouteSummary` (`:591`) and its metadata field (`:669`) |
| iter5-P2-field-pass-through-untested | render-hooks-plugin-2 | ADJUSTED | `.skilled/skills/system-skill-advisor/runtime/tests/hooks/skill-advisor-cli-fallback-envelope.vitest.ts:49` | introduced | Assert `command`, `policy` and `ownerSkillId` on the fallback path and one command label in the plugin test |
| iter2-P2-stderr-cap-hides-busy | render-hooks-plugin-2 | ADJUSTED | `.skilled/skills/system-skill-advisor/runtime/lib/subprocess.ts:147-152` | remediation (phase 014) | Test each chunk for the busy marker before the cap drops it, then flip the pinning test |
| iter4-P2-advisor-recommend-stale-line-refs | render-hooks-plugin-2 | ADJUSTED | `.skilled/skills/system-skill-advisor/feature-catalog/cli-surface/advisor-recommend.md:31-37` | introduced | Cite the schema fields and handler steps by name or fix all six stale line numbers |
| DR2-P2-004 | doctor-install-2 | CONFIRMED | `.skilled/commands/doctor/assets/doctor-agents-md-embed.yaml:104` | remediation (phase 014) | Add the third exit-3 outcome for `ERROR: the restore failed` |
| DR2-P2-006 | doctor-install-2 | CONFIRMED | `.skilled/commands/doctor/setup.md:82` | remediation (phase 014, wrong since phase 015) | Replace the debug-flag sentence with the absent reason `doctor-setup.yaml:59` gives |
| DR2-P2-008 | doctor-install-2 | CONFIRMED | `.skilled/commands/doctor/_routes.yaml:536` and `assets/doctor-agents-md-embed.yaml:34` | pre-existing | Name the backup folder by the plan digest prefix and name the temporary-directory fallback |
| DR2-P2-005 | doctor-install-2 | CONFIRMED | `.skilled/commands/doctor/scripts/hook-wiring-check.cjs:133-148` | remediation (phase 014) | Accept `env node`, node with flags and a `bash -lc` string that runs node on the marker |
| DR2-P2-007 | doctor-install-2 | CONFIRMED | `.skilled/commands/doctor/scripts/agents-md-check.cjs:651` | remediation (phase 014) | Count only PASS entries as expected and name the report-only entries apart |
| iter3-P2-phase007-open-evidence | accuracy-runner-2 | ADJUSTED | `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/spec.md:122`, `:129` and `:130` | remediation (phase 014 half fix) | Coordinator: give row 7 its reason and mark rows 14 and 15 Complete |
| iter2-P2-hook-health-doc-scope | render-hooks-plugin-2 | REFUTED | `.skilled/skills/system-skill-advisor/hooks/skill-advisor-hook-validation.md:100` | not applicable | No change |

### 3.2 P0 and P1

No lineage raised a P0 or a P1 in pass two. Verification found none either. Pass one's two former P1 findings, DR1-P1-001 and DR4-P1-001, hold as fixed. doctor-install-2 rechecked both against `agents-md-embed.cjs`. `node --test` on `agents-md-embed.test.cjs` passed 43 of 43 here.

### 3.3 Verified scenarios for the safety-shaped and probed findings

**SA2-P2-002, `command-attach.ts:289`, four no-edit wordings still attach a writing command. Reach proven, stays P2.**

- Input: `attachCommand('sk-doc', <single sk-create-skill route>, prompt)` imported from `lib/command-attach.ts`, with five prompts that ask for a skill called invoice-parser and end in a no-edit request.
- What happens: "do not change anything yet" matches `NO_EDIT_REQUEST` and attaches nothing. "don't change anything yet", "no changes yet", the curly "don’t touch any files" and "make no changes" do not match. Each of those four attaches `/create:skill` with policy `start`.
- What should happen: all five match and attach nothing. `scorer/text.ts:148` holds a third copy of the same wording (`isReadOnlyExplainer`), so it misses the same four.
- Why it stays P2: `start` makes the command's setup ask before it writes. `AGENTS.md:68` also lets an explicit instruction outrank the policy. Pass one held R2-P2-001 at P2 on the same ground. The coordinator's decision in `goal.md` to keep the pattern covers over-matching, where a prompt that only limits scope loses its command. This finding is the other direction, so that decision does not settle it. Widening still fails toward no offer, the direction the decision chose.
- Test: in `command-attach-guards.vitest.ts`, each of the four wordings returns `/create:skill` today and `undefined` after. `isReadOnlyExplainer` gets the same four cases.

**iter3-P2-backfill-log-code-execution, `command-offer.mjs:332-345` and `:409`. Reach proven by probe.**

- Input: a crafted run-log line whose `locator.projectDir` names a scratch folder. That folder held a fake advisor CLI and a fake hook at the relative paths the replay uses. Then `--backfill` on that log.
- What happens: `warmCheckout` spawns node on the CLI under the named folder (`:333-344`). The replay (`replayOffer`, `:83-99`) runs the hook from the same folder. The fake hook wrote its marker file from its own process. The backfill printed `{"ok":true,"lines":1}` and exited 0. The rewritten line carried `offerError` `no_head`.
- What should happen: the backfill refuses a `projectDir` that is neither the project root nor an arena with the arena marker. It refuses before any spawn and records `untrusted_checkout` on the line.
- Why P2: reach needs a crafted or swapped run log and code already on disk at the named folder. The operator backfills logs the runner wrote. It is a trust-boundary gap in a measurement tool, not a path a prompt can reach.
- Test: in `command-offer.vitest.ts`, a line naming a temporary folder with a fake CLI. Today the fake runs. After, the line carries `untrusted_checkout` and the fake never runs.

**iter5-P2-quoted-path-restore, `worktree-restore.mjs:52-56`. Reach proven by probe.**

- Input: a scratch repository where a turn created `notes draft.md` and `plain.md`.
- What happens: git quotes a path that holds a space in porcelain output. The keys read `"\"notes draft.md\""` and `"plain.md"`. `restoreTurn` returned `{"restored":false,"leftoverPaths":["\"notes draft.md\""],"failures":[]}`. The file stayed on disk.
- What should happen: the restore reads NUL-separated status and removes both files.
- Why P2: the runner reports the leftover path and stops the arm, so the fault is loud. Nothing outside the arena is touched.
- Test: in `worktree-restore.vitest.ts`, a created file whose name holds a space survives today and is removed after.

**iter2-P2-stderr-cap-hides-busy, `subprocess.ts:147-152`. Pinned on purpose by a test.**

- Input: a child that writes more than the cap (`MAX_OUTPUT_CHARS`, 1024 times 1024, `:104`) to stderr before the `SQLITE_BUSY` marker.
- What happens: `capOutput` stops growing stderr at the cap. The busy check at `:355` never sees the marker, so no retry runs. `subprocess-output-cap.vitest.ts:47` pins exactly this ("a busy marker past it is not seen"). I ran the file: 2 passed, exit 0.
- Why ADJUSTED: the lineage read the miss as an accident. The test shows a chosen trade-off from phase 014. The defect is real but narrow, because a busy daemon writes its marker early. Reach needs over a mebibyte of stderr first.
- Test: flip the pinned case to expect one retry and `SQLITE_BUSY_EXHAUSTED`. It fails today and passes after.

**DR2-P2-005, `hook-wiring-check.cjs:133-148`. Reach proven by probe.**

- Input: a `.claude/settings.json` prompt hook written four ways around the same marker: plain `node <marker>`, `env node <marker>`, `bash -lc "node <marker>"` and `node --no-warnings <marker>`.
- What happens: the plain form prints `ok claude` and exits 0. The other three print `hook-missing claude .claude/settings.json` and exit 1. `startsCommand` accepts position 0, a shell separator or a bare `-c` after `bash` or `sh`. `runsMarker` wants the marker right after node.
- What should happen: all four report wired. `echo node <marker>` still reports not wired, which is the case the narrowing was for.
- Test: in `hook-wiring-check.test.cjs`, the three wrapper forms report `hook-missing` today and `ok` after.

**DR2-P2-007, `agents-md-check.cjs:651`. Confirmed on this checkout.**

- Input: `node .skilled/commands/doctor/scripts/agents-md-check.cjs --root . --json` on this worktree, exit 0.
- What happens: A10 prints `PASS | 5/6 copies as expected, 1 pointer missing`. Only three entries are PASS. Two are INFO `reported only` (`.cursorrules` and `~/.claude/CLAUDE.md`) and one is INFO `pointer missing` (`CLAUDE.md`). `expected` subtracts failed, unmeasured and pointer-missing entries only, so the two report-only entries count as expected. `agents-md-check.test.cjs:592` pins `5/6`.
- What should happen: count PASS entries only and name the report-only ones, for example `3/6 copies as expected, 2 reported only, 1 pointer missing`.
- Test: the pinned case reads `5/6` today and `3/6` with the report-only count after.

### 3.4 Evidence and tests for the remaining findings

Each line gives the evidence read in this synthesis and a test that fails today and passes after. Where no such test can exist, the line says so.

- **SA2-P2-001** `:120` asks for mode `sk-create-benchmark` with the `INJECTED` table, which has no row for it. So the call returns `undefined` at the table lookup, before any gate (probe: `undefined` for a plain and an effort prompt). `:121` already proves that a hub other than deep-loop answers with its command. The lineage's fix, adding the mode to `INJECTED`, would turn `:120` red. Test: none can fail, because the defect is a misleading assertion.
- **SA2-P2-003** The case at `:493` stores no prompt text, then asserts that status shows none. Status carries aggregates only (`advisor-status.ts:501-510`), so the assertion cannot fail. ADJUSTED because no leak path exists today. The guard only lacks a target. Test: persist a debug record holding a marker and assert the marker is absent. It passes today and would catch a future leak.
- **SA2-P2-004** `CommandRow` (`command-attach.ts:48-53`) carries `mutating`, which the renderer reads. The README sentence at `:50` names the command, its policy and the owning skill only. Test: a doc check that the README names every `CommandRow` field fails today.
- **SA2-P2-005** `tsString` (`:957-959`) escapes the backslash and the single quote only. A value holding a line break would emit an unterminated literal. It is latent: 0 of the 1683 strings in `command-bridges.generated.json` hold U+000A, U+000D, U+2028 or U+2029. Test: export `tsString` beside the exports at `:1396` and assert that the literal it emits for a value with each break holds no raw break. It fails today.
- **iter2-P2-g2-row-id-arm-mislabel** `armFor` (`:974-977`) names g2 only when `--set g2` is passed. A started-command row picked with `--row-id` runs under the default arm. `assertRunnable` (`:781`) accepts it, so its line joins the change comparison. The workaround is `--arm g2`. Test: `--row-id` with a started-command id logs the default arm today and g2 after. A mixed selection is refused after.
- **iter2-P2-backfill-fixture-mismatch** A run with `--fixture <dir>` puts that folder into each g2 prompt (`fixtureDir`, `:793-794`, used at `:1194-1201`). `backfillLog` (`:1214`) always rebuilds the prompt from `g2-fixture` beside the log. ADJUSTED: the replayed prompt differs from the one the model saw only in the fixture path, so the offer is measured on a slightly different text. Test: a log from a run with a custom fixture replays the custom path after and the default path today.
- **iter2-P2-capture-env-not-restored** The capture sets `SYSTEM_SKILL_ADVISOR_DB_DIR`, `SKILL_ADVISOR_DISABLE_BUILTIN_SEMANTIC`, `VITEST`, `SPECKIT_SKILL_ADVISOR_FORCE_LOCAL` and `PYTHONDONTWRITEBYTECODE`. It deletes four more (`:361-376`). The `finally` block (`:662-668`) restores only the clock and removes the database folder. The header (`:31-33`) promises that a harness can import the module and score in-process without inheriting the projection. Test: in `command-routing-slice.vitest.ts`, `process.env` after `scoreCommandCorpus()` equals a snapshot taken before. It fails today.
- **iter2-P2-cost-script-child-brief** The hook spawn (`:163-170`) passes `{ ...process.env, SPECKIT_IPC_SOCKET_DIR: socketDir }`. Under a dispatched worker `AI_SESSION_CHILD=1` rides along, so the hook renders the child brief and the script measures the wrong head. The registry gives the path under `routing-accuracy/`, where no such file exists. The script is `runtime/scripts/measure-brief-cost.mjs`. Test: in `measure-brief-cost.vitest.ts`, the hook's environment carries no `AI_SESSION_CHILD` when the parent has it. It fails today.
- **iter4-P2-row-id-session-mode** The README (`:112`) says `--row-id` narrows either mode. The usage line (`score-command-transcripts.mjs:40`) offers it on the session form, but `scoreSession` (`:885-905`) never reads it. Test: `--runtime` with `--locator` and a non-matching `--row-id` still scores the session today. After, it either filters or the usage drops the flag from that form.
- **iter5-P2-scorer-header-ordered-report** The header (`:5-8`) promises the `COMMAND:` lines, the reads and writes in order and the init check. The CLI prints per-arm counts and verdicts, not an ordered list. Test: none, the fix is a comment.
- **iter4-P2-playbook-inventory-note** `:40` says the category tree holds 41 `NNN-*.md` scenario files. The tree holds 50 scenario files and none match that name pattern. Test: `manual-testing-playbook.vitest.ts` can compare the note's count with the tree. It fails today.
- **iter4-P2-playbook-persistence-path** `:30` sends results to `system-skill-advisor/benchmark/reports/<dated-run-label>/`. The skill has no `benchmark` folder. The worker should find where the report renderer writes before choosing between a doc fix and a new folder. Test: a path check on the named folder fails today.
- **iter4-P2-tests-readme-description** `:154` calls `manual-testing-playbook.vitest.ts` a routing-fixture test. It checks the playbook inventory. Test: none, the fix is one doc line.
- **iter2-P2-inert-bounded-summary-option** The option is still parsed (`:379-395`) and printed in status (`:1704`). Since phase 015 removed the compiled-route line, it bounds nothing. `hooks/skill-advisor-hook.md:176` already says the variable only changes the `bounded_compiled_route_summary` status field. Only the jsdoc at `:1080` still says it bounds target lists. ADJUSTED from "controls nothing" to one stale comment. Test: none needed.
- **iter5-P2-orphaned-route-summary** `compiledRouteSummary` (`:591`) runs on every prompt at `:657` and lands in metadata at `:669`. The only metadata reader (`:1542`) reads freshness. Test: none can fail. The plugin suite is the guard.
- **iter5-P2-field-pass-through-untested** `recommendationFromCli` forwards `command`, `policy`, `ownerSkillId` and `needsMode` (`hooks/lib/skill-advisor-cli-fallback.ts:365-390`), added in `3871b3d5bd` and `18b5fe6d73`. The envelope test covers `needsMode` at `:70` only. No plugin test asserts any command label. ADJUSTED from "no test on either path" to three untested fields on the fallback path and every field on the plugin path. Test: the new assertions pass today and fail when a field is dropped.
- **iter4-P2-advisor-recommend-stale-line-refs** Six citations on lines 31, 33, 35 and 37 point at the wrong lines, not five. The fields now sit at `schemas/advisor-tool-schemas.ts:295` (`includeCompiledRoute`), `:298` (`compiledRouteTopOnly`), `:319` (`compiledRoute`) and `:321` (`command`). The handler steps sit at `handlers/advisor-recommend.ts:630-632` and `:705-707`. The citations were already stale at `320e7b64d4`. Test: a doc check that each cited line holds the named symbol fails today.
- **DR2-P2-004** On a failed write the engine prints `ERROR: writing <path> failed`, then calls `restoreFromBackup`. When that throws it prints `ERROR: the restore failed: <message>`. Then it prints the backup and undo lines and `STATUS=FAIL` and returns 3 (`agents-md-embed.cjs:1428-1439`). `restored:` prints only after every path is copied (`:1339`) and `nothing was restored` only on a hash mismatch (`:1318`). So this output holds neither line. `:104` has no branch for it. The presentation (`doctor-agents-md-presentation.txt:256`) already covers it with its "partly written" clause. Test: a contract assertion that the exit-3 rule names `the restore failed` fails today.
- **DR2-P2-006** `setup.md:82` names `SKILL_ADVISOR_DEBUG` as the setting that turns hook health records on. Since phase 015 the hook writes a prompt-free record by default (`metrics.ts:451-464`, `requireDebug` false). `doctor-setup.yaml:59` gives the real reason a record is absent: no prompt hook has written one for this checkout yet. Test: a `doctor-setup-contract.test.cjs` assertion that `setup.md` gives the same reason fails today.
- **DR2-P2-008** Both texts name the backup folder `<timestamp>`. The engine names it by the first 16 characters of the plan digest (`backupDirectoryOf`, `agents-md-embed.cjs:954-955`, `BACKUP_NAME_CHARS` at `:80`). `backupBase` (`:967`) falls back to the system temporary directory when git does not ignore the path. The workflow at `:34` names that fallback and `_routes.yaml:536` does not. Test: a contract assertion that both texts name the digest fails today.
- **iter3-P2-phase007-open-evidence** Pass one's fix put the reason in the phase child: `007-per-runtime-behaviour-proof/tasks.md:141` says T020, T046 and three acceptance rows wait for the final behaviour arm after the merge to main, by operator instruction. The map row at `spec.md:122` still reads In Progress with no reason. Widened: row 14 (`:129`, In Progress) and row 15 (`:130`, Planned) are stale too, while `014-review-remediation/spec.md:23` and `015-health-default-and-brief-refinements/spec.md:25` say Complete. Test: a read of each map row against its child's status row.

### 3.5 Refuted finding

**iter2-P2-hook-health-doc-scope**, `hooks/skill-advisor-hook-validation.md:100`. The lineage raised it in iteration 2 and withdrew it in iteration 4. This synthesis agrees. The finding said the playbook claims every hook run writes a health record while the OpenCode plugin writes none. The writer runs in `hooks/claude/user-prompt-submit.ts:242-251` with `requireDebug` false (`metrics.ts:451-464`). The codex, cursor and devin shims call that hook. Pi writes in process (`prompt-advisor.ts:288-301`) and dsh writes through `prompt-advisor.mjs:121-127`. OpenCode has no prompt hook that writes one. `doctor-setup.yaml:59` says so. The playbook's sentence is about hook runs, so it holds.

### 3.6 Pass-one fix recheck

Pass one carried 45 items: 42 findings and 3 queued items. `R4-P2-003` is left out because the operator approved it for phase 016. That leaves 44.

| Pass-one area | Items | Hold | Partial | Checked by and receipts |
|---|---|---|---|---|
| scorer-attach | 5 | 5 | 0 | scorer-attach-2. Rerun here: `command-attach-guards.vitest.ts` 14 passed and `command-attach.vitest.ts` 10 passed, both exit 0 |
| render-hooks-plugin | 12 | 12 | 0 | render-hooks-plugin-2. Its report says eleven of twelve hold and counts the refuted pass-one finding as the twelfth, under the wrong id `R3-P2-002--16e5737e0e56`. This synthesis counts twelve fixable items plus that refuted one. Rerun here: `subprocess-output-cap.vitest.ts` 2 passed, exit 0 |
| accuracy-runner | 9 | 8 | 1 | accuracy-runner-2. The partial one is `iter3-P2-phase007-open-evidence` (section 3.4). Rerun here: `command-behaviour-guards.vitest.ts` 6 passed, exit 0. The baseline holds all 45 tune rows and all 87 rows with split none. It holds 0 of the 44 holdout rows (ids counted only) |
| doctor-install | 17 | 17 | 0 | doctor-install-2. Rerun here with `node --test`: `agents-md-embed` 43 of 43, `hook-wiring-check` 8 of 8, `agents-md-check` 44 of 44 and `doctor-setup-contract` 4 of 4 |
| queued Q1 | 1 | 1 | 0 | This synthesis. Under `AI_SESSION_CHILD=1`, `command-brief-golden.vitest.ts` 13 passed and `hooks/skill-advisor-cli-fallback-envelope.vitest.ts` 3 passed, both exit 0 |

Two fixes hold for the case pass one named but carry a related new defect. DR2-P2-007 is the A10 count beside the pass-one fix for DR3-P2-001. DR2-P2-006 is the setup text beside the pass-one fix for Q3.

---

## 4. Remediation Workstreams

Every group owns its files alone, so the groups can run in parallel. The safety lane goes first. Each finding gets the test listed in section 3, written to fail first wherever one can fail.

1. **WG1 Attach-path no-edit guard and bridge text (safety lane).** SA2-P2-002, SA2-P2-003, SA2-P2-001, SA2-P2-004 and SA2-P2-005. Files: `command-attach.ts`, `scorer/text.ts`, `command-attach-guards.vitest.ts`, `command-attach.vitest.ts`, `handlers/advisor-status.vitest.ts`, `derive-command-bridges.cjs`, `command-bridges/README.md` and a new `derive-command-bridges-strings.vitest.ts`. `scorer/text.ts` imports `NO_EDIT_REQUEST` from the import-free `command-attach.ts`, as `fusion.ts:20` already does. `fusion.ts` itself is not edited. Run the deriver's check mode after, which must print `"changed": []`.
2. **WG2 Behaviour runner replay and restore (safety lane).** iter3-P2-backfill-log-code-execution, iter5-P2-quoted-path-restore, iter2-P2-g2-row-id-arm-mislabel and iter2-P2-backfill-fixture-mismatch. Files: `command-offer.mjs`, `worktree-restore.mjs`, `run-command-behaviour.mjs`, `command-offer.vitest.ts`, `worktree-restore.vitest.ts` and `command-behaviour-guards.vitest.ts`. Names fixed here so WG4 can document them in parallel: the backfill refusal code is `untrusted_checkout`, each g2 run line gains a `fixture` field and a `--row-id` selection that mixes started-command ids with other ids is refused with code `mixed_row_arms`.
3. **WG3 Measurement environment hygiene.** iter2-P2-capture-env-not-restored and iter2-P2-cost-script-child-brief. Files: `capture-command-routing-baseline.mjs`, `measure-brief-cost.mjs`, `command-routing-slice.vitest.ts` and `measure-brief-cost.vitest.ts`. The cost script removes `AI_SESSION_CHILD` from the hook's environment. Neither fix changes a measured number.
4. **WG4 Routing-accuracy README and transcript scorer.** iter4-P2-row-id-session-mode and iter5-P2-scorer-header-ordered-report. Files: `routing-accuracy/README.md`, `score-command-transcripts.mjs` and `command-transcript-score.vitest.ts`. This group also writes the README lines for WG2 and WG3: `untrusted_checkout` in the backfill refusal list near `:75-77`, the `fixture` field, the g2 arm rule with `mixed_row_arms` and the cost script clearing `AI_SESSION_CHILD` near `:95-97`.
5. **WG5 Playbook and tests README.** iter4-P2-playbook-inventory-note, iter4-P2-playbook-persistence-path and iter4-P2-tests-readme-description. Files: `manual-testing-playbook.md`, `runtime/tests/README.md` and `manual-testing-playbook.vitest.ts`.
6. **WG6 OpenCode plugin residue and field pass-through tests.** iter2-P2-inert-bounded-summary-option, iter5-P2-orphaned-route-summary and iter5-P2-field-pass-through-untested. Files: `.opencode/plugins/system-skill-advisor.js`, `.opencode/plugins/tests/system-skill-advisor.test.cjs` and `hooks/skill-advisor-cli-fallback-envelope.vitest.ts`.
7. **WG7 Subprocess stderr cap and catalog anchors.** iter2-P2-stderr-cap-hides-busy and iter4-P2-advisor-recommend-stale-line-refs. Files: `subprocess.ts`, `subprocess-output-cap.vitest.ts` and `feature-catalog/cli-surface/advisor-recommend.md`.
8. **WG8 Doctor embed and setup contracts.** DR2-P2-004, DR2-P2-006 and DR2-P2-008. Files: `assets/doctor-agents-md-embed.yaml`, `_routes.yaml`, `setup.md`, `doctor-setup-contract.test.cjs` and a new `doctor-agents-md-embed-contract.test.cjs`. The new exit-3 branch reads: when the output holds `ERROR: the restore failed`, the tree may be partly written, so quote both ERROR lines, show the backup and undo lines, end with STATUS=FAIL and name the undo command as the next step. It takes precedence over the `restored:` branch.
9. **WG9 Doctor check scripts.** DR2-P2-005 and DR2-P2-007. Files: `hook-wiring-check.cjs`, `agents-md-check.cjs` and their two test files.
10. **WG10 Packet phase map (coordinator).** iter3-P2-phase007-open-evidence. File: the packet's `spec.md`.

---

## 5. Spec Seed

- A no-edit request in any common wording attaches no command on any path, through one shared pattern.
- The backfill runs no code from a folder a run log names unless that folder is the project root or a marked arena.
- The worktree restore removes every created path whatever characters its name holds.
- A started-command row picked by id runs under arm g2. Its replay uses the fixture the run used.
- A measurement script leaves the caller's environment as it found it and measures the parent brief from any shell.
- The advisor subprocess sees a busy marker wherever it sits in stderr.
- The OpenCode plugin keeps no option or computation without a consumer. Both delivery paths test each command field.
- Doctor contracts name every outcome the embed engine prints and the backup folder it makes.
- Doctor checks accept the common ways to launch a hook and count only verified copies as expected.
- Docs, playbook notes and line citations match the code and the tree.
- The packet phase map matches each child's status.

---

## 6. Plan Seed

1. Dispatch WG1 and WG2 in parallel. Each worker writes the failing test first where one can fail, confirms it fails, applies the fix and confirms it passes.
2. Dispatch WG3 to WG9 in parallel under the same rule.
3. Run each touched test file alone as `env -u AI_SESSION_CHILD npx vitest run <file>` or `node --test <file>`. Run the deriver's check mode after WG1.
4. Hand WG10 to the coordinator.
5. Phase 016 interplay, read from its draft at the time of this synthesis: it writes `scorer/fusion.ts` and `AGENTS.md` line 65, which no group here writes. Its boundary task T015 requires `_routes.yaml` unchanged against HEAD, so WG8 is committed before T015 runs or is built after phase 016. Its doctor gate runs every doctor test, so WG8 and WG9 must leave `fail 0`.
6. Then run a narrow third `/deep:review` over the remediation diff only. Two lineages fit it, one for the attach and runner code and one for the doctor scripts and contracts, at about four iterations each with the 0.10 threshold. Then run closeout over that pass's lineages only (section 9 says what blocks closeout in place today).

---

## 7. Traceability Status

### Core protocols

| Protocol | Status | Evidence |
|---|---|---|
| `spec_code` | partial | Thirteen findings are docs, comments or contracts that disagree with code: SA2-P2-004, iter4-P2-row-id-session-mode, iter5-P2-scorer-header-ordered-report, iter4-P2-playbook-inventory-note, iter4-P2-playbook-persistence-path, iter4-P2-tests-readme-description, iter2-P2-inert-bounded-summary-option, iter4-P2-advisor-recommend-stale-line-refs, DR2-P2-004, DR2-P2-006, DR2-P2-008, iter2-P2-capture-env-not-restored (its header promise) and SA2-P2-001 (its comment). The lineages scored this row pass in three areas and partial in scorer-attach. |
| `checklist_evidence` | partial | The phased parent has no root checklist. Phase 007 keeps T020, T046 and three acceptance rows open by operator instruction. The parent map does not say so. Rows 14 and 15 of the map are stale. |
| `AC_COVERAGE` | exempt | The parent has no `acceptance-criteria.md`. Child phases own theirs. |

### Overlay protocols

| Protocol | Status | Evidence |
|---|---|---|
| `skill_agent` | notApplicable | No lineage found an agent definition in its area. |
| `agent_cross_runtime` | partial | render-hooks-plugin-2 and doctor-install-2 scored pass. scorer-attach-2 and accuracy-runner-2 scored partial, because live per-runtime proof belongs to phase 007's final arm after the merge. accuracy-runner-2 records `live_turn_execution_evidence` as blocked. |
| `feature_catalog_code` | partial | `advisor-recommend.md` matches the code in substance but six line citations are stale. scorer-attach-2 found `command-meaning-matching.md` matching on every checked claim. |
| `playbook_capability` | partial | The validation playbook's hook-health sentence holds (section 3.5). The root playbook's inventory note and result folder do not. |

Resource Map Coverage Gate: skipped. `resource-map.md` does not exist in the spec folder and no lineage emitted one.

---

## 8. Deferred Items

- **R2-P1-001 (pass one).** The child downgrade still has no per-request input. It was not re-tested here and its reopen trigger is unchanged.
- **`run` commands that write (pass one).** `/doctor:deep-loop` and `/doctor:speckit` are `run` with class `add-only`. Whether that is intended is still a decision, not a fix. scorer-attach-2 lists it the same way.
- **dsh install path (pass one).** `symlink-manifest.json` still has no `dsh` row. doctor-install-2 confirms the install route says so. A feature decision.
- **DR1-P1-001 reach on sandboxed runtimes (pass one).** Closed by phase 014. A failed write now restores from the backup and exits 3. The residue is DR2-P2-004.
- **R1-P2-003 reach (pass one).** Unchanged. No fixture shows DSH emitting an operator message with no `source`.
- **Third no-edit pattern (pass one).** `scorer/text.ts:148` is now part of SA2-P2-002's fix in WG1.
- **Live per-runtime evidence.** No lineage starts a model session, so behaviour on each runtime is read from code, not observed. Phase 007's final arm owns it.
- **Sealed holdout text in a committed scoring file.** An observation outside the reviewed range, described in section 9 under holdout handling. Not a pass-two finding.
- **Staging hazard.** `review/lineages/accuracy-runner-2/logs/quotepath-probe/` is a nested git repository left by the lineage's probe. Its file names hold a tab, a space and a quote. It is not ignored, so a `git add` of the review folder would stage it as an embedded repository. Deleting it is a delete of untracked files and needs the operator's yes.
- **Closeout steps.** Merge closeout, the config status, the save and strict validation are open. Section 9 says why each did not run here.

---

## Dimension Expansion Map

- All four lineages covered all four dimensions (`dimensionCoverage` true for correctness, security, traceability and maintainability in every lineage registry).
- Divergence state is empty in every lineage registry: no pivot started, completed or failed, no audited override, no saturated direction and no remaining frontier.
- Required search classes: doctor-install-2 recorded `pass_one_fix_replay`, `state_integrity`, `convergence_vote` and `holdout_hygiene`. accuracy-runner-2 recorded `severity_inflation`, `duplicate_finding` and `stale_finding`. The other two recorded none.
- This map records breadth only and changes no verdict.

---

## Search Ledger

| Lineage | Required classes | Candidates covered | Candidates ruled out | searchDebt | ruledOutCandidates | cleanSearchProof | Graph mode |
|---|---|---|---|---|---|---|---|
| scorer-attach-2 | 0 | 0 | 0 | 0 | 0 | 0 | not recorded |
| render-hooks-plugin-2 | 0 | 0 | 0 | 0 | 0 | 0 | not recorded |
| accuracy-runner-2 | 3 (1 blocked: `live_turn_execution_evidence`) | 28 | 20 | 0 | 25 | 25 | `graphless_fallback` |
| doctor-install-2 | 4 | 28 | 23 | 0 | 23 | 23 | `graphless_fallback` |

hasSearchDebt: false. scorer-attach-2's report lists 20 ruled-out directions that its registry does not hold.

---

## 9. Audit Appendix

### Convergence

Confirmed from each lineage's `deep-review-state.jsonl` (`newFindingsRatio` per iteration) and its `synthesis_complete` event.

| Lineage | Iterations | Stop reason | Novelty per iteration | Last ratio against 0.10 |
|---|---|---|---|---|
| scorer-attach-2 | 5 | converged | 1.00, 1.00, 1.00, 1.00, 0.00 | below |
| render-hooks-plugin-2 | 6 | converged | 0.00, 1.00, 0.00, 1.00, 1.00, 0.00 | below |
| accuracy-runner-2 | 7 | maxIterationsReached | 1.00, 1.00, 1.00, 1.00, 1.00, 0.00, 0.00 | below |
| doctor-install-2 | 6 | converged | 1.00, 0.00, 0.50, 0.33, 0.40, 0.00 | below |

Every lineage ended below the threshold. accuracy-runner-2 reached its cap and its event records release readiness `in-progress`, but its last two iterations found nothing new. The fan-out therefore converged. The coordinator's note gave scorer-attach-2 ten iterations. Its iterations folder holds ten files, five reports and five event files, so it ran five.

### Dimension order per lineage

- scorer-attach-2: correctness, security, traceability, maintainability, then one pass over all four.
- render-hooks-plugin-2: correctness, security, correctness again, traceability, maintainability, then one pass over all four.
- accuracy-runner-2: correctness twice, security, traceability, maintainability, then two passes over all four.
- doctor-install-2: correctness with traceability twice, correctness with security, traceability with maintainability twice, then one pass over all four.

### Merge and closeout

- `fanout-merge.cjs` reads every folder under `review/lineages/` and has no label filter. Run as written it mixes pass one's four lineages into this pass. A dry run over all eight folders in a scratch copy exited 0 with merged verdict CONDITIONAL, active P1 2 (pass one's DR1-P1-001 and DR4-P1-001, both fixed), active P2 68 and open 70.
- Deviation from the closeout checklist: the installed registry is a merge of the four `-2` lineages only, built in a scratch copy. It exited 0 with verdict PASS, P0 0, P1 0, P2 27, open 27, resolved 1 and an empty stderr. Before installing it, pass one's merge outputs were copied to `deep-review-findings-registry-pass-1.json` and `fanout-attribution-pass-1.md`. Both copies equal their HEAD versions.
- `synthesis-closeout.cjs` and `append-mode-event.cjs` were not run in the real folder. A dry run on a pass-two-only copy returned `synthesis_complete` (totalIterations 24, no invariant failure). A dry run on the mixed folder returned `synthesis_incomplete` with `structured_state_findings_partially_reflected_in_registry` and `structured_state_findings_missing_from_registry` (40 missing, totalIterations 44). In place, closeout would read pass one's lineages too. Two ways out: move each pass's lineage folders under a pass folder or give merge and closeout a label filter. Both change tracked files, so the choice is the coordinator's.
- The root `deep-review-config.json` stays `initialized` (maxIterations 5 from pass one) because closeout did not run. The four lineage configs are `complete`.
- Not run here: `git add` (the operator's), the continuity save through `generate-context.js` (it writes outside `review/`) and `validate.sh --strict` (other agents are writing in this packet now, so the result would reflect their drafts).

### Run health

- The run summary reports status ok with 4 of 4 lineages succeeded and all four `completed_with_containment_advisory`. Containment flagged two things. One is `goal.md`, where the diff is the coordinator's operator-answer rows. The other is the phase 009 research files written by the research fan-out that ran beside this pass. Neither came from a review lineage.
- The launcher printed four warnings, one per lineage, that a lineage under `--auto` has a prompt-only write boundary, not a sandbox.

### Probes run in this synthesis

All read-only or confined to scratch folders that were removed.

- `lib/command-attach.ts` imported directly: `attachCommand` on five no-edit wordings and on the `:120` call shape.
- `--backfill` on a crafted run log naming a scratch checkout with a fake CLI and hook.
- `restoreTurn` on a scratch repository holding a created file whose name has a space.
- `hook-wiring-check.cjs` on four `.claude/settings.json` forms.
- `agents-md-check.cjs --root . --json` on this worktree (exit 0).
- A line-break count over `command-bridges.generated.json`: 1683 strings, 0 with a line break (exit 0).
- Single-file test runs: `env -u AI_SESSION_CHILD npx vitest run` on `command-attach-guards` (14 passed), `command-attach` (10), `subprocess-output-cap` (2) and `command-behaviour-guards` (6). With `AI_SESSION_CHILD=1`: `command-brief-golden` (13) and the CLI fallback envelope (3). `node --test` on `agents-md-embed` (43 of 43), `hook-wiring-check` (8 of 8), `agents-md-check` (44 of 44) and `doctor-setup-contract` (4 of 4). Every run exited 0.
- A count of baseline rows by corpus split, ids only.
- `git blame` on every cited line, with each blamed commit tested as an ancestor of `35c3188681` and `320e7b64d4`.
- The pass-two-only merge, the mixed merge and both closeout dry runs, in scratch copies.

### Holdout handling

- No holdout prompt text was read into this report or printed. The leak check normalizes every holdout prompt and looks for a full match or any eight-word run in each file. It prints ids and paths only. The prompts are the 44 holdout-split rows of `command-prompts.jsonl` and the 66 sealed rows of `holdout-prompts.jsonl`. 107 of the 110 are long enough and distinct enough to test. Positive control: it found 44 and 63 hits in the two corpora.
- No file a lineage wrote holds holdout text. Neither does this report (rechecked after writing).
- The only hits under the review folder are in the containment quarantine copies of the phase 009 research scratch `skill-graph.sqlite`, three per lineage (956 files scanned, 12 hits). Those copies are gitignored by `.gitignore:407`. They hold the sealed row `suppressed-codex-abstain`. The databases are built from the skill graph, so the next bullet most likely explains the hit.
- Observation outside the reviewed range: the committed `.skilled/skills/system-skill-advisor/runtime/scripts/skill-graph.json` holds the full text of that sealed row. It is present in all 40 versions of the file checked, all older than `35c3188681`. Whether the row was sealed from the graph or the graph took in the row is not shown. If the scorer reads that text, the row cannot measure held-out reach. That belongs to whoever owns the holdout set.

### Lineage artifact notes

- The four lineage configs carry four different `reviewFocus` texts. They are not quoted because they hold punctuation this report's writing rules exclude.
- render-hooks-plugin-2 and doctor-install-2 record `createdAt` `12:40:00.000Z`, after the run ended at 12:22Z. The round value matches the 12:40 local launch, so it most likely is local time stamped as UTC.
- scorer-attach-2's registry holds 0 ruled-out candidates while its report lists 20.
- accuracy-runner-2's report says ten new findings while its registry holds 12.
- render-hooks-plugin-2 names the refuted pass-one finding `R3-P2-002--16e5737e0e56`. Pass one's id is `R3-P2-001--16e5737e0e56`.
- The registry entry for the cost script names a path under `routing-accuracy/` that does not exist.
- `findingClass` is empty on every merged finding, so the classes in the Planning Packet come from this synthesis.
- `fanout-attribution.md` lists all four lineages as PASS. This report agrees.

### Sources reviewed

`review/deep-review-findings-registry.json`, `review/review-scope-2.txt`, `review/orchestration-summary.json`, `review/deep-review-fanout-config-pass-2.json`, `review/review-report-pass-1.md`, the four `-2` lineage registries, state logs, configs, iteration files and reports, every file cited in section 3, the packet's `goal.md` decision rows, phase 016's draft `tasks.md` and `spec.md` (read only) and the pass-two launcher's stderr.
