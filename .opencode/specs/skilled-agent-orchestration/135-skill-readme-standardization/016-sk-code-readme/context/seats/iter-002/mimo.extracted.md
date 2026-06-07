# sk-code Skill Verification Report

## 1. EXACT SURFACE DETECTION

**Supported surfaces (primary):** `WEBFLOW`, `OPENCODE`, `UNKNOWN` — as declared in `SKILL.md:114-118` and `description.json:65-68` (`supported_surfaces` array contains only `WEBFLOW` and `OPENCODE`).

**MOTION_DEV** is explicitly **not** a surface. It is a "resource intent, not a third code surface" (`SKILL.md:185`). The README correctly calls it an "intent route" but inconsistently counts it in the "3 surfaces" statistic (see §6).

**Detection markers** (`SKILL.md:76-80`):

```python
STACK_FOLDERS = {
    "WEBFLOW": ["src/2_javascript/", "*.webflow.js"],
    "OPENCODE": [".opencode/skills/", ".opencode/agents/", ".opencode/commands/", ".opencode/specs/"],
    "MOTION_DEV": ["references/motion_dev/", "assets/motion_dev/"],
}
```

**Extended WEBFLOW markers** beyond STACK_FOLDERS (`SKILL.md:98-103`): `Webflow.push`, `--vw-` CSS vars, `window.Motion`, `window.gsap`, GSAP/Lenis/HLS/Swiper/FilePond imports, `wrangler.toml`.

**OPENCODE marker**: CWD or any changed/target file under `.opencode/` (path-based, `SKILL.md:87-89`).

**Precedence rule** (`SKILL.md:71, 84-109`): Early-return / first-match. OPENCODE target/CWD wins over WEBFLOW markers. The explicit rationale (SKILL.md:112): `.opencode/skills/sk-doc/scripts/preview-server.js` may import animation libraries (Lenis, GSAP) for its preview UI, so a first-match-WEBFLOW rule would misroute OPENCODE work.

**Non-Webflow guard** (`SKILL.md:93-95`): Before WEBFLOW detection, a prompt-text grep for explicit negation phrases (`not webflow`, `no webflow designer`, `vanilla html/css/js only`, `stack-agnostic`) forces `UNKNOWN`.

**UNKNOWN fallback** (`SKILL.md:106-109`): When neither OPENCODE nor WEBFLOW markers match, surface is `UNKNOWN`. The router asks a short disambiguation question and does not pretend unsupported stacks are covered (`SKILL.md:222`).

---

## 2. CAPABILITY ROSTER

**Routing model** (`SKILL.md:12-14`): `Code surface detection → Intent classification → Surface resources → Verification evidence`.

**Phases** (`SKILL.md:37-43`):

| Phase | Name | Requirement |
|-------|------|-------------|
| 0 | Research | Optional, required for complex work |
| 1 | Implementation | Read actual files first |
| 1.5 | Code Quality Gate | P0/P1/P2 checks, required before claiming done |
| 2 | Debugging | Required when tests/runtime fail |
| 3 | Verification | Required before any done/works claim |

**Iron Law wording** — two versions in SKILL.md:
- Line 45: `"no completion claim without fresh verification evidence from the detected surface."`
- Line 140 (canonical, uppercase): `"NO COMPLETION CLAIMS WITHOUT RUNNING SURFACE-APPROPRIATE VERIFICATION."`

**Intent classification** (`SKILL.md:181`): 15 intents: `IMPLEMENTATION`, `CODE_QUALITY`, `DEBUGGING`, `VERIFICATION`, `TESTING`, `DEPLOYMENT`, `PERFORMANCE`, `ANIMATION`, `MOTION_DEV`, `FORMS`, `VIDEO`, `API`, `HOOKS`, `CONFIG`, `LANGUAGE_STANDARDS`. Top intent always loads; close second loads when within ambiguity threshold.

**Cross-skill authoring checklists** (`SKILL.md:53-62`):

