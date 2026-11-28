# Iteration 4: Phases 007–009 security, persistence, and proposal lifecycle

## Focus
Phase breadth pass: phases 007-per-bot-apps, 008-vault, and 009-skills — assess one-shot depth of schemas, secret boundaries, restart and rollback behavior, cross-phase interfaces, test fixtures, operator steps, and user-facing design; rank gaps and identify the first reference code to study.

## Findings
1. **Phase 007-per-bot-apps — P1:** The filter contract writes a temporary `.utcp_config.json` into the shared worktree and restores the original after the child exits, but it gives no per-worktree serialization rule for two concurrent runs; one run can replace the other run's active filter or restore the original while the other child is still using the path. Add child `007-worktree-config-serialization` with a per-worktree lease or isolated config handoff, kill/restart recovery, and a two-run overlapping fixture. Do not make 007 a phase parent: its filter, record field, refusal catalogue, and test matrix are otherwise one bounded change. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/007-per-bot-apps/spec.md:142,186] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/007-per-bot-apps/plan.md:60-68,115-118,141-143] [INFERENCE: the shared path is written and restored per run, with no lock or overlapping-run rule in the cited lifecycle.]
2. **Phase 008-vault — P0:** Storage and injection are detailed, but a builder still lacks the exact secret-name grammar and environment-name mapping, a complete versioned index schema, a migration/rollback path for existing `secrets:` declarations, and a consistent refusal/acceptance table; the keychain/file override also needs explicit semantics for replacing or forgetting an entry stored by the other backend. Consolidate these into `008-secret-store-contract-and-upgrade.md`, including index versions, backend transitions, orphan cleanup, upgrade preflight, and failure fixtures. Keep 008 as one security-store phase rather than a parent: the reviewed design is one store with one injection path. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/spec.md:96-99,147-165,237,245-247] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/plan.md:65-73,122-130,151-155] [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/003-plan-depth-research/research/lineages/vibe/iterations/iteration-006.md:15-27]
3. **Phase 009-skills — P1:** Loader caps, digest checks, prompt order, and the stale proposal pin have specific modules and fixtures, but proposal creation publishes `SKILL.md`, `proposal.json`, and a needs-you item as separate writes without a crash-safe commit or concurrent compare-and-create rule; the existing refusal only covers an item already present. Add `009-proposal-persistence-and-recovery.md` with exact proposal fields/revision semantics, the omitted `--name` behavior, atomic publication/idempotent retry, crash recovery, and parallel-proposal fixtures. Keep 009 as one phase with a local lifecycle addendum; its loader and proposal path are related skill authoring flows, and the current plan already gives their modules and tests. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/009-skills/spec.md:161-176,228-231] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/009-skills/plan.md:64-70,82-83,135-139] [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/003-plan-depth-research/research/lineages/vibe/iterations/iteration-007.md:15-23] [INFERENCE: the contract lists separate proposal files and review-item creation but no shared publication transaction.]

## Ruled Out
- Do not promote these phases to parents on their `/70` complexity totals alone. The decomposition gate requires the separate phase-score threshold and Level 3 documentation threshold; all three reviewed specs currently identify as Level 2. [SOURCE: .skilled/skills/system-spec-kit/references/structure/phase-definitions.md:59-66] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/007-per-bot-apps/spec.md:232] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/spec.md:237] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/009-skills/spec.md:255]
- The prior security and skill reviews already identified 008's grammar/mapping/index/migration/lock gaps and 009's grammar/default/sentinel/schema gaps; this pass rechecked those against the current requirements and did not count them as separate new findings. [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/003-plan-depth-research/research/lineages/vibe/iterations/iteration-006.md:15-27] [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/003-plan-depth-research/research/lineages/vibe/iterations/iteration-007.md:15-23]

## Dead Ends
- No named frontier node remained after iteration 3, so the expansive frontier block returned empty. The user-requested phase breadth focus was used; no frontier proposals were emitted.

## Edge Cases
- Ambiguous input: no new frontier focus was supplied after the three bound nodes were answered; selected the prior recommendation to review phases 007–009.
- Contradictory evidence: none. The current specs and prior sibling findings agree on the existing 008/009 gaps; this pass adds the shared-worktree concurrency risk for 007 and proposal-publication recovery for 009.
- Missing dependencies: none.
- Partial success: none.

## Sources Consulted
- specs/system-skilled-bots/003-openbot-parity-build/007-per-bot-apps/spec.md:104-108,110-126,140-153,181-187,232
- specs/system-skilled-bots/003-openbot-parity-build/007-per-bot-apps/plan.md:57-69,73-95,110-143
- specs/system-skilled-bots/003-openbot-parity-build/008-vault/spec.md:94-118,147-165,183-193,230-247
- specs/system-skilled-bots/003-openbot-parity-build/008-vault/plan.md:62-73,118-156
- specs/system-skilled-bots/003-openbot-parity-build/009-skills/spec.md:161-176,228-240,255
- specs/system-skilled-bots/003-openbot-parity-build/009-skills/plan.md:60-70,73-83,123-139
- specs/system-skilled-bots/context/OpenBot-main/desktop/src-tauri/src/host_access.rs:752-765
- specs/system-skilled-bots/context/rakazo-main/packages/adapters/src/secrets/secret-migration.ts:6-24,35-79
- specs/system-skilled-bots/context/OpenGhost-main/settings.js:306-314
- specs/system-skilled-bots/context/OpenGhost-main/skills.js:4-13
- specs/system-skilled-bots/context/hermes-muse-main/skills/companion/references/memory.md:18-21
- specs/system-skilled-bots/002-openbot-parity-research/003-plan-depth-research/research/lineages/vibe/iterations/iteration-006.md:15-37
- specs/system-skilled-bots/002-openbot-parity-research/003-plan-depth-research/research/lineages/vibe/iterations/iteration-007.md:15-33
- specs/system-skilled-bots/002-openbot-parity-research/003-plan-depth-research/research/lineages/vibe/iterations/iteration-009.md:15-29
- specs/system-skilled-bots/002-openbot-parity-research/003-plan-depth-research/research/lineages/codex-1/deep-research-config.json, deep-research-state.jsonl, deep-research-strategy.md, findings-registry.json; steer.md was absent at iteration start

## Assessment
- New information ratio: 0.83
- Questions addressed: whether phases 007, 008, and 009 are one-shot ready; whether any should become parents; which reference code to study first.
- Questions answered: 007 is nearly ready but needs overlap-safe config ownership; 008 is not ready until its store schema, grammar, migration, and backend semantics are made executable; 009 is not ready until its proposal write lifecycle and previously noted contract decisions are closed. None should become a parent from the reviewed evidence alone; recheck the separate thresholds after adding the artifacts.
- Reference order: 007, compare OpenBot's grant lifecycle before adapting the per-server filter; 008, study rakazo's secret matcher/guard and compare its compare-and-set migration with OpenGhost's move-to-keychain flow; 009, study OpenGhost's skill wrapper and Hermes Muse's stale-revision pin.

## Reflection
- What worked and why: reading each state-changing path as a concurrent or interrupted process exposed gaps that the happy-path module and test plans did not cover.
- What did not work and why: broad searches over all context repositories produced noisy output; narrowing to the phase's named source files and specific reference modules yielded direct evidence.
- What I would do differently: compare every multi-file write with its duplicate, interruption, and retry tests before judging the phase ready.

## Recommended Next Focus
Review phases 013-manual-testing-scenarios, 014-skilled-and-doc-alignment, and 015-deep-review for evidence integrity, close conditions, fix/retest loops, and how their outputs hand off; then synthesize all per-phase expansion candidates.
