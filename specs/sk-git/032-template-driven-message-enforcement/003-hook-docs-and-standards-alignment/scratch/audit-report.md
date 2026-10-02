## 1. Docs

**P1 — The root Git Hooks summary overstates pre-push enforcement.** [README.md:194](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/075-git-hook-review-fixes/README.md:194) says stale generated metadata blocks, every pushed commit is rechecked, and every push outside the allowlist needs approval. The skill-metadata gate warns and never blocks; message validation checks commits the push adds; and an update to the exact live branch is exempt when `SPECKIT_AUTOSYNC=1` and `SPECKIT_LIVE_BRANCH` matches. A first push creating that branch still needs the allowlist or branch-named approval. See [pre-push:220](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/075-git-hook-review-fixes/.skilled/scripts/git-hooks/pre-push:220), [pre-push:348](/Users/michelkerkme/MEGA/Development/Code_Environment/Public/.worktrees/075-git-hook-review-fixes/.skilled/scripts/git-hooks/pre-push:348), [pre-push:287](/Users/michelkerkme/MEGA/Development/Code_Environment/Public/.worktrees/075-git-hook-review-fixes/.skilled/scripts/git-hooks/pre-push:287), and [pre-push:316](/Users/michelkerkme/MEGA/Development/Code_Environment/Public/.worktrees/075-git-hook-review-fixes/.skilled/scripts/git-hooks/pre-push:316).

Replace the bullet with:

> **pre-push** blocks deletion pushes above 100 tracked files by default, and checks remote permission, route parity, track roots and message contracts. Stale skill-root metadata warns but does not block; CI enforces it. Message validation checks commits this push adds, and validates a new branch name against the worktree checklist. Outside the allowlist, updates need per-push approval except updates to the exact live branch when `SPECKIT_AUTOSYNC=1` and `SPECKIT_LIVE_BRANCH` matches. Creating a branch requires the allowlist or `SPECKIT_ALLOW_REMOTE_PUSH=<branch>`; `SPECKIT_ALLOW_REMOTE_PUSH=1` approves updates only.

**P1 — The remote-branch reference has four stale claims.** [remote-branch-policy.md:28](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/075-git-hook-review-fixes/.skilled/skills/sk-git/references/remote-branch-policy.md:28) says bare `SPECKIT_ALLOW_REMOTE_PUSH=1` approves any push, but code rejects it for branch creation ([pre-push:291](/Users/michelkerkme/MEGA/Development/Code_Environment/Public/.worktrees/075-git-hook-review-fixes/.skilled/scripts/git-hooks/pre-push:291)). Line 30 says a missing or broken `worktree-naming.sh` fails open, while the hook blocks unapproved, non-allowlisted pushes when the helper is unavailable ([pre-push:269](/Users/michelkerkme/MEGA/Development/Code_Environment/Public/.worktrees/075-git-hook-review-fixes/.skilled/scripts/git-hooks/pre-push:269)). Line 70 says autosync also exempts creation; the creation check runs before the live-branch update exception ([pre-push:291](/Users/michelkerkme/MEGA/Development/Code_Environment/Public/.worktrees/075-git-hook-review-fixes/.skilled/scripts/git-hooks/pre-push:291), [pre-push:316](/Users/michelkerkme/MEGA/Development/Code_Environment/Public/.worktrees/075-git-hook-review-fixes/.skilled/scripts/git-hooks/pre-push:316)). Line 74 says stale skill metadata blocks, but the hook only warns ([pre-push:348](/Users/michelkerkme/MEGA/Development/Code_Environment/Public/.worktrees/075-git-hook-review-fixes/.skilled/scripts/git-hooks/pre-push:348)).

Replace those claims with:

- **Line 28:** “The pre-push hook requires approval for an update to a non-allowlisted branch unless `SPECKIT_ALLOW_REMOTE_PUSH=1` is set for that push. Creating a branch requires the allowlist or `SPECKIT_ALLOW_REMOTE_PUSH=<branch>`.”
- **Line 30:** “If `worktree-naming.sh` is unavailable in a toolchain repository, the remote-permission gate blocks non-allowlisted pushes until the push is approved. The other gates retain their own failure behavior.”
- **Line 70:** “The autosync exception applies to updates of the exact live branch only. Creating that branch still requires the allowlist or `SPECKIT_ALLOW_REMOTE_PUSH=<branch>`.”
- **Line 74:** “Skill-root metadata reports stale committed metadata as a warning; the hook does not block. CI enforces this check on `main` and `skilled/v*`.”

