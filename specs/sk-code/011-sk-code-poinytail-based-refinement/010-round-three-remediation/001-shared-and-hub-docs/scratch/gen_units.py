#!/usr/bin/env python3
"""Build the ordered dispatch units for this plan and prove every OLD text is unique.

Run from the repository root: python3 -I <folder>/scratch/gen_units.py
Writes <folder>/scratch/dispatch-units.json, <folder>/scratch/units/*.txt and
<folder>/scratch/phase2-tasks.md, and prints one UNIQUE or FAIL line per edit unit.
"""
import json
import pathlib
import sys

FOLDER = "specs/sk-code/011-sk-code-poinytail-based-refinement/010-round-three-remediation/001-shared-and-hub-docs"
ROOT = pathlib.Path.cwd()
SCRATCH = ROOT / FOLDER / "scratch"
UNITS_DIR = SCRATCH / "units"
H = ".skilled/skills/sk-code"
FIRST_TASK = 14

def lines(path, start, end):
    """Exact text of lines start..end (1-based, inclusive) with their newlines."""
    text = (ROOT / path).read_text(encoding="utf-8").splitlines(keepends=True)
    return "".join(text[start - 1:end])

units = []

def edit(path, old, new, title):
    units.append({"kind": "edit", "file": path, "old": old, "new": new, "title": title})

def delete(path, title):
    units.append({"kind": "delete", "file": path, "title": title})

def create(path, content, title):
    units.append({"kind": "create", "file": path, "content": content, "title": title})

def command(paths, cmd, check, expect, title):
    units.append({"kind": "command", "files": paths, "cmd": cmd, "check": check, "expect": expect, "title": title})

R = f"{H}/ROUTER.md"
S = f"{H}/SKILL.md"
SR = f"{H}/shared/README.md"
PD = f"{H}/shared/references/phase-detection.md"
SD = f"{H}/shared/references/stack-detection.md"
WV = f"{H}/shared/references/workflow-verify.md"
WI = f"{H}/shared/references/workflow-implement.md"
WD = f"{H}/shared/references/workflow-debug.md"
UV = f"{H}/shared/references/universal-verification-checklist.md"
UD = f"{H}/shared/references/universal-debugging-checklist.md"
CQ = f"{H}/shared/references/universal/code-quality-standards.md"
CS = f"{H}/shared/references/universal/code-style-guide.md"
ER = f"{H}/shared/references/universal/error-recovery.md"
MA = f"{H}/shared/references/universal/multi-agent-research.md"
RM = f"{H}/README.md"
DJ = f"{H}/description.json"
HR = f"{H}/hub-router.json"
MR = f"{H}/mode-registry.json"
FC = f"{H}/feature-catalog/feature-catalog.md"
TA = f"{H}/feature-catalog/two-axis-registry-driven-routing/two-axis-registry-driven-routing.md"
CL = f"{H}/changelog/v2.2.5.0.md"
WF = f"{H}/sk-code-webflow/assets/patterns"

# --- Duplicated pattern assets: drop the shared route, then the shared copies.
edit(R, '        "shared/assets/patterns/README.md",\n        "sk-code-webflow/assets/integrations/README.md",\n',
     '        "sk-code-webflow/assets/integrations/README.md",\n',
     "Drop the shared pattern README route from RESOURCE_MAP IMPLEMENTATION")
edit(R, lines(R, 583, 596),
     "# Hub-level shared controls, declared once here. This list holds every\n"
     "# contained shared/ path that RESOURCE_MAP references but that is exempt from\n"
     "# typed-leaf projection, because it has no single packet owner. The root-router\n"
     "# contract validates each entry and requires RESOURCE_MAP to reference it.\n"
     "# DEFAULT_RESOURCE above is the other half of the set: its always-loaded\n"
     "# preamble paths are hub-level controls too. No other shared/ path is a\n"
     "# control, so a guard that needs the control set reads these two lists.\n"
     "SHARED_CONTROL_RESOURCES = [\n"
     '    "shared/references/universal/multi-agent-research.md",\n'
     '    "shared/references/universal/code-quality-standards.md",\n'
     '    "shared/references/universal/code-style-guide.md",\n'
     '    "shared/references/universal/error-recovery.md",\n'
     '    "shared/references/universal-debugging-checklist.md",\n'
     '    "shared/references/universal-verification-checklist.md",\n'
     '    "shared/references/performance-loading-checklist.md",\n'
     "]\n",
     "Rewrite the SHARED_CONTROL_RESOURCES comment as the one declared control set and drop the shared pattern README entry")
delete(f"{H}/shared/assets/patterns/validation-patterns.js", "Delete the shared copy of validation-patterns.js")
delete(f"{H}/shared/assets/patterns/wait-patterns.js", "Delete the shared copy of wait-patterns.js")
delete(f"{H}/shared/assets/patterns/README.md", "Delete the shared pattern README")
command([f"{H}/shared/assets/patterns", f"{H}/shared/assets"],
        f"rmdir {H}/shared/assets/patterns {H}/shared/assets",
        f"test -e {H}/shared/assets; echo \"exists=$?\"", "exists=1",
        "Remove the two empty shared asset folders")

# --- Shared README: pattern assets gone, live packet keys, Obsidian.
edit(SR, "universal-standards references (plus pattern assets) consumed by every sk-code mode.",
     "universal-standards references consumed by every sk-code mode.",
     "Drop the pattern-assets clause from the shared README description")
edit(SR, "shared workflow doctrine, universal standards, and pattern assets that every sk-code mode consumes.",
     "shared workflow doctrine and universal standards that every sk-code mode consumes.",
     "Drop the pattern-assets clause from the shared README summary line")
edit(SR, "every sk-code surface packet (`code-webflow`, `code-opencode`) and workflow mode (`code-quality`, `code-review`). Surface detection resolves here first; the surface and workflow modes then load the specific references they need. For example, `code-quality` loads",
     "every sk-code surface packet (`sk-code-webflow`, `sk-code-opencode`, `sk-code-obsidian`) and workflow mode (`sk-code-quality`, `sk-code-review`). Surface detection resolves here first; the surface and workflow modes then load the specific references they need. For example, `sk-code-quality` loads",
     "Use the live packet keys and add Obsidian in the shared README overview")
