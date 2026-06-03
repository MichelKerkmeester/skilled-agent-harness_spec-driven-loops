---
title: "sk-code: Surface-Aware Code Skill"
description: "Single code-work skill with smart-router surface detection. Decides whether the active task is Webflow / frontend, OpenCode system code, or motion.dev animation work, then loads matching implementation, quality, debugging, and verification resources."
trigger_phrases:
  - "code work"
  - "implement feature"
  - "fix bug"
  - "code surface detection"
  - "webflow frontend"
  - "opencode system code"
  - "motion.dev animation"
  - "code verification"
---

# sk-code

> The single code-work skill: surface-aware smart router that detects whether the task is Webflow/frontend, OpenCode system code, or motion.dev animation, then loads the matching standards, debugging guidance, and verification commands.

---

## 1. OVERVIEW

sk-code is the single code-work skill in this template repo. It runs a surface-aware smart router that decides which code surface is in front of it before loading any standards or running any verification. The supported shipped surfaces are **WEBFLOW** (frontend HTML/CSS/JS, Webflow Designer, animation libraries), **OPENCODE** (system code under `.opencode/` (skills, agents, commands, scripts, MCP servers, JSON/JSONC config)), and **MOTION_DEV** (cross-stack motion.dev API as an intent route, not a primary surface). When neither WEBFLOW nor OPENCODE matches, the router asks the user which surface and what verification commands to run rather than guessing.

The skill follows a four-step lifecycle: detect the surface → classify the intent (implementation, debugging, quality, verification) → load matching resources from `references/<surface>/` and `assets/<surface>/` → produce verification evidence before any "done" claim. The Iron Law applies across all surfaces: no completion claim is valid without surface-appropriate verification (browser evidence for WEBFLOW, alignment-drift script + targeted tests for OPENCODE).

This is also **the template customization surface** for end users adopting this repo for their own project. Replace the shipped `references/{webflow,opencode,motion_dev}/` and `assets/{webflow,opencode,motion_dev}/` trees with your stack's references and assets. Update `STACK_FOLDERS` and `RESOURCE_MAP` in SKILL.md §2 to match. Every other skill in the repo (`sk-doc`, `sk-git`, `sk-code-review`, `system-spec-kit`, `system-code-graph`, etc.) is codebase-agnostic and stays that way so upstream pulls remain clean.

### Key Features

- Surface auto-detection: Resolves WEBFLOW (frontend markers), OPENCODE (`.opencode/` paths), MOTION_DEV (intent), or UNKNOWN
- Intent classification: Implementation, debugging, quality, verification (drives which resources load)
- Resource loading: Per-surface refs + assets + universal shared refs (no surface-bleed)
- Phase lifecycle: Detect → classify → load → verify, applied uniformly across surfaces
- OPENCODE language sub-detection: JavaScript, TypeScript, Python, Shell, JSON/JSONC each get matching standards
- Cross-stack motion.dev: MOTION_DEV is a peer intent route, not a primary surface (bare imports do not redirect a workspace)
- Iron Law verification: Surface-appropriate evidence required before any "done" claim
- Template customization surface: The only skill end-users edit when adopting this repo for their stack

---

## 2. QUICK START

**Step 1: Invoke the skill.**
sk-code activates automatically for code-related prompts via Skill Advisor. Manual invocation: read `SKILL.md` directly.

**Step 2: Confirm the detected surface.**
The router prints the resolved surface (WEBFLOW / OPENCODE / MOTION_DEV / UNKNOWN) before loading resources. Confirm the surface matches the task before proceeding.

```bash
# Markers the router checks
ls src/2_javascript/ 2>/dev/null              # WEBFLOW marker
grep -l 'Webflow.push' *.js 2>/dev/null       # WEBFLOW marker
ls .opencode/ 2>/dev/null                     # OPENCODE marker (within tree)
```

**Step 3: Run surface-appropriate verification before claiming done.**

```bash
# WEBFLOW: minify + verify minification + test minified runtime + browser evidence
node .opencode/skills/sk-code/assets/webflow/scripts/minify-webflow.mjs
node .opencode/skills/sk-code/assets/webflow/scripts/verify-minification.mjs
node .opencode/skills/sk-code/assets/webflow/scripts/test-minified-runtime.mjs
# Plus browser evidence (Chrome DevTools or equivalent)

# OPENCODE: alignment-drift + targeted tests
python3 .opencode/skills/sk-code/assets/scripts/verify_alignment_drift.py --root <changed-scope>
# Plus per-language test runner (vitest, pytest, etc.)
```

