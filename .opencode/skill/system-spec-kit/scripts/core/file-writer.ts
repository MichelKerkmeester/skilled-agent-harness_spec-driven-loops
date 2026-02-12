// --- MODULE: File Writer ---
// Atomic file writing with validation and rollback on failure

import * as fs from 'fs/promises';
import * as path from 'path';
import { validateNoLeakedPlaceholders, validateAnchors } from '../utils/validation-utils';

export async function writeFilesAtomically(
  contextDir: string,
  files: Record<string, string>
): Promise<string[]> {
  const written: string[] = [];
  for (const [filename, content] of Object.entries(files)) {
    validateNoLeakedPlaceholders(content, filename);
    const warnings = validateAnchors(content);
    if (warnings.length) console.warn(`   Warning: ${filename}: ${warnings.join(', ')}`);
    const filePath = path.join(contextDir, filename);
    const tempPath = filePath + '.tmp';
    try {
      await fs.writeFile(tempPath, content, 'utf-8');
      const stat = await fs.stat(tempPath);
      if (stat.size !== Buffer.byteLength(content, 'utf-8')) throw new Error('Size mismatch');
      await fs.rename(tempPath, filePath);
      written.push(filename);
      console.log(`   ${filename} (${content.split('\n').length} lines)`);
    } catch (e: unknown) {
      try { await fs.unlink(tempPath); } catch (_e: unknown) { /* temp file cleanup — failure is non-critical */ }
      const errMsg = e instanceof Error ? e.message : String(e);
      throw new Error(`Write failed ${filename}: ${errMsg}`);
    }
  }
  return written;
}
