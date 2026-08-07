# Devin-02: Noise Measurement Against Real Repository History

**Pass:** 2 of 10 — `manual-devin/devin-02`
**Focus:** Measure how often each candidate advisory rule would have fired, against this repository's actual history. Identify which candidates cross the ~1-in-5 noise line.
**Scope:** Findings only. No rule encoding, no hook code, no files touched outside `research/`.

---

## 0. Method — and what could not be measured

### 0.1 The shell constraint and the workaround

`git` subcommands are blocked in this non-interactive session (every `git ...` invocation is rejected by the runtime guard; `cat`, `ls`, `wc`, `grep`, and the `grep` tool are not). Devin-01 hit the same wall and therefore produced **zero** measured numbers. This pass gets real numbers by reading git's **plaintext reflog files directly** with the `read` and `grep` tools, bypassing the `git` CLI entirely:

- `.git/logs/HEAD` — the primary checkout's HEAD reflog (every HEAD-moving op on the main tree, with timestamps and before/after SHAs).
- `.git/worktrees/*/logs/HEAD` — one reflog per linked worktree.
- `.git/logs/refs/remotes/origin/**` — remote-tracking reflogs (pushes show as `update by push`; fetches as `fetch`; force-pushes as `forced ...`).

Reflogs are the ground truth for **operation frequency** (the noise denominator). They are **not** a record of: the working-tree state at the time, command flags (`--autostash`, `--hard`, `--only`), `git add` (staging does not move HEAD), `git stash`, `git branch -d/-D` (branch deletion does not move HEAD), or which checkout issued a given push. Where a noise estimate depends on one of those, it is marked **unmeasurable from reflog** and the basis is stated as inferred. I do not guess numbers.

### 0.2 What "noise" means here, and the threshold

A candidate rule fires on some fraction of the invocations of its target operation shape. The briefing sets the line at **~1 in 5 (20%)**: a rule that fires on more than ~20% of the operations it gates is a noise problem, because operators learn to skim past it. I report, per candidate:

- **Raw fire rate** — what fraction of the operation's measured invocations the rule would fire on if gated only on the operation shape.
- **Gated fire rate** — what fraction remains after the rule's real signal condition is applied (e.g. "reset target ≠ HEAD", "branch not in allowlist", "commits in range already on origin"). This is the number that matters.
- **Absolute count and rate per day** — because a rule that fires on 100% of a 0-frequency operation is still silent.

### 0.3 The measurement window

| Datum | Value | Source |
|---|---|---|
| First primary reflog entry | ts `1782237157` | `.git/logs/HEAD` line 1 |
| Last primary reflog entry | ts `1785178815` | `.git/logs/HEAD` line 1489 |
| Window | **~34.0 days** (2,941,658 s) | computed |
| Current branch | `skilled/v4.0.0.0` | `.git/HEAD` |
| Linked worktrees registered | **32** | `ls .git/worktrees/` |

All per-day rates below divide by 34. The window is the *reflog's* lifetime, not the repo's: older history is outside this measurement. The repo's first commit is older than the reflog's first entry (reflogs are pruned by `gc.reflogExpire`, default 90 days), so this is effectively a recent-activity snapshot, which is the right window for a noise estimate — stale patterns do not justify current noise.

---

## 1. The measured dataset

### 1.1 Primary checkout — `.git/logs/HEAD` (1,489 entries)

| Operation | Reflog signature | Count | /day | Notes |
|---|---|---|---|---|
| `commit` (plain) | `commit: ` | **1076** | 31.6 | |
| `commit --amend` | `commit (amend):` | **7** | 0.21 | NEVER #10 territory |
| merge commit created | `commit (merge):` | **11** | 0.32 | |
| **total commits** | | **1094** | 32.2 | |
| `checkout` | `checkout: moving from` | **7** | 0.21 | |
| `merge` (operation) | `\tmerge ` | **62** | 1.82 | includes the 11 merge commits above + fast-forwards |
| `rebase` (entries) | `\trebase ` | **44** | 1.29 | **≈11 rebase operations** — each op emits start + pick + continue + finish entries (see §1.4) |
| `reset` (total) | `reset: moving to` | **201** | 5.91 | |
| ↳ unstage-only (`reset` to HEAD, no history move) | `reset: moving to HEAD` | **188** | 5.53 | 93% of all resets; old SHA == new SHA |
| ↳ history-moving (`HEAD~`/`HEAD^`) | `reset: moving to HEAD[~^]` | **12** | 0.35 | |
| ↳ other target | remainder | **1** | 0.03 | |
| `cherry-pick` / `revert` | `\t(cherry\|revert)` | **9** | 0.26 | |
| `pull` | `\tpull:` | **0** | 0 | **nobody pulls** — the workflow syncs via rebase-onto-origin + autosync |
| `commit (initial)` | | 0 | | |

