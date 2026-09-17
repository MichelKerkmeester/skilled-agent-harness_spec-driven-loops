# Fidelity: Protected Spans and Candidate Validation

## 1. OVERVIEW

`fidelity/` protects Markdown structure and exact spans before provider execution, restores those spans afterward and validates the rewritten candidate. It rejects structural drift, changed protected content, semantic loss, unexpected refusal, truncation and invalid judge results.

Accepted candidates continue to render. Every rejection returns the exact original.

---

## 2. KEY FILES

| File | Responsibility |
|---|---|
| `dialect.ts` | Detects protected ranges and Markdown structure signatures |
| `freeze.ts` | Deep-freezes records and exact-original data |
| `index.ts` | Exposes protected-span, type and validation APIs |
| `protected-spans.ts` | Implements `protectMarkdown` and `restoreProtectedSpans` |
| `semantics.ts` | Compares semantic meaning and detects unexpected refusal |
| `types.ts` | Defines protected documents, outcomes, judges and reason codes |
| `validator.ts` | Implements `validateProjectionCandidate` |

---

## 3. PUBLIC EXPORTS

`index.ts` exports all public declarations from `protected-spans.ts`, `types.ts` and `validator.ts`. Key exports are `protectMarkdown`, `restoreProtectedSpans`, `validateProjectionCandidate`, `ProtectedMarkdownDialect`, `ProtectedSpanKinds` and `FidelityReasonCodes`.

---

## 4. VALIDATION

```bash
npm test -- test/fidelity
```

Expected result: protected-span, validation, render evidence and performance tests pass.

---

## 5. RELATED

- [Render subsystem](../render/README.md)
- [Source map](../README.md)
