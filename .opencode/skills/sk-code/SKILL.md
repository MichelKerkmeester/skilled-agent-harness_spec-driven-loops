---
name: sk-code
description: "Multi-stack coding standards and verification. Smart router auto-detects the active surface and loads matching code patterns."
allowed-tools: [Bash, Edit, Glob, Grep, Read, Task, Write]
version: 3.5.0.0
---

<!-- Keywords: sk-code, code workflows, smart-router, code-surface-detection, webflow, frontend, html, css, javascript, Motion.dev, motion-dev, motion_dev, cross-stack-animation, gsap, lenis, swiper, hls, filepond, opencode, system-code, mcp, typescript, python, shell, jsonc, code-quality, debugging-workflow, verification -->

# Code Workflows - Surface-Aware Smart Router

`sk-code` is the single code-work skill. It first decides which code surface is in front of it, then loads the right implementation, quality, debugging, and verification resources.

**Core principle**: `Code surface detection -> Intent classification -> Surface resources -> Verification evidence`.

---

## 1. WHEN TO USE

Use this skill when doing code work in either supported surface:

- **WEBFLOW**: Webflow / vanilla frontend work in HTML, CSS, and JavaScript, including Motion.dev runtime usage, GSAP, Lenis, HLS, Swiper, FilePond, CDN/minification, and browser verification.
- **OPENCODE**: OpenCode system work under `.opencode/`, including skills, agents, commands, MCP servers, hooks, scripts, tests, JSON/JSONC config, TypeScript, JavaScript, Python, and Shell.

Also use this skill for cross-stack Motion.dev reference work when the question is about Motion APIs, snippets, integration modes, performance pitfalls, or CSS/Motion/GSAP/WAAPI trade-offs that should live in `references/motion_dev/` or `assets/motion_dev/` rather than inside Webflow-only guidance.

Use it for implementation, code quality, debugging, verification, test failures, build failures, and before any completion claim.

