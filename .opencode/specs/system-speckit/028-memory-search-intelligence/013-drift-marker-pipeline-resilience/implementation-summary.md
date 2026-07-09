---
title: "Implementation Summary: Drift-Marker Producer/Consumer Resilience"
description: "F3 (stale-lock reclaim) and F4 (live DB-path-aware marker location) both implemented in memory-drift-marker.sh and verified with real repro tests, including the two adversarial-review-verified SIGKILL and cross-process consumer-match scenarios."
trigger_phrases:
  - "drift marker pipeline resilience"
  - "stale lock breaking git hook"
  - "memory drift marker path divergence"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/013-drift-marker-pipeline-resilience"
    last_updated_at: "2026-07-09T19:20:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Implemented F3+F4, verified via 9 real tests + 32 vitest, validate.sh --strict passed"
    next_safe_action: "None -- packet complete"
    blockers: []
    key_files:
      - ".opencode/scripts/git-hooks/lib/memory-drift-marker.sh"
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-028-013-drift-marker-pipeline-resilience"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Stale-lock staleness threshold: resolved to 30-60 seconds via real SIGKILL-mid-acquisition testing (spec.md §10 Resolved Questions); implemented as LOCK_STALE_MS = 45_000 (mid-point of the range)."
      - "F4 resolution approach: embedded-node env-var precedence, reading process.env directly inside the existing node heredoc (not importing the compiled core/config.ts resolver into a git hook) -- implemented as planned."
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 013-drift-marker-pipeline-resilience |
| **Status** | Complete -- F3 and F4 implemented, verified, `validate.sh --strict` passed |
| **Completed** | Yes |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Both fixes implemented in the single file plan.md scoped, exactly per the approved approach -- no
deviations required.

**F3 -- stale-lock breaking.** Added a `LOCK_STALE_MS = 45_000` constant (mid-point of the
resolved 30-60s range) and a `reclaimStaleLock()` function inside the embedded node block. On
`mkdirSync(lockDir)` failing with `EEXIST`, the code now `statSync`s the lock dir; if its mtime is
older than `LOCK_STALE_MS`, it attempts a rename-then-remove reclaim (mirroring
`spec-folder-mutex.ts:101-122`'s non-destructive pattern: rename first, confirm the source path is
gone and the renamed copy exists, only then `rmSync`) and retries acquisition immediately. A
`statSync` failure, or a lock younger than the threshold, falls through unchanged to the existing
5-second wait-and-retry/exit-0 behavior.

**F4 -- live DB-path-aware marker location.** Moved the marker-directory resolution from a
hardcoded bash assignment into the embedded node block, where it reads
`process.env.SPEC_KIT_DB_DIR` / `SPECKIT_DB_DIR` / `MEMORY_DB_PATH` directly and mirrors
`core/config.ts`'s `computeDatabasePaths()` precedence (`SPEC_KIT_DB_DIR`/`SPECKIT_DB_DIR` wins,
else `MEMORY_DB_PATH`'s parent directory, else the existing default). Bash now only computes and
passes `repo_root`; `mkdir -p` for the resolved directory happens inside node
(`fs.mkdirSync(markerDir, { recursive: true })`). The lock directory (`` `${markerPath}.lock` ``)
derives from the resolved marker path automatically, so no separate lock-path fix was needed.

### Files Changed

| File | Change |
|------|--------|
| `.opencode/scripts/git-hooks/lib/memory-drift-marker.sh` | F3 (stale-lock reclaim) + F4 (live DB-path-aware marker resolution), per plan.md's Files to Change table -- the only file this packet's implementation touched |

`shellcheck` on the modified file: exit 0, zero warnings (unchanged from the pre-edit baseline).
`node --check` on the extracted embedded JS block: syntax valid.

