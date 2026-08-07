Let me verify the deeper subfolder structures and key files referenced in the README.
Let me verify a few remaining items: the SKILL.md version, the check-comment-hygiene script, and the description.json/graph-metadata.json files.
Now I have all the data. Here is the report:

---

## 1. EXACT SURFACE DETECTION

**Surfaces and detection markers** (from `.opencode/skills/sk-code/SKILL.md:76-80` / `references/stack_detection.md:18-45`):

```python
STACK_FOLDERS = {
    "WEBFLOW": ["src/2_javascript/", "*.webflow.js"],
    "OPENCODE": [".opencode/skills/", ".opencode/agents/", ".opencode/commands/", ".opencode/specs/"],
    "MOTION_DEV": ["references/motion_dev/", "assets/motion_dev/"],
}
```

**Bash detection pseudocode** (`.opencode/skills/sk-code/SKILL.md:83-110` / `references/stack_detection.md:32-46`):
1. **OPENCODE** (highest precedence): `CWD` under `.opencode/` OR any changed/target file under `.opencode/`
2. **Explicit non-Webflow guard**: prompt contains `not webflow|no webflow designer|without webflow|non-webflow|vanilla html/css/js only|stack-agnostic` → `UNKNOWN`
3. **WEBFLOW**: `src/2_javascript/` exists, `*.webflow.js` files, `Webflow.push`/`--vw-` in `src/**/*.{js,css,html}`, `window.Motion|window.gsap|gsap\.(to|from|set|timeline|registerPlugin)|new Lenis|new Hls|new Swiper|FilePond` in source JavaScript, or `wrangler.toml` exists
4. **UNKNOWN**: none of the above

**Precedence rule** (`.opencode/skills/sk-code/SKILL.md:71`): "OPENCODE target/CWD wins over WEBFLOW markers (because mixed-marker workspaces are common — `.opencode/` system tools sometimes ship frontend animation libraries internally)."

**Supported surfaces** (`.opencode/skills/sk-code/SKILL.md:115-118`): `WEBFLOW`, `OPENCODE`, `UNKNOWN`. MOTION_DEV is **not** a surface — it is a "peer resource category" loaded after surface detection (`.opencode/skills/sk-code/references/stack_detection.md:24`, `.opencode/skills/sk-code/references/smart_routing.md:27`).

**Detection is CWD + changed/target files driven** (`.opencode/skills/sk-code/SKILL.md:71`): "Detection is context-aware and uses CWD plus changed/target files."

---

## 2. CAPABILITY ROSTER

**Routing model** (`.opencode/skills/sk-code/SKILL.md:14`): "`Code surface detection -> Intent classification -> Surface resources -> Verification evidence`." Two-stage: surface-first, intent-second.

**Phases** (`.opencode/skills/sk-code/SKILL.md:37-43`):

| Phase | Purpose | Requirement |
|---|---|---|
| Phase 0: Research | Understand unfamiliar code or risky changes | Optional, required for complex work |
| Phase 1: Implementation | Write or modify code using surface patterns | Read actual files first |
| Phase 1.5: Code Quality Gate | Apply P0/P1/P2 checks and surface standards | Required before claiming implementation done |
| Phase 2: Debugging | Trace symptom to root cause and fix one cause at a time | Required when tests/runtime fail |
| Phase 3: Verification | Run surface verification commands and record evidence | Required before any done/works claim |

**P0/P1/P2 checks**: Referenced in `.opencode/skills/sk-code/SKILL.md:40` as "Apply P0/P1/P2 checks and surface standards." Detailed in `references/universal/code_quality_standards.md` and the per-surface quality standards.

**Iron Law wording** (`.opencode/skills/sk-code/SKILL.md:45`): "**Iron Law**: no completion claim without fresh verification evidence from the detected surface." Expanded at line 140: "NO COMPLETION CLAIMS WITHOUT RUNNING SURFACE-APPROPRIATE VERIFICATION."

**Authoring checklists for `.opencode/` targets** (`.opencode/skills/sk-code/SKILL.md:55-61`):

