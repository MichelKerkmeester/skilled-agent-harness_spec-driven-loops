## Edit 1

File: `.skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/rg-lane.mjs`

OLD:

~~~~text
 * Flags shared by every recipe. `--hidden` is part of the contract because the
 * default roots include `.opencode`, whose own subtrees hold dotted directories
 * with live documentation; without the flag ripgrep skips them silently, so a
~~~~

NEW:

~~~~text
 * Flags shared by every recipe. `--hidden` is part of the contract because the
 * default roots include `.skilled`, whose own subtrees hold dotted directories
 * with live documentation; without the flag ripgrep skips them silently, so a
~~~~

## Edit 2

File: `.skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/rg-lane.mjs`

OLD:

~~~~text
/** Default search roots. */
export const DEFAULT_ROOTS = Object.freeze(['specs', '.opencode']);

/** Exit-status classes. Anything at or above the error floor is an execution fault. */
~~~~

NEW:

~~~~text
/** Default search roots. */
export const DEFAULT_ROOTS = Object.freeze(['specs', '.skilled']);

/** Exit-status classes. Anything at or above the error floor is an execution fault. */
~~~~