Note: `git status` also shows `post-commit`, `post-merge`, `post-rewrite`, `README.md`, and the
rest of `lib/` as new/modified in this repo's working tree, but those pre-date this session --
they are `011-automatic-drift-self-healing`'s shipped-but-not-yet-committed work. This packet's
implementation is confined to the single file listed above.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Direct edit to the single existing shared hook library, `memory-drift-marker.sh` (no new file, no
new abstraction layer, per plan.md's Architecture). Both fixes are additive, non-overlapping edits
inside the same embedded `node <<'NODE'` heredoc: F3 touches the lock-acquisition loop, F4 touches
the marker-directory assignment immediately above it. Verified with a real scratch git repository
(outside the source tree, under the session scratchpad) running the actual post-fix hook script
end-to-end via real `git commit`s, plus two targeted harness tests that exercise the exact shipped
code (not reimplementations) for scenarios too race-prone to hit via real timing alone.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

1. **`LOCK_STALE_MS = 45_000`** -- the resolved threshold was a range (30-60 seconds, spec.md §10
   Resolved Questions); implemented at the mid-point as a defensible, documented single value.
2. **F4 resolution: embedded-node env-var precedence, not an imported compiled resolver.** Per
   plan.md's Open Questions, this was the implementation-time decision to make. Chose the
   embedded-node approach (reading `process.env.SPEC_KIT_DB_DIR`/`SPECKIT_DB_DIR`/`MEMORY_DB_PATH`
   directly, matching only the *precedence order*) over importing `core/config.ts`'s compiled
   output into a git hook, per plan.md's own stated preference and to avoid a build-order
   dependency between the hook and the MCP server's `dist/` output.
3. **No symlink canonicalization added to the hook's resolution.** REQ-003 asks for
   precedence-order matching with the consumer, not string-level path canonicalization. Testing
   surfaced a real (if narrow) divergence class -- see Known Limitations -- but adding
   `fs.realpathSync()` to the hook's resolution was not requested by any requirement and was
   judged out of scope rather than silently gold-plated in.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

**Static checks**
- `shellcheck .opencode/scripts/git-hooks/lib/memory-drift-marker.sh` -> exit 0, zero warnings.
- `node --check` on the extracted embedded JS block -> syntax valid.
- `npm run typecheck` in `mcp_server/` -> clean (no `.ts` files were touched by this packet; run as
  a regression sanity check anyway).

**Vitest regression suite** (the consumer-side contract this fix must remain compatible with --
no TypeScript was edited, so this confirms no incidental regression):
```
npx vitest run tests/memory-drift-healing.vitest.ts tests/startup-checks.vitest.ts \
  tests/startup-checks-processing-marker-sigkill.vitest.ts
```
Result: **3 test files passed, 32 tests passed, 0 failed.**

**Real scratch-repo + harness tests** (9 scenarios, all against a real `git init`'d scratch repo
under the session scratchpad running the actual post-fix hook script, or a harness that loads the
exact shipped code verbatim rather than reimplementing it):

| # | Scenario | Requirement | Result |
|---|----------|-------------|--------|
| 1 | Baseline: rename+commit, no override | REQ-004 | Marker written to the exact pre-fix hardcoded path, 0.3s, no stderr |
| 2 | `SPEC_KIT_DB_DIR` override | REQ-003 | Marker written to the resolved override dir; default-path marker untouched |
| 3 | `MEMORY_DB_PATH` alone, then both env vars set together | REQ-003, CHK-067 | Each override alone resolves correctly; with both set, `SPEC_KIT_DB_DIR` wins, `MEMORY_DB_PATH`'s dir stays empty |
| 4 | Synthetic stale lock (backdated 60s), no live owner | REQ-001 | Reclaimed, marker written in 0s |
| 5 | Synthetic fresh lock (~19ms old) | REQ-002 | NOT reclaimed; hook waited the full ~5s, exited 0, marker hash unchanged |
| 6 | `fs.statSync` monkeypatched to throw for the lock dir (real shipped code via `--require` preload) | NFR-R02 | Fell back to existing wait-and-retry, exit 0, elapsed 5020ms, lock left untouched |
| 7 | **Real SIGKILL repro**: genuine `node` process acquired the lock, `kill -9`'d mid-acquisition, confirmed orphaned via `kill -0` (ESRCH) | REQ-001, REQ-002 (the adversarial-review-verified test) | Immediately after the kill: correctly NOT reclaimed (fresh). After real elapsed time past `LOCK_STALE_MS`: reclaimed, marker written in <1s -- the previously-permanent failure now self-heals |
| 8 | **Cross-process consumer match**: hook writes under `SPEC_KIT_DB_DIR`, then the REAL compiled consumer resolver (`resolveMemoryDriftMarkerPath()` + `resolveDatabasePaths()` from `mcp_server/dist/`) resolves under the same override | REQ-003 (the adversarial-review-verified test) | Non-symlinked dir: byte-identical path strings. `/var`-symlinked macOS tmp dir: strings differed but `fs.statSync().ino` matched and the consumer's own `fs.existsSync()` found the hook's write -- functionally identical file |
| 9 | Two hook invocations racing concurrently against the same stale lock | CHK-023, CHK-FIX-004 | Both exited 0; resulting marker JSON valid with both entries, no corruption; lock fully released |

All 9 scenarios, `shellcheck`, `node --check`, `typecheck`, and the 32-test vitest suite are
**confirmed** (directly observed command output), not inferred.

**`validate.sh --strict`**:
```
bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh \
  .opencode/specs/system-speckit/028-memory-search-intelligence/013-drift-marker-pipeline-resilience --strict
```
Result: `Summary: Errors: 0  Warnings: 0` / `RESULT: PASSED` / exit code `0`.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Marker-directory path strings can diverge from the consumer's on symlink-containing
   filesystems, though the underlying file is identical.** The hook's F4 resolution uses
   `path.resolve()`, matching `core/config.ts`'s precedence *order*; the consumer's
   `computeDatabasePaths()` additionally calls `realpathSync()` to canonicalize symlinks (an
   unrelated security-boundary feature, not part of REQ-003). On macOS, where `/var` is a symlink
   to `/private/var`, an override pointing under `/var/...` produces a hook-written path string
   that differs from the consumer's canonicalized string, even though both point at the same
   inode and `fs.existsSync()`/`fs.renameSync()` transparently follow the symlink either way
   (confirmed directly, Test 8). This is a residual, functionally-harmless observation -- not a
   fix gap against REQ-003 as written -- but is flagged here for visibility rather than silently
   dropped.
2. **`LOCK_STALE_MS` is a single value (45s) chosen from the resolved 30-60s range**, not
   independently re-derived. This is a defensible mid-point per the range's own stated
   conservatism (spec.md §10), not a new open question.
3. **Verification is scratch-repo and harness-based, not a live production git-hook run.** All 9
   scenarios ran against a real `git init`'d repo or a harness that loads the exact shipped code,
   which is the strongest verification available without waiting on a real accidental SIGKILL in
   this repo's actual hook installation. The mechanism, not just the intent, was exercised.
<!-- /ANCHOR:limitations -->
