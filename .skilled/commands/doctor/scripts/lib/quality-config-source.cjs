// ───────────────────────────────────────────────────────────────────
// MODULE: sk-code Quality Config Source
// ───────────────────────────────────────────────────────────────────
'use strict';

// Where the repository quality config came from, whether the runner trusts it, and
// which core hygiene rules it switches off. Every mode asks these questions before it
// asks anything else, because a config that did not validate names no check for the
// run, and a config the runner does not trust changes nothing the gate would do.
//
// Every answer here is read through the module the quality gate itself reads, never
// re-derived, so a doctor verdict and a gate verdict cannot drift apart.

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const fs = require('node:fs');
const path = require('node:path');

const { TRUST_REPAIR, checkTrust, qualityConfig } = require('./quality-skill-paths.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. DISCOVERY
// ─────────────────────────────────────────────────────────────────────────────

// Discovery faults and schema faults both come back as one list, so status and check
// report them the same way.
function load(ctx, opts) {
  try {
    return qualityConfig.loadConfig({
      cliPath: opts.config, cwd: ctx.cwd, root: ctx.root, git: true, env: ctx.env, defaults: ctx.defaults,
      builtinIds: ctx.builtinIds,
    });
  } catch (error) {
    if (!(error instanceof qualityConfig.ConfigError)) throw error;
    return { source: error.source || null, scope: error.scope || null, path: error.path || null, display: error.path || null, bytes: null, raw: null,
      errors: [{ code: error.code, field: '', message: error.message }], merged: null };
  }
}

// A committed file that named another repository applied to nothing, and the line says
// which file and which two repositories, so the status does not read as unconfigured.
function describeSource(loaded, root) {
  if (loaded.ignored) {
    const where = qualityConfig.displayPath(loaded.ignored.path, root);
    return `none; ignored ${where}, written for ${loaded.ignored.repository}, this repository is ${loaded.ignored.current || 'unknown'}`;
  }
  if (loaded.source === 'none') return 'none, the gate runs its built-in checks alone';
  return `${loaded.display} (${loaded.source}${loaded.bytes === null ? '' : `, ${loaded.bytes} bytes`})`;
}

function errorCode(loaded) {
  const named = loaded.errors.find((entry) => entry.code === 'CONFIG_PATH_MISSING' || entry.code === 'CONFIG_LEGACY_LOCATION');
  return named ? named.code : 'CONFIG_INVALID';
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. TRUST
// ─────────────────────────────────────────────────────────────────────────────

// The doctor reads the same trust rule the runner applies, so the state it reports is
// the state the gate would act on. A config that did not validate names no check for
// this run.
function trustState(loaded, ctx) {
  if (loaded.errors.length > 0) {
    const missing = loaded.errors.some((entry) => entry.code === 'CONFIG_PATH_MISSING' || entry.code === 'CONFIG_LEGACY_LOCATION');
    const reason = missing ? 'the config could not be read, so no configured check runs' : 'the config did not validate, so no configured check runs';
    return { checks: 'none', reason, repair: null };
  }
  const merged = loaded.merged;
  const configured = merged ? merged.checks.length + merged.generated.filter((row) => row.layer === 'repo').length : 0;
  const trust = checkTrust({ git: true, root: ctx.root, env: ctx.env, source: loaded.source, scope: loaded.scope, value: loaded.value, configured });
  return { ...trust, repair: trust.checks === 'untrusted' ? TRUST_REPAIR : null };
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. HYGIENE RULES
// ─────────────────────────────────────────────────────────────────────────────

// The core hygiene rules the config switches off, named the way the gate's verdict
// names them. A config that did not validate switches nothing off, because the gate
// refuses it.
function disabledHygieneRules(loaded) {
  return loaded.merged ? loaded.merged.commentHygiene.disableRules.map((rule) => `hygiene.${rule}`) : [];
}

// A repository with no specs/ folder has none of the planning artifacts the spec-kit
// vocabulary rules point at, so init offers to switch them off. It only offers: the
// config it writes keeps every rule on until someone adds the list.
function hygieneSuggestion(root) {
  if (fs.existsSync(path.join(root, 'specs'))) return null;
  return {
    field: 'commentHygiene.disableRules',
    rules: [...qualityConfig.SPEC_KIT_HYGIENE_RULES],
    reason: 'the repository has no specs/ folder, so the spec-kit vocabulary rules have nothing to point at',
    applied: false,
  };
}

/**
 * The core rules the checker would apply, read from its own table, and the ones the
 * config switches off. A config the gate refuses applies none of them.
 */
function appliedHygiene(loaded) {
  if (loaded.errors.length > 0) return null;
  const disabled = disabledHygieneRules(loaded);
  try {
    const active = qualityConfig.readHygieneRules().map((rule) => `hygiene.${rule}`).filter((id) => !disabled.includes(id));
    return { active, disabled, error: null };
  } catch (error) {
    return { active: null, disabled, error: error.message };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  appliedHygiene,
  describeSource,
  disabledHygieneRules,
  errorCode,
  hygieneSuggestion,
  load,
  trustState,
};
