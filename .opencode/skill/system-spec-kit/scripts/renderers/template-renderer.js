// ───────────────────────────────────────────────────────────────
// RENDERERS: TEMPLATE RENDERER
// ───────────────────────────────────────────────────────────────
'use strict';

/* ─────────────────────────────────────────────────────────────────
   1. IMPORTS
──────────────────────────────────────────────────────────────────── */

const fs = require('fs/promises');
const path = require('path');
const { CONFIG } = require('../core');

/* ─────────────────────────────────────────────────────────────────
   2. HELPER FUNCTIONS
──────────────────────────────────────────────────────────────────── */

function is_falsy(value) {
  // "false" strings and empty arrays treated as falsy for template conditionals
  if (value === undefined || value === null || value === false) return true;
  if (typeof value === 'string' && value.toLowerCase() === 'false') return true;
  if (typeof value === 'number' && value === 0) return true;
  if (typeof value === 'string' && value.trim() === '') return true;
  if (Array.isArray(value) && value.length === 0) return true;
  return false;
}

function cleanup_excessive_newlines(text) {
  return text.replace(/\n{3,}/g, '\n\n');
}

function strip_template_config_comments(text) {
  let result = text.replace(/<!--\s*Template Configuration Comments[\s\S]*?-->\s*\n*/g, '');
  result = result.replace(/<!--\s*Context Type Detection:[\s\S]*?-->\s*\n*/g, '');
  result = result.replace(/<!--\s*Importance Tier Guidelines:[\s\S]*?-->\s*\n*/g, '');
  result = result.replace(/<!--\s*Channel\/Branch Association:[\s\S]*?-->\s*\n*/g, '');
  result = result.replace(/<!--\s*SESSION CONTEXT DOCUMENTATION[\s\S]*?-->\s*$/g, '');
  return result.replace(/\n{3,}/g, '\n\n');
}

/* ─────────────────────────────────────────────────────────────────
   3. CORE RENDERING
──────────────────────────────────────────────────────────────────── */

function render_template(template, data, parentData = {}) {
  let result = template;
  const mergedData = { ...parentData, ...data };

  // Array loops: {{#ARRAY}}...{{/ARRAY}}
  result = result.replace(/\{\{#(\w+)\}\}([\s\S]*?)\{\{\/\1\}\}/g, (match, key, content) => {
    const value = mergedData[key];

    if (typeof value === 'boolean') {
      return value ? render_template(content, mergedData, parentData) : '';
    }

    if (is_falsy(value)) {
      return '';
    }

    if (!Array.isArray(value)) {
      return render_template(content, mergedData, parentData);
    }

    if (value.length === 0) {
      return '';
    }

    return value.map(item => {
      if (typeof item === 'object' && item !== null) {
        return render_template(content, item, mergedData);
      }
      return render_template(content, { ITEM: item, '.': item }, mergedData);
    }).join('');
  });

  // Inverted sections: {{^ARRAY}}...{{/ARRAY}}
  result = result.replace(/\{\{\^(\w+)\}\}([\s\S]*?)\{\{\/\1\}\}/g, (match, key, content) => {
    const value = mergedData[key];
    if (is_falsy(value)) {
      return render_template(content, mergedData, parentData);
    }
    return '';
  });

  // Simple variable replacement: {{VAR}} or {{.}}
  result = result.replace(/\{\{([\w.]+)\}\}/g, (match, key) => {
    const value = mergedData[key];

    if (value === undefined || value === null) {
      console.warn(`⚠️  Missing template data for: {{${key}}}`);
      return '';
    }

    if (Array.isArray(value)) {
      return value.map(item => {
        if (typeof item === 'object' && item !== null) {
          const firstKey = Object.keys(item)[0];
          return firstKey ? item[firstKey] : JSON.stringify(item);
        }
        return String(item);
      }).join(', ');
    }

    if (typeof value === 'object') {
      const firstKey = Object.keys(value)[0];
      return firstKey ? value[firstKey] : JSON.stringify(value);
    }

    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No';
    }

    return String(value);
  });

  return cleanup_excessive_newlines(result);
}

/* ─────────────────────────────────────────────────────────────────
   4. PUBLIC API
──────────────────────────────────────────────────────────────────── */

async function populate_template(templateName, data) {
  const templatePath = path.join(CONFIG.TEMPLATE_DIR, `${templateName}_template.md`);

  // T029 FIX: Add error handling for template not found scenario
  try {
    // Check if template exists before reading
    await fs.access(templatePath);
  } catch (accessError) {
    throw new Error(
      `Template not found: "${templateName}" (expected at: ${templatePath}). ` +
      `Available templates should be in: ${CONFIG.TEMPLATE_DIR}`
    );
  }

  let template;
  try {
    template = await fs.readFile(templatePath, 'utf-8');
  } catch (readError) {
    throw new Error(
      `Failed to read template "${templateName}": ${readError.message}`
    );
  }

  const rendered = render_template(template, data);
  return strip_template_config_comments(rendered);
}

/* ─────────────────────────────────────────────────────────────────
   5. EXPORTS
──────────────────────────────────────────────────────────────────── */

module.exports = {
  // Primary exports (snake_case)
  populate_template,
  render_template,
  cleanup_excessive_newlines,
  strip_template_config_comments,
  is_falsy,
  // Backwards compatibility aliases (camelCase)
  populateTemplate: populate_template,
  renderTemplate: render_template,
  cleanupExcessiveNewlines: cleanup_excessive_newlines,
  stripTemplateConfigComments: strip_template_config_comments,
  isFalsy: is_falsy
};
