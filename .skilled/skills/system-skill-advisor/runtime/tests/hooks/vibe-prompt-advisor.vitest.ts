// ───────────────────────────────────────────────────────────────────
// MODULE: Vibe Prompt Advisor Real-Brief Tests
// ───────────────────────────────────────────────────────────────────
// Runs the Vibe prompt-advisor part with the real advisor in an isolated scope,
// because the turn-start suite stubs the advisor and so never proves the brief
// Vibe actually delivers. Each case reads only the routing head, which carries
// the command and its policy word, and pins neither the freshness word nor the
// scores the advisor varies between runs.

import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import * as vibeAdvisor from '../../../hooks/vibe/prompt-advisor.mjs';
import {
  cleanupSkillAdvisorScope,
  createIsolatedCliScope,
  repoRoot,
  type IsolatedCliScope,
} from '../skill-advisor-cli-test-utils.js';

const ADVISOR_MODULE = join(
  repoRoot,
  '.skilled/skills/system-skill-advisor/hooks/vibe/prompt-advisor.mjs',
);

// The bridge table lists every command the advisor can name, so the loop below
// proves each one resolves to a document path in this checkout.
const COMMAND_BRIDGES = JSON.parse(
  readFileSync(
    join(
      repoRoot,
      '.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/command-bridges.generated.json',
    ),
    'utf8',
  ),
) as { commandPolicies: Array<{ command: string }> };

const LEAD = 'Command documents (read in full before taking one): ';

// The child imports the hook module by file URL under the checkout the test
// resolved, so the part and the advisor it loads share one repository root even
// when the suite runs from a worktree.
function childScript(): string {
  return [
    `const { buildAdvisorPart } = await import(${JSON.stringify(pathToFileURL(ADVISOR_MODULE).href)});`,
    'const result = await buildAdvisorPart({',
    "  hook_event_name: 'pre_agent',",
    '  prompt: process.argv[1],',
    '  session_id: process.argv[2],',
    '});',
    'process.stdout.write(JSON.stringify(result));',
    'process.exit(0);',
  ].join('\n');
}

/**
 * Builds one brief in a fresh process and returns its routing head.
 *
 * @param scope - The isolated scope the advisor runs inside.
 * @param prompt - The prompt Vibe would carry on the turn.
 * @param sessionId - The session id, which also keys the head receipt.
 * @returns The delivered text up to the directive block.
 */
function vibeHead(scope: IsolatedCliScope, prompt: string, sessionId: string): string {
  const env: NodeJS.ProcessEnv = {
    ...scope.env,
    // Both receipts must land inside the scope, or a rerun reads the previous
    // turn's receipt and drops the head this case asserts on. The hook-health
    // records live under the temporary folder, so a proof run must not add
    // records to the checkout's real health file.
    SPECKIT_DIRECTIVE_LIFECYCLE_STATE_DIR: join(scope.rootDir, 'directive-state'),
    TMPDIR: join(scope.rootDir, 'tmp'),
  };
  // A child session receives no brief at all, so the proof run must not inherit
  // the marker this test process may itself carry.
  delete env.AI_SESSION_CHILD;

  const run = spawnSync(
    process.execPath,
    ['--input-type=module', '-e', childScript(), prompt, sessionId],
    { cwd: repoRoot, encoding: 'utf8', timeout: 120_000, env },
  );
  expect(run.status, run.stderr).toBe(0);

  const text = JSON.parse(run.stdout) as string;
  return text.split('\nDirectives:')[0];
}

// The receipt folder is what the injected env moves, so the case counts receipt
// files rather than asserting on the returned text.
function headReceipts(directory: string): string[] {
  const receiptDir = join(directory, 'vibe-turn-start');
  if (!existsSync(receiptDir)) return [];
  return readdirSync(receiptDir).filter((name) => name.endsWith('.head'));
}

describe('Vibe prompt advisor with the real advisor', () => {
  let scope: IsolatedCliScope;

  beforeAll(() => {
    scope = createIsolatedCliScope('vibe-prompt-advisor');
    mkdirSync(join(scope.rootDir, 'tmp'), { recursive: true });
  });

  afterAll(async () => {
    await cleanupSkillAdvisorScope(scope);
  });

  it('names the readme command for a documentation prompt', () => {
    const head = vibeHead(scope, 'write a readme for the utils folder', 'vibe-head-readme');

    expect(head.startsWith('Advisor:')).toBe(true);
    expect(head).toMatch(/→ \/create:readme \(start\)/);
    expect(head).toContain(`${LEAD}/create:readme is .skilled/commands/create/readme.md.`);
  }, 120_000);

  it('names the git skill and its doctor follow-up for a hooks prompt', () => {
    const head = vibeHead(scope, 'Check my git hooks setup', 'vibe-head-git-hooks');

    expect(head.startsWith('Advisor:')).toBe(true);
    expect(head).toMatch(/use sk-git/);
    expect(head).toMatch(/\nAlso: \/doctor:git setup \(run\)/);
    expect(head).toContain(`${LEAD}/doctor:git is .skilled/commands/doctor/git.md.`);
  }, 120_000);

  it('names the setup doctor for a health prompt', () => {
    const head = vibeHead(scope, 'my skilled install is broken, check its health', 'vibe-head-health');

    expect(head.startsWith('Advisor:')).toBe(true);
    expect(head).toMatch(/run \/doctor:setup\./);
    expect(head).toContain(`${LEAD}/doctor:setup is .skilled/commands/doctor/setup.md.`);
  }, 120_000);
});

