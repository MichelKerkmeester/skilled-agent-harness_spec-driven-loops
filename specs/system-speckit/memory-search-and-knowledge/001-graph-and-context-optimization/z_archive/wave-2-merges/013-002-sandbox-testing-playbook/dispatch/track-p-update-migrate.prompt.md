# Codex dispatch: Track P-UPDATE-MIGRATE — 11 scenarios (DOC-337..DOC-347)

## ROLE

You are Codex (gpt-5.5 high fast) dispatched by Claude Opus 4.7 to author 11 manual testing playbook scenarios: 8 for `/doctor:update` orchestrator (DOC-337..DOC-344, covering G4-G9 + 2 extras) + 3 for version-migration end-to-end (DOC-345..DOC-347).

Spec folder (pre-approved, skip Gate 3): `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-doctor-update-orchestrator/002-sandbox-testing-playbook/`

## CANONICAL TEMPLATE SOURCES (read first; treat as locked)

1. `.opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md` — root playbook.
2. `.opencode/skills/system-spec-kit/manual_testing_playbook/04--maintenance/014-*.md` — multi-block TEST EXECUTION example.
3. `.opencode/skills/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/252-cross-runtime-fallback.md` — multi-branch TEST EXECUTION example.

## RUNTIME UNDER TEST

- `.opencode/commands/doctor/update.md` + `.opencode/commands/doctor/assets/doctor_update_{default,auto,confirm,apply,apply-confirm}.yaml` (5 modes)
- `.opencode/skills/system-spec-kit/mcp_server/database/migration-manifest.json` — version migration declarations
- `.opencode/specs/.../013-.../001-doctor-commands/decision-record.md` — ADR-002..ADR-008 (council 10-line spec); ADR-008 (legacy detect-and-recommend)

## IN_SCOPE_FILES (11 files)

```
23--doctor-commands/337-doctor-update-G4-auto-fresh.md
23--doctor-commands/338-doctor-update-G5-confirm-failure-injection.md
23--doctor-commands/339-doctor-update-G6-concurrent.md
23--doctor-commands/340-doctor-update-G7-sigint.md
23--doctor-commands/341-doctor-update-G8-migration-gap.md
23--doctor-commands/342-doctor-update-G9-dashboard.md
23--doctor-commands/343-doctor-update-apply-full-chain.md
23--doctor-commands/344-doctor-update-tier-aware-default.md
23--doctor-commands/345-version-migration-3.3.0.0-to-3.4.1.0.md
23--doctor-commands/346-version-migration-cleanup-legacy.md
23--doctor-commands/347-version-migration-no-op.md
```

(All under `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/manual_testing_playbook/`)

If `23--doctor-commands/` directory doesn't exist, create it.

## OUT_OF_SCOPE

- DO NOT modify root `manual_testing_playbook.md` (Phase C handles)
- DO NOT modify any /doctor:* command Markdown or YAML asset
- DO NOT modify any spec packet docs (or migration-manifest.json)
- DO NOT touch other category folders (01-22)
- DO NOT author any sandbox shell scripts (Phase D handles)

## HARD CONSTRAINTS

(Same 9 constraints as track-p-mem.prompt.md.)

## PER-SCENARIO EDITS

### DOC-337: G4 — `:auto --no-snapshot` on already-fresh repo

- Preconditions: all 6 SQLite DBs fresh (recent reindex); repo at v3.4.1.0; `--no-snapshot` flag set.
- Prompt: "Run /doctor:update :auto --no-snapshot. The repo is already fresh."
- Expected: dashboard renders all 7 subsystems FRESH; no rebuilds triggered; exits 0.
- Evidence: dashboard output captured; no `*.bak` snapshot files created.

### DOC-338: G5 — `:confirm` with forced-failure injection

- Preconditions: env var `SPECKIT_FAIL_STEP=causal-edges-init` injects a synthetic failure mid-run.
- Prompt: "Run /doctor:update :confirm. We'll force a failure on causal-edges-init to test rollback."
- Expected: tier-aware confirm prompts user; failure caught; user prompted with retry/rollback/leave; rollback restores affected DB from snapshot.
- Evidence: prompt outputs captured; rollback log entry; affected DB matches pre-snapshot.

### DOC-339: G6 — Concurrent dispatch refusal (flock)

- Preconditions: launch 2 `/doctor:update :auto` invocations within 1 second.
- Prompt: "Launch two /doctor:update :auto invocations concurrently. Verify the second is refused via flock."
- Expected: first acquires `.doctor-update.flock`; second refused with helpful message including holding PID + start timestamp.
- Evidence: refusal output captured; only one process touched the DBs.

### DOC-340: G7 — SIGINT mid-rebuild

- Preconditions: long-pole `:apply` in progress (memory rebuild step).
- Prompt: "Start /doctor:update :apply, then Ctrl-C ~30 sec into the memory rebuild step."
- Expected: SIGINT caught at orchestrator; current SQLite tx commits cleanly (~5 sec settle per ADR-001); snapshot of in-flight DB restored; state log written; exit 130.
- Evidence: state log content; affected DB matches pre-rebuild snapshot; exit code 130.

### DOC-341: G8 — Migration gap detection

