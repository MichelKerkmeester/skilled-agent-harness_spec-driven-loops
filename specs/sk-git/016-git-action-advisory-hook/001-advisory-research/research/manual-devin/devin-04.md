# Devin-04: Prior Art for Pre-Execution Git Advisories — and Where They Are Ignored

**Pass:** 4 of 10 — `manual-devin/devin-04`
**Focus:** Survey prior art for pre-execution git advisories and, critically, where they FAIL. The central question is not *what* to warn about but *what warning frequency people tolerate before they stop reading*.
**Scope:** Findings only. No rule encoding, no hook code. Written only under `research/`.

---

## 0. Method, schema note, and what this pass is NOT

### 0.1 Schema departure — and why it is honest

The briefing's required-per-finding schema (Operation / Pre-execution state / Noise estimate / Source / Confidence) is shaped for *rule* findings (D1, D3, D5). This pass is survey-shaped: the unit is a *tool or warning surface*, not a candidate rule. Forcing the rule schema onto "what does IntelliJ warn about before force push" would fabricate a Pre-execution-state field that belongs to phase-002 design, not prior art.

I keep the schema's *spirit* and drop its *letter* where the letter would lie. Each prior-art finding below carries:

1. **Warns about** — what the surface flags.
2. **Moment** — when in the operation lifecycle it fires (preflight / blocking / post-failure / post-execution). This is the prior-art analog of "Pre-execution state": it tells us which prior art is even in the same lifecycle slot as our advisory.
3. **Evidence of being ignored or disabled** — documented complaints, design responses, or measured override rates. This is the noise-tolerance evidence the focus demands.
4. **Source** — a URL, issue, or doc I can name.
5. **Confidence** — confirmed (I read the primary source) / inferred (I reasoned) / unverified (secondary source I could not trace to primary).

A finding with no noise evidence is labelled as such. I do not invent numbers.

### 0.2 What "ignored" means here

A warning is *ignored* in three distinct ways, and prior art exhibits all three:

- **Suppressed** — the user (or tool vendor) turns it off via config, registry key, or env var. The message stops existing.
- **Skipped** — the user routes around the gate (`--no-verify`, force-delete, "don't warn me anymore on this branch"). The gate exists but is bypassed for this operation.
- **Habituated** — the user still sees it but no longer reads it; dwell time collapses and override becomes reflex. This is the alert-fatigue failure mode and it is the one our advisory is most exposed to, because an *advisory cannot be bypassed* (it never blocks) — the only escape is to stop reading it.

### 0.3 What this pass is NOT

- It is NOT a noise measurement against this repo. Devin-02 measured fire rates; I cite those numbers where they bear on a prior-art claim and say `not measured` otherwise.
- It is NOT a recommendation to encode any rule. Several findings imply design implications; I state them as implications, not decisions.
- It is NOT exhaustive prior art. I covered the surfaces the briefing named (git hooks, husky, lefthook, pre-commit.com, GitHub CLI, GitLens, IDE warnings) plus the alert-fatigue literature that the central question demands. I did not survey every Git GUI (GitKraken desktop, Fork, Tower, SourceTree) — that is a gap I flag in §6.

### 0.4 Confidence legend

- **confirmed** — I read the primary source (git docs, tool issue/PR, tool docs, paper abstract).
- **inferred** — I reasoned from the source's content or from git semantics.
- **unverified** — the claim appears in a secondary source (blog, HN) whose primary source I could not reach in this pass. I name the secondary source and what would confirm it.

---

## 1. The central question first: what frequency do people tolerate?

The focus states the value of this pass is the *frequency tolerance* question, not the what-to-warn question. I lead with it because every per-tool finding below is evidence for or against the same threshold.

### 1.1 The clinical alert-fatigue literature — the only field with measured numbers

Clinical decision support is the field that has actually measured warning-frequency tolerance, because the stakes (and the regulatory pressure) forced it. The numbers are not from git, but the cognitive mechanism — repeated exposure with no consequence for dismissal trains dismissal — is mechanism-identical to a developer's relationship to a preflight advisory. I cite them as the best available proxy and flag the transfer explicitly.