edit(SR, "- `assets/patterns/`: executable pattern templates shipped with the skill.\n", "",
     "Delete the assets/patterns layout bullet from the shared README")
edit(SR, lines(SR, 70, 76),
     "## 6. PATTERN ASSETS\n\n"
     "The shared tier ships no pattern assets. The validation and wait pattern templates are owned by the Webflow packet, beside its interaction-gate and performance patterns: [`../sk-code-webflow/assets/patterns/README.md`](../sk-code-webflow/assets/patterns/README.md).\n",
     "Replace the shared README assets table with a pointer to the Webflow pattern folder")

# --- Phase lifecycle: three surfaces, real paths, the guard umbrella.
edit(PD, "Both supported surfaces follow the same lifecycle.",
     "All three surfaces in the hub `SKILL.md` surface list (WEBFLOW, OPENCODE and OBSIDIAN) follow the same lifecycle.",
     "Replace the two-surface opening sentence of phase-detection.md")
edit(PD, "- When planning work across WEBFLOW or OPENCODE surfaces.",
     "- When planning work on the WEBFLOW, OPENCODE or OBSIDIAN surface.",
     "Name all three surfaces in the phase-detection When to Use list")
edit(PD, "`references/webflow/implementation/*`, Webflow patterns/assets; add `references/motion_dev/` when",
     "`.skilled/skills/sk-code/sk-code-webflow/references/implementation/`, Webflow patterns/assets; add `.skilled/skills/sk-code/sk-code-webflow/references/animation/` when",
     "Repoint the WEBFLOW implementation row of phase-detection.md")
edit(PD, "| Implementation | `references/opencode/shared/*` plus detected language references |",
     "| Implementation | `.skilled/skills/sk-code/sk-code-opencode/references/shared/` plus detected language references |",
     "Repoint the OPENCODE implementation row of phase-detection.md")
edit(PD, "| Verification | `verify_alignment_drift.py --root <changed-scope>` plus targeted tests/spec validation |",
     "| Verification | `bash .skilled/skills/sk-code/sk-code-opencode/scripts/run-all-drift-guards.sh`, the three-guard umbrella, plus targeted tests/spec validation |",
     "Name the three-guard umbrella in the OPENCODE verification row")
edit(PD, "`motion_dev/` can be loaded during research",
     "The Motion.dev overlay (`.skilled/skills/sk-code/sk-code-webflow/references/animation/`) can be loaded during research",
     "Repoint the Motion.dev overlay sentence of phase-detection.md")
edit(PD, "## 7. RELATED RESOURCES", "## 8. RELATED RESOURCES", "Renumber phase-detection section 7 to 8")
edit(PD, "## 6. TRANSITIONS", "## 7. TRANSITIONS", "Renumber phase-detection section 6 to 7")
edit(PD, "## 5. IRON LAWS",
     "## 5. OBSIDIAN PHASES\n\n"
     "| Phase | Resources / Evidence |\n"
     "| --- | --- |\n"
     "| Research | The read-only `sk-code-obsidian` evidence packet: plugin API, data layer and view-renderer references |\n"
     "| Implementation | `.skilled/skills/sk-code/sk-code-obsidian/references/standards/code-standards.md` plus the class-naming and stylesheet-ownership references |\n"
     "| Code Quality | `.skilled/skills/sk-code/sk-code-obsidian/references/standards/code-standards.md` and the recorded lint baseline |\n"
     "| Debugging | Failing vitest or build output, screenshot diffs and root-cause analysis |\n"
     "| Verification | The gate command set in `.skilled/skills/sk-code/sk-code-obsidian/references/verification.md`, run in the plugin repository |\n\n"
     "The Obsidian surface is read-only evidence. The bundled workflow mode runs these phases, and the gate commands run in the plugin repository, not in this hub.\n\n"
     "---\n\n"
     "## 6. IRON LAWS",
     "Insert the OBSIDIAN PHASES section and renumber IRON LAWS to 6")

# --- Stack detection: real Motion paths, the collision row, one link form.
edit(SD, "`motion_dev/` is a peer resource category rather than a surface.",
     "Motion.dev (`.skilled/skills/sk-code/sk-code-webflow/references/animation/`) is a peer resource category rather than a surface.",
     "Repoint the Motion.dev peer-category sentence of stack-detection.md")
edit(SD, "`references/motion_dev/*` exact files only; no `references/webflow/*`",
     "exact files under `.skilled/skills/sk-code/sk-code-webflow/references/animation/` only; nothing else under `.skilled/skills/sk-code/sk-code-webflow/`",
     "Repoint the CS-002 non-Webflow row of stack-detection.md")
edit(SD, "`references/motion_dev/quick-start.md`, `references/motion_dev/scroll-and-gestures.md`, exact snippet assets",
     "`.skilled/skills/sk-code/sk-code-webflow/references/animation/quick-start.md`, `.skilled/skills/sk-code/sk-code-webflow/references/animation/scroll-and-gestures.md`, exact snippet assets",
     "Repoint the CS-002 stack-agnostic row of stack-detection.md")
edit(SD, "| Changed `apps/desktop/src/styles/app.css` AND changed `.opencode/agents/code.md` | **OPENCODE** | `.opencode/` target wins when a task also touches a path outside the hub |\n",
     "| Changed `apps/desktop/src/styles/app.css` AND changed `.opencode/agents/code.md` | **OPENCODE** | `.opencode/` target wins when a task also touches a path outside the hub |\n"
     "| Obsidian plugin repo-root markers (`manifest.json` with `minAppVersion`, `esbuild.config.mjs`) AND a Webflow library marker (`new Lenis`, `window.gsap`) in the same tree, no `.skilled/` target | **OBSIDIAN** | Precedence OPENCODE > OBSIDIAN > WEBFLOW: the OBSIDIAN branch returns early, so the Webflow marker never overwrites it |\n",
     "Add the OBSIDIAN-versus-WEBFLOW collision row to stack-detection.md section 4")
