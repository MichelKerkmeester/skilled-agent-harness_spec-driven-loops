/**
 * OpenCode Configuration Helper
 * Read/write/merge OpenCode system configuration
 * 
 * @module core/opencode-config
 */

import { existsSync, readFileSync, writeFileSync, mkdirSync } from "fs";
import { join } from "path";
import { homedir } from "os";
import { log, logError } from "../shared/logger.js";

export interface OpenCodeConfig {
  mcp?: Record<string, unknown>;
  agent?: Record<string, unknown>;
  default_agent?: string;
  [key: string]: unknown;
}

export interface McpEntry {
  enabled: boolean;
  [key: string]: unknown;
}

/**
 * Get OpenCode config directory path
 */
export function getOpenCodeConfigDir(): string {
  return join(homedir(), ".config", "opencode");
}

/**
 * Get OpenCode config file path
 */
export function getOpenCodeConfigPath(): string {
  return join(getOpenCodeConfigDir(), "config.json");
}

/**
 * Read OpenCode configuration
 * Returns empty object if config doesn't exist
 */
export function readOpenCodeConfig(configDir?: string): OpenCodeConfig {
  const configPath = configDir 
    ? join(configDir, "config.json")
    : getOpenCodeConfigPath();
    
  if (!existsSync(configPath)) {
    log(`OpenCode config not found at ${configPath}, returning empty config`);
    return {};
  }
  
  try {
    const content = readFileSync(configPath, "utf-8");
    const config = JSON.parse(content);
    log(`Read OpenCode config from ${configPath}`);
    return config;
  } catch (error) {
    logError(`Failed to read OpenCode config from ${configPath}:`, error);
    throw new Error(`Invalid OpenCode config: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Write OpenCode configuration
 * Creates directory if it doesn't exist
 */
export function writeOpenCodeConfig(config: OpenCodeConfig, configDir?: string): void {
  const dir = configDir ?? getOpenCodeConfigDir();
  const configPath = join(dir, "config.json");
  
  try {
    // Ensure directory exists
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
      log(`Created OpenCode config directory: ${dir}`);
    }
    
    // Write config
    writeFileSync(configPath, JSON.stringify(config, null, 2));
    log(`Wrote OpenCode config to ${configPath}`);
  } catch (error) {
    logError(`Failed to write OpenCode config to ${configPath}:`, error);
    throw new Error(`Cannot write OpenCode config: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Merge MCP entries into OpenCode config
 * Returns new config object with merged MCP entries
 */
export function mergeMcpConfig(
  config: OpenCodeConfig, 
  mcpEntries: Record<string, McpEntry>
): OpenCodeConfig {
  return {
    ...config,
    mcp: {
      ...config.mcp,
      ...mcpEntries,
    },
  };
}

/**
 * Check if OpenCode config exists
 */
export function hasOpenCodeConfig(configDir?: string): boolean {
  const configPath = configDir 
    ? join(configDir, "config.json")
    : getOpenCodeConfigPath();
  return existsSync(configPath);
}

/**
 * Get list of existing MCPs from OpenCode config
 */
export function getExistingMcps(config: OpenCodeConfig): string[] {
  if (!config.mcp) {
    return [];
  }
  
  return Object.keys(config.mcp);
}
