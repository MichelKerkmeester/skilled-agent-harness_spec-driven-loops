// ───────────────────────────────────────────────────────────────
// DEFENSE-IN-DEPTH VALIDATION PATTERNS
// ───────────────────────────────────────────────────────────────
// Production-ready validation templates
// Validates at every layer to make errors structurally impossible
// ───────────────────────────────────────────────────────────────

/* ─────────────────────────────────────────────────────────────
   1. GENERIC VALIDATION PATTERNS
──────────────────────────────────────────────────────────────── */

/**
 * Contact Form with Multi-Layer Validation
 * Example implementation of defense-in-depth for form handling
 */
class ContactForm {
  constructor(formElement) {
    // Layer 1: Constructor validation
    if (!formElement) {
      throw new Error('[ContactForm] Form element required');
    }

    this.form = formElement;
    this.setupValidation();
  }

  setupValidation() {
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleSubmit();
    });

    // Real-time validation
    const inputs = this.form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
      input.addEventListener('blur', () => this.validateField(input));
    });
  }

  validateField(field) {
    // Layer 2: Field-level validation
    const value = field.value?.trim();
    const fieldName = field.name;

    // Clear previous errors
    this.clearFieldError(field);

    // Required field check
    if (field.hasAttribute('required') && !value) {
      this.showFieldError(field, `${fieldName} is required`);
      return false;
    }

    // Type-specific validation
    switch (field.type) {
      case 'email':
        if (value && !this.isValidEmail(value)) {
          this.showFieldError(field, 'Invalid email address');
          return false;
        }
        break;

      case 'tel':
        if (value && !this.isValidPhone(value)) {
          this.showFieldError(field, 'Invalid phone number');
          return false;
        }
        break;
    }

    return true;
  }

  isValidEmail(email) {
    // Layer 3: Format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  isValidPhone(phone) {
    const cleaned = phone.replace(/[\s\-\(\)]/g, '');
    return /^\d{10,15}$/.test(cleaned);
  }

  async handleSubmit() {
    console.log('[ContactForm] Submitting...');

    // Layer 2: Validate all fields
    const fields = this.form.querySelectorAll('input, textarea');
    let isValid = true;

    fields.forEach(field => {
      if (!this.validateField(field)) {
        isValid = false;
      }
    });

    if (!isValid) {
      console.warn('[ContactForm] Validation failed');
      return;
    }

    // Layer 3: Collect and sanitize data
    const formData = new FormData(this.form);
    const data = {
      name: this.sanitizeText(formData.get('name')),
      email: this.sanitizeEmail(formData.get('email')),
      message: this.sanitizeText(formData.get('message'))
    };

    // Final validation
    if (!data.name || !data.email || !data.message) {
      console.error('[ContactForm] Sanitization removed all content');
      this.showFormError('Please check your input and try again');
      return;
    }

    // Submit
    try {
      const result = await this.submitToAPI(data);

      // Layer 4: Validate API response
      if (result && result.success) {
        this.showFormSuccess('Message sent successfully!');
        this.form.reset();
      } else {
        throw new Error(result?.message || 'Submission failed');
      }

    } catch (error) {
      console.error('[ContactForm] Submission failed:', error);
      this.showFormError('Failed to send message. Please try again.');
    }
  }

  sanitizeText(text) {
    if (!text || typeof text !== 'string') return '';

    return text
      .trim()
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .slice(0, 1000);
  }

  sanitizeEmail(email) {
    if (!email || typeof email !== 'string') return '';

    return email
      .toLowerCase()
      .trim()
      .slice(0, 254);
  }

  async submitToAPI(data) {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    return response.json();
  }

  showFieldError(field, message) {
    field.classList.add('error');
    const errorEl = field.parentElement.querySelector('.error-message');
    if (errorEl) errorEl.textContent = message;
  }

  clearFieldError(field) {
    field.classList.remove('error');
    const errorEl = field.parentElement.querySelector('.error-message');
    if (errorEl) errorEl.textContent = '';
  }

  showFormSuccess(message) {
    const successEl = this.form.querySelector('[form-success]');
    if (successEl) {
      successEl.textContent = message;
      successEl.style.display = 'block';
    }
  }

  showFormError(message) {
    const errorEl = this.form.querySelector('[form-error]');
    if (errorEl) {
      errorEl.textContent = message;
      errorEl.style.display = 'block';
    }
  }
}

/**
 * API Client with Multi-Layer Error Handling
 */
class APIClient {
  constructor(baseURL) {
    // Layer 1: Constructor validation
    if (!baseURL || typeof baseURL !== 'string') {
      throw new Error('[API] Base URL required');
    }

    this.baseURL = baseURL.replace(/\/$/, '');
  }

  async get(endpoint, params = {}) {
    return this.request('GET', endpoint, null, params);
  }

  async post(endpoint, data) {
    return this.request('POST', endpoint, data);
  }

  async request(method, endpoint, data = null, params = {}) {
    // Layer 1: Method validation
    const allowedMethods = ['GET', 'POST', 'PUT', 'DELETE'];
    if (!allowedMethods.includes(method)) {
      throw new Error(`[API] Invalid HTTP method: ${method}`);
    }

    // Layer 2: Endpoint validation
    if (!endpoint || typeof endpoint !== 'string') {
      throw new Error('[API] Endpoint required');
    }

    const url = new URL(`${this.baseURL}${endpoint}`);

    // Add query parameters
    if (method === 'GET' && params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    const options = {
      method,
      headers: { 'Content-Type': 'application/json' }
    };

    if (data && ['POST', 'PUT'].includes(method)) {
      options.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(url, options);

      // Layer 3: Response validation
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      // Layer 4: JSON validation
      const json = await response.json();

      if (json === null || json === undefined) {
        throw new Error('[API] Empty response');
      }

      return json;

    } catch (error) {
      console.error(`[API] Request failed:`, error);
      throw error;
    }
  }
}


/* ─────────────────────────────────────────────────────────────
   2. WEBFLOW + FORMSPARK INTEGRATION PATTERNS
──────────────────────────────────────────────────────────────── */

/**
 * Botpoison Spam Protection
 *
 * Provides async SDK loading and challenge token resolution for forms.
 * Singleton pattern ensures SDK loads only once per page.
 *
 * @example
 * const protection = new BotpoisonProtection({ publicKey: 'pk_xxx' });
 * const token = await protection.getToken();
 * if (token) formData.set('_botpoison', token);
 */
class BotpoisonProtection {
  static SDK_URL = 'https://unpkg.com/@botpoison/browser';
  static MAX_CLIENTS = 10;
  static DEFAULT_TIMEOUT_MS = 10000;