**P1 — The primary hook README describes the wrong failure behavior.** [git-hooks/README.md:112](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/075-git-hook-review-fixes/.skilled/scripts/git-hooks/README.md:112) says the hook exits 0 if `worktree-naming.sh` fails to source. In a toolchain repo, the hook blocks unapproved pushes when that helper is unavailable ([pre-push:269](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/075-git-hook-review-fixes/.skilled/scripts/git-hooks/pre-push:269)). The same row omits the exact live-branch **update** exception.

Replace those clauses with:

> If `worktree-naming.sh` is unavailable in a toolchain repository, the remote-permission gate blocks non-allowlisted pushes until approved. Updates to the exact branch in `SPECKIT_LIVE_BRANCH` are exempt only when `SPECKIT_AUTOSYNC=1`; creating that branch still requires the allowlist or `SPECKIT_ALLOW_REMOTE_PUSH=<branch>`.

**P1 — The feature catalog says pre-push checks the entire pushed range.** [message-contract-enforcement.md:38](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/075-git-hook-review-fixes/.skilled/skills/sk-git/feature-catalog/workflow-playbooks/message-contract-enforcement.md:38) says it checks every commit in the range. The hook excludes commits already held by remote-tracking refs and, for updates, commits reachable from the old remote tip ([pre-push:220](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/075-git-hook-review-fixes/.skilled/scripts/git-hooks/pre-push:220), [pre-push:233](/Users/michelkerkme/MEGA/Development/Code_Environment/Public/.worktrees/075-git-hook-review-fixes/.skilled/scripts/git-hooks/pre-push:233)).

Replace with:

> The pre-push hook checks commits this push adds: commits not held by any remote-tracking ref and, for an update, not reachable from the old remote tip. It also checks a new branch’s name.

**P1 — Commit-Id documentation disagrees with the implemented copy exception.** [commit-message-template.md:200](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/075-git-hook-review-fixes/.skilled/skills/sk-git/assets/commit-message-template.md:200) says no other commit may carry the ID; [conventional-commit-workflows.md:34](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/075-git-hook-review-fixes/.skilled/skills/sk-git/feature-catalog/workflow-playbooks/conventional-commit-workflows.md:34) says only `HEAD` is excluded. The code also exempts another commit with matching author email and author date ([message-contract.mjs:683](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/075-git-hook-review-fixes/.skilled/skills/sk-git/scripts/lib/message-contract.mjs:683), [message-contract.mjs:705](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/075-git-review-fixes/.skilled/skills/sk-git/scripts/lib/message-contract.mjs:705)). The copy test is too broad; see §2.

After narrowing that code exemption to a verified copy identity, use:

- **Template line 200:** “No distinct commit carries the same `Commit-Id:`. A rewrite copy is exempt only when its author email, author date, tree and full message match.”
- **Workflow line 34:** “The duplicate scan excludes `HEAD` and the remote ref being overwritten. It treats a prior commit as a rewrite copy only when author email, author date, tree and full message match; otherwise a reused ID is a collision.”
- **SKILL.md line 432:** “An amend keeps its ID unless `-m` replaces the message; a cherry-pick mints a fresh ID, and a rebase copy keeps its ID. Duplicate scans ignore only verified copies with matching author email, author date, tree and message.”

**P2 — Root and install docs omit the new trust behavior.** [README.md:190](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/075-git-hook-review-fixes/README.md:190) and [install-git-hooks.sh:186](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/075-git-hook-review-fixes/.skilled/scripts/install-git-hooks.sh:186) do not explain that the machine-wide hooks run repository-owned scripts in another checkout only when its **local** config trusts them. The hook checks `git config --local` and ignores command-line and environment config ([pre-push:31](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/075-git-hook-review-fixes/.skilled/scripts/git-hooks/pre-push:31), [pre-push:43](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/075-git-hook-review-fixes/.skilled/scripts/git-hooks/pre-push:43)).

Add this sentence to the root Git Hooks section and installer output:

> In another checkout, repository-owned hook scripts run only after `git config --local skilled.trustRepoHooks true`; `git -c` and environment-provided Git config do not grant trust.

