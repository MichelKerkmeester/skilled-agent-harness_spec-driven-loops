/**
 * Privacy Controls and Data Sanitization
 * Handles sensitive data redaction and retention policies
 * @module features/memory/privacy
 */

import type { PrivacyConfig, Memory } from "./types.js";
import { MemoryStorage } from "./storage/sqlite.js";

/**
 * Default sensitive patterns to strip
 */
export const DEFAULT_SENSITIVE_PATTERNS: RegExp[] = [
  // API keys
  /api[_-]?key\s*[:=]\s*["']?[\w-]+["']?/gi,
  /apikey\s*[:=]\s*["']?[\w-]+["']?/gi,
  
  // Passwords and secrets
  /password\s*[:=]\s*["']?[^"'\s]+["']?/gi,
  /passwd\s*[:=]\s*["']?[^"'\s]+["']?/gi,
  /secret\s*[:=]\s*["']?[\w.-]+["']?/gi,
  
  // Tokens
  /token\s*[:=]\s*["']?[\w.-]+["']?/gi,
  /bearer\s+[\w.-]+/gi,
  /authorization\s*:\s*["']?[\w.-]+["']?/gi,
  
  // Private keys
  /-----BEGIN\s+(?:RSA\s+)?PRIVATE\s+KEY-----[\s\S]*?-----END\s+(?:RSA\s+)?PRIVATE\s+KEY-----/gi,
  /-----BEGIN\s+ENCRYPTED\s+PRIVATE\s+KEY-----[\s\S]*?-----END\s+ENCRYPTED\s+PRIVATE\s+KEY-----/gi,
  
  // SSH keys
  /ssh-(?:rsa|ed25519|dss)\s+[A-Za-z0-9+/=]+/gi,
  
  // AWS credentials
  /AKIA[0-9A-Z]{16}/g,
  /aws_access_key_id\s*[:=]\s*["']?[A-Z0-9]+["']?/gi,
  /aws_secret_access_key\s*[:=]\s*["']?[\w/+=]+["']?/gi,
  
  // Database connection strings
  /(?:mongodb|mysql|postgres|redis):\/\/[^\s"']+/gi,
  
  // Environment variables with sensitive names
  /(?:DATABASE_URL|REDIS_URL|MONGO_URI)\s*[:=]\s*["']?[^\s"']+["']?/gi,
];

/**
 * Default privacy configuration
 */
export const DEFAULT_PRIVACY_CONFIG: PrivacyConfig = {
  enabled: true,
  stripPatterns: DEFAULT_SENSITIVE_PATTERNS,
  privateTagEnabled: true,
  retentionDays: 90,
  maxMemories: 10000,
};

/**
 * Privacy Manager
 * Handles content sanitization and retention policies
 */
export class PrivacyManager {
  private config: PrivacyConfig;

  constructor(config?: Partial<PrivacyConfig>) {
    this.config = { ...DEFAULT_PRIVACY_CONFIG, ...config };
  }

  /**
   * Sanitize content by removing sensitive data
   */
  sanitize(content: string): string {
    if (!this.config.enabled) {
      return content;
    }

    let sanitized = content;

    // Remove <private> blocks first
    if (this.config.privateTagEnabled) {
      sanitized = this.stripPrivateTags(sanitized);
    }

    // Apply sensitive patterns
    for (const pattern of this.config.stripPatterns) {
      sanitized = sanitized.replace(pattern, "[REDACTED]");
    }

    // Clean up multiple consecutive [REDACTED] markers
    sanitized = sanitized.replace(/(\[REDACTED\]\s*)+/g, "[REDACTED] ");

    return sanitized;
  }

  /**
   * Strip <private> tags and their content
   */
  stripPrivateTags(content: string): string {
    return content.replace(/<private>[\s\S]*?<\/private>/gi, "[PRIVATE]");
  }

  /**
   * Check if content contains sensitive data
   */
  containsSensitiveData(content: string): boolean {
    for (const pattern of this.config.stripPatterns) {
      // Reset regex state
      pattern.lastIndex = 0;
      if (pattern.test(content)) {
        return true;
      }
    }
    return false;
  }

  /**
   * Apply retention policy - delete memories older than configured days
   */
  async applyRetentionPolicy(storage: MemoryStorage): Promise<{
    deleted: number;
    reason: string;
  }> {
    if (!this.config.enabled) {
      return { deleted: 0, reason: "Privacy disabled" };
    }

    const deleted = storage.deleteOlderThan(this.config.retentionDays);

    return {
      deleted,
      reason: `Deleted memories older than ${this.config.retentionDays} days`,
    };
  }

  /**
   * Apply max memory limit - delete oldest/least important if over limit
   */
  async applyMaxLimit(storage: MemoryStorage): Promise<{
    deleted: number;
    reason: string;
  }> {
    if (!this.config.enabled) {
      return { deleted: 0, reason: "Privacy disabled" };
    }

    const deleted = storage.trimToMax(this.config.maxMemories);

    return {
      deleted,
      reason: `Trimmed to max ${this.config.maxMemories} memories`,
    };
  }

  /**
   * Run all maintenance tasks
   */
  async runMaintenance(storage: MemoryStorage): Promise<{
    retention: { deleted: number; reason: string };
    maxLimit: { deleted: number; reason: string };
  }> {
    const retention = await this.applyRetentionPolicy(storage);
    const maxLimit = await this.applyMaxLimit(storage);

    return { retention, maxLimit };
  }

  /**
   * Validate memory content before storage
   */
  validateForStorage(content: string): {
    valid: boolean;
    warnings: string[];
    sanitizedContent: string;
  } {
    const warnings: string[] = [];
    let sanitizedContent = content;

    // Check for sensitive data
    if (this.containsSensitiveData(content)) {
      warnings.push("Content contained sensitive data that was redacted");
      sanitizedContent = this.sanitize(content);
    }

    // Check for private tags
    if (/<private>/i.test(content)) {
      warnings.push("Content contained <private> blocks that were removed");
      sanitizedContent = this.stripPrivateTags(sanitizedContent);
    }

    // Check for excessive length
    if (content.length > 10000) {
      warnings.push("Content was truncated to 10000 characters");
      sanitizedContent = sanitizedContent.slice(0, 10000);
    }

    return {
      valid: true,
      warnings,
      sanitizedContent,
    };
  }

  /**
   * Get anonymized memory for export/debugging
   */
  anonymizeMemory(memory: Memory): Memory {
    return {
      ...memory,
      content: this.sanitize(memory.content),
      title: this.sanitize(memory.title),
      facts: memory.facts.map((f) => this.sanitize(f)),
      sessionId: memory.sessionId ? "[SESSION]" : undefined,
    };
  }

  /**
   * Update configuration
   */
  setConfig(config: Partial<PrivacyConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Get current configuration
   */
  getConfig(): PrivacyConfig {
    return { ...this.config };
  }

  /**
   * Add a custom sensitive pattern
   */
  addSensitivePattern(pattern: RegExp): void {
    this.config.stripPatterns.push(pattern);
  }

  /**
   * Check if a specific pattern is in the strip list
   */
  hasPattern(pattern: RegExp): boolean {
    return this.config.stripPatterns.some(
      (p) => p.source === pattern.source && p.flags === pattern.flags
    );
  }
}
