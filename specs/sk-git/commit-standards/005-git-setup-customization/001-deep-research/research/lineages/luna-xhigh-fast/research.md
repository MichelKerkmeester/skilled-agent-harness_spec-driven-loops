# Research: a doctor-style setup path for sk-git

## 1. Executive Summary

Add a read-only `setup` target to `/doctor:git`. That router already owns the Git hook and repository standards workflows, and its route manifest supports a `read-only` mutation class. Keep the diagnostic separate from the workflows that install hooks or change rules. Follow `/doctor:sk-code setup`: one pass, a result per check, and a repair command for each failure, with no applied repair. [SOURCE: .skilled/commands/doctor/git.md:39-67,82-87; .skilled/commands/doctor/_routes.yaml:27-30,236-267; .skilled/commands/doctor/assets/doctor-sk-code-setup.yaml:12-28,46-52]

The setup report must resolve effective policy and provenance across the repository's contract directory, branch allowlist, worktree base and provision list, Commit-Id policy, hook trust and installation, saved gate settings, and runtime advisory wiring. It must distinguish an effective policy from a working hook, and a configured advisory from a warning that has actually been delivered. Several current paths deliberately fail open or become silent when inputs are missing. [SOURCE: .skilled/skills/sk-git/scripts/lib/message-contract.mjs:278-323; .skilled/skills/sk-git/scripts/worktree-naming.sh:58-77,508-559; .skilled/scripts/git-hooks/lib/commit-id-policy.sh:17-40; .skilled/scripts/install-git-hooks.sh:112-149; .skilled/skills/sk-git/scripts/hooks/git-preflight-advisory.mjs:13-20,107-115]

## 2. Scope and Method

This report covers the sk-code precedent, the current `/doctor:git` routes, and each named sk-git policy, worktree, Commit-Id, hook, and advisory surface. It is based on the source and workflow files cited below, not on changing a repository's setup or exercising Git mutations. Iterations 1–5 and their structured deltas are recorded in this lineage. [SOURCE: specs/sk-git/033-git-setup-customization/001-deep-research/research/lineages/luna-xhigh-fast/iterations/iteration-001.md:1-18; specs/sk-git/033-git-setup-customization/001-deep-research/research/lineages/luna-xhigh-fast/iterations/iteration-002.md:1-19; specs/sk-git/033-git-setup-customization/001-deep-research/research/lineages/luna-xhigh-fast/iterations/iteration-003.md:1-18; specs/sk-git/033-git-setup-customization/001-deep-research/research/lineages/luna-xhigh-fast/iterations/iteration-004.md:1-18; specs/sk-git/033-git-setup-customization/001-deep-research/research/lineages/luna-xhigh-fast/iterations/iteration-005.md:1-19]

## 3. The sk-code Setup Precedent

The user guide and the doctor command have separate jobs. The guide explains which surfaces users may add or remove and the edits those changes entail; the doctor runs a check-only battery over the resulting repository and names repairs. Its workflow explicitly forbids writes and reports each leg as PASS, FAIL, or SKIP with repair text. [SOURCE: README.md:1447-1489; .skilled/commands/doctor/sk-code.md:29-61; .skilled/commands/doctor/assets/doctor-sk-code-setup.yaml:21-28,46-52]

That battery checks provisioning, structure, metadata, route guard and sync, drift, derived freshness, and a real route decision. This is a useful design precedent for sk-git, but the legs must inspect Git's actual resolvers and config rather than imitate sk-code's route checks. [SOURCE: .skilled/commands/doctor/assets/doctor-sk-code-setup.yaml:48-52; .skilled/commands/doctor/scripts/sk-code-setup-check.cjs:97-149,252-310]

## 4. Current `/doctor:git` Architecture

`/doctor:git` is a thin router whose routes are declared in `_routes.yaml`; today its targets are `hooks` and `standards`. The hooks workflow first reads saved gate settings and hook installation status, then enters an interactive change and approval loop. The standards workflow similarly reports the active contract, can initialize repository copies, and changes rules after approval. Neither target is the one-pass read-only setup diagnostic described in the sk-code precedent. [SOURCE: .skilled/commands/doctor/git.md:8-10,39-67,82-87; .skilled/commands/doctor/assets/doctor-git-hooks.yaml:78-103; .skilled/commands/doctor/assets/doctor-git-standards.yaml:80-121]

