---
title: "Research: A doctor-style setup path for sk-git"
trigger_phrases: []
---
# Research: a doctor-style setup path for sk-git

**Lineage:** `swe-2-max` · **Session:** `fanout-swe-2-max-1792042581294-btcd4b` · **Executor:** `cli-devin / swe-2-max` · **Iterations:** 5/5 · **Stop reason:** `maxIterationsReached`

## 1. Recommendation

Add a read-only `setup` target to `/doctor:git` — one route row in `_routes.yaml` (`mutating: read-only`, `gate3_location: n/a`), one single-step workflow `assets/doctor-git-setup.yaml`, one battery script `.skilled/commands/doctor/scripts/git-setup-check.cjs`, and presentation entries in `assets/doctor-git-presentation.txt`. The battery runs each existing check in its check-only form, prints `PASS|FAIL|SKIP` per leg with a `repair:` line naming the exact command for each failure, and exits 0/1/2 → `STATUS=OK|FAIL|ERROR`. It verifies; it never writes. [SOURCE: .skilled/commands/doctor/_routes.yaml:220-273; .skilled/commands/doctor/assets/doctor-sk-code-setup.yaml:1-70]

This is the same shape the sk-code precedent chose after rejecting hub modes and foreign-owner commands: the owner-scoped read-only target on the doctor command that already owns the repair surface. [SOURCE: .skilled/commands/doctor/_routes.yaml:220-234]

## 2. The sk-code precedent (what "doctor-style setup" means)

`/doctor:sk-code setup` is a `read-only` route that runs `sk-code-setup-check.cjs` once — an eight-leg battery (provisioning, parent-skill, root-metadata, route guard, route sync, drift guards, derived freshness, live route probe returning `"action":"route"`) — prints one verdict line and one `repair:` command per failing leg, and maps exit codes to `STATUS=OK|FAIL|ERROR`. The workflow YAML pins the invariant: *"Every leg runs in its check-only form and the battery prints a repair command instead of applying one. … Repair is an explicit operator action, never a side effect of a diagnostic."* [SOURCE: .skilled/commands/doctor/assets/doctor-sk-code-setup.yaml:17-31,50-70; .skilled/commands/doctor/_routes.yaml:225-229]

The precedent's design research rejected `/doctor:skill-advisor surface-setup` (wrong owner, undiscoverable), `/doctor:sk-code surfaces` (narrower than the checks run), and a new hub/mode (`sk-code-setup` violates packet/hub routing contracts). The winning shape: `/doctor:<owner> <target>`, read-only, verification not mutation, one repair command per failing leg. [Iteration 1–2 findings; .skilled/commands/doctor/_routes.yaml:220-234]

## 3. Customization matrix — every adaptable sk-git surface

Legend — **Ownership class**: `A` = repo-owned config (always customizable); `B` = vendored-skill file (customizable only where the repo carries its own `.skilled/` or `.opencode/` tree; no second override layer); `C` = runtime-registered adapter.

