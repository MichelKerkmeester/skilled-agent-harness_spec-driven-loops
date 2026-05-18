# Codex dispatch: Track P-CAUSAL — 3 /doctor:causal-graph scenarios (DOC-328..DOC-330)

## ROLE

You are Codex (gpt-5.5 high fast) dispatched by Claude Opus 4.7 to author 3 manual testing playbook scenarios covering `/doctor:causal-graph` command modes.

Spec folder (pre-approved, skip Gate 3): `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-doctor-update-orchestrator/002-sandbox-testing-playbook/`

## CANONICAL TEMPLATE SOURCES (read first; treat as locked)

1. `.opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md` — root playbook (execution policy, verdict rules, Section 12 shape).
2. `.opencode/skills/system-spec-kit/manual_testing_playbook/04--maintenance/014-workspace-scanning-and-indexing-memory-index-scan.md` — multi-block TEST EXECUTION example.
3. `.opencode/skills/system-spec-kit/manual_testing_playbook/04--maintenance/035-startup-runtime-compatibility-guards.md` — single-block TEST EXECUTION example.

## RUNTIME UNDER TEST

4. `.opencode/commands/doctor/causal-graph.md` — Markdown entrypoint.
5. `.opencode/commands/doctor/assets/doctor_causal-graph_{auto,confirm,apply,apply-confirm}.yaml` — 4 mode YAMLs (already polished).
6. `.opencode/specs/.../013-.../001-doctor-commands/spec.md` — REQ-008 (causal coverage 60% target).
7. `.opencode/specs/.../013-.../001-doctor-commands/decision-record.md` — ADR (add-only mutation, confidence ≥0.7).

## IN_SCOPE_FILES

- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/manual_testing_playbook/23--doctor-commands/328-doctor-causal-graph-low-coverage.md`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/manual_testing_playbook/23--doctor-commands/329-doctor-causal-graph-confidence-threshold.md`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/manual_testing_playbook/23--doctor-commands/330-doctor-causal-graph-add-only.md`

If `23--doctor-commands/` directory doesn't exist, create it (track P-MEM may have already created it in parallel).

## OUT_OF_SCOPE (forbidden)

- DO NOT modify root `manual_testing_playbook.md` (Phase C will do that)
- DO NOT modify any /doctor:* command Markdown or YAML asset
- DO NOT modify any spec packet docs
- DO NOT touch other category folders (01-22)
- DO NOT author any sandbox shell scripts

## HARD CONSTRAINTS

(Same 9 constraints as track-p-mem.prompt.md; copy-by-reference.)

1. 5-section structure: `## 1. OVERVIEW`, `## 2. SCENARIO CONTRACT`, `## 3. TEST EXECUTION`, `## 4. SOURCE FILES`, `## 5. SOURCE METADATA`.
2. Frontmatter: `title` ("DOC-NNN -- <feature>") + `description`.
3. Length 75-200 LOC per file.
4. Filename pattern matches IN_SCOPE_FILES.
5. `validate_document.py --type playbook_feature` returns `valid: true`.
6. Section 3 has 6 subsections: Prompt, Commands, Expected, Evidence, Pass / Fail, Failure Triage.
7. Section 4 cites the matching YAML asset path.
8. PASS/FAIL/SKIP/UNAUTOMATABLE classification.
9. Natural-human or RCAF prompt voice.

## PER-SCENARIO EDITS

### DOC-328: Low-coverage drift report

- Tests: `:auto` mode reports causal coverage <60% with recommendation.
- Preconditions: `context-index.sqlite` exists with <60% causal-edges coverage.
- Prompt: "Check causal graph coverage. We had a deep-research session last week and want to know if the edges are well-linked."
- Expected: `:auto` returns DEGRADED with `coverage: 45%` (or similar) + `recommend: /doctor:causal-graph:apply`.
- Evidence: coverage % captured; recommendation explicit.

### DOC-329: Confidence threshold enforcement (≥0.7 only)

- Tests: `:apply` mode auto-links ONLY records with confidence ≥0.7; refuses to link below.
- Preconditions: causal-edges with mixed confidence — some 0.85, some 0.65, some 0.40.
- Prompt: "Auto-link causal edges. I want only high-confidence links applied."
- Expected: `:apply` writes new edges for confidence ≥0.7; logs decisions for <0.7 records as "skipped: below threshold".
- Evidence: causal-edges count delta = count of ≥0.7 candidates; skipped records logged.

### DOC-330: Add-only enforcement (never deletes existing edges)

- Tests: mutation boundary — `:apply` cannot delete existing edges, only add.
- Preconditions: existing causal-edges with established weights.
- Prompt: "Run causal-graph apply. Verify no existing edges are deleted or weight-modified, only new edges are added."
- Expected: `:apply` adds N new edges; existing edges untouched (count + weights byte-identical pre/post).
- Evidence: pre/post edge dump; diff shows only additions.
- Failure Triage: if any existing edge weight changed OR any edge was deleted → FAIL with mutation-boundary-violation.

## VERIFICATION

```bash
SKDOC=".opencode/skills/sk-doc/scripts"
echo "=== Files ==="; ls -la .opencode/skills/system-spec-kit/manual_testing_playbook/23--doctor-commands/3{2[8-9],30}-*.md 2>&1

echo "=== validate_document per file ==="
for f in .opencode/skills/system-spec-kit/manual_testing_playbook/23--doctor-commands/3{2[8-9],30}-*.md; do
  python3 "$SKDOC/validate_document.py" --json --type playbook_feature "$f" 2>&1 | grep -E '"valid"|"total_issues"' | head -2 | sed "s|^|$f: |"
done

echo "=== Section + subsection counts ==="
for f in .opencode/skills/system-spec-kit/manual_testing_playbook/23--doctor-commands/3{2[8-9],30}-*.md; do
  h2=$(grep -cE '^## (1\. OVERVIEW|2\. SCENARIO CONTRACT|3\. TEST EXECUTION|4\. SOURCE FILES|5\. SOURCE METADATA)' "$f")
  h3=$(grep -cE '^### (Prompt|Commands|Expected|Evidence|Pass / Fail|Failure Triage)' "$f")
  echo "$(basename $f): h2=$h2 h3=$h3"
done

echo "=== YAML asset citation per file ==="
for f in .opencode/skills/system-spec-kit/manual_testing_playbook/23--doctor-commands/3{2[8-9],30}-*.md; do
  echo "$(basename $f): $(grep -c 'doctor_causal-graph_' "$f")"
done
```

## OUTPUT REQUIREMENT + MEMORY HANDBACK

(Same as track-p-mem.prompt.md.)
