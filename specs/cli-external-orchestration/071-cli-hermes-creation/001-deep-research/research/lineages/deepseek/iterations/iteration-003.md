# Iteration 3: Angle 3 — The repo-root `.hermes/` folder and instruction files

## Focus

Exactly what Hermes reads from the working directory and its parents; what `hermes skills
trust` records and where; how the quarantine and static scan treat a symlinked skill tree;
whether discovery follows a symlink from `./.hermes/skills` to `.opencode/skills` and whether
it flattens nested `SKILL.md` files; what must live at the repo root versus `~/.hermes`; and
the symlink strategy following the `.pi/`/`.devin/`/`.cursor/` patterns.

## Actions Taken

- Read `agent/coding_context.py` lines 31-40: `_PROJECT_MARKERS` (incl. `AGENTS.md`,
  `CLAUDE.md`, `.cursorrules`) and `_CONTEXT_FILES = ("AGENTS.md", "CLAUDE.md",
  ".cursorrules")`.
- Read `agent/skill_utils.py` lines 405-500: `PROJECT_SKILLS_SUBDIRS = (".hermes/skills",
  ".agents/skills")`, `find_project_root` (nearest `.git` ancestor, 64-level walk-up),
  `_candidate_project_skills_dirs` (resolve()s each candidate), `is_project_root_trusted`
  gating.
- Read `agent/skill_utils.py` lines 525-560 and 736-760: `is_quarantined_project_skill`
  (fail-closed scan verdict, cache at `~/.hermes/cache/project_skill_scans`),
  `iter_skill_index_files` (`os.walk(..., followlinks=True)`, recursive, prunes
  `EXCLUDED_SKILL_DIRS` and skill-root support dirs).
- Read `tools/skills_guard.py` lines 526-545: structural scan flags `symlink_escape`
  (critical) when a symlink inside a skill dir resolves outside it.
- Read `hermes_cli/main_agent_cmds.py` lines 173-233: `hermes skills trust|untrust` manages
  `skills.trusted_project_dirs` in `~/.hermes/config.yaml` (user-level).
- Read `tools/skills_tool.py` lines 170-215: `_skill_search_dirs` — trusted project dirs come
  FIRST; project dirs go through the quarantine chokepoint (`iter_project_skill_files`).
- Ran `hermes skills list` (exit 0) and `hermes skills check` (exit 0) live.
- Compared with the repo dotfolder patterns (`.claude`, `.pi`, `.devin`, `.cursor` from
  resource-map §Config).

## Findings

1. **Working-directory instruction files: exactly `AGENTS.md`, `CLAUDE.md`, `.cursorrules`.**
   `_CONTEXT_FILES` is a fixed tuple; `SOUL.md` is NOT a repo file — it loads from
   `~/.hermes/SOUL.md` (user-level persona, per resource-map). `AGENTS.md`/`CLAUDE.md` are also
   `_PROJECT_MARKERS` for code-workspace detection. This repo's root `AGENTS.md` (identical to
   `CLAUDE.md`) will be injected in any Hermes dispatch from the repo root — same as
   cli-cursor's documented `AGENTS.md` pickup.
   [SOURCE: agent/coding_context.py:31-40; agent/prompt_builder.py:1465-1578 (resource-map);
   ~/.hermes/SOUL.md]

2. **Project skills live only in `./.hermes/skills` and `./.agents/skills`, and only for a
   TRUSTED project root.** `PROJECT_SKILLS_SUBDIRS` is exactly those two; the root is the
   nearest `.git` ancestor (max 64 levels up); discovery is gated on the root being in
   `skills.trusted_project_dirs`; untrusted projects with skills are counted and warned, never
   loaded. Trust is a USER-LEVEL decision: `hermes skills trust [path]` writes
   `skills.trusted_project_dirs` into `~/.hermes/config.yaml` — the repo cannot carry it, so
   the `.hermes/` folder can only carry the skills themselves, never the trust grant.
   [SOURCE: agent/skill_utils.py:410-500; hermes_cli/main_agent_cmds.py:179-233]

