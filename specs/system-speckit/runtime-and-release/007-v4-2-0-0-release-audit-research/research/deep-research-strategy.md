---
title: Deep Research Strategy
description: Session tracking for the post-v4.1.0.0 bug, drift and issue hunt across logic, skills and work changed in v4.1.0.0..HEAD.
trigger_phrases:
  - "post v4.1.0.0 drift research"
  - "v4.1.0.0 bug hunt"
importance_tier: normal
contextType: research
---

# Deep Research Strategy - Session Tracking

Tracks research progress across iterations for this run.

## 1. OVERVIEW

### Purpose

Serves as the "persistent brain" for a deep research session. Records what to investigate, what worked, what failed, and where to focus next. Read by the orchestrator and agents at every iteration.

### Usage

- **Init:** Orchestrator copies this template to `{spec_folder}/research/deep-research-strategy.md` and populates Topic, Key Questions, Known Context, and Research Boundaries from config and memory context.
- **Per iteration:** Agent reads Next Focus, writes iteration evidence, and the reducer refreshes What Worked/Failed, answered questions, carried-forward questions, ruled-out directions, and Next Focus.
- **Mutability:** Mutable — analyst-owned sections remain stable, while machine-owned sections are rewritten by the reducer after each iteration. Section 3 is a generated projection from the reducer registry.
- **Protection:** Shared state with explicit ownership boundaries. Orchestrator validates consistency on resume.

### Question Injection Surface

Use `{spec_folder}/research/inbox.jsonl` to append external questions during an active run. Each line is one JSON object with:

- `id`: stable inbox record identifier
- `text`: question text to promote
- `source`: concrete source label, such as an angle bank entry, analyst strategy, or operator note
- `origin`: one of `angle-bank`, `analyst-strategy`, `frontier`, `operator`, or `legacy-import`
- `injectedAtIteration`: iteration number when the question was introduced
- `promotedQuestionId`: promoted registry question id, or `null` until promotion

The reducer reads the inbox on every reduce step and carries `origin` into the question registry and dashboard badges. Direct edits to Section 3 still work as a compatibility path, but they are attributed as `legacy-import`.

Question ownership is explicit:

- Inbox rows are immutable input.
- The reducer registry is canonical question state.
- Section 3 is rendered only from the registry view.

When an inbox row targets an existing registry question but carries different text, the reducer keeps the registry value, records `operatorDecision: needs_decision`, and appends a `question_conflict` event with both `inboxValue` and `registryValue`.

---

## 2. TOPIC
Find bugs, drift and issues in all logic, skills and work changed since v4.1.0.0 (git range v4.1.0.0..HEAD)

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [x] Q1: Does the changed system-deep-loop runtime (dispatch, fan-out, convergence, append gateway, lock, reducer) hold logic bugs, or disagree with its workflow YAML and reference docs?
- [x] Q2: Does the changed system-skill-advisor (scorer, hooks, brief policy, embedding-lane removal) hold routing bugs or drift between code, hook docs and AGENTS.md Gate 2?
- [x] Q3: Do the changed mcp-browser-use, mcp-tooling, cli-external-orchestration and cli-orca modes hold broken paths, registry or hub-router drift, or executor builder bugs?
- [ ] Q4: Do the changed system-spec-kit runtime and hooks (decision-capture, session-handover, cli-dispatch, overlay-guard, git hooks) hold logic bugs or doc drift against what v4.2.0.0 claims?
- [ ] Q5: Do the doctor commands and skill, sk-doc, sk-code, sk-git, runtime mirrors, CI workflows and the v4.2.0.0 changelog agree with the code they describe?

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS
- No fixes in this run: findings only, each with file:line evidence.
- Not re-reporting issues already fixed on main (commits 4868ed36a21, 20af8368832, 6be8dac6251, 035c9dd6bdd) unless the fix is incomplete.
- Spec-folder content under specs/ is evidence only, never a target.

---

## 5. STOP CONDITIONS
- Stop policy max-iterations: run all 10 iterations; convergence is telemetry only.
- Duration budget: 120 minutes from createdAt.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- Q1: Does the changed system-deep-loop runtime (dispatch, fan-out, convergence, append gateway, lock, reducer) hold logic bugs, or disagree with its workflow YAML and reference docs?
- Q2: Does the changed system-skill-advisor (scorer, hooks, brief policy, embedding-lane removal) hold routing bugs or drift between code, hook docs and AGENTS.md Gate 2?
- Q3: Do the changed mcp-browser-use, mcp-tooling, cli-external-orchestration and cli-orca modes hold broken paths, registry or hub-router drift, or executor builder bugs?

<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- Following the unreadable-identity branch through classification, fallback signaling, survivor detection, and ledger closure exposed a gap across three stages. (iteration 1)
- comparing the registry, strategy, iteration record, and narrative exposed a status mismatch that was not visible in the code-only trace. (iteration 2)
- following the Pi adapter's concrete call into the shared handler exposed a missing identity field that makes both receipt paths unreachable. (iteration 3)
- comparing the canonical answer text with the reducer's exact normalized comparison identified why a previously answered question stayed open. (iteration 4)
- resolving every declared resource against its owning hub root gave a direct answer to the remaining broken-path question; reading the consumer alongside the current registry confirmed the active field contract. (iteration 5)
- comparing the hook's own recovery instructions with the installer and canonical README exposed a concrete failure for global `core.hooksPath` users. (iteration 6)
- reading the validator predicate alongside its rejection test exposed a lower-case sentence boundary that neither condition catches. (iteration 7)
- tracing the pre-push return-code branch into the sweep command exposed the concrete exit-2 path that the README summary omits. (iteration 8)
- reading the mirror crosswalk beside all three relevant workflows showed which CI job owns each generated mirror family. (iteration 9)
- comparing the route example with the actual stdin reader and a harmless shell probe exposed a delimiter edge case that prose about quoting did not cover. (iteration 10)

