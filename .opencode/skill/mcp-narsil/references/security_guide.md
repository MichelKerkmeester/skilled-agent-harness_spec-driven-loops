---
title: Security Scanning Guide - Narsil MCP
description: Comprehensive security scanning workflow using Narsil's security tools with phased execution and validation checkpoints.
---

# Security Scanning Guide - Narsil MCP

Phased security scanning workflow using Narsil's security tools.

---

## 1. 📖 OVERVIEW

### Core Principle

Start broad with `scan_security`, then drill into specifics with taint analysis and injection detection.

### Security Capabilities

Narsil provides comprehensive security analysis:

| Capability | Tools | Coverage |
|------------|-------|----------|
| **Rule-Based Scanning** | `scan_security`, `check_owasp_top10`, `check_cwe_top25` | 35+ security rules |
| **Injection Detection** | `find_injection_vulnerabilities` | SQL, XSS, command injection |
| **Taint Analysis** | `trace_taint`, `get_taint_sources` | Data flow from untrusted sources |
| **Supply Chain** | `generate_sbom`, `check_dependencies`, `check_licenses` | CVE + license compliance |

### Security Tools Summary

| Tool | Purpose | Priority |
|------|---------|----------|
| `scan_security` | Full security scan with rulesets | HIGH |
| `find_injection_vulnerabilities` | SQL, XSS, command injection | HIGH |
| `check_owasp_top10` | OWASP Top 10 2021 compliance | HIGH |
| `check_cwe_top25` | CWE Top 25 weaknesses | HIGH |
| `trace_taint` | Taint data flow analysis | HIGH |
| `get_taint_sources` | List input sources | MEDIUM |
| `get_security_summary` | Risk assessment overview | MEDIUM |
| `explain_vulnerability` | Detailed vulnerability info | MEDIUM |
| `suggest_fix` | Remediation guidance | MEDIUM |
| `generate_sbom` | Software bill of materials | HIGH |
| `check_dependencies` | CVE checking | HIGH |
| `check_licenses` | License compliance | HIGH |

---

## 2. 🎯 SECURITY WORKFLOW

You MUST complete each phase before proceeding to the next.

### Phase 1: Initial Scan

**Purpose**: Get broad security overview

**Actions**:
1. Run full security scan with OWASP rules
2. Check OWASP Top 10 compliance
3. Review severity distribution

**Validation**: `initial_scan_complete`

```typescript
call_tool_chain({
  code: `
    // Phase 1: Initial scan
    const scan = await narsil.narsil_scan_security({
      categories: ["owasp", "cwe", "crypto", "secrets"]
    });
    
    const owasp = await narsil.narsil_check_owasp_top10({});
    
    console.log('Total findings:', scan.findings?.length || 0);
    console.log('OWASP findings:', owasp.length);
    
    return { scan, owasp };
  `,
  timeout: 60000
});
```

**Checkpoint Questions**:
- Did the scan complete without errors?
- How many findings by severity (critical/high/medium/low)?
- Any blocking issues before proceeding?

### Phase 2: Injection Analysis

**Purpose**: Deep-dive into injection vulnerabilities

**Actions**:
1. Run injection vulnerability detection
2. Identify SQL, XSS, command injection risks
3. Trace taint from each finding

**Validation**: `injections_analyzed`

```typescript
call_tool_chain({
  code: `
    // Phase 2: Injection analysis
    const injections = await narsil.narsil_find_injection_vulnerabilities({
      types: ["sql", "xss", "command"]
    });
    
    console.log('Injection findings:', injections.length);
    
    // For each finding, trace taint
    const traces = [];
    for (const inj of injections.slice(0, 5)) {  // Top 5
      const trace = await narsil.narsil_trace_taint({
        source: inj.source
      });
      traces.push({ finding: inj, trace });
    }
    
    return { injections, traces };
  `,
  timeout: 60000
});
```

**Checkpoint Questions**:
- How many injection vulnerabilities found?
- Which types are most prevalent?
- Can untrusted data reach dangerous sinks?

### Phase 3: Taint Analysis

**Purpose**: Understand data flow from untrusted sources

**Actions**:
1. Identify all taint sources
2. Trace data flow to sinks
3. Map untrusted data paths

**Validation**: `taint_analyzed`

```typescript
call_tool_chain({
  code: `
    // Phase 3: Taint analysis
    const sources = await narsil.narsil_get_taint_sources({});
    
    console.log('Taint sources found:', sources.length);
    
    // Trace each source type
    const userInputTraces = await narsil.narsil_trace_taint({
      source_type: "user_input"
    });
    
    return { sources, userInputTraces };
  `,
  timeout: 60000
});
```

**Checkpoint Questions**:
- What are the primary input sources?
- Do any reach SQL queries, file operations, or command execution?
- Are there sanitization gaps?

### Phase 4: Supply Chain Security

**Purpose**: Check dependencies for vulnerabilities

**Actions**:
1. Generate SBOM
2. Check dependencies against CVE database
3. Verify license compliance

**Validation**: `supply_chain_checked`

