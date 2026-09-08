// Dependency-free dispatch hard-rule engine.
//
// Reads the `hard_rules:` frontmatter a dispatch skill declares in its SKILL.md and evaluates
// each rule against a composed shell command BEFORE it is spawned. Used by the PreToolUse
// preflight hook (manual/ad-hoc dispatch) and available to the fan-out in-process guard.
// No external deps and no daemon: the enforcement path must survive even when the advisor is
// down, so this parses just enough YAML for the flat hard_rules list rather than pulling a lib.

import fs from 'node:fs';
import path from 'node:path';

// ── Frontmatter parsing ──────────────────────────────────────────────────────

function stripQuotes(value) {
  const v = value.trim();
  if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
    return v.slice(1, -1);
  }
  return v;
}

/**
 * Extract the `hard_rules:` list from a SKILL.md's YAML frontmatter.
 * Deliberately minimal: handles the flat list-of-maps shape this contract uses
 * (`- id:` / `check:` / `message:` / `severity:`), not arbitrary YAML.
 * @param {string} text - Full SKILL.md contents.
 * @returns {Array<{id:string, check:string, message:string, severity:string}>}
 */
export function parseHardRules(text) {
  if (typeof text !== 'string') return [];
  const fmMatch = text.match(/^---\n([\s\S]*?)\n---/);
  if (!fmMatch) return [];
  const lines = fmMatch[1].split('\n');
  const start = lines.findIndex((l) => /^hard_rules:\s*$/.test(l));
  if (start === -1) return [];

  const rules = [];
  let current = null;
  for (let i = start + 1; i < lines.length; i++) {
    const line = lines[i];
    if (line.trim() === '') continue;
    // A non-indented line ends the hard_rules block.
    if (!/^\s/.test(line)) break;
    const itemMatch = line.match(/^\s*-\s+(\w+):\s*(.*)$/);
    if (itemMatch) {
      if (current) rules.push(current);
      current = {};
      current[itemMatch[1]] = stripQuotes(itemMatch[2]);
      continue;
    }
    const kvMatch = line.match(/^\s+(\w+):\s*(.*)$/);
    if (kvMatch && current) {
      current[kvMatch[1]] = stripQuotes(kvMatch[2]);
    }
  }
  if (current) rules.push(current);
  return rules.filter((r) => r.id && r.check);
}

/** Read + parse hard_rules from a SKILL.md path; returns [] on any read/parse error (fail-open). */
export function readHardRules(skillMdPath) {
  try {
    return parseHardRules(fs.readFileSync(skillMdPath, 'utf8'));
  } catch {
    return [];
  }
}

// ── Check functions (pure; each returns true when the command SATISFIES the rule) ───────────
// A check returning false means the rule is VIOLATED and should be surfaced.

