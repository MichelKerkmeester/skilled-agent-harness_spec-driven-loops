# Iteration 4: Repair-command audit

## Focus

Audit each repair emitted by the read-only setup battery and compare the named hooks, standards, and setup command targets with their actual operations. The focus follows the least-explored open question Q3.

## Actions Taken

- Read the run config, state projection, and strategy before selecting focus; the strategy marks Q3 and Q5 open and records earlier coverage of Q1, Q2, and Q4.
- Enumerated each repair constant and dynamic repair builder in git-setup-check.cjs, then traced the hooks and standards targets into their command scripts and YAML workflows.
- Checked whether setup remains read-only and whether the update fallback actually changes files.
- Compared the repair-related unit assertions to command behavior. Existing tests assert several repair strings, but do not execute those suggestions as recovery paths [SOURCE: .skilled/commands/doctor/scripts/tests/git-setup-check.test.cjs:258] [SOURCE: .skilled/commands/doctor/scripts/tests/git-setup-check.test.cjs:398].

## Findings

1. **P1 · High impact · Small effort — install recovery does not match the detected failure.** The check identifies missing paths under the install root, but its fallback bare /doctor:update runs the update check, which is read-only. The git restore example targets the complete sk-git skill directory rather than only the missing file; it can overwrite tracked local edits in that subtree [INFERENCE: based on the broad path argument] [SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:72] [SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:205] [SOURCE: .skilled/commands/doctor/update.md:16] [SOURCE: .skilled/commands/doctor/update.md:70]. Replace this with exact missing-file recovery or an explicit reviewed update/apply route.

2. **P1 · High impact · Small effort — hook recovery asks the operator to run inspected-repository code.** When the repository contains the toolchain sentinel, the repair points at that repository's install-git-hooks.sh. The installer selects its source tree from the repository being operated on and chmods hook sources before linking them into Git's hooks directory, so this repair crosses the battery's trust boundary and can install untrusted hook code [SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:225] [SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:229] [SOURCE: .skilled/scripts/install-git-hooks.sh:29] [SOURCE: .skilled/scripts/install-git-hooks.sh:45] [SOURCE: .skilled/scripts/install-git-hooks.sh:175]. Add a trust-review step or direct the operator to a verified installer source.

3. **P1 · High impact · Medium effort — the gates repair either repeats the failure or is never emitted for an off gate.** The battery emits /doctor:git hooks when the list helper errors or its report does not parse. That target starts by running the same list helper, so it cannot recover those utility/report failures. Meanwhile the battery puts saved-off gates in details and returns PASS, although the hooks target can change gate values through an approved set --apply call [SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:295] [SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:301] [SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:307] [SOURCE: .skilled/commands/doctor/scripts/git-hook-gates.cjs:169] [SOURCE: .skilled/commands/doctor/assets/doctor-git-hooks.yaml:81] [SOURCE: .skilled/commands/doctor/assets/doctor-git-hooks.yaml:101]. Separate broken-diagnostic recovery from gate-state repair, and make a saved-off gate a failing or explicitly degraded verdict.

4. **P1 · High impact · Medium effort — standards cannot repair the missing-directory error it names.** When skgit.contractDir points to a missing directory, setup reports /doctor:git standards. Every git-standards mode first resolves that setting and aborts on the missing path; the interactive target starts with status, so it never reaches init. The repair must first unset or correct skgit.contractDir, or provide a resolver recovery path [SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:330] [SOURCE: .skilled/commands/doctor/scripts/git-standards.cjs:167] [SOURCE: .skilled/commands/doctor/scripts/git-standards.cjs:172] [SOURCE: .skilled/commands/doctor/assets/doctor-git-standards.yaml:80] [SOURCE: .skilled/commands/doctor/assets/doctor-git-standards.yaml:91] [SOURCE: .skilled/skills/sk-git/scripts/lib/message-contract.mjs:295].

5. **P2 · Medium impact · Small effort — worktree repair ignores the winning source.** The repair always suggests writing speckit.worktreeBase, but SPECKIT_WORKTREE_BASE is checked first and wins over Git config. If the reported source is the environment, the printed config command leaves the failing base unchanged [SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:72] [SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:403] [SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:407] [SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:415] [SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:467]. Branch the repair on the source label and include an environment-unset or update step when applicable.

6. **P2 · Medium impact · Small effort — the Commit-Id alternative is a policy opt-out, not a repair.** The failure is specifically that Commit-Id is required while the allocator is missing. The offered local false value wins before repository markers and makes cip_repo_wants_ids return off, so it passes by removing enforcement [SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:77] [SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:513] [SOURCE: .skilled/scripts/git-hooks/lib/commit-id-policy.sh:17] [SOURCE: .skilled/scripts/git-hooks/lib/commit-id-policy.sh:25]. Label this alternative as an explicit waiver and keep restoration as the repair.

7. **P2 · Medium impact · Small effort — advisory-rules guidance is wrong for parse and shape errors.** The same repair says to fix a check name when hard-rules.json is invalid JSON or its root is not an array, as well as when a rule has a missing or unknown check name [SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:73] [SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:531] [SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:534] [SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:552]. Emit syntax, schema, and unknown-check repairs separately.

8. **P2 · Low impact · Small effort — suppression repair is shell-local.** The checker reads process.env and prints unset for the two whole-hook master switches. That is actionable when the value comes from the current shell; when an IDE or agent host injects it, unsetting it in a later child shell cannot change the checker’s parent environment [INFERENCE: based on process-environment inheritance] [SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:562] [SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:565]. Show the source and say when the host must be restarted.

## Repair Inventory

