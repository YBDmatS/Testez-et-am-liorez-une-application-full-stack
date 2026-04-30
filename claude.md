# Project conventions

## Scope
Full-stack yoga studio booking application.
- Back-end: Java 21 / Spring Boot 3 (Maven 3.9.3)
- Front-end: Angular 19 / TypeScript

---

## General rules

- Do the **minimum necessary** to fulfil the task. Do not refactor, add, or change anything beyond what is explicitly asked.
- When rewriting a file entirely (via Write tool), reproduce the existing lines **exactly** — do not simplify, reformat, or clean up lines that are not part of the requested change.
- All code and comments must be written in **English**.
- Respect **clean architecture** at all times:
  - Back-end: controller → service → repository. No direct repository calls from controllers. Business logic belongs in services.
  - Front-end: smart/dumb component separation, services for data access, no logic in templates.
- If a requested change appears to conflict with recent best practices for the current stack (Spring Boot or Angular), **ask before proceeding**: "This doesn't follow current best practices for [stack]. Do you still want me to do it this way?"

---

## Workflow obligatoire entre les étapes d'une todo list

Chaque fois qu'on travaille sur une todo list définie, après avoir complété
une étape tu dois obligatoirement :

1. Annoncer clairement "✅ Étape X terminée — en attente de ta validation"
2. Lister un résumé des fichiers modifiés
3. Ne toucher à AUCUN fichier supplémentaire
4. Attendre que l'utilisateur :
   - Lance le build manuellement
   - Lance les tests manuellement
   - Commite les changements
   - Tape "go" ou "next" pour autoriser le passage à l'étape suivante

Tu ne passes JAMAIS à l'étape suivante de ta propre initiative, même si
tu estimes que tout est prêt. "go" ou "next" sont les seuls déclencheurs
autorisés pour continuer.

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
- Use `@RequiredArgsConstructor` (Lombok) for constructor injection — never write manual constructors for dependency injection
- Never use `@Autowired` — Spring resolves single-constructor injection automatically via `@RequiredArgsConstructor`
- Keep intermediate variables (e.g. `User user = ...`, `Session session = ...`) for readability — do not inline service calls into `ResponseEntity.ok().body(...)`; exception: bare existence-check calls whose return value is intentionally discarded

## Front-end conventions (Angular)

- Use `takeUntilDestroyed()` (or `DestroyRef`) for observable unsubscription — no manual `unsubscribe()` unless justified
- No `any` types — all variables, parameters, and return types must be explicitly typed
- Replace `*ngIf` / `*ngFor` with `@if` / `@for` (Angular control flow syntax)
- All methods must have an explicit return type (`void` if nothing is returned)