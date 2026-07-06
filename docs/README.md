# docs/ — demo media

These files are **placeholders** so the main README renders complete before you
record the real thing. Swap them with actual media and keep the same file names
(or update the paths in [`../README.md`](../README.md)).

| File              | Replace with                                         |
| ----------------- | ---------------------------------------------------- |
| `demo-run.svg`    | A **GIF** of your green `npm test` run               |
| `html-report.svg` | A **screenshot** (PNG) of the Playwright HTML report |

## Record the green run as a GIF

1. Run the suite so it's fresh and green:
   ```bash
   npm test
   ```
2. Record your terminal while it runs. Any of these work:
   - **[asciinema](https://asciinema.org/) + [agg](https://github.com/asciinema/agg)** (crisp, small):
     ```bash
     asciinema rec demo.cast -c "npm run test:chromium"
     agg demo.cast docs/demo-run.gif
     ```
   - **[vhs](https://github.com/charmbracelet/vhs)** (scriptable, reproducible).
   - Any screen recorder → export to GIF (e.g. Kap, LICEcap, Peek).
3. If you switch to a GIF/PNG, update the extensions in the README:
   ```markdown
   ![Green Playwright run](docs/demo-run.gif)
   ![Playwright HTML report](docs/html-report.png)
   ```

## Screenshot the HTML report

```bash
npm test          # generates playwright-report/
npm run report    # opens it in the browser
```

Then screenshot the summary view and save it as `docs/html-report.png`.

> Tip: keep media under ~5 MB so the README loads fast on GitHub.
