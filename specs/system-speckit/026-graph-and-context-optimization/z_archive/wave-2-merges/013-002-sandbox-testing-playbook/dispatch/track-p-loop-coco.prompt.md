# Codex dispatch: Track P-LOOP-COCO — 6 scenarios (DOC-331..DOC-336)

## ROLE

You are Codex (gpt-5.5 high fast) dispatched by Claude Opus 4.7 to author 6 manual testing playbook scenarios: 3 for `/doctor:deep-loop` (DOC-331..DOC-333) + 3 for `/doctor:cocoindex` (DOC-334..DOC-336).

Spec folder (pre-approved, skip Gate 3): `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-doctor-update-orchestrator/002-sandbox-testing-playbook/`

## CANONICAL TEMPLATE SOURCES (read first; treat as locked)

1. `.opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md` — root playbook.
2. `.opencode/skills/system-spec-kit/manual_testing_playbook/04--maintenance/014-*.md` — multi-block TEST EXECUTION example.
3. `.opencode/skills/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/252-cross-runtime-fallback.md` — multi-branch TEST EXECUTION example.

## RUNTIME UNDER TEST

- `.opencode/commands/doctor/deep-loop.md` + `.opencode/commands/doctor/assets/doctor_deep-loop_*.yaml` (4 modes)
- `.opencode/commands/doctor/cocoindex.md` + `.opencode/commands/doctor/assets/doctor_cocoindex_*.yaml` (4 modes)
- 001 packet spec + decision-record (deep-loop convergence gold-battery; cocoindex daemon idempotency from 3.4.1.0)

## IN_SCOPE_FILES (6 files)

- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/manual_testing_playbook/23--doctor-commands/331-doctor-deep-loop-lazy-init.md`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/manual_testing_playbook/23--doctor-commands/332-doctor-deep-loop-empty-no-source.md`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/manual_testing_playbook/23--doctor-commands/333-doctor-deep-loop-convergence.md`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/manual_testing_playbook/23--doctor-commands/334-doctor-cocoindex-daemon-healthy.md`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/manual_testing_playbook/23--doctor-commands/335-doctor-cocoindex-daemon-zombie.md`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/manual_testing_playbook/23--doctor-commands/336-doctor-cocoindex-daemon-unreachable.md`

If `23--doctor-commands/` directory doesn't exist, create it.

## OUT_OF_SCOPE

- DO NOT modify root `manual_testing_playbook.md` (Phase C handles)
- DO NOT modify any /doctor:* command Markdown or YAML asset
- DO NOT modify any spec packet docs
- DO NOT touch other category folders (01-22)
- DO NOT author any sandbox shell scripts

## HARD CONSTRAINTS

(Same 9 constraints as track-p-mem.prompt.md.)

## PER-SCENARIO EDITS

### DOC-331: Deep-loop lazy-init from iteration folders

- Tests: `:apply` populates empty `deep-loop-graph.sqlite` from existing `research/iterations/*.md` + `review/iterations/*.md`.
- Preconditions: deep-loop-graph empty (or missing); research/review iteration folders present in spec packets.
- Prompt: "Initialize the deep-loop graph from current iteration folders. We just finished a deep-research run."
- Expected: `:apply` detects empty graph; `deep_loop_graph_upsert` walks iteration files; populates nodes (questions, claims, verifications) + edges.
- Evidence: post-run `deep_loop_graph_status()` returns non-zero node count; cited files match iteration sources.

### DOC-332: Deep-loop empty + no iteration source

- Tests: `:auto` reports empty graph + no iteration folders found; refuses to remediate.
- Preconditions: deep-loop-graph empty; NO research/review iteration folders.
- Prompt: "Check deep-loop graph status. There's no recent research iteration data."
- Expected: `:auto` returns DEGRADED with message "no iteration source detected" + recommendation to run `/spec_kit:deep-research` first.
- Evidence: status output cites empty graph + missing iteration source.

### DOC-333: Deep-loop convergence gold-battery (≥3-iteration packet)