**Step 4: Document evidence in the spec folder.**
Surface-appropriate evidence (browser screenshot, alignment-drift exit 0, test runner output) goes into the spec folder's `checklist.md` items as `[x]` with a path or output snippet.

---

## 3. FEATURES

### 3.1 FEATURE HIGHLIGHTS

The smart router is the heart of this skill. It detects the active surface from a small marker set rather than from the user's prompt: the WEBFLOW marker set includes `src/2_javascript/`, `*.webflow.js`, `Webflow.push`, `--vw-` CSS variables, `window.Motion`, GSAP/Lenis/HLS/Swiper/FilePond imports, and `wrangler.toml`. The OPENCODE marker is path-based: any change inside `.opencode/` qualifies. MOTION_DEV is an intent route, not a surface (it activates after WEBFLOW or OPENCODE selection when the task touches motion.dev API). UNKNOWN means neither surface matched, and the router asks the user rather than assuming.

Intent classification runs after surface selection. The four intents (implementation, debugging, quality, verification) drive which references load: implementation pulls patterns and idioms; debugging pulls error-recovery and root-cause guidance; quality pulls linting/style/security checklists; verification pulls per-surface evidence requirements. The classifier is conservative (when a prompt has multiple intents, it loads the union rather than picking one).

OPENCODE language sub-detection runs once OPENCODE is selected. The router inspects file extensions and shebangs to identify JavaScript, TypeScript, Python, Shell, or JSON/JSONC, then loads `references/opencode/<lang>/` for that language's idioms and `assets/opencode/checklists/<lang>/` for that language's verification commands. Multiple languages in the same change set load multiple language references; cross-language patterns (e.g., a Python script reading a JSON config) get the union.

The Iron Law sits at the boundary between the verification phase and "done." Saying "looks good" or "should work" before evidence is collected is a violation. Surface-appropriate evidence means browser screenshots for WEBFLOW (the change must be visually verified in the Designer or live preview), alignment-drift exit 0 plus targeted test runs for OPENCODE, and full WEBFLOW verification (minify, verify-minification, test-minified-runtime, browser) for MOTION_DEV inside Webflow. No surface has an "exempt" verification path.

The template customization callout in SKILL.md §1 is the load-bearing piece for repo adopters. Forking this template means replacing the shipped `references/{webflow,opencode,motion_dev}/` and `assets/{webflow,opencode,motion_dev}/` trees with your stack's references and assets, then updating `STACK_FOLDERS` and `RESOURCE_MAP` in §2. Doing so keeps every other skill (`sk-doc`, `sk-git`, `sk-code-review`, `system-spec-kit`) codebase-agnostic so upstream pulls remain clean.

### 3.2 SKILL STATISTICS

sk-code is at version 3.3.0.0 with a SKILL.md contract of 252 LOC. The skill ships 3 surfaces (WEBFLOW, OPENCODE, MOTION_DEV) with smart router pseudocode inline in SKILL.md §2 SMART ROUTING. Reference directories include 4 main directories (`universal/`, `webflow/`, `opencode/`, `motion_dev/`) plus 3 routing files at root (`stack_detection.md`, `smart_routing.md`, `phase_detection.md`). OPENCODE language sub-detection supports 5 languages (JavaScript, TypeScript, Python, Shell, JSON/JSONC). Verification scripts include `verify_alignment_drift.py` for OPENCODE and browser evidence collection for WEBFLOW.

### 3.3 FEATURE REFERENCE

**Surface Detection Catalog**

| Surface | Detection Markers | Primary Resources |
| --- | --- | --- |
| WEBFLOW | `src/2_javascript/`, `*.webflow.js`, `Webflow.push`, `--vw-`, `window.Motion`, GSAP, Lenis, HLS, Swiper, FilePond, `wrangler.toml` | Frontend HTML/CSS/JS, animation libs, CDN/minification, browser verification |
| OPENCODE | CWD or changed/target files inside `.opencode/` | Skills, agents, commands, scripts, MCP code, JSON/JSONC config |
| MOTION_DEV | Bare Motion package imports OR generic motion.dev mentions (intent route, post-surface selection) | Cross-stack motion.dev API + performance + decision + integration refs |
| UNKNOWN | No marker matched | Ask user for surface + verification commands |