  /** @type {Promise<boolean>|null} */
  static sdkLoader = null;

  /** @type {Map<string, object>} */
  static clients = new Map();

  /**
   * @param {Object} config
   * @param {string} config.publicKey - Botpoison public key
   * @param {number} [config.timeoutMs=10000] - Challenge timeout in ms
   */
  constructor(config = {}) {
    if (!config.publicKey || typeof config.publicKey !== 'string') {
      throw new Error('[BotpoisonProtection] publicKey required');
    }

    this.publicKey = config.publicKey.trim();
    this.timeoutMs = config.timeoutMs || BotpoisonProtection.DEFAULT_TIMEOUT_MS;
  }

  /**
   * Load Botpoison SDK asynchronously (singleton)
   * @returns {Promise<boolean>} - True if SDK loaded successfully
   */
  static async loadSDK() {
    // Already loaded
    if (typeof window.Botpoison !== 'undefined') {
      return true;
    }

    // Loading in progress
    if (BotpoisonProtection.sdkLoader) {
      return BotpoisonProtection.sdkLoader;
    }

    // Start loading
    BotpoisonProtection.sdkLoader = new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = BotpoisonProtection.SDK_URL;
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => {
        BotpoisonProtection.sdkLoader = null; // Allow retry
        resolve(false);
      };
      document.head.appendChild(script);
    });

    return BotpoisonProtection.sdkLoader;
  }

  /**
   * Get or create a Botpoison client for this public key
   * Uses LRU-style eviction when max clients reached
   * @returns {object|null}
   */
  getClient() {
    if (!BotpoisonProtection.clients.has(this.publicKey)) {
      // Evict oldest if at capacity
      if (BotpoisonProtection.clients.size >= BotpoisonProtection.MAX_CLIENTS) {
        const firstKey = BotpoisonProtection.clients.keys().next().value;
        BotpoisonProtection.clients.delete(firstKey);
      }

      BotpoisonProtection.clients.set(
        this.publicKey,
        new window.Botpoison({ publicKey: this.publicKey })
      );
    }

    return BotpoisonProtection.clients.get(this.publicKey);
  }

  /**
   * Solve the Botpoison challenge and return token
   * @returns {Promise<string|null>} - Token string or null on failure
   */
  async getToken() {
    const sdkLoaded = await BotpoisonProtection.loadSDK();

    if (!sdkLoaded || typeof window.Botpoison === 'undefined') {
      console.warn('[BotpoisonProtection] SDK failed to load');
      return null;
    }

    const client = this.getClient();
    if (!client) {
      return null;
    }

    try {
      // Race challenge against timeout
      const challenge = client.challenge();
      const timeout = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Botpoison timeout')), this.timeoutMs)
      );

      const result = await Promise.race([challenge, timeout]);

      if (!result) {
        return null;
      }

      // Handle both token formats (token or solution)
      const token =
        (typeof result.token === 'string' && result.token) ||
        (typeof result.solution === 'string' && result.solution) ||
        '';

      return token || null;

    } catch (error) {
      console.warn('[BotpoisonProtection] Challenge failed:', error.message);
      return null;
    }
  }

  /**
   * Check if Botpoison is required for a form element
   * @param {HTMLFormElement} form
   * @returns {boolean}
   */
  static isRequired(form) {
    const key = (
      form.getAttribute('data-botpoison-public-key') ||
      form.getAttribute('data-botpoison-key') ||
      ''
    ).trim();
    return key.length > 0;
  }

  /**
   * Create protection instance from form attributes
   * @param {HTMLFormElement} form
   * @returns {BotpoisonProtection|null}
   */
  static fromForm(form) {
    const key = (
      form.getAttribute('data-botpoison-public-key') ||
      form.getAttribute('data-botpoison-key') ||
      ''
    ).trim();

    if (!key) {
      return null;
    }

    return new BotpoisonProtection({ publicKey: key });
  }
}


/**
 * Webflow Form State Manager
 *
 * Handles Webflow's `.w-form-done` and `.w-form-fail` state blocks.
 * Provides methods to show/hide success/error states while respecting
 * Webflow's DOM structure.
 *
 * @example
 * const stateManager = new WebflowFormState(formElement);
 * stateManager.showSuccess();  // Shows .w-form-done, hides form
 * stateManager.showError();    // Shows .w-form-fail
 * stateManager.reset();        // Restores initial state
 */
class WebflowFormState {
  /**
   * @param {HTMLFormElement} form
   */
  constructor(form) {
    if (!form) {
      throw new Error('[WebflowFormState] Form element required');
    }

    this.form = form;
    this.formBlock = form.closest('.w-form') || form.parentElement;
    this.doneEl = this.formBlock?.querySelector('.w-form-done');
    this.failEl = this.formBlock?.querySelector('.w-form-fail');
  }

  /**
   * Show success state (Webflow .w-form-done)
   * @param {Object} options
   * @param {boolean} [options.hideForm=false] - Hide the form element
   * @param {boolean} [options.hideError=true] - Hide error message
   */
  showSuccess(options = {}) {
    const { hideForm = false, hideError = true } = options;

    if (hideError && this.failEl) {
      this.failEl.style.display = 'none';
      this.failEl.setAttribute('aria-hidden', 'true');
    }

    if (this.doneEl) {
      this.doneEl.style.display = 'block';
      this.doneEl.setAttribute('aria-hidden', 'false');
    }

    if (hideForm) {
      this.form.style.display = 'none';
      this.form.setAttribute('aria-hidden', 'true');
    }
  }