```typescript
call_tool_chain({
  code: `
    // Phase 4: Supply chain
    const sbom = await narsil.narsil_generate_sbom({
      format: "cyclonedx"
    });
    
    const vulns = await narsil.narsil_check_dependencies({});
    
    const licenses = await narsil.narsil_check_licenses({});
    
    console.log('Dependencies:', sbom.components?.length || 0);
    console.log('Vulnerabilities:', vulns.length);
    console.log('License issues:', licenses.issues?.length || 0);
    
    return { sbom, vulns, licenses };
  `,
  timeout: 60000
});
```

**Checkpoint Questions**:
- How many dependencies total?
- Any known CVEs in dependencies?
- Any license compliance issues?

### Phase 5: Summary and Report

**Purpose**: Consolidate findings and prioritize remediation

**Actions**:
1. Get security summary
2. Prioritize by severity
3. Document remediation plan

**Validation**: `audit_complete`

```typescript
call_tool_chain({
  code: `
    // Phase 5: Summary
    const summary = await narsil.narsil_get_security_summary({});
    
    console.log('Risk level:', summary.risk_level);
    console.log('Critical:', summary.critical_count);
    console.log('High:', summary.high_count);
    
    return summary;
  `
});
```

---

## 3. 🛡️ OWASP TOP 10 COVERAGE

| ID | Category | Narsil Detection | Tool |
|----|----------|------------------|------|
| A01 | Broken Access Control | Taint analysis | `trace_taint` |
| A02 | Cryptographic Failures | Crypto rules | `scan_security` |
| A03 | Injection | Injection detection | `find_injection_vulnerabilities` |
| A04 | Insecure Design | Complexity metrics | `get_complexity` |
| A05 | Security Misconfiguration | Config analysis | `scan_security` |
| A06 | Vulnerable Components | SBOM + CVE check | `check_dependencies` |
| A07 | Auth Failures | Pattern matching | `scan_security` |
| A08 | Data Integrity Failures | Taint analysis | `trace_taint` |
| A09 | Logging Failures | Pattern matching | `scan_security` |
| A10 | SSRF | Taint analysis | `trace_taint` |

---

## 4. 🔧 TOOL USAGE PATTERNS

### Full Security Scan

```typescript
const findings = await narsil.narsil_scan_security({
  categories: ["owasp", "cwe", "crypto", "secrets"]
});
```

### Injection Detection

```typescript
const injections = await narsil.narsil_find_injection_vulnerabilities({
  types: ["sql", "xss", "command"]
});
```

### Taint Tracing

```typescript
// Find sources
const sources = await narsil.narsil_get_taint_sources({});

// Trace from specific source
const flow = await narsil.narsil_trace_taint({
  source: "request.body",
  function_name: "processInput"
});
```

### Remediation Guidance

```typescript
// Get explanation
const explanation = await narsil.narsil_explain_vulnerability({
  id: "CWE-89"  // SQL Injection
});

// Get fix suggestion
const fix = await narsil.narsil_suggest_fix({
  finding_id: "finding-123"
});
```

---

## 5. ⚠️ COMMON PATTERNS

### SQL Injection

**Before (Vulnerable)**:
```python
# Direct string concatenation - VULNERABLE
query = f"SELECT * FROM users WHERE id = {user_input}"
cursor.execute(query)
```

**After (Secure)**:
```python
# Parameterized query - SECURE
query = "SELECT * FROM users WHERE id = ?"
cursor.execute(query, (user_input,))
```

### XSS Prevention

**Before (Vulnerable)**:
```javascript
// Direct HTML insertion - VULNERABLE
element.innerHTML = userInput;
```

**After (Secure)**:
```javascript
// Text content (auto-escaped) - SECURE
element.textContent = userInput;
```

### Command Injection

**Before (Vulnerable)**:
```python
# Shell=True with user input - VULNERABLE
subprocess.run(f"ls {user_path}", shell=True)
```

**After (Secure)**:
```python
# List args without shell - SECURE
subprocess.run(["ls", user_path], shell=False)
```

---

## 6. 🛠️ TROUBLESHOOTING

### Scan Returns No Results

**Symptom**: Security scan returns empty findings

**Cause**: Repository not indexed or language not supported

**Solution**:
```typescript
// Check index status
call_tool_chain({
  code: `await narsil.narsil_get_index_status({})`
});

// Reindex if needed
call_tool_chain({
  code: `await narsil.narsil_reindex({})`
});
```

### Taint Analysis Incomplete

**Symptom**: Taint traces don't reach expected sinks

**Cause**: Cross-file analysis may miss some paths

**Solution**: Use call graph to identify intermediate functions, then trace segments.

### Timeout on Large Codebase

**Symptom**: Security scan times out

**Solution**:
```typescript
// Increase timeout
call_tool_chain({
  code: `await narsil.narsil_scan_security({})`,
  timeout: 120000  // 2 minutes
});

// Or scan specific categories
call_tool_chain({
  code: `await narsil.narsil_scan_security({ categories: ["owasp"] })`
});
```

---

## 7. 🔗 RELATED RESOURCES

### Guides

- [tool_reference.md](./tool_reference.md) - Complete tool documentation
- [call_graph_guide.md](./call_graph_guide.md) - Code flow analysis

### External

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [CWE Top 25](https://cwe.mitre.org/top25/)
- [OWASP Cheat Sheets](https://cheatsheetseries.owasp.org/)
