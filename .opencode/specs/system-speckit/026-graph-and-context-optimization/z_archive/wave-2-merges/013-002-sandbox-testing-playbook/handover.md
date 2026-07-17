---
title: "Session Handover: Sandbox Testing Playbook [system-spec-kit/026-graph-and-context-optimization/010-doctor-update-orchestrator/002-sandbox-testing-playbook/handover]"
description: "Handover for the doctor command surface + sandbox testing playbook work. 23 scenarios + 23 wrappers authored, mode reduction applied, 2 of 4 fixtures wired (v3.3 + v3.4), nothing actually executed end-to-end. Next agent picks up at: build Docker image OR run harness against existing fixtures OR generate empty/partial fixtures."
trigger_phrases:
  - "002-sandbox-testing-playbook handover"
  - "doctor commands testing handover"
  - "sandbox harness handover"
  - "23--doctor-commands handover"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/z_archive/wave-2-merges/013-002-sandbox-testing-playbook"
    last_updated_at: "2026-05-09T18:35:00Z"
    last_updated_by: "spec-kit-handover"
    recent_action: "Wired v3.4 fixture; harness end-to-end smoke verified; no scenarios actually executed"
    next_safe_action: "Run harness/run-all against v3-3 + v3-4 fixtures in disposable workspace"
    blockers:
      - "empty-state and partial-state fixtures still placeholder"
      - "Docker image never built or smoke-tested"
      - "No CI workflow at .github/workflows/"
    key_files:
      - ".opencode/skills/system-spec-kit/manual_testing_playbook/_sandbox/23--doctor-commands/harness/run-all.sh"
      - ".opencode/skills/system-spec-kit/manual_testing_playbook/_sandbox/23--doctor-commands/fixtures/manifest.json"
      - ".opencode/skills/system-spec-kit/manual_testing_playbook/_sandbox/23--doctor-commands/fixtures/fetch-fixtures.sh"
      - ".opencode/skills/system-spec-kit/manual_testing_playbook/_sandbox/23--doctor-commands/harness/reset-state.sh"
      - ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-doctor-update-orchestrator/002-sandbox-testing-playbook/external/"
      - ".opencode/commands/doctor/assets/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "handover-002-sandbox-testing-playbook-2026-05-09"
      parent_session_id: null
    completion_pct: 95
    open_questions:
      - "Generate empty-state and partial-state fixtures synthetically, or wait on external sources?"
      - "Build Docker image now or defer until CI workflow lands?"
    answered_questions: []
---
# Session Handover: Sandbox Testing Playbook

<!-- SPECKIT_TEMPLATE_SOURCE: handover | v1.0 -->

---

<!-- ANCHOR:handover-summary -->
## 1. Handover Summary

- **From Session:** 2026-05-09 (multi-hour Claude Opus 4.7 session)
- **To Session:** next agent picking up doctor-command sandbox work
- **Phase Completed:** spec packet authoring + scenario authoring + sandbox harness + mode reduction + fixture wiring
- **Phase NOT Completed:** actual scenario execution (zero scenarios run end-to-end)
- **Handover Time:** 2026-05-09T18:35:00Z
- **Branch:** main (no feature branches per memory rule)
<!-- /ANCHOR:handover-summary -->

---

<!-- ANCHOR:context-transfer -->
## 2. Context Transfer

### 2.1 Key Decisions Made

| Decision | Rationale | Impact |
|----------|-----------|--------|
| Reduced doctor command surface from 5 modes to 1 (interactive `_confirm` only) | User directive: "they should all be interactive. no Auto mode" | Deleted 21 mode YAMLs (auto/apply/apply-confirm/default), kept 8 _confirm + 2 mcp |
| Renamed `_confirm.yaml` → bare `doctor_X.yaml` | With single mode, suffix is redundant | 8 yamls renamed; updated path refs across cmd markdown + internal yaml + 013 packet docs |
| Dropped 2 obsolete scenarios (DOC-337 G4 :auto-fresh, DOC-343 :apply skip-status) | These tested deleted modes; no semantic equivalent in single-mode design | Final count: 23 scenarios (IDs 323-336, 338-342, 344-347 — gaps at 337+343 retained per "IDs stable once published" rule) |
| Wired v3.3.0.0-state fixture from external/v3.3.0.1 archive | User placed real release tarball at packet-local `external/` | DOC-345 v3.3→v3.4.1 migration scenario can now actually run |
| Wired v3.4.0.0-state fixture from external/v3.4.0.0 archive | User added second real release | DOC-344, DOC-347, DOC-346 cleanup-legacy scenarios can now run |
| Added `local_path` + `extract_strip_components` to fixture manifest schema | Archives have wrapper directories that must be stripped on extract | fetch-fixtures.sh + reset-state.sh updated to honor these fields |
| Added `.gitignore` rule for `_sandbox/*/fixtures/states/*.tar.gz` | Derived copies from external/, not source-of-truth | Prevents 100+ MB tarballs from being committed |