**How This Compares**

| Capability | sk-code | sk-code-review | sk-doc |
| --- | --- | --- | --- |
| Code implementation | Yes | No | No |
| Surface auto-detection | Yes (3 surfaces) | No (relies on sk-code) | No |
| Verification evidence | Yes (per surface) | No (review only) | No |
| Findings-first review | No | Yes | No |
| Documentation quality | No | No | Yes |
| Template customization surface | Yes | No | No |

**OPENCODE Language Sub-Detection**

| Language | Marker | Reference Path |
| --- | --- | --- |
| JavaScript | `.js` files, `package.json` | `references/opencode/javascript/` |
| TypeScript | `.ts` / `.tsx` files | `references/opencode/typescript/` |
| Python | `.py` files, shebang `#!python` | `references/opencode/python/` |
| Shell | `.sh` files, shebang `#!bash` | `references/opencode/shell/` |
| JSON/JSONC | `.json` / `.jsonc` files | `references/opencode/config/` |

**Verification Per Surface**

| Surface | Required Evidence |
| --- | --- |
| WEBFLOW | `minify-webflow.mjs` exit 0 + `verify-minification.mjs` exit 0 + `test-minified-runtime.mjs` exit 0 + browser evidence for runtime changes |
| OPENCODE | `verify_alignment_drift.py --root <scope>` exit 0 + per-language test runner exit 0 |
| MOTION_DEV (within WEBFLOW) | Full WEBFLOW evidence chain |
| UNKNOWN | User-specified evidence |

**Universal References (load alongside surface refs)**

| Reference | Purpose |
| --- | --- |
| `universal/code_quality_standards.md` | Cross-surface quality patterns (KISS, DRY, complexity) |
| `universal/code_style_guide.md` | Cross-surface style conventions |
| `universal/multi_agent_research.md` | When to research vs assume |
| `universal/error_recovery.md` | Failure handling and root-cause discipline |

---

## 4. STRUCTURE

```text
sk-code/
├── SKILL.md                            # Surface-aware router contract (252 LOC)
├── README.md                           # This file
├── description.json                    # Auto-discoverable description
├── graph-metadata.json                 # Skill graph relationships
├── references/
│   ├── stack_detection.md              # Surface detection markers
│   ├── smart_routing.md                # Intent classification + resource loading
│   ├── phase_detection.md              # Phase lifecycle detection
│   ├── universal/                      # Shared code quality, style, research, error recovery
│   ├── motion_dev/                     # Cross-stack motion.dev API, performance, decision, integration
│   ├── webflow/                        # Live Webflow/frontend resources
│   └── opencode/                       # OpenCode system-code standards (per-language)
│       ├── shared/
│       ├── javascript/
│       ├── typescript/
│       ├── python/
│       ├── shell/
│       └── config/
└── assets/
    ├── universal/
    ├── motion_dev/                     # Install card, playbook entries, reusable Motion snippets
    ├── webflow/
    │   └── scripts/
    │       ├── minify-webflow.mjs
    │       ├── verify-minification.mjs
    │       └── test-minified-runtime.mjs
    ├── opencode/checklists/
    └── scripts/
        ├── verify_alignment_drift.py
        └── test_verify_alignment_drift.py
```

---

## 5. CONFIGURATION

No configuration is required. The smart router handles surface detection automatically.

**Allowed-tools array** (frontmatter, do not modify)

`[Bash, Edit, Glob, Grep, Read, Task, Write]` (write-capable for code modification). Widening this array is forbidden without an explicit user-approved ADR.

**Surface override**: pass `surface: <name>` as a prompt prefix when the auto-detection chain disambiguates incorrectly. Example: `[surface: opencode] update the Python validator`. The router accepts WEBFLOW, OPENCODE, or MOTION_DEV.

**Iron Law enforcement** applies to all surfaces. There is no opt-out. The skill carries forbidden phrases (`should work`, `looks good`, `seems fine`) that the AI must not emit before per-surface verification has run cleanly.

