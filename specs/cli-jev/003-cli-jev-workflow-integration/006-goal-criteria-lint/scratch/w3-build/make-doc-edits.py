#!/usr/bin/env python3
"""Orchestrator helper: build each edited skill doc's new text in content/.

Every edit is an exact old -> new replacement that must match once in the
current file, so the briefs hand executors literal text and the orchestrator
can diff the result hunk by hunk.
"""
import pathlib
import sys

ROOT = pathlib.Path(__file__).resolve().parents[6]
OUT = pathlib.Path(__file__).resolve().parent / "content"
GOAL = ROOT / ".skilled/skills/sk-doc/sk-create-goal"
HUB_CATALOG = ROOT / ".skilled/skills/sk-doc/feature-catalog/feature-catalog.md"


def apply(source, name, edits):
    text = source.read_text(encoding="utf-8")
    for old, new in edits:
        count = text.count(old)
        if count != 1:
            sys.exit(f"{source}: expected 1 match, found {count}: {old[:70]!r}")
        text = text.replace(old, new)
    (OUT / name).write_text(text, encoding="utf-8")
    print(f"{name}: {len(edits)} edits")


apply(GOAL / "SKILL.md", "skill-md.new.md", [
    ("version: 1.2.0.0\n", "version: 1.3.0.0\n"),
    ("A finding left open for any reason, an operator brief included, stops the run: report it, print no chat slice and end with `STATUS=FAIL`.\n",
     "A finding left open for any reason, an operator brief included, stops the run: report it, print no chat slice and end with `STATUS=FAIL`. To see which criteria may break rules 4 and 5 below, run the advisory lint `node .skilled/skills/sk-doc/sk-create-goal/scripts/lint-goal-criteria.cjs <packet>`. It always exits 0 and never blocks the handoff.\n"),
    ("- [`scripts/README.md`](scripts/README.md) describes the checker and its tests.\n",
     "- [`scripts/README.md`](scripts/README.md) describes the checker, the advisory criteria lint, its scorer and their tests.\n"),
])

LINT_SECTION = """A clean run prints `[check-goal] RESULT: PASSED (5/5 checks)` and exits 0. A finding names the check, the packet and the detail. The budget check skips only a phase child that is not itself a phase parent, the same line section 2 of [`budget-and-handoff.md`](references/budget-and-handoff.md) draws.

### The Advisory Criteria Lint

[`lint-goal-criteria.cjs`](./scripts/lint-goal-criteria.cjs) checks rules 4 and 5, which the checker leaves alone: each criterion is self-contained and checkable without opening another file. It is advisory. It makes no model call, always exits 0 and never blocks a handoff.

```bash
node .skilled/skills/sk-doc/sk-create-goal/scripts/lint-goal-criteria.cjs <packet>
node .skilled/skills/sk-doc/sk-create-goal/scripts/lint-goal-criteria.cjs --all
```

Rule 4 flags a phrase such as "the report" whose subject the line never names. Rule 5 flags wording such as "as described in" whose check needs another document. `--all` skips `z_archive` and counts the goals under a `scratch` folder apart as `scratch_excluded=`. `--json` prints each criterion's `path:line` id, a 12-character hash of its text, its class and the flagged spans.

[`score-goal-lint.cjs`](./scripts/score-goal-lint.cjs) measures the lint against labels, joined on that hash:

```bash
node .skilled/skills/sk-doc/sk-create-goal/scripts/score-goal-lint.cjs --labels .skilled/skills/sk-doc/sk-create-goal/scripts/goal-criteria-labels.jsonl
```

It prints precision, recall and F1 per rule and the labeled violation rate with a Wilson 95% interval. [`goal-criteria-labels.jsonl`](./scripts/goal-criteria-labels.jsonl) holds 100 drawn criterion lines whose label fields stay empty until the operator adopts a rubric and labels them. Until then the scorer prints `unlabeled=100` and no rate.
"""