## 5. Agent-Facing Policy in `SKILL.md`

- **Likely adaptation:** adjust the repository's agent guidance for push approval and Git workflow. The current skill requires fresh permission for pushes outside the allowlist and describes preflight advice versus hook enforcement.
- **Set today:** `.skilled/skills/sk-git/SKILL.md`, including the remote-push and advisory sections.
- **What can break:** changing the prose without changing the corresponding policy or hook can leave agent guidance inconsistent with actual enforcement; removing the file also removes the instructions that point agents to those controls.
- **Read-only proof:** report the loaded skill path, required policy references, and their presence. A static check can establish those facts, but cannot prove that natural-language guidance and runtime behavior have the same meaning. [SOURCE: .skilled/skills/sk-git/SKILL.md:230-248,308-318]

## 6. Risk Advisory Rules in `hard-rules.json`

- **Likely adaptation:** change which risky Git commands receive a warning.
- **Set today:** `hard-rules.json` beside the loaded sk-git `SKILL.md`; the preflight advisory reads this same sidecar.
- **What can break:** an absent, unreadable, malformed, or non-array file becomes an empty rule set; a rule with an unknown check is skipped. Warnings can therefore disappear without blocking the Git command.
- **Read-only proof:** parse the sidecar as an array, check each rule's required fields and supported check name, and report duplicate IDs or unsupported severities as diagnostic findings. Do not treat successful JSON parsing alone as proof that each rule can run. [SOURCE: .skilled/skills/sk-git/hard-rules.json:1-104; .skilled/hooks/dispatch/lib/dispatch-rule-checks.mjs:14-23,259-282; .skilled/skills/sk-git/scripts/hooks/README.md:28-35]

## 7. Commit, PR, and Branch Contracts

- **Likely adaptation:** apply repository-specific commit-message, PR-description, and branch-name rules, including matching template prose to enforcement.
- **Set today:** copy templates into `.sk-git/`, or point `skgit.contractDir` at a contract directory. The resolver prefers that Git config value, then `.sk-git/`, then the repository's bundled assets.
- **What can break:** no resolved rules block means no enforcement for that kind; an explicit config path that is missing or a malformed rules block makes the gate fail. Editing rules without matching the surrounding template prose leaves advice out of date.
- **Read-only proof:** report the resolved directory and source, each contract file, and whether its rules block is absent, valid/enforced, or malformed. Show prose drift separately. `/doctor:git standards` already owns approved initialization and rule changes. A zero exit from `validate-message.mjs --explain` is not sufficient: it can return zero when no rules are active. [SOURCE: .skilled/skills/sk-git/scripts/lib/message-contract.mjs:278-323; .skilled/skills/sk-git/assets/commit-message-template.md:177-184; .skilled/skills/sk-git/scripts/validate-message.mjs:125-136,192-197; .skilled/commands/doctor/assets/doctor-git-standards.yaml:22-33,80-94,102-121]

## 8. Remote Branch Allowlist

- **Likely adaptation:** add branch patterns that can be pushed without a fresh approval for that push.
- **Set today:** `.skilled/skills/sk-git/scripts/remote-branch-allowlist.txt`; it adds patterns to built-in `main` and `skilled/v*` exceptions.
- **What can break:** removing or emptying the file removes only added exceptions; broad patterns allow matching updates without the normal prompt. Replacing it with a denylist would invert the current behavior.
- **Read-only proof:** identify the file used, parse its patterns, and show representative allowed and rejected branch-name results without pushing. Keep built-in exceptions visible in the output. [SOURCE: .skilled/skills/sk-git/scripts/remote-branch-allowlist.txt:1-9; .skilled/skills/sk-git/scripts/worktree-naming.sh:142-182; .skilled/skills/sk-git/references/remote-branch-policy.md:34-44]

## 9. Worktree Naming and Provisioning

