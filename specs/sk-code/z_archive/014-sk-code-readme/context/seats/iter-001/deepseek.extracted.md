Now let me verify deeper directory structures and some specific files the README references.
Now I have all the data. Here is the factual map:

---

## 1. PURPOSE

`sk-code` is the single code-work skill: a surface-aware smart router that detects whether the active code surface is WEBFLOW (frontend HTML/CSS/JS), OPENCODE (`.opencode/` system code), or UNKNOWN, then loads that surface's implementation, quality, debugging, and verification resources — and refuses completion claims without surface-appropriate verification evidence.

## 2. PROBLEM

A single repo can contain Webflow frontend code and OpenCode system code side by side, and the same libraries (GSAP, Lenis, Motion.dev) can appear in both contexts for completely different purposes. One generic "code" skill without surface detection would mis-route work to the wrong standards: it would apply frontend browser-verification rules to a Python MCP server, or apply Python testing conventions to a vanilla JS animation. The smart router solves this by using CWD and target-file paths as the primary routing key — `.opencode/` paths take precedence over Webflow markers precisely because system tools sometimes ship internal frontend libraries — so the skill always knows *where* the work lives before loading *which* standards. The Iron Law (no completion claim without surface-appropriate verification evidence) then guarantees that "done" means something concrete — a minified bundle that passes runtime tests, or an alignment-verifier exit 0 plus targeted test passes — rather than an unsupported-looking "looks good."

## 3. MODES & CAPABILITIES

- **Surface detection**: Resolves one of WEBFLOW, OPENCODE, or UNKNOWN from CWD and changed/target-file paths, using early-return precedence (OPENCODE wins over WEBFLOW).
- **Intent classification**: After surface detection, scores the task text across 15 intent classes (IMPLEMENTATION, CODE_QUALITY, DEBUGGING, VERIFICATION, TESTING, DEPLOYMENT, PERFORMANCE, ANIMATION, MOTION_DEV, FORMS, VIDEO, HOOKS, CONFIG, LANGUAGE_STANDARDS) and loads the top-1 plus a close runner-up.
- **Phase lifecycle**: Five gated phases — Phase 0 Research → Phase 1 Implementation → Phase 1.5 Code Quality Gate → Phase 2 Debugging → Phase 3 Verification — with Phase 1.5 gate required before declaring Phase 1 done.
- **Iron Law**: No completion claim is valid without fresh, surface-appropriate verification evidence (WEBFLOW: minify + verify-minification + test-minified-runtime + browser evidence; OPENCODE: `verify_alignment_drift.py` + targeted language tests; UNKNOWN: user-specified commands).
- **OPENCODE language sub-detection**: When the surface is OPENCODE, detects the language from file extensions (JavaScript, TypeScript, Python, Shell, CONFIG) and loads matching per-language standards.
- **Template-customization surface**: This is the only skill end users should edit when adopting the repo — replace `references/{webflow,opencode,motion_dev}/` and `assets/{webflow,opencode,motion_dev}/` with their own stack, keeping all other skills codebase-agnostic for clean upstream pulls.

## 4. INVOCATION

The skill is activated automatically by the Skill Advisor for any code-related prompt (implementation, debugging, verification, code quality). It is not invoked by the user directly; the router runs on activation.

**Surface detection** (CWD + target files, early-return precedence):
1. **OPENCODE**: CWD or any changed/target file under `.opencode/` — highest precedence.
2. **Explicit non-Webflow guard**: Prompt contains "NOT Webflow", "no Webflow Designer", "vanilla HTML/CSS/JS only", etc. → UNKNOWN.
3. **WEBFLOW**: `src/2_javascript/` directory exists, `*.webflow.js` files present, `Webflow.push` or `--vw-` strings, `window.Motion`/GSAP/Lenis/HLS/Swiper/FilePond imports, or `wrangler.toml` exists.
4. **UNKNOWN**: None of the above match — ask the user which surface and verification commands apply.

