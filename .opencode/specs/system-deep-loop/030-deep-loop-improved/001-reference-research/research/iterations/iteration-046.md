# Iteration 46: S6-06 Promotion Failure and Rollback Semantics

## Focus

[S6-06] How should loop-cli's "clean failure with branch preserved beats merging unverified code" reshape the deep-improvement promote/rollback gate, and does that conflict with Kasper's auto-apply plus backup-rollback model?

This iteration intentionally does not re-open the prior SpecKit closeout finding. Earlier registry entries already mapped loop-cli autopilot to `/speckit:complete` archive/merge behavior. The new target here is the deep-improvement promotion boundary: shared `promote-candidate.cjs`, rollback, promotion gate docs, and the cross-lane policy gap between direct canonical copy and kept-worktree promotion.

## Actions Taken

1. Read the deep-research output contract and nearby iterations 043-045 to avoid duplicating the S6-02 state-store work, S6-04 optimizer invariant work, and S6-05 fan-out merge/retry work.
2. Mined loop-cli autopilot for branch creation, verification-gated merge, merge-conflict abort, and failure policy.
3. Mined Kasper for auto-update toggles, queued improvement generation, backup-before-mutation, rollback, inline markers, and restore messaging.
4. Compared those reference mechanisms to deep-improvement's current shared promotion and rollback scripts plus promotion policy docs.
5. Checked the existing deep-improvement worktree-isolation contract as an internal target precedent.

## Findings

### Rank 1 - Split "candidate accepted" from "canonical shipped"

Reference mechanism: loop-cli runs unattended, but still creates a branch before work begins, keeps `main` untouched until the final merge, and only merges after verification passes with a clean tree [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/.opencode/commands/ob-autopilot.md:13`; SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/.opencode/commands/ob-autopilot.md:25`; SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/.opencode/commands/ob-autopilot.md:54`]. On verification failure or unresolved merge conflict it stops and preserves the branch instead of shipping [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/.opencode/commands/ob-autopilot.md:68`; SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/.opencode/commands/ob-autopilot.md:74`].

Exact OUR target file: `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/shared/promote-candidate.cjs`.

Why it helps: the current shared promoter archives the target and then copies the candidate directly over the canonical target after gates. That is safe only if "promotion" means local canonical mutation, not shipping. Rename or split the stages so `promote-candidate.cjs` can produce an accepted candidate in an isolated branch/worktree, while canonical overwrite/merge is a later clean-tree finalization.

Port difficulty: hard. Tag: deep-rewrite.

### Rank 2 - Make gate failure a preserved-artifact outcome, not a rollback-flavored success

Reference mechanism: loop-cli's failure policy is explicit: propose-no-tasks, stalled wave, exhausted retry, failed verification, or merge conflict all halt; the branch remains intact and unmerged for diagnosis [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/.opencode/commands/ob-autopilot.md:68`; SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/.opencode/commands/ob-autopilot.md:72`; SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/.opencode/commands/ob-autopilot.md:74`].

Exact OUR target file: `.opencode/skills/deep-loop-workflows/deep-improvement/references/shared/promotion_gate_contract.md`.

Why it helps: deep-improvement already names failure modes for scoring, benchmark, repeatability, boundary, and approval gates, but the process language still flows from "all gates pass" into direct canonical mutation. The contract should add a terminal state like `promotion_blocked_branch_preserved` or `candidate_kept_unmerged`, with required evidence: gate that failed, candidate path, branch/worktree path when present, and exact resume action.

Port difficulty: med. Tag: quick-win.

### Rank 3 - Treat Kasper-style backups as intra-branch restore, not permission to auto-ship

