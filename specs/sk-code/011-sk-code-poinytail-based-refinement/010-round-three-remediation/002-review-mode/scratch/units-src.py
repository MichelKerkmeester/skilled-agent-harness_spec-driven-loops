"""Source of the Phase 2 edits for this fix.

Writes scratch/dispatch-units.json and checks that every OLD text occurs exactly
once in the current file. With --simulate DIR it also copies the touched files
into DIR, applies every unit in order, and leaves the result for inspection.

Run from the repository root:
    python3 -I <this file> [--simulate DIR]
"""
import json
import re
import shutil
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
SPEC_SCRATCH = "specs/sk-code/011-sk-code-poinytail-based-refinement/010-round-three-remediation/002-review-mode/scratch"
R = ".skilled/skills/sk-code/sk-code-review"
SKILL = f"{R}/SKILL.md"
README = f"{R}/README.md"
CORE = f"{R}/references/review-core.md"
QUICK = f"{R}/references/quick-reference.md"
UX = f"{R}/references/review-ux-single-pass.md"
DEDUP = f"{R}/references/pr-state-dedup.md"
REMOVAL = f"{R}/assets/removal-plan.md"
PLAYBOOK = f"{R}/manual-testing-playbook/manual-testing-playbook.md"
FINDINGS = f"{R}/scripts/check-review-findings.js"
FINAL = f"{R}/scripts/check-review-final-line.js"
CANARY = f"{R}/scripts/check-rule-copies.js"
HARNESS = f"{R}/scripts/check-rule-copies.test.sh"
SCRIPTS_README = f"{R}/scripts/README.md"
FIXTURE = f"{R}/scripts/review-output-fixture"
CHANGELOG = f"{R}/changelog/v1.7.0.0.md"

CACHE_PATH = "${XDG_CACHE_HOME:-$HOME/.cache}/sk-code-review/<repo-ref>.jsonl"

DETECTOR_OLD = '''def detect_surface_evidence(task, workspace_files=None, changed_files=None) -> str:
    text = _task_text(task)
    files = " ".join((workspace_files or []) + (changed_files or [])).lower()

    if ".skilled/" in files or ".opencode/" in files or keyword_present("jsonc", text) or keyword_present("mcp", text):
        return "sk-code:code-opencode"
    if any(keyword_present(term, text) for term in ["frontend", "web", "css", "dom", "browser"]) or any(
        marker in files for marker in ["next.config", "vite.config", "package.json", "src/"]
    ):
        return "sk-code:code-webflow"
    return "sk-code:unknown"
'''

