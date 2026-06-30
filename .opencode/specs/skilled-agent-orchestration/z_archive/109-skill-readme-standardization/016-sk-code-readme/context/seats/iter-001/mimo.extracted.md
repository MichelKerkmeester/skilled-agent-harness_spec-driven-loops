Now I have a complete picture. Here is the factual map.

---

# Factual Map: `sk-code` Skill — README Rewrite Source

## 1. PURPOSE

`sk-code` is the single code-work skill: a surface-aware smart router that detects the active code surface (WEBFLOW, OPENCODE, or UNKNOWN), classifies intent, loads matching implementation, quality, debugging, and verification resources from per-surface reference and asset trees, and mandates surface-appropriate verification evidence before any completion claim.

## 2. PROBLEM

A single generic code skill cannot serve multiple stacks well because each stack has its own language idioms, quality standards, verification commands, and debugging patterns — applying Webflow browser evidence rules to `.opencode/` TypeScript work (or vice versa) produces wrong standards and false confidence. Surface detection plus mandatory verification evidence (the Iron Law) beats ad-hoc coding because the router eliminates guesswork about which standards apply, and the hard gate on verification evidence eliminates the class of failures where an AI claims "done" on unverified code. The UNKNOWN surface path explicitly declines to guess rather than silently applying wrong patterns.

## 3. MODES & CAPABILITIES

- **Two-axis routing model**: Axis 1 — surface detection from CWD + target file markers (OPENCODE takes precedence over WEBFLOW; UNKNOWN falls through). Axis 2 — intent classification across ~15 intents (IMPLEMENTATION, CODE_QUALITY, DEBUGGING, VERIFICATION, TESTING, DEPLOYMENT, PERFORMANCE, ANIMATION, MOTION_DEV, FORMS, VIDEO, API, HOOKS, CONFIG, LANGUAGE_STANDARDS); top intent always loads, a close second loads when within ambiguity threshold.
- **Phases**: Phase 0 Research (optional), Phase 1 Implementation (write/modify code using surface patterns), Phase 1.5 Code Quality Gate (P0/P1/P2 checks, required before claiming done), Phase 2 Debugging (symptom→root cause, required on failure), Phase 3 Verification (surface verification commands + evidence, required before any done claim).
- **Iron Law**: NO completion claims without fresh verification evidence from the detected surface.
- **Template customization role**: The only skill end users edit when adopting the template repo; replace shipped `references/{webflow,opencode,motion_dev}/` and `assets/{webflow,opencode,motion_dev}/` with own stack's resources and update `STACK_FOLDERS` + `RESOURCE_MAP`.
- **OPENCODE language sub-detection**: After OPENCODE surface, detects language from file extensions then weighted keywords; supports JavaScript, TypeScript, Python, Shell, CONFIG (JSON/JSONC).

## 4. INVOCATION

- **Triggered** automatically via Skill Advisor for code-related prompts, or manually by reading `SKILL.md`.
- **Surface detection markers and precedence**: OPENCODE wins when CWD or any changed/target file is under `.opencode/`. WEBFLOW matches on `src/2_javascript/`, `*.webflow.js`, `Webflow.push`, `--vw-` CSS vars, `window.Motion`, GSAP/Lenis/HLS/Swiper/FilePond imports, or `wrangler.toml`. An explicit non-Webflow guard catches prompts containing "not webflow", "vanilla html/css/js only", "stack-agnostic" etc. and routes to UNKNOWN. When neither matches → UNKNOWN (ask user).
- **Intent classification**: Weighted keyword scoring of task text; top-2 when ambiguity delta is small.
- **Verification commands**: WEBFLOW — `minify-webflow.mjs`, `verify-minification.mjs`, `test-minified-runtime.mjs` plus desktop/mobile browser console clean evidence. OPENCODE — `verify_alignment_drift.py --root <scope>` plus targeted language/project tests (vitest, pytest, shellcheck, JSON validation, spec validation). UNKNOWN — user provides verification command set.
- **NOT used for**: documentation-only changes (`sk-doc`), git workflow (`sk-git`), pure browser inspection (`mcp-chrome-devtools`), formal findings-first review (`sk-code-review`). Docs-only edits to skill markdown route to `sk-doc` even under `.opencode/skills/`.