<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- The question-field review did not yield a defect because the prompt and reducer agree on exact matching. (iteration 1)
- the current packet does not identify which imported event established Q1's resolved state; tracing the legacy-import source is still needed. (iteration 2)
- dynamic Pi behavior was not exercised; static control flow was sufficient to confirm the missing session identity. (iteration 3)
- static hub files did not establish runtime route reachability or cover a shared executor builder outside the changed paths. (iteration 4)
- no compiled route invocation was made, so this pass establishes path existence and static consumer alignment, not an end-to-end routing result. (iteration 5)
- Q4 spans more changed runtime and hook code than this focused pass could fully inspect. (iteration 6)
- Q4 spans more runtime adapters and Git hook gates than this pass sampled. (iteration 7)
- an initial malformed search expression and an incorrect candidate file path produced no usable evidence; direct reads of the actual source files resolved both. (iteration 8)
- this bounded pass did not reach the sk-doc and sk-code implementation paths, so it cannot close the broad Q5 question. (iteration 9)
- this bounded pass did not inspect every doctor command or every runtime-mirror and CI gate, so Q5 cannot close. (iteration 10)

<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### A first read-only helper assumed the relocation ledger had an applied array and exited 1. The table was re-read using its actual schema; no artifact was changed. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: A first read-only helper assumed the relocation ledger had an applied array and exited 1. The table was re-read using its actual schema; no artifact was changed.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A first read-only helper assumed the relocation ledger had an applied array and exited 1. The table was re-read using its actual schema; no artifact was changed.

### A suspected gap caused by treating `agent-mirror-sync.yml` as the only CI mirror gate was not confirmed; the other reviewed workflows run the generated/runtime mirror checks. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: A suspected gap caused by treating `agent-mirror-sync.yml` as the only CI mirror gate was not confirmed; the other reviewed workflows run the generated/runtime mirror checks.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A suspected gap caused by treating `agent-mirror-sync.yml` as the only CI mirror gate was not confirmed; the other reviewed workflows run the generated/runtime mirror checks.

### No additional defect was confirmed in the sampled handover prepare/arm/relaunch/claim transitions. This is limited to those paths, not a full review of every runtime adapter. [SOURCE: .skilled/hooks/session-handover/lib/relaunch-core.cjs:1594] [SOURCE: .skilled/hooks/session-handover/lib/relaunch-core.cjs:1648] [SOURCE: .skilled/hooks/session-handover/lib/relaunch-core.cjs:1909] [SOURCE: .skilled/hooks/session-handover/lib/relaunch-core.cjs:1998] -- BLOCKED (iteration 7, 1 attempts)
- What was tried: No additional defect was confirmed in the sampled handover prepare/arm/relaunch/claim transitions. This is limited to those paths, not a full review of every runtime adapter. [SOURCE: .skilled/hooks/session-handover/lib/relaunch-core.cjs:1594] [SOURCE: .skilled/hooks/session-handover/lib/relaunch-core.cjs:1648] [SOURCE: .skilled/hooks/session-handover/lib/relaunch-core.cjs:1909] [SOURCE: .skilled/hooks/session-handover/lib/relaunch-core.cjs:1998]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No additional defect was confirmed in the sampled handover prepare/arm/relaunch/claim transitions. This is limited to those paths, not a full review of every runtime adapter. [SOURCE: .skilled/hooks/session-handover/lib/relaunch-core.cjs:1594] [SOURCE: .skilled/hooks/session-handover/lib/relaunch-core.cjs:1648] [SOURCE: .skilled/hooks/session-handover/lib/relaunch-core.cjs:1909] [SOURCE: .skilled/hooks/session-handover/lib/relaunch-core.cjs:1998]

### No additional defect was confirmed in the sampled pre-commit trust and comment-hygiene gate paths. This is not a conclusion about every Git hook or gate. [SOURCE: .skilled/scripts/git-hooks/pre-commit:36] [SOURCE: .skilled/scripts/git-hooks/pre-commit:63] [SOURCE: .skilled/scripts/git-hooks/pre-commit:199] [SOURCE: .skilled/scripts/git-hooks/pre-commit:209] -- BLOCKED (iteration 7, 1 attempts)
- What was tried: No additional defect was confirmed in the sampled pre-commit trust and comment-hygiene gate paths. This is not a conclusion about every Git hook or gate. [SOURCE: .skilled/scripts/git-hooks/pre-commit:36] [SOURCE: .skilled/scripts/git-hooks/pre-commit:63] [SOURCE: .skilled/scripts/git-hooks/pre-commit:199] [SOURCE: .skilled/scripts/git-hooks/pre-commit:209]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No additional defect was confirmed in the sampled pre-commit trust and comment-hygiene gate paths. This is not a conclusion about every Git hook or gate. [SOURCE: .skilled/scripts/git-hooks/pre-commit:36] [SOURCE: .skilled/scripts/git-hooks/pre-commit:63] [SOURCE: .skilled/scripts/git-hooks/pre-commit:199] [SOURCE: .skilled/scripts/git-hooks/pre-commit:209]