Reference mechanism: Kasper snapshots before mutation and keeps rollback local: AGENTS.md backups are timestamped before write, rollback backs up the pre-rollback state, restores latest backup, and writes atomically [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/agents-md.ts:51`; SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/agents-md.ts:128`; SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/agents-md.ts:138`; SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/agents-md.ts:142`]. Agent prompt backups follow the same pattern and refuse inline prompt rollback because there is no on-disk file to restore [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/agent-prompts.ts:194`; SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/agent-prompts.ts:214`; SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/agent-prompts.ts:216`].

Exact OUR target file: `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/agent-improvement/rollback-candidate.cjs`.

Why it helps: backup-rollback does not conflict with branch preservation if it is scoped to restoring a candidate branch/worktree or reverting a local canonical copy. It conflicts only if "we can roll back" becomes a reason to overwrite canonical before branch-level verification. The rollback helper should add backup existence, target hash, post-restore parse/score evidence, and a result that distinguishes `rolled_back_local_candidate` from `canonical_shipping_reverted`.

Port difficulty: med. Tag: quick-win.

### Rank 4 - Keep auto-apply as candidate queuing, not canonical promotion

Reference mechanism: Kasper defaults `auto_update` on in config [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/config.ts:212`; SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/config.ts:214`], shows the current config/session auto-update state in improvement output [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/handlers.ts:465`], and lets the session toggle automatic application on/off [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/handlers.ts:481`; SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/handlers.ts:487`; SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/handlers.ts:490`].

Exact OUR target file: `.opencode/skills/deep-loop-workflows/deep-improvement/assets/agent_improvement/improvement_config.json`.

Why it helps: deep-improvement should not import Kasper's default-on auto-apply semantics at the canonical boundary. The safe port is a lower-risk toggle such as `autoQueueCandidates` or `autoApplyToIsolatedWorktree`, while `promotionEnabled` and explicit approval remain the canonical mutation gate. This preserves unattended learning without letting an automatic candidate write become a silent ship.

Port difficulty: easy. Tag: quick-win.

### Rank 5 - Promote the kept-worktree precedent into the shared gate

Reference mechanism: loop-cli preserves the feature branch on failure and refuses unverified merge [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/.opencode/commands/ob-autopilot.md:74`]. Kasper proves local backup/rollback can still be useful for reversible edits [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/improvements.ts:49`; SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/improvements.ts:90`; SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/improvements.ts:101`].

Exact OUR target file: `.opencode/skills/deep-loop-workflows/deep-improvement/references/shared/promotion_rules.md`.

Why it helps: deep-improvement's kept-worktree precedent says accepted candidates stay isolated for deliberate operator merge, rejected candidates are cleaned, and the first accepted promotion stops the session. The shared promotion rules should generalize that posture across lanes: accepted means "verified and preserved for merge," rejected means "cleaned or rolled back," and canonical overwrite is a separate, evidence-backed shipping operation.

Port difficulty: med. Tag: deep-rewrite.

## Questions Answered

- S6-06 answer: loop-cli should reshape deep-improvement promotion into a two-boundary model. First, a candidate may be accepted into a preserved branch/worktree after scoring, benchmark, repeatability, manifest, mirror, and approval gates. Second, canonical mutation or merge happens only after final verification and a clean tree.
- Does this conflict with Kasper's auto-apply plus backup-rollback? No, not if Kasper's pattern is scoped to candidate creation or isolated local mutation. It does conflict if auto-apply is allowed to overwrite canonical targets directly before the branch/worktree verification boundary.
- Best backlog direction: use loop-cli for shipping semantics and Kasper for reversible local mutation mechanics.

## Questions Remaining

- Should the direct-copy lanes use real `git worktree` isolation, a feature branch in the main worktree, or the existing archive directory plus a separate finalizer?
- Which state schema should record `candidate_kept_unmerged`, `promotion_blocked_branch_preserved`, and `rolled_back_local_candidate` so reducers and dashboards can render them without ambiguity?
- How should mirror-sync rollback interact with a preserved branch/worktree when one runtime mirror lands and another fails?

## Next Focus

S6-07: define the shared deep-improvement promotion state taxonomy and journal events that connect scoring gates, branch/worktree preservation, rollback, and final canonical merge without overloading `promoted` as both "accepted" and "shipped."