## 5. KEY FILES

| Path | Purpose |
|---|---|
| `SKILL.md` | Surface-aware router contract, phase lifecycle, rules, STACK_FOLDERS, RESOURCE_MAP (279 lines actual) |
| `README.md` | User-facing documentation, quick start, features, troubleshooting, FAQ |
| `description.json` | Auto-discoverable skill description for memory/graph indexing |
| `graph-metadata.json` | Skill graph relationships for advisor routing |
| `references/stack_detection.md` | Surface detection markers and resolution chain details |
| `references/smart_routing.md` | Authoritative INTENT_MODEL, RESOURCE_MAP, load tiers, surface→intent routing logic |
| `references/phase_detection.md` | Phase lifecycle detection contract |
| `references/universal/` | 4 files: `code_quality_standards.md`, `code_style_guide.md`, `error_recovery.md`, `multi_agent_research.md` |
| `references/webflow/` | 9 subdirs: `css/` (4 files), `html/` (2 files), `javascript/` (3 files), `shared/` (3 files), `implementation/` (11 files), `debugging/` (2 files), `verification/` (2 files), `performance/` (5 files), `deployment/` (3 files) |
| `references/opencode/` | 6 subdirs: `javascript/`, `typescript/`, `python/`, `shell/`, `config/` (3 files each: style_guide, quality_standards, quick_reference), `shared/` (4 files) |
| `references/motion_dev/` | 7 files: animate/timelines, animation principles, decision matrix, integration patterns, performance/pitfalls, quick start, scroll/gestures |
| `assets/webflow/scripts/` | `minify-webflow.mjs`, `verify-minification.mjs`, `test-minified-runtime.mjs` + README |
| `assets/webflow/checklists/` | 4 checklists: code quality, debugging, performance loading, verification |
| `assets/webflow/templates/` | 6 files: component JS/CSS, embed HTML, form scaffold, head/footer code, README |
| `assets/webflow/patterns/` | 5 files: interaction gate, performance, validation, wait patterns, README |
| `assets/webflow/integrations/` | 3 files: HLS patterns, Lenis patterns, README |
| `assets/opencode/checklists/` | 11 files: skill/agent/command/mcp_server/spec_folder authoring, per-language checklists (JS, TS, Python, Shell, Config), universal checklist |
| `assets/opencode/recipes/` | 1 file: `spec_folder_write.md` |
| `assets/scripts/` | `verify_alignment_drift.py`, `test_verify_alignment_drift.py`, README |
| `assets/motion_dev/` | `install_card.md`, `playbook_entries.md`, `snippets/` (11 JS snippet files + README) |
| `assets/universal/checklists/` | 2 files: debugging checklist, verification checklist |
| `assets/universal/patterns/` | 3 files: validation patterns, wait patterns, README |
| `scripts/check-comment-hygiene.sh` | Comment hygiene scanner for OPENCODE files |
| `scripts/hooks/claude-posttooluse.sh` | Write-time comment hygiene warning hook (Claude Code) |
| `benchmark/` | Router benchmark data (8 subdirs + README) |
| `changelog/` | 6 version files: v3.0.0.0 through v3.3.1.0 |
| `manual_testing_playbook/` | 7 test scenarios + playbook README |

## 6. BOUNDARIES

- **`sk-doc`** owns documentation quality, markdown-only edits, content optimization. Docs-only edits to skill markdown (e.g., updating a SKILL.md headline, clarifying a README paragraph) route to `sk-doc` even when the file lives under `.opencode/skills/`.
- **`sk-git`** owns git workflow: commits, branches, PRs, worktrees, finish workflow.
- **`mcp-chrome-devtools`** owns pure browser inspection and DevTools orchestration.
- **`sk-code-review`** owns findings-first review format, severity model, and baseline security/quality/test review. `sk-code` owns surface detection and surface-specific standards evidence that `sk-code-review` consumes.
- **`system-spec-kit`** owns spec folder gates, validation, memory, and context preservation.
- `sk-code` does NOT own Go, Next.js, generic Node.js, React Native, or Swift routes — these stay UNKNOWN.

