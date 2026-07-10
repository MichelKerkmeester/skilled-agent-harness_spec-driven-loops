# Iteration 005 — skill + agent authoring checklists (Facet 5a)
_Executor: GLM-5.2, read-only; orchestrated by Opus._

## Iteration 5 findings — skill + agent authoring checklists

The two checklists (`code-opencode/assets/checklists/skill_authoring.md`, `agent_authoring.md`, both `version: 3.5.0.6`) document a **flat standalone-skill / generic-agent model that predates the parent-hub (Option-E) architecture every modern canonical skill now uses**. Neither checklist mentions `mode-registry.json`, `graph-metadata.json`, `hub-router.json`, `packetKind`/`workflowMode`, or the agent mirror-sync gate — the four invariants that govern authoring today.

**[P0] skill_authoring.md is blind to the Option-E parent-hub model that ALL canonical skills now ship**
- `code-opencode doc:` `skill_authoring.md:46-52` (STEPS) describe a flat skill: "Create or update `SKILL.md` … Put detailed standards in `references/` … Add or update `description.json`". Line 50 is the only metadata mention: "Add or update `description.json` with matching version, keywords, and trigger examples." A grep for `mode-registry|graph-metadata|hub-router|packetKind|workflowMode|parent.hub|Option.E|parent_skill` across the file returns **0 hits**.
- `reality:` `sk-doc/SKILL.md:122` — "Each packet … carries **no** `graph-metadata.json`, so the advisor discovers exactly one `sk-doc` identity." `sk-doc/SKILL.md:134-139` (ALWAYS/NEVER) make `mode-registry.json`, one `graph-metadata.json`, and no surface axis the load-bearing rules. `parent_skills_nested_packets.md:49-58` codifies Option-E: "One mode array", "One graph identity: only the hub has `graph-metadata.json`", "Required router: every hub has `hub-router.json`". `sk-doc` and `sk-code` both ship `mode-registry.json` (confirmed on disk).
- `recommendation:` Rewrite the STEPS + POST-CHECKS to branch on standalone-skill vs parent-hub. Add mandatory checks: (a) exactly one `graph-metadata.json` at the skill root, none in packets; (b) `mode-registry.json` + `hub-router.json` present for any multi-packet skill; (c) every `modes[]` entry declares `workflowMode`/`packetKind`/`backendKind`/`toolSurface`/`packet`. Point at `create-skill/references/parent_skill/parent_skills_nested_packets.md` as the canonical Option-E source. A `description.json`-only checklist cannot validate sk-doc, sk-code, or sk-design.

**[P0] agent_authoring.md documents a fictional three-runtime mirror; reality is two runtimes enforced by a named gate it never cites**
- `code-opencode doc:` `agent_authoring.md:29` — "across OpenCode, Claude, and OpenCode"; `:40` — "`.opencode/agents/`, `.claude/agents/`, and `.opencode/agents/`"; `:60` — same duplication. `.opencode/agents/` is listed **twice** and "OpenCode" is printed twice where a third runtime name belongs.
- `reality:` `check-agent-mirror-sync.cjs:6` — "authored once under `.opencode/agents/<name>.md` and mirrored to `.claude/agents/<name>.md`"; `:32` regex `/(?:^|\/)\.(?:opencode|claude)\/agents\/[^/]+$/` recognizes **only** `.opencode` and `.claude`. The orphan check (`:80-82`) inspects only `.claude/agents/`. No `.codex/` dir exists (`ls .codex*` → no matches; `opencode.json` → 0 `codex` hits). `code-quality/SKILL.md:134` names the real enforcement: "the `.opencode/hooks/pre-commit` hook additionally enforces a staged agent-mirror-sync drift gate."
- `recommendation:` Replace the triple-list with the two-runtime canonical→mirror contract (`.opencode/agents/` canonical, `.claude/agents/` mirror) and cite `check-agent-mirror-sync.cjs` + `.opencode/hooks/pre-commit` as the parity gate. Drop the phantom third runtime.

**[P1] agent_authoring.md's permission model is a category error — it cites the skill `allowed-tools` field for agents and omits the real `permission:`/`tools:` schemas**
- `code-opencode doc:` `:39` — "Set `allowed-tools` or runtime permission fields"; `:59` grep — `rg -n "name:|description:|allowed-tools:|permission:|LEAF|orchestr"`.
- `reality:` `.opencode/agents/code.md:4-19` uses `mode: subagent`, `temperature: 0.1`, and a `permission:` block with granular allow/deny keys (`read/write/edit/patch/bash/grep/glob/memory/list/webfetch/chrome_devtools/task/external_directory`). `.claude/agents/code.md:4` uses `tools: Read, Write, Edit, Bash, Grep, Glob, mcp__mk_spec_memory__*`. **Neither** agent carries an `allowed-tools:` field — that token is skill-only frontmatter.
- `recommendation:` Document both runtime schemas: OpenCode `permission:` block (per-capability allow/deny + `mode` + `temperature`), Claude `tools:` list. Drop `allowed-tools:` from the agent grep. Add a per-runtime path-convention note (`.opencode/agents/*.md` vs `.claude/agents/*.md` canonical reference — the bodies literally differ at `.opencode/agents/code.md:26` vs `.claude/agents/code.md:11`).

