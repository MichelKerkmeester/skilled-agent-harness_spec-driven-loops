---
title: "015 doctor code-graph route policy"
description: "Verify doctor-code-graph exposes mutating route metadata while the current YAML keeps Phase A diagnostic-only."
trigger_phrases:
  - "015"
  - "doctor apply mode policy"
  - "system-code-graph manual testing"
importance_tier: "normal"
version: 1.2.0.5
---
# 015 doctor code-graph route policy

## 1. OVERVIEW

Verify doctor-code-graph exposes mutating route metadata while the current YAML keeps Phase A diagnostic-only.

---

## 2. SCENARIO CONTRACT

- Objective: Verify doctor-code-graph exposes mutating route metadata while the current YAML keeps Phase A diagnostic-only.
- Real user request: `Review doctor-code-graph routing and YAML to confirm the current workflow is diagnostic-only despite mutating route metadata.`
- Operator prompt: `Inspect doctor-code-graph route metadata and YAML. Show mk-code-index tool grants, read-only Phase A policy and packet-scratch write limits, then return PASS/FAIL.`
- Expected execution process: Read the route manifest and current doctor code-graph YAML line ranges, then run only diagnostic mode unless using a disposable workspace.
- Expected signals: Route metadata lists `mk-code-index` tools and mutating flags. Current YAML forbids mutation outside packet-local scratch and never invokes `code_graph_scan` in Phase A.
- Desired user-visible outcome: A concise verdict explaining whether the current doctor-code-graph workflow keeps diagnostics read-only.
- Pass/fail: PASS if route metadata and YAML boundaries are both visible and Phase A remains diagnostic-only. FAIL if the YAML mutates source/config/DB state or the route lacks `mk-code-index` grants.

---

## 3. TEST EXECUTION

### Commands

1. Read `.opencode/commands/doctor/_routes.yaml:54-79`.
2. Read `.opencode/commands/doctor/assets/doctor_code-graph.yaml:20-23` and `.opencode/commands/doctor/assets/doctor_code-graph.yaml:76-86`.
3. Read `.opencode/commands/doctor/assets/doctor_code-graph.yaml:131-187` and `.opencode/commands/doctor/assets/doctor_code-graph.yaml:191-206`.
4. Run only diagnostic mode unless using a disposable workspace.

### Expected Output / Verification

Route metadata lists `mk-code-index` tools and mutating flags. Current YAML forbids mutation outside packet-local scratch and never invokes `code_graph_scan` in Phase A.

### Cleanup

Remove scratch/apply artifacts from disposable copy.

### Variant Scenarios

Run `/doctor code-graph --scope=all --dry-run` in a disposable workspace and confirm any report writes stay under packet-local scratch.

---

## 4. SOURCE FILES

| File | Role |
| --- | --- |
| `../manual_testing_playbook.md` | Root playbook index |
| `../../feature_catalog/feature_catalog.md` | Runtime feature catalog |

---

## 5. SOURCE METADATA

- Group: Code Graph Runtime
- Playbook ID: 015
- Canonical root source: `manual_testing_playbook.md`

---

## 6. EVIDENCE

Read `.opencode/commands/doctor/_routes.yaml:54-79`:

```text
54:       - mcp__mk_spec_memory__embedder_status
55:     trigger_phrases:
56:       - "embedding provider status"
57:       - "hf-local model-server health"
58:       - "embedder_status diagnostics"
59: 
60:   - target: causal-graph
61:     yaml: doctor_causal-graph.yaml
62:     setup_vars: [execution_mode, intent, confidence_threshold]
63:     allowed_flags: ["--confidence-threshold=N"]
64:     mutating: read-only
65:     gate3_location: "n/a (read-only diagnostic; samples causal_edges and recommends candidates, no writes)"
66:     mcp_tools:
67:       - mcp__mk_spec_memory__memory_causal_stats
68:       - mcp__mk_spec_memory__memory_drift_why
69:       - mcp__mk_spec_memory__memory_search
70:     trigger_phrases:
71:       - "causal edges drift"
72:       - "causal graph doctor"
73:       - "lineage coverage"
74:       - "memory_causal_stats"
75: 
76:   - target: code-graph
77:     yaml: doctor_code-graph.yaml
78:     setup_vars: [execution_mode, scope]
79:     allowed_flags:
```

Read immediate continuation because the requested route range ended at `allowed_flags:`:

