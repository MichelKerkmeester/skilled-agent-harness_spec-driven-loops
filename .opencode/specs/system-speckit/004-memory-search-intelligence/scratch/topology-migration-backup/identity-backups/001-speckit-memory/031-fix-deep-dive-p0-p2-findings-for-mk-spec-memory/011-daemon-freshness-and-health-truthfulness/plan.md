---
title: "Implementation Plan: Phase 11: daemon-freshness-and-health-truthfulness [template:level_1/plan.md]"
description: "Fix the dist-freshness bootstrap deadlock at the build finalizer, make the CLI gate and hook fallback honest about stale-dist, repair memory_health diagnostics, and timebox a SIGBUS crash-loop diagnosis."
trigger_phrases:
  - "dist freshness deadlock"
  - "stale dist exit 75"
  - "memory health truthfulness"
  - "sigbus crash loop"
  - "finalize-dist hash cache"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/004-memory-search-intelligence/001-speckit-memory/031-fix-deep-dive-p0-p2-findings-for-mk-spec-memory/011-daemon-freshness-and-health-truthfulness"
    last_updated_at: "2026-07-04T17:51:12.131Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored implementation plan with FIX ADDENDUM surface inventory"
    next_safe_action: "Execute Phase 1 baseline + verify-first battery before touching code"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/scripts/finalize-dist.mjs"
      - ".opencode/skills/system-spec-kit/scripts/lib/dist-freshness.cjs"
      - ".opencode/bin/spec-memory.cjs"
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-health.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "planning-011-daemon-freshness-and-health-truthfulness"
      parent_session_id: null
    completion_pct: 10
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 11: daemon-freshness-and-health-truthfulness

<!-- SPECKIT_LEVEL: 2 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope; remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (mcp_server, ESM) + Node CommonJS shims (`.opencode/bin/*.cjs`, `scripts/lib/*.cjs`) |
| **Framework** | None — Node CLI shims, MCP daemon handlers, shell/Node hook helpers |
| **Storage** | SQLite via better-sqlite3 + sqlite-vec (read paths only in this phase) |
| **Testing** | Vitest (`mcp_server/tests/dist-freshness.vitest.ts` et al.) + `scripts/tests/test-dist-freshness.sh` + manual receipts |

### Overview
Break the freshness deadlock where it starts: the build finalizer (`finalize-dist.mjs`) writes the per-entry source-hash caches that `dist-freshness.cjs` already trusts first (:349-364), so a successful build produces a fresh verdict even when `tsc --build` skips re-emitting content-identical outputs. Around that core fix, make the gate honest (argv exemptions, explicit exit taxonomy, unified recovery text, doc alignment), make failure visible (startup one-liner + session_health last-fallback status), fix the health diagnostics that structurally cannot fire, and run a timeboxed SIGBUS diagnosis with a launcher backoff cap.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented (spec.md §2-§3; Chain C 🟢 live-reproduced)
- [ ] Success criteria measurable (spec.md §5: same-session fresh verdict, visible fallback, reconciling health numbers)
- [ ] Dependencies identified (none upstream; phase 002 consumes the definitions note; native modules for SIGBUS)

### Definition of Done
- [ ] All acceptance criteria met (REQ-001..REQ-008 ACs in spec.md §4)
- [ ] Tests passing: deadlock regression test green; full mcp_server vitest re-run matches Phase-1 baseline (no new failures)
- [ ] Docs updated (spec/plan/tasks synchronized; dist-freshness-enforcement.md exit codes + hash-cache paragraph corrected)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Shared checker module + thin consumers: one `dist-freshness.cjs` module defines "stale"; CLI shims fail closed, validate.sh backstop fails closed, hook/plugin consumers warn or fall back open. This phase adds one producer (build finalizer writes the cache) and keeps the consumer topology intact.

