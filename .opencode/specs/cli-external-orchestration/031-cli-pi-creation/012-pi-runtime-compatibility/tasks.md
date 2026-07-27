---
title: "Tasks: Pi runtime compatibility (prompts, agents, extensions)"
description: "Task breakdown for building sync-prompts-pi.cjs, sync-agents-pi.cjs, and .pi/extensions/*.ts."
trigger_phrases: ["pi runtime compatibility tasks"]
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/031-cli-pi-creation/012-pi-runtime-compatibility"
    last_updated_at: "2026-07-27T18:32:00Z"
    last_updated_by: "claude-code"
    recent_action: "All tasks executed with live evidence; GLM APPROVE WITH MINOR NOTES, all 3 addressed"
    next_safe_action: "Commit phase 012; author phase 013's playbook next"
    blockers: []
    key_files: [".opencode/skills/system-spec-kit/scripts/pi/"]
    session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "cli-pi-creation-authoring", parent_session_id: null }
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Pi runtime compatibility (prompts, agents, extensions)

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

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Re-confirm live counts [EVIDENCE: 36 commands, 13 agents confirmed via direct `find`; `.pi/` state confirmed (mcp.json/settings.json/npm/ with pi-mcp-extension present)]
- [x] T002 [P] Read `sync-prompts.cjs`/`sync-agents.cjs` in full [EVIDENCE: reused discovery-walk/exclusion-set/`--check`-write pattern verbatim in both new scripts]
- [x] T003 [P] Re-read 005/006's syntax/schema docs [EVIDENCE: confirmed `$ARGUMENTS` IS a real documented Pi token (equivalent to `$@`) via a live WebFetch of pi.dev/docs/latest/prompt-templates during review -- corrects an initial concern that it wasn't]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Author `sync-prompts-pi.cjs`; generate 36 stubs [EVIDENCE: `[pi-prompt-sync] PASS: 36 prompts are in sync.`]
- [x] T005 Author `sync-agents-pi.cjs`; generate 13 files [EVIDENCE: `[pi-agent-sync] PASS: 13 agents are in sync.`; hardened post-GLM-review with a name-traversal guard and an always-explicit `tools:` key, re-verified `Wrote 0 of 13` (byte-identical, pure defensive hardening)]
- [x] T006 Author `.pi/extensions/*.ts` (7 of 8 planned guard cores; task-dispatch-guard explicitly skipped, its own prerequisite unresolved) [EVIDENCE: `spec-gate-enforce.ts`, `spec-gate-classify.ts`, `dispatch-preflight-lint.ts`, `dispatch-audit.ts`, `post-edit-quality.ts`, `code-graph-freshness.ts`, `mcp-route-guard.ts`; every guard-core function call independently confirmed real via `grep` (both by me and, independently, by GLM-5.2)]
- [x] T007 [P] Author `scripts/pi/README.md` [EVIDENCE: `git status` confirms file created, mirrors `codex/README.md`'s shape]
- [x] T008 [P] Add the `.pi/agents/**/*.md` convention to `cli-pi/references/agent-delegation.md` [EVIDENCE: `git diff` shows a new §2A section, no unrelated rewrite]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Live-dispatch verification [EVIDENCE: `pi --offline --approve -p "list your available tools"` completed exit 0 with all 36 prompts/13 agents/7 extensions present -- no startup error, the same class of check phase 001 established (an invalid file fails the whole session)]
- [x] T010 Live-parse-check `.pi/agents/*.md` [EVIDENCE: same live session -- `pi-subagents`' own tools (`subagent`, `subagent_wait`, `subagent_supervisor`, `intercom`) appeared, confirming the package + project agent files loaded without a schema error]
- [x] T011 Live-load extensions [EVIDENCE: `pi --offline --approve -p "list your available tools"` exit code 0, no extension-load crash]
- [x] T012 GLM-5.2 independent review [EVIDENCE: verdict APPROVE WITH MINOR NOTES; GLM independently re-verified all 17 guard-core export names AND their call-argument shapes against real function signatures, going beyond what was asked; 0 blocking findings; 3 actionable minor findings addressed (name-traversal guard, always-explicit `tools:` key, an alias-assumption comment), 2 informational (non-atomic writes, depth-coupled REPO_ROOT) left as-is per GLM's own "non-blocking" severity]
- [x] T013 Regression-guard confirmation [EVIDENCE: `git status --porcelain` shows zero `.codex/`, `.cursor/`, `.devin/`, `.opencode/agents/`, or `.opencode/commands/` files touched]
- [x] T014 Metadata round-trip + `validate.sh --strict` [EVIDENCE: see `implementation-summary.md`]
- [x] T015 Author `implementation-summary.md` [EVIDENCE: this document]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]` with real evidence
- [x] No `[B]` blocked tasks remaining
- [x] `validate.sh --strict` exits with `Errors: 0` for this phase folder
- [x] GLM-5.2 review completed, findings addressed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- Depends on `../005-pi-command-layer/`, `../006-pi-agent-bridge/`, `../008-pi-hook-extension-layer/`
- Feeds `../013-pi-manual-testing-playbook-authoring/` (exercises this phase's artifacts)
<!-- /ANCHOR:cross-refs -->

---

## RELATED DOCUMENTS
- `spec.md`, `plan.md`, `checklist.md`
