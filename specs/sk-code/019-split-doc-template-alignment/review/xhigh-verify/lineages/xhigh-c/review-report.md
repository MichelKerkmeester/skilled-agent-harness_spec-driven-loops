---
title: Deep Review Report - xhigh-c
description: Four-iteration detached verification lineage for sk-code split-document template alignment.
---

# Deep Review Report - xhigh-c

## Executive Summary

- **Verdict:** CONDITIONAL
- **hasAdvisories:** false
- **Active findings:** P0=0, P1=2, P2=3
- **Release-readiness state:** converged review with required remediation
- **Stop reason:** `maxIterationsReached` after 4 of 4 required iterations
- **Scope:** 163 configured Markdown paths representing 160 resolved document targets across the six reference/asset roots.

All four configured dimensions were reviewed. Two P1 findings require remediation: one scoped Rust reference omits the mandatory Overview wrapper, and one security checklist positively labels a JavaScript-accessible session cookie despite later requiring server-side `HttpOnly`. Three P2 classes remain advisory. The review reached its operator-selected iteration ceiling; convergence before iteration 4 was telemetry only.

## Planning Trigger

`/speckit:plan` is required because active P1 findings remain.

**Planning Packet**

```json
{
  "triggered": true,
  "verdict": "CONDITIONAL",
  "hasAdvisories": false,
  "activeFindings": [
    {
      "id": "I1-P1-001",
      "severity": "P1",
      "findingClass": "instance-only",
      "file": ".opencode/skills/sk-code/code-opencode/references/rust/style_guide/interop_errors_and_parity.md:19",
      "affectedSurfaceHints": ["code-opencode Rust references", "resource-document validation", "completion evidence"]
    },
    {
      "id": "I2-P1-001",
      "severity": "P1",
      "findingClass": "instance-only",
      "file": ".opencode/skills/sk-code/code-webflow/references/implementation/security_patterns/overview_and_checklist.md:94",
      "affectedSurfaceHints": ["code-webflow security checklist", "session cookie guidance", "copy-paste security examples"]
    },
    {
      "id": "I1-P2-001",
      "severity": "P2",
      "findingClass": "class-of-bug",
      "file": ".opencode/skills/sk-code/code-opencode/references/workflow_debug.md:16",
      "affectedSurfaceHints": ["shared workflow references", "intro contract"]
    },
    {
      "id": "I2-P2-001",
      "severity": "P2",
      "findingClass": "class-of-bug",
      "file": ".opencode/skills/sk-code/code-webflow/references/implementation/third_party_integrations/best_practices_and_summary.md:40",
      "affectedSurfaceHints": ["third-party integration guidance", "dynamic script loaders", "CDN supply-chain hardening"]
    },
    {
      "id": "I4-P2-001",
      "severity": "P2",
      "findingClass": "class-of-bug",
      "file": ".opencode/skills/sk-code/code-webflow/references/implementation/third_party_integrations/best_practices_and_summary.md:28",
      "affectedSurfaceHints": ["code-webflow implementation references", "human document routing"]
    }
  ],
  "remediationWorkstreams": [
    "Restore mandatory document structure and strengthen structural validation",
    "Correct contradictory session-cookie guidance",
    "Resolve bounded documentation-quality advisories",
    "Close or explicitly accept content-preservation evidence debt"
  ],
  "specSeed": [
    "Add acceptance evidence that tests the Overview wrapper independently of numbered-H2 validator behavior",
    "Require production security examples to preserve HttpOnly and trust-boundary semantics",
    "Define whether corpus-wide historical content-preservation proof is required for closure"
  ],
  "planSeed": [
    "Fix I1-P1-001 and add a regression check for documents with no numbered H2",
    "Fix I2-P1-001 and verify all positively labelled session-cookie examples",
    "Address or explicitly defer I1-P2-001, I2-P2-001, and I4-P2-001",
    "Re-run the 163-path structure, security-guidance, and link checks"
  ],
  "findingClasses": ["instance-only", "class-of-bug"],
  "affectedSurfacesSeed": [
    "code-opencode Rust references",
    "code-webflow security references",
    "shared workflow references",
    "code-webflow third-party integration references"
  ],
  "fixCompletenessRequired": true
}
```

## Active Finding Registry

### I1-P1-001 - Missing mandatory Overview wrapper

- **Severity / dimension:** P1 / correctness
- **Evidence:** `.opencode/skills/sk-code/code-opencode/references/rust/style_guide/interop_errors_and_parity.md:13-21` moves from H1 intro directly to `### Error Style`; R3 requires `## 1. OVERVIEW` plus Purpose and When to Use at `.opencode/specs/sk-code/019-split-doc-template-alignment/spec.md:67-72`.
- **Impact:** The packet's complete structural-conformance claim is false for one in-scope reference, and the validator's no-numbered-H2 path does not expose the omission.
- **Recommendation:** Add the required Overview wrapper without changing substantive content and add a validator regression for this file shape.
- **Disposition:** active
- **Finding class:** instance-only
- **Scope proof:** Iteration 1 scanned all 163 configured paths and isolated one wrapper omission; iterations 3 and 4 narrowly reconfirmed it.
- **Affected surfaces:** code-opencode Rust references; resource-document validation; completion evidence.