  /**
   * Show error state (Webflow .w-form-fail)
   * @param {Object} options
   * @param {boolean} [options.hideSuccess=true] - Hide success message
   * @param {string} [options.message] - Custom error message
   */
  showError(options = {}) {
    const { hideSuccess = true, message } = options;

    if (hideSuccess && this.doneEl) {
      this.doneEl.style.display = 'none';
      this.doneEl.setAttribute('aria-hidden', 'true');
    }

    if (this.failEl) {
      this.failEl.style.display = 'block';
      this.failEl.setAttribute('aria-hidden', 'false');

      // Update message if provided
      if (message) {
        const msgEl = this.failEl.querySelector('[data-error-message]') ||
                      this.failEl.querySelector('.w-form-fail-msg') ||
                      this.failEl;
        if (msgEl.textContent !== undefined) {
          msgEl.textContent = message;
        }
      }
    }
  }

  /**
   * Reset to initial state (form visible, messages hidden)
   */
  reset() {
    if (this.doneEl) {
      this.doneEl.style.display = 'none';
      this.doneEl.setAttribute('aria-hidden', 'true');
    }

    if (this.failEl) {
      this.failEl.style.display = 'none';
      this.failEl.setAttribute('aria-hidden', 'true');
    }

    this.form.style.display = '';
    this.form.removeAttribute('aria-hidden');
  }

  /**
   * Check if Webflow form structure is present
   * @returns {boolean}
   */
  hasWebflowStructure() {
    return Boolean(this.formBlock?.classList.contains('w-form'));
  }
}


/**
 * Webflow Form Controller
 *
 * Production-ready form handler for Webflow sites with:
 * - Formspark/submit-form.com integration
 * - Botpoison spam protection
 * - Webflow state management (.w-form-done, .w-form-fail)
 * - Retry with exponential backoff
 * - Native form fallback for CORS issues
 * - Debounced real-time validation
 *
 * @example
 * // Auto-discovery (recommended)
 * WebflowForm.init();
 *
 * // Manual instantiation
 * const form = document.querySelector('form[data-formspark-url]');
 * const controller = new WebflowForm(form, {
 *   endpoint: 'https://submit-form.com/xxx',
 *   botpoisonKey: 'pk_xxx',
 *   resetOnSuccess: true
 * });
 */
class WebflowForm {
  /** Form selector for auto-discovery */
  static FORM_SELECTOR = 'form[action*="submit-form.com"], form[data-formspark-url]';

  /** Submit button selector */
  static SUBMIT_SELECTOR = 'button[type="submit"], input[type="submit"], [data-submit-button]';

  /** HTTP status codes that warrant retry */
  static RETRYABLE_STATUS = new Set([408, 429, 500, 502, 503, 504]);

  /** Default configuration */
  static DEFAULTS = {
    timeoutMs: 30000,
    retryCount: 2,
    retryDelayMs: 1000,
    resetDelayMs: 200,
    botpoisonTimeoutMs: 10000,
    enableFallback: true,
    validateOnBlur: true,
    debounceMs: 300
  };

  /** @type {Map<HTMLFormElement, WebflowForm>} */
  static instances = new Map();

  /**
   * @param {HTMLFormElement} form
   * @param {Object} [config]
   * @param {string} [config.endpoint] - Form submission URL
   * @param {string} [config.botpoisonKey] - Botpoison public key
   * @param {boolean} [config.resetOnSuccess=true] - Reset form after success
   * @param {number} [config.resetDelayMs=200] - Delay before reset
   * @param {boolean} [config.enableFallback=true] - Enable native fallback
   * @param {boolean} [config.validateOnBlur=true] - Validate fields on blur
   * @param {number} [config.debounceMs=300] - Validation debounce delay
   */
  constructor(form, config = {}) {
    if (!form || !(form instanceof HTMLFormElement)) {
      throw new Error('[WebflowForm] Valid form element required');
    }

    this.form = form;
    this.config = this.resolveConfig(config);
    this.state = 'idle'; // idle | submitting | success | error
    this.stateManager = new WebflowFormState(form);
    this.submitButtons = Array.from(form.querySelectorAll(WebflowForm.SUBMIT_SELECTOR));
    this.nativeSubmit = typeof form.submit === 'function' ? form.submit.bind(form) : null;
    this.resetTimeout = null;
    this.debounceTimers = new Map();

    // Bind event handlers
    this.onSubmit = this.handleSubmit.bind(this);
    this.bindEvents();

    // Mark as enhanced
    this.form.dataset.webflowFormEnhanced = 'true';
  }

  /**
   * Resolve configuration from attributes and provided config
   * @param {Object} config
   * @returns {Object}
   */
  resolveConfig(config) {
    const endpoint = (
      config.endpoint ||
      this.form.getAttribute('data-formspark-url') ||
      this.form.getAttribute('action') ||
      ''
    ).trim();

    const botpoisonKey = (
      config.botpoisonKey ||
      this.form.getAttribute('data-botpoison-public-key') ||
      this.form.getAttribute('data-botpoison-key') ||
      ''
    ).trim();

    return {
      endpoint,
      botpoisonKey,
      resetOnSuccess: config.resetOnSuccess ?? true,
      resetDelayMs: config.resetDelayMs ?? WebflowForm.DEFAULTS.resetDelayMs,
      enableFallback: config.enableFallback ?? WebflowForm.DEFAULTS.enableFallback,
      validateOnBlur: config.validateOnBlur ?? WebflowForm.DEFAULTS.validateOnBlur,
      debounceMs: config.debounceMs ?? WebflowForm.DEFAULTS.debounceMs,
      timeoutMs: WebflowForm.DEFAULTS.timeoutMs,
      retryCount: WebflowForm.DEFAULTS.retryCount,
      retryDelayMs: WebflowForm.DEFAULTS.retryDelayMs
    };
  }