**Template customization** for repo adopters: replace `references/{webflow,opencode,motion_dev}/` and `assets/{webflow,opencode,motion_dev}/` with your stack's references and assets. Update `STACK_FOLDERS` and `RESOURCE_MAP` in SKILL.md §2. Keep every other skill in the repo unchanged so upstream pulls stay clean.

---

## 6. USAGE EXAMPLES

**Implement a Webflow component**

```text
Task: Add a hero animation using motion.dev
sk-code:
  Detection: src/2_javascript/ + window.Motion → WEBFLOW + MOTION_DEV intent
  Loaded: references/webflow/implementation/animation_workflows.md, references/motion_dev/integration_patterns.md, references/universal/code_quality_standards.md
  Implementation: writes the hero animation
  Verification: runs minify-webflow.mjs (exit 0) + verify-minification.mjs (exit 0)
                + test-minified-runtime.mjs (exit 0) + collects browser evidence
  Result: claims done with surface-appropriate evidence
```

**Add a script under .opencode/**

```text
Task: Add a Python verification script for the new skill
sk-code:
  Detection: target path under .opencode/ → OPENCODE
  Sub-detection: .py extension → Python
  Loaded: references/opencode/python/standards.md, references/opencode/python/testing.md, references/universal/code_quality_standards.md
  Implementation: writes the script + tests
  Verification: runs verify_alignment_drift.py --root .opencode/skills/<skill> (exit 0) + pytest (exit 0)
  Result: claims done with OPENCODE evidence
```

**Disambiguate when surface is unclear**

```text
Task: Update some animation code
sk-code:
  Detection: no clear marker hit → UNKNOWN
  Action: asks user for surface and verification commands rather than guessing
  User reply: "[surface: webflow] update the parallax scroll"
  Detection: explicit override → WEBFLOW
  Loaded: references/webflow/implementation/animation_workflows.md
  Verification: full WEBFLOW evidence chain
```

**Customize the template for a new stack** (repo adopters only)

```bash
# Replace shipped surface references with your stack's references
rm -rf references/webflow references/opencode references/motion_dev
mkdir -p references/{your-stack-1,your-stack-2}
# Author your stack's references
# Update SKILL.md §2 STACK_FOLDERS and RESOURCE_MAP to match
```

---

## 7. TROUBLESHOOTING

**Router resolves to UNKNOWN repeatedly**

What you see: The router enters the UNKNOWN branch and asks for surface + verification commands on every prompt, even when the task is clearly inside a known surface.

Common causes: Markers absent from the workspace (e.g., a fresh clone without `node_modules` or without `Webflow.push` strings yet), CWD outside the workspace root so path-based markers don't match, or the task targets files outside `.opencode/` and outside the WEBFLOW marker scope.

Fix: Pass `[surface: <name>]` as a prompt prefix to override detection. Verify markers exist (e.g., `find . -name '*.webflow.js' | head -3` or `ls .opencode/`). If working in a polyglot repo, the UNKNOWN branch is correct (the router declines to guess and that's by design).

---

**Wrong surface loaded**

What you see: The router resolves to WEBFLOW when the task is OPENCODE (or vice versa), and the loaded references don't match the task.

Common causes: Marker collision (e.g., a `package.json` exists at workspace root, triggering JS/TS detection in a non-OPENCODE folder), changed files span both surfaces, or path detection picked the wrong root.

Fix: Override with `[surface: <name>]`. If the issue is structural (markers genuinely overlap), update SKILL.md §2 SMART ROUTING to refine the detection rules (but do that as a deliberate change, not a workaround for one prompt).

---

**Verification fails repeatedly**

What you see: Phase 4 (verification) fails on the same surface repeatedly even after fixes, and the cycle doesn't converge.

Common causes: Surface-appropriate evidence was skipped (e.g., browser evidence not collected for WEBFLOW), wrong verification command run (e.g., `pytest` for an OPENCODE JavaScript file), or the underlying issue is upstream (a shared dependency or CI-only behavior).

Fix: Halt the loop. Re-read SKILL.md §4 RULES for the surface in play. Confirm every required verification command was run for that surface. If failures persist after three Phase 4 cycles, escalate to a human and document the blocker.

---

**MOTION_DEV intent doesn't activate**

What you see: A motion.dev-related task doesn't load `references/motion_dev/`; the router stays on WEBFLOW or OPENCODE without the cross-stack refs.

Common causes: MOTION_DEV is an intent, not a primary surface (it activates after WEBFLOW or OPENCODE is selected and only when the task touches motion.dev API). If the prompt mentions "motion" generically (without API names like `Motion.animate`, `Motion.timeline`, package import) MOTION_DEV doesn't trigger.

Fix: Reference a specific motion.dev API or import in the prompt to activate MOTION_DEV. The intent route is conservative by design (generic mentions of "animation" or "motion" don't route to motion.dev because they could mean any animation library).

---

## 8. FAQ

**Q: Why is sk-code the only skill I should edit when forking this repo?**

A: sk-code is the surface-detection layer. Your stack's surfaces (frontend frameworks, backend languages, infrastructure) live in `references/<surface>/` and `assets/<surface>/`. Every other skill in the repo (`sk-doc`, `sk-git`, `sk-code-review`, `system-spec-kit`, `system-code-graph`) is intentionally codebase-agnostic (they don't know your stack). Editing them creates merge conflicts when you pull upstream updates. Editing sk-code does not (your customization stays in `references/<surface>/` and `assets/<surface>/`, which upstream doesn't touch).

**Q: What's the difference between WEBFLOW, OPENCODE, and MOTION_DEV?**

A: WEBFLOW and OPENCODE are *primary surfaces* (exactly one is selected per task). MOTION_DEV is an *intent route* that layers on top of WEBFLOW (or rarely, OPENCODE) when the task uses motion.dev API. The distinction matters because surfaces have full reference + asset trees and dictate verification commands; intents are narrower and provide cross-stack guidance only.

**Q: How does OPENCODE language sub-detection work?**

A: After OPENCODE surface is selected, the router inspects file extensions and shebangs to identify language(s) in the change scope. JavaScript (`.js`), TypeScript (`.ts`/`.tsx`), Python (`.py`), Shell (`.sh`), and JSON/JSONC (`.json`/`.jsonc`) each have a dedicated `references/opencode/<lang>/` directory. Multi-language change scopes load multiple language directories.

**Q: Can I add a new surface?**

A: Yes (that's the template customization workflow). Add a new directory under `references/` and `assets/`, define detection markers, update `STACK_FOLDERS` and `RESOURCE_MAP` in SKILL.md §2 SMART ROUTING. Keep the change scoped to sk-code so upstream pulls don't conflict.

**Q: Why does the Iron Law forbid "should work" claims?**

A: Verification before completion is the safety check that distinguishes confident code from plausible-looking code. AI assistants frequently emit code that looks correct but breaks under specific inputs, or that compiles but doesn't pass tests. The Iron Law makes verification a hard gate: surface-appropriate evidence (browser screenshot, alignment-drift exit 0, test runner pass) must exist before any "done" claim. The pattern eliminates a whole class of credibility failures where the AI claims success on unverified code.

---

## 9. RELATED DOCUMENTS

| Resource | Path | Purpose |
| --- | --- | --- |
| SKILL.md | `.opencode/skills/sk-code/SKILL.md` | Surface-aware router contract with phase lifecycle |
| Surface detection | `references/stack_detection.md` | Detection markers and resolution chain |
| Intent classification | `references/smart_routing.md` | Implementation/debugging/quality/verification routing |
| Resource loading | `references/smart_routing.md` | Per-surface and per-intent loading rules |
| Phase lifecycle | `references/phase_detection.md` | Detect → classify → load → verify |
| WEBFLOW references | `references/webflow/` | Frontend HTML/CSS/JS + animation libs |
| OPENCODE references | `references/opencode/` | System-code standards per language |
| MOTION_DEV references | `references/motion_dev/` | Cross-stack motion.dev API |
| Universal references | `references/universal/` | Shared code quality, style, research, error recovery |
| sk-code-review | `.opencode/skills/sk-code-review/` | Findings-first review baseline (peer skill) |
| sk-doc | `.opencode/skills/sk-doc/` | Documentation quality enforcement |
| sk-git | `.opencode/skills/sk-git/` | Git workflow orchestration |
| system-spec-kit | `.opencode/skills/system-spec-kit/` | Spec folder lifecycle and Gate 3 |
| mcp-chrome-devtools | `.opencode/skills/mcp-chrome-devtools/` | Browser evidence for Webflow/frontend work |
| Root README §4 | `../../README.md#customizing-for-your-stack` | Template customization workflow |
