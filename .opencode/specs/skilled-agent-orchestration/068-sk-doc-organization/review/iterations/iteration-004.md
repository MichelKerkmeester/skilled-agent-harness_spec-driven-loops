# Iteration 004 — Documentation Alignment + Functional Regression Risk

- **Date:** 2026-05-05
- **Executor:** cli-copilot / claude-opus-4.7
- **Focus:** Dimension 7 (SKILL.md + references narrative consistency) + Dimension 10 (functional regression — does sk-doc still resolve templates post-reorg?)
- **Mode:** READ-ONLY

## Evidence

### 1. SKILL.md narrative alignment (Phase 3 P2 fix verification)
- L162 mentions `assets/agent_template.md` and `assets/command_template.md` at root, plus `assets/skill/` for skill templates. ✓
- L163 mentions `assets/feature_catalog/` and `assets/testing_playbook/` at the assets/ root. ✓
- L434 enumerates `agent_template.md`, `command_template.md`, `feature_catalog/`, `testing_playbook/` under `assets/` root. ✓
- `rg -n "assets/agents" .opencode/skills/sk-doc/SKILL.md` → **0 hits** in active scope. ✓

### 2. references/global/quick_reference.md tree diagram (lines 174-188) — STALE
The "Project Structure" tree drawing in `quick_reference.md` (the **ALWAYS-loaded** smart-router baseline reference, per SKILL.md L168-170) still depicts the pre-reorg layout:

```
174. ├── assets/
175. │   ├── documentation/
176. │   │   ├── frontmatter_templates.md
177. │   │   ├── readme_template.md
178. │   │   ├── install_guide_template.md
179. │   │   ├── feature_catalog/ (feature catalog template bundle)        ← STALE: now at assets/feature_catalog/
180. │   │   ├── testing_playbook/ (manual testing playbook template …)   ← STALE: now at assets/testing_playbook/
181. │   │   └── llmstxt_templates.md
182. │   ├── skill/
…
186. │   ├── agents/                                                       ← STALE: directory removed in Phase 1 rmdir
187. │   │   ├── command_template.md (slash command template)              ← STALE: now at assets/command_template.md
188. │   │   └── agent_template.md (agent definition template)             ← STALE: now at assets/agent_template.md
```

Filesystem ground truth (`ls .opencode/skills/sk-doc/assets/`):
```
agent_template.md  command_template.md  documentation/  feature_catalog/
flowcharts/  skill/  template_rules.json  testing_playbook/
```

- `assets/agents/` directory does not exist (`stat: no such file or directory`).
- `feature_catalog/` and `testing_playbook/` are at root, not nested in `assets/documentation/`.

This is the same class of miss as Iter 3 P1 (Phase 2's substring sweep didn't catch tree-diagram path strings). It contradicts the actual filesystem in the routed-by-default reference.

**Severity: P1** — authoritative ALWAYS-loaded resource directs users / future authors to non-existent paths in the canonical project-structure diagram.

### 3. Other references/* mentions sweep
`rg -n "assets/agents|assets/documentation/feature_catalog|assets/documentation/testing_playbook" .opencode/skills/sk-doc/`:

- `references/specific/skill_creation.md:56` — illustrative example "Example: `assets/skill/`, `assets/agents/`, `assets/documentation/`, `assets/flowcharts/`" — used as a generic asset-folder example for new skills. Not a sk-doc filesystem claim, but the example references a folder shape sk-doc itself no longer uses. **Severity: P2** (illustrative-but-stale).
- `assets/skill/skill_md_template.md:593` — same `assets/agents/` mention inside the new-skill SKILL.md template's example list. **Severity: P2** (illustrative-but-stale; affects skills generated from this template).
- All `assets/skill/skill_md_template.md`, `skill_asset_template.md`, `skill_reference_template.md` link targets verified present on disk. ✓
- All changelog `v1.1.3.0.md` / `v1.4.0.0.md` mentions are out-of-scope per strategy (changelog history locked).

