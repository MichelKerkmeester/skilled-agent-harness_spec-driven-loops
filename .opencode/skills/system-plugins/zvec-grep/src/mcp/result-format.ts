import type { ZvecGrepContextResult, ZvecGrepInfoResult } from "../index.js";
import type { ZvecGrepIndexStatusResult } from "./tools.js";

export type ToolResult = {
  content: Array<{ type: "text"; text: string }>;
  structuredContent?: Record<string, unknown>;
};

export function textToolResult(text: string): ToolResult {
  return {
    content: [{ type: "text", text }],
  };
}

export function toolResult(
  text: string,
  structuredContent: Record<string, unknown>,
): ToolResult {
  return {
    content: [{ type: "text", text }],
    structuredContent,
  };
}

export function contextToolResult(result: ZvecGrepContextResult): ToolResult {
  return toolResult(contextText(result), {
    result: simplifyContextResult(result),
  });
}

export function contextText(result: ZvecGrepContextResult): string {
  const lines = [
    `query: ${result.query}`,
    `root: ${result.root}`,
    `source: ${result.source}`,
    `coverage: ${result.coverage}`,
    `hits: ${result.items.length}`,
  ];

  for (const item of result.items) {
    lines.push("");
    lines.push(
      `${item.file.relativePath}:${rangeLabel(item.range)} rank=${item.rank} matchedBy=${item.matchedBy}`,
    );
    if (item.outline) {
      lines.push(`outline: ${item.outline}`);
    }
    lines.push("source:");
    lines.push(item.content);
  }

  return lines.join("\n");
}

export function simplifyContextResult(
  result: ZvecGrepContextResult,
): Record<string, unknown> {
  return {
    query: result.query,
    root: result.root,
    source: result.source,
    coverage: result.coverage,
    workspaceIndex: result.workspaceIndex,
    diagnostics: result.diagnostics,
    items: result.items.map((item) => ({
      kind: item.kind,
      rank: item.rank,
      file: item.file,
      range: item.range,
      excerptRange: item.excerptRange,
      outline: item.outline,
      content: item.content,
      contentRole: item.contentRole,
      status: item.status,
      score: item.score,
      matchedBy: item.matchedBy,
      metadata: item.metadata,
      entityId: item.entityId,
      container: item.container,
      trace: item.trace,
    })),
  };
}

/**
 * Persisted index state as reported by `zvec_grep_index_status`. Both the
 * daemon and Direct mode read it from the same engine info result so the tool
 * output stays identical across execution backends.
 */
export function persistentIndexStatus(
  info: ZvecGrepInfoResult,
): ZvecGrepIndexStatusResult["persistent"] {
  return {
    home: info.home,
    index_path: info.indexPath,
    workspace_index: info.workspaceIndex
      ? {
          id: info.workspaceIndex.id,
          name: info.workspaceIndex.name,
          path: info.workspaceIndex.path,
          root_paths: info.workspaceIndex.rootPaths.map((rootPath) => ({
            absolute_path: rootPath.absolutePath,
            recursive: rootPath.recursive,
            include: rootPath.include ? [...rootPath.include] : undefined,
            exclude: rootPath.exclude ? [...rootPath.exclude] : undefined,
            globs: rootPath.globs ? [...rootPath.globs] : undefined,
            insensitive_globs: rootPath.insensitiveGlobs
              ? [...rootPath.insensitiveGlobs]
              : undefined,
            file_types: rootPath.fileTypes
              ? [...rootPath.fileTypes]
              : undefined,
            excluded_file_types: rootPath.excludedFileTypes
              ? [...rootPath.excludedFileTypes]
              : undefined,
            hidden: rootPath.hidden,
            no_ignore: rootPath.noIgnore,
            ignore_files: rootPath.ignoreFiles
              ? [...rootPath.ignoreFiles]
              : undefined,
            max_depth: rootPath.maxDepth,
            max_file_size_bytes: rootPath.maxFileSizeBytes,
            follow: rootPath.follow,
          })),
          embedding: info.workspaceIndex.embedding,
          index_version: info.workspaceIndex.indexVersion,
          created_time: info.workspaceIndex.createdTime,
          updated_time: info.workspaceIndex.updatedTime,
        }
      : undefined,
    files: info.status
      ? {
          stored: info.status.filesStored,
          scanned: info.status.filesScanned,
          indexed: info.status.filesIndexed,
          pending: info.status.filesPending,
          failed: info.status.filesFailed,
          added: info.status.filesAdded,
          modified: info.status.filesModified,
          deleted: info.status.filesDeleted,
          unchanged: info.status.filesUnchanged,
          entities: info.status.entitiesIndexed,
          truncated_fragments: info.status.fragmentsTruncated,
        }
      : undefined,
    suggestion: info.suggestion,
  };
}

function rangeLabel(range: {
  kind: string;
  startLine?: number;
  endLine?: number;
  startOffset?: number;
  endOffset?: number;
}): string {
  if (
    range.kind === "text" &&
    typeof range.startLine === "number" &&
    typeof range.endLine === "number"
  ) {
    return `${range.startLine}-${range.endLine}`;
  }
  if (
    typeof range.startOffset === "number" &&
    typeof range.endOffset === "number"
  ) {
    return `${range.startOffset}-${range.endOffset}`;
  }
  return range.kind;
}
