# Iteration 13 — Attribution pass over the whole run's findings

**Mode:** research · **Target:** @deep-research · **Iteration:** 13 of 16
**Focus:** Resolve every finding whose recorded release was missing, `v4.0.0.x`, "pre-existing", "current HEAD" or otherwise not a single release tag.

---

## Focus

Eleven of the 52 finding rows logged in iterations 1–12 carried an unusable release
value: three had no release at all (iter-002), two said "pre-existing baseline" /
"current HEAD" (iter-003), two said `v4.0.0.x` (iter-008, iter-012), three said
"pre-v4.0.0.0 (survived the line)" (iter-009), and one said `n/a` (iter-010). A release
line that cannot name the tag that introduced a defect cannot be scheduled, so this
iteration converted each one to `<introducing commit> → <first release tag containing it>`
and proved the containment with `git merge-base --is-ancestor` rather than assuming it.

The pass surfaced three new findings, all in the doctor cluster, and one of them is a
live red canary at HEAD.

## Actions Taken

1. **Built the release-date ladder from peeled tag commits, not tag objects.** The tag
   object SHAs in the tag list resolve to different commits than the annotated tag
   objects do; `%(objectname)` returns the tag object, so the ladder was built with
   `git rev-parse <tag>^{commit}` plus `git log -1 --format=%cs`. Result:
   beta.1 f071100b65 2026-08-09 · v4.0.0.0 3fed08373e 2026-09-21 · .1 bcb775402e
   2026-09-25 · .2 7980001709 2026-09-28 · .3 c9bd4b156c 2026-10-06 · .4–.10
   4d8f403355 2026-10-14 (one commit, confirmed) · .11 e2b2e393fa 2026-10-17 · .12
   7fecd5f219 2026-10-17 · .13 42b41dd286 2026-10-23 · .14 bb9b9d1c09 2026-10-25 · .15
   22c3a9b2c7 2026-10-27 · .16 f459b06479 2026-10-28 · v4.0.1.0 6a93a2cfeb 2026-11-05 ·
   v4.0.2.0 51f70a0317 2026-11-08. These match the brief's commit list exactly, which
   independently validates the ladder.
2. **Attributed eleven findings** with path-limited `git log -S'<distinctive string>' --
   <cited file>`, using `--follow` only where the cited path had been moved.
3. **Proved containment** for all eleven with `git merge-base --is-ancestor <commit>
   <tag>`; all eleven returned YES.
4. **Measured the AGENTS.md size history** across every commit that ever touched the
   file to date the over-budget condition.
5. **Ran the AGENTS.md delivery-budget canary** the three "inside Devin's 16 KB" commits
   imply must exist — and found it failing.

## Attribution Table

| Finding | Introducing commit | Commit date | First tag containing it | Evidence |
|---|---|---|---|---|
| f-iter002-001 | `b18e2bb3ab` | 2026-10-04 | **v4.0.0.3** | `git log --diff-filter=A -- .skilled/commands/doctor/runtime-mirrors.md` |
| f-iter002-002 | `d93100d57b` | 2026-10-11 | **v4.0.0.4** | `git log -S'Six runtime trees ship the same twelve agents'` |
| f-iter002-003 | `dafa4def59` | 2026-11-06 | **v4.0.2.0** | `git log -S'n/a, not run, while .dsh/ is absent'` |
| f-iter003-001 | `5586f049d8` or earlier | 2026-02-24 | **pre-v4.0.0.0** | first commit in the size history already at 19,297 B |
| f-iter003-002 | `e2118b818c` | 2026-08-29 | **v4.0.0.0** | `git log -S'## 4. ✅ VERIFICATION & COMPLETION' -- AGENTS.md` |
| f-iter008-005 | `77fc42892d` | 2026-10-28 | **v4.0.0.16** | creation commit of `ci-toggle.cjs` |
| f-iter009-003 | `93d34bd9cc` | 2026-09-14 | **v4.0.0.0** | `git log -S'one of two rules here'` |
| f-iter009-004 | `65a337865a` | 2026-08-31 | **v4.0.0.0** | `git log --follow -S'contextType' -- .skilled/repo-rules/blast-radius.md` |
| f-iter009-005 | `5a86524248` | 2026-08-31 | **v4.0.0.0** | `git log -S'specific wins on conflict'` |
| f-iter010-010 | `330427cf30` | 2026-09-17 | **v4.0.0.0** | `git log --diff-filter=A -- .skilled/commands/doctor/scripts/tests` |
| f-iter012-005 | `330427cf30` | 2026-09-17 | **v4.0.0.0** | `git log -S'hook_adapter_fallback_health_checks'` |
| f-iter004-004 | — | — | **v4.0.0.0** (already compliant) | no change needed |

