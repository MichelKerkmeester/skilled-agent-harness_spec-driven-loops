// ───────────────────────────────────────────────────────────────
// LIB: ANCHOR GENERATOR
// ───────────────────────────────────────────────────────────────

'use strict';

const crypto = require('crypto');

/* ─────────────────────────────────────────────────────────────
   1. WORD FILTER SETS
──────────────────────────────────────────────────────────────── */

const STOP_WORDS = new Set([
  'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
  'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'been',
  'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
  'should', 'may', 'might', 'must', 'shall', 'can', 'need', 'this', 'that',
  'these', 'those', 'it', 'its', 'we', 'our', 'you', 'your', 'they', 'their',
]);

const ACTION_VERBS = new Set([
  'implement', 'implemented', 'implementing', 'create', 'created', 'creating',
  'add', 'added', 'adding', 'build', 'built', 'building',
  'fix', 'fixed', 'fixing', 'update', 'updated', 'updating',
  'refactor', 'refactored', 'refactoring', 'modify', 'modified', 'modifying',
  'delete', 'deleted', 'deleting', 'remove', 'removed', 'removing',
  'change', 'changed', 'changing', 'improve', 'improved', 'improving',
  'optimize', 'optimized', 'optimizing', 'debug', 'debugged', 'debugging',
  'investigate', 'investigated', 'investigating', 'explore', 'explored', 'exploring',
  'discover', 'discovered', 'discovering', 'research', 'researched', 'researching',
  'use', 'using', 'used',
]);

/* ─────────────────────────────────────────────────────────────
   2. SLUG GENERATION
──────────────────────────────────────────────────────────────── */

// Extracts 3-5 meaningful words, filtering stop words and action verbs
function generate_semantic_slug(title, max_words = 4) {
  if (!title || typeof title !== 'string') return 'unnamed';
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .split(/\s+/)
    .filter(w => w.length > 2 && !STOP_WORDS.has(w) && !ACTION_VERBS.has(w))
    .slice(0, max_words)
    .join('-') || 'unnamed';
}

// 8-character MD5 hash for uniqueness
function generate_short_hash(content) {
  if (!content || typeof content !== 'string') {
    return crypto.randomBytes(4).toString('hex');
  }
  return crypto.createHash('md5').update(content).digest('hex').substring(0, 8);
}

/* ─────────────────────────────────────────────────────────────
   3. ANCHOR ID GENERATION
──────────────────────────────────────────────────────────────── */

// Format: {type}-{semantic-slug}-{8char-hash}
function generate_anchor_id(section_title, category, spec_number = null, additional_context = '') {
  const normalized_category = (category || 'summary').toLowerCase();

  // Remove redundant category prefix from title
  let clean_title = section_title || 'Untitled';
  clean_title = clean_title
    .replace(new RegExp(`^${normalized_category}[:\\s-]+`, 'i'), '')
    .replace(/^implemented?\s+/i, '')
    .replace(/^discovered?\s+/i, '')
    .replace(/^researched?\s+/i, '')
    .trim();

  const slug = generate_semantic_slug(clean_title);
  const hash = generate_short_hash(`${section_title}|${additional_context}|${Date.now()}`);
  return `${normalized_category}-${slug}-${hash}`;
}

/* ─────────────────────────────────────────────────────────────
   4. SECTION CATEGORIZATION
──────────────────────────────────────────────────────────────── */

// Priority: decision > implementation > guide > architecture > files > discovery > integration
function categorize_section(section_title, content = '') {
  const text = (section_title + ' ' + content).toLowerCase();
  const title = section_title.toLowerCase();

  if (/decision|choice|selected|approach|alternative|option/i.test(title)) return 'decision';
  if (/implement|built|created|added|developed|wrote|coded/i.test(text)) return 'implementation';
  if (/how to|extend|add new|guide|steps|instructions|tutorial/i.test(title)) return 'guide';
  if (/architecture|design|system|structure|flow|model|schema/i.test(title)) return 'architecture';
  if (/modified|updated|changed.*file|files?:/i.test(content)) return 'files';
  if (/discovered|found|investigated|research|explored|analysis/i.test(text)) return 'discovery';
  if (/integration|external|api|service|sdk|library|package/i.test(text)) return 'integration';
  return 'implementation';
}

/* ─────────────────────────────────────────────────────────────
   5. ANCHOR VALIDATION
──────────────────────────────────────────────────────────────── */

