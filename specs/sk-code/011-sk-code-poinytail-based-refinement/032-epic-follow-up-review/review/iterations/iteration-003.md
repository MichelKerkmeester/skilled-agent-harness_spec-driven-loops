# Deep Review Iteration 3

## Dimension

Correctness. This pass followed the iteration-2 deferral for the all-zero Commit-Id case, checked Pi Fast Mode state and request handling, and compared the scoped release-note claims with implementation. Semantic checks of unrelated changelog sections remain with the traceability dimension.

## Files Reviewed

The configured 32 paths were enumerated. Direct reads and exact searches focused on the commit hooks, `lib/commit-id-policy.sh`, the sk-git allocator, message validator and branch stamper, and `.pi/extensions/pi-fast-mode-w-subagent-support/` source, documentation and test files. Test sources were inspected; no tests were run.

## Findings by Severity

### P0

No new P0 finding. The registry still has active `R2-P0-001` at [SOURCE: .skilled/scripts/git-hooks/prepare-commit-msg:78]; that existing blocker keeps the overall verdict at FAIL.

### P1

#### R3-P1-001: Commit-Id gates accept the reserved all-zero ordinal

- Case: In an ID-enforced repository with no prior zero-valued id, a message containing `Commit-Id: 0000000` passes the seven-digit message checks; a commit carrying it also passes the pre-push presence gate.
- File: `.skilled/scripts/git-hooks/pre-push:311`
- Evidence: `cip_message_has_id` accepts any seven digits [SOURCE: .skilled/scripts/git-hooks/lib/commit-id-policy.sh:51]. The message validator applies the configured regex `^[0-9]{7}$` [SOURCE: .skilled/skills/sk-git/scripts/lib/message-contract.mjs:539] [SOURCE: .skilled/skills/sk-git/assets/commit-message-template.md:262]. Pre-push Gate 7 checks the same seven-digit shape [SOURCE: .skilled/scripts/git-hooks/pre-push:311]. The allocator allows only 0000001 through 9999999 and rejects zero [SOURCE: .skilled/skills/sk-git/scripts/commit-id-naming.sh:43] [SOURCE: .skilled/skills/sk-git/scripts/commit-id-naming.sh:47]; its test rejects 0000000 [SOURCE: .skilled/skills/sk-git/scripts/tests/commit-id-naming.test.sh:51].
- User impact: An ID-enforced repository can store and push an ordinal its own allocator declares invalid, leaving history outside the sequence contract.
- Finding class: cross-consumer.
- Scope proof: Existing commit-msg coverage tests a short malformed value but not zero [SOURCE: .skilled/scripts/git-hooks/tests/commit-msg.test.sh:134], and the push test exercises a positive value only [SOURCE: .skilled/scripts/git-hooks/tests/pre-push.test.sh:348].
- Recommendation: Apply one positive-ordinal validator at both commit and push boundaries, and add an all-zero rejection case.
- Claim: The Commit-Id message and push gates reject every value the allocator considers invalid.
- Counterevidence sought: Checked both hook acceptance paths, the configured message pattern, the allocator invariant and nearby tests for a zero exception or lower-bound check; none appears downstream.
- Alternative explanation: The gates may rely on the normal stamper to produce valid IDs. That does not cover manual message edits or commits created without hooks, which the commit and push validators are intended to catch.
- Final severity: P1.
- Confidence: 0.98.
- Downgrade trigger: Verified evidence that a shared validation step rejects 0000000 before commit and push, or that the allocator contract changes to accept zero.

### P2

None.

## Traceability Checks

- `spec_code`: PARTIAL. The allocator and downstream hook gates disagree on whether zero is valid. The changelog no-repository-code claim remains tracked by `R2-P0-001` [SOURCE: .skilled/changelog/skilled/v4.0.0.4.md:135].
- `checklist_evidence`: PARTIAL. Test sources were inspected, not run; the scoped hook tests do not exercise the all-zero boundary.
- `skill_agent` / `agent_cross_runtime`: PARTIAL. The Codex deep-review definition was loaded; target feature-agent ownership and runtime mirrors were not part of this correctness pass.
- `feature_catalog_code` / `playbook_capability`: PARTIAL. Target Commit-Id and Pi claims were compared to implementation; unrelated catalog and playbook claims remain for traceability.
- Pi Fast Mode: the code defaults to enabled, resolves explicit `--fast` before a valid inherited value and persisted state, persists the effective preference, and only mutates eligible configured targets without an existing service tier [SOURCE: .pi/extensions/pi-fast-mode-w-subagent-support/src/config.ts:53] [SOURCE: .pi/extensions/pi-fast-mode-w-subagent-support/src/index.ts:183] [SOURCE: .pi/extensions/pi-fast-mode-w-subagent-support/src/payload.ts:93] [SOURCE: .pi/extensions/pi-fast-mode-w-subagent-support/src/payload.ts:103]. This matches the scoped changelog claim at line 427.
- The full 475-line changelog was read. Semantic checks of claims outside the Commit-Id and Pi Fast Mode features remain deferred to the traceability pass.
- Tests were not run.

## Verdict

FAIL. This iteration adds one P1 finding, and the existing active P0 `R2-P0-001` remains open.

## Next Dimension

Traceability. Verify the remaining v4.0.0.4 claims against the tree and complete the configured cross-reference protocols.

Review verdict: FAIL
