# Iteration 002 — RQ2 Output Verification Pipeline

## Focus

RQ2 — Output Verification Pipeline. Identify 3-5 reusable patterns from smallcode's verification engine (`src/governor/verifier.ms`, `src/governor/hard_fail.ms`, `bin/governor.js`) for integration into our skill tree (cli-devin, system-spec-kit post-dispatch validation, deep-loop iter contracts).

## Actions Taken

1. Read preflight context-card §RQ2 (lines 103-269) to understand the structured pattern map of the verification pipeline (compile → execute → smoke-test → lint) + confidence scoring + hard-fail gatekeeper, with ~45 prior citations to smallcode source files.

2. Read `external/smallcode-master/src/governor/verifier.ms` end-to-end (314 lines) to extract the actual implementation patterns for the 5-stage verification pipeline, structural validation, confidence scoring, and language-specific compile/execute commands.

3. Read `external/smallcode-master/src/governor/hard_fail.ms` (105 lines) to understand the hard-fail gatekeeper logic, GovernorAction enum (Accept/Retry/HardFail), and integration with the verifier and tool scorer.

4. Read `external/smallcode-master/bin/governor.js` (238 lines) to understand how verification is invoked in the agent loop, including the decompose strategy (pickDecomposeStrategy) that replaces hard-fail with problem decomposition after max retries.

5. Mapped patterns to candidate target paths in our skill tree: cli-devin/references/ (new ref docs), cli-devin/assets/agent-config-deep-research-iter.json (system_instructions extensions), .opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/post-dispatch-validate.ts (analogy surface), and cli-devin/references/deep-loop-iter-contract.md (contract surface).

## Findings

### Pattern 1: Multi-Stage Verification Pipeline with Conditional Execution

**Smallcode primitive:**
```ms
// src/governor/verifier.ms:32-102
pub fn verify(self, filePath: String): VerificationResult {
  let result = VerificationResult {
    passed: false,
    confidence: 0.0,
    compiled: false,
    executed: false,
    tests_passed: false,
    lint_clean: false,
    auto_fixed: false,
    errors: [],
    hard_fail: false,
  }

  // Step 1: Structural check (placeholders, truncation)
  let structural = self.checkStructural(content)
  if !structural.passed {
    result.errors.append(structural.errors)
    let fixed = self.autoFix(content, ext)
    if fixed != content {
      writeFile(fullPath, fixed)
      content = fixed
      result.auto_fixed = true
    }
  }

  // Step 2: Compile
  let compileResult = self.compile(filePath, ext)
  result.compiled = compileResult.passed
  if !compileResult.passed {
    result.errors.append(compileResult.errors)
  }

  // Step 3: Execute (with timeout)
  if result.compiled {
    let execResult = self.execute(filePath, ext)
    result.executed = execResult.passed
    if !execResult.passed {
      result.errors.append(execResult.errors)
    }
  }

  // Step 4: Auto-generate and run smoke test
  if result.compiled && result.executed {
    let testResult = self.smokeTest(filePath, ext, content)
    result.tests_passed = testResult.passed
    if !testResult.passed {
      result.errors.append(testResult.errors)
    }
  }

  // Step 5: Lint
  let lintResult = self.lint(filePath, ext)
  result.lint_clean = lintResult.passed

  result.confidence = self.computeConfidence(result)
  result.passed = result.compiled && result.executed
  return result
}
```

**Candidate target path:** `cli-devin/references/verification-pipeline.md` (new ref doc)

**Patch shape:** Add new reference doc documenting the 5-stage pipeline pattern: structural (with auto-fix) → compile → execute (conditional on compile) → smoke test (conditional on compile+execute) → lint (non-blocking). Include VerificationResult struct schema and conditional execution logic.