apply(GOAL / "README.md", "readme.new.md", [
    ("A clean run prints `[check-goal] RESULT: PASSED (5/5 checks)` and exits 0. A finding names the check, the packet and the detail. The budget check skips only a phase child that is not itself a phase parent, the same line section 2 of [`budget-and-handoff.md`](references/budget-and-handoff.md) draws.\n",
     LINT_SECTION),
    ("holds eight deterministic operator scenarios in one category",
     "holds nine deterministic operator scenarios in one category"),
    ("| `route-session-goal-away.md` | A session-goal request writes no goal file |\n",
     "| `route-session-goal-away.md` | A session-goal request writes no goal file |\n| `lint-goal-criteria.md` | The advisory lint flags the criteria that break rules 4 and 5 and exits 0 |\n"),
    ("| Checker and template tests | `node --test .skilled/skills/sk-doc/sk-create-goal/scripts/tests/` | `pass 15`, `fail 0`, including template parity with `goal.md.tmpl` |\n",
     "| Checker, lint and template tests | `node --test .skilled/skills/sk-doc/sk-create-goal/scripts/tests/` | `pass 40`, `fail 0`, including template parity with `goal.md.tmpl` |\n| Criteria lint | `node .skilled/skills/sk-doc/sk-create-goal/scripts/lint-goal-criteria.cjs --all` | Per-rule counts and `scratch_excluded=`, exit 0 |\n"),
    ("`PASS ... scenarios=8 ... violations=0`", "`PASS ... scenarios=9 ... violations=0`"),
    ("| [`scripts/README.md`](./scripts/README.md) | The checker, its tests and fixtures |\n",
     "| [`scripts/README.md`](./scripts/README.md) | The checker, the criteria lint, its scorer, their tests and fixtures |\n"),
    ("| The eight operator scenarios and the run-record contract |",
     "| The nine operator scenarios and the run-record contract |"),
])

