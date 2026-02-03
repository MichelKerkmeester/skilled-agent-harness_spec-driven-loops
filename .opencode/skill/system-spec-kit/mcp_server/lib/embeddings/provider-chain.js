// ───────────────────────────────────────────────────────────────
// EMBEDDINGS: PROVIDER CHAIN
// ───────────────────────────────────────────────────────────────
'use strict';

const { ERROR_CODES, getRecoveryHint } = require('../errors/recovery-hints.js');

/* ─────────────────────────────────────────────────────────────
   1. CONFIGURATION
────────────────────────────────────────────────────────────────*/

const FALLBACK_TIMEOUT_MS = 100;

const PROVIDER_TIER = {
  PRIMARY: 'primary',
  SECONDARY: 'secondary',
  TERTIARY: 'tertiary',
};

const FALLBACK_REASONS = {
  API_KEY_INVALID: 'API key invalid or expired',
  API_UNAVAILABLE: 'API provider unavailable',
  API_TIMEOUT: 'API request timed out',
  API_RATE_LIMITED: 'API rate limited',
  API_ERROR: 'API returned error',
  LOCAL_UNAVAILABLE: 'Local model not available',
  LOCAL_ERROR: 'Local model error',
  INIT_FAILED: 'Provider initialization failed',
  NETWORK_ERROR: 'Network connectivity issue',
};

/* ─────────────────────────────────────────────────────────────
   2. BM25-ONLY PROVIDER
────────────────────────────────────────────────────────────────*/

class BM25OnlyProvider {
  constructor() {
    this.initialized = true;
    this.activated_at = null;
    this.activation_reason = null;
  }

  activate(reason) {
    this.activated_at = Date.now();
    this.activation_reason = reason;
    console.warn(
      `[provider-chain] BM25-only mode activated: ${reason}`
    );
  }

  async embed(text) {
    // Return null to signal no embedding available
    // Search layer should fall back to BM25/FTS5
    return null;
  }

  async batchEmbed(texts, options = {}) {
    return texts.map(() => null);
  }

  async embedQuery(query) {
    return null;
  }

  async embedDocument(document) {
    return null;
  }

  getDimension() {
    return 0; // No embeddings
  }

  getModelName() {
    return 'bm25-only';
  }

  getProfile() {
    return {
      provider: 'bm25-only',
      model: 'bm25-only',
      dim: 0,
      mode: 'text-only',
      get_database_path: () => null,
    };
  }

  isReady() {
    return this.initialized;
  }

  async initialize() {
    this.initialized = true;
  }

  async validateCredentials() {
    // No credentials needed for BM25
    return true;
  }

  getProviderName() {
    return 'bm25-only';
  }

  async close() {
    this.initialized = false;
  }

  getActivationInfo() {
    return {
      activated: this.activated_at !== null,
      activated_at: this.activated_at,
      reason: this.activation_reason,
    };
  }
}

/* ─────────────────────────────────────────────────────────────
   3. EMBEDDING PROVIDER CHAIN
────────────────────────────────────────────────────────────────*/

class EmbeddingProviderChain {
  constructor(options = {}) {
    this.primaryProvider = options.primaryProvider || null;
    this.localProvider = options.localProvider || null;
    this.bm25Provider = new BM25OnlyProvider();

    // CHK-174: ENABLE_LOCAL_FALLBACK env var controls local model
    const envLocalFallback = process.env.ENABLE_LOCAL_FALLBACK;
    this.enableLocalFallback = options.enableLocalFallback !== undefined
      ? options.enableLocalFallback
      : envLocalFallback !== 'false' && envLocalFallback !== '0';

    this.fallbackTimeoutMs = options.fallbackTimeoutMs || FALLBACK_TIMEOUT_MS;

    // Current active provider
    this.activeProvider = null;
    this.activeTier = null;

    // Fallback history for diagnostics
    this.fallbackLog = [];

    // Initialization state
    this.initialized = false;
    this.initializationError = null;
  }

  /* ─────────────────────────────────────────────────────────────
     3.1 INITIALIZATION
  ────────────────────────────────────────────────────────────────*/

