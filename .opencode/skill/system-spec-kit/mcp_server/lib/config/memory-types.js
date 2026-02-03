// ───────────────────────────────────────────────────────────────
// CONFIG: MEMORY TYPES
// ───────────────────────────────────────────────────────────────
'use strict';

/* ─────────────────────────────────────────────────────────────
   1. MEMORY TYPES CONFIGURATION
────────────────────────────────────────────────────────────────*/

const MEMORY_TYPES = {
  working: {
    halfLifeDays: 1,
    description: 'Active session context and immediate task state',
    autoExpireDays: 7,
    decayEnabled: true,
  },
  episodic: {
    halfLifeDays: 7,
    description: 'Event-based memories: sessions, debugging, discoveries',
    autoExpireDays: 30,
    decayEnabled: true,
  },
  prospective: {
    halfLifeDays: 14,
    description: 'Future intentions: TODOs, next steps, planned actions',
    autoExpireDays: 60,
    decayEnabled: true,
  },
  implicit: {
    halfLifeDays: 30,
    description: 'Learned patterns: code styles, workflows, habits',
    autoExpireDays: 120,
    decayEnabled: true,
  },
  declarative: {
    halfLifeDays: 60,
    description: 'Facts and knowledge: implementations, APIs, technical details',
    autoExpireDays: 180,
    decayEnabled: true,
  },
  procedural: {
    halfLifeDays: 90,
    description: 'How-to knowledge: processes, procedures, guides',
    autoExpireDays: 365,
    decayEnabled: true,
  },
  semantic: {
    halfLifeDays: 180,
    description: 'Core concepts: architecture, design principles, domain knowledge',
    autoExpireDays: null,
    decayEnabled: true,
  },
  autobiographical: {
    halfLifeDays: 365,
    description: 'Project history: milestones, major decisions, historical context',
    autoExpireDays: null,
    decayEnabled: true,
  },
  'meta-cognitive': {
    halfLifeDays: null,
    description: 'Rules about rules: constitutional, standards, invariants',
    autoExpireDays: null,
    decayEnabled: false,
  },
};

// Half-life lookup for efficient access
const HALF_LIVES_DAYS = Object.fromEntries(
  Object.entries(MEMORY_TYPES).map(([type, config]) => [type, config.halfLifeDays])
);

const EXPECTED_TYPES = [
  'episodic',
  'semantic',
  'procedural',
  'declarative',
  'autobiographical',
  'prospective',
  'implicit',
  'working',
  'meta-cognitive',
];

Object.freeze(HALF_LIVES_DAYS);
Object.freeze(MEMORY_TYPES);
Object.freeze(EXPECTED_TYPES);

/* ─────────────────────────────────────────────────────────────
   2. TYPE INFERENCE CONFIGURATION
────────────────────────────────────────────────────────────────*/

