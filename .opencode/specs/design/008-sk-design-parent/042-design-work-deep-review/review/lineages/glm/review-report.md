# Deep Review Report — `skill:sk-design` (glm lineage)

> **Lineage:** glm · **Executor:** cli-opencode / `zai-coding-plan/glm-5.2` · **Session:** `fanout-glm-1782750389509-8fbzzu`
> **Siblings:** codex (`gpt-5.5`) — merge applies strongest-restriction at the orchestrator level.
> **Iterations:** 4 · **Stop reason:** `converged` (composite stop score 0.75 ≥ 0.60, all legal-stop gates green)

---

## 1. Executive Summary

| Field | Value |
|---|---|
| **Verdict** | **PASS** |
| **hasAdvisories** | true (10 active P2 findings) |
| **Active findings** | P0=0 · P1=0 · P2=10 |
| **Dimensions covered** | 4/4 (correctness, security, traceability, maintainability) |
| **Required protocols executed** | spec_code ✓ · checklist_evidence (n/a) · skill_agent ✓ · feature_catalog_code ✓ · playbook_capability ✓ |
| **Release readiness state** | converged |
| **Scope** | `skill:sk-design` primary surface (8 gate scripts + 3 metadata files + 5 mode-packet SKILL.md + runtime `design.md`) + secondary surface (deep-improvement skill-benchmark code, deferred to a follow-up review since it is owned by another skill) |

The `sk-design` skill is structurally healthy. All four standing invariants from the orchestrator's reviewScopeNote hold on direct execution: `design-command-surface-check` returns `STATUS=PASS drift=0`; `naming_doc_check` exhibits correct 0/1/2 exit-code discipline; the canonical inputs to `numeric_law_check` and `variant_parameter_check` pass cleanly; the two `ai-fingerprint-*` checks return clean parity; and no literal 3-digit spec/packet/phase IDs leak into skill code. The 10 active findings are all P2 advisories spanning correctness hardening, security-posture improvements on the Playwright extraction backend, internal prose-vs-boolean drift in `mode-registry.json`, runtime capability asymmetry, and structural maintainability issues (helper duplication, copy-paste section headers).

No remediation blocks the verdict. The advisories should be triaged in a follow-up planning packet, but the skill ships as-is.

---

## 2. Planning Trigger

**Verdict: PASS.** No `/speckit:plan` is required for release. The 10 advisories are P2-only; route them to backlog grooming or a small hardening packet rather than a remediation workflow.

### Planning Packet

