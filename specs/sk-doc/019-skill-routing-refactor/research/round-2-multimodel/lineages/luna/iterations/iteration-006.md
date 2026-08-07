# Iteration 6: Authored path references in child packets

## Focus
Stale, non-repo-rooted, or wrong-owner path references in current child documents, with frozen historical verification artifacts excluded.

## Actions Taken
- Resolved the path references in active child packet scope against tracked repository paths rather than merely checking whether an untracked directory happened to exist.
- Checked the canonical advisor source tree and the untracked underscore-named build directory separately.
- Re-read the known 012 path-contract references and compared them with the live `smart-routing.md` file and the absent underscore spelling.
- Excluded frozen verification/research artifacts that intentionally preserve historical filenames and worktree paths.

## Findings

### P1: PRE-EXISTING — packet 013's Files-to-Change table points the advisor work at an untracked underscore build tree
Evidence: `013-skill-advisor-routing-fixes/spec.md:118-136` directs the hook, tests, scorer, baselines, and scripts to `.opencode/skills/system-skill-advisor/mcp_server/...`. The canonical tracked source is `.opencode/skills/system-skill-advisor/mcp-server/...`; `git ls-files` reports zero tracked files under the underscore path, while the hyphen path contains the source and the real hook. The packet's own decision record acknowledges the correction at `013.../decision-record.md:582`, but the authoritative scope table remains stale. This is a wrong-owner path contract: following the scope table can edit an untracked generated/build tree instead of the repository source. It predates `140266be3e`; that commit touched no 013 child file.

### P2: PRE-EXISTING — packet 012 retains the removed `smart_routing.md` path in scope and acceptance text
Evidence: `012-sk-doc-routing-fixes/spec.md:90` and `:124` refer to `shared/references/smart_routing.md`, `:149` repeats the old name in the acceptance criterion, and `012.../plan.md:102` says the replay reads `smart_routing.md`. The live file is `.opencode/skills/sk-doc/shared/references/smart-routing.md`; the underscore path is absent. The parent reference was corrected to the hyphen spelling by `140266be3e`, but the child was not changed, so this stale cross-document path remains PRE-EXISTING.

## Questions Answered
- At least two non-excluded child packets retain stale path contracts beyond the parent docs: 013's underscore advisor tree and 012's underscore smart-routing filename.
- The 013 underscore directory's existence is not evidence of a valid repository target: it is untracked and distinct from the canonical hyphen source tree.

## Questions Remaining
- Do any other active child documents contain stale path tokens that resolve only because of generated or untracked directories?
- Does a final all-finding re-read change any severity or NEW/PRE-EXISTING classification?
- Are there additional lifecycle mismatches hidden by intentional deferred checklists?

## Sources Consulted
- `.opencode/specs/sk-doc/019-skill-routing-refactor/013-skill-advisor-routing-fixes/spec.md:114-136`
- `.opencode/specs/sk-doc/019-skill-routing-refactor/013-skill-advisor-routing-fixes/decision-record.md:580-582`
- `.opencode/specs/sk-doc/019-skill-routing-refactor/012-sk-doc-routing-fixes/spec.md:90,124,149`
- `.opencode/specs/sk-doc/019-skill-routing-refactor/012-sk-doc-routing-fixes/plan.md:102`
- `.opencode/skills/sk-doc/shared/references/smart-routing.md`
- `.opencode/skills/system-skill-advisor/mcp-server/`
- `git ls-files .opencode/skills/system-skill-advisor/mcp_server` (zero tracked files)

## Recommended Next Focus
Perform one final broad status and path-token scan, then re-read every candidate finding against the exact current files and the commit boundary before synthesis.

## Ruled Out
- Historical underscore references in frozen verification/research artifacts were not promoted to findings.
- The untracked underscore advisor directory was not treated as the canonical source merely because it exists locally.
