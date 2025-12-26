/**
 * Flowchart Generation Utilities
 * Creates ASCII flowcharts for workflows and conversations
 * @module flowchart-generator
 * @version 1.0.0
 */

// ───────────────────────────────────────────────────────────────
// PATTERN CONSTANTS
// ───────────────────────────────────────────────────────────────

/**
 * Workflow pattern types for flowchart generation
 */
const PATTERNS = {
  LINEAR: 'linear',
  PARALLEL: 'parallel'
};

/**
 * Diagram pattern classifications (from workflows-documentation)
 */
const DIAGRAM_PATTERNS = {
  LINEAR_SEQUENTIAL: 'Linear Sequential',
  DECISION_BRANCH: 'Decision Branch',
  PARALLEL_EXECUTION: 'Parallel Execution',
  NESTED_SUB_PROCESS: 'Nested Sub-Process',
  APPROVAL_GATE: 'Approval Gate',
  LOOP_ITERATION: 'Loop/Iteration',
  MULTI_STAGE_PIPELINE: 'Multi-Stage Pipeline',
  UNKNOWN: 'Unknown'
};

/**
 * Complexity levels for diagram classification
 */
const COMPLEXITY = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High'
};

// ───────────────────────────────────────────────────────────────
// HELPER FUNCTIONS
// ───────────────────────────────────────────────────────────────

/**
 * Truncate and pad text to specified length
 * @param {string} text - Text to pad
 * @param {number} length - Target length
 * @returns {string} Padded/truncated text
 */
function pad(text, length) {
  const truncated = text.substring(0, length);
  return truncated.padEnd(length);
}

// ───────────────────────────────────────────────────────────────
// PATTERN DETECTION
// ───────────────────────────────────────────────────────────────

/**
 * Detect workflow pattern from phases
 * Simplified to 2 patterns: linear (≤4 phases) or parallel (>4 phases)
 * @param {Array} phases - Array of phase objects
 * @returns {string} Pattern type: 'linear' or 'parallel'
 */
function detectWorkflowPattern(phases = []) {
  if (phases.length === 0) return PATTERNS.LINEAR;

  // Parallel: many phases (> 4)
  if (phases.length > 4) {
    return PATTERNS.PARALLEL;
  }

  // Linear: sequential progression (≤ 4 phases)
  return PATTERNS.LINEAR;
}

// ───────────────────────────────────────────────────────────────
// FLOWCHART GENERATION
// ───────────────────────────────────────────────────────────────

/**
 * Generate conversation flowchart from phases
 * @param {Array} phases - Array of phase objects with PHASE_NAME, DURATION
 * @param {string} initialRequest - Initial request label
 * @returns {string} ASCII flowchart
 */
function generateConversationFlowchart(phases = [], initialRequest = 'User Request') {
  if (phases.length === 0) {
    // Return simple sequential flow if no phases
    return `╭────────────────────╮
│  ${pad(initialRequest, 16)}  │
╰────────────────────╯
         │
         ▼
   ╭────────╮
   │  Done  │
   ╰────────╯`;
  }

  // Build multi-phase flowchart with visual hierarchy
  let flowchart = `╭────────────────────╮
│  ${pad(initialRequest, 16)}  │
╰────────────────────╯
         │`;

  for (let i = 0; i < phases.length; i++) {
    const phase = phases[i];
    const phaseName = phase.PHASE_NAME || `Phase ${i + 1}`;
    const duration = phase.DURATION || 'N/A';

    // Use standard process boxes for phases
    flowchart += `
         ▼
┌────────────────────┐
│  ${pad(phaseName, 16)}  │
│  ${pad(duration, 16)}  │
└────────────────────┘`;

    // Add connector for next phase
    if (i < phases.length - 1) {
      flowchart += `
         │`;
    }
  }

  // Add terminal completion box
  flowchart += `
         │
         ▼
   ╭────────╮
   │ ✅ Done │
   ╰────────╯`;

  return flowchart;
}

/**
 * Generate workflow flowchart from conversation phases
 * Detects pattern type and generates appropriate visualization
 * Matches parallel-execution.md reference style with wider boxes and inline details
 * @param {Array} phases - Array of phase objects
 * @returns {string|null} ASCII flowchart or null if no phases
 */
