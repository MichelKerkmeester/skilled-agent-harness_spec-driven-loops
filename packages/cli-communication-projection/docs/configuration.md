# Configuration

## 1. OVERVIEW

Choose one privacy mode explicitly. An ineligible or failed route returns the
exact original. It never selects an undeclared provider.

| Mode | Candidate providers | Egress consent | Fallback |
| --- | --- | --- | --- |
| Local-only | Local endpoints only | `false` | `none` |
| Hosted | Named hosted endpoints only | `true` | `none`, unless an explicit list is approved |
| Mixed | Named local and hosted endpoints | `true` | Explicit ordered list only |

Local-only policies should allow only `local-offline` and, when required,
`local-networked`. Hosted policies must require fresh retention and training-use
facts. Mixed policies must name every cross-class fallback and set
`preservePrivacyClass` deliberately. Ranking never creates a fallback.

---

## 2. COMPATIBILITY DOCTOR

Save the following as `operator/run-communication-projection-doctor.mjs`. It is
a deterministic local configuration check. The injected reachability result
contains no payload or credential. For a release, replace that injected result
with the operator's bounded endpoint probe while keeping the same request and
result types.

```js
import { runCompatibilityDoctor } from '@portable-cli/communication-projection/doctor'
import { createOllamaModelRecord } from '@portable-cli/communication-projection/providers'
import { RuntimeCapabilityMatrix } from '@portable-cli/communication-projection/runtimes'

const now = '2026-08-12T12:00:00.000Z'
const runtime = RuntimeCapabilityMatrix[0]
if (!runtime) throw new Error('No supported runtime path is published.')

const provider = createOllamaModelRecord({
  modelId: 'operator-selected-model',
  privacyClass: 'local-offline',
  observedAt: '2026-08-12T00:00:00.000Z',
  capabilitiesExpireAt: '2026-08-20T00:00:00.000Z',
})

const report = await runCompatibilityDoctor({
  proposedRuntimes: [{
    runtime: runtime.runtime,
    pathId: runtime.pathId,
    runtimeVersion: runtime.testedVersions.runtime,
    protocol: runtime.protocol,
    protocolVersion: runtime.testedVersions.protocol,
    presentationTier: runtime.presentationTier,
  }],
  proposedProviders: [provider],
  proposedModels: [{
    providerId: provider.provider.providerId,
    modelId: provider.provider.modelId,
    requiredCapabilities: [],
  }],
  credentialReferencePresence: [],
  reachabilityProbe: async () => ({ status: 'reachable', durationMs: 0 }),
  perProbeDeadlineMs: 1_000,
  totalDeadlineMs: 2_000,
  now,
})

console.log(JSON.stringify(report))
if (report.overallDecision === 'blocked') process.exitCode = 1
```

Run it with `node ./operator/run-communication-projection-doctor.mjs`. Treat a
blocked report as original-only and a degraded report as requiring explicit
operator review. Refresh dated evidence instead of bypassing a stale finding.
