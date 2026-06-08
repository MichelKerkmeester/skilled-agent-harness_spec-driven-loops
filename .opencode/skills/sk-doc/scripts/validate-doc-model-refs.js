#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────
// MODULE: sk-doc Doc-Model-Reference Validator
// ───────────────────────────────────────────────────────────────
// Enforces the doc-implementation cross-checking mandate.
// Detects doc drift where markdown cites a non-canonical model name as default.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ───────────────────────────────────────────────────────────────
// Canonical model loaders
// ───────────────────────────────────────────────────────────────

function loadCanonicalModels() {
  const registryPath = path.join(
    __dirname,
    '../../system-spec-kit/shared/embeddings/registry.ts'
  );

  const canonical = new Set();

  // Load from registry.ts
  if (fs.existsSync(registryPath)) {
    const registryContent = fs.readFileSync(registryPath, 'utf-8');

    // Extract MANIFESTS[].name
    const manifestNameMatches = registryContent.matchAll(/name:\s*['"]([^'"]+)['"]/g);
    for (const match of manifestNameMatches) {
      canonical.add(match[1]);
    }

    // Extract CLOUD_CANONICAL values
    // bugfix: was missing /g flag → matchAll throws TypeError swallowed by outer
    // try/catch → canonical set silently empty → false-positive DRIFT on every cited name.
    const cloudCanonicalMatches = registryContent.matchAll(
      /CLOUD_CANONICAL.*?{([^}]+)}/gs
    );
    for (const match of cloudCanonicalMatches) {
      const objContent = match[1];
      const valueMatches = objContent.matchAll(/['"]([^'"]+)['"]/g);
      for (const valueMatch of valueMatches) {
        if (valueMatch[1] !== 'voyage' && valueMatch[1] !== 'openai') {
          canonical.add(valueMatch[1]);
        }
      }
    }

    // Extract RERANKER_CANONICAL values
    // bugfix: was missing /g flag (same bug as CLOUD_CANONICAL above).
    const rerankerCanonicalMatches = registryContent.matchAll(
      /RERANKER_CANONICAL.*?{([^}]+)}/gs
    );
    for (const match of rerankerCanonicalMatches) {
      const objContent = match[1];
      const valueMatches = objContent.matchAll(/['"]([^'"]+)['"]/g);
      for (const valueMatch of valueMatches) {
        if (
          valueMatch[1] !== 'local' &&
          valueMatch[1] !== 'voyage' &&
          valueMatch[1] !== 'cohere' &&
          valueMatch[1] !== ''
        ) {
          canonical.add(valueMatch[1]);
        }
      }
    }
  }

  // bugfix: normalize wrapper prefixes (e.g. sbert/) so docs that cite
  // the underlying HuggingFace model id (`nomic-ai/CodeRankEmbed`) match
  // canonical entries that include the wrapper prefix (`sbert/nomic-ai/CodeRankEmbed`).
  const WRAPPER_PREFIXES = ['sbert/'];
  for (const name of Array.from(canonical)) {
    for (const prefix of WRAPPER_PREFIXES) {
      if (name.startsWith(prefix)) {
        canonical.add(name.slice(prefix.length));
      }
    }
  }

  return canonical;
}

// ───────────────────────────────────────────────────────────────
// File utilities
// ───────────────────────────────────────────────────────────────

function findMarkdownFiles(rootDir, excludePatterns) {
  const files = [];

  function walkDir(dir, relativePath = '') {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      const relPath = path.join(relativePath, entry.name);

      // Check if this path should be excluded
      let shouldExclude = false;
      for (const pattern of excludePatterns) {
        // Convert glob pattern to regex
        const regexPattern = pattern
          .replace(/\*\*/g, '.*')
          .replace(/\*/g, '[^/]*')
          .replace(/\?/g, '.');
        const regex = new RegExp(regexPattern);
        if (regex.test(relPath) || regex.test(entry.name)) {
          shouldExclude = true;
          break;
        }
      }

      if (shouldExclude) {
        continue;
      }

      if (entry.isDirectory()) {
        walkDir(fullPath, relPath);
      } else if (entry.isFile() && entry.name.endsWith('.md')) {
        files.push(fullPath);
      }
    }
  }

  walkDir(rootDir);
  return files;
}

// ───────────────────────────────────────────────────────────────
// Doc scanning
// ───────────────────────────────────────────────────────────────

