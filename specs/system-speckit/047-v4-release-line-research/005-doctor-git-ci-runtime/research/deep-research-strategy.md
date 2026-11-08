---
title: Deep Research Strategy Template
description: Runtime template copied to research/ during initialization to track research progress, focus decisions, and outcomes across iterations.
trigger_phrases:
  - "deep research strategy"
  - "research strategy template"
  - "research session tracking"
  - "exhausted research approaches"
  - "research stop conditions"
  - "ruled out research directions"
importance_tier: normal
contextType: planning
version: 1.14.0.19
---

# Deep Research Strategy - Session Tracking Template

Runtime template copied to `{spec_folder}/research/` during initialization. Tracks research progress across iterations.

## 1. OVERVIEW

### Purpose

Serves as the "persistent brain" for a deep research session. Records what to investigate, what worked, what failed, and where to focus next. Read by the orchestrator and agents at every iteration.

### Usage

- **Init:** Orchestrator copies this template to `{spec_folder}/research/deep-research-strategy.md` and populates Topic, Key Questions, Known Context, and Research Boundaries from config and memory context.
- **Per iteration:** Agent reads Next Focus, writes iteration evidence, and the reducer refreshes What Worked/Failed, answered questions, carried-forward questions, ruled-out directions, and Next Focus.
- **Mutability:** Mutable — analyst-owned sections remain stable, while machine-owned sections are rewritten by the reducer after each iteration. Section 3 is a generated projection from the reducer registry.
- **Protection:** Shared state with explicit ownership boundaries. Orchestrator validates consistency on resume.

### Question Injection Surface

Use `{spec_folder}/research/inbox.jsonl` to append external questions during an active run. Each line is one JSON object with:

- `id`: stable inbox record identifier
- `text`: question text to promote
- `source`: concrete source label, such as an angle bank entry, analyst strategy, or operator note
- `origin`: one of `angle-bank`, `analyst-strategy`, `operator`, or `legacy-import`
- `injectedAtIteration`: iteration number when the question was introduced
- `promotedQuestionId`: promoted registry question id, or `null` until promotion

The reducer reads the inbox on every reduce step and carries `origin` into the question registry and dashboard badges. Direct edits to Section 3 still work as a compatibility path, but they are attributed as `legacy-import`.

Question ownership is explicit:

- Inbox rows are immutable input.
- The reducer registry is canonical question state.
- Section 3 is rendered only from the registry view.

When an inbox row targets an existing registry question but carries different text, the reducer keeps the registry value, records `operatorDecision: needs_decision`, and appends a `question_conflict` event with both `inboxValue` and `registryValue`.

---

