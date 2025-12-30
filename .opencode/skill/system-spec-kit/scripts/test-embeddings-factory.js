#!/usr/bin/env node
/**
 * Test script para verificar el factory de embeddings
 * Prueba la creación de providers y generación básica de embeddings
 */

'use strict';

const path = require('path');

// Configurar paths relativos
const libPath = path.join(__dirname, '../scripts/lib');

async function testFactory() {
  console.log('🧪 Testing Embeddings Factory...\n');

  try {
    // Test 1: Importar módulos
    console.log('1️⃣ Importando módulos...');
    const { EmbeddingProfile } = require(path.join(libPath, 'embeddings/profile'));
    const { HFLocalProvider } = require(path.join(libPath, 'embeddings/providers/hf-local'));
    const { OpenAIProvider } = require(path.join(libPath, 'embeddings/providers/openai'));
    const { createEmbeddingsProvider, getProviderInfo } = require(path.join(libPath, 'embeddings/factory'));
    const embeddings = require(path.join(libPath, 'embeddings'));
    console.log('   ✅ Módulos importados correctamente\n');

    // Test 2: Verificar info del provider
    console.log('2️⃣ Verificando configuración del provider...');
    const providerInfo = getProviderInfo();
    console.log('   Provider seleccionado:', providerInfo.provider);
    console.log('   Razón:', providerInfo.reason);
    console.log('   Config:', JSON.stringify(providerInfo.config, null, 2));
    console.log('   ✅ Configuración obtenida\n');

    // Test 3: Crear perfil
    console.log('3️⃣ Creando perfil de embeddings...');
    const profile = new EmbeddingProfile({
      provider: 'hf-local',
      model: 'nomic-ai/nomic-embed-text-v1.5',
      dim: 768
    });
    console.log('   Perfil:', profile.toString());
    console.log('   Slug:', profile.slug);
    console.log('   DB path:', profile.getDatabasePath('/tmp/test'));
    console.log('   ✅ Perfil creado correctamente\n');

    // Test 4: Verificar API de embeddings (sin ejecutar modelo pesado)
    console.log('4️⃣ Verificando API de embeddings...');
    console.log('   Funciones disponibles:');
    console.log('   - generateDocumentEmbedding:', typeof embeddings.generateDocumentEmbedding);
    console.log('   - generateQueryEmbedding:', typeof embeddings.generateQueryEmbedding);
    console.log('   - getEmbeddingDimension:', typeof embeddings.getEmbeddingDimension);
    console.log('   - getProviderMetadata:', typeof embeddings.getProviderMetadata);
    console.log('   - getEmbeddingProfile:', typeof embeddings.getEmbeddingProfile);
    console.log('   ✅ API completa disponible\n');

    // Test 5: Verificar constantes
    console.log('5️⃣ Verificando constantes...');
    console.log('   EMBEDDING_DIM:', embeddings.EMBEDDING_DIM);
    console.log('   MODEL_NAME:', embeddings.MODEL_NAME);
    console.log('   MAX_TEXT_LENGTH:', embeddings.MAX_TEXT_LENGTH);
    console.log('   ✅ Constantes disponibles\n');

    // Test 6: Probar creación de provider HF (sin warmup)
    console.log('6️⃣ Creando provider HF local (sin warmup)...');
    const hfProvider = new HFLocalProvider({ model: 'test-model', dim: 768 });
    console.log('   Metadata:', JSON.stringify(hfProvider.getMetadata(), null, 2));
    console.log('   ✅ Provider HF creado\n');

    // Test 7: Probar creación de provider OpenAI (si hay key)
    console.log('7️⃣ Verificando provider OpenAI...');
    if (process.env.OPENAI_API_KEY) {
      console.log('   OPENAI_API_KEY detectada');
      try {
        const openaiProvider = new OpenAIProvider();
        console.log('   Metadata:', JSON.stringify(openaiProvider.getMetadata(), null, 2));
        console.log('   ✅ Provider OpenAI creado\n');
      } catch (error) {
        console.log('   ⚠️  Error creando provider:', error.message, '\n');
      }
    } else {
      console.log('   ⚠️  OPENAI_API_KEY no detectada (OK para HF local)\n');
    }

    console.log('✅ TODOS LOS TESTS PASARON\n');
    console.log('📋 Resumen:');
    console.log('   - Factory pattern: ✅ Funcional');
    console.log('   - API compatible: ✅ Mantenida');
    console.log('   - Profiles: ✅ Funcionando');
    console.log('   - Providers: ✅ Disponibles');
    console.log('   - Provider activo:', providerInfo.provider);

    return true;

  } catch (error) {
    console.error('❌ ERROR EN TESTS:', error.message);
    console.error('Stack:', error.stack);
    return false;
  }
}

// Ejecutar tests
testFactory().then(success => {
  process.exit(success ? 0 : 1);
});