```json
{
  "triggered": false,
  "verdict": "PASS",
  "hasAdvisories": true,
  "activeFindings": {
    "P0": 0,
    "P1": 0,
    "P2": 10,
    "byCategory": {
      "correctness": 1,
      "security": 5,
      "traceability": 2,
      "maintainability": 2
    }
  },
  "remediationWorkstreams": [
    {
      "id": "WS-1",
      "title": "Playwright backend security hardening",
      "severity": "P2",
      "findingIds": ["F002", "F003", "F004", "F005", "F006"],
      "rationale": "Tighten the crawl/guided-run posture so production crawls cannot trigger real-world side effects (modal clicks), suppress GDPR consent, or hang indefinitely. Group as one workstream because all 5 findings share the same files (crawl.ts, guided-run.ts, extract.ts) and a single hardening pass lands them together."
    },
    {
      "id": "WS-2",
      "title": "Metadata and runtime-agent prose drift",
      "severity": "P2",
      "findingIds": ["F007", "F008"],
      "rationale": "Correct the mode-registry.json internal contradiction and document the runtime design.md capability asymmetry."
    },
    {
      "id": "WS-3",
      "title": "Structural maintainability cleanup",
      "severity": "P2",
      "findingIds": ["F009", "F010"],
      "rationale": "Extract the duplicated markdown-cell helpers into a single shared module and renumber the design-md-generator backend section headers."
    },
    {
      "id": "WS-4",
      "title": "Verdict-regex hardening (advisory only)",
      "severity": "P2",
      "findingIds": ["F001"],
      "rationale": "Tighten proof_check.py's READY regex so body prose cannot inflate the verdict signal. Single-file, low blast radius."
    }
  ],
  "specSeed": "Add a sk-design hardening spec under .opencode/specs/skilled-agent-orchestration/ covering WS-1 through WS-4 as advisory-only workstreams. Do NOT block release on these.",
  "planSeed": [
    "WS-1 (5 findings): narrow SAFE_BUTTON_PATTERNS or gate triggerModals behind --allow-side-effects; replace querySelectorAll('*') cookie scan with the explicit COOKIE_SELECTORS list; broaden isCaptchaPage to cover hCaptcha/Turnstile/Arkose/Datadome/PerimeterX; add a 5-minute timeout to guided-run.ts spawnSync; normalize --extra-urls entries through the same https://-prefix map.",
    "WS-2 (2 findings): rewrite the mode-registry.json advisorRoutingContract.grandfatheredFolderMismatch prose to say 'none are grandfathered'; document the OpenCode/Claude design.md capability asymmetry in SKILL.md §7.",
    "WS-3 (2 findings): extract _clean_cell/_split_table_row/_is_separator_row into shared/scripts/md_table_utils.py and import from the 7 gate scripts; renumber extract.ts and crawl.ts section headers (or drop the numbered scheme).",
    "WS-4 (1 finding): tighten proof_check.py:46 READY regex to require an anchor (e.g., '**Verdict:** READY' or '[x] READY')."
  ],
  "findingClasses": {
    "correctness_regex_loose_match": ["F001"],
    "security_real_world_side_effects": ["F002"],
    "security_consent_suppression": ["F003"],
    "security_incomplete_vendor_coverage": ["F004"],
    "security_missing_timeout": ["F005"],
    "security_input_normalization_gap": ["F006"],
    "traceability_metadata_self_contradiction": ["F007"],
    "traceability_runtime_capability_drift": ["F008"],
    "maintainability_helper_duplication": ["F009"],
    "maintainability_comment_drift": ["F010"]
  },
  "affectedSurfacesSeed": [
    ".opencode/skills/sk-design/shared/scripts/proof_check.py",
    ".opencode/skills/sk-design/design-md-generator/backend/scripts/crawl.ts",
    ".opencode/skills/sk-design/design-md-generator/backend/scripts/guided-run.ts",
    ".opencode/skills/sk-design/design-md-generator/backend/scripts/extract.ts",
    ".opencode/skills/sk-design/mode-registry.json",
    ".opencode/skills/sk-design/SKILL.md",
    ".opencode/skills/sk-design/shared/scripts/numeric_law_check.py",
    ".opencode/skills/sk-design/shared/scripts/variant_parameter_check.py",
    ".opencode/skills/sk-design/shared/scripts/ai-fingerprint-registry-check.mjs",
    ".opencode/skills/sk-design/design-foundations/scripts/naming_doc_check.py",
    ".opencode/skills/sk-design/design-foundations/scripts/baseline_rhythm_check.py",
    ".opencode/skills/sk-design/design-audit/scripts/perf_evidence_check.py",
    ".opencode/skills/sk-design/design-audit/scripts/polish_readiness_check.py"
  ],
  "fixCompletenessRequired": false
}
```

---

## 3. Active Finding Registry

All 10 findings are P2 advisories. None are deduped against each other (each touches a different code path or document claim).

