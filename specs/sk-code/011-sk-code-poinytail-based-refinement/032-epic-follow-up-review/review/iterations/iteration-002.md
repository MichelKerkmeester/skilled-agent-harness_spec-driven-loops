# Deep Review Iteration 2

## Dimension

Security. This pass covered the Commit-Id hook trust boundary and Pi Fast Mode state, handoff, and request mutation.

## Files Reviewed

The 32 configured scope files were enumerated and included in targeted searches. Direct reads focused on the hook trust and allocator paths, Pi configuration and lifecycle code, the relevant tests, and the v4.0.0.4 release note. The release note's full 475-line text was read and its explicit local path references were scanned.

## Findings by Severity

### P0

#### R2-P0-001: Hook trust gate executes clone-controlled .skilled-untrusted helpers

- Case: An untrusted clone contains a normal .skilled or .opencode toolchain marker and adds .skilled-untrusted/skills/sk-git/scripts/commit-id-naming.sh. On git commit, the global prepare-commit-msg hook selects that clone-local path after the trust check, sees the file and runs it with bash. The same source root feeds executable helpers in pre-push.
- File: .skilled/scripts/git-hooks/prepare-commit-msg:78
- Evidence: The trust check assigns SOURCE_ROOT to REPO_ROOT/.skilled-untrusted at line 78. Allocator selection reads from that root at lines 110-117, and allocation executes the selected path with bash at line 308. pre-push also sources the mass-deletion guard and worktree-naming helper from that root at lines 93-125.
- User impact: Committing or pushing from an untrusted clone can run attacker-controlled shell code with the user's permissions, including access to local files and credentials.
- Finding class: cross-consumer
- Scope proof: An exact search across the scoped hooks found the hidden-root assignment and executable consumers in prepare-commit-msg and pre-push. The existing adversarial prepare hook case places a malicious allocator under .opencode at tests/prepare-commit-msg.test.sh:412, but does not plant one under .skilled-untrusted.
- Affected surfaces: prepare-commit-msg allocator, pre-push mass-deletion guard, pre-push worktree-naming helper
- Recommendation: For an untrusted repository, use executable helpers only from the trusted installed hook directory or skip repository-owned helpers. Do not select a clone-local .skilled-untrusted path as trusted based only on its name.
- Claim adjudication:
  - Claim: The hook trust gate prevents execution of scripts from an untrusted repository.
  - Counterevidence sought: I searched the scoped hooks and tests for .skilled-untrusted assignments, SOURCE_ROOT consumers and trust-specific adversarial cases. I found no provenance validation for the hidden path. The existing adversarial test covers a clone-owned allocator under .opencode only.
  - Alternative explanation: The suffix directory appears intended to hide the normal .skilled and .opencode trees from untrusted repositories. It is still inside the clone, so the suffix alone cannot establish trusted provenance.
  - Final severity: P0.
  - Confidence: 0.99.
  - Downgrade trigger: Downgrade only if a verified control prevents clone-controlled files at .skilled-untrusted from being selected or validates helper provenance before execution.

### P1

None.

### P2

None.

## Traceability Checks

- spec_code: FAIL. The changelog says the allocator fallback does not run repository code at .skilled/changelog/skilled/v4.0.0.4.md:135. The hook can execute a clone-controlled allocator at .skilled/scripts/git-hooks/prepare-commit-msg:110 and :308.
- checklist_evidence: PARTIAL. The hook tests cover a malicious allocator under .opencode but omit the same payload under .skilled-untrusted. Test files were inspected, not run.
- skill_agent and agent_cross_runtime: PARTIAL. The Codex deep-review agent definition was loaded. Other runtime mirrors were not semantically compared in this security pass.
- feature_catalog_code and playbook_capability: PARTIAL. The target changelog claims about Commit-Id and Pi Fast Mode were compared to code. Other release-note claims were read and local path tokens were scanned, but their behavior was not individually checked against implementation.
- Pi Fast Mode claims at .skilled/changelog/skilled/v4.0.0.4.md:425-427 match the inspected code: defaults are enabled, a true --fast flag takes precedence, valid inherited 1/0 values precede persisted state, and requests change only for configured provider/model pairs without an existing service tier.
- Deferred for the correctness pass: whether every message and push gate rejects ordinal 0000000. The allocator rejects that value, while the presence checks inspect seven digits. The message-contract interaction needs a focused read.
- Deferred for later security review: behavior when a project config's .pi parent is a symlink.
- The full semantic audit of unrelated changelog claims remains open for the traceability pass.

## Verdict

FAIL because one active P0 finding shows clone-controlled code can run behind the global hook trust gate.

## Next Dimension

Correctness. Recheck Commit-Id validity through commit-msg, pre-push and the message-contract validator. Continue with the strategy's remaining dimensions.

Review verdict: FAIL
