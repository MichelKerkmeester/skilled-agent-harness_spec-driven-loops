## Edit 1

File: `.skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/corpus.mjs`

OLD:

~~~~text
/**
 * Walk roots, in the order they are visited. `.opencode/install-guides`
 * carries well-formed `trigger_phrases` frontmatter and is already reachable
 * by the ripgrep lane's broader `.opencode` root, so leaving it out here would
 * be a pure asymmetry rather than a deliberate scope choice. `.opencode/hooks`
 * carries the goal contract documents, which an operator asks for by name and
~~~~

NEW:

~~~~text
/**
 * Walk roots, in the order they are visited. `.skilled/install-guides`
 * carries well-formed `trigger_phrases` frontmatter and is already reachable
 * by the ripgrep lane's broader `.skilled` root, so leaving it out here would
 * be a pure asymmetry rather than a deliberate scope choice. `.skilled/hooks`
 * carries the goal contract documents, which an operator asks for by name and
~~~~

## Edit 2

File: `.skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/corpus.mjs`

OLD:

~~~~text
 */
export const CORPUS_ROOTS = Object.freeze(['specs', '.opencode/skills', '.opencode/install-guides', '.opencode/hooks']);

/**
~~~~

NEW:

~~~~text
 */
export const CORPUS_ROOTS = Object.freeze(['specs', '.skilled/skills', '.skilled/install-guides', '.skilled/hooks']);

/**
~~~~
