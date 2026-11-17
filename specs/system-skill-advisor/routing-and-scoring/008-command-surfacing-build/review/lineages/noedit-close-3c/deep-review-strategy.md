# Deep Review Strategy - Command Surfacing Pass Three Closing Round (noedit-close-3c)

## 2. TOPIC

Closing review of the command-surfacing change, pass three. The lineage starts with the no-edit gate and goes deepest there, then reviews the doctor hook check once, then closes traceability and maintainability. Two settled decisions are out of scope: the "make no changes" phrase rules out a change whatever follows it, and the hook check is a wiring heuristic rather than a node or shell parser.

Target: `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build`
Instruction source: `/private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Skilled/c9fe91ef-9b85-4bdc-88fb-4d6f766eaecf/scratchpad/review-instructions-3c.txt`

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
- [ ] security

<!-- /ANCHOR:review-dimensions -->
## 4. NON-GOALS

- The two settled decisions: the "make no changes" scope-limit cost, and the hook heuristic's status as not-a-parser.
- Code changes of any kind; this lineage writes only its own state files.
- Holdout prompt text: never opened, never read.
- The full suite, builds, daemons and model CLIs.

## 5. STOP CONDITIONS

- Convergence at 0.10 weighted new-finding ratio, or three iterations, whichever comes first.
- A P0 finding stops the loop at synthesis and forces `Review verdict: FAIL`.

<!-- ANCHOR:completed-dimensions -->
## 4. COMPLETED DIMENSIONS
- [x] correctness
- [x] traceability
- [x] maintainability

<!-- /ANCHOR:completed-dimensions -->
<!-- ANCHOR:running-findings -->
## 5. RUNNING FINDINGS
- P0 (Blockers): 0
- P1 (Required): 1
- P2 (Suggestions): 2
- Resolved: 0

<!-- /ANCHOR:running-findings -->
## 8. WHAT WORKED

- Importing the shipped `.ts` modules with the deep-loop `tsx` and printing matcher + explainer + attached command for a paired control prompt: it separates a vocabulary miss from a wiring bug in one run (iteration 1).
- Pairing every probe with a control that differs by one word ("don't change it yet" vs "don't create it yet"; "show" vs "just show"): it proves the difference is the matcher, not the route (iteration 1).
- Building one throwaway checkout per candidate hook command under `mktemp` and running the shipped check as a process: it gives a real stdout and exit code per case, and the attached-vs-separated node-flag pair isolates the flag set from the shell reading (iteration 2).
- Verifying each candidate flag against the runtime first (`node --env-file /dev/null -e …`, `node --title hook -e …`): it removed `--max-old-space-size` from the finding because node rejects that form, leaving only commands that really run (iteration 2).
- Reading the packet's own acceptance row and feature catalog against the code before judging doc drift: it separated live claims (the matcher and exit-code rows) from the dated phase-014 snapshot, so no false doc finding was raised (iteration 3).

## 9. WHAT FAILED

- Reading the matcher alone without checking `isReadOnlyExplainer`: a no-edit prompt with a read-only verb is held at the explainer floor, so a verb-list miss there has no route to attach to. The probe was changed to a naming prompt with no read-only verb before the finding was trusted (iteration 1).
- Treating the first `hook-missing` case as a finding: `bash -o pipefail -c` and `command node` are valid but are shell-grammar gaps that settled decision 2 puts out of scope, and `node --max-old-space-size 4096` is rejected by node itself. Only the separated node-flag case survived as a finding (iteration 2).
- Reporting the phase-014 "Known Limitations" list as live doc drift: the section dates itself and two of its rows were fixed in pass two, so it is recorded as historical context instead (iteration 3).

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### **A `lastIndex` state bug.** `NO_EDIT_REQUEST` has no global flag, and the direct `.test` call at `command-attach-guards.vitest.ts:49` is stable. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **A `lastIndex` state bug.** `NO_EDIT_REQUEST` has no global flag, and the direct `.test` call at `command-attach-guards.vitest.ts:49` is stable.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A `lastIndex` state bug.** `NO_EDIT_REQUEST` has no global flag, and the direct `.test` call at `command-attach-guards.vitest.ts:49` is stable.

### **A crash on non-string input.** All four call sites pass `promptLower`/`prompt` strings produced from the request; no public path reaches `isNoEditRequest` with a non-string. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **A crash on non-string input.** All four call sites pass `promptLower`/`prompt` strings produced from the request; no public path reaches `isNoEditRequest` with a non-string.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A crash on non-string input.** All four call sites pass `promptLower`/`prompt` strings produced from the request; no public path reaches `isNoEditRequest` with a non-string.