apply(GOAL / "scripts/README.md", "scripts-readme.new.md", [
    ('title: "sk-create-goal scripts: goal conformance checker"\n',
     'title: "sk-create-goal scripts: goal checker and criteria lint"\n'),
    ('description: "Read-only checker for packet goal files, with its node:test suites and fixtures."\n',
     'description: "Read-only checker and advisory criteria lint for packet goal files, with the lint\'s scorer and label sample, node:test suites and fixtures."\n'),
    ('  - "goal template parity test"\n',
     '  - "goal template parity test"\n  - "goal criteria lint"\n  - "score-goal-lint"\n'),
    ("# sk-create-goal scripts: goal conformance checker\n",
     "# sk-create-goal scripts: goal checker and criteria lint\n"),
    ("It catches four things the system-spec-kit validator does not catch on its own: a phase child with no binding row, leftover template placeholders, a criterion count outside three to seven, and a parent over the 4,000-character durable budget.\n",
     "It catches five things the system-spec-kit validator does not catch on its own: a phase child with no binding row, leftover template placeholders, a criterion count outside three to seven, a parent over the 4,000-character durable budget and a stray `---` line that closed the frontmatter early.\n\nBeside it sits an advisory lint for rules 4 and 5, which the checker does not test: each criterion self-contained and checkable without opening another file. A scorer measures that lint against labels the operator writes.\n"),
    ("- Placeholder detection covers system-spec-kit's `goal.md.tmpl` wording and the wording of the three templates in `../assets/`, which the checker reads at load time.\n",
     "- Placeholder detection covers system-spec-kit's `goal.md.tmpl` wording and the wording of the three templates in `../assets/`, which the checker reads at load time.\n- `lint-goal-criteria.cjs` and `score-goal-lint.cjs` read goal files and a labels file and write nothing. The lint always exits 0, so it never blocks a handoff.\n- The lint copies the checker's criterion parser instead of importing it, because the checker exports only packet-level runners. A parity test holds the two to the same criteria count.\n"),
    ("+-- check-goal.cjs               # CLI and exported checks\n+-- tests/\n|   +-- check-goal.test.cjs      # Positive, negative and unfilled-template controls\n|   +-- template-parity.test.cjs # Asset templates against goal.md.tmpl\n",
     "+-- check-goal.cjs               # CLI and exported checks\n+-- lint-goal-criteria.cjs       # Advisory lint for criteria rules 4 and 5\n+-- score-goal-lint.cjs          # Scores the lint against labels\n+-- goal-criteria-labels.jsonl   # Drawn criterion lines waiting for labels\n+-- tests/\n|   +-- check-goal.test.cjs      # Positive, negative and unfilled-template controls\n|   +-- lint-goal-criteria.test.cjs # Both rules, the walker and parser parity\n|   +-- score-goal-lint.test.cjs # Scorer outputs on synthetic labels\n|   +-- template-parity.test.cjs # Asset templates against goal.md.tmpl\n"),
    ("| `tests/check-goal.test.cjs` | Proves the positive fixture passes every check, each negative fixture fails only its named check, and an unfilled copy of each asset template fails the placeholder check. |\n",
     "| `lint-goal-criteria.cjs` | Lints the criteria of one packet, or of every active goal with `--all`, for rules 4 and 5. Skips `z_archive` and counts `scratch` goals apart. Prints counts and flagged lines, or JSON with `--json`, and always exits 0. |\n| `score-goal-lint.cjs` | Joins labels to the lint by text hash and prints per-rule precision, recall and F1, the labeled violation rate with a Wilson 95% interval and the stop line under 5%. Counts stale and unlabeled rows apart and refuses mixed rubrics. |\n| `goal-criteria-labels.jsonl` | 100 drawn criterion lines, one JSON row each with `id`, `text_sha12` and four label fields left null for the operator. No row holds criterion text. |\n| `tests/check-goal.test.cjs` | Proves the positive fixture passes every check, each negative fixture fails only its named check, and an unfilled copy of each asset template fails the placeholder check. |\n| `tests/lint-goal-criteria.test.cjs` | Holds each rule to its pass and fail cases, the walker to its scratch and archive exclusions, the parser to the checker's criteria count and the command line to exit 0. |\n| `tests/score-goal-lint.test.cjs` | Proves the per-rule numbers, the Wilson interval, the stale, unlabeled and mixed-rubric cases and the stop line on synthetic labels. |\n"),
    ("The checker imports only Node built-ins and `../../../../hooks/goal/lib/goal-slice.cjs`. It reads `goal.md` and the direct phase-child directories of the packet it is given, plus the three asset templates. It changes no file and no session state.\n\n```text\npacket/goal.md ──▶ goal-slice.cjs (durable slice, budget) ──▶ five checks ──▶ findings + exit code\n../assets/goal-*-template.md ──▶ placeholder wording ──┘\n```\n",
     "The checker imports only Node built-ins and `../../../../hooks/goal/lib/goal-slice.cjs`. It reads `goal.md` and the direct phase-child directories of the packet it is given, plus the three asset templates. It changes no file and no session state.\n\n```text\npacket/goal.md ──▶ goal-slice.cjs (durable slice, budget) ──▶ five checks ──▶ findings + exit code\n../assets/goal-*-template.md ──▶ placeholder wording ──┘\n```\n\nThe lint imports the same `goal-slice.cjs` and nothing else outside Node. The scorer reads a labels file and either a saved `--json` lint run or a fresh one. Neither makes a model call or spawns a process.\n\n```text\nspecs/**/goal.md ──▶ lint-goal-criteria.cjs (rules 4 and 5) ──▶ report or JSON, exit 0\ngoal-criteria-labels.jsonl + lint records ──▶ score-goal-lint.cjs ──▶ per-rule numbers, rate, stop line\n```\n"),
    ("`<packet>` is a packet folder or the path to its `goal.md`. One packet prints each check and `RESULT: PASSED (5/5 checks)` or `RESULT: FAILED`, and exits 0 only when all five pass. `--all` scans every active goal outside `z_archive/` and exits 2 when any goal has a finding. `--root <path>` sets the workspace root.\n",
     "`<packet>` is a packet folder or the path to its `goal.md`. One packet prints each check and `RESULT: PASSED (5/5 checks)` or `RESULT: FAILED`, and exits 0 only when all five pass. `--all` scans every active goal outside `z_archive/` and prints the finding count per check and each finding. It exits 2 when a goal cannot be read and 0 otherwise, whatever the findings. `--root <path>` sets the workspace root.\n\n```bash\nnode .skilled/skills/sk-doc/sk-create-goal/scripts/lint-goal-criteria.cjs <packet>\nnode .skilled/skills/sk-doc/sk-create-goal/scripts/lint-goal-criteria.cjs --all [--json]\nnode .skilled/skills/sk-doc/sk-create-goal/scripts/score-goal-lint.cjs --labels .skilled/skills/sk-doc/sk-create-goal/scripts/goal-criteria-labels.jsonl [--lint <lint.json>]\n```\n\nThe lint takes the same `<packet>`, `--all` and `--root` and always exits 0. The scorer runs the lint in process unless `--lint` names a saved `--json` run. It exits 0 when it prints a score and 2 when its input cannot be read.\n"),
])

