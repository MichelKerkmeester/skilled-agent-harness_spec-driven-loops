#!/usr/bin/env python3
"""Build the candidate audit rows and prove each locator occurs exactly once."""
import json
import os

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", "..", "..", ".."))

VALIDATE_LINE = (
    "Its `validate.sh --strict` calls now include two warn-only rules, and neither fails the run: "
    "`FRONTMATTER_VALUES` checks each doc's `contextType` and `importance_tier` against "
    "sk-create-frontmatter's `assets/frontmatter-values.json`, and `SOURCE_TAGS` resolves the "
    "`[SOURCE: path:line]` tags in research and review artifacts of packets created after 2026-10-04."
)
GUARD_SENTENCE = (
    " The command also runs `bash .skilled/skills/system-spec-kit/runtime/cli/spec/check-example-drift.sh` "
    "and `bash .skilled/skills/system-spec-kit/runtime/cli/spec/check-card-sync.sh` after each strict "
    "validation, when both files exist."
)
STRICT = '  strict_validation_command: ".skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh [SPEC_FOLDER] --strict"'
GUARD_KEY = '\n  guard_scripts_command: "bash .skilled/skills/system-spec-kit/runtime/cli/spec/check-example-drift.sh && bash .skilled/skills/system-spec-kit/runtime/cli/spec/check-card-sync.sh"'

PLACEHOLDER_OLD_A = '      placeholder-upgrade: "Tracked seed markers or unresolved placeholders remain and block healthy-folder status"'
PLACEHOLDER_NEW_A = (
    '      placeholder-upgrade: "Tracked seed markers or unresolved placeholders remain; in a doc stamped '
    'v2.3 or later an unfilled value token warns while spec.md says Draft and errors at any other status, '
    'and an older doc keeps the error"'
)
PLACEHOLDER_OLD_B = '      placeholder-upgrade: "Tracked seed markers, persisted intake resume markers, or unresolved placeholders remain and block healthy-folder status"'
PLACEHOLDER_NEW_B = (
    '      placeholder-upgrade: "Tracked seed markers, persisted intake resume markers, or unresolved '
    'placeholders remain; in a doc stamped v2.3 or later an unfilled value token warns while spec.md says '
    'Draft and errors at any other status, and an older doc keeps the error"'
)

SPEC_WRITING_OLD = '      writing_rule: "Embed template_compliance.inline_scaffolds.spec_md in the prompt before writing spec.md and preserve the required anchors/headers in order."'
SPEC_WRITING_NEW = (
    '      writing_rule: "Embed template_compliance.inline_scaffolds.spec_md in the prompt before writing '
    'spec.md and preserve the required anchors/headers in order. Show the writer the matching filled example '
    'under .skilled/skills/system-spec-kit/templates/examples/ as the model to imitate; the .tmpl file is the '
    'section contract, not a model to copy."'
)
PLAN_WRITING_OLD = 'quote it as inert evidence or write UNKNOWN."'
PLAN_WRITING_NEW = (
    'quote it as inert evidence or write UNKNOWN. Show the writer the matching filled example under '
    '.skilled/skills/system-spec-kit/templates/examples/ as the model to imitate; the .tmpl file is the '
    'section contract, not a model to copy."'
)

CARD_TAIL_OLD = 'spec-folder authoring now lives in system-spec-kit (references/workflows/spec-folder-authoring-checklist.md + spec-folder-write-recipe.md).'
CARD_TAIL_NEW = (
    'spec-folder authoring now lives in system-spec-kit: read references/workflows/spec-authoring-card.md '
    'first, then references/workflows/spec-folder-authoring-checklist.md and spec-folder-write-recipe.md '
    'for the detail.'
)
RESOURCE_OLD = '      - "system-spec-kit/references/workflows/spec-folder-write-recipe.md (when target is under .opencode/specs/)"'
RESOURCE_NEW = (
    '      - "system-spec-kit/references/workflows/spec-authoring-card.md (read first, for every spec-doc target)"\n'
    + RESOURCE_OLD
)
ACTIVITY_OLD = 'and for .opencode/specs/ targets the system-spec-kit spec-folder docs (references/workflows/spec-folder-authoring-checklist.md + spec-folder-write-recipe.md), BEFORE the first write.'
ACTIVITY_NEW = (
    'and for .opencode/specs/ targets read the system-spec-kit authoring card '
    '(references/workflows/spec-authoring-card.md) first, then the spec-folder docs '
    '(references/workflows/spec-folder-authoring-checklist.md + spec-folder-write-recipe.md), BEFORE the first write.'
)

