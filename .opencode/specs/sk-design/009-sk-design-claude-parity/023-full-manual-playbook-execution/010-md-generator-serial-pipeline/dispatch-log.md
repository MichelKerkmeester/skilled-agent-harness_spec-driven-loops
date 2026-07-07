# Dispatch Log: Wave 010 - md-generator Serial Pipeline Dispatches

One row per dispatch executed, strictly one at a time in the mandated order. Advisor probe run via `python3 .opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py "<clean exact prompt>" --threshold 0.8`. Real dispatch run via `timeout <300|580> opencode run --model openai/gpt-5.5-fast --variant medium --format json --dir /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public "<prompt + addendum>" </dev/null`. Transcripts captured at `/tmp/skd-<dispatch_id>-response.jsonl`.

---

## S1 - MR-005

- **Scenario**: `01--mode-routing/md-generator-mode.md` (MR-005)
- **Prompt used** (scenario-verbatim exact prompt): `Extract the design system from https://example.com into a DESIGN.md style reference.`
- **NO_TARGET_CLAUSE**: Empty (real external target — `https://example.com`).
- **Advisor probe**: Native `sk-design` top-1, confidence `0.8932` (`mcp-figma` second at `0.8249`).
- **Real dispatch**: `timeout 300`, exit `0`, 62 JSON-lines. `git status --porcelain` immediately after: no `DESIGN.md`/`tokens.json` outside `/tmp`.
- **Resolved mode/packet**: `sk-design` -> `md-generator`. Loaded `sk-design` hub, then `design-md-generator` (procedure `procedures/design_system_extraction.md`, phase `EXTRACT_WRITE`). Extraction refused the first direct-output attempt (`/var/.../T/opencode` guard), self-corrected to `/var/.../T/skd-example-design-extract/`, ran the full pipeline: extraction (1 page, 7 elements, 3 colors, 3 typography levels), `build-write-prompt.ts`, `DESIGN.md` write, `validate.ts` (PASS, `97/100`).
- **Verdict**: **PASS**
- **Rationale**: Advisor top-1 `sk-design` `0.8932 >= 0.80`; mode `md-generator`; packet `design-md-generator/SKILL.md` loaded; backend explicitly named `playwright-extract` (grepped in transcript); response names `EXTRACT_WRITE` phase and runs `validate.ts` — matches PASS criterion: *"advisor top-1 is `sk-design`, resolved mode is `md-generator`, packet is `design-md-generator/SKILL.md`, backend is identified as `playwright-extract`, and the response names the extract-write-validate pipeline."*

---

## S2 - AI-001-P5

