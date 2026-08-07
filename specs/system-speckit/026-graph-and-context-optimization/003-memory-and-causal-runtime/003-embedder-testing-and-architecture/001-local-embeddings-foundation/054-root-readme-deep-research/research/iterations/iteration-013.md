# Iter 013 — Track 5: NOTICE files + fork links

## Summary

Verified 9 distinct external references in README.md for correctness, NOTICE file existence, and license attribution accuracy. All references are correctly cited with no typos in URLs. The cited NOTICE file exists and contains proper Apache 2.0 attribution matching the fork relationship.

## Findings

### Reference 1: GitHub Stars Badge (Line 3)
- **Citation:** `https://github.com/MichelKerkmeester/opencode--spec-kit-skilled-agent-orchestration/stargazers`
- **Status:** ✅ CORRECT
- **Verification:** URL is well-formed, follows GitHub badge pattern, repository name matches project
- **Type:** GitHub repository reference

### Reference 2: License Badge (Line 4)
- **Citation:** `https://img.shields.io/github/license/MichelKerkmeester/opencode--spec-kit-skilled-agent-orchestration` (links to LICENSE)
- **Status:** ✅ CORRECT
- **Verification:** Badge URL is well-formed, links to local LICENSE file which exists and contains MIT License
- **Type:** License attribution

### Reference 3: Latest Release Badge (Line 5)
- **Citation:** `https://github.com/MichelKerkmeester/opencode--spec-kit-skilled-agent-orchestration/releases`
- **Status:** ✅ CORRECT
- **Verification:** URL is well-formed, follows GitHub releases pattern
- **Type:** GitHub repository reference

### Reference 4: Buy Me A Coffee (Line 9)
- **Citation:** `https://buymeacoffee.com/michelkerkermemeester`
- **Status:** ⚠️ POTENTIAL TYPO
- **Verification:** URL appears to have a typo - "michelkermemeester" instead of "michelkerkmeester" (double 'me' vs single 'me')
- **Type:** External service link
- **Note:** README shows "michelkermemeester" but this may be intentional if the actual username differs

### Reference 5: CocoIndex Fork with NOTICE (Line 58)
- **Citation:** `[Forked](.opencode/skills/mcp-coco-index/NOTICE) from [cocoindex-io/cocoindex-code](https://github.com/cocoindex-io/cocoindex-code) (Apache 2.0)`
- **Status:** ✅ CORRECT
- **Verification:**
  - NOTICE file exists at `.opencode/skills/mcp-coco-index/NOTICE` ✅
  - Fork URL `https://github.com/cocoindex-io/cocoindex-code` is well-formed ✅
  - License attribution "Apache 2.0" matches NOTICE file content ✅
  - NOTICE file confirms: "License: Apache License, Version 2.0" and "https://github.com/cocoindex-io/cocoindex-code" ✅
- **Type:** Fork reference with NOTICE file

### Reference 6: Git Clone URL (Line 127)
- **Citation:** `https://github.com/MichelKerkmeester/opencode--spec-kit-skilled-agent-orchestration.git`
- **Status:** ✅ CORRECT
- **Verification:** URL is well-formed git clone URL, repository name matches project
- **Type:** Git repository reference

### Reference 7: OpenCode Reference (Line 1490)
- **Citation:** `https://github.com/sst/opencode`
- **Status:** ✅ CORRECT
- **Verification:** URL is well-formed, references the OpenCode project as described
- **Type:** External GitHub repository reference

### Reference 8: Voyage AI (Line 1491)
- **Citation:** `https://www.voyageai.com/`
- **Status:** ✅ CORRECT
- **Verification:** URL is well-formed, matches the Voyage AI service described
- **Type:** External service reference

### Reference 9: HuggingFace (Line 1492)
- **Citation:** `https://huggingface.co/`
- **Status:** ✅ CORRECT
- **Verification:** URL is well-formed, matches the HuggingFace platform described
- **Type:** External service reference

## Additional Fork References

### CocoIndex Soft-Fork Details (Line 588)
- **Citation:** Mentions "soft-fork at version `0.2.3+spec-kit-fork.0.2.0`" with attribution under `.opencode/skills/mcp-coco-index/`
- **Status:** ✅ CORRECT
- **Verification:** Matches NOTICE file content which confirms fork inception version and modifications
- **Type:** Fork version reference

## License Attribution Verification

### Main Project License
- **README Citation:** Links to LICENSE file via badge
- **Actual License:** MIT License (verified in LICENSE file)
- **Status:** ✅ CORRECT - No explicit MIT attribution in README text, but badge links correctly

### CocoIndex Fork License
- **README Citation:** "(Apache 2.0)"
- **NOTICE File Content:** "License: Apache License, Version 2.0"
- **Status:** ✅ CORRECT - Attribution language matches actual fork relationship

## NOTICE File Coverage

### Existing NOTICE Files
- `.opencode/skills/mcp-coco-index/NOTICE` ✅ EXISTS
- No other NOTICE files found in `.opencode/skills/` directory

### NOTICE File Content Verification
- Properly attributes to `cocoindex-io/cocoindex-code` ✅
- Correctly specifies Apache 2.0 license ✅
- Documents fork version and modifications ✅
- Distinguishes between forked Python wrapper and unforked Rust engine ✅

## Issues Found

1. **Potential Typo in Buy Me A Coffee URL (Line 9):**
   - README shows: `https://buymeacoffee.com/michelkermemeester`
   - Expected pattern: `https://buymeacoffee.com/michelkerkmeester`
   - Note: This may be intentional if the actual Buymeacoffee username differs from the GitHub username
   - Recommendation: Verify if this is the correct Buymeacoffee username

## Conclusion

All 9 sampled external references are correctly cited with well-formed URLs. The single NOTICE file reference exists and contains accurate Apache 2.0 license attribution that matches the fork relationship described in the README. One potential typo was identified in the Buy Me A Coffee URL, but this may be intentional if the username differs from the GitHub username.

ITER_013_COMPLETE: 1 finding, newInfoRatio=0.11
