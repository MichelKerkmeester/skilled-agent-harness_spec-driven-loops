# @org/auth

Authentication and authorization subsystem for the platform. Provides
session management, credential verification, token issuance/validation,
and role-based access control primitives that other packages can compose.

> **Status:** scaffold. Replace placeholders (`<…>`) with values that match
> the actual implementation as the package is built out.

---

## Purpose

`@org/auth` centralizes identity concerns so application code never has to
hand-roll password hashing, token signing, or permission checks. It aims to:

- Authenticate users via password, OAuth, and API key credentials.
- Issue and verify short-lived access tokens and rotating refresh tokens.
- Manage server-side sessions with revocation support.
- Enforce role- and scope-based authorization at route and service layers.
- Provide framework-agnostic primitives plus thin adapters (Express, Fastify, Next.js).

Non-goals: user profile storage, billing/entitlements, MFA enrollment UX
(those live in their respective packages and consume `@org/auth` APIs).

---

## Install

From the monorepo root:

```bash
npm install @org/auth
```

Peer dependencies (install in the host application if not already present):

- `node` >= 20
- A supported session/token store: `redis` >= 4 **or** a SQL driver compatible
  with the configured persistence adapter.

---

## Usage

### Initialize

```ts
import { createAuth } from "@org/auth";

export const auth = createAuth({
  secret: process.env.AUTH_SECRET!,
  issuer: "https://api.example.com",
  store: { kind: "redis", url: process.env.REDIS_URL! },
  tokens: {
    accessTtlSeconds: 900,        // 15 min
    refreshTtlSeconds: 60 * 60 * 24 * 30, // 30 days
  },
});
```

### Authenticate a request

```ts
import { auth } from "./auth";

app.post("/login", async (req, res) => {
  const { user, tokens } = await auth.login({
    email: req.body.email,
    password: req.body.password,
  });
  res.json({ user, tokens });
});

app.get("/me", auth.requireUser(), (req, res) => {
  res.json({ user: req.user });
});
```

### Authorize by role or scope

```ts
app.delete(
  "/projects/:id",
  auth.requireUser(),
  auth.requireScope("projects:delete"),
  handler,
);
```

### Verify a token in any context

```ts
const claims = await auth.verifyAccessToken(rawToken);
// throws AuthError on invalid/expired tokens
```

---

## Configuration

All configuration is supplied to `createAuth(...)`. Environment variables are
the recommended source for secrets.

| Option                     | Env var                | Required | Default | Description                                              |
| -------------------------- | ---------------------- | -------- | ------- | -------------------------------------------------------- |
| `secret`                   | `AUTH_SECRET`          | yes      | —       | 32+ byte signing secret for tokens. Rotate periodically. |
| `issuer`                   | `AUTH_ISSUER`          | yes      | —       | `iss` claim emitted on tokens.                           |
| `store.kind`               | `AUTH_STORE_KIND`      | yes      | —       | `redis` \| `sql` \| `memory` (memory = tests only).      |
| `store.url`                | `AUTH_STORE_URL`       | yes      | —       | Connection string for the store.                         |
| `tokens.accessTtlSeconds`  | `AUTH_ACCESS_TTL`      | no       | `900`   | Access token lifetime.                                   |
| `tokens.refreshTtlSeconds` | `AUTH_REFRESH_TTL`     | no       | `2592000` | Refresh token lifetime.                                |
| `password.hash`            | —                      | no       | `argon2id` | Password hash algorithm. Do not downgrade.            |
| `cookie.secure`            | `AUTH_COOKIE_SECURE`   | no       | `true`  | Set `Secure` on session cookies. Keep `true` in prod.    |
| `cookie.sameSite`          | `AUTH_COOKIE_SAMESITE` | no       | `lax`   | `lax` \| `strict` \| `none`.                             |

Configuration is validated on startup; invalid values throw before any
request is served.

---

## Security caveats

Read these before deploying.

- **Secrets management.** `AUTH_SECRET` must be a high-entropy value (≥32
  random bytes). Never commit it. Rotate on suspected compromise; rotation
  invalidates all outstanding tokens unless a key-id (`kid`) rollover
  strategy is configured.
- **Transport.** Always serve behind HTTPS. Cookie defaults assume TLS;
  setting `cookie.secure=false` outside of local development will leak
  session identifiers.
- **Password storage.** Only `argon2id` (default) and `bcrypt` are
  supported. Plaintext, MD5, SHA-1, and unsalted SHA-2 are rejected at
  config time.
- **Token revocation.** Access tokens are stateless and cannot be revoked
  before expiry — keep `accessTtlSeconds` short. Use refresh-token rotation
  and the session store to invalidate compromised sessions.
- **Refresh token reuse detection.** If the same refresh token is presented
  twice, the entire session family is revoked. Clients must handle being
  logged out unexpectedly.
- **Timing attacks.** Credential comparison uses constant-time primitives.
  Do not bypass `auth.login(...)` with custom comparison logic.
- **Rate limiting.** This package does **not** rate-limit login or token
  endpoints. Apply a rate limiter (e.g. at the gateway) to prevent
  credential stuffing and brute-force attacks.
- **CSRF.** Cookie-based sessions require CSRF protection in the host app
  for state-changing requests. Bearer-token clients are not affected.
- **Logging.** Never log raw tokens, passwords, or `Authorization` headers.
  The package redacts these in its own logs; ensure host logging does too.
- **Clock skew.** Token validation tolerates ±60s of skew. Larger skew on
  servers will cause spurious `TokenExpired` errors.

Report suspected vulnerabilities privately to <security@example.com>; do
not open public issues for security reports.

---

## License

See repository root `LICENSE`.
