@echo off
reg query HKEY_CURRENT_USER\Software\Adobe\CSXS.4 /v PlayerDebugMode
if %errorlevel%==1 GOTO INSTALL4
GOTO NEXT4
:INSTALL4
reg add HKEY_CURRENT_USER\Software\Adobe\CSXS.4 /v PlayerDebugMode /t REG_SZ /d 1
:NEXT4
reg query HKEY_CURRENT_USER\Software\Adobe\CSXS.5 /v PlayerDebugMode
if %errorlevel%==1 GOTO INSTALL5
GOTO NEXT5
:INSTALL5
reg add HKEY_CURRENT_USER\Software\Adobe\CSXS.5 /v PlayerDebugMode /t REG_SZ /d 1
:NEXT5
reg query HKEY_CURRENT_USER\Software\Adobe\CSXS.6 /v PlayerDebugMode
if %errorlevel%==1 GOTO INSTALL6
GOTO NEXT6
:INSTALL6
reg add HKEY_CURRENT_USER\Software\Adobe\CSXS.6 /v PlayerDebugMode /t REG_SZ /d 1
:NEXT6
reg query HKEY_CURRENT_USER\Software\Adobe\CSXS.7/v PlayerDebugMode
if %errorlevel%==1 GOTO INSTALL7
GOTO NEXT7
:INSTALL7
reg add HKEY_CURRENT_USER\Software\Adobe\CSXS.7 /v PlayerDebugMode /t REG_SZ /d 1
:NEXT7
reg query HKEY_CURRENT_USER\Software\Adobe\CSXS.8 /v PlayerDebugMode
if %errorlevel%==1 GOTO INSTALL8
GOTO NEXT8
:INSTALL8
reg add HKEY_CURRENT_USER\Software\Adobe\CSXS.8 /v PlayerDebugMode /t REG_SZ /d 1
:NEXT8