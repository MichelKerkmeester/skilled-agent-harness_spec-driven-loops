// ───────────────────────────────────────────────────────────────
// LIB: SIMULATION FACTORY
// ───────────────────────────────────────────────────────────────

'use strict';

const crypto = require('crypto');

/* ─────────────────────────────────────────────────────────────
   1. UTILITIES
──────────────────────────────────────────────────────────────── */

function secure_random_string(length = 9) {
  return crypto.randomBytes(Math.ceil(length * 0.75))
    .toString('base64')
    .replace(/[+/=]/g, '')
    .slice(0, length);
}

function format_timestamp(date = new Date(), format = 'iso') {
  const d = date instanceof Date ? date : new Date(date);

  if (isNaN(d.getTime())) {
    return format_timestamp(new Date(), format);
  }

  const iso_string = d.toISOString();
  const [date_part, time_part] = iso_string.split('T');
  const time_without_ms = time_part.split('.')[0];

  switch (format) {
    case 'iso':
      return iso_string.split('.')[0] + 'Z';
    case 'readable':
      return `${date_part} @ ${time_without_ms}`;
    case 'date':
      return date_part;
    case 'date-dutch': {
      const [year, month, day] = date_part.split('-');
      const short_year = year.slice(-2);
      return `${day}-${month}-${short_year}`;
    }
    case 'time':
      return time_without_ms;
    case 'time-short': {
      const [hours, minutes] = time_without_ms.split(':');
      return `${hours}-${minutes}`;
    }
    case 'filename':
      return `${date_part}_${time_without_ms.replace(/:/g, '-')}`;
    default:
      return iso_string;
  }
}

function generate_session_id() {
  return `session-${Date.now()}-${secure_random_string(9)}`;
}

/* ─────────────────────────────────────────────────────────────
   2. SESSION DATA FACTORY
──────────────────────────────────────────────────────────────── */

function create_session_data(config = {}) {
  const now = new Date();
  const session_id = config.sessionId || generate_session_id();
  const spec_folder = config.specFolder || 'simulation';
  const channel = config.channel || 'default';
  const skill_version = config.skillVersion || '11.2.0';
  const simulated_epoch = Math.floor(Date.now() / 1000);

  const date_only = format_timestamp(now, 'date-dutch');
  const time_only = format_timestamp(now, 'time-short');
  const folder_title = spec_folder.replace(/^\d{3}-/, '').replace(/-/g, ' ');

  return {
    TITLE: folder_title,
    DATE: date_only,
    TIME: time_only,
    SPEC_FOLDER: spec_folder,
    DURATION: 'N/A (simulated)',
    SUMMARY: '⚠️ SIMULATION MODE - No real conversation data available. This is placeholder data for testing.',
    FILES: [
      { FILE_PATH: '⚠️ SIMULATION MODE', DESCRIPTION: 'No files were tracked - using fallback data' },
    ],
    HAS_FILES: true,
    FILE_COUNT: 1,
    OUTCOMES: [
      { OUTCOME: '⚠️ SIMULATION MODE - Real conversation data not available' },
    ],
    TOOL_COUNT: 0,
    MESSAGE_COUNT: 0,
    QUICK_SUMMARY: '⚠️ SIMULATION MODE - Provide conversation data via JSON file for real output',
    SKILL_VERSION: skill_version,
    SESSION_ID: session_id,
    CHANNEL: channel,
    IMPORTANCE_TIER: 'normal',
    CONTEXT_TYPE: 'general',
    CREATED_AT_EPOCH: simulated_epoch,
    LAST_ACCESSED_EPOCH: simulated_epoch,
    EXPIRES_AT_EPOCH: simulated_epoch + (90 * 24 * 60 * 60),
    TOOL_COUNTS: {},
    DECISION_COUNT: 0,
    ACCESS_COUNT: 1,
    LAST_SEARCH_QUERY: '',
    RELEVANCE_BOOST: 1.0,
    SPEC_FILES: [],
    HAS_SPEC_FILES: false,
    HAS_IMPLEMENTATION_GUIDE: false,
    TOPIC: '',
    IMPLEMENTATIONS: [],
    IMPL_KEY_FILES: [],
    EXTENSION_GUIDES: [],
    PATTERNS: [],
    OBSERVATIONS: [],
    HAS_OBSERVATIONS: false,
  };
}

/* ─────────────────────────────────────────────────────────────
   3. CONVERSATION DATA FACTORY
──────────────────────────────────────────────────────────────── */

