// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ command-metadata-schema — pure hub command-metadata core contract        ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

/**
 * command-metadata-schema.cjs — pure validator for a hub's command-metadata.json.
 *
 * Every hub carries this file as part of its class contract: an array with one
 * entry per slash command the hub owns, or an empty array when it owns none.
 * The file turns each command's routing identity and load choreography into
 * checkable data — before it, that contract lived only in prose that every
 * reader paraphrased slightly differently, and only one hub's version was
 * validated by anything.
 *
 * This module owns the CORE schema: the hub-agnostic fields every entry must
 * carry. A hub may extend entries with domain-specific fields (the design hub
 * carries register policies and task projections, for example); unknown fields
 * are deliberately legal so richer per-hub validators can layer on top without
 * forking the core. The core checks:
 *
 *   - `command`        slash-command id, `/family:name` (or legacy `/name`)
 *   - `ownerMode`      must name a workflowMode in the hub's mode registry
 *   - `description`    non-empty routing description
 *   - `argumentHint`   invocation grammar as shown to the operator
 *   - `userIntent`     `{ job, ownedSignals[] }` — the routing vocabulary
 *   - `choreography`   ordered resource loads `{ order, skill, resource, action }`
 *
 * Cross-entry rules: command ids unique; owned signals unique across entries
 * (two commands claiming one signal makes routing ambiguous by construction).
 *
 * No filesystem access happens here. The caller supplies the registry's mode
 * list and an existence probe, so resource resolution stays testable and the
 * gate stays the single place that touches disk.
 */

// ─────────────────────────────────────────────────────────────────────────────
// 1. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const COMMAND_ID_PATTERN = /^\/[a-z][a-z0-9-]*(:[a-z][a-z0-9-]*)?$/;

const REQUIRED_ENTRY_FIELDS = Object.freeze([
  'command',
  'ownerMode',
  'description',
  'argumentHint',
  'userIntent',
  'choreography',
]);

// ─────────────────────────────────────────────────────────────────────────────
// 2. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function violation(code, command, message) {
  return { code, command, message };
}

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. CORE LOGIC
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Validate one hub's parsed command-metadata content against the core schema.
 *
 * @param {unknown} entries - parsed JSON content of command-metadata.json.
 * @param {object} context
 * @param {string} context.skillId - hub directory name, for messages.
 * @param {string[]} context.registryModes - workflowMode ids from mode-registry.json.
 * @param {(hubRelativePath: string) => boolean} [context.resourceExists]
 *   - probe for choreography resource paths (repo-root-relative). Omitted in
 *     pure unit tests; when absent, existence checks are skipped.
 * @param {(commandId: string) => boolean} [context.commandExists]
 *   - probe for the command's definition file. Omitted → skipped.
 * @returns {{ code: string, command: string|null, message: string }[]}
 */