**[P1] skill_authoring.md:68 cites `skill_creation.md` as source-of-truth — file does not exist (dead cross-link)**
- `code-opencode doc:` `:68` — "sk-doc references/skill_creation.md (source-of-truth for skill structure rules)".
- `reality:` `find .opencode/skills/sk-doc -iname skill_creation.md` → no results. The reference set was restructured into `shared/` + `skill/` + `parent_skill/` subfolders; the index is now `create-skill/references/README.md` (`:44-49`), and the structure-rule depth lives in `shared/overview.md` and `parent_skill/parent_skills_nested_packets.md`.
- `recommendation:` Replace the dead ref with `create-skill/references/README.md` (index) + `shared/overview.md` (anatomy) + `parent_skill/parent_skills_nested_packets.md` (Option-E).

**[P2] Both checklists omit graph-metadata.json / description.json from their metadata validation steps**
- `code-opencode doc:` `skill_authoring.md:50` only mentions `description.json`; neither checklist has a step validating `graph-metadata.json` existence, schema, or the advisor-discovery invariant.
- `reality:` `sk-doc/graph-metadata.json` carries `schema_version: 2`, `skill_id`, `family`, `edges` (depends_on/enhances/siblings/conflicts_with), `manual`, `domains` — the advisor-discovery surface. `code-opencode/SKILL.md:43` itself states "Descriptors are load-bearing. `graph-metadata.json` / `description.json` shape drives discovery."
- `recommendation:` Add a metadata-validation step covering both `description.json` (keywords/triggers/version) and `graph-metadata.json` (schema_version 2, edges, the one-identity invariant for parent hubs).

### Council-seed verification

**#26 (authoring checklists cite canonical example files that do not exist) — CONFIRMED, partial scope.**
- Dead: `skill_authoring.md:68` → `skill_creation.md` (file absent; confirmed by find).
- Alive (no defect): `skill_authoring.md:35,69` → `sk-doc/SKILL.md`, `sk-code/SKILL.md`, `sk-git/SKILL.md` (all exist); `:36` → `create-skill/references/README.md` (exists); `:70` → `universal_checklist.md` (exists); agent checklist `:35,68` → `code.md`, `review.md`, `orchestrate.md` (all exist). #26 is real but narrow — one dead source-of-truth reference, not a cluster of dead examples.

**#9 (code-quality's SKILL.md claims a packet-local `assets/checklists/` that never existed — checklists live in code-opencode) — CONFIRMED, with nuance.**
- `code-quality/SKILL.md:68` (routing): `+- OPENCODE target -> assets/checklists/<target-checklist>.md`; `:90`: "`assets/checklists/` contains OpenCode authoring checklists"; `:103-108` + `:116-121` all reference `assets/checklists/skill_authoring.md` etc. as packet-local.
- `find .claude/skills/sk-code -type d -name checklists` → ONLY `.claude/skills/sk-code/code-opencode/assets/checklists`. code-quality has **no** `assets/checklists/` dir.
- Nuance: `code-quality/SKILL.md:262-271` (REFERENCES) is honest — every link href resolves to `../code-opencode/assets/checklists/...`. So the **body/routing sections claim packet-local paths while the REFERENCES section corrects them**. Internal inconsistency, not uniform fabrication. #9's core claim (checklists live in code-opencode, code-quality's packet-local claim is false) holds.

### Dead-link inventory
Every example-file / cross-link reference in the two checklists, checked against disk:
1. ❌ `skill_authoring.md:68` — `sk-doc references/skill_creation.md` — **DEAD** (file does not exist; restructured into shared/skill/parent_skill subfolders)
2. ✅ `skill_authoring.md:35,69` — `sk-doc/SKILL.md`, `sk-code/SKILL.md`, `sk-git/SKILL.md` — exist
3. ✅ `skill_authoring.md:36` — `create-skill/references/README.md` — exists
4. ✅ `skill_authoring.md:59` — `verify_alignment_drift.py` — exists
5. ✅ `skill_authoring.md:70` — `universal_checklist.md` — exists
6. ⚠️ `agent_authoring.md:29,40,60` — phantom third runtime (`.opencode/agents/` duplicated; "OpenCode, Claude, and OpenCode") — **logically dead** (no third runtime exists; gate enforces two)
7. ✅ `agent_authoring.md:35,68` — `code.md`, `review.md`, `orchestrate.md` — exist
8. ✅ `agent_authoring.md:36,67` — `create-agent/references/README.md` — exists
9. ⚠️ `agent_authoring.md:39,59` — `allowed-tools:` token — **wrong category** (skill field, not agent field; no agent uses it)

### Angles to pursue next
- **command_authoring.md + mcp_server_authoring.md** — same staleness audit (these two checklists were not examined this iteration; check whether they match the real `/create:command` packet + the MCP-server authoring reality under `system-spec-kit/mcp_server/`).
- **Does code-quality's routing body get fixed, or only its REFERENCES?** A targeted edit question: align lines 68/90/103-108/116-121 to `../code-opencode/assets/checklists/` to remove the internal contradiction flagged in #9.
- **The `allowed-tools` vs `tools` vs `permission:` taxonomy across skills vs agents vs commands** deserves a single cross-cutting reference; the agent checklist's conflation suggests the same bug may live in command_authoring.md.
- **graph-metadata.json schema drift** — `code-opencode` ships `version: 3.5.0.6` but `sk-doc` `graph-metadata.json` is `schema_version: 2`; verify the checklist should teach schema_version 2 and whether any skill still ships schema_version 1.

*(11 source files examined; read-only, no edits.)*