### **A crash or hang.** The probe ran twelve fixtures; `readWords` advances on every branch, the unterminated-quote branch returns early, and `runsMarker` caps recursion at depth 2. `main` catches a thrown error and exits 2. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **A crash or hang.** The probe ran twelve fixtures; `readWords` advances on every branch, the unterminated-quote branch returns early, and `runsMarker` caps recursion at depth 2. `main` catches a thrown error and exits 2.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A crash or hang.** The probe ran twelve fixtures; `readWords` advances on every branch, the unterminated-quote branch returns early, and `runsMarker` caps recursion at depth 2. `main` catches a thrown error and exits 2.

### **A crossed exit-code contract in the doctor delivery rows.** `doctor-setup.yaml:61` (exit 2 = ERROR) and `doctor-symlink-check.yaml:60` (exit 2 = FAIL) match `main`'s `process.exit(2)` on a bad argument or missing root. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **A crossed exit-code contract in the doctor delivery rows.** `doctor-setup.yaml:61` (exit 2 = ERROR) and `doctor-symlink-check.yaml:60` (exit 2 = FAIL) match `main`'s `process.exit(2)` on a bad argument or missing root.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A crossed exit-code contract in the doctor delivery rows.** `doctor-setup.yaml:61` (exit 2 = ERROR) and `doctor-symlink-check.yaml:60` (exit 2 = FAIL) match `main`'s `process.exit(2)` on a bad argument or missing root.

### **A doc claim that the verb list is complete.** Neither README, the feature catalog, nor the pinning test claims which verbs are covered; the list is presented as the matcher, not as a closed vocabulary. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **A doc claim that the verb list is complete.** Neither README, the feature catalog, nor the pinning test claims which verbs are covered; the list is presented as the matcher, not as a closed vocabulary.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A doc claim that the verb list is complete.** Neither README, the feature catalog, nor the pinning test claims which verbs are covered; the list is presented as the matcher, not as a closed vocabulary.

### **A false positive from `endsWith(marker)`.** The probe's `node ./<marker>` and `node <marker>` forms both end at the marker; no tested non-launch ends with the marker without running it. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **A false positive from `endsWith(marker)`.** The probe's `node ./<marker>` and `node <marker>` forms both end at the marker; no tested non-launch ends with the marker without running it.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A false positive from `endsWith(marker)`.** The probe's `node ./<marker>` and `node <marker>` forms both end at the marker; no tested non-launch ends with the marker without running it.

### **A maintainability defect in the new comments.** Each changed comment explains why, not what, and none embeds a spec or finding id. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **A maintainability defect in the new comments.** Each changed comment explains why, not what, and none embeds a spec or finding id.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A maintainability defect in the new comments.** Each changed comment explains why, not what, and none embeds a spec or finding id.

### **A stale reference to the third pattern copy.** `runtime/lib/README.md:132`, `scorer/README.md:55`, `feature-catalog/.../command-meaning-matching.md:36` and `runtime/tests/README.md:157` all describe the shared gate as it is. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **A stale reference to the third pattern copy.** `runtime/lib/README.md:132`, `scorer/README.md:55`, `feature-catalog/.../command-meaning-matching.md:36` and `runtime/tests/README.md:157` all describe the shared gate as it is.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A stale reference to the third pattern copy.** `runtime/lib/README.md:132`, `scorer/README.md:55`, `feature-catalog/.../command-meaning-matching.md:36` and `runtime/tests/README.md:157` all describe the shared gate as it is.

### **A stateful matcher or a `lastIndex` bug.** `readWords` builds fresh arrays per call; the check is a one-shot process. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **A stateful matcher or a `lastIndex` bug.** `readWords` builds fresh arrays per call; the check is a one-shot process.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A stateful matcher or a `lastIndex` bug.** `readWords` builds fresh arrays per call; the check is a one-shot process.

### **An unstated runtime row in the hook check.** The four rows match the four settings files present in this checkout, and all four print `ok`; no fifth file claims coverage. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **An unstated runtime row in the hook check.** The four rows match the four settings files present in this checkout, and all four print `ok`; no fifth file claims coverage.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **An unstated runtime row in the hook check.** The four rows match the four settings files present in this checkout, and all four print `ok`; no fifth file claims coverage.

### **Catastrophic backtracking or a hang in the matcher.** The alternatives are literals and single-verb groups with no nested quantifier; every probe returned in milliseconds. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **Catastrophic backtracking or a hang in the matcher.** The alternatives are literals and single-verb groups with no nested quantifier; every probe returned in milliseconds.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Catastrophic backtracking or a hang in the matcher.** The alternatives are literals and single-verb groups with no nested quantifier; every probe returned in milliseconds.

