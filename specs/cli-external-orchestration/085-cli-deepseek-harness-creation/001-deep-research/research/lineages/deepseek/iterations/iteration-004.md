# Iteration 4: Skills

## Focus

Angle 4: the harness skill format, the directories it scans, frontmatter keys and limits, how far
this repo's `SKILL.md` format is from it, whether parent hubs load one skill each or must be
flattened, and whether `.dsh/skills` should be a generated copy tree or a symlink.

## Actions Taken

- Read the `skill`, `skill-filesystem` and `tool-skill` package references.
- Read the filesystem provider's source for frontmatter parsing and name validation.
- Counted this repo's canonical skill tree: 16 top-level skill directories, 57 `SKILL.md` files.
- Compared against the `.pi/skills` symlink and the `.hermes/skills` generated-copy precedent.

## Findings

1. Discovery is exactly one level deep: a skill is `<root>/<name>/SKILL.md` or `<root>/<name>.md`,
   and nested `**/SKILL.md` files are deliberately not discovered.
   [SOURCE: dsh-src/packages/skill/skill-filesystem/README.md:36]
   [SOURCE: dsh-src/packages/skill/skill-filesystem/README.md:147]
2. The consequence is decisive for this repo: `.skilled/skills` has 16 top-level hub directories but
   57 `SKILL.md` files, so a whole-tree symlink at `.dsh/skills` would surface only the 16 hubs and
   hide the 41 nested mode packets (`cli-pi`, `deep-research`, `sk-code` modes, and the rest).
   [SOURCE: .skilled/skills/cli-external-orchestration/SKILL.md:1]
   [SOURCE: .skilled/skills/cli-external-orchestration/cli-pi/SKILL.md:1]
3. Roots are ranked: `<projectRoot>/.dsh/skills` (100), `<projectRoot>/.agents/skills` (200),
   configured `customSkillDirs` (300), `<dshHome>/skills` (400), `<agentsHome>/skills` (500), and an
   optional bundled root (600). The project root is the nearest ancestor containing `.git`, else the
   cwd, so the repo root is the scope for a checkout. [SOURCE: dsh-src/packages/skill/skill-filesystem/README.md:46-56]
4. Frontmatter requires a kebab-case `name` and a `description`; optional keys are `whenToUse`,
   `metadata`, `disable-model-invocation` and `user-invocable`. The parser reads only those keys, so
   this repo's extra `trigger_phrases`, `importance_tier`, `contextType`, `allowed-tools` and
   `version` fields are ignored rather than fatal. `allowed-tools` is not enforced by the harness.
   [SOURCE: dsh-src/packages/skill/skill-filesystem/README.md:36]
   [SOURCE: dsh-src/packages/skill/skill-filesystem/src/index.ts:811-850]
   [SOURCE: dsh-src/packages/skill/skill/src/index.ts:21-36]
5. There is no content scanner, quarantine or skill size limit. An invalid file is skipped with a
   warning the model never sees; a root that fails to read is omitted and retried on the next
   lookup; the body is read on demand, so an oversized body costs only the load. The catalog
   description is normalized and capped at 500 characters by default
   (`catalogDescriptionMaxLength`). [SOURCE: dsh-src/packages/skill/skill-filesystem/README.md:85]
   [SOURCE: dsh-src/packages/skill/tool-skill/README.md:48]
6. Symlinked directories are explicitly supported: catalog entries and loaded skills expose the
   resolved instruction-file path, and "symlinked directories and flat files can open as regular-file
   previews"; reload locators keep the discovered path. A per-skill symlink farm therefore preserves
   each packet's `references/`, `scripts/` and `assets/` while satisfying the one-level rule.
   [SOURCE: dsh-src/packages/skill/skill-filesystem/README.md:40]
7. Duplicate names resolve by layer first, then root rank, then provider order, with the loser hidden
   and logged. Project-root skills at rank 100 therefore shadow a same-named skill in
   `$DSH_HOME/skills` or `~/.agents/skills`, which makes a checked-in `.dsh/skills` authoritative
   for a checkout. [SOURCE: dsh-src/packages/skill/skill/src/index.ts:84]
   [SOURCE: dsh-src/packages/skill/skill/README.md:140]
8. The smallest correct move is a generated per-skill symlink farm, not a whole-tree symlink and not
   a markdown-only copy tree: 57 entries, each pointing at its canonical directory. Hermes needed
   copies because its scanner quarantined linked trees; dsh has no scanner, and Pi's whole-directory
   link would lose 41 skills here. [SOURCE: .hermes/SYNC.md:20-26]
   [SOURCE: .pi/SYNC.md:32-34]

## Ruled Out

- A whole-directory symlink `.dsh/skills -> .skilled/skills`: one-level discovery would expose only
  the 16 hubs.
- Markdown-only generated copies: they would lose `references/`, `assets/` and `scripts/` unless
  every body carried a canonical pointer, and the harness has no scanner reason to avoid links.
- Editing canonical `SKILL.md` files to add `whenToUse` or invocation keys: extra keys are optional,
  and changing 57 files is out of this phase's scope.

## Dead Ends

- Looking for a quarantine or scan path: none exists in the filesystem provider; the only failure
  handling is warn-and-skip.

## Edge Cases

- Ambiguous input: "flatten into every nested mode" could mean rewriting bodies or exposing each as
  its own catalog entry; the second is what the loader supports, and it needs no body change.
- Contradictory evidence: Pi's whole-dir symlink works there because Pi's skill discovery is
  recursive or explicit-path based; the same mechanism does not transfer to dsh.
- Missing dependencies: none.
- Partial success: the symlink behavior is documented and its code path preserves the resolved path,
  but no dsh session with a `.dsh/skills` farm was run (that would require configuring a provider).

## Sources Consulted

- `dsh-src/packages/skill/skill-filesystem/README.md:36-56,85,147`
- `dsh-src/packages/skill/skill-filesystem/src/index.ts:811-850`
- `dsh-src/packages/skill/skill/src/index.ts:21-36,84`
- `dsh-src/packages/skill/skill/README.md:140`
- `dsh-src/packages/skill/tool-skill/README.md:48`
- `.pi/SYNC.md:32-34`, `.hermes/SYNC.md:20-26`
- Repo skill tree counts: 16 top-level directories, 57 `SKILL.md` files

## Assessment

- New information ratio: 0.93 (six fully new findings, one that extends the `.pi`/`.hermes`
  precedent into a dsh-specific decision)
- Questions addressed: Angle 4 skill format, roots, limits and mirror mechanism
- Questions answered: What skill format does the harness load, and should this repo use generated copies or symlinks?

## Reflection

- What worked and why: counting the tree before reading the loader contract turned an abstract
  "symlink or copy" question into an arithmetic one, and the one-level rule decided it.
- What did not work and why: the README's "nested SKILL.md deliberately not discovered" line is easy
  to miss under a table; the source-level parser check confirmed the frontmatter compatibility claim.
- What I would do differently: count the tree in iteration 3, since the `.dsh/` folder inventory
  needed that number to be honest.

## Recommended Next Focus

Angle 5: agents, subagents, commands and goal, including whether `.skilled/agents` can be reached
as harness subagents or presets and how the 35 nested commands can be exposed.
