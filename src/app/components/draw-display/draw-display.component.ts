import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import Rand from 'rand-seed';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-draw-display',
  templateUrl: './draw-display.component.html',
  styleUrls: ['./draw-display.component.scss'],
})
export class DrawDisplayComponent implements OnInit, OnDestroy {
  public drawExclusionMap: Record<string, string> = {
    Peggy: 'Ron',
    Ron: 'Peggy',
    Kat: 'Shane',
    Shane: 'Kat',
    Darren: 'Antoinette',
    Antoinette: 'Darren',
    Brandon: '',
  };
  public keys: Record<string, string> = {
    '8f2f06e4-4226-47a9-87b0-b68398d3789e': 'Peggy',
    '7a3e7e10-0738-44ef-9beb-0a84adbb6a1a': 'Ron',
    'f8d8f8c1-f8d8-4f7e-b8c0-b8c0f8c1f8d8': 'Kat',
    'e8507d87-2e6f-4d79-8d91-0d15de418ad2': 'Shane',
    'a924408b-01db-4d1a-9f00-b833b15af5dd': 'Darren',
    'b46d6b98-d1e9-4ecf-9187-9bfc45981e52': 'Antoinette',
    '137a0037-a9ac-4f03-bb6d-fa59b96de791': 'Brandon',
  };
  public drawResult?: { drawer: string; result: string };
  public randString = 'uxverpbtvopzxxiomkvquwsezpvfhlpr';

  private _results: Record<string, string | undefined> = {};
  private _rand: Rand = new Rand(this.randString);
  private _excludedList: string[] = [];
  private _subscription: Subscription | undefined;

  constructor(private _route: ActivatedRoute) {}

  public ngOnInit(): void {
    this._drawAllNames();
    let failedDrawing = Object.values(this._results).includes(undefined);
    while (failedDrawing) {
      this._drawAllNames();
      failedDrawing = Object.values(this._results).includes(undefined);
    }

    this._subscription = this._route.queryParams.subscribe(params => {
      if (!params.drawn || !this.keys[params.drawn]) {
        this.drawResult = undefined;
        return;
      }

      const name = this.keys[params.drawn];
      this.drawResult = { drawer: name, result: this._results[name] || '' };
    });
  }

  public ngOnDestroy(): void {
    this._subscription?.unsubscribe();
  }

  private _drawAllNames(): void {
    const names = Object.keys(this.drawExclusionMap);
    this._results = {};
    this._excludedList = [];
    names.forEach(name => {
      this._results[name] = this._drawName(name);
    });
  }

  private _drawName(name: string): string {
    const names = Object.keys(this.drawExclusionMap);
    const exclusions = [name, this.drawExclusionMap[name], ...this._excludedList].filter(x => !!x);
    const notExcluded = names.filter(x => !exclusions.includes(x));
    const random = this._randomIntInRange(0, notExcluded.length - 1);
    const drawn = notExcluded[random];
    this._excludedList.push(drawn);
    return drawn;
  }

  private _randomIntInRange(min: number, max: number): number {
    return Math.floor(this._rand.next() * (max - min + 1)) + min;
  }

  public get namesDrawn(): string {
    return Object.values(this._results).sort().join(', ');
  }

  public get allNamesDrawn(): boolean {
    const names = Object.keys(this.drawExclusionMap);
    const resultNames = Object.values(this._results);
    return names.length === resultNames.length && names.every(name => resultNames.includes(name));
  }
}
