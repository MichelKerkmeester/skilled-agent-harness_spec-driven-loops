# Iteration 002 — Security

Session: `fanout-fable-2-1781112180955-4japyt` | Dimension: security | Status: complete

## Scope Reviewed

Secret/credential exposure sweep across the whole packet (token patterns: `sk-ant-*`, `ghp_*`, `xoxb-*`, `AKIA*`, bearer values); machine-local path disclosure; git-exposure analysis via `.gitignore`; independent re-verification of 002-memory-write-safety fixture-safety claims (CHK-030/CHK-065).

## Findings

### F004 — P2 — Machine-local home paths in dispatch artifacts escape the `*.log` ignore rule

Research and review dispatch byproducts embed `/Users/michelkerkmeester/...` absolute paths: `research/006-peck-source-deep-mining/prompts/iteration-009.err` through `iteration-023.err`, `research/005-live-rescope-coco-purge/prompts/iteration-066.err`/`iteration-069.err`, deep-research state/config/dashboard files under `010-mcp-to-cli-tool-transition/00X-*-cli-research/research/**` (e.g. [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/010-mcp-to-cli-tool-transition/001-spec-memory-cli/000-spec-memory-cli-research/research/gap-audit/lineages/gpt-gap/deep-research-config.json:1]), and review lineage logs (`review/lineages/gpt-*/logs/fanout-lineage.out`). The repo `.gitignore` ignores `*.log` [SOURCE: .gitignore:125] and `external/` [SOURCE: .gitignore:168] but has NO rule for `.out`, `.err`, or research-state JSON/JSONL, so these artifacts are exposed in a repository whose working title is "Public". Disclosure is limited to the operator username and local layout — no credentials — hence advisory severity. (Caveat: per-file tracking state could not be confirmed in-sandbox; classification rests on ignore-rule analysis.)
`finding_class: information-disclosure-advisory`

## Negative Results (verified clean)

- No live-looking tokens anywhere in the packet: zero hits for `sk-ant-` with long tails, `ghp_*`, `xoxb-*`, and zero non-`EXAMPLE` `AKIA*` keys.
- CHK-030 fixture-safety evidence independently re-verified: the scrubber test uses the canonical AWS documentation key [SOURCE: .opencode/skills/system-spec-kit/mcp_server/tests/secret-scrubber.vitest.ts:25], matching the checklist claim [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-write-safety/checklist.md:100].
- CHK-065 ("patterns conservative against repo false positives") consistent with sweep results: all `sk-*`/bearer matches in the packet are prose or pattern documentation [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-write-safety/checklist.md:115].

## Adversarial Self-Check

No P0 candidates. Considered raising F004 to P1 (public-repo exposure): rejected because content is non-credential (username + directory layout) and the sibling artifacts predate this packet's scope; advisory P2 with a remediation suggestion (extend ignore rules to `prompts/*.err`, `prompts/*.out`, `logs/*.out`) is proportionate.

## Next Focus

Iteration 3 — traceability: `spec_code` + `checklist_evidence` core protocols, resource-map coverage gate (mandatory pass), overlay protocols.

Review verdict: PASS