### Key Components
- **`dist-freshness.cjs` (shared checker)**: hash-cache short-circuit at :349-364; source enumeration via `collectSourceFiles` at :333; hash+cache-path at :349-350; mtime comparison at :366-392; cache write today only at :394 (post-mtime-pass — the deadlock). Gains exported helpers so the finalizer reuses the checker's own source *enumeration* AND hash/cache-path logic (`collectSourceFiles`, `hashSourceFiles`, `cachePathFor` stay single-sourced). Reusing only the hash function is insufficient: a finalizer that enumerates its own file set would hash a different set than the checker walks at :333, so the stored hash would never match and the deadlock would persist.
- **`finalize-dist.mjs` (build finalizer)**: after a successful build, writes the source-hash cache for each mcp_server entry (default, `spec-memory-cli`, `validation-orchestrator`), computing each cache over the checker's `collectSourceFiles` enumeration so the written hash equals what the checker recomputes.
- **`spec-memory.cjs` (CLI gate)**: `ensureFreshDist()` currently unconditional (:76-77), exits `EXIT_RETRYABLE=75` on stale/missing (:55-56). Gains argv exemptions and the explicit taxonomy — conservative default keeps stale-dist inside 75 as a documented non-retryable sub-case (75 is a live retryable contract), a distinct code only if the consumer inventory proves it.
- **`spec-memory-cli-fallback.ts` + `session-health.ts` (visibility)**: fallback currently classifies fail-open silently (:258); gains a surfaced skip reason and a queryable last-fallback record.
- **`memory-crud-health.ts` (truthfulness)**: exclusion audit at :463-473 references nonexistent `content` column; sampled orphan scan; maintenance lastRun; population definitions note shared with stats and phase 002.

### Data Flow
Build: `npm run build` → tsc → `finalize-dist.mjs` → (NEW) write per-entry source-hash caches → next `checkPackageFreshness()` call hits the hash short-circuit → fresh. Runtime: hook probes daemon → CLI fallback → on stale/missing dist, gate refuses with documented code → hook surfaces "Memory: CLI fallback skipped (<reason>)" → `session_health` records the event instead of silence.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `scripts/lib/dist-freshness.cjs` (producer/policy) | Owns the staleness verdict; enumerates via `collectSourceFiles` (:333), hashes at :349, writes hash cache only after an mtime pass (:394) | update — export the source *enumeration* + cache-write helpers (`collectSourceFiles`/`hashSourceFiles`/`cachePathFor`); unify :314/:390 message texts | vitest bootstrap test; `rg -n "collectSourceFiles\|writeStoredSourceHash" scripts/lib` |
| `mcp_server/scripts/finalize-dist.mjs` (producer) | Finalizes build output; never touches freshness caches (enforcement doc: "never pre-warmed by a build script") | update — write per-entry caches post-build using the checker's `collectSourceFiles` enumeration (NOT an independent walk — divergent file set → permanent cache miss → deadlock persists) | build → CLI invocation receipt; test asserts cache files exist after finalize AND the checker returns fresh via the hash short-circuit |
| `.opencode/bin/spec-memory.cjs` (consumer/gate) | Unconditional `ensureFreshDist()` before argv (:76-77); exit 75 on stale (:56); spawns CLI (:79) | update — argv exemptions, taxonomy, `--disable-warning`/`--no-warnings` on spawn; reconcile git state | forced-stale `--help` exit 0; `git status --porcelain .opencode/bin/spec-memory.cjs` |
| `.opencode/bin/code-index.cjs`, `.opencode/bin/skill-advisor.cjs` (same-class producers) | Same shared-module gate pattern (enforcement doc §2) | inventory only — document whether they share the deadlock and the exemption gap; fix only if trivially identical, else record disposition for their owning systems | `rg -n "checkPackageFreshness|EXIT_RETRYABLE|--help" .opencode/bin/*.cjs` |
| `mcp_server/hooks/spec-memory-cli-fallback.ts` (consumer) | Fail-open classification at :258; spawn at :210 | update — skip-reason surfacing, last-fallback recording, warning suppression | forced-stale session-start receipt shows the one-liner |
| `mcp_server/handlers/session-health.ts` (status) | No fallback visibility today | update — expose last-fallback status | `session_health` response field present in test |
| `mcp_server/handlers/memory-crud-health.ts` (status) | Exclusion audit dead (:463-473 `content` column); orphanFiles sampled-but-unlabeled; maintenance lastRun null | update — column fix, labels, mismatchedIds cap, last-scan without runtime, lastRun wiring | synthetic-row audit test fires; health-vs-raw-SQL receipt |
| `memory_stats` handler (status, shared policy) | Silently excludes deprecated (7,369-row disagreement with health, 🟢 L1) | update docs/note only — shared population-definitions note; predicate implementation stays in phase 002 | note referenced from both handlers; phase 002 spec cites it |
| `feature_catalog/tooling-and-scripts/dist-freshness-enforcement.md` + playbooks 429/455 (docs) | Claims exit 69 (:35, :42) and "cache never pre-warmed by a build script" (§2) | update — real exit taxonomy, new cache-bootstrap behavior | `grep -n "exit 69" feature_catalog/tooling-and-scripts/dist-freshness-enforcement.md` returns nothing stale |
| `mcp_server/tests/dist-freshness.vitest.ts` + `scripts/tests/test-dist-freshness.sh` (tests) | Cover checker + validate.sh backstop; no bootstrap-deadlock case | update — regression test: mtime-newer + no cache + successful finalize → fresh; real-stale → still refuses | vitest run green |
| `scripts/spec/validate.sh` + `scripts/validation/continuity-freshness.ts` chain (consumer) | CONTINUITY_FRESHNESS strict path reportedly errored importing missing `scripts/mcp_server/lib/validation/spec-doc-structure.js`; did not reproduce on this folder 2026-07-03 | verify first — find triggering condition, then fix the import resolution | strict run under the triggering condition completes; probe commands recorded |
| Daemon launcher (producer) | Restart loop with no backoff cap (SIGBUS crash-loop 05:52-06:07, 🟢 L6) | update — backoff cap after locating via `rg -n "backoff|respawn|restart" mcp_server` | unit test or manual receipt of capped restarts |

