---
title: "Implementation Summary"
description: "advisor_status and skill_graph_status now agree on index staleness through one shared hash recipe, skillCount counts skill roots, and the doctor freshness panel names a stale compiled graph and a degraded absent-SQLite diff."
trigger_phrases:
  - "implementation summary"
  - "what shipped"
  - "validation evidence"
  - "continuation notes"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/033-advisor-status-truthfulness/001-freshness-and-scan-truth"
    last_updated_at: "2026-10-03T07:30:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Shipped and verified phase 1"
    next_safe_action: "Parent session reviews the diff and commits the packet"
    blockers: []
    key_files:
      - ".skilled/skills/system-skill-advisor/runtime/handlers/advisor-status.ts"
      - ".skilled/skills/system-skill-advisor/runtime/handlers/skill-graph/status.ts"
      - ".skilled/commands/doctor/scripts/skill-graph-freshness.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-001-freshness-and-scan-truth"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 001-freshness-and-scan-truth |
| **Status** | Complete |
| **Completed** | 2026-10-03 |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Verdict: done. The two advisor status surfaces now give the same answer about the same index, and the doctor freshness panel says what it could not check. Before this phase `advisor_status` answered `live` with `skillCount: 20` while `skill_graph_status` reported all 14 sources changed. After it, both report 14 fresh sources and 14 skills.

### Phase 1: freshness-and-scan-truth

The disagreement had a different root cause than the audit recorded. The index was current. `skill_graph_status` hashed the raw file, but the indexer stores a hash of the sanitizer version line plus the file, so every source looked changed. A probe over all 14 rows matched 14 of 14 on the indexer's recipe and 0 of 14 on the raw one. The fix puts the recipe in one exported function, `computeSkillMetadataContentHash`, used by the indexer, by `skill_graph_status`, and by a new read-only `indexStaleness` comparison in `advisor_status`. When that comparison finds a stored hash that differs from disk, `advisor_status` can no longer answer `live`: freshness drops to `stale`, the trust state follows, and `errors` names the skill count and `advisor_rebuild`. A missing or unreadable database reports `unavailable` with a reason and leaves freshness alone.

`skillCount` now counts skill roots, the non-dot directories directly under `.skilled/skills` that hold a `graph-metadata.json`, so the six spec-kit test fixtures no longer count. The scan cap still applies and still reports truncation.

