---
title: "Implementation Summary"
description: "Forced-depth deep research of the doctor-git-ci-runtime cluster across the v4 release line: iteration count, executor, coverage of release against finding type, and the strongest verified findings."
trigger_phrases:
  - "doctor git ci runtime implementation summary"
importance_tier: "normal"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "system-speckit/047-v4-release-line-research/005-doctor-git-ci-runtime"
    last_updated_at: "2026-11-08T22:34:13Z"
    last_updated_by: "orchestrator-a"
    recent_action: "Run closed after the depth bar cleared at iteration 22; research.md synthesized"
    next_safe_action: "Parent synthesis reads research/research.md"
    blockers: []
    key_files:
      - "research/research.md"
      - "research/deep-research-state.jsonl"
    session_dedup:
      fingerprint: "sha256:7aa1fa32db54f2a5814613e3f85d4492bacbdf100e5f4701abbe88b6145e9cec"
      session_id: "005-doctor-git-ci-runtime-research"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 005-doctor-git-ci-runtime |
| **Completed** | 2026-11-08 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

This phase ran a forced-depth research loop over doctor, git, CI and runtime mirrors: 22 state rows, 21 productive iterations after one Devin quota failure, two +5 extensions, closed when iterations 20 to 22 held no new verified P1. The strongest findings are checkers that cannot fail and CI gates narrower than their names.

### Phase 5: doctor-git-ci-runtime

The loop read each v4 release that touched this cluster against the code and docs it shipped, and logged findings in seven types. You get a ranked list in `research/research.md` that a remediation packet can pick up without re-reading the releases.

### Coverage: release against finding type

Counts come from the `findingType` and `release` fields of the finding rows in `research/deltas/`. A dot means no finding of that type was logged for that release. 4 of 117 finding rows carried no parsable type or release and are not counted.

| Release | Drift | Misalign | Bug | Improve | UX | Over-eng | Extension |
|---------|-------|----------|-----|---------|----|----------|-----------|
| pre-v4.0.0.0 | . | 1 | . | . | . | . | . |
| v4.0.0.0 | 17 | 2 | 2 | 4 | 3 | 2 | . |
| v4.0.0.1 | 1 | . | . | . | . | . | 2 |
| v4.0.0.2 | 1 | . | . | . | . | 1 | . |
| v4.0.0.3 | 4 | 1 | 2 | . | 5 | . | 1 |
| v4.0.0.4-.10 | 6 | . | 1 | 1 | 1 | 1 | . |
| v4.0.0.11 | . | . | 1 | . | 3 | . | . |
| v4.0.0.12 | . | . | . | 1 | . | . | . |
| v4.0.0.13 | 1 | . | 1 | 2 | 1 | . | 1 |
| v4.0.0.14 | . | 1 | . | 1 | . | 1 | . |
| v4.0.0.15 | 1 | . | 1 | . | . | . | 1 |
| v4.0.0.16 | 3 | 1 | 1 | . | 1 | . | 1 |
| v4.0.1.0 | 6 | 1 | . | 3 | 1 | . | 1 |
| v4.0.2.0 | 5 | . | 6 | 2 | 3 | 2 | . |

### Strongest Findings

