// Dependency-free dispatch hard-rule engine.
//
// Reads the `hard_rules:` frontmatter a dispatch skill declares in its SKILL.md and evaluates
// each rule against a composed shell command BEFORE it is spawned. Used by the PreToolUse
// preflight hook (manual/ad-hoc dispatch) and available to the fan-out in-process guard.
// No external deps and no daemon: the enforcement path must survive even when the advisor is
// down, so this parses just enough YAML for the flat hard_rules list rather than pulling a lib.

import fs from 'node:fs';

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

export const CHECKS = {
  // opencode run must close/redirect stdin or it can inherit an open stdin and hang at 0% CPU.
  'stdin-redirect-required': (cmd) => {
    if (!/\bopencode\s+run\b/.test(cmd)) return true; // not the dispatch shape → n/a
    if (STDIN_REDIRECT.test(cmd)) return true; // stdin handled
    // A pipe feeding opencode (`... | opencode run`) also closes inherited stdin.
    if (/\|\s*(AI_SESSION_CHILD=\S+\s+)?opencode\s+run\b/.test(cmd)) return true;
    return false;
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
  // Non-interactive claude -p with a Bash-heavy prompt and no permission bypass can deadlock.
  'non-interactive-permission-mode-risk': (cmd) => {
    if (!/\bclaude\s+-p\b|\bclaude\s+--print\b/.test(cmd)) return true;
    return /--dangerously-skip-permissions|--permission-mode\s+bypassPermissions/.test(cmd);
  },
};

export const KNOWN_CHECKS = Object.keys(CHECKS);

/**
 * Evaluate a skill's hard_rules against a command string.
 * @returns {Array<{id,severity,message,check,passed:boolean}>} only the VIOLATED rules.
 */
export function evaluate(command, rules) {
  const violations = [];
  for (const rule of rules) {
    const fn = CHECKS[rule.check];
    if (!fn) continue; // unknown check → skip (the CI validator catches typos, not this hot path)
    let passed = true;
    try {
      passed = fn(String(command || ''));
    } catch {
      passed = true; // a check that throws must never block a dispatch (fail-open)
    }
    if (!passed) {
      violations.push({
        id: rule.id,
        severity: rule.severity === 'block' ? 'block' : 'warn',
        message: rule.message || rule.id,
        check: rule.check,
        passed: false,
      });
    }
  }
  return violations;
}