### 2.2 Blockers Encountered

| Blocker | Status | Resolution/Workaround |
|---------|--------|-----------------------|
| 001-doctor-commands packet had pre-existing TEMPLATE_HEADERS + ANCHORS_VALID drift | open | Same template-manifest pattern that 002 had; can be fixed via cli-codex with 010/003 canonical reference (same fix applied to 002 earlier this session) |
| Frontmatter compact-rule violations after generate-context.js regenerated fields | resolved | Tightened recent_action / next_safe_action to ≤96 chars, no narrative trigger words, verb-prefix on next_safe_action |
| Codex parallel dispatch unreliability per memory rule | mitigated | Used 2-wide batching (P-MEM+P-CAUSAL, then P-LOOP-COCO+P-UPDATE-MIGRATE) + disjoint file paths |
| All 23 scenarios still carry UNAUTOMATABLE marker | informational | Marker reflects that fixtures + sandbox env are needed; with v3.3 + v3.4 wired, DOC-345/346/347 + tier-aware scenarios can now run |
| empty-state and partial-state fixtures don't exist | open | Either synthesize (small empty layout for empty; carefully curated mid-rebuild snapshot for partial) OR wait on external publishing |
| Docker image never built or smoke-tested | open | `docker compose build` + run one scenario inside container would expose any Dockerfile gaps |
| No CI workflow | open | `.github/workflows/sandbox-test.yml` would automate harness/run-all.sh on PR; needs fixture hosting strategy first |

### 2.3 Files Modified (this session, cumulative)

| File / path | Change Summary | Status |
|-------------|---------------|--------|
| `.opencode/commands/doctor/assets/` | Deleted 21 mode YAMLs, renamed 8 _confirm to bare; restructured 5 to canonical banner pattern | complete |
| `.opencode/commands/doctor/*.md` (10 files) | Removed all `:auto`/`:apply`/`:apply-confirm`/`:default` references; reframed mode tables for single-mode design | complete |
| `.../23--doctor-commands/*.md` (23 scenarios) | Rewrote to bare command invocations; dropped DOC-337 + DOC-343 | complete |
| `.../_sandbox/23--doctor-commands/scenarios/*.sh` (23 wrappers) | Bare-command invocations; +x bit set | complete |
| `.../_sandbox/23--doctor-commands/fixtures/manifest.json` | Added local_path + extract_strip_components fields; per-fixture placeholder flag | complete |
| `.../_sandbox/23--doctor-commands/fixtures/fetch-fixtures.sh` | Supports local_path COPY in addition to URL fetch; per-fixture placeholder skip | complete |
| `.../_sandbox/23--doctor-commands/harness/reset-state.sh` | Reads extract_strip_components from manifest | complete |
| `.opencode/specs/.../013-.../002-.../*.md` (packet docs) | spec.md +EXEC SUMMARY/RISK MATRIX/USER STORIES/RELATED DOCS; plan.md +TESTING/DEPENDENCIES/ROLLBACK + L2/L3 sections; tasks.md restructured to canonical Phase 1-3; checklist.md +Code Quality/Testing/Fix Completeness/Security/Documentation/File Org/Verification Summary + L3+ blocks; implementation-summary.md +how-delivered/decisions/limitations anchors; decision-record.md +ADR-001 sub-anchors | complete |
| `.opencode/specs/.../013-.../001-doctor-commands/*.md` | Updated yaml refs to bare names; introduced 5 transient frontmatter regressions during edits, codex auto-corrected most before final read | mostly complete; 2 errors remain (TEMPLATE_HEADERS + ANCHORS_VALID — pre-existing) |
| `.gitignore` | Added rule for `_sandbox/*/fixtures/states/*.tar.gz` | complete |
| `.opencode/specs/.../013-.../graph-metadata.json` | Phase parent metadata refreshed | complete |
| `.opencode/specs/.../013-.../graph-metadata.json` (parent) | active child tracked at parent graph metadata | complete |
<!-- /ANCHOR:context-transfer -->

---

<!-- ANCHOR:next-session -->
## 3. For Next Session

### 3.1 Recommended Starting Point

