---
title: "Tasks: Phase 6: speckit-command-and-agent-alignment"
description: "Task Format: T### [P?] Description (file path). Each task names its verify command with the output it must print, and the 27 frozen rows are written out literally."
trigger_phrases:
  - "speckit command and agent alignment tasks"
  - "command and agent audit rows"
  - "runtime mirror sync tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 6: speckit-command-and-agent-alignment

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`, then `Verify:` with the command whose output proves the task.

Shell variables used below, set once by the conductor in the build worktree:
- `WORKTREE`: the build worktree path recorded in `../goal.md` section 4.
- `PHASE_REL`: `specs/system-speckit/054-weak-model-spec-authoring/006-speckit-command-and-agent-alignment`
- `PHASE`: `$WORKTREE/$PHASE_REL`
- `P1`: `$WORKTREE/specs/system-speckit/054-weak-model-spec-authoring/001-template-drift-census-and-baseline`
- `LED`: `$P1/scratch/ledger/ledger.jsonl`, the verified and reviewed phase 1 ledger.
- `ROWS`: `$PHASE/scratch/audit/rows.jsonl`, the 27 frozen rows written by T004.
- `S`: `.skilled/skills/system-spec-kit`
- `P6START`: the commit hash recorded by T003.

Every command runs from `$WORKTREE` unless the task says otherwise. Paths in rows are relative to that directory.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Check that phases 1, 4 and 5 closed (no file). Run the block below. Verify: it prints `LEDGER_OK`, `CARD_OK`, `CARD_SYNC_OK` and `EXAMPLE_DRIFT_OK`. When a line is missing, write `MISSING <name>` in `goal.md` section 4 and continue, because T006 records each dependent row as `SKIP-MISSING` and the phase can still close with that row recorded.

  ```bash
  cd "$WORKTREE"
  test -s "$LED" && jq -c . "$LED" > /dev/null && echo LEDGER_OK
  test -f "$S/references/workflows/spec-authoring-card.md" && echo CARD_OK
  test -x "$S/runtime/cli/spec/check-card-sync.sh" && echo CARD_SYNC_OK
  test -x "$S/runtime/cli/spec/check-example-drift.sh" && echo EXAMPLE_DRIFT_OK
  ```

- [x] T002 Check the tools (no file). Verify: `python3 --version && jq --version && rg --version | head -1 && node --version && npm --version && git --version` prints six lines. A Python older than 3.8 or a Node older than v20 stops the phase.

- [x] T003 Record the start state (`goal.md`, `scratch/status-start.txt`, `scratch/suite-before.txt`, `scratch/doctor-before.json`). Run the block below. Write the hash `git rev-parse` prints into the `Phase start commit` row of `goal.md` section 4 as `| Phase start commit | Done | <the 40 character hash> |`. Verify: `grep -cE 'Phase start commit \| Done \| [0-9a-f]{40}' "$PHASE/goal.md"` prints `1`, `tail -1 "$PHASE/scratch/suite-before.txt"` starts with `exit=`, and `jq -e . "$PHASE/scratch/doctor-before.json" > /dev/null && echo DOCTOR_OK` prints `DOCTOR_OK`. The suite run takes several minutes.

  ```bash
  cd "$WORKTREE"
  git rev-parse HEAD
  git status --porcelain > "$PHASE/scratch/status-start.txt"
  mkdir -p "$PHASE/scratch/audit" "$PHASE/scratch/tools" "$PHASE/scratch/mirrors" "$PHASE/scratch/briefs" "$PHASE/scratch/runs" "$PHASE/scratch/review"
  npm --prefix "$WORKTREE/$S" test > "$PHASE/scratch/suite-before.txt" 2>&1; echo "exit=$?" >> "$PHASE/scratch/suite-before.txt"
  node "$S/runtime/cli/retrieval/generate-trigger-index.mjs" --check --json > "$PHASE/scratch/doctor-before.json" 2> "$PHASE/scratch/doctor-before.err"; echo "exit=$?" > "$PHASE/scratch/doctor-before.exit"
  ```

- [x] T004 Save the 27 frozen rows (`scratch/audit/rows.jsonl`). Run the heredoc block that follows this line exactly as written. The file holds one JSON object per line with the fields `id`, `file`, `locator`, `expected_text`, `check` and `precheck`. The applier reads the first four and ignores the last two. Verify: the two commands under the block print `27` and then `27 1`. A line other than `27 1` means a `locator` no longer occurs exactly once in its file because the tree changed after this packet was written. Write that row id in `goal.md` section 4 and continue, because T006 reports the row as `BLOCKED`.

  ```bash
  cd "$WORKTREE"
  cat > "$ROWS" <<'JSONL'
{"id": "R-001", "file": ".skilled/commands/speckit/plan.md", "locator": "Its `validate.sh --strict` calls now include two warn-only rules, and neither fails the run: `FRONTMATTER_VALUES` checks each doc's `contextType` and `importance_tier` against sk-create-frontmatter's `assets/frontmatter-values.json`, and `SOURCE_TAGS` resolves the `[SOURCE: path:line]` tags in research and review artifacts of packets created after 2026-10-04.", "expected_text": "Its `validate.sh --strict` calls now include two warn-only rules, and neither fails the run: `FRONTMATTER_VALUES` checks each doc's `contextType` and `importance_tier` against sk-create-frontmatter's `assets/frontmatter-values.json`, and `SOURCE_TAGS` resolves the `[SOURCE: path:line]` tags in research and review artifacts of packets created after 2026-10-04. The command also runs `bash .skilled/skills/system-spec-kit/runtime/cli/spec/check-example-drift.sh` and `bash .skilled/skills/system-spec-kit/runtime/cli/spec/check-card-sync.sh` after each strict validation, when both files exist.", "check": "A5", "precheck": "test -x .skilled/skills/system-spec-kit/runtime/cli/spec/check-example-drift.sh && test -x .skilled/skills/system-spec-kit/runtime/cli/spec/check-card-sync.sh"}
{"id": "R-002", "file": ".skilled/commands/speckit/implement.md", "locator": "Its `validate.sh --strict` calls now include two warn-only rules, and neither fails the run: `FRONTMATTER_VALUES` checks each doc's `contextType` and `importance_tier` against sk-create-frontmatter's `assets/frontmatter-values.json`, and `SOURCE_TAGS` resolves the `[SOURCE: path:line]` tags in research and review artifacts of packets created after 2026-10-04.", "expected_text": "Its `validate.sh --strict` calls now include two warn-only rules, and neither fails the run: `FRONTMATTER_VALUES` checks each doc's `contextType` and `importance_tier` against sk-create-frontmatter's `assets/frontmatter-values.json`, and `SOURCE_TAGS` resolves the `[SOURCE: path:line]` tags in research and review artifacts of packets created after 2026-10-04. The command also runs `bash .skilled/skills/system-spec-kit/runtime/cli/spec/check-example-drift.sh` and `bash .skilled/skills/system-spec-kit/runtime/cli/spec/check-card-sync.sh` after each strict validation, when both files exist.", "check": "A5", "precheck": "test -x .skilled/skills/system-spec-kit/runtime/cli/spec/check-example-drift.sh && test -x .skilled/skills/system-spec-kit/runtime/cli/spec/check-card-sync.sh"}
{"id": "R-003", "file": ".skilled/commands/speckit/complete.md", "locator": "Its `validate.sh --strict` calls now include two warn-only rules, and neither fails the run: `FRONTMATTER_VALUES` checks each doc's `contextType` and `importance_tier` against sk-create-frontmatter's `assets/frontmatter-values.json`, and `SOURCE_TAGS` resolves the `[SOURCE: path:line]` tags in research and review artifacts of packets created after 2026-10-04.", "expected_text": "Its `validate.sh --strict` calls now include two warn-only rules, and neither fails the run: `FRONTMATTER_VALUES` checks each doc's `contextType` and `importance_tier` against sk-create-frontmatter's `assets/frontmatter-values.json`, and `SOURCE_TAGS` resolves the `[SOURCE: path:line]` tags in research and review artifacts of packets created after 2026-10-04. The command also runs `bash .skilled/skills/system-spec-kit/runtime/cli/spec/check-example-drift.sh` and `bash .skilled/skills/system-spec-kit/runtime/cli/spec/check-card-sync.sh` after each strict validation, when both files exist.", "check": "A5", "precheck": "test -x .skilled/skills/system-spec-kit/runtime/cli/spec/check-example-drift.sh && test -x .skilled/skills/system-spec-kit/runtime/cli/spec/check-card-sync.sh"}
{"id": "R-004", "file": ".skilled/commands/speckit/assets/speckit-plan.yaml", "locator": "  strict_validation_command: \".skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh [SPEC_FOLDER] --strict\"", "expected_text": "  strict_validation_command: \".skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh [SPEC_FOLDER] --strict\"\n  guard_scripts_command: \"bash .skilled/skills/system-spec-kit/runtime/cli/spec/check-example-drift.sh && bash .skilled/skills/system-spec-kit/runtime/cli/spec/check-card-sync.sh\"", "check": "A5", "precheck": "test -x .skilled/skills/system-spec-kit/runtime/cli/spec/check-example-drift.sh && test -x .skilled/skills/system-spec-kit/runtime/cli/spec/check-card-sync.sh"}
{"id": "R-005", "file": ".skilled/commands/speckit/assets/speckit-implement.yaml", "locator": "  strict_validation_command: \".skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh [SPEC_FOLDER] --strict\"", "expected_text": "  strict_validation_command: \".skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh [SPEC_FOLDER] --strict\"\n  guard_scripts_command: \"bash .skilled/skills/system-spec-kit/runtime/cli/spec/check-example-drift.sh && bash .skilled/skills/system-spec-kit/runtime/cli/spec/check-card-sync.sh\"", "check": "A5", "precheck": "test -x .skilled/skills/system-spec-kit/runtime/cli/spec/check-example-drift.sh && test -x .skilled/skills/system-spec-kit/runtime/cli/spec/check-card-sync.sh"}
{"id": "R-006", "file": ".skilled/commands/speckit/assets/speckit-complete.yaml", "locator": "  strict_validation_command: \".skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh [SPEC_FOLDER] --strict\"", "expected_text": "  strict_validation_command: \".skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh [SPEC_FOLDER] --strict\"\n  guard_scripts_command: \"bash .skilled/skills/system-spec-kit/runtime/cli/spec/check-example-drift.sh && bash .skilled/skills/system-spec-kit/runtime/cli/spec/check-card-sync.sh\"", "check": "A5", "precheck": "test -x .skilled/skills/system-spec-kit/runtime/cli/spec/check-example-drift.sh && test -x .skilled/skills/system-spec-kit/runtime/cli/spec/check-card-sync.sh"}
{"id": "R-007", "file": ".skilled/commands/speckit/assets/speckit-plan.yaml", "locator": "      placeholder-upgrade: \"Tracked seed markers or unresolved placeholders remain and block healthy-folder status\"", "expected_text": "      placeholder-upgrade: \"Tracked seed markers or unresolved placeholders remain; in a doc stamped v2.3 or later an unfilled value token warns while spec.md says Draft and errors at any other status, and an older doc keeps the error\"", "check": "A2", "precheck": ""}
{"id": "R-008", "file": ".skilled/commands/speckit/assets/speckit-complete.yaml", "locator": "      placeholder-upgrade: \"Tracked seed markers, persisted intake resume markers, or unresolved placeholders remain and block healthy-folder status\"", "expected_text": "      placeholder-upgrade: \"Tracked seed markers, persisted intake resume markers, or unresolved placeholders remain; in a doc stamped v2.3 or later an unfilled value token warns while spec.md says Draft and errors at any other status, and an older doc keeps the error\"", "check": "A2", "precheck": ""}
{"id": "R-009", "file": ".skilled/commands/speckit/assets/speckit-complete.yaml", "locator": "spec-folder authoring now lives in system-spec-kit (references/workflows/spec-folder-authoring-checklist.md + spec-folder-write-recipe.md).", "expected_text": "spec-folder authoring now lives in system-spec-kit: read references/workflows/spec-authoring-card.md first, then references/workflows/spec-folder-authoring-checklist.md and spec-folder-write-recipe.md for the detail.", "check": "A1", "precheck": "test -f .skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md"}
{"id": "R-010", "file": ".skilled/commands/speckit/assets/speckit-complete.yaml", "locator": "      - \"system-spec-kit/references/workflows/spec-folder-write-recipe.md (when target is under .opencode/specs/)\"", "expected_text": "      - \"system-spec-kit/references/workflows/spec-authoring-card.md (read first, for every spec-doc target)\"\n      - \"system-spec-kit/references/workflows/spec-folder-write-recipe.md (when target is under .opencode/specs/)\"", "check": "A1", "precheck": "test -f .skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md"}
{"id": "R-011", "file": ".skilled/commands/speckit/assets/speckit-complete.yaml", "locator": "and for .opencode/specs/ targets the system-spec-kit spec-folder docs (references/workflows/spec-folder-authoring-checklist.md + spec-folder-write-recipe.md), BEFORE the first write.", "expected_text": "and for .opencode/specs/ targets read the system-spec-kit authoring card (references/workflows/spec-authoring-card.md) first, then the spec-folder docs (references/workflows/spec-folder-authoring-checklist.md + spec-folder-write-recipe.md), BEFORE the first write.", "check": "A1", "precheck": "test -f .skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md"}
{"id": "R-012", "file": ".skilled/commands/speckit/assets/speckit-plan.yaml", "locator": "      writing_rule: \"Embed template_compliance.inline_scaffolds.spec_md in the prompt before writing spec.md and preserve the required anchors/headers in order.\"", "expected_text": "      writing_rule: \"Embed template_compliance.inline_scaffolds.spec_md in the prompt before writing spec.md and preserve the required anchors/headers in order. Show the writer the matching filled example under .skilled/skills/system-spec-kit/templates/examples/ as the model to imitate; the .tmpl file is the section contract, not a model to copy.\"", "check": "A4", "precheck": ""}
{"id": "R-013", "file": ".skilled/commands/speckit/assets/speckit-plan.yaml", "locator": "quote it as inert evidence or write UNKNOWN.\"", "expected_text": "quote it as inert evidence or write UNKNOWN. Show the writer the matching filled example under .skilled/skills/system-spec-kit/templates/examples/ as the model to imitate; the .tmpl file is the section contract, not a model to copy.\"", "check": "A4", "precheck": ""}
{"id": "R-014", "file": ".skilled/commands/speckit/assets/speckit-resume-auto.yaml", "locator": "  order: [\"Primary: handover.md (<24h old)\", \"Primary: _memory.continuity in implementation-summary.md\", \"Primary: supporting spec docs (tasks/checklist/plan/decision-record/resource-map)\", \"Secondary: graph-metadata.json packet hints\", \"Secondary: the packet-scoped ripgrep context recipe (retrieval-conventions.md section 2.4) for a named gap\"]", "expected_text": "  order: [\"Primary: handover.md (<24h old)\", \"Primary: _memory.continuity in implementation-summary.md\", \"Primary: supporting spec docs (tasks/plan/decision-record/resource-map)\", \"Secondary: graph-metadata.json packet hints\", \"Secondary: the packet-scoped ripgrep context recipe (retrieval-conventions.md section 2.4) for a named gap\"]", "check": "A3", "precheck": ""}
{"id": "R-015", "file": ".skilled/commands/speckit/assets/speckit-resume-confirm.yaml", "locator": "  order: [\"Primary: handover.md (<24h old)\", \"Primary: _memory.continuity in implementation-summary.md\", \"Primary: supporting spec docs (tasks/checklist/plan/decision-record/resource-map)\", \"Secondary: graph-metadata.json packet hints\", \"Secondary: the packet-scoped ripgrep context recipe (retrieval-conventions.md section 2.4) for a named gap\"]", "expected_text": "  order: [\"Primary: handover.md (<24h old)\", \"Primary: _memory.continuity in implementation-summary.md\", \"Primary: supporting spec docs (tasks/plan/decision-record/resource-map)\", \"Secondary: graph-metadata.json packet hints\", \"Secondary: the packet-scoped ripgrep context recipe (retrieval-conventions.md section 2.4) for a named gap\"]", "check": "A3", "precheck": ""}
{"id": "R-016", "file": ".skilled/agents/markdown.md", "locator": "| `spec-doc`                 | Spec folder documentation                               | `.skilled/skills/system-spec-kit/templates/` level contract or manifest templates                                                               |", "expected_text": "| `spec-doc`                 | Spec folder documentation                               | `.skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md` first, then the matching filled example under `.skilled/skills/system-spec-kit/templates/examples/`; the `.tmpl` file is the section contract, not a model to copy |", "check": "A4", "precheck": "test -f .skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md"}
{"id": "R-017", "file": ".skilled/agents/orchestrate.md", "locator": "**Scope:** ALL documentation (*.md) written inside spec folders (`specs/[###-name]/`). This includes but is not limited to: spec.md, plan.md, tasks.md, checklist.md, decision-record.md, implementation-summary.md, research/research.md, and any other markdown documentation.", "expected_text": "**Scope:** ALL documentation (*.md) written inside spec folders (`specs/[###-name]/`). This includes but is not limited to: spec.md, plan.md, tasks.md, decision-record.md, implementation-summary.md, research/research.md, and any other markdown documentation.", "check": "A3", "precheck": ""}
{"id": "R-018", "file": ".skilled/agents/orchestrate.md", "locator": "| **Wrong Route for Spec Docs** | Task creates `specs/*/spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md` without templates or validation evidence | Main agent + templates + `validate.sh --strict` |", "expected_text": "| **Wrong Route for Spec Docs** | Task creates `specs/*/spec.md`, `plan.md`, `tasks.md`, `decision-record.md` without templates or validation evidence | Main agent + templates + `validate.sh --strict` |", "check": "A3", "precheck": ""}
{"id": "R-019", "file": ".skilled/agents/code.md", "locator": "`tasks.md` / `checklist.md` / `decision-record.md`", "expected_text": "`tasks.md` / `decision-record.md`", "check": "A3", "precheck": ""}
{"id": "R-020", "file": ".skilled/agents/code.md", "locator": "Edit `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, `implementation-summary.md`, or `handover.md` from the code-agent lane", "expected_text": "Edit `spec.md`, `plan.md`, `tasks.md`, `decision-record.md`, `implementation-summary.md`, or `handover.md` from the code-agent lane", "check": "A3", "precheck": ""}
{"id": "R-021", "file": ".skilled/agents/context.md", "locator": "- Read relevant packet docs (`spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md`) for canonical state.", "expected_text": "- Read relevant packet docs (`spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md`) for canonical state.", "check": "A3", "precheck": ""}
{"id": "R-022", "file": ".claude/agents/markdown.md", "locator": "| `spec-doc`                 | Spec folder documentation                               | `.skilled/skills/system-spec-kit/templates/` level contract or manifest templates                                                               |", "expected_text": "| `spec-doc`                 | Spec folder documentation                               | `.skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md` first, then the matching filled example under `.skilled/skills/system-spec-kit/templates/examples/`; the `.tmpl` file is the section contract, not a model to copy |", "check": "A4", "precheck": "test -f .skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md"}
{"id": "R-023", "file": ".claude/agents/orchestrate.md", "locator": "**Scope:** ALL documentation (*.md) written inside spec folders (`specs/[###-name]/`). This includes but is not limited to: spec.md, plan.md, tasks.md, checklist.md, decision-record.md, implementation-summary.md, research/research.md, and any other markdown documentation.", "expected_text": "**Scope:** ALL documentation (*.md) written inside spec folders (`specs/[###-name]/`). This includes but is not limited to: spec.md, plan.md, tasks.md, decision-record.md, implementation-summary.md, research/research.md, and any other markdown documentation.", "check": "A3", "precheck": ""}
{"id": "R-024", "file": ".claude/agents/orchestrate.md", "locator": "| **Wrong Route for Spec Docs** | Task creates `specs/*/spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md` without templates or validation evidence | Main agent + templates + `validate.sh --strict` |", "expected_text": "| **Wrong Route for Spec Docs** | Task creates `specs/*/spec.md`, `plan.md`, `tasks.md`, `decision-record.md` without templates or validation evidence | Main agent + templates + `validate.sh --strict` |", "check": "A3", "precheck": ""}
{"id": "R-025", "file": ".claude/agents/code.md", "locator": "`tasks.md` / `checklist.md` / `decision-record.md`", "expected_text": "`tasks.md` / `decision-record.md`", "check": "A3", "precheck": ""}
{"id": "R-026", "file": ".claude/agents/code.md", "locator": "Edit `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, `implementation-summary.md`, or `handover.md` from the code-agent lane", "expected_text": "Edit `spec.md`, `plan.md`, `tasks.md`, `decision-record.md`, `implementation-summary.md`, or `handover.md` from the code-agent lane", "check": "A3", "precheck": ""}
{"id": "R-027", "file": ".claude/agents/context.md", "locator": "- Read relevant packet docs (`spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md`) for canonical state.", "expected_text": "- Read relevant packet docs (`spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md`) for canonical state.", "check": "A3", "precheck": ""}
JSONL
  ```

  ```bash
  jq -c . "$ROWS" | wc -l | tr -d ' '
  jq -r '[.file,.locator] | @tsv' "$ROWS" | while IFS=$'\t' read -r f l; do grep -cF -- "$l" "$f"; done | sort | uniq -c | awk '{print $1, $2}'
  ```

- [x] T005 Save the tools, then test the applier on a copy (`scratch/tools/apply_row.py`, `scratch/tools/check_rows.py`, `scratch/tools/lib.sh`). Run the four heredocs below, then the self-test. Verify: the self-test prints, in order, a line that starts with `APPLIED R-001`, a line that starts with `FAIL R-001: expected text already present`, `exit=1`, and `1`. The last number is the count of changed lines in the copy, so it proves the applier changed one line and ran only once. Then `bash -n "$PHASE/scratch/tools/lib.sh" && echo SYNTAX_OK` prints `SYNTAX_OK`.

  `apply_row.py` reads a ledger path, a row id and an optional root directory. It refuses a row whose `expected_text` is `OWNED BY PHASE` or `DELETE FILE`. It refuses when the expected text is already in the file, so a second apply cannot append or replace twice. It refuses unless the `locator` occurs exactly once in the row's file. It replaces that one occurrence, prints `APPLIED <id> <file>` and exits 0. Every refusal prints `FAIL <id>: <reason>` and exits 1. The expected-text guard is the reason a second apply fails, because an append-style row keeps its old text as a prefix and the locator alone would still occur once.

```bash
cd "$WORKTREE"
cat > "$PHASE/scratch/tools/apply_row.py" <<'PY'
import json, sys
ledger, row_id = sys.argv[1], sys.argv[2]
root = sys.argv[3] if len(sys.argv) > 3 else "."
rows = [json.loads(l) for l in open(ledger, encoding="utf-8") if l.strip()]
match = [r for r in rows if r["id"] == row_id]
if len(match) != 1:
    sys.exit(f"FAIL {row_id}: expected 1 ledger row, found {len(match)}")