| Target Path | Authoring Checklist |
|---|---|
| `.opencode/skills/` | `assets/opencode/checklists/skill_authoring.md` |
| `.opencode/agents/` | `assets/opencode/checklists/agent_authoring.md` |
| `.opencode/commands/` | `assets/opencode/checklists/command_authoring.md` |
| `.opencode/specs/` | `assets/opencode/checklists/spec_folder_authoring.md` + recipe `assets/opencode/recipes/spec_folder_write.md` |
| MCP server source | `assets/opencode/checklists/mcp_server_authoring.md` |

**Template-customization contract** (`.opencode/skills/sk-code/SKILL.md:20`): "This is the **only** skill end users should edit when adopting this template repo for their own project. Replace the shipped `references/{webflow,opencode,motion_dev}/` and `assets/{webflow,opencode,motion_dev}/` trees with your stack's references and assets. Update `STACK_FOLDERS` (§2) + `RESOURCE_MAP` to match."

---

## 3. KEY FILES

| Path | Role |
|---|---|
| `.opencode/skills/sk-code/SKILL.md` | Surface-aware router contract (279 LOC, version 3.3.1.0) |
| `.opencode/skills/sk-code/README.md` | Human-facing overview |
| `.opencode/skills/sk-code/description.json` | Auto-discoverable metadata |
| `.opencode/skills/sk-code/graph-metadata.json` | Skill graph relationships |
| `references/stack_detection.md` | Surface detection markers and resolution chain |
| `references/smart_routing.md` | Intent classification, RESOURCE_MAP, load tiers, verification commands |
| `references/phase_detection.md` | Phase lifecycle (0→1→1.5→2→3→done) |
| `references/universal/` (4 files) | Surface-agnostic: `code_quality_standards.md`, `code_style_guide.md`, `error_recovery.md`, `multi_agent_research.md` |
| `references/webflow/` (9 subdirs, 35 files) | Per-language (`css/`, `html/`, `javascript/`), shared (`cross_language_rules.md`, `dev_workflow.md`, `enforcement.md`), topical (`implementation/` 11 files, `debugging/` 2 files, `verification/` 2, `performance/` 5, `deployment/` 3) |
| `references/opencode/` (6 subdirs, 19 files) | Per-language (`javascript/`, `typescript/`, `python/`, `shell/`, `config/` each with style_guide/quality_standards/quick_reference), shared (`universal_patterns.md`, `code_organization.md`, `alignment_verification_automation.md`, `hooks.md`) |
| `references/motion_dev/` (7 files) | `quick_start.md`, `animation_principles.md`, `animate_and_timelines.md`, `scroll_and_gestures.md`, `performance_and_pitfalls.md`, `integration_patterns.md`, `decision_matrix.md` |
| `assets/webflow/scripts/` (4 files) | `minify-webflow.mjs`, `verify-minification.mjs`, `test-minified-runtime.mjs`, `README.md` |
| `assets/webflow/checklists/` (4 files) | `code_quality_checklist.md`, `debugging_checklist.md`, `verification_checklist.md`, `performance_loading_checklist.md` |
| `assets/webflow/templates/` (6 files) | `component_template.css`, `component_template.js`, `embed_template.html`, `form_scaffold_template.html`, `head_footer_code_template.html`, `README.md` |
| `assets/webflow/integrations/` (3 files) | `hls_patterns.js`, `lenis_patterns.js`, `README.md` |
| `assets/webflow/patterns/` (5 files) | `interaction_gate_patterns.js`, `performance_patterns.js`, `validation_patterns.js`, `wait_patterns.js`, `README.md` |
| `assets/opencode/checklists/` (11 files) | `universal_checklist.md`, per-language `*_checklist.md` (JS/TSC/Python/Shell/Config), authoring: `skill_authoring.md`, `agent_authoring.md`, `command_authoring.md`, `mcp_server_authoring.md`, `spec_folder_authoring.md` |
| `assets/opencode/recipes/` (1 file) | `spec_folder_write.md` |
| `assets/motion_dev/` (3 entries) | `install_card.md`, `playbook_entries.md`, `snippets/` (11 `.js` snippet files + `README.md`) |
| `assets/scripts/` (3 files) | `verify_alignment_drift.py`, `test_verify_alignment_drift.py`, `README.md` |
| `assets/universal/checklists/` (2 files) | `debugging_checklist.md`, `verification_checklist.md` |
| `assets/universal/patterns/` (3 files) | `README.md`, `validation_patterns.js`, `wait_patterns.js` |
| `scripts/check-comment-hygiene.sh` | OpenCode comment-hygiene enforcement script (Phase 1.5) |
| Benchmark | `.opencode/skills/deep-improvement/scripts/skill-benchmark/tests/sk-code-router-sync.vitest.ts` — drift guard for `RESOURCE_MAP` ↔ disk sync |