3. **A symlinked `./.hermes/skills -> .opencode/skills` is followed and FLATTENED.**
   `_candidate_project_skills_dirs` resolves each candidate (`cand.resolve()`), and
   `iter_skill_index_files` walks with `followlinks=True` recursively — every nested
   `SKILL.md` under `.opencode/skills` becomes an individual skill entry (hub roots and each
   mode's SKILL.md alike). Hermes has no "parent hub" concept: a hub's `SKILL.md` and each
   mode's `SKILL.md` are peers. Dedup is by frontmatter `name` (first-wins), so the repo's hub
   SKILL.md files (which carry `name:` frontmatter) and leaf skills would all surface
   individually — dozens of skills from one symlink. The `.claude`/`.pi` pattern of symlinking
   `skills -> ../.opencode/skills` therefore mechanically works but semantically flattens.
   [SOURCE: agent/skill_utils.py:468-478, 736-760]

4. **Quarantine is fail-closed and per-skill-dir; symlink escape inside a skill is flagged
   critical.** Every project SKILL.md passes `is_quarantined_project_skill` before load: the
   scanner's `dangerous` verdict (or a scanner crash) quarantines; results cache under
   `~/.hermes/cache/project_skill_scans`. The structural scan flags `symlink_escape` when a
   symlink inside a skill dir resolves outside it — so per-file symlinks into shared trees
   (the `.pi/extensions` pattern) are riskier than a whole-dir symlink. The repo's skill tree
   contains no escaping symlinks today, so a whole-tree symlink would pass the structural scan
   (`documented, unconfirmed` until a live trust + scan, which requires a mutation).
   [SOURCE: agent/skill_utils.py:525-550; tools/skills_guard.py:526-545]

5. **No read-only command reports the project-skill load result.** Live: `hermes skills list`
   (exit 0) enumerates installed skills with a Trust column (builtin/trusted/community) but
   shows nothing for the untrusted repo; `hermes skills check` (exit 0) reports only
   "No hub-installed skills to check." The load result materializes only AFTER the `hermes
   skills trust` mutation — which is out of bounds for this research. So the repo's
   would-load verdict stays UNKNOWN until a later phase performs the trust mutation in a
   controlled environment.
   [SOURCE: live `hermes skills list` + `hermes skills check`, 2026-09-14]

6. **Repo-root vs `~/.hermes` split.** Repo root: `AGENTS.md`/`CLAUDE.md`/`.cursorrules`
   (auto-injected), `./.hermes/skills` + `./.agents/skills` (project skills, trust-gated).
   User level (`~/.hermes/`): `SOUL.md` persona, `config.yaml` (incl.
   `skills.trusted_project_dirs`), `.env` secrets, `plugins/`, `memories/`, `sessions/`,
   `logs/`, `cache/` (skill scan cache, reasoning caps). Memory injection is user-level; a
   dispatch cannot scope it per-repo except via `--ignore-rules`. Following the `.pi/`/
   `.devin/`/`.cursor/` patterns, the repo's `.hermes/` should symlink shared content:
   `skills -> ../.opencode/skills` (flattening caveat above), while `SOUL.md`, plugins and
   trust remain operator-level. `.agents/skills` is a second carrier only if a Hermes-unique
   layout is ever needed.
   [SOURCE: agent/skill_utils.py:410; hermes_cli/main_agent_cmds.py:179-233; ~/.hermes layout,
   resource-map §Config]

## Questions Answered

- Q3 (repo-local surface): answered. Instruction files = AGENTS.md/CLAUDE.md/.cursorrules;
  project skills dirs = `.hermes/skills` + `.agents/skills`, trust-gated and user-recorded;
  symlink followed + flattened; quarantine fail-closed; load-result report requires the trust
  mutation (UNKNOWN until then).

## Questions Remaining

- Q4-Q10 (see strategy).

## Assessment

- newInfoRatio: 0.78 — flattening semantics, trust location, quarantine chokepoint, and the
  no-read-only-report gap are new; the symlink-scan verdict is `documented, unconfirmed`.
- Confidence: high on mechanics (source); medium-high on the flattened-tree surface area.

## Reflection

- What worked: reading the loader + scanner together with the CLI trust command closed the
  trust/quarantine/load loop without any mutation; live `skills list`/`check` confirmed the
  reporting gap.
- What failed / ruled out: `hermes skills check` as the load-result reporter (it covers only
  hub-installed skills); per-file symlinks into `.opencode/skills` (escape flag risk) — prefer
  whole-dir symlink.
- Ruled-out direction: carrying trust in the repo (`.hermes/` cannot hold the trust grant);
  expecting hub semantics through the symlink (flattening is the actual behavior).

## Recommended Next Focus

Angle 4: skill format compatibility (`skills/AGENTS.md` standard — frontmatter keys,
60-character description rule, platforms, metadata.hermes.*; `tools/skill_linter.py`,
`tools/skills_ast_audit.py`; which repo skill hubs would load or be rejected/quarantined;
agentskills.io convention).
