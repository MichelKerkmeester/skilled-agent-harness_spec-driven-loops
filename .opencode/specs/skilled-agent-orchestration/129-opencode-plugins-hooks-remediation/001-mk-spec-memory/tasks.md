---
title: "Tasks: mk-spec-memory remediation"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "mk-spec-memory remediation"
  - "mk-spec-memory fixes"
  - "mk-spec-memory bug fixes"
  - "opencode plugin remediation"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/129-opencode-plugins-hooks-remediation/001-mk-spec-memory"
    last_updated_at: "2026-07-10T11:42:16.907Z"
    last_updated_by: "gpt-5.6-sol-fast-audit"
    recent_action: "Enumerated 19 fix tasks"
    next_safe_action: "Implement P1 tasks first"
    blockers: []
    key_files:
      - ".opencode/plugins/mk-spec-memory.js"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "plugin-remediation-128"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: mk-spec-memory remediation

<!-- SPECKIT_LEVEL: 1 -->
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

**Task Format**: `T### [P?] Description (file path)`. Each task carries its source finding id, severity, and the audit's proposed fix.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
- [ ] T001 Capture a green baseline of the mk-spec-memory test suite before any change
- [ ] T002 Confirm each targeted finding reproduces against current code
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### P1 - correctness / silent-breakage

- [ ] T003 [P1 (GPT P1 / Opus P2)] A placeholder Session Continuity section suppresses real warm recovery (`.opencode/skills/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:289-354`)
    - Source: iteration-1 F1, Opus verdict: confirmed · fix-design: both models agree
    - Fix: Reserve the 'Session Continuity' title for genuinely-recovered continuity payload; make the resume pointer use a non-suppressing title so the warm CLI fallback still runs and appends real continuity.
    - Verified fix design (both models): see `fix-design/fix-design.md` (F1)
- [ ] T004 [P1 (GPT P1 / Opus P2)] The autosave fallback reports deferred without performing or queuing a save (`.opencode/skills/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:104-127`)
    - Source: iteration-1 F2, Opus verdict: confirmed · fix-design: both models agree
    - Fix: Make the reported outcome truthful: a read-only reachability probe is not a save. Either return the real primaryOutcome (skipped/failed), or persist a durable retry record so 'deferred' becomes true.
    - Verified fix design (both models): see `fix-design/fix-design.md` (F2)
- [ ] T005 [P1 (GPT P1 / Opus P2)] PreCompact tailing reads the entire transcript synchronously (`.opencode/skills/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:41-48`)
    - Source: iteration-1 F4, Opus verdict: confirmed · fix-design: both models agree
    - Fix: Bounded backward tail read: read only a byte window from EOF and expand backward until N lines (or file start) are obtained.
    - Verified fix design (both models): see `fix-design/fix-design.md` (F4)
- [ ] T006 [P1 (GPT P1 / Opus P2)] The PreCompact workload is not bounded by HOOK_TIMEOUT_MS (`.opencode/skills/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:383-445`)
    - Source: iteration-1 F5, Opus verdict: confirmed · fix-design: both models agree
    - Fix: Impose one end-to-end deadline (shared budget) over the post-stdin workload and guarantee a bounded legacy cache is persisted before the external 3s cutoff.
    - Verified fix design (both models): see `fix-design/fix-design.md` (F5)
- [ ] T007 [P1 (GPT P1 / Opus P2)] The cached payload contract does not describe the payload being cached (`.opencode/skills/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:304-331`)
    - Source: iteration-1 F6, Opus verdict: confirmed · fix-design: both models agree
    - Fix: Produce text and payloadContract from a single merge and add every surfaced section to that same envelope before caching.
    - REVIEW-FLAG (correct the design before implementing): Appending surfaced sections to an already-built envelope is insufficient because the emitter truncates the string independently downstream; account for the truncation, not just the append.
    - Verified fix design (both models): see `fix-design/fix-design.md` (F6)
