/**
 * Tests for Privacy Controls and Data Sanitization
 * @module features/memory/privacy.test
 */

import { describe, it, expect, beforeEach } from "bun:test";
import {
  PrivacyManager,
  DEFAULT_PRIVACY_CONFIG,
  DEFAULT_SENSITIVE_PATTERNS,
} from "./privacy.js";
import type { Memory } from "./types.js";

describe("PrivacyManager", () => {
  let privacyManager: PrivacyManager;

  beforeEach(() => {
    privacyManager = new PrivacyManager();
  });

  describe("constructor", () => {
    it("uses default config when no config provided", () => {
      const config = privacyManager.getConfig();
      expect(config.enabled).toBe(true);
      expect(config.privateTagEnabled).toBe(true);
      expect(config.retentionDays).toBe(90);
      expect(config.maxMemories).toBe(10000);
    });

    it("merges custom config with defaults", () => {
      const customManager = new PrivacyManager({
        retentionDays: 30,
        maxMemories: 5000,
      });
      const config = customManager.getConfig();
      expect(config.enabled).toBe(true);
      expect(config.retentionDays).toBe(30);
      expect(config.maxMemories).toBe(5000);
    });

    it("can disable privacy features", () => {
      const disabledManager = new PrivacyManager({ enabled: false });
      expect(disabledManager.getConfig().enabled).toBe(false);
    });
  });

  describe("sanitize", () => {
    it("returns original content when privacy is disabled", () => {
      const disabledManager = new PrivacyManager({ enabled: false });
      const content = "api_key = secret123";
      expect(disabledManager.sanitize(content)).toBe(content);
    });

    it("redacts API keys", () => {
      const tests = [
        { input: 'api_key = "sk-abc123"', expected: "[REDACTED]" },
        { input: "apikey: secret_value", expected: "[REDACTED]" },
        { input: 'api-key="my-secret-key"', expected: "[REDACTED]" },
      ];

      for (const test of tests) {
        const result = privacyManager.sanitize(test.input);
        expect(result).toContain("[REDACTED]");
        expect(result).not.toContain("sk-abc123");
        expect(result).not.toContain("secret_value");
        expect(result).not.toContain("my-secret-key");
      }
    });

    it("redacts passwords", () => {
      const tests = [
        'password = "super_secret"',
        "passwd: mypassword123",
        'secret="hidden_value"',
      ];

      for (const content of tests) {
        const result = privacyManager.sanitize(content);
        expect(result).toContain("[REDACTED]");
      }
    });

    it("redacts tokens and authorization headers", () => {
      const tests = [
        'token = "jwt_token_here"',
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
        'authorization: "Basic dXNlcjpwYXNz"',
      ];

      for (const content of tests) {
        const result = privacyManager.sanitize(content);
        expect(result).toContain("[REDACTED]");
      }
    });

    it("redacts private keys", () => {
      const privateKey = `-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC7
-----END PRIVATE KEY-----`;
      
      const result = privacyManager.sanitize(privateKey);
      expect(result).toContain("[REDACTED]");
      expect(result).not.toContain("MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC7");
    });

    it("redacts RSA private keys", () => {
      const rsaKey = `-----BEGIN RSA PRIVATE KEY-----
MIIEpQIBAAKCAQEA2...
-----END RSA PRIVATE KEY-----`;
      
      const result = privacyManager.sanitize(rsaKey);
      expect(result).toContain("[REDACTED]");
    });

    it("redacts SSH keys", () => {
      const sshKey = "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQDxyz user@host";
      const result = privacyManager.sanitize(sshKey);
      expect(result).toContain("[REDACTED]");
    });

    it("redacts AWS credentials", () => {
      const tests = [
        "AKIAIOSFODNN7EXAMPLE", // AWS access key ID
        'aws_access_key_id = "AKIAIOSFODNN7EXAMPLE"',
        'aws_secret_access_key = "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"',
      ];

      for (const content of tests) {
        const result = privacyManager.sanitize(content);
        expect(result).toContain("[REDACTED]");
      }
    });

    it("redacts database connection strings", () => {
      const tests = [
        "mongodb://user:password@localhost:27017/db",
        "mysql://root:secret@localhost/mydb",
        "postgres://user:pass@host:5432/database",
        "redis://default:password@localhost:6379",
      ];

      for (const content of tests) {
        const result = privacyManager.sanitize(content);
        expect(result).toContain("[REDACTED]");
      }
    });

    it("redacts environment variable URLs", () => {
      const tests = [
        'DATABASE_URL="postgres://user:pass@host/db"',
        "REDIS_URL: redis://localhost:6379",
        'MONGO_URI = "mongodb://localhost/test"',
      ];

      for (const content of tests) {
        const result = privacyManager.sanitize(content);
        expect(result).toContain("[REDACTED]");
      }
    });

    it("collapses multiple consecutive REDACTED markers", () => {
      const content = 'api_key="key1" password="pass1" token="tok1"';
      const result = privacyManager.sanitize(content);
      expect(result).not.toMatch(/(\[REDACTED\]\s*){3,}/);
    });
  });

  describe("stripPrivateTags", () => {
    it("removes <private> blocks", () => {
      const content = `
Public info here.
<private>
Secret internal notes
</private>
More public info.
      `.trim();

      const result = privacyManager.stripPrivateTags(content);
      expect(result).toContain("Public info here");
      expect(result).toContain("[PRIVATE]");
      expect(result).toContain("More public info");
      expect(result).not.toContain("Secret internal notes");
    });

    it("handles multiple private blocks", () => {
      const content = "<private>secret1</private> text <private>secret2</private>";
      const result = privacyManager.stripPrivateTags(content);
      expect(result).toBe("[PRIVATE] text [PRIVATE]");
    });

    it("handles case-insensitive tags", () => {
      const content = "<PRIVATE>secret</PRIVATE>";
      const result = privacyManager.stripPrivateTags(content);
      expect(result).toBe("[PRIVATE]");
    });

    it("handles nested content", () => {
      const content = "<private>\n  <code>\n    secret code\n  </code>\n</private>";
      const result = privacyManager.stripPrivateTags(content);
      expect(result).toBe("[PRIVATE]");
    });
  });

  describe("containsSensitiveData", () => {
    it("returns true when sensitive data found", () => {
      expect(privacyManager.containsSensitiveData('api_key="test"')).toBe(true);
      expect(privacyManager.containsSensitiveData("AKIAIOSFODNN7EXAMPLE")).toBe(true);
      expect(privacyManager.containsSensitiveData("password: secret")).toBe(true);
    });

    it("returns false for clean content", () => {
      expect(privacyManager.containsSensitiveData("Just normal text")).toBe(false);
      expect(privacyManager.containsSensitiveData("function foo() {}")).toBe(false);
      expect(privacyManager.containsSensitiveData("const x = 123")).toBe(false);
    });

    it("resets regex state between checks", () => {
      // Call multiple times to ensure regex lastIndex is reset
      expect(privacyManager.containsSensitiveData('api_key="test"')).toBe(true);
      expect(privacyManager.containsSensitiveData("clean content")).toBe(false);
      expect(privacyManager.containsSensitiveData('api_key="test"')).toBe(true);
    });
  });

  describe("validateForStorage", () => {
    it("returns valid for clean content", () => {
      const result = privacyManager.validateForStorage("Normal content");
      expect(result.valid).toBe(true);
      expect(result.warnings).toHaveLength(0);
      expect(result.sanitizedContent).toBe("Normal content");
    });

    it("warns and sanitizes sensitive data", () => {
      const result = privacyManager.validateForStorage('api_key="secret"');
      expect(result.valid).toBe(true);
      expect(result.warnings).toContain("Content contained sensitive data that was redacted");
      expect(result.sanitizedContent).toContain("[REDACTED]");
    });

    it("warns and removes private blocks", () => {
      const result = privacyManager.validateForStorage("<private>secret</private>");
      expect(result.valid).toBe(true);
      expect(result.warnings).toContain("Content contained <private> blocks that were removed");
    });

    it("truncates excessively long content", () => {
      const longContent = "a".repeat(15000);
      const result = privacyManager.validateForStorage(longContent);
      expect(result.valid).toBe(true);
      expect(result.warnings).toContain("Content was truncated to 10000 characters");
      expect(result.sanitizedContent.length).toBe(10000);
    });

    it("accumulates multiple warnings", () => {
      const content = '<private>secret</private> api_key="test" ' + "x".repeat(15000);
      const result = privacyManager.validateForStorage(content);
      expect(result.warnings.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe("anonymizeMemory", () => {
    it("sanitizes memory fields", () => {
      const memory: Memory = {
        id: 1,
        type: "observation",
        title: 'Found api_key="secret" in config',
        content: 'The password="admin123" was discovered',
        facts: ["Database uses password: mysecret"],
        concepts: ["security"],
        sourceFiles: [],
        importance: 0.8,
        visibility: "public",
        createdAt: Date.now(),
        updatedAt: Date.now(),
        accessedAt: Date.now(),
        accessCount: 0,
        sessionId: "session-123",
      };

      const anonymized = privacyManager.anonymizeMemory(memory);
      
      expect(anonymized.title).toContain("[REDACTED]");
      expect(anonymized.content).toContain("[REDACTED]");
      expect(anonymized.facts[0]).toContain("[REDACTED]");
      expect(anonymized.sessionId).toBe("[SESSION]");
      expect(anonymized.id).toBe(memory.id);
    });

    it("preserves structure of memory", () => {
      const memory: Memory = {
        id: 42,
        type: "decision",
        title: "Clean title",
        content: "Clean content",
        facts: ["fact 1", "fact 2"],
        concepts: ["concept1"],
        sourceFiles: ["/path/file.ts"],
        importance: 0.5,
        visibility: "private",
        createdAt: Date.now(),
        updatedAt: Date.now(),
        accessedAt: Date.now(),
        accessCount: 5,
      };

      const anonymized = privacyManager.anonymizeMemory(memory);
      
      expect(anonymized.id).toBe(42);
      expect(anonymized.type).toBe("decision");
      expect(anonymized.concepts).toEqual(["concept1"]);
      expect(anonymized.sourceFiles).toEqual(["/path/file.ts"]);
      expect(anonymized.sessionId).toBeUndefined();
    });
  });

  describe("configuration management", () => {
    it("setConfig updates configuration", () => {
      privacyManager.setConfig({ retentionDays: 60 });
      expect(privacyManager.getConfig().retentionDays).toBe(60);
    });

    it("setConfig preserves unset options", () => {
      privacyManager.setConfig({ retentionDays: 60 });
      expect(privacyManager.getConfig().enabled).toBe(true);
      expect(privacyManager.getConfig().maxMemories).toBe(10000);
    });

    it("getConfig returns a copy", () => {
      const config1 = privacyManager.getConfig();
      config1.retentionDays = 999;
      const config2 = privacyManager.getConfig();
      expect(config2.retentionDays).toBe(90);
    });

    it("addSensitivePattern adds custom pattern", () => {
      const customPattern = /custom_secret_\w+/gi;
      privacyManager.addSensitivePattern(customPattern);
      
      const result = privacyManager.sanitize("Found custom_secret_abc123");
      expect(result).toContain("[REDACTED]");
    });

    it("hasPattern checks for existing patterns", () => {
      const existingPattern = DEFAULT_SENSITIVE_PATTERNS[0];
      expect(privacyManager.hasPattern(existingPattern)).toBe(true);
      
      const newPattern = /nonexistent_pattern/gi;
      expect(privacyManager.hasPattern(newPattern)).toBe(false);
    });
  });

  describe("retention policy", () => {
    it("applyRetentionPolicy returns skip message when disabled", async () => {
      const disabledManager = new PrivacyManager({ enabled: false });
      const mockStorage = {
        deleteOlderThan: () => 0,
        trimToMax: () => 0,
      };
      
      const result = await disabledManager.applyRetentionPolicy(mockStorage as any);
      expect(result.deleted).toBe(0);
      expect(result.reason).toBe("Privacy disabled");
    });

    it("applyRetentionPolicy calls storage.deleteOlderThan", async () => {
      let calledWith: number | undefined;
      const mockStorage = {
        deleteOlderThan: (days: number) => {
          calledWith = days;
          return 5;
        },
        trimToMax: () => 0,
      };
      
      const result = await privacyManager.applyRetentionPolicy(mockStorage as any);
      expect(calledWith).toBe(90);
      expect(result.deleted).toBe(5);
      expect(result.reason).toContain("90 days");
    });
  });

  describe("max limit", () => {
    it("applyMaxLimit returns skip message when disabled", async () => {
      const disabledManager = new PrivacyManager({ enabled: false });
      const mockStorage = {
        deleteOlderThan: () => 0,
        trimToMax: () => 0,
      };
      
      const result = await disabledManager.applyMaxLimit(mockStorage as any);
      expect(result.deleted).toBe(0);
      expect(result.reason).toBe("Privacy disabled");
    });

    it("applyMaxLimit calls storage.trimToMax", async () => {
      let calledWith: number | undefined;
      const mockStorage = {
        deleteOlderThan: () => 0,
        trimToMax: (max: number) => {
          calledWith = max;
          return 3;
        },
      };
      
      const result = await privacyManager.applyMaxLimit(mockStorage as any);
      expect(calledWith).toBe(10000);
      expect(result.deleted).toBe(3);
      expect(result.reason).toContain("10000 memories");
    });
  });

  describe("runMaintenance", () => {
    it("runs both retention and max limit policies", async () => {
      const mockStorage = {
        deleteOlderThan: () => 2,
        trimToMax: () => 1,
      };
      
      const result = await privacyManager.runMaintenance(mockStorage as any);
      expect(result.retention.deleted).toBe(2);
      expect(result.maxLimit.deleted).toBe(1);
    });
  });
});

describe("DEFAULT_SENSITIVE_PATTERNS", () => {
  it("contains expected number of patterns", () => {
    expect(DEFAULT_SENSITIVE_PATTERNS.length).toBeGreaterThan(10);
  });

  it("all patterns are RegExp objects", () => {
    for (const pattern of DEFAULT_SENSITIVE_PATTERNS) {
      expect(pattern).toBeInstanceOf(RegExp);
    }
  });
});

describe("DEFAULT_PRIVACY_CONFIG", () => {
  it("has expected default values", () => {
    expect(DEFAULT_PRIVACY_CONFIG.enabled).toBe(true);
    expect(DEFAULT_PRIVACY_CONFIG.privateTagEnabled).toBe(true);
    expect(DEFAULT_PRIVACY_CONFIG.retentionDays).toBe(90);
    expect(DEFAULT_PRIVACY_CONFIG.maxMemories).toBe(10000);
    expect(DEFAULT_PRIVACY_CONFIG.stripPatterns).toBe(DEFAULT_SENSITIVE_PATTERNS);
  });
});
