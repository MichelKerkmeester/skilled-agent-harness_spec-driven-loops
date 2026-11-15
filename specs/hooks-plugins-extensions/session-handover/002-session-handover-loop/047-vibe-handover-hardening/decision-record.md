---
title: "Decision Record: Phase 47: vibe-handover-hardening"
description: "Why the Vibe hand-over fixes live in the Vibe adapter and behind a folder path in the shared killer, so the other runtimes keep their behavior."
trigger_phrases:
  - "vibe handover hardening decision record"
importance_tier: "normal"
contextType: "decision"
_memory:
  continuity:
    packet_pointer: "scaffold/047-vibe-handover-hardening"
    last_updated_at: "2026-11-15T17:27:55Z"
    last_updated_by: "template-author"
    recent_action: "Initialized decision record template"
    next_safe_action: "Replace continuity placeholders"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-047-vibe-handover-hardening"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
# Decision Record: Phase 47: vibe-handover-hardening

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Keep the Vibe fixes inside the Vibe adapter and behind a folder path

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-11-15 |
| **Deciders** | Operator, orchestrator |

---

<!-- ANCHOR:adr-001-context -->
### Context

Two of the fixes touch code every runtime shares: the nudge ladder in `lib/nudge.cjs` and the killer's idle watch in `lib/killer.cjs`. The duplicate nudge happens only on Vibe, which runs tool hooks side by side. The stale watched segment happens only on Vibe, which starts a new journal segment at each fold. A change to the shared code risked changing Claude Code, Codex, Pi and OpenCode, which have the longest live record.

### Constraints

- Claude, Codex and Pi pass the killer a transcript file, and OpenCode passes none.
- The other runtimes' handover tests must pass with no edited expectation.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: put the nudge claim in `vibe/handover-parts.mjs` and give the killer a folder branch that only a folder path reaches.

**How it works**: the Vibe adapter creates a claim file before it writes the nudge level and decides again under the claim. `transcriptMtime` returns a file's mtime as before, and for a folder returns the newest mtime among the folder and its numbered segments. Only the Vibe adapter passes a folder.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Adapter claim and folder branch** | Other runtimes unchanged; one runtime's tests cover it | The claim logic is Vibe-only | 8/10 |
| Lock inside `nudge.cjs` for every runtime | One mechanism everywhere | Changes five runtimes to fix one | 4/10 |
| A Vibe-only killer | No shared change at all | A second killer to keep in step | 3/10 |

**Why this one**: it fixes the Vibe behavior with no change on any path another runtime takes.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- A live Vibe hop signals 5.2 to 5.9 s after `prepare`, against 76.5 s before.
- The other runtimes' tests pass unchanged: 1025 of 1025.

**What it costs**:
- Two hooks that both find a claim left by a dead hook can both deliver. Mitigation: documented in the adapter; the cost is one repeated nudge.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A Vibe journal written continuously after turn end keeps the killer waiting | M | The killer's 30 s timeout still ends the wait, and two live hops signalled in about 5 s |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The analysis measured the 76.5 s sender delay and showed the watched segment going stale |
| 2 | **Beyond Local Maxima?** | PASS | Three options compared above |
| 3 | **Sufficient?** | PASS | About 150 lines of code over seven files |
| 4 | **Fits Goal?** | PASS | The session handover loop goal is reliable hand-over on every runtime |
| 5 | **Open Horizons?** | PASS | A runtime that adds a folder-style journal can reuse the killer branch |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `vibe/handover-parts.mjs`: the claim, the early withdraw, the session-id record, the deferred mark and the folder hand-off.
- `lib/killer.cjs`: the folder branch of `transcriptMtime`.

**How to roll back**: `git revert` the phase's feature commit; no state file format changes.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
| Q001 | Fable 5.2 analyzes the Vibe path read-only and builds nothing until the operator approves the fixes. | Not stated. | None | scratch/analysis.md, timeline.md |
| Q002 | Phase 047 builds F1 to F7 and F9, leaving F8 out of scope. | Not stated. | None | REQ-001 to REQ-010, spec.md scope |
| Q003 | A fresh Opus medium agent reviews the build before any merge. | Not stated. | None | T015, implementation-summary.md verification |
| Q004 | Vibe CLI builds the approved fixes instead of Fable, on deepseek-flash at max thinking as the operator added in chat. | Not stated. | The plan that Fable 5.2 would build after analysis | T004 to T013, implementation-summary.md how-delivered |
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set.

### Q001
<!-- source: claude:b726ec67-1d85-4833-b219-c038e184d696:toolu_01Fm1vUWaAXFrJYm2BwfMsiN:2 -->

Question:
```text
How should the Fable 5.2 high run go?
```

Options:
```text
Analyze, then I approve (Recommended)
Analyze and build in one go
Analysis only
```

Answer:
```text
Analyze, then I approve (Recommended)
```

### Q002
<!-- source: claude:b726ec67-1d85-4833-b219-c038e184d696:toolu_0196EVewJBt8CmSsxD5GtDzH:0 -->

Question:
```text
Fable found no P0. It found two P1s and seven P2s, and I confirmed the key citations in the code. Which fixes should Fable 5.2 build in phase 047?
```

Options:
```text
Core four (Recommended)
Killer journal watch
Compaction + nudge race
Typed handoff + key warning
```

Answer:
```text
Core four (Recommended), Killer journal watch, Compaction + nudge race, Typed handoff + key warning
```

### Q003
<!-- source: claude:b726ec67-1d85-4833-b219-c038e184d696:toolu_0196EVewJBt8CmSsxD5GtDzH:1 -->

Question:
```text
Who should review Fable's build before it merges?
```

Options:
```text
Fresh Opus medium (Recommended)
DeepSeek via OpenCode
No separate review
```

Answer:
```text
Fresh Opus medium (Recommended)
```

### Q004
<!-- source: claude:b726ec67-1d85-4833-b219-c038e184d696:toolu_01HufMmEWB56pwD9gEgMh44R:0 -->

Question:
```text
I stopped Fable before it changed any code, and the approved fixes F1 to F7 and F9 are still unbuilt. Who should build them instead, if anyone?
```

Options:
```text
DeepSeek via OpenCode (Recommended)
Luna via cli-codex
You build it
Don't build yet
```

Answer:
```text
Vibe clu
```

<!-- /ANCHOR:operator-answers-verbatim -->

---
