# Skill Advisor Manual Testing Playbook Run

- Tester: Codex
- Date: 2026-09-11
- Repository: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
- Assigned scenarios: 16
- Results file: specs/system-skill-advisor/025-mcp-decommission-cli-front-door/008-verification-and-closeout/playbook-runs/cli-codex-luna.md

## Verdict

| Scenario | Result |
|---|---|
| AI-001 | BLOCKED |
| AI-002 | FAIL |
| AI-003 | BLOCKED |
| AI-004 | BLOCKED |
| AI-005 | BLOCKED |
| AI-006 | FAIL |
| LC-001 | BLOCKED |
| LC-002 | BLOCKED |
| LC-003 | BLOCKED |
| LC-004 | BLOCKED |
| LC-005 | FAIL |
| SC-001 | BLOCKED |
| SC-002 | BLOCKED |
| SC-003 | FAIL |
| SC-004 | FAIL |
| SC-005 | BLOCKED |

No whole scenario is marked PASS. Five scenarios contain observed failures. Eleven remain blocked because the daemon-dependent path was not reachable, or a required fixture was absent. Direct helper checks and passing unit tests are reported as supplemental evidence and are not promoted to scenario PASS results.

The main degradation observed after the MCP surface was removed is the CLI fallback path. A normal advisor_recommend call returns exit 0, degraded: true and source: "local-scorer", but it ignores requested attribution and topK in the fallback payload. Its reason strings also expose matched prompt phrases. The promptless warm-up form claimed by the run instructions was rejected as missing prompt.

The live database was not mutated. Trusted mutation attempts were made only against a disposable copy under /private/tmp. The requested results file was the only repository file overwritten.

## Transport mapping and shared observations

The scenario files contain historical MCP calls. I made the following CLI mappings and made no MCP tool call:

- advisor_recommend became node .opencode/bin/skill-advisor.cjs advisor_recommend ... --format json.
- advisor_status became node .opencode/bin/skill-advisor.cjs advisor_status --workspace-root "$PWD" --format json.
- advisor_validate became node .opencode/bin/skill-advisor.cjs advisor_validate --json '{"confirmHeavyRun":true,"skillSlug":null}' --format json.
- skill_graph_scan became node .opencode/bin/skill-advisor.cjs skill_graph_scan --trusted --format json.
- skill_graph_query, skill_graph_status and skill_graph_validate used the same CLI front door with their documented arguments.

The CLI manifest was checked directly:

    $ node .opencode/bin/skill-advisor.cjs list-tools --format json | jq '{status, count: .data.count, commands: [.data.tools[].command], advisor_recommend_required: [.data.tools[] | select(.command=="advisor_recommend") | .inputSchema.required]}'
    {
      "status": "ok",
      "count": 9,
      "commands": [
        "advisor_recommend",
        "advisor_rebuild",
        "advisor_status",
        "advisor_validate",
        "skill_graph_scan",
        "skill_graph_query",
        "skill_graph_status",
        "skill_graph_validate",
        "skill_graph_propagate_enhances"
      ],
      "advisor_recommend_required": [
        [
          "prompt"
        ]
      ]
    }
    LIST_TOOLS_CLI_EXIT_STATUS=0

The live daemon probes did not match the supplied warm-state claim:

    $ node .opencode/bin/skill-advisor.cjs advisor_status --workspace-root "$PWD" --format json
    {
      "status": "error",
      "error": "backend unavailable: daemon launcher exited with code 0",
      "exitCode": 75
    }
    STATUS_EXIT_STATUS=75

A prompt-bearing warm-only probe reached the stale socket and returned retryable exit 75:

    {
      "status": "error",
      "error": "backend unavailable: connect EPERM /tmp/system-skill-advisor/ac6f9e0b6575/daemon-ipc.sock",
      "exitCode": 75
    }
    WARM_ONLY_PROMPT_EXIT_STATUS=75

The promptless form claimed in the run instructions did not warm the daemon:

    $ node .opencode/bin/skill-advisor.cjs advisor_recommend --warm-only
    {
      "status": "error",
      "error": "Invalid arguments for advisor_recommend: advisor_recommend.prompt is required",
      "exitCode": 64
    }

