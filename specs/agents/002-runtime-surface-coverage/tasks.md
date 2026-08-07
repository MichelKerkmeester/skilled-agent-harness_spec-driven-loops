---
title: "Tasks: Runtime Surface Coverage"
description: "Phase 1: P1 contract fixes. Phase 2: P2 soft-gap docs. Phase 3: regeneration + verification."
trigger_phrases:
  - "runtime surface coverage"
  - "six runtime surfaces"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "agents/002-runtime-surface-coverage"
    last_updated_at: "2026-08-04T06:30:00Z"
    last_updated_by: "pi-main-agent"
    recent_action: "Task list written"
    next_safe_action: "Start T001"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-04-agents-002"
      parent_session_id: null
    completion_pct: 5
    open_questions:
      - "Should Devin MCP registration be added? Default: remain absent"
    answered_questions:
      - "copilot is deprecated (user decision 2026-08-04)"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Runtime Surface Coverage

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

**P1 contract fixes**

- [ ] T001 Update AGENTS.md MCP registration note, hook-capable runtimes line, agent-directory resolution table (AGENTS.md)
- [x] T002 [P] Replace CLAUDE.md with a symlink to AGENTS.md — done 2026-08-04 (diff was 82 lines of drift; 7 stale CLAUDE-only lines verified older variants of AGENTS.md text) (CLAUDE.md)
  - [evidence: `readlink CLAUDE.md` → `AGENTS.md`; `diff CLAUDE.md AGENTS.md` exits 0; pre-change `diff AGENTS.md CLAUDE.md` reported 82 lines with only 7 stale CLAUDE-only lines]
- [ ] T003 Update advisor runtime enum: include codex/cursor/devin/pi, remove deprecated copilot, with policy note (system-skill-advisor/mcp-server/lib/advisor-runtime-values.ts)
- [ ] T004 [P] Update enum dependents: metrics.ts, advisor-tool-schemas.ts, skill-advisor-cli-manifest.ts, advisor-validate.ts (system-skill-advisor/mcp-server/)
- [ ] T005 [P] Update runtime-parity.vitest.ts to the real runtime set; run vitest (system-skill-advisor/tests/hooks/runtime-parity.vitest.ts)
- [ ] T006 Extend AGENT_DIRS + RUNTIME_DIR_ALLOWLIST with .cursor/.pi/.devin; handle Devin nested AGENT.md + Codex TOML (commands/scripts/validate-command-references.cjs)
- [ ] T007 Rewrite orchestrator runtime-path guidance for six paths (agents/orchestrate.md)
- [ ] T008 Regenerate Codex + Pi agent mirrors from canonical; verify Cursor/Devin symlinks intact (generated files)
- [ ] T009 Update README.md conductor list + agent-network topology (README.md)
- [x] T023 [P] Apply the same three runtime fixes to Barter's coder framework (Barter/ai-speckit/coder/AGENTS.md) — done 2026-08-04, barter/sk-code/sk-git sections untouched
  - [evidence: six-runtime table rows present; `grep -n '(Claude, Codex, Gemini'` returns 0; MCP note states no .codex/.pi/.cursor/.devin registration; sk-code §8.3 and sk-git §8.4 headings intact]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

**P2 soft-gap docs**

- [ ] T010 Add Pi native-extension path to hook-system reference (system-spec-kit/references/config/hook-system.md)
- [ ] T011 Add Pi row + adapter to skill-advisor docs (system-skill-advisor SKILL.md, README.md, hooks/skill-advisor-hook.md, references/hooks/skill-advisor-hook.md)
- [ ] T012 Document Cursor dispatch asymmetry (hooks/dispatch/README.md)
- [ ] T013 Update agent-authoring docs to two-dialect + derived-surface model (sk-doc/sk-create-agent/**, sk-code agent-authoring checklist)
- [ ] T014 Update deep-loop runtime scans + mirror counts (system-deep-loop/runtime/README.md, deep-improvement/**)
- [ ] T015 Fix runtime counts in .claude/SYNC.md, .cursor/SYNC.md, .devin/SYNC.md, .codex/SYNC.md
- [ ] T016 Fix "five runtimes" claims in doctor script header + README (commands/doctor/scripts/)
- [ ] T017 Fix "all three runtime configs" in ENV-REFERENCE.md (system-spec-kit/mcp-server/ENV-REFERENCE.md)
- [ ] T018 Fix "all three runtimes" in sk-git CI doc (sk-git/references/continuous-integration.md)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T019 Run vitest + validate-command-references.cjs + agent-roster-mirror-check.cjs
- [ ] T020 Repo-wide grep sweep for stale enumerations (exclude z_archive + completed specs)
- [ ] T021 Verify no Devin MCP claims added (grep)
- [ ] T022 Run validate.sh --strict on this packet; mark checklist with evidence
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] All Phase 3 verification gates passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