---

## 4. WORKFLOWS & OUTPUTS

**Phase lifecycle** (`.opencode/skills/sk-code/references/phase_detection.md:38-44`):
```
Phase 0 Research → Phase 1 Implementation → Phase 1.5 Code Quality Gate
  → Phase 2 Debugging (if checks fail) → Phase 3 Verification → done only with evidence
```

**Workflow summaries** (`.opencode/skills/sk-code/SKILL.md:203-218`):
- **WEBFLOW**: detect markers → load Webflow resources by intent → Phase 1.5 quality → verify with build/minification scripts + browser evidence → update CDN/versioning guidance
- **OPENCODE**: detect `.opencode/` context → detect language → load shared patterns + language standards + checklists → **Phase 1.5 comment hygiene**: run `./scripts/check-comment-hygiene.sh <file>` (zero violations required) → alignment verifier + targeted tests
- **UNKNOWN**: ask for surface + verification commands

**Verification commands per surface** (`.opencode/skills/sk-code/SKILL.md:189-193` / `references/smart_routing.md:229-233`):

| Surface | Command(s) |
|---|---|
| WEBFLOW | `node .opencode/skills/sk-code/assets/webflow/scripts/minify-webflow.mjs` + `node .opencode/skills/sk-code/assets/webflow/scripts/verify-minification.mjs` + `node .opencode/skills/sk-code/assets/webflow/scripts/test-minified-runtime.mjs` + desktop/mobile browser console clean evidence (when runtime changes) |
| OPENCODE | `python3 .opencode/skills/sk-code/assets/scripts/verify_alignment_drift.py --root <changed-scope>` + targeted language/project tests (vitest, pytest, shellcheck, JSON validation, spec validation) |
| UNKNOWN | User-selected verification command set |

**Phase 1.5 comment hygiene extra** (`.opencode/skills/sk-code/SKILL.md:216`): "Run `.opencode/skills/sk-code/scripts/check-comment-hygiene.sh <file>` on each modified file before committing. Zero violations required."

---

## 5. TROUBLESHOOTING & FAQ

**Concrete failure modes** (from `.opencode/skills/sk-code/README.md:253-292`):

1. **Router resolves to UNKNOWN repeatedly** — Caused by absent markers, CWD outside workspace root, or target files outside known scopes. Fix: `[surface: <name>]` override or verify markers exist.
2. **Wrong surface loaded** — Caused by marker collision (e.g., root `package.json` or changed files spanning both surfaces). Fix: `[surface: <name>]` override or refine detection rules.
3. **Verification fails repeatedly** — Caused by skipped browser evidence, wrong verification command for language, or upstream dependency issue. Fix: re-read surface rules, confirm all required commands run; escalate after 3 failed cycles.
4. **MOTION_DEV intent doesn't activate** — Caused by generic "motion"/"animation" terms without specific Motion.dev API references. Fix: use specific Motion API names (`Motion.animate`, `Motion.timeline`).
5. **Mixed-marker precedence** — A `.opencode/` file (e.g., `sk-doc/scripts/preview-server.js`) using Lenis/GSAP internally is correctly routed to OPENCODE, not WEBFLOW, because OPENCODE target/CWD takes precedence (`.opencode/skills/sk-code/SKILL.md:112`).

**Likeliest user questions with grounded answers:**

**Q: How does sk-code differ from sk-code-review?**
A: `sk-code-review` owns findings-first review: findings format, severity model (P0/P1/P2), and baseline security/quality/test review. `sk-code` owns surface detection and surface-specific standards evidence. They pair: `sk-code-review` does the baseline review, `sk-code` supplies the surface-specific evidence overlay. (`.opencode/skills/sk-code/SKILL.md:49`: "sk-code-review owns findings format, severity model, and baseline security/quality/test review. sk-code owns surface detection and surface-specific standards evidence.")

