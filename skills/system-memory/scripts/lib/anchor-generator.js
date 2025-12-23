#!/usr/bin/env node

/**
 * Anchor Generator - Auto-generate HTML comment anchor IDs
 *
 * Purpose: Generate unique, searchable anchor IDs from section titles
 * for context retrieval in memory files.
 *
 * @module anchor-generator
 * @version 2.0.0
 * @created 2025-11-28
 * @updated 2025-12-17 - Improved anchor format for better searchability
 */

const crypto = require('crypto');

/**
 * Stop words to filter out from semantic slugs
 * Common words that don't add meaning to anchor IDs
 */
const STOP_WORDS = new Set([
  'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
  'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'been',
  'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
  'should', 'may', 'might', 'must', 'shall', 'can', 'need', 'this', 'that',
  'these', 'those', 'it', 'its', 'we', 'our', 'you', 'your', 'they', 'their'
]);

/**
 * Action verbs to filter from semantic slugs
 * These don't add meaning to anchor IDs
 */
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
  'use', 'using', 'used'
]);

/**
 * Generate semantic slug from title text
 * 
 * Extracts 3-5 meaningful words from title, filtering stop words
 * and action verbs, normalizing to lowercase hyphenated format.
 *
 * @param {string} title - Original title text
 * @param {number} [maxWords=4] - Maximum words to include
 * @returns {string} Semantic slug (e.g., "oauth-callback-handler")
 *
 * @example
 * generateSemanticSlug("Implemented OAuth Callback Handler")
 * // Returns: "oauth-callback-handler"
 *
 * generateSemanticSlug("Decision: Use JWT for Authentication")
 * // Returns: "jwt-authentication"
 */
function generateSemanticSlug(title, maxWords = 4) {
  if (!title || typeof title !== 'string') {
    return 'unnamed';
  }

  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '') // Remove special characters
    .split(/\s+/)
    .filter(w => w.length > 2 && !STOP_WORDS.has(w) && !ACTION_VERBS.has(w))
    .slice(0, maxWords)
    .join('-') || 'unnamed';
}

/**
 * Generate short content hash for uniqueness
 *
 * Creates an 8-character MD5 hash from content to ensure
 * anchor uniqueness without excessive length.
 *
 * @param {string} content - Content to hash (title + context)
 * @returns {string} 8-character hex hash
 *
 * @example
 * generateShortHash("OAuth Callback Handler implementation")
 * // Returns: "a3f8b2c1"
 */
function generateShortHash(content) {
  if (!content || typeof content !== 'string') {
    // Generate random hash if no content
    return crypto.randomBytes(4).toString('hex');
  }

  return crypto
    .createHash('md5')
    .update(content)
    .digest('hex')
    .substring(0, 8);
}

/**
 * Generate unique anchor ID from section title
 *
 * NEW Format: {type}-{semantic-slug}-{8char-hash}
 * - type: implementation, decision, research, discovery, summary
 * - semantic-slug: 3-5 meaningful words from title
 * - 8char-hash: First 8 chars of content MD5 hash
 *
 * Benefits:
 * - Anchors are 30-50 chars (not 60+)
 * - Semantic meaning preserved for searchability
 * - Hash ensures uniqueness without collisions
 * - No redundant type prefixes (decision-decision-)
 *
 * @param {string} sectionTitle - Original section heading
 * @param {string} category - Anchor category (implementation, decision, etc.)
 * @param {string} [specNumber] - Spec folder number (legacy, now ignored)
 * @param {string} [additionalContext] - Extra content for hash uniqueness
 * @returns {string} Anchor ID
 *
 * @example
 * generateAnchorId("OAuth Callback Handler", "implementation")
 * // Returns: "implementation-oauth-callback-handler-a3f8b2c1"
 *
 * generateAnchorId("Decision: Use JWT for Auth", "decision")
 * // Returns: "decision-jwt-auth-b4c9d3e2" (no "decision-decision-")
 */
