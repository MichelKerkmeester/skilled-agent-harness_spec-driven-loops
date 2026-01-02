// ───────────────────────────────────────────────────────────────
// LIB: FLOWCHART GENERATOR
// ───────────────────────────────────────────────────────────────

'use strict';

/* ─────────────────────────────────────────────────────────────
   1. PATTERN CONSTANTS
──────────────────────────────────────────────────────────────── */

const PATTERNS = {
  LINEAR: 'linear',
  PARALLEL: 'parallel',
};

const DIAGRAM_PATTERNS = {
  LINEAR_SEQUENTIAL: 'Linear Sequential',
  DECISION_BRANCH: 'Decision Branch',
  PARALLEL_EXECUTION: 'Parallel Execution',
  NESTED_SUB_PROCESS: 'Nested Sub-Process',
  APPROVAL_GATE: 'Approval Gate',
  LOOP_ITERATION: 'Loop/Iteration',
  MULTI_STAGE_PIPELINE: 'Multi-Stage Pipeline',
  UNKNOWN: 'Unknown',
};

const COMPLEXITY = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
};

/* ─────────────────────────────────────────────────────────────
   2. HELPER FUNCTIONS
──────────────────────────────────────────────────────────────── */

function pad(text, length) {
  return text.substring(0, length).padEnd(length);
}

/* ─────────────────────────────────────────────────────────────
   3. PATTERN DETECTION
──────────────────────────────────────────────────────────────── */

// Linear (≤4 phases) or parallel (>4 phases)
function detect_workflow_pattern(phases = []) {
  if (phases.length === 0) return PATTERNS.LINEAR;
  return phases.length > 4 ? PATTERNS.PARALLEL : PATTERNS.LINEAR;
}

/* ─────────────────────────────────────────────────────────────
   4. FLOWCHART GENERATION
──────────────────────────────────────────────────────────────── */

function generate_conversation_flowchart(phases = [], initial_request = 'User Request') {
  if (phases.length === 0) {
    return `╭────────────────────╮
│  ${pad(initial_request, 16)}  │
╰────────────────────╯
         │
         ▼
   ╭────────╮
   │  Done  │
   ╰────────╯`;
  }

  let flowchart = `╭────────────────────╮
│  ${pad(initial_request, 16)}  │
╰────────────────────╯
         │`;

  for (let i = 0; i < phases.length; i++) {
    const phase = phases[i];
    const phase_name = phase.PHASE_NAME || `Phase ${i + 1}`;
    const duration = phase.DURATION || 'N/A';

    flowchart += `
         ▼
┌────────────────────┐
│  ${pad(phase_name, 16)}  │
│  ${pad(duration, 16)}  │
└────────────────────┘`;

    if (i < phases.length - 1) {
      flowchart += `
         │`;
    }
  }

  flowchart += `
         │
         ▼
   ╭────────╮
   │ ✅ Done │
   ╰────────╯`;

  return flowchart;
}