- Preconditions: synthetic version (e.g., `2.9.0.0`) declared as installed via env var override.
- Prompt: "Run /doctor:update --migrate from synthetic version 2.9.0.0. Verify manifest gap detection refuses cleanly."
- Expected: orchestrator reads `migration-manifest.json`; detects 2.9.0.0 NOT in `valid_source_versions`; refuses with "no migration path declared from <version>" message.
- Evidence: refusal output captured; no DBs mutated.

### DOC-342: G9 — Cross-subsystem dashboard render

- Preconditions: all 7 subsystems present (code-graph, context-index, causal-edges, skill-graph, deep-loop-graph, cocoindex, eval); various health states.
- Prompt: "Run /doctor:update :auto and verify the cross-subsystem dashboard renders all 7 subsystems with status + age + recommended action."
- Expected: dashboard shows 7 rows with FRESH/DEGRADED/STALE/MISSING + age (last_indexed_at) + recommended action per row.
- Evidence: dashboard output captured; row count = 7.

### DOC-343: `:apply` autonomous + skip-status — full chain

- Preconditions: any state.
- Prompt: "Run /doctor:update :apply. Skip the status check and run all 6 rebuilds in dependency order."
- Expected: bypasses status decision gate; runs full chain (code_graph_scan → memory_index_scan → causal-edges-init → skill_graph_scan → deep_loop_graph_upsert → eval_run_ablation); snapshots all DBs; gold-battery per step.
- Evidence: state log shows all 6 steps executed; per-step duration recorded.

### DOC-344: Tier-aware default mode (no suffix)

- Preconditions: mixed-state subsystems (some FRESH, some STALE).
- Prompt: "Run /doctor:update (no mode suffix). Verify short steps run silent, medium combine-prompts, long-pole memory rebuild prompts with ETA."
- Expected: skill-graph + deep-loop init run silently; code-graph + eval combined-prompt fires; memory rebuild prompts with explicit "5-15 min runtime, proceed?" message.
- Evidence: prompt sequence captured; tier classification matches.

### DOC-345: Version migration 3.3.0.0 → 3.4.1.0 end-to-end

- Preconditions: fresh clone of public repo at tag `v3.3.0.0`; no doctor commands present yet (need to first install 3.4.1.0).
- Prompt: "Simulate a new user at v3.3.0.0. They git-pull to current. Run /doctor:update --migrate."
- Expected: orchestrator reads `migration-manifest.json`; runs migration chain `3.3.0.0 → 3.4.0.0 → 3.4.1.0`; legacy `memory/*.md` files flagged but not deleted (detect-and-recommend per ADR-008).
- Evidence: state log shows 2-hop migration; legacy files present + flagged in output; new schema active.
- **UNAUTOMATABLE if no v3.3.0.0 fixture available; mark accordingly.**

### DOC-346: Cleanup-legacy with prompts

- Preconditions: post-DOC-345 state — legacy files present + flagged.
- Prompt: "Run /doctor:update --cleanup-legacy. Per-file prompt before each deletion."
- Expected: per-file prompt fires for each known-legacy file; user confirms or skips; deletions executed only after confirm.
- Evidence: prompt sequence captured; deletions match user choices; refused files preserved.

### DOC-347: Already-current no-op

- Preconditions: repo at v3.4.1.0; manifest's `current_version` matches.
- Prompt: "Run /doctor:update --migrate from v3.4.1.0. Verify it's a no-op."
- Expected: orchestrator detects source == current_version; skips migration phase entirely; runs steady-state rebuild (or status-only check).
- Evidence: state log shows migration skipped; no migration scripts executed.

## VERIFICATION

```bash
SKDOC=".opencode/skills/sk-doc/scripts"
echo "=== Files ==="; ls -la .opencode/skills/system-spec-kit/manual_testing_playbook/23--doctor-commands/3{3[7-9],4[0-7]}-*.md 2>&1

echo "=== validate_document per file ==="
for f in .opencode/skills/system-spec-kit/manual_testing_playbook/23--doctor-commands/3{3[7-9],4[0-7]}-*.md; do
  python3 "$SKDOC/validate_document.py" --json --type playbook_feature "$f" 2>&1 | grep -E '"valid"|"total_issues"' | head -2 | sed "s|^|$f: |"
done

echo "=== Section + subsection counts ==="
for f in .opencode/skills/system-spec-kit/manual_testing_playbook/23--doctor-commands/3{3[7-9],4[0-7]}-*.md; do
  h2=$(grep -cE '^## (1\. OVERVIEW|2\. SCENARIO CONTRACT|3\. TEST EXECUTION|4\. SOURCE FILES|5\. SOURCE METADATA)' "$f")
  h3=$(grep -cE '^### (Prompt|Commands|Expected|Evidence|Pass / Fail|Failure Triage)' "$f")
  echo "$(basename $f): h2=$h2 h3=$h3"
done

echo "=== YAML asset citation per file ==="
for f in .opencode/skills/system-spec-kit/manual_testing_playbook/23--doctor-commands/3{3[7-9],4[0-7]}-*.md; do
  echo "$(basename $f): $(grep -cE 'doctor_update_|migration-manifest.json' "$f")"
done
```

## OUTPUT REQUIREMENT + MEMORY HANDBACK

(Same as track-p-mem.prompt.md.)
