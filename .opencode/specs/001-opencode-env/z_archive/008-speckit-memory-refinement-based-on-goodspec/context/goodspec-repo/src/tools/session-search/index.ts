/**
 * Session Search Tool
 * Search and analyze past sessions for context
 * 
 * @module tools/session-search
 */

import { tool, type ToolDefinition } from "@opencode-ai/plugin/tool";
import { existsSync, readdirSync, readFileSync } from "fs";
import { join } from "path";
import { exec } from "child_process";
import { promisify } from "util";
import type { PluginContext, ToolContext } from "../../core/types.js";
import { getProjectGoopspecDir } from "../../shared/paths.js";
import { log } from "../../shared/logger.js";

const execAsync = promisify(exec);

export interface SessionEntry {
  date: string;
  timestamp: string;
  type: string;
  data: Record<string, unknown>;
}

export interface SearchResult {
  date: string;
  entries: SessionEntry[];
  matchCount: number;
}

/**
 * Use ripgrep to find files containing the query (fast pre-filter)
 */
async function findMatchingFiles(
  historyDir: string,
  query: string
): Promise<Set<string>> {
  try {
    const { stdout } = await execAsync(
      `rg -l -i --json "${query.replace(/"/g, '\\"')}" "${historyDir}"`,
      { maxBuffer: 10 * 1024 * 1024 }
    );
    
    const files = new Set<string>();
    for (const line of stdout.split("\n")) {
      if (!line.trim()) continue;
      try {
        const parsed = JSON.parse(line);
        if (parsed.type === "match" && parsed.data?.path?.text) {
          files.add(parsed.data.path.text);
        }
      } catch {
        // Skip invalid JSON lines
      }
    }
    return files;
  } catch {
    // If ripgrep fails or not available, return empty set (fallback to full scan)
    return new Set();
  }
}

/**
 * Search history files for matching entries
 */
async function searchHistory(
  historyDir: string,
  query: string,
  options: {
    limit?: number;
    types?: string[];
    startDate?: string;
    endDate?: string;
  } = {}
): Promise<SearchResult[]> {
  const results: SearchResult[] = [];
  const limit = options.limit ?? 50;
  const queryLower = query.toLowerCase();
  
  if (!existsSync(historyDir)) {
    return results;
  }
  
  // Try to use ripgrep for fast pre-filtering
  const matchingFilePaths = await findMatchingFiles(historyDir, query);
  
  // Get history files sorted by date (newest first)
  let files = readdirSync(historyDir)
    .filter(f => f.endsWith(".json"))
    .sort((a, b) => b.localeCompare(a));
  
  // If ripgrep found matches, only process those files
  if (matchingFilePaths.size > 0) {
    const matchingFileNames = new Set(
      Array.from(matchingFilePaths).map(p => p.split("/").pop() || "")
    );
    files = files.filter(f => matchingFileNames.has(f));
  }
  
  let totalMatches = 0;
  
  for (const file of files) {
    if (totalMatches >= limit) break;
    
    const date = file.replace(".json", "");
    
    // Date range filtering
    if (options.startDate && date < options.startDate) continue;
    if (options.endDate && date > options.endDate) continue;
    
    try {
      const content = readFileSync(join(historyDir, file), "utf-8");
      const entries: SessionEntry[] = JSON.parse(content);
      
      const matchingEntries = entries.filter(entry => {
        // Type filtering
        if (options.types && !options.types.includes(entry.type)) {
          return false;
        }
        
        // Query matching (search in stringified data)
        const dataStr = JSON.stringify(entry.data).toLowerCase();
        return dataStr.includes(queryLower);
      });
      
      if (matchingEntries.length > 0) {
        results.push({
          date,
          entries: matchingEntries.slice(0, limit - totalMatches),
          matchCount: matchingEntries.length,
        });
        totalMatches += matchingEntries.length;
      }
    } catch (error) {
      log("Failed to parse history file", { file, error });
    }
  }
  
  return results;
}

/**
 * Format search results for display
 */
