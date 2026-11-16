---
title: "Decision Record: Phase 6: codex-check-and-advisory-fixes"
description: "Operator decisions and their verbatim answers for this packet."
trigger_phrases:
  - "006-codex-check-and-advisory-fixes operator decisions"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/hook-platform/008-hook-library-cleanup-and-readme-rewrite/006-codex-check-and-advisory-fixes"
    last_updated_at: "2026-11-16T09:52:16.335Z"
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
# Decision Record: Phase 6: codex-check-and-advisory-fixes

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
| Q001 | Fix the read-only Codex check in a linked worktree in a new phase 6, with a test. | Not stated. | None | REQ-001, REQ-002, T003 |
| Q002 | Keep the OpenCode plugin name prefixes, so no registered plugin id changes. | Not stated. | None | spec.md Out of Scope |
| Q003 | Run both spec-kit Vitest suites without the alias and remove it only if the counts match. | Not stated. | None | REQ-004, T007 |
| Q004 | Run the Pi and DSH advisories to confirm the OK-line warning, and fix it only if it is real. | Not stated. | None | REQ-003, T001, T004, T005 |
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set.

### Q001
<!-- source: claude:a4c37e98-2c3a-4c20-a7bf-acbc32e31f29:toolu_01PiLRzSdCM5y2AJhVi6XVkH:0 -->

Question:
```text
`install-codex-hooks.mjs --check` exits 1 when run from a linked worktree, because the repo-anchor guard treats a worktree as unsafe even for a read-only check. Fixing it means passing `args.check` through `assertSafeRepoAnchor`, so a worktree session would stop warning at start. What should I do?
```

Options:
```text
Fix in phase 006 (Recommended)
Leave it
```

Answer:
```text
Fix in phase 006 (Recommended)
```

### Q002
<!-- source: claude:a4c37e98-2c3a-4c20-a7bf-acbc32e31f29:toolu_01PiLRzSdCM5y2AJhVi6XVkH:1 -->

Question:
```text
Each OpenCode plugin's file name is its registered plugin id, so renaming the plugin prefixes to match the new hook folder names would change those ids. What should happen to the prefixes?
```

Options:
```text
Keep the names (Recommended)
Rename them
```

Answer:
```text
Keep the names (Recommended)
```

### Q003
<!-- source: claude:a4c37e98-2c3a-4c20-a7bf-acbc32e31f29:toolu_01PiLRzSdCM5y2AJhVi6XVkH:2 -->

Question:
```text
Two spec-kit Vitest configs (`system-spec-kit/vitest.config.ts` and `system-spec-kit/runtime/vitest.config.ts`) still hold the alias I removed from the hooks config. It looks unused now, but no test run has proven that. What should I do?
```

Options:
```text
Prove, then remove (Recommended)
Leave it
```

Answer:
```text
Prove, then remove (Recommended)
```

### Q004
<!-- source: claude:a4c37e98-2c3a-4c20-a7bf-acbc32e31f29:toolu_01PiLRzSdCM5y2AJhVi6XVkH:3 -->

Question:
```text
The investigation inferred, without running it, that the Pi and DSH session-start advisories may show a false warning every session because they misread the `--check` output "OK". What should I do?
```

Options:
```text
Run it, fix if real (Recommended)
Leave it
```

Answer:
```text
Run it, fix if real (Recommended)
```

<!-- /ANCHOR:operator-answers-verbatim -->
