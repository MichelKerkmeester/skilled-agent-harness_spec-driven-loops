# Iteration 2: sk-doc, sk-prompt, and sk-design hook/plugin candidates

## Focus

Inventory sk-doc (frontmatter version checking, flowchart validation, DQI quality scoring), sk-prompt (prompt quality profiles, model dispatch guidance), and sk-design (design audit, anti-slop detection) for hook promotion candidates.

## Findings

### Candidate 5: Frontmatter Version Validator Hook (sk-doc → Claude PostToolUse/Write|Edit + OpenCode tool.execute.after)

**Source skill:** `.opencode/skills/sk-doc/shared/scripts/check-frontmatter-versions.sh` + `frontmatter-version.mjs`
**Runtime surface:** Claude `PostToolUse` matcher `Write|Edit` + OpenCode `tool.execute.after`

The `check-frontmatter-versions.sh` script (delegates to `frontmatter-version.mjs`) validates that every in-scope skill doc (SKILL.md, README, references, assets) carries a 4-part version in its YAML frontmatter. It currently runs only in CI / pre-commit gates. When a developer edits a skill doc interactively, version staleness or omission is caught only at the next CI run — far too late.

A `PostToolUse`/Write|Edit hook scoped to `.opencode/skills/**/*.md` could run `frontmatter-version.mjs gate --skill <skill-name>` on the edited file and warn immediately if the version field is missing or malformed. The script already supports single-skill targeting via `--skill <name>`.

**Blast radius:** Low (observe/advise). Only triggers on skill-doc paths.

[SOURCE: .opencode/skills/sk-doc/shared/scripts/check-frontmatter-versions.sh:1-13]
[SOURCE: .opencode/skills/sk-doc/shared/scripts/frontmatter-version.mjs]
[SOURCE: .opencode/skills/sk-doc/scripts/frontmatter-version.mjs]

### Candidate 6: Flowchart Validator Hook (sk-doc → Claude PostToolUse/Write|Edit)

**Source skill:** `.opencode/skills/sk-doc/create-flowchart/scripts/validate_flowchart.sh`
**Runtime surface:** Claude `PostToolUse` matcher `Write|Edit`

The `validate_flowchart.sh` script (149 lines, Bash) validates ASCII flowcharts for common errors: box alignment, connector consistency, label formatting, and structural issues. Currently runs only when explicitly invoked. When an agent generates a flowchart during spec documentation, structural errors go undetected until manual validation.