function generateWorkflowFlowchart(phases = []) {
  if (phases.length === 0) {
    return null; // No flowchart if no phases
  }

  // Helper for text padding to 56 chars (reference standard)
  const padWide = (text, length = 56) => text.substring(0, length).padEnd(length);

  let flowchart = '';

  // Start terminal (56 chars wide)
  flowchart = `╭────────────────────────────────────────────────────────╮
│${padWide('CONVERSATION WORKFLOW', 58).replace(/^(.*)$/, (m) => {
    const padding = Math.floor((58 - 'CONVERSATION WORKFLOW'.length) / 2);
    return ' '.repeat(padding) + 'CONVERSATION WORKFLOW' + ' '.repeat(58 - padding - 'CONVERSATION WORKFLOW'.length);
  })}│
╰────────────────────────────────────────────────────────╯
                        │
                        ▼`;

  const patternType = detectWorkflowPattern(phases);

  if (patternType === PATTERNS.LINEAR) {
    // Linear sequential flow with detailed boxes
    for (let i = 0; i < phases.length; i++) {
      const phase = phases[i];
      const phaseName = phase.PHASE_NAME || `Phase ${i + 1}`;
      const duration = phase.DURATION || 'Duration unknown';
      const activities = phase.ACTIVITIES || [];

      flowchart += `
┌────────────────────────────────────────────────────────┐
│  ${padWide(phaseName, 52)}  │`;

      // Add activity bullets (up to 3)
      for (let j = 0; j < Math.min(3, activities.length); j++) {
        flowchart += `
│  • ${padWide(activities[j], 50)}  │`;
      }

      flowchart += `
│  ${padWide('Duration: ' + duration, 52)}  │
└────────────────────────────────────────────────────────┘`;

      if (i < phases.length - 1) {
        flowchart += `
                        │
                        ▼`;
      }
    }
  } else if (patternType === PATTERNS.PARALLEL) {
    // Parallel execution pattern with section dividers
    const firstPhase = phases[0];
    const parallelPhases = phases.slice(1, Math.min(4, phases.length));

    // Preparation phase
    flowchart += `
┌────────────────────────────────────────────────────────┐
│  ${padWide(firstPhase.PHASE_NAME || 'Preparation', 52)}  │
│  • ${padWide((firstPhase.ACTIVITIES || [])[0] || 'Initial setup', 50)}  │
│  Duration: ${padWide(firstPhase.DURATION || 'N/A', 44)}  │
└────────────────────────────────────────────────────────┘
                        │
                        ▼
──────────────────────────────────────────────────────────
PARALLEL EXECUTION - ${parallelPhases.length} concurrent phases
──────────────────────────────────────────────────────────
                        │`;

    // Branch visualization
    if (parallelPhases.length === 2) {
      flowchart += `
      ┌─────────────────┼─────────────────┐
      │                 │                 │
      ▼                 ▼                 ▼`;
    } else {
      flowchart += `
      ┌─────────────────┼─────────────────┐
      │                 │                 │
      ▼                 ▼                 ▼`;
    }

    // Parallel phase boxes (narrower for side-by-side)
    flowchart += `
┌──────────┐      ┌──────────┐      ┌──────────┐`;

    const maxLines = Math.max(...parallelPhases.map(p => (p.ACTIVITIES || []).length + 3));
    for (let line = 0; line < maxLines; line++) {
      flowchart += '\n│';
      for (let i = 0; i < 3 && i < parallelPhases.length; i++) {
        const phase = parallelPhases[i];
        let text = '';

        if (line === 0) {
          text = (phase.PHASE_NAME || `Phase ${i + 1}`).substring(0, 8).padEnd(8);
        } else if (line === 1) {
          text = '        '; // Empty line
        } else if (line === 2) {
          const activity = (phase.ACTIVITIES || [])[0] || '';
          text = ('• ' + activity).substring(0, 8).padEnd(8);
        } else if (line < (phase.ACTIVITIES || []).length + 2) {
          const activity = (phase.ACTIVITIES || [])[line - 2] || '';
          text = ('• ' + activity).substring(0, 8).padEnd(8);
        } else if (line === maxLines - 2) {
          text = '        '; // Empty line
        } else if (line === maxLines - 1) {
          text = (phase.DURATION || 'N/A').substring(0, 8).padEnd(8);
        } else {
          text = '        ';
        }

        flowchart += ` ${text} │${i < 2 && i < parallelPhases.length - 1 ? '      ' : ''}`;
      }
    }

    flowchart += `
└──────────┘      └──────────┘      └──────────┘
      │                 │                 │
      │                 │                 │
      └─────────────────┼─────────────────┘
                        │
                        ▼    (All phases complete)
──────────────────────────────────────────────────────────
SYNCHRONIZATION POINT
──────────────────────────────────────────────────────────`;
  }

  // End terminal
  flowchart += `
                        │
                        ▼
╭────────────────────────────────────────────────────────╮
│${padWide('WORKFLOW COMPLETE', 58).replace(/^(.*)$/, (m) => {
    const padding = Math.floor((58 - 'WORKFLOW COMPLETE'.length) / 2);
    return ' '.repeat(padding) + 'WORKFLOW COMPLETE' + ' '.repeat(58 - padding - 'WORKFLOW COMPLETE'.length);
  })}│
╰────────────────────────────────────────────────────────╯`;

  return flowchart;
}