DETECTOR_NEW = '''# Surface markers restate the shared detection contract,
# ../shared/references/stack-detection.md section 2, which owns them. Change them only when it changes.
OPENCODE_PATH_MARKER = ".skilled/"
OBSIDIAN_FILE_MARKERS = ("esbuild.config.mjs",)
OBSIDIAN_CONTENT_MARKERS = {"manifest.json": '"minAppVersion"', "styles.css": ".db-"}
OBSIDIAN_SOURCE_IMPORT = 'from "obsidian"'
# The hub router's OBSIDIAN_PLUGIN keywords, so a prompt that names the plugin bundles the surface.
OBSIDIAN_PROMPT_TERMS = ["obsidian plugin", "note database plugin"]
WEBFLOW_PATH_MARKERS = ("src/2_javascript/", ".webflow.js", "wrangler.toml")
WEBFLOW_CONTENT_MARKERS = ("Webflow.push", "--vw-", "window.Motion", "window.gsap", "new Lenis", "new Hls", "new Swiper", "FilePond")
NON_WEBFLOW_TERMS = ["not webflow", "no webflow designer", "without webflow", "non-webflow", "vanilla html/css/js only", "stack-agnostic"]

def detect_surface_evidence(task, workspace_files=None, changed_files=None, read_text=None) -> str:
    """Return OPENCODE, OBSIDIAN, WEBFLOW or UNKNOWN, in the shared contract's precedence.

    Paths are repository-relative and already resolved through symlinks, as the
    contract's symlink guard requires. read_text(path) returns a file's text, or "".
    """
    text = _task_text(task)
    paths = [path.replace("\\\\", "/") for path in (workspace_files or []) + (changed_files or [])]
    read = read_text or (lambda path: "")

    def name(path: str) -> str:
        return path.rsplit("/", 1)[-1]

    def in_src(path: str) -> bool:
        return path.startswith("src/") or "/src/" in path

    if any(path.startswith(OPENCODE_PATH_MARKER) or "/" + OPENCODE_PATH_MARKER in path for path in paths):
        return "OPENCODE"
    if (
        any(name(path) in OBSIDIAN_FILE_MARKERS for path in paths)
        or any(name(path) in OBSIDIAN_CONTENT_MARKERS and OBSIDIAN_CONTENT_MARKERS[name(path)] in read(path) for path in paths)
        or any(in_src(path) and OBSIDIAN_SOURCE_IMPORT in read(path) for path in paths)
        or any(keyword_present(term, text) for term in OBSIDIAN_PROMPT_TERMS)
    ):
        return "OBSIDIAN"
    # Explicit non-Webflow wording wins before any Webflow marker.
    if any(keyword_present(term, text) for term in NON_WEBFLOW_TERMS):
        return "UNKNOWN"
    if any(marker in path for path in paths for marker in WEBFLOW_PATH_MARKERS) or any(
        marker in read(path) for path in paths for marker in WEBFLOW_CONTENT_MARKERS
    ):
        return "WEBFLOW"
    # Generic Node (a package.json or src/ alone) is not owned by any surface.
    return "UNKNOWN"
'''

POINTER_LINE = (
    "- Surface detection: the markers and the precedence (OPENCODE > OBSIDIAN > WEBFLOW > UNKNOWN) come from the shared "
    "detection contract, [`stack-detection.md`](../shared/references/stack-detection.md) section 2. `detect_surface_evidence` "
    "below restates that contract and keeps no rules of its own, so it changes only when the contract does."
)

UNITS = []


FIRST_TASK = 14


def next_task():
    return f"T{FIRST_TASK + len(UNITS):03d}"


def edit(task, path, old, new):
    UNITS.append({"task": next_task(), "file": path, "kind": "edit", "old": old, "new": new})


def create(task, path, source):
    UNITS.append({"task": next_task(), "file": path, "kind": "create", "source": source})


# ---- SKILL.md -------------------------------------------------------------
edit(None, SKILL, "version: 1.6.0.0", "version: 1.7.0.0")
edit(None, SKILL, "# code-review Mode - Stack-Agnostic Findings-First Review", "# sk-code-review Mode - Stack-Agnostic Findings-First Review")
edit(None, SKILL, "Use the `code-review` mode (of the sk-code family) when:", "Use the `sk-code-review` mode (of the sk-code family) when:")
edit(None, SKILL,
     "- Feature implementation without review intent; use the surface skill (`code-webflow` / `code-opencode`).",
     "- Feature implementation without review intent; load the surface packet (`sk-code-webflow`, `sk-code-opencode` or `sk-code-obsidian`) that carries the implement doctrine.")
edit(None, SKILL,
     "- Git-only workflow tasks (branching, rebasing, commit hygiene) without code-quality evaluation intent.",
     "- Git-only workflow tasks (branching, rebasing, commit hygiene) without code quality evaluation intent.")
edit(None, SKILL,
     "- Applying review fixes after findings are accepted; use the surface skill (`code-webflow` / `code-opencode`).",
     "- Applying review fixes after findings are accepted; load the surface packet (`sk-code-webflow`, `sk-code-opencode` or `sk-code-obsidian`) that carries the implement doctrine.")
edit(None, SKILL, "- Author-side quality gates before review; use `code-quality`.", "- Author-side quality gates before review; use `sk-code-quality`.")
edit(None, SKILL,
     "- Baseline (always): the `code-review` mode (of the sk-code family) findings-first doctrine.",
     "- Baseline (always): the `sk-code-review` mode (of the sk-code family) findings-first doctrine.")