| Repair surface | What the target actually changes | Audit |
|---|---|---|
| install | /doctor:update with no action runs a read-only check; git restore names a broad subtree [SOURCE: .skilled/commands/doctor/update.md:16] [SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:72] | P1 mismatch |
| hooks | Selected repository installer chmods and links hook scripts; fallback writes core.hooksPath [SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:228] [SOURCE: .skilled/scripts/install-git-hooks.sh:175] | P1 trust boundary |
| gates | Approved set --apply writes one local/global gate value; setup currently passes off values and the repair target repeats list on helper failures [SOURCE: .skilled/commands/doctor/scripts/git-hook-gates.cjs:169] [SOURCE: .skilled/commands/doctor/scripts/git-hook-gates.cjs:180] [SOURCE: .skilled/commands/doctor/assets/doctor-git-hooks.yaml:101] | P1 mismatch |
| standards | init copies templates and set/disable edits repository contract files after approval [SOURCE: .skilled/commands/doctor/scripts/git-standards.cjs:235] [SOURCE: .skilled/commands/doctor/scripts/git-standards.cjs:245] [SOURCE: .skilled/commands/doctor/scripts/git-standards.cjs:287] [SOURCE: .skilled/commands/doctor/scripts/git-standards.cjs:327] | P1 cannot recover a missing configured directory |
| worktrees | Changes Git config, while the environment may be the active source [SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:403] [SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:407] | P2 source-blind |
| Commit-Id | Local false disables the policy before marker detection [SOURCE: .skilled/scripts/git-hooks/lib/commit-id-policy.sh:25] | P2 opt-out must be labeled |
| advisory-rules | Writes no file; repair text must distinguish JSON syntax, array shape, and unknown check names [SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:534] [SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:552] | P2 inaccurate |
| suppression | Unsets values only in a shell's environment [SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:562] [SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:565] | P2 conditional |
| AI-tool registration | Repair names the adapter file and links the per-runtime wiring table, which specifies the hook event and delivery [SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:81] [SOURCE: .skilled/skills/sk-git/scripts/hooks/README.md:77] [SOURCE: .skilled/skills/sk-git/scripts/hooks/README.md:84] | No wording defect found |

The target semantics are distinct: hooks writes only gate configuration after approval, standards writes repository-local contract copies after approval, and setup is read-only [SOURCE: .skilled/commands/doctor/assets/doctor-git-hooks.yaml:101] [SOURCE: .skilled/commands/doctor/assets/doctor-git-standards.yaml:93] [SOURCE: .skilled/commands/doctor/assets/doctor-git-setup.yaml:23].

## Proposed Implementation Phases

1. **P1 repair correctness and safety:** replace the install fallback, route hook installation through a trust-checked source, split gates utility errors from disabled-gate findings, and give standards a recovery path for an invalid configured directory.
2. **P2 source-aware repairs:** make worktree guidance follow its winning source, label Commit-Id false as an explicit waiver, distinguish advisory JSON syntax/schema/name errors, and show where suppression variables came from.
3. **Contract coverage:** add fixtures that verify each emitted repair against its target's actual dry-run/apply behavior, then keep command, YAML, presentation, and manual-playbook wording aligned.

## Questions Answered

- Q3: Which repairs named by the battery or by /doctor:git targets are wrong, incomplete or unsafe for the failure they claim to fix?

## Questions Remaining

- Q5: How should the deferred items be resolved: a per-repository hard-rules.json overlay design, and the remaining CI failures in Gate Inputs hook tests and sk-doc Script Tests?

## Ruled Out

- The AI-tool registration repair's section-3 README pointer is specific enough to locate the runtime wiring, so it is not counted as a repair defect [SOURCE: .skilled/commands/doctor/scripts/git-setup-check.cjs:81] [SOURCE: .skilled/skills/sk-git/scripts/hooks/README.md:77].

## Edge Cases

- Contradictory documentation and behavior were recorded as findings; no repair command was executed.
- The state machine says the lineages' prior questions Q1/Q2/Q4 are answered; this iteration answers Q3 only.

## Sources Consulted

- .skilled/commands/doctor/scripts/git-setup-check.cjs
- .skilled/commands/doctor/update.md
- .skilled/scripts/install-git-hooks.sh
- .skilled/commands/doctor/scripts/git-hook-gates.cjs
- .skilled/commands/doctor/assets/doctor-git-hooks.yaml
- .skilled/commands/doctor/scripts/git-standards.cjs
- .skilled/commands/doctor/assets/doctor-git-standards.yaml
- .skilled/commands/doctor/assets/doctor-git-setup.yaml
- .skilled/skills/sk-git/scripts/lib/message-contract.mjs
- .skilled/scripts/git-hooks/lib/commit-id-policy.sh
- .skilled/skills/sk-git/scripts/hooks/README.md
- .skilled/commands/doctor/scripts/tests/git-setup-check.test.cjs

## Assessment

- New information ratio: 0.88 (six findings are new to the repair-path audit; two partly overlap prior false-healthy coverage).
- Questions addressed: Q3.
- Questions answered: Q3.
- Questions remaining: Q5.
- Status: complete.

## Reflection

- What worked and why: tracing each repair literal into its target workflow exposed mismatches between diagnosis, command behavior, and actual mutation.
- What did not work and why: none; source reads were sufficient for this static audit.
- What I would do differently: Q5 needs a separate pass over the deferred overlay and CI failure evidence.

## Recommended Next Focus

Q5: resolve the per-repository hard-rules.json overlay design and identify the root causes and fixes for the remaining Gate Inputs hook and sk-doc Script Tests CI failures.
