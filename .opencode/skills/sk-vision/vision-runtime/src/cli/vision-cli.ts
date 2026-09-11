#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Vision CLI
// ───────────────────────────────────────────────────────────────────
// The entry for hosts that can run a command but cannot load an in-process
// adapter. Cursor is the case that requires it: its only prompt-time hook
// event is not delivered by the CLI build, so the command file and the
// always-apply rule invoke this instead.
//
// Output contract: the evidence block on stdout and exit 0, or a single
// SK_VISION_ERROR line on stderr and a non-zero exit. A caller pasting stdout
// into a model prompt should never have to strip diagnostics out of it.

import { fileURLToPath } from "node:url";
import { resolve } from "node:path";
import { evidenceForPrompt, renderEvidence, wrapEvidence } from "../evidence/prompt-evidence.js";

// ─────────────────────────────────────────────────────────────────────────────
// 1. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const USAGE = `sk-vision — local vision evidence for one image

Usage:
  sk-vision <image-path> [question...]   Analyze an image by path
  sk-vision --from-text "<text>"         Find an image path inside text, then analyze
  sk-vision --help

Exit codes:
  0  evidence written to stdout
  1  runtime or usage error, reason on stderr
  2  no image found (only with --from-text)`;

// ─────────────────────────────────────────────────────────────────────────────
// 2. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function reportError(error: unknown): void {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`SK_VISION_ERROR: ${message}\n`);
}

/** True when this module was executed directly rather than imported by a test. */
function isMainModule(): boolean {
  const entry = process.argv[1];
  if (!entry) return false;
  try {
    return fileURLToPath(import.meta.url) === resolve(entry);
  } catch {
    return false;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. CORE LOGIC
// ─────────────────────────────────────────────────────────────────────────────

export async function run(argv: readonly string[], cwd: string): Promise<number> {
  if (argv.length === 0 || argv[0] === "--help" || argv[0] === "-h") {
    process.stdout.write(`${USAGE}\n`);
    return 0;
  }

  if (argv[0] === "--from-text") {
    const text = argv[1];
    if (typeof text !== "string") {
      process.stderr.write("SK_VISION_ERROR: --from-text requires a text argument\n");
      return 1;
    }
    const question = argv.slice(2).join(" ");
    const block = await evidenceForPrompt(text, cwd, { question });
    if (!block) {
      process.stderr.write("SK_VISION_ERROR: no image path found in the supplied text\n");
      return 2;
    }
    process.stdout.write(`${block}\n`);
    return 0;
  }

  const imagePath = argv[0];
  if (!imagePath) {
    process.stderr.write("SK_VISION_ERROR: an image path is required\n");
    return 1;
  }
  const question = argv.slice(1).join(" ");
  const rendered = await renderEvidence(imagePath, { question, projectDir: cwd });
  process.stdout.write(`${wrapEvidence(rendered)}\n`);
  return 0;
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. ENTRYPOINT
// ─────────────────────────────────────────────────────────────────────────────

if (isMainModule()) {
  run(process.argv.slice(2), process.cwd())
    .then((code) => process.exit(code))
    .catch((error: unknown) => {
      reportError(error);
      process.exit(1);
    });
}
