import { Component, inject, Injectable, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AppState {
  private readonly titleSignal = signal('angular-app');

  get title() {
    return this.titleSignal();
  }

  update(updater: (title: string) => string) {
    this.titleSignal.update(updater);
  }
}

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  appStage = inject(AppState);

  ngOnInit(): void {
    setTimeout(() => {
      this.appStage.update(title => title + ' is running!');
    }, 2000);
  }
}
