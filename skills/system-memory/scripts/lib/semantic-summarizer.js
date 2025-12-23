/**
 * Semantic Summarizer - Extract meaningful summaries from conversation data
 *
 * This module provides semantic understanding of conversation content,
 * transforming raw messages into structured implementation summaries.
 *
 * Key capabilities:
 * - Message classification (intent, plan, implementation, result, decision)
 * - File change tracking with semantic descriptions
 * - Decision extraction from user interactions
 * - Implementation summary generation
 */

'use strict';

const { extractTriggerPhrases } = require('./trigger-extractor');

// ───────────────────────────────────────────────────────────────
// MESSAGE CLASSIFICATION
// ───────────────────────────────────────────────────────────────

/**
 * Message types for semantic classification
 */
const MESSAGE_TYPES = {
  INTENT: 'intent',           // User's initial request/goal
  PLAN: 'plan',               // Planning/approach discussion
  IMPLEMENTATION: 'implementation', // Code/file changes
  RESULT: 'result',           // Outcomes, completions
  DECISION: 'decision',       // User choices (decision points)
  QUESTION: 'question',       // Clarification requests
  CONTEXT: 'context'          // Background/research
};

/**
 * Classification patterns for detecting message types
 * CRITICAL: Order matters - specific patterns first, generic last
 * Fixed pattern order: DECISION → IMPLEMENTATION → RESULT → PLAN → INTENT → QUESTION
 */