**Intent classification**: Weighted keyword scoring on the task text produces a top intent; a second intent loads when the score delta is ≤1. Doc-only prose signals (update headline, clarify description, add summary, improve readme) subtract from sk-code scoring and add to sk-doc scoring, even for files under `.opencode/skills/`.

**Verification commands by surface**:
| Surface | Verification evidence |
|---|---|
| WEBFLOW | `node .opencode/skills/sk-code/assets/webflow/scripts/minify-webflow.mjs` + `verify-minification.mjs` + `test-minified-runtime.mjs` + desktop/mobile browser console evidence |
| OPENCODE | `python3 .opencode/skills/sk-code/assets/scripts/verify_alignment_drift.py --root <changed-scope>` + targeted language tests (vitest, pytest, shellcheck, etc.) |
| UNKNOWN | User-supplied verification commands |

**NOT used** for: documentation-only markdown edits (→ `sk-doc`), git branching/committing/PRs (→ `sk-git`), pure browser inspection (→ `mcp-chrome-devtools`), or formal findings-first review output (→ `sk-code-review`). Docs-only edits to skill markdown route to `sk-doc` even when the file lives under `.opencode/skills/`.

## 5. KEY FILES

| Path | Purpose |
|---|---|
| `.opencode/skills/sk-code/SKILL.md` | Surface-aware router contract — detection pseudocode, phase lifecycle, resource domains, rules, integration points |
| `.opencode/skills/sk-code/README.md` | User-facing documentation (being rewritten) |
| `.opencode/skills/sk-code/description.json` | Machine-readable skill description, surface list, keywords, trigger examples |
| `.opencode/skills/sk-code/graph-metadata.json` | Skill graph relationship metadata |
| `.opencode/skills/sk-code/references/stack_detection.md` | Surface detection markers, precedence rules, OPENCODE language sub-detection table, test cases |
| `.opencode/skills/sk-code/references/smart_routing.md` | Intent model, RESOURCE_MAP, load tiers, per-surface resource maps (WEBFLOW, MOTION_DEV, OPENCODE), verification commands, UNKNOWN fallback |
| `.opencode/skills/sk-code/references/phase_detection.md` | Phase 0→1→1.5→2→3 lifecycle, per-surface phase resources, transitions, Iron Laws |
| `.opencode/skills/sk-code/references/universal/` | Surface-agnostic code quality, style guide, error recovery, multi-agent research (4 files) |
| `.opencode/skills/sk-code/references/webflow/` | Webflow/frontend per-language (javascript/, css/, html/), shared (cross_language_rules, dev_workflow, enforcement), implementation (11 files), debugging, verification, performance, deployment |
| `.opencode/skills/sk-code/references/opencode/` | OpenCode system-code per-language (javascript/, typescript/, python/, shell/, config/), shared (universal_patterns, code_organization, hooks, alignment_verification_automation) |
| `.opencode/skills/sk-code/references/motion_dev/` | Cross-stack Motion.dev API, timelines, scroll/gesture, integration, performance, decision matrix, quick start (7 files) |
| `.opencode/skills/sk-code/assets/webflow/scripts/` | `minify-webflow.mjs`, `verify-minification.mjs`, `test-minified-runtime.mjs` — Webflow verification |
| `.opencode/skills/sk-code/assets/webflow/checklists/` | code_quality, debugging, performance_loading, verification checklists |
| `.opencode/skills/sk-code/assets/webflow/templates/` | Component templates (JS, CSS, HTML scaffolds) |
| `.opencode/skills/sk-code/assets/webflow/integrations/` | HLS and Lenis integration patterns |
| `.opencode/skills/sk-code/assets/webflow/patterns/` | Interaction gate, performance, validation, wait patterns |
| `.opencode/skills/sk-code/assets/opencode/checklists/` | 11 authoring + language checklists (universal, skill, agent, command, MCP server, spec_folder, javascript, typescript, python, shell, config) |
| `.opencode/skills/sk-code/assets/opencode/recipes/` | `spec_folder_write.md` recipe |
| `.opencode/skills/sk-code/assets/motion_dev/` | Install card, playbook entries, snippets/ (11 reusable Motion.js snippet files) |
| `.opencode/skills/sk-code/assets/universal/` | Universal debugging/verification checklists, validation/wait patterns |
| `.opencode/skills/sk-code/assets/scripts/` | `verify_alignment_drift.py`, `test_verify_alignment_drift.py` — OpenCode alignment verification |
| `.opencode/skills/sk-code/scripts/check-comment-hygiene.sh` | Comment hygiene enforcement (pre-commit gate) |
| `.opencode/skills/sk-code/scripts/hooks/claude-posttooluse.sh` | Write-time comment hygiene warning for Claude Code |
| `.opencode/skills/sk-code/benchmark/` | Router benchmark fixtures and results (10 subdirs) |
| `.opencode/skills/sk-code/changelog/` | Version changelogs (v3.0.0.0 through v3.3.1.0) |
| `.opencode/skills/sk-code/manual_testing_playbook/` | 7 numbered test-playbook directories + readme |