  /**
   * Bind form events
   */
  bindEvents() {
    // Intercept submit
    this.form.addEventListener('submit', this.onSubmit, { capture: true });

    // Real-time validation on blur (debounced)
    if (this.config.validateOnBlur) {
      const inputs = this.form.querySelectorAll('input, textarea, select');
      inputs.forEach(input => {
        input.addEventListener('blur', () => this.debouncedValidate(input));
        input.addEventListener('input', () => this.clearFieldError(input));
      });
    }

    // Prevent Enter in textarea from submitting (mobile fix)
    this.form.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' && event.target.tagName === 'TEXTAREA') {
        event.stopPropagation();
        // Allow default textarea behavior (newline insertion)
      }
    }, true);
  }

  /**
   * Debounced field validation
   * @param {HTMLElement} field
   */
  debouncedValidate(field) {
    const existingTimer = this.debounceTimers.get(field);
    if (existingTimer) {
      clearTimeout(existingTimer);
    }

    const timer = setTimeout(() => {
      this.validateField(field);
      this.debounceTimers.delete(field);
    }, this.config.debounceMs);

    this.debounceTimers.set(field, timer);
  }

  /**
   * Validate a single field
   * @param {HTMLElement} field
   * @returns {boolean}
   */
  validateField(field) {
    const value = field.value?.trim() || '';

    this.clearFieldError(field);

    // Required check
    if (field.hasAttribute('required') && !value) {
      this.showFieldError(field, 'This field is required');
      return false;
    }

    // Type-specific validation
    if (value) {
      switch (field.type) {
        case 'email':
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            this.showFieldError(field, 'Please enter a valid email');
            return false;
          }
          break;

        case 'tel':
          const cleaned = value.replace(/[\s\-\(\)\.]/g, '');
          if (!/^\+?\d{7,15}$/.test(cleaned)) {
            this.showFieldError(field, 'Please enter a valid phone number');
            return false;
          }
          break;

        case 'url':
          try {
            const url = new URL(value);
            // Security: Only allow safe URL schemes
            if (!['http:', 'https:'].includes(url.protocol)) {
              this.showFieldError(field, 'Only HTTP and HTTPS URLs are allowed');
              return false;
            }
          } catch {
            this.showFieldError(field, 'Please enter a valid URL');
            return false;
          }
          break;
      }
    }

    // Custom validation via pattern attribute
    if (field.pattern && value) {
      const regex = new RegExp(field.pattern);
      if (!regex.test(value)) {
        const message = field.getAttribute('data-error-message') || 'Invalid format';
        this.showFieldError(field, message);
        return false;
      }
    }

    return true;
  }

  /**
   * Show field-level error
   * @param {HTMLElement} field
   * @param {string} message
   */
  showFieldError(field, message) {
    field.classList.add('error', 'w-input-error');
    field.setAttribute('aria-invalid', 'true');

    // Find or create error element
    const errorId = `${field.id || field.name}-error`;
    let errorEl = field.parentElement?.querySelector(`[data-error-for="${field.name}"]`) ||
                  field.parentElement?.querySelector('.field-error-message') ||
                  document.getElementById(errorId);

    if (errorEl) {
      errorEl.textContent = message;
      errorEl.style.display = 'block';
      field.setAttribute('aria-describedby', errorEl.id || errorId);
    }
  }

  /**
   * Clear field-level error
   * @param {HTMLElement} field
   */
  clearFieldError(field) {
    field.classList.remove('error', 'w-input-error');
    field.removeAttribute('aria-invalid');
    field.removeAttribute('aria-describedby');

    const errorEl = field.parentElement?.querySelector(`[data-error-for="${field.name}"]`) ||
                    field.parentElement?.querySelector('.field-error-message');

    if (errorEl) {
      errorEl.textContent = '';
      errorEl.style.display = 'none';
    }
  }

  /**
   * Handle form submission
   * @param {SubmitEvent} event
   */
  async handleSubmit(event) {
    if (event) {
      event.preventDefault();
      event.stopImmediatePropagation?.() || event.stopPropagation?.();
    }

    // Prevent double submission
    if (this.state === 'submitting') {
      return;
    }

    // Validate all fields
    const fields = this.form.querySelectorAll('input, textarea, select');
    let isValid = true;

    fields.forEach(field => {
      if (!this.validateField(field)) {
        isValid = false;
      }
    });

    // Also use native validation
    if (!this.form.checkValidity()) {
      this.form.reportValidity?.();
      return;
    }

    if (!isValid) {
      return;
    }

    // Begin submission
    this.state = 'submitting';
    this.setLoadingState(true);

    try {
      // Collect form data
      const formData = new FormData(this.form);

      // Solve Botpoison challenge if configured
      if (this.config.botpoisonKey) {
        const protection = new BotpoisonProtection({
          publicKey: this.config.botpoisonKey
        });

        const token = await protection.getToken();

        if (!token) {
          throw new Error('Spam protection challenge failed');
        }

        formData.set('_botpoison', token);
      }

      // Submit with retry
      const response = await this.submitWithRetry(formData);

      if (!response.ok) {
        throw new Error(`Submission failed: ${response.status}`);
      }

      // Success
      await this.handleSuccess();

    } catch (error) {
      console.error('[WebflowForm] Submission error:', error);

      // Check for CORS/network errors that might benefit from fallback
      const isCorsError = error.message && (
        error.message.includes('Failed to fetch') ||
        error.message.includes('NetworkError') ||
        error.message.includes('CORS')
      );

      if (this.config.enableFallback && isCorsError && this.nativeSubmit) {
        console.warn('[WebflowForm] Falling back to native submission');
        this.state = 'idle';
        this.setLoadingState(false);
        this.nativeSubmit.call(this.form);
        return;
      }

      this.handleError(error);

    } finally {
      if (this.state === 'submitting') {
        this.state = 'idle';
      }
      this.setLoadingState(false);
    }
  }

  /**
   * Submit form data with retry/backoff
   * @param {FormData} formData
   * @param {number} [attempt=0]
   * @returns {Promise<Response>}
   */
  async submitWithRetry(formData, attempt = 0) {
    // Convert FormData to JSON
    const json = {};
    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.warn(`[WebflowForm] File field "${key}" skipped (JSON mode)`);
        continue;
      }

      // Handle multiple values (checkboxes)
      if (key in json) {
        if (!Array.isArray(json[key])) {
          json[key] = [json[key]];
        }
        json[key].push(value);
      } else {
        json[key] = value;
      }
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(
      () => controller.abort(),
      this.config.timeoutMs
    );

    try {
      const response = await fetch(this.config.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(json),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        return response;
      }

      // Retry for transient errors
      if (WebflowForm.RETRYABLE_STATUS.has(response.status) &&
          attempt < this.config.retryCount) {
        const delay = this.config.retryDelayMs * Math.pow(2, attempt);
        await this.wait(delay);
        return this.submitWithRetry(formData, attempt + 1);
      }

      return response;

    } catch (error) {
      clearTimeout(timeoutId);

      // Retry on abort/network errors
      if (attempt < this.config.retryCount) {
        const delay = this.config.retryDelayMs * Math.pow(2, attempt);
        await this.wait(delay);
        return this.submitWithRetry(formData, attempt + 1);
      }

      throw error;
    }
  }

  /**
   * Handle successful submission
   */
  async handleSuccess() {
    this.state = 'success';
    this.form.setAttribute('data-state', 'success');

    // Show Webflow success state
    this.stateManager.showSuccess();

    // Dispatch custom events
    this.form.dispatchEvent(new CustomEvent('webflowform:success', {
      bubbles: true,
      detail: { controller: this }
    }));

    // Reset form after delay
    if (this.config.resetOnSuccess) {
      this.resetTimeout = setTimeout(() => {
        this.resetForm();
      }, this.config.resetDelayMs);
    }
  }

  /**
   * Handle submission error
   * @param {Error} error
   */
  handleError(error) {
    this.state = 'error';
    this.form.setAttribute('data-state', 'error');

    // Show Webflow error state
    this.stateManager.showError({
      message: 'Something went wrong. Please try again.'
    });

    // Dispatch custom event
    this.form.dispatchEvent(new CustomEvent('webflowform:error', {
      bubbles: true,
      detail: { controller: this, error }
    }));
  }

  /**
   * Set loading state on form and buttons
   * @param {boolean} isLoading
   */
  setLoadingState(isLoading) {
    this.form.toggleAttribute('aria-busy', isLoading);
    this.form.setAttribute('data-state', isLoading ? 'submitting' : this.state);

    this.submitButtons.forEach(button => {
      button.disabled = isLoading;
      button.classList.toggle('is-loading', isLoading);
    });
  }

  /**
   * Reset form to initial state
   */
  resetForm() {
    if (this.resetTimeout) {
      clearTimeout(this.resetTimeout);
      this.resetTimeout = null;
    }

    this.form.reset();
    this.stateManager.reset();
    this.state = 'idle';
    this.form.removeAttribute('data-state');

    // Clear all field errors
    const fields = this.form.querySelectorAll('input, textarea, select');
    fields.forEach(field => this.clearFieldError(field));
  }

  /**
   * Promise-based delay
   * @param {number} ms
   * @returns {Promise<void>}
   */
  wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Cleanup and destroy instance
   */
  destroy() {
    if (this.resetTimeout) {
      clearTimeout(this.resetTimeout);
    }

    this.debounceTimers.forEach(timer => clearTimeout(timer));
    this.debounceTimers.clear();

    this.form.removeEventListener('submit', this.onSubmit, { capture: true });
    this.form.removeAttribute('data-webflow-form-enhanced');
    this.state = 'idle';

    WebflowForm.instances.delete(this.form);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Static Methods: Auto-Discovery & Initialization
  // ─────────────────────────────────────────────────────────────────────────

  /**
   * Initialize all matching forms on the page
   */
  static init() {
    const forms = document.querySelectorAll(WebflowForm.FORM_SELECTOR);
    forms.forEach(form => {
      if (!WebflowForm.instances.has(form)) {
        const controller = new WebflowForm(form);
        WebflowForm.instances.set(form, controller);
      }
    });
  }

  /**
   * Destroy all instances
   */
  static destroyAll() {
    WebflowForm.instances.forEach(controller => controller.destroy());
    WebflowForm.instances.clear();
  }

  /**
   * Get controller instance for a form element
   * @param {HTMLFormElement} form
   * @returns {WebflowForm|undefined}
   */
  static getInstance(form) {
    return WebflowForm.instances.get(form);
  }
}


