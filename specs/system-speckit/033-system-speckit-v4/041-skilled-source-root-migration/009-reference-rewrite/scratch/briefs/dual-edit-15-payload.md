## Edit 1

File: `.skilled/skills/system-spec-kit/runtime/cli/retrieval/sweep-memory-residue.mjs`

OLD:

~~~~text
  if (has('commands')) return 'commands';
  if (CONFIG_EXTENSIONS.has(extension) && segments[0] !== '.opencode' && segments[0] !== 'specs') return 'config';
  if (CODE_EXTENSIONS.has(extension)) return 'code';
  if (segments[0] === '.opencode' && segments[1] === 'skills') return 'skills';
  if (DOC_EXTENSIONS.has(extension)) return 'docs';
~~~~

NEW:

~~~~text
  if (has('commands')) return 'commands';
  if (CONFIG_EXTENSIONS.has(extension) && segments[0] !== '.skilled' && segments[0] !== '.opencode' && segments[0] !== 'specs') return 'config';
  if (CODE_EXTENSIONS.has(extension)) return 'code';
  if ((segments[0] === '.skilled' || segments[0] === '.opencode') && segments[1] === 'skills') return 'skills';
  if (DOC_EXTENSIONS.has(extension)) return 'docs';
~~~~