r = match[0]
if r["expected_text"] in ("OWNED BY PHASE", "DELETE FILE"):
    sys.exit(f"FAIL {row_id}: not a text replacement ({r['expected_text']})")
path = f"{root}/{r['file']}"
text = open(path, encoding="utf-8").read()
if r["expected_text"] in text:
    sys.exit(f"FAIL {row_id}: expected text already present in {r['file']}")
count = text.count(r["locator"])
if count != 1:
    sys.exit(f"FAIL {row_id}: locator found {count} times in {r['file']}")
open(path, "w", encoding="utf-8").write(text.replace(r["locator"], r["expected_text"], 1))
print(f"APPLIED {row_id} {r['file']}")
PY
```

```bash
cd "$WORKTREE"
cat > "$PHASE/scratch/tools/check_rows.py" <<'PY'
# Counts exact string occurrences, so a replacement that spans more than one
# line is checked as one string instead of one count per line.
import json, sys
ledger = sys.argv[1]
root = sys.argv[2] if len(sys.argv) > 2 else "."
for line in open(ledger, encoding="utf-8"):
    if not line.strip():
        continue
    r = json.loads(line)
    text = open(f"{root}/{r['file']}", encoding="utf-8").read()
    print(f"RCHECK {r['id']} locator={text.count(r['locator'])} expected={text.count(r['expected_text'])}")
