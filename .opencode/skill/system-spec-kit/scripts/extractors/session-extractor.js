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

function generateSessionId() {
  return `session-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
}

function getChannel() {
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

function detectContextType(toolCounts, decisionCount) {
  const total = Object.values(toolCounts).reduce((a, b) => a + b, 0);
  if (total === 0) return 'general';

  const readTools = (toolCounts.Read || 0) + (toolCounts.Grep || 0) + (toolCounts.Glob || 0);
  const writeTools = (toolCounts.Write || 0) + (toolCounts.Edit || 0);
  const webTools = (toolCounts.WebSearch || 0) + (toolCounts.WebFetch || 0);

  if (decisionCount > 0) return 'decision';
  if (webTools / total > 0.3) return 'discovery';
  if (readTools / total > 0.5 && writeTools / total < 0.1) return 'research';
  if (writeTools / total > 0.3) return 'implementation';
  return 'general';
}

function detectImportanceTier(filesModified, contextType) {
  const criticalPaths = ['/architecture/', '/core/', '/schema/', '/security/', '/config/'];
  if (filesModified.some(f => criticalPaths.some(p => f.includes(p)))) return 'critical';
  if (contextType === 'decision') return 'important';
  return 'normal';
}

/* ─────────────────────────────────────────────────────────────
   4. PROJECT PHASE & STATE
──────────────────────────────────────────────────────────────── */

function detectProjectPhase(toolCounts, observations, messageCount) {
  const total = Object.values(toolCounts).reduce((a, b) => a + b, 0);
  if (total === 0 && messageCount < 3) return 'RESEARCH';

  const readTools = (toolCounts.Read || 0) + (toolCounts.Grep || 0) + (toolCounts.Glob || 0);
  const writeTools = (toolCounts.Write || 0) + (toolCounts.Edit || 0);
  const obsTypes = observations.map(o => o.type || 'observation');
  const hasDecisions = obsTypes.includes('decision');
  const hasFeatures = obsTypes.some(t => ['feature', 'implementation'].includes(t));

  if (writeTools / total > 0.4) return 'IMPLEMENTATION';
  if (hasDecisions && writeTools < readTools) return 'PLANNING';
  if (hasFeatures && writeTools > 0) return 'REVIEW';
  if (readTools / total > 0.6) return 'RESEARCH';
  return 'IMPLEMENTATION';
}

function extractActiveFile(observations, files) {
  for (let i = observations.length - 1; i >= 0; i--) {
    if (observations[i].files?.length > 0) return observations[i].files[0];
  }
  return files?.[0]?.FILE_PATH || 'N/A';
}

function extractNextAction(observations, recentContext) {
  for (const obs of observations) {
    if (obs.facts) {
      for (const fact of obs.facts) {
        if (typeof fact === 'string') {
          const nextMatch = fact.match(/\b(?:next|todo|follow-?up):\s*(.+)/i);
          if (nextMatch) return nextMatch[1].trim();
        }
      }
    }
  }
  if (recentContext?.[0]?.learning) {
    const nextMatch = recentContext[0].learning.match(/\b(?:next|then|afterwards?):\s*(.+)/i);
    if (nextMatch) return nextMatch[1].trim().substring(0, 100);
  }
  return 'Continue implementation';
}

function extractBlockers(observations) {
  const blockerKeywords = /\b(?:block(?:ed|er|ing)?|stuck|issue|problem|error|fail(?:ed|ing)?|cannot|can't)\b/i;
  for (const obs of observations) {
    const narrative = obs.narrative || '';
    if (blockerKeywords.test(narrative)) {
      const sentences = narrative.match(/[^.!?]+[.!?]+/g) || [narrative];
      for (const sentence of sentences) {
        if (blockerKeywords.test(sentence)) return sentence.trim().substring(0, 100);
      }
    }
  }
  return 'None';
}

function buildFileProgress(specFiles) {
  if (!specFiles?.length) return [];
  return specFiles.map(file => ({ FILE_NAME: file.FILE_NAME, FILE_STATUS: 'EXISTS' }));
}

/* ─────────────────────────────────────────────────────────────
   5. TOOL COUNTING & DURATION
──────────────────────────────────────────────────────────────── */

function countToolsByType(observations, userPrompts) {
  const toolNames = ['Read', 'Edit', 'Write', 'Bash', 'Grep', 'Glob', 'Task', 'WebFetch', 'WebSearch', 'Skill'];
  const counts = Object.fromEntries(toolNames.map(t => [t, 0]));

  for (const obs of observations) {
    if (obs.facts) {
      for (const fact of obs.facts) {
        const factText = typeof fact === 'string' ? fact : fact.text || '';
        for (const tool of toolNames) {
          if (factText.includes(`Tool: ${tool}`) || factText.includes(`${tool}(`)) counts[tool]++;
        }
      }
    }
  }
  for (const prompt of userPrompts) {
    const promptText = prompt.prompt || '';
    for (const tool of toolNames) {
      const matches = promptText.match(new RegExp(`\\b${tool}\\s*\\(`, 'g'));
      if (matches) counts[tool] += matches.length;
    }
  }
  return counts;
}

function calculateSessionDuration(userPrompts, now) {
  if (userPrompts.length === 0) return 'N/A';
  const safeParseDate = (dateStr, fallback) => {
    const parsed = new Date(dateStr);
    return isNaN(parsed.getTime()) ? fallback : parsed;
  };
  const firstTimestamp = safeParseDate(userPrompts[0]?.timestamp, now);
  const lastTimestamp = safeParseDate(userPrompts[userPrompts.length - 1]?.timestamp, now);
  const minutes = Math.floor((lastTimestamp - firstTimestamp) / 60000);
  const hours = Math.floor(minutes / 60);
  return hours > 0 ? `${hours}h ${minutes % 60}m` : `${minutes}m`;
}

function calculateExpiryEpoch(importanceTier, createdAtEpoch) {
  if (['constitutional', 'critical', 'important'].includes(importanceTier)) return 0;
  if (importanceTier === 'temporary') return createdAtEpoch + (7 * 24 * 60 * 60);
  if (importanceTier === 'deprecated') return createdAtEpoch;
  return createdAtEpoch + (90 * 24 * 60 * 60); // 90 days default
}

/* ─────────────────────────────────────────────────────────────
   6. RELATED DOCS & KEY TOPICS
──────────────────────────────────────────────────────────────── */

async function detectRelatedDocs(specFolderPath) {
  const docFiles = [
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
  
  const fileExists = async (filePath) => {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  };
  
  for (const doc of docFiles) {
    const fullPath = path.join(specFolderPath, doc.name);
    if (await fileExists(fullPath)) {
      found.push({
        FILE_NAME: doc.name,
        FILE_PATH: `./${doc.name}`,
        DESCRIPTION: doc.role
      });
    }
  }
  
  // Check for parent spec folder (nested sub-folders)
  const parentPath = path.dirname(specFolderPath);
  const parentName = path.basename(parentPath);
  
  if (/^\d{3}-/.test(parentName) && path.basename(path.dirname(parentPath)) === 'specs') {
    for (const doc of docFiles) {
      const parentDocPath = path.join(parentPath, doc.name);
      if (await fileExists(parentDocPath)) {
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

function extractKeyTopics(summary, decisions = []) {
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
  
  const isPlaceholderSummary = !summary || 
    summary.includes('SIMULATION MODE') ||
    summary.includes('[response]') ||
    summary.includes('placeholder') ||
    summary.length < 20;
  
  if (summary && !isPlaceholderSummary) {
    const words = summary.toLowerCase().match(/\b[a-z][a-z0-9]{2,}\b/g) || [];
    words.forEach(word => {
      if (!stopwords.has(word) && word.length >= 3) {
        topics.add(word);
      }
    });
  }
  
  if (Array.isArray(decisions)) {
    for (const dec of decisions) {
      const decText = `${dec.TITLE || ''} ${dec.RATIONALE || ''} ${dec.CHOSEN || ''}`.toLowerCase();
      const words = decText.match(/\b[a-z][a-z0-9]{2,}\b/g) || [];
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

function detectSessionCharacteristics(observations, userPrompts, FILES) {
  const toolCounts = countToolsByType(observations, userPrompts);
  const decisionCount = observations.filter(obs =>
    obs.type === 'decision' || obs.title?.toLowerCase().includes('decision')
  ).length;
  const contextType = detectContextType(toolCounts, decisionCount);
  const importanceTier = detectImportanceTier(FILES.map(f => f.FILE_PATH), contextType);
  return { contextType, importanceTier, decisionCount, toolCounts };
}

function buildProjectStateSnapshot({ toolCounts, observations, messageCount, FILES, SPEC_FILES, specFolderPath, recentContext }) {
  return {
    projectPhase: detectProjectPhase(toolCounts, observations, messageCount),
    activeFile: extractActiveFile(observations, FILES),
    lastAction: observations.slice(-1)[0]?.title || 'Context save initiated',
    nextAction: extractNextAction(observations, recentContext),
    blockers: extractBlockers(observations),
    fileProgress: buildFileProgress(SPEC_FILES)
  };
}

/* ─────────────────────────────────────────────────────────────
   8. EXPORTS
──────────────────────────────────────────────────────────────── */

module.exports = {
  generateSessionId,
  getChannel,
  detectContextType,
  detectImportanceTier,
  detectProjectPhase,
  extractActiveFile,
  extractNextAction,
  extractBlockers,
  buildFileProgress,
  countToolsByType,
  calculateSessionDuration,
  calculateExpiryEpoch,
  detectRelatedDocs,
  extractKeyTopics,
  detectSessionCharacteristics,
  buildProjectStateSnapshot
};
