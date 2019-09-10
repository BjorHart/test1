# Intro
This folder contains documentation for the Thingworx platform, from custom made extensions to which settings need to be modified to make it work.
This folder contains four subfolders;
1. *Extensions* - All the extensions used both custom made and existing extensions.
2. *Mashups* - .xml files for the mashup
3. *Projects* - .xml files for entire projects
4. *Things* - .xml files for things
## List of topics
1. [*Set Up*](#of1)
2. [*Documentation*](#of2)
3. [*Challenges and Improvements*](#of3)


<a name="of1"></a>
## Set Up

#### ThingWorx Extensions 
The Thingworx extensions are simply imported as a normal extension on the Thingworx platform. It is also possible to further modify the extensions by downloading them and modify the Javascript code, then zip the code and upload it to Thingworx again (but delete the previous extension first). 
The Google Maps Custom Extension also needs the following CSS implemented in ThingWorx Mashup to look as intended:
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
To make the extension work must an API-key be connected to the Thingworx platform, this can be done under *PlatformSubsystem -> Configuration -> Required string to connect with Google for Google widgets* copy and paste this: https://maps.googleapis.com/maps/api/js?key=AIzaSyDe6aXSu7syzUXH3ueUG2SwVhRfNijhBPw

Regarding adding a new robotic arm is it just to duplicate the MQTT_Duplicate Thing and then modify it to correspond to the new robotic arm.  Create a new valuestream for the robotic arm. Then you duplicate the mockup_popup_v4 and connect everything to the new Thing. 
<a name="of2"></a>
## Documentation

Documentation about the Mashups, Things etc. Add something about how the data is received in the Things and mapped onto properties. Clarify which properties that are real data and which ones that are hardcoded. Explain the MQTT configuration briefly. Add some short details about the mashup.
More documentation needed here (Paal?)
Also need to clean up on Thingworx and put everything into a project. 

<a name="of3"></a>
## Challenges and Improvements
There is a problem when using both the custom gauges (Progress bar widget) and Label chart in the same mashup (even with a popup) due to the fact that auto refresh needs to be 1 second or higher for the chart to be working properly.

The autoscaling of the charts are not working properly, and are not filling out the available space. 

The charts are sometimes very slow or contains wrong data. This can be fixed by going into the Thing that send the data and deleting (flush database) all or some of the data in the valuestream. This is done in Services -> PurgeAllPropertyHistory or PurgePropertyHistory.

Probably more challenges we could add here.