### No additional defect was confirmed in the sampled validator, rename, quality-router or sk-git paths. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: No additional defect was confirmed in the sampled validator, rename, quality-router or sk-git paths.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No additional defect was confirmed in the sampled validator, rename, quality-router or sk-git paths.

### No conflict was found between the reviewed hook mechanics and AGENTS.md Gate 2 policy. Gate 2 gives the surfaced hook brief priority and names the direct advisor call as the fallback; the hook reference describes how the brief is produced and delivered. [SOURCE: AGENTS.md:63] [SOURCE: AGENTS.md:68] [SOURCE: .skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md:55] [SOURCE: .skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md:59] -- BLOCKED (iteration 3, 1 attempts)
- What was tried: No conflict was found between the reviewed hook mechanics and AGENTS.md Gate 2 policy. Gate 2 gives the surfaced hook brief priority and names the direct advisor call as the fallback; the hook reference describes how the brief is produced and delivered. [SOURCE: AGENTS.md:63] [SOURCE: AGENTS.md:68] [SOURCE: .skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md:55] [SOURCE: .skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md:59]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No conflict was found between the reviewed hook mechanics and AGENTS.md Gate 2 policy. Gate 2 gives the surfaced hook brief priority and names the direct advisor call as the fallback; the hook reference describes how the brief is produced and delivered. [SOURCE: AGENTS.md:63] [SOURCE: AGENTS.md:68] [SOURCE: .skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md:55] [SOURCE: .skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md:59]

### No duplicate append or stale-head retry defect was confirmed in the inspected append-gateway path. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: No duplicate append or stale-head retry defect was confirmed in the inspected append-gateway path.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No duplicate append or stale-head retry defect was confirmed in the inspected append-gateway path.

### No field-shape mismatch was found between the current CLI mode registry and the executor consumer. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: No field-shape mismatch was found between the current CLI mode registry and the executor consumer.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No field-shape mismatch was found between the current CLI mode registry and the executor consumer.

### No independent retry-budget defect was confirmed in the inspected path: orphan requeues consume retry credit, and stopped lineages are terminal. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: No independent retry-budget defect was confirmed in the inspected path: orphan requeues consume retry credit, and stopped lineages are terminal.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No independent retry-budget defect was confirmed in the inspected path: orphan requeues consume retry credit, and stopped lineages are terminal.

### No missing or broken resource path was found among the 23 declarations checked. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: No missing or broken resource path was found among the 23 declarations checked.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No missing or broken resource path was found among the 23 declarations checked.

### No new dispatch-wrapper defect was confirmed in the inspected CLI path. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: No new dispatch-wrapper defect was confirmed in the inspected CLI path.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No new dispatch-wrapper defect was confirmed in the inspected CLI path.

### No separate issue was confirmed in the sampled OpenCode plugin entrypoint or shared session reader. This is a bounded sample, not a clean bill of health for every session-handover adapter. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: No separate issue was confirmed in the sampled OpenCode plugin entrypoint or shared session reader. This is a bounded sample, not a clean bill of health for every session-handover adapter.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No separate issue was confirmed in the sampled OpenCode plugin entrypoint or shared session reader. This is a bounded sample, not a clean bill of health for every session-handover adapter.

### No version or mode-key mismatch was found between the current registry and hub-router manifests for `mcp-browser-use`, `mcp-tooling` and `cli-external-orchestration`. The moved Chrome DevTools and Aside modes are listed under `mcp-browser-use`, and absent from `mcp-tooling`'s current registry/router. [SOURCE: .skilled/skills/mcp-browser-use/mode-registry.json:3] [SOURCE: .skilled/skills/mcp-browser-use/hub-router.json:3] [SOURCE: .skilled/skills/mcp-tooling/mode-registry.json:3] [SOURCE: .skilled/skills/mcp-tooling/hub-router.json:3] -- BLOCKED (iteration 4, 1 attempts)
- What was tried: No version or mode-key mismatch was found between the current registry and hub-router manifests for `mcp-browser-use`, `mcp-tooling` and `cli-external-orchestration`. The moved Chrome DevTools and Aside modes are listed under `mcp-browser-use`, and absent from `mcp-tooling`'s current registry/router. [SOURCE: .skilled/skills/mcp-browser-use/mode-registry.json:3] [SOURCE: .skilled/skills/mcp-browser-use/hub-router.json:3] [SOURCE: .skilled/skills/mcp-tooling/mode-registry.json:3] [SOURCE: .skilled/skills/mcp-tooling/hub-router.json:3]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No version or mode-key mismatch was found between the current registry and hub-router manifests for `mcp-browser-use`, `mcp-tooling` and `cli-external-orchestration`. The moved Chrome DevTools and Aside modes are listed under `mcp-browser-use`, and absent from `mcp-tooling`'s current registry/router. [SOURCE: .skilled/skills/mcp-browser-use/mode-registry.json:3] [SOURCE: .skilled/skills/mcp-browser-use/hub-router.json:3] [SOURCE: .skilled/skills/mcp-tooling/mode-registry.json:3] [SOURCE: .skilled/skills/mcp-tooling/hub-router.json:3]