Two patterns fall out of the table. First, **the v4.0.0.4–.10 collapsed window absorbs
only one finding** (`d93100d57b`, 2026-10-11) — so the single-commit fan-out that made
this run's brief warn about tag diffs is nearly empty of defects, and the line's real
defect mass sits in the v4.0.0.0 consolidation (five of eleven) and in v4.0.2.0. Second,
**four findings share the 2026-08-31 / 2026-09-14 / 2026-09-17 window** — the rule-corpus
move, the `AGENTS.md`/router alignment and the doctor asset move — which is the
pre-v4.0.0.0 "make it portable" push, not the release train. Those four were
mis-attributed as "survived the line" precisely because they originated before the first
tag and nobody could see which tag adopted them.

## Findings

### F13-01 — The shipped AGENTS.md delivery-budget canary is red at v4.0.2.0 and HEAD

- **Type:** bug · **Severity:** P1 · **Release:** v4.0.2.0 · **Confidence:** 0.97
- **Source:** [SOURCE: .skilled/commands/doctor/assets/agents-md-manifest.json:13] declares the budget the canary enforces; [SOURCE: .skilled/commands/doctor/scripts/agents-md-manifest.cjs:377] compares the stored history hashes against the shipped bodies; [SOURCE: .skilled/commands/doctor/scripts/agents-md-manifest.cjs:586] sets the exit code from `main`.
- **Repro (ran):**
  ```
  node .skilled/commands/doctor/scripts/agents-md-manifest.cjs --check; echo "exit=$?"
  ```
  Output:
  ```
  [agents-md-manifest] FAIL: the manifest's derived key does not match AGENTS.md
  [agents-md-manifest]   history: the recorded body 865f058927ed is no longer released
  [agents-md-manifest] Run: node .skilled/commands/doctor/scripts/agents-md-manifest.cjs --write
  exit=1
  ```
  Note the exit status was captured *without* a pipe — an earlier `| head` in this same
  iteration reported `EXIT=0`, which was `head`'s status, not the engine's.