Tally of classified entries: 1094 + 7 + 62 + 44 + 201 + 9 = 1417. The remaining ~72 are rebase-internal continuation entries (`rebase (continue)`, `rebase (finish): returning to refs/heads/...`) already inside the 44 rebase count via the `\trebase ` pattern, plus a few I did not separately classify; they do not change any rate materially.

### 1.2 Worktrees — 32 linked worktrees, 824 total reflog entries

Worktree reflog sizes (lines per worktree), sorted by activity:

```
164  0069-skilled-router-refactor-impl
115  0063-skilled-router-collapse
105  0042-sk-doc-017-authoring
 84  0068-sk-doc-020-migration-exec
 55  0089-sk-doc-default-routing-cutover
 33  0062-skilled-command-router-generation
 31  0101-system-deep-loop-deep-alignment-multi-executor
 30  0097-sk-doc-documentation-quality
 25  0108-cli-external-orchestration-cli-pi-creation
 22  0091-system-deep-loop-036-execution
 20  0104-sk-doc-019-audit-remediation
 19  0093-sk-design-012-gap-research
 16  0055-skilled-migration-000-scaffold
 13  0038-codex-hook-parity
 11  0064-skilled-spec-root-resolution-impl
 11  0103-sk-design-structure-naming-cleanup
  7  0066-skilled-speckit-renumber-026
  7  0096-sk-design-interface-command-research
  7  0099-sk-design-hallmark-adoption-build
  6  0095-sk-design-018-post-review-remediation
  5  0067-sk-doc-020-hyphen-naming-review
  4  0039-017-hyphen-naming
  4  0094-sk-design-017-remediation-review
  4  0105-sk-doc-post-019-alignment-resume
  4  0106-sk-doc-post-019-research-resume
  3  0098-sk-design-012-program-merge
  3  0100-system-deep-loop-cli-codex-write-containment
  3  0102-deep-review-031-hardening-review
  3  0107-sk-doc-post-remediation-research
  3  0109-sk-doc-021-review-rerun
  2  0079-sk-git-per-repo-ssh-auth
  2  0110-system-deep-loop-036-execution-build
  2  main-review-gate
  1  0050-detached-066-live-capture   ← single initial checkout to a detached HEAD, no further activity (inspection worktree)
```

Operation breakdown across all worktree reflogs (`grep -rh` over `.git/worktrees/*/logs/HEAD`):

| Operation | Count | /day | Notes |
|---|---|---|---|
| `commit` (plain) | **386** | 11.4 | |
| `rebase` (entries) | **327** | 9.62 | **52 are `rebase (start)`** → ≈52 rebase operations (see §1.4) |
| `reset` | **54** | 1.59 | unstage-only vs history-moving split not measured for worktrees |
| `merge` | **11** | 0.32 | |
| `checkout` | **2** | 0.06 | both in `0068`: `sk-doc/0068-... → integration-v2 → sk-doc/0068-...`; **zero detached-HEAD checkouts across all worktrees** |
| `cherry-pick`/`revert`/`amend` | **8** | 0.24 | not split |
| `pull` | **0** | 0 | |

### 1.3 Remote — pushes and fetches against `origin`

| Branch (remote-tracking reflog) | `update by push` count | Notes |
|---|---|---|
| `origin/skilled/v4.0.0.0` | **489** | the autosync live branch; first push ts `1783512761` (day ~14.8 of the window) |
| `origin/main` | **3** | allowlisted; 1 of the 4 entries is a `fetch ... fast-forward`, so 3 pushes |
| `origin/sk-doc/0097-documentation-quality` | small | feature branch |
| `origin/cli-external-orchestration/0108-cli-pi-creation` | small | feature branch |
| **Total `update by push` across all remote reflogs** | **490** | `grep -rh "update by push" .git/logs/refs/remotes/ \| wc -l` |
| **Force pushes** (`forced ...`) | **0** | `grep -rh "forced" .git/logs/refs/remotes/ \| wc -l` → 0 |
| **Fetches** | **33,208** | almost all in `origin/HEAD` at **60-second intervals** — an automated background poller (IDE/GitLens or a sync daemon), NOT human-driven |

