---
title: "Research: a doctor-style setup check for sk-git"
description: "Merged synthesis of two research lineages on how a repository user adapts sk-git, and the read-only /doctor:git setup check that proves the result."
trigger_phrases:
  - "doctor git setup"
  - "sk-git setup check"
  - "sk-git customization"
importance_tier: "normal"
contextType: "research"
---
# Research: a doctor-style setup check for sk-git

Two lineages ran five iterations each: `luna-xhigh-fast` (cli-codex, gpt-6-luna, xhigh, fast tier) and `swe-2-max` (cli-devin, swe-2-max). Both stopped at the configured cap. Their own syntheses are in `lineages/luna-xhigh-fast/research.md` and `lineages/swe-2-max/research.md`. This file merges them and records which claims the orchestrator checked against the code.

## 1. Recommendation

Add a third target, `/doctor:git setup`, to the existing `/doctor:git` router. Make it `mutating: read-only` with no Gate 3 write target. It runs one battery script that inspects each customizable sk-git surface in its check-only form, prints PASS, FAIL, SKIP or UNKNOWN per leg with the source it inspected, and names one repair command or owning route per failure. It never writes. The existing `hooks` and `standards` targets stay the repair paths. Both lineages reached this answer independently. [SOURCE: .skilled/commands/doctor/_routes.yaml:27-30,236-273] [SOURCE: .skilled/commands/doctor/git.md:39-67] [SOURCE: .skilled/commands/doctor/assets/doctor-sk-code-setup.yaml:21-28,46-52]

This is the shape `/doctor:sk-code setup` took: a guide that tells the repository owner what to adapt, and a doctor target that verifies the result and hands back repairs. [SOURCE: README.md:1447-1489] [SOURCE: .skilled/commands/doctor/sk-code.md:29-61]

## 2. Why a Setup Check Is Needed

Several sk-git paths fail open or go quiet when their input is wrong, so a repository can look configured while a rule is not enforced:

- `validate-message.mjs --explain` exits 0 when no contract directory resolves, so a zero exit is not proof that any rule is enforced. [SOURCE: .skilled/skills/sk-git/scripts/validate-message.mjs:125-136]
- A `hard-rules.json` rule that names an unknown check is skipped on every command, with no warning. [SOURCE: .skilled/hooks/dispatch/lib/dispatch-rule-checks.mjs:274-283]
- An untrusted clone resolves its hook helpers under `/dev/null`, so its own gates are skipped, while `commit-msg` and the Commit-Id check still run. [SOURCE: .skilled/scripts/git-hooks/pre-commit:28-56]
- The preflight advisory approves silently on malformed input or a failed check. [SOURCE: .skilled/skills/sk-git/scripts/hooks/git-preflight-advisory.mjs:13-20,107-115]

## 3. Customizable Surfaces

Ownership class: **A** is repository config, which any repository can change. **B** is a file inside the vendored sk-git tree, which only a repository carrying its own `.skilled/` copy can change. On a shared install it is global to every repository. **C** is a runtime adapter registration.

