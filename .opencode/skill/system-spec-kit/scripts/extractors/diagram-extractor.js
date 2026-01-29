// ───────────────────────────────────────────────────────────────
// EXTRACTORS: DIAGRAM EXTRACTOR
// ───────────────────────────────────────────────────────────────

'use strict';

/* ─────────────────────────────────────────────────────────────
   1. IMPORTS
──────────────────────────────────────────────────────────────── */

const { validateDataStructure } = require('../utils/data-validator');
const {
  detectToolCall,
  isProseContext,
  classifyConversationPhase
} = require('../utils/tool-detection');

let flowchartGen, simFactory;
try {
  flowchartGen = require('../lib/flowchart-generator');
} catch (err) {
  console.error('Failed to load flowchart-generator library:', err.message);
  process.exit(1);
}

try {
  simFactory = require('../lib/simulation-factory');
} catch (err) {
  console.error('Failed to load simulation-factory library:', err.message);
  process.exit(1);
}

const { generateDecisionTree } = require('../lib/decision-tree-generator');

/* ─────────────────────────────────────────────────────────────
   2. PHASE EXTRACTION
──────────────────────────────────────────────────────────────── */

function extract_phases_from_data(collected_data) {
  // Check parent object exists BEFORE accessing properties
  if (!collected_data || !collected_data.observations || collected_data.observations.length === 0) {
    return simFactory.createSimulationPhases();
  }
  
  // Return empty for very short sessions (≤2 messages)
  // Safe to access now - we verified collected_data.observations exists above
  const message_count = collected_data.observations.length;
  if (message_count <= 2) {
    console.log('   ℹ️  Session too short for meaningful phase detection');
    return [];
  }

  const observations = collected_data.observations;
  const phase_map = new Map();

  for (const obs of observations) {
    const tools = obs.facts?.flatMap(f => {
      if (typeof f !== 'string') return [];

      const detection = detectToolCall(f);
      if (!detection) return [];

      const tool_index = f.search(new RegExp(`\\b${detection.tool}\\b`, 'i'));
      if (tool_index >= 0 && isProseContext(f, tool_index)) {
        return [];
      }

      return [detection.tool];
    }) || [];
    const content = obs.narrative || '';

    const phase = classifyConversationPhase(
      tools.map(t => ({ tool: t })),
      content
    );

    if (!phase_map.has(phase)) {
      phase_map.set(phase, { count: 0, duration: 0, activities: [] });
    }

    const phase_data = phase_map.get(phase);
    phase_data.count++;

    if (content && content.trim().length > 10) {
      let activity = content.substring(0, 50);
      const last_space = activity.lastIndexOf(' ');
      if (last_space > 30) {
        activity = activity.substring(0, last_space);
      }

      if (activity.length < content.length) {
        activity += '...';
      }

      const meaningful_content = activity.replace(/[^a-zA-Z0-9]/g, '');
      if (meaningful_content.length < 5) continue;

      if (!phase_data.activities.includes(activity)) {
        phase_data.activities.push(activity);
      }
    }
  }

  return Array.from(phase_map.entries()).map(([name, data]) => ({
    PHASE_NAME: name,
    DURATION: `${data.count} actions`,
    ACTIVITIES: data.activities.slice(0, 3)
  }));
}

/* ─────────────────────────────────────────────────────────────
   3. DIAGRAM EXTRACTION
──────────────────────────────────────────────────────────────── */