/* ─────────────────────────────────────────────────────────────
   3. COMBINED USAGE EXAMPLE
──────────────────────────────────────────────────────────────── */

/**
 * EXAMPLE: Combined Webflow + Botpoison + Validation
 *
 * This example shows how all components work together in production.
 *
 * HTML Structure (Webflow):
 * ```html
 * <div class="w-form">
 *   <form
 *     data-formspark-url="https://submit-form.com/YOUR_FORM_ID"
 *     data-botpoison-public-key="pk_YOUR_KEY"
 *   >
 *     <input type="text" name="name" required />
 *     <input type="email" name="email" required />
 *     <textarea name="message" required></textarea>
 *     <button type="submit">Send</button>
 *   </form>
 *   <div class="w-form-done">Thank you!</div>
 *   <div class="w-form-fail">Something went wrong.</div>
 * </div>
 * ```
 *
 * JavaScript:
 * ```javascript
 * // Option 1: Auto-discovery (recommended)
 * WebflowForm.init();
 *
 * // Option 2: Manual with custom config
 * const form = document.querySelector('form');
 * const controller = new WebflowForm(form, {
 *   endpoint: 'https://submit-form.com/xxx',
 *   botpoisonKey: 'pk_xxx',
 *   resetOnSuccess: true,
 *   resetDelayMs: 500,
 *   validateOnBlur: true
 * });
 *
 * // Listen for events
 * form.addEventListener('webflowform:success', (e) => {
 *   console.log('Form submitted!', e.detail);
 *   // Trigger analytics, show modal, etc.
 * });
 *
 * form.addEventListener('webflowform:error', (e) => {
 *   console.error('Form error:', e.detail.error);
 *   // Log to error tracking service
 * });
 * ```
 *
 * Data Attributes Reference:
 * - data-formspark-url: Formspark submission endpoint
 * - data-botpoison-public-key: Botpoison spam protection key
 * - data-form-reset: Enable/disable auto-reset (default: true)
 * - data-form-reset-delay: Milliseconds before reset (default: 200)
 * - data-form-fallback: Enable native fallback on CORS errors (default: true)
 * - data-error-message: Custom validation error message for field
 * - data-error-for="fieldName": Associate error element with field
 */