### None. -- BLOCKED (iteration 7, 2 attempts)
- What was tried: None.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: None.

### None. The sk-doc implementation, sk-code routing and quality surfaces, and the remaining sk-git paths still offer productive follow-up work. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: None. The sk-doc implementation, sk-code routing and quality surfaces, and the remaining sk-git paths still offer productive follow-up work.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: None. The sk-doc implementation, sk-code routing and quality surfaces, and the remaining sk-git paths still offer productive follow-up work.

### The changed sk-doc validator’s required result marker is present in all 57 discovered playbook roots; no uncovered package was found in this scan. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: The changed sk-doc validator’s required result marker is present in all 57 discovered playbook roots; no uncovered package was found in this scan.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The changed sk-doc validator’s required result marker is present in all 57 discovered playbook roots; no uncovered package was found in this scan.

### The current `keyQuestions` and `answeredQuestions` wording is consistent with the reducer's exact question matching; no defect confirmed in that contract. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: The current `keyQuestions` and `answeredQuestions` wording is consistent with the reducer's exact question matching; no defect confirmed in that contract.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The current `keyQuestions` and `answeredQuestions` wording is consistent with the reducer's exact question matching; no defect confirmed in that contract.

### The current CLI registry/router manifests list eight CLI modes and do not retain `cli-orca`. The changed OpenCode setup helper is an installer/checker, not a dispatch-command builder. Static review found no executor-builder defect; runtime reachability remains unchecked. [SOURCE: .skilled/skills/cli-external-orchestration/mode-registry.json:3] [SOURCE: .skilled/skills/cli-external-orchestration/mode-registry.json:19] [SOURCE: .skilled/skills/cli-external-orchestration/mode-registry.json:241] [SOURCE: .skilled/skills/cli-external-orchestration/hub-router.json:3] [SOURCE: .skilled/skills/cli-external-orchestration/hub-router.json:34] [SOURCE: .skilled/skills/cli-external-orchestration/hub-router.json:104] [SOURCE: .skilled/skills/cli-external-orchestration/cli-opencode/scripts/opencode-setup.sh:8] [SOURCE: .skilled/skills/cli-external-orchestration/cli-opencode/scripts/opencode-setup.sh:28] -- BLOCKED (iteration 4, 1 attempts)
- What was tried: The current CLI registry/router manifests list eight CLI modes and do not retain `cli-orca`. The changed OpenCode setup helper is an installer/checker, not a dispatch-command builder. Static review found no executor-builder defect; runtime reachability remains unchecked. [SOURCE: .skilled/skills/cli-external-orchestration/mode-registry.json:3] [SOURCE: .skilled/skills/cli-external-orchestration/mode-registry.json:19] [SOURCE: .skilled/skills/cli-external-orchestration/mode-registry.json:241] [SOURCE: .skilled/skills/cli-external-orchestration/hub-router.json:3] [SOURCE: .skilled/skills/cli-external-orchestration/hub-router.json:34] [SOURCE: .skilled/skills/cli-external-orchestration/hub-router.json:104] [SOURCE: .skilled/skills/cli-external-orchestration/cli-opencode/scripts/opencode-setup.sh:8] [SOURCE: .skilled/skills/cli-external-orchestration/cli-opencode/scripts/opencode-setup.sh:28]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The current CLI registry/router manifests list eight CLI modes and do not retain `cli-orca`. The changed OpenCode setup helper is an installer/checker, not a dispatch-command builder. Static review found no executor-builder defect; runtime reachability remains unchecked. [SOURCE: .skilled/skills/cli-external-orchestration/mode-registry.json:3] [SOURCE: .skilled/skills/cli-external-orchestration/mode-registry.json:19] [SOURCE: .skilled/skills/cli-external-orchestration/mode-registry.json:241] [SOURCE: .skilled/skills/cli-external-orchestration/hub-router.json:3] [SOURCE: .skilled/skills/cli-external-orchestration/hub-router.json:34] [SOURCE: .skilled/skills/cli-external-orchestration/hub-router.json:104] [SOURCE: .skilled/skills/cli-external-orchestration/cli-opencode/scripts/opencode-setup.sh:8] [SOURCE: .skilled/skills/cli-external-orchestration/cli-opencode/scripts/opencode-setup.sh:28]

### The iteration 4 registry/version comparison was not repeated because strategy marks it exhausted. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: The iteration 4 registry/version comparison was not repeated because strategy marks it exhausted.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The iteration 4 registry/version comparison was not repeated because strategy marks it exhausted.

### The overlay guard's suggested `status` command is accepted by the overlay engine CLI; no command-shape drift was confirmed. [SOURCE: .skilled/hooks/overlay-guard/lib/overlay-guard.cjs:59-63] [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:23-26] [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:9267-9316] [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:9344-9348] -- BLOCKED (iteration 6, 1 attempts)
- What was tried: The overlay guard's suggested `status` command is accepted by the overlay engine CLI; no command-shape drift was confirmed. [SOURCE: .skilled/hooks/overlay-guard/lib/overlay-guard.cjs:59-63] [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:23-26] [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:9267-9316] [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:9344-9348]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The overlay guard's suggested `status` command is accepted by the overlay engine CLI; no command-shape drift was confirmed. [SOURCE: .skilled/hooks/overlay-guard/lib/overlay-guard.cjs:59-63] [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:23-26] [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:9267-9316] [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:9344-9348]