const STDIN_REDIRECT = /<\s*\/dev\/null|0<\s*\/dev\/null|<<-?\s*['"]?\w|<<</; // </dev/null, heredoc, herestring

// Every headless CLI here inherits the parent terminal's stdin and can hang
// indefinitely with no output, which reads as a slow model rather than a deadlock.
// Five packets declared the stdin rule while the check only recognised `opencode run`,
// so their rule never fired; these are the print-mode shapes each one documents.
const HEADLESS_DISPATCH_SHAPES = [
  /\bopencode\s+run\b/,
  /\bpi\s+(?:[^|;&]*\s)?(?:-p|--print)\b/,
  /\bclaude\s+(?:[^|;&]*\s)?(?:-p|--print)\b/,
  /\bcodex\s+exec\b/,
  /\bdevin\s+(?:[^|;&]*\s)?-p\b/,
  /\bcursor-agent\s+(?:[^|;&]*\s)?-p\b/,
];

/**
 * Build a check that refuses a dispatch whose binary is absent from PATH.
 *
 * Fail-open by construction: it refuses only when PATH is readable AND the binary is
 * conclusively not on it. A missing PATH, an unreadable directory or any thrown error
 * resolves to a pass, because the cost of a false refusal is a blocked dispatch while
 * the cost of a false pass is the exec failure the caller would have seen anyway.
 *
 * @param {string} binary
 * @param {RegExp} shape - matches commands that actually invoke the binary
 * @returns {(cmd: string) => boolean}
 */
function binaryOnPathCheck(binary, shape) {
  return (cmd) => {
    if (!shape.test(cmd)) return true; // command does not invoke it → n/a
    const rawPath = process.env.PATH;
    if (!rawPath) return true; // nothing to resolve against → cannot refuse
    for (const dir of rawPath.split(path.delimiter)) {
      if (!dir) continue;
      try {
        fs.accessSync(path.join(dir, binary), fs.constants.X_OK);
        return true;
      } catch {
        // Not here, or not executable here. Keep looking.
      }
    }
    return false;
  };
}

export const CHECKS = {
  // A headless dispatch must close/redirect stdin or it can inherit an open stdin
  // and hang at 0% CPU, emitting nothing at all.
  'stdin-redirect-required': (cmd) => {
    if (!HEADLESS_DISPATCH_SHAPES.some((shape) => shape.test(cmd))) return true; // not a dispatch shape → n/a
    if (STDIN_REDIRECT.test(cmd)) return true; // stdin handled
    // A pipe feeding the CLI (`... | opencode run`) also closes inherited stdin.
    if (/\|\s*(?:[A-Z_]+=\S+\s+)*(?:opencode\s+run|pi|claude|codex|devin|cursor-agent)\b/.test(cmd)) return true;
    return false;
  },
  // Without an explicit model the run falls back to the configured default; when that
  // provider is out of quota the 429 retries forever and emits nothing, which looks
  // exactly like a deadlock.
  'explicit-model-required': (cmd) => {
    if (!/\bopencode\s+run\b/.test(cmd)) return true; // not the dispatch shape → n/a
    return /(^|\s)(-m|--model)(\s|=)/.test(cmd);
  },
  // A bare top-level `--agent general` is rejected by opencode at runtime.
  'no-bare-agent-general': (cmd) => !/--agent\s+general(\s|$)/.test(cmd),
  // A slash-command-shaped prompt needs --command, else opencode delivers it as raw prose.
  'command-flag-for-slash-prompt': (cmd) => {
    const slashPrompt = /(["'])\s*\/[a-z0-9]+:[a-z0-9-]+/i.test(cmd); // "/family:name ...
    if (!slashPrompt) return true;
    return /--command(\s|=)/.test(cmd);
  },
  // --share publishes the session; flag for confirmation (advisory — can't verify consent here).
  'share-requires-confirmation': (cmd) => !/--share(\s|$)/.test(cmd),
  // The four availability rules below were declared with `severity: error` but had no
  // implementation, so they never refused anything. Each answers one question: does the
  // binary this command invokes actually resolve on PATH? Anything uncertain passes —
  // a guard that cannot see PATH must not invent a refusal.
  'command-v-codex-required': binaryOnPathCheck('codex', /\bcodex\s+/),
  'command-v-cursor-agent-required': binaryOnPathCheck('cursor-agent', /\bcursor-agent\s+/),
  'command-v-devin-required': binaryOnPathCheck('devin', /\bdevin\s+/),
  'command-v-pi-required': binaryOnPathCheck('pi', /\bpi\s+/),
  // Non-interactive claude -p with a Bash-heavy prompt and no permission bypass can deadlock.
  'non-interactive-permission-mode-risk': (cmd) => {
    if (!/\bclaude\s+-p\b|\bclaude\s+--print\b/.test(cmd)) return true;
    return /--dangerously-skip-permissions|--permission-mode\s+bypassPermissions/.test(cmd);
  },
};

export const KNOWN_CHECKS = Object.keys(CHECKS);

/**
 * Evaluate a skill's hard_rules against a command string.
 *
 * The optional third argument lets a caller supply its own check registry and a context object
 * describing state the command has not yet touched. Dispatch rules are answerable from the
 * command text alone, but rules about a *repository* are not: whether `git reset` is worth a
 * word depends entirely on whether the commit actually moves. Checks receive the context as a
 * second parameter, which the command-only checks above simply ignore.
 *
 * @param {string} command
 * @param {Array<object>} rules
 * @param {{checks?:object, context?:object}} [options]
 * @returns {Array<{id,severity,message,check,passed:boolean}>} only the VIOLATED rules.
 */
export function evaluate(command, rules, options = {}) {
  const registry = options.checks || CHECKS;
  const context = options.context;
  const violations = [];
  for (const rule of rules) {
    const fn = registry[rule.check];
    if (!fn) continue; // unknown check → skip (the CI validator catches typos, not this hot path)
    let passed = true;
    try {
      passed = fn(String(command || ''), context);
    } catch {
      passed = true; // a check that throws must never block a dispatch (fail-open)
    }
    if (!passed) {
      // A rule that declares itself blocking (`block` or the stronger `error`
      // the availability/self-invocation guards use) denies the dispatch;
      // everything else is advisory. A skill's own SKILL.md severity is the
      // source of truth here.
      const blocking = rule.severity === 'block' || rule.severity === 'error';
      violations.push({
        id: rule.id,
        severity: blocking ? 'block' : 'warn',
        message: rule.message || rule.id,
        check: rule.check,
        passed: false,
      });
    }
  }
  return violations;
}