**Q: What surfaces does sk-code support?**
A: Two primary surfaces: WEBFLOW (frontend HTML/CSS/JS, Webflow conventions, animation libraries) and OPENCODE (`.opencode/` system code). MOTION_DEV is not a surface — it's an intent/resource category loaded after surface detection for cross-stack Motion.dev guidance. UNKNOWN is the fallback when neither matches. (`.opencode/skills/sk-code/SKILL.md:115-118`)

**Q: Can I add a new surface?**
A: Yes — that's the template customization workflow. Add a directory under `references/` and `assets/`, define detection markers, update `STACK_FOLDERS` and `RESOURCE_MAP` in SKILL.md §2. This is the **only** skill end users should edit. (`.opencode/skills/sk-code/SKILL.md:20`, `.opencode/skills/sk-code/README.md:309-311`)

**Q: Why does OPENCODE win precedence over WEBFLOW?**
A: `.opencode/` system tools (e.g. preview servers in `sk-doc/scripts/`) may import animation libraries internally. A first-match-WEBFLOW order would route this OPENCODE work to wrong standards. The target/CWD path is the strongest unambiguous signal. (`.opencode/skills/sk-code/SKILL.md:112`)

**Q: Is MOTION_DEV a third surface?**
A: No. It is an "intent route" / "peer resource category" that supplements WEBFLOW or OPENCODE when the task touches Motion.dev API. It never replaces or bypasses surface detection. (`.opencode/skills/sk-code/references/stack_detection.md:24`, `.opencode/skills/sk-code/references/smart_routing.md:27`)

---

## 6. STALE FACTS IN CURRENT README

1. **Version**: README §3.2 claims `version 3.3.0.0`. SKILL.md frontmatter line 5 says `version: 3.3.1.0`.

2. **LOC**: README §3.2 and §4 STRUCTURE tree comment claim `252 LOC`. Actual `wc -l` of SKILL.md is **279**.

3. **MOTION_DEV claimed as a surface**: README §1 describes MOTION_DEV as a primary surface ("the supported shipped surfaces are WEBFLOW... OPENCODE... and MOTION_DEV"). README §3.2 states "3 surfaces (WEBFLOW, OPENCODE, MOTION_DEV)". SKILL.md §2 lists only WEBFLOW, OPENCODE, UNKNOWN as supported surfaces. All reference docs (`stack_detection.md`, `smart_routing.md`) consistently state MOTION_DEV is an "intent route" / "peer resource category," never a surface.

4. **Intent count**: README §3.1 says "The four intents (implementation, debugging, quality, verification)." The actual intent model in `smart_routing.md` §2 and the `RESOURCE_MAP` contains **15 intents** (IMPLEMENTATION, CODE_QUALITY, DEBUGGING, VERIFICATION, TESTING, DEPLOYMENT, PERFORMANCE, ANIMATION, MOTION_DEV, FORMS, VIDEO, HOOKS, CONFIG, LANGUAGE_STANDARDS).

5. **Surface override accepted values**: README §5 says surface override accepts "WEBFLOW, OPENCODE, or MOTION_DEV." Since MOTION_DEV is not a supported surface, listing it as a valid override surface-name is incorrect.

6. **Lifecycle described as 4-step**: README §1: "The skill follows a four-step lifecycle: detect the surface → classify the intent → load matching resources → produce verification evidence." The actual phase model in SKILL.md and `phase_detection.md` has **five gated phases** (0 Research, 1 Implementation, 1.5 Code Quality Gate, 2 Debugging, 3 Verification). The 4-step description conflates the routing model with the phase lifecycle.

7. **Structure tree omits `assets/opencode/recipes/`**: README §4 STRUCTURE shows `assets/opencode/checklists/` but no `assets/opencode/recipes/` entry. The real directory contains `assets/opencode/recipes/spec_folder_write.md` which is an important contract path cross-referenced in SKILL.md §1.

8. **README structure shows MOTION_DEV as reference root peer**: README §4 tree lists `motion_dev/` at `references/` root alongside `webflow/` and `opencode/`, which is correct, but §3.2 counts it as a "main directory" making 4. The tree is structurally accurate; the count in prose is not stale per se — but the framing of MOTION_DEV as a co-equal surface directory (rather than a peer resource category) is consistent with staleness #3.