| # | Finding | Type | Severity | Release | Source | Orchestrator check |
|---|---------|------|----------|---------|--------|--------------------|
| 1 | symlink-engine check reports missing, broken and foreign links and then exits 0 unconditionally, so /doctor:symlink check can never fail a CI step or a script | bug | P1 | v4.0.1.0 | `.skilled/commands/doctor/scripts/symlink-engine.cjs:1801` | Orchestrator read :1791-1801 at close: the check branch builds the report, emits it, and returns a literal 0 |
| 2 | The hooks leg of the git setup check passes through a machine-wide core.hooksPath, so a repository with nothing installed reports PASS when the global hooks dir links into this checkout | bug | P1 | v4.0.0.3 | `.skilled/commands/doctor/scripts/git-setup-check.cjs:387` | Orchestrator: git config --global core.hooksPath is ~/.config/git/hooks, whose commit-msg links into .skilled/scripts/git-hooks; :384-399 accepts any hook realpath that equals the own source dir |
| 3 | The sk-git CI job runs one test suite of five and no workflow anywhere runs stamp-branch, migrate-legacy-branch-names, commit-id-naming or validate-message-git-timeout | bug | P1 | v4.0.0.13 | `.github/workflows/sk-git-script-tests.yml:51` | Orchestrator: sed -n 51p runs only worktree-naming.test.sh; grep -rl over .github finds no reference to the other four suites (the single commit-id-naming hit names the script, not its test) |
| 4 | The agent body-parity gate checks 3 of 7 runtime trees, and its required opencode arm compares each canonical file with itself because .opencode/agents is a symlink to .skilled/agents | drift | P1 | v4.0.0.0 | `.skilled/bin/lib/mirror-sync-verify.cjs:51` | Orchestrator: :50-54 lists opencode, claude and codex only; ls -ld .opencode/agents shows a symlink, git mode 120000; .pi/agents/code.md is 48863 B against 49002 and 48781 with no check |
| 5 | install-git-hooks.sh --status marks correctly installed hooks SHADOWED ('resolves outside this checkout') when they link through the .opencode/scripts alias, because it compares two spellings of one file as strings | bug | P1 | v4.0.2.0 | `.skilled/scripts/install-git-hooks.sh:99` | Orchestrator: GIT_CONFIG_GLOBAL=/dev/null install-git-hooks.sh --status prints 6 SHADOWED lines; .git/hooks/commit-msg links to .opencode/scripts/git-hooks/commit-msg, the same file |

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `research/` | Created | Run config, ledger-backed state log, strategy, registry, iterations, deltas, prompts and `research.md` |
| `spec.md`, `plan.md`, `tasks.md`, `decision-record.md`, `implementation-summary.md` | Modified | Research charter, plan, task state, run decisions and this summary |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The orchestrator ran the auto workflow's own commands step by step: lock, render, dispatch through `if_cli_devin`, `verify-iteration.cjs`, the reducer and the graph upsert. Executors used: cli-devin deepseek-v4-1-flash-max (iterations before the switch), cli-pi opencode-go/deepseek-v4.1-flash thinking max (after). After every iteration it read the iteration file and its state record, opened two cited lines, and set the next focus. Recorded iterations, counted from the state log: 22.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Convergence runs as telemetry only, with ten iterations as the floor | The brief asks for forced depth, so a quiet iteration must not end the run early. |
| Steering goes through `research/inbox.jsonl` and the rendered focus, never a hand edit of reducer-owned sections | The reducer rewrites Next Focus every pass, so a hand edit would vanish and break the ownership contract. |
| The artifact directory is not staged with `git add` | The brief forbids changing the index; the operator stages the run when committing it. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Iterations recorded in the state log | 22 rows of type `iteration` |
| Depth-bar score at close | 3 of 3 clean by the orchestrator's verification: iterations 20 to 22 added no new verified P1 after two +5 extensions. Raw delta severities for 20, 21 and 22 are P1 0, 2 and 0, and the orchestrator verified neither of the two in 21 as a new P1. newInfoRatio 0.50, 0.38 and 0.45 |
| Citation checks | Two per iteration, verdicts in `decision-record.md` ADR-005 |
| Strict validation | Summary: Errors: 0  Warnings: 2 / RESULT: PASSED (SOURCE_TAGS: 4 iteration-010 citations through the .opencode/scripts alias that the redirect table reports as moved, plus one containment quarantine copy of a sibling child; LEVEL_MATCH: decision-record.md at Level 1) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **One model family.** Every iteration ran DeepSeek V4.1 Flash, so judgment findings such as over-engineering carry one lens. Treat them as hypotheses until a second family or a grounding check agrees.
2. **Release attribution is by path-limited diff.** v4.0.0.4 to v4.0.0.10 share one tag commit, so attribution inside that block leans on each note and the commit dates.
<!-- /ANCHOR:limitations -->

---
