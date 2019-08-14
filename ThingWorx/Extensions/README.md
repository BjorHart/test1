# ThingWorx Extensions 

## Google Maps Custom Extension also needs the following CSS implemented in ThingWorx Mashup:
```CSS
a[href^="http://maps.google.com/maps"]{display:none !important}
a[href^="https://maps.google.com/maps"]{display:none !important}

.gmnoprint a, .gmnoprint span, .gm-style-cc {
    display:none;
}
.gmnoprint div {
    background:none !important;
}
```

Under PlatformSubsystem -> Configuration -> Required string to connect with Google for Google widgets

Add this: https://maps.googleapis.com/maps/api/js?key=AIzaSyDe6aXSu7syzUXH3ueUG2SwVhRfNijhBPw