  async initialize() {
    if (this.initialized) {
      return;
    }

    const startTime = Date.now();

    // Try primary provider first
    if (this.primaryProvider) {
      try {
        await this._tryProvider(
          this.primaryProvider,
          PROVIDER_TIER.PRIMARY,
          'Primary API provider'
        );
        this.initialized = true;
        return;
      } catch (error) {
        this._logFallback(
          PROVIDER_TIER.PRIMARY,
          this.primaryProvider.getProviderName?.() || 'primary',
          this._classifyFallbackReason(error),
          error
        );
      }
    }

    // Try local provider if enabled
    if (this.enableLocalFallback && this.localProvider) {
      try {
        // Check remaining time for fallback
        const elapsed = Date.now() - startTime;
        if (elapsed >= this.fallbackTimeoutMs) {
          console.warn(
            `[provider-chain] Fallback timeout exceeded (${elapsed}ms), skipping local`
          );
        } else {
          await this._tryProvider(
            this.localProvider,
            PROVIDER_TIER.SECONDARY,
            'Local model provider'
          );
          this.initialized = true;
          return;
        }
      } catch (error) {
        this._logFallback(
          PROVIDER_TIER.SECONDARY,
          this.localProvider.getProviderName?.() || 'local',
          this._classifyFallbackReason(error),
          error
        );

        // CHK-175: Include download instructions in error
        this._logLocalModelInstructions();
      }
    } else if (!this.enableLocalFallback) {
      console.warn(
        `[provider-chain] Local fallback disabled (ENABLE_LOCAL_FALLBACK=${process.env.ENABLE_LOCAL_FALLBACK})`
      );
    }

    // Fall back to BM25-only mode
    this._activateBM25Only();
    this.initialized = true;
  }

  async _tryProvider(provider, tier, description) {
    if (!provider) {
      throw new Error(`No ${description} configured`);
    }

    // Initialize if needed
    if (provider.initialize && !provider.isReady?.()) {
      await provider.initialize();
    }

    // Validate credentials if method exists
    if (provider.validateCredentials) {
      const valid = await provider.validateCredentials();
      if (!valid) {
        throw new Error('Credentials validation failed');
      }
    }

    // Test with a simple embedding
    const testEmbedding = await provider.embed?.('test')
      || await provider.embedQuery?.('test');

    if (!testEmbedding) {
      throw new Error('Provider returned null for test embedding');
    }

    // Success - activate this provider
    this.activeProvider = provider;
    this.activeTier = tier;

    console.error(
      `[provider-chain] Activated ${description} ` +
      `(${provider.getProviderName?.() || 'unknown'}) as ${tier}`
    );
  }

  _activateBM25Only() {
    this.bm25Provider.activate('All embedding providers failed');
    this.activeProvider = this.bm25Provider;
    this.activeTier = PROVIDER_TIER.TERTIARY;

    this._logFallback(
      PROVIDER_TIER.TERTIARY,
      'bm25-only',
      'All embedding providers exhausted',
      null
    );
  }

  /* ─────────────────────────────────────────────────────────────
     3.2 EMBEDDING METHODS
  ────────────────────────────────────────────────────────────────*/

  async embed(text) {
    await this._ensureInitialized();

    try {
      return await this._embedWithFallback(
        () => this.activeProvider.embed?.(text)
          || this.activeProvider.embedQuery?.(text)
      );
    } catch (error) {
      console.warn(`[provider-chain] embed() failed: ${error.message}`);
      return null;
    }
  }

  async batchEmbed(texts, options = {}) {
    await this._ensureInitialized();

    try {
      if (this.activeProvider.batchEmbed) {
        return await this._embedWithFallback(
          () => this.activeProvider.batchEmbed(texts, options)
        );
      }

      // Fallback to sequential embeds
      const results = [];
      for (const text of texts) {
        results.push(await this.embed(text));
      }
      return results;
    } catch (error) {
      console.warn(`[provider-chain] batchEmbed() failed: ${error.message}`);
      return texts.map(() => null);
    }
  }

  async embedQuery(query) {
    await this._ensureInitialized();

    try {
      return await this._embedWithFallback(
        () => this.activeProvider.embedQuery?.(query)
          || this.activeProvider.embed?.(query)
      );
    } catch (error) {
      console.warn(`[provider-chain] embedQuery() failed: ${error.message}`);
      return null;
    }
  }

  async embedDocument(document) {
    await this._ensureInitialized();

    try {
      return await this._embedWithFallback(
        () => this.activeProvider.embedDocument?.(document)
          || this.activeProvider.embed?.(document)
      );
    } catch (error) {
      console.warn(`[provider-chain] embedDocument() failed: ${error.message}`);
      return null;
    }
  }

