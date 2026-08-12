---
title: "Compatibility doctor"
description: "Checks a proposed runtime and provider route for version, capability, reachability, credential-reference, privacy-fact, and presentation-tier readiness."
trigger_phrases:
  - "Compatibility doctor"
  - "communication projection doctor"
  - "runCompatibilityDoctor"
  - "provider route readiness check"
version: 1.0.0.0
---

# Compatibility doctor (runCompatibilityDoctor)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Checks a proposed runtime and provider route for version, capability, reachability, credential-reference, privacy-fact, and presentation-tier readiness.

Operators provide the proposed runtime, provider, and model records, the presence of credential references, injected time, and a bounded reachability probe. The report contains findings and remediation guidance but no payload, credential value, prompt, or response content.

---

## 2. HOW IT WORKS

The doctor compares proposed runtime and protocol majors with version-pinned support rows, confirms requested model capabilities, runs endpoint probes under per-probe and total deadlines, and checks that hosted records have credential references without inspecting their values. It also evaluates required privacy facts for freshness and confirms that the requested presentation tier is supported by dated evidence.

Each check returns `ok`, `warn`, or `block` with a reason code and operator-facing remediation. Any block selects original-only and makes the overall report `blocked`; warnings produce `degraded` and require explicit review; only all-clear findings report `ready`. Unexpected or malformed input is caught and converted into a content-free blocked finding.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `packages/cli-communication-projection/src/doctor/doctor.ts` | Handler | Runs the check set and derives the overall route decision. |
| `packages/cli-communication-projection/src/doctor/checks.ts` | Shared | Implements version, capability, reachability, credential, privacy, and tier checks. |
| `packages/cli-communication-projection/src/doctor/types.ts` | Shared | Defines doctor inputs, findings, probes, and reports. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `packages/cli-communication-projection/test/doctor/checks.test.ts` | Unit | Covers each compatibility check and remediation result. |
| `packages/cli-communication-projection/test/doctor/doctor.test.ts` | Integration | Verifies overall ready, degraded, blocked, and malformed-input reports. |

---

## 4. SOURCE METADATA

- Group: Packaging And Release
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `packaging-and-release/compatibility-doctor.md`

Related references:
- [release-readiness-and-rollback.md](release-readiness-and-rollback.md) — Release gate that consumes a ready doctor report