- **Cause:** `9d4edcbd3b` (2026-11-08, "docs(repo-rules): require the runtime's question
  tool for a structured choice") edited `AGENTS.md` to 27,587 bytes and did **not**
  regenerate the manifest's `derived.history`. `9d4edcbd3b` is an ancestor of
  v4.0.2.0 (verified), so the red canary *ships in* v4.0.2.0 — it is not a post-release
  working-tree artifact. HEAD is exactly one commit past the tag
  (`git rev-list --count v4.0.2.0..HEAD` = 1, a trigger-index rebuild), and the canary is
  still red there.
- **Why this matters more than the message suggests:** the fix the tool prints
  (`--write`) regenerates the *derived* copy from the current document. Running it makes
  the red light go green by recording the unreleased body as acceptable, which is the
  opposite of what a release-history check is for. The message names the remedy that
  erases the evidence.
- **Verify:** `node .skilled/commands/doctor/scripts/agents-md-manifest.cjs --check; echo $?`

### F13-02 — No workflow runs the AGENTS.md canary, so F13-01 ships unseen

- **Type:** improvement (CI gap) · **Severity:** P1 · **Release:** v4.0.1.0 · **Confidence:** 0.95
- **Source:** [SOURCE: .skilled/commands/doctor/scripts/agents-md-manifest.cjs:590] is the only other exit path, so a failing run is unambiguous; [SOURCE: .github/workflows/agent-mirror-sync.yml:57] shows the sibling checker *is* wired, which is the contrast.
- **Evidence:** `grep -rn 'agents-md-manifest\|agents-md-check' .github/workflows/` returns
  nothing, against 33 workflow files + a README in `.github/workflows/`. The engine was
  introduced at `e0fb2624dd` (2026-10-30, "feat(agents): add the AGENTS.md section
  manifest and the repository block"), which maps to **v4.0.1.0** (2026-11-05) — so the
  canary has shipped for two releases with no gate.
- **Contrast that makes the gap sharp:** `agent-mirror-sync.yml` runs
  `check-agent-mirror-sync.cjs` on every PR touching an agent path, and its own comment
  says "Fail closed in CI: a required guard must exist." The repository already holds the
  policy that a shipped checker belongs in CI; the AGENTS.md canary is the one checker
  that does not follow it.
- **Verify:** `grep -rln agents-md-manifest .github/workflows/ ; echo "exit=$?"` (expect no files).
- **What breaks if the engine were removed:** the `AGENTS.md` delivery budget becomes
  unmeasured; the 21 anchors and the 16,384-byte prefix ceiling would then rest on commit
  messages alone, which is precisely the state F13-03 describes.

### F13-03 — The 16 KB cut is a designed, documented constraint whose proof is broken — not an unmanaged accident

- **Type:** drift · **Severity:** P2 · **Release:** v4.0.0.0 (constraint), v4.0.2.0 (proof broken) · **Confidence:** 0.9
- **This corrects f-iter003-001's mechanism.** That finding framed the Devin 16,384-byte
  cut as "pre-existing" drift with no owner. There *is* an owner and a design:
  [SOURCE: .skilled/commands/doctor/assets/agents-md-manifest.json:14] states a
  `max_bytes` of 32,768 beside `prefix_bytes` 16384, and
  [SOURCE: .skilled/commands/doctor/scripts/agents-md-manifest.cjs:317] encodes the intent
  in prose — "The deepest delivery anchor decides how much of the document a truncating
  runtime" delivers. The manifest pins `kind: "delivery-anchor"` rows so that the binding
  rules are guaranteed to sit inside the first 16 KB even though the document is 27,587
  bytes.
- **So the drift is not "the file is too long".** It is that the mechanism built to make
  the length safe is (a) red (F13-01) and (b) unwired (F13-02), which means no release
  from v4.0.1.0 onward can currently assert that the anchors still fall inside the prefix.
  Two commits claim the property in their subjects — `14729099c9` (2026-10-04, "keep
  AGENTS.md hard blockers inside Devin's 16 K") and `9f433e6530` (2026-10-07, "trim Gate 3
  back inside Devin's 16 KB AGENTS.md prefix") — and a third, `0948abef32` (2026-10-25,
  "keep the blast-radius rule inside the AGENTS.md delivery prefix"), describes the same
  invariant. Three commits assert an invariant that one failing, unwired script is
  supposed to check.
- **The cut itself is where iter-003 measured it.** `awk` over the file places the
  16,384th byte at **line 180**, and the section headings at
  [SOURCE: AGENTS.md:117] (§4) and [SOURCE: AGENTS.md:173] (§3) confirm §3 begins before
  the cut and is truncated by it, while [SOURCE: AGENTS.md:279] (§9) and §10 sit far past
  it.
- **Verify:** `node .skilled/commands/doctor/scripts/agents-md-manifest.cjs --check; echo $?`

### F13-04 — f-iter002-001 needs narrowing: the mirror parity checker *is* in CI, in changed-file mode

- **Type:** drift (finding-vs-evidence) · **Severity:** P2 · **Release:** v4.0.0.3 · **Confidence:** 0.9
- **Source:** [SOURCE: .github/workflows/agent-mirror-sync.yml:57] sets
  `CHECKER=".opencode/bin/check-agent-mirror-sync.cjs"` for the PR job;
  [SOURCE: .skilled/bin/agent-mirror-crosswalk.md:16] is the crosswalk claim the checker
  is supposed to police.
- **Correction:** f-iter002-001 said `/doctor:runtime-mirrors` "never runs
  check-agent-mirror-sync.cjs --all, the crosswalk's only .skilled-to-.claude agent body
  and tool-surface parity checker". The doctor-route half is confirmed. The implied
  "nothing runs it" is **wrong**: `agent-mirror-sync.yml` runs it on every PR touching an
  agent path, keyed to `BASE_SHA`/`HEAD_SHA`. What CI does *not* do is run `--all`, so an
  agent body that drifted *before* the PR — e.g. in one of the many copy-not-symlink
  mirror hosts — stays invisible to both surfaces. The gap survives; its shape is
  "changed-file in CI, absent in doctor", not "absent everywhere".
- **Verify:** `grep -n 'CHECKER=\|BASE_SHA' .github/workflows/agent-mirror-sync.yml`

### Resolved attributions that changed no severity

- **f-iter003-002** — the §4-before-§3 ordering was introduced by `e2118b818c`
  (2026-08-29), whose subject is "docs(framework): make the agent framework portable and
  **reorder it by moment of use**". The order is therefore *deliberate*, and the defect is
  narrowly that the reorder never renumbered the headings. That makes the fix smaller than
  iter-003 implied: renumber, do not reorder. Maps to v4.0.0.0.
- **f-iter009-003 / f-iter009-005** — both are pre-v4.0.0.0 rule-corpus text
  ([SOURCE: REPO RULES.md:85] "Delivery is one of two rules here whose trigger is a whole
  turn"; [SOURCE: REPO RULES.md:16] "specific wins on conflict";
  [SOURCE: REPO RULES.md:26] ranks all rule files identically at level 3). Both first
  ship in **v4.0.0.0**, and both are still present at v4.0.2.0.
- **f-iter008-005** — resolves cleanly to **v4.0.0.16**: `ci-toggle.cjs` and the
  `noChange` computation appear in the same creation commit `77fc42892d` (2026-10-28),
  which is v4.0.0.16's date and an ancestor of the tag. The `v4.0.0.x` range collapses to
  a single tag.
- **f-iter002-003** — the stale `.dsh` "n/a, not run" comments at
  [SOURCE: .skilled/commands/doctor/_routes.yaml:237] and
  [SOURCE: .skilled/commands/doctor/_routes.yaml:239] were introduced by `dafa4def59`
  (2026-11-06, "feat(doctor): check the DSH runtime mirrors"), which is **v4.0.2.0**. This
  is the newest finding in the run and the only one attributable to v4.0.2.0 alongside
  F13-01.

## Questions Answered

- **Which findings were mis-attributed, and to what?** All eleven are now single-tag. Five
  belong to v4.0.0.0, one each to v4.0.0.3 / v4.0.0.4 / v4.0.0.16 / v4.0.2.0, and one to
  pre-v4.0.0.0 (f-iter003-001, 2026-02-24 or earlier).
- **The v4.0.0.4–.10 collapsed window:** confirmed as a single commit (4d8f403355,
  2026-10-14) and confirmed to hold only one of the eleven findings.

## Questions Remaining

- **Q3 / Q4 (hooks half)** — still the dominant open question. `pre-push` without a
  `Commit-Id`, `Commit-Id: 0000000` beside a valid id, and the 20-second
  `BLOCKED [gate:git-timeout]` bound all still need a scratch repo, which the read-only
  bound has excluded for eleven consecutive iterations. This is now the longest-standing
  block in the run and deserves an explicit ruling: either the run accepts a
  `/tmp`-scoped repro commit as in-bounds, or these three questions close as
  "unverifiable within the run's constraints" rather than carrying again.
- The v4.0.0.15/v4.0.0.16 worktree behaviours (`local-*` links, fsmonitor reaper,
  merged-worktree sweep, `SPECKIT_WORKTREE_AUTOREAP=0`, `SPECKIT_WORKTREE_BASE`).
- Whether Devin's rule cut truncates a binding rule *after* the delivery anchors are
  honoured — F13-03 narrows this: the anchors are the designed mitigation, so the
  question is now "are all 21 anchors inside 16,384 bytes", answerable read-only from
  `.skilled/commands/doctor/assets/agents-md-manifest.json`.
- Q11 (canon comparison for command and skill *format*) remains unmeasured.

## Next Focus

Iteration 14: answer the anchor question F13-03 raises — read the 21
`kind: "delivery-anchor"` pins and compute each one's byte offset, since that is the
read-only test of whether the 16 KB cut truncates a *binding* rule. Paired with it, run
the same red-canary sweep across the other doctor engines at HEAD
(`release-update.cjs`, `parent-skill-check.cjs`, `route-validate.sh`,
`agents-md-check.cjs`) to see whether F13-01 is one red light or the visible edge of a
cluster.
