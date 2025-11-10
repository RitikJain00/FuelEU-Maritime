# AI Agent Workflow Log

## Agents Used
- **ChatGPT / GPT-5 Mini**: Used for code generation, debugging, and explanations.
- **Copilot**: Inline code suggestions for boilerplate and repetitive patterns.


## Prompts & Outputs
- **Example 1**
  - **Prompt:** "Generate a Prisma seed for 10 BankEntry records for ships S001–S005 for years 2024 and 2025."
  - **Output:** Generated `prisma/seed-bank.ts` file with `createMany` method and 10 entries.
- **Example 2**
  - **Prompt:** "Fix the BankingTab React component for TypeScript errors with undefined properties."
  - **Output:** Refactored React component and custom hook with proper null checks and type definitions.

## Validation / Corrections
- Verified Prisma seeds by running `ts-node prisma/seed-bank.ts` and checking database entries.
- Cross-checked `BankingTab` UI to ensure CB balances display correctly.
- Added null-coalescing (`??`) to prevent TypeScript errors for optional values.

## Observations
- **Saved Time:** Quick scaffolding for Prisma seeds and React hook logic.
- **Failures / Hallucinations:** Occasionally suggested foreign key references incorrectly in seeds; manual cross-check needed.
- **Effective Tool Combination:** Used ChatGPT for explanations and boilerplate, Copilot for inline patterns, and manual validation for Prisma constraints.

## Best Practices Followed
- Kept database seeding idempotent using `skipDuplicates`.
- Used `??` and type-safe patterns in TypeScript to prevent runtime errors.
- Followed hexagonal architecture conventions in file organization.