edit(SD, "- `references/phase-detection.md`", "- [`./phase-detection.md`](./phase-detection.md)",
     "Use the relative link form for phase-detection.md in stack-detection.md")

# --- workflow-verify: the validate.sh contract has one owner, plus repo-rule pointers.
edit(WV, lines(WV, 86, 86),
     "The exit-code and warning contract of `validate.sh` is owned by `.skilled/skills/system-spec-kit/references/validation/validation-rules.md` (section 1 for the exit taxonomy, section 14 for the ways a run misleads). Read it there, not from a copy here. The one fact this workflow needs: a completion claim requires the explicit `RESULT: PASSED` line, because a warning never changes the exit code and exit status alone has misled in both directions.\n",
     "Replace the copied validate.sh contract in workflow-verify.md with a pointer to its owner")
edit(WV, "No baseline means no broad no-regressions claim. A narrower claim tied to fresh evidence is still allowed.",
     "No baseline means no broad no-regressions claim. A narrower claim tied to fresh evidence is still allowed.\n\n"
     "The baseline floor is owned by `.skilled/repo-rules/evidence-and-proof.md` section 5 (BASELINES). This table is the sk-code record shape for it.",
     "Point the baseline floor in workflow-verify.md to its repo rule")
edit(WV, "If a test stays green after the guarded behavior is broken, report it as a verification defect and hand back.",
     "If a test stays green after the guarded behavior is broken, report it as a verification defect and hand back. The negative-control floor is owned by `.skilled/repo-rules/evidence-and-proof.md` section 4 (THE NEGATIVE CONTROL).",
     "Point the negative-control floor in workflow-verify.md to its repo rule")
edit(WI, "If requested scope looks unnecessary or risky, implement the requirement and raise a scope-amendment recommendation; do not silently cut scope.",
     "If requested scope looks unnecessary or risky, implement the requirement and raise a scope-amendment recommendation; do not silently cut scope. The restraint floor is owned by `.skilled/repo-rules/prevent-overengineering.md` (sections 1 and 2) and the Restraint Signals table in `AGENTS.md` section 3.",
     "Point the restraint floor in workflow-implement.md to its repo rule")
edit(WD, "9. Hand the fixed state to verification with the reproduction command, before/after result, and residual risk.",
     "9. Hand the fixed state to verification with the reproduction command, before/after result, and residual risk.\n\n"
     "The reproduce, trace-to-source and one-cause-at-a-time floors in this loop are owned by `.skilled/repo-rules/root-cause-and-debugging.md` section 1 (THE LOOP). This loop is how sk-code applies them, so a change to a floor goes there first.",
     "Point the debug-loop floors in workflow-debug.md to their repo rule")

# --- Universal verification checklist.
edit(UV, "For the full WEBFLOW matrix and Lighthouse details: `references/webflow/verification/verification_workflows.md` and `references/webflow/performance/cwv-remediation.md`.",
     "For the full WEBFLOW matrix and Lighthouse details: `.skilled/skills/sk-code/sk-code-webflow/references/verification/verification-workflows/gate-and-automated-options.md` and `.skilled/skills/sk-code/sk-code-webflow/references/performance/cwv-remediation.md`.",
     "Repoint the WEBFLOW matrix sentence of the verification checklist")
edit(UV, "- `references/phase-detection.md`", "- [`./phase-detection.md`](./phase-detection.md)",
     "Use the relative link form for phase-detection.md in the verification checklist")
edit(UV, "- `assets/universal/checklists/debugging_checklist.md`", "- [`./universal-debugging-checklist.md`](./universal-debugging-checklist.md)",
     "Repoint the debugging checklist pointer of the verification checklist")
edit(UV, "- `references/webflow/verification/verification_workflows.md`",
     "- `.skilled/skills/sk-code/sk-code-webflow/references/verification/verification-workflows/gate-and-automated-options.md`",
     "Repoint the WEBFLOW deep-dive pointer of the verification checklist")
edit(UV, "- `references/opencode/shared/alignment-verification-automation.md`",
     "- `.skilled/skills/sk-code/sk-code-opencode/references/shared/alignment-verification-automation.md`",
     "Repoint the OPENCODE alignment pointer of the verification checklist")

# --- Universal debugging checklist: one link form.
edit(UD, "- `.skilled/skills/sk-code/shared/references/phase-detection.md`", "- [`./phase-detection.md`](./phase-detection.md)",
     "Use the relative link form for phase-detection.md in the debugging checklist")
edit(UD, "- `.skilled/skills/sk-code/shared/references/universal/error-recovery.md`", "- [`./universal/error-recovery.md`](./universal/error-recovery.md)",
     "Use the relative link form for error-recovery.md in the debugging checklist")
edit(UD, "- `.skilled/skills/sk-code/shared/references/universal-verification-checklist.md`", "- [`./universal-verification-checklist.md`](./universal-verification-checklist.md)",
     "Use the relative link form for the verification checklist in the debugging checklist")

# --- Universal quality standard: real checklists, live hooks, one link form.
edit(CQ, "- Surface checklists: `assets/webflow/checklists/code-quality-checklist.md` and `assets/opencode/checklists/`.",
     "- Surface checklists: `.skilled/skills/sk-code/sk-code-quality/assets/code-quality-checklist/` (Webflow JavaScript and CSS) and `.skilled/skills/sk-code/sk-code-opencode/assets/checklists/`.",
     "Repoint the Key Sources checklist line of code-quality-standards.md")
edit(CQ, "| WEBFLOW  | `assets/webflow/checklists/code-quality-checklist.md` |",
     "| WEBFLOW  | `.skilled/skills/sk-code/sk-code-quality/assets/code-quality-checklist/` |",
     "Repoint the WEBFLOW row of the surface checklist table")
edit(CQ, "| OPENCODE | `assets/opencode/checklists/`                     |",
     "| OPENCODE | `.skilled/skills/sk-code/sk-code-opencode/assets/checklists/` |",
     "Repoint the OPENCODE row of the surface checklist table")
