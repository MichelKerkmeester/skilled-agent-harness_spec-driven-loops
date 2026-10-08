#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Template Phrase Lint
// ───────────────────────────────────────────────────────────────────
// Check only trigger phrases introduced into staged Markdown.

// ───────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ───────────────────────────────────────────────────────────────────

import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { judgeTriggerPhrase } from '../retrieval/lib/phrase-judge.mjs';
import { normalizeTriggerText } from '../retrieval/lib/normalize.mjs';
import { parseFrontmatter } from './template-phrase-census.mjs';

// ───────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ───────────────────────────────────────────────────────────────────

const SCRIPT = 'template-phrase-lint';
const BLOCKING_CLASSES = new Set(['template-default', 'editor-fallback']);

// ───────────────────────────────────────────────────────────────────
// 3. GIT HELPERS
// ───────────────────────────────────────────────────────────────────

function gitOutput(args, cwd) {
  return execFileSync('git', args, {
    cwd,
    encoding: 'buffer',
    stdio: ['ignore', 'pipe', 'pipe'],
  });
}

function stagedMarkdownChanges(root) {
  const names = gitOutput([
    'diff', '--cached', '--name-status', '--find-renames', '-z',
    '--diff-filter=ACMR', '--', '*.md',
  ], root).toString('utf8').split('\0').filter(Boolean);
  const changes = [];

  for (let index = 0; index < names.length;) {
    const status = names[index++];
    if (status.startsWith('R') || status.startsWith('C')) {
      const oldPath = names[index++];
      const newPath = names[index++];
      if (oldPath && newPath) changes.push({ oldPath, newPath });
    } else {
      const newPath = names[index++];
      if (newPath) changes.push({ oldPath: newPath, newPath });
    }
  }

  return changes;
}

function readGitBlob(root, revisionPath) {
  try {
    return gitOutput(['show', revisionPath], root).toString('utf8');
  } catch {
    return null;
  }
}

function triggerPhrases(content) {
  if (content === null) return [];
  const frontmatter = parseFrontmatter(content);
  if (!frontmatter.ok || !Array.isArray(frontmatter.data?.trigger_phrases)) return [];
  return frontmatter.data.trigger_phrases.filter((phrase) => typeof phrase === 'string');
}

// ───────────────────────────────────────────────────────────────────
// 4. LINT
// ───────────────────────────────────────────────────────────────────

function lintStagedPhrases(root) {
  const changes = stagedMarkdownChanges(root);
  let blocked = 0;
  let warned = 0;
  let added = 0;

  for (const { oldPath, newPath } of changes) {
    const stagedContent = readGitBlob(root, `:${newPath}`);
    if (stagedContent === null) continue;

    const oldContent = readGitBlob(root, `HEAD:${oldPath}`);
    const existing = new Set(triggerPhrases(oldContent).map(normalizeTriggerText));
    const newPhrases = triggerPhrases(stagedContent);

    for (const phrase of newPhrases) {
      if (existing.has(normalizeTriggerText(phrase))) continue;
      added += 1;
      const result = judgeTriggerPhrase(phrase);
      if (!result) continue;

      const blocksCommit = BLOCKING_CLASSES.has(result.negativeClass);
      if (blocksCommit) blocked += 1;
      else warned += 1;
      const level = blocksCommit ? 'BLOCKED' : 'WARNING';
      process.stderr.write(
        `${level} [gate:${SCRIPT}]: ${newPath}: ${JSON.stringify(phrase)} `
        + `[${result.negativeClass}] ${result.reason}\n`,
      );
    }
  }

  if (blocked === 0 && warned === 0) {
    process.stdout.write(`${SCRIPT}: checked ${changes.length} staged Markdown file(s), ${added} new phrase(s)\n`);
  }
  return blocked > 0 ? 1 : 0;
}

function main() {
  if (process.env.SPECKIT_SKIP_PHRASE_LINT === '1') {
    process.stdout.write(`${SCRIPT}: skipped by SPECKIT_SKIP_PHRASE_LINT=1\n`);
    return 0;
  }

  let root;
  try {
    root = gitOutput(['rev-parse', '--show-toplevel'], process.cwd()).toString('utf8').trim();
  } catch {
    process.stderr.write(`WARNING [gate:${SCRIPT}]: could not locate a Git worktree; phrase checks skipped.\n`);
    return 0;
  }

  try {
    return lintStagedPhrases(path.resolve(root));
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    process.stderr.write(`WARNING [gate:${SCRIPT}]: could not read staged phrases; checks skipped: ${message}\n`);
    return 0;
  }
}

if (process.argv[1] !== undefined && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  process.exitCode = main();
}
