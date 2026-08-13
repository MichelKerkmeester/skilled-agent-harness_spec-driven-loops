# Support Matrix

## 1. OVERVIEW

Import `SupportMatrix` and `assessSupportMatrixFreshness` from
`@portable-cli/communication-projection/release`. The matrix publishes dated,
content-free claims for runtime, protocol, provider, model, operating system,
prompt profile and presentation tier.

---

## 2. FRESHNESS CHECK

```js
import {
  SupportMatrix,
  assessSupportMatrixFreshness,
} from '@portable-cli/communication-projection/release'

const result = assessSupportMatrixFreshness(SupportMatrix, new Date().toISOString())
console.log(JSON.stringify({ status: result.status, reasons: result.reasonCodes }))
if (result.decision !== 'allow') process.exitCode = 1
```

---

## 3. STATUS RULES

`supported` means the dated evidence supports release use. `provisional` needs
operator confirmation. `unsupported`, malformed dates and expired evidence
block the route. A compatible major version is not enough when its evidence is
stale.

---

## 4. RELEASE EVIDENCE

The automated six-runtime rehearsal uses injected transports and synthetic,
content-free fixtures. A real credentialed provider smoke is an operator-run
release prerequisite and must never be replaced by the injected rehearsal.
