// ───────────────────────────────────────────────────────────────
// MODULE: Scorer probe Vitest config
// ───────────────────────────────────────────────────────────────
import base from '../../../../../../../../.skilled/skills/system-skill-advisor/runtime/vitest.config.ts';

// Probe config kept inside this review lineage: the test file lives here and
// imports the runtime sources, while the cache directory also stays here so the
// review writes nothing into the runtime package.
export default {
  ...base,
  root: '/Users/michelkerkmeester/worktrees/public/352-command-surfacing-research',
  cacheDir: '/Users/michelkerkmeester/worktrees/public/352-command-surfacing-research/specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/lineages/scorer-attach-4/probes/.vite',
  test: {
    ...base.test,
    include: [
      'specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/lineages/scorer-attach-4/probes/**/*.vitest.ts',
    ],
  },
};
