---
title: "Research Record: Post-merge research on sk-code-skilled and sk-doc conformance"
description: "Two steered research iterations auditing every code file the four merged branches changed against sk-code-skilled, and every doc they changed against sk-doc."
trigger_phrases:
  - "post merge research sk-code-skilled and sk-doc conformance"
importance_tier: "normal"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/082-opencode-v1-v2-dual-compat/018-post-merge-research-conformance"
    last_updated_at: "2026-10-19T18:30:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Scaffolded the research record before the first iteration"
    next_safe_action: "Run the A28 and A29 iterations"
    blockers: []
    key_files:
      - "research/research.md"
      - "research/steering-log.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "082-018-post-merge-research-conformance"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: research-record | v2.2 -->
# Research Record: Post-merge research on sk-code-skilled and sk-doc conformance

<!-- SPECKIT_LEVEL: research -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | research |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-10-19 |
| **Findings** | `research/research.md` |
| **Parent Spec** | ../spec.md |
| **Phase** | 18 of 18 |
| **Predecessor** | 013-sk-vision-v2-tools-and-loose-ends (runs alongside 014) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Four branches reached main on 2026-10-19: the OpenCode dual-compat build, the Pi fast-mode copy claim, worktree dependency provisioning and the dispatch adapter suite runner. Merging them surfaced faults no single branch saw. `session-relaunch.js` arrived without the dual export, both packets were numbered `hooks/023`, and a plain `pi --help` in the trusted main checkout lists no `--fast`. The open question is what else has drifted, which bugs remain, and what the dual-version design should look like now that all four branches share one tree.

### Purpose
Answer angle A28 and A29 of the post-merge research as its own steered session, run in parallel with phase 014 because a single research lineage cannot run iterations concurrently. Findings live in `research/research.md`, steering in `research/steering-log.md`, and phase 014's closing synthesis reads them.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- sk-code-skilled conformance of the changed code
- sk-doc conformance of the changed docs

### Out of Scope
- Changing code or docs - this phase researches; fixes land in later phases
- The operator's global installs, `~/.pi` and the shared OpenCode 2 service - read-only evidence at most
- The original 20-iteration run in `../research/` - kept as it was
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- Where do the changed code and docs miss the sk-code-skilled and sk-doc contracts?
- Research topic: where do the code and docs changed by the four branches merged to main on 2026-10-19 (opencode dual compatibility, the pi fast-mode copy claim, worktree provisioning, the adapter suite runner) miss the sk-code-skilled and sk-doc contracts
- Deep research is active for this topic; `research/research.md` stays the canonical findings record.

<!-- BEGIN GENERATED: deep-research/spec-findings -->
**Deep-research findings (abridged from `research/research.md`, which stays canonical).** The run stopped at 2 of 2 iterations (`maxIterationsReached`), with both key questions answered (the reducer counts 1 of 2 because iteration 2 recorded the question text with markdown emphasis; see the Convergence Report).

- Comment hygiene, the four drift guards and the changed READMEs' sk-doc validators are clean.
- P2: seven sk-vision tests sit beside their sources, and sk-doc's two `test-frontmatter-version*.mjs` files run under no runner (both confirmed). The sk-vision OpenCode host adapter has no paired test.
- P3: `.pi` sits outside the central Node runner, the "80 tests" README claim is unverified, and `SECURITY.md` has no document-type rule.
<!-- END GENERATED: deep-research/spec-findings -->
<!-- /ANCHOR:questions -->
