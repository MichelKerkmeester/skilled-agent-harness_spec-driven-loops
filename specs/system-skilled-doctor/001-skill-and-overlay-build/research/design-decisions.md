---
title: "Decision Record: Vendored Skilled overlays and safe re-pin in a system-skilled-doctor skill"
description: "Operator decisions and their verbatim answers for this packet."
trigger_phrases:
  - "003-vendored-overlays-and-repin operator decisions"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "other/003-vendored-overlays-and-repin"
    last_updated_at: "2026-11-06T07:08:38.626Z"
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
# Decision Record: Vendored Skilled overlays and safe re-pin in a system-skilled-doctor skill

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
| Q001 | Build a new skill, system-skilled-doctor, that owns the doctor commands for supporting and integrating Skilled into a project, with the overlay ability as one of them, instead of a lone /doctor:overlay command. | It could also include all doctor commands regarding support and integration. | None | spec.md section 7, plan.md |
| Q002 | The overlay folder is a configurable path, set in .skilled-overlays.json at the vendored tree root and defaulting to skilled-overlays/. | Not stated. | None | spec.md section 7, plan.md |
| Q003 | Drop the automatic apply after each overlay edit. The status check and the pre-commit hook catch an unapplied overlay. | Not stated. | None | spec.md section 7, plan.md |
| Q004 | The secret-file guard passes a file only when the manifest names its exact path. | Not stated. | None | spec.md section 7, plan.md |
| Q005 | system-skilled-doctor is one standalone skill, not a parent hub with modes. | Not stated. | None | spec.md section 7, plan.md |
| Q006 | The skill owns install, symlink, update, the new overlay, agents-md, runtime-mirrors, env, setup and helper, plus /doctor:speckit. | Not stated. | None | spec.md section 7, plan.md |
| Q007 | system-skilled-doctor also owns /doctor:mcp, which makes 11 commands. | Not stated. | None | spec.md section 7, plan.md |
| Q008 | Keep both defaults: a re-pin copies changed .skilled paths and whole runtime folders with a repin.exclude list, and the overlay-first rule stays Barter-local. | Not stated. | None | spec.md section 7, plan.md |
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set.

### Q001
<!-- source: claude:2381e5f3-8c4e-4571-be7c-b46c0bf7f162:toolu_01HXM2FjGakAnNRiothup53N:0 -->

Question:
```text
Where should Skilled's vendored-overlay ability live? The Opus review recommends one /doctor:overlay command (status, apply, re-pin with backup and rollback) plus one pre-write guard hook, and no new skill, because no failure came from an agent lacking guidance. You had floated a new system-skilled-setup skill.
```

Options:
```text
/doctor:overlay (Recommended)
New skill + command
Extend /doctor:update
```

Answer:
```text
new skill might be better as it could also include all doctor commands regarding support and integration but skill is better called system-skilled-doctor
```

### Q002
<!-- source: claude:2381e5f3-8c4e-4571-be7c-b46c0bf7f162:toolu_01HXM2FjGakAnNRiothup53N:1 -->

Question:
```text
What should a project's overlay folder be called in the Skilled design? Barter's is skilled/barter-overlays/.
```

Options:
```text
Fixed name (Recommended)
Configurable path
```

Answer:
```text
Configurable path
```

### Q003
<!-- source: claude:2381e5f3-8c4e-4571-be7c-b46c0bf7f162:toolu_01HXM2FjGakAnNRiothup53N:2 -->

Question:
```text
Should Skilled ship the automatic apply that runs after every overlay edit? Barter's runs outside any lock, and the phase runner had to work around it.
```

Options:
```text
Drop it (Recommended)
Ship it lock-aware
```

Answer:
```text
Drop it (Recommended)
```

### Q004
<!-- source: claude:2381e5f3-8c4e-4571-be7c-b46c0bf7f162:toolu_01HXM2FjGakAnNRiothup53N:3 -->

Question:
```text
How should the secret-file guard let a real design-token file such as tokens.css through? Barter currently allows any .css, .ts or .svelte file.
```

Options:
```text
Exact manifest paths (Recommended)
Extension allow list
Rename upstream
```

Answer:
```text
Exact manifest paths (Recommended)
```

### Q005
<!-- source: claude:2381e5f3-8c4e-4571-be7c-b46c0bf7f162:toolu_01AEABMxaufuKQLFy6SYKqDk:0 -->

Question:
```text
Should system-skilled-doctor be one standalone skill or a parent hub with modes? The review recommends standalone. Each doctor command already owns its own workflow, and the sk-create-skill rule allows a hub only when one identity must dispatch to several packets. Overlay knowledge would live in one reference file.
```

Options:
```text
Standalone skill (Recommended)
Two-mode hub now
```

Answer:
```text
Standalone skill (Recommended)
```

### Q006
<!-- source: claude:2381e5f3-8c4e-4571-be7c-b46c0bf7f162:toolu_01AEABMxaufuKQLFy6SYKqDk:1 -->

Question:
```text
Which doctor commands should system-skilled-doctor own? The review proposes nine: install, symlink, update, the new overlay, agents-md (moved from sk-doc), runtime-mirrors, env, setup and helper. sk-code, ci, git, sk-skill, skill-advisor, deep-loop, speckit and mcp stay with their own skills.
```

Options:
```text
Those nine (Recommended)
Nine plus speckit
Only the four core
```

Answer:
```text
Nine plus speckit
```

### Q007
<!-- source: claude:2381e5f3-8c4e-4571-be7c-b46c0bf7f162:toolu_01AEABMxaufuKQLFy6SYKqDk:2 -->

Question:
```text
/doctor:mcp (Code Mode install and debugging) is tagged to system-spec-kit today, though Code Mode belongs to mcp-code-mode. What should happen to it?
```

Options:
```text
Retag, separate change (Recommended)
Into the new skill
Leave as is
```

Answer:
```text
Into the new skill
```

### Q008
<!-- source: claude:2381e5f3-8c4e-4571-be7c-b46c0bf7f162:toolu_01AEABMxaufuKQLFy6SYKqDk:3 -->

Question:
```text
Two defaults in the design you haven't confirmed. First: a re-pin copies only the changed .skilled paths but whole runtime folders, with a repin.exclude list. Second: the overlay-first rule stays Barter-only rather than shipping in Skilled. Keep both?
```

Options:
```text
Keep both (Recommended)
Ship the rule upstream
Whole-tree copy
```

Answer:
```text
Keep both (Recommended)
```

<!-- /ANCHOR:operator-answers-verbatim -->