### I2-P1-001 - JavaScript-accessible session cookie labelled good

- **Severity / dimension:** P1 / security
- **Evidence:** `.opencode/skills/sk-code/code-webflow/references/implementation/security_patterns/overview_and_checklist.md:89-98` labels `document.cookie = "session=..."` good, while the same document requires server-side `Secure; HttpOnly; SameSite=Strict` and calls JavaScript-accessible session cookies bad at `:247-258`.
- **Impact:** Readers can copy a session pattern that cannot set `HttpOnly`, leaving the session value readable to injected scripts.
- **Recommendation:** Replace the good example with a server-side `Set-Cookie` example or explicitly make it a non-sensitive demonstration cookie.
- **Disposition:** active
- **Finding class:** instance-only
- **Scope proof:** Iteration 2's scoped security search found no other positively labelled JavaScript session-cookie assignment; iteration 4 reconfirmed the contradiction.
- **Affected surfaces:** code-webflow security checklist; session cookie guidance; copy-paste security examples.

### I1-P2-001 - Seven intros exceed the 1-2 sentence contract

- **Severity / dimension:** P2 / correctness
- **Evidence:** `.opencode/skills/sk-code/code-opencode/references/workflow_debug.md:14-20` contains a three-sentence intro; the same pattern occurs in the shared workflow aliases and one CSS quality reference.
- **Impact:** Minor template drift and avoidable duplication before Overview.
- **Recommendation:** Compress the seven intros to one or two sentences while preserving meaning.
- **Disposition:** active advisory
- **Finding class:** class-of-bug
- **Scope proof:** Full-corpus opening-shape scan isolated seven instances.
- **Affected surfaces:** shared workflow references; code-webflow CSS quality reference.

### I2-P2-001 - CDN loader omits origin and integrity constraints

- **Severity / dimension:** P2 / security
- **Evidence:** `.opencode/skills/sk-code/code-webflow/references/implementation/third_party_integrations/best_practices_and_summary.md:34-55` accepts arbitrary `url` input and sets `script.src` without an allowlist or `integrity`.
- **Impact:** The labelled production pattern does not document supply-chain authentication or trusted-origin preconditions.
- **Recommendation:** Document trusted origins and add allowlist plus `integrity`/`crossOrigin` guidance when stable hashes exist.
- **Disposition:** active advisory
- **Finding class:** class-of-bug
- **Scope proof:** Iteration 2 searched all scoped Markdown guidance for dynamic script loaders and integrity assignments.
- **Affected surfaces:** third-party integration guidance; dynamic script loaders; CDN hardening.

### I4-P2-001 - Six tautological When-to-Use sections

- **Severity / dimension:** P2 / maintainability
- **Evidence:** `.opencode/skills/sk-code/code-webflow/references/implementation/third_party_integrations/best_practices_and_summary.md:26-29` says to use the reference when implementing or troubleshooting its title; the governing template uses concrete scenarios at `.opencode/skills/sk-doc/create-skill/assets/skill/skill_reference_template.md:98-109`.
- **Impact:** Readers receive little actionable routing guidance, increasing future selection and maintenance cost.
- **Recommendation:** Replace each tautology with two or three task- or symptom-specific bullets.
- **Disposition:** active advisory
- **Finding class:** class-of-bug
- **Scope proof:** Iteration 4 isolated six exact boilerplate instances across the configured roots.
- **Affected surfaces:** code-webflow implementation references; human document routing.

## Remediation Workstreams

1. **P1 structural conformance:** Fix `I1-P1-001`, strengthen validation for missing numbered H2/Overview, and replay all 163 configured paths.
2. **P1 security guidance:** Fix `I2-P1-001`, search same-class cookie examples, and verify server/client trust-boundary wording.
3. **P2 documentation quality:** Address the seven intro-length instances and six tautological When-to-Use sections as bounded class fixes.
4. **P2 supply-chain guidance:** Document origin and integrity controls for dynamic CDN loaders without overstating provider support.
5. **Evidence debt:** Complete a normalized 160-target historical preservation audit or explicitly accept representative-only evidence.

## Spec Seed

- Add an acceptance criterion that rejects a reference lacking `## 1. OVERVIEW` even when no numbered H2 exists.
- Add a security-example criterion that session-cookie guidance must preserve server-side `HttpOnly` semantics.
- Clarify whether R4 requires corpus-wide historical proof or whether deterministic current-state checks plus representative rename evidence suffice.
- Keep the 163 lexical path / 160 resolved target distinction explicit in verification evidence.

## Plan Seed