// ───────────────────────────────────────────────────────────────
// PHASE DETAILS & FEATURES
// ───────────────────────────────────────────────────────────────

/**
 * Build phase details for workflow template
 * @param {Array} phases - Array of phase objects
 * @returns {Array} Array of detailed phase objects
 */
function buildPhaseDetails(phases = []) {
  return phases.map((phase, index) => ({
    INDEX: index + 1,
    PHASE_NAME: phase.PHASE_NAME || `Phase ${index + 1}`,
    DURATION: phase.DURATION || 'N/A',
    ACTIVITIES: phase.ACTIVITIES || [],
    HAS_TRANSITION: index < phases.length - 1,
    FROM_PHASE: phase.PHASE_NAME || `Phase ${index + 1}`,
    TO_PHASE: phases[index + 1]?.PHASE_NAME || 'Complete',
    TRANSITION_TRIGGER: phase.TRANSITION_TRIGGER || 'Completion of previous phase'
  }));
}

/**
 * Extract key features demonstrated in the flowchart
 * Analyzes phases and pattern type to identify what the flowchart shows
 * Simplified to 2 patterns: linear and parallel
 * @param {Array} phases - Array of phase objects
 * @param {string} patternType - Pattern type: 'linear' or 'parallel'
 * @returns {Array} Array of feature objects with FEATURE_NAME and FEATURE_DESC
 */
function extractFlowchartFeatures(phases = [], patternType = 'linear') {
  const features = [];

  // Pattern-specific features
  if (patternType === PATTERNS.PARALLEL) {
    features.push({
      FEATURE_NAME: 'Parallel execution',
      FEATURE_DESC: 'Multiple phases running concurrently'
    });
    features.push({
      FEATURE_NAME: 'Synchronization points',
      FEATURE_DESC: 'Coordination between parallel streams'
    });
  } else {
    // Linear pattern
    features.push({
      FEATURE_NAME: 'Sequential progression',
      FEATURE_DESC: 'Step-by-step workflow execution'
    });
  }

  // Phase-based features (data-driven)
  if (phases.length > 0) {
    const hasActivities = phases.some(p => p.ACTIVITIES && p.ACTIVITIES.length > 0);
    if (hasActivities) {
      features.push({
        FEATURE_NAME: 'Detailed activities',
        FEATURE_DESC: 'Inline breakdown of phase tasks'
      });
    }

    const hasDurations = phases.every(p => p.DURATION && p.DURATION !== 'N/A');
    if (hasDurations) {
      features.push({
        FEATURE_NAME: 'Timing information',
        FEATURE_DESC: 'Duration tracking for each phase'
      });
    }
  }

  // Generic features
  features.push({
    FEATURE_NAME: 'Phase count',
    FEATURE_DESC: `${phases.length} distinct phases tracked`
  });

  return features;
}

/**
 * Get use case scenarios based on pattern type
 * Maps workflow patterns to applicable real-world scenarios
 * Simplified to 2 patterns: linear and parallel
 * @param {string} patternType - Pattern type: 'linear' or 'parallel'
 * @returns {Array} Array of use case description strings
 */
