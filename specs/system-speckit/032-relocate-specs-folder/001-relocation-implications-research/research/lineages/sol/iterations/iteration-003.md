# Iteration 3: Git, ignore precedence, and downstream repositories

## Focus

Establish how the current and proposed root layouts interact with tracked symlinks, repository negations, user-global excludes, and the documented downstream-project setup.

## Actions Taken

1. Read relevant repository `.gitignore` and `~/.gitignore_global` rules.
2. Queried the Git index mode and blob payload for `specs`.
3. Used `git check-ignore --no-index` to confirm repository negations override global excludes for the source repository roots.
4. Read downstream-project setup guidance and the existing alias-retirement runbook.
5. Inventoried path-specific ignore rules that would still point at the old canonical location.

## Findings

1. The global excludes file deliberately ignores both `/specs` and `/.opencode/` in every repository. The source repository counteracts those rules with `!specs` and `!.opencode/`; `git check-ignore --no-index` reports those repository negations as the winning patterns. [SOURCE: /Users/michelkerkmeester/.gitignore_global:11] [SOURCE: /Users/michelkerkmeester/.gitignore_global:16] [SOURCE: .gitignore:10] [SOURCE: .gitignore:11]
2. `specs` is tracked as mode `120000`, and both its index blob and live `readlink` payload are the relative target `.opencode/specs`. The alias-retirement runbook's statement that the tracked payload is absolute is stale and must not guide the relocation. [SOURCE: command `git ls-files -s -- specs`] [SOURCE: command `git show :specs`] [SOURCE: .opencode/skills/system-spec-kit/scripts/references/spec-root-alias-retirement-runbook.md:7]
3. Canonical relocation changes Git object shape, not only path text: `specs` must transition from one tracked symlink blob to a tracked directory tree, while `.opencode/specs` becomes the optional compatibility symlink. A migration plan must verify staged mode changes and tree contents explicitly. [INFERENCE: based on current mode-120000 index entry and proposed topology]
4. Source-repository negations are already directionally correct for the inverted topology: `!specs` exposes the new canonical root and `!.opencode/` exposes a reverse compatibility link. The risky part is the many path-specific ignores currently rooted at `.opencode/specs/...`; canonical data under `specs/...` will no longer match those exclusions and needs an audited translation. [SOURCE: .gitignore:10] [SOURCE: .gitignore:11] [SOURCE: .gitignore:264]
5. Downstream repositories behave differently by design: global ignores hide both the shared `specs` and `.opencode` entry points, preventing framework symlinks from appearing as untracked content. This remains safe after inversion, but a downstream repo that intends to own and track project-local `specs/` must add a repository negation or adopt a different local data location. [SOURCE: /Users/michelkerkmeester/.gitignore_global:10] [SOURCE: /Users/michelkerkmeester/.gitignore_global:15]
6. Current downstream setup documentation symlinks the entire `.opencode` directory, then creates `.opencode/specs` and asks maintainers to ignore each project subfolder in the Public repository. After relocation, those writes would target the reverse alias; the instructions must instead establish whether project specs live in the shared top-level canonical tree or a project-owned non-shared tree. [SOURCE: PUBLIC-RELEASE.md:220] [SOURCE: PUBLIC-RELEASE.md:231] [SOURCE: PUBLIC-RELEASE.md:234]
7. Existing `.claude/specs`, `.codex/specs`, and `.agents/specs` ignore entries do not correspond to live runtime specs mirrors. They are historical compatibility residue; translating them blindly would perpetuate a topology that the filesystem and mirror generator do not implement. [SOURCE: .gitignore:269] [SOURCE: .gitignore:273] [INFERENCE: combined with iteration 2 filesystem evidence]

## Questions Answered

- Answered: Git/index/ignore consequences in the source repo and global-ignore effects for downstream repos.

## Questions Remaining

- Exact Memory MCP discovery, identity, and index paths.
- Executable/documentary reference counts and migration verification gates.
- Ownership decision for downstream project-local specs.

## Ruled Out

- Preserving the current tracked `specs` entry unchanged: it is a symlink blob and cannot simultaneously become the real canonical tree.
- Treating global ignores as a source-repository blocker: local negations already win for root entries.
- Blindly translating obsolete runtime-specific specs ignore rules.
- Relying on the current alias-retirement runbook's absolute-link premise.

## Dead Ends

- `git check-ignore` cannot evaluate hypothetical descendants under the live `specs` path because Git correctly refuses pathspecs beyond a symlink. The index-shape transition therefore needs a dedicated migration fixture or temporary checkout test during implementation.

## Edge Cases

- Ambiguous input: “downstream symlinked repos” can either treat specs as shared framework data or project-owned data; ignore behavior differs and the ownership choice must be explicit.
- Contradictory evidence: the alias-retirement runbook says the symlink blob is absolute; the index and live filesystem show a relative payload.
- Missing dependencies: no clean migration fixture was created because this lineage is write-contained.
- Partial success: root negation precedence is confirmed, while post-conversion descendant tracking should be exercised in an implementation fixture.

## Sources Consulted

- `.gitignore`
- `/Users/michelkerkmeester/.gitignore_global`
- Git index and `check-ignore` commands
- `PUBLIC-RELEASE.md`
- `.opencode/skills/system-spec-kit/scripts/references/spec-root-alias-retirement-runbook.md`

## Assessment

- New information ratio: 0.82
- Novelty justification: five findings were fully new and two combined prior topology evidence with Git-specific implications.
- Confidence: high for current index and ignore state; medium for downstream ownership policy because the intended post-move model is not yet specified.

## Reflection

- What worked and why: index-mode and blob inspection corrected stale runbook prose with direct evidence.
- What did not work and why: hypothetical child ignore behavior cannot be queried through a live symlink path.
- What I would do differently: require a migration fixture that compares tracked trees before and after the mode-120000 inversion.

## Recommended Next Focus

Trace Spec Kit Memory MCP spec-root discovery, identity normalization, database/index paths, and startup recovery assumptions.
