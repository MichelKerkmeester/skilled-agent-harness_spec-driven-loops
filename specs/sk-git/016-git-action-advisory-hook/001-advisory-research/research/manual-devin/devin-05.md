# Devin-05: Silent-Success Git Failure Modes With No sk-git Rule

**Pass:** 5 of 10 — `manual-devin/devin-05`
**Focus:** Find git failure modes in THIS repository that have NO sk-git rule today. The target class is operations that **report success (exit 0, clean status) while doing less, or more, than the operator asked**. The briefing names one instance (`git commit --only <paths>` silently dropping an untracked named path); this pass finds the rest of that class and, just as importantly, flags candidates that look like the class but are not (loud failures, non-applicable surfaces, already-ruled).
**Scope:** Findings only. No rule encoding, no hook code. Written only under `research/`.

---

## 0. Method, verification limits, and what this pass is NOT

### 0.1 The shell constraint — and how it bounds "verified"

Every `git ...` invocation and every `bash` command is rejected by the runtime guard in this non-interactive session (same wall Devin-01/02 hit). I could not execute a single git command. Therefore **no behavior below was reproduced by running it.** What I *could* do, and did:

- **Read repo state as plaintext** via the read/grep/glob tools: `.git/config`, `.gitattributes`, `.gitignore`, `.git/HEAD`, `.git/logs/HEAD`, `opencode.json`, the sk-git skill + references, the pre-commit hook source.
- **Confirm the preconditions** each candidate needs (gitignore patterns, filter definitions, `ignorecase`, presence/absence of submodules/LFS/sparse-checkout) by reading those files directly.
- **Ground noise estimates** in the reflog counts Devin-02 already measured (cited where used) plus new counts I ran with the grep tool against `.git/logs/HEAD`.

Where a behavior depends on git's runtime semantics rather than on repo state, the Confidence column says **inferred (git semantics; not executed)**. I do not pretend these were reproduced. The briefing asks to "verify each against this actual repository rather than asserting from memory" — I verify the *preconditions* against the repo and label the *behaviors* as inferred from git semantics. That is the strongest claim this session can honestly make, and it is stronger than asserting from memory.

### 0.2 The class, stated precisely

A finding belongs to this pass's class iff:

1. The command exits 0 and leaves `git status` clean (or appearing clean), AND
2. The committed/staged/resulting state differs from what the operator's pathspec/message/flags asked for — either **less** (a named path silently excluded, a pathspec that matched nothing) or **more** (a side effect the operator did not request, e.g. silent staging, silent content rewrite).

Loud failures (exit ≠ 0, conflict markers printed) are explicitly **excluded** — they are not "reports success." I list the loudest of them in §3 as non-findings because the briefing names them as candidates to "consider," and the honest answer for several is "this is not the class; an advisory here is noise."

### 0.3 What "no sk-git rule today" means

I checked every ALWAYS / NEVER / ESCALATE rule in `.claude/skills/sk-git/SKILL.md` (lines 311-504) and the commit-workflows reference. A finding is "no rule" only if no existing rule's text governs the failure shape — not merely "the rule is not preflight-enforced." (Devin-03 already classified which existing rules are encodable; that is a separate question.) Where an existing rule covers the shape, I say so and exclude it from the new-rule findings, even if the rule is currently prompt-routed only.

### 0.4 Confidence legend

- **confirmed** — I read the repo file that establishes the precondition or documents the behavior (path cited).
- **inferred (git semantics)** — behavior follows from git's documented semantics + a confirmed repo precondition; I did not execute it.
- **inferred (workflow)** — frequency reasoned from the operator's documented workflow (commit-workflows.md) and reflog counts, not measured for this specific shape.

### 0.5 What this pass is NOT

- NOT a noise measurement. Where I cite a number it is Devin-02's reflog count or a new grep count against `.git/logs/HEAD`; where I have no number I say `not measured`.
- NOT an encoding recommendation. A finding with no rule is a candidate, not a decision.
- NOT exhaustive over git's surface. It is exhaustive over the candidate list the briefing named, plus the additional silent-success modes I could verify against this repo's config.

---

## 1. Summary table — new-rule candidates

