---
title: Security Patterns - OWASP Top 10 Integration
description: Security hardening patterns covering XSS prevention, CSRF protection, and input validation.
trigger_phrases:
  - "webflow security patterns"
  - "xss prevention frontend"
  - "csrf protection checklist"
  - "owasp top ten frontend"
importance_tier: normal
contextType: implementation
version: 3.5.0.3
---

# Security Patterns - OWASP Top 10 Integration

Security hardening patterns covering XSS prevention, CSRF protection, and input validation.

---

## 1. OVERVIEW

### Purpose
Frontend security checklist based on OWASP Top 10 vulnerabilities, covering input validation, injection prevention, and secure data handling.

### When to Use
Apply during Phase 1 (Implementation) when:
- Handling user input (forms, search, etc.)
- Making API calls
- Displaying user-generated content
- Storing data (localStorage, sessionStorage, cookies)
- Before deploying to production

---

## 2. SECURITY CHECKLIST

### Input Validation & XSS Prevention

**Sanitize User Input:**
```javascript
// ✅ GOOD: Sanitize before display
function sanitize_html(str) {
  const div = document.createElement('div');
  div.textContent = str;  // Automatically escapes HTML
  return div.innerHTML;
}

const user_input = '<script>alert("XSS")</script>';
element.innerHTML = sanitize_html(user_input);
// Result: &lt;script&gt;alert("XSS")&lt;/script&gt;

// ❌ BAD: Direct innerHTML without sanitization
element.innerHTML = user_input;  // XSS vulnerability!
```

**Use textContent When Possible:**
```javascript
// ✅ GOOD: Use textContent for plain text
element.textContent = user_input;  // Safe, no HTML rendering

// ❌ BAD: innerHTML for plain text
element.innerHTML = user_input;  // Unnecessary risk
```

**Validate Input Format:**
```javascript
// ✅ GOOD: Validate email format
function is_valid_email(email) {
  const email_regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return email_regex.test(email);
}

if (!is_valid_email(user_email)) {
  throw new Error('Invalid email format');
}

// ❌ BAD: Accept any input
const user_email = input.value;  // No validation
send_to_api(user_email);
```

**Checklist:**
- [ ] All user input sanitized before display
- [ ] textContent used instead of innerHTML when possible
- [ ] HTML entities escaped in user-generated content
- [ ] Input format validated (email, phone, URL, etc.)
- [ ] No eval() or Function() constructor with user input

### CSRF Protection

**SameSite Cookies:**
```javascript
// ✅ GOOD: Set SameSite cookie attribute
document.cookie = "session=abc123; SameSite=Strict; Secure";

// ❌ BAD: No SameSite attribute
document.cookie = "session=abc123";  // Vulnerable to CSRF
```

**CSRF Tokens:**
```html
<!-- ✅ GOOD: Include CSRF token in forms -->
<form method="POST">
  <input type="hidden" name="csrf_token" value="${csrfToken}">
  <input type="text" name="username">
  <button type="submit">Submit</button>
</form>

<!-- Server-side verification required -->
```

**Verify Origin/Referer:**
```javascript
// ✅ GOOD: Verify request origin (server-side)
const allowed_origins = ['https://example.com'];
if (!allowed_origins.includes(req.headers.origin)) {
  throw new Error('Invalid origin');
}
```

**Checklist:**
- [ ] SameSite=Strict set on cookies
- [ ] CSRF tokens implemented for state-changing operations
- [ ] Origin/Referer headers verified (server-side)
- [ ] GET requests never modify state

### Injection Prevention

**SQL/NoSQL Injection:**
```javascript
// ✅ GOOD: Parameterized queries (server-side)
const query = 'SELECT * FROM users WHERE email = ?';
db.execute(query, [user_email]);

// ❌ BAD: String concatenation
const query = `SELECT * FROM users WHERE email = '${user_email}'`;
// Vulnerable to SQL injection!
```

