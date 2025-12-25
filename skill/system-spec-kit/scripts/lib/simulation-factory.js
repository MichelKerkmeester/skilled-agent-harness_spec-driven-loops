/**
 * Simulation Data Factory
 * Generates fallback data when real conversation data is unavailable
 * 
 * Consolidates 4 duplicate simulation blocks from generate-context.js:
 * - collectSessionData() fallback
 * - extractConversations() fallback
 * - extractDecisions() fallback
 * - extractDiagrams() fallback
 * 
 * @module simulation-factory
 * @version 1.0.0
 */

/**
 * Format timestamp with multiple output formats
 * @param {Date|string} date - Date to format (defaults to current time)
 * @param {string} format - Output format: 'iso' | 'readable' | 'date' | 'time' | 'filename' | 'date-dutch' | 'time-short'
 * @returns {string} Formatted timestamp
 */
function formatTimestamp(date = new Date(), format = 'iso') {
  const d = date instanceof Date ? date : new Date(date);

  // Validate date
  if (isNaN(d.getTime())) {
    return formatTimestamp(new Date(), format);
  }

  const isoString = d.toISOString();
  const [datePart, timePart] = isoString.split('T');
  const timeWithoutMs = timePart.split('.')[0];

  switch (format) {
    case 'iso':
      return isoString.split('.')[0] + 'Z';
    case 'readable':
      return `${datePart} @ ${timeWithoutMs}`;
    case 'date':
      return datePart;
    case 'date-dutch': {
      const [year, month, day] = datePart.split('-');
      const shortYear = year.slice(-2);
      return `${day}-${month}-${shortYear}`;
    }
    case 'time':
      return timeWithoutMs;
    case 'time-short': {
      const [hours, minutes] = timeWithoutMs.split(':');
      return `${hours}-${minutes}`;
    }
    case 'filename':
      return `${datePart}_${timeWithoutMs.replace(/:/g, '-')}`;
    default:
      return isoString;
  }
}

/**
 * Generate a unique session ID for tracking
 * Format: session-{timestamp}-{random}
 * @returns {string} Unique session identifier
 */