```text
80:       # apply-mode flags (--operation, --confirm) return when the confirm workflow is promoted (phase_b)
81:       - "--scope=stale|missed|bloat|all|excludes"
82:       - "--dry-run"
83:     mutating: read-only
84:     gate3_location: "n/a (Phase A diagnostic is read-only; emits an exclude/language report, never scans or writes the index)"
85:     mcp_tools:
86:       - mcp__mk_code_index__code_graph_status
87:       - mcp__mk_code_index__code_graph_query
88:       - mcp__mk_code_index__code_graph_context
89:       - mcp__mk_code_index__detect_changes
90:       - mcp__mk_spec_memory__memory_context
91:       - mcp__mk_spec_memory__memory_search
92:     script_invocations:
93:       - 'Warm-only: probe the existing mk-code-index IPC socket first; only when it answers, run node .opencode/bin/code-index.cjs code_graph_status --format json --timeout-ms 500 --warm-only (the flag guarantees no daemon start; exit 75 = backend unavailable, retryable)'
94:     trigger_phrases:
95:       - "code-graph index drift"
96:       - "code-graph rebuild"
97:       - "code-graph stale excludes"
98:       - "code-graph corruption recover"
99: 
100:   - target: deep-loop
101:     yaml: doctor_deep-loop.yaml
102:     setup_vars: [execution_mode, intent, scope]
103:     allowed_flags: ["--scope=research|review|council|both|all"]
104:     mutating: read-only
```

Read `.opencode/commands/doctor/assets/doctor_code-graph.yaml:20-23`:

```text
20: phase_a_invariant: |
21:   Phase A is diagnostic-only. NO mutations to any file outside packet-local scratch.
22:   Phase 3 + Phase 4 are handled by explicit apply workflows after resilience assets stabilize.
23: 
```

Read `.opencode/commands/doctor/assets/doctor_code-graph.yaml:76-86`:

```text
76: # MUTATION BOUNDARIES (PHASE A INVARIANT)
77: # ─────────────────────────────────────────────────────────────────
78: mutation_boundaries:
79:   allowed_targets: []
80:   forbidden_targets:
81:     - "Any file outside <packet_scratch>/"
82:     - "code-graph SQLite database"
83:     - "Any code under .opencode/skills/system-code-graph/mcp_server/ or .opencode/skills/system-spec-kit/mcp_server/"
84:     - "Any source file in the workspace"
85:   enforcement: "Phase A has no Phase 3; the activities below produce a markdown report only and never invoke code_graph_scan or write to source files"
86:   phase_b_promotion:
```

Read `.opencode/commands/doctor/assets/doctor_code-graph.yaml:131-187`:

```text
131: # WORKFLOW
132: # ─────────────────────────────────────────────────────────────────
133: workflow:
134:   phase_0_discovery:
135:     purpose: Gather index status + filesystem snapshot + bloat-dir candidates
136:     activities:
137:       - "Apply upstream_assets.cli_health_policy, then run upstream_assets.cli_health_command only when the warm socket probe succeeds; report CLI availability, freshness, trustState, and exit code"
138:       - "Invoke code_graph_status({}) → capture indexed_count, last_scan_at, edge_count, freshness flags, activeScope"
139:       - "Resolve active scope policy from activeScope fingerprint; accept v2, treat v1/null parser result as NEEDS_FULL_SCAN instead of error"
140:       - "Filesystem walk: count source files by language"
141:       - "Detect bloat-dir candidates"
142:       - "Build initial inventory"
143:       - "Display summary to user before proceeding"
144:     outputs:
145:       - cli_availability: available|retryable-unavailable|failed
146:       - indexed_count: N
147:       - file_count: M
148:       - last_scan_at: timestamp
149:       - lang_histogram: { ts: N, js: N, py: N, sh: N, json: N, md: N }
150:       - bloat_candidates: [{ path, tier, present_in_index }]
151:       - active_scope_policy: "{status: active|needs_full_scan, included roots, excluded roots, granular included skills}"
152:     validation: discovery_complete
153:     user_visible: "Show indexed_count, file_count, last_scan_at, lang_histogram"
154: 
155:   phase_1_analysis:
156:     purpose: Compute stale + missed + bloat sets via code_graph_status + policy-aware filesystem walk
157:     activities:
158:       - "If code_graph_status available: invoke code_graph_status({}) and derive stale set from freshness/manifest fields"
159:       - "Before stale/missed/bloat set construction, filter filesystem paths through active_scope_policy so default-excluded roots are intentionally absent unless opted in"
160:       - "Compute missed set: policy-included files-on-disk minus files-in-index"
161:       - "Compute bloat set: policy-included bloat_candidates intersected with files-in-index"
162:       - "For granular includeSkills lists, include only files under the named .opencode/skills/<name> folders (any prefix: sk-, deep-, system-, mcp-); exclude all other skill folders from missed-file diagnosis"
163:       - "If scope filter active: filter to scope's subset"
164:       - "Display analysis summary, then trigger pre_phase_2 approval gate"
165:     outputs:
166:       - stale_set: [paths]
167:       - missed_set: [paths]
168:       - bloat_set: [paths]
169:       - overlap_set: [paths]
170:       - analysis_report: structured map per category
171:     validation: analysis_complete
172:     gate_after: "pre_phase_2 (Proposal)"
173: 
174:   phase_2_proposal:
175:     purpose: Generate exclude-rule + language-filter recommendations and write report to packet scratch
176:     activities:
177:       - "If user chose 'C abort': skip report generation, exit STATUS=CANCELLED"
178:       - "If user chose 'B filter': filter findings to user-specified categories"
179:       - "Resolve packet_scratch path"
180:       - "Generate exclude-rule recommendations"
181:       - "Generate language-filter recommendations"
182:       - "Build diagnostic report markdown"
183:       - "Write report to {packet_scratch}/code-graph-diagnostic-{timestamp}.md (umask 077)"
184:       - "Display report path and summary"
185:     outputs:
186:       - report_path: "{packet_scratch}/code-graph-diagnostic-{timestamp}.md"
187:       - exclude_rule_recommendations: [{ pattern, tier, rationale }]
```

