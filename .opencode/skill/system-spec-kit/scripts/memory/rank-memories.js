#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────
// SCRIPTS: RANK MEMORIES
// ───────────────────────────────────────────────────────────────
'use strict';

const fs = require('fs');
const path = require('path');

/* ─────────────────────────────────────────────────────────────
   1. IMPORTS
────────────────────────────────────────────────────────────────*/

const {
  is_archived,
  get_archive_multiplier,
  compute_recency_score,
  compute_single_folder_score,
  simplify_folder_path,
  find_top_tier,
  find_last_activity,
  TIER_WEIGHTS,
  SCORE_WEIGHTS,
  DECAY_RATE,
  TIER_ORDER,
} = require(path.join(__dirname, '../../mcp_server/lib/scoring/folder-scoring.js'));

/* ─────────────────────────────────────────────────────────────
   2. HELPER FUNCTIONS
────────────────────────────────────────────────────────────────*/

function format_relative_time(timestamp) {
  const date = new Date(timestamp);
  if (isNaN(date.getTime())) {
    return 'unknown';
  }

  const days_since = (Date.now() - date.getTime()) / (1000 * 60 * 60 * 24);

  if (days_since < 0) return 'future';
  if (days_since < 1/24) return 'just now';
  if (days_since < 1) return `${Math.floor(days_since * 24)}h ago`;
  if (days_since < 7) return `${Math.floor(days_since)}d ago`;
  if (days_since < 30) return `${Math.floor(days_since / 7)}w ago`;
  if (days_since < 365) return `${Math.floor(days_since / 30)}mo ago`;
  return `${Math.floor(days_since / 365)}y ago`;
}

function format_folder_display(folder) {
  const name = folder.simplified || simplify_folder_path(folder.folder);
  const count = folder.memoryCount || 0;
  const time = folder.lastUpdateRelative || format_relative_time(folder.lastUpdate);
  const score_percent = Math.round((folder.score || 0) * 100);

  return `${name} (${count}, ${time}) ${score_percent}%`;
}

function compute_folder_score(folder_path, folder_memories) {
  const result = compute_single_folder_score(folder_path, folder_memories);
  return result.score;
}

function normalize_memory(m) {
  return {
    id: m.id ?? 0,
    title: m.title ?? 'Untitled',
    specFolder: m.specFolder ?? 'unknown',
    importanceTier: m.importanceTier ?? 'normal',
    createdAt: m.createdAt ?? new Date().toISOString(),
    updatedAt: m.updatedAt ?? m.createdAt ?? new Date().toISOString(),
    filePath: m.filePath ?? null,
    triggerCount: m.triggerCount ?? 0,
    importanceWeight: m.importanceWeight ?? 0.5
  };
}

/* ─────────────────────────────────────────────────────────────
   3. MAIN PROCESSING
────────────────────────────────────────────────────────────────*/

function process_memories(raw_memories, options = {}) {
  const {
    show_archived = false,
    folder_limit = 3,
    memory_limit = 5
  } = options;

  const memories = raw_memories.map(normalize_memory);

  // Separate constitutional memories
  const constitutional = memories
    .filter(m => m.importanceTier === 'constitutional')
    .slice(0, folder_limit)
    .map(m => ({
      id: m.id,
      title: m.title,
      specFolder: m.specFolder,
      simplified: simplify_folder_path(m.specFolder)
    }));

  // Group memories by folder
  const folder_map = new Map();
  for (const memory of memories) {
    const folder = memory.specFolder || 'unknown';
    if (!folder_map.has(folder)) {
      folder_map.set(folder, []);
    }
    folder_map.get(folder).push(memory);
  }

  // Compute folder scores
  const folder_scores = [];
  for (const [folder, folder_memories] of folder_map) {
    const is_archived_folder = is_archived(folder);

    if (is_archived_folder && !show_archived) continue;

    const score = compute_folder_score(folder, folder_memories);
    const top_tier = find_top_tier(folder_memories);
    const last_activity = find_last_activity(folder_memories);

    folder_scores.push({
      folder,
      simplified: simplify_folder_path(folder),
      score: Math.round(score * 1000) / 1000,
      memoryCount: folder_memories.length,
      lastUpdate: last_activity,
      lastUpdateRelative: format_relative_time(last_activity),
      topTier: top_tier,
      isArchived: is_archived_folder
    });
  }

  folder_scores.sort((a, b) => b.score - a.score);

  const high_importance = folder_scores
    .filter(f => f.topTier === 'critical' || f.topTier === 'constitutional')
    .filter(f => !f.isArchived)
    .slice(0, folder_limit);

  const recently_active = folder_scores
    .filter(f => !f.isArchived)
    .slice(0, folder_limit);

  const recent_memories = [...memories]
    .filter(m => m.importanceTier !== 'constitutional')
    .filter(m => show_archived || !is_archived(m.specFolder))
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .slice(0, memory_limit)
    .map(m => ({
      id: m.id,
      title: m.title,
      specFolder: m.specFolder,
      simplified: simplify_folder_path(m.specFolder),
      updatedAt: m.updatedAt,
      updatedAtRelative: format_relative_time(m.updatedAt),
      tier: m.importanceTier || 'normal'
    }));

  const all_folders = [];
  for (const [folder] of folder_map) {
    all_folders.push({
      folder,
      isArchived: is_archived(folder)
    });
  }
  const archived_count = all_folders.filter(f => f.isArchived).length;

  return {
    constitutional,
    recentlyActive: recently_active,
    highImportance: high_importance,
    recentMemories: recent_memories,
    stats: {
      totalMemories: memories.length,
      totalFolders: folder_map.size,
      activeFolders: folder_map.size - archived_count,
      archivedFolders: archived_count,
      showingArchived: show_archived
    }
  };
}

