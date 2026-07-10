---
title: "Tasks: mk-dist-freshness-guard remediation"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "mk-dist-freshness-guard remediation"
  - "mk-dist-freshness-guard fixes"
  - "mk-dist-freshness-guard bug fixes"
  - "opencode plugin remediation"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/129-opencode-plugins-hooks-remediation/006-mk-dist-freshness-guard"
    last_updated_at: "2026-07-10T09:27:08.451Z"
    last_updated_by: "gpt-5.6-sol-fast-audit"
    recent_action: "Enumerated 12 fix tasks"
    next_safe_action: "Implement P1 tasks first"
    blockers: []
    key_files:
      - ".opencode/plugins/mk-dist-freshness-guard.js"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "plugin-remediation-128"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: mk-dist-freshness-guard remediation

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
- [ ] T001 Capture a green baseline of the mk-dist-freshness-guard test suite before any change
- [ ] T002 Confirm each targeted finding reproduces against current code
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### P1 - correctness / silent-breakage

- [ ] T003 [P1 (GPT P1 / Opus P2)] A source-hash mismatch can be silently blessed as fresh (`.opencode/skills/system-spec-kit/scripts/lib/dist-freshness.cjs:430`)
    - Source: iteration-1 F1, Opus verdict: adjusted
    - Fix: Have every watched build write the source hash after successful compilation, and treat a mismatch against an existing build-written hash as stale regardless of mtimes. If first-run bootstrapping is required, represent it as unknown/degraded rather than updating the cache from a read-only check.
- [ ] T004 [P1 (GPT P1 / Opus P2)] Checker errors are reported as fresh and suppressed by both consumers (`.opencode/skills/system-spec-kit/scripts/lib/dist-freshness.cjs:354`)
    - Source: iteration-1 F2, Opus verdict: confirmed
    - Fix: Keep execution fail-open, but aggregate errors into a degraded/error status distinct from fresh. Log and inject a bounded CHECK ERROR message in OpenCode, and emit an actionable warning from the Claude wrapper while still exiting 0.
- [ ] T005 [P1 (GPT P1 / Opus P2)] OpenCode can retain a fresh cache for two minutes after a source edit (`.opencode/plugins/mk-dist-freshness-guard.js:109`)
    - Source: iteration-1 F3, Opus verdict: adjusted
    - Fix: Invalidate staleCache when a write/edit/apply-patch operation targets a watched source, then force the next system transform to refresh. If an after-execution hook is available, run checkFileFreshness there for direct parity with Claude.
- [ ] T006 [P1 (GPT P1 / Opus P2)] Sequential subprocess timeouts exceed the enclosing Claude hook timeout (`.opencode/skills/sk-code/code-quality/scripts/hooks/claude-posttooluse.sh:68`)
    - Source: iteration-1 F4, Opus verdict: adjusted
    - Fix: Use one monotonic deadline and pass only the remaining budget to each subprocess, run independent checks concurrently, or increase the enclosing timeout beyond the combined worst-case duration with startup overhead.
- [ ] T007 [P1 (GPT P1 / Opus P2)] Valid but malformed Claude hook JSON can crash the fail-safe hook (`.opencode/skills/sk-code/code-quality/scripts/hooks/claude-posttooluse.sh:47`)
    - Source: iteration-1 F5, Opus verdict: confirmed
    - Fix: Validate that the root and tool_input are dictionaries and cwd/file_path are strings before use, falling back to os.getcwd() where needed. Add a top-level fail-open exception boundary and malformed-shape regression tests.

### P2 - minor bugs

- [ ] T008 [P2] Standalone checker fallback resolves one directory too shallow (`.opencode/skills/sk-code/code-quality/scripts/check-dist-staleness.sh:17`)
    - Source: iteration-1 F6, Opus verdict: confirmed
    - Fix: Traverse five parent directories to the workspace root, or derive the shared checker path from the script location without re-appending .opencode ambiguously. Add a test that launches the wrapper from an unrelated cwd.
- [ ] T009 [P2 · Opus-new] Coverage divergence: Claude warns only for the edited file's package; OpenCode warns for ALL stale packages (`.opencode/skills/system-spec-kit/scripts/lib/dist-freshness.cjs:524`)
    - Source: Opus iteration-2 (new)
    - Fix: Give the Claude PostToolUse path a check-all pass (or additionally run check-all) so cross-package staleness surfaces there too, or document the intentional 'edited-file-scoped' contract and align expectations.

### Refinements

- [ ] T010 [refinement] Session deduplication and the audit log have no retention bounds (`.opencode/plugins/mk-dist-freshness-guard.js:88`)
    - Source: iteration-1 F7, Opus verdict: confirmed
    - Fix: Delete session IDs on session.deleted, clear state on process-disposal events, and apply a small entry-count or size bound. Rotate or truncate the log at a documented maximum while preserving recent audit evidence.
- [ ] T011 [refinement · Opus-new] Risky-bash trigger refreshes the cache but surfaces the warning one turn late (`.opencode/plugins/mk-dist-freshness-guard.js:117`)
    - Source: Opus iteration-2 (new)
    - Fix: If OpenCode's tool.execute.before can annotate output or short-circuit, surface the stale brief at dispatch time; otherwise document that the warning is next-turn and by design.
- [ ] T012 [refinement · Opus-new] Freshness cache is never anchored to dist/build identity, so dist reverts/tampering with unchanged source read as fresh (`.opencode/skills/system-spec-kit/scripts/lib/dist-freshness.cjs:430`)
    - Source: Opus iteration-2 (new)
    - Fix: Record dist identity (mtime or content hash of distEntry) alongside sourceHash in the cache and invalidate 'fresh' when the recorded dist identity no longer matches; ideally have builds write the cache post-compile.
- [ ] T013 [refinement · Opus-new] Orphan .tmp cache files accumulate on crash between write and rename (`.opencode/skills/system-spec-kit/scripts/lib/dist-freshness.cjs:267`)
    - Source: Opus iteration-2 (new)
    - Fix: On startup or in writeStoredSourceHash, best-effort unlink stale `*.tmp` siblings, or write to an OS temp dir before rename.
- [ ] T014 [refinement · Opus-new] '.json' in SOURCE_EXTENSIONS makes data/config JSON count as watched sources, risking false stale warnings (`.opencode/skills/system-spec-kit/scripts/lib/dist-freshness.cjs:15`)
    - Source: Opus iteration-2 (new)
    - Fix: Restrict '.json' watching to manifest basenames plus build-relevant config JSON, or add sourceExtensions/excludedSegments overrides (or an explicit data-dir exclusion) for packages that ship non-compiled JSON like system-skill-advisor's 'data'.

<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
- [ ] T015 Re-run the mk-dist-freshness-guard test suite; confirm green
- [ ] T016 Verify each fixed finding no longer reproduces
- [ ] T017 Verify OpenCode<->Claude parity for this plugin
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
- **Audit findings**: See `../../127-opencode-plugins-hooks-audit/006-mk-dist-freshness-guard/review/`
- **Parent**: See `../spec.md`
<!-- /ANCHOR:cross-refs -->
