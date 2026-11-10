---
title: "Iteration 5: /doctor:git router contract, ownership boundary, placement decision, rejected designs, battery composition"
trigger_phrases: []
---
# Iteration 5: command placement and synthesis preparation

## Focus

The `/doctor:git` router contract and route manifest, the ownership boundary between repo-owned config and shipped/vendored skill files, the placement decision for a setup action, the rejected design list, and the proposed battery legs.

## Actions Taken

- Read `.skilled/commands/doctor/git.md` in full (input gate, router contract, execution targets, presentation boundary).
- Read `.skilled/commands/doctor/_routes.yaml` schema comments and the `/doctor:sk-code setup`, `/doctor:git hooks`, `/doctor:git standards` route rows verbatim.
- Read `.skilled/commands/doctor/assets/doctor-sk-code-setup.yaml` (the precedent workflow: single-step read-only battery).
- Inventoried `.skilled/commands/doctor/scripts/` and `.skilled/commands/doctor/assets/`.
- Resolved file-ownership questions: where `remote-branch-allowlist.txt`, `worktree-provision-paths.txt` and `hard-rules.json` are read from (`worktree-naming.sh` resolvers, `dispatch-rule-checks.mjs`).

## Findings

1. `/doctor:git` is a mandatory-gate thin router: first positional token binds `target` (`hooks`/`standards` today), absent target → startup menu and stop; `_routes.yaml` is the canonical manifest carrying `target`, `yaml`, `setup_vars`, `allowed_flags`, `mutating` (read-only|add-only|mutates), `gate3_location`, `mcp_tools`, `script_invocations`, `trigger_phrases`; adding a target = append one route + one `assets/doctor-*.yaml` + list it in the command. [SOURCE: .skilled/commands/doctor/git.md:12-20,39-67; .skilled/commands/doctor/_routes.yaml:25-38]

2. The two existing `/doctor:git` targets are both `mutates` routes whose script_invocations already enumerate the exact check-only calls a setup battery would reuse: `git-hook-gates.cjs list --json`, `install-git-hooks.sh --status`, `git-standards.cjs status|check --json`, `validate-message.mjs --explain`. The mutating forms (`set`, `init`, `disable` with `--apply`) are the repair side. [SOURCE: .skilled/commands/doctor/_routes.yaml:236-273]

3. The precedent's route shape is confirmed verbatim: `/doctor:sk-code setup` is `mutating: read-only`, `gate3_location: "n/a (read-only setup battery; runs each check in its check-only form and prints repair commands, writes nothing)"`, one script invocation, `allowed_flags: ["--prompt=<text>"]`; its workflow YAML declares `execution: read_only`, `approvals: none`, `forbidden_targets: ["**/*"]` and the invariant "Repair is an explicit operator action, never a side effect of a diagnostic," mapping exit 0/1/2 to STATUS=OK/FAIL/ERROR. [SOURCE: .skilled/commands/doctor/_routes.yaml:220-234; .skilled/commands/doctor/assets/doctor-sk-code-setup.yaml:1-70]

4. Placement decision: `setup` belongs in `/doctor:git` as a third, read-only target. Reasons: (a) ownership — `git.md` frontmatter declares `skill_agent: sk-git`, so the skill whose customization is verified owns the command; (b) repair adjacency — every failing leg's repair is either a `/doctor:git hooks|standards` invocation or a named `git config`, so the command that reports is the command that fixes; (c) precedent — sk-code chose the owner-scoped target over a separate command and over hub/mode routing; (d) discoverability — `list`/`?` already renders `/doctor:git`'s manifest. [SOURCE: .skilled/commands/doctor/git.md:3-10,49-58; .skilled/commands/doctor/_routes.yaml:220-234]