Also update [git-hooks/README.md:31](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/075-git-hook-review-fixes/.skilled/scripts/git-hooks/README.md:31) to say explicitly that the trust setting must be local; its current wording names the key but not the ignored config sources.

**P1 — The standalone hook README says a missing checker fails open.** [hooks/git/README.md:31](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/075-git-hook-review-fixes/.skilled/hooks/git/README.md:31), [hooks/git/README.md:78](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/075-git-hook-review-fixes/.skilled/hooks/git/README.md:78), and [hooks/git/README.md:101](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/075-git-hook-review-fixes/.skilled/hooks/git/README.md:101) say missing comment-hygiene tooling warns and skips. In a repository carrying the toolchain, the hook blocks if that checker is missing or not executable ([hooks/git/pre-commit:31](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/075-git-hook-review-fixes/.skilled/hooks/git/pre-commit:31)).

Replace those statements with:

> A missing comment-hygiene checker blocks in a toolchain repository and warns/skips when the repository has no toolchain. A missing Node executable or agent-mirror checker warns and skips that gate. If the hook-flags resolver is unavailable, the hook continues without evaluating its kill switches.

**P2 — The standalone hook README describes the old per-file and chained implementation.** [hooks/git/README.md:28](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/075-git-hook-review-fixes/.skilled/hooks/git/README.md:28) says the checker runs per file; [hooks/git/README.md:57](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/075-git-hook-review-fixes/.skilled/hooks/git/README.md:57) says the primary hook chains into this standalone hook. Both now copy staged blobs into a temporary tree and invoke the checker directly ([hooks/git/pre-commit:40](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/075-git-hook-review-fixes/.skilled/hooks/git/pre-commit:40), [git-hooks/pre-commit:91](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/075-git-hook-review-fixes/.skilled/scripts/git-hooks/pre-commit:91)).

Replace line 28’s behavior with:

> Copies staged blobs to a temporary tree and runs `check-comment-hygiene.sh` once with all staged paths.

Replace line 57’s responsibility with:

> The primary hook implements its own staged-blob comment-hygiene check and does not invoke this standalone `pre-commit`.

**P2 — The primary hook README claims every installed hook has the same trust block.** [git-hooks/README.md:31](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/075-git-hook-review-fixes/.skilled/scripts/git-hooks/README.md:31) says every hook carries identical source-selection and trust blocks. The six lifecycle hooks do; `commit-msg` does not use that block.

Replace with:

> The six lifecycle hooks (`prepare-commit-msg`, `pre-commit`, `pre-push`, `post-commit`, `post-merge` and `post-rewrite`) carry the shared source-selection and trust blocks. `commit-msg` locates its validator beside the installed hook and is outside that block set.

## 2. Code standards

**P1 — `Spec:` validation normalizes paths without checking containment.** [message-contract.mjs:506](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/075-git-hook-review-fixes/.skilled/skills/sk-git/scripts/lib/message-contract.mjs:506) joins the configured root and trailer value, then asks whether the resulting path exists. `Spec: ../README.md` normalizes outside `specs/` and can pass if the repository-root README exists. The containment check required by [security-testing-and-exemptions.md:36](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/075-git-hook-review-fixes/.skilled/skills/sk-code/sk-code-opencode/references/javascript/quality-standards/security-testing-and-exemptions.md:36) is absent.

Replace the join/check with a normalized-root containment check:

```js
const root = path.posix.normalize(t.spec.root || 'specs');
const rel = path.posix.normalize(path.posix.join(root, value));
if (!rel.startsWith(`${root}/`)) {
  err('trailer.spec-exists', `${key} '${value}' must stay below ${root}/.`);
} else if (ctx.specExists(rel) === false) {
  err('trailer.spec-exists', `${key} '${value}' does not name an existing packet folder (${rel}).`);
}
```