**Acceptance criteria:**
- [ ] Reference doc exists at `cli-devin/references/verification-pipeline.md`
- [ ] Documents the 5-stage pipeline with conditional execution dependencies
- [ ] Includes VerificationResult struct schema (passed, confidence, compiled, executed, tests_passed, lint_clean, auto_fixed, errors, hard_fail)
- [ ] Includes code quote from verifier.ms:32-102
- [ ] Maps each stage to our existing verification surfaces (post-dispatch-validate.ts for JSONL validation, sk-code for syntax checks, etc.)

---

### Pattern 2: Structural Validation with Auto-Fix Attempt

**Smallcode primitive:**
```ms
// src/governor/verifier.ms:121-145
fn checkStructural(self, content: String): StageResult {
  let errors = []

  // Check for placeholders
  let placeholders = ["// TODO", "// ...", "/* ... */", "pass  # placeholder", "raise NotImplementedError"]
  for p in placeholders {
    if content.contains(p) {
      errors.push("Contains placeholder: ${p}")
    }
  }

  // Check for truncation markers
  if content.contains("// ... rest of") || content.contains("# ... more") {
    errors.push("Appears truncated")
  }

  // Check balanced braces (for C-style languages)
  let openBraces = content.chars().filter(|c| c == '{').length
  let closeBraces = content.chars().filter(|c| c == '}').length
  if openBraces != closeBraces {
    errors.push("Unbalanced braces: ${openBraces} open, ${closeBraces} close")
  }

  return StageResult { passed: errors.isEmpty(), errors: errors }
}
```

**Candidate target path:** `cli-opencode/references/structural-validation.md` (new ref doc)

**Patch shape:** Add new reference doc documenting structural validation pattern: placeholder detection, truncation marker detection, balanced brace checking, and auto-fix attempt (verifier.ms:231-250 shows autoFix logic for missing newlines, tab-to-space conversion, etc.).

**Acceptance criteria:**
- [ ] Reference doc exists at `cli-opencode/references/structural-validation.md`
- [ ] Documents placeholder detection patterns (TODO, ..., pass placeholder, NotImplementedError)
- [ ] Documents truncation marker detection ("... rest of", "... more")
- [ ] Documents balanced brace checking for C-style languages
- [ ] Includes auto-fix logic from verifier.ms:231-250 (missing newline, tab-to-space, orphan brace handling)
- [ ] Maps to our existing anti-hallucination patterns (shipped in packet 113)

---

### Pattern 3: Calibrated Confidence Scoring with Weighted Stage Contributions

**Smallcode primitive:**
```ms
// src/governor/verifier.ms:252-260
fn computeConfidence(self, result: VerificationResult): Float {
  let score = 0.0
  if result.compiled { score += 0.35 }
  if result.executed { score += 0.25 }
  if result.tests_passed { score += 0.25 }
  if result.lint_clean { score += 0.10 }
  if result.auto_fixed { score -= 0.05 }  // Slight penalty for needing auto-fix
  return score
}
```

**Candidate target path:** `cli-devin/references/confidence-scoring.md` (new ref doc)

**Patch shape:** Add new reference doc documenting the calibrated confidence scoring pattern: compile (35%), execute (25%), smoke test (25%), lint (10%), auto-fix penalty (-5%). Include guidance on tuning weights for different model tiers and task types.

**Acceptance criteria:**
- [ ] Reference doc exists at `cli-devin/references/confidence-scoring.md`
- [ ] Documents the weighted contribution formula (compile 35%, execute 25%, test 25%, lint 10%, auto-fix -5%)
- [ ] Includes code quote from verifier.ms:252-260
- [ ] Provides guidance on tuning weights for small vs large models
- [ ] Maps to our existing verification surfaces (post-dispatch-validate.ts for JSONL validation confidence analogs)

---

### Pattern 4: Hard-Fail Gatekeeper with Decompose Strategy