## 2. TOPIC
Audit the Skilled v4 doctor, git, CI and runtime layer across releases v4.0.0.0 to v4.0.2.0: .skilled/skills/system-skilled-doctor/** and .skilled/commands/doctor/, Skilled in your project and vendored overlays, .skilled/skills/sk-git/** and its git hooks, .github/workflows, .skilled/agents and the runtime mirrors in .claude/ .opencode/ .codex/ .cursor/ .pi/ .devin/ .dsh/, .skilled/repo-rules/** and AGENTS.md. Releases: notes in .skilled/changelog/skilled/v4.0.*.md. Tags: v4.0.0.0-beta.1 (baseline), v4.0.0.0 3fed08373e, v4.0.0.1 bcb775402e, v4.0.0.2 7980001709, v4.0.0.3 c9bd4b156c, v4.0.0.4 to v4.0.0.10 all 4d8f403355 (one commit: use each note plus git log --since/--until by date, not tag diffs), v4.0.0.11 e2b2e393fa, v4.0.0.12 7fecd5f219, v4.0.0.13 42b41dd286, v4.0.0.14 bb9b9d1c09, v4.0.0.15 22c3a9b2c7, v4.0.0.16 f459b06479, v4.0.1.0 6a93a2cfeb, v4.0.2.0 51f70a0317. Always path-limit git diff: git diff <prev>..<tag> -- <cluster path>; the unlimited diff times out. Finding types: 1 drift (note vs code vs docs disagree), 2 misalignment with sk-code, sk-doc or Skilled canon, 3 bug, 4 improvement, 5 UX for the operator and the AI user, 6 over-engineering (say what breaks if removed, or that nothing does), 7 extension (a concrete way to extend the logic). Evidence bar for every finding: type, severity P0/P1/P2, [SOURCE: path:line] for a line you read this iteration, the release that introduced it, confidence, and a verify command. A bug needs a repro command or a failing check you ran. Read code, not only release notes. Read-only research: never edit, stage or commit repository files, and run commands only in read-only, check, plan or dry-run modes.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [x] Does each /doctor:* command in .skilled/commands/doctor/ route to a system-skilled-doctor mode or script that exists, and do the checks it lists actually run?
- [x] Does the Skilled in Your Project and vendored overlay flow from v4.0.2.0 (/doctor:install, /doctor:symlink, /doctor:overlay) hold up when read end to end and run only in check or plan modes, and which step would fail?
- [x] Do the runtime mirrors in .claude .opencode .codex .cursor .pi .devin .dsh match their .skilled sources, and does /doctor:runtime-mirrors detect the drift that exists?
- [ ] Do the sk-git hooks behave as the v4.0.0.3 (commit message rules, hook safety), v4.0.0.10 (commit-id) and v4.0.0.15/v4.0.0.16 (worktrees) notes say, with a repro for any wrong accept or reject?
- [x] Do the workflows in .github/workflows match the v4.0.0.16 CI and GitHub Actions note and /doctor:ci switch state, and does any workflow call a missing script?
- [x] Does AGENTS.md match REPO RULES.md and the .skilled/repo-rules files it routes, and does any runtime limit (such as Devin's 16,384-byte rule cut) truncate a binding rule?
- [x] Do the .skilled/agents definitions match AGENTS.md section 9 and the agent counts the cli-* skills claim?
- [x] Which claims in the v4.0.0.3 Doctor Commands, v4.0.0.8 Install and First Use and Symlink Safety, and v4.0.1.0 Doctor Commands sections are true in code?
- [x] Which doctor checks, hooks, workflows or mirror files have no caller or duplicate another, and what breaks if each is removed?
- [x] What friction do the operator and the AI user hit in doctor output, hook rejections and CI failures?
- [x] Where do these surfaces depart from sk-code, sk-doc and Skilled canon for command format, skill format and hub routing?
- [x] What concrete extensions to doctor checks, hooks, CI and mirror sync would close a gap found in this run?

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS
- Fixing, editing, staging or committing anything outside this run directory.
- Surfaces owned by sibling phases of the parent packet, except where they meet this cluster.
- Releases before v4.0.0.0 or after v4.0.2.0, except as context.

---

## 5. STOP CONDITIONS
- stopPolicy is max-iterations: convergence is telemetry only and the loop runs to maxIterations.
- Three consecutive executor failures halt the loop for an executor switch, logged in decision-record.md.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- Does each /doctor:* command in .skilled/commands/doctor/ route to a system-skilled-doctor mode or script that exists, and do the checks it lists actually run?
- Does the Skilled in Your Project and vendored overlay flow from v4.0.2.0 (/doctor:install, /doctor:symlink, /doctor:overlay) hold up when read end to end and run only in check or plan modes, and which step would fail?
- Do the runtime mirrors in .claude .opencode .codex .cursor .pi .devin .dsh match their .skilled sources, and does /doctor:runtime-mirrors detect the drift that exists?
- Do the workflows in .github/workflows match the v4.0.0.16 CI and GitHub Actions note and /doctor:ci switch state, and does any workflow call a missing script?
- Does AGENTS.md match REPO RULES.md and the .skilled/repo-rules files it routes, and does any runtime limit (such as Devin's 16,384-byte rule cut) truncate a binding rule?
- Do the .skilled/agents definitions match AGENTS.md section 9 and the agent counts the cli-* skills claim?
- Which claims in the v4.0.0.3 Doctor Commands, v4.0.0.8 Install and First Use and Symlink Safety, and v4.0.1.0 Doctor Commands sections are true in code?
- Which doctor checks, hooks, workflows or mirror files have no caller or duplicate another, and what breaks if each is removed?
- What friction do the operator and the AI user hit in doctor output, hook rejections and CI failures?
- Where do these surfaces depart from sk-code, sk-doc and Skilled canon for command format, skill format and hub routing?
- What concrete extensions to doctor checks, hooks, CI and mirror sync would close a gap found in this run?

<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
[None yet]

<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
[None yet]

<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### **33 vs 32 workflows is drift.** The note describes the pre-release count and the same release merged two workflows into one; no post-tag deletion. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **33 vs 32 workflows is drift.** The note describes the pre-release count and the same release merged two workflows into one; no post-tag deletion.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **33 vs 32 workflows is drift.** The note describes the pre-release count and the same release merged two workflows into one; no post-tag deletion.

### **Root `repo-rules/` duplicate is over-engineering.** Removal would break the "read either layout" compatibility introduced by `7a948d79b4` (2026-09-20). It is byte-identical today, so it is a maintenance watch item, not a defect. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **Root `repo-rules/` duplicate is over-engineering.** Removal would break the "read either layout" compatibility introduced by `7a948d79b4` (2026-09-20). It is byte-identical today, so it is a maintenance watch item, not a defect.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Root `repo-rules/` duplicate is over-engineering.** Removal would break the "read either layout" compatibility introduced by `7a948d79b4` (2026-09-20). It is byte-identical today, so it is a maintenance watch item, not a defect.

### **Workflow calls a missing script.** False positive from a root-relative scan; all four paths resolve after their `cd`/`working-directory`. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **Workflow calls a missing script.** False positive from a root-relative scan; all four paths resolve after their `cd`/`working-directory`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Workflow calls a missing script.** False positive from a root-relative scan; all four paths resolve after their `cd`/`working-directory`.

### **Zero-plus-valid Commit-Id is a bug.** The policy's intent is that a real id satisfies the gate; the placeholder is a sentinel for "no id", not a contradiction. Accepting the pair is consistent with that intent. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **Zero-plus-valid Commit-Id is a bug.** The policy's intent is that a real id satisfies the gate; the placeholder is a sentinel for "no id", not a contradiction. Accepting the pair is consistent with that intent.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Zero-plus-valid Commit-Id is a bug.** The policy's intent is that a real id satisfies the gate; the placeholder is a sentinel for "no id", not a contradiction. Accepting the pair is consistent with that intent.

<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- **33 vs 32 workflows is drift.** The note describes the pre-release count and the same release merged two workflows into one; no post-tag deletion. (iteration 3)
- **Root `repo-rules/` duplicate is over-engineering.** Removal would break the "read either layout" compatibility introduced by `7a948d79b4` (2026-09-20). It is byte-identical today, so it is a maintenance watch item, not a defect. (iteration 3)
- **Workflow calls a missing script.** False positive from a root-relative scan; all four paths resolve after their `cd`/`working-directory`. (iteration 3)
- **Zero-plus-valid Commit-Id is a bug.** The policy's intent is that a real id satisfies the gate; the placeholder is a sentinel for "no id", not a contradiction. Accepting the pair is consistent with that intent. (iteration 3)

<!-- /ANCHOR:ruled-out-directions -->

---

<!-- ANCHOR:divergence-frontier -->
## 10A. SATURATED DIRECTIONS AND DIVERGENCE FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

<!-- /ANCHOR:divergence-frontier -->

---

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS
- Does the `hook_adapter_fallback_health_checks` battery in `doctor-runtime-mirrors.yaml` resolve every listed path, and does the full workflow report a degraded adapter when one is missing? The workflow YAML says it does; this iteration ran the checker scripts, not the full workflow. (iteration 2)
- Do the v4.0.0.15/v4.0.0.16 worktree behaviors (private `local-*` command links, fsmonitor reaper, merged-worktree sweep, `SPECKIT_WORKTREE_AUTOREAP=0`, `SPECKIT_WORKTREE_BASE`) match their notes? This is the open half of Q4. (iteration 2)
- Does `AGENTS.md` match `REPO RULES.md` and the `.skilled/repo-rules` files it routes, and does Devin's 16,384-byte rule cut truncate a binding rule? (Q6, next iteration.) (iteration 2)
- Do the `.github/workflows` match the v4.0.0.16 CI note and `/doctor:ci` switch state, and does any workflow call a missing script? (Q5, next iteration.) (iteration 2)
- Does a message carrying both `Commit-Id: 0000000` and a valid id get refused? `cip_message_has_id` returns true when any line is non-zero, so the zero line is ignored when a valid line is also present. The stamper strips duplicate trailers, so this needs a deliberate hand-written message to trigger. (iteration 2)
- Does `pre-push` refuse a pushed non-merge commit without a Commit-Id, and does a wedged git call block with `BLOCKED [gate:git-timeout]` after 20 seconds? The code path is present in `pre-push` and the bounded-git helper; no live timeout was induced. (iteration 2)
- Does `pre-push` refuse a pushed non-merge commit without a Commit-Id, and does a wedged git call block with `BLOCKED [gate:git-timeout]` after 20 seconds? Code path present; no live timeout induced. (iteration 3)
- Do the v4.0.0.15/v4.0.0.16 worktree behaviors (private `local-*` links, fsmonitor reaper, merged-worktree sweep, `SPECKIT_WORKTREE_AUTOREAP=0`, `SPECKIT_WORKTREE_BASE`) match their notes? (Q4, still open.) (iteration 3)
- Which of the 32 workflows would fail if `/doctor:ci` flipped its group switch, and does any workflow read a group variable its README row does not name? (iteration 3)
- Does the `hook_adapter_fallback_health_checks` battery resolve every listed path, and does the full workflow report a degraded adapter when one is missing? (iteration 3)
- What concrete extensions to doctor checks, hooks, CI and mirror sync would close a gap found in this run? (iteration 4)
- What friction do the operator and the AI user hit in doctor output, hook rejections and CI failures? (iteration 4)
- Carried forward: do the v4.0.0.15/v4.0.0.16 worktree behaviors (`local-*` links, fsmonitor reaper, merged-worktree sweep, `SPECKIT_WORKTREE_AUTOREAP=0`, `SPECKIT_WORKTREE_BASE`) match their notes? (iteration 4)
- Carried forward: does `AGENTS.md` match `REPO RULES.md` and the `.skilled/repo-rules` files it routes, and does Devin's 16,384-byte rule cut truncate a binding rule? (iteration 4)
- Do the `sk-git` hooks behave as the v4.0.0.3, v4.0.0.10 and v4.0.0.15/v4.0.0.16 notes say, with a repro for any wrong accept or reject? (iteration 4)
- Where do these surfaces depart from sk-code, sk-doc and Skilled canon for command format, skill format and hub routing? (iteration 4)
- Does the Skilled in Your Project and vendored overlay flow from v4.0.2.0 (`/doctor:install`, `/doctor:symlink`, `/doctor:overlay`) hold up read end to end in check or plan mode, and which step would fail? (iteration 4)
- Carried forward: does `pre-push` refuse a pushed non-merge commit without a Commit-Id, and does a wedged git call block with `BLOCKED [gate:git-timeout]` after 20 seconds? (iteration 4)
- Which doctor checks, hooks, workflows or mirror files have no caller or duplicate another, and what breaks if each is removed? (iteration 4)
- Carried forward: does the `hook_adapter_fallback_health_checks` battery resolve every listed path, and does the full workflow report a degraded adapter when one is missing? (iteration 4)
- Carried forward: does a message carrying both `Commit-Id: 0000000` and a valid id get refused? (iteration 4)
- Do `.github/workflows` match the v4.0.0.16 CI note, and would any fail when `/doctor:ci` flips a group switch? (still open) (iteration 6)
- Does a message carrying both `Commit-Id: 0000000` and a valid id get refused? (carried, still open) (iteration 6)
- Does `pre-push` refuse a pushed non-merge commit without a Commit-Id (repo side), and does a wedged git call really block with `BLOCKED [gate:git-timeout]` at 20 s? (carried, still open) (iteration 6)
- Do the v4.0.0.15/v4.0.0.16 worktree behaviors (`local-*` links, fsmonitor reaper, merged-worktree sweep, `SPECKIT_WORKTREE_AUTOREAP=0`, `SPECKIT_WORKTREE_BASE`) match their notes? (carried, still open — half of Q2) (iteration 6)
- Does `AGENTS.md` match `REPO RULES.md`, and does Devin's 16,384-byte rule cut truncate a binding rule? (still open) (iteration 6)
- Q11: where do these surfaces depart from sk-code, sk-doc and Skilled canon for command format, skill format and hub routing? (iteration 7)
- Q3: do the sk-git hooks behave as the v4.0.0.3 (commit rules, hook safety), v4.0.0.10 (Commit-Id) and v4.0.0.15/v4.0.0.16 (iteration 7)
- Q10: what friction do the operator and the AI user hit in doctor output, hook rejections and CI failures? (iteration 7)
- Q12: what concrete extensions to doctor checks, hooks, CI and mirror sync would close a gap found in this run? (iteration 7)
- Q9: which doctor checks, hooks, workflows or mirror files have no caller or duplicate another, and what breaks if each is (iteration 7)
- Do the sk-git hook suites pass at HEAD, and would wiring them into CI fail today? Running them writes throwaway repos, which is outside this iteration's read-only bound. (iteration 8)
- Does the runtime-mirrors workflow report a degraded adapter when one battery path is missing? (aggregation branch, not path resolution) (iteration 8)
- Does the message gate accept a push whose `Commit-Id` trailer carries both `0000000` and a valid id? (iteration 8)
- Does `AGENTS.md` match `REPO RULES.md`, and does Devin's 16,384-byte rule cut truncate a binding rule? (iteration 8)
- **Q11** — the canon comparison (sk-code / sk-doc / hub routing) is still open; this iteration only reached the CI-wiring and test-harness contrast, not command or skill *format*. (iteration 8)
- The remaining v4.0.0.15/v4.0.0.16 worktree behaviours (`local-*` links, fsmonitor reaper, merged-worktree sweep, `SPECKIT_WORKTREE_AUTOREAP=0`, `SPECKIT_WORKTREE_BASE`). (iteration 8)
- Does Devin's 16,384-byte rule cut truncate a binding rule? The rule directory is reachable and ordered by the trigger table, but the concatenated byte size against the cut was not measured. (iteration 9)
- Do the remaining v4.0.0.15/v4.0.0.16 worktree behaviours (`local-*` links, fsmonitor reaper, merged-worktree sweep, `SPECKIT_WORKTREE_AUTOREAP=0`, `SPECKIT_WORKTREE_BASE`) match their notes? (iteration 9)
- Does a message carrying both `Commit-Id: 0000000` and a valid id get refused? Still open, still needs a deliberate hand-written message. (iteration 9)
- What would a bridge generator actually consume if `skill_agent` became machine-read — `_routes.yaml` `trigger_phrases`, or `command-metadata.json` `skillId`? The tag duplicates identity that already exists in two other places (F9-01), so any consumer design has to pick one of three. (iteration 9)
- Does `pre-push` refuse a pushed non-merge commit without a Commit-Id, and does a wedged git call block with `BLOCKED [gate:git-timeout]` at 20 s? The read-only bound has blocked inducing a live timeout across four iterations. (iteration 9)
- Do the `sk-git` hook suites pass at HEAD, and would wiring them into CI fail today? Running them writes throwaway repos, outside the read-only bound. (iteration 9)
- Whether `.github/workflows` runs the doctor suites (F10-10's gap). (iteration 10)
- **Q4 (hooks half)** — the fail-open repro still needs a scratch repo; open since iteration 2. (iteration 10)
- The v4.0.0.15/v4.0.0.16 worktree behaviours (`local-*` links, fsmonitor reaper, merged-worktree (iteration 10)
- **Q10** — narrowed, not closed. Doctor-output friction is now measured on four engines (iteration 10)
- `Commit-Id: 0000000` plus a valid id; `pre-push` without a `Commit-Id`; the 20 s (iteration 10)
- **Q4 (hooks half)** — the fail-open repro and the v4.0.0.15/v4.0.0.16 worktree behaviours (iteration 11)
- Whether Devin's 16,384-byte rule cut truncates a binding rule; the concatenated size was (iteration 11)
- **Q9 (hooks and workflows half)** — 11 checks now measured, but which *hooks* and *workflow (iteration 11)
- Whether the `.github/workflows` set matches the v4.0.0.16 CI note, and whether any workflow (iteration 11)
- **Q10** — doctor-output friction is now measured on five engines; the hook-rejection and (iteration 11)
- The v4.0.0.15/v4.0.0.16 worktree behaviours (`local-*` links, fsmonitor reaper, (iteration 12)
- `Commit-Id: 0000000` plus a valid id; a pushed commit with no `Commit-Id`; the 20 s (iteration 12)
- The v4.0.0.12 sk-git claim is not covered: the diff's fourth file is a new (iteration 12)
- Whether Devin's 16,384-byte rule cut truncates a binding rule; still unmeasured. (iteration 12)
- Whether Devin's rule cut truncates a binding rule *after* the delivery anchors are (iteration 13)
- **Q3 / Q4 (hooks half)** — still the dominant open question. `pre-push` without a (iteration 13)
- Q11 (canon comparison for command and skill *format*) remains unmeasured. (iteration 13)
- **Q10 (friction)** — F14-01, F14-02 and F14-03 are all friction inputs (a gate that (iteration 14)
- **Q3/Q4 (hooks)** — `pre-push` without a `Commit-Id`, the 20 s `gate:git-timeout`, (iteration 14)
- Is `.skilled/agents/README.txt` (2,029 B) meant to describe 11 agents to a reader who (iteration 14)
- Does `.dsh/agents/*.patch.yml` overlay a body that the parity gate could ever see, or (iteration 14)
- **Q3 (hooks half)** — still open, and now the dominant one. F15-02 shows the *doctor* verdict on (iteration 15)
- Open from earlier: Devin's 16,384-byte rule cut; the 20 s `gate:git-timeout`; a pushed commit (iteration 15)
- **Q10 (friction)** — narrowed again. Doctor-output friction now has a hard example (a check that (iteration 15)
- **Q6** — does `AGENTS.md` match `REPO RULES.md`, and does Devin's 16,384-byte rule cut truncate a binding rule? (iteration 16)
- New and cheap: whether the same ancestor-symlink trap voids any other registry entry. f-iter015-005 survives (it counts a literal list), f-iter015-006 survives (`.claude/agents` is a real directory and `Explore.md` a real file), but the registry has 255 entries and only the copy/duplicate family has been re-tested. A single pass over every finding whose text contains "duplicate", "copy" or "same size" would settle it. (iteration 16)
- **Q1 (hooks half) — the dominant open question, open since iteration 2.** A hook accept/reject repro and the 20 s `gate:git-timeout` both need a scratch repository; the read-only bound has now blocked this across five iterations. This is the single most valuable thing the next pass could do, and it needs a run whose write authority includes `/tmp`. (iteration 16)
- Carried, unreproduced: `Commit-Id: 0000000` alongside a valid id; a pushed commit with no `Commit-Id`. (iteration 16)
- Carried: the v4.0.0.15/v4.0.0.16 worktree behaviours (`local-*` links, fsmonitor reaper, merged-worktree sweep, `SPECKIT_WORKTREE_AUTOREAP=0`, `SPECKIT_WORKTREE_BASE`). (iteration 16)
- **Q11** — command and skill *format* against sk-code / sk-doc canon (the CI-wiring half was reached in iteration 8; the format half never was). (iteration 16)
- **Q11** — command and skill *format* against sk-code / sk-doc canon. (iteration 17)
- **Q3/Q4 hooks half** — unchanged and still the dominant gap: no scratch repo, so `pre-push` (iteration 17)
- New: whether `SKILLED_LOOP_*` belongs in the `/doctor:env` inventory at all. If the answer is "no, (iteration 17)
- New: does the router enforce `gate3_location` and `allowed_flags` for positionals at dispatch? (iteration 17)
- **Q6** — Devin's 16,384-byte rule cut against the concatenated repo-rules size. (iteration 17)
- Does any other `*.test.*` suite in the tree share F18-01's state? The four found are `sk-git`'s; the generalisation (F18-04's `suite-unwired` flag) was designed but not run across the tree. (iteration 18)
- Carried: the v4.0.0.15/v4.0.0.16 worktree behaviours; `Commit-Id: 0000000` plus a valid id; a pushed commit with no `Commit-Id`; Devin's 16,384-byte rule cut. (iteration 18)
- **Q3/Q4 (hooks), still dominant.** F18-01 relocates it: the repro exists on disk. The next pass that has `/tmp` write authority should run `bash .skilled/skills/sk-git/scripts/tests/validate-message-git-timeout.test.mjs` and `commit-id-naming.test.sh` and report whether they pass at HEAD — that answers the timeout question without inducing it by hand, and it is the cheapest remaining P1. (iteration 18)
- **Q10 (friction).** F18-05 is friction input: a green check whose name overstates it. F18-02 is friction of the opposite kind, a rule stated as absolute that the repository does not obey. (iteration 18)
- **Q11** — command and skill format against sk-code / sk-doc canon. Untouched again. (iteration 18)
- **Q11** — command and skill format against sk-code / sk-doc canon. Untouched for a fourth iteration. (iteration 19)
- **Q3/Q4 hooks half — still dominant, and now cheaper to answer.** `--status` is answerable without a scratch repo; accept/reject behaviour is not. `validate-message-git-timeout.test.mjs` and `commit-id-naming.test.sh` remain the cheapest route and still need `/tmp` write authority. (iteration 19)
- Does `isHostRelativeLink` (F20-04) ever see a link text that traverses a symlinked (iteration 20)
- Devin's 16,384-byte rule cut against the concatenated repo-rules size; still (iteration 20)
- Which release introduced `worktree-status.sh`'s separator-less strip (F20-03)? The (iteration 20)
- **Q11** — command and skill format against sk-code / sk-doc canon. Untouched for a (iteration 20)
- **Q1 (hooks half), dominant and unchanged.** `pre-push` without a `Commit-Id`, the 20 s (iteration 20)
- **The hooks accept/reject repro** — open since iteration 2, closed by nothing in 21 iterations. It needs a scratch repository with a `skgit.contractDir`, which every iteration's write bound excluded. The cheapest route remains the suites already on disk (`validate-message-git-timeout.test.mjs`, `commit-id-naming.test.sh`), not a hand-built repo. (iteration 21)
- The v4.0.0.15/v4.0.0.16 worktree behaviours (`local-*` links, fsmonitor reaper, merged-worktree sweep, `SPECKIT_WORKTREE_AUTOREAP=0`, `SPECKIT_WORKTREE_BASE`). (iteration 21)
- Devin's 16,384-byte rule cut against the concatenated repo-rules size. (iteration 21)
- **Q11** — command and skill *format* against sk-code / sk-doc canon. Unmeasured for a fifth iteration. (iteration 21)
- The `Commit-Id: 0000000` plus valid-id case; a pushed commit with no `Commit-Id`; the 20 s `gate:git-timeout`. (iteration 21)
- New from this iteration: does `dist-freshness.cjs` expose a non-refreshing mode, and if not, is the probe's dist write the only in-repo write among the "read-only" doctor routes? F22-08 found one; the other check-form routes (`skill-graph-freshness.cjs`, `agents-md-check.cjs`, `sk-skill-check.cjs`, `git-setup-check.cjs`) were only partially read for writes. (iteration 22)
- **Q1 (hooks half), dominant and unchanged since iteration 2.** `pre-push` without a `Commit-Id`, the 20 s `gate:git-timeout`, `Commit-Id: 0000000` alongside a valid id — all three still need a scratch repository with `skgit.contractDir`. Nothing in 22 iterations has closed it. (iteration 22)
- **Q11 — command and skill *format* against sk-code / sk-doc canon.** Untouched for a sixth iteration. (iteration 22)
- New: which other doctor scripts emit a `--json` trailer (the grep counts 12 files containing `STATUS=`), and does any route asset instruct a JSON parse of the whole stream? F22-01 measured two; the family is larger. (iteration 22)

<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
New: which other doctor scripts emit a `--json` trailer (the grep counts 12 files containing `STATUS=`), and does any route asset instruct a JSON parse of the whole stream? F22-01 measured two; the family is larger.

<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT
None. No handover.md and no prior research in specs/system-speckit/047-v4-release-line-research/005-doctor-git-ci-runtime; the free-text recipe was not run because the topic is a long brief rather than a search phrase.

resource-map.md not present; skipping coverage gate

### Bounded Context Snapshot

Populate during initialization when the target is codebase-scoped. Keep this pointer-based and small:

- Source pointers: paths, symbols, or resource-map entries relevant to the topic.
- Reuse candidates: existing utilities, patterns, docs, or agents worth extending.
- Integration points: files or contracts the research is likely to touch.
- Constraints and risks: scope limits, stale graph or memory gaps, and known non-goals.

Do not inline full source bodies. Do not dispatch the retired standalone context loop. Use `@context` for one-shot retrieval, and use this snapshot only to seed the research loop.

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 10
- Convergence threshold: 0.05 (telemetry only under stopPolicy max-iterations)
- Per-iteration budget: 24 tool calls, 10 minutes (executor timeout 2400 seconds)
- Progressive synthesis: true (default)
- research/research.md ownership: workflow-owned canonical synthesis output
- Lifecycle branches: `resume`, `restart` (live); `fork`, `completed-continue` (deferred, not runtime-wired)
- Machine-owned sections: reducer controls Sections 3, 6, 7-11A, including Section 10A pivot lineage
- Question injection surface: `{spec_folder}/research/inbox.jsonl`
- Question conflict owner: reducer registry; `question_conflict` events surface inbox/registry disagreements for operator decision
- Canonical pause sentinel: `research/.deep-research-pause`
- Capability matrix: `.skilled/skills/system-deep-loop/deep-research/assets/runtime-capabilities.json`
- Capability matrix doc: `.skilled/skills/system-deep-loop/deep-research/references/guides/capability-matrix.md`
- Capability resolver: `.skilled/skills/system-deep-loop/deep-research/scripts/runtime-capabilities.cjs`
- Current generation: 1
- Started: 2026-11-08T19:57:09.370Z