describe('withCommandDocuments', () => {
  it('adds the document line at the end of the head', () => {
    const head = 'Advisor: live; use sk-doc → /create:readme (start) 0.94/0.12 pass.';
    const context = `${head}\nDirectives:\n- keep comments durable`;

    expect(vibeAdvisor.withCommandDocuments(context, repoRoot)).toBe(
      `${head}\n${LEAD}/create:readme is .skilled/commands/create/readme.md.\nDirectives:\n- keep comments durable`,
    );
  });

  it('appends the line when the head carries no directive block', () => {
    const context = 'Advisor: live; use sk-git 0.82/0.16 pass.\nAlso: /doctor:git setup (run)';

    expect(vibeAdvisor.withCommandDocuments(context, repoRoot)).toBe(
      `${context}\n${LEAD}/doctor:git is .skilled/commands/doctor/git.md.`,
    );
  });

  it('leaves a directive-only context unchanged', () => {
    const context = 'Directives:\n- When a save is due, run /speckit:save to record the session.';

    expect(vibeAdvisor.withCommandDocuments(context)).toBe(context);
  });

  it('names the document a no-skill head offers as its follow-up', () => {
    const context = 'Advisor: no skill matched. For setup or health checks, run /doctor:setup.';

    expect(vibeAdvisor.withCommandDocuments(context, repoRoot)).toBe(
      `${context}\n${LEAD}/doctor:setup is .skilled/commands/doctor/setup.md.`,
    );
  });

  it('drops a second colon part and lists each command once', () => {
    const both = 'Advisor: live; use x → /deep:research:auto, /doctor:setup (start) 0.9/0.1 pass.';
    expect(vibeAdvisor.withCommandDocuments(both, repoRoot)).toBe(
      `${both}\n${LEAD}/deep:research is .skilled/commands/deep/research.md, /doctor:setup is .skilled/commands/doctor/setup.md.`,
    );

    const twice = 'Advisor: live; use sk-doc → /create:readme (start) 0.9/0.1 pass.\nAlso: /create:readme (start)';
    expect(vibeAdvisor.withCommandDocuments(twice, repoRoot)).toBe(
      `${twice}\n${LEAD}/create:readme is .skilled/commands/create/readme.md.`,
    );
  });

  it('leaves a head unchanged when no command document resolves', () => {
    const noCommand = 'Advisor: no skill matched. Nothing here names a command.';
    expect(vibeAdvisor.withCommandDocuments(noCommand, repoRoot)).toBe(noCommand);

    const unknown = 'Advisor: live; use x → /create:nope (start) 0.9/0.1 pass.';
    expect(vibeAdvisor.withCommandDocuments(unknown, repoRoot)).toBe(unknown);

    const head = 'Advisor: live; use sk-doc → /create:readme (start) 0.94/0.12 pass.';
    expect(vibeAdvisor.withCommandDocuments(head, join(repoRoot, 'no-such-checkout'))).toBe(head);
  });

  it('names a document for every command the bridges list', () => {
    for (const { command } of COMMAND_BRIDGES.commandPolicies) {
      const head = `Advisor: live; use x → ${command} (start) 0.9/0.1 pass.`;
      expect(vibeAdvisor.withCommandDocuments(head, repoRoot), command).toContain(LEAD);
    }
  });

  it('drops a repeated head after adding the document line', async () => {
    const head = 'Advisor: live; use sk-doc → /create:readme (start) 0.94/0.12 pass.';
    const receipts = new Map<string, string>();
    const dependencies = {
      run: async () => ({ hookSpecificOutput: { additionalContext: head } }),
      env: {},
      isEnabled: () => true,
      read: (sessionId: string) => receipts.get(sessionId) ?? '',
      write: (sessionId: string, text: string) => {
        receipts.set(sessionId, text);
      },
    };
    const payload = {
      hook_event_name: 'pre_agent',
      prompt: 'write a readme for the utils folder',
      session_id: 'vibe-command-documents-repeat',
    };

    await expect(vibeAdvisor.buildAdvisorPart(payload, dependencies)).resolves.toBe(
      `${head}\n${LEAD}/create:readme is .skilled/commands/create/readme.md.`,
    );
    await expect(vibeAdvisor.buildAdvisorPart(payload, dependencies)).resolves.toBe('');
  });
});