The normal non-warm recommend path did exercise the local fallback:

    {
      "status": "ok",
      "degraded": true,
      "source": "local-scorer",
      "data": {
        "recommendations": [
          {
            "skillId": "system-spec-kit",
            "confidence": 0.95,
            "uncertainty": 0.2,
            "reason": "Matched: !context, !context(multi), !memory, !save this conversation context(phrase), !save(multi) [boundary: owns memory/context preservation]"
          },
          {
            "skillId": "memory:save",
            "confidence": 0.88,
            "uncertainty": 0.15,
            "reason": "Matched: !intent:memory, !save this conversation context(phrase), context, memory(name), save(name)"
          },
          {
            "skillId": "command-memory-save",
            "confidence": 0.95,
            "uncertainty": 0.15,
            "reason": "Matched: !save this conversation context(phrase), command_penalty, context, conversation, memory(name)"
          }
        ],
        "effectiveThresholds": {
          "confidenceThreshold": 0.8,
          "uncertaintyThreshold": 0.35,
          "confidenceOnly": false
        }
      }
    }
    RECOMMEND_EXIT_STATUS=0

The requested topK: 2 was present on this call, but three recommendations were returned. The includeAttribution: true request did not produce laneBreakdown or why_recommended.

The three live mutation trust gates were exercised without --trusted. Each refused before daemon access:

    skill_graph_scan --format json
    {
      "status": "error",
      "error": "skill_graph_scan requires --trusted or SYSTEM_SKILL_ADVISOR_CLI_TRUSTED=1",
      "exitCode": 64
    }
    SCAN_EXIT_STATUS=64

    advisor_rebuild --force true --format json
    {
      "status": "error",
      "error": "advisor_rebuild requires --trusted or SYSTEM_SKILL_ADVISOR_CLI_TRUSTED=1",
      "exitCode": 64
    }
    REBUILD_EXIT_STATUS=64

    skill_graph_propagate_enhances --mode apply --dry-run false --format json
    {
      "status": "error",
      "error": "skill_graph_propagate_enhances requires --trusted or SYSTEM_SKILL_ADVISOR_CLI_TRUSTED=1",
      "exitCode": 64
    }
    PROPAGATE_EXIT_STATUS=64

For the disposable copy, a direct launcher attempt performed its startup scan and then failed when binding the local socket:

    [system-skill-advisor-launcher] Skill graph: scanned=10 indexed=0 skipped=10 edges=8 rejected=11 deleted=0
    [system-skill-advisor-launcher] Skill graph daemon active=true
    [system-skill-advisor-launcher] Fatal error: Error: listen EPERM: operation not permitted /private/tmp/skill-advisor-playbook-codex.LNdofp/sockets/daemon-ipc.sock
    LAUNCHER_EXIT_STATUS=1

The trusted scan against that disposable copy consequently returned:

    {
      "status": "error",
      "error": "backend unavailable: daemon launcher exited with code 1",
      "exitCode": 75
    }

The required operator action for the blocked scenarios is to run this playbook in an environment that permits the resident daemon to bind its local IPC socket, then repeat the daemon-backed steps. No interactive runtime was available to perform that action here.

## AI-001: Deterministic Derived Extraction

Scenario file read: .opencode/skills/system-skill-advisor/manual-testing-playbook/auto-indexing/derived-extraction.md.

I copied the target skill into the disposable workspace, captured pre-state, touched it twice with a four-second wait between captures and compared the files. The observed disposable state was:

    {
      "triggerCount": 60,
      "keywordCount": 17,
      "sourceDocCount": 11,
      "keyFileCount": 14,
      "provenance_fingerprint": null,
      "trust_lane": null
    }
    DERIVED_PRE_POST1_CMP_STATUS=0
    DERIVED_POST1_POST2_CMP_STATUS=0
    SKILL_PRE_POST_CMP_STATUS=0

The unchanged metadata and byte-identical SKILL.md were observed, but no watcher was running to produce a fresh derived block.

As a supplemental direct helper check, syncDerivedMetadata was run against a disposable fixture with frontmatter, body, fenced code, references/guide.md and assets/diagram.png:

    {
      "first": {
        "changed": true,
        "triggerCount": 12,
        "keywordCount": 20,
        "provenance_fingerprint": "sha256:be7ad7bc21254303b6dd61770b503164acae846d0af92d43b5e375cc9dc58dda",
        "trust_lane": "derived_generated",
        "sourceDocs": 2,
        "keyFiles": 3
      },
      "second": {
        "changed": false,
        "fingerprintSame": true,
        "generatedAtSame": true
      },
      "skillByteIdentical": true
    }
    DERIVED_FIXTURE_SYNC_EXIT_STATUS=0

The helper behaved as expected. The scenario itself is BLOCKED because the required daemon watcher reindex and serving-path comparison did not run.

Result: BLOCKED.

## AI-002: A7 Sanitizer at Every Write Boundary

Scenario file read: .opencode/skills/system-skill-advisor/manual-testing-playbook/auto-indexing/sanitizer-boundaries.md.