edit(CQ, lines(CQ, 138, 139),
     "   - **Write-time** (Claude Code only): `.skilled/hooks/post-edit-quality/claude/claude-posttooluse.cjs`, wired as the `Write|Edit` `PostToolUse` hook in `.claude/settings.json`, fires on every Write/Edit tool call and warns inline before the next AI turn\n"
     "   - **Commit-time**: `.skilled/scripts/git-hooks/pre-commit`, installed through `core.hooksPath` by `.skilled/scripts/install-git-hooks.sh`, blocks any commit with violations; bypass with `SPECKIT_SKIP_COMMENT_HYGIENE=1 git commit`. The older `.skilled/hooks/git/pre-commit` and `sk-code-quality/scripts/hooks/claude-posttooluse.sh` are direct-test helpers, not live gates\n",
     "Name the live write-time and commit-time gates in code-quality-standards.md section 7")
edit(CQ, "- `references/universal/code-style-guide.md`", "- [`./code-style-guide.md`](./code-style-guide.md)",
     "Use the relative link form for code-style-guide.md in code-quality-standards.md")
edit(CQ, "- `references/universal/error-recovery.md`", "- [`./error-recovery.md`](./error-recovery.md)",
     "Use the relative link form for error-recovery.md in code-quality-standards.md")
edit(CQ, "- `assets/universal/checklists/debugging_checklist.md`", "- [`../universal-debugging-checklist.md`](../universal-debugging-checklist.md)",
     "Repoint the debugging checklist pointer of code-quality-standards.md")
edit(CQ, "- `assets/universal/checklists/verification_checklist.md`", "- [`../universal-verification-checklist.md`](../universal-verification-checklist.md)",
     "Repoint the verification checklist pointer of code-quality-standards.md")
edit(CQ, "- `references/phase-detection.md`", "- [`../phase-detection.md`](../phase-detection.md)",
     "Use the relative link form for phase-detection.md in code-quality-standards.md")
edit(CQ, "- Surface quality checklists under `assets/webflow/checklists/` and `assets/opencode/checklists/`.",
     "- Surface quality checklists under `.skilled/skills/sk-code/sk-code-quality/assets/code-quality-checklist/` (Webflow) and `.skilled/skills/sk-code/sk-code-opencode/assets/checklists/` (OpenCode).",
     "Repoint the surface checklist pointer of code-quality-standards.md")

# --- Universal style guide: real paths, the comment-density owner, one link form.
edit(CS, "lives under `references/webflow/standards/` and `references/opencode/`.",
     "lives in each surface packet: `.skilled/skills/sk-code/sk-code-webflow/references/javascript/style-guide/` and `.skilled/skills/sk-code/sk-code-opencode/references/`.",
     "Repoint the surface convention sentence of code-style-guide.md")
edit(CS, "- Surface style guides: `references/webflow/javascript/style-guide.md` and `references/opencode/{javascript,typescript,python,shell,config}/`.",
     "- Surface style guides: `.skilled/skills/sk-code/sk-code-webflow/references/javascript/style-guide/` and the language folders under `.skilled/skills/sk-code/sk-code-opencode/references/`.",
     "Repoint the Key Sources style guide line of code-style-guide.md")
edit(CS, "### Never comment what the code does",
     "### Comment density\n\n"
     "This guide owns the comment-density rule. A comment earns its place by naming a hidden constraint, an invariant, a workaround's cause or a surprise, never by filling a quota, so no universal count applies. Each surface may set its own numeric budget as that surface's setting, and a surface budget never removes a comment this section requires. The Webflow surface sets five comments per ten lines in `.skilled/skills/sk-code/sk-code-webflow/references/shared/cross-language-rules.md`, and the OpenCode surface sets three per ten lines in `.skilled/skills/sk-code/sk-code-opencode/references/shared/universal-patterns/naming-and-commenting.md`.\n\n"
     "### Never comment what the code does",
     "Add the comment-density owner subsection to code-style-guide.md section 4")
edit(CS, "`references/webflow/javascript/style-guide.md` (snake_case",
     "`.skilled/skills/sk-code/sk-code-webflow/references/javascript/style-guide/` (snake_case",
     "Repoint the WEBFLOW row of the surface pointer table")
edit(CS, "`references/opencode/` language standards and `assets/opencode/checklists/`",
     "`.skilled/skills/sk-code/sk-code-opencode/references/` language standards and `.skilled/skills/sk-code/sk-code-opencode/assets/checklists/`",
     "Repoint the OPENCODE row of the surface pointer table")
edit(CS, "- `references/universal/code-quality-standards.md`", "- [`./code-quality-standards.md`](./code-quality-standards.md)",
     "Use the relative link form for code-quality-standards.md in code-style-guide.md")
edit(CS, "- `references/universal/error-recovery.md`", "- [`./error-recovery.md`](./error-recovery.md)",
     "Use the relative link form for error-recovery.md in code-style-guide.md")
edit(CS, "- Surface standards under `references/webflow/standards/` and `references/opencode/`.",
     "- Surface standards under `.skilled/skills/sk-code/sk-code-webflow/references/` and `.skilled/skills/sk-code/sk-code-opencode/references/`.",
     "Repoint the surface standards pointer of code-style-guide.md")
edit(CS, "- `assets/webflow/checklists/` and `assets/opencode/checklists/` - the surface",
     "- `.skilled/skills/sk-code/sk-code-quality/assets/code-quality-checklist/` and `.skilled/skills/sk-code/sk-code-opencode/assets/checklists/` - the surface",
     "Repoint the surface checklist pointer of code-style-guide.md")

# --- Error recovery: one link form, real debugging folders.
edit(ER, "`.skilled/skills/sk-code/shared/references/universal-debugging-checklist.md` (4-phase workflow)",
     "[`../universal-debugging-checklist.md`](../universal-debugging-checklist.md) (4-phase workflow)",
     "Use the relative link form in the error-recovery.md key sources")
edit(ER, "- `.skilled/skills/sk-code/shared/references/universal-debugging-checklist.md`", "- [`../universal-debugging-checklist.md`](../universal-debugging-checklist.md)",
     "Use the relative link form for the debugging checklist in error-recovery.md")
