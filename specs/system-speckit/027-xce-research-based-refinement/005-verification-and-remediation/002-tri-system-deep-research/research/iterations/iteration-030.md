# Iteration 030 — Angle 30

**Angle:** Graph database lifecycle: growth, compaction, the untracked database/ dir contents, and whether any maintenance is documented or automated.

**Summary:** Spec-memory has the clearest lifecycle automation; skill-advisor is small and checkpoints WAL after scans; code-graph has the largest gap around ignored artifacts, snapshot retention, and compaction policy. The biggest practical risk is disk/worktree growth from recovery and quarantine artifacts that are created by code but not consistently ignored, documented, or pruned.

**Findings kept:** 5

## [P2][BUG] Code-graph apply artifacts leak into git status

- Evidence: .gitignore:117-120 only ignores the live code-graph DB, readiness markers and launcher metadata; command `git status --short --untracked-files=all -- .opencode/skills/system-code-graph/mcp_server/database` outputs untracked `apply-audit/*.jsonl`, nested `code-graph.sqlite-shm`, `code-graph.sqlite-wal`, and `recovery-*/code-graph.sqlite-*` files.
- Detail: The code-graph database directory is intended to be runtime state, but nested apply/recovery sidecars and audit logs remain unignored. This keeps developer worktrees dirty after verification-gated apply/recovery runs and makes accidental artifact staging plausible.
- Fix sketch: Add database-local ignore rules covering `apply-audit/**`, `recovery-*`, `quarantine-*`, and nested SQLite sidecars while preserving any tracked README/docs.

## [P2][REFINEMENT] Code-graph recovery snapshots have no retention policy

- Evidence: .opencode/skills/system-code-graph/mcp_server/lib/apply-orchestrator.ts:446-451 snapshots the DB triplet before mutation; .opencode/skills/system-code-graph/mcp_server/lib/recovery-procedures.ts:151-157 copies known-good triplets and :160-186 / :249-288 create recovery, quarantine, and bad-apply directories; command `du -ah .../system-code-graph/mcp_server/database` reports `323M .../apply-audit`, `83M .../quarantine-*`, `79M .../recovery-*`, `565M .../database`.
- Detail: Apply-mode recovery is well guarded functionally, but every committed recovery path can leave full SQLite triplet copies behind. I found creation paths and rollback cleanup for only empty quarantine directories, but no age/count/size retention or operator pruning command in the inspected code/docs.
- Fix sketch: Document and implement a bounded retention policy for code-graph apply-audit/recovery snapshots, for example keep latest N known-good copies and prune confirmed bad/recovery artifacts after successful verify.

## [P2][DOC-DRIFT] Spec-memory backup docs disagree with observed artifact placement

- Evidence: .opencode/skills/system-spec-kit/mcp_server/database/README.md:23 and :31 say pre-migration safety copies and quarantined corrupt databases live under `backups/`; .opencode/skills/system-spec-kit/mcp_server/database/backups/README.md:71-79 says `backups/` owns retention; command `du -ah .../system-spec-kit/mcp_server/database` reports `context-index.sqlite.corrupt-20260606` at 373M and `context-index.sqlite.pre-repair-20260611` at 422M in the parent database directory while `backups/` is only 8K.
- Detail: The documented lifecycle says large corrupt/pre-repair copies belong under `database/backups/`, but the current runtime directory has large copies beside the live DB. That means the retention guidance in `backups/README.md` does not cover the artifacts operators actually see.
- Fix sketch: Either move/standardize these copies into `backups/` or update the parent and backups READMEs with the real root-level naming, retention, and cleanup procedure.

## [P2][DOC-DRIFT] Vector shard docs say the folder is not an archive, but quarantine files accumulate there

- Evidence: .opencode/skills/system-spec-kit/mcp_server/database/vectors/README.md:23-24 says legacy/experimental shards get deleted once out of active rotation and the folder is not an archive; .opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:652-730 renames bad shard triplets to `.quarantined-*` and schedules rebuild; command `du -ah .../database/vectors` reports an 80M `context-vectors__ollama__...sqlite.quarantined-20260611T205438888Z-2628` alongside the 80M active shard.
- Detail: The implemented resilience path deliberately preserves quarantined vector shards as durable repair markers/forensics, but the vectors README describes deletion rather than quarantine retention. The current folder content confirms it can become an archive without a documented pruning rule.
- Fix sketch: Document quarantined vector shard lifecycle separately from legacy shard rotation and add a safe prune rule once repair completeness is confirmed.

## [P3][REFINEMENT] Code-graph has less automated compaction than spec-memory and skill-advisor

- Evidence: Command `grep wal_checkpoint|VACUUM|incremental_vacuum .opencode/skills/system-code-graph/mcp_server/**/*.ts` found only `.opencode/skills/system-code-graph/mcp_server/lib/recovery-procedures.ts:272` rollback checkpointing; code-graph writes/deletes are visible at `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:936-943`, :985, :1027-1034, :1149-1152, and :1520-1529. By contrast, spec-memory runs retention maintenance at `.opencode/skills/system-spec-kit/mcp_server/lib/governance/memory-retention-sweep.ts:367-380` and periodic retention at `.opencode/skills/system-spec-kit/mcp_server/lib/session/session-manager.ts:267-282`; skill-advisor checkpoints WAL after scan at `.opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/skill-graph-db.ts:469-478` and :1016-1019.
- Detail: Code-graph prunes rows and tombstones, but I did not find a routine VACUUM/incremental-vacuum or regular WAL checkpoint path outside rollback recovery. This is not currently a functional break, but it leaves long-term growth/fragmentation behavior less explicit than the other two graph-backed systems.
- Fix sketch: Add an operator-visible code-graph maintenance policy, even if the first version is just documented status metrics plus an explicit maintenance command rather than automatic compaction.