const LEGACY_MODEL_NAMES = [
  'embeddinggemma-300m',
  'BAAI/bge-base-en-v1.5',
  'BAAI/bge-reranker-v2-m3',
  'jina-v2-base-code',
  'jina-embeddings-v3',
  'jinaai/jina-reranker-v3',
  'onnx-community/embeddinggemma-300m-ONNX',
  'unsloth/embeddinggemma-300m-GGUF',
];

// Common model org prefixes to help identify actual model names
// bugfix: added `sbert/` wrapper prefix for sbert/-namespaced model ids
// (e.g. sbert/nomic-ai/CodeRankEmbed). Without this, multi-level wrapped names
// were not extractable by the regex on line 210 and false-positive flagged as drift.
const MODEL_ORG_PREFIXES = [
  'sbert/',
  'BAAI/',
  'jinaai/',
  'jina/',
  'nomic-ai/',
  'Qwen/',
  'onnx-community/',
  'unsloth/',
  'gaianet/',
  'voyageai/',
  'sentence-transformers/',
  'intfloat/',
  'thenlper/',
  'microsoft/',
  'facebook/',
  'google/',
  'openai/',
  'anthropic/',
  'cohere/',
];

const DEFAULT_MARKER_WORDS = [
  'current default',
  'default',
  'shipped default',
  'production default',
  'the default',
];

const INTENTIONAL_MARKER_WORDS = [
  'historical',
  'former default',
  'superseded',
  'pre-',
  'opt-in fallback',
  'previous default',
  'legacy',
  'deprecated',
  'retired',
];

// Matched tokens ending in a source/file extension are file paths caught by the
// org-prefix regex (e.g. openai/codex/.../discovery.rs), not model identifiers.
const FILE_LIKE_SUFFIX = /\.(rs|ts|tsx|js|cjs|mjs|py|md|json|jsonc|ya?ml|sh|toml|sqlite|lock)$/i;

// Chat/completion model ids are governed by the cli-* skills and sk-prompt model
// profiles, not this embeddings-drift check, and are never present in the embeddings
// registry. Without this skip, an org-prefix match sitting within the 50-char context
// window of the word "default" (e.g. `openai/gpt-5.5` beside "high reasoning default")
// always false-positives. Embedding ids under the same orgs (openai/text-embedding-*,
// google/embeddinggemma-*, cohere/rerank-*) are intentionally NOT matched here.
const CHAT_MODEL_SKIP = /^(?:openai\/(?:gpt-|o\d|chatgpt-)|anthropic\/claude|cohere\/command)/i;

function getModelPattern(canonicalModels) {
  // Match specific legacy model names OR org/name pattern with model-like characteristics
  const legacyPattern = LEGACY_MODEL_NAMES.map(escapeRegex).join('|');
  // More specific org/name pattern that looks like actual model identifiers
  // Only match if it starts with known model org prefixes
  const orgPattern = MODEL_ORG_PREFIXES.map(escapeRegex).join('|');
  // bugfix: added `/` to the suffix character class so multi-level wrapped
  // names like sbert/nomic-ai/CodeRankEmbed extract as a whole identifier instead
  // of being truncated to nomic-ai/CodeRankEmbed (which then fails canonical lookup).
  const orgNamePattern = `(${orgPattern})[a-zA-Z0-9._/-]+`;
  return new RegExp(`(${legacyPattern}|${orgNamePattern})`, 'g');
}

function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// A doc may cite a canonical model with its HuggingFace org prefix
// (e.g. `nomic-ai/nomic-embed-text-v1.5`) — that is the hf-local form
// registry getCanonicalFallback() constructs. The canonical set stores the bare
// manifest name (`nomic-embed-text-v1.5`), so strip ONE known org prefix and
// re-check. Precise: `BAAI/bge-base-en-v1.5` strips to `bge-base-en-v1.5`, which
// is NOT canonical, so true drift stays flagged.
function orgPrefixedCanonical(modelName, canonicalModels) {
  for (const prefix of MODEL_ORG_PREFIXES) {
    if (modelName.startsWith(prefix) && canonicalModels.has(modelName.slice(prefix.length))) {
      return true;
    }
  }
  return false;
}

