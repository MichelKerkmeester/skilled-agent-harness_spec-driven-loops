---
name: sk-code
description: "Smart-routing umbrella skill for code work. Detects code surface first (WEBFLOW frontend vs OPENCODE system code), then classifies intent and loads surface-aware resources. WEBFLOW covers Webflow / vanilla HTML/CSS/JS animation projects. OPENCODE covers .opencode system code across JavaScript, TypeScript, Python, Shell, and JSON/JSONC with language sub-detection. Unknown stacks fall through to disambiguation."
allowed-tools: [Bash, Edit, Glob, Grep, Read, Task, Write]
version: 2.0.0
---

<!-- Keywords: sk-code, code workflows, smart-router, code-surface-detection, webflow, frontend, html, css, javascript, motion.dev, gsap, lenis, swiper, hls, filepond, opencode, system-code, mcp, typescript, python, shell, jsonc, code-quality, debugging-workflow, verification -->

# Code Workflows - Surface-Aware Smart Router

`sk-code` is the single code-work skill. It first decides which code surface is in front of it, then loads the right implementation, quality, debugging, and verification resources.

**Core principle**: `Code surface detection -> Intent classification -> Surface resources -> Verification evidence`.

---

## 1. WHEN TO USE

Use this skill when doing code work in either supported surface:

- **WEBFLOW**: Webflow / vanilla frontend work in HTML, CSS, and JavaScript, including motion.dev, GSAP, Lenis, HLS, Swiper, FilePond, CDN/minification, and browser verification.
- **OPENCODE**: OpenCode system work under `.opencode/`, including skills, agents, commands, MCP servers, hooks, scripts, tests, JSON/JSONC config, TypeScript, JavaScript, Python, and Shell.

Use it for implementation, code quality, debugging, verification, test failures, build failures, and before any completion claim.

