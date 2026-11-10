# Codex dispatch: Track P-MEM — 5 /doctor:memory scenarios (DOC-323..DOC-327)

## ROLE

You are Codex (gpt-5.5 high fast) dispatched by Claude Opus 4.7 to author 5 manual testing playbook scenarios covering `/doctor:memory` command modes. Each scenario tests a distinct user-observable behavior of the canonical `/doctor:memory` command.

Spec folder (pre-approved, skip Gate 3): `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-doctor-update-orchestrator/002-sandbox-testing-playbook/`

## CANONICAL TEMPLATE SOURCES (read first; treat as locked)

1. **`/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md`** — root playbook execution policy, verdict rules (PASS/FAIL/SKIP/UNAUTOMATABLE), Section 12 cross-reference shape.
2. **`/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/manual_testing_playbook/04--maintenance/014-workspace-scanning-and-indexing-memory-index-scan.md`** — multi-block TEST EXECUTION example.
3. **`/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/manual_testing_playbook/04--maintenance/035-startup-runtime-compatibility-guards.md`** — single-block TEST EXECUTION example.

## RUNTIME UNDER TEST

4. **`.opencode/commands/doctor/memory.md`** — Markdown entrypoint for `/doctor:memory`.
5. **`.opencode/commands/doctor/assets/doctor_memory_{auto,confirm,apply,apply-confirm}.yaml`** — 4 mode YAMLs (already polished with upstream_assets, _invariant, field_handling, inline comments).
6. **`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-doctor-update-orchestrator/001-doctor-commands/spec.md`** — REQ-001..REQ-023 + per-command spec.
7. **`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-doctor-update-orchestrator/001-doctor-commands/decision-record.md`** — ADR-001 (memory_index_scan tx model: per-file, ~5s SIGINT settle).

## IN_SCOPE_FILES (only these may be created)

- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/manual_testing_playbook/23--doctor-commands/323-doctor-memory-fresh-install.md`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/manual_testing_playbook/23--doctor-commands/324-doctor-memory-drift-detection.md`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/manual_testing_playbook/23--doctor-commands/325-doctor-memory-long-pole-rebuild.md`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/manual_testing_playbook/23--doctor-commands/326-doctor-memory-sigint-cancellation.md`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/manual_testing_playbook/23--doctor-commands/327-doctor-memory-disk-pressure.md`

If `23--doctor-commands/` directory doesn't exist, create it.

## OUT_OF_SCOPE (forbidden)

- DO NOT modify root `manual_testing_playbook.md` (Phase C will do that)
- DO NOT modify any /doctor:* command Markdown or YAML asset
- DO NOT modify any spec packet docs (001/002 already authored)
- DO NOT touch other category folders (01-22)
- DO NOT author any sandbox shell scripts (Phase D will do that)

## HARD CONSTRAINTS

1. Each `.md` follows canonical 5-section structure exactly: `## 1. OVERVIEW`, `## 2. SCENARIO CONTRACT`, `## 3. TEST EXECUTION`, `## 4. SOURCE FILES`, `## 5. SOURCE METADATA`.
2. Frontmatter required: `title` (format `"DOC-NNN -- <feature name>"`) + `description`.
3. Length 75-200 LOC per file (target ~150).
4. Filename pattern matches `NNN-feature-id-slug.md` (already provided in IN_SCOPE_FILES).
5. Each file passes `python3 .opencode/skills/sk-doc/scripts/validate_document.py --type playbook_feature <file>` with `valid: true`.
6. Section 3 (TEST EXECUTION) includes `### Prompt`, `### Commands`, `### Expected`, `### Evidence`, `### Pass / Fail`, `### Failure Triage` subsections.
7. Section 4 (SOURCE FILES) cites the matching YAML asset path: `.opencode/commands/doctor/assets/doctor_memory_<mode>.yaml`.
8. Real-execution policy: scenarios MUST be runnable for real (not mocked); use PASS/FAIL/SKIP/UNAUTOMATABLE classification.
9. Prompt voice: natural-human (default) or RCAF; choose per scenario.

## PER-SCENARIO EDITS

### DOC-323: Fresh Install (no prior context-index)

- Tests: `:apply` mode bootstrap on a workspace that has never run `memory_index_scan`.
- Preconditions: `mcp_server/database/context-index.sqlite` does NOT exist.
- Prompt: "Bootstrap the memory continuity-index from scratch. The workspace has no `context-index.sqlite` yet."
- Expected: `:apply` creates schema, runs initial scan, gold-battery succeeds against the empty corpus or the initial seed.
- Evidence: `context-index.sqlite` exists post-run; gold-battery exit 0.

