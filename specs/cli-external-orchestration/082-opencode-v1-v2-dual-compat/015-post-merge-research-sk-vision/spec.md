---
title: "Research Record: Post-merge research on sk-vision OpenCode 2 runtime"
description: "One steered research iteration on the sk-vision OpenCode 2 runtime after the merge: tool registration, the 2-second grace path, `close()`, the interpreter checks and the venv mkdir race."
trigger_phrases:
  - "post merge research sk-vision opencode 2 runtime"
importance_tier: "normal"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/082-opencode-v1-v2-dual-compat/015-post-merge-research-sk-vision"
    last_updated_at: "2026-10-19T18:30:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Scaffolded the research record before the first iteration"
    next_safe_action: "Run the A23 iterations"
    blockers: []
    key_files:
      - "research/research.md"
      - "research/steering-log.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "082-015-post-merge-research-sk-vision"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: research-record | v2.2 -->
# Research Record: Post-merge research on sk-vision OpenCode 2 runtime

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
| **Phase** | 15 of 18 |
| **Predecessor** | 013-sk-vision-v2-tools-and-loose-ends (runs alongside 014) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Four branches reached main on 2026-10-19: the OpenCode dual-compat build, the Pi fast-mode copy claim, worktree dependency provisioning and the dispatch adapter suite runner. Merging them surfaced faults no single branch saw. `session-relaunch.js` arrived without the dual export, both packets were numbered `hooks/023`, and a plain `pi --help` in the trusted main checkout lists no `--fast`. The open question is what else has drifted, which bugs remain, and what the dual-version design should look like now that all four branches share one tree.

### Purpose
Answer angle A23 of the post-merge research as its own steered session, run in parallel with phase 014 because a single research lineage cannot run iterations concurrently. Findings live in `research/research.md`, steering in `research/steering-log.md`, and phase 014's closing synthesis reads them.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- sk-vision OpenCode 2 tool registration and the `SK_VISION_AUTOINSPECT` switch
- The grace path for models off the text-only list
- `RuntimeClient.close()`, the interpreter checks and the venv mkdir race

### Out of Scope
- Changing code or docs - this phase researches; fixes land in later phases
- The operator's global installs, `~/.pi` and the shared OpenCode 2 service - read-only evidence at most
- The original 20-iteration run in `../research/` - kept as it was
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- Which sk-vision OpenCode 2 runtime paths can still misbehave, and what evidence shows it?
- Research topic: what runtime bugs and drift remain in sk-vision's opencode 2 support after the 2026-10-19 merge to main: tool registration through ctx.tool.transform and the sk_vision_autoinspect switch, the 2-second grace path, runtimeclient.close(), the interpreter checks and the venv mkdir race
- Deep research is active for this topic; `research/research.md` stays the canonical findings record.

<!-- BEGIN GENERATED: deep-research/spec-findings -->
**Deep-research findings (abridged from `research/research.md`, which stays canonical).** The run stopped at 1 of 1 iterations (`maxIterationsReached`), with 1 of 1 key questions answered.

- P1: the setup teardown awaits four disposals in sequence, so one throw leaks the rest (confirmed, `src/plugin.ts:463-468`).
- P1: a failed `ctx.session.get` becomes `model = undefined`, which sends a text-only model to the 2-second grace instead of the guaranteed wait (code confirmed, impact inferred).
- P2: the 15-second startup ping timer is never cleared (confirmed); the hand-maintained `V2PluginContext` is not backed by the published v2 types (inferred).
- P3: command registration fails closed while tools fail open; a `close()` mid-`mkdir` leaves an empty venv; 5-second probes treat slow as missing.
<!-- END GENERATED: deep-research/spec-findings -->
<!-- /ANCHOR:questions -->