| Target Path | Checklist | Recipe |
|---|---|---|
| `.opencode/skills/` | `assets/opencode/checklists/skill_authoring.md` | — |
| `.opencode/agents/` | `assets/opencode/checklists/agent_authoring.md` | — |
| `.opencode/commands/` | `assets/opencode/checklists/command_authoring.md` | — |
| `.opencode/specs/` | `assets/opencode/checklists/spec_folder_authoring.md` | `assets/opencode/recipes/spec_folder_write.md` |
| MCP server source | `assets/opencode/checklists/mcp_server_authoring.md` | — |

**Template customization contract** (`SKILL.md:20`): "This is the **only** skill end users should edit when adopting this template repo." Replace `references/{webflow,opencode,motion_dev}/` and `assets/{webflow,opencode,motion_dev}/` with your stack. Update `STACK_FOLDERS` + `RESOURCE_MAP`. Every other skill stays codebase-agnostic.

**OPENCODE language sub-detection** (`SKILL.md:146-154`): 5 languages — JAVASCRIPT, TYPESCRIPT, PYTHON, SHELL, CONFIG. Extension-first, then weighted keywords.

**Comment hygiene enforcement** (`SKILL.md:216`): `scripts/check-comment-hygiene.sh` per file, plus three automatic gates: `scripts/hooks/claude-posttooluse.sh` (write-time), `.opencode/hooks/pre-commit` (commit-time), `.github/workflows/comment-hygiene.yml` (CI).

**Review baseline contract** (`SKILL.md:48-49`): `sk-code-review` owns findings format, severity model, and baseline review. `sk-code` owns surface detection and surface-specific standards evidence.

---

## 3. KEY FILES

| Path | Role |
|------|------|
| `SKILL.md` | Surface-aware router contract: detection, phases, rules, integration points (279 lines) |
| `README.md` | User-facing documentation: overview, quick start, features, structure, troubleshooting, FAQ |
| `description.json` | Auto-discoverable metadata, version, keywords, trigger examples, supported surfaces |
| `graph-metadata.json` | Skill graph relationships |
| `references/stack_detection.md` | Surface detection markers and resolution chain details |
| `references/smart_routing.md` | Intent classification + resource loading + INTENT_MODEL + RESOURCE_MAP |
| `references/phase_detection.md` | Phase lifecycle detection contract |
| `references/universal/` | 4 files: `code_quality_standards.md`, `code_style_guide.md`, `error_recovery.md`, `multi_agent_research.md` |
| `references/webflow/` | 9 subdirs: `javascript/`, `css/`, `html/`, `shared/`, `implementation/`, `debugging/`, `verification/`, `performance/`, `deployment/` |
| `references/webflow/javascript/` | `style_guide.md`, `quality_standards.md`, `quick_reference.md` |
| `references/webflow/css/` | `style_guide.md`, `quality_standards.md`, `quick_reference.md`, `patterns.md` |
| `references/webflow/html/` | `style_guide.md`, `quality_standards.md` |
| `references/webflow/shared/` | `cross_language_rules.md`, `dev_workflow.md`, `enforcement.md` |
| `references/opencode/` | 6 subdirs: `javascript/`, `typescript/`, `python/`, `shell/`, `config/`, `shared/` |
| `references/motion_dev/` | 7 files: `animate_and_timelines.md`, `animation_principles.md`, `decision_matrix.md`, `integration_patterns.md`, `performance_and_pitfalls.md`, `quick_start.md`, `scroll_and_gestures.md` |
| `assets/opencode/checklists/` | 11 files: `skill_authoring.md`, `agent_authoring.md`, `command_authoring.md`, `spec_folder_authoring.md`, `mcp_server_authoring.md`, `universal_checklist.md`, `javascript_checklist.md`, `typescript_checklist.md`, `python_checklist.md`, `shell_checklist.md`, `config_checklist.md` |
| `assets/opencode/recipes/` | 1 file: `spec_folder_write.md` |
| `assets/webflow/scripts/` | `minify-webflow.mjs`, `verify-minification.mjs`, `test-minified-runtime.mjs`, `README.md` |
| `assets/webflow/checklists/` | Webflow-specific checklists |
| `assets/webflow/templates/` | `component_template.{js,css}` (per SKILL.md:162) |
| `assets/webflow/integrations/` | Webflow integration patterns |
| `assets/webflow/patterns/` | Webflow pattern references |
| `assets/motion_dev/` | `install_card.md`, `playbook_entries.md`, `snippets/` |
| `assets/universal/checklists/` | `debugging_checklist.md`, `verification_checklist.md` |
| `assets/universal/patterns/` | `validation_patterns.js`, `wait_patterns.js`, `README.md` |
| `assets/scripts/` | `verify_alignment_drift.py`, `test_verify_alignment_drift.py`, `README.md` |
| `scripts/check-comment-hygiene.sh` | Per-file comment-hygiene checker |
| `scripts/hooks/claude-posttooluse.sh` | Write-time warning hook (Claude Code) |
| `benchmark/` | 10 entries: `baseline/`, `after/`, `live/`, `live-final/`, `live-remediated/`, `d4r-live/`, `fixtures/`, `full/`, `router-final/`, `README.md` |
| `changelog/` | 6 version files: `v3.0.0.0.md` through `v3.3.1.0.md` |
| `manual_testing_playbook/` | 7 test suites + `manual_testing_playbook.md` |