## 6. BOUNDARIES

`sk-code` does **NOT** own:

- **Documentation quality** — owned by `sk-doc`. Docs-only edits to skill markdown route to `sk-doc` even when the file lives under `.opencode/skills/`. Prose-only changes (update headline, clarify description, add summary, improve readme) subtract from sk-code intent scoring and add to sk-doc.
- **Git workflow** — owned by `sk-git` (branching, committing, PR creation, worktree setup, finish workflow).
- **Pure browser inspection** — owned by `mcp-chrome-devtools`. `sk-code` only specifies that browser evidence is required for Webflow verification; it does not perform the browser inspection itself.
- **Findings-first formal review output** — owned by `sk-code-review`. `sk-code` supplies surface-specific standards evidence that `sk-code-review` consumes; `sk-code-review` owns the findings format, severity model, and baseline security/quality/test review.
- **Spec folder lifecycle and Gate 3** — owned by `system-spec-kit`.
- **Unsupported stacks** — Go, Next.js, React Native, generic Node.js outside `.opencode/` are not owned; the router returns UNKNOWN rather than guessing.
- **Code graph indexing** — owned by `system-code-graph`.

## 7. TROUBLESHOOTING & FAQ MATERIAL

### Common failure modes and gotchas

1. **Router resolves to UNKNOWN repeatedly**: Markers absent from the workspace (fresh clone without node_modules or Webflow.push strings), CWD outside the workspace root, or task targets files outside both `.opencode/` and Webflow marker scope. Fix: pass `[surface: <name>]` prefix to override.

2. **Wrong surface loaded (WEBFLOW vs OPENCODE)**: Marker collision in mixed-marker workspaces — e.g., a `package.json` exists at root but the task targets `.opencode/` files. The OPENCODE precedence rule (target path over Webflow markers) prevents this, but when detection picks the wrong root due to CWD, override with `[surface: <name>]`.

3. **MOTION_DEV intent doesn't activate**: MOTION_DEV is an intent route, not a surface — it activates only after WEBFLOW/OPENCODE is selected and the prompt mentions specific Motion.dev API names (`Motion.animate`, `Motion.timeline`, package import). Generic "animation" or "motion" mentions don't trigger it.

4. **Verification skipped or wrong command run**: Phase 3 evidence omitted (e.g., browser evidence not collected for Webflow), or wrong verification command used (e.g., `pytest` for an OPENCODE JavaScript file). The Iron Law forbids completion claims without verification evidence.

5. **Explicit non-Webflow guard blocking valid work**: A prompt says "no Webflow" and triggers the UNKNOWN guard even when the user meant they don't use Webflow Designer but still want Webflow-compatible vanilla JS. The guard is designed conservatively; clarify with the user or override with `[surface: webflow]`.

