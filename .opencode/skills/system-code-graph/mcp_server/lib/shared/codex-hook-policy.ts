// ───────────────────────────────────────────────────────────────
// MODULE: Codex Hook Policy Detection
// ───────────────────────────────────────────────────────────────

import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { homedir } from 'node:os';

export type CodexHookAvailability = 'live' | 'partial' | 'unavailable';

export interface CodexHookPolicy {
  readonly hooks: CodexHookAvailability;
  readonly probedAt: string;
  readonly diagnostics: {
    readonly probeDurationMs: number;
    readonly codexVersion?: string;
    readonly reason?: string;
  };
}

function hasCodexHooksFeatureEnabled(configPath: string): boolean {
  if (!existsSync(configPath)) return false;
  try {
    const lines = readFileSync(configPath, 'utf8').split(/\r?\n/);
    let inFeatures = false;
    for (const line of lines) {
      const stripped = line.replace(/#.*$/, '').trim();
      if (!stripped) continue;
      if (stripped.startsWith('[') && stripped.endsWith(']')) {
        inFeatures = stripped === '[features]';
        continue;
      }
      if (!inFeatures) continue;
      if (/^hooks\s*=\s*true\b/i.test(stripped)) return true;
      if (/^hooks\s*=/.test(stripped)) return false;
      if (/^codex_hooks\s*=\s*true\b/i.test(stripped)) return true;
      if (/^codex_hooks\s*=/.test(stripped)) return false;
    }
  } catch { return false; }
  return false;
}

function hasValidHookRegistration(hooksPath: string): boolean {
  if (!existsSync(hooksPath)) return false;
  try {
    const parsed = JSON.parse(readFileSync(hooksPath, 'utf8')) as unknown;
    return typeof parsed === 'object' && parsed !== null;
  } catch { return false; }
}

export function detectCodexHookPolicy(): CodexHookPolicy {
  const workspaceRoot = process.cwd();
  const configPath = join(workspaceRoot, '.codex', 'config.toml');
  const hooksPath = join(homedir(), '.codex', 'hooks.json');
  const hasFeatureFlag = hasCodexHooksFeatureEnabled(configPath);
  const hasHooksRegistration = hasValidHookRegistration(hooksPath);
  const hooks: CodexHookAvailability = hasFeatureFlag && hasHooksRegistration ? 'live' : 'partial';
  return {
    hooks,
    probedAt: new Date().toISOString(),
    diagnostics: { probeDurationMs: 0 },
  };
}