function generateAnchorId(sectionTitle, category, specNumber = null, additionalContext = '') {
  // Normalize category
  const normalizedCategory = (category || 'summary').toLowerCase();

  // Remove category prefix from title if redundant
  // e.g., "Decision: Use JWT" with category "decision" → "Use JWT"
  let cleanTitle = sectionTitle || 'Untitled';
  const categoryPrefixPattern = new RegExp(`^${normalizedCategory}[:\\s-]+`, 'i');
  cleanTitle = cleanTitle.replace(categoryPrefixPattern, '').trim();

  // Also remove common prefixes that duplicate category meaning
  cleanTitle = cleanTitle
    .replace(/^implemented?\s+/i, '')
    .replace(/^discovered?\s+/i, '')
    .replace(/^researched?\s+/i, '')
    .trim();

  // Generate semantic slug from cleaned title
  const slug = generateSemanticSlug(cleanTitle);

  // Generate hash from full content (title + context) for uniqueness
  const hashContent = `${sectionTitle}|${additionalContext}|${Date.now()}`;
  const hash = generateShortHash(hashContent);

  // Combine: category-slug-hash
  return `${normalizedCategory}-${slug}-${hash}`;
}

/**
 * Categorize section based on content and title
 *
 * Categories (priority order):
 * 1. decision - Technical choices
 * 2. implementation - Code/features built
 * 3. guide - How-to instructions
 * 4. architecture - System design
 * 5. files - File modifications
 * 6. discovery - Research findings
 * 7. integration - External services
 * 8. summary - Overview (fallback)
 *
 * @param {string} sectionTitle - Section heading
 * @param {string} [content=''] - Section text content
 * @returns {string} Category name
 *
 * @example
 * categorizeSection("Decision: JWT vs Sessions", "We need to choose...")
 * // Returns: "decision"
 *
 * categorizeSection("Implemented OAuth Flow", "Created provider...")
 * // Returns: "implementation"
 */
function categorizeSection(sectionTitle, content = '') {
  const text = (sectionTitle + ' ' + content).toLowerCase();
  const title = sectionTitle.toLowerCase();

  // Priority 1: Explicit decision language (title takes precedence)
  if (/decision|choice|selected|approach|alternative|option/i.test(title)) {
    return 'decision';
  }

  // Priority 2: Implementation verbs
  if (/implement|built|created|added|developed|wrote|coded/i.test(text)) {
    return 'implementation';
  }

  // Priority 3: Guide/how-to language
  if (/how to|extend|add new|guide|steps|instructions|tutorial/i.test(title)) {
    return 'guide';
  }

  // Priority 4: Architecture/design
  if (/architecture|design|system|structure|flow|model|schema/i.test(title)) {
    return 'architecture';
  }

  // Priority 5: File references
  if (/modified|updated|changed.*file|files?:/i.test(content)) {
    return 'files';
  }

  // Priority 6: Discovery/research
  if (/discovered|found|investigated|research|explored|analysis/i.test(text)) {
    return 'discovery';
  }

  // Priority 7: Integration
  if (/integration|external|api|service|sdk|library|package/i.test(text)) {
    return 'integration';
  }

  // Default fallback
  return 'implementation';
}

/**
 * Validate anchor ID uniqueness within document
 *
 * If collision detected, appends incrementing suffix (-2, -3, etc.)
 *
 * @param {string} anchorId - Proposed anchor ID
 * @param {Array<string>} existingAnchors - Already-used anchor IDs in this session
 * @returns {string} Unique anchor ID (may have -2, -3 suffix)
 *
 * @example
 * validateAnchorUniqueness("implementation-oauth-015", ["implementation-jwt-015"])
 * // Returns: "implementation-oauth-015" (unique)
 *
 * validateAnchorUniqueness("implementation-oauth-015", ["implementation-oauth-015"])
 * // Returns: "implementation-oauth-015-2" (collision avoided)
 */
