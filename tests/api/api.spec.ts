import { test, expect, request } from '@playwright/test';
import { env } from '../../src/utils/env';

/**
 * API-layer tests using Playwright's built-in `request` context (no browser).
 *
 * Two complementary angles a senior SDET is expected to cover:
 *  1. A smoke/availability check against the actual system under test, so a red
 *     UI run can be quickly triaged as "app down" vs "test broken".
 *  2. A proper REST contract test (GET + POST with JSON body/status assertions)
 *     against a stable public API, demonstrating request-context fluency
 *     independent of the UI.
 */

test.describe('API: system-under-test availability', () => {
  test('SauceDemo responds 200 and serves the login page', async () => {
    const context = await request.newContext();
    const response = await context.get(env.baseURL);

    expect(response.status()).toBe(200);
    expect(response.ok()).toBeTruthy();
    expect(await response.text()).toContain('Swag Labs');

    await context.dispose();
  });
});

test.describe('API: REST contract (public demo API)', () => {
  const API_BASE = 'https://jsonplaceholder.typicode.com';

  test('GET /users/1 returns a well-formed user resource', async () => {
    const context = await request.newContext({ baseURL: API_BASE });
    const response = await context.get('/users/1');

    expect(response.status()).toBe(200);
    const user = (await response.json()) as {
      id: number;
      name: string;
      email: string;
    };
    expect(user).toMatchObject({ id: 1 });
    expect(user.name).toBeTruthy();
    expect(user.email).toContain('@');

    await context.dispose();
  });

  test('POST /posts creates a resource and echoes the payload', async () => {
    const context = await request.newContext({ baseURL: API_BASE });
    const payload = { title: 'agentic-testing', body: 'Playwright + MCP', userId: 1 };

    const response = await context.post('/posts', { data: payload });

    expect(response.status()).toBe(201);
    const created = (await response.json()) as typeof payload & { id: number };
    expect(created).toMatchObject(payload);
    expect(typeof created.id).toBe('number');

    await context.dispose();
  });
});
