// ───────────────────────────────────────────────────────────────
// LIB: SEMANTIC SUMMARIZER
// ───────────────────────────────────────────────────────────────

'use strict';

const os = require('os');
const { extractTriggerPhrases } = require('./trigger-extractor');

/* ─────────────────────────────────────────────────────────────
   1. CONSTANTS
──────────────────────────────────────────────────────────────── */

const MESSAGE_TYPES = {
  INTENT: 'intent',
  PLAN: 'plan',
  IMPLEMENTATION: 'implementation',
  RESULT: 'result',
  DECISION: 'decision',
  QUESTION: 'question',
  CONTEXT: 'context',
};

// Classification patterns - order matters: specific first, generic last
const CLASSIFICATION_PATTERNS = {
  [MESSAGE_TYPES.DECISION]: [
    /(?:Selected:|Chose:|user chose|user selected|decision made|user decision)/i,
    /^(?:Option\s+)?[A-D](?:\)|:|\s*[-–])/i,
    /(?:selected option|picked option|chose option)/i,
  ],
  [MESSAGE_TYPES.IMPLEMENTATION]: [
    /(?:^Created|^Modified|^Edited|^Wrote|^Added|^Removed|^Changed|^Fixed)\s+[`"']?[\w./-]+/i,
    /(?:Edit|Write)\s*\([^)]*file_path/i,
    /(?:\.js|\.ts|\.md|\.json|\.sh|\.css|\.py)\s*(?:file|module|script)?/i,
    /(?:function|class|const|let|var|export|import)\s+\w+/i,
  ],
  [MESSAGE_TYPES.RESULT]: [
    /(?:complete[d!]?|done[!]?|finished|success)/i,
    /(?:tests? pass|all tests|verified|confirmed)/i,
    /(?:## Implementation Complete|## Summary|## Results|✅|✓)/i,
    /^(?:It works|Working|Fixed|Resolved)/i,
  ],
  [MESSAGE_TYPES.PLAN]: [
    /(?:^I'll|^Let me|^First,|^Then,|^Next,|^Finally,)/i,
    /(?:plan|approach|strategy|steps to|phases)/i,
    /(?:todo|task list|checklist)/i,
    /(?:^#+\s*Plan|Implementation Plan|will need to)/i,
  ],
  [MESSAGE_TYPES.INTENT]: [
    /^(?:I want|I need|Please|Help me|I'd like|Analyze|Implement|Create|Fix|Improve)/i,
    /^(?:Can you|Could you|Would you)\s+(?:help|implement|create|add|build|fix)/i,
  ],
  [MESSAGE_TYPES.QUESTION]: [
    /^(?:Which|What|How|Where|When|Why|Should|Is|Are|Does|Do).+\?$/i,
  ],
};

const DESC_MIN_LENGTH = 10;
const DESC_MAX_LENGTH = 100;

/* ─────────────────────────────────────────────────────────────
   2. MESSAGE CLASSIFICATION
──────────────────────────────────────────────────────────────── */

function classify_message(content) {
  if (!content || typeof content !== 'string') {
    return MESSAGE_TYPES.CONTEXT;
  }

  const normalized = content.trim();

  for (const [type, patterns] of Object.entries(CLASSIFICATION_PATTERNS)) {
    for (const pattern of patterns) {
      if (pattern.test(normalized)) {
        return type;
      }
    }
  }

  return MESSAGE_TYPES.CONTEXT;
}

function classify_messages(messages) {
  const classified = new Map();

  for (const type of Object.values(MESSAGE_TYPES)) {
    classified.set(type, []);
  }

  for (const msg of messages) {
    const content = msg.prompt || msg.content || msg.CONTENT || '';
    const type = classify_message(content);
    classified.get(type).push({
      ...msg,
      _semanticType: type,
    });
  }

  return classified;
}

/* ─────────────────────────────────────────────────────────────
   3. FILE CHANGE EXTRACTION
──────────────────────────────────────────────────────────────── */

function find_file_position(content, file_path, search_from = 0) {
  const search_content = content.substring(search_from);
  const index = search_content.indexOf(file_path);
  return index === -1 ? -1 : search_from + index;
}

function extract_file_changes(messages, observations = []) {
  const file_changes = new Map();

  const file_patterns = {
    created: /(?:created?|wrote?|new file|Write\()/i,
    modified: /(?:modified|edited|changed|updated|Edit\()/i,
    deleted: /(?:deleted|removed|rm\s)/i,
    read: /(?:read|Read\()/i,
  };

  const extract_file_paths = (text) => {
    const paths = [];

    const quoted_paths = text.match(/["'`]([^"'`]+\.[a-zA-Z]{1,10})["'`]/g);
    if (quoted_paths) {
      paths.push(...quoted_paths.map(p => p.replace(/["'`]/g, '')));
    }

    const extension_paths = text.match(/(?:^|[\s(])([./\w-]+\.(?:js|ts|jsx|tsx|json|jsonc|md|sh|css|html|py|yaml|yml))/gi);
    if (extension_paths) {
      paths.push(...extension_paths.map(p => p.trim().replace(/^[(]/, '')));
    }

    return [...new Set(paths)];
  };

  for (const msg of messages) {
    const content = msg.prompt || msg.content || msg.CONTENT || '';
    const type = classify_message(content);

    if (type === MESSAGE_TYPES.IMPLEMENTATION || type === MESSAGE_TYPES.RESULT) {
      const paths = extract_file_paths(content);
      let last_search_position = 0;

      for (const file_path of paths) {
        let action = 'modified';
        for (const [action_type, pattern] of Object.entries(file_patterns)) {
          if (pattern.test(content)) {
            action = action_type;
            break;
          }
        }

        if (action === 'read') continue;

        const file_index = find_file_position(content, file_path, last_search_position);

        if (file_index === -1) {
          const fallback_index = content.indexOf(file_path);
          if (fallback_index === -1) continue;
          const context_start = Math.max(0, fallback_index - 100);
          const context_end = Math.min(content.length, fallback_index + file_path.length + 200);
          const context = content.substring(context_start, context_end);
          const description = extract_change_description(context, file_path);

          if (!file_changes.has(file_path)) {
            file_changes.set(file_path, { action, description, changes: [], mentions: 1 });
          }
          continue;
        }

        last_search_position = file_index + file_path.length;

        const context_start = Math.max(0, file_index - 100);
        const context_end = Math.min(content.length, file_index + file_path.length + 200);
        const context = content.substring(context_start, context_end);

        let description = extract_change_description(context, file_path);

        if (!file_changes.has(file_path)) {
          file_changes.set(file_path, {
            action,
            description,
            changes: [],
            mentions: 1,
          });
        } else {
          const existing = file_changes.get(file_path);
          existing.mentions++;
          if (description.length > existing.description.length) {
            existing.description = description;
          }
          if (action === 'created' && existing.action !== 'created') {
            existing.action = action;
          }
        }
      }
    }
  }

  for (const obs of observations) {
    if (obs.files && Array.isArray(obs.files)) {
      const narrative = obs.narrative || '';

      for (const file of obs.files) {
        if (!file_changes.has(file)) {
          const description = extract_change_description(narrative, file);
          file_changes.set(file, {
            action: 'modified',
            description: description,
            changes: [],
            mentions: 1,
          });
        }
      }
    }
  }

  return file_changes;
}

/* ─────────────────────────────────────────────────────────────
   4. DESCRIPTION UTILITIES
──────────────────────────────────────────────────────────────── */

function clean_description(desc) {
  if (!desc) return '';
  let cleaned = desc.trim();

  cleaned = cleaned.replace(/^#+\s+/, '');
  cleaned = cleaned.replace(/^[-*]\s+/, '');
  cleaned = cleaned.replace(/`([^`]+)`/g, '$1');
  cleaned = cleaned.replace(/\*\*([^*]+)\*\*/g, '$1');
  cleaned = cleaned.replace(/[.,;:]+$/, '');

  if (cleaned.length > 60) {
    cleaned = cleaned.substring(0, 57) + '...';
  }

  if (cleaned.length > 0) {
    cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
  }
  return cleaned;
}

function is_description_valid(description) {
  if (!description || description.length < 8) return false;

  const garbage_patterns = [
    /^#+\s/,
    /^[-*]\s/,
    /\s(?:and|or|to|the)\s*$/i,
    /^(?:modified?|updated?)\s+\w+$/i,
    /^filtering\s+(?:pipeline|system)$/i,
    /^And\s+[`'"]?/i,
    /^modified? during session$/i,
    /^changed?$/i,
    /^no description available$/i,
    /^modified?$/i,
    /\[PLACEHOLDER\]/i,
  ];

  return !garbage_patterns.some(p => p.test(description));
}

// Caps context at 500 chars to prevent regex backtracking
function extract_change_description(context, file_path) {
  const safe_context = context.substring(0, 500);

  const filename = file_path.replace(/\\/g, '/').split('/').pop();
  const filename_no_ext = filename.replace(/\.[^.]+$/, '');
  const escaped_filename = filename_no_ext.replace(/[-.*+?^${}()|[\]\\]/g, '\\$&');

  const file_specific_patterns = [
    new RegExp(`(?:updated?|modified?|changed?|fixed?|edited?)\\s+(?:the\\s+)?['"\`]?${escaped_filename}(?:\\.\\w+)?['"\`]?\\s+(?:to\\s+)?(.{15,100}?)(?:\\s*[.!,]|$)`, 'i'),
    new RegExp(`${escaped_filename}(?:\\.\\w+)?\\s*[:\\-–—]\\s*(.{15,100}?)(?:\\s*[.!,\\n]|$)`, 'i'),
    new RegExp(`(?:in|for|to)\\s+['"\`]?${escaped_filename}(?:\\.\\w+)?['"\`]?[,:]?\\s+(?:we\\s+)?(.{15,100}?)(?:\\s*[.!,]|$)`, 'i'),
    new RegExp(`(?:added?|implemented?|created?)\\s+(.{15,80}?)\\s+(?:to|in|for)\\s+['"\`]?${escaped_filename}`, 'i'),
    new RegExp(`(?:the\\s+)?${escaped_filename}(?:\\.\\w+)?\\s+(?:now\\s+)?(?:handles?|provides?|implements?|contains?)\\s+(.{15,80}?)(?:\\s*[.!,]|$)`, 'i'),
    new RegExp(`['"\`]?${escaped_filename}['"\`]?\\s+(?:now\\s+)?(?:supports?|includes?)\\s+(.{10,80})`, 'i'),
    new RegExp(`modified\\s+['"\`]?${escaped_filename}['"\`]?,\\s+(?:adding|removing|implementing)\\s+(.{10,80})`, 'i'),
  ];

  for (const pattern of file_specific_patterns) {
    const match = safe_context.match(pattern);
    if (match && match[1]) {
      let desc = match[1].trim();
      if (desc.includes(file_path) || desc.toLowerCase().includes(filename_no_ext.toLowerCase())) continue;
      desc = clean_description(desc);
      if (desc.length >= DESC_MIN_LENGTH && desc.length <= DESC_MAX_LENGTH && is_description_valid(desc)) {
        return desc;
      }
    }
  }

  const with_patterns = [
    /with\s+(.{10,80}?)(?:\s*[.!,]|$)/i,
    /to\s+(?:add|apply|integrate|include|remove|fix|enhance|validate)\s+(.{10,80}?)(?:\s*[.!,]|$)/i,
    /for\s+(.{10,80}?)(?:\s*[.!,]|$)/i,
    /replaced\s+(.{5,40})\s+with\s+(.{5,40})/i,
  ];

  for (const pattern of with_patterns) {
    const match = safe_context.match(pattern);
    if (match && match[1]) {
      let desc = match[1].trim();
      if (match[2]) {
        desc = `Replaced ${match[1].trim()} with ${match[2].trim()}`;
      }
      if (desc.includes(file_path) || desc.includes(filename)) continue;
      desc = clean_description(desc);
      if (desc.length >= DESC_MIN_LENGTH && desc.length <= DESC_MAX_LENGTH && !/^(the|a|an)\s/i.test(desc)) {
        return desc;
      }
    }
  }

  const action_patterns = [
    /(\d+-stage\s+\w+\s+pipeline)/i,
    /((?:filtering|content|semantic|noise|validation|processing|analysis|transformation)\s+(?:module|pipeline|system|logic))/i,
    /(configurable\s+.{5,30}\s+(?:settings|config|options|behavior))/i,
    /:\s*(.{10,60}?)(?:\s*[.!,\n]|$)/,
  ];

  for (const pattern of action_patterns) {
    const match = safe_context.match(pattern);
    if (match && match[1]) {
      let desc = match[1].trim();
      if (desc.includes(file_path) || desc.includes(filename)) continue;
      desc = clean_description(desc);
      if (desc.length >= DESC_MIN_LENGTH && desc.length <= DESC_MAX_LENGTH) {
        return desc;
      }
    }
  }

  const human_readable = filename_no_ext
    .replace(/[-_]/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .toLowerCase();

  return `Updated ${human_readable}`;
}

/* ─────────────────────────────────────────────────────────────
   5. DECISION EXTRACTION
──────────────────────────────────────────────────────────────── */

function extract_decisions(messages) {
  const decisions = [];

  for (let i = 0; i < messages.length; i++) {
    const msg = messages[i];
    const content = msg.prompt || msg.content || msg.CONTENT || '';
    const type = classify_message(content);

    if (type === MESSAGE_TYPES.DECISION) {
      let question = '';
      if (i > 0) {
        const prev_content = messages[i - 1].prompt || messages[i - 1].content || '';
        const question_match = prev_content.match(/([^.!?]+\?)/);
        if (question_match) {
          question = question_match[1].trim();
        }
      }

      const choice_patterns = [
        /(?:chose|selected|picked)\s*[:"']?\s*([A-D](?:\)|:|\s)|.{5,50})/i,
        /^(?:Option\s+)?([A-D])(?:\)|:|\s)/i,
        /^([A-D])\s*[-–]\s*(.+)/i,
      ];

      for (const pattern of choice_patterns) {
        const match = content.match(pattern);
        if (match) {
          decisions.push({
            question: question || 'User decision',
            choice: match[1]?.trim() || content.substring(0, 50),
            context: content.substring(0, 100),
          });
          break;
        }
      }
    }
  }

  return decisions;
}

/* ─────────────────────────────────────────────────────────────
   6. IMPLEMENTATION SUMMARY GENERATION
──────────────────────────────────────────────────────────────── */

function generate_implementation_summary(messages, observations = []) {
  const classified = classify_messages(messages);
  const file_changes = extract_file_changes(messages, observations);
  const decisions = extract_decisions(messages);

  const intent_messages = classified.get(MESSAGE_TYPES.INTENT);
  const question_messages = classified.get(MESSAGE_TYPES.QUESTION);

  let task = 'Development session';

  if (intent_messages.length > 0) {
    const first_intent = intent_messages[0].prompt || intent_messages[0].content || '';
    const task_patterns = [
      /^(?:I want to|I need to|Please|Help me)\s+(.{15,120}?)(?:[.!?\n]|$)/i,
      /(?:implement|create|add|build|fix|improve)\s+(.{10,100}?)(?:[.!?\n]|$)/i,
      /^(.{20,120}?)(?:[.!?\n]|$)/,
    ];

    for (const pattern of task_patterns) {
      const match = first_intent.match(pattern);
      if (match && match[1]) {
        task = match[1].trim().replace(/[.,;:]+$/, '');
        task = task.charAt(0).toUpperCase() + task.slice(1);
        break;
      }
    }
  }

  if (task === 'Development session' && question_messages.length > 0) {
    const first_question = question_messages[0].prompt || question_messages[0].content || '';
    if (first_question.length > 20) {
      task = first_question.substring(0, 100).replace(/\?.*$/, '').trim();
    }
  }

  const plan_messages = classified.get(MESSAGE_TYPES.PLAN);
  const impl_messages = classified.get(MESSAGE_TYPES.IMPLEMENTATION);
  const result_messages = classified.get(MESSAGE_TYPES.RESULT);

  let solution = 'Implementation and updates';
  const all_plan_impl = [...plan_messages, ...impl_messages, ...result_messages];

  if (all_plan_impl.length > 0) {
    for (const msg of all_plan_impl) {
      const content = msg.prompt || msg.content || '';
      const solution_patterns = [
        /(?:create|implement|build)\s+(?:a\s+)?(.{15,80}?(?:pipeline|system|module|filter))/i,
        /with\s+(.{15,80}?(?:filtering|detection|processing|validation))/i,
        /(\d+-stage\s+.{10,50}?(?:pipeline|system|process))/i,
        /(?:solution|approach):\s*(.{15,100})/i,
        /(?:implement|create|add|build|fix)\s+(.{15,80}?)(?:\s+(?:to|for|that|in)|[.!]|$)/i,
        /(?:by\s+)?(?:adding|creating|implementing|fixing)\s+(.{15,80}?)(?:[.!]|$)/i,
        /(?:implemented?|added?|created?)\s+(.{15,80}?(?:for|to|that))/i,
        /^(.{20,100}?)(?:\s+(?:to|for|by)|[.!?\n])/i,
      ];

      for (const pattern of solution_patterns) {
        const match = content.match(pattern);
        if (match && match[1]) {
          let extracted = match[1].trim().replace(/[.,;:]+$/, '');
          if (extracted.length >= 15 && !/^(a|the|some)\s/i.test(extracted)) {
            solution = extracted.charAt(0).toUpperCase() + extracted.slice(1);
            break;
          }
        }
      }
      if (solution !== 'Implementation and updates') break;
    }
  }

  const files_created = [];
  const files_modified = [];

  for (const [path, info] of file_changes) {
    const entry = {
      path: path.replace(new RegExp(`^${os.homedir().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}/[^/]+/`), ''),
      description: info.description,
    };

    if (info.action === 'created') {
      files_created.push(entry);
    } else {
      files_modified.push(entry);
    }
  }

  const outcomes = [];

  for (const msg of result_messages.slice(0, 5)) {
    const content = msg.prompt || msg.content || '';
    const outcome_patterns = [
      /[-•]\s*(.{15,80})/g,
      /(?:completed?|finished|implemented|working):\s*(.{15,80})/gi,
      /✓\s*(.{15,80})/g,
    ];

    for (const pattern of outcome_patterns) {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        const outcome = match[1].trim();
        if (outcome.length > 10 && !outcomes.includes(outcome)) {
          outcomes.push(outcome);
          if (outcomes.length >= 5) break;
        }
      }
      if (outcomes.length >= 5) break;
    }
  }

  const all_content = messages
    .map(m => m.prompt || m.content || '')
    .join('\n\n');
  const trigger_phrases = extractTriggerPhrases(all_content);

  return {
    task,
    solution,
    filesCreated: files_created,
    filesModified: files_modified,
    decisions: decisions.slice(0, 5),
    outcomes: outcomes.length > 0 ? outcomes : ['Session completed'],
    triggerPhrases: trigger_phrases,
    messageStats: {
      intent: intent_messages.length,
      plan: plan_messages.length,
      implementation: impl_messages.length,
      result: result_messages.length,
      decision: decisions.length,
      total: messages.length,
    },
  };
}

function format_summary_as_markdown(summary) {
  const lines = [];

  lines.push('## Implementation Summary\n');
  lines.push(`**Task:** ${summary.task}\n`);
  lines.push(`**Solution:** ${summary.solution}\n`);

  if (summary.filesCreated.length > 0) {
    lines.push('\n### Files Created');
    for (const file of summary.filesCreated) {
      lines.push(`- \`${file.path}\` - ${file.description}`);
    }
  }

  if (summary.filesModified.length > 0) {
    lines.push('\n### Files Modified');
    for (const file of summary.filesModified) {
      lines.push(`- \`${file.path}\` - ${file.description}`);
    }
  }

  if (summary.decisions.length > 0) {
    lines.push('\n### User Decisions');
    for (const decision of summary.decisions) {
      lines.push(`- **${decision.question}**: ${decision.choice}`);
    }
  }

  if (summary.outcomes.length > 0 && summary.outcomes[0] !== 'Session completed') {
    lines.push('\n### Key Outcomes');
    for (const outcome of summary.outcomes) {
      lines.push(`- ${outcome}`);
    }
  }

  if (summary.triggerPhrases && summary.triggerPhrases.length > 0) {
    lines.push('\n### Trigger Phrases');
    lines.push(`\`${summary.triggerPhrases.join('`, `')}\``);
  }

  return lines.join('\n');
}

/* ─────────────────────────────────────────────────────────────
   7. EXPORTS
──────────────────────────────────────────────────────────────── */

module.exports = {
  // Snake_case exports (original)
  MESSAGE_TYPES,
  classify_message,
  classify_messages,
  extract_file_changes,
  extract_decisions,
  generate_implementation_summary,
  format_summary_as_markdown,
  // CamelCase aliases (for generate-context.js compatibility)
  classifyMessage: classify_message,
  classifyMessages: classify_messages,
  extractFileChanges: extract_file_changes,
  extractDecisions: extract_decisions,
  generateImplementationSummary: generate_implementation_summary,
  formatSummaryAsMarkdown: format_summary_as_markdown,
};