A bounded `PostToolUse` hook could detect when a `.md` file containing ASCII flowchart blocks (```flowchart fenced sections) is edited and run the validator on just the flowchart content. This is especially valuable because agents generate flowcharts frequently during planning phases.

**Blast radius:** Low (observe/advise). Triggers only on files containing flowchart fenced blocks.

[SOURCE: .opencode/skills/sk-doc/create-flowchart/scripts/validate_flowchart.sh:1-50]
[SOURCE: .opencode/skills/sk-doc/create-flowchart/SKILL.md]

### Candidate 7: Small-Model Dispatch Advisory Hook (sk-prompt → OpenCode experimental.chat.system.transform)

**Source skill:** `.opencode/skills/sk-prompt/prompt-models/SKILL.md`
**Runtime surface:** OpenCode `experimental.chat.system.transform`

The `prompt-models` skill owns per-model prompt-craft profiles (framework + scaffold + gotchas) for DeepSeek-v4-pro, Kimi-k2.7-code, MiniMax-M3, MiMo-V2.5-Pro, and GLM-5.2. These profiles are only surfaced when the skill advisor recommends them (confidence ≥ 0.8) or when the agent explicitly loads the skill.

A `experimental.chat.system.transform` plugin could detect when a user prompt or CLI dispatch targets a small model (by parsing `cli-opencode model=X` patterns in the conversation) and inject a one-line advisory pointing to the relevant model profile. This is analogous to how `mk-skill-advisor.js` surfaces skill recommendations, but focused specifically on the model-dispatch context.

**Differentiation from existing mk-skill-advisor:** The advisor handles general skill routing; this would be a model-specific dispatch-context injection that fires only on small-model dispatch signals, surfacing the model's known gotchas before the dispatch happens.

**Blast radius:** Low (observe/advise system-context injection). Same pattern as `mk-skill-advisor.js` and `mk-spec-memory.js`.

[SOURCE: .opencode/skills/sk-prompt/prompt-models/SKILL.md:1-50]
[SOURCE: .opencode/plugins/mk-skill-advisor.js (analogous system.transform pattern)]
[SOURCE: .opencode/plugins/README.md:46 (mk-skill-advisor role)]

### Candidate 8: Design Anti-Slop PostToolUse Advisor (sk-design → Claude PostToolUse/Write|Edit)

**Source skill:** `.opencode/skills/sk-design/design-audit/SKILL.md`
**Runtime surface:** Claude `PostToolUse` matcher `Write|Edit`

The `design-audit` mode has a catalog of "AI-generated design slop" tells (model-specific fingerprints for OpenCode, Gemini, and 2026-general patterns) and checks for hard-coded values, token misuse, generic patterns, theming drift. This detection capability is interactive-only — it runs when the user explicitly requests a design audit.

A bounded `PostToolUse` hook scoped to frontend files (`*.css`, `*.tsx`, `*.jsx`, `*.html`) could run a lightweight subset of the anti-slop check — detecting the most common tells (hard-coded colors instead of tokens, generic gradient backgrounds, identical border-radius values, cookie-cutter card layouts) — and surface a one-line advisory after the write.

**Blast radius:** Low (observe/advise). Only triggers on frontend asset writes.

[SOURCE: .opencode/skills/sk-design/design-audit/SKILL.md:1-70]
[SOURCE: .opencode/skills/sk-design/design-audit/references/anti_patterns_production.md]

### Candidate 9: DQI Quality Score Live Feedback (sk-doc → OpenCode tool.execute.after)

**Source skill:** `.opencode/skills/sk-doc/create-quality-control/SKILL.md`
**Runtime surface:** OpenCode `tool.execute.after`

The `create-quality-control` mode validates, scores, and optionally improves existing markdown via structure extraction, DQI (Documentation Quality Index) scoring, and HVR (High-Value Review). This runs interactively only. When an agent edits a spec document or markdown artifact, the DQI score degrades silently until the next explicit quality-control pass.

A `tool.execute.after` plugin could run a lightweight DQI sub-check (placeholder detection, anchor integrity, section structure) on edited `.md` files under `specs/` or `.opencode/specs/` and surface a quality hint. This differs from Candidate 3 (spec validation) in that it scores documentation quality (DQI), not spec-folder structural validity.

**Blast radius:** Low (observe/advise). Scoped to markdown paths only.

[SOURCE: .opencode/skills/sk-doc/create-quality-control/SKILL.md]
[SOURCE: .opencode/skills/system-spec-kit/scripts/spec/quality-audit.sh]

## Sources Consulted

- `.opencode/skills/sk-doc/shared/scripts/check-frontmatter-versions.sh` (full)
- `.opencode/skills/sk-doc/create-flowchart/scripts/validate_flowchart.sh` (lines 1-50)
- `.opencode/skills/sk-prompt/prompt-models/SKILL.md` (lines 1-50)
- `.opencode/skills/sk-prompt/prompt-improve/SKILL.md` (lines 1-60)
- `.opencode/skills/sk-design/design-audit/SKILL.md` (lines 1-70)

## Assessment

- **newInfoRatio:** 0.8 — 5 new candidates; frontmatter and flowchart validators share the PostToolUse pattern with iteration 1's comment-hygiene candidate, reducing structural novelty
- **Novelty justification:** All 5 candidates are net-new findings, but the PostToolUse-on-scripts pattern is now established, reducing structural novelty
- **Confidence:** High — all grounded in real scripts

## Reflection

**What worked:** The PostToolUse/Write|Edit surface is a productive, low-blast-radius pattern with proven precedent. Multiple skills have validation scripts that would benefit from immediate feedback.

**What failed:** Nothing yet.

**Ruled out:** None.

## Recommended Next Focus

Inventory system-deep-loop (lifecycle hooks beyond dispatch guard), mcp-tooling/mcp-code-mode (tool registration hooks), and cli-external (dispatch preflight expansion). Also examine underused OpenCode surfaces (tool.execute.after, tool.register, event lifecycle).