5. Rejected designs (extending the precedent's rejection pattern): R1 a separate `/doctor:sk-git` command — doubles a router for one target and breaks the `/doctor:<concern>` naming where the concern is `git`, already owned by `git.md`; R2 folding setup into `hooks` or `standards` as a flag — those routes are `mutates` with approval flows, a no-approval read-only battery violates their mutation class; R3 `/doctor:git-setup` — breaks the `<command> <target>` grammar and leaves the route manifest split; R4 a mutating setup (auto-init `.sk-git/`, auto-install hooks, auto-trust) — violates the read-only-diagnostic invariant the precedent set verbatim; R5 per-tool `--doctor` flags inside `worktree-naming.sh`/`validate-message.mjs` — scatters one battery across N executables; R6 `install-git-hooks.sh --status` alone as the battery — covers hook resolution only, no standards/gates/trust/allocator legs. [SOURCE: .skilled/commands/doctor/_routes.yaml:220-273; .skilled/commands/doctor/assets/doctor-sk-code-setup.yaml:24-31; .skilled/commands/doctor/git.md:49-58]

6. The customization ownership boundary has three classes, and the battery must say which class each failure sits in: (a) repo-owned config — `.sk-git/` copies, `skgit.contractDir`, `speckit.hooks.<key>`, `skilled.trustRepoHooks`, `skilled.commitId`, `speckit.worktreeBase`, suppression envs, foreign hooks in `.git/hooks`; (b) vendored-skill files — `remote-branch-allowlist.txt` resolves at the repo toplevel's own `.skilled`/`.opencode` copy, `worktree-provision-paths.txt` resolves beside the running script, `hard-rules.json` reads "the sidecar beside the skill's SKILL.md": editable only where the repository vendors the skill tree, with no second repo-local override layer; (c) runtime-registered adapters — the advisory and message-gate PreToolUse hooks, probed per runtime. [SOURCE: .skilled/skills/sk-git/scripts/worktree-naming.sh:141-157,505-511; .skilled/hooks/dispatch/lib/dispatch-rule-checks.mjs:260-265; .skilled/skills/sk-git/scripts/hooks/git-preflight-advisory.mjs:24-33]

7. `hard-rules.json` edits carry a silent-failure mode worth a dedicated leg: `evaluate()` skips any rule whose `check` name is absent from the check registry — "unknown check → skip (the CI validator catches typos, not this hot path)" — so a malformed or mistyped rule never fires and never complains; a setup check can prove `every rule.check ∈ GIT_CHECKS` read-only. [SOURCE: .skilled/hooks/dispatch/lib/dispatch-rule-checks.mjs:274-283; .skilled/skills/sk-git/scripts/hooks/git-preflight-advisory.mjs:30-33]

8. Proposed battery legs (the customization matrix as checks): L1 sk-git provisioning (SKILL.md/scripts/hard-rules.json present and parseable); L2 hook install (`--status`: no missing/SHADOWED, hooksPath scope); L3 trust (`skilled.trustRepoHooks` — PASS/SKIP both legitimate, consequences printed); L4 gates (`git-hook-gates.cjs list --json` resolves, saved keys valid, non-persistable absent); L5 standards (`git-standards.cjs check --json`); L6 `skgit.contractDir` resolves to a valid dir when set; L7 allowlist parses + ownership note; L8 worktree base resolves writable + `worktree-provision-paths.txt` entries exist; L9 Commit-Id (`skilled.commitId` effective + allocator present when policy covers); L10 advisory rules all resolve against `GIT_CHECKS`; L11 suppression audit (active `SKGIT_ADVISORY*`/`SYSTEM_*_DISABLED`/`speckit.hooks.*` reported so "installed but muted" is visible). [SOURCE: .skilled/commands/doctor/_routes.yaml:236-273; .skilled/scripts/install-git-hooks.sh:107-144; .skilled/hooks/dispatch/lib/dispatch-rule-checks.mjs:274-283]

9. A non-vendored consumer (a repo using a shared/global sk-git install) can customize only class (a); `remote-branch-allowlist.txt`, `worktree-provision-paths.txt`, `hard-rules.json` and `gates.tsv` are shared-install files whose edits affect every repo on that install — the setup check must report them as shared-scope, not invite a repo-scoped edit. This is the honest answer to "what may a repository user change": config keys and `.sk-git/` always; skill-side data files only when vendored. [SOURCE: .skilled/skills/sk-git/scripts/worktree-naming.sh:141-157,505-511; .skilled/hooks/dispatch/lib/dispatch-rule-checks.mjs:260-265]

10. Residual unknowns for the synthesis: (u1) no uniform probe exists for per-runtime adapter registration (Claude PreToolUse config vs opencode plugin vs pi extension) — the leg will likely SKIP with file paths to verify; (u2) no repo-local `hard-rules.json` overlay mechanism was found — vendored copy or nothing; (u3) `SPECKIT_COMMIT_SPEC`/`Spec:` trailer provisioning semantics for repos without `specs/` rely on the `.sk-git` rules override rather than a dedicated switch. [SOURCE: .skilled/skills/sk-git/scripts/hooks/git-preflight-advisory.mjs:24-40; .skilled/skills/sk-git/assets/commit-message-template.md:257-269; .skilled/scripts/git-hooks/prepare-commit-msg:6-8]

## Questions Answered

- Where does setup belong? In `/doctor:git` as a read-only `setup` target — one `_routes.yaml` row (`mutating: read-only`, `gate3_location: n/a`), one `doctor-git-setup.yaml` single-step workflow, one `git-setup-check.cjs` battery script, presentation additions in `doctor-git-presentation.txt`, and `argument-hint`/target-table updates in `git.md`.
- Which surfaces are repo-customizable vs shared? Class (a) config always; class (b) skill-side files only when vendored; class (c) per runtime.

## Questions Remaining

- u1–u3 above; the per-runtime registration probe is the only leg that cannot be made deterministic from git/skill state alone.

## Ruled Out

- Separate `/doctor:sk-git` or `/doctor:git-setup` commands (R1/R3); flags on the mutating routes (R2); mutating/auto-repair setup (R4); per-tool `--doctor` modes (R5); `--status` alone as the battery (R6).

## Dead Ends

- No `hard-rules.json` repo override exists — confirmed by `readHardRules` reading only the sidecar beside `SKILL.md`. Recorded as a limitation, not a defect to fix here.

## Edge Cases

- Ambiguous input: none.
- Contradictory evidence: none.
- Missing dependencies: none.
- Partial success: per-runtime registration probe reduced to SKIP-with-paths (u1).

## Sources Consulted

- .skilled/commands/doctor/git.md:1-84
- .skilled/commands/doctor/_routes.yaml:1-40,220-273
- .skilled/commands/doctor/assets/doctor-sk-code-setup.yaml:1-70
- .skilled/commands/doctor/scripts/ (inventory)
- .skilled/skills/sk-git/scripts/worktree-naming.sh:141-160,505-530
- .skilled/hooks/dispatch/lib/dispatch-rule-checks.mjs:255-285
- .skilled/scripts/git-hooks/pre-push:42,368-399
- .skilled/scripts/git-hooks/prepare-commit-msg:6-8

## Assessment

- `newInfoRatio`: `0.88`
- Novelty justification: placement decision and rejection list are new synthesis; battery legs consolidate iterations 3–4 into the route schema read verbatim this iteration.
- Confidence: high for placement and battery composition; medium on the per-runtime probe (u1) which is recorded as a limitation.

## Reflection

- Worked: reading `_routes.yaml` schema comments first made the "one row + one YAML + one script" cost of a new target concrete.
- Did not work: nothing.
- Would do differently: nothing.

## Recommended Next Focus

Phase synthesis: write `research.md` (customization matrix, placement decision, rejected designs, implementation phases), `resource-map.md`, `findings-registry.json`, `deep-research-dashboard.md`, and the terminal state record with `stopReason: "maxIterationsReached"`.