---

## 4. WORKFLOWS & OUTPUTS

**Documented workflow phases** (`SKILL.md:37-43`):

1. **Phase 0: Research** — Understand unfamiliar code. Optional but required for complex work.
2. **Phase 1: Implementation** — Write/modify code using surface patterns. Must read files first.
3. **Phase 1.5: Code Quality Gate** — P0/P1/P2 checks and surface standards. Required before claiming done.
4. **Phase 2: Debugging** — Symptom → root cause, fix one cause at a time. Required on test/runtime failure.
5. **Phase 3: Verification** — Run surface verification commands, record evidence. Required before done/works claim.

**Phase detection step model** (`SKILL.md:124-138`):
- STEP 0: Detect surface from CWD + target files
- STEP 1: Detect language sub-key (OPENCODE only)
- STEP 2: Weighted intent scoring (top-2 when ambiguity delta is small)
- Phase 1/2/3 execution

**Verification commands per surface** (`SKILL.md:189-193`):

| Surface | Required Evidence |
|---|---|
| WEBFLOW | `node .opencode/skills/sk-code/assets/webflow/scripts/minify-webflow.mjs` + `verify-minification.mjs` + `test-minified-runtime.mjs` + desktop/mobile browser console clean evidence when runtime behavior changes |
| OPENCODE | `python3 .opencode/skills/sk-code/assets/scripts/verify_alignment_drift.py --root <changed-scope>` + targeted language/project tests (vitest, pytest, shellcheck, JSON validation, spec validation) |
| UNKNOWN | User-selected verification command set before completion claim |

**WEBFLOW workflow** (`SKILL.md:205-209`): Detect markers → load resources by intent → verify with build/min scripts + browser evidence → update CDN/versioning guidance after JS bundle changes.

**OPENCODE workflow** (`SKILL.md:212-218`): Detect `.opencode/` → detect language → load patterns/standards/checklists → run comment hygiene (`scripts/check-comment-hygiene.sh`) → run alignment verifier + targeted tests → use `sk-code-review` for formal findings.

**UNKNOWN workflow** (`SKILL.md:221-222`): Ask for runtime surface and required verification commands. Do not route generic Node.js, React Native, Swift, Go, or Next.js.

---

## 5. TROUBLESHOOTING & FAQ

### Failure Modes (from README §7)

**Mixed-marker precedence / Wrong surface loaded** (README:266-271): Cause — marker collision (e.g., `package.json` at root triggering JS detection, changed files span both surfaces). Fix — override with `[surface: <name>]`. Structural overlap → update SKILL.md §2 SMART ROUTING deliberately.

**Unknown surface** (README:255-261): Cause — markers absent (fresh clone, CWD outside workspace root, targets outside `.opencode/` and WEBFLOW scope). Fix — pass `[surface: <name>]` override, verify markers exist, or accept UNKNOWN is correct for polyglot repos.

**Verification evidence missing / Verification fails repeatedly** (README:275-281): Cause — evidence skipped (e.g., browser evidence not collected for WEBFLOW), wrong verification command, or upstream-only issue. Fix — halt loop, re-read SKILL.md §4 RULES, confirm every required command was run, escalate after 3 failed cycles.