| ID | Sev | Dimension | Title | file:line | Status |
|---|---|---|---|---|---|
| F001 | P2 | correctness | `proof_check.py` READY regex accepts any bolded READY in prose | `.opencode/skills/sk-design/shared/scripts/proof_check.py:46` | active |
| F002 | P2 | security | `triggerModals` clicks `subscribe`/`join` buttons on production sites | `.opencode/skills/sk-design/design-md-generator/backend/scripts/crawl.ts:514` | active |
| F003 | P2 | security | `dismissCookieBanners` uses `querySelectorAll('*')` and suppresses GDPR consent | `.opencode/skills/sk-design/design-md-generator/backend/scripts/crawl.ts:178` | active |
| F004 | P2 | security | `isCaptchaPage` misses hCaptcha, Turnstile, Arkose, Datadome, PerimeterX | `.opencode/skills/sk-design/design-md-generator/backend/scripts/crawl.ts:283` | active |
| F005 | P2 | security | `guided-run` `spawnSync` has no timeout; hung child blocks runner | `.opencode/skills/sk-design/design-md-generator/backend/scripts/guided-run.ts:114` | active |
| F006 | P2 | security | `--extra-urls` entries skip URL normalization | `.opencode/skills/sk-design/design-md-generator/backend/scripts/extract.ts:766` | active |
| F007 | P2 | traceability | `mode-registry.json` prose says "all five grandfathered" but per-mode booleans say `false` | `.opencode/skills/sk-design/mode-registry.json:17` | active |
| F008 | P2 | traceability | Runtime `design.md` frontmatter drift: OpenCode grants WebFetch, Claude omits | `.opencode/agents/design.md:1` | active |
| F009 | P2 | maintainability | Markdown-cell helpers (`_clean_cell`, `_split_table_row`, `_is_separator_row`) duplicated across 7 Python gate scripts | `.opencode/skills/sk-design/shared/scripts/numeric_law_check.py:35` | active |
| F010 | P2 | maintainability | `extract.ts` and `crawl.ts` duplicated section-header comments | `.opencode/skills/sk-design/design-md-generator/backend/scripts/extract.ts:40` | active |

Each entry's full evidence and recommendation lives in the iteration file where it was first seen (see §10 Audit Appendix).

---

## 4. Remediation Workstreams

Ordered by blast radius (largest first), then by file grouping (lands together).

### WS-1 · Playwright backend security hardening (F002, F003, F004, F005, F006)

| Finding | Action | File |
|---|---|---|
| F002 | Gate `triggerModals` behind `--allow-side-effects` OR restrict button candidates by `aria-haspopup` / nav-anchored scope | `crawl.ts:514` |
| F003 | Remove the `querySelectorAll('*')` blanket loop (lines 178-192); rely on the explicit `COOKIE_SELECTORS` list | `crawl.ts:178` |
| F004 | Extend `isCaptchaPage` selectors: add hCaptcha (`iframe[src*="hcaptcha"]`), Turnstile (`iframe[src*="challenges.cloudflare.com/turnstile"]`), Arkose (`.arkose-iframe` / `iframe[src*="arkoselabs"]`), Datadome (`iframe[src*="datadome"]`), PerimeterX (`iframe[src*="px-cdn"]` / `#px-captcha`) | `crawl.ts:283` |
| F005 | Add `timeout: 5 * 60 * 1000` to `spawnSync` and treat `result.signal === 'SIGTERM'` as failure | `guided-run.ts:114` |
| F006 | Route `extraUrls` through the same `normalizedUrls` map at `extract.ts:158` | `extract.ts:766` |

**Verification:** re-run the standing invariants after the change set; re-run a sample extract against a known-clean test fixture and confirm no behavioral regression.

### WS-2 · Metadata and runtime-agent prose drift (F007, F008)

| Finding | Action | File |
|---|---|---|
| F007 | Rewrite the `advisorRoutingContract.grandfatheredFolderMismatch` prose: "All five sk-design modes preserve their original flat names, so **none** require grandfathering (`grandfatheredFolderMismatch: false` everywhere)." | `mode-registry.json:17` |
| F008 | Add a `Transports and Consumers` note in `SKILL.md §7` documenting the runtime capability asymmetry (OpenCode `design.md` grants WebFetch, Claude `design.md` does not). | `SKILL.md:135` |

**Verification:** re-run `design-command-surface-check.mjs` (must remain `STATUS=PASS drift=0`); re-read both `design.md` files.

### WS-3 · Structural maintainability cleanup (F009, F010)

| Finding | Action | File |
|---|---|---|
| F009 | Extract `_clean_cell`, `_split_table_row`, `_is_separator_row` into `.opencode/skills/sk-design/shared/scripts/md_table_utils.py`; import from the 7 gate scripts | all 7 Python gate scripts |
| F010 | Renumber `extract.ts` and `crawl.ts` section headers to a single linear sequence, OR drop the numbered scheme in favor of plain `// HELPERS` markers | `extract.ts`, `crawl.ts` |

**Verification:** re-run all 7 gate scripts on their canonical inputs (must remain exit 0); run the design-md-generator test suite (`design-md-generator/backend/tests/*.test.ts`).

### WS-4 · Verdict-regex hardening (F001)