Columns follow the briefing's required schema. "Pre-evaluable" states whether the signal is genuinely available *before* the command runs (the engine reality — `dispatch-rule-checks.mjs` is command-string-only today — is a separate phase-002 concern; this column says whether the state *exists* pre-execution, not whether the engine reads it).

| # | Operation | Pre-execution state (read before run) | Noise estimate | Source | Confidence |
|---|---|---|---|---|---|
| F1 | `git commit --only <paths>` / `-o` where a named path is untracked or has no changes | `git status --porcelain` (is the path tracked+modified?), `git diff --name-only -- <paths>` (empty → no change to commit for it). **Full pre-eval.** | not measured (reflog doesn't record `--only`); inferred very low — operator workflow uses `git add <files>` + plain `git commit`, never `--only` (commit-workflows.md §3 Step 4, §6) | Incident #5 (briefing); no rule | behavior inferred (git semantics); workflow confirmed |
| F2 | `git add <pathspec>` where the pathspec matches **nothing at all** (typo, wrong cwd, deleted-then-readded) | `git add -n <paths>` (dry-run prints nothing), `git ls-files --error-unmatch <paths>` (fails). **Full pre-eval.** | not measured (add writes no reflog); inferred low frequency but high harm-per-occurrence (the operator believes their change is staged and commits nothing for it) | new; no rule | behavior inferred (git semantics) |
| F3 | `git add <pathspec>` where the pathspec matches **only ignored files** | `git check-ignore <paths>` (non-empty), `git add -n -v <paths>` (lists as ignored). **Full pre-eval.** | not measured; inferred medium — this repo's gitignore is dense (node_modules, dist, `*.log`, `*.sqlite*`, `.worktrees/`, runtime state dirs under `.opencode/`); operators targeting DB/runtime/log paths during active work hit this routinely | new; no rule | gitignore content confirmed (`.gitignore` lines 82-321); behavior inferred (git semantics) |
| F4 | `git add`/`git commit` of `opencode.json`, `.claude/mcp.json`, `.vscode/mcp.json`, or `.codex/config.toml` — the `maintainer-flags` clean filter silently rewrites the committed blob | `.gitattributes` maps these 4 paths to `filter=maintainer-flags`; `.git/config` defines the clean/smudge (lines 20-23); `git diff --cached` vs working tree diverges for the 5 `SPECKIT_CODE_GRAPH_INDEX_*` keys. **Full pre-eval** (detect filter on staged path + diff touches those keys). | very low — fires only when editing one of 4 config files AND touching the 5 gated keys; opencode.json currently has all 5 set `"true"` (lines 76-80), so any edit to those values is the trigger | new; no rule | **confirmed** — `.gitattributes` lines 1-21 document the behavior verbatim ("`cat opencode.json` shows "true" locally; `git show HEAD:opencode.json` shows "false"") |
| F5 | `git restore <paths>` / `git checkout -- <paths>` on a file that has **staged** changes (index ≠ HEAD) | `git diff --cached --name-only -- <paths>` non-empty (path is staged) AND command lacks `--staged` (restore) or is `checkout -- ` (working-tree-only form). **Full pre-eval.** | not measured; inferred medium — the operator's selective-staging workflow (commit-workflows.md §3 Step 7: `git add` then `git reset HEAD <file>` to re-stage) routinely creates staged-but-not-working-tree states | new; no rule (ALWAYS #14 is autostash, not the index/worktree gap) | behavior inferred (git semantics); workflow confirmed |
| F6 | `git checkout <ref> -- <paths>` / `git restore --source=<ref> <paths>` — silently **stages** the restored content (writes index AND worktree) | command shape: `checkout <ref> -- <paths>` or `restore --source=<ref>` without `--worktree`-only. **Full pre-eval** from the command string alone. | very low — 7 checkouts in 34 days in the primary reflog (grep `checkout: moving from` → 7), and path-form checkouts are rarer still | new; no rule | behavior inferred (git semantics); frequency confirmed (reflog count) |
| F7 | `git merge -X ours` / `-X theirs` (or `rebase -X …`) — silently auto-resolves conflicts one-sidedly and reports clean success | `-X ours` / `-X theirs` / `-X ours-of-theirs` flag on merge/rebase. **Full pre-eval** from the command string. | not measured (reflog doesn't record flags); inferred very low — the workflow syncs via rebase-onto-origin (Devin-02 §1.4: every `rebase (start)` targets the live branch), not via `-X` strategy options | new; no rule | behavior inferred (git semantics); frequency inferred (workflow) |
| F8 | `git add -u` when untracked files exist — silently stages tracked-modified only, the new file is excluded | `git status --porcelain` shows `??` entries AND command is `git add -u`/`-u <paths>`. **Full pre-eval.** | not measured; inferred low — operator workflow uses explicit `git add <files>` (commit-workflows.md §3 Step 4: "Use `git add <specific-files>` instead of `git add .`"), so `-u` is rare; when it is used, untracked files are usually the point being missed | new; no rule (ALWAYS #13 governs over-sweeping, not under-sweeping) | behavior inferred (git semantics); workflow confirmed |
| F9 | Case-only pathspec on `ignorecase=true` — `git add foo.txt` when `Foo.txt` is tracked stages a modify to `Foo.txt` (case-folded), not a new file; `git mv Foo.txt foo.txt` can silently no-op | `git config core.ignorecase` (true in this repo, `.git/config` line 6) AND a pathspec differs only in case from a tracked file (`git ls-files` case-insensitive match). **Full pre-eval.** | very low — case-only renames are rare; the repo does heavy rename waves (ALWAYS #10) but they are content renames, not case-only | new; no rule | precondition confirmed (`ignorecase = true`); behavior inferred (git semantics) |

---

## 2. Per-finding detail

### F1 — `git commit --only <paths>` silently drops a named path that is untracked or has no changes

- **Operation:** `git commit --only <paths>` / `git commit -o <paths>` (also `-i`/`--include`, which has the inverse-but-related intent gap).
- **Pre-execution state:** `git status --porcelain -- <paths>` shows whether each named path is tracked-and-modified; `git diff --name-only -- <paths>` (worktree) and `git diff --cached --name-only -- <paths>` (index) show whether there is anything to commit for it. If a named path is untracked (`??`) or has no diff, `--only` will create a commit that does not contain it, exiting 0. **Fully pre-evaluable.** The intent gap ("did the operator mean to exclude it?") is NOT pre-evaluable, so the advisory must be worded as "named path X has no staged/unstaged change; `--only` will commit without it," not as "wrong."
- **Noise estimate:** not measured — the reflog `commit:` signature does not distinguish `--only` from plain commits. Inferred very low: the operator's documented workflow (commit-workflows.md §3 Step 4, §5, §6) is `git add <specific-files>` then plain `git commit -m`, never `--only`. The briefing's incident #5 is the one observed occurrence.
- **Source:** observed incident #5 (briefing); no sk-git rule. (Devin-01 row 1b flagged this; Devin-03 did not classify it because there is no rule to classify.)
- **Confidence:** behavior inferred (git semantics; not executed); workflow confirmed (commit-workflows.md).
- **Why it is the class:** exit 0, `git status` clean, the named path is simply absent from the commit. The operator reads "1 file changed" as success.

### F2 — `git add <pathspec>` that matches nothing at all

- **Operation:** `git add <pathspec>` where pathspec resolves to zero files (typo, wrong relative path, the file was already removed, cwd mismatch).
- **Pre-execution state:** `git add -n <paths>` (dry-run) prints nothing and exits 0; `git ls-files --error-unmatch <paths>` exits non-zero. Either is a full pre-eval signal. **Fully pre-evaluable.**
- **Noise estimate:** not measured (add writes no reflog). Inferred low frequency but high harm-per-occurrence: the operator proceeds to `git commit -m …` and either gets "nothing to commit" (loud — not this class) or, if other paths were already staged, commits those and believes the typoed path was included (silent — this class). The silent variant requires a non-empty index from other staging, which the selective-staging workflow makes common.
- **Source:** new; no rule. ALWAYS #13 governs *over*-sweeping; nothing governs *under*-sweeping.
- **Confidence:** behavior inferred (git semantics); precondition (silent variant needs pre-existing staged set) confirmed as common per commit-workflows.md §3 Step 7.
- **Why it is the class:** `git add nonexistent/path` exits 0, prints nothing, stages nothing. The operator's mental model is "I staged my change."

### F3 — `git add <pathspec>` that matches only ignored files

- **Operation:** `git add <pathspec>` where every match is gitignored (e.g. `git add .opencode/skills/system-spec-kit/mcp-server/database/foo.sqlite`, `git add some.log`, `git add dist/`).
- **Pre-execution state:** `git check-ignore <paths>` returns the ignored paths (non-empty); `git add -n -v <paths>` lists them as ignored. **Fully pre-evaluable.** Note `git add` does print nothing by default for ignored paths (no warning unless `--verbose`); the silence is the failure.
- **Noise estimate:** not measured. Inferred **medium** for this repo specifically: the gitignore is dense and layered over `.opencode/` (which is force-un-ignored via `!.opencode/` at line 10 then re-ignored for `node_modules`, `dist`, `*.log`, `*.sqlite*`, `.worktrees/`, and many runtime state dirs at lines 82-321). An operator working on DB/runtime/log tooling who targets those paths by glob will silently stage nothing. The signal that separates "noise" from "signal" here is whether the operator named a *specific* file (intent clear → warn) vs a *glob* (routine exploration → suppress). A blanket "pathspec matched only ignored" rule without that discriminator would cross the line.
- **Source:** new; no rule. NEVER #5 (secrets) is about over-inclusion of secrets, not silent under-staging.
- **Confidence:** gitignore content confirmed (`.gitignore` lines 82-321); behavior inferred (git semantics).
- **Why it is the class:** exit 0, nothing staged, `git status` unchanged. The operator commits the rest and the ignored file is quietly absent.

### F4 — The `maintainer-flags` clean filter silently rewrites committed content [STRONGEST — repo-specific, confirmed]

- **Operation:** `git add opencode.json` (or `.claude/mcp.json`, `.vscode/mcp.json`, `.codex/config.toml`) followed by `git commit`. The clean filter runs on staging and rewrites the 5 `SPECKIT_CODE_GRAPH_INDEX_*` values from `"true"` → `"false"` in the **committed blob**, while the working-tree file still shows `"true"` (smudge re-inverts on checkout).
- **Pre-execution state:** `.gitattributes` (lines 18-20) maps these 4 paths to `filter=maintainer-flags`; `.git/config` (lines 20-23) defines `clean` and `smudge` with `required = true`; `opencode.json` lines 76-80 currently hold all 5 values as `"true"`. A preflight check can: (a) detect the staged path is filter-mapped, (b) `git diff --cached` the path and check whether the diff touches one of the 5 gated keys, (c) warn that the committed blob will differ from the working tree. **Fully pre-evaluable.**
- **Noise estimate:** very low — fires only when one of 4 specific config files is staged AND the change touches the 5 gated values. Commits to those files are infrequent (config, not source). This is well under the 1-in-10 line Devin-04 §1.3 sets for passive advisories.
- **Source:** new; no rule. No sk-git rule addresses content-filter silent rewrites. The filter is repo-specific machinery (`.gitattributes` + `.git/config`), not git-core behavior, so no generic git rule covers it either.
- **Confidence:** **confirmed.** `.gitattributes` lines 16-17 state the behavior verbatim: *"After install, `cat opencode.json` shows "true" locally; `git show HEAD:opencode.json` shows "false" (what the remote sees)."* The filter is installed (`.git/config` lines 20-23). The working-tree values are `"true"` (opencode.json lines 76-80). I did not run `git show HEAD:opencode.json` to see `"false"` (git blocked), but the repo's own `.gitattributes` comment is a primary-source confirmation of the behavior.
- **Why it is the class — and the worst variant:** exit 0, `git status` clean, **`git diff` empty** (working tree matches smudged content), yet `git show HEAD:opencode.json` ≠ `cat opencode.json`. This is "reports success while doing other than asked" in its purest form: the committed content is not the content the operator edited. The trap fires the moment an operator edits one of the 5 values (e.g. sets `SPECKIT_CODE_GRAPH_INDEX_SKILLS` to `"true"` intending to commit that) and runs `git add && git commit` — the commit lands with `"false"`. The working tree still shows `"true"`, so there is no visible signal until someone clones fresh or runs `git show`.
- **Encoding note:** the advisory should fire on `git add`/`git commit` when a filter-mapped path is staged and the diff touches a gated key, and say: *"maintainer-flags clean filter will commit these values as `false`; working tree will keep `true`. If you intend to commit `true`, this will silently commit `false` — use `git -c filter.maintainer-flags.clean=cat add <file>` to stage verbatim."* That is actionable, not just a warning.

### F5 — `git restore`/`git checkout --` on a staged file: the index/working-tree gap

- **Operation:** `git restore <paths>` (no `--staged`) or `git checkout -- <paths>` or `git checkout HEAD -- <paths>` on a file that currently has **staged** changes (index ≠ HEAD).
- **Pre-execution state:** `git diff --cached --name-only -- <paths>` non-empty (the path is staged) AND the command is the working-tree-only form. **Fully pre-evaluable.**
- **Noise estimate:** not measured. Inferred **medium**: the operator's workflow routinely creates staged-then-unstaged states (commit-workflows.md §3 Step 7c: `git stash push -k` then `pop`; Step 7d: `git reset --mixed HEAD~1` then re-stage; §6 troubleshooting: `git reset HEAD <file>` to unstage). After `git reset HEAD <file>`, the change is back in the working tree, not staged — but the *inverse* mistake (running `git restore <file>` thinking it unstages) is the trap: it discards the working-tree copy while the staged copy remains. The discriminator is "is the path currently staged?" — when yes, the advisory is signal; when no, it is noise.
- **Source:** new; no rule. ALWAYS #14 (autostash) is a different index/worktree hazard. No rule covers the restore-vs-staged gap.
- **Confidence:** behavior inferred (git semantics); workflow confirmed (commit-workflows.md §3 Step 7).
- **Why it is the class:** exit 0, `git status` now shows the file as staged (it was before too, but the working-tree column changed) — the operator reads "restored" as "reverted," but the staged change is still there and will be committed. Does **less** than "revert my change."

### F6 — `git checkout <ref> -- <paths>` / `git restore --source=<ref>` silently stages

- **Operation:** `git checkout <ref> -- <paths>` or `git restore --source=<ref> <paths>` (without `--worktree`-only / `--staged`-only flags that would limit it).
- **Pre-execution state:** the command shape itself (`<ref> -- <paths>` after `checkout`, or `--source=<ref>` on `restore`) is the signal — these forms write **both** the index and the working tree, unlike plain `git restore <paths>` (worktree only) or `git restore --staged` (index only). **Fully pre-evaluable from the command string alone** — no repo state needed.
- **Noise estimate:** very low. Primary reflog has 7 `checkout: moving from` entries in 34 days (grep count), and those are branch checkouts, not path-checkouts. Path-form `checkout <ref> --` is rarer still.
- **Source:** new; no rule.
- **Confidence:** behavior inferred (git semantics); frequency confirmed (reflog checkout count = 7).
- **Why it is the class:** exit 0, `git status` shows the file as staged with no working-tree change — the operator asked to "restore this file from <ref>" and got an unexpected staged entry. Does **more** than the worktree-only restore they may have expected by analogy.

### F7 — `git merge -X ours` / `-X theirs` silently auto-resolves one-sidedly

- **Operation:** `git merge -X ours <branch>`, `git merge -X theirs <branch>`, `git rebase -X ours`, `git rebase -X theirs`.
- **Pre-execution state:** the `-X ours`/`-X theirs`/`-X ours-of-theirs` flag is on the command string. **Fully pre-evaluable from the command string.** (Whether conflicts *would* have occurred is not pre-evaluable without a trial merge, but the flag's presence is the signal — the operator is declaring "auto-resolve one-sidedly," which is the silent-success shape when conflicts do occur.)
- **Noise estimate:** not measured (reflog doesn't record flags). Inferred very low: Devin-02 §1.4 shows every sampled `rebase (start)` targets the live branch for sync, not a `-X` strategy-option merge; the workflow does not use `-X`.
- **Source:** new; no rule. NEVER #8 (no rebase of public branches) is about which commits are rebased, not about conflict strategy.
- **Confidence:** behavior inferred (git semantics); frequency inferred (workflow + Devin-02 §1.4).
- **Why it is the class:** when conflicts exist, `-X ours` discards the incoming side's conflicting hunks and reports "Merge made by the 'ort' strategy." with exit 0 — clean success, but the merge contains **less** of the incoming branch than a real merge would. The operator sees success and does not know content was silently dropped.

### F8 — `git add -u` silently excludes untracked files

- **Operation:** `git add -u` / `git add -u <paths>` when untracked files exist in the tree.
- **Pre-execution state:** `git status --porcelain` shows `??` entries AND the command is `git add -u`. **Fully pre-evaluable.**
- **Noise estimate:** not measured. Inferred **low**: the operator workflow uses explicit `git add <specific-files>` (commit-workflows.md §3 Step 4), so `-u` is rare; when it is used, the presence of untracked files is exactly the case where the operator's intent ("stage all my changes") is violated by `-u`'s tracked-only semantics. The discriminator (untracked files present) makes the rule signal, not noise, in the cases where it fires.
- **Source:** new; no rule. ALWAYS #13 is about over-sweeping with `-A`/`.`; the under-sweep of `-u` is ungoverned.
- **Confidence:** behavior inferred (git semantics); workflow confirmed (commit-workflows.md §3 Step 4).
- **Why it is the class:** exit 0, staged set excludes the new file, the operator commits and the new file is silently absent from that commit. Does **less** than "stage my changes."

### F9 — Case-only pathspec on `ignorecase=true`

- **Operation:** `git add <path>` where `<path>` differs only in case from a tracked file (e.g. `git add readme.md` when `README.md` is tracked); `git mv README.md readme.md` on a case-insensitive filesystem.
- **Pre-execution state:** `git config core.ignorecase` (true here — `.git/config` line 6) AND a case-insensitive match of `<path>` against `git ls-files` exists. **Fully pre-evaluable.**
- **Noise estimate:** very low. Case-only renames are rare; the repo's rename waves (ALWAYS #10) are content renames, not case-only.
- **Source:** new; no rule.
- **Confidence:** precondition confirmed (`ignorecase = true`, `.git/config` line 6); behavior inferred (git semantics on case-insensitive backends).
- **Why it is the class:** `git add readme.md` stages a modify against `README.md` (case-folded), not a new file — the operator's intent to add a distinct file silently becomes an in-place edit of the existing one. `git mv README.md readme.md` can silently no-op (both names resolve to the same inode on APFS). Exit 0 either way.

---

## 3. Non-findings — candidates the briefing named that are NOT in the class

These are here because the briefing explicitly asked to "consider" them. The honest answer for each is that an advisory would be noise, redundant, or inapplicable. Listing them prevents the next phase from re-litigating.

### NF1 — `git stash pop` with conflicts (briefing candidate) — LOUD, not silent

`git stash pop` that hits conflicts exits **1**, prints `CONFLICT`, and **leaves the stash on the stack** (the "intact stash" the briefing names). This is the opposite of the silent-success class: it is a loud failure with a safety behavior. An advisory here would fire *after* git already printed a conflict banner — pure noise. The real silent failure in the stash surface is the *operator's next* command (`git stash drop` after resolving, believing the pop completed) — but that is a destructive-op advisory (drop), not a silent-success advisory, and it belongs in the destructive-ops pass (D1 row 1e / the `git branch -D` class), not here.

- **Noise estimate:** would fire on every conflicted pop (git already loud) → 100% noise.
- **Source:** briefing candidate; no rule, and none warranted on these grounds.
- **Confidence:** behavior inferred (git semantics); confirmed that the repo has no current stash (`.git/refs/stash` and `.git/logs/refs/stash` do not exist — checked via glob).

### NF2 — Submodules and LFS pointers (briefing candidate) — NOT APPLICABLE to this repo

- **Submodules:** no `.gitmodules` anywhere in the repo (glob for `.gitmodules` → no files). No submodule surface exists; a submodule-pointer advisory can never fire here.
- **LFS:** `.git/config` has an `[lfs] repositoryformatversion = 0` section, but `.gitattributes` contains **no `filter=lfs` lines** (read in full, lines 1-21 — the only filter is `maintainer-flags`). No file in this repo is an LFS pointer. An LFS-pointer advisory (e.g. "you committed a pointer instead of the file") is inapplicable.
- **Confidence:** confirmed (absence of `.gitmodules` and of `filter=lfs` in `.gitattributes`).
- **Implication:** do NOT encode submodule/LFS rules for this repo; they would be dead code that implies a risk that does not exist here.

### NF3 — sparse-checkout filters (briefing candidate) — NOT APPLICABLE to this repo

No `.git/info/sparse-checkout` file (glob → no files), no `core.sparseCheckout` / `core.sparseCheckoutCone` in `.git/config` (read in full, lines 1-145). The repo is a full checkout. A sparse-checkout silent-skip advisory is inapplicable.

- **Confidence:** confirmed (absence of config + file).
- **Implication:** same as NF2 — do not encode.

### NF4 — `git commit --amend` on a pushed commit (briefing candidate) — ALREADY RULED

This is in the silent-success class behaviorally (`git commit --amend` exits 0 even when HEAD is on a remote; git does not warn), but it is **not** a no-rule finding: **NEVER #10** ("Amend a commit that has already been pushed or merged") governs it explicitly, and Devin-03 classified it MECHANICAL and fully pre-evaluable (`git branch -r --contains HEAD`). The gap is enforcement (prompt-routed, not preflight), not rule absence. It belongs to the rule-encoding phase, not to this pass.

- **Noise estimate:** Devin-02 §2.5 measured 7-9 amends in 34 days (grep `amend|commit \(amend\)` against `.git/logs/HEAD` → 9 now); under the autosync model ~all of them amend an already-pushed commit, so the rule's *hit rate* is high, not its false-positive rate. Low noise, high stakes.
- **Source:** existing rule NEVER #10.
- **Confidence:** confirmed (rule text SKILL.md line 493; amend count confirmed via grep).

### NF5 — `git reset HEAD <paths>` / `git restore --staged <paths>` on non-staged paths — harmless no-op

These exit 0 and do nothing when the path isn't staged. It is a silent no-op, but **harmless and idempotent** — the operator's intent (unstage) is already the state. An advisory here would fire on every "unstage just in case" command, which is routine. Pure noise.

- **Noise estimate:** would fire on every reset/restore-staged against an already-clean index → high noise, zero harm prevented.
- **Confidence:** behavior inferred (git semantics).

---

## 4. Cross-cutting observations for the next phase

1. **The discriminator is the rule.** Devin-02 §2.4 found this for `reset` (gate on target≠HEAD, not on the verb); this pass finds the same pattern for F3 (specific-file vs glob), F5 (path staged vs not), and F8 (untracked present vs not). Every finding above has a tight signal condition that drops the fire rate from "every invocation of the verb" to "the bug shape only." A rule encoded without its discriminator is the noise trap Devin-04 §1.3 warns about.

2. **F4 (the maintainer-flags filter) is the highest-value finding in this pass** — repo-specific, confirmed by the repo's own `.gitattributes` documentation, fully pre-evaluable, very low noise, and a failure mode that is invisible to every other gate (pre-commit runs `validate-doc-model-refs.js` and content gates — none compare staged blob to working-tree content for filter rewrites). It is also the only finding where the committed content silently differs from the on-disk content with `git diff` showing nothing — the purest "success while doing other than asked."

3. **The index/working-tree gap (F5, F6) is one mechanism, two directions.** F5 does less (restores worktree, leaves staged); F6 does more (restores from ref, also stages). They share a pre-evaluable signal (`git diff --cached` non-empty / command shape) and could be one rule with two messages.

4. **Three briefing candidates are inapplicable to this repo (NF2, NF3) or already ruled (NF4).** Encoding them would either be dead code (submodules/LFS/sparse-checkout) or duplicate NEVER #10. The next phase should not spend discriminator design on them.

5. **What this pass could not do.** No behavior was executed. F1, F2, F3, F5, F6, F7, F8, F9 are inferred from git semantics + confirmed repo preconditions; only F4's behavior is confirmed by a primary source (the `.gitattributes` comment). A pass with shell access should reproduce each before encoding — the highest-priority reproduction is F4 (`git show HEAD:opencode.json` should show the 5 values as `"false"` while `cat` shows `"true"`), because it is the finding most worth encoding and the easiest to verify with one command.
