/**
 * MCP Installer Module
 * Programmatically install MCPs into OpenCode configuration
 * 
 * @module features/setup/mcp-installer
 */

import { readOpenCodeConfig, writeOpenCodeConfig, mergeMcpConfig, getOpenCodeConfigDir, type McpEntry } from "../../core/opencode-config.js";
import { log, logError } from "../../shared/logger.js";
import { spawn } from "child_process";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

/**
 * Check if bun is installed and available
 */
async function checkBunExists(): Promise<boolean> {
  try {
    await execAsync("bun --version");
    return true;
  } catch {
    return false;
  }
}

/**
 * Run bun install in a directory
 */
async function runBunInstall(cwd: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const proc = spawn("bun", ["install"], {
      cwd,
      stdio: "pipe",
    });

    let stderr = "";
    proc.stderr?.on("data", (data) => {
      stderr += data.toString();
    });

    proc.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`bun install failed with code ${code}: ${stderr}`));
      }
    });

    proc.on("error", (error) => {
      reject(error);
    });
  });
}

/**
 * Install MCPs by updating OpenCode config and running package install
 * 
 * @param mcps - List of MCP names to install
 * @param configDir - OpenCode config directory (optional, defaults to ~/.config/opencode)
 * @returns List of MCPs that were successfully installed
 */
export async function installMcps(mcps: string[], configDir?: string): Promise<string[]> {
  if (mcps.length === 0) {
    log("No MCPs to install");
    return [];
  }

  const installed: string[] = [];
  
  try {
    // Read existing config
    const config = readOpenCodeConfig(configDir);
    
    // Create MCP entries
    const mcpEntries: Record<string, McpEntry> = {};
    for (const mcp of mcps) {
      // Only add if not already present
      if (!config.mcp?.[mcp]) {
        mcpEntries[mcp] = { enabled: true };
        log(`Adding MCP to config: ${mcp}`);
      } else {
        log(`MCP already in config, skipping: ${mcp}`);
      }
    }
    
    // Merge and write config
    if (Object.keys(mcpEntries).length > 0) {
      const updatedConfig = mergeMcpConfig(config, mcpEntries);
      writeOpenCodeConfig(updatedConfig, configDir);
      log(`Updated OpenCode config with ${Object.keys(mcpEntries).length} new MCPs`);
      installed.push(...Object.keys(mcpEntries));
    }
    
    // Run bun install to fetch MCP packages (if any new MCPs added)
    if (installed.length > 0) {
      // Check if bun is available
      const bunExists = await checkBunExists();
      if (!bunExists) {
        throw new Error(
          `Bun is not installed or not in PATH. ` +
          `Please install Bun from https://bun.sh and try again.`
        );
      }
      
      try {
        const installDir = configDir ?? getOpenCodeConfigDir();
        log(`Running bun install in ${installDir}`);
        
        await runBunInstall(installDir);
        log("MCP packages installed successfully");
      } catch (installError) {
        logError("Failed to run bun install:", installError);
        throw new Error(
          `MCPs added to config but package installation failed. ` +
          `Please run 'bun install' in your OpenCode config directory manually.`
        );
      }
    }
    
    return installed;
  } catch (error) {
    logError("MCP installation failed:", error);
    throw error;
  }
}

/**
 * Check if MCP is already installed
 */
export function isMcpInstalled(mcpName: string, configDir?: string): boolean {
  try {
    const config = readOpenCodeConfig(configDir);
    return !!config.mcp?.[mcpName];
  } catch {
    return false;
  }
}

/**
 * Get list of all installed MCPs
 */
export function getInstalledMcps(configDir?: string): string[] {
  try {
    const config = readOpenCodeConfig(configDir);
    return Object.keys(config.mcp ?? {});
  } catch {
    return [];
  }
}