- **Decide:** which of these tracks to pursue first
  - Track A: actually run the harness end-to-end against the wired v3.3 + v3.4 fixtures (would exercise DOC-345, DOC-344, DOC-346, DOC-347 — the migration + steady-state scenarios)
  - Track B: generate empty-state + partial-state fixtures so the remaining ~17 scenarios can run
  - Track C: build the Docker image (`docker compose build`) and run a single scenario inside the container to exercise the full sandbox boundary
  - Track D: author `.github/workflows/sandbox-test.yml` for CI execution
  - Track E: fix 001 packet pre-existing TEMPLATE_HEADERS + ANCHORS_VALID drift (same fix that resolved 002 earlier this session)

- **Read first:**
  - `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-doctor-update-orchestrator/002-sandbox-testing-playbook/spec.md` (REQ-001..REQ-043 + ADR-008 mode-reduction record)
  - `.opencode/specs/.../002-sandbox-testing-playbook/implementation-summary.md` (deliverable inventory + dispatch results)
  - `.opencode/specs/.../001-doctor-commands/spec.md` (council 10-line orchestrator contract — REQ-004..REQ-017 + ADR-002..ADR-008)

### 3.2 Priority Tasks Remaining

1. **HIGHEST: Run actual scenarios end-to-end.** No scenario has been executed yet. v3.3 + v3.4 fixtures resolve cleanly; harness/run-all.sh --dry-run passes; reset-state.sh smoke-tested in /tmp. The next step is real execution:
   ```bash
   SPECKIT_SANDBOX=1 SPECKIT_WORKSPACE_ROOT=/tmp/doctor_test_ws \
     bash .opencode/skills/system-spec-kit/manual_testing_playbook/_sandbox/23--doctor-commands/harness/run-all.sh
   ```
   Each scenario calls reset-state.sh before invocation per harness design. Evidence collected at `_sandbox/23--doctor-commands/evidence/DOC-NNN/`.

2. **Generate empty-state + partial-state fixtures** (small synthetic archives for the ~17 scenarios that need them — fresh-install, drift-detection, deep-loop empty-no-source, cocoindex daemon-zombie, etc.)

3. **Build + smoke-test Docker image** — `docker compose build` then `docker compose run --rm sandbox bash -c '...harness/run-all.sh'` to verify the container boundary works.

4. **Fix 001 packet drift** — TEMPLATE_HEADERS (21 issues) + ANCHORS_VALID (22 issues). Use 010/003 canonical packet as reference; same approach that fixed 002 (cli-codex high-effort + iterative validation).

5. **Add `.github/workflows/sandbox-test.yml`** — CI execution of harness/run-all.sh on PR/push. Requires fixtures hosted somewhere accessible from CI runners (or generated on-the-fly).

### 3.3 Critical Context to Load

- [ ] Memory: most-recent /memory:save was on 001-doctor-commands packet (covering YAML rename + path-ref updates)
- [ ] Spec packet: `002-sandbox-testing-playbook` (Level 3, REQ-001..REQ-043, 7 ADRs)
- [ ] Sibling packet: `001-doctor-commands` (Level 2, REQ-001..REQ-023, ADR-001..ADR-008 council 10-line + ADR-009 mode-reduction)
- [ ] Phase parent: `010-doctor-update-orchestrator` (lean trio; both children in scope)
- [ ] Memory rules in CLAUDE.md: "Stay on main, no feature branches" + "DELETE not archive" + "On phone → paste full content in chat" + "Stop over-confirming"
<!-- /ANCHOR:next-session -->

---

<!-- ANCHOR:validation-checklist -->
## 4. Validation Checklist

- [x] All in-progress work in working tree (no uncommitted untracked dispatch state lingering)
- [x] Current context saved via `_memory.continuity` frontmatter blocks across packet docs
- [x] Memory save run on 001-doctor-commands at end of YAML rename phase
- [x] No breaking changes mid-implementation (all scripts pass `bash -n`, all yamls pass `yaml.safe_load`, all scenarios pass `validate_document.py`)
- [ ] Tests passing — N/A; no scenario has actually been executed end-to-end yet (this is the open work)
- [x] `harness/run-all.sh --dry-run` exits 0 cleanly
- [x] 002 strict validate PASSED
- [x] 013 phase parent strict validate PASSED
- [ ] 001 strict validate — 2 pre-existing errors (TEMPLATE_HEADERS + ANCHORS_VALID drift; not new from this session)
- [x] Branch is `main`
- [x] This handover document complete
<!-- /ANCHOR:validation-checklist -->

---

<!-- ANCHOR:session-notes -->
## 5. Session Notes

