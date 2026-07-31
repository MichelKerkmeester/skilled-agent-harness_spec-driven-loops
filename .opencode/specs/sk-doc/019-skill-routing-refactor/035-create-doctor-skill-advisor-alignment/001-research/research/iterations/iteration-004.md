# Iteration 004

## Focus

Determine the exact operator-facing source-selection syntax for the runtime-mirror doctor route without weakening its read-only default.

## Actions Taken

- Re-ran the mandated hook installer check from this linked worktree. The default invocation refused to anchor at the worktree and identified the primary checkout as /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public.
- Re-ran the same non-mutating check with an explicit primary checkout: node .opencode/bin/install-codex-hooks.mjs --check --repo /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public. Result: DRIFT, reporting 8 missing and 7 orphaned managed hook entries.
- Read the doctor router contract, the runtime-mirrors route manifest, the mirror checker argument parser, and the installer argument and worktree-guard paths.
- Compared the current refusal with the shipped installer design record, which explicitly rejects silent worktree anchoring and reserves --allow-worktree for deliberate testing.

## Findings

### F-004-001 — The doctor route has no source-selection surface

The canonical operator syntax is /doctor runtime-mirrors [flags]; the route currently declares allowed_flags: [] and hard-codes every checker invocation, including install-codex-hooks.mjs --check (.opencode/commands/doctor/_routes.yaml:189-203). Its YAML contract also says the diagnostic takes no arguments and derives state from the current canonical trees (.opencode/commands/doctor/assets/doctor-runtime-mirrors.yaml:23-58).

That makes a linked-worktree run fail before the doctor can compare the user-global Codex hook file against the primary checkout.

### F-004-002 — The installer already has the right explicit selector

The installer accepts --repo <path>, --source <file>, --target <file>, --check, --dry-run, and --allow-worktree (.opencode/bin/install-codex-hooks.mjs:8-54). --repo controls the checkout used for the worktree safety check, source default, path substitution, and orphan detection (.opencode/bin/install-codex-hooks.mjs:296-317,361-381). The runtime-mirror generator itself only accepts no arguments or --check and derives REPO_ROOT from its own location (.opencode/skills/system-spec-kit/scripts/runtime-mirrors/sync-runtime-mirrors.cjs:32-47,248-252).

The exact route-level syntax should therefore be:

/doctor runtime-mirrors --repo <checkout>

Use the space-separated form because the installer parser accepts --repo followed by a value; --repo=<checkout> is not its documented grammar.

### Recommended contract

- No --repo: preserve the current read-only default. Run all mirror checks against the current checkout and report the resolved current/primary checkout relationship before the Codex hook check.
- --repo <checkout>: select the checkout passed to the Codex installer as --check --repo <checkout>; show the selected path in the diagnostic header and keep all checkers in check-only mode.
- Do not expose --allow-worktree through the doctor route. It bypasses the installer’s linked-worktree anchor refusal, while the design record explicitly chose refusal-by-default and a deliberate override for testing (.opencode/specs/cli-external-orchestration/027-cli-codex-revival/009-codex-hook-install-robustness/decision-record.md:90-110). If testing a worktree intentionally, that should remain an explicit installer command outside the doctor route.

One boundary remains: the other mirror checkers currently have no root-selection argument. The route must either document --repo as the Codex-hook source selector or add common-root plumbing before claiming that the flag rebases every checker. The evidence supports the former as the smallest safe handoff.

## Questions Answered

- The iteration-3 question is answered: expose --repo <checkout> at /doctor runtime-mirrors, default to no selector, and pass the selected path explicitly to the installer’s read-only --check.
- The linked-worktree question is answered: resolve or display the primary checkout, but do not turn --allow-worktree into a doctor default or hidden fallback.

## Questions Remaining

- Should the route auto-select the Git primary checkout for the Codex-hook checker when invoked from a linked worktree, or require the operator to provide --repo after showing the detected primary path?
- If route-wide source selection is desired later, which shared root option should be added to the runtime-mirror, Codex generator, roster, and Pi checkers without changing their no-argument read-only behavior?

## Next Focus

Trace the create-skill and doctor skill-advisor handoff to determine whether new-skill creation should emit an explicit index-maintenance handoff or invoke a trusted scan automatically.