- [ ] T008 [P1 (GPT P1 / Opus P2)] Producer metadata can identify an older transcript generation than the parsed bytes (`.opencode/skills/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:375-406`)
    - Source: iteration-1 F7, Opus verdict: confirmed · fix-design: both models agree
    - Fix: Fingerprint the transcript state as of parse completion: re-stat after parseTranscript and reconcile.
    - REVIEW-FLAG (correct the design before implementing): The selected re-stat-after-parse fix is a mitigation, not a fix - it still races (bytes can be appended after parseTranscript returns). Use the fd + endOffset snapshot-parse design instead.
    - Verified fix design (both models): see `fix-design/fix-design.md` (F7)
- [ ] T009 [P1 (GPT P1 / Opus refinement)] UserPromptSubmit launches its child without timeout or output bounds (`.opencode/skills/system-spec-kit/mcp_server/hooks/claude/user-prompt-submit.ts:13-18`)
    - Source: iteration-1 F8, Opus verdict: adjusted · fix-design: both models agree
    - Fix: Bound the child (timeout below outer 3s, capped output, capped input) and classify failures into a safe emit.
    - Verified fix design (both models): see `fix-design/fix-design.md` (F8)
- [ ] T010 [P1 (GPT P1 / Opus P2)] OpenCode and Claude inject continuity at materially different lifecycle points (`.opencode/plugins/mk-spec-memory.js:404-436`)
    - Source: iteration-1 F9, Opus verdict: confirmed · fix-design: both models agree
    - Fix: Write a shared lifecycle contract that names, per runtime, where continuity is (a) recovered and (b) persisted, and converge on the intersection both runtimes can support rather than bolting Claude-style PreCompact/Stop machinery onto OpenCode's plugin API.
    - Verified fix design (both models): see `fix-design/fix-design.md` (F9)
- [ ] T011 [P1 (GPT P1 / Opus refinement)] Claude executes generated dist hooks without enforcing source freshness (`.claude/settings.json:32`)
    - Source: iteration-1 F10, Opus verdict: adjusted · fix-design: both models agree
    - Fix: Immediate: rebuild and commit the dist so it matches source. Structural: add a lightweight, fail-open source/dist freshness diagnostic — never a hard block that could break sessions.
    - Verified fix design (both models): see `fix-design/fix-design.md` (F10)

### P2 - minor bugs

- [ ] T012 [P2] Session invalidation does not invalidate an in-flight continuity lookup (`.opencode/plugins/mk-spec-memory.js:350-369`)
    - Source: iteration-1 F11, Opus verdict: confirmed · fix-design: both models agree
    - Fix: Tag each lookup with a per-session generation captured at start; on invalidation bump the generation and drop the matching in-flight entry; after await, only cache if the generation is unchanged.
    - Verified fix design (both models): see `fix-design/fix-design.md` (F11)
- [ ] T013 [P2 (GPT P2 / Opus refinement)] Configuration parse and read failures are completely silent (`.opencode/plugins/mk-spec-memory.js:42-49`)
    - Source: iteration-1 F12, Opus verdict: confirmed · fix-design: both models agree
    - Fix: Return config data plus a sanitized status/error code; store it on state and expose it via the status tool without writing to the TUI (stdout).
    - Verified fix design (both models): see `fix-design/fix-design.md` (F12)
- [ ] T014 [P2] Marker deduplication rejects otherwise valid text parts with extra fields (`.opencode/skills/system-spec-kit/mcp_server/plugin_bridges/spec-kit-opencode-message-schema.mjs:114-121`)
    - Source: iteration-1 F13, Opus verdict: confirmed · fix-design: both models agree
    - Fix: Use a minimal passthrough schema (or direct field checks) for marker INSPECTION while keeping the strict schema for CREATION of new parts.
    - Verified fix design (both models): see `fix-design/fix-design.md` (F13)
