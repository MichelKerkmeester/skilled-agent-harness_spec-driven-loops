---
title: "Implementation Summary: README Migration Audit"
description: "Dual-executor deep-review (deepseek-flash completed 10/10; glm-high root-caused as a dispatch failure) found 20 stale-topology findings across the repo's README family; all 20 fixed (2 initially deferred, then fixed on operator request)."
trigger_phrases:
  - "readme migration audit summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/032-relocate-specs-folder/005-readme-migration-audit"
    last_updated_at: "2026-08-07T21:24:11Z"
    last_updated_by: "claude-code"
    recent_action: "All findings dispositioned, fixes applied, verified against fixtures and real targets"
    next_safe_action: "Run validate.sh --recursive --strict, then commit and push to skilled/v4.0.0.0"
    blockers: []
    key_files:
      - "README.md"
      - ".opencode/skills/system-spec-kit/README.md"
      - ".opencode/bin/check-no-spec-imports.cjs"
      - ".opencode/scripts/git-hooks/lib/memory-drift-marker.sh"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-07-system-speckit-032-relocate-005"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 005-readme-migration-audit |
| **Completed** | 2026-08-07 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A dual-executor `/deep:review` loop audited every non-worktree `README.md` in the repo (root included) for content left logically stale by the specs-root topology flip (`003-migration-execution`: `specs/` canonical, `.opencode/specs` a compat symlink). `deepseek-flash` (cli-opencode) completed all 10 iterations; `glm-high` (cli-devin) never spawned a process despite fully-resolved config and confirmed auth — root-caused to a real, confirmed silent-failure gap in `fanout-run.cjs`'s spawn-error path, out of scope for this packet to fix. The single-lineage run converged (CONDITIONAL verdict, iterations 5-9 returned zero new findings, adversarial replay in iteration 10 confirmed no severity changes) with 20 findings (0 P0, 5 P1, 15 P2).

18 of 20 findings were fixed in the first pass; the remaining 2 (F012: `.txt` command-help files outside strict `README.md` scope; F020: a closed historical packet under `specs/**`) were initially deferred exactly as the review itself recommended, then fixed in a follow-up round after the operator explicitly asked for them. All 20 findings are now fixed.

### Findings fixed (20/20, 25 files)

