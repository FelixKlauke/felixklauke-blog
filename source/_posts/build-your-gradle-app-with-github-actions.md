---
title: Gradle Projekt mit GitHub Actions bauen
excerpt: Für Build Tools wie Gradle steht eine Vielzahl von CIs zur Verfügung - Der Ansatz mittels GitHub Actions.
author: Felix Klauke
toc: true
date: 2019-12-17
---

# Gradle Projekt mit GitHub Actions bauen

Im folgenden betrachten wir, wie man sein Gradle Projekt mit den Workflows der GitHub Actions bauen könnte.

## GitHub Actions

Seit [GitHub von Microsoft gekauft wurde](https://www.heise.de/newsticker/meldung/Microsoft-kauft-GitHub-fuer-7-5-Milliarden-US-Dollar-4067633.html) merkt man vor allem eines: Die haben jetzt Asche! Entsprechend werden die Features am Fließband produziert. Eines der neuesten Features, frisch aus der Beta, sind die [GitHub Actions](https://github.com/features/actions). 

Man kann seine eigenen Actions nutzen, oder die bereits von GitHub bereitgestellten. Am Ende ergibt sich eine vollständige CI Pipeline ("Workflow"), die man so oder ähnlich zum Beispiel von [Google Cloud Build](https://cloud.google.com/cloud-build/?hl=de) kennt.

## Build Script

Wir bauen nun Schritt für Schritt ein Build Script zusammen, das am Ende `./gradlew build` ausführt.

Im ersten Schritt geben wir die wichtigsten Meta-Informationen, nämlich wie unser Workflow heißt und wann er denn ausgeführt werden soll:

```yaml
name: Build Gradle

on:
  - push
  - pull_request
```

Als zweites ergänzen wir die eigentlichen Aktionen, die in unserem Workflow ausgeführt werden sollen:

```yaml
jobs:
  build:
    strategy:
      matrix:
        java-version: [ '11' ]
        os: [ 'windows-latest', 'ubuntu-latest', 'macos-latest' ]
    runs-on: ${{ matrix.os }}
    steps:
      - name: Checkout Source Code
        uses: actions/checkout@v1
      - name: Setup Java ${{ matrix.java-version }}
        uses: actions/setup-java@v1
        with:
          java-version: ${{ matrix.java-version }}
          architecture: x64
      - name: Build with gradle
        run: ./gradlew build
```

Wenn man sich den Unterpunkt `steps` ansieht, so lassen sich drei Punkte identifierzieren:
1. Checkout
2. Setup
3. Build

### Checkout

Zuerst müssen wir den Code unseres Repositories in unseren Workspace bekommen, um dann damit weiter zu arbeiten. 

### Setup

Wir haben momentan noch ein cleanes OS und müssen Java nachinstallieren. 

### Build

Wir führen statt einer speziellen action einfach ein entsprechendes Kommando aus. Alternativ können hier Actions genutzt werden, die sich darum kümmern, dass der Gradle Wrapper genutzt wird, oder dass eine andere version benutzt wird.

## Zusammenfassung
Wenn wir das Build Script nochmal zusammenfassen, sieht es so aus:

```yaml
name: Build Gradle

on:
  - push
  - pull_request

jobs:
  build:
    strategy:
      matrix:
        java-version: [ '11' ]
        os: [ 'windows-latest', 'ubuntu-latest', 'macos-latest' ]
    runs-on: ${{ matrix.os }}
    steps:
      - name: Checkout Source Code
        uses: actions/checkout@v1
      - name: Setup Java ${{ matrix.java-version }}
        uses: actions/setup-java@v1
        with:
          java-version: ${{ matrix.java-version }}
          architecture: x64
      - name: Build with gradle
        run: ./gradlew build
```

Es wird einfach unter `.github/workflows/gradle.yml` abgelegt und fertig!

Mit diesem simplen Script könnt ihr euer Lieblings Projekt ab sofort bauen. Später werden wir uns damit beschäftigen, wie wir auch kompliziertere Aufgaben ausführen. Dazu gehören zum Beispiel Unit-Tests oder statische Code-Vermessungen.  

Bis dahin viel Spaß mit eurer ersten GitHub Action!
