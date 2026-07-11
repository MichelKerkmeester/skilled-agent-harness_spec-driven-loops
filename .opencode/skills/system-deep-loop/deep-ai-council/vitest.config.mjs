// Vitest config for the deep-ai-council script suite.
// The suite uses the `.vitest.ts` extension, which is outside Vitest's default
// include globs (`*.test.ts` / `*.spec.ts`), so the include is set explicitly.
// Run from this directory: `npx vitest run` (the vitest binary resolves from the
// repo-root install; this skill ships no node_modules of its own).
export default {
  test: {
    include: ['scripts/tests/**/*.vitest.ts'],
    environment: 'node',
    pool: 'forks',
  },
};