Do **not** use this skill for documentation-only changes (`sk-doc`), git workflow (`sk-git`), pure browser inspection (`mcp-chrome-devtools`), or formal findings-first review output (`sk-code-review` baseline plus this skill's surface evidence).

### Phase Overview

| Phase | Purpose | Requirement |
| --- | --- | --- |
| Phase 0: Research | Understand unfamiliar code or risky changes | Optional, but required for complex work |
| Phase 1: Implementation | Write or modify code using surface patterns | Read actual files first |
| Phase 1.5: Code Quality Gate | Apply P0/P1/P2 checks and surface standards | Required before claiming implementation done |
| Phase 2: Debugging | Trace symptom to root cause and fix one cause at a time | Required when tests/runtime fail |
| Phase 3: Verification | Run surface verification commands and record evidence | Required before any done/works claim |

**Iron Law**: no completion claim without fresh verification evidence from the detected surface.

### Review Baseline Contract

`sk-code-review` owns findings format, severity model, and baseline security/quality/test review. `sk-code` owns surface detection and surface-specific standards evidence.

---

## 2. SMART ROUTING

### Code Surface Detection (FIRST)

Detection is context-aware and uses CWD plus changed/target files. **Precedence**: OPENCODE target/CWD wins over WEBFLOW markers (because mixed-marker workspaces are common — `.opencode/` system tools sometimes ship frontend animation libraries internally). When neither matches, fall through to UNKNOWN.

```bash
# Use early-return precedence — never let later branches overwrite an earlier match.

# 1. OPENCODE - takes precedence: CWD or any changed/target file under .opencode/
if [[ "$PWD" == */.opencode/* ]] \
   || [[ "$TARGET_FILE" == */.opencode/* ]]; then
  SURFACE="OPENCODE"

# 2. WEBFLOW - frontend HTML/CSS/JS and vanilla animation web
elif [[ -d "src/2_javascript" ]] \
     || ls *.webflow.js 2>/dev/null | head -1 \
     || grep -lq "Webflow\.push\|--vw-" src/**/*.{js,css,html} 2>/dev/null \
     || grep -lqE "from ['\"]motion['\"]|motion\.dev|window\.gsap|gsap\.(to|from|set|timeline|registerPlugin)|new Lenis|new Hls|new Swiper|FilePond" \
        src/**/*.{js,mjs,ts,html} *.{js,mjs,ts,html} 2>/dev/null \
     || [[ -f "wrangler.toml" ]]; then
  SURFACE="WEBFLOW"

# 3. UNKNOWN - not owned by this skill; ask for runtime + verification commands
else
  SURFACE="UNKNOWN"
fi
```

**Why OPENCODE wins precedence**: `.opencode/skill/sk-doc/scripts/preview-server.js` is an OPENCODE system tool that may import vanilla animation libraries (Lenis, GSAP) for its preview UI. A first-match-WEBFLOW pseudocode would route this OPENCODE work to the wrong standards. The target/CWD path is the strongest unambiguous signal of which surface owns the work.

**Supported surfaces**:

- `WEBFLOW`: frontend HTML/CSS/JS, Webflow conventions, vanilla animation libraries, CDN/minification, and browser evidence.
- `OPENCODE`: `.opencode/` system code and config with language sub-detection.
- `UNKNOWN`: ask a short disambiguation question and do not pretend unsupported stacks are covered.

For details: `references/router/code_surface_detection.md`.

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
- `references/router/`: detection, intent scoring, loading, and lifecycle internals.
- `references/webflow/`, `assets/webflow/`: live Webflow/frontend implementation, standards, debugging, verification, performance, deployment, checklists, and patterns.
- `references/opencode/`, `assets/opencode/`: OpenCode system-code language standards, shared patterns, hooks, alignment automation, and quality checklists.
- `scripts/`: Webflow build utilities plus OpenCode alignment verifier.

### Intent Classification

After surface detection, score task text for intents: `IMPLEMENTATION`, `CODE_QUALITY`, `DEBUGGING`, `VERIFICATION`, `TESTING`, `DEPLOYMENT`, `PERFORMANCE`, `ANIMATION`, `FORMS`, `VIDEO`, `API`, `HOOKS`, `CONFIG`, and `LANGUAGE_STANDARDS`.

Top intent always loads. A close second intent also loads when scores are within the ambiguity threshold.

### Verification Commands

| Surface | Required verification evidence |
| --- | --- |
| WEBFLOW | `node scripts/minify-webflow.mjs`, `node scripts/verify-minification.mjs`, `node scripts/test-minified-runtime.mjs`, plus desktop/mobile browser console clean evidence when runtime behavior changes |
| OPENCODE | `python3 .opencode/skill/sk-code/scripts/verify_alignment_drift.py --root <changed-scope>`, plus targeted language/project tests such as vitest, pytest, shellcheck, JSON validation, or spec validation for changed spec folders |
| UNKNOWN | User-selected verification command set before completion claim |

---

## 3. HOW IT WORKS

### WEBFLOW Workflow

1. Detect frontend/Webflow markers before generic package markers.
2. Load Webflow implementation, debugging, verification, performance, and vendor-specific resources by intent.
3. Verify with build/minification scripts and browser evidence when behavior changes.
4. Update CDN/versioning guidance after JavaScript bundle changes.

### OPENCODE Workflow

1. Detect `.opencode/` context from CWD or target files.
2. Detect language from file extension first, then keyword scores.
3. Load shared OpenCode patterns, language standards, quick references, and checklists.
4. Run the alignment verifier and targeted tests before completion claims.
5. Use `sk-code-review` for formal findings-first review; use this skill for standards evidence.

### UNKNOWN Workflow

Ask for the runtime surface and required verification commands. Do not route generic Node.js, React Native, Swift, Go, or Next.js as supported unless a future route is explicitly added to `sk-code`.

---

## 4. RULES

### ALWAYS

1. Read target files before editing.
2. Detect code surface before loading resources.
3. For OPENCODE, detect language before applying standards.
4. Load the quality checklist before completion claims.
5. Trace debugging from symptom to root cause.
6. Run surface verification commands and record evidence.
7. For WEBFLOW, test relevant desktop and mobile browser behavior when runtime output changes.
8. For OPENCODE, run `verify_alignment_drift.py` on the changed scope.

### NEVER

1. Claim completion without verification evidence.
2. Treat Go, Next.js, generic Node.js, React Native, or Swift as supported routes.
3. Use the OpenCode language standards for frontend Webflow HTML/CSS/JS behavior.
4. Use Webflow browser rules for `.opencode/` system code.
5. Leave commented-out code, production debug logs, or unchecked generated metadata drift.

### ESCALATE IF

1. Surface detection is ambiguous.
2. Verification commands cannot be run locally.
3. Security-sensitive validation or filesystem behavior is unclear.
4. Three fixes fail for the same symptom.

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

Start with `references/router/code_surface_detection.md`, `references/router/intent_classification.md`, `references/router/resource_loading.md`, and `references/router/phase_lifecycle.md`. Then load `references/webflow/**` or `references/opencode/**` based on detected surface.

Scripts: `scripts/minify-webflow.mjs`, `scripts/verify-minification.mjs`, `scripts/test-minified-runtime.mjs`, `scripts/verify_alignment_drift.py`, `scripts/test_verify_alignment_drift.py`.