const PATH_TYPE_PATTERNS = [
  // Episodic patterns (sessions, events) - more specific, check first
  { pattern: /session[-_]?\d+/i, type: 'episodic' },  // session-1, session_2, etc.
  { pattern: /debug[-_]?log/i, type: 'episodic' },
  { pattern: /\/discovery\//i, type: 'episodic' },

  // Working memory patterns
  { pattern: /\/scratch\//, type: 'working' },
  { pattern: /\/temp\//, type: 'working' },
  { pattern: /\/session-state/i, type: 'working' },   // Active session state, not session logs

  // Prospective patterns (future actions)
  { pattern: /todo/i, type: 'prospective' },
  { pattern: /next[-_]?steps/i, type: 'prospective' },
  { pattern: /backlog/i, type: 'prospective' },
  { pattern: /roadmap/i, type: 'prospective' },

  // Implicit patterns (learned behaviors)
  { pattern: /pattern/i, type: 'implicit' },
  { pattern: /workflow/i, type: 'implicit' },
  { pattern: /habit/i, type: 'implicit' },

  // Declarative patterns (facts)
  { pattern: /implementation[-_]?(summary|guide)?/i, type: 'declarative' },
  { pattern: /api[-_]?ref/i, type: 'declarative' },
  { pattern: /spec\.md$/i, type: 'declarative' },

  // Procedural patterns (how-to)
  { pattern: /guide/i, type: 'procedural' },
  { pattern: /process/i, type: 'procedural' },
  { pattern: /runbook/i, type: 'procedural' },
  { pattern: /checklist/i, type: 'procedural' },

  // Semantic patterns (concepts)
  { pattern: /architecture/i, type: 'semantic' },
  { pattern: /design[-_]?doc/i, type: 'semantic' },
  { pattern: /decision[-_]?record/i, type: 'semantic' },
  { pattern: /adr[-_]?\d+/i, type: 'semantic' },

  // Autobiographical patterns (history)
  { pattern: /changelog/i, type: 'autobiographical' },
  { pattern: /milestone/i, type: 'autobiographical' },
  { pattern: /retrospective/i, type: 'autobiographical' },
  { pattern: /postmortem/i, type: 'autobiographical' },

  // Meta-cognitive patterns (rules)
  { pattern: /constitutional/i, type: 'meta-cognitive' },
  { pattern: /agents\.md$/i, type: 'meta-cognitive' },
  { pattern: /claude\.md$/i, type: 'meta-cognitive' },
  { pattern: /rules/i, type: 'meta-cognitive' },
  { pattern: /invariant/i, type: 'meta-cognitive' },
];

const KEYWORD_TYPE_MAP = {
  // Working
  'session context': 'working',
  'active state': 'working',
  'current task': 'working',

  // Episodic
  'session summary': 'episodic',
  'debug session': 'episodic',
  'discovery': 'episodic',
  'event': 'episodic',
  'occurred': 'episodic',

  // Prospective
  'todo': 'prospective',
  'next steps': 'prospective',
  'future': 'prospective',
  'planned': 'prospective',
  'upcoming': 'prospective',

  // Implicit
  'pattern': 'implicit',
  'workflow': 'implicit',
  'best practice': 'implicit',
  'convention': 'implicit',

  // Declarative
  'implementation': 'declarative',
  'api': 'declarative',
  'specification': 'declarative',
  'fact': 'declarative',
  'detail': 'declarative',

  // Procedural
  'how to': 'procedural',
  'guide': 'procedural',
  'process': 'procedural',
  'procedure': 'procedural',
  'steps': 'procedural',
  'checklist': 'procedural',

  // Semantic
  'architecture': 'semantic',
  'design': 'semantic',
  'principle': 'semantic',
  'concept': 'semantic',
  'decision': 'semantic',

  // Autobiographical
  'milestone': 'autobiographical',
  'history': 'autobiographical',
  'retrospective': 'autobiographical',
  'changelog': 'autobiographical',
  'project history': 'autobiographical',

  // Meta-cognitive
  'constitutional': 'meta-cognitive',
  'rule': 'meta-cognitive',
  'standard': 'meta-cognitive',
  'invariant': 'meta-cognitive',
  'constraint': 'meta-cognitive',
};

Object.freeze(PATH_TYPE_PATTERNS);
Object.freeze(KEYWORD_TYPE_MAP);

/* ─────────────────────────────────────────────────────────────
   3. TYPE HELPER FUNCTIONS
────────────────────────────────────────────────────────────────*/

function get_valid_types() {
  return [...EXPECTED_TYPES];
}

function is_valid_type(type) {
  if (!type || typeof type !== 'string') {
    return false;
  }
  return EXPECTED_TYPES.includes(type.toLowerCase());
}

function get_type_config(type) {
  if (!type || typeof type !== 'string') {
    return null;
  }
  return MEMORY_TYPES[type.toLowerCase()] || null;
}

function get_half_life(type) {
  if (!type || typeof type !== 'string') {
    return 60;
  }
  const halfLife = HALF_LIVES_DAYS[type.toLowerCase()];
  return halfLife !== undefined ? halfLife : 60;
}

function is_decay_enabled(type) {
  const config = get_type_config(type);
  return config ? config.decayEnabled : true;
}

function get_default_type() {
  return 'declarative';
}

/* ─────────────────────────────────────────────────────────────
   4. RESET-TO-DEFAULTS
────────────────────────────────────────────────────────────────*/

function get_default_half_lives() {
  return {
    working: 1,
    episodic: 7,
    prospective: 14,
    implicit: 30,
    declarative: 60,
    procedural: 90,
    semantic: 180,
    autobiographical: 365,
    'meta-cognitive': null,
  };
}

function validate_half_life_config(config) {
  const errors = [];

  if (!config || typeof config !== 'object') {
    return { valid: false, errors: ['Configuration must be an object'] };
  }

  for (const type of EXPECTED_TYPES) {
    if (!(type in config)) {
      errors.push(`Missing type: ${type}`);
      continue;
    }

    const value = config[type];
    if (value !== null && (typeof value !== 'number' || value < 0)) {
      errors.push(`Invalid half-life for ${type}: must be positive number or null`);
    }
  }

  return { valid: errors.length === 0, errors };
}

/* ─────────────────────────────────────────────────────────────
   5. MODULE EXPORTS
────────────────────────────────────────────────────────────────*/

module.exports = {
  // Constants
  MEMORY_TYPES,
  HALF_LIVES_DAYS,
  EXPECTED_TYPES,
  PATH_TYPE_PATTERNS,
  KEYWORD_TYPE_MAP,

  // Helper functions
  get_valid_types,
  is_valid_type,
  get_type_config,
  get_half_life,
  is_decay_enabled,
  get_default_type,

  // Reset-to-defaults (CHK-018)
  get_default_half_lives,
  validate_half_life_config,

  // Aliases (camelCase for backward compatibility)
  getValidTypes: get_valid_types,
  isValidType: is_valid_type,
  getTypeConfig: get_type_config,
  getHalfLife: get_half_life,
  isDecayEnabled: is_decay_enabled,
  getDefaultType: get_default_type,
  getDefaultHalfLives: get_default_half_lives,
  validateHalfLifeConfig: validate_half_life_config,
};