edit(ER, "- `.skilled/skills/sk-code/shared/references/universal-verification-checklist.md`", "- [`../universal-verification-checklist.md`](../universal-verification-checklist.md)",
     "Use the relative link form for the verification checklist in error-recovery.md")
edit(ER, "- `.skilled/skills/sk-code/shared/references/universal/code-quality-standards.md`", "- [`./code-quality-standards.md`](./code-quality-standards.md)",
     "Use the relative link form for code-quality-standards.md in error-recovery.md")
edit(ER, "- `.skilled/skills/sk-code/shared/references/phase-detection.md`", "- [`../phase-detection.md`](../phase-detection.md)",
     "Use the relative link form for phase-detection.md in error-recovery.md")
edit(ER, "- Surface-specific debugging refs under `references/webflow/` and `references/opencode/`.",
     "- Surface-specific debugging refs under `.skilled/skills/sk-code/sk-code-webflow/references/debugging/` and `.skilled/skills/sk-code/sk-code-opencode/references/shared/`.",
     "Repoint the surface debugging pointer of error-recovery.md")

# --- Multi-agent research.
edit(MA, "`references/phase-detection.md`.", "[`../phase-detection.md`](../phase-detection.md).",
     "Use the relative link form in the multi-agent-research.md key sources")
edit(MA, "- Surface performance refs under `references/webflow/performance/` (when available); OPENCODE performance work uses targeted language/runtime evidence from `references/opencode/`.",
     "- Surface performance refs under `.skilled/skills/sk-code/sk-code-webflow/references/performance/`. OPENCODE performance work uses targeted language and runtime evidence from `.skilled/skills/sk-code/sk-code-opencode/references/`.",
     "Repoint the surface performance pointer of multi-agent-research.md")
edit(MA, "- `references/phase-detection.md`", "- [`../phase-detection.md`](../phase-detection.md)",
     "Use the relative link form for phase-detection.md in the multi-agent-research.md related list")
edit(MA, "- `references/universal/code-quality-standards.md`", "- [`./code-quality-standards.md`](./code-quality-standards.md)",
     "Use the relative link form for code-quality-standards.md in multi-agent-research.md")
edit(MA, "- `references/universal/error-recovery.md`", "- [`./error-recovery.md`](./error-recovery.md)",
     "Use the relative link form for error-recovery.md in multi-agent-research.md")
edit(MA, "- `references/webflow/performance/cwv-remediation.md` and `references/webflow/performance/resource-loading.md`",
     "- `.skilled/skills/sk-code/sk-code-webflow/references/performance/cwv-remediation.md` and `.skilled/skills/sk-code/sk-code-webflow/references/performance/resource-loading.md`",
     "Repoint the Webflow performance pointer of multi-agent-research.md")

# --- ROUTER.md prose: load tiers match the map, no two-surface wording.
edit(R, "ten hub-shared paths normalized to shared/..., eight mapped shared controls declared).",
     "ten hub-shared paths normalized to shared/..., mapped shared controls declared).",
     "Drop the stale shared-control count from the ROUTER.md description")
edit(R, "Beyond the two code surfaces this router maps by detection, the hub can bundle a read-only **evidence surface** alongside",
     "Beyond the Webflow and OpenCode prose maps in §4 and §6, the hub can bundle a read-only **evidence surface**, such as `sk-code-obsidian`, alongside",
     "Replace the two-code-surfaces sentence in ROUTER.md section 1")
edit(R, "| ALWAYS | Every invocation | Universal code quality + error recovery from `.skilled/skills/sk-code/shared/references/universal/` and `.skilled/skills/sk-code/shared/references/phase-detection.md` |",
     "| ALWAYS | Every invocation | The §11 `DEFAULT_RESOURCE` preamble only: `shared/references/stack-detection.md`, `shared/references/phase-detection.md` and `shared/references/universal/code-quality-standards.md`. The other universal files load with their intent: `code-style-guide.md` with CODE_QUALITY, `error-recovery.md` with DEBUGGING and `multi-agent-research.md` with IMPLEMENTATION |",
     "Make the ALWAYS load tier match DEFAULT_RESOURCE")
edit(R, "| SURFACE | After WEBFLOW/OPENCODE detection | Surface-specific shared resources (`sk-code-webflow/references/shared/*` or `sk-code-opencode/references/shared/*`) |",
     "| SURFACE | After WEBFLOW, OPENCODE or OBSIDIAN detection | Surface-specific resources (`sk-code-webflow/references/shared/*`, `sk-code-opencode/references/shared/*`, or the `sk-code-obsidian/references/*` leaves its packet router maps) |",
     "Name all three surfaces in the SURFACE load tier")
edit(R, "- the surface-agnostic `shared/references/universal/*` tier, plus",
     "- the `shared/` entries the matched intents map (for example `code-style-guide.md` under CODE_QUALITY, `error-recovery.md` under DEBUGGING and `multi-agent-research.md` under IMPLEMENTATION), never the whole `shared/references/universal/` folder, plus",
     "Make the route-time universal bullet match the map")
edit(R, "A task that genuinely spans both surfaces (mixed `.skilled/` and Webflow markers) keeps both surface slices; an `UNKNOWN` surface falls back to the preamble plus the universal tier and the Motion overlay only.",
     "A mixed-marker task (`.skilled/` and Webflow markers together) keeps the slice of each surface it touches; an `UNKNOWN` surface falls back to the preamble plus the shared-tier entries its matched intents map and the Motion overlay only.",
     "Replace the both-surfaces and universal-tier wording in the route-time paragraph")
edit(R, "- A task that genuinely spans both surfaces (mixed markers) keeps both surface slices; a single-surface task never pulls the other surface's resources.",
     "- A mixed-marker task keeps the slice of each surface it touches; a single-surface task never pulls another surface's resources.",
     "Replace the both-surfaces wording in ROUTER.md section 12")