  async _embedWithFallback(embedFn) {
    const startTime = Date.now();

    try {
      const result = await embedFn();
      return result;
    } catch (error) {
      // Log the failure
      this._logFallback(
        this.activeTier,
        this.activeProvider?.getProviderName?.() || 'unknown',
        this._classifyFallbackReason(error),
        error
      );

      // Try to fall back to next provider
      await this._fallbackToNext(startTime);

      // Retry with new provider (may be BM25-only returning null)
      return await embedFn().catch(() => null);
    }
  }

  async _fallbackToNext(startTime) {
    const elapsed = Date.now() - startTime;

    // CHK-173: Check timeout
    if (elapsed >= this.fallbackTimeoutMs) {
      console.warn(
        `[provider-chain] Fallback timeout exceeded (${elapsed}ms >= ${this.fallbackTimeoutMs}ms)`
      );
      this._activateBM25Only();
      return;
    }

    // Determine next provider based on current tier
    if (this.activeTier === PROVIDER_TIER.PRIMARY && this.enableLocalFallback && this.localProvider) {
      try {
        await this._tryProvider(
          this.localProvider,
          PROVIDER_TIER.SECONDARY,
          'Local model provider'
        );
        return;
      } catch (error) {
        this._logFallback(
          PROVIDER_TIER.SECONDARY,
          this.localProvider?.getProviderName?.() || 'local',
          this._classifyFallbackReason(error),
          error
        );
        this._logLocalModelInstructions();
      }
    }

    // Fall through to BM25-only
    this._activateBM25Only();
  }

  /* ─────────────────────────────────────────────────────────────
     3.3 PROVIDER INFO METHODS
  ────────────────────────────────────────────────────────────────*/

  getDimension() {
    return this.activeProvider?.getDimension?.() || 0;
  }

  getModelName() {
    return this.activeProvider?.getModelName?.() || 'not-initialized';
  }

  getProfile() {
    return this.activeProvider?.getProfile?.() || null;
  }

  isReady() {
    return this.initialized && this.activeProvider !== null;
  }

  getProviderName() {
    return this.activeProvider?.getProviderName?.() || 'not-initialized';
  }

  getActiveTier() {
    return this.activeTier;
  }

  isBM25Only() {
    return this.activeTier === PROVIDER_TIER.TERTIARY;
  }

  async validateCredentials() {
    if (!this.activeProvider) {
      return false;
    }
    if (this.activeProvider.validateCredentials) {
      return await this.activeProvider.validateCredentials();
    }
    return true;
  }

  async close() {
    const closePromises = [];

    if (this.primaryProvider?.close) {
      closePromises.push(this.primaryProvider.close().catch(() => {}));
    }
    if (this.localProvider?.close) {
      closePromises.push(this.localProvider.close().catch(() => {}));
    }
    if (this.bm25Provider?.close) {
      closePromises.push(this.bm25Provider.close().catch(() => {}));
    }

    await Promise.all(closePromises);
    this.initialized = false;
    this.activeProvider = null;
    this.activeTier = null;
  }

  /* ─────────────────────────────────────────────────────────────
     3.4 DIAGNOSTICS
  ────────────────────────────────────────────────────────────────*/

  getFallbackLog() {
    return [...this.fallbackLog];
  }

  getStatus() {
    return {
      initialized: this.initialized,
      activeTier: this.activeTier,
      activeProvider: this.activeProvider?.getProviderName?.() || null,
      isBM25Only: this.isBM25Only(),
      enableLocalFallback: this.enableLocalFallback,
      fallbackTimeoutMs: this.fallbackTimeoutMs,
      fallbackCount: this.fallbackLog.length,
      lastFallback: this.fallbackLog.length > 0
        ? this.fallbackLog[this.fallbackLog.length - 1]
        : null,
      providers: {
        primary: {
          configured: this.primaryProvider !== null,
          name: this.primaryProvider?.getProviderName?.() || null,
        },
        local: {
          configured: this.localProvider !== null,
          enabled: this.enableLocalFallback,
          name: this.localProvider?.getProviderName?.() || null,
        },
        bm25: {
          available: true,
          activated: this.bm25Provider.getActivationInfo?.().activated || false,
        },
      },
    };
  }

  /* ─────────────────────────────────────────────────────────────
     3.5 INTERNAL HELPERS
  ────────────────────────────────────────────────────────────────*/

  async _ensureInitialized() {
    if (!this.initialized) {
      await this.initialize();
    }
  }