The exact CLI equivalent was run without --warm-only so the fallback could execute:

    $ node .opencode/bin/skill-advisor.cjs advisor_recommend --prompt "save this conversation context to memory" --options '{"topK":2,"includeAttribution":true}' --format json

It returned the degraded payload shown in the shared evidence. It had three recommendations instead of two, no attribution fields and a reason containing the prompt fragment save this conversation context.

The malformed-value sanitizer helper was also run in the disposable copy:

    [
      {
        "input": "bad\u0000label",
        "envelope": "badlabel",
        "diagnostic": "badlabel"
      },
      {
        "input": "../unsafe/segment",
        "envelope": "../unsafe/segment",
        "diagnostic": "../unsafe/segment"
      },
      {
        "input": "review this pull request",
        "envelope": "review this pull request",
        "diagnostic": "review this pull request"
      },
      {
        "input": "normal-label",
        "envelope": "normal-label",
        "diagnostic": "normal-label"
      }
    ]
    SANITIZER_HELPER_EXIT_STATUS=0

The path-segment input was preserved rather than rejected or converted to [a-z0-9][a-z0-9-]*. The prompt fragment was also surfaced. The public fallback response therefore violates the scenario's prompt-safety and label-shape expectations.

Result: FAIL.

## AI-003: Provenance Fingerprints and Trust Lanes

Scenario file read: .opencode/skills/system-skill-advisor/manual-testing-playbook/auto-indexing/provenance-and-trust-lanes.md.

The live derived block was inspected:

    {
      "trigger_phrases": 60,
      "key_topics": 17,
      "intent_signals": 4,
      "source_docs": 11,
      "key_files": 14,
      "provenance_fingerprint": null,
      "trust_lane": null
    }
    AI003_METADATA_READ_EXIT_STATUS=0

The requested touch was performed only in the disposable copy. The direct provenance helper there produced:

    {
      "firstFingerprint": "sha256:be7ad7bc21254303b6dd61770b503164acae846d0af92d43b5e375cc9dc58dda",
      "secondFingerprint": "sha256:85e723479367a07217b2cda162ca7d5ce3c9363484a474f3454cf958719eadda",
      "unchangedCheck": false,
      "changedDependencyCheck": true,
      "trustLanes": [
        { "source": "intent_signals", "trustLane": "explicit_author", "decays": false },
        { "source": "frontmatter", "trustLane": "frontmatter", "decays": false },
        { "source": "body", "trustLane": "body", "decays": true },
        { "source": "examples", "trustLane": "examples", "decays": true },
        { "source": "references", "trustLane": "local_docs", "decays": true },
        { "source": "assets", "trustLane": "derived_local", "decays": true },
        { "source": "source_docs", "trustLane": "derived_generated", "decays": true },
        { "source": "key_files", "trustLane": "derived_generated", "decays": true }
      ]
    }
    PROVENANCE_HELPER_EXIT_STATUS=0

The helper evidence is positive, but the live stored fields remained null and a daemon reindex could not be observed.

Result: BLOCKED.

## AI-004: DF/IDF Corpus Stats Active-Only

Scenario file read: .opencode/skills/system-skill-advisor/manual-testing-playbook/auto-indexing/corpus-df-idf.md.

The live status and read-only database checks produced:

    advisor_status
    {
      "status": "error",
      "error": "backend unavailable: daemon launcher exited with code 0",
      "exitCode": 75
    }

    sqlite3 .tables
    schema_version        skill_graph_metadata  vec_768
    skill_docs            skill_nodes           vec_metadata
    skill_edges           vec_1024

    sqlite3 SELECT COUNT(*) FROM skill_docs;
    88

    SQLITE_IDF_LOOKUP_EXIT_STATUS=0

No IDF-specific SQLite table was present. The current checkout has no z_archive or z-future directory, so the archived-touch variant had no fixture.

The active-only corpus helper was exercised in the disposable copy with active, archived and future documents plus three rapid schedules:

    {
      "documentCount": 2,
      "terms": [
        { "term": "alpha", "documentFrequency": 1, "idf": 1.405465 },
        { "term": "beta", "documentFrequency": 1, "idf": 1.405465 },
        { "term": "route", "documentFrequency": 2, "idf": 1 }
      ],
      "routeDf": 2,
      "hasArchivedOnly": false,
      "hasFutureOnly": false,
      "debouncedCallbackCount": 1,
      "flushDocumentCount": 2
    }
    DF_IDF_HELPER_EXIT_STATUS=0

