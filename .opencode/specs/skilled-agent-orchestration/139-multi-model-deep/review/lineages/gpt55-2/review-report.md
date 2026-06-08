# Deep Review Report: gpt55-2

## Executive Summary

Verdict: CONDITIONAL. This max-1 lineage found no P0s, one active P1, and two active P2s. The release/reap implementation preserves the single-writer invariant in the no-secondary fresh-session case, but the combined case of an active secondary plus a later fresh session can still disrupt the secondary by reaping the daemon it is using.

## Planning Trigger

Plan remediation for F001 before treating daemon re-election as fully release-ready across concurrent sessions. F002 and F003 can be bundled as follow-up hardening and tooling cleanup.

## Active Finding Registry

| ID | Severity | Category | Title | Evidence |
|----|----------|----------|-------|----------|
| F001 | P1 | correctness | Fresh session can reap a daemon still serving a live secondary | `.opencode/bin/mk-spec-memory-launcher.cjs:1482` |
| F002 | P2 | correctness | SIGKILL reap result is discarded before replacement spawn | `.opencode/bin/mk-spec-memory-launcher.cjs:713` |
| F003 | P2 | traceability | Comment hygiene misses reversed packet labels present in target launchers | `.opencode/skills/sk-code/scripts/check-comment-hygiene.sh:169` |

## Remediation Workstreams

| Workstream | Findings | Suggested Direction |
|------------|----------|---------------------|
| Released daemon adoption | F001 | In stale-owner reclaim, prefer adopting/bridging a responsive released daemon or gate reap on no active clients, rather than unconditionally killing `childPid`. Add a three-session test: owner + secondary, owner exits, fresh session starts, secondary request remains successful without dropped in-flight RPC. |
| Reap confirmation | F002 | Treat a post-SIGKILL `waitForPidExit` false result as `allowed:false` and avoid spawning a replacement while the old pid is still alive. |
| Hygiene pattern closure | F003 | Add a `\b\d+\s+packet\b` style pattern and fixtures for `096 packet`; then replace the two launcher comments with durable reasoning. |

## Spec Seed

- Requirement: A fresh session joining after owner disposal must not interrupt an existing secondary that is bridged to the released daemon.
- Requirement: Reap-before-respawn must only spawn after the previous child is confirmed dead or the launcher has a safe adoption path.
- Requirement: Comment hygiene must reject both `packet 096` and `096 packet` forms in code comments.

## Plan Seed

1. Add the missing three-session durability test around the adoption-live harness.
2. Change stale-owner reclaim to adopt a live released daemon when its socket answers deep probe, or otherwise delay/abort reap when active secondary use is likely.
3. Make `reapLeaseChildBeforeRespawn` fail closed if SIGKILL does not produce confirmed process death.
4. Extend comment-hygiene regex coverage and update fixtures.

## Traceability Status

| Protocol | Status | Notes |
|----------|--------|-------|
| spec_code | partial | Shared context and code agree on release and fresh reap separately; F001 covers the missing combined behavior. |
| checklist_evidence | partial | Target packet checklist remains generic scaffold and cannot substantiate done claims. |
| feature_catalog_code | partial | Feature catalog claims align with launcher primitives, but runtime config default-on files were outside the direct target except hooks. |
| playbook_capability | not_applicable | No manual playbook execution in this lineage. |

## Deferred Items

- Full security dimension pass over stored socket paths and legacy lease trust was not run due `maxIterations: 1`.
- Full maintainability pass over code-index launcher parity was not run due `maxIterations: 1`.

## Audit Appendix

Stop reason: `maxIterationsReached`. Code graph was stale, so direct reads and Grep evidence were used. Verification commands passed: `node --check` for both launchers, `bash -n` for `session-cleanup.sh`, and the comment-hygiene checks whose clean result supports F003.

## Resource Map Coverage Gate

Skipped. The target spec folder had no `resource-map.md` at phase_init.
