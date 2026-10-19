---
title: "Research Record: Post-merge research on cli-opencode, doctor and CI"
description: "Two steered research iterations on cli-opencode docs and flags against OpenCode 1.19.3 and 2.0.32, and on the doctor battery and the dual-version CI workflow, including whether the CI run on main passed."
trigger_phrases:
  - "post merge research cli-opencode, doctor and ci"
importance_tier: "normal"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/082-opencode-v1-v2-dual-compat/016-post-merge-research-cli-opencode-ci"
    last_updated_at: "2026-10-19T18:30:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Scaffolded the research record before the first iteration"
    next_safe_action: "Run the A24 and A25 iterations"
    blockers: []
    key_files:
      - "research/research.md"
      - "research/steering-log.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "082-016-post-merge-research-cli-opencode-ci"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: research-record | v2.2 -->
# Research Record: Post-merge research on cli-opencode, doctor and CI

<!-- SPECKIT_LEVEL: research -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | research |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-19 |
| **Findings** | `research/research.md` |
| **Parent Spec** | ../spec.md |
| **Phase** | 16 of 18 |
| **Predecessor** | 013-sk-vision-v2-tools-and-loose-ends (runs alongside 014) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Four branches reached main on 2026-10-19: the OpenCode dual-compat build, the Pi fast-mode copy claim, worktree dependency provisioning and the dispatch adapter suite runner. Merging them surfaced faults no single branch saw. `session-relaunch.js` arrived without the dual export, both packets were numbered `hooks/023`, and a plain `pi --help` in the trusted main checkout lists no `--fast`. The open question is what else has drifted, which bugs remain, and what the dual-version design should look like now that all four branches share one tree.

### Purpose
Answer angle A24 and A25 of the post-merge research as its own steered session, run in parallel with phase 014 because a single research lineage cannot run iterations concurrently. Findings live in `research/research.md`, steering in `research/steering-log.md`, and phase 014's closing synthesis reads them.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- cli-opencode docs, flag and subcommand drift against both installed versions
- The `/doctor` OpenCode version battery
- `.github/workflows/opencode-dual-version.yml` and its runs on main

### Out of Scope
- Changing code or docs - this phase researches; fixes land in later phases
- The operator's global installs, `~/.pi` and the shared OpenCode 2 service - read-only evidence at most
- The original 20-iteration run in `../research/` - kept as it was
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- Do cli-opencode, the doctor battery and the CI workflow match OpenCode 1.19.3 and 2.0.32 as installed, and did CI pass on main?
- Research topic: where do cli-opencode's docs, flags and dispatch shapes, the doctor opencode version battery and the dual-version ci workflow drift from opencode 1.19.3 and 2.0.32 as installed after the 2026-10-19 merge to main, and did the ci workflow pass on main
- Deep research is active for this topic; `research/research.md` stays the canonical findings record.

<!-- BEGIN GENERATED: deep-research/spec-findings -->
**Deep-research findings (abridged from `research/research.md`, which stays canonical).** The run stopped at 2 of 2 iterations (`maxIterationsReached`), with 2 of 2 key questions answered.

- CI is green on main: run 39309852507 on `793b50ccbf` passed all three jobs after three red runs (confirmed).
- The battery and the workflow test what they claim; CI runs no smoke dispatch, and `opencode-config-shape.test.cjs` is a trigger path with no job (confirmed).
- P2 doc drift: an undocumented `--share` on 1.19.3, two default model ids and two agent paths (confirmed).
- P3: a stale v2 `--log-level` note, an incomplete v1 flag summary and dated proof counts.
<!-- END GENERATED: deep-research/spec-findings -->
<!-- /ANCHOR:questions -->
