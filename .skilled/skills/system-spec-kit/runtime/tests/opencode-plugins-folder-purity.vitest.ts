// ───────────────────────────────────────────────────────────────────
// MODULE: OpenCode Plugins Folder Purity
// ───────────────────────────────────────────────────────────────────

import { readdir, readlink, realpath } from 'node:fs/promises';
import { dirname, extname, isAbsolute, relative, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

const thisDir = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(thisDir, '../../../../..');
const pluginsDir = resolve(repoRoot, '.skilled/plugins');
const pluginExtensions = new Set(['.js', '.mjs', '.ts']);
const hookKeys = new Set([
  'event',
  'config',
  'tool',
  'auth',
  'provider',
  'chat.message',
  'chat.params',
  'chat.headers',
  'permission.ask',
  'command.execute.before',
  'tool.execute.before',
  'shell.env',
  'tool.execute.after',
  'experimental.chat.messages.transform',
  'experimental.chat.system.transform',
  'experimental.session.compacting',
  'experimental.text.complete',
  'tool.definition',
]);

function hasHookProperty(value: Record<string, unknown>): boolean {
  return Object.keys(value).some((key) => hookKeys.has(key));
}

// A linked entrypoint only counts as a repository plugin when its target stays inside the checkout.
function isInsideRepo(file: string): boolean {
  const repoRelativePath = relative(repoRoot, file);
  return !repoRelativePath.startsWith('..') && !isAbsolute(repoRelativePath);
}

describe('OpenCode plugins folder purity', () => {
  it('contains only importable plugin entrypoints with valid hook objects', async () => {
    // The sk-vision factory starts its GPU runtime behind this flag; purity must not.
    const savedAutoInspect = process.env.SK_VISION_AUTOINSPECT;
    delete process.env.SK_VISION_AUTOINSPECT;

    try {
      const entries = await readdir(pluginsDir, { withFileTypes: true });
      const pluginFiles = entries
        .filter(
          (entry) =>
            (entry.isFile() || entry.isSymbolicLink()) &&
            pluginExtensions.has(extname(entry.name)),
        )
        .map((entry) => resolve(pluginsDir, entry.name))
        .sort();
      const symlinkPaths = new Set(
        entries
          .filter((entry) => entry.isSymbolicLink())
          .map((entry) => resolve(pluginsDir, entry.name)),
      );

      expect(pluginFiles.length).toBeGreaterThan(0);

      for (const pluginFile of pluginFiles) {
        if (symlinkPaths.has(pluginFile)) {
          // Relative targets survive every clone and worktree; absolute ones break on a move.
          const linkTarget = await readlink(pluginFile);
          if (isAbsolute(linkTarget)) {
            throw new Error(
              `${pluginFile} must link through a relative target so the link survives a clone or worktree move, found ${linkTarget}`,
            );
          }

          const linkDestination = resolve(dirname(pluginFile), linkTarget);
          if (!isInsideRepo(linkDestination)) {
            throw new Error(
              `${pluginFile} links outside the repository (${linkDestination})`,
            );
          }

          let realPluginFile: string;
          try {
            realPluginFile = await realpath(pluginFile);
          } catch (error) {
            if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
              throw new Error(
                `${pluginFile} links to a build output this checkout has not built (${linkTarget}). Run: bash .skilled/skills/sk-git/scripts/worktree-naming.sh provision`,
              );
            }
            throw error;
          }
          if (!isInsideRepo(realPluginFile)) {
            throw new Error(
              `${pluginFile} resolves outside the repository (${realPluginFile})`,
            );
          }
          if (!pluginExtensions.has(extname(realPluginFile))) {
            throw new Error(
              `${pluginFile} resolves to ${realPluginFile}, which is not a plugin entrypoint extension`,
            );
          }
        }

        let pluginModule;
        try {
          pluginModule = await import(pathToFileURL(pluginFile).href);
        } catch (error) {
          if (
            error instanceof Error &&
            'code' in error &&
            error.code === 'ERR_MODULE_NOT_FOUND' &&
            error.message.includes('/dist/')
          ) {
            throw new Error(
              `${pluginFile} imports a build output this checkout has not built (${error.message}). Run: bash .skilled/skills/sk-git/scripts/worktree-naming.sh provision`,
            );
          }
          throw error;
        }
        expect(pluginModule, `${pluginFile} must default-export an OpenCode plugin entrypoint`)
          .toHaveProperty('default');

        const pluginDefault = pluginModule.default;
        expect(pluginDefault, `${pluginFile} default export must not be nullish`)
          .not.toBeNull();
        expect(pluginDefault, `${pluginFile} default export must not be undefined`)
          .not.toBeUndefined();

        if (typeof pluginDefault === 'function') {
          const hooks = await pluginDefault({});
          expect(hooks, `${pluginFile} plugin factory must return a hook object`)
            .not.toBeNull();
          expect(hooks, `${pluginFile} plugin factory must not return undefined`)
            .not.toBeUndefined();
          expect(hooks, `${pluginFile} plugin factory must return an object`)
            .toEqual(expect.any(Object));
          expect(hasHookProperty(hooks), `${pluginFile} plugin factory returned no recognized OpenCode hook keys`)
            .toBe(true);
          continue;
        }

        // A dual OpenCode plugin exports { id, server, setup }; `server` is the v1 factory the host calls.
        if (typeof pluginDefault.server === 'function') {
          expect(typeof pluginDefault.setup, `${pluginFile} dual plugin must export a setup function`)
            .toBe('function');
          const hooks = await pluginDefault.server({});
          expect(hooks, `${pluginFile} dual plugin server factory must return an object`)
            .toEqual(expect.any(Object));
          expect(hasHookProperty(hooks), `${pluginFile} dual plugin server factory returned no recognized OpenCode hook keys`)
            .toBe(true);
          continue;
        }

        expect(pluginDefault, `${pluginFile} object default export must be an OpenCode hook object`)
          .toEqual(expect.any(Object));
        expect(hasHookProperty(pluginDefault), `${pluginFile} object default export has no recognized OpenCode hook keys`)
          .toBe(true);
      }
    } finally {
      if (savedAutoInspect === undefined) {
        delete process.env.SK_VISION_AUTOINSPECT;
      } else {
        process.env.SK_VISION_AUTOINSPECT = savedAutoInspect;
      }
    }
  });
});
