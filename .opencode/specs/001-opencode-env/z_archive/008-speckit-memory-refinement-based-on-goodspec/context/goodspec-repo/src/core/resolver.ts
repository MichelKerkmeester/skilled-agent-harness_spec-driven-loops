/**
 * Unified Resource Resolver for GoopSpec
 * Single source of truth for finding agents, commands, skills, references, and templates
 * 
 * @module core/resolver
 */

import { existsSync, readdirSync, readFileSync, statSync } from "fs";
import { join, basename } from "path";
import type { ResourceType, ResolvedResource, ResourceResolver, ResourceFrontmatter } from "./types.js";
import { parseFrontmatter } from "../shared/frontmatter.js";
import { 
  getBundledResourceDir, 
  getProjectResourceDir,
  pathExists 
} from "../shared/paths.js";
import { log } from "../shared/logger.js";

/**
 * Get file extension for resource type
 */
function getResourceExtension(_type: ResourceType): string {
  // All resource types use .md files
  return ".md";
}

/**
 * Normalize resource names to support optional type prefixes
 */
function normalizeResourceName(type: ResourceType, name: string): string {
  const trimmed = name.trim();
  if (!trimmed) {
    return trimmed;
  }

  const normalized = trimmed.replace(/\\/g, "/").replace(/^\.\/?/, "");
  const prefix = `${type}s/`;

  if (normalized.startsWith(prefix)) {
    return normalized.slice(prefix.length);
  }

  return normalized;
}

/**
 * Check if a file is a valid resource file
 */
function isResourceFile(filename: string, type: ResourceType): boolean {
  const ext = getResourceExtension(type);
  return filename.endsWith(ext);
}

/**
 * Check if an entry is a directory (for directory-based resources like skills)
 */
function isDirectory(path: string): boolean {
  try {
    return statSync(path).isDirectory();
  } catch {
    return false;
  }
}

/**
 * Load a single resource file
 */
function loadResource(
  path: string, 
  type: ResourceType,
  name: string
): ResolvedResource | null {
  try {
    if (!existsSync(path)) {
      return null;
    }

    const content = readFileSync(path, "utf-8");
    const { data, body } = parseFrontmatter<ResourceFrontmatter>(content);

    return {
      name: data.name || name,
      path,
      type,
      frontmatter: data,
      body,
      content,
    };
  } catch (error) {
    log(`Failed to load resource: ${path}`, { error: String(error) });
    return null;
  }
}

/**
 * Create a resource resolver for a project
 * 
 * Resolution order (highest priority first):
 * 1. Project overrides: .goopspec/[type]s/
 * 2. Bundled resources: [package-root]/[type]s/
 * 
 * @param projectDir - The project directory path
 */
export function createResourceResolver(projectDir: string): ResourceResolver {
  // Cache for resolved resources
  const cache = new Map<string, ResolvedResource | null>();
  const dirCache = new Map<string, ResolvedResource[]>();

  /**
   * Resolve a single resource by type and name
   */
function resolve(type: ResourceType, name: string): ResolvedResource | null {
  const cacheKey = `${type}:${name}`;
    
    if (cache.has(cacheKey)) {
      return cache.get(cacheKey) || null;
    }

  const ext = getResourceExtension(type);
  const normalizedName = normalizeResourceName(type, name);
  const filename = normalizedName.endsWith(ext) ? normalizedName : `${normalizedName}${ext}`;
    
    // Paths to try (in order of priority)
    const pathsToTry: string[] = [];

    // Project override paths
    const projectDir_ = getProjectResourceDir(projectDir, type);
    pathsToTry.push(join(projectDir_, filename)); // Flat file
    pathsToTry.push(join(projectDir_, name, "skill.md")); // Directory-based (skill)

    // Bundled paths
    const bundledDir = getBundledResourceDir(type);
    pathsToTry.push(join(bundledDir, filename)); // Flat file
    pathsToTry.push(join(bundledDir, name, "skill.md")); // Directory-based (skill)

    // Try each path
    for (const path of pathsToTry) {
      if (pathExists(path)) {
        const resource = loadResource(path, type, name);
        cache.set(cacheKey, resource);
        return resource;
      }
    }

    // Not found
    log(`Resource not found: ${type}/${name}`, { triedPaths: pathsToTry });
    cache.set(cacheKey, null);
    return null;
  }

  /**
   * Resolve all resources of a type
   */
  function resolveAll(type: ResourceType): ResolvedResource[] {
    const cacheKey = `all:${type}`;
    
    if (dirCache.has(cacheKey)) {
      return dirCache.get(cacheKey) || [];
    }

    const resources = new Map<string, ResolvedResource>();
    const ext = getResourceExtension(type);

    // Helper to load resources from a directory
    const loadFromDir = (dir: string) => {
      if (!pathExists(dir)) return;
      
      try {
        const entries = readdirSync(dir);
        for (const entry of entries) {
          const entryPath = join(dir, entry);
          
          // Handle flat files (e.g., agents/goop-planner.md)
          if (isResourceFile(entry, type)) {
            const name = basename(entry, ext);
            const resource = loadResource(entryPath, type, name);
            if (resource) {
              resources.set(name, resource);
            }
          }
          // Handle directory-based resources (e.g., skills/goop-core/skill.md)
          else if (isDirectory(entryPath)) {
            const skillPath = join(entryPath, "skill.md");
            if (pathExists(skillPath)) {
              const resource = loadResource(skillPath, type, entry);
              if (resource) {
                resources.set(entry, resource);
              }
            }
          }
        }
      } catch (error) {
        log(`Failed to read dir: ${dir}`, { error: String(error) });
      }
    };

    // Load bundled resources first
    const bundledDir = getBundledResourceDir(type);
    loadFromDir(bundledDir);

    // Override with project resources
    const projectDir_ = getProjectResourceDir(projectDir, type);
    loadFromDir(projectDir_);

    const result = Array.from(resources.values());
    dirCache.set(cacheKey, result);
    return result;
  }

  /**
   * Get the directory path for a resource type (project override or bundled)
   */
  function getDirectory(type: ResourceType): string | null {
    // Prefer project override if it exists
    const projectDir_ = getProjectResourceDir(projectDir, type);
    if (pathExists(projectDir_)) {
      return projectDir_;
    }

    // Fall back to bundled
    const bundledDir = getBundledResourceDir(type);
    if (pathExists(bundledDir)) {
      return bundledDir;
    }

    return null;
  }

  function clearCache(): void {
    cache.clear();
    dirCache.clear();
  }

  return {
    resolve,
    resolveAll,
    getDirectory,
    clearCache,
  };
}

/**
 * Clear resolver caches (useful for testing)
 */
export function createResolverWithCacheClear(projectDir: string): ResourceResolver & { clearCache: () => void } {
  let currentResolver = createResourceResolver(projectDir);
  
  return {
    resolve: (type: ResourceType, name: string) => currentResolver.resolve(type, name),
    resolveAll: (type: ResourceType) => currentResolver.resolveAll(type),
    getDirectory: (type: ResourceType) => currentResolver.getDirectory(type),
    clearCache: () => {
      currentResolver.clearCache?.();
      currentResolver = createResourceResolver(projectDir);
    },
  };
}
