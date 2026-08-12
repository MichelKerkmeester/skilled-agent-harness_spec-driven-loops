---
title: "457 -- Cross-runtime directive-lifecycle dedup"
description: "Validate lifecycle-scoped directive delivery through the canonical decision, registered runtime adapters, plugin and Pi seams, and separately classified native-host receipts."
version: 3.7.0.3
id: ux-hooks-directive-lifecycle-dedup
expected_workflow_mode: system-spec-kit
expected_leaf_resources:
  - workflow_mode: system-spec-kit
    leaf_resource_id: hooks/injection-contract.md
---

# 457 -- Cross-runtime directive-lifecycle dedup

## 1. OVERVIEW

Use this scenario to prove that constant advisor policy is delivered in full on the first message and after a lifecycle boundary. Model-context runtimes retain only the dynamic `Advisor:` route line on a proven repeat; Pi contributes no prompt text on a proven repeat because its transform is visible to the operator. Evidence must identify the rung it proves:

- **`unit`**: lifecycle, transcript high-water, fail-open, generation, and secure-store behavior.
- **`registered-path`**: native payload normalization and native output-envelope transport for Claude, Codex, Cursor, and Devin.
- **`adapter-driven`**: OpenCode plugin and Pi adapter behavior without a native host receipt.
- **`native-host-delivered`**: a real CLI event fired and model-visible context was observed. Lack of such a receipt is `SKIP`, not adapter failure and not host `PASS`.

A `PASS` at one rung never upgrades another rung. In particular, Cursor can be registered-adapter `PASS` while native-host delivery remains `SKIP` because the installed CLI does not fire `beforeSubmitPrompt`.

---

## 2. SCENARIO CONTRACT

- **Feature ID**: `ux-hooks-directive-lifecycle-dedup`
- **Objective**: Verify canonical full-first/route-only-repeat/boundary-full cadence, Pi full-first/unmodified-repeat/boundary-full cadence, kill-switch behavior, and uncertainty fail-open behavior without conflating adapter execution with native-host delivery.
- **Real user request**: `Make sure the comment-hygiene and governor directives are not repeated on every prompt turn.`
- **Prompt**: `Validate directive-lifecycle delivery across the canonical core, every registered CLI adapter, OpenCode, and Pi. Classify adapter, test-seam, and native-host evidence separately. Persist repo-resident hashed evidence and return one PASS, FAIL, or SKIP verdict per runtime and evidence class.`
- **Expected signals**:
  - First turn contains `Advisor:`, `Directives:`, and `Comment hygiene`.
  - A model-context same-session growth turn contains `Advisor:` without `Directives:`.
  - A proven Pi repeat equals the raw user input byte-for-byte, contains no `Advisor:`, `Directives:`, or Pi dispatch reminder, and records no new delivery receipt.
  - Transcript shrink or a trusted lifecycle boundary restores the full block.
  - `SPECKIT_DIRECTIVE_LIFECYCLE_DEDUP=0` and `SPECKIT_PI_DIRECTIVE_DEDUP=0` force full delivery.
  - Missing transcript evidence, ambiguous identity, and unidentified reset never produce route-only delivery.
  - Every persisted evidence file is repo-relative, present, and SHA-256 hashed.
  - Claimed executor/model fields come from observed execution context; requested labels are not reported as provenance.
- **Pass/fail**:
  - `PASS` when the selected evidence rung satisfies every applicable signal and its durable report contains verified hashes.
  - `FAIL` when a model-context repeat stays full without a documented uncertainty, a proven Pi repeat contributes any prompt text or receipt, a boundary remains suppressed, uncertainty authorizes suppression, an adapter corrupts its native envelope, or durable evidence validation fails.
  - `SKIP` only for a named native-host limitation that prevents the registered event from firing. Adapter tests must still run.

---

## 3. TEST EXECUTION

### Prompt

```text
Validate directive-lifecycle delivery across the canonical core, every registered CLI adapter, OpenCode, and Pi. Classify adapter, test-seam, and native-host evidence separately. Persist repo-resident hashed evidence and return one PASS, FAIL, or SKIP verdict per runtime and evidence class.
```

### Commands

1. Build both runtime owners:

```bash
cd .opencode/skills/system-skill-advisor/mcp-server && npm run build
cd ../../system-spec-kit/mcp-server && npm run build
```

2. Run the canonical decision, store, boundary, Claude handler, and OpenCode plugin tests:

```bash
cd .opencode/skills/system-skill-advisor/mcp-server
npx vitest run \
  tests/hooks/directive-lifecycle.vitest.ts \
  tests/hooks/directive-lifecycle-boundary.vitest.ts \
  tests/hooks/claude-user-prompt-submit-hook.vitest.ts \
  tests/mk-skill-advisor-plugin.vitest.ts \
  --sequence.shuffle --sequence.seed=18018
```

3. Run registered Claude/Codex/Cursor/Devin native-payload and lifecycle-bridge tests:

