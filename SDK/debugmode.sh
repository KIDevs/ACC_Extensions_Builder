#!/bin/bash
if [ -f ~/Library/Preferences/com.adobe.CSXS.4.plist ]; then
	/usr/libexec/PlistBuddy -c "Add:PlayerDebugMode string 1" ~/Library/Preferences/com.adobe.CSXS.4.plist
fi
if [ -f ~/Library/Preferences/com.adobe.CSXS.5.plist ]; then
	/usr/libexec/PlistBuddy -c "Add:PlayerDebugMode string 1" ~/Library/Preferences/com.adobe.CSXS.5.plist
fi
if [ -f ~/Library/Preferences/com.adobe.CSXS.6.plist ]; then
	/usr/libexec/PlistBuddy -c "Add:PlayerDebugMode string 1" ~/Library/Preferences/com.adobe.CSXS.6.plist
fi
if [ -f ~/Library/Preferences/com.adobe.CSXS.7.plist ]; then
	/usr/libexec/PlistBuddy -c "Add:PlayerDebugMode string 1" ~/Library/Preferences/com.adobe.CSXS.7.plist
fi
if [ -f ~/Library/Preferences/com.adobe.CSXS.8.plist ]; then
	/usr/libexec/PlistBuddy -c "Add:PlayerDebugMode string 1" ~/Library/Preferences/com.adobe.CSXS.8.plist
fi
#must kill cfprefsd to take effect
ps -ef | grep "cfprefsd" | awk '{print $2}' | xargs kill
