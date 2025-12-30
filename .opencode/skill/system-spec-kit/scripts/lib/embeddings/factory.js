/**
 * Factory de Embeddings - Crea el provider adecuado según configuración
 * 
 * Precedencia de configuración:
 * 1. EMBEDDINGS_PROVIDER (si no es 'auto')
 * 2. Auto-detección: OpenAI si existe OPENAI_API_KEY
 * 3. Fallback: HF local
 * 
 * @module embeddings/factory
 * @version 1.0.0
 */

'use strict';

const { HFLocalProvider } = require('./providers/hf-local');
const { OpenAIProvider } = require('./providers/openai');

// ───────────────────────────────────────────────────────────────
// CONFIGURACIÓN DE PROVIDERS
// ───────────────────────────────────────────────────────────────

/**
 * Resolver el provider a usar según env vars
 * 
 * @returns {{name: string, reason: string}} Provider seleccionado y razón
 */
function resolveProvider() {
  // 1. Verificar override explícito
  const explicitProvider = process.env.EMBEDDINGS_PROVIDER;
  if (explicitProvider && explicitProvider !== 'auto') {
    return {
      name: explicitProvider,
      reason: 'EMBEDDINGS_PROVIDER variable explícita'
    };
  }

  // 2. Auto-detección: OpenAI si existe la key
  if (process.env.OPENAI_API_KEY) {
    return {
      name: 'openai',
      reason: 'OPENAI_API_KEY detectada (modo auto)'
    };
  }

  // 3. Fallback a local
  return {
    name: 'hf-local',
    reason: 'fallback por defecto (sin OPENAI_API_KEY)'
  };
}

/**
 * Crear instancia del provider según configuración
 * 
 * @param {Object} options - Opciones de configuración
 * @param {string} options.provider - Nombre del provider ('openai', 'hf-local', 'auto')
 * @param {string} options.model - Modelo a usar (opcional, usa default del provider)
 * @param {number} options.dim - Dimensión del embedding (opcional)
 * @param {boolean} options.warmup - Si pre-calentar el modelo (default: false)
 * @returns {Promise<Object>} Instancia del provider
 */
async function createEmbeddingsProvider(options = {}) {
  // Resolver provider
  const resolution = resolveProvider();
  const providerName = options.provider === 'auto' || !options.provider 
    ? resolution.name 
    : options.provider;

  console.log(`[factory] Usando provider: ${providerName} (${resolution.reason})`);

  let provider;

  try {
    switch (providerName) {
      case 'openai':
        if (!process.env.OPENAI_API_KEY && !options.apiKey) {
          throw new Error(
            'OpenAI provider requiere OPENAI_API_KEY. ' +
            'Setear la variable o usar EMBEDDINGS_PROVIDER=hf-local para forzar local.'
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
        throw new Error('Ollama provider aún no implementado. Usar hf-local u openai.');

      default:
        throw new Error(
          `Provider desconocido: ${providerName}. ` +
          `Valores válidos: openai, hf-local, auto`
        );
    }

    // Warmup si se solicitó
    if (options.warmup) {
      console.log(`[factory] Pre-calentando ${providerName}...`);
      const success = await provider.warmup();
      if (!success) {
        console.warn(`[factory] Warmup falló para ${providerName}`);
        
        // Si falló OpenAI en modo auto, intentar fallback a local
        if (providerName === 'openai' && !options.provider) {
          console.warn('[factory] Intentando fallback a hf-local...');
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
    console.error(`[factory] Error creando provider ${providerName}:`, error.message);
    
    // Si falló OpenAI en modo auto, intentar fallback a local
    if (providerName === 'openai' && !options.provider) {
      console.warn('[factory] Fallback a hf-local debido a error en OpenAI');
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
 * Obtener información de configuración actual sin crear el provider
 * 
 * @returns {Object} Información de configuración
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
