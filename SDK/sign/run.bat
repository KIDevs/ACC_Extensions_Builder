set /p folder=Folder With Ext Files:
set /p zxpName=Desired ZXPName:
set /p keystorefile=FileName of keystore:
set /p keypass=Keystore Password:


java -jar ./ucf.jar -package -storetype  PKCS12  -keystore  %keystorefile% -storepass %keypass% -tsa http://time.certum.pl/ %zxpName%.zxp  -C  %folder% .
 
pause