| # | Surface | Class | What a repo user may want to change | Where it is set today | What breaks when changed/removed | What the read-only check must prove |
|---|---------|-------|--------------------------------------|------------------------|-----------------------------------|--------------------------------------|
| 1 | Commit/PR/branch rules | A | Subject length, trailer requirements, `Spec:` root, attribution policy, disable a kind entirely | `Enforced rules` JSON block in `.sk-git/` copies or the dir `git config skgit.contractDir` names; falls back to shipped `assets/` under `.skilled/` then `.opencode/` | Missing dir named by `skgit.contractDir` → `ContractError` → exit 2 → **every gated commit/push blocked**; malformed block same; `null` on a rule key or `disable <kind>` removes enforcement for that kind | `git-standards.cjs check --json` clean; resolved dir exists and parses; report which source is active and editable [S: scripts/lib/message-contract.mjs:278-324; git-standards.cjs:7-37] |
| 2 | Contract resolution order | A | Point the whole repo at a nonstandard contract dir | `skgit.contractDir` (file-scoped config only — `-c`/`GIT_CONFIG_*` deliberately ignored so no invocation can bypass rules) | Stale/relative-dir value blocks all commits (see #1); there is no "unset means opt-out" — falling back to shipped assets is normal | If set: absolute, exists, contains valid blocks; if unset: `.sk-git/` presence reported [S: message-contract.mjs:278-307] |
| 3 | `hard-rules.json` advisory rules | B | Wording, add repo-specific rules, drop irrelevant ones | Sidecar beside `sk-git/SKILL.md` in the vendored tree; **no repo-local overlay exists** | Unknown `check` name → rule silently skipped forever ("the CI validator catches typos, not this hot path"); malformed JSON → advisory fails open silently | File parses; every `rule.check` ∈ `GIT_CHECKS`; suppression envs reported [S: dispatch-rule-checks.mjs:274-283; hard-rules.json:1-104] |
| 4 | Remote branch allowlist | B | Exempt repo's branch families from per-push approval | `scripts/remote-branch-allowlist.txt` at repo toplevel's `.skilled` (or `.opencode` legacy) copy; `main`+`skilled/v*` hardcoded first so the file can only narrow toward more asking | Missing/empty file narrows to `main` (more prompts, safe direction); remote-branch *creation* always needs `SPECKIT_ALLOW_REMOTE_PUSH=<branch>` regardless | File parses; globs sane; scope reported as shared-install when the tree isn't vendored [S: worktree-naming.sh:141-157; remote-branch-policy.md:30-56,78-104] |
| 5 | Worktree base | A | Put worktrees outside the checkout / outside the repo | `SPECKIT_WORKTREE_BASE` > `git config speckit.worktreeBase` > `.worktrees` | Bad path → provisioning fails at first `git worktree add`; counters live in common git dir so a moved base does not corrupt numbering | Effective base resolves and is writable; report which source won [S: worktree-naming.sh:5-77; SKILL.md:292] |
| 6 | Worktree provisioning list | B | Which dependency trees `provision` installs/builds | `worktree-provision-paths.txt` beside the running script (vendored copy) | Missing entries → worktree checks run against unprovisioned tree (the SKILL.md invariant is "never trust a worktree check until provisioned") | Listed dirs resolvable; provision is idempotent so check just reports the list [S: worktree-provision-paths.txt:1-40; worktree-naming.sh:505-530] |
| 7 | Commit-Id allocator opt-in | A | Turn stamping on/off for this clone | `git config --local skilled.commitId true|false` wins; absent → auto-detect (shipped allocator or speckit sentinel, or `Commit-Id` trailers in last 50 commits); local-only so clones can't self-toggle | `false` on a repo whose contract requires `Commit-Id` → commit-msg/pre-push block every commit; allocator missing where policy wants ids → stamp silently absent until commit-msg blocks | Effective policy value; allocator file present+executable when covered [S: lib/commit-id-policy.sh:19-45; commit-id-naming.sh:1-75] |
| 8 | Per-gate switches | A | Permanently disable an annoying gate | `git config [--global] speckit.hooks.<key>` ∈ `{off,false,no,0}`; registry `gates.tsv` (13 persistable + 2 non-persistable approvals) | Saved `SPECKIT_ALLOW_REMOTE_PUSH`-class approvals are refused by design; unknown keys ignored | `git-hook-gates.cjs list --json` resolves registry; saved keys are known+persistable; muted gates visible [S: gates.tsv:1-16; git-hook-gates.cjs:7-29] |
| 9 | Hook trust | A | Let a non-toolchain clone run its own vendored gate scripts | `git config --local skilled.trustRepoHooks true` (local only, never cloned, never `-c`) | Untrusted → `SOURCE_ROOT=/dev/null/.skilled-untrusted` → all repo-owned gates silently skipped except commit-msg/Commit-Id — looks ungated but still blocked at commit-msg | Trust value + whether repo is the toolchain checkout; SKIP-with-explanation is a legitimate verdict [S: pre-commit:28-56; git-hooks/README.md:34-36] |
| 10 | Hook install state | A | Which checkout's hooks are live, per-repo or global | Symlinks under `git rev-parse --git-path hooks` → `.skilled/scripts/git-hooks/`; scope from local/global `core.hooksPath` | Foreign hook at same path → ours skipped (designed); SHADOWED target runs another checkout's scripts; linked-worktree install leaves dangling links | `--status`: each hook resolves here, no SHADOWED, foreign-hook skips named, scope reported [S: install-git-hooks.sh:72-144,188-197] |
| 11 | Preflight advisory registration | C | Per-runtime advise-on-command wiring + suppression | Runtime adapters: Claude `git-preflight-advisory.mjs` (PreToolUse), `opencode/sk-git-preflight-advisory.js`, `pi/git-preflight-advisory.ts`; suppression `SKGIT_ADVISORY=0` / `SKGIT_ADVISORY_SKIP=<id\|prefix>`; master `SK_GIT_PREFLIGHT_DISABLED` | Unregistered adapter → no advisories, silently; `SYSTEM_HOOKS_DISABLED` mutes everything including non-git hooks | File presence per runtime + registration where detectable; SKIP with paths otherwise (u1) [S: git-preflight-advisory.mjs:1-66; hook-flags.cjs:25-40] |
| 12 | Agent message gate registration | C | Pre-commit-time blocking for `-m`/PR bodies/branch names in the agent runtime | `git-message-gate.mjs` single file serving Claude/Codex `Bash`, Devin `exec`, Cursor `Shell` envelopes; registration is per-runtime config | Unregistered → agent-side violations only caught at commit-msg/pre-push (still enforced, later) | Same as #11 — registration probe is runtime-specific [S: git-message-gate.mjs:1-40] |
| 13 | Whole-chain kill switches | A | Silence all shipped hooks | `SYSTEM_HOOKS_DISABLED`, `SYSTEM_GIT_COMMIT_HOOKS_DISABLED`, per-concern envs via `isHookEnabled` | A master flag makes "installed" hooks inert — invisible to file-level checks | Suppression audit leg reports every active disable env [S: hook-flags.cjs:25-68; git-hooks/README.md:20-28] |
| 14 | `Spec:` trailer semantics | A | Repos without `specs/` packets must relax `trailers.spec` (`root`, `mustExist`) or drop the trailer | Inside the `.sk-git/` rules block (#1); `SPECKIT_COMMIT_SPEC` supplies the packet per commit when the trailer belongs | Repo without specs/ and unmodified shipped block → every commit fails `spec.root mustExist` | Standards check flags `mustExist` against actual `specs/` presence (u3) [S: commit-message-template.md:257-269; prepare-commit-msg:6-8] |

## 4. Placement decision

**`/doctor:git setup` — a third, read-only target on the existing command.** Rationale:

1. **Ownership.** `git.md` declares `skill_agent: sk-git`; the doctor command whose owner is the skill being adapted is where its setup belongs — identical to sk-code owning `setup`. [S: git.md:3-4]
2. **Repair adjacency.** Every failing leg's repair is `git config …`, `bash .skilled/scripts/install-git-hooks.sh`, or `/doctor:git hooks|standards` — the command that reports is the command that fixes. [S: _routes.yaml:236-273]
3. **Manifest cost is minimal.** One route row + one workflow YAML + one script + presentation entries; both existing routes already list the check-only invocations the battery reuses. [S: _routes.yaml:36-38,236-273]
4. **Precedent.** sk-code's design research ran this exact trade-off and chose owner-scoped target over separate command or hub mode. [Iteration 2; _routes.yaml:220-234]

## 5. Rejected designs

| ID | Idea | Why rejected |
|----|------|--------------|
| R1 | Separate `/doctor:sk-git` command | Doubles a router for one target; the concern namespace is `git` (hooks/standards), not the skill id; splits the route manifest. |
| R2 | `--setup` flag on `hooks` or `standards` | Those routes are `mutating: mutates` with approval flows; a no-approval read-only battery violates their declared mutation class and presentation contract. [S: _routes.yaml:241,259] |
| R3 | `/doctor:git-setup` companion command | Breaks the `/doctor:<command> <target>` grammar; adds a second command for one target. |
| R4 | Mutating setup (auto-init `.sk-git/`, auto-install hooks, auto-trust) | Violates the precedent's invariant verbatim — repair is an explicit operator action; a diagnostic that writes is a different route class. [S: doctor-sk-code-setup.yaml:24-31] |
| R5 | `--doctor` flags inside `worktree-naming.sh`/`validate-message.mjs` | Scatters one battery across N executables; legs can't share reporting or repair routing. |
| R6 | `install-git-hooks.sh --status` alone as the battery | Covers hook resolution only; no standards/gates/trust/allocator/advisory legs. |
| R7 | Extend `git-standards.cjs` with a `setup` subcommand | The battery spans more than standards (hooks, trust, worktrees, advisory); a new script keeps each tool's concern narrow and mirrors `sk-code-setup-check.cjs`. |

## 6. Proposed battery legs

| Leg | Check-only call | Failing → repair line |
|-----|------------------|------------------------|
| L1 provisioning | SKILL.md, `scripts/`, `hard-rules.json` present + JSON parses | vendor/reinstall sk-git |
| L2 hook install | `install-git-hooks.sh --status` parse: resolution, SHADOWED, foreign skips, hooksPath scope | `bash .skilled/scripts/install-git-hooks.sh` |
| L3 trust | `git config --local skilled.trustRepoHooks` + toolchain-checkout test | `git config --local skilled.trustRepoHooks true` (SKIP acceptable) |
| L4 gates | `git-hook-gates.cjs list --json`; saved `speckit.hooks.*` keys valid + persistable | `/doctor:git hooks` |
| L5 standards | `git-standards.cjs check --json` | `/doctor:git standards` / `init` / `set` |
| L6 contractDir | `git config skgit.contractDir` → dir exists + blocks parse | unset or fix the path — highest blast radius |
| L7 allowlist | `remote-branch-allowlist.txt` parses; ownership class reported | edit vendored copy (B) |
| L8 worktree | `worktree-naming.sh` present/exec; `speckit.worktreeBase` resolves writable; `provision-paths` entries exist | set config / fix list |
| L9 Commit-Id | `skilled.commitId` effective + policy + allocator presence | `git config --local skilled.commitId …` |
| L10 advisory rules | every `hard-rules.json` `check` ∈ `GIT_CHECKS` | fix rule key / vendored file |
| L11 suppression audit | report active `SKGIT_ADVISORY*`, `SYSTEM_*_DISABLED`, saved gate keys | unset env / flip key |
| L12 runtime adapters | per-runtime registration where detectable | SKIP with adapter paths (u1) |

## 7. Implementation phases

1. **P1 — battery script.** `git-setup-check.cjs`: legs L1–L11 (L12 optional), JSON + human modes, per-leg `repair:` lines, exit 0/1/2, `STATUS=` last line. Reuses `git-standards.cjs`, `git-hook-gates.cjs`, `install-git-hooks.sh --status`, `validate-message.mjs --explain` in check-only form.
2. **P2 — route + workflow + presentation.** `_routes.yaml` row (`target: setup`, `mutating: read-only`, `gate3_location: "n/a"`), `assets/doctor-git-setup.yaml` (clone the sk-code setup YAML shape), `doctor-git-presentation.txt` additions (menu row, verdict table, result templates), `git.md` argument-hint + target table.
3. **P3 — leg hardening.** Runtime-adapter registration probes per supported runtime (u1); `specs/` presence vs `trailers.spec.mustExist` cross-check (u3); vendored-vs-shared detection reporting class A/B scope.
4. **P4 — docs.** Update `SKILL.md`/`git.md` help text and the sk-git adaptation notes to point users at `/doctor:git setup` as the first-run verb.

## 8. Limitations and open questions

- **u1:** No uniform probe found for runtime adapter registration (Claude PreToolUse config vs opencode plugin vs pi extension). The leg degrades to SKIP-with-paths; a per-runtime detector is P3 work.
- **u2:** `hard-rules.json` has no repo-local overlay — the sidecar beside `SKILL.md` is the only source. Non-vendored consumers cannot add repo-specific advisory rules without a new mechanism.
- **u3:** `Spec:` trailer relaxation for non-specs repos goes through the `.sk-git/` rules copy, not a dedicated flag.
- **Shared-scope caveat:** for shared (non-vendored) installs, B-class files are global to every repo on that install — the battery must report them read-only rather than invite edits.
- The battery is advisory-complete only against *configuration state*; live enforcement behavior (a gate actually firing) is exercised by the hooks themselves, not reproduced by the check.

## 9. Confidence

High on placement, route shape, battery composition and the A/B/C ownership classes — all code-verified. Medium on u1 (registration probes) and u3 (cross-check details), which are recorded as limitations rather than resolved.
