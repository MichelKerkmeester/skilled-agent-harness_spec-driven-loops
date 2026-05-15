// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Finalize Dist                                                            ║
// ╚══════════════════════════════════════════════════════════════════════════╝

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const serverDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const distDir = path.join(serverDir, 'dist');
const compiledServerDir = path.join(distDir, 'system-spec-kit', 'mcp_server');
const orphanSharedDir = path.join(distDir, 'system-spec-kit', 'shared');
const bundledSiblingNames = new Set(['system-code-graph', 'system-skill-advisor']);
const rewriteExtensions = new Set(['.js', '.d.ts']);

function copyRecursive(source, target) {
  const stat = fs.statSync(source);
  if (stat.isDirectory()) {
    fs.mkdirSync(target, { recursive: true });
    for (const entry of fs.readdirSync(source)) {
      copyRecursive(path.join(source, entry), path.join(target, entry));
    }
    return;
  }

  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.copyFileSync(source, target);
}

function walkFiles(root, visit) {
  if (!fs.existsSync(root)) {
    return;
  }

  for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
    const fullPath = path.join(root, entry.name);
    if (entry.isDirectory()) {
      walkFiles(fullPath, visit);
    } else if (entry.isFile()) {
      visit(fullPath);
    }
  }
}

function rewriteSiblingImports(filePath) {
  if (!rewriteExtensions.has(path.extname(filePath))) {
    return;
  }

  const original = fs.readFileSync(filePath, 'utf8');
  const rewritten = original.replace(
    /((?:\.\.\/){2,})(system-code-graph|system-skill-advisor)\//g,
    (match, parentPrefix, siblingName) => {
      if (!bundledSiblingNames.has(siblingName)) {
        return match;
      }

      const parentCount = parentPrefix.match(/\.\.\//g)?.length ?? 0;
      const flattenedParentPrefix = '../'.repeat(Math.max(0, parentCount - 2));
      return `${flattenedParentPrefix || './'}${siblingName}/`;
    },
  );

  if (rewritten !== original) {
    fs.writeFileSync(filePath, rewritten);
  }
}

function rewriteSharedPackageImports(filePath) {
  if (!rewriteExtensions.has(path.extname(filePath))) {
    return;
  }

  const original = fs.readFileSync(filePath, 'utf8');
  const rewritten = original.replace(
    /((?:\.\.\/)+)system-spec-kit\/shared\/([^'"]+?\.js)/g,
    '@spec-kit/shared/$2',
  );

  if (rewritten !== original) {
    fs.writeFileSync(filePath, rewritten);
  }
}

if (!fs.existsSync(compiledServerDir)) {
  throw new Error(`Expected compiled server output at ${compiledServerDir}`);
}

copyRecursive(compiledServerDir, distDir);

walkFiles(compiledServerDir, (sourcePath) => {
  const relativePath = path.relative(compiledServerDir, sourcePath);
  rewriteSiblingImports(path.join(distDir, relativePath));
});

if (fs.existsSync(orphanSharedDir)) {
  fs.rmSync(orphanSharedDir, { recursive: true, force: true });
}

walkFiles(distDir, rewriteSharedPackageImports);
