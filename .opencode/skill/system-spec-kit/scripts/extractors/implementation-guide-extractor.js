// ───────────────────────────────────────────────────────────────
// EXTRACTORS: IMPLEMENTATION GUIDE EXTRACTOR
// ───────────────────────────────────────────────────────────────

'use strict';

/* ─────────────────────────────────────────────────────────────
   1. IMPORTS
────────────────────────────────────────────────────────────────*/

const { detectObservationType } = require('./file-extractor');

/* ─────────────────────────────────────────────────────────────
   2. IMPLEMENTATION DETECTION
────────────────────────────────────────────────────────────────*/

function has_implementation_work(observations, files) {
  const impl_types = ['implementation', 'feature', 'bugfix', 'refactor'];
  const has_impl_type = observations.some(o => impl_types.includes(o.type));

  const impl_keywords = /\b(implemented|built|created|added|fixed|refactored|developed|constructed|established)\b/i;
  const has_impl_keywords = observations.some(o =>
    o.narrative && impl_keywords.test(o.narrative)
  );

  const has_file_changes = files && files.length > 0;

  // Require at least 2 of: impl type, impl keywords, file changes
  const score = (has_impl_type ? 1 : 0) + (has_impl_keywords ? 1 : 0) + (has_file_changes ? 1 : 0);
  return score >= 2;
}

