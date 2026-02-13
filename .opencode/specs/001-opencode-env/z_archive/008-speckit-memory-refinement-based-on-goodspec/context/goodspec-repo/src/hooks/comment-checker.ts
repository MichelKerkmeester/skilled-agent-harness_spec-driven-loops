/**
 * Comment Checker Hook
 * Analyzes code changes to detect excessive commenting patterns
 * AI code should be indistinguishable from human code
 * 
 * Based on oh-my-opencode pattern:
 * - Uses tool.execute.before to capture pending writes
 * - Uses tool.execute.after to analyze and append warnings to output
 * 
 * @module hooks/comment-checker
 */

import { log } from "../shared/logger.js";

export interface CommentCheckerConfig {
  enabled: boolean;
  maxCommentRatio: number;
  warnThreshold: number;
  excludePatterns: string[];
}

const DEFAULT_CONFIG: CommentCheckerConfig = {
  enabled: true,
  maxCommentRatio: 0.3,
  warnThreshold: 0.2,
  excludePatterns: ["*.md", "*.json", "*.yaml", "*.yml", "*.txt"],
};

export interface CommentAnalysis {
  filePath: string;
  totalLines: number;
  codeLines: number;
  commentLines: number;
  blankLines: number;
  commentRatio: number;
  excessiveComments: boolean;
  suggestions: string[];
}

interface PendingCall {
  filePath: string;
  content?: string;
  tool: "write" | "edit";
  timestamp: number;
}

const PENDING_CALL_TTL = 60_000;

/**
 * Analyze a code file for comment density
 */
export function analyzeComments(filePath: string, content: string): CommentAnalysis {
  const lines = content.split("\n");
  let codeLines = 0;
  let commentLines = 0;
  let blankLines = 0;
  let inBlockComment = false;
  
  const ext = filePath.split(".").pop()?.toLowerCase() || "";
  const commentPatterns = getCommentPatterns(ext);
  
  for (const line of lines) {
    const trimmed = line.trim();
    
    if (trimmed === "") {
      blankLines++;
      continue;
    }
    
    if (commentPatterns.blockStart && trimmed.includes(commentPatterns.blockStart)) {
      inBlockComment = true;
    }
    
    if (inBlockComment) {
      commentLines++;
      if (commentPatterns.blockEnd && trimmed.includes(commentPatterns.blockEnd)) {
        inBlockComment = false;
      }
      continue;
    }
    
    if (commentPatterns.line && trimmed.startsWith(commentPatterns.line)) {
      commentLines++;
      continue;
    }
    
    if (commentPatterns.line && trimmed.includes(commentPatterns.line)) {
      codeLines++;
      continue;
    }
    
    codeLines++;
  }
  
  const totalLines = lines.length;
  const nonBlankLines = codeLines + commentLines;
  const commentRatio = nonBlankLines > 0 ? commentLines / nonBlankLines : 0;
  
  const suggestions: string[] = [];
  
  if (commentRatio > DEFAULT_CONFIG.maxCommentRatio) {
    suggestions.push("Consider removing obvious comments that duplicate code intent");
    suggestions.push("Focus comments on 'why' rather than 'what'");
    suggestions.push("Remove auto-generated JSDoc comments if not needed");
  }
  
  return {
    filePath,
    totalLines,
    codeLines,
    commentLines,
    blankLines,
    commentRatio,
    excessiveComments: commentRatio > DEFAULT_CONFIG.maxCommentRatio,
    suggestions,
  };
}

/**
 * Get comment patterns for a file extension
 */
function getCommentPatterns(ext: string): {
  line?: string;
  blockStart?: string;
  blockEnd?: string;
} {
  const patterns: Record<string, { line?: string; blockStart?: string; blockEnd?: string }> = {
    ts: { line: "//", blockStart: "/*", blockEnd: "*/" },
    tsx: { line: "//", blockStart: "/*", blockEnd: "*/" },
    js: { line: "//", blockStart: "/*", blockEnd: "*/" },
    jsx: { line: "//", blockStart: "/*", blockEnd: "*/" },
    py: { line: "#", blockStart: '"""', blockEnd: '"""' },
    rb: { line: "#", blockStart: "=begin", blockEnd: "=end" },
    go: { line: "//", blockStart: "/*", blockEnd: "*/" },
    rs: { line: "//", blockStart: "/*", blockEnd: "*/" },
    java: { line: "//", blockStart: "/*", blockEnd: "*/" },
    c: { line: "//", blockStart: "/*", blockEnd: "*/" },
    cpp: { line: "//", blockStart: "/*", blockEnd: "*/" },
    cs: { line: "//", blockStart: "/*", blockEnd: "*/" },
    sh: { line: "#" },
    bash: { line: "#" },
    css: { blockStart: "/*", blockEnd: "*/" },
    scss: { line: "//", blockStart: "/*", blockEnd: "*/" },
    html: { blockStart: "<!--", blockEnd: "-->" },
    xml: { blockStart: "<!--", blockEnd: "-->" },
    sql: { line: "--", blockStart: "/*", blockEnd: "*/" },
  };
  
  return patterns[ext] || { line: "//" };
}