**MOTION_DEV intent doesn't activate** (README:285-291): Cause — MOTION_DEV is an intent (not a surface), activates only when task touches motion.dev API specifically. Generic "motion" or "animation" mentions don't trigger it. Fix — reference a specific motion.dev API or import.

### Top User Questions (from README §8)

1. **Why is sk-code the only skill I should edit when forking?** — It's the surface-detection layer; other skills are codebase-agnostic. Editing them creates merge conflicts on upstream pulls; editing sk-code does not (your changes stay in `references/<surface>/` and `assets/<surface>/`).

2. **What's the difference between WEBFLOW, OPENCODE, and MOTION_DEV?** — WEBFLOW and OPENCODE are primary surfaces (exactly one selected per task). MOTION_DEV is an intent route layered on top when the task uses motion.dev API. Surfaces have full reference+asset trees and dictate verification; intents provide cross-stack guidance only.

3. **How does OPENCODE language sub-detection work?** — After OPENCODE selected, router inspects file extensions and shebangs. 5 languages (JS, TS, Python, Shell, JSON/JSONC) each have `references/opencode/<lang>/`. Multi-language scopes load multiple directories.

4. **Can I add a new surface?** — Yes. Add directories under `references/` and `assets/`, define detection markers, update `STACK_FOLDERS` and `RESOURCE_MAP` in SKILL.md §2.

5. **Why does the Iron Law forbid "should work" claims?** — Verification before completion eliminates credibility failures where AI claims success on unverified code. Surface-appropriate evidence must exist before any "done" claim.

**Difference from sk-code-review** (`SKILL.md:48-49`, README:106-114): `sk-code-review` owns findings format, severity model, and baseline security/quality/test review. `sk-code` owns surface detection and surface-specific standards evidence. They are complementary: `sk-code-review` for formal findings-first review; `sk-code` for implementation + verification evidence.

---

## 6. STALE FACTS IN CURRENT README

1. **Version mismatch**: README line 92 claims version `3.3.0.0`. SKILL.md frontmatter (line 5) declares `3.3.1.0`. The latest changelog is `changelog/v3.3.1.0.md`. `description.json` also says `3.3.0.0` (stale too).

2. **SKILL.md LOC count**: README lines 92 and 150 claim "252 LOC". Actual SKILL.md is **279 lines**. Both counts are stale.

3. **"3 surfaces" claim**: README line 23 and line 92 say "3 surfaces (WEBFLOW, OPENCODE, MOTION_DEV)". SKILL.md explicitly states MOTION_DEV is "a resource intent, not a third code surface" (line 185). `description.json:65-68` lists only 2 supported surfaces. The correct count is **2 surfaces** + 1 resource intent.

4. **Webflow HTML reference files**: README line 162 claims HTML carries "`style_guide.md` only (Webflow Designer manages most HTML)". Actual `references/webflow/html/` contains **both** `style_guide.md` **and** `quality_standards.md`. The "only" claim is stale.

5. **Intent count**: README line 82 says "four intents (implementation, debugging, quality, verification)". SKILL.md:181 defines **15 intents** (IMPLEMENTATION, CODE_QUALITY, DEBUGGING, VERIFICATION, TESTING, DEPLOYMENT, PERFORMANCE, ANIMATION, MOTION_DEV, FORMS, VIDEO, API, HOOKS, CONFIG, LANGUAGE_STANDARDS). The README conflates 4 phase categories with the full intent model.

6. **Verification phase numbering**: README line 276 refers to "Phase 4 (verification)". SKILL.md:43 numbers verification as **Phase 3**. The README's "Phase 4" is incorrect relative to the canonical numbering in SKILL.md.

7. **Structure tree omits directories**: README §4 structure tree (lines 148-180) omits `benchmark/`, `changelog/`, `manual_testing_playbook/`, `.opencode/` (nested skill), `scripts/hooks/`, `assets/webflow/checklists/`, `assets/webflow/integrations/`, `assets/webflow/patterns/`, `assets/opencode/checklists/` sub-items beyond the parent, and `assets/universal/` contents. While the tree may intentionally be abbreviated, these are real top-level and second-level entries not shown.