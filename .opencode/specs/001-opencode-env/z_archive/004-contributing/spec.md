# Spec: Contributing Guidelines, Changelog & Voyage Provider

## Objective

Add community infrastructure and improve embedding provider options for the OpenCode Dev Environment public repository.

## Scope

### In Scope

1. **Voyage 3.5 Provider** - New embedding provider for Spec Kit Memory
   - Create `voyage.js` provider using `voyage-3.5` model (1024 dimensions)
   - Update factory.js with Voyage auto-detection (priority: Voyage → OpenAI → HF Local)
   - Update opencode.json environment documentation

2. **CONTRIBUTING.md** - Community contribution guidelines
   - Fork and clone instructions
   - Development workflow
   - Code style guidelines (English, JSDoc, conventional commits)
   - PR process (based on Alexander Daza's successful contribution)

3. **CHANGELOG.md** - Complete release history
   - All 18 releases from v1.0.0.0 to v1.0.2.0
   - Keep a Changelog format
   - Categorized by Added/Changed/Fixed/Removed

### Out of Scope

- Ollama provider implementation (marked as pending)
- Automated release note generation
- PR templates (future enhancement)

## Success Criteria

- [ ] Voyage provider functional with `VOYAGE_API_KEY`
- [ ] Auto-detection prioritizes Voyage when key present
- [ ] CONTRIBUTING.md provides clear contribution path
- [ ] CHANGELOG.md contains all 18 releases
- [ ] All files pass linting/validation

## Technical Details

### Voyage API

- Endpoint: `POST https://api.voyageai.com/v1/embeddings`
- Model: `voyage-3.5` (1024 dimensions, $0.06/M tokens)
- Auth: Bearer token via `VOYAGE_API_KEY`
- Input type: `document` or `query` for retrieval optimization

### Provider Priority (Updated)

```
1. EMBEDDINGS_PROVIDER env var (explicit override)
2. Auto-detection:
   a. VOYAGE_API_KEY exists → Voyage
   b. OPENAI_API_KEY exists → OpenAI
   c. Fallback → HF Local
```

## References

- [Voyage AI Documentation](https://docs.voyageai.com/docs/embeddings)
- [Alexander Daza's PR #1](https://github.com/MichelKerkmeester/opencode-dev-environment/pull/1)
- [Keep a Changelog](https://keepachangelog.com/)
