#!/usr/bin/env node

/**
 * design-md-gen CLI
 *
 * Quick extraction mode — runs Phase 1 (crawl + extract + cluster) and outputs tokens.json.
 * For full DESIGN.md generation, use the Claude Code skill `/design-md`.
 *
 * Usage:
 *   npx design-md-gen <url> [options]
 *   npx design-md-gen https://stripe.com --max-pages 10
 *   npx design-md-gen https://example.com --output ./my-output --wait-for css
 */

import { extract, parseArgs } from './extract';

async function main(): Promise<void> {
  const options = parseArgs(process.argv);

  console.log(`
┌─────────────────────────────────────────────────┐
│  design-md-gen — Design Token Extractor          │
│  Extracting from: ${options.urls[0].slice(0, 30).padEnd(30)}│
│  Output: ${options.output.slice(0, 39).padEnd(39)}│
└─────────────────────────────────────────────────┘
`);

  await extract(options);

  console.log(`
✅ Extraction complete!

Next steps:
  1. Review tokens.json in ${options.output}/
  2. Use Claude Code with /design-md to generate your DESIGN.md
     Or: provide tokens.json to any LLM with the SKILL.md prompt

  Preview: npx ts-node scripts/preview-gen.ts ${options.output}/tokens.json
  Validate: npx ts-node scripts/validate.ts <design-md-path> ${options.output}/tokens.json
`);
}

main().catch((err) => {
  console.error('Fatal error:', err.message ?? err);
  process.exit(1);
});
