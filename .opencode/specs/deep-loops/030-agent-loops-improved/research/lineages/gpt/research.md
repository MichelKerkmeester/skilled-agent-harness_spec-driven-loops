# Deep Research Synthesis - GPT Lineage Round 2

## Stop Report

- Stop reason: `maxIterationsReached`.
- Iterations completed: 35/35.
- Convergence before iteration 35 was treated as telemetry only.
- Scope: `.opencode/specs/deep-loops/030-agent-loops-improved`, phases 001-009, deep-loop runtime fan-out/salvage/merge scripts, deep-review/deep-research workflow surfaces, and lineage artifacts.

## Disposition Delta From Round 1

- Fixed: `fanout-merge.cjs` now accepts `findings` as an alias for `keyFindings` and emits `schema_mismatch` warnings. [SOURCE: .opencode/skills/deep-loop-runtime/scripts/fanout-merge.cjs:531] [SOURCE: .opencode/skills/deep-loop-runtime/scripts/fanout-merge.cjs:533] [SOURCE: .opencode/specs/deep-loops/030-agent-loops-improved/009-research-backlog-remediation/001-fanout-merge-schema-tolerance/implementation-summary.md:71]
- Still live: comment-hygiene markers, salvage filename padding, 4-hour timeout cap, graph metadata drift, description truncation, phase-map/completion_pct drift, stale native lock, old packet identity residue, and stale-active review registries.
- Changed: phase `009-research-backlog-remediation` now exists and owns most remediation work, but its own metadata is already stale. [SOURCE: .opencode/specs/deep-loops/030-agent-loops-improved/spec.md:106] [SOURCE: .opencode/specs/deep-loops/030-agent-loops-improved/009-research-backlog-remediation/spec.md:147]

## Ranked Backlog

1. P0: Regenerate phase 009 metadata before using it as the remediation hub.
   Evidence: 009 spec lists ten planned children, the filesystem has at least children 001-004, but graph metadata lists only child 001 and `last_active_child_id` is null. [SOURCE: .opencode/specs/deep-loops/030-agent-loops-improved/009-research-backlog-remediation/spec.md:115] [SOURCE: .opencode/specs/deep-loops/030-agent-loops-improved/009-research-backlog-remediation/spec.md:124] [SOURCE: .opencode/specs/deep-loops/030-agent-loops-improved/009-research-backlog-remediation/graph-metadata.json:6] [SOURCE: .opencode/specs/deep-loops/030-agent-loops-improved/009-research-backlog-remediation/graph-metadata.json:124]
   Fix: backfill 009 `children_ids`, `key_files`, `last_active_child_id`, and truncated description after writing any generation-2 crosswalk.

2. P0: Complete `009/002-fanout-timeout-override`.
   Evidence: live `computeLineageTimeoutMs` still returns `Math.min(..., 4 * 60 * 60 * 1000)`, and 009/002 tasks for parsing/threading `--lineage-timeout-hours` are unchecked. [SOURCE: .opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:884] [SOURCE: .opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:887] [SOURCE: .opencode/specs/deep-loops/030-agent-loops-improved/009-research-backlog-remediation/002-fanout-timeout-override/tasks.md:52]
   Fix: default-preserving override plus tests for default 4h and raised ceiling.

3. P0: Complete `009/003-runtime-hygiene-fixes` for comment markers and salvage filename padding.
   Evidence: command YAML still has six `F-010-B5-*` markers; skill docs add more `F-007-B2-*` markers; salvage writes `iteration-${iterNum}.md`. [SOURCE: .opencode/commands/deep/assets/deep_research_auto.yaml:301] [SOURCE: .opencode/commands/deep/assets/deep_review_auto.yaml:395] [SOURCE: .opencode/skills/cli-opencode/references/agent_delegation.md:225] [SOURCE: .opencode/skills/deep-loop-runtime/scripts/fanout-salvage.cjs:112]
   Fix: repo-scoped comment-hygiene lint with allowlists, plus zero-padded salvage placeholder filenames and regression tests.

4. P0: Add review-finding adjudication before claiming remediated review findings are closed.
   Evidence: GLM and Codex registries still show active findings, while current code has fixed at least mixed salvage and lag-ceiling status mapping. [SOURCE: .opencode/specs/deep-loops/030-agent-loops-improved/review/lineages/glm/deep-review-findings-registry.json:18] [SOURCE: .opencode/specs/deep-loops/030-agent-loops-improved/review/lineages/codex/deep-review-findings-registry.json:11] [SOURCE: .opencode/skills/deep-loop-runtime/scripts/lib/cli-guards.cjs:185] [SOURCE: .opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:256]
   Fix: replay each active review finding and persist `resolved`, `still_active`, or `accepted_risk` rows with file/command evidence.

5. P1: Implement `009/004` as a script-first sync, then promote checks into semantic validation.
   Evidence: phase parents still show Draft rows while children claim Complete; completion_pct remains 0 in Complete children; 009/004 correctly identifies this as a never-synced-after-completion class. [SOURCE: .opencode/specs/deep-loops/030-agent-loops-improved/007-testing/spec.md:198] [SOURCE: .opencode/specs/deep-loops/030-agent-loops-improved/007-testing/001-hermetic-test-isolation/spec.md:27] [SOURCE: .opencode/specs/deep-loops/030-agent-loops-improved/009-research-backlog-remediation/004-phase-doc-map-and-completion-pct-sync/spec.md:60]
   Fix: idempotent `sync-phase-map-status` backfill plus strict checks for phase-map status and `completion_pct` consistency.

