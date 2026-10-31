---
title: "Implementation Summary: Phase 11: Regeneration and verification"
description: "Every generator ran and found nothing stale. Every phase 002 gate passes beside its baseline reading, the three drift counts read 0, and the five CI jobs the plugin move and the prose sweep broke on main are green again."
trigger_phrases:
  - "regeneration and verification implementation summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/072-skill-routing-and-clarity/011-regeneration-and-verification"
    last_updated_at: "2026-10-28T19:30:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Regenerated every derived surface and verified the gates against the phase 002 baseline"
    next_safe_action: "Close the parent packet"
    blockers: []
    key_files:
      - "scratch/before.md"
      - "scratch/after.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "skill-routing-and-clarity-phase-011"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Why did this phase fix tests that another packet broke? Because REQ-001 needs every phase 002 gate to pass, and the router-tests gate failed on main after the plugins moved into .opencode. That packet was finished and its worktree idle, so the fix landed here."
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary: Phase 11: Regeneration and verification

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 011-regeneration-and-verification |
| **Completed** | 2026-10-28 |
| **Level** | 2 |
| **Status** | Complete |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The routing program's derived files are proven fresh. Its gates are proven no worse than the phase 002 baseline. Main's CI is green again.

### Regeneration found nothing stale

Every generator ran in write mode: the Hermes copies, the Codex and Hermes prompt stubs, the 13 leaf manifests, the 7 compiled routes, the runtime mirrors and the generated agents. None of them wrote a file, apart from the one manifest whose source this phase changed. That is the proof the earlier phases left every derived surface in step with its source.

### Every baseline gate passes, with its delta

`scratch/after.md` §2 sets each phase 002 gate beside its baseline reading. All 38 gates exit 0, and routing accuracy is 155/195, 49/66 and 19/24, the same as the baseline. Each delta has a stated cause: a skill removed from main, or six reach disputes on the allowlist with a review date. The two drift kinds phase 002 counted read 0 today, down from 64, 36 and 17.

### Main's red CI, fixed

When this phase started, five CI jobs were red on main. Four came from the commit that moved the OpenCode plugins into `.opencode/plugins/`: five tests still read the old path, the gate-inputs twin rule asked for a `.skilled` twin that no longer exists, and a tracked link pointed at a folder CI never checks out. The fifth came from the prose sweep, which split a bullet a docs test reads as one line. Each is fixed, and `scratch/after.md` §3 pairs each fix with the gate it turns green.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The gate set ran first on the tree main held after the sweep, and that reading is `scratch/before.md`. The five red CI jobs were read from their logs, and each failure was traced to its cause before any edit. A DeepSeek worker fixed the five test paths, after showing that each test failed first. The other fixes were small enough to make directly. A read-only DeepSeek worker reran the phase 002 drift counts with a script and checked the script against the baseline commit before trusting today's zeros. The full gate set then ran on the fixed tree, and the fixes landed as two commits.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Fix the plugin-move breakage here | REQ-001 needs every phase 002 gate to pass, and one of them failed on main. The packet that moved the plugins was marked Complete and its worktree was idle, so leaving the breakage would have left this phase unclosable. |
| Exempt the two OpenCode-only surfaces in the twin rule rather than add twin filters | A twin filter would name `.skilled/plugins/`, a path that no longer exists. The rule now says which paths exist under `.opencode` alone, and a near-miss test proves it still demands a twin everywhere else. The operator gave the second named confirmation this protected gate needs. |
| Ignore the shared commands assets link rather than track it | The folder it points at holds only private entries, so every CI checkout lacks the target. The ignore comment says to track the link again once a public entry lands there. |
| Restore the docs-pinned bullet word for word | The test reads that line as a unit. Rewording it to keep the short-sentence shape would have meant changing the test, which guards a fact about subagent effort. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:deviations -->
## Deviations

1. **Files outside Files to Change.** The phase lists the Hermes copies and changelogs. It also changed `.github/scripts/check-gate-inputs.sh` and its test file, `.gitignore`, five test files under `sk-code-skilled` and `system-skill-advisor`, and one bullet in `cli-claude-code/SKILL.md`. Each was needed to make a phase 002 gate or a CI job pass, and `scratch/after.md` §3 names which.

2. **No new version steps.** The phase changed no skill's behavior. The one SKILL.md line it restored is recorded in that skill's existing sweep changelog entry instead of a new version.
<!-- /ANCHOR:deviations -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Full gate set, 38 gates | 38 of 38 exit 0 |
| Routing accuracy | 155/195, 49/66, 19/24, identical to the baseline |
| `sync-skills-hermes.cjs --check` | `PASS: 65 Hermes skill copies in sync` |
| `sync-runtime-mirrors.cjs --check` | `PASS: 202 mirrors across 9 trees are in sync.` |
| `check-agent-mirror-sync.cjs --all` | all 11 agents in sync |
| `check-gate-inputs.sh` on the repository | `failures=0`, `RESULT: PASSED` |
| `check-gate-inputs.test.sh` | `61 passed, 0 failed` |
| Skill advisor stress suite | `Test Files 21 passed (21)` |
| Drift recounts | 0, 0 and 0, against 64, 36 and 17 |

Detail: `scratch/after.md`.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Six reach disputes sit on the allowlist.** Router reach passes with `allowed=9` against the baseline's 3. Each added entry is a recorded dispute due for review on 2026-12-07, not a probe that reaches the wrong hub.

2. **The ignored assets link needs tracking again later.** If a public entry lands in `.skilled/commands/assets/`, the `.opencode/commands/assets` link has to be tracked again, or CI will report it missing. The ignore comment says so.
<!-- /ANCHOR:limitations -->
