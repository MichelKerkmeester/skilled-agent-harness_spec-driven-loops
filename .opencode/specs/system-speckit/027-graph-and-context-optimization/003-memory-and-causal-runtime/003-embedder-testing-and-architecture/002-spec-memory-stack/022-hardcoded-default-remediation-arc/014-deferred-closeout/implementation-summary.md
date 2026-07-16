---
title: "Implementation Summary: 022/014 Deferred Closeout"
description: "3 deferred items shipped (data-copy script, advisory pre-commit hook, Z_SCORE comment); 1 no-op (node-llama-cpp); 1 deferred (dynamic Z_SCORE)."
trigger_phrases: ["022/014 summary", "deferred closeout complete"]
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/022-hardcoded-default-remediation-arc/014-deferred-closeout"
    last_updated_at: "2026-05-23T22:45:00Z"
    last_updated_by: "main_agent"
    recent_action: "Post-014 fixes pushed (6acd845dfd)"
    next_safe_action: "n/a — arc 022 closed"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
      - ".opencode/skills/system-skill-advisor/mcp_server/tests/scorer/native-scorer.vitest.ts"
      - ".opencode/skills/system-skill-advisor/mcp_server/tests/scorer/fixtures/intent-prompt-corpus.ts"
      - ".opencode/skills/system-skill-advisor/mcp_server/tests/scorer/fixtures/harder-intent-prompt-corpus.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/tests/rerank-sidecar-canonical-parity.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000002b1d"
      session_id: "016-002-022-014-summary"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "R1-R5 all pass; 3 deferred items closed; 1 no-op; 1 deferred"
      - "Post-014 closeout: 2 more deferred items closed (test fixture rename + cross-language sidecar parity test) in commit 6acd845dfd. 53/53 scorer + 4/4 parity tests pass."
---
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Implementation Summary: 022/014 Deferred Closeout

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|------|-------|
| Status | Complete |
| Shipped | 2026-05-23 |
| Files changed | 3 new + 2 modified |
| Net LOC | ~+115 (3 new scripts + small doc/comment edits) |
| Wall-clock | ~40 min |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:what-built -->
## 2. WHAT WAS BUILT

### New shipped scripts (3 files, all under `.opencode/scripts/`)

- **`copy-skill-advisor-dist-data.sh`** (~40 LOC, executable) — Idempotent bash script that mirrors `data/*.json` from `mcp_server/data/` into `dist/system-skill-advisor/mcp_server/data/`. Handles missing source dir cleanly (exits 0 with informational stderr). Uses `git rev-parse --show-toplevel` for repo-root resolution. Replaces the gitignored package.json `postbuild` script with a tracked, portable equivalent.
- **`git-hooks/pre-commit`** (~30 LOC, executable) — Advisory pre-commit hook. Runs `validate-doc-model-refs.js`, captures output. If validator exits non-zero (drift detected): prints warning to stderr (truncated to 30 lines) + bypass instructions. Always exits 0 — commit is never blocked. Bypass via `SPECKIT_SKIP_DOC_MODEL_VALIDATE=1` env var. Graceful no-op if `node` isn't on PATH or the validator doesn't exist.
- **`install-git-hooks.sh`** (~35 LOC, executable) — Operator-opt-in symlink installer. Iterates `git-hooks/` and symlinks each into `.git/hooks/`. Won't overwrite existing non-symlinks (prints WARNING and skips). Supports `--uninstall` to remove the symlinks.

### Modified files (2)

- **`.opencode/install_guides/README.md`** — Skill-advisor install section now includes `bash .opencode/scripts/copy-skill-advisor-dist-data.sh` after `npm run build` + a build-pipeline note explaining why `tsc` doesn't copy non-TS assets and pointing operators at the tracked script.
- **`.opencode/skills/system-spec-kit/mcp_server/lib/search/evidence-gap-detector.ts`** — Z_SCORE_THRESHOLD comment updated. Pre-update comment said "the long-term fix is enabling the local reranker sidecar via RERANKER_LOCAL=true" — now stale post-013. New comment reflects post-013 state: local sidecar is the only supported reranker, activation requires `SPECKIT_CROSS_ENCODER=true` AND `RERANKER_LOCAL=true`, threshold stays at 1.3 conservatively until a per-operator reranker-presence signal is wired (flagged as deferred). The value (1.3) is unchanged.

