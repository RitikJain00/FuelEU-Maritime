# Reflection on Using AI Agents for FuelEU Maritime Assignment

During this assignment, I leveraged multiple AI agents, including Copilot, Claude Code, and ChatGPT, to assist in building a full-stack compliance application. The key learnings and insights include:

## Learning Outcomes
- **Code Generation:** AI agents helped scaffold boilerplate code, such as controllers, hooks, and Prisma queries, significantly reducing repetitive coding.
- **Architecture Awareness:** While the AI suggested functional snippets, I had to adapt them to our hexagonal architecture, reinforcing understanding of domain, application, and adapter separation.
- **Debugging Assistance:** Agents provided explanations for Prisma errors, TypeScript type issues, and frontend integration bugs, which accelerated troubleshooting.

## Efficiency Gains
- Reduced manual coding time by roughly 40–50%, especially for repetitive CRUD operations and hook creation.
- Quickly generated sample datasets for testing multiple scenarios (routes, bank entries, pools) without manual typing.
- Faster comprehension of TypeScript type constraints and frontend-backend integration patterns.

## Areas for Improvement
- **Verification Needed:** Agents occasionally suggested incorrect TypeScript types or database relations, requiring careful validation.
- **Domain-Specific Logic:** Business rules for banking, applying credits, and pool management had to be manually reviewed to ensure correctness.
- **Next Time:** I would provide more structured prompts and partial implementations to further minimize hallucinations and improve relevance of generated code.

Overall, AI agents acted as an effective assistant, allowing me to focus on **business logic, architecture, and testing**, while automating repetitive or boilerplate tasks.