**Smallcode primitive:**
```ms
// src/governor/hard_fail.ms:29-70
pub fn checkOutput(self, filePath: String, taskType: String, toolUsed: String): GovernorAction {
  let result = self.verifier.verify(filePath)
  self.history.push(result)

  if result.passed {
    self.scorer.recordSuccess(toolUsed, taskType, 0)
    self.eventBus.emit("governor.verified", {
      file: filePath,
      confidence: result.confidence,
      compiled: result.compiled,
      executed: result.executed,
    })
    return GovernorAction.Accept { confidence: result.confidence }
  }

  // Failed — should we retry or hard fail?
  if self.verifier.shouldHardFail(self.history) {
    self.scorer.recordFailure(toolUsed, taskType, result.errors.first() ?? "verification failed")
    self.eventBus.emit("governor.hard_fail", {
      file: filePath,
      attempts: self.history.length,
      errors: result.errors,
    })
    return GovernorAction.HardFail {
      reason: formatHardFail(filePath, result, self.history.length),
    }
  }

  // Retry — send errors back to model
  return GovernorAction.Retry {
    errors: result.errors,
    attempt: self.history.length,
    maxAttempts: self.maxRetries,
    escalate: self.history.length >= 2,  // Use strong model on 2nd+ retry
  }
}
```

```js
// bin/governor.js:129-164
function checkAndEnforceHardFail(filePath) {
  if (!verificationHistory[filePath]) verificationHistory[filePath] = [];
  
  const result = verifyCode(filePath);
  verificationHistory[filePath].push(result);
  
  if (result.passed) {
    verificationHistory[filePath] = []; // Reset on success
    return { action: 'accept', confidence: result.confidence };
  }

  const attempts = verificationHistory[filePath].length;
  if (attempts >= MAX_VERIFICATION_RETRIES) {
    // Instead of hard fail: DECOMPOSE the problem
    // Read the file, identify what's broken, ask model to tackle one piece at a time
    const fs = require('fs');
    const path = require('path');
    let content = '';
    try { content = fs.readFileSync(path.resolve(process.cwd(), filePath), 'utf-8'); } catch {}
    
    const lines = content.split('\n').length;
    const errors = result.errors || [];
    
    verificationHistory[filePath] = []; // Reset for the decomposed attempt
    
    return { 
      action: 'decompose', 
      errors,
      fileContent: content,
      lines,
      strategy: pickDecomposeStrategy(content, errors, filePath),
    };
  }

  return { action: 'retry', errors: result.errors, attempt: attempts, escalate: attempts >= 2 };
}
```

**Candidate target path:** `cli-devin/references/hard-fail-policy.md` (new ref doc)

**Patch shape:** Add new reference doc documenting the hard-fail gatekeeper pattern: GovernorAction enum (Accept/Retry/HardFail), shouldHardFail logic (all failed compile OR all crashed after max retries), and decompose strategy (split file, one-error-at-a-time, rewrite section). Include integration with event bus and tool scorer.

**Acceptance criteria:**
- [ ] Reference doc exists at `cli-devin/references/hard-fail-policy.md`
- [ ] Documents GovernorAction enum (Accept, Retry, HardFail)
- [ ] Documents shouldHardFail logic (verifier.ms:105-117): all failed compile OR all crashed after max retries
- [ ] Documents decompose strategy from bin/governor.js:167-212 (split file, one-error-at-a-time, rewrite section)
- [ ] Includes integration with event bus and tool scorer
- [ ] Maps to our existing deep-loop iter contract (deep-loop-iter-contract.md stop conditions)

---

### Pattern 5: Language-Specific Compile/Execute Commands with Timeout

