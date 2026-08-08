# Iteration 2 — playbook contract audit

## Focus

Audit every changed-subject root playbook match and the linked Cursor hook scenarios for a contradicted receipt, epoch, suppression, or observer-timing assertion.

## Actions Taken

- Read the Cursor root playbook's Gate-3 entries and linked CU-013, CU-014, CU-020, and CU-021 scenario files.
- Read the Codex root playbook's cross-cutting hook-parity and hook smoke-test references, including the `SessionStart`/`UserPromptSubmit` stdout expectations.
- Read the OpenCode root playbook's Gate-3 mention, which is only a spec-folder precondition for a memory-tool dispatch.
- Compared every observed assertion with the changed contract: epoch 0 is non-confirming, observers run after emission, suppression remains default-off/fail-open, and output remains unchanged.

## Findings

### No stale authoritative playbook snippet found

- `.opencode/skills/cli-external-orchestration/cli-cursor/manual-testing-playbook/manual-testing-playbook.md:456-464` and `hooks/confirmed-non-delivery-documentation.md:15-33,41-49` assert that Cursor `beforeSubmitPrompt` and `stop` never fire and that `spec-gate-classify.mjs` is dormant. The changed observer placement does not make those host events fire, so this is aligned.
- `hooks/confirmed-fires-smoke-test.md:15-33,41-49` tests only `sessionStart`, `preToolUse`, and `sessionEnd` event delivery. Its “preToolUse fired before the requested shell command” wording is about the host event, not Gate-3 question emission, so it does not contradict post-emission observation.
- `hooks/spec-gate-prebind-session-start.md:15-33,41-48` tests prebinding state and no-op rows. It does not treat prebinding as a delivery receipt and does not assert epoch 0 confirmation.
- `hooks/task-dispatch-guard-live-fire.md:15-33,41-49` tests a `Task` matcher and an unmatched `preToolUse` entry. It is unrelated to Gate-3 question delivery.
- `.opencode/skills/cli-external-orchestration/cli-codex/manual-testing-playbook/manual-testing-playbook.md:39,502-504` describes hook parity and the stdout shape of the Codex adapters. It does not assert that a bare/configured receipt confirms a Gate-3 question.
- `.opencode/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/manual-testing-playbook.md:280-281` uses “Gate 3” only as a pre-approved spec-folder setup condition.

### Optional P2 hardening, not a stale assertion

The Cursor Gate-3 scenarios would be safer with an explicit cross-reference to the observed-receipt/epoch contract, but none currently claims the opposite. Adding that cross-reference is optional follow-on documentation hardening, not a must-fix correction to an existing test expectation.

## Questions Answered

- Q-001: No matched playbook snippet contradicts the changed epoch floor, post-emission observer timing, or fail-open/default-off behavior.
- Q-003: The Cursor hook scenarios and Codex hook-parity check are authoritative test contracts, but their current assertions concern host-event availability and output shape. The OpenCode/Codex Gate-3 mentions outside those contracts are illustrative setup text.

## Questions Remaining

- Verify the two Cursor feature-catalog entries against the actual adapter source and the updated shared-core README.
- Check whether any catalog uses paraphrased receipt language that escaped the exact-symbol sweep.
- Determine whether the two catalog omissions should be one cross-file finding or two file-specific findings for implementation tracking.

## Next Focus

Compare the authoritative Cursor catalogs line-by-line with the changed core exports and all five runtime adapter call sites; classify omissions by impact.

