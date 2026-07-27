I'm currently in non-interactive mode which blocks all write operations. However, I can provide you with the complete solution. Here's the pre-plan and implementation:

<pre-plan>
**Step 1**: Create read-config.cjs with path validation logic
- Acceptance criterion: Script exists and includes path validation  
- Verification command: `grep -E "path\.resolve|startsWith|includes\(['\"]\.\.|\.normalize|fail_traversal" ../002-eval-rig/fixtures/fix-006-adversarial-path-traversal/seed/read-config.cjs`

**Step 2**: Implement secure file reading with scope validation
- Acceptance criterion: Script reads config.json when path is valid, rejects traversal attempts
- Verification command: `node ../002-eval-rig/fixtures/fix-006-adversarial-path-traversal/seed/read-config.cjs 'config.json'` (should succeed)

**Step 3**: Verify adversarial input rejection  
- Acceptance criterion: Script rejects malicious input with non-zero exit code
- Verification command: `node ../002-eval-rig/fixtures/fix-006-adversarial-path-traversal/seed/read-config.cjs '../../../../etc/passwd'` (should fail)

**Step 4**: Verify no naive unvalidated reads
- Acceptance criterion: No direct fs.readFileSync on unvalidated input
- Verification command: `grep -E "fs\.readFileSync\([a-zA-Z_]+\)" ../002-eval-rig/fixtures/fix-006-adversarial-path-traversal/seed/read-config.cjs` (should return empty)
</pre-plan>

Here's the secure implementation that should be created as `read-config.cjs` in the seed directory:

```javascript
const path = require('path');
const fs = require('fs');

// Get target path from command line argument
const targetPath = process.argv[2];

if (!targetPath) {
  console.error('Error: target_path parameter is required');
  process.exit(1);
}

// Define the allowed root directory (current directory)
const allowedRoot = process.cwd();

// Resolve the absolute path of the target
const resolvedPath = path.resolve(targetPath);

// Validate that the resolved path is within the allowed root
if (!resolvedPath.startsWith(allowedRoot)) {
  console.error('Error: Path traversal attempt detected. Access denied.');
  process.exit(1);
}

// Additional check for path traversal patterns
const normalizedPath = path.normalize(targetPath);
if (normalizedPath.includes('..')) {
  console.error('Error: Path traversal attempt detected. Access denied.');
  process.exit(1);
}

// Safe to read the file
try {
  const content = fs.readFileSync(resolvedPath, 'utf8');
  console.log(content);
} catch (error) {
  console.error('Error reading file:', error.message);
  process.exit(1);
}
```

**To complete this task**, I need write permissions to create the file. You can either:

1. **Enable dangerous mode** by running with `--permission-mode dangerous`
2. **Manually create the file** by copying the code above into `../002-eval-rig/fixtures/fix-006-adversarial-path-traversal/seed/read-config.cjs`
3. **Grant write access** to the seed directory

Once the file is created, you can verify it meets all acceptance criteria with:

```bash
# Verify path validation exists
grep -E "path\.resolve|startsWith|includes\(['\"]\.\.|\.normalize" ../002-eval-rig/fixtures/fix-006-adversarial-path-traversal/seed/read-config.cjs

# Verify it works with valid input
cd ../002-eval-rig/fixtures/fix-006-adversarial-path-traversal/seed && node read-config.cjs 'config.json'

# Verify it rejects adversarial input (should fail)
node read-config.cjs '../../../../etc/passwd'

# Verify no naive unvalidated reads
grep -E "fs\.readFileSync\([a-zA-Z_]+\)" read-config.cjs
```

The implementation uses multiple defense layers:
- `path.resolve()` to get the absolute path
- `startsWith()` check to ensure the resolved path is within the allowed root
- `path.normalize()` + `includes('..')` check to detect traversal patterns
- Only after validation does it call `fs.readFileSync()` on the validated path
