---
title: "DBG-SCAF-001 -- Debug-delegation scaffold generator + failure-threshold prompt rehearsal"
description: "Validates that scaffold-debug-delegation.sh generates a well-formed debug-delegation.md from a synthetic failure trail, that versioned filenames work when prior scaffolds exist, and that the y/n/skip prompt in speckit-implement-auto.yaml/speckit-complete-auto.yaml never autonomously dispatches @debug."
version: 3.6.0.9
id: tooling-and-scripts-debug-delegation-scaffold-generator
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
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
   bash .opencode/skills/system-spec-kit/runtime/cli/spec/scaffold-debug-delegation.sh \
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
   bash .opencode/skills/system-spec-kit/runtime/cli/spec/scaffold-debug-delegation.sh --spec-folder /tmp/scaf-test/<spec-folder> --task-id "T999" --errors-json '[{"approach":"x","result":"x"},{},{}]'
   test -f /tmp/scaf-test/<spec-folder>/debug-delegation-002.md
   ```
5. Confirm no @debug autonomous dispatch (the script is plain Bash; verify by reading the script):
   ```bash
   grep -n "Task tool\|subagent_type" .opencode/skills/system-spec-kit/runtime/cli/spec/scaffold-debug-delegation.sh  # expect zero matches
   ```
6. Confirm the YAML configs surface a y/n/skip prompt rather than auto-dispatch:
   ```bash
   grep -A 8 "debug_delegation:\|debug_escalation:" .opencode/commands/speckit/assets/speckit-implement-auto.yaml .opencode/commands/speckit/assets/speckit-complete-auto.yaml | grep -E "y / continue manually / skip|no_autonomous_routing|prompt_user_with_y_n_skip"  # expect at least 3 hits
   ```
7. Cleanup:
   ```bash
   rm -rf /tmp/scaf-test
   ```

### Evidence

Capture, for every step in the Commands sequence above:

- The exact command or tool call issued, its full output, and its exit status.
- The output lines that carry each expected signal listed in the Expected block.
- Any deviation from the expected result, quoted verbatim from the output.
- The resolved path of every file or log the run reads or writes.

### Failure Triage

1. Re-run each command in the sequence on its own and record its exit status; the first non-zero exit names the failing step.
2. Confirm the handler or script listed in section 4 is the one actually loaded, and that any compiled output under `dist/` is current for it.
3. Compare the observed response field by field against the Expected block, and quote the first field that disagrees.

### Pass / Fail

- **Pass**: all five expected signals hold, and a second invocation with a prior scaffold present produces `debug-delegation-002.md` rather than overwriting the original.
- **Fail**: any expected signal is absent, the second invocation overwrites the original scaffold, or the generated Bash script contains an autonomous `Task tool` / subagent dispatch.

---

## 4. SOURCE FILES

- Root playbook: [manual-testing-playbook.md](../../manual-testing-playbook/manual-testing-playbook.md)

- Helper script: `.opencode/skills/system-spec-kit/runtime/cli/spec/scaffold-debug-delegation.sh`
- Schema source: `.opencode/agents/debug.md` (Debug Context Handoff format, lines 60-89)
- Workflow YAML: `.opencode/commands/speckit/assets/speckit-implement-auto.yaml` (debug_delegation block) and `.../speckit-complete-auto.yaml` (debug_escalation block)
- Operator constraint: the debug agent is user-invoked only; the workflow must never dispatch it autonomously.

---

## 5. SOURCE METADATA

- Group: Tooling and Scripts
- Playbook ID: DBG-SCAF-001
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `tooling-and-scripts/debug-delegation-scaffold-generator.md`