### **The `--env-file` gap being the settled quoted-value case.** The separated form is a clean word boundary, and node accepts it as written; it is neither an attached value nor an unknown flag. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **The `--env-file` gap being the settled quoted-value case.** The separated form is a clean word boundary, and node accepts it as written; it is neither an attached value nor an unknown flag.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The `--env-file` gap being the settled quoted-value case.** The separated form is a clean word boundary, and node accepts it as written; it is neither an attached value nor an unknown flag.

### **The curly-apostrophe regression.** The fold is intact and the probe with `don’t` (curly) was not needed beyond the pinned test. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **The curly-apostrophe regression.** The fold is intact and the probe with `don’t` (curly) was not needed beyond the pinned test.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The curly-apostrophe regression.** The fold is intact and the probe with `don’t` (curly) was not needed beyond the pinned test.

### **The four test loops being vacuous.** Each launch case fails today if the shell reading regresses (e.g. removing `&` as a separator breaks `cd /tmp & node <marker>`), and each `hook-missing` case has a positive control in the suite. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **The four test loops being vacuous.** Each launch case fails today if the shell reading regresses (e.g. removing `&` as a separator breaks `cd /tmp & node <marker>`), and each `hook-missing` case has a positive control in the suite.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The four test loops being vacuous.** Each launch case fails today if the shell reading regresses (e.g. removing `&` as a separator breaks `cd /tmp & node <marker>`), and each `hook-missing` case has a positive control in the suite.

### **The settled "make no changes" cost as a finding.** Ran the settled control; it behaves as the settled decision says and is not reported. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **The settled "make no changes" cost as a finding.** Ran the settled control; it behaves as the settled decision says and is not reported.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The settled "make no changes" cost as a finding.** Ran the settled control; it behaves as the settled decision says and is not reported.

### `agent_cross_runtime` — partial. `doctor-setup.yaml:61` and `doctor-symlink-check.yaml:60` describe the check's exit 0/1/2 roles exactly as `hook-wiring-check.cjs:15-16` and `main` implement them; the four modelled settings files in this checkout all print `ok` (run above). The finding `NC3-P2-003` shows one valid node launch inside that model still reports exit 1. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: `agent_cross_runtime` — partial. `doctor-setup.yaml:61` and `doctor-symlink-check.yaml:60` describe the check's exit 0/1/2 roles exactly as `hook-wiring-check.cjs:15-16` and `main` implement them; the four modelled settings files in this checkout all print `ok` (run above). The finding `NC3-P2-003` shows one valid node launch inside that model still reports exit 1.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `agent_cross_runtime` — partial. `doctor-setup.yaml:61` and `doctor-symlink-check.yaml:60` describe the check's exit 0/1/2 roles exactly as `hook-wiring-check.cjs:15-16` and `main` implement them; the four modelled settings files in this checkout all print `ok` (run above). The finding `NC3-P2-003` shows one valid node launch inside that model still reports exit 1.

### `checklist_evidence` — partial. `014-review-remediation/acceptance-criteria.md:60` (AC-005) claims the no-edit prompt attaches nothing and that `fusion.ts` reads the same pattern; both hold (`fusion.ts:20` imports `isNoEditRequest`; `fusion.ts:677` and `:881` call it). The two pass-three commits are post-acceptance remediation and have no packet checklist row of their own, so no further row is claimed. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: `checklist_evidence` — partial. `014-review-remediation/acceptance-criteria.md:60` (AC-005) claims the no-edit prompt attaches nothing and that `fusion.ts` reads the same pattern; both hold (`fusion.ts:20` imports `isNoEditRequest`; `fusion.ts:677` and `:881` call it). The two pass-three commits are post-acceptance remediation and have no packet checklist row of their own, so no further row is claimed.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `checklist_evidence` — partial. `014-review-remediation/acceptance-criteria.md:60` (AC-005) claims the no-edit prompt attaches nothing and that `fusion.ts` reads the same pattern; both hold (`fusion.ts:20` imports `isNoEditRequest`; `fusion.ts:677` and `:881` call it). The two pass-three commits are post-acceptance remediation and have no packet checklist row of their own, so no further row is claimed.

### `checklist_evidence` — pending (not in this iteration's focus). -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `checklist_evidence` — pending (not in this iteration's focus).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `checklist_evidence` — pending (not in this iteration's focus).

### `checklist_evidence` — pending (synthesis iteration). -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `checklist_evidence` — pending (synthesis iteration).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `checklist_evidence` — pending (synthesis iteration).

