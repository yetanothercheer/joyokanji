import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public constructor(private titleService: Title) {
    this.setTitle("JOYOKANJI - 常用漢字")
  }

  public setTitle(newTitle: string) {
    this.titleService.setTitle(newTitle);
  }

  theme = "light"

  ngOnInit() {
    this.theme = localStorage.getItem("theme") || "light"
    document.body.setAttribute("theme", this.theme)
  }

  toogleTheme() {
    let current = document.body.getAttribute("theme")
    let target = current == "light" ? "dark" : "light"
    document.body.setAttribute("theme", target)
    localStorage.setItem("theme", target)
    this.theme = target
  }
}