function getPatternUseCases(patternType = 'linear') {
  const useCaseMap = {
    linear: [
      'Sequential feature implementations',
      'Bug fixes and patches',
      'Documentation generation',
      'Single-file modifications',
      'Simple refactoring',
      'Research-driven development'
    ],
    parallel: [
      'Concurrent development tasks',
      'Multi-file refactoring',
      'Parallel research and implementation',
      'Independent feature development',
      'Distributed problem-solving',
      'Complex system changes'
    ]
  };

  return useCaseMap[patternType] || useCaseMap.linear;
}

// ───────────────────────────────────────────────────────────────
// DIAGRAM CLASSIFICATION
// ───────────────────────────────────────────────────────────────

/**
 * Classify diagram by pattern based on ASCII art content
 * Uses workflows-documentation flowchart pattern library (Mode 3)
 * Based on 7 core patterns from workflows-documentation skill
 * @param {string} asciiArt - ASCII art diagram content
 * @returns {Object} Object with pattern and complexity properties
 */
function classifyDiagramPattern(asciiArt) {
  const art = asciiArt.toLowerCase();
  let complexity = COMPLEXITY.LOW;
  let pattern = DIAGRAM_PATTERNS.UNKNOWN;

  // Count various indicators
  const hasDecisionDiamond = asciiArt.includes('╱') && asciiArt.includes('╲');
  const hasParallelBlock = art.includes('parallel') || asciiArt.includes('───────────────');
  const hasApprovalGate = asciiArt.includes('╔═') || art.includes('approval') || art.includes('gate');
  const hasLoopBack = art.includes('loop') || (asciiArt.includes('└') && asciiArt.includes('┘'));
  const hasNestedProcess = art.includes('sub-process') || art.includes('sub process');
  const hasPipeline = asciiArt.includes('────▶') || (art.includes('stage') && asciiArt.includes('│'));

  // Box count estimation (rough complexity indicator)
  const boxCount = (asciiArt.match(/┌[─]+┐/g) || []).length +
                   (asciiArt.match(/╭[─]+╮/g) || []).length +
                   (asciiArt.match(/╔[═]+╗/g) || []).length;

  // Pattern 5: Approval Gate (highest priority - specific marker)
  if (hasApprovalGate) {
    pattern = DIAGRAM_PATTERNS.APPROVAL_GATE;
    complexity = COMPLEXITY.MEDIUM;
  }
  // Pattern 6: Loop/Iteration
  else if (hasLoopBack) {
    pattern = DIAGRAM_PATTERNS.LOOP_ITERATION;
    complexity = COMPLEXITY.MEDIUM;
  }
  // Pattern 3: Parallel Execution
  else if (hasParallelBlock) {
    pattern = DIAGRAM_PATTERNS.PARALLEL_EXECUTION;
    complexity = COMPLEXITY.HIGH;
  }
  // Pattern 2: Decision Branch
  else if (hasDecisionDiamond) {
    pattern = DIAGRAM_PATTERNS.DECISION_BRANCH;
    complexity = boxCount > 5 ? COMPLEXITY.HIGH : COMPLEXITY.MEDIUM;
  }
  // Pattern 7: Multi-Stage Pipeline
  else if (hasPipeline) {
    pattern = DIAGRAM_PATTERNS.MULTI_STAGE_PIPELINE;
    complexity = COMPLEXITY.MEDIUM;
  }
  // Pattern 4: Nested Sub-Process
  else if (hasNestedProcess) {
    pattern = DIAGRAM_PATTERNS.NESTED_SUB_PROCESS;
    complexity = COMPLEXITY.HIGH;
  }
  // Pattern 1: Linear Sequential Flow (default)
  else if (asciiArt.includes('┌') || asciiArt.includes('│') || asciiArt.includes('▼')) {
    pattern = DIAGRAM_PATTERNS.LINEAR_SEQUENTIAL;
    complexity = boxCount > 10 ? COMPLEXITY.MEDIUM : COMPLEXITY.LOW;
  }

  return { pattern, complexity };
}

// ───────────────────────────────────────────────────────────────
// MODULE EXPORTS
// ───────────────────────────────────────────────────────────────

module.exports = {
  // Flowchart generation
  generateConversationFlowchart,
  generateWorkflowFlowchart,
  
  // Pattern detection & classification
  detectWorkflowPattern,
  classifyDiagramPattern,
  
  // Phase utilities
  buildPhaseDetails,
  extractFlowchartFeatures,
  getPatternUseCases,
  
  // Constants
  PATTERNS,
  DIAGRAM_PATTERNS,
  COMPLEXITY
};