**P1 — Imported gate consumers do not enable the ReDoS fallback.** [git-message-gate.mjs:377](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/075-git-hook-review-fixes/.skilled/skills/sk-git/scripts/hooks/git-message-gate.mjs:377) sets the V8 backtracking fallback only inside `main()`. The OpenCode plugin and Pi adapter import and call `evaluateCommand()` directly ([OpenCode:17](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/075-git-hook-review-fixes/.opencode/plugins/sk-git-message-gate.js:17), [OpenCode:54](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/075-git-hook-review-fixes/.opencode/plugins/sk-git-message-gate.js:54), [Pi:25](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/075-git-hook-review-fixes/.skilled/skills/sk-git/scripts/hooks/pi/git-message-gate.ts:25), [Pi:35](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/075-git-hook-review-fixes/.skilled/skills/sk-git/scripts/hooks/pi/git-message-gate.ts:35)). That evaluator applies contract patterns from repository files ([message-contract.mjs:435](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/075-git-hook-review-fixes/.skilled/skills/sk-git/scripts/lib/message-contract.mjs:435)). This misses the ReDoS guard called out by [security-checklist.md:82](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/075-git-hook-review-fixes/.skilled/skills/sk-code/sk-code-review/assets/security-checklist.md:82).

Move `v8.setFlagsFromString('--enable-experimental-regexp-engine-on-excessive-backtracks');` to shared-module initialization before `evaluateCommand()` is called, or add it to both importing entry points before evaluation.

**P1 — Commit-Id uniqueness can be bypassed by matching author email and timestamp.** [message-contract.mjs:693](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/075-git-hook-review-fixes/.skilled/skills/sk-git/scripts/lib/message-contract.mjs:693) and [message-contract.mjs:759](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/075-git-hook-review-fixes/.skilled/skills/sk-git/scripts/lib/message-contract.mjs:759) treat equal author identity/date as a copied commit. Distinct commits can share an email and Git’s second-resolution author timestamp, so an unrelated commit carrying the same ID can be accepted despite `unique: true` in [commit-message-template.md:246](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/075-git-hook-review-fixes/.skilled/skills/sk-git/assets/commit-message-template.md:246). This is a correctness/contract-safety issue under [review-core.md:32](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/075-git-hook-review-fixes/.skilled/skills/sk-code/sk-code-review/references/review-core.md:32) and [code-quality-checklist.md:86](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/075-git-hook-review-fixes/.skilled/skills/sk-code/sk-code-review/assets/code-quality-checklist.md:86).

Keep the `HEAD` and overwritten-ref exclusions, but exempt a rewrite copy only when a stronger identity also matches, such as tree and full message. Otherwise report the existing ID as a collision.

**P1 — Staged-blob read errors silently omit files from comment hygiene.** [git-hooks/pre-commit:100](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/075-git-hook-review-fixes/.skilled/scripts/git-hooks/pre-commit:100) and [hooks/git/pre-commit:46](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/075-git-hook-review-fixes/.skilled/hooks/git/pre-commit:46) use `git show ... || continue`. If a blob read fails, the staged file is not checked. This ignores an error instead of following the shell error-recovery standard in [validation-security-and-shellcheck.md:119](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/075-git-hook-review-fixes/.skilled/skills/sk-code/sk-code-opencode/references/shell/quality-standards/validation-security-and-shellcheck.md:119).

Replace both lines with:

```bash
if ! git show ":$file" > "$HYGIENE_DIR/$file"; then
  echo "BLOCKED [gate:comment-hygiene]: could not read staged blob: $file" >&2
  exit 1
fi
```

**P2 — Temporary hygiene directories lack exit cleanup.** Both [git-hooks/pre-commit:96](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/075-git-hook-review-fixes/.skilled/scripts/git-hooks/pre-commit:96) and [hooks/git/pre-commit:42](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/075-git-hook-review-fixes/.skilled/hooks/git/pre-commit:42) create temporary directories and clean them only on the normal path. The shell standard requires cleanup traps ([validation-security-and-shellcheck.md:79](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/075-git-hook-review-fixes/.skilled/skills/sk-code/sk-code-opencode/references/shell/quality-standards/validation-security-and-shellcheck.md:79), [validation-security-and-shellcheck.md:132](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/075-git-hook-review-fixes/.skilled/skills/sk-code/sk-code-opencode/references/shell/quality-standards/validation-security-and-shellcheck.md:132)).

Add immediately after each `mktemp`:

```bash
trap 'rm -rf "$HYGIENE_DIR"' EXIT
```

I found no sk-code-opencode standards violations in the changed TypeScript or CommonJS runtime files in B.

## 3. Code READMEs

The hook READMEs inside changed code folders are covered in §1. These additional folder READMEs are stale:

