/**
 * Embedding Profile - Define el perfil de embeddings activo
 * 
 * Un perfil incluye: provider, modelo, dimensión.
 * Cada perfil único genera su propia base de datos vectorial.
 * 
 * @module embeddings/profile
 * @version 1.0.0
 */

'use strict';

/**
 * Crea un slug seguro para nombres de archivo desde el perfil
 * Ejemplo: openai__text-embedding-3-small__1536
 * 
 * @param {string} provider - Nombre del provider (openai, hf-local, ollama)
 * @param {string} model - Nombre del modelo
 * @param {number} dim - Dimensión del vector
 * @returns {string} Slug seguro para usar en nombres de archivo
 */
function createProfileSlug(provider, model, dim) {
  // Normalizar el nombre del modelo (reemplazar caracteres no seguros)
  const safeModel = model
    .replace(/[^a-zA-Z0-9-_.]/g, '_')
    .replace(/__+/g, '_')
    .toLowerCase();
  
  return `${provider}__${safeModel}__${dim}`;
}

/**
 * Parsear un slug de perfil de vuelta a sus componentes
 * 
 * @param {string} slug - Slug de perfil
 * @returns {{provider: string, model: string, dim: number} | null}
 */
function parseProfileSlug(slug) {
  const parts = slug.split('__');
  if (parts.length !== 3) return null;
  
  const dim = parseInt(parts[2], 10);
  if (isNaN(dim)) return null;
  
  return {
    provider: parts[0],
    model: parts[1],
    dim
  };
}

/**
 * Clase que representa un perfil de embeddings
 */
class EmbeddingProfile {
  constructor({ provider, model, dim, baseUrl = null }) {
    this.provider = provider;
    this.model = model;
    this.dim = dim;
    this.baseUrl = baseUrl; // Para Ollama u otros servicios locales
    this.slug = createProfileSlug(provider, model, dim);
  }

  /**
   * Obtiene el path de la base de datos para este perfil
   * 
   * @param {string} baseDir - Directorio base
   * @returns {string} Path completo del archivo SQLite
   */
  getDatabasePath(baseDir) {
    // El perfil legacy (hf-local + nomic + 768) usa el nombre tradicional
    if (this.provider === 'hf-local' && 
        this.model.includes('nomic-embed-text') && 
        this.dim === 768) {
      return `${baseDir}/context-index.sqlite`;
    }
    
    // Nuevos perfiles usan el slug
    return `${baseDir}/context-index__${this.slug}.sqlite`;
  }

  /**
   * Representación en string del perfil
   */
  toString() {
    return `${this.provider}:${this.model}:${this.dim}`;
  }

  /**
   * Convierte el perfil a un objeto simple
   */
  toJSON() {
    return {
      provider: this.provider,
      model: this.model,
      dim: this.dim,
      baseUrl: this.baseUrl,
      slug: this.slug
    };
  }
}

module.exports = {
  EmbeddingProfile,
  createProfileSlug,
  parseProfileSlug
};