| Finding | Action | File |
|---|---|---|
| F001 | Tighten the `READY` regex at `proof_check.py:46` to require an anchor before `READY` (e.g., `(?:\[x\]\s*|verdict[:\s*]+|result[:\s*]+)\s*READY\b`); drop the bare `\*\*` alternative OR document it as intentionally lenient. | `proof_check.py:46` |

**Verification:** add a regression fixture containing inline bolded "READY" in body prose; gate must not flip `ready=true`.

---

## 5. Spec Seed

Concrete bullets for a follow-on hardening spec (advisory only; not blocking):

- **WS-1:** Add an "extraction posture" subsection to `design-md-generator/SKILL.md` documenting the default-safe behavior (no side-effect clicks, no consent suppression, no insecure TLS) and the `--allow-side-effects` opt-in flag.
- **WS-2:** Tighten `mode-registry.json` documentation contract: the `advisorRoutingContract` block must agree with the per-mode booleans; add a non-functional assertion to `design-command-surface-check.mjs` that fails when prose claims "grandfathered" but the boolean set is empty.
- **WS-3:** Add a "shared gate utilities" reference page under `shared/` documenting the canonical markdown-table parsing contract that all 7 gates must use.
- **WS-4:** Add a "verdict-regex safety" note to the proof-of-application contract: the regex must anchor to a verdict marker, not just bold formatting.

---

## 6. Plan Seed

Action-ready starter tasks for `/speckit:plan` (advisory, not blocking):

1. `WS-1-F002`: open `crawl.ts`, replace `triggerModals` body with a gated click that requires either `--allow-side-effects` from options or an `aria-haspopup` anchor; update `crawlPages` CrawlOptions; update `extract.ts` arg parsing; update `design-md-generator/SKILL.md` docs.
2. `WS-1-F003`: delete the `querySelectorAll('*')` loop in `dismissCookieBanners`; verify COOKIE_SELECTORS list still catches common banners; add a perf benchmark.
3. `WS-1-F004`: extend `isCaptchaPage` selector list per the 5 missing vendors; add fixture HTML samples for each.
4. `WS-1-F005`: add `timeout: 5 * 60 * 1000` to `spawnSync` at `guided-run.ts:114`; throw on `result.signal === 'SIGTERM'`.
5. `WS-1-F006`: route `extraUrls` through the same URL normalization map at `extract.ts:158`; add a fixture file with bare-domain entries and assert they get `https://` prefixed.
6. `WS-2-F007`: edit `mode-registry.json:17` prose; run `design-command-surface-check.mjs` to confirm invariant still passes.
7. `WS-2-F008`: edit `SKILL.md §7` to add the runtime-capability asymmetry note.
8. `WS-3-F009`: create `shared/scripts/md_table_utils.py`; refactor the 7 gate scripts to import from it; run all 7 on canonical inputs to confirm exit-code parity.
9. `WS-3-F010`: renumber or un-number `extract.ts` and `crawl.ts` section headers; no behavioral change.
10. `WS-4-F001`: tighten the READY regex; add a regression fixture with inline bolded READY.

---

## 7. Traceability Status

### Core Protocols

| Protocol | Gate | Status | Evidence |
|---|---|---|---|
| `spec_code` | hard | **pass** | 10/10 SKILL.md normative claims verified against shipped artifacts (5 modes, hub routes via mode-registry.json, single graph-metadata.json at hub, no per-packet graph-metadata.json, 4 doc-guidance + 1 playwright-extract backend split, toolSurface consistency). |
| `checklist_evidence` | hard | **n/a** | exempt: no spec-folder checklist for `skill:sk-design`. |

### Overlay Protocols

| Protocol | Gate | Status | Evidence |
|---|---|---|---|
| `skill_agent` | advisory | **pass** | 5/5 agreement checks between `SKILL.md` and `.opencode/agents/design.md` (hub-first load, 5-mode map, shared references, LEAF discipline, quality-gate citations). Drift recorded as F008 (runtime capability asymmetry). |
| `agent_cross_runtime` | advisory | **n/a** | exempt: target type is `skill`, not `agent`. |
| `feature_catalog_code` | advisory | **pass** | 7/7 `design-md-generator/feature_catalog/*.md` entries map to real backend scripts. |
| `playbook_capability` | advisory | **pass** | 11/11 `design-audit/manual_testing_playbook/AUDIT-*` scenarios backed by real references/scripts. |