// Matches parallel-execution.md reference style with wider boxes
function generate_workflow_flowchart(phases = []) {
  if (phases.length === 0) {
    return null;
  }

  const pad_wide = (text, length = 56) => text.substring(0, length).padEnd(length);
  let flowchart = '';

  flowchart = `╭────────────────────────────────────────────────────────╮
│${pad_wide('CONVERSATION WORKFLOW', 58).replace(/^(.*)$/, (m) => {
    const padding = Math.floor((58 - 'CONVERSATION WORKFLOW'.length) / 2);
    return ' '.repeat(padding) + 'CONVERSATION WORKFLOW' + ' '.repeat(58 - padding - 'CONVERSATION WORKFLOW'.length);
  })}│
╰────────────────────────────────────────────────────────╯
                        │
                        ▼`;

  const pattern_type = detect_workflow_pattern(phases);

  if (pattern_type === PATTERNS.LINEAR) {
    for (let i = 0; i < phases.length; i++) {
      const phase = phases[i];
      const phase_name = phase.PHASE_NAME || `Phase ${i + 1}`;
      const duration = phase.DURATION || 'Duration unknown';
      const activities = phase.ACTIVITIES || [];

      flowchart += `
┌────────────────────────────────────────────────────────┐
│  ${pad_wide(phase_name, 52)}  │`;

      for (let j = 0; j < Math.min(3, activities.length); j++) {
        flowchart += `
│  • ${pad_wide(activities[j], 50)}  │`;
      }

      flowchart += `
│  ${pad_wide('Duration: ' + duration, 52)}  │
└────────────────────────────────────────────────────────┘`;

      if (i < phases.length - 1) {
        flowchart += `
                        │
                        ▼`;
      }
    }
  } else if (pattern_type === PATTERNS.PARALLEL) {
    const first_phase = phases[0];
    const parallel_phases = phases.slice(1, Math.min(4, phases.length));

    flowchart += `
┌────────────────────────────────────────────────────────┐
│  ${pad_wide(first_phase.PHASE_NAME || 'Preparation', 52)}  │
│  • ${pad_wide((first_phase.ACTIVITIES || [])[0] || 'Initial setup', 50)}  │
│  Duration: ${pad_wide(first_phase.DURATION || 'N/A', 44)}  │
└────────────────────────────────────────────────────────┘
                        │
                        ▼
──────────────────────────────────────────────────────────
PARALLEL EXECUTION - ${parallel_phases.length} concurrent phases
──────────────────────────────────────────────────────────
                        │`;

    flowchart += `
      ┌─────────────────┼─────────────────┐
      │                 │                 │
      ▼                 ▼                 ▼`;

    flowchart += `
┌──────────┐      ┌──────────┐      ┌──────────┐`;

    const max_lines = Math.max(...parallel_phases.map(p => (p.ACTIVITIES || []).length + 3));
    for (let line = 0; line < max_lines; line++) {
      flowchart += '\n│';
      for (let i = 0; i < 3 && i < parallel_phases.length; i++) {
        const phase = parallel_phases[i];
        let text = '';

        if (line === 0) {
          text = (phase.PHASE_NAME || `Phase ${i + 1}`).substring(0, 8).padEnd(8);
        } else if (line === 1) {
          text = '        ';
        } else if (line === 2) {
          const activity = (phase.ACTIVITIES || [])[0] || '';
          text = ('• ' + activity).substring(0, 8).padEnd(8);
        } else if (line < (phase.ACTIVITIES || []).length + 2) {
          const activity = (phase.ACTIVITIES || [])[line - 2] || '';
          text = ('• ' + activity).substring(0, 8).padEnd(8);
        } else if (line === max_lines - 2) {
          text = '        ';
        } else if (line === max_lines - 1) {
          text = (phase.DURATION || 'N/A').substring(0, 8).padEnd(8);
        } else {
          text = '        ';
        }

        flowchart += ` ${text} │${i < 2 && i < parallel_phases.length - 1 ? '      ' : ''}`;
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

  flowchart += `
                        │
                        ▼
╭────────────────────────────────────────────────────────╮
│${pad_wide('WORKFLOW COMPLETE', 58).replace(/^(.*)$/, (m) => {
    const padding = Math.floor((58 - 'WORKFLOW COMPLETE'.length) / 2);
    return ' '.repeat(padding) + 'WORKFLOW COMPLETE' + ' '.repeat(58 - padding - 'WORKFLOW COMPLETE'.length);
  })}│
╰────────────────────────────────────────────────────────╯`;

  return flowchart;
}

/* ─────────────────────────────────────────────────────────────
   5. PHASE DETAILS & FEATURES
──────────────────────────────────────────────────────────────── */

function build_phase_details(phases = []) {
  return phases.map((phase, index) => ({
    INDEX: index + 1,
    PHASE_NAME: phase.PHASE_NAME || `Phase ${index + 1}`,
    DURATION: phase.DURATION || 'N/A',
    ACTIVITIES: phase.ACTIVITIES || [],
    HAS_TRANSITION: index < phases.length - 1,
    FROM_PHASE: phase.PHASE_NAME || `Phase ${index + 1}`,
    TO_PHASE: phases[index + 1]?.PHASE_NAME || 'Complete',
    TRANSITION_TRIGGER: phase.TRANSITION_TRIGGER || 'Completion of previous phase',
  }));
}

function extract_flowchart_features(phases = [], pattern_type = 'linear') {
  const features = [];

  if (pattern_type === PATTERNS.PARALLEL) {
    features.push({ FEATURE_NAME: 'Parallel execution', FEATURE_DESC: 'Multiple phases running concurrently' });
    features.push({ FEATURE_NAME: 'Synchronization points', FEATURE_DESC: 'Coordination between parallel streams' });
  } else {
    features.push({ FEATURE_NAME: 'Sequential progression', FEATURE_DESC: 'Step-by-step workflow execution' });
  }

  if (phases.length > 0) {
    const has_activities = phases.some(p => p.ACTIVITIES && p.ACTIVITIES.length > 0);
    if (has_activities) {
      features.push({ FEATURE_NAME: 'Detailed activities', FEATURE_DESC: 'Inline breakdown of phase tasks' });
    }

    const has_durations = phases.every(p => p.DURATION && p.DURATION !== 'N/A');
    if (has_durations) {
      features.push({ FEATURE_NAME: 'Timing information', FEATURE_DESC: 'Duration tracking for each phase' });
    }
  }

  features.push({ FEATURE_NAME: 'Phase count', FEATURE_DESC: `${phases.length} distinct phases tracked` });
  return features;
}

function get_pattern_use_cases(pattern_type = 'linear') {
  const use_case_map = {
    linear: [
      'Sequential feature implementations',
      'Bug fixes and patches',
      'Documentation generation',
      'Single-file modifications',
      'Simple refactoring',
      'Research-driven development',
    ],
    parallel: [
      'Concurrent development tasks',
      'Multi-file refactoring',
      'Parallel research and implementation',
      'Independent feature development',
      'Distributed problem-solving',
      'Complex system changes',
    ],
  };

  return use_case_map[pattern_type] || use_case_map.linear;
}

/* ─────────────────────────────────────────────────────────────
   6. DIAGRAM CLASSIFICATION
──────────────────────────────────────────────────────────────── */

// Classifies ASCII art using 7 core patterns from workflows-documentation
function classify_diagram_pattern(ascii_art) {
  const art = ascii_art.toLowerCase();
  let complexity = COMPLEXITY.LOW;
  let pattern = DIAGRAM_PATTERNS.UNKNOWN;

  const has_decision_diamond = ascii_art.includes('╱') && ascii_art.includes('╲');
  const has_parallel_block = art.includes('parallel') || ascii_art.includes('───────────────');
  const has_approval_gate = ascii_art.includes('╔═') || art.includes('approval') || art.includes('gate');
  const has_loop_back = art.includes('loop') || (ascii_art.includes('└') && ascii_art.includes('┘'));
  const has_nested_process = art.includes('sub-process') || art.includes('sub process');
  const has_pipeline = ascii_art.includes('────▶') || (art.includes('stage') && ascii_art.includes('│'));

  const box_count = (ascii_art.match(/┌[─]+┐/g) || []).length +
                   (ascii_art.match(/╭[─]+╮/g) || []).length +
                   (ascii_art.match(/╔[═]+╗/g) || []).length;

  if (has_approval_gate) {
    pattern = DIAGRAM_PATTERNS.APPROVAL_GATE;
    complexity = COMPLEXITY.MEDIUM;
  } else if (has_loop_back) {
    pattern = DIAGRAM_PATTERNS.LOOP_ITERATION;
    complexity = COMPLEXITY.MEDIUM;
  } else if (has_parallel_block) {
    pattern = DIAGRAM_PATTERNS.PARALLEL_EXECUTION;
    complexity = COMPLEXITY.HIGH;
  } else if (has_decision_diamond) {
    pattern = DIAGRAM_PATTERNS.DECISION_BRANCH;
    complexity = box_count > 5 ? COMPLEXITY.HIGH : COMPLEXITY.MEDIUM;
  } else if (has_pipeline) {
    pattern = DIAGRAM_PATTERNS.MULTI_STAGE_PIPELINE;
    complexity = COMPLEXITY.MEDIUM;
  } else if (has_nested_process) {
    pattern = DIAGRAM_PATTERNS.NESTED_SUB_PROCESS;
    complexity = COMPLEXITY.HIGH;
  } else if (ascii_art.includes('┌') || ascii_art.includes('│') || ascii_art.includes('▼')) {
    pattern = DIAGRAM_PATTERNS.LINEAR_SEQUENTIAL;
    complexity = box_count > 10 ? COMPLEXITY.MEDIUM : COMPLEXITY.LOW;
  }

  return { pattern, complexity };
}

/* ─────────────────────────────────────────────────────────────
   7. MODULE EXPORTS
──────────────────────────────────────────────────────────────── */

module.exports = {
  // Snake_case exports (original)
  generate_conversation_flowchart,
  generate_workflow_flowchart,
  detect_workflow_pattern,
  classify_diagram_pattern,
  build_phase_details,
  extract_flowchart_features,
  get_pattern_use_cases,
  // CamelCase aliases (for generate-context.js compatibility)
  generateConversationFlowchart: generate_conversation_flowchart,
  generateWorkflowFlowchart: generate_workflow_flowchart,
  detectWorkflowPattern: detect_workflow_pattern,
  classifyDiagramPattern: classify_diagram_pattern,
  buildPhaseDetails: build_phase_details,
  extractFlowchartFeatures: extract_flowchart_features,
  getPatternUseCases: get_pattern_use_cases,
  // Constants
  PATTERNS,
  DIAGRAM_PATTERNS,
  COMPLEXITY,
};
