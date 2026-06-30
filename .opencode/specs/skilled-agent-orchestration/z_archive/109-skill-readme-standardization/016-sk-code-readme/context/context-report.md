# Context Report: sk-code README rewrite

Two-iteration by-model sweep (DeepSeek v4 Pro + MiMo v2.5 Pro, read-only). Both iterations converge with cited file:line evidence on the surface-router model, the phases, the Iron Law and the template-customization role. Both independently found the same critical stale fact: the current README treats MOTION_DEV as a third surface, but it is a cross-stack resource intent, not a surface.

---

## 1. PURPOSE

`sk-code` is the single code-work skill. It detects the active code surface, classifies the intent, loads that surface's implementation, quality, debugging and verification resources, and enforces the Iron Law that no completion claim ships without fresh verification evidence from the detected surface.

## 2. PROBLEM

One generic code skill cannot serve a Webflow frontend and an OpenCode system with the same standards, build steps and verification commands, so a single checklist either over-generalizes or fits only one stack. Hand-maintaining a separate skill per stack is worse, because every shared improvement has to be copied across all of them. Worst of all, without an enforced verification step an agent claims done after writing code it never ran. This skill detects which surface is in front of it, loads that surface's resources, and refuses to claim completion until the surface's own verification commands have produced fresh evidence.

## 3. THE ROUTING MODEL

The router runs two axes in order: `surface detection -> intent classification -> surface resources -> verification evidence` (`SKILL.md:14`).

- Surface detection: there are two real surfaces plus a fallback. WEBFLOW is Webflow and vanilla frontend work (HTML, CSS, JavaScript, plus animation libraries). OPENCODE is system work under `.opencode/` (skills, agents, commands, MCP servers, hooks, scripts, tests, JSON, TypeScript, JavaScript, Python, Shell). UNKNOWN is the fallback when neither matches, where the router asks for the surface rather than guessing. OPENCODE wins precedence over WEBFLOW, because `.opencode/` tools sometimes ship frontend animation libraries internally and a first-match-WEBFLOW rule would misroute system work.
- MOTION_DEV is NOT a surface. It is a cross-stack resource intent that supplements WEBFLOW or OPENCODE when the task touches the Motion.dev API. It never replaces surface detection.
- Intent classification then selects the right resource set (implementation, code quality, debugging, verification, testing, deployment, performance, animation, forms, config, and more), loading the top intent plus a close second when the scores are near.

## 4. PHASES & THE IRON LAW (verified)

The phase lifecycle is gated (`SKILL.md:37-45`, `references/phase_detection.md`): Phase 0 Research (optional, for unfamiliar or risky work), Phase 1 Implementation (read the real files first), Phase 1.5 Code Quality Gate (P0/P1/P2 checks and surface standards, required before claiming implementation done), Phase 2 Debugging (trace one root cause at a time when tests or runtime fail), Phase 3 Verification (run the surface verification commands and record evidence). The Iron Law (`SKILL.md:45`): no completion claim without fresh verification evidence from the detected surface.

## 5. INVOCATION & VERIFICATION (verified)

Detection is context-aware from CWD plus changed and target files. The OPENCODE workflow adds a Phase 1.5 comment-hygiene gate: `bash .opencode/skills/sk-code/scripts/check-comment-hygiene.sh <file>` with zero violations required before commit. Verification commands per surface:

- WEBFLOW: the minify, verify-minification and test-minified-runtime scripts under `assets/webflow/scripts/`, plus clean desktop and mobile browser console evidence when runtime changes.
- OPENCODE: `python3 .opencode/skills/sk-code/assets/scripts/verify_alignment_drift.py --root <scope>` plus targeted language and project tests (vitest, pytest, shellcheck, JSON and spec validation).
- UNKNOWN: the user-selected verification command set, confirmed before any completion claim.

When called from `/speckit:complete` with an `.opencode/` target, sk-code surfaces the matching authoring checklist (skill, agent, command, spec folder, MCP server) at write-time, plus the spec-folder-write recipe.

## 6. TEMPLATE CUSTOMIZATION (distinctive)