The doctor freshness panel gained four lines and kept every existing one in order. It states its depth-1 scan rule, prints a `STALE COMPILED` line naming the compiled `generated_at` and the newest on-disk stamp with its skill, prints a `DEGRADED` line naming an absent or unreadable SQLite or compiled source and the checks that did not run, and prints family mismatches as `skill <id> (family disk=<f> ...)`. An unparseable compiled JSON or an unexpected error is reported instead of crashing, and the panel still always exits 0.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts` | Modified | Export `computeSkillMetadataContentHash`; the indexer uses it |
| `.skilled/skills/system-skill-advisor/runtime/handlers/skill-graph/status.ts` | Modified | Staleness compares with the indexer's recipe |
| `.skilled/skills/system-skill-advisor/runtime/handlers/advisor-status.ts` | Modified | `indexStaleness`, stale downgrade, root-only `skillCount` |
| `.skilled/skills/system-skill-advisor/runtime/schemas/advisor-tool-schemas.ts` | Modified | Optional strict `indexStaleness` output object |
| `.skilled/skills/system-skill-advisor/runtime/tests/handlers/advisor-status.vitest.ts` | Modified | Fresh, stale, absent-database, nested-fixture and cap cases |
| `.skilled/skills/system-skill-advisor/runtime/tests/handlers/skill-graph-status-hash.vitest.ts` | Created | Pins that a current index reports fresh |
| `.skilled/commands/doctor/scripts/skill-graph-freshness.cjs` | Modified | Scan rule, stale-compiled, degraded and disambiguated family lines |
| `.skilled/skills/system-skill-advisor/runtime/tests/doctor/skill-graph-freshness-panel.vitest.ts` | Created | Six panel cases run against fixture trees |
| `.skilled/commands/doctor/assets/doctor-skill-graph-freshness.yaml` | Modified | Route invariant names the new lines |
| `.skilled/skills/system-skill-advisor/feature-catalog/cli-surface/advisor-status.md` | Modified | `indexStaleness` and root-only `skillCount` semantics |
| `.skilled/skills/system-skill-advisor/feature-catalog/cli-surface/skill-graph-status.md` | Modified | The shared hash recipe |
| `.skilled/skills/system-skill-advisor/feature-catalog/daemon-and-freshness/rebuild-from-source.md` | Modified | A rebuild clears a stale index verdict |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

GPT-6 Luna wrote the runtime change, and DeepSeek V4.1 Flash wrote the panel change, the docs and the panel test. Each diff was read before the next dispatch and its checks were rerun here. The runtime was rebuilt and this worktree's daemon restarted on the new build before the live status pair was taken. Evidence lives in `scratch/baseline.md`, `scratch/recon.md` and `scratch/verification.md`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Fix the hash recipe at its producer and share it | The measured cause of the disagreement was two recipes. Making `advisor_status` adopt the broken comparison would have turned a false `changed: 14` into a permanent false `stale` |
| Report `indexStaleness` as its own field and downgrade `live` only on `stale` | Consumers can read the evidence directly; `unavailable` evidence never fakes staleness |
| Compute index staleness on every successful status read | It costs one read-only open and 14 small file hashes, and a `live` answer on the recommend path should mean the same thing |
| Put the panel test in the advisor runtime suite | The doctor `scripts/tests/` folder is outside this orchestrator's file ownership; the vitest spawns the real script against fixture trees |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `npx vitest run tests/handlers/advisor-status.vitest.ts` | PASS, 16/16 before the embeddings work, 24/24 with it (later phase) |
| `npx vitest run tests/doctor/skill-graph-freshness-panel.vitest.ts` | PASS, 6/6 |
| `npx vitest run tests/handlers tests/skill-graph` | PASS, 19 files, 110 passed, 1 skipped |
| `npm run typecheck` (runtime) | PASS, exit 0 |
| `npm run build` (runtime) | PASS, exit 0 |
| Live `advisor_status` after rebuild | `freshness: live`, `skillCount: 14`, `indexStaleness.state: fresh` 14/14 |
| Live `skill_graph_status` | `totalSkills: 14`, `freshSourceFiles: 14`, `changedSourceFiles: 0` |
| Panel, real artifact | exit 0; `STALE COMPILED ... 2026-09-29T07:49:34.068437+00:00 is older than ... 2026-09-29T09:00:00Z (cli-classifier)` |
| Panel, `SYSTEM_SKILL_ADVISOR_DB_DIR` at an empty dir | exit 0; `DEGRADED: SQLite skill-graph.sqlite absent at /tmp/advisor-db-absent-probe/skill-graph.sqlite; ...` |
| `rg -n "z_archive" skill-graph-freshness.cjs` | no match, exit 1 |
| `bash .skilled/commands/doctor/scripts/route-validate.sh` | `OK: route-validate - 9 routes validated, 2 warnings`, exit 0 |
| Full runtime suite `npx vitest run` | 133 of 135 files passed before the cross-packet description fix; the whole suite is green after it (135/135 files, see phase 2) |
| `validate.sh --recursive --strict` | see the parent closing run |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The parity suites needed a cross-packet fix.** Three `tests/parity` failures came from the shared hash recipe landing together with a trimmed `sk-code` description. Phase 2 records the measurement and the fix; the suite is green.
2. **Resolved since: the compiled `skill-graph.json` is fresh.** After merging main the panel reports `STALE COMPILED: none` (generated 2026-10-02T13:09:40Z, newest source stamp 2026-10-02T12:00:00Z), with 14 skills in the compiled graph, SQLite and on disk.
3. **A running daemon keeps old code until it restarts.** The shim refuses a stale dist, but a warm daemon serves what it loaded.
<!-- /ANCHOR:limitations -->

---

## Handed Off

None. No file outside this orchestrator's ownership needed a change.