The helper behaved as expected. The scenario's daemon recomputation, active-skill touches and archived-skill touch were not observed.

Result: BLOCKED.

## AI-005: Anti-Stuffing and Cardinality Caps

Scenario file read: .opencode/skills/system-skill-advisor/manual-testing-playbook/auto-indexing/anti-stuffing.md.

In the disposable copy I generated adversarial-fixture and punctuation-fixture, each with 1000 repeated body values, then touched both files:

    1184 /private/tmp/skill-advisor-playbook-codex.LNdofp/.opencode/skills/adversarial-fixture/SKILL.md
    185 /private/tmp/skill-advisor-playbook-codex.LNdofp/.opencode/skills/punctuation-fixture/SKILL.md
    1369 total

Before a daemon reindex, the copied derived block was unchanged:

    {
      "triggerCount": 60,
      "keywordCount": 17,
      "provenance_fingerprint": null,
      "trust_lane": null
    }
    AI005_FIXTURE_DERIVED_READ_EXIT_STATUS=0

The direct anti-stuffing helper did run:

    {
      "normal": {
        "triggerCount": 2,
        "keywordCount": 3,
        "demotion": 1,
        "rejected": false,
        "diagnostics": []
      },
      "repeated": {
        "triggerCount": 1,
        "keywordCount": 1,
        "demotion": 0.6666666666666667,
        "rejected": false,
        "diagnostics": [
          "REPETITION_DENSITY_DEMOTED:0.333",
          "TRIGGER_CAP_APPLIED:24",
          "KEYWORD_CAP_APPLIED:48"
        ]
      },
      "punctuation": {
        "triggerCount": 4,
        "keywordCount": 4,
        "demotion": 0.6666666666666667,
        "rejected": false,
        "diagnostics": [
          "REPETITION_DENSITY_DEMOTED:0.333",
          "TRIGGER_CAP_APPLIED:24",
          "KEYWORD_CAP_APPLIED:48"
        ]
      }
    }
    ANTI_STUFFING_HELPER_EXIT_STATUS=0

The hard-reject control also returned:

    {
      "triggerCount": 1,
      "keywordCount": 1,
      "demotion": 0,
      "rejected": true,
      "diagnostics": [
        "REPETITION_DENSITY_REJECTED:1.000",
        "TRIGGER_CAP_APPLIED:24",
        "KEYWORD_CAP_APPLIED:48"
      ]
    }
    ANTI_STUFFING_HARD_REJECT_EXIT_STATUS=0

The disposable fallback recommend call returned no recommendation:

    {
      "status": "ok",
      "degraded": true,
      "source": "local-scorer",
      "data": {
        "recommendations": [],
        "effectiveThresholds": {
          "confidenceThreshold": 0.8,
          "uncertaintyThreshold": 0.35,
          "confidenceOnly": false
        }
      }
    }
    RECOMMEND_EXIT_STATUS=0

There was no reindexed fixture and no normal-versus-stuffed daemon ranking comparison.

Result: BLOCKED.

## AI-006: Doc-Frontmatter Trigger Harvest

Scenario file read: .opencode/skills/system-skill-advisor/manual-testing-playbook/auto-indexing/doc-frontmatter-harvest.md.

The live trusted scan was not run because it would mutate the live database. Its CLI equivalent was attempted against the disposable copy with --trusted, where it returned exit 75 because the daemon could not bind. The untrusted live control returned:

    {
      "status": "error",
      "error": "skill_graph_scan requires --trusted or SYSTEM_SKILL_ADVISOR_CLI_TRUSTED=1",
      "exitCode": 64
    }
    TRUST_GATE_SCAN_EXIT_STATUS=64

The live read-only count was:

    88
    SQLITE_SKILL_DOC_COUNT_EXIT_STATUS=0

The fallback recommend call for the doc-specific prompt returned:

    {
      "status": "ok",
      "degraded": true,
      "source": "local-scorer",
      "data": {
        "recommendations": [],
        "effectiveThresholds": {
          "confidenceThreshold": 0.8,
          "uncertaintyThreshold": 0.35,
          "confidenceOnly": false
        }
      }
    }
    AI006_RECOMMEND_EXIT_STATUS=0

