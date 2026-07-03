## GAPS

### G1. RSB-001 fixture strict-validation nondeterminism has no phase

**Evidence**: 033 scorecard §3, 031-claim adjudication table: *"high is nondeterministic at the strict-validation / Gate-3 boundary (RSB-001 fail-close vs RSB-007 dispatch)"*. §4 ranked backlog item 5: *"[P2] Fixture strict-validation nondeterminism… RSB-001 fail-close vs dispatch on full-run cells."* No 035 phase names RSB-001 as an acceptance cell (phase map rows 001–010 name RVB/RSB/CXB/ACB/IMB cells but never RSB-001). No 034 finding addresses fixture strict-validation validity — F-014 (content-hash) and F-025 (path-token leak), both in phase 001, are different confounds.

**Gap**: RSB-001 is a measured GPT-high behavioral failure — nondeterministic fail-close on deep-research pre-init strict validation — that the benchmark explicitly ranked as a remediation item and no phase claims to fix or even classify. The 41/44 actionable count silently excludes it because 034 never raised a finding for it.

**Severity**: major

**Recommended amendment**: Add a requirement to phase 001 to either make the toy research fixture strict-valid or explicitly classify the fail-close as an intended probe, then name RSB-001 as an acceptance cell for that phase (stable verdict after the fixture/fixture-policy decision).

---

### G2. Interim prompt-pack absorption guard (synthesis §2 quick-win) is silently dropped

**Evidence**: Synthesis §2 P1 table includes a dedicated row: *"Prompt-pack absorption guard — first-line abort ('producing findings without a dispatch receipt is role absorption') while receipts are built — F-010 — iteration 015 quick-win (interim) — Cheap partial mitigation of the absorption class — Same three cells (weaker than receipts) — S."* Phase 004 closes F-010 via the structural receipt fix (F-041) only; no other phase mentions an interim abort rule.

**Gap**: The synthesis designed a deliberate two-stage mitigation for the absorption class: an interim first-line-abort prompt-pack rule (S, lands immediately after P0) followed by the structural HMAC receipts (M, lands in phase 004). 035 collapses this to one stage. Between phase 002 (Gate-3) and phase 004 (receipts), the three absorption cells (RVB-007, RSB-005, RSB-007) have zero mitigation, despite the synthesis explicitly designing a cheap interim for exactly that window.

**Severity**: major

**Recommended amendment**: Add the first-line-abort rule as a fast-landing sub-requirement in phase 003 (which already touches the same prompt-pack templates) or phase 004, explicitly scoped as interim until receipts ship. Alternatively, insert a lightweight phase between 002 and 004.

---

### G3. ACB-004 multi-cause cell: acceptance criteria don't disambiguate by effort level

**Evidence**: 033 scorecard §2 finding (2): *"in the structured modes (context, council), high is not stall-free — it silently stalls on demanding cells (CXB-004, ACB-004, ACB-005)."* Synthesis §5.2: *"ACB-004 fails via Gate-3 (med) AND stall (high) — the benchmark rerun after each package must record primary/secondary cause so packages don't double-claim the same flip."* Phase 002 claims ACB-004 (Gate-3 halt, med); phase 005 ALSO claims ACB-004 (stall / progress records, high). Neither phase's acceptance row specifies which effort-level verdict it owns.

**Gap**: Two phases claim the same cell, but the cell fails differently per effort — Gate-3 halt at med, stall at high. REQ-003 says "each phase re-runs its cells (gpt-fast-med + gpt-fast-high)" but provides no attribution mechanism. After phase 002 lands, ACB-004-med may flip (halt → execute) while ACB-004-high continues to stall; phase 005 then needs to flip the high leg. Without effort-scoped criteria, both phases could claim the full-cell flip or neither could prove its share. The synthesis flagged this exact risk; 035 implements no mitigation for it.

**Severity**: major

**Recommended amendment**: Amend phase 002's ACB-004 acceptance to *"med-effort halt → autonomous execution; high-effort stall deferred to phase 005."* Amend phase 005's ACB-004 acceptance to *"high-effort stall → liveness/complete."* Add a primary/secondary-cause attribution field to REQ-003's rerun protocol, as the synthesis §5.2 already specified.

---

### G4. "Mandate high reasoning effort for dispatch modes" (033 §4 item 2) is documented as a reference, not enforced

**Evidence**: 033 scorecard §4 ranked backlog item 2: *"[P1] Mandate high reasoning effort for GPT deep-loop execution — scoped. High fixes dishonest completion (absorption) in the dispatch modes; state explicitly that it does NOT fix Gate-3 halts or structured-mode stalls."* F-039 (closed by phase 007) includes *"high effort mandated for dispatch modes"* as rule 7 of the 7-rule authoring profile. Phase 007 description: *"codify the 7-rule GPT-safe authoring profile as a reference."*