### The previously reviewed handover transition sequence was marked exhausted in the prior iteration and was not repeated. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: The previously reviewed handover transition sequence was marked exhausted in the prior iteration and was not repeated.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The previously reviewed handover transition sequence was marked exhausted in the prior iteration and was not repeated.

### The removed semantic lane did not leave a mismatch in the live lane registry, active README or architecture description. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: The removed semantic lane did not leave a mismatch in the live lane registry, active README or architecture description.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The removed semantic lane did not leave a mismatch in the live lane registry, active README or architecture description.

### The reviewed changed CLI helper did not contain executor construction logic, so it yielded no executor-builder defect. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: The reviewed changed CLI helper did not contain executor construction logic, so it yielded no executor-builder defect.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The reviewed changed CLI helper did not contain executor construction logic, so it yielded no executor-builder defect.

### The reviewed CLI dispatch path applies every rule to an unresolved OpenCode version, matching the release description; no version-gate drift was confirmed. [SOURCE: .skilled/hooks/cli-dispatch/lib/dispatch-rule-checks.mjs:1119-1145] [SOURCE: .skilled/changelog/skilled/v4.2.0.0.md:516-522] -- BLOCKED (iteration 6, 1 attempts)
- What was tried: The reviewed CLI dispatch path applies every rule to an unresolved OpenCode version, matching the release description; no version-gate drift was confirmed. [SOURCE: .skilled/hooks/cli-dispatch/lib/dispatch-rule-checks.mjs:1119-1145] [SOURCE: .skilled/changelog/skilled/v4.2.0.0.md:516-522]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The reviewed CLI dispatch path applies every rule to an unresolved OpenCode version, matching the release description; no version-gate drift was confirmed. [SOURCE: .skilled/hooks/cli-dispatch/lib/dispatch-rule-checks.mjs:1119-1145] [SOURCE: .skilled/changelog/skilled/v4.2.0.0.md:516-522]

### The reviewed OpenCode decision-capture sweep reads `session_v2` and `session_message`, consistent with the release's OpenCode 2-only support claim; no version-layout mismatch was confirmed. [SOURCE: .skilled/hooks/decision-capture/bin/sweep-opencode.mjs:40-43] [SOURCE: .skilled/hooks/decision-capture/bin/sweep-opencode.mjs:128-145] [SOURCE: .skilled/changelog/skilled/v4.2.0.0.md:509-522] -- BLOCKED (iteration 6, 1 attempts)
- What was tried: The reviewed OpenCode decision-capture sweep reads `session_v2` and `session_message`, consistent with the release's OpenCode 2-only support claim; no version-layout mismatch was confirmed. [SOURCE: .skilled/hooks/decision-capture/bin/sweep-opencode.mjs:40-43] [SOURCE: .skilled/hooks/decision-capture/bin/sweep-opencode.mjs:128-145] [SOURCE: .skilled/changelog/skilled/v4.2.0.0.md:509-522]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The reviewed OpenCode decision-capture sweep reads `session_v2` and `session_message`, consistent with the release's OpenCode 2-only support claim; no version-layout mismatch was confirmed. [SOURCE: .skilled/hooks/decision-capture/bin/sweep-opencode.mjs:40-43] [SOURCE: .skilled/hooks/decision-capture/bin/sweep-opencode.mjs:128-145] [SOURCE: .skilled/changelog/skilled/v4.2.0.0.md:509-522]

### The sampled adapter entrypoint/storage path exposed no new discrepancy requiring another pass in this iteration. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: The sampled adapter entrypoint/storage path exposed no new discrepancy requiring another pass in this iteration.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The sampled adapter entrypoint/storage path exposed no new discrepancy requiring another pass in this iteration.

### The sampled citation-rename redirect chain reaches a tracked path; no stale target was confirmed in that chain. [SOURCE: .skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs:349-361] [SOURCE: .skilled/skills/sk-doc/shared/scripts/cite-drift-redirects.json:5] -- BLOCKED (iteration 10, 1 attempts)
- What was tried: The sampled citation-rename redirect chain reaches a tracked path; no stale target was confirmed in that chain. [SOURCE: .skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs:349-361] [SOURCE: .skilled/skills/sk-doc/shared/scripts/cite-drift-redirects.json:5]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The sampled citation-rename redirect chain reaches a tracked path; no stale target was confirmed in that chain. [SOURCE: .skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs:349-361] [SOURCE: .skilled/skills/sk-doc/shared/scripts/cite-drift-redirects.json:5]

