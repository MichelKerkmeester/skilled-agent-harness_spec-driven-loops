# Context: Bounded Transcript Selection

## 1. OVERVIEW

`context/` selects the last eligible non-meta user message under freshness, privacy and codepoint limits. The selected text is request-scoped while the returned `BoundedContextRecord` retains content-free metadata.

Context selection runs after privacy facts are known and before provider request preparation.

---

## 2. KEY FILES

| File | Responsibility |
|---|---|
| `index.ts` | Exposes context selection and its public types |
| `selector.ts` | Implements `selectBoundedContext` and validates selection inputs |

---

## 3. PUBLIC EXPORTS

`index.ts` exports `selectBoundedContext` plus `BoundedContextSelection`, `ContextSelectionInput`, `TranscriptMessageView` and `TranscriptView`.

---

## 4. VALIDATION

```bash
npm test -- test/core/context-selector.test.ts
```

Expected result: bounded context selection tests pass.

---

## 5. RELATED

- [Source map](../README.md)
- [Privacy subsystem](../privacy/README.md)
