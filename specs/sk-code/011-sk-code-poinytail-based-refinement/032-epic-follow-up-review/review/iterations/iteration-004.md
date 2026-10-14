# Deep Review Iteration 4

## Dimension

Traceability. I compared the requested Commit-Id and Pi Fast Mode claims with their code, feature documentation, and playbook evidence, and read the full v4.0.0.4 changelog.

## Files Reviewed

The 32 configured review paths were enumerated from [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/032-epic-follow-up-review/review/scope-files.txt:1]. Direct traceability reads covered the changelog, Commit-Id policy helper, sk-git feature catalog and lookup playbook, and the Pi extension README, source README, precedence code, handoff code, and startup/persistence/handoff playbooks. The unrelated changelog sections were read and their root-relative path tokens scanned, but their implementation behavior was not fully revalidated in this pass.

## Findings by Severity

### P0

No new P0 finding. Active R2-P0-001 remains: the untrusted-clone hook path can select and execute a clone-controlled helper [SOURCE: .skilled/scripts/git-hooks/prepare-commit-msg:78]. The changelog still claims the fallback avoids repository code [SOURCE: .skilled/changelog/skilled/v4.0.0.4.md:135].

### P1

No new P1 finding. Active R3-P1-001 remains: the commit and push gates accept the reserved all-zero ordinal while the allocator rejects it [SOURCE: .skilled/scripts/git-hooks/pre-push:311] [SOURCE: .skilled/skills/sk-git/scripts/commit-id-naming.sh:43].

### P2

#### R4-P2-001: Commit-Id catalog misstates enrollment for repositories without an allocator

- Case: A repository has no allocator in its tree, but its local `skilled.commitId` setting is true or its recent history contains a Commit-Id. The hook policy enrolls it, while the catalog says a repository that does not ship the allocator is left alone.
- File: `.skilled/skills/sk-git/feature-catalog/workflow-playbooks/conventional-commit-workflows.md:32`
- Evidence: The catalog makes the blanket no-allocator statement [SOURCE: .skilled/skills/sk-git/feature-catalog/workflow-playbooks/conventional-commit-workflows.md:32]. `cip_repo_wants_ids` checks local config first, then repository markers and recent history [SOURCE: .skilled/scripts/git-hooks/lib/commit-id-policy.sh:23] [SOURCE: .skilled/scripts/git-hooks/lib/commit-id-policy.sh:36]. The changelog documents the history-based rule [SOURCE: .skilled/changelog/skilled/v4.0.0.4.md:135].
- User impact: Readers can expect hooks to leave a repository alone when its configured policy or history actually requires Commit-Id trailers.
- Finding class: matrix/evidence.
- Scope proof: Compared the exact catalog statement with the complete enrollment function and its release-note description.
- Recommendation: Update the catalog to describe explicit local-config and recent-history enrollment, and link the policy helper.

## Traceability Checks

- `spec_code`: PARTIAL. The review phase spec is a scaffold, not a feature contract. The Commit-Id fallback contradiction remains in active R2-P0-001, and the allocator-versus-gate mismatch remains in active R3-P1-001.
- `checklist_evidence`: PARTIAL. Pi source anchors and playbooks align for startup, persistence, and handoff. Hook test sources were inspected but not run; the all-zero case remains uncovered as recorded by R3-P1-001.
- `skill_agent` / `agent_cross_runtime`: NOT APPLICABLE. No feature-owner agent for these hooks or the Pi extension was found in the runtime agent directories.
- `feature_catalog_code`: PARTIAL. The sk-git catalog's no-allocator statement conflicts with the current enrollment policy; Pi Fast Mode is documented in its README and source README, without a feature-catalog directory.
- `playbook_capability`: PARTIAL. Pi playbooks cover startup, persistence, and child preference. GIT-044 covers ID lookup queries, not enrollment or untrusted-clone fallback.
- `changelog_claim_audit`: PARTIAL. The complete 475-line changelog was read and root-relative path tokens were scanned. Commit-Id line 135 remains contradicted by active R2-P0-001; Pi Fast Mode line 427 matches the code and playbooks. Behavioral claims in the remaining sections are explicitly deferred because their implementation paths were not fully checked in this scoped iteration.

## Verdict

FAIL. This iteration adds one P2 traceability finding. Active P0 R2-P0-001 still forces FAIL; active P1 R3-P1-001 also remains open.

## Next Dimension

Maintainability. The non-target changelog behavior checks remain an explicit traceability limitation.

Review verdict: FAIL