### Frequently asked questions

1. **Why is sk-code the only skill I should edit when forking?** — It owns the surface-detection layer; your stack lives in `references/<surface>/` and `assets/<surface>/`. Other skills are codebase-agnostic to keep upstream pulls clean.

2. **What's the difference between WEBFLOW, OPENCODE, and MOTION_DEV?** — WEBFLOW and OPENCODE are primary surfaces (exactly one per task). MOTION_DEV is an intent route that layers on top of the selected surface, providing cross-stack Motion.dev API guidance. Surfaces dictate verification commands; intents are narrower.

3. **How does OPENCODE language sub-detection work?** — After OPENCODE surface is selected, file extensions determine the language; multi-language change scopes load multiple language directories.

4. **Why does the Iron Law forbid "should work" claims?** — Verification before completion distinguishes confident code from plausible-looking code. The AI must produce surface-appropriate evidence before claiming success.

## 8. STALE FACTS

The following items in the current `README.md` are inaccurate versus `SKILL.md` and the real files:

1. **Version**: README §3.2 claims version `3.3.0.0` (and `description.json` also carries `3.3.0.0`). SKILL.md frontmatter declares `version: 3.3.1.0`. The changelog directory contains `v3.3.1.0.md`, confirming 3.3.1.0 is the actual current version.

2. **SKILL.md LOC**: README §3.2 and §4 claim `252 LOC`. The actual SKILL.md file is 279 lines.

3. **MOTION_DEV elevated to a surface**: README §1 OVERVIEW, §3.1, §3.2, §3.3 (Surface Detection Catalog table), §3.3 (Verification Per Surface table), §3.3 (How This Compares table), §5 CONFIGURATION (surface override), and §2 Quick Start all treat MOTION_DEV as a third primary surface alongside WEBFLOW and OPENCODE. SKILL.md §2 is explicit: "MOTION_DEV is a resource intent, not a third code surface" (line 185). The supported surfaces are WEBFLOW, OPENCODE, and UNKNOWN. The `description.json` `supported_surfaces` array (`["WEBFLOW", "OPENCODE"]`) confirms only two surfaces exist.

4. **"Phase 4" mentioned**: README §7 troubleshooting says "Phase 4 (verification)" (line 277). The actual phase lifecycle defined in SKILL.md §1 and `references/phase_detection.md` is: Phase 0 Research → Phase 1 Implementation → Phase 1.5 Code Quality Gate → Phase 2 Debugging → Phase 3 Verification. There is no "Phase 4."

5. **"Forbidden phrases" in §5**: README §5 CONFIGURATION claims "The skill carries forbidden phrases (should work, looks good, seems fine) that the AI must not emit before per-surface verification has run cleanly." This specific list of forbidden phrases does not appear in SKILL.md, `references/smart_routing.md`, or `references/phase_detection.md`. The Iron Law concept is present but not this exact phrase-list.

6. **"3 surfaces" claim in How This Compares table**: README §3.3 table line says "Surface auto-detection: Yes (3 surfaces)". Per SKILL.md, there are 2 supported surfaces (WEBFLOW, OPENCODE) plus the UNKNOWN fallback and the MOTION_DEV intent — not 3 surfaces.

7. **Structure diagram omissions**: README §4 structure diagram omits the root-level `scripts/` directory (containing `check-comment-hygiene.sh` and `hooks/claude-posttooluse.sh`), and omits the `benchmark/`, `changelog/`, and `manual_testing_playbook/` directories. It also shows `assets/opencode/checklists/` but omits `assets/opencode/recipes/spec_folder_write.md`. It omits the sub-subdirectories `assets/webflow/checklists/`, `assets/webflow/integrations/`, `assets/webflow/patterns/`, and `assets/webflow/templates/`.