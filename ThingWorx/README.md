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
This will just be a brief introduction to the entities in the project since it should be rather easy to look trough the project and see how it is working and connected. 
Everything used in Thingworx could be found in the mockup project. In advance sorry for the nameing of the projects, Things etc. it is unfortunately impossible to change names after they are made in Thingworx.

There is one main thing corresponding to the robotic arm called MQTT_Duplicate. The Thing uses the MQTT Extension found on the [PTC Marketplace](https://marketplace.ptc.com/apps/193516/mq-telemetry-transport-mqtt#!overview). The configuration of connection to the broker is done in the Configuration tab, here is also the subscriptions/ publishing to different topics found. The current topics used are Data (raw sensor data from the robotic arm), Stress (Stress calculation from the simulation), Damage (calculated damage, runtime and cost from the python script) and Program (specifying which program the robotic arm should run). The conversion from the data received (JSON format) to the correct properties are done in the Subscriptions tab (one for each topic received). All of the properties found in the Properties and Alerts tab are corresponding to data received from the sensors, iPad app or the simulation done (Python scripts) except for this properties which are hardcoded: ipAddress, location, Location, serialNumber and status. These properties must therefore be changed if the physical arm is moved away from the office in Sandvika.

There is 3 mashups used to show the data these are, mockup_v3 (The home/ main mashup), mockup_popup_v4 (data from one specific arm) and mockup_popup_live_data (live sensor data with gauges). The mashups should be rather self-explanatory with all the links/ connections. There should be noted that there are some custom CSS both for the maps and the size and look of the webapp. 


<a name="of3"></a>
## Challenges and Improvements
There is a problem when using both the custom gauges (Progress bar widget) and Label chart in the same mashup (even with a popup) due to the fact that auto refresh needs to be 1 second or higher for the chart to be working properly. If the popup with live data (gauges) is not updating properly (in other words if it stutters) must the TargetWindow found in navigation-54 be changed to something other than Modal Popup.

The autoscaling of the charts are not working properly, and are not filling out the available space. 

The charts are sometimes very slow or contains wrong data. This can be fixed by going into the Thing that send the data and deleting (flush database) all or some of the data in the valuestream. This is done in Services -> PurgeAllPropertyHistory or PurgePropertyHistory.

The pages are not responsive since the Thingworx version used is 8.3. Responsive pages are implemented in 8.4 and newer but implementing responsive design would need a complete redesign of the mashups to make it work. 
