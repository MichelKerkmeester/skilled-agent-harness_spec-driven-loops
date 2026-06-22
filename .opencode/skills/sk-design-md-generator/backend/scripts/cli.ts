#!/usr/bin/env node
// ────────────────────────────────────────────────────────────────
// MODULE: CLI Entry Point
// ────────────────────────────────────────────────────────────────


/**
 * Design System Extractor CLI
 *
 * Quick extraction mode — runs Phase 1 (crawl + extract + cluster) and outputs tokens.json.
 * For full DESIGN.md generation, use the Claude Code skill `/design-md`.
 *
 * Usage (--output is REQUIRED and must point at a spec folder, not the skill):
 *   npx ts-node scripts/extract.ts <url> --output <spec-folder>/output [options]
 *   npx ts-node scripts/extract.ts https://stripe.com --max-pages 10 --output .opencode/specs/<track>/<packet>/output
 *   npx ts-node scripts/extract.ts https://example.com --output .opencode/specs/<track>/<packet>/output --wait-for css
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