The required trigger-index boundary check did run. I filtered the actual JSON only to show skill-doc paths:

    {
      "candidatePhraseCount": 1478,
      "normalizedQuery": "coverage graph script exit codes",
      "skillDocResults": [
        ".opencode/skills/system-deep-loop/runtime/references/script-interface-contract.md",
        ".opencode/skills/.state/advisor/README.md",
        ".opencode/skills/mcp-code-mode/scripts/README.md",
        ".opencode/skills/mcp-tooling/mcp-aside-devtools/examples/README.md",
        ".opencode/skills/mcp-tooling/mcp-aside-devtools/scripts/README.md",
        ".opencode/skills/mcp-tooling/mcp-chrome-devtools/examples/README.md",
        ".opencode/skills/mcp-tooling/mcp-chrome-devtools/feature-catalog/automation-and-performance/animation-testing.md",
        ".opencode/skills/mcp-tooling/mcp-chrome-devtools/feature-catalog/automation-and-performance/performance-baseline.md",
        ".opencode/skills/mcp-tooling/mcp-chrome-devtools/feature-catalog/dom-and-screenshot/eval-javascript.md",
        ".opencode/skills/mcp-tooling/mcp-click-up/examples/README.md",
        ".opencode/skills/mcp-tooling/mcp-click-up/feature-catalog/mcp-low-priority/get-dependencies.md",
        ".opencode/skills/mcp-tooling/mcp-click-up/feature-catalog/mcp-low-priority/manage-webhooks.md",
        ".opencode/skills/mcp-tooling/mcp-figma/examples/README.md",
        ".opencode/skills/mcp-tooling/mcp-mobbin/scripts/README.md",
        ".opencode/skills/mcp-tooling/mcp-notion/scripts/README.md",
        ".opencode/skills/mcp-tooling/mcp-obsidian/assets/plugins/iconic/iconic-rules.full.md",
        ".opencode/skills/mcp-tooling/mcp-obsidian/changelog/v0.13.0.0.md",
        ".opencode/skills/mcp-tooling/mcp-obsidian/changelog/v0.23.0.0.md"
      ],
      "resultCount": 20,
      "truncated": true
    }
    TRIGGER_INDEX_FILTER_EXIT_STATUS=0

The boundary returned 18 skill-doc paths in the filtered result instead of zero. This is an observed critical failure independent of the unavailable harvest scan.

Result: FAIL.

## LC-001: Derived-Lane-Only Age Haircut

Scenario file read: .opencode/skills/system-skill-advisor/manual-testing-playbook/lifecycle-routing/age-haircut.md.

The current old and recent candidates were identified with:

    2026-08-29T19:13:10+0200 .opencode/skills/mcp-tooling/mcp-magicpath/SKILL.md
    2026-09-11T22:12:25+0200 .opencode/skills/cli-external-orchestration/cli-opencode/SKILL.md
    LC001_STAT_EXIT_STATUS=0

The old-prompt fallback returned no recommendation:

    {
      "status": "ok",
      "degraded": true,
      "source": "local-scorer",
      "data": {
        "recommendations": [],
        "effectiveThresholds": {
          "confidenceThreshold": 0.8,
          "uncertaintyThreshold": 0.35,
          "confidenceOnly": false
        }
      }
    }
    LC001_OLD_RECOMMEND_EXIT_STATUS=0

The recent-prompt fallback began with:

    {
      "status": "ok",
      "degraded": true,
      "source": "local-scorer",
      "data": {
        "recommendations": [
          {
            "skillId": "cli-external-orchestration",
            "confidence": 0.95,
            "uncertainty": 0.15,
            "reason": "Matched: !cross-ai(keyword), !graph:sibling(sk-code,0.4), !opencode cli(keyword), !opencode cli(signal), cli(name) [disambiguation: explicit executor delegation]"
          }
        ]
      }
    }

LC001_RECENT_RECOMMEND_EXIT_STATUS=0 was observed. Neither response had laneBreakdown, rawScore or weightedScore.

As a supplemental direct helper check, an old derived score of 1 became 0.224447, the recent score became 0.992328 and the explicit_author score stayed 1:

    {
      "oldDerived": { "trustLane": "derived_generated", "score": 0.224447 },
      "oldAuthor": { "trustLane": "explicit_author", "score": 1 },
      "recentDerived": { "trustLane": "derived_generated", "score": 0.992328 },
      "multiplierFormula": 0.22444664626634234
    }
    AGE_HAIRCUT_HELPER_EXIT_STATUS=0

The daemon lane attribution comparison was not available.

Result: BLOCKED.

## LC-002: Asymmetric Supersession Redirects

Scenario file read: .opencode/skills/system-skill-advisor/manual-testing-playbook/lifecycle-routing/supersession.md.

The live metadata search found no pair:

    RG_SUPERSESSION_EXIT_STATUS=1

