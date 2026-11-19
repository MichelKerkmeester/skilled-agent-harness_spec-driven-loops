---
title: "Decision Record: Give every hook, plugin and extension feature its own sub-track under the hooks track, with one overview of all features and their owning packets."
description: "Operator decisions and their verbatim answers for this packet."
trigger_phrases:
  - "001-feature-subtrack-restructure operator decisions"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/hook-platform/001-feature-subtrack-restructure"
    last_updated_at: "2026-11-19T17:35:37.074Z"
    last_updated_by: "decision-record-writer"
    recent_action: "Recorded operator decisions"
    next_safe_action: "Review the recorded operator decisions"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "decision-record-writer"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Decision Record: Give every hook, plugin and extension feature its own sub-track under the hooks track, with one overview of all features and their owning packets.

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
| Q001 | Hook-feature packets that live in other tracks are pulled into the hooks track too. | Not stated. | none | specs/hooks-plugins-extensions/hook-platform/001-feature-subtrack-restructure/spec.md |
| Q002 | Packets without in-flight work move to their sub-tracks now; those with in-flight work are held. | Not stated. | none | specs/hooks-plugins-extensions/hook-platform/001-feature-subtrack-restructure/spec.md |
| Q003 | The build swarm runs DeepSeek V4.1 Flash at max through cli-opencode and Mistral. | Not stated. | none | specs/hooks-plugins-extensions/hook-platform/001-feature-subtrack-restructure/spec.md |
| Q004 | The in-track move map is approved, plus empty sub-tracks, and every sub-track gets a z_archive folder with a .gitkeep. | Not stated. | none | specs/hooks-plugins-extensions/hook-platform/001-feature-subtrack-restructure/spec.md |
| Q005 | The foreign groups that move in are the clear hook subjects, the sk-code dist guards, the sk-git commit advisories and sk-git live-sync. | Not stated. | none | specs/hooks-plugins-extensions/hook-platform/001-feature-subtrack-restructure/spec.md |
| Q006 | 002-session-relaunch-loop and pi-extensions/012 both stay held. | Not stated. | none | specs/hooks-plugins-extensions/hook-platform/001-feature-subtrack-restructure/spec.md |
| Q007 | The spec sub-track is renamed from session-relaunch to session-handover. | Not stated. | none | spec.md; feature-overview.md |
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set.

### Q001
<!-- source: claude:d785250f-7570-4eb7-b91c-c43f32d65099:toolu_018sHzdCAihY9YDZYSwbT3cn:1 -->

Question:
```text
I counted about 30 features. Roughly 12 of them (git-live-follow, overlay-guard, post-edit-quality, dist-freshness and others) have their packets in other tracks such as sk-git, sk-code and cli-classifier, and 6 have no packet anywhere. How should those get a sub-track?
```

Options:
```text
Sub-track for all, no foreign moves (Recommended)
Sub-track only where packets exist
Pull foreign packets in too
```

Answer:
```text
Pull foreign packets in too
```

### Q002
<!-- source: claude:d785250f-7570-4eb7-b91c-c43f32d65099:toolu_018sHzdCAihY9YDZYSwbT3cn:2 -->

Question:
```text
002-session-relaunch-loop (41 children) has unmerged work in worktree 392, and worktree 353 has uncommitted Pi extension edits. When should packets with in-flight work elsewhere be moved to their new sub-track?
```

Options:
```text
Move the rest now, hold those (Recommended)
Move everything now
Only declare sub-tracks, move nothing
```

Answer:
```text
Move the rest now, hold those (Recommended)
```

### Q003
<!-- source: claude:d785250f-7570-4eb7-b91c-c43f32d65099:toolu_018sHzdCAihY9YDZYSwbT3cn:3 -->

Question:
```text
Which DeepSeek V4.1 Flash route should the swarm use? Both were verified in the skill docs; a build swarm has no fan-out helper, so workers are hand-launched in the worktree.
```

Options:
```text
cli-opencode + Mistral, max (Recommended)
cli-pi + OpenCode Go, max
cli-pi + Mistral, max
cli-opencode + OpenCode Go, max
```

Answer:
```text
cli-opencode + Mistral, max (Recommended)
```

### Q004
<!-- source: claude:d785250f-7570-4eb7-b91c-c43f32d65099:toolu_01DsREqQ7hGSnyqvFBhWVt49:0 -->

Question:
```text
In-track move map: 29 quiet packets go into 11 feature sub-tracks: goal (3), directive-lifecycle (3: injection-bloat-reduction, fable-governor, retire-governor), hook-platform (4: docs relocation, mk rename, flags and hub index, smart rule injection), dispatch (1), env-secret-guard (1), skill-advisor (1: pi-input-hook-latency), pi-cache-optimizer (9), pi-fast-mode (1), git-hooks (4, the old repo-commit-gates), spec-gate (1), ask-surface-guard (1). Held: 002-session-relaunch-loop and pi-extensions/012. retrieval-integrations stays. Approve?
```

Options:
```text
Approve, plus empty sub-tracks (Recommended)
Approve, no empty sub-tracks
Hold the moves
```

Answer:
```text
Approve plus empty sub tracks also make sure each subtrack has a z_archive with gitkeep inside
```

### Q005
<!-- source: claude:d785250f-7570-4eb7-b91c-c43f32d65099:toolu_01DsREqQ7hGSnyqvFBhWVt49:1 -->

Question:
```text
Foreign packets: the cards found these whole top-level packets in other tracks whose main subject is a hook feature. Child phases inside other parents stay where they are and get a pointer. Which groups should move into this track?
```

Options:
```text
Clear hook subjects
sk-code dist guards
sk-git commit advisories
sk-git live-sync
```

Answer:
```text
Clear hook subjects, sk-code dist guards, sk-git commit advisories, sk-git live-sync
```

### Q006
<!-- source: claude:d785250f-7570-4eb7-b91c-c43f32d65099:toolu_016fHsL6ffddzG2z6taQGRdy:2 -->

Question:
```text
002-session-relaunch-loop is still held: worktree 392 has merged, but worktrees 402 (in-session-handover-rename) and 382 now carry in-flight work in it. pi-extensions/012 is still held by worktree 353. What should I do about the held moves?
```

Options:
```text
Keep both held (Recommended)
Move the relaunch loop now
```

Answer:
```text
Keep both held (Recommended)
```

### Q007
<!-- source: claude:d785250f-7570-4eb7-b91c-c43f32d65099:toolu_017V5D3tTG9wuDouYo8qxvcb:1 -->

Question:
```text
The handover hook folder was renamed to session-handover by another session, but the spec sub-track is still specs/hooks-plugins-extensions/session-relaunch/. Should the sub-track be renamed to match?
```

Options:
```text
Leave it (Recommended)
Rename to session-handover
```

Answer:
```text
Rename to session-handover
```

<!-- /ANCHOR:operator-answers-verbatim -->
