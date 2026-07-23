# Iteration 6: skill/mode READMEs (part 1: create-* modes)

> dimension: accuracy+conformance | model: gpt-5.6-sol effort=high tier=fast | sandbox: read-only
> status: 0 | timedOut: false

- **[P0] Quick-start commands use nonexistent repo-root paths**

  `.opencode/skills/sk-doc/create-skill/README.md:45`

  Evidence: Lines 45, 53, 61, and 131–133 invoke `scripts/*.py` or `../shared/scripts/*.py` without first changing directories. From the documented worktree root, all three `scripts/*.py` paths are missing; the files actually live under `.opencode/skills/sk-doc/create-skill/scripts/`.

  Fix: Use repository-root-qualified paths throughout, such as `.opencode/skills/sk-doc/create-skill/scripts/init_skill.py` and `.opencode/skills/sk-doc/shared/scripts/extract_structure.py`, or add an explicit `cd` step.

- **[P1] Standalone scaffold promises files the initializer does not create**

  `.opencode/skills/sk-doc/create-skill/README.md:23`

  Evidence: Lines 23, 35, and 48 claim the standalone scaffold creates `README.md`, `references/`, `assets/`, and `scripts/`. `init_skill.py:115-125` creates only the skill directory and `SKILL.md`; lines 132–134 explicitly tell the user to add those optional directories afterward. `SKILL.md:187-211` likewise makes them optional follow-up artifacts.

  Fix: State that `init_skill.py` initially creates only the directory and `SKILL.md`; describe the README and resource directories as later, optional authoring steps.

- **[P1] Agent README overstates what automated validation proves**

  `.opencode/skills/sk-doc/create-agent/README.md:97`

  Evidence: Line 97 says the validator detects a missing hard-boundary section, but `template-rules.json:486-500` requires only `core_workflow`; no hard-boundary rule exists. Line 130 says `check_authored_name_kebab.py` proves the filename matches frontmatter `name`, but `check_authored_name_kebab.py:46-54` only applies a kebab-case regex to the path basename and never parses frontmatter. `validate_agent_frontmatter()` likewise checks runtime-specific `tools`/`permission` fields, not filename/name equality.

  Fix: Describe these commands narrowly—structure/frontmatter checks and basename casing—and list hard-boundary presence plus filename/frontmatter equality as explicit manual checks, unless the validators are extended to enforce them.
