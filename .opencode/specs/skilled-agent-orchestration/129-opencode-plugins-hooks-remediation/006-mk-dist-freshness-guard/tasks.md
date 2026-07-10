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
    last_updated_at: "2026-07-10T11:42:16.907Z"
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
    - Source: iteration-1 F1, Opus verdict: adjusted · fix-design: both models agree
    - Fix: The prior audit fix ('treat any hash mismatch as stale regardless of mtime') would REGRESS: on every legitimate rebuild (edit source at T1, build dist at T2>T1) the stored hash still differs from current until the checker re-blesses via the mtime branch we'd be deleting, so it would false-stale every rebuild. The mtime branch is load-bearing. The correct fix is to make the cache authoritative by having the BUILD write it: add a `postbuild` step in each watched package that calls the already-exported `writePackageSourceHashCache`, and tag build-written entries with an origin marker. Then in checkPackageFreshness, a hash mismatch against a build-origin cache => stale; a checker-origin or absent cache => fall back to today's mtime heuristic (bootstrap/degraded, unchanged).
    - REVIEW-FLAG (correct the design before implementing): One-phase postbuild attestation can bless stale output if source changes mid-compile. Use the staged origin-tagged design (O3->O4->F1); prefer a dist content-hash anchor.
    - Verified fix design (both models): see `fix-design/fix-design.md` (F1)
- [ ] T004 [P1 (GPT P1 / Opus P2)] Checker errors are reported as fresh and suppressed by both consumers (`.opencode/skills/system-spec-kit/scripts/lib/dist-freshness.cjs:354`)
    - Source: iteration-1 F2, Opus verdict: confirmed · fix-design: both models agree
    - Fix: Keep execution fail-open but make 'error' a first-class status distinct from fresh, and surface it (bounded, non-blocking) in all three consumers. Adopt the prior fix, adding the standalone check-all CLI aggregation which the prior fix missed.
    - Verified fix design (both models): see `fix-design/fix-design.md` (F2)
- [ ] T005 [P1 (GPT P1 / Opus P2)] OpenCode can retain a fresh cache for two minutes after a source edit (`.opencode/plugins/mk-dist-freshness-guard.js:109`)
    - Source: iteration-1 F3, Opus verdict: adjusted · fix-design: both models agree
    - Fix: Invalidate the cache in tool.execute.before when an editor tool (write/edit/patch/multiedit) targets a watched source file, so the next experimental.chat.system.transform recomputes from the post-write disk state. This aligns OpenCode with the Claude hook, which already re-checks on every Write\|Edit.
    - Verified fix design (both models): see `fix-design/fix-design.md` (F3)
- [ ] T006 [P1 (GPT P1 / Opus P2)] Sequential subprocess timeouts exceed the enclosing Claude hook timeout (`.opencode/skills/sk-code/code-quality/scripts/hooks/claude-posttooluse.sh:68`)
    - Source: iteration-1 F4, Opus verdict: adjusted · fix-design: both models agree
    - Fix: Enforce a single shared monotonic deadline under the 10s hook budget and pass only the remaining budget to each subprocess (reject the 'just raise the timeout' option — the 10s cap is intentional and raising it worsens per-edit latency). Concurrency is a valid alternative but adds Popen/poll complexity to a fail-safe hook; the shared-deadline approach is smaller and guarantees < 10s.
    - Verified fix design (both models): see `fix-design/fix-design.md` (F4)
- [ ] T007 [P1 (GPT P1 / Opus P2)] Valid but malformed Claude hook JSON can crash the fail-safe hook (`.opencode/skills/sk-code/code-quality/scripts/hooks/claude-posttooluse.sh:47`)
    - Source: iteration-1 F5, Opus verdict: confirmed · fix-design: both models agree
    - Fix: Validate types of the root object, tool_input, file_path, and cwd before use, defaulting cwd to os.getcwd(); wrap the whole main body in a top-level fail-open exception boundary so any unforeseen shape still exits 0. Mirror the OpenCode plugin's defensive typeof checks for parity.
    - Verified fix design (both models): see `fix-design/fix-design.md` (F5)

### P2 - minor bugs

- [ ] T008 [P2] Standalone checker fallback resolves one directory too shallow (`.opencode/skills/sk-code/code-quality/scripts/check-dist-staleness.sh:17`)
    - Source: iteration-1 F6, Opus verdict: confirmed · fix-design: both models agree
    - Fix: Correct the parent-traversal count to reach the workspace root (five levels), so line 34's append yields a valid path. Add a test that launches the wrapper from a non-repo-root cwd.
    - Verified fix design (both models): see `fix-design/fix-design.md` (F6)