**P2 — The comment-hygiene README says the checker accepts one file.** [scripts/README.md:20](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/075-git-hook-review-fixes/.skilled/skills/sk-code/sk-code-quality/scripts/README.md:20) says it scans one file. The checker accepts multiple paths and aggregates results ([check-comment-hygiene.sh:5](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/075-git-hook-review-fixes/.skilled/skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.sh:5), [check-comment-hygiene.sh:214](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/075-git-hook-review-fixes/.skilled/skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.sh:214)).

Replace with:

> Python script (kept as a `.sh` entrypoint) that scans one or more files’ comment lines for ephemeral-artifact references and exits 1 if any file has a violation.

**P2 — The compiled-route library README omits its new exported path.** [bin/lib/README.md:57](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/075-git-hook-review-fixes/.skilled/bin/lib/README.md:57) describes layout resolution but omits `AUTHORED_PROGRAM_DIR`, now exported at [compiled-route-layout.cjs:196](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/075-git-hook-review-fixes/.skilled/bin/lib/compiled-route-layout.cjs:196) and consumed by the guard and sync tool.

Replace with:

> `compiled-route-layout.cjs` resolves which internal generation a runtime root serves and exports `AUTHORED_PROGRAM_DIR`, the authored router packet path shared by the pre-commit hook, guard and sync tool.

**P2 — The event-envelope README omits a public export.** [event-envelope/README.md:20](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/078-review-gateway-iteration-record/.skilled/skills/system-deep-loop/runtime/lib/event-envelope/README.md:20) lists three exports, while `index.ts` also exports `canonicalBytesEqual` ([index.ts:13](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/078-review-gateway-iteration-record/.skilled/skills/system-deep-loop/runtime/lib/event-envelope/index.ts:13), [index.ts:14](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/078-review-gateway-iteration-record/.skilled/skills/system-deep-loop/runtime/lib/event-envelope/index.ts:14)).

Replace the row with:

> `canonical-json.ts` | `canonicalJson`, `canonicalBytes`, `canonicalBytesEqual` and `sha256Bytes`, serializing bounded JSON with sorted keys and comparing byte sequences

**P2 — The runtime scripts README omits the changed append entry point.** Its inventory at [scripts/README.md:34](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/078-review-gateway-iteration-record/.skilled/skills/system-deep-loop/runtime/scripts/README.md:34) does not list `append-mode-event.cjs`. That script now accepts bare deep-review iteration records and stores/projects them ([append-mode-event.cjs:440](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/078-review-gateway-iteration-record/.skilled/skills/system-deep-loop/runtime/scripts/append-mode-event.cjs:440)).

Add this row:

> `append-mode-event.cjs` | Appends validated mode events through the authorized gateway and projects bare deep-review iteration records back into the state log.

## 4. Environment switches and Git config