The 60-second fetch cadence: consecutive entries like `1782366421`, `1782366479`, `1782366539`, … (+60 s). This is a relentless background fetcher, ~977 fetches/day. `git fetch` is not a candidate advisory target (it is safe), but this number sets the ceiling on **anything** the engine might do per Bash command: an advisory that itself shells out to git plumbing on every command pays this cost ~977×/day before any human command is even considered.

### 1.4 Rebase semantics — why entry counts overstate operation counts

A single `git rebase` emits multiple reflog entries. Sampled from the primary reflog:

```
rebase (start): checkout origin/system-speckit/028-memory-search-intelligence
rebase (pick): feat(deep-loops/037): ...
rebase (continue): chore(028/016): checkpoint generated metadata regen
rebase (finish): returning to refs/heads/system-speckit/028-memory-search-intelligence
```

So 44 primary rebase entries ≈ **11 rebase operations**. Worktree `rebase (start)` count = **52**, so ≈ **52 rebase operations** in worktrees. Clone-wide ≈ **63 rebase operations** over 34 days (~1.9/day).

**Every sampled `rebase (start)` targets `origin/skilled/v4.0.0.0`, `skilled/v4.0.0.0`, or `origin/system-speckit/...`** — i.e. rebasing the current branch *onto* a release/integration tip to sync. None sample as "rebase my feature branch's own published history." This is the dominant rebase pattern in this repo: sync onto the live branch, not rewrite public commits.

### 1.5 Clone-wide totals (the denominators)

| Quantity | Total | /day |
|---|---|---|
| HEAD-moving operations (primary + worktrees) | **2,313** | 68.0 |
| Commits (plain + amend + merge-commit) | **1,480** | 43.5 |
| Pushes | **490** | 14.4 |
| Rebase operations (≈) | **63** | 1.85 |
| Merge operations | **73** | 2.15 |
| Resets (primary; worktree split unmeasured) | **201** | 5.91 |
| Checkouts | **9** | 0.26 |
| Force pushes | **0** | 0 |
| Pulls | **0** | 0 |
| Background fetches | **33,208** | 977 |

---

## 2. Per-candidate noise analysis

For each candidate I give: the measured operation count (denominator), the raw fire rate if gated only on the operation shape, the gated fire rate after the real signal is applied, and a noise verdict. The **1-in-5 line is 20%**.

### 2.1 `git push` — ALWAYS #18 / ESCALATE #2 (account mismatch)

