#!/usr/bin/env node
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ COMPONENT: PreToolUse Message Contract Gate                              ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ PURPOSE: Refuse a commit message, PR description or new branch name     ║
// ║          that breaks the repository's own templates before it runs.     ║
// ╚══════════════════════════════════════════════════════════════════════════╝
//
// The commit-msg and pre-push hooks catch a bad message after the agent has acted, and a PR
// description never passes through a git hook at all. This gate reads the shell command an agent
// is about to run and checks what it can see: the -m / -F message of `git commit`, the --body or
// --body-file of `gh pr create` / `gh pr edit`, and the name a branch-creating command would make.
//
// It blocks only on a violation it can see. A command it cannot parse, a body it cannot read or a
// repository without a contract is allowed, because the commit-msg hook, the pre-push hook and the
// CI check still stand behind it; refusing what it cannot read would block legitimate work while
// adding no guarantee. There is no suppression switch.
//
// One file serves Claude (`Bash`), Codex and Devin (`exec`) and Cursor (`Shell`). Cursor takes a
// different deny envelope, chosen from the payload shape.

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

import {
  ContractError,
  loadContract,
  validateBranch,
  validateCommit,
  validatePrBody,
} from '../lib/message-contract.mjs';

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

// Cheap pre-filter so unrelated shell commands never pay for parsing.
const INTERESTING = /\b(git|gh)\b/;

// `git branch` flags that mean something other than "create a branch".
const BRANCH_NON_CREATE = new Set(['-d', '-D', '--delete', '-c', '-C', '--copy', '-l', '--list', '-a', '--all', '-r', '--remotes', '-v', '-vv', '--verbose', '--show-current', '--contains', '--no-contains', '--merged', '--no-merged', '-u', '--set-upstream-to', '--unset-upstream', '--edit-description', '--points-at', '--sort', '--format', '--column', '--no-column']);

// ─────────────────────────────────────────────────────────────────────────────
// 3. SHELL PARSING
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Replace `"$(cat <<'EOF' … EOF\n)"` with a quoted literal, the form agents use for multi-line
 * messages and PR bodies. Everything after this is ordinary quoting.
 */
function inlineHeredocs(command) {
  const literal = (text) => `'${text.replace(/'/g, "'\\''")}'`;
  return command.replace(
    /"?\$\(\s*cat\s+<<-?\s*(['"]?)([A-Za-z_][A-Za-z0-9_]*)\1[^\n]*\n([\s\S]*?)\n[ \t]*\2[ \t]*\n?\s*\)"?/g,
    (_, _q, _tag, body) => literal(body),
  );
}

/**
 * Split a command line into words and control operators, honouring single quotes, double quotes
 * and backslash escapes. Returns null on anything it does not understand (unbalanced quotes,
 * substitutions it cannot evaluate), and the caller then allows the command.
 */
