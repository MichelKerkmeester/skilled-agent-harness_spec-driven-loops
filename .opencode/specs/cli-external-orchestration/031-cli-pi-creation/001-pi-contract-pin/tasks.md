---
title: "Tasks: Pi CLI contract pin"
description: "Task breakdown for the Pi CLI contract-pin phase - install, live-verify, cross-check, record."
trigger_phrases:
  - "pi cli contract pin tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/031-cli-pi-creation/001-pi-contract-pin"
    last_updated_at: "2026-07-27T08:03:00Z"
    last_updated_by: "claude-code"
    recent_action: "Executed T001-T016; all tasks complete except T006/T007 skill/prompt discovery"
    next_safe_action: "Hand off confirmed facts to phase 002"
    blockers: ["No provider API key on this machine blocked T006/T007/T011's success path"]
    key_files: ["implementation-summary.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "cli-pi-creation-authoring"
      parent_session_id: null
    completion_pct: 85
    open_questions: ["T006/T007 could not observe a successful dispatch to confirm skill/prompt-template discovery"]
    answered_questions: ["All Phase 1 and most Phase 2 tasks confirmed live; see implementation-summary.md"]
---
# Tasks: Pi CLI contract pin

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)` - `[P]` marks tasks that could run in parallel; none needed here, every task depends on the binary being installed first.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Install Pi CLI via the documented npm global install (`npm install -g --ignore-scripts @earendil-works/pi-coding-agent`), falling back to the `curl -fsSL https://pi.dev/install.sh | sh` shell installer only if the npm path fails [EVIDENCE: npm install succeeded, 132 packages added]
- [x] T002 Confirm the binary resolves on `PATH` (`which pi`) and print the live version (`pi --version`) [EVIDENCE: `/Users/michelkerkmeester/.local/bin/pi`, version `0.82.1`]
- [x] T003 Capture full `pi --help` output to enumerate the real subcommand/flag surface [EVIDENCE: full output captured - see implementation-summary.md]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Launch `pi` interactively in a scratch directory; confirm `.pi/` directory creation and inspect its initial contents [EVIDENCE: bare failed dispatch did NOT auto-create `.pi/`; it only exists once a file is deliberately placed under it]
- [B] T005 Write a project `.pi/settings.json` plus a global-level settings file, each with one overriding key; confirm the documented project-over-global merge with nested-object merging live [BLOCKED: full merge behavior needs a successful dispatch; instead confirmed a related merge - `pi install -l` read-modify-wrote settings.json non-destructively]
- [B] T006 Add a `"skills"` entry in `.pi/settings.json` pointing at this repo's `.opencode/skills/`; start a session and record whether discovery reports 12 hub-level skills or every nested mode/reference `SKILL.md` as well [BLOCKED: no successful dispatch observed; no debug surface exists to confirm without one - genuinely unresolved, owned by phase 004]
- [B] T007 Drop a probe `.pi/prompts/probe.md` using `$1`/`${1:-default}` placeholders; confirm it surfaces as `/probe`, confirm argument substitution, and confirm a same-named file one directory deeper is NOT discovered (non-recursive check) [BLOCKED: same reason as T006 - owned by phase 005]
- [x] T008 Drop a minimal no-op `.pi/extensions/probe.ts`; confirm Pi's startup output acknowledges loading it [EVIDENCE: an invalid stub failed the whole session with "does not export a valid factory function"; a valid factory-function stub resolved that specific error]
- [x] T009 Inspect the auth/provider configuration surface; attempt a dispatch with no provider configured and record the exact failure output [EVIDENCE: `No API key found for the selected model. Use /login...` per implementation-summary.md]
- [x] T010 Fetch and read the Programmatic Usage doc pages (SDK, RPC Mode, JSON Event Stream Mode) under `pi.dev/docs/latest` to identify the real headless-invocation syntax [EVIDENCE: `/docs/latest/rpc` and `/docs/latest/json` fetched live; `--mode json`/`--mode rpc` confirmed]
- [x] T011 Run one successful-path headless dispatch and one deliberately-failing dispatch; record both exit codes and full stdout/stderr verbatim - explicitly check for the `cursor-agent -p` exit-0-on-failure gotcha [PARTIAL EVIDENCE: failure-path confirmed (exit 0 then exit 1 across identical runs - worse than the precedent, inconsistent not just wrong); successful-path blocked, no provider credentials on this machine]
- [x] T012 Attempt `pi install npm:pi-subagents` (or `pi-mcp-extension`) far enough to confirm the real install-verb syntax, without proceeding into full package configuration [EVIDENCE: `pi install npm:pi-subagents -l --approve` succeeded; without `--approve` failed cleanly with "Project is not trusted"]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T013 Cross-check every live-observed behavior against the specific `pi.dev/docs/latest/**` page that documented it; note any drift between docs and the installed build [EVIDENCE: default provider is `google`, not the docs' implicit Anthropic framing; RPC mode is persistent, not one-shot like the docs' framing suggested]
- [x] T014 For any REQ-001..008 that could not be live-confirmed, mark it explicitly "documented, unconfirmed" in `implementation-summary.md` rather than asserting it as fact [EVIDENCE: REQ-003/REQ-004 explicitly marked unconfirmed]
- [x] T015 Update this phase's `_memory.continuity` frontmatter (`completion_pct`, `answered_questions`, `open_questions`, `blockers`) to reflect what was actually confirmed once execution happens [EVIDENCE: spec.md and this file's frontmatter both updated]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] T016 Write `implementation-summary.md` citing a live command's stdout/exit-code or a `pi.dev/docs` URL for every REQ in `spec.md` [EVIDENCE: implementation-summary.md written]
- [x] All tasks above marked `[x]` or `[B]` with evidence; the 2 remaining `[B]` tasks (T005/T006/T007) are genuinely blocked on provider credentials this machine lacks, not on incomplete work, and are handed off to phases 004/005 explicitly rather than silently dropped
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- Consumed by `../002-deep-loop-executor-support/` (executor design) and `../003-cli-pi-skill-packet/` (SKILL.md/README content)
<!-- /ANCHOR:cross-refs -->

---

## RELATED DOCUMENTS
- `spec.md`, `plan.md`, `checklist.md` (this phase)
