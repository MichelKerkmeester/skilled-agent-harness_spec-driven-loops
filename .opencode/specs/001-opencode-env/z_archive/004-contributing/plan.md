# Plan: Contributing Guidelines, Changelog & Voyage Provider

## Implementation Phases

### Phase 1: Voyage Provider (~200 LOC)

1. Create `voyage.js` provider in `.opencode/skill/system-spec-kit/scripts/lib/embeddings/providers/`
   - Mirror OpenAI provider structure
   - Use `voyage-3.5` model (1024 dims)
   - Support `input_type` parameter (document/query)
   - Handle API errors gracefully

2. Update `factory.js` to include Voyage
   - Add Voyage to auto-detection (before OpenAI)
   - Add `VOYAGE_API_KEY` check
   - Add `VOYAGE_EMBEDDINGS_MODEL` support

3. Update `opencode.json` environment notes
   - Add Voyage examples and documentation

### Phase 2: CHANGELOG.md

1. Compile all 18 releases from GitHub
2. Format in Keep a Changelog style
3. Organize by version with dates
4. Include upgrade instructions where applicable

### Phase 3: CONTRIBUTING.md

1. Welcome and introduction
2. Quick start (fork, clone, branch, PR)
3. Development setup
4. Code style guidelines
5. Commit message format
6. PR process and requirements
7. What to contribute

## File Changes

### New Files (Public Repo)

| File | Location | Purpose |
|------|----------|---------|
| `voyage.js` | `.opencode/skill/system-spec-kit/scripts/lib/embeddings/providers/` | Voyage provider |
| `CONTRIBUTING.md` | Repository root | Contribution guidelines |
| `CHANGELOG.md` | Repository root | Release history |

### Modified Files (Public Repo)

| File | Changes |
|------|---------|
| `factory.js` | Add Voyage provider, update auto-detection |
| `opencode.json` | Add Voyage environment documentation |

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| API format differences | Follow Voyage docs exactly, test before commit |
| Dimension mismatch | DB-per-profile system handles this automatically |
| Breaking existing setups | Voyage is additive, existing configs unchanged |

## Verification

1. Test Voyage provider with real API key
2. Verify auto-detection priority works correctly
3. Confirm fallback to HF Local when no keys present
4. Validate CHANGELOG contains all releases
5. Review CONTRIBUTING.md for clarity