| Finding | Number | Source | Conf. |
|---|---|---|---|
| Dwell time collapses with frequency | Median dwell **15.6 s** (low alert count) → **10.8 s** (medium) → **10.2 s** (high). "Participants came to learn that spending time on alert information was unnecessary." | Russo et al., *Int J Med Inform*, experimental study, n=127, 60 tasks each. [sciencedirect.com/science/article/abs/pii/S1386505618311237](https://www.sciencedirect.com/science/article/abs/pii/S1386505618311237) | confirmed-from-abstract (I did not read the full paper) |
| Acceptance drops per repeated alert | Reminder acceptance **drops 30% for each additional reminder per encounter**; **10% drop per 5-point rise in proportion of repeated reminders**. Workload volume itself had no effect — *repetition* did. | Bryant et al., *BMC Med Inform Decis Mak* 2017, 112 clinicians, 3.5 yrs data. [link.springer.com/article/10.1186/s12911-017-0430-8](https://link.springer.com/article/10.1186/s12911-017-0430-8) | confirmed-from-abstract |
| Cumulative exposure dominates recency | Physicians in the **highest quartile of alerts seen in the prior 90 days** were far less likely to respond: **adjusted OR 0.38** (0.35–0.42) vs lowest quartile. 55,649 visits, 418 physicians. | Bell et al., UCLA, depression-screen alert adherence study. [qcb.ucla.edu/wp-content/uploads/sites/14/2022/11/Bell1.pdf](https://qcb.ucla.edu/wp-content/uploads/sites/14/2022/11/Bell1.pdf) | confirmed-from-abstract |
| Override-requiring alerts get *more* attention | Alerts requiring an **override response were 4.5× more likely to be correctly actioned** than alerts requiring cancellation. | Russo et al. (same study as row 1) | confirmed-from-abstract |
| No agreed operational definition of fatigue | Of 22 systematic reviews, **only one** reported an operational definition of alert fatigue. Most used override rate or acceptance rate as a proxy. | Wilson et al. 2026 systematic review. [metrohealth.org ...alert-fatigue-systematic-review.pdf](https://www.metrohealth.org/globalassets/metrohealth-documents/population-health-research-institute/ray-wilson-et-al-2026-alert-fatigue-systematic-review.pdf) | confirmed-from-abstract |

**What this transfers to our advisory (inferred, not measured):**

1. **Frequency, not severity, drives habituation.** The Bryant finding — workload volume had no effect, *repetition* did — is the single most load-bearing result for our design. A rare-but-severe advisory is read; a frequent-but-mild one is not. This inverts the naive intuition that "it's just a one-line warning, so frequency doesn't matter." Frequency is precisely what matters.
2. **Cumulative exposure is a 90-day phenomenon, not a per-session one.** Bell's OR 0.38 was driven by *prior-quarter* exposure, not the current encounter. A developer who has seen the same advisory 200 times this quarter will skim the 201st regardless of how carefully it is worded. This means a noise budget must be counted over weeks, not per command.
3. **An override-requiring alert is read 4.5× more often than a passive one.** This is the uncomfortable result for a purely advisory hook: the very property that makes us *advisory* (no override needed, no block) is the property the literature associates with the *lowest* attention. The briefing's constraint ("advisory, never blocking") is correct for blast-radius reasons, but this finding says an advisory is the *hardest* warning modality to keep read. It raises the bar on noise control, it does not lower it.
4. **There is no validated single threshold.** The literature measures *rates of decline*, not a cliff. The briefing's ~1-in-5 (20%) line is a reasonable engineering heuristic but it is not grounded in these studies; they would suggest the decline is continuous and begins earlier than 20%. **Inferred:** the real tolerance line for a *passive, non-overridable* advisory is likely lower than 20%, possibly closer to the 1-in-10 that Bryant's per-encounter decay implies. I did not measure this against git operations; Devin-02's reflog fire rates are the place to test it.

### 1.2 The git-specific fatigue evidence — three independent signals

The clinical literature is a proxy. Git has its own fatigue evidence, and it points the same direction.

**Signal A — git itself built three layers of warning suppression because users complained.** This is the strongest single piece of prior art in this pass, and it is in git core, not a third-party tool.

- `advice.<name>` — per-message kill switch. ~30+ individual advice hints (`addEmbeddedRepo`, `pushNonFFCurrent`, `pushFetchFirst`, `pushNeedsForce`, `skippedCherryPicks`, `statusAheadBehind`, `addEmptyPathspec`, …). Each exists because git's maintainers concluded a user might reasonably want it gone. [confirmed: `Documentation/config/advice.txt`](https://github.com/git/git/blob/e4921d877ab3487fbc0bde8b3e59b75d274783c/Documentation/config/advice.txt)
- `advice.all` — a single switch to disable *all* hints at once, added because "for server-side usages of Git where hints aren't necessary, it can be cumbersome to maintain configuration to disable all advice hints. This is especially the case if/when new advice hints are added." [confirmed: public-inbox patch series](https://public-inbox.org/git/20240503071706.78109-3-james@jamesliu.io/T/)
- `GIT_ADVICE=0` env var + `--no-advice` global option — added *for tools that run git as a subprocess* and "find them disruptive". The docs were intentionally kept undocumented "to discourage its use by interactive users" — i.e. the maintainers expect interactive users to want it off too, they just don't want to advertise the footgun. [confirmed: git commit fb2b981](https://github.com/git/git/commit/fb2b9815a4b5ea04a5f08940f546c6d5ef5e2414)

**Inferred implication:** git's own maintainers treat *every* advice hint as a potential noise source and ship a per-message opt-out by default. There is no git advice hint that the maintainers assert "this one is safe to force on everyone." Our advisory hook should treat each candidate rule the same way: assume it is noise until proven otherwise, and prefer a per-rule opt-out over a global one.

**Signal B — the `--no-verify` habitual bypass is fatigue made muscle memory.** Pre-commit/pre-push/commit-msg hooks are *blocking*, not advisory, yet they are routinely bypassed. The evidence quality varies; I separate verified from not.

- **confirmed:** Git's own hook documentation and the SO consensus state that `--no-verify` is a documented, intended escape hatch and that "the user owning the clone is presumed competent." [stackoverflow.com/questions/56940591](https://stackoverflow.com/questions/56940591)
- **confirmed:** pre-commit's maintainer (asottile) repeatedly states that verbose/warning output "will get ignored and it will annoy your users" and that his stance is "either it should fail outright, fix it, or do nothing." [github.com/pre-commit/pre-commit/issues/923](https://github.com/pre-commit/pre-commit/issues/923), [issues/2123](https://github.com/pre-commit/pre-commit/issues/2123), [pre-commit-hooks PR #264](https://github.com/pre-commit/pre-commit-hooks/pull/264)
- **unverified:** A blog (LinuxHaxor) cites a "2022 CodeQuest survey" claiming 63% of developers use hooks and 47% bypass at least monthly, and an "OSCON 2022 Git user study" claiming 22% disable hooks more than once weekly. I could not trace either survey to a primary source in this pass. **Treat these numbers as illustrative, not measured.** What would confirm: the original CodeQuest/OSCON papers, which I did not find. [linuxhaxor.net/.../purpose-of-no-verify-option...](https://linuxhaxor.net/code/purpose-of-no-verify-option-in-git-commit-and-how-to-use-it.html)
- **unverified (opinion):** A byteiota blog asserts "Everyone uses `git commit --no-verify`… that's either discipline theater or they haven't hit a Friday afternoon merge conflict yet" and frames habitual bypass as "muscle memory." This is rhetoric, not data, but it is rhetoric from inside the developer population, which is the population we care about. [byteiota.com/pre-commit-hooks-broken-by-design-or-broken-trust](https://byteiota.com/pre-commit-hooks-broken-by-design-or-broken-trust/)

**Inferred implication:** Even *blocking* hooks lose to fatigue. An *advisory* has strictly less forcing power than a block. If the failure mode for blocks is "users build muscle memory to bypass," the failure mode for advisories is "users build muscle memory to not read" — and the latter is invisible (no `--no-verify` audit trail to even detect it). This is the core risk of the advisory design and it is not hypothetical.

**Signal C — IDE force-push warnings are suppressed per-branch and via registry, by user demand.** See §5.1–5.2. The short version: both IntelliJ and VS Code shipped force-push confirmations and *both* subsequently shipped ways to turn them off, in response to users who found them noisy. A warning that the vendor later ships an off-switch for is a warning that crossed someone's tolerance line.

### 1.3 The threshold, stated as a working hypothesis

No source gives a git-specific frequency tolerance. Combining the clinical decay rates (Bryant: 30% acceptance loss per extra reminder per encounter) with git's own design response (per-message opt-outs shipped by default), the working hypothesis for this packet:

> **A passive, non-overridable advisory that fires on more than ~1 in 10 of its gated operations, measured over a rolling 30–90 day window, is likely already in the habituation zone.** The briefing's 1-in-5 line is a *hard* ceiling, not a target. The target should be materially below it — closer to 1-in-20 — for any rule that cannot be made rare by a tight signal condition.

This is **inferred**, not measured against this repo. Devin-02's reflog fire rates are the instrument to test it. I flag it as the single most important open question this pass leaves for the next phase.

---

## 2. git's own hooks — the canonical prior art

### 2.1 The hook set

| Hook | Moment | Blocks? | What it can inspect pre-execution |
|---|---|---|---|
| `pre-commit` | after staging, before commit is created | yes | staged tree (`git diff --cached`), index, refs |
| `commit-msg` | after message is composed, before commit is created | yes | the commit message file |
| `pre-push` | after local refs resolved, before network send | yes | refspecs, local+remote SHA pairs (on stdin) |
| `pre-rebase`, `post-rewrite`, `post-merge`, `prepare-commit-msg`, `pre-auto-gc`, `fsmonitor-watchman` | various | mixed | various |

[confirmed: git docs; the briefing already establishes the repo ships pre-commit, commit-msg, pre-push, post-merge, post-rewrite, autostash-orphan-guard]

### 2.2 What this is and is not, for our purposes

git hooks are **blocking, post-staging, pre-completion**. They are *not* preflight advisories in our sense: they fire after the operator has already committed to the operation (typed the command, hit enter), and they either let it through or kill it. They cannot say "heads up, you might want to reconsider" — they can only fail or pass.

**The design lesson (inferred):** git's own architecture splits the lifecycle into *two slots* and puts enforcement only in the *second* one. There is no git-native slot for "warn before the command is even typed/entered." Our advisory hook (a `PreToolUse` Bash matcher) occupies exactly that absent slot. This is why the gap exists and why no git-native prior art fills it: git's design assumes the operator is a human at a shell who reads the command they typed, so a preflight warning would be redundant with the command line itself. That assumption breaks for an AI agent issuing commands it does not "read" the way a human does — which is the actual motivation for this packet, and a fact no prior-art tool was designed against.

### 2.3 Where git hooks are ignored — the `advice.*` that hooks *emit*

Hooks themselves are bypassed via `--no-verify` (Signal B above). Separately, git's *non-hook* advice messages — the ones git prints on push rejection, checkout conflicts, embedded repos — are suppressed via `advice.*` (Signal A). The two are different surfaces with the same fatigue root cause. Our advisory is a *third* surface (pre-command, non-blocking) and inherits neither the `--no-verify` escape nor the `advice.*` opt-out unless we build one. **Inferred:** a per-rule opt-out is not optional for our design; it is the fatigue control that every comparable surface already has.

---

## 3. pre-commit.com — the explicit anti-warning philosophy

### 3.1 What it warns about

pre-commit.com is a *framework* for running hooks, not a fixed set of warnings. It runs user-configured tools (linters, formatters, secret scanners) at the `pre-commit` and `commit-msg` moments. It is **blocking** by design.

### 3.2 The maintainer's documented stance — the most explicit anti-noise position in the ecosystem

This is the clearest vendor statement on warning frequency I found in this pass, and it is on record repeatedly from the maintainer:

- "pre-commit itself takes the opinion that **warning noise is bad** and does not and will not provide a way to do this out of the box." [issue #923](https://github.com/pre-commit/pre-commit/issues/923)
- "it's generally discouraged to add warning noise (**it will get ignored and it will annoy your users**)." [issue #2123](https://github.com/pre-commit/pre-commit/issues/2123)
- "My general stance is to discourage warning noise — either it should fail outright, fix it, or do nothing. By adding unnecessary (and sometimes constant!) output **you'll train your users to ignore useful information**." [pre-commit-hooks PR #264](https://github.com/pre-commit/pre-commit-hooks/pull/264)
- The `verbose: true` option exists but is "intended as a debugging mechanism," and asottile "personally discourage[s] it as it leads to an increase in 'warning noise'." [issue #749](https://github.com/pre-commit/pre-commit/issues/749)
- The `pre-commit hazmat ignore-exit-code` escape (added 4.5.0) is explicitly labelled: "**it's a bad idea to introduce warning noise** but this gives you a way to do it." The name `hazmat` is itself a signal. [pre-commit.com advanced docs](https://github.com/pre-commit/pre-commit.com/blob/main/sections/advanced.md)

### 3.3 Evidence of being ignored

pre-commit's *own users* request the warning mode it refuses to ship (issues #923, #2123, #689, #2911, #854). The requests are the evidence: users want a non-blocking advisory mode, the maintainer refuses on the grounds that it will be ignored, and the compromise (`verbose: true` + `|| true`) is documented to produce output that is "easy to miss because flake8 is always marked as 'Passed', nothing is red, exit code is 0." [confirmed: issue #923 comment with screenshot]

**Inferred implication for our hook:** pre-commit's maintainer has run the experiment we are about to run, at ecosystem scale, and concluded that non-blocking warnings are net-negative *unless the tool also fails or fixes*. Our advisory cannot fail or fix (by constraint). The only remaining escape from his conclusion is *rarity*: fire so seldom that the habituation curve never steepens. This is a second independent argument for the <1-in-10 target in §1.3.

### 3.4 The `SKIP=` env var — pre-commit's own fatigue control

pre-commit ships `SKIP=hookid1,hookid2` to bypass *individual* hooks without `--no-verify`-ing the whole commit. [confirmed: pre-commit.com docs] This is pre-commit's equivalent of git's `advice.<name>` per-message opt-out: a fatigue control that is *narrower than the global one*, because the maintainers know the global one (`--no-verify`) is too blunt and itself induces fatigue-with-the-gate. **Inferred:** our advisory should mirror this — a per-rule suppress, not just a global off.

---

## 4. husky and lefthook — runners, not warners

### 4.1 husky

husky is a hook *runner/installer*. It does not warn about git operations; it wires user scripts into git's hook slots. [confirmed: untied.dev comparison, husky issues]

**Where it is "ignored":** the recurring husky complaint is not warning fatigue but *silent non-execution* — hooks silently not running because the executable bit was lost across platforms (issue #1301: "The '.husky/pre-commit' hook was ignored because it's not set as executable"), or because husky couldn't be found ("Can't find Husky, skipping $hookName hook", issue #435). [confirmed: husky issues #1301, #435]

**Inferred implication:** husky's failure mode is the *opposite* of ours — it fails *silent* (no warning where one was expected), where we risk failing *noisy* (warning where none was wanted). The lesson is symmetric: a warning surface that is silently absent is as useless as one that is habitually skipped. Our hook must be observable enough that an operator can tell it ran and what it said, without that observability itself becoming noise.

### 4.2 lefthook

lefthook is a parallel runner with `skip:` conditions (e.g. `skip: [merge, rebase]`) and `stage_fixed: true` auto-restaging. [confirmed: lefthook docs, discussion #1184]

**Where it is "ignored":** lefthook's documented fatigue risk is *silent skipping*. Discussion #1184 shows a hook silently skipped "by condition" with the skip message buried in a verbose git-diff log block — the operator couldn't easily tell the hook didn't run. A separate issue (vite-plus #1854) complains that a migration tool's "⚠ Detected lefthook — skipping git hooks setup" warning was "very easy to miss," resulting in a "silent-ish no-op" where the user believed something happened that didn't. [confirmed: lefthook discussion #1184, vite-plus issue #1854]

**Inferred implication:** lefthook's failure mode is *misplaced* warnings — a warning that fires inside a noisy log block, or that fires once and is missed, teaches the operator that warnings from this source are not reliably informative. This is the "cry wolf" failure in reverse: not too many warnings, but warnings placed where attention isn't. For our hook, placement of the advisory line matters as much as frequency: it must appear where the operator is already reading, not in a stream they've learned to scroll past.

---

## 5. IDE and GUI warnings — the confirmation-dialog surface

This is the closest prior-art slot to "preflight advisory," because IDEs warn *before* the operation completes, at the moment the user clicks the button. The catch: they warn with **modal confirmation dialogs**, which are blocking, not advisory. They are the existence proof that the preflight slot is valuable *and* the evidence that operators suppress them.

### 5.1 IntelliJ / IDEA

**Warns about:** force push (modal confirmation, with per-branch "don't warn me anymore on this branch"); push to protected branches; delete branch; the "Push Rejected" dialog on non-fast-forward. [confirmed: JetBrains docs `commit-and-push-changes.html`, `settings-version-control-confirmation.html`]

**Moment:** pre-execution (modal, blocking until user clicks).

**Evidence of being ignored / suppressed — three layers:**

1. **Per-branch suppression built in.** The dialog ships a "don't warn me anymore on this branch" checkbox. A vendor who ships a per-target suppress is a vendor who has seen users suppress per-target. [confirmed: SO answer to "Disable force push warning in Intellij"](https://stackoverflow.com/questions/70440348/disable-force-push-warning-in-intellij)
2. **User demand for a global suppress.** The SO question itself: "I branch and force push a lot. Every time I force push on a new branch, I have to confirm this… Is there a way to allow force push by default on all branches?" The user's framing — "git itself doesn't ask me to confirm this, why should my IDE?" — is the fatigue complaint in plain language. [confirmed: SO question]
3. **Vendor responded with a registry-level off-switch.** JetBrains issue IDEA-288455 "Add registry option for ignoring force push warning" was implemented (PR #2626), then superseded by a dedicated setting (IJPL-73008). The trajectory is: modal warning → per-branch suppress → registry suppress → first-class setting. Each step is a response to "this warning is too frequent for my workflow." [confirmed: intellij-community PR #2626]

**The "Auto-update if push of the current branch was rejected" setting** is the same pattern for the *post-failure* path: IntelliJ will silently merge/rebase on push rejection if the box is checked, and "if you have never seen the Push Rejected dialog before and you are enabling the checkbox initially, IntelliJ IDEA will update the conflicting local branch silently." A vendor shipping a "silently do the thing the dialog was supposed to ask about" option is a vendor who concluded the dialog was noise for enough users. [confirmed: JetBrains git settings docs]

### 5.2 VS Code

**Warns about:** force push — gated behind `git.allowForcePush` (default false), uses `--force-with-lease` by default, with a confirmation dialog "which can be configured to never show if the user wants." [confirmed: VS Code PR #53286, #60387]

**Moment:** pre-execution (modal, blocking).

**Evidence of being ignored / suppressed:**

1. **The feature is off by default and hidden.** Force push was deliberately placed in the command palette only, not the SCM menu, "as it was considered a 'dangerous' or 'advanced' operation." Menu entries were added later (PR #60387) but remain behind the setting toggle. [confirmed: PR #53286, #60387]
2. **Maintainers explicitly worried about the suppress-and-forget failure.** Issue #196587: "Having just a setting for this is dangerous since **users might then toggle the setting off and forget to toggle it back on**, risking other future calls of Force Push." This is the *exact* fatigue-then-desensitization failure mode, named by the VS Code maintainers themselves. They proposed per-push override buttons instead of a global setting. [confirmed: vscode issue #196587]
3. **The 2023 default change (issue #190356) confused users who *were* force-pushing.** Issue #196587 documents that after VS Code tightened force-push defaults, users who had been force-pushing got a confusing error and "two thoughts" including that the error phrasing was wrong for the force case. Tightening a warning that users had habituated past produced *confusion*, not gratitude — the habituation had already happened. [confirmed: issue #196587]

**Inferred implication (IntelliJ + VS Code together):** Both major IDEs converged on the same design: modal confirmation → per-target suppress → global/registry suppress, with maintainers in both camps explicitly naming the suppress-and-forget risk. The convergence is strong evidence that *preflight confirmation for destructive git ops is a known fatigue problem with no clean solution in the blocking modality*. Our advisory is non-blocking, which avoids the suppress-and-forget trap (there's nothing to suppress) but inherits the habituation trap (there's nothing to force attention either). The IDE evidence says: **rarity is the only lever that worked**, and even it only worked until workflow frequency rose (the IntelliJ force-push-a-lot user).

### 5.3 GitLens (VS Code extension)

**Warns about / confirms:** delete branch & remote (issue #1828 — and the maintainers agreed the *unforced* delete was no safer than forced, a real safety gap); delete branch that has a worktree (PR #3509, #3508 — and reviewers noted the messaging was confusing: "no indication that 'this is a branch with a worktree'"); undo commit when working tree is dirty (modal: "You have uncommitted changes… Do you still want to undo?"); open changes for many files above a threshold (`confirmOpenIfNeeded` with `filesOpenDiffsThreshold`). [confirmed: GitLens issues #1828, PRs #3509/#3508, source `commit.ts`]

**Moment:** pre-execution (modal).

**Evidence of being ignored / suppressed:** GitLens's documented problem is not suppression but *misleading confirmation* — the dialog that pops up doesn't match the user's mental model of what they clicked. Reviewer quote on PR #3509: "if I was a user who is unaware of what is going on, there is no information on what's going on, so it would feel like I clicked the wrong command." [confirmed: PR #3509 review comment]

**Inferred implication:** A preflight warning that the operator cannot map to their intent is read as *noise even when it is rare*. GitLens's failure is not frequency but *legibility*: the warning fires at the right moment about the right thing and still confuses, because the framing ("Delete Worktree") didn't match the action the user initiated ("Delete Branch"). For our advisory, this raises a requirement the briefing's per-finding schema already implies: the message must name the *operation the operator is about to run*, not the *state the hook detected*, or it will read as a non-sequitur and be dismissed.

---

## 6. GitHub CLI — server-side blocking, no preflight

### 6.1 What `gh` warns about

`gh` itself issues few local warnings. The warnings that matter in the GitHub ecosystem are **server-side and blocking**, not client-side and advisory:

- **Push protection (secret scanning)** — blocks the push from the command line when a supported secret is detected, prints the detected secrets (up to 5), and requires either removing the secret or bypassing via a URL within 3 hours. This is *blocking*, at push time, server-enforced. [confirmed: GitHub docs `command-line-push-protection`, `push-protection`]
- **Branch protection** — `gh` does *not* preflight branch-protection status before a push. Issue #4178 requests exactly this ("It would be great to find out if that's the case before pushing"); maintainers responded that the protection-rule space is large and they've "intentionally omitted branch protection rules from `gh repo list -json`." The preflight slot is *unfilled* by `gh` by design. [confirmed: cli/cli issue #4178]
- **Auth/permission errors** — surface as push rejection (`Remote: permission to {REPO} denied to {user}`), i.e. post-failure, not preflight. The `gh pr checkout` upstream-setup behavior is documented as "not apparent to our users, since the pr checkout command doesn't tell you that it set it up." [confirmed: cli/cli issue #2189]

### 6.2 Where it is "ignored"

`gh`'s warnings are mostly *not ignored* because they are *blocking* — you cannot ignore a push that didn't happen. The fatigue surface is different: the **bypass URL** for push protection is time-boxed (3 hours) and the bypass generates an audit alert. This is the "override-requiring alert" pattern from Russo et al. (§1.1, 4.5× more likely to be correctly actioned) — and indeed push protection bypasses are *logged and alertable*, which is the audit-trail mitigation the byteiota blog demanded for `--no-verify`.

### 6.3 The unfilled preflight slot — directly relevant to us

Issue #4178 is the clearest statement in the prior art that *the preflight advisory slot for git operations is unfilled by the major tools, by design*. `gh` could preflight branch protection; it doesn't, because the rule space is too large to summarize cheaply. Our advisory hook is attempting exactly the kind of preflight `gh` declined to ship. **Inferred implication:** the reason `gh` declined (rule-space size, provider-dependence) does not bind us — our rules are repo-local and sk-git-owned, not GitHub-API-dependent. But the *noise* concern that accompanies a large rule space does bind us: `gh`'s maintainers implicitly judged that a partial preflight would be worse than none. We must not reproduce that partial-preflight-as-noise failure.

---

## 7. Cross-cutting findings — what the prior art converges on

### 7.1 The three-way convergence on fatigue controls

Every surface that warns about git operations ships a fatigue control, and they converge on the same three tiers:

| Tier | git advice | pre-commit | IntelliJ | VS Code | GitHub push-protection |
|---|---|---|---|---|---|
| Per-message / per-rule opt-out | `advice.<name>` | `SKIP=hookid` | per-branch "don't warn" | (per-push override proposed) | per-secret bypass |
| Grouped opt-out | `advice.all` | `--no-verify` | registry setting | `git.allowForcePush` | — |
| Global kill | `GIT_ADVICE=0` / `--no-advice` | `--no-verify` | (registry) | (setting off) | — |

[confirmed across cited sources; inferred synthesis]

**Implication:** our advisory hook should plan for all three tiers from day one. A per-rule suppress is the *minimum* viable fatigue control; a grouped suppress (by severity or by operation class) is the practical one; a global kill is the safety valve. Shipping only a global on/off reproduces the VS Code "toggle and forget" failure (issue #196587).

### 7.2 The two failure modes that are NOT frequency

Frequency is the focus, but prior art shows two non-frequency failure modes that our advisory is equally exposed to:

1. **Legibility failure (GitLens, §5.3).** A rare, correct warning that doesn't map to the operator's intent is dismissed as a non-sequitur. Mitigation is message framing, not frequency.
2. **Placement failure (lefthook, §4.2).** A warning that fires inside a noisy stream, or once-and-missed, teaches the operator that this source is unreliable. Mitigation is where the line appears, not how often.

Both reduce to the same design requirement: **the advisory line must appear where the operator is already reading, and must name the operation they just invoked.** This is independent of, and prior to, the frequency budget.

### 7.3 The override-requiring-vs-passive asymmetry (the uncomfortable result)

Russo et al.'s 4.5× result (§1.1) and the IDE convergence on *modal* confirmations (§5) both say the same thing: warnings that *require a response* are read more than warnings that *don't*. Our advisory is by constraint non-blocking and non-overridable — it is the *passive* modality, which the literature and the IDE evidence both associate with the *lowest* attention.

This is not an argument to violate the constraint (the blast-radius reasoning for advisory-only is sound). It is an argument that **the advisory modality has the least margin for noise of any warning modality in the prior art**, and therefore the frequency budget must be the tightest, not the loosest. The briefing's "an advisory that fires constantly is worse than none" is not rhetoric; it is the documented failure mode of exactly this modality.

### 7.4 The one positive finding — rare + specific is read

Across the prior art, the warnings that *survive* fatigue are the ones that are both rare and tightly coupled to a specific, nameable danger: GitHub push protection (fires only on detected secrets, blocks), git's `addEmbeddedRepo` advice (fires only on a specific misconfiguration), IntelliJ's protected-branch force-push (fires only on a named branch set). The warnings that *lose* are the ones that fire on a broad condition: VS Code's force-push default change (fired on every force-push, users had habituated), IntelliJ's per-branch force-push (fired on every force-push to a new branch, the "I branch and force push a lot" user), pre-commit's `verbose` output (fired on every commit, "easy to miss").

**Implication for rule selection (inferred, for phase-002/003):** a candidate rule's noise profile is dominated by the *specificity of its signal condition*, not by the dangerousness of the operation it gates. A rule that fires on "force push" (broad) will lose; a rule that fires on "force push to a ref that is not the current branch's upstream" (specific) may survive. The encodability work in Devin-03 already separated MECHANICAL from PARTIAL on similar grounds; the noise dimension here says the *PARTIAL rules with a tight mechanical core* are the ones worth encoding, and the *MECHANICAL rules with a broad trigger* are the ones most likely to become noise.

---

## 8. Gaps this pass leaves

1. **No git-GUI survey beyond GitLens.** GitKraken desktop, Fork, Tower, SourceTree, gitg, GitUp all have their own confirmation dialogs and suppress mechanisms. I did not survey them. They are likely to repeat the IntelliJ/VS Code pattern but I cannot confirm. What would close this: a per-GUI pass equivalent to §5.
2. **No measured git-specific frequency tolerance.** §1.3's <1-in-10 hypothesis is inferred from clinical literature + git's design responses, not measured against developer behavior. Devin-02's reflog fire rates can test it for *this* repo; a cross-repo study would be needed to generalize.
3. **The "2022 CodeQuest / OSCON" survey numbers (§1.2 Signal B) are unverified.** I could not trace them to a primary source. They should not be cited as fact outside this packet without that trace.
4. **No survey of *team*-level fatigue dynamics.** All prior art here is individual-operator. A team where one member's noisy advisory becomes another member's ignored advisory (because the team shares a hook config) is a different failure mode I did not find evidence on.
5. **The clinical literature is a proxy.** The cognitive mechanism transfers, but the *stakes* (patient harm vs. a bad commit) and the *population* (physicians vs. developers) differ. The decay *shape* is likely transferable; the absolute threshold is not. I flag this rather than silently treating 30%-per-reminder as a git number.

---

## 9. One-line summary for the next phase

The prior art does not answer "what to warn about" — it answers, with unusual convergence, that **a non-blocking preflight warning is the hardest warning modality to keep read, that every comparable surface ships tiered fatigue controls because without them the warnings are suppressed or habituated past, and that the only lever that reliably works is rarity achieved through a tight, specific signal condition — not severity, not wording, and not the dangerousness of the operation being gated.** The frequency budget for our advisory should be set materially below the briefing's 1-in-5 ceiling, and every candidate rule should be evaluated on signal-condition specificity before it is evaluated on encodability.