edit(None, SKILL,
     "- Surface standards evidence (when available): `sk-code` detected surface resources.",
     "- Surface standards evidence (when available): `sk-code` detected surface resources.\n" + POINTER_LINE)
edit(None, SKILL,
     "+- STEP 0: Load the `code-review` mode baseline + `sk-code` surface evidence. The dispatcher / agent assembling the code-review prompt MUST",
     "+- STEP 0: Load the `sk-code-review` mode baseline + `sk-code` surface evidence. The dispatcher / agent assembling the code review prompt MUST")
edit(None, SKILL,
     "| Security/correctness minimums | `code-review` mode baseline |",
     "| Security/correctness minimums | `sk-code-review` mode baseline |")
edit(None, SKILL, DETECTOR_OLD, DETECTOR_NEW)
edit(None, SKILL,
     "2. Load baseline standards from the `code-review` mode (of the sk-code family).",
     "2. Load baseline standards from the `sk-code-review` mode (of the sk-code family).")
edit(None, SKILL,
     "**Overall assessment**: [APPROVE / REQUEST_CHANGES / COMMENT]",
     "**Overall assessment**: [APPROVED / REQUESTED_CHANGES / COMMENTED]")
edit(None, SKILL, "**Baseline used**: [sk-code (`code-review`)]", "**Baseline used**: [sk-code (`sk-code-review`)]")
edit(None, SKILL,
     "**Surface evidence used**: [sk-code:code-webflow | sk-code:code-opencode | sk-code:unknown]",
     "**Surface evidence used**: [OPENCODE | OBSIDIAN | WEBFLOW | UNKNOWN]")
edit(None, SKILL,
     "- `code-review` mode baseline + `sk-code` surface evidence contract is explicit in report context.",
     "- `sk-code-review` mode baseline + `sk-code` surface evidence contract is explicit in report context.")
edit(None, SKILL,
     "- Complements, but does not replace, sibling ownership: the surface skills (`code-webflow` / `code-opencode`) apply fixes and own the implement → debug → verify workflow doctrine, and `code-quality` owns author-side gates.",
     "- Complements, but does not replace, sibling ownership: the surface packets (`sk-code-webflow`, `sk-code-opencode`, `sk-code-obsidian`) carry the implement → debug → verify workflow doctrine the acting agent applies to fix accepted findings, and `sk-code-quality` owns author-side gates.")
edit(None, SKILL,
     "Manual testing scenarios for the `code-review` mode (of the sk-code family) live in `manual-testing-playbook/manual-testing-playbook.md` (root index) plus per-feature sub-files under `manual-testing-playbook/<topic>/<scenario>.md` (both the category folder and the scenario file use bare descriptive slugs, no numeric prefix). Run scenarios via `bash .skilled/skills/sk-doc/scripts/validate_document.py manual-testing-playbook/manual-testing-playbook.md` for structural validation; execute scenarios in opencode/Claude/OpenCode sessions for behavioral verification.",
     "Manual testing scenarios for the `sk-code-review` mode (of the sk-code family) live in `manual-testing-playbook/manual-testing-playbook.md` (root index) plus per-feature sub-files under `manual-testing-playbook/<topic>/<scenario>.md` (both the category folder and the scenario file use bare descriptive slugs, no numeric prefix). Validate the root index with `python3 .skilled/skills/sk-doc/scripts/validate_document.py --type playbook .skilled/skills/sk-code/sk-code-review/manual-testing-playbook/manual-testing-playbook.md`, which applies the playbook rule set. Execute scenarios in Claude Code or OpenCode sessions for behavioral verification.")
edit(None, SKILL,
     "- Path: `.skilled/.code-review-cache/<repo-ref>.jsonl`",
     f"- Path: `{CACHE_PATH}`, in the reviewing user's cache directory. The gate never writes into the reviewed repository. Its one side effect is this file, and deleting it resets the gate.")