function generateSessionId() {
  return `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Generate simulation session data
 * Fallback when no real conversation data is available
 * 
 * @param {Object} config - Configuration options
 * @param {string} config.sessionId - Custom session ID (auto-generated if not provided)
 * @param {string} config.specFolder - Spec folder name (defaults to 'simulation')
 * @param {string} config.channel - Git channel/branch (defaults to 'default')
 * @param {string} config.skillVersion - Skill version string
 * @returns {Object} Session data with placeholder values
 */
function createSessionData(config = {}) {
  const now = new Date();
  const sessionId = config.sessionId || generateSessionId();
  const specFolder = config.specFolder || 'simulation';
  const channel = config.channel || 'default';
  const skillVersion = config.skillVersion || '11.2.0';
  const simulatedEpoch = Math.floor(Date.now() / 1000);
  
  const dateOnly = formatTimestamp(now, 'date-dutch');
  const timeOnly = formatTimestamp(now, 'time-short');
  const folderTitle = specFolder.replace(/^\d{3}-/, '').replace(/-/g, ' ');

  return {
    TITLE: folderTitle,
    DATE: dateOnly,
    TIME: timeOnly,
    SPEC_FOLDER: specFolder,
    DURATION: 'N/A (simulated)',
    SUMMARY: '⚠️ SIMULATION MODE - No real conversation data available. This is placeholder data for testing.',
    FILES: [
      { FILE_PATH: '⚠️ SIMULATION MODE', DESCRIPTION: 'No files were tracked - using fallback data' }
    ],
    HAS_FILES: true,
    FILE_COUNT: 1,
    OUTCOMES: [
      { OUTCOME: '⚠️ SIMULATION MODE - Real conversation data not available' }
    ],
    TOOL_COUNT: 0,
    MESSAGE_COUNT: 0,
    QUICK_SUMMARY: '⚠️ SIMULATION MODE - Provide conversation data via JSON file for real output',
    SKILL_VERSION: skillVersion,
    // V11.0: Simulated session metadata
    SESSION_ID: sessionId,
    CHANNEL: channel,
    IMPORTANCE_TIER: 'normal',
    CONTEXT_TYPE: 'general',
    CREATED_AT_EPOCH: simulatedEpoch,
    LAST_ACCESSED_EPOCH: simulatedEpoch,
    EXPIRES_AT_EPOCH: simulatedEpoch + (90 * 24 * 60 * 60), // 90 days for normal tier
    TOOL_COUNTS: {},
    DECISION_COUNT: 0,
    // V11.1: Access analytics
    ACCESS_COUNT: 1,
    LAST_SEARCH_QUERY: '',
    RELEVANCE_BOOST: 1.0,
    // V11.2: Spec files (empty for simulation)
    SPEC_FILES: [],
    HAS_SPEC_FILES: false,
    // V12.0: Implementation guide (disabled for simulation)
    HAS_IMPLEMENTATION_GUIDE: false,
    TOPIC: '',
    IMPLEMENTATIONS: [],
    IMPL_KEY_FILES: [],
    EXTENSION_GUIDES: [],
    PATTERNS: [],
    // V7.3: Observations (empty for simulation)
    OBSERVATIONS: [],
    HAS_OBSERVATIONS: false
  };
}

/**
 * Generate simulation conversation messages
 * Fallback when no real conversation data is available
 * 
 * @param {Object} config - Configuration options
 * @param {string} config.userMessage - Custom user message
 * @param {string} config.assistantMessage - Custom assistant message
 * @returns {Object} Conversation data with example messages
 */
function createConversationData(config = {}) {
  const userMessage = config.userMessage || 'This is a simulated user message.';
  const assistantMessage = config.assistantMessage || 'This is a simulated assistant response.';
  const now = new Date();

  return {
    MESSAGES: [
      {
        TIMESTAMP: formatTimestamp(now, 'readable'),
        ROLE: 'User',
        CONTENT: userMessage,
        TOOL_CALLS: []
      },
      {
        TIMESTAMP: formatTimestamp(now, 'readable'),
        ROLE: 'Assistant',
        CONTENT: assistantMessage,
        TOOL_CALLS: [
          {
            TOOL_NAME: 'Read',
            DESCRIPTION: 'Read example.js',
            HAS_RESULT: true,
            RESULT_PREVIEW: 'const example = "simulated";',
            HAS_MORE: false
          }
        ]
      }
    ],
    MESSAGE_COUNT: 2,
    DURATION: 'N/A (simulated)',
    FLOW_PATTERN: 'Sequential with Decision Points',
    PHASE_COUNT: 4,
    PHASES: [
      { PHASE_NAME: 'Research', DURATION: '10 min' },
      { PHASE_NAME: 'Clarification', DURATION: '2 min' },
      { PHASE_NAME: 'Implementation', DURATION: '30 min' },
      { PHASE_NAME: 'Verification', DURATION: '5 min' }
    ],
    AUTO_GENERATED_FLOW: createSimulationFlowchart(),
    TOOL_COUNT: 1,
    DATE: now.toISOString().split('T')[0]
  };
}

/**
 * Generate simulation decisions
 * Fallback when no real decision data is available
 * 
 * @param {Object} config - Configuration options
 * @param {string} config.title - Custom decision title
 * @param {string} config.context - Custom decision context
 * @returns {Object} Decision data with example structure
 */
function createDecisionData(config = {}) {
  const title = config.title || 'Simulated Decision Example';
  const context = config.context || 'This is a simulated decision for testing purposes.';
  const now = new Date();

  const decisions = [
    {
      INDEX: 1,
      TITLE: title,
      CONTEXT: context,
      TIMESTAMP: formatTimestamp(now),
      OPTIONS: [
        {
          OPTION_NUMBER: 1,
          LABEL: 'Option A',
          DESCRIPTION: 'First option description',
          HAS_PROS_CONS: true,
          PROS: [{ PRO: 'Simple to implement' }],
          CONS: [{ CON: 'Limited flexibility' }]
        },
        {
          OPTION_NUMBER: 2,
          LABEL: 'Option B',
          DESCRIPTION: 'Second option description',
          HAS_PROS_CONS: true,
          PROS: [{ PRO: 'More flexible' }],
          CONS: [{ CON: 'More complex' }]
        }
      ],
      CHOSEN: 'Option B',
      RATIONALE: 'Flexibility was prioritized over simplicity for this use case.',
      HAS_PROS: true,
      PROS: [
        { PRO: 'Flexible architecture' },
        { PRO: 'Extensible design' }
      ],
      HAS_CONS: true,
      CONS: [
        { CON: 'Higher initial complexity' }
      ],
      CONFIDENCE: 85,
      HAS_EVIDENCE: true,
      EVIDENCE: [
        { EVIDENCE_ITEM: 'example.js:123' }
      ],
      HAS_CAVEATS: true,
      CAVEATS: [
        { CAVEAT_ITEM: 'Requires additional setup time' }
      ],
      HAS_FOLLOWUP: true,
      FOLLOWUP: [
        { FOLLOWUP_ITEM: 'Review performance after implementation' }
      ],
      DECISION_TREE: '',
      HAS_DECISION_TREE: false,
      DECISION_ANCHOR_ID: 'decision-simulated-example-000',
      DECISION_IMPORTANCE: 'medium'
    }
  ];

  return {
    DECISIONS: decisions,
    DECISION_COUNT: 1,
    HIGH_CONFIDENCE_COUNT: 1,
    MEDIUM_CONFIDENCE_COUNT: 0,
    LOW_CONFIDENCE_COUNT: 0,
    FOLLOWUP_COUNT: 1
  };
}

/**
 * Generate simulation diagrams
 * Fallback when no real diagram data is available
 * 
 * @param {Object} config - Configuration options
 * @param {string} config.title - Custom diagram title
 * @param {string} config.description - Custom diagram description
 * @returns {Object} Diagram data
 */
function createDiagramData(config = {}) {
  const title = config.title || 'Example Workflow';
  const description = config.description || 'Simulated workflow diagram';
  const now = new Date();

  const asciiWorkflow = `┌─────────┐
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
        TIMESTAMP: formatTimestamp(now),
        DIAGRAM_TYPE: 'Workflow',
        PATTERN_NAME: 'Sequential Flow',
        COMPLEXITY: 'Low',
        HAS_DESCRIPTION: true,
        DESCRIPTION: description,
        ASCII_ART: asciiWorkflow,
        HAS_NOTES: false,
        NOTES: [],
        HAS_RELATED_FILES: false,
        RELATED_FILES: []
      }
    ],
    DIAGRAM_COUNT: 1,
    HAS_AUTO_GENERATED: true,
    FLOW_TYPE: 'Conversation Flow',
    AUTO_CONVERSATION_FLOWCHART: createSimulationFlowchart(),
    AUTO_DECISION_TREES: [],
    AUTO_FLOW_COUNT: 1,
    AUTO_DECISION_COUNT: 0,
    DIAGRAM_TYPES: [
      { TYPE: 'Workflow', COUNT: 1 }
    ],
    PATTERN_SUMMARY: [
      { PATTERN_NAME: 'Sequential Flow', COUNT: 1 }
    ]
  };
}

