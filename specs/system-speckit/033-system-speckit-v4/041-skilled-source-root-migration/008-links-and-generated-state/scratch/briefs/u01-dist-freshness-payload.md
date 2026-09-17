## Edit 1

File: `.skilled/skills/system-spec-kit/runtime/cli/lib/dist-freshness.cjs`

OLD:

~~~~text
    name: '@spec-kit/shared',
    root: '.opencode/skills/system-spec-kit/shared',
    distEntries: { default: 'dist/tsconfig.tsbuildinfo' },
    rebuildCommand: 'cd .opencode/skills/system-spec-kit/shared && npm run build',
    sourceCandidates: ['.'],
~~~~

NEW:

~~~~text
    name: '@spec-kit/shared',
    root: '.skilled/skills/system-spec-kit/shared',
    distEntries: { default: 'dist/tsconfig.tsbuildinfo' },
    rebuildCommand: 'cd .skilled/skills/system-spec-kit/shared && npm run build',
    sourceCandidates: ['.'],
~~~~

## Edit 2

File: `.skilled/skills/system-spec-kit/runtime/cli/lib/dist-freshness.cjs`

OLD:

~~~~text
    name: '@spec-kit/cli',
    root: '.opencode/skills/system-spec-kit/runtime/cli',
    distEntries: {
~~~~

NEW:

~~~~text
    name: '@spec-kit/cli',
    root: '.skilled/skills/system-spec-kit/runtime/cli',
    distEntries: {
~~~~

## Edit 3

File: `.skilled/skills/system-spec-kit/runtime/cli/lib/dist-freshness.cjs`

OLD:

~~~~text
    },
    rebuildCommand: 'cd .opencode/skills/system-spec-kit/runtime/cli && npm run build',
    sourceCandidates: ['.'],
~~~~

NEW:

~~~~text
    },
    rebuildCommand: 'cd .skilled/skills/system-spec-kit/runtime/cli && npm run build',
    sourceCandidates: ['.'],
~~~~

## Edit 4

File: `.skilled/skills/system-spec-kit/runtime/cli/lib/dist-freshness.cjs`

OLD:

~~~~text
    name: '@spec-kit/runtime',
    root: '.opencode/skills/system-spec-kit/runtime',
    distEntries: {
~~~~

NEW:

~~~~text
    name: '@spec-kit/runtime',
    root: '.skilled/skills/system-spec-kit/runtime',
    distEntries: {
~~~~

## Edit 5

File: `.skilled/skills/system-spec-kit/runtime/cli/lib/dist-freshness.cjs`

OLD:

~~~~text
    },
    rebuildCommand: 'cd .opencode/skills/system-spec-kit/runtime && npm run build',
    sourceCandidates: [
~~~~

NEW:

~~~~text
    },
    rebuildCommand: 'cd .skilled/skills/system-spec-kit/runtime && npm run build',
    sourceCandidates: [
~~~~

## Edit 6

File: `.skilled/skills/system-spec-kit/runtime/cli/lib/dist-freshness.cjs`

OLD:

~~~~text
    name: '@utcp/code-mode-mcp',
    root: '.opencode/skills/mcp-code-mode/mcp-server',
    distEntries: { default: 'dist/index.js' },
    rebuildCommand: 'cd .opencode/skills/mcp-code-mode/mcp-server && npm run build',
    sourceCandidates: ['package.json', 'tsconfig.json', 'index.ts'],
~~~~

NEW:

~~~~text
    name: '@utcp/code-mode-mcp',
    root: '.skilled/skills/mcp-code-mode/mcp-server',
    distEntries: { default: 'dist/index.js' },
    rebuildCommand: 'cd .skilled/skills/mcp-code-mode/mcp-server && npm run build',
    sourceCandidates: ['package.json', 'tsconfig.json', 'index.ts'],
~~~~

## Edit 7

File: `.skilled/skills/system-spec-kit/runtime/cli/lib/dist-freshness.cjs`

OLD:

~~~~text
    name: '@spec-kit/system-skill-advisor',
    root: '.opencode/skills/system-skill-advisor/runtime',
    distEntries: {
~~~~

NEW:

~~~~text
    name: '@spec-kit/system-skill-advisor',
    root: '.skilled/skills/system-skill-advisor/runtime',
    distEntries: {
~~~~

## Edit 8

File: `.skilled/skills/system-spec-kit/runtime/cli/lib/dist-freshness.cjs`

OLD:

~~~~text
    },
    rebuildCommand: 'cd .opencode/skills/system-skill-advisor/runtime && npm run build',
    sourceCandidates: [
~~~~

NEW:

~~~~text
    },
    rebuildCommand: 'cd .skilled/skills/system-skill-advisor/runtime && npm run build',
    sourceCandidates: [
~~~~

## Edit 9

File: `.skilled/skills/system-spec-kit/runtime/cli/lib/dist-freshness.cjs`

OLD:

~~~~text
    name: 'design-system-extractor',
    root: '.opencode/skills/sk-design/sk-design-md-generator/backend',
    distEntries: { default: 'dist/cli.js' },
    rebuildCommand: 'cd .opencode/skills/sk-design/sk-design-md-generator/backend && npm run build',
    sourceCandidates: ['package.json', 'tsconfig.json', 'tsconfig.build.json', 'scripts'],
~~~~

NEW:

~~~~text
    name: 'design-system-extractor',
    root: '.skilled/skills/sk-design/sk-design-md-generator/backend',
    distEntries: { default: 'dist/cli.js' },
    rebuildCommand: 'cd .skilled/skills/sk-design/sk-design-md-generator/backend && npm run build',
    sourceCandidates: ['package.json', 'tsconfig.json', 'tsconfig.build.json', 'scripts'],
~~~~
