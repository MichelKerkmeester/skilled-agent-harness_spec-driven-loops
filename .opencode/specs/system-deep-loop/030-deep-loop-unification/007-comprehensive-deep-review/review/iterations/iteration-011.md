# Iteration 011 - Security: Deep-Review Packet

## Dimension

Security review of `.opencode/skills/system-deep-loop/deep-review/`, focused on write-boundary enforcement, CLI executor dispatch safety, prompt-injection exposure from reviewed target content, and committed secret-shaped strings in `assets/`, `references/`, and `scripts/`.

## Files Reviewed

- `.opencode/specs/system-deep-loop/052-deep-loop-unification/007-comprehensive-deep-review/review/deep-review-strategy.md:86`
- `.opencode/specs/system-deep-loop/052-deep-loop-unification/007-comprehensive-deep-review/review/deep-review-state.jsonl:22`
- `.opencode/specs/system-deep-loop/052-deep-loop-unification/007-comprehensive-deep-review/review/deep-review-findings-registry.json:380`
- `.opencode/skills/sk-code/code-review/references/review_core.md:28`
- `.opencode/skills/system-deep-loop/deep-review/assets/prompt_pack_iteration.md.tmpl:62`
- `.opencode/skills/system-deep-loop/deep-review/assets/prompt_pack_iteration.md.tmpl:68`
- `.opencode/skills/system-deep-loop/deep-review/assets/prompt_pack_iteration.md.tmpl:69`
- `.opencode/skills/system-deep-loop/deep-review/references/protocol/loop_protocol.md:280`
- `.opencode/skills/system-deep-loop/deep-review/references/protocol/loop_protocol.md:290`
- `.opencode/skills/system-deep-loop/deep-review/references/protocol/loop_protocol.md:296`
- `.opencode/skills/system-deep-loop/deep-review/feature_catalog/loop-lifecycle/executor-selection-contract.md:32`
- `.opencode/skills/system-deep-loop/deep-review/manual_testing_playbook/command-flow-stress-tests/write-boundary-reducer-owned-files.md:25`
- `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts:70`
- `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts:85`
- `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts:678`
- `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts:740`
- `.opencode/commands/deep/assets/deep_review_auto.yaml:1025`
- `.opencode/commands/deep/assets/deep_review_auto.yaml:1072`
- `.opencode/commands/deep/assets/deep_review_confirm.yaml:820`
- `.opencode/commands/deep/assets/deep_review_confirm.yaml:839`

## Findings By Severity

### P0

None.

### P1

#### DR-011-P1-001 - Deep-review executor docs understate `cli-opencode` permission blast radius

- Severity: P1
- Category: security-executor-permissions
- File: `.opencode/skills/system-deep-loop/deep-review/references/protocol/loop_protocol.md:280`
- Claim: The deep-review packet tells operators that `cli-opencode` review iterations run with workspace-write sandboxing, but the live `/deep:review` command branches invoke `opencode run` with `--dangerously-skip-permissions` and explicitly state that `sandboxMode='read-only'` is not honored. Because review targets are arbitrary code/spec files and the prompt template relies on model-obeyed allowed-write-path instructions, the reference contract understates the write-permission blast radius for malicious target-content prompt injection.
- Evidence refs: `.opencode/skills/system-deep-loop/deep-review/references/protocol/loop_protocol.md:280`, `.opencode/skills/system-deep-loop/deep-review/feature_catalog/loop-lifecycle/executor-selection-contract.md:32`, `.opencode/commands/deep/assets/deep_review_auto.yaml:1025`, `.opencode/commands/deep/assets/deep_review_auto.yaml:1072`, `.opencode/commands/deep/assets/deep_review_confirm.yaml:820`, `.opencode/commands/deep/assets/deep_review_confirm.yaml:839`, `.opencode/skills/system-deep-loop/deep-review/assets/prompt_pack_iteration.md.tmpl:62`, `.opencode/skills/system-deep-loop/deep-review/assets/prompt_pack_iteration.md.tmpl:68`
- Counterevidence sought: I checked the shared executor wrapper and found env allowlisting plus recursion guards for non-native executors at `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts:70`, `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts:85`, `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts:678`, and `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts:740`. I also found the prompt template's allowed-write-path and banned-operation contract at `.opencode/skills/system-deep-loop/deep-review/assets/prompt_pack_iteration.md.tmpl:62` and `.opencode/skills/system-deep-loop/deep-review/assets/prompt_pack_iteration.md.tmpl:68`, plus a write-boundary sandbox scenario at `.opencode/skills/system-deep-loop/deep-review/manual_testing_playbook/command-flow-stress-tests/write-boundary-reducer-owned-files.md:25`.
- Alternative explanation: The command may intentionally use `--dangerously-skip-permissions` because current OpenCode automation lacks an equivalent granular sandbox; the packet may rely on prompt-level write lists, post-dispatch validation, and tests rather than runtime permissions.
- Final severity: P1
- Confidence: 0.87
- Downgrade trigger: Downgrade to P2 if either the live command branch stops using `--dangerously-skip-permissions` or the packet reference/template explicitly documents the dangerous-permission executor path, treats reviewed target content as untrusted data, and adds an enforceable permission/path gate that prevents target-content prompt injection from writing outside the review packet.
- Scope proof: Exact searches for `dangerously-skip-permissions`, `acceptEdits`, `untrusted`, `prompt injection`, `target content`, `ALLOWED WRITE PATHS`, and `SCOPE VIOLATION` under `.opencode/skills/system-deep-loop/deep-review` found the allowed-write-path contract and write-boundary tests, but no explicit untrusted-target-content mitigation in the prompt pack or executor-selection references.
- Affected surface hints: `cli-opencode executor branch`, `prompt-pack write boundary`, `review target content`, `operator documentation`, `post-dispatch validation`
- Recommendation: Align the deep-review executor-selection references with the live command behavior and add an explicit untrusted-target-content instruction or runtime path-permission guard for `cli-opencode` runs before accepting arbitrary review targets under dangerous permissions.

### P2

None.

## Traceability Checks

- Write-boundary enforcement: Partial. The prompt pack constrains writes to packet artifacts and bans deletes/renames/truncating out-of-scope files, but this is a model-level contract rather than a runtime permission boundary for `cli-opencode`.
- Executor dispatch safety: Fail for documentation/security contract alignment. The wrapper has env allowlisting and recursion guards, but live `cli-opencode` uses `--dangerously-skip-permissions` while the packet references advertise workspace-write sandboxing.
- Injection via review target content: Gap. The target is read-only in the prompt contract, but I found no explicit instruction that reviewed file contents are untrusted data and must not override system/developer/allowed-write instructions.
- Secrets scan: Pass. Credential-shaped grep hits in `assets/`, `references/`, and `scripts/` were generic docs/examples or benchmark text, not committed real secrets.

## Verdict

CONDITIONAL: one new P1 security finding was confirmed. No P0 was found.

## Next Dimension

Iteration 12 should continue the `deep-review` packet with traceability. Focus on command/agent/feature-catalog alignment for the executor contract and do not re-count DR-010-P2-001, DR-010-P2-002, or DR-011-P1-001 unless new traceability evidence broadens them.

Review verdict: CONDITIONAL
