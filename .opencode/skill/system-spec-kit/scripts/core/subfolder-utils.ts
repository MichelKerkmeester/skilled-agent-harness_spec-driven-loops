/**
 * Shared subfolder resolution utilities.
 * 
 * Centralizes the bare-child-search algorithm and spec folder patterns
 * that were previously duplicated across generate-context.ts and folder-detector.ts.
 * 
 * @module subfolder-utils
 */

import * as path from 'path';
import * as fsSync from 'fs';
import * as fs from 'fs/promises';
import { getSpecsDirectories } from './config';

/**
 * Pattern matching valid spec folder names: 3 digits, hyphen, lowercase start.
 * Example matches: "003-system-spec-kit", "121-script-audit"
 * Example non-matches: "003-System", "3-foo", "abc-def"
 */
export const SPEC_FOLDER_PATTERN: RegExp = /^\d{3}-[a-z][a-z0-9-]*$/;

/**
 * Basic pattern for initial spec folder detection (less strict).
 * Allows uppercase after the initial digit-hyphen prefix.
 * Example matches: "003-SystemSpecKit", "121-Script-Audit"
 */
export const SPEC_FOLDER_BASIC_PATTERN: RegExp = /^\d{3}-[a-zA-Z]/;

/**
 * Search all spec base directories for a child folder by bare name (synchronous).
 * Iterates through each specs directory, then each parent folder within,
 * looking for a unique match of the given child name.
 * 
 * @param childName - The bare child folder name (e.g., "121-child-name")
 * @returns Absolute path to the matched child folder, or null if not found/ambiguous
 * 
 * @example
 * // Returns "/path/to/specs/003-parent/121-child-name" if unique match found
 * findChildFolderSync("121-child-name");
 */
export function findChildFolderSync(childName: string): string | null {
  if (!childName) return null;
  const specsDirs = getSpecsDirectories();
  const matches: string[] = [];

  for (const specsDir of specsDirs) {
    if (!fsSync.existsSync(specsDir)) continue;

    const parentFolders = fsSync.readdirSync(specsDir).filter((entry: string) => {
      const entryPath = path.join(specsDir, entry);
      return SPEC_FOLDER_PATTERN.test(entry) && fsSync.statSync(entryPath).isDirectory();
    });

    for (const parent of parentFolders) {
      const candidatePath = path.join(specsDir, parent, childName);
      if (fsSync.existsSync(candidatePath) && fsSync.statSync(candidatePath).isDirectory()) {
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

/**
 * Search all spec base directories for a child folder by bare name (asynchronous).
 * Async equivalent of findChildFolderSync for use in interactive/async contexts.
 * 
 * @param childName - The bare child folder name (e.g., "121-child-name")
 * @returns Promise resolving to absolute path of matched child folder, or null
 * 
 * @example
 * // Returns "/path/to/specs/003-parent/121-child-name" if unique match found
 * const result = await findChildFolderAsync("121-child-name");
 */
export async function findChildFolderAsync(childName: string): Promise<string | null> {
  if (!childName) return null;
  const specsDirs = getSpecsDirectories();
  const matches: string[] = [];

  for (const specsDir of specsDirs) {
    try {
      await fs.access(specsDir);
    } catch {
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
      } catch {
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
      } catch {
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