function create_conversation_data(config = {}) {
  const user_message = config.userMessage || 'This is a simulated user message.';
  const assistant_message = config.assistantMessage || 'This is a simulated assistant response.';
  const now = new Date();

  return {
    MESSAGES: [
      {
        TIMESTAMP: format_timestamp(now, 'readable'),
        ROLE: 'User',
        CONTENT: user_message,
        TOOL_CALLS: [],
      },
      {
        TIMESTAMP: format_timestamp(now, 'readable'),
        ROLE: 'Assistant',
        CONTENT: assistant_message,
        TOOL_CALLS: [
          {
            TOOL_NAME: 'Read',
            DESCRIPTION: 'Read example.js',
            HAS_RESULT: true,
            RESULT_PREVIEW: 'const example = "simulated";',
            HAS_MORE: false,
          },
        ],
      },
    ],
    MESSAGE_COUNT: 2,
    DURATION: 'N/A (simulated)',
    FLOW_PATTERN: 'Sequential with Decision Points',
    PHASE_COUNT: 4,
    PHASES: [
      { PHASE_NAME: 'Research', DURATION: '10 min' },
      { PHASE_NAME: 'Clarification', DURATION: '2 min' },
      { PHASE_NAME: 'Implementation', DURATION: '30 min' },
      { PHASE_NAME: 'Verification', DURATION: '5 min' },
    ],
    AUTO_GENERATED_FLOW: create_simulation_flowchart(),
    TOOL_COUNT: 1,
    DATE: now.toISOString().split('T')[0],
  };
}

/* ─────────────────────────────────────────────────────────────
   4. DECISION DATA FACTORY
──────────────────────────────────────────────────────────────── */

function create_decision_data(config = {}) {
  const title = config.title || 'Simulated Decision Example';
  const context = config.context || 'This is a simulated decision for testing purposes.';
  const now = new Date();

  const decisions = [
    {
      INDEX: 1,
      TITLE: title,
      CONTEXT: context,
      TIMESTAMP: format_timestamp(now),
      OPTIONS: [
        {
          OPTION_NUMBER: 1,
          LABEL: 'Option A',
          DESCRIPTION: 'First option description',
          HAS_PROS_CONS: true,
          PROS: [{ PRO: 'Simple to implement' }],
          CONS: [{ CON: 'Limited flexibility' }],
        },
        {
          OPTION_NUMBER: 2,
          LABEL: 'Option B',
          DESCRIPTION: 'Second option description',
          HAS_PROS_CONS: true,
          PROS: [{ PRO: 'More flexible' }],
          CONS: [{ CON: 'More complex' }],
        },
      ],
      CHOSEN: 'Option B',
      RATIONALE: 'Flexibility was prioritized over simplicity for this use case.',
      HAS_PROS: true,
      PROS: [
        { PRO: 'Flexible architecture' },
        { PRO: 'Extensible design' },
      ],
      HAS_CONS: true,
      CONS: [
        { CON: 'Higher initial complexity' },
      ],
      CONFIDENCE: 85,
      HAS_EVIDENCE: true,
      EVIDENCE: [
        { EVIDENCE_ITEM: 'example.js:123' },
      ],
      HAS_CAVEATS: true,
      CAVEATS: [
        { CAVEAT_ITEM: 'Requires additional setup time' },
      ],
      HAS_FOLLOWUP: true,
      FOLLOWUP: [
        { FOLLOWUP_ITEM: 'Review performance after implementation' },
      ],
      DECISION_TREE: '',
      HAS_DECISION_TREE: false,
      DECISION_ANCHOR_ID: 'decision-simulated-example-000',
      DECISION_IMPORTANCE: 'medium',
    },
  ];

  return {
    DECISIONS: decisions,
    DECISION_COUNT: 1,
    HIGH_CONFIDENCE_COUNT: 1,
    MEDIUM_CONFIDENCE_COUNT: 0,
    LOW_CONFIDENCE_COUNT: 0,
    FOLLOWUP_COUNT: 1,
  };
}

/* ─────────────────────────────────────────────────────────────
   5. DIAGRAM DATA FACTORY
──────────────────────────────────────────────────────────────── */