/* ─────────────────────────────────────────────────────────────
   4. CLI INTERFACE
────────────────────────────────────────────────────────────────*/

function read_stdin() {
  return new Promise((resolve, reject) => {
    let data = '';
    process.stdin.setEncoding('utf8');

    if (process.stdin.isTTY) {
      resolve('');
      return;
    }

    process.stdin.on('readable', () => {
      let chunk;
      while ((chunk = process.stdin.read()) !== null) {
        data += chunk;
      }
    });

    process.stdin.on('end', () => resolve(data));
    process.stdin.on('error', reject);
  });
}

function parse_args(args) {
  const options = {
    show_archived: false,
    folder_limit: 3,
    memory_limit: 5,
    format: 'full',
    file_path: null
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg === '--show-archived') {
      options.show_archived = true;
    } else if (arg === '--folder-limit' && args[i + 1]) {
      options.folder_limit = parseInt(args[++i], 10) || 3;
    } else if (arg === '--memory-limit' && args[i + 1]) {
      options.memory_limit = parseInt(args[++i], 10) || 5;
    } else if (arg === '--format' && args[i + 1]) {
      options.format = args[++i];
    } else if (arg.startsWith('--file=')) {
      options.file_path = arg.slice(7);
    } else if (!arg.startsWith('--') && (arg.endsWith('.json') || fs.existsSync(arg))) {
      options.file_path = arg;
    }
  }

  return options;
}

function show_help() {
  console.log(`
rank-memories.js - Compute composite ranking scores for memories and folders

Usage:
  cat memories.json | node rank-memories.js [options]
  node rank-memories.js /path/to/memories.json [options]

Options:
  --show-archived     Include archived folders in output
  --folder-limit N    Max folders per section (default: 3)
  --memory-limit N    Max recent memories (default: 5)
  --format compact    Output format (compact|full)
  --help, -h          Show this help
`);
}

/* ─────────────────────────────────────────────────────────────
   5. ENTRY POINT
────────────────────────────────────────────────────────────────*/

async function main() {
  const args = process.argv.slice(2);

  if (args.includes('--help') || args.includes('-h')) {
    show_help();
    process.exit(0);
  }

  const options = parse_args(args);

  let input_data;
  try {
    if (options.file_path) {
      input_data = fs.readFileSync(options.file_path, 'utf8');
    } else {
      input_data = await read_stdin();
    }
  } catch (err) {
    console.error(`Error reading input: ${err.message}`);
    process.exit(1);
  }

  if (!input_data || input_data.trim() === '') {
    console.error('Error: No input data provided. Pipe JSON or specify a file path.');
    console.error('Run with --help for usage information.');
    process.exit(1);
  }

  let memories;
  try {
    const parsed = JSON.parse(input_data);
    memories = Array.isArray(parsed) ? parsed : (parsed.results || []);
  } catch (err) {
    console.error(`Error parsing JSON: ${err.message}`);
    process.exit(1);
  }

  const result = process_memories(memories, {
    show_archived: options.show_archived,
    folder_limit: options.folder_limit,
    memory_limit: options.memory_limit
  });

  if (options.format === 'compact') {
    console.log(JSON.stringify(result));
  } else {
    console.log(JSON.stringify(result, null, 2));
  }
}

main().catch(err => {
  console.error(`Error: ${err.message}`);
  process.exit(1);
});

/* ─────────────────────────────────────────────────────────────
   6. EXPORTS
────────────────────────────────────────────────────────────────*/

module.exports = {
  // Re-exported from folder-scoring.js
  is_archived,
  get_archive_multiplier,
  compute_recency_score,
  simplify_folder_path,
  TIER_WEIGHTS,
  SCORE_WEIGHTS,
  DECAY_RATE,
  // Local functions
  format_relative_time,
  compute_folder_score,
  process_memories,
};