6. P1: Make `--stop-policy=max-iterations` first-class for `/deep:research`.
   Evidence: research command routing does not list `--stop-policy`, while fanout prompt and review YAML already use max-iterations semantics. [SOURCE: .opencode/commands/deep/research.md:112] [SOURCE: .opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:794] [SOURCE: .opencode/commands/deep/assets/deep_review_auto.yaml:557]
   Fix: document/parse the flag and add a test proving convergence cannot stop before max iterations when policy is `max-iterations`.

7. P1: Reframe detached fan-out prompts as command-host lineage execution, not LEAF-agent self-execution.
   Evidence: generated prompt says `You are a deep-research/deep-review agent` and asks it to run full phases, while deep-research says the agent is LEAF-only and command YAML owns lifecycle. [SOURCE: .opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:827] [SOURCE: .opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:837] [SOURCE: .opencode/skills/deep-loop-workflows/deep-research/SKILL.md:13] [SOURCE: .opencode/skills/deep-loop-workflows/deep-research/SKILL.md:23]
   Fix: prompt as a detached command-host executor or invoke the command surface directly.

8. P1: Replace prompt-only lineage write isolation with enforceable sandboxing where possible.
   Evidence: fanout-run explicitly says lineage write boundary is enforced by the prompt, not a narrower sandbox. [SOURCE: .opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:1304] [SOURCE: .opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:1308] [SOURCE: .opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:1309]
   Fix: path-scoped workspace write if supported; otherwise explicit unsafe fallback with fatal warning for review/research fan-out.

9. P1: Clean old packet identity and stale lock residue.
   Evidence: root trigger phrases still include `156 agent loops`, phase 001 still references `123-agent-loops-improved`, and native lock points at the pre-migration 156 path. [SOURCE: .opencode/specs/deep-loops/030-agent-loops-improved/spec.md:8] [SOURCE: .opencode/specs/deep-loops/030-agent-loops-improved/001-reference-research/spec.md:49] [SOURCE: .opencode/specs/deep-loops/030-agent-loops-improved/review/lineages/native/.deep-review.lock:6]
   Fix: migrate live docs/metadata to `030-agent-loops-improved`; archive/tombstone stale locks rather than leaving them as key files.

10. P1: Repair description/graph generation truncation.
    Evidence: root and 009 descriptions truncate mid-word/mid-sentence, and 009 graph causal summary truncates mid-list. [SOURCE: .opencode/specs/deep-loops/030-agent-loops-improved/description.json:4] [SOURCE: .opencode/specs/deep-loops/030-agent-loops-improved/009-research-backlog-remediation/description.json:3] [SOURCE: .opencode/specs/deep-loops/030-agent-loops-improved/009-research-backlog-remediation/graph-metadata.json:112]
    Fix: fix generator truncation policy or add ellipsis/complete-word trimming; regenerate affected metadata.

11. P2: Close ADR/checklist governance gaps explicitly.
    Evidence: 003 parent is Complete; only 002 ADR child has a decision record; other ADR-titled children are Complete but have stale continuity and no discovered decision record/checklist. [SOURCE: .opencode/specs/deep-loops/030-agent-loops-improved/003-deep-loop-workflows/spec.md:45] [SOURCE: .opencode/specs/deep-loops/030-agent-loops-improved/003-deep-loop-workflows/002-convergence-profile-unification-adr/decision-record.md:2] [SOURCE: .opencode/specs/deep-loops/030-agent-loops-improved/003-deep-loop-workflows/003-cross-mode-anti-convergence-adr/spec.md:44]
    Fix: add missing docs or explicit waivers in 009/007.

12. P2: Add strict template-default-content detection.
    Evidence: Complete folders still include unchecked `T001 Create project structure` rows. [SOURCE: .opencode/specs/deep-loops/030-agent-loops-improved/003-deep-loop-workflows/004-injection-inbox-provenance/tasks.md:53] [SOURCE: .opencode/specs/deep-loops/030-agent-loops-improved/007-testing/002-record-replay-cassette-harness/tasks.md:53]
    Fix: fail strict validation when Complete status coexists with template task rows, zeroed fingerprints, or unchecked completion criteria.

## Recommended Remediation Shape

Do not create a competing top-level phase. Continue inside phase `009-research-backlog-remediation`:

1. Finish `009/002` timeout override.
2. Finish `009/003` comment hygiene plus salvage filename padding.
3. Add a small adjudication/backfill child or fold into `009/006` to reconcile GLM/Codex/native review lineages.
4. Run `009/004` script-first sync for phase maps and completion_pct.
5. Regenerate graph metadata and descriptions for root and 009.
6. Promote the same drift classes to semantic validation after the one-off cleanup proves safe.

## Negative Knowledge

- The merge-schema silent drop should not be reimplemented; it is fixed in current code.
- Codex review registry is no longer empty; it is populated but stale-active.
- Phase 008 is not wholly template-only; the remaining problem is mixed evidence surfaces and some unchecked parent scaffold rows.
- Generation-1 research remains useful for crosswalk, but this report only ranks items re-verified against live files in this round.
