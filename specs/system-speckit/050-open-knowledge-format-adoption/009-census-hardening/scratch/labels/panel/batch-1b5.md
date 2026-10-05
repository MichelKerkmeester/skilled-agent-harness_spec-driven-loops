## Row 56 (ambiguous)
- Doc: `.skilled/skills/system-deep-loop/deep-review/scripts/tests/fixtures/blocked-stop-session/review/iterations/iteration-002.md:11`
- Citation: `src/registry.ts:88`
- Candidates: `.skilled/skills/system-skill-advisor/runtime/lib/embedders/registry.ts`, `.skilled/skills/system-spec-kit/shared/embeddings/registry.ts`

```text

### P1 - Required
- **F003**: Missing null guard in registry merge - `src/registry.ts:88` - Correctness path dereferences prior state before checking the record exists.

### P2 - Suggestion
```
