SignAndPackage
==============

The tool to sign and package a Adobe Extension (zxp file)

How to use this tool:

1. Place the folder containning the extension content in folder SignAndPackage, such as "PhotoshopCS6SamplePanel". Make sure this folder contains the correct CSXS/manifest.xml.
2. With command line too, swich the working directory to "SignAndPackageUse", and use run.bat to create the extension. The first argument is the path to the certificate, the second password is the password of the certificate, and the third argument is the name of folder which contains the extension content. 

Example:

Suppose there is a certificate "cert.p12" in the directory "SignAndPackageUse", the password of the certificate is "password", the command to sign and package PhotoshopCS6SamplePanel would be:

run.bat ./cert.p12 password PhotoshopCS6SamplePanel