### 4. Relative-path / forgotten-prefix sweep (Iter-3 generalization)
`rg --no-config --no-ignore-vcs --glob "!**/specs/**" --glob "!**/z_archive/**" --glob "!**/dist/**" --glob "!**/.tmp/**" --glob "!**/barter/**" --glob "!**/changelog/v[0-9]*.md" "(\.\./)?agents/(agent|command)_template|(\.\./)?documentation/(feature_catalog|testing_playbook)" .opencode/skills/sk-doc/ .opencode/agents/ .opencode/commands/ .opencode/install_guides/`
→ **0 hits.** ✓ No surviving relative-path leftovers (the Iter-3 frontmatter_templates.md L770 fix held).

### 5. Functional regression — does sk-doc resolve templates at the new paths?

**Scripts (`scripts/init_skill.py`, etc.):** Only references found are placeholders (`assets/template-name.md`) and generic `assets/example_asset.txt` for scaffolded skills — no hardcoded path to any moved sk-doc asset. ✓

**`assets/template_rules.json`:** Contains validation rule schemas (`documentTypes`, `requiredSections`, etc.) — no filesystem path references to moved templates. ✓

**`/create:*` command YAML configs** — `template_sources` keys all point at NEW paths:
- `create_agent_{auto,confirm}.yaml` → `agent_templates.primary: .opencode/skills/sk-doc/assets/agent_template.md` ✓
- `create_feature_catalog_{auto,confirm}.yaml` → `template_sources.root_catalog: .opencode/skills/sk-doc/assets/feature_catalog/feature_catalog_template.md` ✓ (verified file present)
- `create_testing_playbook_{auto,confirm}.yaml` → `template_sources.root_playbook: .opencode/skills/sk-doc/assets/testing_playbook/manual_testing_playbook_template.md` ✓ (verified file present)

All template paths resolve on disk:
- `assets/agent_template.md` — present ✓
- `assets/command_template.md` — present ✓
- `assets/feature_catalog/feature_catalog_template.md` (8485 B) ✓
- `assets/feature_catalog/feature_catalog_snippet_template.md` (2368 B) ✓
- `assets/testing_playbook/manual_testing_playbook_template.md` (19407 B) ✓
- `assets/testing_playbook/manual_testing_playbook_snippet_template.md` (4792 B) ✓

**No functional regression.** sk-doc and the `/create:*` commands resolve templates correctly post-reorg.

### 6. validate.sh --strict on packet 068
```
Summary: Errors: 0  Warnings: 0
RESULT: PASSED
```
Structural integrity intact. ✓

## Findings

| ID | Severity | Title | Location | Evidence | Recommendation |
|----|----------|-------|----------|----------|----------------|
| iter4-F1 | **P1** | quick_reference.md project-structure tree depicts pre-reorg layout (`assets/agents/`, `assets/documentation/feature_catalog/`, `assets/documentation/testing_playbook/`) | `.opencode/skills/sk-doc/references/global/quick_reference.md:174-188` | `ls assets/` shows `agent_template.md` and `command_template.md` at root and `feature_catalog/`, `testing_playbook/` at root; `assets/agents/` does not exist | Update the tree drawing to mirror current filesystem (move `feature_catalog/` and `testing_playbook/` out of `documentation/`; replace `agents/` subtree with two root entries `agent_template.md` and `command_template.md`). |
| iter4-F2 | P2 | Illustrative `assets/agents/` reference in skill creation guide | `.opencode/skills/sk-doc/references/specific/skill_creation.md:56` | Line reads "Example: `assets/skill/`, `assets/agents/`, `assets/documentation/`, `assets/flowcharts/`" | Replace `assets/agents/` with a non-stale example (e.g., drop or substitute with another asset folder name); affects guidance only. |
| iter4-F3 | P2 | Generated SKILL.md template still suggests `assets/agents/` example | `.opencode/skills/sk-doc/assets/skill/skill_md_template.md:593` | Same illustrative example list as F2 | Same fix as F2; minor effect on new skills generated from this template. |

## Verdict

**CONDITIONAL** — 1 new P1 (iter4-F1) requires remediation before SHIP_AS_IS.

- 0 P0
- 1 P1 (iter4-F1: quick_reference.md tree diagram)
- 2 P2 (iter4-F2, iter4-F3: illustrative stale examples)
- Functional regression: NONE (templates resolve correctly)
- validate.sh --strict: PASS

Recommendation: REMEDIATE_AND_SHIP. The P1 fix is a single-file edit (~14 lines) updating the project-structure tree in `quick_reference.md` to match current `assets/` layout. P2s are advisory and can be bundled or deferred.