- **Likely adaptation:** relocate worktrees and adjust the inventory of packages and build outputs needed in a fresh worktree.
- **Set today:** `SPECKIT_WORKTREE_BASE` takes precedence over Git config `speckit.worktreeBase`; the fallback is `<main-worktree>/.worktrees`. The package/build inventory is `scripts/worktree-provision-paths.txt`. The numbered branch grammar is implemented in the shared allocator and reused by validators; there is no separate per-repository grammar setting in the inspected interface.
- **What can break:** a base mismatch separates the configured location from the paths users expect. A missing provision list returns an error after the new worktree is created; omitting package/build entries can leave dependencies or outputs absent, making checks fail or appear to pass without compiling the intended package.
- **Read-only proof:** report the effective base, compare registered worktree paths and branch names with it, parse each provision-list entry, verify package manifests and declared output paths, and label missing dependencies/build outputs. Do not install packages or run builds in a diagnostic pass. [SOURCE: .skilled/skills/sk-git/scripts/worktree-naming.sh:11-17,58-77,398-425,457-474,508-559; .skilled/skills/sk-git/scripts/worktree-provision-paths.txt:1-28; .skilled/skills/sk-git/scripts/README.md:17]

## 10. Commit-Id Allocation and Opt-In

- **Likely adaptation:** opt a repository into or out of Commit-Id stamping and enforcement.
- **Set today:** local Git config `skilled.commitId=true|false` wins. Without it, the shared hook policy opts in repositories that ship the allocator or toolchain sentinel, or whose recent history already contains valid Commit-Id trailers. The ordinal format and allocator are shared implementation, not separate format settings.
- **What can break:** setting `false` stops both stamping and the required-ID gate while the shipped author template still describes the trailer as mandatory. If a repository is covered but the hook helper or allocator is missing, the message can remain unstamped and the later `commit-msg` check blocks it.
- **Read-only proof:** calculate the policy result from local config, sentinels, and history; check helper/allocator presence and the actual installed hook target. Do not call `allocate`, which reserves and writes the high-water mark. A format change would have to remain aligned across allocator, policy helper, stamper, commit gate, history scanning, and template. [SOURCE: .skilled/scripts/git-hooks/lib/commit-id-policy.sh:17-48; .skilled/skills/sk-git/scripts/commit-id-naming.sh:5-18,30-48,190-231,266-271; .skilled/scripts/git-hooks/prepare-commit-msg:97-119,286-313; .skilled/scripts/git-hooks/commit-msg:60-76; .skilled/skills/sk-git/assets/commit-message-template.md:41-47]

## 11. Hook Trust, Lifecycle Hooks, and Gate Settings

- **Likely adaptation:** decide whether this clone's own hook scripts may run, whether lifecycle hooks are installed at the effective Git hook path, and which optional gates stay enabled.
- **Set today:** `.skilled/scripts/git-hooks/` supplies lifecycle hook sources. Git resolves the target from effective `core.hooksPath`; local and global values are reported by installer `--status`. A clone's own hook code runs when it shares the installed checkout's Git common directory or local config has `skilled.trustRepoHooks=true`; command-line and environment values do not grant trust. Persistable gate switches use local or global `speckit.hooks.<key>` values listed in `gates.tsv`.
- **What can break:** an untrusted clone skips its own toolchain checks; trust covers all branches and worktrees of that repository, not just one branch. A shadowed or missing hook can mean the expected gate is not live. Turning off an optional saved gate changes that check; saved per-push approvals and whole-hook kill switches have different owners, while `commit-msg` has no off switch in the hooks workflow.
- **Read-only proof:** report the local trust decision and common-directory match; effective hooks path and scope; each hook source, resolved target, missing or shadowed state; active gate values and their config scopes. Installer `--status` already reports path and message-contract state, and `/doctor:git hooks` already reads gate settings before offering changes. [SOURCE: .skilled/scripts/git-hooks/pre-commit:28-57; .skilled/scripts/install-git-hooks.sh:29-50,96-149,194-209; .skilled/scripts/git-hooks/lib/gate-config.sh:5-16,20-39; .skilled/commands/doctor/assets/doctor-git-hooks.yaml:22-42,78-83]