  _logFallback(tier, providerName, reason, error) {
    const event = {
      timestamp: new Date().toISOString(),
      tier,
      provider: providerName,
      reason,
      errorMessage: error?.message || null,
      errorCode: error?.code || null,
    };

    this.fallbackLog.push(event);

    // CHK-172: Log with provider name and reason
    console.error(
      `[provider-chain] Fallback from ${providerName} (${tier}): ${reason}` +
      (error ? ` - ${error.message}` : '')
    );
  }

  _classifyFallbackReason(error) {
    if (!error) {
      return FALLBACK_REASONS.INIT_FAILED;
    }

    const message = error.message?.toLowerCase() || '';
    const code = error.code?.toUpperCase() || '';
    const status = error.status;

    // Check HTTP status codes
    if (status === 401 || status === 403) {
      return FALLBACK_REASONS.API_KEY_INVALID;
    }
    if (status === 429) {
      return FALLBACK_REASONS.API_RATE_LIMITED;
    }
    if (status >= 500 && status < 600) {
      return FALLBACK_REASONS.API_UNAVAILABLE;
    }

    // Check error codes
    if (code === 'ETIMEDOUT' || code === 'TIMEOUT') {
      return FALLBACK_REASONS.API_TIMEOUT;
    }
    if (code === 'ECONNREFUSED' || code === 'ENOTFOUND' || code === 'ENETUNREACH') {
      return FALLBACK_REASONS.NETWORK_ERROR;
    }

    // Check error messages
    if (message.includes('api key') || message.includes('unauthorized')) {
      return FALLBACK_REASONS.API_KEY_INVALID;
    }
    if (message.includes('timeout')) {
      return FALLBACK_REASONS.API_TIMEOUT;
    }
    if (message.includes('rate limit')) {
      return FALLBACK_REASONS.API_RATE_LIMITED;
    }
    if (message.includes('local') || message.includes('nomic') || message.includes('hf')) {
      return FALLBACK_REASONS.LOCAL_ERROR;
    }

    return FALLBACK_REASONS.API_ERROR;
  }

  _logLocalModelInstructions() {
    const hint = getRecoveryHint('embedding', ERROR_CODES.LOCAL_MODEL_UNAVAILABLE);

    console.error(
      `[provider-chain] Local model unavailable (${ERROR_CODES.LOCAL_MODEL_UNAVAILABLE}):\n` +
      `  ${hint.hint}\n` +
      `  Actions:\n` +
      hint.actions.map(a => `    - ${a}`).join('\n')
    );
  }
}

/* ─────────────────────────────────────────────────────────────
   4. FACTORY FUNCTION
────────────────────────────────────────────────────────────────*/

async function createProviderChain(options = {}) {
  // Dynamic import to avoid circular dependencies
  const { create_embeddings_provider, resolve_provider } = require('../../../shared/embeddings/factory.js');
  const { HfLocalProvider } = require('../../../shared/embeddings/providers/hf-local.js');

  // Resolve primary provider
  const resolution = resolve_provider();
  let primaryProvider = null;
  let localProvider = null;

  // Create primary provider (API-based)
  if (resolution.name === 'voyage' || resolution.name === 'openai') {
    try {
      primaryProvider = await create_embeddings_provider({
        provider: resolution.name,
        warmup: false,
      });
    } catch (error) {
      console.warn(`[provider-chain] Failed to create primary provider: ${error.message}`);
    }
  } else if (resolution.name === 'hf-local') {
    // If resolved to local, use it as primary
    try {
      primaryProvider = new HfLocalProvider();
    } catch (error) {
      console.warn(`[provider-chain] Failed to create local provider: ${error.message}`);
    }
  }

  // Create local provider for fallback (if not already primary)
  if (resolution.name !== 'hf-local') {
    try {
      localProvider = new HfLocalProvider();
    } catch (error) {
      console.warn(`[provider-chain] Failed to create fallback local provider: ${error.message}`);
    }
  }

  // Create and initialize chain
  const chain = new EmbeddingProviderChain({
    primaryProvider,
    localProvider,
    enableLocalFallback: options.enableLocalFallback,
    fallbackTimeoutMs: options.fallbackTimeoutMs,
  });

  await chain.initialize();

  return chain;
}

/* ─────────────────────────────────────────────────────────────
   5. MODULE EXPORTS
────────────────────────────────────────────────────────────────*/

module.exports = {
  // Classes
  EmbeddingProviderChain,
  BM25OnlyProvider,

  // Factory
  createProviderChain,

  // Constants
  FALLBACK_TIMEOUT_MS,
  PROVIDER_TIER,
  FALLBACK_REASONS,
};