# ---- README.md ------------------------------------------------------------
edit(None, README, "version: 1.6.0.0", "version: 1.7.0.0")
edit(None, README, 'title: "code-review mode"', 'title: "sk-code-review mode"')
edit(None, README, "# code-review mode", "# sk-code-review mode")
edit(None, README, "The `code-review` mode of the sk-code family fixes this.", "The `sk-code-review` mode of the sk-code family fixes this.")
edit(None, README, "The `code-review` mode is the single-pass review baseline", "The `sk-code-review` mode is the single-pass review baseline")
edit(None, README, "**Baseline used**: sk-code (code-review)", "**Baseline used**: sk-code (sk-code-review)")
edit(None, README, "**Surface evidence used**: sk-code:code-opencode", "**Surface evidence used**: OPENCODE")
edit(None, README, "The baseline minimums from the `code-review` mode are always enforced", "The baseline minimums from the `sk-code-review` mode are always enforced")
edit(None, README,
     "writing a signature into `.skilled/.code-review-cache/`.",
     "writing a signature into `${XDG_CACHE_HOME:-$HOME/.cache}/sk-code-review/` in your user cache directory, never into the reviewed repository.")
edit(None, README, "Reach for the `code-review` mode when", "Reach for the `sk-code-review` mode when")
edit(None, README,
     "or for git-only tasks that carry no code-quality evaluation.",
     "or for git-only tasks that carry no code quality evaluation.")
edit(None, README,
     "| `code-webflow` / `code-opencode` | Surface skills that apply fixes after review findings are accepted and own the implement → debug → verify workflow doctrine |",
     "| `sk-code-webflow` / `sk-code-opencode` / `sk-code-obsidian` | Surface evidence packets that carry the implement → debug → verify workflow doctrine the acting agent applies after review findings are accepted |")
edit(None, README, "| `code-quality` | Runs author-side quality gates before review |", "| `sk-code-quality` | Runs author-side quality gates before review |")
edit(None, README,
     "The security and code-quality checklists are non-negotiable.",
     "The security and code quality checklists are non-negotiable.")
edit(None, README,
     "A: The `code-review` mode is the single-pass baseline.",
     "A: The `sk-code-review` mode is the single-pass baseline.")
edit(None, README,
     "A: The surface skills (`code-webflow` / `code-opencode`) apply fixes and own the implement → debug → verify workflow doctrine. `code-quality` owns author-side gates. The `code-review` mode consumes surface evidence",
     "A: The surface packets (`sk-code-webflow`, `sk-code-opencode`, `sk-code-obsidian`) carry the implement → debug → verify workflow doctrine the acting agent applies to fix accepted findings. `sk-code-quality` owns author-side gates. The `sk-code-review` mode consumes surface evidence")
edit(None, README,
     "| Playbook structure | `python3 .skilled/skills/sk-doc/scripts/validate_document.py .skilled/skills/sk-code/sk-code-review/manual-testing-playbook/manual-testing-playbook.md` |",
     "| Playbook structure | `python3 .skilled/skills/sk-doc/scripts/validate_document.py --type playbook .skilled/skills/sk-code/sk-code-review/manual-testing-playbook/manual-testing-playbook.md` reports zero issues under the playbook rule set |")
edit(None, README,
     "| Behavior | Run the playbook scenarios under `manual-testing-playbook/<NN>--<topic>/` in a live session |",
     "| Behavior | Run the playbook scenarios under `manual-testing-playbook/<topic>/<scenario>.md` (bare descriptive slugs, no numeric prefix) in a live session |")

# ---- references and assets ------------------------------------------------
edit(None, CORE,
     "Shared doctrine consumed by both `@review` and `@deep-review`.",
     "Shared doctrine consumed by both `@review` and `@deep-review`.\n\n"
     "**Ownership.** This file owns the severity ids and their meanings (section 2), the evidence rules (section 3) and the finding schema (section 7). "
     "The deep-review contract, [`review-mode-contract.yaml`](../../../system-deep-loop/deep-review/assets/review-mode-contract.yaml), is an external consumer: "
     "it owns the deep-review loop (dimensions, verdicts, severity weights, convergence and quality gates) and reuses the severity ids defined here. "
     "When the two disagree on a severity id or its meaning, this file wins and the YAML is corrected by its owner, `deep-review`. "
     "The YAML may be stricter for its own loop, as when it requires `file:line` evidence on `P2`, but never looser.")
