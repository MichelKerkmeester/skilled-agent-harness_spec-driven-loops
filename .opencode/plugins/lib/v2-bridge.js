// ───────────────────────────────────────────────────────────────────
// MODULE: OpenCode v2 Compatibility Bridge
// ───────────────────────────────────────────────────────────────────
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

import { z } from 'zod';

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const MAPPED_HOOKS = new Set([
  'event',
  'tool.execute.before',
  'tool.execute.after',
  'experimental.chat.system.transform',
  'tool',
  'dispose',
]);

const EVENT_ALIASES = Object.freeze({
  'session.execution.succeeded': 'session.idle',
  'session.compaction.ended': 'session.compacted',
});

// v2 renamed the tools and argument v1 plugins match on, so map them back before dispatch.
const TOOL_ALIASES = Object.freeze({
  shell: 'bash',
  subagent: 'task',
});

// A mapping entry may emit several v1 events, and a null payload skips its delivery.
const EVENT_MAPPINGS = Object.freeze({
  'session.text.ended': {
    type: 'message.part.updated',
    properties: (data) => ({
      sessionID: data.sessionID,
      part: {
        type: 'text',
        text: data.text,
        sessionID: data.sessionID,
        messageID: data.assistantMessageID,
        role: 'assistant',
      },
    }),
  },
  'session.step.ended': {
    type: 'message.updated',
    properties: (data, event) => {
      const info = {
        id: data.assistantMessageID,
        sessionID: data.sessionID,
        role: 'assistant',
      };
      if (data.cost !== undefined) info.cost = data.cost;
      if (data.tokens !== undefined) info.tokens = toV1Tokens(data.tokens);
      if (typeof event.created === 'number') info.time = { completed: event.created };
      return { sessionID: data.sessionID, info };
    },
  },
  'session.inbox.enqueued': [
    {
      type: 'message.updated',
      properties: (data, event) => {
        if (!isUserInboxItem(data)) return null;
        const info = {
          id: data.inboxID,
          sessionID: data.sessionID,
          role: 'user',
        };
        if (typeof event.created === 'number') info.time = { created: event.created };
        return { sessionID: data.sessionID, info };
      },
    },
    {
      type: 'message.part.updated',
      properties: (data) => {
        if (!isUserInboxItem(data)) return null;
        return {
          sessionID: data.sessionID,
          part: {
            type: 'text',
            text: data.item.payload.text,
            sessionID: data.sessionID,
            messageID: data.inboxID,
          },
        };
      },
    },
  ],
});

const DEDUPED_SESSION_EVENTS = new Set(['session.idle', 'session.compacted']);
const SESSION_EVENT_RESET_TYPES = new Set([
  'session.execution.started',
  'session.compaction.started',
  'session.deleted',
]);

// ─────────────────────────────────────────────────────────────────────────────
// 3. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function isUserInboxItem(data) {
  return data?.item?.type === 'user' && typeof data.item.payload?.text === 'string';
}

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

function toV1ToolName(tool) {
  return Object.hasOwn(TOOL_ALIASES, tool) ? TOOL_ALIASES[tool] : tool;
}

function toV1ToolArgs(tool, args) {
  if (tool !== 'subagent' || args === null || typeof args !== 'object') return args;
  return { ...args, subagent_type: args.agent };
}

function toV2ToolArgs(tool, originalArgs, args) {
  if (tool !== 'subagent' || args === null || typeof args !== 'object') return args;

  const next = { ...args };
  if (Object.hasOwn(next, 'subagent_type') && next.subagent_type !== originalArgs?.agent) {
    next.agent = next.subagent_type;
  }

  const originalHadSubagentType = originalArgs !== null
    && typeof originalArgs === 'object'
    && Object.hasOwn(originalArgs, 'subagent_type');
  if (!originalHadSubagentType) delete next.subagent_type;
  return next;
}

function toV1ToolHookOutput(event) {
  const output = toV1ToolOutput(event);
  if (event.tool !== 'shell' || event.status === 'error') return output;

  const shellOutput = event.result?.output;
  if (shellOutput !== null && typeof shellOutput === 'object' && typeof shellOutput.output === 'string') {
    return { ...output, output: shellOutput.output };
  }
  return output;
}