### Out-of-scope / no-op

- **`node-llama-cpp` package.json prune**: discovered to be a no-op. No live `package.json` declares `node-llama-cpp` as a dependency — only `system-code-graph/package-lock.json` has residual entries referencing `../system-spec-kit/mcp_server/node_modules/node-llama-cpp`. These regenerate cleanly on next `npm install`; no edit needed.
- **Raising Z_SCORE_THRESHOLD 1.3 → 1.5**: intentionally deferred. Raising unconditionally would over-penalize operators running without the sidecar. A proper fix requires runtime detection of whether the local sidecar is reachable (probe `localhost:8765/health`) + dynamic threshold selection. Out of scope for this closeout; deferred to a future packet.

### Out of scope (gitignored)

- **`system-skill-advisor/mcp_server/package.json` `postbuild` script** — Already added locally on this machine during 014 investigation; useful operator convenience but doesn't ship via git (`.opencode/.gitignore:2` ignores `package.json`). The tracked `copy-skill-advisor-dist-data.sh` provides the same functionality.
<!-- /ANCHOR:what-built -->

<!-- ANCHOR:how-delivered -->
## 3. HOW IT WAS DELIVERED

~40 min main-agent direct work. No CLI dispatch.

1. **Inventory** 4 deferred items from arc 022 close.
2. **Investigation revealed** node-llama-cpp is a no-op + system-skill-advisor's package.json is gitignored → pivoted from "edit package.json" to "ship tracked bash script".
3. **Scripts authored** in dependency order: copy-data script (smallest), then pre-commit hook, then installer.
4. **Smoke-tested each script**: deleted dist JSON + ran copy script; ran installer; smoke-committed via `git commit --allow-empty` then reverted via `git reset --soft HEAD~1`.
5. **Install-guide note** added next to the existing `npm run build` step for high visibility.
6. **Z_SCORE comment** updated as a single-block edit.
7. **Spec packet** authored last so docs reflect actual shipped state.
<!-- /ANCHOR:how-delivered -->

<!-- ANCHOR:decisions -->
## 4. KEY DECISIONS

- **Pivoted from `package.json postbuild` to tracked bash script** when the gitignore rule was discovered. Operator's local convenience edit stays; the tracked script provides portable, reproducible alternative.
- **Advisory hook, not blocking.** Per task #34's "advisory" framing. Operators in the middle of fast iterations don't want failed commits over doc drift. The warning to stderr is enough signal.
- **Bypass env var** (`SPECKIT_SKIP_DOC_MODEL_VALIDATE=1`) was added even though the hook is advisory. Pragmatic — operators copy-pasting from old shell history with set-and-forget habits won't have to fight the hook.
- **`install-git-hooks.sh` won't overwrite non-symlinks.** Operators may already have their own pre-commit hook from another tool; clobbering would surprise them. WARN + skip is the safer default.
- **Z_SCORE_THRESHOLD value kept at 1.3.** Raising to 1.5 unconditionally would penalize operators without the sidecar. Dynamic threshold (probe-based) is the right fix; deferred.
<!-- /ANCHOR:decisions -->

<!-- ANCHOR:verification -->
## 5. VERIFICATION

| Requirement | Check | Result |
|-------------|-------|--------|
| R1 | `rm -f dist/.../prompt-policy.default.json && bash .opencode/scripts/copy-skill-advisor-dist-data.sh` | File restored — PASS |
| R2 | `bash .opencode/scripts/install-git-hooks.sh` | `.git/hooks/pre-commit` symlinked to shipped hook — PASS |
| R3 | `git commit --allow-empty -m "hook smoke test"` (commit `bc74df2`, reverted via `git reset --soft HEAD~1`) | Commit succeeded with stderr advisory output; not blocked — PASS |
| R4 | Hook script source reviewed | `SPECKIT_SKIP_DOC_MODEL_VALIDATE=1` check at top exits 0 immediately — PASS |
| R5 | Manual read of `evidence-gap-detector.ts:14-30` | Post-013 narrative present; `SPECKIT_CROSS_ENCODER=true + RERANKER_LOCAL=true` documented; rationale for keeping 1.3 noted — PASS |
<!-- /ANCHOR:verification -->

