# Iteration 4: Angle 4 — Skill format compatibility

## Focus

What Hermes requires of a `SKILL.md` (frontmatter keys, the 60-character description rule,
`platforms`, `metadata.hermes.*`), how far this repo's skill format is from it, which of the
repo's skill hubs would load or be rejected/quarantined and why, whether a read-only command
reports the load result, and whether Hermes honors the agentskills.io convention.

## Actions Taken

- Read `tools/skill_linter.py` lines 79-130 (`_check_frontmatter`: name-format regex,
  name-dir-mismatch, description-length vs `SKILL_PROMPT_DESC_LIMIT`, missing
  version/author/license, missing `metadata.hermes.{tags,related_skills}`, platforms values,
  shell-utility references in prose) and `agent/skill_utils.py:716-733`
  (`SKILL_PROMPT_DESC_LIMIT = 60`, truncation to 57 chars + "...").
- Read `tools/skill_manager_tool.py` lines 130-175 (`_validate_frontmatter`: hard validator —
  name + description required, description <= MAX_DESCRIPTION_LENGTH, non-empty body,
  frontmatter must parse).
- Read `tools/skills_ast_audit.py` lines 21-81 (AST scan of bundled scripts for importlib /
  sys.modules-style dynamic loading).
- Scanned all 174 `SKILL.md` files under `.opencode/skills`, `.claude/skills`, `.pi/skills`,
  `.devin/skills` (repo-root relative): frontmatter presence, name, description length,
  name-vs-dirname match.
- Fetched the agentskills.io specification (https://agentskills.io/specification.md,
  2026-09-14): directory structure, frontmatter contract, progressive disclosure, validation.

## Findings

1. **The repo's 174 SKILL.md files ALL pass Hermes's hard validator.** Every file has
   `name` + `description` + non-empty body + parseable YAML frontmatter, and every `name`
   matches its parent directory name (0 name-dir mismatches). Hard-reject cases in this repo:
   none. Load is not blocked by warnings.
   [SOURCE: scan of 174 SKILL.md files, 2026-09-14; tools/skill_manager_tool.py:130-175]

2. **ALL 174 descriptions exceed Hermes's 60-char prompt budget.** The repo format carries
   long descriptions (with trigger_phrases/importance_tier). Hermes truncates descriptions
   past 60 chars to 57 + "..." in the skill index (skill_utils.py:716-733), so every repo
   skill would lose routing signal at dispatch time — the description the model sees is a
   prefix, not the crafted trigger phrase. Existing skills are not rejected (the 60-char
   limit is hard only for NEW skills via `_validate_frontmatter(new_skill=True)`), but the
   routing loss is real and uniform.
   [SOURCE: scan output (174/174 > 60 chars); skill_utils.py:716-733; skill_manager_tool.py:145-160]

3. **Advisory linter warnings would fire on nearly every repo skill: missing
   `version`/`author`/`license`, missing `metadata.hermes.{tags,related_skills}`, and (for
   skills whose prose names shell utilities) `shell-utility-reference`.** All are warnings,
   not blocks. The repo's `platforms` values (`{macos}` etc.) are valid if present; the repo
   rarely uses `platforms`.
   [SOURCE: tools/skill_linter.py:79-130]

4. **Flattening + hub load (from Angle 3) means every hub and every mode loads as a peer
   skill.** With `./.hermes/skills -> .opencode/skills`, all 174 SKILL.md files (hub roots
   like `cli-external-orchestration`/`sk-code`/`sk-doc`, their mode leaves, and plugin skills)
   become individual entries. Hubs whose description is a routing sentence load as
   dispatchable skills; their mode SKILL.md files load beside them. Expect ~174 skills in the
   index instead of the repo's intended hierarchy — semantic loss, not load failure.
   [SOURCE: iteration 3 finding f-iter003-003; scan of .opencode/skills tree]

5. **No read-only command reports the load result for project skills** (confirmed live in
   iteration 3: `hermes skills list`/`check` cover installed skills only). A repo skill's
   would-load verdict therefore cannot be observed without the trust mutation — UNKNOWN until
   a later phase. Quarantine risk for this repo's tree is low: the structural scan found no
   symlink escapes (angle 3), and bundled scripts are AST-audited only at install time
   (skills_ast_audit.py:21-81); the repo's skills carry no executable scripts that importlib
   tricks would flag.
   [SOURCE: iteration 3 finding f-iter003-005; tools/skills_ast_audit.py:21-81]

6. **Hermes honors the agentskills.io convention structurally but is stricter.** agentskills
   spec (fetched 2026-09-14): directory + SKILL.md, `name` required (lowercase+hyphens, must
   match parent dir), `description` required (max 1024 chars), optional license/compatibility/
   metadata/allowed-tools, progressive disclosure. Hermes: same directory/SKILL.md shape and
   name-dir rule (regex additionally allows underscores), but description budget is 60 chars
   (agentskills: 1024) and it expects `metadata.hermes.*`, `version`, `author`, `license`,
   `platforms`. A skill written to the agentskills spec loads in Hermes (name+description
   present) with warnings; a skill written to Hermes's standard is agentskills-valid only if
   its description fits 1024 and name avoids underscores. The repo's skills are agentskills-
   compatible in shape; the Hermes-specific deltas are the 60-char discipline and
   metadata.hermes.
   [SOURCE: https://agentskills.io/specification.md (fetched 2026-09-14);
   ~/.hermes/hermes-agent/skills/AGENTS.md (resource-map)]

## Questions Answered

- Q4 (skill format compatibility): answered. Nothing in the repo's tree is hard-rejected;
  everything loads with uniform description-truncation and metadata warnings; flattening is
  the main semantic cost; agentskills.io convention honored structurally, Hermes stricter.

## Questions Remaining

- Q5-Q10 (see strategy).

## Assessment

- newInfoRatio: 0.72 — the 174/174 truncation sweep, hard-validator pass rate, and the
  agentskills comparison are new; load verdict for project skills remains UNKNOWN (trust
  mutation required).
- Confidence: high on validator/linter mechanics (source); high on the repo scan; medium on
  the agentskills-claim (spec fetched once).

## Reflection

- What worked: a full-tree scan converted "which skills would load" into hard numbers
  (0 rejected / 174 load-with-warnings); the agentskills fetch gave an external yardstick.
- What failed / ruled out: `hermes skills check` again confirmed as not the reporter; ruled
  out expecting hub hierarchy to survive the symlink (flattening is structural).
- Ruled-out direction: adding `metadata.hermes.*` and 60-char descriptions to all 174 repo
  skills as a precondition — the skills load without them; only routing signal degrades.
  A later phase may decide whether the cli-hermes packet's own skills (the ones Hermes
  actually needs) should carry Hermes-standard frontmatter.

## Recommended Next Focus

Angle 5: agents, commands and persona (`hermes_cli/agent_import.py`, `hermes_cli/profile*.py`,
`tools/delegate_tool*.py`, `agent/delegation_context.py`, slash dispatch registry; how the
repo's 13 agents and nested `.opencode/commands/**` can be reached; `hermes import-agent
claude-code --dry-run` value).