### The sampled sk-git gate refusal and provisioning behavior matched the inspected contracts. [SOURCE: .skilled/skills/sk-git/feature-catalog/workflow-playbooks/message-contract-enforcement.md:31-46] [SOURCE: .skilled/skills/sk-git/scripts/worktree-naming.sh:796-815] [SOURCE: .skilled/changelog/skilled/v4.2.0.0.md:829-833] -- BLOCKED (iteration 10, 1 attempts)
- What was tried: The sampled sk-git gate refusal and provisioning behavior matched the inspected contracts. [SOURCE: .skilled/skills/sk-git/feature-catalog/workflow-playbooks/message-contract-enforcement.md:31-46] [SOURCE: .skilled/skills/sk-git/scripts/worktree-naming.sh:796-815] [SOURCE: .skilled/changelog/skilled/v4.2.0.0.md:829-833]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The sampled sk-git gate refusal and provisioning behavior matched the inspected contracts. [SOURCE: .skilled/skills/sk-git/feature-catalog/workflow-playbooks/message-contract-enforcement.md:31-46] [SOURCE: .skilled/skills/sk-git/scripts/worktree-naming.sh:796-815] [SOURCE: .skilled/changelog/skilled/v4.2.0.0.md:829-833]

### The semantic embedding-lane removal does not show active scorer or documentation drift in the inspected surface. The live registry lists four active lanes, and the README and architecture describe the same four. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/lane-registry.ts:8] [SOURCE: .skilled/skills/system-skill-advisor/README.md:38] [SOURCE: .skilled/skills/system-skill-advisor/ARCHITECTURE.md:110] [SOURCE: .skilled/skills/system-skill-advisor/ARCHITECTURE.md:126] -- BLOCKED (iteration 3, 1 attempts)
- What was tried: The semantic embedding-lane removal does not show active scorer or documentation drift in the inspected surface. The live registry lists four active lanes, and the README and architecture describe the same four. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/lane-registry.ts:8] [SOURCE: .skilled/skills/system-skill-advisor/README.md:38] [SOURCE: .skilled/skills/system-skill-advisor/ARCHITECTURE.md:110] [SOURCE: .skilled/skills/system-skill-advisor/ARCHITECTURE.md:126]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The semantic embedding-lane removal does not show active scorer or documentation drift in the inspected surface. The live registry lists four active lanes, and the README and architecture describe the same four. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/lane-registry.ts:8] [SOURCE: .skilled/skills/system-skill-advisor/README.md:38] [SOURCE: .skilled/skills/system-skill-advisor/ARCHITECTURE.md:110] [SOURCE: .skilled/skills/system-skill-advisor/ARCHITECTURE.md:126]

### The six-command move described in the release changelog does not conflict with the current skill's claim to own every doctor command. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: The six-command move described in the release changelog does not conflict with the current skill's claim to own every doctor command.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The six-command move described in the release changelog does not conflict with the current skill's claim to own every doctor command.

### The sk-code compiled-route CLI supports the documented stdin option; the shell wrapper is where the delimiter issue sits. [SOURCE: .skilled/bin/compiled-route.cjs:34-59] -- BLOCKED (iteration 10, 1 attempts)
- What was tried: The sk-code compiled-route CLI supports the documented stdin option; the shell wrapper is where the delimiter issue sits. [SOURCE: .skilled/bin/compiled-route.cjs:34-59]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The sk-code compiled-route CLI supports the documented stdin option; the shell wrapper is where the delimiter issue sits. [SOURCE: .skilled/bin/compiled-route.cjs:34-59]

### The static manifests did not reveal a registry/router key or version drift. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: The static manifests did not reveal a registry/router key or version drift.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The static manifests did not reveal a registry/router key or version drift.

### The two-level working-tree sub-track reader and validator use matching depth bounds in the inspected functions. No mismatch was confirmed in those excerpts. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/lib/track-roots.mjs:122] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/lib/track-roots.mjs:161] [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:241] [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:248] -- BLOCKED (iteration 7, 1 attempts)
- What was tried: The two-level working-tree sub-track reader and validator use matching depth bounds in the inspected functions. No mismatch was confirmed in those excerpts. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/lib/track-roots.mjs:122] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/lib/track-roots.mjs:161] [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:241] [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:248]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The two-level working-tree sub-track reader and validator use matching depth bounds in the inspected functions. No mismatch was confirmed in those excerpts. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/lib/track-roots.mjs:122] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/lib/track-roots.mjs:161] [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:241] [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:248]

### The user-supplied Gate 2 policy is not contradicted by the hook behavior description reviewed here. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: The user-supplied Gate 2 policy is not contradicted by the hook behavior description reviewed here.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The user-supplied Gate 2 policy is not contradicted by the hook behavior description reviewed here.

