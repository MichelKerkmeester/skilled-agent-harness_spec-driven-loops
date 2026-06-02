// Data-driven prompt-framework renderer. Replaces per-rig render() closures
// with a single slot interpolator over a machine-readable framework registry.
// A framework template carries named {{slot}} placeholders; this module computes
// the framework-neutral output_contract and constraints from the fixture, then
// fills every slot. Required-slot validation fails LOUD at render time so a
// malformed framework definition is caught before any model dispatch.

'use strict';

const fs = require('fs');

// Framework-neutral guardrail line. Held constant across frameworks so a
// bake-off isolates the framework axis, not the constraint wording. Mirrors the
// shared constraints() the one-off rigs interpolated into every variant.
const DEFAULT_CONSTRAINTS =
  'Handle every stated edge case. Do not invent extra parameters, helper ' +
  'globals, or behaviour beyond the specification. Pure function, no side effects.';

// Tokens the renderer can source directly off a fixture. Frameworks may
// reference any of these by {{name}}; missing ones surface as required-slot
// errors rather than leaking an empty string into the prompt.
const FIXTURE_TOKEN_KEYS = ['task', 'fn_name', 'signature'];

function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Single-pass slot fill. Every {{slot}} whose key exists in `values` (and is
// non-empty) is replaced; anything else is left untouched so the caller's
// required-slot check can detect the unfilled placeholder.
function fillSlots(template, values) {
  let out = String(template);
  for (const [key, val] of Object.entries(values)) {
    if (val === undefined || val === null) continue;
    const token = new RegExp('\\{\\{\\s*' + escapeRegExp(key) + '\\s*\\}\\}', 'g');
    out = out.replace(token, String(val));
  }
  return out;
}

// Collect the slot keys a framework template actually references, so validation
// reports the real surface even if `required_slots` is stale or omitted.
function slotsInTemplate(template) {
  const found = new Set();
  const re = /\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g;
  let m;
  while ((m = re.exec(String(template))) !== null) {
    found.add(m[1]);
  }
  return [...found];
}

// Build the value map for a framework render: fixture-sourced tokens plus the
// computed output_contract and constraints. output_contract is itself a small
// template (it references {{fn_name}}/{{signature}}), so it is resolved against
// the fixture tokens before it can fill the framework's {{output_contract}} slot.
function buildValues(frameworkDef, fixture, opts) {
  const options = opts || {};
  const fixtureTokens = {};
  for (const k of FIXTURE_TOKEN_KEYS) {
    if (fixture && fixture[k] !== undefined && fixture[k] !== null) {
      fixtureTokens[k] = fixture[k];
    }
  }

  const constraints =
    options.constraints !== undefined
      ? options.constraints
      : DEFAULT_CONSTRAINTS;

  // Caller-supplied output_contract wins; otherwise fall back to the framework's
  // own default, then a registry-neutral default. Resolve its inner slots
  // against the fixture so the contract names the real function + signature.
  const contractTemplate =
    options.output_contract !== undefined
      ? options.output_contract
      : frameworkDef && frameworkDef.output_contract_default !== undefined
        ? frameworkDef.output_contract_default
        : 'Return ONLY the JavaScript function source for `{{fn_name}}` ' +
          '(signature `{{signature}}`). No prose, no explanation, no test ' +
          'code, no markdown fence — just the function.';

  const output_contract = fillSlots(contractTemplate, fixtureTokens);

  return Object.assign({}, fixtureTokens, { constraints, output_contract });
}

// Render a framework definition against a fixture into a prompt string.
// Throws a clear Error naming every required slot left without a value, so a
// broken template never silently ships a prompt with literal {{placeholders}}.
function renderFramework(frameworkDef, fixture, opts) {
  if (!frameworkDef || typeof frameworkDef !== 'object') {
    throw new Error('renderFramework: frameworkDef must be an object');
  }
  if (typeof frameworkDef.template !== 'string') {
    throw new Error(
      'renderFramework: framework "' +
        (frameworkDef.id || 'unknown') +
        '" is missing a string `template`',
    );
  }

  const values = buildValues(frameworkDef, fixture, opts);

  // The required set is the union of the declared required_slots and any slot
  // the template literally references — whichever is broader. This catches both
  // a stale required_slots list and a template that drifted from it.
  const declared = Array.isArray(frameworkDef.required_slots)
    ? frameworkDef.required_slots
    : [];
  const referenced = slotsInTemplate(frameworkDef.template);
  const requiredSet = new Set([...declared, ...referenced]);

  const missing = [];
  for (const slot of requiredSet) {
    const v = values[slot];
    if (v === undefined || v === null || String(v).trim() === '') {
      missing.push(slot);
    }
  }
  if (missing.length > 0) {
    throw new Error(
      'renderFramework: framework "' +
        (frameworkDef.id || 'unknown') +
        '" is missing required slot value(s): ' +
        missing.sort().join(', '),
    );
  }

  const prompt = fillSlots(frameworkDef.template, values);

  // Defence in depth: if any placeholder survived (e.g. a typo'd slot name in
  // the template that was not in the required set), fail rather than ship it.
  const leftover = slotsInTemplate(prompt);
  if (leftover.length > 0) {
    throw new Error(
      'renderFramework: framework "' +
        (frameworkDef.id || 'unknown') +
        '" left unresolved slot(s) in the rendered prompt: ' +
        leftover.sort().join(', '),
    );
  }

  return prompt;
}

// Read and parse a framework registry JSON file from disk.
function loadRegistry(registryPath) {
  if (!registryPath || typeof registryPath !== 'string') {
    throw new Error('loadRegistry: registryPath must be a non-empty string');
  }
  const raw = fs.readFileSync(registryPath, 'utf8');
  const parsed = JSON.parse(raw);
  if (!parsed || !Array.isArray(parsed.frameworks)) {
    throw new Error(
      'loadRegistry: registry at ' +
        registryPath +
        ' must have a `frameworks` array',
    );
  }
  return parsed;
}

// Look up a single framework definition by id (case-insensitive). Returns the
// definition object, or undefined when the id is absent.
function getFramework(registry, id) {
  if (!registry || !Array.isArray(registry.frameworks)) return undefined;
  if (id === undefined || id === null) return undefined;
  const want = String(id).toLowerCase();
  return registry.frameworks.find(
    (f) => f && String(f.id).toLowerCase() === want,
  );
}

module.exports = {
  renderFramework,
  loadRegistry,
  getFramework,
  DEFAULT_CONSTRAINTS,
};
