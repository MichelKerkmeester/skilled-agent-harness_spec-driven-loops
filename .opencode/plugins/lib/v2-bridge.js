// ───────────────────────────────────────────────────────────────────
// MODULE: OpenCode v2 Compatibility Bridge
// ───────────────────────────────────────────────────────────────────

import { z } from 'zod';

const MAPPED_HOOKS = new Set([
  'event',
  'tool.execute.before',
  'tool.execute.after',
  'experimental.chat.system.transform',
  'tool',
  'dispose',
]);

/**
 * Convert a v2 tool result to the output shape expected by v1 hooks.
 *
 * @param {object} event - The v2 execute-after event.
 * @returns {{ title: string, output: unknown, metadata: object }} The v1 hook output.
 */
function toV1ToolOutput(event) {
  if (event.status === 'error') {
    return {
      title: '',
      output: event.error?.message ?? '',
      metadata: { error: event.error },
    };
  }

  const result = event.result ?? {};
  return {
    title: result.title ?? '',
    output: result.output ?? result.content ?? '',
    metadata: result.metadata ?? {},
  };
}

function toV1ToolContext(context, directory) {
  return {
    ...context,
    abort: context.signal,
    directory,
    worktree: directory,
    metadata: (update) => context.progress(update),
    ask: async () => {
      throw new Error('ask is not available on OpenCode 2');
    },
  };
}

/**
 * Build a plugin definition that exposes the original v1 server and a v2 setup.
 *
 * @param {string} id - The plugin identifier.
 * @param {Function} server - The unchanged v1 plugin server function.
 * @returns {{ id: string, server: Function, setup: Function }} A dual-version plugin.
 */
export function dualPlugin(id, server) {
  async function setup(ctx) {
    const directory = ctx.location.directory;
    const input = {
      client: undefined,
      project: undefined,
      worktree: directory,
      directory,
      experimental_workspace: undefined,
      serverUrl: undefined,
      $: undefined,
    };
    const hooks = await server(input);
    const registrations = [];
    const skippedKeys = Object.keys(hooks).filter((key) => !MAPPED_HOOKS.has(key));
    let eventController;
    let eventTask;
    let eventFailure;
    let cleanupPromise;

    const cleanup = () => {
      if (cleanupPromise) return cleanupPromise;

      cleanupPromise = (async () => {
        const errors = [];
        eventController?.abort();

        if (eventTask) {
          try {
            await eventTask;
          } catch (error) {
            errors.push(error);
          }
        }

        const disposalResults = await Promise.allSettled(
          registrations.map((registration) => registration.dispose()),
        );
        for (const result of disposalResults) {
          if (result.status === 'rejected') errors.push(result.reason);
        }

        if (typeof hooks.dispose === 'function') {
          try {
            await hooks.dispose();
          } catch (error) {
            errors.push(error);
          }
        }

        if (eventFailure) errors.push(eventFailure);
        if (errors.length === 1) throw errors[0];
        if (errors.length > 1) throw new AggregateError(errors, 'Plugin cleanup failed');
      })();

      return cleanupPromise;
    };
    cleanup.skippedKeys = Object.freeze([...skippedKeys]);

    try {
      if (typeof hooks.event === 'function') {
        eventController = new AbortController();
        const eventStream = ctx.event.subscribe({ signal: eventController.signal });
        eventTask = (async () => {
          try {
            for await (const event of eventStream) {
              const data = event.data;
              const properties =
                event.type.startsWith('session.')
                && data?.sessionID !== undefined
                && data.info === undefined
                  ? { ...data, info: { id: data.sessionID } }
                  : data;
              await hooks.event({
                event: {
                  type: event.type,
                  properties,
                },
              });
            }
          } catch (error) {
            if (!eventController.signal.aborted || error?.name !== 'AbortError') {
              eventFailure = error;
            }
          }
        })();
      }

      if (typeof hooks['tool.execute.before'] === 'function') {
        const registration = await ctx.tool.hook('execute.before', async (event) => {
          const hookInput = {
            tool: event.tool,
            sessionID: event.sessionID,
            callID: event.id,
          };
          const hookOutput = { args: event.input };
          await hooks['tool.execute.before'](hookInput, hookOutput);
          event.input = hookOutput.args;
        });
        registrations.push(registration);
      }

      if (typeof hooks['tool.execute.after'] === 'function') {
        const registration = await ctx.tool.hook('execute.after', async (event) => {
          const hookInput = {
            tool: event.tool,
            sessionID: event.sessionID,
            callID: event.id,
            args: event.input,
          };
          await hooks['tool.execute.after'](hookInput, toV1ToolOutput(event));
        });
        registrations.push(registration);
      }

      if (typeof hooks['experimental.chat.system.transform'] === 'function') {
        const registration = await ctx.session.hook('context', async (event) => {
          const hookOutput = { system: [] };
          const hookInput = { sessionID: event.sessionID };
          if (event.model !== undefined) hookInput.model = event.model;
          await hooks['experimental.chat.system.transform'](
            hookInput,
            hookOutput,
          );
          for (const text of hookOutput.system) {
            event.system.push({ type: 'text', text });
          }
        });
        registrations.push(registration);
      }

      if (hooks.tool) {
        const registration = await ctx.tool.transform((editor) => {
          for (const [name, definition] of Object.entries(hooks.tool)) {
            editor.add({
              name,
              description: definition.description,
              input: z.toJSONSchema(z.object(definition.args), { io: 'input' }),
              execute: async (args, toolContext) => {
                const result = await definition.execute(
                  args,
                  toV1ToolContext(toolContext, directory),
                );
                if (typeof result === 'string') return { content: result };

                const metadata = { ...(result.metadata ?? {}) };
                if (result.title !== undefined) metadata.title = result.title;
                return { content: result.output, metadata };
              },
            });
          }
          return editor;
        });
        registrations.push(registration);
      }
    } catch (error) {
      try {
        await cleanup();
      } catch (_) {
        // Preserve the registration failure that prevented setup from completing.
      }
      throw error;
    }

    return cleanup;
  }

  return { id, server, setup };
}
