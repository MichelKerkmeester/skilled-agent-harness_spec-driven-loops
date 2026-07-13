// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Skill Contract Loader                                                    ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

const fs = require('fs');
const path = require('path');


// ─────────────────────────────────────────────────────────────────────────────
// 1. CONFIGURATION
// ─────────────────────────────────────────────────────────────────────────────

const SKILL_CONTRACT_PATH = path.join(__dirname, '..', 'assets', 'skill_contract.json');
let skillContractCache;


// ─────────────────────────────────────────────────────────────────────────────
// 2. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function isObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}


// ─────────────────────────────────────────────────────────────────────────────
// 3. LOADER
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Load and cache the create-skill contract, returning an empty object on failure.
 *
 * @returns {Object} Parsed contract or an empty object.
 */
function loadSkillContract() {
  if (skillContractCache !== undefined) {
    return skillContractCache;
  }

  try {
    const parsed = JSON.parse(fs.readFileSync(SKILL_CONTRACT_PATH, 'utf8'));
    if (!isObject(parsed)) {
      throw new TypeError('contract root must be a JSON object');
    }
    skillContractCache = parsed;
  } catch (error) {
    const detail = String(error instanceof Error ? error.message : error).replace(/\r?\n/g, ' ');
    console.error(`[skill-contract] Warning: failed to load ${SKILL_CONTRACT_PATH}: ${detail}`);
    skillContractCache = {};
  }

  return skillContractCache;
}


// ─────────────────────────────────────────────────────────────────────────────
// 4. ACCESSORS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Return the kind-specific description budget plus shared hard ceilings.
 *
 * @param {string} [kind='skill'] - Packet kind whose soft budget should be returned.
 * @returns {Object} Description budget values or an empty object.
 */
function descriptionBudget(kind = 'skill') {
  const budgets = loadSkillContract().descriptionBudget;
  if (!isObject(budgets) || !isObject(budgets[kind])) {
    return {};
  }

  const result = {};
  for (const [key, value] of Object.entries(budgets[kind])) {
    if (Number.isInteger(value)) {
      result[key] = value;
    }
  }
  for (const key of ['hardCap', 'projectCeiling']) {
    if (Number.isInteger(budgets[key])) {
      result[key] = budgets[key];
    }
  }
  return result;
}

/**
 * Return a copy of the converged skill-name rule.
 *
 * @returns {Object} Name rule values or an empty object.
 */
function nameRule() {
  const rule = loadSkillContract().nameRule;
  return isObject(rule) ? { ...rule } : {};
}

/**
 * Return the canonical required SKILL.md sections in validation order.
 *
 * @returns {string[]} Required section names.
 */
function requiredSections() {
  const sections = loadSkillContract().sections;
  const skillSections = isObject(sections) ? sections.skill : undefined;
  const required = isObject(skillSections) ? skillSections.required : undefined;
  return Array.isArray(required) ? required.filter((section) => typeof section === 'string') : [];
}

/**
 * Return copies of the required and recommended smart-router marker lists.
 *
 * @returns {Object} Smart-router marker lists or an empty object.
 */
function smartRouterMarkers() {
  const markers = loadSkillContract().smartRouterMarkers;
  if (!isObject(markers)) {
    return {};
  }

  const result = {};
  for (const key of ['required', 'recommended']) {
    if (Array.isArray(markers[key])) {
      result[key] = markers[key].filter((value) => typeof value === 'string');
    }
  }
  return result;
}


// ─────────────────────────────────────────────────────────────────────────────
// 5. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  loadSkillContract,
  descriptionBudget,
  nameRule,
  requiredSections,
  smartRouterMarkers,
};
