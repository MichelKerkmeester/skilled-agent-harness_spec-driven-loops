// ───────────────────────────────────────────────────────────────
// EXTRACTORS: SESSION EXTRACTOR
// ───────────────────────────────────────────────────────────────

'use strict';

/* ─────────────────────────────────────────────────────────────
   1. IMPORTS
──────────────────────────────────────────────────────────────── */

const { execSync } = require('child_process');
const fs = require('fs').promises;
const path = require('path');
const { CONFIG } = require('../core');

/* ─────────────────────────────────────────────────────────────
   2. SESSION ID & CHANNEL
──────────────────────────────────────────────────────────────── */

function generate_session_id() {
  return `session-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
}

function get_channel() {
  try {
    const branch = execSync('git rev-parse --abbrev-ref HEAD', {
      encoding: 'utf8', cwd: CONFIG.PROJECT_ROOT, stdio: ['pipe', 'pipe', 'pipe']
    }).trim();
    return branch === 'HEAD'
      ? `detached:${execSync('git rev-parse --short HEAD', { encoding: 'utf8', cwd: CONFIG.PROJECT_ROOT, stdio: ['pipe', 'pipe', 'pipe'] }).trim()}`
      : branch;
  } catch {
    return 'default';
  }
}

/* ─────────────────────────────────────────────────────────────
   3. CONTEXT TYPE & IMPORTANCE
──────────────────────────────────────────────────────────────── */

function detect_context_type(tool_counts, decision_count) {
  const total = Object.values(tool_counts).reduce((a, b) => a + b, 0);
  if (total === 0) return 'general';

  const read_tools = (tool_counts.Read || 0) + (tool_counts.Grep || 0) + (tool_counts.Glob || 0);
  const write_tools = (tool_counts.Write || 0) + (tool_counts.Edit || 0);
  const web_tools = (tool_counts.WebSearch || 0) + (tool_counts.WebFetch || 0);

  if (decision_count > 0) return 'decision';
  if (web_tools / total > 0.3) return 'discovery';
  if (read_tools / total > 0.5 && write_tools / total < 0.1) return 'research';
  if (write_tools / total > 0.3) return 'implementation';
  return 'general';
}

function detect_importance_tier(files_modified, context_type) {
  const critical_paths = ['/architecture/', '/core/', '/schema/', '/security/', '/config/'];
  if (files_modified.some(f => critical_paths.some(p => f.includes(p)))) return 'critical';
  if (context_type === 'decision') return 'important';
  return 'normal';
}

/* ─────────────────────────────────────────────────────────────
   4. PROJECT PHASE & STATE
──────────────────────────────────────────────────────────────── */

function detect_project_phase(tool_counts, observations, message_count) {
  const total = Object.values(tool_counts).reduce((a, b) => a + b, 0);
  if (total === 0 && message_count < 3) return 'RESEARCH';

  const read_tools = (tool_counts.Read || 0) + (tool_counts.Grep || 0) + (tool_counts.Glob || 0);
  const write_tools = (tool_counts.Write || 0) + (tool_counts.Edit || 0);
  const obs_types = observations.map(o => o.type || 'observation');
  const has_decisions = obs_types.includes('decision');
  const has_features = obs_types.some(t => ['feature', 'implementation'].includes(t));

  if (write_tools / total > 0.4) return 'IMPLEMENTATION';
  if (has_decisions && write_tools < read_tools) return 'PLANNING';
  if (has_features && write_tools > 0) return 'REVIEW';
  if (read_tools / total > 0.6) return 'RESEARCH';
  return 'IMPLEMENTATION';
}

function extract_active_file(observations, files) {
  for (let i = observations.length - 1; i >= 0; i--) {
    if (observations[i].files?.length > 0) return observations[i].files[0];
  }
  return files?.[0]?.FILE_PATH || 'N/A';
}

function extract_next_action(observations, recent_context) {
  for (const obs of observations) {
    if (obs.facts) {
      for (const fact of obs.facts) {
        if (typeof fact === 'string') {
          const next_match = fact.match(/\b(?:next|todo|follow-?up):\s*(.+)/i);
          if (next_match) return next_match[1].trim();
        }
      }
    }
  }
  if (recent_context?.[0]?.learning) {
    const next_match = recent_context[0].learning.match(/\b(?:next|then|afterwards?):\s*(.+)/i);
    if (next_match) return next_match[1].trim().substring(0, 100);
  }
  return 'Continue implementation';
}

function extract_blockers(observations) {
  const blocker_keywords = /\b(?:block(?:ed|er|ing)?|stuck|issue|problem|error|fail(?:ed|ing)?|cannot|can't)\b/i;
  for (const obs of observations) {
    const narrative = obs.narrative || '';
    if (blocker_keywords.test(narrative)) {
      const sentences = narrative.match(/[^.!?]+[.!?]+/g) || [narrative];
      for (const sentence of sentences) {
        if (blocker_keywords.test(sentence)) return sentence.trim().substring(0, 100);
      }
    }
  }
  return 'None';
}

function build_file_progress(spec_files) {
  if (!spec_files?.length) return [];
  return spec_files.map(file => ({ FILE_NAME: file.FILE_NAME, FILE_STATUS: 'EXISTS' }));
}

/* ─────────────────────────────────────────────────────────────
   5. TOOL COUNTING & DURATION
──────────────────────────────────────────────────────────────── */

function count_tools_by_type(observations, user_prompts) {
  const tool_names = ['Read', 'Edit', 'Write', 'Bash', 'Grep', 'Glob', 'Task', 'WebFetch', 'WebSearch', 'Skill'];
  const counts = Object.fromEntries(tool_names.map(t => [t, 0]));

  for (const obs of observations) {
    if (obs.facts) {
      for (const fact of obs.facts) {
        const fact_text = typeof fact === 'string' ? fact : fact.text || '';
        for (const tool of tool_names) {
          if (fact_text.includes(`Tool: ${tool}`) || fact_text.includes(`${tool}(`)) counts[tool]++;
        }
      }
    }
  }
  for (const prompt of user_prompts) {
    const prompt_text = prompt.prompt || '';
    for (const tool of tool_names) {
      const matches = prompt_text.match(new RegExp(`\\b${tool}\\s*\\(`, 'g'));
      if (matches) counts[tool] += matches.length;
    }
  }
  return counts;
}

function calculate_session_duration(user_prompts, now) {
  if (user_prompts.length === 0) return 'N/A';
  const safe_parse_date = (date_str, fallback) => {
    const parsed = new Date(date_str);
    return isNaN(parsed.getTime()) ? fallback : parsed;
  };
  const first_timestamp = safe_parse_date(user_prompts[0]?.timestamp, now);
  const last_timestamp = safe_parse_date(user_prompts[user_prompts.length - 1]?.timestamp, now);
  const minutes = Math.floor((last_timestamp - first_timestamp) / 60000);
  const hours = Math.floor(minutes / 60);
  return hours > 0 ? `${hours}h ${minutes % 60}m` : `${minutes}m`;
}

function calculate_expiry_epoch(importance_tier, created_at_epoch) {
  if (['constitutional', 'critical', 'important'].includes(importance_tier)) return 0;
  if (importance_tier === 'temporary') return created_at_epoch + (7 * 24 * 60 * 60);
  if (importance_tier === 'deprecated') return created_at_epoch;
  return created_at_epoch + (90 * 24 * 60 * 60); // 90 days default
}

/* ─────────────────────────────────────────────────────────────
   6. RELATED DOCS & KEY TOPICS
──────────────────────────────────────────────────────────────── */

async function detect_related_docs(spec_folder_path) {
  const doc_files = [
    { name: 'spec.md', role: 'Requirements specification' },
    { name: 'plan.md', role: 'Implementation plan' },
    { name: 'tasks.md', role: 'Task breakdown' },
    { name: 'checklist.md', role: 'QA checklist' },
    { name: 'decision-record.md', role: 'Architecture decisions' },
    { name: 'research.md', role: 'Research findings' },
    { name: 'handover.md', role: 'Session handover notes' },
    { name: 'debug-delegation.md', role: 'Debug task delegation' }
  ];
  
  const found = [];

  const file_exists = async (file_path) => {
    try {
      await fs.access(file_path);
      return true;
    } catch {
      return false;
    }
  };

  for (const doc of doc_files) {
    const full_path = path.join(spec_folder_path, doc.name);
    if (await file_exists(full_path)) {
      found.push({
        FILE_NAME: doc.name,
        FILE_PATH: `./${doc.name}`,
        DESCRIPTION: doc.role
      });
    }
  }

  // Check for parent spec folder (nested sub-folders)
  const parent_path = path.dirname(spec_folder_path);
  const parent_name = path.basename(parent_path);

  if (/^\d{3}-/.test(parent_name) && path.basename(path.dirname(parent_path)) === 'specs') {
    for (const doc of doc_files) {
      const parent_doc_path = path.join(parent_path, doc.name);
      if (await file_exists(parent_doc_path)) {
        found.push({
          FILE_NAME: doc.name,
          FILE_PATH: `../${doc.name}`,
          DESCRIPTION: `[Parent] ${doc.role}`
        });
      }
    }
  }

  return found;
}

function extract_key_topics(summary, decisions = []) {
  const topics = new Set();
  
  const stopwords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
    'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'been',
    'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
    'should', 'may', 'might', 'must', 'shall', 'can', 'need', 'dare', 'ought',
    'used', 'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it',
    'we', 'they', 'what', 'which', 'who', 'whom', 'when', 'where', 'why', 'how',
    'all', 'each', 'every', 'both', 'few', 'more', 'most', 'other', 'some',
    'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too',
    'very', 'just', 'also', 'now', 'here', 'there', 'then', 'once',
    'file', 'files', 'code', 'update', 'updated', 'add', 'added', 'remove', 'removed',
    'change', 'changed', 'fix', 'fixed', 'new', 'session', 'using', 'used',
    'response', 'request', 'message', 'user', 'assistant', 'processed',
    'initiated', 'conversation', 'unknown', 'placeholder', 'simulation',
    'simulated', 'fallback', 'default', 'undefined', 'null', 'empty',
    'get', 'set', 'run', 'make', 'made', 'create', 'created', 'delete', 'deleted',
    'start', 'started', 'stop', 'stopped', 'done', 'complete', 'completed'
  ]);
  
  const is_placeholder_summary = !summary ||
    summary.includes('SIMULATION MODE') ||
    summary.includes('[response]') ||
    summary.includes('placeholder') ||
    summary.length < 20;

  if (summary && !is_placeholder_summary) {
    const words = summary.toLowerCase().match(/\b[a-z][a-z0-9]{2,}\b/g) || [];
    words.forEach(word => {
      if (!stopwords.has(word) && word.length >= 3) {
        topics.add(word);
      }
    });
  }
  
  if (Array.isArray(decisions)) {
    for (const dec of decisions) {
      const dec_text = `${dec.TITLE || ''} ${dec.RATIONALE || ''} ${dec.CHOSEN || ''}`.toLowerCase();
      const words = dec_text.match(/\b[a-z][a-z0-9]{2,}\b/g) || [];
      words.forEach(word => {
        if (!stopwords.has(word) && word.length >= 3) {
          topics.add(word);
        }
      });
    }
  }
  
  return Array.from(topics)
    .sort((a, b) => b.length - a.length)
    .slice(0, 10);
}

/* ─────────────────────────────────────────────────────────────
   7. COMPOSITE HELPERS
──────────────────────────────────────────────────────────────── */

function detect_session_characteristics(observations, user_prompts, FILES) {
  const tool_counts = count_tools_by_type(observations, user_prompts);
  const decision_count = observations.filter(obs =>
    obs.type === 'decision' || obs.title?.toLowerCase().includes('decision')
  ).length;
  const context_type = detect_context_type(tool_counts, decision_count);
  const importance_tier = detect_importance_tier(FILES.map(f => f.FILE_PATH), context_type);
  return { contextType: context_type, importanceTier: importance_tier, decisionCount: decision_count, toolCounts: tool_counts };
}

function build_project_state_snapshot({ toolCounts, observations, messageCount, FILES, SPEC_FILES, specFolderPath, recentContext }) {
  return {
    projectPhase: detect_project_phase(toolCounts, observations, messageCount),
    activeFile: extract_active_file(observations, FILES),
    lastAction: observations.slice(-1)[0]?.title || 'Context save initiated',
    nextAction: extract_next_action(observations, recentContext),
    blockers: extract_blockers(observations),
    fileProgress: build_file_progress(SPEC_FILES)
  };
}

/* ─────────────────────────────────────────────────────────────
   8. EXPORTS
──────────────────────────────────────────────────────────────── */

module.exports = {
  // Primary exports (snake_case)
  generate_session_id,
  get_channel,
  detect_context_type,
  detect_importance_tier,
  detect_project_phase,
  extract_active_file,
  extract_next_action,
  extract_blockers,
  build_file_progress,
  count_tools_by_type,
  calculate_session_duration,
  calculate_expiry_epoch,
  detect_related_docs,
  extract_key_topics,
  detect_session_characteristics,
  build_project_state_snapshot,
  // Backward-compatible aliases (camelCase)
  generateSessionId: generate_session_id,
  getChannel: get_channel,
  detectContextType: detect_context_type,
  detectImportanceTier: detect_importance_tier,
  detectProjectPhase: detect_project_phase,
  extractActiveFile: extract_active_file,
  extractNextAction: extract_next_action,
  extractBlockers: extract_blockers,
  buildFileProgress: build_file_progress,
  countToolsByType: count_tools_by_type,
  calculateSessionDuration: calculate_session_duration,
  calculateExpiryEpoch: calculate_expiry_epoch,
  detectRelatedDocs: detect_related_docs,
  extractKeyTopics: extract_key_topics,
  detectSessionCharacteristics: detect_session_characteristics,
  buildProjectStateSnapshot: build_project_state_snapshot
};