- Tests: `:apply` post-rebuild gold-battery: convergence signal returns non-empty for any packet with ≥3 iterations.
- Preconditions: deep-loop-graph populated; at least one packet has ≥3 research iterations.
- Prompt: "Verify deep-loop convergence signal works on packet 026/001-research-and-baseline (3 iterations)."
- Expected: `deep_loop_graph_convergence({packetId: ...})` returns convergence_score + signal artifacts (questions answered, claims supported).
- Evidence: convergence response captured; non-empty fields verified.

### DOC-334: Cocoindex daemon healthy

- Tests: `:apply` triggers `ccc_reindex` when daemon is healthy.
- Preconditions: cocoindex daemon running; recent codebase changes since last index.
- Prompt: "Reindex cocoindex. I just renamed several modules."
- Expected: daemon health probe passes; `ccc_reindex` runs; gold-battery returns ≥5 results for representative semantic queries.
- Evidence: ccc_status pre + post; semantic search count.

### DOC-335: Cocoindex daemon zombie state (idempotent restart)

- Tests: `:apply` triggers idempotent restart per 3.4.1.0 fix when daemon is in zombie state.
- Preconditions: simulate zombie daemon (process running but unresponsive).
- Prompt: "Reindex cocoindex. The daemon has been spinning at 90% CPU since this morning."
- Expected: `:apply` detects zombie via `ccc_status`; runs idempotent restart (no zombie duplicates created); post-restart reindex succeeds.
- Evidence: process count pre + post (1 daemon both times); CPU dropped to <5%; reindex completed.
- **UNAUTOMATABLE if daemon zombie state can't be reproduced in sandbox** — document the reason.

### DOC-336: Cocoindex daemon unreachable

- Tests: `:apply` refuses cleanly when daemon is fully unreachable.
- Preconditions: cocoindex daemon NOT running (or socket missing).
- Prompt: "Reindex cocoindex. The daemon may not be available."
- Expected: `:apply` detects daemon-unreachable; refuses with explicit message; suggests `/doctor:mcp_install` or daemon restart.
- Evidence: refusal output captured; index untouched; exit non-zero with helpful diagnostic.

## VERIFICATION

```bash
SKDOC=".opencode/skills/sk-doc/scripts"
echo "=== Files ==="; ls -la .opencode/skills/system-spec-kit/manual_testing_playbook/23--doctor-commands/33[1-6]-*.md 2>&1

echo "=== validate_document per file ==="
for f in .opencode/skills/system-spec-kit/manual_testing_playbook/23--doctor-commands/33[1-6]-*.md; do
  python3 "$SKDOC/validate_document.py" --json --type playbook_feature "$f" 2>&1 | grep -E '"valid"|"total_issues"' | head -2 | sed "s|^|$f: |"
done

echo "=== Section + subsection counts ==="
for f in .opencode/skills/system-spec-kit/manual_testing_playbook/23--doctor-commands/33[1-6]-*.md; do
  h2=$(grep -cE '^## (1\. OVERVIEW|2\. SCENARIO CONTRACT|3\. TEST EXECUTION|4\. SOURCE FILES|5\. SOURCE METADATA)' "$f")
  h3=$(grep -cE '^### (Prompt|Commands|Expected|Evidence|Pass / Fail|Failure Triage)' "$f")
  echo "$(basename $f): h2=$h2 h3=$h3"
done

echo "=== YAML asset citation ==="
for f in .opencode/skills/system-spec-kit/manual_testing_playbook/23--doctor-commands/33[1-3]-*.md; do
  echo "$(basename $f): $(grep -c 'doctor_deep-loop_' "$f")"
done
for f in .opencode/skills/system-spec-kit/manual_testing_playbook/23--doctor-commands/33[4-6]-*.md; do
  echo "$(basename $f): $(grep -c 'doctor_cocoindex_' "$f")"
done
```

## OUTPUT REQUIREMENT + MEMORY HANDBACK

(Same as track-p-mem.prompt.md.)