Required inventories:
- Same-class producers: `rg -n "checkPackageFreshness|ALLOW_STALE|EXIT_RETRYABLE" .opencode/bin .opencode/plugins .opencode/skills/system-spec-kit/scripts/spec/validate.sh`.
- Consumers of changed symbols: `rg -n "exitCode|staleDistWarning|75|fail_open" .opencode/skills/system-spec-kit/mcp_server/hooks .opencode/bin --glob '*.{ts,js,cjs,md}'` before the taxonomy decision.
- Matrix axes: {dist state: fresh / stale-mtime-only / genuinely-stale / missing} × {argv: tool call / --help / --version / completion} × {cache: absent / matching / mismatched} — enumerate rows in the regression test before implementation.
- Algorithm invariant: a genuinely stale dist (source content differs from what built the dist) MUST still refuse after the cache-bootstrap change; adversarial cases: cache present but source edited afterward; cache written by a failed build (must not happen); cache for one entry must not vouch for another entry.
- Enumeration-equality invariant: the finalizer's source enumeration MUST equal the checker's `collectSourceFiles` output for the same pkg/root/entry (same `sourceCandidates`, `excludedSegments`, and watched extensions). Any divergence makes the finalizer-written hash unequal to the checker's recompute at `:349`, so the hash short-circuit never fires and the deadlock is not actually broken — test by asserting the checker reports fresh via the hash path (not mtime) immediately after finalize.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Vitest baseline captured for mcp_server (full suite, failures recorded to scratch/) — baseline-before-no-regressions
- [ ] Chain C reproduction receipts re-confirmed (touch source mtimes, build, observe refusal) + `spec-memory.cjs` git state checked
- [ ] Verify-first battery for 🟡/unreproduced items: #24 column check against live schema; 69/75 doc drift; "Off by default" cluster grep; CONTINUITY_FRESHNESS import error repro; SIGBUS log capture