function tokenize(command) {
  const tokens = [];
  let word = null;
  let i = 0;
  const push = () => {
    if (word !== null) tokens.push({ word });
    word = null;
  };
  while (i < command.length) {
    const c = command[i];
    if (c === "'") {
      const end = command.indexOf("'", i + 1);
      if (end === -1) return null;
      word = (word ?? '') + command.slice(i + 1, end);
      i = end + 1;
    } else if (c === '"') {
      let j = i + 1;
      let text = '';
      while (j < command.length && command[j] !== '"') {
        if (command[j] === '\\' && j + 1 < command.length && '"\\$`\n'.includes(command[j + 1])) {
          if (command[j + 1] !== '\n') text += command[j + 1];
          j += 2;
          continue;
        }
        // A substitution inside the quotes is a value only the shell can compute.
        if (command[j] === '`' || (command[j] === '$' && /[({A-Za-z_]/.test(command[j + 1] || ''))) return null;
        text += command[j];
        j += 1;
      }
      if (j >= command.length) return null;
      word = (word ?? '') + text;
      i = j + 1;
    } else if (c === '\\') {
      if (command[i + 1] === '\n') {
        i += 2;
        continue;
      }
      word = (word ?? '') + (command[i + 1] ?? '');
      i += 2;
    } else if (/\s/.test(c)) {
      push();
      if (c === '\n') tokens.push({ op: ';' });
      i += 1;
    } else if ('&|;()'.includes(c)) {
      push();
      const two = command.slice(i, i + 2);
      if (two === '&&' || two === '||') {
        tokens.push({ op: two });
        i += 2;
      } else {
        tokens.push({ op: c });
        i += 1;
      }
    } else if (c === '`' || (c === '$' && /[({]/.test(command[i + 1] || ''))) {
      return null;
    } else {
      word = (word ?? '') + c;
      i += 1;
    }
  }
  push();
  return tokens;
}

/** Group tokens into simple commands, each an array of words. */
function simpleCommands(tokens) {
  const commands = [];
  let current = [];
  for (const t of tokens) {
    if (t.op) {
      if (current.length) commands.push(current);
      current = [];
    } else current.push(t.word);
  }
  if (current.length) commands.push(current);
  return commands;
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. COMMAND READERS
// ─────────────────────────────────────────────────────────────────────────────

/** Strip leading `VAR=value` assignments and return the rest. */
function stripAssignments(words) {
  let i = 0;
  while (i < words.length && /^[A-Za-z_][A-Za-z0-9_]*=/.test(words[i])) i += 1;
  return words.slice(i);
}

/** For `git [-C dir] [-c k=v] <sub> …`, return { dir, sub, args } or null. */
function readGit(words, cwd) {
  if (words[0] !== 'git') return null;
  let dir = cwd;
  let i = 1;
  while (i < words.length && words[i].startsWith('-')) {
    if (words[i] === '-C') {
      dir = path.resolve(dir, words[i + 1] || '.');
      i += 2;
    } else if (words[i] === '-c' || words[i] === '--git-dir' || words[i] === '--work-tree') i += 2;
    else i += 1;
  }
  if (i >= words.length) return null;
  return { dir, sub: words[i], args: words.slice(i + 1) };
}

function optionValue(args, i, short, long) {
  const a = args[i];
  if (a === short || a === long) return { value: args[i + 1], next: i + 2 };
  if (long && a.startsWith(`${long}=`)) return { value: a.slice(long.length + 1), next: i + 1 };
  if (short && a.length > 2 && a.startsWith(short) && !a.startsWith('--')) return { value: a.slice(short.length), next: i + 1 };
  return null;
}

/** The message `git commit` would be given, or null when it opens an editor or reuses one. */
function commitMessage(args, dir) {
  const parts = [];
  let fromFile = null;
  for (let i = 0; i < args.length;) {
    const m = optionValue(args, i, '-m', '--message');
    if (m) {
      if (m.value === undefined) return null;
      parts.push(m.value);
      i = m.next;
      continue;
    }
    const f = optionValue(args, i, '-F', '--file');
    if (f) {
      if (f.value === undefined || f.value === '-') return null;
      fromFile = path.resolve(dir, f.value);
      i = f.next;
      continue;
    }
    if (/^(-C|-c|--reuse-message|--reedit-message|--fixup|--squash)(=|$)/.test(args[i])) return null;
    i += 1;
  }
  if (fromFile) {
    try {
      return fs.readFileSync(fromFile, 'utf8');
    } catch {
      return null;
    }
  }
  return parts.length ? parts.join('\n\n') : null;
}

/** The PR body `gh pr create|edit` would send, or null when it cannot be seen. */
function prBody(words, cwd) {
  if (words[0] !== 'gh' || words[1] !== 'pr' || !['create', 'edit'].includes(words[2])) return null;
  const args = words.slice(3);
  let dir = cwd;
  for (let i = 0; i < args.length;) {
    const r = optionValue(args, i, '-R', '--repo');
    if (r) {
      // A different repository's contract is not the one checked out here.
      return null;
    }
    const b = optionValue(args, i, '-b', '--body');
    if (b) return b.value === undefined ? null : { body: b.value, dir };
    const f = optionValue(args, i, '-F', '--body-file');
    if (f) {
      if (f.value === undefined || f.value === '-') return null;
      try {
        return { body: fs.readFileSync(path.resolve(dir, f.value), 'utf8'), dir };
      } catch {
        return null;
      }
    }
    i += 1;
  }
  return null;
}

/** Branch names a git command would create, each with the worktree path when there is one. */
function createdBranches(git) {
  const { sub, args } = git;
  const positional = (list) => list.filter((a) => !a.startsWith('-'));
  if (sub === 'checkout' || sub === 'switch') {
    const flags = sub === 'checkout' ? ['-b', '-B'] : ['-c', '-C', '--create', '--force-create'];
    for (let i = 0; i < args.length; i += 1) {
      if (flags.includes(args[i]) && args[i + 1]) return [{ name: args[i + 1] }];
      const eq = flags.find((fl) => fl.startsWith('--') && args[i].startsWith(`${fl}=`));
      if (eq) return [{ name: args[i].slice(eq.length + 1) }];
    }
    return [];
  }
  if (sub === 'branch') {
    if (args.some((a) => BRANCH_NON_CREATE.has(a.split('=')[0]))) return [];
    const rename = args.findIndex((a) => ['-m', '-M', '--move'].includes(a));
    if (rename !== -1) {
      const names = positional(args.slice(rename + 1));
      return names.length ? [{ name: names[names.length - 1] }] : [];
    }
    const names = positional(args.filter((a, i) => !['-t', '--track'].includes(args[i - 1] || '')));
    return names.length ? [{ name: names[0] }] : [];
  }
  if (sub === 'worktree' && args[0] === 'add') {
    const rest = args.slice(1);
    let name = null;
    const plain = [];
    for (let i = 0; i < rest.length; i += 1) {
      if (['-b', '-B'].includes(rest[i])) {
        name = rest[i + 1];
        i += 1;
      } else if (!rest[i].startsWith('-')) plain.push(rest[i]);
    }
    return name ? [{ name, worktreeDir: plain[0] }] : [];
  }
  return [];
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. EVALUATION
// ─────────────────────────────────────────────────────────────────────────────

function repoRootOf(dir) {
  try {
    return execFileSync('git', ['-C', dir, 'rev-parse', '--show-toplevel'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], timeout: 3000 }).trim();
  } catch {
    return null;
  }
}

function format(label, loaded, result) {
  const lines = [`sk-git blocked this ${label}: it breaks the repository's ${label} rules.`];
  for (const e of result.errors) lines.push(`  • [${e.id}] ${e.message}`);
  if (loaded.contract.help?.expected) lines.push(`  Expected: ${loaded.contract.help.expected}`);
  lines.push(`  Rules: ${loaded.file}`);
  lines.push('  Fix the text and run the command again; there is no bypass.');
  return lines.join('\n');
}

/** Return a refusal reason for the command, or null to allow it. */
export function evaluateCommand(command, cwd) {
  if (typeof command !== 'string' || !INTERESTING.test(command)) return null;
  const tokens = tokenize(inlineHeredocs(command));
  if (!tokens) return null;

  let dir = cwd;
  for (const raw of simpleCommands(tokens)) {
    const words = stripAssignments(raw);
    if (words[0] === 'cd' && words[1]) {
      dir = path.resolve(dir, words[1]);
      continue;
    }

    const pr = prBody(words, dir);
    if (pr) {
      const root = repoRootOf(pr.dir);
      const loaded = root && loadContract(root, 'pr');
      if (loaded) {
        const result = validatePrBody(pr.body, loaded.contract);
        if (result.errors.length) return format('PR description', loaded, result);
      }
      continue;
    }

    const git = readGit(words, dir);
    if (!git) continue;
    const root = repoRootOf(git.dir);
    if (!root) continue;

    if (git.sub === 'commit') {
      const message = commitMessage(git.args, git.dir);
      const loaded = message !== null && loadContract(root, 'commit');
      if (loaded) {
        const result = validateCommit(message, loaded.contract, {
          stage: 'pre-stamp',
          specExists: (rel) => fs.existsSync(path.join(root, rel)),
        });
        if (result.errors.length) return format('commit message', loaded, result);
      }
      continue;
    }

    const branches = createdBranches(git);
    if (branches.length) {
      const loaded = loadContract(root, 'branch');
      if (!loaded) continue;
      for (const b of branches) {
        const result = validateBranch(b.name, loaded.contract, b.worktreeDir);
        if (result.errors.length) return format('branch name', loaded, result);
      }
    }
  }
  return null;
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. ENTRYPOINT
// ─────────────────────────────────────────────────────────────────────────────

async function readStdin() {
  const chunks = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  return Buffer.concat(chunks).toString('utf8');
}

function deny(payload, reason) {
  // Cursor names its shell tool `Shell` and carries workspace_roots; it takes its own envelope.
  const isCursor = String(payload?.tool_name || '').toLowerCase() === 'shell' || Array.isArray(payload?.workspace_roots);
  if (isCursor) {
    process.stdout.write(JSON.stringify({ permission: 'deny', user_message: reason, agent_message: reason }));
    process.exit(2);
  }
  process.stdout.write(JSON.stringify({
    hookSpecificOutput: { hookEventName: 'PreToolUse', permissionDecision: 'deny', permissionDecisionReason: reason },
  }));
  process.exit(0);
}

async function main() {
  let payload;
  try {
    payload = JSON.parse(await readStdin());
  } catch {
    return process.exit(0);
  }
  const tool = String(payload?.tool_name || '').toLowerCase();
  if (!['bash', 'exec', 'shell'].includes(tool)) return process.exit(0);

  const cursorRoot = payload?.workspace_roots?.[0];
  const cwd = payload?.cwd || (typeof cursorRoot === 'string' && cursorRoot.trim() ? cursorRoot : '')
    || process.env.CLAUDE_PROJECT_DIR || process.env.CODEX_PROJECT_DIR || process.cwd();

  let reason = null;
  try {
    reason = evaluateCommand(payload?.tool_input?.command, cwd);
  } catch (err) {
    // A rulebook that exists but cannot be read would block the commit anyway; say so now.
    if (err instanceof ContractError) reason = `sk-git blocked this command: the repository's rules cannot be read: ${err.message}`;
  }
  if (reason) return deny(payload, reason);
  return process.exit(0);
}

if (import.meta.url === `file://${process.argv[1]}` || process.argv[1]?.endsWith('git-message-gate.mjs')) {
  main().catch(() => process.exit(0));
}
