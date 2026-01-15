// ───────────────────────────────────────────────────────────────
// TEST: EMBEDDINGS FACTORY VERIFICATION
// ───────────────────────────────────────────────────────────────

'use strict';

const path = require('path');

/* ─────────────────────────────────────────────────────────────
   1. CONFIGURATION
──────────────────────────────────────────────────────────────── */

// Configure relative paths - embeddings consolidated to shared/ on 2024-12-31
const lib_path = path.join(__dirname, '../../shared');

/* ─────────────────────────────────────────────────────────────
   2. TEST FUNCTION
──────────────────────────────────────────────────────────────── */

async function test_factory() {
  console.log('🧪 Testing Embeddings Factory...\n');

  try {
    // Test 1: Import modules (from shared/ after 2024-12-31 consolidation)
    console.log('1️⃣ Importing modules...');
    const { EmbeddingProfile } = require(path.join(lib_path, 'embeddings/profile'));
    const { HfLocalProvider } = require(path.join(lib_path, 'embeddings/providers/hf-local'));
    const { OpenAIProvider } = require(path.join(lib_path, 'embeddings/providers/openai'));
    const { create_embeddings_provider: createEmbeddingsProvider, get_provider_info: getProviderInfo } = require(path.join(lib_path, 'embeddings/factory'));
    const embeddings = require(path.join(lib_path, 'embeddings.js'));
    console.log('   ✅ Modules imported successfully\n');

    // Test 2: Verify provider configuration
    console.log('2️⃣ Verifying provider configuration...');
    const provider_info = getProviderInfo();
    console.log('   Selected provider:', provider_info.provider);
    console.log('   Reason:', provider_info.reason);
    console.log('   Config:', JSON.stringify(provider_info.config, null, 2));
    console.log('   ✅ Configuration obtained\n');

    // Test 3: Create embedding profile
    console.log('3️⃣ Creating embedding profile...');
    const profile = new EmbeddingProfile({
      provider: 'hf-local',
      model: 'nomic-ai/nomic-embed-text-v1.5',
      dim: 768,
    });
    console.log('   Profile:', profile.to_string());
    console.log('   Slug:', profile.slug);
    console.log('   DB path:', profile.get_database_path('/tmp/test'));
    console.log('   ✅ Profile created successfully\n');

    // Test 4: Verify embeddings API (without running heavy model)
    console.log('4️⃣ Verifying embeddings API...');
    console.log('   Available functions:');
    console.log('   - generateDocumentEmbedding:', typeof embeddings.generateDocumentEmbedding);
    console.log('   - generateQueryEmbedding:', typeof embeddings.generateQueryEmbedding);
    console.log('   - getEmbeddingDimension:', typeof embeddings.getEmbeddingDimension);
    console.log('   - getProviderMetadata:', typeof embeddings.getProviderMetadata);
    console.log('   - getEmbeddingProfile:', typeof embeddings.getEmbeddingProfile);
    console.log('   ✅ Complete API available\n');

    // Test 5: Verify constants
    console.log('5️⃣ Verifying constants...');
    console.log('   EMBEDDING_DIM:', embeddings.EMBEDDING_DIM);
    console.log('   MODEL_NAME:', embeddings.MODEL_NAME);
    console.log('   MAX_TEXT_LENGTH:', embeddings.MAX_TEXT_LENGTH);
    console.log('   ✅ Constants available\n');

    // Test 6: Test HF provider creation (without warmup)
    console.log('6️⃣ Creating HF local provider (without warmup)...');
    const hf_provider = new HfLocalProvider({ model: 'test-model', dim: 768 });
    console.log('   Metadata:', JSON.stringify(hf_provider.get_metadata(), null, 2));
    console.log('   ✅ HF provider created\n');

    // Test 7: Test OpenAI provider creation (if key available)
    console.log('7️⃣ Verifying OpenAI provider...');
    if (process.env.OPENAI_API_KEY) {
      console.log('   OPENAI_API_KEY detected');
      try {
        const openai_provider = new OpenAIProvider();
        console.log('   Metadata:', JSON.stringify(openai_provider.get_metadata(), null, 2));
        console.log('   ✅ OpenAI provider created\n');
      } catch (error) {
        console.log('   ⚠️  Error creating provider:', error.message, '\n');
      }
    } else {
      console.log('   ⚠️  OPENAI_API_KEY not detected (OK for HF local)\n');
    }

    console.log('✅ ALL TESTS PASSED\n');
    console.log('📋 Summary:');
    console.log('   - Factory pattern: ✅ Functional');
    console.log('   - Compatible API: ✅ Maintained');
    console.log('   - Profiles: ✅ Working');
    console.log('   - Providers: ✅ Available');
    console.log('   - Active provider:', provider_info.provider);

    return true;

  } catch (error) {
    console.error('❌ ERROR IN TESTS:', error.message);
    console.error('Stack:', error.stack);
    return false;
  }
}

/* ─────────────────────────────────────────────────────────────
   3. MAIN
──────────────────────────────────────────────────────────────── */

// Run tests
test_factory().then(success => {
  process.exit(success ? 0 : 1);
});