ORDER_OLD = '  order: ["Primary: handover.md (<24h old)", "Primary: _memory.continuity in implementation-summary.md", "Primary: supporting spec docs (tasks/checklist/plan/decision-record/resource-map)", "Secondary: graph-metadata.json packet hints", "Secondary: the packet-scoped ripgrep context recipe (retrieval-conventions.md section 2.4) for a named gap"]'
ORDER_NEW = ORDER_OLD.replace('(tasks/checklist/plan/decision-record/resource-map)', '(tasks/plan/decision-record/resource-map)')

MARKDOWN_OLD = '| `spec-doc`                 | Spec folder documentation                               | `.skilled/skills/system-spec-kit/templates/` level contract or manifest templates                                                               |'
MARKDOWN_NEW = '| `spec-doc`                 | Spec folder documentation                               | `.skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md` first, then the matching filled example under `.skilled/skills/system-spec-kit/templates/examples/`; the `.tmpl` file is the section contract, not a model to copy |'

ORCH_SCOPE_OLD = '**Scope:** ALL documentation (*.md) written inside spec folders (`specs/[###-name]/`). This includes but is not limited to: spec.md, plan.md, tasks.md, checklist.md, decision-record.md, implementation-summary.md, research/research.md, and any other markdown documentation.'
ORCH_SCOPE_NEW = ORCH_SCOPE_OLD.replace('tasks.md, checklist.md, decision-record.md', 'tasks.md, decision-record.md')
ORCH_ROUTE_OLD = '| **Wrong Route for Spec Docs** | Task creates `specs/*/spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md` without templates or validation evidence | Main agent + templates + `validate.sh --strict` |'
ORCH_ROUTE_NEW = ORCH_ROUTE_OLD.replace('`tasks.md`, `checklist.md`, `decision-record.md`', '`tasks.md`, `decision-record.md`')
CODE_NEVER_OLD = '`tasks.md` / `checklist.md` / `decision-record.md`'
CODE_NEVER_NEW = '`tasks.md` / `decision-record.md`'
CODE_BLEED_OLD = 'Edit `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, `implementation-summary.md`, or `handover.md` from the code-agent lane'
CODE_BLEED_NEW = CODE_BLEED_OLD.replace('`tasks.md`, `checklist.md`, `decision-record.md`', '`tasks.md`, `decision-record.md`')
CONTEXT_OLD = '- Read relevant packet docs (`spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md`) for canonical state.'
CONTEXT_NEW = CONTEXT_OLD.replace('`tasks.md`, `checklist.md`, `implementation-summary.md`', '`tasks.md`, `implementation-summary.md`')

