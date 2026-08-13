# Privacy: Provider Route Selection

## 1. OVERVIEW

`privacy/` evaluates provider metadata before any transport call. It enforces explicit egress consent, fresh privacy facts, named fallback policy and privacy-class preservation.

The router ranks only eligible records. Missing or contradictory facts return a denied route for exact-original handling.

---

## 2. KEY FILES

| File | Responsibility |
|---|---|
| `index.ts` | Exposes route selection and privacy route types |
| `router.ts` | Implements `selectPrivacyRoute` and `rankEligibleProviders` |
| `types.ts` | Defines policies, evaluations, routes and reason codes |

---

## 3. PUBLIC EXPORTS

`index.ts` exports `selectPrivacyRoute`, `rankEligibleProviders` and `PrivacyRoutingReasonCodes`. It also exports `PrivacyRouteInput`, `PrivacyRoutePolicy`, `ProviderPrivacyEvaluation`, `ApprovedPrivacyRoute`, `DeniedPrivacyRoute`, `PrivacyRoute` and related types.

---

## 4. VALIDATION

```bash
npm test -- test/providers/privacy.test.ts
```

Expected result: privacy-first provider routing tests pass.

---

## 5. RELATED

- [Privacy reference](../../docs/privacy.md)
- [Providers subsystem](../providers/README.md)
