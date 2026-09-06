// ───────────────────────────────────────────────────────────────────
// MODULE: Hook Adapter Path Parity
// ───────────────────────────────────────────────────────────────────
//
// Every runtime hook registration (Claude, Codex, Cursor, Devin, Pi and
// OpenCode) names an adapter file by path, directly or through a shell
// command string. This suite resolves every one of those paths against the
// repository root and asserts it exists on disk, so a renamed or deleted
// adapter is caught here instead of surfacing only as a live fallback.
//
// Copilot is excluded: `.github/hooks/scripts/*` and its registration were
// removed as dead wiring (no compiled handler, no source adapter under
// `runtime/hooks/copilot/`, and no discoverable registration path for
// GitHub Copilot CLI anywhere in this repository).

import { existsSync, lstatSync, readdirSync, readFileSync, readlinkSync } from 'node:fs';
import { dirname, isAbsolute, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const repoRoot = resolve(import.meta.dirname, '..', '..', '..', '..', '..');

// Matches the primary node/bash/python invocation inside a hook command
// string, e.g. `node .opencode/.../foo.js` or `bash .opencode/bin/bar.sh`.
// A trailing `|| printf ...` fallback branch never matches this pattern
// (`printf` is not one of the three interpreters), so only the real adapter
// path is captured even out of a fallback-wrapped command.
const ADAPTER_PATH_PATTERN =
  '(?:^|[\\s;&|])(?:[\\w./~-]*/)?(?:node|bash|python3?)\\s+' +
  '(?:"([^"]+\\.(?:js|mjs|cjs|sh|py))"' +
  "|'([^']+\\.(?:js|mjs|cjs|sh|py))'" +
  '|([^\\s"\';&|<>]+\\.(?:js|mjs|cjs|sh|py)))';

interface Registration {
  runtime: string;
  event: string;
  path: string;
}

function extractAdapterPaths(command: string): string[] {
  const pattern = new RegExp(ADAPTER_PATH_PATTERN, 'g');
  const paths: string[] = [];
  for (const match of command.matchAll(pattern)) {
    const path = match[1] ?? match[2] ?? match[3];
    if (path) paths.push(path);
  }
  return paths;
}

function readJson(relativePath: string): unknown {
  return JSON.parse(readFileSync(resolve(repoRoot, relativePath), 'utf8'));
}

// Shared shape: { hooks: { <event>: [ { hooks: [ { command } ] } ] } }.
// Claude, Codex and Devin (`.devin/hooks.v1.json` is the same shape one
// level up, with no wrapping `hooks` key) all use this nesting.
function nestedCommandRegistrations(
  runtime: string,
  eventGroups: Record<string, unknown>,
): Registration[] {
  const out: Registration[] = [];
  for (const [event, groups] of Object.entries(eventGroups)) {
    if (!Array.isArray(groups)) continue;
    for (const group of groups as Array<{ hooks?: Array<{ command?: unknown }> }>) {
      for (const hook of group.hooks ?? []) {
        if (typeof hook.command !== 'string') continue;
        for (const path of extractAdapterPaths(hook.command)) {
          out.push({ runtime, event, path });
        }
      }
    }
  }
  return out;
}

function claudeRegistrations(): Registration[] {
  const doc = readJson('.claude/settings.json') as { hooks?: Record<string, unknown> };
  return nestedCommandRegistrations('claude', doc.hooks ?? {});
}

function codexRegistrations(): Registration[] {
  const doc = readJson('.codex/hooks.json') as { hooks?: Record<string, unknown> };
  return nestedCommandRegistrations('codex', doc.hooks ?? {});
}

function devinRegistrations(): Registration[] {
  const doc = readJson('.devin/hooks.v1.json') as Record<string, unknown>;
  return nestedCommandRegistrations('devin', doc);
}

function cursorRegistrations(): Registration[] {
  const doc = readJson('.cursor/hooks.json') as { hooks?: Record<string, unknown> };
  const out: Registration[] = [];
  for (const [event, entries] of Object.entries(doc.hooks ?? {})) {
    if (!Array.isArray(entries)) continue;
    for (const entry of entries as Array<{ command?: unknown }>) {
      if (typeof entry.command !== 'string') continue;
      for (const path of extractAdapterPaths(entry.command)) {
        out.push({ runtime: 'cursor', event, path });
      }
    }
  }
  return out;
}

// Pi has no JSON registration: hooks are discovered by scanning
// `.pi/extensions/` for symlinks back into the maintained source trees
// (see runtime/hooks/pi/README.md). Subdirectories under `.pi/extensions/`
// are unrelated Pi feature bundles, not spec-kit hook adapters.
const PI_NON_ADAPTER_ENTRIES = new Set([
  'README.md',
  'lib',
  'deep-pi',
  'pi-cache-optimizer',
  'pi-fast-mode-w-subagent-support',
]);

function piRegistrations(): Registration[] {
  const extensionsDir = resolve(repoRoot, '.pi/extensions');
  const out: Registration[] = [];
  for (const name of readdirSync(extensionsDir)) {
    if (PI_NON_ADAPTER_ENTRIES.has(name)) continue;
    const entryPath = resolve(extensionsDir, name);
    if (!lstatSync(entryPath).isSymbolicLink()) continue;
    const target = readlinkSync(entryPath);
    const resolvedTarget = isAbsolute(target) ? target : resolve(dirname(entryPath), target);
    out.push({ runtime: 'pi', event: 'extension', path: resolvedTarget });
  }
  return out;
}

// OpenCode has no source-hook adapter tree either (hook-system.md ss2): the
// prompt-time advisor and the Gate-3 enforcement hook are both plain plugin
// files discovered from `.opencode/plugins/`.
function openCodeRegistrations(): Registration[] {
  return [
    { runtime: 'opencode', event: 'plugin', path: resolve(repoRoot, '.opencode/plugins/system-skill-advisor.js') },
    {
      runtime: 'opencode',
      event: 'plugin',
      path: resolve(
        repoRoot,
        '.opencode/skills/system-skill-advisor/mcp-server/plugin-bridges/system-skill-advisor-bridge.mjs',
      ),
    },
    { runtime: 'opencode', event: 'plugin', path: resolve(repoRoot, '.opencode/plugins/system-spec-gate.js') },
  ];
}

function resolveAgainstRepo(registration: Registration): string {
  // Pi and OpenCode registrations are already absolute (resolved via the
  // symlink target or a literal repo-root join above); the JSON-driven
  // registrations carry a repo-relative path straight out of the config.
  return isAbsolute(registration.path) ? registration.path : resolve(repoRoot, registration.path);
}

interface CommandRegistration {
  runtime: string;
  event: string;
  command: string;
}

function claudeCommands(): CommandRegistration[] {
  const doc = readJson('.claude/settings.json') as { hooks?: Record<string, unknown> };
  const out: CommandRegistration[] = [];
  for (const [event, groups] of Object.entries(doc.hooks ?? {})) {
    if (!Array.isArray(groups)) continue;
    for (const group of groups as Array<{ hooks?: Array<{ command?: unknown }> }>) {
      for (const hook of group.hooks ?? []) {
        if (typeof hook.command === 'string') out.push({ runtime: 'claude', event, command: hook.command });
      }
    }
  }
  return out;
}

function cursorCommands(): CommandRegistration[] {
  const doc = readJson('.cursor/hooks.json') as { hooks?: Record<string, unknown> };
  const out: CommandRegistration[] = [];
  for (const [event, entries] of Object.entries(doc.hooks ?? {})) {
    if (!Array.isArray(entries)) continue;
    for (const entry of entries as Array<{ command?: unknown }>) {
      if (typeof entry.command === 'string') out.push({ runtime: 'cursor', event, command: entry.command });
    }
  }
  return out;
}

// Fire-and-forget background task: no host reads its stdout, so it runs without
// a fallback branch on purpose -- the same deliberate exception the codex
// config carries for its own backgrounded reconcile command.
function isBackgroundedReconcile(command: string): boolean {
  return command.includes('git-primary-reconcile.sh') && command.includes('&');
}

const allRegistrations: Registration[] = [
  ...claudeRegistrations(),
  ...codexRegistrations(),
  ...devinRegistrations(),
  ...cursorRegistrations(),
  ...piRegistrations(),
  ...openCodeRegistrations(),
];

describe('hook adapter path parity', () => {
  it('collects at least one registration for every covered runtime', () => {
    const covered = new Set(allRegistrations.map((registration) => registration.runtime));
    expect(covered).toEqual(new Set(['claude', 'codex', 'devin', 'cursor', 'pi', 'opencode']));
  });

  it.each(
    allRegistrations.map(
      (registration) => [`${registration.runtime}:${registration.event}:${registration.path}`, registration] as const,
    ),
  )('%s resolves on disk', (_label, registration) => {
    expect(existsSync(resolveAgainstRepo(registration))).toBe(true);
  });

  it('reports a deliberately broken path as unresolved (checker self-check)', () => {
    const broken: Registration = {
      runtime: 'codex',
      event: 'SessionStart',
      path: '.opencode/skills/system-spec-kit/runtime/dist/hooks/codex/session-start.js.deliberately-missing',
    };
    expect(existsSync(resolveAgainstRepo(broken))).toBe(false);
  });

  it('wraps every claude adapter invocation in the drift-marker fallback', () => {
    const commands = claudeCommands();
    expect(commands.length).toBeGreaterThan(0);
    for (const { runtime, event, command } of commands) {
      if (isBackgroundedReconcile(command)) continue;
      expect(command, `${runtime}:${event}`).toContain('mkHookDrift');
      expect(command, `${runtime}:${event}`).toContain(`mk-hook-drift host=${runtime} event=${event} `);
    }
  });

  it('wraps every cursor adapter invocation in the drift-marker fallback', () => {
    const commands = cursorCommands();
    expect(commands.length).toBeGreaterThan(0);
    for (const { runtime, event, command } of commands) {
      expect(command, `${runtime}:${event}`).toContain('mkHookDrift');
      expect(command, `${runtime}:${event}`).toContain(`mk-hook-drift host=${runtime} event=${event} `);
    }
  });
});