**Smallcode primitive:**
```ms
// src/governor/verifier.ms:147-171
fn compile(self, filePath: String, ext: String): StageResult {
  let cmd = match ext {
    ".py" => "python -m py_compile \"${filePath}\""
    ".js" | ".mjs" => "node --check \"${filePath}\""
    ".ts" | ".tsx" => "npx tsc --noEmit \"${filePath}\" 2>&1"
    ".rs" => "rustc --edition 2021 --crate-type lib \"${filePath}\" 2>&1"
    ".go" => "go build \"${filePath}\" 2>&1"
    ".c" => "gcc -fsyntax-only \"${filePath}\" 2>&1"
    ".cpp" => "g++ -fsyntax-only \"${filePath}\" 2>&1"
    ".bone" => {
      let compiler = findBoneCompiler(cwd())
      if !compiler { return StageResult { passed: true, errors: [] } }
      "node \"${compiler}\" check \"${filePath}\" 2>&1"
    }
    _ => return StageResult { passed: true, errors: [] }  // No compiler available
  }

  let result = exec(cmd, { cwd: cwd(), timeout: 15000, shell: true })
  if result.exitCode == 0 {
    return StageResult { passed: true, errors: [] }
  }
  let output = "${result.stdout}\n${result.stderr}".trim()
  return StageResult { passed: false, errors: [output.slice(0, 500)] }
}
```

```ms
// src/governor/verifier.ms:173-187
fn execute(self, filePath: String, ext: String): StageResult {
  let cmd = match ext {
    ".py" => "python \"${filePath}\""
    ".js" | ".mjs" => "node \"${filePath}\""
    ".ts" => "npx tsx \"${filePath}\""
    _ => return StageResult { passed: true, errors: [] }  // Can't execute this type
  }

  let result = exec(cmd, { cwd: cwd(), timeout: 10000, shell: true })
  if result.exitCode == 0 {
    return StageResult { passed: true, errors: [] }
  }
  let output = "${result.stdout}\n${result.stderr}".trim()
  return StageResult { passed: false, errors: [output.slice(0, 500)] }
}
```

**Candidate target path:** `cli-devin/references/language-commands.md` (new ref doc)

**Patch shape:** Add new reference doc documenting language-specific compile/execute command mapping with timeout handling. Include the ext-match pattern, timeout values (15s compile, 10s execute), error truncation (500 chars), and graceful fallback for unsupported languages.

**Acceptance criteria:**
- [ ] Reference doc exists at `cli-devin/references/language-commands.md`
- [ ] Documents compile commands for Python (py_compile), JS/MJS (node --check), TS/TSX (tsc --noEmit), Rust (rustc), Go (go build), C/C++ (gcc/g++), BoneScript (bone_check)
- [ ] Documents execute commands for Python (python), JS/MJS (node), TS (tsx)
- [ ] Documents timeout values (15s compile, 10s execute)
- [ ] Documents error truncation (500 chars)
- [ ] Documents graceful fallback for unsupported languages (return passed=true, errors=[])
- [ ] Maps to our existing sk-code verification patterns (language-specific syntax checks)

---

## Questions Answered

- **RQ2 — Output Verification Pipeline**: Identified 5 reusable patterns from smallcode's verification engine: (1) multi-stage verification pipeline with conditional execution, (2) structural validation with auto-fix attempt, (3) calibrated confidence scoring with weighted stage contributions, (4) hard-fail gatekeeper with decompose strategy, (5) language-specific compile/execute commands with timeout. Each pattern includes code quotes from smallcode source, candidate target path in our skill tree, one-line patch shape, and executable acceptance criteria.

## Questions Remaining

- [ ] RQ3 — Per-Model Profiles & Escalation
- [ ] RQ4 — Structured Scope/Permissions
- [ ] RQ5 — Skill Architecture (synthesis)

## Next Focus

RQ3 — Per-Model Profiles & Escalation. Read smallcode's model profiles (`src/model/profiles.ms`), Bayesian tool scorer (`src/governor/tool_scorer.ms`), and escalation engine (`bin/escalation.js`) via the preflight context-card pointer (context-card.md §RQ3, lines 270-403). Identify 3-5 reusable patterns for per-model capability encoding, Bayesian tool scoring with Laplace smoothing, and local→cloud escalation logic.