**Command Injection:**
```javascript
// ✅ GOOD: Validate and sanitize inputs
const allowed_commands = ['start', 'stop', 'restart'];
if (!allowed_commands.includes(user_command)) {
  throw new Error('Invalid command');
}

// ❌ BAD: Execute user input directly
exec(user_command);  // Command injection vulnerability!
```

**Never Execute User Input:**
```javascript
// ❌ BAD: eval() with user input
eval(user_input);  // Extreme vulnerability

// ❌ BAD: Function constructor
new Function(user_input)();  // Also vulnerable

// ❌ BAD: setTimeout/setInterval with strings
setTimeout(user_input, 1000);  // Vulnerable
```

**Checklist:**
- [ ] Parameterized queries used (no string concatenation)
- [ ] All inputs validated and sanitized
- [ ] Never use eval(), Function(), or execute user input
- [ ] Whitelist approach for allowed values

### Security Headers

**Content Security Policy (CSP):**
```html
<!-- ✅ GOOD: Strict CSP -->
<meta http-equiv="Content-Security-Policy"
      content="default-src 'self'; script-src 'self' https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline'">

<!-- ❌ BAD: No CSP or overly permissive -->
<meta http-equiv="Content-Security-Policy" content="default-src *">
```

**Other Security Headers:**
```html
<!-- X-Content-Type-Options -->
<meta http-equiv="X-Content-Type-Options" content="nosniff">

<!-- X-Frame-Options -->
<meta http-equiv="X-Frame-Options" content="DENY">

<!-- Strict-Transport-Security (HSTS) - server-side -->
Strict-Transport-Security: max-age=31536000; includeSubDomains
```

**Checklist:**
- [ ] Content-Security-Policy set (restrict script/style sources)
- [ ] X-Content-Type-Options: nosniff set
- [ ] X-Frame-Options: DENY or SAMEORIGIN set
- [ ] Strict-Transport-Security (HSTS) enabled (server-side)
- [ ] Referrer-Policy configured appropriately

### Access Control

**Client-Side Authorization (UI Only):**
```javascript
// ⚠️ WARNING: Client-side checks are for UX only, NOT security
// Always verify on server-side

// ✅ GOOD: Hide UI elements, verify on backend
if (user.role === 'admin') {
  adminPanel.style.display = 'block';  // UI only
}
// Server MUST verify user.role before serving admin data

// ❌ BAD: Client-side only authorization
if (user.role === 'admin') {
  fetchAdminData();  // Vulnerable if server doesn't verify
}
```

**Least Privilege Principle:**
```javascript
// ✅ GOOD: Request only necessary permissions
const data = await fetch('/api/user/profile');  // Specific endpoint

// ❌ BAD: Request more than needed
const data = await fetch('/api/admin/all-users');  // Excessive permissions
```

**Checklist:**
- [ ] User authorization verified on EVERY server request
- [ ] Least privilege principle implemented
- [ ] Never trust client-side authorization checks
- [ ] Sensitive operations require re-authentication

### Data Storage Security

**localStorage/sessionStorage:**
```javascript
// ✅ GOOD: Never store sensitive data in localStorage
sessionStorage.setItem('theme', 'dark');  // Non-sensitive data OK

// ❌ BAD: Store sensitive data
localStorage.setItem('password', user_password);  // Vulnerable to XSS
localStorage.setItem('token', auth_token);  // Accessible to all scripts
```

**Cookies:**
```javascript
// ✅ GOOD: Secure, HttpOnly cookies (server-side)
Set-Cookie: session=abc123; Secure; HttpOnly; SameSite=Strict

// ❌ BAD: JavaScript-accessible cookies with sensitive data
document.cookie = "session=abc123";  // Accessible to XSS
```

**Checklist:**
- [ ] No sensitive data in localStorage/sessionStorage
- [ ] Cookies set with Secure, HttpOnly, SameSite attributes
- [ ] Sensitive data encrypted if stored client-side
- [ ] Clear storage on logout

---
