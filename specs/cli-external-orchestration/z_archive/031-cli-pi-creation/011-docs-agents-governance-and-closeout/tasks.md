---
title: "Tasks: Pi docs, agents, governance, and closeout"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "cli-pi closeout tasks"
  - "pi governance tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/031-cli-pi-creation/011-docs-agents-governance-and-closeout"
    last_updated_at: "2026-07-27T16:50:00Z"
    last_updated_by: "claude-code"
    recent_action: "All 18 tasks executed and checked off with evidence; whole-packet closeout validated"
    next_safe_action: "None -- terminal phase"
    blockers: []
    key_files: [".opencode/skills/cli-external-orchestration/README.md", "README.md", ".opencode/skills/README.md", ".opencode/agents/deep-improvement.md"]
    session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "cli-pi-creation-authoring", parent_session_id: null }
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Pi docs, agents, governance, and closeout

<!-- SPECKIT_LEVEL: 1 -->

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

- [x] T001 Confirm phases 001-010 have landed by reviewing each phase's `implementation-summary.md` [EVIDENCE: `find .../031-cli-pi-creation/00{1..9}-*/implementation-summary.md .../010-*/implementation-summary.md` -- all 10 present; `grep "| \*\*Status\*\* |" .../*/spec.md` shows 8 Complete + 2 Blocked-with-real-findings (007, 008), no conflicting states]
- [x] T002 [P] Re-run `rg -l 'cli-opencode|cli-claude-code|cli-codex|cli-cursor|cli-devin'` over the touch-list surfaces [EVIDENCE: live grep confirmed hub `SKILL.md`/`mode-registry.json`/`hub-router.json` were ALREADY 6-of-6 (cli-devin included) at implementation time; hub `README.md` was 4-of-6; root `README.md` CROSS-AI was 4-of-6 with 2 catalog rows at 2-of-6; `.opencode/agents/deep-improvement.md` + `.claude/` mirror had zero `cli-devin` hits]
- [x] T003 [P] Cross-check `dispatch-model.cjs`'s `KNOWN_EXECUTORS` [EVIDENCE: `grep -n "KNOWN_EXECUTORS\|case 'cli-pi'" dispatch-model.cjs` -- `KNOWN_EXECUTORS` already contains `cli-pi` (line ~174) and `buildSpawnSpec` has a real `case 'cli-pi':` (line ~480) that throws `cli-pi command construction is unavailable ... until its headless invocation contract is confirmed` -- registered, not fabricated; phase 009's `implementation-summary.md` confirms it added this case]
- [x] T004 Devin-backfill decision: **opportunistic backfill**, applied to all 4 stale surfaces alongside pi [EVIDENCE: rationale recorded in `spec.md` §7 -- hub `SKILL.md`/`mode-registry.json`/`hub-router.json` already fully documented cli-devin at implementation time, so backfilling the hub's own `README.md` + 2 catalog rows is a pure accuracy fix, not new scope]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Add `cli-pi` (+ `cli-devin` backfill) to the hub's own `.opencode/skills/cli-external-orchestration/README.md` [EVIDENCE: `git diff .opencode/skills/cli-external-orchestration/README.md` -- frontmatter description/trigger_phrases (version left at 1.1.0.0 per T004-adjacent decision), tagline "four"->"six", AT A GLANCE 4 rows, OVERVIEW sentence + 2 new bullets, tieBreak sentence (verified against live `hub-router.json`), 2 new QUICK START examples; dispatched via LUNA (`codex exec gpt-5.6-luna xhigh fast`), GLM-5.2 APPROVEd]
- [x] T006 Add `cli-pi` + `cli-devin` to root `README.md` [EVIDENCE: `git diff README.md` -- CROSS-AI bullet list + 2 new bullets (~L922-926), `prompt-models` sentence (~L957, cli-pi reachability for deepseek-v4-pro/minimax-m3/mimo-v2.5-pro verified against `sk-prompt/prompt-models/references/models/_index.md`), skills-catalog row (~L1287) now lists all 6]
- [x] T007 Add `cli-pi` + `cli-devin` to `.opencode/skills/README.md`'s catalog row [EVIDENCE: `git diff .opencode/skills/README.md` -- row now lists all 6 modes with per-mode parentheticals]
- [x] T008 [P] Add `pi` to `deep-improvement.md`'s Lane-B paragraph (both `.opencode/agents/` and `.claude/agents/` copies) [EVIDENCE: T003 confirmed live `dispatch-model.cjs` support; `git diff` on both files shows the identical added clause "...cursor, and pi (currently stubbed pending confirmation of Pi's headless invocation syntax)..."; GLM-5.2 independently verified this phrasing against the real throwing switch-case and judged it honest, non-overclaiming]
- [x] T009 [P] Confirm `AGENTS.md`/`CLAUDE.md` still carry zero per-CLI enumeration [EVIDENCE: `grep -n "cli-opencode\|cli-claude-code\|cli-codex\|cli-cursor\|cli-devin\|cli-pi" AGENTS.md CLAUDE.md` -- 0 matches; only the generic `cli-X` placeholder pattern at lines 62/151 in both files, unchanged, no edit needed]
- [x] T010 Reconcile completion metadata across all 11 phases [EVIDENCE: `grep "| \*\*Status\*\* |" .../00{1..9}-*/spec.md .../010-*/spec.md` -- 8 Complete, 2 Blocked (007 MCP host install, 008 live-session probe), each citing a real, out-of-this-packet's-own-scope blocker; no phase claims a conflicting completion state]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 [P] Cross-check `executor-config.vitest.ts` [EVIDENCE: `grep -n "cli-pi\|EXECUTOR_KINDS" executor-config.vitest.ts` -- `it('defines six executor kinds including cli-pi')` asserts `EXECUTOR_KINDS` has length 6 including `'cli-pi'`; no stale union found]
- [x] T012 [P] Cross-check `executor-audit.vitest.ts` [EVIDENCE: `grep -n "cli-pi" executor-audit.vitest.ts` -- `detectFromAncestry('cli-pi', ...)` and `detectFromRuntimeEnv('cli-pi', ...)` both asserted; no stale exclusion found]
- [x] T013 Confirm `advisor-runtime-values.ts` untouched [EVIDENCE: `git diff -- .opencode/skills/system-skill-advisor/mcp-server/lib/advisor-runtime-values.ts` -- empty; direct read confirms it still reads exactly `['claude', 'copilot', 'opencode']`]
- [x] T014 Confirm `post-implementation-deep-review.md` untouched and executor-agnostic [EVIDENCE: `git diff` empty; direct read confirms `cli-opencode` appears only as a generic dispatch-executor example in prose, no prescriptive default]
- [x] T015 Grep sweep across every T005-T008-identified surface [EVIDENCE: `git diff --stat` scoped to exactly 5 files (`.opencode/skills/cli-external-orchestration/README.md`, `README.md`, `.opencode/skills/README.md`, `.opencode/agents/deep-improvement.md`, `.claude/agents/deep-improvement.md`) plus the mechanically-regenerated `leaf-manifest.json`; `rg -n "cli-pi"` confirms presence in all 5; GLM-5.2's independent review confirmed no stray/out-of-scope edits]
- [x] T016 Run `validate.sh --recursive --strict` on the whole packet [EVIDENCE: see `implementation-summary.md` for the full recorded output; Errors: 0 across the phase-parent and all 11 phase children]
- [x] T017 Run `parent-skill-check.cjs` [EVIDENCE: `node .opencode/commands/doctor/scripts/parent-skill-check.cjs .opencode/skills/cli-external-orchestration` -- initially FAILED on `10b-byte-drift` (leaf-manifest.json stale from phase 009's new reference file, never regenerated); fixed by running the hub's own `generate-leaf-manifest.cjs --write` (mechanical regeneration, not a hand-edit); re-run: "OK: parent-skill-check -- all hard invariants passed, 0 warnings"]
- [x] T018 Author `implementation-summary.md` with final evidence for T001-T017 [EVIDENCE: this document]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]` (T008 resolved as a real edit -- T003 confirmed `dispatch-model.cjs` DOES support `cli-pi`)
- [x] No `[B]` blocked tasks remaining
- [x] `validate.sh --recursive --strict` exits with `Errors: 0`
- [x] `parent-skill-check.cjs` exits 0
- [x] T015's grep sweep confirms `cli-pi` present exactly where T004's decision specifies
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Phase parent**: See `../spec.md`
- **Predecessor**: See `../010-pi-manual-testing-playbook/`
<!-- /ANCHOR:cross-refs -->

---

## RELATED DOCUMENTS
- `spec.md`, `plan.md`, `checklist.md`
- `../../029-cli-devin-revival/007-docs-agents-governance-and-closeout/tasks.md`, `../../030-cli-cursor-creation/007-docs-agents-governance-and-closeout/tasks.md` (sibling closeout precedents)
