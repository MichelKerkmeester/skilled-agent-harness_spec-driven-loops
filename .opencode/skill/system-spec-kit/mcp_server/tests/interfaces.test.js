// ───────────────────────────────────────────────────────────────
// TESTS: Protocol Abstractions (T084, T085, T086)
// ───────────────────────────────────────────────────────────────
'use strict';

const assert = require('assert');
const {
  IVectorStore,
  MockVectorStore,
  IEmbeddingProvider,
  MockEmbeddingProvider
} = require('../lib/interfaces');

// Helper to create test embeddings
function createTestEmbedding(dim = 1024, seed = 0) {
  const embedding = new Float32Array(dim);
  for (let i = 0; i < dim; i++) {
    embedding[i] = Math.sin(i + seed) / 2;
  }
  // Normalize
  let norm = 0;
  for (let i = 0; i < dim; i++) norm += embedding[i] ** 2;
  norm = Math.sqrt(norm);
  for (let i = 0; i < dim; i++) embedding[i] /= norm;
  return embedding;
}

// ─────────────────────────────────────────────────────────────
// Test Suite: IVectorStore Interface (T084)
// ─────────────────────────────────────────────────────────────

async function testIVectorStoreInterface() {
  console.log('\n--- Testing IVectorStore Interface (T084) ---');

  // Test 1: IVectorStore base class throws on all methods
  const base = new IVectorStore();
  let threw = false;
  try {
    await base.search(null, 10);
  } catch (e) {
    threw = e.message.includes('must be implemented');
  }
  assert.strictEqual(threw, true, 'IVectorStore.search() should throw');
  console.log('  [PASS] IVectorStore base class throws on unimplemented methods');

  // Test 2: MockVectorStore implements all interface methods
  const mock = new MockVectorStore({ embeddingDim: 1024 });
  assert.strictEqual(typeof mock.search, 'function', 'MockVectorStore should have search()');
  assert.strictEqual(typeof mock.upsert, 'function', 'MockVectorStore should have upsert()');
  assert.strictEqual(typeof mock.delete, 'function', 'MockVectorStore should have delete()');
  assert.strictEqual(typeof mock.get, 'function', 'MockVectorStore should have get()');
  assert.strictEqual(typeof mock.getStats, 'function', 'MockVectorStore should have getStats()');
  assert.strictEqual(typeof mock.isAvailable, 'function', 'MockVectorStore should have isAvailable()');
  assert.strictEqual(typeof mock.getEmbeddingDimension, 'function', 'MockVectorStore should have getEmbeddingDimension()');
  assert.strictEqual(typeof mock.close, 'function', 'MockVectorStore should have close()');
  console.log('  [PASS] MockVectorStore implements all interface methods');

  // Test 3: MockVectorStore upsert and search
  const embedding1 = createTestEmbedding(1024, 1);
  const id1 = await mock.upsert('test-id-1', embedding1, {
    spec_folder: 'specs/test',
    file_path: 'memory.md',
    anchor_id: 'summary',
    title: 'Test Memory'
  });
  assert.strictEqual(typeof id1, 'number', 'upsert should return numeric ID');
  console.log('  [PASS] MockVectorStore.upsert() returns numeric ID');

  // Test 4: Search finds the inserted record
  const results = await mock.search(embedding1, 10);
  assert.strictEqual(results.length, 1, 'search should find 1 result');
  assert.strictEqual(results[0].title, 'Test Memory', 'search result should match');
  console.log('  [PASS] MockVectorStore.search() finds inserted records');

  // Test 5: Get by ID
  const record = await mock.get(id1);
  assert.strictEqual(record.title, 'Test Memory', 'get should return correct record');
  console.log('  [PASS] MockVectorStore.get() returns correct record');

  // Test 6: Delete
  const deleted = await mock.delete(id1);
  assert.strictEqual(deleted, true, 'delete should return true');
  const afterDelete = await mock.get(id1);
  assert.strictEqual(afterDelete, null, 'get after delete should return null');
  console.log('  [PASS] MockVectorStore.delete() removes record');

  // Test 7: Stats
  await mock.upsert('test-2', createTestEmbedding(1024, 2), {
    spec_folder: 'specs/test',
    file_path: 'memory2.md'
  });
  const stats = await mock.getStats();
  assert.strictEqual(stats.total, 1, 'stats.total should be 1');
  assert.strictEqual(stats.success, 1, 'stats.success should be 1');
  console.log('  [PASS] MockVectorStore.getStats() returns correct counts');

  // Test 8: Availability
  assert.strictEqual(await mock.isAvailable(), true, 'isAvailable should return true');
  mock.setAvailable(false);
  assert.strictEqual(await mock.isAvailable(), false, 'isAvailable should return false when disabled');
  mock.setAvailable(true);
  console.log('  [PASS] MockVectorStore.isAvailable() reflects availability state');

  // Test 9: Embedding dimension
  assert.strictEqual(mock.getEmbeddingDimension(), 1024, 'getEmbeddingDimension should return 1024');
  console.log('  [PASS] MockVectorStore.getEmbeddingDimension() returns correct dimension');

  // Test 10: Dimension mismatch throws
  let dimError = false;
  try {
    await mock.upsert('bad', createTestEmbedding(768), { spec_folder: 'test', file_path: 'bad.md' });
  } catch (e) {
    dimError = e.message.includes('mismatch');
  }
  assert.strictEqual(dimError, true, 'upsert with wrong dimension should throw');
  console.log('  [PASS] MockVectorStore rejects mismatched embedding dimensions');

  await mock.close();
  console.log('--- IVectorStore Tests Complete ---\n');
}

