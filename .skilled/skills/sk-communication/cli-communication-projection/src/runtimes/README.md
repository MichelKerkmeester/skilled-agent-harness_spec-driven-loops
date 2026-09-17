# Runtimes: Event and Presentation Adapters

## 1. OVERVIEW

`runtimes/` maps Claude, Codex, Cursor, Devin, OpenCode and Pi events into the shared envelope contract. Each adapter publishes dated capability evidence and a presentation method that cannot write canonical state.

The capability matrix chooses full projection or safe-native degradation and forces incompatible major versions to original-only.

---

## 2. KEY FILES

| File | Responsibility |
|---|---|
| `adapter.ts` | Defines adapter conformance and generation mapping |
| `capability.ts` | Maps evidence and checks runtime and protocol compatibility |
| `claude.ts` | Implements the Claude adapter and capability records |
| `codex.ts` | Implements the Codex adapter and capability records |
| `cursor.ts` | Implements the Cursor adapter and capability records |
| `devin.ts` | Implements the Devin adapter and capability records |
| `index.ts` | Exposes runtime adapters, matrix APIs and types |
| `matrix.ts` | Builds and resolves `RuntimeCapabilityMatrix` |
| `opencode.ts` | Implements the OpenCode adapter and capability records |
| `pi.ts` | Implements the Pi adapter and synchronous presentation helper |
| `types.ts` | Defines envelopes, capabilities, outcomes and reason codes |

---

## 3. PUBLIC EXPORTS

The barrel exports conformance and capability helpers, six adapter factories and instances, each runtime's event and path constants, `RuntimeCapabilityMatrix`, matrix helpers and `RuntimeAdapterReasonCodes`. It also exports runtime event, capability, envelope, presentation and result types.

---

## 4. VALIDATION

```bash
npm test -- test/runtimes
```

Expected result: six adapter suites, conformance, fixtures, matrix, smoke and performance tests pass.

---

## 5. RELATED

- [Clients subsystem](../clients/README.md)
- [Support matrix reference](../../docs/support-matrix.md)
