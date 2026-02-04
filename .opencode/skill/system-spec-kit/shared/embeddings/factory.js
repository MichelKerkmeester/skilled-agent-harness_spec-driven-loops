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

        // Fallback to hf-local for cloud providers when auto-detected (not explicitly set)
        if ((provider_name === 'openai' || provider_name === 'voyage') && !options.provider) {
          console.warn(`[factory] Attempting fallback from ${provider_name} to hf-local...`);
          provider = new HfLocalProvider({
            model: options.model,
            dim: options.dim,
          });
          // BUG-FIX: Wrap fallback warmup in try/catch to prevent unhandled errors
          try {
            await provider.warmup();
          } catch (fallback_warmup_error) {
            console.warn(`[factory] Fallback warmup failed: ${fallback_warmup_error.message}`);
            // Continue anyway - provider will attempt lazy initialization on first use
          }
        }
      }
    }

    return provider;

  } catch (error) {
    console.error(`[factory] Error creating provider ${provider_name}:`, error.message);

    // Fallback to hf-local for cloud providers when auto-detected (not explicitly set)
    if ((provider_name === 'openai' || provider_name === 'voyage') && !options.provider) {
      console.warn(`[factory] Fallback to hf-local due to ${provider_name} error`);
      provider = new HfLocalProvider({
        model: options.model,
        dim: options.dim,
      });

      if (options.warmup) {
        // BUG-FIX: Wrap fallback warmup in try/catch to prevent unhandled errors
        try {
          await provider.warmup();
        } catch (fallback_warmup_error) {
          console.warn(`[factory] Fallback warmup failed: ${fallback_warmup_error.message}`);
          // Continue anyway - provider will attempt lazy initialization on first use
        }
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
      VOYAGE_EMBEDDINGS_MODEL: process.env.VOYAGE_EMBEDDINGS_MODEL || 'voyage-4',
      OPENAI_API_KEY: process.env.OPENAI_API_KEY ? '***set***' : 'not set',
      OPENAI_EMBEDDINGS_MODEL: process.env.OPENAI_EMBEDDINGS_MODEL || 'text-embedding-3-small',
      HF_EMBEDDINGS_MODEL: process.env.HF_EMBEDDINGS_MODEL || 'nomic-ai/nomic-embed-text-v1.5',
    },
  };
}

/* ───────────────────────────────────────────────────────────────
   4. PRE-FLIGHT API KEY VALIDATION (REQ-029, T087-T090)
   ─────────────────────────────────────────────────────────────── */

/**
 * Validation timeout in milliseconds.
 * REQ-029, CHK-170: Must complete within 5s
 */
const VALIDATION_TIMEOUT_MS = 5000;

/**
 * Validate API key at startup before any tool usage.
 * REQ-029: Pre-Flight API Key Validation
 *
 * This function should be called during MCP server startup to fail fast
 * if the configured embedding provider has an invalid API key.
 *
 * @param {Object} options - Validation options
 * @param {number} options.timeout - Timeout in ms (default: 5000)
 * @returns {Promise<{valid: boolean, provider: string, error?: string, errorCode?: string}>}
 *
 * @example
 * const result = await validate_api_key();
 * if (!result.valid) {
 *   console.error(`API key validation failed: ${result.error}`);
 *   process.exit(1);
 * }
 */
async function validate_api_key(options = {}) {
  const timeout_ms = options.timeout || VALIDATION_TIMEOUT_MS;
  const resolution = resolve_provider();
  const provider_name = resolution.name;

  // Local providers don't need API key validation
  if (provider_name === 'hf-local' || provider_name === 'ollama') {
    return {
      valid: true,
      provider: provider_name,
      reason: 'Local provider - no API key required',
    };
  }

  // Check that API key environment variable is set
  const api_key = provider_name === 'voyage'
    ? process.env.VOYAGE_API_KEY
    : process.env.OPENAI_API_KEY;

  if (!api_key) {
    return {
      valid: false,
      provider: provider_name,
      error: `${provider_name.toUpperCase()}_API_KEY environment variable not set`,
      errorCode: 'E050',
      actions: [
        `Set ${provider_name.toUpperCase()}_API_KEY environment variable`,
        'Or use EMBEDDINGS_PROVIDER=hf-local to use local model',
        `Check provider dashboard: ${provider_name === 'voyage' ? 'voyage.ai/dashboard' : 'platform.openai.com/api-keys'}`,
      ],
    };
  }

  // Attempt a lightweight API call with timeout
  const controller = new AbortController();
  const timeout_id = setTimeout(() => controller.abort(), timeout_ms);

  try {
    const base_url = provider_name === 'voyage'
      ? 'https://api.voyageai.com/v1'
      : (process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1');

    const model = provider_name === 'voyage'
      ? (process.env.VOYAGE_EMBEDDINGS_MODEL || 'voyage-4')
      : (process.env.OPENAI_EMBEDDINGS_MODEL || 'text-embedding-3-small');

    const body = {
      input: 'api key validation test',
      model: model,
    };

    // Voyage uses input_type for optimization
    if (provider_name === 'voyage') {
      body.input_type = 'query';
    } else {
      body.encoding_format = 'float';
    }

    const response = await fetch(`${base_url}/embeddings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${api_key}`,
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    clearTimeout(timeout_id);

    if (!response.ok) {
      const error_body = await response.json().catch(() => ({}));
      const error_message = error_body.detail
        || error_body.error?.message
        || response.statusText;

      // Detect specific authentication errors
      const is_auth_error = response.status === 401 || response.status === 403;
      const is_rate_limit = response.status === 429;

      if (is_auth_error) {
        return {
          valid: false,
          provider: provider_name,
          error: `API key invalid or unauthorized: ${error_message}`,
          errorCode: 'E050',
          httpStatus: response.status,
          actions: [
            `Verify API key is correct in ${provider_name.toUpperCase()}_API_KEY`,
            `Check key validity at ${provider_name === 'voyage' ? 'voyage.ai/dashboard' : 'platform.openai.com/api-keys'}`,
            'Ensure key has embedding permissions enabled',
          ],
        };
      }

      if (is_rate_limit) {
        // Rate limit during validation still means the key is valid
        return {
          valid: true,
          provider: provider_name,
          warning: 'API key valid but rate limited - may affect operations',
          httpStatus: response.status,
        };
      }

      // Other errors (500, etc.) - key might be valid, service issue
      return {
        valid: true,
        provider: provider_name,
        warning: `Service returned error (${response.status}): ${error_message}`,
        httpStatus: response.status,
      };
    }

    return {
      valid: true,
      provider: provider_name,
      reason: 'API key validated successfully',
    };

  } catch (error) {
    clearTimeout(timeout_id);

    if (error.name === 'AbortError') {
      return {
        valid: false,
        provider: provider_name,
        error: `API key validation timed out after ${timeout_ms}ms`,
        errorCode: 'E053',
        actions: [
          'Check network connectivity',
          'Retry startup - may be transient',
          'Consider using local model: EMBEDDINGS_PROVIDER=hf-local',
        ],
      };
    }

    // Network errors - can't determine key validity
    return {
      valid: false,
      provider: provider_name,
      error: `Network error during validation: ${error.message}`,
      errorCode: 'E053',
      actions: [
        'Check internet connectivity',
        'Verify firewall allows outbound HTTPS',
        'Retry startup - may be transient',
      ],
    };
  }
}

module.exports = {
  create_embeddings_provider,
  resolve_provider,
  get_provider_info,
  validate_api_key,
  VALIDATION_TIMEOUT_MS,
};