| Surface | Class | Set today | What breaks | What the check must prove |
|---|---|---|---|---|
| Commit, PR and branch rules | A | `skgit.contractDir`, then `.sk-git/`, then the shipped assets | A `skgit.contractDir` naming a missing folder, or a malformed rules block, blocks every gated commit and push. No rules block means no enforcement for that kind | The resolved folder and its source, and per kind whether the block is absent, enforced or malformed [SOURCE: .skilled/skills/sk-git/scripts/lib/message-contract.mjs:278-324] |
| Contract folder setting | A | `skgit.contractDir`, read only from config files. A `git -c` flag or `GIT_CONFIG_*` variable is ignored | A stale path blocks all commits | When set, the path exists and its blocks parse [SOURCE: .skilled/skills/sk-git/scripts/lib/message-contract.mjs:284-296] |
| Advisory rules | B | `hard-rules.json` beside `SKILL.md`, with no repository overlay | Malformed JSON becomes an empty rule set, and an unknown check name is skipped | The file parses as an array, and every `check` names a known check [SOURCE: .skilled/hooks/dispatch/lib/dispatch-rule-checks.mjs:274-283] |
| Remote branch allowlist | B | `scripts/remote-branch-allowlist.txt`, added to the built-in `main` and `skilled/v*` | An empty file only means more prompts. A broad pattern lets matching pushes skip approval | The patterns parse, and sample branch names show allowed and refused results, with the built-ins visible [SOURCE: .skilled/skills/sk-git/scripts/worktree-naming.sh:142-182] [SOURCE: .skilled/skills/sk-git/references/remote-branch-policy.md:34-44] |
| Worktree base | A | `SPECKIT_WORKTREE_BASE`, then `speckit.worktreeBase`, then `.worktrees` | A bad path fails at the first `git worktree add` | The effective base, which source set it and whether it is writable [SOURCE: .skilled/skills/sk-git/scripts/worktree-naming.sh:58-77] |
| Worktree provision list | B | `scripts/worktree-provision-paths.txt` | A missing entry leaves a worktree unprovisioned, so its checks can mislead | Each entry resolves to a package manifest. The check must not install or build [SOURCE: .skilled/skills/sk-git/scripts/worktree-provision-paths.txt:1-28] [SOURCE: .skilled/skills/sk-git/scripts/worktree-naming.sh:508-559] |
| Commit-Id opt-in | A | `git config --local skilled.commitId`, otherwise the allocator, sentinel or last-50-commits test | `false` turns off stamping and the required-id gate. A covered repository with no allocator gets unstamped messages that `commit-msg` then blocks | The effective policy and its reason, and that the allocator is present. The check must not call `allocate`, which writes the high-water mark [SOURCE: .skilled/scripts/git-hooks/lib/commit-id-policy.sh:17-48] [SOURCE: .skilled/skills/sk-git/scripts/commit-id-naming.sh:30-48] |
| Hook trust | A | `git config --local skilled.trustRepoHooks`, or a shared common git folder | An untrusted clone skips its own gates. Trust covers every branch of the repository | The trust decision and why, reported as information. A SKIP is a valid result [SOURCE: .skilled/scripts/git-hooks/pre-commit:28-57] |
| Hook install state | A | Links at the effective `core.hooksPath` | A shadowed or foreign hook means a gate is not live | Each hook resolves to this checkout, and none is shadowed. `install-git-hooks.sh --status` already reports this [SOURCE: .skilled/scripts/install-git-hooks.sh:112-149] |
| Saved gate switches | A | `speckit.hooks.<key>` at local or global scope, from the `gates.tsv` registry | A muted gate stops that check. Saved per-push approvals are refused by design | The active values and their scopes, and that every saved key is known and persistable [SOURCE: .skilled/scripts/git-hooks/lib/gate-config.sh:20-39] |
| Preflight advisory | C | Six runtime adapters, with `SKGIT_ADVISORY` and `SKGIT_ADVISORY_SKIP` suppression | An unregistered adapter gives no warnings and no error | Registration for the active runtime and any active suppression, labeled as configured coverage, not delivery [SOURCE: .skilled/skills/sk-git/scripts/hooks/README.md:71-84] |
| Kill switches | A | `SYSTEM_HOOKS_DISABLED`, `SYSTEM_GIT_COMMIT_HOOKS_DISABLED` and per-concern flags | An installed hook becomes inert, which a file check cannot see | Every active disable flag is reported |

**Corrected claim.** The SWE lineage said a repository without a `specs/` folder fails every commit on the Spec trailer's `mustExist` rule. That is wrong. The rule checks only a `Spec:` line the message carries, so a commit without one passes. The trailer is required only when someone writes it. [SOURCE: .skilled/skills/sk-git/scripts/lib/message-contract.mjs:554-572] A setup check can still warn when `trailers.spec.root` names a folder the repository lacks, since any `Spec:` line would then fail.

## 4. Placement

`/doctor:git` already declares sk-git as its owner and routes `hooks` and `standards`, both `mutating: mutates`. A read-only third target fits its manifest grammar, and every repair the battery names is a `git config` line, the hook installer or one of those two targets. [SOURCE: .skilled/commands/doctor/git.md:3-10] [SOURCE: .skilled/commands/doctor/_routes.yaml:236-273]

