# ripgrep re-test at the host version

```
ripgrep 15.2.0

## section 2.5 hazard
rg --json --count: exit 0, first line: specs/sk-doc/061-skilled-release-changelog/002-changelog-findability/plan.md:2
rg --count --json: exit 0, first line: {"type":"begin","data":{"path":{"text":"specs/sk-doc/061-skilled-release-changelog/002-changelog-findability/plan.md"}}}

## section 4 worked example (phrase: trigger index generator, roots: specs .skilled)
2.1 structured: exit 0, 49 JSONL records
2.2 path-only: exit 0, 15 paths
2.3 count: exit 0, 15 lines: specs/sk-doc/061-skilled-release-changelog/002-changelog-findability/plan.md:2 specs/system-speckit/033-system-speckit-v4/017-memory-database-decommission/spec.md:1 specs/system-speckit/033-system-speckit-v4/017-memory-database-decommission/001-trigger-index-replacement/spec.md:1 specs/system-speckit/033-system-speckit-v4/017-memory-database-decommission/001-trigger-index-replacement/implementation-summary.md:1 specs/system-speckit/033-system-speckit-v4/019-memory-decommission-branch-landing/spec.md:1 specs/system-speckit/033-system-speckit-v4/032-recorded-findings-closure/013-gate1-instruction-parity/spec.md:1 specs/system-speckit/033-system-speckit-v4/021-decommission-debt-and-cli-nesting/003-retrieval-coverage-alignment/implementation-summary.md:1 specs/system-speckit/033-system-speckit-v4/021-decommission-debt-and-cli-nesting/research/lineages/sonnet5-high-research/deep-research-strategy.md:1 specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/001-deep-research/research/lineages/luna/iterations/iteration-004.md:1 .skilled/skills/system-spec-kit/runtime/cli/retrieval/README.md:1 specs/system-speckit/033-system-speckit-v4/030-spec-kit-simplification-research/001-ripgrep-search-system/research/lineages/glm-5-3-flash-ripgrep-search/iterations/iteration-009.md:2 specs/system-speckit/033-system-speckit-v4/026-runtime-code-standards-research/research/lineages/deepseek-v4-flash-code-standards/iterations/iteration-009.md:1 specs/system-speckit/033-system-speckit-v4/030-spec-kit-simplification-research/001-ripgrep-search-system/research/lineages/glm-5-3-flash-ripgrep-search-r3-aborted/iteration-001.md:1 specs/system-speckit/033-system-speckit-v4/030-spec-kit-simplification-research/001-ripgrep-search-system/research/lineages/glm-5-3-flash-ripgrep-search-r3/iterations/iteration-002.md:1 .skilled/skills/system-spec-kit/references/retrieval/retrieval-conventions.md:2
2.4 context: exit 0, 121 JSONL records
no-hit with the literal `zzq-no-such-phrase-here`: exit 0, 1 path, because retrieval-conventions.md itself now quotes that phrase in its worked example
no-hit with a phrase built at run time (zzq-absent-<epoch>-phrase): exit 1, 0 lines
missing root: exit 2, stderr: rg: does-not-exist-root: No such file or directory (os error 2)
malformed regexp: exit 2, stderr: rg: regex parse error:
```