```bash
cd .opencode/skills/system-spec-kit/mcp-server
npx vitest run \
  tests/directive-lifecycle-boundary-bridge.vitest.ts \
  tests/directive-lifecycle-adapter-parity.vitest.ts \
  tests/user-prompt-submit-shim.vitest.ts \
  --sequence.shuffle --sequence.seed=18018
```

4. Run Pi:

```bash
cd .opencode/hooks/dispatch/pi && npx vitest run
```

5. From the repository root, create a new durable registered-adapter evidence directory. The harness refuses to overwrite an existing directory:

```bash
node specs/hooks/002-injection-bloat-reduction/018-fix-code-review-p0-p3-findings-for-directive-lifecycle-delivery/evidence/runtime/run-registered-adapter-cadence.mjs \
  specs/hooks/002-injection-bloat-reduction/018-fix-code-review-p0-p3-findings-for-directive-lifecycle-delivery/evidence/runtime/<new-output-directory>
```

6. Create one outcome JSON per runtime/evidence class. Set `executionContext.evidenceRoot` to `.`, `requireDurableEvidence` to `true`, and list the exact prior run folder in `supersedes` when correcting historical evidence. Then persist without overwriting history:

```bash
node .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-manual-playbook-scenario.cjs \
  --skill .opencode/skills/system-spec-kit \
  --scenario ux-hooks-directive-lifecycle-dedup \
  --variant <runtime-and-evidence-class> \
  --outcome-json <repo-relative-outcome-json>
```

### Expected

- Canonical and registered-adapter commands exit `0` with nonzero test counts.
- Harness `summary.json` reports `passed: true` for Claude, Codex, Cursor, and Devin.
- Claude/Codex/Cursor/Devin JSON records the native envelope and full/route-only/full cadence. Pi evidence records full/unmodified/full cadence, unchanged receipt count on repeat, kill-switch result, uncertainty disposition, evidence class, and host-delivery status.
- OpenCode remains `test-seam` evidence unless a real OpenCode host receipt is captured.
- Cursor native-host status remains `SKIP` while `beforeSubmitPrompt` is dormant.
- Benchmark reports contain `evidenceArtifacts` with `status: verified`, byte counts, and SHA-256 values. `providerModel` stays `null` unless a model was directly observed.

### Evidence

A complete run stores:

- Focused command logs under the active packet's `evidence/tests/` directory.
- Registered-adapter JSON under the active packet's `evidence/runtime/<run>/` directory.
- Race/latency output under the active packet's `evidence/performance/` directory.
- Append-only benchmark reports under `.opencode/skills/system-spec-kit/benchmark/reports/`.
- `supersedes` links from corrected reports to prior false or ambiguous records.

### Pass / Fail

- **PASS**: Every applicable check for the stated evidence class is true, command exits and counts are captured, and all durable evidence hashes verify.
- **FAIL**: Any applicable cadence/security/envelope check fails, evidence is missing or outside the approved root, or a report claims unobserved host/model provenance.
- **SKIP**: A specific native host does not fire the registered event. Record the host/build limitation and keep adapter evidence separate.

### Failure Triage

1. Canonical decision failure: inspect `hooks/lib/directive-lifecycle.ts`, the contract module, and the durable file-store module.
2. Host-boundary failure: inspect the advisor boundary target and the system-spec-kit boundary bridge, then the registered session/compaction owner.
3. Runtime-envelope failure: inspect the corresponding system-spec-kit adapter using its native payload shape.
4. OpenCode identity failure: inspect primitive/conflicting identity classification and store-wide invalidation in `mk-skill-advisor.js`.
5. Evidence failure: inspect the manual wrapper's durable-evidence hashing, observed-provenance fields, and append-only destination reservation.

---

## 4. SOURCE FILES

- Root playbook: [manual-testing-playbook.md](../../manual-testing-playbook/manual-testing-playbook.md)
- Feature catalog: [ux-hooks/directive-lifecycle-dedup.md](../../feature-catalog/ux-hooks/directive-lifecycle-dedup.md)
- Operator contract: [hooks/injection-contract.md](../../../../hooks/injection-contract.md)
- Canonical core: `.opencode/skills/system-skill-advisor/hooks/lib/directive-lifecycle.ts`
- Durable store: `.opencode/skills/system-skill-advisor/hooks/lib/directive-lifecycle-file-store.ts`
- Host boundary: `.opencode/skills/system-skill-advisor/hooks/claude/directive-lifecycle-boundary.ts`
- Registered bridge: `.opencode/skills/system-spec-kit/mcp-server/hooks/claude/directive-lifecycle-boundary.ts`
- OpenCode adapter: `.opencode/plugins/mk-skill-advisor.js`
- Persistence wrapper: `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-manual-playbook-scenario.cjs`

---

## 5. SOURCE METADATA

- Group: UX Hooks
- Playbook ID: 457
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `ux-hooks/directive-lifecycle-dedup.md`
- Evidence classes: `unit`, `adapter-driven`, `registered-path`, `native-host-delivered`