### AC_COVERAGE

**exempt.** The review target is a skill, not a spec folder. The AC_COVERAGE signal only fires for Level 2+ spec folders with both `checklist.md` and in-progress-or-later `implementation-summary.md`.

---

## 8. Deferred Items

(No `## Resource Map Coverage Gate` section — `resource-map.md` was not present at init, so the coverage gate was skipped per the loop protocol.)

Advisory-only follow-ups that do not block the current verdict:

- **Secondary scope deferred:** the orchestrator's reviewScopeNote names the `deep-improvement` skill-benchmark gate code (`score-skill-benchmark.cjs`, `design-token-lint.cjs`, `design-dispatch-boundary-proof.cjs`, `parent-hub-vocab-sync.cjs`, and the `assets/skill_benchmark/fixtures/sk-design/` route-gold corpus) as a secondary audit surface. This lineage did not deep-audit those scripts because they are owned by the `deep-improvement` skill, not `sk-design`. A follow-up review packet should cover them. The orchestrator's standing invariant "skill-benchmark hubRoute 34/29/5/0" was not re-measured here.
- **Other 4 mode playbooks:** only the `audit` mode playbook was checked for `playbook_capability`. The interface/foundations/motion/md-generator playbooks exist on disk and their scenario files exist by spot-check, but a full scenario-by-scenario capability audit was not run. Recommend a follow-up iteration if a release-readiness gate requires it.
- **`design-md-generator` test suite:** `backend/tests/*.test.ts` exists (8 test files) but was not executed in this lineage. Run `npx vitest` from `backend/` to confirm before any release.
- **`design-md-generator/INSTALL_GUIDE.md`:** references `<track>/<packet>` path templates consistently; not audited for command-syntax drift.

---

## 9. Search Ledger

*No search-depth state captured (legacy v1 record).* The `reviewDepthSchemaVersion` was not v2 on any iteration, so `searchCoverage`, `candidateCoverage`, `searchDebt`, `ruledOutCandidates`, and `cleanSearchProof` are all empty by spec. The candidateCoverageGate and graphlessFallbackGate were skipped for the same reason. `hasSearchDebt: false`.

---

## 10. Audit Appendix

### Iteration Table

| # | Focus | Files | New Findings (P0/P1/P2) | Ratio | Status |
|---|---|---:|---|---:|---|
| 1 | correctness | 8 | 0/0/1 | 0.04 | complete |
| 2 | security | 5 | 0/0/5 | 0.18 | complete |
| 3 | traceability | 9 | 0/0/2 | 0.07 | complete |
| 4 | maintainability | 9 | 0/0/2 | 0.07 | complete |
| 5 | (convergence check) | — | — | — | STOP_ALLOWED |

### Convergence Signal Replay

| Signal | Weight | Vote | Value |
|---|---:|---|---|
| Rolling average (last 2 ratios) | 0.30 | STOP | avg(0.07, 0.07) = 0.07 ≤ 0.08 |
| MAD noise floor | 0.25 | CONTINUE | latest 0.07 > noiseFloor 0.022 |
| Dimension coverage | 0.45 | STOP | 4/4 = 1.0, age=1, required protocols covered |
| **Weighted composite** | — | **STOP** | **0.75 ≥ 0.60** |

### Legal-Stop Gate Replay

| Gate | Pass | Evidence |
|---|---|---|
| convergenceGate | ✓ | score 0.75 ≥ 0.60 |
| dimensionCoverageGate | ✓ | 4 dimensions + required protocols covered, coverage_age=1 |
| p0ResolutionGate | ✓ | activeP0 = 0 |
| evidenceDensityGate | ✓ | every active finding carries concrete `file:line` |
| hotspotSaturationGate | ✓ | no hotspots flagged |
| claimAdjudicationGate | ✓ | last `claim_adjudication` event `passed=true`, active P0/P1 = 0 |
| fixCompletenessReplayGate | ✓ | not a security-sensitive fix rerun |
| candidateCoverageGate | (skipped) | `reviewDepthSchemaVersion` is not 2 |
| graphlessFallbackGate | (skipped) | `reviewDepthSchemaVersion` is not 2 |
| graph_convergence | STOP_ALLOWED | dimensions_covered=4, coverage_age=1, no blockers |