edit(R, "- No keyword match, or an `UNKNOWN` surface, falls back to the preamble plus the universal tier and the Motion overlay only",
     "- No keyword match, or an `UNKNOWN` surface, falls back to the preamble plus the shared-tier entries its matched intents map and the Motion overlay only",
     "Make the UNKNOWN fallback bullet in ROUTER.md section 12 match the map")
edit(R, "version: 2.2.4.0\nrouter_state: active", "version: 2.2.5.0\nrouter_state: active",
     "Bump the ROUTER.md version to 2.2.5.0")

# --- Hub SKILL.md: surface list sentence, shared-control pointer, layout, version.
edit(S, "(`shared/references/workflow_*.md`, symlinked in)", "(`shared/references/workflow-*.md`, symlinked in)",
     "Fix the workflow doctrine glob in the hub SKILL.md intro")
edit(S, "`description.json`, `mode-registry.json`, `hub-router.json`, and `ROUTER.md` carry the same value, so every hub-root artifact states the same release.",
     "`description.json`, `mode-registry.json`, `hub-router.json`, `ROUTER.md` and `README.md` carry the same value, so every hub-root artifact states the same release. These hub-root files take the release version rather than the derived child-doc version the frontmatter-versioning standard gives other docs.",
     "Add README.md to the hub version authority sentence")
edit(S, "| **sk-code-obsidian** | Obsidian-plugin design-system and source-convention evidence for the Note Database plugin. Read-only. | `sk-code/sk-code-obsidian/` |\n",
     "| **sk-code-obsidian** | Obsidian-plugin design-system and source-convention evidence for the Note Database plugin. Read-only. | `sk-code/sk-code-obsidian/` |\n\n"
     "**Surface list.** The hub has exactly three surfaces, WEBFLOW (`sk-code-webflow`), OPENCODE (`sk-code-opencode`) and OBSIDIAN (`sk-code-obsidian`), and two workflow modes, quality (`sk-code-quality`) and review (`sk-code-review`). Any other sk-code doc that counts surfaces points to this sentence.\n",
     "Add the canonical surface-list sentence to the hub SKILL.md")
edit(S, "Packet-owned resources remain typed through `leaf-manifest.json`; the eight declared `SHARED_CONTROL_RESOURCES` are contained hub-level inputs that resolve on disk but never project as leaves.",
     "Packet-owned resources remain typed through `leaf-manifest.json`. The hub-level shared controls are declared once, in `ROUTER.md` §11: the `SHARED_CONTROL_RESOURCES` list plus the always-loaded `DEFAULT_RESOURCE` preamble. They resolve on disk but never project as leaves.",
     "Point the hub SKILL.md shared-control sentence to the ROUTER.md declaration")
edit(S, lines(S, 145, 157),
     "sk-code/\n"
     "  SKILL.md               # this routing hub (no per-mode code logic)\n"
     "  README.md              # human-facing front page for the hub\n"
     "  ROUTER.md              # active stage-two surface router and shared-control declaration\n"
     "  mode-registry.json     # the two-axis discriminator + advisorRouting (single source of truth)\n"
     "  hub-router.json        # lexical routing signals + surfaceBundle policy for hub-local choice\n"
     "  description.json       # hub advisor descriptor\n"
     "  graph-metadata.json    # the ONE advisor identity for the whole skill\n"
     "  leaf-manifest.json     # typed (workflowMode, leaf) pairs the router guards validate\n"
     "  changelog/             # hub release notes, one v<version>.md per hub release\n"
     "  feature-catalog/       # current-state inventory of the hub's routing capabilities\n"
     "  manual-testing-playbook/  # routing and disambiguation scenarios for the hub\n"
     "  benchmark/             # historical routing benchmark inputs and reports\n"
     "  sk-code-quality/       # quality mode packet     (workflow)\n"
     "  sk-code-review/        # review mode packet      (workflow)\n"
     "  sk-code-webflow/       # webflow surface packet  (read-only evidence; carries the workflow doctrine + Motion.dev animation overlay)\n"
     "  sk-code-opencode/      # opencode surface packet (read-only evidence; carries the workflow doctrine)\n"
     "  sk-code-obsidian/      # obsidian surface packet (read-only evidence)\n"
     "  shared/                # shared surface-detection router, cross-mode helpers, and the implement/debug/verify workflow doctrine (references/workflow-*.md)\n",
     "Add the six missing hub-root artifacts to the hub SKILL.md layout tree")
edit(S, "version: 2.2.4.0", "version: 2.2.5.0", "Bump the hub SKILL.md version to 2.2.5.0")

# --- Hub JSON files.
edit(DJ, "guidance, and OpenCode system code (JavaScript, TypeScript, Python, Shell, JSON/JSONC, MCP server code, agents, commands, skills). Smart-routing",
     "guidance, OpenCode system code (JavaScript, TypeScript, Python, Shell, JSON/JSONC, MCP server code, agents, commands, skills), and Obsidian plugin code (the Note Database plugin's design system and source conventions). Smart-routing",
     "Add the Obsidian surface to the description.json description")
edit(DJ, '"version": "2.2.4.0"', '"version": "2.2.5.0"', "Bump the description.json version to 2.2.5.0")
edit(DJ, '"lastUpdated": "2026-09-19T00:00:00Z"', '"lastUpdated": "2026-10-10T00:00:00Z"', "Refresh the description.json lastUpdated stamp")
edit(HR, '"version": "2.2.4.0"', '"version": "2.2.5.0"', "Bump the hub-router.json version to 2.2.5.0")
edit(MR, "the SURFACE axis (sk-code-webflow/sk-code-opencode) is read-only domain evidence. Implement/debug/verify phase doctrine is consolidated in shared/references/workflow_*.md",
     "the SURFACE axis (sk-code-webflow/sk-code-opencode/sk-code-obsidian) is read-only domain evidence. Implement/debug/verify phase doctrine is consolidated in shared/references/workflow-*.md",
     "Name all three surfaces and fix the doctrine glob in the mode-registry.json description")
edit(MR, "jsonl); code-review never writes tracked project files",
     "jsonl); sk-code-review never writes tracked project files",
     "Use the live mode key in the mode-registry.json review write-scope note")
