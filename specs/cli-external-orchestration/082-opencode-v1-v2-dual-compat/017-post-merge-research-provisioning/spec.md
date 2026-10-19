---
title: "Research Record: Post-merge research on provisioning and suites"
description: "One steered research iteration on worktree dependency provisioning (`worktree-naming.sh`, `worktree-provision-paths.txt`, bun against npm) and on the dispatch adapter suite runner and the hooks vitest config."
trigger_phrases:
  - "post merge research provisioning and suites"
importance_tier: "normal"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/082-opencode-v1-v2-dual-compat/017-post-merge-research-provisioning"
    last_updated_at: "2026-10-19T18:30:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Scaffolded the research record before the first iteration"
    next_safe_action: "Run the A27 iterations"
    blockers: []
    key_files:
      - "research/research.md"
      - "research/steering-log.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "082-017-post-merge-research-provisioning"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: research-record | v2.2 -->
# Research Record: Post-merge research on provisioning and suites

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
| **Phase** | 17 of 18 |
| **Predecessor** | 013-sk-vision-v2-tools-and-loose-ends (runs alongside 014) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Four branches reached main on 2026-10-19: the OpenCode dual-compat build, the Pi fast-mode copy claim, worktree dependency provisioning and the dispatch adapter suite runner. Merging them surfaced faults no single branch saw. `session-relaunch.js` arrived without the dual export, both packets were numbered `hooks/023`, and a plain `pi --help` in the trusted main checkout lists no `--fast`. The open question is what else has drifted, which bugs remain, and what the dual-version design should look like now that all four branches share one tree.

### Purpose
Answer angle A27 of the post-merge research as its own steered session, run in parallel with phase 014 because a single research lineage cannot run iterations concurrently. Findings live in `research/research.md`, steering in `research/steering-log.md`, and phase 014's closing synthesis reads them.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `provision_worktree`, the provisioning path list and the bun and npm choice
- The dispatch adapter suites and the hooks vitest config

### Out of Scope
- Changing code or docs - this phase researches; fixes land in later phases
- The operator's global installs, `~/.pi` and the shared OpenCode 2 service - read-only evidence at most
- The original 20-iteration run in `../research/` - kept as it was
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- Which provisioning and suite-runner paths can still fail or drift after the merge?
- Research topic: what bugs and drift remain in worktree dependency provisioning (worktree-naming.sh provision_worktree, worktree-provision-paths.txt, the bun and npm choice) and in the dispatch adapter suite runner and hooks vitest config after the 2026-10-19 merge to main
- Deep research is active for this topic; `research/research.md` stays the canonical findings record.

<!-- BEGIN GENERATED: deep-research/spec-findings -->
**Deep-research findings (abridged from `research/research.md`, which stays canonical).** The run stopped at 1 of 1 iterations (`maxIterationsReached`), with 1 of 1 key questions answered.

- P1: five tracked package trees are missing from `worktree-provision-paths.txt`, both `.pi` extensions among them (confirmed).
- P2: no test compares tracked manifests with the list; lockfile drift fails loudly but is untested; the three dispatch adapter suites and the hooks vitest tree run in no CI job.
- P3: a `bun.lockb` package falls to npm; a listed path whose manifest disappears is skipped silently.
- The owning-runner suites pass 58/58 and the naming suite 97/97, so the merge regressed nothing here.
<!-- END GENERATED: deep-research/spec-findings -->
<!-- /ANCHOR:questions -->
