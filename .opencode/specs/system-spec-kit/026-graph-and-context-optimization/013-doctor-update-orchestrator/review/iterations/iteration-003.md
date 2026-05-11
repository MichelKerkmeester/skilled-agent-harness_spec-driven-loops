# Iteration 3 — correctness (002-sandbox-testing-playbook + cross-phase integration)

## Files Reviewed

| Path | Classification | Notes |
|------|---------------|-------|
| `002-sandbox-testing-playbook/spec.md` | spec-integrity | SC-001 vs REQ-001 count mismatch; 001 sibling status claim |
| `002-sandbox-testing-playbook/implementation-summary.md` | completion-evidence | completion_pct vs body Status inconsistency; G3 staleness |
| `002-sandbox-testing-playbook/checklist.md` | verification-gate | 103 unchecked P0/P1 items vs COMPLETE claim |
| `002-sandbox-testing-playbook/handover.md` | state-accuracy | G3/G4 PASS claims vs IMS G3/G4 warnings |
| `001-doctor-commands/implementation-summary.md` | cross-phase-consistency | completion_pct 99 vs body ~30%; deleted-YAML references |
| `001-doctor-commands/spec.md` | command-surface-contract | Cross-ref of 5 command names against 002 scenario invocations |
| `23--doctor-commands/*.md` (23 files) | playbook-scenarios | Verified 5-section structure + SECTION 4 YAML asset citations |
| `_sandbox/.../scenarios/*.sh` (23 files) | cross-phase-command | All 23 wrappers invoke canonical `/doctor:*` commands 1:1 |
| `commands/doctor/*.md` (5 files) | implementation-surface | All 5 doctor command entrypoints exist on disk |
| `commands/doctor/assets/doctor_*.yaml` (5 files) | implementation-surface | All 5 YAML assets exist on disk |

## Findings by Severity

### P0

#### P0-001 [P0] Verification gate bypassed — 103 unchecked checklist items vs COMPLETE completion claim

- **File**: `002-sandbox-testing-playbook/checklist.md` (103 `[ ]` unchecked across all anchors); `002-sandbox-testing-playbook/implementation-summary.md:55`
- **Evidence**: checklist.md contains 103 unchecked checkboxes (`[ ]`) vs only 3 checked (`[x]`), covering P0 items CHK-004 through CHK-505 including pre-implementation gates, code quality, testing, fix-completeness, security, documentation, file-org, all 23 per-scenario verification, root-playbook gates, sandbox harness verification (30 scripts), Phase E gates G1-G7, and closeout sign-off. Yet implementation-summary.md:55 declares `Status: COMPLETE (~95% — G3 + G4 minor issues deferred)` and implementation-summary.md:57 claims "All 5 phases delivered."
- **Finding class**: class-of-bug — the pattern of claiming completion with unchecked P0 verification items applies across both child phases (001 has similar issues).
- **Scope proof**: `grep -c '\[ \]'` on checklist.md returns 103; `grep -c '\[x\]'` returns 3. Only CHK-001, CHK-002, CHK-003 (pre-implementation parent checks) are marked complete. Every P0 gate for Phase B scenarios, Phase C root playbook, Phase D sandbox harness, and Phase E verification is unchecked.
- **Recommendation**: Either (a) check off all items with evidence per-item, confirming each against implementation-summary.md, or (b) downgrade completion status to match actual verification state (approximately completion_pct 50 not 95). Do NOT claim COMPLETE until all P0 checkboxes are marked [x] with traceable evidence.

---

### P1

#### P1-001 [P1] Spec internal contradiction — SC-001 references 25 scenarios but REQ-001 and reality = 23

- **File**: `002-sandbox-testing-playbook/spec.md:193`
- **Evidence**: SC-001 reads "25 scenario .md files exist + each passes validate_document.py". REQ-001 at spec.md:152 correctly states "All 23 playbook scenario .md files exist at IDs 323-336, 338-342, 344-347 (gaps at 337 + 343)". Mode reduction removed DOC-337 and DOC-343 (per handover.md:67) leaving 23 scenarios. SC-001 was not updated.
- **Finding class**: instance-only — single stale success criterion reference.
- **Scope proof**: `ls 23--doctor-commands/ | wc -l` returns 23. REQ-001 and spec frontmatter both state 23. Only SC-001 says 25.
- **Recommendation**: Update SC-001 at spec.md:193 from "25 scenario" to "23 scenario".

#### P1-002 [P1] 002 implementation-summary internal contradiction — `completion_pct: 70` vs body `COMPLETE (~95%)`