Do **not** use this skill for documentation-only changes (`sk-doc`), git workflow (`sk-git`), pure browser inspection (`mcp-chrome-devtools`), or formal findings-first review output (`sk-code-review` baseline plus this skill's surface evidence).

Documentation-only edits to skill markdown route to `sk-doc`, even when the file lives under `.opencode/skills/`. Examples: updating a `SKILL.md` headline, clarifying a README paragraph, rewriting a description section, or adding a one-line summary at the top of a markdown file. Negative example: "Update the sk-code SKILL.md headline section to clarify the two-axis routing model and add a one-line summary" is `sk-doc`, not `sk-code`, because the requested change is prose-only and does not modify executable behavior or routing logic.

### Phase Overview

| Phase | Purpose | Requirement |
| --- | --- | --- |
| Phase 0: Research | Understand unfamiliar code or risky changes | Optional, but required for complex work |
| Phase 1: Implementation | Write or modify code using surface patterns | Read actual files first; apply the Design Restraint Ladder before writing new code. |
| Phase 1.5: Code Quality Gate | Apply P0/P1/P2 checks and surface standards | Required before claiming implementation done |
| Phase 2: Debugging | Trace symptom to root cause and fix one cause at a time | Required when tests/runtime fail |
| Phase 3: Verification | Run surface verification commands and record evidence | Required before any done/works claim |

**Iron Law**: no completion claim without fresh verification evidence from the detected surface.

**Baseline & blast-radius**: before Phase 1, capture the starting gate state (pass/fail counts + the names of failing tests, base commit) so Phase 3 reports the *delta*, not just a green — a green suite says nothing about a path it never ran. Open non-trivial work with a one-phrase blast-radius read ("low-blast, reversible" / "high-blast: touches auth + data") so effort matches stakes.

### Review Baseline Contract

`sk-code-review` owns findings format, severity model, and baseline security/quality/test review. `sk-code` owns surface detection and surface-specific standards evidence.

### Cross-Skill Consumption

When called from `/speckit:complete` with an `.opencode/` implementation target (`step_10_development` activity), `sk-code` surfaces the matching authoring checklist plus the `spec_folder_write` recipe AT WRITE-TIME (before the orchestrator's first write), not just at review-time.

| Target Path | Authoring Checklist Surfaced | Recipe |
|---|---|---|
| `.opencode/skills/` | `assets/opencode/checklists/skill_authoring.md` | — |
| `.opencode/agents/` | `assets/opencode/checklists/agent_authoring.md` | — |
| `.opencode/commands/` | `assets/opencode/checklists/command_authoring.md` | — |
| `.opencode/specs/` | `assets/opencode/checklists/spec_folder_authoring.md` | `assets/opencode/recipes/spec_folder_write.md` |
| MCP server source | `assets/opencode/checklists/mcp_server_authoring.md` | — |

Authoring-time load is the contract documented in `system-spec-kit/SKILL.md §16-17 cross-skill routing` and the `cross_skill_authoring_load` block in `/speckit:complete` YAMLs. Review-time `sk-code-review` baseline + `sk-code` router-selected evidence overlay remains unchanged.

---

## 2. SMART ROUTING

### Surface Detection (FIRST)

Detection is context-aware and uses CWD plus changed/target files. **Precedence**: OPENCODE target/CWD wins over WEBFLOW markers (because mixed-marker workspaces are common — `.opencode/` system tools sometimes ship frontend animation libraries internally). When neither matches, fall through to UNKNOWN.

Machine-readable stack folder contract:

```python
STACK_FOLDERS = {
    "WEBFLOW": ["src/2_javascript/", "*.webflow.js"],
    "OPENCODE": [".opencode/skills/", ".opencode/agents/", ".opencode/commands/", ".opencode/specs/"],
    "MOTION_DEV": ["references/motion_dev/", "assets/motion_dev/"],
}
```

```bash
# Use early-return precedence — never let later branches overwrite an earlier match.

# 1. OPENCODE - takes precedence: CWD or any changed/target file under .opencode/
if [[ "$PWD" == */.opencode/* ]] \
   || [[ "$TARGET_FILE" == */.opencode/* ]]; then
  SURFACE="OPENCODE"

# 2. Explicit non-Webflow guard - a prompt can ask for Motion.dev cross-stack
# guidance without making the implementation surface WEBFLOW.
elif printf '%s\n' "${PROMPT_TEXT:-}" | grep -Eiq \
     '(^|[^[:alnum:]])(not webflow|no webflow designer|without webflow|non-webflow|vanilla html/css/js only|vanilla html css js only|stack-agnostic)([^[:alnum:]]|$)'; then
  SURFACE="UNKNOWN"

# 3. WEBFLOW - frontend HTML/CSS/JS and Webflow-specific vanilla animation web
elif [[ -d "src/2_javascript" ]] \
     || ls *.webflow.js 2>/dev/null | head -1 \
     || grep -lq "Webflow\.push\|--vw-" src/**/*.{js,css,html} 2>/dev/null \
     || grep -lqE "window\.Motion|window\.gsap|gsap\.(to|from|set|timeline|registerPlugin)|new Lenis|new Hls|new Swiper|FilePond" \
        src/**/*.{js,mjs,ts,html} *.{js,mjs,ts,html} 2>/dev/null \
     || [[ -f "wrangler.toml" ]]; then
  SURFACE="WEBFLOW"

# 4. UNKNOWN - not owned by this skill; ask for runtime + verification commands
else
  SURFACE="UNKNOWN"
fi
```

**Why OPENCODE wins precedence**: `.opencode/skills/sk-doc/scripts/preview-server.js` is an OPENCODE system tool that may import vanilla animation libraries (Lenis, GSAP) for its preview UI. A first-match-WEBFLOW pseudocode would route this OPENCODE work to the wrong standards. The target/CWD path is the strongest unambiguous signal of which surface owns the work.

**Supported surfaces**:

- `WEBFLOW`: frontend HTML/CSS/JS, Webflow conventions, vanilla animation libraries, CDN/minification, and browser evidence.
- `OPENCODE`: `.opencode/` system code and config with language sub-detection.
- `UNKNOWN`: ask a short disambiguation question and do not pretend unsupported stacks are covered.

For details: `references/stack_detection.md`.

### UNKNOWN_FALLBACK Checklist

Returned when no supported surface matches, when intent confidence is low (`max(intent_scores) < 0.5`), or when the user explicitly asks for stack-agnostic guidance. Ask for the missing routing inputs instead of guessing:

- Confirm the active runtime surface — Webflow/frontend or `.opencode/` system code.
- Confirm the task intent (implementation / debugging / verification / etc.).
- Provide one concrete input, error, or expected output.
- Confirm the verification command set before any completion claim.

Do not load Go / Next.js / React Native / Swift resources — canonical `sk-code` owns only WEBFLOW + OPENCODE + MOTION_DEV. Full fallback logic: `references/smart_routing.md §8`.

### Phase Detection

```text
TASK CONTEXT
    |
    +- STEP 0: Detect surface from CWD + target files (primary routing key)
    |    +- references/<surface>/  (webflow / opencode)
    |    +- assets/<surface>/      (webflow / opencode)
    |
    +- STEP 1: Detect language sub-key (OPENCODE only) for verification commands
    |
    +- STEP 2: Weighted intent scoring (top-2 when ambiguity delta is small)
    |
    +- Phase 1: Implementation -> per-language style + standards + implementation trio
    +- Phase 2: Debugging       -> debugging refs + universal error recovery
    +- Phase 3: Verification    -> surface-appropriate verification commands + checklist
```

**The Iron Law**: NO COMPLETION CLAIMS WITHOUT RUNNING SURFACE-APPROPRIATE VERIFICATION.

Phase contract details: [`references/phase_detection.md`](./references/phase_detection.md).

### OPENCODE Language Sub-Detection

When surface is `OPENCODE`, detect language from changed/target file extensions first, then weighted keywords:

| Language | Extensions / Signals | Resources |
| --- | --- | --- |
| JAVASCRIPT | `.js`, `.mjs`, `.cjs`, CommonJS, Node, MCP | `references/opencode/javascript/*` |
| TYPESCRIPT | `.ts`, `.tsx`, `.mts`, `.d.ts`, tsconfig, interfaces | `references/opencode/typescript/*` |
| PYTHON | `.py`, pytest, argparse, docstrings | `references/opencode/python/*` |
| SHELL | `.sh`, `.bash`, shebang, pipefail | `references/opencode/shell/*` |
| CONFIG | `.json`, `.jsonc`, schema, descriptor | `references/opencode/config/*` |

Ambiguous multi-language tasks load the top matching language references plus the universal OpenCode checklist.

### Resource Domains

- `references/universal/`: surface-agnostic error recovery, code quality, style, and research guidance.
- `references/`: detection, intent scoring, loading, and lifecycle internals.
- `references/webflow/`, `assets/webflow/`: live Webflow/frontend per-language references under `references/webflow/{javascript,css,html}/*` — JS and CSS each carry `style_guide.md`, `quality_standards.md`, `quick_reference.md`; CSS additionally carries `patterns.md` (Webflow tokens, state machines, focus/form patterns); HTML carries `style_guide.md` only (Webflow Designer manages most HTML). Cross-language rules + enforcement workflow + dev workflow live under `references/webflow/shared/*`. Categorical workflow patterns (implementation, debugging, verification, performance, deployment) and copy-paste templates (`assets/webflow/templates/component_template.{js,css}`) round out the surface. Mirrors the OPENCODE per-language layout so the smart router resolves both surfaces with identical key-derived patterns.
- `references/motion_dev/`, `assets/motion_dev/`: cross-stack Motion.dev API, timeline, scroll/gesture, performance, decision-matrix, integration, install, playbook hook, and snippet resources. Webflow docs link here for generic Motion details while keeping Webflow-CDN and Designer guidance in `references/webflow/`.
- `references/opencode/`, `assets/opencode/`: OpenCode system-code language standards, shared patterns, hooks, alignment automation, and quality checklists.
- `assets/webflow/scripts/`: Webflow build, minification, and runtime verification utilities.
- `assets/scripts/`: Cross-surface helper scripts, including the OpenCode alignment verifier.

### Resource Loading Levels

Loading follows the canonical three levels; the finer `ALWAYS / SURFACE / INTENT / LANGUAGE / ON_DEMAND` tiers live in `references/smart_routing.md §3`.

| Level | When to Load | Resources |
| --- | --- | --- |
| ALWAYS | Every sk-code invocation | `references/stack_detection.md`, `references/smart_routing.md`, `references/phase_detection.md`, and the `references/universal/` quality + error-recovery baseline |
| CONDITIONAL | After surface + intent (and OPENCODE language) detection | the detected `references/<surface>/` + `assets/<surface>/` trees, the matching language standards, intent-mapped resources, the authoring checklists below, and `references/motion_dev/` for `MOTION_DEV` intent |
| ON_DEMAND | Only on an explicit deep-dive request | extended checklists and niche references, plus the full `INTENT_MODEL` / `RESOURCE_MAP` in `references/smart_routing.md` |

### OpenCode Authoring Resources

| Resource | Path | When to load |
|---|---|---|
| skill_authoring | `assets/opencode/checklists/skill_authoring.md` | CONDITIONAL (intent: authoring new skill) |
| agent_authoring | `assets/opencode/checklists/agent_authoring.md` | CONDITIONAL (intent: authoring new agent) |
| command_authoring | `assets/opencode/checklists/command_authoring.md` | CONDITIONAL (intent: authoring new command) |
| mcp_server_authoring | `assets/opencode/checklists/mcp_server_authoring.md` | CONDITIONAL (intent: authoring MCP server) |
| spec_folder_authoring | `assets/opencode/checklists/spec_folder_authoring.md` | CONDITIONAL (intent: spec folder write) |
| spec_folder_write recipe | `assets/opencode/recipes/spec_folder_write.md` | CONDITIONAL (intent: spec folder write) |

### Intent Classification

After surface detection, score task text for intents: `IMPLEMENTATION`, `CODE_QUALITY`, `DEBUGGING`, `VERIFICATION`, `TESTING`, `DEPLOYMENT`, `PERFORMANCE`, `ANIMATION`, `MOTION_DEV`, `FORMS`, `VIDEO`, `API`, `HOOKS`, `CONFIG`, and `LANGUAGE_STANDARDS`.

Top intent always loads. A close second intent also loads when scores are within the ambiguity threshold.

`MOTION_DEV` is a resource intent, not a third code surface. It loads `references/motion_dev/` and `assets/motion_dev/` for cross-stack Motion questions after WEBFLOW/OPENCODE/UNKNOWN surface handling has established where implementation work is happening.

### Verification Commands

| Surface | Required verification evidence |
| --- | --- |
| WEBFLOW | `node .opencode/skills/sk-code/assets/webflow/scripts/minify-webflow.mjs`, `node .opencode/skills/sk-code/assets/webflow/scripts/verify-minification.mjs`, `node .opencode/skills/sk-code/assets/webflow/scripts/test-minified-runtime.mjs`, plus desktop/mobile browser console clean evidence when runtime behavior changes |
| OPENCODE | `python3 .opencode/skills/sk-code/assets/scripts/verify_alignment_drift.py --root <changed-scope>`, plus targeted language/project tests such as vitest, pytest, shellcheck, JSON validation, or spec validation for changed spec folders |
| UNKNOWN | User-selected verification command set before completion claim |

### Verification Rituals

Apply these alongside the commands above, scaled to blast radius:

- **Mutation check / claim-falsifier (after green).** A passing test proves nothing until you have seen it fail for the right reason. After green, break the production code the test guards, confirm that specific test fails, then restore. Distinguish **true-RED** (the assertion fails against correct intent) from **compile-RED** (the suite never compiled or ran — not a satisfying RED). A test that stays green when you break the thing it guards is a vacuous test — a defect, not coverage.
- **Verification ladder — name each rung's blind spot.** Climb cheapest→most authoritative and state in advance what each rung CANNOT see: **unit** (integration/wiring unseen) → **in-memory** (real I/O and serialization unseen) → **on-server** (deployment/config/env-specific behavior unseen) → **live** (only proves the exact path actually exercised). In-memory-green is not production-green. Rung mapping: WEBFLOW climbs unit → headless/browser-console evidence; OPENCODE climbs unit (vitest/pytest) → real-file / spec validation → live CLI/daemon run.
- **Decision economy + fail-closed by construction.** Leave a **named seam with a closing condition**, never a bare TODO and never a dead control (a flag or branch that does nothing). Prefer a **structural invariant** — the wrong state cannot be represented, or compiles to an error — over a disciplinary reminder asking future readers to be careful.

### Smart Router Pseudocode

Smart Router pseudocode (full implementation): see [`references/smart_routing.md`](./references/smart_routing.md) for the authoritative `INTENT_MODEL`, `RESOURCE_MAP`, load tiers, and surface→intent routing logic.

---

## 3. HOW IT WORKS

### WEBFLOW Workflow

1. Detect frontend/Webflow markers before generic package markers.
2. Load Webflow implementation, debugging, verification, performance, and vendor-specific resources by intent.
3. Verify with build/minification scripts and browser evidence when behavior changes.
4. Update CDN/versioning guidance after JavaScript bundle changes.
5. For Motion API or decision questions, load `references/motion_dev/` as the cross-stack peer reference and keep Webflow-specific CDN guidance in `references/webflow/`.

### OPENCODE Workflow

1. Detect `.opencode/` context from CWD or target files.
2. Detect language from file extension first, then keyword scores.
3. Load shared OpenCode patterns, language standards, quick references, and checklists.
4. **Phase 1.5 comment hygiene:** Run `.opencode/skills/sk-code/scripts/check-comment-hygiene.sh <file>` on each modified file before committing. Zero violations required. Three automatic enforcement gates also run independently: `scripts/hooks/claude-posttooluse.sh` (write-time warning, Claude Code), `.opencode/hooks/pre-commit` (commit-time block, all runtimes), and `.github/workflows/comment-hygiene.yml` (CI gate, all PRs).
5. Run the alignment verifier and targeted tests before completion claims.
6. Use `sk-code-review` for formal findings-first review; use this skill for standards evidence.

### UNKNOWN Workflow

Ask for the runtime surface and required verification commands. Do not route generic Node.js, React Native, Swift, Go, or Next.js as supported unless a future route is explicitly added to `sk-code`.

---

## 4. RULES

### ✅ ALWAYS

1. Read target files before editing.
2. Detect code surface before loading resources.
3. For OPENCODE, detect language before applying standards.
4. Load the quality checklist before completion claims.
5. Trace debugging from symptom to root cause.
6. Run surface verification commands and record evidence.
7. For WEBFLOW, test relevant desktop and mobile browser behavior when runtime output changes.
8. For OPENCODE, run `verify_alignment_drift.py` on the changed scope.
9. Build the simplest correct implementation of the stated requirement and do not stall. If part of the requirement looks unnecessary (YAGNI), implement it as specified AND raise a scope-amendment recommendation in the same response — never silently cut scope (SCOPE-LOCK), and never block solely to ask when a safe minimal version already satisfies the requirement.

### ❌ NEVER

1. Claim completion without verification evidence.
2. Treat Go, Next.js, generic Node.js, React Native, or Swift as supported routes.
3. Use the OpenCode language standards for frontend Webflow HTML/CSS/JS behavior.
4. Use Webflow browser rules for `.opencode/` system code.
5. Leave commented-out code, production debug logs, or unchecked generated metadata drift.

### ⚠️ ESCALATE IF

1. Surface detection is ambiguous.
2. Verification commands cannot be run locally.
3. Security-sensitive validation or filesystem behavior is unclear.
4. Three fixes fail for the same symptom.

### Escalation Discipline

- Before applying another fix for the same symptom, state a one-sentence root cause tied to observed evidence. If you cannot, escalate instead of guessing.
- If implementation evidence conflicts with the approved spec, stop and escalate for an AMENDMENT decision. Do not ship a workaround that silently changes the spec's meaning.
- After three failed fix attempts for the same symptom, stop automatic retries and escalate with the attempted fixes, current evidence, and one recommended next action.
- If independent reviewers or validators contradict each other on a blocking outcome, do not silently pick one. Emit one consolidated escalation with the conflicting facts and the decision needed.

---

## 5. SUCCESS CRITERIA

- WEBFLOW work follows frontend/Webflow patterns and passes Webflow verification plus browser evidence when applicable.
- OPENCODE work follows language standards and passes alignment verifier plus targeted tests.
- P0 quality issues are fixed before completion claims.
- Unsupported surfaces stay UNKNOWN until an approved route is added.

---

## 6. INTEGRATION POINTS

- `sk-code-review`: findings-first review baseline; pair with `sk-code` surface evidence.
- `system-spec-kit`: spec folder gates, validation, memory, and context preservation.
- `mcp-chrome-devtools`: browser evidence for Webflow/frontend runtime behavior.
- `sk-doc`: markdown/documentation quality.
- `sk-git`: commits, branches, PRs, and finish workflow.

---

## 7. REFERENCES

Start with `references/stack_detection.md`, `references/smart_routing.md`, `references/smart_routing.md`, and `references/phase_detection.md`. Then load `references/webflow/**` or `references/opencode/**` based on detected surface.

Scripts: `.opencode/skills/sk-code/assets/webflow/scripts/minify-webflow.mjs`, `.opencode/skills/sk-code/assets/webflow/scripts/verify-minification.mjs`, `.opencode/skills/sk-code/assets/webflow/scripts/test-minified-runtime.mjs`, `.opencode/skills/sk-code/assets/scripts/verify_alignment_drift.py`, `.opencode/skills/sk-code/assets/scripts/test_verify_alignment_drift.py`.