PY
```

```bash
cd "$WORKTREE"
cat > "$PHASE/scratch/tools/lib.sh" <<'SH'
# Helpers for the conductor. Set WORKTREE, PHASE, PHASE_REL, ROWS and S before sourcing this file.

# Prints YES when the row's locator is still in its file, NO when it is gone.
present() {
  local id="$1" file locator
  file=$(jq -r --arg i "$id" 'select(.id==$i) | .file' "$ROWS")
  locator=$(jq -r --arg i "$id" 'select(.id==$i) | .locator' "$ROWS")
  if grep -qF -- "$locator" "$file"; then echo YES; else echo NO; fi
}

# Applies one row with apply_row.py. Prints the script result, then a CHECK line counting
# the changed paths that the row does not explain. Run it from the worktree root.
apply_checked() {
  local led="$1" id="$2" file out extra
  file=$(jq -r --arg i "$id" 'select(.id==$i) | .file' "$led")
  git diff --name-only | sort > "$PHASE/scratch/pre.txt"
  if ! out=$(python3 -I "$PHASE/scratch/tools/apply_row.py" "$led" "$id" . 2>&1); then
    echo "BLOCKED $id $out"
    return 0
  fi
  git diff --name-only | sort > "$PHASE/scratch/post.txt"
  extra=$(comm -13 "$PHASE/scratch/pre.txt" "$PHASE/scratch/post.txt" | grep -v "^$PHASE_REL/" | grep -cvxF -- "$file")
  echo "$out"
  echo "CHECK $id extra_paths=$extra"
}
SH
```

```bash
cd "$WORKTREE"
T="$PHASE/scratch/selftest"
rm -rf "$T" && mkdir -p "$T/root/.skilled/commands/speckit"
cp ".skilled/commands/speckit/plan.md" "$T/root/.skilled/commands/speckit/plan.md"
jq -c 'select(.id=="R-001")' "$ROWS" > "$T/one.jsonl"
python3 -I "$PHASE/scratch/tools/apply_row.py" "$T/one.jsonl" R-001 "$T/root"
python3 -I "$PHASE/scratch/tools/apply_row.py" "$T/one.jsonl" R-001 "$T/root"; echo "exit=$?"
diff ".skilled/commands/speckit/plan.md" "$T/root/.skilled/commands/speckit/plan.md" | grep -c '^>'
rm -rf "$T"
```
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T006 Apply the 27 rows, one at a time (`scratch/audit/applied.txt` and the 16 files the rows name). Run the block below. Do not edit any of those files by hand. Verify: the three counts under the block print `27`, `27` and `27`. A row that printed `BLOCKED` is recorded in `goal.md` section 4 and is not retried by hand. A row that printed `SKIP-MISSING` is recorded there with the pre-check that failed.

  ```bash
  cd "$WORKTREE"
  . "$PHASE/scratch/tools/lib.sh"
  : > "$PHASE/scratch/audit/applied.txt"
  for id in $(jq -r .id "$ROWS"); do
    pre=$(jq -r --arg i "$id" 'select(.id==$i) | .precheck' "$ROWS")
    if [ -n "$pre" ] && ! bash -c "$pre" > /dev/null 2>&1; then
      echo "SKIP-MISSING $id" >> "$PHASE/scratch/audit/applied.txt"
      continue
    fi
    apply_checked "$ROWS" "$id" >> "$PHASE/scratch/audit/applied.txt"
  done
  python3 -I "$PHASE/scratch/tools/check_rows.py" "$ROWS" . >> "$PHASE/scratch/audit/applied.txt"
  ```

  ```bash
  grep -cE '^(APPLIED|SKIP-MISSING) R-' "$PHASE/scratch/audit/applied.txt"
  grep -c '^CHECK R-.* extra_paths=0$' "$PHASE/scratch/audit/applied.txt"
  grep -c '^RCHECK R-.* expected=1$' "$PHASE/scratch/audit/applied.txt"
  ```

  When a pre-check failed, the second and third counts are lower by the number of `SKIP-MISSING` rows. The gate is then `grep -c '^SKIP-MISSING ' "$PHASE/scratch/audit/applied.txt"` equals the number of missing artifacts in T001, and every skipped row is recorded in `goal.md` section 4.

- [x] T007 Rerun the four A1 to A4 searches and count the A5 references (`scratch/audit/searches.txt`). Run the block below. Verify: it prints `A1_rc=1`, `A2_rc=1`, `A3_rc=1`, `A4_rc=1` and `GUARD_REFS=6`. A code of 1 means ripgrep found nothing. A code of 0 means stale text is still there: read the saved search file, apply no hand edit, and mark this task `[B]`.

  ```bash
  cd "$WORKTREE"
  A="$PHASE/scratch/audit"
  : > "$A/searches.txt"
  rg -n 'spec-folder authoring now lives in system-spec-kit \(references/workflows/spec-folder' .skilled/commands/speckit > "$A/a1.txt" 2>&1; echo "A1_rc=$?" >> "$A/searches.txt"
  rg -n 'placeholder-upgrade: ".*block healthy-folder status' .skilled/commands > "$A/a2.txt" 2>&1; echo "A2_rc=$?" >> "$A/searches.txt"
  rg -n -i '(^|[^a-z-])checklist\.md' .skilled/commands/speckit .skilled/agents > "$A/a3.txt" 2>&1; echo "A3_rc=$?" >> "$A/searches.txt"
  rg -n 'level contract or manifest templates' .skilled/agents > "$A/a4.txt" 2>&1; echo "A4_rc=$?" >> "$A/searches.txt"
  echo "GUARD_REFS=$(rg -l 'check-example-drift|check-card-sync' .skilled/commands/speckit .skilled/agents | wc -l | tr -d ' ')" >> "$A/searches.txt"
  cat "$A/searches.txt"
  ```

- [x] T008 Regenerate every mirror and run the eight checks (`scratch/mirrors/*.txt`, `scratch/mirrors/summary.txt`). Run the first block, then the second. The first block runs five generators in order and writes each one's output to its own file. The second block runs the eight read-only checks and records each exit code. Verify: `grep -c 'rc=0$' "$PHASE/scratch/mirrors/summary.txt"` prints `8`, and `grep -cE 'PASS|STATUS=OK|all mirrors in sync' "$PHASE/scratch/mirrors/summary.txt"` prints `8`, because the summary holds exactly one line per check. When a check exits 1, rerun its generator once and check again. A second failure marks this task `[B]`.

  ```bash
  cd "$WORKTREE"
  M="$PHASE/scratch/mirrors"
  node .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs > "$M/gen-runtime.txt" 2>&1
  node .skilled/skills/system-spec-kit/runtime/cli/codex/sync-agents.cjs > "$M/gen-codex-agents.txt" 2>&1
  node .skilled/skills/system-spec-kit/runtime/cli/codex/sync-prompts.cjs > "$M/gen-codex-prompts.txt" 2>&1
  node .skilled/skills/system-spec-kit/runtime/cli/pi/sync-agents-pi.cjs > "$M/gen-pi-agents.txt" 2>&1
  node .skilled/skills/system-spec-kit/runtime/cli/pi/sync-prompts-pi.cjs > "$M/gen-pi-prompts.txt" 2>&1
  ```

  ```bash
  cd "$WORKTREE"
  M="$PHASE/scratch/mirrors"
  : > "$M/summary.txt"
  node .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs --check > "$M/check-runtime.txt" 2>&1; rc=$?; echo "runtime-mirrors $(tail -1 "$M/check-runtime.txt") rc=$rc" >> "$M/summary.txt"
  node .skilled/skills/system-spec-kit/runtime/cli/codex/sync-agents.cjs --check > "$M/check-codex-agents.txt" 2>&1; rc=$?; echo "codex-agents $(tail -1 "$M/check-codex-agents.txt") rc=$rc" >> "$M/summary.txt"
  node .skilled/skills/system-spec-kit/runtime/cli/codex/sync-prompts.cjs --check > "$M/check-codex-prompts.txt" 2>&1; rc=$?; echo "codex-prompts $(tail -1 "$M/check-codex-prompts.txt") rc=$rc" >> "$M/summary.txt"
  node .skilled/skills/system-spec-kit/runtime/cli/pi/sync-agents-pi.cjs --check > "$M/check-pi-agents.txt" 2>&1; rc=$?; echo "pi-agents $(tail -1 "$M/check-pi-agents.txt") rc=$rc" >> "$M/summary.txt"
  node .skilled/skills/system-spec-kit/runtime/cli/pi/sync-prompts-pi.cjs --check > "$M/check-pi-prompts.txt" 2>&1; rc=$?; echo "pi-prompts $(tail -1 "$M/check-pi-prompts.txt") rc=$rc" >> "$M/summary.txt"
  node .skilled/commands/doctor/scripts/agent-roster-mirror-check.cjs > "$M/check-roster.txt" 2>&1; rc=$?; echo "agent-roster $(grep 'STATUS=' "$M/check-roster.txt" | tail -1) rc=$rc" >> "$M/summary.txt"
  node .skilled/commands/doctor/scripts/command-catalog-mirror-check.cjs > "$M/check-catalog.txt" 2>&1; rc=$?; echo "command-catalog $(grep 'STATUS=' "$M/check-catalog.txt" | tail -1) rc=$rc" >> "$M/summary.txt"
  node .skilled/bin/check-agent-mirror-sync.cjs --all > "$M/check-agent-bodies.txt" 2>&1; rc=$?; echo "agent-bodies $(tail -1 "$M/check-agent-bodies.txt") rc=$rc" >> "$M/summary.txt"
  cat "$M/summary.txt"
  ```

- [x] T009 Run the read-only doctor:speckit checks and compare the index staleness set (`scratch/doctor-after.json`, `scratch/index-before.json`, `scratch/index-after.json`). Run the block below. Verify: it prints `INDEX_STALENESS_SAME`, `gate1_exit=0` and `lookup_exit=0` or `lookup_exit=1`. An exit of 2 or higher from the lookup is an execution error, not a no-hit: mark this task `[B]`. `INDEX_STALENESS_DIFF` means this phase changed a document the index reads, which it must not: mark this task `[B]` and read the diff.

  ```bash
  cd "$WORKTREE"
  node "$S/runtime/cli/retrieval/generate-trigger-index.mjs" --check --json > "$PHASE/scratch/doctor-after.json" 2> "$PHASE/scratch/doctor-after.err"; echo "exit=$?" > "$PHASE/scratch/doctor-after.exit"
  for w in before after; do
    jq -S '{fresh, missingDocuments, obsoletePaths, stale: (.staleDocuments | map(.path) | sort)}' "$PHASE/scratch/doctor-$w.json" > "$PHASE/scratch/index-$w.json"
  done
  diff "$PHASE/scratch/index-before.json" "$PHASE/scratch/index-after.json" > /dev/null && echo INDEX_STALENESS_SAME || echo INDEX_STALENESS_DIFF
  node "$S/runtime/cli/runtime-mirrors/sync-gate1-pointers.cjs" --check > "$PHASE/scratch/gate1.txt" 2>&1; echo "gate1_exit=$?"
  node "$S/runtime/cli/retrieval/lookup-trigger-index.mjs" --json -- "spec authoring card" > "$PHASE/scratch/lookup.json" 2>&1; echo "lookup_exit=$?"
  ```

- [x] T010 Check the phase 1 ledger rows owned by this phase (`scratch/audit/owner-006.tsv`, `scratch/audit/owner-006-open.txt`, `goal.md`). Run the block below. It prints `OWNER006=LEDGER_MISSING` when the ledger is absent. Otherwise it prints `OWNER006_TOTAL=<n>`, `OWNER006_OPEN=<m>`, one `COVERED` or `OPEN` line per owner `006` row and then `OWNER006_COUNTS_OK`. Verify: the block prints `OWNER006_COUNTS_OK`, so the status file matches both summary numbers. When the ledger is absent it prints `OWNER006=LEDGER_MISSING` instead and the task closes with it. Write both numbers and the path `scratch/audit/owner-006-open.txt` into the `Owner 006 ledger rows recorded (T010)` row of `goal.md` section 4. That file already holds every `OPEN` line verbatim, so no line is copied by hand. An `OPEN` row is not fixed here, because its text was not audited at authoring time. When `LED` is missing, write `OWNER006=LEDGER_MISSING` in the same row and the task closes with it.

  ```bash
  cd "$WORKTREE"
  A="$PHASE/scratch/audit"
  if [ ! -s "$LED" ]; then
    echo "LEDGER_MISSING" > "$A/owner-006.tsv"
    : > "$A/owner-006-open.txt"
    echo "OWNER006=LEDGER_MISSING"
  else
    jq -r 'select(.owner_phase=="006") | [.id,.file] | @tsv' "$LED" > "$A/owner-006.tsv"
    jq -r .file "$ROWS" | sort -u > "$A/row-files.txt"
    while IFS=$'\t' read -r id file; do
      if grep -qxF -- "$file" "$A/row-files.txt"; then echo "COVERED $id $file"; else echo "OPEN $id $file"; fi
    done < "$A/owner-006.tsv" > "$A/owner-006-status.txt"
    grep '^OPEN ' "$A/owner-006-status.txt" > "$A/owner-006-open.txt" || :
    echo "OWNER006_TOTAL=$(wc -l < "$A/owner-006.tsv" | tr -d ' ')"
    echo "OWNER006_OPEN=$(wc -l < "$A/owner-006-open.txt" | tr -d ' ')"
    cat "$A/owner-006-status.txt"
    total_status=$(grep -cE '^(COVERED|OPEN) ' "$A/owner-006-status.txt")
    total_rows=$(grep -c . "$A/owner-006.tsv")
    open_status=$(grep -c '^OPEN ' "$A/owner-006-status.txt")
    open_rows=$(grep -c . "$A/owner-006-open.txt")
    if [ "$total_status" = "$total_rows" ] && [ "$open_status" = "$open_rows" ]; then echo "OWNER006_COUNTS_OK"; else echo "OWNER006_COUNTS_DIFF"; fi
  fi
  ```

- [x] T011 Check that only the rows and the generators changed (`scratch/audit/allowed-files.txt`, `scratch/audit/changed-files.txt`). Run the block below. Verify: the last command prints `0`. A path it lists is a change no row and no generator explains. Restore it with `git restore --source="$P6START" -- <path>`, rerun T008, and record it in `goal.md` section 4.

  ```bash
  cd "$WORKTREE"
  A="$PHASE/scratch/audit"
  { jq -r .file "$ROWS"; sed 's/^...//' "$PHASE/scratch/status-start.txt"; } | sort -u > "$A/allowed-files.txt"
  { git diff --name-only; git ls-files --others --exclude-standard; } | grep -v "^$PHASE_REL/" | sort -u > "$A/changed-files.txt"
  grep -vE '^\.(codex|pi)/(agents|prompts)/' "$A/changed-files.txt" > "$A/changed-outside-generated.txt"
  comm -13 "$A/allowed-files.txt" "$A/changed-outside-generated.txt" | tee "$A/unexplained-files.txt" | wc -l | tr -d ' '
  ```
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T012 Compare the spec-kit suite with the phase start (`scratch/suite-end.txt`, `scratch/suite-summary.txt`). Run the first block. It takes several minutes. Then run the second block. Verify: it prints `SUITE_MATCH` and `CUMULATIVE` lines that name the phase 1 difference. A `SUITE_DIFF` means this phase broke a test: read the lines that start with `FAIL` in the end file, rerun the first block once, and mark this task `[B]` on a second difference.

  ```bash
  cd "$WORKTREE"
  npm --prefix "$WORKTREE/$S" test > "$PHASE/scratch/suite-end.txt" 2>&1; echo "exit=$?" >> "$PHASE/scratch/suite-end.txt"
  ```

  ```bash
  cd "$WORKTREE"
  for w in before end; do
    { grep -E '^ *(Test Files|Tests) ' "$PHASE/scratch/suite-$w.txt" | sed -E 's/^ +//; s/ +$//'; tail -1 "$PHASE/scratch/suite-$w.txt"; } > "$PHASE/scratch/suite-$w-summary.txt"
  done
  diff "$PHASE/scratch/suite-before-summary.txt" "$PHASE/scratch/suite-end-summary.txt" && echo SUITE_MATCH || echo SUITE_DIFF
  echo "CUMULATIVE_DELTA_VS_PHASE_1"
  diff <(grep -E '^ *(Test Files|Tests) ' "$P1/scratch/baseline/suite-start.txt" | sed -E 's/^ +//; s/ +$//') <(grep -E '^ *(Test Files|Tests) ' "$PHASE/scratch/suite-end.txt" | sed -E 's/^ +//; s/ +$//') || true
  ```

- [x] T013 Frontier review of the diff (`scratch/review/T013.txt`). Read `.skilled/skills/cli-external-orchestration/cli-codex/SKILL.md` first. Use its read-only invocation with the `gpt-6-luna` model, as phase 1 did. Write the brief with the first block and send it with the second block. The reply lands in `scratch/review/T013.txt`. Verify: `grep -cvE '^(P0|P1|P2) |^NO FINDINGS$' "$PHASE/scratch/review/T013.txt"` prints `0`.

```bash
cd "$WORKTREE"
cat > "$PHASE/scratch/briefs/T013.txt" <<BRIEF
GATE 3 IS PRE-RESOLVED. You are a non-interactive read-only reviewer. AI_SESSION_CHILD=1 is set.
You write nothing, so no documentation-scope question applies. Do not edit, create or delete any file.
ROLE: You are a read-only reviewer of a text diff. Your output is checked line by line by a script.
Run: git diff $P6START --stat
Then run: git diff $P6START -- .skilled .claude/agents
Then read $PHASE_REL/scratch/audit/rows.jsonl.
Check these five things:
(1) Every changed line equals the expected_text of one row, and no other line changed.
(2) No row's new text names a file that does not exist. Check each named path with ls.
(3) The A1 to A4 searches in $PHASE_REL/scratch/audit/searches.txt each ended with a code of 1.
(4) Every generated mirror under .codex and .pi came from a generator run, shown by the five gen-*.txt files in $PHASE_REL/scratch/mirrors.
(5) No file under .skilled/skills/system-spec-kit/templates, references or runtime changed.
Return one line per finding in this form, and nothing else:
P0|P1|P2 <file>:<line> | <what is wrong> | <the fix>
Return the single line NO FINDINGS when there are none.
BRIEF
```

  ```bash
  cd "$WORKTREE"
  AI_SESSION_CHILD=1 codex exec --model gpt-6-luna -c model_reasoning_effort="high" -c service_tier="fast" \
    -c approval_policy=never --sandbox read-only "$(cat "$PHASE/scratch/briefs/T013.txt")" </dev/null \
    > "$PHASE/scratch/review/T013.txt" 2> "$PHASE/scratch/review/T013.err" &
  PID=$!; wait "$PID"; kill -9 "$PID" 2>/dev/null; pkill -9 -P "$PID" 2>/dev/null
  ```

- [x] T014 Apply the review findings and close the phase (this folder and one local commit). For each `P0` or `P1` line, apply the exact text in the finding's third column when it names one of the 16 row files, then rerun T007, T008 and T012. For each `P2` line, apply that same text under the same condition. For every finding that names a path outside the 16 row files, copy the finding line verbatim into the `Deviations and findings` table of `goal.md` section 4 and raise it to the operator. Do not edit a file outside the 16 row files.

  Write the four literal close-out values below without rewording them. The date is the day T014 runs, as `YYYY-MM-DD`.

  - In `implementation-summary.md`, replace `| **Status** | Draft |` with `| **Status** | Complete |`.
  - In `implementation-summary.md`, replace `| **Completed** | Not started |` with `| **Completed** | <YYYY-MM-DD> |`.
  - In `implementation-summary.md`, replace `Nothing is built yet. This summary is rewritten when the phase closes.` with `The phase applied the rows in scratch/audit/applied.txt, regenerated every mirror and closed with the suite at the phase start.`
  - In `acceptance-criteria.md`, replace every `| Unmet | - |` with `| Met | - |`.

  Read the commit section of `.skilled/skills/sk-git/SKILL.md`, then run the strict validation and commit with the block below. It adds the files T011 listed plus this phase folder, never everything. Verify: `bash $S/runtime/cli/spec/validate.sh "$PHASE" --strict` prints `RESULT: PASSED`, `grep -cF '| **Status** | Complete |' "$PHASE/implementation-summary.md"` prints `1`, `grep -cE '\| \*\*Completed\*\* \| [0-9]{4}-[0-9]{2}-[0-9]{2} \|' "$PHASE/implementation-summary.md"` prints `1`, `grep -cF 'The phase applied the rows in scratch/audit/applied.txt, regenerated every mirror and closed with the suite at the phase start.' "$PHASE/implementation-summary.md"` prints `1`, `grep -cF '| Met | - |' "$PHASE/acceptance-criteria.md"` prints `8`, and the last command of the block prints the same number as `wc -l < "$PHASE/scratch/audit/changed-files.txt"`.

  ```bash
  cd "$WORKTREE"
  git add -- $(cat "$PHASE/scratch/audit/changed-files.txt") "$PHASE_REL"
  git commit -m "docs(system-spec-kit): align speckit commands and agents with the authoring card"
  git show --name-only --format= HEAD | sed '/^$/d' | grep -cv "^$PHASE_REL/"
  ```
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Every acceptance criterion marked `Met` with its evidence
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`, which holds the audit table, the row schema and the decision records
- **Phase 1 ledger**: See `../001-template-drift-census-and-baseline/scratch/ledger/ledger.jsonl`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Phases 1, 4 and 5 closed with their artifacts present, shown by T001
- [x] CHK-002 [P0] T001 to T005 done with their verify output recorded in `goal.md` section 4
- [x] CHK-003 [P1] `apply_row.py` self-test printed the expected four lines
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `rows.jsonl` holds 27 lines and every `locator` occurs once before T006 runs
- [x] CHK-011 [P0] No audited file was edited by hand or by a model
- [x] CHK-012 [P1] Every applied row printed `extra_paths=0`
- [x] CHK-013 [P1] No row's `expected_text` names a file that does not exist
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met
- [x] CHK-021 [P0] T007 printed four codes of 1 and `GUARD_REFS=6`
- [x] CHK-022 [P1] T012 printed `SUITE_MATCH`
- [x] CHK-023 [P1] A row that failed is recorded with its error and not silently dropped
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Every row ends in one of three states: applied, skipped because a phase 2 to 5 artifact is missing, or blocked with its error
- [x] CHK-FIX-002 [P0] Each of the six checks A1 to A6 was searched over the whole inventory, not one file
- [x] CHK-FIX-003 [P0] The six MIRROR rows carry the same text as the six agent rows they mirror
- [x] CHK-FIX-004 [P1] Every generated tree came from a generator run, shown by the five `gen-*.txt` files
- [x] CHK-FIX-005 [P1] The 6 by 12 matrix is reported as 21 CHANGE cells and the OK table covers the rest
- [x] CHK-FIX-006 [P1] Evidence is pinned to the phase start commit recorded in T003
- [x] CHK-FIX-007 [P1] The trigger index staleness set is identical before and after, shown by T009
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No brief contains a credential, token or key
- [x] CHK-031 [P0] `apply_row.py` wrote only the file each row names
- [x] CHK-032 [P1] The reviewer ran with a read-only sandbox and wrote nothing
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan and tasks agree on the 27 rows
- [x] CHK-041 [P1] `goal.md` section 4 records the phase start commit, each skip and each blocker
- [x] CHK-042 [P2] `scratch/audit/searches.txt` and `scratch/mirrors/summary.txt` are kept as the record of what ran
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Working files are under this phase's `scratch/` only
- [x] CHK-051 [P1] `scratch/selftest/` does not exist at phase close
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 14 | 14/14 |
| P1 Items | 24 | 24/24 |
| P2 Items | 9 | 9/9 |

**Verification Date**: 2026-10-24
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: Architecture Verification

- [x] CHK-100 [P0] ADR-001, ADR-002 and ADR-003 in `plan.md` are followed by T006, T008 and T012
- [x] CHK-101 [P1] All three ADRs have status Accepted
- [x] CHK-102 [P1] Each ADR names the alternative it rejected and why
- [x] CHK-103 [P2] No migration applies to this phase
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: Performance Verification

- [x] CHK-110 [P1] The 27 rows were applied by script with no model call (NFR-P01)
- [x] CHK-111 [P1] Applying a row twice failed the second time (NFR-R01)
- [x] CHK-112 [P2] No load test applies to this phase
- [x] CHK-113 [P2] The suite run time is recorded in `goal.md` section 4
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: Deployment Readiness

- [x] CHK-120 [P0] Rollback in `plan.md` section 7 was not needed, or was run and recorded
- [x] CHK-121 [P0] Nothing outside the rows and the generated trees changed, shown by T011
- [x] CHK-122 [P1] Phase 7 can start: every mirror check is green and the suite matches
- [x] CHK-123 [P1] `goal.md` section 4 names the next phase as ready
- [x] CHK-124 [P2] No deployment applies to this phase
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: Compliance Verification

- [x] CHK-130 [P1] Frontier review ran read-only and its reply is saved
- [x] CHK-131 [P1] No new dependency was installed
- [x] CHK-132 [P2] No user data is handled by this phase
- [x] CHK-133 [P2] No OWASP surface is touched by this phase
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: Documentation Verification

- [x] CHK-140 [P1] `spec.md`, `plan.md`, `tasks.md` and `acceptance-criteria.md` agree at close
- [x] CHK-141 [P1] `implementation-summary.md` cites `applied.txt` and the T012 result
- [x] CHK-142 [P2] No user-facing documentation changes in this phase
- [x] CHK-143 [P2] The count of applied, skipped and blocked rows is recorded for phase 7
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: Sign-Off

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Conductor | Runs and verifies every task | Done | 2026-10-24 |
| Frontier reviewer | Reads the diff read-only | Done (NO FINDINGS) | 2026-10-24 |
| Operator | Merges the phase commit | Pending | |
<!-- /ANCHOR:sign-off -->

