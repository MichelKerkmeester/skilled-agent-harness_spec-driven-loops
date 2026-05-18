# Iteration 015 — Track 5: Apache 2.0 + license references

## Findings

### Finding 1: Main repository license badge
- **Location**: README.md line 4
- **Context**: `[![License](https://img.shields.io/github/license/MichelKerkmeester/opencode--spec-kit-skilled-agent-orchestration?style=for-the-badge&color=7bd88f&labelColor=222222)](LICENSE)`
- **License cited**: Links to LICENSE file (no explicit license name in badge)
- **Verification**: ✅ **ACCURATE** - The LICENSE file at repo root contains MIT License
- **Cross-check**: LICENSE file confirms MIT License for the main repository

### Finding 2: CocoIndex Code license declaration
- **Location**: README.md line 58
- **Context**: `|| **🔍 CocoIndex Code**   | [Forked](.opencode/skills/mcp-coco-index/NOTICE) from [cocoindex-io/cocoindex-code](https://github.com/cocoindex-io/cocoindex-code) (Apache 2.0) - semantic code search via vector embeddings and natural-language discovery across 28+ languages |`
- **License cited**: Apache 2.0
- **Verification**: ✅ **ACCURATE** - The NOTICE file at `.opencode/skills/mcp-coco-index/NOTICE` confirms Apache 2.0
- **Cross-check**: NOTICE file states "License: Apache License, Version 2.0 (see LICENSE)" and references the original cocoindex-io/cocoindex-code repository

### Non-finding matches
The remaining 15 matches are occurrences of the word "license" in various contexts (code comments, variable names, descriptive text) but do not constitute actual license declarations or citations.

## Summary
- **Total license declarations found**: 2
- **Accurate citations**: 2 (100%)
- **Inaccurate citations**: 0
- **NOTICE files found**: 1 (CocoIndex)

ITER_015_COMPLETE: 2 findings, newInfoRatio=0.00