const CLASSIFICATION_PATTERNS = {
  // 1. DECISION - very specific markers (must come first)
  [MESSAGE_TYPES.DECISION]: [
    /(?:Selected:|Chose:|user chose|user selected|decision made|user decision)/i,
    /^(?:Option\s+)?[A-D](?:\)|:|\s*[-–])/i,
    /(?:selected option|picked option|chose option)/i
  ],
  // 2. IMPLEMENTATION - file operations and code changes (specific evidence)
  [MESSAGE_TYPES.IMPLEMENTATION]: [
    /(?:^Created|^Modified|^Edited|^Wrote|^Added|^Removed|^Changed|^Fixed)\s+[`"']?[\w./-]+/i,
    /(?:Edit|Write)\s*\([^)]*file_path/i,
    /(?:\.js|\.ts|\.md|\.json|\.sh|\.css|\.py)\s*(?:file|module|script)?/i,
    /(?:function|class|const|let|var|export|import)\s+\w+/i
  ],
  // 3. RESULT - completion indicators
  [MESSAGE_TYPES.RESULT]: [
    /(?:complete[d!]?|done[!]?|finished|success)/i,
    /(?:tests? pass|all tests|verified|confirmed)/i,
    /(?:## Implementation Complete|## Summary|## Results|✅|✓)/i,
    /^(?:It works|Working|Fixed|Resolved)/i
  ],
  // 4. PLAN - future tense planning
  [MESSAGE_TYPES.PLAN]: [
    /(?:^I'll|^Let me|^First,|^Then,|^Next,|^Finally,)/i,
    /(?:plan|approach|strategy|steps to|phases)/i,
    /(?:todo|task list|checklist)/i,
    /(?:^#+\s*Plan|Implementation Plan|will need to)/i
  ],
  // 5. INTENT - user requests (BEFORE question to catch "Can you help me...?")
  [MESSAGE_TYPES.INTENT]: [
    /^(?:I want|I need|Please|Help me|I'd like|Analyze|Implement|Create|Fix|Improve)/i,
    /^(?:Can you|Could you|Would you)\s+(?:help|implement|create|add|build|fix)/i
  ],
  // 6. QUESTION - LAST and more specific (requires question word + ?)
  [MESSAGE_TYPES.QUESTION]: [
    /^(?:Which|What|How|Where|When|Why|Should|Is|Are|Does|Do).+\?$/i
  ]
};

/**
 * Classify a message by its semantic type
 * @param {string} content - Message content
 * @returns {string} - Message type from MESSAGE_TYPES
 */
function classifyMessage(content) {
  if (!content || typeof content !== 'string') {
    return MESSAGE_TYPES.CONTEXT;
  }

  const normalized = content.trim();

  // Check each type's patterns
  for (const [type, patterns] of Object.entries(CLASSIFICATION_PATTERNS)) {
    for (const pattern of patterns) {
      if (pattern.test(normalized)) {
        return type;
      }
    }
  }

  return MESSAGE_TYPES.CONTEXT;
}

/**
 * Classify all messages in a conversation
 * @param {Array} messages - Array of message objects with content/prompt
 * @returns {Map} - Map of type -> messages[]
 */
function classifyMessages(messages) {
  const classified = new Map();

  for (const type of Object.values(MESSAGE_TYPES)) {
    classified.set(type, []);
  }

  for (const msg of messages) {
    const content = msg.prompt || msg.content || msg.CONTENT || '';
    const type = classifyMessage(content);
    classified.get(type).push({
      ...msg,
      _semanticType: type
    });
  }

  return classified;
}

// ───────────────────────────────────────────────────────────────
// FILE CHANGE EXTRACTION
// ───────────────────────────────────────────────────────────────

/**
 * Find file position starting from a given offset
 * This ensures each file gets its own context window, not the same first occurrence
 * @param {string} content - Full content to search
 * @param {string} filePath - File path to find
 * @param {number} searchFrom - Start position for search
 * @returns {number} - Index position or -1 if not found
 */
function findFilePosition(content, filePath, searchFrom = 0) {
  const searchContent = content.substring(searchFrom);
  const index = searchContent.indexOf(filePath);
  return index === -1 ? -1 : searchFrom + index;
}

/**
 * Extract semantic descriptions of file changes from messages
 * @param {Array} messages - Conversation messages
 * @param {Array} observations - AI's observations
 * @returns {Map} - Map of filepath -> {action, description, changes[]}
 */
function extractFileChanges(messages, observations = []) {
  const fileChanges = new Map();

  // Pattern to detect file operations
  const filePatterns = {
    created: /(?:created?|wrote?|new file|Write\()/i,
    modified: /(?:modified|edited|changed|updated|Edit\()/i,
    deleted: /(?:deleted|removed|rm\s)/i,
    read: /(?:read|Read\()/i
  };

  // Extract file paths from text
  const extractFilePaths = (text) => {
    const paths = [];

    // Pattern for quoted paths
    const quotedPaths = text.match(/["'`]([^"'`]+\.[a-zA-Z]{1,10})["'`]/g);
    if (quotedPaths) {
      paths.push(...quotedPaths.map(p => p.replace(/["'`]/g, '')));
    }

    // Pattern for paths with common extensions
    const extensionPaths = text.match(/(?:^|[\s(])([./\w-]+\.(?:js|ts|jsx|tsx|json|jsonc|md|sh|css|html|py|yaml|yml))/gi);
    if (extensionPaths) {
      paths.push(...extensionPaths.map(p => p.trim().replace(/^[(]/, '')));
    }

    return [...new Set(paths)];
  };

  // Process messages for file changes
  for (const msg of messages) {
    const content = msg.prompt || msg.content || msg.CONTENT || '';
    const type = classifyMessage(content);

    if (type === MESSAGE_TYPES.IMPLEMENTATION || type === MESSAGE_TYPES.RESULT) {
      const paths = extractFilePaths(content);

      // Track search position to find EACH file's unique context
      let lastSearchPosition = 0;

      for (const filePath of paths) {
        // Determine action type
        let action = 'modified';
        for (const [actionType, pattern] of Object.entries(filePatterns)) {
          if (pattern.test(content)) {
            action = actionType;
            break;
          }
        }

        // Skip read-only operations for the summary
        if (action === 'read') continue;

        // FIX: Find THIS file's position starting from last found position
        // This ensures each file gets its own unique context window
        const fileIndex = findFilePosition(content, filePath, lastSearchPosition);

        if (fileIndex === -1) {
          // File not found from current position, try from start as fallback
          const fallbackIndex = content.indexOf(filePath);
          if (fallbackIndex === -1) continue;
          // Use fallback but don't update lastSearchPosition
          const contextStart = Math.max(0, fallbackIndex - 100);
          const contextEnd = Math.min(content.length, fallbackIndex + filePath.length + 200);
          const context = content.substring(contextStart, contextEnd);
          const description = extractChangeDescription(context, filePath);

          if (!fileChanges.has(filePath)) {
            fileChanges.set(filePath, { action, description, changes: [], mentions: 1 });
          }
          continue;
        }

        // Update search position for next file
        lastSearchPosition = fileIndex + filePath.length;

        // Extract context around THIS file's actual position
        const contextStart = Math.max(0, fileIndex - 100);
        const contextEnd = Math.min(content.length, fileIndex + filePath.length + 200);
        const context = content.substring(contextStart, contextEnd);

        // Try to extract a meaningful description
        let description = extractChangeDescription(context, filePath);

        if (!fileChanges.has(filePath)) {
          fileChanges.set(filePath, {
            action,
            description,
            changes: [],
            mentions: 1
          });
        } else {
          const existing = fileChanges.get(filePath);
          existing.mentions++;
          // Update description if new one is more descriptive
          if (description.length > existing.description.length) {
            existing.description = description;
          }
          // Upgrade action (created > modified)
          if (action === 'created' && existing.action !== 'created') {
            existing.action = action;
          }
        }
      }
    }
  }

  // Enhance with observations data - also use file-specific descriptions
  for (const obs of observations) {
    if (obs.files && Array.isArray(obs.files)) {
      const narrative = obs.narrative || '';

      for (const file of obs.files) {
        if (!fileChanges.has(file)) {
          // Extract file-specific description from narrative
          const description = extractChangeDescription(narrative, file);
          fileChanges.set(file, {
            action: 'modified',
            description: description,
            changes: [],
            mentions: 1
          });
        }
      }
    }
  }

  return fileChanges;
}

/**
 * V8.3: Clean and format a description string
 * Removes markdown formatting, trailing punctuation, and truncates
 * @param {string} desc - Raw description
 * @returns {string} - Cleaned description
 */
function cleanDescription(desc) {
  if (!desc) return '';
  let cleaned = desc.trim();

  // Remove markdown formatting
  cleaned = cleaned.replace(/^#+\s+/, '');        // ## headers
  cleaned = cleaned.replace(/^[-*]\s+/, '');      // - bullets
  cleaned = cleaned.replace(/`([^`]+)`/g, '$1');  // `backticks`
  cleaned = cleaned.replace(/\*\*([^*]+)\*\*/g, '$1'); // **bold**

  // Remove trailing punctuation
  cleaned = cleaned.replace(/[.,;:]+$/, '');

  // Truncate to max 60 chars for concise output
  if (cleaned.length > 60) {
    cleaned = cleaned.substring(0, 57) + '...';
  }

  // Capitalize first letter
  if (cleaned.length > 0) {
    cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
  }
  return cleaned;
}

/**
 * V8.3: Validate that a description is actually file-specific and not garbage
 * @param {string} description - Description text
 * @returns {boolean} - True if description is likely valid/meaningful
 */
function isDescriptionValid(description) {
  if (!description || description.length < 8) return false;

  // Reject known generic/garbage descriptions
  const garbagePatterns = [
    /^#+\s/,                            // Markdown headers: ## Foo
    /^[-*]\s/,                          // List bullets: - foo, * bar
    /\s(?:and|or|to|the)\s*$/i,         // Incomplete: "Fixed the"
    /^(?:modified?|updated?)\s+\w+$/i,  // Too short: "Modified file"
    /^filtering\s+(?:pipeline|system)$/i, // Generic fallback
    /^And\s+[`'"]?/i,                   // Fragment: "And `foo"
    /^modified? during session$/i,       // Default fallback
    /^changed?$/i,
    /^no description available$/i,
    /^modified?$/i,
    /\[PLACEHOLDER\]/i,                 // Unfilled template
  ];

  return !garbagePatterns.some(p => p.test(description));
}

// P3.3: Standardized length constants for consistency
const DESC_MIN_LENGTH = 10;
const DESC_MAX_LENGTH = 100;

/**
 * Extract a meaningful change description from context
 * FIX v4: Prioritize file-specific patterns, improved regex escaping and validation
 * @param {string} context - Text around file mention
 * @param {string} filePath - The file path
 * @returns {string} - Semantic description of change
 */
function extractChangeDescription(context, filePath) {
  // V5.5: Cap context at 500 chars to prevent regex backtracking on long strings
  // Patterns like .{15,100}? can cause exponential backtracking on 3000+ char contexts
  const safeContext = context.substring(0, 500);

  // Get filename for filtering out path repetitions
  const filename = filePath.split('/').pop();
  const filenameNoExt = filename.replace(/\.[^.]+$/, '');

  // P1.2: Escape special regex characters in filename (added hyphen to escape list)
  const escapedFilename = filenameNoExt.replace(/[-.*+?^${}()|[\]\\]/g, '\\$&');

  // 1. PRIORITY: File-specific patterns - look for descriptions mentioning THIS file
  const fileSpecificPatterns = [
    // "Updated content-filter.js to add..." or "Modified X with..."
    new RegExp(`(?:updated?|modified?|changed?|fixed?|edited?)\\s+(?:the\\s+)?['"\`]?${escapedFilename}(?:\\.\\w+)?['"\`]?\\s+(?:to\\s+)?(.{15,100}?)(?:\\s*[.!,]|$)`, 'i'),
    // P2.2: "content-filter.js: Added new patterns" - added em-dash (—) to variants
    new RegExp(`${escapedFilename}(?:\\.\\w+)?\\s*[:\\-–—]\\s*(.{15,100}?)(?:\\s*[.!,\\n]|$)`, 'i'),
    // "In content-filter.js, we added..." or "For X, implemented..."
    new RegExp(`(?:in|for|to)\\s+['"\`]?${escapedFilename}(?:\\.\\w+)?['"\`]?[,:]?\\s+(?:we\\s+)?(.{15,100}?)(?:\\s*[.!,]|$)`, 'i'),
    // "Added X to content-filter.js"
    new RegExp(`(?:added?|implemented?|created?)\\s+(.{15,80}?)\\s+(?:to|in|for)\\s+['"\`]?${escapedFilename}`, 'i'),
    // "The content-filter handles..."
    new RegExp(`(?:the\\s+)?${escapedFilename}(?:\\.\\w+)?\\s+(?:now\\s+)?(?:handles?|provides?|implements?|contains?)\\s+(.{15,80}?)(?:\\s*[.!,]|$)`, 'i'),
    // P2.1: "X now supports/includes Y"
    new RegExp(`['"\`]?${escapedFilename}['"\`]?\\s+(?:now\\s+)?(?:supports?|includes?)\\s+(.{10,80})`, 'i'),
    // P2.1: "Modified X, adding Y"
    new RegExp(`modified\\s+['"\`]?${escapedFilename}['"\`]?,\\s+(?:adding|removing|implementing)\\s+(.{10,80})`, 'i')
  ];

  for (const pattern of fileSpecificPatterns) {
    const match = safeContext.match(pattern);
    if (match && match[1]) {
      let desc = match[1].trim();
      // Skip if description contains the file path (redundant)
      if (desc.includes(filePath) || desc.toLowerCase().includes(filenameNoExt.toLowerCase())) continue;
      desc = cleanDescription(desc);
      // P3.3: Use standardized length constants
      if (desc.length >= DESC_MIN_LENGTH && desc.length <= DESC_MAX_LENGTH && isDescriptionValid(desc)) {
        return desc;
      }
    }
  }

  // 2. Common patterns for extracting descriptions after "with" or "to"
  const withPatterns = [
    // "Created X with Y" - extract Y
    /with\s+(.{10,80}?)(?:\s*[.!,]|$)/i,
    // "to add/apply/integrate/remove/fix/enhance X" - expanded verb list (P2.1)
    /to\s+(?:add|apply|integrate|include|remove|fix|enhance|validate)\s+(.{10,80}?)(?:\s*[.!,]|$)/i,
    // "for X" - extract X
    /for\s+(.{10,80}?)(?:\s*[.!,]|$)/i,
    // P2.1: "Replaced X with Y"
    /replaced\s+(.{5,40})\s+with\s+(.{5,40})/i
  ];

  for (const pattern of withPatterns) {
    const match = safeContext.match(pattern);
    if (match && match[1]) {
      let desc = match[1].trim();
      // For replace pattern, combine both captures
      if (match[2]) {
        desc = `Replaced ${match[1].trim()} with ${match[2].trim()}`;
      }
      // Skip if description contains the file path (redundant)
      if (desc.includes(filePath) || desc.includes(filename)) continue;
      desc = cleanDescription(desc);
      // P3.3: Use standardized length constants
      if (desc.length >= DESC_MIN_LENGTH && desc.length <= DESC_MAX_LENGTH && !/^(the|a|an)\s/i.test(desc)) {
        return desc;
      }
    }
  }

  // 3. Fallback patterns for action + description
  const actionPatterns = [
    // "3-stage filtering pipeline"
    /(\d+-stage\s+\w+\s+pipeline)/i,
    // "filtering module" or similar - expanded adjective list (P2.1)
    /((?:filtering|content|semantic|noise|validation|processing|analysis|transformation)\s+(?:module|pipeline|system|logic))/i,
    // "configurable X settings/config/options" - expanded suffix list (P2.1)
    /(configurable\s+.{5,30}\s+(?:settings|config|options|behavior))/i,
    // Extract after colon (not at end of string - P2.1 fix)
    /:\s*(.{10,60}?)(?:\s*[.!,\n]|$)/
  ];

  for (const pattern of actionPatterns) {
    const match = safeContext.match(pattern);
    if (match && match[1]) {
      let desc = match[1].trim();
      if (desc.includes(filePath) || desc.includes(filename)) continue;
      desc = cleanDescription(desc);
      // P3.3: Use standardized length constants
      if (desc.length >= DESC_MIN_LENGTH && desc.length <= DESC_MAX_LENGTH) {
        return desc;
      }
    }
  }

  // 4. Filename-based fallback with better humanization
  const humanReadable = filenameNoExt
    .replace(/[-_]/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .toLowerCase();

  return `Updated ${humanReadable}`;
}

// ───────────────────────────────────────────────────────────────
// DECISION EXTRACTION
// ───────────────────────────────────────────────────────────────

/**
 * Extract user decisions from conversation
 * @param {Array} messages - Conversation messages
 * @returns {Array} - Array of {question, choice, context}
 */
function extractDecisions(messages) {
  const decisions = [];

  // Patterns for detecting decision points
  const decisionPatterns = [
    // User choice format (A/B/C/D options)
    /(?:Which|What|How|Should).+\?\s*(?:A\)|Option A|1\.)/is,
    // Direct choice patterns
    /(?:user chose|selected|decision made):\s*(.+)/i,
    // Option selection
    /(?:^|\n)\s*([A-D])\)\s*(.+?)(?:\n|$)/g
  ];

  for (let i = 0; i < messages.length; i++) {
    const msg = messages[i];
    const content = msg.prompt || msg.content || msg.CONTENT || '';
    const type = classifyMessage(content);

    if (type === MESSAGE_TYPES.DECISION) {
      // Look for the question in previous message
      let question = '';
      if (i > 0) {
        const prevContent = messages[i - 1].prompt || messages[i - 1].content || '';
        const questionMatch = prevContent.match(/([^.!?]+\?)/);
        if (questionMatch) {
          question = questionMatch[1].trim();
        }
      }

      // Extract the choice
      const choicePatterns = [
        /(?:chose|selected|picked)\s*[:"']?\s*([A-D](?:\)|:|\s)|.{5,50})/i,
        /^(?:Option\s+)?([A-D])(?:\)|:|\s)/i,
        /^([A-D])\s*[-–]\s*(.+)/i
      ];

      for (const pattern of choicePatterns) {
        const match = content.match(pattern);
        if (match) {
          decisions.push({
            question: question || 'User decision',
            choice: match[1]?.trim() || content.substring(0, 50),
            context: content.substring(0, 100)
          });
          break;
        }
      }
    }
  }

  return decisions;
}

// ───────────────────────────────────────────────────────────────
// IMPLEMENTATION SUMMARY GENERATION
// ───────────────────────────────────────────────────────────────

/**
 * Generate a structured implementation summary
 * @param {Array} messages - Conversation messages
 * @param {Array} observations - AI's observations
 * @returns {Object} - Structured summary with task, solution, files, decisions
 */
function generateImplementationSummary(messages, observations = []) {
  const classified = classifyMessages(messages);
  const fileChanges = extractFileChanges(messages, observations);
  const decisions = extractDecisions(messages);

  // Extract the main task from intent messages or first user message
  const intentMessages = classified.get(MESSAGE_TYPES.INTENT);
  const questionMessages = classified.get(MESSAGE_TYPES.QUESTION);

  let task = 'Development session';

  // First try intent messages
  if (intentMessages.length > 0) {
    const firstIntent = intentMessages[0].prompt || intentMessages[0].content || '';
    // Try to extract a clean task statement
    const taskPatterns = [
      /^(?:I want to|I need to|Please|Help me)\s+(.{15,120}?)(?:[.!?\n]|$)/i,
      /(?:implement|create|add|build|fix|improve)\s+(.{10,100}?)(?:[.!?\n]|$)/i,
      /^(.{20,120}?)(?:[.!?\n]|$)/  // Fallback: first sentence
    ];

    for (const pattern of taskPatterns) {
      const match = firstIntent.match(pattern);
      if (match && match[1]) {
        task = match[1].trim().replace(/[.,;:]+$/, '');
        // Capitalize first letter
        task = task.charAt(0).toUpperCase() + task.slice(1);
        break;
      }
    }
  }

  // If no intent, try to infer from question messages
  if (task === 'Development session' && questionMessages.length > 0) {
    const firstQuestion = questionMessages[0].prompt || questionMessages[0].content || '';
    if (firstQuestion.length > 20) {
      task = firstQuestion.substring(0, 100).replace(/\?.*$/, '').trim();
    }
  }

  // Extract solution approach from plan/implementation messages
  const planMessages = classified.get(MESSAGE_TYPES.PLAN);
  const implMessages = classified.get(MESSAGE_TYPES.IMPLEMENTATION);
  const resultMessages = classified.get(MESSAGE_TYPES.RESULT);

  let solution = 'Implementation and updates';
  const allPlanImpl = [...planMessages, ...implMessages, ...resultMessages];

  if (allPlanImpl.length > 0) {
    // Find patterns describing the solution
    for (const msg of allPlanImpl) {
      const content = msg.prompt || msg.content || '';
      const solutionPatterns = [
        // 1. Specific patterns - "Create a 3-stage pipeline"
        /(?:create|implement|build)\s+(?:a\s+)?(.{15,80}?(?:pipeline|system|module|filter))/i,
        // 2. "with X" patterns for implementation details
        /with\s+(.{15,80}?(?:filtering|detection|processing|validation))/i,
        // 3. "X-stage Y pipeline" patterns
        /(\d+-stage\s+.{10,50}?(?:pipeline|system|process))/i,
        // 4. Solution/approach header patterns
        /(?:solution|approach):\s*(.{15,100})/i,
        // 5. Generic implementation patterns (before fallback)
        /(?:implement|create|add|build|fix)\s+(.{15,80}?)(?:\s+(?:to|for|that|in)|[.!]|$)/i,
        /(?:by\s+)?(?:adding|creating|implementing|fixing)\s+(.{15,80}?)(?:[.!]|$)/i,
        // 6. Explicit action statement
        /(?:implemented?|added?|created?)\s+(.{15,80}?(?:for|to|that))/i,
        // 7. Extract from first message sentence (last resort before fallback)
        /^(.{20,100}?)(?:\s+(?:to|for|by)|[.!?\n])/i
      ];

      for (const pattern of solutionPatterns) {
        const match = content.match(pattern);
        if (match && match[1]) {
          let extracted = match[1].trim().replace(/[.,;:]+$/, '');
          // Skip if too generic
          if (extracted.length >= 15 && !/^(a|the|some)\s/i.test(extracted)) {
            solution = extracted.charAt(0).toUpperCase() + extracted.slice(1);
            break;
          }
        }
      }
      if (solution !== 'Implementation and updates') break;
    }
  }

  // Build files summary with semantic descriptions
  const filesCreated = [];
  const filesModified = [];

  for (const [path, info] of fileChanges) {
    const entry = {
      path: path.replace(/^\/Users\/[^/]+\/[^/]+\/[^/]+\/[^/]+\//, ''),
      description: info.description
    };

    if (info.action === 'created') {
      filesCreated.push(entry);
    } else {
      filesModified.push(entry);
    }
  }

  // Extract key outcomes from result messages (already declared above)
  const outcomes = [];

  for (const msg of resultMessages.slice(0, 5)) {
    const content = msg.prompt || msg.content || '';
    // Look for bullet points or key statements
    const outcomePatterns = [
      /[-•]\s*(.{15,80})/g,
      /(?:completed?|finished|implemented|working):\s*(.{15,80})/gi,
      /✓\s*(.{15,80})/g
    ];

    for (const pattern of outcomePatterns) {
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

  // Extract trigger phrases from all message content (FR-012)
  const allContent = messages
    .map(m => m.prompt || m.content || '')
    .join('\n\n');
  const triggerPhrases = extractTriggerPhrases(allContent);

  return {
    task,
    solution,
    filesCreated,
    filesModified,
    decisions: decisions.slice(0, 5),
    outcomes: outcomes.length > 0 ? outcomes : ['Session completed'],
    triggerPhrases,
    messageStats: {
      intent: intentMessages.length,
      plan: planMessages.length,
      implementation: implMessages.length,
      result: resultMessages.length,
      decision: decisions.length,
      total: messages.length
    }
  };
}

/**
 * Format implementation summary as markdown
 * @param {Object} summary - Summary from generateImplementationSummary
 * @returns {string} - Formatted markdown
 */
function formatSummaryAsMarkdown(summary) {
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

// ───────────────────────────────────────────────────────────────
// EXPORTS
// ───────────────────────────────────────────────────────────────

module.exports = {
  // Constants
  MESSAGE_TYPES,

  // Classification functions
  classifyMessage,
  classifyMessages,

  // Extraction functions
  extractFileChanges,
  extractDecisions,

  // Summary generation
  generateImplementationSummary,
  formatSummaryAsMarkdown
};