// Appends -2, -3, etc. on collision
function validate_anchor_uniqueness(anchor_id, existing_anchors) {
  if (!existing_anchors.includes(anchor_id)) return anchor_id;

  let counter = 2;
  let unique_id = `${anchor_id}-${counter}`;
  while (existing_anchors.includes(unique_id)) {
    counter++;
    unique_id = `${anchor_id}-${counter}`;
  }
  return unique_id;
}

/* ─────────────────────────────────────────────────────────────
   6. KEYWORD EXTRACTION
──────────────────────────────────────────────────────────────── */

// Extracts nouns, proper nouns, technical terms (filters action verbs, stop words)
function extract_keywords(text) {
  const words = text.match(/\b[a-z]{3,}\b|\b[A-Z][A-Z0-9]*\b|\bv?\d+\.?\d*\b/gi) || [];
  const keywords = words
    .map(w => w.toLowerCase())
    .filter(w => !ACTION_VERBS.has(w) && !STOP_WORDS.has(w) && w.length > 2);
  return [...new Set(keywords)].slice(0, 5);
}

function slugify(keywords) {
  if (!keywords || keywords.length === 0) return 'unnamed';
  return keywords
    .join('-')
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '')
    .replace(/--+/g, '-')
    .replace(/^-|-$/g, '');
}

/* ─────────────────────────────────────────────────────────────
   7. UTILITY FUNCTIONS
──────────────────────────────────────────────────────────────── */

function extract_spec_number(spec_folder) {
  const match = spec_folder.match(/^(\d{3})-/);
  return match ? match[1] : '000';
}

function get_current_date() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

/* ─────────────────────────────────────────────────────────────
   8. EXPORTS
──────────────────────────────────────────────────────────────── */

module.exports = {
  generate_anchor_id,
  generate_semantic_slug,
  generate_short_hash,
  categorize_section,
  validate_anchor_uniqueness,
  extract_keywords,
  slugify,
  extract_spec_number,
  get_current_date,
  STOP_WORDS,
  ACTION_VERBS,
};

/* ─────────────────────────────────────────────────────────────
   9. CLI TESTING INTERFACE
──────────────────────────────────────────────────────────────── */

if (require.main === module) {
  console.log('Anchor Generator Test Suite (v2.0)\n');
  console.log('='.repeat(60) + '\n');

  console.log('Test 1: New anchor format - semantic slug + hash');
  const anchor1 = generate_anchor_id('OAuth Callback Handler', 'implementation');
  console.log(`  Input:  "OAuth Callback Handler", category: "implementation"`);
  console.log(`  Output: ${anchor1}\n`);

  console.log('Test 2: No redundant type prefixes');
  const anchor2 = generate_anchor_id('Decision: Use JWT for Authentication', 'decision');
  console.log(`  Input:  "Decision: Use JWT for Authentication", category: "decision"`);
  console.log(`  Output: ${anchor2}\n`);

  console.log('Test 3: Semantic slug generation');
  const slug1 = generate_semantic_slug('Implemented OAuth Callback Handler');
  console.log(`  Input:  "Implemented OAuth Callback Handler"`);
  console.log(`  Output: ${slug1}\n`);

  console.log('Test 4: Content hash for uniqueness');
  const hash1 = generate_short_hash('OAuth Callback Handler implementation');
  const hash2 = generate_short_hash('OAuth Callback Handler implementation v2');
  console.log(`  Hash 1: ${hash1}`);
  console.log(`  Hash 2: ${hash2}\n`);

  console.log('Test 5: Section categorization');
  const cat1 = categorize_section('Decision: JWT vs Sessions', 'We need to choose auth method');
  console.log(`  Input:  "Decision: JWT vs Sessions"`);
  console.log(`  Output: ${cat1}\n`);

  console.log('Test 6: Keyword extraction');
  const keywords1 = extract_keywords('Implemented OAuth2 authentication with Google');
  console.log(`  Input:  "Implemented OAuth2 authentication with Google"`);
  console.log(`  Output: ${JSON.stringify(keywords1)}\n`);

  console.log('Test 7: Anchor uniqueness validation');
  const base_anchor = 'implementation-oauth-callback-a3f8b2c1';
  const unique1 = validate_anchor_uniqueness(base_anchor, [base_anchor]);
  console.log(`  Input:  "${base_anchor}" with collision`);
  console.log(`  Output: ${unique1}\n`);

  console.log('='.repeat(60));
  console.log('All tests completed.');
}
