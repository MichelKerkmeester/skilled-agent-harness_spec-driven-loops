#!/usr/bin/env node
/**
 * minify-webflow.mjs - Batch minification for Webflow JavaScript files
 *
 * Usage:
 *   node scripts/minify-webflow.mjs          # Normal run (skip unchanged)
 *   node scripts/minify-webflow.mjs --force  # Force re-minify all
 *
 * Minifies all JavaScript files from src/2_javascript/ to src/2_javascript/z_minified/
 * Uses terser with --compress --mangle for safe minification.
 */

import { execSync } from 'child_process';
import { readdirSync, statSync, existsSync, readFileSync, mkdirSync, writeFileSync } from 'fs';
import { join, dirname, relative } from 'path';
import { createHash } from 'crypto';

// Configuration
const SOURCE_DIR = 'src/2_javascript';
const OUTPUT_DIR = 'src/2_javascript/z_minified';
const MANIFEST_FILE = join(OUTPUT_DIR, 'manifest.tsv');

// Folders to skip (already minified or not for production)
const SKIP_FOLDERS = ['z_minified', 'node_modules', '.git'];

// Parse arguments
const args = process.argv.slice(2);
const FORCE_MODE = args.includes('--force');

/**
 * Get MD5 hash of file content
 */
function getFileHash(filePath) {
  const content = readFileSync(filePath, 'utf-8');
  return createHash('md5').update(content).digest('hex');
}

/**
 * Recursively find all .js files in directory
 */
function findJsFiles(dir, baseDir = dir) {
  const files = [];

  if (!existsSync(dir)) {
    console.error(`Directory not found: ${dir}`);
    return files;
  }

  const entries = readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);

    if (entry.isDirectory()) {
      if (!SKIP_FOLDERS.includes(entry.name)) {
        files.push(...findJsFiles(fullPath, baseDir));
      }
    } else if (entry.isFile() && entry.name.endsWith('.js')) {
      files.push(relative(baseDir, fullPath));
    }
  }

  return files;
}

/**
 * Minify a single file using terser
 */
function minifyFile(relativePath) {
  const sourcePath = join(SOURCE_DIR, relativePath);
  const outputPath = join(OUTPUT_DIR, relativePath);
  const outputDir = dirname(outputPath);

  // Ensure output directory exists
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  // Get source file size
  const sourceSize = statSync(sourcePath).size;

  try {
    // Run terser
    execSync(`npx terser "${sourcePath}" --compress --mangle -o "${outputPath}"`, {
      stdio: 'pipe'
    });

    // Get output file size
    const outputSize = statSync(outputPath).size;
    const reduction = ((1 - outputSize / sourceSize) * 100).toFixed(1);

    return {
      success: true,
      sourceSize,
      outputSize,
      reduction
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Load existing manifest (hash tracking)
 */
function loadManifest() {
  const manifest = new Map();

  if (existsSync(MANIFEST_FILE)) {
    const content = readFileSync(MANIFEST_FILE, 'utf-8');
    const lines = content.trim().split('\n').slice(1); // Skip header

    for (const line of lines) {
      const [file, hash] = line.split('\t');
      if (file && hash) {
        manifest.set(file, hash);
      }
    }
  }

  return manifest;
}

/**
 * Save manifest
 */
function saveManifest(manifest) {
  const lines = ['file\thash'];
  for (const [file, hash] of manifest.entries()) {
    lines.push(`${file}\t${hash}`);
  }

  const outputDir = dirname(MANIFEST_FILE);
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  writeFileSync(MANIFEST_FILE, lines.join('\n') + '\n');
}

// Main execution
async function main() {
  console.log('=== MINIFY-WEBFLOW ===\n');
  console.log(`Mode: ${FORCE_MODE ? 'FORCE (re-minify all)' : 'NORMAL (skip unchanged)'}`);
  console.log(`Source: ${SOURCE_DIR}`);
  console.log(`Output: ${OUTPUT_DIR}\n`);

  // Find all JS files
  const files = findJsFiles(SOURCE_DIR);
  console.log(`Found ${files.length} JavaScript files\n`);

  if (files.length === 0) {
    console.log('No files to process.');
    return;
  }

  // Load manifest for change detection
  const manifest = loadManifest();

  let updated = 0;
  let unchanged = 0;
  let failed = 0;
  let totalSourceSize = 0;
  let totalOutputSize = 0;

  for (const file of files) {
    const sourcePath = join(SOURCE_DIR, file);
    const outputPath = join(OUTPUT_DIR, file);
    const currentHash = getFileHash(sourcePath);
    const previousHash = manifest.get(file);

    // Skip if unchanged (unless force mode)
    if (!FORCE_MODE && previousHash === currentHash && existsSync(outputPath)) {
      const sourceSize = statSync(sourcePath).size;
      const outputSize = statSync(outputPath).size;
      totalSourceSize += sourceSize;
      totalOutputSize += outputSize;

      console.log(`= ${file} [unchanged]`);
      unchanged++;
      continue;
    }

    // Minify the file
    const result = minifyFile(file);

    if (result.success) {
      totalSourceSize += result.sourceSize;
      totalOutputSize += result.outputSize;
      manifest.set(file, currentHash);

      console.log(`→ ${file} (${result.sourceSize}B → ${result.outputSize}B) [-${result.reduction}%]`);
      updated++;
    } else {
      console.log(`✗ ${file} - ERROR: ${result.error}`);
      failed++;
    }
  }

  // Save updated manifest
  const manifestDir = dirname(MANIFEST_FILE);
  if (!existsSync(manifestDir)) {
    mkdirSync(manifestDir, { recursive: true });
  }

  const manifestLines = ['file\thash'];
  for (const [file, hash] of manifest.entries()) {
    manifestLines.push(`${file}\t${hash}`);
  }
  writeFileSync(MANIFEST_FILE, manifestLines.join('\n') + '\n');

  // Summary
  const totalReduction = totalSourceSize > 0
    ? ((1 - totalOutputSize / totalSourceSize) * 100).toFixed(2)
    : 0;

  console.log('\n=== SUMMARY ===');
  console.log(`Updated:   ${updated}`);
  console.log(`Unchanged: ${unchanged}`);
  console.log(`Failed:    ${failed}`);
  console.log(`Total reduction: ${totalReduction}%`);

  if (failed > 0) {
    console.log('\n⚠️  Some files failed to minify. Check errors above.');
    process.exit(1);
  }

  console.log('\n✓ Minification complete');
  console.log('Next: Run verify-minification.mjs to validate');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
