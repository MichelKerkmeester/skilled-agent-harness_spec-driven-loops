// ---------------------------------------------------------------
// MODULE: Memory CRUD Health Handler
// ---------------------------------------------------------------

import { checkDatabaseUpdated } from '../core';
import * as vectorIndex from '../lib/search/vector-index';
import * as embeddings from '../lib/providers/embeddings';
import { createMCPSuccessResponse, createMCPErrorResponse } from '../lib/response/envelope';
import { toErrorMessage } from '../utils';

import { isEmbeddingModelReady } from './memory-crud-state';

import type { MCPResponse, EmbeddingProfileExtended as EmbeddingProfile } from './types';
import type { HealthArgs, ProviderMetadata } from './memory-crud-types';

async function handleMemoryHealth(_args: HealthArgs): Promise<MCPResponse> {
  const startTime = Date.now();
  await checkDatabaseUpdated();

  const database = vectorIndex.getDb();
  let memoryCount = 0;
  try {
    if (database) {
      const countResult = database.prepare('SELECT COUNT(*) as count FROM memory_index')
        .get() as Record<string, number>;
      memoryCount = countResult.count;
    }
  } catch (err: unknown) {
    const message = toErrorMessage(err);
    if (message.includes('no such table')) {
      return createMCPErrorResponse({
        tool: 'memory_health',
        error: `Schema missing: ${message}. Run memory_index_scan() to create the database schema, or restart the MCP server.`,
        code: 'E_SCHEMA_MISSING',
        startTime,
      });
    }
    console.warn('[memory-health] Failed to get memory count:', message);
  }

  const providerMetadata = embeddings.getProviderMetadata() as ProviderMetadata;
  const profile = embeddings.getEmbeddingProfile() as EmbeddingProfile | null;
  const status = isEmbeddingModelReady() && database ? 'healthy' : 'degraded';

  const summary = `Memory system ${status}: ${memoryCount} memories indexed`;
  const hints: string[] = [];
  if (!isEmbeddingModelReady()) {
    hints.push('Embedding model not ready - some operations may fail');
  }
  if (!database) {
    hints.push('Database not connected - restart MCP server');
  }
  if (!vectorIndex.isVectorSearchAvailable()) {
    hints.push('Vector search unavailable - fallback to BM25');
  }

  return createMCPSuccessResponse({
    tool: 'memory_health',
    summary,
    data: {
      status,
      embeddingModelReady: isEmbeddingModelReady(),
      databaseConnected: !!database,
      vectorSearchAvailable: vectorIndex.isVectorSearchAvailable(),
      memoryCount,
      uptime: process.uptime(),
      version: '1.7.2',
      embeddingProvider: {
        provider: providerMetadata.provider,
        model: providerMetadata.model,
        dimension: profile ? profile.dim : 768,
        healthy: providerMetadata.healthy !== false,
        databasePath: vectorIndex.getDbPath(),
      },
    },
    hints,
    startTime,
  });
}

export { handleMemoryHealth };
