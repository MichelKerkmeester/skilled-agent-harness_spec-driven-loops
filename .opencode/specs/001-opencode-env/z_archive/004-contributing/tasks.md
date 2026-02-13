# Tasks: Contributing Guidelines, Changelog & Voyage Provider

## Phase 1: Voyage Provider

- [x] T01: Create `voyage.js` provider file
  - Location: `.opencode/skill/system-spec-kit/scripts/lib/embeddings/providers/voyage.js`
  - Model: `voyage-3.5` (1024 dimensions)
  - API: `https://api.voyageai.com/v1/embeddings`
  - Support `input_type`: document/query

- [x] T02: Update `factory.js` with Voyage support
  - Add `require('./providers/voyage')`
  - Update `resolveProvider()` to check `VOYAGE_API_KEY`
  - Add Voyage case to `createEmbeddingsProvider()`
  - Update `getProviderInfo()` with Voyage config

- [x] T03: Update `opencode.json` environment notes
  - Add `_NOTE_PROVIDERS` with Voyage
  - Add `_EXAMPLE_VOYAGE` usage example

## Phase 2: CHANGELOG.md

- [x] T04: Create CHANGELOG.md with all 18 releases
  - v1.0.0.0 through v1.0.2.0
  - Keep a Changelog format
  - Include dates and categories

## Phase 3: CONTRIBUTING.md

- [x] T05: Create CONTRIBUTING.md
  - Welcome section
  - Quick start guide
  - Development setup
  - Code style guidelines
  - Commit message format
  - PR process
  - What to contribute

## Phase 4: Verification

- [x] T06: Verify Voyage provider loads correctly - `node -e "require('./voyage')"`
- [x] T07: Verify auto-detection priority - `getProviderInfo()` returns "voyage"
- [x] T08: Test fallback behavior - Factory includes fallback logic
- [x] T09: Review all documentation for accuracy - All sections complete
