# Doctor: Route Compatibility Checks

## 1. OVERVIEW

`doctor/` checks a proposed runtime and provider route before activation. It evaluates version compatibility, capability presence, endpoint reachability, credential references, privacy fact freshness and presentation tier.

Any blocking finding selects the original-only route. Warnings produce a degraded decision for operator review.

---

## 2. KEY FILES

| File | Responsibility |
|---|---|
| `checks.ts` | Implements the six compatibility checks and malformed-input finding |
| `doctor.ts` | Runs checks and builds a content-free `DoctorReport` |
| `index.ts` | Exposes the doctor API |
| `types.ts` | Defines proposals, probes, findings and reports |

---

## 3. PUBLIC EXPORTS

`index.ts` exports `runCompatibilityDoctor`, `checkVersionCompatibility`, `checkCapabilityPresence`, `checkEndpointReachability`, `checkCredentialReferencePresence`, `checkPrivacyFactFreshness` and `checkPresentationTier`. Public types include `DoctorInput`, `DoctorFinding`, `DoctorReport` and the proposal and probe contracts.

---

## 4. VALIDATION

```bash
npm test -- test/doctor
```

Expected result: individual check and complete doctor tests pass.

---

## 5. RELATED

- [Configuration reference](../../docs/configuration.md)
- [Source map](../README.md)
