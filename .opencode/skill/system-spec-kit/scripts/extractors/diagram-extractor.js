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

function extractPhasesFromData(collectedData) {
  // Check parent object exists BEFORE accessing properties
  if (!collectedData || !collectedData.observations || collectedData.observations.length === 0) {
    return simFactory.createSimulationPhases();
  }
  
  // Return empty for very short sessions (≤2 messages)
  // Safe to access now - we verified collectedData.observations exists above
  const messageCount = collectedData.observations.length;
  if (messageCount <= 2) {
    console.log('   ℹ️  Session too short for meaningful phase detection');
    return [];
  }

  const observations = collectedData.observations;
  const phaseMap = new Map();

  for (const obs of observations) {
    const tools = obs.facts?.flatMap(f => {
      if (typeof f !== 'string') return [];

      const detection = detectToolCall(f);
      if (!detection) return [];

      const toolIndex = f.search(new RegExp(`\\b${detection.tool}\\b`, 'i'));
      if (toolIndex >= 0 && isProseContext(f, toolIndex)) {
        return [];
      }

      return [detection.tool];
    }) || [];
    const content = obs.narrative || '';

    const phase = classifyConversationPhase(
      tools.map(t => ({ tool: t })),
      content
    );

    if (!phaseMap.has(phase)) {
      phaseMap.set(phase, { count: 0, duration: 0, activities: [] });
    }

    const phaseData = phaseMap.get(phase);
    phaseData.count++;

    if (content && content.trim().length > 10) {
      let activity = content.substring(0, 50);
      const lastSpace = activity.lastIndexOf(' ');
      if (lastSpace > 30) {
        activity = activity.substring(0, lastSpace);
      }

      if (activity.length < content.length) {
        activity += '...';
      }

      const meaningfulContent = activity.replace(/[^a-zA-Z0-9]/g, '');
      if (meaningfulContent.length < 5) continue;

      if (!phaseData.activities.includes(activity)) {
        phaseData.activities.push(activity);
      }
    }
  }

  return Array.from(phaseMap.entries()).map(([name, data]) => ({
    PHASE_NAME: name,
    DURATION: `${data.count} actions`,
    ACTIVITIES: data.activities.slice(0, 3)
  }));
}

/* ─────────────────────────────────────────────────────────────
   3. DIAGRAM EXTRACTION
──────────────────────────────────────────────────────────────── */

async function extractDiagrams(collectedData) {
  if (!collectedData) {
    console.log('   ⚠️  Using simulation data for diagrams');
    return simFactory.createDiagramData();
  }

  const observations = collectedData.observations || [];
  const decisions = collectedData.observations?.filter(o => o.type === 'decision') || [];
  const userPrompts = collectedData.user_prompts || [];

  const boxChars = /[┌┐└┘├┤┬┴┼─│╭╮╰╯╱╲▼▲►◄]/;

  const DIAGRAMS = [];

  for (const obs of observations) {
    const narrative = obs.narrative || '';
    const facts = obs.facts || [];

    if (boxChars.test(narrative) || facts.some(f => boxChars.test(f))) {
      const asciiArt = boxChars.test(narrative)
        ? narrative
        : facts.find(f => boxChars.test(f)) || '';

      const pattern = flowchartGen.classifyDiagramPattern(asciiArt);

      DIAGRAMS.push({
        TITLE: obs.title || 'Detected Diagram',
        TIMESTAMP: obs.timestamp || new Date().toISOString(),
        DIAGRAM_TYPE: obs.type === 'decision' ? 'Decision Tree' : 'Workflow',
        PATTERN_NAME: pattern.pattern,
        COMPLEXITY: pattern.complexity,
        HAS_DESCRIPTION: !!obs.title,
        DESCRIPTION: obs.title || 'Diagram found in conversation',
        ASCII_ART: asciiArt.substring(0, 1000),
        HAS_NOTES: false,
        NOTES: [],
        HAS_RELATED_FILES: obs.files && obs.files.length > 0,
        RELATED_FILES: obs.files ? obs.files.map(f => ({ FILE_PATH: f })) : []
      });
    }
  }

  const phases = extractPhasesFromData(collectedData);
  const AUTO_CONVERSATION_FLOWCHART = flowchartGen.generateConversationFlowchart(
    phases,
    userPrompts[0]?.prompt || 'User request'
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

  const diagramTypeCounts = new Map();
  for (const diagram of DIAGRAMS) {
    const count = diagramTypeCounts.get(diagram.DIAGRAM_TYPE) || 0;
    diagramTypeCounts.set(diagram.DIAGRAM_TYPE, count + 1);
  }

  const DIAGRAM_TYPES = Array.from(diagramTypeCounts.entries()).map(([TYPE, COUNT]) => ({ TYPE, COUNT }));

  const patternCounts = new Map();
  for (const diagram of DIAGRAMS) {
    const count = patternCounts.get(diagram.PATTERN_NAME) || 0;
    patternCounts.set(diagram.PATTERN_NAME, count + 1);
  }

  const PATTERN_SUMMARY = Array.from(patternCounts.entries()).map(([PATTERN_NAME, COUNT]) => ({ PATTERN_NAME, COUNT }));

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
  extractPhasesFromData,
  extractDiagrams
};