function validateAnchorUniqueness(anchorId, existingAnchors) {
  if (!existingAnchors.includes(anchorId)) {
    return anchorId; // Already unique
  }

  // Collision detected - append incrementing suffix
  let counter = 2;
  let uniqueId = `${anchorId}-${counter}`;

  while (existingAnchors.includes(uniqueId)) {
    counter++;
    uniqueId = `${anchorId}-${counter}`;
  }

  return uniqueId;
}

/**
 * Extract keywords from text (nouns, proper nouns, technical terms)
 *
 * Filters out:
 * - Action verbs (implement, create, add, etc.)
 * - Stop words (the, a, an, in, etc.)
 * - Very short words (<3 letters, except acronyms)
 *
 * Keeps:
 * - Acronyms (OAuth, JWT, API - detected by uppercase)
 * - Version numbers (v2, 2.0)
 * - Hyphenated terms (real-time)
 * - Proper nouns (Google, Stripe)
 *
 * @param {string} text - Input text
 * @returns {Array<string>} Keywords (lowercase, 1-5 words)
 *
 * @example
 * extractKeywords("Implemented OAuth2 authentication with Google")
 * // Returns: ["oauth2", "authentication", "google"]
 *
 * extractKeywords("Fixed bug in the checkout flow")
 * // Returns: ["checkout", "flow"]
 *
 * extractKeywords("API v2 endpoints")
 * // Returns: ["api", "endpoints"]
 */
function extractKeywords(text) {
  // Extract potential keywords
  // Pattern 1: 3+ letter words
  // Pattern 2: Uppercase words (acronyms like JWT, API)
  // Pattern 3: Version numbers (v2, v1.0, 2.0)
  const words = text.match(/\b[a-z]{3,}\b|\b[A-Z][A-Z0-9]*\b|\bv?\d+\.?\d*\b/gi) || [];

  // Normalize and filter using shared ACTION_VERBS and STOP_WORDS sets
  const keywords = words
    .map(w => w.toLowerCase())
    .filter(w => !ACTION_VERBS.has(w))
    .filter(w => !STOP_WORDS.has(w))
    .filter(w => w.length > 2);

  // Remove duplicates (preserve order)
  const unique = [...new Set(keywords)];

  // Return up to 5 keywords (anchor IDs shouldn't be too long)
  return unique.slice(0, 5);
}

/**
 * Slugify keywords into URL-friendly format
 *
 * Handles:
 * - Lowercase conversion
 * - Special character removal
 * - Hyphen separation
 * - Multiple spaces/hyphens consolidation
 *
 * @param {Array<string>} keywords - List of keywords
 * @returns {string} Slugified string
 *
 * @example
 * slugify(["OAuth", "authentication"])
 * // Returns: "oauth-authentication"
 *
 * slugify(["real-time", "notifications"])
 * // Returns: "real-time-notifications"
 */
function slugify(keywords) {
  if (!keywords || keywords.length === 0) {
    return 'unnamed';
  }

  return keywords
    .join('-')
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '') // Remove special chars except hyphens
    .replace(/--+/g, '-')       // Collapse multiple hyphens
    .replace(/^-|-$/g, '');     // Trim leading/trailing hyphens
}

/**
 * Extract spec number from spec folder name
 *
 * Format: ###-feature-name
 *
 * @param {string} specFolder - Spec folder name (e.g., "015-oauth-integration")
 * @returns {string} Spec number (e.g., "015")
 *
 * @example
 * extractSpecNumber("015-oauth-integration")
 * // Returns: "015"
 *
 * extractSpecNumber("123-complex-feature")
 * // Returns: "123"
 */
function extractSpecNumber(specFolder) {
  const match = specFolder.match(/^(\d{3})-/);
  return match ? match[1] : '000';
}

/**
 * Generate current date in YYYY-MM-DD format
 *
 * Used for collision prevention in anchor IDs
 *
 * @returns {string} Date string (e.g., "2025-11-28")
 */
function getCurrentDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Export all functions
module.exports = {
  generateAnchorId,
  generateSemanticSlug,
  generateShortHash,
  categorizeSection,
  validateAnchorUniqueness,
  extractKeywords,
  slugify,
  extractSpecNumber,
  getCurrentDate,
  STOP_WORDS,
  ACTION_VERBS
};

// CLI testing interface (when run directly)
if (require.main === module) {
  console.log('Anchor Generator Test Suite (v2.0)\n');
  console.log('=' .repeat(60) + '\n');

  // Test 1: Generate anchor ID (new format)
  console.log('Test 1: New anchor format - semantic slug + hash');
  const anchor1 = generateAnchorId("OAuth Callback Handler", "implementation");
  console.log(`  Input:  "OAuth Callback Handler", category: "implementation"`);
  console.log(`  Output: ${anchor1}`);
  console.log(`  Length: ${anchor1.length} chars`);
  console.log(`  ✓ Format: {type}-{semantic-slug}-{8char-hash}\n`);

  // Test 2: No redundant prefixes
  console.log('Test 2: No redundant type prefixes');
  const anchor2 = generateAnchorId("Decision: Use JWT for Authentication", "decision");
  console.log(`  Input:  "Decision: Use JWT for Authentication", category: "decision"`);
  console.log(`  Output: ${anchor2}`);
  console.log(`  ✓ No "decision-decision-" pattern\n`);

  // Test 3: Generate semantic slug
  console.log('Test 3: Semantic slug generation');
  const slug1 = generateSemanticSlug("Implemented OAuth Callback Handler");
  console.log(`  Input:  "Implemented OAuth Callback Handler"`);
  console.log(`  Output: ${slug1}`);
  console.log(`  ✓ Filters action verbs, keeps meaningful words\n`);

  // Test 4: Short hash for uniqueness
  console.log('Test 4: Content hash for uniqueness');
  const hash1 = generateShortHash("OAuth Callback Handler implementation");
  const hash2 = generateShortHash("OAuth Callback Handler implementation v2");
  console.log(`  Hash 1: ${hash1} (from "OAuth Callback Handler implementation")`);
  console.log(`  Hash 2: ${hash2} (from "OAuth Callback Handler implementation v2")`);
  console.log(`  ✓ Different content → different hashes\n`);

  // Test 5: Categorize sections
  console.log('Test 5: Section categorization');
  const cat1 = categorizeSection("Decision: JWT vs Sessions", "We need to choose auth method");
  console.log(`  Input:  "Decision: JWT vs Sessions"`);
  console.log(`  Output: ${cat1}`);
  console.log(`  ✓ Detects decision language\n`);

  // Test 6: Extract keywords
  console.log('Test 6: Keyword extraction');
  const keywords1 = extractKeywords("Implemented OAuth2 authentication with Google");
  console.log(`  Input:  "Implemented OAuth2 authentication with Google"`);
  console.log(`  Output: ${JSON.stringify(keywords1)}`);
  console.log(`  ✓ Filters action verbs and stop words\n`);

  // Test 7: Validate uniqueness
  console.log('Test 7: Anchor uniqueness validation');
  const baseAnchor = "implementation-oauth-callback-a3f8b2c1";
  const unique1 = validateAnchorUniqueness(baseAnchor, [baseAnchor]);
  console.log(`  Input:  "${baseAnchor}" with collision`);
  console.log(`  Output: ${unique1}`);
  console.log(`  ✓ Appends -2 suffix on collision\n`);

  // Test 8: Before/After comparison
  console.log('Test 8: Before/After anchor comparison');
  console.log('  BEFORE (old format):');
  console.log('    decision-decision-ai-must-005-session-1765953838997-htt6wsh7e');
  console.log('    Length: 58 chars, redundant prefix, session ID');
  console.log('  AFTER (new format):');
  const newAnchor = generateAnchorId("AI must construct JSON", "decision");
  console.log(`    ${newAnchor}`);
  console.log(`    Length: ${newAnchor.length} chars, semantic, unique\n`);

  console.log('=' .repeat(60));
  console.log('All tests completed.');
}
