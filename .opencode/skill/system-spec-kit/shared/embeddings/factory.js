// ───────────────────────────────────────────────────────────────
// FACTORY.JS: Provider resolution and factory for embeddings
// ───────────────────────────────────────────────────────────────
'use strict';

const { HfLocalProvider } = require('./providers/hf-local');
const { OpenAIProvider } = require('./providers/openai');
const { VoyageProvider } = require('./providers/voyage');

/* ───────────────────────────────────────────────────────────────
   1. PROVIDER RESOLUTION
   ─────────────────────────────────────────────────────────────── */

/**
 * Resolve provider based on env vars.
 * Precedence: 1) EMBEDDINGS_PROVIDER, 2) VOYAGE_API_KEY, 3) OPENAI_API_KEY, 4) hf-local
 */
function resolve_provider() {
  const explicit_provider = process.env.EMBEDDINGS_PROVIDER;
  if (explicit_provider && explicit_provider !== 'auto') {
    return {
      name: explicit_provider,
      reason: 'Explicit EMBEDDINGS_PROVIDER variable',
    };
  }

  if (process.env.VOYAGE_API_KEY) {
    return {
      name: 'voyage',
      reason: 'VOYAGE_API_KEY detected (auto mode)',
    };
  }

  if (process.env.OPENAI_API_KEY) {
    return {
      name: 'openai',
      reason: 'OPENAI_API_KEY detected (auto mode)',
    };
  }

  return {
    name: 'hf-local',
    reason: 'Default fallback (no API keys detected)',
  };
}

/* ───────────────────────────────────────────────────────────────
   2. PROVIDER FACTORY
   ─────────────────────────────────────────────────────────────── */

/** Create provider instance based on configuration */
async function create_embeddings_provider(options = {}) {
  const resolution = resolve_provider();
  const provider_name = options.provider === 'auto' || !options.provider 
    ? resolution.name 
    : options.provider;

  console.error(`[factory] Using provider: ${provider_name} (${resolution.reason})`);

  let provider;

  try {
    switch (provider_name) {
      case 'voyage':
        if (!process.env.VOYAGE_API_KEY && !options.apiKey) {
          throw new Error(
            'Voyage provider requires VOYAGE_API_KEY. ' +
            'Set the variable or use EMBEDDINGS_PROVIDER=hf-local to force local.'
          );
        }
        provider = new VoyageProvider({
          model: options.model,
          dim: options.dim,
          apiKey: options.apiKey,
        });
        break;

      case 'openai':
        if (!process.env.OPENAI_API_KEY && !options.apiKey) {
          throw new Error(
            'OpenAI provider requires OPENAI_API_KEY. ' +
            'Set the variable or use EMBEDDINGS_PROVIDER=hf-local to force local.'
          );
        }
        provider = new OpenAIProvider({
          model: options.model,
          dim: options.dim,
          apiKey: options.apiKey,
        });
        break;

      case 'hf-local':
        provider = new HfLocalProvider({
          model: options.model,
          dim: options.dim,
        });
        break;

      case 'ollama':
        throw new Error('Ollama provider not yet implemented. Use hf-local, voyage, or openai.');

      default:
        throw new Error(
          `Unknown provider: ${provider_name}. ` +
          `Valid values: voyage, openai, hf-local, auto`
        );
    }

    if (options.warmup) {
      console.error(`[factory] Warming up ${provider_name}...`);
      const success = await provider.warmup();
      if (!success) {
        console.warn(`[factory] Warmup failed for ${provider_name}`);
        
        if (provider_name === 'openai' && !options.provider) {
          console.warn('[factory] Attempting fallback to hf-local...');
          provider = new HfLocalProvider({
            model: options.model,
            dim: options.dim,
          });
          await provider.warmup();
        }
      }
    }

    return provider;

  } catch (error) {
    console.error(`[factory] Error creating provider ${provider_name}:`, error.message);
    
    if (provider_name === 'openai' && !options.provider) {
      console.warn('[factory] Fallback to hf-local due to OpenAI error');
      provider = new HfLocalProvider({
        model: options.model,
        dim: options.dim,
      });
      
      if (options.warmup) {
        await provider.warmup();
      }
      
      return provider;
    }
    
    throw error;
  }
}

/* ───────────────────────────────────────────────────────────────
   3. PROVIDER INFO
   ─────────────────────────────────────────────────────────────── */

/** Get configuration information without creating the provider */
function get_provider_info() {
  const resolution = resolve_provider();
  
  return {
    provider: resolution.name,
    reason: resolution.reason,
    config: {
      EMBEDDINGS_PROVIDER: process.env.EMBEDDINGS_PROVIDER || 'auto',
      VOYAGE_API_KEY: process.env.VOYAGE_API_KEY ? '***set***' : 'not set',
      VOYAGE_EMBEDDINGS_MODEL: process.env.VOYAGE_EMBEDDINGS_MODEL || 'voyage-3.5',
      OPENAI_API_KEY: process.env.OPENAI_API_KEY ? '***set***' : 'not set',
      OPENAI_EMBEDDINGS_MODEL: process.env.OPENAI_EMBEDDINGS_MODEL || 'text-embedding-3-small',
      HF_EMBEDDINGS_MODEL: process.env.HF_EMBEDDINGS_MODEL || 'nomic-ai/nomic-embed-text-v1.5',
    },
  };
}

module.exports = {
  create_embeddings_provider,
  resolve_provider,
  get_provider_info,
};