### File Coverage Matrix

| File | D1 | D2 | D3 | D4 |
|---|:-:|:-:|:-:|:-:|
| `SKILL.md` | — | — | ✓ | — |
| `README.md` | — | — | ✓ | — |
| `command-metadata.json` | ✓ | — | ✓ | — |
| `mode-registry.json` | — | — | ✓ | — |
| `hub-router.json` | — | — | ✓ | — |
| `graph-metadata.json` | — | — | ✓ | — |
| `shared/scripts/design-command-surface-check.mjs` | ✓ | — | — | — |
| `shared/scripts/proof_check.py` | ✓ | — | — | ✓ |
| `shared/scripts/numeric_law_check.py` | ✓ | — | — | ✓ |
| `shared/scripts/variant_parameter_check.py` | ✓ | — | — | ✓ |
| `shared/scripts/ai-fingerprint-registry-check.mjs` | ✓ | — | — | — |
| `shared/scripts/ai-fingerprint-fixture-check.mjs` | ✓ | — | — | — |
| `design-foundations/scripts/naming_doc_check.py` | ✓ | — | — | ✓ |
| `design-foundations/scripts/baseline_rhythm_check.py` | — | — | — | ✓ |
| `design-audit/scripts/perf_evidence_check.py` | — | — | — | ✓ |
| `design-audit/scripts/polish_readiness_check.py` | — | — | — | ✓ |
| `design-md-generator/backend/scripts/cli.ts` | — | ✓ | — | — |
| `design-md-generator/backend/scripts/extract.ts` | — | ✓ | — | ✓ |
| `design-md-generator/backend/scripts/crawl.ts` | — | ✓ | — | ✓ |
| `design-md-generator/backend/scripts/guided-run.ts` | — | ✓ | — | — |
| `design-md-generator/backend/scripts/validate.ts` | — | ✓ | — | — |
| `design-md-generator/feature_catalog/feature_catalog.md` | — | — | ✓ | — |
| `design-audit/manual_testing_playbook/manual_testing_playbook.md` | — | — | ✓ | — |
| `.opencode/agents/design.md` | — | — | ✓ | — |
| `.claude/agents/design.md` | — | — | ✓ | — |

### Cross-Reference Appendix

**Core Protocols:**
- `spec_code` — 10/10 SKILL.md claims verified. See iteration-003.md for the per-claim evidence table.
- `checklist_evidence` — n/a (exempt).

**Overlay Protocols:**
- `skill_agent` — 5/5 agreement checks pass (iteration-003.md).
- `agent_cross_runtime` — n/a (exempt).
- `feature_catalog_code` — 7/7 design-md-generator entries map to real scripts (iteration-003.md).
- `playbook_capability` — 11/11 audit-mode scenarios backed (iteration-004.md).

### Sources Reviewed

Standing-invariant gates executed (all passed): `design-command-surface-check.mjs`, `naming_doc_check.py`, `numeric_law_check.py`, `variant_parameter_check.py`, `ai-fingerprint-registry-check.mjs`, `ai-fingerprint-fixture-check.mjs`. Plus direct file reads of: parent `SKILL.md`, `README.md`, `mode-registry.json`, `hub-router.json`, `command-metadata.json` (first 80 lines), all 5 mode `SKILL.md` headers (skimmed for routing fields), `design.md` runtime agents (OpenCode + Claude), `extract.ts`, `crawl.ts`, `guided-run.ts`, `cli.ts`, `validate.ts` (first 100 lines), `proof_check.py`, `numeric_law_check.py`, `variant_parameter_check.py`, `naming_doc_check.py`, `ai-fingerprint-registry-check.mjs`, audit playbook index.

### Ruled-Out Claims

- "naming_doc_check exits 0 on violating input" — disproven by re-measurement (exit 1 on the violating fixture). Recorded in iteration-001.md §"Ruled Out".
- "extra-urls are normalized" — disproven by code reading. Recorded as F006.
- "mode-registry.json is internally consistent" — disproven by prose-vs-boolean contradiction. Recorded as F007.
