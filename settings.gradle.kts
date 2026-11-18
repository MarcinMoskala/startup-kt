rootProject.name = "startup-kt"

pluginManagement {
    repositories { gradlePluginPortal(); mavenCentral(); google() }
}
dependencyResolutionManagement {
    repositories { mavenCentral(); google() }
}

include(":core", ":cli", ":app")