- **File**: `002-sandbox-testing-playbook/implementation-summary.md:33` vs `:55`
- **Evidence**: The `_memory.continuity.completion_pct: 70` at line 33 says the packet is 70% done. The body Status field at line 55 says `COMPLETE (~95% — G3 + G4 minor issues deferred)`. These two values differ by 25 percentage points and convey incompatible signals: one says "still working" (70%), the other says "done with small caveats" (95%).
- **Finding class**: instance-only — single file internal inconsistency.
- **Scope proof**: Both values are in the same file. The continuity block at :33 was written 2026-05-09T18:35:00Z (handover), the body status at :55 was set during the implementation write.
- **Recommendation**: Reconcile to a single consistent status. If checklist is mostly unchecked (P0-001 above), completion_pct should be ≤50. If the body Status is authoritative, bump continuity to match.

#### P1-003 [P1] 001 implementation-summary internal contradiction — `completion_pct: 99` vs body `~30%`

- **File**: `001-doctor-commands/implementation-summary.md:29` vs `:51`
- **Evidence**: The `_memory.continuity.completion_pct: 99` at line 29 says the packet is 99% done. The body at line 51 says `Status: PARTIAL (~30% complete)`. These differ by ~70 percentage points. Body lists significant remaining work: Tracks B1-B4 (14 YAML files), Phase C orchestrator, Phase D migration manifest, Phase E verification — estimated 8-12 hours wall-clock.
- **Finding class**: instance-only — single file internal inconsistency.
- **Scope proof**: Both values in same file. Continuity block written 2026-05-09T20:40:00Z; body written during partial implementation handoff. Note: all 5 doctor command files + 5 YAMLs now exist on disk, so the body is stale — but the continuity 99% is also misleading given documented remaining work.
- **Recommendation**: Update body to reflect current state (5 commands on disk, 5 YAMLs authored). Set consistent completion_pct. If mode-reduction completed and all files exist, a value closer to 85-90% may be appropriate (migration manifest + per-version scripts still pending per REQ-020).

#### P1-004 [P1] 001 implementation-summary references deleted YAML modes that no longer exist

- **File**: `001-doctor-commands/implementation-summary.md:96-104`
- **Evidence**: Lines 96-104 describe pending `doctor_memory.yaml` in confirm/apply/apply-confirm variants, stating "⏳ PENDING: Same flow as auto.yaml + interactive review gates" etc. Mode reduction (per handover.md:65) deleted 21 mode YAMLs and the single-mode design uses bare `doctor_*.yaml` only. These pending-task descriptions reference a design that was already abandoned.
- **Finding class**: class-of-bug — stale implementation documentation that could mislead a developer resuming the packet.
- **Scope proof**: `ls commands/doctor/assets/doctor_memory.yaml` returns exactly 1 file (bare name). No confirm/apply/apply-confirm variants exist. handover.md documents the mode reduction.
- **Recommendation**: Rewrite the "Remaining Work" section to reflect single-mode design. Remove references to auto/confirm/apply/apply-confirm variants. Document the mode reduction in this file.

#### P1-005 [P1] 002 spec.md lists 001 sibling as "Complete" — contradicts 001's own status documentation

- **File**: `002-sandbox-testing-playbook/spec.md:68`
- **Evidence**: Line 68: `| **Sibling** | 001-doctor-commands (Complete) |`. 001's implementation-summary.md:51 says `Status: PARTIAL (~30% complete)`. While 5 command files exist on disk now, 001's documentation claims significant remaining work. The "Complete" label in 002's spec status table could mislead reviewers into thinking 001's verification gates have passed.
- **Finding class**: instance-only — single stale reference in a status table.
- **Scope proof**: 002 spec.md:68 is the only cross-phase status claim. 001 IMS says PARTIAL. Actual files exist but verification incomplete.
- **Recommendation**: Update to "(Implemented; documentation pending)" or similar accurate status. Alternatively, push 001's IMS to accurate completion_pct first, then update this cross-reference.

#### P1-006 [P1] Cross-phase command invocation verification passes but no end-to-end execution evidence

