// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Four-Runtime Agent Mirror Sync Verifier                                  ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

const fs = require('node:fs');
const path = require('node:path');

const RUNTIME_MIRRORS = Object.freeze([
  { runtime: 'opencode', template: '.opencode/agents/{name}.md', format: 'markdown' },
  { runtime: 'claude', template: '.claude/agents/{name}.md', format: 'markdown' },
  { runtime: 'codex', template: '.codex/agents/{name}.toml', format: 'codex-toml' },
  { runtime: 'gemini', template: '.gemini/agents/{name}.md', format: 'markdown' },
]);

function resolveMirrorPath(repoRoot, template, agentName) {
  return path.join(repoRoot, template.replace('{name}', agentName));
}

function stripFrontmatter(content) {
  return String(content || '').replace(/^---[\s\S]*?---\n/, '');
}

function extractCodexDeveloperInstructions(content) {
  const text = String(content || '');
  const tripleSingle = text.match(/developer_instructions\s*=\s*'''([\s\S]*?)'''/);
  if (tripleSingle) {
    return tripleSingle[1];
  }
  const tripleDouble = text.match(/developer_instructions\s*=\s*"""([\s\S]*?)"""/);
  if (tripleDouble) {
    return tripleDouble[1];
  }
  return null;
}

function extractAgentBody(content, format = 'markdown') {
  if (format === 'codex-toml') {
    const body = extractCodexDeveloperInstructions(content);
    return body === null ? null : body.trim();
  }
  return stripFrontmatter(content).trim();
}

function normalizeRuntimeSpecificText(body) {
  return String(body || '')
    .replace(/\.(?:opencode|claude|gemini)\/agents\/\*\.md/g, '<runtime-agent-path>')
    .replace(/\.codex\/agents\/\*\.toml/g, '<runtime-agent-path>')
    .replace(/\.(?:opencode|claude|gemini)\/agents\/[A-Za-z0-9_-]+\.md/g, '<runtime-agent-file>')
    .replace(/\.codex\/agents\/[A-Za-z0-9_-]+\.toml/g, '<runtime-agent-file>')
    .replace(/\r\n/g, '\n')
    .replace(/[ \t]+$/gm, '')
    .trim();
}

function tokenizeBody(body) {
  const normalized = normalizeRuntimeSpecificText(body).toLowerCase();
  return new Set(normalized.match(/[a-z0-9_./*-]{3,}/g) || []);
}

function compareBodyTokens(expectedBody, actualBody) {
  const expectedTokens = tokenizeBody(expectedBody);
  const actualTokens = tokenizeBody(actualBody);
  const missingTokens = [...expectedTokens].filter((token) => !actualTokens.has(token)).sort();
  const unexpectedTokens = [...actualTokens].filter((token) => !expectedTokens.has(token)).sort();

  return {
    matches: missingTokens.length === 0 && unexpectedTokens.length === 0,
    missingTokenCount: missingTokens.length,
    unexpectedTokenCount: unexpectedTokens.length,
    missingTokens: missingTokens.slice(0, 20),
    unexpectedTokens: unexpectedTokens.slice(0, 20),
  };
}

function inferAgentNameFromPath(filePath) {
  const ext = path.extname(filePath);
  return path.basename(filePath, ext);
}

function runtimePaths(agentName, repoRoot = process.cwd()) {
  return RUNTIME_MIRRORS.map((mirror) => ({
    runtime: mirror.runtime,
    path: mirror.template.replace('{name}', agentName),
    absolutePath: resolveMirrorPath(repoRoot, mirror.template, agentName),
    format: mirror.format,
  }));
}

function verifyMirrorSync(agentName, content, options = {}) {
  const repoRoot = path.resolve(options.repoRoot || process.cwd());
  const expectedFormat = options.expectedFormat || 'markdown';
  const expectedBody = extractAgentBody(content, expectedFormat);
  if (!agentName || typeof agentName !== 'string') {
    throw new Error('verifyMirrorSync requires an agentName');
  }
  if (expectedBody === null || expectedBody.length === 0) {
    throw new Error('verifyMirrorSync requires extractable agent body content');
  }

  const presentRuntimes = [];
  const missingRuntimes = [];
  const driftRuntimes = [];
  const details = [];

  for (const mirror of runtimePaths(agentName, repoRoot)) {
    if (!fs.existsSync(mirror.absolutePath)) {
      missingRuntimes.push(mirror.runtime);
      details.push({
        runtime: mirror.runtime,
        path: mirror.path,
        status: 'missing',
      });
      continue;
    }

    presentRuntimes.push(mirror.runtime);
    const mirrorContent = fs.readFileSync(mirror.absolutePath, 'utf8');
    const mirrorBody = extractAgentBody(mirrorContent, mirror.format);
    if (mirrorBody === null) {
      driftRuntimes.push(mirror.runtime);
      details.push({
        runtime: mirror.runtime,
        path: mirror.path,
        status: 'drift',
        reason: 'body-unextractable',
      });
      continue;
    }

    const comparison = compareBodyTokens(expectedBody, mirrorBody);
    if (!comparison.matches) {
      driftRuntimes.push(mirror.runtime);
      details.push({
        runtime: mirror.runtime,
        path: mirror.path,
        status: 'drift',
        comparison,
      });
      continue;
    }

    details.push({
      runtime: mirror.runtime,
      path: mirror.path,
      status: 'in-sync',
    });
  }

  return {
    presentRuntimes,
    missingRuntimes,
    driftRuntimes,
    allInSync: missingRuntimes.length === 0 && driftRuntimes.length === 0,
    details,
  };
}

module.exports = {
  RUNTIME_MIRRORS,
  compareBodyTokens,
  extractAgentBody,
  inferAgentNameFromPath,
  runtimePaths,
  stripFrontmatter,
  verifyMirrorSync,
};
