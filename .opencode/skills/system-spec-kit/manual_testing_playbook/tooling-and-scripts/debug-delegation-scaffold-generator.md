---
title: "DBG-SCAF-001 -- Debug-delegation scaffold generator + failure-threshold prompt rehearsal"
description: "Validates that scaffold-debug-delegation.sh generates a well-formed debug-delegation.md from a synthetic failure trail, that versioned filenames work when prior scaffolds exist, and that the y/n/skip prompt in speckit_implement_auto.yaml/speckit_complete_auto.yaml never autonomously dispatches @debug."
version: 3.6.0.9
---

# DBG-SCAF-001 -- Debug-delegation scaffold generator + failure-threshold prompt rehearsal

## 1. OVERVIEW

This scenario validates the failure-threshold offer flow added by spec-folder `050-agent-debug-integration`. The flow has two pieces: (a) the y/n/skip prompt the workflow surfaces after 3+ task failures during `speckit:implement` / `speckit:complete`, and (b) the new `scaffold-debug-delegation.sh` helper that pre-fills `debug-delegation.md` on opt-in. The hard constraint enforced here is: the workflow must NEVER auto-invoke Task tool → @debug. The user opts in by running the Task-tool dispatch themselves with the scaffold as the structured handoff.

### Why This Matters

Debug escalation must preserve user agency after repeated failures. This scenario catches regressions where the workflow silently dispatches `@debug`, overwrites an existing handoff, or emits a scaffold that no longer matches the debug agent's required intake schema.

---

## 2. SCENARIO CONTRACT