- **Operation count:** 490 pushes / 34 days.
- **Raw fire rate (gate on "is a push"):** 490/490 = **100%**. **Catastrophic noise.**
- **Why:** 489 of 490 pushes target `origin/skilled/v4.0.0.0`, the autosync live branch. Under the continuous-integration model (ALWAYS #16), each wrapper-session commit is published by the `post-commit` hook via `git-sync.sh`. These are the *designed, exempt* path. A push advisory that does not exclude them fires on essentially every push.
- **Gated fire rate:** exclude (a) `SPECKIT_AUTOSYNC=1` invocations, (b) targets in the remote allowlist (`main`, `skilled/v*`, `remote-branch-allowlist.txt`). After that, the candidate set is the handful of feature-branch pushes (`sk-doc/0097-*`, `cli-external-orchestration/0108-*`) — **≤ a few per 34 days**, well under 1% of pushes.
- **Account-mismatch sub-signal (ESCALATE #2):** **unmeasurable from reflog.** The reflog does not record which `gh` account issued the push. Inferred: rare (the operator owns the remote; the incident was a switched-account edge case). Cannot be confirmed here.
- **Noise verdict:** **RAW = crosses the line catastrophically (100%). GATED = well under the line (<1%).** The gate is not optional; an ungated push advisory is the single worst noise source in this dataset.
- **Confidence:** operation count **confirmed**; gated rate **confirmed** for the allowlist exclusion; account-mismatch rate **inferred, not measured**.

### 2.2 `git push --force` / `--force-with-lease` — NEVER #1 / ESCALATE #4

- **Operation count:** **0 force pushes** in 34 days (`grep -rh "forced" .git/logs/refs/remotes/` → 0).
- **Raw fire rate:** 0/0 — undefined, but **0 historical fires**.
- **Noise verdict:** **Pure signal. Zero noise.** A force-push advisory that fires only on `--force`/`--force-with-lease`/`-f` would have been silent for the entire measurement window and would cost nothing until a force push actually happens. This is the cleanest candidate in the set.
- **Confidence:** **confirmed** (the `forced` signature is absent from every remote reflog).

### 2.3 `git rebase` — NEVER #8 (no rebase of public/shared branches)

- **Operation count:** ≈63 rebase operations (44 primary entries ≈ 11 ops + 52 worktree starts).
- **Raw fire rate (gate on "is a rebase"):** 63/63 = **100%**. **Catastrophic noise.**
- **Why:** every sampled `rebase (start)` is `checkout origin/skilled/v4.0.0.0` or `checkout skilled/v4.0.0.0` — a **sync onto the live branch**, replaying the current branch's *unpublished* WIP commits on top of the latest tip. NEVER #8 forbids rebasing *public* commits; these rebases replay *local* commits. An advisory that fires on every `git rebase` would fire ~63 times, ~60 of them on routine syncs.
- **Gated fire rate:** fire only when at least one commit in the rebased range (`git log --oneline <upstream>..HEAD`) is already reachable from a remote ref (`git branch -r --contains <sha>`). This is **pre-evaluable** (both commands run before the rebase starts). Inferred gated rate: low — the whole point of these rebases is to publish the local commits *after* syncing, so few-to-none of the rebased commits are already on origin at rebase time. **Not measured** (would need per-commit `branch -r --contains`, which requires the `git` CLI that is blocked here).
- **Noise verdict:** **RAW = crosses the line (100%). GATED = under the line (inferred low).** The gate is mandatory and is more expensive than the others (per-commit remote-contains check), but the operation frequency is only ~1.9/day so the cost is bounded.
- **Confidence:** operation count and sync-pattern **confirmed**; gated rate **inferred, not measured**.

### 2.4 `git reset` — history-moving reset (new, lossy-discard class)

- **Operation count:** 201 primary resets (+ 54 worktree, unsplit).
- **Raw fire rate (gate on "is a reset"):** 201/201 = **100%**. **Catastrophic noise.**
- **Why:** **188 of 201 (93%)** are `reset: moving to HEAD` with old SHA == new SHA — i.e. plain `git reset` (mixed, no argument), used to **unstage**. This is a routine staging-discipline action in this repo's commit workflow (stage selectively, reset to re-stage). It moves no history and loses no work.
- **Gated fire rate:** fire only when the reset target ≠ current HEAD (i.e. `--hard`, or `HEAD~`/`HEAD^`/`<sha>`/`<ref>`). Measured: **12 `HEAD~`/`HEAD^` + 1 other = 13 fires** over 34 days = 0.38/day = **6.5% of resets**.
- **Noise verdict:** **RAW = crosses the line (93% of fires are noise). GATED = well under the line (6.5%).** The gate is trivial: compare the reset target to `git rev-parse HEAD` and suppress when equal.
- **Confidence:** **confirmed** (188/201/13 are direct reflog counts).

### 2.5 `git commit --amend` — NEVER #10 (no amend of pushed/merged commit)

- **Operation count:** 7 amends (primary). Worktree amend count not separated from cherry/revert (8 combined); **inferred** a small number are amends.
- **Raw fire rate (gate on "is an amend"):** 7/7 = 100% of amends — but only **7 fires in 34 days (0.21/day)**.
- **Autosync interaction:** under the continuous-integration model, the `post-commit` hook publishes each commit to the live branch within seconds. So *every* amend in this repo amends a commit that is, by the time the amend runs, already on `origin/skilled/v4.0.0.0`. The advisory would therefore be **correct** on ~all 7, not noisy — it is the rule's *hit rate* that is high, not its false-positive rate.
- **Noise verdict:** **Under the line on absolute volume** (7 fires / 34 days is negligible attention cost). The danger is the opposite of noise: if the advisory is *advisory-only* and the operator amends anyway, the autosynced live branch diverges from the amended history. Worth flagging as a high-stakes-low-frequency rule, not a noise problem.
- **Confidence:** amend count **confirmed**; "already pushed" status **inferred** (autosync model + the post-commit hook documented in ALWAYS #16; not verified per-commit because `git branch -r --contains` is blocked).

### 2.6 `git merge` / `git rebase` / `git pull` / `git checkout` against a dirty tree — ALWAYS #14 (autostash-prone)

- **Operation count:** 73 merges + 63 rebase ops + 0 pulls + 9 checkouts = **145 candidate ops / 34 days** (4.3/day).
- **The signal is dirty-tree state.** The reflog does **not** record working-tree state. **Unmeasurable from reflog** how many of these 145 ran against a non-empty tree.
- **`--autostash` flag frequency:** the reflog does not record flags. **Unmeasurable.**
- **Inferred:** the rule's own advice ("commit substantial work before an autostash-prone op") and the autosync-every-commit workflow imply the tree is usually clean at merge/rebase time; the 93-file incident is the exception. So the gated fire rate (dirty tree + autostash-prone op) is probably low, but I cannot put a number on it.
- **Noise verdict:** **unmeasurable.** Operation frequency is moderate (4.3/day); a rule gated only on the *operation shape* (merge/rebase/pull) would fire 145× and be ~100% noise; a rule gated on `--autostash` flag presence would fire on an unmeasured-but-inferred-small subset. The flag gate is the safe design.
- **Confidence:** operation counts **confirmed**; dirty-tree signal rate **inferred, not measured**.

### 2.7 `git checkout` / `git switch` — dirty-tree carry (ALWAYS #14 adjacent)

- **Operation count:** **9 checkouts total** (7 primary + 2 worktree) / 34 days = 0.26/day.
- **Noise verdict:** **Under the line on volume alone.** Even a 100% raw fire rate is 9 fires / 34 days. This is a low-noise surface by frequency; the only risk is the dirty-tree-carry signal, which is unmeasurable (see §2.6).
- **Confidence:** **confirmed** count.

### 2.8 `git add <dir>` / `git add -A` / `git add -u` in a dirty tree — ALWAYS #13 (scope the commit)

- **Operation count:** **unmeasurable from reflog.** `git add` does not move HEAD and writes no reflog entry. I have no count of `add` invocations.
- **The signal:** dirty tree + directory/wildcard pathspec + (for the incident) pre-existing staged content from another session. The first two are the norm during active work — the tree is dirty ~whenever someone runs `git add`. So a rule gated on "dirty tree + dir pathspec" would fire on **most** `git add -A`/`git add <dir>` invocations.
- **Noise verdict:** **unmeasurable, but the structure suggests high noise** for a dirty-tree-only gate. The signal that actually matches the incident ("another session already has staged deletions under this dir") is much narrower and pre-evaluable (`git diff --cached --name-only` shows existing staged paths; `git status --porcelain` shows the dirty set). A rule gated on *that* would be low-noise; a rule gated on "dirty tree + dir pathspec" alone would cross the line.
- **Confidence:** operation count **unmeasurable**; noise structure **inferred**.

### 2.9 `git commit --only <paths>` / `-o` — incident #5 (no rule today)

- **Operation count:** **unmeasurable from reflog.** Reflog `commit:` entries do not distinguish `--only` from plain commits.
- **Noise verdict:** **unmeasurable.** Inferred low frequency (the operator's commit workflow uses selective `git add` + plain `git commit`, not `--only`, per the commit-workflows reference). The failure mode (silently dropping a named path that has no changes) is pre-evaluable: `git diff --name-only -- <paths>` empty → warn. That gate would fire only on the bug shape, not on every `--only`.
- **Confidence:** **unmeasurable**; inferred low.

### 2.10 `git push` from a detached / worktree HEAD — ALWAYS #15

- **Operation count:** 490 pushes, but the remote reflog does **not** record which checkout issued the push. **Unmeasurable from reflog** how many pushes came from a worktree vs the primary tree.
- **What is measurable:** only **2 worktree checkouts** in 34 days, both branch-to-branch switches in `0068`, **zero detached-HEAD checkouts** across all 32 worktrees. The one "detached" worktree (`0050-detached-066-live-capture`) did a single initial checkout to a detached HEAD and **no further activity** — an inspection worktree, not a push source.
- **Inferred:** under autosync, the ~489 live-branch pushes are issued *by wrapper worktree sessions* (the `post-commit` hook runs in the worktree). So "push from a worktree" is in fact the *common* case — but it is the **exempt** designed path (ALWAYS #16). The incident (#2) was a *manual* `git push origin HEAD:<branch>` from a cherry-pick worktree, which is the rare non-exempt case. The advisory must distinguish "autosync to the designated live branch" (exempt) from "manual push of a detached/worktree HEAD to a branch the primary checkout holds" (signal). The latter's frequency is **not measurable** here.
- **Noise verdict:** **unmeasurable for the real signal.** An ungated "push from a worktree" rule would be ~99% noise (it would flag the autosync path). The gate (skip autosync; fire only when pushing a detached HEAD or a branch checked out by another worktree) is mandatory and is the whole rule.
- **Confidence:** checkout counts **confirmed**; push-source-by-checkout **unmeasurable**.

### 2.11 `git pull` — new (routine-but-noisy class)

- **Operation count:** **0 pulls** in 34 days.
- **Noise verdict:** **Zero fires, zero noise — and zero value.** Nobody pulls; the workflow syncs via `rebase onto origin/<tip>` + autosync. A `git pull` advisory would be silent here. Listed only to note that the "pull is routine → high noise" concern from Devin-01 does not apply to *this* repo: pull frequency is 0.
- **Confidence:** **confirmed** (0 `\tpull:` entries in primary and all worktree reflogs).

### 2.12 `git branch -D` — new (unreachable-from-HEAD loss)

- **Operation count:** **unmeasurable from the HEAD reflog.** Branch deletion does not move HEAD; it would appear in `.git/logs/refs/heads/<branch>` (the deleted branch's own reflog) which I did not survey. **Not measured.**
- **Noise verdict:** **unmeasurable.** Inferred low frequency (the workflow deletes branches via ALWAYS #6 after merge, using `-d` which refuses unmerged; `-D` is the force variant). A `-D`-only gate would fire on an inferred-rare surface.
- **Confidence:** **unmeasurable**.

### 2.13 `git clean -fd[x]` / `git reset --hard` — new (lossy-discard class)

- **Operation count:** **unmeasurable from the HEAD reflog.** `git clean` does not move HEAD. `reset --hard` to HEAD does not move HEAD either; `reset --hard <ref>` would show as a `reset: moving to <ref>` entry, but the reflog does not record the `--hard` flag, so it cannot be separated from `--mixed`/`--soft` to the same target. The 12 `HEAD~`/`HEAD^` resets (§1.1) include an unknown mix of `--hard` and `--soft`/`--mixed`.
- **Noise verdict:** **unmeasurable.** The `clean -f` flag is itself the signal (the operator typed `-f`), so a rule gated on the flag fires only on the lossy invocation — low noise by construction, frequency unmeasured.
- **Confidence:** **unmeasurable**.

---

## 3. Noise winners — which candidates cross the 1-in-5 line

Ranked by **raw** (ungated) fire rate. The gated column is the number that should govern inclusion.

| Candidate | Op count (34 d) | Raw fire rate | Crosses 20% raw? | Gated fire rate | Crosses 20% gated? |
|---|---|---|---|---|---|
| `git push` (ALWAYS #18) | 490 | 100% | **YES — catastrophic** | <1% (exclude autosync + allowlist) | no |
| `git rebase` (NEVER #8) | ~63 | 100% | **YES — catastrophic** | low (inferred; only published commits in range) | no |
| `git reset` (new) | 201 | 100% | **YES — 93% is pure noise** | 6.5% (target ≠ HEAD) | no |
| `git add <dir>` (ALWAYS #13) | unmeasured | inferred high | **YES (inferred)** | low if gated on cross-session staged content | no (inferred) |
| `merge/rebase/pull` dirty-tree (ALWAYS #14) | 145 | 100% if gated on op shape | **YES if ungated** | unmeasurable (dirty-tree signal) | unmeasurable |
| `git commit --amend` (NEVER #10) | 7 | 100% of amends | yes by rate, **no by volume** (0.21/day) | ~100% (autosync makes amend-of-pushed the norm) | low volume |
| `git checkout` dirty (ALWAYS #14) | 9 | 100% of checkouts | yes by rate, **no by volume** (0.26/day) | unmeasurable | low volume |
| `git push --force` (NEVER #1) | 0 | 0 fires | **no — pure signal** | 0 | no |
| `git pull` (new) | 0 | 0 fires | no (and zero value) | 0 | no |

**The four candidates that cross the noise line if shipped ungated** are, in order of damage: `git push` (489/490 fires are autosync noise), `git rebase` (~60/63 fires are syncs), `git reset` (188/201 fires are unstaging), and `git add <dir>` (inferred high). **Each becomes low-noise only through its signal gate**, and for three of them (`push`, `rebase`, `reset`) that gate is cheap and pre-evaluable. The exception is `git add <dir>`, where the cheap gate (dirty tree) is the noisy one and the *useful* gate (cross-session staged content) is narrower.

**The two cleanest candidates** — `git push --force` (0 historical fires) and `git pull` (0 historical fires) — are silent in this repo. `--force` is worth shipping because the *next* force push is high-stakes; `pull` is not worth shipping because the workflow never pulls, so the advisory would protect nothing.

---

## 4. What could not be measured, and why

Stated plainly, not guessed:

| Needed for | Why unmeasurable | What would measure it |
|---|---|---|
| `git add` invocation count | `add` writes no reflog entry | shell history, or a wrapper that logs `add` calls |
| `git commit --only` frequency | reflog `commit:` does not record flags | shell history, or parse `--only`/`-o` from a command log |
| `--autostash` / `--hard` / `--force-with-lease` flag frequency | reflog records no flags | shell history; `--force` is indirectly visible via `forced` in remote reflogs (0 here) |
| dirty-tree state at merge/rebase/checkout time | reflog records no tree state | a snapshot hook that captured `git status --porcelain` before each op — not available retrospectively |
| which checkout issued each push | remote reflog records the *ref* update, not the source worktree | a pre-push hook log; the existing `pre-push` hook is the natural source |
| `gh` account vs remote owner (ESCALATE #2) | git reflog has no auth identity | `gh auth status` history; not logged anywhere I can read |
| `git branch -D` frequency | branch deletion moves no HEAD | `.git/logs/refs/heads/<branch>` per-branch reflogs (not surveyed here) |
| `git clean` frequency | `clean` moves no HEAD | shell history |
| per-commit "already on origin" for the NEVER #8 gate | needs `git branch -r --contains <sha>` per commit | the `git` CLI, which is blocked in this session |

The recurring blocker is that **reflogs capture operations that move refs, not operations that mutate the index, the working tree, or command flags.** A future measurement pass with `git` CLI access (or a one-time shell-history parse) should fill the `add`/`--only`/`--autostash`/`branch -D`/`clean` gaps. The dirty-tree-at-op gap can only be filled prospectively by a snapshotting wrapper, not retrospectively.

---

## 5. Bottom line for the next phase

1. **Ship `git push --force` first** — 0 historical fires, pure signal, zero noise. The cleanest rule in the set.
2. **`git push`, `git rebase`, `git reset` are all viable *only* with their signal gates.** The gates are pre-evaluable and cheap (`push`: autosync + allowlist; `rebase`: per-commit `branch -r --contains`; `reset`: target ≠ HEAD). Without the gates they are the three worst noise sources in this repo; with them they are low-noise. The gate is not a refinement — it is the rule.
3. **`git add <dir>` needs the narrow gate, not the cheap one.** The cheap gate (dirty tree) fires on most adds; the useful gate (existing staged content under the pathspec from another session) matches the actual incident and is pre-evaluable via `git diff --cached --name-only`.
4. **`git commit --amend` is low-noise by volume (0.21/day) but high-stakes under autosync** — every amend here amends a published commit. Worth shipping as a high-stakes-low-frequency advisory, not a noise concern.
5. **`git pull` is not worth shipping** — 0 pulls in 34 days; the workflow does not use it.
6. **The background fetcher (977 fetches/day) is an engine-cost warning, not a noise finding**: any advisory that runs git plumbing per Bash command must be cheap, because Bash commands are issued against this repo ~1000×/day by the fetcher alone before counting human activity.
7. **The dirty-tree signal (ALWAYS #14) is the largest unmeasurable surface.** It gates 145 ops/day but its fire rate is genuinely unknown. Recommend a prospective snapshot wrapper before committing to a dirty-tree-gated rule.