The preflight advisory is related but distinct from lifecycle enforcement. It reads `hard-rules.json`, is delivered through six runtime adapters, and can be globally, family, or rule suppressed. It warns only; malformed or unsupported input and failed checks approve silently. A setup check can inspect registration files for the active runtime and current suppression values, but must label those as configured coverage rather than proof that a warning was delivered. [SOURCE: .skilled/skills/sk-git/SKILL.md:242-257; .skilled/skills/sk-git/scripts/hooks/README.md:18-35,71-84; .skilled/skills/sk-git/scripts/hooks/git-preflight-advisory.mjs:13-20,57-69,76-115]

## Eliminated Alternatives

| Approach | Reason eliminated | Evidence | Iteration(s) |
|---|---|---|---|
| Make the setup diagnostic apply repairs | The sk-code setup contract forbids writes and leaves repairs to the operator; Git settings and standards already have approved mutation workflows. | [SOURCE: .skilled/commands/doctor/assets/doctor-sk-code-setup.yaml:21-28; .skilled/commands/doctor/assets/doctor-git-hooks.yaml:90-103; .skilled/commands/doctor/assets/doctor-git-standards.yaml:102-121] | 1, 5 |
| Replace the additive branch allowlist with a denylist | Existing built-in exceptions and additive pattern behavior would be inverted. | [SOURCE: .skilled/skills/sk-git/references/remote-branch-policy.md:34-44] | 2 |
| Treat successful `validate-message --explain` as proof of enforcement | It can exit zero when no rules are active. | [SOURCE: .skilled/skills/sk-git/scripts/validate-message.mjs:125-136] | 2, 5 |
| Add one setting for a custom Commit-Id format | The observed format is shared across scanning, minting, hook policy, gates, and template; no standalone format setting appeared in those interfaces. | [SOURCE: .skilled/skills/sk-git/scripts/commit-id-naming.sh:41-48; .skilled/scripts/git-hooks/lib/commit-id-policy.sh:17-40; .skilled/scripts/git-hooks/prepare-commit-msg:101-119,286-313; .skilled/scripts/git-hooks/commit-msg:63-75; .skilled/skills/sk-git/assets/commit-message-template.md:41-47] | 3 |
| Add a separate `/doctor:sk-git` router | `/doctor:git` already owns sk-git's Git-specific targets in one route manifest; a second router would divide the same owner and domain. | [SOURCE: .skilled/commands/doctor/git.md:6-10,39-54; .skilled/commands/doctor/_routes.yaml:236-267] | 5 |
| Reuse the current `hooks` target as the setup check | Its read phase flows into an interactive change menu and writes after approval, so it does not provide the read-only setup result. | [SOURCE: .skilled/commands/doctor/assets/doctor-git-hooks.yaml:78-103] | 5 |
| Return one healthy/unhealthy result from file presence or exit code | Missing contracts and fail-open advisory paths can return success or silence while enforcement/advice is absent. | [SOURCE: .skilled/skills/sk-git/scripts/lib/message-contract.mjs:278-323; .skilled/skills/sk-git/scripts/hooks/git-preflight-advisory.mjs:13-20,107-115] | 2, 5 |

## 12. Open Questions

No blocking research question remains. During implementation, choose whether the first version checks only the active AI runtime's preflight registration or reports all six adapters, and define how it labels an adapter as configured when no live runtime invocation is performed. This is a product choice about report coverage, not a gap in the observed sources. [SOURCE: .skilled/skills/sk-git/scripts/hooks/README.md:71-84; .skilled/commands/doctor/assets/doctor-sk-code-setup.yaml:48-52]

## 13. Read-Only Setup Proof Contract

Each result should name the evidence it inspected and use per-surface states such as PASS, FAIL, SKIP, and UNKNOWN. At minimum, the check should prove:

