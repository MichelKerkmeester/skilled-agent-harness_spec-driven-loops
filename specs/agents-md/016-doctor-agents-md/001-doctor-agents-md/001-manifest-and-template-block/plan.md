---
title: "Implementation Plan: manifest and template block"
description: "Author one manifest of the shipped surface, generate its derived key from the root file, share one segmenter, and make a template edit run the freshness test."
trigger_phrases:
  - "agents md manifest plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: manifest and template block

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CommonJS scripts, JSON data, GitHub Actions YAML |
| **Framework** | None; the scripts run under `node` with no dependency beyond the standard library and `yaml` where a neighbouring script already uses it |
| **Storage** | `.skilled/commands/doctor/assets/agents-md-manifest.json` |
| **Testing** | `node:test`, picked up by `scripts/tests/run-all.sh` |

### Overview
Write the failing suite first, then the segmenter, then the generator that writes and checks the manifest. Edit the root file once for the line 3 wording and once for the trailing block, and confirm the canary's two numbers stay put. Add the two path filters last, because nothing exercises them until CI runs.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] `/doctor:sk-skill` is on `main` and the six baseline commands are recorded in `scratch/baseline.txt`
- [ ] The section table and the pin list are read from the parent phase spec, not recalled
- [ ] The rule-copy canary's `AGENTS.md` string list is read so the pin set can cover it

### Definition of Done
- [ ] `node .skilled/commands/doctor/scripts/agents-md-manifest.cjs --check` exits 0 with a `PASS` line
- [ ] `node --test .skilled/commands/doctor/scripts/tests/agents-md-manifest.test.cjs` reports `fail 0`
- [ ] `node .skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.js` exits 0 and the last anchor ends at or before byte 16374
- [ ] `wc -c < AGENTS.md` prints a number at or below 27899
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
One data file plus two thin scripts and one shared library.

### Key Components
- **`assets/agents-md-manifest.json`**: authored keys (sections, pins, runtime copies, budget, markers, source URL) and the generated `derived` key.
- **`scripts/lib/agents-md-sections.cjs`**: the segmenter, the sha256 helper and the classifier both engines import, so a section means one thing everywhere.
- **`scripts/agents-md-manifest.cjs`**: `--write` regenerates `derived`, `--check` compares it, and both refuse to run outside the source repository.

### Data Flow
The segmenter reads the root `AGENTS.md`, emits sections keyed by their authored match prefix, and the generator writes each body with its hash into `derived`. `--check` re-segments the same file and compares hashes, so any drift between the root file and the manifest is a non-zero exit.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Segmenter start bytes, generator refusals, derived-key comparison | `node:test` |
| Contract | Every pin's consumer, every canary string in the pin set | `node:test` |
| Manual | The canary and `wc -c` numbers after both root-file edits | `check-rule-copies.js`, `wc` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `/doctor:sk-skill` on `main` | Internal | Yellow | Child cannot start; its route and bridge counts change the baselines |
| Release tags on the branch | Internal | Yellow | The history key stays at one body per section |
| Rule-copy canary string list | Internal | Green | Pins cannot be checked against their consumers |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The canary reports a delivery-prefix byte above 16384, or the root file exceeds 27,899 bytes.
- **Procedure**: Revert the single commit that carries the root-file edits and the manifest together; the manifest is generated, so no data is hand-recoverable loss.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Nothing; it reads the canary and the segmenter inputs | Implementation |
| Implementation | Setup's recorded baseline | Verification |
| Verification | The manifest, both root-file edits and the CI filters | Child 002, which needs a manifest to read |
<!-- /ANCHOR:phase-deps -->

---
