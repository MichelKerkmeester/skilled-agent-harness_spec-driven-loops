---
title: "Decision Record: system-deep-loop runtime names (017 phase 007/002)"
description: "L2 design decisions for the system-deep-loop runtime naming phase, including runtime-root closure, manifest protections, and verification of dynamic path consumers."
trigger_phrases:
  - "system-deep-loop runtime decisions"
  - "deep loop runtime naming decision record"
  - "runtime path closure decision"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/017-hyphen-naming-convention/008-component-migration/007-system-deep-loop/002-runtime"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-hyphen-naming-convention/008-component-migration/007-system-deep-loop/002-runtime"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored runtime decisions"
    next_safe_action: "Verify runtime closure"
    blockers: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

# Decision Record: System-deep-loop runtime names

<!-- ANCHOR:context -->
## Context

The runtime surface contains six underscore-bearing directory families and 108 underscore-bearing files, alongside workspace manifests, generated databases, test configuration, and tool-mandated names. The risk is not the directory move itself; it is breaking package discovery, dynamic path consumers, or runtime state boundaries while renaming the physical paths.
<!-- /ANCHOR:context -->

<!-- ANCHOR:decisions -->
## Decisions

### DR-001 — Rename runtime roots and their consumers as one dependency-closed batch
The six runtime directory families and every link, import-like path, fixture, test, launcher, and registry consumer are mapped together. No runtime candidate is deferred to a later component phase when that would leave a live path pointing at an old basename.

### DR-002 — Preserve workspace, manifest, and data-key contracts
package-lock.json, tsconfig.json, vitest.config.ts, databases, JSON/YAML/TOML keys, Python .py files/package directories, and tool-mandated names retain their exact names unless an independently documented contract requires a path value update.

### DR-003 — Use install and runtime checks as the acceptance boundary
The phase verifies package discovery, test discovery, state access, and runtime entry points against the renamed paths. A textual replacement without a successful install/runtime closure is insufficient.
<!-- /ANCHOR:decisions -->

<!-- ANCHOR:consequences -->
## Consequences

- The runtime phase owns a large but coherent path closure rather than splitting directory names from their consumers.
- Manifest and generated-state protections reduce false positives but require an explicit candidate map for neighboring non-exempt assets.
- Verification must cover both filesystem resolution and runtime behavior, increasing the phase evidence but reducing the risk of a green text-only rename.
<!-- /ANCHOR:consequences -->

<!-- ANCHOR:references -->
## References

- Governing convention decisions: ../../../001-convention-policy-and-scope/decision-record.md.
- Phase specification and runtime inventory: spec.md.
<!-- /ANCHOR:references -->
