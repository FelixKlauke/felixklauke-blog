---
title: Warum du kein Singleton benutzen solltest
excerpt: Singletons sind eine Lüge und ein böses Relikt vergangener Zeit. Here is why!
date: 2020-03-01 18:00:00
author: Felix Klauke
toc: true
tags: singleton, gang of four, design pattern, Entwurfsmuster, Nachteile Singleton
---

{% img /img/article/singleton.jpg [width] [height] '"Singleton" "Singleton"' %}

# Warum du kein Singleton benutzen solltest
Jeder angehende Entwickler kommt früher oder später an den Punkt, an denen er sich mit Entwurfsmustern auseinandersetzt. Entweder, weil ein anderer Entwickler ihm dazu rät, oder weil er ein Buch liest. Doch nicht alle Enwtwurfsmuster sind ohne Vorbehalte zu genießen. Wir klären, was ein Singleton ist, was seine Vorteile und Nachteile sind und fragen uns nach Sinnhaftigkeit und möglichen Alternativen.

## Der Charakter eines Singletons
Das Singleton-Muster an sich ist sehr simpel und gehört als "creational pattern" zur Gang of four. Es soll sicherstellen, dass es nur eine Instanz einer Klasse gibt. Das kann zum Beispiel so aussehen:
```java
public final class Singleton {
  private static Singleton instance; 
  
  private Singleton() {
  }
  
  public static Singleton instance() {
    if (instance == null) {
      instance = new Singleton();
    }
    return instance;
  }
}
```

## Vorteile eines Singletons
Singletons werden gerne genutzt, um weitere Instanziierungen zu verhindern. Als alternative zu einfach global sichtbaren Variablen lässt sich mit dem Singleton außerdem eine gewisse Zugriffskontrolle sicherstellen. Die Erzeugung nach Bedarf ("lazy") kann außerdem Performance einsparen. 
Außerdem werden Singletons gerne benutzt, wenn eine Implementierung erst zur Laufzeit fest steht und man diese Logik kapseln möchte. Im Endeffekt ist ein Singleton eine einfache Möglichkeit, einen globalen State zu verwalten. Aber ist das gut?

## Nachteile eines Singletons
Bei der Entwicklung mit Singletons fällt sofort auf: Das ist fast unmöglich testbar! Es bedarf [PowerMock](https://github.com/powermock/powermock) oder ähnlichen Tools, um Singletons, oder Code der von ihnen abhängt testbar zu machen. Singletons sind nämlich äußerst intransparent und verbergen eventuell Abhängigkeiten. Sie führen zu einer engen Kopplung zwischen Komponenten und provozieren häufig weitere Singletons. Das Singleton, so wie es oben gezeigt wurde, ist außerdem nicht synchronisiert und es bedarf einigen mehr Zeilen, um dies umzusetzen. Sie verletzen das Single Repsonsibility Principle und die von manchen geliebte Zugangskontrolle stellt sich sehr schnell auch als Flaschenhals heraus.

## Fazit 
Insgesamt lässt sich sagen, dass Singletons eigentlich eher ein Anti-Pattern sind. Wenngleich sie schnell entwickelt sind und in einer sehr kleinen Codebase sehr effizient sein können, führen sie auf Dauer zu schlechtem Stil, untestbarem Code und bösen Überraschungen. 
Singletons sind dahingehend eigentlich ein Überbleibsel aus prozeduralem Code und haben mit Objektorientierung eigentlich nicht allzuviel zu tun. Singletons werden gerne oft weiter ineinander verschachtelt, wodurch zum Beispiel solche Code Schnipsel entstehen:

```java
Application.getInstance().getModuleManager().getModule("myModule")
```

Sie laden geradeso dazu ein, das [Gesetz von Demeter](https://de.wikipedia.org/wiki/Gesetz_von_Demeter) zu brechen und sind schlussendlich schlechter Stil und sollten vermieden werden. 

## Alternativen
Die eigentlich einzig wahre Alternative zu Singletons ist die [Dependency Injection](https://en.wikipedia.org/wiki/Dependency_injection). Wenn ihr euch selbst einen Gefallen tun wollt, dann verabschiedet euch noch heute von Singletons und nutzt Dependency Injection. Für Java gibt es Tools wie [Guice](https://github.com/google/guice), die das sehr einfach und elegant ermöglichen.  
Ich hoffe ich konnte einige Sünder bekehren, cheers!