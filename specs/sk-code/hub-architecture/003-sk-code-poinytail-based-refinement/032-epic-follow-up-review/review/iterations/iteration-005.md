# Review Iteration 5

## Dimension

Maintainability. This pass checked Pi Fast Mode module ownership and state precedence, the Commit-Id hook/policy boundary, and the v4.0.0.4 changelog claims.

## Files Reviewed

The 32 scoped files from review/scope-files.txt:

1. .pi/extensions/pi-fast-mode-w-subagent-support/package.json
2. .pi/extensions/pi-fast-mode-w-subagent-support/README.md
3. .pi/extensions/pi-fast-mode-w-subagent-support/src/commands.ts
4. .pi/extensions/pi-fast-mode-w-subagent-support/src/config.ts
5. .pi/extensions/pi-fast-mode-w-subagent-support/src/handoff.ts
6. .pi/extensions/pi-fast-mode-w-subagent-support/src/index.ts
7. .pi/extensions/pi-fast-mode-w-subagent-support/src/payload.ts
8. .pi/extensions/pi-fast-mode-w-subagent-support/src/README.md
9. .pi/extensions/pi-fast-mode-w-subagent-support/src/status.ts
10. .pi/extensions/pi-fast-mode-w-subagent-support/src/types.ts
11. .pi/extensions/pi-fast-mode-w-subagent-support/tests/commands.test.ts
12. .pi/extensions/pi-fast-mode-w-subagent-support/tests/config.test.ts
13. .pi/extensions/pi-fast-mode-w-subagent-support/tests/extension.test.ts
14. .pi/extensions/pi-fast-mode-w-subagent-support/tests/handoff.test.ts
15. .pi/extensions/pi-fast-mode-w-subagent-support/tests/payload-status.test.ts
16. .pi/extensions/pi-fast-mode-w-subagent-support/tests/precedence.test.ts
17. .pi/extensions/pi-fast-mode-w-subagent-support/tests/propagation.test.ts
18. .pi/extensions/pi-fast-mode-w-subagent-support/tests/README.md
19. .pi/extensions/pi-fast-mode-w-subagent-support/tsconfig.json
20. .skilled/changelog/skilled/v4.0.0.4.md
21. .skilled/scripts/git-hooks/commit-msg
22. .skilled/scripts/git-hooks/lib/commit-id-policy.sh
23. .skilled/scripts/git-hooks/pre-push
24. .skilled/scripts/git-hooks/prepare-commit-msg
25. .skilled/scripts/git-hooks/tests/commit-msg.test.sh
26. .skilled/scripts/git-hooks/tests/pre-push-message-contract.test.sh
27. .skilled/scripts/git-hooks/tests/pre-push.test.sh
28. .skilled/scripts/git-hooks/tests/prepare-commit-msg.test.sh
29. .skilled/skills/sk-git/scripts/commit-id-naming.sh
30. .skilled/skills/sk-git/scripts/lib/message-contract.mjs
31. .skilled/skills/sk-git/scripts/stamp-branch.sh
32. .skilled/skills/sk-git/scripts/tests/commit-id-naming.test.sh

Also loaded .codex/agents/deep-review.toml and reviewed changelog-named sources for the Commit-Id and Pi Fast Mode claims.

## Findings by Severity

### P0

No new P0 finding in this iteration. Active R2-P0-001 remains: the prepare-commit-msg trust branch selects the .skilled-untrusted allocator, then invokes the selected allocator. This conflicts with the changelog's statement that the fallback avoids executing repository code. Evidence: .skilled/scripts/git-hooks/prepare-commit-msg:76, :110, :308; .skilled/changelog/skilled/v4.0.0.4.md:135. The existing finding was not duplicated.

### P1

No new P1 finding. Active R3-P1-001 remains from the prior iteration.

### P2

No new P2 finding. Active R4-P2-001 remains from the prior iteration.

### Maintainability result

The Pi extension assigns startup composition, persistence, handoff, payload mutation, status rendering, and commands to focused modules. The default-on setting and explicit --fast / inherited-state / saved-state precedence align across the implementation, README, and focused test cases. Evidence: .pi/extensions/pi-fast-mode-w-subagent-support/src/README.md:11, .pi/extensions/pi-fast-mode-w-subagent-support/src/index.ts:107 and :178, .pi/extensions/pi-fast-mode-w-subagent-support/src/config.ts:332, .pi/extensions/pi-fast-mode-w-subagent-support/tests/precedence.test.ts:98, and .pi/extensions/pi-fast-mode-w-subagent-support/README.md:92.

The hook policy is shared through .skilled/scripts/git-hooks/lib/commit-id-policy.sh:23. The untrusted allocator execution concern is already tracked as R2-P0-001, so it is not restated as a maintainability finding.

## Traceability Checks

- spec_code: partial. The changelog's allocator claim is contradicted by the active P0 finding.
- checklist_evidence: partial. Relevant test sources were inspected, not run.
- skill_agent: not applicable to the hook and Pi extension ownership reviewed; the deep-review agent definition was loaded.
- agent_cross_runtime: not applicable to these feature targets in this iteration.
- feature_catalog_code: partial. The Commit-Id and Pi descriptions were compared with source; unrelated catalog/release-note claims remain unchecked.
- playbook_capability: partial. Relevant scoped playbook/test surfaces were inspected; broader release-note capability claims remain unchecked.
- changelog claim audit: partial. The full 475-line changelog and its claim headings were inventoried. Commit-Id and Pi Fast Mode claims were compared with source. Semantic verification of the remaining claims was not completed; this is explicit audit debt, not a clean result.

No tests were run.

## Verdict

The overall review remains FAIL because active P0 R2-P0-001 remains in the findings registry. This iteration adds no findings. The full changelog claim audit is incomplete.

## Next Dimension

None. This is iteration 5 of 5. Carry the remaining changelog semantic audit into a separately authorized review run.

## SCOPE VIOLATIONS

None.

Review verdict: FAIL
