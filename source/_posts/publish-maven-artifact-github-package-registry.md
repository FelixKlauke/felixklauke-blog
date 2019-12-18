---
title: Via Gradle ein Maven Artefakt in die GitHub Package Registry ausliefern
excerpt: Zur statischen Vermessung von Code gibt es Vielzahl von Metriken. Vor allem wenn es um Formatierung geht ist Checkstyle das Tool der Wahl. 
author: Felix Klauke
toc: true
---

# Via Gradle ein Maven Artefakt in die GitHub Package Registry ausliefern

Im folgenden werde ich demonstrieren, wie ihr ein mit Gradle gebautes Maven Artefakt in der GitHub Package Registry veröffentlicht. Zum Bauen wird in unserem Fall Travis CI verwendet.

## Warum die GitHub Package Registry?

Es ist eine berechtigte Frage, wieso man seine Artefakte ausgerechnet in der GitHub Package Registry veröffentlichen sollte. Viele Leute haben ihre eigene, viel flexiblere Registry. 

### Verfügbarkeit

GitHub garantiert eine gewisse Verfügbarkeit eurer Registry. Fast jeder Entwickler kennt den Schmerz, wenn man sein Projekt nicht bauen kann, weil das Repository von irgendeiner Third-Party-Dependency ausgerechnet heute entschieden hat, seinen Jahresurlaub zu nehmen.

### Einfachheit

Ein Großteil eures Projektes liegt sowieso auf GitHub, wieso nicht alles an einem Ort managen? Durch die Registry hat euer Projekt alles wichtige auf einer Seite übersichtlich zusammengetragen und verfügbar.

### Nachteile

Es wäre heuchlerisch, nicht auch ein paar Nachteile der GitHub Package Registry zu erwähnen:
1. Es ist nicht ohne den Support möglich, Artefakte (aus öffentlichen Registries) zu löschen
2. Ihr könnt nach Veröffentlichung nichts mehr editieren
3. Ihr könnt Snapshots und releases nicht wirklich trennen

## Gradle Publishing

Gradle veröffentlicht Maven Artefakte mit dem `maven-publish` Plugin. Dieses müsst ihr zuerst einbinden:

```groovy
allprojects {
  apply plugin: 'maven-publish'
}
```

Als nächstes müssen wir die Publication und das Remote Repository angeben. Als Beispiel hier die Konfiguration meines Projektes [angelina](https://github.com/FelixKlauke/angelina):

```groovy
allprojects {
  publishing {
    repositories {
      maven {
        name = "GitHubPackages"
        url = uri("https://maven.pkg.github.com/FelixKlauke/angelina")
        credentials {
          username = project.findProperty("gpr.user") ?: System.getenv("GITHUB_PACKAGE_REGISTRY_USER")
          password = project.findProperty("gpr.key") ?: System.getenv("GITHUB_PACKAGE_REGISTRY_API_KEY")
        }
      }
    }
    publications {
      gpr(MavenPublication) {
        from(components.java)
      }
    }
  }
}
```

Wie man sieht werden die Zugangsdaten aus den properties oder aus dem Environment geladen. Damit diese auch einem CI Server verfügbar sind müsssen wir entsprechend diese Environment Variables anlegen.

1. Ihr erstellt einen [Personal Access Token](https://github.com/settings/tokens)
2. Der Access Token wird entweder per Webinterface hinterlegt oder direkt im Build file via `travis encrypt GITHUB_PACKAGE_REGISTRY_API_KEY=<Token> --pro``` eingepflegt.

Als letztes passt ihr noch eure .travis.yml wie folgt an:

```yaml
##################
### Deployment ###
##################
deploy:
  provider: script
  script: ./gradlew publish
  on:
    tags: true
```

Diese Konfiguration würde alle getaggten Versionen bauen. Durchs Entfernen des `on`-Teils würden alle Versionen deployed.

Das wars! Und nun viel Spaß beim Nutzen der GitHub Package Registry.