| Surface | Evidence to inspect | Limit to state |
|---|---|---|
| Agent policy and advisory rules | Skill and sidecar paths; JSON shape and supported checks; do not equate present files with semantic alignment. [SOURCE: .skilled/skills/sk-git/SKILL.md:230-248; .skilled/hooks/dispatch/lib/dispatch-rule-checks.mjs:14-23,259-282] | Cannot mechanically prove natural-language intent matches enforcement. |
| Commit/PR/branch rules | Effective contract directory/source, file and rule-block state for each kind. [SOURCE: .skilled/skills/sk-git/scripts/lib/message-contract.mjs:278-323] | Absent rules may mean no enforcement, not a pass. |
| Remote pushes | Allowlist file resolution and example match results including built-ins. [SOURCE: .skilled/skills/sk-git/scripts/worktree-naming.sh:142-182; .skilled/skills/sk-git/references/remote-branch-policy.md:34-44] | Do not push to test the result. |
| Worktrees | Effective base, existing registered paths/branch grammar, provision list, package manifests, declared outputs. [SOURCE: .skilled/skills/sk-git/scripts/worktree-naming.sh:58-77,203,508-559; .skilled/skills/sk-git/scripts/worktree-provision-paths.txt:1-28] | Cannot prove a future dependency install or build. |
| Commit-Id | Effective opt-in policy, helper/allocator availability, and hook targets. [SOURCE: .skilled/scripts/git-hooks/lib/commit-id-policy.sh:17-48; .skilled/scripts/git-hooks/prepare-commit-msg:97-119; .skilled/scripts/install-git-hooks.sh:112-149] | Must not allocate an ID or claim a commit was stamped. |
| Trust, lifecycle hooks, and saved gates | Local trust, Git common-directory relation, effective hooks path, resolved hook targets, and local/global gate values. [SOURCE: .skilled/scripts/git-hooks/pre-commit:28-57; .skilled/scripts/install-git-hooks.sh:112-149; .skilled/scripts/git-hooks/lib/gate-config.sh:20-39] | Trust is a code-execution choice; show it, do not enable it. |
| Runtime advisory | Active runtime adapter registration, referenced file/symlink, sidecar availability, and known suppression settings. [SOURCE: .skilled/skills/sk-git/scripts/hooks/README.md:71-84; .skilled/skills/sk-git/scripts/hooks/git-preflight-advisory.mjs:57-69,76-115] | Static configuration does not prove live delivery; the advisory never enforces the Git operation. |

The battery must not install hooks, set trust, modify Git config, rewrite templates, allocate identifiers, provision dependencies, build packages, or push branches. Those actions are either an explicit operator choice or a different gate. [SOURCE: .skilled/commands/doctor/assets/doctor-sk-code-setup.yaml:21-28; .skilled/commands/doctor/assets/doctor-git-hooks.yaml:63-72,90-103; .skilled/commands/doctor/assets/doctor-git-standards.yaml:64-74,102-121]

## 14. Command Placement

Place the diagnostic at `/doctor:git setup`, as a third target in the existing router and `_routes.yaml`, with `mutating: read-only` and no Gate 3 write target. The router already resolves each target to a workflow and presentation contract, and the route schema explicitly allows read-only actions. Keep `hooks` and `standards` as the repair paths they are today. [SOURCE: .skilled/commands/doctor/git.md:39-67,71-87; .skilled/commands/doctor/_routes.yaml:27-30,236-267]

Keep the human adaptation guide separate from this check. That mirrors the sk-code pattern: documentation tells a repository owner what to adapt, while the setup command reports the current state and repairs. [SOURCE: README.md:1447-1489; .skilled/commands/doctor/sk-code.md:53-61]

## 15. Result and Repair Handoff

Return a short overall status, a row per surface, the selected source/config value, what the check actually verified, and one repair command or owning doctor route for each failure. Preserve SKIP or UNKNOWN where the runtime or environment cannot be inspected. Do not mark an absent contract as healthy just because the validator returned zero, and do not present an advisory as a blocking gate. [SOURCE: .skilled/commands/doctor/assets/doctor-sk-code-setup.yaml:48-52; .skilled/skills/sk-git/scripts/validate-message.mjs:125-136; .skilled/skills/sk-git/scripts/hooks/git-preflight-advisory.mjs:13-20,129-134]

## 16. Convergence and Workflow Notes

