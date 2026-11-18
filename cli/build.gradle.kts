plugins {
    kotlin("jvm")
    kotlin("plugin.serialization")
    application
}

dependencies {
    implementation(project(":core"))
    testImplementation(kotlin("test"))
}

application {
    mainClass.set("startupkt.cli.MainKt")
    applicationName = "startup"
}

tasks.test { useJUnitPlatform() }