The mapped status call was unavailable with exit 75. A synthetic pair was exercised against the direct lifecycle helper in the disposable copy:

    {
      "genericTop": "sk-x-v2",
      "explicitTop": "sk-x-v1",
      "successorRedirectFrom": [
        "sk-x-v1"
      ],
      "successorRedirectTo": null
    }
    SUPERSESSION_HELPER_EXIT_STATUS=0

The generic prompt selected the successor by default. An explicit old-name prompt selected the deprecated skill with redirect_to: "sk-x-v2". The live CLI response path could not be checked and no known live pair existed.

Result: BLOCKED.

## LC-003: Archive and Future Skills Indexed But Not Routed

Scenario file read: .opencode/skills/system-skill-advisor/manual-testing-playbook/lifecycle-routing/archive-handling.md.

The required directories were absent:

    .opencode/skills/z_archive: absent
    .opencode/skills/z-future: absent

The historical prompt was still run through the normal CLI fallback:

    {
      "status": "ok",
      "degraded": true,
      "source": "local-scorer",
      "data": {
        "recommendations": [
          {
            "skillId": "cli-external-orchestration",
            "confidence": 0.95,
            "uncertainty": 0.2,
            "reason": "Matched: dispatch, external(name) [disambiguation: explicit executor delegation]"
          }
        ],
        "effectiveThresholds": {
          "confidenceThreshold": 0.8,
          "uncertaintyThreshold": 0.35,
          "confidenceOnly": false
        }
      }
    }
    LC003_RECOMMEND_EXIT_STATUS=0

The direct archive policy helper was also run against synthetic active, archived and future paths. It returned structurallyIndexed: true for all three, defaultRoutable: false for archived and future and corpusEligible: ["active"].

The live visibility and exclusion checks had no archive or future fixture and no daemon response.

Result: BLOCKED.

## LC-004: Schema v1 to v2 Additive Backfill

Scenario file read: .opencode/skills/system-skill-advisor/manual-testing-playbook/lifecycle-routing/schema-migration.md.

The live schema read was read-only:

    0
    21
    LC004_LIVE_SCHEMA_READ_EXIT_STATUS=0

The live daemon status was unavailable. The CLI manifest has no separate migration command. The documented compiled schema-migration helper was exercised against a disposable v1 metadata object and then rolled back:

    {
      "upgraded": {
        "changed": true,
        "routableDuringTransition": true,
        "mixedV1": { "schemaVersion": 1, "derived": null, "routable": true },
        "mixedV2": { "schemaVersion": 2, "routable": true }
      },
      "rollback": {
        "removedDerived": true,
        "schemaVersion": 1,
        "reindexRequired": true,
        "afterRollback": {
          "schema_version": 1,
          "skill_id": "alpha",
          "intent_signals": ["legacy route"],
          "retained_v1": { "stable": true }
        }
      },
      "v1FieldsPreservedAfterMigration": true,
      "v1FieldsPreservedAfterRollback": true
    }
    SCHEMA_MIGRATION_FIXTURE_EXIT_STATUS=0

The helper behavior was positive, but the scenario's required startup migration against a v1 workspace was not executed because the daemon could not start. The helper result is not promoted to a whole-scenario PASS.

Result: BLOCKED.

## LC-005: Lifecycle-Level Rollback

Scenario file read: .opencode/skills/system-skill-advisor/manual-testing-playbook/lifecycle-routing/rollback-lifecycle.md.

The rollback mutation was performed only in the disposable copy through the documented compiled rollback helper. The pre-mutation metadata had no redirect fields. The mutation added schema_version: 2, derived, redirect_to: "beta" and redirect_from: ["alpha"]. The rollback returned:

    {
      "result": {
        "removedDerived": true,
        "schemaVersion": 1,
        "reindexRequired": true
      },
      "post": {
        "schema_version": 1,
        "skill_id": "alpha",
        "intent_signals": ["author route"],
        "retained_author_field": { "stable": true },
        "redirect_to": "beta",
        "redirect_from": ["alpha"]
      },
      "POST_EQUALS_PRE_MUTATION": false,
      "RESIDUAL_REDIRECT_FIELDS": "redirect_to,redirect_from"
    }
    ROLLBACK_FIXTURE_EXIT_STATUS=0

The derived block and schema version were rolled back, but both lifecycle redirect fields remained. This contradicts the scenario's expected atomic rollback with no residual redirect metadata.

Result: FAIL.

## SC-001: Five-Lane Analytical Fusion

Scenario file read: .opencode/skills/system-skill-advisor/manual-testing-playbook/scorer-fusion/five-lane-fusion.md.

