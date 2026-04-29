# Project conventions

## Scope
Full-stack yoga studio booking application.
- Back-end: Java 21 / Spring Boot 3 (Maven 3.9.3)
- Front-end: Angular 19 / TypeScript

---

## General rules

- Do the **minimum necessary** to fulfil the task. Do not refactor, add, or change anything beyond what is explicitly asked.
- All code and comments must be written in **English**.
- Respect **clean architecture** at all times:
  - Back-end: controller → service → repository. No direct repository calls from controllers. Business logic belongs in services.
  - Front-end: smart/dumb component separation, services for data access, no logic in templates.
- If a requested change appears to conflict with recent best practices for the current stack (Spring Boot or Angular), **ask before proceeding**: "This doesn't follow current best practices for [stack]. Do you still want me to do it this way?"

---

## Git – Branches

- Base branch: `develop`
- Pattern: `feature/ex-{N}/step-{N}-short-description`
- Example: `feature/ex-1/step-2-unsubscribe-observables`

## Git – Commits

- Language: **English only**
- Mandatory prefix: `[CORE]`, `[FEAT]`, `[FIX]`, `[REFACTOR]`, `[DOC]`
- Format: `[PREFIX] short imperative description`
- Example: `[REFACTOR] move business logic from controller to service`

### Commit suggestions (mandatory)

- At the end of every modification, always provide the corresponding commit message following the conventions above.
- If a modification is too large for a single atomic commit, **do not proceed immediately**. Instead:
  1. Signal it explicitly: "This change is too large for a single commit."
  2. Propose a decomposition plan listing each commit step with its message before writing any code.
  3. Wait for approval before starting.

---

## Back-end conventions (Spring Boot)

- Layer separation is mandatory: controller → service → repository
- Centralize exception handling with `@ControllerAdvice` — no `try/catch` in controllers
- Use DTOs for request/response payloads; do not expose entities directly
- Follow SOLID principles
- No business logic in controllers

## Front-end conventions (Angular)

- Use `takeUntilDestroyed()` (or `DestroyRef`) for observable unsubscription — no manual `unsubscribe()` unless justified
- No `any` types — all variables, parameters, and return types must be explicitly typed
- Replace `*ngIf` / `*ngFor` with `@if` / `@for` (Angular control flow syntax)
- All methods must have an explicit return type (`void` if nothing is returned)