// ─────────────────────────────────────────────────────────────
// Test Suite: IEmbeddingProvider Interface (T085)
// ─────────────────────────────────────────────────────────────

async function testIEmbeddingProviderInterface() {
  console.log('\n--- Testing IEmbeddingProvider Interface (T085) ---');

  // Test 1: IEmbeddingProvider base class throws on all methods
  const base = new IEmbeddingProvider();
  let threw = false;
  try {
    await base.embed('test');
  } catch (e) {
    threw = e.message.includes('must be implemented');
  }
  assert.strictEqual(threw, true, 'IEmbeddingProvider.embed() should throw');
  console.log('  [PASS] IEmbeddingProvider base class throws on unimplemented methods');

  // Test 2: MockEmbeddingProvider implements all interface methods
  const mock = new MockEmbeddingProvider({ dimension: 1024 });
  assert.strictEqual(typeof mock.embed, 'function', 'MockEmbeddingProvider should have embed()');
  assert.strictEqual(typeof mock.batchEmbed, 'function', 'MockEmbeddingProvider should have batchEmbed()');
  assert.strictEqual(typeof mock.embedQuery, 'function', 'MockEmbeddingProvider should have embedQuery()');
  assert.strictEqual(typeof mock.embedDocument, 'function', 'MockEmbeddingProvider should have embedDocument()');
  assert.strictEqual(typeof mock.getDimension, 'function', 'MockEmbeddingProvider should have getDimension()');
  assert.strictEqual(typeof mock.getModelName, 'function', 'MockEmbeddingProvider should have getModelName()');
  assert.strictEqual(typeof mock.getProfile, 'function', 'MockEmbeddingProvider should have getProfile()');
  assert.strictEqual(typeof mock.isReady, 'function', 'MockEmbeddingProvider should have isReady()');
  assert.strictEqual(typeof mock.initialize, 'function', 'MockEmbeddingProvider should have initialize()');
  assert.strictEqual(typeof mock.validateCredentials, 'function', 'MockEmbeddingProvider should have validateCredentials()');
  assert.strictEqual(typeof mock.getProviderName, 'function', 'MockEmbeddingProvider should have getProviderName()');
  assert.strictEqual(typeof mock.close, 'function', 'MockEmbeddingProvider should have close()');
  console.log('  [PASS] MockEmbeddingProvider implements all interface methods');

  // Test 3: embed() returns Float32Array
  const embedding = await mock.embed('test text');
  assert.strictEqual(embedding instanceof Float32Array, true, 'embed should return Float32Array');
  assert.strictEqual(embedding.length, 1024, 'embedding should have correct dimension');
  console.log('  [PASS] MockEmbeddingProvider.embed() returns Float32Array with correct dimension');

  // Test 4: Deterministic embeddings
  const embedding1 = await mock.embed('hello world');
  const embedding2 = await mock.embed('hello world');
  let same = true;
  for (let i = 0; i < embedding1.length && same; i++) {
    if (embedding1[i] !== embedding2[i]) same = false;
  }
  assert.strictEqual(same, true, 'same input should produce same embedding');
  console.log('  [PASS] MockEmbeddingProvider produces deterministic embeddings');

  // Test 5: Different inputs produce different embeddings
  const embedding3 = await mock.embed('different text');
  let different = false;
  for (let i = 0; i < embedding1.length && !different; i++) {
    if (embedding1[i] !== embedding3[i]) different = true;
  }
  assert.strictEqual(different, true, 'different input should produce different embedding');
  console.log('  [PASS] MockEmbeddingProvider produces different embeddings for different inputs');

  // Test 6: batchEmbed
  const batch = await mock.batchEmbed(['text1', 'text2', 'text3']);
  assert.strictEqual(batch.length, 3, 'batchEmbed should return array of same length');
  assert.strictEqual(batch[0] instanceof Float32Array, true, 'batch items should be Float32Array');
  console.log('  [PASS] MockEmbeddingProvider.batchEmbed() returns array of embeddings');

  // Test 7: Empty/null input returns null
  const nullEmbed = await mock.embed('');
  assert.strictEqual(nullEmbed, null, 'empty string should return null');
  const nullEmbed2 = await mock.embed(null);
  assert.strictEqual(nullEmbed2, null, 'null input should return null');
  console.log('  [PASS] MockEmbeddingProvider handles empty/null input');

  // Test 8: Dimension getter
  assert.strictEqual(mock.getDimension(), 1024, 'getDimension should return 1024');
  console.log('  [PASS] MockEmbeddingProvider.getDimension() returns correct dimension');

  // Test 9: Profile
  const profile = mock.getProfile();
  assert.strictEqual(profile.provider, 'mock', 'profile.provider should be mock');
  assert.strictEqual(profile.dim, 1024, 'profile.dim should be 1024');
  console.log('  [PASS] MockEmbeddingProvider.getProfile() returns valid profile');

  // Test 10: Credentials validation
  await mock.validateCredentials(); // Should not throw
  mock.setCredentialsValid(false);
  let credError = false;
  try {
    await mock.validateCredentials();
  } catch (e) {
    credError = e.message.includes('invalid');
  }
  assert.strictEqual(credError, true, 'invalid credentials should throw');
  mock.setCredentialsValid(true);
  console.log('  [PASS] MockEmbeddingProvider.validateCredentials() validates credentials');

  // Test 11: Failure simulation
  mock.setFailRate(1.0); // 100% failure
  const failEmbed = await mock.embed('test');
  assert.strictEqual(failEmbed, null, 'should return null when fail rate is 1.0');
  mock.setFailRate(0);
  console.log('  [PASS] MockEmbeddingProvider supports failure simulation');

  await mock.close();
  console.log('--- IEmbeddingProvider Tests Complete ---\n');
}

