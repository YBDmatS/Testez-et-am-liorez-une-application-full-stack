import { Component, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject, map, startWith, switchMap } from 'rxjs';
import { Session } from '../../../../core/models/session.interface';
import { Teacher } from '../../../../core/models/teacher.interface';
import { SessionService } from '../../../../core/service/session.service';
import { TeacherService } from '../../../../core/service/teacher.service';
import { SessionApiService } from '../../../../core/service/session-api.service';
import { MaterialModule } from '../../../../shared/material.module';
import { CommonModule } from '@angular/common';

interface SessionDetail {
  session: Session;
  teacher: Teacher;
  isParticipate: boolean;
}

@Component({
  selector: 'app-detail',
  imports: [CommonModule, MaterialModule],
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
})
export class DetailComponent {
  public readonly isAdmin: boolean;
  public readonly sessionId: string;
  public readonly userId: string;

  private readonly route = inject(ActivatedRoute);
  private readonly sessionService = inject(SessionService);
  private readonly sessionApiService = inject(SessionApiService);
  private readonly teacherService = inject(TeacherService);
  private readonly matSnackBar = inject(MatSnackBar);
  private readonly router = inject(Router);

  private readonly refresh$ = new Subject<void>();

  public readonly sessionDetail$: Observable<SessionDetail> = this.refresh$.pipe(
    startWith(undefined),
    switchMap(() => this.sessionApiService.detail(this.sessionId)),
    switchMap(session =>
      this.teacherService.detail(session.teacher_id.toString()).pipe(
        map(teacher => ({
          session,
          teacher,
          isParticipate: session.users.includes(
            this.sessionService.sessionInformation!.id
          ),
        }))
      )
    )
  );

  constructor() {
    this.sessionId = this.route.snapshot.paramMap.get('id')!;
    this.isAdmin = this.sessionService.sessionInformation!.admin;
    this.userId = this.sessionService.sessionInformation!.id.toString();
  }

  public back(): void {
    window.history.back();
  }

  public delete(): void {
    this.sessionApiService.delete(this.sessionId).subscribe(() => {
      this.matSnackBar.open('Session deleted !', 'Close', { duration: 3000 });
      this.router.navigate(['sessions']);
    });
  }

  public participate(): void {
    this.sessionApiService
      .participate(this.sessionId, this.userId)
      .subscribe(() => this.refresh$.next());
  }

  public unParticipate(): void {
    this.sessionApiService
      .unParticipate(this.sessionId, this.userId)
      .subscribe(() => this.refresh$.next());
  }
}
