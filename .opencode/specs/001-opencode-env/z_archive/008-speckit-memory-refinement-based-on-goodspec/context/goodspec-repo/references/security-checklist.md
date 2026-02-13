# Security Checklist

Comprehensive security verification checklist for GoopSpec verification phase.

## Authentication & Authorization

### Authentication
- [ ] Password hashing uses bcrypt/argon2 with appropriate cost factor
- [ ] Passwords meet minimum complexity requirements
- [ ] Account lockout after failed attempts
- [ ] Secure password reset flow (time-limited tokens)
- [ ] Multi-factor authentication available for sensitive operations
- [ ] Session tokens are cryptographically secure
- [ ] Sessions expire after inactivity
- [ ] Sessions invalidated on logout

### Authorization
- [ ] Role-based access control implemented
- [ ] Principle of least privilege applied
- [ ] Authorization checks on every protected endpoint
- [ ] No authorization bypass via parameter manipulation
- [ ] Admin functions properly protected

## Input Validation

### General
- [ ] All user input validated server-side
- [ ] Whitelist validation preferred over blacklist
- [ ] Input length limits enforced
- [ ] Type validation on all inputs
- [ ] File upload restrictions (type, size, content)

### Injection Prevention
- [ ] SQL injection: Parameterized queries used
- [ ] NoSQL injection: Query sanitization
- [ ] Command injection: No shell execution with user input
- [ ] XSS: Output encoding/escaping
- [ ] LDAP injection: Input sanitization
- [ ] XML injection: Disable external entities

## Data Protection

### In Transit
- [ ] HTTPS enforced everywhere
- [ ] TLS 1.2+ only
- [ ] HSTS header configured
- [ ] Secure cookies (Secure, HttpOnly, SameSite)
- [ ] Certificate pinning for mobile apps

### At Rest
- [ ] Sensitive data encrypted
- [ ] Encryption keys properly managed
- [ ] Database encryption enabled
- [ ] Backup encryption
- [ ] No secrets in code or config files

### Privacy
- [ ] PII minimization
- [ ] Data retention policies
- [ ] Right to deletion supported
- [ ] Audit logging for data access

## API Security

### Design
- [ ] Rate limiting implemented
- [ ] Request size limits
- [ ] API versioning
- [ ] Deprecation policy

### Authentication
- [ ] API keys/tokens properly validated
- [ ] OAuth 2.0/OIDC for third-party auth
- [ ] JWT validation (signature, expiry, issuer)
- [ ] No sensitive data in URLs

### Response
- [ ] Appropriate error messages (no stack traces)
- [ ] CORS properly configured
- [ ] Content-Type headers set
- [ ] No sensitive data in responses

## Infrastructure

### Configuration
- [ ] Debug mode disabled in production
- [ ] Default credentials changed
- [ ] Unnecessary services disabled
- [ ] Security headers configured:
  - Content-Security-Policy
  - X-Frame-Options
  - X-Content-Type-Options
  - Referrer-Policy

### Dependencies
- [ ] Dependencies up to date
- [ ] No known vulnerabilities (npm audit)
- [ ] License compliance checked
- [ ] Dependency pinning

### Logging & Monitoring
- [ ] Security events logged
- [ ] No sensitive data in logs
- [ ] Log integrity protected
- [ ] Alerting on suspicious activity
- [ ] Incident response plan

## Code Quality

### Secure Coding
- [ ] No hardcoded secrets
- [ ] Cryptographic functions from standard libraries
- [ ] Proper random number generation
- [ ] Memory safety (bounds checking)
- [ ] Error handling doesn't leak info

### Review
- [ ] Security-focused code review
- [ ] Static analysis tools run
- [ ] Dynamic analysis/fuzzing
- [ ] Penetration testing (if applicable)

## Common Vulnerabilities (OWASP Top 10)

1. **Broken Access Control** - Verify authorization everywhere
2. **Cryptographic Failures** - Use modern crypto, protect data
3. **Injection** - Validate and sanitize all input
4. **Insecure Design** - Threat model, secure defaults
5. **Security Misconfiguration** - Harden everything
6. **Vulnerable Components** - Keep dependencies updated
7. **Auth Failures** - Strong auth, session management
8. **Data Integrity Failures** - Verify integrity, sign updates
9. **Logging Failures** - Log security events, monitor
10. **SSRF** - Validate URLs, restrict outbound requests

## Verification Commands

```bash
# Dependency vulnerabilities
npm audit
pip-audit
cargo audit

# Static analysis
semgrep --config auto .
eslint --plugin security .

# Secret scanning
gitleaks detect
trufflehog filesystem .

# SAST
snyk code test
```

## Risk Rating

| Severity | Response Time | Examples |
|----------|---------------|----------|
| Critical | Immediate | RCE, auth bypass, data breach |
| High | 24 hours | SQLi, XSS, privilege escalation |
| Medium | 1 week | CSRF, information disclosure |
| Low | Next release | Minor info leak, best practice |
