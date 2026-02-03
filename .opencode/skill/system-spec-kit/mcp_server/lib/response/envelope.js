// ───────────────────────────────────────────────────────────────
// LIB: RESPONSE ENVELOPE
// ───────────────────────────────────────────────────────────────
'use strict';

const { estimate_tokens } = require('../../formatters/token-metrics');

/* ─────────────────────────────────────────────────────────────
   1. CONSTANTS
────────────────────────────────────────────────────────────────*/

const DEFAULT_HINTS = {
  empty_results: [
    'Try broadening your search query',
    'Use memory_list() to browse available memories',
    'Check if specFolder filter is too restrictive'
  ],
  success: [],
  rate_limited: [
    'Wait before retrying',
    'Consider batching operations'
  ]
};

/* ─────────────────────────────────────────────────────────────
   2. RESPONSE ENVELOPE FACTORY
────────────────────────────────────────────────────────────────*/

function createResponse(options) {
  const {
    tool,
    summary,
    data,
    hints = [],
    startTime = null,
    cacheHit = false,
    extraMeta = {}
  } = options;

  // Calculate latency if start time provided
  const latencyMs = startTime ? Date.now() - startTime : null;

  // Estimate token count from data
  const dataString = JSON.stringify(data);
  const tokenCount = estimate_tokens(dataString);

  // Build meta object
  const meta = {
    tool,
    tokenCount,
    ...(latencyMs !== null && { latencyMs }),
    cacheHit,
    ...extraMeta
  };

  return {
    summary,
    data,
    hints,
    meta
  };
}

function createSuccessResponse(options) {
  return createResponse({
    ...options,
    hints: options.hints || DEFAULT_HINTS.success
  });
}

function createEmptyResponse(options) {
  const {
    tool,
    summary = 'No results found',
    data = {},
    hints = DEFAULT_HINTS.empty_results,
    startTime = null
  } = options;

  return createResponse({
    tool,
    summary,
    data: {
      count: 0,
      results: [],
      ...data
    },
    hints,
    startTime
  });
}

function createErrorResponse(options) {
  const {
    tool,
    error,
    code = 'E001',
    details = {},
    recovery = null,
    startTime = null
  } = options;

  const errorMessage = error instanceof Error ? error.message : String(error);

  // Build hints from recovery object
  const hints = [];
  if (recovery) {
    if (recovery.hint) hints.push(recovery.hint);
    if (recovery.actions) hints.push(...recovery.actions);
    if (recovery.toolTip) hints.push(recovery.toolTip);
  }

  return createResponse({
    tool,
    summary: `Error: ${errorMessage}`,
    data: {
      error: errorMessage,
      code,
      details
    },
    hints,
    startTime,
    extraMeta: {
      isError: true,
      severity: recovery?.severity || 'error'
    }
  });
}

/* ─────────────────────────────────────────────────────────────
   3. MCP RESPONSE WRAPPER
────────────────────────────────────────────────────────────────*/

function wrapForMCP(envelope, isError = false) {
  // Check if envelope meta indicates an error
  const isErrorResponse = isError || envelope.meta?.isError || false;

  return {
    content: [{
      type: 'text',
      text: JSON.stringify(envelope, null, 2)
    }],
    isError: isErrorResponse
  };
}

function createMCPResponse(options) {
  const envelope = createResponse(options);
  return wrapForMCP(envelope);
}

function createMCPSuccessResponse(options) {
  const envelope = createSuccessResponse(options);
  return wrapForMCP(envelope);
}

function createMCPEmptyResponse(options) {
  const envelope = createEmptyResponse(options);
  return wrapForMCP(envelope);
}

function createMCPErrorResponse(options) {
  const envelope = createErrorResponse(options);
  return wrapForMCP(envelope, true);
}

/* ─────────────────────────────────────────────────────────────
   4. MODULE EXPORTS
────────────────────────────────────────────────────────────────*/

module.exports = {
  // Core envelope functions
  createResponse,
  createSuccessResponse,
  createEmptyResponse,
  createErrorResponse,

  // MCP wrapper
  wrapForMCP,

  // Combined convenience functions
  createMCPResponse,
  createMCPSuccessResponse,
  createMCPEmptyResponse,
  createMCPErrorResponse,

  // Constants
  DEFAULT_HINTS
};
