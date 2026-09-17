## Edit 1

File: `.skilled/skills/system-spec-kit/runtime/cli/retrieval/rg-wrapper.mjs`

OLD:

~~~~text
/** Search roots the convention names. */
export const DEFAULT_SEARCH_ROOTS = Object.freeze(['specs', '.opencode']);

/**
~~~~

NEW:

~~~~text
/** Search roots the convention names. */
export const DEFAULT_SEARCH_ROOTS = Object.freeze(['specs', '.skilled']);

/**
~~~~

## Edit 2

File: `.skilled/skills/system-spec-kit/runtime/cli/retrieval/rg-wrapper.mjs`

OLD:

~~~~text
 * `--hidden` belongs here for the same reason it is in the shared lane: the
 * `.opencode` root holds dotted directories with live documentation, and
 * without it a miss there reads as a clean no-match.
~~~~

NEW:

~~~~text
 * `--hidden` belongs here for the same reason it is in the shared lane: the
 * `.skilled` root holds dotted directories with live documentation, and
 * without it a miss there reads as a clean no-match.
~~~~