| Switch or key | Effect | `ENV-REFERENCE.md` | Hook README status |
|---|---|---|---|
| `SYSTEM_GIT_COMMIT_HOOKS_DISABLED=1`, `SYSTEM_HOOKS_DISABLED=1` | Disable the whole pre-commit chain. The master switch also disables the post-commit live-sync concern. | Correctly lists both at [ENV-REFERENCE.md:72](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/075-git-hook-review-fixes/.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md:72) and [ENV-REFERENCE.md:91](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/075-git-hook-review-fixes/.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md:91). | Correct in [git-hooks/README.md:106](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/075-git-hook-review-fixes/.skilled/scripts/git-hooks/README.md:106) and [hooks/git/README.md:88](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/075-git-hook-review-fixes/.skilled/hooks/git/README.md:88). Root README omits `SYSTEM_HOOKS_DISABLED`. |
| `SPECKIT_SKIP_COMMENT_HYGIENE=1`, `SPECKIT_SKIP_MIRROR_PARITY=1`, `SPECKIT_SKIP_CARD_SYNC=1`, `SPECKIT_SKIP_MCP_MUTATION_CLASS=1`, `SPECKIT_SKIP_ROUTE_REMINT=1`, `SPECKIT_SKIP_SPEC_REMINT=1` | Skip the corresponding primary pre-commit gate for that invocation. | Missing. | Correctly listed at [git-hooks/README.md:106](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/075-git-hook-review-fixes/.skilled/scripts/git-hooks/README.md:106). The standalone README correctly says the comment-hygiene bypass applies only to the primary hook ([hooks/git/README.md:28](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/075-git-hook-review-fixes/.skilled/hooks/git/README.md:28)). |
| `SPECKIT_SKIP_PREPARE_COMMIT_MSG=1` | Skips prepare-commit-msg stamping and cleanup. | Missing. | Correctly documented at [git-hooks/README.md:25](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/075-git-hook-review-fixes/.skilled/scripts/git-hooks/README.md:25). |
| `SPECKIT_SKIP_PREPUSH_SKILL_GATE=1`, `SPECKIT_SKIP_PREPUSH_ROUTE_GATE=1`, `SPECKIT_SKIP_PREPUSH_TRACK_GATE=1` | Skip the skill-metadata warning, route guard/parity, or track-root gate, respectively. | Missing. | Listed at [git-hooks/README.md:112](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/075-git-hook-review-fixes/.skilled/scripts/git-hooks/README.md:112); its failure-mode wording needs the §1 correction. |
| `SPECKIT_ALLOW_MASS_DELETION=1`, `SPECKIT_MASS_DELETION_THRESHOLD=<n>`, `SPECKIT_ALLOW_REMOTE_PUSH=1` or `=<branch>` | Approve one mass-deletion push; tune the deletion threshold; approve remote updates (`=1`) or a named branch (`=<branch>`, including creation). | Missing. | Correctly listed at [git-hooks/README.md:112](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/075-git-hook-review-fixes/.skilled/scripts/git-hooks/README.md:112). The remote-branch reference at [remote-branch-policy.md:28](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/075-git-hook-review-fixes/.skilled/skills/sk-git/references/remote-branch-policy.md:28) is wrong about branch creation; see §1. |
| `SPECKIT_AUTOSYNC=0`, `SYSTEM_LIVE_SYNC_DISABLED=1` | Disable this launch’s post-commit publish or the broader live-sync loop. | Correctly listed at [ENV-REFERENCE.md:92](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/075-git-hook-review-fixes/.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md:92) and [ENV-REFERENCE.md:95](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/075-git-review-fixes/.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md:95). | Correctly described at [git-hooks/README.md:108](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/075-git-hook-review-fixes/.skilled/scripts/git-hooks/README.md:108). |
| `SPECKIT_AUTOSYNC=1` with `SPECKIT_LIVE_BRANCH=<branch>` | Exempts an **update** to the exact live branch from the remote-permission gate; it does not exempt creating that branch. | Both variables are listed, but their pre-push update effect is missing from [ENV-REFERENCE.md:95](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/075-git-hook-review-fixes/.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md:95) and [ENV-REFERENCE.md:96](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/075-git-hook-review-fixes/.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md:96). | Post-commit use is documented; the remote-permission exception is missing from the pre-push row at [git-hooks/README.md:112](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/075-git-hook-review-fixes/.skilled/scripts/git-hooks/README.md:112). |
| `core.hooksPath` | Redirects Git to another hook directory, which can bypass this installation. | Not applicable: Git config, not an environment variable. | The installer and primary README correctly explain custom-path resolution/shadowing ([install-git-hooks.sh:189](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/075-git-hook-review-fixes/.skilled/scripts/install-git-hooks.sh:189), [git-hooks/README.md:124](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/075-git-hook-review-fixes/.skilled/scripts/git-hooks/README.md:124)). |
| `skgit.contractDir` | Selects the contract-template directory; selecting templates without an “Enforced rules” block leaves that contract kind unenforced. | Not applicable: Git config. | The feature catalog documents it at [message-contract-enforcement.md:29](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/075-git-hook-review-fixes/.skilled/skills/sk-git/feature-catalog/workflow-playbooks/message-contract-enforcement.md:29), but the hook README does not name the setting ([git-hooks/README.md:26](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/075-git-hook-review-fixes/.skilled/scripts/git-hooks/README.md:26)). |

Add these rows to `ENV-REFERENCE.md` for the omitted gate switches:

```md
| `SPECKIT_SKIP_COMMENT_HYGIENE` | unset | `=1` | Skips the primary pre-commit staged comment-hygiene gate for this invocation. | `.skilled/scripts/git-hooks/pre-commit` |
| `SPECKIT_SKIP_MIRROR_PARITY` | unset | `=1` | Skips the primary pre-commit mirror-parity gate for this invocation. | `.skilled/scripts/git-hooks/pre-commit` |
| `SPECKIT_SKIP_CARD_SYNC` | unset | `=1` | Skips the primary pre-commit card-sync gate for this invocation. | `.skilled/scripts/git-hooks/pre-commit` |
| `SPECKIT_SKIP_MCP_MUTATION_CLASS` | unset | `=1` | Skips the primary pre-commit MCP mutation-class gate for this invocation. | `.skilled/scripts/git-hooks/pre-commit` |
| `SPECKIT_SKIP_ROUTE_REMINT` | unset | `=1` | Skips the primary pre-commit compiled-routing re-mint gate for this invocation. | `.skilled/scripts/git-hooks/pre-commit` |
| `SPECKIT_SKIP_SPEC_REMINT` | unset | `=1` | Skips the primary pre-commit spec derived-metadata re-mint gate for this invocation. | `.skilled/scripts/git-hooks/pre-commit` |
| `SPECKIT_SKIP_PREPARE_COMMIT_MSG` | unset | `=1` | Skips prepare-commit-msg trailer stamping and cleanup for this invocation. | `.skilled/scripts/git-hooks/prepare-commit-msg` |
| `SPECKIT_SKIP_PREPUSH_SKILL_GATE` | unset | `=1` | Skips the pre-push skill-root metadata warning gate. | `.skilled/scripts/git-hooks/pre-push` |
| `SPECKIT_SKIP_PREPUSH_ROUTE_GATE` | unset | `=1` | Skips the pre-push compiled-route guard and parity checks. | `.skilled/scripts/git-hooks/pre-push` |
| `SPECKIT_SKIP_PREPUSH_TRACK_GATE` | unset | `=1` | Skips the pre-push track-root consistency gate. | `.skilled/scripts/git-hooks/pre-push` |
| `SPECKIT_ALLOW_MASS_DELETION` | unset | `=1` | Approves one push that exceeds the tracked-file deletion threshold. | `.skilled/scripts/git-hooks/pre-push` |
| `SPECKIT_MASS_DELETION_THRESHOLD` | `100` | integer | Sets the pre-push tracked-file deletion threshold. | `.skilled/scripts/git-hooks/pre-push` |
| `SPECKIT_ALLOW_REMOTE_PUSH` | unset | `=1` or `=<branch>` | Approves one remote update with `=1`; a named branch value approves an update or creation. | `.skilled/scripts/git-hooks/pre-push` |
```

Also update the existing `SPECKIT_AUTOSYNC` and `SPECKIT_LIVE_BRANCH` descriptions to say that together they exempt only updates to the exact live branch from the remote-permission gate. Add to the hook README’s pre-push row:

> Updates to the exact `SPECKIT_LIVE_BRANCH` are permission-exempt when `SPECKIT_AUTOSYNC=1`; creating that branch still requires the allowlist or `SPECKIT_ALLOW_REMOTE_PUSH=<branch>`.

For the contract-directory config, add to the hook README’s `commit-msg` description:

> Contract resolution honors `skgit.contractDir`; if the selected template has no “Enforced rules” block, that contract kind is not enforced.

`skilled.trustRepoHooks=true` is an opt-in trust setting, not a bypass switch. The hook README mentions the local setting but should also say that `git -c` and environment-provided Git config do not grant trust. `SPECKIT_SKIP_COMMIT_MSG_VALIDATE=1` is not an active bypass; the test confirms it no longer passes an invalid message ([commit-msg.test.sh:217](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/075-git-hook-review-fixes/.skilled/scripts/git-hooks/tests/commit-msg.test.sh:217)).

Scope: I compared A’s five HEAD-only commits to their merge base, and limited B review to the specified runtime directory. This was a read-only audit; I made no changes and ran no tests.

## NO CHANGE NEEDED

- [continuous-integration.md:117](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/075-git-hook-review-fixes/.skilled/skills/sk-git/references/continuous-integration.md:117) — accurately documents the CI metadata enforcement and live-sync behavior.
- [git-hooks/lib/README.md:25](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/075-git-hook-review-fixes/.skilled/scripts/git-hooks/lib/README.md:25) — helper responsibilities match the code.
- [append-mode-event-script.md:26](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/078-review-gateway-iteration-record/.skilled/skills/system-deep-loop/runtime/feature-catalog/script-entry-points/append-mode-event-script.md:26) — updated description matches the new iteration-record path.