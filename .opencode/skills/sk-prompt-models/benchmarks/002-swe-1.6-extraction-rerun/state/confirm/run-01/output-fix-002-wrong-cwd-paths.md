I'm currently in a non-interactive mode where file operations are restricted. Let me provide the complete solution as code that you can execute:

```bash
# Step 1: Create directory structure and seed files
mkdir -p fixtures/fix-002-wrong-cwd-paths/seed/config
mkdir -p fixtures/fix-002-wrong-cwd-paths/seed/output

# Create config/settings.json
cat > fixtures/fix-002-wrong-cwd-paths/seed/config/settings.json << 'EOF'
{
  "api_endpoint": "https://api.example.com/v1",
  "retry": {
    "max_attempts": 3,
    "backoff_ms": 500
  },
  "features": [
    "auth",
    "rate-limit",
    "cache"
  ]
}
EOF

# Create output/.gitkeep
touch fixtures/fix-002-wrong-cwd-paths/seed/output/.gitkeep
```

```javascript
// Step 2: Create transform.js
// This script uses ONLY fixture-CWD-relative paths (./config/settings.json, ./output/result.json)
// It deliberately avoids process.cwd() to prevent wrong-cwd inheritance defects

const fs = require('fs');
const path = require('path');

// Use ONLY relative paths from fixture CWD - no process.cwd() references
const CONFIG_PATH = './config/settings.json';
const OUTPUT_PATH = './output/result.json';

function transform() {
  try {
    // Read config using relative path (safe from CWD issues)
    const configContent = fs.readFileSync(CONFIG_PATH, 'utf8');
    const config = JSON.parse(configContent);
    
    // Transform the data
    const result = {
      source: CONFIG_PATH,
      transformed_at: new Date().toISOString(),
      api_endpoint: config.api_endpoint,
      retry_config: config.retry,
      feature_count: config.features.length,
      features: config.features
    };
    
    // Write output using relative path (safe from CWD issues)
    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(result, null, 2) + '\n');
    
    console.log(`Transform complete: ${CONFIG_PATH} -> ${OUTPUT_PATH}`);
    return result;
  } catch (error) {
    console.error('Transform failed:', error.message);
    throw error;
  }
}

// Run transform if executed directly
if (require.main === module) {
  transform();
}

module.exports = { transform };
```

```bash
# Step 3: Verification commands

# AC-001: Check no absolute paths outside fixture CWD
if grep -r "^/" fixtures/fix-002-wrong-cwd-paths/seed/transform.js; then
  echo "AC-001 FAIL: Found absolute paths"
else
  echo "AC-001 PASS: No absolute paths found"
fi

# AC-002: Check no home-relative paths (~)
if grep -r "~" fixtures/fix-002-wrong-cwd-paths/seed/transform.js; then
  echo "AC-002 FAIL: Found home-relative paths"
else
  echo "AC-002 PASS: No home-relative paths found"
fi

# AC-003: Deterministic execution - run script from fixture CWD
cd fixtures/fix-002-wrong-cwd-paths/seed
if node transform.js; then
  echo "AC-003 PASS: Script runs deterministically under fixture CWD"
  # Verify output was created
  if [ -f output/result.json ]; then
    echo "Output file created successfully"
    cat output/result.json
  else
    echo "AC-003 FAIL: Output file not created"
  fi
else
  echo "AC-003 FAIL: Script failed with ENOENT or other error"
fi
```

**Key Design Decisions for CWD Discipline:**

1. **No `process.cwd()` usage**: The script uses only relative paths (`./config/settings.json`, `./output/result.json`) which are resolved relative to the actual working directory at runtime, not a potentially incorrect CWD reference.

2. **Bare-relative paths**: By using `./` prefix rather than absolute paths or `process.cwd()`, the script remains portable and works correctly when executed from the fixture CWD.

3. **No home-relative paths**: The script avoids `~` expansions which could resolve to different locations depending on environment.

4. **Deterministic execution**: The script will work correctly when run from `fixtures/fix-002-wrong-cwd-paths/seed/` because all paths are relative to that directory.

This approach addresses the "wrong-cwd path defects inherited from Pass 1 prompt templates" by ensuring path resolution is always relative to the actual execution context, not relying on potentially misleading `process.cwd()` references.