The mapped advisor_status call returned exit 75. The exact multi-lane prompt was then sent through the normal CLI fallback. Its output was the shared status: "ok", degraded: true, source: "local-scorer" payload with these three recommendations:

    system-spec-kit  confidence=0.95 uncertainty=0.2
    memory:save      confidence=0.88 uncertainty=0.15
    command-memory-save confidence=0.95 uncertainty=0.15
    SC001_RECOMMEND_EXIT_STATUS=0

The output contained no laneBreakdown, per-lane weights or aggregate score. The requested topK: 3 happened to return three entries, but fusion arithmetic could not be inspected.

Result: BLOCKED.

## SC-002: Registry Projection Drift Guard and workflowMode Publication

Scenario file read: .opencode/skills/system-skill-advisor/manual-testing-playbook/scorer-fusion/projection.md.

The commit prompt fallback returned sk-git with confidence 0.95 and uncertainty 0.23, but no attribution fields. The deep-loop fallback returned:

    {
      "status": "ok",
      "degraded": true,
      "source": "local-scorer",
      "data": {
        "recommendations": [
          {
            "skillId": "system-deep-loop",
            "confidence": 0.95,
            "uncertainty": 0.15,
            "reason": "Matched: !deep review(keyword), !deep review(signal), !review loop(keyword), !review loop(signal), deep(name) [Candidate-3 deep routing: system-deep-loop review MED]"
          },
          {
            "skillId": "sk-code",
            "confidence": 0.85,
            "uncertainty": 0.23,
            "reason": "Matched: !intent:review, !review, !review(keyword), !review(multi), review [disambiguation: deep-review reserved for this prompt]"
          },
          {
            "skillId": "command-spec-kit-deep-review",
            "confidence": 0.95,
            "uncertainty": 0.3,
            "reason": "Matched: command_penalty, deep(name), loop, review(name), run"
          }
        ]
      }
    }
    SC002_DEEP_RECOMMEND_EXIT_STATUS=0

The fallback response did not publish workflowMode. The generated route itself did:

    {
      "hubId": "system-deep-loop",
      "action": "route",
      "selectionKind": "single",
      "targets": [
        {
          "backendKind": "runtime-loop-type",
          "packetId": "deep-review",
          "packetKind": "workflow",
          "runtimeDiscriminator": "review",
          "skillId": "system-deep-loop",
          "workflowMode": "review"
        }
      ],
      "generation": 4
    }
    COMPILED_ROUTE_DEEP_EXIT_STATUS=0

The exact routing drift guard passed:

    Test Files  1 passed (1)
    Tests  7 passed (7)
    ROUTING_DRIFT_GUARD_EXIT_STATUS=0

The mapped validation call returned:

    {
      "status": "error",
      "error": "backend unavailable: daemon launcher exited with code 0",
      "exitCode": 75
    }
    SC002_ADVISOR_VALIDATE_EXIT_STATUS=75

The projection and drift subchecks ran. The daemon-backed recommendation attribution, workflow publication and validation parity slice did not.

Result: BLOCKED.

## SC-003: Top-2 Ambiguity Window

Scenario file read: .opencode/skills/system-skill-advisor/manual-testing-playbook/scorer-fusion/ambiguity.md.

The first current ambiguity-corpus prompt was used: /deep:review :auto the current phase folder for 10 iterations. The normal CLI fallback returned:

    {
      "status": "ok",
      "degraded": true,
      "source": "local-scorer",
      "data": {
        "recommendations": [
          {
            "skillId": "deep-review",
            "confidence": 0.95,
            "uncertainty": 0.15,
            "reason": "Matched: !/deep:review(explicit), !deep:review(explicit), auto~, deep(name), review(name) [command-normalized: command-spec-kit-deep-review->deep-review]"
          },
          {
            "skillId": "system-spec-kit",
            "confidence": 0.84,
            "uncertainty": 0.2,
            "reason": "Matched: !folder, !graph:enhances(sk-code,0.3), folder, spec(name)"
          }
        ]
      }
    }
    SC003_RECOMMEND_EXIT_STATUS=0

Both candidates were exposed, but neither had ambiguousWith. The confidence gap was 0.11, and the degraded response had no score gap or ambiguity metadata. This is a failed ambiguity result on the public fallback path.

The direct ambiguity helper control did produce the expected reciprocal tags:

    {
      "isAmbiguous": true,
      "result": [
        { "skill": "alpha", "ambiguousWith": ["beta"] },
        { "skill": "beta", "ambiguousWith": ["alpha"] },
        { "skill": "gamma", "passes_threshold": false }
      ]
    }
    AMBIGUITY_HELPER_EXIT_STATUS=0

Result: FAIL.