/* ─────────────────────────────────────────────────────────────
   4. DUTCH PHONE FORMATTING & AUTOFILL DETECTION
──────────────────────────────────────────────────────────────── */

/**
 * Dutch Phone Number Formatter
 *
 * Formats phone numbers in Dutch mobile format: +31 6 XXXX XXXX
 * Handles various input formats (international, national, raw digits).
 * Includes caret position tracking for seamless user input.
 *
 * @example
 * const formatter = new DutchPhoneFormatter();
 * formatter.format('0612345678');     // '+31 6 1234 5678'
 * formatter.format('+31612345678');   // '+31 6 1234 5678'
 * formatter.format('31612345678');    // '+31 6 1234 5678'
 * formatter.isValid('+31 6 1234 5678'); // true
 *
 * @see /src/2_javascript/form/form_validation.js:163-340
 */
class DutchPhoneFormatter {
  /** Maximum digits in Dutch mobile number (after country code) */
  static MAX_DIGITS = 9;

  /** Country code for Netherlands */
  static COUNTRY_CODE = '31';

  /**
   * Extract national digits from raw phone input
   * Normalizes various formats to consistent digit string
   *
   * @param {string} raw - Raw phone input value
   * @returns {{ digits: string, national: string }}
   *
   * @example
   * extractDigits('+31 6 1234 5678') // { digits: '31612345678', national: '612345678' }
   * extractDigits('0612345678')      // { digits: '0612345678', national: '612345678' }
   * extractDigits('06-1234-5678')    // { digits: '0612345678', national: '612345678' }
   */
  extractDigits(raw) {
    const text = raw || '';
    const digitsOnly = text.replace(/\D+/g, '');

    if (!digitsOnly) {
      return { digits: '', national: '' };
    }

    let national = digitsOnly;

    // Handle +31 prefix
    if (text.trim().startsWith('+')) {
      if (digitsOnly.startsWith('31')) {
        national = digitsOnly.slice(2);
      } else {
        national = digitsOnly.replace(/^31/, '');
      }
    }
    // Handle 31 without +
    else if (digitsOnly.startsWith('31')) {
      national = digitsOnly.slice(2);
    }
    // Handle leading 0 (national format)
    else if (digitsOnly.startsWith('0')) {
      national = digitsOnly.slice(1);
    }

    return {
      digits: digitsOnly,
      national: national.slice(0, DutchPhoneFormatter.MAX_DIGITS)
    };
  }

  /**
   * Format digits into +31 mobile layout with caret position tracking
   *
   * @param {string} raw - Raw phone input value
   * @returns {{ formatted: string, digits: string, positions: number[], prefixLength: number }}
   *
   * @example
   * formatValue('0612345678')
   * // { formatted: '+31 6 1234 5678', digits: '612345678', positions: [...], prefixLength: 4 }
   */
  formatValue(raw) {
    const { national: digits } = this.extractDigits(raw);

    if (!digits.length) {
      return {
        formatted: raw,
        digits,
        positions: [],
        prefixLength: raw.length
      };
    }

    let formatted = '+31 ';
    const positions = [];

    // Add leading mobile digit (6 for mobile)
    formatted += digits[0];
    positions.push(formatted.length);

    // Add middle group (digits 2-5)
    if (digits.length > 1) {
      formatted += ' ';
      const middle = digits.slice(1, Math.min(5, digits.length));
      for (let i = 0; i < middle.length; i++) {
        formatted += middle[i];
        positions.push(formatted.length);
      }
    }

    // Add tail group (digits 6-9)
    if (digits.length > 5) {
      formatted += ' ';
      const tail = digits.slice(5, DutchPhoneFormatter.MAX_DIGITS);
      for (let i = 0; i < tail.length; i++) {
        formatted += tail[i];
        positions.push(formatted.length);
      }
    }

    return {
      formatted,
      digits,
      positions,
      prefixLength: 4 // '+31 '
    };
  }

  /**
   * Simple format function for display purposes
   *
   * @param {string} value - Phone number in any format
   * @returns {string} Formatted as +31 6 XXXX XXXX
   */
  format(value) {
    return this.formatValue(value).formatted;
  }

  /**
   * Count digits before a given caret position
   *
   * @param {string} raw - Raw phone input value
   * @param {number} caret - Current caret position
   * @returns {number} Number of national digits before caret
   */
  countDigitsBeforeCaret(raw, caret) {
    const slice = raw.slice(0, caret);
    return this.extractDigits(slice).national.length;
  }

  /**
   * Calculate new caret position after formatting
   *
   * @param {{ formatted: string, digits: string, positions: number[], prefixLength: number }} result
   * @param {number} digitCount - Number of digits before caret
   * @returns {number} New caret position in formatted string
   */
  caretFromDigitPositions(result, digitCount) {
    if (digitCount <= 0) {
      return Math.min(result.prefixLength, result.formatted.length);
    }

    if (digitCount > result.digits.length) {
      return result.formatted.length;
    }

    const index = result.positions[digitCount - 1];
    return typeof index === 'number' ? index : result.formatted.length;
  }