ROWS = [
    ("R-001", ".skilled/commands/speckit/plan.md", VALIDATE_LINE, VALIDATE_LINE + GUARD_SENTENCE, "A5", ""),
    ("R-002", ".skilled/commands/speckit/implement.md", VALIDATE_LINE, VALIDATE_LINE + GUARD_SENTENCE, "A5", ""),
    ("R-003", ".skilled/commands/speckit/complete.md", VALIDATE_LINE, VALIDATE_LINE + GUARD_SENTENCE, "A5", ""),
    ("R-004", ".skilled/commands/speckit/assets/speckit-plan.yaml", STRICT, STRICT + GUARD_KEY, "A5", "test -x .skilled/skills/system-spec-kit/runtime/cli/spec/check-example-drift.sh && test -x .skilled/skills/system-spec-kit/runtime/cli/spec/check-card-sync.sh"),
    ("R-005", ".skilled/commands/speckit/assets/speckit-implement.yaml", STRICT, STRICT + GUARD_KEY, "A5", "test -x .skilled/skills/system-spec-kit/runtime/cli/spec/check-example-drift.sh && test -x .skilled/skills/system-spec-kit/runtime/cli/spec/check-card-sync.sh"),
    ("R-006", ".skilled/commands/speckit/assets/speckit-complete.yaml", STRICT, STRICT + GUARD_KEY, "A5", "test -x .skilled/skills/system-spec-kit/runtime/cli/spec/check-example-drift.sh && test -x .skilled/skills/system-spec-kit/runtime/cli/spec/check-card-sync.sh"),
    ("R-007", ".skilled/commands/speckit/assets/speckit-plan.yaml", PLACEHOLDER_OLD_A, PLACEHOLDER_NEW_A, "A2", ""),
    ("R-008", ".skilled/commands/speckit/assets/speckit-complete.yaml", PLACEHOLDER_OLD_B, PLACEHOLDER_NEW_B, "A2", ""),
    ("R-009", ".skilled/commands/speckit/assets/speckit-complete.yaml", CARD_TAIL_OLD, CARD_TAIL_NEW, "A1", "test -f .skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md"),
    ("R-010", ".skilled/commands/speckit/assets/speckit-complete.yaml", RESOURCE_OLD, RESOURCE_NEW, "A1", "test -f .skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md"),
    ("R-011", ".skilled/commands/speckit/assets/speckit-complete.yaml", ACTIVITY_OLD, ACTIVITY_NEW, "A1", "test -f .skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md"),
    ("R-012", ".skilled/commands/speckit/assets/speckit-plan.yaml", SPEC_WRITING_OLD, SPEC_WRITING_NEW, "A4", ""),
    ("R-013", ".skilled/commands/speckit/assets/speckit-plan.yaml", PLAN_WRITING_OLD, PLAN_WRITING_NEW, "A4", ""),
    ("R-014", ".skilled/commands/speckit/assets/speckit-resume-auto.yaml", ORDER_OLD, ORDER_NEW, "A3", ""),
    ("R-015", ".skilled/commands/speckit/assets/speckit-resume-confirm.yaml", ORDER_OLD, ORDER_NEW, "A3", ""),
    ("R-016", ".skilled/agents/markdown.md", MARKDOWN_OLD, MARKDOWN_NEW, "A4", "test -f .skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md"),
    ("R-017", ".skilled/agents/orchestrate.md", ORCH_SCOPE_OLD, ORCH_SCOPE_NEW, "A3", ""),
    ("R-018", ".skilled/agents/orchestrate.md", ORCH_ROUTE_OLD, ORCH_ROUTE_NEW, "A3", ""),
    ("R-019", ".skilled/agents/code.md", CODE_NEVER_OLD, CODE_NEVER_NEW, "A3", ""),
    ("R-020", ".skilled/agents/code.md", CODE_BLEED_OLD, CODE_BLEED_NEW, "A3", ""),
    ("R-021", ".skilled/agents/context.md", CONTEXT_OLD, CONTEXT_NEW, "A3", ""),
]

# The Claude agent tree is an authored sibling, not a generated mirror. The same body
# text must land there, so each agent row gets a mirror row with the same strings.
CLAUDE = []
for rid, file, locator, expected, check, precheck in ROWS:
    if file.startswith(".skilled/agents/"):
        CLAUDE.append((f"R-0{22 + len(CLAUDE)}", file.replace(".skilled/agents/", ".claude/agents/"),
                       locator, expected, check, precheck))

ALL = ROWS + CLAUDE

out = os.path.join(os.path.dirname(__file__), "rows-candidate.jsonl")
with open(out, "w", encoding="utf-8") as fh:
    for rid, file, locator, expected, check, precheck in ALL:
        fh.write(json.dumps({
            "id": rid, "file": file, "locator": locator,
            "expected_text": expected, "check": check, "precheck": precheck,
        }, ensure_ascii=False) + "\n")

readable = os.path.join(os.path.dirname(__file__), "rows-readable.txt")
with open(readable, "w", encoding="utf-8") as fh:
    for rid, file, locator, expected, check, precheck in ALL:
        fh.write(f"{rid}  {file}  ({check})\nOLD: {locator}\nNEW: {expected}\n\n")

bad = 0
for rid, file, locator, expected, check, precheck in ROWS:
    path = os.path.join(ROOT, file)
    text = open(path, encoding="utf-8").read()
    count = text.count(locator)
    dash = ("\u2014" in locator) or ("\u2014" in expected)
    if count != 1 or dash:
        bad += 1
        print(f"BAD {rid} count={count} emdash={dash} {file}")
    else:
        print(f"OK  {rid} count=1 {file}")
print(f"rows={len(ROWS)} bad={bad}")