/**
 * Generate simulation workflow flowchart
 * Simple fallback flowchart for simulation mode
 * 
 * @param {string} initialRequest - Initial request text
 * @returns {string} ASCII flowchart
 */
function createSimulationFlowchart(initialRequest = 'User Request') {
  const pad = (text, length) => {
    const truncated = text.substring(0, length);
    return truncated.padEnd(length);
  };

  return `╭────────────────────╮
│  ${pad(initialRequest, 16)}  │
╰────────────────────╯
         │
         ▼
   ╭────────╮
   │  Done  │
   ╰────────╯`;
}

/**
 * Generate simulation phases
 * Default phases when no real phase data is available
 * 
 * @returns {Array} Array of phase objects
 */
function createSimulationPhases() {
  return [
    {
      PHASE_NAME: 'Research',
      DURATION: '5 min',
      ACTIVITIES: ['Exploring codebase', 'Reading documentation', 'Understanding requirements']
    },
    {
      PHASE_NAME: 'Planning',
      DURATION: '3 min',
      ACTIVITIES: ['Designing solution', 'Creating task breakdown']
    },
    {
      PHASE_NAME: 'Implementation',
      DURATION: '15 min',
      ACTIVITIES: ['Writing code', 'Applying changes', 'Refactoring']
    },
    {
      PHASE_NAME: 'Verification',
      DURATION: '2 min',
      ACTIVITIES: ['Running tests', 'Validating results']
    }
  ];
}

/**
 * Generate all simulation data at once
 * Convenience function for getting complete simulation dataset
 * 
 * @param {Object} config - Configuration options
 * @param {string} config.sessionId - Custom session ID
 * @param {string} config.specFolder - Spec folder name
 * @param {string} config.channel - Git channel/branch
 * @param {string} config.skillVersion - Skill version string
 * @returns {Object} Complete simulation dataset
 */
function createFullSimulation(config = {}) {
  return {
    session: createSessionData(config),
    conversations: createConversationData(config),
    decisions: createDecisionData(config),
    diagrams: createDiagramData(config),
    phases: createSimulationPhases()
  };
}

/**
 * Check if data requires simulation mode
 * Determines if collected data is missing/empty
 * 
 * @param {Object|null} collectedData - Data from MCP or JSON file
 * @returns {boolean} True if simulation mode should be used
 */
function requiresSimulation(collectedData) {
  if (!collectedData) return true;
  
  // Check for minimal data presence
  const hasUserPrompts = collectedData.user_prompts && collectedData.user_prompts.length > 0;
  const hasObservations = collectedData.observations && collectedData.observations.length > 0;
  const hasRecentContext = collectedData.recent_context && collectedData.recent_context.length > 0;
  
  return !hasUserPrompts && !hasObservations && !hasRecentContext;
}

module.exports = {
  // Core factory functions
  createSessionData,
  createConversationData,
  createDecisionData,
  createDiagramData,
  createSimulationPhases,
  createSimulationFlowchart,
  createFullSimulation,
  
  // Utility functions
  requiresSimulation,
  formatTimestamp,
  generateSessionId
};