<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- The current `keyQuestions` and `answeredQuestions` wording is consistent with the reducer's exact question matching; no defect confirmed in that contract. (iteration 1)
- No duplicate append or stale-head retry defect was confirmed in the inspected append-gateway path. (iteration 2)
- No independent retry-budget defect was confirmed in the inspected path: orphan requeues consume retry credit, and stopped lineages are terminal. (iteration 2)
- No new dispatch-wrapper defect was confirmed in the inspected CLI path. (iteration 2)
- No conflict was found between the reviewed hook mechanics and AGENTS.md Gate 2 policy. Gate 2 gives the surfaced hook brief priority and names the direct advisor call as the fallback; the hook reference describes how the brief is produced and delivered. [SOURCE: AGENTS.md:63] [SOURCE: AGENTS.md:68] [SOURCE: .skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md:55] [SOURCE: .skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md:59] (iteration 3)
- The removed semantic lane did not leave a mismatch in the live lane registry, active README or architecture description. (iteration 3)
- The semantic embedding-lane removal does not show active scorer or documentation drift in the inspected surface. The live registry lists four active lanes, and the README and architecture describe the same four. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/lane-registry.ts:8] [SOURCE: .skilled/skills/system-skill-advisor/README.md:38] [SOURCE: .skilled/skills/system-skill-advisor/ARCHITECTURE.md:110] [SOURCE: .skilled/skills/system-skill-advisor/ARCHITECTURE.md:126] (iteration 3)
- The user-supplied Gate 2 policy is not contradicted by the hook behavior description reviewed here. (iteration 3)
- No version or mode-key mismatch was found between the current registry and hub-router manifests for `mcp-browser-use`, `mcp-tooling` and `cli-external-orchestration`. The moved Chrome DevTools and Aside modes are listed under `mcp-browser-use`, and absent from `mcp-tooling`'s current registry/router. [SOURCE: .skilled/skills/mcp-browser-use/mode-registry.json:3] [SOURCE: .skilled/skills/mcp-browser-use/hub-router.json:3] [SOURCE: .skilled/skills/mcp-tooling/mode-registry.json:3] [SOURCE: .skilled/skills/mcp-tooling/hub-router.json:3] (iteration 4)
- The current CLI registry/router manifests list eight CLI modes and do not retain `cli-orca`. The changed OpenCode setup helper is an installer/checker, not a dispatch-command builder. Static review found no executor-builder defect; runtime reachability remains unchecked. [SOURCE: .skilled/skills/cli-external-orchestration/mode-registry.json:3] [SOURCE: .skilled/skills/cli-external-orchestration/mode-registry.json:19] [SOURCE: .skilled/skills/cli-external-orchestration/mode-registry.json:241] [SOURCE: .skilled/skills/cli-external-orchestration/hub-router.json:3] [SOURCE: .skilled/skills/cli-external-orchestration/hub-router.json:34] [SOURCE: .skilled/skills/cli-external-orchestration/hub-router.json:104] [SOURCE: .skilled/skills/cli-external-orchestration/cli-opencode/scripts/opencode-setup.sh:8] [SOURCE: .skilled/skills/cli-external-orchestration/cli-opencode/scripts/opencode-setup.sh:28] (iteration 4)
- The reviewed changed CLI helper did not contain executor construction logic, so it yielded no executor-builder defect. (iteration 4)
- The static manifests did not reveal a registry/router key or version drift. (iteration 4)
- No field-shape mismatch was found between the current CLI mode registry and the executor consumer. (iteration 5)
- No missing or broken resource path was found among the 23 declarations checked. (iteration 5)
- None. (iteration 5)
- The iteration 4 registry/version comparison was not repeated because strategy marks it exhausted. (iteration 5)
- The overlay guard's suggested `status` command is accepted by the overlay engine CLI; no command-shape drift was confirmed. [SOURCE: .skilled/hooks/overlay-guard/lib/overlay-guard.cjs:59-63] [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:23-26] [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:9267-9316] [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:9344-9348] (iteration 6)
- The reviewed CLI dispatch path applies every rule to an unresolved OpenCode version, matching the release description; no version-gate drift was confirmed. [SOURCE: .skilled/hooks/cli-dispatch/lib/dispatch-rule-checks.mjs:1119-1145] [SOURCE: .skilled/changelog/skilled/v4.2.0.0.md:516-522] (iteration 6)
- The reviewed OpenCode decision-capture sweep reads `session_v2` and `session_message`, consistent with the release's OpenCode 2-only support claim; no version-layout mismatch was confirmed. [SOURCE: .skilled/hooks/decision-capture/bin/sweep-opencode.mjs:40-43] [SOURCE: .skilled/hooks/decision-capture/bin/sweep-opencode.mjs:128-145] [SOURCE: .skilled/changelog/skilled/v4.2.0.0.md:509-522] (iteration 6)
- No additional defect was confirmed in the sampled handover prepare/arm/relaunch/claim transitions. This is limited to those paths, not a full review of every runtime adapter. [SOURCE: .skilled/hooks/session-handover/lib/relaunch-core.cjs:1594] [SOURCE: .skilled/hooks/session-handover/lib/relaunch-core.cjs:1648] [SOURCE: .skilled/hooks/session-handover/lib/relaunch-core.cjs:1909] [SOURCE: .skilled/hooks/session-handover/lib/relaunch-core.cjs:1998] (iteration 7)
- No additional defect was confirmed in the sampled pre-commit trust and comment-hygiene gate paths. This is not a conclusion about every Git hook or gate. [SOURCE: .skilled/scripts/git-hooks/pre-commit:36] [SOURCE: .skilled/scripts/git-hooks/pre-commit:63] [SOURCE: .skilled/scripts/git-hooks/pre-commit:199] [SOURCE: .skilled/scripts/git-hooks/pre-commit:209] (iteration 7)
- The two-level working-tree sub-track reader and validator use matching depth bounds in the inspected functions. No mismatch was confirmed in those excerpts. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/lib/track-roots.mjs:122] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/lib/track-roots.mjs:161] [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:241] [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:248] (iteration 7)
- No separate issue was confirmed in the sampled OpenCode plugin entrypoint or shared session reader. This is a bounded sample, not a clean bill of health for every session-handover adapter. (iteration 8)
- The previously reviewed handover transition sequence was marked exhausted in the prior iteration and was not repeated. (iteration 8)
- The sampled adapter entrypoint/storage path exposed no new discrepancy requiring another pass in this iteration. (iteration 8)
- A suspected gap caused by treating `agent-mirror-sync.yml` as the only CI mirror gate was not confirmed; the other reviewed workflows run the generated/runtime mirror checks. (iteration 9)
- None. The sk-doc implementation, sk-code routing and quality surfaces, and the remaining sk-git paths still offer productive follow-up work. (iteration 9)
- The six-command move described in the release changelog does not conflict with the current skill's claim to own every doctor command. (iteration 9)
- A first read-only helper assumed the relocation ledger had an applied array and exited 1. The table was re-read using its actual schema; no artifact was changed. (iteration 10)
- No additional defect was confirmed in the sampled validator, rename, quality-router or sk-git paths. (iteration 10)
- The changed sk-doc validator’s required result marker is present in all 57 discovered playbook roots; no uncovered package was found in this scan. (iteration 10)
- The sampled citation-rename redirect chain reaches a tracked path; no stale target was confirmed in that chain. [SOURCE: .skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs:349-361] [SOURCE: .skilled/skills/sk-doc/shared/scripts/cite-drift-redirects.json:5] (iteration 10)
- The sampled sk-git gate refusal and provisioning behavior matched the inspected contracts. [SOURCE: .skilled/skills/sk-git/feature-catalog/workflow-playbooks/message-contract-enforcement.md:31-46] [SOURCE: .skilled/skills/sk-git/scripts/worktree-naming.sh:796-815] [SOURCE: .skilled/changelog/skilled/v4.2.0.0.md:829-833] (iteration 10)
- The sk-code compiled-route CLI supports the documented stdin option; the shell wrapper is where the delimiter issue sits. [SOURCE: .skilled/bin/compiled-route.cjs:34-59] (iteration 10)