SCG_009_BLOCK = """#### Test Execution
> **Feature file:** linked from the cross-reference index in section 9.
> **Catalog:** no feature-catalog entry exists for this packet.

---

### SCG-009 | Lint goal criteria for rules 4 and 5

#### Description
Verify that the advisory criteria lint flags a dangling reference and a check that needs another document, skips a scratch fixture goal, exits 0 on every input and leaves the goal check green.

#### Scenario Contract
Prompt: `Lint the completion criteria of the scratch demo packet at $SCRATCH/specs/demo-packet and tell me which ones a reader could not check from the line alone.`

The lint reports each flagged criterion by rule and line, counts the scratch copy apart and names a missing packet, and every run exits 0. The goal check on the same packet still passes all five checks.

Desired user-visible outcome: the author learns which two criteria to rewrite and sees that the lint blocked nothing.

#### Test Execution
> **Feature file:** linked from the cross-reference index in section 9.
> **Catalog:** no feature-catalog entry exists for this packet.

---

## 8. AUTOMATED TEST CROSS-REFERENCE"""

apply(GOAL / "manual-testing-playbook/manual-testing-playbook.md", "playbook-root.new.md", [
    ("through eight deterministic goal-authoring scenarios in one category.",
     "through nine deterministic goal-authoring scenarios in one category."),
    ("## 7. GOAL AUTHORING (`SCG-001..SCG-008`)", "## 7. GOAL AUTHORING (`SCG-001..SCG-009`)"),
    ("#### Test Execution\n> **Feature file:** linked from the cross-reference index in section 9.\n> **Catalog:** no feature-catalog entry exists for this packet.\n\n---\n\n## 8. AUTOMATED TEST CROSS-REFERENCE",
     SCG_009_BLOCK),
    ("| `sk-create-goal/scripts/tests/check-goal.test.cjs` | Unit fixtures for the five named checks and their per-check exports | SCG-005 and SCG-006 exercise the same checks through the operator path |\n",
     "| `sk-create-goal/scripts/tests/check-goal.test.cjs` | Unit fixtures for the five named checks and their per-check exports | SCG-005 and SCG-006 exercise the same checks through the operator path |\n| `sk-create-goal/scripts/tests/lint-goal-criteria.test.cjs` | Unit fixtures for both lint rules, the line classes, the walker and the exit-0 command line | SCG-009 runs the same lint through the operator path |\n"),
    ("| SCG-008 | Resend the parent after a child change | GOAL AUTHORING | [SCG-008](goal-authoring/resend-parent-after-child-change.md) |",
     "| SCG-008 | Resend the parent after a child change | GOAL AUTHORING | [SCG-008](goal-authoring/resend-parent-after-child-change.md) |\n| SCG-009 | Lint goal criteria for rules 4 and 5 | GOAL AUTHORING | [SCG-009](goal-authoring/lint-goal-criteria.md) |"),
])

CATALOG_SECTION = """See [`document-validation/changelog-entry-frontmatter-check.md`](document-validation/changelog-entry-frontmatter-check.md) for the checks, the type order and source anchors.

### Goal Criteria Lint

#### Description

Flags goal completion criteria that a reader cannot check from the line alone, so an author can fix them before the objective carries them.

#### Current Reality

`lint-goal-criteria.cjs` in `sk-create-goal` gives the mode's rules 4 and 5 their first machine check, with no model call and exit 0 on every input. `score-goal-lint.cjs` measures it against operator labels, and `goal-criteria-labels.jsonl` holds 100 drawn lines that wait for those labels.

#### Source Files

See [`document-validation/goal-criteria-lint.md`](document-validation/goal-criteria-lint.md) for the rules, the line classes and source anchors.
"""

apply(HUB_CATALOG, "catalog-root.new.md", [
    ("the default-on compiled-routing fast path that resolves ahead of it and the shared validator's changelog entry check.\"",
     "the default-on compiled-routing fast path that resolves ahead of it, the shared validator's changelog entry check and the advisory goal-criteria lint.\""),
    ('  - "changelog entry frontmatter check"\n', '  - "changelog entry frontmatter check"\n  - "goal criteria lint"\n'),
    ('last_updated: "2026-09-27"', 'last_updated: "2026-09-28"'),
    ("The hub's shared validator also holds every changelog entry to its search metadata.\n",
     "The hub's shared validator also holds every changelog entry to its search metadata. An advisory lint in `sk-create-goal` flags goal criteria a reader cannot check from the line alone.\n"),
    ("See [`document-validation/changelog-entry-frontmatter-check.md`](document-validation/changelog-entry-frontmatter-check.md) for the checks, the type order and source anchors.\n",
     CATALOG_SECTION),
    ("Note: this catalog documents `sk-doc`'s own hub-level routing and shared validation.",
     "Note: this catalog documents `sk-doc`'s own hub-level routing and shared validation, plus the goal-criteria lint of `sk-create-goal`, which ships no catalog of its own."),
])