// ─────────────────────────────────────────────────────────────
// Test Suite: SQLiteVectorStore (T086)
// ─────────────────────────────────────────────────────────────

async function testSQLiteVectorStore() {
  console.log('\n--- Testing SQLiteVectorStore (T086) ---');

  // Import SQLiteVectorStore
  const { SQLiteVectorStore } = require('../lib/search/vector-index');

  // Test 1: SQLiteVectorStore exists and is a class
  assert.strictEqual(typeof SQLiteVectorStore, 'function', 'SQLiteVectorStore should be a class');
  console.log('  [PASS] SQLiteVectorStore is exported from vector-index.js');

  // Test 2: SQLiteVectorStore extends IVectorStore
  const store = new SQLiteVectorStore();
  assert.strictEqual(store instanceof IVectorStore, true, 'SQLiteVectorStore should extend IVectorStore');
  console.log('  [PASS] SQLiteVectorStore extends IVectorStore');

  // Test 3: Has all interface methods
  assert.strictEqual(typeof store.search, 'function', 'should have search()');
  assert.strictEqual(typeof store.upsert, 'function', 'should have upsert()');
  assert.strictEqual(typeof store.delete, 'function', 'should have delete()');
  assert.strictEqual(typeof store.get, 'function', 'should have get()');
  assert.strictEqual(typeof store.getStats, 'function', 'should have getStats()');
  assert.strictEqual(typeof store.isAvailable, 'function', 'should have isAvailable()');
  assert.strictEqual(typeof store.getEmbeddingDimension, 'function', 'should have getEmbeddingDimension()');
  assert.strictEqual(typeof store.close, 'function', 'should have close()');
  console.log('  [PASS] SQLiteVectorStore implements all IVectorStore methods');

  // Test 4: Has extended methods
  assert.strictEqual(typeof store.deleteByPath, 'function', 'should have deleteByPath()');
  assert.strictEqual(typeof store.getByFolder, 'function', 'should have getByFolder()');
  assert.strictEqual(typeof store.searchEnriched, 'function', 'should have searchEnriched()');
  assert.strictEqual(typeof store.enhancedSearch, 'function', 'should have enhancedSearch()');
  assert.strictEqual(typeof store.getConstitutionalMemories, 'function', 'should have getConstitutionalMemories()');
  assert.strictEqual(typeof store.verifyIntegrity, 'function', 'should have verifyIntegrity()');
  console.log('  [PASS] SQLiteVectorStore has extended methods');

  // Note: Full integration tests would require sqlite-vec to be available
  // We're just verifying the interface compliance here

  console.log('--- SQLiteVectorStore Tests Complete ---\n');
}

// ─────────────────────────────────────────────────────────────
// Run All Tests
// ─────────────────────────────────────────────────────────────

async function runAllTests() {
  console.log('\n========================================');
  console.log('Protocol Abstractions Test Suite');
  console.log('T084: IVectorStore, T085: IEmbeddingProvider, T086: SQLiteVectorStore');
  console.log('========================================');

  try {
    await testIVectorStoreInterface();
    await testIEmbeddingProviderInterface();
    await testSQLiteVectorStore();

    console.log('\n========================================');
    console.log('ALL TESTS PASSED');
    console.log('========================================\n');

    console.log('Checklist verification:');
    console.log('  [x] CHK-141: IVectorStore interface defined with search/insert/delete');
    console.log('  [x] CHK-142: IEmbeddingProvider interface defined with embed method');
    console.log('  [x] CHK-143: Current implementations conform to interfaces');
    console.log('  [x] CHK-144: Mock implementations available for testing');

    process.exit(0);
  } catch (error) {
    console.error('\n========================================');
    console.error('TEST FAILED:', error.message);
    console.error('========================================\n');
    console.error(error.stack);
    process.exit(1);
  }
}

runAllTests();