1. Patch the Rust interop reference with the required wrapper and no substantive body change.
2. Add a validator regression for a file that jumps from H1 intro to unnumbered H3 content.
3. Replace the JavaScript session-cookie GOOD example with server-side guidance and search for same-class positive examples.
4. Apply bounded intro and When-to-Use class fixes, then rerun exact scans.
5. Add trusted-origin and integrity caveats to the dynamic script-loader guidance.
6. Decide and execute the R4 evidence strategy for the remaining 158 resolved targets.
7. Re-run strict packet validation, per-file validation, naming checks, and scoped link checks.

## Traceability Status

### Core Protocols

| Protocol | Status | Evidence | Unresolved drift |
|----------|--------|----------|------------------|
| `spec_code` | fail | `spec.md:67-72`; `interop_errors_and_parity.md:13-21` | R3 remains contradicted by one current file. |
| `checklist_evidence` | fail | `checklist.md:49,90-95`; current Rust counterexample | The reported validator pass is real but insufficient to prove R3. |

### Overlay Protocols

| Protocol | Status | Evidence | Notes |
|----------|--------|----------|-------|
| `feature_catalog_code` | notApplicable | `spec.md:55-60` | Feature-catalog files are excluded and no capability claim is made. |
| `playbook_capability` | notApplicable | `spec.md:55-60`; `plan.md:23-28` | Playbooks are excluded and the packet declares no runtime change. |
| `skill_agent` | notApplicable | target type | This review targets a spec folder. |
| `agent_cross_runtime` | notApplicable | target type | This review targets a spec folder. |

- **AC_COVERAGE:** disabled. The strict validator reported `Acceptance coverage gate disabled`; no AC score altered the verdict.

## Deferred Items

- `content_preservation` remains search debt. Two representative rename histories show 81% and 90% similarity with substantive lines retained, but 158 resolved targets lack equivalent proof.
- The target packet's strict validation returned five warnings: priority tags, spec-doc sufficiency, uncited completed items, complexity match, and section counts. These warnings were recorded but not converted into new review findings without iteration-level adjudication.
- Memory trigger and focused packet-context calls timed out; direct packet and source evidence supplied the review context.

## Dimension Expansion Map

- Reducer-owned completed pivots: 0
- Reducer-owned failed pivots: 0
- Reducer-owned audited overrides: 0
- Divergent Council artifacts: none
- Covered dimensions: correctness, security, traceability, maintainability
- Remaining dimension frontier: none; remediation and evidence closure remain.

## Search Ledger

- **graphCoverageMode:** `graphless_fallback`
- **candidateCoverage:** covered=7, ruledOut=17, deferred=1, blocked=0
- **latest required classes:** `when_to_use_clarity`, `unresolved_maintenance_markers`, `content_preservation`, `active_finding_drift`
- **latest covered:** `when_to_use_clarity`
- **latest ruled out:** `unresolved_maintenance_markers`, `active_finding_drift`
- **latest deferred:** `content_preservation`
- **hasSearchDebt:** true
- **Clean proof highlights:** frontmatter/version, filename/link integrity, unsafe secret handling, client-only authorization, direct input execution, destructive command guidance, 163-path inventory, and unresolved maintenance markers were ruled out with cited evidence.

## Audit Appendix

### Iterations

| Iteration | Focus | New P0/P1/P2 | Ratio | Mechanical gate |
|-----------|-------|---------------|------:|-----------------|
| 1 | correctness | 0/1/1 | 1.0000 | pass after one schema-only verdict-tail repair |
| 2 | security | 0/1/1 | 0.5000 | pass |
| 3 | traceability | 0/0/0 | 0.0000 | pass |
| 4 | maintainability | 0/0/1 | 0.0769 | pass |

### Convergence Replay

- Configured stop policy: `max-iterations`; configured ceiling: 4.
- Recorded iteration count: 4; terminal stop: `maxIterationsReached`.
- Reducer convergence score before terminal event: 0.9231.
- Graph convergence remained `CONTINUE` with an empty session graph because the lineage write boundary prohibited graph seeding outside its artifact directory.
- All four dimensions were covered. Iterations 3 and 4 added no P0/P1, but two earlier P1s remain active.
- Claim-adjudication events passed for all four iterations; both P1s survived current-source counterevidence rereads.

### Validation Evidence

- `verify-iteration.cjs`: pass for iterations 1-4.
- Reducer: five open findings, no JSONL corruption, search debt count 1.
- `resource-map.md`: emitted inside the lineage from converged deltas; four finding-bearing source paths recorded.
- Strict spec validation: 0 errors, 5 warnings, non-zero result.
- Skill advisor: `system-deep-loop` and `command-spec-kit-deep-review` surfaced above threshold.
- Packet resource-map coverage gate: skipped because no packet `resource-map.md` existed at initialization.
- Writes remained inside `.opencode/specs/sk-code/019-split-doc-template-alignment/review/xhigh-verify/lineages/xhigh-c`.