function validateCommandMetadata(entries, context) {
  const { skillId, registryModes } = context;
  const violations = [];

  if (!Array.isArray(entries)) {
    return [violation('COMMAND_METADATA_NOT_ARRAY', null,
      `${skillId}: command-metadata.json must be an array (empty when the hub owns no commands)`)];
  }

  const modes = new Set(registryModes || []);
  const seenCommands = new Set();
  const seenSignals = new Map();

  entries.forEach((entry, index) => {
    if (!entry || typeof entry !== 'object' || Array.isArray(entry)) {
      violations.push(violation('MALFORMED_ENTRY', null, `${skillId}: entry ${index} is not an object`));
      return;
    }
    const id = typeof entry.command === 'string' ? entry.command : `entry ${index}`;

    for (const field of REQUIRED_ENTRY_FIELDS) {
      if (!(field in entry)) {
        violations.push(violation('MISSING_FIELD', id, `${skillId}: ${id} lacks required field '${field}'`));
      }
    }

    if ('command' in entry) {
      if (!isNonEmptyString(entry.command) || !COMMAND_ID_PATTERN.test(entry.command)) {
        violations.push(violation('BAD_COMMAND_ID', id,
          `${skillId}: '${entry.command}' is not a /family:name slash-command id`));
      } else if (seenCommands.has(entry.command)) {
        violations.push(violation('DUPLICATE_COMMAND', id, `${skillId}: '${entry.command}' declared twice`));
      } else {
        seenCommands.add(entry.command);
        if (context.commandExists && !context.commandExists(entry.command)) {
          violations.push(violation('COMMAND_FILE_MISSING', id,
            `${skillId}: no command definition found for '${entry.command}' under .opencode/commands/`));
        }
      }
    }

    if ('ownerMode' in entry && !modes.has(entry.ownerMode)) {
      violations.push(violation('UNKNOWN_OWNER_MODE', id,
        `${skillId}: ownerMode '${entry.ownerMode}' is not a workflowMode in mode-registry.json`));
    }

    for (const field of ['description', 'argumentHint']) {
      if (field in entry && !isNonEmptyString(entry[field])) {
        violations.push(violation('EMPTY_FIELD', id, `${skillId}: ${id} has an empty '${field}'`));
      }
    }

    if ('userIntent' in entry) {
      const intent = entry.userIntent;
      if (!intent || typeof intent !== 'object'
          || !isNonEmptyString(intent.job)
          || !Array.isArray(intent.ownedSignals) || intent.ownedSignals.length === 0
          || !intent.ownedSignals.every(isNonEmptyString)) {
        violations.push(violation('BAD_USER_INTENT', id,
          `${skillId}: ${id} userIntent must be { job, ownedSignals[] } with at least one signal`));
      } else {
        for (const signal of intent.ownedSignals) {
          const key = signal.trim().toLowerCase();
          if (seenSignals.has(key) && seenSignals.get(key) !== entry.command) {
            violations.push(violation('DUPLICATE_OWNED_SIGNAL', id,
              `${skillId}: signal '${signal}' claimed by both '${seenSignals.get(key)}' and '${entry.command}' — routing is ambiguous`));
          } else {
            seenSignals.set(key, entry.command);
          }
        }
      }
    }

    if ('choreography' in entry) {
      const steps = entry.choreography;
      if (!Array.isArray(steps) || steps.length === 0) {
        violations.push(violation('BAD_CHOREOGRAPHY', id,
          `${skillId}: ${id} choreography must be a non-empty ordered array`));
      } else {
        let lastOrder = -Infinity;
        steps.forEach((step, stepIndex) => {
          if (!step || typeof step !== 'object'
              || !Number.isInteger(step.order)
              || !isNonEmptyString(step.skill)
              || !isNonEmptyString(step.resource)
              || !isNonEmptyString(step.action)) {
            violations.push(violation('BAD_CHOREOGRAPHY_STEP', id,
              `${skillId}: ${id} choreography step ${stepIndex} needs { order, skill, resource, action }`));
            return;
          }
          if (step.order <= lastOrder) {
            violations.push(violation('CHOREOGRAPHY_ORDER', id,
              `${skillId}: ${id} choreography orders must strictly increase (step ${stepIndex})`));
          }
          lastOrder = step.order;
          if (context.resourceExists && !context.resourceExists(step.resource)) {
            violations.push(violation('CHOREOGRAPHY_RESOURCE_MISSING', id,
              `${skillId}: ${id} choreography resource does not resolve on disk: ${step.resource}`));
          }
        });
      }
    }
  });

  return violations;
}

/**
 * Map a slash-command id to its expected definition path fragment, e.g.
 * `/create:skill` → `create/skill.md` and `/prompt:improve` → `prompt/improve.md`.
 * Legacy single-segment ids map to `<name>.md`.
 */
function commandDefinitionRelPath(commandId) {
  const body = commandId.replace(/^\//, '');
  const [family, name] = body.split(':');
  return name ? `${family}/${name}.md` : `${body}.md`;
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  COMMAND_ID_PATTERN,
  REQUIRED_ENTRY_FIELDS,
  validateCommandMetadata,
  commandDefinitionRelPath,
};
