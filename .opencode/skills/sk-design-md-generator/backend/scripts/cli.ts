#!/usr/bin/env node
// ────────────────────────────────────────────────────────────────
// MODULE: CLI Entry Point
// ────────────────────────────────────────────────────────────────


/**
 * Design System Extractor CLI
 *
 * Quick extraction mode — runs Phase 1 (crawl + extract + cluster) and outputs tokens.json.
 * For full DESIGN.md generation, use the `sk-design-md-generator` skill WRITE phase.
 *
 * Usage (run from the repo root; --output is REQUIRED and must resolve to a spec
 * folder outside the skill):
 *   npx ts-node .opencode/skills/sk-design-md-generator/backend/scripts/extract.ts <url> --output <spec-folder>/output [options]
 *   npx ts-node .opencode/skills/sk-design-md-generator/backend/scripts/extract.ts https://stripe.com --max-pages 10 --output .opencode/specs/<track>/<packet>/output
 *   npx ts-node .opencode/skills/sk-design-md-generator/backend/scripts/extract.ts https://example.com --output .opencode/specs/<track>/<packet>/output --wait-for css
 */

// ────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ────────────────────────────────────────────────────────────────

import { extract, parseArgs } from './extract';

// ────────────────────────────────────────────────────────────────
// 2. CORE LOGIC
// ────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  const options = parseArgs(process.argv);

  console.log(`
┌─────────────────────────────────────────────────┐
│  Design System Extractor          │
│  Extracting from: ${options.urls[0].slice(0, 30).padEnd(30)}│
│  Output: ${options.output.slice(0, 39).padEnd(39)}│
└─────────────────────────────────────────────────┘
`);

  await extract(options);

  console.log(`
✅ Extraction complete!

Next steps:
  1. Review tokens.json in ${options.output}/
  2. Run the sk-design-md-generator WRITE phase to generate your DESIGN.md
     (build-write-prompt.ts pre-renders the value sections; you author the prose)

  Preview: npx ts-node scripts/preview-gen.ts ${options.output}/tokens.json
  Validate: npx ts-node scripts/validate.ts <design-md-path> ${options.output}/tokens.json
`);
}

main().catch((err) => {
  console.error('Fatal error:', err.message ?? err);
  process.exit(1);
});