<!-- /ANCHOR:ruled-out-directions -->

---

<!-- ANCHOR:divergence-frontier -->
## 10A. SATURATED DIRECTIONS AND DIVERGENCE FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

<!-- /ANCHOR:divergence-frontier -->

---

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS
- Do the doctor commands and skill, sk-doc, sk-code, sk-git, runtime mirrors, CI workflows and the v4.2.0.0 changelog agree with the code they describe? (iteration 10)
- Do the changed system-spec-kit runtime and hooks (decision-capture, session-handover, cli-dispatch, overlay-guard, git hooks) hold logic bugs or doc drift against what v4.2.0.0 claims? (iteration 10)

<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
If the packet is extended, trace the remaining changed doctor commands and runtime-mirror/CI gates end to end, and verify a delimiter-safe transport for compiled routing.

<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT
Known context: a prior 10-iteration native run on this packet audited the v4.2.0.0 release and its fixes have landed. Its synthesis is archived at research_archive/20261126T112816Z/research.md; read it first so this run hunts net-new issues or incomplete fixes.

### Bounded Context Snapshot

- Source pointers: `git diff --name-only v4.1.0.0..HEAD -- . ':!specs'` (2289 files). Largest areas: .skilled/skills/system-deep-loop (601), system-skill-advisor (330), mcp-browser-use (322), system-spec-kit (165), cli-external-orchestration (122), commands/doctor (111), system-skilled-doctor (91), sk-doc (73), cli-orca (58), mcp-tooling (55), .opencode/plugins (55).
- Reuse candidates: .skilled/changelog/skilled/v4.2.0.0.md states what changed; each skill's SKILL.md, mode-registry.json and hub-router.json state the contract.
- Integration points: workflow YAML under .skilled/commands/*/assets, runtime mirrors under .claude/.codex/.vibe/.pi/.dsh, CI under .github/workflows.
- Constraints and risks: the range is large, so each iteration should pick one area and verify claims against code with file:line evidence.

resource-map.md not present; skipping coverage gate

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 10
- Convergence threshold: 0.05
- Per-iteration budget: 24 tool calls, 10 minutes
- Progressive synthesis: true (default)
- research/research.md ownership: workflow-owned canonical synthesis output
- Lifecycle branches: `new`, `resume`, `restart`, `completed-continue` through `--extend=N` and `--extend-minutes=M` (live)
- Deferred lifecycle branch: `fork` (not runtime-wired)
- Machine-owned sections: reducer controls Sections 3, 6, 7-11A, including Section 10A pivot lineage
- Question injection surface: `{spec_folder}/research/inbox.jsonl`
- Question conflict owner: reducer registry; `question_conflict` events surface inbox/registry disagreements for operator decision
- Canonical pause sentinel: `research/.deep-research-pause`
- Capability matrix: `.skilled/skills/system-deep-loop/deep-research/assets/runtime-capabilities.json`
- Capability matrix doc: `.skilled/skills/system-deep-loop/deep-research/references/guides/capability-matrix.md`
- Capability resolver: `.skilled/skills/system-deep-loop/deep-research/scripts/runtime-capabilities.cjs`
- Current generation: 3
- Started: 2026-11-26T11:28:30Z
