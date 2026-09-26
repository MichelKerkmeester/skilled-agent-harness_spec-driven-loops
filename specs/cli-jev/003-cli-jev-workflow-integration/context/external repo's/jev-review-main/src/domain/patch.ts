// Unified-diff helpers shared by the Git adapter and the review workflow.
import type { Hunk } from "./types.ts";

const UNTRACKED_CHUNK_LINES = 80;

// Splits a unified diff into hunks, tracking the new-file start line of each.
export function parseHunks(patch: string): Hunk[] {
  const hunks: Hunk[] = [];
  let current: string[] | null = null;
  let startLine = 1;

  const flush = () => {
    if (current) {
      hunks.push({
        id: `hunk_${hunks.length + 1}`,
        startLine,
        patch: current.join("\n"),
      });
    }
  };

  for (const line of patch.split("\n")) {
    if (line.startsWith("@@ ")) {
      flush();
      const match = line.match(/\+(\d+)/);
      startLine = match ? Number(match[1]) : 1;
      current = [line];
    } else if (current) {
      current.push(line);
    }
  }

  flush();
  return hunks;
}

// Renders a brand-new file as an all-additions diff, chunked so that hunk
// selection still points at a specific region of the file.
export function patchForNewFile(source: string): string {
  const lines = source.split("\n");
  const chunkCount = Math.ceil(lines.length / UNTRACKED_CHUNK_LINES);

  return Array.from({ length: chunkCount }, (_, index) => {
    const start = index * UNTRACKED_CHUNK_LINES;
    const chunk = lines.slice(start, start + UNTRACKED_CHUNK_LINES);
    return [
      `@@ -0,0 +${start + 1},${chunk.length} @@`,
      ...chunk.map((line) => `+${line}`),
    ].join("\n");
  }).join("\n");
}