Read `.opencode/commands/doctor/assets/doctor_code-graph.yaml:191-206`:

```text
191: 
192: # ─────────────────────────────────────────────────────────────────
193: # QUALITY GATES
194: # ─────────────────────────────────────────────────────────────────
195: quality_gates:
196:   pre_phase_2:
197:     location: "Before Phase 2 Proposal"
198:     blocking: hard
199:     checks:
200:       - "User approved at pre_phase_2 gate (A or B)"
201:       - "stale_set + missed_set + bloat_set computed"
202:       - "active_scope_policy is active; if NEEDS_FULL_SCAN, report that policy-aware missed files require code_graph_scan({ incremental: false })"
203:     on_fail: "STOP - approval not granted; honor C abort with STATUS=CANCELLED"
204:   post_phase_2:
205:     location: "After Phase 2 Proposal"
206:     blocking: hard
```

Ran diagnostic MCP status only:

```text
plugin_id=mk-code-graph
cache_ttl_ms=5000
spec_folder=auto
resume_mode=minimal
messages_transform_enabled=true
messages_transform_mode=schema_aligned
runtime_ready=false
node_binary=node
bridge_timeout_ms=15000
bridge_path=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-code-graph/mcp_server/plugin_bridges/mk-code-graph-bridge.mjs
last_runtime_error=Bridge skipped: SOCKET_ABSENT (exit=75); plugin injection will no-op
cache_entries=0
cache=empty
```

Ran warm-only CLI diagnostic:

```text
{
  "status": "error",
  "error": "backend unavailable: connect ENOENT /tmp/mk-code-index/daemon-ipc.sock",
  "exitCode": 75
}
```

Checked `code_graph_scan` references in `.opencode/commands/doctor/assets/doctor_code-graph.yaml`:

```text
Found 4 matches
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/commands/doctor/assets/doctor_code-graph.yaml:
  Line 85:   enforcement: "Phase A has no Phase 3; the activities below produce a markdown report only and never invoke code_graph_scan or write to source files"

  Line 202:       - "active_scope_policy is active; if NEEDS_FULL_SCAN, report that policy-aware missed files require code_graph_scan({ incremental: false })"

  Line 244:     - invoke_code_graph_scan_in_phase_a


/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/commands/doctor/assets/doctor_update.yaml:
  Line 397:       code-graph: "code_graph_scan({ incremental: false })"
```

Read `.opencode/commands/doctor/assets/doctor_code-graph.yaml:238-246`:

```text
238:     - wait_for_user_approval_at_pre_phase_2_gate
239:     - apply_scope_filter_consistently
240:     - write_report_to_packet_scratch_with_umask_077
241:     - assert_read_only_invariant_on_completion
242:   NEVER:
243:     - mutate_any_source_file
244:     - invoke_code_graph_scan_in_phase_a
245:     - write_outside_packet_scratch
246:     - skip_pre_phase_2_approval_gate
```

---

## 7. PASS/FAIL

PASS - Route metadata lists the code-graph diagnostic flags, `mutating: read-only`, and `mk-code-index` MCP tool grants; the current YAML states Phase A is diagnostic-only, forbids writes outside packet scratch/source/index mutation, writes only a packet-scratch report, and explicitly lists `invoke_code_graph_scan_in_phase_a` under `NEVER`.