function toV1Tokens(tokens) {
  const usage = {};
  for (const field of ['input', 'output', 'reasoning']) {
    if (tokens[field] !== undefined) usage[field] = tokens[field];
  }

  const cache = {};
  if (tokens.cache?.read !== undefined) cache.read = tokens.cache.read;
  if (tokens.cache?.write !== undefined) cache.write = tokens.cache.write;
  if (Object.keys(cache).length > 0) usage.cache = cache;

  return usage;
}

function requireV2SessionMethod(ctx, method) {
  const sessionMethod = ctx.session?.[method];
  if (typeof sessionMethod !== 'function') {
    throw new Error(`session.${method} is not available on OpenCode 2`);
  }
  return sessionMethod;
}

function toV1Message(message, sessionID) {
  const info = {};
  if (message.id !== undefined) info.id = message.id;
  if (message.type === 'user' || message.type === 'assistant') info.role = message.type;
  if (sessionID !== undefined) info.sessionID = sessionID;

  const parts = [];
  if (message.type === 'user' && typeof message.text === 'string') {
    parts.push({ type: 'text', text: message.text });
  }
  if (message.type === 'assistant' && Array.isArray(message.content)) {
    for (const part of message.content) {
      if (part?.type === 'text' && typeof part.text === 'string') {
        parts.push({ type: 'text', text: part.text });
      }
    }
  }

  return { info, parts };
}

