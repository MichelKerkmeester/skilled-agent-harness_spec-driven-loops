# Iteration 010 — Traceability: agents, repo rules and runtime mirrors

**Run:** `rvw-012-post-merge-20261010T184241Z` · **Iteration:** 10 of 10 · **Dimension:** traceability
**Focus:** in-focus commits `3617968e35`, `77df558665`, `8fdb66cc1b`, `864a3bccd8`, `40fc64d9cd`, `b5927055b0` — every runtime mirror of the changed agents matches `.skilled/agents`; `check-agent-mirror-sync.cjs --all` and `sync-runtime-mirrors.cjs --check` pass; repo-rules cross-references resolve.

## Dimension

traceability — core protocols `spec_code` and `checklist_evidence`; overlay `agent_cross_runtime`. The untrusted-content guard is clean: no directive-like text was found in the reviewed artifacts. All writes stayed in the review packet; the reviewed tree was read-only.

## Files Reviewed

| File:line | What was checked |
| --- | --- |
| `.skilled/agents/deep-review.md:214` | the `Case:` requirement commit 77df558665 added |
| `.claude/agents/deep-review.md:201` | same rule in the Claude dialect |
| `.pi/agents/deep-review.md:208` | same rule in the Pi dialect |
| `.hermes/skills/agent-deep-review/SKILL.md:204` | same rule in the Hermes copy |
| `.codex/agents/deep-review.toml:205` | same rule in the Codex TOML |
| `.skilled/agents/code.md` | reach-list and not-checked disclosure from 3617968e35 |
| `.skilled/repo-rules/communication-handoff.md:64` | five-part close-out status (8fdb66cc1b) |
| `.skilled/repo-rules/evidence-and-proof.md` | §10 pointer after the same commit |
| `AGENTS.md:296` | one-line pointer to the close-out status owner |
| `REPO RULES.md:36` | trigger-table cross-references to every rule file |
| `.skilled/skills/system-deep-loop/deep-improvement/scripts/check-agent-mirror-sync.cjs:6` | banner, path regex, orphan logic, exit strings |
| `.skilled/skills/system-deep-loop/deep-improvement/scripts/lib/mirror-sync-verify.cjs:18` | `RUNTIME_MIRRORS` coverage (opencode, claude, codex) |
| `.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs` | symlink-tree ownership (Claude/Cursor/Devin) |
| `.skilled/skills/system-spec-kit/runtime/cli/pi/sync-agents-pi.cjs` | Pi mirror generator and `--check` |
| `.skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs` | Hermes skill-copy generator and `--check` |
| `.skilled/skills/sk-code/sk-code-quality/scripts/ceiling-report.sh:1` | marker scan and repo-run output |
| `.skilled/skills/sk-code/sk-code-quality/scripts/ceiling-report.test.sh` | fixture harness |
| `.skilled/scripts/git-hooks/pre-commit:259` | `MIRROR_CHECKS` array (eight checks) |
| `.skilled/scripts/git-hooks/pre-commit:211` | `MIRROR_OUTPUTS` guarded trees |
| `.github/workflows/agent-mirror-sync.yml:29` | CI changed-path filter |
| `.github/workflows/spec-kit-check.yml:157` | Pi `--check` wiring (pull_request + push) |
| `.skilled/commands/doctor/scripts/agent-roster-mirror-check.cjs:65` | Pi roster presence check |
| `specs/.../008-.../004-debt-report-and-hermes-gate/implementation-summary.md:115` | recorded `markers=0` claim |
| `specs/.../008-.../004-debt-report-and-hermes-gate/goal.md:81` | same claim as completion criterion |
| `specs/.../008-.../004-debt-report-and-hermes-gate/scratch/after/probe.py:1` | the tracked marker fixture |
| `specs/.../008-.../004-debt-report-and-hermes-gate/scratch/after/report-repo.txt:1` | saved repo-run evidence |

## Findings by Severity

### P0

None.

### P1

None.

### P2

**R10-TRA-001 — Phase 004 records `markers=0` as its final-state repo run; the committed tree prints `markers=3` (P2)**

