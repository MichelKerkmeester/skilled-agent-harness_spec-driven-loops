---
title: "External CLI agent provider"
description: "Routes an external CLI agent as a first-class hosted-retained provider so the cli-* projection path runs through the same privacy routing, fidelity validation, and exact-original fallback as every other provider."
trigger_phrases:
  - "External CLI agent provider"
  - "external-cli provider"
  - "createExternalCliTransport"
  - "createExternalCliModelRecord"
version: 1.0.0.0
---

# External CLI agent provider (createExternalCliTransport)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Routes an external CLI agent as a first-class hosted-retained provider so the cli-* projection path runs through the same privacy routing, fidelity validation, and exact-original fallback as every other provider.

The external-cli family lets `/rewrite-response-by-external-agent` dispatch its rewrite to an installed CLI agent while staying inside the projection pipeline. The provider is inert unless a caller selects its record and transport; the default provider transport, the default-off enablement gate, and the live wrapper path are unchanged.

---

## 2. HOW IT WORKS

`createExternalCliModelRecord` builds a hosted-retained provider record whose engine selector lives in the provider id (`external-cli-<engine>`) and whose endpoint is a non-resolving `.invalid` sentinel, because the record validator requires an HTTP or HTTPS URL and no HTTP egress ever occurs. The record carries `none:cli` as its credential reference, so the CLI binary owns its own authentication and the executor performs no credential check. Inference-control capabilities are attested on the record because the transport honors them through the composed prompt rather than a remote wire field.

The external-cli family reuses the OpenAI-chat adapter, so `createExternalCliTransport` synthesizes an OpenAI-chat-shaped response whose message content is the CLI rewrite, and the shared executor, fidelity validation, and exact-original fallback apply unchanged. The subprocess lives only in `createChildProcessCliRunner`, behind an injected spawn boundary, and the per-engine command mapping is caller-supplied because it depends on which CLI binaries are installed and authenticated. Any unknown engine, missing user message, aborted request, non-zero exit, timeout, empty output, or thrown runner returns a non-2xx response that the executor maps to the exact original.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skills/sk-communication/cli-communication-projection/src/transports/cli.ts` | Handler | The external-cli transport, the child-process runner, and the injected spawn boundary. |
| `.opencode/skills/sk-communication/cli-communication-projection/src/providers/presets.ts` | Shared | `createExternalCliModelRecord` builds the hosted-retained external-cli record. |
| `.opencode/skills/sk-communication/cli-communication-projection/src/providers/adapters.ts` | Handler | Serves the external-cli adapter through the shared OpenAI-chat wire shape. |
| `.opencode/skills/sk-communication/cli-communication-projection/src/providers/registry.ts` | Shared | Accepts the external-cli family and protocol combination during validation. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skills/sk-communication/cli-communication-projection/test/transports/cli.test.ts` | Unit | Covers engine resolution, argv, stdin delivery, timeout, and fail-closed transport responses. |
| `.opencode/skills/sk-communication/cli-communication-projection/test/providers/external-cli.test.ts` | Unit | Verifies record validity, privacy routing, adapter body, and end-to-end candidate and exact-original fallback. |

---

## 4. SOURCE METADATA

- Group: Provider And Privacy
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `provider-and-privacy/external-cli-provider.md`

Related references:
- [provider-adapters-and-execution.md](provider-adapters-and-execution.md) — Shared executor and adapter surface the external-cli family plugs into
- [privacy-first-provider-routing.md](privacy-first-provider-routing.md) — Privacy decision that must approve the hosted-retained external-cli record