edit(None, CORE,
     "- Detected code surface -> `sk-code:code-webflow` or `sk-code:code-opencode`; unsupported or unclear surfaces -> `sk-code:unknown`",
     "- Detected code surface -> `OPENCODE`, `OBSIDIAN` or `WEBFLOW`, each paired with its `sk-code` evidence packet (`sk-code-opencode`, `sk-code-obsidian`, `sk-code-webflow`); unsupported or unclear surfaces -> `UNKNOWN`. Detection follows the shared contract, [`stack-detection.md`](../../shared/references/stack-detection.md) section 2.")
edit(None, QUICK,
     "- [review-mode-contract.yaml](../../../system-deep-loop/deep-review/assets/review-mode-contract.yaml) - Canonical review-mode contract manifest (source of truth for deep review taxonomy)",
     "- [review-mode-contract.yaml](../../../system-deep-loop/deep-review/assets/review-mode-contract.yaml) - Deep-review contract manifest. It owns the deep-review loop and consumes the severity ids that [review-core.md](./review-core.md) owns. review-core.md wins when the two disagree on a severity id or its meaning")
edit(None, UX,
     "- Findings + gate recommendation: include `APPROVE`, `REQUEST_CHANGES`, or `COMMENT` after the findings.",
     "- Findings + gate recommendation: include `APPROVED`, `REQUESTED_CHANGES` or `COMMENTED` after the findings, the same tokens the final `Review status:` line uses.")
edit(None, DEDUP,
     "**Path:** `.skilled/.code-review-cache/<repo-ref>.jsonl`",
     f"**Path:** `{CACHE_PATH}`\n\nThe cache lives in the reviewing user's cache directory, outside every reviewed repository. Its one side effect is this file. The gate never creates a file or folder in the repository it reviews.")
edit(None, DEDUP,
     "- `.opencode/` is gitignored by convention in OpenCode projects",
     "- The user cache directory sits outside every reviewed repository, so reviewing a foreign repository leaves no folder in it, and deleting the cache folder resets the gate")
edit(None, REMOVAL,
     "- **P2**: Defer with migration plan and owner.",
     "- **P2**: Defer with migration plan and owner.\n\n"
     "These labels rank removal urgency only. They are not the finding severities of [`review-core.md`](../references/review-core.md) section 2: a removal item keeps its finding's own severity, and a report that carries both writes the urgency as `removal P0`, `removal P1` or `removal P2`.")
edit(None, PLAYBOOK,
     "| Scenario ID | Yes | One of CR-001..CR-024 or CR-R01..CR-R07 |",
     "| Scenario ID | Yes | One of CR-001..CR-018, CR-020..CR-024 or CR-R01..CR-R07 (CR-019 is not assigned) |")

# ---- checkers --------------------------------------------------------------
edit(None, FINDINGS,
     "const NUMBERED_FINDING = /^(\\d+)\\. \\S/;\nconst CASE_LINE = /^\\s+- Case: \\S/;",
     "// Two documented shapes: the SKILL.md template numbers list items, and the\n"
     "// review-core.md schema puts the number in a level-three heading.\n"
     "const NUMBERED_FINDING = /^(\\d+)\\. \\S/;\n"
     "const HEADING_FINDING = /^### (\\d+) \\[P[0-2]\\] \\S/;\n"
     "const CASE_LINE = /^\\s*- Case: \\S/;")
edit(None, FINDINGS,
     "    const numbered = NUMBERED_FINDING.exec(line);",
     "    const numbered = NUMBERED_FINDING.exec(line) || HEADING_FINDING.exec(line);")