| Finding(s) | File(s) | Fix |
|---|---|---|
| F001, F018 | `.opencode/skills/system-spec-kit/README.md` | 8 locations: `.opencode/specs/...` examples → `specs/...`; reference table row now states `.opencode/specs` is a compat symlink to `specs/` |
| F002 | `.opencode/skills/system-spec-kit/scripts/core/README.md` | Inverted config-resolution-order claim corrected to match `config.ts`'s real `['specs', '.opencode/specs']` |
| F003 | `.opencode/skills/system-spec-kit/scripts/sweep/README.md` | Inverted canonical/legacy label order fixed |
| F004 | `.opencode/skills/system-spec-kit/scripts/kpi/README.md` | `.opencode/specs/` → `specs/` |
| F005 | `.opencode/skills/system-spec-kit/mcp-server/README.md`, `mcp-server/benchmarks/README.md` | Live prose canonicalized; dated historical benchmark-run rows (May 17/20 2026) deliberately left pointing at their real historical packet paths |
| F006 | `sk-design-md-generator/README.md`, `backend/README.md` | 10 `--output` example paths canonicalized |
| F007 | `sk-create-benchmark/references/shared/README.md` | Audit-trail pointer canonicalized |
| F008 | `.opencode/bin/lib/README.md` | Authored-program pointer canonicalized |
| F009 (superseded by F017) | `scripts/git-hooks/lib/README.md`, `scripts/git-hooks/README.md`, `.opencode/scripts/git-hooks/README.md`, `.opencode/scripts/git-hooks/lib/README.md` | Watch-logic descriptions re-pointed to match the F017 code fix |
| F010 | `README.md` (repo root) | RELATED DOCUMENTS link canonicalized (the packet's REQ-001 target) |
| F011 | `deep-alignment/assets/conformance-benchmark/README.md`, `styles/scripts/README.md`, `mcp-server/hooks/cursor/README.md`, `mcp-server/hooks/devin/README.md`, `mcp-server/database/migrations/README.md` | Legacy packet-pointer prefixes canonicalized in both prose and link hrefs |
| F013 | `.opencode/bin/check-no-spec-imports.cjs` | **Code fix.** Single legacy-only `SPECS_ROOT` → `SPECS_ROOTS` array checking both `specs/` and `.opencode/specs`; a canonical-path spec import could previously bypass this durable-invariant guard entirely |
| F015, F016 | `spec.md`, `plan.md` | Frozen census numbers reworded to "moving target, reproduce via cited command"; the exact reproducible census command added to `plan.md`'s Definition of Ready |
| F017 | `.opencode/scripts/git-hooks/lib/memory-drift-marker.sh` | **Code fix.** `git diff-tree` pathspec `-- .opencode/specs` → `-- specs`; the old pathspec matched only the symlink blob itself, never files inside the real tree it points at (verified empirically: 0 vs 16 lines detected against the same `HEAD`) |
| F019 | (resolved as a side effect of F001) | `system-spec-kit/README.md:846` now explicitly documents the compat-symlink relationship |
| — (a discovery beyond the review's own list) | `.devin/hooks/README.md` | Cross-reference link canonicalized; found during a follow-up repo-wide census re-run, same class as F010/F011 |
| F012 | `commands/create/README.txt:160`, `commands/memory/README.txt:323` | Initially deferred as outside this packet's strict `README.md` scope; operator asked for it after review, both `.txt` files canonicalized |
| F020 | `specs/system-speckit/026-.../003-continuity-refactor-gates/prompts/README.md` | Initially deferred as a closed historical packet; operator chose to canonicalize anyway — 12 `.opencode/specs/` → `specs/` occurrences fixed. Left untouched: the same paths also carry a stale track name (`system-spec-kit` vs the real `system-speckit`) and a stale folder depth (2 levels under `026-...` vs the real 3) predating this migration entirely — a document-reorganization drift, not a specs-root topology issue, out of this packet's scope |

### Findings deferred: none remaining

All 20 findings now have a fix applied. No deferrals stand.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Dispatched via `cli-opencode`'s external-runtime pattern (`opencode run --command deep/review`), since no native `.claude/commands/` entry point exists for `/deep:review` from a Claude Code session. Mapped "deepseek v4 flash" and "GLM 5.2 high" to real, doc-verified CLI+model pairs (`cli-opencode` + `deepseek/deepseek-v4-flash`; `cli-devin` + `glm-5-2-max`, since GLM has no `cli-opencode` provider entry at all) before dispatch, per the CLI-dispatch skill-preload rule.

A premature process kill mid-run (misread a stale heartbeat as a stall) was caught, disclosed, and recovered without losing work — `fanout-run.cjs` spawns lineages `detached: true` by design, so the actual `deepseek-flash` worker survived the kill attempt. The user chose to let it finish solo rather than restart both executors. `glm-high`'s complete non-dispatch was investigated read-only per the user's explicit steer, and root-caused to a genuine, confirmed silent-failure gap in the shared runtime (`fanout-run.cjs`'s `result.error` from a synchronous spawn failure is captured but never logged anywhere in the script) — out of scope for this packet, documented instead via `spec.md` REQ-003's amendment.

After the single-lineage run converged, findings were applied file-by-file following the review's own WS-1 through WS-5 remediation workstreams. Two code-level fixes (`check-no-spec-imports.cjs`, `memory-drift-marker.sh`) were each verified against real test fixtures plus a stash-based A/B comparison to separate the fix's effect from a pre-existing unrelated violation (`compiled-route-guard.cjs:41`, confirmed present under both old and new code, left untouched). A closing "research angle" sweep — grepping for directory-tree fences and prose mentioning both `.opencode/` and `specs/` in the same block, beyond the literal `.opencode/specs` string — found 18 candidates, all confirmed false positives (canonical `specs/` paths correctly coexisting with unrelated `.opencode/skills/...` script paths).
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Accept REQ-003 with one executor (deepseek-flash) plus documented root cause, rather than blocking on glm-high | The failure is a confirmed shared-runtime bug, not a scoping or config error in this packet; re-running glm-high would not fix it, and a concurrent session's diff to `fanout-run.cjs` suggests it may already be independently tracked |
| Fix the historical/live distinction case-by-case rather than blanket-canonicalizing every `.opencode/specs` mention | Dated benchmark-run table rows and the F020 closed-packet prompts README describe topology as it existed at a real point in time; rewriting them to canonical form would misrepresent the historical record, not correct a live claim |
| Leave `compiled-route-guard.cjs:41` untouched after the F013 fix surfaced it | Confirmed pre-existing via `git stash` A/B comparison (fires identically with the original unmodified `check-no-spec-imports.cjs`); fixing it is a separate change outside this packet's Scope Lock |
| Leave the durability-leak negative-test fixture's `.opencode/specs/temporary-note.md` payload untouched | The fixture's entire purpose is to assert against that literal legacy-path string as test input; "fixing" it would break the test it exists to run |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `bash -n memory-drift-marker.sh` | PASS, exit 0 |
| `node -c check-no-spec-imports.cjs` | PASS, exit 0 |
| `check-no-spec-imports.cjs` positive fixture (dir) | PASS, exit 1 with the expected violation named |
| `check-no-spec-imports.cjs` negative fixture (dir) | PASS, exit 0, clean |
| `check-no-spec-imports.cjs` real-target scan (default roots) | Surfaces only the pre-existing, confirmed-unrelated `compiled-route-guard.cjs:41` violation |
| `memory-drift-marker.sh` pathspec A/B | 0 lines detected with the old `.opencode/specs` pathspec vs 16 with the new `specs` pathspec, same `HEAD` |
| `check-markdown-links.cjs --self-test` | PASS, all 6 cases |
| `check-markdown-links.cjs` (whole repo) | 25 pre-existing broken links, none in any file this phase touched (spot-checked: unrelated `mcp-click-up`/`sk-code-webflow`/`sk-design-interface` trees) |
| Final literal-string census re-run | 6 remaining `.opencode/specs` hits, all confirmed intentional (compat-symlink explainers this phase added, canonical-first-with-fallback descriptions, dated historical rows, the negative-test fixture) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **glm-high never ran.** REQ-003 was amended to accept single-executor coverage with documented root cause rather than re-attempting the failing lineage; the underlying `fanout-run.cjs` silent-failure gap is unfixed (out of scope).
2. **The 18 "research angle" tree-fence candidates were all false positives.** No genuine diagram/prose staleness beyond the 20 literal-match findings was found; this is reported as a negative result, not assumed as an absence-of-evidence.
3. **F020's fixed prompts/README.md still points at a self-path that doesn't exist.** The `.opencode/specs` → `specs` canonicalization is correct, but the same paths also carry a stale track name (`system-spec-kit` vs the real `system-speckit`) and a stale folder depth (2 levels under `026-...` vs the real 3) from a later document reorganization, unrelated to this migration. The literal example commands in that file still won't resolve as written; fixing that is a separate, out-of-scope change.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skills/sk-doc/references/hvr-rules.md
-->
