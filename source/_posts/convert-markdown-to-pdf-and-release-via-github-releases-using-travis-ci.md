---
title: Markdown in PDF umwandeln und mit Travis CI auf GitHub veröffentlichen
excerpt: GommeHDnet bekommt einen neuen Style Guide, den Teamler als PDF lesen wollen.
date: 2020-02-26 20:25:14
author: Felix Klauke
toc: true
tags: markdown, pdf, travis ci, github, github releases, ci/cd, devops, gommehdnet
---

# Es war einmal ein Markdown Dokument
Man mag sich fragen, wie es zu dieser Situation kam. Nun, für eine lange Zeit wurde bei 
[GommeHD.net](https://www.gommehd.net) ein doch recht unkonventioneller Code Style Guide benutzt.
Im Rahmen einer internen Weiterbildungsmaßnahme wird deshalb ein neuer Code Style entwickelt, der den alten Style möglichst bald ablösen soll. Der neue Code Style soll dabei sehr viel mehr Wert auf Sauberkeit und komprimierten Source Code 
legen. Wir betrachten im Folgenden die Herausforderung, wie wir diesen Code Style für die 
Entwickler zur Verfügung stellen.

**Anmerkung: Der Code Style ist keineswegs offiziell bereits der neue Style Guide, in diesem Artikel geht es ausschließlich um die Art und Weise wie hier eine CI Pipeline aufgebaut wurde**

## Der Style Guide
Der Code Style an sich ist nah am Google Style Guide aufgebaut und wurde anfangs von mir und [Merlin Osayimwen](https://github.com/ehenoma) entwickelt und als offizieller [Style Guide von vicuna.io](https://github.com/vicuna-io/style-guide) veröffentlicht.
Für GommeHDnet wurde ein [neuer Fork](https://github.com/gommehdnet/style-guide) begonnen, weil nicht alle Vorschläge des vicuna.io style guides zu 100% auf unseren Anwendungsfall übertragen werden konnten.

## Den Style Guide ausliefern
Nicht alle wollen mit einer Markdown-Datei arbeiten. Besonders nicht-Developer können Markdown selten viel abgewinnen. Von den entsprechenden Stellen wurde verlautbart, dass eine PDF weitaus praktischer wäre.
Und was tut man nicht alles? Alles für den Dackel, alles für den Club. Wir wollen also unseren Style Guide, der in Markdown geschrieben ist in eine PDF umwandeln. Möglichst wollen wir dabei weiterhin versionieren und eine History haben. Klingt nach einem Job für die GitHub Releases, oder nicht?

## Markdown in PDF umwandeln
Für einen so doch trivial klingenden Anwendungsfall gibt es dann doch überraschend wenige Tools. Die Wahl fiel am Ende auf [Pandoc](https://pandoc.org/), aufgrund des einfachen Command Line Interfaces und der zahlreichen unterstützten Format, für den Fall, dass gewisse Stakeholder ihr Meinung mal wieder schneller wechseln, als wir das gerne hätten.

## Markdown am Fließband in PDF umwandeln
Da wir bei GommeHDnet von Natur aus eher gemütliche Entwickler sind wollen wir natürlich nicht den ganzen Tag vor dem Schreibtisch sitzen und unser Terminal mit dem Umwandeln von Markdown Dokumenten in PDFs quälen. Das hat automatisiert zu werden, immerhin schimpfen wir uns Informatiker. Wir brauchen also ein Build Tool für eine einfache CI/CD Pipeline. 
Aufgrund guter Erfahrungen und der Nähe zu GitHub fiel die Wahl auf [Travis CI](https://travis-ci.com/).  

Wir nehmen also eine simple Grund-Einstellung (`.travis.yml`):
```yaml
dist: bionic
language: bash
```

Wir arbeiten mit bash und unsere auf Ubuntu bionic. Pandoc ist natürlich nicht vorinstalliert, wir installieren also die entsprechenden Pakete nach:
```yaml
dist: bionic
language: bash

addons:
  apt:
    update: true
    packages:
      - lmodern
      - texlive-latex-extra
      - texlive-generic-recommended
      - texlive-fonts-recommended
      - pandoc
```

Außer pandoc brauchen wir noch `lmodern` als Schriftart und ein paar Libraries für den von uns verwendeten LaTeX Reader. Fehlt noch das eigentliche Build-Skript:

```yaml
dist: bionic
language: bash

addons:
  apt:
    update: true
    packages:
      - lmodern
      - texlive-latex-extra
      - texlive-generic-recommended
      - texlive-fonts-recommended
      - pandoc

jobs:
  include:
    - script: pandoc -t latex README.md -o style-guide.pdf
```

Dabei verwenden wir den LaTeX Reader und als output definieren wir die `style-guide.pdf`. Fertig ist die Pipeline. Die Style Guide PDF wird automatisch gebaut.

## Vom Fließband raus in die Welt
Nun bringt es uns nicht viel, dass da eine PDF rumliegt, wir müssen damit auch etwas machen. Wir fügen also einen Deployment Schritt hinzu. 

```yaml
dist: bionic
language: bash

addons:
  apt:
    update: true
    packages:
      - lmodern
      - texlive-latex-extra
      - texlive-generic-recommended
      - texlive-fonts-recommended
      - pandoc

jobs:
  include:
    - script: pandoc -t latex README.md -o style-guide.pdf

deploy:
  provider: releases
  file: style-guide.pdf
  skip_cleanup: true
  api_key:
    secure: <encrypted GitHub Token>
  on:
    tags: true
```

Als Provider geben wir die GitHub `releases` an. Das einzige File, das uns interessiert ist die PDF vom Style Guide. Damit die nicht schon vor dem Deployment wieder weggeräumt wird, überspringen wir das clean up. Zum Schluss [fügen wir einen API-Key hinzu](https://github.com/settings/tokens) und stecken ihn mit travis in eine [sichere Variable](https://docs.travis-ci.com/user/encrypting-files/), damit Travis CI an unsere GitHub Releases kommt und sagen dem Deployment, es soll sich zum Teufel scheren, es sei denn, es gibt eine neue getaggte Version.

Fertig!  

Das Ergebnis lässt sich [hier](https://github.com/gommehdnet/style-guide/) bewundern. Die Releases findet ihr [hier](https://github.com/gommehdnet/style-guide/releases).  

Viel Spaß damit!