Rejected:

- **A separate `/doctor:sk-git` command.** It splits one owner and one domain across two routers.
- **A `--setup` flag on `hooks` or `standards`.** Both are mutating routes with approval flows, and a read-only battery under them breaks their declared class.
- **A setup that applies repairs.** The sk-code precedent forbids writes in a diagnostic, and the approved mutation paths already exist. [SOURCE: .skilled/commands/doctor/assets/doctor-sk-code-setup.yaml:21-28]
- **One healthy-or-not verdict from file presence or exit codes.** The fail-open paths in section 2 would read as healthy.
- **Reusing the `hooks` target.** Its read phase leads into an interactive change menu. [SOURCE: .skilled/commands/doctor/assets/doctor-git-hooks.yaml:78-103]
- **A Commit-Id format setting, or replacing the allowlist with a denylist.** The id format is shared across the allocator, policy, stamper, gates and template, and a denylist would invert the built-in exceptions.

## 5. Proposed Battery

| Leg | Check-only evidence | Repair on failure |
|---|---|---|
| Install | `SKILL.md`, `scripts/` and `hard-rules.json` present and parseable | Reinstall or provision sk-git |
| Hooks | `install-git-hooks.sh --status`: resolution, shadowing, scope | `bash .skilled/scripts/install-git-hooks.sh` |
| Trust | Local trust value and common-dir match | `git config --local skilled.trustRepoHooks true`, or SKIP |
| Gates | Saved `speckit.hooks.*` keys known and persistable | `/doctor:git hooks` |
| Standards | Resolved contract folder and per-kind block state | `/doctor:git standards` |
| Allowlist | Patterns parse, with sample allowed and refused names | Edit the allowlist file |
| Worktrees | Effective base writable, provision entries resolve | `git config speckit.worktreeBase …` or fix the list |
| Commit-Id | Effective policy and allocator present | `git config --local skilled.commitId …` |
| Advisory rules | Every rule's `check` is known | Fix the rule |
| Suppression | Active advisory and hook disable flags | Unset the flag |
| Runtime adapters | Active runtime's registration, where it can be detected | SKIP with the adapter paths |

## 6. Open Questions

- Should the first version check only the active runtime's advisory registration, or all six adapters? Neither lineage found a uniform registration probe.
- `hard-rules.json` has no repository overlay, so a repository on a shared install cannot add its own advisory rules. That is a separate design question, outside the setup check.

## 7. Proposed Implementation Phases

1. **Battery script.** Write `.skilled/commands/doctor/scripts/git-setup-check.cjs` with the legs in section 5, human and JSON output, a repair line per failure, exit 0, 1 or 2 and a final `STATUS=` line. Reuse the contract resolver, `install-git-hooks.sh --status`, the gate registry and the Commit-Id policy helper in their read-only forms.
2. **Route and workflow.** Add the `setup` row to `_routes.yaml`, a `doctor-git-setup.yaml` workflow shaped like the sk-code one, presentation entries and the `git.md` target table.
3. **Fixtures.** Cover a missing or malformed contract, an empty and a broad allowlist, a relocated worktree base, Commit-Id true, false and default, an untrusted clone, a shadowed hook, saved gate scopes and a suppressed advisory. Assert each row, and assert that the route writes nothing.
4. **Adaptation guide.** Add an sk-git section to the README that says which surfaces a repository may change and points to `/doctor:git setup` as the proof step.

## 8. Verification by the Orchestrator

The orchestrator checked these claims against the code: the route classes, the contract resolver's config-file-only rule and its throw on a missing folder, `--explain` exiting 0 with no contract, the unknown-check skip, the worktree base precedence and the Spec trailer rule (one claim corrected above). The other citations come from the lineages and were not each re-read.

The `swe-2-max` lineage's dashboard lacked the reducer stamp, so the first merge refused it. The reducer was rerun for that lineage and the merge then took both lineages, 70 key findings in all. The `luna-xhigh-fast` state records carry no route-proof fields, but its five deltas each carry `target_agent` and `agent_definition_loaded: true`.
