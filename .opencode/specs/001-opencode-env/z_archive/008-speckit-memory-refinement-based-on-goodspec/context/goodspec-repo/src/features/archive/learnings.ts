/**
 * Learnings Extraction for GoopSpec Archive
 * Extracts patterns, decisions, and gotchas from completed milestones
 * 
 * @module features/archive/learnings
 */

import { log } from "../../shared/logger.js";

// ============================================================================
// Types
// ============================================================================

export interface ExtractedLearning {
  patterns: string[];      // What approaches worked well
  decisions: string[];     // Key architectural choices
  gotchas: string[];       // What tripped us up
  metrics: {
    taskCount: number;
    waveCount: number;
    durationDays: number;
  };
}

// ============================================================================
// Extraction Logic
// ============================================================================

/**
 * Extract learnings from milestone documents
 * Analyzes SPEC, CHRONICLE, and RETROSPECTIVE to identify patterns
 */
export function extractLearnings(
  specContent: string,
  chronicleContent: string,
  retrospectiveContent: string
): ExtractedLearning {
  const patterns: string[] = [];
  const decisions: string[] = [];
  const gotchas: string[] = [];
  
  // Extract patterns from retrospective
  const patternMatches = retrospectiveContent.match(/(?:pattern|approach|worked well|success):\s*(.+)/gi);
  if (patternMatches) {
    patterns.push(...patternMatches.map(m => m.replace(/^[^:]+:\s*/, "").trim()));
  }
  
  // Extract decisions from spec and retrospective
  const decisionMatches = [
    ...specContent.matchAll(/(?:decision|chose|selected|using):\s*(.+)/gi),
    ...retrospectiveContent.matchAll(/(?:decision|chose|selected|using):\s*(.+)/gi),
  ];
  for (const match of decisionMatches) {
    const decision = match[1]?.trim();
    if (decision && !decisions.includes(decision)) {
      decisions.push(decision);
    }
  }
  
  // Extract gotchas from retrospective
  const gotchaMatches = retrospectiveContent.match(/(?:gotcha|issue|problem|challenge|tripped|struggled):\s*(.+)/gi);
  if (gotchaMatches) {
    gotchas.push(...gotchaMatches.map(m => m.replace(/^[^:]+:\s*/, "").trim()));
  }
  
  // Extract metrics from chronicle
  const metrics = extractMetrics(chronicleContent, retrospectiveContent);
  
  log("Extracted learnings", {
    patterns: patterns.length,
    decisions: decisions.length,
    gotchas: gotchas.length,
    metrics,
  });
  
  return {
    patterns: patterns.length > 0 ? patterns : ["No specific patterns documented"],
    decisions: decisions.length > 0 ? decisions : ["No specific decisions documented"],
    gotchas: gotchas.length > 0 ? gotchas : ["No specific gotchas documented"],
    metrics,
  };
}

/**
 * Extract metrics from chronicle and retrospective
 */
function extractMetrics(chronicleContent: string, retrospectiveContent: string): ExtractedLearning["metrics"] {
  // Count tasks (look for task markers in chronicle)
  const taskMatches = chronicleContent.match(/(?:^|\n)[-*]\s+(?:Task|✓|✗)/gm);
  const taskCount = taskMatches ? taskMatches.length : 0;
  
  // Count waves (look for wave markers)
  const waveMatches = chronicleContent.match(/(?:^|\n)##\s+Wave\s+\d+/gm);
  const waveCount = waveMatches ? waveMatches.length : 0;
  
  // Calculate duration (look for dates)
  let durationDays = 0;
  const dateMatches = [
    ...chronicleContent.matchAll(/\b(\d{4}-\d{2}-\d{2})\b/g),
    ...retrospectiveContent.matchAll(/\b(\d{4}-\d{2}-\d{2})\b/g),
  ];
  
  if (dateMatches.length >= 2) {
    const dates = Array.from(dateMatches).map(m => new Date(m[1]));
    const validDates = dates.filter(d => !isNaN(d.getTime()));
    
    if (validDates.length >= 2) {
      const earliest = new Date(Math.min(...validDates.map(d => d.getTime())));
      const latest = new Date(Math.max(...validDates.map(d => d.getTime())));
      durationDays = Math.ceil((latest.getTime() - earliest.getTime()) / (1000 * 60 * 60 * 24));
    }
  }
  
  return {
    taskCount,
    waveCount,
    durationDays,
  };
}

// ============================================================================
// Formatting
// ============================================================================

/**
 * Format learnings as markdown
 */
export function formatLearningsMarkdown(learnings: ExtractedLearning): string {
  const timestamp = new Date().toISOString();
  
  return `# Learnings

**Generated:** ${timestamp}

## Metrics

- **Tasks Completed:** ${learnings.metrics.taskCount}
- **Waves Executed:** ${learnings.metrics.waveCount}
- **Duration:** ${learnings.metrics.durationDays} days

## Patterns That Worked

${learnings.patterns.map(p => `- ${p}`).join("\n")}

## Key Decisions

${learnings.decisions.map(d => `- ${d}`).join("\n")}

## Gotchas & Challenges

${learnings.gotchas.map(g => `- ${g}`).join("\n")}

---

*This document was automatically generated from milestone artifacts.*
`;
}