function formatSearchResults(results: SearchResult[], query: string): string {
  if (results.length === 0) {
    return `No history entries found matching "${query}"`;
  }
  
  const totalMatches = results.reduce((sum, r) => sum + r.matchCount, 0);
  const lines = [
    `# Session History Search`,
    "",
    `**Query:** "${query}"`,
    `**Results:** ${totalMatches} entries across ${results.length} days`,
    "",
  ];
  
  for (const result of results) {
    lines.push(`## ${result.date}`);
    lines.push("");
    
    for (const entry of result.entries) {
      const time = new Date(entry.timestamp).toLocaleTimeString();
      lines.push(`### [${time}] ${entry.type}`);
      lines.push("");
      lines.push("```json");
      lines.push(JSON.stringify(entry.data, null, 2).substring(0, 500));
      if (JSON.stringify(entry.data).length > 500) {
        lines.push("... (truncated)");
      }
      lines.push("```");
      lines.push("");
    }
  }
  
  return lines.join("\n");
}

/**
 * Get recent history entries
 */
function getRecentHistory(
  historyDir: string,
  limit: number = 20,
  types?: string[]
): SessionEntry[] {
  if (!existsSync(historyDir)) {
    return [];
  }
  
  const entries: SessionEntry[] = [];
  
  // Get history files sorted by date (newest first)
  const files = readdirSync(historyDir)
    .filter(f => f.endsWith(".json"))
    .sort((a, b) => b.localeCompare(a));
  
  for (const file of files) {
    if (entries.length >= limit) break;
    
    try {
      const content = readFileSync(join(historyDir, file), "utf-8");
      const fileEntries: SessionEntry[] = JSON.parse(content);
      
      const filtered = types
        ? fileEntries.filter(e => types.includes(e.type))
        : fileEntries;
      
      entries.push(...filtered.slice(0, limit - entries.length));
    } catch {
      // Skip invalid files
    }
  }
  
  return entries;
}

/**
 * Create the session_search tool
 */
export function createSessionSearchTool(ctx: PluginContext): ToolDefinition {
  return tool({
    description: "Search past session history for context. Useful for finding previous decisions, tool calls, and phase changes.",
    args: {
      query: tool.schema.string().optional(),
      recent: tool.schema.boolean().optional(),
      limit: tool.schema.number().optional(),
      types: tool.schema.array(tool.schema.string()).optional(),
      startDate: tool.schema.string().optional(),
      endDate: tool.schema.string().optional(),
    },
    async execute(args, _context: ToolContext): Promise<string> {
      const goopspecDir = getProjectGoopspecDir(ctx.input.directory);
      const historyDir = join(goopspecDir, "history");
      
      // If recent flag, show recent entries
      if (args.recent) {
        const entries = getRecentHistory(
          historyDir,
          args.limit ?? 20,
          args.types
        );
        
        if (entries.length === 0) {
          return "No recent history entries found.";
        }
        
        const lines = [
          "# Recent Session History",
          "",
          `**Entries:** ${entries.length}`,
          "",
        ];
        
        for (const entry of entries) {
          const time = new Date(entry.timestamp).toLocaleString();
          lines.push(`### [${time}] ${entry.type}`);
          lines.push("");
          lines.push("```json");
          lines.push(JSON.stringify(entry.data, null, 2).substring(0, 300));
          lines.push("```");
          lines.push("");
        }
        
        return lines.join("\n");
      }
      
      // Search mode
      if (!args.query) {
        return `Session History Search

Usage:
- \`session_search({ query: "auth" })\` - Search for entries containing "auth"
- \`session_search({ recent: true, limit: 10 })\` - Show 10 most recent entries
- \`session_search({ query: "fix", types: ["decision"] })\` - Search decisions only

Available types: tool_call, phase_change, checkpoint, decision`;
      }
      
      const results = await searchHistory(historyDir, args.query, {
        limit: args.limit,
        types: args.types,
        startDate: args.startDate,
        endDate: args.endDate,
      });
      
      return formatSearchResults(results, args.query);
    },
  });
}
