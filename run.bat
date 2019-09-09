rem note: This file should be run on the Virtual Machine in order to start the Vuforia Experience Server and Twin Runtime

@echo off
    start "Vuforia Experience Server" \B "C:\ptc\studio-es\bin\start-es.exe" rem dobbelsjekk denne
    "C:\Program Files (x86)\Microsoft Visual Studio\Shared\Python37_64\python.exe" 
@echo on