- **Case:** an operator re-runs the phase's Goal-2 acceptance command on the merged tree and gets a different summary than every recorded artifact: `markers=3 no-trigger=1 no-signal=1` instead of `markers=0 no-trigger=0 no-signal=0`.
- **File:** `specs/sk-code/011-sk-code-poinytail-based-refinement/008-round-two-recommendations/004-debt-report-and-hermes-gate/implementation-summary.md:115`
- **Evidence:** [live] `.skilled/skills/sk-code/sk-code-quality/scripts/ceiling-report.sh` run from the repo root prints three marker lines, all from `scratch/after/probe.py:1-3` [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/008-round-two-recommendations/004-debt-report-and-hermes-gate/scratch/after/probe.py:1], then `markers=3 no-trigger=1 no-signal=1`, exit 0. The three markers come from the phase's own probe fixture, which is tracked at HEAD (`git ls-files` lists it, and `git show --name-only b5927055b0` shows the same commit added it). The script reads "the tracked code files of the repository" (script docstring) [SOURCE: .skilled/skills/sk-code/sk-code-quality/scripts/ceiling-report.sh:1], so the fixture was invisible to the report while it was untracked and visible the moment the commit landed. Recorded claims of 0: `implementation-summary.md:115`, `goal.md:81`, `goal.md:96`, and the saved evidence `scratch/after/report-repo.txt:1`. The task text anticipated a changing count ("If a sibling child has added a marker, the summary counts it and the exit stays 0") [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/008-round-two-recommendations/004-debt-report-and-hermes-gate/tasks.md:85], and the goal criterion requires only `markers=N` with exit 0, so the criterion still passes; the residue is that the recorded observation cannot be reproduced from the committed state and no scan rule excludes spec fixtures.
- **Confidence:** 0.9 on the mismatch; finalSeverity P2 (claim/evidence residue, no functional failure, exit stays 0).
- **Downgrade trigger:** the scan gains an exclusion for spec scratch paths, or the recorded 0 is annotated as measured before the fixture became tracked.
- **Recommendation:** either exclude `specs/**/scratch/**` fixtures from the repo-wide scan (they exist to exercise the tool) or refresh the recorded claim and its evidence file.

**R10-TRA-002 — the agent-mirror checker's banner still describes a Claude-only mirror (P2)**

- **Case:** a maintainer extending or debugging the gate reads the banner first and scopes the mental model to OpenCode plus Claude, missing the Codex leg the same file now enforces — the exact blind spot 40fc64d9cd fixed at the code level.
- **File:** `.skilled/skills/system-deep-loop/deep-improvement/scripts/check-agent-mirror-sync.cjs:6`
- **Evidence:** the banner says "authored once under .opencode/agents/<name>.md and mirrored to .claude/agents/<name>.md" [SOURCE: .skilled/skills/system-deep-loop/deep-improvement/scripts/check-agent-mirror-sync.cjs:6], while the code below accepts Codex paths (`AGENT_PATH_RE` includes `codex` at :32) and reports a Codex orphan mirror at :86-89. `git show 40fc64d9cd` updated the two inner comments to say "Claude or Codex" but did not touch the banner.
- **Confidence:** 0.75; finalSeverity P2 (documentation drift in the very file the fix commit edited).
- **Downgrade trigger:** the crosswalk reference (`deep-improvement/references/shared/agent-mirror-crosswalk.md`) is the designated coverage authority, or the banner is deliberately minimal.
- **Recommendation:** update the banner sentence to name both mirrors.

## Traceability Checks

| # | Protocol | Check | Observed (live, this iteration) |
| --- | --- | --- | --- |
| 1 | agent_cross_runtime | `check-agent-mirror-sync.cjs --all` | `agent-mirror-sync: 12 agent(s) checked — all mirrors in sync — OK`, exit 0 |
| 2 | agent_cross_runtime | `sync-runtime-mirrors.cjs --check` | `[runtime-mirror-sync] PASS: 187 mirrors across 8 trees are in sync.`, exit 0 |
| 3 | agent_cross_runtime | Hermes mirrors | `sync-skills-hermes --check` prints `PASS: 70 Hermes skill copies in sync`; `sync-prompts-hermes --check` prints `37 prompts are in sync`; exit 0 |
| 4 | agent_cross_runtime | Pi mirrors | `sync-agents-pi.cjs --check` prints `[pi-agent-sync] PASS: 12 agents are in sync.`; wired in `.github/workflows/spec-kit-check.yml:157-158` on pull_request and push, with `.pi/**` in the path filters |
| 5 | agent_cross_runtime | changed-agent destinations | 4 changed agents × 7 destinations all present; `.opencode/agents` is a symlink to `../.skilled/agents` (same inode), `.cursor/agents/*.md` and `.devin/agents/*/AGENT.md` symlink to `.claude/agents/*.md` |
| 6 | skill_agent / agent_cross_runtime | `Case:` rule (77df558665) across dialects | present in all five: `.skilled/agents/deep-review.md:214`, `.claude/agents/deep-review.md:201`, `.pi/agents/deep-review.md:208`, `.hermes/skills/agent-deep-review/SKILL.md:204`, `.codex/agents/deep-review.toml:205` |
| 7 | spec_code / checklist_evidence | phase 004 claims | pre-commit harness `71 passed, 0 failed` (live), both Hermes checks PASS, ceiling test PASS all reproduce; the recorded `markers=0` does not → R10-TRA-001 |
| 8 | spec_code | 003-agent-disclosure and 003-deep-review-case-rule counts | their recorded rerun counts reproduce: agent mirrors 12, runtime mirrors 187, Pi 12, Hermes 70 |
| 9 | checklist_evidence | 40fc64d9cd vitest claim | `Tests 6 passed (6)` from `deep-improvement/scripts` (live), matching `scratch/after/vitest-after.txt` |
| 10 | agent_cross_runtime | 8fdb66cc1b pointer | `AGENTS.md:296` points at `communication-handoff.md` §1; the target file and section exist, and the five parts are there |
| 11 | repo-rules cross-references | markdown links in `.skilled/repo-rules/*.md` plus `REPO RULES.md` | 74 links checked with `%20` decoded; 0 broken |
| 12 | feature_catalog_code / playbook_capability | — | not exercised this iteration; no feature-catalog or playbook claim sits in the in-focus commits |

