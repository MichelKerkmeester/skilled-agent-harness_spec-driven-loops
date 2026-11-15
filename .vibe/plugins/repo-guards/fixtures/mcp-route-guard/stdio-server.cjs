#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────────
// MODULE: Fixture stdio MCP server
// ───────────────────────────────────────────────────────────────────
// A dependency-free MCP server with one get_file tool, registered under a
// family that has a Code Mode manual so a live session has a native MCP tool
// for the route guard to refuse. It speaks newline-delimited JSON-RPC over
// stdio. Each request method is appended to the file MCP_FIXTURE_LOG names,
// so a check can tell a server that never started from a guard that never
// fired.

'use strict';

const fs = require('node:fs');
const path = require('node:path');
const readline = require('node:readline');

const SERVER_INFO = { name: 'fixture-file-server', version: '1.0.0' };
const DEFAULT_PROTOCOL = '2025-06-18';
const TOOL = {
  name: 'get_file',
  description: 'Read a text file from the working directory and return its contents.',
  inputSchema: {
    type: 'object',
    properties: { path: { type: 'string', description: 'File path relative to the working directory' } },
    required: ['path'],
  },
};

/**
 * Append one line to the fixture log when the caller asked for one.
 *
 * @param {string} line - Text to record.
 * @returns {void}
 */
function record(line) {
  const log = process.env.MCP_FIXTURE_LOG;
  if (!log) return;
  try {
    fs.appendFileSync(log, `${line}\n`);
  } catch {
    // A log that cannot be written must not break the protocol.
  }
}

/**
 * Write one JSON-RPC message.
 *
 * @param {Object} message - Response object.
 * @returns {void}
 */
function send(message) {
  process.stdout.write(`${JSON.stringify({ jsonrpc: '2.0', ...message })}\n`);
}

/**
 * Read the requested file as the tool result.
 *
 * @param {Object} args - Tool arguments.
 * @returns {Object} MCP tool result.
 */
function getFile(args) {
  const target = path.resolve(process.cwd(), String((args && args.path) || ''));
  try {
    return { content: [{ type: 'text', text: fs.readFileSync(target, 'utf8') }] };
  } catch (error) {
    return { content: [{ type: 'text', text: `cannot read ${target}: ${error.message}` }], isError: true };
  }
}

/**
 * Answer one request. Notifications get no reply.
 *
 * @param {Object} request - Parsed JSON-RPC message.
 * @returns {void}
 */
function handle(request) {
  const { id, method, params } = request;
  record(method || 'unknown');
  if (id === undefined || id === null) return;
  if (method === 'initialize') {
    send({
      id,
      result: {
        protocolVersion: (params && params.protocolVersion) || DEFAULT_PROTOCOL,
        capabilities: { tools: {} },
        serverInfo: SERVER_INFO,
      },
    });
    return;
  }
  if (method === 'ping') {
    send({ id, result: {} });
    return;
  }
  if (method === 'tools/list') {
    send({ id, result: { tools: [TOOL] } });
    return;
  }
  if (method === 'tools/call') {
    if (!params || params.name !== TOOL.name) {
      send({ id, error: { code: -32602, message: `unknown tool: ${params && params.name}` } });
      return;
    }
    send({ id, result: getFile(params.arguments) });
    return;
  }
  send({ id, error: { code: -32601, message: `method not found: ${method}` } });
}

readline.createInterface({ input: process.stdin }).on('line', (line) => {
  if (!line.trim()) return;
  let request;
  try {
    request = JSON.parse(line);
  } catch {
    send({ id: null, error: { code: -32700, message: 'parse error' } });
    return;
  }
  handle(request);
});