function scanDoc(filePath, canonicalModels, verbose = false) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  const modelPattern = getModelPattern(canonicalModels);
  const drift = [];
  const intentional = [];

  lines.forEach((line, lineIndex) => {
    let match;
    while ((match = modelPattern.exec(line)) !== null) {
      const matchedText = match[0];
      // Extract the actual model name (strip quotes if present)
      let modelName = matchedText.replace(/^["']|["']$/g, '');

      // Skip file paths the org-prefix regex catches (e.g. openai/codex/.../foo.rs)
      if (FILE_LIKE_SUFFIX.test(modelName)) {
        continue;
      }

      // Skip chat/completion models — not embedding models, never in the registry.
      if (CHAT_MODEL_SKIP.test(modelName)) {
        continue;
      }

      // Skip if canonical directly, or as an org-prefixed form of a canonical bare name
      if (canonicalModels.has(modelName) || orgPrefixedCanonical(modelName, canonicalModels)) {
        continue;
      }

      // Get context (50 chars before and after)
      const matchStart = match.index;
      const matchEnd = match.index + matchedText.length;
      const contextStart = Math.max(0, matchStart - 50);
      const contextEnd = Math.min(line.length, matchEnd + 50);
      const context = line.substring(contextStart, contextEnd).toLowerCase();

      // Check for default markers
      const hasDefaultMarker = DEFAULT_MARKER_WORDS.some((word) =>
        context.includes(word)
      );

      // Check for intentional markers
      const hasIntentionalMarker = INTENTIONAL_MARKER_WORDS.some((word) =>
        context.includes(word)
      );

      if (hasDefaultMarker && !hasIntentionalMarker) {
        drift.push({
          line: lineIndex + 1,
          value: modelName,
          context: line.substring(contextStart, contextEnd),
        });
      } else if (verbose) {
        intentional.push({
          line: lineIndex + 1,
          value: modelName,
          context: line.substring(contextStart, contextEnd),
          reason: hasIntentionalMarker
            ? 'intentional marker'
            : 'no default marker',
        });
      }
    }
  });

  return { drift, intentional };
}

// ───────────────────────────────────────────────────────────────
// Main execution
// ───────────────────────────────────────────────────────────────

function main() {
  const args = process.argv.slice(2);
  const verbose = args.includes('--verbose');
  const help = args.includes('--help');

  if (help) {
    console.log(`
Doc-Model-Reference Validator
==============================

Detects doc drift where markdown cites a non-canonical model name as default.

Usage:
  node validate-doc-model-refs.js [--verbose] [--help]

Options:
  --verbose  Print all matches with context (drift + intentional)
  --help     Show this help message

Exits:
  0 - No drift found
  1 - Drift detected or error

Canonical sources:
  - .opencode/skills/system-spec-kit/shared/embeddings/registry.ts

Scanned paths:
  - .opencode/skills/**/*.md (excludes changelog/, scratch/, benchmarks/, *archive*, research/iterations/)
`);
    process.exit(0);
  }

  try {
    const canonicalModels = loadCanonicalModels();
    // Scan .opencode/skills/** per the documented scope. (Was '../../..' =>
    // .opencode/**, which over-scanned historical specs/ implementation records —
    // frozen provenance the canonical-drift check was never meant to police.)
    const skillsRoot = path.join(__dirname, '../../');

    const excludePatterns = [
      '**/changelog/**',
      '**/scratch/**',
      '**/benchmarks/**',
      '**/*archive*',
      '**/research/iterations/**',
    ];

    const files = findMarkdownFiles(skillsRoot, excludePatterns);

    let totalDrift = 0;
    const driftResults = [];

    for (const file of files) {
      const { drift, intentional } = scanDoc(file, canonicalModels, verbose);

      if (drift.length > 0) {
        totalDrift += drift.length;
        driftResults.push({ file, drift });
      }

      if (verbose && intentional.length > 0) {
        console.log(`\n${file} (intentional matches):`);
        intentional.forEach((match) => {
          console.log(
            `  Line ${match.line}: '${match.value}' - ${match.reason}`
          );
          console.log(`    Context: ${match.context}`);
        });
      }
    }

    if (driftResults.length > 0) {
      console.log('\nDRIFT DETECTED:\n');
      driftResults.forEach(({ file, drift }) => {
        const relPath = path.relative(skillsRoot, file);
        drift.forEach((match) => {
          console.log(
            `DRIFT: ${relPath}:${match.line}: cites '${match.value}' as default`
          );
          console.log(`  Context: ${match.context}`);
        });
      });
      console.log(`\nTotal drift: ${totalDrift} occurrence(s)`);
      process.exit(1);
    } else {
      if (verbose) {
        console.log('No drift detected.');
      }
      process.exit(0);
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}

main();
