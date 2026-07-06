# 🤖 AI / MCP Layer — Agentic Testing Workflow

This is the differentiator of the repo: a **reproducible** demonstration of using
the [**Playwright MCP server**](https://github.com/microsoft/playwright-mcp) to
drive an agentic testing loop — **planner → generator → healer** — with a human
in the loop.

> **Honesty first.** Nothing here is magic and nothing is blindly shipped. The
> agent accelerates authoring; a senior engineer still reviews every locator and
> assertion before it enters the maintained suite in [`../tests`](../tests). The
> generated artifact in [`generated/`](generated/) is committed **with its review
> notes** so you can see exactly what changed and why.

---

## Why MCP instead of "ask an LLM to write a test"

A plain LLM guesses selectors from memory and hallucinates DOM that may not
exist. The **Model Context Protocol** gives the agent _tools_: with the
Playwright MCP server it actually **launches a browser, navigates the live app,
and reads the accessibility tree**. Locators are therefore grounded in the real,
current DOM — role-based or `data-test`, not brittle `nth-child` CSS.

```
                 ┌─────────────────────────────────────────────┐
   plain-English │  PLANNER    reads acceptance criteria,        │
   criteria  ───▶│             breaks them into steps            │
                 ├─────────────────────────────────────────────┤
                 │  GENERATOR  drives Playwright MCP → opens the │
                 │             live app, reads the a11y tree,    │
                 │             emits a spec using the repo's POM │
                 ├─────────────────────────────────────────────┤
                 │  HEALER     re-runs, inspects failures via    │
                 │             MCP, proposes locator/assertion   │
                 │             fixes                             │
                 └───────────────────────┬─────────────────────┘
                                         ▼
                          👤 HUMAN REVIEW (required)
                                         ▼
                         merge into tests/e2e/*.spec.ts
```

---

## The three roles

| Role          | Input                                | MCP tools used                                          | Output                                   |
| ------------- | ------------------------------------ | ------------------------------------------------------- | ---------------------------------------- |
| **Planner**   | `prompts/*.md` (acceptance criteria) | — (reasoning only)                                      | ordered, testable steps                  |
| **Generator** | the plan + repo conventions          | `browser_navigate`, `browser_snapshot` (a11y)           | a TypeScript spec using the existing POM |
| **Healer**    | a failing spec + run output          | `browser_navigate`, `browser_snapshot`, `browser_click` | a proposed locator/assertion fix         |

---

## Reproduce it in ~5 minutes

### 1. Configure the MCP server in your client

Copy [`mcp.config.json`](mcp.config.json) into your MCP client:

- **Claude Desktop / Claude Code** → merge into `claude_desktop_config.json` (or run `claude mcp add`).
- **Cursor** → _Settings → MCP → Add_ the same block.
- **VS Code (GitHub Copilot Agent)** → add to `.vscode/mcp.json`.

```jsonc
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["-y", "@playwright/mcp@latest", "--browser", "chromium", "--isolated"],
    },
  },
}
```

No API keys are required for the MCP server itself — it just wraps a real
browser. You only need whatever subscription your coding agent already uses.

### 2. Give the agent the plan + system prompt

Open [`prompts/checkout-acceptance-criteria.md`](prompts/checkout-acceptance-criteria.md).
It contains both the plain-English acceptance criteria **and** the exact system
prompt. Paste them to your MCP-connected agent.

### 3. Watch the generator work

The agent will call the MCP tools — you'll see it navigate to
`https://www.saucedemo.com`, take an accessibility snapshot, and reason about
locators before emitting code.

### 4. Compare against the committed artifact

The agent's output for this exact prompt is saved verbatim (minus the review
banner) at:

- [`generated/checkout-happy-path.generated.spec.ts`](generated/checkout-happy-path.generated.spec.ts)

Read the **HUMAN REVIEW NOTES** at the bottom of that file — they list the three
concrete changes a senior engineer made (a brittle CSS locator swapped for a
test-id, a stricter→looser assertion, and a `Promise.all` batching tweak) before
the reviewed version landed in [`../tests/e2e/checkout.spec.ts`](../tests/e2e/checkout.spec.ts).

### 5. (Optional) Run the healing loop

Introduce a deliberate break — e.g. rename a `data-test` expectation — re-run the
spec, and hand the failure output back to the agent. With MCP it will re-open the
app, re-read the a11y tree, and propose the corrected locator instead of
guessing.

---

## What this demonstrates for a reviewer

- **MCP fluency** — real server config + tool-driven navigation, not prompt-only.
- **Grounded locators** — a11y-tree-derived selectors over brittle CSS.
- **Engineering judgment** — the diff between raw AI output and merged code is
  documented, proving human review rather than blind shipping.
- **Convention-aware generation** — the agent is constrained to the existing POM
  and fixtures, so generated code fits the codebase instead of fighting it.