### `feature_catalog_code` — pass. The feature-catalog sentence names the same four markers the pattern carries ("no edits", "do not change", "just show", "just list") and the same two gates; nothing in it was superseded by commit `846eab66b8`. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: `feature_catalog_code` — pass. The feature-catalog sentence names the same four markers the pattern carries ("no edits", "do not change", "just show", "just list") and the same two gates; nothing in it was superseded by commit `846eab66b8`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `feature_catalog_code` — pass. The feature-catalog sentence names the same four markers the pattern carries ("no edits", "do not change", "just show", "just list") and the same two gates; nothing in it was superseded by commit `846eab66b8`.

### `playbook_capability` — notApplicable: neither reviewed file has a playbook surface. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `playbook_capability` — notApplicable: neither reviewed file has a playbook surface.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `playbook_capability` — notApplicable: neither reviewed file has a playbook surface.

### `playbook_capability` — notApplicable: no playbook surface is in scope. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: `playbook_capability` — notApplicable: no playbook surface is in scope.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `playbook_capability` — notApplicable: no playbook surface is in scope.

### `playbook_capability` — notApplicable: the check is a CLI script with no playbook surface. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `playbook_capability` — notApplicable: the check is a CLI script with no playbook surface.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `playbook_capability` — notApplicable: the check is a CLI script with no playbook surface.

### `skill_agent` — notApplicable: neither reviewed module is an agent or command document. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: `skill_agent` — notApplicable: neither reviewed module is an agent or command document.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `skill_agent` — notApplicable: neither reviewed module is an agent or command document.

### `skill_agent`, `agent_cross_runtime`, `feature_catalog_code` — pending. -- BLOCKED (iteration 2, 2 attempts)
- What was tried: `skill_agent`, `agent_cross_runtime`, `feature_catalog_code` — pending.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `skill_agent`, `agent_cross_runtime`, `feature_catalog_code` — pending.

### `spec_code` — partial. The file's contract line "Exit 0 when every installed runtime carries its entry, 1 when one is missing" holds for the four runtimes it models, and the four model rows (`.claude`, `.codex`, `.cursor`, `.devin`) match the checkout. The finding shows one valid launch shape inside that stated contract is misclassified; no packet acceptance row was read this iteration. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `spec_code` — partial. The file's contract line "Exit 0 when every installed runtime carries its entry, 1 when one is missing" holds for the four runtimes it models, and the four model rows (`.claude`, `.codex`, `.cursor`, `.devin`) match the checkout. The finding shows one valid launch shape inside that stated contract is misclassified; no packet acceptance row was read this iteration.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `spec_code` — partial. The file's contract line "Exit 0 when every installed runtime carries its entry, 1 when one is missing" holds for the four runtimes it models, and the four model rows (`.claude`, `.codex`, `.cursor`, `.devin`) match the checkout. The finding shows one valid launch shape inside that stated contract is misclassified; no packet acceptance row was read this iteration.

### `spec_code` — partial. The module comment at `command-attach.ts:287-292` states that the pattern is "wording that asks for an answer and rules out a change", and the three gates apply it as that. The two findings show the vocabulary does not yet cover that statement in both directions; no packet acceptance row was read this iteration. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `spec_code` — partial. The module comment at `command-attach.ts:287-292` states that the pattern is "wording that asks for an answer and rules out a change", and the three gates apply it as that. The two findings show the vocabulary does not yet cover that statement in both directions; no packet acceptance row was read this iteration.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `spec_code` — partial. The module comment at `command-attach.ts:287-292` states that the pattern is "wording that asks for an answer and rules out a change", and the three gates apply it as that. The two findings show the vocabulary does not yet cover that statement in both directions; no packet acceptance row was read this iteration.

### `spec_code` — pass for the reviewed claims, with the two findings standing as the gap. `runtime/lib/README.md:132` ("a prompt that matches `NO_EDIT_REQUEST` gets no command"), `scorer/README.md:55` ("`commandMeaningEligible` decides who may pass on meaning … a prompt matching `NO_EDIT_REQUEST` … rules out every command") and `feature-catalog/scorer-fusion/command-meaning-matching.md:36` all describe the code as it stands. `feature-catalog/cli-surface/advisor-recommend.md:33` matches the `attachCommand` shape checks at `command-attach.ts:323-338`. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: `spec_code` — pass for the reviewed claims, with the two findings standing as the gap. `runtime/lib/README.md:132` ("a prompt that matches `NO_EDIT_REQUEST` gets no command"), `scorer/README.md:55` ("`commandMeaningEligible` decides who may pass on meaning … a prompt matching `NO_EDIT_REQUEST` … rules out every command") and `feature-catalog/scorer-fusion/command-meaning-matching.md:36` all describe the code as it stands. `feature-catalog/cli-surface/advisor-recommend.md:33` matches the `attachCommand` shape checks at `command-attach.ts:323-338`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `spec_code` — pass for the reviewed claims, with the two findings standing as the gap. `runtime/lib/README.md:132` ("a prompt that matches `NO_EDIT_REQUEST` gets no command"), `scorer/README.md:55` ("`commandMeaningEligible` decides who may pass on meaning … a prompt matching `NO_EDIT_REQUEST` … rules out every command") and `feature-catalog/scorer-fusion/command-meaning-matching.md:36` all describe the code as it stands. `feature-catalog/cli-surface/advisor-recommend.md:33` matches the `attachCommand` shape checks at `command-attach.ts:323-338`.