### Phase 2: Core Implementation
- [ ] Deadlock fix: finalize-dist cache writes + checker helper export + unified recovery texts
- [ ] Gate ergonomics: argv exemptions, exit taxonomy decision + implementation, git reconcile, doc alignment
- [ ] Visibility + truthfulness: fallback one-liner, session_health status, memory-crud-health batch, ExperimentalWarning suppression, validate.sh import fix, SIGBUS diagnosis + backoff cap

### Phase 3: Verification
- [ ] Deadlock regression test green; forced-stale matrix rows pass (fresh/stale × argv × cache)
- [ ] Full vitest re-run, delta vs Phase-1 baseline reported (whole gate, not spot checks)
- [ ] Health-vs-raw-SQL reconciliation receipt; docs synchronized; validate.sh --strict exit 0 on this folder
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | dist-freshness bootstrap/cache matrix; exclusion-audit fires on synthetic row; launcher backoff cap | Vitest (`dist-freshness.vitest.ts`, health handler tests) |
| Integration | build → finalize → CLI fresh verdict same session; forced-stale session start → visible skip line + session_health record; validate.sh backstop still exits 3 on genuinely stale orchestrator | `scripts/tests/test-dist-freshness.sh`, manual receipts with commands recorded |
| Manual | --help/--version under forced stale; health-vs-raw-SQL number reconciliation; SIGBUS probe review | sqlite3 CLI, launcher logs, playbooks 429/455 re-run |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| better-sqlite3 / sqlite-vec native builds | External | Green (daemon currently healthy) | SIGBUS diagnosis limited to logs + rebuild check; ship backoff cap regardless |
| Phase 002 shared active-row predicate | Internal | Yellow (not started; 011 runs first) | Definitions note ships here standalone; 002 implements later — no blocking edge |
| Shared gitignored dist/ used by concurrent sessions | Internal | Green | Cache-bootstrap change keeps mtime path authoritative; no auto-rebuild introduced |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: CLI refuses on a genuinely fresh dist after the cache change, a fresh verdict is produced for a genuinely stale dist (invariant breach), new vitest failures vs baseline, or hook startup surface regressions.
- **Procedure**: `git revert` the phase commits (shim, finalizer, checker, handlers are independent commits — revert selectively); delete written `*.hash` cache files next to dist entries (additive artifacts, safe to remove); `SPECKIT_SPEC_MEMORY_CLI_DEV_ALLOW_STALE=1` remains the documented operator escape hatch while reverting; health-handler changes are read-path-only and revert cleanly with no data migration.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Baseline + Verify-first) ──► Phase 2 (Core fixes) ──► Phase 3 (Verification)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup (T001-T003) | None | Core |
| Core (T004-T013) | Setup (baseline + verify-first receipts) | Verify |
| Verify (T014-T016) | Core | None — hands off to program phase 001 |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 1-2 hours |
| Core Implementation | Med | 6-10 hours (plus SIGBUS timebox, max 1 day) |
| Verification | Med | 2-3 hours |
| **Total** | | **9-15 hours + bounded SIGBUS timebox** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Backup created (if data changes) — N/A: no data or schema changes in this phase
- [ ] Feature flag configured — N/A by design: fixes to default-ON behavior ship direct per the program contract; `SPECKIT_SPEC_MEMORY_CLI_DEV_ALLOW_STALE=1` remains the operator escape hatch
- [ ] Monitoring alerts set — the startup one-liner + session_health last-fallback record ARE the new monitoring surface; verify they emit before relying on them

### Rollback Procedure
1. Delete the written source-hash cache files next to the dist entries (additive artifacts, safe to remove)
2. `git revert` the phase commits selectively (shim, finalizer, checker, handlers land as separate commits)
3. Smoke test critical paths: CLI tool call, `--help` under forced stale, validate.sh compiled-orchestrator backstop (must still exit 3 on stale)
4. Record the revert and reason in this folder's implementation-summary continuity block

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A — all changes are code, docs, and additive cache files
<!-- /ANCHOR:enhanced-rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