function create_diagram_data(config = {}) {
  const title = config.title || 'Example Workflow';
  const description = config.description || 'Simulated workflow diagram';
  const now = new Date();

  const ascii_workflow = `┌─────────┐
│  Start  │
└────┬────┘
     │
     ▼
┌─────────┐
│ Process │
└────┬────┘
     │
     ▼
┌─────────┐
│   End   │
└─────────┘`;

  return {
    DIAGRAMS: [
      {
        TITLE: title,
        TIMESTAMP: format_timestamp(now),
        DIAGRAM_TYPE: 'Workflow',
        PATTERN_NAME: 'Sequential Flow',
        COMPLEXITY: 'Low',
        HAS_DESCRIPTION: true,
        DESCRIPTION: description,
        ASCII_ART: ascii_workflow,
        HAS_NOTES: false,
        NOTES: [],
        HAS_RELATED_FILES: false,
        RELATED_FILES: [],
      },
    ],
    DIAGRAM_COUNT: 1,
    HAS_AUTO_GENERATED: true,
    FLOW_TYPE: 'Conversation Flow',
    AUTO_CONVERSATION_FLOWCHART: create_simulation_flowchart(),
    AUTO_DECISION_TREES: [],
    AUTO_FLOW_COUNT: 1,
    AUTO_DECISION_COUNT: 0,
    DIAGRAM_TYPES: [
      { TYPE: 'Workflow', COUNT: 1 },
    ],
    PATTERN_SUMMARY: [
      { PATTERN_NAME: 'Sequential Flow', COUNT: 1 },
    ],
  };
}

/* ─────────────────────────────────────────────────────────────
   6. FLOWCHART AND PHASES
──────────────────────────────────────────────────────────────── */

function create_simulation_flowchart(initial_request = 'User Request') {
  const pad = (text, length) => {
    const truncated = text.substring(0, length);
    return truncated.padEnd(length);
  };

  return `╭────────────────────╮
│  ${pad(initial_request, 16)}  │
╰────────────────────╯
         │
         ▼
   ╭────────╮
   │  Done  │
    ╰────────╯`;
}

function create_simulation_phases() {
  return [
    {
      PHASE_NAME: 'Research',
      DURATION: '5 min',
      ACTIVITIES: ['Exploring codebase', 'Reading documentation', 'Understanding requirements'],
    },
    {
      PHASE_NAME: 'Planning',
      DURATION: '3 min',
      ACTIVITIES: ['Designing solution', 'Creating task breakdown'],
    },
    {
      PHASE_NAME: 'Implementation',
      DURATION: '15 min',
      ACTIVITIES: ['Writing code', 'Applying changes', 'Refactoring'],
    },
    {
      PHASE_NAME: 'Verification',
      DURATION: '2 min',
      ACTIVITIES: ['Running tests', 'Validating results'],
    },
  ];
}

/* ─────────────────────────────────────────────────────────────
   7. FULL SIMULATION AND DETECTION
──────────────────────────────────────────────────────────────── */

function create_full_simulation(config = {}) {
  return {
    session: create_session_data(config),
    conversations: create_conversation_data(config),
    decisions: create_decision_data(config),
    diagrams: create_diagram_data(config),
    phases: create_simulation_phases(),
  };
}

function requires_simulation(collected_data) {
  if (!collected_data) return true;
  if (collected_data._isSimulation) return true;

  const has_user_prompts = collected_data.user_prompts && collected_data.user_prompts.length > 0;
  const has_observations = collected_data.observations && collected_data.observations.length > 0;
  const has_recent_context = collected_data.recent_context && collected_data.recent_context.length > 0;

  return !has_user_prompts && !has_observations && !has_recent_context;
}

/* ─────────────────────────────────────────────────────────────
   8. SIMULATION WARNING UTILITIES
──────────────────────────────────────────────────────────────── */

function add_simulation_warning(content) {
  const warning = `<!-- WARNING: This is simulated/placeholder content - NOT from a real session -->\n\n`;
  return warning + content;
}

function mark_as_simulated(metadata) {
  return {
    ...metadata,
    isSimulated: true,
    _simulationWarning: 'This memory was generated using placeholder data, not from a real conversation',
  };
}

/* ─────────────────────────────────────────────────────────────
   9. EXPORTS
──────────────────────────────────────────────────────────────── */

module.exports = {
  // Snake_case exports (original)
  create_session_data,
  create_conversation_data,
  create_decision_data,
  create_diagram_data,
  create_simulation_phases,
  create_simulation_flowchart,
  create_full_simulation,
  requires_simulation,
  format_timestamp,
  generate_session_id,
  add_simulation_warning,
  mark_as_simulated,
  // CamelCase aliases (for generate-context.js compatibility)
  createSessionData: create_session_data,
  createConversationData: create_conversation_data,
  createDecisionData: create_decision_data,
  createDiagramData: create_diagram_data,
  createSimulationPhases: create_simulation_phases,
  createSimulationFlowchart: create_simulation_flowchart,
  createFullSimulation: create_full_simulation,
  requiresSimulation: requires_simulation,
  formatTimestamp: format_timestamp,
  generateSessionId: generate_session_id,
  addSimulationWarning: add_simulation_warning,
  markAsSimulated: mark_as_simulated,
};
