# Iteration 002: Q2 Phase correctness

## Focus

Audit phase 002’s tracked-file removal coverage, phase 001’s ignore and pre-commit guard, and phase 003’s advisor symlink-follow change.

## Actions Taken

1. Ran the requested fresh `git grep -l -i -E "sk-code-webflow|sk-code-obsidian|\bWEBFLOW\b|\bOBSIDIAN\b"` with fsmonitor disabled after the repository fsmonitor socket failed. The successful command exited 0.
2. Compared that result and phase 002’s named exceptions with its tasks and plan. Checked the concrete path references discussed in the plan against `git ls-files`.
3. Ran `git check-ignore -v --no-index` on synthetic paths using the proposed rules through a temporary file descriptor. No probe files were created. Inspected existing runtime skill-root symlinks and the current pre-commit staged-path loop.
4. Read the current advisor graph walker, freshness scan, doctor disk reader and planned producer skips for the compiler and Hermes mirror.

## Findings

### F1. Phase 002 coverage count and exceptions

**Confirmed.** The requested broad tracked-file grep returned 1,303 paths: 1,123 in `specs/`, 174 in `.skilled/` and 6 in `.hermes/`. The planner’s 93 count comes from a different baseline: T003 uses `rg` with a packet-name-only query and excludes `specs/`, changelogs and benchmark reports. Treating 93 as the count for the broad grep would undercount the literal match set. [SOURCE: specs/sk-code/013-private-surface-skills/002-hub-surface-removal/tasks.md:59]

**Documented.** Phase 002 explicitly defers four generated tracked paths until post-push CI: `runtime/data/trigger-index.json` and `runtime/cli/retrieval/fixtures/{corpus-manifest,generation-diagnostics,phrase-variants}.json`. These are expected to retain hits until the rebuild and are named as a later proof obligation. The task does not claim phase 002 alone makes the entire repository grep empty. [SOURCE: specs/sk-code/013-private-surface-skills/002-hub-surface-removal/plan.md:122]

**Confirmed.** The concrete path references checked in the phase 002 file list exist, including `shared/references/universal/code-quality-standards.md` and the named playbook examples. I found no nonexistent concrete path in that check. The plan also names the deferred generated files directly. [SOURCE: specs/sk-code/013-private-surface-skills/002-hub-surface-removal/plan.md:117]

**Inferred.** Phase 002’s removal list is complete only against its filtered baseline and later CI rebuild. It is not a whole-repository zero-hit step while the 1,123 historical `specs/` matches remain. P1 amendment: update phase 002’s `tasks.md` and `plan.md` to state the relationship between the filtered 93-file baseline and the broad tracked grep, and retain the four generated paths as explicit deferred exceptions.

### F2. Ignore patterns and runtime mirrors

**Confirmed.** The current `.gitignore` has no `local-*` rules yet. Probing canonical `.skilled/skills/local-*` and `.hermes/skills/local-*` paths against the current file returned exit 1. [SOURCE: .gitignore:228]

**Confirmed.** Feeding the planned slashless rules to `git check-ignore -v --no-index` matched both nested-file-shaped and direct-entry-shaped synthetic paths under `.skilled/skills/` and `.hermes/skills/`. The planned rules are anchored at those two repository paths. [SOURCE: specs/sk-code/013-private-surface-skills/001-ignore-and-commit-guard/tasks.md:66]

**Inferred.** Gitignore matching is path-based, so the slashless `local-*` rule applies equally to a real directory entry and a symlink entry with that name. This synthetic probe verified the path match, not the entry type. Phase 001 separately specifies a real symlink proof. [SOURCE: specs/sk-code/013-private-surface-skills/001-ignore-and-commit-guard/plan.md:268]

**Confirmed by filesystem inspection.** `.opencode/skills`, `.claude/skills`, `.pi/skills` and `.devin/skills` resolve to the canonical `.skilled/skills` tree, so their local skills use the `.skilled` entry path. `.codex/skills` and `.cursor/skills` do not exist in this checkout. The phase 001 guard currently plans six roots, omitting those two absent roots. [SOURCE: specs/sk-code/013-private-surface-skills/001-ignore-and-commit-guard/plan.md:90]

### F3. Pre-commit guard behavior