function createV1Client(ctx) {
  return {
    session: {
      messages: async ({ path, query } = {}) => {
        const getContext = requireV2SessionMethod(ctx, 'context');
        const messages = await getContext.call(ctx.session, { sessionID: path.id });
        const recentMessages = Number.isInteger(query?.limit)
          ? (query.limit > 0 ? messages.slice(-query.limit) : [])
          : messages;
        return {
          data: recentMessages.map((message) => toV1Message(message, path.id)),
        };
      },
      promptAsync: async ({ path, body } = {}) => {
        const prompt = requireV2SessionMethod(ctx, 'prompt');
        const textParts = Array.isArray(body?.parts)
          ? body.parts.filter((part) => part?.type === 'text' && typeof part.text === 'string')
          : [];
        if (textParts.length === 0) {
          throw new Error('session.promptAsync requires a text part supported by OpenCode 2');
        }

        const input = {
          sessionID: path.id,
          text: textParts.map((part) => part.text).join('\n'),
          delivery: 'queue',
        };
        if (body.messageID !== undefined) input.id = body.messageID;
        await prompt.call(ctx.session, input);
      },
      create: async ({ query, body } = {}) => {
        const create = requireV2SessionMethod(ctx, 'create');
        const input = { ...(body ?? {}) };
        if (query?.directory !== undefined) {
          input.location = { ...(input.location ?? {}), directory: query.directory };
        }
        return { data: await create.call(ctx.session, input) };
      },
      prompt: async ({ path, body } = {}) => {
        const generate = requireV2SessionMethod(ctx, 'generate');
        const textParts = Array.isArray(body?.parts)
          ? body.parts.filter((part) => part?.type === 'text' && typeof part.text === 'string')
          : [];
        if (textParts.length === 0) {
          throw new Error('session.prompt requires a text part supported by OpenCode 2');
        }

        const prompt = textParts.map((part) => part.text).join('\n');
        const response = await generate.call(ctx.session, { sessionID: path.id, prompt });
        return {
          data: {
            info: { role: 'assistant' },
            parts: [{ type: 'text', text: response.text }],
          },
        };
      },
      delete: async ({ path } = {}) => {
        const remove = requireV2SessionMethod(ctx, 'remove');
        await remove.call(ctx.session, { sessionID: path.id });
      },
    },
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

// ─────────────────────────────────────────────────────────────────────────────
// 4. CORE LOGIC
// ─────────────────────────────────────────────────────────────────────────────

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
      client: createV1Client(ctx),
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
    const sessionEventState = new Map();
    const announcedSessions = new Set();
    const announcingSessions = new Map();

    const deliverEvent = async (type, properties) => {
      const sessionID = properties?.sessionID
        ?? properties?.info?.sessionID
        ?? properties?.info?.id
        ?? properties?.part?.sessionID;
      if (DEDUPED_SESSION_EVENTS.has(type) && sessionID !== undefined) {
        const deliveredTypes = sessionEventState.get(sessionID) ?? new Set();
        if (deliveredTypes.has(type)) return;
        deliveredTypes.add(type);
        sessionEventState.set(sessionID, deliveredTypes);
      }

      await hooks.event({ event: { type, properties } });
    };

    // v2 can deliver session traffic before session.created, so synthesize the event v1 plugins wait for.
    const announceSession = async (
      sessionID,
      properties = { sessionID, info: { id: sessionID } },
    ) => {
      if (typeof hooks.event !== 'function' || sessionID === undefined) return;
      const inFlight = announcingSessions.get(sessionID);
      if (inFlight) return inFlight;
      if (announcedSessions.has(sessionID)) return;

      announcedSessions.add(sessionID);
      const delivery = deliverEvent('session.created', properties);
      announcingSessions.set(sessionID, delivery);
      try {
        await delivery;
      } finally {
        announcingSessions.delete(sessionID);
      }
    };

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
              if (event.type === 'session.deleted') {
                const deletedID = data?.sessionID ?? data?.info?.id;
                if (deletedID !== undefined) await announcingSessions.get(deletedID);
              }
              if (event.type === 'session.created' && data?.sessionID !== undefined) {
                const announced = announcedSessions.has(data.sessionID)
                  || announcingSessions.has(data.sessionID);
                if (!announced) {
                  await announceSession(
                    data.sessionID,
                    data.info === undefined ? { ...data, info: { id: data.sessionID } } : data,
                  );
                } else {
                  await announcingSessions.get(data.sessionID);
                }
                continue;
              } else if (
                event.type.startsWith('session.')
                && event.type !== 'session.deleted'
                && data?.sessionID !== undefined
              ) {
                await announceSession(data.sessionID);
              }

              const properties =
                event.type.startsWith('session.')
                && data?.sessionID !== undefined
                && data.info === undefined
                  ? { ...data, info: { id: data.sessionID } }
                  : data;
              if (SESSION_EVENT_RESET_TYPES.has(event.type)) {
                const sessionID = data?.sessionID ?? data?.info?.id;
                if (sessionID !== undefined) sessionEventState.delete(sessionID);
              }

              await deliverEvent(event.type, properties);
              const aliasType = EVENT_ALIASES[event.type];
              if (aliasType && data?.sessionID !== undefined) {
                await deliverEvent(aliasType, {
                  sessionID: data.sessionID,
                  info: { id: data.sessionID },
                });
              }

              const mappings = EVENT_MAPPINGS[event.type];
              if (mappings) {
                for (const mapping of Array.isArray(mappings) ? mappings : [mappings]) {
                  const properties = mapping.properties(data, event);
                  if (properties === null) continue;
                  await deliverEvent(mapping.type, properties);
                }
              }

              if (event.type === 'session.deleted') {
                const sessionID = data?.sessionID ?? data?.info?.id;
                if (sessionID !== undefined) {
                  announcedSessions.delete(sessionID);
                }
              }
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
          const originalArgs = event.input;
          const hookInput = {
            tool: toV1ToolName(event.tool),
            sessionID: event.sessionID,
            callID: event.id,
          };
          const hookOutput = { args: toV1ToolArgs(event.tool, originalArgs) };
          await hooks['tool.execute.before'](hookInput, hookOutput);
          event.input = toV2ToolArgs(event.tool, originalArgs, hookOutput.args);
        });
        registrations.push(registration);
      }

      if (typeof hooks['tool.execute.after'] === 'function') {
        const registration = await ctx.tool.hook('execute.after', async (event) => {
          const hookInput = {
            tool: toV1ToolName(event.tool),
            sessionID: event.sessionID,
            callID: event.id,
            args: toV1ToolArgs(event.tool, event.input),
          };
          await hooks['tool.execute.after'](hookInput, toV1ToolHookOutput(event));
        });
        registrations.push(registration);
      }

      if (typeof hooks['experimental.chat.system.transform'] === 'function') {
        const registration = await ctx.session.hook('context', async (event) => {
          // An event hook failure belongs to the event path's report, not to this request.
          try {
            await announceSession(event.sessionID);
          } catch (error) {
            eventFailure ??= error;
          }
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

// ─────────────────────────────────────────────────────────────────────────────
// 5. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

export { MAPPED_HOOKS, EVENT_ALIASES, EVENT_MAPPINGS, TOOL_ALIASES };
