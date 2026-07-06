# Acceptance criteria → the exact prompt handed to the agent

This is the plain-English input a product owner might write. It is fed to an
MCP-connected coding agent (Claude, Cursor, Copilot, …) together with the system
prompt below. The agent uses the **Playwright MCP server** to open the live app,
read its **accessibility tree**, and derive real, stable locators — rather than
hallucinating selectors.

---

## Feature: Guest checkout — happy path

**As a** shopper
**I want** to buy a single item
**So that** I receive an order confirmation.

**Acceptance criteria**

1. Given I am logged in as `standard_user`
2. When I add "Sauce Labs Backpack" to the cart
3. And I open the cart and proceed to checkout
4. And I fill the customer information (first name, last name, postal code) and continue
5. Then the order summary shows an item total, tax, and a grand total where
   `item total + tax === grand total`
6. When I finish the order
7. Then I see the confirmation "Thank you for your order!"

---

## System prompt used with the MCP server

> You are a senior SDET. Use the **Playwright MCP** tools to navigate
> https://www.saucedemo.com and inspect the accessibility tree to choose stable,
> role-based or `data-test` locators (never brittle nth-child CSS).
> Produce a TypeScript spec that:
>
> - uses the existing Page Object Model in `src/pages` and the custom fixtures in
>   `src/fixtures/test.ts` (do **not** invent a new structure),
> - contains no `waitForTimeout`/arbitrary sleeps — rely on auto-waiting and
>   web-first assertions,
> - asserts the totals arithmetic from criterion 5.
>   Return only the spec file contents.