## Observations (below the finding bar)

- **Pi content check is local-presence only, CI-only for bodies.** The pre-commit mirror-parity gate runs eight checks and none regenerates or content-checks `.pi/agents`, although `.pi/agents` is listed among the guarded `MIRROR_OUTPUTS` [SOURCE: .skilled/scripts/git-hooks/pre-commit:211]. Locally Pi is presence-checked (`agent-roster-mirror-check.cjs:65-66`); body equality runs in CI on pull_request and push. Live drift today: none. Not reported as a finding because no in-focus claim asserts local Pi content coverage and CI fires pre-merge.
- **`.skilled/hooks/git/pre-commit` was not updated by b5927055b0.** Not drift: that file is the documented legacy compatibility helper, not the installed hook — the installed hook is `.skilled/scripts/git-hooks/pre-commit`.
- **Ceiling-report stderr warning in this worktree.** The report printed `WARNING: cannot read .../.opencode/plugins/sk-vision.js` because the tracked symlink (`.opencode/plugins/sk-vision.js`, mode 120000) points at `../skills/sk-vision/vision-runtime/dist/plugin.js`, a build artifact absent from this checkout. Environment artifact, not a tree defect; the summary line is unaffected.
- **`ceiling-report.sh` is a Python script behind a `.sh` entrypoint.** Intentional and documented in the scripts README; direct execution via shebang works (exit 0).

## Ruled Out

- *"b592 diverged the two pre-commit hook copies."* Refuted: the untouched copy is a documented legacy helper for direct tests, so only the installed hook needed the Hermes gate.
- *"Pi agent mirrors are unguarded."* Refuted for the reporting bar: CI runs both Pi checks on pull_request and push with `.pi/**` in the path filters; the local roster check covers presence; live `--check` passes.
- *"Mirror bodies drifted from `.skilled`."* Refuted by the live gate runs plus the `Case:`-rule grep across all five dialects and the symlink verification for `.cursor`/`.devin`/`.opencode`.

## Not Proven

- Whether the recorded `markers=0` was ever reproducible from a committed state. The tracked-file scan plus a fixture added by the same commit explains how a working-tree run could print 0 while the fixture was untracked; the author's exact tree is not observable.
- Whether any consumer gates on the ceiling summary value. None found; the script self-declares that it reports and does not gate.

## SCOPE VIOLATIONS

None. All writes stayed in the review packet (`iterations/iteration-010.md`, `deltas/iter-010.jsonl`, `deep-review-strategy.md`, and the append gateway's record); the reviewed tree was read-only.

## Active-Finding Recheck

All 16 prior P2 findings remain active; no P0 or P1 is open anywhere in the registry. This iteration adds two P2s (R10-TRA-001, R10-TRA-002), total 18.

## Verdict

PASS with advisories. No P0 or P1; two new P2 findings. The mirror stack this iteration focused on verifies green at HEAD: 12 agent mirrors in sync, 187 runtime mirrors across 8 trees, 70 Hermes skills plus 37 prompts, 12 Pi agents, 71/71 pre-commit harness cases, 6/6 checker vitest cases, and every repo-rules cross-reference resolves. `hasAdvisories=true`.

## Next Dimension

None — iteration 10 of 10 is the final iteration. Dimension coverage is 4/4 (correctness, security, traceability, maintainability).

Review verdict: PASS
