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

---

## 3. ENABLEMENT

Projection is OFF by default for everyone. Pulling the repository never changes
anyone's CLI output. Nothing is rewritten until an operator opts in on their own
machine, and that choice is never committed for other people.

Two opt-in sources decide enablement, checked in this order:

1. The environment variable `COMMUNICATION_PROJECTION_ENABLED`. When it is set to
   `1`, `true`, or `on`, projection is enabled. Any other set value keeps it off.
   A set variable always wins, which lets CI and tests force either state.
2. A git-ignored `enablement.local.json` at the package root, consulted only when
   the variable is unset. It opts in when it holds `{ "enabled": true }`.

With neither source opting in, enablement is `false`. The committed
`enablement.local.json.example` template shows the file shape, and the package
`.gitignore` ignores the real `enablement.local.json` so a private opt-in stays
local.

Every activation path calls `isProjectionEnabled()` before it projects. When the
answer is `false`, the path returns the exact original output and no rewrite runs.
The decision itself is a pure function, `resolveProjectionEnablement(env,
localOverride)`, so the rule is exhaustively testable without touching the disk.

### The optional localProvider block

Enablement alone only switches projection on. To name the local model that the
projection calls, add a `localProvider` object to the same file next to
`enabled: true`:

```json
{
  "enabled": true,
  "localProvider": {
    "kind": "ollama",
    "model": "llama3.2"
  }
}
```

The block takes three fields:

| Field | Type | Required | Meaning |
| --- | --- | --- | --- |
| `kind` | string | yes | One of `ollama`, `lmstudio`, `llama.cpp`, or `openai-compatible` |
| `model` | string | yes | The model id the local server exposes |
| `endpoint` | string | no | An `http` or `https` URL. Omit it to use the kind default |

The defaults are `http://127.0.0.1:11434/api/chat` for `ollama`,
`http://127.0.0.1:1234/v1/chat/completions` for `lmstudio`, and
`http://127.0.0.1:8080/v1/chat/completions` for `llama.cpp` and
`openai-compatible`. Point `endpoint` at your server when it listens on
another port or host. An LM Studio server on its default port accepts
`http://localhost:1234/v1`:

```json
{
  "enabled": true,
  "localProvider": {
    "kind": "lmstudio",
    "model": "qwen2.5-7b-instruct",
    "endpoint": "http://localhost:1234/v1"
  }
}
```

One write is enough. The loader builds the local provider record, the
local-only privacy policy, the required judge, the local HTTP transport, and
the shipped copy-editing prompt from that single block. The OpenCode plugin
and the CLI-output wrapper project automatically from that point on.

A missing or malformed `localProvider` fails closed. The loader returns no
config, so an enabled entry point emits the byte-exact original rather than
any partial projection.
