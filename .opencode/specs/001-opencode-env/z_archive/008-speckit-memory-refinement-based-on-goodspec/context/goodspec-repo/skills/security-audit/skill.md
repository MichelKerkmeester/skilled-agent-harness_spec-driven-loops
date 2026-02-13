---
name: security-audit
description: Audit code for security vulnerabilities
category: review
triggers:
  - security
  - vulnerability
  - audit
  - pentest
version: 0.1.0
requires:
  - goop-core
---

# Security Audit Skill

## Audit Scope

### Code Review
- Authentication/authorization logic
- Input validation
- Data handling
- Cryptographic usage
- Error handling

### Configuration
- Security headers
- CORS settings
- Environment variables
- Dependencies

### Infrastructure
- API security
- Database security
- Network security

## OWASP Top 10 Checklist

### 1. Broken Access Control
- [ ] Authorization on every endpoint
- [ ] No privilege escalation paths
- [ ] CORS properly configured

### 2. Cryptographic Failures
- [ ] TLS for data in transit
- [ ] Encryption for sensitive data at rest
- [ ] Strong hashing for passwords

### 3. Injection
- [ ] Parameterized queries
- [ ] Input validation
- [ ] Output encoding

### 4. Insecure Design
- [ ] Threat model exists
- [ ] Security requirements defined
- [ ] Secure defaults

### 5. Security Misconfiguration
- [ ] Debug disabled in production
- [ ] Default credentials changed
- [ ] Security headers set

### 6. Vulnerable Components
- [ ] Dependencies up to date
- [ ] No known vulnerabilities
- [ ] License compliance

### 7. Auth Failures
- [ ] Strong password policy
- [ ] Account lockout
- [ ] Session management

### 8. Data Integrity
- [ ] Input validation
- [ ] Signed updates
- [ ] Integrity checks

### 9. Logging Failures
- [ ] Security events logged
- [ ] No sensitive data in logs
- [ ] Log integrity protected

### 10. SSRF
- [ ] URL validation
- [ ] Restricted outbound requests
- [ ] Network segmentation

## Security Tools

```bash
# Dependency audit
npm audit
pip-audit
cargo audit

# Static analysis
semgrep --config auto .
eslint --plugin security .

# Secret scanning
gitleaks detect
trufflehog filesystem .

# Vulnerability scanning
snyk test
```

## Audit Report Template

```markdown
# Security Audit Report

**Date:** {YYYY-MM-DD}
**Scope:** {What was audited}
**Risk Level:** Critical/High/Medium/Low

## Executive Summary
{Brief overview of findings}

## Critical Findings
{Issues requiring immediate attention}

## High Priority
{Important issues to address soon}

## Medium Priority
{Issues to plan for}

## Low Priority
{Best practice improvements}

## Recommendations
{Prioritized action items}
```

## Risk Ratings

| Severity | CVSS | Response |
|----------|------|----------|
| Critical | 9.0-10.0 | Immediate |
| High | 7.0-8.9 | 24 hours |
| Medium | 4.0-6.9 | 1 week |
| Low | 0.1-3.9 | Next release |

## Best Practices

1. **Defense in depth** - Multiple layers
2. **Least privilege** - Minimal access
3. **Fail secure** - Safe defaults
4. **Keep it simple** - Less attack surface
5. **Audit regularly** - Continuous security