  /**
   * Check if value is likely a Dutch phone number
   *
   * @param {string} value - Phone input value
   * @returns {boolean} True if probably Dutch number
   */
  isProbablyDutch(value) {
    const text = String(value || '').replace(/\s+/g, '');
    if (!text) return true;

    // Check for Dutch prefixes
    if (text.startsWith('+31') || text.startsWith('31') || text.startsWith('0031')) {
      return true;
    }

    // Accept '0' (national format) or '6' (mobile without leading 0)
    return text.startsWith('0') || text.startsWith('6');
  }

  /**
   * Validate Dutch mobile number structure
   *
   * @param {string} value - Phone number to validate
   * @returns {boolean} True if valid Dutch mobile number
   *
   * @example
   * isValid('+31 6 1234 5678') // true
   * isValid('0612345678')       // true
   * isValid('+31 20 123 4567')  // false (landline, not mobile)
   */
  isValid(value) {
    const { national } = this.extractDigits(value || '');

    // Must have exactly 9 digits after country code
    if (national.length !== DutchPhoneFormatter.MAX_DIGITS) {
      return false;
    }

    // Must start with 6 (mobile indicator)
    return national[0] === '6';
  }

  /**
   * Validate E.164 international format
   *
   * @param {string} value - Phone number to validate
   * @returns {boolean} True if valid E.164 format
   */
  isValidE164(value) {
    const normalized = String(value || '').replace(/[\s()-]/g, '');
    return /^\+[1-9][0-9]{6,14}$/.test(normalized);
  }
}


/**
 * International Phone Formatter
 *
 * Generic formatter for international phone numbers with country code detection.
 * Groups digits in readable chunks based on country code length.
 *
 * @example
 * const formatter = new InternationalPhoneFormatter();
 * formatter.format('+1 555 123 4567');  // US format
 * formatter.format('+44 20 7123 4567'); // UK format
 */
class InternationalPhoneFormatter {
  /**
   * Map digit positions in formatted string
   * @param {string} formatted - Formatted phone string
   * @returns {number[]} Array of positions for each digit
   */
  mapDigitPositions(formatted) {
    const positions = [];
    for (let i = 0; i < formatted.length; i++) {
      if (/\d/.test(formatted[i])) {
        positions.push(i + 1);
      }
    }
    return positions;
  }

  /**
   * Format international phone number with smart grouping
   *
   * @param {string} raw - Raw phone input
   * @returns {{ formatted: string, digits: string, positions: number[], prefixLength: number }}
   */
  formatValue(raw) {
    const text = raw || '';
    const trimmed = text.trim();
    const digitsOnly = text.replace(/\D+/g, '');

    // Return as-is if not international format
    if (!trimmed.startsWith('+') || !digitsOnly.length) {
      return {
        formatted: text,
        digits: digitsOnly,
        positions: this.mapDigitPositions(text),
        prefixLength: trimmed.startsWith('+') ? 1 : 0
      };
    }

    // Determine country code length (1 for US/Russia, 2 for most others)
    let countryLength;
    if (digitsOnly[0] === '1' || digitsOnly[0] === '7') {
      countryLength = 1;
    } else if (digitsOnly.length >= 2) {
      countryLength = 2;
    } else {
      countryLength = digitsOnly.length;
    }

    const country = digitsOnly.slice(0, countryLength);
    let remainder = digitsOnly.slice(countryLength);

    // Group remaining digits in chunks of 3-4
    const groups = [];
    while (remainder.length > 4) {
      groups.push(remainder.slice(0, 3));
      remainder = remainder.slice(3);
    }
    if (remainder.length) {
      groups.push(remainder);
    }

    // Build formatted string
    let formatted = `+${country}`;
    if (groups.length) {
      formatted += ' ' + groups.join(' ');
    }

    const positions = this.mapDigitPositions(formatted);
    const prefixSpaceIndex = formatted.indexOf(' ');
    const prefixLength = prefixSpaceIndex === -1
      ? formatted.length
      : Math.min(formatted.length, prefixSpaceIndex + 1);

    return {
      formatted,
      digits: digitsOnly,
      positions,
      prefixLength
    };
  }

  /**
   * Simple format function
   * @param {string} value - Phone number
   * @returns {string} Formatted phone number
   */
  format(value) {
    return this.formatValue(value).formatted;
  }
}


/**
 * Browser Autofill Detector
 *
 * Detects browser autofill events and triggers validation.
 * Uses CSS animation detection (most reliable cross-browser method)
 * with fallback to pseudo-class checking.
 *
 * Problem: Browser autofill doesn't trigger 'input' events consistently,
 * causing validation to miss autofilled values.
 *
 * Solution: Inject CSS animation on :-webkit-autofill pseudo-class,
 * listen for animationstart, then trigger validation.
 *
 * @example
 * const detector = new AutofillDetector();
 * detector.init();
 *
 * // Or with callback
 * detector.init((input) => {
 *   console.log('Autofill detected on:', input.name);
 *   validateField(input);
 * });
 *
 * @see /src/2_javascript/form/form_validation.js:1264-1321
 */
class AutofillDetector {
  /** CSS style element ID */
  static STYLE_ID = 'autofill-detect-animation';

  /** Animation name for detection */
  static ANIMATION_NAME = 'autofilldetect';

  /** WeakSet to track bound inputs (prevents double-binding) */
  boundInputs = new WeakSet();

  /**
   * Inject CSS animation styles for autofill detection
   * @private
   */
  injectStyles() {
    if (document.getElementById(AutofillDetector.STYLE_ID)) {
      return;
    }

    const style = document.createElement('style');
    style.id = AutofillDetector.STYLE_ID;
    style.textContent = `
      @keyframes ${AutofillDetector.ANIMATION_NAME} {
        0% { opacity: 1; }
        100% { opacity: 1; }
      }
      input:-webkit-autofill,
      textarea:-webkit-autofill {
        animation: ${AutofillDetector.ANIMATION_NAME} 0.001s;
      }
    `;
    document.head.appendChild(style);
  }