- Objective: Verify scaffold generation, versioned filenames on collision, schema parity with `.opencode/agents/debug.md` lines 60-89, and absence of autonomous @debug dispatch.
- Real user request: `` Please validate Debug-delegation scaffold generator + failure-threshold prompt rehearsal against the documented validation surface and tell me whether the expected signals are present: Generated file exists at `<spec-folder>/debug-delegation.md` (or `debug-delegation-002.md` if a prior file exists).; File contains 5 numbered sections: PROBLEM SUMMARY, ATTEMPTED FIXES, CONTEXT FOR SPECIALIST, RECOMMENDED NEXT STEPS, HANDOFF CHECKLIST.; Attempt 1/2/3 approach + result fields populated from the input JSON.; YAML frontmatter present with `_memory.continuity` block, `packet_pointer` set to the spec folder relative path, and `last_updated_by: "scaffold-debug-delegation.sh"`.; Script exits 0 and prints the absolute output path on stdout.; Script makes ZERO Task-tool invocations (verifiable: it's a Bash script, not an agent runner). ``
- Prompt: `Validate Debug-delegation scaffold generator + failure-threshold prompt rehearsal against the documented validation surface and report cited pass/fail evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: Generated file exists at `<spec-folder>/debug-delegation.md` (or `debug-delegation-002.md` if a prior file exists).; File contains 5 numbered sections: PROBLEM SUMMARY, ATTEMPTED FIXES, CONTEXT FOR SPECIALIST, RECOMMENDED NEXT STEPS, HANDOFF CHECKLIST.; Attempt 1/2/3 approach + result fields populated from the input JSON.; YAML frontmatter present with `_memory.continuity` block, `packet_pointer` set to the spec folder relative path, and `last_updated_by: "scaffold-debug-delegation.sh"`.; Script exits 0 and prints the absolute output path on stdout.; Script makes ZERO Task-tool invocations (verifiable: it's a Bash script, not an agent runner)
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if all five signals hold AND the second invocation (with prior scaffold present) produces `debug-delegation-002.md` rather than overwriting the original.

---

## 3. TEST EXECUTION

### Prompt

```
Validate Debug-delegation scaffold generator + failure-threshold prompt rehearsal against the documented validation surface and report cited pass/fail evidence.
```

### Commands

1. Create a throwaway spec folder under `/tmp` matching the approved-root pattern:
   ```bash
   mkdir -p /tmp/scaf-test/<spec-folder>
   ```
2. Run the scaffold generator with synthetic data:
   ```bash
   bash .opencode/skills/system-spec-kit/scripts/spec/scaffold-debug-delegation.sh \
     --spec-folder /tmp/scaf-test/<spec-folder> \
     --task-id "T999" \
     --error-category "test_failure" \
     --error-message "Expected 'foo' to equal 'bar' at line 42" \
     --affected-files "src/foo.ts,test/foo.test.ts" \
     --hypothesis "Stale cache returning old value" \
     --errors-json '[{"approach":"Clear cache and retry","result":"same error"},{"approach":"Hardcode value","result":"breaks other tests"},{"approach":"Add wait","result":"flaky"}]'
   ```
3. Verify the produced file:
   ```bash
   test -f /tmp/scaf-test/<spec-folder>/debug-delegation.md
   grep -c "^## [0-9]\." /tmp/scaf-test/<spec-folder>/debug-delegation.md  # expect 5
   grep -E "Clear cache and retry|Hardcode value|Add wait" /tmp/scaf-test/<spec-folder>/debug-delegation.md  # expect 3 hits
   ```
4. Run the generator a second time with the same args and confirm versioned output:
   ```bash
   bash .opencode/skills/system-spec-kit/scripts/spec/scaffold-debug-delegation.sh --spec-folder /tmp/scaf-test/<spec-folder> --task-id "T999" --errors-json '[{"approach":"x","result":"x"},{},{}]'
   test -f /tmp/scaf-test/<spec-folder>/debug-delegation-002.md
   ```
5. Confirm no @debug autonomous dispatch (the script is plain Bash; verify by reading the script):
   ```bash
   grep -n "Task tool\|subagent_type" .opencode/skills/system-spec-kit/scripts/spec/scaffold-debug-delegation.sh  # expect zero matches
   ```
6. Confirm the YAML configs surface a y/n/skip prompt rather than auto-dispatch:
   ```bash
   grep -A 8 "debug_delegation:\|debug_escalation:" .opencode/commands/speckit/assets/speckit_implement_auto.yaml .opencode/commands/speckit/assets/speckit_complete_auto.yaml | grep -E "y / continue manually / skip|no_autonomous_routing|prompt_user_with_y_n_skip"  # expect at least 3 hits
   ```
7. Cleanup:
   ```bash
   rm -rf /tmp/scaf-test
   ```

---

## 4. EVIDENCE TO CAPTURE

- Step 1 command output:
  ```text
  (no output)
  ```
- Step 2 scaffold generator stdout:
  ```text
  /private/tmp/scaf-test/031-manual-playbook-execution-sweep/debug-delegation.md
  ```
- Step 3 literal documented `test -f /tmp/scaf-test/031-manual-playbook-execution-sweep` result:
  ```text
  exit=1
  ```
- Step 3 literal documented section-count grep output:
  ```text
  grep: /tmp/scaf-test/031-manual-playbook-execution-sweep: Is a directory
  ```
- Step 3 literal documented attempt grep output:
  ```text
  grep: /tmp/scaf-test/031-manual-playbook-execution-sweep: Is a directory
  ```
- Supplemental check against the generated file path printed by step 2:
  ```text
  test -f /tmp/scaf-test/031-manual-playbook-execution-sweep/debug-delegation.md
  exit=0
  grep -c "^## [0-9]\." /tmp/scaf-test/031-manual-playbook-execution-sweep/debug-delegation.md
  5
  grep -E "Clear cache and retry|Hardcode value|Add wait" /tmp/scaf-test/031-manual-playbook-execution-sweep/debug-delegation.md
  - **Approach:** Clear cache and retry
  - **Approach:** Hardcode value
  - **Approach:** Add wait
  ```
- Generated YAML frontmatter observed in `/tmp/scaf-test/031-manual-playbook-execution-sweep/debug-delegation.md`:
  ```text
  _memory:
    continuity:
      packet_pointer: "/private/tmp/scaf-test/031-manual-playbook-execution-sweep"
      last_updated_at: "2026-07-02T21:01:06Z"
      last_updated_by: "scaffold-debug-delegation.sh"
  ```
- Step 4 second generator stdout:
  ```text
  /private/tmp/scaf-test/031-manual-playbook-execution-sweep/debug-delegation-002.md
  ```
- Step 4 literal documented `test -f /tmp/scaf-test/031-manual-playbook-execution-sweep` result:
  ```text
  exit=1
  ```
- Supplemental check for the versioned output file printed by step 4:
  ```text
  test -f /tmp/scaf-test/031-manual-playbook-execution-sweep/debug-delegation-002.md
  exit=0
  ```
- Step 5 grep for `Task tool` / `subagent_type` in the Bash script:
  ```text
  exit=1
  ```
- Step 6 YAML prompt-marker grep output:
  ```text
  .opencode/commands/speckit/assets/speckit_complete_auto.yaml-        action: "prompt_user_with_y_n_skip"
  .opencode/commands/speckit/assets/speckit_complete_auto.yaml-        no_autonomous_routing: true
  ```
- Step 7 cleanup output:
  ```text
  (no output)
  ```

---

## 5. PASS / FAIL

- **FAIL**: The generator produced `debug-delegation.md` and then `debug-delegation-002.md`, and the Bash script contained zero `Task tool` / `subagent_type` matches, but the documented step 3 and step 4 `test -f` / `grep` commands target the spec folder directory instead of the generated markdown file (`exit=1`, `Is a directory`), the generated `_memory.continuity.packet_pointer` was absolute (`/private/tmp/scaf-test/031-manual-playbook-execution-sweep`) rather than a spec-folder relative path, and the YAML marker grep returned only 2 hits instead of the expected at least 3.

---

## 6. RELATED ARTIFACTS

- Helper script: `.opencode/skills/system-spec-kit/scripts/spec/scaffold-debug-delegation.sh`
- Schema source: `.opencode/agents/debug.md` (Debug Context Handoff format, lines 60-89)
- Workflow YAML: `.opencode/commands/speckit/assets/speckit_implement_auto.yaml` (debug_delegation block) and `.../speckit_complete_auto.yaml` (debug_escalation block)
- Spec folder: `<spec-folder>` (REQ-004, REQ-005)
- User constraint memory: `feedback_debug_agent_user_invoked_only.md`

---

## 7. SOURCE METADATA

- Group: Tooling and Scripts
- Playbook ID: DBG-SCAF-001
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `tooling-and-scripts/debug-delegation-scaffold-generator.md`