edit(MR, '"version": "2.2.4.0"', '"version": "2.2.5.0"', "Bump the mode-registry.json version to 2.2.5.0")

# --- Hub README.
edit(RM, "version: 2.2.1.0", "version: 2.2.5.0", "Bring the hub README version in line with the hub release")
edit(RM, "| **Works on** | The shared surface-detection router for WEBFLOW and OPENCODE context, plus the Motion.dev animation overlay |",
     "| **Works on** | The shared surface-detection router for the three surfaces the hub `SKILL.md` lists (WEBFLOW, OPENCODE and OBSIDIAN), plus the Motion.dev animation overlay |",
     "Name all three surfaces in the hub README At a Glance row")
edit(RM, "| `sk-code-opencode` | System-code evidence: TypeScript, Python, shell and config standards, hooks, alignment verification, authoring checklists |\n",
     "| `sk-code-opencode` | System-code evidence: TypeScript, Python, shell and config standards, hooks, alignment verification, authoring checklists |\n"
     "| `sk-code-obsidian` | Obsidian-plugin design-system and source-convention evidence for the Note Database plugin |\n",
     "Add the Obsidian row to the hub README surface table")
edit(RM, "for WEBFLOW and OPENCODE work, plus the Motion.dev animation overlay.",
     "for WEBFLOW, OPENCODE and OBSIDIAN work, plus the Motion.dev animation overlay.",
     "Name all three surfaces in the hub README When To Use paragraph")
edit(RM, "| [`sk-code-opencode/SKILL.md`](./sk-code-opencode/SKILL.md) | OpenCode surface packet |",
     "| [`sk-code-opencode/SKILL.md`](./sk-code-opencode/SKILL.md) | OpenCode surface packet |\n"
     "| [`sk-code-obsidian/SKILL.md`](./sk-code-obsidian/SKILL.md) | Obsidian surface packet |",
     "Add the Obsidian packet to the hub README related documents")

# --- Feature catalog.
edit(FC, "the hub resolves a WORKFLOW mode (`quality`, `code-review`) and bundles zero-or-more read-only SURFACE evidence packets (`code-webflow`, `code-opencode`) declaratively",
     "the hub resolves a WORKFLOW mode (`sk-code-quality`, `sk-code-review`) and bundles zero-or-more read-only SURFACE evidence packets (`sk-code-webflow`, `sk-code-opencode`, `sk-code-obsidian`) declaratively",
     "Use the live keys and three surfaces in the feature catalog intro")
edit(FC, "`quality` and `code-review` are WORKFLOW modes that act; `code-webflow` and `code-opencode` are advisor-invisible SURFACE packets",
     "`sk-code-quality` and `sk-code-review` are WORKFLOW modes that act; `sk-code-webflow`, `sk-code-opencode` and `sk-code-obsidian` are advisor-invisible SURFACE packets",
     "Use the live keys and three surfaces in the feature catalog Current Reality")
edit(FC, 'last_updated: "2026-07-21"', 'last_updated: "2026-10-10"', "Refresh the feature catalog last_updated date")
edit(TA, "The WORKFLOW axis is process: `quality` (`backendKind: surface-router`) and `code-review` (`backendKind: review-cache`) are modes that act. The SURFACE axis is read-only domain evidence: `code-webflow` and `code-opencode` (both `backendKind: evidence-base`) never act",
     "The WORKFLOW axis is process: `sk-code-quality` (`backendKind: surface-router`) and `sk-code-review` (`backendKind: review-cache`) are modes that act. The SURFACE axis is read-only domain evidence: `sk-code-webflow`, `sk-code-opencode` and `sk-code-obsidian` (each `backendKind: evidence-base`) never act",
     "Use the live keys and three surfaces in the two-axis entry")
edit(TA, "`[code-review, code-webflow]`", "`[sk-code-review, sk-code-webflow]`", "Use the live keys in the two-axis bundle example")

# --- Changelog.
CHANGELOG = """---
title: "sk-code v2.2.5.0, Shared Tier Points at Real Files"
description: "The shared tier and hub docs now name three surfaces, point only at files that exist, keep one copy of each Webflow pattern asset and defer the validate.sh contract to its owner."
trigger_phrases:
  - "sk-code v2.2.5.0"
  - "sk-code 2.2.5.0"
  - "shared tier repointed"
importance_tier: "normal"
contextType: "general"
version: 2.2.5.0
---

# v2.2.5.0, Shared Tier Points at Real Files

The shared references and the hub front pages had drifted from the hub they describe. Eight shared docs pointed into folders that no longer exist, several pages still described two surfaces, and the shared tier shipped an older copy of two Webflow pattern files.

> Spec folder: `specs/sk-code/011-sk-code-poinytail-based-refinement/010-round-three-remediation/001-shared-and-hub-docs` (Level 1)

## What's New at a Glance

- **Every shared pointer resolves.** Paths into the old `references/webflow/`, `references/opencode/`, `references/motion_dev/`, `assets/webflow/` and `assets/universal/` folders now name the real packet files, and links inside the shared tier use one relative form.
- **Three surfaces everywhere.** The hub `SKILL.md` carries one surface-list sentence, and the shared README, the phase lifecycle, the hub README, the feature catalog and both descriptors now name WEBFLOW, OPENCODE and OBSIDIAN.
- **One copy of each Webflow pattern asset.** `validation-patterns.js` and `wait-patterns.js` live only in `sk-code-webflow/assets/patterns/`, and the shared copies and their route are gone.
- **The validate.sh contract has one owner.** `workflow-verify.md` points to `validation-rules.md` and keeps only the rule that a completion claim needs an explicit `RESULT: PASSED`.
- **Live gates named correctly.** The universal quality standard names `.skilled/scripts/git-hooks/pre-commit` and the post-edit Claude adapter as the live comment-hygiene gates.
- **Comment density has one owner.** The universal style guide owns the rule and lets each surface set its own budget.
- **Load tiers match the map.** `ROUTER.md` no longer claims the whole universal tier loads on every route, and its shared-control list is the one declared set.

## Upgrade

No migration required. Readers who bookmarked `shared/assets/patterns/` use `sk-code-webflow/assets/patterns/` instead.
"""
create(CL, CHANGELOG, "Create the hub changelog entry v2.2.5.0")