<!-- ANCHOR:limitations -->
## 6. KNOWN LIMITATIONS

- **Operator-opt-in hook install.** Not auto-installed by any other workflow. Operators who clone the repo must run `bash .opencode/scripts/install-git-hooks.sh` themselves. Reasonable for a small team; would need different distribution mechanism for wider audience.
- **Hook hard-codes path resolution via `git rev-parse`.** Won't work outside a git working tree (returns empty REPO_ROOT and exits 0). Acceptable for a git pre-commit hook.
- **Z_SCORE_THRESHOLD is still static.** Per-operator reranker-presence detection (probing localhost:8765/health, caching the result) is the proper fix; deferred to a future packet.
- **`copy-skill-advisor-dist-data.sh` only handles JSON.** If future arcs add other non-TS asset types (YAML, binary models, etc.), the glob needs widening. Operator can edit the script or copy additional files manually.
- **node-llama-cpp lockfile residue**: stale entries in `system-code-graph/package-lock.json`. Will regenerate on next `npm install` in that workspace; not blocking.

### Commit Handoff

```
chore(022/014): deferred closeout — build-pipeline script, advisory pre-commit hook, Z_SCORE comment

Closes 3 of 4 deferred follow-ons from the 022 arc:

1. Build-pipeline JSON-copy gap (originally surfaced by 011 Step 1 MCP -32000
   recovery): tsc doesn't copy data/*.json into dist/, the skill-advisor
   launcher fails on first start without dist/.../prompt-policy.default.json.
   Pivoted from "edit package.json postbuild" (file is .gitignored) to
   shipping a tracked .opencode/scripts/copy-skill-advisor-dist-data.sh.
   Install-guide README.md now points operators at this script after
   npm run build.

2. Advisory pre-commit hook for validate-doc-model-refs.js (Task #39):
   - .opencode/scripts/git-hooks/pre-commit (~30 LOC; always exits 0;
     bypass via SPECKIT_SKIP_DOC_MODEL_VALIDATE=1)
   - .opencode/scripts/install-git-hooks.sh (~35 LOC; opt-in symlink
     installer; supports --uninstall; won't overwrite non-symlinks)

3. Z_SCORE_THRESHOLD comment in evidence-gap-detector.ts updated to
   reflect post-022/013 state: local sidecar is now the only supported
   reranker, activation requires SPECKIT_CROSS_ENCODER=true AND
   RERANKER_LOCAL=true, threshold stays at 1.3 conservatively (raising
   to 1.5 would over-penalize operators without the sidecar). Value
   unchanged; comment-only update.

Deferred / out of scope:
- node-llama-cpp package.json dep prune: resolved-by-discovery as no-op
  (no live dep; only system-code-graph/package-lock.json residue
  regenerates on next npm install)
- Dynamic Z_SCORE_THRESHOLD based on sidecar-presence probe: separate
  packet (needs runtime detection + cache)
- Wider asset-type handling in copy-skill-advisor-dist-data.sh: deferred
  until a non-JSON asset is introduced

Verification:
- All 3 scripts smoke-tested (copy data, install hook, commit smoke +
  revert via git reset --soft HEAD~1)
- Pre-commit hook exits 0 even when validator detects drift (advisory)
- Bypass env var honored
- Install-guide cascade reads consistent with post-013 cascade narrative
```

Explicit paths:

```
.opencode/scripts/copy-skill-advisor-dist-data.sh  (NEW)
.opencode/scripts/git-hooks/pre-commit  (NEW)
.opencode/scripts/install-git-hooks.sh  (NEW)
.opencode/install_guides/README.md
.opencode/skills/system-spec-kit/mcp_server/lib/search/evidence-gap-detector.ts
.opencode/specs/.../022-hardcoded-default-remediation-arc/014-deferred-closeout/  (NEW packet)
.opencode/specs/.../022-hardcoded-default-remediation-arc/graph-metadata.json  (children_ids 15 → 16)
```
<!-- /ANCHOR:limitations -->