The loop reached its configured cap: five iterations, with all five key questions checked answered. The iteration information ratios were 1.0, 1.0, 1.0, 1.0, and 0.9 (mean 0.98); the reducer's convergence score of 0.9 is telemetry only because the configured stop policy is `max-iterations`. [SOURCE: specs/sk-git/033-git-setup-customization/001-deep-research/research/lineages/luna-xhigh-fast/deep-research-config.json:3-10; specs/sk-git/033-git-setup-customization/001-deep-research/research/lineages/luna-xhigh-fast/deep-research-state.jsonl:2-6; specs/sk-git/033-git-setup-customization/001-deep-research/research/lineages/luna-xhigh-fast/findings-registry.json:401-411; specs/sk-git/033-git-setup-customization/001-deep-research/research/lineages/luna-xhigh-fast/deep-research-strategy.md:62-67]

The registry reports five resolved and zero open questions, but also six carried-forward open-question entries; the strategy marks all key questions answered while its generated carried-forward section is stale. The gateway's state projection also omits `findingsCount`, although each canonical event input and delta iteration row records the count matching its narrative. These reducer/projection limitations are documented in the iteration records and left unmodified. [SOURCE: specs/sk-git/033-git-setup-customization/001-deep-research/research/lineages/luna-xhigh-fast/findings-registry.json:400-405; specs/sk-git/033-git-setup-customization/001-deep-research/research/lineages/luna-xhigh-fast/deep-research-strategy.md:62-67,180-195; specs/sk-git/033-git-setup-customization/001-deep-research/research/lineages/luna-xhigh-fast/deep-research-state.jsonl:2-6; specs/sk-git/033-git-setup-customization/001-deep-research/research/lineages/luna-xhigh-fast/iterations/iteration-002.md:35-37]

Stop reason: `maxIterationsReached`. The workflow's packet spec writeback and `validate.sh` step were skipped because the dispatch limits writes to this lineage and forbids that validator; the resource map and final report are lineage-local. [SOURCE: .skilled/commands/deep/assets/deep-research-auto.yaml:145-170,2209-2232; specs/sk-git/033-git-setup-customization/001-deep-research/research/lineages/luna-xhigh-fast/events/iteration-005.json:1-25]

## 17. Proposed Implementation Phases

1. **Freeze the diagnostic contract.** Define target inputs, per-surface PASS/FAIL/SKIP/UNKNOWN rules, evidence paths, repair handoffs, and the no-write boundary. Keep user guidance separate from checker behavior, following the sk-code setup division. [SOURCE: .skilled/commands/doctor/assets/doctor-sk-code-setup.yaml:21-28,46-52]
2. **Build the read-only checker.** Reuse the existing contract resolver, worktree resolver, hook status report, Commit-Id policy, gate registry, and runtime adapter inventory; add explicit checks for hard-rule structure and branch-pattern examples. Keep all probes read-only and expose provenance. [SOURCE: .skilled/skills/sk-git/scripts/lib/message-contract.mjs:278-323; .skilled/skills/sk-git/scripts/worktree-naming.sh:58-77; .skilled/scripts/install-git-hooks.sh:112-149; .skilled/scripts/git-hooks/lib/commit-id-policy.sh:17-48; .skilled/scripts/git-hooks/lib/gate-config.sh:20-39; .skilled/skills/sk-git/scripts/hooks/README.md:71-84]
3. **Wire `/doctor:git setup`.** Add a read-only route and workflow, update the router target help and presentation contract, and leave existing `hooks` and `standards` approvals and mutation boundaries intact. [SOURCE: .skilled/commands/doctor/git.md:30-67,71-87; .skilled/commands/doctor/_routes.yaml:236-267]
4. **Prove the report against fixtures.** Cover absent/malformed contracts, broad and empty allowlists, relocated worktree bases, missing provision outputs, Commit-Id true/false/default cases, untrusted clones, shadowed hooks, saved gate scopes, and missing/suppressed advisory adapters. Assert both each result row and that the setup route writes nothing. [SOURCE: .skilled/skills/sk-git/scripts/lib/message-contract.mjs:292-323; .skilled/skills/sk-git/references/remote-branch-policy.md:34-44; .skilled/scripts/git-hooks/lib/commit-id-policy.sh:17-40; .skilled/scripts/install-git-hooks.sh:112-149; .skilled/skills/sk-git/scripts/hooks/git-preflight-advisory.mjs:13-20,57-69]