# --- Ripple commands the builder runs (Hermes stays with the orchestrator).
MAN = ".skilled/bin/lib/compiled-routing/013-live-activation/activation/sk-code/manifest.json"
ARC = "specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/013-live-activation/activation/sk-code/manifest.json"
command([MAN], "node .skilled/bin/compiled-route-manifest.cjs refresh --hub sk-code --skill-root .skilled/skills/sk-code",
        "node .skilled/bin/compiled-route-guard.cjs | grep 'sk-code '", "fresh",
        "Re-mint the compiled sk-code manifest after the hub SKILL.md, hub-router.json and mode-registry.json edits")
command([ARC], f"cp {MAN} {ARC}", f"cmp {MAN} {ARC}; echo \"cmp=$?\"", "cmp=0",
        "Copy the re-minted manifest over its archived copy")
command([f"{H}/leaf-manifest.json"], "node .skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs --check .skilled/skills/sk-code",
        "node .skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs --check .skilled/skills/sk-code", "leaf-manifest.json OK",
        "Confirm the leaf manifest is still fresh (check form only)")

# ---------------------------------------------------------------------------
UNITS_DIR.mkdir(parents=True, exist_ok=True)
out, task_lines, failures = [], [], 0
sim = {}
check_script = f"node {FOLDER}/scratch/check-unit.cjs"
for i, u in enumerate(units):
    tid = f"T{FIRST_TASK + i:03d}"
    if u["kind"] == "edit":
        text = sim.get(u["file"]) or (ROOT / u["file"]).read_text(encoding="utf-8")
        count = text.count(u["old"])
        sim[u["file"]] = text.replace(u["old"], u["new"], 1)
        status = "UNIQUE" if count == 1 else f"FAIL count={count}"
        if count != 1:
            failures += 1
        print(f"{status} {tid} {u['file']}")
        (UNITS_DIR / f"{tid}.old.txt").write_text(u["old"], encoding="utf-8")
        (UNITS_DIR / f"{tid}.new.txt").write_text(u["new"], encoding="utf-8")
        instr = f"In {u['file']}, replace the exact text <<<OLD\n{u['old']}\nOLD>>> with <<<NEW\n{u['new']}\nNEW>>>"
        out.append({"task": tid, "files": [u["file"]], "kind": "edit", "instruction": instr,
                    "check": f"{check_script} {tid}", "expect": f"LANDED {tid}"})
        multi = "](" in u["new"] or "\n" in u["old"].rstrip("\n") or "\n" in u["new"].rstrip("\n") or u["old"].endswith("\n") or u["new"] == ""
        if multi:
            body = (f"{u['title']}. In `{u['file']}`, replace the exact text in `{FOLDER}/scratch/units/{tid}.old.txt` "
                    f"(it occurs once) with the exact text in `{FOLDER}/scratch/units/{tid}.new.txt`; plan.md section 8 quotes both.")
        else:
            body = (f"{u['title']}. In `{u['file']}`, find `` {u['old']} `` (it occurs once) and replace it with `` {u['new']} ``.")
        task_lines.append(f"- [ ] {tid} {body} Check: `{check_script} {tid}` prints `LANDED {tid}` and exits 0. (`{u['file']}`)")
    elif u["kind"] == "delete":
        exists = (ROOT / u["file"]).exists()
        print(f"{'PRESENT' if exists else 'FAIL missing'} {tid} {u['file']}")
        if not exists:
            failures += 1
        out.append({"task": tid, "files": [u["file"]], "kind": "delete", "instruction": f"Delete the file {u['file']} with: rm {u['file']}",
                    "check": f"test -e {u['file']}; echo \"exists=$?\"", "expect": "exists=1"})
        task_lines.append(f"- [ ] {tid} {u['title']}. Run `rm {u['file']}`. Check: `test -e {u['file']}; echo \"exists=$?\"` prints `exists=1`. (`{u['file']}`)")
    elif u["kind"] == "create":
        src = UNITS_DIR / f"{tid}.create.md"
        src.write_text(u["content"], encoding="utf-8")
        exists = (ROOT / u["file"]).exists()
        print(f"{'FAIL exists' if exists else 'ABSENT'} {tid} {u['file']}")
        if exists:
            failures += 1
        out.append({"task": tid, "files": [u["file"]], "kind": "create",
                    "instruction": f"Create {u['file']} with exactly the content of {FOLDER}/scratch/units/{tid}.create.md",
                    "check": f"{check_script} {tid}", "expect": f"LANDED {tid}"})
        task_lines.append(f"- [ ] {tid} {u['title']}. Create `{u['file']}` with exactly the content of `{FOLDER}/scratch/units/{tid}.create.md` (plan.md section 8 quotes it). Then `python3 -I .skilled/skills/sk-doc/scripts/validate_document.py {u['file']}` prints `VALID` and `Total issues: 0`. Check: `{check_script} {tid}` prints `LANDED {tid}`. (`{u['file']}`)")
    else:
        out.append({"task": tid, "files": u["files"], "kind": "command", "instruction": u["cmd"],
                    "check": u["check"], "expect": u["expect"]})
        task_lines.append(f"- [ ] {tid} {u['title']}. Run `{u['cmd']}`. Check: `{u['check']}` prints `{u['expect']}`. (`{u['files'][0]}`)")

import os
if os.environ.get("SIM_OUT"):
    for f, t in sim.items():
        dst = pathlib.Path(os.environ["SIM_OUT"]) / f
        dst.parent.mkdir(parents=True, exist_ok=True)
        dst.write_text(t, encoding="utf-8")
(SCRATCH / "dispatch-units.json").write_text(json.dumps(out, indent=2) + "\n", encoding="utf-8")
(SCRATCH / "phase2-tasks.md").write_text("\n".join(task_lines) + "\n", encoding="utf-8")
print(f"units={len(out)} failures={failures} last_task=T{FIRST_TASK + len(out) - 1:03d}")
sys.exit(1 if failures else 0)