### What worked well
- **cli-codex gpt-5.5 high fast** dispatched well for bulk template restructuring (5 yamls + 6 packet docs in ~12 min) and for the realignment task (50+ files in ~15 min). Iterative dispatch + verification loop produces clean results.
- **Disjoint-path parallelization** (4 cli-codex tracks for scenarios, 1 for harness) avoided write races per memory caveat about codex parallelism.
- **External archive + local_path manifest field** — clean separation of source-of-truth (external/) from derived-cache (fixtures/states/) without any URL infrastructure.
- **Per-fixture `placeholder: true`** lets fetch-fixtures.sh proceed cleanly with partial coverage.

### What didn't work / surprises
- Initial sed pattern for `:confirm` removal missed cases like "in :confirm" and "(if :confirm)" — needed two passes with progressively-targeted patterns.
- `python regex` multi-line removal of RELATED block needed adjustment for the one yaml that used `# RELATED YAML` instead of `# RELATED` banner.
- Manifest.json relative path was off by 1 level (`../../../../../`  vs `../../../../../../`); easy to miscount nested depth.
- generate-context.js regenerates frontmatter fields and can introduce fresh narrative-rule violations; need re-tightening after each save.
- The validator "anchor open/close count mismatch (9/8)" report was a transient state during codex's mid-write; resolved itself when codex finished.

### What's untested
- Actual scenario execution — zero scenarios have been invoked end-to-end. Harness syntax and dry-run are validated, but the real /doctor:* command path hasn't been exercised in any scenario.
- Docker container build — Dockerfile is syntactically valid but `docker compose build` has never been run.
- Fixture content correctness for testing intent — v3.3.0.1 release archive is being USED as v3.3.0.0 source state. Strictly speaking, v3.3.0.1 ≠ v3.3.0.0; the difference might or might not matter for migration testing. This is a known-acceptable approximation per ADR-004 fixture hosting decision but should be re-evaluated if scenarios fail due to schema drift.

### What's next
- Run the harness for real OR generate the 2 remaining fixtures OR build the Docker image. All three are independent and can run in parallel by different agents.

### Memory rules used / honored this session
- "DELETE not archive": physically `rm -f` on 21+4 obsolete YAMLs (no .bak/.archive/_old)
- "Stay on main, no feature branches": branch stayed on `main` throughout
- "Stop over-confirming with A/B/C/D menus": minimized clarification rounds; AskUserQuestion only when scope was ambiguous (auto removal scope, fix approach)
- "On phone → paste full file content in chat": handover content pasted below
- "IDs stable once published": kept gaps at DOC-337 + DOC-343 instead of renumbering
- "Codex parallel dispatch unreliability": 2-wide batching with disjoint paths; serial fallback if hangs
- "Rename verification requires case-insensitive grep": used `grep -ri _confirm` not `grep -r _confirm`
- "generate-context.js wipes parent manual fields": verified parent 013 graph-metadata preserved after each save
- "Compact frontmatter rule": ≤96 chars, no narrative words, verb-prefix on next_safe_action
<!-- /ANCHOR:session-notes -->

---

## 6. Quick Resume Commands

```bash
# 1. Verify current state
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
ls .opencode/commands/doctor/assets/                                                     # 10 yamls expected
ls .opencode/skills/system-spec-kit/manual_testing_playbook/23--doctor-commands/         # 23 .md scenarios
ls .opencode/skills/system-spec-kit/manual_testing_playbook/_sandbox/23--doctor-commands/scenarios/  # 23 .sh wrappers

# 2. Refresh fixtures from external/
.opencode/skills/system-spec-kit/manual_testing_playbook/_sandbox/23--doctor-commands/fixtures/fetch-fixtures.sh

# 3. Dry-run harness (no docker, no doctor commands)
.opencode/skills/system-spec-kit/manual_testing_playbook/_sandbox/23--doctor-commands/harness/run-all.sh --dry-run

# 4. Real run (DESTRUCTIVE — sets up disposable workspace and runs all 23 scenarios)
SPECKIT_SANDBOX=1 SPECKIT_WORKSPACE_ROOT=/tmp/doctor_test_ws_$$ \
  .opencode/skills/system-spec-kit/manual_testing_playbook/_sandbox/23--doctor-commands/harness/run-all.sh

# 5. Validate spec packets
bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh \
  .opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-doctor-update-orchestrator/002-sandbox-testing-playbook --strict
bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh \
  .opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-doctor-update-orchestrator --strict
bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh \
  .opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-doctor-update-orchestrator/001-doctor-commands --strict
```