**Documented.** Phase 001’s planned guard reads staged paths with `git diff --cached --name-only -z --diff-filter=ACMR` and rejects a `local-*` directory immediately under one of its listed skill roots. The current hook already uses NUL-separated staged paths for its comment-hygiene gate, but its current filter is `ACM`; the private-skill guard is not present yet. [SOURCE: specs/sk-code/013-private-surface-skills/001-ignore-and-commit-guard/tasks.md:73] [SOURCE: .skilled/scripts/git-hooks/pre-commit:119]

**Inferred.** `git add -f` bypasses ignore rules but still puts the path in the index, so the guard sees it. A rename into `local-*` is reported as `R` or as an added destination, both included. A copied destination is normally `A`; if copy detection emits `C`, that is included too. A staged symlink or submodule is likewise selected by its path, because this guard does not need to open the entry’s content. The path regex does not match `.codex/skills/local-*` or `.cursor/skills/local-*`. [SOURCE: specs/sk-code/013-private-surface-skills/001-ignore-and-commit-guard/plan.md:143]

**Inferred.** The planned path matcher covers the asked index operations for its six roots. It lacks proof cases for copy, symlink and gitlink entries, and it omits `.codex` and `.cursor`. P2 amendment: add those cases or document why those two roots cannot be staged in this repository. [SOURCE: specs/sk-code/013-private-surface-skills/001-ignore-and-commit-guard/plan.md:90]

### F4. Advisor symlink-follow safety

**Confirmed.** Today the advisor graph walker recursively follows only entries whose `Dirent.isDirectory()` is true, so a symlink is skipped. The freshness scan, doctor disk reader, compiler and Hermes walker also start from directory entries and skip symlinks by default. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts:731] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/freshness.ts:142] [SOURCE: .skilled/commands/doctor/scripts/skill-graph-freshness.cjs:146]

**Documented.** Phase 003 changes only top-level `local-*` symlink entries to use `statSync` and treats other symlink names as before. Its graph traversal says a symlink is entered only from the root listing, which prevents nested symlink cycles. It also plans name-based skips in the compiler, Hermes sync, root-metadata gate and doctor panel before those tracked consumers run. [SOURCE: specs/sk-code/013-private-surface-skills/003-advisor-vocabulary-cleanup/tasks.md:61] [SOURCE: specs/sk-code/013-private-surface-skills/003-advisor-vocabulary-cleanup/plan.md:126]

**Inferred.** The one-level symlink rule is bounded against cycles and ordinary non-`local-*` symlinks. It does not constrain a `local-*` symlink target to the repository or another trusted root, because the planned helper only checks `statSync(targetPath).isDirectory()`. The advisor index and source signature can therefore read metadata from outside the checkout. The tracked graph compiler and Hermes writer avoid export only if their planned `local-*` skips land before regeneration. P1 amendment: phase 003’s `plan.md` should define trusted link targets and prove that the tracked fallback graph and Hermes output never follow a private link. [SOURCE: specs/sk-code/013-private-surface-skills/003-advisor-vocabulary-cleanup/tasks.md:61] [SOURCE: specs/sk-code/013-private-surface-skills/003-advisor-vocabulary-cleanup/plan.md:112]

### Priority amendments

- **P0:** None from this iteration.
- **P1, phase 002 `tasks.md` and `plan.md`:** Reconcile the 93-file scoped baseline with the all-tracked grep and name the four generated deferrals.
- **P1, phase 003 `plan.md`:** Define trusted `local-*` symlink target roots and prove tracked outputs do not follow them.
- **P2, phase 001 `tasks.md` and `plan.md`:** Add `.codex` and `.cursor` coverage or record their absence as an invariant. Add staged copy, symlink and gitlink proof cases.

## Questions Answered

- Q2 Phase correctness: the broad tracked grep is larger than the planner’s scoped baseline; phase 002 explicitly defers four generated files; the slashless planned ignore rules match synthetic paths for both roots; the pre-commit filter catches staged add, rename, copy, symlink and gitlink names within its six listed roots; phase 003 avoids cycles by following only top-level `local-*` symlinks but does not bound their target paths.

## Questions Remaining

- Q3: Does every task give a DeepSeek writer exact files, one change, proof, acceptance mapping and rollback?
- Q4: Does phase 005’s fresh-clone proof show that no private bytes or surface signals reach the public repository?
- Q5: What risks remain from Git history, the Obsidian Plugin project and CI drift checks?

## Next Focus

Q3 executability by a DeepSeek writer.
