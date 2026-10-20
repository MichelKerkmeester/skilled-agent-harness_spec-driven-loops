// ───────────────────────────────────────────────────────────────────
// MODULE: Plugin Inventory Reader
// ───────────────────────────────────────────────────────────────────
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const fs = require('node:fs');
const path = require('node:path');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const PLUGIN_DIR = path.resolve(__dirname, '..', '..');

const IDENTIFIER_SOURCE = String.raw`[A-Za-z_$][A-Za-z0-9_$]*`;
const EVENT_TYPE_SOURCE = String.raw`(?:${IDENTIFIER_SOURCE}(?:\?\.|\.))*(?:${IDENTIFIER_SOURCE})?[tT]ype(?![A-Za-z0-9_$])`;
const EVENT_NAME_SOURCE = String.raw`[a-z]+(?:\.[a-z_]+)+`;
const COMPARISON_SOURCE = String.raw`(?:===|!==|==|!=)`;
const OPERAND_SOURCE = String.raw`(?:'[^'\n]*'|"[^"\n]*"|${IDENTIFIER_SOURCE}(?:\.${IDENTIFIER_SOURCE})*)`;

// ─────────────────────────────────────────────────────────────────────────────
// 3. MANIFEST READERS
// ─────────────────────────────────────────────────────────────────────────────

function readManifest(pluginDir = PLUGIN_DIR) {
  const manifestPath = path.join(pluginDir, 'tests', 'plugin-inventory.json');
  return JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
}

function listPluginFiles(pluginDir) {
  return fs
    .readdirSync(pluginDir, { withFileTypes: true })
    .filter((entry) => entry.name.endsWith('.js') && !entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
}

function readInventory(pluginDir = PLUGIN_DIR, manifest = readManifest(pluginDir)) {
  const files = listPluginFiles(pluginDir);
  const existingFiles = new Set(files);
  const nativeDualFiles = new Set(manifest.nativeDual.map((entry) => entry.file));
  const bridged = [];
  const nativeDual = [];
  const problems = [];

  for (const file of files) {
    const stem = file.slice(0, -path.extname(file).length);
    let source = '';
    try {
      source = fs.readFileSync(path.join(pluginDir, file), 'utf8');
    } catch (error) {
      // A symlink whose build target is missing reads as absent; any other failure is a real error.
      if (error.code !== 'ENOENT') throw error;
    }
    const isBridged = source.includes(`dualPlugin('${stem}'`);

    if (isBridged) bridged.push(stem);
    if (nativeDualFiles.has(file)) nativeDual.push(stem);
    if (!isBridged && !nativeDualFiles.has(file)) {
      problems.push(`${file} is not bridged and not listed as a native-dual exception`);
    }
    if (isBridged && nativeDualFiles.has(file)) {
      problems.push(`${file} is bridged and also listed as native-dual`);
    }
  }

  for (const file of nativeDualFiles) {
    if (!existingFiles.has(file)) {
      problems.push(`${file} is listed as native-dual but has no file`);
    }
  }

  return {
    bridged: bridged.sort(),
    nativeDual: nativeDual.sort(),
    problems,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. EVENT READERS
// ─────────────────────────────────────────────────────────────────────────────

function handledEventNames(source) {
  const names = new Set();
  const patterns = [
    new RegExp(String.raw`${EVENT_TYPE_SOURCE}\s*${COMPARISON_SOURCE}\s*'(${EVENT_NAME_SOURCE})'`, 'g'),
    new RegExp(String.raw`${EVENT_TYPE_SOURCE}\s*${COMPARISON_SOURCE}\s*"(${EVENT_NAME_SOURCE})"`, 'g'),
    new RegExp(String.raw`'(${EVENT_NAME_SOURCE})'\s*${COMPARISON_SOURCE}\s*${EVENT_TYPE_SOURCE}`, 'g'),
    new RegExp(String.raw`"(${EVENT_NAME_SOURCE})"\s*${COMPARISON_SOURCE}\s*${EVENT_TYPE_SOURCE}`, 'g'),
    new RegExp(String.raw`case\s+'(${EVENT_NAME_SOURCE})'\s*:`, 'g'),
    new RegExp(String.raw`case\s+"(${EVENT_NAME_SOURCE})"\s*:`, 'g'),
  ];

  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(source)) !== null) names.add(match[1]);
  }

  return [...names].sort();
}

function unscannedEventChecks(source) {
  const checks = new Set();
  // Either operand order names no literal event, so both are reported.
  const comparisons = [
    new RegExp(
      String.raw`${EVENT_TYPE_SOURCE}\s*${COMPARISON_SOURCE}\s*(${IDENTIFIER_SOURCE}(?:\.${IDENTIFIER_SOURCE})*)`,
      'g',
    ),
    new RegExp(
      String.raw`(${IDENTIFIER_SOURCE}(?:\.${IDENTIFIER_SOURCE})*)\s*${COMPARISON_SOURCE}\s*${EVENT_TYPE_SOURCE}`,
      'g',
    ),
  ];
  // A method call on the type can select events the scan does not read, and a case label
  // holding an identifier or member expression is resolved at runtime.
  const unreadablePatterns = [
    new RegExp(
      String.raw`${EVENT_TYPE_SOURCE}\.([A-Za-z_$][\w$]*)\(([^()]*)\)(?:\s*${COMPARISON_SOURCE}\s*${OPERAND_SOURCE})?`,
      'g',
    ),
    new RegExp(String.raw`\.(?:has|includes)\(\s*${EVENT_TYPE_SOURCE}\s*\)`, 'g'),
    new RegExp(
      String.raw`case\s+(${IDENTIFIER_SOURCE}(?:\.${IDENTIFIER_SOURCE})*)\s*:`,
      'g',
    ),
  ];

  let match;
  for (const pattern of comparisons) {
    while ((match = pattern.exec(source)) !== null) {
      if (match[1] !== 'undefined' && match[1] !== 'null') checks.add(match[0].trim());
    }
  }

  for (const pattern of unreadablePatterns) {
    while ((match = pattern.exec(source)) !== null) checks.add(match[0].trim());
  }

  return [...checks].sort();
}

module.exports = {
  PLUGIN_DIR,
  handledEventNames,
  readInventory,
  readManifest,
  unscannedEventChecks,
};
