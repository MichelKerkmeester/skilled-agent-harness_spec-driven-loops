// ---------------------------------------------------------------
// CORE: SUBFOLDER UTILS
// ---------------------------------------------------------------

import * as path from 'path';
import * as fsSync from 'fs';
import * as fs from 'fs/promises';
import { getSpecsDirectories } from './config';

/** Pattern for strict spec folder names: 3 digits + kebab-case suffix. */
export const SPEC_FOLDER_PATTERN: RegExp = /^\d{3}-[a-z][a-z0-9-]*$/;

/** Basic pattern for initial spec folder detection (less strict). */
export const SPEC_FOLDER_BASIC_PATTERN: RegExp = /^\d{3}-[a-zA-Z]/;

function isDirectorySync(filePath: string): boolean {
  try {
    return fsSync.statSync(filePath).isDirectory();
  } catch {
    return false;
  }
}

/** Find a bare child folder under all spec parents (sync). */
export function findChildFolderSync(childName: string): string | null {
  if (!childName) return null;
  const specsDirs = getSpecsDirectories();
  const matches: string[] = [];

  for (const specsDir of specsDirs) {
    if (!fsSync.existsSync(specsDir)) continue;

    const parentFolders = fsSync.readdirSync(specsDir).filter((entry: string) => {
      const entryPath = path.join(specsDir, entry);
      return SPEC_FOLDER_PATTERN.test(entry) && isDirectorySync(entryPath);
    });

    for (const parent of parentFolders) {
      const candidatePath = path.join(specsDir, parent, childName);
      if (fsSync.existsSync(candidatePath) && isDirectorySync(candidatePath)) {
        matches.push(candidatePath);
      }
    }
  }

  if (matches.length === 1) {
    return matches[0];
  }

  if (matches.length > 1) {
    console.error(`❌ Ambiguous child folder "${childName}" found in multiple parents:`);
    matches.forEach((m: string) => console.error(`   - ${m}`));
    return null;
  }

  return null;
}

/** Find a bare child folder under all spec parents (async). */
export async function findChildFolderAsync(childName: string): Promise<string | null> {
  if (!childName) return null;
  const specsDirs = getSpecsDirectories();
  const matches: string[] = [];

  for (const specsDir of specsDirs) {
    try {
      await fs.access(specsDir);
    } catch (_error: unknown) {
      continue;
    }

    const entries = await fs.readdir(specsDir);
    const parentFolders: string[] = [];

    for (const entry of entries) {
      const entryPath = path.join(specsDir, entry);
      try {
        const stat = await fs.stat(entryPath);
        if (SPEC_FOLDER_PATTERN.test(entry) && stat.isDirectory()) {
          parentFolders.push(entry);
        }
      } catch (_error: unknown) {
        continue;
      }
    }

    for (const parent of parentFolders) {
      const candidatePath = path.join(specsDir, parent, childName);
      try {
        const stat = await fs.stat(candidatePath);
        if (stat.isDirectory()) {
          matches.push(candidatePath);
        }
      } catch (_error: unknown) {
        continue;
      }
    }
  }

  if (matches.length === 1) {
    return matches[0];
  }

  if (matches.length > 1) {
    console.error(`❌ Ambiguous child folder "${childName}" found in multiple parents:`);
    matches.forEach((m: string) => console.error(`   - ${m}`));
    return null;
  }

  return null;
}
