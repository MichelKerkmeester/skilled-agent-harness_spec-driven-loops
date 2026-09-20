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
  // Hermes has no print flag; its headless forms are `hermes chat` with a query flag and
  // the top-level `-z` oneshot.
  /\bhermes\s+chat\b(?:[^|;&]*\s)?(?:-q|--query|--query-file|--oneshot)\b/,
  /\bhermes\s+(?:[^|;&]*\s)?-z\b/,
];

const HERMES_CHAT = /\bhermes\s+chat\b/;
// Pi's headless shape, reused by the two pi-specific checks below.
const PI_PRINT = /\bpi\s+(?:[^|;&]*\s)?(?:-p|--print)\b/;
// `--query-file` is Hermes's own stdin contract: `-` reads the prompt from stdin and a
// path reads a file, and either way the run never waits on an inherited terminal stdin.
const HERMES_STDIN_HANDLED = /--query-file(\s|=)/;
// Toolsets whose presence means the run can execute commands, so `--yolo` is needed: only a
// flagged terminal or code action hits Hermes's approval gate. `file` is deliberately absent
// because ordinary file writes are never gated and a read-only leaf keeps `file` for reading.
const HERMES_WRITE_TOOLSETS = /(?:^|[\s=,])(?:terminal|coding|code_execution|browser)(?:[\s,]|$)/;
// Hermes reads files only through the `file` toolset; `search` is web search. A list without
// it yields a leaf that cannot read anything and still exits 0 with empty stdout.
const HERMES_FILE_TOOLSET = /(?:^|,)file(?:,|$)/;