function extract_main_topic(observations, spec_folder) {
  if (spec_folder) {
    const folder_topic = spec_folder.replace(/^\d+-/, '').replace(/-/g, '-');
    if (folder_topic.length > 3) return folder_topic;
  }

  const impl_obs = observations.find(o =>
    o.type === 'implementation' || o.type === 'feature'
  );

  if (impl_obs && impl_obs.title) {
    return impl_obs.title
      .toLowerCase()
      .replace(/^(implemented|created|added|built|fixed)\s+/i, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .substring(0, 40);
  }

  return 'implementation';
}

/* ─────────────────────────────────────────────────────────────
   3. FEATURE EXTRACTION
────────────────────────────────────────────────────────────────*/

function extract_what_built(observations) {
  const implementations = [];
  const seen = new Set();

  for (const obs of observations) {
    const type = detectObservationType(obs);
    if (!['feature', 'implementation', 'bugfix', 'refactor'].includes(type)) continue;

    let feature_name = obs.title || 'Implementation';

    feature_name = feature_name
      .replace(/^(implemented|created|added|built|fixed|refactored)\s+/i, '')
      .trim();

    const key = feature_name.toLowerCase().substring(0, 30);
    if (seen.has(key)) continue;
    seen.add(key);

    let description = obs.narrative || '';
    const first_sentence = description.match(/^[^.!?]+[.!?]/);
    description = first_sentence
      ? first_sentence[0].trim()
      : description.substring(0, 100).trim();

    description = description
      .replace(/\*\*([^*]+)\*\*/g, '$1')
      .replace(/`([^`]+)`/g, '$1')
      .replace(/^[-*]\s+/, '');

    if (feature_name.length > 3) {
      implementations.push({
        FEATURE_NAME: feature_name.charAt(0).toUpperCase() + feature_name.slice(1),
        DESCRIPTION: description || 'Implemented during session'
      });
    }
  }

  return implementations.slice(0, 5);
}

/* ─────────────────────────────────────────────────────────────
   4. FILE ROLE DETECTION
────────────────────────────────────────────────────────────────*/

function extract_key_files_with_roles(files, observations) {
  const key_files = [];

  const file_context_map = new Map();
  for (const obs of observations) {
    if (obs.files && Array.isArray(obs.files)) {
      for (const file of obs.files) {
        const narrative = obs.narrative || '';
        if (!file_context_map.has(file) && narrative.length > 10) {
          file_context_map.set(file, narrative);
        }
      }
    }
  }

  const role_patterns = [
    { pattern: /\.test\.|\.spec\.|__tests__/, role: 'Test file' },
    { pattern: /config\.|\.config\./, role: 'Configuration' },
    { pattern: /index\.(js|ts|jsx|tsx)$/, role: 'Entry point / exports' },
    { pattern: /types?\.(ts|d\.ts)$/, role: 'Type definitions' },
    { pattern: /utils?\./, role: 'Utility functions' },
    { pattern: /hooks?\./, role: 'React hook' },
    { pattern: /context\./, role: 'React context provider' },
    { pattern: /store\./, role: 'State management' },
    { pattern: /service\./, role: 'Service layer' },
    { pattern: /api\./, role: 'API layer' },
    { pattern: /model\./, role: 'Data model' },
    { pattern: /schema\./, role: 'Schema definition' },
    { pattern: /migration/, role: 'Database migration' },
    { pattern: /template/, role: 'Template file' },
    { pattern: /\.css$/, role: 'Styles' },
    { pattern: /\.md$/, role: 'Documentation' },
    { pattern: /\.sh$/, role: 'Script' }
  ];

  for (const file of files) {
    const file_path = file.FILE_PATH || file.path || file;
    const existing_desc = file.DESCRIPTION || '';

    let role = '';

    for (const { pattern, role: pattern_role } of role_patterns) {
      if (pattern.test(file_path)) {
        role = pattern_role;
        break;
      }
    }

    if (!role && existing_desc && existing_desc.length > 10 &&
        !existing_desc.toLowerCase().includes('modified during session')) {
      role = existing_desc;
    }

    if (!role && file_context_map.has(file_path)) {
      const context = file_context_map.get(file_path);
      const phrase = context.match(/\b(?:for|handles?|provides?|implements?|contains?)\s+([^.]+)/i);
      if (phrase) {
        role = phrase[1].trim().substring(0, 60);
      }
    }

    // Fallback: derive from filename (normalize path separators for cross-platform)
    if (!role) {
      const filename = file_path.replace(/\\/g, '/').split('/').pop().replace(/\.[^.]+$/, '');
      role = filename
        .replace(/[-_]/g, ' ')
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        .toLowerCase();
      role = 'Core ' + role;
    }

    key_files.push({
      FILE_PATH: file_path,
      ROLE: role.charAt(0).toUpperCase() + role.slice(1)
    });
  }

  return key_files.slice(0, 8);
}

/* ─────────────────────────────────────────────────────────────
   5. EXTENSION GUIDE GENERATION
────────────────────────────────────────────────────────────────*/

function generate_extension_guide(observations, files) {
  const guides = [];
  const seen_patterns = new Set();

  const file_types = new Map();
  for (const file of files) {
    const file_path = file.FILE_PATH || file.path || file;
    const ext = file_path.split('.').pop();
    file_types.set(ext, (file_types.get(ext) || 0) + 1);
  }

  if (file_types.get('js') > 0 || file_types.get('ts') > 0) {
    guides.push({ GUIDE_TEXT: 'Add new modules following the existing file structure patterns' });
    seen_patterns.add('modules');
  }

  if (file_types.get('test.js') > 0 || file_types.get('spec.js') > 0 ||
      files.some(f => (f.FILE_PATH || f).includes('test'))) {
    guides.push({ GUIDE_TEXT: 'Create corresponding test files for new implementations' });
    seen_patterns.add('tests');
  }

  for (const obs of observations) {
    const narrative = (obs.narrative || '').toLowerCase();

    if (narrative.includes('api') && !seen_patterns.has('api')) {
      guides.push({ GUIDE_TEXT: 'Follow the established API pattern for new endpoints' });
      seen_patterns.add('api');
    }

    if (narrative.includes('validation') && !seen_patterns.has('validation')) {
      guides.push({ GUIDE_TEXT: 'Apply validation patterns to new input handling' });
      seen_patterns.add('validation');
    }

    if (narrative.includes('error') && !seen_patterns.has('error')) {
      guides.push({ GUIDE_TEXT: 'Maintain consistent error handling approach' });
      seen_patterns.add('error');
    }

    if ((narrative.includes('template') || narrative.includes('mustache')) && !seen_patterns.has('template')) {
      guides.push({ GUIDE_TEXT: 'Use established template patterns for new outputs' });
      seen_patterns.add('template');
    }
  }

  if (guides.length === 0) {
    guides.push({ GUIDE_TEXT: 'Reference existing implementations as patterns for new features' });
  }

  return guides.slice(0, 4);
}

/* ─────────────────────────────────────────────────────────────
   6. PATTERN EXTRACTION
────────────────────────────────────────────────────────────────*/

function extract_code_patterns(observations, files) {
  const patterns = [];
  const seen = new Set();

  const pattern_matchers = [
    {
      keywords: ['helper', 'util', 'utility'],
      name: 'Helper Functions',
      usage: 'Encapsulate reusable logic in dedicated utility functions'
    },
    {
      keywords: ['validation', 'validate', 'validator'],
      name: 'Validation',
      usage: 'Input validation before processing'
    },
    {
      keywords: ['template', 'mustache', 'handlebars', 'placeholder'],
      name: 'Template Pattern',
      usage: 'Use templates with placeholder substitution'
    },
    {
      keywords: ['filter', 'filtering', 'pipeline'],
      name: 'Filter Pipeline',
      usage: 'Chain filters for data transformation'
    },
    {
      keywords: ['fallback', 'default', 'graceful'],
      name: 'Graceful Fallback',
      usage: 'Provide sensible defaults when primary method fails'
    },
    {
      keywords: ['normalize', 'normalization', 'clean'],
      name: 'Data Normalization',
      usage: 'Clean and standardize data before use'
    },
    {
      keywords: ['cache', 'caching', 'memoize'],
      name: 'Caching',
      usage: 'Cache expensive computations or fetches'
    },
    {
      keywords: ['async', 'await', 'promise'],
      name: 'Async/Await',
      usage: 'Handle asynchronous operations cleanly'
    },
    {
      keywords: ['map', 'reduce', 'filter', 'transform'],
      name: 'Functional Transforms',
      usage: 'Use functional methods for data transformation'
    },
    {
      keywords: ['export', 'module', 'import'],
      name: 'Module Pattern',
      usage: 'Organize code into importable modules'
    }
  ];

  const all_text = observations
    .map(o => `${o.title || ''} ${o.narrative || ''}`)
    .join(' ')
    .toLowerCase();

  const file_names = files
    .map(f => (f.FILE_PATH || f.path || f).toLowerCase())
    .join(' ');

  const combined_text = all_text + ' ' + file_names;

  for (const matcher of pattern_matchers) {
    if (seen.has(matcher.name)) continue;

    const has_keyword = matcher.keywords.some(kw => combined_text.includes(kw));
    if (has_keyword) {
      patterns.push({
        PATTERN_NAME: matcher.name,
        USAGE: matcher.usage
      });
      seen.add(matcher.name);
    }
  }

  return patterns.slice(0, 5);
}

/* ─────────────────────────────────────────────────────────────
   7. IMPLEMENTATION GUIDE BUILDER
────────────────────────────────────────────────────────────────*/

function build_implementation_guide_data(observations, files, spec_folder) {
  const has_impl = has_implementation_work(observations, files);

  if (!has_impl) {
    return {
      HAS_IMPLEMENTATION_GUIDE: false,
      TOPIC: '',
      IMPLEMENTATIONS: [],
      IMPL_KEY_FILES: [],
      EXTENSION_GUIDES: [],
      PATTERNS: []
    };
  }

  return {
    HAS_IMPLEMENTATION_GUIDE: true,
    TOPIC: extract_main_topic(observations, spec_folder),
    IMPLEMENTATIONS: extract_what_built(observations),
    IMPL_KEY_FILES: extract_key_files_with_roles(files, observations),
    EXTENSION_GUIDES: generate_extension_guide(observations, files),
    PATTERNS: extract_code_patterns(observations, files)
  };
}

/* ─────────────────────────────────────────────────────────────
   8. EXPORTS
────────────────────────────────────────────────────────────────*/

module.exports = {
  // Primary exports (snake_case)
  has_implementation_work,
  extract_main_topic,
  extract_what_built,
  extract_key_files_with_roles,
  generate_extension_guide,
  extract_code_patterns,
  build_implementation_guide_data,
  // Backward-compatible aliases (camelCase)
  hasImplementationWork: has_implementation_work,
  extractMainTopic: extract_main_topic,
  extractWhatBuilt: extract_what_built,
  extractKeyFilesWithRoles: extract_key_files_with_roles,
  generateExtensionGuide: generate_extension_guide,
  extractCodePatterns: extract_code_patterns,
  buildImplementationGuideData: build_implementation_guide_data
};
