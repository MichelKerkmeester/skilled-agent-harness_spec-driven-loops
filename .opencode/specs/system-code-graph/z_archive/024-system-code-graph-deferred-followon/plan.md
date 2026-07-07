---
title: "Implementation Plan: system-code-graph deferred follow-on (039)"
description: "Phased plan for closing 038's deferred P1 items + 037's P2 batch — verify-first discipline, parallel-aware, ship v1.0.2.0."
trigger_phrases:
  - "039 plan"
  - "v1.0.2.0 plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-code-graph/z_archive/024-system-code-graph-deferred-followon"
    last_updated_at: "2026-05-15T18:05:00Z"
    last_updated_by: "claude-opus-4-7-039-scaffold"
    recent_action: "plan_authored"
    next_safe_action: "await_user_dispatch_authorization"
    blockers: []
    key_files: ["plan.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-05-15-039-deferred-followon"
      parent_session_id: null
    completion_pct: 5
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: 039 Deferred Follow-on

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Four-phase plan: (1) Verification sweep — re-check every finding against current main HEAD before any code changes (parallel agent may have closed items). (2) Build + test infra — package.json gitignore decision, scripts block, dist materialization, new vitest files. (3) Config parity + doctor — INDEX_* flag alignment, _NOTE_* convention fixes, doctor mkdir. (4) P2 batch — cap at 10 highest-impact P2s; defer the rest to packet 040 if pursued. Ship v1.0.2.0 changelog at the end.

Recommended executor: `cli-opencode --pure --model deepseek/deepseek-v4-pro` for code-touching phases (2 + 3); manual or `cli-codex gpt-5.5 high fast` for doc/config phases (1 verification sweep + 4 P2 triage).

<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

- Each phase: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <packet> --strict` exits 0.
- Phase 1B: `wc -c mcp_server/dist/index.js > 1000`.
- Phase 1C + 1D: `npx vitest run <new-test-file>` exits 0; each new test has ≥80% branch coverage on its target module.
- Phase 1E: `npx vitest run mcp_server/stress_test/code-graph/doctor-apply-mode-stress.vitest.ts` exits 0 (all tests pass, including restored).
- Phase 2: each config file passes `jq empty <file>` (valid JSON) or `python3 -c "import toml; toml.load(open('.codex/config.toml'))"` (valid TOML).
- Phase 4: full `npx tsc --noEmit -p tsconfig.json` clean from `system-code-graph/mcp_server/`; full `npx vitest run` exits 0.

<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

```
039 Phase 0 (manual): re-verify each finding via grep + read against current main
    │
    ├──► Phase 1: build + test infra
    │     ├─ 1A: package.json gitignore decision + scripts block
    │     ├─ 1B: npm install + npm run build → real dist/index.js
    │     ├─ 1C: NEW tests/runtime-detection.vitest.ts
    │     ├─ 1D: NEW tests/exclude-rule-classifier.vitest.ts
    │     └─ 1E: doctor-apply-mode-stress skip-test restoration
    │
    ├──► Phase 2: config parity + doctor (sequential)
    │     ├─ 2A: SPECKIT_CODE_GRAPH_INDEX_* defaults aligned across 6 configs
    │     ├─ 2B: _NOTE_1_DB convention in .claude/mcp.json + .gemini/settings.json
    │     ├─ 2C: _NOTE_AUTO_MIGRATION in .vscode/mcp.json
    │     └─ 2D: mcp-doctor.sh fix-mode mkdir for mk_code_index
    │
    ├──► Phase 3: P2 batch triage (cap at 10 items)
    │
    └──► Phase 4: v1.0.2.0 changelog + strict validate + push
```

<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 0 — Verification sweep (manual, ~15 min)

Re-check each finding against current main HEAD using `rg` / `jq` / `wc`. Mark each as STILL-OPEN, CLOSED-BY-PARALLEL, or REVISED.

**Findings to re-check**:
- P1-A4 (`feature_catalog.md` structure drift)
- P1-A5 (playbook misclassification + Devin scenario length)
- P1-D1 (test files for runtime-detection + exclude-rule-classifier)
- P1-D2 (stress-test move/delete — parallel agent already deleted; verify intent)
- P1-D3 (doctor-apply-mode-stress skip tests at L125, L184)
- P1-F1 (`package.json` scripts block — gitignore decision)
- P1-F2 (`mcp_server/dist/index.js` stub)
- P1-G1 (`mcp-doctor.sh` fix-mode mkdir)
- P1-H1 (`SPECKIT_CODE_GRAPH_INDEX_*` flag default consistency)
- P1-H2 (`_NOTE_1_DB` convention in 2 configs)
- P1-H3 (`_NOTE_AUTO_MIGRATION` in `.vscode/mcp.json`)

**Output**: a Phase-0 verification table in `tasks.md` mapping each ID → status. STILL-OPEN items flow into Phase 1-3.

### Phase 1 — Build + test infra (BATCH 1: 3 concurrent + 1 sequential)

- **1A** [SEQUENTIAL FIRST] — Package.json gitignore decision: Open Question 1 (default = "track"); update `.opencode/.gitignore` to remove `package.json` exclusion for `system-code-graph/`; commit the local-scripts version with `build`, `typecheck`, `test`, `test:watch`, `clean`, `rebuild` per the existing local edit + parallel agent's additions.
- **1B** [SEQUENTIAL AFTER 1A] — Run `npm install` + `npm run build` from `system-code-graph/`; verify `mcp_server/dist/index.js` > 1000 bytes; commit `package-lock.json` if changed (already tracked).
- **1C** [CONCURRENT WITH 1D, 1E] — NEW `tests/runtime-detection.vitest.ts`: mirror `code-graph-cluster-a.vitest.ts` style; cover all runtime detection branches + env var parsing + hook policy edge cases; ≥80% branch coverage.
- **1D** [CONCURRENT WITH 1C, 1E] — NEW `tests/exclude-rule-classifier.vitest.ts`: JSON schema validation (good + bad), tier classification, pattern loading, error handling.
- **1E** [CONCURRENT WITH 1C, 1D] — Skip-test restoration: read `doctor-apply-mode-stress.vitest.ts:125, 184`; provide minimal mock OR replace `it.skip` with a documented `it.todo` + comment block.

### Phase 2 — Config parity + doctor (SEQUENTIAL, 4 small edits)

Sequential because each touches separate config files but the work is small + the risk of merge friction with parallel agent suggests one-at-a-time.

- **2A** — Align `SPECKIT_CODE_GRAPH_INDEX_*` defaults to `"false"` in `opencode.json`, `.claude/mcp.json`, `.gemini/settings.json` (3 files flip 5 flags each).
- **2B** — Add `_NOTE_1_DB` and rename `_NOTE_1_TOOLS` → `_NOTE_2_TOOLS` in `.claude/mcp.json` + `.gemini/settings.json` (2 files).
- **2C** — Add `_NOTE_AUTO_MIGRATION` to `.vscode/mcp.json` mk-spec-memory env block (1 file).
- **2D** — Add `mkdir -p "$db_dir"` to `mcp-doctor.sh` `diagnose_mk_code_index` fix-mode branch (1 file).

### Phase 3 — P2 batch triage (cap at 10)

Iterate through 037's iter-001..020 per-iteration markdown files; extract P2 findings; rank by impact (operator-pain + framework-correctness); pick top 10; remediate; document the remaining ~20 in a deferral note.

### Phase 4 — Ship v1.0.2.0

- Author `.opencode/skills/system-code-graph/changelog/v1.0.2.0.md` with HONEST scope (what's closed, what's deferred to 040).
- Bump SKILL.md version if the parallel agent hasn't already.
- Strict validate the 039 packet.
- Final commit + push.

<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

- Phase 0 (verification sweep) → blocks Phase 1, 2, 3 (need STILL-OPEN list before remediation).
- Phase 1A → blocks 1B (build needs scripts).
- Phase 1B → blocks Phase 4 (changelog references dist size).
- Phase 1C, 1D, 1E → independent of each other; can run concurrently.
- Phase 2A → 2B → 2C → 2D (sequential by design).
- Phase 3 → independent of Phase 1, 2 (different files).
- Phase 4 → all phases must complete first.

<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Wall-clock | Executor |
|-------|-----------|----------|
| Phase 0 verification | ~15 min | manual or cli-codex |
| Phase 1 build + tests | ~30-45 min | cli-opencode (1A/1B sequential, 1C/1D/1E concurrent) |
| Phase 2 config parity | ~15 min | manual (small surgical edits) |
| Phase 3 P2 batch (cap 10) | ~30-60 min | cli-codex or manual |
| Phase 4 changelog + ship | ~10 min | manual |
| **Total** | **~100-150 min** | mixed |

<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:quality-gates-bottom -->
## 6. LEGACY QUALITY GATES POSITION

(Section reserved; canonical Quality Gates now in §2 per Level 2 manifest order.)

<!-- /ANCHOR:quality-gates-bottom -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

- **Unit**: 2 new vitest files (1C, 1D) cover previously-untested lib modules.
- **Stress**: skip restorations (1E) bring 2 tests back online.
- **Build**: Phase 1B produces a real compiled dist.
- **Integration**: full vitest suite passes post-Phase 1.
- **Config validity**: Phase 2 JSON/TOML files parse cleanly.
- **MCP boot smoke** (Phase 4): `node .opencode/bin/mk-code-index-launcher.cjs` starts the server cleanly + `code_graph_status` returns the expected shape.

<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- Parallel agent's 058/4* SKILL/README/references commits stable (verified during Phase 0).
- Packet 038 commits cdc56b7c1 + 6553e36da + 6b6f41214 + c8f4432c3 already on main.
- `cli-opencode --model deepseek/deepseek-v4-pro --pure </dev/null` invocation works (verified in 038 Phase 1+2).

<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Per-phase commits keep rollback granular:
- Phase 1A failure: `git revert <commit>` — local-only impact (package.json scripts removed).
- Phase 1B failure: dist stays as previous state; no harm.
- Phase 1C/1D failure: revert the new test file commits.
- Phase 1E failure: revert; tests stay skipped (no regression).
- Phase 2 failure: per-file revert (each config edit is its own commit).
- Phase 3 failure: revert the P2 batch commit.
- Phase 4 failure: revert v1.0.2.0 changelog; ship as v1.0.1.x patch instead.

<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

Use commit-baseline-per-phase pattern:
- Capture `git rev-parse HEAD` before each phase → write to `scratch/baseline-phase-N.sha`.
- If a phase produces unacceptable regression, `git revert <phase-merge-commit>` or `git reset --hard <baseline>` (if safe).
- Phase 4's final commit can be amended (or reverted-then-re-amended) if changelog wording needs revision.

<!-- /ANCHOR:enhanced-rollback -->