- [ ] T009 [P2 · Opus-new] Coverage divergence: Claude warns only for the edited file's package; OpenCode warns for ALL stale packages (`.opencode/skills/system-spec-kit/scripts/lib/dist-freshness.cjs:524`)
    - Source: Opus iteration-2 (new) · fix-design: both models agree
    - Fix: Mirror OpenCode's two-trigger model rather than loading every PostToolUse edit with a full 8-package check-all (which would compound F4's timeout pressure). Keep PostToolUse edited-file-scoped (fast, targeted) and add a check-all pass to the Claude SessionStart (or UserPromptSubmit) hook to match OpenCode's session.created + per-turn injection. Document the per-edit scope as intentional.
    - Verified fix design (both models): see `fix-design/fix-design.md` (O1)

### Refinements

- [ ] T010 [refinement] Session deduplication and the audit log have no retention bounds (`.opencode/plugins/mk-dist-freshness-guard.js:88`)
    - Source: iteration-1 F7, Opus verdict: confirmed · fix-design: both models agree
    - Fix: Handle session.deleted (evict the session id) and disposal events (clear the Set) using the canonical event names already used by sibling plugins, and add a documented size-bounded log rotation to appendGuardLog. Plugin-only (the Claude hook is stateless per-invocation and writes no persistent log).
    - Verified fix design (both models): see `fix-design/fix-design.md` (F7)
- [ ] T011 [RECLASSIFIED: by-design] Risky-bash trigger refreshes the cache but surfaces the warning one turn late (`.opencode/plugins/mk-dist-freshness-guard.js:117`)
    - RESOLVED by 4-model review (GPT + Opus designed; Fable 5 + Sol xhigh reviewed) - NO code change. tool.execute.before exposes only {args}; there is no warning channel and stdout is forbidden by the TUI-safety invariant. Doc-only; both models actually converge here.
- [ ] T012 [refinement · Opus-new] Freshness cache is never anchored to dist/build identity, so dist reverts/tampering with unchanged source read as fresh (`.opencode/skills/system-spec-kit/scripts/lib/dist-freshness.cjs:430`)
    - Source: Opus iteration-2 (new) · fix-design: both models agree
    - Fix: Anchor the cache to dist identity: record distMtime (and distSize) alongside sourceHash, and in the fast path require BOTH sourceHash and dist identity to match; on dist-identity mismatch, fall through to the existing mtime path (which will correctly flag a reverted/older dist as stale because source mtime then exceeds the reverted distMtime). This is a self-contained checker-only change (no cross-package build wiring), and it also narrows F1's surface.
    - REVIEW-FLAG (correct the design before implementing): mtime+size is not a tamper identity (content can change while both are preserved, and the finding covers revert/tamper). Store and verify a build content-hash; keep the mtime fallback branch, which is load-bearing.
    - Verified fix design (both models): see `fix-design/fix-design.md` (O3)
- [ ] T013 [refinement · Opus-new] Orphan .tmp cache files accumulate on crash between write and rename (`.opencode/skills/system-spec-kit/scripts/lib/dist-freshness.cjs:267`)
    - Source: Opus iteration-2 (new) · fix-design: both models agree
    - Fix: Best-effort sweep of stale `.dist-freshness-*.*.tmp` siblings older than a short age threshold during writeStoredSourceHash. REJECT the prior fix's alternative of writing to an OS temp dir before rename — the dist dir and os.tmpdir may be on different filesystems, so renameSync would throw EXDEV, a regression.
    - Verified fix design (both models): see `fix-design/fix-design.md` (O4)
- [ ] T014 [refinement · Opus-new] '.json' in SOURCE_EXTENSIONS makes data/config JSON count as watched sources, risking false stale warnings (`.opencode/skills/system-spec-kit/scripts/lib/dist-freshness.cjs:15`)
    - Source: Opus iteration-2 (new) · fix-design: both models agree
    - Fix: Remove '.json' from the default SOURCE_EXTENSIONS. Manifests remain watched via MANIFEST_BASENAMES ({package.json, tsconfig.json, tsconfig.build.json}) in isWatchedSourceFile (line 199), so build-config JSON is still tracked; arbitrary data/config JSON stops being hashed. Packages that genuinely consume other .json as a build input (none identified among the 8) can add an explicit sourceExtensions override.
    - REVIEW-FLAG (correct the design before implementing): UNSAFE AS WRITTEN: removing .json from watched inputs breaks freshness detection - compiled code imports routing-prototypes.json and ground-truth.json. Keep .json watched; instead store a build content-hash (see O3) rather than mtime+size.
    - Verified fix design (both models): see `fix-design/fix-design.md` (O5)

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
