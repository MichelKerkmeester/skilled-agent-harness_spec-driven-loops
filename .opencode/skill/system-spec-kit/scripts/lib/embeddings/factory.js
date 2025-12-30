/**
 * Embeddings Factory - Create the appropriate provider based on configuration
 * 
 * Configuration precedence:
 * 1. EMBEDDINGS_PROVIDER (if not 'auto')
 * 2. Auto-detection: OpenAI if OPENAI_API_KEY exists
 * 3. Fallback: HF local
 * 
 * @module embeddings/factory
 * @version 1.0.0
 */

'use strict';

const { HFLocalProvider } = require('./providers/hf-local');
const { OpenAIProvider } = require('./providers/openai');

// ───────────────────────────────────────────────────────────────
// PROVIDER CONFIGURATION
// ───────────────────────────────────────────────────────────────

/**
 * Resolve the provider to use based on env vars
 * 
 * @returns {{name: string, reason: string}} Selected provider and reason
 */
function resolveProvider() {
  // 1. Check for explicit override
  const explicitProvider = process.env.EMBEDDINGS_PROVIDER;
  if (explicitProvider && explicitProvider !== 'auto') {
    return {
      name: explicitProvider,
      reason: 'Explicit EMBEDDINGS_PROVIDER variable'
    };
  }

  // 2. Auto-detection: OpenAI if key exists
  if (process.env.OPENAI_API_KEY) {
    return {
      name: 'openai',
      reason: 'OPENAI_API_KEY detected (auto mode)'
    };
  }

  // 3. Fallback to local
  return {
    name: 'hf-local',
    reason: 'Default fallback (no OPENAI_API_KEY)'
  };
}

/**
 * Create provider instance based on configuration
 * 
 * @param {Object} options - Configuration options
 * @param {string} options.provider - Provider name ('openai', 'hf-local', 'auto')
 * @param {string} options.model - Model to use (optional, uses provider default)
 * @param {number} options.dim - Embedding dimension (optional)
 * @param {boolean} options.warmup - Whether to pre-warm the model (default: false)
 * @returns {Promise<Object>} Provider instance
 */
async function createEmbeddingsProvider(options = {}) {
  // Resolve provider
  const resolution = resolveProvider();
  const providerName = options.provider === 'auto' || !options.provider 
    ? resolution.name 
    : options.provider;

  console.log(`[factory] Using provider: ${providerName} (${resolution.reason})`);

  let provider;

  try {
    switch (providerName) {
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
          apiKey: options.apiKey
        });
        break;

      case 'hf-local':
        provider = new HFLocalProvider({
          model: options.model,
          dim: options.dim
        });
        break;

      case 'ollama':
        throw new Error('Ollama provider not yet implemented. Use hf-local or openai.');

      default:
        throw new Error(
          `Unknown provider: ${providerName}. ` +
          `Valid values: openai, hf-local, auto`
        );
    }

    // Warmup if requested
    if (options.warmup) {
      console.log(`[factory] Warming up ${providerName}...`);
      const success = await provider.warmup();
      if (!success) {
        console.warn(`[factory] Warmup failed for ${providerName}`);
        
        // If OpenAI failed in auto mode, try fallback to local
        if (providerName === 'openai' && !options.provider) {
          console.warn('[factory] Attempting fallback to hf-local...');
          provider = new HFLocalProvider({
            model: options.model,
            dim: options.dim
          });
          await provider.warmup();
        }
      }
    }

    return provider;

  } catch (error) {
    console.error(`[factory] Error creating provider ${providerName}:`, error.message);
    
    // If OpenAI failed in auto mode, try fallback to local
    if (providerName === 'openai' && !options.provider) {
      console.warn('[factory] Fallback to hf-local due to OpenAI error');
      provider = new HFLocalProvider({
        model: options.model,
        dim: options.dim
      });
      
      if (options.warmup) {
        await provider.warmup();
      }
      
      return provider;
    }
    
    throw error;
  }
}

/**
 * Get configuration information without creating the provider
 * 
 * @returns {Object} Configuration information
 */
function getProviderInfo() {
  const resolution = resolveProvider();
  
  return {
    provider: resolution.name,
    reason: resolution.reason,
    config: {
      EMBEDDINGS_PROVIDER: process.env.EMBEDDINGS_PROVIDER || 'auto',
      OPENAI_API_KEY: process.env.OPENAI_API_KEY ? '***set***' : 'not set',
      OPENAI_EMBEDDINGS_MODEL: process.env.OPENAI_EMBEDDINGS_MODEL || 'default',
      HF_EMBEDDINGS_MODEL: process.env.HF_EMBEDDINGS_MODEL || 'default'
    }
  };
}

module.exports = {
  createEmbeddingsProvider,
  resolveProvider,
  getProviderInfo
};