describe('buildAdvisorPart head receipt location', () => {
  let scope: IsolatedCliScope;

  beforeAll(() => {
    scope = createIsolatedCliScope('vibe-prompt-advisor-receipts');
  });

  afterAll(async () => {
    await cleanupSkillAdvisorScope(scope);
  });

  it('writes the receipt under the injected env, not process.env', async () => {
    const injectedDir = join(scope.rootDir, 'receipts-injected');
    const processDir = join(scope.rootDir, 'receipts-process');
    mkdirSync(injectedDir, { recursive: true });
    mkdirSync(processDir, { recursive: true });

    const previous = process.env.SPECKIT_DIRECTIVE_LIFECYCLE_STATE_DIR;
    process.env.SPECKIT_DIRECTIVE_LIFECYCLE_STATE_DIR = processDir;
    try {
      const head = 'Advisor: live; use sk-doc → /create:readme (start) 0.94/0.12 pass.';
      const result = await vibeAdvisor.buildAdvisorPart(
        {
          hook_event_name: 'pre_agent',
          prompt: 'write a readme for the utils folder',
          session_id: 'vibe-receipt-injected-env',
        },
        {
          run: async () => ({ hookSpecificOutput: { additionalContext: head } }),
          env: { SPECKIT_DIRECTIVE_LIFECYCLE_STATE_DIR: injectedDir },
          isEnabled: () => true,
        },
      );

      expect(result.startsWith(head)).toBe(true);
      // The two counts are the whole observable: a writer that reads process.env
      // lands the receipt in the other folder, so the pair proves which env the
      // receipt path followed.
      expect({
        injected: headReceipts(injectedDir).length,
        process: headReceipts(processDir).length,
      }).toEqual({ injected: 1, process: 0 });
    } finally {
      if (previous === undefined) delete process.env.SPECKIT_DIRECTIVE_LIFECYCLE_STATE_DIR;
      else process.env.SPECKIT_DIRECTIVE_LIFECYCLE_STATE_DIR = previous;
    }
  });
});

describe('reduceRepeatedHead with a held-back follow-up', () => {
  it('delivers the route, the skipped head once, nothing on the repeat and then the next route', () => {
    const heads = new Map<string, string>();
    const receipts = {
      read: (sessionId: string) => heads.get(sessionId) ?? null,
      write: (sessionId: string, head: string) => {
        heads.set(sessionId, head);
      },
      env: {},
    };
    const directives = '\nDirectives:\n- Comment hygiene [HARD BLOCK]: keep the durable why.';
    const route = 'Advisor: live; use sk-doc 0.94/0.20 pass.';
    const skipped = 'Advisor: prompt skipped.';

    expect(vibeAdvisor.reduceRepeatedHead(`${route}${directives}`, 'vibe-session', receipts)).toBe(`${route}${directives}`);
    expect(vibeAdvisor.reduceRepeatedHead(skipped, 'vibe-session', receipts)).toBe(skipped);
    expect(vibeAdvisor.reduceRepeatedHead(skipped, 'vibe-session', receipts)).toBe('');
    expect(vibeAdvisor.reduceRepeatedHead(route, 'vibe-session', receipts)).toBe(route);
  });
});

describe('buildAdvisorPart receipt commit', () => {
  it('commits the handler receipts only for a turn that returns a brief', async () => {
    const head = 'Advisor: live; use sk-code 0.91/0.12 pass.';
    const output = { hookSpecificOutput: { additionalContext: head } };
    const commits: unknown[] = [];
    const receipts = new Map<string, string>();
    const dependencies = {
      run: async () => output,
      commit: async (delivered: unknown) => {
        commits.push(delivered);
      },
      env: {},
      isEnabled: () => true,
      read: (sessionId: string) => receipts.get(sessionId) ?? '',
      write: (sessionId: string, text: string) => {
        receipts.set(sessionId, text);
      },
    };
    const payload = { hook_event_name: 'pre_agent', prompt: 'refactor the session store', session_id: 'vibe-receipt-commit' };

    await expect(vibeAdvisor.buildAdvisorPart(payload, dependencies)).resolves.toBe(head);
    expect(commits).toEqual([output]);
    // The repeat returns nothing, so the model sees no brief and nothing is committed.
    await expect(vibeAdvisor.buildAdvisorPart(payload, dependencies)).resolves.toBe('');
    expect(commits).toEqual([output]);
  });
});

describe('buildAdvisorPart receipt commit failure', () => {
  it('keeps the brief when the receipt commit throws', async () => {
    const head = 'Advisor: live; use sk-code 0.91/0.12 pass.';
    const dependencies = {
      run: async () => ({ hookSpecificOutput: { additionalContext: head } }),
      commit: async () => {
        throw new Error('commit failed');
      },
      env: {},
      isEnabled: () => true,
      read: () => '',
      write: () => {},
    };
    const payload = { hook_event_name: 'pre_agent', prompt: 'refactor the session store', session_id: 'vibe-commit-throws' };

    await expect(vibeAdvisor.buildAdvisorPart(payload, dependencies)).resolves.toBe(head);
  });
});