async function extract_diagrams(collected_data) {
  if (!collected_data) {
    console.log('   ⚠️  Using simulation data for diagrams');
    return simFactory.createDiagramData();
  }

  const observations = collected_data.observations || [];
  const decisions = collected_data.observations?.filter(o => o.type === 'decision') || [];
  const user_prompts = collected_data.user_prompts || [];

  const box_chars = /[┌┐└┘├┤┬┴┼─│╭╮╰╯╱╲▼▲►◄]/;

  const DIAGRAMS = [];

  for (const obs of observations) {
    const narrative = obs.narrative || '';
    const facts = obs.facts || [];

    if (box_chars.test(narrative) || facts.some(f => box_chars.test(f))) {
      const ascii_art = box_chars.test(narrative)
        ? narrative
        : facts.find(f => box_chars.test(f)) || '';

      const pattern = flowchartGen.classifyDiagramPattern(ascii_art);

      DIAGRAMS.push({
        TITLE: obs.title || 'Detected Diagram',
        TIMESTAMP: obs.timestamp || new Date().toISOString(),
        DIAGRAM_TYPE: obs.type === 'decision' ? 'Decision Tree' : 'Workflow',
        PATTERN_NAME: pattern.pattern,
        COMPLEXITY: pattern.complexity,
        HAS_DESCRIPTION: !!obs.title,
        DESCRIPTION: obs.title || 'Diagram found in conversation',
        ASCII_ART: ascii_art.substring(0, 1000),
        HAS_NOTES: false,
        NOTES: [],
        HAS_RELATED_FILES: obs.files && obs.files.length > 0,
        RELATED_FILES: obs.files ? obs.files.map(f => ({ FILE_PATH: f })) : []
      });
    }
  }

  const phases = extract_phases_from_data(collected_data);
  const AUTO_CONVERSATION_FLOWCHART = flowchartGen.generateConversationFlowchart(
    phases,
    user_prompts[0]?.prompt || 'User request'
  );

  const AUTO_DECISION_TREES = decisions.map((dec, index) => {
    const options = dec.facts
      ?.filter(f => f.includes('Option') || f.includes('Alternative'))
      .map(f => f.split(':')[0]?.trim() || f.substring(0, 20)) || [];

    const chosen = dec.narrative?.match(/chose|selected:?\s+([^\.\n]+)/i)?.[1]?.trim() || options[0];

    return {
      INDEX: index + 1,
      DECISION_TITLE: dec.title || `Decision ${index + 1}`,
      DECISION_TREE: generateDecisionTree(dec.title || 'Decision', options, chosen)
    };
  });

  const diagram_type_counts = new Map();
  for (const diagram of DIAGRAMS) {
    const count = diagram_type_counts.get(diagram.DIAGRAM_TYPE) || 0;
    diagram_type_counts.set(diagram.DIAGRAM_TYPE, count + 1);
  }

  const DIAGRAM_TYPES = Array.from(diagram_type_counts.entries()).map(([TYPE, COUNT]) => ({ TYPE, COUNT }));

  const pattern_counts = new Map();
  for (const diagram of DIAGRAMS) {
    const count = pattern_counts.get(diagram.PATTERN_NAME) || 0;
    pattern_counts.set(diagram.PATTERN_NAME, count + 1);
  }

  const PATTERN_SUMMARY = Array.from(pattern_counts.entries()).map(([PATTERN_NAME, COUNT]) => ({ PATTERN_NAME, COUNT }));

  return {
    DIAGRAMS: DIAGRAMS.map(validateDataStructure),
    DIAGRAM_COUNT: DIAGRAMS.length,
    HAS_AUTO_GENERATED: true,
    FLOW_TYPE: 'Conversation Flow',
    AUTO_CONVERSATION_FLOWCHART,
    AUTO_DECISION_TREES,
    AUTO_FLOW_COUNT: 1,
    AUTO_DECISION_COUNT: AUTO_DECISION_TREES.length,
    DIAGRAM_TYPES,
    PATTERN_SUMMARY
  };
}

/* ─────────────────────────────────────────────────────────────
   4. EXPORTS
──────────────────────────────────────────────────────────────── */

module.exports = {
  // Primary exports (snake_case)
  extract_phases_from_data,
  extract_diagrams,
  // Backward-compatible aliases (camelCase)
  extractPhasesFromData: extract_phases_from_data,
  extractDiagrams: extract_diagrams
};
