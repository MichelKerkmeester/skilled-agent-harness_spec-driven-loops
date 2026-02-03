// ───────────────────────────────────────────────────────────────
// TEST: RESPONSE ENVELOPE
// ───────────────────────────────────────────────────────────────
// Tests for REQ-019: Standardized Response Structure
'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');

// Module under test
const {
  createResponse,
  createSuccessResponse,
  createEmptyResponse,
  createErrorResponse,
  wrapForMCP,
  DEFAULT_HINTS
} = require('../lib/response/envelope.js');

describe('Response Envelope (T148-T155)', () => {

  describe('T148: Response envelope structure: summary, data, hints, meta', () => {
    it('should have all required fields in envelope', () => {
      const envelope = createResponse({
        tool: 'memory_search',
        summary: 'Found 3 results',
        data: { count: 3, results: [] }
      });

      assert.ok('summary' in envelope, 'Envelope must have summary field');
      assert.ok('data' in envelope, 'Envelope must have data field');
      assert.ok('hints' in envelope, 'Envelope must have hints field');
      assert.ok('meta' in envelope, 'Envelope must have meta field');
    });

    it('should have correct types for all fields', () => {
      const envelope = createResponse({
        tool: 'test_tool',
        summary: 'Test summary',
        data: { value: 42 }
      });

      assert.strictEqual(typeof envelope.summary, 'string');
      assert.strictEqual(typeof envelope.data, 'object');
      assert.ok(Array.isArray(envelope.hints));
      assert.strictEqual(typeof envelope.meta, 'object');
    });

    it('should include tool name in meta', () => {
      const envelope = createResponse({
        tool: 'memory_save',
        summary: 'Saved memory',
        data: {}
      });

      assert.strictEqual(envelope.meta.tool, 'memory_save');
    });
  });

  describe('T149: createResponse() returns valid envelope', () => {
    it('should create envelope with provided data', () => {
      const envelope = createResponse({
        tool: 'memory_search',
        summary: 'Found 5 matching memories',
        data: { searchType: 'hybrid', count: 5, results: ['a', 'b', 'c', 'd', 'e'] },
        hints: ['Use includeContent: true for full file contents']
      });

      assert.strictEqual(envelope.summary, 'Found 5 matching memories');
      assert.deepStrictEqual(envelope.data.searchType, 'hybrid');
      assert.strictEqual(envelope.data.count, 5);
      assert.strictEqual(envelope.hints.length, 1);
      assert.strictEqual(envelope.hints[0], 'Use includeContent: true for full file contents');
    });

    it('should default hints to empty array', () => {
      const envelope = createResponse({
        tool: 'test_tool',
        summary: 'Test',
        data: {}
      });

      assert.deepStrictEqual(envelope.hints, []);
    });

    it('should merge extra metadata', () => {
      const envelope = createResponse({
        tool: 'test_tool',
        summary: 'Test',
        data: {},
        extraMeta: { customField: 'customValue', version: '1.0' }
      });

      assert.strictEqual(envelope.meta.customField, 'customValue');
      assert.strictEqual(envelope.meta.version, '1.0');
    });
  });

  describe('T150: createSuccessResponse() sets isError=false', () => {
    it('should create success response without isError in meta', () => {
      const envelope = createSuccessResponse({
        tool: 'memory_search',
        summary: 'Operation successful',
        data: { status: 'ok' }
      });

      // Success responses should NOT have isError set
      assert.strictEqual(envelope.meta.isError, undefined);
    });

    it('should wrap success response with isError=false in MCP format', () => {
      const envelope = createSuccessResponse({
        tool: 'memory_search',
        summary: 'Success',
        data: {}
      });

      const mcpResponse = wrapForMCP(envelope);

      assert.strictEqual(mcpResponse.isError, false);
      assert.ok(Array.isArray(mcpResponse.content));
      assert.strictEqual(mcpResponse.content[0].type, 'text');
    });

    it('should use default success hints (empty array)', () => {
      const envelope = createSuccessResponse({
        tool: 'test_tool',
        summary: 'Test',
        data: {}
      });

      assert.deepStrictEqual(envelope.hints, DEFAULT_HINTS.success);
      assert.deepStrictEqual(envelope.hints, []);
    });
  });

  describe('T151: createEmptyResponse() handles no results', () => {
    it('should have default "No results found" summary', () => {
      const envelope = createEmptyResponse({
        tool: 'memory_search'
      });

      assert.strictEqual(envelope.summary, 'No results found');
    });

    it('should include count: 0 and empty results array', () => {
      const envelope = createEmptyResponse({
        tool: 'memory_search'
      });

      assert.strictEqual(envelope.data.count, 0);
      assert.deepStrictEqual(envelope.data.results, []);
    });

    it('should include empty_results hints by default', () => {
      const envelope = createEmptyResponse({
        tool: 'memory_search'
      });

      assert.deepStrictEqual(envelope.hints, DEFAULT_HINTS.empty_results);
      assert.ok(envelope.hints.length > 0);
      assert.ok(envelope.hints.includes('Try broadening your search query'));
    });

    it('should allow custom summary and data', () => {
      const envelope = createEmptyResponse({
        tool: 'memory_list',
        summary: 'No memories in folder',
        data: { folder: 'specs/test' }
      });

      assert.strictEqual(envelope.summary, 'No memories in folder');
      assert.strictEqual(envelope.data.folder, 'specs/test');
      assert.strictEqual(envelope.data.count, 0);
    });
  });

  describe('T152: createErrorResponse() includes recovery hints', () => {
    it('should format error message in summary', () => {
      const envelope = createErrorResponse({
        tool: 'memory_save',
        error: 'File not found'
      });

      assert.strictEqual(envelope.summary, 'Error: File not found');
    });

    it('should handle Error objects', () => {
      const error = new Error('Database connection failed');
      const envelope = createErrorResponse({
        tool: 'memory_search',
        error: error
      });

      assert.strictEqual(envelope.summary, 'Error: Database connection failed');
      assert.strictEqual(envelope.data.error, 'Database connection failed');
    });

    it('should include error code in data', () => {
      const envelope = createErrorResponse({
        tool: 'memory_save',
        error: 'Invalid format',
        code: 'E040'
      });

      assert.strictEqual(envelope.data.code, 'E040');
    });

    it('should include recovery hints from recovery object', () => {
      const envelope = createErrorResponse({
        tool: 'memory_search',
        error: 'Embedding service unavailable',
        recovery: {
          hint: 'Check API key configuration',
          actions: ['Verify VOYAGE_API_KEY is set', 'Restart MCP server'],
          toolTip: 'Use memory_list() as fallback',
          severity: 'warning'
        }
      });

      assert.ok(envelope.hints.includes('Check API key configuration'));
      assert.ok(envelope.hints.includes('Verify VOYAGE_API_KEY is set'));
      assert.ok(envelope.hints.includes('Restart MCP server'));
      assert.ok(envelope.hints.includes('Use memory_list() as fallback'));
    });

    it('should set isError=true in meta', () => {
      const envelope = createErrorResponse({
        tool: 'test_tool',
        error: 'Test error'
      });

      assert.strictEqual(envelope.meta.isError, true);
    });

    it('should set severity from recovery object', () => {
      const envelope = createErrorResponse({
        tool: 'test_tool',
        error: 'Test error',
        recovery: { severity: 'critical' }
      });

      assert.strictEqual(envelope.meta.severity, 'critical');
    });

    it('should default severity to error', () => {
      const envelope = createErrorResponse({
        tool: 'test_tool',
        error: 'Test error'
      });

      assert.strictEqual(envelope.meta.severity, 'error');
    });
  });

  describe('T153: meta.tokenCount estimation accuracy', () => {
    it('should estimate token count based on data size', () => {
      const envelope = createResponse({
        tool: 'memory_search',
        summary: 'Found results',
        data: { text: 'Hello world' } // ~11 chars + JSON overhead
      });

      assert.strictEqual(typeof envelope.meta.tokenCount, 'number');
      assert.ok(envelope.meta.tokenCount > 0);
    });

    it('should estimate ~4 chars per token', () => {
      // Create data with known length
      const testText = 'a'.repeat(100); // 100 chars = ~25 tokens
      const envelope = createResponse({
        tool: 'test_tool',
        summary: 'Test',
        data: { content: testText }
      });

      // JSON overhead for {"content":"aaa..."} adds chars
      // Expected: (100 + ~15 overhead) / 4 = ~29 tokens
      assert.ok(envelope.meta.tokenCount >= 25, `Expected at least 25 tokens, got ${envelope.meta.tokenCount}`);
      assert.ok(envelope.meta.tokenCount <= 40, `Expected at most 40 tokens, got ${envelope.meta.tokenCount}`);
    });

    it('should handle empty data', () => {
      const envelope = createResponse({
        tool: 'test_tool',
        summary: 'Test',
        data: {}
      });

      // {} = 2 chars = ~1 token
      assert.strictEqual(typeof envelope.meta.tokenCount, 'number');
      assert.ok(envelope.meta.tokenCount >= 1);
    });

    it('should handle nested objects', () => {
      const envelope = createResponse({
        tool: 'test_tool',
        summary: 'Test',
        data: {
          level1: {
            level2: {
              level3: { value: 'deep' }
            }
          }
        }
      });

      assert.ok(envelope.meta.tokenCount > 0);
    });
  });

  describe('T154: meta.latencyMs measurement', () => {
    it('should calculate latency when startTime provided', async () => {
      const startTime = Date.now();

      // Simulate some work
      await new Promise(resolve => setTimeout(resolve, 50));

      const envelope = createResponse({
        tool: 'memory_search',
        summary: 'Found results',
        data: {},
        startTime: startTime
      });

      assert.strictEqual(typeof envelope.meta.latencyMs, 'number');
      assert.ok(envelope.meta.latencyMs >= 50, `Expected latency >= 50ms, got ${envelope.meta.latencyMs}`);
    });

    it('should not include latencyMs when startTime not provided', () => {
      const envelope = createResponse({
        tool: 'test_tool',
        summary: 'Test',
        data: {}
      });

      assert.strictEqual(envelope.meta.latencyMs, undefined);
    });

    it('should measure latency in error responses', async () => {
      const startTime = Date.now();

      await new Promise(resolve => setTimeout(resolve, 30));

      const envelope = createErrorResponse({
        tool: 'test_tool',
        error: 'Test error',
        startTime: startTime
      });

      assert.ok(envelope.meta.latencyMs >= 30);
    });

    it('should measure latency in empty responses', async () => {
      const startTime = Date.now();

      await new Promise(resolve => setTimeout(resolve, 20));

      const envelope = createEmptyResponse({
        tool: 'memory_search',
        startTime: startTime
      });

      assert.ok(envelope.meta.latencyMs >= 20);
    });
  });

  describe('T155: meta.cacheHit flag', () => {
    it('should default cacheHit to false', () => {
      const envelope = createResponse({
        tool: 'memory_search',
        summary: 'Found results',
        data: {}
      });

      assert.strictEqual(envelope.meta.cacheHit, false);
    });

    it('should set cacheHit to true when specified', () => {
      const envelope = createResponse({
        tool: 'memory_search',
        summary: 'Found results (cached)',
        data: {},
        cacheHit: true
      });

      assert.strictEqual(envelope.meta.cacheHit, true);
    });

    it('should preserve cacheHit in success responses', () => {
      const envelope = createSuccessResponse({
        tool: 'memory_search',
        summary: 'Success',
        data: {},
        cacheHit: true
      });

      assert.strictEqual(envelope.meta.cacheHit, true);
    });

    it('should preserve cacheHit through MCP wrapper', () => {
      const envelope = createResponse({
        tool: 'test_tool',
        summary: 'Test',
        data: {},
        cacheHit: true
      });

      const mcpResponse = wrapForMCP(envelope);
      const parsedEnvelope = JSON.parse(mcpResponse.content[0].text);

      assert.strictEqual(parsedEnvelope.meta.cacheHit, true);
    });

    it('should handle cacheHit in empty responses', () => {
      const envelope = createEmptyResponse({
        tool: 'memory_search'
        // cacheHit not specified, should default via createResponse
      });

      assert.strictEqual(envelope.meta.cacheHit, false);
    });
  });

  describe('MCP wrapper integration', () => {
    it('should wrap envelope in MCP content format', () => {
      const envelope = createResponse({
        tool: 'test_tool',
        summary: 'Test',
        data: { value: 123 }
      });

      const mcpResponse = wrapForMCP(envelope);

      assert.ok(Array.isArray(mcpResponse.content));
      assert.strictEqual(mcpResponse.content.length, 1);
      assert.strictEqual(mcpResponse.content[0].type, 'text');
      assert.strictEqual(typeof mcpResponse.content[0].text, 'string');
    });

    it('should set isError from envelope meta', () => {
      const errorEnvelope = createErrorResponse({
        tool: 'test_tool',
        error: 'Test error'
      });

      const mcpResponse = wrapForMCP(errorEnvelope);

      assert.strictEqual(mcpResponse.isError, true);
    });

    it('should allow explicit isError override', () => {
      const envelope = createResponse({
        tool: 'test_tool',
        summary: 'Test',
        data: {}
      });

      const mcpResponse = wrapForMCP(envelope, true);

      assert.strictEqual(mcpResponse.isError, true);
    });

    it('should produce valid JSON in content text', () => {
      const envelope = createResponse({
        tool: 'test_tool',
        summary: 'Test',
        data: { nested: { deep: { value: 'test' } } }
      });

      const mcpResponse = wrapForMCP(envelope);
      const parsed = JSON.parse(mcpResponse.content[0].text);

      assert.deepStrictEqual(parsed.data.nested.deep.value, 'test');
    });
  });
});