  /**
   * Bind autofill detection to input element
   *
   * @param {HTMLInputElement|HTMLTextAreaElement} input - Input to monitor
   * @param {Function} [onAutofill] - Callback when autofill detected
   */
  bindInput(input, onAutofill) {
    // Skip if already bound (WeakSet prevents double-binding)
    if (this.boundInputs.has(input)) {
      return;
    }
    this.boundInputs.add(input);

    // Listen for animation triggered by autofill
    input.addEventListener('animationstart', (event) => {
      if (event.animationName === AutofillDetector.ANIMATION_NAME) {
        // Small delay to ensure autofill value is set
        setTimeout(() => {
          if (onAutofill) {
            onAutofill(input);
          } else {
            // Default: dispatch input event to trigger validation
            const inputEvent = new Event('input', { bubbles: true });
            input.dispatchEvent(inputEvent);
          }
        }, 50);
      }
    });
  }

  /**
   * Check autofill status using pseudo-class (fallback method)
   *
   * @param {HTMLInputElement|HTMLTextAreaElement} input - Input to check
   * @returns {boolean} True if autofilled
   */
  isAutofilled(input) {
    try {
      return input.matches(':-webkit-autofill') || input.matches(':autofill');
    } catch (e) {
      // Browser doesn't support these pseudo-classes
      return false;
    }
  }

  /**
   * Initialize autofill detection on all inputs
   *
   * @param {Function} [onAutofill] - Callback when autofill detected
   */
  init(onAutofill) {
    this.injectStyles();

    const inputs = document.querySelectorAll('input, textarea');
    inputs.forEach((input) => {
      this.bindInput(input, onAutofill);
    });

    // Fallback: Check for autofill pseudo-class at various intervals
    // (catches autofill that happens before our listeners are bound)
    const checkAutofill = () => {
      inputs.forEach((input) => {
        if (this.isAutofilled(input)) {
          if (onAutofill) {
            onAutofill(input);
          } else {
            const inputEvent = new Event('input', { bubbles: true });
            input.dispatchEvent(inputEvent);
          }
        }
      });
    };

    // Check at various intervals to catch different autofill timings
    setTimeout(checkAutofill, 100);
    setTimeout(checkAutofill, 500);
    setTimeout(checkAutofill, 1000);
  }
}


/**
 * Field Binding Tracker
 *
 * WeakSet-based tracker to prevent double-binding of event handlers.
 * Essential for forms that may be re-initialized or have dynamic fields.
 *
 * Problem: Without tracking, re-running init() or adding dynamic fields
 * can result in multiple event handlers on the same element.
 *
 * Solution: WeakSet stores references without preventing garbage collection,
 * and provides O(1) lookup for "already bound?" checks.
 *
 * @example
 * const tracker = new FieldBindingTracker();
 *
 * function bindValidation(input) {
 *   if (tracker.isBound(input, 'validation')) return;
 *   tracker.markBound(input, 'validation');
 *
 *   input.addEventListener('blur', validateField);
 * }
 *
 * @see /src/2_javascript/form/form_validation.js:28-29
 */
class FieldBindingTracker {
  /**
   * Map of binding type to WeakSet
   * @type {Map<string, WeakSet>}
   */
  bindingSets = new Map();

  /**
   * Get or create WeakSet for binding type
   *
   * @param {string} bindingType - Type identifier (e.g., 'validation', 'formatter')
   * @returns {WeakSet}
   * @private
   */
  getSet(bindingType) {
    if (!this.bindingSets.has(bindingType)) {
      this.bindingSets.set(bindingType, new WeakSet());
    }
    return this.bindingSets.get(bindingType);
  }

  /**
   * Check if element is already bound for given type
   *
   * @param {Element} element - DOM element to check
   * @param {string} bindingType - Type of binding to check
   * @returns {boolean} True if already bound
   */
  isBound(element, bindingType) {
    return this.getSet(bindingType).has(element);
  }

  /**
   * Mark element as bound for given type
   *
   * @param {Element} element - DOM element to mark
   * @param {string} bindingType - Type of binding
   */
  markBound(element, bindingType) {
    this.getSet(bindingType).add(element);
  }

  /**
   * Clear binding for element (useful for re-initialization)
   *
   * @param {Element} element - DOM element
   * @param {string} bindingType - Type of binding to clear
   */
  clearBinding(element, bindingType) {
    this.getSet(bindingType).delete(element);
  }

  /**
   * Clear all bindings of a type
   * Note: WeakSet doesn't support iteration, so this creates a new set
   *
   * @param {string} bindingType - Type to clear
   */
  clearAllOfType(bindingType) {
    this.bindingSets.set(bindingType, new WeakSet());
  }
}


/* ─────────────────────────────────────────────────────────────
   5. EXPORTS
──────────────────────────────────────────────────────────────── */

// Export for module systems (Node.js, bundlers)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    // Original patterns
    ContactForm,
    // SafeDOM - REMOVED (deprecated 2026-01-11, use textContent directly)
    APIClient,
    // Webflow patterns
    BotpoisonProtection,
    WebflowFormState,
    WebflowForm,
    // Phone formatting & autofill detection
    DutchPhoneFormatter,
    InternationalPhoneFormatter,
    AutofillDetector,
    FieldBindingTracker
  };
}

// Export for ES modules
if (typeof window !== 'undefined') {
  window.ValidationPatterns = {
    // Original patterns
    ContactForm,
    // SafeDOM - REMOVED (deprecated 2026-01-11, use textContent directly)
    APIClient,
    // Webflow patterns
    BotpoisonProtection,
    WebflowFormState,
    WebflowForm,
    // Phone formatting & autofill detection
    DutchPhoneFormatter,
    InternationalPhoneFormatter,
    AutofillDetector,
    FieldBindingTracker
  };
}
