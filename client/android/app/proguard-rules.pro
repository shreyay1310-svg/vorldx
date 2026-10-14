# Capacitor & Cordova ProGuard rules for R8 shrinking
-keep public class * extends com.getcapacitor.Plugin
-keep public class com.getcapacitor.** { *; }
-keep class * implements com.getcapacitor.BridgeItem { *; }
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}
-keepattributes JavascriptInterface
-keepattributes *Annotation*
-keepattributes Signature
-keepattributes InnerClasses
-dontwarn com.getcapacitor.**
-dontwarn org.apache.cordova.**
-keep class org.apache.cordova.** { *; }
-dontwarn kotlin.**
-dontwarn javax.annotation.**
