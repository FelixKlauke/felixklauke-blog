---
title: Checkstyle mit Gradle verwenden
excerpt: Zur statischen Vermessung von Code gibt es Vielzahl von Metriken. Vor allem wenn es um Formatierung geht ist Checkstyle das Tool der Wahl. 
author: Felix Klauke
---

# Checkstyle mit Gradle verwenden

Im folgenden werde ich darauf eingehen, wozu Code Metriken gut sind, was Checkstyle dabei für uns leisten kann und was man dafür tun muss, dass es das tut.

## Gradle

Gradle kommt als starke Alternative zu Gradle in einer Vielzahl von Projekten zum Einsatz. Es glänzt gerade dann, wenn man den Buil Prozess genau an seine Bedürfnisse anpassen will, wie es hier der Fall ist.

## Metriken
Ein ganz wesentlicher Bestandteil der Vermessung von Source Code ist die Erhebung von Metriken. Durch sie können wir mehr über die Beschaffenheit unseres Source Code erfahren und garantieren, dass wir uns an unsere Standard halten.

## Checkstyle

[Checkstyle](https://checkstyle.sourceforge.io/) ist ein Tool, mit dem man Java Source Code hinsichtlich der Einhaltung von definieren Standards überprüfen kann. Besonders, wenn man einen besimmten Code Style forcieren will kommt Checkstyle zum Einsatz und kann lückenlos in den Build-Prozess integriert werden.   

Dazu wird Checkstyle mit einer Konfigurationsdatei gespeist, die definiert, wie unser Source Code auszusehen hat. Prominente Code Styles sind zum Beispiel der Stil von [Google](https://github.com/checkstyle/checkstyle/blob/master/src/main/resources/google_checks.xml) oder auch der von [Sun](https://github.com/checkstyle/checkstyle/blob/master/src/main/resources/sun_checks.xml).

Während die Stile von Google und Sun bereits mit Checkstyle ausgeliefert werden, kann und sollte man in vielen Fällen eine eigene Config bereitstellen, denn meistens wird man kleine Anpassung vornehmen müssen, vor allem wenn man mit Editorconfig arbeitet.

Eine eigene Konfiguration kann problemlos unter `config/checkstyle/checkstyle.xml` abgelegt werden. Ein Beispiel dafür befindet sich in meinem Projekt [angelina](https://github.com/FelixKlauke/angelina/blob/dev/config/checkstyle/checkstyle.xml).

## Konfiguration

Zuerst müsst ihr das Checkstyle gradle Plugin einbinden:
```groovy
allprojects {
  apply plugin: 'checkstyle'
}
```

Bei der Konfiguration ist es sehr wichtig, zu beachten, dass ihr eine aktuelle Tool Version nutzt, denn die eingebaute default version ist in der Regel uhralt und wird nicht mit eurem aktuellen Regelsatz kompatibel sein.

```groovy
allprojects {
  checkstyle {
    maxWarnings = 0
    ignoreFailures = false
    toolVersion '8.27'
    checkstyleTest.enabled = false
  }
}
```

Nun ist alles bereit um eure Builds fehlschlagen zu lassen, wenn ihr auch nur ein Leerzeichen zu viel habt, herzlichen Glückwunsch. Bei Fragen und Problemen könnt ihr mich immer gerne kontaktieren.