<!-- /ANCHOR:exhausted-approaches -->
## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

## 11. RULED OUT DIRECTIONS

[Empty at init]

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- Dimension: synthesis - Focus area: compile the report from the registry, the three iteration files and the strategy; derive the verdict from the active findings; run the closeout through the gateway - Reason: all four dimensions are covered; correctness produced one P1 and two P2 advisories - Rotation status: D1, D3, D4 covered; D2 security has no security-shaped surface in either changed file (both are local, non-networked, input-only classifiers), recorded as reviewed-not-applicable rather than skipped - Blocked/productive carry-forward: none blocked; the parent fan-out merge is the runner's, not this lineage's - Required evidence: the findings registry totals, the three iteration verdicts, and the terminal closeout record - Recovery note: the `Review verdict` line stays CONDITIONAL while `NC3-P1-001` is active Review verdict: CONDITIONAL

<!-- /ANCHOR:next-focus -->
## 13. KNOWN CONTEXT

### Bounded Context Snapshot

- Target pointers: `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:287-298`, its callers `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:676-679` and `:877-885`, `.skilled/skills/system-skill-advisor/runtime/lib/scorer/text.ts:147-165`, and `.skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts`.
- Hook pointers: `.skilled/commands/doctor/scripts/hook-wiring-check.cjs` (`readWords`, `simpleCommands`, `commandWords`, `nodeFlagSkipsScript`, `runsNodeOnMarker`, `scriptWord`, `runsMarker`) and `.skilled/commands/doctor/scripts/tests/hook-wiring-check.test.cjs`.
- Behavior claims: a prompt that rules out a change gets no command from either the hub-attach path or the scorer; the hook check reports `hook-missing` only for a command that does not launch node on the marker path.
- Reuse and conventions: one shared matcher (`isNoEditRequest`) serves every gate, keeping them from drifting.
- Review risks and gaps: the pattern is vocabulary, so missing or over-broad wording is the main reachable defect class; the hook check is a heuristic, so only a *valid* command it misreads is a defect there.
- Prior context: pass two left 27 advisories and no blocker; the pass-three confirming round raised `make no changes to` (fixed by `846eab66b8`) and two advisories (separator width, quoted long-flag value) that the settled decisions close.

## 14. CROSS-REFERENCE STATUS

<!-- MACHINE-OWNED: START -->
| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | pending | - | - |
| `checklist_evidence` | core | pending | - | - |
| `skill_agent` | overlay | pending | - | - |
| `agent_cross_runtime` | overlay | pending | - | - |
| `feature_catalog_code` | overlay | pending | - | - |
| `playbook_capability` | overlay | notApplicable | - | No playbook surface in these two files |
<!-- MACHINE-OWNED: END -->

## 15. FILES UNDER REVIEW

<!-- MACHINE-OWNED: START -->
| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts | D1 | 1 | 1 P1, 1 P2 | partial |
| .skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts | D1 | 1 | 0 | partial (caller only) |
| .skilled/skills/system-skill-advisor/runtime/lib/scorer/text.ts | D1 | 1 | 0 | partial (caller only) |
| .skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts | D1 | 1 | 0 | partial |
| .skilled/commands/doctor/scripts/hook-wiring-check.cjs | - | - | - | pending |
| .skilled/commands/doctor/scripts/tests/hook-wiring-check.test.cjs | - | - | - | pending |
<!-- MACHINE-OWNED: END -->

## 16. REVIEW BOUNDARIES

<!-- MACHINE-OWNED: START -->
- Max iterations: 3
- Convergence threshold: 0.1
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=fanout-noedit-close-3c-1794596804847-827gze, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 13 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=[spec_code, checklist_evidence], overlay=[skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability]
- Started: 2026-11-13T19:16:02Z
<!-- MACHINE-OWNED: END -->