sk-code is the only skill end users edit when adopting this template repo for their own stack (`SKILL.md:20`). You replace the shipped `references/{webflow,opencode,motion_dev}/` and `assets/{webflow,opencode,motion_dev}/` trees with your stack's resources and update the surface markers and resource map. Every other skill stays codebase-agnostic so upstream pulls stay clean. Your changes live in `references/<surface>/` and `assets/<surface>/`, so they do not collide on a pull.

## 7. KEY FILES (real, host-verified)

| Path | Role |
|------|------|
| `SKILL.md` | The surface-aware router contract, the phases, the Iron Law and the rules |
| `references/stack_detection.md` | Surface markers and the resolution chain |
| `references/smart_routing.md` | Intent classification, the resource map, load tiers and verification commands |
| `references/phase_detection.md` | The gated phase lifecycle |
| `references/universal/` | Surface-agnostic quality, style, error-recovery and research references |
| `references/webflow/` | The Webflow surface: per-language, implementation, debugging, verification, performance, deployment |
| `references/opencode/` | The OpenCode surface: per-language standards, shared patterns, hooks |
| `references/motion_dev/` | Cross-stack Motion.dev reference (quick start, principles, timelines, scroll, performance, integration, decision matrix) |
| `assets/webflow/` | Webflow scripts, checklists, templates, integrations and patterns |
| `assets/opencode/` | OpenCode authoring checklists and the spec-folder-write recipe |
| `assets/motion_dev/` | Motion.dev install card, playbook entries and snippets |
| `assets/scripts/verify_alignment_drift.py` | The OpenCode alignment-drift verifier |
| `scripts/check-comment-hygiene.sh` | The Phase 1.5 comment-hygiene enforcement script |

## 8. BOUNDARIES

sk-code owns surface detection and surface-specific standards plus verification. It does not own findings-first review output (`sk-code-review`, which owns the findings format and severity model and consumes sk-code's surface evidence), documentation (`sk-doc`, which owns markdown even under `.opencode/skills/`), git workflow (`sk-git`) or pure browser inspection (`mcp-chrome-devtools`). A docs-only edit to a SKILL.md headline routes to sk-doc, not sk-code, because it changes prose, not executable behavior.

## 9. TROUBLESHOOTING & FAQ MATERIAL

- Router resolves to UNKNOWN: markers are absent or the CWD is outside the workspace. Pass a `[surface: <name>]` override or confirm the markers exist.
- Wrong surface loaded: a marker collision. Use the override or refine detection. Remember OPENCODE wins over WEBFLOW by design.
- Verification fails repeatedly: re-read the surface rules, confirm every required command ran, escalate after three cycles.
- MOTION_DEV resources do not activate: the task used generic "animation" wording. Reference a specific Motion.dev API.
- FAQ: how sk-code differs from sk-code-review (surface evidence versus findings review), what surfaces are supported (two plus UNKNOWN, MOTION_DEV is a resource intent), how to add a surface (the template-customization workflow), and why OPENCODE wins precedence.

## 10. STALE FACTS

The narrative template drops version lines and brittle counts, so the drift resolves on rewrite:

- MOTION_DEV as a surface: the README calls it a third surface and a valid surface-override value. It is a cross-stack resource intent, not a surface. The supported surfaces are WEBFLOW, OPENCODE and the UNKNOWN fallback. This is the most important correction.
- Version: the README says 3.3.0.0, SKILL.md says 3.3.1.0. Drop the version line.
- LOC: the README says 252, the file is now larger. Do not cite a line count.
- Lifecycle: the README describes a four-step lifecycle, conflating the routing model with the phases. The phase model has five gated phases. Describe them as distinct.
- Intent count: the README says four intents, the real model has many more. Describe the intent routing rather than pinning a count.

## 11. METHODOLOGY

Two iterations, by-model-shared-scope (DeepSeek + MiMo, read-only). Iteration 1 gathered purpose, the routing model and the phases; iteration 2 verified the surface detection, the Iron Law, the verification commands and the stale facts, each cited to a file and line. Both models independently found that MOTION_DEV is not a surface and that the README miscounts surfaces and phases. Converged before the three-iteration ceiling.