### DOC-324: Drift Detection (existing index, modified markdown)

- Tests: `:auto` mode reports drift when source files change after indexing.
- Preconditions: `context-index.sqlite` populated; modify 3 markdown files (e.g., spec docs) without re-running index.
- Prompt: "Run memory health check. I just edited a few spec docs and want to know if the index has drift."
- Expected: `:auto` returns DEGRADED with `recommend: /doctor:memory:apply --incremental=true`.
- Evidence: drift report cites the 3 modified files; recommendation includes incremental.

### DOC-325: Long-pole Rebuild (`--incremental=false`)

- Tests: full rebuild path with explicit ETA prompt + 5-15 min runtime + snapshot creation.
- Preconditions: `context-index.sqlite` populated.
- Prompt: "Force a full rebuild of the memory index. I changed embedding provider and need fresh vectors."
- Expected: ETA prompt fires (5-15 min); snapshot via VACUUM INTO creates `.bak` file; `:apply --incremental=false` runs; gold-battery exit 0; snapshot retained for 30 days.
- Evidence: snapshot file exists; rebuild duration recorded in state log; gold-battery output captured.

### DOC-326: SIGINT Cancellation (destructive — checkpoint + restore)

- Tests: graceful cancel mid-rebuild + ~5s settle window + snapshot restore.
- Preconditions: snapshot exists; rebuild in progress; **must SKIP if no Docker daemon** (per ADR-001 the test only matters with real per-file tx).
- Prompt: "Start a full rebuild and Ctrl-C it after ~30 seconds. Verify the index isn't half-rebuilt."
- Expected: SIGINT caught; current per-file tx commits or aborts within ~5s; snapshot restored; exit 130.
- Evidence: state log records cancel timestamp; index post-cancel matches pre-rebuild snapshot; exit code 130.
- Failure Triage: if exit code != 130 OR index differs from snapshot → FAIL.
- **Mark verdict UNAUTOMATABLE if Docker isn't available.**

### DOC-327: Disk Pressure Refusal

- Tests: pre-flight check refuses if disk free < 2× DB total.
- Preconditions: simulate disk pressure (truncate fixture so `df` reports <600 MB free).
- Prompt: "Run `:apply` with disk near full. Verify the command refuses cleanly."
- Expected: pre-flight check fires; refusal message includes free vs required; exit non-zero with clear diagnostic.
- Evidence: refusal output captured; index untouched; no snapshot created.

## VERIFICATION (run after authoring; paste output)

```bash
SKDOC=".opencode/skills/sk-doc/scripts"
echo "=== Files created ==="
ls -la .opencode/skills/system-spec-kit/manual_testing_playbook/23--doctor-commands/3{2[3-7]}-*.md 2>&1

echo "=== Markdown validation per file ==="
for f in .opencode/skills/system-spec-kit/manual_testing_playbook/23--doctor-commands/3{2[3-7]}-*.md; do
  result=$(python3 "$SKDOC/validate_document.py" --type playbook_feature --json "$f" 2>&1 | grep -E '"valid"|"total_issues"' | head -2)
  echo "$f → $result"
done

echo "=== 5-section structure check per file ==="
for f in .opencode/skills/system-spec-kit/manual_testing_playbook/23--doctor-commands/3{2[3-7]}-*.md; do
  echo "--- $(basename $f) ---"
  grep -cE '^## (1\. OVERVIEW|2\. SCENARIO CONTRACT|3\. TEST EXECUTION|4\. SOURCE FILES|5\. SOURCE METADATA)' "$f"
done

echo "=== TEST EXECUTION subsection check (6 subsections expected) ==="
for f in .opencode/skills/system-spec-kit/manual_testing_playbook/23--doctor-commands/3{2[3-7]}-*.md; do
  echo "--- $(basename $f) ---"
  grep -cE '^### (Prompt|Commands|Expected|Evidence|Pass / Fail|Failure Triage)' "$f"
done

echo "=== YAML asset citation check ==="
for f in .opencode/skills/system-spec-kit/manual_testing_playbook/23--doctor-commands/3{2[3-7]}-*.md; do
  echo "--- $(basename $f) ---"
  grep -c 'doctor_memory_' "$f"
done
```

## OUTPUT REQUIREMENT

1. Files created with one-line rationale each.
2. Verification block output pasted.
3. Constraint compliance yes/no per Hard Constraint 1-9.
4. Halt-and-report on any violation.

## MEMORY HANDBACK

Concise `MEMORY_HANDBACK` block (~10 lines): files created, validation status per file, deviations, recommended next track.