This failure is on the degraded CLI response. The direct helper control is supplemental.

## SC-004: Lane Contribution Attribution

Scenario file read: .opencode/skills/system-skill-advisor/manual-testing-playbook/scorer-fusion/lane-attribution.md.

The exact prompt was run once with attribution and once without it. Both exit statuses were 0 and both returned the same degraded payload:

    {
      "status": "ok",
      "degraded": true,
      "source": "local-scorer",
      "data": {
        "recommendations": [
          {
            "skillId": "sk-git",
            "confidence": 0.95,
            "uncertainty": 0.15,
            "reason": "Matched: !graph:sibling(sk-code,0.4), !pull, !pull request(keyword), !pull request(signal), git(name)"
          },
          {
            "skillId": "sk-code",
            "confidence": 0.95,
            "uncertainty": 0.23,
            "reason": "Matched: !graph:sibling(sk-git,0.4), !intent:review, !review, !review(keyword), !review(multi)"
          }
        ]
      }
    }
    SC004_WITH_ATTRIBUTION_EXIT_STATUS=0
    SC004_WITHOUT_ATTRIBUTION_EXIT_STATUS=0

The requested topK: 1 was ignored. laneBreakdown and why_recommended were absent in the attribution call, and the non-attribution call returned identical output. The reason strings contain prompt phrases such as pull request.

Result: FAIL.

## SC-005: Lane-by-Lane Ablation Protocol

Scenario file read: .opencode/skills/system-skill-advisor/manual-testing-playbook/scorer-fusion/ablation.md.

The exact CLI equivalent of the retired MCP validation call was run:

    $ node .opencode/bin/skill-advisor.cjs advisor_validate --json '{"confirmHeavyRun":true,"skillSlug":null}' --format json
    {
      "status": "error",
      "error": "backend unavailable: daemon launcher exited with code 0",
      "exitCode": 75
    }
    SC005_ADVISOR_VALIDATE_EXIT_STATUS=75

No baseline or ablation slice was returned. Therefore no lane was disabled through the advisor, no accuracy comparison was possible and no post-ablation status comparison was possible.

Result: BLOCKED.

## Supplemental checks

These commands exercised implementation helpers or isolated test suites without changing repository files. They do not override the scenario verdicts above:

| Command | Observed output | Exit status |
|---|---|---:|
| npm --prefix .opencode/skills/system-skill-advisor/runtime test -- lifecycle-derived-metadata.vitest.ts | Test Files 1 passed (1), Tests 16 passed (16) | 0 |
| npm --prefix .opencode/skills/system-skill-advisor/runtime test -- native-scorer.vitest.ts | Test Files 1 passed (1), Tests 22 passed (22) | 0 |
| npm --prefix .opencode/skills/system-skill-advisor/runtime test -- skill-doc-harvest.vitest.ts | Test Files 1 passed (1), Tests 12 passed (12) | 0 |
| npm --prefix .opencode/skills/system-skill-advisor/runtime test -- handlers/advisor-recommend.vitest.ts | Test Files 1 passed (1), Tests 22 passed (22) | 0 |
| npm --prefix .opencode/skills/system-skill-advisor/runtime test -- route-exclusions.vitest.ts | Test Files 1 passed (1), Tests 10 passed (10) | 0 |
| npm --prefix .opencode/skills/system-skill-advisor/runtime test -- metadata-sanitizer-entities-guard.vitest.ts | Test Files 1 passed (1), Tests 4 passed (4) | 0 |
| npm --prefix .opencode/skills/system-skill-advisor/runtime test -- cache/df-idf-cache.vitest.ts | Test Files 1 passed (1), Tests 2 passed (2) | 0 |
| npm --prefix .opencode/skills/system-skill-advisor/runtime test -- compat/redirect-metadata.vitest.ts | Test Files 1 passed (1), Tests 4 passed (4) | 0 |
| npm --prefix .opencode/skills/system-skill-advisor/runtime test -- migration-lineage-identity.vitest.ts | Test Files 1 passed (1), Tests 1 passed (3 skipped) | 0 |
| npm --prefix .opencode/skills/system-skill-advisor/runtime test -- semantic-shadow-ablation.vitest.ts | Test Files 1 passed (1), Tests 2 passed (2 skipped) | 0 |
| npm --prefix .opencode/skills/system-skill-advisor/runtime test -- lane-attribution.test.ts | No test files found, exiting with code 1 | 1 |

The passing suites show that several helper paths remain intact. The failed filename-filter command was not counted as a scenario result. The daemon transport, CLI fallback projection and public sanitizer observations above are the evidence relevant to this run.