edit(None, FINAL,
     "    if (precedingIndex < 0 || !/^Not checked: \\S/.test(lines[precedingIndex])) {",
     "    // Only the status line is machine-parsed, so extra spaces after the colon are accepted.\n"
     "    if (precedingIndex < 0 || !/^Not checked: +\\S/.test(lines[precedingIndex])) {")

# ---- canary ----------------------------------------------------------------
edit(None, CANARY,
     "// It checks that documented example outputs end on the exact status line, because string presence cannot prove a line is last.",
     "// It checks that documented example outputs end on the exact status line, because string presence cannot prove a line is last.\n"
     "// It pins the assessment tokens to the status-line vocabulary and the pointer to the shared detection contract, so neither can drift back.")
edit(None, CANARY,
     "      'Review status: COMMENTED',\n    ],\n  },\n  {\n    file: '.skilled/skills/sk-code/sk-code-review/README.md',",
     "      'Review status: COMMENTED',\n      '**Overall assessment**: [APPROVED / REQUESTED_CHANGES / COMMENTED]',\n      '../shared/references/stack-detection.md',\n    ],\n  },\n  {\n    file: '.skilled/skills/sk-code/sk-code-review/README.md',")
edit(None, CANARY,
     "    file: '.skilled/skills/sk-code/sk-code-review/references/pr-state-dedup.md',\n    strings: ['Review status: COMMENTED'],\n  },",
     "    file: '.skilled/skills/sk-code/sk-code-review/references/pr-state-dedup.md',\n    strings: ['Review status: COMMENTED'],\n  },\n  {\n    file: '.skilled/skills/sk-code/sk-code-review/references/review-ux-single-pass.md',\n    strings: ['`APPROVED`, `REQUESTED_CHANGES` or `COMMENTED`'],\n  },")

# ---- harness ---------------------------------------------------------------
edit(None, HARNESS,
     '  ".skilled/skills/sk-code/sk-code-review/references/pr-state-dedup.md"\n',
     '  ".skilled/skills/sk-code/sk-code-review/references/pr-state-dedup.md"\n  ".skilled/skills/sk-code/sk-code-review/references/review-ux-single-pass.md"\n')
ANCHOR = "# Seeded examples ensure the canary rejects content after status and missing context.\n"
edit(None, HARNESS, ANCHOR,
     "FINAL_LINE_NOT_CHECKED_SPACES=\"$TMP_DIR/final_line_not_checked_two_spaces.md\"\n"
     "printf 'Findings\\n\\nNot checked:  two spaces after the colon\\n\\nReview status: APPROVED\\n' > \"$FINAL_LINE_NOT_CHECKED_SPACES\"\n"
     "run_case 0 \"final_line_not_checked_two_spaces\" node \"$FINAL_LINE_CHECKER\" \"$FINAL_LINE_NOT_CHECKED_SPACES\"\n\n" + ANCHOR)
edit(None, HARNESS, ANCHOR,
     "# Both documented finding shapes run through both checkers, so neither shape can pass unchecked.\n"
     "SHAPE_DIR=\"$SCRIPT_DIR/review-output-fixture\"\n"
     "for shape in list-shape-valid heading-shape-valid heading-shape-missing-case heading-shape-restart; do\n"
     "  run_case 0 \"shape_final_line_$shape\" node \"$FINAL_LINE_CHECKER\" \"$SHAPE_DIR/$shape.md\"\n"
     "done\n"
     "run_case 0 \"shape_findings_list_valid\" node \"$FINDINGS_CHECKER\" \"$SHAPE_DIR/list-shape-valid.md\"\n"
     "run_case 0 \"shape_findings_heading_valid\" node \"$FINDINGS_CHECKER\" \"$SHAPE_DIR/heading-shape-valid.md\"\n"
     "expect_output 'OK: findings are numbered once and each carries a Case line' \"shape_findings_heading_valid_output\" node \"$FINDINGS_CHECKER\" \"$SHAPE_DIR/heading-shape-valid.md\"\n"
     "run_case 1 \"shape_findings_heading_missing_case\" node \"$FINDINGS_CHECKER\" \"$SHAPE_DIR/heading-shape-missing-case.md\"\n"
     "expect_output 'finding 2 has no Case: line' \"shape_findings_heading_missing_case_output\" node \"$FINDINGS_CHECKER\" \"$SHAPE_DIR/heading-shape-missing-case.md\"\n"
     "run_case 1 \"shape_findings_heading_restart\" node \"$FINDINGS_CHECKER\" \"$SHAPE_DIR/heading-shape-restart.md\"\n"
     "expect_output 'finding numbers restart or skip: expected 2, found 1' \"shape_findings_heading_restart_output\" node \"$FINDINGS_CHECKER\" \"$SHAPE_DIR/heading-shape-restart.md\"\n\n" + ANCHOR)
