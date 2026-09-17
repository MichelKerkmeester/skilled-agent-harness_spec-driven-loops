# Contracts: Versioned Records and Validators

## 1. OVERVIEW

`contracts/` defines the serializable records shared across runtime ingestion, privacy routing, projection, telemetry and evaluation. Validators return typed `ValidationResult` values and preserve invalid input for fail-closed handling.

Every pipeline subsystem depends on these contracts. Contract modules do not depend on provider transports or client presentation code.

---

## 2. KEY FILES

| File | Responsibility |
|---|---|
| `common.ts` | Shared JSON, header, provenance, validation and runtime types |
| `context.ts` | Bounded context and privacy decision records |
| `error-record.ts` | Typed error outcomes |
| `errors.ts` | Contract validation error codes and exception type |
| `event.ts` | Runtime-neutral event envelopes and lifecycle constants |
| `evidence.ts` | Telemetry, benchmark and evaluation evidence records |
| `exact-original.ts` | Exact-original encoding, digest and verification |
| `fixture.ts` | Fixture metadata and runtime fixture classes |
| `index.ts` | Public contract barrel |
| `projection.ts` | Accepted, rejected and exact-original projection outcomes |
| `prompt.ts` | Prompt profiles and control mappings |
| `provider.ts` | Provider identity, capability and fallback records |
| `registry.ts` | Contract-kind dispatch through `validateContract` |
| `validate-event.ts` | Event stream and exact-original validation |
| `validate-evidence.ts` | Telemetry, benchmark, evaluation and error validation |
| `validate-policy.ts` | Context, privacy, projection, prompt and provider validation |
| `validator-utils.ts` | Shared validation predicates and issue helpers |

---

## 3. PUBLIC EXPORTS

The barrel exports contract constants such as `ContractKinds`, `RuntimeIds`, `PrivacyClasses`, `EventKinds`, `TelemetryEventNames` and `ProjectionReasonCodes`. It exports `validateContract`, `assertValidContract`, `isContractKind`, the event, evidence and policy validators and exact-original helpers including `createExactOriginalRecord`, `createSha256Digest`, `decodeExactOriginal` and `verifyExactOriginal`.

`index.ts` also exports the record and result types declared by the contract modules.

---

## 4. VALIDATION

```bash
npm run test:contracts
```

Expected result: contract compatibility, fixtures, package surface and schema benchmark tests pass.

---

## 5. RELATED

- [Source map](../README.md)
- [Versioning subsystem](../versioning/README.md)
