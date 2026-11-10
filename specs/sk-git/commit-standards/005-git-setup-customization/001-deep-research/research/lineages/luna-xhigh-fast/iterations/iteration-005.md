# Iteration 5: read-only proof and command placement

## Focus

Use the `/doctor:sk-code setup` precedent and current `/doctor:git` route contract to define a credible read-only sk-git setup report, choose its command home, and reject unsafe or redundant approaches.

## Actions Taken

- Re-read the sk-code setup command, workflow contract, and checker legs to separate diagnostics from repair.
- Read `/doctor:git`, its route-manifest entries, the doctor route mutability enum, and the existing hooks and standards workflows.
- Rechecked `steer.md`; it is absent in this lineage.

## Findings

1. The sk-code precedent is a single read-only setup route that reports each leg as PASS, FAIL, or SKIP with a repair command and writes nothing; it checks provisioning, structural metadata, route guard/sync, drift, freshness, and an actual route probe, so sk-git should copy that reporting boundary while using checks tied to Git's own resolvers. [SOURCE: .skilled/commands/doctor/sk-code.md:31-61; .skilled/commands/doctor/assets/doctor-sk-code-setup.yaml:12-28,46-52]
2. `/doctor:git` already owns the git domain through its canonical route manifest, currently with `hooks` and `standards` targets, and both existing workflows mutate only after approval; the route schema already supports a `read-only` target, so setup fits as a third `setup` target rather than a second command over the same domain. [SOURCE: .skilled/commands/doctor/git.md:39-67,82-87; .skilled/commands/doctor/_routes.yaml:27-30,236-267]
3. A useful setup report should resolve effective inputs and their provenance, not just test file presence: show contract source and enforcement state, additive allowlist outcomes, worktree base and provisioning readiness, Commit-Id policy plus allocator/hook availability, trust and installed-hook resolution, gate settings, and advisory runtime wiring; label future build/install success and live warning delivery as unproven by a read-only scan. [SOURCE: .skilled/skills/sk-git/scripts/lib/message-contract.mjs:278-323; .skilled/skills/sk-git/scripts/worktree-naming.sh:58-77,508-559; .skilled/scripts/git-hooks/lib/commit-id-policy.sh:17-40; .skilled/scripts/install-git-hooks.sh:112-149; .skilled/skills/sk-git/scripts/hooks/README.md:71-84]
4. Reject a `setup --apply` flow that silently installs hooks, sets `skilled.trustRepoHooks`, or changes local/global policy: the sk-code setup contract explicitly forbids all writes and leaves repair as operator action, while trust authorizes repository-owned scripts across every branch and current Git repair workflows each have their own approval boundary. [SOURCE: .skilled/commands/doctor/assets/doctor-sk-code-setup.yaml:21-28; .skilled/scripts/git-hooks/pre-commit:28-57; .skilled/commands/doctor/assets/doctor-git-hooks.yaml:90-103; .skilled/commands/doctor/assets/doctor-git-standards.yaml:102-121]
5. Reject a single green result inferred from successful commands or file presence: contract lookup returns no enforcement when no rules are found, `validate-message --explain` can exit 0 with no rules, and the advisory deliberately approves silently on missing rules or runtime failure, so the report needs per-surface PASS/FAIL/SKIP/UNKNOWN evidence and explicit limits. [SOURCE: .skilled/skills/sk-git/scripts/lib/message-contract.mjs:278-323; .skilled/skills/sk-git/scripts/validate-message.mjs:125-136; .skilled/skills/sk-git/scripts/hooks/git-preflight-advisory.mjs:13-20,107-115]

## Questions Answered

- What can a read-only sk-git setup check prove, and how does `/doctor:git` currently route and report?
- Should setup be a new `/doctor:git` action or a separate command, and which proposals should be rejected?

## Questions Remaining

- None for the requested research decision. Runtime delivery can only be reported as configured from registration files; exercising each AI runtime remains outside a read-only repository scan.

## Dead Ends

- Rejected a separate `/doctor:sk-git` command: `/doctor:git` already resolves git-specific targets through the canonical route manifest and is owned by `sk-git`, so a second router would split one domain without adding a new owner. [SOURCE: .skilled/commands/doctor/git.md:6-10,39-54; .skilled/commands/doctor/_routes.yaml:236-267]
- Rejected the idea that the existing `hooks` target is already a setup diagnostic: its status read is followed by an interactive choice and approved config writes, so it does not provide the one-pass read-only result the precedent establishes. [SOURCE: .skilled/commands/doctor/assets/doctor-git-hooks.yaml:78-103]

## Workflow Conflicts

The reducer now checks Q3 as answered but still leaves Q3 as the generated `NEXT FOCUS`. The steer file is absent. I followed the next unchecked questions Q4 and Q5 and left the machine-owned focus section unchanged. [SOURCE: specs/sk-git/033-git-setup-customization/001-deep-research/research/lineages/luna-xhigh-fast/deep-research-strategy.md:65-67,176-180]

At final reduction, all five key-question boxes are checked and `NEXT FOCUS` says all tracked questions are resolved, but the carried-forward section still repeats completed questions and an iteration's `Questions Remaining` text. This is stale reducer bookkeeping; the key-question checkboxes and current answers are used for synthesis, and the machine-owned section remains untouched. [SOURCE: specs/sk-git/033-git-setup-customization/001-deep-research/research/lineages/luna-xhigh-fast/deep-research-strategy.md:62-67,180-195]

Synthesis also defines a writeback to `{spec_folder}/spec.md` followed by `validate.sh`; the dispatch restricts writes to this lineage and expressly forbids that validator. I will skip both steps and keep the synthesis, resource map, and terminal records inside the lineage. The resource-map destination resolves under `{artifact_dir}`, which is this lineage. [SOURCE: .skilled/commands/deep/assets/deep-research-auto.yaml:145-170,2209-2232]

## Assessment

- newInfoRatio: 0.9
- Novelty: command placement and the read-only proof boundary are now decided from the existing doctor route contracts and precedent.
- Confidence: high for the route and workflow constraints; the report design is a recommendation derived from the observed resolver and hook behavior.

## Reflection

The recommended route is `/doctor:git setup`: add a read-only target to the existing git router and leave `hooks` and `standards` as the explicit repair workflows. A setup result should distinguish what the repository can prove now from what requires an install/build or a live runtime invocation. [SOURCE: .skilled/commands/doctor/git.md:39-67,82-87; .skilled/commands/doctor/_routes.yaml:27-30,236-267; .skilled/commands/doctor/assets/doctor-sk-code-setup.yaml:21-28]

## Recommended Next Focus

Synthesize the five iterations into the repository adaptation inventory, read-only proof matrix, command decision, rejected ideas, and phased implementation proposal.