// Jev's judgment shapes. `jev` has no print flag and no headless subcommand: the subcommand IS the
// dispatch, exactly as `codex exec` is for codex, so membership here is the evidence.
const JEV_JUDGMENT = /\bjev\s+(?:noul|choice|score|run)\b/;
const JEV_CHOICE = /\bjev\s+choice\b/;
const JEV_SCORE = /\bjev\s+score\b/;
const JEV_RUN = /\bjev\s+run\b/;
// `jev-mcp` is a stdio server, not a judgment: it is matched only by the rule that refuses a shell
// start, so it is deliberately absent from JEV_JUDGMENT.
const JEV_MCP = /(?:^|[\s;&|])jev-mcp(?:\s|$)/;
const JEV_CREDENTIAL_VARS = /(?:^|\s)(?:TYPESAFE_API_KEY|AI_GATEWAY_API_KEY|OPENROUTER_API_KEY|JEV_API_KEY)=[^\s]+/;
// A state flag with an inline value is the only form that does NOT read stdin; `-s -` and an
// omitted flag both read it to EOF, which is a hang when stdin is an inherited terminal.
const JEV_INLINE_STATE = /(?:^|\s)(?:-s|--state)(?:\s+|=)(?!(?:-|$))[^\s"']+/;

/** Count repeatable `-o`/`-l` occurrences: the CLI accepts one, a choice or a scale needs two. */
function repeatedFlagCount(command, names) {
  const pattern = new RegExp(`(?:^|\\s)(?:${names})(?:\\s+|=)`, 'g');
  return (command.match(pattern) || []).length;
}

// Some checks have a legitimate negative control: a scenario proving the refusal exists must
// issue the shape that gets refused. Testing the delegation guard needs the delegation
// toolset; proving a read-nothing leaf needs no reader; proving the approval gate needs a
// write toolset without the approval flag. Without a way to say so, those scenarios are
// permanently un-runnable, and an operator who cannot run the guard's own proof stops
// trusting the guard. The marker is an explicit env prefix, so it cannot appear by accident
// and `grep` finds every use.
const NEGATIVE_CONTROL = /(?:^|\s)SPECKIT_DISPATCH_NEGATIVE_CONTROL=1(?:\s|$)/;

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
    if (/\|\s*(?:[A-Z_]+=\S+\s+)*(?:opencode\s+run|pi|claude|codex|devin|cursor-agent|hermes)\b/.test(cmd)) return true;
    // Hermes reads its prompt through --query-file (a path, or `-` for stdin), never waiting on a terminal.
    if (HERMES_CHAT.test(cmd) && HERMES_STDIN_HANDLED.test(cmd)) return true;
    return false;
  },
  // Without an explicit model the run falls back to the configured default; when that
  // provider is out of quota the 429 retries forever and emits nothing, which looks
  // exactly like a deadlock.
  'explicit-model-required': (cmd) => {
    if (!/\bopencode\s+run\b/.test(cmd)) return true; // not the dispatch shape → n/a
    return /(^|\s)(-m|--model)(\s|=)/.test(cmd);
  },
  // A bare top-level `--agent general` is rejected by opencode at runtime. Both spellings
  // count: `--agent=general` reached the runtime unflagged while `--agent general` did not.
  'no-bare-agent-general': (cmd) => !/--agent(?:\s+|=)general(\s|$)/.test(cmd),
  // A slash-command-shaped prompt needs --command, else opencode delivers it as raw prose
  // and the wrong task runs with no error. The prompt need not be quoted to be a prompt.
  'command-flag-for-slash-prompt': (cmd) => {
    const slashPrompt = /(?:["']|\s)\s*\/[a-z0-9]+:[a-z0-9-]+/i.test(cmd);
    if (!slashPrompt) return true;
    return /--command(\s|=)/.test(cmd);
  },
  // --share publishes the session; flag for confirmation (advisory — can't verify consent
  // here). `--share=<value>` publishes exactly as the bare flag does.
  'share-requires-confirmation': (cmd) => !/--share(?:\s|=|$)/.test(cmd),
  // The four availability rules below were declared with `severity: error` but had no
  // implementation, so they never refused anything. Each answers one question: does the
  // binary this command invokes actually resolve on PATH? Anything uncertain passes —
  // a guard that cannot see PATH must not invent a refusal.
  // Pi's startup network probes are not bounded by the dispatch timeout: a non-interactive
  // run without --offline hung past two minutes in the packet's own live probe, which reads
  // as a slow model rather than a stalled startup.
  'pi-offline-required': (cmd) => !PI_PRINT.test(cmd) || /(^|\s)--offline(\s|$)/.test(cmd),
  // Pi resolves a bare model id against its own default provider, so an unqualified selector
  // silently runs a different provider's model instead of failing. The gateway needs the
  // two-segment `provider/model` form and 400s without it.
  'pi-provider-qualified-model': (cmd) => {
    if (!PI_PRINT.test(cmd)) return true;
    const model = cmd.match(/(?:^|\s)(?:-m|--model)(?:\s+|=)([^\s"']+)/);
    if (!model) return true; // absence is the availability/model rule's business, not this one
    return model[1].includes('/');
  },
  'command-v-codex-required': binaryOnPathCheck('codex', /\bcodex\s+/),
  'command-v-cursor-agent-required': binaryOnPathCheck('cursor-agent', /\bcursor-agent\s+/),
  'command-v-devin-required': binaryOnPathCheck('devin', /\bdevin\s+/),
  'command-v-pi-required': binaryOnPathCheck('pi', /\bpi\s+/),
  'command-v-hermes-required': binaryOnPathCheck('hermes', /\bhermes\s+/),
  // A headless `hermes chat` without --yolo blocks any tool call Hermes flags as dangerous
  // (nobody is present to approve it), so a run given a write-capable toolset could fail a
  // flagged step mid-task. Ordinary writes run either way; read-only runs (no write toolset
  // named) are the intended --yolo-less shape and pass.
  'hermes-yolo-required-for-writes': (cmd) => {
    if (!HERMES_CHAT.test(cmd)) return true;
    if (NEGATIVE_CONTROL.test(cmd)) return true; // a scenario proving the gate must trip it
    const toolsets = cmd.match(/(?:^|\s)(?:-t|--toolsets)(?:\s+|=)([^\s]+)/);
    if (!toolsets) return true; // no explicit list: the toolset rule reports that case
    if (!HERMES_WRITE_TOOLSETS.test(toolsets[1])) return true;
    return /(^|\s)--yolo(\s|$)/.test(cmd);
  },
  // Without --ignore-rules Hermes injects SOUL.md, its memories, session search and the CWD
  // instruction files into the leaf prompt, bleeding prior sessions into the task.
  // A live A/B under --ignore-rules proved the skill preload survives the flag: with -s the
  // session quoted the preloaded text, without it the same prompt returned no preload. The
  // former carve-out for -s therefore sanctioned the exact context bleed this rule prevents.
  'hermes-ignore-rules-required': (cmd) => !HERMES_CHAT.test(cmd)
    || /(^|\s)--ignore-rules(\s|$)/.test(cmd),
  // Hermes's stock roster enables `delegation` and `memory`; a leaf must name its toolsets and
  // leave both out, or it can spawn sub-agents outside the runner's boundary and write memories.
  'hermes-explicit-toolsets-required': (cmd) => {
    if (!HERMES_CHAT.test(cmd)) return true;
    if (NEGATIVE_CONTROL.test(cmd)) return true; // a scenario proving the refusal must trip it
    const toolsets = cmd.match(/(?:^|\s)(?:-t|--toolsets)(?:\s+|=)([^\s]+)/);
    if (!toolsets) return false;
    if (/(?:^|,)(?:delegation|memory)(?:,|$)/.test(toolsets[1])) return false;
    return HERMES_FILE_TOOLSET.test(toolsets[1]);
  },
  // --worktree runs `git worktree add` inside the repository, which the fan-out
  // write-containment guard attributes to the lineage and reverts.
  'hermes-no-worktree-flag': (cmd) => !HERMES_CHAT.test(cmd) || !/(^|\s)--worktree(\s|$)/.test(cmd),
  // MCP servers are configured only in the user-level config; a dispatch that adds one is
  // performing an operator step, not a task.
  'hermes-mcp-config-operator-required': (cmd) => !/\bhermes\s+mcp\s+(?:add|remove|rm|install)\b/.test(cmd),
  // Shell hooks are user-level with a consent allowlist; --accept-hooks blesses whatever the
  // operator's config declares, so a dispatch never passes it.
  'hermes-hooks-user-level': (cmd) => !/\bhermes\b/.test(cmd) || !/(^|\s)--accept-hooks(\s|$)/.test(cmd),
  // Jev reads its state from stdin by default, so a dispatch that neither passes an inline state
  // nor redirects stdin blocks on a terminal that will never produce the EOF it waits for.
  'jev-stdin-bounded': (cmd) => {
    if (!JEV_JUDGMENT.test(cmd)) return true;
    const fromStdin = JEV_RUN.test(cmd)
      ? /\bjev\s+run\s+-(?:\s|$)/.test(cmd)
      : !JEV_INLINE_STATE.test(cmd);
    if (!fromStdin) return true;
    if (STDIN_REDIRECT.test(cmd)) return true;
    return /\|\s*(?:[A-Z_]+=\S+\s+)*jev\b/.test(cmd);
  },
  // One option is not a choice. The CLI sends it anyway, so the guard is the only surface that
  // refuses it before a model is billed to confirm the only answer available.
  'jev-choice-option-cardinality': (cmd) => !JEV_CHOICE.test(cmd)
    || repeatedFlagCount(cmd, '-o|--option') >= 2,
  // One level is not a scale: the returned zero-based position carries no information.
  'jev-score-level-cardinality': (cmd) => !JEV_SCORE.test(cmd)
    || repeatedFlagCount(cmd, '-l|--level') >= 2,
  // `--value` prints a single primary answer, which a batched request does not have; the CLI only
  // reports the conflict after the call succeeds, so the guard is the cheap refusal.
  'jev-value-not-with-run': (cmd) => !JEV_RUN.test(cmd)
    || !/(?:^|\s)--value(?:\s|$)/.test(cmd),
  // A proxy bearer travels to whatever endpoint the flag names, and the endpoint is also the one
  // value the CLI validates first, so an unnamed endpoint is a command that cannot run at all.
  'jev-custom-endpoint-required': (cmd) => {
    if (!JEV_JUDGMENT.test(cmd)) return true;
    if (!/(?:^|\s)--provider(?:\s+|=)custom(?:\s|$)/.test(cmd)) return true;
    return /(?:^|\s)--endpoint(?:\s|=)/.test(cmd) || /JEV_ENDPOINT=/.test(cmd);
  },
  // Shell history, process arguments and transcripts all retain an inline key, and the CLI's own
  // credential store exists precisely so the value never appears on a command line.
  'jev-no-inline-credential': (cmd) => {
    if (!JEV_JUDGMENT.test(cmd) && !JEV_MCP.test(cmd)) return true;
    return !JEV_CREDENTIAL_VARS.test(cmd);
  },
  // stdout is a JSON-RPC frame stream, so a hand-started server writes frames into the transcript
  // and answers nothing; only a host that speaks the protocol should own the process.
  'jev-mcp-host-only': (cmd) => !JEV_MCP.test(cmd),
  'command-v-jev-required': binaryOnPathCheck('jev', /\bjev\s+/),
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