edit(None, HARNESS, ANCHOR,
     "# FAIL: the gate-recommendation tokens in the single-pass reference drift from the status-line vocabulary.\n"
     "CASE_UX_VOCABULARY=\"$TMP_DIR/ux_vocabulary\"\n"
     "seed_tree \"$CASE_UX_VOCABULARY\"\n"
     "node -e 'const fs=require(\"fs\");const f=process.argv[1];fs.writeFileSync(f, fs.readFileSync(f,\"utf8\").replace(\"`REQUESTED_CHANGES`\",\"`REQUEST_CHANGES`\"));' \\\n"
     "  \"$CASE_UX_VOCABULARY/.skilled/skills/sk-code/sk-code-review/references/review-ux-single-pass.md\"\n"
     "run_case 1 \"ux_vocabulary_drift\" node \"$CHECKER\" --root \"$CASE_UX_VOCABULARY\"\n"
     "expect_output 'review-ux-single-pass.md: missing exact invariant string' \"ux_vocabulary_drift_output\" node \"$CHECKER\" --root \"$CASE_UX_VOCABULARY\"\n\n" + ANCHOR)

# ---- fixture files ---------------------------------------------------------
for i, shape in enumerate(["list-shape-valid", "heading-shape-valid", "heading-shape-missing-case", "heading-shape-restart"]):
    create(None, f"{FIXTURE}/{shape}.md", f"{SPEC_SCRATCH}/units/{shape}.md")

# ---- scripts README --------------------------------------------------------
edit(None, SCRIPTS_README,
     "`scripts/` holds the `code-review` skill's rule-copy canary.",
     "`scripts/` holds the `sk-code-review` mode's rule-copy canary.")
edit(None, SCRIPTS_README,
     "the line above that blank line must start with `Not checked:` followed by text.",
     "the line above that blank line must start with `Not checked:`, then one or more spaces, then text.")
edit(None, SCRIPTS_README,
     "| `check-review-findings.js` | Checks each numbered finding under `## Findings` in a review output. Fails when",
     "| `check-review-findings.js` | Checks each numbered finding under `## Findings` in a review output, in both documented shapes: a numbered list item (`1. path:line Title`, the SKILL.md template) and a level-three heading (`### 2 [P1] Title`, the `review-core.md` schema). Fails when")
edit(None, SCRIPTS_README,
     "appear verbatim in `sk-code-review/SKILL.md` and `sk-code-review/README.md`,",
     "appear verbatim in `sk-code-review/SKILL.md` and `sk-code-review/README.md`, that SKILL.md keeps the `APPROVED / REQUESTED_CHANGES / COMMENTED` assessment tokens and its pointer to `../shared/references/stack-detection.md`, that `review-ux-single-pass.md` names the same three tokens,")
edit(None, SCRIPTS_README,
     "and the four findings-checker cases |",
     "the four findings-checker cases, a `Not checked:` line with two spaces after the colon (expects pass), both finding shapes in `review-output-fixture/` through both checkers, and a drifted gate-recommendation token in `review-ux-single-pass.md` |\n"
     "| `review-output-fixture/` | Four complete review outputs that `check-rule-copies.test.sh` runs: `list-shape-valid.md` and `heading-shape-valid.md` pass both checkers, while `heading-shape-missing-case.md` and `heading-shape-restart.md` pass the final-line checker and fail the findings checker |")