- **File**: `_sandbox/23--doctor-commands/scenarios/DOC-*.sh` (23 files) vs `implementation-summary.md:186-192`
- **Evidence**: All 23 scenario wrappers correctly invoke canonical `/doctor:*` commands (grep confirms 23 `/doctor:` invocations mapping 1:1 to the 5 command surfaces). However, implementation-summary.md:186-192 acknowledges "Real fixture URLs are still placeholders, so full Docker-backed end-to-end execution remains deferred" and handover.md:51 states "Phase NOT Completed: actual scenario execution (zero scenarios run end-to-end)." The playbook's REQ-022 (invoke canonical commands) is structurally satisfied but the actual runtime behavior has never been exercised.
- **Finding class**: class-of-bug — all 23 scenarios remain structurally authored but functionally unvalidated.
- **Scope proof**: `grep -l '/doctor:'` across 23 scenario `.sh` files confirms 1:1 mapping. handover.md confirms zero executions.
- **Recommendation**: Do NOT claim verification gates for scenarios as CLOSED without actual runtime evidence. Mark scenarios requiring live execution as DEFERRED with explicit dependency on fixture availability OR Docker daemon access.

### P2

#### P2-001 [P2] 002 implementation-summary G3 validation report is stale — strict validate now passes

- **File**: `002-sandbox-testing-playbook/implementation-summary.md:172`
- **Evidence**: Line 172 reports G3 strict validate as ⚠️ with "4 errors (FILE_EXISTS missing 1 required, TEMPLATE_HEADERS 23 issues, ANCHORS_VALID 35 issues, FRONTMATTER_MEMORY_BLOCK 5 issues)." Current `validate.sh --strict` exits 0 cleanly with no output (verified 2026-05-11). The G3 status has been resolved but documentation not updated.
- **Finding class**: instance-only — stale verification status.
- **Recommendation**: Update G3 to ✅ and remove the cross-packet template-manifest caveat if no longer applicable.

#### P2-002 [P2] 002 handover claims "002 strict validate PASSED" and "013 phase parent strict validate PASSED" — currently true but contradicts implementation-summary

- **File**: `002-sandbox-testing-playbook/handover.md:159-160`
- **Evidence**: Handover lines 159-160: "002 strict validate PASSED" and "013 phase parent strict validate PASSED". This matches current state (both exit 0). However, 002 implementation-summary.md:172-173 shows G3 ⚠️ and G4 ⚠️. The cross-file inconsistency means a reader picking up only one document would get a wrong picture.
- **Finding class**: instance-only — cross-file documentation drift.
- **Recommendation**: Update 002 implementation-summary.md to reflect current passing validation state. Ensure handover and implementation-summary agree.

## Traceability Checks

| Protocol | Status | Detail |
|----------|--------|--------|
| **spec_code** | partial | 001 command names cross-reference correctly to 002 scenario invocations (5 surfaces × 23 scenarios verified 1:1). But 001 spec REQ requirements lack implementation verification evidence — no runtime execution performed. |
| **checklist_evidence** | not-yet | 002 checklist has 103 unchecked items. Only 3 pre-implementation items checked. No per-scenario verification, no harness verification, no gate verification evidence exists. |
| **skill_agent** | partial | `/doctor:*` command surface exists but no `@doctor` agent definition found. Scenarios reference doctor commands as standalone slash commands, not as agent dispatches. |
| **agent_cross_runtime** | not-yet | Not assessed in this iteration — deferred to maintainability pass. |
| **feature_catalog_code** | partial | 002 resource-map.md lists 76 references. Cross-check with actual disk paths not deeply performed this iteration but glob confirms 23 scenarios + 23 wrappers + 5 commands + 5 YAMLs exist. |
| **playbook_capability** | partial | 23 scenario `.md` files all follow 5-section template structure. 23 `.sh` wrappers all invoke canonical commands. But zero scenarios have been executed end-to-end (handover.md confirms), so capability cannot be verified. |

## Verdict

**FAIL**

Rationale:
- **P0-001**: 103 unchecked verification gate items with a COMPLETE claim means the primary quality gate (checklist.md) has been wholly bypassed. This is a blocker-level correctness finding.
- 6 P1 findings document significant documentation-code drift across both child phases, including internal contradictions in completion status, stale implementation descriptions, and cross-phase status misrepresentation.
- Traceability checks show `not-yet` for checklist_evidence — the most critical verification protocol.

**P0 count: 1** — active blocker must be resolved before this spec folder can be considered complete.

## Next Dimension

Continue correctness deep-pass on remaining areas not yet covered:
- 002 `plan.md` cross-phase architectural consistency (does the 5-phase plan actually map to delivered artifacts?)
- 002 `tasks.md` completion audit — which T-001..T-068 tasks have actual evidence of completion?
- 001 `checklist.md` cross-check — does 001 exhibit the same unchecked-checklist-vs-completion-claim pattern?
- Docker sandbox harness correctness: verify `harness/*.sh` scripts actually reference valid paths and the `capture-evidence.sh` + `assert-signals.sh` logic matches `spec.md` REQ-024/REQ-025.