## 7. TROUBLESHOOTING & FAQ MATERIAL

**Common failure modes:**
1. **Router resolves UNKNOWN repeatedly** — markers absent from workspace (fresh clone without `node_modules` or `Webflow.push` strings), CWD outside workspace root, or task targets files outside both `.opencode/` and WEBFLOW marker scope. Fix: pass `[surface: <name>]` override or verify markers exist.
2. **Wrong surface loaded** — marker collision (e.g., `package.json` at root triggers JS detection in non-OPENCODE folder), changed files span both surfaces, or path detection picked wrong root. Fix: override with `[surface: <name>]`; if structural, refine SKILL.md §2 detection rules.
3. **Verification fails repeatedly** — surface-appropriate evidence skipped, wrong verification command run (e.g., `pytest` for JS file), or upstream issue. Fix: halt after 3 cycles, re-read §4 RULES, escalate to human.
4. **MOTION_DEV intent doesn't activate** — MOTION_DEV is an intent not a surface; generic "motion" or "animation" mentions don't trigger it. Fix: reference specific motion.dev API (`Motion.animate`, `Motion.timeline`, package import).

**User FAQ (2–4 actual questions):**
1. Why is sk-code the only skill I should edit when forking? — It's the surface-detection layer; other skills are codebase-agnostic so upstream pulls stay clean.
2. What's the difference between WEBFLOW, OPENCODE, and MOTION_DEV? — WEBFLOW/OPENCODE are primary surfaces (one per task); MOTION_DEV is an intent route that layers on top.
3. How does OPENCODE language sub-detection work? — File extensions and shebangs identify language, loading `references/opencode/<lang>/` for that language's standards.
4. Can I add a new surface? — Yes: add directory under `references/` and `assets/`, define markers, update `STACK_FOLDERS` and `RESOURCE_MAP`.

## 8. STALE FACTS

1. **Version**: README line 92 states version `3.3.0.0`; SKILL.md frontmatter line 5 states version `3.3.1.0`. The README is stale — current version is **3.3.1.0**.
2. **SKILL.md LOC count**: README line 92 and line 150 both claim SKILL.md is "252 LOC". Actual SKILL.md is **279 lines**. The README is stale.
3. **Surface count**: README line 92 says "3 surfaces (WEBFLOW, OPENCODE, MOTION_DEV)". SKILL.md §2 explicitly states three *supported* surfaces (WEBFLOW, OPENCODE, UNKNOWN) and clarifies MOTION_DEV is "a resource intent, not a third code surface." The README conflates MOTION_DEV as a surface; this is inaccurate per SKILL.md.
4. **Router pseudocode location**: README line 92 says "smart router pseudocode inline in SKILL.md §2 SMART ROUTING". SKILL.md §2 does contain inline pseudocode, but also references `references/smart_routing.md` as the "authoritative" full implementation. The README omits `references/smart_routing.md` as the primary routing logic file. Minor but potentially misleading.
5. **Webflow HTML quality_standards.md**: SKILL.md line 162 states "HTML carries `style_guide.md` only (Webflow Designer manages most HTML)." The actual `references/webflow/html/` directory contains **both** `style_guide.md` and `quality_standards.md`. SKILL.md itself is stale on this point, but since this report maps what the README should say, the README's table at line 100 doesn't mention HTML quality_standards.md either — both are incomplete vs. the real files.
6. **Missing directories from README structure tree**: The README's §4 STRUCTURE tree omits `scripts/` (containing `check-comment-hygiene.sh` and `hooks/claude-posttooluse.sh`), `benchmark/`, `changelog/`, and `manual_testing_playbook/` — all real top-level entries in the skill directory.
7. **Missing assets from README structure tree**: The README §4 tree omits `assets/webflow/checklists/`, `assets/webflow/patterns/`, `assets/webflow/integrations/`, `assets/universal/`, and `assets/webflow/templates/` beyond `component_template.{js,css}` — all exist on disk.