edit(None, SCRIPTS_README,
     "Expected: `OK: all rule invariants present (5 exact-string file(s)",
     "Expected: `OK: all rule invariants present (6 exact-string file(s)")

edit(None, SCRIPTS_README,
     "- [`code-review SKILL.md`](../SKILL.md)",
     "- [`sk-code-review SKILL.md`](../SKILL.md)")
edit(None, SCRIPTS_README,
     "- [`code-review README.md`](../README.md)",
     "- [`sk-code-review README.md`](../README.md)")

# ---- changelog -------------------------------------------------------------
create(None, CHANGELOG, f"{SPEC_SCRATCH}/units/changelog-v1.7.0.0.md")

CHECKS_BY_OLD = {
    DETECTOR_OLD: ("python3 -I " + SPEC_SCRATCH + "/detect-probe.py", "generic-node-src: UNKNOWN"),
}


def check_for(unit):
    if unit.get("old") in CHECKS_BY_OLD:
        return CHECKS_BY_OLD[unit["old"]]
    if unit["kind"] == "create":
        return (f"cmp {unit['source']} {unit['file']}; echo exit=$?", "exit=0")
    # Prove the edit landed: the longest line of the new text that is not in the old text.
    old_lines = set(unit["old"].split("\n"))
    fresh = [line for line in unit["new"].split("\n") if line.strip() and line not in old_lines]
    probe = max(fresh, key=len) if fresh else unit["new"].split("\n")[0]
    if "](" in probe:
        # A quoted Markdown link reads as a live link to the spec validators, so probe a link-free piece.
        probe = max(re.split(r"\[|\]\(|\)", probe), key=len)
    return (f"grep -cF -- {shell_quote(probe)} {unit['file']}", "1" if count_in_new_file(unit, probe) == 1 else str(count_in_new_file(unit, probe)))


def shell_quote(text):
    return "'" + text.replace("'", "'\\''") + "'"


SIM_LINES = {}


def count_in_new_file(unit, probe):
    final = SIM_LINES.get(unit["file"], "")
    return sum(1 for line in final.split("\n") if probe in line)


def instruction(unit):
    if unit["kind"] == "create":
        return f"Create {unit['file']} with exactly the content of {unit['source']}"
    return f"In {unit['file']}, replace the exact text <<<OLD\n{unit['old']}\nOLD>>> with <<<NEW\n{unit['new']}\nNEW>>>"


def main():
    root = Path.cwd()
    problems = []
    current = {}
    for unit in UNITS:
        if unit["kind"] != "edit":
            continue
        text = current.setdefault(unit["file"], (root / unit["file"]).read_text(encoding="utf-8"))
        count = text.count(unit["old"])
        if count != 1:
            problems.append(f"{unit['task']} {unit['file']}: OLD occurs {count} times")
            continue
        current[unit["file"]] = text.replace(unit["old"], unit["new"], 1)
    for unit in UNITS:
        if unit["kind"] == "create":
            current[unit["file"]] = (root / unit["source"]).read_text(encoding="utf-8")
    SIM_LINES.update(current)

    if "--simulate" in sys.argv:
        dest = Path(sys.argv[sys.argv.index("--simulate") + 1])
        for rel, text in current.items():
            target = dest / rel
            target.parent.mkdir(parents=True, exist_ok=True)
            target.write_text(text, encoding="utf-8")

    out = []
    for unit in UNITS:
        command, expect = check_for(unit)
        out.append({
            "task": unit["task"],
            "files": [unit["file"]],
            "kind": unit["kind"],
            "instruction": instruction(unit),
            "check": command,
            "expect": expect,
        })
    (HERE / "dispatch-units.json").write_text(json.dumps(out, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    for problem in problems:
        print("PROBLEM:", problem)
    print(f"units={len(out)} edits={sum(1 for u in UNITS if u['kind'] == 'edit')} creates={sum(1 for u in UNITS if u['kind'] == 'create')} problems={len(problems)}")
    sys.exit(1 if problems else 0)


if __name__ == "__main__":
    main()