- [ ] T015 [P2 · Opus-new] runBridge never attaches a child.stdin 'error' handler — early-exiting bridge yields unhandled EPIPE (`.opencode/plugins/mk-spec-memory.js:329`)
    - Source: Opus iteration-2 (new) · fix-design: both models agree
    - Fix: Swallow stdin write errors exactly as the other streams are swallowed.
    - Verified fix design (both models): see `fix-design/fix-design.md` (O1)
- [ ] T016 [P2 · Opus-new] runBridge accumulates bridge stdout with no size cap (parity gap vs Claude spawnSync maxBuffer) (`.opencode/plugins/mk-spec-memory.js:296-298`)
    - Source: Opus iteration-2 (new) · fix-design: both models agree
    - Fix: Cap accumulated stdout at a byte ceiling; on overflow, kill the child and resolve fail_open with an OVERFLOW code, matching Claude's maxBuffer semantics.
    - Verified fix design (both models): see `fix-design/fix-design.md` (O2)
- [ ] T017 [P2 · Opus-new] PreCompact performs unbounded synchronous authored-snapshot disk writes before any cache is persisted (`.opencode/skills/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:401-415`)
    - Source: Opus iteration-2 (new) · fix-design: both models agree
    - Fix: Persist the compact cache first (critical path), then run the snapshot best-effort under a remaining-budget deadline; the cache does not depend on the snapshot.
    - Verified fix design (both models): see `fix-design/fix-design.md` (O3)

### Refinements

- [ ] T018 [refinement · Opus-new] UserPromptSubmit shim has no top-level try/catch; a stdin-read throw drops the safe '{}' default (`.opencode/skills/system-spec-kit/mcp_server/hooks/claude/user-prompt-submit.ts:13-31`)
    - Source: Opus iteration-2 (new) · fix-design: both models agree
    - Fix: Wrap the read+spawn+emit in try/catch and always emit exactly one '{}\n' on any failure.
    - Verified fix design (both models): see `fix-design/fix-design.md` (O4)
- [ ] T019 [refinement · Opus-new] Stop hook re-runs autosave against pre-existing state when no patch was produced (`.opencode/skills/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:564-571`)
    - Source: Opus iteration-2 (new) · fix-design: both models agree
    - Fix: Gate autosave on a fresh save produced THIS run (a newly extracted summary), not merely on the presence of any prior state.
    - Verified fix design (both models): see `fix-design/fix-design.md` (O5)
- [ ] T020 [refinement · Opus-new] OpenCode invalidates continuity cache on every message/session event, largely defeating the 5s TTL cache (`.opencode/plugins/mk-spec-memory.js:427-430`)
    - Source: Opus iteration-2 (new) · fix-design: both models agree
    - Fix: Invalidate only on genuine session-boundary/state-changing events and rely on the 5s TTL (plus the F11 generation guard) for intra-session freshness.
    - Verified fix design (both models): see `fix-design/fix-design.md` (O6)
- [ ] T021 [refinement · Opus-new] appendContinuityBrief dedupe compares a clamped brief with includes(), so a prior full brief can be re-injected (`.opencode/plugins/mk-spec-memory.js:411-413`)
    - Source: Opus iteration-2 (new) · fix-design: both models agree
    - Fix: Dedupe on a stable marker/hash of the un-clamped brief rather than substring-matching the clamped text.
    - Verified fix design (both models): see `fix-design/fix-design.md` (O7)

<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
- [ ] T022 Re-run the mk-spec-memory test suite; confirm green
- [ ] T023 Verify each fixed finding no longer reproduces
- [ ] T024 Verify OpenCode<->Claude parity for this plugin
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria
- [ ] All P1 tasks `[x]`
- [ ] P2 + refinements applied or deferred with rationale
- [ ] Plugin tests green; no `[B]` blocked tasks
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Audit findings**: See `../../127-opencode-plugins-hooks-audit/001-mk-spec-memory/review/`
- **Parent**: See `../spec.md`
<!-- /ANCHOR:cross-refs -->
