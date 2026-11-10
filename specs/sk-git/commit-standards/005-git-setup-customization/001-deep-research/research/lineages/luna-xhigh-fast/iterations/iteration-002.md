# Iteration 2: repository-specific sk-git policy

## Focus

Map the skill-level rules, `hard-rules.json`, per-repository commit contracts, and remote branch allowlist: what users may adapt, where, what depends on each, and what a read-only check can establish.

## Actions Taken

- Read the sk-git `SKILL.md`, `hard-rules.json`, commit-message template, message-contract resolver, remote branch policy, allowlist resolver, and the advisory's rule loader.
- Spot-checked the actual sk-code adaptation guide after iteration 1; it places `skilled.trustRepoHooks` before hook installation and gives a read-only setup battery. [SOURCE: README.md:1447-1456,1478-1489]
- Read the state projection produced by the required append gateway and its projection mapping to reconcile the user-required finding count with the canonical log.

## Findings

1. Users may adapt the agent-facing git policy in `.skilled/skills/sk-git/SKILL.md`; today it requires fresh permission for pushes outside the allowlist and says the preflight hook advises while Git hooks enforce, so changing the prose without matching hook policy can leave agent guidance and enforcement out of sync; a doctor check can prove the skill file and referenced policy assets exist, but not that prose intent matches runtime behavior. [SOURCE: .skilled/skills/sk-git/SKILL.md:230-248,308-318]
2. Users may tune risky-command advisories in the adjacent `hard-rules.json`; it currently carries 17 warning rules, and a missing, malformed, or non-array file makes the reader return no rules while an unknown check is skipped, so those warnings disappear; the file is selected beside the loaded `SKILL.md` rather than through a separate repository setting, and a doctor check should prove valid JSON, unique rule IDs, recognized checks, and valid severities. [SOURCE: .skilled/skills/sk-git/hard-rules.json:1-104; .skilled/hooks/dispatch/lib/dispatch-rule-checks.mjs:12-23,259-282; .skilled/skills/sk-git/scripts/hooks/README.md:28-35]
3. A repository can change commit, PR, and branch contracts by copying the templates into `.sk-git/` or setting `skgit.contractDir`; the loader prefers that setting, then `.sk-git/`, then the repository's bundled assets, while a missing rules block means no enforcement and a malformed block blocks the gate, so setup should report the effective directory and each contract's enforced/not-enforced state rather than infer success from exit 0. [SOURCE: .skilled/skills/sk-git/SKILL.md:310-318; .skilled/skills/sk-git/assets/commit-message-template.md:177-184; .skilled/skills/sk-git/scripts/lib/message-contract.mjs:278-323; .skilled/skills/sk-git/scripts/validate-message.mjs:125-136,192-197]
4. A repository can add branch globs to `scripts/remote-branch-allowlist.txt`; `main` and `skilled/v*` remain built in, and deleting or emptying the additive file only narrows exceptions, while a broad glob permits any session to publish matching updates; setup should identify the file actually resolved for this checkout and report representative allow/deny matches without pushing. [SOURCE: .skilled/skills/sk-git/scripts/remote-branch-allowlist.txt:1-9; .skilled/skills/sk-git/scripts/worktree-naming.sh:142-182; .skilled/skills/sk-git/references/remote-branch-policy.md:34-44]

## Questions Answered

- Which sk-git policy inputs are repository-customizable, where are they set, and what behavior depends on them?

## Questions Remaining

- How do worktree naming/provisioning, Commit-Id allocation, hook trust, global hooks, and preflight advice interact?
- What can a read-only sk-git setup check prove, and how does `/doctor:git` currently route and report?
- Should setup be a new `/doctor:git` action or a separate command, and which proposals should be rejected?

## Dead Ends

- Rejected treating a successful `validate-message.mjs --explain` exit as proof of enforcement: the command returns 0 even when there is no contract directory or a kind has no enforced rules. [SOURCE: .skilled/skills/sk-git/scripts/validate-message.mjs:125-136]
- Rejected making the remote allowlist a denylist replacement: the current file is additive, and removing it deliberately leaves only the built-in exemptions. [SOURCE: .skilled/skills/sk-git/references/remote-branch-policy.md:36-44]

## Workflow Conflicts

The gateway accepted iteration 1 with `findingsCount: 4` and the delta carries the same count, but the canonical state-log projection omitted `findingsCount`; its mapper emits only iteration, status, novelty, ruled-out references, and timestamp. The current projection shows that omission. The deep-research contract requires the append gateway and forbids writing the state log directly, so the counted event input and delta remain authoritative for this field and the projection is left untouched. [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/legacy-projections/deep-research-contract.ts:214-224; specs/sk-git/033-git-setup-customization/001-deep-research/research/lineages/luna-xhigh-fast/deep-research-state.jsonl:2; specs/sk-git/033-git-setup-customization/001-deep-research/research/lineages/luna-xhigh-fast/events/iteration-001.json:1; specs/sk-git/033-git-setup-customization/001-deep-research/research/lineages/luna-xhigh-fast/deltas/iter-001.jsonl:1; .skilled/skills/system-deep-loop/deep-research/assets/prompt-pack-iteration.md.tmpl:71-80]

## Assessment

- newInfoRatio: 1.0
- Novelty: all four policy surfaces and their failure behavior are new to this lineage; convergence remains telemetry only.
- Confidence: high for documented behavior; the recommendation to add a read-only doctor check is derived from those current resolvers and validators.

## Reflection

The commit contract already has an explicit per-repository selection mechanism; the branch allowlist is a per-checkout additive file; `hard-rules.json` is attached to the loaded skill and fails open. The gateway count mismatch is a workflow projection limitation, not permission to bypass the required state writer.

## Recommended Next Focus

Trace worktree naming and provisioning, numbered branch allocation, Commit-Id allocation, and its opt-in repository setting.