/**
 * Format analysis result for display
 */
export function formatAnalysis(analysis: CommentAnalysis): string {
  const ratioPercent = (analysis.commentRatio * 100).toFixed(1);
  const status = analysis.excessiveComments ? "⚠️ EXCESSIVE" : "✅ OK";
  
  const lines = [
    `## Comment Analysis: ${analysis.filePath}`,
    "",
    `**Status:** ${status}`,
    `**Comment Ratio:** ${ratioPercent}%`,
    `**Lines:** ${analysis.totalLines} total (${analysis.codeLines} code, ${analysis.commentLines} comments, ${analysis.blankLines} blank)`,
  ];
  
  if (analysis.suggestions.length > 0) {
    lines.push("");
    lines.push("### Suggestions");
    for (const suggestion of analysis.suggestions) {
      lines.push(`- ${suggestion}`);
    }
  }
  
  return lines.join("\n");
}

/**
 * Create the comment checker hooks
 * 
 * Returns both before and after hooks for tool execution.
 * - Before: Captures file path and content for write operations
 * - After: Analyzes comments and appends warning to output if excessive
 */
export function createCommentCheckerHooks(config: Partial<CommentCheckerConfig> = {}) {
  const cfg = { ...DEFAULT_CONFIG, ...config };
  const pendingCalls = new Map<string, PendingCall>();
  
  // Cleanup old pending calls periodically
  setInterval(() => {
    const now = Date.now();
    for (const [callID, call] of pendingCalls) {
      if (now - call.timestamp > PENDING_CALL_TTL) {
        pendingCalls.delete(callID);
      }
    }
  }, 10_000);
  
  return {
    "tool.execute.before": async (
      input: { tool: string; sessionID: string; callID: string },
      output: { args: Record<string, unknown> }
    ): Promise<void> => {
      if (!cfg.enabled) return;
      
      const toolLower = input.tool.toLowerCase().replace(/^mcp_/, "");
      if (toolLower !== "write" && toolLower !== "edit") {
        return;
      }

      const filePath = (output.args.filePath ?? output.args.file_path ?? output.args.path) as string | undefined;
      const content = output.args.content as string | undefined;

      if (!filePath) return;
      
      // Check exclusion patterns
      for (const pattern of cfg.excludePatterns) {
        if (filePath.endsWith(pattern.replace("*", ""))) {
          return;
        }
      }

      pendingCalls.set(input.callID, {
        filePath,
        content,
        tool: toolLower as "write" | "edit",
        timestamp: Date.now(),
      });
      
      log("[comment-checker] Registered pending call", { callID: input.callID, filePath });
    },

    "tool.execute.after": async (
      input: { tool: string; sessionID: string; callID: string },
      output: { title: string; output: string; metadata: unknown }
    ): Promise<void> => {
      if (!cfg.enabled) return;
      
      const pendingCall = pendingCalls.get(input.callID);
      if (!pendingCall) return;

      pendingCalls.delete(input.callID);

      // Skip if tool execution failed
      const outputLower = output.output.toLowerCase();
      if (outputLower.includes("error:") || outputLower.includes("failed to")) {
        return;
      }

      // Only analyze writes with content
      if (pendingCall.tool !== "write" || !pendingCall.content) {
        return;
      }

      const analysis = analyzeComments(pendingCall.filePath, pendingCall.content);
      
      log("[comment-checker] Analysis complete", {
        filePath: pendingCall.filePath,
        ratio: analysis.commentRatio,
        excessive: analysis.excessiveComments,
      });

      if (analysis.commentRatio > cfg.warnThreshold) {
        if (analysis.excessiveComments) {
          // Append warning to output - this is the key pattern from oh-my-opencode!
          const warning = `\n\n⚠️ **Comment Check Warning**\n\nThe file \`${pendingCall.filePath}\` has ${(analysis.commentRatio * 100).toFixed(0)}% comments.\nAI-generated code should be clean and self-documenting.\n\nSuggestions:\n${analysis.suggestions.map(s => `- ${s}`).join("\n")}`;
          
          output.output += warning;
          
          log("[comment-checker] Warning appended to output", { filePath: pendingCall.filePath });
        }
      }
    },
  };
}