**Gap**: The benchmark measured high effort as load-bearing for absorption elimination in review/research (033 §1: med "silent stalls + inline absorption" → high "absorption eliminated"; §2 finding (2)). The synthesis folds the mandate into the authoring profile. Phase 007 codifies that profile "as a reference" — documentation, not enforcement. No phase adds an enforceable configuration point (prompt-pack `reasoning_effort`, auto-YAML effort binding, or CLI-dispatch default) that actually mandates high for dispatch modes. The cheapest measured remediation in the entire backlog remains advisory.

**Severity**: major

**Recommended amendment**: Add a requirement to phase 004 (which routes CLI executor launches through the audited wrapper) or phase 007 to set `reasoning_effort: high` as the dispatch-mode default in the prompt-pack templates and/or the audited CLI wrapper, with a documented fallback for environments where high is unavailable.

---

### G5. ACB-005 confirm-halt dimension is unaddressed; baseline-already-failing contradicts REQ-003

**Evidence**: 033 scorecard §1 per-mode table, deep-ai-council claude-cli baseline column: *"2 pass, 2 partial/inline, 1 confirm-halt."* Phase 005 claims ACB-005 as a stall cell (closes F-015/F-016/F-017/F-018/F-031/F-043 — all stall/liveness findings). F-008 (non-actionable, REQ-004) identifies that the confirm YAML loads after presentation resolution. Synthesis §6 verification map lists ACB-005 under "Progress records" with today's verdict *"stall class at both efforts."*

**Gap**: Phase 005 applies progress records (liveness JSONL) to ACB-005, treating it as a pure stall. But the scorecard records a confirm-halt dimension on the council baseline — a gate that stops for confirmation (the `deep_*_confirm.yaml` flow), which is a distinct failure mode from a silent stall. Progress records fix silent dark windows, not confirm-gate halts. No phase addresses the confirm-gate dimension (F-008 scoped it as a constraint and no fix followed). Additionally, REQ-003 requires keeping "the Claude-native baseline leg green," but ACB-005's baseline is already a confirm-halt (not green) — the acceptance frame contradicts the measured state.

**Severity**: major

**Recommended amendment**: Either (a) scope phase 005's ACB-005 acceptance to the GPT stall leg only and explicitly document the baseline confirm-halt as a pre-existing, out-of-scope condition in the success criteria, or (b) add a confirm-gate-flow presentation fix (the layer F-008 identified) to phase 003 or 005 so the confirm path also renders completely.

---

### G6. Phase 001's "trustworthy harness" scope omits 3-sample validation for contested stall cells

**Evidence**: 033 scorecard §4 ranked backlog item 3: *"[P1] Re-provision the council/improvement full-run budgets and 3-sample the contested stalls… CXB-004 (context, both efforts stall) also owes a 3-sample pass before quoting a stall rate."* Phase 001 (closes F-014, F-025) hardens content-hash detection and path-token leaks but does not include multi-sample/stall-rate methodology. CXB-004 and ACB-004/005-high are acceptance cells for phase 005.

**Gap**: Phase 001's stated purpose is *"make the 033 acceptance harness trustworthy BEFORE verifying fixes."* But CXB-004's stall verdict — a phase-005 acceptance cell — rests on a sample count the benchmark itself flagged as insufficient. Phase 005's claim that CXB-004 flips from stall to complete is unverifiable against a baseline the scorecard says is under-sampled.

**Severity**: minor

**Recommended amendment**: Add a 3-sample (or N≥3) requirement for contested stall cells (CXB-004, ACB-004-high, ACB-005) to phase 001's scope, or add a methodology gate to REQ-003 requiring N≥3 stable samples before any stall-cell flip can be claimed.

---

### G7. F-003 is incorrectly classified as non-actionable

**Evidence**: F-003 (A1, iter 001): autonomous YAMLs genuinely mandate writes — *"Never hold findings in memory; write everything to files"* (deep_review_auto.yaml:16) — creating REAL write-risk a literal executor perceives. Classified as *"(evidence context for F-001/F-002; no standalone proposal)"*, effort n/a. 035 REQ-004 records F-003 among the 3 non-actionable findings.

**Gap**: F-001/F-002 (phase 002) fix the Gate-3 side — the precedence bridge and classifier API. But the autonomous YAML text that creates the perceived write mandate is independently clarifiable: a literal executor reading the YAML directly still sees an unconditional "write everything to files" that conflicts with Gate 3, regardless of whether the root-policy bridge lands. Adding *"after Gate 3 is satisfied"* or *"writes go to the pre-bound spec_folder"* to the YAML mandate is a small, independent, defense-in-depth fix that reduces the perceived conflict at the source. F-003 is closer to a low-effort actionable finding than a pure context-only constraint like F-008 (which genuinely scopes where fixes can land) or F-044 (process).

**Severity**: minor

**Recommended amendment**: Reclassify F-003 as actionable (effort S) and assign it to phase 002 (already touching the Gate-3 precedence surface) or phase 010 (injection slimming, touching autonomous-run payloads) as a YAML-mandate wording clarification.
