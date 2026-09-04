---
title: "Context Lib: Shared Runtime Context Contracts"
description: "The typed shared-payload contract for startup, resume, bootstrap, health, and compaction surfaces, with its trust, provenance, and publication helpers."
trigger_phrases:
  - "context contracts"
  - "shared payload"
  - "structural trust"
  - "publication gate"
---

# Context Lib: Shared Runtime Context Contracts

---

## 1. OVERVIEW

`runtime/lib/context/` owns the typed context payload contract shared by the runtime hook adapters and the resume, health, bootstrap, and compaction paths. It keeps payload shape, provenance, trust metadata, and publishability rules in one small module so producers do not each redefine them.

Current state:

- `shared-payload.ts` is the only module here. It defines the canonical envelope plus the section, provenance, source, trust, advisor, and metric types used by context producers.
- Trust and provenance vocabularies (`SharedPayloadTrustState`, `DetectorProvenance`, `ParserProvenance`, `EvidenceStatus`, `FreshnessAuthority`, `MeasurementAuthority`) live beside the envelope so every producer narrows the same values.
- Publication rules for metric-bearing fields are part of the same contract: `createPublishableMetricField` and `createPublicationMethodologyMetadata` require certainty, methodology status, schema version, and authority before a number is publishable.

---

## 2. ARCHITECTURE

```text
╭──────────────────────────────────────────────────────────────────╮
│                         CONTEXT LIB                              │
╰──────────────────────────────────────────────────────────────────╯

┌────────────────┐     ┌────────────────────┐     ┌──────────────────┐
│ hook adapters  │ ──▶ │ shared-payload.ts  │ ──▶ │ consumer surface │
│ resume/health  │     │ envelope contract  │     │ typed context    │
└────────────────┘     └──────────┬─────────┘     └──────────────────┘
                                  │
                                  ▼
                       ┌────────────────────┐
                       │ trust, provenance  │
                       │ publication fields │
                       └────────────────────┘

Dependency direction:
context callers ───▶ context contracts ───▶ utility seams and type-only graph contracts
envelope construction ───▶ shared payload validation
publication checks ───▶ shared payload metric helpers
```

---

## 3. PACKAGE TOPOLOGY

```text
context/
+-- shared-payload.ts       # Canonical shared payload, trust and publication contracts
`-- README.md
```

Allowed dependency direction:

```text
hook adapters, resume, health and bootstrap producers → lib/context/
shared-payload.ts → neutral lib/utils seams and shared type packages
```

Disallowed dependency direction:

```text
lib/context/ → hook runtimes as side-effect owners
lib/context/ → database or filesystem mutation paths
lib/context/ → retrieval policy ownership
```

---

## 4. DIRECTORY TREE

```text
runtime/lib/context/
+-- shared-payload.ts
`-- README.md
```

---

## 5. KEY FILES

| File | Responsibility |
|---|---|
| `shared-payload.ts` | Defines shared payload kinds, trust states, certainty labels, structural trust axes, source refs, advisor metadata, metric publication metadata, envelope factories, and validation helpers. |

---

## 6. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Imports | Context files may depend on neutral utility seams, shared type packages, and type-only graph contracts. |
| Exports | Export contracts and pure helpers only. Runtime producers import this folder instead of redefining payload shapes. |
| Ownership | This folder owns context contract vocabulary. Retrieval, indexing, graph scans, and hook installation live outside this folder. |

Main flow:

```text
╭──────────────────────────────────────────╮
│ resume, bootstrap, health or hook caller │
╰──────────────────────────────────────────╯
                   │
                   ▼
┌──────────────────────────────────────────┐
│ build or receive SharedPayloadEnvelope   │
└──────────────────────────────────────────┘
                   │
                   ▼
┌──────────────────────────────────────────┐
│ validate kind, producer and trust state  │
└──────────────────────────────────────────┘
                   │
                   ▼
┌──────────────────────────────────────────┐
│ attach provenance and metric metadata    │
└──────────────────────────────────────────┘
                   │
                   ▼
╭──────────────────────────────────────────╮
│ caller receives typed runtime context    │
╰──────────────────────────────────────────╯
```

---

## 7. ENTRYPOINTS

| Entrypoint | Type | Purpose |
|---|---|---|
| `SharedPayloadEnvelope` | Type | Canonical payload envelope consumed by startup, resume, health, bootstrap, and compaction paths. |
| `createSharedPayloadEnvelope` | Function | Builds a validated envelope from a kind, producer, sections, and provenance. |
| `coerceSharedPayloadEnvelope` | Function | Narrows unknown runtime payload data to the shared envelope contract and rejects invalid enum values. |
| `buildStructuralContextTrust` | Function | Derives the structural trust axes a producer attaches to an envelope. |
| `validateStructuralTrustPayload` | Function | Rejects a payload whose structural trust block is missing or malformed. |
| `createPublishableMetricField` | Function | Wraps a metric value with the certainty and authority a publication decision needs. |
| `createPublicationMethodologyMetadata` | Function | Records methodology status, schema version, and provenance for a metric-bearing row. |

---

## 8. VALIDATION

Run from the repository root.

```bash
node .opencode/skills/sk-doc/scripts/extract_structure.py .opencode/skills/system-spec-kit/runtime/lib/context/README.md
node .opencode/skills/sk-doc/scripts/validate_document.py .opencode/skills/system-spec-kit/runtime/lib/context/README.md
```

Expected result: the structure extractor reports README type with no critical issues, and document validation exits `0`.

---

## 9. RELATED

- [`../resume/README.md`](../resume/README.md)
- [`../../hooks/README.md`](../../hooks/README.md)
- [`../continuity/README.md`](../continuity/README.md)