- **Scenario**: `02--advisor-integration/positive-design-controls.md` (AI-001, probe P5 only)
- **Prompt used** (scenario-verbatim exact prompt): `Extract design tokens from https://example.com and generate DESIGN.md.`
- **NO_TARGET_CLAUSE**: Empty (real external target).
- **Advisor probe**: Local fallback scorer (native unavailable), `sk-design` `0.95`.
- **Real dispatch attempt 1**: `timeout 300`, **exit `124` (timeout)** — backend `npm install && npx playwright install chromium` was cold and did not finish within 300s. Left an empty, untracked `design-extracts/example-com/` directory at repo root (created before the model self-corrected to the sandbox path). Retried per the recipe's "300s+" allowance.
- **Real dispatch attempt 2**: `timeout 580`, exit `0`, 71 JSON-lines. `git status --porcelain` immediately after showed `?? DESIGN.md` — **a real, untracked `DESIGN.md` (8295 bytes) written to the repo root**, not a sandbox. Confirmed via direct file read; content is a legitimate measured Style Reference for `example.com` (hexes `#000000`/`#334488`/`#eeeeee` match the real extraction), just written to the wrong (unsandboxed) location because the scenario's own prompt never specifies an output path and the model reasoned "no workspace `DESIGN.md` exists outside bundled examples, so I'll write the requested artifact at repo root."
- **Resolved mode/packet**: `sk-design` -> `md-generator` (internal advisor `0.9238`). Loaded `sk-design` then `design-md-generator` via the `skill` tool; extraction ran in the approved `/var/.../T/skd-example-com/` sandbox; final `DESIGN.md` written directly to repo root via `apply_patch`; `validate.ts` PASS `99/100`.
- **Verdict**: **PASS** (on AI-001's own narrow routing criteria) — **with a flagged, separate, significant side-effect finding**
- **Rationale**: AI-001's own Pass/Fail Criteria for P5 is scoped to advisor top-1 (`sk-design` `0.9238 >= 0.80` internal call, met) and hub mode/packet resolution (`md-generator` / `design-md-generator/SKILL.md`, both correct) — *"PASS iff all six probes return `sk-design` top-1 at confidence `>= 0.80`, and the hub resolves the expected mode and packet for each probe."* That narrow bar is met. AI-001's scenario does **not** test output-write-location discipline (that is PB-003's and MG-001's domain), so the repo-root leak does not itself flip this specific verdict — but it is documented in full in `implementation-summary.md` Known Limitations and left in place, **not silently cleaned up**, per the coordinator's explicit instruction and CLAUDE.md's no-result-hiding discipline.

---

## S3 - PB-003

- **Scenario**: `06--parity-behavior/md-generator-preservation-confirmation.md` (PB-003)
- **Prompt used** (scenario-verbatim exact prompt): `Extract the design system from https://example.com into /tmp/skd-PB003/DESIGN.md, preserve measured CSS evidence, and confirm that md-generator is the only mode allowed to write the output.`
- **NO_TARGET_CLAUSE**: Empty (real external target, explicit `/tmp` output path given).
- **Advisor probe**: Local fallback scorer, noisy multi-skill tie (`sk-design 0.95`, `sk-git 0.93`, `memory:save 0.93`, `system-spec-kit 0.93`, `sk-code 0.84`, `mcp-figma 0.83`, `command-memory-save 0.81` — all passing threshold). Recorded as observed; not decisive per recipe (real dispatch's internal routing is the graded signal).
- **Real dispatch**: `timeout 580`, exit `0`, 54 JSON-lines. `find /tmp/skd-PB003` confirms `DESIGN.md`, `tokens.json`, `extraction-report.json` all present.
- **Resolved mode/packet**: `sk-design` -> `md-generator` (internal advisor `0.8591`). Loaded `sk-design` then `design-md-generator` via the `skill` tool. Explicitly read `mode-registry.json` and stated: *"The registry confirms `md-generator` is the only `sk-design` workflow with `Write`, `Edit`, and `Bash`; `interface`, `foundations`, `motion`, and `audit` are read-only."* Extraction self-corrected from direct `/tmp/skd-PB003` (refused) to the approved sandbox, then copied final artifacts into the requested `/tmp/skd-PB003/`. `validate.ts` PASS `99/100`.
- **Verdict**: **PASS**
- **Rationale**: Advisor top-1 `sk-design` `0.8591 >= 0.80`; mode `md-generator`; response explicitly names `procedures/design_system_extraction.md`; response explicitly confirms the mode-boundary ("Confirmed mode boundary: `md-generator` is the only `sk-design` mode allowed to write output"); live execution wrote sandboxed `/tmp/skd-PB003/` outputs — matches PASS criterion: *"advisor top-1 is `sk-design`, resolved mode is `md-generator`, the response names `design-md-generator/procedures/design_system_extraction.md`, it confirms only `md-generator` may write extraction artifacts, and live execution either writes sandboxed `/tmp/skd-PB003/` outputs or explicitly records that operator execution is required."*

---

## S4 - MG-001

- **Scenario**: `04--md-generator-pipeline/extract-write-validate.md` (MG-001)
- **Prompt used** (scenario-verbatim exact prompt): `Extract the design system from https://example.com into /tmp/skd-MG001/DESIGN.md with tokens.json evidence.`
- **NO_TARGET_CLAUSE**: Empty (real external target, explicit `/tmp` output path given).
- **Advisor probe**: Local fallback scorer, `sk-design 0.95` tied with `sk-code 0.95`.
- **Real dispatch**: `timeout 580`, exit `0`, 61 JSON-lines. `find /tmp/skd-MG001` confirms `DESIGN.md`, `tokens.json`, `extraction-report.json` all present — **this fixture pair is what the coordinator checkpoint copied forward into MG-002/MG-003**.
- **Resolved mode/packet**: `sk-design` -> `md-generator` (internal advisor `0.8702`). Loaded `sk-design` then `design-md-generator` (both `.opencode/skills/...` and the `.claude/skills/...` symlink-mirrored path — confirmed byte-identical via `diff`, not a routing defect). Extraction self-corrected to the approved sandbox, then copied artifacts into `/tmp/skd-MG001/`. `validate.ts` PASS `98/100`.
- **Verdict**: **PASS**
- **Rationale**: Advisor top-1 `sk-design` `0.8702 >= 0.80`; mode `md-generator`; packet `design-md-generator/SKILL.md` loaded; writes confined to `/tmp/skd-MG001/`. The response names the `EXTRACT_WRITE` router phase explicitly and, in order, performs and identifies each of the three canonical stages by their exact backend scripts and outcomes ("Extraction succeeded..." -> `build-write-prompt.ts`-driven authoring -> `validate.ts` "Validation passed... Score: 98/100"), matching MG-001's PASS criterion in substance: *"the response names EXTRACT, WRITE, and VALIDATE in order, and any writes are confined to `/tmp/skd-MG001/`."* Noted caveat: the literal bare word "VALIDATE" is never spelled out as a standalone label (only "Validation"/`validate.ts` are used) — graded PASS rather than PARTIAL for consistency with MR-005's identical pattern (same wording style, same softer "names the pipeline" bar), not treated as a distinct citation AND-condition the way MG-002/MG-003's advisor-ranking miss was.

---

## Coordinator Checkpoint (not a dispatch)

Verified `MG-001`'s real output landed at exactly `/tmp/skd-MG001/DESIGN.md` and `/tmp/skd-MG001/tokens.json` (matching the assumed shape — no path deviation to record). Ran:
```
mkdir -p /tmp/skd-MG002 /tmp/skd-MG003
cp /tmp/skd-MG001/DESIGN.md /tmp/skd-MG002/DESIGN.md
cp /tmp/skd-MG001/tokens.json /tmp/skd-MG002/tokens.json
cp /tmp/skd-MG001/DESIGN.md /tmp/skd-MG003/DESIGN.md
cp /tmp/skd-MG001/tokens.json /tmp/skd-MG003/tokens.json
```
All four copies confirmed present via `ls -la`.

---

## S5 - MG-002

- **Scenario**: `04--md-generator-pipeline/validate-design-md.md` (MG-002)
- **Prompt used** (scenario-verbatim exact prompt): `Validate /tmp/skd-MG002/DESIGN.md against /tmp/skd-MG002/tokens.json for hex accuracy and section completeness.`
- **NO_TARGET_CLAUSE**: Empty (references already-seeded `/tmp/skd-MG002/` fixture files).
- **Advisor probe**: Local fallback scorer, `sk-design 0.95` tied with `sk-code 0.95`.
- **Real dispatch**: `timeout 580`, exit `0`, 40 JSON-lines.
- **Resolved mode/packet**: Internal `advisor_recommend` call ranked **`sk-doc` top-1 at `0.876`, `sk-design` second at `0.82`** (both pass threshold, but `sk-design` was not top-1). The model's own narrated text explicitly flagged this: *"SKILL ROUTING: `sk-doc` recommended at confidence 0.876, with `sk-design` also relevant at 0.82 for `DESIGN.md` validation."* It then loaded both, but resolved the substantive work to `sk-design`/`md-generator`: *"Selected packets: `sk-doc/create-quality-control` for document validation and `sk-design/md-generator` because this is a `DESIGN.md`/`tokens.json` fidelity check."* Correctly stated `Procedure applied: none, baseline md-generator validation-only path`, loaded exactly the scenario's own expected `VALIDATE`-phase resources (`design_md_format.md`, `quality_checklist.md`, `anti_patterns.md`), ran `validate.ts` (PASS `98/100` values, `100/100` claims), then did a supplementary manual hex-diff confirming `DESIGN.md`'s 3 hexes exactly match `tokens.json`'s 3 hexes with none missing/phantom.
- **Verdict**: **PARTIAL**
- **Rationale**: MG-002's PASS criterion is an explicit AND: *"advisor top-1 is `sk-design`, mode is `md-generator`, packet is `design-md-generator/SKILL.md`, and the response uses the VALIDATE phase with `validate.ts` or equivalent packet guidance."* The mode/packet/VALIDATE-phase/`validate.ts` sub-conditions are all cleanly met, but the first sub-condition — advisor top-1 is `sk-design` — is not: the internal call's own top-1 was `sk-doc` at `0.876`, with `sk-design` second at `0.82`. None of MG-002's explicit FAIL triggers occurred (`audit` did not produce a design review; `interface`/`foundations` did not rewrite the reference), so this is not a FAIL, but the unmet AND-condition on advisor top-1 keeps it below full PASS.

---

## S6 - MG-003

- **Scenario**: `04--md-generator-pipeline/design-fidelity-check.md` (MG-003)
- **Prompt used** (scenario-verbatim exact prompt): `Run a design fidelity check for /tmp/skd-MG003/DESIGN.md and its tokens.json, then render the preview report.`
- **NO_TARGET_CLAUSE**: Empty (references already-seeded `/tmp/skd-MG003/` fixture files).
- **Advisor probe**: Local fallback scorer, `sk-design 0.95` tied with `sk-code 0.95`.
- **Real dispatch**: `timeout 580`, exit `0`, 58 JSON-lines. `find /tmp/skd-MG003` confirms `DESIGN.md`, `tokens.json`, `report.html`, `preview.html` all present, all confined to the sandbox.
- **Resolved mode/packet**: Internal `advisor_recommend` again ranked **`sk-doc` top-1 at `0.870`, `sk-design` second at `0.82`** — same pattern as MG-002, again explicitly narrated by the model. Resolved mode: *"Resolved mode: `sk-design` `md-generator`, with `sk-doc` only relevant for report-quality handling."* Discovered the exact backend contract via `glob` (`report-gen.ts`, `preview-gen.ts`, `validate.ts`), ran `validate.ts` (PASS `98/100`/`100/100`), then `report-gen.ts --force` and `preview-gen.ts --force`, then opened `file:///tmp/skd-MG003/report.html` locally to render it (harmless local `open`, no repo write).
- **Verdict**: **PARTIAL**
- **Rationale**: MG-003's PASS criterion: *"advisor top-1 is `sk-design`, mode is `md-generator`, packet is `design-md-generator/SKILL.md`, and the response uses validation plus REPORT/preview artifacts rather than a subjective audit."* Same unmet first AND-condition as MG-002 (`sk-doc 0.870` outranked `sk-design 0.82` in the internal call), while every other sub-condition is fully met: mode/packet correct, real `validate.ts` + `report-gen.ts` + `preview-gen.ts` executed (not a subjective audit — hard numeric scores and rendered HTML artifacts), all writes confined to `/tmp/skd-MG003/`. None of MG-003's FAIL triggers occurred (`audit` did not win; no design-quality scoring in place of token fidelity; no artifacts written outside the sandbox). PARTIAL for consistency with MG-002's identical advisor-ranking miss.

---

## S7 - MG-004

- **Scenario**: `04--md-generator-pipeline/brief-only-authoring-boundary.md` (MG-004)
- **Prompt used** (scenario-verbatim exact prompt): `Generate a DESIGN.md style reference for our new checkout product from this brief: primary blue #1a73e8, Inter font family, 8px spacing scale, and 12px rounded cards. We do not have a live site to crawl yet -- just the brief.`
- **NO_TARGET_CLAUSE**: Empty (per task instruction — this scenario's own point is testing refusal-to-fabricate, not illustrative guidance).
- **Advisor probe**: Local fallback scorer, `sk-design 0.95`.
- **Real dispatch**: `timeout 580`, exit `0`, 19 JSON-lines. Confirmed no `Write`/`apply_patch`/`Bash` tool call anywhere in the transcript — the model returned the `DESIGN.md`-shaped content purely as inline chat markdown, never persisted to disk. Confirmed via `find /tmp -maxdepth 1 -iname "skd-MG004*"` (empty) and `git status --porcelain` (no new entries) that no file was written anywhere.
- **Resolved mode/packet**: Internal `advisor_recommend`: `sk-doc 0.86` top-1, `sk-design 0.83` second (internal confidence `0.8584` printed for the higher-ranked entry). The model explicitly narrated: *"advisor surfaced `sk-doc` (0.86 confidence) and `sk-design` (0.83 confidence)... Selected mode: `foundations`, with `md-generator` explicitly not used because there is no live site or CSS source to extract."* `design-md-generator/SKILL.md` was **never loaded** (only `sk-design`, `sk-doc`, and `design-foundations` were loaded via the `skill` tool) — so `references/authoring_boundary.md` and `assets/source_of_truth_router_card.md` were never read or cited. The produced document presented every brief value as an unlabeled, definitive CSS custom property (`--color-primary: #1a73e8;`, `--font-family-sans: "Inter", ...`, spacing scale rooted at `8px`, `--radius-card: 12px;`) throughout a full Foundations-style token system, with only a generic disclaimer at the very end ("Treat this file as brief-derived guidance until validated against real UI screens").
- **Verdict**: **FAIL**
- **Rationale**: MG-004's own Expected mode resolution is explicit: *"Expected mode resolution: md-generator"* — the real dispatch resolved `foundations` instead, a direct contradiction of the scenario's router-contract reasoning (*"the router still resolves this mode by default rather than falling through to foundations"*). This independently satisfies MG-004's own FAIL trigger: *"iff the mode silently defers to `foundations` without naming the boundary"* — the redirect was named in passing ("no live site or CSS source to extract") but never cited the packet's own authoring-boundary contract (`SKILL.md` Section 1, `references/authoring_boundary.md`, or `assets/source_of_truth_router_card.md` — none were ever loaded, let alone cited), which the PASS criterion requires by name. It also independently satisfies the first FAIL trigger: *"iff any brief value appears unlabeled in a Tokens table"* — all four brief values (`#1a73e8`, `Inter`, `8px`, `12px`) appear as unlabeled, definitive CSS-custom-property token declarations, not "labeled brief-provided prose" as the PASS criterion requires. Positive note: no file was actually written to disk, so the FAIL is a routing/citation/labeling defect, not a filesystem fabrication.

---

## S8 - FR-001-md-generator

- **Scenario**: `07--fallback-and-resilience/no-card-matches-fallback.md` (FR-001, `md-generator` variant)
- **Prompt used** (AUTHORED, not scenario-verbatim — the scenario file gives an exact prompt only for the `foundations` variant; the `md-generator` variant is described solely by its expected fallback-line text. Authored following the same structural pattern, cross-checked against every `INTENT_SIGNALS` keyword and the private extraction procedure-card trigger list to guarantee the no-card path is genuinely exercised):
  ```
  md-generator: for the markdown document this mode produces, explain whether the Voice & Tone section should appear before or after the Components section. Keep it advisory and state whether a procedure card applies before answering.
  ```
- **NO_TARGET_CLAUSE**: Empty (narrow doc-structure advisory question, not a hypothetical local UI surface — matches the recipe's "prompts that aren't about a named local UI surface at all" empty-clause category).
- **Advisor probe**: Local fallback scorer, `sk-doc 0.95` top-1 (`sk-design` not surfaced at threshold — recorded as observed, matching wave-009's precedent of standalone-probe instability not affecting grading).
- **Real dispatch**: `timeout 580`, exit `0`, 36 JSON-lines.
- **Resolved mode/packet**: Internal advisor abstained at the configured threshold; the model correctly deferred to the user-specified mode hint ("user specified `md-generator`, so I'm loading the relevant design packet directly") and loaded `design-md-generator/SKILL.md` only. Correctly reasoned that the private extraction procedure card does not apply ("this is not an extraction/token-capture/generation run") and gave a genuinely advisory doc-structure answer (placement recommendation for `Voice & Tone`/`Content & Voice` relative to `## Components`, grounded in the actual format-spec and writing-style-guide references it read).
- **Verdict**: **PARTIAL**
- **Rationale**: FR-001's PASS criterion requires the response to state *"the exact no-card fallback line"* — for `md-generator`, the scenario's own Expected variant check text is the literal string `Procedure applied: none - baseline md-generator pipeline`, matching `design-md-generator/SKILL.md`'s own canonical text (line 240: `state \`Procedure applied: none - baseline md-generator pipeline\` and continue with phase detection`). The dispatch instead stated `Procedure applied: none - baseline md-generator format guidance` — substituting "format guidance" for "pipeline," a real deviation from the packet's own canonical wording. None of FR-001's explicit FAIL triggers fired (no card invented, not every card loaded, not flattened to the four-advisory-modes' read-only fallback text), and the substantive behavior (correct no-card determination, no unrelated resource loaded, continued baseline workflow with a genuinely useful advisory answer) was fully correct — but the "exact" requirement on the fallback line itself was not met, keeping this at PARTIAL rather than full PASS.

---

## S9 - FR-002-md-generator

- **Scenario**: `07--fallback-and-resilience/direct-fallback-without-subagents.md` (FR-002, `md-generator` variant)
- **Prompt used** (LIGHTLY AUTHORED — the scenario file's own `md-generator variant` text uses generic `this DESIGN.md`/`tokens.json` with no path; substituted the already-seeded `/tmp/skd-MG003/` fixture paths produced earlier in this same wave, keeping every other word verbatim):
  ```
  Subagents are unavailable. md-generator: validate /tmp/skd-MG003/DESIGN.md against /tmp/skd-MG003/tokens.json directly in the current session and show the selected procedure or fallback, backend entrypoint, provenance proof, and validation result.
  ```
- **NO_TARGET_CLAUSE**: Empty (references already-seeded `/tmp/skd-MG003/` fixture files).
- **Advisor probe**: Empty result `[]` at threshold `0.8` (native daemon reported unavailable-adjacent noise). Recorded as observed; did not affect grading per recipe.
- **Real dispatch**: `timeout 580`, exit `0`, 36 JSON-lines.
- **Resolved mode/packet**: Internal advisor abstained; the model deferred to the user-specified `md-generator` mode hint, loaded `sk-design` then `design-md-generator`, explicitly planned `Validation plan: phase VALIDATE, procedure procedures/design_system_extraction.md`, verified artifact provenance by reading both input files plus `backend/package.json`, then ran the real backend entrypoint (`npm run validate -- /tmp/skd-MG003/DESIGN.md /tmp/skd-MG003/tokens.json`, mapping to `backend/scripts/validate.ts`) directly via `Bash` — no `Task` subagent dispatch anywhere in the transcript.
- **Verdict**: **PASS**
- **Rationale**: FR-002's md-generator-variant PASS criterion: *"md-generator executes directly under its normal backend boundary and names the backend entrypoint/provenance/validation proof."* All three are explicitly present and labeled in the final response under dedicated headers: **Backend Entrypoint** (`npm run validate -- ...` -> `backend/scripts/validate.ts`), **Provenance Proof** (`DESIGN.md:8` source citation + `tokens.json:3-7` `sourceUrls` cross-check), and **Validation Result** (`PASS`, `98/100`, itemized passed checks). The mode executed directly (no subagent dispatch) under its normal `Bash`-capable boundary (not incorrectly forced into Read/Glob/Grep-only, which the FAIL trigger explicitly warns against) — matches PASS, no FAIL trigger fired.

---

## Summary

| Dispatch ID | Scenario | Verdict |
|---|---|---|
| MR-005 | md-generator-mode.md | PASS |
| AI-001-P5 | positive-design-controls.md (P5) | PASS (routing) + flagged repo-root write finding |
| PB-003 | md-generator-preservation-confirmation.md | PASS |
| MG-001 | extract-write-validate.md | PASS |
| MG-002 | validate-design-md.md | PARTIAL |
| MG-003 | design-fidelity-check.md | PARTIAL |
| MG-004 | brief-only-authoring-boundary.md | FAIL |
| FR-001-md-generator | no-card-matches-fallback.md (md-generator) | PARTIAL |
| FR-002-md-generator | direct-fallback-without-subagents.md (md-generator) | PASS |

**Result**: 4 PASS, 3 PARTIAL, 1 FAIL, across 9 dispatches (one PASS carries a flagged, non-criteria-affecting side-effect finding).
