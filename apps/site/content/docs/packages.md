# Packages

Every package is released at the same version, and each one stands on the engine and nothing more.

| Package | What it is | It needs |
| --- | --- | --- |
| `@reboprofiles/core` | The engine: the profile and its blocks, its themes, reading what is given, the page's HTML, what it lacks, the numbers. No DOM: the browser, Node, Deno, Bun, a Worker. | Nothing. |
| `@reboprofiles/server` | The page with its links signed, and the routes of its visits and clicks. | Node's `crypto`, or a runtime that has it. |
| `@reboprofiles/react` | The editor and the numbers, as components and parts; its stylesheet. | React 19. |

```bash
npm install @reboprofiles/core            # the engine alone
npm install @reboprofiles/server          # a server that gives the pages and counts them
npm install @reboprofiles/react           # the editor and the numbers in a React app
```
