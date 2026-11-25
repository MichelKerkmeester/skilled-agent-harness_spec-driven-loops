#!/usr/bin/env node
'use strict';

// Compiled-route hub registry reader.
//
// The set of hubs that may serve a compiled route is data, not code: one ordered
// registry file beside the runtime closure names each hub, the rollout folder that
// holds its compiled policy and engine, and whether it joins the default-on cohort.
// The engine-dispatch map, the resolver's default-on cohort, the sync tool and the
// freshness guard all derive their hub lists from it, so adding a hub is a rollout
// folder plus one registry entry, with no code edit.
//
// A malformed registry is refused with an error naming the file rather than read
// leniently: a silently dropped entry would quietly route that hub legacy.
//
// The advisor keeps a dependency-free twin of these rules in TypeScript; both are
// held to the same shared fixture, so change them together.

const fs = require('fs');
const path = require('path');

// The registry sits at the root of the closure this module ships in, so the
// authored and the promoted trees each read their own copy.
const REGISTRY_FILE = path.resolve(__dirname, '..', '..', 'hub-registry.json');
const SCHEMA_VERSION = 'V1';
const ROLLOUT_PARENT = '009-parent-hub-rollout';
// Same rule as the activation store's canonical hub id. Duplicated rather than
// required: the manifest library sits outside this closure, and a relative require
// would resolve differently in the authored tree.
const HUB_ID_PATTERN = /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/;

function refuse(file, reason) {
  return new Error(`invalid compiled-route hub registry ${file}: ${reason}`);
}

/**
 * Parse and validate registry text.
 *
 * @param {string} text - Registry file contents.
 * @param {string} file - Path named in any refusal.
 * @returns {ReadonlyArray<{id: string, rolloutChild: string, defaultOn: boolean}>}
 *   Frozen hub entries in registry order.
 */
function parseHubRegistry(text, file) {
  let registry;
  try {
    registry = JSON.parse(text);
  } catch {
    throw refuse(file, 'the file is not valid JSON');
  }
  if (!registry || typeof registry !== 'object' || Array.isArray(registry)) {
    throw refuse(file, 'the registry must be a JSON object');
  }
  if (registry.schemaVersion !== SCHEMA_VERSION) {
    throw refuse(file, `schemaVersion must be "${SCHEMA_VERSION}"`);
  }
  if (!Array.isArray(registry.hubs)) throw refuse(file, 'hubs must be an array');
  const seen = new Set();
  const hubs = registry.hubs.map((entry, index) => {
    if (!entry || typeof entry !== 'object' || Array.isArray(entry)) {
      throw refuse(file, `hub entry ${index} must be an object`);
    }
    const { id, rolloutChild, defaultOn } = entry;
    if (typeof id !== 'string' || !HUB_ID_PATTERN.test(id)) {
      throw refuse(file, `hub id ${JSON.stringify(id)} is not canonical hyphen-case`);
    }
    if (seen.has(id)) throw refuse(file, `duplicate hub id "${id}"`);
    seen.add(id);
    // The id is hyphen-case, so it carries no pattern metacharacters, and the
    // anchored shape keeps the folder a direct child of the rollout parent.
    if (typeof rolloutChild !== 'string'
      || !new RegExp(`^${ROLLOUT_PARENT}/\\d{3}-${id}$`).test(rolloutChild)) {
      throw refuse(file, `rolloutChild for "${id}" must be ${ROLLOUT_PARENT}/<NNN>-${id}`);
    }
    if (typeof defaultOn !== 'boolean') {
      throw refuse(file, `defaultOn for "${id}" must be a boolean`);
    }
    return Object.freeze({ id, rolloutChild, defaultOn });
  });
  return Object.freeze(hubs);
}

/**
 * Read and validate a registry file.
 *
 * @param {string} [file] - Registry path; defaults to this closure's registry.
 * @returns {ReadonlyArray<{id: string, rolloutChild: string, defaultOn: boolean}>}
 */
function loadHubRegistry(file = REGISTRY_FILE) {
  let text;
  try {
    text = fs.readFileSync(file, 'utf8');
  } catch (error) {
    throw refuse(file, `the file cannot be read (${error && error.code ? error.code : 'read failed'})`);
  }
  return parseHubRegistry(text, file);
}

module.exports = {
  HUB_ID_PATTERN,
  REGISTRY_FILE,
  loadHubRegistry,
  parseHubRegistry,
};
