# Non-Hub Single-Skill Router — Compiled-Routing Ineligibility Policy

> **Policy (REQ-005 / CF-ACT-9).** The seven-hub compiled-routing activation path is
> ineligible **by design** for the non-hub single-skill routers. ADR-002's "scales to
> any skill with no code edit" claim describes the parent-hub archetype only; this
> document states, in writing, what happens to the routers that do **not** share that
> archetype, so no future reader assumes they are simply un-onboarded hubs awaiting a
> flip.

## Eligibility rule

A skill id is eligible for the compiled-routing activation path only when **both** hold:

1. It is a key in the compiled-route engine map `HUB_CHILD`
   (`011-runtime-engine/lib/compiled-route.cjs`), **and**
2. Its rollout child carries `activation/acceptance.json` — the accepted compiled
   generation (`priorManifestHash`, `candidatePolicy`, `expectedFencingEpoch`, source
   hashes) that the fenced compare-and-swap in `activate-hub.cjs` binds against.

The parent hubs satisfy both: all seven live under `006-parent-hub-rollout/00N-<hub>`
with a canary harness and an `acceptance.json`. The non-hub routers satisfy neither.

## The archetype difference

The non-hub routers were rolled out under `009-non-hub-rollout/` using a **different
archetype**: a fenced-manifest / run-drill shadow (`fenced-manifest.cjs` or
`run-drill.cjs`) with **no `acceptance.json`** and **no canary harness**. Their
manifests stay `servingAuthority: "legacy"`, `shadowOnly: true` — they are shadow-only
and never bound as a SELECTED compiled generation. There is nothing for
`activate-hub.cjs` to seed from (no `acceptance.json`) and nothing for
`flip-serving.cjs` to flip (they are absent from `HUB_CHILD`, so it refuses them at its
usage gate).

## The five named candidates

| Candidate | Directory status | Why ineligible |
|-----------|------------------|----------------|
| `sk-git` | Real, built child: `009-non-hub-rollout/001-sk-git/` (fenced-manifest archetype, no `acceptance.json`) | Absent from `HUB_CHILD`; no `acceptance.json`; manifest legacy/shadow-only. |
| `system-code-graph` | Real, built child: `009-non-hub-rollout/002-system-code-graph/` (run-drill archetype, no `acceptance.json`) | Absent from `HUB_CHILD`; no `acceptance.json`; manifest legacy/shadow-only. |
| `system-skill-advisor` | Real, built child: `009-non-hub-rollout/003-system-skill-advisor/` (fenced-manifest archetype, no `acceptance.json`) | Absent from `HUB_CHILD`; no `acceptance.json`; manifest legacy/shadow-only. |
| `system-spec-kit` | Real, built child: `009-non-hub-rollout/004-system-spec-kit/` (fenced-manifest archetype, no `acceptance.json`) | Absent from `HUB_CHILD`; no `acceptance.json`; manifest legacy/shadow-only. |
| `mcp-code-mode` | **Un-onboarded candidate.** No rollout child, no activation manifest, no `009-non-hub-rollout/005-mcp-code-mode/`. It appears only as an upstream compiler-shadow output (`001-compiler-n1-shadow/compiled/mcp-code-mode/`) and calibration fixtures (`005-calibration/…/mcp-code-mode.no-slice.json`), never as a rollout/activation target. | Absent from `HUB_CHILD`; has no rollout child or acceptance record at all. |

### `mcp-code-mode` is NOT to be given a `005-` folder

`mcp-code-mode` is the four-vs-five distinction CF-ACT-9 warns about: four of the five
candidates are real, built `009-non-hub-rollout/` children; `mcp-code-mode` is a fifth
candidate that has **not** been onboarded to the non-hub rollout at all. It **must not**
be invented as a `009-non-hub-rollout/005-mcp-code-mode/` folder to "match" the other
four. Its upstream compiler-shadow / calibration presence is not a rollout child and
does not make it eligible. Onboarding it (if ever desired) is a separate, deliberate
decision, not a gap to be back-filled here.

## Negative fixtures

`verification/non-hub-eligibility-fixtures.cjs` proves the policy mechanically:

- For each of the five candidates: ineligible under `isCompiledRoutingEligible`, absent
  from `HUB_CHILD`, and refused by `flip-serving.cjs` at its usage gate.
- For the four real children: no `acceptance.json`, and manifest stays
  `legacy` / `shadowOnly: true`.
- For `mcp-code-mode`: no `009` rollout child and no `005-mcp-code-mode` folder anywhere
  in the implementation tree.
- **Control:** the seven real hubs stay eligible (in `HUB_CHILD` + `acceptance.json`),
  so the check is not trivially always-false.

Result at authoring time: **32 passed, 0 failed.**

## Cross-references (informational — this child edits none of these)

- `013-create-skill-alignment/checklist.md` CHK-023 — the sibling item this policy
  informs. This document is the written statement CHK-023 can point to; this child does
  **not** edit `013`'s files.
- `spec.md` REQ-005 / SC-005 and this packet's `checklist.md` CHK-032.

## Durable home (build-time note)

`spec.md` §7 proposed `system-skill-advisor/references/` as the eventual durable home
for this policy. It is authored here, inside the `010-rollback-audit-and-non-hub-policy`
packet, to keep this child's scope to authoring the content (not touching the advisor
skill tree). Relocating it verbatim into `system-skill-advisor/references/` is a
follow-up an operator may take; the content is home-agnostic.
